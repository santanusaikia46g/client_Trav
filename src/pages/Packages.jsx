import React, { useState, useEffect } from 'react';
import { useLocation, Link } from 'react-router-dom';
import { getPackages } from '../services/api';

const defaultPackages = [
  {
    _id: 'meghalaya-1',
    badge: 'Meghalaya',
    title: 'Meghalaya Highlights',
    duration: '5 days',
    route: 'Shillong · Cherrapunji',
    description: 'Living root bridges, waterfalls, clean villages and the wettest places on earth. A classic first trip into the hills.',
    price: 18900,
    priceLabel: '/ person',
    image: 'https://images.unsplash.com/photo-1582510003544-4d00b7f74220?auto=format&fit=crop&w=800&q=80',
    buttonText: 'Enquire',
    buttonStyle: 'btn-outline',
    link: '/contact'
  },
  {
    _id: 'assam-1',
    badge: 'Assam',
    title: 'Kaziranga Safari',
    duration: '3 days',
    route: 'Kaziranga NP',
    description: 'One-horned rhinos, early morning jeep safaris and quiet stays near the park. Ideal as a short break or add-on.',
    price: 12500,
    priceLabel: '/ person',
    image: 'https://images.unsplash.com/photo-1566073771259-6a8506099945?auto=format&fit=crop&w=800&q=80',
    buttonText: 'Enquire',
    buttonStyle: 'btn-outline',
    link: '/contact'
  },
  {
    _id: 'arunachal-1',
    badge: 'Arunachal',
    title: 'Tawang Circuit',
    duration: '7 days',
    route: 'Tawang · Sela Pass',
    description: 'High mountain monastery, clear lakes, Sela Pass and quiet Buddhist culture. For those who like altitude and calm.',
    price: 34900,
    priceLabel: '/ person',
    image: 'https://images.unsplash.com/photo-1544735716-392fe2489ffa?auto=format&fit=crop&w=800&q=80',
    buttonText: 'Enquire',
    buttonStyle: 'btn-outline',
    link: '/contact'
  },
  {
    _id: 'sikkim-1',
    badge: 'Sikkim',
    title: 'Sikkim Essentials',
    duration: '6 days',
    route: 'Gangtok · North Sikkim',
    description: 'Mountain views, monasteries, lakes and the road to high passes. A balanced mix of comfort and scenery.',
    price: 28500,
    priceLabel: '/ person',
    image: 'https://images.unsplash.com/photo-1506905925346-21bda4d32df4?auto=format&fit=crop&w=800&q=80',
    buttonText: 'Enquire',
    buttonStyle: 'btn-outline',
    link: '/contact'
  },
  {
    _id: 'multistate-1',
    badge: 'Multi-state',
    title: 'Assam + Meghalaya',
    duration: '8 days',
    route: 'Kaziranga · Shillong',
    description: 'Wildlife in the morning, root bridges and waterfalls in the afternoon. Two very different landscapes in one trip.',
    price: 32900,
    priceLabel: '/ person',
    image: 'https://images.unsplash.com/photo-1464822759023-fed622ff2c3b?auto=format&fit=crop&w=800&q=80',
    buttonText: 'Enquire',
    buttonStyle: 'btn-outline',
    link: '/contact'
  },
  {
    _id: 'custom-1',
    badge: 'Custom',
    title: 'Fully Custom Trip',
    duration: 'Flexible',
    route: 'Your route',
    description: 'Tell us your dates, interests and budget. We’ll design a North East itinerary that fits — solo, couple or group.',
    price: 'On request',
    priceLabel: '',
    image: 'https://images.unsplash.com/photo-1488646953014-85cb44e25828?auto=format&fit=crop&w=800&q=80',
    buttonText: 'Plan with us',
    buttonStyle: 'btn-primary',
    link: '/contact'
  }
];

const filterCategories = ['All', 'Meghalaya', 'Assam', 'Arunachal', 'Sikkim', 'Multi-state'];

const useQuery = () => {
  return new URLSearchParams(useLocation().search);
};

const Packages = () => {
  const queryParams = useQuery();
  const initialDest = queryParams.get('destination') || 'All';
  
  const [activeFilter, setActiveFilter] = useState(
    filterCategories.includes(initialDest) ? initialDest : 'All'
  );
  const [dbPackages, setDbPackages] = useState([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    document.title = 'Tour Packages – Travmitraa | North East India';
    const metaDesc = document.querySelector('meta[name="description"]');
    if (metaDesc) {
      metaDesc.setAttribute(
        'content',
        'Curated trips across the North East — from short escapes to longer circuits. Customise any itinerary to match your pace.'
      );
    }
  }, []);

  useEffect(() => {
    const fetchPackages = async () => {
      try {
        const data = await getPackages();
        if (Array.isArray(data) && data.length > 0) {
          setDbPackages(data);
        }
      } catch (err) {
        console.error('Error loading DB packages:', err);
      } finally {
        setLoading(false);
      }
    };
    fetchPackages();
  }, []);

  // Filter logic: combine API packages if available, otherwise filter defaultPackages
  const displayPackages = React.useMemo(() => {
    if (dbPackages.length > 0) {
      return dbPackages
        .map((pkg) => ({
          _id: pkg._id,
          badge: pkg.destination || 'North East',
          title: pkg.title,
          duration: pkg.duration || 'Custom',
          route: pkg.destination || 'North East India',
          description: pkg.description,
          price: typeof pkg.price === 'number' ? `From ₹${pkg.price.toLocaleString('en-IN')}` : pkg.price,
          priceLabel: typeof pkg.price === 'number' ? '/ person' : '',
          image: (pkg.images && pkg.images[0]) || 'https://images.unsplash.com/photo-1506905925346-21bda4d32df4?auto=format&fit=crop&w=800&q=80',
          buttonText: 'Enquire',
          buttonStyle: 'btn-outline',
          link: `/contact`
        }))
        .filter((pkg) => {
          if (activeFilter === 'All') return true;
          return pkg.badge.toLowerCase().includes(activeFilter.toLowerCase());
        });
    }

    // Default static fallbacks
    return defaultPackages.filter((pkg) => {
      if (activeFilter === 'All') return true;
      return pkg.badge.toLowerCase() === activeFilter.toLowerCase();
    });
  }, [dbPackages, activeFilter]);

  return (
    <div>
      {/* Page Hero */}
      <section className="page-hero">
        <div className="container">
          <h1>Tour packages</h1>
          <p>
            Curated trips across the North East — from short escapes to longer circuits. Customise any itinerary to match your pace.
          </p>
        </div>
      </section>

      {/* Filter Bar */}
      <div className="filters">
        <div className="container">
          <div className="filter-bar">
            {filterCategories.map((cat) => (
              <button
                key={cat}
                type="button"
                className={`filter-btn ${activeFilter === cat ? 'active' : ''}`}
                onClick={() => setActiveFilter(cat)}
              >
                {cat}
              </button>
            ))}
          </div>
        </div>
      </div>

      {/* Packages Grid */}
      <section className="packages-section">
        <div className="container">
          {loading ? (
            <div className="packages-grid">
              {[1, 2, 3].map((n) => (
                <div key={n} className="package-card" style={{ height: '380px', opacity: 0.6 }} />
              ))}
            </div>
          ) : displayPackages.length === 0 ? (
            <div style={{ textAlign: 'center', padding: '3rem 1rem' }}>
              <h3>No packages found for "{activeFilter}"</h3>
              <p style={{ color: 'var(--slate-500)', marginTop: '0.5rem' }}>
                We can customize a specific itinerary for you in this region!
              </p>
              <Link to="/contact" className="btn btn-primary" style={{ marginTop: '1.25rem' }}>
                Request Custom Itinerary
              </Link>
            </div>
          ) : (
            <div className="packages-grid">
              {displayPackages.map((pkg) => (
                <article key={pkg._id} className="package-card">
                  <div
                    className="package-img"
                    style={{ backgroundImage: `url('${pkg.image}')` }}
                  >
                    <span className="package-badge">{pkg.badge}</span>
                  </div>
                  <div className="package-body">
                    <h3>{pkg.title}</h3>
                    <div className="package-meta">
                      <span>{pkg.duration}</span>
                      <span>{pkg.route}</span>
                    </div>
                    <p>{pkg.description}</p>
                    <div className="package-footer">
                      <div className="package-price">
                        {typeof pkg.price === 'number' ? `From ₹${pkg.price.toLocaleString('en-IN')}` : pkg.price}{' '}
                        {pkg.priceLabel && <span>{pkg.priceLabel}</span>}
                      </div>
                      <Link to={pkg.link} className={`btn ${pkg.buttonStyle}`}>
                        {pkg.buttonText}
                      </Link>
                    </div>
                  </div>
                </article>
              ))}
            </div>
          )}

          <p className="packages-note">
            Prices are indicative and depend on season, group size and stay category.{' '}
            <Link to="/contact">Talk to us</Link> for an exact quote.
          </p>
        </div>
      </section>

      {/* CTA */}
      <div className="container">
        <div className="cta-band">
          <h2>Don’t see the exact trip you want?</h2>
          <p>
            Most of our journeys are built around you. Share your dates and ideas — we’ll shape something that fits.
          </p>
          <Link to="/contact" className="btn btn-white">
            Start planning
          </Link>
        </div>
      </div>
    </div>
  );
};

export default Packages;
