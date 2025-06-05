export default function Loading() {
  return (
    <div className="min-h-screen bg-dark-950 flex items-center justify-center">
      <div className="bg-dark-900/60 backdrop-blur-xl rounded-2xl shadow-neural p-8 max-w-md w-full mx-4">
        <div className="text-center">
          <div className="animate-spin rounded-full h-12 w-12 border-2 border-transparent border-t-orchid-500 mx-auto mb-4"></div>
          <h2 className="text-xl font-semibold text-white mb-2">Loading...</h2>
          <p className="text-gray-400">Please wait while we prepare your page.</p>
        </div>
      </div>
    </div>
  );
} 