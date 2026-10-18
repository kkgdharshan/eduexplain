import React, { useState } from 'react';
import { Link, useLocation } from 'react-router-dom';
import { useStudent } from '../context/StudentContext';
import { GraduationCap, Menu, X, Activity, RefreshCw } from 'lucide-react';

export const Navbar: React.FC = () => {
  const [mobileMenuOpen, setMobileMenuOpen] = useState(false);
  const location = useLocation();
  const { apiConnected, checkConnection } = useStudent();
  const [checking, setChecking] = useState(false);

  const handleRefresh = async () => {
    setChecking(true);
    await checkConnection();
    setTimeout(() => setChecking(false), 500);
  };

  const navLinks = [
    { to: '/', label: 'Home' },
    { to: '/assessment', label: 'Risk Assessment' },
    { to: '/explanation', label: 'Explanation' },
    { to: '/methodology', label: 'Methodology' },
    { to: '/responsible-ai', label: 'Responsible AI' },
    { to: '/about', label: 'About' },
  ];

  const isActive = (path: string) => {
    if (path === '/' && location.pathname !== '/') return false;
    return location.pathname.startsWith(path);
  };

  return (
    <header className="sticky top-0 z-50 bg-white border-b border-slate-200">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="flex items-center justify-between h-16">
          {/* Logo */}
          <Link
            to="/"
            className="flex items-center space-x-3 text-slate-900 focus:outline-none focus-visible:ring-2 focus-visible:ring-blue-600 rounded-md p-1"
            aria-label="EduExplain AI Home"
          >
            <div className="w-9 h-9 bg-slate-900 rounded-md flex items-center justify-center text-white shadow-sm">
              <GraduationCap className="w-5 h-5 text-slate-100" />
            </div>
            <div>
              <span className="font-semibold text-base sm:text-lg tracking-tight text-slate-900 block leading-tight">
                EduExplain AI
              </span>
              <span className="text-xs text-slate-500 font-normal block leading-none">
                Research Prototype
              </span>
            </div>
          </Link>

          {/* Desktop Nav */}
          <nav className="hidden md:flex items-center space-x-1" aria-label="Main Navigation">
            {navLinks.map((link) => (
              <Link
                key={link.to}
                to={link.to}
                className={`px-3 py-2 text-sm font-medium rounded-md transition-colors ${
                  isActive(link.to)
                    ? 'bg-slate-100 text-slate-900 font-semibold'
                    : 'text-slate-600 hover:text-slate-900 hover:bg-slate-50'
                }`}
              >
                {link.label}
              </Link>
            ))}
          </nav>

          {/* Connection status and actions */}
          <div className="hidden sm:flex items-center space-x-3">
            <div
              className={`flex items-center space-x-2 px-2.5 py-1 text-xs font-medium rounded-md border ${
                apiConnected
                  ? 'bg-emerald-50 text-emerald-800 border-emerald-200'
                  : 'bg-amber-50 text-amber-800 border-amber-200'
              }`}
              title={apiConnected ? 'Model server connected' : 'Backend server offline at http://localhost:8000'}
            >
              <span
                className={`w-2 h-2 rounded-full ${
                  apiConnected ? 'bg-emerald-500' : 'bg-amber-500'
                }`}
              />
              <span>{apiConnected ? 'Model Online' : 'Model Offline'}</span>
              <button
                type="button"
                onClick={handleRefresh}
                className="ml-1 text-slate-400 hover:text-slate-700 p-0.5 rounded focus:outline-none focus-visible:ring-1 focus-visible:ring-slate-400"
                aria-label="Check model connection"
                title="Refresh connection status"
              >
                <RefreshCw className={`w-3 h-3 ${checking ? 'animate-spin' : ''}`} />
              </button>
            </div>

            <Link
              to="/assessment"
              className="inline-flex items-center space-x-1.5 bg-slate-900 hover:bg-slate-800 text-white text-xs sm:text-sm font-medium px-3.5 py-2 rounded-md shadow-sm transition-colors focus:outline-none focus-visible:ring-2 focus-visible:ring-slate-900"
            >
              <Activity className="w-4 h-4 text-slate-300" />
              <span>Assess Risk</span>
            </Link>
          </div>

          {/* Mobile hamburger button */}
          <div className="flex md:hidden items-center space-x-2">
            <div
              className={`flex items-center px-2 py-0.5 text-xs font-medium rounded-md border ${
                apiConnected
                  ? 'bg-emerald-50 text-emerald-800 border-emerald-200'
                  : 'bg-amber-50 text-amber-800 border-amber-200'
              }`}
            >
              <span className={`w-1.5 h-1.5 rounded-full mr-1.5 ${apiConnected ? 'bg-emerald-500' : 'bg-amber-500'}`} />
              <span className="text-[11px]">{apiConnected ? 'Online' : 'Offline'}</span>
            </div>

            <button
              type="button"
              onClick={() => setMobileMenuOpen(!mobileMenuOpen)}
              className="p-2 text-slate-700 hover:text-slate-900 hover:bg-slate-100 rounded-md focus:outline-none focus-visible:ring-2 focus-visible:ring-slate-900"
              aria-label={mobileMenuOpen ? 'Close menu' : 'Open menu'}
              aria-expanded={mobileMenuOpen}
            >
              {mobileMenuOpen ? <X className="w-5 h-5" /> : <Menu className="w-5 h-5" />}
            </button>
          </div>
        </div>
      </div>

      {/* Mobile navigation panel */}
      {mobileMenuOpen && (
        <div className="md:hidden border-b border-slate-200 bg-white px-4 pt-2 pb-4 space-y-1 shadow-md">
          {navLinks.map((link) => (
            <Link
              key={link.to}
              to={link.to}
              onClick={() => setMobileMenuOpen(false)}
              className={`block px-3 py-2 text-base font-medium rounded-md ${
                isActive(link.to)
                  ? 'bg-slate-100 text-slate-900 font-semibold'
                  : 'text-slate-600 hover:text-slate-900 hover:bg-slate-50'
              }`}
            >
              {link.label}
            </Link>
          ))}
          <div className="pt-3 border-t border-slate-100">
            <Link
              to="/assessment"
              onClick={() => setMobileMenuOpen(false)}
              className="w-full flex items-center justify-center space-x-2 bg-slate-900 text-white font-medium px-4 py-2.5 rounded-md text-sm"
            >
              <Activity className="w-4 h-4 text-slate-300" />
              <span>Launch Risk Assessment</span>
            </Link>
          </div>
        </div>
      )}
    </header>
  );
};
