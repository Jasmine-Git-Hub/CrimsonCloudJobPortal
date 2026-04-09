import { Link } from 'react-router';
import { Home } from 'lucide-react';

export function NotFound() {
  return (
    <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-16">
      <div className="text-center">
        <h1 className="text-6xl mb-4 text-stone-900">404</h1>
        <h2 className="text-3xl mb-4 text-stone-700">Page Not Found</h2>
        <p className="text-xl text-stone-600 mb-8">
          The page you're looking for doesn't exist.
        </p>
        <Link
          to="/"
          className="inline-flex items-center gap-2 bg-[#7A1010] text-white px-6 py-3 rounded-lg hover:bg-[#5A0808] transition-colors"
        >
          <Home className="w-5 h-5" />
          Back to Home
        </Link>
      </div>
    </div>
  );
}
