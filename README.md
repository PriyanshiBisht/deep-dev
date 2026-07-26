# DeepDev

A LeetCode-style platform for practicing frontend UI development. Solve real interview-style frontend challenges — build the UI, see it render live, and check your solution — all in an in-browser code editor.

🔗 **Live Demo:** deep-dev-seven.vercel.app
📦 **GitHub Repo:** https://github.com/PriyanshiBisht/deep-dev

---

## Features

- 🔐 **Authentication** — Signup, login, and logout with JWT-based auth and password hashing
- 🧩 **Challenge Library** —  interview-style frontend challenges (navbars, accordions, modals, and more), tagged by difficulty and topic
- 💻 **In-Browser Code Editor** — Monaco Editor (the engine behind VS Code) with separate HTML, CSS, and JS tabs
- ⚡ **Live Preview** — Your code renders instantly in a live preview pane as you type
- 🔄 **Reset Code** — Revert back to the challenge's starter code anytime
- 👀 **View Solution** — Peek at a reference solution when you're stuck
- ✅ **Progress Tracking** — Submitted challenges are marked as solved and reflected on your profile
- 👤 **Profile Dashboard** — View your solved challenge count, recently solved challenges, and edit your profile
- 📱 **Responsive Design** — Fully usable on mobile, tablet, and desktop

---

## Tech Stack

**Frontend**
- React (Vite)
- Tailwind CSS
- React Router
- Monaco Editor (`@monaco-editor/react`)

**Backend**
- Node.js + Express
- MongoDB + Mongoose
- JWT (authentication)
- bcrypt.js (password hashing)

**Deployment**
- Frontend: Vercel
- Backend: Render

---

## Getting Started (Local Setup)

### Prerequisites
- Node.js installed
- A MongoDB Atlas connection string

### 1. Clone the repo
```bash
git clone [Add your GitHub repo URL here]
cd deepdev
```

### 2. Backend Setup
```bash
cd server
npm install
```

Create a `.env` file in `server/`:
```
PORT=5000
MONGO_URI=your_mongodb_connection_string
JWT_SECRET=your_secret_key
```

Run the backend:
```bash
npm run dev
```

### 3. Frontend Setup
```bash
cd client
npm install
npm run dev
```

The app will be available at `http://localhost:5173`.

---



## Future Improvements

- Search & filter challenges by difficulty/tags
- Store challenges in the database instead of static dummy data
- Submission history and streak tracking
- AI-powered hints — get a contextual nudge (not the full solution) when stuck on a challenge
- AI-based code review — basic feedback on structure/best practices after submission
---

Built as a personal project to practice and showcase frontend development skills.
