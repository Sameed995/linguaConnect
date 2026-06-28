# 🌍 LinguaConnect

A production-grade, real-time language exchange platform featuring integrated video calling and chat functionality. Built on the MERN stack, LinguaConnect connects language learners around the world for live conversation practice through text chat and video calls.

![MERN Stack](https://img.shields.io/badge/Stack-MERN-green)
![License](https://img.shields.io/badge/License-MIT-blue)

---

## Table of Contents

- [Overview](#-overview)
- [Tech Stack](#-tech-stack)
- [Key Features](#-key-features)
- [Project Structure](#-project-structure)
- [Getting Started](#-getting-started)
  - [Prerequisites](#prerequisites)
  - [Environment Variables](#environment-variables)
  - [Installation](#installation)
  - [Running Locally](#running-locally)
- [Deployment](#-deployment)
- [Acknowledgements](#-acknowledgements)

---

## Overview

LinguaConnect is a scalable real-time communication platform that lets users find language exchange partners and practice through:

- **Text chat** with typing indicators, reactions, threads, and image uploads
- **Video calls** with screen sharing, recording, and live reactions
- A **friend system** and onboarding flow to personalize the experience

The app is built using the **MERN** stack (MongoDB, Express, React, Node.js) and integrates **Stream's Chat & Video SDKs** to handle real-time messaging and video infrastructure at scale.

---

## 🚀 Tech Stack

**Frontend**
- React
- Tailwind CSS
- TanStack Query (data fetching & caching)
- Stream Video & Chat React SDK

**Backend**
- Node.js
- Express

**Database**
- MongoDB (MongoDB Atlas)

**Real-Time Infrastructure**
- Stream SDK (Video + Chat)

**Authentication**
- JWT (JSON Web Tokens)

---

## Key Features

### Authentication
- Secure JWT-based signup/login flows
- Protected routes on both client and server

### Real-Time Communication
- Instant messaging powered by Stream Chat
- Typing indicators, message reactions, and threads
- Image uploads within chat

### Video Calling
- One-on-one and group video calls
- Screen sharing
- Call recording
- Real-time in-call reactions

### User Experience
- Personalized onboarding flow
- Friend request system (send, accept, manage)
- Notifications for friend activity
- 32 customizable UI themes

### Safety & Reliability
- Protected API routes via auth middleware
- Robust API structure designed for testing

---

## 🛠 Project Structure

```
.
├── backend
│   ├── package.json
│   └── src
│       ├── controllers      # Route logic (auth, chat, user)
│       ├── lib              # DB connection, Stream client setup
│       ├── middleware       # Auth middleware
│       ├── models           # Mongoose models (User, FriendRequest)
│       ├── routes           # Express route definitions
│       └── server.js        # App entry point
│
├── frontend
│   ├── src
│   │   ├── components       # Reusable UI components
│   │   ├── constants        # App-wide constants (e.g. themes)
│   │   ├── hooks             # Custom React hooks (auth, login, signup, logout)
│   │   ├── lib                # Axios instance & API helper functions
│   │   ├── pages              # App pages (Chat, Call, Home, Login, etc.)
│   │   ├── store              # Zustand store (theme state)
│   │   └── main.jsx
│   ├── tailwind.config.js
│   └── vite.config.js
│
└── package.json              # Root-level scripts (build/deploy)
```

### Backend Breakdown

| Layer | Responsibility |
|---|---|
| `controllers/auth.controller.js` | Signup, login, logout, JWT issuance |
| `controllers/user.controller.js` | Onboarding, friend requests, user discovery |
| `controllers/chat.controller.js` | Stream chat token generation |
| `models/User.js` | User schema (profile, language preferences, etc.) |
| `models/FriendRequest.js` | Friend request schema & status tracking |
| `middleware/auth.middleware.js` | Route protection via JWT verification |
| `lib/db.js` | MongoDB connection setup |
| `lib/stream.js` | Stream SDK client initialization |

### Frontend Breakdown

| Layer | Responsibility |
|---|---|
| `pages/SignUpPage.jsx` / `LoginPage.jsx` | Auth flows |
| `pages/OnboardingPage.jsx` | First-time user setup |
| `pages/HomePage.jsx` | Friend discovery & friend requests |
| `pages/ChatPage.jsx` | Real-time messaging (Stream Chat) |
| `pages/CallPage.jsx` | Video calling (Stream Video) |
| `pages/NotificationsPage.jsx` | Friend request notifications |
| `hooks/` | TanStack Query hooks for auth/session state |
| `store/useThemeStore.js` | Theme persistence & switching |

---

## ⚙️ Getting Started

### Prerequisites

- [Node.js](https://nodejs.org/) (v18+ recommended)
- A [MongoDB Atlas](https://www.mongodb.com/atlas) account/cluster
- A [Stream](https://getstream.io/) account (for Chat & Video API keys)

### Environment Variables

Create a `.env` file inside the `backend` directory:

```env
PORT=5001
MONGO_URI=your_mongodb_atlas_connection_string
JWT_SECRET_KEY=your_jwt_secret
STREAM_API_KEY=your_stream_api_key
STREAM_API_SECRET=your_stream_api_secret
NODE_ENV=development
```

Create a `.env` file inside the `frontend` directory:

```env
VITE_STREAM_API_KEY=your_stream_api_key
```

>  Never commit your `.env` files. Make sure they're listed in `.gitignore`.

### Installation

Clone the repository:

```bash
git clone https://github.com/Sameed995/linguaConnect.git
cd linguaConnect
```

Install dependencies for backend, frontend, and root:

```bash
npm install        # installs root-level dependencies
cd backend && npm install
cd ../frontend && npm install
```

### Running Locally

**Start the backend:**

```bash
cd backend
npm run dev
```

**Start the frontend:**

```bash
cd frontend
npm run dev
```

The frontend will typically run on `http://localhost:5173` and the backend on `http://localhost:5001` (or whichever ports you've configured).

---

## Deployment

LinguaConnect is configured for deployment on **[Render](https://render.com/)**, using a single web service that builds both the frontend and backend.

**Root `package.json` build script (example):**

```json
{
  "scripts": {
    "build": "npm install --prefix backend && npm install --prefix frontend && npm run build --prefix frontend",
    "start": "npm run start --prefix backend"
  }
}
```

**Render Configuration:**

| Setting | Value |
|---|---|
| Build Command | `npm run build` |
| Start Command | `npm run start` |
| Environment | Node |

In production, the Express server serves the built frontend (`frontend/dist`) as static files, so the entire app runs from a single deployed service. Make sure all required environment variables (Mongo URI, JWT secret, Stream API keys) are set in your Render dashboard.

---

## Future Improvements

LinguaConnect is under active development. Planned enhancements include:

- **Email OTP Verification** — Verify user emails via a one-time password sent at signup, reducing fake accounts and improving trust.
- **Password Reset Workflow** — Allow users to securely reset forgotten passwords via an emailed reset link or OTP, with token expiry handling.
- **Two-Factor Authentication (2FA)** — Optional extra login security layer for users.
- **Rate Limiting & Brute-Force Protection** — Throttle login/signup attempts to prevent abuse.
- **Profile Customization** — Profile pictures, bios, and language proficiency badges.
- **In-App Notifications (Real-Time)** — Push-style real-time notifications instead of polling.
- **Group Language Practice Rooms** — Multi-user video rooms focused on specific languages.
- **Automated Testing Suite** — Unit and integration tests for backend routes and React components (Jest/Vitest + Supertest).
- **CI/CD Pipeline** — GitHub Actions for automated linting, testing, and deployment on push.
- **Admin Dashboard** — Moderation tools for reported users/content.

---

## Acknowledgements

<!-- - Project inspired by and built while following [this tutorial](https://youtu.be/ZuwigEmwsTM). -->
- Real-time chat & video powered by [Stream](https://getstream.io/).
- UI theming powered by [Tailwind CSS](https://tailwindcss.com/) and [DaisyUI](https://daisyui.com/).

---

## License

This project is licensed under the MIT License — feel free to use, modify, and build upon it.