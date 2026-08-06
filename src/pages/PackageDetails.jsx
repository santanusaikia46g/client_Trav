import React, { useState, useEffect } from 'react';
import { useParams, Link } from 'react-router-dom';
import { getPackage } from '../services/api';
import Spinner from '../components/Spinner';

// Default Meghalaya Highlights fallback package structure
const defaultMeghalayaDetails = {
  title: 'Meghalaya Highlights',
  duration: '5 days / 4 nights',
  route: 'Shillong · Cherrapunji · Dawki',
  bestSeason: 'Oct – May',
  subtitle: 'Living root bridges, cascading waterfalls, clean Khasi villages and the wettest places on earth — a classic first trip into the hills of Meghalaya.',
  priceFrom: '18,900',
  heroImage: 'https://images.unsplash.com/photo-1582510003544-4d00b7f74220?auto=format&fit=crop&w=1920&q=80',
  highlights: [
    'Double-decker living root bridge trek',
    'Nohkalikai & Seven Sisters waterfalls',
    'Crystal-clear Dawki river & Umngot',
    'Shillong city & Ward’s Lake',
    'Local Khasi villages & markets',
    'Optional caving or boating'
  ],
  pricingTiers: [
    {
      id: 'standard',
      name: 'Standard',
      stars: '★★★ · 3-star hotels',
      price: '₹18,900',
      priceUnit: '/ person',
      hotel: 'Clean, well-located 3★ stays in Shillong & Cherrapunji',
      features: [
        '3★ hotels / guesthouses',
        'Private AC vehicle',
        'Breakfast daily',
        'Local guide on key days'
      ],
      featured: false,
      btnClass: 'btn-outline'
    },
    {
      id: 'deluxe',
      name: 'Deluxe',
      stars: '★★★★ · 4-star hotels',
      price: '₹24,900',
      priceUnit: '/ person',
      hotel: 'Comfortable 4★ hotels with better views & amenities',
      features: [
        '4★ hotels / resorts',
        'Private AC vehicle',
        'Breakfast + 2 dinners',
        'Dedicated local guide'
      ],
      featured: true,
      btnClass: 'btn-primary'
    },
    {
      id: 'luxury',
      name: 'Luxury',
      stars: '★★★★★ · 5-star / premium',
      price: '₹34,900',
      priceUnit: '/ person',
      hotel: 'Premium resorts & boutique stays with top service',
      features: [
        '5★ / premium resorts',
        'Premium private vehicle',
        'All meals included',
        'Private guide throughout'
      ],
      featured: false,
      btnClass: 'btn-outline'
    }
  ],
  itinerary: [
    {
      day: 'Day 1',
      title: 'Arrive Guwahati → Shillong',
      desc: 'Meet at Guwahati airport or railway station. Scenic drive to Shillong (approx. 3–3.5 hrs). Check-in, evening at leisure or Ward’s Lake & local market. Overnight Shillong.'
    },
    {
      day: 'Day 2',
      title: 'Shillong local · Umiam Lake',
      desc: 'Morning city tour: Don Bosco Museum, Cathedral, Police Bazaar. Afternoon visit to Umiam (Barapani) Lake for views and optional boating. Overnight Shillong.'
    },
    {
      day: 'Day 3',
      title: 'Cherrapunji · Waterfalls & caves',
      desc: 'Drive to Cherrapunji. Visit Nohkalikai Falls, Seven Sisters Falls, Mawsmai Cave. Evening free. Overnight Cherrapunji / Sohra.'
    },
    {
      day: 'Day 4',
      title: 'Living root bridge · Dawki',
      desc: 'Trek to the double-decker living root bridge (moderate fitness). Later drive to Dawki for the clear Umngot river and Indo-Bangladesh border views. Return to Shillong. Overnight Shillong.'
    },
    {
      day: 'Day 5',
      title: 'Shillong → Guwahati departure',
      desc: 'After breakfast, drive back to Guwahati for your onward flight or train. Trip ends with drop at airport / station.'
    }
  ],
  inclusions: [
    'Accommodation as per chosen category (twin share)',
    'Daily breakfast (meals as per tier)',
    'Private vehicle for all transfers & sightseeing',
    'Driver allowances & parking',
    'Entry fees to major points (as per itinerary)',
    'Local guide on key activity days',
    'Basic first-aid support'
  ],
  exclusions: [
    'Flights / trains to Guwahati',
    'Lunch & dinner (except where stated in tier)',
    'Personal expenses & tips',
    'Optional activities (boating, caving extras)',
    'Travel insurance',
    'Anything not listed under inclusions'
  ],
  sidebarFacts: {
    duration: '5D / 4N',
    startEnd: 'Guwahati',
    season: 'Oct – May',
    groupSize: '2 – 12',
    difficulty: 'Easy – Moderate'
  }
};

const PackageDetails = () => {
  const { id } = useParams();
  const [pkgData, setPkgData] = useState(null);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const fetchPackage = async () => {
      try {
        const data = await getPackage(id);
        if (data && data.title) {
          // Format API response into layout data structure
          setPkgData({
            title: data.title,
            duration: data.duration || '5 days / 4 nights',
            route: data.destination || 'North East India',
            bestSeason: 'Oct – May',
            subtitle: data.description,
            priceFrom: typeof data.price === 'number' ? data.price.toLocaleString('en-IN') : data.price,
            heroImage: (data.images && data.images[0]) || defaultMeghalayaDetails.heroImage,
            highlights: data.highlights && data.highlights.length > 0 ? data.highlights : defaultMeghalayaDetails.highlights,
            pricingTiers: defaultMeghalayaDetails.pricingTiers,
            itinerary: data.itinerary && data.itinerary.length > 0 
              ? data.itinerary.map(item => ({ day: `Day ${item.day}`, title: item.title, desc: item.description }))
              : defaultMeghalayaDetails.itinerary,
            inclusions: data.included && data.included.length > 0 ? data.included : defaultMeghalayaDetails.inclusions,
            exclusions: data.excluded && data.excluded.length > 0 ? data.excluded : defaultMeghalayaDetails.exclusions,
            sidebarFacts: {
              duration: data.duration || '5D / 4N',
              startEnd: 'Guwahati',
              season: 'Oct – May',
              groupSize: '2 – 12',
              difficulty: 'Easy – Moderate'
            }
          });
          document.title = `${data.title} | Travmitraa`;
        } else {
          setPkgData(defaultMeghalayaDetails);
          document.title = `Meghalaya Highlights – 5 Days | Travmitraa`;
        }
      } catch (err) {
        console.error('Fetching package failed, using default details:', err);
        setPkgData(defaultMeghalayaDetails);
        document.title = `Meghalaya Highlights – 5 Days | Travmitraa`;
      } finally {
        setLoading(false);
      }
    };

    fetchPackage();
  }, [id]);

  if (loading) {
    return <Spinner fullPage={true} />;
  }

  const data = pkgData || defaultMeghalayaDetails;

  return (
    <div>
      {/* Hero */}
      <section className="pkg-hero" style={{ backgroundImage: `linear-gradient(rgba(15, 23, 42, 0.5), rgba(15, 118, 110, 0.6)), url('${data.heroImage}')` }}>
        <div className="container">
          <div className="pkg-hero-inner">
            <p className="pkg-breadcrumb">
              <Link to="/packages">Packages</Link> · {data.route.split('·')[0].trim()}
            </p>
            <h1>{data.title}</h1>
            <div className="pkg-hero-meta">
              <span>{data.duration}</span>
              <span>{data.route}</span>
              <span>Best: {data.bestSeason}</span>
            </div>
            <p>{data.subtitle}</p>
            <div className="pkg-hero-actions">
              <a href="#pricing" className="btn btn-primary">See pricing</a>
              <Link to="/contact" className="btn btn-white">Enquire now</Link>
            </div>
          </div>
        </div>
      </section>

      {/* Main Content Layout */}
      <section className="pkg-content">
        <div className="container">
          <div className="pkg-layout">

            {/* Main Column */}
            <div className="pkg-main">

              {/* Trip Highlights */}
              <div className="pkg-section">
                <h2>Trip highlights</h2>
                <ul className="highlights">
                  {data.highlights.map((item, idx) => (
                    <li key={idx}>{item}</li>
                  ))}
                </ul>
              </div>

              {/* Pricing Tiers */}
              <div className="pkg-section" id="pricing">
                <h2>Choose your category</h2>
                <p>All prices are per person on twin-sharing basis. Single occupancy and group rates available on request.</p>
                <div className="tiers">
                  {data.pricingTiers.map((tier) => (
                    <div key={tier.id} className={`tier-card ${tier.featured ? 'featured' : ''}`}>
                      <div className="tier-name">{tier.name}</div>
                      <div className="tier-stars">{tier.stars}</div>
                      <div className="tier-price">{tier.price} <span>{tier.priceUnit}</span></div>
                      <div className="tier-hotel">{tier.hotel}</div>
                      <ul className="tier-list">
                        {tier.features.map((feat, i) => (
                          <li key={i}>{feat}</li>
                        ))}
                      </ul>
                      <Link
                        to="/contact"
                        className={`btn ${tier.btnClass}`}
                        style={{ width: '100%', justifyContent: 'center' }}
                      >
                        Select {tier.name}
                      </Link>
                    </div>
                  ))}
                </div>
              </div>

              {/* Day-wise Itinerary */}
              <div className="pkg-section">
                <h2>Day-wise itinerary</h2>
                <ul className="itinerary">
                  {data.itinerary.map((dayItem, idx) => (
                    <li key={idx} className="day">
                      <div className="day-num">{dayItem.day}</div>
                      <div>
                        <h3>{dayItem.title}</h3>
                        <p>{dayItem.desc}</p>
                      </div>
                    </li>
                  ))}
                </ul>
              </div>

              {/* Inclusions & Exclusions */}
              <div className="pkg-section">
                <h2>Inclusions & exclusions</h2>
                <div className="inc-grid">
                  <div className="inc-box include">
                    <h3>Included</h3>
                    <ul>
                      {data.inclusions.map((inc, i) => (
                        <li key={i}>{inc}</li>
                      ))}
                    </ul>
                  </div>
                  <div className="inc-box exclude">
                    <h3>Not included</h3>
                    <ul>
                      {data.exclusions.map((exc, i) => (
                        <li key={i}>{exc}</li>
                      ))}
                    </ul>
                  </div>
                </div>
              </div>

            </div>

            {/* Sidebar */}
            <aside className="sidebar">
              <h3>{data.title}</h3>
              <p className="sidebar-from">From <strong>₹{data.priceFrom}</strong> / person</p>
              <ul className="sidebar-facts">
                <li><span>Duration</span><span>{data.sidebarFacts.duration}</span></li>
                <li><span>Start / End</span><span>{data.sidebarFacts.startEnd}</span></li>
                <li><span>Best season</span><span>{data.sidebarFacts.season}</span></li>
                <li><span>Group size</span><span>{data.sidebarFacts.groupSize}</span></li>
                <li><span>Difficulty</span><span>{data.sidebarFacts.difficulty}</span></li>
              </ul>
              <Link to="/contact" className="btn btn-primary">Enquire about this trip</Link>
              <a href="https://wa.me/919876543210" target="_blank" rel="noopener noreferrer" className="btn btn-outline">
                WhatsApp us
              </a>
              <p className="sidebar-note">Prices vary by season & group size. We’ll send a final quote after your dates.</p>
            </aside>

          </div>
        </div>
      </section>

      {/* CTA Band */}
      <div className="container">
        <div className="cta-band">
          <h2>Want this itinerary adjusted?</h2>
          <p>Add an extra night, skip a trek, or combine with Kaziranga — we customise freely.</p>
          <Link to="/contact" className="btn btn-white">Talk to us</Link>
        </div>
      </div>
    </div>
  );
};

export default PackageDetails;
