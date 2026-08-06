import React from 'react';
import { Link } from 'react-router-dom';
import Logo from './Logo';

const Footer = () => {
  const currentYear = new Date().getFullYear();

  return (
    <footer className="footer" id="contact" style={{ background: 'var(--slate-900)', color: '#94a3b8' }}>
      <div className="container footer-grid">
        <div className="footer-col">
          <Link to="/" style={{ marginBottom: '1rem', display: 'inline-block' }}>
            <Logo />
          </Link>
          <p style={{ fontSize: '0.95rem', lineHeight: '1.65', color: '#94a3b8', marginBottom: '1.25rem' }}>
            Your companion for North East India. Thoughtful itineraries across Assam, Meghalaya, Arunachal, Sikkim and beyond.
          </p>

          <ul className="footer-links" style={{ marginBottom: '1.25rem' }}>
            <li>
              <a href="tel:+919876543210" style={{ color: '#cbd5e1' }}>+91 98765 43210</a>
            </li>
            <li>
              <a href="mailto:hello@travmitraa.com" style={{ color: '#cbd5e1' }}>hello@travmitraa.com</a>
            </li>
            <li>
              <a href="https://wa.me/919876543210" target="_blank" rel="noopener noreferrer" style={{ color: '#cbd5e1' }}>WhatsApp us</a>
            </li>
          </ul>

          <div className="social-links">
            <a href="https://instagram.com" target="_blank" rel="noopener noreferrer" className="social-icon" aria-label="Instagram">
              <svg width="18" height="18" fill="currentColor" viewBox="0 0 24 24">
                <path d="M12 2.163c3.204 0 3.584.012 4.85.07 3.252.148 4.771 1.691 4.919 4.919.058 1.265.069 1.645.069 4.849 0 3.205-.012 3.584-.069 4.849-.149 3.225-1.664 4.771-4.919 4.919-1.266.058-1.644.07-4.85.07-3.204 0-3.584-.012-4.849-.07-3.26-.149-4.771-1.699-4.919-4.92-.058-1.265-.07-1.644-.07-4.849 0-3.204.013-3.583.07-4.849.149-3.227 1.664-4.771 4.919-4.919 1.266-.057 1.645-.069 4.849-.069zM12 0C8.741 0 8.333.014 7.053.072 2.695.272.273 2.69.073 7.051.014 8.333 0 8.741 0 12c0 3.259.014 3.668.072 4.948.2 4.358 2.618 6.78 6.98 6.98 1.281.058 1.689.072 4.948.072 3.259 0 3.668-.014 4.948-.072 4.354-.2 6.782-2.618 6.979-6.98.059-1.28.073-1.689.073-4.948 0-3.259-.014-3.667-.072-4.947-.196-4.354-2.617-6.78-6.979-6.98C15.668.014 15.259 0 12 0zm0 5.838a6.162 6.162 0 100 12.324 6.162 6.162 0 000-12.324zM12 16a4 4 0 110-8 4 4 0 010 8zm6.406-11.845a1.44 1.44 0 100 2.881 1.44 1.44 0 000-2.881z"/>
              </svg>
            </a>
            <a href="https://facebook.com" target="_blank" rel="noopener noreferrer" className="social-icon" aria-label="Facebook">
              <svg width="18" height="18" fill="currentColor" viewBox="0 0 24 24">
                <path d="M9 8H7v3h2v9h4v-9h3.6l.4-3H13V6c0-.5.5-1 1-1h2V1h-3a5 5 0 00-5 5v2z"/>
              </svg>
            </a>
            <a href="https://youtube.com" target="_blank" rel="noopener noreferrer" className="social-icon" aria-label="YouTube">
              <svg width="18" height="18" fill="currentColor" viewBox="0 0 24 24">
                <path d="M22.5 6.5a3 3 0 00-2.1-2.1C18.7 4 12 4 12 4s-6.7 0-8.4.4A3 3 0 001.5 6.5 31 31 0 001 12a31 31 0 00.5 5.5 3 3 0 002.1 2.1c1.7.4 8.4.4 8.4.4s6.7 0 8.4-.4a3 3 0 002.1-2.1A31 31 0 0023 12a31 31 0 00-.5-5.5z"/>
                <path d="M10 15.5v-7l6 3.5-6 3.5z" fill="currentColor"/>
              </svg>
            </a>
          </div>
        </div>

        <div className="footer-col">
          <h3>Explore</h3>
          <ul className="footer-links">
            <li><Link to="/destinations">Destinations</Link></li>
            <li><Link to="/packages?destination=Meghalaya">Meghalaya</Link></li>
            <li><Link to="/packages?destination=Assam">Assam</Link></li>
            <li><Link to="/packages?destination=Arunachal">Arunachal</Link></li>
            <li><Link to="/services">Services</Link></li>
          </ul>
        </div>

        <div className="footer-col">
          <h3>Company</h3>
          <ul className="footer-links">
            <li><Link to="/about">About Us</Link></li>
            <li><Link to="/about">Travel Tips</Link></li>
            <li><Link to="/about">Permits Guide</Link></li>
            <li><Link to="/contact">FAQs</Link></li>
          </ul>
        </div>

        <div className="footer-col">
          <h3>Support</h3>
          <ul className="footer-links">
            <li><Link to="/contact">Contact</Link></li>
            <li><Link to="/services">Best Time to Visit</Link></li>
            <li><Link to="/contact">Cancellation Policy</Link></li>
            <li><Link to="/contact">Privacy Policy</Link></li>
          </ul>
        </div>
      </div>

      <div className="container footer-bottom">
        <p>&copy; {currentYear} Travmitraa. All rights reserved.</p>
      </div>
    </footer>
  );
};

export default Footer;
