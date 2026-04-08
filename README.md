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
- **Node.js**: Make sure you have Node installed (v18+ recommended).
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
5. Upload the `schema.sql` (or `ayurvedausers_full_dump.sql`) file located in the project's `database/` folder. Click **Go** at the bottom to import all the tables.

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
   JWT_SECRET=supersecretkey123
   GROQ_API_KEY=your_groq_api_key_here
   EMAIL_USER=your_email@gmail.com
   EMAIL_PASS=your_app_password
   DOCTOR_INVITE_CODE=AYURVEDA2026
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

---

## 🧑‍💻 Contributing
- Always verify you are on the latest `main` branch: `git pull origin main`
- Create feature branches before making massive changes.
- Never commit `.env` files.
