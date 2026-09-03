1. # **Clone and install dependencies**

### Setup

1. **Clone and install dependencies**

   ```bash
   git clone <repository-url>
   cd stress-shield-project

   # Install backend dependencies
   cd backend
   npm install

   # Install frontend dependencies
   cd ../frontend
   npm install

   # Install ML service dependencies
   cd ../ml-service
   pip install -r requirements.txt
   ```

2. **Environment Variables**

   - Copy `.env.example` to `.env` in backend and frontend directories
   - Fill in your Supabase credentials and JWT secret
   - For local development, use the default URLs

3. **Database Setup**

   - Create a Supabase project
   - Run the SQL migrations in `database/migrations.sql` (if provided)
   - Ensure tables: users, health_readings, alerts, interventions exist

4. **Start Services**

   ```bash
   # Terminal 1: ML Service
   cd ml-service
   python main.py

   # Terminal 2: Backend
   cd backend
   npm run dev

   # Terminal 3: Frontend
   cd frontend
   npm run dev
   ```

5. **Access the Application**
   - Frontend: http://localhost:5173
   - Backend API: http://localhost:5000
   - ML Service: http://localhost:8000
