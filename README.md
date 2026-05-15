# CodeAlpha_LanguageTranslator 🌍

**AI Language Translator** built with Flask (Python), HTML, CSS, JavaScript, and `deep-translator`. This project is a complete full-stack web application developed as part of the CodeAlpha Artificial Intelligence Internship.

## 📋 Project Overview
The Language Translation Tool is a modern, responsive web application featuring a stunning Glassmorphism UI and fluid animations. It allows users to translate text seamlessly across multiple languages instantly using the Google Translator API via the `deep-translator` library and asynchronous Fetch API on the frontend.

## ✨ Features
- **Professional Full-Stack Architecture**: Python Flask Backend with HTML/CSS/JS Frontend.
- **Multi-Language Support**: Access to dozens of languages.
- **Auto Language Detection**: Automatically detects the source language.
- **Asynchronous Translation**: Dynamic fetching without page reload.
- **Text-to-Speech (TTS)**: Listen to the translated text using JavaScript SpeechSynthesis API.
- **Copy to Clipboard**: One-click copy functionality.
- **Local Translation History**: Keeps track of your recent translations in the browser's localStorage.
- **Character Counter**: Real-time counter for source text.
- **Modern Futuristic UI**: Dark theme, glassmorphism, animated background blobs, and smooth hover effects.

## 🛠️ Technologies Used
- **Backend**: Python, Flask, `deep-translator` (GoogleTranslator API)
- **Frontend**: HTML5, CSS3, JavaScript (Fetch API, Web Speech API)
- **Design**: FontAwesome Icons, Google Fonts (Inter)

## 📁 Folder Structure
```text
CodeAlpha_LanguageTranslator/
│
├── app.py                 # Main Flask Backend Server
├── requirements.txt       # Python Dependencies
├── README.md              # Documentation
│
├── templates/
│   └── index.html         # Frontend UI
│
└── static/
    ├── style.css          # Styling & Animations
    └── script.js          # Client-side Logic (API calls, TTS, History)
```

## 🚀 Installation Steps

1. **Clone the repository**
```bash
git clone https://github.com/yourusername/CodeAlpha_LanguageTranslator.git
cd CodeAlpha_LanguageTranslator
```

2. **Create a Virtual Environment (Optional but recommended)**
```bash
python -m venv venv
source venv/bin/activate  # On Windows use: venv\Scripts\activate
```

3. **Install Dependencies**
```bash
pip install -r requirements.txt
```

## 💻 How to Run the Project

1. Run the Flask development server:
```bash
python app.py
```
2. Open your web browser and navigate to: `http://127.0.0.1:5000/`

## 📸 Screenshots
*(Add your project screenshots here after running locally)*
- **Dashboard View**: Full futuristic dashboard with translation cards.
- **History View**: Showcasing local storage translation memory.

## 🌐 Deployment Instructions (Render / Heroku)
1. Add a `Procfile` containing: `web: gunicorn app:app` (You will need to run `pip install gunicorn`).
2. Push your code to GitHub.
3. Connect the repository to your hosting provider (e.g., Render) and deploy.

## 🔮 Future Improvements
- Integrate additional translation models (e.g., MarianMT or OpenAI).
- Support for document (PDF, TXT) translation.
- User authentication and cloud-synced translation history.

---
**Developed by UDAY KUMAR**  
*CodeAlpha Artificial Intelligence Internship*
