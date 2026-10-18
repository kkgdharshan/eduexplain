"""
EduExplain AI - FastAPI Backend Server
EduExplain AI uses a Logistic Regression model trained on the UCI Student Performance dataset. Feature contributions are calculated from the model coefficients and describe how each input influenced the model output. They do not prove causation.
"""

import os
import json
import joblib
import pandas as pd
import numpy as np
from typing import Dict, Any, List, Optional
from fastapi import FastAPI, HTTPException
from fastapi.middleware.cors import CORSMiddleware
from fastapi.staticfiles import StaticFiles
from fastapi.responses import FileResponse
from pydantic import BaseModel, Field, field_validator

# Paths
BASE_DIR = os.path.dirname(os.path.abspath(__file__))
MODELS_DIR = os.path.join(BASE_DIR, 'models')

# Load trained artifacts
try:
    clf_3tier = joblib.load(os.path.join(MODELS_DIR, 'model_3tier.joblib'))
    reg_grade = joblib.load(os.path.join(MODELS_DIR, 'model_grade.joblib'))
    clf_binary = joblib.load(os.path.join(MODELS_DIR, 'model_binary.joblib'))
    preprocessor = joblib.load(os.path.join(MODELS_DIR, 'preprocessor.joblib'))
    explainer_binary = joblib.load(os.path.join(MODELS_DIR, 'explainer_binary.joblib'))

    with open(os.path.join(MODELS_DIR, 'metrics.json'), 'r') as f:
        metrics_data = json.load(f)

    with open(os.path.join(MODELS_DIR, 'global_importance.json'), 'r') as f:
        global_importance_data = json.load(f)

    with open(os.path.join(MODELS_DIR, 'samples.json'), 'r') as f:
        samples_data = json.load(f)

    models_loaded = True
except Exception as e:
    print(f"Error loading models: {e}")
    models_loaded = False
    clf_3tier = None
    reg_grade = None
    clf_binary = None
    preprocessor = None
    explainer_binary = None
    metrics_data = {}
    global_importance_data = []
    samples_data = []

app = FastAPI(
    title="EduExplain AI API",
    description="Educational Risk Prediction and Explainability Research API",
    version="1.0.0"
)

# Enable CORS for frontend development
app.add_middleware(
    CORSMiddleware,
    allow_origins=["*"],
    allow_credentials=True,
    allow_methods=["*"],
    allow_headers=["*"],
)

FEATURE_LABELS = {
    'G2': 'Second Period Grade (G2)',
    'G1': 'First Period Grade (G1)',
    'failures': 'Past Course Failures',
    'absences': 'School Absences',
    'age': 'Student Age',
    'studytime': 'Weekly Study Time',
    'schoolsup': 'Extra School Support',
    'schoolsup_yes': 'Extra School Support',
    'famsup': 'Family Educational Support',
    'famsup_yes': 'Family Educational Support',
    'paid': 'Extra Paid Tutoring',
    'paid_yes': 'Extra Paid Tutoring',
    'activities': 'Extracurricular Activities',
    'activities_yes': 'Extracurricular Activities',
    'higher': 'Higher Education Aspiration',
    'higher_yes': 'Higher Education Aspiration',
    'internet': 'Home Internet Access',
    'internet_yes': 'Home Internet Access',
    'romantic': 'In Romantic Relationship',
    'romantic_yes': 'In Romantic Relationship',
    'Medu': "Mother's Education Level",
    'Fedu': "Father's Education Level",
    'traveltime': 'Commute / Travel Time',
    'freetime': 'Free Time After School',
    'goout': 'Going Out With Friends',
    'health': 'Current Health Status'
}

STUDY_TIME_LABELS = {
    1: "< 2 hours / week",
    2: "2 to 5 hours / week",
    3: "5 to 10 hours / week",
    4: "> 10 hours / week"
}

TRAVEL_TIME_LABELS = {
    1: "< 15 min",
    2: "15 to 30 min",
    3: "30 to 60 min",
    4: "> 60 min"
}

EDU_LEVEL_LABELS = {
    0: "None",
    1: "Primary (4th grade)",
    2: "5th to 9th grade",
    3: "Secondary education",
    4: "Higher education"
}

class StudentInput(BaseModel):
    age: int = Field(..., ge=15, le=22, description="Student age in years (15-22)")
    studytime: int = Field(..., ge=1, le=4, description="Weekly study time: 1 (<2h), 2 (2-5h), 3 (5-10h), 4 (>10h)")
    absences: int = Field(..., ge=0, le=93, description="Number of school absences (0-93)")
    failures: int = Field(..., ge=0, le=4, description="Number of past class failures (0-4)")
    G1: int = Field(..., ge=0, le=20, description="First period grade (0-20 scale)")
    G2: int = Field(..., ge=0, le=20, description="Second period grade (0-20 scale)")
    schoolsup: str = Field(..., pattern="^(yes|no)$", description="Extra educational support from school")
    famsup: str = Field(..., pattern="^(yes|no)$", description="Family educational support")
    paid: str = Field(..., pattern="^(yes|no)$", description="Extra paid classes within course subject")
    activities: str = Field(..., pattern="^(yes|no)$", description="Extra-curricular activities")
    higher: str = Field(..., pattern="^(yes|no)$", description="Wants to take higher education")
    internet: str = Field(..., pattern="^(yes|no)$", description="Internet access at home")
    romantic: str = Field(..., pattern="^(yes|no)$", description="With a romantic relationship")
    Medu: int = Field(..., ge=0, le=4, description="Mother's education (0-4)")
    Fedu: int = Field(..., ge=0, le=4, description="Father's education (0-4)")
    traveltime: int = Field(..., ge=1, le=4, description="Home to school travel time (1-4)")
    freetime: int = Field(..., ge=1, le=5, description="Free time after school (1-5)")
    goout: int = Field(..., ge=1, le=5, description="Going out with friends (1-5)")
    health: int = Field(..., ge=1, le=5, description="Current health status (1-5)")

    @field_validator('schoolsup', 'famsup', 'paid', 'activities', 'higher', 'internet', 'romantic')
    def validate_binary(cls, v: str) -> str:
        v_clean = v.strip().lower()
        if v_clean not in ('yes', 'no'):
            raise ValueError("Value must be 'yes' or 'no'")
        return v_clean

class WhatIfRequest(BaseModel):
    baseline: StudentInput
    modified: StudentInput

def check_models():
    if not models_loaded or clf_3tier is None:
        raise HTTPException(
            status_code=503,
            detail="Predictive models are not loaded. Please verify backend/models artifacts."
        )

def prepare_dataframe(student: StudentInput) -> pd.DataFrame:
    data = student.model_dump()
    return pd.DataFrame([data])

@app.get("/health")
@app.get("/api/health")
def health():
    return {
        "status": "healthy" if models_loaded else "unhealthy",
        "message": "EduExplain AI Research Engine is operational",
        "model_loaded": models_loaded,
        "framework": "scikit-learn (Logistic Regression)",
        "dataset": "UCI Student Performance (Cortez & Silva, 2008)",
        "service": "EduExplain AI Research Engine"
    }

@app.get("/api/metrics")
def get_metrics():
    check_models()
    try:
        with open(os.path.join(MODELS_DIR, 'metrics.json'), 'r') as f:
            return json.load(f)
    except Exception:
        return metrics_data

@app.get("/api/global-importance")
def get_global_importance():
    check_models()
    return global_importance_data

@app.get("/api/samples")
def get_samples():
    check_models()
    return samples_data

@app.post("/api/predict")
def predict(student: StudentInput):
    check_models()
    df_input = prepare_dataframe(student)
    X_proc = preprocessor.transform(df_input)

    # 3-tier classification
    pred_tier = clf_3tier.predict(X_proc)[0]
    classes = list(clf_3tier.classes_)
    probas = clf_3tier.predict_proba(X_proc)[0]
    class_probs = {cls_name: round(float(prob), 4) for cls_name, prob in zip(classes, probas)}

    # Confidence is the model-estimated probability of the predicted category
    confidence = round(float(class_probs[pred_tier]), 4)

    # Continuous grade prediction
    pred_grade = round(float(reg_grade.predict(X_proc)[0]), 2)
    # Clamp between 0 and 20
    pred_grade = max(0.0, min(20.0, pred_grade))

    # Binary risk probability (G3 < 10)
    binary_prob = round(float(clf_binary.predict_proba(X_proc)[0][1]), 4)

    tier_descriptions = {
        "High Risk": "Final course grade is projected below 10 (failing threshold). Early targeted instructional support recommended.",
        "Moderate Risk": "Final course grade is projected between 10 and 13 (passing, but borderline/vulnerable). Continued monitoring advised.",
        "Low Risk": "Final course grade is projected at 14 or above (proficient/stable). On track for academic progression."
    }

    return {
        "risk_tier": pred_tier,
        "predicted_grade": pred_grade,
        "confidence": confidence,
        "class_probabilities": class_probs,
        "binary_risk_probability": binary_prob,
        "description": tier_descriptions.get(pred_tier, ""),
        "target_definitions": {
            "Higher Risk": "Higher Risk: Grade < 10 (Failing threshold)",
            "Moderate Risk": "Moderate Risk: Grade 10 to 13 (Vulnerable)",
            "Lower Concern": "Lower Concern: Grade >= 14 (Proficient)"
        }
    }

@app.post("/api/explain")
def explain(student: StudentInput):
    check_models()
    df_input = prepare_dataframe(student)
    X_proc = preprocessor.transform(df_input)

    # TreeExplainer on binary risk classifier
    shap_vals = explainer_binary.shap_values(X_proc)

    # Handle shap dimensions
    if isinstance(shap_vals, list):
        shap_vec = shap_vals[1][0]
    elif len(np.array(shap_vals).shape) == 3:
        shap_vec = shap_vals[0, :, 1]
    else:
        shap_vec = shap_vals[0]

    # Base value / expected value for risk
    if isinstance(explainer_binary.expected_value, (list, np.ndarray)):
        expected_val = float(explainer_binary.expected_value[1])
    else:
        expected_val = float(explainer_binary.expected_value)

    # Transform feature names
    cat_cols = ['schoolsup', 'famsup', 'paid', 'activities', 'higher', 'internet', 'romantic']
    num_cols = [c for c in metrics_data.get('feature_cols', []) if c not in cat_cols]
    all_names = num_cols + [f"{c}_yes" for c in cat_cols]

    input_dict = student.model_dump()

    feature_contributions = []
    for idx, name in enumerate(all_names):
        sv = float(shap_vec[idx])
        base_name = name.replace('_yes', '')
        user_val = input_dict.get(base_name, None)

        readable_label = FEATURE_LABELS.get(name, FEATURE_LABELS.get(base_name, base_name))

        # Format user value nicely
        display_val = str(user_val)
        if base_name == 'studytime':
            display_val = STUDY_TIME_LABELS.get(user_val, str(user_val))
        elif base_name == 'traveltime':
            display_val = TRAVEL_TIME_LABELS.get(user_val, str(user_val))
        elif base_name in ('Medu', 'Fedu'):
            display_val = EDU_LEVEL_LABELS.get(user_val, str(user_val))

        # Direction of impact:
        # positive contribution on risk classifier -> increases risk
        # negative contribution on risk classifier -> decreases risk (protective factor)
        impact_type = "risk_increasing" if sv > 0 else "protective"

        feature_contributions.append({
            "feature": base_name,
            "raw_feature": name,
            "label": readable_label,
            "user_value": user_val,
            "display_value": display_val,
            "shap_value": round(sv, 4),
            "abs_shap": round(abs(sv), 4),
            "impact_type": impact_type
        })

        # Sort contributions by absolute value descending
        feature_contributions.sort(key=lambda x: x["abs_shap"], reverse=True)

    # Risk probability
    pred_risk_prob = round(float(clf_binary.predict_proba(X_proc)[0][1]), 4)

    return {
        "base_value": round(expected_val, 4),
        "predicted_risk_probability": pred_risk_prob,
        "feature_contributions": feature_contributions,
        "disclaimer": "Feature importance represents statistical associations identified by the machine learning model within the observational UCI training cohort. It does not establish clinical or educational causation."
    }

@app.post("/api/what-if")
def what_if(request: WhatIfRequest):
    check_models()
    
    # Baseline
    df_base = prepare_dataframe(request.baseline)
    X_base = preprocessor.transform(df_base)
    base_tier = clf_3tier.predict(X_base)[0]
    base_grade = round(float(reg_grade.predict(X_base)[0]), 2)
    base_probs = {c: round(float(p), 4) for c, p in zip(clf_3tier.classes_, clf_3tier.predict_proba(X_base)[0])}
    base_risk_prob = round(float(clf_binary.predict_proba(X_base)[0][1]), 4)

    # Modified
    df_mod = prepare_dataframe(request.modified)
    X_mod = preprocessor.transform(df_mod)
    mod_tier = clf_3tier.predict(X_mod)[0]
    mod_grade = round(float(reg_grade.predict(X_mod)[0]), 2)
    mod_probs = {c: round(float(p), 4) for c, p in zip(clf_3tier.classes_, clf_3tier.predict_proba(X_mod)[0])}
    mod_risk_prob = round(float(clf_binary.predict_proba(X_mod)[0][1]), 4)

    # Changed features
    base_dict = request.baseline.model_dump()
    mod_dict = request.modified.model_dump()
    changes = []
    for k in base_dict:
        if base_dict[k] != mod_dict[k]:
            changes.append({
                "feature": k,
                "label": FEATURE_LABELS.get(k, k),
                "original_value": base_dict[k],
                "new_value": mod_dict[k]
            })

    risk_prob_delta = round(mod_risk_prob - base_risk_prob, 4)
    grade_delta = round(mod_grade - base_grade, 2)

    return {
        "baseline": {
            "risk_tier": base_tier,
            "predicted_grade": max(0.0, min(20.0, base_grade)),
            "class_probabilities": base_probs,
            "risk_probability": base_risk_prob
        },
        "modified": {
            "risk_tier": mod_tier,
            "predicted_grade": max(0.0, min(20.0, mod_grade)),
            "class_probabilities": mod_probs,
            "risk_probability": mod_risk_prob
        },
        "deltas": {
            "risk_probability_delta": risk_prob_delta,
            "predicted_grade_delta": grade_delta,
            "tier_transition": f"{base_tier} -> {mod_tier}" if base_tier != mod_tier else f"Unchanged ({base_tier})",
            "changes_detected": changes
        }
    }

# Mount static files if frontend build exists
frontend_dist = os.path.join(os.path.dirname(BASE_DIR), 'frontend', 'dist')
if os.path.exists(frontend_dist):
    app.mount("/assets", StaticFiles(directory=os.path.join(frontend_dist, "assets")), name="assets")

    @app.get("/{full_path:path}")
    async def serve_frontend(full_path: str):
        file_path = os.path.join(frontend_dist, full_path)
        if os.path.exists(file_path) and os.path.isfile(file_path):
            return FileResponse(file_path)
        return FileResponse(os.path.join(frontend_dist, "index.html"))

if __name__ == '__main__':
    import uvicorn
    uvicorn.run(app, host="127.0.0.1", port=8000)
