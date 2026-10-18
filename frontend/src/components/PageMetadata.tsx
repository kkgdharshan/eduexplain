import React, { useEffect } from 'react';
import { useLocation } from 'react-router-dom';

const PAGE_METADATA: Record<string, { title: string; description: string }> = {
  '/': {
    title: 'EduExplain AI - Explain My Learning Risk',
    description: 'Educational research prototype predicting secondary school learning risk on the UCI Student Performance benchmark with local feature contribution analysis and what-if simulation.'
  },
  '/assessment': {
    title: 'EduExplain AI - Student Academic Risk Assessment',
    description: 'Input student academic performance, attendance, and support parameters to compute model-estimated risk categories and class probabilities.'
  },
  '/explanation': {
    title: 'EduExplain AI - Explainability & What-If Simulation',
    description: 'Detailed local feature contribution analysis, global feature importance ranking, and interactive what-if scenario simulator.'
  },
  '/methodology': {
    title: 'EduExplain AI - Empirical Methodology & Evaluation',
    description: 'Comprehensive documentation of the UCI Student Performance dataset, data preprocessing, Logistic Regression training, and cross-validation metrics.'
  },
  '/responsible-ai': {
    title: 'EduExplain AI - Responsible AI & Ethical Governance',
    description: 'Ethical guidelines, Zero-PII privacy architecture, algorithmic fairness, and human-in-the-loop decision-support standards.'
  },
  '/about': {
    title: 'EduExplain AI - Hackathon Challenge 01 Context',
    description: 'Project mission, hackathon challenge details, and technological architecture for explainable machine learning in secondary education.'
  },
  '/privacy': {
    title: 'EduExplain AI - Privacy Policy',
    description: 'Formal privacy policy documenting zero-PII collection, ephemeral in-memory processing, and absence of tracking cookies.'
  },
  '/terms': {
    title: 'EduExplain AI - Terms and Conditions',
    description: 'Academic research prototype terms of use, limitation of liability, and permitted educational decision-support use.'
  },
};

export const PageMetadata: React.FC = () => {
  const location = useLocation();

  useEffect(() => {
    const meta = PAGE_METADATA[location.pathname] || {
      title: 'EduExplain AI - Page Not Found',
      description: 'The requested page could not be located in the EduExplain AI research portal.'
    };

    document.title = meta.title;

    const descTag = document.querySelector('meta[name="description"]');
    if (descTag) {
      descTag.setAttribute('content', meta.description);
    }

    const ogTitleTag = document.querySelector('meta[property="og:title"]');
    if (ogTitleTag) {
      ogTitleTag.setAttribute('content', meta.title);
    }

    const ogDescTag = document.querySelector('meta[property="og:description"]');
    if (ogDescTag) {
      ogDescTag.setAttribute('content', meta.description);
    }

    window.scrollTo(0, 0);
  }, [location.pathname]);

  return null;
};
