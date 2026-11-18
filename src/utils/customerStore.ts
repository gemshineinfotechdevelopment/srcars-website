import type { CustomerRecord } from '../types/customer';

const CUSTOMERS_KEY = 'cc_admin_customers_data';

const DUMMY_DEMO_NAMES = [
  'Vikramaditya Roy',
  'Ananya Deshmukh',
  'Rajesh K. Sundaram',
  'Karthik Narayanan',
  'Deepak Chawla'
];

const initialDemoCustomers: CustomerRecord[] = [];

export const getCustomers = (): CustomerRecord[] => {
  try {
    const raw = localStorage.getItem(CUSTOMERS_KEY);
    if (!raw) {
      localStorage.setItem(CUSTOMERS_KEY, JSON.stringify([]));
      return [];
    }
    const parsed: CustomerRecord[] = JSON.parse(raw);
    const clean = parsed.filter(c => !DUMMY_DEMO_NAMES.includes(c.name));
    if (clean.length !== parsed.length) {
      localStorage.setItem(CUSTOMERS_KEY, JSON.stringify(clean));
      return clean;
    }
    return parsed;
  } catch (err) {
    console.error('Failed to load customers from storage', err);
    return [];
  }
};

export const addCustomer = (customer: Omit<CustomerRecord, 'id'>): CustomerRecord => {
  const current = getCustomers();
  const newCust: CustomerRecord = {
    ...customer,
    id: `CUST-${String(current.length + 1).padStart(3, '0')}`,
  };
  const updated = [newCust, ...current];
  try {
    localStorage.setItem(CUSTOMERS_KEY, JSON.stringify(updated));
    window.dispatchEvent(new Event('cc_customers_updated'));
  } catch (err) {
    console.error('Failed to save customer', err);
  }
  return newCust;
};

export const updateCustomer = (id: string, updates: Partial<CustomerRecord>): void => {
  const current = getCustomers();
  const updated = current.map((c) => (c.id === id ? { ...c, ...updates } : c));
  try {
    localStorage.setItem(CUSTOMERS_KEY, JSON.stringify(updated));
    window.dispatchEvent(new Event('cc_customers_updated'));
  } catch (err) {
    console.error('Failed to update customer', err);
  }
};

export const deleteCustomer = (id: string): void => {
  const current = getCustomers();
  const updated = current.filter((c) => c.id !== id);
  try {
    localStorage.setItem(CUSTOMERS_KEY, JSON.stringify(updated));
    window.dispatchEvent(new Event('cc_customers_updated'));
  } catch (err) {
    console.error('Failed to delete customer', err);
  }
};

export const resetCustomers = (): CustomerRecord[] => {
  try {
    localStorage.setItem(CUSTOMERS_KEY, JSON.stringify(initialDemoCustomers));
    window.dispatchEvent(new Event('cc_customers_updated'));
  } catch (err) {
    console.error('Failed to reset customers', err);
  }
  return initialDemoCustomers;
};

export const syncCustomerFromBooking = (booking: {
  customerName: string;
  phone: string;
  carModel: string;
  service: string;
  date: string;
  price?: string;
  notes?: string;
  id?: string;
}): void => {
  const current = getCustomers();
  const cleanPhone = booking.phone.replace(/[^0-9]/g, '');
  const existing = current.find(
    (c) => (cleanPhone && c.phone.replace(/[^0-9]/g, '') === cleanPhone) ||
           c.name.toLowerCase() === booking.customerName.toLowerCase()
  );

  if (existing) {
    const carList = existing.carModels.some((m) => m.toLowerCase() === (booking.carModel || '').toLowerCase())
      ? existing.carModels
      : [...existing.carModels, booking.carModel || 'Standard Vehicle'];
    updateCustomer(existing.id, {
      carModels: carList,
      totalVisits: (existing.totalVisits || 1) + 1,
      lastVisit: booking.date || new Date().toISOString().split('T')[0],
      preferredService: booking.service,
      notes: booking.notes ? `${existing.notes} | ${booking.notes}` : existing.notes,
    });
  } else {
    addCustomer({
      name: booking.customerName,
      phone: booking.phone,
      email: `${booking.customerName.toLowerCase().replace(/[^a-z0-9]/g, '.')}@client.com`,
      carModels: [booking.carModel || 'Standard Vehicle'],
      totalVisits: 1,
      totalSpent: booking.price || '₹899',
      tier: 'Standard',
      lastVisit: booking.date || new Date().toISOString().split('T')[0],
      preferredService: booking.service,
      notes: `Online booking ${booking.id || ''}. ${booking.notes || ''}`.trim(),
    });
  }
};

