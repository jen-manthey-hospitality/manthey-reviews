-- Manthey Hospitality Review Analysis Schema

-- Properties table
CREATE TABLE IF NOT EXISTS properties (
  id TEXT PRIMARY KEY,
  name TEXT NOT NULL,
  google_url TEXT,
  created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP
);

-- Reviews table
CREATE TABLE IF NOT EXISTS reviews (
  id TEXT PRIMARY KEY,
  property_id TEXT NOT NULL REFERENCES properties(id),
  text TEXT NOT NULL,
  rating INTEGER CHECK (rating >= 1 AND rating <= 5),
  reviewer_name TEXT,
  review_date DATE,
  sentiment TEXT CHECK (sentiment IN ('positive', 'negative', 'neutral')),
  scraped_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
  UNIQUE(property_id, reviewer_name, review_date)
);

-- Staff mentions table
CREATE TABLE IF NOT EXISTS staff_mentions (
  id TEXT PRIMARY KEY,
  review_id TEXT NOT NULL REFERENCES reviews(id),
  staff_name TEXT NOT NULL,
  mention_type TEXT CHECK (mention_type IN ('name', 'role')),
  role TEXT,
  sentiment TEXT CHECK (sentiment IN ('positive', 'negative', 'neutral')),
  created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP
);

-- Feature mentions table
CREATE TABLE IF NOT EXISTS feature_mentions (
  id TEXT PRIMARY KEY,
  review_id TEXT NOT NULL REFERENCES reviews(id),
  feature_type TEXT NOT NULL CHECK (feature_type IN ('live_music', 'food_bar', 'ambiance', 'price', 'other')),
  sentiment TEXT CHECK (sentiment IN ('positive', 'negative', 'neutral')),
  created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP
);

-- Create indexes for faster queries
CREATE INDEX IF NOT EXISTS idx_reviews_property ON reviews(property_id);
CREATE INDEX IF NOT EXISTS idx_reviews_sentiment ON reviews(sentiment);
CREATE INDEX IF NOT EXISTS idx_staff_sentiment ON staff_mentions(sentiment);
CREATE INDEX IF NOT EXISTS idx_feature_type ON feature_mentions(feature_type);

-- Insert properties
INSERT INTO properties (id, name, google_url) VALUES
  ('yacht-starship', 'Yacht StarShip', 'https://www.google.com/maps/place/Yacht+StarShip'),
  ('craft-tampa', 'Craft Tampa', 'https://www.google.com/maps/place/Craft+Tampa'),
  ('pirate-water-taxi', 'Pirate Water Taxi', 'https://www.google.com/maps/place/Pirate+Water+Taxi'),
  ('nashville-riverboat', 'Nashville Riverboat', 'https://www.google.com/maps/place/Nashville+Riverboat'),
  ('lost-pearl', 'Lost Pearl', 'https://www.google.com/maps/place/Lost+Pearl')
ON CONFLICT (id) DO NOTHING;
