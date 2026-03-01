# 🧾 InvoiceAI — Conversational Invoice Generator

A production-ready MERN stack application that lets you **create invoices through an intelligent chat interface**, preview them in real-time, generate professional PDFs, and manage your business finances with a dedicated dashboard.

![MERN](https://img.shields.io/badge/MERN-Stack-green) ![License](https://img.shields.io/badge/License-MIT-blue) ![Aesthetics](https://img.shields.io/badge/Design-Premium-blueviolet)

## ✨ Key Features

- **💬 Conversational AI Builder** — Move away from tedious forms. Build invoices naturally through a modern chat interface.
- **👁️ Real-Time Live Preview** — Your invoice summary updates instantly as you provide details to the AI assistant.
- **📄 Professional PDF Engine** — Generate clean, industry-standard PDFs ready for your clients.
- **� Integrated Payments** — Collect payments faster with built-in Razorpay support (including a safe Mock Mode for testing).
- **� Business Analytics** — Track your revenue, paid vs. overdue invoices, and total clients at a glance.
- **�️ Admin Command Center** — Dedicated dashboard for administrators to monitor platform stats and manage users.
- **🌙 Premium Dark Mode** — A fully cohesive dark and light theme experience across every screen.
- **� Secure Auth** — JWT-based authentication with optional Google OAuth 2.0 integration.

## 🛠️ Tech Stack

| Layer      | Technology                                                                 |
| ---------- | -------------------------------------------------------------------------- |
| **Frontend** | React (Vite), Tailwind CSS, Framer Motion, Lucide Icons, Shadcn UI, Sonner |
| **Backend**  | Node.js, Express.js                                                        |
| **Database** | MongoDB with Mongoose                                                      |
| **Payment**  | Razorpay SDK                                                               |
| **Auth**     | Google OAuth 2.0, Passport.js, JWT                                         |
| **PDF**      | PDFKit / Invoice-Generator API integration                                 |

## 📁 Project Structure

```text
Inovice-generator/
├── client/                  # Frontend (React + Vite)
│   ├── src/
│   │   ├── components/      # UI, Layout, Card primitives
│   │   ├── pages/           # Landing, Dashboard, Chat, Auth, Admin
│   │   ├── context/         # Auth & Theme State Management
│   │   └── lib/             # API Axios instances & Utilities
├── server/                  # Backend (Node + Express)
│   ├── routes/              # API Route definitions
│   ├── controllers/         # Core business logic
│   ├── models/              # Mongoose Schemas
│   ├── services/            # Payment, PDF & Third-party integrations
│   └── middlewares/         # Auth, Admin & Error handling
└── README.md
```

## 🚀 Getting Started

### 1. Prerequisites
- **Node.js** ≥ 18
- **MongoDB** (Local or Atlas)
- **Google Cloud Console** (for OAuth)
- **Razorpay Account** (for payments)

### 2. Environment Setup

**Server (`server/.env`):**
```env
PORT=5000
MONGODB_URI=your_mongodb_uri
JWT_SECRET=your_secret

# Google OAuth
GOOGLE_CLIENT_ID=your_id
GOOGLE_CLIENT_SECRET=your_secret
GOOGLE_REDIRECT_URI=http://localhost:5000/api/auth/google/callback

# Razorpay
RAZORPAY_KEY_ID=your_key
RAZORPAY_KEY_SECRET=your_secret
RAZORPAY_WEBHOOK_SECRET=your_webhook_secret

# Third-Party APIs
INVOICE_GENERATOR_API_KEY=your_key
CLIENT_URL=http://localhost:5173
```

### 3. Installation & Launch

```bash
# Terminal 1: Install & Run Backend
cd server
npm install
npm run dev

# Terminal 2: Install & Run Frontend
cd client
npm install
npm run dev
```

## 📡 API Documentation

### 🔑 Authentication
| Method | Endpoint | Description |
|---|---|---|
| POST | `/api/auth/register` | Register new user |
| POST | `/api/auth/login` | Login with email/password |
| GET | `/api/auth/google` | Trigger Google OAuth |
| GET | `/api/auth/me` | Get current user (Auth Required) |
| POST | `/api/auth/logout` | Clear session (Auth Required) |

### 📝 Invoices (Auth Required)
| Method | Endpoint | Description |
|---|---|---|
| GET | `/api/invoices` | List your invoices |
| POST | `/api/invoices` | Create new invoice |
| GET | `/api/invoices/:id` | Get invoice details |
| PUT | `/api/invoices/:id` | Update invoice |
| DELETE | `/api/invoices/:id` | Delete invoice |
| POST | `/api/invoices/:id/generate-pdf` | Generate & get PDF link |
| POST | `/api/invoices/:id/send` | Email invoice to client |
| PATCH | `/api/invoices/:id/status` | Update payment status |

### 💳 Payments
| Method | Endpoint | Description |
|---|---|---|
| POST | `/api/payments/create-order` | Initialize Razorpay order (Auth) |
| POST | `/api/payments/verify` | Verify payment signature (Auth) |
| POST | `/api/payments/mock-verify` | Simulator for test mode (Auth) |
| POST | `/api/payments/webhook` | Direct Razorpay webhook hook |

### 💬 Chat & AI
| Method | Endpoint | Description |
|---|---|---|
| POST | `/api/chat/message` | Process conversational input |

### 📊 Analytics & Admin
| Method | Endpoint | Description |
|---|---|---|
| GET | `/api/analytics/summary` | Get user revenue stats (Auth) |
| GET | `/api/admin/stats` | Platform-wide stats (Admin Only) |
| GET | `/api/admin/users` | List all users (Admin Only) |

## 📄 License
MIT — Created with ❤️ for modern businesses.
