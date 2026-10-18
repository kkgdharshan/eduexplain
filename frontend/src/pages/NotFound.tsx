import React from 'react';
import { Link } from 'react-router-dom';
import { FileQuestion, Home as HomeIcon, Activity } from 'lucide-react';

export const NotFound: React.FC = () => {
  return (
    <div className="max-w-3xl mx-auto px-4 sm:px-6 py-20 text-center space-y-6">
      <div className="w-12 h-12 bg-slate-100 text-slate-700 rounded-md flex items-center justify-center mx-auto border border-slate-200">
        <FileQuestion className="w-6 h-6" />
      </div>

      <div className="space-y-2">
        <span className="text-xs font-mono font-semibold uppercase tracking-wider text-slate-500">
          HTTP 404 Error
        </span>
        <h1 className="text-2xl sm:text-3xl font-bold tracking-tight text-slate-900">
          Resource Not Located
        </h1>
        <p className="text-sm text-slate-600 max-w-md mx-auto leading-relaxed">
          The requested educational module or page URL does not exist in the EduExplain AI directory structure.
        </p>
      </div>

      <div className="pt-4 flex flex-wrap items-center justify-center gap-3">
        <Link
          to="/"
          className="inline-flex items-center space-x-2 bg-slate-900 hover:bg-slate-800 text-white text-xs font-medium px-4 py-2.5 rounded-md shadow-sm transition-colors"
        >
          <HomeIcon className="w-3.5 h-3.5" />
          <span>Return to Home</span>
        </Link>
        <Link
          to="/assessment"
          className="inline-flex items-center space-x-2 bg-white hover:bg-slate-50 text-slate-700 text-xs font-medium px-4 py-2.5 rounded-md border border-slate-300 transition-colors"
        >
          <Activity className="w-3.5 h-3.5" />
          <span>Launch Risk Assessment</span>
        </Link>
      </div>
    </div>
  );
};
