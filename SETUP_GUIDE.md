# 🛡️ CyberSec Incident Reporter - Setup Guide

## Overview
This is a **Next.js + MongoDB** full-stack application for reporting and managing cybersecurity incidents.

## Prerequisites
- **Node.js** 18+ installed
- **MongoDB** (local or MongoDB Atlas cloud)
- **npm** or **yarn** package manager

## Installation Steps

### 1. Install Dependencies
\`\`\`bash
npm install
\`\`\`

This will install:
- `next` - React framework
- `react` & `react-dom` - UI library
- `mongoose` - MongoDB ODM
- And other dependencies

### 2. Set Up Environment Variables

Create a `.env.local` file in the root directory:

\`\`\`env
# MongoDB Connection String
# For local MongoDB: mongodb://localhost:27017/cybercrime_db
# For MongoDB Atlas: mongodb+srv://username:password@cluster.mongodb.net/cybercrime_db
DB_URI=your_mongodb_connection_string_here

# API URL for frontend (optional, defaults to /api/incidents)
NEXT_PUBLIC_API_URL=/api/incidents
\`\`\`

**Get MongoDB Connection String:**
- **Local MongoDB:** `mongodb://localhost:27017/cybercrime_db`
- **MongoDB Atlas (Cloud):**
  1. Go to [MongoDB Atlas](https://www.mongodb.com/cloud/atlas)
  2. Create a free cluster
  3. Get your connection string from the "Connect" button
  4. Format: `mongodb+srv://username:password@cluster-url/database-name`

### 3. Run the Application

#### Development Mode
\`\`\`bash
npm run dev
\`\`\`

Then open your browser and visit:
\`\`\`
http://localhost:3000
\`\`\`

#### Production Mode
\`\`\`bash
npm run build
npm run start
\`\`\`

## Project Structure

\`\`\`
├── app/
│   ├── page.tsx           # Main dashboard component
│   ├── page.css           # Dashboard styles
│   ├── layout.tsx         # Root layout
│   ├── globals.css        # Global styles
│   └── api/
│       └── incidents/
│           ├── route.ts   # GET/POST endpoints
│           └── [id]/
│               └── route.ts # GET/PUT/DELETE endpoints
├── components/
│   ├── incident-form.tsx   # Form to report incidents
│   ├── incident-form.css   # Form styles
│   ├── incident-list.tsx   # List to display incidents
│   └── incident-list.css   # List styles
├── .env.local             # Environment variables (create this)
└── package.json           # Dependencies
\`\`\`

## API Endpoints

All endpoints are relative to `/api/incidents`

| Method | Endpoint | Description |
|--------|----------|-------------|
| **GET** | `/api/incidents` | Get all incidents |
| **POST** | `/api/incidents` | Create new incident |
| **GET** | `/api/incidents/:id` | Get single incident |
| **PUT** | `/api/incidents/:id` | Update incident |
| **DELETE** | `/api/incidents/:id` | Delete incident |

## Features

✅ **Report Incidents** - Submit new security incidents with severity levels
✅ **View Dashboard** - See all reported incidents in a professional dashboard
✅ **Update Status** - Change incident status (Open, In-Progress, Resolved)
✅ **Delete Records** - Remove incidents from the database
✅ **Professional UI** - Dark theme with cybersecurity aesthetic
✅ **Real-time Updates** - Instant synchronization with MongoDB

## Troubleshooting

### Error: "Cannot connect to MongoDB"
- Check your `DB_URI` in `.env.local`
- Ensure MongoDB is running (if local)
- Verify IP whitelist on MongoDB Atlas (if cloud)

### Error: "Port 3000 already in use"
\`\`\`bash
# Use a different port
npm run dev -- -p 3001
\`\`\`

### Frontend not loading data
- Make sure all environment variables are set
- Check browser console for errors
- Restart the Next.js server after changing `.env.local`

## Deployment

### Deploy to Vercel (Recommended)
1. Push your code to GitHub
2. Go to [Vercel](https://vercel.com)
3. Connect your GitHub repo
4. Add environment variables in Vercel dashboard
5. Deploy!

### Deploy to Other Platforms
- Heroku, Railway, Render all support Next.js
- Follow platform-specific Next.js deployment docs

## Need Help?

Check the following:
- Environment variables are set correctly
- MongoDB connection is working
- Node.js version is 18+
- Run `npm install` before starting
