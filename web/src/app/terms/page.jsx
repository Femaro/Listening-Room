import { Heart, Shield, Users, AlertTriangle } from "lucide-react";

export default function TermsAndConditions() {
  return (
    <div className="min-h-screen bg-gray-50">
      <div className="max-w-4xl mx-auto px-4 py-8">
        {/* Header */}
        <div className="text-center mb-8">
          <div className="inline-flex items-center justify-center w-16 h-16 bg-blue-600 rounded-full mb-4">
            <Heart className="w-8 h-8 text-white" />
          </div>
          <h1 className="text-3xl font-bold text-gray-900 mb-2">
            Terms and Conditions
          </h1>
          <p className="text-gray-600">
            Last Updated: August 6, 2025
          </p>
        </div>

        <div className="bg-white rounded-lg shadow-lg p-8 space-y-8">
          {/* Introduction */}
          <section>
            <h2 className="text-2xl font-semibold text-gray-900 mb-4">
              1. Introduction
            </h2>
            <p className="text-gray-700 leading-relaxed mb-4">
              Welcome to ListeningRoom ("we," "our," or "us"). These Terms and Conditions ("Terms") 
              govern your use of our mental health peer support platform and services. By accessing 
              or using our platform, you agree to be bound by these Terms.
            </p>
            <div className="bg-blue-50 border border-blue-200 rounded-lg p-4">
              <div className="flex items-start">
                <Shield className="w-5 h-5 text-blue-600 mt-1 mr-2" />
                <p className="text-blue-800 text-sm">
                  <strong>Important:</strong> ListeningRoom provides peer support, not professional 
                  medical or psychological treatment. Our services supplement but do not replace 
                  professional mental health care.
                </p>
              </div>
            </div>
          </section>

          {/* Eligibility */}
          <section>
            <h2 className="text-2xl font-semibold text-gray-900 mb-4">
              2. Eligibility and Account Registration
            </h2>
            <div className="space-y-4">
              <div>
                <h3 className="text-lg font-medium text-gray-900 mb-2">Age Requirements</h3>
                <ul className="list-disc pl-5 text-gray-700 space-y-2">
                  <li>You must be at least 18 years old to use our services</li>
                  <li>Users aged 13-17 require parental consent and supervision</li>
                  <li>We do not knowingly collect information from children under 13</li>
                </ul>
              </div>
              <div>
                <h3 className="text-lg font-medium text-gray-900 mb-2">Account Responsibility</h3>
                <ul className="list-disc pl-5 text-gray-700 space-y-2">
                  <li>Provide accurate, current, and complete information</li>
                  <li>Maintain the security of your account credentials</li>
                  <li>Notify us immediately of unauthorized access</li>
                  <li>Accept responsibility for all activities under your account</li>
                </ul>
              </div>
            </div>
          </section>

          {/* Platform Rules */}
          <section>
            <h2 className="text-2xl font-semibold text-gray-900 mb-4">
              3. Platform Usage Rules
            </h2>
            <div className="space-y-6">
              <div>
                <h3 className="text-lg font-medium text-gray-900 mb-3 flex items-center">
                  <Users className="w-5 h-5 mr-2 text-green-600" />
                  Acceptable Use
                </h3>
                <ul className="list-disc pl-5 text-gray-700 space-y-2">
                  <li>Treat all users with respect and kindness</li>
                  <li>Share experiences and provide emotional support</li>
                  <li>Maintain confidentiality of shared information</li>
                  <li>Use the platform only for its intended peer support purpose</li>
                  <li>Report inappropriate behavior or safety concerns</li>
                </ul>
              </div>
              
              <div className="bg-red-50 border border-red-200 rounded-lg p-6">
                <h3 className="text-lg font-medium text-red-900 mb-3 flex items-center">
                  <AlertTriangle className="w-5 h-5 mr-2" />
                  Prohibited Activities
                </h3>
                <ul className="list-disc pl-5 text-red-800 space-y-2 text-sm">
                  <li><strong>Providing medical advice:</strong> Do not diagnose, prescribe medications, or provide professional medical guidance</li>
                  <li><strong>Harassment or abuse:</strong> No bullying, threatening, or discriminatory behavior</li>
                  <li><strong>Sharing personal information:</strong> Do not share phone numbers, addresses, or other private details</li>
                  <li><strong>Commercial activities:</strong> No advertising, selling, or promoting products/services</li>
                  <li><strong>Impersonation:</strong> Do not pretend to be someone else or misrepresent your qualifications</li>
                  <li><strong>Spam or disruption:</strong> No repetitive messaging or disruptive behavior</li>
                  <li><strong>Illegal activities:</strong> No discussion or encouragement of illegal actions</li>
                </ul>
              </div>
            </div>
          </section>

          {/* Crisis Situations */}
          <section>
            <h2 className="text-2xl font-semibold text-gray-900 mb-4">
              4. Crisis Situations and Emergency Procedures
            </h2>
            <div className="bg-orange-50 border border-orange-200 rounded-lg p-6 mb-4">
              <h3 className="text-lg font-semibold text-orange-900 mb-3">
                🚨 Immediate Danger Protocol
              </h3>
              <p className="text-orange-800 mb-3">
                If you or someone else is in immediate danger:
              </p>
              <ul className="list-disc pl-5 text-orange-800 space-y-1">
                <li>Call emergency services (911 in US, local emergency number elsewhere)</li>
                <li>Contact the National Suicide Prevention Lifeline: 988</li>
                <li>Visit your nearest emergency room</li>
                <li>Reach out to a trusted friend, family member, or mental health professional</li>
              </ul>
            </div>
            
            <div className="space-y-4">
              <h3 className="text-lg font-medium text-gray-900">Platform Limitations</h3>
              <ul className="list-disc pl-5 text-gray-700 space-y-2">
                <li>Our volunteers are not trained crisis counselors</li>
                <li>Platform may not be monitored 24/7</li>
                <li>Response times may vary based on volunteer availability</li>
                <li>We reserve the right to contact emergency services if we believe someone is in immediate danger</li>
              </ul>
            </div>
          </section>

          {/* Privacy and Confidentiality */}
          <section>
            <h2 className="text-2xl font-semibold text-gray-900 mb-4">
              5. Privacy and Confidentiality
            </h2>
            <div className="space-y-4">
              <p className="text-gray-700">
                We are committed to protecting your privacy and maintaining confidentiality:
              </p>
              <ul className="list-disc pl-5 text-gray-700 space-y-2">
                <li><strong>Chat Privacy:</strong> We do not store or record chat conversations</li>
                <li><strong>Anonymity:</strong> Users can remain anonymous if they choose</li>
                <li><strong>Data Minimization:</strong> We collect only necessary information for platform operation</li>
                <li><strong>No Sharing:</strong> We never share personal information with third parties without consent</li>
                <li><strong>Secure Storage:</strong> All data is encrypted and stored securely</li>
              </ul>
              <p className="text-sm text-gray-600 mt-4">
                For complete privacy details, see our <a href="/privacy" className="text-blue-600 hover:underline">Privacy Policy</a>.
              </p>
            </div>
          </section>

          {/* Volunteer Guidelines */}
          <section>
            <h2 className="text-2xl font-semibold text-gray-900 mb-4">
              6. Volunteer Guidelines
            </h2>
            <div className="space-y-4">
              <h3 className="text-lg font-medium text-gray-900">Additional Responsibilities for Volunteers</h3>
              <ul className="list-disc pl-5 text-gray-700 space-y-2">
                <li>Complete required training modules before providing support</li>
                <li>Stay within peer support boundaries - no professional advice</li>
                <li>Recognize when to refer users to professional resources</li>
                <li>Report safety concerns to platform administrators</li>
                <li>Maintain professional boundaries and avoid dual relationships</li>
                <li>Regularly update availability and honor scheduled commitments</li>
              </ul>
            </div>
          </section>

          {/* Liability and Disclaimers */}
          <section>
            <h2 className="text-2xl font-semibold text-gray-900 mb-4">
              7. Disclaimers and Limitation of Liability
            </h2>
            <div className="space-y-4">
              <div className="bg-yellow-50 border border-yellow-200 rounded-lg p-4">
                <h3 className="text-lg font-medium text-yellow-900 mb-2">Medical Disclaimer</h3>
                <p className="text-yellow-800 text-sm">
                  ListeningRoom is NOT a substitute for professional medical care, therapy, or crisis intervention. 
                  Our volunteers are peers, not licensed mental health professionals. Always consult qualified 
                  healthcare providers for medical advice, diagnosis, or treatment.
                </p>
              </div>
              
              <h3 className="text-lg font-medium text-gray-900">Platform Limitations</h3>
              <ul className="list-disc pl-5 text-gray-700 space-y-2">
                <li>We provide the platform "as is" without warranties of any kind</li>
                <li>We cannot guarantee continuous, uninterrupted service</li>
                <li>We are not responsible for the content of user communications</li>
                <li>We cannot guarantee the accuracy or helpfulness of peer support</li>
                <li>Technical issues may occasionally affect platform functionality</li>
              </ul>
            </div>
          </section>

          {/* Enforcement */}
          <section>
            <h2 className="text-2xl font-semibold text-gray-900 mb-4">
              8. Enforcement and Account Actions
            </h2>
            <div className="space-y-4">
              <p className="text-gray-700">
                We reserve the right to take the following actions for Terms violations:
              </p>
              <ul className="list-disc pl-5 text-gray-700 space-y-2">
                <li><strong>Warning:</strong> First-time minor violations</li>
                <li><strong>Temporary suspension:</strong> Repeated violations or moderate offenses</li>
                <li><strong>Permanent ban:</strong> Severe violations or repeated offenses after warnings</li>
                <li><strong>Legal action:</strong> For illegal activities or serious harm to others</li>
                <li><strong>Emergency contact:</strong> For immediate safety concerns</li>
              </ul>
            </div>
          </section>

          {/* Changes to Terms */}
          <section>
            <h2 className="text-2xl font-semibold text-gray-900 mb-4">
              9. Changes to Terms
            </h2>
            <p className="text-gray-700 mb-4">
              We may update these Terms periodically. When we do:
            </p>
            <ul className="list-disc pl-5 text-gray-700 space-y-2">
              <li>We'll update the "Last Updated" date at the top</li>
              <li>We'll notify users of significant changes</li>
              <li>Continued use after changes constitutes acceptance</li>
              <li>You should review Terms regularly for updates</li>
            </ul>
          </section>

          {/* Contact Information */}
          <section className="border-t pt-6">
            <h2 className="text-2xl font-semibold text-gray-900 mb-4">
              10. Contact Us
            </h2>
            <div className="bg-gray-50 rounded-lg p-4">
              <p className="text-gray-700 mb-2">
                Questions about these Terms? Contact us:
              </p>
              <ul className="text-gray-700">
                <li><strong>Email:</strong> joshuanwamuoh@gmail.com</li>
                <li><strong>Platform:</strong> Use the contact form in your dashboard</li>
                <li><strong>Response Time:</strong> We aim to respond within 48 hours</li>
              </ul>
            </div>
          </section>

          {/* Acceptance */}
          <section className="bg-blue-50 border border-blue-200 rounded-lg p-6 text-center">
            <h3 className="text-lg font-semibold text-blue-900 mb-2">
              Agreement to Terms
            </h3>
            <p className="text-blue-800">
              By using ListeningRoom, you acknowledge that you have read, understood, 
              and agree to be bound by these Terms and Conditions. If you do not agree 
              to these Terms, please do not use our platform.
            </p>
          </section>
        </div>

        {/* Back to Home */}
        <div className="text-center mt-8">
          <a 
            href="/" 
            className="inline-flex items-center text-blue-600 hover:text-blue-700 font-medium"
          >
            ← Back to ListeningRoom
          </a>
        </div>
      </div>
    </div>
  );
}