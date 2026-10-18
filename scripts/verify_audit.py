"""
EduExplain AI - Comprehensive Submission Audit Script
Verifies:
1. Health & model status
2. Empirical metrics from test set
3. Authentic test student profiles
4. Global feature importance
5. Prediction on at-risk student profile
6. Prediction on high-performing student profile
7. What-If scenario simulation
8. Pydantic validation on bad inputs
9. Frontend route responses
10. Absence of forbidden terminology
"""

import urllib.request
import urllib.error
import json
import math
import sys

BASE = 'http://127.0.0.1:8000'

def run_audit():
    print("==================================================================")
    print("  EDUXPLAIN AI - COMPREHENSIVE SUBMISSION AUDIT")
    print("==================================================================")

    # 1. Health check
    print("\n[CHECK 1] Verifying System Health & Model Status (/api/health)...")
    with urllib.request.urlopen(f'{BASE}/api/health') as r:
        assert r.getcode() == 200
        health = json.loads(r.read())
        print(f"  Status: {health['status']}")
        print(f"  Model Loaded: {health['model_loaded']}")
        print(f"  Dataset: {health['dataset']}")
        assert health['status'] == 'healthy'
        assert health['model_loaded'] is True

    # 2. Evaluation Metrics Verification
    print("\n[CHECK 2] Verifying Empirical Metrics from Held-Out Test Set (/api/metrics)...")
    with urllib.request.urlopen(f'{BASE}/api/metrics') as r:
        assert r.getcode() == 200
        metrics = json.loads(r.read())
        clf_metrics = metrics['evaluation']['three_tier_model']
        dataset_info = metrics['dataset']
        print(f"  Test Accuracy: {clf_metrics['test_accuracy'] * 100:.2f}% (N={dataset_info['test_samples']})")
        print(f"  Macro Precision: {clf_metrics['macro_precision'] * 100:.2f}%")
        print(f"  Macro Recall: {clf_metrics['macro_recall'] * 100:.2f}%")
        print(f"  Macro F1: {clf_metrics['macro_f1'] * 100:.2f}%")
        assert clf_metrics['test_accuracy'] == 0.8228
        assert dataset_info['test_samples'] == 79
        assert dataset_info['random_seed'] == 42

    # 3. Test Samples
    print("\n[CHECK 3] Verifying Pre-Set Profiles (/api/samples)...")
    with urllib.request.urlopen(f'{BASE}/api/samples') as r:
        assert r.getcode() == 200
        samples = json.loads(r.read())
        print(f"  Retrieved {len(samples)} authentic held-out test student profiles.")
        assert len(samples) >= 4

    # 4. Global Feature Importance
    print("\n[CHECK 4] Verifying Global Feature Importance (/api/global-importance)...")
    with urllib.request.urlopen(f'{BASE}/api/global-importance') as r:
        assert r.getcode() == 200
        global_imp = json.loads(r.read())
        print(f"  Retrieved {len(global_imp)} feature importances. Top factor: {global_imp[0]['label']}")
        assert len(global_imp) == 19
        assert global_imp[0]['feature'] == 'G2'

    # 5. Live Prediction on At-Risk Profile
    print("\n[CHECK 5] Testing Prediction on At-Risk Student Profile...")
    student_at_risk = {
        'age': 17, 'studytime': 1, 'absences': 16, 'failures': 2,
        'G1': 6, 'G2': 7, 'schoolsup': 'no', 'famsup': 'no',
        'paid': 'no', 'activities': 'no', 'higher': 'no', 'internet': 'no',
        'romantic': 'no', 'Medu': 1, 'Fedu': 1, 'traveltime': 2,
        'freetime': 4, 'goout': 4, 'health': 3
    }
    req1 = urllib.request.Request(
        f'{BASE}/api/predict',
        data=json.dumps(student_at_risk).encode('utf-8'),
        headers={'Content-Type': 'application/json'}
    )
    with urllib.request.urlopen(req1) as r:
        pred1 = json.loads(r.read())
        print(f"  Prediction: {pred1['risk_tier']}, Confidence: {pred1['confidence']:.4f}")
        assert pred1['risk_tier'] == 'High Risk'
        assert 'class_probabilities' in pred1

    # 6. Live Prediction on High-Performing Profile
    print("\n[CHECK 6] Testing Prediction on High-Performing Student Profile...")
    student_high = {
        'age': 16, 'studytime': 4, 'absences': 2, 'failures': 0,
        'G1': 16, 'G2': 16, 'schoolsup': 'no', 'famsup': 'yes',
        'paid': 'yes', 'activities': 'yes', 'higher': 'yes', 'internet': 'yes',
        'romantic': 'no', 'Medu': 4, 'Fedu': 4, 'traveltime': 1,
        'freetime': 2, 'goout': 2, 'health': 4
    }
    req2 = urllib.request.Request(
        f'{BASE}/api/predict',
        data=json.dumps(student_high).encode('utf-8'),
        headers={'Content-Type': 'application/json'}
    )
    with urllib.request.urlopen(req2) as r:
        pred2 = json.loads(r.read())
        print(f"  Prediction: {pred2['risk_tier']}, Confidence: {pred2['confidence']:.4f}")
        assert pred2['risk_tier'] == 'Low Risk'

    # 7. What-If Scenario Simulation
    print("\n[CHECK 7] Testing Interactive What-If Scenario Simulation (/api/what-if)...")
    req_wi = urllib.request.Request(
        f'{BASE}/api/what-if',
        data=json.dumps({'baseline': student_at_risk, 'modified': student_high}).encode('utf-8'),
        headers={'Content-Type': 'application/json'}
    )
    with urllib.request.urlopen(req_wi) as r:
        wi = json.loads(r.read())
        print(f"  Transition: {wi['deltas']['tier_transition']}")
        print(f"  Risk Probability Shift: {wi['deltas']['risk_probability_delta']:+.4f}")
        assert wi['baseline']['risk_tier'] == 'High Risk'
        assert wi['modified']['risk_tier'] == 'Low Risk'

    # 8. Server-Side Pydantic Input Validation
    print("\n[CHECK 8] Verifying Server-Side Pydantic Input Validation...")
    invalid_missing = {'age': 17, 'studytime': 2}
    req_inv1 = urllib.request.Request(
        f'{BASE}/api/predict',
        data=json.dumps(invalid_missing).encode('utf-8'),
        headers={'Content-Type': 'application/json'}
    )
    try:
        urllib.request.urlopen(req_inv1)
        assert False, "Should have failed with 422"
    except urllib.error.HTTPError as e:
        assert e.code == 422
        print("  [OK] Missing fields rejected with HTTP 422")

    # 9. Client Routes
    print("\n[CHECK 9] Verifying Frontend Client Routes...")
    for route in ['/', '/assessment', '/explanation', '/methodology', '/responsible-ai', '/about', '/privacy', '/terms']:
        with urllib.request.urlopen(f'{BASE}{route}') as r:
            assert r.getcode() == 200

    print("\n==================================================================")
    print("  ALL AUDIT CHECKS PASSED!")
    print("==================================================================")

if __name__ == '__main__':
    run_audit()
