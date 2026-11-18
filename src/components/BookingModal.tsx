import React, { useState, useEffect } from 'react';
import { saveBooking } from '../utils/bookingStore';

export interface BookingInitialData {
  service?: string;
  carModel?: string;
  vehicleNumber?: string;
  date?: string;
}

interface BookingModalProps {
  isOpen: boolean;
  onClose: () => void;
  initialService?: string;
  initialData?: BookingInitialData;
}

const serviceOptions = [
  'Ceramic & Graphene Coating',
  'Interior Sanctuary Spa',
  'Stage 2/3 Paint Correction',
  'Full Body Armor PPF',
  'Engine Bay Detailing',
  'Wheel & Caliper Coating',
];

const normalizeService = (svc?: string): string => {
  if (!svc) return serviceOptions[0];
  const lower = svc.toLowerCase();
  if (lower.includes('ceramic') || lower.includes('graphene')) return 'Ceramic & Graphene Coating';
  if (lower.includes('interior') || lower.includes('sanctuary') || lower.includes('spa')) return 'Interior Sanctuary Spa';
  if (lower.includes('paint') || lower.includes('correction')) return 'Stage 2/3 Paint Correction';
  if (lower.includes('ppf') || lower.includes('armor')) return 'Full Body Armor PPF';
  if (lower.includes('engine')) return 'Engine Bay Detailing';
  if (lower.includes('wheel') || lower.includes('caliper')) return 'Wheel & Caliper Coating';
  return serviceOptions.includes(svc) ? svc : serviceOptions[0];
};

export const BookingModal: React.FC<BookingModalProps> = ({
  isOpen,
  onClose,
  initialService,
  initialData,
}) => {
  const [selectedService, setSelectedService] = useState<string>(
    normalizeService(initialData?.service || initialService)
  );
  const [carModel, setCarModel] = useState<string>(initialData?.carModel || '');
  const [vehicleNumber, setVehicleNumber] = useState<string>(initialData?.vehicleNumber || '');
  const [date, setDate] = useState<string>(initialData?.date || '');
  const [name, setName] = useState<string>('');
  const [phone, setPhone] = useState<string>('');
  const [isSubmitted, setIsSubmitted] = useState<boolean>(false);
  const [bookingRef, setBookingRef] = useState<string>('');

  useEffect(() => {
    if (initialData?.service) {
      setSelectedService(normalizeService(initialData.service));
    } else if (initialService) {
      setSelectedService(normalizeService(initialService));
    }
    if (initialData?.carModel) {
      setCarModel(initialData.carModel);
    }
    if (initialData?.vehicleNumber) {
      setVehicleNumber(initialData.vehicleNumber);
    }
    if (initialData?.date) {
      setDate(initialData.date);
    }
  }, [initialService, initialData, isOpen]);

  if (!isOpen) return null;

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    const ref = `CC-${Math.floor(100000 + Math.random() * 900000)}`;
    saveBooking({
      id: ref,
      customerName: name,
      phone: phone,
      carModel: carModel || 'Unspecified Vehicle',
      vehicleNumber: vehicleNumber || '',
      service: selectedService,
      date: date || new Date().toISOString().split('T')[0],
      status: 'Pending',
    });
    setBookingRef(ref);
    setIsSubmitted(true);
  };

  const handleReset = () => {
    setIsSubmitted(false);
    setName('');
    setPhone('');
    setCarModel('');
    setVehicleNumber('');
    setDate('');
    onClose();
  };

  return (
    <>
      <style>{`
        .cc-modal-backdrop {
          position: fixed;
          top: 0;
          left: 0;
          width: 100vw;
          height: 100vh;
          background: var(--modal-backdrop-bg);
          backdrop-filter: blur(12px);
          -webkit-backdrop-filter: blur(12px);
          display: flex;
          align-items: center;
          justify-content: center;
          padding: 20px;
          z-index: 2000;
          animation: ccModalFadeIn 0.25s ease-out;
        }
        .cc-modal-dialog {
          position: relative;
          background: var(--modal-bg);
          border: 1px solid var(--border-yellow);
          box-shadow: var(--dropdown-shadow);
          border-radius: 14px;
          width: 100%;
          max-width: 540px;
          padding: 34px;
          max-height: 90vh;
          overflow-y: auto;
          animation: ccModalScaleUp 0.3s cubic-bezier(0.16, 1, 0.3, 1);
        }
        @keyframes ccModalFadeIn {
          from { opacity: 0; }
          to { opacity: 1; }
        }
        @keyframes ccModalScaleUp {
          from { opacity: 0; transform: scale(0.92) translateY(12px); }
          to { opacity: 1; transform: scale(1) translateY(0); }
        }
        .cc-modal-close-btn {
          position: absolute;
          top: 18px;
          right: 18px;
          width: 32px;
          height: 32px;
          background: var(--btn-ghost-bg);
          border: 1px solid var(--border-medium);
          color: var(--text-primary);
          border-radius: 6px;
          display: flex;
          align-items: center;
          justify-content: center;
          cursor: pointer;
          transition: all 0.2s ease;
        }
        .cc-modal-close-btn:hover {
          background: rgba(234, 179, 8, 0.15);
          color: var(--yellow-dark);
        }
        [data-theme="dark"] .cc-modal-close-btn:hover {
          color: var(--yellow);
        }
        .cc-modal-header {
          margin-bottom: 22px;
        }
        .cc-modal-badge {
          display: inline-flex;
          align-items: center;
          gap: 8px;
          background: rgba(234, 179, 8, 0.1);
          border: 1px solid rgba(234, 179, 8, 0.3);
          color: var(--yellow-dark);
          font-family: var(--font-heading);
          font-size: 0.72rem;
          font-weight: 700;
          letter-spacing: 1.5px;
          padding: 4px 12px;
          border-radius: 999px;
          margin-bottom: 10px;
        }
        [data-theme="dark"] .cc-modal-badge {
          background: rgba(255, 230, 0, 0.1);
          border-color: rgba(255, 230, 0, 0.3);
          color: var(--yellow);
        }
        .cc-badge-dot {
          width: 6px;
          height: 6px;
          background: var(--yellow);
          border-radius: 50%;
          box-shadow: 0 0 8px var(--yellow);
        }
        .cc-modal-title {
          font-size: 1.65rem;
          font-weight: 800;
          color: var(--text-primary);
          margin: 0 0 6px 0;
        }
        .cc-modal-title .highlight {
          color: var(--yellow-dark);
        }
        [data-theme="dark"] .cc-modal-title .highlight {
          color: var(--yellow);
        }
        .cc-modal-desc {
          font-size: 0.84rem;
          color: var(--text-secondary);
          margin: 0;
        }
        .cc-modal-form {
          display: flex;
          flex-direction: column;
          gap: 14px;
        }
        .cc-form-row {
          display: grid;
          grid-template-columns: 1fr 1fr;
          gap: 12px;
        }
        .cc-form-group {
          display: flex;
          flex-direction: column;
          gap: 6px;
        }
        .cc-form-label {
          font-family: var(--font-heading);
          font-size: 0.72rem;
          font-weight: 700;
          color: var(--yellow-dark);
          letter-spacing: 1px;
        }
        [data-theme="dark"] .cc-form-label {
          color: var(--yellow);
        }
        .cc-form-input, .cc-form-select {
          background: var(--input-bg);
          border: 1px solid var(--input-border);
          border-radius: 6px;
          padding: 11px 14px;
          font-family: var(--font-main);
          font-size: 0.88rem;
          color: var(--input-text);
          outline: none;
          transition: all 0.25s ease;
        }
        .cc-form-input:focus, .cc-form-select:focus {
          border-color: var(--yellow-dark);
          box-shadow: 0 0 10px rgba(234, 179, 8, 0.25);
          background: var(--bg-card);
        }
        [data-theme="dark"] .cc-form-input:focus, [data-theme="dark"] .cc-form-select:focus {
          border-color: var(--yellow);
          box-shadow: 0 0 10px rgba(255, 230, 0, 0.3);
        }
        .cc-form-select option {
          background: var(--bg-card);
          color: var(--text-primary);
        }
        .cc-success-dialog-view {
          text-align: center;
          padding: 16px 0;
          display: flex;
          flex-direction: column;
          align-items: center;
        }
        .cc-success-badge-icon {
          width: 58px;
          height: 58px;
          background: rgba(16, 185, 129, 0.15);
          border: 2px solid #10B981;
          color: #10B981;
          border-radius: 50%;
          display: flex;
          align-items: center;
          justify-content: center;
          font-size: 1.6rem;
          font-weight: 900;
          margin-bottom: 16px;
          box-shadow: 0 0 20px rgba(16, 185, 129, 0.35);
        }
        .cc-success-headline {
          font-size: 1.6rem;
          font-weight: 800;
          color: var(--text-primary);
          margin: 0 0 8px 0;
        }
        .cc-success-sub {
          font-size: 0.86rem;
          color: var(--text-secondary);
          margin: 0 0 22px 0;
        }
        .cc-confirmation-card {
          width: 100%;
          background: var(--bg-subtle);
          border: 1px dashed var(--border-yellow);
          border-radius: 10px;
          padding: 16px 20px;
          display: flex;
          flex-direction: column;
          gap: 10px;
          margin-bottom: 24px;
          text-align: left;
        }
        .cc-conf-row {
          display: flex;
          justify-content: space-between;
          align-items: center;
          font-size: 0.86rem;
        }
        .cc-conf-row span {
          font-family: var(--font-heading);
          font-size: 0.75rem;
          color: var(--text-muted);
        }
        .cc-conf-row strong {
          color: var(--text-primary);
        }
        .cc-conf-row strong.yellow {
          color: var(--yellow-dark);
          font-family: var(--font-heading);
          letter-spacing: 1px;
        }
        [data-theme="dark"] .cc-conf-row strong.yellow {
          color: var(--yellow);
        }
        .cc-status-confirmed {
          color: #10B981;
          font-weight: 700;
          font-size: 0.8rem;
        }
        @media (max-width: 600px) {
          .cc-form-row {
            grid-template-columns: 1fr;
          }
        }
      `}</style>

      <div className="cc-modal-backdrop" onClick={onClose}>
        <div className="cc-modal-dialog" onClick={(e) => e.stopPropagation()}>
          <button className="cc-modal-close-btn" onClick={onClose} aria-label="Close">
            ✕
          </button>

          {!isSubmitted ? (
            <>
              <div className="cc-modal-header">
                <h3 className="cc-modal-title">
                  SCHEDULE <span className="highlight">YOUR DETAILING</span>
                </h3>
                <p className="cc-modal-desc">
                  Reserve your climate-controlled bay and master detailer inspection.
                </p>
              </div>

              <form onSubmit={handleSubmit} className="cc-modal-form">
                {/* Row 1: Customer Name & Mobile Number */}
                <div className="cc-form-row">
                  <div className="cc-form-group">
                    <label className="cc-form-label">CUSTOMER NAME *</label>
                    <input 
                      type="text" 
                      className="cc-form-input" 
                      placeholder="e.g. Hariharan"
                      value={name}
                      onChange={(e) => setName(e.target.value)}
                      required
                    />
                  </div>
                  <div className="cc-form-group">
                    <label className="cc-form-label">MOBILE NUMBER *</label>
                    <input 
                      type="tel" 
                      className="cc-form-input" 
                      placeholder="e.g. +91 98765 43210"
                      value={phone}
                      onChange={(e) => setPhone(e.target.value)}
                      required
                    />
                  </div>
                </div>

                {/* Row 2: Vehicle Name / Brand & Vehicle Number */}
                <div className="cc-form-row">
                  <div className="cc-form-group">
                    <label className="cc-form-label">VEHICLE NAME / BRAND *</label>
                    <input 
                      type="text" 
                      className="cc-form-input" 
                      placeholder="e.g. Porsche 911 GT3 / BMW M4"
                      value={carModel}
                      onChange={(e) => setCarModel(e.target.value)}
                      required
                    />
                  </div>
                  <div className="cc-form-group">
                    <label className="cc-form-label">VEHICLE NUMBER *</label>
                    <input 
                      type="text" 
                      className="cc-form-input" 
                      placeholder="e.g. TN 01 AB 1234"
                      value={vehicleNumber}
                      onChange={(e) => setVehicleNumber(e.target.value.toUpperCase())}
                      required
                    />
                  </div>
                </div>

                {/* Row 3: Preferred Date & Selected Treatment */}
                <div className="cc-form-row">
                  <div className="cc-form-group">
                    <label className="cc-form-label">PREFERRED DATE *</label>
                    <input 
                      type="date" 
                      className="cc-form-input" 
                      value={date}
                      onChange={(e) => setDate(e.target.value)}
                      required
                    />
                  </div>
                  <div className="cc-form-group">
                    <label className="cc-form-label">SELECTED TREATMENT *</label>
                    <select 
                      className="cc-form-select"
                      value={selectedService}
                      onChange={(e) => setSelectedService(e.target.value)}
                      required
                    >
                      {serviceOptions.map((s) => (
                        <option key={s} value={s}>
                          {s}
                        </option>
                      ))}
                    </select>
                  </div>
                </div>

                <div style={{ marginTop: '10px' }}>
                  <button type="submit" className="btn-automotive-cta" style={{ width: '100%' }}>
                    <span>CONFIRM RESERVATION →</span>
                  </button>
                </div>
              </form>
            </>
          ) : (
            <div className="cc-success-dialog-view">
              <div className="cc-success-badge-icon">✓</div>
              <h3 className="cc-success-headline">APPOINTMENT RESERVED</h3>
              <p className="cc-success-sub">
                Your studio slot has been registered. Our detailing concierge will contact you within 15 minutes.
              </p>

              <div className="cc-confirmation-card">
                <div className="cc-conf-row">
                  <span>REFERENCE ID:</span>
                  <strong className="yellow">{bookingRef}</strong>
                </div>
                <div className="cc-conf-row">
                  <span>CUSTOMER:</span>
                  <strong>{name} ({phone})</strong>
                </div>
                <div className="cc-conf-row">
                  <span>VEHICLE:</span>
                  <strong>{carModel} {vehicleNumber ? `[${vehicleNumber}]` : ''}</strong>
                </div>
                <div className="cc-conf-row">
                  <span>TREATMENT:</span>
                  <strong>{selectedService}</strong>
                </div>
                <div className="cc-conf-row">
                  <span>PREFERRED DATE:</span>
                  <strong>{date}</strong>
                </div>
                <div className="cc-conf-row">
                  <span>STATUS:</span>
                  <span className="cc-status-confirmed">● Priority Bay Assigned</span>
                </div>
              </div>

              <button className="btn-automotive-cta" onClick={handleReset}>
                <span>CLOSE</span>
              </button>
            </div>
          )}
        </div>
      </div>
    </>
  );
};
