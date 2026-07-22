import React, { useState, useEffect } from 'react'

export default function App() {
  const [stats, setStats] = useState(null)
  const [loading, setLoading] = useState(true)
  const [selectedProperty, setSelectedProperty] = useState('all')

  useEffect(() => {
    // In production, this would fetch from Supabase
    // For now, show mock data to demonstrate the dashboard structure
    setTimeout(() => {
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
        properties: [
          { id: 'yacht-starship', name: 'Yacht StarShip', reviews: 89 },
          { id: 'craft-tampa', name: 'Craft Tampa', reviews: 67 },
          { id: 'pirate-water-taxi', name: 'Pirate Water Taxi', reviews: 78 },
          { id: 'nashville-riverboat', name: 'Nashville Riverboat', reviews: 56 },
          { id: 'lost-pearl', name: 'Lost Pearl', reviews: 52 }
        ]
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
        <div className="card">
          <div className="stat-label">Total Reviews</div>
          <div className="stat">{stats.totalReviews}</div>
          <p style={{ fontSize: '0.9rem', color: '#666' }}>All properties combined</p>
        </div>

        <div className="card">
          <div className="stat-label">Average Rating</div>
          <div className="stat">{stats.avgRating}</div>
          <p style={{ fontSize: '0.9rem', color: '#666' }}>Out of 5 stars</p>
        </div>

        <div className="card">
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
