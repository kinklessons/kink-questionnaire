# Kink Questionnaire Comparison Tool

A structured, privacy-first questionnaire platform designed to help users explore preferences, boundaries, and compatibility across consensual lifestyle interests.

> Goal: Enable clearer communication, self-reflection, and compatibility mapping through structured data.

---


---

## 🌐 Live Project

https://kinklessons.github.io/kink-questionnaire/

---

## 📌 Overview

KinkLessons is a dynamic questionnaire system that allows users to:

- Rate preferences on a 1–5 scale
- Explore structured categories of interests
- Generate a shareable encoded URL profile
- Compare compatibility between two participants (A/B model)
- Store data locally or in a shareable encoded format

The system is designed to be fully client-side with no backend dependencies.

---

## ⚙️ Features

### Questionnaire Engine
- Dynamic question rendering
- Category-based organization
- Scored responses per item

### Shareable Profiles
- Encodes responses directly into the URL
- No server or database required
- Easy to share between users

### Compatibility Scoring
- Weighted normalization model
- Converts raw responses into a 0–100% score
- Prevents score inflation and handles edge cases

### Storage Modes
- Local session fallback
- URL-encoded persistence mode
- Versioned datasets (e.g., questionsv1, questionsv2)

### Dual Profile Mode
- Compare two separate participants (A vs B)
- Useful for compatibility and communication frameworks

---

## 🧱 Tech Stack

- React (Vite)
- JavaScript / TypeScript
- Tailwind CSS
- shadcn/ui
- URL state encoding system

---

## 📂 Project Structure

src/
├── components/
├── pages/
├── data/
│   ├── questionsv1.js
│   ├── questionsv2.js
├── utils/
│   ├── scoring.js
│   ├── encoding.js
└── App.jsx

---

## 📈 Scoring Logic

The compatibility score is calculated using a normalized system:

- Each answer is mapped to a numeric value (1–5 scale)
- Total score is divided by maximum possible score
- Output is scaled into a percentage (0–100%)

Edge cases are handled to prevent invalid or inflated results.

---

## 🔐 Privacy Model

- No backend storage
- No analytics or tracking
- No external data transmission
- All data remains in the browser or encoded in the URL

---

## 🚧 Roadmap

- Improved category filtering system
- JSON export/import of profiles
- Enhanced mismatch highlighting
- Per-category compatibility breakdowns
- Mobile-first UI redesign improvements

---

## 🤝 Use Cases

- Personal self-reflection
- Partner communication support
- Compatibility exploration
- Structured preference mapping
- Educational discussions around consent and boundaries

---

## ⚠️ Disclaimer

This project is intended for consenting adults and focuses on structured communication and preference exploration. It is not a matchmaking service and does not store user data.

---

## 📜 License

MIT License (or your chosen license)

---

## 👤 Author

Built by kinklessons  
A personal project focused on structured exploration, communication, and compatibility modeling.

