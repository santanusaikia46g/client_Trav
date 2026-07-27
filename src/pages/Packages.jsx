import React, { useState, useEffect } from 'react';
import { useLocation, Link } from 'react-router-dom';
import { getPackages } from '../services/api';
import Card from '../components/Card';
import Button from '../components/Button';
import SkeletonCard from '../components/SkeletonCard';
import { useToast } from '../context/ToastContext';

// Hook to parse query parameters
const useQuery = () => {
  return new URLSearchParams(useLocation().search);
};

const Packages = () => {
  const queryParams = useQuery();
  const initialDestination = queryParams.get('destination') || '';
  const { showToast } = useToast();

  const [packages, setPackages] = useState([]);
  const [loading, setLoading] = useState(true);

  // Filter States
  const [search, setSearch] = useState('');
  const [destination, setDestination] = useState(initialDestination);
  const [category, setCategory] = useState('');
  const [duration, setDuration] = useState('');
  const [maxPrice, setMaxPrice] = useState(40000);

  useEffect(() => {
    document.title = 'Tour Packages | Travmitra';
    const metaDesc = document.querySelector('meta[name="description"]');
    if (metaDesc) {
      metaDesc.setAttribute('content', 'Browse through our premium domestic and international travel packages. Filter by budget, duration, category, and destination to find the perfect tour.');
    }
  }, []);

  // Fetch packages whenever filter conditions change
  useEffect(() => {
    const fetchFilteredPackages = async () => {
      setLoading(true);
      try {
        const params = {
          search: search.trim() || undefined,
          destination: destination || undefined,
          category: category || undefined,
          duration: duration || undefined,
          maxPrice: maxPrice || undefined
        };
        const data = await getPackages(params);
        setPackages(data);
      } catch (err) {
        console.error(err);
        showToast('Error loading packages. Please try again.', 'error');
      } finally {
        setLoading(false);
      }
    };

    // Debounce search typing to avoid excessive API requests
    const timeoutId = setTimeout(() => {
      fetchFilteredPackages();
    }, 300);

    return () => clearTimeout(timeoutId);
  }, [search, destination, category, duration, maxPrice, showToast]);

  const handleResetFilters = () => {
    setSearch('');
    setDestination('');
    setCategory('');
    setDuration('');
    setMaxPrice(40000);
  };

  return (
    <div className="container section">
      <h1 className="section-title text-center">Our Travel Packages</h1>
      <p className="section-subtitle text-center">
        Browse and filter our custom packages to find your ideal getaway.
      </p>

      {/* Filters Form Wrapper */}
      <div className="packages-filter-wrap">
        <div className="filters-grid" style={{ gridTemplateColumns: '2fr 1fr 1fr 1fr 1fr' }}>
          {/* Text Search */}
          <div className="filter-group">
            <label className="filter-label">Search Tours</label>
            <input
              type="text"
              placeholder="e.g. Beaches, Trekking..."
              className="filter-input"
              value={search}
              onChange={(e) => setSearch(e.target.value)}
            />
          </div>

          {/* Destination Selector */}
          <div className="filter-group">
            <label className="filter-label">Destination</label>
            <select
              className="filter-input"
              value={destination}
              onChange={(e) => setDestination(e.target.value)}
            >
              <option value="">All Destinations</option>
              <option value="Goa">Goa</option>
              <option value="Ladakh">Ladakh</option>
              <option value="Kerala">Kerala</option>
              <option value="Rajasthan">Rajasthan</option>
              <option value="Himachal">Himachal</option>
            </select>
          </div>

          {/* Category Selector */}
          <div className="filter-group">
            <label className="filter-label">Category</label>
            <select
              className="filter-input"
              value={category}
              onChange={(e) => setCategory(e.target.value)}
            >
              <option value="">All Categories</option>
              <option value="Standard">Standard</option>
              <option value="Deluxe">Deluxe</option>
              <option value="Luxury">Luxury</option>
            </select>
          </div>

          {/* Duration Selector */}
          <div className="filter-group">
            <label className="filter-label">Duration</label>
            <select
              className="filter-input"
              value={duration}
              onChange={(e) => setDuration(e.target.value)}
            >
              <option value="">Any Duration</option>
              <option value="4 Days">4 Days / 3 Nights</option>
              <option value="5 Days">5 Days / 4 Nights</option>
              <option value="6 Days">6 Days / 5 Nights</option>
            </select>
          </div>

          {/* Clear Filters Button */}
          <Button variant="outline" size="sm" onClick={handleResetFilters}>
            Reset Filters
          </Button>
        </div>

        {/* Budget Range Selector */}
        <div style={{ marginTop: '20px', borderTop: '1px solid var(--border)', paddingTop: '15px' }}>
          <div className="filter-group" style={{ maxWidth: '400px' }}>
            <div className="range-labels">
              <span className="filter-label">Max Budget: ₹{maxPrice.toLocaleString('en-IN')}</span>
            </div>
            <input
              type="range"
              min="10000"
              max="50000"
              step="2000"
              className="filter-range"
              value={maxPrice}
              onChange={(e) => setMaxPrice(Number(e.target.value))}
            />
            <div className="range-labels">
              <span>₹10,000</span>
              <span>₹50,000</span>
            </div>
          </div>
        </div>
      </div>

      {/* Package Listings Grid */}
      {loading ? (
        <div className="packages-grid">
          <SkeletonCard count={3} />
        </div>
      ) : packages.length === 0 ? (
        <div className="empty-state">
          <svg fill="none" stroke="currentColor" strokeWidth="1.5" viewBox="0 0 24 24">
            <path strokeLinecap="round" strokeLinejoin="round" d="M12 9v2m0 4h.01m-6.938 4h13.856c1.54 0 2.502-1.667 1.732-3L13.732 4c-.77-1.333-2.694-1.333-3.464 0L3.34 16c-.77 1.333.192 3 1.732 3z" />
          </svg>
          <h3>No Packages Found</h3>
          <p>We couldn't find any packages matching your search criteria. Try modifying your filters.</p>
          <Button variant="primary" onClick={handleResetFilters}>
            Clear Filters
          </Button>
        </div>
      ) : (
        <div className="packages-grid">
          {packages.map((pkg) => (
            <Card key={pkg._id} className="package-card">
              <div className="package-card-img">
                <img src={pkg.images[0] || 'https://images.unsplash.com/photo-1469854523086-cc02fe5d8800?auto=format&fit=crop&w=800&q=80'} alt={pkg.title} />
                <span className="package-card-tag">{pkg.duration}</span>
                <span className={`badge-category badge-category-${(pkg.category || 'Standard').toLowerCase()} package-card-category-badge`}>
                  {pkg.category || 'Standard'}
                </span>
              </div>
              <div className="package-card-content">
                <div className="package-card-meta">
                  <span>
                    <svg width="14" height="14" fill="none" stroke="currentColor" strokeWidth="2" viewBox="0 0 24 24" style={{ verticalAlign: 'middle' }}>
                      <path d="M12 2C8.13 2 5 5.13 5 9c0 5.25 7 13 7 13s7-7.75 7-13c0-3.87-3.13-7-7-7z"/>
                      <circle cx="12" cy="9" r="2"/>
                    </svg>
                    {pkg.destination}
                  </span>
                </div>
                <h3 className="package-card-title">{pkg.title}</h3>
                <p className="package-card-desc">{pkg.description}</p>
                <div className="package-card-footer">
                  <div className="package-card-price">
                    <span>Starting from</span> <br />
                    ₹{pkg.price.toLocaleString('en-IN')}
                  </div>
                  <Link to={`/packages/${pkg._id}`}>
                    <Button variant="primary" size="sm">View Details</Button>
                  </Link>
                </div>
              </div>
            </Card>
          ))}
        </div>
      )}
    </div>
  );
};

export default Packages;
