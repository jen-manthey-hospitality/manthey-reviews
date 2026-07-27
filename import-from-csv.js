require('dotenv').config();
const fs = require('fs');
const crypto = require('crypto');

const SUPABASE_URL = process.env.SUPABASE_URL || 'https://ofgicptdoygttkyndrnb.supabase.co';
const SUPABASE_ANON_KEY = process.env.SUPABASE_ANON_KEY || 'sb_publishable_CSaPz3PkfOn6eEUpBoWxWQ_l7IaTzAK';

function generateId() {
  return crypto.randomBytes(12).toString('hex');
}

async function supabaseQuery(table, data) {
  const url = `${SUPABASE_URL}/rest/v1/${table}`;
  const key = process.env.SUPABASE_ANON_KEY || 'sb_publishable_CSaPz3PkfOn6eEUpBoWxWQ_l7IaTzAK';

  try {
    const response = await fetch(url, {
      method: 'POST',
      headers: {
        'apikey': key,
        'Authorization': `Bearer ${key}`,
        'Content-Type': 'application/json',
        'Prefer': 'return=representation'
      },
      body: JSON.stringify(data)
    });

    if (!response.ok) {
      const error = await response.text();
      return null;
    }

    return await response.json();
  } catch (error) {
    console.error(`Error:`, error.message);
    return null;
  }
}

function analyzeSentiment(text) {
  const positiveKeywords = [
    'amazing', 'great', 'excellent', 'love', 'wonderful', 'fantastic', 'best',
    'awesome', 'incredible', 'perfect', 'beautiful', 'friendly', 'helpful',
    'professional', 'clean', 'fun', 'entertaining', 'delicious', 'fresh',
    'good', 'nice', 'recommend', 'impressed', 'enjoyed', 'outstanding'
  ];

  const negativeKeywords = [
    'terrible', 'awful', 'bad', 'poor', 'rude', 'dirty', 'broken', 'expensive',
    'waste', 'worst', 'horrible', 'disappointing', 'slow', 'cold', 'late',
    'overpriced', 'unprofessional', 'unfriendly', 'uncomfortable', 'mediocre'
  ];

  const lowerText = text.toLowerCase();
  const positiveCount = positiveKeywords.filter(kw => lowerText.includes(kw)).length;
  const negativeCount = negativeKeywords.filter(kw => lowerText.includes(kw)).length;

  if (positiveCount > negativeCount) return 'positive';
  if (negativeCount > positiveCount) return 'negative';
  return 'neutral';
}

function extractStaffMentions(text) {
  const patterns = {
    'Jimbo': /jimbo|uncle jim|captain jimbo/i,
    'Niko': /niko|nico/i,
    'Aziz': /aziz/i,
    'Merit': /merit|cali/i,
    'Hannah': /hannah/i,
    'Andy': /andy|johnny/i,
    'Arthur': /arthur/i,
    'Cyndi': /cyndi/i,
    'Captain': /captain/i,
    'Bartender': /bartender/i,
    'Server': /server|waiter/i
  };

  return Object.entries(patterns)
    .filter(([name, pattern]) => pattern.test(text))
    .map(([name]) => name);
}

function extractFeatures(text) {
  const features = {
    'live_music': /music|band|singing|performer|entertain/i,
    'food_bar': /food|bar|drink|cocktail|service|bartender|meal|appetizer|cheese|chicken/i,
    'ambiance': /view|beautiful|atmosphere|relax|scenic|clean|peaceful|decor|ambiance|swings/i,
    'price': /price|cost|value|expensive|affordable|worth|fair/i
  };

  return Object.entries(features)
    .filter(([type, pattern]) => pattern.test(text))
    .map(([type]) => type);
}

async function importReviews() {
  console.log('=== Importing Nashville Riverboats Reviews from CSV ===\n');

  // Read CSV file - look in repo root first, then Downloads
  let csvPath = process.argv[2];
  if (!csvPath) {
    // Try repo root first (for GitHub Actions)
    if (fs.existsSync('NRB Reviews - review replies .csv')) {
      csvPath = 'NRB Reviews - review replies .csv';
    }
    // Fall back to Downloads for local testing
    else if (fs.existsSync('/mnt/c/Users/JenniferRichardson/Downloads/NRB Reviews - review replies .csv')) {
      csvPath = '/mnt/c/Users/JenniferRichardson/Downloads/NRB Reviews - review replies .csv';
    }
    // Try Windows path for local testing
    else if (fs.existsSync('C:\\Users\\JenniferRichardson\\Downloads\\NRB Reviews - review replies .csv')) {
      csvPath = 'C:\\Users\\JenniferRichardson\\Downloads\\NRB Reviews - review replies .csv';
    }
  }

  if (!fs.existsSync(csvPath)) {
    console.error(`CSV file not found at: ${csvPath}`);
    console.error('Please ensure "NRB Reviews - review replies .csv" is in the repo root or provide path as argument');
    process.exit(1);
  }

  const fileContent = fs.readFileSync(csvPath, 'utf-8');
  const lines = fileContent.split('\n').map(line => line.trim()).filter(line => line.length > 0);

  // Filter out header lines (dates) and empty lines
  const reviews = lines.filter(line =>
    !line.match(/^(January|February|March|April|May|June|July|August|September|October|November|December)\s+\d{4}$/) &&
    !line.match(/^\d+$/) && // Skip line numbers if CSV added them
    line.length > 20 // Skip very short lines
  );

  console.log(`Found ${reviews.length} reviews in CSV\n`);

  const propertyId = 'nashville-riverboats';
  let insertedCount = 0;

  for (let i = 0; i < reviews.length; i++) {
    const text = reviews[i].replace(/^["']|["']$/g, ''); // Remove quotes if present

    if (text.length < 10) continue;

    const reviewId = generateId();
    const sentiment = analyzeSentiment(text);
    const rating = sentiment === 'positive' ? 5 : sentiment === 'negative' ? 2 : 3;

    // Insert review
    const result = await supabaseQuery('reviews', {
      id: reviewId,
      property_id: propertyId,
      text: text.substring(0, 5000),
      rating: rating,
      reviewer_name: 'Guest',
      review_date: new Date().toISOString().split('T')[0],
      sentiment: sentiment
    });

    if (result) {
      insertedCount++;

      // Extract and insert staff mentions
      const staffNames = extractStaffMentions(text);
      for (const name of staffNames) {
        await supabaseQuery('staff_mentions', {
          id: generateId(),
          review_id: reviewId,
          staff_name: name,
          mention_type: ['bartender', 'server', 'captain', 'waiter'].some(t => name.toLowerCase().includes(t)) ? 'role' : 'name',
          sentiment: sentiment
        });
      }

      // Extract and insert feature mentions
      const features = extractFeatures(text);
      for (const feature of features) {
        await supabaseQuery('feature_mentions', {
          id: generateId(),
          review_id: reviewId,
          feature_type: feature,
          sentiment: sentiment
        });
      }

      if (insertedCount % 50 === 0) {
        console.log(`✓ Imported ${insertedCount} reviews...`);
      }
    }
  }

  console.log(`\n=== Complete ===`);
  console.log(`✓ Imported ${insertedCount} Nashville Riverboats reviews to Supabase`);
  console.log(`Dashboard: https://manthey-reviews-465t.vercel.app/`);
}

importReviews().catch(error => {
  console.error('Fatal error:', error);
  process.exit(1);
});
