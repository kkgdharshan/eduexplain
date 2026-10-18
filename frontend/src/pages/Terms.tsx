import React from 'react';


export const Terms: React.FC = () => {
  return (
    <div className="max-w-4xl mx-auto px-4 sm:px-6 lg:px-8 py-10 space-y-10">
      <div>
        <div className="inline-flex items-center space-x-2 bg-slate-100 border border-slate-300 text-slate-800 text-xs px-3 py-1 rounded-md font-medium mb-3">
          <span>Governance</span>
          <span className="text-slate-400">/</span>
          <span>Terms and Conditions</span>
        </div>
        <h1 className="text-2xl sm:text-3xl font-bold tracking-tight text-slate-900">
          Terms and Conditions
        </h1>
        <p className="mt-2 text-xs sm:text-sm text-slate-500">
          Effective Date: October 2026. Research Release Terms of Use.
        </p>
      </div>

      <div className="bg-white border border-slate-200 rounded-md p-6 sm:p-8 space-y-8 text-xs sm:text-sm text-slate-700 leading-relaxed">
        {/* Section 1 */}
        <section className="space-y-2">
          <h2 className="text-base font-bold text-slate-900">
            1. Research Prototype Nature and Scope
          </h2>
          <p>
            EduExplain AI is an academic research prototype built for Hackathon Challenge 01: &quot;Explain My Learning Risk&quot;. The software is intended exclusively for investigatory, demonstrative, and pedagogical evaluation of machine learning explainability in educational domains. It does not constitute a certified educational testing service, psychological evaluation, or legal assessment tool.
          </p>
        </section>

        {/* Section 2 */}
        <section className="space-y-2">
          <h2 className="text-base font-bold text-slate-900">
            2. Disclaimer of Definitive Judgments and Warranties
          </h2>
          <p>
            The predictions, confidence metrics, and feature contributions are statistical estimates derived from historical Portuguese secondary education records (Cortez &amp; Silva, 2008). THE PLATFORM IS PROVIDED ON AN &quot;AS IS&quot; BASIS WITHOUT WARRANTY OF ANY KIND, EXPRESS OR IMPLIED. UNDER NO CIRCUMSTANCES SHALL THE AUTHORS OR CONTRIBUTORS BE HELD LIABLE FOR EDUCATIONAL, ADMINISTRATIVE, OR DISCIPLINARY DECISIONS MADE BASED UPON THIS SOFTWARE.
          </p>
        </section>

        {/* Section 3 */}
        <section className="space-y-2">
          <h2 className="text-base font-bold text-slate-900">
            3. Appropriate and Permitted Use
          </h2>
          <p>
            Users agree to use EduExplain AI solely as a decision-support aid in collaborative mentoring, academic counseling, or educational data science research. Users shall NOT use this prototype to automate student rejection, enforce punitive grading policies, exclude students from course tracks, or generate permanent institutional records.
          </p>
        </section>

        {/* Section 4 */}
        <section className="space-y-2">
          <h2 className="text-base font-bold text-slate-900">
            4. Prohibited Data Ingestion
          </h2>
          <p>
            Users are strictly prohibited from submitting real student personal identifiers (such as full names, social security numbers, student ID numbers, or home street addresses) into the application.
          </p>
        </section>

        {/* Section 5 */}
        <section className="space-y-2">
          <h2 className="text-base font-bold text-slate-900">
            5. Inquiries and Governing Framework
          </h2>
          <p>
            These terms are governed by open educational research standards. Direct email contact channels are not monitored for this standalone prototype. Independent review, code audit, and replication can be conducted via the project repository and submission portal.
          </p>
        </section>
      </div>
    </div>
  );
};
