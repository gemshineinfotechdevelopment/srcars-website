import React, { useState, useEffect } from 'react';
import { useSiteSettings } from '../utils/settingsStore';
import { 
  SparkleIcon, 
  InteriorSeatIcon, 
  PaintPolisherIcon, 
  ShieldCheckIcon, 
  EngineWrenchIcon, 
  WheelDiscIcon,
  MoonIcon,
  SunIcon
} from './Icons';

interface NavbarProps {
  currentPage?: 'home' | 'how-it-works' | 'recent-works' | 'contact' | 'admin';
  onNavigate?: (page: 'home' | 'how-it-works' | 'recent-works' | 'contact' | 'admin', targetSection?: string) => void;
  onOpenBooking: (serviceName?: string) => void;
}

export const servicesList: { id: string; name: string; icon: React.ReactNode; desc: string }[] = [
  { id: 'ceramic-graphene', name: 'Ceramic & Graphene Coating', icon: <SparkleIcon size={20} color="var(--yellow-dark)" />, desc: '10H Diamond hardness & 5-yr protection' },
  { id: 'interior-spa', name: 'Interior Sanctuary Spa', icon: <InteriorSeatIcon size={20} color="var(--yellow-dark)" />, desc: 'Deep leather conditioning & ozone purification' },
  { id: 'paint-correction', name: 'Stage 2/3 Paint Correction', icon: <PaintPolisherIcon size={20} color="var(--yellow-dark)" />, desc: 'Multi-stage swirl removal & mirror gloss' },
  { id: 'full-ppf', name: 'Full Body Armor PPF', icon: <ShieldCheckIcon size={20} color="var(--yellow-dark)" />, desc: 'Self-healing ultra-gloss urethane shield' },
  { id: 'engine-detail', name: 'Engine Bay Detailing', icon: <EngineWrenchIcon size={20} color="var(--yellow-dark)" />, desc: 'Steam degreasing & protective dressing' },
  { id: 'wheel-caliper', name: 'Wheel & Caliper Coating', icon: <WheelDiscIcon size={20} color="var(--yellow-dark)" />, desc: 'High-temp brake dust repellent barrier' },
];

export const Navbar: React.FC<NavbarProps> = ({ 
  currentPage = 'home', 
  onNavigate, 
  onOpenBooking 
}) => {
  const settings = useSiteSettings();
  const [isScrolled, setIsScrolled] = useState<boolean>(false);
  const [isMobileMenuOpen, setIsMobileMenuOpen] = useState<boolean>(false);

  // Theme state: defaults to 'light' (white background)
  const [theme, setTheme] = useState<'light' | 'dark'>(() => {
    const saved = localStorage.getItem('cc_theme');
    return saved === 'dark' ? 'dark' : 'light';
  });

  useEffect(() => {
    document.documentElement.setAttribute('data-theme', theme);
    localStorage.setItem('cc_theme', theme);
  }, [theme]);

  const toggleTheme = () => {
    setTheme((prev) => (prev === 'light' ? 'dark' : 'light'));
  };

  useEffect(() => {
    const handleScroll = () => {
      setIsScrolled(window.scrollY > 30);
    };
    window.addEventListener('scroll', handleScroll, { passive: true });
    return () => window.removeEventListener('scroll', handleScroll);
  }, []);

  // Auto-close mobile drawer when window resized to desktop (>1024px)
  useEffect(() => {
    const handleResize = () => {
      if (window.innerWidth > 1024) {
        setIsMobileMenuOpen(false);
      }
    };
    window.addEventListener('resize', handleResize);
    return () => window.removeEventListener('resize', handleResize);
  }, []);

  const handleNavClick = (page: 'home' | 'how-it-works' | 'recent-works' | 'contact' | 'admin', targetSection?: string) => {
    setIsMobileMenuOpen(false);
    const cleanSection = targetSection ? targetSection.replace(/^#/, '') : undefined;
    if (onNavigate) {
      onNavigate(page, cleanSection);
    } else if (cleanSection) {
      const element = document.getElementById(cleanSection);
      if (element) {
        const navHeight = 72;
        const targetY = element.getBoundingClientRect().top + window.scrollY - navHeight;
        window.scrollTo({ top: Math.max(0, targetY), behavior: 'smooth' });
      }
    }
  };

  return (
    <>
      {/* Component-scoped Inline Stylesheet */}
      <style>{`
        .cc-navbar-header {
          position: fixed;
          top: 0;
          left: 0;
          width: 100%;
          z-index: 1000;
          background: var(--navbar-bg);
          backdrop-filter: blur(14px);
          -webkit-backdrop-filter: blur(14px);
          border-bottom: 1px solid var(--border-subtle);
          transition: all 0.35s cubic-bezier(0.16, 1, 0.3, 1);
          padding: 16px 0;
        }
        .cc-navbar-header.scrolled {
          background: var(--navbar-scrolled-bg);
          backdrop-filter: blur(16px);
          -webkit-backdrop-filter: blur(16px);
          border-bottom: 1px solid var(--border-yellow);
          box-shadow: var(--navbar-shadow);
          padding: 12px 0;
        }
        .cc-navbar-container {
          max-width: 1300px;
          margin: 0 auto;
          padding: 0 28px;
          display: flex;
          align-items: center;
          justify-content: space-between;
        }
        .cc-navbar-logo {
          display: flex;
          align-items: center;
          gap: 12px;
          user-select: none;
          text-decoration: none;
        }
        .cc-logo-badge {
          width: 38px;
          height: 38px;
          background: var(--yellow-accent);
          border-radius: 6px;
          display: flex;
          align-items: center;
          justify-content: center;
          box-shadow: 0 0 15px rgba(255, 230, 0, 0.5);
          transform: skewX(-6deg);
        }
        .cc-logo-number {
          font-family: var(--font-heading);
          font-size: 1.25rem;
          font-weight: 900;
          color: #060709;
          transform: skewX(6deg);
        }
        .cc-logo-text-group {
          display: flex;
          flex-direction: column;
        }
        .cc-logo-brand {
          font-family: var(--font-heading);
          font-size: 1.25rem;
          font-weight: 800;
          letter-spacing: 1px;
          color: var(--text-brand);
          line-height: 1.1;
          text-transform: uppercase;
        }
        .cc-logo-sub {
          font-size: 0.62rem;
          font-weight: 700;
          letter-spacing: 2px;
          color: var(--yellow-dark);
          text-transform: uppercase;
        }
        [data-theme="dark"] .cc-logo-sub {
          color: var(--yellow);
        }
        .cc-desktop-nav {
          display: flex;
          align-items: center;
        }
        .cc-nav-links {
          display: flex;
          align-items: center;
          gap: 32px;
          list-style: none;
          margin: 0;
          padding: 0;
        }
        .cc-nav-link {
          position: relative;
          font-family: var(--font-main);
          font-size: 0.95rem;
          font-weight: 600;
          color: var(--text-nav);
          padding: 8px 4px;
          transition: color 0.25s ease;
          display: inline-flex;
          align-items: center;
          gap: 6px;
          background: none;
          border: none;
          cursor: pointer;
          text-decoration: none;
        }
        .cc-nav-link::after {
          content: '';
          position: absolute;
          bottom: 0;
          left: 0;
          width: 0;
          height: 2px;
          background: var(--yellow);
          box-shadow: 0 0 10px var(--yellow);
          transition: width 0.3s cubic-bezier(0.16, 1, 0.3, 1);
          border-radius: 2px;
        }
        .cc-nav-link:hover {
          color: var(--text-nav-hover);
        }
        .cc-nav-link:hover::after {
          width: 100%;
        }
        .cc-nav-link.active {
          color: var(--yellow-dark);
        }
        [data-theme="dark"] .cc-nav-link.active {
          color: var(--yellow);
        }
        .cc-nav-link.active::after {
          width: 100%;
        }
        .cc-dropdown-arrow {
          font-size: 0.75rem;
          color: var(--yellow-dark);
          transition: transform 0.3s ease;
        }
        [data-theme="dark"] .cc-dropdown-arrow {
          color: var(--yellow);
        }
        .cc-dropdown-arrow.open {
          transform: rotate(180deg);
        }
        .cc-nav-item-dropdown {
          position: relative;
        }
        .cc-services-dropdown-panel {
          position: absolute;
          top: calc(100% + 14px);
          left: 50%;
          transform: translateX(-50%) translateY(12px);
          width: 540px;
          background: var(--dropdown-bg);
          border: 1px solid var(--border-yellow);
          box-shadow: var(--dropdown-shadow);
          backdrop-filter: blur(20px);
          -webkit-backdrop-filter: blur(20px);
          border-radius: 12px;
          padding: 16px;
          visibility: hidden;
          opacity: 0;
          pointer-events: none;
          transition: all 0.3s cubic-bezier(0.16, 1, 0.3, 1);
          z-index: 1001;
        }
        .cc-services-dropdown-panel.show {
          visibility: visible;
          opacity: 1;
          pointer-events: auto;
          transform: translateX(-50%) translateY(0);
        }
        .cc-dropdown-grid {
          display: grid;
          grid-template-columns: repeat(2, 1fr);
          gap: 8px;
        }
        .cc-dropdown-card {
          display: flex;
          align-items: center;
          gap: 12px;
          padding: 10px 12px;
          border-radius: 8px;
          background: var(--dropdown-card-bg);
          cursor: pointer;
          transition: all 0.2s ease;
        }
        .cc-dropdown-card:hover {
          background: rgba(234, 179, 8, 0.12);
          transform: translateX(3px);
        }
        .cc-service-icon {
          font-size: 1.3rem;
        }
        .cc-service-name {
          font-size: 0.88rem;
          font-weight: 700;
          color: var(--text-primary);
          margin: 0 0 2px 0;
        }
        .cc-dropdown-card:hover .cc-service-name {
          color: var(--yellow-dark);
        }
        [data-theme="dark"] .cc-dropdown-card:hover .cc-service-name {
          color: var(--yellow);
        }
        .cc-service-desc {
          font-size: 0.72rem;
          color: var(--text-muted);
          margin: 0;
        }
        .cc-navbar-right {
          display: flex;
          align-items: center;
          gap: 14px;
        }
        .cc-theme-toggle-btn {
          display: inline-flex;
          align-items: center;
          justify-content: center;
          width: 38px;
          height: 38px;
          border-radius: 8px;
          background: var(--btn-ghost-bg);
          border: 1px solid var(--border-medium);
          font-size: 1.15rem;
          cursor: pointer;
          transition: all 0.25s ease;
          color: var(--text-primary);
        }
        .cc-theme-toggle-btn:hover {
          border-color: var(--border-yellow);
          background: rgba(234, 179, 8, 0.14);
          transform: translateY(-1px);
        }
        .cc-hamburger-btn {
          display: none;
          flex-direction: column;
          justify-content: center;
          gap: 5px;
          width: 36px;
          height: 36px;
          background: var(--btn-ghost-bg);
          border: 1px solid var(--border-medium);
          border-radius: 6px;
          padding: 8px;
          cursor: pointer;
        }
        .cc-hamburger-bar {
          width: 100%;
          height: 2px;
          background: var(--yellow-dark);
          border-radius: 2px;
          transition: all 0.3s ease;
        }
        [data-theme="dark"] .cc-hamburger-bar {
          background: var(--yellow);
        }
        .cc-hamburger-btn.active .cc-hamburger-bar:nth-child(1) { transform: translateY(7px) rotate(45deg); }
        .cc-hamburger-btn.active .cc-hamburger-bar:nth-child(2) { opacity: 0; }
        .cc-hamburger-btn.active .cc-hamburger-bar:nth-child(3) { transform: translateY(-7px) rotate(-45deg); }
        .cc-mobile-menu-drawer {
          display: none;
          position: absolute;
          top: 100%;
          left: 0;
          width: 100%;
          background: #FFFFFF !important;
          border-bottom: 2px solid var(--border-yellow);
          padding: 20px 24px 28px;
          box-shadow: 0 16px 36px rgba(0, 0, 0, 0.18);
          z-index: 1001;
          backdrop-filter: none !important;
          -webkit-backdrop-filter: none !important;
        }
        [data-theme="dark"] .cc-mobile-menu-drawer {
          background: #0E1117 !important;
          box-shadow: 0 16px 36px rgba(0, 0, 0, 0.7);
        }
        .cc-navbar-header.mobile-open {
          background: #FFFFFF !important;
          backdrop-filter: none !important;
          -webkit-backdrop-filter: none !important;
        }
        [data-theme="dark"] .cc-navbar-header.mobile-open {
          background: #0E1117 !important;
        }
        .cc-mobile-menu-drawer.open {
          display: block;
        }
        .cc-mobile-nav-links {
          list-style: none;
          display: flex;
          flex-direction: column;
          gap: 16px;
          margin: 0;
          padding: 0;
        }
        .cc-mobile-nav-links a {
          font-family: var(--font-heading);
          font-size: 1.15rem;
          font-weight: 700;
          color: var(--text-primary);
          display: block;
          padding: 8px 0;
          text-decoration: none;
          border-bottom: 1px solid var(--border-subtle);
        }
        .cc-mobile-menu-backdrop {
          position: fixed;
          top: 0;
          left: 0;
          width: 100vw;
          height: 100vh;
          background: rgba(0, 0, 0, 0.5);
          backdrop-filter: none !important;
          -webkit-backdrop-filter: none !important;
          z-index: 998;
        }
        @media (min-width: 1025px) {
          .cc-mobile-menu-drawer,
          .cc-mobile-menu-backdrop {
            display: none !important;
          }
        }
        @media (max-width: 1024px) {
          .cc-desktop-nav, .cc-navbar-cta-btn {
            display: none !important;
          }
          .cc-hamburger-btn {
            display: flex;
          }
        }
      `}</style>

      <header className={`cc-navbar-header ${isScrolled ? 'scrolled' : ''} ${isMobileMenuOpen ? 'mobile-open' : ''}`}>
        <div className="cc-navbar-container">
          {/* Brand Logo */}
          <a href="#home" className="cc-navbar-logo" onClick={(e) => { e.preventDefault(); handleNavClick('home'); }}>
            <div className="cc-logo-badge">
              <span className="cc-logo-number">CC</span>
            </div>
            <div className="cc-logo-text-group">
              <span className="cc-logo-brand">{settings.siteName.toUpperCase()}</span>
              <span className="cc-logo-sub">STUDIO & DETAILING</span>
            </div>
          </a>

          {/* Center Desktop Navigation */}
          <nav className="cc-desktop-nav" aria-label="Main Navigation">
            <ul className="cc-nav-links">
              <li>
                <a 
                  href="#home" 
                  className={`cc-nav-link ${currentPage === 'home' ? 'active' : ''}`} 
                  onClick={(e) => { e.preventDefault(); handleNavClick('home'); }}
                >
                  Home
                </a>
              </li>

              {/* Services Direct Link */}
              <li>
                <a 
                  href="#services" 
                  className="cc-nav-link"
                  onClick={(e) => {
                    e.preventDefault();
                    handleNavClick('home', 'services');
                  }}
                >
                  Services
                </a>
              </li>

              <li>
                <a 
                  href="#how-it-works" 
                  className={`cc-nav-link ${currentPage === 'how-it-works' ? 'active' : ''}`} 
                  onClick={(e) => { e.preventDefault(); handleNavClick('how-it-works'); }}
                >
                  How It Works
                </a>
              </li>
              <li>
                <a 
                  href="#recent-works" 
                  className={`cc-nav-link ${currentPage === 'recent-works' ? 'active' : ''}`} 
                  onClick={(e) => { e.preventDefault(); handleNavClick('recent-works'); }}
                >
                  Recent Works
                </a>
              </li>
              <li>
                <a 
                  href="#contact" 
                  className={`cc-nav-link ${currentPage === 'contact' ? 'active' : ''}`} 
                  onClick={(e) => { e.preventDefault(); handleNavClick('contact'); }}
                >
                  Contact
                </a>
              </li>
            </ul>
          </nav>

          {/* Navbar Right CTA */}
          <div className="cc-navbar-right">
            {/* Theme Mode Toggle */}
            <button 
              type="button"
              className="cc-theme-toggle-btn"
              onClick={toggleTheme}
              aria-label={`Switch to ${theme === 'light' ? 'Dark' : 'Light'} Mode`}
              title={`Switch to ${theme === 'light' ? 'Dark' : 'Light'} Mode`}
            >
              {theme === 'light' ? <MoonIcon size={18} /> : <SunIcon size={18} color="var(--yellow)" />}
            </button>

            <button 
              className="btn-automotive-cta cc-navbar-cta-btn"
              onClick={() => onOpenBooking()}
            >
              <span>BOOK AN APPOINTMENT</span>
              <span>→</span>
            </button>

            {/* Mobile Hamburger */}
            <button 
              className={`cc-hamburger-btn ${isMobileMenuOpen ? 'active' : ''}`}
              onClick={() => setIsMobileMenuOpen(!isMobileMenuOpen)}
              aria-label="Menu"
            >
              <span className="cc-hamburger-bar"></span>
              <span className="cc-hamburger-bar"></span>
              <span className="cc-hamburger-bar"></span>
            </button>
          </div>
        </div>

        {/* Backdrop overlay: clicking outside closes the mobile menu */}
        {isMobileMenuOpen && (
          <div 
            className="cc-mobile-menu-backdrop" 
            onClick={() => setIsMobileMenuOpen(false)} 
            aria-label="Close menu backdrop"
          />
        )}

        {/* Mobile Menu Drawer */}
        <div className={`cc-mobile-menu-drawer ${isMobileMenuOpen ? 'open' : ''}`}>
          <ul className="cc-mobile-nav-links">
            <li>
              <a 
                href="#home" 
                className={currentPage === 'home' ? 'active' : ''}
                onClick={(e) => { e.preventDefault(); handleNavClick('home'); }}
              >
                Home
              </a>
            </li>
            <li>
              <a 
                href="#services" 
                onClick={(e) => { e.preventDefault(); handleNavClick('home', 'services'); }}
              >
                Our Services
              </a>
            </li>
            <li>
              <a 
                href="#how-it-works" 
                className={currentPage === 'how-it-works' ? 'active' : ''}
                onClick={(e) => { e.preventDefault(); handleNavClick('how-it-works'); }}
              >
                How It Works
              </a>
            </li>
            <li>
              <a 
                href="#recent-works" 
                className={currentPage === 'recent-works' ? 'active' : ''}
                onClick={(e) => { e.preventDefault(); handleNavClick('recent-works'); }}
              >
                Recent Works
              </a>
            </li>
            <li>
              <a 
                href="#contact" 
                className={currentPage === 'contact' ? 'active' : ''}
                onClick={(e) => { e.preventDefault(); handleNavClick('contact'); }}
              >
                Contact Us
              </a>
            </li>
          </ul>
          <div style={{ marginTop: '20px' }}>
            <button 
              className="btn-automotive-cta"
              style={{ width: '100%' }}
              onClick={() => { setIsMobileMenuOpen(false); onOpenBooking(); }}
            >
              <span>BOOK APPOINTMENT →</span>
            </button>
          </div>
        </div>
      </header>
    </>
  );
};
