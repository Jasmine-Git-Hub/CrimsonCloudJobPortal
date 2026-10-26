import { Outlet, Link, useLocation } from 'react-router';
import { Briefcase, FileText } from 'lucide-react';
import logo from '../../assets/crimson.png';

export function Root() {
  const location = useLocation();

  return (
    <div className="min-h-screen bg-stone-50">
      {/* Header */}
      <header className="bg-white border-b border-stone-200 sticky top-0 z-50 shadow-sm">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="flex items-center justify-between h-16">
            {/* Logo */}
            <Link to="/" className="flex items-center gap-3">
              <img src={logo} alt="CrimsonCloud HR" className="h-10" />
            </Link>

            {/* Navigation */}
            <nav className="flex items-center gap-3">
              <Link
                to="/"
                className={`flex items-center gap-2 px-4 py-2 rounded-lg transition-colors ${
                  location.pathname === '/'
                    ? 'bg-[#7A1010] text-white'
                    : 'text-stone-700 hover:bg-stone-100'
                }`}
              >
                <Briefcase className="w-4 h-4" />
                <span>Jobs</span>
              </Link>
              <Link
                to="/applications"
                className={`flex items-center gap-2 px-4 py-2 rounded-lg transition-colors ${
                  location.pathname === '/applications'
                    ? 'bg-[#7A1010] text-white'
                    : 'text-stone-700 hover:bg-stone-100'
                }`}
              >
                <FileText className="w-4 h-4" />
                <span>All Applications</span>
              </Link>
            </nav>
          </div>
        </div>
      </header>

      {/* Main Content */}
      <main>
        <Outlet />
      </main>

      {/* Footer */}
      <footer className="bg-white border-t border-stone-200 mt-16">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
          <div className="text-center text-stone-600 text-sm">
            <p>© 2026 CrimsonCloud HR. All rights reserved.</p>
            <p className="mt-2">Secure HR Management System</p>
          </div>
        </div>
      </footer>
    </div>
  );
}