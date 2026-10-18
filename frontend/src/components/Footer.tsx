import React from 'react';
import { Link } from 'react-router-dom';
import { GraduationCap, ExternalLink, ShieldCheck, FileText } from 'lucide-react';

export const Footer: React.FC = () => {
  const currentYear = new Date().getFullYear();

  return (
    <footer className="bg-slate-900 text-slate-300 border-t border-slate-800 text-sm">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-12">
        <div className="grid grid-cols-1 md:grid-cols-4 gap-8">
          {/* Brand & Purpose */}
          <div className="md:col-span-1 space-y-3">
            <div className="flex items-center space-x-2 text-white">
              <div className="w-7 h-7 bg-slate-800 rounded-md flex items-center justify-center">
                <GraduationCap className="w-4 h-4 text-slate-200" />
              </div>
              <span className="font-semibold text-base tracking-tight">EduExplain AI</span>
            </div>
            <p className="text-xs text-slate-400 leading-relaxed">
              Official Hackathon Challenge 01: Explain My Learning Risk. An educational research prototype demonstrating transparent risk prediction and factor explainability.
            </p>
            <div className="pt-1">
              <span className="inline-block text-[11px] font-mono bg-slate-800 text-slate-300 px-2 py-0.5 rounded border border-slate-700">
                v1.0.0 (Research Release)
              </span>
            </div>
          </div>

          {/* Quick Navigation */}
          <div>
            <h3 className="text-xs font-semibold text-slate-200 uppercase tracking-wider mb-3">
              Application Modules
            </h3>
            <ul className="space-y-2 text-xs">
              <li>
                <Link to="/" className="text-slate-400 hover:text-white transition-colors">
                  Home Overview
                </Link>
              </li>
              <li>
                <Link to="/assessment" className="text-slate-400 hover:text-white transition-colors">
                  Risk Assessment
                </Link>
              </li>
              <li>
                <Link to="/explanation" className="text-slate-400 hover:text-white transition-colors">
                  Feature Contribution Analysis
                </Link>
              </li>
              <li>
                <Link to="/explanation" className="text-slate-400 hover:text-white transition-colors">
                  What-If Simulator
                </Link>
              </li>
              <li>
                <Link to="/methodology" className="text-slate-400 hover:text-white transition-colors">
                  Dataset & Methodology
                </Link>
              </li>
            </ul>
          </div>

          {/* Research & Governance */}
          <div>
            <h3 className="text-xs font-semibold text-slate-200 uppercase tracking-wider mb-3">
              Governance & Policies
            </h3>
            <ul className="space-y-2 text-xs">
              <li>
                <Link to="/responsible-ai" className="text-slate-400 hover:text-white transition-colors flex items-center space-x-1">
                  <ShieldCheck className="w-3.5 h-3.5" />
                  <span>Responsible AI Ethics</span>
                </Link>
              </li>
              <li>
                <Link to="/privacy" className="text-slate-400 hover:text-white transition-colors flex items-center space-x-1">
                  <FileText className="w-3.5 h-3.5" />
                  <span>Privacy Policy</span>
                </Link>
              </li>
              <li>
                <Link to="/terms" className="text-slate-400 hover:text-white transition-colors flex items-center space-x-1">
                  <FileText className="w-3.5 h-3.5" />
                  <span>Terms and Conditions</span>
                </Link>
              </li>
              <li>
                <Link to="/about" className="text-slate-400 hover:text-white transition-colors">
                  Challenge Context & About
                </Link>
              </li>
            </ul>
          </div>

          {/* Academic Attribution & Contact */}
          <div>
            <h3 className="text-xs font-semibold text-slate-200 uppercase tracking-wider mb-3">
              Academic Benchmark & Contact
            </h3>
            <p className="text-xs text-slate-400 leading-relaxed mb-3">
              Built on the open UCI Student Performance dataset (Cortez and Silva, 2008, University of Minho).
            </p>
            <div className="space-y-2 text-xs">
              <a
                href="https://archive.ics.uci.edu/dataset/320/student+performance"
                target="_blank"
                rel="noreferrer"
                className="text-slate-400 hover:text-white transition-colors inline-flex items-center space-x-1"
              >
                <span>UCI Repository Record</span>
                <ExternalLink className="w-3 h-3" />
              </a>
              <div className="pt-2 text-[11px] text-slate-400 leading-relaxed border-t border-slate-800">
                <span>Self-contained research prototype. Direct email is not monitored; review via project repository.</span>
              </div>
            </div>
          </div>
        </div>

        {/* Bottom Bar */}
        <div className="mt-8 pt-8 border-t border-slate-800 flex flex-col md:flex-row items-center justify-between text-xs text-slate-500 gap-4">
          <p>
            &copy; {currentYear} EduExplain AI. Research Prototype for Hackathon Challenge 01.
          </p>
          <p className="text-center md:text-right max-w-xl text-[11px] text-slate-400">
            Educational research prototype. Predictions and feature importances reflect statistical associations and do not represent deterministic judgments about any student.
          </p>
        </div>
      </div>
    </footer>
  );
};
