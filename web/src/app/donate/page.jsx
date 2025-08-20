import { useState, useEffect } from "react";
import {
  Heart,
  Shield,
  Users,
  CreditCard,
  ArrowLeft,
  Globe,
} from "lucide-react";
import useUser from "@/utils/useUser";

const CURRENCIES = {
  USD: { symbol: "$", name: "US Dollar", flag: "🇺🇸", gateway: "stripe" },
  EUR: { symbol: "€", name: "Euro", flag: "🇪🇺", gateway: "stripe" },
  GBP: { symbol: "£", name: "British Pound", flag: "🇬🇧", gateway: "stripe" },
  NGN: { symbol: "₦", name: "Nigerian Naira", flag: "🇳🇬", gateway: "paystack" },
  KES: {
    symbol: "KSh",
    name: "Kenyan Shilling",
    flag: "🇰🇪",
    gateway: "flutterwave",
  },
  GHS: {
    symbol: "₵",
    name: "Ghanaian Cedi",
    flag: "🇬🇭",
    gateway: "flutterwave",
  },
  ZAR: {
    symbol: "R",
    name: "South African Rand",
    flag: "🇿🇦",
    gateway: "flutterwave",
  },
  CAD: { symbol: "C$", name: "Canadian Dollar", flag: "🇨🇦", gateway: "stripe" },
  AUD: {
    symbol: "A$",
    name: "Australian Dollar",
    flag: "🇦🇺",
    gateway: "stripe",
  },
};

function MainComponent() {
  const { data: user, loading } = useUser();
  const [selectedCurrency, setSelectedCurrency] = useState("USD");
  const [amount, setAmount] = useState("");
  const [customAmount, setCustomAmount] = useState("");
  const [donorName, setDonorName] = useState("");
  const [donorEmail, setDonorEmail] = useState("");
  const [message, setMessage] = useState("");
  const [isAnonymous, setIsAnonymous] = useState(false);
  const [processing, setProcessing] = useState(false);
  const [error, setError] = useState(null);
  const [userLocation, setUserLocation] = useState(null);

  // Currency-specific preset amounts
  const getPresetAmounts = (currency) => {
    switch (currency) {
      case "USD":
      case "EUR":
      case "GBP":
      case "CAD":
      case "AUD":
        return [10, 25, 50, 100, 250, 500];
      case "NGN":
        return [1000, 2500, 5000, 10000, 25000, 50000];
      case "KES":
        return [100, 500, 1000, 2500, 5000, 10000];
      case "GHS":
        return [10, 25, 50, 100, 250, 500];
      case "ZAR":
        return [50, 100, 250, 500, 1000, 2500];
      default:
        return [10, 25, 50, 100, 250, 500];
    }
  };

  const predefinedAmounts = getPresetAmounts(selectedCurrency);

  useEffect(() => {
    // Detect user location and set appropriate currency
    const detectLocationAndCurrency = async () => {
      try {
        const response = await fetch("/api/location/detect");
        if (response.ok) {
          const data = await response.json();
          setUserLocation(data.detected_location);

          // Set currency based on country
          const countryToCurrency = {
            NG: "NGN",
            KE: "KES",
            GH: "GHS",
            ZA: "ZAR",
            GB: "GBP",
            CA: "CAD",
            AU: "AUD",
            US: "USD",
          };

          const detectedCurrency =
            countryToCurrency[data.detected_location?.country_code] || "USD";
          setSelectedCurrency(detectedCurrency);
        }
      } catch (error) {
        console.error("Location detection failed:", error);
        setSelectedCurrency("USD"); // Default to USD
      }
    };

    detectLocationAndCurrency();
  }, []);

  useEffect(() => {
    if (user) {
      setDonorEmail(user.email || "");
      setDonorName(user.name || "");
    }
  }, [user]);

  const handleAmountSelect = (selectedAmount) => {
    setAmount(selectedAmount.toString());
    setCustomAmount("");
    setError(null);
  };

  const handleCustomAmount = (value) => {
    setCustomAmount(value);
    setAmount("");
    setError(null);
  };

  const handleCurrencyChange = (e) => {
    const currency = e.target.value;
    setSelectedCurrency(currency);
    setAmount("");
    setCustomAmount("");
  };

  const handleDonate = async () => {
    const donationAmount = customAmount || amount;
    const currencyInfo = CURRENCIES[selectedCurrency];
    const minAmount =
      selectedCurrency === "NGN"
        ? 100
        : selectedCurrency === "KES"
          ? 10
          : selectedCurrency === "GHS"
            ? 1
            : 1;

    if (
      !donationAmount ||
      isNaN(donationAmount) ||
      parseFloat(donationAmount) < minAmount
    ) {
      setError(
        `Please enter a valid amount (minimum ${currencyInfo.symbol}${minAmount})`,
      );
      return;
    }

    if (!donorEmail || !donorEmail.includes("@")) {
      setError("Please enter a valid email address");
      return;
    }

    if (!isAnonymous && !donorName.trim()) {
      setError("Please enter your name or choose to donate anonymously");
      return;
    }

    setProcessing(true);
    setError(null);

    try {
      // Create donation record
      const donationResponse = await fetch("/api/donations", {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify({
          amount: Math.round(parseFloat(donationAmount) * 100), // Convert to cents
          currency: selectedCurrency,
          donor_name: isAnonymous ? null : donorName.trim(),
          donor_email: donorEmail,
          message: message.trim(),
          is_anonymous: isAnonymous,
          donor_country_code: userLocation?.country_code || "US",
        }),
      });

      if (!donationResponse.ok) {
        const errorData = await donationResponse.json();
        throw new Error(errorData.error || "Failed to process donation");
      }

      const donation = await donationResponse.json();
      const gateway = currencyInfo.gateway;

      // Process payment based on gateway
      if (gateway === "paystack" && selectedCurrency === "NGN") {
        await processPaystackPayment(donation, donationAmount);
      } else if (gateway === "flutterwave") {
        await processFlutterwavePayment(donation, donationAmount);
      } else {
        await processStripePayment(donation, donationAmount);
      }
    } catch (err) {
      console.error("Donation error:", err);
      setError(err.message);
      setProcessing(false);
    }
  };

  const processPaystackPayment = async (donation, amount) => {
    if (typeof window.PaystackPop !== "undefined") {
      const handler = window.PaystackPop.setup({
        key: process.env.NEXT_PUBLIC_PAYSTACK_PUBLIC_KEY || "pk_test_***", // Replace with your key
        email: donorEmail,
        amount: parseFloat(amount) * 100, // Paystack uses kobo
        currency: selectedCurrency,
        ref: `claeva_${donation.id}_${Date.now()}`,
        callback: async function (response) {
          if (response.status === "success") {
            try {
              await fetch(`/api/donations/${donation.id}`, {
                method: "PATCH",
                headers: { "Content-Type": "application/json" },
                body: JSON.stringify({
                  status: "completed",
                  paystack_reference: response.reference,
                  paystack_transaction_id: response.trans,
                }),
              });
              window.location.href = `/donate/success?ref=${response.reference}`;
            } catch (updateError) {
              console.error("Error updating donation:", updateError);
              alert(
                "Payment successful, but there was an issue updating our records. Please contact support@securedlisteningroom.com",
              );
            }
          } else {
            setError("Payment was not successful. Please try again.");
            setProcessing(false);
          }
        },
        onClose: function () {
          setProcessing(false);
        },
      });
      handler.openIframe();
    } else {
      throw new Error(
        "Paystack payment system is not available. Please try again later.",
      );
    }
  };

  const processFlutterwavePayment = async (donation, amount) => {
    if (typeof window.FlutterwaveCheckout !== "undefined") {
      window.FlutterwaveCheckout({
        public_key:
          process.env.NEXT_PUBLIC_FLUTTERWAVE_PUBLIC_KEY || "FLWPUBK-***", // Replace with your key
        tx_ref: `claeva_${donation.id}_${Date.now()}`,
        amount: parseFloat(amount),
        currency: selectedCurrency,
        payment_options:
          "card,banktransfer,ussd,mobilemoneyghana,mobilemoneyfranco,mobilemoneyuganda,mobilemoneyrwanda,mobilemoneyzambia,qr,mpesa,mobilemoneykenya,mobilemoneytanzania,barter,nqr,credit",
        customer: {
          email: donorEmail,
          name: isAnonymous ? "Anonymous Donor" : donorName,
        },
        customizations: {
          title: "Support ListeningRoom",
          description: `Donation to support global mental health conversations${
            message ? ": " + message.substring(0, 50) : ""
          }`,
          logo: "https://ucarecdn.com/e602d80d-2f3e-4bce-b13a-78b9e1ed90fa/-/format/auto/",
        },
        callback: async function (data) {
          if (data.status === "successful") {
            try {
              await fetch(`/api/donations/${donation.id}`, {
                method: "PATCH",
                headers: { "Content-Type": "application/json" },
                body: JSON.stringify({
                  status: "completed",
                  flutterwave_tx_ref: data.tx_ref,
                  flutterwave_transaction_id: data.transaction_id,
                }),
              });
              window.location.href = `/donate/success?tx_ref=${data.tx_ref}`;
            } catch (updateError) {
              console.error("Error updating donation:", updateError);
              alert(
                "Payment successful, but there was an issue updating our records. Please contact support@securedlisteningroom.com",
              );
            }
          } else {
            setError("Payment was not successful. Please try again.");
            setProcessing(false);
          }
        },
        onclose: function () {
          setProcessing(false);
        },
      });
    } else {
      throw new Error(
        "Flutterwave payment system is not available. Please try again later.",
      );
    }
  };

  const processStripePayment = async (donation, amount) => {
    try {
      // Create Stripe checkout session
      const response = await fetch("/api/stripe/create-checkout-session", {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify({
          donationId: donation.id,
          amount: Math.round(parseFloat(amount) * 100), // Convert to cents
          currency: selectedCurrency,
          donorEmail: donorEmail,
          donorName: isAnonymous ? "Anonymous Donor" : donorName,
          message: message.trim(),
        }),
      });

      if (!response.ok) {
        const errorData = await response.json();
        throw new Error(errorData.error || "Failed to create checkout session");
      }

      const { sessionId } = await response.json();

      // Redirect to Stripe Checkout
      const stripe = window.Stripe(
        process.env.NEXT_PUBLIC_STRIPE_PUBLISHABLE_KEY ||
          "pk_test_51RtwmrGqwCaJLznLSsTljF2YCoC5sOxRlYjbzZpFQgXVc6zePXYJx73TmeTcK2diRUD7jsJgrFA7vZyAsmZOGNmX00YpjDy0R0",
      );
      const { error } = await stripe.redirectToCheckout({
        sessionId: sessionId,
      });

      if (error) {
        throw new Error(error.message);
      }
    } catch (err) {
      console.error("Stripe payment error:", err);
      setError(err.message || "Failed to process Stripe payment");
      setProcessing(false);
    }
  };

  const currencyInfo = CURRENCIES[selectedCurrency];

  return (
    <div className="min-h-screen bg-gradient-to-br from-teal-50 to-emerald-50">
      {/* Load Payment Scripts */}
      <script src="https://js.stripe.com/v3/"></script>
      <script src="https://js.paystack.co/v1/inline.js"></script>
      <script src="https://checkout.flutterwave.com/v3.js"></script>

      {/* Header */}
      <header className="bg-white/80 backdrop-blur-sm border-b border-teal-100">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="flex justify-between items-center py-4">
            <div className="flex items-center">
              <img
                src="https://ucarecdn.com/dc54868d-20c4-46fa-b583-6f27b18e95b5/-/format/auto/"
                alt="ListeningRoom Logo"
                className="h-10 object-contain"
              />
            </div>
            <a
              href="/"
              className="flex items-center space-x-2 text-teal-600 hover:text-teal-700 font-medium"
            >
              <ArrowLeft className="w-4 h-4" />
              <span>Back to Home</span>
            </a>
          </div>
        </div>
      </header>

      <div className="py-12 px-4 sm:px-6 lg:px-8">
        <div className="max-w-4xl mx-auto">
          {/* Hero Section */}
          <div className="text-center mb-12">
            <img
              src="https://ucarecdn.com/dc54868d-20c4-46fa-b583-6f27b18e95b5/-/format/auto/"
              alt="ListeningRoom Logo"
              className="h-20 object-contain mx-auto mb-6"
            />
            <h1 className="text-4xl font-bold text-gray-900 mb-4">
              Support Global Mental Health Conversations
            </h1>
            <p className="text-xl text-gray-600 max-w-2xl mx-auto">
              Your donation helps provide free, anonymous mental health support
              to those who need it most. Every contribution makes a difference.
            </p>
          </div>

          <div className="grid lg:grid-cols-2 gap-12">
            {/* Donation Form */}
            <div className="bg-white rounded-2xl shadow-xl p-8">
              <h2 className="text-2xl font-semibold text-gray-900 mb-6">
                Make a Donation
              </h2>

              {/* Currency Selection */}
              <div className="mb-6">
                <label
                  htmlFor="currency-select"
                  className="block text-sm font-medium text-gray-700 mb-3"
                >
                  Select Currency
                </label>
                <div className="relative">
                  <select
                    id="currency-select"
                    value={selectedCurrency}
                    onChange={handleCurrencyChange}
                    className="block w-full pl-4 pr-10 py-3 border border-gray-200 rounded-lg bg-white focus:ring-2 focus:ring-teal-500 focus:border-transparent outline-none appearance-none"
                  >
                    {Object.entries(CURRENCIES).map(([code, info]) => (
                      <option key={code} value={code}>
                        {info.flag} {code} - {info.name}
                      </option>
                    ))}
                  </select>
                  <div className="pointer-events-none absolute inset-y-0 right-0 flex items-center px-2 text-gray-700">
                    <Globe className="w-5 h-5" />
                  </div>
                </div>
              </div>

              {/* Amount Selection */}
              <div className="mb-6">
                <label className="block text-sm font-medium text-gray-700 mb-3">
                  Select Amount ({currencyInfo.name})
                </label>
                <div className="grid grid-cols-3 gap-3 mb-4">
                  {predefinedAmounts.map((presetAmount) => (
                    <button
                      key={presetAmount}
                      onClick={() => handleAmountSelect(presetAmount)}
                      className={`p-3 border-2 rounded-lg font-medium transition-colors ${
                        amount === presetAmount.toString()
                          ? "border-teal-600 bg-teal-50 text-teal-700"
                          : "border-gray-200 hover:border-gray-300"
                      }`}
                    >
                      {currencyInfo.symbol}
                      {presetAmount.toLocaleString()}
                    </button>
                  ))}
                </div>

                <div className="relative">
                  <span className="absolute left-3 top-3 text-gray-500">
                    {currencyInfo.symbol}
                  </span>
                  <input
                    type="number"
                    value={customAmount}
                    onChange={(e) => handleCustomAmount(e.target.value)}
                    placeholder="Enter custom amount"
                    className="w-full pl-8 pr-4 py-3 border border-gray-200 rounded-lg focus:ring-2 focus:ring-teal-500 focus:border-transparent outline-none"
                  />
                </div>
              </div>

              {/* Donor Information */}
              <div className="space-y-4 mb-6">
                <div>
                  <label className="flex items-center space-x-3">
                    <input
                      type="checkbox"
                      checked={isAnonymous}
                      onChange={(e) => setIsAnonymous(e.target.checked)}
                      className="w-4 h-4 text-teal-600 border-gray-300 rounded focus:ring-teal-500"
                    />
                    <span className="text-sm font-medium text-gray-700">
                      Donate anonymously
                    </span>
                  </label>
                </div>

                {!isAnonymous && (
                  <div>
                    <label className="block text-sm font-medium text-gray-700 mb-2">
                      Your Name
                    </label>
                    <input
                      type="text"
                      value={donorName}
                      onChange={(e) => setDonorName(e.target.value)}
                      placeholder="Enter your name"
                      className="w-full px-4 py-3 border border-gray-200 rounded-lg focus:ring-2 focus:ring-teal-500 focus:border-transparent outline-none"
                    />
                  </div>
                )}

                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-2">
                    Email Address
                  </label>
                  <input
                    type="email"
                    value={donorEmail}
                    onChange={(e) => setDonorEmail(e.target.value)}
                    placeholder="Enter your email"
                    className="w-full px-4 py-3 border border-gray-200 rounded-lg focus:ring-2 focus:ring-teal-500 focus:border-transparent outline-none"
                  />
                </div>

                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-2">
                    Message (Optional)
                  </label>
                  <textarea
                    value={message}
                    onChange={(e) => setMessage(e.target.value)}
                    placeholder="Leave a message of support..."
                    rows={3}
                    className="w-full px-4 py-3 border border-gray-200 rounded-lg focus:ring-2 focus:ring-teal-500 focus:border-transparent outline-none resize-none"
                  />
                </div>
              </div>

              {error && (
                <div className="mb-6 bg-red-50 border border-red-200 rounded-lg p-3 text-sm text-red-600">
                  {error}
                </div>
              )}

              <button
                onClick={handleDonate}
                disabled={processing || (!amount && !customAmount)}
                className="w-full bg-teal-600 text-white py-4 px-6 rounded-lg font-semibold text-lg hover:bg-teal-700 focus:ring-2 focus:ring-teal-500 focus:ring-offset-2 disabled:opacity-50 disabled:cursor-not-allowed transition-colors flex items-center justify-center"
              >
                {processing ? (
                  "Processing..."
                ) : (
                  <>
                    <CreditCard className="w-5 h-5 mr-2" />
                    Donate {currencyInfo.symbol}
                    {(customAmount || amount || 0).toLocaleString()}
                  </>
                )}
              </button>

              <p className="text-xs text-gray-500 mt-3 text-center">
                Secured by{" "}
                {currencyInfo.gateway === "paystack"
                  ? "Paystack"
                  : currencyInfo.gateway === "flutterwave"
                    ? "Flutterwave"
                    : "Stripe"}
                . Your payment information is encrypted and protected.
              </p>
            </div>

            {/* Impact Information */}
            <div className="space-y-8">
              <div className="bg-white rounded-2xl shadow-xl p-8">
                <h3 className="text-xl font-semibold text-gray-900 mb-4">
                  Your Impact
                </h3>
                <div className="space-y-4">
                  <div className="flex items-start space-x-3">
                    <div className="w-8 h-8 bg-teal-100 rounded-full flex items-center justify-center flex-shrink-0">
                      <Users className="w-4 h-4 text-teal-600" />
                    </div>
                    <div>
                      <h4 className="font-medium text-gray-900">
                        {currencyInfo.symbol}
                        {selectedCurrency === "NGN"
                          ? "1,000"
                          : selectedCurrency === "KES"
                            ? "100"
                            : "10"}
                      </h4>
                      <p className="text-sm text-gray-600">
                        Supports 2 hours of volunteer training
                      </p>
                    </div>
                  </div>
                  <div className="flex items-start space-x-3">
                    <div className="w-8 h-8 bg-orange-100 rounded-full flex items-center justify-center flex-shrink-0">
                      <Heart className="w-4 h-4 text-orange-600" />
                    </div>
                    <div>
                      <h4 className="font-medium text-gray-900">
                        {currencyInfo.symbol}
                        {selectedCurrency === "NGN"
                          ? "5,000"
                          : selectedCurrency === "KES"
                            ? "500"
                            : "50"}
                      </h4>
                      <p className="text-sm text-gray-600">
                        Funds platform operations for 1 week
                      </p>
                    </div>
                  </div>
                  <div className="flex items-start space-x-3">
                    <div className="w-8 h-8 bg-purple-100 rounded-full flex items-center justify-center flex-shrink-0">
                      <Shield className="w-4 h-4 text-purple-600" />
                    </div>
                    <div>
                      <h4 className="font-medium text-gray-900">
                        {currencyInfo.symbol}
                        {selectedCurrency === "NGN"
                          ? "25,000"
                          : selectedCurrency === "KES"
                            ? "2,500"
                            : "250"}
                      </h4>
                      <p className="text-sm text-gray-600">
                        Covers security and privacy infrastructure for 1 month
                      </p>
                    </div>
                  </div>
                </div>
              </div>

              <div className="bg-gradient-to-br from-teal-600 to-emerald-600 rounded-2xl shadow-xl p-8 text-white">
                <h3 className="text-xl font-semibold mb-4">
                  Why We Need Your Support
                </h3>
                <ul className="space-y-3 text-teal-50">
                  <li className="flex items-center space-x-2">
                    <Heart className="w-4 h-4" />
                    <span className="text-sm">
                      Keep the platform free for everyone
                    </span>
                  </li>
                  <li className="flex items-center space-x-2">
                    <Shield className="w-4 h-4" />
                    <span className="text-sm">
                      Maintain top-level security and privacy
                    </span>
                  </li>
                  <li className="flex items-center space-x-2">
                    <Users className="w-4 h-4" />
                    <span className="text-sm">
                      Train and support our volunteer network
                    </span>
                  </li>
                </ul>
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}

export default MainComponent;
