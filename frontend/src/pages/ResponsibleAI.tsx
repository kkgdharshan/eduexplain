import React from 'react';
import {
  Lock,
  Scale,
  UserCheck,
  AlertTriangle,
  CheckCircle2,
  FileCheck,
  BookOpen,
  ExternalLink
} from 'lucide-react';

export const ResponsibleAI: React.FC = () => {
  return (
    <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-10 space-y-12">
      {/* Header */}
      <div>
        <div className="inline-flex items-center space-x-2 bg-slate-100 border border-slate-300 text-slate-800 text-xs px-3 py-1 rounded-md font-medium mb-3">
          <span>Module 04</span>
          <span className="text-slate-400">/</span>
          <span>Responsible AI &amp; Ethics</span>
        </div>
        <h1 className="text-2xl sm:text-3xl font-bold tracking-tight text-slate-900">
          Responsible AI, Fairness, and Ethical Governance
        </h1>
        <p className="mt-2 text-sm text-slate-600 max-w-3xl leading-relaxed">
          AI systems deployed in educational environments directly affect student trajectories. EduExplain AI adheres to strict ethical principles prioritizing human dignity, privacy, transparency, and actionable support over punitive classification.
        </p>
      </div>

      {/* Fundamental Research Disclaimer Banner */}
      <div className="bg-amber-50 border border-amber-300 rounded-md p-5 flex items-start space-x-4">
        <AlertTriangle className="w-6 h-6 text-amber-700 shrink-0 mt-0.5" />
        <div className="text-xs sm:text-sm text-amber-900 leading-relaxed">
          <strong className="text-sm font-bold block mb-1">
            Fundamental Research Prototype Disclaimer
          </strong>
          EduExplain AI uses a Logistic Regression model trained on the UCI Student Performance dataset. Feature contributions are calculated from the model coefficients and describe how each input influenced the model output. They do not prove causation. Deployed model: Logistic Regression with coefficient-based feature contribution analysis. The predictions, risk categories, and feature attributions produced by this platform do not represent definitive judgments, clinical assessments, or binding determinations regarding any individual student. They are mathematical estimations derived from historical data patterns.
        </div>
      </div>

      {/* Ethical Pillars Grid */}
      <div className="grid grid-cols-1 md:grid-cols-2 gap-8">
        {/* Pillar 1: Privacy by Design */}
        <div className="bg-white border border-slate-200 rounded-md p-6 sm:p-7 space-y-3">
          <div className="w-9 h-9 bg-slate-100 text-slate-800 rounded-md flex items-center justify-center">
            <Lock className="w-5 h-5" />
          </div>
          <h2 className="text-base font-bold text-slate-900">
            1. Zero-PII Data Privacy Architecture
          </h2>
          <p className="text-xs sm:text-sm text-slate-600 leading-relaxed">
            Protecting student identity is paramount. EduExplain AI enforces a strict zero personally identifiable information (Zero-PII) policy:
          </p>
          <ul className="space-y-2 text-xs text-slate-600">
            <li className="flex items-start space-x-2">
              <CheckCircle2 className="w-4 h-4 text-emerald-600 shrink-0 mt-0.5" />
              <span>No student names, identification numbers, addresses, or biometric data are collected or processed.</span>
            </li>
            <li className="flex items-start space-x-2">
              <CheckCircle2 className="w-4 h-4 text-emerald-600 shrink-0 mt-0.5" />
              <span>Stateless API execution: input profiles are evaluated in-memory and immediately discarded with zero persistent logging.</span>
            </li>
            <li className="flex items-start space-x-2">
              <CheckCircle2 className="w-4 h-4 text-emerald-600 shrink-0 mt-0.5" />
              <span>No cross-site cookies, third-party analytics trackers, or user behavioral telemetry are embedded.</span>
            </li>
          </ul>
        </div>

        {/* Pillar 2: Demographic Awareness & Bias Limitations */}
        <div className="bg-white border border-slate-200 rounded-md p-6 sm:p-7 space-y-3">
          <div className="w-9 h-9 bg-slate-100 text-slate-800 rounded-md flex items-center justify-center">
            <Scale className="w-5 h-5" />
          </div>
          <h2 className="text-base font-bold text-slate-900">
            2. Demographic Awareness and Bias Limitations
          </h2>
          <p className="text-xs sm:text-sm text-slate-600 leading-relaxed">
            Educational data frequently mirrors historical societal disparities. Our framework emphasizes transparency around demographic variables:
          </p>
          <ul className="space-y-2 text-xs text-slate-600">
            <li className="flex items-start space-x-2">
              <CheckCircle2 className="w-4 h-4 text-emerald-600 shrink-0 mt-0.5" />
              <span>Socioeconomic factors (e.g. parental education levels) are reported transparently in feature contribution breakdowns to expose potential proxy associations.</span>
            </li>
            <li className="flex items-start space-x-2">
              <CheckCircle2 className="w-4 h-4 text-emerald-600 shrink-0 mt-0.5" />
              <span>Formal automated demographic parity optimization was not implemented in this prototype; educators must exercise critical awareness of demographic bias in historical data.</span>
            </li>
            <li className="flex items-start space-x-2">
              <CheckCircle2 className="w-4 h-4 text-emerald-600 shrink-0 mt-0.5" />
              <span>Systemic educational disparities must not be misconstrued as intrinsic student deficits.</span>
            </li>
          </ul>
        </div>

        {/* Pillar 3: Human in the Loop */}
        <div className="bg-white border border-slate-200 rounded-md p-6 sm:p-7 space-y-3">
          <div className="w-9 h-9 bg-slate-100 text-slate-800 rounded-md flex items-center justify-center">
            <UserCheck className="w-5 h-5" />
          </div>
          <h2 className="text-base font-bold text-slate-900">
            3. Mandatory Human-in-the-Loop Decision Making
          </h2>
          <p className="text-xs sm:text-sm text-slate-600 leading-relaxed">
            AI must never operate as an autonomous gatekeeper in learning institutions. We mandate:
          </p>
          <ul className="space-y-2 text-xs text-slate-600">
            <li className="flex items-start space-x-2">
              <CheckCircle2 className="w-4 h-4 text-emerald-600 shrink-0 mt-0.5" />
              <span>Decision-Support Role: All outputs are designed for teachers, academic advisors, and counselors to inform supportive conversations.</span>
            </li>
            <li className="flex items-start space-x-2">
              <CheckCircle2 className="w-4 h-4 text-emerald-600 shrink-0 mt-0.5" />
              <span>Educator Contextual Override: Professional educators retain full authority to disregard model scores based on qualitative knowledge.</span>
            </li>
            <li className="flex items-start space-x-2">
              <CheckCircle2 className="w-4 h-4 text-emerald-600 shrink-0 mt-0.5" />
              <span>Preserving Growth Mindset: Risk scores must never be shared directly with students in isolation without constructive learning plans.</span>
            </li>
          </ul>
        </div>

        {/* Pillar 4: Permitted vs Prohibited Uses */}
        <div className="bg-white border border-slate-200 rounded-md p-6 sm:p-7 space-y-3">
          <div className="w-9 h-9 bg-slate-100 text-slate-800 rounded-md flex items-center justify-center">
            <FileCheck className="w-5 h-5" />
          </div>
          <h2 className="text-base font-bold text-slate-900">
            4. Permitted vs. Prohibited Use Policy
          </h2>
          <p className="text-xs sm:text-sm text-slate-600 leading-relaxed">
            To prevent technological abuse or adverse educational impacts, boundaries are formally codified:
          </p>
          <div className="space-y-2 text-xs">
            <div className="p-2 bg-emerald-50 border border-emerald-200 rounded text-emerald-900">
              <strong>Permitted:</strong> Early academic intervention planning, personalized tutoring prioritization, study habit coaching, and research benchmarking.
            </div>
            <div className="p-2 bg-rose-50 border border-rose-200 rounded text-rose-900">
              <strong>Prohibited:</strong> Punitive grading, automated course rejection, exclusion from extracurriculars, disciplinary decisions, or stigmatizing student tracking.
            </div>
          </div>
        </div>
      </div>

      {/* Uncertainty & Epistemic Humility */}
      <section className="bg-slate-50 border border-slate-200 rounded-md p-6 sm:p-7 space-y-3">
        <h2 className="text-base font-bold text-slate-900">
          5. Uncertainty Communication and Epistemic Humility
        </h2>
        <p className="text-xs sm:text-sm text-slate-600 leading-relaxed">
          Machine learning models operate under uncertainty. When model confidence falls near class boundaries (e.g. 51% vs 49%), EduExplain AI explicitly exposes the complete probability distribution. Rather than projecting false certainty, the platform encourages mentors to explore the boundary conditions in the What-If Simulator and consult additional qualitative context.
        </p>
      </section>

      {/* Academic Citations */}
      <section className="bg-white border border-slate-200 rounded-md p-6 sm:p-7 space-y-4">
        <div className="flex items-center space-x-3 pb-3 border-b border-slate-200">
          <BookOpen className="w-5 h-5 text-slate-700" />
          <h2 className="text-base font-bold text-slate-900">
            6. Academic References &amp; Ethical Source Citations
          </h2>
        </div>

        <div className="space-y-3 text-xs text-slate-600 leading-relaxed font-mono">
          <div className="bg-slate-50 p-3 rounded border border-slate-200">
            <span className="font-sans font-semibold text-slate-800 block mb-1">Dataset Attribution:</span>
            Cortez, P., &amp; Silva, A. (2008). Using data mining to predict secondary school student performance. In Proceedings of 5th Annual Future Business Technology Conference (FUBUTEC 2008), Porto, Portugal, pp. 5-12. EUROSIS.
            <div className="mt-1 font-sans">
              <a
                href="https://archive.ics.uci.edu/dataset/320/student+performance"
                target="_blank"
                rel="noreferrer"
                className="text-blue-700 hover:text-blue-900 inline-flex items-center space-x-1"
              >
                <span>Official UCI Machine Learning Repository (DOI: 10.24432/C5TG7T)</span>
                <ExternalLink className="w-3 h-3" />
              </a>
            </div>
          </div>
        </div>
      </section>
    </div>
  );
};
