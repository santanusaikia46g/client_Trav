import React, { useState, useEffect, useRef } from 'react';
import { Link, useNavigate } from 'react-router-dom';
import Button from './Button';

const HERO_SLIDES = [
  {
    id: 1,
    url: 'https://images.unsplash.com/photo-1602020234671-15fd6180428d?q=80&w=1332&auto=format&fit=crop&ixlib=rb-4.1.0&ixid=M3wxMjA3fDB8MHxwaG90by1wYWdlfHx8fGVufDB8fHx8fA%3D%3D',
    badge: '🏔️ High Altitude Wonders',
    title: 'Explore Majestic Himalayan Heights',
    subtitle: 'Ascend into snow-capped peaks, alpine valleys, and breathtaking serenity across Himachal & Ladakh.',
    location: 'Manali & Ladakh, India',
    category: 'Adventure',
    startingPrice: '₹14,999',
    destinationQuery: 'Manali'
  },
  {
    id: 2,
    url: 'https://images.unsplash.com/photo-1613725194245-d8e21cf5d42e?q=80&w=764&auto=format&fit=crop&ixlib=rb-4.1.0&ixid=M3wxMjA3fDB8MHxwaG90by1wYWdlfHx8fGVufDB8fHx8fA%3D%3D',
    badge: '🌴 Tranquil Backwaters',
    title: 'Sail The Emerald Waters Of Kerala',
    subtitle: 'Unwind in luxury houseboats amidst pristine palm-fringed channels, lush tea gardens, and calm lagoons.',
    location: 'Alleppey & Munnar, Kerala',
    category: 'Deluxe',
    startingPrice: '₹12,499',
    destinationQuery: 'Kerala'
  },
  {
    id: 3,
    url: 'https://images.unsplash.com/photo-1659267695704-842a53942bcd?q=80&w=1073&auto=format&fit=crop&ixlib=rb-4.1.0&ixid=M3wxMjA3fDB8MHxwaG90by1wYWdlfHx8fGVufDB8fHx8fA%3D%3D',
    badge: '🏰 Royal Heritage',
    title: 'Discover Golden Dunes & Royal Forts',
    subtitle: 'Immerse yourself in imperial palaces, vibrant bazaars, and starry desert nights under Rajasthan skies.',
    location: 'Jaipur & Jaisalmer, Rajasthan',
    category: 'Luxury',
    startingPrice: '₹16,800',
    destinationQuery: 'Rajasthan'
  },
  {
    id: 4,
    url: 'https://images.unsplash.com/photo-1621789547000-b74d615ce6c5?q=80&w=1334&auto=format&fit=crop&ixlib=rb-4.1.0&ixid=M3wxMjA3fDB8MHxwaG90by1wYWdlfHx8fGVufDB8fHx8fA%3D%3D',
    badge: '🌊 Coastal Paradise',
    title: 'Sun-Kissed Golden Ocean Escapes',
    subtitle: 'Experience vibrant beach parties, portuguese heritage architecture, and serene sunset cruises in Goa.',
    location: 'North & South Goa',
    category: 'Standard',
    startingPrice: '₹9,999',
    destinationQuery: 'Goa'
  },
  {
    id: 5,
    url: 'https://images.unsplash.com/photo-1686472886489-1d2d7e08ff9c?q=80&w=687&auto=format&fit=crop&ixlib=rb-4.1.0&ixid=M3wxMjA3fDB8MHxwaG90by1wYWdlfHx8fGVufDB8fHx8fA%3D%3D',
    badge: '☕ Misty Mountain Sanctuaries',
    title: 'Journey Through Misty Tea Estates',
    subtitle: 'Witness panoramic Kanchenjunga sunrises, vintage toy trains, and serene Buddhist monasteries.',
    location: 'Darjeeling & Sikkim',
    category: 'Deluxe',
    startingPrice: '₹13,500',
    destinationQuery: 'Darjeeling'
  },
  {
    id: 6,
    url: 'https://images.unsplash.com/photo-1625654325562-762dcec9e6f2?q=80&w=1074&auto=format&fit=crop&ixlib=rb-4.1.0&ixid=M3wxMjA3fDB8MHxwaG90by1wYWdlfHx8fGVufDB8fHx8fA%3D%3D',
    badge: '🏝️ Tropical Island Bay',
    title: 'Dive Into Crystal Turquoise Waters',
    subtitle: 'Snorkel vibrant coral reefs, walk glowing white sand beaches, and explore exotic island horizons.',
    location: 'Andaman & Nicobar Islands',
    category: 'Luxury',
    startingPrice: '₹22,999',
    destinationQuery: 'Andaman'
  },
  {
    id: 7,
    url: 'https://images.unsplash.com/photo-1521437620269-f477f5437820?q=80&w=1073&auto=format&fit=crop&ixlib=rb-4.1.0&ixid=M3wxMjA3fDB8MHxwaG90by1wYWdlfHx8fGVufDB8fHx8fA%3D%3D',
    badge: '🛕 Timeless Cultural Legacy',
    title: 'Experience Spiritual & Heritage Wonders',
    subtitle: 'Marvel at giant boulder landscapes of Hampi and soul-stirring Ganga Aarti rituals on sacred ghats.',
    location: 'Varanasi & Hampi Heritage',
    category: 'Standard',
    startingPrice: '₹11,200',
    destinationQuery: 'Varanasi'
  }
];

const HeroScroll = () => {
  const [currentIndex, setCurrentIndex] = useState(0);
  const [isPlaying, setIsPlaying] = useState(true);
  const [searchDestination, setSearchDestination] = useState('');
  const [searchCategory, setSearchCategory] = useState('');
  const thumbnailTrackRef = useRef(null);
  const timerRef = useRef(null);
  const navigate = useNavigate();

  const activeSlide = HERO_SLIDES[currentIndex];

  // Auto-play mechanism
  useEffect(() => {
    if (isPlaying) {
      timerRef.current = setInterval(() => {
        setCurrentIndex((prev) => (prev + 1) % HERO_SLIDES.length);
      }, 5500);
    }
    return () => {
      if (timerRef.current) clearInterval(timerRef.current);
    };
  }, [isPlaying]);

  // Scroll active thumbnail card into view
  useEffect(() => {
    if (thumbnailTrackRef.current) {
      const activeElement = thumbnailTrackRef.current.children[currentIndex];
      if (activeElement) {
        activeElement.scrollIntoView({
          behavior: 'smooth',
          block: 'nearest',
          inline: 'center'
        });
      }
    }
  }, [currentIndex]);

  const handleNext = () => {
    setCurrentIndex((prev) => (prev + 1) % HERO_SLIDES.length);
  };

  const handlePrev = () => {
    setCurrentIndex((prev) => (prev - 1 + HERO_SLIDES.length) % HERO_SLIDES.length);
  };

  const scrollTrack = (direction) => {
    if (thumbnailTrackRef.current) {
      const scrollAmount = direction === 'left' ? -220 : 220;
      thumbnailTrackRef.current.scrollBy({ left: scrollAmount, behavior: 'smooth' });
    }
  };

  const handleSearchSubmit = (e) => {
    e.preventDefault();
    const params = new URLSearchParams();
    if (searchDestination) params.append('destination', searchDestination);
    if (searchCategory) params.append('category', searchCategory);
    navigate(`/packages?${params.toString()}`);
  };

  return (
    <section className="hero-scroll-section" onMouseEnter={() => setIsPlaying(false)} onMouseLeave={() => setIsPlaying(true)}>
      {/* Background Image Slides with Ken Burns zoom & smooth opacity transitions */}
      {HERO_SLIDES.map((slide, idx) => (
        <div
          key={slide.id}
          className={`hero-bg-slide ${idx === currentIndex ? 'active' : ''}`}
          style={{ backgroundImage: `url('${slide.url}')` }}
        />
      ))}

      {/* Hero Dark & Gradient Overlay for Contrast */}
      <div className="hero-overlay" />

      <div className="container hero-content-container">
        {/* Main Hero Text Content */}
        <div className="hero-text-block">
          <div className="hero-badge animate-fade-in" key={`badge-${activeSlide.id}`}>
            <span>{activeSlide.badge}</span>
            <span className="hero-price-pill">From {activeSlide.startingPrice}</span>
          </div>

          <h1 className="hero-title animate-slide-up" key={`title-${activeSlide.id}`}>
            {activeSlide.title}
          </h1>

          <p className="hero-subtitle animate-slide-up-delay" key={`sub-${activeSlide.id}`}>
            {activeSlide.subtitle}
          </p>

          <div className="hero-action-buttons">
            <Link to={`/packages?destination=${encodeURIComponent(activeSlide.destinationQuery)}`}>
              <Button variant="primary" className="hero-cta-btn">
                <span>Explore Packages</span>
                <svg width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.5">
                  <path d="M5 12h14M12 5l7 7-7 7" />
                </svg>
              </Button>
            </Link>

            <Link to="/destinations">
              <Button variant="outline" className="hero-cta-secondary">
                <span>Discover All Regions</span>
              </Button>
            </Link>
          </div>

          {/* Quick Search Widget */}
          <form className="hero-search-box" onSubmit={handleSearchSubmit}>
            <div className="search-field">
              <label>
                <svg width="16" height="16" fill="none" stroke="currentColor" strokeWidth="2" viewBox="0 0 24 24">
                  <path d="M12 2C8.13 2 5 5.13 5 9c0 5.25 7 13 7 13s7-7.75 7-13c0-3.87-3.13-7-7-7z"/>
                  <circle cx="12" cy="9" r="2"/>
                </svg>
                Destination
              </label>
              <input
                type="text"
                placeholder="Where to next? (e.g. Goa, Kerala...)"
                value={searchDestination}
                onChange={(e) => setSearchDestination(e.target.value)}
              />
            </div>

            <div className="search-divider" />

            <div className="search-field">
              <label>
                <svg width="16" height="16" fill="none" stroke="currentColor" strokeWidth="2" viewBox="0 0 24 24">
                  <path d="M19 11H5m14 0a2 2 0 012 2v6a2 2 0 01-2 2H5a2 2 0 01-2-2v-6a2 2 0 012-2m14 0V9a2 2 0 00-2-2M5 11V9a2 2 0 012-2m0 0V5a2 2 0 012-2h6a2 2 0 012 2v2M7 7h10" />
                </svg>
                Category
              </label>
              <select
                value={searchCategory}
                onChange={(e) => setSearchCategory(e.target.value)}
              >
                <option value="">All Categories</option>
                <option value="Standard">Standard</option>
                <option value="Deluxe">Deluxe</option>
                <option value="Luxury">Luxury</option>
              </select>
            </div>

            <button type="submit" className="search-submit-btn" aria-label="Search">
              <svg width="18" height="18" fill="none" stroke="currentColor" strokeWidth="2.5" viewBox="0 0 24 24">
                <circle cx="11" cy="11" r="8"/>
                <line x1="21" y1="21" x2="16.65" y2="16.65"/>
              </svg>
              <span>Search</span>
            </button>
          </form>
        </div>

        {/* Hero Slide Controls Bar */}
        <div className="hero-controls-bar">
          <div className="slide-counter">
            <span className="current-num">0{currentIndex + 1}</span>
            <span className="divider-line">/</span>
            <span className="total-num">0{HERO_SLIDES.length}</span>
          </div>

          <div className="slide-nav-btns">
            <button className="nav-arrow-btn" onClick={handlePrev} aria-label="Previous Slide">
              <svg width="18" height="18" fill="none" stroke="currentColor" strokeWidth="2.5" viewBox="0 0 24 24">
                <path d="M15 19l-7-7 7-7" />
              </svg>
            </button>
            
            <button className="nav-arrow-btn" onClick={handleNext} aria-label="Next Slide">
              <svg width="18" height="18" fill="none" stroke="currentColor" strokeWidth="2.5" viewBox="0 0 24 24">
                <path d="M9 5l7 7-7 7" />
              </svg>
            </button>

            <button
              className={`play-pause-btn ${isPlaying ? 'playing' : ''}`}
              onClick={() => setIsPlaying(!isPlaying)}
              title={isPlaying ? 'Pause Auto Scroll' : 'Play Auto Scroll'}
              aria-label="Toggle Auto Scroll"
            >
              {isPlaying ? (
                <svg width="16" height="16" fill="currentColor" viewBox="0 0 24 24">
                  <rect x="6" y="4" width="4" height="16" rx="1" />
                  <rect x="14" y="4" width="4" height="16" rx="1" />
                </svg>
              ) : (
                <svg width="16" height="16" fill="currentColor" viewBox="0 0 24 24">
                  <path d="M8 5v14l11-7z" />
                </svg>
              )}
            </button>
          </div>
        </div>

        {/* Aesthetic Horizontal Hero Scroll Filmstrip / Gallery Strip */}
        <div className="hero-gallery-strip-container">
          <div className="strip-header">
            <div className="strip-title-tag">
              <span className="pulse-dot" />
              <span>FEATURED HORIZONS ({HERO_SLIDES.length} DESTINATIONS)</span>
            </div>
            
            <div className="strip-scroll-controls">
              <button onClick={() => scrollTrack('left')} aria-label="Scroll Strip Left">
                <svg width="14" height="14" fill="none" stroke="currentColor" strokeWidth="2.5" viewBox="0 0 24 24">
                  <path d="M15 19l-7-7 7-7"/>
                </svg>
              </button>
              <button onClick={() => scrollTrack('right')} aria-label="Scroll Strip Right">
                <svg width="14" height="14" fill="none" stroke="currentColor" strokeWidth="2.5" viewBox="0 0 24 24">
                  <path d="M9 5l7 7-7 7"/>
                </svg>
              </button>
            </div>
          </div>

          <div className="hero-scroll-track" ref={thumbnailTrackRef}>
            {HERO_SLIDES.map((slide, idx) => {
              const isActive = idx === currentIndex;
              return (
                <div
                  key={slide.id}
                  className={`hero-thumbnail-card ${isActive ? 'active' : ''}`}
                  onClick={() => setCurrentIndex(idx)}
                >
                  <img src={slide.url} alt={slide.title} loading="lazy" />
                  <div className="card-gradient-overlay" />
                  
                  <span className="card-number">0{slide.id}</span>
                  
                  <div className="card-info">
                    <span className="card-location">{slide.location}</span>
                    <h4 className="card-title">{slide.title}</h4>
                  </div>

                  {isActive && isPlaying && (
                    <div className="active-progress-line">
                      <div className="progress-fill" key={`progress-${currentIndex}`} />
                    </div>
                  )}
                </div>
              );
            })}
          </div>
        </div>
      </div>
    </section>
  );
};

export default HeroScroll;
