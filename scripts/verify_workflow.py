"""
EduExplain AI - Workflow Verification Script
Tests all core user journeys:
1. Homepage route
2. Risk assessment prediction
3. Explainability & local coefficient contributions
4. What-If scenario analysis
5. Methodology metrics
6. All SPA client routes
"""

import urllib.request
import json
import math
import sys

BASE = 'http://127.0.0.1:8000'

def verify_workflow():
    print("==================================================================")
    print("  STEP-BY-STEP WORKFLOW VERIFICATION FOR EDUEXPLAIN AI")
    print("==================================================================")

    # 1. Homepage Confirmation
    print("\n--- [STEP 1] HOMEPAGE VERIFICATION ---")
    with urllib.request.urlopen(f'{BASE}/') as r:
        html = r.read().decode('utf-8')
        assert "EduExplain AI" in html
        print("  [OK] Homepage loaded (HTTP 200).")

    # 2. Risk Assessment: Valid Student Profile Submission
    print("\n--- [STEP 2] RISK ASSESSMENT TEST ---")
    student_payload = {
        'age': 16,
        'studytime': 2,
        'absences': 8,
        'failures': 1,
        'G1': 9,
        'G2': 10,
        'schoolsup': 'no',
        'famsup': 'yes',
        'paid': 'no',
        'activities': 'no',
        'higher': 'yes',
        'internet': 'yes',
        'romantic': 'no',
        'Medu': 2,
        'Fedu': 2,
        'traveltime': 1,
        'freetime': 3,
        'goout': 3,
        'health': 3
    }

    req_pred = urllib.request.Request(
        f'{BASE}/api/predict',
        data=json.dumps(student_payload).encode('utf-8'),
        headers={'Content-Type': 'application/json'}
    )
    with urllib.request.urlopen(req_pred) as r:
        pred = json.loads(r.read())
        print(f"  Predicted Risk Category: {pred['risk_tier']}")
        print(f"  Confidence: {pred['confidence']:.4f}")
        print(f"  Model-Estimated Class Probabilities:")
        prob_sum = 0.0
        for cls, p in pred['class_probabilities'].items():
            print(f"    - {cls}: {p * 100:.2f}%")
            prob_sum += p
        print(f"  Total Probability Sum: {prob_sum:.4f} (Valid: {math.isclose(prob_sum, 1.0, abs_tol=0.01)})")
        assert math.isclose(prob_sum, 1.0, abs_tol=0.01)
        assert pred['risk_tier'] in ['High Risk', 'Moderate Risk', 'Low Risk']

    # 3. Explainability: Local Feature Contributions
    print("\n--- [STEP 3] EXPLAINABILITY TEST ---")
    req_exp = urllib.request.Request(
        f'{BASE}/api/explain',
        data=json.dumps(student_payload).encode('utf-8'),
        headers={'Content-Type': 'application/json'}
    )
    with urllib.request.urlopen(req_exp) as r:
        exp = json.loads(r.read())
        print(f"  Baseline Expected Risk E[f(x)]: {exp['base_value']:.4f}")
        print(f"  Predicted Risk Probability f(x): {exp['predicted_risk_probability']:.4f}")
        print(f"  Top 3 Influencing Local Factors:")
        for factor in exp['feature_contributions'][:3]:
            print(f"    * {factor['label']}: Value={factor['user_value']} -> Contribution={factor['shap_value']:+.4f} ({factor['impact_type']})")
        assert len(exp['feature_contributions']) == 19

    # 4. What-If Scenario Analysis: Modifying Levers
    print("\n--- [STEP 4] WHAT-IF SCENARIO ANALYSIS TEST ---")
    modified_payload = {
        **student_payload,
        'studytime': 4,       # Increased to > 10h/week
        'absences': 1,        # Reduced absences
        'G2': 14              # Changed period 2 grade
    }
    req_wi = urllib.request.Request(
        f'{BASE}/api/what-if',
        data=json.dumps({'baseline': student_payload, 'modified': modified_payload}).encode('utf-8'),
        headers={'Content-Type': 'application/json'}
    )
    with urllib.request.urlopen(req_wi) as r:
        wi = json.loads(r.read())
        print(f"  Transition: {wi['deltas']['tier_transition']}")
        print(f"  Risk Probability Shift: {wi['deltas']['risk_probability_delta']:+.4f} ({wi['baseline']['risk_probability']*100:.1f}% -> {wi['modified']['risk_probability']*100:.1f}%)")
        print(f"  Detected Modified Inputs:")
        for c in wi['deltas']['changes_detected']:
            print(f"    - {c['label']}: {c['original_value']} -> {c['new_value']}")
        assert len(wi['deltas']['changes_detected']) == 3

    # 5. Methodology & Metrics
    print("\n--- [STEP 5] METHODOLOGY & METRICS EVIDENCE ---")
    with urllib.request.urlopen(f'{BASE}/api/metrics') as r:
        metrics = json.loads(r.read())
        print(f"  Dataset: {metrics['dataset']['name']} ({metrics['dataset']['total_samples']} students)")
        print(f"  Train/Test Split: {metrics['dataset']['train_test_split']}")
        print(f"  Model Architecture: {metrics['evaluation']['three_tier_model']['algorithm']}")
        print(f"  Test Accuracy: {metrics['evaluation']['three_tier_model']['test_accuracy']*100:.2f}%")
        print(f"  5-Fold CV Accuracy: {metrics['evaluation']['three_tier_model']['cv_5fold_mean_accuracy']*100:.2f}%")
        assert metrics['evaluation']['three_tier_model']['test_accuracy'] == 0.8228

    # 6. Client Routes
    print("\n--- [STEP 6] ROUTES TEST ---")
    routes = [
        '/', '/assessment', '/explanation', '/methodology',
        '/responsible-ai', '/about', '/privacy', '/terms'
    ]
    for route in routes:
        with urllib.request.urlopen(f'{BASE}{route}') as r:
            assert r.getcode() == 200
            print(f"  Route {route:<18} -> 200 OK")

    print("\n==================================================================")
    print("  ALL WORKFLOW VERIFICATIONS COMPLETED SUCCESSFULLY!")
    print("==================================================================")

if __name__ == '__main__':
    verify_workflow()
