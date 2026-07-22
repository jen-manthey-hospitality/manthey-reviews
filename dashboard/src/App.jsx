import React, { useState, useEffect } from 'react'
import { createClient } from '@supabase/supabase-js'
import Reviews from './Reviews'

const supabase = createClient(
  'https://ofgicptdoygttkyndrnb.supabase.co',
  'sb_publishable_CSaPz3PkfOn6eEUpBoWxWQ_l7IaTzAK'
)

export default function App() {
  const [currentPage, setCurrentPage] = useState('dashboard')
  const [stats, setStats] = useState(null)
  const [allReviews, setAllReviews] = useState([])
  const [loading, setLoading] = useState(true)
  const [selectedProperty, setSelectedProperty] = useState('all')

  useEffect(() => {
    async function loadData() {
      try {
        const { data: reviews, error: reviewsError } = await supabase
          .from('reviews')
          .select('*')
          .order('review_date', { ascending: false })

        if (reviewsError) throw reviewsError

        const { data: staffData, error: staffError } = await supabase
          .from('staff_mentions')
          .select('*')

        if (staffError) throw staffError

        const { data: featureData, error: featureError } = await supabase
          .from('feature_mentions')
          .select('*')

        if (featureError) throw featureError

        setAllReviews(reviews || [])

        const properties = [
          { id: 'yacht-starship', name: 'Yacht StarShip', reviews: reviews?.filter(r => r.property_id === 'yacht-starship').length || 0 },
          { id: 'craft-tampa', name: 'Craft Tampa', reviews: reviews?.filter(r => r.property_id === 'craft-tampa').length || 0 },
          { id: 'pirate-water-taxi', name: 'Pirate Water Taxi', reviews: reviews?.filter(r => r.property_id === 'pirate-water-taxi').length || 0 },
          { id: 'nashville-riverboat', name: 'Nashville Riverboat', reviews: reviews?.filter(r => r.property_id === 'nashville-riverboat').length || 0 },
          { id: 'lost-pearl', name: 'Lost Pearl', reviews: reviews?.filter(r => r.property_id === 'lost-pearl').length || 0 }
        ]

        const totalReviews = reviews?.length || 0
        const avgRating = reviews && reviews.length > 0
          ? (reviews.reduce((sum, r) => sum + r.rating, 0) / reviews.length).toFixed(1)
          : 0
        const positiveCount = reviews?.filter(r => r.sentiment === 'positive').length || 0
        const negativeCount = reviews?.filter(r => r.sentiment === 'negative').length || 0

        const staffMentions = {}
        staffData?.forEach(mention => {
          if (!staffMentions[mention.staff_name]) {
            staffMentions[mention.staff_name] = { positive: 0, negative: 0 }
          }
          if (mention.sentiment === 'positive') staffMentions[mention.staff_name].positive++
          else if (mention.sentiment === 'negative') staffMentions[mention.staff_name].negative++
        })

        const topStaff = Object.entries(staffMentions)
          .map(([name, counts]) => ({ name, positive: counts.positive, negative: counts.negative }))
          .sort((a, b) => b.positive - a.positive)
          .slice(0, 4)

        const features = {}
        featureData?.forEach(mention => {
          if (!features[mention.feature_type]) {
            features[mention.feature_type] = { positive: 0, negative: 0 }
          }
          if (mention.sentiment === 'positive') features[mention.feature_type].positive++
          else if (mention.sentiment === 'negative') features[mention.feature_type].negative++
        })

        const featureList = Object.entries(features).map(([type, counts]) => ({
          name: type.split('_').map(w => w.charAt(0).toUpperCase() + w.slice(1)).join(' '),
          positive: counts.positive,
          negative: counts.negative
        }))

        setStats({
          totalReviews,
          avgRating,
          positiveCount,
          negativeCount,
          neutralCount: totalReviews - positiveCount - negativeCount,
          topStaff: topStaff.length > 0 ? topStaff : [{ name: 'No staff mentions yet', positive: 0, negative: 0 }],
          features: featureList.length > 0 ? featureList : [{ name: 'Live Music', positive: 0, negative: 0 }],
          properties
        })
      } catch (error) {
        console.error('Error loading data:', error)
        setStats(null)
      } finally {
        setLoading(false)
      }
    }

    loadData()
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
