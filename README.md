# 🚀 Premium 3D Interactive Portfolio Website

An ultra-modern,  Portfolio Website built with **React 19**, **Vite**, **Tailwind CSS v4**, **Framer Motion**, and a **Node.js + Express + MongoDB** backend.

Features smooth micro-animations, dynamic particle physics, customized cursor effects, keyboard command palette, AI recruiter assistant, live chat FAQ bot, GitHub stats dashboard, and full-stack REST API capabilities with auto-seeding.

---

## ✨ Features & Highlights

- 🎨 **Modern Aesthetics**: Built with futuristic glassmorphism, glowing gradients, particle backgrounds, and fluid Framer Motion animations.
- ⚡ **Lightning Fast**: Powered by Vite & React 19 for instantaneous builds and hot module replacement (HMR).
- 🤖 **AI Recruiter & Portfolio Chatbot**: Interactive assistants to answer recruiter questions and guide visitors through skills, experience, and projects.
- ⌨️ **Command Palette (`Ctrl+K` / `Cmd+K`)**: Quick navigation, theme toggles, and shortcut controls built right into the app.
- 📊 **GitHub Activity Dashboard**: Interactive statistics, commit activity, language breakdown, and top repositories.
- 📁 **Filterable Project Showcase**: Category filters, real-time search, interactive modal popups, live demo links, and GitHub source links.
- 🧠 **Categorized Skill Matrix**: Interactive skill proficiency indicators and tech stack breakdown.
- 📜 **Certifications & Achievements**: Dedicated showcases for verified credentials, awards, and hackathon victories.
- 📝 **Blog & Insights**: Article reader, reading time estimations, tag filtering, and detailed modals.
- 💬 **Interactive Contact Form**: Real-time form connected directly to the Express backend API.
- 🛠️ **Full-Stack REST Backend**: MongoDB integration via Mongoose with auto-seeding, data sync, and CRUD endpoints.

---

## 🛠️ Tech Stack

### **Frontend**
- **Framework**: [React 19](https://react.dev/)
- **Build Tool**: [Vite 8](https://vitejs.dev/)
- **Styling**: [Tailwind CSS v4](https://tailwindcss.com/)
- **Animations**: [Framer Motion](https://www.framer.com/motion/)
- **Icons**: [Lucide React](https://lucide.dev/)

### **Backend & Database**
- **Runtime**: [Node.js](https://nodejs.org/)
- **Web Framework**: [Express 5](https://expressjs.com/)
- **Database**: [MongoDB](https://www.mongodb.com/) (via [Mongoose](https://mongoosejs.com/))
- **Environment Handling**: [Dotenv](https://github.com/motdotla/dotenv)
- **CORS**: Express CORS middleware

---

## 📂 Project Structure

```text
├── server/                    # Node.js + Express backend
│   ├── models/                # Mongoose database schemas
│   ├── routes/                # API routes & controllers
│   ├── fix_db.js              # Database migration helper
│   ├── index.js               # Express server entrypoint & MongoDB connection
│   └── seedData.js            # Default portfolio seed data
├── src/                       # React Frontend application
│   ├── components/            # UI Components & interactive modules
│   │   ├── AIRecruiter.jsx    # Recruiter Q&A assistant
│   │   ├── AIShowcase.jsx     # AI/ML Project showcase
│   │   ├── About.jsx          # Bio & tech stack
│   │   ├── Achievements.jsx   # Honors & awards
│   │   ├── Blog.jsx           # Technical articles
│   │   ├── Certifications.jsx # Verified certificates
│   │   ├── ChatAssistant.jsx  # AI Chatbot FAQ helper
│   │   ├── CommandPalette.jsx # Ctrl+K navigation overlay
│   │   ├── Contact.jsx        # Contact form component
│   │   ├── Experience.jsx     # Career & education timeline
│   │   ├── GitHubDashboard.jsx# Real-time GitHub statistics
│   │   ├── Hero.jsx           # Hero banner with animations
│   │   ├── Nav.jsx            # Dynamic navigation bar
│   │   ├── ParticleField.jsx  # Interactive background canvas
│   │   ├── Projects.jsx       # Interactive portfolio projects
│   │   ├── Skills.jsx         # Categorized skills matrix
│   │   ├── Testimonials.jsx   # Client feedback
│   │   └── ThemeSwitcher.jsx  # Accent theme switcher
│   ├── api.js                 # Frontend API client service
│   ├── App.jsx                # Main layout composition & scroll logic
│   ├── index.css              # Global styles & Tailwind CSS setup
│   └── main.jsx               # React DOM rendering entrypoint
├── index.html                 # Main HTML entry file
├── render.yaml                # Render deployment configuration
├── vite.config.js             # Vite configuration with React & Tailwind plugins
└── package.json               # Dependencies & scripts
```

---

## 🚀 Getting Started

### Prerequisites

- **Node.js**: `v18.0.0` or higher
- **npm** / **pnpm** / **yarn**
- **MongoDB** *(Optional for local database mode)*: Local instance running at `mongodb://127.0.0.1:27017` or a [MongoDB Atlas](https://www.mongodb.com/cloud/atlas) cluster URI.

### Installation

1. **Clone the repository**:
   ```bash
   git clone https://github.com/teknarayan10y/Tek-Narayan-Portfolio.gitt
   cd Tek-Narayan-Portfolio
   ```

2. **Install dependencies**:
   ```bash
   npm install
   ```

3. **Configure Environment Variables**:
   Create a `.env` file in the root directory (or in `server/.env` for backend):

   ```env
   # Server Port
   PORT=5000

   # MongoDB Connection String
   MONGODB_URI=mongodb://127.0.0.1:27017/portfolio_db

   # Admin Auth Secret
   ADMIN_SECRET=
   ```

---

## ⚙️ Running the Application

### 1. Run Vite Development Server (Frontend)
```bash
npm run dev
```
The application will be accessible at: `http://localhost:5173` (or the port specified in terminal).

### 2. Run Express API Server (Backend)
```bash
npm run server
# OR
npm start
```
The Express backend will start at `http://localhost:5000`. On initial boot, it will automatically connect to MongoDB and seed the database with portfolio records.

### 3. Build for Production
```bash
npm run build
```
Generates production-ready static assets in the `dist` directory.

### 4. Preview Production Build
```bash
npm run preview
```

---

## 📡 API Endpoints Summary

The Express backend provides RESTful endpoints mounted under `/api`:

| Method | Endpoint | Description |
| :--- | :--- | :--- |
| **GET** | `/api/hero` | Retrieve Hero section data |
| **GET** | `/api/about` | Retrieve About section profile & info |
| **GET** | `/api/skills` | Retrieve categorized skill records |
| **GET** | `/api/projects` | Retrieve project listings |
| **GET** | `/api/experience` | Retrieve career & education timeline |
| **GET** | `/api/ai-showcase` | Retrieve AI/ML showcase items |
| **GET** | `/api/github` | Retrieve GitHub activity stats |
| **GET** | `/api/certifications` | Retrieve verified certificates |
| **GET** | `/api/achievements` | Retrieve awards and honors |
| **GET** | `/api/blog` | Retrieve blog articles |
| **GET** | `/api/testimonials` | Retrieve client reviews |
| **GET** | `/api/chat-faqs` | Retrieve AI Chatbot FAQ entries |
| **POST** | `/api/contact` | Submit contact form message |

---

## 🌐 Deployment

### Deploying to Render
This repository includes a `render.yaml` configuration for quick deployment on Render.
- **Build Command**: `npm install`
- **Start Command**: `node server/index.js`
- Set `MONGODB_URI` environment variable in your Render service settings.

### Deploying Frontend to Vercel / Netlify
- **Framework Preset**: Vite
- **Build Command**: `npm run build`
- **Output Directory**: `dist`

---

## 👨‍💻 Author

**Tek Narayan Yadav**
- Portfolio: Premium 3D Interactive Portfolio
- GitHub: [@TekNarayan](https://github.com/)

---

## 📄 License

This project is open-source and available under the [MIT License](LICENSE).
