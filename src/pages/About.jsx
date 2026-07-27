import React, { useEffect } from 'react';
import Card from '../components/Card';

const teamMembers = [
  {
    name: 'Tapan patar',
    role: 'Founder and CEO',
    image: 'https://images.unsplash.com/photo-1560250097-0b93528c311a?auto=format&fit=crop&w=400&h=400&q=80'
  },
  {
    name: 'Santanu Saikia',
    role: 'CTO',
    image: 'https://images.unsplash.com/photo-1519085360753-af0119f7cbe7?auto=format&fit=crop&w=400&h=400&q=80'
  }
];

const About = () => {
  useEffect(() => {
    document.title = 'About Us | Travmitra';
    // Meta description update
    const metaDesc = document.querySelector('meta[name="description"]');
    if (metaDesc) {
      metaDesc.setAttribute('content', 'Learn more about Travmitra, our journey, mission, and dedicated team of travel experts.');
    }
  }, []);

  return (
    <div style={{ paddingBottom: '40px' }}>
      {/* Intro Banner */}
      <section className="section" style={{ backgroundColor: 'var(--white)', borderBottom: '1px solid var(--border)' }}>
        <div className="container">
          <div className="about-intro-grid">
            <div>
              <h1 style={{ fontSize: '2.5rem', fontWeight: 800, lineHeight: 1.2, marginBottom: '20px' }}>
                Your Trusted Guide To <span style={{ color: 'var(--primary)' }}>Exploring The World</span>
              </h1>
              <p style={{ color: 'var(--medium)', marginBottom: '20px' }}>
                Founded in 2021, Travmitra has been dedicated to bridging the gap between traveler dreams and real-world adventures. We provide thoroughly structured tour solutions, hotel arrangements, transport logistics, and support to enable smooth vacations.
              </p>
              <p style={{ color: 'var(--medium)' }}>
                Our name, "Travmitra", translates to "Travel Friend" in Sanskrit. We operate exactly like that—acting as your companion who plans, coordinates, and ensures that you have the most beautiful and comfortable trip imaginable.
              </p>
            </div>
            <div>
              <img
                src="https://images.unsplash.com/photo-1488646953014-85cb44e25828?auto=format&fit=crop&w=800&q=80"
                alt="Travmitra Travel Journey"
                className="about-intro-img"
              />
            </div>
          </div>
        </div>
      </section>

      {/* Mission & Vision */}
      <section className="section">
        <div className="container">
          <div className="mission-vision-grid">
            <div className="mission-card">
              <h3>Our Mission</h3>
              <p style={{ color: 'var(--medium)' }}>
                To design travel experiences that are pocket-friendly, rich in local cultural heritage, and safe. We believe that travel expands minds and fosters global understanding, and we want to make that accessible to everyone.
              </p>
            </div>
            <div className="mission-card">
              <h3>Our Vision</h3>
              <p style={{ color: 'var(--medium)' }}>
                To become India's leading custom travel operator, known for local guides integration, eco-friendly tourism practices, and flawless customer experiences.
              </p>
            </div>
          </div>
        </div>
      </section>

      {/* Why Choose Us */}
      <section className="section" style={{ backgroundColor: 'var(--white)', borderTop: '1px solid var(--border)', borderBottom: '1px solid var(--border)' }}>
        <div className="container text-center">
          <h2 className="section-title">Why Travmitra</h2>
          <p className="section-subtitle">We put customer satisfaction and safety above everything else.</p>
          <div className="features-grid" style={{ marginTop: '20px' }}>
            <div className="feature-card">
              <div className="feature-icon">
                <svg width="24" height="24" fill="none" stroke="currentColor" strokeWidth="2.5" viewBox="0 0 24 24">
                  <path d="M12 2v20M17 5H9.5a3.5 3.5 0 000 7h5a3.5 3.5 0 010 7H6"/>
                </svg>
              </div>
              <h3>Affordable Trips</h3>
              <p>Premium travel packages designed to match various budget limits without sacrificing comfort.</p>
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
              <p>Verified, certified local guides who have absolute knowledge of the locations and culture.</p>
            </div>
            <div className="feature-card">
              <div className="feature-icon">
                <svg width="24" height="24" fill="none" stroke="currentColor" strokeWidth="2.5" viewBox="0 0 24 24">
                  <path d="M12 22c5.523 0 10-4.477 10-10S17.523 2 12 2 2 6.477 2 12s4.477 10 10 10z"/>
                  <path d="M12 6v6l4 2"/>
                </svg>
              </div>
              <h3>24/7 Support</h3>
              <p>Around-the-clock emergency support line for any travel booking or transport hurdles.</p>
            </div>
          </div>
        </div>
      </section>

      {/* Team Section */}
      <section className="section">
        <div className="container text-center">
          <h2 className="section-title">Meet Our Experts</h2>
          <p className="section-subtitle">The travel planners and guides behind your dream destinations.</p>
          <div className="team-grid">
            {teamMembers.map((member, index) => (
              <Card key={index} className="team-card">
                <img src={member.image} alt={member.name} className="team-img" />
                <div className="team-info">
                  <h4>{member.name}</h4>
                  <p>{member.role}</p>
                </div>
              </Card>
            ))}
          </div>
        </div>
      </section>
    </div>
  );
};

export default About;
