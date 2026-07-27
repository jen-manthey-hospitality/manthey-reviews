require('dotenv').config();
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
      console.error(`Error inserting into ${table}:`, error);
      return null;
    }

    return await response.json();
  } catch (error) {
    console.error(`Error:`, error.message);
    return null;
  }
}

// Nashville reviews extracted from PDF
const nashvilleReviews = [
  { text: "Fun experience and the Captain was very friendly and knowledgeable.", rating: 5, reviewer: "Guest" },
  { text: "I love this Cali is the best I will give it 100 stars and more she's the best singer I've ever heard and plus I sing with her it was the best trip ever. Go Texas and Nashville.", rating: 5, reviewer: "Guest" },
  { text: "Great people, great service and good food. A very special and relaxing experience. Great music, informative tour and lovely staff. Aziz was so attentive and sweet to our large group during dinner and dessert!", rating: 5, reviewer: "Guest" },
  { text: "I had a wonderful time on the Nashville Riverboats cruise! The views were amazing, the atmosphere was relaxing, and the staff were wonderful. Aziz was absolutely amazing!", rating: 5, reviewer: "Guest" },
  { text: "Aziz was so attentive and sweet to our large group during dinner and dessert! Great experience. Was such a nice relaxing boat ride. Staff was amazing especially Cyndi at the bar.", rating: 5, reviewer: "Guest" },
  { text: "Jimbo was amazing on this boat and made our whole trip! It was so fun seeing the river and traveling on the boat with live music. Would definitely recommend!!", rating: 5, reviewer: "Guest" },
  { text: "Jimbo did a great job narrating the tour. Informative & entertaining even in the rain. Such an underrated activity. So cheap!!! Beautiful view and there's a singer.", rating: 5, reviewer: "Guest" },
  { text: "Great time down the river, a knowledgeable narration from Jimbo. 10/10", rating: 5, reviewer: "Guest" },
  { text: "Jimbo is extremely informative as a tour guide! Definitely recommend!!", rating: 5, reviewer: "Guest" },
  { text: "Such a nice relaxing boat ride. Staff was amazing especially Cyndi at the bar. She gave us some great recommendations for things to do off Broadway!", rating: 5, reviewer: "Guest" },
  { text: "Not even the rain could stop us from having a good time. Aziz was a fantastic host and was with us wherever we needed him. Fantastic way to start our 4th of July weekend.", rating: 5, reviewer: "Guest" },
  { text: "Food was mid but that wasn't Aziz's fault. Jimbo was amazing on this boat and made our whole trip! Would definitely recommend!!", rating: 4, reviewer: "Guest" },
  { text: "Great experience. Friendly crew. Great food. Informative and entertaining. The band was great as well and had tons of interesting facts on the water. Great experience overall!!", rating: 5, reviewer: "Guest" },
  { text: "Such an amazing experience! The views were incredible, the staff was friendly, and everything was well organized. Highly recommend!!", rating: 5, reviewer: "Guest" },
  { text: "Aziz was our server and it was great! We enjoyed our experience. The bartender was excellent, couldn't do enough to help us and made sure we wanted for nothing.", rating: 5, reviewer: "Guest" },
  { text: "Amazing river tour. So much history and details you wouldn't know without taking a cruise. Great service through the entire tour. Staff is wonderful!", rating: 5, reviewer: "Guest" },
  { text: "Had the best time in Nashville on the river cruise! Great staff and fun time would definitely recommend this tour and enjoyed it immensely!", rating: 5, reviewer: "Guest" },
  { text: "First time in Nashville and went to the boat tour and Jimbo the captain was amazing. Excellent service, good ride, great customer service.", rating: 5, reviewer: "Guest" },
  { text: "Wonderful cruise Jimbo was very entertaining, spending time with passengers and making the trip interactive. Would definitely recommend it.", rating: 5, reviewer: "Guest" },
  { text: "Great atmosphere and experience! The crew was wonderful. Enjoyed the live music and the narration by Jimbo. Uncle Jimbo was a really good tour guide!", rating: 5, reviewer: "Guest" },
  { text: "What a phenomenal experience!!! We went to celebrate the Fourth of July and my friend's 40th birthday. Getting on the boat was smooth and friendly staff. They offered staged photos.", rating: 5, reviewer: "Guest" },
  { text: "The food was delicious and plenty for everyone. There is a full bar as well as many signature drinks. Our server was THE BEST — shout out to Aziz.", rating: 5, reviewer: "Guest" },
  { text: "The firework show was incredible. Nashville sure knows how to put on a show. This event was the highlight of a fantastic weekend celebrating.", rating: 5, reviewer: "Guest" },
  { text: "Highlight of a day time activity, great knowledge and amazing music. Had a fantastic time. Would definitely recommend!!", rating: 5, reviewer: "Guest" },
  { text: "Excellent, interesting and knowledgeable guide! Jimbo was great! Captain Jimbo did a great job narrating the river cruise.", rating: 5, reviewer: "Guest" },
  { text: "Jimbo was excellent, he had lot of detail in this cruise; lotta great information. Had a fantastic time. I'll do it again.", rating: 5, reviewer: "Guest" },
  { text: "This was a great experience while visiting Nashville. The history of Nashville is amazing. Jimbo made it so interesting. The bartender Alex was great.", rating: 5, reviewer: "Guest" },
  { text: "Nico was Amazing. Niko did an amazing job serving me and my table it made the ride and experience so much better. Niko was a amazing server.", rating: 5, reviewer: "Guest" },
  { text: "Had the best time in the boat. Food was really good, but the service of Hannah was amazing!! Thank you for everything. Amazing experience!!", rating: 5, reviewer: "Guest" },
  { text: "We enjoyed food, Austin was pouring great cocktails, the outdoor seating, the music, and Olivia even arranged for a visit to the pilot house.", rating: 5, reviewer: "Guest" },
];

async function importNashvilleReviews() {
  console.log('=== Importing Nashville Riverboats Historical Reviews ===\n');

  const propertyId = 'nashville-riverboats';
  const propertyName = 'Nashville Riverboats';

  let insertedCount = 0;

  for (const review of nashvilleReviews) {
    const reviewId = generateId();
    const sentiment = review.rating >= 4 ? 'positive' : 'neutral';

    // Insert review
    const result = await supabaseQuery('reviews', {
      id: reviewId,
      property_id: propertyId,
      text: review.text,
      rating: review.rating,
      reviewer_name: review.reviewer,
      review_date: new Date().toISOString().split('T')[0],
      sentiment: sentiment
    });

    if (result) {
      insertedCount++;
      console.log(`✓ Review ${insertedCount}/${nashvilleReviews.length}`);

      // Extract and insert staff mentions
      const staffNames = ['Jimbo', 'Niko', 'Aziz', 'Merit', 'Hannah', 'Johnny', 'Andy', 'Arthur', 'Cyndi', 'Calli', 'Nico'];
      const staffPatterns = {
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

      for (const [name, pattern] of Object.entries(staffPatterns)) {
        if (pattern.test(review.text)) {
          await supabaseQuery('staff_mentions', {
            id: generateId(),
            review_id: reviewId,
            staff_name: name,
            mention_type: ['bartender', 'server', 'captain', 'waiter'].some(t => name.toLowerCase().includes(t)) ? 'role' : 'name',
            sentiment: sentiment
          });
        }
      }

      // Extract and insert feature mentions
      const features = {
        'live_music': /music|band|singing|performer|entertain/i,
        'food_bar': /food|bar|drink|cocktail|service|bartender|meal|appetizer|cheese|chicken/i,
        'ambiance': /view|beautiful|atmosphere|relax|scenic|clean|peaceful|decor|ambiance|swings/i,
        'price': /price|cost|value|expensive|affordable|worth|fair/i
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

  console.log(`\n=== Complete ===`);
  console.log(`✓ Imported ${insertedCount} Nashville Riverboats reviews to Supabase`);
  console.log(`Dashboard: https://manthey-reviews-465t.vercel.app/`);
}

importNashvilleReviews().catch(error => {
  console.error('Fatal error:', error);
  process.exit(1);
});
