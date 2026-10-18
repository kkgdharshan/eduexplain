import React from 'react';
import { Link } from 'react-router-dom';
import {
  GraduationCap,
  TrendingDown,
  HelpCircle,
  Sliders,
  ShieldCheck,
  ArrowRight,
  BookOpen,
  CheckCircle2,
  AlertTriangle
} from 'lucide-react';

export const Home: React.FC = () => {
  return (
    <div className="space-y-16 pb-16">
      {/* Hero Section */}
      <section className="bg-white border-b border-slate-200 pt-12 pb-16">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="max-w-3xl">
            {/* Hackathon Challenge Badge */}
            <div className="inline-flex items-center space-x-2 bg-slate-100 border border-slate-300 text-slate-800 text-xs px-3 py-1 rounded-md font-medium mb-4">
              <span className="w-2 h-2 rounded-full bg-blue-600"></span>
              <span>Challenge 01: Explain My Learning Risk</span>
            </div>

            <h1 className="text-3xl sm:text-4xl lg:text-5xl font-bold tracking-tight text-slate-900 leading-tight">
              Explainable Learning Risk Prediction for Secondary Education
            </h1>

            <p className="mt-4 text-base sm:text-lg text-slate-600 leading-relaxed">
              EduExplain AI uses a Logistic Regression model trained on the UCI Student Performance dataset. Feature contributions are calculated from the model coefficients and describe how each input influenced the model output. They do not prove causation.
            </p>

            <div className="mt-8 flex flex-wrap items-center gap-3">
              <Link
                to="/assessment"
                className="inline-flex items-center space-x-2 bg-slate-900 hover:bg-slate-800 text-white font-medium text-sm px-5 py-2.5 rounded-md shadow-sm transition-colors focus:outline-none focus-visible:ring-2 focus-visible:ring-slate-900"
              >
                <span>Launch Risk Assessment</span>
                <ArrowRight className="w-4 h-4 text-slate-300" />
              </Link>
              <Link
                to="/methodology"
                className="inline-flex items-center space-x-2 bg-white hover:bg-slate-50 text-slate-700 font-medium text-sm px-5 py-2.5 rounded-md border border-slate-300 transition-colors focus:outline-none focus-visible:ring-2 focus-visible:ring-slate-400"
              >
                <BookOpen className="w-4 h-4 text-slate-500" />
                <span>Review Methodology</span>
              </Link>
            </div>
          </div>
        </div>
      </section>

      {/* Core Research Prototype Notice */}
      <section className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="bg-amber-50 border border-amber-200 rounded-md p-4 sm:p-5 flex items-start space-x-3">
          <AlertTriangle className="w-5 h-5 text-amber-700 shrink-0 mt-0.5" />
          <div className="text-xs sm:text-sm text-amber-900 leading-relaxed">
            <strong className="font-semibold block mb-0.5">Educational Research Prototype Notice</strong>
            EduExplain AI is an analytical research prototype developed to study interpretable machine learning in education. Predictions and factor attributions reflect statistical patterns in observational data from the UCI repository. They are decision-support aids for academic mentors, not definitive judgments about student potential.
          </div>
        </div>
      </section>

      {/* The Problem & The Solution */}
      <section className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="grid grid-cols-1 md:grid-cols-2 gap-8 items-stretch">
          <div className="bg-white border border-slate-200 rounded-md p-6 sm:p-8 flex flex-col justify-between">
            <div>
              <div className="w-10 h-10 bg-rose-50 text-rose-700 border border-rose-200 rounded-md flex items-center justify-center mb-4">
                <TrendingDown className="w-5 h-5" />
              </div>
              <h2 className="text-xl font-bold text-slate-900 tracking-tight mb-3">
                The Problem: Black-Box Early Warning Systems
              </h2>
              <p className="text-sm text-slate-600 leading-relaxed mb-4">
                Traditional educational early warning systems frequently output single risk scores (e.g. 74% Risk) without explaining the underlying drivers. Educators, parents, and counselors are left without actionable insight:
              </p>
              <ul className="space-y-2 text-xs sm:text-sm text-slate-600">
                <li className="flex items-start space-x-2">
                  <span className="text-slate-400 font-bold">•</span>
                  <span>Teachers cannot discern whether academic deficit, attendance patterns, or home support is the primary friction point.</span>
                </li>
                <li className="flex items-start space-x-2">
                  <span className="text-slate-400 font-bold">•</span>
                  <span>Opaque alerts risk stigmatizing students without offering pathways for remediation.</span>
                </li>
                <li className="flex items-start space-x-2">
                  <span className="text-slate-400 font-bold">•</span>
                  <span>Models often conflate correlation with causation, leading to ineffective intervention strategies.</span>
                </li>
              </ul>
            </div>
            <div className="mt-6 pt-4 border-t border-slate-100 text-xs text-slate-500">
              Reference: Cortez &amp; Silva (2008), In Proceedings of 5th FUBUTEC, EUROSIS.
            </div>
          </div>

          <div className="bg-white border border-slate-200 rounded-md p-6 sm:p-8 flex flex-col justify-between">
            <div>
              <div className="w-10 h-10 bg-blue-50 text-blue-700 border border-blue-200 rounded-md flex items-center justify-center mb-4">
                <HelpCircle className="w-5 h-5" />
              </div>
              <h2 className="text-xl font-bold text-slate-900 tracking-tight mb-3">
                The Solution: Interpretable Early Warning
              </h2>
              <p className="text-sm text-slate-600 leading-relaxed mb-4">
                EduExplain AI bridges the gap between predictive accuracy and transparent educational counseling:
              </p>
              <ul className="space-y-2 text-xs sm:text-sm text-slate-600">
                <li className="flex items-start space-x-2">
                  <CheckCircle2 className="w-4 h-4 text-emerald-600 shrink-0 mt-0.5" />
                  <span><strong>Three-Tier Risk Classification:</strong> Higher Risk (Grade &lt; 10), Moderate Risk (10 to 13), and Lower Concern (Grade &gt;= 14) with model-estimated class probabilities.</span>
                </li>
                <li className="flex items-start space-x-2">
                  <CheckCircle2 className="w-4 h-4 text-emerald-600 shrink-0 mt-0.5" />
                  <span><strong>Feature Contribution Analysis:</strong> Precise mathematical decomposition showing which specific factors elevated or buffered risk for each student based on model coefficients.</span>
                </li>
                <li className="flex items-start space-x-2">
                  <CheckCircle2 className="w-4 h-4 text-emerald-600 shrink-0 mt-0.5" />
                  <span><strong>Interactive What-If Simulator:</strong> Scenario testing showing how changed input values affect the model output.</span>
                </li>
              </ul>
            </div>
            <div className="mt-6 pt-4 border-t border-slate-100 text-xs text-slate-500">
              Architecture: Logistic Regression with coefficient-based feature contribution analysis.
            </div>
          </div>
        </div>
      </section>

      {/* Core Application Modules Grid */}
      <section className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="mb-8">
          <h2 className="text-2xl font-bold text-slate-900 tracking-tight">
            Research Dashboard Modules
          </h2>
          <p className="mt-1 text-sm text-slate-600">
            Explore the four key pillars of the EduExplain AI analytical workflow.
          </p>
        </div>

        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-6">
          {/* Module 1 */}
          <div className="bg-white border border-slate-200 rounded-md p-5 flex flex-col justify-between hover:border-slate-300 transition-colors">
            <div>
              <div className="w-8 h-8 bg-slate-100 text-slate-700 rounded-md flex items-center justify-center mb-3">
                <GraduationCap className="w-4 h-4" />
              </div>
              <h3 className="font-semibold text-slate-900 text-sm mb-1.5">
                Risk Assessment
              </h3>
              <p className="text-xs text-slate-600 leading-relaxed">
                Input student academic history, attendance, study habits, and support structures to receive a model-estimated risk tier and class probability.
              </p>
            </div>
            <div className="mt-4 pt-3 border-t border-slate-100">
              <Link
                to="/assessment"
                className="text-xs font-medium text-blue-700 hover:text-blue-900 inline-flex items-center space-x-1"
              >
                <span>Assess Profile</span>
                <ArrowRight className="w-3 h-3" />
              </Link>
            </div>
          </div>

          {/* Module 2 */}
          <div className="bg-white border border-slate-200 rounded-md p-5 flex flex-col justify-between hover:border-slate-300 transition-colors">
            <div>
              <div className="w-8 h-8 bg-slate-100 text-slate-700 rounded-md flex items-center justify-center mb-3">
                <HelpCircle className="w-4 h-4" />
              </div>
              <h3 className="font-semibold text-slate-900 text-sm mb-1.5">
                Feature Contribution Analysis
              </h3>
              <p className="text-xs text-slate-600 leading-relaxed">
                Examine individual feature contributions with direction and magnitude, distinguishing risk-increasing factors from protective buffers.
              </p>
            </div>
            <div className="mt-4 pt-3 border-t border-slate-100">
              <Link
                to="/explanation"
                className="text-xs font-medium text-blue-700 hover:text-blue-900 inline-flex items-center space-x-1"
              >
                <span>View Attributions</span>
                <ArrowRight className="w-3 h-3" />
              </Link>
            </div>
          </div>

          {/* Module 3 */}
          <div className="bg-white border border-slate-200 rounded-md p-5 flex flex-col justify-between hover:border-slate-300 transition-colors">
            <div>
              <div className="w-8 h-8 bg-slate-100 text-slate-700 rounded-md flex items-center justify-center mb-3">
                <Sliders className="w-4 h-4" />
              </div>
              <h3 className="font-semibold text-slate-900 text-sm mb-1.5">
                What-If Simulator
              </h3>
              <p className="text-xs text-slate-600 leading-relaxed">
                Explore hypothetical input scenarios, such as changes in study time or support access, and observe how the model output changes.
              </p>
            </div>
            <div className="mt-4 pt-3 border-t border-slate-100">
              <Link
                to="/explanation"
                className="text-xs font-medium text-blue-700 hover:text-blue-900 inline-flex items-center space-x-1"
              >
                <span>Simulate Scenarios</span>
                <ArrowRight className="w-3 h-3" />
              </Link>
            </div>
          </div>

          {/* Module 4 */}
          <div className="bg-white border border-slate-200 rounded-md p-5 flex flex-col justify-between hover:border-slate-300 transition-colors">
            <div>
              <div className="w-8 h-8 bg-slate-100 text-slate-700 rounded-md flex items-center justify-center mb-3">
                <ShieldCheck className="w-4 h-4" />
              </div>
              <h3 className="font-semibold text-slate-900 text-sm mb-1.5">
                Responsible AI & Ethics
              </h3>
              <p className="text-xs text-slate-600 leading-relaxed">
                Review governance standards, zero-PII client privacy safeguards, uncertainty communication, and appropriate institutional use.
              </p>
            </div>
            <div className="mt-4 pt-3 border-t border-slate-100">
              <Link
                to="/responsible-ai"
                className="text-xs font-medium text-blue-700 hover:text-blue-900 inline-flex items-center space-x-1"
              >
                <span>Ethical Guidelines</span>
                <ArrowRight className="w-3 h-3" />
              </Link>
            </div>
          </div>
        </div>
      </section>

      {/* Dataset & Reproducibility Summary */}
      <section className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="bg-slate-100 border border-slate-200 rounded-md p-6 sm:p-8">
          <div className="flex flex-col md:flex-row md:items-center justify-between gap-6">
            <div className="space-y-2 max-w-2xl">
              <h3 className="text-lg font-bold text-slate-900 tracking-tight">
                Public Dataset & Reproducible Research
              </h3>
              <p className="text-xs sm:text-sm text-slate-600 leading-relaxed">
                All models are trained strictly on public, permitted data from the UCI Machine Learning Repository (University of Minho, Cortez and Silva 2008). No private student identifiers or institutional student records are accepted or retained.
              </p>
            </div>
            <div className="shrink-0 flex items-center space-x-3">
              <Link
                to="/methodology"
                className="inline-flex items-center space-x-2 bg-white hover:bg-slate-50 text-slate-800 text-xs sm:text-sm font-medium px-4 py-2 rounded-md border border-slate-300 shadow-sm transition-colors"
              >
                <span>Inspect Data & Metrics</span>
                <ArrowRight className="w-3.5 h-3.5" />
              </Link>
            </div>
          </div>
        </div>
      </section>
    </div>
  );
};
