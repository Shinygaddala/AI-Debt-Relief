# AI Powered Debt Relief & Financial Recovery Platform

A complete, production-quality, high-fidelity web application designed for financial recovery, debt analysis, and underwriter management. The platform uses a rule-based AI engine to assess loan eligibility, estimate Debt-to-Income (DTI) limits, calculate payoff strategies, and generate formal negotiation documents.

---

## Technical Stack

### Backend
- **Python 3.11+**
- **FastAPI** (High performance async framework)
- **SQLAlchemy ORM** (Database mappings)
- **SQLite** (Development database)
- **JWT Authentication** (`python-jose`)
- **Passlib** (Bcrypt password hashing)
- **Pydantic v2** (Data validation & schemas)
- **Uvicorn** (ASGI server)

### Frontend
- **React.js 18** (Vite build engine)
- **React Router DOM v6** (Client routing)
- **Axios** (API requests with automatic token insertion)
- **Chart.js & React-Chartjs-2** (Visual financial analytics)
- **Lucide React** (Clean modern UI icons)
- **Custom CSS Design System** (Glassmorphism layout, responsive navigation, dark blue theme)

---

## Folder Structure

```text
AI-Debt-Relief/
├── backend/
│   ├── app/
│   ├── auth/
│   │   ├── dependencies.py      # Auth guards (get_current_user, get_admin_user)
│   │   └── jwt_handler.py       # JWT encode/decode & password hashing
│   ├── database/
│   │   ├── base.py              # Declarative SQLAlchemy base
│   │   └── connection.py        # SQLite setup & session management
│   ├── models/
│   │   ├── user.py              # User entity
│   │   ├── loan.py              # Loan applications
│   │   └── ai_history.py        # AI runs log
│   ├── routes/
│   │   ├── auth.py              # /register, /login, /profile
│   │   ├── loans.py             # /loan/apply, /loan/my-loans, cancel
│   │   ├── ai.py                # /ai/predict, /history
│   │   └── admin.py             # stats, approval, user purges
│   ├── schemas/
│   │   ├── user.py              # User validation models
│   │   ├── loan.py              # Loan validation models
│   │   └── ai.py                # AI input/output validation models
│   ├── services/
│   │   └── ai_service.py        # Rule-based AI underwriting logic
│   ├── utils/
│   ├── requirements.txt
│   └── main.py                  # Entrypoint & CORS setup
│
├── frontend/
│   ├── src/
│   │   ├── components/
│   │   │   ├── ProtectedRoute.jsx
│   │   │   ├── Sidebar.jsx
│   │   │   ├── Navbar.jsx
│   │   │   └── Toast.jsx        # Contextual global alert toast hooks
│   │   ├── pages/
│   │   │   ├── LandingPage.jsx
│   │   │   ├── Login.jsx
│   │   │   ├── Register.jsx
│   │   │   ├── Dashboard.jsx
│   │   │   ├── ApplyLoan.jsx
│   │   │   ├── LoanHistory.jsx
│   │   │   ├── PredictionResult.jsx
│   │   │   ├── PredictionHistory.jsx
│   │   │   ├── SettlementCalculator.jsx
│   │   │   ├── DebtCalculator.jsx
│   │   │   ├── NegotiationEmail.jsx
│   │   │   ├── KnowYourRights.jsx
│   │   │   ├── Profile.jsx
│   │   │   ├── AdminDashboard.jsx
│   │   │   └── NotFound.jsx
│   │   ├── services/
│   │   │   └── api.js           # Axios config with interceptors
│   │   ├── App.jsx              # Routing configurations
│   │   ├── main.jsx
│   │   └── index.css            # Custom CSS system
│   ├── package.json
│   └── vite.config.js
│
├── .env.example
├── .env
└── README.md
```

---

## Installation & Setup

### 1. Environment Configurations
Configure your environmental variables in `.env` in the root folder (or copy `.env.example`).
```bash
# Example .env settings
DATABASE_URL=sqlite:///./ai_debt_relief.db
SECRET_KEY=super_secret_fintech_recovery_key_987654321
ACCESS_TOKEN_EXPIRE_MINUTES=1440
VITE_API_URL=http://localhost:8000
```

### 2. Backend Setup
1. Move to the backend folder:
   ```bash
   cd backend
   ```
2. Set up a virtual environment (recommended) and activate it:
   ```bash
   python3 -m venv venv
   source venv/bin/activate
   ```
3. Install the dependencies:
   ```bash
   pip install -r requirements.txt
   ```
4. Start the ASGI dev server:
   ```bash
   uvicorn main:app --reload
   ```
   The backend API will be available at [http://localhost:8000](http://localhost:8000). The Swagger docs will mount at [http://localhost:8000/docs](http://localhost:8000/docs).

### 3. Frontend Setup
1. Open a new terminal tab and navigate to the frontend folder:
   ```bash
   cd frontend
   ```
2. Install the node packages:
   ```bash
   npm install
   ```
3. Run the Vite development server:
   ```bash
   npm run dev
   ```
   The frontend will boot at [http://localhost:5173](http://localhost:5173).

---

## Platform Features

### Authentication & Roles
- **JWT token secure storage:** Tokens are held in `localStorage` and automatically appended to the HTTP headers of all API operations.
- **Auto-Redirection:** Successful logins route users directly to the Dashboard. Unauthenticated attempts to access secure views are intercepted.
- **First-User Admin Rule:** The very first email registered on the platform is automatically assigned the `ADMIN` role for easy testing. Subsequent accounts default to the `USER` role. Alternatively, you can select the role explicitly on the registration form.

### User Portal
1. **Interactive Dashboard:** View KPI summaries of active loan obligations, status doughnut charts, risk profiles, and recent application updates.
2. **Apply for Relief Loan:** Submit FICO standings, assets, and liabilities. A live DTI indicator warns you of risk thresholds before filing.
3. **AI Assessment Report:** Explore detailed risk scores, primary underwriting reasons, and tailored recommendations.
4. **Calculators:**
   - **Settlement Calculator:** Plan 30-50% settlement offerings and calculate monthly savings targets.
   - **Debt payoff planner:** Compare Snowball vs. Avalanche payoff timelines on dynamically added debts.
   - **EMI tool:** Calculate monthly loan terms with interactive sliders.
5. **Negotiation Generator:** Generate legally-compliant hardship letters, cease-and-desists, or settlement letters.
6. **Rights Guide:** Review consumer protections under FDCPA and FCRA.

### Admin Portal
1. **Global Overview:** Inspect active users, system liability value, and total approved capital.
2. **Manage Applications:** Review user filings, view individual AI assessments, and approve/reject applications immediately.
3. **Manage Accounts:** View a log of registered accounts and purge users (and all associated data) from the system.

---

## API Endpoints

### Auth
- `POST /register`: Register a new profile.
- `POST /login`: Log in to retrieve a JWT token.
- `GET /profile`: Get details of the current logged-in user.
- `PUT /profile`: Update profile settings and password.

### Loans
- `POST /loan/apply`: File a loan application and generate AI findings.
- `GET /loan/my-loans`: Retrieve loans belonging to the current user.
- `GET /loan/{id}`: Inspect specific application details.
- `DELETE /loan/{id}`: Cancel a pending application.

### AI Engine
- `POST /ai/predict`: Standalone rule-based AI eligibility evaluation.
- `GET /history`: Get a log of AI history runs.

### Admin
- `GET /admin/stats`: Aggregate system KPIs, risk distributions, and trends.
- `GET /admin/users`: List registered accounts.
- `DELETE /admin/users/{id}`: Delete user and purge related records.
- `GET /admin/loans`: List all user loan applications.
- `PUT /admin/loan/{id}`: Approve or reject an active filing.
