# Ayurvedic HomeDiet & Yoga Assistant

This is the official repository for the Ayurvedic HomeDiet & Yoga Assistant system. This application helps users take a Prakriti assessment, interact with an AI health assistant (powered by Gemini), get personalized Ayurvedic diet and yoga recommendations, and book appointments with Ayurvedic doctors.

## 🛠️ Tech Stack 

- **Frontend:** React, Vite, Tailwind CSS
- **Backend:** Node.js, Express.js
- **Database:** MySQL
- **AI Integrations:** Google Gemini API, Groq API

---

## 🚀 Setup & Installation Guide for the Team

Follow these steps precisely to get the project running locally without errors.

### 1. Prerequisites
- **Node.js**: Use Node.js 20.19+ or 22.12+.
- **XAMPP / WAMP**: Install XAMPP to run a local MySQL database.
- **Git**: Ensure Git is installed.

### 2. Clone the Repository
```bash
git clone <repository_url>
cd ayurveda-yoga-assistant
```

### 3. Database Setup (MySQL)
1. Open XAMPP and start the **Apache** and **MySQL** modules.
2. Go to [http://localhost/phpmyadmin/](http://localhost/phpmyadmin/).
3. Click on **New** and create a database named EXACTLY: `ayurvedausers`
4. Select the `ayurvedausers` database and go to the **Import** tab.
5. Upload `database/schema.sql` to create the tables. It contains schema only; add your own test data locally.

### 4. Backend Setup
The backend requires environment variables to connect to the database and use the AI models.

1. Open a terminal and navigate to the `server` directory:
   ```bash
   cd server
   ```
2. Install the dependencies:
   ```bash
   npm install
   ```
3. **Environment Setup (.env)**:
   Create a new file inside the `server/` folder called `.env`. (Do NOT commit this file).
   Paste the following inside `.env` and fill in the missing API keys:
   ```env
   PORT=5000
   DB_HOST=localhost
   DB_USER=root
   DB_PASS=
   DB_NAME=ayurvedausers
   GEMINI_API_KEY=your_gemini_api_key_here
   JWT_SECRET=generate_a_long_random_secret
   GROQ_API_KEY=your_groq_api_key_here
   EMAIL_USER=your_email@gmail.com
   EMAIL_PASS=your_app_password
   DOCTOR_INVITE_CODE=generate_a_private_invite_code
   CLIENT_URL=http://localhost:5173
   CLIENT_ORIGINS=http://localhost:5173
   DB_SSL=false
   ```
   *(Note: Ask the project owner for the specific API Keys if you don't have them).*

4. Start the backend server:
   ```bash
   npm start
   # or run with nodemon: npm run dev 
   ```
   *(The server should print `✅ MySQL connected successfully` and start on port 5000).*

### 5. Frontend Setup
1. Open a new terminal and navigate to the `client` directory:
   ```bash
   cd client
   ```
2. Install the frontend dependencies:
   ```bash
   npm install
   ```
3. Start the Vite development server:
   ```bash
   npm run dev
   ```
4. Follow the local link (usually `http://localhost:5173/`) in your browser to view the app!

### Deployment configuration

The frontend and backend can be hosted separately. Set `VITE_API_BASE_URL` in the frontend host to the backend API URL, including `/api` (for example, `https://your-backend.example/api`). In the backend host, set `CLIENT_URL` to the frontend URL and `CLIENT_ORIGINS` to the allowed frontend origin(s), comma-separated if there is more than one. Also configure the database connection and AI/email secrets as host environment variables. Set `DB_SSL=true` when using a cloud database that requires TLS (including TiDB Cloud Starter); keep it `false` for a local XAMPP database. Never put secrets in `client/.env` or any `VITE_` variable; frontend variables are public.

For local development, create `client/.env.local` with:

```env
VITE_API_BASE_URL=http://localhost:5000/api
```

Set `CLIENT_URL` and `CLIENT_ORIGINS` to the local frontend URL in `server/.env`. Use unique, randomly generated `JWT_SECRET` and `DOCTOR_INVITE_CODE` values in production. See `server/.env.example` for the backend variable names.

---

## 🧑‍💻 Contributing
- Always verify you are on the latest `main` branch: `git pull origin main`
- Create feature branches before making massive changes.
- Never commit `.env` files.
