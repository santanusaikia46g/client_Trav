import React, { useState, useEffect } from 'react';
import { Link } from 'react-router-dom';
import { getPackages, getDestinations } from '../services/api';
import Card from '../components/Card';
import Button from '../components/Button';
import Spinner from '../components/Spinner';

import HeroScroll from '../components/HeroScroll';

const testimonials = [
  {
    name: 'Suresh Kumar',
    location: 'Delhi',
    rating: 5,
    quote: 'Our trip to Goa organized by Travmitra was absolutely seamless. From the airport pickup to the heritage site tours, everything was top-notch. Highly recommended!',
    avatar: 'https://images.unsplash.com/photo-1507003211169-0a1dd7228f2d?auto=format&fit=crop&w=150&h=150&q=80'
  },
  {
    name: 'Priyanka Sen',
    location: 'Kolkata',
    rating: 5,
    quote: 'Ladakh was on my bucket list for years, but I was scared of altitude sickness. Travmitra guide stayed with us, checked our oxygen levels, and planned a slow acclimation. Simply excellent care!',
    avatar: 'https://images.unsplash.com/photo-1494790108377-be9c29b29330?auto=format&fit=crop&w=150&h=150&q=80'
  },
  {
    name: 'Abhishek Roy',
    location: 'Mumbai',
    rating: 4,
    quote: 'Great rates and very clear itinerary. The Munnar resort stay in Kerala was beautiful. The only downside was a small delay in the private vehicle arrival on Day 3, but the driver compensated for it.',
    avatar: 'https://images.unsplash.com/photo-1500648767791-00dcc994a43e?auto=format&fit=crop&w=150&h=150&q=80'
  }
];

const Home = () => {
  const [packages, setPackages] = useState([]);
  const [destinations, setDestinations] = useState([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    document.title = 'Travmitra | Explore The World With Us';
    const metaDesc = document.querySelector('meta[name="description"]');
    if (metaDesc) {
      metaDesc.setAttribute('content', 'Travmitra is a premium travel agency offering affordable, custom tour packages, expert guides, and 24/7 client support. Book your dream vacation today!');
    }

    const fetchData = async () => {
      try {
        const [pkgsData, destsData] = await Promise.all([
          getPackages(),
          getDestinations()
        ]);
        // Get first 3 packages & first 6 destinations for clean home page layout
        setPackages(pkgsData.slice(0, 3));
        setDestinations(destsData.slice(0, 6));
      } catch (err) {
        console.error('Failed to load home page data:', err);
      } finally {
        setLoading(false);
      }
    };

    fetchData();
  }, []);

  return (
    <div>
      {/* 1. Hero Section Scroll */}
      <HeroScroll />

      {/* 2. Popular Destinations */}
      <section className="section" style={{ backgroundColor: 'var(--white)' }}>
        <div className="container text-center">
          <h2 className="section-title">Popular Destinations</h2>
          <p className="section-subtitle">Choose from our highest-rated travel regions this season.</p>

          {loading ? (
            <Spinner />
          ) : destinations.length === 0 ? (
            <p style={{ color: 'var(--medium)' }}>No destinations available at the moment.</p>
          ) : (
            <div className="destinations-grid">
              {destinations.map((dest) => (
                <Link key={dest._id} to={`/packages?destination=${dest.name}`}>
                  <div className="destination-card">
                    <img src={dest.image} alt={dest.name} />
                    <div className="destination-card-overlay">
                      <h3>{dest.name}</h3>
                      <p>View packages &rarr;</p>
                    </div>
                  </div>
                </Link>
              ))}
            </div>
          )}

          <div style={{ marginTop: '40px' }}>
            <Link to="/destinations">
              <Button variant="outline">View All Destinations</Button>
            </Link>
          </div>
        </div>
      </section>

      {/* 3. Featured Packages */}
      <section className="section" style={{ backgroundColor: 'var(--light)', borderTop: '1px solid var(--border)', borderBottom: '1px solid var(--border)' }}>
        <div className="container text-center">
          <h2 className="section-title">Featured Packages</h2>
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

      {/* 4. Why Choose Us */}
      <section className="section" style={{ backgroundColor: 'var(--white)', borderTop: '1px solid var(--border)', borderBottom: '1px solid var(--border)' }}>
        <div className="container text-center">
          <h2 className="section-title">Why Choose Us</h2>
          <p className="section-subtitle">We design our services to offer you comfort, affordability, and excitement.</p>
          <div className="features-grid">
            <div className="feature-card">
              <div className="feature-icon">
                <svg width="24" height="24" fill="none" stroke="currentColor" strokeWidth="2.5" viewBox="0 0 24 24">
                  <path d="M12 2v20M17 5H9.5a3.5 3.5 0 000 7h5a3.5 3.5 0 010 7H6"/>
                </svg>
              </div>
              <h3>Affordable Trips</h3>
              <p>Best price guarantee with absolutely transparent charges. No hidden expenses.</p>
            </div>
            <div className="feature-card">
              <div className="feature-icon">
                <svg width="24" height="24" fill="none" stroke="currentColor" strokeWidth="2.5" viewBox="0 0 24 24">
                  <path d="M17 21v-2a4 4 0 00-4-4H5a4 4 0 00-4 4v2"/>
                  <circle cx="9" cy="7" r="4"/>
                  <path d="M23 21v-2a4 4 0 00-3-3.87m-4-12a4 4 0 010 7.75"/>
                </svg>
              </div>
              <h3>Trusted Guides</h3>
              <p>Passionate local guides who share deep insights, history, and secrets of each town.</p>
            </div>
            <div className="feature-card">
              <div className="feature-icon">
                <svg width="24" height="24" fill="none" stroke="currentColor" strokeWidth="2.5" viewBox="0 0 24 24">
                  <path d="M9 12l2 2 4-4m6 2a9 9 0 11-18 0 9 9 0 0118 0z"/>
                </svg>
              </div>
              <h3>Custom Packages</h3>
              <p>Get tailormade adjustments to hotel categories, dates, and sightseeing layouts easily.</p>
            </div>
            <div className="feature-card">
              <div className="feature-icon">
                <svg width="24" height="24" fill="none" stroke="currentColor" strokeWidth="2.5" viewBox="0 0 24 24">
                  <path d="M3 18v-6a9 9 0 0118 0v6M21 19a2 2 0 01-2 2h-1a2 2 0 01-2-2v-3a2 2 0 012-2h3M3 19a2 2 0 002 2h1a2 2 0 002-2v-3a2 2 0 00-2-2H3"/>
                </svg>
              </div>
              <h3>24/7 Support</h3>
              <p>A direct, prompt helpline ready to support you at any stage during your travels.</p>
            </div>
          </div>
        </div>
      </section>

      {/* 5. Testimonials */}
      <section className="section">
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
                      <span key={i} style={{ color: i < test.rating ? '#ffb703' : '#e5e7eb' }}>&#9733;</span>
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

      {/* 6. Contact CTA Section */}
      <section className="container" style={{ marginBottom: '80px' }}>
        <div className="contact-cta">
          <h2>Ready To Plan Your Next Trip?</h2>
          <p>
            Let our tour planners help you design a customized itinerary. Send us your requirements, and we will get back to you within 24 hours.
          </p>
          <Link to="/contact">
            <Button variant="outline" className="btn-white">Get Free Consultation</Button>
          </Link>
        </div>
      </section>
    </div>
  );
};

export default Home;
