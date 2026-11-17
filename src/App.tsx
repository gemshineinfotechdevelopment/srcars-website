import React, { useState, useEffect } from 'react';
import { Navbar } from './components/Navbar';
import { Footer } from './components/Footer';
import { BookingModal, type BookingInitialData } from './components/BookingModal';
import { Home } from './pages/Home';
import { HowItWorks } from './pages/HowItWorks';
import { RecentWorks } from './pages/RecentWorks';
import { Contact } from './pages/Contact';
import { Admin } from './pages/Admin';

export type PageType = 'home' | 'how-it-works' | 'recent-works' | 'contact' | 'admin';

const rootStyle: React.CSSProperties = {
  minHeight: '100vh',
  display: 'flex',
  flexDirection: 'column',
  width: '100%',
  position: 'relative',
};

function App() {
  const getPageFromUrl = (): PageType => {
    const path = window.location.pathname.replace(/^\//, '').toLowerCase();
    const hash = window.location.hash.replace(/^#/, '').toLowerCase();

    if (path === 'admin' || hash === 'admin') return 'admin';
    if (path === 'how-it-works' || hash === 'how-it-works') return 'how-it-works';
    if (path === 'recent-works' || hash === 'recent-works' || hash === 'transformations') return 'recent-works';
    if (path === 'contact' || hash === 'contact') return 'contact';
    return 'home';
  };

  const [currentPage, setCurrentPage] = useState<PageType>(getPageFromUrl);
  const [isBookingOpen, setIsBookingOpen] = useState(false);
  const [selectedService, setSelectedService] = useState<string | undefined>(undefined);
  const [bookingInitialData, setBookingInitialData] = useState<BookingInitialData | undefined>(undefined);

  useEffect(() => {
    const handleUrlChange = () => {
      const page = getPageFromUrl();
      setCurrentPage(page);
      const hash = window.location.hash.replace(/^#/, '').toLowerCase();
      if (page === 'home' && hash && hash !== 'home') {
        const scrollToElement = () => {
          const el = document.getElementById(hash);
          if (el) {
            const navHeight = 72;
            const targetY = el.getBoundingClientRect().top + window.scrollY - navHeight;
            window.scrollTo({ top: Math.max(0, targetY), behavior: 'smooth' });
            return true;
          }
          return false;
        };
        if (!scrollToElement()) {
          setTimeout(scrollToElement, 60);
          setTimeout(scrollToElement, 180);
        }
      } else {
        window.scrollTo({ top: 0, behavior: 'smooth' });
      }
    };

    window.addEventListener('hashchange', handleUrlChange);
    window.addEventListener('popstate', handleUrlChange);
    return () => {
      window.removeEventListener('hashchange', handleUrlChange);
      window.removeEventListener('popstate', handleUrlChange);
    };
  }, []);

  // Initial scroll check if loaded with hash e.g. #services
  useEffect(() => {
    const hash = window.location.hash.replace(/^#/, '').toLowerCase();
    if (hash && hash !== 'home' && currentPage === 'home') {
      const scrollToHash = () => {
        const el = document.getElementById(hash);
        if (el) {
          const navHeight = 72;
          const targetY = el.getBoundingClientRect().top + window.scrollY - navHeight;
          window.scrollTo({ top: Math.max(0, targetY), behavior: 'smooth' });
          return true;
        }
        return false;
      };
      setTimeout(scrollToHash, 100);
      setTimeout(scrollToHash, 250);
    }
  }, []);

  const handleNavigate = (page: PageType, targetSection?: string) => {
    const cleanSection = targetSection ? targetSection.replace(/^#/, '') : '';
    setCurrentPage(page);

    if (page === 'home') {
      const newHash = cleanSection ? `#${cleanSection}` : '#home';
      if (window.location.hash !== newHash) {
        window.history.pushState(null, '', newHash);
      }

      if (cleanSection && cleanSection !== 'home') {
        const performScroll = () => {
          const el = document.getElementById(cleanSection);
          if (el) {
            const navHeight = 72;
            const targetY = el.getBoundingClientRect().top + window.scrollY - navHeight;
            window.scrollTo({ top: Math.max(0, targetY), behavior: 'smooth' });
            return true;
          }
          return false;
        };

        if (!performScroll()) {
          requestAnimationFrame(() => {
            if (!performScroll()) {
              setTimeout(performScroll, 60);
              setTimeout(performScroll, 180);
            }
          });
        }
      } else {
        window.scrollTo({ top: 0, behavior: 'smooth' });
      }
    } else {
      const newHash = `#${page}`;
      if (window.location.hash !== newHash) {
        window.history.pushState(null, '', newHash);
      }
      window.scrollTo({ top: 0, behavior: 'smooth' });
    }
  };

  const handleOpenBooking = (serviceOrData?: string | BookingInitialData) => {
    if (typeof serviceOrData === 'string') {
      setBookingInitialData({ service: serviceOrData });
      setSelectedService(serviceOrData);
    } else if (serviceOrData && typeof serviceOrData === 'object') {
      setBookingInitialData(serviceOrData);
      setSelectedService(serviceOrData.service);
    } else {
      setBookingInitialData(undefined);
      setSelectedService(undefined);
    }
    setIsBookingOpen(true);
  };

  const handleCloseBooking = () => {
    setIsBookingOpen(false);
    setSelectedService(undefined);
    setBookingInitialData(undefined);
  };

  // Dedicated Admin View without customer Navbar & Footer
  if (currentPage === 'admin') {
    return (
      <div style={rootStyle}>
        <Admin onNavigate={handleNavigate} />
      </div>
    );
  }

  return (
    <div style={rootStyle}>
      {/* Sticky Automotive Navbar */}
      <Navbar 
        currentPage={currentPage}
        onNavigate={handleNavigate}
        onOpenBooking={handleOpenBooking} 
      />

      {/* Dynamic Page Content */}
      <main style={{ flex: 1 }}>
        {currentPage === 'home' && (
          <Home onOpenBooking={handleOpenBooking} onNavigate={handleNavigate} />
        )}
        {currentPage === 'how-it-works' && (
          <HowItWorks onOpenBooking={handleOpenBooking} />
        )}
        {currentPage === 'recent-works' && (
          <RecentWorks onOpenBooking={handleOpenBooking} />
        )}
        {currentPage === 'contact' && (
          <Contact onOpenBooking={handleOpenBooking} />
        )}
      </main>

      {/* Footer */}
      <Footer onOpenBooking={handleOpenBooking} onNavigate={handleNavigate} />

      {/* Service Booking Modal */}
      <BookingModal 
        isOpen={isBookingOpen} 
        onClose={handleCloseBooking} 
        initialService={selectedService} 
        initialData={bookingInitialData}
      />
    </div>
  );
}

export default App;
