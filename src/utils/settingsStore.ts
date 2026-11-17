import { useState, useEffect } from 'react';

export interface SiteSettings {
  siteName: string;
  phone: string;
  address: string;
  email: string;
  operatingHours: string;
  locations?: string[];
  updatedAt?: string;
}

export const defaultSiteSettings: SiteSettings = {
  siteName: 'Car Care Luxury Detailing',
  phone: '+91 98765 43210',
  address: 'Grand Southern Trunk Rd, Auto Bay Complex, Guindy, Chennai, Tamil Nadu 600032',
  email: 'bookings@carcare.com',
  operatingHours: 'Monday – Saturday: 8:30 AM – 8:00 PM',
  locations: [
    'Chennai (4 Bays)',
    'Bangalore (6 Bays)',
    'Coimbatore (3 Bays)'
  ]
};

import { API_ENDPOINTS } from '../config/api';

const SETTINGS_KEY = 'cc_site_settings_data';
const API_URL = API_ENDPOINTS.settings;

export const getSiteSettings = (): SiteSettings => {
  try {
    const raw = localStorage.getItem(SETTINGS_KEY);
    if (!raw) {
      localStorage.setItem(SETTINGS_KEY, JSON.stringify(defaultSiteSettings));
      return defaultSiteSettings;
    }
    return { ...defaultSiteSettings, ...JSON.parse(raw) };
  } catch (err) {
    console.warn('Failed to parse settings from storage:', err);
    return defaultSiteSettings;
  }
};

export const fetchRemoteSettings = async (): Promise<SiteSettings> => {
  try {
    const res = await fetch(API_URL, { signal: AbortSignal.timeout(3000) });
    if (!res.ok) throw new Error(`HTTP ${res.status}`);
    const json = await res.json();
    if (json.success && json.data) {
      const merged: SiteSettings = {
        siteName: json.data.siteName || defaultSiteSettings.siteName,
        phone: json.data.phone || defaultSiteSettings.phone,
        address: json.data.address || defaultSiteSettings.address,
        email: json.data.email || defaultSiteSettings.email,
        operatingHours: json.data.operatingHours || defaultSiteSettings.operatingHours,
        locations: json.data.locations || defaultSiteSettings.locations,
        updatedAt: json.data.updatedAt
      };
      localStorage.setItem(SETTINGS_KEY, JSON.stringify(merged));
      window.dispatchEvent(new Event('cc_settings_updated'));
      return merged;
    }
  } catch (err) {
    // Backend offline or timeout -> gracefully fallback to local
  }
  return getSiteSettings();
};

export const saveSiteSettings = async (updates: Partial<SiteSettings>): Promise<SiteSettings> => {
  const current = getSiteSettings();
  const updated: SiteSettings = {
    ...current,
    ...updates,
    updatedAt: new Date().toISOString()
  };

  // 1. Immediately persist locally & notify all listening components
  try {
    localStorage.setItem(SETTINGS_KEY, JSON.stringify(updated));
    window.dispatchEvent(new Event('cc_settings_updated'));
  } catch (e) {
    console.error('LocalStorage write failed:', e);
  }

  // 2. Persist to Backend Server (MongoDB Atlas)
  try {
    const res = await fetch(API_URL, {
      method: 'PUT',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify(updated),
      signal: AbortSignal.timeout(4000)
    });
    if (res.ok) {
      const json = await res.json();
      if (json.success && json.data) {
        const synced = { ...updated, ...json.data };
        localStorage.setItem(SETTINGS_KEY, JSON.stringify(synced));
        window.dispatchEvent(new Event('cc_settings_updated'));
        return synced;
      }
    }
  } catch (err) {
    console.warn('Backend sync failed, changes saved locally:', err);
  }

  return updated;
};

// React hook for any component to subscribe to live site settings
export const useSiteSettings = () => {
  const [settings, setSettings] = useState<SiteSettings>(getSiteSettings);

  useEffect(() => {
    // Initial fetch from backend if reachable
    fetchRemoteSettings().then((remote) => setSettings(remote));

    const handleUpdate = () => {
      setSettings(getSiteSettings());
    };

    const handleStorage = (e: StorageEvent) => {
      if (e.key === SETTINGS_KEY) {
        handleUpdate();
      }
    };

    window.addEventListener('cc_settings_updated', handleUpdate);
    window.addEventListener('storage', handleStorage);
    return () => {
      window.removeEventListener('cc_settings_updated', handleUpdate);
      window.removeEventListener('storage', handleStorage);
    };
  }, []);

  return settings;
};

