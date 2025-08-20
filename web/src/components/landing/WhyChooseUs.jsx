import { Shield, Users, MessageCircle } from "lucide-react";

export default function WhyChooseUs() {
  return (
    <section className="py-16 px-4 sm:px-6 lg:px-8 bg-white">
      <div className="max-w-6xl mx-auto">
        <h2 className="text-3xl font-bold text-center text-gray-900 mb-12">
          Why Choose Listening Room for Mental Health Support?
        </h2>
        <div className="grid md:grid-cols-3 gap-8">
          <div className="text-center p-6">
            <div className="w-16 h-16 bg-teal-100 rounded-full flex items-center justify-center mx-auto mb-4">
              <Shield className="w-8 h-8 text-teal-600" />
            </div>
            <h3 className="text-xl font-semibold text-gray-900 mb-3">
              100% Anonymous & Private
            </h3>
            <p className="text-gray-600">
              No real names required. Your mental health conversations are
              completely private, never stored or recorded. Total anonymity
              guaranteed.
            </p>
          </div>
          <div className="text-center p-6">
            <div className="w-16 h-16 bg-emerald-100 rounded-full flex items-center justify-center mx-auto mb-4">
              <Users className="w-8 h-8 text-emerald-600" />
            </div>
            <h3 className="text-xl font-semibold text-gray-900 mb-3">
              Trained Mental Health Volunteers
            </h3>
            <p className="text-gray-600">
              Our volunteers are trained in active listening, crisis
              recognition, and mental health support to provide the best care
              possible.
            </p>
          </div>
          <div className="text-center p-6">
            <div className="w-16 h-16 bg-orange-100 rounded-full flex items-center justify-center mx-auto mb-4">
              <MessageCircle className="w-8 h-8 text-orange-600" />
            </div>
            <h3 className="text-xl font-semibold text-gray-900 mb-3">
              24/7 Crisis Support Available
            </h3>
            <p className="text-gray-600">
              Someone is always here to listen for mental health crises,
              depression, anxiety, or just when you need emotional support.
            </p>
          </div>
        </div>
      </div>
    </section>
  );
}
