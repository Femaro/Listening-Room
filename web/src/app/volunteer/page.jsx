"use client";

import {
  Heart,
  Users,
  BookOpen,
  CheckCircle,
  Clock,
  Award,
  Headphones,
  Globe,
  Shield,
  ArrowRight,
  Star,
  MessageCircle,
} from "lucide-react";

export default function VolunteerInfoPage() {
  return (
    <div className="min-h-screen bg-white">
      {/* Header */}
      <header className="bg-gradient-to-r from-teal-600 to-emerald-600 text-white">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-16">
          <div className="text-center">
            <img
              src="https://ucarecdn.com/e05f1122-ee17-479a-b4b8-456584592d00/-/format/auto/"
              alt="Listening Room Logo"
              className="w-48 h-24 mx-auto mb-6 object-contain filter brightness-0 invert"
            />
            <h1 className="text-4xl md:text-5xl font-bold mb-6">
              Become a Volunteer Listener
            </h1>
            <p className="text-xl md:text-2xl mb-8 text-teal-100 max-w-3xl mx-auto">
              Join our community of compassionate volunteers and make a
              meaningful difference in people's lives through the power of
              listening.
            </p>
            <div className="flex flex-col sm:flex-row gap-4 justify-center">
              <a
                href="/volunteer/application"
                className="bg-white text-teal-600 px-8 py-3 rounded-lg font-semibold hover:bg-gray-50 transition-colors inline-flex items-center justify-center"
              >
                Apply to Volunteer
                <ArrowRight className="w-5 h-5 ml-2" />
              </a>
              <a
                href="/account/signin"
                className="border-2 border-white text-white px-8 py-3 rounded-lg font-semibold hover:bg-white hover:text-teal-600 transition-colors"
              >
                Volunteer Sign In
              </a>
            </div>
          </div>
        </div>
      </header>

      {/* Why Volunteer Section */}
      <section className="py-16 bg-gray-50">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="text-center mb-12">
            <h2 className="text-3xl md:text-4xl font-bold text-gray-900 mb-4">
              Why Volunteer with Us?
            </h2>
            <p className="text-xl text-gray-600 max-w-3xl mx-auto">
              Your listening skills can provide comfort, support, and hope to
              those who need it most. Here's what makes volunteering with us
              special:
            </p>
          </div>

          <div className="grid md:grid-cols-3 gap-8">
            <div className="text-center">
              <div className="w-16 h-16 bg-teal-100 rounded-full flex items-center justify-center mx-auto mb-4">
                <Heart className="w-8 h-8 text-teal-600" />
              </div>
              <h3 className="text-xl font-semibold text-gray-900 mb-3">
                Make a Real Impact
              </h3>
              <p className="text-gray-600">
                Every conversation you have can be life-changing. Provide
                emotional support and be the caring voice someone needs to hear.
              </p>
            </div>

            <div className="text-center">
              <div className="w-16 h-16 bg-blue-100 rounded-full flex items-center justify-center mx-auto mb-4">
                <Users className="w-8 h-8 text-blue-600" />
              </div>
              <h3 className="text-xl font-semibold text-gray-900 mb-3">
                Join a Community
              </h3>
              <p className="text-gray-600">
                Connect with like-minded individuals who share your passion for
                helping others. Build lasting friendships and support networks.
              </p>
            </div>

            <div className="text-center">
              <div className="w-16 h-16 bg-green-100 rounded-full flex items-center justify-center mx-auto mb-4">
                <Award className="w-8 h-8 text-green-600" />
              </div>
              <h3 className="text-xl font-semibold text-gray-900 mb-3">
                Develop Skills
              </h3>
              <p className="text-gray-600">
                Enhance your listening, empathy, and communication skills
                through comprehensive training and real-world experience.
              </p>
            </div>
          </div>
        </div>
      </section>

      {/* What You'll Do Section */}
      <section className="py-16">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="text-center mb-12">
            <h2 className="text-3xl md:text-4xl font-bold text-gray-900 mb-4">
              What You'll Do as a Volunteer
            </h2>
            <p className="text-xl text-gray-600 max-w-3xl mx-auto">
              As a volunteer listener, you'll provide emotional support through
              active listening and compassionate conversation.
            </p>
          </div>

          <div className="grid md:grid-cols-2 gap-12 items-center">
            <div>
              <div className="space-y-6">
                <div className="flex items-start space-x-4">
                  <div className="w-8 h-8 bg-teal-100 rounded-full flex items-center justify-center flex-shrink-0 mt-1">
                    <Headphones className="w-4 h-4 text-teal-600" />
                  </div>
                  <div>
                    <h3 className="text-lg font-semibold text-gray-900 mb-2">
                      Active Listening
                    </h3>
                    <p className="text-gray-600">
                      Provide a safe, non-judgmental space for people to share
                      their thoughts, feelings, and experiences.
                    </p>
                  </div>
                </div>

                <div className="flex items-start space-x-4">
                  <div className="w-8 h-8 bg-blue-100 rounded-full flex items-center justify-center flex-shrink-0 mt-1">
                    <MessageCircle className="w-4 h-4 text-blue-600" />
                  </div>
                  <div>
                    <h3 className="text-lg font-semibold text-gray-900 mb-2">
                      Supportive Conversations
                    </h3>
                    <p className="text-gray-600">
                      Engage in meaningful conversations that help people
                      process their emotions and feel less alone.
                    </p>
                  </div>
                </div>

                <div className="flex items-start space-x-4">
                  <div className="w-8 h-8 bg-green-100 rounded-full flex items-center justify-center flex-shrink-0 mt-1">
                    <Shield className="w-4 h-4 text-green-600" />
                  </div>
                  <div>
                    <h3 className="text-lg font-semibold text-gray-900 mb-2">
                      Crisis Support
                    </h3>
                    <p className="text-gray-600">
                      Learn to recognize crisis situations and provide
                      appropriate support while following safety protocols.
                    </p>
                  </div>
                </div>

                <div className="flex items-start space-x-4">
                  <div className="w-8 h-8 bg-purple-100 rounded-full flex items-center justify-center flex-shrink-0 mt-1">
                    <Globe className="w-4 h-4 text-purple-600" />
                  </div>
                  <div>
                    <h3 className="text-lg font-semibold text-gray-900 mb-2">
                      Global Impact
                    </h3>
                    <p className="text-gray-600">
                      Connect with people from around the world, providing
                      support across cultures and time zones.
                    </p>
                  </div>
                </div>
              </div>
            </div>

            <div className="bg-gradient-to-br from-teal-50 to-blue-50 rounded-2xl p-8">
              <div className="text-center">
                <div className="w-20 h-20 bg-teal-600 rounded-full flex items-center justify-center mx-auto mb-6">
                  <Heart className="w-10 h-10 text-white" />
                </div>
                <h3 className="text-2xl font-bold text-gray-900 mb-4">
                  Ready to Make a Difference?
                </h3>
                <p className="text-gray-600 mb-6">
                  Join thousands of volunteers who are already making a positive
                  impact in people's lives every day.
                </p>
                <div className="grid grid-cols-2 gap-4 text-center mb-6">
                  <div className="bg-white rounded-lg p-4">
                    <div className="text-2xl font-bold text-teal-600">24/7</div>
                    <div className="text-sm text-gray-600">
                      Support Available
                    </div>
                  </div>
                  <div className="bg-white rounded-lg p-4">
                    <div className="text-2xl font-bold text-blue-600">50+</div>
                    <div className="text-sm text-gray-600">
                      Countries Served
                    </div>
                  </div>
                </div>
                <a
                  href="/volunteer/application"
                  className="bg-teal-600 text-white px-6 py-3 rounded-lg font-semibold hover:bg-teal-700 transition-colors inline-flex items-center"
                >
                  Apply Now
                  <ArrowRight className="w-4 h-4 ml-2" />
                </a>
              </div>
            </div>
          </div>
        </div>
      </section>

      {/* Training Requirements Section */}
      <section className="py-16 bg-gray-50">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="text-center mb-12">
            <h2 className="text-3xl md:text-4xl font-bold text-gray-900 mb-4">
              Comprehensive Training Program
            </h2>
            <p className="text-xl text-gray-600 max-w-3xl mx-auto">
              We provide thorough training to ensure you're prepared to offer
              the best possible support to those who need it.
            </p>
          </div>

          <div className="grid md:grid-cols-2 lg:grid-cols-3 gap-8">
            <div className="bg-white rounded-lg p-6 shadow-sm border">
              <div className="w-12 h-12 bg-teal-100 rounded-lg flex items-center justify-center mb-4">
                <BookOpen className="w-6 h-6 text-teal-600" />
              </div>
              <h3 className="text-lg font-semibold text-gray-900 mb-3">
                Module 1: Welcome & Platform Overview
              </h3>
              <p className="text-gray-600 mb-4">
                Introduction to our mission, values, and platform features.
              </p>
              <div className="flex items-center text-sm text-gray-500">
                <Clock className="w-4 h-4 mr-1" />
                15 minutes
              </div>
            </div>

            <div className="bg-white rounded-lg p-6 shadow-sm border">
              <div className="w-12 h-12 bg-blue-100 rounded-lg flex items-center justify-center mb-4">
                <Headphones className="w-6 h-6 text-blue-600" />
              </div>
              <h3 className="text-lg font-semibold text-gray-900 mb-3">
                Module 2: Active Listening Fundamentals
              </h3>
              <p className="text-gray-600 mb-4">
                Core principles of effective listening and empathetic
                communication.
              </p>
              <div className="flex items-center text-sm text-gray-500">
                <Clock className="w-4 h-4 mr-1" />
                30 minutes
              </div>
            </div>

            <div className="bg-white rounded-lg p-6 shadow-sm border">
              <div className="w-12 h-12 bg-red-100 rounded-lg flex items-center justify-center mb-4">
                <Shield className="w-6 h-6 text-red-600" />
              </div>
              <h3 className="text-lg font-semibold text-gray-900 mb-3">
                Module 3: Crisis Recognition & Response
              </h3>
              <p className="text-gray-600 mb-4">
                How to identify crisis situations and respond appropriately.
              </p>
              <div className="flex items-center text-sm text-gray-500">
                <Clock className="w-4 h-4 mr-1" />
                45 minutes
              </div>
            </div>

            <div className="bg-white rounded-lg p-6 shadow-sm border">
              <div className="w-12 h-12 bg-green-100 rounded-lg flex items-center justify-center mb-4">
                <Users className="w-6 h-6 text-green-600" />
              </div>
              <h3 className="text-lg font-semibold text-gray-900 mb-3">
                Module 4: Building Rapport & Trust
              </h3>
              <p className="text-gray-600 mb-4">
                Techniques for creating safe, trusting relationships with users.
              </p>
              <div className="flex items-center text-sm text-gray-500">
                <Clock className="w-4 h-4 mr-1" />
                25 minutes
              </div>
            </div>

            <div className="bg-white rounded-lg p-6 shadow-sm border">
              <div className="w-12 h-12 bg-purple-100 rounded-lg flex items-center justify-center mb-4">
                <Heart className="w-6 h-6 text-purple-600" />
              </div>
              <h3 className="text-lg font-semibold text-gray-900 mb-3">
                Module 5: Boundaries & Self-Care
              </h3>
              <p className="text-gray-600 mb-4">
                Maintaining healthy boundaries and practicing effective
                self-care.
              </p>
              <div className="flex items-center text-sm text-gray-500">
                <Clock className="w-4 h-4 mr-1" />
                20 minutes
              </div>
            </div>

            <div className="bg-white rounded-lg p-6 shadow-sm border">
              <div className="w-12 h-12 bg-orange-100 rounded-lg flex items-center justify-center mb-4">
                <Award className="w-6 h-6 text-orange-600" />
              </div>
              <h3 className="text-lg font-semibold text-gray-900 mb-3">
                Module 6: Platform Tools & Features
              </h3>
              <p className="text-gray-600 mb-4">
                Complete guide to using all platform features effectively.
              </p>
              <div className="flex items-center text-sm text-gray-500">
                <Clock className="w-4 h-4 mr-1" />
                15 minutes
              </div>
            </div>
          </div>

          <div className="text-center mt-12">
            <div className="bg-white rounded-lg p-8 max-w-2xl mx-auto shadow-sm border">
              <div className="flex items-center justify-center mb-4">
                <CheckCircle className="w-8 h-8 text-green-600 mr-2" />
                <h3 className="text-xl font-semibold text-gray-900">
                  Certification Required
                </h3>
              </div>
              <p className="text-gray-600 mb-6">
                All volunteers must complete the required training modules and
                pass assessments before they can begin volunteering. This
                ensures the highest quality of support for our users.
              </p>
              <div className="text-sm text-gray-500">
                <span className="font-medium">Total Training Time:</span>{" "}
                Approximately 2.5 hours
              </div>
            </div>
          </div>
        </div>
      </section>

      {/* Call to Action */}
      <section className="py-16 bg-gradient-to-r from-teal-600 to-emerald-600">
        <div className="max-w-4xl mx-auto px-4 sm:px-6 lg:px-8 text-center">
          <h2 className="text-3xl md:text-4xl font-bold text-white mb-4">
            Ready to Start Your Volunteer Journey?
          </h2>
          <p className="text-xl text-teal-100 mb-8">
            Join our community of compassionate volunteers and start making a
            difference today.
          </p>

          <div className="flex flex-col sm:flex-row gap-4 justify-center mb-8">
            <a
              href="/volunteer/application"
              className="bg-white text-teal-600 px-8 py-3 rounded-lg font-semibold hover:bg-gray-50 transition-colors inline-flex items-center justify-center"
            >
              Apply to Volunteer
              <ArrowRight className="w-5 h-5 ml-2" />
            </a>
            <a
              href="/contact"
              className="border-2 border-white text-white px-8 py-3 rounded-lg font-semibold hover:bg-white hover:text-teal-600 transition-colors"
            >
              Have Questions?
            </a>
          </div>

          <div className="grid sm:grid-cols-3 gap-6 text-teal-100">
            <div className="flex items-center justify-center space-x-2">
              <Star className="w-5 h-5" />
              <span>Comprehensive Training</span>
            </div>
            <div className="flex items-center justify-center space-x-2">
              <Shield className="w-5 h-5" />
              <span>Safe Environment</span>
            </div>
            <div className="flex items-center justify-center space-x-2">
              <Heart className="w-5 h-5" />
              <span>Make a Difference</span>
            </div>
          </div>
        </div>
      </section>

      {/* Footer */}
      <footer className="bg-gray-900 text-white py-12">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="grid md:grid-cols-4 gap-8">
            <div className="md:col-span-2">
              <img
                src="https://ucarecdn.com/e05f1122-ee17-479a-b4b8-456584592d00/-/format/auto/"
                alt="Listening Room"
                className="h-10 object-contain mb-4 filter brightness-0 invert"
              />
              <p className="text-gray-400 mb-4">
                Connecting people through compassionate listening and emotional
                support.
              </p>
            </div>

            <div>
              <h3 className="text-lg font-semibold mb-4">Get Involved</h3>
              <div className="space-y-2">
                <a
                  href="/volunteer/application"
                  className="block text-gray-400 hover:text-white transition-colors"
                >
                  Become a Volunteer
                </a>
                <a
                  href="/account/signup"
                  className="block text-gray-400 hover:text-white transition-colors"
                >
                  Get Support
                </a>
                <a
                  href="/donate"
                  className="block text-gray-400 hover:text-white transition-colors"
                >
                  Donate
                </a>
              </div>
            </div>

            <div>
              <h3 className="text-lg font-semibold mb-4">Support</h3>
              <div className="space-y-2">
                <a
                  href="/contact"
                  className="block text-gray-400 hover:text-white transition-colors"
                >
                  Contact Us
                </a>
                <a
                  href="/faq"
                  className="block text-gray-400 hover:text-white transition-colors"
                >
                  FAQ
                </a>
                <a
                  href="/crisis-resources"
                  className="block text-gray-400 hover:text-white transition-colors"
                >
                  Crisis Resources
                </a>
              </div>
            </div>
          </div>

          <div className="border-t border-gray-800 mt-8 pt-8 text-center text-gray-400">
            <p>&copy; 2025 Listening Room. All rights reserved.</p>
          </div>
        </div>
      </footer>
    </div>
  );
}
