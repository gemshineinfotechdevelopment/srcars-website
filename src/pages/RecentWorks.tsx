import React, { useState } from 'react';
import { useWorksList, type WorkItem } from '../utils/worksStore';
import { BeforeAfterModal } from '../components/BeforeAfterModal';

interface RecentWorksProps {
  onOpenBooking: (serviceName?: string) => void;
}

export const RecentWorks: React.FC<RecentWorksProps> = ({ onOpenBooking }) => {
  const portfolioData = useWorksList();
  const [activeFilter, setActiveFilter] = useState<string>('ALL');
  const [selectedGalleryWork, setSelectedGalleryWork] = useState<WorkItem | null>(null);

  const filteredWorks = portfolioData.filter((item) => {
    if (activeFilter === 'ALL') return true;
    return item.category?.toUpperCase() === activeFilter.toUpperCase();
  });

  return (
    <>
      <style>{`
        .rw-page {
          padding-top: 110px;
          padding-bottom: 80px;
          background: var(--bg-main);
          min-height: 100vh;
          transition: background 0.3s ease;
        }
        .rw-header {
          text-align: center;
          max-width: 820px;
          margin: 0 auto 44px;
          padding: 0 16px;
        }
        .rw-pill {
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
        [data-theme="dark"] .rw-pill {
          background: rgba(255, 230, 0, 0.08);
          border-color: rgba(255, 230, 0, 0.35);
          color: var(--yellow);
        }
        .rw-title {
          font-size: clamp(2rem, 4.5vw, 3.2rem);
          font-weight: 900;
          line-height: 1.15;
          color: var(--text-primary);
          text-transform: uppercase;
          margin-bottom: 14px;
        }
        .rw-subtitle {
          font-size: clamp(0.95rem, 1.8vw, 1.1rem);
          color: var(--text-secondary);
          line-height: 1.6;
        }
        .rw-filters-bar {
          display: flex;
          align-items: center;
          justify-content: center;
          gap: 10px;
          flex-wrap: wrap;
          margin-bottom: 44px;
        }
        .rw-filter-btn {
          font-family: var(--font-heading);
          font-size: 0.8rem;
          font-weight: 700;
          letter-spacing: 1px;
          padding: 8px 18px;
          border-radius: 999px;
          background: var(--bg-card);
          color: var(--text-secondary);
          border: 1px solid var(--border-subtle);
          cursor: pointer;
          transition: all 0.25s ease;
        }
        .rw-filter-btn:hover {
          border-color: var(--border-yellow);
          color: var(--text-primary);
        }
        .rw-filter-btn.active {
          background: var(--yellow-accent);
          color: #060709;
          border-color: var(--yellow-accent);
          box-shadow: 0 4px 15px rgba(234, 179, 8, 0.3);
        }
        .rw-cards-grid {
          display: grid;
          grid-template-columns: repeat(3, 1fr);
          gap: 24px;
          margin-bottom: 60px;
        }
        .rw-card {
          background: var(--bg-card);
          border: 1px solid var(--border-subtle);
          border-radius: 14px;
          overflow: hidden;
          box-shadow: var(--card-shadow);
          transition: all 0.35s cubic-bezier(0.16, 1, 0.3, 1);
          display: flex;
          flex-direction: column;
        }
        .rw-card:hover {
          border-color: var(--border-yellow);
          transform: translateY(-5px);
          box-shadow: var(--card-shadow-hover);
        }
        .rw-img-frame {
          position: relative;
          width: 100%;
          height: 220px;
          overflow: hidden;
          background: #000;
        }
        .rw-img {
          width: 100%;
          height: 100%;
          object-fit: cover;
          transition: transform 0.6s ease;
        }
        .rw-card:hover .rw-img {
          transform: scale(1.05);
        }
        .rw-tag {
          position: absolute;
          top: 14px;
          right: 14px;
          background: rgba(10, 12, 16, 0.85);
          backdrop-filter: blur(8px);
          border: 1px solid rgba(255, 230, 0, 0.4);
          color: var(--yellow-accent);
          font-family: var(--font-heading);
          font-size: 0.68rem;
          font-weight: 800;
          letter-spacing: 1px;
          padding: 4px 10px;
          border-radius: 4px;
        }
        .rw-card-body {
          padding: 22px 20px;
          display: flex;
          flex-direction: column;
          flex: 1;
        }
        .rw-car-title {
          font-size: 1.15rem;
          font-weight: 800;
          color: var(--text-primary);
          margin-bottom: 4px;
        }
        .rw-service-badge {
          font-size: 0.82rem;
          font-weight: 700;
          color: var(--yellow-dark);
          margin-bottom: 12px;
        }
        [data-theme="dark"] .rw-service-badge {
          color: var(--yellow);
        }
        .rw-desc {
          font-size: 0.82rem;
          color: var(--text-secondary);
          line-height: 1.5;
          margin-bottom: 18px;
          flex: 1;
        }
        .rw-specs-row {
          display: flex;
          justify-content: space-between;
          padding: 10px 0;
          border-top: 1px solid var(--border-subtle);
          border-bottom: 1px solid var(--border-subtle);
          margin-bottom: 16px;
          font-size: 0.76rem;
          color: var(--text-muted);
        }
        .rw-specs-row strong {
          color: var(--text-primary);
        }
        .rw-card-btn {
          width: 100%;
          justify-content: center;
          padding: 10px 16px;
          font-size: 0.82rem;
        }
        .rw-stats-strip {
          background: var(--bg-subtle);
          border: 1px solid var(--border-subtle);
          border-radius: 14px;
          padding: 32px 24px;
          display: grid;
          grid-template-columns: repeat(3, 1fr);
          gap: 20px;
          text-align: center;
          margin-bottom: 60px;
        }
        .rw-stat-num {
          font-family: var(--font-heading);
          font-size: clamp(2rem, 3.5vw, 2.8rem);
          font-weight: 900;
          color: var(--yellow-dark);
          line-height: 1;
          margin-bottom: 6px;
        }
        [data-theme="dark"] .rw-stat-num {
          color: var(--yellow);
        }
        .rw-stat-label {
          font-size: 0.85rem;
          font-weight: 600;
          color: var(--text-secondary);
          text-transform: uppercase;
          letter-spacing: 0.5px;
        }
        @media (max-width: 1024px) {
          .rw-cards-grid {
            grid-template-columns: repeat(2, 1fr);
          }
        }
        @media (max-width: 640px) {
          .rw-page {
            padding-top: 95px;
          }
          .rw-cards-grid {
            grid-template-columns: 1fr;
          }
          .rw-stats-strip {
            grid-template-columns: 1fr;
            gap: 24px;
          }
        }
      `}</style>

      <div className="rw-page">
        <div className="container">
          {/* Header */}
          <div className="rw-header">
            <h1 className="rw-title">
              OUR RECENT WORKS & <span className="highlight-yellow">SHOWROOM DELIVERIES</span>
            </h1>
            <p className="rw-subtitle">
              Explore our mastercraft portfolio featuring ceramic coatings, self-healing paint protection films, and stage 3 paint restorations.
            </p>
          </div>

          {/* Filter Bar */}
          <div className="rw-filters-bar">
            {['ALL', 'CERAMIC', 'PPF', 'PAINT CORRECTION', 'INTERIOR'].map((cat) => (
              <button
                key={cat}
                className={`rw-filter-btn ${activeFilter === cat ? 'active' : ''}`}
                onClick={() => setActiveFilter(cat)}
              >
                {cat}
              </button>
            ))}
          </div>

          {/* Grid of Works */}
          <div className="rw-cards-grid">
            {filteredWorks.map((item) => (
              <div key={item.id} className="rw-card">
                <div 
                  className="rw-img-frame" 
                  style={{ cursor: 'pointer' }}
                  onClick={() => setSelectedGalleryWork(item)}
                  title="Click to view Before / After comparison"
                >
                  <img src={item.afterImg || item.img} alt={item.title} className="rw-img" />
                  <span className="rw-tag">{item.category}</span>
                </div>
                <div className="rw-card-body">
                  <h3 className="rw-car-title">{item.title}</h3>
                  <div className="rw-service-badge">{item.service}</div>
                  <p className="rw-desc">{item.description}</p>
                  
                  <div className="rw-specs-row">
                    <span>⏱️ Duration: <strong>{item.duration}</strong></span>
                    <span>🛡️ Warranty: <strong>{item.warranty}</strong></span>
                  </div>

                  <div style={{ display: 'flex', gap: '8px', marginTop: '12px' }}>
                    <button 
                      type="button"
                      className="btn-ghost"
                      style={{ flex: 1, padding: '10px 8px', fontSize: '0.76rem', justifyContent: 'center' }}
                      onClick={() => setSelectedGalleryWork(item)}
                    >
                      <span>🔍 BEFORE / AFTER</span>
                    </button>
                    <button 
                      type="button"
                      className="btn-automotive-cta"
                      style={{ flex: 1, padding: '10px 8px', fontSize: '0.76rem', justifyContent: 'center' }}
                      onClick={() => onOpenBooking(item.service)}
                    >
                      <span>BOOK NOW →</span>
                    </button>
                  </div>
                </div>
              </div>
            ))}
          </div>

          {/* Stats Bar */}
          <div className="rw-stats-strip">
            <div>
              <div className="rw-stat-num">500+</div>
              <div className="rw-stat-label">Luxury Vehicles Transformed</div>
            </div>
            <div>
              <div className="rw-stat-num">99.8%</div>
              <div className="rw-stat-label">Swirl-Free Laser Inspection Score</div>
            </div>
            <div>
              <div className="rw-stat-num">10 YRS</div>
              <div className="rw-stat-label">Maximum Anti-Yellowing Warranty</div>
            </div>
          </div>
        </div>
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

