# Stress-Shield (stress-sheild)

AI-powered real-time health monitoring system that detects stress levels, provides instant alerts, and delivers personalized recommendations (relaxation techniques, medication reminders, and rest scheduling) to support better well-being.

## Tech Stack

- **Frontend**: React + Vite + Tailwind CSS
- **Backend**: Node.js + Express + Socket.io
- **ML Service**: FastAPI + scikit-learn
- **Database**: Supabase (PostgreSQL)
- **Hosting**: Vercel (Frontend) + Render (Backend/ML)

## Local Development

### Prerequisites

- Node.js 18+
- Python 3.10+
- Supabase account

### Setup

1. Clone the repository
2. Copy `.env.example` to `.env` in both `backend` and `frontend` and fill the values
3. Run backend: `cd backend && npm install && node server.js`
4. Run frontend: `cd frontend && npm install && npm run dev`

## Notes

- Do NOT commit `.env` files — use `.env.example` to share required variables.
- The repository root already contains `.env.example` files for backend and frontend.
