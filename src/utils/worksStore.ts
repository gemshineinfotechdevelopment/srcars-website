import { useState, useEffect } from 'react';
import heroCarImg from '../assets/hero_car.jpg';
import technicianImg from '../assets/service_technician.jpg';
import interiorImg from '../assets/interior_detailing.jpg';
import techCarImg from '../assets/tech_car.jpg';
import detailAfterImg from '../assets/detail_after.jpg';
import detailBeforeImg from '../assets/detail_before.jpg';
import showcaseCarImg from '../assets/showcase_car.jpg';
import { API_ENDPOINTS } from '../config/api';

export interface WorkItem {
  id: string;
  title: string;
  category: string;
  service: string;
  beforeImg: string;
  afterImg: string;
  img?: string; // alias to afterImg for backwards compatibility
  duration: string;
  warranty: string;
  description: string;
}

const STORAGE_KEY = 'cc_works_catalog_v1';
const API_URL = API_ENDPOINTS.works;

const assetMap: Record<string, string> = {
  '/assets/hero_car.jpg': heroCarImg,
  '/assets/service_technician.jpg': technicianImg,
  '/assets/interior_detailing.jpg': interiorImg,
  '/assets/tech_car.jpg': techCarImg,
  '/assets/detail_after.jpg': detailAfterImg,
  '/assets/detail_before.jpg': detailBeforeImg,
  '/assets/showcase_car.jpg': showcaseCarImg,
  'hero_car.jpg': heroCarImg,
  'service_technician.jpg': technicianImg,
  'interior_detailing.jpg': interiorImg,
  'tech_car.jpg': techCarImg,
  'detail_after.jpg': detailAfterImg,
  'detail_before.jpg': detailBeforeImg,
  'showcase_car.jpg': showcaseCarImg,
};

export const resolveWorkImage = (imgPath: string | undefined, defaultFallback: string = detailAfterImg): string => {
  if (!imgPath || imgPath.trim() === '') return defaultFallback;
  if (imgPath.startsWith('data:') || imgPath.startsWith('http://') || imgPath.startsWith('https://') || imgPath.startsWith('blob:')) {
    return imgPath;
  }
  if (assetMap[imgPath]) return assetMap[imgPath];
  const basename = imgPath.split('/').pop();
  if (basename && assetMap[basename]) return assetMap[basename];
  return imgPath;
};

export const defaultWorksCatalog: WorkItem[] = [
  {
    id: 'mclaren-720s',
    title: 'McLaren 720S Performance',
    category: 'CERAMIC',
    service: '9H Double Coat Ceramic Armor & Glaze',
    beforeImg: detailBeforeImg,
    afterImg: heroCarImg,
    img: heroCarImg,
    duration: '3 Days',
    warranty: '5-Year Guarantee',
    description: 'Multi-layer ultra-hydrophobic ceramic glass coating with optical gloss enhancement on Papaya Spark metallic paint.'
  },
  {
    id: 'porsche-gt3',
    title: 'Porsche 911 GT3 RS',
    category: 'PAINT CORRECTION',
    service: 'Stage 3 Concours Paint Correction & Sealant',
    beforeImg: detailBeforeImg,
    afterImg: technicianImg,
    img: technicianImg,
    duration: '48 Hours',
    warranty: '100% Swirl-Free',
    description: 'Micrometer-calibrated orbital polishing eliminating 95% of track-day clear coat haze and swirl trails.'
  },
  {
    id: 'mercedes-g63',
    title: 'Mercedes-AMG G63',
    category: 'INTERIOR',
    service: 'Concours Leather Spa & Ozone Sanitization',
    beforeImg: detailBeforeImg,
    afterImg: interiorImg,
    img: interiorImg,
    duration: '24 Hours',
    warranty: 'Hospital Grade',
    description: 'Full Swissvax leather restoration, high-pressure steam extraction of deep carpets, and active ozone deodorization.'
  },
  {
    id: 'bmw-m4',
    title: 'BMW M4 Competition',
    category: 'CERAMIC',
    service: 'Gloss Black Revival & 10H Graphene Shield',
    beforeImg: detailBeforeImg,
    afterImg: techCarImg,
    img: techCarImg,
    duration: '3 Days',
    warranty: '7-Year Guarantee',
    description: 'Diamond hardness graphene infusion defending against acid rain, UV radiation, and high-temp brake dust fallout.'
  },
  {
    id: 'audi-rs7',
    title: 'Audi RS7 Sportback',
    category: 'PPF',
    service: 'Full Body Self-Healing Optical TPU PPF',
    beforeImg: detailBeforeImg,
    afterImg: detailAfterImg,
    img: detailAfterImg,
    duration: '4 Days',
    warranty: '10-Year Anti-Yellow',
    description: 'Wrap-around invisible edge protection guarding front bumper, hood, and rocker panels from highway stone chips.'
  },
  {
    id: 'lamborghini-huracan',
    title: 'Lamborghini Huracán EVO',
    category: 'PPF',
    service: 'Stealth Matte Armor PPF & Ceramic Topcoat',
    beforeImg: detailBeforeImg,
    afterImg: showcaseCarImg,
    img: showcaseCarImg,
    duration: '5 Days',
    warranty: '10-Year Guarantee',
    description: 'Satin finish TPU wrap with built-in instant thermal self-healing properties activated under direct sun heat.'
  }
];

export const getStoredWorks = (): WorkItem[] => {
  const saved = localStorage.getItem(STORAGE_KEY);
  if (!saved) {
    localStorage.setItem(STORAGE_KEY, JSON.stringify(defaultWorksCatalog));
    return defaultWorksCatalog;
  }
  try {
    const parsed = JSON.parse(saved);
    if (Array.isArray(parsed) && parsed.length > 0) {
      return parsed.map((item: any) => {
        const afterResolved = resolveWorkImage(item.afterImg || item.img, detailAfterImg);
        const beforeResolved = resolveWorkImage(item.beforeImg, detailBeforeImg);
        return {
          ...item,
          beforeImg: beforeResolved,
          afterImg: afterResolved,
          img: afterResolved,
        };
      });
    }
    return defaultWorksCatalog;
  } catch {
    return defaultWorksCatalog;
  }
};

export const fetchRemoteWorks = async (): Promise<WorkItem[]> => {
  try {
    const res = await fetch(API_URL, { signal: AbortSignal.timeout(3500) });
    if (res.ok) {
      const json = await res.json();
      if (json.success && Array.isArray(json.data) && json.data.length > 0) {
        const mapped = json.data.map((item: any) => {
          const afterResolved = resolveWorkImage(item.afterImg || item.img, detailAfterImg);
          const beforeResolved = resolveWorkImage(item.beforeImg, detailBeforeImg);
          return {
            ...item,
            beforeImg: beforeResolved,
            afterImg: afterResolved,
            img: afterResolved,
          };
        });
        localStorage.setItem(STORAGE_KEY, JSON.stringify(mapped));
        window.dispatchEvent(new Event('cc_works_updated'));
        return mapped;
      }
    }
  } catch {
    // Return local
  }
  return getStoredWorks();
};

export const saveWorkItem = async (work: WorkItem): Promise<WorkItem[]> => {
  const current = getStoredWorks();
  const index = current.findIndex(w => w.id === work.id);
  let updated: WorkItem[];

  const sanitized: WorkItem = {
    ...work,
    img: work.afterImg || work.img || detailAfterImg
  };

  if (index >= 0) {
    updated = [...current];
    updated[index] = sanitized;
  } else {
    updated = [...current, sanitized];
  }

  try {
    localStorage.setItem(STORAGE_KEY, JSON.stringify(updated));
  } catch (err) {
    console.warn('localStorage setItem warning:', err);
  }
  window.dispatchEvent(new Event('cc_works_updated'));

  // Sync to backend MongoDB
  try {
    const method = index >= 0 ? 'PUT' : 'POST';
    const url = index >= 0 ? `${API_URL}/${work.id}` : API_URL;
    const res = await fetch(url, {
      method,
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify(sanitized)
    });
    if (!res.ok && method === 'PUT') {
      await fetch(API_URL, {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify(sanitized)
      });
    }
  } catch (e) {
    console.warn('Failed to sync work item to server:', e);
  }

  return updated;
};

export const deleteWorkItem = async (id: string): Promise<WorkItem[]> => {
  const current = getStoredWorks();
  const updated = current.filter(w => w.id !== id);
  localStorage.setItem(STORAGE_KEY, JSON.stringify(updated));
  window.dispatchEvent(new Event('cc_works_updated'));

  try {
    await fetch(`${API_URL}/${id}`, { method: 'DELETE' });
  } catch (e) {
    console.warn('Failed to delete work item on server:', e);
  }

  return updated;
};

export const useWorksList = (): WorkItem[] => {
  const [works, setWorks] = useState<WorkItem[]>(getStoredWorks);

  useEffect(() => {
    fetchRemoteWorks().then(setWorks);

    const handleUpdate = () => {
      setWorks(getStoredWorks());
    };

    window.addEventListener('cc_works_updated', handleUpdate);
    const handleStorage = (e: StorageEvent) => {
      if (e.key === STORAGE_KEY) handleUpdate();
    };
    window.addEventListener('storage', handleStorage);

    return () => {
      window.removeEventListener('cc_works_updated', handleUpdate);
      window.removeEventListener('storage', handleStorage);
    };
  }, []);

  return works;
};
