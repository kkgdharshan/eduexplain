import React, { useState, useEffect } from 'react';
import { useLocation, Link } from 'react-router-dom';
import { useStudent } from '../context/StudentContext';
import { api, ApiError } from '../services/api';
import type {
  GlobalFeature,
  WhatIfResult,
  StudentInput
} from '../types';
import {
  HelpCircle,
  Sliders,
  BarChart3,
  ArrowRight,
  Info,
  RefreshCw,
  Sparkles,
  ChevronRight
} from 'lucide-react';

export const Explanation: React.FC = () => {
  const location = useLocation();
  const { student, prediction, explanation } = useStudent();

  const [activeTab, setActiveTab] = useState<'local' | 'global' | 'whatif'>('local');
  const [globalFeatures, setGlobalFeatures] = useState<GlobalFeature[]>([]);
  const [globalLoading, setGlobalLoading] = useState(false);

  // What-If state
  const [whatIfInput, setWhatIfInput] = useState<StudentInput>(student);
  const [whatIfResult, setWhatIfResult] = useState<WhatIfResult | null>(null);
  const [whatIfLoading, setWhatIfLoading] = useState(false);
  const [whatIfError, setWhatIfError] = useState<string | null>(null);

  // Sync whatIfInput when student changes
  useEffect(() => {
    setWhatIfInput(student);
  }, [student]);

  // Handle URL hash navigation (e.g. #what-if)
  useEffect(() => {
    if (location.hash === '#what-if') {
      setActiveTab('whatif');
    } else if (location.hash === '#global') {
      setActiveTab('global');
    }
  }, [location.hash]);

  // Fetch global importance once
  useEffect(() => {
    setGlobalLoading(true);
    api.getGlobalImportance()
      .then((data) => setGlobalFeatures(data))
      .catch(() => {})
      .finally(() => setGlobalLoading(false));
  }, []);

  // Run What-If simulation
  const handleRunWhatIf = async () => {
    setWhatIfLoading(true);
    setWhatIfError(null);
    try {
      const res = await api.whatIf(student, whatIfInput);
      setWhatIfResult(res);
    } catch (err: any) {
      if (err instanceof ApiError) {
        setWhatIfError(err.message);
      } else {
        setWhatIfError('Could not execute What-If simulation.');
      }
    } finally {
      setWhatIfLoading(false);
    }
  };

  // Run initial simulation if baseline is ready
  useEffect(() => {
    if (activeTab === 'whatif' && !whatIfResult && prediction) {
      handleRunWhatIf();
    }
  }, [activeTab]);

  return (
    <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-10 space-y-10">
      {/* Header */}
      <div>
        <div className="inline-flex items-center space-x-2 bg-slate-100 border border-slate-300 text-slate-800 text-xs px-3 py-1 rounded-md font-medium mb-3">
          <span>Module 02</span>
          <span className="text-slate-400">/</span>
          <span>Explainability &amp; Simulation</span>
        </div>
        <h1 className="text-2xl sm:text-3xl font-bold tracking-tight text-slate-900">
          Model Explainability and Scenario Simulation
        </h1>
        <p className="mt-2 text-sm text-slate-600 max-w-3xl leading-relaxed">
          Unpack the underlying factors driving student risk predictions using Logistic Regression with coefficient-based feature contribution analysis. Contrast local individual model coefficient contributions against global model feature importance, and simulate how changed input values affect model predictions.
        </p>
      </div>

      {/* Prominent Causation vs Association Notice */}
      <div className="bg-slate-50 border border-slate-300 rounded-md p-4 sm:p-5 flex items-start space-x-3.5">
        <Info className="w-5 h-5 text-slate-700 shrink-0 mt-0.5" />
        <div className="text-xs sm:text-sm text-slate-700 leading-relaxed">
          <strong className="font-semibold text-slate-900 block mb-0.5">
            Methodological Foundation: Correlation and Feature Importance vs. Causation
          </strong>
          Feature importance metrics (model coefficient weights) describe how the mathematical model utilizes variables to optimize prediction accuracy on observational data from the UCI repository. High importance indicates strong statistical association, not physical or clinical causation. Educational mentors must apply professional judgment when designing student interventions.
        </div>
      </div>

      {/* Tabs */}
      <div className="border-b border-slate-200">
        <nav className="flex space-x-4 sm:space-x-8" aria-label="Explainability Views">
          <button
            type="button"
            onClick={() => setActiveTab('local')}
            className={`pb-3.5 text-sm font-medium border-b-2 flex items-center space-x-2 transition-colors ${
              activeTab === 'local'
                ? 'border-slate-900 text-slate-900 font-semibold'
                : 'border-transparent text-slate-500 hover:text-slate-700 hover:border-slate-300'
            }`}
          >
            <HelpCircle className="w-4 h-4" />
            <span>Feature Contribution Analysis</span>
          </button>

          <button
            type="button"
            onClick={() => setActiveTab('global')}
            className={`pb-3.5 text-sm font-medium border-b-2 flex items-center space-x-2 transition-colors ${
              activeTab === 'global'
                ? 'border-slate-900 text-slate-900 font-semibold'
                : 'border-transparent text-slate-500 hover:text-slate-700 hover:border-slate-300'
            }`}
          >
            <BarChart3 className="w-4 h-4" />
            <span>Global Feature Importance</span>
          </button>

          <button
            type="button"
            onClick={() => setActiveTab('whatif')}
            className={`pb-3.5 text-sm font-medium border-b-2 flex items-center space-x-2 transition-colors ${
              activeTab === 'whatif'
                ? 'border-slate-900 text-slate-900 font-semibold'
                : 'border-transparent text-slate-500 hover:text-slate-700 hover:border-slate-300'
            }`}
          >
            <Sliders className="w-4 h-4" />
            <span>&quot;What If?&quot; Scenario Simulator</span>
          </button>
        </nav>
      </div>

      {/* TAB 1: LOCAL FEATURE CONTRIBUTION EXPLANATION */}
      {activeTab === 'local' && (
        <div className="space-y-8">
          {!explanation ? (
            <div className="bg-white border border-slate-200 rounded-md p-10 text-center">
              <HelpCircle className="w-10 h-10 text-slate-400 mx-auto mb-3" />
              <h2 className="text-base font-bold text-slate-800 mb-1">
                No Active Student Assessment Found
              </h2>
              <p className="text-xs sm:text-sm text-slate-500 max-w-md mx-auto mb-5">
                Run a student prediction in the Risk Assessment module to view local feature contribution analysis and mathematical risk decomposition.
              </p>
              <Link
                to="/assessment"
                className="inline-flex items-center space-x-2 bg-slate-900 hover:bg-slate-800 text-white text-xs font-medium px-4 py-2 rounded-md shadow-sm transition-colors"
              >
                <span>Go to Risk Assessment</span>
                <ArrowRight className="w-3.5 h-3.5" />
              </Link>
            </div>
          ) : (
            <>
              {/* Summary Cards */}
              <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
                <div className="bg-white border border-slate-200 rounded-md p-4">
                  <span className="text-xs font-medium text-slate-500 uppercase tracking-wider block">
                    Dataset Baseline Risk (E[f(x)])
                  </span>
                  <div className="mt-2 text-2xl font-bold text-slate-900">
                    {(explanation.base_value * 100).toFixed(1)}%
                  </div>
                  <p className="mt-1 text-xs text-slate-500 leading-relaxed">
                    Prior probability of academic risk across the historical training cohort.
                  </p>
                </div>

                <div className="bg-white border border-slate-200 rounded-md p-4">
                  <span className="text-xs font-medium text-slate-500 uppercase tracking-wider block">
                    Student Predicted Risk Probability
                  </span>
                  <div className="mt-2 text-2xl font-bold text-slate-900">
                    {(explanation.predicted_risk_probability * 100).toFixed(1)}%
                  </div>
                  <p className="mt-1 text-xs text-slate-500 leading-relaxed">
                    Model-estimated probability of final grade G3 falling below the passing threshold of 10.
                  </p>
                </div>

                <div className="bg-white border border-slate-200 rounded-md p-4">
                  <span className="text-xs font-medium text-slate-500 uppercase tracking-wider block">
                    Assigned Risk Category
                  </span>
                  <div className="mt-2 text-2xl font-bold text-slate-900">
                    {prediction?.risk_tier || 'Calculated'}
                  </div>
                  <p className="mt-1 text-xs text-slate-500 leading-relaxed">
                    Projected Grade: {prediction?.predicted_grade.toFixed(1) || 'N/A'} / 20 points.
                  </p>
                </div>
              </div>

              {/* Factor Contribution Table & Visual Bar Chart */}
              <div className="bg-white border border-slate-200 rounded-md p-6">
                <div className="flex flex-col sm:flex-row sm:items-center justify-between pb-4 border-b border-slate-200 mb-6 gap-2">
                  <div>
                    <h2 className="text-base font-bold text-slate-900">
                      Feature Contribution Analysis (Additive Decomposition)
                    </h2>
                    <p className="text-xs text-slate-500">
                      Positive coefficient contributions (+ sign) increase estimated risk toward the higher risk tier; negative contributions (- sign) act as protective buffers toward lower concern.
                    </p>
                  </div>
                  <span className="text-xs font-mono bg-slate-100 text-slate-600 px-2.5 py-1 rounded border border-slate-200 self-start sm:self-auto">
                    Sum(Contributions) + Bias = Predicted Risk
                  </span>
                </div>

                <div className="overflow-x-auto">
                  <table className="w-full text-left text-xs">
                    <thead>
                      <tr className="border-b border-slate-200 text-slate-500 uppercase tracking-wider">
                        <th className="py-2.5 px-3 font-semibold">Feature</th>
                        <th className="py-2.5 px-3 font-semibold">Student Value</th>
                        <th className="py-2.5 px-3 font-semibold">Impact Direction</th>
                        <th className="py-2.5 px-3 font-semibold text-right">Coefficient Contribution (&Delta; Risk)</th>
                        <th className="py-2.5 px-3 font-semibold text-right w-44">Visual Magnitude</th>
                      </tr>
                    </thead>
                    <tbody className="divide-y divide-slate-100">
                      {explanation.feature_contributions.map((fc) => {
                        const isRisk = fc.impact_type === 'risk_increasing';
                        const absWidth = Math.min(100, Math.round((fc.abs_shap / 0.35) * 100));

                        return (
                          <tr key={fc.raw_feature} className="hover:bg-slate-50/70 transition-colors">
                            <td className="py-3 px-3 font-medium text-slate-900">
                              {fc.label}
                            </td>
                            <td className="py-3 px-3 font-mono text-slate-600">
                              {fc.display_value}
                            </td>
                            <td className="py-3 px-3">
                              <span
                                className={`inline-flex items-center px-2 py-0.5 rounded text-[11px] font-medium border ${
                                  isRisk
                                    ? 'bg-rose-50 text-rose-800 border-rose-200'
                                    : 'bg-emerald-50 text-emerald-800 border-emerald-200'
                                }`}
                              >
                                {isRisk ? '+ Risk Factor' : '- Protective Buffer'}
                              </span>
                            </td>
                            <td
                              className={`py-3 px-3 text-right font-mono font-semibold ${
                                isRisk ? 'text-rose-700' : 'text-emerald-700'
                              }`}
                            >
                              {isRisk ? `+${(fc.shap_value * 100).toFixed(2)}%` : `${(fc.shap_value * 100).toFixed(2)}%`}
                            </td>
                            <td className="py-3 px-3 text-right">
                              <div className="w-full bg-slate-100 h-2 rounded-full overflow-hidden flex">
                                {isRisk ? (
                                  <div
                                    className="bg-rose-500 h-2 rounded-full"
                                    style={{ width: `${absWidth}%` }}
                                    title={`+${(fc.shap_value * 100).toFixed(2)}%`}
                                  />
                                ) : (
                                  <div
                                    className="bg-emerald-500 h-2 rounded-full ml-auto"
                                    style={{ width: `${absWidth}%` }}
                                    title={`${(fc.shap_value * 100).toFixed(2)}%`}
                                  />
                                )}
                              </div>
                            </td>
                          </tr>
                        );
                      })}
                    </tbody>
                  </table>
                </div>

                <div className="mt-6 pt-4 border-t border-slate-100 flex flex-col sm:flex-row items-center justify-between text-xs text-slate-500 gap-3">
                  <p>
                    Mathematical engine: Logistic Regression with coefficient-based feature contribution analysis.
                  </p>
                  <button
                    type="button"
                    onClick={() => setActiveTab('whatif')}
                    className="inline-flex items-center space-x-1.5 text-blue-700 hover:text-blue-900 font-semibold"
                  >
                    <span>Test hypothetical changes in What-If Simulator</span>
                    <ArrowRight className="w-3.5 h-3.5" />
                  </button>
                </div>
              </div>
            </>
          )}
        </div>
      )}

      {/* TAB 2: GLOBAL FEATURE IMPORTANCE */}
      {activeTab === 'global' && (
        <div className="space-y-6">
          <div className="bg-white border border-slate-200 rounded-md p-6">
            <div className="pb-4 border-b border-slate-200 mb-6">
              <h2 className="text-base font-bold text-slate-900">
                Population-Level Feature Importance (UCI Math Course)
              </h2>
              <p className="text-xs text-slate-500 mt-1">
                Aggregated feature importance evaluated across the held-out validation cohort (N=79) using Mean Absolute Coefficient Contributions and Logistic Regression feature weights.
              </p>
            </div>

            {globalLoading ? (
              <div className="py-12 text-center text-slate-500 text-xs">
                <RefreshCw className="w-5 h-5 animate-spin mx-auto mb-2 text-slate-400" />
                <span>Loading global model metrics...</span>
              </div>
            ) : (
              <div className="overflow-x-auto">
                <table className="w-full text-left text-xs">
                  <thead>
                    <tr className="border-b border-slate-200 text-slate-500 uppercase tracking-wider">
                      <th className="py-2.5 px-3 font-semibold">Rank</th>
                      <th className="py-2.5 px-3 font-semibold">Feature Name</th>
                      <th className="py-2.5 px-3 font-semibold text-right">Mean |Contribution|</th>
                      <th className="py-2.5 px-3 font-semibold text-right">Model Weight</th>
                      <th className="py-2.5 px-3 font-semibold text-right w-48">Relative Influence</th>
                    </tr>
                  </thead>
                  <tbody className="divide-y divide-slate-100">
                    {globalFeatures.map((feat, index) => {
                      const maxShap = globalFeatures[0]?.mean_abs_shap || 0.2;
                      const relPercent = Math.round((feat.mean_abs_shap / maxShap) * 100);

                      return (
                        <tr key={feat.feature} className="hover:bg-slate-50 transition-colors">
                          <td className="py-3 px-3 font-mono font-medium text-slate-400">
                            #{index + 1}
                          </td>
                          <td className="py-3 px-3 font-medium text-slate-900">
                            {feat.label}
                          </td>
                          <td className="py-3 px-3 text-right font-mono font-semibold text-slate-800">
                            {feat.mean_abs_shap.toFixed(4)}
                          </td>
                          <td className="py-3 px-3 text-right font-mono text-slate-600">
                            {(feat.gini_importance * 100).toFixed(1)}%
                          </td>
                          <td className="py-3 px-3 text-right">
                            <div className="w-full bg-slate-100 h-2 rounded-full overflow-hidden">
                              <div
                                className="bg-slate-800 h-2 rounded-full"
                                style={{ width: `${relPercent}%` }}
                              />
                            </div>
                          </td>
                        </tr>
                      );
                    })}
                  </tbody>
                </table>
              </div>
            )}

            <div className="mt-6 pt-4 border-t border-slate-100 text-xs text-slate-600 leading-relaxed space-y-2">
              <strong className="block font-semibold text-slate-900">Academic Analytical Takeaway:</strong>
              <p>
                In the Portuguese secondary mathematics curriculum, intermediate grading milestone G2 (Second Period Grade) carries the single highest predictive weight, closely followed by G1 (First Period Grade) and prior course failures. Attendance patterns (absences) and weekly study dedication act as secondary behavioral differentiators.
              </p>
            </div>
          </div>
        </div>
      )}

      {/* TAB 3: WHAT-IF SCENARIO SIMULATOR */}
      {activeTab === 'whatif' && (
        <div className="space-y-8">
          <div className="grid grid-cols-1 lg:grid-cols-12 gap-8 items-start">
            {/* Input Levers Column */}
            <div className="lg:col-span-6 bg-white border border-slate-200 rounded-md p-6">
              <div className="flex items-center justify-between pb-3 border-b border-slate-200 mb-5">
                <div>
                  <h2 className="text-base font-bold text-slate-900">
                    Scenario Input Levers
                  </h2>
                  <p className="text-xs text-slate-500">
                    Adjust selected academic and attendance inputs to simulate how changed values affect the model output.
                  </p>
                </div>
                <button
                  type="button"
                  onClick={() => setWhatIfInput(student)}
                  className="text-xs text-slate-600 hover:text-slate-900 font-medium px-2 py-1 rounded border border-slate-200 hover:bg-slate-50"
                  title="Reset to current baseline"
                >
                  Reset Levers
                </button>
              </div>

              <div className="space-y-5 text-xs">
                {/* Study Time */}
                <div>
                  <div className="flex justify-between items-center mb-1">
                    <label htmlFor="whatif-studytime" className="font-semibold text-slate-800">
                      Weekly Study Dedication
                    </label>
                    <span className="font-mono text-slate-600">
                      Current: {student.studytime === 1 ? '<2h' : student.studytime === 2 ? '2-5h' : student.studytime === 3 ? '5-10h' : '>10h'}
                    </span>
                  </div>
                  <select
                    id="whatif-studytime"
                    value={whatIfInput.studytime}
                    onChange={(e) =>
                      setWhatIfInput((prev) => ({ ...prev, studytime: parseInt(e.target.value) }))
                    }
                    className="w-full px-3 py-2 text-sm border border-slate-300 rounded-md bg-white focus:ring-1 focus:ring-blue-600"
                  >
                    <option value={1}>Tier 1: &lt; 2 hours / week</option>
                    <option value={2}>Tier 2: 2 to 5 hours / week</option>
                    <option value={3}>Tier 3: 5 to 10 hours / week</option>
                    <option value={4}>Tier 4: &gt; 10 hours / week</option>
                  </select>
                </div>

                {/* Absences */}
                <div>
                  <div className="flex justify-between items-center mb-1">
                    <label htmlFor="whatif-absences" className="font-semibold text-slate-800">
                      School Absences (days)
                    </label>
                    <span className="font-mono text-slate-600">
                      Baseline: {student.absences} days
                    </span>
                  </div>
                  <input
                    id="whatif-absences"
                    type="number"
                    min="0"
                    max="93"
                    value={whatIfInput.absences}
                    onChange={(e) =>
                      setWhatIfInput((prev) => ({
                        ...prev,
                        absences: Math.max(0, parseInt(e.target.value) || 0)
                      }))
                    }
                    className="w-full px-3 py-2 text-sm border border-slate-300 rounded-md focus:ring-1 focus:ring-blue-600"
                  />
                  <span className="text-[11px] text-slate-400 block mt-0.5">
                    Simulated count of unexcused missed school days
                  </span>
                </div>

                {/* Changed G2 Input */}
                <div>
                  <div className="flex justify-between items-center mb-1">
                    <label htmlFor="whatif-g2" className="font-semibold text-slate-800">
                      Simulated Period 2 Grade (G2)
                    </label>
                    <span className="font-mono text-slate-600">
                      Baseline: {student.G2} / 20
                    </span>
                  </div>
                  <input
                    id="whatif-g2"
                    type="number"
                    min="0"
                    max="20"
                    value={whatIfInput.G2}
                    onChange={(e) =>
                      setWhatIfInput((prev) => ({
                        ...prev,
                        G2: Math.min(20, Math.max(0, parseInt(e.target.value) || 0))
                      }))
                    }
                    className="w-full px-3 py-2 text-sm border border-slate-300 rounded-md focus:ring-1 focus:ring-blue-600"
                  />
                  <span className="text-[11px] text-slate-400 block mt-0.5">
                    Simulate model prediction shift under changed midterm grade input
                  </span>
                </div>

                {/* Institutional & Family Support */}
                <div className="grid grid-cols-2 gap-3 pt-2">
                  <div>
                    <label htmlFor="whatif-schoolsup" className="font-semibold text-slate-800 block mb-1">
                      School Educational Support
                    </label>
                    <select
                      id="whatif-schoolsup"
                      value={whatIfInput.schoolsup}
                      onChange={(e) =>
                        setWhatIfInput((prev) => ({
                          ...prev,
                          schoolsup: e.target.value as 'yes' | 'no'
                        }))
                      }
                      className="w-full px-2.5 py-1.5 text-xs border border-slate-300 rounded-md bg-white"
                    >
                      <option value="no">No Support</option>
                      <option value="yes">Special Support (yes)</option>
                    </select>
                  </div>

                  <div>
                    <label htmlFor="whatif-famsup" className="font-semibold text-slate-800 block mb-1">
                      Family Study Support
                    </label>
                    <select
                      id="whatif-famsup"
                      value={whatIfInput.famsup}
                      onChange={(e) =>
                        setWhatIfInput((prev) => ({
                          ...prev,
                          famsup: e.target.value as 'yes' | 'no'
                        }))
                      }
                      className="w-full px-2.5 py-1.5 text-xs border border-slate-300 rounded-md bg-white"
                    >
                      <option value="yes">Assisting (yes)</option>
                      <option value="no">No Support (no)</option>
                    </select>
                  </div>
                </div>

                {/* Paid Tutoring */}
                <div>
                  <label htmlFor="whatif-paid" className="font-semibold text-slate-800 block mb-1">
                    Extra Paid Subject Tutoring
                  </label>
                  <select
                    id="whatif-paid"
                    value={whatIfInput.paid}
                    onChange={(e) =>
                      setWhatIfInput((prev) => ({
                        ...prev,
                        paid: e.target.value as 'yes' | 'no'
                      }))
                    }
                    className="w-full px-3 py-2 text-sm border border-slate-300 rounded-md bg-white"
                  >
                    <option value="no">No Paid Tutoring</option>
                    <option value="yes">Enrolled in Subject Tutoring (yes)</option>
                  </select>
                </div>

                <div className="pt-4 border-t border-slate-200">
                  <button
                    type="button"
                    onClick={handleRunWhatIf}
                    disabled={whatIfLoading}
                    className="w-full inline-flex items-center justify-center space-x-2 bg-slate-900 hover:bg-slate-800 disabled:bg-slate-400 text-white font-medium text-xs py-2.5 px-4 rounded-md shadow-sm transition-colors"
                  >
                    {whatIfLoading ? (
                      <>
                        <span className="w-3.5 h-3.5 border-2 border-white border-t-transparent rounded-full animate-spin" />
                        <span>Simulating Model Scenario...</span>
                      </>
                    ) : (
                      <>
                        <Sparkles className="w-3.5 h-3.5 text-slate-300" />
                        <span>Recompute Prediction for Scenario</span>
                      </>
                    )}
                  </button>
                </div>
              </div>
            </div>

            {/* Results Column */}
            <div className="lg:col-span-6 space-y-6">
              <div className="bg-white border border-slate-200 rounded-md p-6">
                <div className="pb-3 border-b border-slate-200 mb-5">
                  <h2 className="text-base font-bold text-slate-900">
                    Model Response to Changed Input Values
                  </h2>
                  <p className="text-xs text-slate-500 mt-1">
                    Simulated model output reflecting adjusted input parameters. This analysis does not guarantee student improvement or prescribe interventions.
                  </p>
                </div>

                {whatIfError && (
                  <div className="bg-rose-50 border border-rose-300 rounded-md p-3.5 text-xs text-rose-900 mb-4">
                    {whatIfError}
                  </div>
                )}

                {whatIfResult ? (
                  <div className="space-y-6 text-xs">
                    {/* Key Deltas Highlight Card */}
                    <div className="bg-slate-50 border border-slate-200 rounded-md p-4">
                      <span className="text-[11px] font-semibold uppercase tracking-wider text-slate-500 block mb-2">
                        Simulated Transition
                      </span>
                      <div className="text-lg font-bold text-slate-900 flex items-center space-x-2">
                        <span>{whatIfResult.baseline.risk_tier}</span>
                        <ChevronRight className="w-4 h-4 text-slate-400" />
                        <span
                          className={
                            whatIfResult.modified.risk_tier === 'Low Risk'
                              ? 'text-emerald-700'
                              : whatIfResult.modified.risk_tier === 'Moderate Risk'
                              ? 'text-amber-700'
                              : 'text-rose-700'
                          }
                        >
                          {whatIfResult.modified.risk_tier}
                        </span>
                      </div>

                      <div className="grid grid-cols-2 gap-3 mt-4 pt-3 border-t border-slate-200">
                        <div>
                          <span className="text-slate-500 text-[11px] block">Learning Risk Shift</span>
                          <span
                            className={`text-xl font-bold font-mono ${
                              whatIfResult.deltas.risk_probability_delta < 0
                                ? 'text-emerald-700'
                                : whatIfResult.deltas.risk_probability_delta > 0
                                ? 'text-rose-700'
                                : 'text-slate-800'
                            }`}
                          >
                            {whatIfResult.deltas.risk_probability_delta < 0
                              ? `${(whatIfResult.deltas.risk_probability_delta * 100).toFixed(1)}%`
                              : `+${(whatIfResult.deltas.risk_probability_delta * 100).toFixed(1)}%`}
                          </span>
                        </div>

                        <div>
                          <span className="text-slate-500 text-[11px] block">Projected Grade Shift</span>
                          <span
                            className={`text-xl font-bold font-mono ${
                              whatIfResult.deltas.predicted_grade_delta > 0
                                ? 'text-emerald-700'
                                : whatIfResult.deltas.predicted_grade_delta < 0
                                ? 'text-rose-700'
                                : 'text-slate-800'
                            }`}
                          >
                            {whatIfResult.deltas.predicted_grade_delta > 0
                              ? `+${whatIfResult.deltas.predicted_grade_delta.toFixed(1)} pts`
                              : `${whatIfResult.deltas.predicted_grade_delta.toFixed(1)} pts`}
                          </span>
                        </div>
                      </div>
                    </div>

                    {/* Detailed Side-by-Side Comparison */}
                    <div className="overflow-x-auto">
                      <table className="w-full text-left text-xs">
                        <thead>
                          <tr className="border-b border-slate-200 text-slate-500 uppercase tracking-wider">
                            <th className="py-2 px-2 font-semibold">Metric</th>
                            <th className="py-2 px-2 font-semibold">Baseline</th>
                            <th className="py-2 px-2 font-semibold">Simulated Scenario</th>
                            <th className="py-2 px-2 font-semibold text-right">Net Change</th>
                          </tr>
                        </thead>
                        <tbody className="divide-y divide-slate-100">
                          <tr>
                            <td className="py-2.5 px-2 font-medium text-slate-800">Risk Tier</td>
                            <td className="py-2.5 px-2 font-medium">{whatIfResult.baseline.risk_tier}</td>
                            <td className="py-2.5 px-2 font-bold text-slate-900">{whatIfResult.modified.risk_tier}</td>
                            <td className="py-2.5 px-2 text-right font-mono text-slate-500">
                              {whatIfResult.deltas.tier_transition}
                            </td>
                          </tr>
                          <tr>
                            <td className="py-2.5 px-2 font-medium text-slate-800">Risk Probability</td>
                            <td className="py-2.5 px-2 font-mono">{(whatIfResult.baseline.risk_probability * 100).toFixed(1)}%</td>
                            <td className="py-2.5 px-2 font-mono font-bold text-slate-900">{(whatIfResult.modified.risk_probability * 100).toFixed(1)}%</td>
                            <td
                              className={`py-2.5 px-2 text-right font-mono font-semibold ${
                                whatIfResult.deltas.risk_probability_delta < 0 ? 'text-emerald-700' : 'text-rose-700'
                              }`}
                            >
                              {(whatIfResult.deltas.risk_probability_delta * 100).toFixed(1)}%
                            </td>
                          </tr>
                          <tr>
                            <td className="py-2.5 px-2 font-medium text-slate-800">Final Grade (G3)</td>
                            <td className="py-2.5 px-2 font-mono">{whatIfResult.baseline.predicted_grade.toFixed(1)} / 20</td>
                            <td className="py-2.5 px-2 font-mono font-bold text-slate-900">{whatIfResult.modified.predicted_grade.toFixed(1)} / 20</td>
                            <td
                              className={`py-2.5 px-2 text-right font-mono font-semibold ${
                                whatIfResult.deltas.predicted_grade_delta > 0 ? 'text-emerald-700' : 'text-rose-700'
                              }`}
                            >
                              {whatIfResult.deltas.predicted_grade_delta > 0
                                ? `+${whatIfResult.deltas.predicted_grade_delta.toFixed(1)}`
                                : whatIfResult.deltas.predicted_grade_delta.toFixed(1)}
                            </td>
                          </tr>
                        </tbody>
                      </table>
                    </div>

                    {/* Detected Levers Table */}
                    {whatIfResult.deltas.changes_detected.length > 0 && (
                      <div className="pt-3 border-t border-slate-100">
                        <span className="text-[11px] font-semibold uppercase tracking-wider text-slate-500 block mb-2">
                          Active Scenario Levers Modified:
                        </span>
                        <div className="space-y-1.5">
                          {whatIfResult.deltas.changes_detected.map((c) => (
                            <div
                              key={c.feature}
                              className="flex items-center justify-between bg-slate-50 px-2.5 py-1.5 rounded border border-slate-200 text-xs"
                            >
                              <span className="font-medium text-slate-800">{c.label}</span>
                              <span className="font-mono text-slate-600">
                                {c.original_value} &rarr; <strong className="text-slate-900">{c.new_value}</strong>
                              </span>
                            </div>
                          ))}
                        </div>
                      </div>
                    )}
                  </div>
                ) : (
                  <div className="py-10 text-center text-slate-500 text-xs">
                    <Sliders className="w-8 h-8 text-slate-300 mx-auto mb-2" />
                    <span>Click &quot;Recompute Prediction for Scenario&quot; to test your adjusted parameters.</span>
                  </div>
                )}
              </div>
            </div>
          </div>
        </div>
      )}
    </div>
  );
};
