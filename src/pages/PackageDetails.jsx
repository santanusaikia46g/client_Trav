import React, { useState, useEffect } from 'react';
import { useParams, Link, useNavigate } from 'react-router-dom';
import { getPackage, submitInquiry } from '../services/api';
import Spinner from '../components/Spinner';
import Button from '../components/Button';
import { useToast } from '../context/ToastContext';

const PackageDetails = () => {
  const { id } = useParams();
  const navigate = useNavigate();
  const { showToast } = useToast();

  const [pkg, setPkg] = useState(null);
  const [loading, setLoading] = useState(true);
  
  // Inquiry form states
  const [formData, setFormData] = useState({
    name: '',
    email: '',
    phone: '',
    message: ''
  });
  const [inquiryLoading, setInquiryLoading] = useState(false);
  const [errors, setErrors] = useState({});

  useEffect(() => {
    const fetchPackageDetails = async () => {
      try {
        const data = await getPackage(id);
        setPkg(data);
        document.title = `${data.title} | Travmitra`;
        
        // Update meta description
        const metaDesc = document.querySelector('meta[name="description"]');
        if (metaDesc) {
          metaDesc.setAttribute('content', `${data.title} - ${data.duration} tour package. Browse itinerary, price, details, and book your package.`);
        }
      } catch (err) {
        console.error(err);
        showToast('Package not found or server error.', 'error');
        navigate('/packages');
      } finally {
        setLoading(false);
      }
    };

    fetchPackageDetails();
  }, [id, navigate, showToast]);

  const handleChange = (e) => {
    setFormData({
      ...formData,
      [e.target.name]: e.target.value
    });
    if (errors[e.target.name]) {
      setErrors({ ...errors, [e.target.name]: '' });
    }
  };

  const validate = () => {
    let tempErrors = {};
    if (!formData.name.trim()) tempErrors.name = 'Name is required';
    if (!formData.email.trim()) {
      tempErrors.email = 'Email is required';
    } else if (!/\S+@\S+\.\S+/.test(formData.email)) {
      tempErrors.email = 'Email format is invalid';
    }
    if (!formData.phone.trim()) {
      tempErrors.phone = 'Phone number is required';
    } else if (!/^\+?[0-9\s-]{10,14}$/.test(formData.phone.replace(/\s/g, ''))) {
      tempErrors.phone = 'Phone number format is invalid';
    }
    setErrors(tempErrors);
    return Object.keys(tempErrors).length === 0;
  };

  const handleInquirySubmit = async (e) => {
    e.preventDefault();
    if (!validate()) {
      showToast('Please fix the errors before submitting', 'error');
      return;
    }

    setInquiryLoading(true);
    try {
      const payload = {
        ...formData,
        packageId: id,
        message: formData.message || `I am interested in booking the package: ${pkg.title}`
      };
      await submitInquiry(payload);
      showToast('Booking inquiry submitted successfully! We will contact you soon.', 'success');
      setFormData({ name: '', email: '', phone: '', message: '' });
    } catch (err) {
      console.error(err);
      showToast(err.response?.data?.message || 'Failed to submit booking inquiry.', 'error');
    } finally {
      setInquiryLoading(false);
    }
  };

  if (loading) {
    return <Spinner fullPage={true} />;
  }

  if (!pkg) {
    return null;
  }

  return (
    <div>
      {/* Banner Cover */}
      <section className="detail-banner">
        <img src={pkg.images[0] || 'https://images.unsplash.com/photo-1469854523086-cc02fe5d8800?auto=format&fit=crop&w=1600&q=80'} alt={pkg.title} />
        <div className="detail-banner-content">
          <div className="container">
            <h1 style={{ color: 'var(--white)' }}>{pkg.title}</h1>
            <ul className="detail-meta-list">
              <li>
                <svg width="18" height="18" fill="none" stroke="currentColor" strokeWidth="2.5" viewBox="0 0 24 24">
                  <path d="M12 2C8.13 2 5 5.13 5 9c0 5.25 7 13 7 13s7-7.75 7-13c0-3.87-3.13-7-7-7z"/>
                  <circle cx="12" cy="9" r="2"/>
                </svg>
                {pkg.destination}
              </li>
              <li>
                <svg width="18" height="18" fill="none" stroke="currentColor" strokeWidth="2.5" viewBox="0 0 24 24">
                  <path d="M12 8v4l3 3m6-3a9 9 0 11-18 0 9 9 0 0118 0z"/>
                </svg>
                {pkg.duration}
              </li>
              <li>
                <span className={`badge-category badge-category-${(pkg.category || 'Standard').toLowerCase()}`}>
                  {pkg.category || 'Standard'}
                </span>
              </li>
            </ul>
          </div>
        </div>
      </section>

      {/* Main Details & Inquiry Form Grid */}
      <section className="container section">
        <div className="detail-grid">
          {/* Main Info Columns */}
          <div>
            {/* Overview / Description */}
            <div className="detail-block">
              <h2 className="detail-section-title">Tour Overview</h2>
              <p style={{ color: 'var(--medium)', fontSize: '1rem', whiteSpace: 'pre-line' }}>
                {pkg.description}
              </p>
            </div>

            {/* Tour Highlights */}
            <div className="detail-block">
              <h2 className="detail-section-title">Tour Highlights</h2>
              <ul className="checklist checklist-inc" style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: '10px' }}>
                <li>Explore top scenic landmarks</li>
                <li>Hassle-free transfers and pickup</li>
                <li>Experienced local driver & guide</li>
                <li>Premium hotel accommodations</li>
              </ul>
            </div>

            {/* Itinerary Accordions */}
            <div className="detail-block">
              <h2 className="detail-section-title">Day-Wise Itinerary</h2>
              {pkg.itinerary && pkg.itinerary.length > 0 ? (
                <div className="itinerary-list">
                  {pkg.itinerary.map((item) => (
                    <div key={item._id || item.day} className="itinerary-item">
                      <div className="itinerary-day-badge">DAY {item.day}</div>
                      <div className={`itinerary-item-body ${item.image ? 'has-image' : ''}`}>
                        <div className="itinerary-content">
                          <h4>{item.title}</h4>
                          <p>{item.description}</p>
                        </div>
                        {item.image && (
                          <div className="itinerary-image-wrapper">
                            <img src={item.image} alt={item.title} className="itinerary-image" />
                          </div>
                        )}
                      </div>
                    </div>
                  ))}
                </div>
              ) : (
                <p style={{ color: 'var(--medium)' }}>Itinerary details are not configured yet.</p>
              )}
            </div>

            {/* Inclusions & Exclusions */}
            <div className="detail-block">
              <h2 className="detail-section-title">Inclusions & Exclusions</h2>
              <div className="inc-exc-grid">
                <div>
                  <h3 style={{ fontSize: '1.1rem', fontWeight: 700, color: 'var(--secondary)', marginBottom: '15px' }}>What's Included</h3>
                  <ul className="checklist checklist-inc">
                    {pkg.included && pkg.included.length > 0 ? (
                      pkg.included.map((inc, index) => <li key={index}>{inc}</li>)
                    ) : (
                      <li>No inclusions listed.</li>
                    )}
                  </ul>
                </div>
                <div>
                  <h3 style={{ fontSize: '1.1rem', fontWeight: 700, color: 'var(--danger)', marginBottom: '15px' }}>What's Excluded</h3>
                  <ul className="checklist checklist-exc">
                    {pkg.excluded && pkg.excluded.length > 0 ? (
                      pkg.excluded.map((exc, index) => <li key={index}>{exc}</li>)
                    ) : (
                      <li>No exclusions listed.</li>
                    )}
                  </ul>
                </div>
              </div>
            </div>

            {/* Image Gallery */}
            {pkg.images && pkg.images.length > 0 && (
              <div className="detail-block">
                <h2 className="detail-section-title">Tour Gallery</h2>
                <div className="gallery-grid">
                  {pkg.images.map((imgUrl, index) => (
                    <div key={index} className="gallery-item">
                      <img src={imgUrl} alt={`${pkg.title} thumbnail ${index + 1}`} />
                    </div>
                  ))}
                </div>
              </div>
            )}
          </div>

          {/* Sidebar Booking Inquiry Form */}
          <div>
            <div className="inquiry-sidebar">
              <h3>Interested in this tour?</h3>
              <p style={{ color: 'var(--medium)', fontSize: '0.85rem', marginBottom: '8px' }}>Package Cost</p>
              <div className="inquiry-sidebar-price">
                ₹{pkg.price.toLocaleString('en-IN')} <span>/ person</span>
              </div>

              <form onSubmit={handleInquirySubmit}>
                <div className="form-group">
                  <label htmlFor="inq-name">Your Name *</label>
                  <input
                    type="text"
                    id="inq-name"
                    name="name"
                    className="form-control"
                    value={formData.name}
                    onChange={handleChange}
                    placeholder="Enter your name"
                  />
                  {errors.name && <span style={{ color: 'var(--danger)', fontSize: '0.75rem' }}>{errors.name}</span>}
                </div>

                <div className="form-group">
                  <label htmlFor="inq-email">Your Email *</label>
                  <input
                    type="email"
                    id="inq-email"
                    name="email"
                    className="form-control"
                    value={formData.email}
                    onChange={handleChange}
                    placeholder="Enter your email"
                  />
                  {errors.email && <span style={{ color: 'var(--danger)', fontSize: '0.75rem' }}>{errors.email}</span>}
                </div>

                <div className="form-group">
                  <label htmlFor="inq-phone">Phone Number *</label>
                  <input
                    type="tel"
                    id="inq-phone"
                    name="phone"
                    className="form-control"
                    value={formData.phone}
                    onChange={handleChange}
                    placeholder="Enter your mobile number"
                  />
                  {errors.phone && <span style={{ color: 'var(--danger)', fontSize: '0.75rem' }}>{errors.phone}</span>}
                </div>

                <div className="form-group">
                  <label htmlFor="inq-message">Additional Notes (Optional)</label>
                  <textarea
                    id="inq-message"
                    name="message"
                    className="form-control"
                    value={formData.message}
                    onChange={handleChange}
                    placeholder="e.g. Travel dates, number of people..."
                  ></textarea>
                </div>

                <Button type="submit" variant="primary" style={{ width: '100%', marginTop: '10px' }} disabled={inquiryLoading}>
                  {inquiryLoading ? 'Sending Inquiry...' : 'Submit Inquiry'}
                </Button>
              </form>
            </div>
          </div>
        </div>
      </section>
    </div>
  );
};

export default PackageDetails;
