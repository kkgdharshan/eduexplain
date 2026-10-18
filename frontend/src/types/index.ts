export interface StudentInput {
  age: number;
  studytime: number;
  absences: number;
  failures: number;
  G1: number;
  G2: number;
  schoolsup: 'yes' | 'no';
  famsup: 'yes' | 'no';
  paid: 'yes' | 'no';
  activities: 'yes' | 'no';
  higher: 'yes' | 'no';
  internet: 'yes' | 'no';
  romantic: 'yes' | 'no';
  Medu: number;
  Fedu: number;
  traveltime: number;
  freetime: number;
  goout: number;
  health: number;
}

export type RiskTier = 'High Risk' | 'Moderate Risk' | 'Low Risk';

export interface PredictionResult {
  risk_tier: RiskTier;
  predicted_grade: number;
  confidence: number;
  class_probabilities: {
    'High Risk': number;
    'Moderate Risk': number;
    'Low Risk': number;
  };
  binary_risk_probability: number;
  description: string;
  target_definitions: Record<string, string>;
}

export interface FeatureContribution {
  feature: string;
  raw_feature: string;
  label: string;
  user_value: any;
  display_value: string;
  shap_value: number;
  abs_shap: number;
  impact_type: 'risk_increasing' | 'protective';
}

export interface ExplanationResult {
  base_value: number;
  predicted_risk_probability: number;
  feature_contributions: FeatureContribution[];
  disclaimer: string;
}

export interface WhatIfDelta {
  risk_probability_delta: number;
  predicted_grade_delta: number;
  tier_transition: string;
  changes_detected: Array<{
    feature: string;
    label: string;
    original_value: any;
    new_value: any;
  }>;
}

export interface WhatIfResult {
  baseline: {
    risk_tier: RiskTier;
    predicted_grade: number;
    class_probabilities: Record<string, number>;
    risk_probability: number;
  };
  modified: {
    risk_tier: RiskTier;
    predicted_grade: number;
    class_probabilities: Record<string, number>;
    risk_probability: number;
  };
  deltas: WhatIfDelta;
}

export interface GlobalFeature {
  feature: string;
  label: string;
  mean_abs_shap: number;
  gini_importance: number;
}

export interface SampleProfile {
  id: string;
  profile_name: string;
  description: string;
  features: StudentInput;
  actual_g3: number;
  actual_risk: RiskTier;
  predicted_risk: RiskTier;
  predicted_grade: number;
}

export interface ClassMetric {
  precision: number;
  recall: number;
  f1_score: number;
  support: number;
}

export interface ModelMetrics {
  dataset: {
    name: string;
    citation: string;
    total_samples: number;
    training_samples: number;
    test_samples: number;
    features_count: number;
    train_test_split?: string;
    random_seed?: number;
    model_version?: string;
    evaluation_date?: string;
    target_definitions: Record<string, string>;
  };
  evaluation: {
    three_tier_model: {
      algorithm: string;
      test_accuracy: number;
      cv_5fold_mean_accuracy: number;
      cv_5fold_std: number;
      macro_precision?: number;
      macro_recall?: number;
      macro_f1: number;
      classes: string[];
      per_class_metrics: Record<string, ClassMetric>;
      confusion_matrix: {
        labels: string[];
        matrix: number[][];
      };
    };
    baseline_comparisons?: {
      dummy_most_frequent: {
        algorithm: string;
        test_accuracy: number;
        notes?: string;
      };
      logistic_regression: {
        algorithm: string;
        test_accuracy: number;
        notes?: string;
      };
    };
    binary_risk_model: {
      algorithm: string;
      test_accuracy: number;
      roc_auc: number;
    };
    grade_regression_model: {
      algorithm: string;
      rmse: number;
      mae: number;
      r2_score: number;
    };
  };
  all_feature_names: string[];
  feature_cols: string[];
  cat_cols: string[];
  num_cols: string[];
}
