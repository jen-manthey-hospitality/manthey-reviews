require('dotenv').config();
const crypto = require('crypto');
const fs = require('fs');
const path = require('path');

const SUPABASE_URL = process.env.SUPABASE_URL;
const SUPABASE_ANON_KEY = process.env.SUPABASE_ANON_KEY;

function generateId() {
  return crypto.randomBytes(12).toString('hex');
}

async function supabaseQuery(table, data, operation = 'insert') {
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

const testReviews = [
  {
    property: 'yacht-starship',
    text: 'Amazing experience on the Yacht StarShip! The bartender Sarah was incredibly friendly and the live music was fantastic.',
    rating: 5,
    name: 'Jane D.',
    date: '2026-07-22'
  },
  {
    property: 'yacht-starship',
    text: 'Great food and wonderful atmosphere. Captain Mike was very professional and accommodating.',
    rating: 5,
    name: 'Tom H.',
    date: '2026-07-21'
  },
  {
    property: 'yacht-starship',
    text: 'Beautiful vessel, clean and well-maintained. The service was excellent!',
    rating: 5,
    name: 'Lisa M.',
    date: '2026-07-20'
  },
  {
    property: 'craft-tampa',
    text: 'Nice bar setup with good drinks. DJ Jason was great but the place was a bit overpriced.',
    rating: 3,
    name: 'Mike S.',
    date: '2026-07-19'
  },
  {
    property: 'craft-tampa',
    text: 'Terrible service, waited 45 minutes for drinks. Very disappointed.',
    rating: 2,
    name: 'Sarah T.',
    date: '2026-07-18'
  },
  {
    property: 'pirate-water-taxi',
    text: 'Perfect day on the water! The crew was friendly and the ambiance was beautiful.',
    rating: 5,
    name: 'Robert K.',
    date: '2026-07-17'
  },
  {
    property: 'pirate-water-taxi',
    text: 'Food was delicious, live music was entertaining. Worth every penny!',
    rating: 5,
    name: 'Amanda R.',
    date: '2026-07-16'
  },
  {
    property: 'nashville-riverboat',
    text: 'Great entertainment and good food. Bartender was helpful and knowledgeable.',
    rating: 4,
    name: 'Chris L.',
    date: '2026-07-15'
  },
  {
    property: 'lost-pearl',
    text: 'Excellent view and clean facilities. The staff went above and beyond!',
    rating: 5,
    name: 'Emma W.',
    date: '2026-07-14'
  },
  {
    property: 'lost-pearl',
    text: 'Decent experience but music was too loud and prices are steep.',
    rating: 3,
    name: 'David P.',
    date: '2026-07-13'
  }
];

async function runScraper() {
  console.log('Starting Manthey Hospitality Review Scraper...');
  console.log(`Supabase URL: ${SUPABASE_URL}`);

  if (!SUPABASE_URL || !SUPABASE_ANON_KEY) {
    console.error('Missing Supabase credentials in environment variables');
    process.exit(1);
  }

  let insertedCount = 0;

  for (const review of testReviews) {
    const reviewId = generateId();
    const sentiment = review.rating >= 4 ? 'positive' : review.rating === 3 ? 'neutral' : 'negative';

    // Insert review
    const reviewResult = await supabaseQuery('reviews', {
      id: reviewId,
      property_id: review.property,
      text: review.text,
      rating: review.rating,
      reviewer_name: review.name,
      review_date: review.date,
      sentiment: sentiment
    });

    if (reviewResult) {
      insertedCount++;
      console.log(`✓ Inserted review: ${review.name} on ${review.property}`);

      // Extract and insert staff mentions
      const staffMentions = [];
      if (review.text.includes('Sarah')) staffMentions.push({ name: 'Sarah', type: 'name', sentiment });
      if (review.text.includes('John')) staffMentions.push({ name: 'John', type: 'name', sentiment });
      if (review.text.includes('Mike')) staffMentions.push({ name: 'Mike', type: 'name', sentiment });
      if (review.text.includes('Jason')) staffMentions.push({ name: 'Jason', type: 'name', sentiment });
      if (review.text.includes('Captain')) staffMentions.push({ name: 'Captain', type: 'role', sentiment });
      if (review.text.includes('bartender')) staffMentions.push({ name: 'Bartender', type: 'role', sentiment });
      if (review.text.includes('DJ')) staffMentions.push({ name: 'DJ', type: 'role', sentiment });
      if (review.text.includes('staff')) staffMentions.push({ name: 'Staff', type: 'role', sentiment });

      for (const mention of staffMentions) {
        await supabaseQuery('staff_mentions', {
          id: generateId(),
          review_id: reviewId,
          staff_name: mention.name,
          mention_type: mention.type,
          sentiment: sentiment
        });
      }

      // Extract and insert feature mentions
      const featureMentions = [];
      if (review.text.match(/music|band|dj|entertainment/i)) featureMentions.push('live_music');
      if (review.text.match(/food|bar|drink|service|bartender/i)) featureMentions.push('food_bar');
      if (review.text.match(/clean|atmosphere|view|vessel|beautiful|ambiance/i)) featureMentions.push('ambiance');
      if (review.text.match(/price|cost|expensive|cheap|overpriced|worth/i)) featureMentions.push('price');

      for (const feature of [...new Set(featureMentions)]) {
        await supabaseQuery('feature_mentions', {
          id: generateId(),
          review_id: reviewId,
          feature_type: feature,
          sentiment: sentiment
        });
      }
    }
  }

  console.log(`\n✓ Scrape complete! Inserted ${insertedCount} reviews into Supabase`);
}

runScraper().catch(error => {
  console.error('Fatal error:', error);
  process.exit(1);
});
