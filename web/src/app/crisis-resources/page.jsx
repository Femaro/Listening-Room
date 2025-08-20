import {
  Phone,
  MessageCircle,
  Heart,
  Globe,
  Clock,
  AlertTriangle,
  Shield,
  Users,
  ExternalLink,
} from "lucide-react";

export const metadata = {
  title: "Crisis Resources - Immediate Mental Health Support & Hotlines",
  description: "Find immediate mental health crisis resources, suicide prevention hotlines, and emergency support services. Available 24/7 worldwide.",
  keywords: "crisis resources, suicide prevention, mental health emergency, crisis hotlines, immediate help, suicide hotline, mental health crisis",
};

function MainComponent() {
  const crisisResources = [
    {
      name: "988 Suicide & Crisis Lifeline",
      phone: "988",
      description: "24/7 free and confidential emotional support for people in suicidal crisis or emotional distress",
      country: "United States",
      website: "https://988lifeline.org",
      features: ["24/7", "Free", "Confidential", "Multilingual"]
    },
    {
      name: "Crisis Text Line",
      phone: "Text HOME to 741741",
      description: "Free, 24/7 crisis support via text message",
      country: "United States, Canada, UK, Ireland",
      website: "https://www.crisistextline.org",
      features: ["Text-based", "24/7", "Free", "Anonymous"]
    },
    {
      name: "National Suicide Prevention Lifeline",
      phone: "1-800-273-8255",
      description: "Alternative number for 988 Suicide & Crisis Lifeline",
      country: "United States",
      website: "https://suicidepreventionlifeline.org",
      features: ["24/7", "Free", "Confidential"]
    },
    {
      name: "SAMHSA National Helpline",
      phone: "1-800-662-4357",
      description: "Treatment referral and information service for mental health and substance abuse",
      country: "United States",
      website: "https://www.samhsa.gov/find-help/national-helpline",
      features: ["24/7", "Free", "Confidential", "Treatment Referrals"]
    }
  ];

  const internationalResources = [
    {
      country: "Australia",
      name: "Lifeline Australia",
      phone: "13 11 14",
      website: "https://www.lifeline.org.au"
    },
    {
      country: "United Kingdom",
      name: "Samaritans",
      phone: "116 123",
      website: "https://www.samaritans.org"
    },
    {
      country: "Canada",
      name: "Canada Suicide Prevention Service",
      phone: "1-833-456-4566",
      website: "https://www.crisisservicescanada.ca"
    },
    {
      country: "Germany",
      name: "Telefonseelsorge",
      phone: "0800 111 0 111 or 0800 111 0 222",
      website: "https://www.telefonseelsorge.de"
    },
    {
      country: "France",
      name: "SOS Amitié",
      phone: "09 72 39 40 50",
      website: "https://www.sos-amitie.com"
    },
    {
      country: "Japan",
      name: "TELL Lifeline",
      phone: "03-5774-0992",
      website: "https://telljp.com"
    }
  ];

  const onlineResources = [
    {
      name: "7 Cups",
      description: "Free online therapy and emotional support",
      website: "https://www.7cups.com",
      type: "Peer Support"
    },
    {
      name: "BetterHelp",
      description: "Professional online counseling and therapy",
      website: "https://www.betterhelp.com",
      type: "Professional Therapy"
    },
    {
      name: "National Alliance on Mental Illness (NAMI)",
      description: "Mental health education, support, and advocacy",
      website: "https://www.nami.org",
      type: "Education & Support"
    },
    {
      name: "Mental Health America",
      description: "Resources, screening tools, and support",
      website: "https://www.mhanational.org",
      type: "Resources & Screening"
    },
    {
      name: "Suicide Prevention Resource Center",
      description: "Prevention resources and training materials",
      website: "https://www.sprc.org",
      type: "Prevention Resources"
    }
  ];

  const emergencySteps = [
    {
      step: 1,
      title: "Call Emergency Services",
      description: "If someone is in immediate danger, call 911 (US), 999 (UK), or your local emergency number",
      icon: Phone,
      urgent: true
    },
    {
      step: 2,
      title: "Don't Leave Them Alone",
      description: "Stay with the person or ensure someone trustworthy is with them",
      icon: Users,
      urgent: true
    },
    {
      step: 3,
      title: "Remove Harmful Items",
      description: "Remove any means of self-harm from the immediate area",
      icon: Shield,
      urgent: true
    },
    {
      step: 4,
      title: "Call Crisis Hotline",
      description: "Contact a crisis hotline for professional guidance and support",
      icon: MessageCircle,
      urgent: false
    }
  ];

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

      {/* Emergency Banner */}
      <section className="bg-red-600 text-white py-4">
        <div className="max-w-6xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="flex items-center justify-center space-x-4 text-center">
            <AlertTriangle className="w-8 h-8 flex-shrink-0" />
            <div>
              <p className="font-semibold text-lg">🚨 CRISIS EMERGENCY 🚨</p>
              <p className="text-red-100">
                If you're in immediate danger: Call 911 (US) • 988 for Suicide Crisis • Text HOME to 741741
              </p>
            </div>
          </div>
        </div>
      </section>

      {/* Hero Section */}
      <section className="py-16 px-4 sm:px-6 lg:px-8 bg-gradient-to-br from-red-50 to-orange-50">
        <div className="max-w-4xl mx-auto text-center">
          <Heart className="w-16 h-16 text-red-600 mx-auto mb-6" />
          <h1 className="text-4xl font-bold text-gray-900 mb-6">
            Crisis Resources & Emergency Support
          </h1>
          <p className="text-xl text-gray-600 mb-8">
            If you're experiencing a mental health crisis, you're not alone. Immediate help is available 24/7 through these trusted resources.
          </p>
          <div className="bg-white border-2 border-red-200 rounded-lg p-6 inline-block">
            <p className="text-red-800 font-semibold mb-2">Remember: You matter. Your life has value.</p>
            <p className="text-gray-600">These feelings are temporary. Professional help is available right now.</p>
          </div>
        </div>
      </section>

      {/* Emergency Steps */}
      <section className="py-16 px-4 sm:px-6 lg:px-8 bg-red-50">
        <div className="max-w-4xl mx-auto">
          <h2 className="text-3xl font-bold text-center text-gray-900 mb-12">
            In a Mental Health Emergency
          </h2>
          
          <div className="space-y-6">
            {emergencySteps.map((step) => (
              <div key={step.step} className={`flex items-start space-x-4 p-6 rounded-lg ${step.urgent ? 'bg-red-100 border-2 border-red-300' : 'bg-white border border-gray-200'}`}>
                <div className={`flex-shrink-0 w-10 h-10 rounded-full flex items-center justify-center font-bold ${step.urgent ? 'bg-red-600 text-white' : 'bg-gray-600 text-white'}`}>
                  {step.step}
                </div>
                <div className="flex-1">
                  <h3 className={`text-xl font-semibold mb-2 ${step.urgent ? 'text-red-800' : 'text-gray-900'}`}>
                    {step.title}
                  </h3>
                  <p className={`${step.urgent ? 'text-red-700' : 'text-gray-600'}`}>
                    {step.description}
                  </p>
                </div>
                <step.icon className={`w-8 h-8 ${step.urgent ? 'text-red-600' : 'text-gray-600'}`} />
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* US Crisis Resources */}
      <section className="py-16 px-4 sm:px-6 lg:px-8">
        <div className="max-w-6xl mx-auto">
          <h2 className="text-3xl font-bold text-center text-gray-900 mb-12">
            United States Crisis Resources
          </h2>
          
          <div className="grid md:grid-cols-2 gap-6">
            {crisisResources.map((resource, index) => (
              <div key={index} className="bg-white border border-gray-200 rounded-lg p-6 shadow-sm">
                <h3 className="text-xl font-semibold text-gray-900 mb-2">{resource.name}</h3>
                <div className="flex items-center space-x-2 mb-3">
                  <Phone className="w-5 h-5 text-teal-600" />
                  <span className="font-bold text-2xl text-teal-600">{resource.phone}</span>
                </div>
                <p className="text-gray-600 mb-4">{resource.description}</p>
                <div className="flex flex-wrap gap-2 mb-4">
                  {resource.features.map((feature, idx) => (
                    <span key={idx} className="bg-teal-100 text-teal-800 px-2 py-1 rounded text-sm">
                      {feature}
                    </span>
                  ))}
                </div>
                <a
                  href={resource.website}
                  target="_blank"
                  rel="noopener noreferrer"
                  className="inline-flex items-center text-teal-600 hover:text-teal-700 font-medium"
                >
                  Visit Website
                  <ExternalLink className="ml-1 w-4 h-4" />
                </a>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* International Resources */}
      <section className="py-16 px-4 sm:px-6 lg:px-8 bg-gray-50">
        <div className="max-w-6xl mx-auto">
          <h2 className="text-3xl font-bold text-center text-gray-900 mb-12">
            International Crisis Resources
          </h2>
          
          <div className="grid md:grid-cols-2 lg:grid-cols-3 gap-6">
            {internationalResources.map((resource, index) => (
              <div key={index} className="bg-white border border-gray-200 rounded-lg p-6">
                <div className="flex items-center space-x-2 mb-3">
                  <Globe className="w-5 h-5 text-blue-600" />
                  <h3 className="font-semibold text-gray-900">{resource.country}</h3>
                </div>
                <h4 className="text-lg font-semibold text-gray-900 mb-2">{resource.name}</h4>
                <div className="flex items-center space-x-2 mb-3">
                  <Phone className="w-4 h-4 text-teal-600" />
                  <span className="font-bold text-teal-600">{resource.phone}</span>
                </div>
                <a
                  href={resource.website}
                  target="_blank"
                  rel="noopener noreferrer"
                  className="inline-flex items-center text-blue-600 hover:text-blue-700 font-medium text-sm"
                >
                  Visit Website
                  <ExternalLink className="ml-1 w-3 h-3" />
                </a>
              </div>
            ))}
          </div>
          
          <div className="mt-8 text-center">
            <p className="text-gray-600 mb-4">
              Don't see your country? Visit the International Association for Suicide Prevention for more resources.
            </p>
            <a
              href="https://www.iasp.info/resources/Crisis_Centres/"
              target="_blank"
              rel="noopener noreferrer"
              className="inline-flex items-center bg-blue-600 text-white px-6 py-3 rounded-lg font-medium hover:bg-blue-700 transition-colors"
            >
              Find More International Resources
              <ExternalLink className="ml-2 w-4 h-4" />
            </a>
          </div>
        </div>
      </section>

      {/* Online Resources */}
      <section className="py-16 px-4 sm:px-6 lg:px-8">
        <div className="max-w-6xl mx-auto">
          <h2 className="text-3xl font-bold text-center text-gray-900 mb-12">
            Online Mental Health Resources
          </h2>
          
          <div className="grid md:grid-cols-2 lg:grid-cols-3 gap-6">
            {onlineResources.map((resource, index) => (
              <div key={index} className="bg-white border border-gray-200 rounded-lg p-6 shadow-sm">
                <h3 className="text-lg font-semibold text-gray-900 mb-2">{resource.name}</h3>
                <p className="text-gray-600 mb-3">{resource.description}</p>
                <span className="inline-block bg-purple-100 text-purple-800 px-2 py-1 rounded text-sm mb-3">
                  {resource.type}
                </span>
                <br />
                <a
                  href={resource.website}
                  target="_blank"
                  rel="noopener noreferrer"
                  className="inline-flex items-center text-purple-600 hover:text-purple-700 font-medium"
                >
                  Visit Resource
                  <ExternalLink className="ml-1 w-4 h-4" />
                </a>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* Warning Signs */}
      <section className="py-16 px-4 sm:px-6 lg:px-8 bg-yellow-50">
        <div className="max-w-4xl mx-auto">
          <h2 className="text-3xl font-bold text-center text-gray-900 mb-12">
            Warning Signs to Watch For
          </h2>
          
          <div className="grid md:grid-cols-2 gap-8">
            <div>
              <h3 className="text-xl font-semibold text-red-800 mb-6">🚨 Immediate Danger Signs</h3>
              <ul className="space-y-2 text-gray-700">
                <li>• Talking about wanting to die or kill themselves</li>
                <li>• Looking for ways to kill themselves</li>
                <li>• Talking about feeling hopeless or having no purpose</li>
                <li>• Talking about feeling trapped or being in unbearable pain</li>
                <li>• Talking about being a burden to others</li>
                <li>• Increasing use of alcohol or drugs</li>
                <li>• Acting anxious, agitated, or reckless</li>
                <li>• Sleeping too little or too much</li>
                <li>• Withdrawing or feeling isolated</li>
                <li>• Showing rage or talking about seeking revenge</li>
                <li>• Displaying extreme mood swings</li>
              </ul>
            </div>
            
            <div>
              <h3 className="text-xl font-semibold text-orange-800 mb-6">⚠️ Other Warning Signs</h3>
              <ul className="space-y-2 text-gray-700">
                <li>• Giving away prized possessions</li>
                <li>• Saying goodbye to loved ones</li>
                <li>• Putting affairs in order</li>
                <li>• Making a will</li>
                <li>• Sudden improvement after depression</li>
                <li>• Changes in eating habits</li>
                <li>• Loss of interest in activities</li>
                <li>• Decline in work or school performance</li>
                <li>• Neglecting personal hygiene</li>
                <li>• Increased irritability</li>
                <li>• Social withdrawal</li>
              </ul>
            </div>
          </div>
          
          <div className="mt-8 bg-white border-2 border-red-200 rounded-lg p-6 text-center">
            <AlertTriangle className="w-12 h-12 text-red-600 mx-auto mb-4" />
            <h4 className="text-lg font-semibold text-red-800 mb-2">
              If you notice these signs in someone:
            </h4>
            <p className="text-gray-700">
              Don't wait. Reach out immediately. Ask directly if they're thinking about suicide. 
              Take all threats seriously and get professional help right away.
            </p>
          </div>
        </div>
      </section>

      {/* Support Someone */}
      <section className="py-16 px-4 sm:px-6 lg:px-8">
        <div className="max-w-4xl mx-auto">
          <h2 className="text-3xl font-bold text-center text-gray-900 mb-12">
            How to Support Someone in Crisis
          </h2>
          
          <div className="space-y-6">
            <div className="bg-green-50 border border-green-200 rounded-lg p-6">
              <h3 className="text-lg font-semibold text-green-800 mb-3">✓ What TO Do</h3>
              <ul className="space-y-2 text-green-700">
                <li>• Ask directly: "Are you thinking about killing yourself?"</li>
                <li>• Listen without judgment</li>
                <li>• Stay calm and supportive</li>
                <li>• Take all threats seriously</li>
                <li>• Help them contact professional support</li>
                <li>• Stay with them until help arrives</li>
                <li>• Follow up after the crisis</li>
                <li>• Take care of your own mental health too</li>
              </ul>
            </div>
            
            <div className="bg-red-50 border border-red-200 rounded-lg p-6">
              <h3 className="text-lg font-semibold text-red-800 mb-3">✗ What NOT to Do</h3>
              <ul className="space-y-2 text-red-700">
                <li>• Don't promise to keep it a secret</li>
                <li>• Don't leave them alone</li>
                <li>• Don't argue about whether life is worth living</li>
                <li>• Don't try to solve all their problems</li>
                <li>• Don't give advice or minimize their feelings</li>
                <li>• Don't act shocked or judgmental</li>
                <li>• Don't challenge them to follow through</li>
                <li>• Don't swear them to secrecy</li>
              </ul>
            </div>
          </div>
        </div>
      </section>

      {/* Self-Care */}
      <section className="py-16 px-4 sm:px-6 lg:px-8 bg-blue-50">
        <div className="max-w-4xl mx-auto text-center">
          <Heart className="w-12 h-12 text-blue-600 mx-auto mb-6" />
          <h2 className="text-3xl font-bold text-gray-900 mb-6">
            Taking Care of Yourself
          </h2>
          <p className="text-lg text-gray-600 mb-8">
            Supporting someone in crisis or experiencing your own mental health challenges can be emotionally draining. 
            Remember to take care of your own mental health too.
          </p>
          
          <div className="grid md:grid-cols-2 gap-6 text-left">
            <div className="bg-white rounded-lg p-6">
              <h3 className="text-lg font-semibold text-gray-900 mb-3">Self-Care Strategies</h3>
              <ul className="space-y-2 text-gray-600">
                <li>• Talk to a trusted friend or counselor</li>
                <li>• Practice relaxation techniques</li>
                <li>• Maintain regular sleep and eating habits</li>
                <li>• Exercise regularly</li>
                <li>• Limit alcohol and avoid drugs</li>
                <li>• Engage in activities you enjoy</li>
              </ul>
            </div>
            
            <div className="bg-white rounded-lg p-6">
              <h3 className="text-lg font-semibold text-gray-900 mb-3">When to Seek Help</h3>
              <ul className="space-y-2 text-gray-600">
                <li>• Persistent feelings of sadness or hopelessness</li>
                <li>• Loss of interest in daily activities</li>
                <li>• Changes in sleep or appetite</li>
                <li>• Difficulty concentrating</li>
                <li>• Thoughts of self-harm</li>
                <li>• Increased use of alcohol or drugs</li>
              </ul>
            </div>
          </div>
          
          <div className="mt-8">
            <a
              href="/account/signup"
              className="bg-teal-600 text-white px-8 py-4 rounded-lg font-semibold text-lg hover:bg-teal-700 transition-colors inline-flex items-center"
            >
              Get Anonymous Support Now
              <MessageCircle className="ml-2 w-5 h-5" />
            </a>
          </div>
        </div>
      </section>

      {/* Footer */}
      <footer className="bg-gray-900 text-white py-8 px-4 sm:px-6 lg:px-8">
        <div className="max-w-6xl mx-auto text-center">
          <p className="mb-2">&copy; 2025 Listening Room. All rights reserved.</p>
          <p className="text-gray-400 text-sm">
            This page is for informational purposes only and is not a substitute for professional medical advice.
          </p>
        </div>
      </footer>
    </div>
  );
}

export default MainComponent;