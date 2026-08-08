import React, { useState, useEffect } from 'react';
import { useLocation, Link } from 'react-router-dom';
import { getPackages } from '../services/api';
import Card from '../components/Card';
import Button from '../components/Button';
import Spinner from '../components/Spinner';

const defaultPackages = [
  {
    _id: 'meghalaya-1',
    category: 'Standard',
    destination: 'Meghalaya',
    title: 'Meghalaya Highlights',
    duration: '5 Days / 4 Nights',
    description: 'Living root bridges, waterfalls, clean villages and the wettest places on earth. A classic first trip into the hills.',
    price: 18900,
    image: 'https://images.unsplash.com/photo-1582510003544-4d00b7f74220?auto=format&fit=crop&w=800&q=80'
  },
  {
    _id: 'assam-1',
    category: 'Deluxe',
    destination: 'Assam',
    title: 'Kaziranga Safari',
    duration: '3 Days / 2 Nights',
    description: 'One-horned rhinos, early morning jeep safaris and quiet stays near the park. Ideal as a short break or add-on.',
    price: 12500,
    image: 'https://images.unsplash.com/photo-1566073771259-6a8506099945?auto=format&fit=crop&w=800&q=80'
  },
  {
    _id: 'arunachal-1',
    category: 'Luxury',
    destination: 'Arunachal Pradesh',
    title: 'Tawang Circuit',
    duration: '7 Days / 6 Nights',
    description: 'High mountain monastery, clear lakes, Sela Pass and quiet Buddhist culture. For those who like altitude and calm.',
    price: 34900,
    image: 'https://images.unsplash.com/photo-1544735716-392fe2489ffa?auto=format&fit=crop&w=800&q=80'
  },
  {
    _id: 'sikkim-1',
    category: 'Standard',
    destination: 'Sikkim',
    title: 'Sikkim Essentials',
    duration: '6 Days / 5 Nights',
    description: 'Mountain views, monasteries, lakes and the road to high passes. A balanced mix of comfort and scenery.',
    price: 28500,
    image: 'https://images.unsplash.com/photo-1506905925346-21bda4d32df4?auto=format&fit=crop&w=800&q=80'
  },
  {
    _id: 'multistate-1',
    category: 'Deluxe',
    destination: 'Multi-State',
    title: 'Assam + Meghalaya Combo',
    duration: '8 Days / 7 Nights',
    description: 'Wildlife safaris in the morning, root bridges and waterfalls in the afternoon. Two distinct landscapes in one trip.',
    price: 32900,
    image: 'https://images.unsplash.com/photo-1464822759023-fed622ff2c3b?auto=format&fit=crop&w=800&q=80'
  }
];

const filterCategories = ['All', 'Meghalaya', 'Assam', 'Arunachal', 'Sikkim', 'Multi-State'];

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

  const displayPackages = React.useMemo(() => {
    const list = dbPackages.length > 0 ? dbPackages : defaultPackages;

    return list.filter((pkg) => {
      if (activeFilter === 'All') return true;
      const dest = pkg.destination || pkg.badge || '';
      return dest.toLowerCase().includes(activeFilter.toLowerCase());
    });
  }, [dbPackages, activeFilter]);

  return (
    <div>
      {/* Page Hero */}
      <section className="page-hero">
        <div className="container">
          <h1>Tour Packages</h1>
          <p>
            Curated trips across North East India — from short escapes to longer circuits. Customise any itinerary to match your style.
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
      <section className="packages-section" style={{ padding: '60px 0', backgroundColor: 'var(--white)' }}>
        <div className="container">
          {loading ? (
            <Spinner />
          ) : displayPackages.length === 0 ? (
            <div style={{ textAlign: 'center', padding: '4rem 1rem' }}>
              <h3 style={{ fontSize: '1.25rem', fontWeight: 700, color: 'var(--slate-900)' }}>No packages found for "{activeFilter}"</h3>
              <p style={{ color: 'var(--slate-500)', marginTop: '0.5rem' }}>
                We can customize a specific itinerary for you in this region!
              </p>
              <Link to="/contact" className="btn btn-primary" style={{ marginTop: '1.25rem' }}>
                Request Custom Itinerary
              </Link>
            </div>
          ) : (
            <div className="packages-grid">
              {displayPackages.map((pkg) => {
                const coverImg = pkg.image || (Array.isArray(pkg.images) && pkg.images[0]) || 'https://images.unsplash.com/photo-1469854523086-cc02fe5d8800?auto=format&fit=crop&w=800&q=80';
                const pkgCategory = pkg.category || 'Standard';

                return (
                  <Card key={pkg._id || pkg.id} className="package-card" style={{ textAlign: 'left' }}>
                    <div className="package-card-img">
                      <img src={coverImg} alt={pkg.title} />
                      <span className="package-card-tag">{pkg.duration || '5 Days'}</span>
                      <span className={`badge-category badge-category-${pkgCategory.toLowerCase()} package-card-category-badge`}>
                        {pkgCategory}
                      </span>
                    </div>
                    <div className="package-card-content">
                      <div className="package-card-meta">
                        <span>
                          <svg width="14" height="14" fill="none" stroke="currentColor" strokeWidth="2" viewBox="0 0 24 24" style={{ verticalAlign: 'middle', marginRight: '4px' }}>
                            <path d="M12 2C8.13 2 5 5.13 5 9c0 5.25 7 13 7 13s7-7.75 7-13c0-3.87-3.13-7-7-7z"/>
                            <circle cx="12" cy="9" r="2"/>
                          </svg>
                          {pkg.destination || pkg.route || 'North East India'}
                        </span>
                      </div>
                      <h3 className="package-card-title">{pkg.title}</h3>
                      <p className="package-card-desc">{pkg.description}</p>
                      <div className="package-card-footer">
                        <div className="package-card-price">
                          <span>Starting from</span> <br />
                          {typeof pkg.price === 'number' ? `₹${pkg.price.toLocaleString('en-IN')}` : (pkg.price || 'Best Rates')}
                        </div>
                        <Link to={`/packages/${pkg._id || pkg.id}`}>
                          <Button variant="primary" size="sm">View Details</Button>
                        </Link>
                      </div>
                    </div>
                  </Card>
                );
              })}
            </div>
          )}

          <p className="packages-note" style={{ textAlign: 'center', marginTop: '2.5rem', color: 'var(--slate-500)', fontSize: '0.88rem' }}>
            Prices are indicative and depend on season, group size, and stay category.{' '}
            <Link to="/contact" style={{ color: 'var(--teal)', fontWeight: 600 }}>Talk to us</Link> for an exact custom quote.
          </p>
        </div>
      </section>

      {/* CTA */}
      <div className="container" style={{ paddingBottom: '5rem' }}>
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
