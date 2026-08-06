import React, { useState, useEffect } from 'react';
import Button from '../components/Button';
import { useToast } from '../context/ToastContext';
import { submitInquiry } from '../services/api';

const Contact = () => {
  const { showToast } = useToast();
  const [formData, setFormData] = useState({
    name: '',
    phone: '',
    email: '',
    interest: '',
    travelers: '2',
    message: ''
  });
  const [loading, setLoading] = useState(false);
  const [errors, setErrors] = useState({});

  useEffect(() => {
    document.title = 'Contact Us – Travmitraa | North East India Travel';
    const metaDesc = document.querySelector('meta[name="description"]');
    if (metaDesc) {
      metaDesc.setAttribute(
        'content',
        'Tell us where you want to go. We’ll help you shape a North East trip that fits your pace and budget.'
      );
    }
  }, []);

  const handleChange = (e) => {
    setFormData({
      ...formData,
      [e.target.name]: e.target.value
    });
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
      tempErrors.phone = 'Phone / WhatsApp is required';
    } else if (!/^\+?[0-9\s-]{8,15}$/.test(formData.phone.replace(/\s/g, ''))) {
      tempErrors.phone = 'Phone number format is invalid';
    }

    setErrors(tempErrors);
    return Object.keys(tempErrors).length === 0;
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    if (!validate()) {
      showToast('Please fix the highlighted errors before submitting', 'error');
      return;
    }

    setLoading(true);
    try {
      const fullMessage = `Interested in: ${formData.interest || 'Not specified'}\nNumber of travellers: ${formData.travelers}\nDetails: ${formData.message}`;
      await submitInquiry({
        name: formData.name,
        email: formData.email,
        phone: formData.phone,
        message: fullMessage
      });
      showToast('Thank you! We will get back to you soon.', 'success');
      setFormData({
        name: '',
        phone: '',
        email: '',
        interest: '',
        travelers: '2',
        message: ''
      });
    } catch (err) {
      console.error(err);
      showToast(err.response?.data?.message || 'Failed to send message. Please try again.', 'error');
    } finally {
      setLoading(false);
    }
  };

  return (
    <div>
      {/* Page Hero */}
      <section className="page-hero">
        <div className="container">
          <h1>Contact us</h1>
          <p>
            Tell us where you want to go. We’ll help you shape a North East trip that fits your pace and budget.
          </p>
        </div>
      </section>

      {/* Contact Section */}
      <section className="contact-section">
        <div className="container">
          <div className="contact-grid">
            {/* Left Column: Info Cards & Quick Actions */}
            <div className="contact-info">
              <div className="info-card">
                <div className="info-icon">
                  <svg xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth="1.8">
                    <path strokeLinecap="round" strokeLinejoin="round" d="M3 5a2 2 0 012-2h3.28a1 1 0 01.948.684l1.498 4.493a1 1 0 01-.502 1.21l-2.257 1.13a11.042 11.042 0 005.516 5.516l1.13-2.257a1 1 0 011.21-.502l4.493 1.498a1 1 0 01.684.949V19a2 2 0 01-2 2h-1C9.716 21 3 14.284 3 6V5z" />
                  </svg>
                </div>
                <h3>Call or WhatsApp</h3>
                <p><a href="tel:+919876543210">+91 98765 43210</a></p>
                <p style={{ marginTop: '0.25rem' }}>Mon–Sat, 9:30 AM – 7:00 PM IST</p>
              </div>

              <div className="info-card">
                <div className="info-icon">
                  <svg xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth="1.8">
                    <path strokeLinecap="round" strokeLinejoin="round" d="M3 8l7.89 5.26a2 2 0 002.22 0L21 8M5 19h14a2 2 0 002-2V7a2 2 0 00-2-2H5a2 2 0 00-2 2v10a2 2 0 002 2z" />
                  </svg>
                </div>
                <h3>Email</h3>
                <p><a href="mailto:hello@travmitraa.com">hello@travmitraa.com</a></p>
                <p style={{ marginTop: '0.25rem' }}>We usually reply within a few hours.</p>
              </div>

              <div className="info-card">
                <div className="info-icon">
                  <svg xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth="1.8">
                    <path strokeLinecap="round" strokeLinejoin="round" d="M17.657 16.657L13.414 20.9a1.998 1.998 0 01-2.827 0l-4.244-4.243a8 8 0 1111.314 0z" />
                    <path strokeLinecap="round" strokeLinejoin="round" d="M15 11a3 3 0 11-6 0 3 3 0 016 0z" />
                  </svg>
                </div>
                <h3>Based in</h3>
                <p>Guwahati, Assam<br />North East India</p>
              </div>

              <div className="quick-actions">
                <a href="https://wa.me/919876543210" target="_blank" rel="noopener noreferrer" className="btn btn-whatsapp">
                  Chat on WhatsApp
                </a>
                <a href="tel:+919876543210" className="btn btn-primary">
                  Call now
                </a>
              </div>
            </div>

            {/* Right Column: Form Wrap */}
            <div className="contact-form-wrap" id="form">
              <h2>Send us a message</h2>
              <p>Share a few details and we’ll get back with ideas for your trip.</p>

              <form onSubmit={handleSubmit}>
                <div className="form-row">
                  <div className="form-group">
                    <label htmlFor="name">Your name</label>
                    <input
                      type="text"
                      id="name"
                      name="name"
                      placeholder="Full name"
                      value={formData.name}
                      onChange={handleChange}
                    />
                    {errors.name && <span style={{ color: 'var(--coral)', fontSize: '0.8rem' }}>{errors.name}</span>}
                  </div>
                  <div className="form-group">
                    <label htmlFor="phone">Phone / WhatsApp</label>
                    <input
                      type="tel"
                      id="phone"
                      name="phone"
                      placeholder="+91 XXXXX XXXXX"
                      value={formData.phone}
                      onChange={handleChange}
                    />
                    {errors.phone && <span style={{ color: 'var(--coral)', fontSize: '0.8rem' }}>{errors.phone}</span>}
                  </div>
                </div>

                <div className="form-group">
                  <label htmlFor="email">Email</label>
                  <input
                    type="email"
                    id="email"
                    name="email"
                    placeholder="you@example.com"
                    value={formData.email}
                    onChange={handleChange}
                  />
                  {errors.email && <span style={{ color: 'var(--coral)', fontSize: '0.8rem' }}>{errors.email}</span>}
                </div>

                <div className="form-row">
                  <div className="form-group">
                    <label htmlFor="interest">Interested in</label>
                    <select
                      id="interest"
                      name="interest"
                      value={formData.interest}
                      onChange={handleChange}
                    >
                      <option value="">Select an option</option>
                      <option value="meghalaya">Meghalaya</option>
                      <option value="kaziranga">Kaziranga</option>
                      <option value="tawang">Tawang / Arunachal</option>
                      <option value="custom">Custom itinerary</option>
                      <option value="group">Group / fixed departure</option>
                      <option value="other">Something else</option>
                    </select>
                  </div>
                  <div className="form-group">
                    <label htmlFor="travelers">Number of travellers</label>
                    <select
                      id="travelers"
                      name="travelers"
                      value={formData.travelers}
                      onChange={handleChange}
                    >
                      <option value="1">1</option>
                      <option value="2">2</option>
                      <option value="3-4">3–4</option>
                      <option value="5+">5 or more</option>
                    </select>
                  </div>
                </div>

                <div className="form-group">
                  <label htmlFor="message">Tell us more</label>
                  <textarea
                    id="message"
                    name="message"
                    placeholder="Dates, places you want to visit, pace, budget range, or any special requests..."
                    value={formData.message}
                    onChange={handleChange}
                  ></textarea>
                </div>

                <Button
                  type="submit"
                  variant="primary"
                  style={{ width: '100%', justifyContent: 'center', padding: '0.9rem 1.5rem' }}
                  disabled={loading}
                >
                  {loading ? 'Sending message...' : 'Send message'}
                </Button>
                <p className="form-note">
                  By sending this form you agree to be contacted about your enquiry. We don’t share your details.
                </p>
              </form>
            </div>
          </div>
        </div>
      </section>
    </div>
  );
};

export default Contact;
