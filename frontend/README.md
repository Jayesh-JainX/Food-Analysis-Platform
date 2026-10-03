# Wellness AI Lens - Frontend Application

<div align="center">

![React](https://img.shields.io/badge/React-18.3+-blue?style=for-the-badge&logo=react)
![TypeScript](https://img.shields.io/badge/TypeScript-5.9+-blue?style=for-the-badge&logo=typescript)
![Vite](https://img.shields.io/badge/Vite-8.3+-646CFF?style=for-the-badge&logo=vite)
![Tailwind CSS](https://img.shields.io/badge/Tailwind_CSS-3.4+-38B2AC?style=for-the-badge&logo=tailwind-css)
![Supabase](https://img.shields.io/badge/Supabase-Auth%20%26%20DB-green?style=for-the-badge&logo=supabase)

**Modern, Responsive AI-Powered Health & Food Analysis Web Application**

</div>

---

## 🌟 Overview

The **Wellness AI Lens Frontend** is a feature-rich, high-performance web application designed to help users track nutrition, analyze food items using computer vision, manage health goals, search medical condition recommendations, and explore tailored exercise routines. Built with **React 18**, **TypeScript**, **Vite**, and **Tailwind CSS**, it features a responsive, accessible interface with real-time updates and seamless state management.

---

## ✨ Key Features & Application Modules

### 🍎 **AI Food Scanner & Detail Analysis (`/scanner`, `/scan/:id`)**

- **Multimodal Scanning**: Upload food images via drag-and-drop, direct file selection, camera capture, or image URLs.
- **Detailed Nutritional Profiles**: View macronutrient distribution, calorie density, fiber, sodium, and sugar metrics.
- **Health Score & Advisories**: Automated health scoring with ingredient alerts and allergen highlights.
- **Interactive Scan History (`/history`)**: Browse, search, filter, and review previous food scan history.

### 🤖 **AI Chat Assistant**

- **Real-Time Guidance**: Interactive chat assistant providing instant nutrition advice and health guidance.
- **Context-Aware Responses**: Integrates active food scan data to answer specific food composition questions.
- **Mobile-Optimized Interface**: Fully responsive slide-over chat with daily message quota tracking and visual loading states.

### 🏥 **Comprehensive Disease Search (`/diseases`)**

- **Multi-Modal Querying**: Search medical conditions by disease name, symptoms, or category tags.
- **Dual Medicine Approach**: Access treatment options covering both modern **Allopathic** and traditional **Ayurvedic** practices.
- **Detailed Health Guides**: Complete information on symptoms, risk factors, dietary do's and don'ts, and lifestyle management.
- **Category Tag Filters**: Filter by Respiratory, Chronic, Viral, Digestive, Cardiovascular, and Infection categories.

### 🎯 **Goal Planner & Progress Tracker (`/goal-planner`)**

- **Flexible Fitness Goals**: Support for Fat Loss, Muscle Gain, Lean Transformation, Six-Pack Abs, Strength Training, and Marathon Prep.
- **Milestones & Habit Streaks**: Break long-term objectives down into daily and weekly actionable milestones with streak counters.
- **Progress Metrics & Photo Log**: Log body weight, measurements, and track body transformation with before/after photo comparisons.

### 🏋️ **Exercise & Fitness Library (`/exercise`, `/exercise/:id`)**

- **Searchable Workouts**: Filter exercises by category (Cardio, Strength, Flexibility), targeted muscle group, and difficulty level.
- **Execution Instructions**: Detailed step-by-step guidance, form tips, and required equipment.

### 📊 **Nutrition Tracking & Analytics (`/nutrition`, `/analytics`)**

- **Daily Macro Goals**: Log daily meals and track intake against customizable caloric and nutrient goals.
- **Visual Analytics**: Interactive charts powered by `Recharts` tracking nutritional trends over time.

### 🔐 **Authentication & Settings (`/signin`, `/signup`, `/settings`, `/profile`)**

- **Supabase Authentication**: Email/Password flow with confirmation and Google OAuth 2.0 integration.
- **Password Visibility Controls**: Password show/hide toggle icons across all authentication and password reset forms.
- **Personalized Dashboards**: Customizable dashboard layouts (Compact, Standard, Detailed) and dark/light theme switching.

---

## 🛠️ Tech Stack

- **Core Framework**: React 18.3, TypeScript 5.9, Vite 8.3
- **Styling & UI**: Tailwind CSS 3.4, Tailwind Animate, Class Variance Authority (CVA)
- **UI Components**: Radix UI Primitives (Avatar, Dialog, Popover, Progress, Radio Group, Select, Slider, Switch, Tabs, Toast, Tooltip)
- **Icons & Animation**: Lucide React, Framer Motion
- **State & Data Fetching**: TanStack React Query v5, React Router DOM v7
- **Data Visualization & PDF Export**: Recharts, jsPDF, jsPDF-AutoTable
- **Backend Services**: Supabase (`@supabase/supabase-js` v2.49)
- **Notifications**: Sonner

---

## 🚀 Installation & Setup

1. **Navigate to the Frontend Directory**:

   ```bash
   cd frontend
   ```

2. **Install Dependencies**:

   ```bash
   npm install
   ```

3. **Configure Environment Variables**:
   Create a `.env` file in `frontend/.env`:

   ```env
   VITE_SUPABASE_URL=your_supabase_project_url
   VITE_SUPABASE_ANON_KEY=your_supabase_anon_key
   VITE_BACKEND_URL=http://localhost:3000
   ```

4. **Start Development Server**:
   ```bash
   npm run dev
   ```
   _The app will open automatically at `http://localhost:5173`._

---

## 📜 Available Scripts

- `npm run dev` - Launches Vite development server with Hot Module Replacement (HMR).
- `npm run build` - Compiles TypeScript and builds optimized production assets in `dist/`.
- `npm run type-check` - Runs TypeScript type checker without emitting output.

---

## 📁 Project Structure

```
frontend/
├── public/                 # Static assets (images, icons, theme assets)
├── src/
│   ├── components/         # Reusable UI components
│   │   ├── auth/           # Auth forms, Google OAuth, password toggles
│   │   ├── dashboard/      # Customizable dashboard widgets
│   │   ├── goal-planner/   # Goal management, milestones & photo log
│   │   ├── layout/         # Header, Navigation, Footer & Layout wrappers
│   │   ├── nutrition/      # Meal tracking & macro progress components
│   │   ├── scanner/        # Image dropzone, camera scanner & scan cards
│   │   ├── shared/         # Reusable widgets, headers & toast notifications
│   │   └── ui/             # Radix UI primitives & styled elements
│   ├── context/            # React Context providers (AuthContext, ThemeContext)
│   ├── hooks/              # Custom hooks (useScanner, useTheme, useGoals)
│   ├── pages/              # Application routes & page views
│   ├── services/           # Supabase client & REST API service modules
│   ├── utils/              # Helper functions, formatters & validators
│   ├── App.tsx             # Root router configuration
│   └── main.tsx            # App entry point
├── supabase/               # Main database schema (`schema.sql`, `cron.sql`)
├── goalplanner.sql         # Goal planner SQL migration script
├── netlify.toml            # Netlify deployment setup
├── vercel.json             # Vercel deployment setup
├── vite.config.ts          # Vite configuration
└── package.json            # Frontend package dependencies & scripts
```

---

## ☁️ Deployment

### Deployment to Vercel

```bash
npm run build
vercel --prod
```

### Deployment to Netlify

The repository includes a pre-configured `netlify.toml` for seamless client-side single-page app routing:

```bash
netlify deploy --prod
```

---

## 📄 License

This project is licensed under the **MIT License**.
