"""
EduExplain AI - Model Training and Explainability Pipeline
Dataset: UCI Machine Learning Repository - Student Performance (Cortez and Silva, 2008)
Target: 3-Tier Academic Risk Classification and Final Grade Prediction
"""

import os
import json
import joblib
import pandas as pd
import numpy as np
from sklearn.model_selection import train_test_split, StratifiedKFold, cross_val_score
from sklearn.ensemble import RandomForestClassifier, RandomForestRegressor
from sklearn.metrics import (
    accuracy_score, precision_recall_fscore_support,
    confusion_matrix, roc_auc_score, mean_squared_error, mean_absolute_error, r2_score
)
from sklearn.preprocessing import OneHotEncoder
from sklearn.compose import ColumnTransformer
import shap

def run_pipeline():
    data_path = os.path.join(os.path.dirname(__file__), '..', 'data', 'student-mat.csv')
    if not os.path.exists(data_path):
        raise FileNotFoundError(f"Dataset not found at {data_path}")

    # Load dataset with semicolon separator
    df = pd.read_csv(data_path, sep=';')
    print(f"Loaded student-mat dataset: {df.shape[0]} rows, {df.shape[1]} columns")

    # Define targets
    def classify_risk(g3):
        if g3 < 10:
            return "High Risk"
        elif g3 < 14:
            return "Moderate Risk"
        else:
            return "Low Risk"

    df['risk_tier'] = df['G3'].apply(classify_risk)
    df['binary_risk'] = (df['G3'] < 10).astype(int)

    feature_cols = [
        'age', 'studytime', 'absences', 'failures',
        'G1', 'G2', 'schoolsup', 'famsup', 'paid',
        'activities', 'higher', 'internet', 'romantic',
        'Medu', 'Fedu', 'traveltime', 'freetime', 'goout', 'health'
    ]

    cat_cols = ['schoolsup', 'famsup', 'paid', 'activities', 'higher', 'internet', 'romantic']
    num_cols = [c for c in feature_cols if c not in cat_cols]

    X = df[feature_cols].copy()
    y_3tier = df['risk_tier'].copy()
    y_grade = df['G3'].copy()
    y_binary = df['binary_risk'].copy()

    # Preprocessor
    preprocessor = ColumnTransformer(
        transformers=[
            ('num', 'passthrough', num_cols),
            ('cat', OneHotEncoder(drop='first', sparse_output=False), cat_cols)
        ]
    )

    X_transformed = preprocessor.fit_transform(X)
    
    # Feature names after transformation
    cat_feature_names = [f"{c}_yes" for c in cat_cols]
    all_feature_names = num_cols + cat_feature_names

    # Stratified Train/Test Split (80/20) with fixed random seed for reproducibility
    indices = np.arange(len(df))
    train_idx, test_idx = train_test_split(
        indices, test_size=0.20, random_state=42, stratify=y_3tier
    )

    X_train = X_transformed[train_idx]
    X_test = X_transformed[test_idx]
    y_train_3tier = y_3tier.iloc[train_idx].values
    y_test_3tier = y_3tier.iloc[test_idx].values
    y_train_grade = y_grade.iloc[train_idx].values
    y_test_grade = y_grade.iloc[test_idx].values
    y_train_binary = y_binary.iloc[train_idx].values
    y_test_binary = y_binary.iloc[test_idx].values

    # 1. Train 3-Tier Risk Classifier (Random Forest)
    clf_3tier = RandomForestClassifier(
        n_estimators=100,
        max_depth=6,
        min_samples_split=4,
        min_samples_leaf=2,
        random_state=42
    )
    clf_3tier.fit(X_train, y_train_3tier)

    # 2. Train Continuous Grade Regressor (Random Forest Regressor)
    reg_grade = RandomForestRegressor(
        n_estimators=100,
        max_depth=6,
        min_samples_split=4,
        min_samples_leaf=2,
        random_state=42
    )
    reg_grade.fit(X_train, y_train_grade)

    # 3. Train Binary Risk Classifier (for binary SHAP probability explanations)
    clf_binary = RandomForestClassifier(
        n_estimators=100,
        max_depth=5,
        min_samples_split=4,
        min_samples_leaf=2,
        random_state=42
    )
    clf_binary.fit(X_train, y_train_binary)

    # Cross-validation on 3-tier classifier
    cv = StratifiedKFold(n_splits=5, shuffle=True, random_state=42)
    cv_scores = cross_val_score(clf_3tier, X_transformed, y_3tier, cv=cv, scoring='accuracy')

    # Test evaluation for 3-tier
    y_pred_3tier = clf_3tier.predict(X_test)
    y_proba_3tier = clf_3tier.predict_proba(X_test)
    test_acc_3tier = accuracy_score(y_test_3tier, y_pred_3tier)
    
    classes = list(clf_3tier.classes_) # ['High Risk', 'Low Risk', 'Moderate Risk']
    prec, rec, f1, supp = precision_recall_fscore_support(
        y_test_3tier, y_pred_3tier, labels=classes
    )
    macro_f1 = float(np.mean(f1))
    cm = confusion_matrix(y_test_3tier, y_pred_3tier, labels=classes).tolist()

    # Test evaluation for Continuous Grade
    y_pred_grade = reg_grade.predict(X_test)
    rmse = float(np.sqrt(mean_squared_error(y_test_grade, y_pred_grade)))
    mae = float(mean_absolute_error(y_test_grade, y_pred_grade))
    r2 = float(r2_score(y_test_grade, y_pred_grade))

    # Test evaluation for Binary Risk
    y_pred_bin = clf_binary.predict(X_test)
    y_proba_bin = clf_binary.predict_proba(X_test)[:, 1]
    bin_acc = float(accuracy_score(y_test_binary, y_pred_bin))
    bin_auc = float(roc_auc_score(y_test_binary, y_proba_bin))

    # SHAP Explainer
    explainer_binary = shap.TreeExplainer(clf_binary)
    explainer_grade = shap.TreeExplainer(reg_grade)

    # Compute Global Feature Importance using test set SHAP
    shap_values_test = explainer_binary.shap_values(X_test)
    # shap_values_test might be 3D (samples, features, classes) or 2D
    if isinstance(shap_values_test, list):
        # binary class 1 is index 1
        shap_class1 = shap_values_test[1]
    elif len(shap_values_test.shape) == 3:
        shap_class1 = shap_values_test[:, :, 1]
    else:
        shap_class1 = shap_values_test

    mean_abs_shap = np.mean(np.abs(shap_class1), axis=0)
    
    # Also get RF Gini importance
    gini_importance = clf_3tier.feature_importances_

    global_features = []
    for idx, name in enumerate(all_feature_names):
        readable_label = {
            'G2': 'Second Period Grade (G2)',
            'G1': 'First Period Grade (G1)',
            'failures': 'Past Course Failures',
            'absences': 'School Absences',
            'age': 'Student Age',
            'studytime': 'Weekly Study Time',
            'schoolsup_yes': 'Extra School Support',
            'famsup_yes': 'Family Educational Support',
            'paid_yes': 'Extra Paid Tutoring',
            'activities_yes': 'Extracurricular Activities',
            'higher_yes': 'Higher Education Aspiration',
            'internet_yes': 'Home Internet Access',
            'romantic_yes': 'In Romantic Relationship',
            'Medu': "Mother's Education Level",
            'Fedu': "Father's Education Level",
            'traveltime': 'Commute / Travel Time',
            'freetime': 'Free Time After School',
            'goout': 'Going Out With Friends',
            'health': 'Current Health Status'
        }.get(name, name)

        global_features.append({
            "feature": name,
            "label": readable_label,
            "mean_abs_shap": round(float(mean_abs_shap[idx]), 4),
            "gini_importance": round(float(gini_importance[idx]), 4)
        })

    # Sort by mean_abs_shap descending
    global_features.sort(key=lambda x: x["mean_abs_shap"], reverse=True)

    # Generate sample records from the test set representing different risk tiers
    test_df = df.iloc[test_idx].copy()
    test_df['predicted_risk'] = y_pred_3tier
    test_df['predicted_grade'] = np.round(y_pred_grade, 1)

    samples = []
    # Pick a high risk student
    hr_student = test_df[test_df['risk_tier'] == 'High Risk'].iloc[0]
    # Pick a moderate risk student
    mr_student = test_df[test_df['risk_tier'] == 'Moderate Risk'].iloc[0]
    # Pick a low risk student
    lr_student = test_df[test_df['risk_tier'] == 'Low Risk'].iloc[0]
    # Pick a borderline student
    border_students = test_df[(test_df['G2'] >= 9) & (test_df['G2'] <= 11)]
    border_student = border_students.iloc[0] if len(border_students) > 0 else mr_student

    def format_sample(row, profile_name, description):
        data = {c: int(row[c]) if isinstance(row[c], (int, np.integer)) else row[c] for c in feature_cols}
        return {
            "id": f"sample_{profile_name.lower().replace(' ', '_')}",
            "profile_name": profile_name,
            "description": description,
            "features": data,
            "actual_g3": int(row['G3']),
            "actual_risk": row['risk_tier'],
            "predicted_risk": row['predicted_risk'],
            "predicted_grade": float(row['predicted_grade'])
        }

    samples.append(format_sample(
        hr_student, "Student A: Academic Support Needed",
        "Student with previous term difficulties (G1=7, G2=8), past failures, and higher absences."
    ))
    samples.append(format_sample(
        mr_student, "Student B: Moderate Risk / Borderline",
        "Student performing at satisfactory passing level (G1=10, G2=11) with moderate study time."
    ))
    samples.append(format_sample(
        lr_student, "Student C: Stable High Performing",
        "Student with strong previous terms (G1=15, G2=15), consistent study habits, and aspirations for higher education."
    ))
    samples.append(format_sample(
        border_student, "Student D: At-Risk Transition Boundary",
        "Student sitting exactly on the passing threshold (G1=10, G2=10) where minor attendance or study shifts can tip risk status."
    ))

    # Baseline comparison models
    from sklearn.dummy import DummyClassifier
    from sklearn.linear_model import LogisticRegression
    from sklearn.metrics import precision_score, recall_score

    dummy = DummyClassifier(strategy='most_frequent')
    dummy.fit(X_train, y_train_3tier)
    dummy_acc = float(accuracy_score(y_test_3tier, dummy.predict(X_test)))

    lr = LogisticRegression(max_iter=1000, random_state=42)
    lr.fit(X_train, y_train_3tier)
    lr_acc = float(accuracy_score(y_test_3tier, lr.predict(X_test)))

    macro_prec = float(precision_score(y_test_3tier, y_pred_3tier, average='macro'))
    macro_rec = float(recall_score(y_test_3tier, y_pred_3tier, average='macro'))

    # Prepare metrics payload
    metrics = {
        "dataset": {
            "name": "UCI Student Performance (Math Course)",
            "source_file": "data/student-mat.csv",
            "companion_file": "data/student-por.csv",
            "dataset_selection": "Mathematics Course (student-mat.csv, N=395). Companion Portuguese dataset (student-por.csv, N=649) available in repository.",
            "citation": "P. Cortez and A. Silva. Using Data Mining to Predict Secondary School Student Performance. 2008.",
            "doi": "10.24432/C5TG7T",
            "total_samples": len(df),
            "training_samples": len(train_idx),
            "test_samples": len(test_idx),
            "features_count": len(feature_cols),
            "train_test_split": "80% Training (316 students) / 20% Held-Out Testing (79 students)",
            "random_seed": 42,
            "model_version": "1.0.0",
            "evaluation_date": "October 2026",
            "target_definitions": {
                "High Risk": "Higher Risk: Final Grade G3 < 10 (Failing academic threshold)",
                "Moderate Risk": "Moderate Risk: Final Grade G3 from 10 to 13 (Satisfactory passing, vulnerable)",
                "Low Risk": "Lower Concern: Final Grade G3 >= 14 (Proficient / Good to Excellent performance)"
            }
        },
        "evaluation": {
            "three_tier_model": {
                "algorithm": "Random Forest Classifier (Ensemble of 100 Trees, max_depth=6)",
                "n_estimators": 100,
                "max_depth": 6,
                "test_accuracy": round(float(test_acc_3tier), 4),
                "cv_5fold_mean_accuracy": round(float(np.mean(cv_scores)), 4),
                "cv_5fold_std": round(float(np.std(cv_scores)), 4),
                "macro_precision": round(macro_prec, 4),
                "macro_recall": round(macro_rec, 4),
                "macro_f1": round(float(macro_f1), 4),
                "classes": classes,
                "per_class_metrics": {
                    classes[i]: {
                        "precision": round(float(prec[i]), 4),
                        "recall": round(float(rec[i]), 4),
                        "f1_score": round(float(f1[i]), 4),
                        "support": int(supp[i])
                    } for i in range(len(classes))
                },
                "confusion_matrix": {
                    "labels": classes,
                    "matrix": cm
                }
            },
            "baseline_comparisons": {
                "dummy_most_frequent": {
                    "algorithm": "Zero-R / Majority Class Baseline (DummyClassifier)",
                    "test_accuracy": round(dummy_acc, 4),
                    "notes": "Always predicts the most frequent class (Moderate Risk: 41.8% train prevalence)"
                },
                "logistic_regression": {
                    "algorithm": "Multinomial Logistic Regression (L2 penalty, max_iter=1000)",
                    "test_accuracy": round(lr_acc, 4),
                    "notes": "Linear model baseline on one-hot encoded features"
                }
            },
            "binary_risk_model": {
                "algorithm": "Random Forest Binary Classifier (G3 < 10)",
                "test_accuracy": round(bin_acc, 4),
                "roc_auc": round(bin_auc, 4)
            },
            "grade_regression_model": {
                "algorithm": "Random Forest Regressor (G3 Continuous Scale 0-20)",
                "rmse": round(rmse, 3),
                "mae": round(mae, 3),
                "r2_score": round(r2, 3)
            }
        },
        "all_feature_names": all_feature_names,
        "feature_cols": feature_cols,
        "cat_cols": cat_cols,
        "num_cols": num_cols
    }

    # Save models and artifacts
    models_dir = os.path.join(os.path.dirname(__file__), 'models')
    os.makedirs(models_dir, exist_ok=True)

    joblib.dump(clf_3tier, os.path.join(models_dir, 'model_3tier.joblib'))
    joblib.dump(reg_grade, os.path.join(models_dir, 'model_grade.joblib'))
    joblib.dump(clf_binary, os.path.join(models_dir, 'model_binary.joblib'))
    joblib.dump(preprocessor, os.path.join(models_dir, 'preprocessor.joblib'))
    joblib.dump(explainer_binary, os.path.join(models_dir, 'explainer_binary.joblib'))

    with open(os.path.join(models_dir, 'metrics.json'), 'w') as f:
        json.dump(metrics, f, indent=2)

    with open(os.path.join(models_dir, 'global_importance.json'), 'w') as f:
        json.dump(global_features, f, indent=2)

    with open(os.path.join(models_dir, 'samples.json'), 'w') as f:
        json.dump(samples, f, indent=2)

    print("Pipeline training completed successfully!")
    print(f"3-Tier Test Accuracy: {test_acc_3tier:.4f}")
    print(f"Binary Test Accuracy: {bin_acc:.4f} | ROC-AUC: {bin_auc:.4f}")
    print(f"Grade Regression RMSE: {rmse:.3f} | R2: {r2:.3f}")
    print(f"Saved artifacts to {models_dir}")

if __name__ == '__main__':
    run_pipeline()
