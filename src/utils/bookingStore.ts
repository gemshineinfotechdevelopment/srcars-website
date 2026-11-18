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

import { API_ENDPOINTS } from '../config/api';

const STORAGE_KEY = 'cc_admin_bookings_data';
const BOOKINGS_API = API_ENDPOINTS.bookings;

const DUMMY_DEMO_NAMES = [
  'Vikramaditya Roy',
  'Ananya Deshmukh',
  'Rajesh K. Sundaram',
  'Karthik Narayanan',
  'Deepak Chawla'
];

const initialDemoBookings: BookingRecord[] = [];

export const getBookings = (): BookingRecord[] => {
  try {
    const raw = localStorage.getItem(STORAGE_KEY);
    if (!raw) {
      localStorage.setItem(STORAGE_KEY, JSON.stringify([]));
      return [];
    }
    const parsed: BookingRecord[] = JSON.parse(raw);
    
    // Purge any dummy demo records
    const clean = parsed.filter(b => !DUMMY_DEMO_NAMES.includes(b.customerName));

    if (clean.length !== parsed.length) {
      localStorage.setItem(STORAGE_KEY, JSON.stringify(clean));
      return clean;
    }
    return parsed;
  } catch (err) {
    console.error('Failed to load bookings from storage', err);
    return [];
  }
};

export const saveBooking = (newRecord: Omit<BookingRecord, 'id' | 'createdAt'> & { id?: string }): BookingRecord => {
  const current = getBookings();
  const calculatedPrice = newRecord.price || getServicePrice(newRecord.service);

  // Compute next sequential ID: 1001, 1002, 1003, ...
  const nextId = newRecord.id || (() => {
    const numericIds = current
      .map(b => parseInt(b.id.replace(/\D/g, ''), 10))
      .filter(n => !isNaN(n));
    const maxId = numericIds.length > 0 ? Math.max(...numericIds) : 1000;
    return String(Math.max(maxId + 1, 1001));
  })();

  const fullRecord: BookingRecord = {
    id: nextId,
    customerName: newRecord.customerName,
    phone: newRecord.phone,
    carModel: newRecord.carModel,
    vehicleNumber: newRecord.vehicleNumber,
    service: newRecord.service,
    date: newRecord.date,
    status: newRecord.status || 'Pending',
    notes: newRecord.notes || '',
    price: calculatedPrice,
    studio: newRecord.studio || 'Chennai Studio (Guindy)',
    createdAt: new Date().toISOString(),
    isNew: true, // Marked as new so admin sees NEW badge
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

export const markBookingAsSeen = (id: string): void => {
  const current = getBookings();
  const updated = current.map((item) => (item.id === id ? { ...item, isNew: false } : item));
  try {
    localStorage.setItem(STORAGE_KEY, JSON.stringify(updated));
    window.dispatchEvent(new Event('cc_bookings_updated'));
  } catch (err) {
    console.error('Failed to mark booking as seen', err);
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
