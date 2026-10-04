# YUNG DSA — Official Artist Website

Official digital platform and booking portal for **YUNG DSA** (Harsh Vijay Machare), Indian hip-hop artist and rapper representing Pune 06 and Yerwada.

---

## 🌟 Overview

This repository contains the source code for [yungdsa.com](https://yungdsa.com/), featuring:
- **Discography & Music Showcase**: Direct stream integration with Spotify API and YouTube embed player.
- **Visuals Gallery & Music Video Player**: High-definition video player modal with official music videos from Gully Gang Records, Sony Music India, and independent releases.
- **Management & Booking Engine**: Direct inquiry routing to management (`yungdsa06@gmail.com`) backed by FastAPI and MongoDB.
- **Official Press Package**: Built-in press kit generator, bio, approved media assets, and news features.
- **PWA & Search Engine Optimization**: Structured JSON-LD metadata for search engines and AI previews, Open Graph, Twitter Cards, responsive layout, dark aesthetic, and static noscript HTML pre-rendering.

---

## 🛠️ Architecture & Tech Stack

### Frontend
- **Framework**: React.js 18
- **Styling**: Vanilla CSS (Custom tokens, glassmorphism, responsive grid layout)
- **Icons**: Lucide React
- **Data Fetching & Toast**: Axios, `@tanstack/react-query`, Sonner
- **Analytics**: Vercel Analytics, Speed Insights, PostHog

### Backend
- **Framework**: FastAPI (Python 3.10+)
- **Database**: MongoDB (via `motor` async client)
- **Validation**: Pydantic v2
- **Deployment**: Vercel Serverless / Cloud Backend

---

## 📁 Directory Structure

```
.
├── backend/
│   ├── server.py              # FastAPI application server & routes
│   ├── requirements.txt       # Python dependencies
│   └── pytest.ini             # Pytest configuration
├── frontend/
│   ├── public/
│   │   ├── index.html         # Base HTML with SEO tags & noscript fallback
│   │   ├── favicon.svg        # Brand icon
│   │   ├── manifest.json      # Web app manifest
│   │   ├── press-kit.html     # Standalone printable Press Kit
│   │   ├── sitemap.xml        # Sitemap for search engine indexing
│   │   └── media/             # Official artist photography
│   ├── src/
│   │   ├── App.js             # Main layout & interactive components
│   │   ├── App.css            # Custom design system & animations
│   │   ├── content.js         # Public content metadata & streaming URLs
│   │   └── index.js           # App entry point & provider wrappers
│   └── vercel.json            # Security headers & build specs
└── README.md
```

---

## 🚀 Getting Started

### Local Development

1. **Frontend Setup**:
   ```bash
   cd frontend
   yarn install
   yarn start
   ```

2. **Backend Setup**:
   ```bash
   cd backend
   pip install -r requirements.txt
   uvicorn server:app --reload --port 8000
   ```

3. **Environment Variables**:
   - `REACT_APP_BACKEND_URL`: URL of the FastAPI backend service (e.g. `http://localhost:8000`)
   - `MONGO_URL`: MongoDB connection string
   - `DB_NAME`: Database name (e.g. `yungdsa_prod`)

---

## 📩 Official Contacts

- **Artist**: YUNG DSA (`@yung_dsa`)
- **Management & Bookings**: `yungdsa06@gmail.com`
- **Website**: [https://yungdsa.com](https://yungdsa.com)
