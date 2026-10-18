# EduExplain AI - Explain My Learning Risk

**Official Hackathon Challenge 01:** Explain My Learning Risk  
**Project Name:** EduExplain AI  
**Benchmark Dataset:** UCI Machine Learning Repository - Student Performance Data Set (Cortez and Silva, 2008)  
**System Status:** Fully Connected Educational Research Prototype  

---

## 1. Project Overview & Challenge 01 Description

EduExplain AI is an interpretable educational data science research prototype created for **Challenge 01: Explain My Learning Risk**. 

Early Warning Systems (EWS) in secondary education are frequently implemented as opaque "black-box" systems that assign high-risk alerts without explaining the underlying drivers. When an academic advisor or mentor receives an alert indicating a student has a high probability of academic difficulty without transparent attribution, they cannot determine whether academic deficiencies, attendance patterns, or support deficits are responsible.

EduExplain AI uses a Logistic Regression model trained on the UCI Student Performance dataset. Feature contributions are calculated from the model coefficients and describe how each input influenced the model output. They do not prove causation. Deployed architecture: Logistic Regression with coefficient-based feature contribution analysis.

### Core Objectives:
1. **Student Input Assessment:** Accept standardized academic history, attendance, study habits, and support parameters based on the UCI benchmark.
2. **Multi-Tier Risk Prediction:** Predict three operational tiers (Higher Risk, Moderate Risk, Lower Concern) with model-estimated class probabilities.
3. **Local Explainability:** Decompose individual predictions into additive coefficient contributions that elevate risk or act as protective buffers.
4. **Global Feature Importance:** Benchmark population-level variable weights derived from the trained model across the cohort.
5. **Interactive Scenario Simulation:** Enable mentors to explore hypothetical input scenarios (e.g. changing study hours or attendance) and observe the model response without prescriptive or causal guarantees.
6. **Responsible AI Governance:** Enforce a Zero-PII (Personally Identifiable Information) data architecture, ephemeral in-memory processing, and transparent disclaimers.

---

## 2. Benchmark Dataset & Target Formulation

- **Data Source:** UCI Student Performance Data Set (Paulo Cortez & Alice Silva, 2008; University of Minho, Portugal).
- **Official Repository:** [https://archive.ics.uci.edu/dataset/320/student+performance](https://archive.ics.uci.edu/dataset/320/student+performance) (DOI: 10.24432/C5TG7T).
- **License:** Creative Commons Attribution 4.0 International (CC BY 4.0).
- **Modeled Subject:** Mathematics Course (`student-mat.csv`), 395 student instances, 33 attributes.
- **Predictive Attributes (19 features):**
  - Academic trajectory: `G1` (Period 1 Grade, 0-20), `G2` (Period 2 Grade, 0-20), `failures` (past course failures, 0-4).
  - Study dedication & attendance: `studytime` (1: <2h, 2: 2-5h, 3: 5-10h, 4: >10h), `absences` (school absences, 0-93).
  - Support structures: `schoolsup` (extra school educational support), `famsup` (family educational support), `paid` (extra paid subject tutoring).
  - Social & environmental factors: `higher` (higher education aspiration), `internet` (home internet access), `romantic` (romantic relationship), `activities` (extracurriculars), `age` (15-22), `Medu` / `Fedu` (parental education levels 0-4), `traveltime` (commute time 1-4), `freetime` (1-5), `goout` (going out with friends 1-5), `health` (current health status 1-5).
- **Target Variable Definition:**
  - Portuguese secondary education grading scale (0 to 20 points, passing threshold = 10).
  - **Higher Risk (Grade < 10):** Failing academic status. Candidate for early targeted instructional support.
  - **Moderate Risk (10 <= Grade < 14):** Satisfactory passing, but borderline or vulnerable to falling behind.
  - **Lower Concern (Grade >= 14):** Proficient to superior academic performance.

---

## 3. Model Description & Explainability Method

### Model Description
EduExplain AI deploys a **Multinomial Logistic Regression** classifier with L2 regularization trained on one-hot encoded and standardized features from the UCI Student Performance benchmark. The model outputs valid class probabilities across the three risk tiers.

### Explainability Method
- **Additive Decomposition:** Individual predictions are explained by evaluating each feature's contribution based on model coefficients:
  $$\text{Logit}(P) = \beta_0 + \sum_{i=1}^{M} \beta_i \cdot x_i$$
- **Directional Attribution:**
  - **Positive Contribution (+ sign):** Factor that increased estimated learning risk toward failure (e.g. prior term difficulties or high absences).
  - **Negative Contribution (- sign):** Protective buffer that reduced estimated risk (e.g. higher weekly study time or family educational support).
- **Global Feature Weights:** Feature importance is calculated across the validation cohort from absolute model coefficient weights.

---

## 4. Empirical Evaluation on Held-Out Test Set (N=79)

The pipeline was evaluated on a stratified 80/20 train/test partition (316 training records, 79 held-out test records) with `random_state=42`.

| Metric | Value | Technical Context |
| :--- | :--- | :--- |
| **3-Tier Test Accuracy** | **82.28%** | Held-out test set (N=79) |
| **5-Fold Stratified CV Accuracy** | **86.84% &plusmn; 2.84%** | Cross-validation stability |
| **Higher Risk Recall** | **92.31%** | 24 of 26 failing students detected |
| **Higher Risk Precision** | **85.71%** | High intervention confidence |
| **Macro F1-Score** | **0.8148** | Balanced across all three classes |
| **Baseline Zero-R Accuracy** | **41.77%** | Majority class naive floor |

### Held-Out Test Confusion Matrix (N=79)

| Actual \\ Predicted | Predicted: High Risk | Predicted: Moderate Risk | Predicted: Low Risk |
| :--- | :---: | :---: | :---: |
| **Actual: High Risk (26)** | **24** | 2 | 0 |
| **Actual: Moderate Risk (33)** | 4 | **29** | 0 |
| **Actual: Low Risk (20)** | 0 | 8 | **12** |

*Note: Zero actual High-Risk students were misclassified as Low-Risk.*

---

## 5. Application Architecture & Repository Structure

```text
eduexplain-ai/
  frontend/
    package.json         # Frontend dependencies and build scripts
    index.html           # HTML entry point, SEO meta tags, OpenGraph
    vercel.json          # Vercel SPA rewrite routing configuration
    .env.example         # Environment template with VITE_API_URL
    src/
      components/        # Navbar, Footer, PageMetadata
      context/           # StudentContext (state management, API connection tracking)
      pages/             # Home, Assessment, Explanation, Methodology, ResponsibleAI, About, Privacy, Terms, NotFound
      services/          # api.ts (typed API client with VITE_API_URL support)
      types/             # TypeScript data interfaces
    public/              # Favicon and static assets
  backend/
    server.py            # Standalone backend server launcher (reads PORT, HOST)
    main.py              # FastAPI application with prediction & explainability endpoints
    requirements.txt     # Python production dependencies
    models/              # Serialized joblib artifacts and precomputed JSON metrics
  data/
    README.md            # UCI dataset attribution, license, and variable dictionary
    student-mat.csv      # Mathematics course dataset (395 records)
  scripts/
    verify_workflow.py   # Step-by-step verification script
    verify_audit.py      # Pre-submission comprehensive audit script
  README.md              # Project documentation
  .gitignore             # Git ignore configuration
```

---

## 6. Required Environment Variables

| Variable | Target Environment | Description | Example |
| :--- | :--- | :--- | :--- |
| `VITE_API_URL` | Frontend (Vercel) | Full URL of the deployed backend API. | `https://eduexplain-api.onrender.com` |
| `PORT` | Backend (Cloud/Docker) | Port for the backend server to bind to (defaults to `8000`). | `8000` |
| `HOST` | Backend (Cloud/Docker) | Host interface for server binding (defaults to `0.0.0.0` in cloud). | `0.0.0.0` |

> [!NOTE]
> Do NOT use `localhost` or `127.0.0.1` as the production `VITE_API_URL` on Vercel. See `.env.example`.

---

## 7. Local Development Instructions

### Prerequisites
- Python 3.10+
- Node.js 18+ and npm

### Option A: Unified Server (Recommended for Local Evaluation)
Runs both the FastAPI backend and serves the compiled frontend on port 8000:

```bash
# 1. Install Python dependencies
pip install -r backend/requirements.txt

# 2. Build the frontend
cd frontend
npm install
npm run build
cd ..

# 3. Launch unified server
python server.py
```
Open **http://127.0.0.1:8000** in your browser.

### Option B: Separate Frontend & Backend Development Servers

**Terminal 1 (Backend):**
```bash
cd backend
pip install -r requirements.txt
python server.py
# Backend runs at http://127.0.0.1:8000
```

**Terminal 2 (Frontend):**
```bash
cd frontend
npm install
npm run dev
# Frontend runs at http://localhost:5173 with proxy to backend
```

---

## 8. Deployment Instructions

### Frontend Deployment (Vercel)

1. Push your repository to GitHub.
2. Sign in to [Vercel](https://vercel.com/) and click **Add New Project**.
3. Import your GitHub repository.
4. In the project settings:
   - **Root Directory:** Select `frontend`
   - **Framework Preset:** `Vite`
   - **Build Command:** `npm run build`
   - **Output Directory:** `dist`
5. In **Environment Variables**, add:
   - **Key:** `VITE_API_URL`
   - **Value:** `https://your-backend-api-url.example.com` (your deployed backend URL)
6. Click **Deploy**. Vercel will build the frontend and deploy it globally with SPA route rewrites configured via `vercel.json`.

### Backend Deployment (Render / Railway / Fly.io)

1. In your cloud provider dashboard, create a new **Web Service**.
2. Connect your GitHub repository.
3. Configure the service:
   - **Root Directory:** `backend` (or repo root)
   - **Runtime:** `Python 3`
   - **Build Command:** `pip install -r requirements.txt`
   - **Start Command:** `python server.py` (or `uvicorn main:app --host 0.0.0.0 --port $PORT`)
4. Health check path: `/health`
5. Once deployed, copy the assigned HTTPS service URL (e.g. `https://eduexplain-api.onrender.com`) and paste it as `VITE_API_URL` in your Vercel project settings.

---

## 9. Responsible AI Principles & Ethical Governance

- **Association vs. Causation:** Statistical feature importance indicates model association in observational historical data and does not prove causation. Educators and mentors must exercise professional discretion when designing interventions.
- **Scenario Simulation, Not Guaranteed Improvement:** The What-If Simulator displays the mathematical response of the model to changed input parameters; it does not claim or guarantee student outcome improvement.
- **Zero Personally Identifiable Information (Zero-PII):** No student names, identification numbers, addresses, contact details, or IP addresses are requested, stored, or processed.
- **Stateless In-Memory Execution:** Student profiles are processed strictly in-memory during inference and immediately discarded. No persistent records are created.
- **Algorithmic Fairness Awareness:** Automated demographic parity reweighting was not implemented; educators must maintain critical awareness regarding socioeconomic proxy variables in historical data.
- **Human-in-the-Loop:** EduExplain AI is designed solely as an educational decision-support tool. It must never be used for autonomous rejection, punitive grading, disciplinary tracking, or stigmatization.

---

## 10. Verification & Reproducibility Scripts

Automated audit scripts are included in `scripts/`:

```bash
# Verify all workflow steps, prediction, explainability, and client routes:
python scripts/verify_workflow.py

# Run comprehensive 10-point audit suite:
python scripts/verify_audit.py
```

---

## 11. Academic Attribution & Citation

```bibtex
@inproceedings{cortez2008using,
  title={Using data mining to predict secondary school student performance},
  author={Cortez, Paulo and Silva, Alice Maria Gon{\c{c}}alves},
  booktitle={Proceedings of 5th Annual Future Business Technology Conference (FUBUTEC 2008)},
  pages={5--12},
  year={2008},
  organization={EUROSIS}
}
```

Developed as an academic research prototype for Hackathon Challenge 01.
