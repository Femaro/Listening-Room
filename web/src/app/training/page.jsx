import {
  BookOpen,
  Users,
  Clock,
  Award,
  CheckCircle,
  ArrowRight,
  Play,
  FileText,
  Video,
  Headphones,
  MessageCircle,
  Target,
  Star,
} from "lucide-react";

export const metadata = {
  title: "Mental Health Volunteer Training Program | Listening Room",
  description:
    "Comprehensive training program for mental health volunteers. Learn active listening, crisis intervention, and peer support skills. Free 20+ hour program.",
  keywords:
    "mental health training, volunteer training program, active listening training, crisis intervention, peer support certification, mental health education",
};

function MainComponent() {
  const trainingModules = [
    {
      id: 1,
      title: "Introduction to Mental Health Support",
      duration: "2 hours",
      type: "Video + Reading",
      description:
        "Overview of mental health conditions, stigma, and the role of peer support",
      topics: [
        "Understanding mental health vs mental illness",
        "Common mental health conditions",
        "Breaking down stigma and misconceptions",
        "The importance of peer support",
        "Your role as a volunteer listener",
      ],
      icon: BookOpen,
      status: "required",
    },
    {
      id: 2,
      title: "Active Listening Skills",
      duration: "3 hours",
      type: "Interactive + Practice",
      description:
        "Master the fundamental skill of providing supportive, non-judgmental listening",
      topics: [
        "Core principles of active listening",
        "Reflective listening techniques",
        "Asking open-ended questions",
        "Non-verbal communication in text",
        "Building rapport and trust",
      ],
      icon: Headphones,
      status: "required",
    },
    {
      id: 3,
      title: "Crisis Recognition & Response",
      duration: "4 hours",
      type: "Video + Scenarios",
      description:
        "Learn to identify crisis situations and respond appropriately to save lives",
      topics: [
        "Warning signs of suicidal ideation",
        "Risk assessment techniques",
        "De-escalation strategies",
        "Emergency protocols and resources",
        "When and how to involve professionals",
      ],
      icon: Target,
      status: "required",
    },
    {
      id: 4,
      title: "Effective Communication",
      duration: "2.5 hours",
      type: "Interactive + Writing",
      description:
        "Communicate clearly and supportively in anonymous text-based conversations",
      topics: [
        "Written communication best practices",
        "Tone and empathy in text",
        "Avoiding triggering language",
        "Cultural sensitivity",
        "Handling difficult conversations",
      ],
      icon: MessageCircle,
      status: "required",
    },
    {
      id: 5,
      title: "Boundaries & Self-Care",
      duration: "2 hours",
      type: "Video + Reflection",
      description:
        "Protect your mental health while providing support to others",
      topics: [
        "Setting healthy boundaries",
        "Recognizing burnout symptoms",
        "Self-care strategies for volunteers",
        "Secondary trauma prevention",
        "Seeking support when needed",
      ],
      icon: Users,
      status: "required",
    },
    {
      id: 6,
      title: "Platform Safety & Ethics",
      duration: "1.5 hours",
      type: "Reading + Quiz",
      description: "Understand platform policies, ethics, and safety protocols",
      topics: [
        "Confidentiality and anonymity",
        "Code of conduct for volunteers",
        "Reporting procedures",
        "Data protection and privacy",
        "Professional boundaries",
      ],
      icon: Award,
      status: "required",
    },
    {
      id: 7,
      title: "Specialized Topics",
      duration: "3 hours",
      type: "Video + Discussion",
      description:
        "Deep dive into specific mental health challenges and populations",
      topics: [
        "Depression and anxiety disorders",
        "Trauma-informed approaches",
        "Supporting LGBTQ+ individuals",
        "Cultural competency",
        "Substance abuse issues",
      ],
      icon: Star,
      status: "elective",
    },
    {
      id: 8,
      title: "Practice Sessions",
      duration: "4 hours",
      type: "Supervised Practice",
      description:
        "Apply your skills in guided practice with experienced volunteers",
      topics: [
        "Role-playing exercises",
        "Supervised chat sessions",
        "Feedback and coaching",
        "Skill refinement",
        "Confidence building",
      ],
      icon: Play,
      status: "required",
    },
  ];

  const certificationLevels = [
    {
      level: "Foundation Certification",
      requirements: "Complete modules 1-6 + practice sessions",
      hours: "18 hours",
      description: "Basic certification to start volunteering with supervision",
      benefits: [
        "Start taking supervised sessions",
        "Access to peer support groups",
        "Continued training opportunities",
        "Recognition certificate",
      ],
    },
    {
      level: "Advanced Certification",
      requirements: "Foundation + Module 7 + 20 supervised sessions",
      hours: "25+ hours",
      description: "Full certification for independent volunteer work",
      benefits: [
        "Volunteer independently",
        "Mentor new volunteers",
        "Access to advanced training",
        "Priority scheduling options",
      ],
    },
  ];

  const learningMethods = [
    {
      icon: Video,
      title: "Interactive Videos",
      description:
        "Engaging video content with real-world scenarios and expert instruction",
    },
    {
      icon: FileText,
      title: "Reading Materials",
      description:
        "Comprehensive guides, research papers, and best practice resources",
    },
    {
      icon: Users,
      title: "Group Discussions",
      description: "Connect with other trainees and experienced volunteers",
    },
    {
      icon: Play,
      title: "Practical Exercises",
      description: "Hands-on practice with role-playing and simulation",
    },
    {
      icon: Headphones,
      title: "Audio Resources",
      description: "Podcasts and audio lectures for flexible learning",
    },
    {
      icon: MessageCircle,
      title: "Supervised Practice",
      description: "Real-world application with experienced mentors",
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
      <section className="py-16 px-4 sm:px-6 lg:px-8 bg-gradient-to-br from-green-50 to-emerald-50">
        <div className="max-w-4xl mx-auto text-center">
          <img
            src="https://ucarecdn.com/dc54868d-20c4-46fa-b583-6f27b18e95b5/-/format/auto/"
            alt="ListeningRoom Logo"
            className="h-16 object-contain mx-auto mb-6"
          />
          <h1 className="text-4xl font-bold text-gray-900 mb-6">
            Mental Health Volunteer Training Program
          </h1>
          <p className="text-xl text-gray-600 mb-8">
            Comprehensive, free training to prepare you for providing
            life-saving mental health support. Learn from experts and practice
            with experienced volunteers.
          </p>
          <div className="flex flex-col sm:flex-row gap-4 justify-center">
            <a
              href="/volunteer"
              className="bg-green-600 text-white px-8 py-4 rounded-lg font-semibold text-lg hover:bg-green-700 transition-colors inline-flex items-center justify-center"
            >
              Apply for Training
              <ArrowRight className="ml-2 w-5 h-5" />
            </a>
            <a
              href="/volunteer-guide"
              className="border-2 border-green-600 text-green-600 px-8 py-4 rounded-lg font-semibold text-lg hover:bg-green-50 transition-colors"
            >
              Volunteer Guide
            </a>
          </div>
        </div>
      </section>

      {/* Training Overview */}
      <section className="py-16 px-4 sm:px-6 lg:px-8">
        <div className="max-w-6xl mx-auto">
          <h2 className="text-3xl font-bold text-center text-gray-900 mb-12">
            Training Program Overview
          </h2>

          <div className="grid md:grid-cols-3 gap-8 text-center mb-12">
            <div>
              <Clock className="w-12 h-12 text-green-600 mx-auto mb-4" />
              <h3 className="text-2xl font-bold text-gray-900 mb-2">
                20+ Hours
              </h3>
              <p className="text-gray-600">
                Comprehensive training program covering all essential skills
              </p>
            </div>
            <div>
              <Users className="w-12 h-12 text-blue-600 mx-auto mb-4" />
              <h3 className="text-2xl font-bold text-gray-900 mb-2">
                Expert-Led
              </h3>
              <p className="text-gray-600">
                Training developed and led by mental health professionals
              </p>
            </div>
            <div>
              <Award className="w-12 h-12 text-purple-600 mx-auto mb-4" />
              <h3 className="text-2xl font-bold text-gray-900 mb-2">
                Certified
              </h3>
              <p className="text-gray-600">
                Receive official certification upon successful completion
              </p>
            </div>
          </div>

          <div className="bg-teal-50 border border-teal-200 rounded-xl p-8 text-center">
            <h3 className="text-2xl font-semibold text-teal-800 mb-4">
              100% Free Training
            </h3>
            <p className="text-teal-700 mb-6">
              All training materials, resources, and certification are provided
              at no cost. We believe in removing barriers to mental health
              advocacy.
            </p>
            <div className="flex flex-wrap justify-center gap-4">
              <span className="bg-white text-teal-700 px-4 py-2 rounded-lg font-medium">
                No Hidden Fees
              </span>
              <span className="bg-white text-teal-700 px-4 py-2 rounded-lg font-medium">
                All Materials Included
              </span>
              <span className="bg-white text-teal-700 px-4 py-2 rounded-lg font-medium">
                Ongoing Support
              </span>
            </div>
          </div>
        </div>
      </section>

      {/* Training Modules */}
      <section className="py-16 px-4 sm:px-6 lg:px-8 bg-gray-50">
        <div className="max-w-6xl mx-auto">
          <h2 className="text-3xl font-bold text-center text-gray-900 mb-12">
            Training Modules
          </h2>

          <div className="space-y-6">
            {trainingModules.map((module, index) => (
              <div
                key={index}
                className="bg-white border border-gray-200 rounded-xl p-6"
              >
                <div className="flex items-start space-x-6">
                  <div
                    className={`w-14 h-14 rounded-lg flex items-center justify-center flex-shrink-0 ${
                      module.status === "required"
                        ? "bg-green-100"
                        : "bg-blue-100"
                    }`}
                  >
                    <module.icon
                      className={`w-7 h-7 ${
                        module.status === "required"
                          ? "text-green-600"
                          : "text-blue-600"
                      }`}
                    />
                  </div>
                  <div className="flex-1">
                    <div className="flex items-center justify-between mb-2">
                      <div className="flex items-center space-x-4">
                        <h3 className="text-xl font-semibold text-gray-900">
                          Module {module.id}: {module.title}
                        </h3>
                        <span
                          className={`px-3 py-1 rounded-full text-sm font-medium ${
                            module.status === "required"
                              ? "bg-green-100 text-green-800"
                              : "bg-blue-100 text-blue-800"
                          }`}
                        >
                          {module.status === "required"
                            ? "Required"
                            : "Elective"}
                        </span>
                      </div>
                    </div>

                    <div className="flex items-center space-x-6 mb-3 text-sm text-gray-600">
                      <div className="flex items-center space-x-2">
                        <Clock className="w-4 h-4" />
                        <span>{module.duration}</span>
                      </div>
                      <div className="flex items-center space-x-2">
                        <FileText className="w-4 h-4" />
                        <span>{module.type}</span>
                      </div>
                    </div>

                    <p className="text-gray-600 mb-4">{module.description}</p>

                    <div>
                      <h4 className="font-semibold text-gray-900 mb-2">
                        Topics Covered:
                      </h4>
                      <ul className="grid md:grid-cols-2 gap-1">
                        {module.topics.map((topic, topicIndex) => (
                          <li
                            key={topicIndex}
                            className="flex items-start space-x-2"
                          >
                            <CheckCircle className="w-4 h-4 text-green-600 flex-shrink-0 mt-0.5" />
                            <span className="text-gray-700 text-sm">
                              {topic}
                            </span>
                          </li>
                        ))}
                      </ul>
                    </div>
                  </div>
                </div>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* Learning Methods */}
      <section className="py-16 px-4 sm:px-6 lg:px-8">
        <div className="max-w-6xl mx-auto">
          <h2 className="text-3xl font-bold text-center text-gray-900 mb-12">
            How You'll Learn
          </h2>

          <div className="grid md:grid-cols-2 lg:grid-cols-3 gap-6">
            {learningMethods.map((method, index) => (
              <div
                key={index}
                className="bg-white border border-gray-200 rounded-lg p-6 text-center"
              >
                <method.icon className="w-10 h-10 text-teal-600 mx-auto mb-4" />
                <h3 className="text-lg font-semibold text-gray-900 mb-2">
                  {method.title}
                </h3>
                <p className="text-gray-600 text-sm">{method.description}</p>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* Certification Levels */}
      <section className="py-16 px-4 sm:px-6 lg:px-8 bg-gray-50">
        <div className="max-w-4xl mx-auto">
          <h2 className="text-3xl font-bold text-center text-gray-900 mb-12">
            Certification Levels
          </h2>

          <div className="space-y-8">
            {certificationLevels.map((cert, index) => (
              <div
                key={index}
                className="bg-white border border-gray-200 rounded-xl p-8"
              >
                <div className="text-center mb-6">
                  <Award className="w-12 h-12 text-yellow-600 mx-auto mb-4" />
                  <h3 className="text-2xl font-semibold text-gray-900 mb-2">
                    {cert.level}
                  </h3>
                  <p className="text-gray-600 mb-4">{cert.description}</p>
                  <div className="flex flex-col sm:flex-row gap-4 justify-center text-sm">
                    <span className="bg-gray-100 text-gray-700 px-4 py-2 rounded-lg">
                      📚 {cert.requirements}
                    </span>
                    <span className="bg-gray-100 text-gray-700 px-4 py-2 rounded-lg">
                      ⏱️ {cert.hours}
                    </span>
                  </div>
                </div>

                <div>
                  <h4 className="font-semibold text-gray-900 mb-3">
                    Benefits & Privileges:
                  </h4>
                  <ul className="grid md:grid-cols-2 gap-2">
                    {cert.benefits.map((benefit, benefitIndex) => (
                      <li
                        key={benefitIndex}
                        className="flex items-start space-x-3"
                      >
                        <CheckCircle className="w-5 h-5 text-green-600 flex-shrink-0 mt-0.5" />
                        <span className="text-gray-700">{benefit}</span>
                      </li>
                    ))}
                  </ul>
                </div>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* Training Process */}
      <section className="py-16 px-4 sm:px-6 lg:px-8">
        <div className="max-w-4xl mx-auto">
          <h2 className="text-3xl font-bold text-center text-gray-900 mb-12">
            Training Process
          </h2>

          <div className="space-y-8">
            <div className="flex items-start space-x-4">
              <div className="bg-green-600 text-white w-8 h-8 rounded-full flex items-center justify-center font-bold flex-shrink-0">
                1
              </div>
              <div>
                <h3 className="text-xl font-semibold text-gray-900 mb-2">
                  Application Approval
                </h3>
                <p className="text-gray-600">
                  After your volunteer application is approved, you'll receive
                  access to our training platform and can begin immediately.
                </p>
              </div>
            </div>

            <div className="flex items-start space-x-4">
              <div className="bg-green-600 text-white w-8 h-8 rounded-full flex items-center justify-center font-bold flex-shrink-0">
                2
              </div>
              <div>
                <h3 className="text-xl font-semibold text-gray-900 mb-2">
                  Self-Paced Learning
                </h3>
                <p className="text-gray-600">
                  Complete the required modules at your own pace. Most people
                  finish within 2-4 weeks, but you can take up to 3 months.
                </p>
              </div>
            </div>

            <div className="flex items-start space-x-4">
              <div className="bg-green-600 text-white w-8 h-8 rounded-full flex items-center justify-center font-bold flex-shrink-0">
                3
              </div>
              <div>
                <h3 className="text-xl font-semibold text-gray-900 mb-2">
                  Knowledge Assessment
                </h3>
                <p className="text-gray-600">
                  Take quizzes and practical assessments to demonstrate your
                  understanding of key concepts and skills.
                </p>
              </div>
            </div>

            <div className="flex items-start space-x-4">
              <div className="bg-green-600 text-white w-8 h-8 rounded-full flex items-center justify-center font-bold flex-shrink-0">
                4
              </div>
              <div>
                <h3 className="text-xl font-semibold text-gray-900 mb-2">
                  Supervised Practice
                </h3>
                <p className="text-gray-600">
                  Practice your skills with real conversations under the
                  guidance of experienced mentors who provide feedback and
                  support.
                </p>
              </div>
            </div>

            <div className="flex items-start space-x-4">
              <div className="bg-green-600 text-white w-8 h-8 rounded-full flex items-center justify-center font-bold flex-shrink-0">
                5
              </div>
              <div>
                <h3 className="text-xl font-semibold text-gray-900 mb-2">
                  Certification & Launch
                </h3>
                <p className="text-gray-600">
                  Receive your official certification and begin volunteering
                  independently. Ongoing support and continued education
                  available.
                </p>
              </div>
            </div>
          </div>
        </div>
      </section>

      {/* Support & Resources */}
      <section className="py-16 px-4 sm:px-6 lg:px-8 bg-blue-50">
        <div className="max-w-4xl mx-auto text-center">
          <Users className="w-12 h-12 text-blue-600 mx-auto mb-6" />
          <h2 className="text-3xl font-bold text-gray-900 mb-6">
            Training Support & Resources
          </h2>
          <p className="text-lg text-gray-600 mb-8">
            You're never alone in your training journey. We provide
            comprehensive support every step of the way.
          </p>

          <div className="grid md:grid-cols-2 gap-6 text-left">
            <div className="bg-white rounded-lg p-6">
              <h3 className="font-semibold text-gray-900 mb-3">
                Available Support
              </h3>
              <ul className="space-y-2 text-gray-600">
                <li>• Dedicated training coordinator</li>
                <li>• Peer trainee support groups</li>
                <li>• One-on-one mentoring sessions</li>
                <li>• 24/7 access to training materials</li>
                <li>• Regular Q&A sessions with experts</li>
                <li>• Technical support for platform issues</li>
              </ul>
            </div>

            <div className="bg-white rounded-lg p-6">
              <h3 className="font-semibold text-gray-900 mb-3">
                Learning Resources
              </h3>
              <ul className="space-y-2 text-gray-600">
                <li>• Comprehensive training manual</li>
                <li>• Video library with real scenarios</li>
                <li>• Interactive exercises and simulations</li>
                <li>• Mental health resource database</li>
                <li>• Crisis intervention quick reference guides</li>
                <li>• Continuing education opportunities</li>
              </ul>
            </div>
          </div>

          <div className="mt-8">
            <a
              href="/volunteer"
              className="bg-blue-600 text-white px-8 py-4 rounded-lg font-semibold text-lg hover:bg-blue-700 transition-colors inline-flex items-center"
            >
              Start Your Training Journey
              <ArrowRight className="ml-2 w-5 h-5" />
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
