import { useState } from "react";
import {
  Mail,
  MessageCircle,
  Phone,
  MapPin,
  Send,
  Clock,
  Heart,
  HelpCircle,
  AlertTriangle,
} from "lucide-react";

export const metadata = {
  title: "Contact Us - Get in Touch | Listening Room Mental Health Support",
  description: "Contact Listening Room for support questions, feedback, partnerships, or general inquiries. Multiple ways to reach our mental health advocacy team.",
  keywords: "contact Listening Room, mental health support contact, volunteer questions, partnership inquiries, feedback, support email",
};

function MainComponent() {
  const [formData, setFormData] = useState({
    name: "",
    email: "",
    subject: "",
    category: "",
    message: "",
  });
  const [submitting, setSubmitting] = useState(false);
  const [submitted, setSubmitted] = useState(false);
  const [error, setError] = useState(null);

  const handleInputChange = (field, value) => {
    setFormData(prev => ({ ...prev, [field]: value }));
    setError(null);
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    
    if (!formData.name.trim() || !formData.email.trim() || !formData.subject.trim() || !formData.message.trim()) {
      setError("Please fill in all required fields");
      return;
    }

    setSubmitting(true);
    setError(null);

    try {
      const response = await fetch("/api/contact", {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify(formData),
      });

      if (!response.ok) {
        const errorData = await response.json();
        throw new Error(errorData.error || "Failed to send message");
      }

      setSubmitted(true);
    } catch (err) {
      console.error("Error sending message:", err);
      setError(err.message);
      setSubmitting(false);
    }
  };

  const contactMethods = [
    {
      icon: MessageCircle,
      title: "General Support",
      description: "Questions about using Listening Room or getting mental health support",
      contact: "support@listeningroom.com",
      responseTime: "24-48 hours"
    },
    {
      icon: Heart,
      title: "Volunteer Inquiries",
      description: "Questions about becoming a volunteer mental health listener",
      contact: "volunteers@listeningroom.com",
      responseTime: "2-3 business days"
    },
    {
      icon: Mail,
      title: "Partnership & Media",
      description: "Partnership opportunities, media inquiries, or business development",
      contact: "partnerships@listeningroom.com",
      responseTime: "3-5 business days"
    },
    {
      icon: AlertTriangle,
      title: "Safety & Reporting",
      description: "Report safety concerns, inappropriate behavior, or platform issues",
      contact: "safety@listeningroom.com",
      responseTime: "Within 24 hours"
    }
  ];

  const officeInfo = {
    organization: "CLAEVA INTERNATIONAL",
    description: "Mental health advocacy organization operating Listening Room",
    address: "Digital-First Organization\nServing Communities Worldwide",
    hours: "24/7 Mental Health Support Available\nAdmin Hours: Monday-Friday, 9 AM - 5 PM EST"
  };

  if (submitted) {
    return (
      <div className="min-h-screen bg-gradient-to-br from-teal-50 to-emerald-50 flex items-center justify-center p-4">
        <div className="max-w-2xl w-full bg-white rounded-2xl shadow-xl p-8 text-center">
          <Mail className="w-16 h-16 text-green-600 mx-auto mb-6" />
          <h1 className="text-3xl font-bold text-gray-900 mb-4">
            Message Sent Successfully!
          </h1>
          <p className="text-lg text-gray-600 mb-6">
            Thank you for reaching out to Listening Room. We've received your message and will get back to you as soon as possible.
          </p>
          <div className="bg-teal-50 border border-teal-200 rounded-lg p-6 mb-6">
            <h3 className="font-semibold text-teal-800 mb-2">What Happens Next?</h3>
            <ul className="text-teal-700 text-sm space-y-1 text-left">
              <li>• We'll review your message within 24-48 hours</li>
              <li>• You'll receive a response at {formData.email}</li>
              <li>• For urgent matters, check our crisis resources</li>
              <li>• We may follow up with additional questions if needed</li>
            </ul>
          </div>
          <div className="flex flex-col sm:flex-row gap-4 justify-center">
            <a
              href="/"
              className="bg-teal-600 text-white px-6 py-3 rounded-lg font-medium hover:bg-teal-700 transition-colors"
            >
              Back to Home
            </a>
            <a
              href="/faq"
              className="border border-teal-600 text-teal-600 px-6 py-3 rounded-lg font-medium hover:bg-teal-50 transition-colors"
            >
              Visit FAQ
            </a>
          </div>
        </div>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-white">
      {/* Header */}
      <header className="bg-white border-b border-gray-200 sticky top-0 z-50">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <nav className="flex justify-between items-center py-4">
            <div className="flex items-center space-x-3">
              <a href="/">
                <img
                  src="https://ucarecdn.com/e05f1122-ee17-479a-b4b8-456584592d00/-/format/auto/"
                  alt="Listening Room"
                  className="h-14 object-contain"
                />
              </a>
            </div>
            <div className="flex items-center space-x-4">
              <a href="/donate" className="text-orange-600 hover:text-orange-700 font-medium">
                Donate
              </a>
              <a href="/account/signin" className="text-gray-600 hover:text-gray-900 font-medium">
                Sign In
              </a>
              <a href="/account/signup" className="bg-teal-600 text-white px-4 py-2 rounded-lg font-medium hover:bg-teal-700 transition-colors">
                Get Started
              </a>
            </div>
          </nav>
        </div>
      </header>

      {/* Hero Section */}
      <section className="py-16 px-4 sm:px-6 lg:px-8 bg-gradient-to-br from-blue-50 to-indigo-50">
        <div className="max-w-4xl mx-auto text-center">
          <Mail className="w-16 h-16 text-blue-600 mx-auto mb-6" />
          <h1 className="text-4xl font-bold text-gray-900 mb-6">
            Get in Touch
          </h1>
          <p className="text-xl text-gray-600 mb-8">
            Have questions, feedback, or want to get involved? We'd love to hear from you. 
            Our team is here to help and support the mental health community.
          </p>
        </div>
      </section>

      {/* Crisis Notice */}
      <section className="py-4 px-4 sm:px-6 lg:px-8 bg-red-50 border-b border-red-200">
        <div className="max-w-4xl mx-auto text-center">
          <div className="flex items-center justify-center space-x-2 text-red-800">
            <AlertTriangle className="w-5 h-5" />
            <span className="font-semibold">Crisis Support:</span>
            <span>If you need immediate help, call 988 or text HOME to 741741</span>
          </div>
        </div>
      </section>

      {/* Contact Methods */}
      <section className="py-16 px-4 sm:px-6 lg:px-8">
        <div className="max-w-6xl mx-auto">
          <h2 className="text-3xl font-bold text-center text-gray-900 mb-12">
            How to Reach Us
          </h2>
          
          <div className="grid md:grid-cols-2 gap-6">
            {contactMethods.map((method, index) => (
              <div key={index} className="bg-white border border-gray-200 rounded-lg p-6 shadow-sm">
                <div className="flex items-start space-x-4">
                  <div className="w-12 h-12 bg-teal-100 rounded-lg flex items-center justify-center flex-shrink-0">
                    <method.icon className="w-6 h-6 text-teal-600" />
                  </div>
                  <div className="flex-1">
                    <h3 className="text-lg font-semibold text-gray-900 mb-2">{method.title}</h3>
                    <p className="text-gray-600 mb-3 text-sm">{method.description}</p>
                    <a
                      href={`mailto:${method.contact}`}
                      className="text-teal-600 hover:text-teal-700 font-medium"
                    >
                      {method.contact}
                    </a>
                    <div className="flex items-center space-x-2 mt-2 text-sm text-gray-500">
                      <Clock className="w-4 h-4" />
                      <span>Response time: {method.responseTime}</span>
                    </div>
                  </div>
                </div>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* Contact Form */}
      <section className="py-16 px-4 sm:px-6 lg:px-8 bg-gray-50">
        <div className="max-w-4xl mx-auto">
          <h2 className="text-3xl font-bold text-center text-gray-900 mb-12">
            Send Us a Message
          </h2>
          
          <form onSubmit={handleSubmit} className="bg-white rounded-xl shadow-sm p-8">
            <div className="grid md:grid-cols-2 gap-6 mb-6">
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-2">
                  Your Name *
                </label>
                <input
                  type="text"
                  value={formData.name}
                  onChange={(e) => handleInputChange("name", e.target.value)}
                  placeholder="Enter your full name"
                  className="w-full px-4 py-3 border border-gray-200 rounded-lg focus:ring-2 focus:ring-teal-500 focus:border-transparent outline-none"
                  required
                />
              </div>
              
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-2">
                  Email Address *
                </label>
                <input
                  type="email"
                  value={formData.email}
                  onChange={(e) => handleInputChange("email", e.target.value)}
                  placeholder="your.email@example.com"
                  className="w-full px-4 py-3 border border-gray-200 rounded-lg focus:ring-2 focus:ring-teal-500 focus:border-transparent outline-none"
                  required
                />
              </div>
            </div>
            
            <div className="grid md:grid-cols-2 gap-6 mb-6">
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-2">
                  Category
                </label>
                <select
                  value={formData.category}
                  onChange={(e) => handleInputChange("category", e.target.value)}
                  className="w-full px-4 py-3 border border-gray-200 rounded-lg focus:ring-2 focus:ring-teal-500 focus:border-transparent outline-none"
                >
                  <option value="">Select a category</option>
                  <option value="general">General Support</option>
                  <option value="volunteer">Volunteer Inquiry</option>
                  <option value="partnership">Partnership/Media</option>
                  <option value="technical">Technical Issue</option>
                  <option value="safety">Safety/Reporting</option>
                  <option value="feedback">Feedback</option>
                  <option value="other">Other</option>
                </select>
              </div>
              
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-2">
                  Subject *
                </label>
                <input
                  type="text"
                  value={formData.subject}
                  onChange={(e) => handleInputChange("subject", e.target.value)}
                  placeholder="Brief description of your inquiry"
                  className="w-full px-4 py-3 border border-gray-200 rounded-lg focus:ring-2 focus:ring-teal-500 focus:border-transparent outline-none"
                  required
                />
              </div>
            </div>
            
            <div className="mb-6">
              <label className="block text-sm font-medium text-gray-700 mb-2">
                Your Message *
              </label>
              <textarea
                value={formData.message}
                onChange={(e) => handleInputChange("message", e.target.value)}
                placeholder="Please provide as much detail as possible about your inquiry or feedback..."
                rows={6}
                className="w-full px-4 py-3 border border-gray-200 rounded-lg focus:ring-2 focus:ring-teal-500 focus:border-transparent outline-none resize-none"
                required
              />
              <p className="text-sm text-gray-500 mt-2">
                {formData.message.length}/2000 characters
              </p>
            </div>
            
            {error && (
              <div className="mb-6 bg-red-50 border border-red-200 rounded-lg p-4 text-sm text-red-600">
                {error}
              </div>
            )}
            
            <div className="bg-blue-50 border border-blue-200 rounded-lg p-4 mb-6">
              <h4 className="font-semibold text-blue-800 mb-2">Before You Send:</h4>
              <ul className="text-sm text-blue-700 space-y-1">
                <li>• For immediate crisis support, call 988 or text HOME to 741741</li>
                <li>• Check our <a href="/faq" className="underline">FAQ page</a> for quick answers to common questions</li>
                <li>• For volunteer applications, use our <a href="/volunteer" className="underline">volunteer page</a></li>
                <li>• We typically respond within 24-48 hours during business days</li>
              </ul>
            </div>
            
            <div className="text-center">
              <button
                type="submit"
                disabled={submitting}
                className="bg-teal-600 text-white px-8 py-4 rounded-lg font-semibold text-lg hover:bg-teal-700 transition-colors disabled:opacity-50 disabled:cursor-not-allowed inline-flex items-center"
              >
                {submitting ? "Sending..." : "Send Message"}
                {!submitting && <Send className="ml-2 w-5 h-5" />}
              </button>
            </div>
          </form>
        </div>
      </section>

      {/* Organization Info */}
      <section className="py-16 px-4 sm:px-6 lg:px-8">
        <div className="max-w-4xl mx-auto">
          <h2 className="text-3xl font-bold text-center text-gray-900 mb-12">
            About Our Organization
          </h2>
          
          <div className="bg-white border border-gray-200 rounded-xl p-8 shadow-sm">
            <div className="text-center mb-8">
              <Heart className="w-12 h-12 text-red-600 mx-auto mb-4" />
              <h3 className="text-2xl font-bold text-gray-900 mb-2">{officeInfo.organization}</h3>
              <p className="text-lg text-gray-600">{officeInfo.description}</p>
            </div>
            
            <div className="grid md:grid-cols-2 gap-8">
              <div>
                <div className="flex items-start space-x-3">
                  <MapPin className="w-6 h-6 text-gray-600 flex-shrink-0 mt-1" />
                  <div>
                    <h4 className="font-semibold text-gray-900 mb-1">Our Reach</h4>
                    <p className="text-gray-600 whitespace-pre-line">{officeInfo.address}</p>
                  </div>
                </div>
              </div>
              
              <div>
                <div className="flex items-start space-x-3">
                  <Clock className="w-6 h-6 text-gray-600 flex-shrink-0 mt-1" />
                  <div>
                    <h4 className="font-semibold text-gray-900 mb-1">Availability</h4>
                    <p className="text-gray-600 whitespace-pre-line">{officeInfo.hours}</p>
                  </div>
                </div>
              </div>
            </div>
          </div>
        </div>
      </section>

      {/* Additional Resources */}
      <section className="py-16 px-4 sm:px-6 lg:px-8 bg-gray-50">
        <div className="max-w-4xl mx-auto">
          <h2 className="text-3xl font-bold text-center text-gray-900 mb-12">
            Other Ways to Connect
          </h2>
          
          <div className="grid md:grid-cols-3 gap-6">
            <div className="bg-white rounded-lg p-6 text-center shadow-sm">
              <MessageCircle className="w-10 h-10 text-teal-600 mx-auto mb-4" />
              <h3 className="font-semibold text-gray-900 mb-2">Get Support</h3>
              <p className="text-sm text-gray-600 mb-4">
                Need mental health support right now? Connect with a trained volunteer instantly.
              </p>
              <a
                href="/account/signup"
                className="bg-teal-600 text-white px-4 py-2 rounded-lg text-sm font-medium hover:bg-teal-700 transition-colors"
              >
                Start Free Chat
              </a>
            </div>
            
            <div className="bg-white rounded-lg p-6 text-center shadow-sm">
              <HelpCircle className="w-10 h-10 text-blue-600 mx-auto mb-4" />
              <h3 className="font-semibold text-gray-900 mb-2">FAQ</h3>
              <p className="text-sm text-gray-600 mb-4">
                Find quick answers to common questions about our platform and services.
              </p>
              <a
                href="/faq"
                className="bg-blue-600 text-white px-4 py-2 rounded-lg text-sm font-medium hover:bg-blue-700 transition-colors"
              >
                Browse FAQ
              </a>
            </div>
            
            <div className="bg-white rounded-lg p-6 text-center shadow-sm">
              <Heart className="w-10 h-10 text-orange-600 mx-auto mb-4" />
              <h3 className="font-semibold text-gray-900 mb-2">Support Us</h3>
              <p className="text-sm text-gray-600 mb-4">
                Help us keep mental health support free and accessible for everyone.
              </p>
              <a
                href="/donate"
                className="bg-orange-600 text-white px-4 py-2 rounded-lg text-sm font-medium hover:bg-orange-700 transition-colors"
              >
                Donate Now
              </a>
            </div>
          </div>
        </div>
      </section>

      {/* Footer */}
      <footer className="bg-gray-900 text-white py-8 px-4 sm:px-6 lg:px-8">
        <div className="max-w-6xl mx-auto text-center">
          <p>&copy; 2025 Listening Room. All rights reserved.</p>
        </div>
      </footer>
    </div>
  );
}

export default MainComponent;