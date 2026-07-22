import React, { useState, useEffect } from 'react'

export default function Reviews({ onBack, allReviews = [], properties = [] }) {
  const [filteredReviews, setFilteredReviews] = useState(allReviews)
  const [propertyFilter, setPropertyFilter] = useState('all')
  const [sentimentFilter, setSentimentFilter] = useState('all')
  const [searchText, setSearchText] = useState('')

  useEffect(() => {
    let filtered = allReviews

    if (propertyFilter !== 'all') {
      filtered = filtered.filter(r => r.property_id === propertyFilter)
    }

    if (sentimentFilter !== 'all') {
      filtered = filtered.filter(r => r.sentiment === sentimentFilter)
    }

    if (searchText) {
      filtered = filtered.filter(r => r.text.toLowerCase().includes(searchText.toLowerCase()))
    }

    setFilteredReviews(filtered)
  }, [propertyFilter, sentimentFilter, searchText, allReviews])

  const getPropertyName = (id) => properties.find(p => p.id === id)?.name || id
  const getSentimentColor = (sentiment) => {
    switch(sentiment) {
      case 'positive': return '#28a745'
      case 'negative': return '#dc3545'
      default: return '#6c757d'
    }
  }

  return (
    <div className="container">
      <div style={{ marginBottom: '2rem' }}>
        <button
          onClick={onBack}
          style={{
            padding: '0.5rem 1rem',
            backgroundColor: '#6c757d',
            color: '#fff',
            border: 'none',
            borderRadius: '4px',
            cursor: 'pointer',
            fontSize: '0.95rem'
          }}
        >
          ← Back to Dashboard
        </button>
      </div>

      <div className="header">
        <h1>📋 All Reviews</h1>
        <p>Browse, filter, and search all customer reviews across properties</p>
      </div>

      <div className="card" style={{ marginBottom: '2rem' }}>
        <h3 style={{ marginBottom: '1rem' }}>Filters</h3>

        <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fit, minmax(200px, 1fr))', gap: '1rem' }}>
          <div>
            <label style={{ display: 'block', marginBottom: '0.5rem', fontWeight: 'bold' }}>Property</label>
            <select
              value={propertyFilter}
              onChange={(e) => setPropertyFilter(e.target.value)}
              style={{
                width: '100%',
                padding: '0.5rem',
                borderRadius: '4px',
                border: '1px solid #ddd',
                fontSize: '0.95rem'
              }}
            >
              <option value="all">All Properties</option>
              {properties.map(p => (
                <option key={p.id} value={p.id}>{p.name}</option>
              ))}
            </select>
          </div>

          <div>
            <label style={{ display: 'block', marginBottom: '0.5rem', fontWeight: 'bold' }}>Sentiment</label>
            <select
              value={sentimentFilter}
              onChange={(e) => setSentimentFilter(e.target.value)}
              style={{
                width: '100%',
                padding: '0.5rem',
                borderRadius: '4px',
                border: '1px solid #ddd',
                fontSize: '0.95rem'
              }}
            >
              <option value="all">All Sentiments</option>
              <option value="positive">Positive Only</option>
              <option value="negative">Negative Only</option>
              <option value="neutral">Neutral Only</option>
            </select>
          </div>

          <div>
            <label style={{ display: 'block', marginBottom: '0.5rem', fontWeight: 'bold' }}>Search</label>
            <input
              type="text"
              placeholder="Search reviews..."
              value={searchText}
              onChange={(e) => setSearchText(e.target.value)}
              style={{
                width: '100%',
                padding: '0.5rem',
                borderRadius: '4px',
                border: '1px solid #ddd',
                fontSize: '0.95rem'
              }}
            />
          </div>
        </div>
      </div>

      <div style={{ marginBottom: '1rem', color: '#666' }}>
        <strong>{filteredReviews.length}</strong> review{filteredReviews.length !== 1 ? 's' : ''} matching filters
      </div>

      <div>
        {filteredReviews.length === 0 ? (
          <div className="card" style={{ textAlign: 'center', padding: '2rem', color: '#666' }}>
            <p>No reviews found matching your filters.</p>
          </div>
        ) : (
          filteredReviews.map((review) => (
            <div
              key={review.id}
              className="card"
              style={{ marginBottom: '1rem', borderLeft: `4px solid ${getSentimentColor(review.sentiment)}` }}
            >
              <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'start', marginBottom: '0.75rem' }}>
                <div>
                  <h3 style={{ fontSize: '1rem', marginBottom: '0.25rem' }}>
                    {getPropertyName(review.property_id)}
                  </h3>
                  <div style={{ color: '#666', fontSize: '0.85rem' }}>
                    <span style={{ marginRight: '1rem' }}>⭐ {review.rating}/5</span>
                    <span style={{ marginRight: '1rem' }}>By {review.reviewer_name || 'Anonymous'}</span>
                    <span>{review.review_date}</span>
                  </div>
                </div>
                <span
                  style={{
                    padding: '0.25rem 0.75rem',
                    borderRadius: '20px',
                    fontSize: '0.8rem',
                    fontWeight: 'bold',
                    backgroundColor: review.sentiment === 'positive' ? '#d4edda' : review.sentiment === 'negative' ? '#f8d7da' : '#e2e3e5',
                    color: review.sentiment === 'positive' ? '#155724' : review.sentiment === 'negative' ? '#721c24' : '#383d41'
                  }}
                >
                  {review.sentiment.toUpperCase()}
                </span>
              </div>

              <p style={{
                lineHeight: '1.6',
                color: '#333',
                marginBottom: '0.75rem',
                padding: '0.75rem',
                backgroundColor: '#f9f9f9',
                borderRadius: '4px'
              }}>
                {review.text}
              </p>
            </div>
          ))
        )}
      </div>
    </div>
  )
}
