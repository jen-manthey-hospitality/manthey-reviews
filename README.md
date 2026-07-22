# Manthey Hospitality Review Analysis

Automated daily scraper that pulls Google reviews from all Manthey Hospitality properties, analyzes sentiment and mentions, and displays insights on a live dashboard.

## Properties Tracked
- Yacht StarShip
- Craft Tampa
- Pirate Water Taxi
- Nashville Riverboat
- Lost Pearl

## Features
- **Daily automated scraping** via GitHub Actions (no manual work)
- **Sentiment analysis** (positive/negative keyword-based)
- **Staff recognition leaderboard** (track which staff get mentioned positively)
- **Feature performance tracking** (what customers praise/complain about)
- **Live dashboard** deployed to Vercel showing trends, leaderboards, and recent reviews

## Tech Stack
- **Scraper**: Node.js (axios, cheerio)
- **Database**: Supabase (PostgreSQL)
- **Dashboard**: React + Vercel
- **Automation**: GitHub Actions (cron job)

## Setup

### 1. Environment Variables
Create a `.env` file:
```
SUPABASE_URL=<your-supabase-project-url>
SUPABASE_ANON_KEY=<your-supabase-anon-key>
```

### 2. Database Schema
Run `schema.sql` in your Supabase SQL editor to create tables.

### 3. Configure Properties
Edit `properties.json` to add/update Google Business URLs for each property.

### 4. Deploy Dashboard
```
vercel deploy
```

### 5. Set GitHub Secrets
Add to your GitHub repo settings → Secrets:
- `SUPABASE_URL`
- `SUPABASE_ANON_KEY`

The GitHub Actions workflow (`.github/workflows/scrape.yml`) will run daily at 6 AM UTC.

## Dashboard
Access the live dashboard at: `https://manthey-reviews.vercel.app` (update with your Vercel URL)

Shows:
- Staff leaderboard (top mentioned staff by sentiment)
- Feature performance (live music, food/bar, ambiance, price)
- Sentiment trend line
- Property filter
- Recent negative reviews (for ops team)
