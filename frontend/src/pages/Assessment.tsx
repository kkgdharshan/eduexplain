import React, { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { useStudent } from '../context/StudentContext';
import {
  CheckCircle2,
  AlertCircle,
  HelpCircle,
  ArrowRight,
  RotateCcw,
  Info,
  ServerOff,
  Sliders
} from 'lucide-react';

export const Assessment: React.FC = () => {
  const navigate = useNavigate();
  const {
    student,
    updateField,
    prediction,
    loading,
    error,
    apiConnected,
    samples,
    runAssessment,
    loadSample,
    resetForm,
    checkConnection
  } = useStudent();

  const [fieldErrors, setFieldErrors] = useState<Record<string, string>>({});
  const [successNotice, setSuccessNotice] = useState<string | null>(null);

  // Validate form before submit
  const validate = (): boolean => {
    const errors: Record<string, string> = {};

    if (student.age < 15 || student.age > 22) {
      errors.age = 'Age must be between 15 and 22 years.';
    }
    if (student.G1 < 0 || student.G1 > 20) {
      errors.G1 = 'Period 1 Grade must be between 0 and 20 points.';
    }
    if (student.G2 < 0 || student.G2 > 20) {
      errors.G2 = 'Period 2 Grade must be between 0 and 20 points.';
    }
    if (student.absences < 0 || student.absences > 93) {
      errors.absences = 'Absences must be between 0 and 93 days.';
    }
    if (student.failures < 0 || student.failures > 4) {
      errors.failures = 'Past failures must be between 0 and 4.';
    }

    setFieldErrors(errors);
    return Object.keys(errors).length === 0;
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!validate()) {
      return;
    }

    const success = await runAssessment();
    if (success) {
      setSuccessNotice('Model prediction and feature contributions computed successfully.');
      setTimeout(() => setSuccessNotice(null), 4000);
    }
  };

  const handleSampleClick = (sampleId: string) => {
    const selected = samples.find((s) => s.id === sampleId);
    if (selected) {
      loadSample(selected);
      setFieldErrors({});
      setSuccessNotice(`Loaded pre-set profile: ${selected.profile_name}`);
      setTimeout(() => setSuccessNotice(null), 4000);
    }
  };

  return (
    <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-10 space-y-10">
      {/* Header */}
      <div>
        <div className="inline-flex items-center space-x-2 bg-slate-100 border border-slate-300 text-slate-800 text-xs px-3 py-1 rounded-md font-medium mb-3">
          <span>Module 01</span>
          <span className="text-slate-400">/</span>
          <span>Risk Assessment</span>
        </div>
        <h1 className="text-2xl sm:text-3xl font-bold tracking-tight text-slate-900">
          Student Academic Risk Assessment
        </h1>
        <p className="mt-2 text-sm text-slate-600 max-w-3xl leading-relaxed">
          Configure academic history, attendance, and support parameters based on the UCI Portuguese Secondary School benchmark. The trained Logistic Regression with coefficient-based feature contribution analysis evaluates multi-tier risk, model-estimated confidence, and class probabilities.
        </p>
      </div>

      {/* Backend offline alert if disconnected */}
      {!apiConnected && (
        <div className="bg-amber-50 border border-amber-300 rounded-md p-4 text-xs sm:text-sm text-amber-900 flex items-start space-x-3">
          <ServerOff className="w-5 h-5 text-amber-700 shrink-0 mt-0.5" />
          <div className="space-y-1">
            <strong className="font-semibold block">Model Service Connection Status</strong>
            <p>
              The predictive engine at <code className="bg-amber-100 px-1 py-0.5 rounded font-mono text-xs">http://localhost:8000</code> is currently offline or unreachable. Real predictions, model-estimated probabilities, and feature contribution analysis require an active backend server.
            </p>
            <button
              type="button"
              onClick={checkConnection}
              className="text-xs font-semibold text-amber-900 underline hover:text-amber-950 mt-1 inline-block"
            >
              Retry Connection Check
            </button>
          </div>
        </div>
      )}

      {/* Success notification */}
      {successNotice && (
        <div className="bg-emerald-50 border border-emerald-300 rounded-md p-3.5 text-xs sm:text-sm text-emerald-900 flex items-center space-x-2">
          <CheckCircle2 className="w-4 h-4 text-emerald-700 shrink-0" />
          <span>{successNotice}</span>
        </div>
      )}

      {/* Error alert */}
      {error && (
        <div className="bg-rose-50 border border-rose-300 rounded-md p-4 text-xs sm:text-sm text-rose-900 flex items-start space-x-3">
          <AlertCircle className="w-5 h-5 text-rose-700 shrink-0 mt-0.5" />
          <div>
            <strong className="font-semibold block">Assessment Error</strong>
            <p>{error}</p>
          </div>
        </div>
      )}

      {/* Pre-set Profiles Bar */}
      {samples.length > 0 && (
        <div className="bg-white border border-slate-200 rounded-md p-4 sm:p-5">
          <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-3 mb-3">
            <div>
              <h2 className="text-xs font-semibold uppercase tracking-wider text-slate-500">
                Representative Test Set Profiles
              </h2>
              <p className="text-xs text-slate-600">
                Load real student records from the held-out UCI test set to evaluate baseline behavior.
              </p>
            </div>
            <span className="text-[11px] font-mono bg-slate-100 text-slate-600 px-2 py-0.5 rounded border border-slate-200 self-start sm:self-auto">
              Test Cohort (N=79)
            </span>
          </div>

          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-3">
            {samples.map((sample) => (
              <button
                key={sample.id}
                type="button"
                onClick={() => handleSampleClick(sample.id)}
                className="text-left p-3 rounded-md border border-slate-200 hover:border-slate-400 hover:bg-slate-50 transition-colors focus:outline-none focus-visible:ring-2 focus-visible:ring-slate-900"
              >
                <div className="flex items-center justify-between mb-1">
                  <span className="text-xs font-bold text-slate-900">
                    {sample.profile_name}
                  </span>
                  <span
                    className={`text-[10px] font-semibold px-1.5 py-0.2 rounded border ${
                      sample.actual_risk === 'High Risk'
                        ? 'bg-rose-50 text-rose-800 border-rose-200'
                        : sample.actual_risk === 'Moderate Risk'
                        ? 'bg-amber-50 text-amber-800 border-amber-200'
                        : 'bg-emerald-50 text-emerald-800 border-emerald-200'
                    }`}
                  >
                    Actual: {sample.actual_risk.replace(' Risk', '')}
                  </span>
                </div>
                <p className="text-[11px] text-slate-500 line-clamp-2 leading-relaxed">
                  {sample.description}
                </p>
                <div className="mt-2 text-[10px] text-slate-400 font-mono">
                  G1: {sample.features.G1} | G2: {sample.features.G2} | Abs: {sample.features.absences}
                </div>
              </button>
            ))}
          </div>
        </div>
      )}

      {/* Main Grid: Form (Left) & Prediction Output (Right) */}
      <div className="grid grid-cols-1 lg:grid-cols-12 gap-8 items-start">
        {/* Form Column */}
        <div className="lg:col-span-7 bg-white border border-slate-200 rounded-md p-6 sm:p-7">
          <div className="flex items-center justify-between pb-4 mb-6 border-b border-slate-200">
            <div>
              <h2 className="text-base font-bold text-slate-900">Student Profile Parameters</h2>
              <p className="text-xs text-slate-500">Provide verified student data. All values are processed ephemerally.</p>
            </div>
            <button
              type="button"
              onClick={resetForm}
              className="inline-flex items-center space-x-1 text-xs text-slate-600 hover:text-slate-900 font-medium px-2.5 py-1.5 rounded border border-slate-200 hover:bg-slate-50"
              title="Reset form to defaults"
            >
              <RotateCcw className="w-3 h-3 text-slate-500" />
              <span>Reset</span>
            </button>
          </div>

          <form onSubmit={handleSubmit} className="space-y-6" noValidate>
            {/* Section 1: Academic Track Record */}
            <div>
              <h3 className="text-xs font-semibold text-slate-700 uppercase tracking-wider mb-3">
                1. Prior Academic Performance (0 to 20 Scale)
              </h3>
              <div className="grid grid-cols-1 sm:grid-cols-3 gap-4">
                <div>
                  <label htmlFor="g1-input" className="block text-xs font-medium text-slate-700 mb-1">
                    First Period Grade (G1) *
                  </label>
                  <input
                    id="g1-input"
                    type="number"
                    min="0"
                    max="20"
                    value={student.G1}
                    onChange={(e) => updateField('G1', parseInt(e.target.value) || 0)}
                    aria-describedby="g1-help g1-error"
                    aria-invalid={!!fieldErrors.G1}
                    className={`w-full px-3 py-2 text-sm border rounded-md focus:ring-1 focus:ring-blue-600 focus:outline-none ${
                      fieldErrors.G1 ? 'border-rose-400 bg-rose-50/50' : 'border-slate-300'
                    }`}
                  />
                  <span id="g1-help" className="text-[11px] text-slate-400 block mt-0.5">Scale: 0 to 20</span>
                  {fieldErrors.G1 && (
                    <span id="g1-error" className="text-xs text-rose-600 font-medium block mt-0.5">
                      {fieldErrors.G1}
                    </span>
                  )}
                </div>

                <div>
                  <label htmlFor="g2-input" className="block text-xs font-medium text-slate-700 mb-1">
                    Second Period Grade (G2) *
                  </label>
                  <input
                    id="g2-input"
                    type="number"
                    min="0"
                    max="20"
                    value={student.G2}
                    onChange={(e) => updateField('G2', parseInt(e.target.value) || 0)}
                    aria-describedby="g2-help g2-error"
                    aria-invalid={!!fieldErrors.G2}
                    className={`w-full px-3 py-2 text-sm border rounded-md focus:ring-1 focus:ring-blue-600 focus:outline-none ${
                      fieldErrors.G2 ? 'border-rose-400 bg-rose-50/50' : 'border-slate-300'
                    }`}
                  />
                  <span id="g2-help" className="text-[11px] text-slate-400 block mt-0.5">Scale: 0 to 20</span>
                  {fieldErrors.G2 && (
                    <span id="g2-error" className="text-xs text-rose-600 font-medium block mt-0.5">
                      {fieldErrors.G2}
                    </span>
                  )}
                </div>

                <div>
                  <label htmlFor="failures-input" className="block text-xs font-medium text-slate-700 mb-1">
                    Past Class Failures *
                  </label>
                  <select
                    id="failures-input"
                    value={student.failures}
                    onChange={(e) => updateField('failures', parseInt(e.target.value))}
                    className="w-full px-3 py-2 text-sm border border-slate-300 rounded-md focus:ring-1 focus:ring-blue-600 focus:outline-none bg-white"
                  >
                    <option value={0}>0 failures (clean track)</option>
                    <option value={1}>1 failure</option>
                    <option value={2}>2 failures</option>
                    <option value={3}>3 failures</option>
                    <option value={4}>4 or more failures</option>
                  </select>
                  <span className="text-[11px] text-slate-400 block mt-0.5">Prior course retakes</span>
                </div>
              </div>
            </div>

            {/* Section 2: Study Habits & Attendance */}
            <div className="pt-4 border-t border-slate-100">
              <h3 className="text-xs font-semibold text-slate-700 uppercase tracking-wider mb-3">
                2. Study Habits and Attendance
              </h3>
              <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                <div>
                  <label htmlFor="studytime-input" className="block text-xs font-medium text-slate-700 mb-1">
                    Weekly Study Time *
                  </label>
                  <select
                    id="studytime-input"
                    value={student.studytime}
                    onChange={(e) => updateField('studytime', parseInt(e.target.value))}
                    className="w-full px-3 py-2 text-sm border border-slate-300 rounded-md focus:ring-1 focus:ring-blue-600 focus:outline-none bg-white"
                  >
                    <option value={1}>Tier 1: &lt; 2 hours / week</option>
                    <option value={2}>Tier 2: 2 to 5 hours / week</option>
                    <option value={3}>Tier 3: 5 to 10 hours / week</option>
                    <option value={4}>Tier 4: &gt; 10 hours / week</option>
                  </select>
                  <span className="text-[11px] text-slate-400 block mt-0.5">Independent academic dedication</span>
                </div>

                <div>
                  <label htmlFor="absences-input" className="block text-xs font-medium text-slate-700 mb-1">
                    School Absences (days) *
                  </label>
                  <input
                    id="absences-input"
                    type="number"
                    min="0"
                    max="93"
                    value={student.absences}
                    onChange={(e) => updateField('absences', parseInt(e.target.value) || 0)}
                    aria-describedby="absences-help absences-error"
                    aria-invalid={!!fieldErrors.absences}
                    className={`w-full px-3 py-2 text-sm border rounded-md focus:ring-1 focus:ring-blue-600 focus:outline-none ${
                      fieldErrors.absences ? 'border-rose-400 bg-rose-50/50' : 'border-slate-300'
                    }`}
                  />
                  <span id="absences-help" className="text-[11px] text-slate-400 block mt-0.5">Total recorded term days</span>
                  {fieldErrors.absences && (
                    <span id="absences-error" className="text-xs text-rose-600 font-medium block mt-0.5">
                      {fieldErrors.absences}
                    </span>
                  )}
                </div>
              </div>
            </div>

            {/* Section 3: Educational Support Systems */}
            <div className="pt-4 border-t border-slate-100">
              <h3 className="text-xs font-semibold text-slate-700 uppercase tracking-wider mb-3">
                3. Educational Support Structures
              </h3>
              <div className="grid grid-cols-1 sm:grid-cols-3 gap-4">
                <div>
                  <label htmlFor="schoolsup-input" className="block text-xs font-medium text-slate-700 mb-1">
                    School Support (schoolsup)
                  </label>
                  <select
                    id="schoolsup-input"
                    value={student.schoolsup}
                    onChange={(e) => updateField('schoolsup', e.target.value as 'yes' | 'no')}
                    className="w-full px-3 py-2 text-sm border border-slate-300 rounded-md focus:ring-1 focus:ring-blue-600 focus:outline-none bg-white"
                  >
                    <option value="no">No Extra School Support</option>
                    <option value="yes">Yes (Special School Assistance)</option>
                  </select>
                </div>

                <div>
                  <label htmlFor="famsup-input" className="block text-xs font-medium text-slate-700 mb-1">
                    Family Support (famsup)
                  </label>
                  <select
                    id="famsup-input"
                    value={student.famsup}
                    onChange={(e) => updateField('famsup', e.target.value as 'yes' | 'no')}
                    className="w-full px-3 py-2 text-sm border border-slate-300 rounded-md focus:ring-1 focus:ring-blue-600 focus:outline-none bg-white"
                  >
                    <option value="yes">Yes (Family Study Assistance)</option>
                    <option value="no">No Family Study Support</option>
                  </select>
                </div>

                <div>
                  <label htmlFor="paid-input" className="block text-xs font-medium text-slate-700 mb-1">
                    Extra Paid Tutoring (paid)
                  </label>
                  <select
                    id="paid-input"
                    value={student.paid}
                    onChange={(e) => updateField('paid', e.target.value as 'yes' | 'no')}
                    className="w-full px-3 py-2 text-sm border border-slate-300 rounded-md focus:ring-1 focus:ring-blue-600 focus:outline-none bg-white"
                  >
                    <option value="no">No External Tutoring</option>
                    <option value="yes">Yes (Paid Subject Classes)</option>
                  </select>
                </div>
              </div>
            </div>

            {/* Section 4: Academic Environment & Demographics */}
            <div className="pt-4 border-t border-slate-100">
              <h3 className="text-xs font-semibold text-slate-700 uppercase tracking-wider mb-3">
                4. Environment and Routine Factors
              </h3>
              <div className="grid grid-cols-1 sm:grid-cols-3 gap-4">
                <div>
                  <label htmlFor="age-input" className="block text-xs font-medium text-slate-700 mb-1">
                    Student Age (15-22)
                  </label>
                  <input
                    id="age-input"
                    type="number"
                    min="15"
                    max="22"
                    value={student.age}
                    onChange={(e) => updateField('age', parseInt(e.target.value) || 15)}
                    aria-invalid={!!fieldErrors.age}
                    className="w-full px-3 py-2 text-sm border border-slate-300 rounded-md focus:ring-1 focus:ring-blue-600 focus:outline-none"
                  />
                  {fieldErrors.age && (
                    <span className="text-xs text-rose-600 font-medium block mt-0.5">{fieldErrors.age}</span>
                  )}
                </div>

                <div>
                  <label htmlFor="higher-input" className="block text-xs font-medium text-slate-700 mb-1">
                    Higher Education Aspiration
                  </label>
                  <select
                    id="higher-input"
                    value={student.higher}
                    onChange={(e) => updateField('higher', e.target.value as 'yes' | 'no')}
                    className="w-full px-3 py-2 text-sm border border-slate-300 rounded-md focus:ring-1 focus:ring-blue-600 focus:outline-none bg-white"
                  >
                    <option value="yes">Plans to attend University</option>
                    <option value="no">No higher education plans</option>
                  </select>
                </div>

                <div>
                  <label htmlFor="internet-input" className="block text-xs font-medium text-slate-700 mb-1">
                    Home Internet Access
                  </label>
                  <select
                    id="internet-input"
                    value={student.internet}
                    onChange={(e) => updateField('internet', e.target.value as 'yes' | 'no')}
                    className="w-full px-3 py-2 text-sm border border-slate-300 rounded-md focus:ring-1 focus:ring-blue-600 focus:outline-none bg-white"
                  >
                    <option value="yes">Yes (Connected at home)</option>
                    <option value="no">No internet at home</option>
                  </select>
                </div>

                <div>
                  <label htmlFor="medu-input" className="block text-xs font-medium text-slate-700 mb-1">
                    Mother Education (Medu)
                  </label>
                  <select
                    id="medu-input"
                    value={student.Medu}
                    onChange={(e) => updateField('Medu', parseInt(e.target.value))}
                    className="w-full px-3 py-2 text-sm border border-slate-300 rounded-md focus:ring-1 focus:ring-blue-600 focus:outline-none bg-white"
                  >
                    <option value={0}>0: None</option>
                    <option value={1}>1: Primary (4th grade)</option>
                    <option value={2}>2: 5th to 9th grade</option>
                    <option value={3}>3: Secondary education</option>
                    <option value={4}>4: Higher education</option>
                  </select>
                </div>

                <div>
                  <label htmlFor="fedu-input" className="block text-xs font-medium text-slate-700 mb-1">
                    Father Education (Fedu)
                  </label>
                  <select
                    id="fedu-input"
                    value={student.Fedu}
                    onChange={(e) => updateField('Fedu', parseInt(e.target.value))}
                    className="w-full px-3 py-2 text-sm border border-slate-300 rounded-md focus:ring-1 focus:ring-blue-600 focus:outline-none bg-white"
                  >
                    <option value={0}>0: None</option>
                    <option value={1}>1: Primary (4th grade)</option>
                    <option value={2}>2: 5th to 9th grade</option>
                    <option value={3}>3: Secondary education</option>
                    <option value={4}>4: Higher education</option>
                  </select>
                </div>

                <div>
                  <label htmlFor="traveltime-input" className="block text-xs font-medium text-slate-700 mb-1">
                    Commute Travel Time
                  </label>
                  <select
                    id="traveltime-input"
                    value={student.traveltime}
                    onChange={(e) => updateField('traveltime', parseInt(e.target.value))}
                    className="w-full px-3 py-2 text-sm border border-slate-300 rounded-md focus:ring-1 focus:ring-blue-600 focus:outline-none bg-white"
                  >
                    <option value={1}>&lt; 15 min</option>
                    <option value={2}>15 to 30 min</option>
                    <option value={3}>30 to 60 min</option>
                    <option value={4}>&gt; 60 min</option>
                  </select>
                </div>

                <div>
                  <label htmlFor="goout-input" className="block text-xs font-medium text-slate-700 mb-1">
                    Going Out with Friends
                  </label>
                  <select
                    id="goout-input"
                    value={student.goout}
                    onChange={(e) => updateField('goout', parseInt(e.target.value))}
                    className="w-full px-3 py-2 text-sm border border-slate-300 rounded-md focus:ring-1 focus:ring-blue-600 focus:outline-none bg-white"
                  >
                    <option value={1}>1: Very low</option>
                    <option value={2}>2: Low</option>
                    <option value={3}>3: Moderate</option>
                    <option value={4}>4: High</option>
                    <option value={5}>5: Very high</option>
                  </select>
                </div>

                <div>
                  <label htmlFor="freetime-input" className="block text-xs font-medium text-slate-700 mb-1">
                    Free Time After School
                  </label>
                  <select
                    id="freetime-input"
                    value={student.freetime}
                    onChange={(e) => updateField('freetime', parseInt(e.target.value))}
                    className="w-full px-3 py-2 text-sm border border-slate-300 rounded-md focus:ring-1 focus:ring-blue-600 focus:outline-none bg-white"
                  >
                    <option value={1}>1: Very low</option>
                    <option value={2}>2: Low</option>
                    <option value={3}>3: Moderate</option>
                    <option value={4}>4: High</option>
                    <option value={5}>5: Very high</option>
                  </select>
                </div>

                <div>
                  <label htmlFor="health-input" className="block text-xs font-medium text-slate-700 mb-1">
                    Current Health Status
                  </label>
                  <select
                    id="health-input"
                    value={student.health}
                    onChange={(e) => updateField('health', parseInt(e.target.value))}
                    className="w-full px-3 py-2 text-sm border border-slate-300 rounded-md focus:ring-1 focus:ring-blue-600 focus:outline-none bg-white"
                  >
                    <option value={1}>1: Very poor</option>
                    <option value={2}>2: Poor</option>
                    <option value={3}>3: Average</option>
                    <option value={4}>4: Good</option>
                    <option value={5}>5: Very good</option>
                  </select>
                </div>
              </div>
            </div>

            {/* Submit Bar */}
            <div className="pt-4 border-t border-slate-200 flex items-center justify-between">
              <span className="text-xs text-slate-500">
                19 public features mapped to model inputs.
              </span>
              <button
                type="submit"
                disabled={loading}
                className="inline-flex items-center space-x-2 bg-slate-900 hover:bg-slate-800 disabled:bg-slate-400 text-white font-medium text-sm px-6 py-2.5 rounded-md shadow-sm transition-colors focus:outline-none focus-visible:ring-2 focus-visible:ring-slate-900"
              >
                {loading ? (
                  <>
                    <span className="w-4 h-4 border-2 border-white border-t-transparent rounded-full animate-spin" />
                    <span>Evaluating Model...</span>
                  </>
                ) : (
                  <>
                    <span>Calculate Risk Prediction</span>
                    <ArrowRight className="w-4 h-4 text-slate-300" />
                  </>
                )}
              </button>
            </div>
          </form>
        </div>

        {/* Prediction Results Column */}
        <div className="lg:col-span-5 space-y-6">
          <div className="bg-white border border-slate-200 rounded-md p-6">
            <h2 className="text-base font-bold text-slate-900 pb-3 border-b border-slate-200 mb-4 flex items-center justify-between">
              <span>Model Prediction Output</span>
              <span className="text-xs font-normal text-slate-500">Logistic Regression</span>
            </h2>

            {prediction ? (
              <div className="space-y-6">
                {/* Risk Tier Badge Card */}
                <div
                  className={`p-4 rounded-md border ${
                    prediction.risk_tier === 'High Risk'
                      ? 'bg-rose-50 border-rose-300 text-rose-900'
                      : prediction.risk_tier === 'Moderate Risk'
                      ? 'bg-amber-50 border-amber-300 text-amber-900'
                      : 'bg-emerald-50 border-emerald-300 text-emerald-900'
                  }`}
                >
                  <div className="flex items-center justify-between">
                    <span className="text-xs font-semibold uppercase tracking-wider">
                      Target Classification
                    </span>
                    <span
                      className={`text-xs font-bold px-2 py-0.5 rounded ${
                        prediction.risk_tier === 'High Risk'
                          ? 'bg-rose-200 text-rose-900'
                          : prediction.risk_tier === 'Moderate Risk'
                          ? 'bg-amber-200 text-amber-900'
                          : 'bg-emerald-200 text-emerald-900'
                      }`}
                    >
                      {prediction.risk_tier}
                    </span>
                  </div>

                  <div className="mt-3">
                    <span className="text-3xl font-extrabold tracking-tight block">
                      {prediction.risk_tier}
                    </span>
                    <p className="mt-1.5 text-xs leading-relaxed opacity-90">
                      {prediction.description}
                    </p>
                  </div>
                </div>

                {/* Mathematical Confidence & Grade Estimate */}
                <div className="grid grid-cols-2 gap-3">
                  <div className="bg-slate-50 border border-slate-200 rounded-md p-3.5">
                    <div className="flex items-center justify-between text-xs text-slate-500 mb-1">
                      <span>Model Confidence</span>
                      <span title="Model-estimated class probability for the predicted category">
                        <Info className="w-3.5 h-3.5 text-slate-400" />
                      </span>
                    </div>
                    <div className="text-2xl font-bold text-slate-900">
                      {(prediction.confidence * 100).toFixed(1)}%
                    </div>
                    <span className="text-[10px] text-slate-500 block mt-0.5">
                      Model-Estimated Probability
                    </span>
                  </div>

                  <div className="bg-slate-50 border border-slate-200 rounded-md p-3.5">
                    <div className="flex items-center justify-between text-xs text-slate-500 mb-1">
                      <span>Projected Grade (G3)</span>
                      <span title="Continuous regression estimate on 0-20 scale">
                        <Info className="w-3.5 h-3.5 text-slate-400" />
                      </span>
                    </div>
                    <div className="text-2xl font-bold text-slate-900">
                      {prediction.predicted_grade.toFixed(1)} <span className="text-xs text-slate-500 font-normal">/ 20</span>
                    </div>
                    <span className="text-[10px] text-slate-500 block mt-0.5">
                      Passing Threshold: 10.0
                    </span>
                  </div>
                </div>

                {/* Model-Estimated Class Probabilities */}
                <div>
                  <h3 className="text-xs font-semibold text-slate-700 uppercase tracking-wider mb-2.5">
                    Model-Estimated Class Probabilities
                  </h3>
                  <div className="space-y-2.5 text-xs">
                    {/* High Risk */}
                    <div>
                      <div className="flex justify-between text-slate-600 mb-1">
                        <span>Higher Risk (G3 &lt; 10)</span>
                        <span className="font-mono font-medium">
                          {(prediction.class_probabilities['High Risk'] * 100).toFixed(1)}%
                        </span>
                      </div>
                      <div className="w-full bg-slate-100 rounded-full h-2 overflow-hidden">
                        <div
                          className="bg-rose-600 h-2 rounded-full transition-all"
                          style={{ width: `${prediction.class_probabilities['High Risk'] * 100}%` }}
                        />
                      </div>
                    </div>

                    {/* Moderate Risk */}
                    <div>
                      <div className="flex justify-between text-slate-600 mb-1">
                        <span>Moderate Risk (10 to 13)</span>
                        <span className="font-mono font-medium">
                          {(prediction.class_probabilities['Moderate Risk'] * 100).toFixed(1)}%
                        </span>
                      </div>
                      <div className="w-full bg-slate-100 rounded-full h-2 overflow-hidden">
                        <div
                          className="bg-amber-500 h-2 rounded-full transition-all"
                          style={{ width: `${prediction.class_probabilities['Moderate Risk'] * 100}%` }}
                        />
                      </div>
                    </div>

                    {/* Low Risk */}
                    <div>
                      <div className="flex justify-between text-slate-600 mb-1">
                        <span>Lower Concern (&gt;= 14)</span>
                        <span className="font-mono font-medium">
                          {(prediction.class_probabilities['Low Risk'] * 100).toFixed(1)}%
                        </span>
                      </div>
                      <div className="w-full bg-slate-100 rounded-full h-2 overflow-hidden">
                        <div
                          className="bg-emerald-600 h-2 rounded-full transition-all"
                          style={{ width: `${prediction.class_probabilities['Low Risk'] * 100}%` }}
                        />
                      </div>
                    </div>
                  </div>
                </div>

                {/* Action CTAs for Next Steps */}
                <div className="pt-4 border-t border-slate-200 space-y-2">
                  <button
                    type="button"
                    onClick={() => navigate('/explanation')}
                    className="w-full inline-flex items-center justify-center space-x-2 bg-slate-900 hover:bg-slate-800 text-white font-medium text-xs py-2.5 px-4 rounded-md shadow-sm transition-colors"
                  >
                    <span>Inspect Feature Contribution Analysis</span>
                    <ArrowRight className="w-3.5 h-3.5 text-slate-300" />
                  </button>

                  <button
                    type="button"
                    onClick={() => navigate('/explanation#what-if')}
                    className="w-full inline-flex items-center justify-center space-x-2 bg-white hover:bg-slate-50 text-slate-700 font-medium text-xs py-2.5 px-4 rounded-md border border-slate-300 transition-colors"
                  >
                    <Sliders className="w-3.5 h-3.5 text-slate-500" />
                    <span>Open What-If Scenario Simulator</span>
                  </button>
                </div>
              </div>
            ) : (
              <div className="py-12 px-4 text-center">
                <div className="w-10 h-10 bg-slate-100 text-slate-400 rounded-md flex items-center justify-center mx-auto mb-3">
                  <HelpCircle className="w-5 h-5" />
                </div>
                <h3 className="text-sm font-semibold text-slate-800 mb-1">
                  Awaiting Assessment
                </h3>
                <p className="text-xs text-slate-500 max-w-xs mx-auto leading-relaxed">
                  Select a representative test profile above or modify input values and click &quot;Calculate Risk Prediction&quot; to compute empirical risk.
                </p>
              </div>
            )}
          </div>

          {/* Academic Transparency Note */}
          <div className="bg-slate-50 border border-slate-200 rounded-md p-4 text-xs text-slate-600 space-y-1.5">
            <div className="font-semibold text-slate-800 flex items-center space-x-1.5">
              <CheckCircle2 className="w-3.5 h-3.5 text-blue-600" />
              <span>Model-Estimated Metrics Policy</span>
            </div>
            <p className="leading-relaxed">
              Confidence levels and class probabilities are generated directly by the trained Logistic Regression model. EduExplain AI never displays fabricated or arbitrary accuracy figures.
            </p>
          </div>
        </div>
      </div>
    </div>
  );
};
