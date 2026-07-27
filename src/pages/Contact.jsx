import React, { useState, useEffect } from 'react';
import Button from '../components/Button';
import { useToast } from '../context/ToastContext';
import { submitInquiry } from '../services/api';

const Contact = () => {
  const { showToast } = useToast();
  const [formData, setFormData] = useState({
    name: '',
    email: '',
    phone: '',
    message: ''
  });
  const [loading, setLoading] = useState(false);
  const [errors, setErrors] = useState({});

  useEffect(() => {
    document.title = 'Contact Us | Travmitra';
    const metaDesc = document.querySelector('meta[name="description"]');
    if (metaDesc) {
      metaDesc.setAttribute('content', 'Get in touch with Travmitra. Send us an inquiry for custom tour planning, booking support, or feedback.');
    }
  }, []);

  const handleChange = (e) => {
    setFormData({
      ...formData,
      [e.target.name]: e.target.value
    });
    // Clear validation error when typing
    if (errors[e.target.name]) {
      setErrors({
        ...errors,
        [e.target.name]: ''
      });
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
      tempErrors.phone = 'Phone number format is invalid (min 10 digits)';
    }
    
    if (!formData.message.trim()) tempErrors.message = 'Message is required';

    setErrors(tempErrors);
    return Object.keys(tempErrors).length === 0;
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    if (!validate()) {
      showToast('Please fix the errors before submitting', 'error');
      return;
    }

    setLoading(true);
    try {
      await submitInquiry({
        name: formData.name,
        email: formData.email,
        phone: formData.phone,
        message: formData.message
      });
      showToast('Inquiry submitted successfully! We will contact you soon.', 'success');
      setFormData({ name: '', email: '', phone: '', message: '' });
    } catch (err) {
      console.error(err);
      showToast(err.response?.data?.message || 'Failed to submit inquiry. Please try again.', 'error');
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="container section">
      <h1 className="section-title text-center">Contact Us</h1>
      <p className="section-subtitle text-center">
        Have questions? Need a custom tour itinerary? Get in touch with our experts.
      </p>

      <div className="contact-grid">
        {/* Info Column */}
        <div className="contact-info-cards">
          <div className="contact-info-card">
            <div className="contact-info-icon">
              <svg width="20" height="20" fill="none" stroke="currentColor" strokeWidth="2.5" viewBox="0 0 24 24">
                <path d="M22 16.92v3a2 2 0 0 1-2.18 2 19.79 19.79 0 0 1-8.63-3.07 19.5 19.5 0 0 1-6-6 19.79 19.79 0 0 1-3.07-8.67A2 2 0 0 1 4.11 2h3a2 2 0 0 1 2 1.72 12.84 12.84 0 0 0 .7 2.81 2 2 0 0 1-.45 2.11L8.09 9.91a16 16 0 0 0 6 6l1.27-1.27a2 2 0 0 1 2.11-.45 12.84 12.84 0 0 0 2.81.7A2 2 0 0 1 22 16.92z"/>
              </svg>
            </div>
            <div>
              <h4>Call Support</h4>
              <p>+91 98765 43210</p>
              <p>Mon - Sat, 9:00 AM - 7:00 PM</p>
            </div>
          </div>

          <div className="contact-info-card">
            <div className="contact-info-icon">
              <svg width="20" height="20" fill="none" stroke="currentColor" strokeWidth="2.5" viewBox="0 0 24 24">
                <path d="M4 4h16c1.1 0 2 .9 2 2v12c0 1.1-.9 2-2 2H4c-1.1 0-2-.9-2-2V6c0-1.1.9-2 2-2z"/>
                <polyline points="22,6 12,13 2,6"/>
              </svg>
            </div>
            <div>
              <h4>Email Support</h4>
              <p>support@travmitra.com</p>
              <p>queries@travmitra.com</p>
            </div>
          </div>

          <div className="contact-info-card">
            <div className="contact-info-icon">
              <svg width="20" height="20" fill="none" stroke="currentColor" strokeWidth="2.5" viewBox="0 0 24 24">
                <path d="M12 2C8.13 2 5 5.13 5 9c0 5.25 7 13 7 13s7-7.75 7-13c0-3.87-3.13-7-7-7z"/>
                <circle cx="12" cy="9" r="2"/>
              </svg>
            </div>
            <div>
              <h4>Our Location</h4>
              <p>Sector V, Salt Lake City</p>
              <p>Kolkata, West Bengal, 700091</p>
            </div>
          </div>

          <a
            href="https://wa.me/919876543210?text=Hi!%20I%20am%20interested%20in%20travel%20packages%20with%20Travmitra."
            target="_blank"
            rel="noopener noreferrer"
            className="btn btn-secondary"
            style={{ width: '100%', marginTop: '10px' }}
          >
            <svg width="20" height="20" fill="currentColor" viewBox="0 0 24 24" style={{ marginRight: '8px' }}>
              <path d="M.057 24l1.687-6.163c-1.041-1.804-1.588-3.849-1.587-5.946C.06 5.348 5.397.01 12.008.01c3.202.001 6.212 1.246 8.477 3.513 2.266 2.268 3.507 5.28 3.505 8.484-.004 6.657-5.34 11.997-11.953 11.997-2.005-.001-3.973-.502-5.724-1.455L0 24zm6.59-4.846c1.6.95 3.188 1.449 4.825 1.451 5.436 0 9.86-4.42 9.864-9.864.002-2.637-1.03-5.114-2.903-6.989-1.873-1.873-4.351-2.903-6.993-2.904-5.438 0-9.863 4.42-9.867 9.863-.001 1.773.5 3.498 1.45 5.066l-.95 3.473 3.573-.936zm11.26-7.182c-.3-.15-1.774-.875-2.046-.975-.27-.1-.47-.15-.67.15-.2.3-.77.975-.94 1.17-.18.2-.35.225-.65.075-.3-.15-1.26-.464-2.397-1.48-1.127-1.006-1.89-2.247-2.112-2.624-.224-.38-.023-.585.127-.735.135-.135.3-.35.45-.525.15-.175.2-.3.3-.5.1-.2.05-.375-.025-.525-.075-.15-.67-1.625-.92-2.225-.24-.58-.51-.5-.67-.508-.15-.008-.32-.01-.5-.01-.18 0-.47.067-.72.337-.25.27-1.02.996-1.02 2.43 0 1.437 1.04 2.822 1.18 3.023.14.2 2.05 3.13 4.97 4.39.69.3 1.23.48 1.65.61.7.22 1.33.19 1.84.11.56-.08 1.77-.725 2.02-1.39.25-.66.25-1.22.17-1.34-.08-.12-.3-.22-.6-.37z"/>
            </svg>
            Chat on WhatsApp
          </a>
        </div>

        {/* Form Column */}
        <div className="contact-form-wrap">
          <form onSubmit={handleSubmit}>
            <div className="form-group">
              <label htmlFor="name">Full Name *</label>
              <input
                type="text"
                id="name"
                name="name"
                className="form-control"
                value={formData.name}
                onChange={handleChange}
                placeholder="Enter your full name"
              />
              {errors.name && <span style={{ color: 'var(--danger)', fontSize: '0.75rem' }}>{errors.name}</span>}
            </div>

            <div className="form-group">
              <label htmlFor="email">Email Address *</label>
              <input
                type="email"
                id="email"
                name="email"
                className="form-control"
                value={formData.email}
                onChange={handleChange}
                placeholder="Enter your email address"
              />
              {errors.email && <span style={{ color: 'var(--danger)', fontSize: '0.75rem' }}>{errors.email}</span>}
            </div>

            <div className="form-group">
              <label htmlFor="phone">Phone Number *</label>
              <input
                type="tel"
                id="phone"
                name="phone"
                className="form-control"
                value={formData.phone}
                onChange={handleChange}
                placeholder="Enter your 10-digit mobile number"
              />
              {errors.phone && <span style={{ color: 'var(--danger)', fontSize: '0.75rem' }}>{errors.phone}</span>}
            </div>

            <div className="form-group">
              <label htmlFor="message">Your Message *</label>
              <textarea
                id="message"
                name="message"
                className="form-control"
                value={formData.message}
                onChange={handleChange}
                placeholder="How can we help you? Describe your travel plan..."
              ></textarea>
              {errors.message && <span style={{ color: 'var(--danger)', fontSize: '0.75rem' }}>{errors.message}</span>}
            </div>

            <Button type="submit" variant="primary" style={{ width: '100%', marginTop: '10px' }} disabled={loading}>
              {loading ? 'Submitting...' : 'Submit Inquiry'}
            </Button>
          </form>
        </div>
      </div>

      {/* Map Placeholder */}
      <h2 style={{ fontSize: '1.5rem', fontWeight: '700', marginBottom: '20px' }}>Find Us On The Map</h2>
      <div className="map-placeholder">
        <svg fill="none" stroke="currentColor" strokeWidth="1.5" viewBox="0 0 24 24">
          <path strokeLinecap="round" strokeLinejoin="round" d="M9 6.75V15m6-12v8.25m-3.75 3h.008v.008h-.008v-.008zm.375 0a.375.375 0 11-.75 0 .375.375 0 01.75 0zM19.5 21V5.25A2.25 2.25 0 0017.25 3H6.75A2.25 2.25 0 004.5 5.25V21m15 0h-15M12 18.75h.008v.008H12v-.008z" />
        </svg>
        <span style={{ fontWeight: '600', fontSize: '1.1rem' }}>Google Maps Location</span>
        <span style={{ fontSize: '0.85rem', color: 'var(--medium)', marginTop: '4px' }}>
          Travmitra Head Office, Sector V, Salt Lake, Kolkata
        </span>
        
        {/* Subtle decorative grid background for the map placeholder */}
        <div style={{
          position: 'absolute',
          top: 0,
          left: 0,
          right: 0,
          bottom: 0,
          opacity: 0.1,
          backgroundImage: 'radial-gradient(var(--primary) 1px, transparent 1px)',
          backgroundSize: '20px 20px',
          pointerEvents: 'none'
        }}></div>
      </div>
    </div>
  );
};

export default Contact;
