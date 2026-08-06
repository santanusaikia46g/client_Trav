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

const FALLBACK_DESTINATIONS = [
  {
    _id: 'fallback-1',
    name: 'Meghalaya Highlands',
    description: 'Living root bridges, waterfalls, clean villages and the wettest places on earth.',
    image: 'https://images.unsplash.com/photo-1506905925346-21bda4d32df4?auto=format&fit=crop&w=800&q=80',
    meta: 'Meghalaya · 5–7 days',
    priceText: 'From ₹28,500'
  },
  {
    _id: 'fallback-2',
    name: 'Kaziranga National Park',
    description: 'Home to the one-horned rhino. Jeep safaris at dawn through grasslands and wetlands.',
    image: 'https://images.unsplash.com/photo-1516426122078-c23e76319801?auto=format&fit=crop&w=800&q=80',
    meta: 'Assam · 3–4 days',
    priceText: 'From ₹18,900'
  },
  {
    _id: 'fallback-3',
    name: 'Tawang & Arunachal',
    description: 'High mountain monastery, Sela Pass, clear lakes and quiet Buddhist culture.',
    image: 'https://images.unsplash.com/photo-1464822759023-fed622ff2c3b?auto=format&fit=crop&w=800&q=80',
    meta: 'Arunachal · 6–8 days',
    priceText: 'From ₹34,900'
  }
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
          getPackages(),
          getDestinations()
        ]);
        setPackages(pkgsData.slice(0, 3));
        setDestinations(destsData.length > 0 ? destsData.slice(0, 6) : FALLBACK_DESTINATIONS);
      } catch (err) {
        console.error('Failed to load home page data:', err);
        setDestinations(FALLBACK_DESTINATIONS);
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

      {/* Destinations */}
      <section className="destinations" id="destinations" style={{ padding: '5rem 0' }}>
        <div className="container">
          <div className="section-header">
            <h2>Popular North East destinations</h2>
            <p>Hand-picked places that show the real character of the region.</p>
          </div>

          {loading ? (
            <Spinner />
          ) : (
            <div className="dest-grid">
              {(destinations.length > 0 ? destinations : FALLBACK_DESTINATIONS).map((dest) => (
                <article key={dest._id || dest.name} className="dest-card">
                  <img src={dest.image} alt={dest.name} />
                  <div className="dest-body">
                    <h3>{dest.name}</h3>
                    <p>{dest.description || 'Explore scenic landscapes, cultural heritage, and guided excursions.'}</p>
                    <div className="dest-meta">
                      <span className="location">{dest.meta || `${dest.name} · Tour`}</span>
                      <span className="price">{dest.priceText || (dest.price ? `From ₹${dest.price.toLocaleString('en-IN')}` : 'Best Rates')}</span>
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
                    <img src={pkg.images[0] || 'https://images.unsplash.com/photo-1469854523086-cc02fe5d8800?auto=format&fit=crop&w=800&q=80'} alt={pkg.title} />
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
                        ₹{pkg.price.toLocaleString('en-IN')}
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
          <div className="section-header">
            <h2>Why travel the North East with us</h2>
            <p>We know the permits, the roads and the people who make the trip special.</p>
          </div>

          <div className="features">
            <div className="feature">
              <div className="feature-icon">
                <svg xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth="1.8">
                  <path strokeLinecap="round" strokeLinejoin="round" d="M9 12l2 2 4-4m5.618-4.016A11.955 11.955 0 0112 2.944a11.955 11.955 0 01-8.618 3.04A12.02 12.02 0 003 9c0 5.591 3.824 10.29 9 11.622 5.176-1.332 9-6.03 9-11.622 0-1.042-.133-2.052-.382-3.016z" />
                </svg>
              </div>
              <h3>Local know-how</h3>
              <p>ILPs, best seasons, reliable drivers and stays that feel like home — sorted for you.</p>
            </div>

            <div className="feature">
              <div className="feature-icon">
                <svg xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth="1.8">
                  <path strokeLinecap="round" strokeLinejoin="round" d="M17.657 16.657L13.414 20.9a1.998 1.998 0 01-2.827 0l-4.244-4.243a8 8 0 1111.314 0z" />
                  <path strokeLinecap="round" strokeLinejoin="round" d="M15 11a3 3 0 11-6 0 3 3 0 016 0z" />
                </svg>
              </div>
              <h3>Real experiences</h3>
              <p>Homestays, village walks, root-bridge treks and early morning safaris with people who live there.</p>
            </div>

            <div className="feature">
              <div className="feature-icon">
                <svg xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth="1.8">
                  <path strokeLinecap="round" strokeLinejoin="round" d="M18.364 5.636l-3.536 3.536m0 5.656l3.536 3.536M9.172 9.172L5.636 5.636m3.536 9.192l-3.536 3.536M21 12a9 9 0 11-18 0 9 9 0 0118 0zm-5 0a4 4 0 11-8 0 4 4 0 018 0z" />
                </svg>
              </div>
              <h3>Support that stays</h3>
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
