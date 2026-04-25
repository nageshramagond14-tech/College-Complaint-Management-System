import { Link, useLocation } from 'react-router-dom';
import { Home, LayoutDashboard, PlusCircle, Menu, X } from 'lucide-react';
import { useState } from 'react';
import { auth } from '../utils/auth';

const Navbar = () => {
  const [isOpen, setIsOpen] = useState(false);
  const [isAuthenticated, setIsAuthenticated] = useState(auth.isAuthenticated());
  const location = useLocation();

  const navLinks = [
    { path: '/', label: 'Home', icon: Home },
    { path: '/dashboard', label: 'Dashboard', icon: LayoutDashboard },
    { path: '/add-complaint', label: 'Add Complaint', icon: PlusCircle },
  ];

  const isActive = (path) => location.pathname === path;

  const handleLogout = () => {
    auth.removeToken();
    setIsAuthenticated(false);
    window.location.href = '/login';
  };

  return (
    <nav className="bg-white shadow-md sticky top-0 z-50">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="flex justify-between h-16">
          {/* Logo */}
          <div className="flex items-center">
            <Link to="/" className="flex items-center space-x-2">
              <LayoutDashboard className="h-8 w-8 text-blue-600" />
              <span className="text-xl font-bold text-gray-900">
                Complaint Portal
              </span>
            </Link>
          </div>

          {/* Desktop Navigation */}
          <div className="hidden md:flex items-center space-x-4">
            {navLinks.map(({ path, label, icon: Icon }) => (
              <Link
                key={path}
                to={path}
                className={`flex items-center space-x-2 px-4 py-2 rounded-lg transition-colors ${
                  isActive(path)
                    ? 'bg-blue-50 text-blue-700'
                    : 'text-gray-600 hover:bg-gray-50 hover:text-gray-900'
                }`}
              >
                <Icon className="h-5 w-5" />
                <span>{label}</span>
              </Link>
            ))}
            {isAuthenticated ? (
              <button
                onClick={handleLogout}
                className="px-4 py-2 text-red-600 hover:bg-red-50 rounded-lg transition-colors font-medium"
              >
                Logout
              </button>
            ) : (
              <Link
                to="/login"
                className={`px-4 py-2 rounded-lg transition-colors font-medium ${
                  isActive('/login')
                    ? 'bg-blue-50 text-blue-700'
                    : 'text-blue-600 hover:bg-blue-50'
                }`}
              >
                Login
              </Link>
            )}
          </div>

          {/* Mobile Menu Button */}
          <div className="flex items-center md:hidden">
            <button
              onClick={() => setIsOpen(!isOpen)}
              className="p-2 rounded-lg text-gray-600 hover:bg-gray-100"
              aria-label="Toggle menu"
            >
              {isOpen ? <X className="h-6 w-6" /> : <Menu className="h-6 w-6" />}
            </button>
          </div>
        </div>
      </div>

      {/* Mobile Navigation */}
      {isOpen && (
        <div className="md:hidden bg-white border-t">
          <div className="px-2 pt-2 pb-3 space-y-1">
            {navLinks.map(({ path, label, icon: Icon }) => (
              <Link
                key={path}
                to={path}
                onClick={() => setIsOpen(false)}
                className={`flex items-center space-x-2 px-3 py-2 rounded-lg transition-colors ${
                  isActive(path)
                    ? 'bg-blue-50 text-blue-700'
                    : 'text-gray-600 hover:bg-gray-50'
                }`}
              >
                <Icon className="h-5 w-5" />
                <span>{label}</span>
              </Link>
            ))}
            {isAuthenticated ? (
              <button
                onClick={() => {
                  handleLogout();
                  setIsOpen(false);
                }}
                className="w-full flex items-center space-x-2 px-3 py-2 text-red-600 hover:bg-red-50 rounded-lg transition-colors"
              >
                <span>Logout</span>
              </button>
            ) : (
              <Link
                to="/login"
                onClick={() => setIsOpen(false)}
                className={`flex items-center space-x-2 px-3 py-2 rounded-lg transition-colors ${
                  isActive('/login')
                    ? 'bg-blue-50 text-blue-700'
                    : 'text-blue-600 hover:bg-blue-50'
                }`}
              >
                <span>Login</span>
              </Link>
            )}
          </div>
        </div>
      )}
    </nav>
  );
};

export default Navbar;
