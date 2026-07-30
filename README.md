# Md Moniruzzaman — Portfolio Website

A full-stack, dynamic developer portfolio built from scratch with a custom Node.js/Express backend, MongoDB Atlas database, and two separate frontends — a public-facing vanilla JS site and a React-based admin dashboard for content management.

**Live Site:** [my-profile-portfolio.vercel.app](https://my-profile-portfolio.vercel.app) <!-- update with real link -->

---

## ✨ Features

### Public Portfolio
- **Hero Section** — profile photo, rotating quote, quick tech tags, contact/social row with one-click email copy
- **About Section** — bio + quick facts cards
- **Tech Stack (3D Cube)** — an interactive, draggable 3D cube showcasing skills by category (Backend, Frontend, Database, Tools, Other), with tab navigation and auto-rotate
- **Projects** — dynamic project cards pulled from the database, with tech badges, live demo & GitHub links
- **Experience** — a 2-card sliding carousel with smooth navigation (dots + arrows)
- **Education** — timeline-style layout
- **Testimonials** — dynamically loaded client/peer testimonials
- **Contact Form** — sends messages directly to the backend, with live status feedback
- **Footer** — multi-column layout with quick links, social icons, and a gradient accent border
- **Floating Action Buttons** — Back-to-Top button and a Theme/Effects menu (Light/Dark mode + animated Rain/Snow overlays)
- Fully responsive, dark-themed UI with a custom **lavender-purple & olive-yellow** design system
- Accessibility touches — `aria-label`/`aria-expanded` on interactive controls, `prefers-reduced-motion` respected for animations

### Admin Dashboard
- Secure JWT-based authentication (protected routes)
- Full CRUD management for:
  - Skills (with category & proficiency)
  - Projects (with Cloudinary image upload)
  - Experience & Education entries
  - Testimonials
- Expandable/collapsible entry details with smooth transitions
- Clean, dark-themed control panel UI

---

## 🛠️ Tech Stack

**Frontend (Public Site)**
- HTML5, CSS3 (custom properties / CSS variables), Vanilla JavaScript
- CSS 3D transforms (Skills Cube), Canvas API (Rain/Snow effects)

**Admin Dashboard**
- React (Vite)
- React Router
- Fetch-based API layer

**Backend**
- Node.js, Express.js
- MongoDB Atlas + Mongoose
- JWT authentication & bcrypt password hashing
- Multer + Cloudinary (image uploads)

**Deployment**
- Backend → Render
- Public frontend & Admin dashboard → Vercel
- Database → MongoDB Atlas

---

## 📂 Project Structure

```
my-profile/
├── backend/                 # Express API server
│   ├── config/               # DB & Cloudinary config
│   ├── controllers/          # Route logic (skills, projects, experience, testimonials, contact, admin)
│   ├── middleware/           # Auth middleware
│   ├── models/                # Mongoose schemas
│   ├── routes/
│   └── server.js
│
├── admin-dashboard/          # React admin panel (Vite)
│   └── src/
│       ├── api/
│       ├── components/
│       ├── context/
│       └── pages/
│           ├── Dashboard.jsx
│           └── Login.jsx
│
└── frontend/                 # Public portfolio (vanilla JS)
    ├── css/style.css
    ├── js/script.js
    └── index.html
```

---

## 🚀 Getting Started

### Prerequisites
- Node.js (v18+)
- MongoDB Atlas account
- Cloudinary account (for image uploads)

### 1. Clone the repository
```bash
git clone https://github.com/shimul1725/my-profile-portfolio.git
cd my-profile-portfolio
```

### 2. Backend setup
```bash
cd backend
npm install
```
Create a `.env` file in `backend/`:
```env
MONGO_URI=your_mongodb_atlas_uri
JWT_SECRET=your_jwt_secret
CLOUDINARY_CLOUD_NAME=your_cloud_name
CLOUDINARY_API_KEY=your_api_key
CLOUDINARY_API_SECRET=your_api_secret
```
Run the server:
```bash
npm start
```

### 3. Admin dashboard setup
```bash
cd admin-dashboard
npm install
```
Create a `.env` file in `admin-dashboard/`:
```env
VITE_API_URL=http://localhost:5000/api
```
Run the dev server:
```bash
npm run dev
```

### 4. Public frontend
Simply open `frontend/index.html` in a browser, or serve it with any static server (e.g. VS Code Live Server). Update the `API_BASE_URL` constant in `frontend/js/script.js` to point to your backend.

---

## 🔀 Git Workflow

This project follows a standard feature-branch workflow for every change:

```bash
git checkout main
git pull
git checkout -b feature/feature-name

# ...develop & test...

git add .
git commit -m "feat: short description"
git checkout main
git merge feature/feature-name
git branch -d feature/feature-name
git push origin main
```

---

## 📬 Contact

**Md Moniruzzaman**
📍 Dortmund, Germany
📧 shimul.tu.dortmund@gmail.com
🔗 [GitHub](https://github.com/shimul1725) · [LinkedIn](https://www.linkedin.com/in/md-moniruzzaman1/)

---

*Built with a focus on understanding every layer of the stack — from database design to deployment.*