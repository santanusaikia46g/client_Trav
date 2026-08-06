import React, { useState, useEffect } from 'react';
import { useParams, Link } from 'react-router-dom';
import { getPackage } from '../services/api';
import Spinner from '../components/Spinner';

// Regional fallback packages dictionary
const regionalPackageDetails = {
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
      { id: 'std', name: 'Standard', stars: '★★★ · 3-star hotels', price: '₹18,900', priceUnit: '/ person', hotel: 'Clean 3★ stays in Shillong & Cherrapunji', features: ['3★ hotels / guesthouses', 'Private AC vehicle', 'Breakfast daily', 'Local guide on key days'], featured: false, btnClass: 'btn-outline' },
      { id: 'dlx', name: 'Deluxe', stars: '★★★★ · 4-star hotels', price: '₹24,900', priceUnit: '/ person', hotel: 'Comfortable 4★ hotels with views', features: ['4★ hotels / resorts', 'Private AC vehicle', 'Breakfast + 2 dinners', 'Dedicated local guide'], featured: true, btnClass: 'btn-primary' },
      { id: 'lux', name: 'Luxury', stars: '★★★★★ · 5-star / premium', price: '₹34,900', priceUnit: '/ person', hotel: 'Premium resorts & boutique stays', features: ['5★ / premium resorts', 'Premium private vehicle', 'All meals included', 'Private guide throughout'], featured: false, btnClass: 'btn-outline' }
    ],
    itinerary: [
      { day: 'Day 1', title: 'Arrive Guwahati → Shillong', desc: 'Meet at Guwahati airport or station. Scenic drive to Shillong (approx. 3.5 hrs). Check-in, evening at Ward’s Lake. Overnight Shillong.' },
      { day: 'Day 2', title: 'Shillong local · Umiam Lake', desc: 'Visit Don Bosco Museum, Cathedral, Police Bazaar, and Umiam Lake. Overnight Shillong.' },
      { day: 'Day 3', title: 'Cherrapunji · Waterfalls & caves', desc: 'Drive to Cherrapunji. Visit Nohkalikai Falls, Seven Sisters Falls, and Mawsmai Cave. Overnight Cherrapunji.' },
      { day: 'Day 4', title: 'Living root bridge · Dawki', desc: 'Trek to the double-decker living root bridge. Drive to Dawki for Umngot river boating. Return to Shillong.' },
      { day: 'Day 5', title: 'Shillong → Guwahati departure', desc: 'Breakfast, scenic drive back to Guwahati airport or station for onward journey.' }
    ],
    inclusions: ['Twin-share accommodation', 'Daily breakfast', 'Private AC vehicle for all transfers', 'Entry fees & parking', 'Local guide on key days'],
    exclusions: ['Flights / trains', 'Lunch & dinner', 'Personal expenses & tips', 'Optional boating extras'],
    sidebarFacts: { duration: '5D / 4N', startEnd: 'Guwahati', season: 'Oct – May', groupSize: '2 – 12', difficulty: 'Easy – Moderate' }
  },
  'assam-1': {
    title: 'Kaziranga Safari',
    duration: '3 days / 2 nights',
    route: 'Kaziranga National Park',
    bestSeason: 'Nov – Apr',
    subtitle: 'One-horned rhinos, early morning jeep safaris, wild elephant herds and quiet stays near the national park.',
    priceFrom: '12,500',
    heroImage: 'https://images.unsplash.com/photo-1566073771259-6a8506099945?auto=format&fit=crop&w=1920&q=80',
    highlights: [
      'Early morning Elephant safari in Central Range',
      'Jeep safari in Western Range (Bagori)',
      'Tea garden estate walkthrough',
      'Orchid Park & cultural dance performance',
      'Assamese traditional cuisine sampling'
    ],
    pricingTiers: [
      { id: 'std', name: 'Standard', stars: '★★★ · Safari Lodge', price: '₹12,500', priceUnit: '/ person', hotel: 'Cozy jungle lodge near park gate', features: ['Jungle lodge stay', '1 Jeep Safari included', 'Breakfast & Dinner', 'Park naturalist guide'], featured: false, btnClass: 'btn-outline' },
      { id: 'dlx', name: 'Deluxe', stars: '★★★★ · Eco Resort', price: '₹16,900', priceUnit: '/ person', hotel: 'Eco-resort with pool & garden views', features: ['4★ Eco Resort', '1 Jeep + 1 Elephant Safari', 'All meals included', 'Private park guide'], featured: true, btnClass: 'btn-primary' }
    ],
    itinerary: [
      { day: 'Day 1', title: 'Guwahati → Kaziranga', desc: 'Pick up from Guwahati and drive to Kaziranga National Park (approx. 4 hrs). Check-in and evening cultural show.' },
      { day: 'Day 2', title: 'Kaziranga Safaris', desc: 'Early morning Elephant safari followed by breakfast. Afternoon Jeep safari deep inside the park.' },
      { day: 'Day 3', title: 'Kaziranga → Guwahati', desc: 'Visit Kaziranga Orchid Park, then drive back to Guwahati for departure.' }
    ],
    inclusions: ['Lodge/Resort accommodation', 'Daily breakfast & dinner', 'Jeep safari charges & permits', 'Private transfer vehicle'],
    exclusions: ['Camera fees', 'Airfare/Train tickets', 'Personal expenses'],
    sidebarFacts: { duration: '3D / 2N', startEnd: 'Guwahati', season: 'Nov – Apr', groupSize: '2 – 8', difficulty: 'Easy' }
  },
  'arunachal-1': {
    title: 'Tawang Circuit',
    duration: '7 days / 6 nights',
    route: 'Tawang · Sela Pass · Dirang',
    bestSeason: 'Oct – May',
    subtitle: 'High mountain monastery, crystal clear lakes, snow-capped Sela Pass and serene Buddhist culture.',
    priceFrom: '34,900',
    heroImage: 'https://images.unsplash.com/photo-1544735716-392fe2489ffa?auto=format&fit=crop&w=1920&q=80',
    highlights: [
      'Tawang Monastery (2nd largest in Asia)',
      'Sela Pass at 13,700 feet & Sela Lake',
      'Bum La Pass (Indo-China Border)',
      'Madhuri Lake (Sangetsar Tso)',
      'Jaswant Garh War Memorial & Dirang valley'
    ],
    pricingTiers: [
      { id: 'std', name: 'Standard', stars: '★★★ · Mountain Hotel', price: '₹34,900', priceUnit: '/ person', hotel: 'Comfortable heated stays in Tawang & Dirang', features: ['Mountain hotels', 'Inland Permit (ILP) support', 'SUV Vehicle (Innova/Scorpio)', 'Daily Breakfast'], featured: true, btnClass: 'btn-primary' }
    ],
    itinerary: [
      { day: 'Day 1', title: 'Guwahati → Tezpur / Bhalukpong', desc: 'Drive from Guwahati to Bhalukpong at the foothills of Arunachal Pradesh.' },
      { day: 'Day 2', title: 'Bhalukpong → Dirang', desc: 'Drive through Apple orchards and kiwi farms to Dirang valley. Visit Dirang Dzong.' },
      { day: 'Day 3', title: 'Dirang → Tawang via Sela Pass', desc: 'Cross Sela Pass (13,700 ft) and visit Jaswant Garh. Arrive in Tawang.' },
      { day: 'Day 4', title: 'Tawang Monastery & City', desc: 'Explore Tawang Monastery, Ani Gompa, and War Memorial.' },
      { day: 'Day 5', title: 'Bum La Pass & Madhuri Lake', desc: 'Excursion to Indo-China border at Bum La and Sangetsar Lake.' },
      { day: 'Day 6', title: 'Tawang → Bomdila', desc: 'Scenic drive back through Bomdila Monastery.' },
      { day: 'Day 7', title: 'Bomdila → Guwahati', desc: 'Drive back to Guwahati airport/station for departure.' }
    ],
    inclusions: ['Hotel accommodation', 'ILP permits', 'SUV transport', 'Daily breakfast'],
    exclusions: ['Bum La Pass local vehicle union charges', 'Meals except breakfast', 'Personal items'],
    sidebarFacts: { duration: '7D / 6N', startEnd: 'Guwahati', season: 'Oct – May', groupSize: '2 – 6', difficulty: 'Moderate' }
  },
  'sikkim-1': {
    title: 'Sikkim Essentials',
    duration: '6 days / 5 nights',
    route: 'Gangtok · Lachen · Lachung · Yumthang',
    bestSeason: 'Mar – Jun, Oct – Dec',
    subtitle: 'High mountain passes, sacred Gurudongmar Lake, rhododendron valleys, and majestic Kanchenjunga views.',
    priceFrom: '28,500',
    heroImage: 'https://images.unsplash.com/photo-1506905925346-21bda4d32df4?auto=format&fit=crop&w=1920&q=80',
    highlights: [
      'Tsomgo Lake & Baba Mandir near Nathula Pass',
      'High altitude Gurudongmar Lake (17,800 ft)',
      'Yumthang Valley of Flowers',
      'Rumtek & Enchey Monasteries in Gangtok',
      'Panoramic Kanchenjunga views from Tashi Viewpoint'
    ],
    pricingTiers: [
      { id: 'std', name: 'Standard', stars: '★★★ · Gangtok Hotel', price: '₹28,500', priceUnit: '/ person', hotel: 'Comfortable stays in Gangtok & North Sikkim lodges', features: ['3★ hotels & North Sikkim homestays', 'Sikkim PAP permits', 'Private vehicle', 'Daily breakfast & North Sikkim meals'], featured: true, btnClass: 'btn-primary' }
    ],
    itinerary: [
      { day: 'Day 1', title: 'Bagdogra / NJP → Gangtok', desc: 'Arrive at airport/railway station and drive to Gangtok (approx. 4.5 hrs).' },
      { day: 'Day 2', title: 'Tsomgo Lake & Baba Mandir', desc: 'Day excursion to glacial Tsomgo Lake and Baba Harbhajan Singh Mandir.' },
      { day: 'Day 3', title: 'Gangtok → Lachen', desc: 'Drive north to Lachen village via Seven Sister Waterfalls.' },
      { day: 'Day 4', title: 'Gurudongmar Lake → Lachung', desc: 'Early morning drive to Gurudongmar Lake (17,800 ft), then transfer to Lachung.' },
      { day: 'Day 5', title: 'Yumthang Valley → Gangtok', desc: 'Visit Zero Point / Yumthang Valley of Flowers, then return to Gangtok.' },
      { day: 'Day 6', title: 'Gangtok → Bagdogra / NJP', desc: 'Departure transfer back to Bagdogra airport / NJP station.' }
    ],
    inclusions: ['Accommodation', 'North Sikkim permits', 'Transport', 'Breakfast & North Sikkim all meals'],
    exclusions: ['Nathula Pass union extra', 'Airfare/Train tickets', 'Personal expenses'],
    sidebarFacts: { duration: '6D / 5N', startEnd: 'Bagdogra / NJP', season: 'Oct – Jun', groupSize: '2 – 8', difficulty: 'Moderate' }
  },
  'multistate-1': {
    title: 'Assam + Meghalaya',
    duration: '8 days / 7 nights',
    route: 'Kaziranga · Guwahati · Shillong · Cherrapunji',
    bestSeason: 'Oct – Apr',
    subtitle: 'Wildlife safaris in Kaziranga combined with waterfalls, root bridges, and pine forests of Meghalaya.',
    priceFrom: '32,900',
    heroImage: 'https://images.unsplash.com/photo-1464822759023-fed622ff2c3b?auto=format&fit=crop&w=1920&q=80',
    highlights: [
      'Jeep and Elephant safaris in Kaziranga National Park',
      'Kamakhya Temple blessing in Guwahati',
      'Living Root Bridge trek in Cherrapunji',
      'Clear Umngot River in Dawki',
      'Shillong pine forests & Umiam Lake'
    ],
    pricingTiers: [
      { id: 'std', name: 'Standard', stars: '★★★ · Hotels & Lodges', price: '₹32,900', priceUnit: '/ person', hotel: 'Top-rated stays across Assam & Meghalaya', features: ['3★ stays throughout', 'Kaziranga safaris included', 'Private vehicle', 'Daily breakfast'], featured: true, btnClass: 'btn-primary' }
    ],
    itinerary: [
      { day: 'Day 1', title: 'Arrive Guwahati → Kaziranga', desc: 'Pick up at Guwahati airport/station and drive straight to Kaziranga National Park.' },
      { day: 'Day 2', title: 'Kaziranga Safaris', desc: 'Morning elephant safari and afternoon jeep safari in Kaziranga.' },
      { day: 'Day 3', title: 'Kaziranga → Shillong', desc: 'Drive from Kaziranga to Shillong via Umiam Lake.' },
      { day: 'Day 4', title: 'Shillong → Cherrapunji', desc: 'Sightseeing of Nohkalikai, Mawsmai cave, and stay in Cherrapunji.' },
      { day: 'Day 5', title: 'Root Bridge Trek', desc: 'Trek to Nongriat double-decker living root bridge.' },
      { day: 'Day 6', title: 'Dawki & Mawlynnong', desc: 'Visit Asia’s cleanest village Mawlynnong and crystal clear Dawki river.' },
      { day: 'Day 7', title: 'Dawki → Shillong', desc: 'Return to Shillong for local handicraft shopping and Ward Lake.' },
      { day: 'Day 8', title: 'Shillong → Guwahati Departure', desc: 'Visit Kamakhya Temple in Guwahati before departure drop.' }
    ],
    inclusions: ['Hotel stays', 'Safaris in Kaziranga', 'Private AC vehicle', 'Breakfast daily'],
    exclusions: ['Airfare', 'Lunches & dinners', 'Entry/camera fees'],
    sidebarFacts: { duration: '8D / 7N', startEnd: 'Guwahati', season: 'Oct – Apr', groupSize: '2 – 10', difficulty: 'Moderate' }
  }
};

const PackageDetails = () => {
  const { id } = useParams();
  const [pkgData, setPkgData] = useState(null);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const fetchPackage = async () => {
      // 1. Check if ID matches a regional fallback static key
      if (regionalPackageDetails[id]) {
        setPkgData(regionalPackageDetails[id]);
        document.title = `${regionalPackageDetails[id].title} | Travmitraa`;
        setLoading(false);
        return;
      }

      // 2. Try fetching from database API
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
            heroImage: (data.images && data.images[0]) || regionalPackageDetails['meghalaya-1'].heroImage,
            highlights: data.highlights && data.highlights.length > 0 ? data.highlights : regionalPackageDetails['meghalaya-1'].highlights,
            pricingTiers: regionalPackageDetails['meghalaya-1'].pricingTiers,
            itinerary: data.itinerary && data.itinerary.length > 0 
              ? data.itinerary.map(item => ({ day: `Day ${item.day}`, title: item.title, desc: item.description }))
              : regionalPackageDetails['meghalaya-1'].itinerary,
            inclusions: data.included && data.included.length > 0 ? data.included : regionalPackageDetails['meghalaya-1'].inclusions,
            exclusions: data.excluded && data.excluded.length > 0 ? data.excluded : regionalPackageDetails['meghalaya-1'].exclusions,
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
          setPkgData(regionalPackageDetails['meghalaya-1']);
          document.title = `Meghalaya Highlights | Travmitraa`;
        }
      } catch (err) {
        console.error('Fetching package failed, using default details:', err);
        setPkgData(regionalPackageDetails['meghalaya-1']);
        document.title = `Meghalaya Highlights | Travmitraa`;
      } finally {
        setLoading(false);
      }
    };

    fetchPackage();
  }, [id]);

  if (loading) {
    return <Spinner fullPage={true} />;
  }

  const data = pkgData || regionalPackageDetails['meghalaya-1'];

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
