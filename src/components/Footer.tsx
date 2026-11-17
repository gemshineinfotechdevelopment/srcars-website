import React from 'react';
import { useSiteSettings } from '../utils/settingsStore';
import { 
  MasterTechIcon, 
  ChemistryFlaskIcon, 
  ShieldCheckIcon, 
  CleanStudioIcon,
  InstagramIcon,
  YouTubeIcon,
  XTwitterIcon,
  FacebookIcon,
  MapPinIcon,
  PhoneCallIcon,
  MailIcon,
  ClockIcon
} from './Icons';

interface FooterProps {
  onNavigate?: (page: 'home' | 'how-it-works' | 'recent-works' | 'contact' | 'admin', targetSection?: string) => void;
  onOpenBooking: (serviceName?: string) => void;
}

export const Footer: React.FC<FooterProps> = ({ onNavigate, onOpenBooking }) => {
  const settings = useSiteSettings();
  const handleNav = (page: 'home' | 'how-it-works' | 'recent-works' | 'contact' | 'admin', targetSection?: string) => {
    if (onNavigate) {
      onNavigate(page, targetSection);
    } else if (targetSection) {
      const el = document.getElementById(targetSection);
      if (el) el.scrollIntoView({ behavior: 'smooth' });
    }
  };

  return (
    <>
      <style>{`
        .cc-footer-wrapper {
          background: var(--footer-bg);
          border-top: 1px solid var(--border-subtle);
          position: relative;
          overflow: hidden;
          transition: background 0.3s ease;
        }
        .cc-trust-pillars-bar {
          background: var(--pillars-bg);
          border-top: 1px solid var(--border-subtle);
          border-bottom: 1px solid var(--border-subtle);
          padding: 40px 0;
          transition: background 0.3s ease;
        }
        .cc-pillars-grid {
          display: grid;
          grid-template-columns: repeat(4, 1fr);
          gap: 24px;
        }
        .cc-pillar-item {
          display: flex;
          align-items: flex-start;
          gap: 16px;
          padding: 12px;
        }
        .cc-pillar-icon {
          width: 44px;
          height: 44px;
          min-width: 44px;
          border-radius: 8px;
          background: rgba(234, 179, 8, 0.1);
          border: 1px solid rgba(234, 179, 8, 0.25);
          display: flex;
          align-items: center;
          justify-content: center;
          font-size: 1.3rem;
          color: var(--yellow-dark);
        }
        [data-theme="dark"] .cc-pillar-icon {
          background: rgba(255, 230, 0, 0.08);
          border-color: rgba(255, 230, 0, 0.25);
          color: var(--yellow);
        }
        .cc-pillar-content {
          display: flex;
          flex-direction: column;
        }
        .cc-pillar-title {
          font-size: 0.98rem;
          font-weight: 700;
          color: var(--text-primary);
          margin: 0 0 4px 0;
        }
        .cc-pillar-desc {
          font-size: 0.78rem;
          color: var(--text-secondary);
          line-height: 1.45;
          margin: 0;
        }
        .cc-footer-main {
          padding: 70px 0 30px;
        }
        .cc-footer-top-grid {
          display: grid;
          grid-template-columns: 1.3fr 0.9fr 1fr 1.3fr;
          gap: 40px;
          margin-bottom: 50px;
        }
        .cc-footer-logo {
          display: flex;
          align-items: center;
          gap: 12px;
          margin-bottom: 16px;
        }
        .cc-footer-logo-badge {
          width: 36px;
          height: 36px;
          background: var(--yellow-accent);
          color: #060709;
          border-radius: 6px;
          display: flex;
          align-items: center;
          justify-content: center;
          font-family: var(--font-heading);
          font-size: 1.2rem;
          font-weight: 900;
          box-shadow: 0 0 15px rgba(255, 230, 0, 0.4);
        }
        .cc-footer-brand-name {
          font-family: var(--font-heading);
          font-size: 1.25rem;
          font-weight: 800;
          color: var(--text-primary);
          letter-spacing: 1px;
        }
        .cc-footer-brand-desc {
          font-size: 0.85rem;
          color: var(--text-secondary);
          line-height: 1.6;
          margin-bottom: 22px;
          max-width: 330px;
        }
        .cc-footer-socials {
          display: flex;
          gap: 10px;
        }
        .cc-social-icon-btn {
          width: 38px;
          height: 38px;
          border-radius: 6px;
          background: var(--btn-ghost-bg);
          border: 1px solid var(--border-medium);
          display: flex;
          align-items: center;
          justify-content: center;
          font-size: 1.05rem;
          color: var(--text-primary);
          text-decoration: none;
          transition: all 0.25s ease;
        }
        .cc-social-icon-btn:hover {
          background: rgba(234, 179, 8, 0.15);
          border-color: var(--border-yellow);
          color: var(--yellow-dark);
          transform: translateY(-2px);
          box-shadow: 0 0 15px rgba(255, 230, 0, 0.3);
        }
        [data-theme="dark"] .cc-social-icon-btn:hover {
          color: var(--yellow);
        }
        .cc-footer-heading {
          font-size: 0.92rem;
          font-weight: 700;
          color: var(--text-primary);
          letter-spacing: 1px;
          margin: 0 0 18px 0;
          position: relative;
          display: inline-block;
        }
        .cc-footer-heading::after {
          content: '';
          position: absolute;
          bottom: -4px;
          left: 0;
          width: 22px;
          height: 2px;
          background: var(--yellow);
        }
        .cc-footer-links {
          list-style: none;
          display: flex;
          flex-direction: column;
          gap: 12px;
          margin: 0;
          padding: 0;
        }
        .cc-footer-links a {
          font-size: 0.86rem;
          color: var(--text-secondary);
          text-decoration: none;
          transition: all 0.2s ease;
        }
        .cc-footer-links a:hover {
          color: var(--yellow-dark);
          transform: translateX(3px);
        }
        [data-theme="dark"] .cc-footer-links a:hover {
          color: var(--yellow);
        }
        .cc-contact-info-list {
          display: flex;
          flex-direction: column;
          gap: 12px;
        }
        .cc-contact-item {
          display: flex;
          align-items: flex-start;
          gap: 10px;
          font-size: 0.85rem;
          color: var(--text-secondary);
          line-height: 1.4;
        }
        .cc-footer-bottom-bar {
          display: flex;
          justify-content: space-between;
          align-items: center;
          padding-top: 24px;
          border-top: 1px solid var(--border-subtle);
          font-size: 0.78rem;
          color: var(--text-muted);
          flex-wrap: wrap;
          gap: 14px;
        }
        .cc-footer-legal-links {
          display: flex;
          gap: 12px;
          align-items: center;
        }
        .cc-footer-legal-links a {
          color: var(--text-muted);
          text-decoration: none;
        }
        .cc-footer-legal-links a:hover {
          color: var(--yellow-dark);
        }
        [data-theme="dark"] .cc-footer-legal-links a:hover {
          color: var(--yellow);
        }
        @media (max-width: 1024px) {
          .cc-pillars-grid {
            grid-template-columns: repeat(2, 1fr);
          }
          .cc-footer-top-grid {
            grid-template-columns: repeat(2, 1fr);
          }
        }
        @media (max-width: 640px) {
          .cc-pillars-grid {
            grid-template-columns: 1fr;
          }
          .cc-footer-top-grid {
            grid-template-columns: 1fr;
          }
          .cc-footer-bottom-bar {
            flex-direction: column;
            text-align: center;
          }
        }
      `}</style>

      <footer id="contact" className="cc-footer-wrapper">
        {/* 4 Trust & Excellence Pillars */}
        <div className="cc-trust-pillars-bar">
          <div className="container">
            <div className="cc-pillars-grid">
              <div className="cc-pillar-item">
                <div className="cc-pillar-icon"><MasterTechIcon size={28} /></div>
                <div className="cc-pillar-content">
                  <h4 className="cc-pillar-title">Master Technicians</h4>
                  <p className="cc-pillar-desc">Certified detailing artisans with 10+ years supercar care experience.</p>
                </div>
              </div>

              <div className="cc-pillar-item">
                <div className="cc-pillar-icon"><ChemistryFlaskIcon size={28} /></div>
                <div className="cc-pillar-content">
                  <h4 className="cc-pillar-title">pH-Neutral Chemistry</h4>
                  <p className="cc-pillar-desc">100% paint-safe biodegradable compounds preserving factory clear coats.</p>
                </div>
              </div>

              <div className="cc-pillar-item">
                <div className="cc-pillar-icon"><ShieldCheckIcon size={28} /></div>
                <div className="cc-pillar-content">
                  <h4 className="cc-pillar-title">Guaranteed Quality</h4>
                  <p className="cc-pillar-desc">Official warranty certificates issued with every 9H & 10H treatment.</p>
                </div>
              </div>

              <div className="cc-pillar-item">
                <div className="cc-pillar-icon"><CleanStudioIcon size={28} /></div>
                <div className="cc-pillar-content">
                  <h4 className="cc-pillar-title">Clean Room Studio</h4>
                  <p className="cc-pillar-desc">Air-conditioned, dust-filtered hermetic bays for contamination-free cures.</p>
                </div>
              </div>
            </div>
          </div>
        </div>

        {/* Main Footer Content */}
        <div className="cc-footer-main">
          <div className="container">
            <div className="cc-footer-top-grid">
              {/* Brand column */}
              <div>
                <div 
                  className="cc-footer-logo" 
                  style={{ cursor: 'pointer' }}
                  onClick={() => handleNav('home')}
                >
                  <div className="cc-footer-logo-badge">CC</div>
                  <span className="cc-footer-brand-name">{settings.siteName.toUpperCase()}</span>
                </div>
                <p className="cc-footer-brand-desc">
                  The apex of automotive aesthetics. Specializing in multi-stage paint correction, ceramic coatings, and self-healing paint protection films.
                </p>
                <div className="cc-footer-socials">
                  <a href="#instagram" className="cc-social-icon-btn" aria-label="Instagram">
                    <InstagramIcon size={18} />
                  </a>
                  <a href="#youtube" className="cc-social-icon-btn" aria-label="YouTube">
                    <YouTubeIcon size={18} />
                  </a>
                  <a href="#twitter" className="cc-social-icon-btn" aria-label="X Twitter">
                    <XTwitterIcon size={16} />
                  </a>
                  <a href="#facebook" className="cc-social-icon-btn" aria-label="Facebook">
                    <FacebookIcon size={18} />
                  </a>
                </div>
              </div>

              {/* Quick Links */}
              <div>
                <h4 className="cc-footer-heading">NAVIGATION</h4>
                <ul className="cc-footer-links">
                  <li><a href="#home" onClick={(e) => { e.preventDefault(); handleNav('home'); }}>Home</a></li>
                  <li><a href="#services" onClick={(e) => { e.preventDefault(); handleNav('home', 'services'); }}>Our Services</a></li>
                  <li><a href="#how-it-works" onClick={(e) => { e.preventDefault(); handleNav('how-it-works'); }}>How It Works</a></li>
                  <li><a href="#recent-works" onClick={(e) => { e.preventDefault(); handleNav('recent-works'); }}>Recent Works</a></li>
                  <li><a href="#contact" onClick={(e) => { e.preventDefault(); handleNav('contact'); }}>Contact Us</a></li>
                </ul>
              </div>

              {/* Treatments */}
              <div>
                <h4 className="cc-footer-heading">TREATMENTS</h4>
                <ul className="cc-footer-links">
                  <li><a href="#services" onClick={(e) => { e.preventDefault(); onOpenBooking('Ceramic & Graphene'); }}>Ceramic & Graphene</a></li>
                  <li><a href="#services" onClick={(e) => { e.preventDefault(); onOpenBooking('Interior Sanctuary Spa'); }}>Interior Sanctuary Spa</a></li>
                  <li><a href="#services" onClick={(e) => { e.preventDefault(); onOpenBooking('Paint Correction'); }}>Stage 2/3 Paint Correction</a></li>
                  <li><a href="#services" onClick={(e) => { e.preventDefault(); onOpenBooking('Full Body Armor PPF'); }}>Full Body Armor PPF</a></li>
                </ul>
              </div>

              {/* Contact */}
              <div>
                <h4 className="cc-footer-heading">STUDIO & BOOKINGS</h4>
                <div className="cc-contact-info-list">
                  <div className="cc-contact-item">
                    <span><MapPinIcon size={16} color="var(--yellow-dark)" /></span>
                    <span>{settings.address}</span>
                  </div>
                  <div className="cc-contact-item">
                    <span><PhoneCallIcon size={16} color="var(--yellow-dark)" /></span>
                    <a href={`tel:${settings.phone.replace(/[^0-9+]/g, '')}`} style={{ color: 'inherit', textDecoration: 'none' }}>
                      {settings.phone}
                    </a>
                  </div>
                  <div className="cc-contact-item">
                    <span><MailIcon size={16} color="var(--yellow-dark)" /></span>
                    <a href={`mailto:${settings.email}`} style={{ color: 'inherit', textDecoration: 'none' }}>
                      {settings.email}
                    </a>
                  </div>
                  <div className="cc-contact-item">
                    <span><ClockIcon size={16} color="var(--yellow-dark)" /></span>
                    <span>{settings.operatingHours}</span>
                  </div>
                </div>
              </div>
            </div>

            <div className="cc-footer-bottom-bar">
              <p>© {new Date().getFullYear()} {settings.siteName}. All rights reserved.</p>
              <div className="cc-footer-legal-links">
                <a href="#privacy">Privacy</a>
                <span>•</span>
                <a href="#terms">Terms</a>
                <span>•</span>
                <a href="#warranty">Warranty Standards</a>
              </div>
            </div>
          </div>
        </div>
      </footer>
    </>
  );
};
