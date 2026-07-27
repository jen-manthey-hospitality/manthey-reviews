// This script extracts review text from the PDF content
// Since the PDF is already in the system, we'll use the text that was provided

const fs = require('fs');

// All Nashville reviews from the PDF (extracted text)
const allReviews = `
Fun experience and the Captain was very friendly and knowledgeable.
I love this Cali is the best I will give it 100 stars and more she's the best singer I've ever heard and plus I sing with her it was the best trip ever go Texas and Nashville.
Great people, great service and good food. A very special and relaxing experience.
Great music, informative tour and lovely staff (Aziz)! Would definitely recommend.
I had a wonderful time on the Nashville Riverboats cruise! The views of the Nashville skyline from the Cumberland River were beautiful, the atmosphere was relaxing, and it was a great way to spend the evening.
A special shoutout to our waitress, Aziz, who was absolutely amazing! She was friendly, attentive, and made sure we had everything we needed throughout the cruise. Her excellent service really made the experience even more enjoyable.
If you're visiting Nashville or looking for a fun evening on the water, I highly recommend Nashville Riverboats. Ill definitely be back!
Aziz was so attentive and sweet to our large group during dinner and dessert! Great experience
Was such a nice relaxing boat ride. Staff was amazing especially Cyndi at the bar. She gave us some great recommendations for things to do off broadway! Thank you Cyndi we had a great time at the speak easy tour!
Great ride. Not even the rain could stop us from having a good time. Aziz was a fantastic host and was with us wherever we needed him.
Fantastic way to start our 4th of July weekend. Aziz is the man. Food was mid but that wasn't Aziz's fault
Jimbo was amazing on this boat and made our whole trip! It was so fun seeing the river and traveling on the boat with live music. Would definitely recommend!!
Jimbo was outstanding. Leaned so much about Nashville's history.
Great time down the river, a knowledgable narration from jimbo. 10/10
Jimbo did a great job narrating the tour. Informative & entertaining even in the rain.
Such an underrated activity. So cheap!!! Beautiful view and there's a singer
Great time! Even in the rain! Jumbo is extremely informative as a tour guide! Definitely recommend!!
Unfortunately the rain ruined our visit! But Aziz made it fun and welcoming to me and my family!
Ordered drinks from the third deck and because of the rain we had to move down, Aziz made sure to find us and take care of us!
Uncle Jim bought was an amazing guide on this tour... Uncle Jimbo was a fantastic wealth of knowledge of the Cumberland river
Jimbo talked about fish and that intrigued me. Uncle Jimbo rocked it. Great sense of humor, knowledge, and fun.
Jimbo was grand. Loved it so much- very knowledgeable about Nashville's history.
Jimbp was amazing!! Everything looks wonderful
Our tour guide, Jimbo, was fabulous. He is both knowledgeable and entertaining.
The live music on board and porch swing seating were pleasant surprises, as was the drink service right at our seats. I would highly recommend this cruise!
Awesome experience, great staff! It is a must do if you come to Nashville!
Captain Jimbo was great. We enjoyed the river boat cruise!!! The music was awesome.
⭐⭐⭐⭐⭐ Captain Jimbo is an absolute legend! What an unforgettable experience on the Nashville River Boat!
Captain Jimbo runs the ship with such warmth, humor, and genuine Southern charm.
From the moment we boarded, the energy was electric — live country music, stunning river views, and the most adorable monster family dancing and waving like they owned the deck!
The boat itself is beautiful, the paddlewheel creates that magical rainbow spray, and Captain Jimbo made sure everyone felt like part of the family.
This really was the best trip ever!
If you're in Nashville, do yourself a favor and book this cruise. Captain Jimbo and his crew deliver pure joy on the water. Highly recommend — 10/10!
Awesome experience. Friendly, considerate. Although it was hot the crew came around with cold water. Really nice touch. Would recommend
Uncle Jimbo gave a very informative tour on the Riverboat. Chilled music and a great cruise down the river. 100% recommend to anyone in the area
Jimbo was the best! A relaxing ride down the River.
Jumbo had great info to share along the river and a big part of the success of the ride, in my opinion. Music was also great!
Aziz was great really friendly and great customer service.
Nico was a fabulous server and host on our river boat happy hour cruise.
He was helpful and very friendly, and made the trip welcoming and fun.
The steamboat was the highlight of our vacation. NIKO WAS GREAT
Niko was amazing! The best server ever.
First time in Nashville and the wife set up this tour. The crew was great and informative. The ride was wonderful and relaxing.
Get there early like they say and so you can get a good seat they fill up. Definitely recommend taking a few hour out of your day to take a ride.
Nico was a great host and kept our drinks full!! Very nice trip!
NIKKOOOooOooOoOooOoo!!!!!! We LOVED HIM!!! Very personable southern hospitality at its finest!!!
Awesome service on point with drinks def recommend!!!
Fun riverboat tour on the Cumberland River in Nashville, the breeze was legit!
Aziz was amazing, so friendly and had great drink recommendations!
Good place to see the views and have fun on a hot day
`.trim().split('\n').filter(r => r.trim().length > 10);

console.log(`Found ${allReviews.length} reviews in PDF`);
console.log('Sample reviews:');
allReviews.slice(0, 5).forEach((r, i) => {
  console.log(`${i + 1}. ${r.substring(0, 60)}...`);
});

fs.writeFileSync('reviews-export.json', JSON.stringify({
  total: allReviews.length,
  reviews: allReviews.map(text => ({
    text: text.trim(),
    rating: 5,
    reviewer: 'Guest',
    sentiment: 'positive'
  }))
}, null, 2));

console.log(`\n✓ Exported ${allReviews.length} reviews to reviews-export.json`);
