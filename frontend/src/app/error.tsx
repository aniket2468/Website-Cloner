'use client';

import { useEffect } from 'react';

export default function Error({
  error,
  reset,
}: {
  error: Error & { digest?: string };
  reset: () => void;
}) {
  useEffect(() => {
    console.error(error);
  }, [error]);

  return (
    <div className="min-h-screen bg-dark-950 flex items-center justify-center">
      <div className="bg-dark-900/60 backdrop-blur-xl rounded-2xl shadow-neural p-8 max-w-md w-full mx-4">
        <div className="text-center">
          <div className="text-6xl mb-4">😵</div>
          <h2 className="text-2xl font-bold text-white mb-4">Something went wrong!</h2>
          <p className="text-gray-400 mb-6">
            An error occurred while loading this page. This might be a temporary issue.
          </p>
          <div className="space-y-3">
            <button
              onClick={reset}
              className="w-full px-4 py-2 bg-gradient-to-r from-orchid-500 to-purple-600 text-white rounded-lg hover:from-orchid-600 hover:to-purple-700 transition-all duration-200 shadow-glow-orchid"
            >
              Try again
            </button>
            <button
              onClick={() => window.location.href = '/'}
              className="w-full px-4 py-2 bg-dark-800 text-gray-300 rounded-lg hover:bg-dark-700 hover:text-white transition-all duration-200"
            >
              Go to Home
            </button>
          </div>
          {process.env.NODE_ENV === 'development' && (
            <details className="mt-4 text-left">
              <summary className="cursor-pointer text-sm text-gray-400 mb-2 hover:text-gray-300">Error Details</summary>
              <pre className="text-xs bg-dark-800/50 text-gray-300 p-3 rounded-lg overflow-auto max-h-32">
                {error.message}
              </pre>
            </details>
          )}
        </div>
      </div>
    </div>
  );
} 