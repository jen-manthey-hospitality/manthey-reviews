import React, { useState, useEffect } from 'react'
import Reviews from './Reviews'

export default function App() {
  const [currentPage, setCurrentPage] = useState('dashboard')
  const [stats, setStats] = useState(null)
  const [allReviews, setAllReviews] = useState([])
  const [loading, setLoading] = useState(true)
  const [selectedProperty, setSelectedProperty] = useState('all')

  useEffect(() => {
    setTimeout(() => {
      // Mock reviews for demonstration
      const mockReviews = [
        { id: '1', property_id: 'yacht-starship', text: 'Amazing experience! The bartender Sarah was so friendly and the live music was fantastic!', rating: 5, reviewer_name: 'Jane D.', review_date: '2026-07-22', sentiment: 'positive' },
        { id: '2', property_id: 'yacht-starship', text: 'Great food and wonderful atmosphere. Captain Mike was very professional.', rating: 5, reviewer_name: 'Tom H.', review_date: '2026-07-21', sentiment: 'positive' },
        { id: '3', property_id: 'yacht-starship', text: 'Beautiful vessel, clean and well-maintained. The service was excellent!', rating: 5, reviewer_name: 'Lisa M.', review_date: '2026-07-20', sentiment: 'positive' },
        { id: '4', property_id: 'craft-tampa', text: 'Nice bar setup with good drinks. DJ Jason was great but the place was a bit overpriced.', rating: 3, reviewer_name: 'Mike S.', review_date: '2026-07-19', sentiment: 'neutral' },
        { id: '5', property_id: 'craft-tampa', text: 'Terrible service, waited 45 minutes for drinks. Very disappointed.', rating: 2, reviewer_name: 'Sarah T.', review_date: '2026-07-18', sentiment: 'negative' },
        { id: '6', property_id: 'pirate-water-taxi', text: 'Perfect day on the water! The crew was friendly and the ambiance was beautiful.', rating: 5, reviewer_name: 'Robert K.', review_date: '2026-07-17', sentiment: 'positive' },
        { id: '7', property_id: 'pirate-water-taxi', text: 'Food was delicious, live music was entertaining. Worth every penny!', rating: 5, reviewer_name: 'Amanda R.', review_date: '2026-07-16', sentiment: 'positive' },
        { id: '8', property_id: 'nashville-riverboat', text: 'Great entertainment and good food. Bartender was helpful and knowledgeable.', rating: 4, reviewer_name: 'Chris L.', review_date: '2026-07-15', sentiment: 'positive' },
        { id: '9', property_id: 'lost-pearl', text: 'Excellent view and clean facilities. The staff went above and beyond!', rating: 5, reviewer_name: 'Emma W.', review_date: '2026-07-14', sentiment: 'positive' },
        { id: '10', property_id: 'lost-pearl', text: 'Decent experience but music was too loud and prices are steep.', rating: 3, reviewer_name: 'David P.', review_date: '2026-07-13', sentiment: 'neutral' },
      ]

      setAllReviews(mockReviews)

      const properties = [
        { id: 'yacht-starship', name: 'Yacht StarShip', reviews: 89 },
        { id: 'craft-tampa', name: 'Craft Tampa', reviews: 67 },
        { id: 'pirate-water-taxi', name: 'Pirate Water Taxi', reviews: 78 },
        { id: 'nashville-riverboat', name: 'Nashville Riverboat', reviews: 56 },
        { id: 'lost-pearl', name: 'Lost Pearl', reviews: 52 }
      ]

      setStats({
        totalReviews: 342,
        avgRating: 4.2,
        positiveCount: 256,
        negativeCount: 45,
        neutralCount: 41,
        topStaff: [
          { name: 'Sarah (Server)', positive: 34, negative: 2 },
          { name: 'John (Bartender)', positive: 28, negative: 1 },
          { name: 'Mike (Captain)', positive: 22, negative: 3 },
          { name: 'Jason (DJ)', positive: 18, negative: 0 }
        ],
        features: [
          { name: 'Live Music', positive: 89, negative: 12 },
          { name: 'Food & Bar', positive: 156, negative: 23 },
          { name: 'Ambiance', positive: 198, negative: 8 },
          { name: 'Price/Value', positive: 34, negative: 18 }
        ],
        properties: properties
      })
      setLoading(false)
    }, 500)
  }, [])

  if (loading) {
    return (
      <div className="container">
        <div className="loading">Loading dashboard...</div>
      </div>
    )
  }

  if (!stats) {
    return (
      <div className="container">
        <div className="loading">No data available yet. Run the scraper to populate reviews.</div>
      </div>
    )
  }

  if (currentPage === 'reviews') {
    return <Reviews onBack={() => setCurrentPage('dashboard')} allReviews={allReviews} properties={stats.properties} />
  }

  return (
    <div className="container">
      <div className="header">
        <h1>🚤 Manthey Hospitality Review Dashboard</h1>
        <p>Real-time analysis of customer reviews across all properties</p>
        <p style={{ fontSize: '0.85rem', color: '#999', marginTop: '0.5rem' }}>
          Last updated: {new Date().toLocaleString()}
        </p>
      </div>

      <div className="grid">
        <div className="card" style={{ cursor: 'pointer', transition: 'box-shadow 0.2s' }} onClick={() => setCurrentPage('reviews')} onMouseOver={(e) => e.currentTarget.style.boxShadow = '0 4px 8px rgba(0,0,0,0.15)'} onMouseOut={(e) => e.currentTarget.style.boxShadow = '0 1px 3px rgba(0,0,0,0.1)'}>
          <div className="stat-label">Total Reviews</div>
          <div className="stat">{stats.totalReviews}</div>
          <p style={{ fontSize: '0.9rem', color: '#666' }}>Click to view all →</p>
        </div>

        <div className="card">
          <div className="stat-label">Average Rating</div>
          <div className="stat">{stats.avgRating}</div>
          <p style={{ fontSize: '0.9rem', color: '#666' }}>Out of 5 stars</p>
        </div>

        <div className="card" style={{ cursor: 'pointer', transition: 'box-shadow 0.2s' }} onClick={() => setCurrentPage('reviews')} onMouseOver={(e) => e.currentTarget.style.boxShadow = '0 4px 8px rgba(0,0,0,0.15)'} onMouseOut={(e) => e.currentTarget.style.boxShadow = '0 1px 3px rgba(0,0,0,0.1)'}>
          <div className="stat-label">Sentiment Breakdown</div>
          <div style={{ display: 'flex', gap: '1rem', marginTop: '1rem' }}>
            <div>
              <div className="badge positive" style={{ display: 'block', marginBottom: '0.25rem' }}>
                ✓ {stats.positiveCount}
              </div>
              <div style={{ fontSize: '0.8rem', color: '#666' }}>Positive</div>
            </div>
            <div>
              <div className="badge negative" style={{ display: 'block', marginBottom: '0.25rem' }}>
                ✗ {stats.negativeCount}
              </div>
              <div style={{ fontSize: '0.8rem', color: '#666' }}>Negative</div>
            </div>
          </div>
          <p style={{ fontSize: '0.9rem', color: '#666', marginTop: '0.5rem' }}>Click to view all →</p>
        </div>
      </div>

      <div className="grid">
        <div className="card">
          <h2>🌟 Staff Recognition Leaderboard</h2>
          <ul className="leaderboard">
            {stats.topStaff.map((staff, idx) => (
              <li key={idx}>
                <span>
                  <strong>{idx + 1}. {staff.name}</strong>
                </span>
                <span>
                  <span className="badge positive">{staff.positive} positive</span>
                  {staff.negative > 0 && <span className="badge negative" style={{ marginLeft: '0.5rem' }}>{staff.negative} neg</span>}
                </span>
              </li>
            ))}
          </ul>
        </div>

        <div className="card">
          <h2>🎯 Feature Performance</h2>
          <ul className="leaderboard">
            {stats.features.map((feature, idx) => (
              <li key={idx}>
                <span>{feature.name}</span>
                <span>
                  <span className="badge positive">{feature.positive}</span>
                  <span className="badge negative" style={{ marginLeft: '0.5rem' }}>{feature.negative}</span>
                </span>
              </li>
            ))}
          </ul>
        </div>
      </div>

      <div className="card">
        <h2>🚢 Reviews by Property</h2>
        <ul className="leaderboard">
          {stats.properties.map((prop) => (
            <li key={prop.id}>
              <span>{prop.name}</span>
              <span style={{ color: '#3498db', fontWeight: 'bold' }}>{prop.reviews} reviews</span>
            </li>
          ))}
        </ul>
      </div>

      <div style={{ textAlign: 'center', marginTop: '3rem', color: '#666', fontSize: '0.9rem' }}>
        <p>Dashboard updates daily at 6 AM UTC via GitHub Actions</p>
        <p>Questions? Contact the ops team</p>
      </div>
    </div>
  )
}
