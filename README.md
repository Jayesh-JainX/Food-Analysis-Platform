# Wellness AI Lens - Food Analysis Platform

<div align="center">

![Wellness AI Lens](https://img.shields.io/badge/Wellness-AI%20Lens-green?style=for-the-badge&logo=health)
![React](https://img.shields.io/badge/React-18.3+-blue?style=for-the-badge&logo=react)
![TypeScript](https://img.shields.io/badge/TypeScript-5.9+-blue?style=for-the-badge&logo=typescript)
![Vite](https://img.shields.io/badge/Vite-8.3+-646CFF?style=for-the-badge&logo=vite)
![Express](https://img.shields.io/badge/Express-4.22+-000000?style=for-the-badge&logo=express)
![Supabase](https://img.shields.io/badge/Supabase-Database-green?style=for-the-badge&logo=supabase)

**AI-Powered Food Analysis, Nutrition Tracking & Health Intelligence Platform**

[Live Demo](#) • [Documentation](#) • [Report Bug](#) • [Request Feature](#)

</div>

---

## 🌟 Overview

**Wellness AI Lens** is an advanced AI-powered food analysis and health management platform designed to help users make informed nutritional and lifestyle decisions. By leveraging modern computer vision and multimodal LLM intelligence via Hugging Face Inference API, the platform enables users to scan food items, retrieve accurate nutritional breakdowns, track fitness goals, explore disease management strategies, and access tailored exercise routines.

---

## ✨ Key Features

### 🍎 **AI Food Analysis & Vision Scanning**

- **Image & URL Analysis**: Analyze food items using camera uploads or direct image URLs.
- **Nutritional Breakdown**: Real-time identification of macronutrients (protein, carbs, fat) and micronutrients (calories, sodium, fiber, sugar).
- **Health Score Algorithm**: Automated health scoring based on nutritional density and ingredient composition.
- **Allergen & Ingredient Detection**: Highlighting potential allergens and health advisories.
- **Scan History & Logs**: Complete log of past food scans with quick access to previous analysis details.

### 🤖 **AI Nutrition Assistant**

- **Interactive Health Chat**: Ask questions about scanned food, dietary choices, or general wellness.
- **LLM Powered**: Driven by Hugging Face Inference SDK using `meta-llama/Llama-4-Scout-17B-16E-Instruct`.
- **Context-Aware Recommendations**: Passes food scan context into chat queries for customized advice.
- **Rate Limited & Responsive**: Structured token control and responsive mobile chat interface.

### 🏥 **Disease & Symptom Medical Search**

- **Multi-Modal Search**: Search by disease name, symptoms, or category tags.
- **Dual Treatment Perspectives**: Information covering both modern **Allopathic** and traditional **Ayurvedic** options.
- **Comprehensive Profiles**: Complete insights into symptoms, causes, dietary recommendations, and lifestyle tips.
- **Tag-Based Filtering**: Filter by categories such as Respiratory, Chronic, Viral, Cardiovascular, and Digestive.

### 🎯 **Goal Planner & Progress Tracker**

- **Multi-Objective Goals**: Fat loss, muscle gain, lean body transformation, marathon training, and custom fitness objectives.
- **Milestone Management**: Track progress via daily and weekly targets.
- **Habit & Streak Tracking**: Build and maintain healthy habits with gamified streak tracking.
- **Photo Progress**: Before/after photo comparison log with detailed notes.

### 🏋️ **Exercise & Fitness Library**

- **Comprehensive Database**: Detailed exercise guides with category filters (Cardio, Strength, Flexibility, Bodyweight).
- **Equipment & Target Muscles**: Filter by body part, difficulty level, and required equipment.
- **Step-by-Step Instructions**: Clear execution steps and safety tips for each exercise.

### 🔐 **Authentication & User Management**

- **Secure Auth Flow**: Email/Password authentication with confirmation workflow.
- **Google OAuth Integration**: Direct sign-in/up via Google OAuth with automatic user profile creation.
- **Password Visibility Toggles**: Integrated show/hide password controls across all auth forms.
- **Session Security**: Session persistence and automatic profile sync powered by Supabase Auth.

---

## 🏗️ Project Architecture & Structure

```
Food-Analysis/
├── backend/                  # Node.js & Express AI Backend API
│   ├── config/               # Server configurations & environment helpers
│   ├── utils/                # Helper utilities
│   ├── index.js              # Express server, Multer upload & Hugging Face SDK
│   ├── vercel.json           # Serverless deployment configuration
│   └── package.json          # Backend dependencies
├── frontend/                 # React 18 + TypeScript + Vite Frontend App
│   ├── src/
│   │   ├── components/       # UI components (auth, scanner, goal-planner, layout, etc.)
│   │   ├── context/          # React Context providers (AuthContext, ThemeContext)
│   │   ├── hooks/            # Custom React hooks (useScanner, useTheme, etc.)
│   │   ├── pages/            # Application pages & routes (Scanner, Diseases, Exercise, etc.)
│   │   ├── services/         # API integrations & Supabase client services
│   │   └── utils/            # Helper utilities and formatters
│   ├── public/               # Public assets (icons, images)
│   ├── supabase/             # Database schemas (schema.sql, cron.sql)
│   ├── goalplanner.sql       # Goal planner SQL migration script
│   ├── netlify.toml          # Netlify build configuration
│   ├── vercel.json           # Vercel deployment configuration
│   ├── vite.config.ts        # Vite configuration
│   └── package.json          # Frontend dependencies
└── README.md                 # Project Documentation
```

---

## 🛠️ Tech Stack

### **Frontend**

- **Framework**: React 18.3, TypeScript 5.9, Vite 8.3
- **Styling**: Tailwind CSS, Tailwind Animate, Class Variance Authority (CVA)
- **UI Components**: Radix UI Primitives, Lucide React Icons, Framer Motion
- **State & Data Handling**: TanStack React Query v5, React Router DOM v7
- **Data Visualization & Export**: Recharts, jsPDF, jsPDF-AutoTable
- **Notifications & Theme**: Sonner, Next-Themes

### **Backend**

- **Runtime**: Node.js (v18+)
- **Framework**: Express.js 4.22
- **AI Processing**: `@huggingface/inference` (`meta-llama/Llama-4-Scout-17B-16E-Instruct` via Novita)
- **File Uploads**: Multer (Memory Storage for Serverless Compatibility)
- **Security & Utilities**: Helmet, Express Rate Limit, Cors, Axios, Dotenv

### **Database & Infrastructure**

- **Database**: Supabase PostgreSQL
- **Authentication**: Supabase Auth (Email/Password & Google OAuth)
- **Automated Tasks**: `pg_cron` for automated resets and scheduled notifications

---

## 🚀 Quick Start Guide

### Prerequisites

- **Node.js** (v18.0.0 or higher)
- **npm** or **yarn** / **bun**
- **Supabase Account** (for Auth & PostgreSQL database)
- **Hugging Face API Key** (for AI food recognition & chat)

---

### Step 1: Clone the Repository

```bash
git clone https://github.com/Jayesh-JainX/Food-Analysis.git
cd Food-Analysis
```

---

### Step 2: Set Up Backend

1. Navigate to the `backend` directory:

   ```bash
   cd backend
   npm install
   ```

2. Create a `.env` file in `backend/.env`:

   ```env
   PORT=3000
   HF_API_KEY=your_hugging_face_api_key
   ```

3. Start the backend development server:
   ```bash
   npm start
   ```
   _The server will run on `http://localhost:3000`._

---

### Step 3: Set Up Frontend

1. Open a new terminal and navigate to the `frontend` directory:

   ```bash
   cd frontend
   npm install
   ```

2. Create a `.env` file in `frontend/.env`:

   ```env
   VITE_SUPABASE_URL=your_supabase_project_url
   VITE_SUPABASE_ANON_KEY=your_supabase_anon_key
   VITE_BACKEND_URL=http://localhost:3000
   ```

3. Start the frontend development server:
   ```bash
   npm run dev
   ```
   _Access the web app at `http://localhost:5173`._

---

### Step 4: Database Setup (Supabase)

Run the SQL scripts located in `frontend/supabase/` and root `frontend/goalplanner.sql` in your Supabase SQL Editor:

1. `frontend/supabase/schema.sql` - Main database tables, RLS policies, and triggers.
2. `frontend/supabase/cron.sql` - Automated cron jobs for resetting daily limits and scheduled notifications.
3. `frontend/goalplanner.sql` - Database tables for goal planning, milestones, and habit tracking.

---

## 📡 Backend API Reference

| Method | Endpoint       | Description                                                 |
| :----- | :------------- | :---------------------------------------------------------- |
| `GET`  | `/`            | API status overview & available endpoints list              |
| `GET`  | `/health`      | Server uptime and health check status                       |
| `POST` | `/api/process` | Analyzes uploaded food image or image URL via AI model      |
| `POST` | `/api/chat`    | AI Chat completion endpoint with optional food scan context |

---

## 🤝 Contributing

Contributions are welcome! Please follow these steps to contribute:

1. **Fork the Repository**
2. **Create a Feature Branch**:
   ```bash
   git checkout -b feature/AmazingFeature
   ```
3. **Commit your Changes**:
   ```bash
   git commit -m 'Add some AmazingFeature'
   ```
4. **Push to the Branch**:
   ```bash
   git push origin feature/AmazingFeature
   ```
5. **Open a Pull Request**

---

## 📄 License

This project is licensed under the **MIT License**. See the `LICENSE` file for details.

---

<div align="center">

**Made with ❤️ for Hacktoberfest & Wellness Enthusiasts**

</div>
