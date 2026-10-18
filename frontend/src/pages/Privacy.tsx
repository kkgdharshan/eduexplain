import React from 'react';


export const Privacy: React.FC = () => {
  return (
    <div className="max-w-4xl mx-auto px-4 sm:px-6 lg:px-8 py-10 space-y-10">
      <div>
        <div className="inline-flex items-center space-x-2 bg-slate-100 border border-slate-300 text-slate-800 text-xs px-3 py-1 rounded-md font-medium mb-3">
          <span>Governance</span>
          <span className="text-slate-400">/</span>
          <span>Privacy Policy</span>
        </div>
        <h1 className="text-2xl sm:text-3xl font-bold tracking-tight text-slate-900">
          Privacy Policy
        </h1>
        <p className="mt-2 text-xs sm:text-sm text-slate-500">
          Effective Date: October 2026. Last reviewed: Research Prototype Release.
        </p>
      </div>

      <div className="bg-white border border-slate-200 rounded-md p-6 sm:p-8 space-y-8 text-xs sm:text-sm text-slate-700 leading-relaxed">
        {/* Section 1 */}
        <section className="space-y-2">
          <h2 className="text-base font-bold text-slate-900">
            1. Zero Personally Identifiable Information (Zero-PII) Policy
          </h2>
          <p>
            EduExplain AI is architected from the ground up to operate without collecting, storing, or transmitting Personally Identifiable Information (PII). The platform does not request, accept, or process student names, institutional registration numbers, government IDs, physical addresses, contact numbers, or IP addresses.
          </p>
        </section>

        {/* Section 2 */}
        <section className="space-y-2">
          <h2 className="text-base font-bold text-slate-900">
            2. Ephemeral In-Memory Computation
          </h2>
          <p>
            When a user inputs student attributes into the Risk Assessment or What-If Simulator modules, data is transferred exclusively to the local inference API endpoint. Calculations are performed entirely in-memory. Once the response payload (consisting of prediction probabilities and model coefficient feature contributions) is returned, the submitted data is immediately purged from memory. No persistent database records, audit trails of specific student profiles, or historical session logs are generated.
          </p>
        </section>

        {/* Section 3 */}
        <section className="space-y-2">
          <h2 className="text-base font-bold text-slate-900">
            3. Cookies and Tracking Technologies
          </h2>
          <p>
            EduExplain AI does not employ tracking cookies, advertising beacons, behavioral analytics scripts, or third-party marketing tags. The platform uses standard session storage strictly within your local browser to retain temporary UI state during your active session.
          </p>
        </section>

        {/* Section 4 */}
        <section className="space-y-2">
          <h2 className="text-base font-bold text-slate-900">
            4. Public Benchmark Data
          </h2>
          <p>
            The machine learning models deployed in EduExplain AI are trained exclusively on publicly available, anonymized datasets from the UCI Machine Learning Repository (Cortez and Silva, 2008). No proprietary or private institutional student records were accessed or ingested during the development of this prototype.
          </p>
        </section>

        {/* Section 5 */}
        <section className="space-y-2">
          <h2 className="text-base font-bold text-slate-900">
            5. Inquiries and Verification Notice
          </h2>
          <p>
            EduExplain AI is an educational research prototype. Direct email contact channels are not monitored for this standalone system. Independent security review, code audit, and replication can be conducted directly via the project repository and submission portal.
          </p>
        </section>
      </div>
    </div>
  );
};
