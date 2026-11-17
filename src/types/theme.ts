// TypeScript Design Tokens and Theme Types for Car Care

export type ThemeMode = 'light' | 'dark';

export interface ThemeColors {
  yellow: string;
  yellowAccent: string;
  yellowLight: string;
  yellowDark: string;
  bgMain: string;
  bgSubtle: string;
  bgCard: string;
  bgCardHover: string;
  bgGlass: string;
  borderSubtle: string;
  borderMedium: string;
  borderYellow: string;
  textPrimary: string;
  textSecondary: string;
  textMuted: string;
}

export const lightTheme: ThemeColors = {
  yellow: '#EAB308',
  yellowAccent: '#FFE600',
  yellowLight: '#FFF04D',
  yellowDark: '#CA8A04',
  bgMain: '#FFFFFF',
  bgSubtle: '#F8FAFC',
  bgCard: '#FFFFFF',
  bgCardHover: '#F8FAFC',
  bgGlass: 'rgba(255, 255, 255, 0.88)',
  borderSubtle: 'rgba(0, 0, 0, 0.08)',
  borderMedium: 'rgba(0, 0, 0, 0.14)',
  borderYellow: 'rgba(234, 179, 8, 0.45)',
  textPrimary: '#0F172A',
  textSecondary: '#475569',
  textMuted: '#64748B',
};

export const darkTheme: ThemeColors = {
  yellow: '#FFE600',
  yellowAccent: '#FFE600',
  yellowLight: '#FFF04D',
  yellowDark: '#D4BE00',
  bgMain: '#060709',
  bgSubtle: '#0C0E12',
  bgCard: 'rgba(18, 21, 28, 0.88)',
  bgCardHover: 'rgba(26, 30, 40, 0.95)',
  bgGlass: 'rgba(15, 17, 23, 0.85)',
  borderSubtle: 'rgba(255, 255, 255, 0.08)',
  borderMedium: 'rgba(255, 255, 255, 0.16)',
  borderYellow: 'rgba(255, 230, 0, 0.45)',
  textPrimary: '#FFFFFF',
  textSecondary: '#9CA3AF',
  textMuted: '#6B7280',
};
