export default function NotFound() {
  return (
    <div className="min-h-screen bg-dark-950 flex items-center justify-center">
      <div className="bg-dark-900/60 backdrop-blur-xl rounded-2xl shadow-neural p-8 max-w-md w-full mx-4">
        <div className="text-center">
          <div className="text-6xl mb-4">🔍</div>
          <h2 className="text-2xl font-bold text-white mb-4">Page Not Found</h2>
          <p className="text-gray-400 mb-6">
            The page you're looking for doesn't exist or might have been moved.
          </p>
          <button
            onClick={() => window.location.href = '/'}
            className="px-6 py-2 bg-gradient-to-r from-orchid-500 to-purple-600 text-white rounded-lg hover:from-orchid-600 hover:to-purple-700 transition-all duration-200 shadow-glow-orchid"
          >
            Go to Home
          </button>
        </div>
      </div>
    </div>
  );
} 