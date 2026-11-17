import type { CustomerRecord } from '../types/customer';

const CUSTOMERS_KEY = 'cc_admin_customers_data';

const initialDemoCustomers: CustomerRecord[] = [
  {
    id: 'CUST-001',
    name: 'Vikramaditya Roy',
    phone: '+91 98401 23456',
    email: 'vikram.roy@supercars.in',
    carModels: ['Porsche 911 GT3 RS', 'Mercedes-AMG G63'],
    totalVisits: 6,
    totalSpent: '₹34,800',
    tier: 'VIP Supercar',
    lastVisit: '2026-11-18',
    preferredService: 'Ceramic & Graphene Coating',
    notes: 'Long-time collector. Always prefers enclosed flatbed collection and 10H cure.',
  },
  {
    id: 'CUST-002',
    name: 'Ananya Deshmukh',
    phone: '+91 97112 88490',
    email: 'ananya.d@ecrvillas.com',
    carModels: ['McLaren 720S Spider'],
    totalVisits: 3,
    totalSpent: '₹19,500',
    tier: 'VIP Supercar',
    lastVisit: '2026-11-19',
    preferredService: 'Full Body Armor PPF',
    notes: 'Requests photo updates on WhatsApp every 4 hours during application.',
  },
  {
    id: 'CUST-003',
    name: 'Rajesh K. Sundaram',
    phone: '+91 94441 55678',
    email: 'rajesh.sundaram@autoenclave.com',
    carModels: ['Mercedes-AMG G63', 'BMW 7 Series'],
    totalVisits: 5,
    totalSpent: '₹14,200',
    tier: 'Elite',
    lastVisit: '2026-11-16',
    preferredService: 'Interior Sanctuary Spa',
    notes: 'Swissvax leather balm fan. Prefers scent-free ozone cabin sterilization.',
  },
  {
    id: 'CUST-004',
    name: 'Karthik Narayanan',
    phone: '+91 98840 99123',
    email: 'karthik.n@motorsports.in',
    carModels: ['BMW M4 Competition'],
    totalVisits: 4,
    totalSpent: '₹18,400',
    tier: 'Elite',
    lastVisit: '2026-11-17',
    preferredService: 'Stage 2/3 Paint Correction',
    notes: 'Tracks his vehicle at MMRT circuit. Frequent rubber haze removal needed.',
  },
  {
    id: 'CUST-005',
    name: 'Deepak Chawla',
    phone: '+91 99001 44556',
    email: 'deepak.chawla@techhub.com',
    carModels: ['Audi RS7 Sportback'],
    totalVisits: 2,
    totalSpent: '₹9,800',
    tier: 'Standard',
    lastVisit: '2026-11-14',
    preferredService: 'Ceramic & Graphene Coating',
    notes: 'First-time ceramic client. Received 5-year factory warranty card.',
  },
];

export const getCustomers = (): CustomerRecord[] => {
  try {
    const raw = localStorage.getItem(CUSTOMERS_KEY);
    if (!raw) {
      localStorage.setItem(CUSTOMERS_KEY, JSON.stringify(initialDemoCustomers));
      return initialDemoCustomers;
    }
    return JSON.parse(raw);
  } catch (err) {
    console.error('Failed to load customers from storage', err);
    return initialDemoCustomers;
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

