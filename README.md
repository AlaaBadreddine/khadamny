# Khadamny - Phase 1 MVP

Khadamny is a career guidance platform for young people in Tunisia.

## Phase 1 scope
- React landing page and dashboard
- Flask backend API
- PDF CV upload
- Text extraction from uploaded CVs
- SQLite storage

## Project structure
- `frontend/` React + Tailwind (Vite)
- `backend/` Flask API + SQLite

## Run the backend
```powershell
cd backend
python -m venv .venv
.\.venv\Scripts\activate
pip install -r requirements.txt
python app.py
```

## Run the frontend
```powershell
cd frontend
npm install
npm run dev
```

The frontend expects the backend to be available at `http://127.0.0.1:5000`.

## VS Code one-click launch
- Open the Command Palette
- Run `Tasks: Run Task`
- Choose `Khadamny: Launch App`

You can also press `Ctrl+Shift+B` because the launch task is set as the default build task.
