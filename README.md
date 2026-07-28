# CareerConnect – Advanced Job Portal (MERN Stack)

CareerConnect is a production-ready, enterprise-grade Full-Stack MERN application designed with role-based dashboard metrics, a modular decoupled architecture, secure authentication, and a sleek Tailwind CSS design.

---

## 📂 Project Architecture

```text
job-portal/
├── backend/
│   ├── config/             # Database & Cloud Storage Connections
│   ├── controllers/        # Route Handlers (Auth, Jobs, Applications, Admin)
│   ├── middleware/         # Security (JWT) & Multer Buffering
│   ├── models/             # Mongoose Schemas (User, Job, Application)
│   ├── routes/             # REST Route mappings
│   ├── .env.example
│   ├── package.json
│   └── server.js           # Server Initializer
└── frontend/
    ├── src/
    │   ├── components/     # UI components (Navbar, JobCard, Protectors)
    │   ├── context/        # State context providers (Auth, Theme)
    │   ├── pages/          # Layout views (Landing, Job Board, Dashboards)
    │   ├── utils/          # Interceptor-equipped Axios clients
    │   ├── App.jsx         # Routes binder
    │   └── main.jsx
    ├── package.json
    ├── tailwind.config.js
    └── vite.config.js      # Vite package config
```

---

## 🚀 How to Run Locally

### 1. Configure Environmental Variables
Copy the backend environment variables template:
```bash
cd backend
cp .env.example .env
```
Fill in the configuration details inside the `.env` file:
*   `PORT`: Port to run backend server (default `5000`)
*   `MONGO_URI`: MongoDB connection string
*   `JWT_SECRET`: Secure cryptographic secret string
*   `CLOUDINARY_CLOUD_NAME`: Cloudinary cloud name
*   `CLOUDINARY_API_KEY`: Cloudinary API Key
*   `CLOUDINARY_API_SECRET`: Cloudinary API Secret

### 2. Launch the Backend Server
```bash
# In backend/ directory
npm install
npm run dev
```

### 3. Launch the React Client
Open a new terminal shell:
```bash
# In frontend/ directory
npm install
npm run dev
```
Open `http://localhost:5173` in your browser.

---

## 📬 Postman Testing Routes
Import these parameters into Postman to review server endpoints:
*   **POST** `/api/auth/register` (Registers seekers, recruiters, or admins)
*   **POST** `/api/auth/login` (Returns JWT bearer session tokens)
*   **GET** `/api/auth/profile` (Private: Returns details of the logged-in profile)
*   **PUT** `/api/auth/profile` (Private: Handles file upload updates for avatars and resumes)
*   **POST** `/api/jobs` (Private: Creates job postings)
*   **GET** `/api/jobs` (Public: Job search board with filters & pagination)
*   **POST** `/api/applications/apply/:jobId` (Private: Seeker submits application)
*   **PUT** `/api/applications/:id/status` (Private: Recruiter/Admin updates candidate review statuses)
*   **GET** `/api/admin/analytics` (Private: Admin dashboard metrics)

---

## 🌐 Production Deployment

### Separated Build (Recommended)
1.  **Frontend**: Deploy the `frontend/` directory to Vercel/Netlify. Set `VITE_API_URL` pointing to your deployed backend.
2.  **Backend**: Deploy the `backend/` directory to Render/Heroku. Input config secrets under environment variables. Set up CORS permission mapping.
