import React, { useState, useEffect } from 'react';
import { Link } from 'react-router-dom';
import { getDestinations } from '../services/api';
import Card from '../components/Card';
import Spinner from '../components/Spinner';

const Destinations = () => {
  const [destinations, setDestinations] = useState([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    document.title = 'Explore Destinations | Travmitra';
    const metaDesc = document.querySelector('meta[name="description"]');
    if (metaDesc) {
      metaDesc.setAttribute('content', 'Discover popular travel destinations with Travmitra. Plan your trip with our local guides and custom packages.');
    }

    const fetchDestinations = async () => {
      try {
        const data = await getDestinations();
        setDestinations(data);
      } catch (err) {
        console.error('Failed to load destinations:', err);
      } finally {
        setLoading(false);
      }
    };

    fetchDestinations();
  }, []);

  return (
    <div className="container section">
      <h1 className="section-title text-center">Popular Destinations</h1>
      <p className="section-subtitle text-center">
        Choose from our highest-rated travel regions this season and start planning your next getaway.
      </p>

      {loading ? (
        <Spinner />
      ) : destinations.length === 0 ? (
        <p className="text-center" style={{ color: 'var(--medium)', marginTop: '40px' }}>
          No destinations available at the moment. Please check back later.
        </p>
      ) : (
        <div className="destinations-grid" style={{ marginTop: '40px' }}>
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
    </div>
  );
};

export default Destinations;
