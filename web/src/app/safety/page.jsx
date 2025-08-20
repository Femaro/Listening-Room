import {
  Shield,
  Lock,
  Eye,
  UserX,
  AlertTriangle,
  CheckCircle,
  Heart,
  Phone,
} from "lucide-react";

export const metadata = {
  title: "Safety & Privacy - Anonymous Mental Health Support | Listening Room",
  description:
    "Learn about our comprehensive safety measures, privacy protection, and crisis protocols for anonymous mental health support.",
  keywords:
    "mental health safety, privacy protection, anonymous chat security, crisis protocols, volunteer screening, data protection",
};

function MainComponent() {
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
              <a
                href="/donate"
                className="text-orange-600 hover:text-orange-700 font-medium"
              >
                Donate
              </a>
              <a
                href="/account/signin"
                className="text-gray-600 hover:text-gray-900 font-medium"
              >
                Sign In
              </a>
              <a
                href="/account/signup"
                className="bg-teal-600 text-white px-4 py-2 rounded-lg font-medium hover:bg-teal-700 transition-colors"
              >
                Get Started
              </a>
            </div>
          </nav>
        </div>
      </header>

      {/* Hero Section */}
      <section className="py-16 px-4 sm:px-6 lg:px-8 bg-gradient-to-br from-teal-50 to-emerald-50">
        <div className="max-w-4xl mx-auto text-center">
          <img
            src="https://ucarecdn.com/dc54868d-20c4-46fa-b583-6f27b18e95b5/-/format/auto/"
            alt="ListeningRoom Logo"
            className="h-16 object-contain mx-auto mb-6"
          />
          <h1 className="text-4xl font-bold text-gray-900 mb-6">
            Your Safety & Privacy Come First
          </h1>
          <p className="text-xl text-gray-600 mb-8">
            We've built comprehensive safety measures to protect your privacy
            and ensure a secure mental health support experience.
          </p>
        </div>
      </section>

      {/* Privacy Section */}
      <section className="py-16 px-4 sm:px-6 lg:px-8">
        <div className="max-w-6xl mx-auto">
          <h2 className="text-3xl font-bold text-center text-gray-900 mb-12">
            Complete Privacy Protection
          </h2>

          <div className="grid md:grid-cols-2 lg:grid-cols-3 gap-8 mb-12">
            <div className="bg-white border border-gray-200 rounded-lg p-6">
              <UserX className="w-12 h-12 text-teal-600 mb-4" />
              <h3 className="text-xl font-semibold text-gray-900 mb-3">
                Anonymous Identity
              </h3>
              <p className="text-gray-600">
                No real names required. Choose any username you want. Your
                identity remains completely anonymous throughout all
                conversations.
              </p>
            </div>

            <div className="bg-white border border-gray-200 rounded-lg p-6">
              <Lock className="w-12 h-12 text-emerald-600 mb-4" />
              <h3 className="text-xl font-semibold text-gray-900 mb-3">
                Encrypted Conversations
              </h3>
              <p className="text-gray-600">
                All chats are encrypted end-to-end. Only you and your volunteer
                can see the conversation - not even our team can access it.
              </p>
            </div>

            <div className="bg-white border border-gray-200 rounded-lg p-6">
              <Eye className="w-12 h-12 text-orange-600 mb-4" />
              <h3 className="text-xl font-semibent text-gray-900 mb-3">
                No Chat Storage
              </h3>
              <p className="text-gray-600">
                We never store your conversations. Once a session ends, all chat
                content is permanently deleted from our servers.
              </p>
            </div>
          </div>

          <div className="bg-gray-50 rounded-lg p-8">
            <h3 className="text-2xl font-semibold text-gray-900 mb-4">
              What Information We Collect
            </h3>
            <div className="grid md:grid-cols-2 gap-8">
              <div>
                <h4 className="text-lg font-semibold text-gray-900 mb-3 text-green-700">
                  ✓ What We Do Collect
                </h4>
                <ul className="space-y-2 text-gray-600">
                  <li>• Email address (for account login only)</li>
                  <li>• Username you choose</li>
                  <li>• Language preference</li>
                  <li>• General support topic (optional)</li>
                  <li>• Session start/end times (no content)</li>
                  <li>• Anonymous feedback ratings</li>
                </ul>
              </div>
              <div>
                <h4 className="text-lg font-semibold text-gray-900 mb-3 text-red-700">
                  ✗ What We Never Collect
                </h4>
                <ul className="space-y-2 text-gray-600">
                  <li>• Your real name</li>
                  <li>• Phone number or address</li>
                  <li>• Chat conversation content</li>
                  <li>• Personal identifying information</li>
                  <li>• Location data</li>
                  <li>• Medical records or diagnosis</li>
                </ul>
              </div>
            </div>
          </div>
        </div>
      </section>

      {/* Volunteer Safety */}
      <section className="py-16 px-4 sm:px-6 lg:px-8 bg-gray-50">
        <div className="max-w-6xl mx-auto">
          <h2 className="text-3xl font-bold text-center text-gray-900 mb-12">
            Volunteer Safety & Training
          </h2>

          <div className="grid md:grid-cols-2 gap-12">
            <div>
              <h3 className="text-2xl font-semibold text-gray-900 mb-6">
                Rigorous Screening Process
              </h3>
              <div className="space-y-4">
                <div className="flex items-start space-x-3">
                  <CheckCircle className="w-6 h-6 text-green-600 flex-shrink-0 mt-0.5" />
                  <div>
                    <h4 className="font-semibold text-gray-900">
                      Background Verification
                    </h4>
                    <p className="text-gray-600 text-sm">
                      All volunteers undergo comprehensive background checks
                      before approval.
                    </p>
                  </div>
                </div>
                <div className="flex items-start space-x-3">
                  <CheckCircle className="w-6 h-6 text-green-600 flex-shrink-0 mt-0.5" />
                  <div>
                    <h4 className="font-semibold text-gray-900">
                      Application Review
                    </h4>
                    <p className="text-gray-600 text-sm">
                      Detailed application process including motivation
                      assessment and reference checks.
                    </p>
                  </div>
                </div>
                <div className="flex items-start space-x-3">
                  <CheckCircle className="w-6 h-6 text-green-600 flex-shrink-0 mt-0.5" />
                  <div>
                    <h4 className="font-semibold text-gray-900">
                      Interview Process
                    </h4>
                    <p className="text-gray-600 text-sm">
                      One-on-one interviews with our mental health
                      professionals.
                    </p>
                  </div>
                </div>
              </div>
            </div>

            <div>
              <h3 className="text-2xl font-semibold text-gray-900 mb-6">
                Comprehensive Training
              </h3>
              <div className="space-y-4">
                <div className="flex items-start space-x-3">
                  <CheckCircle className="w-6 h-6 text-green-600 flex-shrink-0 mt-0.5" />
                  <div>
                    <h4 className="font-semibold text-gray-900">
                      Active Listening Skills
                    </h4>
                    <p className="text-gray-600 text-sm">
                      20+ hours of training in effective listening and
                      communication techniques.
                    </p>
                  </div>
                </div>
                <div className="flex items-start space-x-3">
                  <CheckCircle className="w-6 h-6 text-green-600 flex-shrink-0 mt-0.5" />
                  <div>
                    <h4 className="font-semibold text-gray-900">
                      Crisis Recognition
                    </h4>
                    <p className="text-gray-600 text-sm">
                      Training to identify and respond appropriately to mental
                      health crises.
                    </p>
                  </div>
                </div>
                <div className="flex items-start space-x-3">
                  <CheckCircle className="w-6 h-6 text-green-600 flex-shrink-0 mt-0.5" />
                  <div>
                    <h4 className="font-semibold text-gray-900">
                      Ongoing Support
                    </h4>
                    <p className="text-gray-600 text-sm">
                      Regular supervision, continuing education, and peer
                      support groups.
                    </p>
                  </div>
                </div>
              </div>
            </div>
          </div>
        </div>
      </section>

      {/* Crisis Protocols */}
      <section className="py-16 px-4 sm:px-6 lg:px-8">
        <div className="max-w-4xl mx-auto">
          <h2 className="text-3xl font-bold text-center text-gray-900 mb-12">
            Crisis Support Protocols
          </h2>

          <div className="bg-red-50 border-2 border-red-200 rounded-lg p-8 mb-8">
            <div className="flex items-start space-x-4">
              <AlertTriangle className="w-12 h-12 text-red-600 flex-shrink-0" />
              <div>
                <h3 className="text-2xl font-semibold text-red-800 mb-4">
                  Immediate Crisis Support
                </h3>
                <p className="text-red-700 mb-4">
                  If you're experiencing a mental health crisis or thoughts of
                  self-harm, please reach out for immediate professional help:
                </p>
                <div className="space-y-2">
                  <div className="flex items-center space-x-2">
                    <Phone className="w-5 h-5 text-red-600" />
                    <span className="font-semibold text-red-800">
                      Emergency Services: 911 (US)
                    </span>
                  </div>
                  <div className="flex items-center space-x-2">
                    <Phone className="w-5 h-5 text-red-600" />
                    <span className="font-semibold text-red-800">
                      Suicide & Crisis Lifeline: 988 (US)
                    </span>
                  </div>
                  <div className="flex items-center space-x-2">
                    <Phone className="w-5 h-5 text-red-600" />
                    <span className="font-semibold text-red-800">
                      Crisis Text Line: Text HOME to 741741
                    </span>
                  </div>
                </div>
              </div>
            </div>
          </div>

          <div className="space-y-6">
            <h3 className="text-2xl font-semibold text-gray-900">
              Our Crisis Response Process
            </h3>

            <div className="space-y-4">
              <div className="bg-white border border-gray-200 rounded-lg p-6">
                <h4 className="text-lg font-semibold text-gray-900 mb-2">
                  Step 1: Recognition
                </h4>
                <p className="text-gray-600">
                  Our volunteers are trained to recognize signs of crisis and
                  imminent risk. They follow specific protocols to assess the
                  situation.
                </p>
              </div>

              <div className="bg-white border border-gray-200 rounded-lg p-6">
                <h4 className="text-lg font-semibold text-gray-900 mb-2">
                  Step 2: De-escalation
                </h4>
                <p className="text-gray-600">
                  Volunteers use proven techniques to provide immediate
                  emotional support and help stabilize the situation while
                  encouraging professional help.
                </p>
              </div>

              <div className="bg-white border border-gray-200 rounded-lg p-6">
                <h4 className="text-lg font-semibold text-gray-900 mb-2">
                  Step 3: Resource Connection
                </h4>
                <p className="text-gray-600">
                  We provide immediate access to crisis hotlines, local
                  emergency services information, and professional mental health
                  resources.
                </p>
              </div>

              <div className="bg-white border border-gray-200 rounded-lg p-6">
                <h4 className="text-lg font-semibold text-gray-900 mb-2">
                  Step 4: Follow-up Support
                </h4>
                <p className="text-gray-600">
                  After crisis intervention, we maintain connection to ensure
                  you've accessed appropriate professional help and continue to
                  feel supported.
                </p>
              </div>
            </div>
          </div>
        </div>
      </section>

      {/* Community Guidelines */}
      <section className="py-16 px-4 sm:px-6 lg:px-8 bg-gray-50">
        <div className="max-w-4xl mx-auto">
          <h2 className="text-3xl font-bold text-center text-gray-900 mb-12">
            Community Safety Guidelines
          </h2>

          <div className="grid md:grid-cols-2 gap-8">
            <div>
              <h3 className="text-xl font-semibold text-gray-900 mb-4 text-green-700">
                ✓ Encouraged Behaviors
              </h3>
              <ul className="space-y-3 text-gray-600">
                <li>• Share your feelings openly and honestly</li>
                <li>• Ask for the support you need</li>
                <li>• Respect your volunteer's time and expertise</li>
                <li>• Practice patience and understanding</li>
                <li>• Use kind, respectful communication</li>
                <li>• Take breaks when you need them</li>
              </ul>
            </div>

            <div>
              <h3 className="text-xl font-semibent text-gray-900 mb-4 text-red-700">
                ✗ Prohibited Behaviors
              </h3>
              <ul className="space-y-3 text-gray-600">
                <li>• Sharing personal identifying information</li>
                <li>• Abusive, threatening, or hateful language</li>
                <li>• Sharing explicit or inappropriate content</li>
                <li>• Attempting to contact volunteers outside the platform</li>
                <li>• Misrepresenting your identity or situation</li>
                <li>• Disrupting others' sessions</li>
              </ul>
            </div>
          </div>

          <div className="mt-8 bg-yellow-50 border border-yellow-200 rounded-lg p-6">
            <h4 className="font-semibold text-yellow-800 mb-2">
              Reporting Concerns
            </h4>
            <p className="text-yellow-700">
              If you experience any inappropriate behavior or safety concerns,
              please report it immediately using our secure reporting system.
              All reports are investigated promptly and confidentially.
            </p>
          </div>
        </div>
      </section>

      {/* Data Security */}
      <section className="py-16 px-4 sm:px-6 lg:px-8">
        <div className="max-w-4xl mx-auto">
          <h2 className="text-3xl font-bold text-center text-gray-900 mb-12">
            Technical Security Measures
          </h2>

          <div className="grid md:grid-cols-3 gap-6">
            <div className="text-center">
              <Lock className="w-12 h-12 text-teal-600 mx-auto mb-4" />
              <h3 className="text-lg font-semibold text-gray-900 mb-2">
                SSL/TLS Encryption
              </h3>
              <p className="text-gray-600 text-sm">
                All data transmitted between your device and our servers is
                encrypted with industry-standard protocols.
              </p>
            </div>

            <div className="text-center">
              <Shield className="w-12 h-12 text-emerald-600 mx-auto mb-4" />
              <h3 className="text-lg font-semibold text-gray-900 mb-2">
                Secure Infrastructure
              </h3>
              <p className="text-gray-600 text-sm">
                Our servers are hosted on secure, certified cloud infrastructure
                with 24/7 monitoring and protection.
              </p>
            </div>

            <div className="text-center">
              <CheckCircle className="w-12 h-12 text-orange-600 mx-auto mb-4" />
              <h3 className="text-lg font-semibold text-gray-900 mb-2">
                Regular Audits
              </h3>
              <p className="text-gray-600 text-sm">
                We conduct regular security audits and vulnerability assessments
                to maintain the highest safety standards.
              </p>
            </div>
          </div>
        </div>
      </section>

      {/* CTA Section */}
      <section className="py-16 px-4 sm:px-6 lg:px-8 bg-teal-600 text-white">
        <div className="max-w-4xl mx-auto text-center">
          <Heart className="w-12 h-12 mx-auto mb-6" />
          <h2 className="text-3xl font-bold mb-6">
            Your Safety is Our Priority
          </h2>
          <p className="text-xl mb-8 text-teal-100">
            Feel confident knowing you're supported by a platform designed with
            your safety and privacy in mind.
          </p>
          <div className="flex flex-col sm:flex-row gap-4 justify-center">
            <a
              href="/account/signup"
              className="bg-white text-teal-600 px-8 py-4 rounded-lg font-semibold text-lg hover:bg-gray-50 transition-colors"
            >
              Get Safe Support Now
            </a>
            <a
              href="/crisis-resources"
              className="border-2 border-white text-white px-8 py-4 rounded-lg font-semibold text-lg hover:bg-white hover:text-teal-600 transition-colors"
            >
              Crisis Resources
            </a>
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
