import React, { useState, useEffect } from 'react';
import { Link } from 'react-router-dom';
import { getPackages, getDestinations } from '../services/api';
import Card from '../components/Card';
import Button from '../components/Button';
import Spinner from '../components/Spinner';

const testimonials = [
  {
    name: 'Suresh Kumar',
    location: 'Delhi',
    rating: 5,
    quote: 'Our trip to Meghalaya organized by Travmitraa was absolutely seamless. From root bridge treks to homestays, everything was top-notch. Highly recommended!',
    avatar: 'https://images.unsplash.com/photo-1507003211169-0a1dd7228f2d?auto=format&fit=crop&w=150&h=150&q=80'
  },
  {
    name: 'Priyanka Sen',
    location: 'Kolkata',
    rating: 5,
    quote: 'Tawang monastery and Sela Pass were on my bucket list for years. Travmitraa arranged permits, great vehicle and experienced local driver. Incredible care!',
    avatar: 'https://images.unsplash.com/photo-1494790108377-be9c29b29330?auto=format&fit=crop&w=150&h=150&q=80'
  },
  {
    name: 'Abhishek Roy',
    location: 'Mumbai',
    rating: 4,
    quote: 'Kaziranga safari and Majuli village tour were unforgettable. Prompt helpline and local guides who know every hidden gem in Assam.',
    avatar: 'https://images.unsplash.com/photo-1500648767791-00dcc994a43e?auto=format&fit=crop&w=150&h=150&q=80'
  }
];

const HERO_IMAGES = [
  'https://images.unsplash.com/photo-1506905925346-21bda4d32df4?auto=format&fit=crop&w=1920&q=80',
  'https://images.unsplash.com/photo-1516426122078-c23e76319801?auto=format&fit=crop&w=1920&q=80',
  'https://images.unsplash.com/photo-1464822759023-fed622ff2c3b?auto=format&fit=crop&w=1920&q=80'
];

const Home = () => {
  const [packages, setPackages] = useState([]);
  const [destinations, setDestinations] = useState([]);
  const [loading, setLoading] = useState(true);
  const [currentSlide, setCurrentSlide] = useState(0);

  useEffect(() => {
    const slideTimer = setInterval(() => {
      setCurrentSlide((prev) => (prev + 1) % HERO_IMAGES.length);
    }, 5000);
    return () => clearInterval(slideTimer);
  }, []);

  const handleNextSlide = () => {
    setCurrentSlide((prev) => (prev + 1) % HERO_IMAGES.length);
  };

  const handlePrevSlide = () => {
    setCurrentSlide((prev) => (prev - 1 + HERO_IMAGES.length) % HERO_IMAGES.length);
  };

  useEffect(() => {
    document.title = 'Travmitraa – North East India Travel';
    const metaDesc = document.querySelector('meta[name="description"]');
    if (metaDesc) {
      metaDesc.setAttribute(
        'content',
        'Explore living root bridges, misty hills, one-horned rhinos and mountain monasteries with Travmitraa.'
      );
    }

    const fetchData = async () => {
      try {
        const [pkgsData, destsData] = await Promise.all([
          getPackages().catch(() => []),
          getDestinations().catch(() => [])
        ]);
        setPackages(Array.isArray(pkgsData) ? pkgsData.slice(0, 3) : []);
        setDestinations(Array.isArray(destsData) ? destsData.slice(0, 6) : []);
      } catch (err) {
        console.error('Failed to load home page data:', err);
        setDestinations([]);
      } finally {
        setLoading(false);
      }
    };

    fetchData();
  }, []);

  return (
    <div>
      {/* Hero Section */}
      <section className="hero">
        <div className="hero-slider">
          {HERO_IMAGES.map((imgUrl, idx) => (
            <div
              key={idx}
              className={`hero-slide ${idx === currentSlide ? 'active' : ''}`}
              style={{
                backgroundImage: `linear-gradient(rgba(15, 23, 42, 0.45), rgba(15, 23, 42, 0.45)), url(${imgUrl})`
              }}
            />
          ))}
        </div>

        <button className="hero-nav-btn hero-nav-prev" onClick={handlePrevSlide} aria-label="Previous Slide">
          &#10094;
        </button>
        <button className="hero-nav-btn hero-nav-next" onClick={handleNextSlide} aria-label="Next Slide">
          &#10095;
        </button>

        <div className="container" style={{ position: 'relative', zIndex: 2 }}>
          <div className="hero-content">
            <h1>
              Let's travel <span style={{ color: '#fdba74' }}>together</span>
            </h1>
            <p>
              Explore living root bridges, misty hills, one-horned rhinos and mountain monasteries. We plan the details so you can enjoy the North East at your own pace.
            </p>
            <div className="hero-actions" style={{ display: 'flex', gap: '0.9rem', flexWrap: 'wrap' }}>
              <a href="#destinations" className="btn btn-primary">Explore destinations</a>
              <Link to="/contact" className="btn btn-white">Talk to an expert</Link>
            </div>
          </div>
        </div>

        <div className="hero-dots">
          {HERO_IMAGES.map((_, idx) => (
            <button
              key={idx}
              className={`hero-dot ${idx === currentSlide ? 'active' : ''}`}
              onClick={() => setCurrentSlide(idx)}
              aria-label={`Go to slide ${idx + 1}`}
            />
          ))}
        </div>
      </section>

      {/* Destinations Section */}
      <section className="destinations" id="destinations" style={{ padding: '5rem 0', backgroundColor: '#f8fafc' }}>
        <div className="container">
          <div className="section-header text-center">
            <h2 className="section-title">Popular North East Destinations</h2>
            <p className="section-subtitle">Hand-picked regions that reveal the natural wonder and rich heritage of North East India.</p>
          </div>

          {loading ? (
            <Spinner />
          ) : destinations.length === 0 ? (
            <div style={{ textAlign: 'center', padding: '3rem 1rem', background: '#ffffff', borderRadius: '12px', border: '1px dashed #cbd5e1' }}>
              <p style={{ color: 'var(--slate-500)', fontSize: '0.95rem' }}>
                No destinations listed yet. Destinations created in the Admin Dashboard will appear here automatically.
              </p>
            </div>
          ) : (
            <div className="dest-grid">
              {destinations.map((dest) => (
                <article key={dest._id || dest.id || dest.name} className="dest-card">
                  <div
                    className="dest-img"
                    style={{
                      backgroundImage: `url('${dest.image || 'https://images.unsplash.com/photo-1582510003544-4d00b7f74220?auto=format&fit=crop&w=800&q=80'}')`
                    }}
                  />
                  <div className="dest-body">
                    <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: '0.5rem' }}>
                      <h3 style={{ fontSize: '1.25rem', fontWeight: 800, color: 'var(--slate-900)', margin: 0 }}>{dest.name}</h3>
                      {(dest.bestTimeToVisit || dest.best_time_to_visit) && (
                        <span style={{ fontSize: '0.72rem', fontWeight: 700, background: '#ccfbf1', color: 'var(--teal)', padding: '0.2rem 0.55rem', borderRadius: '999px' }}>
                          Best: {dest.bestTimeToVisit || dest.best_time_to_visit}
                        </span>
                      )}
                    </div>
                    <p style={{ fontSize: '0.88rem', color: 'var(--slate-500)', lineHeight: '1.5', marginBottom: '1.25rem' }}>
                      {dest.description || 'Discover incredible mountain passes, ancient monasteries, and lush valleys.'}
                    </p>
                    <div style={{ display: 'flex', gap: '0.6rem', alignItems: 'center' }}>
                      <Link to={`/packages?destination=${encodeURIComponent(dest.name)}`} className="btn btn-outline btn-sm" style={{ width: '100%' }}>
                        Explore Packages →
                      </Link>
                    </div>
                  </div>
                </article>
              ))}
            </div>
          )}

          <div style={{ textAlign: 'center', marginTop: '3rem' }}>
            <Link to="/destinations">
              <Button variant="outline">View All Destinations</Button>
            </Link>
          </div>
        </div>
      </section>

      {/* Featured Packages */}
      <section className="section" style={{ backgroundColor: 'var(--white)' }}>
        <div className="container text-center">
          <h2 className="section-title">Featured Tour Packages</h2>
          <p className="section-subtitle">Our best-selling vacation bundles with comprehensive inclusions.</p>

          {loading ? (
            <Spinner />
          ) : packages.length === 0 ? (
            <p style={{ color: 'var(--medium)' }}>No packages available right now.</p>
          ) : (
            <div className="packages-grid">
              {packages.map((pkg) => (
                <Card key={pkg._id} className="package-card" style={{ textAlign: 'left' }}>
                  <div className="package-card-img">
                    <img src={pkg.image || (pkg.images && pkg.images[0]) || 'https://images.unsplash.com/photo-1469854523086-cc02fe5d8800?auto=format&fit=crop&w=800&q=80'} alt={pkg.title} />
                    <span className="package-card-tag">{pkg.duration}</span>
                    <span className={`badge-category badge-category-${(pkg.category || 'Standard').toLowerCase()} package-card-category-badge`}>
                      {pkg.category || 'Standard'}
                    </span>
                  </div>
                  <div className="package-card-content">
                    <div className="package-card-meta">
                      <span>
                        <svg width="14" height="14" fill="none" stroke="currentColor" strokeWidth="2" viewBox="0 0 24 24" style={{ verticalAlign: 'middle' }}>
                          <path d="M12 2C8.13 2 5 5.13 5 9c0 5.25 7 13 7 13s7-7.75 7-13c0-3.87-3.13-7-7-7z"/>
                          <circle cx="12" cy="9" r="2"/>
                        </svg>
                        {pkg.destination}
                      </span>
                    </div>
                    <h3 className="package-card-title">{pkg.title}</h3>
                    <p className="package-card-desc">{pkg.description}</p>
                    <div className="package-card-footer">
                      <div className="package-card-price">
                        <span>Starting from</span> <br />
                        ₹{pkg.price ? pkg.price.toLocaleString('en-IN') : 'N/A'}
                      </div>
                      <Link to={`/packages/${pkg._id}`}>
                        <Button variant="primary" size="sm">View Details</Button>
                      </Link>
                    </div>
                  </div>
                </Card>
              ))}
            </div>
          )}

          <div style={{ marginTop: '45px' }}>
            <Link to="/packages">
              <Button variant="outline">View All Packages</Button>
            </Link>
          </div>
        </div>
      </section>

      {/* Why Choose Us */}
      <section id="why" className="section" style={{ backgroundColor: 'var(--slate-50)' }}>
        <div className="container">
          <div className="section-header text-center">
            <h2 className="section-title">Why Travel The North East With Us</h2>
            <p className="section-subtitle">We know the permits, the roads and the people who make the trip special.</p>
          </div>

          <div className="features">
            <div className="feature">
              <div className="feature-icon">
                <svg xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth="1.8">
                  <path strokeLinecap="round" strokeLinejoin="round" d="M9 12l2 2 4-4m5.618-4.016A11.955 11.955 0 0112 2.944a11.955 11.955 0 01-8.618 3.04A12.02 12.02 0 003 9c0 5.591 3.824 10.29 9 11.622 5.176-1.332 9-6.03 9-11.622 0-1.042-.133-2.052-.382-3.016z" />
                </svg>
              </div>
              <h3>Local Know-How</h3>
              <p>ILPs, best seasons, reliable drivers and stays that feel like home — sorted for you.</p>
            </div>

            <div className="feature">
              <div className="feature-icon">
                <svg xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth="1.8">
                  <path strokeLinecap="round" strokeLinejoin="round" d="M17.657 16.657L13.414 20.9a1.998 1.998 0 01-2.827 0l-4.244-4.243a8 8 0 1111.314 0z" />
                  <path strokeLinecap="round" strokeLinejoin="round" d="M15 11a3 3 0 11-6 0 3 3 0 016 0z" />
                </svg>
              </div>
              <h3>Real Experiences</h3>
              <p>Homestays, village walks, root-bridge treks and early morning safaris with people who live there.</p>
            </div>

            <div className="feature">
              <div className="feature-icon">
                <svg xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth="1.8">
                  <path strokeLinecap="round" strokeLinejoin="round" d="M18.364 5.636l-3.536 3.536m0 5.656l3.536 3.536M9.172 9.172L5.636 5.636m3.536 9.192l-3.536 3.536M21 12a9 9 0 11-18 0 9 9 0 0118 0zm-5 0a4 4 0 11-8 0 4 4 0 018 0z" />
                </svg>
              </div>
              <h3>Support That Stays</h3>
              <p>From Guwahati arrival to the last mountain road, someone from our team is reachable.</p>
            </div>
          </div>
        </div>
      </section>

      {/* Testimonials */}
      <section className="section" style={{ backgroundColor: 'var(--white)' }}>
        <div className="container text-center">
          <h2 className="section-title">What Our Travelers Say</h2>
          <p className="section-subtitle">Feedback and ratings from our recent vacationers.</p>
          <div className="testimonials-grid">
            {testimonials.map((test, index) => (
              <div key={index} className="testimonial-card">
                <div className="rating">
                  {Array(5)
                    .fill(0)
                    .map((_, i) => (
                      <span key={i} style={{ color: i < test.rating ? '#f59e0b' : '#e2e8f0' }}>&#9733;</span>
                    ))}
                </div>
                <p className="testimonial-quote">"{test.quote}"</p>
                <div className="testimonial-user">
                  <img src={test.avatar} alt={test.name} className="testimonial-avatar" />
                  <div style={{ textAlign: 'left' }}>
                    <h4>{test.name}</h4>
                    <span>{test.location}</span>
                  </div>
                </div>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* CTA */}
      <section id="book" style={{ padding: '4rem 0 5rem' }}>
        <div className="container">
          <div className="cta-band">
            <h2>Ready to explore the North East?</h2>
            <p>Tell us your dates, pace and interests. We’ll shape a trip through the hills, parks and valleys that fits you.</p>
            <Link to="/contact" className="btn btn-white">Start planning</Link>
          </div>
        </div>
      </section>
    </div>
  );
};

export default Home;
