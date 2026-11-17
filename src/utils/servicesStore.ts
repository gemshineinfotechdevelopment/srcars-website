import { useState, useEffect } from 'react';
import detailAfterImg from '../assets/detail_after.jpg';
import technicianImg from '../assets/service_technician.jpg';
import interiorImg from '../assets/interior_detailing.jpg';
import techCarImg from '../assets/tech_car.jpg';

export interface ServiceFeature {
  title: string;
  desc: string;
}

export interface ServiceItem {
  id: string;
  name: string;
  shortName: string;
  tag: string;
  thumbnail: string;
  shortDesc: string;
  showcaseTitle: string;
  showcaseImg: string;
  features: ServiceFeature[];
  addon: string;
}

import { API_ENDPOINTS } from '../config/api';

const STORAGE_KEY = 'cc_services_catalog_v1';
const API_URL = API_ENDPOINTS.services;

export const defaultServicesCatalog: ServiceItem[] = [
  {
    id: 'ceramic',
    name: 'Ceramic & Graphene',
    shortName: 'Ceramic',
    tag: 'HOT',
    thumbnail: detailAfterImg,
    shortDesc: 'Multi-layer high-solids hydrophobic coating delivering deep optical gloss & UV defense.',
    showcaseTitle: 'CERAMIC COATING & PAINT ARMOR',
    showcaseImg: technicianImg,
    features: [
      { title: '10H Diamond Hardness', desc: 'Highest scratch resistance certified by international hardness tests.' },
      { title: 'Dual-Layer Self-Healing Matrix', desc: 'Micro-scratches vanish under direct solar heat activation.' },
      { title: '5-Year Factory Warranty', desc: 'Official logged warranty with nationwide gloss retention guarantee.' },
      { title: 'UV & Chemical Shield', desc: 'Resists acid rain, industrial fallout, tree sap, and harsh detergents.' }
    ],
    addon: 'Includes Full Multi-Stage Decontamination & Alcohol Prep'
  },
  {
    id: 'interior',
    name: 'Interior Sanctuary Spa',
    shortName: 'Interior',
    tag: 'RESTORE',
    thumbnail: interiorImg,
    shortDesc: 'Deep leather conditioning, steam sanitization, and antibacterial cabin treatment.',
    showcaseTitle: 'CONCOURS INTERIOR RESTORATION',
    showcaseImg: interiorImg,
    features: [
      { title: 'Swissvax Leather Balm', desc: 'Nourishing oils restoring suppleness to Italian Nappa and Merino hides.' },
      { title: 'High-Pressure Steam Extraction', desc: 'Eliminates 99.9% of bacteria and allergens embedded in carpets.' },
      { title: 'Ozone Cabin Sterilization', desc: 'Hospital-grade molecular deodorizing neutralizing stubborn odors.' },
      { title: 'Matte UV Dashboard Shield', desc: 'Zero greasy residue protection against dashboard drying and cracking.' }
    ],
    addon: 'Includes AC Vent Ozone Purge & Alcantara Brush Detailing'
  },
  {
    id: 'paint-correction',
    name: 'Paint Correction',
    shortName: 'Correction',
    tag: 'STAGE 2/3',
    thumbnail: technicianImg,
    shortDesc: 'Precision rotary & orbital buffing removing up to 95% of swirl marks & clear coat haze.',
    showcaseTitle: 'STAGE 2 & 3 MIRROR PAINT CORRECTION',
    showcaseImg: technicianImg,
    features: [
      { title: 'Digital Paint Depth Gauging', desc: 'Ultrasonic micrometer assessment ensuring clear coat integrity.' },
      { title: 'Diminishing Abrasive Micro-Polishing', desc: 'Safely levels orange peel and clears micro-scratches permanently.' },
      { title: 'Full Spectrum CRI Inspection', desc: 'Identifies buffer trails and holograms under specialized LED arrays.' },
      { title: 'Jeweling Compound Finish', desc: 'Extracts deep wet-look reflection ready for ceramic or film bond.' }
    ],
    addon: 'Includes 3-Step IPA Wipe-Down & Inspection Certificate'
  },
  {
    id: 'ppf',
    name: 'Full Body Armor PPF',
    shortName: 'PPF Armor',
    tag: 'ULTIMATE',
    thumbnail: techCarImg,
    shortDesc: 'Self-healing TPU film repelling stone chips, road debris, and chemical staining.',
    showcaseTitle: 'SELF-HEALING OPTICAL TPU PPF',
    showcaseImg: techCarImg,
    features: [
      { title: 'Instant Heat Self-Healing', desc: 'Surface swirls disappear automatically when exposed to sunlight or warm water.' },
      { title: 'Pre-Cut Computerized Patterns', desc: 'Zero razor blades on vehicle paintwork; wrap-around invisible edges.' },
      { title: '10-Year Anti-Yellowing Bond', desc: 'Optical clarity with zero orange peel or adhesive discoloration.' },
      { title: 'Hydrophobic Top-Coat Infused', desc: 'Water and dirt bead off instantaneously at highway velocities.' }
    ],
    addon: 'Includes Wrapped Edge Alignment & Ceramic Top-Coat Layer'
  }
];

export const getStoredServices = (): ServiceItem[] => {
  const saved = localStorage.getItem(STORAGE_KEY);
  if (!saved) {
    localStorage.setItem(STORAGE_KEY, JSON.stringify(defaultServicesCatalog));
    return defaultServicesCatalog;
  }
  try {
    const parsed = JSON.parse(saved);
    return Array.isArray(parsed) && parsed.length > 0 ? parsed : defaultServicesCatalog;
  } catch {
    return defaultServicesCatalog;
  }
};

export const fetchRemoteServices = async (): Promise<ServiceItem[]> => {
  try {
    const res = await fetch(API_URL, { signal: AbortSignal.timeout(3000) });
    if (res.ok) {
      const json = await res.json();
      if (json.success && Array.isArray(json.data) && json.data.length > 0) {
        // Map any image assets if empty
        const mapped = json.data.map((s: any, idx: number) => ({
          ...s,
          thumbnail: s.thumbnail || defaultServicesCatalog[idx % defaultServicesCatalog.length].thumbnail,
          showcaseImg: s.showcaseImg || defaultServicesCatalog[idx % defaultServicesCatalog.length].showcaseImg
        }));
        localStorage.setItem(STORAGE_KEY, JSON.stringify(mapped));
        window.dispatchEvent(new Event('cc_services_updated'));
        return mapped;
      }
    }
  } catch {
    // Return local
  }
  return getStoredServices();
};

export const saveServiceItem = async (service: ServiceItem): Promise<ServiceItem[]> => {
  const current = getStoredServices();
  const index = current.findIndex(s => s.id === service.id);
  let updated: ServiceItem[];
  
  if (index >= 0) {
    updated = [...current];
    updated[index] = service;
  } else {
    updated = [...current, service];
  }

  localStorage.setItem(STORAGE_KEY, JSON.stringify(updated));
  window.dispatchEvent(new Event('cc_services_updated'));

  // Sync to backend MongoDB
  try {
    if (index >= 0) {
      await fetch(`${API_URL}/${service.id}`, {
        method: 'PUT',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify(service)
      });
    } else {
      await fetch(API_URL, {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify(service)
      });
    }
  } catch (e) {
    console.warn('Failed to sync service to server:', e);
  }

  return updated;
};

export const deleteServiceItem = async (id: string): Promise<ServiceItem[]> => {
  const current = getStoredServices();
  const updated = current.filter(s => s.id !== id);
  localStorage.setItem(STORAGE_KEY, JSON.stringify(updated));
  window.dispatchEvent(new Event('cc_services_updated'));

  try {
    await fetch(`${API_URL}/${id}`, { method: 'DELETE' });
  } catch (e) {
    console.warn('Failed to delete service from server:', e);
  }

  return updated;
};

export const useServicesList = (): ServiceItem[] => {
  const [services, setServices] = useState<ServiceItem[]>(getStoredServices);

  useEffect(() => {
    fetchRemoteServices().then(setServices);

    const handleUpdate = () => {
      setServices(getStoredServices());
    };

    window.addEventListener('cc_services_updated', handleUpdate);
    window.addEventListener('storage', handleUpdate);
    return () => {
      window.removeEventListener('cc_services_updated', handleUpdate);
      window.removeEventListener('storage', handleUpdate);
    };
  }, []);

  return services;
};
