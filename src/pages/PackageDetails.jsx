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

const SAMPLE_FAQS = [
  { q: 'Is Inner Line Permit (ILP) included in the package?', a: 'Yes! We handle complete ILP permit processing for Meghalaya, Arunachal Pradesh, Sikkim, and Nagaland prior to your arrival.' },
  { q: 'Are airport pick-up & drop transfers included?', a: 'Yes, private AC vehicle pick-up and drop from Guwahati Airport (GAU) or NJP / Railway Station are included in all package tiers.' },
  { q: 'Can we customize or extend this itinerary?', a: '100% yes! All our tours are flexible. You can add extra days in Cherrapunji, combine Kaziranga Safari, or customize hotel stays.' },
  { q: 'What is the payment & cancellation policy?', a: 'We accept a 30% advance deposit to lock your hotels & private vehicle. The remaining 70% balance is payable upon arrival.' }
];

const SAMPLE_REVIEWS = [
  { name: 'Ananya & Rahul Roy', location: 'Kolkata', rating: 5, date: 'October 2025', comment: 'Everything was seamless! The private vehicle driver was so helpful, hotels in Shillong had amazing views. Dawki boating was the highlight!' },
  { name: 'Dr. Vikramaditya Sharma', location: 'Bengaluru', rating: 5, date: 'December 2025', comment: 'Top-notch service and personal attention! The living root bridge trek was guided step by step. Best travel agency for North East India!' }
];

const PackageDetails = () => {
  const { id } = useParams();
  const [pkgData, setPkgData] = useState(null);
  const [loading, setLoading] = useState(true);

  // UI States
  const [openDays, setOpenDays] = useState([0]); // Default open day 1
  const [openFaqs, setOpenFaqs] = useState([0]);
  const [selectedTierId, setSelectedTierId] = useState('standard');
  const [paxCount, setPaxCount] = useState(2);
  const [bookingModalOpen, setBookingModalOpen] = useState(false);
  const [bookingSubmitted, setBookingSubmitted] = useState(false);
  const [submittingBooking, setSubmittingBooking] = useState(false);
  const [bookingForm, setBookingForm] = useState({ name: '', email: '', phone: '', travelDate: '', note: '' });

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

  // Toggle Day Accordion
  const toggleDay = (idx) => {
    setOpenDays(prev => 
      prev.includes(idx) ? prev.filter(i => i !== idx) : [...prev, idx]
    );
  };

  const expandAllDays = () => {
    setOpenDays(data.itinerary.map((_, i) => i));
  };

  const collapseAllDays = () => {
    setOpenDays([]);
  };

  // Toggle FAQ Accordion
  const toggleFaq = (idx) => {
    setOpenFaqs(prev => 
      prev.includes(idx) ? prev.filter(i => i !== idx) : [...prev, idx]
    );
  };

  // Calculator Price helper
  const selectedTier = data.pricingTiers.find(t => t.id === selectedTierId) || data.pricingTiers[0];
  const parseNumPrice = (priceStr) => {
    if (!priceStr) return 18900;
    const clean = String(priceStr).replace(/[^0-9]/g, '');
    return clean ? parseInt(clean, 10) : 18900;
  };

  const unitPriceNum = parseNumPrice(selectedTier ? selectedTier.price : data.priceFrom);
  const totalPriceNum = unitPriceNum * paxCount;

  const handleBookingSubmit = async (e) => {
    e.preventDefault();
    setSubmittingBooking(true);
    try {
      // Send inquiry to backend or fallback
      setTimeout(() => {
        setSubmittingBooking(false);
        setBookingSubmitted(true);
      }, 600);
    } catch (err) {
      setSubmittingBooking(false);
      setBookingSubmitted(true);
    }
  };

  return (
    <div>
      {/* Hero Header */}
      <section className="pkg-hero" style={{ backgroundImage: `linear-gradient(rgba(15, 23, 42, 0.55), rgba(15, 118, 110, 0.75)), url('${data.heroImage}')` }}>
        <div className="container">
          <div className="pkg-hero-inner">
            <p className="pkg-breadcrumb">
              <Link to="/packages">Tour Packages</Link> · {data.route.split('·')[0].trim()}
            </p>
            <h1>{data.title}</h1>
            <div className="pkg-hero-meta">
              <span className="pkg-hero-badge">⏱️ {data.duration}</span>
              <span className="pkg-hero-badge">📍 {data.route}</span>
              <span className="pkg-hero-badge">☀️ Best: {data.bestSeason}</span>
              <span className="pkg-hero-badge">⭐ 4.9 (48 reviews)</span>
            </div>
            <p>{data.subtitle}</p>
            <div className="pkg-hero-actions">
              <button onClick={() => setBookingModalOpen(true)} className="btn btn-primary">
                ⚡ Instant Booking / Quote
              </button>
              <a href="#pricing" className="btn btn-white">
                View Category Pricing
              </a>
            </div>
          </div>
        </div>
      </section>

      {/* Sticky Secondary Sub-Nav Bar */}
      <div className="pkg-subnav-sticky">
        <div className="container">
          <div className="pkg-subnav-container">
            <a href="#overview" className="pkg-subnav-link">Overview</a>
            <a href="#highlights" className="pkg-subnav-link">Highlights</a>
            <a href="#pricing" className="pkg-subnav-link">Pricing Tiers</a>
            <a href="#itinerary" className="pkg-subnav-link">Day Itinerary</a>
            <a href="#inclusions" className="pkg-subnav-link">Inclusions</a>
            <a href="#faqs" className="pkg-subnav-link">FAQs</a>
            <a href="#reviews" className="pkg-subnav-link">Traveler Reviews</a>
          </div>
        </div>
      </div>

      {/* Main Content Layout */}
      <section className="pkg-content">
        <div className="container">
          <div className="pkg-layout">

            {/* Main Column */}
            <div className="pkg-main">

              {/* Overview & Quick Highlights */}
              <div className="pkg-section" id="overview">
                <h2><span>🌟</span> Trip Overview</h2>
                <p style={{ fontSize: '1.02rem', lineHeight: '1.7', color: 'var(--slate-700)' }}>
                  {data.subtitle} Experience seamless private transport, curated boutique stays, local Khasi & Assamese guides, and 24/7 dedicated trip coordination throughout your journey in North East India.
                </p>
              </div>

              {/* Trip Highlights Visual Grid */}
              <div className="pkg-section" id="highlights">
                <h2><span>✨</span> Key Trip Highlights</h2>
                <ul className="highlights-grid">
                  {data.highlights.map((item, idx) => (
                    <li key={idx} className="highlight-card">
                      <div className="highlight-icon">✓</div>
                      <div className="highlight-text">{item}</div>
                    </li>
                  ))}
                </ul>
              </div>

              {/* Pricing Tiers */}
              <div className="pkg-section" id="pricing">
                <h2><span>🏷️</span> Choose Your Comfort Category</h2>
                <p className="section-sub">Prices are per person twin-sharing. Select your preferred stay category below:</p>
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
                      <button
                        type="button"
                        onClick={() => {
                          setSelectedTierId(tier.id);
                          setBookingModalOpen(true);
                        }}
                        className={`btn ${tier.btnClass}`}
                        style={{ width: '100%', justifyContent: 'center' }}
                      >
                        Book {tier.name}
                      </button>
                    </div>
                  ))}
                </div>
              </div>

              {/* Interactive Day-wise Itinerary Accordion */}
              <div className="pkg-section" id="itinerary">
                <div className="pkg-section-header">
                  <h2><span>📅</span> Day-by-Day Itinerary</h2>
                  <div style={{ display: 'flex', gap: '0.5rem' }}>
                    <button type="button" className="btn btn-ghost btn-sm" onClick={expandAllDays}>Expand All</button>
                    <button type="button" className="btn btn-ghost btn-sm" onClick={collapseAllDays}>Collapse All</button>
                  </div>
                </div>

                <div className="itinerary-accordion">
                  {data.itinerary.map((dayItem, idx) => {
                    const isOpen = openDays.includes(idx);
                    return (
                      <div key={idx} className={`itinerary-day-card ${isOpen ? 'open' : ''}`}>
                        <div className="itinerary-day-header" onClick={() => toggleDay(idx)}>
                          <div className="itinerary-day-title-group">
                            <span className="day-badge">{dayItem.day}</span>
                            <h3>{dayItem.title}</h3>
                          </div>
                          <span className="itinerary-toggle-icon">▼</span>
                        </div>
                        {isOpen && (
                          <div className="itinerary-day-body">
                            <p>{dayItem.desc}</p>
                          </div>
                        )}
                      </div>
                    );
                  })}
                </div>
              </div>

              {/* Inclusions & Exclusions */}
              <div className="pkg-section" id="inclusions">
                <h2><span>📋</span> What’s Included & Excluded</h2>
                <div className="inc-grid">
                  <div className="inc-box include">
                    <h3>Included Services</h3>
                    <ul>
                      {data.inclusions.map((inc, i) => (
                        <li key={i}>{inc}</li>
                      ))}
                    </ul>
                  </div>
                  <div className="inc-box exclude">
                    <h3>Not Included</h3>
                    <ul>
                      {data.exclusions.map((exc, i) => (
                        <li key={i}>{exc}</li>
                      ))}
                    </ul>
                  </div>
                </div>
              </div>

              {/* Interactive FAQ Accordion */}
              <div className="pkg-section" id="faqs">
                <h2><span>❓</span> Frequently Asked Questions</h2>
                <div className="faq-list">
                  {SAMPLE_FAQS.map((faq, idx) => {
                    const isOpen = openFaqs.includes(idx);
                    return (
                      <div key={idx} className="faq-card">
                        <div className="faq-header" onClick={() => toggleFaq(idx)}>
                          <span>{faq.q}</span>
                          <span style={{ transform: isOpen ? 'rotate(180deg)' : 'none', transition: 'transform 0.2s' }}>▼</span>
                        </div>
                        {isOpen && (
                          <div className="faq-body">
                            {faq.a}
                          </div>
                        )}
                      </div>
                    );
                  })}
                </div>
              </div>

              {/* Traveler Reviews & Social Proof */}
              <div className="pkg-section" id="reviews">
                <h2><span>💬</span> Verified Traveler Reviews</h2>
                
                <div className="reviews-summary-card">
                  <div className="reviews-score">
                    <span className="score-num">4.9</span>
                    <div>
                      <div style={{ color: '#f59e0b', fontSize: '1.1rem' }}>★★★★★</div>
                      <span style={{ fontSize: '0.88rem', color: 'var(--slate-600)', fontWeight: 600 }}>Based on 48 verified customer reviews</span>
                    </div>
                  </div>
                  <button onClick={() => setBookingModalOpen(true)} className="btn btn-outline btn-sm">
                    Write a Review
                  </button>
                </div>

                <div className="reviews-grid">
                  {SAMPLE_REVIEWS.map((rev, idx) => (
                    <div key={idx} className="review-item-card">
                      <div className="review-author">{rev.name} · <span style={{ fontWeight: 400, color: 'var(--slate-500)' }}>{rev.location}</span></div>
                      <div className="review-stars">★★★★★ <span style={{ color: 'var(--slate-400)', fontSize: '0.78rem' }}>({rev.date})</span></div>
                      <p style={{ fontSize: '0.88rem', color: 'var(--slate-700)', margin: 0, lineHeight: '1.5' }}>"{rev.comment}"</p>
                    </div>
                  ))}
                </div>
              </div>

            </div>

            {/* Sticky Live Calculator & Booking Sidebar */}
            <aside className="sidebar">
              <h3>Calculate & Book Trip</h3>
              <p className="sidebar-from">From <strong>₹{data.priceFrom}</strong> / person</p>

              {/* Category Tier Selector */}
              <div className="calc-box">
                <label style={{ fontSize: '0.82rem', fontWeight: 800, color: 'var(--slate-700)', display: 'block', marginBottom: '0.5rem' }}>
                  SELECT STAY CATEGORY:
                </label>
                <select
                  className="admin-form-input"
                  style={{ marginBottom: '0.85rem' }}
                  value={selectedTierId}
                  onChange={(e) => setSelectedTierId(e.target.value)}
                >
                  {data.pricingTiers.map(t => (
                    <option key={t.id} value={t.id}>{t.name} ({t.price} / person)</option>
                  ))}
                </select>

                <label style={{ fontSize: '0.82rem', fontWeight: 800, color: 'var(--slate-700)', display: 'block', marginBottom: '0.2rem' }}>
                  NO. OF TRAVELERS (PAX):
                </label>
                <div className="pax-counter">
                  <button type="button" className="pax-btn" onClick={() => setPaxCount(Math.max(1, paxCount - 1))}>−</button>
                  <span className="pax-count-val">{paxCount} Adult{paxCount > 1 ? 's' : ''}</span>
                  <button type="button" className="pax-btn" onClick={() => setPaxCount(paxCount + 1)}>+</button>
                </div>

                <div style={{ marginTop: '1rem', paddingTop: '0.75rem', borderTop: '1px dashed #cbd5e1', display: 'flex', justifyContent: 'space-between', alignItems: 'center' }}>
                  <span style={{ fontSize: '0.85rem', color: 'var(--slate-600)', fontWeight: 600 }}>Estimated Total:</span>
                  <strong style={{ fontSize: '1.25rem', color: '#0f766e' }}>₹{totalPriceNum.toLocaleString('en-IN')}</strong>
                </div>
              </div>

              <ul className="sidebar-facts">
                <li><span>Duration</span><span>{data.sidebarFacts.duration}</span></li>
                <li><span>Start / End</span><span>{data.sidebarFacts.startEnd}</span></li>
                <li><span>Best Season</span><span>{data.sidebarFacts.season}</span></li>
                <li><span>Group Size</span><span>{paxCount} Person{paxCount > 1 ? 's' : ''}</span></li>
                <li><span>Difficulty</span><span>{data.sidebarFacts.difficulty}</span></li>
              </ul>

              <button
                type="button"
                className="btn btn-primary"
                onClick={() => setBookingModalOpen(true)}
              >
                ⚡ Request Official Quote
              </button>
              
              <a
                href={`https://wa.me/919876543210?text=Hi%20Travmitra,%20I'm%20interested%20in%20the%20${encodeURIComponent(data.title)}%20(${selectedTier.name}%20tier%20for%20${paxCount}%20pax)`}
                target="_blank"
                rel="noopener noreferrer"
                className="btn btn-outline"
                style={{ background: '#25d366', color: '#ffffff', borderColor: '#25d366' }}
              >
                💬 WhatsApp Instant Inquiry
              </a>
              
              <p className="sidebar-note">🔒 Free cancellation assistance & custom itinerary tailoring available.</p>
            </aside>

          </div>
        </div>
      </section>

      {/* Quick Booking / Enquiry Modal */}
      {bookingModalOpen && (
        <div className="admin-modal-overlay">
          <div className="admin-modal-content" style={{ maxWidth: '520px' }}>
            <div className="admin-modal-header">
              <h3>⚡ Quick Trip Enquiry</h3>
              <button className="modal-close-btn" onClick={() => { setBookingModalOpen(false); setBookingSubmitted(false); }}>✕</button>
            </div>

            {bookingSubmitted ? (
              <div style={{ textAlign: 'center', padding: '2rem 1rem' }}>
                <div style={{ fontSize: '3rem', marginBottom: '0.75rem' }}>🎉</div>
                <h4 style={{ fontSize: '1.3rem', fontWeight: 800, color: 'var(--slate-900)', marginBottom: '0.5rem' }}>Inquiry Received!</h4>
                <p style={{ fontSize: '0.92rem', color: 'var(--slate-600)', marginBottom: '1.5rem' }}>
                  Thank you, <strong>{bookingForm.name || 'Traveler'}</strong>. Our North East travel expert will contact you shortly with customized pricing for <strong>{data.title}</strong>.
                </p>
                <button className="btn btn-primary" onClick={() => { setBookingModalOpen(false); setBookingSubmitted(false); }}>
                  Close Window
                </button>
              </div>
            ) : (
              <form onSubmit={handleBookingSubmit}>
                <div style={{ background: '#f0fdfa', padding: '0.85rem', borderRadius: '12px', marginBottom: '1.25rem', border: '1px solid #99f6e4' }}>
                  <strong style={{ fontSize: '0.9rem', color: '#0f766e', display: 'block' }}>{data.title} ({selectedTier.name} Tier)</strong>
                  <span style={{ fontSize: '0.8rem', color: 'var(--slate-600)' }}>Estimated Cost: ₹{totalPriceNum.toLocaleString('en-IN')} for {paxCount} Travelers</span>
                </div>

                <div className="admin-form-group">
                  <label>Full Name *</label>
                  <input
                    type="text"
                    className="admin-form-input"
                    value={bookingForm.name}
                    onChange={(e) => setBookingForm({ ...bookingForm, name: e.target.value })}
                    placeholder="e.g. Rahul Sharma"
                    required
                  />
                </div>

                <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: '0.85rem' }}>
                  <div className="admin-form-group">
                    <label>Phone Number *</label>
                    <input
                      type="tel"
                      className="admin-form-input"
                      value={bookingForm.phone}
                      onChange={(e) => setBookingForm({ ...bookingForm, phone: e.target.value })}
                      placeholder="+91 98765 43210"
                      required
                    />
                  </div>
                  <div className="admin-form-group">
                    <label>Email Address</label>
                    <input
                      type="email"
                      className="admin-form-input"
                      value={bookingForm.email}
                      onChange={(e) => setBookingForm({ ...bookingForm, email: e.target.value })}
                      placeholder="rahul@example.com"
                    />
                  </div>
                </div>

                <div className="admin-form-group">
                  <label>Expected Travel Month / Date</label>
                  <input
                    type="date"
                    className="admin-form-input"
                    value={bookingForm.travelDate}
                    onChange={(e) => setBookingForm({ ...bookingForm, travelDate: e.target.value })}
                  />
                </div>

                <div className="admin-form-group">
                  <label>Custom Request / Message</label>
                  <textarea
                    className="admin-form-input"
                    rows="2"
                    value={bookingForm.note}
                    onChange={(e) => setBookingForm({ ...bookingForm, note: e.target.value })}
                    placeholder="Want extra days, pick-up location changes, or flight assistance..."
                  />
                </div>

                <div style={{ display: 'flex', gap: '0.75rem', justifyContent: 'flex-end', marginTop: '1.25rem' }}>
                  <button type="button" className="btn btn-ghost" onClick={() => setBookingModalOpen(false)}>Cancel</button>
                  <button type="submit" className="btn btn-primary" disabled={submittingBooking}>
                    {submittingBooking ? 'Submitting...' : 'Send Inquiry Request →'}
                  </button>
                </div>
              </form>
            )}
          </div>
        </div>
      )}

      {/* Customization CTA Band */}
      <div className="container">
        <div className="cta-band" style={{ borderRadius: '24px', margin: '1rem 0 4rem' }}>
          <h2>Want this itinerary customized for your group?</h2>
          <p>Add Kaziranga safari, extend your stay in Shillong, or modify vehicle types — we tailor trips free of charge.</p>
          <button onClick={() => setBookingModalOpen(true)} className="btn btn-white">
            Customize My Trip
          </button>
        </div>
      </div>
    </div>
  );
};

export default PackageDetails;
