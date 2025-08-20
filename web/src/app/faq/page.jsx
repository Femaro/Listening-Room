import { useState } from "react";
import {
  ChevronDown,
  ChevronUp,
  HelpCircle,
  Shield,
  MessageCircle,
  Users,
  Clock,
  Heart,
  Zap,
} from "lucide-react";

export const metadata = {
  title:
    "FAQ - Frequently Asked Questions | Listening Room Mental Health Support",
  description:
    "Find answers to common questions about anonymous mental health support, crisis chat, volunteer training, privacy, and safety on Listening Room.",
  keywords:
    "FAQ, mental health questions, anonymous chat FAQ, crisis support questions, volunteer FAQ, privacy questions, safety FAQ",
};

function MainComponent() {
  const [openQuestion, setOpenQuestion] = useState(null);

  const toggleQuestion = (index) => {
    setOpenQuestion(openQuestion === index ? null : index);
  };

  const faqCategories = [
    {
      title: "Getting Started",
      icon: Zap,
      color: "text-teal-600",
      bgColor: "bg-teal-50",
      questions: [
        {
          q: "How do I get mental health support on Listening Room?",
          a: "Getting support is simple: 1) Create a free account with just your email and a username, 2) Complete your anonymous profile setup, 3) Click 'Start Chat' to be instantly connected with a trained volunteer listener. The entire process takes less than 5 minutes.",
        },
        {
          q: "Is Listening Room really free?",
          a: "Yes, absolutely! All mental health support services on Listening Room are completely free. We believe mental health support should be accessible to everyone, regardless of financial situation. We operate through donations and grants to keep our services free.",
        },
        {
          q: "Do I need to provide personal information?",
          a: "No. We only require an email address for account access and a username of your choice. No real names, phone numbers, addresses, or other personal identifying information is required. Your privacy and anonymity are our top priorities.",
        },
        {
          q: "What if no volunteers are available?",
          a: "Our volunteers are available 24/7, but during peak times there may be a short wait. If no volunteers are immediately available, you'll be placed in a queue and matched with the next available listener. For immediate crisis situations, we provide direct links to emergency hotlines.",
        },
      ],
    },
    {
      title: "Privacy & Safety",
      icon: Shield,
      color: "text-emerald-600",
      bgColor: "bg-emerald-50",
      questions: [
        {
          q: "How anonymous am I really?",
          a: "Completely anonymous. You choose your username, no real names are used, and we never store your chat conversations. Even our volunteers only see your chosen username. We use end-to-end encryption and never link your account to your real identity.",
        },
        {
          q: "Are my conversations stored or recorded?",
          a: "No. All chat content is automatically deleted when your session ends. We never store, record, or have access to your conversations. This ensures complete privacy and encourages open, honest communication.",
        },
        {
          q: "What happens in a crisis situation?",
          a: "Our volunteers are trained in crisis recognition and response. If you're in immediate danger, they'll guide you to contact emergency services (911) or crisis hotlines (988). We have protocols to ensure you get the professional help you need while respecting your privacy.",
        },
        {
          q: "Can I trust the volunteers?",
          a: "Yes. All volunteers undergo background checks, comprehensive training in mental health support and crisis recognition, and ongoing supervision. They're bound by strict confidentiality guidelines and are regularly evaluated to ensure quality support.",
        },
        {
          q: "What if someone is inappropriate or makes me uncomfortable?",
          a: "You can end any conversation immediately and report inappropriate behavior. All reports are investigated quickly and confidentially. Volunteers who violate our guidelines are removed from the platform immediately.",
        },
      ],
    },
    {
      title: "Support Services",
      icon: MessageCircle,
      color: "text-orange-600",
      bgColor: "bg-orange-50",
      questions: [
        {
          q: "What kinds of mental health issues can you help with?",
          a: "Our volunteers provide emotional support for a wide range of mental health concerns including depression, anxiety, stress, loneliness, relationship issues, grief, work problems, and general life challenges. For severe mental health conditions, we recommend professional therapy in addition to peer support.",
        },
        {
          q: "How long can I talk with a volunteer?",
          a: "There's no set time limit. Sessions typically last 30-90 minutes, but you can talk as long or as little as you need. You're in complete control - you can end the conversation anytime, and you can return for support as often as needed.",
        },
        {
          q: "Are your volunteers qualified mental health professionals?",
          a: "Our volunteers are trained peer supporters, not licensed therapists or counselors. They receive extensive training in active listening, crisis recognition, and emotional support. For professional therapy or medical treatment, we can help connect you with licensed professionals in your area.",
        },
        {
          q: "Can I request to talk to the same volunteer again?",
          a: "To maintain anonymity and prevent dependency, we don't offer the ability to request specific volunteers. However, all our volunteers receive the same high-quality training and follow the same supportive approach.",
        },
        {
          q: "What if I'm not comfortable with text chat?",
          a: "Currently, we only offer text-based support to ensure complete anonymity and security. Many people find text communication less intimidating and easier for discussing sensitive topics. You can take time to think about your responses and express yourself at your own pace.",
        },
      ],
    },
    {
      title: "Volunteering",
      icon: Users,
      color: "text-purple-600",
      bgColor: "bg-purple-50",
      questions: [
        {
          q: "How do I become a volunteer listener?",
          a: "Visit our volunteer application page, fill out the detailed application including your background and motivation, undergo our interview process, pass a background check, complete our comprehensive 20+ hour training program, and complete supervised practice sessions before becoming an active volunteer.",
        },
        {
          q: "What qualifications do I need to volunteer?",
          a: "You need to be at least 18 years old, have reliable internet access, commit to at least 4 hours per week, and demonstrate empathy and good communication skills. While mental health experience is helpful, it's not required - we provide all the training you need.",
        },
        {
          q: "How much time do I need to commit as a volunteer?",
          a: "We ask for a minimum commitment of 4 hours per week for at least 6 months. You can set your own schedule and volunteer from anywhere. Many volunteers start with 4-6 hours weekly and increase their availability over time.",
        },
        {
          q: "What training do volunteers receive?",
          a: "Volunteers complete 20+ hours of training covering active listening skills, crisis recognition and response, mental health awareness, platform safety protocols, and ethical guidelines. Training includes supervised practice sessions and ongoing education opportunities.",
        },
        {
          q: "Is volunteer training free?",
          a: "Yes, all volunteer training is provided free of charge. We invest in comprehensive training because we believe quality preparation leads to better support for those seeking help.",
        },
      ],
    },
    {
      title: "Technical Questions",
      icon: HelpCircle,
      color: "text-blue-600",
      bgColor: "bg-blue-50",
      questions: [
        {
          q: "What devices can I use to access Listening Room?",
          a: "Listening Room works on any device with internet access - computers, tablets, smartphones. Our platform is web-based, so you don't need to download any apps. Simply visit our website from any modern browser.",
        },
        {
          q: "Do you have a mobile app?",
          a: "We're currently web-based for maximum security and accessibility. You can access Listening Room from your phone's browser just like on a computer. We may develop mobile apps in the future based on user needs.",
        },
        {
          q: "What if I have technical problems during a chat session?",
          a: "If you experience technical issues, try refreshing your browser first. If problems persist, you can contact our technical support. For immediate mental health needs, we always provide backup access methods and crisis resource contact information.",
        },
        {
          q: "Is my data secure?",
          a: "Yes. We use industry-standard SSL/TLS encryption for all data transmission, secure cloud hosting with 24/7 monitoring, regular security audits, and we never store your personal conversations. Your data security is a top priority.",
        },
      ],
    },
    {
      title: "About Listening Room",
      icon: Heart,
      color: "text-red-600",
      bgColor: "bg-red-50",
      questions: [
        {
          q: "Who runs Listening Room?",
          a: "Listening Room is operated by CLAEVA INTERNATIONAL, a mental health advocacy organization dedicated to making mental health support accessible to everyone. We're supported by donations, grants, and partnerships with mental health organizations.",
        },
        {
          q: "How is Listening Room funded?",
          a: "We operate through individual donations, corporate sponsorships, and grants from mental health organizations. All funding goes directly to maintaining our platform, training volunteers, and expanding our services. We publish annual transparency reports showing how donations are used.",
        },
        {
          q: "Can I donate to support Listening Room?",
          a: "Yes! Donations help us keep our services free and expand our reach. You can make one-time or recurring donations through our secure donation page. Every contribution, no matter the size, helps us provide free mental health support to those who need it.",
        },
        {
          q: "Are you available internationally?",
          a: "Yes, Listening Room is available worldwide. We have volunteers who speak multiple languages and provide support across different time zones. We also provide links to local crisis resources for different countries.",
        },
        {
          q: "How do you measure your impact?",
          a: "We track anonymous metrics like number of support sessions, user feedback ratings, and volunteer training completions. We regularly survey users (anonymously) about their experience and publish annual impact reports showing how we're helping the mental health community.",
        },
      ],
    },
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
      <section className="py-16 px-4 sm:px-6 lg:px-8 bg-gradient-to-br from-blue-50 to-indigo-50">
        <div className="max-w-4xl mx-auto text-center">
          <img
            src="https://ucarecdn.com/dc54868d-20c4-46fa-b583-6f27b18e95b5/-/format/auto/"
            alt="ListeningRoom Logo"
            className="h-16 object-contain mx-auto mb-6"
          />
          <h1 className="text-4xl font-bold text-gray-900 mb-6">
            Frequently Asked Questions
          </h1>
          <p className="text-xl text-gray-600 mb-8">
            Find answers to common questions about anonymous mental health
            support, privacy, volunteering, and how Listening Room works.
          </p>
        </div>
      </section>

      {/* Quick Access */}
      <section className="py-8 px-4 sm:px-6 lg:px-8 bg-gray-50">
        <div className="max-w-4xl mx-auto">
          <h2 className="text-lg font-semibold text-gray-900 mb-4 text-center">
            Jump to Section:
          </h2>
          <div className="flex flex-wrap justify-center gap-2">
            {faqCategories.map((category, index) => (
              <a
                key={index}
                href={`#${category.title.toLowerCase().replace(/\s+/g, "-")}`}
                className={`inline-flex items-center space-x-2 px-4 py-2 rounded-lg ${category.bgColor} ${category.color} hover:opacity-80 transition-opacity text-sm font-medium`}
              >
                <category.icon className="w-4 h-4" />
                <span>{category.title}</span>
              </a>
            ))}
          </div>
        </div>
      </section>

      {/* FAQ Categories */}
      <section className="py-16 px-4 sm:px-6 lg:px-8">
        <div className="max-w-4xl mx-auto space-y-12">
          {faqCategories.map((category, categoryIndex) => (
            <div
              key={categoryIndex}
              id={category.title.toLowerCase().replace(/\s+/g, "-")}
            >
              <div className="flex items-center space-x-3 mb-8">
                <div
                  className={`w-12 h-12 rounded-full ${category.bgColor} flex items-center justify-center`}
                >
                  <category.icon className={`w-6 h-6 ${category.color}`} />
                </div>
                <h2 className="text-2xl font-bold text-gray-900">
                  {category.title}
                </h2>
              </div>

              <div className="space-y-4">
                {category.questions.map((faq, questionIndex) => {
                  const globalIndex = categoryIndex * 100 + questionIndex;
                  const isOpen = openQuestion === globalIndex;

                  return (
                    <div
                      key={questionIndex}
                      className="bg-white border border-gray-200 rounded-lg"
                    >
                      <button
                        onClick={() => toggleQuestion(globalIndex)}
                        className="w-full text-left p-6 focus:outline-none focus:ring-2 focus:ring-teal-500 focus:ring-inset"
                      >
                        <div className="flex justify-between items-start">
                          <h3 className="text-lg font-semibold text-gray-900 pr-4">
                            {faq.q}
                          </h3>
                          {isOpen ? (
                            <ChevronUp className="w-5 h-5 text-gray-500 flex-shrink-0 mt-1" />
                          ) : (
                            <ChevronDown className="w-5 h-5 text-gray-500 flex-shrink-0 mt-1" />
                          )}
                        </div>
                      </button>

                      {isOpen && (
                        <div className="px-6 pb-6">
                          <div className="border-t border-gray-200 pt-4">
                            <p className="text-gray-600 leading-relaxed">
                              {faq.a}
                            </p>
                          </div>
                        </div>
                      )}
                    </div>
                  );
                })}
              </div>
            </div>
          ))}
        </div>
      </section>

      {/* Still Have Questions */}
      <section className="py-16 px-4 sm:px-6 lg:px-8 bg-teal-50">
        <div className="max-w-4xl mx-auto text-center">
          <MessageCircle className="w-12 h-12 text-teal-600 mx-auto mb-6" />
          <h2 className="text-3xl font-bold text-gray-900 mb-6">
            Still Have Questions?
          </h2>
          <p className="text-lg text-gray-600 mb-8">
            Can't find the answer you're looking for? We're here to help.
          </p>

          <div className="grid md:grid-cols-3 gap-6">
            <div className="bg-white rounded-lg p-6 shadow-sm">
              <MessageCircle className="w-8 h-8 text-teal-600 mx-auto mb-3" />
              <h3 className="font-semibold text-gray-900 mb-2">Get Support</h3>
              <p className="text-sm text-gray-600 mb-4">
                Connect with a volunteer to ask questions about our mental
                health support services.
              </p>
              <a
                href="/account/signup"
                className="bg-teal-600 text-white px-4 py-2 rounded-lg text-sm font-medium hover:bg-teal-700 transition-colors"
              >
                Start Free Chat
              </a>
            </div>

            <div className="bg-white rounded-lg p-6 shadow-sm">
              <Users className="w-8 h-8 text-purple-600 mx-auto mb-3" />
              <h3 className="font-semibold text-gray-900 mb-2">
                Volunteer Info
              </h3>
              <p className="text-sm text-gray-600 mb-4">
                Learn more about becoming a volunteer mental health listener.
              </p>
              <a
                href="/volunteer"
                className="bg-purple-600 text-white px-4 py-2 rounded-lg text-sm font-medium hover:bg-purple-700 transition-colors"
              >
                Learn More
              </a>
            </div>

            <div className="bg-white rounded-lg p-6 shadow-sm">
              <Heart className="w-8 h-8 text-orange-600 mx-auto mb-3" />
              <h3 className="font-semibold text-gray-900 mb-2">Contact Us</h3>
              <p className="text-sm text-gray-600 mb-4">
                Reach out to our team with specific questions or feedback.
              </p>
              <a
                href="/contact"
                className="bg-orange-600 text-white px-4 py-2 rounded-lg text-sm font-medium hover:bg-orange-700 transition-colors"
              >
                Contact Us
              </a>
            </div>
          </div>
        </div>
      </section>

      {/* Crisis Resources */}
      <section className="py-8 px-4 sm:px-6 lg:px-8 bg-red-50 border-t border-red-200">
        <div className="max-w-4xl mx-auto text-center">
          <h3 className="text-lg font-semibold text-red-800 mb-2">
            🚨 Need Immediate Help?
          </h3>
          <p className="text-red-700 mb-4">
            If you're in crisis or having thoughts of self-harm, don't wait. Get
            help right now.
          </p>
          <div className="flex flex-wrap justify-center gap-4">
            <span className="bg-red-600 text-white px-4 py-2 rounded-lg font-medium">
              Call 988 (US Crisis Lifeline)
            </span>
            <span className="bg-red-600 text-white px-4 py-2 rounded-lg font-medium">
              Text HOME to 741741
            </span>
            <a
              href="/crisis-resources"
              className="border-2 border-red-600 text-red-600 px-4 py-2 rounded-lg font-medium hover:bg-red-600 hover:text-white transition-colors"
            >
              All Crisis Resources
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
