import React, { useEffect } from 'react';
import { Link } from 'react-router-dom';
import Button from '../components/Button';
import Card from '../components/Card';

const Services = () => {
  useEffect(() => {
    document.title = 'Our Services | Travmitra';
    const metaDesc = document.querySelector('meta[name="description"]');
    if (metaDesc) {
      metaDesc.setAttribute('content', 'Explore Travmitra premium travel services: Flight booking, Hotel booking, Visa assistance, Money exchange, Transfers, and Travel insurance.');
    }
  }, []);

  const servicesList = [
    {
      title: 'Flight Booking',
      icon: '✈️',
      description: 'Book domestic and international flights at competitive prices. We manage cancellations, seat selections, and upgrades seamlessly.',
      details: 'Partnered with major global airlines to offer exclusive deals, group bookings, and multi-destination itineraries.'
    },
    {
      title: 'Hotel Booking',
      icon: '🏨',
      description: 'From luxury beach resorts and boutique villas to budget-friendly hotels, find the perfect stay for your trip.',
      details: 'Enjoy special rates, free cancellations, complimentary breakfast, and early check-ins at select properties.'
    },
    {
      title: 'Visa Services',
      icon: '🛂',
      description: 'Fast and reliable visa consultation. We guide you through document preparation, appointment booking, and visa interviews.',
      details: 'Expert assistance for tourist, business, student, and transit visas for destinations worldwide.'
    },
    {
      title: 'Money Exchange',
      icon: '💱',
      description: 'Get the best currency exchange rates with zero hidden charges. Safe, secure, and hassle-free transaction options.',
      details: 'Buy and sell foreign exchange, get multi-currency forex cards, and transfer funds internationally with ease.'
    },
    {
      title: 'Transfers & Car Rentals',
      icon: '🚗',
      description: 'Reliable airport transfers, intercity cars, and chauffeur services. Travel comfortably in clean, air-conditioned vehicles.',
      details: 'Available for individuals, families, and large corporate groups with professional, verified drivers.'
    },
    {
      title: 'Travel Insurance',
      icon: '🛡️',
      description: 'Secure your trip against unexpected events. Comprehensive insurance coverage for flight delays, medical emergencies, and lost baggage.',
      details: 'Flexible plans tailored to single trips, multi-trip annual plans, student travels, and senior citizens.'
    }
  ];

  return (
    <div className="container section">
      <h1 className="section-title text-center">Our Services</h1>
      <p className="section-subtitle text-center">
        Providing end-to-end travel solutions to ensure your journeys are seamless, safe, and memorable.
      </p>

      <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fit, minmax(320px, 1fr))', gap: '30px', marginTop: '40px' }}>
        {servicesList.map((service, index) => (
          <Card key={index} style={{ padding: '30px', display: 'flex', flexDirection: 'column', height: '100%', position: 'relative', overflow: 'hidden' }}>
            <div style={{ display: 'flex', alignItems: 'center', gap: '15px', marginBottom: '20px' }}>
              <div style={{ fontSize: '2.5rem', backgroundColor: 'var(--primary-light)', width: '60px', height: '60px', borderRadius: '50%', display: 'flex', alignItems: 'center', justifyContent: 'center' }}>
                {service.icon}
              </div>
              <h3 style={{ fontSize: '1.4rem', fontWeight: '700', margin: 0, color: 'var(--dark)' }}>{service.title}</h3>
            </div>
            
            <p style={{ fontSize: '0.95rem', color: 'var(--dark)', fontWeight: '500', marginBottom: '12px', lineHeight: '1.5' }}>
              {service.description}
            </p>
            
            <p style={{ fontSize: '0.85rem', color: 'var(--medium)', marginBottom: '25px', flexGrow: 1, lineHeight: '1.6' }}>
              {service.details}
            </p>

            <Link to="/contact" style={{ marginTop: 'auto' }}>
              <Button variant="outline" size="sm" style={{ width: '100%' }}>
                Inquire About Service &rarr;
              </Button>
            </Link>
          </Card>
        ))}
      </div>

      {/* CTA Section */}
      <div style={{ marginTop: '80px', backgroundColor: 'var(--light)', padding: '50px', borderRadius: 'var(--radius-lg)', border: '1px solid var(--border)', textAlign: 'center' }}>
        <h2 style={{ fontSize: '2rem', fontWeight: '800', marginBottom: '15px', color: 'var(--dark)' }}>Need a Custom Travel Solution?</h2>
        <p style={{ fontSize: '1.1rem', color: 'var(--medium)', maxWidth: '600px', margin: '0 auto 30px auto' }}>
          Connect with our expert travel agents to design a package tailored specifically to your needs, preferences, and budget.
        </p>
        <div style={{ display: 'flex', justifyContent: 'center', gap: '15px' }}>
          <Link to="/contact">
            <Button variant="primary">Contact Our Experts</Button>
          </Link>
          <Link to="/packages">
            <Button variant="outline">Browse Holiday Packages</Button>
          </Link>
        </div>
      </div>
    </div>
  );
};

export default Services;
