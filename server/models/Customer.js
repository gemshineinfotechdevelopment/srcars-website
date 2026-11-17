import mongoose from 'mongoose';

const customerSchema = new mongoose.Schema({
  id: { type: String, required: true, unique: true },
  name: { type: String, required: true },
  phone: { type: String, required: true },
  email: { type: String, default: '' },
  carModels: { type: [String], default: [] },
  vehicleNumbers: { type: [String], default: [] },
  totalVisits: { type: Number, default: 1 },
  totalSpent: { type: String, default: '₹0' },
  tier: { type: String, default: 'Standard' },
  lastVisit: { type: String, default: '' },
  preferredService: { type: String, default: '' },
  notes: { type: String, default: '' },
  createdAt: { type: Date, default: Date.now }
});

export const Customer = mongoose.model('Customer', customerSchema);
