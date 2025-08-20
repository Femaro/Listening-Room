import {
  Heart,
  Users,
  MessageCircle,
  Shield,
  Clock,
  BookOpen,
  CheckCircle,
  ArrowRight,
  AlertTriangle,
  Star,
  Award,
} from "lucide-react";

export const metadata = {
  title: "Volunteer Guide - Mental Health Support Training | Listening Room",
  description: "Complete guide for mental health volunteers. Learn best practices, training requirements, safety protocols, and how to provide effective anonymous support.",
  keywords: "volunteer guide, mental health training, crisis support guide, volunteer best practices, listening skills, peer support training",
};

function MainComponent() {
  const guideSteps = [
    {
      step: 1,
      title: "Active Listening Fundamentals",
      description: "Master the core skill of providing mental health support",
      details: [
        "Give your full attention to the person seeking support",
        "Use reflective responses to show understanding",
        "Ask open-ended questions to encourage sharing",
        "Avoid judgment and offer unconditional support",
        "Practice patience - let them share at their own pace"
      ],
      icon: MessageCircle,
      color: "teal"
    },
    {
      step: 2,
      title: "Crisis Recognition",
      description: "Learn to identify and respond to mental health emergencies",
      details: [
        "Recognize warning signs of suicidal ideation",
        "Understand the difference between crisis and general support",
        "Know when to escalate to professional services",
        "Stay calm under pressure while taking action",
        "Follow platform protocols for emergency situations"
      ],
      icon: AlertTriangle,
      color: "red"
    },
    {
      step: 3,
      title: "Building Rapport",
      description: "Create safe, supportive connections with those seeking help",
      details: [
        "Use empathy to connect with their experience",
        "Validate their feelings without minimizing concerns",
        "Create a non-judgmental environment",
        "Respect their autonomy and decisions",
        "Show genuine care and concern"
      ],
      icon: Heart,
      color: "pink"
    },
    {
      step: 4,
      title: "Effective Communication",
      description: "Communicate clearly and supportively in text-based conversations",
      details: [
        "Use clear, simple language that's easy to understand",
        "Avoid mental health jargon or clinical terms",
        "Respond promptly but thoughtfully",
        "Use appropriate tone and emotional support",
        "Know when to ask clarifying questions"
      ],
      icon: Users,
      color: "blue"
    },
    {
      step: 5,
      title: "Self-Care & Boundaries",
      description: "Protect your own mental health while helping others",
      details: [
        "Set healthy boundaries with those you support",
        "Practice regular self-care and stress management",
        "Recognize when you need a break or support",
        "Don't take on more than you can handle",
        "Seek supervision when feeling overwhelmed"
      ],
      icon: Shield,
      color: "green"
    },
    {
      step: 6,
      title: "Platform Safety & Ethics",
      description: "Understand policies and maintain professional standards",
      details: [
        "Maintain complete confidentiality at all times",
        "Follow platform guidelines and code of conduct",
        "Never share personal information",
        "Report inappropriate behavior immediately",
        "Respect the anonymous nature of all interactions"
      ],
      icon: Star,
      color: "yellow"
    }
  ];

  const dosDonts = {
    dos: [
      {
        title: "Listen with empathy",
        description: "Show genuine care and understanding for their experience"
      },
      {
        title: "Validate their feelings",
        description: "Acknowledge that their emotions are real and important"
      },
      {
        title: "Ask open questions",
        description: "Encourage them to share more about their situation"
      },
      {
        title: "Stay patient",
        description: "Give them time to express themselves at their own pace"
      },
      {
        title: "Respect their choices",
        description: "Support their autonomy even if you disagree with decisions"
      },
      {
        title: "Know your limits",
        description: "Recognize when professional help is needed"
      }
    ],
    donts: [
      {
        title: "Give medical advice",
        description: "Never provide diagnosis, medication, or treatment recommendations"
      },
      {
        title: "Share personal details",
        description: "Maintain professional boundaries and don't over-share"
      },
      {
        title: "Make promises you can't keep",
        description: "Be honest about what you can and cannot do"
      },
      {
        title: "Judge or criticize",
        description: "Avoid being judgmental about their choices or situation"
      },
      {
        title: "Rush to solutions",
        description: "Focus on listening first before trying to solve problems"
      },
      {
        title: "Take things personally",
        description: "Remember their frustration isn't directed at you"
      }
    ]
  };

  const commonScenarios = [
    {
      scenario: "Someone expressing suicidal thoughts",
      response: "Take all mentions seriously, stay calm, ask direct questions about their safety, encourage them to call 988 or emergency services, and don't leave them alone until help arrives.",
      priority: "HIGH PRIORITY"
    },
    {
      scenario: "Someone feeling overwhelmed with anxiety",
      response: "Validate their feelings, help them focus on breathing or grounding techniques, encourage them to talk about what's causing the anxiety, and provide emotional support.",
      priority: "MEDIUM PRIORITY"
    },
    {
      scenario: "Someone dealing with relationship problems",
      response: "Listen without taking sides, help them explore their feelings, avoid giving specific relationship advice, and encourage them to consider their options carefully.",
      priority: "STANDARD SUPPORT"
    },
    {
      scenario: "Someone struggling with depression",
      response: "Offer compassionate support, validate their struggle, encourage professional help if symptoms are severe, and help them identify small, manageable steps forward.",
      priority: "MEDIUM PRIORITY"
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

      {/* Hero Section */}
      <section className="py-16 px-4 sm:px-6 lg:px-8 bg-gradient-to-br from-purple-50 to-indigo-50">
        <div className="max-w-4xl mx-auto text-center">
          <BookOpen className="w-16 h-16 text-purple-600 mx-auto mb-6" />
          <h1 className="text-4xl font-bold text-gray-900 mb-6">
            Mental Health Volunteer Guide
          </h1>
          <p className="text-xl text-gray-600 mb-8">
            A comprehensive guide to providing effective, safe, and compassionate mental health support as an anonymous volunteer listener.
          </p>
          <div className="flex flex-col sm:flex-row gap-4 justify-center">
            <a
              href="/volunteer"
              className="bg-purple-600 text-white px-8 py-4 rounded-lg font-semibold text-lg hover:bg-purple-700 transition-colors inline-flex items-center justify-center"
            >
              Apply to Volunteer
              <ArrowRight className="ml-2 w-5 h-5" />
            </a>
            <a
              href="/training"
              className="border-2 border-purple-600 text-purple-600 px-8 py-4 rounded-lg font-semibold text-lg hover:bg-purple-50 transition-colors"
            >
              View Training Program
            </a>
          </div>
        </div>
      </section>

      {/* Core Skills Guide */}
      <section className="py-16 px-4 sm:px-6 lg:px-8">
        <div className="max-w-6xl mx-auto">
          <h2 className="text-3xl font-bold text-center text-gray-900 mb-12">
            Essential Skills for Mental Health Volunteers
          </h2>
          
          <div className="space-y-8">
            {guideSteps.map((step, index) => (
              <div key={index} className="bg-white border border-gray-200 rounded-xl p-8">
                <div className="flex items-start space-x-6">
                  <div className={`w-16 h-16 bg-${step.color}-100 rounded-full flex items-center justify-center flex-shrink-0`}>
                    <step.icon className={`w-8 h-8 text-${step.color}-600`} />
                  </div>
                  <div className="flex-1">
                    <div className="flex items-center space-x-4 mb-4">
                      <div className="bg-gray-600 text-white w-8 h-8 rounded-full flex items-center justify-center font-bold text-sm">
                        {step.step}
                      </div>
                      <h3 className="text-2xl font-semibold text-gray-900">{step.title}</h3>
                    </div>
                    <p className="text-gray-600 mb-4 text-lg">{step.description}</p>
                    <ul className="space-y-2">
                      {step.details.map((detail, detailIndex) => (
                        <li key={detailIndex} className="flex items-start space-x-3">
                          <CheckCircle className="w-5 h-5 text-green-600 flex-shrink-0 mt-0.5" />
                          <span className="text-gray-700">{detail}</span>
                        </li>
                      ))}
                    </ul>
                  </div>
                </div>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* Dos and Don'ts */}
      <section className="py-16 px-4 sm:px-6 lg:px-8 bg-gray-50">
        <div className="max-w-4xl mx-auto">
          <h2 className="text-3xl font-bold text-center text-gray-900 mb-12">
            Volunteer Best Practices
          </h2>
          
          <div className="grid md:grid-cols-2 gap-8">
            <div>
              <h3 className="text-2xl font-semibold text-green-800 mb-6 flex items-center">
                <CheckCircle className="w-6 h-6 mr-2" />
                DO: Best Practices
              </h3>
              <div className="space-y-4">
                {dosDonts.dos.map((item, index) => (
                  <div key={index} className="bg-green-50 border border-green-200 rounded-lg p-4">
                    <h4 className="font-semibold text-green-800 mb-2">{item.title}</h4>
                    <p className="text-green-700 text-sm">{item.description}</p>
                  </div>
                ))}
              </div>
            </div>
            
            <div>
              <h3 className="text-2xl font-semibold text-red-800 mb-6 flex items-center">
                <AlertTriangle className="w-6 h-6 mr-2" />
                DON'T: Avoid These
              </h3>
              <div className="space-y-4">
                {dosDonts.donts.map((item, index) => (
                  <div key={index} className="bg-red-50 border border-red-200 rounded-lg p-4">
                    <h4 className="font-semibold text-red-800 mb-2">{item.title}</h4>
                    <p className="text-red-700 text-sm">{item.description}</p>
                  </div>
                ))}
              </div>
            </div>
          </div>
        </div>
      </section>

      {/* Common Scenarios */}
      <section className="py-16 px-4 sm:px-6 lg:px-8">
        <div className="max-w-4xl mx-auto">
          <h2 className="text-3xl font-bold text-center text-gray-900 mb-12">
            Common Support Scenarios
          </h2>
          
          <div className="space-y-6">
            {commonScenarios.map((item, index) => (
              <div key={index} className="bg-white border border-gray-200 rounded-lg p-6">
                <div className="flex items-start justify-between mb-4">
                  <h3 className="text-lg font-semibold text-gray-900">{item.scenario}</h3>
                  <span className={`px-3 py-1 rounded-full text-sm font-medium ${
                    item.priority === 'HIGH PRIORITY' ? 'bg-red-100 text-red-800' :
                    item.priority === 'MEDIUM PRIORITY' ? 'bg-yellow-100 text-yellow-800' :
                    'bg-green-100 text-green-800'
                  }`}>
                    {item.priority}
                  </span>
                </div>
                <div className="bg-gray-50 rounded-lg p-4">
                  <h4 className="font-semibold text-gray-900 mb-2">Recommended Response:</h4>
                  <p className="text-gray-700">{item.response}</p>
                </div>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* Crisis Protocols */}
      <section className="py-16 px-4 sm:px-6 lg:px-8 bg-red-50">
        <div className="max-w-4xl mx-auto">
          <h2 className="text-3xl font-bold text-center text-gray-900 mb-12">
            Crisis Support Protocols
          </h2>
          
          <div className="bg-white border-2 border-red-200 rounded-xl p-8">
            <div className="text-center mb-8">
              <AlertTriangle className="w-12 h-12 text-red-600 mx-auto mb-4" />
              <h3 className="text-2xl font-semibold text-red-800 mb-2">
                When Someone is in Crisis
              </h3>
              <p className="text-red-700">
                Follow these steps immediately if someone expresses thoughts of self-harm or suicide
              </p>
            </div>
            
            <div className="space-y-4">
              <div className="flex items-start space-x-4">
                <div className="bg-red-600 text-white w-8 h-8 rounded-full flex items-center justify-center font-bold flex-shrink-0">1</div>
                <div>
                  <h4 className="font-semibold text-gray-900 mb-1">Stay Calm & Take It Seriously</h4>
                  <p className="text-gray-600">Don't panic. All threats of self-harm must be taken seriously, even if they seem minor.</p>
                </div>
              </div>
              
              <div className="flex items-start space-x-4">
                <div className="bg-red-600 text-white w-8 h-8 rounded-full flex items-center justify-center font-bold flex-shrink-0">2</div>
                <div>
                  <h4 className="font-semibold text-gray-900 mb-1">Ask Direct Questions</h4>
                  <p className="text-gray-600">Are you thinking about hurting yourself? Do you have a plan? Do you have access to means?</p>
                </div>
              </div>
              
              <div className="flex items-start space-x-4">
                <div className="bg-red-600 text-white w-8 h-8 rounded-full flex items-center justify-center font-bold flex-shrink-0">3</div>
                <div>
                  <h4 className="font-semibold text-gray-900 mb-1">Encourage Professional Help</h4>
                  <p className="text-gray-600">Strongly encourage them to call 988 (Suicide Crisis Lifeline) or emergency services (911).</p>
                </div>
              </div>
              
              <div className="flex items-start space-x-4">
                <div className="bg-red-600 text-white w-8 h-8 rounded-full flex items-center justify-center font-bold flex-shrink-0">4</div>
                <div>
                  <h4 className="font-semibold text-gray-900 mb-1">Don't Leave Them Alone</h4>
                  <p className="text-gray-600">Stay in the conversation until they've contacted professional help or someone they trust is with them.</p>
                </div>
              </div>
              
              <div className="flex items-start space-x-4">
                <div className="bg-red-600 text-white w-8 h-8 rounded-full flex items-center justify-center font-bold flex-shrink-0">5</div>
                <div>
                  <h4 className="font-semibold text-gray-900 mb-1">Report to Platform</h4>
                  <p className="text-gray-600">Immediately notify our crisis response team through the platform's reporting system.</p>
                </div>
              </div>
            </div>
          </div>
        </div>
      </section>

      {/* Self-Care for Volunteers */}
      <section className="py-16 px-4 sm:px-6 lg:px-8">
        <div className="max-w-4xl mx-auto">
          <h2 className="text-3xl font-bold text-center text-gray-900 mb-12">
            Taking Care of Yourself
          </h2>
          
          <div className="bg-blue-50 border border-blue-200 rounded-xl p-8 text-center">
            <Shield className="w-12 h-12 text-blue-600 mx-auto mb-6" />
            <h3 className="text-2xl font-semibold text-gray-900 mb-4">
              Your Mental Health Matters Too
            </h3>
            <p className="text-lg text-gray-600 mb-8">
              Volunteering in mental health support can be emotionally demanding. It's essential to prioritize your own well-being.
            </p>
            
            <div className="grid md:grid-cols-2 gap-6 text-left">
              <div className="bg-white rounded-lg p-6">
                <h4 className="font-semibold text-gray-900 mb-3">Self-Care Strategies</h4>
                <ul className="space-y-2 text-gray-600">
                  <li>• Set clear boundaries between volunteer time and personal time</li>
                  <li>• Take regular breaks and don't overcommit</li>
                  <li>• Practice stress management techniques</li>
                  <li>• Maintain connections with friends and family</li>
                  <li>• Engage in activities you enjoy outside of volunteering</li>
                  <li>• Get adequate sleep, exercise, and nutrition</li>
                </ul>
              </div>
              
              <div className="bg-white rounded-lg p-6">
                <h4 className="font-semibold text-gray-900 mb-3">Warning Signs to Watch For</h4>
                <ul className="space-y-2 text-gray-600">
                  <li>• Feeling overwhelmed or burned out</li>
                  <li>• Taking on others' emotions as your own</li>
                  <li>• Difficulty sleeping or concentrating</li>
                  <li>• Feeling frustrated or impatient with those you help</li>
                  <li>• Neglecting your own needs and relationships</li>
                  <li>• Using unhealthy coping mechanisms</li>
                </ul>
              </div>
            </div>
            
            <div className="mt-8 bg-yellow-100 border border-yellow-200 rounded-lg p-6">
              <h4 className="font-semibold text-yellow-800 mb-2">Remember:</h4>
              <p className="text-yellow-700">
                You can't pour from an empty cup. Taking care of yourself isn't selfish - it's necessary for providing quality support to others. 
                If you're struggling, reach out for support just like you would encourage others to do.
              </p>
            </div>
          </div>
        </div>
      </section>

      {/* Get Started */}
      <section className="py-16 px-4 sm:px-6 lg:px-8 bg-purple-600 text-white">
        <div className="max-w-4xl mx-auto text-center">
          <Award className="w-12 h-12 mx-auto mb-6" />
          <h2 className="text-3xl font-bold mb-6">Ready to Make a Difference?</h2>
          <p className="text-xl mb-8 text-purple-100">
            Join our community of trained volunteer listeners and help provide hope and support to those who need it most.
          </p>
          <div className="flex flex-col sm:flex-row gap-4 justify-center">
            <a
              href="/volunteer"
              className="bg-white text-purple-600 px-8 py-4 rounded-lg font-semibold text-lg hover:bg-purple-50 transition-colors"
            >
              Apply to Volunteer
            </a>
            <a
              href="/training"
              className="border-2 border-white text-white px-8 py-4 rounded-lg font-semibold text-lg hover:bg-white hover:text-purple-600 transition-colors"
            >
              Learn About Training
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