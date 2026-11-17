import React from 'react';
import {
  DiamondIcon,
  ClockIcon,
  MasterTechIcon,
  StarSealIcon,
  ShieldCheckIcon,
  CleanStudioIcon,
  ChemistryFlaskIcon,
  SearchGaugeIcon
} from '../components/Icons';

interface HowItWorksProps {
  onOpenBooking: (serviceName?: string) => void;
}

export const HowItWorks: React.FC<HowItWorksProps> = ({ onOpenBooking }) => {
  const steps = [
    {
      number: '01',
      title: 'Choose Your Detailing Treatment',
      desc: 'Browse our specialized treatments including Ceramic & Graphene Coating, Self-Healing PPF Armor, Precision Paint Correction, or Interior Spa tailored to your paint condition.',
      icon: <DiamondIcon size={26} />,
      highlight: 'Upfront Transparent Pricing',
    },
    {
      number: '02',
      title: 'Schedule Date & Studio Bay',
      desc: 'Pick your preferred date and time slot. Choose between our complimentary covered flatbed transport or personal studio drop-off at your convenience.',
      icon: <ClockIcon size={26} />,
      highlight: 'Dedicated Master Bay Reserved',
    },
    {
      number: '03',
      title: 'Master Artisan Detailing',
      desc: 'Your vehicle enters our climate-controlled, dust-filtered clean room. Our certified technicians execute multi-stage decontamination, paint depth calibration, and precision application.',
      icon: <MasterTechIcon size={26} />,
      highlight: 'Live WhatsApp Photo/Video Updates',
    },
    {
      number: '04',
      title: 'Inspection & Showroom Delivery',
      desc: 'We perform a final 100-point inspection under specialized CRI LED lighting arrays. Official logged warranty certificate issued along with a personalized maintenance guide.',
      icon: <StarSealIcon size={26} />,
      highlight: 'Guaranteed 100% Swirl-Free Finish',
    },
  ];

  const standards = [
    { icon: <ShieldCheckIcon size={26} />, title: '5 to 10-Year Warranty', desc: 'Officially logged warranty coverage with nationwide gloss & hydrophobic retention guarantee.' },
    { icon: <CleanStudioIcon size={26} />, title: 'Climate-Controlled Bays', desc: 'Air-conditioned, dust-filtered clean rooms ensuring optical contamination-free cures.' },
    { icon: <ChemistryFlaskIcon size={26} />, title: 'pH-Neutral Chemistry', desc: '100% paint-safe biodegradable compounds preserving factory clear coats.' },
    { icon: <SearchGaugeIcon size={26} />, title: 'Micrometer Depth Gauging', desc: 'Ultrasonic clear coat measurement ensuring total structural paintwork integrity.' },
  ];

  return (
    <>
      <style>{`
        .hiw-page {
          padding-top: 110px;
          padding-bottom: 80px;
          background: var(--bg-main);
          min-height: 100vh;
          transition: background 0.3s ease;
        }
        .hiw-header {
          text-align: center;
          max-width: 800px;
          margin: 0 auto 50px;
          padding: 0 16px;
        }
        .hiw-pill {
          display: inline-flex;
          align-items: center;
          gap: 8px;
          background: rgba(234, 179, 8, 0.1);
          border: 1px solid rgba(234, 179, 8, 0.35);
          color: var(--yellow-dark);
          font-family: var(--font-heading);
          font-size: 0.78rem;
          font-weight: 700;
          letter-spacing: 2px;
          padding: 6px 18px;
          border-radius: 999px;
          margin-bottom: 16px;
          text-transform: uppercase;
        }
        [data-theme="dark"] .hiw-pill {
          background: rgba(255, 230, 0, 0.08);
          border-color: rgba(255, 230, 0, 0.35);
          color: var(--yellow);
        }
        .hiw-title {
          font-size: clamp(2rem, 4.5vw, 3.2rem);
          font-weight: 900;
          line-height: 1.15;
          color: var(--text-primary);
          text-transform: uppercase;
          margin-bottom: 14px;
        }
        .hiw-subtitle {
          font-size: clamp(0.95rem, 1.8vw, 1.1rem);
          color: var(--text-secondary);
          line-height: 1.6;
        }
        .hiw-steps-grid {
          display: grid;
          grid-template-columns: repeat(2, 1fr);
          gap: 24px;
          margin-bottom: 60px;
        }
        .hiw-step-card {
          background: var(--bg-card);
          border: 1px solid var(--border-subtle);
          border-radius: 14px;
          padding: 32px 28px;
          box-shadow: var(--card-shadow);
          transition: all 0.3s cubic-bezier(0.16, 1, 0.3, 1);
          position: relative;
          overflow: hidden;
          display: flex;
          flex-direction: column;
        }
        .hiw-step-card:hover {
          border-color: var(--border-yellow);
          transform: translateY(-4px);
          box-shadow: var(--card-shadow-hover);
        }
        .hiw-card-top {
          display: flex;
          justify-content: space-between;
          align-items: center;
          margin-bottom: 20px;
        }
        .hiw-step-num {
          font-family: var(--font-heading);
          font-size: 2.2rem;
          font-weight: 900;
          color: var(--yellow-dark);
          line-height: 1;
        }
        [data-theme="dark"] .hiw-step-num {
          color: var(--yellow);
        }
        .hiw-step-ico {
          font-size: 2rem;
          width: 50px;
          height: 50px;
          display: flex;
          align-items: center;
          justify-content: center;
          background: rgba(234, 179, 8, 0.08);
          border: 1px solid rgba(234, 179, 8, 0.2);
          border-radius: 10px;
        }
        [data-theme="dark"] .hiw-step-ico {
          background: rgba(255, 230, 0, 0.08);
          border-color: rgba(255, 230, 0, 0.25);
        }
        .hiw-step-name {
          font-size: 1.25rem;
          font-weight: 800;
          color: var(--text-primary);
          margin-bottom: 12px;
          line-height: 1.3;
        }
        .hiw-step-desc {
          font-size: 0.92rem;
          color: var(--text-secondary);
          line-height: 1.6;
          margin-bottom: 20px;
          flex: 1;
        }
        .hiw-step-highlight {
          display: inline-flex;
          align-items: center;
          gap: 6px;
          font-size: 0.8rem;
          font-weight: 700;
          color: var(--yellow-dark);
          background: rgba(234, 179, 8, 0.08);
          padding: 6px 12px;
          border-radius: 6px;
          width: fit-content;
        }
        [data-theme="dark"] .hiw-step-highlight {
          color: var(--yellow);
          background: rgba(255, 230, 0, 0.08);
        }
        .hiw-standards-section {
          background: var(--bg-subtle);
          border: 1px solid var(--border-subtle);
          border-radius: 16px;
          padding: 44px 36px;
          margin-bottom: 60px;
        }
        .hiw-standards-title {
          text-align: center;
          font-size: 1.6rem;
          font-weight: 800;
          color: var(--text-primary);
          text-transform: uppercase;
          margin-bottom: 32px;
        }
        .hiw-standards-grid {
          display: grid;
          grid-template-columns: repeat(4, 1fr);
          gap: 20px;
        }
        .hiw-std-item {
          display: flex;
          flex-direction: column;
          align-items: center;
          text-align: center;
          gap: 10px;
        }
        .hiw-std-ico {
          font-size: 1.8rem;
          margin-bottom: 4px;
        }
        .hiw-std-title {
          font-size: 0.95rem;
          font-weight: 700;
          color: var(--text-primary);
          margin: 0;
        }
        .hiw-std-desc {
          font-size: 0.78rem;
          color: var(--text-secondary);
          line-height: 1.45;
          margin: 0;
        }
        .hiw-cta-box {
          background: var(--bg-card);
          border: 1px solid var(--border-yellow);
          border-radius: 16px;
          padding: 40px 32px;
          text-align: center;
          box-shadow: var(--card-shadow);
          display: flex;
          flex-direction: column;
          align-items: center;
          gap: 20px;
        }
        .hiw-cta-title {
          font-size: clamp(1.4rem, 3vw, 2rem);
          font-weight: 900;
          color: var(--text-primary);
          text-transform: uppercase;
          margin: 0;
        }
        .hiw-cta-text {
          font-size: 0.95rem;
          color: var(--text-secondary);
          max-width: 600px;
          margin: 0;
        }
        @media (max-width: 900px) {
          .hiw-steps-grid {
            grid-template-columns: 1fr;
          }
          .hiw-standards-grid {
            grid-template-columns: repeat(2, 1fr);
          }
        }
        @media (max-width: 600px) {
          .hiw-page {
            padding-top: 95px;
          }
          .hiw-step-card {
            padding: 24px 20px;
          }
          .hiw-standards-grid {
            grid-template-columns: 1fr;
          }
          .hiw-standards-section {
            padding: 28px 20px;
          }
        }
      `}</style>

      <div className="hiw-page">
        <div className="container">
          {/* Header */}
          <div className="hiw-header">
            <span className="hiw-pill">HOW IT WORKS</span>
            <h1 className="hiw-title">
              SIMPLE 4-STEP <span className="highlight-yellow">DETAILING PROCESS</span>
            </h1>
            <p className="hiw-subtitle">
              From reservation to final showroom reveal, discover how our master technicians care for your vehicle with unmatched precision and transparency.
            </p>
          </div>

          {/* 4 Steps */}
          <div className="hiw-steps-grid">
            {steps.map((s) => (
              <div key={s.number} className="hiw-step-card">
                <div className="hiw-card-top">
                  <span className="hiw-step-num">{s.number}</span>
                  <div className="hiw-step-ico">{s.icon}</div>
                </div>
                <h3 className="hiw-step-name">{s.title}</h3>
                <p className="hiw-step-desc">{s.desc}</p>
                <div className="hiw-step-highlight">
                  <span>✓</span>
                  <span>{s.highlight}</span>
                </div>
              </div>
            ))}
          </div>

          {/* Standards */}
          <div className="hiw-standards-section">
            <h2 className="hiw-standards-title">THE CAR CARE STANDARD</h2>
            <div className="hiw-standards-grid">
              {standards.map((st, i) => (
                <div key={i} className="hiw-std-item">
                  <div className="hiw-std-ico">{st.icon}</div>
                  <h4 className="hiw-std-title">{st.title}</h4>
                  <p className="hiw-std-desc">{st.desc}</p>
                </div>
              ))}
            </div>
          </div>

          {/* CTA Box */}
          <div className="hiw-cta-box">
            <h2 className="hiw-cta-title">READY TO EXPERIENCE SHOWROOM PERFECTION?</h2>
            <p className="hiw-cta-text">
              Book your slot today or contact our detailing advisors to customize a treatment suited for your vehicle.
            </p>
            <button className="btn-automotive-cta" onClick={() => onOpenBooking()}>
              <span>BOOK AN APPOINTMENT</span>
              <span>→</span>
            </button>
          </div>
        </div>
      </div>
    </>
  );
};
