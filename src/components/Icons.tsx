import React from 'react';

interface IconProps {
  className?: string;
  size?: number;
  color?: string;
  style?: React.CSSProperties;
}

// 1. Social Media Icons (Realistic Brand SVGs)
export const InstagramIcon: React.FC<IconProps> = ({ size = 18, color = 'currentColor', style, className }) => (
  <svg 
    width={size} 
    height={size} 
    viewBox="0 0 24 24" 
    fill="none" 
    stroke={color} 
    strokeWidth="1.8" 
    strokeLinecap="round" 
    strokeLinejoin="round" 
    style={{ verticalAlign: 'middle', display: 'inline-block', ...style }} 
    className={className}
  >
    <rect x="2" y="2" width="20" height="20" rx="5" ry="5"></rect>
    <path d="M16 11.37A4 4 0 1 1 12.63 8 4 4 0 0 1 16 11.37z"></path>
    <line x1="17.5" y1="6.5" x2="17.51" y2="6.5"></line>
  </svg>
);

export const YouTubeIcon: React.FC<IconProps> = ({ size = 18, color = 'currentColor', style, className }) => (
  <svg 
    width={size} 
    height={size} 
    viewBox="0 0 24 24" 
    fill="none" 
    stroke={color} 
    strokeWidth="1.8" 
    strokeLinecap="round" 
    strokeLinejoin="round" 
    style={{ verticalAlign: 'middle', display: 'inline-block', ...style }} 
    className={className}
  >
    <path d="M22.54 6.42a2.78 2.78 0 0 0-1.94-2C18.88 4 12 4 12 4s-6.88 0-8.6.46a2.78 2.78 0 0 0-1.94 2A29 29 0 0 0 1 11.75a29 29 0 0 0 .46 5.33A2.78 2.78 0 0 0 3.4 19c1.72.46 8.6.46 8.6.46s6.88 0 8.6-.46a2.78 2.78 0 0 0 1.94-2 29 29 0 0 0 .46-5.25 29 29 0 0 0-.46-5.33z"></path>
    <polygon points="9.75 15.02 15.5 11.75 9.75 8.48 9.75 15.02" fill={color}></polygon>
  </svg>
);

export const XTwitterIcon: React.FC<IconProps> = ({ size = 18, color = 'currentColor', style, className }) => (
  <svg 
    width={size} 
    height={size} 
    viewBox="0 0 24 24" 
    fill={color} 
    style={{ verticalAlign: 'middle', display: 'inline-block', ...style }} 
    className={className}
  >
    <path d="M18.244 2.25h3.308l-7.227 8.26 8.502 11.24H16.17l-5.214-6.817L4.99 21.75H1.68l7.73-8.835L1.254 2.25H8.08l4.713 6.231zm-1.161 17.52h1.833L7.084 4.126H5.117z" />
  </svg>
);

export const FacebookIcon: React.FC<IconProps> = ({ size = 18, color = 'currentColor', style, className }) => (
  <svg 
    width={size} 
    height={size} 
    viewBox="0 0 24 24" 
    fill="none" 
    stroke={color} 
    strokeWidth="1.8" 
    strokeLinecap="round" 
    strokeLinejoin="round" 
    style={{ verticalAlign: 'middle', display: 'inline-block', ...style }} 
    className={className}
  >
    <path d="M18 2h-3a5 5 0 0 0-5 5v3H7v4h3v8h4v-8h3l1-4h-4V7a1 1 0 0 1 1-1h3z"></path>
  </svg>
);

// 2. Pillars & Trust Badges Icons (Realistic Vector Engineering)
export const ChemistryFlaskIcon: React.FC<IconProps> = ({ size = 26, color = '#EAB308', style, className }) => (
  <svg 
    width={size} 
    height={size} 
    viewBox="0 0 24 24" 
    fill="none" 
    stroke={color} 
    strokeWidth="1.8" 
    strokeLinecap="round" 
    strokeLinejoin="round" 
    style={{ verticalAlign: 'middle', display: 'inline-block', ...style }} 
    className={className}
  >
    <path d="M9 3h6M10 3v5.2a2 2 0 0 1-.4 1.2L4.2 17.8A2 2 0 0 0 5.8 21h12.4a2 2 0 0 0 1.6-3.2L14.4 9.4A2 2 0 0 1 14 8.2V3" />
    <path d="M7 16h10" />
    <circle cx="10" cy="18" r="0.6" fill={color} />
    <circle cx="14" cy="18" r="0.6" fill={color} />
  </svg>
);

export const ShieldCheckIcon: React.FC<IconProps> = ({ size = 26, color = '#EAB308', style, className }) => (
  <svg 
    width={size} 
    height={size} 
    viewBox="0 0 24 24" 
    fill="none" 
    stroke={color} 
    strokeWidth="1.8" 
    strokeLinecap="round" 
    strokeLinejoin="round" 
    style={{ verticalAlign: 'middle', display: 'inline-block', ...style }} 
    className={className}
  >
    <path d="M12 22s8-4 8-10V5l-8-3-8 3v7c0 6 8 10 8 10z" />
    <path d="m9 12 2 2 4-4" />
  </svg>
);

export const CleanStudioIcon: React.FC<IconProps> = ({ size = 26, color = '#EAB308', style, className }) => (
  <svg 
    width={size} 
    height={size} 
    viewBox="0 0 24 24" 
    fill="none" 
    stroke={color} 
    strokeWidth="1.8" 
    strokeLinecap="round" 
    strokeLinejoin="round" 
    style={{ verticalAlign: 'middle', display: 'inline-block', ...style }} 
    className={className}
  >
    <path d="M3 21h18M3 10h18M5 6l7-3 7 3M4 10v11M20 10v11M8 14h2M8 18h2M14 14h2M14 18h2" />
    <circle cx="19" cy="4" r="1.5" fill={color} />
  </svg>
);

export const MasterTechIcon: React.FC<IconProps> = ({ size = 26, color = '#EAB308', style, className }) => (
  <svg 
    width={size} 
    height={size} 
    viewBox="0 0 24 24" 
    fill="none" 
    stroke={color} 
    strokeWidth="1.8" 
    strokeLinecap="round" 
    strokeLinejoin="round" 
    style={{ verticalAlign: 'middle', display: 'inline-block', ...style }} 
    className={className}
  >
    <path d="M14.7 6.3a1 1 0 0 0 0 1.4l1.6 1.6a1 1 0 0 0 1.4 0l3.77-3.77a6 6 0 0 1-7.94 7.94l-6.91 6.91a2.12 2.12 0 0 1-3-3l6.91-6.91a6 6 0 0 1 7.94-7.94l-3.76 3.76z" />
  </svg>
);

export const DiamondIcon: React.FC<IconProps> = ({ size = 24, color = '#EAB308', style, className }) => (
  <svg 
    width={size} 
    height={size} 
    viewBox="0 0 24 24" 
    fill="none" 
    stroke={color} 
    strokeWidth="1.8" 
    strokeLinecap="round" 
    strokeLinejoin="round" 
    style={{ verticalAlign: 'middle', display: 'inline-block', ...style }} 
    className={className}
  >
    <path d="M6 3h12l4 6-10 12L2 9z" />
    <path d="M2 9h20M10 21l-4-12 6-6 6 6-4 12" />
  </svg>
);

export const StarSealIcon: React.FC<IconProps> = ({ size = 24, color = '#EAB308', style, className }) => (
  <svg 
    width={size} 
    height={size} 
    viewBox="0 0 24 24" 
    fill="none" 
    stroke={color} 
    strokeWidth="1.8" 
    strokeLinecap="round" 
    strokeLinejoin="round" 
    style={{ verticalAlign: 'middle', display: 'inline-block', ...style }} 
    className={className}
  >
    <polygon points="12 2 15.09 8.26 22 9.27 17 14.14 18.18 21.02 12 17.77 5.82 21.02 7 14.14 2 9.27 8.91 8.26 12 2" fill={color} fillOpacity="0.25" />
  </svg>
);

// 3. Contact & Studio Action Icons
export const PhoneCallIcon: React.FC<IconProps> = ({ size = 18, color = 'currentColor', style, className }) => (
  <svg 
    width={size} 
    height={size} 
    viewBox="0 0 24 24" 
    fill="none" 
    stroke={color} 
    strokeWidth="1.8" 
    strokeLinecap="round" 
    strokeLinejoin="round" 
    style={{ verticalAlign: 'middle', display: 'inline-block', ...style }} 
    className={className}
  >
    <path d="M22 16.92v3a2 2 0 0 1-2.18 2 19.79 19.79 0 0 1-8.63-3.07 19.5 19.5 0 0 1-6-6 19.79 19.79 0 0 1-3.07-8.67A2 2 0 0 1 4.11 2h3a2 2 0 0 1 2 1.72 12.84 12.84 0 0 0 .7 2.81 2 2 0 0 1-.45 2.11L8.09 9.91a16 16 0 0 0 6 6l1.27-1.27a2 2 0 0 1 2.11-.45 12.84 12.84 0 0 0 2.81.7A2 2 0 0 1 22 16.92z" />
  </svg>
);

export const MailIcon: React.FC<IconProps> = ({ size = 18, color = 'currentColor', style, className }) => (
  <svg 
    width={size} 
    height={size} 
    viewBox="0 0 24 24" 
    fill="none" 
    stroke={color} 
    strokeWidth="1.8" 
    strokeLinecap="round" 
    strokeLinejoin="round" 
    style={{ verticalAlign: 'middle', display: 'inline-block', ...style }} 
    className={className}
  >
    <rect width="20" height="16" x="2" y="4" rx="2" />
    <path d="m22 7-8.97 5.7a1.94 1.94 0 0 1-2.06 0L2 7" />
  </svg>
);

export const ClockIcon: React.FC<IconProps> = ({ size = 18, color = 'currentColor', style, className }) => (
  <svg 
    width={size} 
    height={size} 
    viewBox="0 0 24 24" 
    fill="none" 
    stroke={color} 
    strokeWidth="1.8" 
    strokeLinecap="round" 
    strokeLinejoin="round" 
    style={{ verticalAlign: 'middle', display: 'inline-block', ...style }} 
    className={className}
  >
    <circle cx="12" cy="12" r="10" />
    <polyline points="12 6 12 12 16 14" />
  </svg>
);

export const MapPinIcon: React.FC<IconProps> = ({ size = 18, color = 'currentColor', style, className }) => (
  <svg 
    width={size} 
    height={size} 
    viewBox="0 0 24 24" 
    fill="none" 
    stroke={color} 
    strokeWidth="1.8" 
    strokeLinecap="round" 
    strokeLinejoin="round" 
    style={{ verticalAlign: 'middle', display: 'inline-block', ...style }} 
    className={className}
  >
    <path d="M20 10c0 6-8 12-8 12s-8-6-8-12a8 8 0 0 1 16 0Z" />
    <circle cx="12" cy="10" r="3" />
  </svg>
);

export const WhatsAppIcon: React.FC<IconProps> = ({ size = 18, color = '#25D366', style, className }) => (
  <svg 
    width={size} 
    height={size} 
    viewBox="0 0 24 24" 
    fill={color} 
    style={{ verticalAlign: 'middle', display: 'inline-block', ...style }} 
    className={className}
  >
    <path d="M12.04 2c-5.46 0-9.91 4.45-9.91 9.91 0 1.75.46 3.45 1.32 4.95L2.05 22l5.25-1.38c1.45.79 3.08 1.21 4.74 1.21 5.46 0 9.91-4.45 9.91-9.91 0-2.65-1.03-5.14-2.9-7.01A9.816 9.816 0 0 0 12.04 2m.01 1.67c2.2 0 4.26.86 5.82 2.42a8.225 8.225 0 0 1 2.41 5.83c0 4.54-3.7 8.24-8.24 8.24-1.48 0-2.93-.4-4.2-1.15l-.3-.18-3.12.82.83-3.04-.2-.31a8.196 8.196 0 0 1-1.26-4.38c0-4.54 3.7-8.24 8.24-8.24M8.53 7.33c-.16 0-.42.06-.64.3-.22.25-.85.83-.85 2.02s.87 2.35.99 2.51c.12.16 1.7 2.6 4.12 3.65.58.25 1.03.4 1.38.51.58.18 1.11.16 1.53.1.47-.07 1.44-.59 1.64-1.16.2-.57.2-1.06.14-1.16-.06-.1-.22-.16-.47-.29s-1.44-.71-1.66-.82c-.22-.11-.38-.16-.54.16-.16.33-.63.82-.77.99-.14.16-.29.18-.54.06s-1.05-.39-2-1.23c-.74-.66-1.24-1.47-1.39-1.72s-.02-.38.11-.5c.11-.11.25-.29.38-.44.12-.14.16-.25.25-.41.08-.16.04-.31-.02-.44s-.54-1.31-.74-1.8c-.2-.47-.4-.41-.54-.42z" />
  </svg>
);

// 4. Detailing Services SVG Icons
export const SparkleIcon: React.FC<IconProps> = ({ size = 22, color = '#EAB308', style, className }) => (
  <svg 
    width={size} 
    height={size} 
    viewBox="0 0 24 24" 
    fill="none" 
    stroke={color} 
    strokeWidth="1.8" 
    strokeLinecap="round" 
    strokeLinejoin="round" 
    style={{ verticalAlign: 'middle', display: 'inline-block', ...style }} 
    className={className}
  >
    <path d="m12 3-1.9 5.8a2 2 0 0 1-1.3 1.3L3 12l5.8 1.9a2 2 0 0 1 1.3 1.3L12 21l1.9-5.8a2 2 0 0 1 1.3-1.3L21 12l-5.8-1.9a2 2 0 0 1-1.3-1.3z" />
  </svg>
);

export const InteriorSeatIcon: React.FC<IconProps> = ({ size = 22, color = '#EAB308', style, className }) => (
  <svg 
    width={size} 
    height={size} 
    viewBox="0 0 24 24" 
    fill="none" 
    stroke={color} 
    strokeWidth="1.8" 
    strokeLinecap="round" 
    strokeLinejoin="round" 
    style={{ verticalAlign: 'middle', display: 'inline-block', ...style }} 
    className={className}
  >
    <path d="M7 18h10a2 2 0 0 0 2-2V9a2 2 0 0 0-2-2H7a2 2 0 0 0-2 2v7a2 2 0 0 0 2 2Z" />
    <path d="M5 14h14M7 7V4a1 1 0 0 1 1-1h8a1 1 0 0 1 1 1v3M6 21v-3M18 21v-3" />
  </svg>
);

export const PaintPolisherIcon: React.FC<IconProps> = ({ size = 22, color = '#EAB308', style, className }) => (
  <svg 
    width={size} 
    height={size} 
    viewBox="0 0 24 24" 
    fill="none" 
    stroke={color} 
    strokeWidth="1.8" 
    strokeLinecap="round" 
    strokeLinejoin="round" 
    style={{ verticalAlign: 'middle', display: 'inline-block', ...style }} 
    className={className}
  >
    <circle cx="12" cy="12" r="8" />
    <path d="M12 2v4M12 18v4M2 12h4M18 12h4" />
    <circle cx="12" cy="12" r="3" fill={color} />
  </svg>
);

export const CarArmorIcon: React.FC<IconProps> = ({ size = 22, color = '#EAB308', style, className }) => (
  <svg 
    width={size} 
    height={size} 
    viewBox="0 0 24 24" 
    fill="none" 
    stroke={color} 
    strokeWidth="1.8" 
    strokeLinecap="round" 
    strokeLinejoin="round" 
    style={{ verticalAlign: 'middle', display: 'inline-block', ...style }} 
    className={className}
  >
    <path d="M19 17h2c.6 0 1-.4 1-1v-3c0-.9-.7-1.7-1.5-1.9C18.7 10.6 16 10 16 10s-1.3-1.4-2.2-2.3c-.5-.4-1.1-.7-1.8-.7H5c-.6 0-1.1.4-1.4.9l-1.5 2.8C2.1 10.8 2 11 2 11.2V16c0 .6.4 1 1 1h2" />
    <circle cx="7" cy="17" r="2" />
    <path d="M9 17h6" />
    <circle cx="17" cy="17" r="2" />
  </svg>
);

export const EngineWrenchIcon: React.FC<IconProps> = ({ size = 22, color = '#EAB308', style, className }) => (
  <svg 
    width={size} 
    height={size} 
    viewBox="0 0 24 24" 
    fill="none" 
    stroke={color} 
    strokeWidth="1.8" 
    strokeLinecap="round" 
    strokeLinejoin="round" 
    style={{ verticalAlign: 'middle', display: 'inline-block', ...style }} 
    className={className}
  >
    <path d="M14.7 6.3a1 1 0 0 0 0 1.4l1.6 1.6a1 1 0 0 0 1.4 0l3.77-3.77a6 6 0 0 1-7.94 7.94l-6.91 6.91a2.12 2.12 0 0 1-3-3l6.91-6.91a6 6 0 0 1 7.94-7.94l-3.76 3.76z" />
  </svg>
);

export const WheelDiscIcon: React.FC<IconProps> = ({ size = 22, color = '#EAB308', style, className }) => (
  <svg 
    width={size} 
    height={size} 
    viewBox="0 0 24 24" 
    fill="none" 
    stroke={color} 
    strokeWidth="1.8" 
    strokeLinecap="round" 
    strokeLinejoin="round" 
    style={{ verticalAlign: 'middle', display: 'inline-block', ...style }} 
    className={className}
  >
    <circle cx="12" cy="12" r="10" />
    <circle cx="12" cy="12" r="4" />
    <line x1="12" y1="2" x2="12" y2="8" />
    <line x1="12" y1="16" x2="12" y2="22" />
    <line x1="2" y1="12" x2="8" y2="12" />
    <line x1="16" y1="12" x2="22" y2="12" />
  </svg>
);

export const SunUvIcon: React.FC<IconProps> = ({ size = 22, color = '#EAB308', style, className }) => (
  <svg 
    width={size} 
    height={size} 
    viewBox="0 0 24 24" 
    fill="none" 
    stroke={color} 
    strokeWidth="1.8" 
    strokeLinecap="round" 
    strokeLinejoin="round" 
    style={{ verticalAlign: 'middle', display: 'inline-block', ...style }} 
    className={className}
  >
    <circle cx="12" cy="12" r="4" />
    <path d="M12 2v2M12 20v2M4.93 4.93l1.41 1.41M17.66 17.66l1.41 1.41M2 12h2M20 12h2M6.34 17.66l-1.41 1.41M19.07 4.93l-1.41 1.41" />
  </svg>
);

export const SteamAirIcon: React.FC<IconProps> = ({ size = 22, color = '#EAB308', style, className }) => (
  <svg 
    width={size} 
    height={size} 
    viewBox="0 0 24 24" 
    fill="none" 
    stroke={color} 
    strokeWidth="1.8" 
    strokeLinecap="round" 
    strokeLinejoin="round" 
    style={{ verticalAlign: 'middle', display: 'inline-block', ...style }} 
    className={className}
  >
    <path d="M17.7 7.7a2.5 2.5 0 0 1 1.8 4.3H2M18.8 14.5A2 2 0 0 0 20 13a2 2 0 0 0-2-2H2M13.5 17.5A2.5 2.5 0 0 0 15 16a2.5 2.5 0 0 0-2.5-2.5H2" />
  </svg>
);

export const EcoLeafIcon: React.FC<IconProps> = ({ size = 22, color = '#EAB308', style, className }) => (
  <svg 
    width={size} 
    height={size} 
    viewBox="0 0 24 24" 
    fill="none" 
    stroke={color} 
    strokeWidth="1.8" 
    strokeLinecap="round" 
    strokeLinejoin="round" 
    style={{ verticalAlign: 'middle', display: 'inline-block', ...style }} 
    className={className}
  >
    <path d="M11 20A7 7 0 0 1 9.8 6.1C15.5 5 17 4.48 19 2c1 2 2 4.18 2 8 0 5.5-4.78 10-10 10Z" />
    <path d="M2 21c0-3 1.85-5.36 5.08-6C9.5 14.52 12 13 13 12" />
  </svg>
);

export const SearchGaugeIcon: React.FC<IconProps> = ({ size = 22, color = '#EAB308', style, className }) => (
  <svg 
    width={size} 
    height={size} 
    viewBox="0 0 24 24" 
    fill="none" 
    stroke={color} 
    strokeWidth="1.8" 
    strokeLinecap="round" 
    strokeLinejoin="round" 
    style={{ verticalAlign: 'middle', display: 'inline-block', ...style }} 
    className={className}
  >
    <circle cx="11" cy="11" r="8" />
    <line x1="21" y1="21" x2="16.65" y2="16.65" />
    <path d="M11 8v3l2 2" />
  </svg>
);

export const GearSettingIcon: React.FC<IconProps> = ({ size = 22, color = '#EAB308', style, className }) => (
  <svg 
    width={size} 
    height={size} 
    viewBox="0 0 24 24" 
    fill="none" 
    stroke={color} 
    strokeWidth="1.8" 
    strokeLinecap="round" 
    strokeLinejoin="round" 
    style={{ verticalAlign: 'middle', display: 'inline-block', ...style }} 
    className={className}
  >
    <circle cx="12" cy="12" r="3" />
    <path d="M19.4 15a1.65 1.65 0 0 0 .33 1.82l.06.06a2 2 0 0 1 0 2.83 2 2 0 0 1-2.83 0l-.06-.06a1.65 1.65 0 0 0-1.82-.33 1.65 1.65 0 0 0-1 1.51V21a2 2 0 0 1-2 2 2 2 0 0 1-2-2v-.09A1.65 1.65 0 0 0 9 19.4a1.65 1.65 0 0 0-1.82.33l-.06.06a2 2 0 0 1-2.83 0 2 2 0 0 1 0-2.83l.06-.06a1.65 1.65 0 0 0 .33-1.82 1.65 1.65 0 0 0-1.51-1H3a2 2 0 0 1-2-2 2 2 0 0 1 2-2h.09A1.65 1.65 0 0 0 4.6 9a1.65 1.65 0 0 0-.33-1.82l-.06-.06a2 2 0 0 1 0-2.83 2 2 0 0 1 2.83 0l.06.06a1.65 1.65 0 0 0 1.82.33H9a1.65 1.65 0 0 0 1-1.51V3a2 2 0 0 1 2-2 2 2 0 0 1 2 2v.09a1.65 1.65 0 0 0 1 1.51 1.65 1.65 0 0 0 1.82-.33l.06-.06a2 2 0 0 1 2.83 0 2 2 0 0 1 0 2.83l-.06.06a1.65 1.65 0 0 0-.33 1.82V9a1.65 1.65 0 0 0 1.51 1H21a2 2 0 0 1 2 2 2 2 0 0 1-2 2h-.09a1.65 1.65 0 0 0-1.51 1z" />
  </svg>
);

export const LightLampIcon: React.FC<IconProps> = ({ size = 22, color = '#EAB308', style, className }) => (
  <svg 
    width={size} 
    height={size} 
    viewBox="0 0 24 24" 
    fill="none" 
    stroke={color} 
    strokeWidth="1.8" 
    strokeLinecap="round" 
    strokeLinejoin="round" 
    style={{ verticalAlign: 'middle', display: 'inline-block', ...style }} 
    className={className}
  >
    <path d="M15 14c.2-1 .7-1.7 1.5-2.5 1-.9 1.5-2.2 1.5-3.5A6 6 0 0 0 6 8c0 1 .2 2.2 1.5 3.5.7.7 1.3 1.5 1.5 2.5" />
    <path d="M9 18h6M10 22h4" />
  </svg>
);

// 5. System, Theme & UI Dashboard Vector Icons
export const MoonIcon: React.FC<IconProps> = ({ size = 18, color = 'currentColor', style, className }) => (
  <svg 
    width={size} 
    height={size} 
    viewBox="0 0 24 24" 
    fill="none" 
    stroke={color} 
    strokeWidth="1.8" 
    strokeLinecap="round" 
    strokeLinejoin="round" 
    style={{ verticalAlign: 'middle', display: 'inline-block', ...style }} 
    className={className}
  >
    <path d="M12 3a6 6 0 0 0 9 9 9 9 0 1 1-9-9Z" />
  </svg>
);

export const SunIcon: React.FC<IconProps> = ({ size = 18, color = 'currentColor', style, className }) => (
  <svg 
    width={size} 
    height={size} 
    viewBox="0 0 24 24" 
    fill="none" 
    stroke={color} 
    strokeWidth="1.8" 
    strokeLinecap="round" 
    strokeLinejoin="round" 
    style={{ verticalAlign: 'middle', display: 'inline-block', ...style }} 
    className={className}
  >
    <circle cx="12" cy="12" r="4" />
    <path d="M12 2v2M12 20v2M4.93 4.93l1.41 1.41M17.66 17.66l1.41 1.41M2 12h2M20 12h2M6.34 17.66l-1.41 1.41M19.07 4.93l-1.41 1.41" />
  </svg>
);

export const BarChartIcon: React.FC<IconProps> = ({ size = 18, color = 'currentColor', style, className }) => (
  <svg 
    width={size} 
    height={size} 
    viewBox="0 0 24 24" 
    fill="none" 
    stroke={color} 
    strokeWidth="1.8" 
    strokeLinecap="round" 
    strokeLinejoin="round" 
    style={{ verticalAlign: 'middle', display: 'inline-block', ...style }} 
    className={className}
  >
    <line x1="12" y1="20" x2="12" y2="10" />
    <line x1="18" y1="20" x2="18" y2="4" />
    <line x1="6" y1="20" x2="6" y2="16" />
  </svg>
);

export const CalendarIcon: React.FC<IconProps> = ({ size = 18, color = 'currentColor', style, className }) => (
  <svg 
    width={size} 
    height={size} 
    viewBox="0 0 24 24" 
    fill="none" 
    stroke={color} 
    strokeWidth="1.8" 
    strokeLinecap="round" 
    strokeLinejoin="round" 
    style={{ verticalAlign: 'middle', display: 'inline-block', ...style }} 
    className={className}
  >
    <rect width="18" height="18" x="3" y="4" rx="2" ry="2" />
    <line x1="16" y1="2" x2="16" y2="6" />
    <line x1="8" y1="2" x2="8" y2="6" />
    <line x1="3" y1="10" x2="21" y2="10" />
  </svg>
);

export const UsersIcon: React.FC<IconProps> = ({ size = 18, color = 'currentColor', style, className }) => (
  <svg 
    width={size} 
    height={size} 
    viewBox="0 0 24 24" 
    fill="none" 
    stroke={color} 
    strokeWidth="1.8" 
    strokeLinecap="round" 
    strokeLinejoin="round" 
    style={{ verticalAlign: 'middle', display: 'inline-block', ...style }} 
    className={className}
  >
    <path d="M16 21v-2a4 4 0 0 0-4-4H6a4 4 0 0 0-4 4v2" />
    <circle cx="9" cy="7" r="4" />
    <path d="M22 21v-2a4 4 0 0 0-3-3.87" />
    <path d="M16 3.13a4 4 0 0 1 0 7.75" />
  </svg>
);

export const TrendingUpIcon: React.FC<IconProps> = ({ size = 18, color = 'currentColor', style, className }) => (
  <svg 
    width={size} 
    height={size} 
    viewBox="0 0 24 24" 
    fill="none" 
    stroke={color} 
    strokeWidth="1.8" 
    strokeLinecap="round" 
    strokeLinejoin="round" 
    style={{ verticalAlign: 'middle', display: 'inline-block', ...style }} 
    className={className}
  >
    <polyline points="22 7 13.5 15.5 8.5 10.5 2 17" />
    <polyline points="16 7 22 7 22 13" />
  </svg>
);

export const LockIcon: React.FC<IconProps> = ({ size = 18, color = 'currentColor', style, className }) => (
  <svg 
    width={size} 
    height={size} 
    viewBox="0 0 24 24" 
    fill="none" 
    stroke={color} 
    strokeWidth="1.8" 
    strokeLinecap="round" 
    strokeLinejoin="round" 
    style={{ verticalAlign: 'middle', display: 'inline-block', ...style }} 
    className={className}
  >
    <rect width="18" height="11" x="3" y="11" rx="2" ry="2" />
    <path d="M7 11V7a5 5 0 0 1 10 0v4" />
  </svg>
);

export const GlobeIcon: React.FC<IconProps> = ({ size = 18, color = 'currentColor', style, className }) => (
  <svg 
    width={size} 
    height={size} 
    viewBox="0 0 24 24" 
    fill="none" 
    stroke={color} 
    strokeWidth="1.8" 
    strokeLinecap="round" 
    strokeLinejoin="round" 
    style={{ verticalAlign: 'middle', display: 'inline-block', ...style }} 
    className={className}
  >
    <circle cx="12" cy="12" r="10" />
    <line x1="2" y1="12" x2="22" y2="12" />
    <path d="M12 2a15.3 15.3 0 0 1 4 10 15.3 15.3 0 0 1-4 10 15.3 15.3 0 0 1-4-10 15.3 15.3 0 0 1 4-10z" />
  </svg>
);

export const EyeIcon: React.FC<IconProps> = ({ size = 18, color = 'currentColor', style, className }) => (
  <svg 
    width={size} 
    height={size} 
    viewBox="0 0 24 24" 
    fill="none" 
    stroke={color} 
    strokeWidth="1.8" 
    strokeLinecap="round" 
    strokeLinejoin="round" 
    style={{ verticalAlign: 'middle', display: 'inline-block', ...style }} 
    className={className}
  >
    <path d="M2 12s3-7 10-7 10 7 10 7-3 7-10 7-10-7-10-7Z" />
    <circle cx="12" cy="12" r="3" />
  </svg>
);

export const LogoutIcon: React.FC<IconProps> = ({ size = 18, color = 'currentColor', style, className }) => (
  <svg 
    width={size} 
    height={size} 
    viewBox="0 0 24 24" 
    fill="none" 
    stroke={color} 
    strokeWidth="1.8" 
    strokeLinecap="round" 
    strokeLinejoin="round" 
    style={{ verticalAlign: 'middle', display: 'inline-block', ...style }} 
    className={className}
  >
    <path d="M9 21H5a2 2 0 0 1-2-2V5a2 2 0 0 1 2-2h4" />
    <polyline points="16 17 21 12 16 7" />
    <line x1="21" y1="12" x2="9" y2="12" />
  </svg>
);

export const AlertTriangleIcon: React.FC<IconProps> = ({ size = 18, color = 'currentColor', style, className }) => (
  <svg 
    width={size} 
    height={size} 
    viewBox="0 0 24 24" 
    fill="none" 
    stroke={color} 
    strokeWidth="1.8" 
    strokeLinecap="round" 
    strokeLinejoin="round" 
    style={{ verticalAlign: 'middle', display: 'inline-block', ...style }} 
    className={className}
  >
    <path d="m21.73 18-8-14a2 2 0 0 0-3.48 0l-8 14A2 2 0 0 0 4 21h16a2 2 0 0 0 1.73-3Z" />
    <line x1="12" y1="9" x2="12" y2="13" />
    <line x1="12" y1="17" x2="12.01" y2="17" />
  </svg>
);

export const CheckCircleIcon: React.FC<IconProps> = ({ size = 18, color = '#10B981', style, className }) => (
  <svg 
    width={size} 
    height={size} 
    viewBox="0 0 24 24" 
    fill="none" 
    stroke={color} 
    strokeWidth="1.8" 
    strokeLinecap="round" 
    strokeLinejoin="round" 
    style={{ verticalAlign: 'middle', display: 'inline-block', ...style }} 
    className={className}
  >
    <path d="M22 11.08V12a10 10 0 1 1-5.93-9.14" />
    <polyline points="22 4 12 14.01 9 11.01" />
  </svg>
);

export const FileTextIcon: React.FC<IconProps> = ({ size = 16, color = 'currentColor', style, className }) => (
  <svg 
    width={size} 
    height={size} 
    viewBox="0 0 24 24" 
    fill="none" 
    stroke={color} 
    strokeWidth="1.8" 
    strokeLinecap="round" 
    strokeLinejoin="round" 
    style={{ verticalAlign: 'middle', display: 'inline-block', ...style }} 
    className={className}
  >
    <path d="M14 2H6a2 2 0 0 0-2 2v16a2 2 0 0 0 2 2h12a2 2 0 0 0 2-2V8z" />
    <polyline points="14 2 14 8 20 8" />
    <line x1="16" y1="13" x2="8" y2="13" />
    <line x1="16" y1="17" x2="8" y2="17" />
    <polyline points="10 9 9 9 8 9" />
  </svg>
);

export const TrashBinIcon: React.FC<IconProps> = ({ size = 16, color = 'currentColor', style, className }) => (
  <svg 
    width={size} 
    height={size} 
    viewBox="0 0 24 24" 
    fill="none" 
    stroke={color} 
    strokeWidth="1.8" 
    strokeLinecap="round" 
    strokeLinejoin="round" 
    style={{ verticalAlign: 'middle', display: 'inline-block', ...style }} 
    className={className}
  >
    <polyline points="3 6 5 6 21 6" />
    <path d="M19 6v14a2 2 0 0 1-2 2H7a2 2 0 0 1-2-2V6m3 0V4a2 2 0 0 1 2-2h4a2 2 0 0 1 2 2v2" />
    <line x1="10" y1="11" x2="10" y2="17" />
    <line x1="14" y1="11" x2="14" y2="17" />
  </svg>
);

export const MenuIcon: React.FC<IconProps> = ({ size = 20, color = 'currentColor', style, className }) => (
  <svg 
    width={size} 
    height={size} 
    viewBox="0 0 24 24" 
    fill="none" 
    stroke={color} 
    strokeWidth="2" 
    strokeLinecap="round" 
    strokeLinejoin="round" 
    style={{ verticalAlign: 'middle', display: 'inline-block', ...style }} 
    className={className}
  >
    <line x1="3" y1="12" x2="21" y2="12"></line>
    <line x1="3" y1="6" x2="21" y2="6"></line>
    <line x1="3" y1="18" x2="21" y2="18"></line>
  </svg>
);

export const CloseIcon: React.FC<IconProps> = ({ size = 20, color = 'currentColor', style, className }) => (
  <svg 
    width={size} 
    height={size} 
    viewBox="0 0 24 24" 
    fill="none" 
    stroke={color} 
    strokeWidth="2" 
    strokeLinecap="round" 
    strokeLinejoin="round" 
    style={{ verticalAlign: 'middle', display: 'inline-block', ...style }} 
    className={className}
  >
    <line x1="18" y1="6" x2="6" y2="18"></line>
    <line x1="6" y1="6" x2="18" y2="18"></line>
  </svg>
);

export const ServicesWorksIcon: React.FC<IconProps> = ({ size = 18, color = 'currentColor', style, className }) => (
  <svg 
    width={size} 
    height={size} 
    viewBox="0 0 24 24" 
    fill="none" 
    stroke={color} 
    strokeWidth="1.8" 
    strokeLinecap="round" 
    strokeLinejoin="round" 
    style={{ verticalAlign: 'middle', display: 'inline-block', ...style }} 
    className={className}
  >
    <path d="M14.7 6.3a1 1 0 0 0 0 1.4l1.6 1.6a1 1 0 0 0 1.4 0l3.77-3.77a6 6 0 0 1-7.94 7.94l-6.91 6.91a2.12 2.12 0 0 1-3-3l6.91-6.91a6 6 0 0 1 7.94-7.94l-3.76 3.76z" />
    <path d="M2 12h3M19 12h3M12 2v3M12 19v3" />
    <circle cx="12" cy="12" r="3" />
  </svg>
);
