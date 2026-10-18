import React, { useState, useEffect } from 'react';
import { api } from '../services/api';
import type { ModelMetrics } from '../types';
import {
  Database,
  FileCode2,
  AlertTriangle,
  Layers,
  BarChart,
  ExternalLink,
  Info,
  CheckCircle2,
  Scale,
  BookOpen
} from 'lucide-react';

export const Methodology: React.FC = () => {
  const [metrics, setMetrics] = useState<ModelMetrics | null>(null);

  useEffect(() => {
    api.getMetrics()
      .then((data) => setMetrics(data))
      .catch(() => {});
  }, []);

  return (
    <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-10 space-y-12">
      {/* Header */}
      <div>
        <div className="inline-flex items-center space-x-2 bg-slate-100 border border-slate-300 text-slate-800 text-xs px-3 py-1 rounded-md font-medium mb-3">
          <span>Module 03</span>
          <span className="text-slate-400">/</span>
          <span>Methodology &amp; Evaluation</span>
        </div>
        <h1 className="text-2xl sm:text-3xl font-bold tracking-tight text-slate-900">
          Dataset, Preprocessing, and Empirical Evaluation
        </h1>
        <p className="mt-2 text-sm text-slate-600 max-w-3xl leading-relaxed">
          EduExplain AI uses a Logistic Regression model trained on the UCI Student Performance dataset. Feature contributions are calculated from the model coefficients and describe how each input influenced the model output. They do not prove causation. Deployed architecture: Logistic Regression with coefficient-based feature contribution analysis.
        </p>
      </div>

      {/* Dataset & Target Definitions */}
      <section className="bg-white border border-slate-200 rounded-md p-6 sm:p-7 space-y-6">
        <div className="flex items-center space-x-3 pb-3 border-b border-slate-200">
          <Database className="w-5 h-5 text-slate-700" />
          <h2 className="text-lg font-bold text-slate-900">
            1. Benchmark Dataset and Target Variable Definition
          </h2>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-2 gap-6 text-xs sm:text-sm text-slate-600 leading-relaxed">
          <div className="space-y-3">
            <h3 className="font-semibold text-slate-900 text-sm">
              UCI Student Performance Benchmark
            </h3>
            <p>
              Collected by Paulo Cortez and Alice Silva (2008) at the University of Minho, Portugal. Data captures secondary school students across two regional public schools (Gabriel Pereira and Mousinho da Silveira) during the 2005-2006 academic year.
            </p>
            <p>
              <strong>Dataset Selection:</strong> The application models the primary Mathematics course cohort (<code className="font-mono bg-slate-100 px-1 py-0.5 rounded text-xs text-slate-800">student-mat.csv</code>), comprising 395 records and 33 attributes. The companion Portuguese language dataset (<code className="font-mono bg-slate-100 px-1 py-0.5 rounded text-xs text-slate-800">student-por.csv</code>, 649 records) is preserved in the project data repository.
            </p>
            <div className="pt-1">
              <a
                href="https://archive.ics.uci.edu/dataset/320/student+performance"
                target="_blank"
                rel="noreferrer"
                className="text-xs font-semibold text-blue-700 hover:text-blue-900 inline-flex items-center space-x-1"
              >
                <span>Official UCI Repository Reference (DOI: 10.24432/C5TG7T)</span>
                <ExternalLink className="w-3 h-3" />
              </a>
            </div>
            <p className="text-xs text-slate-500">
              License: Creative Commons Attribution 4.0 International (CC BY 4.0).
            </p>
          </div>

          <div className="space-y-3 bg-slate-50 p-4 rounded-md border border-slate-200">
            <h3 className="font-semibold text-slate-900 text-sm">
              Target Variable: 3-Tier Academic Risk
            </h3>
            <p className="text-xs text-slate-600">
              In the Portuguese secondary grading system, evaluations range from 0 to 20 points, with 10 representing the statutory passing threshold. EduExplain AI defines three operational tiers:
            </p>
            <div className="space-y-2 text-xs">
              <div className="p-2.5 bg-rose-50 border border-rose-200 rounded text-rose-900">
                <strong>Higher Risk (G3 &lt; 10):</strong> Failing mark. Immediate academic assistance and counseling required. Cohort prevalence: 32.9%.
              </div>
              <div className="p-2.5 bg-amber-50 border border-amber-200 rounded text-amber-900">
                <strong>Moderate Risk (G3 from 10 to 13):</strong> Passing, but borderline or vulnerable. Close monitoring advised. Cohort prevalence: 41.8%.
              </div>
              <div className="p-2.5 bg-emerald-50 border border-emerald-200 rounded text-emerald-900">
                <strong>Lower Concern (G3 &ge; 14):</strong> Proficient to excellent academic performance. Cohort prevalence: 25.3%.
              </div>
            </div>
          </div>
        </div>

        {/* Prior-Period Grades Limitation Callout */}
        <div className="bg-amber-50 border border-amber-300 rounded-md p-4 text-xs sm:text-sm text-amber-900 space-y-2">
          <div className="flex items-center space-x-2 font-semibold">
            <Info className="w-4 h-4 text-amber-700" />
            <span>Prior-Period Grades (G1, G2) Methodological Note &amp; Limitation</span>
          </div>
          <p className="leading-relaxed text-xs">
            First period grade (G1) and second period grade (G2) are mid-year academic milestones. Including them yields strong predictive power for final grade G3. However, this means the model functions primarily as a mid-term early warning and intervention tool rather than a pre-enrollment screener. If predictions were required prior to course commencement, G1 and G2 would be unavailable, and models would rely on historical antecedents like past course failures, weekly study habits, and attendance patterns.
          </p>
        </div>

        {/* Target Leakage Prevention Notice */}
        <div className="bg-slate-50 border border-slate-200 rounded-md p-3.5 text-xs text-slate-700 flex items-start space-x-2.5">
          <CheckCircle2 className="w-4 h-4 text-blue-600 shrink-0 mt-0.5" />
          <div>
            <strong>Target Leakage Prevention:</strong> Final grade G3 is the prediction target and is strictly excluded from all training and inference input feature vectors.
          </div>
        </div>
      </section>

      {/* Preprocessing and Splitting */}
      <section className="bg-white border border-slate-200 rounded-md p-6 sm:p-7 space-y-6">
        <div className="flex items-center space-x-3 pb-3 border-b border-slate-200">
          <Layers className="w-5 h-5 text-slate-700" />
          <h2 className="text-lg font-bold text-slate-900">
            2. Data Preprocessing and Partitioning Protocol
          </h2>
        </div>

        <div className="grid grid-cols-1 sm:grid-cols-3 gap-4 text-xs">
          <div className="p-4 bg-slate-50 border border-slate-200 rounded-md">
            <strong className="block text-slate-900 font-semibold mb-1">Stratified Train/Test Split</strong>
            <p className="text-slate-600 leading-relaxed">
              80% Training (316 students) and 20% Held-Out Testing (79 students). Stratification preserves exact class frequencies across Higher Risk, Moderate Risk, and Lower Concern. Random seed is locked to 42 for exact reproducibility.
            </p>
          </div>

          <div className="p-4 bg-slate-50 border border-slate-200 rounded-md">
            <strong className="block text-slate-900 font-semibold mb-1">Categorical Encoding</strong>
            <p className="text-slate-600 leading-relaxed">
              Binary and nominal attributes (<code className="font-mono text-[11px]">schoolsup</code>, <code className="font-mono text-[11px]">famsup</code>, <code className="font-mono text-[11px]">paid</code>, <code className="font-mono text-[11px]">activities</code>, <code className="font-mono text-[11px]">higher</code>, <code className="font-mono text-[11px]">internet</code>, <code className="font-mono text-[11px]">romantic</code>) are encoded via OneHotEncoder with drop-first formulation.
            </p>
          </div>

          <div className="p-4 bg-slate-50 border border-slate-200 rounded-md">
            <strong className="block text-slate-900 font-semibold mb-1">Identical Pipeline for Inference</strong>
            <p className="text-slate-600 leading-relaxed">
              The exact fitted ColumnTransformer is serialized to <code className="font-mono text-[11px]">backend/models/preprocessor.joblib</code> and reused during live predictions to prevent train-serve skew.
            </p>
          </div>
        </div>
      </section>

      {/* Model Performance & Empirical Metrics */}
      <section className="bg-white border border-slate-200 rounded-md p-6 sm:p-7 space-y-6">
        <div className="flex flex-col sm:flex-row sm:items-center justify-between pb-3 border-b border-slate-200 gap-2">
          <div className="flex items-center space-x-3">
            <BarChart className="w-5 h-5 text-slate-700" />
            <h2 className="text-lg font-bold text-slate-900">
              3. Empirical Model Evaluation (Held-Out Test Set N=79)
            </h2>
          </div>
          <div className="flex flex-wrap items-center gap-2">
            <span className="text-[11px] font-mono bg-slate-100 text-slate-700 px-2 py-0.5 rounded border border-slate-200">
              Split: 80/20 (316/79)
            </span>
            <span className="text-[11px] font-mono bg-slate-100 text-slate-700 px-2 py-0.5 rounded border border-slate-200">
              Seed: 42
            </span>
            <span className="text-[11px] font-mono bg-slate-100 text-slate-700 px-2 py-0.5 rounded border border-slate-200">
              Version: 1.0.0
            </span>
            <span className="text-[11px] font-mono bg-slate-100 text-slate-700 px-2 py-0.5 rounded border border-slate-200">
              Date: October 2026
            </span>
          </div>
        </div>

        {/* Top-line KPI Cards */}
        <div className="grid grid-cols-2 sm:grid-cols-4 gap-4">
          <div className="bg-slate-50 border border-slate-200 rounded-md p-4">
            <span className="text-xs text-slate-500 font-medium block mb-1">3-Tier Test Accuracy</span>
            <div className="text-2xl font-extrabold text-slate-900 font-mono">
              {metrics ? `${(metrics.evaluation.three_tier_model.test_accuracy * 100).toFixed(2)}%` : '82.28%'}
            </div>
            <span className="text-[11px] text-slate-500 block mt-0.5">
              Macro F1: {metrics ? (metrics.evaluation.three_tier_model.macro_f1 * 100).toFixed(1) : '81.5'}%
            </span>
          </div>

          <div className="bg-slate-50 border border-slate-200 rounded-md p-4">
            <span className="text-xs text-slate-500 font-medium block mb-1">5-Fold Stratified CV</span>
            <div className="text-2xl font-extrabold text-slate-900 font-mono">
              {metrics ? `${(metrics.evaluation.three_tier_model.cv_5fold_mean_accuracy * 100).toFixed(1)}%` : '86.8%'}
            </div>
            <span className="text-[11px] text-slate-500 block mt-0.5">
              &plusmn; {metrics ? (metrics.evaluation.three_tier_model.cv_5fold_std * 100).toFixed(2) : '2.84'}% cross-validation
            </span>
          </div>

          <div className="bg-slate-50 border border-slate-200 rounded-md p-4">
            <span className="text-xs text-slate-500 font-medium block mb-1">Higher Risk Recall</span>
            <div className="text-2xl font-extrabold text-emerald-700 font-mono">
              {metrics ? `${(metrics.evaluation.three_tier_model.per_class_metrics['High Risk'].recall * 100).toFixed(1)}%` : '92.3%'}
            </div>
            <span className="text-[11px] text-slate-500 block mt-0.5">24 / 26 failing students flagged</span>
          </div>

          <div className="bg-slate-50 border border-slate-200 rounded-md p-4">
            <span className="text-xs text-slate-500 font-medium block mb-1">Grade Regressor RMSE</span>
            <div className="text-2xl font-extrabold text-slate-900 font-mono">
              {metrics ? metrics.evaluation.grade_regression_model.rmse.toFixed(3) : '1.452'}
            </div>
            <span className="text-[11px] text-slate-500 block mt-0.5">
              MAE: {metrics ? metrics.evaluation.grade_regression_model.mae.toFixed(3) : '0.929'} | R&sup2;: {metrics ? metrics.evaluation.grade_regression_model.r2_score.toFixed(3) : '0.889'}
            </span>
          </div>
        </div>

        {/* Macro Summary Strip */}
        <div className="bg-slate-50 border border-slate-200 rounded-md p-3 text-xs flex flex-wrap items-center justify-between gap-3 text-slate-700">
          <div>
            <span className="font-semibold text-slate-900">Macro Precision:</span>{' '}
            <span className="font-mono">86.69%</span>
          </div>
          <div>
            <span className="font-semibold text-slate-900">Macro Recall:</span>{' '}
            <span className="font-mono">80.06%</span>
          </div>
          <div>
            <span className="font-semibold text-slate-900">Macro F1-Score:</span>{' '}
            <span className="font-mono">81.48%</span>
          </div>
          <div>
            <span className="font-semibold text-slate-900">Binary ROC-AUC (G3 &lt; 10):</span>{' '}
            <span className="font-mono font-bold text-emerald-700">0.9906</span>
          </div>
        </div>

        {/* Detailed Per-Class Breakdown & Confusion Matrix */}
        <div className="grid grid-cols-1 md:grid-cols-2 gap-6 pt-2">
          {/* Per-Class Table */}
          <div className="border border-slate-200 rounded-md p-4">
            <h3 className="text-xs font-semibold text-slate-800 uppercase tracking-wider mb-3">
              Per-Class Classification Metrics (Held-Out Test N=79)
            </h3>
            <table className="w-full text-left text-xs">
              <thead>
                <tr className="border-b border-slate-200 text-slate-500">
                  <th className="py-2 px-2">Category</th>
                  <th className="py-2 px-2 text-right">Precision</th>
                  <th className="py-2 px-2 text-right">Recall</th>
                  <th className="py-2 px-2 text-right">F1-Score</th>
                  <th className="py-2 px-2 text-right">Test Support</th>
                </tr>
              </thead>
              <tbody className="divide-y divide-slate-100 font-mono">
                <tr>
                  <td className="py-2.5 px-2 font-medium text-slate-900 font-sans">Higher Risk</td>
                  <td className="py-2.5 px-2 text-right">85.71%</td>
                  <td className="py-2.5 px-2 text-right font-bold text-emerald-700">92.31%</td>
                  <td className="py-2.5 px-2 text-right">88.89%</td>
                  <td className="py-2.5 px-2 text-right text-slate-500">26</td>
                </tr>
                <tr>
                  <td className="py-2.5 px-2 font-medium text-slate-900 font-sans">Moderate Risk</td>
                  <td className="py-2.5 px-2 text-right">74.36%</td>
                  <td className="py-2.5 px-2 text-right">87.88%</td>
                  <td className="py-2.5 px-2 text-right">80.56%</td>
                  <td className="py-2.5 px-2 text-right text-slate-500">33</td>
                </tr>
                <tr>
                  <td className="py-2.5 px-2 font-medium text-slate-900 font-sans">Lower Concern</td>
                  <td className="py-2.5 px-2 text-right">100.00%</td>
                  <td className="py-2.5 px-2 text-right">60.00%</td>
                  <td className="py-2.5 px-2 text-right">75.00%</td>
                  <td className="py-2.5 px-2 text-right text-slate-500">20</td>
                </tr>
              </tbody>
            </table>
          </div>

          {/* Confusion Matrix */}
          <div className="border border-slate-200 rounded-md p-4">
            <h3 className="text-xs font-semibold text-slate-800 uppercase tracking-wider mb-3">
              Empirical Test Confusion Matrix (N=79)
            </h3>
            <div className="overflow-x-auto">
              <table className="w-full text-center text-xs">
                <thead>
                  <tr className="text-slate-500 border-b border-slate-200">
                    <th className="py-2 px-2 text-left font-normal">Actual \ Pred</th>
                    <th className="py-2 px-2 font-semibold">Pred: High</th>
                    <th className="py-2 px-2 font-semibold">Pred: Mod</th>
                    <th className="py-2 px-2 font-semibold">Pred: Low</th>
                  </tr>
                </thead>
                <tbody className="divide-y divide-slate-100 font-mono">
                  <tr>
                    <td className="py-2 px-2 text-left font-semibold text-slate-700 font-sans">Act: High (26)</td>
                    <td className="py-2 px-2 bg-emerald-50 text-emerald-800 font-bold border border-emerald-200">24</td>
                    <td className="py-2 px-2 text-slate-600">2</td>
                    <td className="py-2 px-2 text-slate-400">0</td>
                  </tr>
                  <tr>
                    <td className="py-2 px-2 text-left font-semibold text-slate-700 font-sans">Act: Mod (33)</td>
                    <td className="py-2 px-2 text-slate-600">4</td>
                    <td className="py-2 px-2 bg-emerald-50 text-emerald-800 font-bold border border-emerald-200">29</td>
                    <td className="py-2 px-2 text-slate-400">0</td>
                  </tr>
                  <tr>
                    <td className="py-2 px-2 text-left font-semibold text-slate-700 font-sans">Act: Low (20)</td>
                    <td className="py-2 px-2 text-slate-400">0</td>
                    <td className="py-2 px-2 text-slate-600">8</td>
                    <td className="py-2 px-2 bg-emerald-50 text-emerald-800 font-bold border border-emerald-200">12</td>
                  </tr>
                </tbody>
              </table>
            </div>
            <p className="mt-3 text-[11px] text-slate-500 leading-relaxed">
              Zero actual High-Risk students were misclassified as Lower Concern, preventing false-negative intervention failures.
            </p>
          </div>
        </div>

        {/* Baseline Comparison Table */}
        <div className="border border-slate-200 rounded-md p-4 space-y-3">
          <div className="flex items-center space-x-2">
            <Scale className="w-4 h-4 text-slate-700" />
            <h3 className="text-xs font-semibold text-slate-800 uppercase tracking-wider">
              Baseline Model Comparison (Held-Out Test Set N=79)
            </h3>
          </div>
          <table className="w-full text-left text-xs">
            <thead>
              <tr className="border-b border-slate-200 text-slate-500">
                <th className="py-2 px-2">Model Architecture</th>
                <th className="py-2 px-2">Model Type</th>
                <th className="py-2 px-2 text-right">Test Accuracy</th>
                <th className="py-2 px-2 text-slate-500">Operational Role</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-slate-100">
              <tr>
                <td className="py-2.5 px-2 font-medium text-slate-900">Zero-R / Majority Class</td>
                <td className="py-2.5 px-2 text-slate-600 font-mono text-[11px]">DummyClassifier</td>
                <td className="py-2.5 px-2 text-right font-mono text-slate-700">41.77%</td>
                <td className="py-2.5 px-2 text-slate-500 text-[11px]">Naive floor (predicts Moderate Risk always)</td>
              </tr>
              <tr className="bg-slate-50/70">
                <td className="py-2.5 px-2 font-bold text-slate-900">Logistic Regression (Deployed)</td>
                <td className="py-2.5 px-2 text-slate-800 font-mono text-[11px]">Multinomial Linear Model (L2)</td>
                <td className="py-2.5 px-2 text-right font-mono font-bold text-slate-900">82.28%</td>
                <td className="py-2.5 px-2 text-slate-700 text-[11px] font-medium">Interpretable model with feature contribution analysis</td>
              </tr>
            </tbody>
          </table>
        </div>
      </section>

      {/* Model Limitations & Bias */}
      <section className="bg-white border border-slate-200 rounded-md p-6 sm:p-7 space-y-4">
        <div className="flex items-center space-x-3 pb-3 border-b border-slate-200">
          <AlertTriangle className="w-5 h-5 text-amber-700" />
          <h2 className="text-lg font-bold text-slate-900">
            4. Model Limitations, Dataset Bias, and Uncertainty
          </h2>
        </div>

        <div className="space-y-3 text-xs sm:text-sm text-slate-600 leading-relaxed">
          <p>
            While the empirical accuracy and recall on the UCI benchmark are strong, all educational AI models have structural boundaries that must be explicitly acknowledged:
          </p>
          <ul className="space-y-2 list-disc pl-5 text-xs">
            <li>
              <strong>Dataset Scale and Class Distribution:</strong> The mathematics dataset comprises 395 student instances. While sufficient for baseline research prototyping, 5-fold cross-validation exhibits variance of &plusmn; 2.84%. Class distribution has moderate imbalance (Higher Risk: 32.9%, Moderate Risk: 41.8%, Lower Concern: 25.3%).
            </li>
            <li>
              <strong>Regional Scope:</strong> The dataset reflects two Portuguese secondary schools in the mid-2000s under the Portuguese grading curriculum (0-20 scale). Generalizability to different cultural or grading environments requires localized recalibration.
            </li>
            <li>
              <strong>Observational Data and Self-Reporting:</strong> Several features (such as study time, alcohol consumption, and health) are self-reported survey responses and subject to social desirability bias.
            </li>
            <li>
              <strong>Absence of Latent Pedagogical Factors:</strong> The dataset does not account for teacher instructional efficacy, curriculum adjustments, neurodiversity, or unmeasured socioeconomic hardship.
            </li>
            <li>
              <strong>Uncertainty Awareness:</strong> Model-estimated class probabilities quantify epistemic and aleatoric uncertainty. Predictions with confidence close to the 50% boundary should always prompt comprehensive human educator review.
            </li>
          </ul>
        </div>
      </section>

      {/* Reproducibility Instructions */}
      <section className="bg-white border border-slate-200 rounded-md p-6 sm:p-7 space-y-4">
        <div className="flex items-center space-x-3 pb-3 border-b border-slate-200">
          <FileCode2 className="w-5 h-5 text-slate-700" />
          <h2 className="text-lg font-bold text-slate-900">
            5. Reproducibility &amp; Pipeline Code
          </h2>
        </div>

        <p className="text-xs sm:text-sm text-slate-600 leading-relaxed">
          To reproduce the model artifacts, evaluation metrics, and feature explainers identically, run the automated pipeline from the repository root:
        </p>

        <div className="bg-slate-900 text-slate-100 p-4 rounded-md font-mono text-xs overflow-x-auto space-y-1">
          <div className="text-slate-400"># 1. Install validated dependencies</div>
          <div>pip install scikit-learn pandas numpy fastapi uvicorn</div>
          <div className="text-slate-400 pt-2"># 2. Execute end-to-end training, CV evaluation, and artifact serialization</div>
          <div>python backend/train_model.py</div>
          <div className="text-slate-400 pt-2"># 3. Launch the research API server</div>
          <div>python server.py</div>
        </div>
      </section>

      {/* Academic Citations */}
      <section className="bg-white border border-slate-200 rounded-md p-6 sm:p-7 space-y-4">
        <div className="flex items-center space-x-3 pb-3 border-b border-slate-200">
          <BookOpen className="w-5 h-5 text-slate-700" />
          <h2 className="text-lg font-bold text-slate-900">
            6. Academic References &amp; Source Citations
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
                <span>Official UCI Repository Reference (DOI: 10.24432/C5TG7T)</span>
                <ExternalLink className="w-3 h-3" />
              </a>
            </div>
          </div>
        </div>
      </section>
    </div>
  );
};
