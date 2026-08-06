import React, { useState, useEffect } from 'react';
import { Link } from 'react-router-dom';
import { getDestinations } from '../services/api';

const defaultDestinations = [
  {
    _id: 'dest-meghalaya',
    name: 'Meghalaya',
    meta: 'Best: Oct – May',
    description: 'Living root bridges, waterfalls, clean Khasi villages and the wettest places on earth. Ideal for first-time visitors to the hills.',
    image: 'https://images.unsplash.com/photo-1582510003544-4d00b7f74220?auto=format&fit=crop&w=800&q=80',
    tags: ['Root bridges', 'Waterfalls', 'Shillong'],
    viewLink: '/packages/meghalaya-1',
    viewLabel: 'View package'
  },
  {
    _id: 'dest-assam',
    name: 'Assam',
    meta: 'Best: Nov – Apr',
    description: 'Kaziranga’s one-horned rhinos, Brahmaputra river life, tea gardens and the gateway city of Guwahati.',
    image: 'https://images.unsplash.com/photo-1566073771259-6a8506099945?auto=format&fit=crop&w=800&q=80',
    tags: ['Kaziranga', 'Wildlife', 'Tea estates'],
    viewLink: '/packages/assam-1',
    viewLabel: 'View package'
  },
  {
    _id: 'dest-arunachal',
    name: 'Arunachal Pradesh',
    meta: 'Best: Mar – Jun, Sep – Nov',
    description: 'High passes, Tawang monastery, Buddhist culture and quiet mountain roads. Needs ILP — we arrange it for you.',
    image: 'https://images.unsplash.com/photo-1544735716-392fe2489ffa?auto=format&fit=crop&w=800&q=80',
    tags: ['Tawang', 'Sela Pass', 'Monasteries'],
    viewLink: '/packages/arunachal-1',
    viewLabel: 'View package'
  },
  {
    _id: 'dest-sikkim',
    name: 'Sikkim',
    meta: 'Best: Mar – Jun, Sep – Nov',
    description: 'Mountain views, monasteries, lakes and the road to high passes. A balanced mix of comfort and scenery.',
    image: 'https://images.unsplash.com/photo-1506905925346-21bda4d32df4?auto=format&fit=crop&w=800&q=80',
    tags: ['Gangtok', 'Lakes', 'High passes'],
    viewLink: '/packages/sikkim-1',
    viewLabel: 'See packages'
  },
  {
    _id: 'dest-nagaland',
    name: 'Nagaland',
    meta: 'Best: Oct – Mar · Hornbill: Dec',
    description: 'Tribal culture, the Hornbill Festival, hill villages and a very different North East experience.',
    image: 'https://images.unsplash.com/photo-1488646953014-85cb44e25828?auto=format&fit=crop&w=800&q=80',
    tags: ['Hornbill', 'Culture', 'Kohima'],
    viewLink: '/contact',
    viewLabel: 'Plan a trip'
  },
  {
    _id: 'dest-manipur',
    name: 'Manipur, Mizoram & Tripura',
    meta: 'Best: Oct – Mar',
    description: 'Less-travelled states with lakes, hills, festivals and strong local cultures. Best planned with local insight.',
    image: 'https://images.unsplash.com/photo-1464822759023-fed622ff2c3b?auto=format&fit=crop&w=800&q=80',
    tags: ['Loktak', 'Hills', 'Culture'],
    viewLink: '/contact',
    viewLabel: 'Plan a trip'
  }
];

const Destinations = () => {
  const [destinations, setDestinations] = useState([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    document.title = 'Destinations – Travmitraa | North East India';
    const metaDesc = document.querySelector('meta[name="description"]');
    if (metaDesc) {
      metaDesc.setAttribute(
        'content',
        'Explore eight states across North East India: Assam, Meghalaya, Arunachal Pradesh, Sikkim, Nagaland and beyond.'
      );
    }

    const fetchDestinations = async () => {
      try {
        const data = await getDestinations();
        if (Array.isArray(data) && data.length > 0) {
          setDestinations(data);
        }
      } catch (err) {
        console.error('Failed to load API destinations:', err);
      } finally {
        setLoading(false);
      }
    };

    fetchDestinations();
  }, []);

  const displayDestinations = React.useMemo(() => {
    if (destinations.length > 0) {
      return destinations.map((dest) => ({
        _id: dest._id,
        name: dest.name,
        meta: dest.bestTime ? `Best: ${dest.bestTime}` : 'Best: All year',
        description: dest.description || 'Discover incredible landscapes and rich local heritage in this region.',
        image: dest.image || 'https://images.unsplash.com/photo-1582510003544-4d00b7f74220?auto=format&fit=crop&w=800&q=80',
        tags: dest.tags && dest.tags.length > 0 ? dest.tags : ['Hills', 'Culture', 'Nature'],
        viewLink: `/packages?destination=${encodeURIComponent(dest.name)}`,
        viewLabel: 'View packages'
      }));
    }
    return defaultDestinations;
  }, [destinations]);

  return (
    <div>
      {/* Page Hero */}
      <section className="page-hero">
        <div className="container">
          <h1>Destinations</h1>
          <p>Eight states, one region — hills, parks, monasteries, rivers and living cultures across North East India.</p>
        </div>
      </section>

      {/* Intro section */}
      <section className="intro">
        <div className="container">
          <p>
            We specialise in the North East. Below is a quick look at the places we know best — pick a region and we’ll shape a trip around it.
          </p>
        </div>
      </section>

      {/* Destinations Grid */}
      <section className="dest-section">
        <div className="container">
          {loading ? (
            <div className="dest-grid">
              {[1, 2, 3, 4].map((n) => (
                <div key={n} className="dest-card" style={{ height: '220px', opacity: 0.6 }} />
              ))}
            </div>
          ) : (
            <div className="dest-grid">
              {displayDestinations.map((dest) => (
                <article key={dest._id} className="dest-card">
                  <div
                    className="dest-img"
                    style={{ backgroundImage: `url('${dest.image}')` }}
                  />
                  <div className="dest-body">
                    <h2>{dest.name}</h2>
                    <p className="dest-meta">{dest.meta}</p>
                    <p>{dest.description}</p>
                    <div className="dest-tags">
                      {dest.tags.map((tag, idx) => (
                        <span key={idx}>{tag}</span>
                      ))}
                    </div>
                    <div className="dest-actions">
                      <Link to={dest.viewLink} className="btn btn-outline">
                        {dest.viewLabel}
                      </Link>
                      <Link to="/contact" className="btn btn-primary">
                        Enquire
                      </Link>
                    </div>
                  </div>
                </article>
              ))}
            </div>
          )}
        </div>
      </section>

      {/* CTA */}
      <div className="container">
        <div className="cta-band">
          <h2>Not sure where to start?</h2>
          <p>Tell us your dates, pace and interests. We’ll suggest a route across one or more of these states.</p>
          <Link to="/contact" className="btn btn-white">
            Talk to us
          </Link>
        </div>
      </div>
    </div>
  );
};

export default Destinations;
