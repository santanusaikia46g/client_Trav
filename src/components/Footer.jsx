import React, { useState } from 'react';
import { Link } from 'react-router-dom';
import Logo from './Logo';
import { useToast } from '../context/ToastContext';

const Footer = () => {
  const currentYear = new Date().getFullYear();
  const [email, setEmail] = useState('');
  const { showToast } = useToast();

  const handleNewsletterSubmit = (e) => {
    e.preventDefault();
    if (!email || !/\S+@\S+\.\S+/.test(email)) {
      showToast('Please enter a valid email address', 'error');
      return;
    }
    showToast('Thanks for subscribing to Travmitraa updates!', 'success');
    setEmail('');
  };

  return (
    <footer id="contact">
      <div className="container">
        {/* Newsletter Banner */}
        <div className="footer-newsletter">
          <div className="footer-newsletter-text">
            <h3>Get trip ideas & seasonal offers</h3>
            <p>Occasional emails on North East routes, best seasons and new experiences.</p>
          </div>
          <form className="footer-newsletter-form" onSubmit={handleNewsletterSubmit}>
            <input
              type="email"
              placeholder="Your email address"
              required
              aria-label="Email for newsletter"
              value={email}
              onChange={(e) => setEmail(e.target.value)}
            />
            <button type="submit" className="btn btn-primary">
              Subscribe
            </button>
          </form>
        </div>

        {/* Footer Grid */}
        <div className="footer-grid">
          <div className="footer-brand">
            <Link to="/" className="logo">
              <Logo />
            </Link>
            <p>
              Your companion for North East India. Thoughtful itineraries across Assam, Meghalaya, Arunachal, Sikkim and beyond.
            </p>
            <p className="footer-trust">Local expertise · Permit support · On-trip help</p>
            
            <ul className="footer-contact">
              <li><a href="tel:+919876543210">+91 98765 43210</a></li>
              <li><a href="mailto:hello@travmitraa.com">hello@travmitraa.com</a></li>
              <li><a href="https://wa.me/919876543210" target="_blank" rel="noopener noreferrer">WhatsApp us</a></li>
            </ul>

            <div className="footer-social">
              <a href="https://instagram.com" target="_blank" rel="noopener noreferrer" aria-label="Instagram">
                <svg xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth="1.8">
                  <rect x="3" y="3" width="18" height="18" rx="5"/>
                  <circle cx="12" cy="12" r="4"/>
                  <circle cx="17.5" cy="6.5" r="0.8" fill="currentColor"/>
                </svg>
              </a>
              <a href="https://facebook.com" target="_blank" rel="noopener noreferrer" aria-label="Facebook">
                <svg xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth="1.8">
                  <path d="M18 2h-3a5 5 0 00-5 5v3H7v4h3v8h4v-8h3l1-4h-4V7a1 1 0 011-1h3z"/>
                </svg>
              </a>
              <a href="https://youtube.com" target="_blank" rel="noopener noreferrer" aria-label="YouTube">
                <svg xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth="1.8">
                  <path d="M22.5 6.5a3 3 0 00-2.1-2.1C18.7 4 12 4 12 4s-6.7 0-8.4.4A3 3 0 001.5 6.5 31 31 0 001 12a31 31 0 00.5 5.5 3 3 0 002.1 2.1c1.7.4 8.4.4 8.4.4s6.7 0 8.4-.4a3 3 0 002.1-2.1A31 31 0 0023 12a31 31 0 00-.5-5.5z"/>
                  <path d="M10 15.5v-7l6 3.5-6 3.5z" fill="currentColor" stroke="none"/>
                </svg>
              </a>
            </div>
          </div>

          <div className="footer-col">
            <h4>Explore</h4>
            <ul>
              <li><Link to="/">Home</Link></li>
              <li><Link to="/services">Services</Link></li>
              <li><Link to="/about">About</Link></li>
              <li><Link to="/contact">Contact</Link></li>
            </ul>
          </div>

          <div className="footer-col">
            <h4>Company</h4>
            <ul>
              <li><Link to="/about">About us</Link></li>
              <li><Link to="/about">Travel tips</Link></li>
              <li><Link to="/about">Permits guide</Link></li>
              <li><Link to="/contact">FAQs</Link></li>
            </ul>
          </div>

          <div className="footer-col">
            <h4>Support</h4>
            <ul>
              <li><Link to="/contact">Contact</Link></li>
              <li><Link to="/services">Best time to visit</Link></li>
              <li><Link to="/contact">Cancellation policy</Link></li>
              <li><Link to="/contact">Privacy policy</Link></li>
            </ul>
          </div>
        </div>

        {/* Footer Bottom */}
        <div className="footer-bottom">
          <span>© {currentYear} Travmitraa. All rights reserved.</span>
          <div className="footer-bottom-links">
            <Link to="/contact">Privacy</Link>
            <Link to="/contact">Terms</Link>
            <Link to="/contact">Cookies</Link>
          </div>
        </div>
      </div>
    </footer>
  );
};

export default Footer;
