export default function ImpactStats() {
  return (
    <section className="py-16 px-4 sm:px-6 lg:px-8">
      <div className="max-w-6xl mx-auto text-center">
        <h2 className="text-3xl font-bold text-gray-900 mb-12">
          Making a Global Impact
        </h2>
        <div className="grid md:grid-cols-4 gap-8">
          <div>
            <div className="text-4xl font-bold text-teal-600 mb-2">🌍</div>
            <div className="text-3xl font-bold text-gray-900 mb-2">40+</div>
            <div className="text-gray-600">Countries Served</div>
          </div>
          <div>
            <div className="text-4xl font-bold text-emerald-600 mb-2">💬</div>
            <div className="text-3xl font-bold text-gray-900 mb-2">10K+</div>
            <div className="text-gray-600">Conversations</div>
          </div>
          <div>
            <div className="text-4xl font-bold text-orange-600 mb-2">❤️</div>
            <div className="text-3xl font-bold text-gray-900 mb-2">500+</div>
            <div className="text-gray-600">Trained Volunteers</div>
          </div>
          <div>
            <div className="text-4xl font-bold text-purple-600 mb-2">⭐</div>
            <div className="text-3xl font-bold text-gray-900 mb-2">4.9</div>
            <div className="text-gray-600">Average Rating</div>
          </div>
        </div>
      </div>
    </section>
  );
}
