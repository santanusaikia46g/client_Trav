import React, { useState, useEffect } from 'react';
import { Link } from 'react-router-dom';
import { getDestinations } from '../services/api';

const Destinations = () => {
  const [destinations, setDestinations] = useState([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    document.title = 'Destinations – Travmitraa | North East India';
    const metaDesc = document.querySelector('meta[name="description"]');
    if (metaDesc) {
      metaDesc.setAttribute(
        'content',
        'Explore eight states across North East India: Assam, Meghalaya, Arunachal Pradesh, Sikkim, Nagaland and beyond.'
      );
    }

    const fetchDestinations = async () => {
      try {
        const data = await getDestinations();
        if (Array.isArray(data)) {
          setDestinations(data);
        }
      } catch (err) {
        console.error('Failed to load API destinations:', err);
      } finally {
        setLoading(false);
      }
    };

    fetchDestinations();
  }, []);

  const displayDestinations = React.useMemo(() => {
    return destinations.map((dest) => ({
      _id: dest._id || dest.id,
      name: dest.name,
      meta: dest.bestTime || dest.best_time_to_visit ? `Best: ${dest.bestTime || dest.best_time_to_visit}` : 'Best: All year',
      description: dest.description || 'Discover incredible landscapes and rich local heritage in this region.',
      image: dest.image || 'https://images.unsplash.com/photo-1582510003544-4d00b7f74220?auto=format&fit=crop&w=800&q=80',
      tags: dest.tags && dest.tags.length > 0 ? dest.tags : ['Hills', 'Culture', 'Nature'],
      viewLink: `/packages?destination=${encodeURIComponent(dest.name)}`,
      viewLabel: 'View packages'
    }));
  }, [destinations]);

  return (
    <div>
      {/* Page Hero */}
      <section className="page-hero">
        <div className="container">
          <h1>Destinations</h1>
          <p>Eight states, one region — hills, parks, monasteries, rivers and living cultures across North East India.</p>
        </div>
      </section>

      {/* Intro section */}
      <section className="intro">
        <div className="container">
          <p>
            We specialise in the North East. Below is a quick look at the places we know best — pick a region and we’ll shape a trip around it.
          </p>
        </div>
      </section>

      {/* Destinations Grid */}
      <section className="dest-section">
        <div className="container">
          {loading ? (
            <div className="dest-grid">
              {[1, 2, 3, 4].map((n) => (
                <div key={n} className="dest-card" style={{ height: '220px', opacity: 0.6 }} />
              ))}
            </div>
          ) : displayDestinations.length === 0 ? (
            <div style={{ textAlign: 'center', padding: '4rem 1rem', background: '#ffffff', borderRadius: '12px', border: '1px dashed #cbd5e1' }}>
              <h3 style={{ color: 'var(--slate-800)', fontSize: '1.25rem', marginBottom: '0.5rem' }}>No Destinations Listed</h3>
              <p style={{ color: 'var(--slate-500)', fontSize: '0.95rem' }}>
                Destinations added in the Admin Dashboard will appear here automatically.
              </p>
            </div>
          ) : (
            <div className="dest-grid">
              {displayDestinations.map((dest) => (
                <article key={dest._id} className="dest-card">
                  <div
                    className="dest-img"
                    style={{ backgroundImage: `url('${dest.image}')` }}
                  />
                  <div className="dest-body">
                    <h2>{dest.name}</h2>
                    <p className="dest-meta">{dest.meta}</p>
                    <p>{dest.description}</p>
                    <div className="dest-tags">
                      {dest.tags.map((tag, idx) => (
                        <span key={idx}>{tag}</span>
                      ))}
                    </div>
                    <div className="dest-actions">
                      <Link to={dest.viewLink} className="btn btn-outline">
                        {dest.viewLabel}
                      </Link>
                      <Link to="/contact" className="btn btn-primary">
                        Enquire
                      </Link>
                    </div>
                  </div>
                </article>
              ))}
            </div>
          )}
        </div>
      </section>

      {/* CTA */}
      <div className="container">
        <div className="cta-band">
          <h2>Not sure where to start?</h2>
          <p>Tell us your dates, pace and interests. We’ll suggest a route across one or more of these states.</p>
          <Link to="/contact" className="btn btn-white">
            Talk to us
          </Link>
        </div>
      </div>
    </div>
  );
};

export default Destinations;
