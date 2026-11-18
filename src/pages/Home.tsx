import React, { useState, useEffect, useRef } from 'react';
import heroCarImg from '../assets/hero_car.jpg';
import technicianImg from '../assets/service_technician.jpg';
import interiorImg from '../assets/interior_detailing.jpg';
import techCarImg from '../assets/tech_car.jpg';
import detailAfterImg from '../assets/detail_after.jpg';
import heroBannerVideo from '../assets/hero_banner.mp4';
import { useServicesList, resolveServiceImage } from '../utils/servicesStore';
import { useWorksList, type WorkItem } from '../utils/worksStore';
import { BeforeAfterModal } from '../components/BeforeAfterModal';
import {
  DiamondIcon,
  SparkleIcon,
  ShieldCheckIcon,
  SunUvIcon,
  InteriorSeatIcon,
  SteamAirIcon,
  EcoLeafIcon,
  SearchGaugeIcon,
  GearSettingIcon,
  LightLampIcon,
  StarSealIcon,
  MasterTechIcon
} from '../components/Icons';

interface HomeProps {
  onOpenBooking: (serviceOrData?: string | { service?: string; carModel?: string; date?: string }) => void;
  onNavigate?: (page: 'home' | 'how-it-works' | 'recent-works' | 'contact', targetSection?: string) => void;
}

// 4 Services for the 2-division section
interface ServiceData {
  id: string;
  name: string;
  shortName: string;
  tag: string;
  thumbnail: string;
  shortDesc: string;
  showcaseTitle: string;
  price: string;
  showcaseImg: string;
  features: { icon: React.ReactNode; title: string; desc: string }[];
  addon: string;
}

const servicesData: ServiceData[] = [
  {
    id: 'ceramic',
    name: 'Ceramic & Graphene',
    shortName: 'Ceramic',
    tag: 'HOT',
    thumbnail: detailAfterImg,
    shortDesc: 'Multi-layer high-solids hydrophobic coating delivering deep optical gloss & UV defense.',
    showcaseTitle: 'CERAMIC COATING & PAINT ARMOR',
    price: '₹899',
    showcaseImg: technicianImg,
    features: [
      { icon: <DiamondIcon size={20} color="var(--yellow-dark)" />, title: '10H Diamond Hardness', desc: 'Highest scratch resistance certified by international hardness tests.' },
      { icon: <SparkleIcon size={20} color="var(--yellow-dark)" />, title: 'Dual-Layer Self-Healing Matrix', desc: 'Micro-scratches vanish under direct solar heat activation.' },
      { icon: <ShieldCheckIcon size={20} color="var(--yellow-dark)" />, title: '5-Year Factory Warranty', desc: 'Official logged warranty with nationwide gloss retention guarantee.' },
      { icon: <SunUvIcon size={20} color="var(--yellow-dark)" />, title: 'UV & Chemical Shield', desc: 'Resists acid rain, industrial fallout, tree sap, and harsh detergents.' },
    ],
    addon: 'Includes Full Multi-Stage Decontamination & Alcohol Prep',
  },
  {
    id: 'interior',
    name: 'Interior Sanctuary Spa',
    shortName: 'Interior',
    tag: 'RESTORE',
    thumbnail: interiorImg,
    shortDesc: 'Deep leather conditioning, steam sanitization, and antibacterial cabin treatment.',
    showcaseTitle: 'CONCOURS INTERIOR RESTORATION',
    price: '₹1,499',
    showcaseImg: interiorImg,
    features: [
      { icon: <InteriorSeatIcon size={20} color="var(--yellow-dark)" />, title: 'Swissvax Leather Balm', desc: 'Nourishing oils restoring suppleness to Italian Nappa and Merino hides.' },
      { icon: <SteamAirIcon size={20} color="var(--yellow-dark)" />, title: 'High-Pressure Steam Extraction', desc: 'Eliminates 99.9% of bacteria and allergens embedded in carpets.' },
      { icon: <EcoLeafIcon size={20} color="var(--yellow-dark)" />, title: 'Ozone Cabin Sterilization', desc: 'Hospital-grade molecular deodorizing neutralizing stubborn odors.' },
      { icon: <ShieldCheckIcon size={20} color="var(--yellow-dark)" />, title: 'Matte UV Dashboard Shield', desc: 'Zero greasy residue protection against dashboard drying and cracking.' },
    ],
    addon: 'Includes AC Vent Ozone Purge & Alcantara Brush Detailing',
  },
  {
    id: 'paint-correction',
    name: 'Paint Correction',
    shortName: 'Correction',
    tag: 'STAGE 2/3',
    thumbnail: technicianImg,
    shortDesc: 'Precision rotary & orbital buffing removing up to 95% of swirl marks & clear coat haze.',
    showcaseTitle: 'STAGE 2 & 3 MIRROR PAINT CORRECTION',
    price: '₹2,199',
    showcaseImg: technicianImg,
    features: [
      { icon: <SearchGaugeIcon size={20} color="var(--yellow-dark)" />, title: 'Digital Paint Depth Gauging', desc: 'Ultrasonic micrometer assessment ensuring clear coat integrity.' },
      { icon: <GearSettingIcon size={20} color="var(--yellow-dark)" />, title: 'Diminishing Abrasive Micro-Polishing', desc: 'Safely levels orange peel and clears micro-scratches permanently.' },
      { icon: <LightLampIcon size={20} color="var(--yellow-dark)" />, title: 'Full Spectrum CRI Inspection', desc: 'Identifies buffer trails and holograms under specialized LED arrays.' },
      { icon: <SparkleIcon size={20} color="var(--yellow-dark)" />, title: 'Jeweling Compound Finish', desc: 'Extracts deep wet-look reflection ready for ceramic or film bond.' },
    ],
    addon: 'Includes 3-Step IPA Wipe-Down & Inspection Certificate',
  },
  {
    id: 'ppf',
    name: 'Full Body Armor PPF',
    tag: 'ULTIMATE',
    shortName: 'PPF Armor',
    thumbnail: techCarImg,
    shortDesc: 'Self-healing TPU film repelling stone chips, road debris, and chemical staining.',
    showcaseTitle: 'SELF-HEALING OPTICAL TPU PPF',
    price: '₹4,999',
    showcaseImg: techCarImg,
    features: [
      { icon: <ShieldCheckIcon size={20} color="var(--yellow-dark)" />, title: 'Instant Heat Self-Healing', desc: 'Surface swirls disappear automatically when exposed to sunlight or warm water.' },
      { icon: <SearchGaugeIcon size={20} color="var(--yellow-dark)" />, title: 'Pre-Cut Computerized Patterns', desc: 'Zero razor blades on vehicle paintwork; wrap-around invisible edges.' },
      { icon: <DiamondIcon size={20} color="var(--yellow-dark)" />, title: '10-Year Anti-Yellowing Bond', desc: 'Optical clarity with zero orange peel or adhesive discoloration.' },
      { icon: <SparkleIcon size={20} color="var(--yellow-dark)" />, title: 'Hydrophobic Top-Coat Infused', desc: 'Water and dirt bead off instantaneously at highway velocities.' },
    ],
    addon: 'Includes Wrapped Edge Alignment & Ceramic Top-Coat Layer',
  },
];

export const Home: React.FC<HomeProps> = ({ onOpenBooking, onNavigate }) => {
  const dynamicServices = useServicesList();
  const dynamicWorks = useWorksList();
  const [selectedGalleryWork, setSelectedGalleryWork] = useState<WorkItem | null>(null);
  const [activeServiceId, setActiveServiceId] = useState<string>('ceramic');

  const servicesTrackRef = useRef<HTMLDivElement>(null);
  const [isServicesScrolledDown, setIsServicesScrolledDown] = useState<boolean>(false);

  const handleScrollServices = (direction: 'down' | 'up') => {
    if (servicesTrackRef.current) {
      const scrollAmount = window.innerWidth <= 1024 ? 110 : 150;
      servicesTrackRef.current.scrollBy({
        top: direction === 'down' ? scrollAmount : -scrollAmount,
        behavior: 'smooth'
      });
    }
  };

  const videoRef = useRef<HTMLVideoElement>(null);
  const [isHeroRevealed, setIsHeroRevealed] = useState<boolean>(false);
  const isAnimatingRef = useRef<boolean>(false);
  const isRevealedRef = useRef<boolean>(false);

  const [isMobile, setIsMobile] = useState<boolean>(() => {
    return typeof window !== 'undefined' ? window.innerWidth <= 768 : false;
  });

  const getFeatureIcon = (index: number) => {
    switch (index % 4) {
      case 0: return <DiamondIcon size={20} color="var(--yellow-dark)" />;
      case 1: return <SparkleIcon size={20} color="var(--yellow-dark)" />;
      case 2: return <ShieldCheckIcon size={20} color="var(--yellow-dark)" />;
      case 3: default: return <SunUvIcon size={20} color="var(--yellow-dark)" />;
    }
  };

  useEffect(() => {
    isRevealedRef.current = isHeroRevealed;
  }, [isHeroRevealed]);

  useEffect(() => {
    const handleResize = () => {
      setIsMobile(window.innerWidth <= 768);
    };
    window.addEventListener('resize', handleResize);
    return () => window.removeEventListener('resize', handleResize);
  }, []);

  // Auto-play high-quality muted video banner reliably across browsers
  useEffect(() => {
    if (videoRef.current) {
      videoRef.current.muted = true;
      videoRef.current.defaultMuted = true;
      const playPromise = videoRef.current.play();
      if (playPromise !== undefined) {
        playPromise.catch((err) => {
          console.warn('Hero video auto-play prevented or queued:', err);
        });
      }
    }
  }, []);

  // Handle direct navigation or URL hash to sections like #services
  useEffect(() => {
    const handleInitialHash = () => {
      const hash = window.location.hash.replace(/^#/, '');
      if (hash && hash !== 'home') {
        const el = document.getElementById(hash);
        if (el) {
          setIsHeroRevealed(true);
          const navHeight = 72;
          const targetY = el.getBoundingClientRect().top + window.scrollY - navHeight;
          window.scrollTo({ top: Math.max(0, targetY), behavior: 'smooth' });
        }
      }
    };
    const timer = setTimeout(handleInitialHash, 100);
    return () => clearTimeout(timer);
  }, []);

  // Desktop Scroll-Gate: Screen does NOT move up on mouse scroll!
  // Instead, mouse scroll down brings the text, button & 3 boxes into place over the video.
  // ONLY after they are fully placed and 100% visible is normal page scrolling unlocked!
  useEffect(() => {
    if (isMobile) return;

    const handleWheel = (e: WheelEvent) => {
      const scrollY = window.scrollY;

      // When at the very top of the page:
      if (scrollY <= 8) {
        // User scrolls DOWN:
        if (e.deltaY > 0) {
          // If hero text is not yet revealed OR is currently animating, intercept and lock screen!
          if (!isRevealedRef.current || isAnimatingRef.current) {
            e.preventDefault(); // SCREEN DOES NOT MOVE UP!
            if (!isRevealedRef.current && !isAnimatingRef.current) {
              isAnimatingRef.current = true;
              setIsHeroRevealed(true);
              // Wait for text to fully glide up, dock in center, and become 100% visible
              setTimeout(() => {
                isAnimatingRef.current = false;
              }, 700);
            }
            return;
          }
          // If already revealed and not animating: normal page scroll proceeds!
        }

        // User scrolls UP at the very top: smoothly reset text back down
        if (e.deltaY < -20 && isRevealedRef.current && !isAnimatingRef.current && scrollY <= 2) {
          e.preventDefault();
          isAnimatingRef.current = true;
          setIsHeroRevealed(false);
          setTimeout(() => {
            isAnimatingRef.current = false;
          }, 650);
          return;
        }
      }
    };

    const handleKeyDown = (e: KeyboardEvent) => {
      if (['ArrowDown', 'PageDown', ' '].includes(e.key) && window.scrollY <= 5) {
        if (!isRevealedRef.current || isAnimatingRef.current) {
          e.preventDefault();
          if (!isRevealedRef.current && !isAnimatingRef.current) {
            isAnimatingRef.current = true;
            setIsHeroRevealed(true);
            setTimeout(() => {
              isAnimatingRef.current = false;
            }, 700);
          }
        }
      }
    };

    window.addEventListener('wheel', handleWheel, { passive: false });
    window.addEventListener('keydown', handleKeyDown);
    return () => {
      window.removeEventListener('wheel', handleWheel);
      window.removeEventListener('keydown', handleKeyDown);
    };
  }, [isMobile]);

  // Quick booking bar state
  const [quickModel, setQuickModel] = useState<string>('');
  const [quickService, setQuickService] = useState<string>('Ceramic & Graphene');
  const [quickDate, setQuickDate] = useState<string>('');

  // Intersection Observer for scroll bottom-to-top animations
  useEffect(() => {
    const observerCallback: IntersectionObserverCallback = (entries, observer) => {
      entries.forEach((entry) => {
        if (entry.isIntersecting) {
          entry.target.classList.add('in-view');
          observer.unobserve(entry.target);
        }
      });
    };

    const observer = new IntersectionObserver(observerCallback, {
      threshold: 0.15,
      rootMargin: '0px 0px -40px 0px',
    });

    const revealElements = document.querySelectorAll(
      '.scroll-reveal-bottom, .scroll-reveal-right, .scroll-reveal-stagger'
    );
    revealElements.forEach((el) => observer.observe(el));

    return () => {
      observer.disconnect();
    };
  }, []);


  const activeService = dynamicServices.find((s) => s.id === activeServiceId) || dynamicServices[0] || servicesData[0];

  const handleQuickBookingSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    onOpenBooking({
      service: quickService,
      carModel: quickModel,
      date: quickDate,
    });
  };

  return (
    <>
      {/* Component-scoped Inline Stylesheet */}
      <style>{`
        .home-page-container {
          overflow-x: hidden;
          position: relative;
        }
        /* Hero Banner Section: Fixed 100vh on Desktop with zero black gaps */
        .hero-sticky-scroll-container {
          position: relative;
          width: 100%;
          height: 100vh;
          height: 100svh;
          background: #000000;
          overflow: hidden;
        }
        .hero-sticky-viewport {
          position: relative;
          width: 100%;
          height: 100%;
          overflow: hidden;
          display: flex;
          align-items: center;
          justify-content: center;
        }
        .hero-video-wrapper {
          position: absolute;
          inset: 0;
          width: 100%;
          height: 100%;
          overflow: hidden;
        }
        .hero-video-element {
          width: 100%;
          height: 100%;
          object-fit: cover;
          object-position: center;
          display: block;
          filter: brightness(0.96) contrast(1.05);
        }
        .hero-video-dynamic-darken {
          position: absolute;
          inset: 0;
          background: #000000;
          pointer-events: none;
          z-index: 2;
          opacity: 0.18;
          transition: opacity 0.75s ease-out;
        }
        .hero-video-dynamic-darken.revealed {
          opacity: 0.58;
        }
        .hero-video-overlay-top {
          position: absolute;
          top: 0;
          left: 0;
          width: 100%;
          height: 160px;
          background: linear-gradient(180deg, rgba(0, 0, 0, 0.75) 0%, rgba(0, 0, 0, 0) 100%);
          pointer-events: none;
          z-index: 3;
        }
        .hero-video-overlay-bottom {
          position: absolute;
          bottom: 0;
          left: 0;
          width: 100%;
          height: 180px;
          background: linear-gradient(0deg, var(--bg-main) 0%, rgba(0, 0, 0, 0.45) 45%, transparent 100%);
          pointer-events: none;
          z-index: 3;
          transition: background 0.3s ease;
        }
        [data-theme="light"] .hero-video-overlay-bottom {
          background: linear-gradient(0deg, #ffffff 0%, rgba(255, 255, 255, 0.8) 35%, transparent 100%);
        }
        [data-theme="dark"] .hero-video-overlay-bottom {
          background: linear-gradient(0deg, #0d0f12 0%, rgba(13, 15, 18, 0.8) 35%, transparent 100%);
        }

        /* Animated Hero Content Layer (Text, Button & 3 Boxes Over Video) */
        .hero-video-overlay-content {
          position: absolute;
          inset: 0;
          display: flex;
          flex-direction: column;
          align-items: center;
          justify-content: center;
          padding: 85px 24px 40px;
          z-index: 10;
          text-align: center;
          transform: translate3d(0, 130px, 0);
          opacity: 0;
          pointer-events: none;
          transition: transform 0.75s cubic-bezier(0.16, 1, 0.3, 1), opacity 0.75s cubic-bezier(0.16, 1, 0.3, 1);
          will-change: transform, opacity;
        }
        .hero-video-overlay-content.revealed {
          transform: translate3d(0, 0, 0);
          opacity: 1;
          pointer-events: auto;
        }
        .hero-overlay-inner {
          display: flex;
          flex-direction: column;
          align-items: center;
          max-width: 1060px;
          width: 100%;
        }
        .hero-text-container {
          display: flex;
          flex-direction: column;
          align-items: center;
          width: 100%;
          margin-bottom: 22px;
        }
        .hero-main-title {
          font-size: clamp(2.3rem, 5vw, 4rem);
          font-weight: 900;
          line-height: 1.12;
          color: #FFFFFF;
          text-transform: uppercase;
          letter-spacing: 0.5px;
          margin-bottom: 16px;
          max-width: 1000px;
          text-shadow: 0 4px 28px rgba(0, 0, 0, 0.85);
        }
        .highlight-yellow {
          color: var(--yellow);
          text-shadow: 0 0 35px rgba(255, 230, 0, 0.6);
        }
        .hero-subtext {
          font-size: clamp(0.95rem, 1.8vw, 1.15rem);
          color: rgba(255, 255, 255, 0.92);
          max-width: 740px;
          line-height: 1.6;
          margin-bottom: 28px;
          text-shadow: 0 2px 15px rgba(0, 0, 0, 0.85);
        }
        .hero-action-buttons {
          display: flex;
          align-items: center;
          justify-content: center;
          gap: 18px;
          margin-bottom: 30px;
        }
        .hero-action-buttons .btn-automotive-cta {
          box-shadow: 0 8px 32px rgba(234, 179, 8, 0.5), 0 0 20px rgba(255, 230, 0, 0.3);
        }
        .hero-trust-badges {
          display: grid;
          grid-template-columns: repeat(3, 1fr);
          gap: 18px;
          width: 100%;
          max-width: 820px;
        }
        .trust-badge-item {
          display: flex;
          align-items: center;
          gap: 12px;
          background: rgba(10, 14, 20, 0.8);
          backdrop-filter: blur(16px);
          -webkit-backdrop-filter: blur(16px);
          border: 1px solid rgba(255, 230, 0, 0.3);
          border-radius: 12px;
          padding: 14px 18px;
          text-align: left;
          box-shadow: 0 12px 35px rgba(0, 0, 0, 0.6);
          transition: all 0.3s ease;
        }
        .trust-badge-item:hover {
          border-color: var(--yellow);
          transform: translateY(-2px);
          background: rgba(10, 14, 20, 0.92);
          box-shadow: 0 14px 40px rgba(255, 230, 0, 0.25);
        }
        .badge-ico {
          font-size: 1.5rem;
        }
        .badge-text-block {
          display: flex;
          flex-direction: column;
        }
        .badge-text-block strong {
          font-family: var(--font-heading);
          font-size: 0.88rem;
          color: #FFFFFF;
        }
        .badge-text-block span {
          font-size: 0.72rem;
          color: rgba(255, 255, 255, 0.8);
        }
        .services-showcase-section {
          position: relative;
          padding: 100px 0;
          scroll-margin-top: 75px;
          background: var(--bg-subtle);
          border-top: 1px solid var(--border-subtle);
          transition: background 0.3s ease;
        }
        [data-theme="dark"] .services-showcase-section {
          background: linear-gradient(180deg, var(--bg-main) 0%, var(--bg-subtle) 50%, var(--bg-main) 100%);
        }
        .section-header-split {
          display: flex;
          justify-content: space-between;
          align-items: flex-end;
          margin-bottom: 48px;
          gap: 40px;
        }
        .sub-label {
          font-family: var(--font-heading);
          font-size: 0.8rem;
          font-weight: 800;
          letter-spacing: 2px;
          color: var(--yellow-dark);
          text-transform: uppercase;
          margin-bottom: 8px;
          display: block;
        }
        [data-theme="dark"] .sub-label {
          color: var(--yellow);
        }
        .split-title {
          font-size: clamp(2rem, 4vw, 3rem);
          font-weight: 900;
          line-height: 1.15;
          color: var(--text-primary);
          text-transform: uppercase;
        }
        .split-subtitle {
          font-size: 0.95rem;
          color: var(--text-secondary);
          max-width: 480px;
          line-height: 1.5;
        }
        .services-two-division-wrap {
          display: grid;
          grid-template-columns: 420px 1fr;
          gap: 28px;
          align-items: stretch;
        }
        .services-left-col {
          display: flex;
          flex-direction: column;
          gap: 10px;
        }
        .services-scroll-track.fit-all {
          display: flex;
          flex-direction: column;
          gap: 14px;
          max-height: none;
          overflow-y: visible;
          padding: 0;
        }
        .services-scroll-track.scrollable {
          display: flex;
          flex-direction: column;
          gap: 14px;
          max-height: 600px; /* comfortably fits 5 services on desktop */
          overflow-y: auto;
          scroll-behavior: smooth;
          padding: 2px 6px 2px 2px;
          scrollbar-width: thin;
          scrollbar-color: var(--yellow) transparent;
        }
        .services-scroll-track::-webkit-scrollbar {
          width: 5px;
        }
        .services-scroll-track::-webkit-scrollbar-track {
          background: transparent;
        }
        .services-scroll-track::-webkit-scrollbar-thumb {
          background: var(--yellow);
          border-radius: 4px;
        }
        .services-scroll-controls {
          width: 100%;
        }
        .services-view-more-btn {
          width: 100%;
          background: var(--bg-card);
          border: 1px dashed var(--border-yellow);
          color: var(--text-primary);
          padding: 10px 14px;
          border-radius: 10px;
          font-family: var(--font-heading);
          font-size: 0.74rem;
          font-weight: 800;
          cursor: pointer;
          display: flex;
          align-items: center;
          justify-content: center;
          gap: 8px;
          transition: all 0.25s ease;
          box-shadow: 0 4px 12px rgba(0, 0, 0, 0.05);
        }
        .services-view-more-btn:hover {
          background: var(--yellow-accent);
          color: #060709;
          border-style: solid;
          transform: translateY(-2px);
          box-shadow: 0 6px 18px rgba(234, 179, 8, 0.3);
        }
        .services-view-more-btn.up {
          border-color: var(--border-subtle);
          background: var(--bg-subtle);
        }
        .service-select-card {
          position: relative;
          display: flex;
          align-items: center;
          gap: 16px;
          background: var(--bg-card);
          border: 1px solid var(--border-subtle);
          border-radius: 12px;
          padding: 16px;
          cursor: pointer;
          overflow: hidden;
          box-shadow: var(--card-shadow);
          transition: all 0.3s cubic-bezier(0.16, 1, 0.3, 1);
        }
        .service-select-card:hover {
          background: var(--bg-card-hover);
          border-color: var(--border-yellow);
          transform: translateX(4px);
        }
        .service-select-card.active {
          background: var(--bg-card);
          border-color: var(--yellow-dark);
          box-shadow: var(--card-shadow-hover);
        }
        [data-theme="dark"] .service-select-card.active {
          border-color: var(--yellow);
        }
        .active-glow-indicator {
          position: absolute;
          left: 0;
          top: 0;
          width: 4px;
          height: 100%;
          background: var(--yellow);
          opacity: 0;
          transition: opacity 0.3s ease;
        }
        .service-select-card.active .active-glow-indicator {
          opacity: 1;
        }
        .thumb-frame {
          width: 72px;
          height: 72px;
          min-width: 72px;
          border-radius: 8px;
          overflow: hidden;
          border: 1px solid var(--border-medium);
        }
        .service-thumb-img {
          width: 100%;
          height: 100%;
          object-fit: cover;
          transition: transform 0.3s ease;
        }
        .service-select-card:hover .service-thumb-img {
          transform: scale(1.1);
        }
        .service-info-wrap {
          flex: 1;
          display: flex;
          flex-direction: column;
        }
        .title-row {
          display: flex;
          align-items: center;
          justify-content: space-between;
          gap: 8px;
          margin-bottom: 4px;
        }
        .service-card-name {
          font-size: 0.96rem;
          font-weight: 700;
          color: var(--text-primary);
          line-height: 1.2;
          margin: 0;
        }
        .service-card-name-mobile {
          display: none;
        }
        .service-card-name-desktop {
          display: inline;
        }
        .service-select-card.active .service-card-name {
          color: var(--yellow-dark);
        }
        [data-theme="dark"] .service-select-card.active .service-card-name {
          color: var(--yellow);
        }
        .service-tag-pill {
          font-family: var(--font-heading);
          font-size: 0.65rem;
          font-weight: 800;
          color: #060709;
          background: var(--yellow-accent);
          padding: 2px 6px;
          border-radius: 4px;
          letter-spacing: 0.5px;
        }
        .service-card-desc {
          font-size: 0.74rem;
          color: var(--text-secondary);
          line-height: 1.35;
          margin-bottom: 6px;
          display: -webkit-box;
          -webkit-line-clamp: 2;
          -webkit-box-orient: vertical;
          overflow: hidden;
        }
        .view-details-link {
          font-family: var(--font-heading);
          font-size: 0.68rem;
          font-weight: 700;
          color: var(--yellow-dark);
          letter-spacing: 0.5px;
        }
        [data-theme="dark"] .view-details-link {
          color: var(--yellow);
        }
        .services-right-col {
          display: flex;
        }
        .service-showcase-card {
          background: var(--bg-card);
          border: 1px solid var(--border-yellow);
          border-radius: 14px;
          overflow: hidden;
          display: flex;
          flex-direction: column;
          box-shadow: var(--card-shadow-hover);
          width: 100%;
        }
        .showcase-fade-in {
          animation: showcaseFadeIn 0.4s cubic-bezier(0.16, 1, 0.3, 1);
        }
        @keyframes showcaseFadeIn {
          from { opacity: 0; transform: translateX(30px) scale(0.98); }
          to { opacity: 1; transform: translateX(0) scale(1); }
        }
        .showcase-banner {
          position: relative;
          width: 100%;
          height: 290px;
          overflow: hidden;
        }
        .showcase-img {
          width: 100%;
          height: 100%;
          object-fit: cover;
          filter: brightness(0.85);
          transition: transform 0.6s ease;
        }
        .service-showcase-card:hover .showcase-img {
          transform: scale(1.03);
        }
        .showcase-gradient-overlay {
          position: absolute;
          top: 0;
          left: 0;
          width: 100%;
          height: 100%;
          background: linear-gradient(to top, rgba(14, 17, 23, 0.98) 0%, transparent 70%);
        }
        .showcase-header-overlay {
          position: absolute;
          bottom: 20px;
          left: 24px;
          right: 24px;
          display: flex;
          justify-content: space-between;
          align-items: flex-end;
        }
        .showcase-main-heading {
          font-size: 1.5rem;
          font-weight: 900;
          color: #FFFFFF;
          text-transform: uppercase;
          max-width: 480px;
          line-height: 1.15;
          margin: 0;
        }
        .price-tag-wrap {
          display: flex;
          flex-direction: column;
          align-items: flex-end;
          background: rgba(10, 12, 16, 0.8);
          border: 1px solid rgba(255, 230, 0, 0.4);
          padding: 6px 14px;
          border-radius: 8px;
        }
        .price-prefix {
          font-size: 0.65rem;
          font-weight: 700;
          color: var(--text-muted);
          letter-spacing: 1px;
        }
        .price-amount {
          font-family: var(--font-heading);
          font-size: 1.6rem;
          font-weight: 900;
          color: var(--yellow-accent);
          line-height: 1;
        }
        .showcase-features-grid {
          padding: 24px;
          display: grid;
          grid-template-columns: repeat(2, 1fr);
          gap: 18px;
          flex: 1;
        }
        .feature-tile {
          display: flex;
          align-items: flex-start;
          gap: 12px;
        }
        .feature-icon {
          font-size: 1.2rem;
          min-width: 28px;
          color: var(--yellow-dark);
        }
        [data-theme="dark"] .feature-icon {
          color: var(--yellow);
        }
        .feature-text {
          display: flex;
          flex-direction: column;
        }
        .feature-title {
          font-size: 0.88rem;
          color: var(--text-primary);
          margin-bottom: 2px;
        }
        .feature-desc {
          font-size: 0.74rem;
          color: var(--text-secondary);
          line-height: 1.4;
          margin: 0;
        }
        .showcase-bottom-bar {
          display: flex;
          justify-content: space-between;
          align-items: center;
          padding: 16px 24px;
          background: var(--bg-subtle);
          border-top: 1px solid var(--border-subtle);
        }
        .addon-note {
          display: flex;
          align-items: center;
          gap: 8px;
          font-size: 0.78rem;
          color: var(--yellow-dark);
          font-weight: 600;
        }
        [data-theme="dark"] .addon-note {
          color: var(--yellow);
        }
        .showcase-book-btn {
          padding: 11px 22px;
          font-size: 0.86rem;
        }
        .bookings-process-section {
          position: relative;
          padding: 100px 0;
          background: var(--bg-main);
          border-top: 1px solid var(--border-subtle);
          transition: background 0.3s ease;
        }
        .section-header-center {
          text-align: center;
          margin-bottom: 48px;
        }
        .center-title {
          font-size: clamp(2rem, 4.2vw, 3.2rem);
          font-weight: 900;
          color: var(--text-primary);
          text-transform: uppercase;
          margin-bottom: 8px;
        }
        .center-subtitle {
          font-size: 0.85rem;
          font-weight: 600;
          letter-spacing: 1.5px;
          color: var(--text-muted);
          margin: 0;
        }
        .process-cards-grid {
          display: grid;
          grid-template-columns: repeat(3, 1fr);
          gap: 24px;
          margin-bottom: 40px;
        }
        .process-card {
          position: relative;
          background: var(--bg-card);
          border: 1px solid var(--border-subtle);
          border-radius: 12px;
          padding: 32px 24px;
          box-shadow: var(--card-shadow);
          transition: all 0.3s ease;
        }
        .process-card:hover {
          background: var(--bg-card-hover);
          border-color: var(--border-yellow);
          box-shadow: var(--card-shadow-hover);
          transform: translateY(-4px);
        }
        .step-number-badge {
          font-family: var(--font-heading);
          font-size: 1rem;
          font-weight: 900;
          color: #060709;
          background: var(--yellow-accent);
          width: 38px;
          height: 38px;
          border-radius: 8px;
          display: flex;
          align-items: center;
          justify-content: center;
          margin-bottom: 20px;
          box-shadow: 0 0 15px rgba(255, 230, 0, 0.4);
        }
        .step-title {
          font-size: 1.15rem;
          font-weight: 700;
          color: var(--text-primary);
          margin: 0 0 10px 0;
        }
        .step-desc {
          font-size: 0.82rem;
          color: var(--text-secondary);
          line-height: 1.5;
          margin: 0;
        }
        .step-arrow-mark {
          position: absolute;
          top: 24px;
          right: 24px;
          font-size: 1.2rem;
          color: var(--text-muted);
          transition: color 0.3s ease, transform 0.3s ease;
        }
        .process-card:hover .step-arrow-mark {
          color: var(--yellow-dark);
          transform: translate(3px, -3px);
        }
        [data-theme="dark"] .process-card:hover .step-arrow-mark {
          color: var(--yellow);
        }
        .instant-booking-bar {
          display: grid;
          grid-template-columns: 1.2fr 1.2fr 1fr auto;
          gap: 16px;
          align-items: flex-end;
          background: var(--bg-card);
          border: 1px solid var(--border-yellow);
          border-radius: 12px;
          padding: 24px;
          box-shadow: var(--card-shadow);
        }
        .booking-field-group {
          display: flex;
          flex-direction: column;
          gap: 6px;
        }
        .bar-label {
          font-family: var(--font-heading);
          font-size: 0.7rem;
          font-weight: 700;
          color: var(--yellow-dark);
          letter-spacing: 1px;
        }
        [data-theme="dark"] .bar-label {
          color: var(--yellow);
        }
        .bar-input, .bar-select {
          background: var(--input-bg);
          border: 1px solid var(--input-border);
          border-radius: 6px;
          padding: 12px 14px;
          color: var(--input-text);
          font-size: 0.88rem;
          outline: none;
          transition: all 0.25s ease;
        }
        .bar-input:focus, .bar-select:focus {
          border-color: var(--yellow-dark);
          background: var(--bg-card);
        }
        [data-theme="dark"] .bar-input:focus, [data-theme="dark"] .bar-select:focus {
          border-color: var(--yellow);
        }
        .bar-select option {
          background: var(--bg-card);
          color: var(--text-primary);
        }
        .bar-submit-btn {
          padding: 13px 26px;
          font-size: 0.88rem;
          height: 48px;
        }
        .transformations-section {
          position: relative;
          padding: 100px 0 120px;
          background: var(--bg-subtle);
          border-top: 1px solid var(--border-subtle);
          transition: background 0.3s ease;
        }
        [data-theme="dark"] .transformations-section {
          background: linear-gradient(180deg, var(--bg-main) 0%, var(--bg-subtle) 60%, var(--bg-main) 100%);
        }
        .gallery-filter-tabs {
          display: flex;
          gap: 10px;
          flex-wrap: wrap;
        }
        .filter-tab-btn {
          font-family: var(--font-heading);
          font-size: 0.75rem;
          font-weight: 800;
          letter-spacing: 1px;
          color: var(--text-secondary);
          background: var(--bg-card);
          border: 1px solid var(--border-subtle);
          padding: 8px 16px;
          border-radius: 6px;
          box-shadow: var(--card-shadow);
          transition: all 0.25s ease;
        }
        .filter-tab-btn:hover, .filter-tab-btn.active {
          background: var(--yellow-accent);
          color: #060709;
          border-color: var(--yellow-dark);
          box-shadow: 0 0 15px rgba(255, 230, 0, 0.35);
        }
        .transformation-cards-grid {
          display: grid;
          grid-template-columns: repeat(4, 1fr);
          gap: 22px;
        }
        .transformation-card {
          background: var(--bg-card);
          border: 1px solid var(--border-subtle);
          border-radius: 12px;
          overflow: hidden;
          cursor: pointer;
          box-shadow: var(--card-shadow);
          transition: all 0.35s cubic-bezier(0.16, 1, 0.3, 1);
          display: flex;
          flex-direction: column;
        }
        .transformation-card:hover {
          transform: translateY(-8px);
          border-color: var(--border-yellow);
          box-shadow: var(--card-shadow-hover);
        }
        .trans-img-frame {
          position: relative;
          width: 100%;
          aspect-ratio: 16 / 10;
          overflow: hidden;
        }
        .trans-img {
          width: 100%;
          height: 100%;
          object-fit: cover;
          transition: transform 0.5s ease;
        }
        .transformation-card:hover .trans-img {
          transform: scale(1.08);
        }
        .trans-tag-badge {
          position: absolute;
          top: 12px;
          left: 12px;
          font-family: var(--font-heading);
          font-size: 0.65rem;
          font-weight: 800;
          color: #060709;
          background: var(--yellow-accent);
          padding: 3px 8px;
          border-radius: 4px;
          letter-spacing: 0.5px;
        }
        .trans-info {
          padding: 18px 16px;
          display: flex;
          flex-direction: column;
          flex: 1;
        }
        .trans-car-title {
          font-size: 1.05rem;
          font-weight: 700;
          color: var(--text-primary);
          margin: 0 0 4px 0;
        }
        .transformation-card:hover .trans-car-title {
          color: var(--yellow-dark);
        }
        [data-theme="dark"] .transformation-card:hover .trans-car-title {
          color: var(--yellow);
        }
        .trans-service-sub {
          font-size: 0.76rem;
          color: var(--text-secondary);
          margin: 0 0 14px 0;
          flex: 1;
        }
        .trans-card-footer {
          display: flex;
          justify-content: space-between;
          align-items: center;
          padding-top: 12px;
          border-top: 1px solid var(--border-subtle);
        }
        .trans-link-text {
          font-family: var(--font-heading);
          font-size: 0.72rem;
          font-weight: 700;
          color: var(--yellow-dark);
        }
        [data-theme="dark"] .trans-link-text {
          color: var(--yellow);
        }
        .trans-arrow {
          color: var(--yellow-dark);
          font-weight: 700;
          transition: transform 0.25s ease;
        }
        [data-theme="dark"] .trans-arrow {
          color: var(--yellow);
        }
        .transformation-card:hover .trans-arrow {
          transform: translate(3px, -3px);
        }
        .scroll-reveal-bottom {
          opacity: 0;
          transform: translateY(50px);
          transition: opacity 0.8s ease, transform 0.8s cubic-bezier(0.16, 1, 0.3, 1);
        }
        .scroll-reveal-bottom.in-view {
          opacity: 1;
          transform: translateY(0);
        }
        .scroll-reveal-right {
          opacity: 0;
          transform: translateX(60px);
          transition: opacity 0.8s ease, transform 0.8s cubic-bezier(0.16, 1, 0.3, 1);
        }
        .scroll-reveal-right.in-view {
          opacity: 1;
          transform: translateX(0);
        }
        .scroll-reveal-stagger {
          opacity: 0;
          transform: translateX(80px);
          transition: opacity 0.7s cubic-bezier(0.16, 1, 0.3, 1), transform 0.7s cubic-bezier(0.16, 1, 0.3, 1);
        }
        .scroll-reveal-stagger.in-view {
          opacity: 1;
          transform: translateX(0);
        }
        @media (max-width: 1100px) and (min-width: 769px) {
          .services-two-division-wrap {
            grid-template-columns: 340px 1fr;
            gap: 20px;
          }
          .instant-booking-bar {
            grid-template-columns: 1fr 1fr;
          }
          .transformation-cards-grid {
            grid-template-columns: repeat(2, 1fr);
          }
          .section-header-split {
            flex-direction: column;
            align-items: flex-start;
            gap: 16px;
          }
        }
        @media (max-width: 768px) {
          /* Mobile View: Full-width edge-to-edge video banner with zero side gaps.
             Video plays in the background, text/button/badges placed OVER the video with compact sizes. */
          .hero-sticky-scroll-container {
            position: relative !important;
            width: 100% !important;
            min-height: 82vh !important;
            height: auto !important;
            overflow: hidden !important;
            padding: 0 !important;
            margin: 0 !important;
            background: #000000 !important;
            display: flex !important;
            align-items: center !important;
            justify-content: center !important;
          }
          .hero-sticky-viewport {
            position: relative !important;
            top: auto !important;
            left: auto !important;
            width: 100% !important;
            min-height: 82vh !important;
            height: auto !important;
            display: flex !important;
            align-items: center !important;
            justify-content: center !important;
            overflow: hidden !important;
            padding: 0 !important;
            margin: 0 !important;
          }
          .hero-video-wrapper {
            position: absolute !important;
            inset: 0 !important;
            width: 100% !important;
            height: 100% !important;
            max-width: 100% !important;
            border-radius: 0 !important;
            border: none !important;
            margin: 0 !important;
            padding: 0 !important;
            box-shadow: none !important;
            overflow: hidden !important;
            background: #000000 !important;
          }
          .hero-video-element {
            width: 100% !important;
            height: 100% !important;
            object-fit: cover !important;
            object-position: center !important;
            display: block !important;
            transform: none !important;
          }
          .hero-video-dynamic-darken {
            display: block !important;
            position: absolute !important;
            inset: 0 !important;
            background: rgba(0, 0, 0, 0.52) !important;
            z-index: 2 !important;
            opacity: 1 !important;
            pointer-events: none !important;
          }
          .hero-video-overlay-top {
            display: block !important;
            position: absolute !important;
            top: 0 !important;
            left: 0 !important;
            width: 100% !important;
            height: 130px !important;
            background: linear-gradient(180deg, rgba(0, 0, 0, 0.75) 0%, transparent 100%) !important;
            pointer-events: none !important;
            z-index: 3 !important;
          }
          .hero-video-overlay-bottom {
            display: block !important;
            position: absolute !important;
            bottom: 0 !important;
            left: 0 !important;
            width: 100% !important;
            height: 130px !important;
            background: linear-gradient(0deg, var(--bg-main) 0%, rgba(0, 0, 0, 0.5) 45%, transparent 100%) !important;
            pointer-events: none !important;
            z-index: 3 !important;
          }
          .hero-video-overlay-content {
            position: relative !important;
            inset: auto !important;
            transform: none !important;
            opacity: 1 !important;
            pointer-events: auto !important;
            padding: 75px 16px 30px !important;
            width: 100% !important;
            display: flex !important;
            flex-direction: column !important;
            align-items: center !important;
            text-align: center !important;
            z-index: 10 !important;
          }
          .hero-overlay-inner {
            width: 100% !important;
            display: flex !important;
            flex-direction: column !important;
            align-items: center !important;
            max-width: 420px !important;
            margin: 0 auto !important;
          }
          .hero-text-container {
            margin-bottom: 12px !important;
            width: 100% !important;
          }
          /* Reduced text sizes for mobile view */
          .hero-main-title {
            font-size: clamp(1.22rem, 5.2vw, 1.48rem) !important;
            font-weight: 900 !important;
            line-height: 1.16 !important;
            color: #FFFFFF !important;
            text-shadow: 0 2px 14px rgba(0, 0, 0, 0.85) !important;
            margin-bottom: 8px !important;
            letter-spacing: 0.3px !important;
            text-transform: uppercase !important;
          }
          .highlight-yellow {
            color: var(--yellow) !important;
            text-shadow: 0 0 20px rgba(255, 230, 0, 0.6) !important;
          }
          .hero-subtext {
            font-size: clamp(0.68rem, 2.7vw, 0.76rem) !important;
            color: rgba(255, 255, 255, 0.9) !important;
            text-shadow: 0 1px 8px rgba(0, 0, 0, 0.85) !important;
            margin-bottom: 18px !important;
            line-height: 1.42 !important;
            max-width: 320px !important;
          }
          .hero-action-buttons {
            margin-bottom: 18px !important;
            width: 100% !important;
            display: flex !important;
            justify-content: center !important;
          }
          .hero-action-buttons .btn-automotive-cta {
            width: auto !important;
            min-width: 200px !important;
            max-width: 260px !important;
            justify-content: center !important;
            padding: 9px 22px !important;
            font-size: 0.78rem !important;
            font-weight: 800 !important;
            letter-spacing: 0.5px !important;
            box-shadow: 0 4px 18px rgba(234, 179, 8, 0.45) !important;
          }
          /* 3 Badges compact row over the video */
          .hero-trust-badges {
            display: grid !important;
            grid-template-columns: repeat(3, 1fr) !important;
            gap: 6px !important;
            max-width: 360px !important;
            width: 100% !important;
            margin: 0 auto !important;
          }
          .trust-badge-item {
            display: flex !important;
            flex-direction: column !important;
            align-items: center !important;
            text-align: center !important;
            background: rgba(10, 14, 20, 0.78) !important;
            backdrop-filter: blur(12px) !important;
            -webkit-backdrop-filter: blur(12px) !important;
            border: 1px solid rgba(255, 230, 0, 0.28) !important;
            padding: 8px 4px !important;
            border-radius: 8px !important;
            gap: 4px !important;
            box-shadow: 0 4px 14px rgba(0, 0, 0, 0.5) !important;
          }
          .trust-badge-item .badge-ico {
            font-size: 1.1rem !important;
            margin: 0 !important;
          }
          .trust-badge-item .badge-text-block {
            display: flex !important;
            flex-direction: column !important;
            align-items: center !important;
          }
          .trust-badge-item .badge-text-block strong {
            color: #FFFFFF !important;
            font-size: 0.62rem !important;
            font-family: var(--font-heading) !important;
            line-height: 1.1 !important;
            white-space: nowrap !important;
          }
          .trust-badge-item .badge-text-block span {
            color: rgba(255, 255, 255, 0.75) !important;
            font-size: 0.52rem !important;
            line-height: 1.1 !important;
            white-space: nowrap !important;
          }

          .section-header-split {
            flex-direction: column;
            align-items: flex-start;
            gap: 12px;
            margin-bottom: 24px;
          }
          .split-title {
            font-size: clamp(1.5rem, 5.5vw, 1.9rem);
          }
          .split-subtitle {
            font-size: 0.85rem;
          }
          .services-showcase-section {
            padding: 40px 0 60px;
            scroll-margin-top: 72px;
          }
          .services-showcase-section .container {
            padding: 0 12px;
          }
          .services-two-division-wrap {
            grid-template-columns: 84px 1fr;
            gap: 12px;
            align-items: flex-start;
          }
          .services-left-col {
            position: relative;
            top: 0;
            display: flex;
            flex-direction: column;
            gap: 8px;
            flex-shrink: 0;
            width: 84px;
            margin: 0;
            padding: 0;
          }
          .services-scroll-track.fit-all {
            display: flex;
            flex-direction: column;
            gap: 8px;
            max-height: none;
            overflow-y: visible;
            padding: 0;
            margin: 0;
          }
          .services-scroll-track.scrollable {
            display: flex;
            flex-direction: column;
            gap: 8px;
            max-height: 460px;
            overflow-y: auto;
            scroll-behavior: smooth;
            padding: 0;
            margin: 0;
            scrollbar-width: thin;
            scrollbar-color: var(--yellow) transparent;
          }
          .services-scroll-controls {
            margin-top: 4px;
            width: 100%;
          }
          .services-view-more-btn {
            padding: 6px 4px;
            border-radius: 8px;
            font-size: 0.6rem;
            flex-direction: column;
            gap: 2px;
            text-align: center;
          }
          .services-view-more-btn .btn-text {
            font-size: 0.58rem;
            line-height: 1.1;
          }
          .services-view-more-btn .btn-arrow {
            font-size: 0.72rem;
          }
          .service-select-card {
            flex-direction: column;
            align-items: center;
            justify-content: center;
            text-align: center;
            padding: 8px 4px 7px;
            gap: 4px;
            border-radius: 10px;
            border-width: 1.5px;
            min-height: 82px;
            box-sizing: border-box;
            width: 100%;
            position: relative;
            margin: 0;
          }
          .service-select-card:hover {
            transform: none;
          }
          .thumb-frame {
            width: 44px;
            height: 44px;
            min-width: 44px;
            border-radius: 8px;
          }
          .service-info-wrap {
            width: 100%;
            display: flex;
            flex-direction: column;
            align-items: center;
            gap: 2px;
          }
          .title-row {
            flex-direction: column;
            align-items: center;
            gap: 2px;
            margin-bottom: 0;
            width: 100%;
          }
          .service-card-name-desktop {
            display: none;
          }
          .service-card-name-mobile {
            display: block;
            font-size: 0.62rem;
            font-weight: 700;
            line-height: 1.15;
            text-align: center;
            color: var(--text-primary);
            white-space: nowrap;
            overflow: hidden;
            text-overflow: ellipsis;
            max-width: 76px;
          }
          .service-select-card.active .service-card-name-mobile {
            color: var(--yellow-dark);
          }
          [data-theme="dark"] .service-select-card.active .service-card-name-mobile {
            color: var(--yellow);
          }
          .service-tag-pill {
            font-size: 0.48rem;
            padding: 1px 5px;
            letter-spacing: 0.3px;
            border-radius: 3px;
            line-height: 1.2;
          }
          .service-card-desc {
            display: none;
          }
          .view-details-link {
            display: none;
          }
          .active-glow-indicator {
            display: none;
          }
          .service-select-card.active {
            border-color: var(--yellow-dark);
            background: rgba(234, 179, 8, 0.12);
            box-shadow: 0 0 10px rgba(234, 179, 8, 0.25);
          }
          [data-theme="dark"] .service-select-card.active {
            border-color: var(--yellow);
            background: rgba(255, 230, 0, 0.14);
            box-shadow: 0 0 10px rgba(255, 230, 0, 0.3);
          }
          .services-right-col {
            min-width: 0;
            width: 100%;
            margin: 0;
            padding: 0;
          }
          .service-showcase-card {
            border-radius: 12px;
            width: 100%;
            margin: 0;
            border: 1.5px solid var(--border-yellow);
          }
          .showcase-banner {
            height: 180px;
          }
          .showcase-header-overlay {
            bottom: 12px;
            left: 12px;
            right: 12px;
            flex-direction: column;
            align-items: flex-start;
            gap: 6px;
          }
          .showcase-main-heading {
            font-size: 1.05rem;
            line-height: 1.2;
          }
          .price-tag-wrap {
            padding: 3px 8px;
            border-radius: 6px;
            flex-direction: row;
            align-items: baseline;
            gap: 5px;
          }
          .price-prefix {
            font-size: 0.55rem;
          }
          .price-amount {
            font-size: 1.15rem;
          }
          .showcase-features-grid {
            padding: 12px 10px;
            grid-template-columns: 1fr;
            gap: 10px;
          }
          .feature-tile {
            gap: 8px;
            align-items: flex-start;
          }
          .feature-icon {
            font-size: 1rem;
            min-width: 18px;
            margin-top: 1px;
          }
          .feature-title {
            font-size: 0.8rem;
          }
          .feature-desc {
            font-size: 0.7rem;
            line-height: 1.35;
          }
          .showcase-bottom-bar {
            padding: 12px;
            flex-direction: column;
            align-items: stretch;
            gap: 10px;
          }
          .addon-note {
            font-size: 0.7rem;
            line-height: 1.3;
          }
          .showcase-book-btn {
            width: 100%;
            justify-content: center;
            padding: 10px 14px;
            font-size: 0.82rem;
          }
          .process-cards-grid {
            grid-template-columns: 1fr;
          }
          .instant-booking-bar {
            grid-template-columns: 1fr;
          }
          .transformation-cards-grid {
            grid-template-columns: 1fr;
          }
          .hero-trust-badges {
            grid-template-columns: 1fr;
          }
        }
        @media (max-width: 360px) {
          .services-two-division-wrap {
            grid-template-columns: 68px 1fr;
            gap: 6px;
          }
          .thumb-frame {
            width: 38px;
            height: 38px;
            min-width: 38px;
          }
          .service-card-name-mobile {
            font-size: 0.56rem;
          }
          .showcase-banner {
            height: 155px;
          }
        }
      `}</style>

      <div className="home-page-container">
        {/* ====================================================================
            HERO PINNED SCROLL SECTION:
            - Full-Screen Video loops in background
            - Pure video on load (no bottom button, no scrollbar, no car image)
            - On mouse scroll: Marked text, Book button & 3 boxes slowly glide UP onto the video!
            ==================================================================== */}
        <section id="home" className="hero-sticky-scroll-container">
          <div className="hero-sticky-viewport">
            {/* Background Video Layer */}
            <div className="hero-video-wrapper">
              <video
                ref={videoRef}
                className="hero-video-element"
                autoPlay
                loop
                muted
                playsInline
                disablePictureInPicture
                preload="auto"
              >
                <source src={heroBannerVideo} type="video/mp4" />
                <source src="/hero_banner.mp4" type="video/mp4" />
                Your browser does not support high quality video playback.
              </video>

              {/* Dynamic dark overlay that intensifies on reveal */}
              <div 
                className={`hero-video-dynamic-darken ${isHeroRevealed ? 'revealed' : ''}`}
              />
              <div className="hero-video-overlay-top" />
              <div className="hero-video-overlay-bottom" />
            </div>

            {/* Overlaid Content Layer: Glides slowly UP over playing video on mouse scroll (Desktop) / Normal Flow (Mobile) */}
            <div 
              className={`hero-video-overlay-content ${isHeroRevealed || isMobile ? 'revealed' : ''}`}
            >
              <div className="hero-overlay-inner">
                {/* Marked Headline & Subtitle */}
                <div className="hero-text-container">
                  <h1 className="hero-main-title">
                    PRECISION CAR CARE & <span className="highlight-yellow">LUXURY DETAILING</span>
                  </h1>

                  <p className="hero-subtext">
                    Automotive aesthetics perfected through science, passion, and precision. Where cutting-edge ceramic chemistry meets master craftsmanship.
                  </p>
                </div>

                {/* Book Appointment CTA Button */}
                <div className="hero-action-buttons">
                  <button 
                    className="btn-automotive-cta"
                    onClick={() => onOpenBooking()}
                  >
                    <span>BOOK APPOINTMENT</span>
                    <span>→</span>
                  </button>
                </div>

                {/* 3 Trust Badges Below Button */}
                <div className="hero-trust-badges">
                  <div className="trust-badge-item">
                    <span className="badge-ico"><ShieldCheckIcon size={20} color="var(--yellow)" /></span>
                    <div className="badge-text-block">
                      <strong>9H Ceramic</strong>
                      <span>Multi-Year Protection</span>
                    </div>
                  </div>

                  <div className="trust-badge-item">
                    <span className="badge-ico"><StarSealIcon size={20} color="var(--yellow)" /></span>
                    <div className="badge-text-block">
                      <strong>100% Quality</strong>
                      <span>Guaranteed Satisfaction</span>
                    </div>
                  </div>

                  <div className="trust-badge-item">
                    <span className="badge-ico"><MasterTechIcon size={20} color="var(--yellow)" /></span>
                    <div className="badge-text-block">
                      <strong>Precision Pros</strong>
                      <span>Certified Master Detailers</span>
                    </div>
                  </div>
                </div>
              </div>
            </div>
          </div>
        </section>

        {/* ====================================================================
            2. OUR SERVICES (2 Divisions Layout & Right-to-Left Animation)
            ==================================================================== */}
        <section id="services" className="services-showcase-section">
          <div className="container">
            <div className="section-header-split scroll-reveal-right">
              <div>
                <span className="sub-label">OUR SERVICES</span>
                <h2 className="split-title">
                  EXPERT SOLUTIONS FOR <span className="highlight-yellow">EVERY CURVE & SURFACE</span>
                </h2>
              </div>
              <div>
                <p className="split-subtitle">
                  Tailor-engineered formulas, meticulous calibration, and dedicated master bays for every vehicle.
                </p>
              </div>
            </div>

            <div className="services-two-division-wrap scroll-reveal-bottom">
              {/* Left Division: Selectable Service Cards (All 5 visible cleanly, scroll enabled only if > 5 services) */}
              <div className="services-left-col">
                <div 
                  ref={servicesTrackRef}
                  className={`services-scroll-track ${dynamicServices.length > 5 ? 'scrollable' : 'fit-all'}`}
                  onScroll={(e) => {
                    const el = e.currentTarget;
                    setIsServicesScrolledDown(el.scrollTop > 30);
                  }}
                >
                  {dynamicServices.map((service) => (
                    <div
                      key={service.id}
                      className={`service-select-card ${activeService.id === service.id ? 'active' : ''}`}
                      onClick={() => setActiveServiceId(service.id)}
                    >
                      <div className="thumb-frame">
                        <img 
                          src={resolveServiceImage(service.thumbnail, detailAfterImg)} 
                          alt={service.name} 
                          className="service-thumb-img" 
                          onError={(e) => {
                            (e.target as HTMLImageElement).src = detailAfterImg;
                          }}
                        />
                      </div>
                      <div className="service-info-wrap">
                        <div className="title-row">
                          <h4 className="service-card-name">
                            <span className="service-card-name-desktop">{service.name}</span>
                            <span className="service-card-name-mobile">{service.shortName}</span>
                          </h4>
                          <span className="service-tag-pill">{service.tag}</span>
                        </div>
                        <p className="service-card-desc">{service.shortDesc}</p>
                        <span className="view-details-link">
                          {activeService.id === service.id ? '● ACTIVE SHOWCASE' : 'SELECT TO INSPECT →'}
                        </span>
                      </div>
                      <div className="active-glow-indicator"></div>
                    </div>
                  ))}
                </div>

                {/* Show scroll controls only if more than 5 services exist */}
                {dynamicServices.length > 5 && (
                  <div className="services-scroll-controls">
                    {!isServicesScrolledDown ? (
                      <button
                        type="button"
                        className="services-view-more-btn"
                        onClick={() => handleScrollServices('down')}
                        aria-label="View more services"
                      >
                        <span className="btn-text">VIEW MORE ({dynamicServices.length - 5}+)</span>
                        <span className="btn-arrow">↓</span>
                      </button>
                    ) : (
                      <button
                        type="button"
                        className="services-view-more-btn up"
                        onClick={() => {
                          if (servicesTrackRef.current) {
                            servicesTrackRef.current.scrollTo({ top: 0, behavior: 'smooth' });
                          }
                        }}
                        aria-label="Scroll back to top of services"
                      >
                        <span className="btn-text">SCROLL TO TOP</span>
                        <span className="btn-arrow">↑</span>
                      </button>
                    )}
                  </div>
                )}
              </div>

              {/* Right Division: Animated Detailed Showcase Card (NO PRICE/AMOUNT) */}
              <div className="services-right-col">
                <div 
                  key={activeService.id} 
                  className="service-showcase-card showcase-fade-in"
                >
                  <div className="showcase-banner">
                    <img 
                      src={resolveServiceImage(activeService.showcaseImg, technicianImg)} 
                      alt={activeService.showcaseTitle} 
                      className="showcase-img" 
                      onError={(e) => {
                        (e.target as HTMLImageElement).src = technicianImg;
                      }}
                    />
                    <div className="showcase-gradient-overlay"></div>
                    <div className="showcase-header-overlay">
                      <h3 className="showcase-main-heading">{activeService.showcaseTitle}</h3>
                    </div>
                  </div>

                  <div className="showcase-features-grid">
                    {activeService.features.map((feat, index) => (
                      <div key={index} className="feature-tile">
                        <span className="feature-icon">{getFeatureIcon(index)}</span>
                        <div className="feature-text">
                          <strong className="feature-title">{feat.title}</strong>
                          <p className="feature-desc">{feat.desc}</p>
                        </div>
                      </div>
                    ))}
                  </div>

                  <div className="showcase-bottom-bar">
                    <div className="addon-note">
                      <span>✓</span>
                      <span>{activeService.addon}</span>
                    </div>
                    <button 
                      className="btn-automotive-cta showcase-book-btn"
                      onClick={() => onOpenBooking(activeService.name)}
                    >
                      <span>BOOK THIS SERVICE</span>
                      <span>→</span>
                    </button>
                  </div>
                </div>
              </div>
            </div>
          </div>
        </section>

        {/* ====================================================================
            3. HOW IT WORKS / EASY SERVICE BOOKINGS
            ==================================================================== */}
        <section id="how-it-works" className="bookings-process-section">
          <div className="container">
            <div className="section-header-center scroll-reveal-bottom">
              <span className="sub-label">HOW IT WORKS</span>
              <h2 className="center-title">EASY SERVICE BOOKINGS</h2>
              <p className="center-subtitle">
                RESERVE YOUR EXPERT DETAILING IN 3 SIMPLE STEPS WITHOUT HASSLE.
              </p>
            </div>

            <div className="process-cards-grid scroll-reveal-bottom">
              <div className="process-card">
                <div className="step-number-badge">01</div>
                <h4 className="step-title">Choose Your Treatment</h4>
                <p className="step-desc">
                  Browse bespoke ceramic, paint correction, interior spa, or PPF treatments tailored for your paint condition.
                </p>
                <div className="step-arrow-mark">↗</div>
              </div>

              <div className="process-card">
                <div className="step-number-badge">02</div>
                <h4 className="step-title">Select Date & Time Slot</h4>
                <p className="step-desc">
                  Pick your preferred arrival time or request our enclosed white-glove doorstep vehicle collection.
                </p>
                <div className="step-arrow-mark">↗</div>
              </div>

              <div className="process-card">
                <div className="step-number-badge">03</div>
                <h4 className="step-title">Drive Away In Perfection</h4>
                <p className="step-desc">
                  Enjoy precision delivery with warranty certification, digital inspection report, and aftercare maintenance kit.
                </p>
                <div className="step-arrow-mark">↗</div>
              </div>
            </div>

            {onNavigate && (
              <div style={{ textAlign: 'center', marginBottom: '32px' }}>
                <button
                  type="button"
                  className="btn-ghost"
                  onClick={() => onNavigate('how-it-works')}
                  style={{ fontSize: '0.86rem', padding: '10px 22px' }}
                >
                  <span>EXPLORE FULL 4-STEP PROCESS & STANDARDS →</span>
                </button>
              </div>
            )}

            {/* Integrated Instant Booking Bar */}
            <form 
              onSubmit={handleQuickBookingSubmit} 
              className="instant-booking-bar scroll-reveal-bottom"
            >
              <div className="booking-field-group">
                <label className="bar-label">VEHICLE MODEL / TYPE</label>
                <input 
                  type="text" 
                  className="bar-input" 
                  placeholder="e.g. Porsche 911 / BMW M4"
                  value={quickModel}
                  onChange={(e) => setQuickModel(e.target.value)}
                  required
                />
              </div>

              <div className="booking-field-group">
                <label className="bar-label">SELECT DETAILING SERVICE</label>
                <select 
                  className="bar-select"
                  value={quickService}
                  onChange={(e) => setQuickService(e.target.value)}
                >
                  {dynamicServices.map((s) => (
                    <option key={s.id} value={s.name}>{s.name}</option>
                  ))}
                </select>
              </div>

              <div className="booking-field-group">
                <label className="bar-label">PREFERRED DATE</label>
                <input 
                  type="date" 
                  className="bar-input" 
                  value={quickDate}
                  onChange={(e) => setQuickDate(e.target.value)}
                  required
                />
              </div>

              <button type="submit" className="btn-automotive-cta bar-submit-btn">
                <span>SCHEDULE SERVICE →</span>
              </button>
            </form>
          </div>
        </section>

        {/* ====================================================================
            4. RECENT TRANSFORMATION / OUR WORKS
            ==================================================================== */}
        <section id="transformations" className="transformations-section">
          <div className="container">
            <div className="section-header-split scroll-reveal-right">
              <div>
                <span className="sub-label">RECENT TRANSFORMATION</span>
                <h2 className="split-title">
                  OUR WORKS & <span className="highlight-yellow">SHOWROOM DELIVERY</span>
                </h2>
              </div>
            </div>

            <div className="transformation-cards-grid">
              {dynamicWorks.map((item, index) => (
                <div 
                  key={item.id} 
                  className="transformation-card scroll-reveal-stagger"
                  style={{
                    animationDelay: `${index * 0.18}s`,
                    transitionDelay: `${index * 0.18}s`,
                    cursor: 'pointer'
                  }}
                  onClick={() => setSelectedGalleryWork(item)}
                >
                  <div className="trans-img-frame">
                    <img 
                      src={item.afterImg || item.img} 
                      alt={item.title} 
                      className="trans-img" 
                      onError={(e) => {
                        (e.target as HTMLImageElement).src = heroCarImg;
                      }}
                    />
                    <span className="trans-tag-badge">{item.category}</span>
                  </div>
                  <div className="trans-info">
                    <h4 className="trans-car-title">{item.title}</h4>
                    <p className="trans-service-sub">{item.service}</p>
                    <div className="trans-card-footer">
                      <span className="trans-link-text">View Before / After Gallery</span>
                      <span className="trans-arrow">↗</span>
                    </div>
                  </div>
                </div>
              ))}
            </div>

            {onNavigate && (
              <div style={{ textAlign: 'center', marginTop: '36px' }}>
                <button
                  type="button"
                  className="btn-automotive-cta"
                  onClick={() => onNavigate('recent-works')}
                  style={{ fontSize: '0.88rem', padding: '12px 28px' }}
                >
                  <span>VIEW FULL TRANSFORMATION PORTFOLIO →</span>
                </button>
              </div>
            )}
          </div>
        </section>
      </div>

      {/* Before / After Comparison Modal */}
      {selectedGalleryWork && (
        <BeforeAfterModal
          work={selectedGalleryWork}
          onClose={() => setSelectedGalleryWork(null)}
          onOpenBooking={onOpenBooking}
        />
      )}
    </>
  );
};
