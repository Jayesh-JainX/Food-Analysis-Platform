# Wellness AI Lens - Backend Service

<div align="center">

![Node.js](https://img.shields.io/badge/Node.js-18+-green?style=for-the-badge&logo=node.js)
![Express](https://img.shields.io/badge/Express-4.22+-000000?style=for-the-badge&logo=express)
![Hugging Face](https://img.shields.io/badge/Hugging%20Face-Inference%20SDK-FFD21E?style=for-the-badge&logo=huggingface)
![Vercel](https://img.shields.io/badge/Vercel-Deployment%20Ready-black?style=for-the-badge&logo=vercel)

**Express-based RESTful API server powering AI Food Analysis & Nutrition Assistant**

</div>

---

## 🌟 Overview

The **Wellness AI Lens Backend** is a high-performance Express server that acts as an intelligent bridge between the frontend web app and multimodal AI inference services. It leverages the **Hugging Face Inference SDK** running the `meta-llama/Llama-4-Scout-17B-16E-Instruct` model (via the Novita provider) to deliver food recognition, nutritional analysis, and interactive health Q&A.

---

## ✨ Features

- 📸 **Multimodal Food Processing**: Handles image uploads via `multer` memory storage or direct image URLs via `axios`.
- 🤖 **AI Chat Assistant**: Generates concise, context-aware responses to user nutrition questions.
- 🚀 **Serverless Ready**: Built with memory storage and exported Express handler for seamless deployment on Vercel.
- 🛡️ **Security & Validation**: Input validation, image content-type verification, CORS configuration, and security headers.
- 🩺 **Health Check Monitoring**: Real-time server status, uptime tracking, and environment inspection.

---

## 🛠️ Tech Stack

- **Runtime**: Node.js (v18+)
- **Web Framework**: Express.js (`v4.22.3`)
- **AI SDK**: `@huggingface/inference` (`v3.15.0`), `@huggingface/transformers` (`v4.3.0`)
- **AI Model**: `meta-llama/Llama-4-Scout-17B-16E-Instruct` (Novita provider)
- **File Handling**: `multer` (`v1.4.5-lts.1` - memory storage), `mime-types`
- **HTTP Client**: `axios` (`v1.20.0`)
- **Security & Rate Limiting**: `helmet`, `express-rate-limit`, `hpp`, `cors`
- **Testing**: `jest`, `supertest`

---

## 📡 API Endpoints

### 1. Root Information Endpoint

- **URL**: `GET /`
- **Description**: Returns API name, version, and endpoints summary.
- **Response**:
  ```json
  {
    "message": "Food Analysis API",
    "version": "1.0.0",
    "endpoints": {
      "health": "/health",
      "process": "/api/process",
      "chat": "/api/chat"
    }
  }
  ```

---

### 2. Server Health Check

- **URL**: `GET /health`
- **Description**: Checks server operational status and uptime.
- **Response**:
  ```json
  {
    "status": "healthy",
    "timestamp": "2026-10-03T15:35:15.000Z",
    "uptime": 124.5,
    "environment": "development"
  }
  ```

---

### 3. Food Image Analysis

- **URL**: `POST /api/process`
- **Content-Type**: `multipart/form-data` or `application/json`
- **Body Parameters**:
  - `prompt` (string, required): Analysis prompt / request.
  - `image` (file, optional): Food image file upload (max 10MB).
  - `imageUrl` (string, optional): Direct URL to a food image (used if `image` file is omitted).
- **Response**:
  ```json
  {
    "success": true,
    "result": "Structured AI analysis of the food image...",
    "analysis": {
      "extracted_text": "...",
      "nutrition": {
        "calories": 250,
        "protein": 12,
        "carbs": 30,
        "fat": 8,
        "sodium": 450,
        "fiber": 3,
        "sugar": 6
      },
      "ingredients": ["wheat flour", "vegetable oil", "salt"],
      "health_score": 65,
      "health_advice": "Moderate nutritional value."
    }
  }
  ```

---

### 4. AI Nutrition Chat

- **URL**: `POST /api/chat`
- **Content-Type**: `application/json`
- **Body Parameters**:
  - `prompt` (string, required): User question regarding nutrition/health.
  - `scanData` (object, optional): Recent scan data context for personalized answers.
- **Response**:
  ```json
  {
    "success": true,
    "result": "Concise AI response under 150 words.",
    "response": {
      "role": "assistant",
      "content": "..."
    }
  }
  ```

---

## 🚀 Installation & Setup

1. **Navigate to the Backend Directory**:

   ```bash
   cd backend
   ```

2. **Install Dependencies**:

   ```bash
   npm install
   ```

3. **Configure Environment Variables**:
   Create a `.env` file in `backend/.env`:

   ```env
   PORT=3000
   NODE_ENV=development
   HF_API_KEY=your_hugging_face_api_key
   ```

4. **Run the Development Server**:
   ```bash
   npm run dev # or npm start
   ```
   _The API will be available at `http://localhost:3000`._

---

## 📁 Directory Structure

```
backend/
├── config/              # Server configurations
├── public/              # Static files served by Express
├── utils/               # Utility helper functions
├── index.js             # Main Express application & routes
├── vercel.json          # Vercel serverless deployment config
├── .env.example         # Example environment variables template
└── package.json         # Dependencies and scripts
```

---

## ☁️ Deployment

### Vercel Deployment

The backend includes a `vercel.json` configuration file, making it ready for instant Vercel Serverless Function deployment:

```bash
vercel --prod
```

Ensure `HF_API_KEY` is added to the Environment Variables section in your Vercel Project Settings.

---

## 📄 License

This project is licensed under the **MIT License**.
