import React, { useEffect } from 'react';
import { Link } from 'react-router-dom';

const servicesData = [
  {
    id: 1,
    title: 'Customised Itineraries',
    description: 'Tell us your dates, pace and interests. We design a personalised route through the hills, parks and valleys that fits you.',
    icon: (
      <svg xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth="1.8">
        <path strokeLinecap="round" strokeLinejoin="round" d="M9 20l-5.447-2.724A1 1 0 013 16.382V5.618a1 1 0 011.447-.894L9 7m0 13l6-3m-6 3V7m6 10l4.553 2.276A1 1 0 0021 18.382V7.618a1 1 0 00-.553-.894L15 4m0 13V4m0 0L9 7" />
      </svg>
    )
  },
  {
    id: 2,
    title: 'Fixed Departure Tours',
    description: 'Ready-made group packages with set dates. Ideal if you prefer travelling with others on a well-planned itinerary.',
    icon: (
      <svg xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth="1.8">
        <path strokeLinecap="round" strokeLinejoin="round" d="M17 20h5v-2a3 3 0 00-5.356-1.857M17 20H7m10 0v-2c0-.656-.126-1.283-.356-1.857M7 20H2v-2a3 3 0 015.356-1.857M7 20v-2c0-.656.126-1.283.356-1.857m0 0a5.002 5.002 0 019.288 0M15 7a3 3 0 11-6 0 3 3 0 016 0zm6 3a2 2 0 11-4 0 2 2 0 014 0zM7 10a2 2 0 11-4 0 2 2 0 014 0z" />
      </svg>
    )
  },
  {
    id: 3,
    title: 'Wildlife Safaris',
    description: 'Kaziranga and beyond. Jeep and elephant safaris timed for the best chances to see one-horned rhinos and other wildlife.',
    icon: (
      <svg xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth="1.8">
        <path strokeLinecap="round" strokeLinejoin="round" d="M12 8c-1.657 0-3 .895-3 2s1.343 2 3 2 3 .895 3 2-1.343 2-3 2m0-8c1.11 0 2.08.402 2.599 1M12 8V7m0 1v8m0 0v1m0-1c-1.11 0-2.08-.402-2.599-1M21 12a9 9 0 11-18 0 9 9 0 0118 0z" />
      </svg>
    )
  },
  {
    id: 4,
    title: 'Homestays & Local Stays',
    description: 'Carefully chosen homestays and small lodges that give you a real sense of place — clean, welcoming and well located.',
    icon: (
      <svg xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth="1.8">
        <path strokeLinecap="round" strokeLinejoin="round" d="M19 21V5a2 2 0 00-2-2H7a2 2 0 00-2 2v16m14 0h2m-2 0h-5m-9 0H3m2 0h5M9 7h1m-1 4h1m4-4h1m-1 4h1m-5 10v-5a1 1 0 011-1h2a1 1 0 011 1v5m-4 0h4" />
      </svg>
    )
  },
  {
    id: 5,
    title: 'Permit Assistance',
    description: 'Inner Line Permits for Arunachal, Nagaland and beyond. We handle the paperwork so you don’t have to chase offices.',
    icon: (
      <svg xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth="1.8">
        <path strokeLinecap="round" strokeLinejoin="round" d="M9 12l2 2 4-4m5.618-4.016A11.955 11.955 0 0112 2.944a11.955 11.955 0 01-8.618 3.04A12.02 12.02 0 003 9c0 5.591 3.824 10.29 9 11.622 5.176-1.332 9-6.03 9-11.622 0-1.042-.133-2.052-.382-3.016z" />
      </svg>
    )
  },
  {
    id: 6,
    title: 'Transport & Transfers',
    description: 'Airport pickups, reliable drivers and vehicles suited to mountain roads. Comfortable travel between destinations.',
    icon: (
      <svg xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth="1.8">
        <path strokeLinecap="round" strokeLinejoin="round" d="M8 7h12m0 0l-4-4m4 4l-4 4m0 6H4m0 0l4 4m-4-4l4-4" />
      </svg>
    )
  },
  {
    id: 7,
    title: 'Adventure Experiences',
    description: 'Living root bridge treks, river crossings, short hikes and village walks with local guides who know the trails.',
    icon: (
      <svg xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth="1.8">
        <path strokeLinecap="round" strokeLinejoin="round" d="M13 10V3L4 14h7v7l9-11h-7z" />
      </svg>
    )
  },
  {
    id: 8,
    title: 'Honeymoon & Special Trips',
    description: 'Quiet stays, scenic drives and thoughtful touches for couples, families or solo travellers who want something personal.',
    icon: (
      <svg xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth="1.8">
        <path strokeLinecap="round" strokeLinejoin="round" d="M4.318 6.318a4.5 4.5 0 000 6.364L12 20.364l7.682-7.682a4.5 4.5 0 00-6.364-6.364L12 7.636l-1.318-1.318a4.5 4.5 0 00-6.364 0z" />
      </svg>
    )
  },
  {
    id: 9,
    title: 'On-Trip Support',
    description: 'A reachable contact throughout your journey. Help with changes, recommendations or anything that comes up on the road.',
    icon: (
      <svg xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth="1.8">
        <path strokeLinecap="round" strokeLinejoin="round" d="M18.364 5.636l-3.536 3.536m0 5.656l3.536 3.536M9.172 9.172L5.636 5.636m3.536 9.192l-3.536 3.536M21 12a9 9 0 11-18 0 9 9 0 0118 0zm-5 0a4 4 0 11-8 0 4 4 0 018 0z" />
      </svg>
    )
  }
];

const stepsData = [
  {
    step: 1,
    title: 'Share your plans',
    description: 'Dates, group size, interests and any must-sees.'
  },
  {
    step: 2,
    title: 'We design the trip',
    description: 'Itinerary, stays, transport and activities tailored to you.'
  },
  {
    step: 3,
    title: 'Confirm & prepare',
    description: 'Permits, bookings and clear pre-trip guidance.'
  },
  {
    step: 4,
    title: 'Travel with support',
    description: 'Local help available whenever you need it.'
  }
];

const Services = () => {
  useEffect(() => {
    document.title = 'Services – Travmitraa | North East India Travel';
    const metaDesc = document.querySelector('meta[name="description"]');
    if (metaDesc) {
      metaDesc.setAttribute(
        'content',
        'From custom itineraries to permits and local experiences — everything you need for a smooth North East journey.'
      );
    }
  }, []);

  return (
    <div>
      {/* Page Hero */}
      <section className="page-hero">
        <div className="container">
          <h1>Services We Provide</h1>
          <p>
            From custom itineraries to permits and local experiences — everything you need for a smooth North East journey.
          </p>
        </div>
      </section>

      {/* Services Grid */}
      <section className="services-section">
        <div className="container">
          <div className="services-grid">
            {servicesData.map((item) => (
              <article key={item.id} className="service-card">
                <div className="service-icon">{item.icon}</div>
                <h3>{item.title}</h3>
                <p>{item.description}</p>
              </article>
            ))}
          </div>
        </div>
      </section>

      {/* How it works */}
      <section className="how-section">
        <div className="container">
          <div className="section-header">
            <h2>How it works</h2>
            <p>A simple process from first chat to the end of your trip.</p>
          </div>

          <div className="steps">
            {stepsData.map((st) => (
              <div key={st.step} className="step">
                <div className="step-number">{st.step}</div>
                <h3>{st.title}</h3>
                <p>{st.description}</p>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* CTA */}
      <div className="container">
        <div className="cta-band">
          <h2>Ready to plan your North East trip?</h2>
          <p>
            Tell us what you’re looking for and we’ll put together options that fit your style and budget.
          </p>
          <Link to="/contact" className="btn btn-white">
            Start planning
          </Link>
        </div>
      </div>
    </div>
  );
};

export default Services;
