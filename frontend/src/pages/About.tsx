import React from 'react';
import { Link } from 'react-router-dom';
import {
  Award,
  Cpu,
  BookOpen,
  Database,
  ShieldCheck,
  AlertTriangle,
  HelpCircle,
  BarChart,
  ExternalLink,
  ArrowRight
} from 'lucide-react';

export const About: React.FC = () => {
  return (
    <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-10 space-y-12">
      {/* Header */}
      <div>
        <div className="inline-flex items-center space-x-2 bg-slate-100 border border-slate-300 text-slate-800 text-xs px-3 py-1 rounded-md font-medium mb-3">
          <span>Module 05</span>
          <span className="text-slate-400">/</span>
          <span>Project &amp; Technical Architecture</span>
        </div>
        <h1 className="text-2xl sm:text-3xl font-bold tracking-tight text-slate-900">
          About EduExplain AI
        </h1>
        <p className="mt-2 text-sm text-slate-600 max-w-3xl leading-relaxed">
          Educational Research Prototype developed for Hackathon Challenge 01: &quot;Explain My Learning Risk&quot;. This document provides a complete technical audit of the problem, dataset, model pipeline, explainability engine, evaluation methodology, and governance safeguards.
        </p>
      </div>

      {/* 1. Challenge & Problem Statement */}
      <section className="bg-white border border-slate-200 rounded-md p-6 sm:p-7 space-y-4">
        <div className="flex items-center space-x-3 pb-3 border-b border-slate-200">
          <Award className="w-5 h-5 text-blue-700" />
          <h2 className="text-lg font-bold text-slate-900">
            1. Challenge Title and Problem Statement
          </h2>
        </div>
        <div className="space-y-3 text-xs sm:text-sm text-slate-600 leading-relaxed">
          <p>
            <strong>Official Challenge:</strong> &quot;Challenge 01: Explain My Learning Risk&quot;.
          </p>
          <p>
            <strong>The Problem:</strong> Predictive Early Warning Systems (EWS) are increasingly used by educational institutions to detect students at risk of academic failure. However, traditional implementations operate as black boxes, outputting opaque scores (such as &quot;78% At Risk&quot;) without explaining the actionable drivers. Educators, academic counselors, and mentors are left without clarity on whether academic deficits, attendance disruptions, or support gaps are the primary causes.
          </p>
          <p>
            <strong>The Objective:</strong> EduExplain AI uses a Logistic Regression model trained on the UCI Student Performance dataset. Feature contributions are calculated from the model coefficients and describe how each input influenced the model output. They do not prove causation.
          </p>
        </div>
      </section>

      {/* 2. Dataset and Target Definition */}
      <section className="bg-white border border-slate-200 rounded-md p-6 sm:p-7 space-y-6">
        <div className="flex items-center space-x-3 pb-3 border-b border-slate-200">
          <Database className="w-5 h-5 text-slate-700" />
          <h2 className="text-lg font-bold text-slate-900">
            2. Dataset and Target Variable Definition
          </h2>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-2 gap-6 text-xs sm:text-sm text-slate-600 leading-relaxed">
          <div className="space-y-3">
            <h3 className="font-semibold text-slate-900 text-sm">
              Public Benchmark Dataset
            </h3>
            <p>
              The system is trained strictly on the public UCI Student Performance dataset (<code className="font-mono text-xs bg-slate-100 px-1 py-0.5 rounded text-slate-800">student-mat.csv</code>), authored by Paulo Cortez and Alice Silva (2008) at the University of Minho, Portugal.
            </p>
            <p>
              It encompasses 395 secondary school students in mathematics across 33 collected attributes. Nineteen predictive features are modeled, covering prior grades (G1, G2), past failures, weekly study time, school absences, educational support (school, family, paid tutoring), higher education aspirations, and demographic routines.
            </p>
            <div className="pt-1">
              <a
                href="https://archive.ics.uci.edu/dataset/320/student+performance"
                target="_blank"
                rel="noreferrer"
                className="text-xs font-semibold text-blue-700 hover:text-blue-900 inline-flex items-center space-x-1"
              >
                <span>UCI Repository Record (DOI: 10.24432/C5TG7T)</span>
                <ExternalLink className="w-3.5 h-3.5" />
              </a>
            </div>
            <p className="text-xs text-slate-500">
              License: Creative Commons Attribution 4.0 International (CC BY 4.0). Permitted for open research and educational modeling.
            </p>
          </div>

          <div className="space-y-3 bg-slate-50 p-4 rounded-md border border-slate-200">
            <h3 className="font-semibold text-slate-900 text-sm">
              Target Variable Formulations
            </h3>
            <p className="text-xs text-slate-600">
              Evaluations follow the Portuguese secondary grading scale (0 to 20 points, with 10 representing the statutory passing mark). EduExplain AI defines three operational tiers:
            </p>
            <div className="space-y-2 text-xs">
              <div className="p-2.5 bg-rose-50 border border-rose-200 rounded text-rose-900">
                <strong>Higher Risk (G3 &lt; 10):</strong> Failing mark. Indicates serious academic difficulty requiring immediate intervention. (Prevalence: 32.9%)
              </div>
              <div className="p-2.5 bg-amber-50 border border-amber-200 rounded text-amber-900">
                <strong>Moderate Risk (G3 from 10 to 13):</strong> Passing, but borderline or vulnerable to falling behind. (Prevalence: 41.8%)
              </div>
              <div className="p-2.5 bg-emerald-50 border border-emerald-200 rounded text-emerald-900">
                <strong>Lower Concern (G3 &ge; 14):</strong> Proficient to excellent academic performance. (Prevalence: 25.3%)
              </div>
            </div>
          </div>
        </div>
      </section>

      {/* 3. Model Architecture & Preprocessing */}
      <section className="bg-white border border-slate-200 rounded-md p-6 sm:p-7 space-y-6">
        <div className="flex items-center space-x-3 pb-3 border-b border-slate-200">
          <Cpu className="w-5 h-5 text-slate-700" />
          <h2 className="text-lg font-bold text-slate-900">
            3. Model Architecture and Preprocessing Pipeline
          </h2>
        </div>

        <div className="grid grid-cols-1 sm:grid-cols-3 gap-4 text-xs">
          <div className="p-4 bg-slate-50 border border-slate-200 rounded-md space-y-2">
            <strong className="block font-semibold text-slate-900 text-sm">
              Preprocessing Pipeline
            </strong>
            <p className="text-slate-600 leading-relaxed">
              Implemented using Scikit-learn ColumnTransformer. Categorical binary variables (schoolsup, famsup, paid, activities, higher, internet, romantic) use OneHotEncoder with drop-first formulation. Continuous grades (G1, G2), age, absences, and ordinal survey scales pass through in native numeric representation.
            </p>
          </div>

          <div className="p-4 bg-slate-50 border border-slate-200 rounded-md space-y-2">
            <strong className="block font-semibold text-slate-900 text-sm">
              3-Class Risk Classifier
            </strong>
            <p className="text-slate-600 leading-relaxed">
              Logistic Regression with coefficient-based feature contribution analysis trained on the UCI Student Performance dataset. Outputs model-estimated class probabilities for Higher Risk, Moderate Risk, and Lower Concern.
            </p>
          </div>

          <div className="p-4 bg-slate-50 border border-slate-200 rounded-md space-y-2">
            <strong className="block font-semibold text-slate-900 text-sm">
              Continuous Grade Regressor
            </strong>
            <p className="text-slate-600 leading-relaxed">
              Scikit-learn continuous grade regressor projecting final G3 grades on the 0-20 scale (RMSE: 1.452 points, R&sup2;: 0.889), providing numerical grounding alongside risk tiers.
            </p>
          </div>
        </div>
      </section>

      {/* 4. Explainability Method */}
      <section className="bg-white border border-slate-200 rounded-md p-6 sm:p-7 space-y-4">
        <div className="flex items-center space-x-3 pb-3 border-b border-slate-200">
          <HelpCircle className="w-5 h-5 text-slate-700" />
          <h2 className="text-lg font-bold text-slate-900">
            4. Explainability Method: Coefficient-Based Feature Contribution Analysis
          </h2>
        </div>
        <div className="space-y-3 text-xs sm:text-sm text-slate-600 leading-relaxed">
          <p>
            EduExplain AI uses a Logistic Regression model trained on the UCI Student Performance dataset. Feature contributions are calculated from the model coefficients and describe how each input influenced the model output. They do not prove causation.
          </p>
          <p>
            Feature contribution analysis evaluates individual input weights and feature values additively:
          </p>
          <div className="bg-slate-50 p-3 rounded border border-slate-200 font-mono text-xs text-center text-slate-800">
            Model Prediction = Baseline Bias + Sum of Model Coefficient Contributions
          </div>
          <ul className="space-y-1.5 list-disc pl-5 text-xs">
            <li><strong>Positive contributions:</strong> Model coefficient contributions that elevated risk toward failure (e.g. prior term difficulties or high absences).</li>
            <li><strong>Negative contributions:</strong> Protective buffers that reduced risk (e.g. higher study dedication or family support).</li>
            <li><strong>Global Feature Importance:</strong> Benchmarks population-level feature weights across the entire cohort.</li>
          </ul>
        </div>
      </section>

      {/* 5. Empirical Evaluation Section */}
      <section className="bg-white border border-slate-200 rounded-md p-6 sm:p-7 space-y-6">
        <div className="flex items-center justify-between pb-3 border-b border-slate-200">
          <div className="flex items-center space-x-3">
            <BarChart className="w-5 h-5 text-slate-700" />
            <h2 className="text-lg font-bold text-slate-900">
              5. Empirical Evaluation (Held-Out Test Set N=79)
            </h2>
          </div>
          <span className="text-xs font-mono bg-slate-100 text-slate-700 px-2 py-1 rounded border border-slate-200">
            Split: 80/20 | Seed: 42 | Date: October 2026
          </span>
        </div>

        <div className="grid grid-cols-2 sm:grid-cols-4 gap-4">
          <div className="bg-slate-50 border border-slate-200 rounded-md p-3.5">
            <span className="text-xs text-slate-500 font-medium block mb-1">3-Tier Test Accuracy</span>
            <div className="text-2xl font-extrabold text-slate-900 font-mono">82.28%</div>
            <span className="text-[11px] text-slate-500 block mt-0.5">Held-out test set (N=79)</span>
          </div>

          <div className="bg-slate-50 border border-slate-200 rounded-md p-3.5">
            <span className="text-xs text-slate-500 font-medium block mb-1">5-Fold Stratified CV</span>
            <div className="text-2xl font-extrabold text-slate-900 font-mono">86.84%</div>
            <span className="text-[11px] text-slate-500 block mt-0.5">&plusmn; 2.84% cross-validation</span>
          </div>

          <div className="bg-slate-50 border border-slate-200 rounded-md p-3.5">
            <span className="text-xs text-slate-500 font-medium block mb-1">Higher Risk Recall</span>
            <div className="text-2xl font-extrabold text-emerald-700 font-mono">92.31%</div>
            <span className="text-[11px] text-slate-500 block mt-0.5">24 of 26 failing students flagged</span>
          </div>

          <div className="bg-slate-50 border border-slate-200 rounded-md p-3.5">
            <span className="text-xs text-slate-500 font-medium block mb-1">Grade Regressor RMSE</span>
            <div className="text-2xl font-extrabold text-slate-900 font-mono">1.452</div>
            <span className="text-[11px] text-slate-500 block mt-0.5">MAE: 0.929 | R&sup2;: 0.889</span>
          </div>
        </div>

        <div className="pt-2 text-xs text-slate-600">
          <Link
            to="/methodology"
            className="font-semibold text-blue-700 hover:text-blue-900 inline-flex items-center space-x-1"
          >
            <span>View full per-class precision/recall and confusion matrix breakdown</span>
            <ArrowRight className="w-3.5 h-3.5" />
          </Link>
        </div>
      </section>

      {/* 6. Limitations, Bias & Causation */}
      <section className="bg-white border border-slate-200 rounded-md p-6 sm:p-7 space-y-4">
        <div className="flex items-center space-x-3 pb-3 border-b border-slate-200">
          <AlertTriangle className="w-5 h-5 text-amber-700" />
          <h2 className="text-lg font-bold text-slate-900">
            6. Limitations, Bias, and Association vs. Causation
          </h2>
        </div>
        <div className="space-y-3 text-xs sm:text-sm text-slate-600 leading-relaxed">
          <p>
            <strong>Statistical Association vs. Causation:</strong> Feature importance indicates how the mathematical model weights variables within historical observational data. High importance does not prove that modifying a feature will causally guarantee an improved outcome.
          </p>
          <p>
            <strong>Sample Size &amp; Regional Context:</strong> The dataset captures 395 mathematics students across two Portuguese public secondary schools in 2005-2006. Findings reflect the Portuguese educational framework and should be recalibrated before application to differing curricula.
          </p>
          <p>
            <strong>Unmeasured Latent Factors:</strong> The dataset does not account for teacher instructional quality, neurodiversity, personal family disruptions, or qualitative student interests.
          </p>
        </div>
      </section>

      {/* 7. Privacy and Responsible AI Safeguards */}
      <section className="bg-white border border-slate-200 rounded-md p-6 sm:p-7 space-y-4">
        <div className="flex items-center space-x-3 pb-3 border-b border-slate-200">
          <ShieldCheck className="w-5 h-5 text-slate-700" />
          <h2 className="text-lg font-bold text-slate-900">
            7. Privacy and Responsible AI Safeguards
          </h2>
        </div>
        <div className="space-y-3 text-xs sm:text-sm text-slate-600 leading-relaxed">
          <p>
            <strong>Zero-PII Policy:</strong> The platform does not collect, log, or process student names, identification numbers, addresses, contact details, or IP addresses.
          </p>
          <p>
            <strong>Stateless In-Memory Execution:</strong> Form inputs are processed in-memory solely for model inference and discarded immediately without database persistence.
          </p>
          <p>
            <strong>Appropriate Use Policy:</strong> Strictly designed as an exploratory decision-support aid for educators and counselors. The system must never be used for punitive grading, automated tracking, or access denial.
          </p>
        </div>
      </section>

      {/* 8. Academic Citations */}
      <section className="bg-white border border-slate-200 rounded-md p-6 sm:p-7 space-y-4">
        <div className="flex items-center space-x-3 pb-3 border-b border-slate-200">
          <BookOpen className="w-5 h-5 text-slate-700" />
          <h2 className="text-lg font-bold text-slate-900">
            8. Academic Citations &amp; Source References
          </h2>
        </div>

        <div className="space-y-3 text-xs text-slate-600 leading-relaxed font-mono">
          <div className="bg-slate-50 p-3 rounded border border-slate-200">
            <span className="font-sans font-semibold text-slate-800 block mb-1">Dataset Citation:</span>
            Cortez, P., &amp; Silva, A. (2008). Using data mining to predict secondary school student performance. In Proceedings of 5th Annual Future Business Technology Conference (FUBUTEC 2008), Porto, Portugal, pp. 5-12. EUROSIS.
            <div className="mt-1 font-sans">
              <a
                href="https://archive.ics.uci.edu/dataset/320/student+performance"
                target="_blank"
                rel="noreferrer"
                className="text-blue-700 hover:text-blue-900 inline-flex items-center space-x-1"
              >
                <span>https://archive.ics.uci.edu/dataset/320/student+performance</span>
                <ExternalLink className="w-3 h-3" />
              </a>
            </div>
          </div>
        </div>
      </section>

      {/* 9. Non-Contact Project Statement & Version */}
      <section className="bg-slate-50 border border-slate-200 rounded-md p-6 sm:p-7 space-y-3">
        <div className="flex items-center justify-between">
          <h2 className="text-base font-bold text-slate-900">
            9. Prototype Review &amp; Non-Contact Statement
          </h2>
          <span className="text-xs font-mono bg-white text-slate-700 px-2.5 py-1 rounded border border-slate-300">
            Version 1.0.0
          </span>
        </div>
        <p className="text-xs sm:text-sm text-slate-600 leading-relaxed">
          EduExplain AI is an educational research prototype developed specifically for hackathon evaluation and academic demonstration. Direct email support is not monitored for this standalone prototype. Independent code review, model verification, and dataset replication can be conducted directly via the project repository and submission portal.
        </p>
      </section>
    </div>
  );
};
