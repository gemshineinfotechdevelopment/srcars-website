import React, { useState } from 'react';
import { saveBooking } from '../utils/bookingStore';
import { useSiteSettings } from '../utils/settingsStore';
import { 
  PhoneCallIcon, 
  MailIcon, 
  ClockIcon, 
  WhatsAppIcon, 
  MapPinIcon, 
  CheckCircleIcon 
} from '../components/Icons';

interface ContactProps {
  onOpenBooking: (serviceName?: string) => void;
}

export const Contact: React.FC<ContactProps> = ({ onOpenBooking }) => {
  const settings = useSiteSettings();
  const [formData, setFormData] = useState({
    name: '',
    phone: '',
    carModel: '',
    service: 'Ceramic & Graphene Coating',
    message: '',
  });
  const [isSubmitted, setIsSubmitted] = useState(false);
  const [bookingRef, setBookingRef] = useState('');

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    const ref = `CC-${Math.floor(100000 + Math.random() * 900000)}`;
    saveBooking({
      id: ref,
      customerName: formData.name,
      phone: formData.phone,
      carModel: formData.carModel || 'General Consultation',
      service: formData.service,
      date: new Date().toISOString().split('T')[0],
      status: 'Pending',
      notes: formData.message ? `Contact Inquiry: ${formData.message}` : 'Direct Contact Inquiry',
    });
    setBookingRef(ref);
    setIsSubmitted(true);
  };

  const studios = [
    {
      city: 'Chennai Studio',
      address: 'Grand Southern Trunk Rd, Auto Bay Complex, Guindy',
      pincode: 'Chennai, Tamil Nadu 600032',
      phone: '+91 98765 43210',
      hours: 'Mon – Sat: 8:30 AM – 8:00 PM',
      bays: '4 Hermetic Clean Bays',
    },
    {
      city: 'Bangalore Studio',
      address: '100 Feet Rd, Supercar Hub, Indiranagar',
      pincode: 'Bangalore, Karnataka 560038',
      phone: '+91 98765 43211',
      hours: 'Mon – Sat: 8:30 AM – 8:00 PM',
      bays: '6 Hermetic Clean Bays',
    },
    {
      city: 'Coimbatore Studio',
      address: 'Avinashi Road, Peelamedu Auto Enclave',
      pincode: 'Coimbatore, Tamil Nadu 641004',
      phone: '+91 98765 43212',
      hours: 'Mon – Sat: 8:30 AM – 7:30 PM',
      bays: '3 Hermetic Clean Bays',
    },
  ];

  return (
    <>
      <style>{`
        .contact-page {
          padding-top: 110px;
          padding-bottom: 80px;
          background: var(--bg-main);
          min-height: 100vh;
          transition: background 0.3s ease;
        }
        .contact-header {
          text-align: center;
          max-width: 800px;
          margin: 0 auto 50px;
          padding: 0 16px;
        }
        .contact-pill {
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
        [data-theme="dark"] .contact-pill {
          background: rgba(255, 230, 0, 0.08);
          border-color: rgba(255, 230, 0, 0.35);
          color: var(--yellow);
        }
        .contact-title {
          font-size: clamp(2rem, 4.5vw, 3.2rem);
          font-weight: 900;
          line-height: 1.15;
          color: var(--text-primary);
          text-transform: uppercase;
          margin-bottom: 14px;
        }
        .contact-subtitle {
          font-size: clamp(0.95rem, 1.8vw, 1.1rem);
          color: var(--text-secondary);
          line-height: 1.6;
        }
        .contact-main-grid {
          display: grid;
          grid-template-columns: 1.1fr 1fr;
          gap: 36px;
          align-items: flex-start;
          margin-bottom: 60px;
        }
        .contact-info-col {
          display: flex;
          flex-direction: column;
          gap: 24px;
        }
        .contact-quick-bar {
          background: var(--bg-card);
          border: 1px solid var(--border-subtle);
          border-radius: 14px;
          padding: 24px;
          display: grid;
          grid-template-columns: repeat(2, 1fr);
          gap: 20px;
          box-shadow: var(--card-shadow);
        }
        .quick-item {
          display: flex;
          align-items: flex-start;
          gap: 12px;
        }
        .quick-icon {
          font-size: 1.4rem;
          color: var(--yellow-dark);
        }
        [data-theme="dark"] .quick-icon {
          color: var(--yellow);
        }
        .quick-text strong {
          display: block;
          font-size: 0.85rem;
          color: var(--text-primary);
          margin-bottom: 2px;
        }
        .quick-text span {
          font-size: 0.82rem;
          color: var(--text-secondary);
        }
        .studios-list {
          display: flex;
          flex-direction: column;
          gap: 16px;
        }
        .studio-card {
          background: var(--bg-card);
          border: 1px solid var(--border-subtle);
          border-radius: 12px;
          padding: 20px 22px;
          box-shadow: var(--card-shadow);
          transition: all 0.3s ease;
        }
        .studio-card:hover {
          border-color: var(--border-yellow);
          transform: translateY(-2px);
          box-shadow: var(--card-shadow-hover);
        }
        .studio-city-row {
          display: flex;
          justify-content: space-between;
          align-items: center;
          margin-bottom: 8px;
        }
        .studio-city {
          font-size: 1.1rem;
          font-weight: 800;
          color: var(--text-primary);
        }
        .studio-bays-badge {
          font-family: var(--font-heading);
          font-size: 0.7rem;
          font-weight: 700;
          color: #060709;
          background: var(--yellow-accent);
          padding: 2px 8px;
          border-radius: 4px;
        }
        .studio-address {
          font-size: 0.85rem;
          color: var(--text-secondary);
          line-height: 1.45;
          margin-bottom: 10px;
        }
        .studio-details-row {
          display: flex;
          justify-content: space-between;
          font-size: 0.8rem;
          color: var(--text-muted);
          flex-wrap: wrap;
          gap: 8px;
        }
        .studio-details-row span strong {
          color: var(--text-primary);
        }
        .contact-form-card {
          background: var(--bg-card);
          border: 1px solid var(--border-yellow);
          border-radius: 16px;
          padding: 32px 28px;
          box-shadow: var(--card-shadow);
        }
        .form-title {
          font-size: 1.4rem;
          font-weight: 800;
          color: var(--text-primary);
          text-transform: uppercase;
          margin-bottom: 6px;
        }
        .form-desc {
          font-size: 0.88rem;
          color: var(--text-secondary);
          margin-bottom: 24px;
        }
        .form-group {
          margin-bottom: 18px;
        }
        .form-label {
          display: block;
          font-family: var(--font-heading);
          font-size: 0.78rem;
          font-weight: 700;
          letter-spacing: 0.5px;
          color: var(--text-primary);
          margin-bottom: 6px;
          text-transform: uppercase;
        }
        .form-input, .form-select, .form-textarea {
          width: 100%;
          background: var(--input-bg);
          border: 1px solid var(--input-border);
          color: var(--input-text);
          padding: 12px 14px;
          border-radius: 8px;
          font-family: var(--font-main);
          font-size: 0.9rem;
          transition: border-color 0.25s ease;
          box-sizing: border-box;
        }
        .form-input:focus, .form-select:focus, .form-textarea:focus {
          outline: none;
          border-color: var(--yellow-dark);
        }
        [data-theme="dark"] .form-input:focus, 
        [data-theme="dark"] .form-select:focus, 
        [data-theme="dark"] .form-textarea:focus {
          border-color: var(--yellow);
        }
        .form-textarea {
          resize: vertical;
          min-height: 100px;
        }
        .form-submit-btn {
          width: 100%;
          justify-content: center;
          padding: 13px;
          margin-top: 8px;
        }
        .form-success-box {
          text-align: center;
          padding: 40px 20px;
        }
        .success-icon {
          font-size: 3rem;
          margin-bottom: 14px;
        }
        .success-title {
          font-size: 1.4rem;
          font-weight: 800;
          color: var(--text-primary);
          margin-bottom: 8px;
        }
        .success-desc {
          font-size: 0.9rem;
          color: var(--text-secondary);
          line-height: 1.5;
          margin-bottom: 24px;
        }
        @media (max-width: 900px) {
          .contact-main-grid {
            grid-template-columns: 1fr;
          }
        }
        @media (max-width: 600px) {
          .contact-page {
            padding-top: 95px;
          }
          .contact-quick-bar {
            grid-template-columns: 1fr;
          }
          .contact-form-card {
            padding: 24px 18px;
          }
        }
      `}</style>

      <div className="contact-page">
        <div className="container">
          {/* Header */}
          <div className="contact-header">
            <span className="contact-pill">GET IN TOUCH</span>
            <h1 className="contact-title">
              CONTACT & <span className="highlight-yellow">STUDIO LOCATIONS</span>
            </h1>
            <p className="contact-subtitle">
              Connect directly with our master detailers, request a personalized paint inspection, or book your bay at any of our regional studios.
            </p>
          </div>

          {/* Main Grid */}
          <div className="contact-main-grid">
            {/* Left Column: Direct Info & Studios */}
            <div className="contact-info-col">
              {/* Quick Bar */}
              <div className="contact-quick-bar">
                <div className="quick-item">
                  <span className="quick-icon"><PhoneCallIcon size={18} color="var(--yellow-dark)" /></span>
                  <div className="quick-text">
                    <strong>Direct Hotline</strong>
                    <a href={`tel:${settings.phone.replace(/[^0-9+]/g, '')}`} style={{ color: 'inherit', textDecoration: 'none' }}>
                      <span>{settings.phone}</span>
                    </a>
                  </div>
                </div>
                <div className="quick-item">
                  <span className="quick-icon"><MailIcon size={18} color="var(--yellow-dark)" /></span>
                  <div className="quick-text">
                    <strong>Email Inquiries</strong>
                    <a href={`mailto:${settings.email}`} style={{ color: 'inherit', textDecoration: 'none' }}>
                      <span>{settings.email}</span>
                    </a>
                  </div>
                </div>
                <div className="quick-item">
                  <span className="quick-icon"><ClockIcon size={18} color="var(--yellow-dark)" /></span>
                  <div className="quick-text">
                    <strong>Working Hours</strong>
                    <span>{settings.operatingHours}</span>
                  </div>
                </div>
                <div className="quick-item">
                  <span className="quick-icon"><WhatsAppIcon size={18} /></span>
                  <div className="quick-text">
                    <strong>WhatsApp Priority</strong>
                    <a 
                      href={`https://wa.me/${settings.phone.replace(/[^0-9]/g, '')}`}
                      target="_blank"
                      rel="noreferrer"
                      style={{ color: 'inherit', textDecoration: 'none' }}
                    >
                      <span>{settings.phone}</span>
                    </a>
                  </div>
                </div>
              </div>

              {/* Studios */}
              <div className="studios-list">
                {studios.map((s, i) => (
                  <div key={i} className="studio-card">
                    <div className="studio-city-row">
                      <h3 className="studio-city"><MapPinIcon size={16} color="var(--yellow-dark)" style={{ marginRight: '6px' }} />{s.city}</h3>
                      <span className="studio-bays-badge">{s.bays}</span>
                    </div>
                    <p className="studio-address">{s.address}, {s.pincode}</p>
                    <div className="studio-details-row">
                      <span>Phone: <strong>{s.phone}</strong></span>
                      <span>Hours: <strong>{s.hours}</strong></span>
                    </div>
                  </div>
                ))}
              </div>
            </div>

            {/* Right Column: Interactive Form */}
            <div className="contact-form-card">
              {isSubmitted ? (
                <div className="form-success-box">
                  <div className="success-icon"><CheckCircleIcon size={36} color="#10B981" /></div>
                  <h3 className="success-title">Inquiry & Appointment Registered!</h3>
                  <p className="success-desc">
                    Thank you for reaching out. One of our master detailing advisors will call you within 15 minutes to confirm your appointment.
                  </p>
                  {bookingRef && (
                    <div style={{
                      background: 'rgba(234, 179, 8, 0.1)',
                      border: '1px solid var(--border-yellow)',
                      padding: '10px 16px',
                      borderRadius: '8px',
                      margin: '16px 0',
                      display: 'inline-block'
                    }}>
                      <span style={{ fontSize: '0.75rem', color: 'var(--text-muted)', display: 'block' }}>REFERENCE ID</span>
                      <strong style={{ fontFamily: 'var(--font-heading)', color: 'var(--yellow-dark)', fontSize: '1.1rem', letterSpacing: '1px' }}>
                        {bookingRef}
                      </strong>
                    </div>
                  )}
                  <div>
                    <button 
                      className="btn-automotive-cta" 
                      onClick={() => {
                        setIsSubmitted(false);
                        setBookingRef('');
                        setFormData({ name: '', phone: '', carModel: '', service: 'Ceramic & Graphene Coating', message: '' });
                      }}
                    >
                      <span>SEND ANOTHER MESSAGE</span>
                    </button>
                  </div>
                </div>
              ) : (
                <form onSubmit={handleSubmit}>
                  <h3 className="form-title">Send An Inquiry</h3>
                  <p className="form-desc">Fill out your details and we will get back to you promptly.</p>

                  <div className="form-group">
                    <label className="form-label">Full Name *</label>
                    <input 
                      type="text" 
                      className="form-input" 
                      required 
                      placeholder="e.g. Ramesh Kumar" 
                      value={formData.name}
                      onChange={(e) => setFormData({ ...formData, name: e.target.value })}
                    />
                  </div>

                  <div className="form-group">
                    <label className="form-label">Phone Number *</label>
                    <input 
                      type="tel" 
                      className="form-input" 
                      required 
                      placeholder="+91 98765 43210" 
                      value={formData.phone}
                      onChange={(e) => setFormData({ ...formData, phone: e.target.value })}
                    />
                  </div>

                  <div className="form-group">
                    <label className="form-label">Vehicle Make & Model</label>
                    <input 
                      type="text" 
                      className="form-input" 
                      placeholder="e.g. BMW M4 / Porsche 911 / Toyota Fortuner" 
                      value={formData.carModel}
                      onChange={(e) => setFormData({ ...formData, carModel: e.target.value })}
                    />
                  </div>

                  <div className="form-group">
                    <label className="form-label">Service Interested In</label>
                    <select 
                      className="form-select"
                      value={formData.service}
                      onChange={(e) => setFormData({ ...formData, service: e.target.value })}
                    >
                      <option value="Ceramic & Graphene">Ceramic & Graphene Coating</option>
                      <option value="Full Body Armor PPF">Full Body Armor PPF</option>
                      <option value="Paint Correction">Stage 2/3 Paint Correction</option>
                      <option value="Interior Sanctuary Spa">Interior Sanctuary Spa</option>
                      <option value="Custom Consultation">General Consultation / Inspection</option>
                    </select>
                  </div>

                  <div className="form-group">
                    <label className="form-label">Message / Specific Requirements</label>
                    <textarea 
                      className="form-textarea" 
                      placeholder="Tell us about your vehicle's paint condition or questions..."
                      value={formData.message}
                      onChange={(e) => setFormData({ ...formData, message: e.target.value })}
                    ></textarea>
                  </div>

                  <button type="submit" className="btn-automotive-cta form-submit-btn">
                    <span>SEND INQUIRY →</span>
                  </button>
                </form>
              )}
            </div>
          </div>

          {/* Instant Online Booking Prompt */}
          <div style={{ textAlign: 'center', marginTop: '40px', padding: '24px', background: 'var(--bg-subtle)', borderRadius: '12px', border: '1px solid var(--border-subtle)' }}>
            <p style={{ margin: '0 0 14px 0', fontSize: '1rem', color: 'var(--text-secondary)' }}>
              Looking for instant studio bay reservation without inquiry waiting?
            </p>
            <button 
              type="button" 
              className="btn-automotive-cta"
              onClick={() => onOpenBooking()}
            >
              <span>BOOK APPOINTMENT NOW →</span>
            </button>
          </div>
        </div>
      </div>
    </>
  );
};
