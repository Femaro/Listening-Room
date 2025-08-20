export default function LoadingScreen({ message = "Loading..." }) {
  return (
    <div className="min-h-screen bg-gradient-to-br from-teal-50 to-emerald-50 flex items-center justify-center">
      <div className="text-center">
        <img
          src="https://ucarecdn.com/e05f1122-ee17-479a-b4b8-456584592d00/-/format/auto/"
          alt="Listening Room Logo - Anonymous Mental Health Support"
          className="w-40 h-24 mx-auto mb-4 animate-pulse object-contain"
        />
        <p className="text-gray-600">{message}</p>
      </div>
    </div>
  );
}
