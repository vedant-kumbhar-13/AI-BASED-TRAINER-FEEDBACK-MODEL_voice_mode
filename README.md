# AI-Based Trainer & Feedback Model 🎯

<div align="center">

![AI Trainer Banner](https://img.shields.io/badge/AI-Powered-blueviolet?style=for-the-badge&logo=openai&logoColor=white)
![React](https://img.shields.io/badge/React-19.2.0-61DAFB?style=for-the-badge&logo=react&logoColor=white)
![Django](https://img.shields.io/badge/Django-4.2-092E20?style=for-the-badge&logo=django&logoColor=white)
![TypeScript](https://img.shields.io/badge/TypeScript-5.9-3178C6?style=for-the-badge&logo=typescript&logoColor=white)
![TailwindCSS](https://img.shields.io/badge/Tailwind-3.4-38B2AC?style=for-the-badge&logo=tailwindcss&logoColor=white)

An intelligent training platform that leverages AI to conduct mock interviews, provide personalized feedback, and help users master aptitude concepts through interactive learning.

[Features](#-features) • [Tech Stack](#-tech-stack) • [Installation](#-installation) • [Usage](#-usage) • [Project Structure](#-project-structure)

</div>

---

## ✨ Features

### 🎙️ AI-Powered Mock Interviews

- **Voice-Enabled Interactions** - Speech-to-Text (Whisper) and Text-to-Speech capabilities
- **Dynamic Question Generation** - AI generates relevant interview questions based on resume and job role
- **Real-time Feedback** - Get unbiased, constructive feedback on your responses
- **Performance Analytics** - Track your interview performance trends over time

### 📚 Aptitude Training Module

- **5 Core Topics** - Percentage, Number Series, Profit & Loss, Ratio & Proportion, Time & Work
- **Video Tutorials** - Embedded YouTube lectures for each topic
- **Interactive Quizzes** - Test your understanding with topic-wise assessments
- **Progress Tracking** - Monitor your learning journey with detailed analytics

### 📊 Personalized Dashboard

- **Performance Metrics** - Visual representation of your progress
- **Interview History** - Review past interview sessions
- **Aptitude Scores** - Track quiz scores and improvement over time
- **Resume Analysis** - AI-powered keyword extraction from your resume

### 🔐 User Authentication

- **Secure JWT Authentication** - Token-based authentication system
- **User Profile Management** - Personalized user profiles with avatar support
- **Session Management** - Secure session handling

---

## 🛠️ Tech Stack

### Frontend

| Technology      | Purpose            |
| --------------- | ------------------ |
| React 19        | UI Library         |
| TypeScript      | Type Safety        |
| Vite            | Build Tool         |
| Tailwind CSS    | Styling            |
| Zustand         | State Management   |
| React Router v7 | Navigation         |
| Recharts        | Data Visualization |
| Axios           | HTTP Client        |
| Lucide React    | Icons              |

### Backend

| Technology            | Purpose                 |
| --------------------- | ----------------------- |
| Django 4.2            | Web Framework           |
| Django REST Framework | API Development         |
| Simple JWT            | Authentication          |
| Google Generative AI  | AI Interview & Feedback |
| Groq                  | LLM Integration         |
| gTTS                  | Text-to-Speech          |
| Librosa               | Audio Processing        |
| Celery + Redis        | Task Queue              |
| SQLite                | Database                |

---

## 📦 Installation

### Prerequisites

- **Node.js** >= 18.x
- **Python** >= 3.10
- **pip** (Python package manager)
- **Git**

### Clone the Repository

```bash
git clone https://github.com/vedant-kumbhar-13/AI-BASED-TRAINER-FEEDBACK-MODEL.git
cd AI-BASED-TRAINER-FEEDBACK-MODEL
```

### Backend Setup

1. **Navigate to backend directory**

   ```bash
   cd ai-trainer/backend
   ```

2. **Create and activate virtual environment**

   ```bash
   # Windows
   python -m venv venv
   venv\Scripts\activate

   # Linux/Mac
   python3 -m venv venv
   source venv/bin/activate
   ```

3. **Install dependencies**

   ```bash
   pip install -r requirements.txt
   ```

4. **Configure environment variables**

   Create a `.env` file in the backend directory:

   ```env
   SECRET_KEY=your-django-secret-key
   DEBUG=True
   GEMINI_API_KEY=your-google-gemini-api-key
   GROQ_API_KEY=your-groq-api-key
   ```

5. **Run database migrations**

   ```bash
   python manage.py migrate
   ```

6. **Start the backend server**
   ```bash
   python manage.py runserver
   ```
   The backend API will be available at `http://localhost:8000`

### Frontend Setup

1. **Navigate to frontend directory**

   ```bash
   cd ai-trainer/frontend
   ```

2. **Install dependencies**

   ```bash
   npm install
   ```

3. **Start the development server**
   ```bash
   npm run dev
   ```
   The frontend will be available at `http://localhost:5173`

---

## 🚀 Usage

1. **Register/Login** - Create an account or login to access the platform
2. **Upload Resume** - Upload your resume for AI analysis and keyword extraction
3. **Start Interview** - Begin an AI-powered mock interview session
4. **Learn Aptitude** - Access video tutorials and take quizzes on various topics
5. **Track Progress** - View your performance analytics on the dashboard

---

## 📁 Project Structure

```
AI-BASED-TRAINER-FEEDBACK-MODEL/
├── ai-trainer/
│   ├── frontend/                 # React + TypeScript Frontend
│   │   ├── src/
│   │   │   ├── components/       # Reusable UI components
│   │   │   ├── pages/            # Page components
│   │   │   ├── services/         # API service functions
│   │   │   ├── stores/           # Zustand state stores
│   │   │   ├── types/            # TypeScript type definitions
│   │   │   └── data/             # Static data files
│   │   ├── public/               # Static assets
│   │   └── package.json
│   │
│   └── backend/                  # Django REST API Backend
│       ├── accounts/             # User authentication
│       ├── apps/                 # Application modules
│       │   └── interview/        # AI interview module
│       ├── aptitude/             # Aptitude module
│       ├── dashboard/            # Dashboard analytics
│       ├── learning/             # Learning module
│       ├── media/                # User uploads
│       ├── utils/                # Utility functions
│       ├── manage.py
│       └── requirements.txt
│
└── data_set/                     # Training data files
    └── Aptitude_Final.xlsx       # Aptitude topics data
```

---

## 🔧 API Endpoints

### Authentication

| Method | Endpoint                   | Description       |
| ------ | -------------------------- | ----------------- |
| POST   | `/api/auth/register/`      | User registration |
| POST   | `/api/auth/login/`         | User login        |
| POST   | `/api/auth/token/refresh/` | Refresh JWT token |

### Interview

| Method | Endpoint                  | Description               |
| ------ | ------------------------- | ------------------------- |
| POST   | `/api/interview/start/`   | Start interview session   |
| POST   | `/api/interview/respond/` | Submit interview response |
| GET    | `/api/interview/history/` | Get interview history     |

### Dashboard

| Method | Endpoint                      | Description             |
| ------ | ----------------------------- | ----------------------- |
| GET    | `/api/dashboard/stats/`       | Get user statistics     |
| GET    | `/api/dashboard/performance/` | Get performance metrics |

---

## 🤝 Contributing

Contributions are welcome! Please follow these steps:

1. Fork the repository
2. Create a feature branch (`git checkout -b feature/amazing-feature`)
3. Commit your changes (`git commit -m 'Add amazing feature'`)
4. Push to the branch (`git push origin feature/amazing-feature`)
5. Open a Pull Request

---

## 📝 License

This project is licensed under the MIT License - see the [LICENSE](LICENSE) file for details.

---

## 👤 Author

**Vedant Kumbhar**

- GitHub: [@vedant-kumbhar-13](https://github.com/vedant-kumbhar-13)

---

<div align="center">

Made with ❤️ for better learning experiences

⭐ Star this repository if you find it helpful!

</div>
