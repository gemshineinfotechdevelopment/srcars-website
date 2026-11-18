import React, { useState, useEffect } from 'react';
import { resolveWorkImage, type WorkItem } from '../utils/worksStore';

interface BeforeAfterModalProps {
  work: WorkItem | null;
  onClose: () => void;
  onOpenBooking: (serviceName?: string) => void;
}

export const BeforeAfterModal: React.FC<BeforeAfterModalProps> = ({ work, onClose, onOpenBooking }) => {
  const [sliderPos, setSliderPos] = useState<number>(50);

  useEffect(() => {
    const handleKeyDown = (e: KeyboardEvent) => {
      if (e.key === 'Escape') onClose();
    };
    window.addEventListener('keydown', handleKeyDown);
    return () => window.removeEventListener('keydown', handleKeyDown);
  }, [onClose]);

  if (!work) return null;

  return (
    <>
      <style>{`
        .ba-modal-backdrop {
          position: fixed;
          top: 0;
          left: 0;
          width: 100vw;
          height: 100vh;
          background: rgba(6, 7, 9, 0.88);
          backdrop-filter: blur(8px);
          -webkit-backdrop-filter: blur(8px);
          z-index: 2500;
          display: flex;
          align-items: center;
          justify-content: center;
          padding: 16px;
          box-sizing: border-box;
          animation: baFadeIn 0.25s ease;
        }
        @keyframes baFadeIn {
          from { opacity: 0; transform: scale(0.98); }
          to { opacity: 1; transform: scale(1); }
        }
        .ba-modal-card {
          background: var(--bg-card);
          border: 1px solid var(--border-yellow);
          border-radius: 16px;
          width: 100%;
          max-width: 900px;
          max-height: 92vh;
          overflow-y: auto;
          box-shadow: 0 25px 60px rgba(0, 0, 0, 0.5), 0 0 30px rgba(234, 179, 8, 0.2);
          display: flex;
          flex-direction: column;
        }
        .ba-modal-header {
          padding: 18px 24px;
          border-bottom: 1px solid var(--border-subtle);
          display: flex;
          justify-content: space-between;
          align-items: center;
          background: var(--bg-subtle);
        }
        .ba-header-left {
          display: flex;
          align-items: center;
          gap: 12px;
          flex-wrap: wrap;
        }
        .ba-modal-title {
          font-family: var(--font-heading);
          font-size: 1.25rem;
          font-weight: 900;
          color: var(--text-primary);
          margin: 0;
          text-transform: uppercase;
        }
        .ba-modal-badge {
          background: var(--yellow-accent);
          color: #060709;
          font-family: var(--font-heading);
          font-size: 0.7rem;
          font-weight: 800;
          padding: 3px 10px;
          border-radius: 4px;
          letter-spacing: 0.5px;
        }
        .ba-close-btn {
          background: none;
          border: none;
          color: var(--text-muted);
          font-size: 1.5rem;
          cursor: pointer;
          padding: 4px 8px;
          border-radius: 6px;
          transition: color 0.2s ease, background 0.2s ease;
          line-height: 1;
        }
        .ba-close-btn:hover {
          color: var(--text-primary);
          background: var(--bg-card);
        }
        .ba-modal-body {
          padding: 24px;
          display: flex;
          flex-direction: column;
          gap: 20px;
        }
        /* Interactive Comparison Stage */
        .ba-stage-frame {
          position: relative;
          width: 100%;
          height: 420px;
          border-radius: 12px;
          overflow: hidden;
          background: #080A0F;
          box-shadow: 0 10px 30px rgba(0, 0, 0, 0.25);
          user-select: none;
        }
        .ba-img-layer {
          position: absolute;
          top: 0;
          left: 0;
          width: 100%;
          height: 100%;
          object-fit: cover;
          display: block;
        }
        .ba-clipper-layer {
          position: absolute;
          top: 0;
          left: 0;
          width: 100%;
          height: 100%;
          pointer-events: none;
        }
        /* Divider line & handle */
        .ba-divider-line {
          position: absolute;
          top: 0;
          bottom: 0;
          width: 3px;
          background: var(--yellow-accent);
          box-shadow: 0 0 12px var(--yellow-glow-strong);
          pointer-events: none;
          z-index: 10;
        }
        .ba-handle-badge {
          position: absolute;
          top: 50%;
          left: 50%;
          transform: translate(-50%, -50%);
          background: #060709;
          border: 2px solid var(--yellow-accent);
          color: var(--yellow-accent);
          padding: 6px 14px;
          border-radius: 20px;
          font-family: var(--font-heading);
          font-size: 0.72rem;
          font-weight: 800;
          white-space: nowrap;
          box-shadow: 0 4px 14px rgba(0, 0, 0, 0.6);
          pointer-events: none;
        }
        .ba-tag-overlay {
          position: absolute;
          bottom: 14px;
          font-family: var(--font-heading);
          font-size: 0.75rem;
          font-weight: 900;
          padding: 4px 12px;
          border-radius: 4px;
          letter-spacing: 0.8px;
          z-index: 8;
          pointer-events: none;
          transition: opacity 0.2s ease;
        }
        .ba-tag-before {
          left: 14px;
          background: rgba(220, 38, 38, 0.9);
          color: #FFF;
          box-shadow: 0 2px 8px rgba(0, 0, 0, 0.4);
        }
        .ba-tag-after {
          right: 14px;
          background: rgba(16, 185, 129, 0.95);
          color: #FFF;
          box-shadow: 0 2px 8px rgba(0, 0, 0, 0.4);
        }
        /* Range slider control */
        .ba-range-input {
          position: absolute;
          top: 0;
          left: 0;
          width: 100%;
          height: 100%;
          opacity: 0;
          cursor: ew-resize;
          z-index: 20;
          margin: 0;
        }
        /* Details strip */
        .ba-info-strip {
          background: var(--bg-subtle);
          border: 1px solid var(--border-subtle);
          border-radius: 12px;
          padding: 16px 20px;
          display: grid;
          grid-template-columns: 2fr 1fr 1fr;
          gap: 16px;
          align-items: center;
        }
        .ba-info-item strong {
          display: block;
          font-size: 0.74rem;
          color: var(--text-muted);
          text-transform: uppercase;
          margin-bottom: 4px;
        }
        .ba-info-item span {
          font-size: 0.95rem;
          font-weight: 700;
          color: var(--text-primary);
        }
        .ba-desc-text {
          font-size: 0.86rem;
          color: var(--text-secondary);
          line-height: 1.6;
          margin: 0;
        }
        .ba-modal-footer {
          padding: 18px 24px;
          border-top: 1px solid var(--border-subtle);
          display: flex;
          justify-content: flex-end;
          gap: 12px;
          background: var(--bg-subtle);
        }
        @media (max-width: 768px) {
          .ba-modal-header { padding: 14px 16px; }
          .ba-modal-body { padding: 16px; gap: 14px; }
          .ba-stage-frame { height: 260px; }
          .ba-handle-badge { font-size: 0.62rem; padding: 4px 8px; }
          .ba-tag-overlay { font-size: 0.65rem; padding: 3px 8px; bottom: 10px; }
          .ba-tag-before { left: 10px; }
          .ba-tag-after { right: 10px; }
          .ba-info-strip { grid-template-columns: 1fr; gap: 10px; padding: 12px 14px; }
          .ba-modal-footer { flex-direction: column-reverse; padding: 14px 16px; }
          .ba-modal-footer button { width: 100%; }
        }
      `}</style>

      <div className="ba-modal-backdrop" onClick={onClose}>
        <div className="ba-modal-card" onClick={(e) => e.stopPropagation()}>
          {/* Header */}
          <div className="ba-modal-header">
            <div className="ba-header-left">
              <h3 className="ba-modal-title">{work.title}</h3>
              <span className="ba-modal-badge">{work.category}</span>
            </div>
            <button type="button" className="ba-close-btn" onClick={onClose} aria-label="Close dialog">
              ✕
            </button>
          </div>

          {/* Body */}
          <div className="ba-modal-body">
            {/* Interactive Comparison Stage */}
            <div className="ba-stage-frame">
              {/* AFTER Image (Base Layer) */}
              <img 
                src={resolveWorkImage(work.afterImg || work.img, '/assets/detail_after.jpg')} 
                alt={`${work.title} After`} 
                className="ba-img-layer" 
                onError={(e) => {
                  (e.target as HTMLImageElement).src = '/assets/detail_after.jpg';
                }}
              />
              {/* AFTER Badge: Only visible when After side is revealed (sliderPos < 85) */}
              {sliderPos < 85 && (
                <span className="ba-tag-overlay ba-tag-after">AFTER</span>
              )}

              {/* BEFORE Image (Clipped Layer via inset clip-path) */}
              <div 
                className="ba-clipper-layer" 
                style={{ clipPath: `inset(0 ${100 - sliderPos}% 0 0)` }}
              >
                <img 
                  src={resolveWorkImage(work.beforeImg, '/assets/detail_before.jpg')} 
                  alt={`${work.title} Before`} 
                  className="ba-img-layer" 
                  onError={(e) => {
                    (e.target as HTMLImageElement).src = '/assets/detail_before.jpg';
                  }}
                />
                {/* BEFORE Badge: Only visible when Before side is revealed (sliderPos > 15) */}
                {sliderPos > 15 && (
                  <span className="ba-tag-overlay ba-tag-before">BEFORE</span>
                )}
              </div>

              {/* Divider Line & Interactive Handle */}
              <div className="ba-divider-line" style={{ left: `${sliderPos}%` }}>
                <div className="ba-handle-badge">
                  ◄ BEFORE | AFTER ►
                </div>
              </div>

              {/* Range Slider for dragging across image */}
              <input
                type="range"
                min="0"
                max="100"
                value={sliderPos}
                onChange={(e) => setSliderPos(Number(e.target.value))}
                className="ba-range-input"
                aria-label="Before after image comparison slider"
              />
            </div>

            {/* Info Strip */}
            <div className="ba-info-strip">
              <div className="ba-info-item">
                <strong>Detailing Treatment Applied</strong>
                <span>{work.service}</span>
              </div>
              <div className="ba-info-item">
                <strong>Turnaround Duration</strong>
                <span>⏱️ {work.duration || '3 Days'}</span>
              </div>
              <div className="ba-info-item">
                <strong>Studio Warranty</strong>
                <span>🛡️ {work.warranty || '5-Year Guarantee'}</span>
              </div>
            </div>

            {/* Work Description */}
            {work.description && (
              <p className="ba-desc-text">
                {work.description}
              </p>
            )}
          </div>

          {/* Footer CTA */}
          <div className="ba-modal-footer">
            <button type="button" className="btn-ghost" onClick={onClose}>
              Close Gallery
            </button>
            <button
              type="button"
              className="btn-automotive-cta"
              onClick={() => {
                onClose();
                onOpenBooking(work.service);
              }}
            >
              <span>BOOK THIS SERVICE FOR MY CAR →</span>
            </button>
          </div>
        </div>
      </div>
    </>
  );
};
