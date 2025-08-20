export default function LoadingIndicator() {
  return (
    <div className="min-h-screen bg-gray-50 flex items-center justify-center p-4">
      <div className="text-center">
        <div className="animate-spin rounded-full h-8 w-8 sm:h-12 sm:w-12 border-b-2 border-teal-600 mx-auto mb-4"></div>
        <p className="text-gray-600 text-sm sm:text-base">
          Loading dashboard...
        </p>
      </div>
    </div>
  );
}
