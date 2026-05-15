# ❤️ Heart Disease Prediction App - HeartLens

A simple and intelligent **Heart Disease Prediction application** built with **React**, **FastAPI**, and **MongoDB** to analyze clinical parameters and predict heart disease risk. The application supports real-time predictions and persistent data storage using MongoDB.

<p align="center">
  <a href="https://care4heart.netlify.app/" target="_blank">
    <img src="https://img.shields.io/badge/Live-Demo-green?style=for-the-badge&logo=netlify" alt="Live Demo" />
  </a>
  <a href="https://github.com/deyjibo/heart-predictor-model">
    <img src="https://img.shields.io/badge/GitHub-Repo-black?style=for-the-badge&logo=github" alt="GitHub Repo" />
  </a>
</p>

## Live Demo

👉 Check out the live app:  
[HeartLens](https://medinauts.netlify.app/)

---

## Features

- Predict heart disease risk using a machine learning model  
- User-friendly form to enter clinical parameters  
- Real-time predictions via FastAPI backend  
- Fallback heuristic scoring if model prediction fails  
- Persistent storage using **MongoDB**  
- Export MongoDB data to CSV for developer analysis  

---

## Achievements

- Successfully integrated ML model with FastAPI  
- Connected React frontend with backend API  
- Implemented MongoDB for data persistence  
- Enabled CSV export for stored prediction data  

---

## Tech Stack

- **Frontend:** HTML, CSS, JavaScript, React  
- **Backend:** Python, FastAPI, Uvicorn  
- **Database:** MongoDB (NoSQL)  

---

## 🚀 Getting Started

Run it locally

```bash
### Run the Backend First
cd backend
python -m venv .venv
# Windows
.\.venv\Scripts\Activate.ps1
# Linux / macOS
source .venv/bin/activate
pip install -r requirements.txt
uvicorn uvicorn_app:app --reload

### Run the Frontend Next
cd frontend
npm install
npm start
