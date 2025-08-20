import { useState } from "react";
import {
  User,
  MessageCircle,
  Shield,
  Heart,
  Clock,
  CheckCircle,
  ArrowRight,
  Users,
} from "lucide-react";

export const metadata = {
  title: "How It Works - Free Anonymous Mental Health Support | Listening Room",
  description: "Learn how to get free, anonymous mental health support through our platform. Simple 3-step process to connect with trained volunteers 24/7.",
  keywords: "how it works, anonymous mental health chat, crisis support process, volunteer matching, mental health platform guide",
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
      <section className="py-16 px-4 sm:px-6 lg:px-8 bg-gradient-to-br from-teal-50 to-emerald-50">
        <div className="max-w-4xl mx-auto text-center">
          <h1 className="text-4xl font-bold text-gray-900 mb-6">
            How Anonymous Mental Health Support Works
          </h1>
          <p className="text-xl text-gray-600 mb-8">
            Getting mental health support is simple, safe, and completely anonymous. Here's how it works.
          </p>
        </div>
      </section>

      {/* Main Process Steps */}
      <section className="py-16 px-4 sm:px-6 lg:px-8">
        <div className="max-w-6xl mx-auto">
          <div className="grid md:grid-cols-3 gap-8 mb-16">
            <div className="text-center">
              <div className="w-20 h-20 bg-teal-100 rounded-full flex items-center justify-center mx-auto mb-6">
                <User className="w-10 h-10 text-teal-600" />
              </div>
              <div className="bg-teal-600 text-white w-8 h-8 rounded-full flex items-center justify-center mx-auto mb-4 font-bold">1</div>
              <h3 className="text-2xl font-semibold text-gray-900 mb-4">Create Anonymous Profile</h3>
              <p className="text-gray-600 mb-4">
                Sign up with just an email and choose a username. No personal information required.
              </p>
              <div className="text-left bg-gray-50 p-4 rounded-lg text-sm">
                <h4 className="font-semibold mb-2">What we collect:</h4>
                <ul className="space-y-1">
                  <li>• Email (for account access only)</li>
                  <li>• Username of your choice</li>
                  <li>• Language preference</li>
                  <li>• General support topic (optional)</li>
                </ul>
              </div>
            </div>

            <div className="text-center">
              <div className="w-20 h-20 bg-emerald-100 rounded-full flex items-center justify-center mx-auto mb-6">
                <Users className="w-10 h-10 text-emerald-600" />
              </div>
              <div className="bg-teal-600 text-white w-8 h-8 rounded-full flex items-center justify-center mx-auto mb-4 font-bold">2</div>
              <h3 className="text-2xl font-semibold text-gray-900 mb-4">Instant Matching</h3>
              <p className="text-gray-600 mb-4">
                Our system instantly connects you with an available trained volunteer listener.
              </p>
              <div className="text-left bg-gray-50 p-4 rounded-lg text-sm">
                <h4 className="font-semibold mb-2">Matching criteria:</h4>
                <ul className="space-y-1">
                  <li>• Language preference</li>
                  <li>• Topic expertise</li>
                  <li>• Volunteer availability</li>
                  <li>• Crisis support training</li>
                </ul>
              </div>
            </div>

            <div className="text-center">
              <div className="w-20 h-20 bg-orange-100 rounded-full flex items-center justify-center mx-auto mb-6">
                <MessageCircle className="w-10 h-10 text-orange-600" />
              </div>
              <div className="bg-teal-600 text-white w-8 h-8 rounded-full flex items-center justify-center mx-auto mb-4 font-bold">3</div>
              <h3 className="text-2xl font-semibold text-gray-900 mb-4">Safe, Anonymous Chat</h3>
              <p className="text-gray-600 mb-4">
                Share what's on your mind in a secure, encrypted conversation.
              </p>
              <div className="text-left bg-gray-50 p-4 rounded-lg text-sm">
                <h4 className="font-semibold mb-2">Safety features:</h4>
                <ul className="space-y-1">
                  <li>• End-to-end encryption</li>
                  <li>• No chat history stored</li>
                  <li>• Anonymous identities</li>
                  <li>• Crisis escalation protocols</li>
                </ul>
              </div>
            </div>
          </div>
        </div>
      </section>

      {/* Detailed Process */}
      <section className="py-16 px-4 sm:px-6 lg:px-8 bg-gray-50">
        <div className="max-w-4xl mx-auto">
          <h2 className="text-3xl font-bold text-center text-gray-900 mb-12">
            Step-by-Step Guide
          </h2>
          
          <div className="space-y-8">
            <div className="bg-white rounded-lg p-8 shadow-sm">
              <div className="flex items-start space-x-4">
                <div className="bg-teal-600 text-white w-8 h-8 rounded-full flex items-center justify-center font-bold flex-shrink-0">1</div>
                <div>
                  <h3 className="text-xl font-semibold text-gray-900 mb-2">Account Creation</h3>
                  <p className="text-gray-600 mb-4">
                    Visit our signup page and create your anonymous account in under 2 minutes:
                  </p>
                  <ul className="text-gray-600 space-y-2 mb-4">
                    <li>• Enter your email address (kept completely private)</li>
                    <li>• Create a secure password</li>
                    <li>• Choose a username that feels right to you</li>
                    <li>• Select whether you're seeking support or want to volunteer</li>
                  </ul>
                  <a href="/account/signup" className="inline-flex items-center text-teal-600 hover:text-teal-700 font-medium">
                    Create Account Now <ArrowRight className="ml-1 w-4 h-4" />
                  </a>
                </div>
              </div>
            </div>

            <div className="bg-white rounded-lg p-8 shadow-sm">
              <div className="flex items-start space-x-4">
                <div className="bg-teal-600 text-white w-8 h-8 rounded-full flex items-center justify-center font-bold flex-shrink-0">2</div>
                <div>
                  <h3 className="text-xl font-semibold text-gray-900 mb-2">Profile Setup</h3>
                  <p className="text-gray-600 mb-4">
                    Complete your anonymous profile to help us provide the best support:
                  </p>
                  <ul className="text-gray-600 space-y-2 mb-4">
                    <li>• Choose your preferred language for conversations</li>
                    <li>• Optionally select general topics you'd like support with</li>
                    <li>• Set your availability preferences</li>
                    <li>• Review our community guidelines and safety information</li>
                  </ul>
                </div>
              </div>
            </div>

            <div className="bg-white rounded-lg p-8 shadow-sm">
              <div className="flex items-start space-x-4">
                <div className="bg-teal-600 text-white w-8 h-8 rounded-full flex items-center justify-center font-bold flex-shrink-0">3</div>
                <div>
                  <h3 className="text-xl font-semibold text-gray-900 mb-2">Connect with a Listener</h3>
                  <p className="text-gray-600 mb-4">
                    When you're ready to talk, getting connected is instant:
                  </p>
                  <ul className="text-gray-600 space-y-2 mb-4">
                    <li>• Click "Start Chat" from your dashboard</li>
                    <li>• Wait 10-30 seconds for volunteer matching</li>
                    <li>• Begin your conversation in a private, secure chat room</li>
                    <li>• Talk for as long or as little as you need</li>
                  </ul>
                </div>
              </div>
            </div>

            <div className="bg-white rounded-lg p-8 shadow-sm">
              <div className="flex items-start space-x-4">
                <div className="bg-teal-600 text-white w-8 h-8 rounded-full flex items-center justify-center font-bold flex-shrink-0">4</div>
                <div>
                  <h3 className="text-xl font-semibold text-gray-900 mb-2">End the Session</h3>
                  <p className="text-gray-600 mb-4">
                    You're in complete control of your support session:
                  </p>
                  <ul className="text-gray-600 space-y-2 mb-4">
                    <li>• End the conversation anytime you choose</li>
                    <li>• Optionally provide feedback to help us improve</li>
                    <li>• All chat content is automatically deleted for privacy</li>
                    <li>• Return anytime you need support - 24/7</li>
                  </ul>
                </div>
              </div>
            </div>
          </div>
        </div>
      </section>

      {/* Features Section */}
      <section className="py-16 px-4 sm:px-6 lg:px-8">
        <div className="max-w-6xl mx-auto">
          <h2 className="text-3xl font-bold text-center text-gray-900 mb-12">
            What Makes Us Different
          </h2>
          
          <div className="grid md:grid-cols-2 lg:grid-cols-4 gap-8">
            <div className="text-center">
              <Clock className="w-12 h-12 text-teal-600 mx-auto mb-4" />
              <h3 className="text-lg font-semibold text-gray-900 mb-2">24/7 Availability</h3>
              <p className="text-gray-600 text-sm">Always someone here when you need support</p>
            </div>
            <div className="text-center">
              <Shield className="w-12 h-12 text-emerald-600 mx-auto mb-4" />
              <h3 className="text-lg font-semibold text-gray-900 mb-2">Complete Privacy</h3>
              <p className="text-gray-600 text-sm">No real names, no stored conversations</p>
            </div>
            <div className="text-center">
              <CheckCircle className="w-12 h-12 text-orange-600 mx-auto mb-4" />
              <h3 className="text-lg font-semibold text-gray-900 mb-2">Trained Volunteers</h3>
              <p className="text-gray-600 text-sm">All listeners complete mental health training</p>
            </div>
            <div className="text-center">
              <Heart className="w-12 h-12 text-red-600 mx-auto mb-4" />
              <h3 className="text-lg font-semibold text-gray-900 mb-2">Always Free</h3>
              <p className="text-gray-600 text-sm">Mental health support should be accessible to all</p>
            </div>
          </div>
        </div>
      </section>

      {/* CTA Section */}
      <section className="py-16 px-4 sm:px-6 lg:px-8 bg-teal-600 text-white">
        <div className="max-w-4xl mx-auto text-center">
          <h2 className="text-3xl font-bold mb-6">Ready to Get Started?</h2>
          <p className="text-xl mb-8 text-teal-100">
            Join thousands who have found support through anonymous mental health conversations.
          </p>
          <div className="flex flex-col sm:flex-row gap-4 justify-center">
            <a
              href="/account/signup"
              className="bg-white text-teal-600 px-8 py-4 rounded-lg font-semibold text-lg hover:bg-gray-50 transition-colors"
            >
              Get Support Now
            </a>
            <a
              href="/volunteer"
              className="border-2 border-white text-white px-8 py-4 rounded-lg font-semibold text-lg hover:bg-white hover:text-teal-600 transition-colors"
            >
              Become a Volunteer
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