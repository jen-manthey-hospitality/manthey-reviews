require('dotenv').config();
const puppeteer = require('puppeteer');
const crypto = require('crypto');
const fs = require('fs');
const path = require('path');

const SUPABASE_URL = process.env.SUPABASE_URL || 'https://ofgicptdoygttkyndrnb.supabase.co';
const SUPABASE_ANON_KEY = process.env.SUPABASE_ANON_KEY || 'sb_publishable_CSaPz3PkfOn6eEUpBoWxWQ_l7IaTzAK';

function generateId() {
  return crypto.randomBytes(12).toString('hex');
}

async function supabaseQuery(table, data) {
  const url = `${SUPABASE_URL}/rest/v1/${table}`;

  try {
    const response = await fetch(url, {
      method: 'POST',
      headers: {
        'Authorization': `Bearer ${SUPABASE_ANON_KEY}`,
        'Content-Type': 'application/json',
        'Prefer': 'return=representation'
      },
      body: JSON.stringify(data)
    });

    if (!response.ok) {
      const error = await response.text();
      console.error(`Error inserting into ${table}:`, error);
      return null;
    }

    return await response.json();
  } catch (error) {
    console.error(`Error inserting into ${table}:`, error.message);
    return null;
  }
}

async function scrapeGoogleMapsReviews(propertyId, propertyName, googleMapsUrl) {
  console.log(`\nScraping ${propertyName}...`);

  let browser;
  try {
    browser = await puppeteer.launch({
      headless: 'new',
      args: ['--no-sandbox', '--disable-setuid-sandbox', '--disable-dev-shm-usage']
    });

    const page = await browser.newPage();
    await page.setViewport({ width: 1280, height: 800 });
    await page.setUserAgent('Mozilla/5.0 (Windows NT 10.0; Win64; x64) AppleWebKit/537.36');

    console.log(`  Loading ${googleMapsUrl}...`);
    await page.goto(googleMapsUrl, { waitUntil: 'networkidle2', timeout: 30000 });

    // Scroll to reveal reviews
    console.log(`  Scrolling to load reviews...`);
    for (let i = 0; i < 5; i++) {
      await page.evaluate(() => {
        const reviewsSection = document.querySelector('[role="region"]');
        if (reviewsSection) {
          reviewsSection.scrollTop = reviewsSection.scrollHeight;
        }
      });
      await page.waitForTimeout(1500);
    }

    // Extract reviews from Google Maps
    console.log(`  Extracting reviews...`);
    const reviews = await page.evaluate(() => {
      const reviewDivs = Array.from(document.querySelectorAll('[data-review-id]'));

      return reviewDivs.slice(0, 50).map(div => {
        try {
          // Extract rating (star count)
          const ratingElement = div.querySelector('[role="img"]');
          const ratingText = ratingElement?.getAttribute('aria-label') || '';
          const rating = parseInt(ratingText.match(/\d/)?.[0] || '5');

          // Extract reviewer name
          const nameElement = div.querySelector('[aria-label*="Reviews"]')?.closest('button') ||
                            div.querySelector('[data-tooltip-id]');
          const reviewerName = nameElement?.textContent?.trim() || 'Anonymous';

          // Extract review text
          const reviewTextElement = div.querySelector('[data-review-id]')?.querySelector('span[aria-hidden="true"]');
          const text = reviewTextElement?.textContent?.trim() || '';

          // Extract date (look for relative date like "2 months ago")
          const dateElements = Array.from(div.querySelectorAll('span')).filter(el =>
            el.textContent.match(/ago|day|week|month|year/) && el.textContent.length < 50
          );
          const dateText = dateElements[0]?.textContent?.trim() || new Date().toISOString().split('T')[0];

          return {
            text: text.substring(0, 2000),
            rating: Math.min(Math.max(rating, 1), 5),
            reviewerName: reviewerName.substring(0, 100),
            date: dateText,
            dataId: div.getAttribute('data-review-id')
          };
        } catch (e) {
          return null;
        }
      }).filter(r => r && r.text && r.text.length > 10);
    });

    await browser.close();

    console.log(`  Found ${reviews.length} reviews`);
    return reviews;

  } catch (error) {
    console.error(`  Error scraping ${propertyName}:`, error.message);
    if (browser) await browser.close();
    return [];
  }
}

async function runScraper() {
  console.log('=== Manthey Hospitality Review Scraper ===\n');

  if (!SUPABASE_URL || !SUPABASE_ANON_KEY) {
    console.error('ERROR: Missing Supabase credentials');
    process.exit(1);
  }

  const properties = JSON.parse(fs.readFileSync(path.join(__dirname, 'properties.json'), 'utf8')).properties;
  let totalInserted = 0;

  for (const prop of properties) {
    try {
      const reviews = await scrapeGoogleMapsReviews(prop.id, prop.name, prop.googleMapsUrl);

      for (const review of reviews) {
        const reviewId = generateId();
        const sentiment = review.rating >= 4 ? 'positive' : review.rating === 3 ? 'neutral' : 'negative';

        // Insert review
        const result = await supabaseQuery('reviews', {
          id: reviewId,
          property_id: prop.id,
          text: review.text,
          rating: review.rating,
          reviewer_name: review.reviewerName,
          review_date: review.date,
          sentiment: sentiment
        });

        if (result) {
          totalInserted++;

          // Extract and insert staff mentions
          const staffPatterns = {
            'Sarah': /sarah/i,
            'John': /john/i,
            'Mike': /mike/i,
            'Jason': /jason/i,
            'Bartender': /bartender/i,
            'Captain': /captain/i,
            'Server': /server/i,
            'Staff': /staff/i,
            'DJ': /dj/i
          };

          for (const [name, pattern] of Object.entries(staffPatterns)) {
            if (pattern.test(review.text)) {
              await supabaseQuery('staff_mentions', {
                id: generateId(),
                review_id: reviewId,
                staff_name: name,
                mention_type: name.match(/bartender|captain|server|dj|staff/i) ? 'role' : 'name',
                sentiment: sentiment
              });
            }
          }

          // Extract and insert feature mentions
          const features = {
            'live_music': /music|band|dj|entertainment|live/i,
            'food_bar': /food|bar|drink|service|bartender|meal|appetizer|cuisine/i,
            'ambiance': /clean|atmosphere|ambiance|view|deck|boat|vessel|beautiful|decor|facility/i,
            'price': /price|cost|value|expensive|cheap|overpriced|worth|affordable/i
          };

          for (const [featureType, pattern] of Object.entries(features)) {
            if (pattern.test(review.text)) {
              await supabaseQuery('feature_mentions', {
                id: generateId(),
                review_id: reviewId,
                feature_type: featureType,
                sentiment: sentiment
              });
            }
          }
        }
      }

      console.log(`✓ ${prop.name}: inserted ${reviews.length} reviews`);
    } catch (error) {
      console.error(`✗ ${prop.name}: ${error.message}`);
    }
  }

  console.log(`\n=== Complete ===`);
  console.log(`Total reviews inserted: ${totalInserted}`);
  console.log(`Dashboard will update at: https://manthey-reviews-465t.vercel.app/`);
}

runScraper().catch(error => {
  console.error('Fatal error:', error);
  process.exit(1);
});
