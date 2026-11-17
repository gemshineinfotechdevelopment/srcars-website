import type { BookingRecord, BookingStatus } from '../types/booking';
import { syncCustomerFromBooking } from './customerStore';

export const getServicePrice = (service: string): string => {
  const s = service.toLowerCase();
  if (s.includes('ppf') || s.includes('body armor')) return '₹4,999';
  if (s.includes('paint') || s.includes('correction')) return '₹2,199';
  if (s.includes('interior') || s.includes('sanctuary') || s.includes('spa')) return '₹1,499';
  if (s.includes('ceramic') || s.includes('graphene')) return '₹899';
  if (s.includes('wheel') || s.includes('caliper')) return '₹1,199';
  if (s.includes('engine')) return '₹799';
  return '₹899';
};

const STORAGE_KEY = 'cc_admin_bookings_data';
const BOOKINGS_API = 'http://localhost:5000/api/bookings';

const initialDemoBookings: BookingRecord[] = [
  {
    id: 'CC-948123',
    customerName: 'Vikramaditya Roy',
    phone: '+91 98401 23456',
    carModel: 'Porsche 911 GT3 RS',
    service: 'Ceramic & Graphene Coating',
    date: '2026-11-18',
    status: 'Confirmed',
    notes: 'Requested extra 2 layers on front hood and ceramic caliper protection.',
    price: '₹899',
    studio: 'Chennai Studio (Guindy)',
    createdAt: '2026-11-15T10:30:00Z',
  },
  {
    id: 'CC-812049',
    customerName: 'Ananya Deshmukh',
    phone: '+91 97112 88490',
    carModel: 'McLaren 720S Spider',
    service: 'Full Body Armor PPF',
    date: '2026-11-19',
    status: 'Pending',
    notes: 'Doorstep enclosed flatbed pickup required from ECR villa.',
    price: '₹4,999',
    studio: 'Chennai Studio (Guindy)',
    createdAt: '2026-11-16T08:15:00Z',
  },
  {
    id: 'CC-736201',
    customerName: 'Rajesh K. Sundaram',
    phone: '+91 94441 55678',
    carModel: 'Mercedes-AMG G63',
    service: 'Interior Sanctuary Spa',
    date: '2026-11-16',
    status: 'In Bay',
    notes: 'Swissvax leather re-nourishment and full ozone AC purge in progress.',
    price: '₹1,499',
    studio: 'Bangalore Studio (Indiranagar)',
    createdAt: '2026-11-14T14:20:00Z',
  },
  {
    id: 'CC-654912',
    customerName: 'Karthik Narayanan',
    phone: '+91 98840 99123',
    carModel: 'BMW M4 Competition',
    service: 'Stage 2/3 Paint Correction',
    date: '2026-11-17',
    status: 'Confirmed',
    notes: 'Clear coat measurement revealed track-day swirl marks. Level 2 rotary buffing needed.',
    price: '₹2,199',
    studio: 'Coimbatore Studio (Peelamedu)',
    createdAt: '2026-11-15T16:45:00Z',
  },
  {
    id: 'CC-521980',
    customerName: 'Deepak Chawla',
    phone: '+91 99001 44556',
    carModel: 'Audi RS7 Sportback',
    service: 'Ceramic & Graphene Coating',
    date: '2026-11-14',
    status: 'Completed',
    notes: 'Completed with 10H dual matrix cure. 5-year warranty logged and delivered.',
    price: '₹899',
    studio: 'Bangalore Studio (Indiranagar)',
    createdAt: '2026-11-12T11:00:00Z',
  },
];

export const getBookings = (): BookingRecord[] => {
  try {
    const raw = localStorage.getItem(STORAGE_KEY);
    if (!raw) {
      localStorage.setItem(STORAGE_KEY, JSON.stringify(initialDemoBookings));
      return initialDemoBookings;
    }
    return JSON.parse(raw);
  } catch (err) {
    console.error('Failed to load bookings from storage', err);
    return initialDemoBookings;
  }
};

export const saveBooking = (newRecord: Omit<BookingRecord, 'id' | 'createdAt'> & { id?: string }): BookingRecord => {
  const current = getBookings();
  const calculatedPrice = newRecord.price || getServicePrice(newRecord.service);
  const fullRecord: BookingRecord = {
    id: newRecord.id || `CC-${Math.floor(100000 + Math.random() * 900000)}`,
    customerName: newRecord.customerName,
    phone: newRecord.phone,
    carModel: newRecord.carModel,
    service: newRecord.service,
    date: newRecord.date,
    status: newRecord.status || 'Pending',
    notes: newRecord.notes || '',
    price: calculatedPrice,
    studio: newRecord.studio || 'Chennai Studio (Guindy)',
    createdAt: new Date().toISOString(),
  };

  const updated = [fullRecord, ...current];
  try {
    localStorage.setItem(STORAGE_KEY, JSON.stringify(updated));
    window.dispatchEvent(new Event('cc_bookings_updated'));
    // Automatically create or update customer in directory
    syncCustomerFromBooking(fullRecord);
    // Sync with MongoDB backend server
    fetch(BOOKINGS_API, {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify(fullRecord)
    }).catch((e) => console.warn('Backend booking sync deferred:', e.message));
  } catch (err) {
    console.error('Failed to save booking', err);
  }

  return fullRecord;
};

export const updateBookingStatus = (id: string, status: BookingStatus): void => {
  const current = getBookings();
  const updated = current.map((item) => (item.id === id ? { ...item, status } : item));
  try {
    localStorage.setItem(STORAGE_KEY, JSON.stringify(updated));
    window.dispatchEvent(new Event('cc_bookings_updated'));
    fetch(`${BOOKINGS_API}/${id}`, {
      method: 'PUT',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({ status })
    }).catch(() => {});
  } catch (err) {
    console.error('Failed to update booking status', err);
  }
};

export const updateBooking = (id: string, updates: Partial<BookingRecord>): void => {
  const current = getBookings();
  const updated = current.map((item) => (item.id === id ? { ...item, ...updates } : item));
  try {
    localStorage.setItem(STORAGE_KEY, JSON.stringify(updated));
    window.dispatchEvent(new Event('cc_bookings_updated'));
    fetch(`${BOOKINGS_API}/${id}`, {
      method: 'PUT',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify(updates)
    }).catch(() => {});
  } catch (err) {
    console.error('Failed to update booking', err);
  }
};

export const deleteBooking = (id: string): void => {
  const current = getBookings();
  const updated = current.filter((item) => item.id !== id);
  try {
    localStorage.setItem(STORAGE_KEY, JSON.stringify(updated));
    window.dispatchEvent(new Event('cc_bookings_updated'));
    fetch(`${BOOKINGS_API}/${id}`, { method: 'DELETE' }).catch(() => {});
  } catch (err) {
    console.error('Failed to delete booking', err);
  }
};

export const resetBookings = (): BookingRecord[] => {
  try {
    localStorage.setItem(STORAGE_KEY, JSON.stringify(initialDemoBookings));
    window.dispatchEvent(new Event('cc_bookings_updated'));
  } catch (err) {
    console.error('Failed to reset bookings', err);
  }
  return initialDemoBookings;
};
