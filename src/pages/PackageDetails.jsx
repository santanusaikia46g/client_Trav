import React, { useState, useEffect } from 'react';
import { useParams, Link } from 'react-router-dom';
import { getPackage } from '../services/api';
import Spinner from '../components/Spinner';

// Map of default North East package details by ID
const defaultPackagesMap = {
  'meghalaya-1': {
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
      { id: 'standard', name: 'Standard', stars: '★★★ · 3-star hotels', price: '₹18,900', priceUnit: '/ person', hotel: 'Clean, well-located 3★ stays in Shillong & Cherrapunji', features: ['3★ hotels / guesthouses', 'Private AC vehicle', 'Breakfast daily', 'Local guide on key days'], featured: false, btnClass: 'btn-outline' },
      { id: 'deluxe', name: 'Deluxe', stars: '★★★★ · 4-star hotels', price: '₹24,900', priceUnit: '/ person', hotel: 'Comfortable 4★ hotels with better views & amenities', features: ['4★ hotels / resorts', 'Private AC vehicle', 'Breakfast + 2 dinners', 'Dedicated local guide'], featured: true, btnClass: 'btn-primary' },
      { id: 'luxury', name: 'Luxury', stars: '★★★★★ · 5-star / premium', price: '₹34,900', priceUnit: '/ person', hotel: 'Premium resorts & boutique stays with top service', features: ['5★ / premium resorts', 'Premium private vehicle', 'All meals included', 'Private guide throughout'], featured: false, btnClass: 'btn-outline' }
    ],
    itinerary: [
      { day: 'Day 1', title: 'Arrive Guwahati → Shillong', desc: 'Meet at Guwahati airport or railway station. Scenic drive to Shillong (approx. 3–3.5 hrs). Check-in, evening at leisure or Ward’s Lake & local market. Overnight Shillong.' },
      { day: 'Day 2', title: 'Shillong local · Umiam Lake', desc: 'Morning city tour: Don Bosco Museum, Cathedral, Police Bazaar. Afternoon visit to Umiam (Barapani) Lake for views and optional boating. Overnight Shillong.' },
      { day: 'Day 3', title: 'Cherrapunji · Waterfalls & caves', desc: 'Drive to Cherrapunji. Visit Nohkalikai Falls, Seven Sisters Falls, Mawsmai Cave. Evening free. Overnight Cherrapunji / Sohra.' },
      { day: 'Day 4', title: 'Living root bridge · Dawki', desc: 'Trek to the double-decker living root bridge (moderate fitness). Later drive to Dawki for the clear Umngot river and Indo-Bangladesh border views. Return to Shillong. Overnight Shillong.' },
      { day: 'Day 5', title: 'Shillong → Guwahati departure', desc: 'After breakfast, drive back to Guwahati for your onward flight or train. Trip ends with drop at airport / station.' }
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
    sidebarFacts: { duration: '5D / 4N', startEnd: 'Guwahati', season: 'Oct – May', groupSize: '2 – 12', difficulty: 'Easy – Moderate' }
  },
  'assam-1': {
    title: 'Kaziranga Safari',
    duration: '3 days / 2 nights',
    route: 'Guwahati · Kaziranga National Park',
    bestSeason: 'Nov – Apr',
    subtitle: 'One-horned rhinos, early morning jeep safaris and quiet stays near the park. Ideal as a short break or add-on.',
    priceFrom: '12,500',
    heroImage: 'https://images.unsplash.com/photo-1566073771259-6a8506099945?auto=format&fit=crop&w=1920&q=80',
    highlights: [
      'Jeep & Elephant Safaris in Kaziranga NP',
      'One-horned Rhinoceros Sighting',
      'Orchid and Biodiversity Park visit',
      'Scenic Tea Garden walks',
      'Authentic Assamese traditional cuisine'
    ],
    pricingTiers: [
      { id: 'standard', name: 'Standard', stars: '★★★ · 3-star resort', price: '₹12,500', priceUnit: '/ person', hotel: 'Cozy forest resorts near Kaziranga gate', features: ['3★ eco-resorts', 'Private AC vehicle transfer', 'Breakfast included', '1 Jeep safari ticket'], featured: false, btnClass: 'btn-outline' },
      { id: 'deluxe', name: 'Deluxe', stars: '★★★★ · 4-star lodge', price: '₹17,900', priceUnit: '/ person', hotel: 'Premium jungle lodges with swimming pool & garden views', features: ['4★ jungle lodges', 'Private vehicle transfer', 'Breakfast + Dinner', '1 Elephant + 1 Jeep safari'], featured: true, btnClass: 'btn-primary' }
    ],
    itinerary: [
      { day: 'Day 1', title: 'Guwahati Arrival → Kaziranga', desc: 'Pick up from Guwahati and drive to Kaziranga National Park (approx 4.5 hrs). Evening tea garden walk and cultural folk dance show.' },
      { day: 'Day 2', title: 'Kaziranga Jungle Safaris', desc: 'Early morning Elephant safari in Central Range. Post breakfast, afternoon Jeep safari in Western Range. Visit Orchid Park in evening.' },
      { day: 'Day 3', title: 'Kaziranga → Guwahati Departure', desc: 'After breakfast, drive back to Guwahati airport or station for departure.' }
    ],
    inclusions: ['Accommodation in chosen tier', 'Daily breakfast', 'Safaris & park entry permits', 'Private vehicle transfers'],
    exclusions: ['Airfare/Train tickets', 'Camera fees', 'Personal expenses'],
    sidebarFacts: { duration: '3D / 2N', startEnd: 'Guwahati', season: 'Nov – Apr', groupSize: '2 – 8', difficulty: 'Easy' }
  },
  'arunachal-1': {
    title: 'Tawang Circuit',
    duration: '7 days / 6 nights',
    route: 'Tezpur · Dirang · Tawang · Sela Pass',
    bestSeason: 'Mar – Jun & Sep – Nov',
    subtitle: 'High mountain monastery, clear lakes, Sela Pass and quiet Buddhist culture. For those who like altitude and calm.',
    priceFrom: '34,900',
    heroImage: 'https://images.unsplash.com/photo-1544735716-392fe2489ffa?auto=format&fit=crop&w=1920&q=80',
    highlights: [
      'Sela Pass & Sela Lake at 13,700 ft',
      'Tawang Monastery (largest in India)',
      'Madhuri Lake (Sangetsar Tso)',
      'Jaswant Garh War Memorial',
      'Dirang Valley & Kiwi orchards'
    ],
    pricingTiers: [
      { id: 'deluxe', name: 'Deluxe', stars: '★★★★ · 4-star mountain stays', price: '₹34,900', priceUnit: '/ person', hotel: 'Best boutique mountain hotels with heaters', features: ['Boutique mountain stays', 'Inland Line Permit (ILP) included', 'Dedicated SUV for high altitude', 'Breakfast daily'], featured: true, btnClass: 'btn-primary' }
    ],
    itinerary: [
      { day: 'Day 1', title: 'Guwahati / Tezpur → Dirang', desc: 'Drive up into the Eastern Himalayas towards Dirang. Check-in and relax.' },
      { day: 'Day 2', title: 'Dirang → Sela Pass → Tawang', desc: 'Drive across Sela Pass (13,700 ft) & Jaswant Garh. Arrive in Tawang.' },
      { day: 'Day 3', title: 'Tawang Monastery & Local Sightseeing', desc: 'Explore Tawang Monastery, Giant Buddha statue, and local craft centers.' },
      { day: 'Day 4', title: 'Sangetsar (Madhuri Lake) & Bum La Pass', desc: 'Excursion to high altitude lakes and Indo-China border (subject to weather).' },
      { day: 'Day 5', title: 'Tawang → Bomdila', desc: 'Scenic return journey down to Bomdila town.' },
      { day: 'Day 6', title: 'Bomdila → Guwahati', desc: 'Drive back to Guwahati plains for overnight stay.' },
      { day: 'Day 7', title: 'Guwahati Departure', desc: 'Transfer to Guwahati airport for return journey.' }
    ],
    inclusions: ['Inner Line Permits (ILP)', 'SUV for mountain roads', 'Hotels with heating', 'Breakfast daily'],
    exclusions: ['Bum La Pass local vehicle surcharge', 'Airfare/Train tickets', 'Personal expenses'],
    sidebarFacts: { duration: '7D / 6N', startEnd: 'Guwahati', season: 'Mar – Nov', groupSize: '2 – 6', difficulty: 'Moderate' }
  },
  'sikkim-1': {
    title: 'Sikkim Essentials',
    duration: '6 days / 5 nights',
    route: 'Gangtok · Tsomgo Lake · Nathula',
    bestSeason: 'Mar – May & Oct – Dec',
    subtitle: 'Mountain views, monasteries, lakes and the road to high passes. A balanced mix of comfort and scenery.',
    priceFrom: '28,500',
    heroImage: 'https://images.unsplash.com/photo-1506905925346-21bda4d32df4?auto=format&fit=crop&w=1920&q=80',
    highlights: [
      'Glacial Tsomgo Lake & Baba Mandir',
      'Rumtek & Enchey Monasteries',
      'Spectacular views of Mt. Kanchenjunga',
      'MG Marg Gangtok promenade',
      'Optional Nathula Pass border excursion'
    ],
    pricingTiers: [
      { id: 'standard', name: 'Standard', stars: '★★★ · 3-star Gangtok stay', price: '₹28,500', priceUnit: '/ person', hotel: 'Comfortable hotel near MG Marg', features: ['3★ hotel stays', 'Private vehicle transfers', 'Breakfast daily', 'Tsomgo Lake permits'], featured: true, btnClass: 'btn-primary' }
    ],
    itinerary: [
      { day: 'Day 1', title: 'NJP / Bagdogra → Gangtok', desc: 'Transfer from Bagdogra airport / NJP station to Gangtok. Evening walk at MG Marg.' },
      { day: 'Day 2', title: 'Tsomgo Lake & Baba Mandir', desc: 'Excursion to alpine Tsomgo Lake at 12,400 ft and Baba Harbhajan Singh Shrine.' },
      { day: 'Day 3', title: 'Gangtok City Sightseeing', desc: 'Visit Rumtek Monastery, Ropeway, Namgyal Institute of Tibetology, and Flower Exhibition.' },
      { day: 'Day 4', title: 'Gangtok → Pelling', desc: 'Drive to Pelling via Ravangla Buddha Park.' },
      { day: 'Day 5', title: 'Pelling Sightseeing', desc: 'Visit Skywalk, Pemayangtse Monastery, and Rabdentse Ruins.' },
      { day: 'Day 6', title: 'Pelling → Bagdogra Departure', desc: 'Transfer back to Bagdogra airport for departure flight.' }
    ],
    inclusions: ['Permits for Tsomgo Lake', 'Private vehicle transfers', 'Accommodation with breakfast', 'Sightseeing as per itinerary'],
    exclusions: ['Airfare/Train fare', 'Nathula Pass entry fee', 'Personal expenses'],
    sidebarFacts: { duration: '6D / 5N', startEnd: 'Bagdogra / NJP', season: 'Mar – Dec', groupSize: '2 – 10', difficulty: 'Easy – Moderate' }
  },
  'multistate-1': {
    title: 'Assam + Meghalaya',
    duration: '8 days / 7 nights',
    route: 'Guwahati · Kaziranga · Shillong · Cherrapunji',
    bestSeason: 'Oct – Apr',
    subtitle: 'Wildlife in the morning, root bridges and waterfalls in the afternoon. Two very different landscapes in one trip.',
    priceFrom: '32,900',
    heroImage: 'https://images.unsplash.com/photo-1464822759023-fed622ff2c3b?auto=format&fit=crop&w=1920&q=80',
    highlights: [
      'Kaziranga Rhino Jeep Safari',
      'Cherrapunji Waterfalls & Caves',
      'Living Root Bridge Trek',
      'Dawki Crystal River Boating',
      'Kamakhya Temple Guwahati'
    ],
    pricingTiers: [
      { id: 'deluxe', name: 'Deluxe', stars: '★★★★ · 4-star stays', price: '₹32,900', priceUnit: '/ person', hotel: 'Curated 4★ stays across Assam & Meghalaya', features: ['4★ stays', 'Private AC Vehicle', 'Breakfast daily', 'Safari included'], featured: true, btnClass: 'btn-primary' }
    ],
    itinerary: [
      { day: 'Day 1', title: 'Arrive Guwahati → Kaziranga', desc: 'Pick up & drive to Kaziranga National Park.' },
      { day: 'Day 2', title: 'Kaziranga Safari → Shillong', desc: 'Morning Safari in Kaziranga, then scenic drive to Shillong.' },
      { day: 'Day 3', title: 'Shillong Local Sightseeing', desc: 'Visit Ward’s Lake, Cathedral, Don Bosco Museum, and Umiam Lake.' },
      { day: 'Day 4', title: 'Shillong → Cherrapunji', desc: 'Visit Nohkalikai & Seven Sisters Waterfalls, Mawsmai Cave.' },
      { day: 'Day 5', title: 'Living Root Bridge Trek', desc: 'Day trek to double-decker living root bridge at Nongriat.' },
      { day: 'Day 6', title: 'Dawki & Mawlynnong', desc: 'Visit Asia’s cleanest village and boat on Umngot River at Dawki.' },
      { day: 'Day 7', title: 'Return to Shillong', desc: 'Leisurely morning in Dawki, return to Shillong for shopping.' },
      { day: 'Day 8', title: 'Shillong → Guwahati Departure', desc: 'Visit Kamakhya Temple and drop at Guwahati airport.' }
    ],
    inclusions: ['4★ Accommodation', 'Private AC vehicle throughout', 'Safari ticket in Kaziranga', 'Breakfast daily'],
    exclusions: ['Airfare/Train tickets', 'Personal expenses', 'Optional activity charges'],
    sidebarFacts: { duration: '8D / 7N', startEnd: 'Guwahati', season: 'Oct – Apr', groupSize: '2 – 12', difficulty: 'Moderate' }
  }
};

const PackageDetails = () => {
  const { id } = useParams();
  const [pkgData, setPkgData] = useState(null);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const fetchPackage = async () => {
      // 1. First check if id matches one of our default static packages
      if (defaultPackagesMap[id]) {
        const defaultItem = defaultPackagesMap[id];
        setPkgData(defaultItem);
        document.title = `${defaultItem.title} – ${defaultItem.duration} | Travmitraa`;
        setLoading(false);
        return;
      }

      // 2. Otherwise try fetching from backend API
      try {
        const data = await getPackage(id);
        if (data && data.title) {
          setPkgData({
            title: data.title,
            duration: data.duration || '5 days / 4 nights',
            route: data.destination || 'North East India',
            bestSeason: 'Oct – May',
            subtitle: data.description,
            priceFrom: typeof data.price === 'number' ? data.price.toLocaleString('en-IN') : data.price,
            heroImage: (data.images && data.images[0]) || defaultPackagesMap['meghalaya-1'].heroImage,
            highlights: data.highlights && data.highlights.length > 0 ? data.highlights : defaultPackagesMap['meghalaya-1'].highlights,
            pricingTiers: defaultPackagesMap['meghalaya-1'].pricingTiers,
            itinerary: data.itinerary && data.itinerary.length > 0 
              ? data.itinerary.map(item => ({ day: `Day ${item.day}`, title: item.title, desc: item.description }))
              : defaultPackagesMap['meghalaya-1'].itinerary,
            inclusions: data.included && data.included.length > 0 ? data.included : defaultPackagesMap['meghalaya-1'].inclusions,
            exclusions: data.excluded && data.excluded.length > 0 ? data.excluded : defaultPackagesMap['meghalaya-1'].exclusions,
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
          setPkgData(defaultPackagesMap['meghalaya-1']);
          document.title = `Meghalaya Highlights – 5 Days | Travmitraa`;
        }
      } catch (err) {
        console.error('Fetching package failed, using default details:', err);
        setPkgData(defaultPackagesMap['meghalaya-1']);
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

  const data = pkgData || defaultPackagesMap['meghalaya-1'];

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
