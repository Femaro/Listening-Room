import { Heart, Shield, Lock, Eye, Database, Mail } from "lucide-react";

export default function PrivacyPolicy() {
  return (
    <div className="min-h-screen bg-gray-50">
      <div className="max-w-4xl mx-auto px-4 py-8">
        {/* Header */}
        <div className="text-center mb-8">
          <div className="inline-flex items-center justify-center w-16 h-16 bg-green-600 rounded-full mb-4">
            <Shield className="w-8 h-8 text-white" />
          </div>
          <h1 className="text-3xl font-bold text-gray-900 mb-2">
            Privacy Policy
          </h1>
          <p className="text-gray-600">
            Last Updated: August 6, 2025
          </p>
        </div>

        <div className="bg-white rounded-lg shadow-lg p-8 space-y-8">
          {/* Introduction */}
          <section>
            <h2 className="text-2xl font-semibold text-gray-900 mb-4">
              1. Our Privacy Commitment
            </h2>
            <p className="text-gray-700 leading-relaxed mb-4">
              At ListeningRoom, we understand that privacy is fundamental to creating a safe, 
              supportive environment for mental health peer support. This Privacy Policy explains 
              how we collect, use, protect, and handle your personal information.
            </p>
            <div className="bg-green-50 border border-green-200 rounded-lg p-4">
              <div className="flex items-start">
                <Lock className="w-5 h-5 text-green-600 mt-1 mr-2" />
                <div>
                  <p className="text-green-800 font-medium mb-2">Privacy First Design</p>
                  <p className="text-green-700 text-sm">
                    We built ListeningRoom with privacy as a core principle. We collect minimal data, 
                    never store conversations, and give you control over your information.
                  </p>
                </div>
              </div>
            </div>
          </section>

          {/* What We Collect */}
          <section>
            <h2 className="text-2xl font-semibold text-gray-900 mb-4">
              2. Information We Collect
            </h2>
            
            <div className="space-y-6">
              <div>
                <h3 className="text-lg font-medium text-gray-900 mb-3 flex items-center">
                  <Database className="w-5 h-5 mr-2 text-blue-600" />
                  Account Information (Required)
                </h3>
                <ul className="list-disc pl-5 text-gray-700 space-y-2">
                  <li><strong>Email address:</strong> For account creation and important notifications</li>
                  <li><strong>Username:</strong> Your chosen display name (can be anonymous)</li>
                  <li><strong>User type:</strong> Whether you're seeking support or volunteering</li>
                  <li><strong>Preferred language:</strong> To match you with appropriate supporters</li>
                </ul>
              </div>

              <div>
                <h3 className="text-lg font-medium text-gray-900 mb-3">
                  Optional Profile Information
                </h3>
                <ul className="list-disc pl-5 text-gray-700 space-y-2">
                  <li><strong>General topics of interest:</strong> To help with matching (e.g., "anxiety," "student stress")</li>
                  <li><strong>Volunteer background:</strong> Experience and motivation (volunteers only)</li>
                  <li><strong>Availability hours:</strong> When you're available to help (volunteers only)</li>
                </ul>
              </div>

              <div>
                <h3 className="text-lg font-medium text-gray-900 mb-3">
                  Technical Information
                </h3>
                <ul className="list-disc pl-5 text-gray-700 space-y-2">
                  <li><strong>Device type:</strong> Mobile or desktop (for optimal experience)</li>
                  <li><strong>Connection info:</strong> IP address and browser type (for security)</li>
                  <li><strong>Usage patterns:</strong> Which features you use (for improvements)</li>
                  <li><strong>Session duration:</strong> How long support sessions last (for analytics)</li>
                </ul>
              </div>
            </div>
          </section>

          {/* What We Don't Collect */}
          <section>
            <h2 className="text-2xl font-semibold text-gray-900 mb-4">
              3. What We DON'T Collect
            </h2>
            <div className="bg-red-50 border border-red-200 rounded-lg p-6">
              <h3 className="text-lg font-medium text-red-900 mb-3 flex items-center">
                <Eye className="w-5 h-5 mr-2" />
                We Never Store or Access
              </h3>
              <ul className="list-disc pl-5 text-red-800 space-y-2">
                <li><strong>Chat conversations:</strong> Messages are transmitted but not stored</li>
                <li><strong>Personal health information:</strong> We don't collect medical histories or diagnoses</li>
                <li><strong>Real names or addresses:</strong> Unless you voluntarily share them (not recommended)</li>
                <li><strong>Financial information:</strong> Payments are processed by secure third parties</li>
                <li><strong>Sensitive identifiers:</strong> Social security numbers, government IDs, etc.</li>
                <li><strong>Location tracking:</strong> We don't track your physical location</li>
                <li><strong>Contact lists:</strong> We don't access your phone contacts or social media</li>
              </ul>
            </div>
          </section>

          {/* How We Use Information */}
          <section>
            <h2 className="text-2xl font-semibold text-gray-900 mb-4">
              4. How We Use Your Information
            </h2>
            
            <div className="space-y-6">
              <div>
                <h3 className="text-lg font-medium text-gray-900 mb-3">
                  Core Platform Functions
                </h3>
                <ul className="list-disc pl-5 text-gray-700 space-y-2">
                  <li>Matching you with appropriate peer supporters</li>
                  <li>Managing your account and preferences</li>
                  <li>Facilitating secure, anonymous chat sessions</li>
                  <li>Sending important safety and service notifications</li>
                  <li>Providing volunteer training and resources</li>
                </ul>
              </div>

              <div>
                <h3 className="text-lg font-medium text-gray-900 mb-3">
                  Platform Improvement (Anonymous Data Only)
                </h3>
                <ul className="list-disc pl-5 text-gray-700 space-y-2">
                  <li>Understanding which features are most helpful</li>
                  <li>Identifying technical issues and bugs</li>
                  <li>Measuring overall platform effectiveness</li>
                  <li>Improving matching algorithms</li>
                  <li>Planning new supportive features</li>
                </ul>
              </div>
            </div>
          </section>

          {/* Data Sharing */}
          <section>
            <h2 className="text-2xl font-semibold text-gray-900 mb-4">
              5. Data Sharing and Disclosure
            </h2>
            
            <div className="space-y-6">
              <div className="bg-blue-50 border border-blue-200 rounded-lg p-4">
                <h3 className="text-lg font-medium text-blue-900 mb-2">
                  Our Promise: We Never Sell Your Data
                </h3>
                <p className="text-blue-800 text-sm">
                  We will never sell, rent, or commercialize your personal information. 
                  Your trust is more valuable than any potential revenue.
                </p>
              </div>

              <div>
                <h3 className="text-lg font-medium text-gray-900 mb-3">
                  Limited Sharing (Only When Necessary)
                </h3>
                <ul className="list-disc pl-5 text-gray-700 space-y-2">
                  <li><strong>Emergency situations:</strong> If we believe someone is in immediate danger</li>
                  <li><strong>Legal requirements:</strong> When required by law or court order</li>
                  <li><strong>Platform security:</strong> To prevent fraud or protect other users</li>
                  <li><strong>Service providers:</strong> Encrypted data to essential service providers (hosting, email)</li>
                </ul>
              </div>

              <div>
                <h3 className="text-lg font-medium text-gray-900 mb-3">
                  Anonymous Aggregate Data
                </h3>
                <p className="text-gray-700 mb-2">
                  We may share anonymous, aggregated statistics such as:
                </p>
                <ul className="list-disc pl-5 text-gray-700 space-y-2">
                  <li>"1,000 peer support sessions completed this month"</li>
                  <li>"Average session duration is 45 minutes"</li>
                  <li>"80% of users report feeling better after sessions"</li>
                </ul>
                <p className="text-sm text-gray-600 mt-2">
                  This data cannot be traced back to individual users.
                </p>
              </div>
            </div>
          </section>

          {/* Data Security */}
          <section>
            <h2 className="text-2xl font-semibold text-gray-900 mb-4">
              6. How We Protect Your Data
            </h2>
            
            <div className="grid md:grid-cols-2 gap-6">
              <div className="bg-gray-50 rounded-lg p-4">
                <h3 className="text-lg font-medium text-gray-900 mb-3">
                  🔐 Technical Security
                </h3>
                <ul className="list-disc pl-4 text-gray-700 text-sm space-y-1">
                  <li>End-to-end encryption for all communications</li>
                  <li>Secure HTTPS connections for all data transfer</li>
                  <li>Regular security audits and penetration testing</li>
                  <li>Secure database encryption at rest</li>
                  <li>Multi-factor authentication options</li>
                </ul>
              </div>

              <div className="bg-gray-50 rounded-lg p-4">
                <h3 className="text-lg font-medium text-gray-900 mb-3">
                  👥 Human Security
                </h3>
                <ul className="list-disc pl-4 text-gray-700 text-sm space-y-1">
                  <li>Limited employee access to personal data</li>
                  <li>Background checks for all staff</li>
                  <li>Privacy training for all team members</li>
                  <li>Strict internal data handling policies</li>
                  <li>Regular security awareness training</li>
                </ul>
              </div>
            </div>

            <div className="bg-yellow-50 border border-yellow-200 rounded-lg p-4 mt-4">
              <h3 className="text-lg font-medium text-yellow-900 mb-2">
                ⚠️ No System is 100% Secure
              </h3>
              <p className="text-yellow-800 text-sm">
                While we implement industry-best security practices, no online service can guarantee 
                complete security. We encourage users to share only what they're comfortable with 
                and avoid sharing identifying details in chat sessions.
              </p>
            </div>
          </section>

          {/* Your Privacy Rights */}
          <section>
            <h2 className="text-2xl font-semibold text-gray-900 mb-4">
              7. Your Privacy Rights and Controls
            </h2>
            
            <div className="space-y-4">
              <div>
                <h3 className="text-lg font-medium text-gray-900 mb-2">You Can:</h3>
                <ul className="list-disc pl-5 text-gray-700 space-y-2">
                  <li><strong>Access your data:</strong> Download all information we have about you</li>
                  <li><strong>Correct information:</strong> Update or fix any incorrect details</li>
                  <li><strong>Delete your account:</strong> Permanently remove all your data</li>
                  <li><strong>Control communications:</strong> Choose which emails you receive</li>
                  <li><strong>Remain anonymous:</strong> Use the platform without revealing your identity</li>
                  <li><strong>Export your data:</strong> Take your information to another service</li>
                </ul>
              </div>

              <div>
                <h3 className="text-lg font-medium text-gray-900 mb-2">To Exercise These Rights:</h3>
                <div className="bg-gray-50 rounded-lg p-4">
                  <ul className="text-gray-700 space-y-1">
                    <li><strong>Email:</strong> joshuanwamuoh@gmail.com</li>
                    <li><strong>In-platform:</strong> Use account settings or contact form</li>
                    <li><strong>Response time:</strong> We'll respond within 30 days</li>
                  </ul>
                </div>
              </div>
            </div>
          </section>

          {/* Data Retention */}
          <section>
            <h2 className="text-2xl font-semibold text-gray-900 mb-4">
              8. How Long We Keep Your Data
            </h2>
            
            <div className="space-y-4">
              <div>
                <h3 className="text-lg font-medium text-gray-900 mb-2">Active Accounts</h3>
                <p className="text-gray-700 mb-2">We keep your account information as long as your account is active.</p>
              </div>

              <div>
                <h3 className="text-lg font-medium text-gray-900 mb-2">Inactive Accounts</h3>
                <ul className="list-disc pl-5 text-gray-700 space-y-2">
                  <li><strong>1 year of inactivity:</strong> We'll send reminder emails</li>
                  <li><strong>2 years of inactivity:</strong> Account marked for deletion</li>
                  <li><strong>3 years of inactivity:</strong> Account and data permanently deleted</li>
                </ul>
              </div>

              <div>
                <h3 className="text-lg font-medium text-gray-900 mb-2">Deleted Accounts</h3>
                <ul className="list-disc pl-5 text-gray-700 space-y-2">
                  <li><strong>Immediate:</strong> Profile and personal information deleted</li>
                  <li><strong>30 days:</strong> All data permanently removed from our systems</li>
                  <li><strong>Exception:</strong> Anonymous analytics data may be retained</li>
                </ul>
              </div>
            </div>
          </section>

          {/* Children's Privacy */}
          <section>
            <h2 className="text-2xl font-semibold text-gray-900 mb-4">
              9. Children's Privacy (Under 18)
            </h2>
            <div className="bg-purple-50 border border-purple-200 rounded-lg p-6">
              <h3 className="text-lg font-medium text-purple-900 mb-3">
                👶 Special Protections for Minors
              </h3>
              <div className="space-y-3 text-purple-800">
                <p><strong>Under 13:</strong> We do not knowingly collect information from children under 13.</p>
                <p><strong>Ages 13-17:</strong> Requires parental consent and may have additional privacy protections.</p>
                <p><strong>If you're a parent:</strong> Contact us to review or delete your child's information.</p>
              </div>
            </div>
          </section>

          {/* International Users */}
          <section>
            <h2 className="text-2xl font-semibold text-gray-900 mb-4">
              10. International Privacy Rights
            </h2>
            
            <div className="space-y-4">
              <div>
                <h3 className="text-lg font-medium text-gray-900 mb-2">European Users (GDPR)</h3>
                <ul className="list-disc pl-5 text-gray-700 space-y-2">
                  <li>Legal basis: Consent and legitimate interest</li>
                  <li>Right to data portability and erasure</li>
                  <li>Right to object to processing</li>
                  <li>Data Protection Officer contact: joshuanwamuoh@gmail.com</li>
                </ul>
              </div>

              <div>
                <h3 className="text-lg font-medium text-gray-900 mb-2">California Users (CCPA)</h3>
                <ul className="list-disc pl-5 text-gray-700 space-y-2">
                  <li>Right to know what data we collect</li>
                  <li>Right to delete personal information</li>
                  <li>Right to non-discrimination for exercising privacy rights</li>
                  <li>We don't sell personal information to third parties</li>
                </ul>
              </div>
            </div>
          </section>

          {/* Policy Changes */}
          <section>
            <h2 className="text-2xl font-semibold text-gray-900 mb-4">
              11. Updates to This Policy
            </h2>
            
            <div className="space-y-4">
              <p className="text-gray-700">
                We may update this Privacy Policy to reflect changes in our practices or for legal reasons:
              </p>
              <ul className="list-disc pl-5 text-gray-700 space-y-2">
                <li><strong>Minor changes:</strong> Updated immediately with new effective date</li>
                <li><strong>Material changes:</strong> Email notification + 30-day notice period</li>
                <li><strong>Your choice:</strong> Continued use means acceptance of updated policy</li>
                <li><strong>Version history:</strong> Previous versions available upon request</li>
              </ul>
            </div>
          </section>

          {/* Contact */}
          <section className="border-t pt-6">
            <h2 className="text-2xl font-semibold text-gray-900 mb-4">
              12. Privacy Questions & Contact
            </h2>
            
            <div className="bg-gray-50 rounded-lg p-6">
              <div className="flex items-start">
                <Mail className="w-6 h-6 text-gray-600 mt-1 mr-3" />
                <div>
                  <h3 className="text-lg font-medium text-gray-900 mb-2">Get In Touch</h3>
                  <p className="text-gray-700 mb-3">
                    Have questions about your privacy or this policy? We're here to help:
                  </p>
                  <ul className="text-gray-700 space-y-1">
                    <li><strong>Email:</strong> joshuanwamuoh@gmail.com</li>
                    <li><strong>Subject line:</strong> "Privacy Question"</li>
                    <li><strong>Response time:</strong> Within 48 hours</li>
                    <li><strong>In-platform:</strong> Contact form in your account settings</li>
                  </ul>
                </div>
              </div>
            </div>
          </section>

          {/* Trust Statement */}
          <section className="bg-green-50 border border-green-200 rounded-lg p-6 text-center">
            <h3 className="text-lg font-semibold text-green-900 mb-2">
              Our Privacy Promise
            </h3>
            <p className="text-green-800">
              We built ListeningRoom because we believe everyone deserves access to mental health support. 
              Your privacy and trust are the foundation of that mission. We will never compromise your 
              privacy for profit or convenience.
            </p>
          </section>
        </div>

        {/* Back to Home */}
        <div className="text-center mt-8">
          <a 
            href="/" 
            className="inline-flex items-center text-green-600 hover:text-green-700 font-medium"
          >
            ← Back to ListeningRoom
          </a>
        </div>
      </div>
    </div>
  );
}