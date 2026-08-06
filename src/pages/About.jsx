import React, { useEffect } from 'react';
import { Link } from 'react-router-dom';

const valuesData = [
  {
    id: 1,
    title: 'Honest planning',
    description: 'Clear inclusions, realistic timings and no hidden surprises. You always know what you’re getting.',
    icon: (
      <svg xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth="1.8">
        <path strokeLinecap="round" strokeLinejoin="round" d="M9 12l2 2 4-4m5.618-4.016A11.955 11.955 0 0112 2.944a11.955 11.955 0 01-8.618 3.04A12.02 12.02 0 003 9c0 5.591 3.824 10.29 9 11.622 5.176-1.332 9-6.03 9-11.622 0-1.042-.133-2.052-.382-3.016z" />
      </svg>
    )
  },
  {
    id: 2,
    title: 'Local first',
    description: 'We work with local stays, guides and drivers. It supports communities and gives you a truer experience.',
    icon: (
      <svg xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth="1.8">
        <path strokeLinecap="round" strokeLinejoin="round" d="M17.657 16.657L13.414 20.9a1.998 1.998 0 01-2.827 0l-4.244-4.243a8 8 0 1111.314 0z" />
        <path strokeLinecap="round" strokeLinejoin="round" d="M15 11a3 3 0 11-6 0 3 3 0 016 0z" />
      </svg>
    )
  },
  {
    id: 3,
    title: 'Personal care',
    description: 'Small team, real attention. We don’t hand you a standard package and disappear.',
    icon: (
      <svg xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth="1.8">
        <path strokeLinecap="round" strokeLinejoin="round" d="M4.318 6.318a4.5 4.5 0 000 6.364L12 20.364l7.682-7.682a4.5 4.5 0 00-6.364-6.364L12 7.636l-1.318-1.318a4.5 4.5 0 00-6.364 0z" />
      </svg>
    )
  }
];

const teamData = [
  {
    id: 1,
    initials: 'TP',
    name: 'Tapan Patar',
    role: 'Manager',
    bio: 'Looks after day-to-day operations and makes sure every itinerary runs smoothly from planning to return.'
  },
  {
    id: 2,
    initials: 'CT',
    name: 'Chandra Kamal Teron',
    role: 'Associate Partner',
    bio: 'Brings deep regional knowledge and partnerships that help us open doors across the North East.'
  },
  {
    id: 3,
    initials: 'SS',
    name: 'Santanu Saikia',
    role: 'CTO',
    bio: 'Builds the systems that keep bookings, communication and trip details clear and reliable.'
  }
];

const About = () => {
  useEffect(() => {
    document.title = 'About Us – Travmitraa | North East India Travel';
    const metaDesc = document.querySelector('meta[name="description"]');
    if (metaDesc) {
      metaDesc.setAttribute(
        'content',
        'A small team that believes the North East is best experienced with local care and clear planning.'
      );
    }
  }, []);

  return (
    <div>
      {/* Page Hero */}
      <section className="page-hero">
        <div className="container">
          <h1>About Travmitraa</h1>
          <p>
            A small team that believes the North East is best experienced with local care and clear planning.
          </p>
        </div>
      </section>

      {/* Our Story */}
      <section className="story-section">
        <div className="container">
          <div className="story-grid">
            <div className="story-content">
              <h2>Our story</h2>
              <p>
                Travmitraa was built around a simple idea: travelling the North East should feel personal, not complicated. Too many trips get lost in generic packages or last-minute logistics. We wanted something different.
              </p>
              <p>
                We focus only on this region — Assam, Meghalaya, Arunachal, Sikkim and the surrounding hills. That focus lets us know the roads, the seasons, the good stays and the people who make a journey memorable.
              </p>
              <p>
                Whether you want a quiet few days among living root bridges, a safari in Kaziranga, or a high-altitude route to Tawang, we shape the trip around how you like to travel.
              </p>
            </div>
            <div className="story-highlight">
              <h3>What “mitraa” means to us</h3>
              <p>
                Mitraa means friend. We see ourselves as your travel companion — the ones who handle permits, find reliable drivers, suggest the right season, and stay reachable when you’re on the road. Good trips are built on trust as much as scenery.
              </p>
            </div>
          </div>
        </div>
      </section>

      {/* What we stand for */}
      <section className="values-section">
        <div className="container">
          <div className="section-header">
            <h2>What we stand for</h2>
            <p>A few principles that guide how we plan every journey.</p>
          </div>

          <div className="values-grid">
            {valuesData.map((val) => (
              <div key={val.id} className="value-card">
                <div className="value-icon">{val.icon}</div>
                <h3>{val.title}</h3>
                <p>{val.description}</p>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* The Team */}
      <section className="team-section">
        <div className="container">
          <div className="section-header">
            <h2>The team</h2>
            <p>The people behind the trips.</p>
          </div>

          <div className="team-grid">
            {teamData.map((member) => (
              <article key={member.id} className="team-card">
                <div className="team-avatar">{member.initials}</div>
                <h3>{member.name}</h3>
                <span className="team-role">{member.role}</span>
                <p>{member.bio}</p>
              </article>
            ))}
          </div>
        </div>
      </section>

      {/* CTA */}
      <div className="container">
        <div className="cta-band">
          <h2>Want to travel with us?</h2>
          <p>Share your dates and ideas. We’ll come back with thoughtful options for your North East journey.</p>
          <Link to="/contact" className="btn btn-white">
            Get in touch
          </Link>
        </div>
      </div>
    </div>
  );
};

export default About;
