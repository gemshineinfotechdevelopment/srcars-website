import mongoose from 'mongoose';

const settingsSchema = new mongoose.Schema({
  key: { type: String, default: 'site_settings', unique: true },
  siteName: { type: String, default: 'Car Care' },
  phone: { type: String, default: '+91 98765 43210' },
  address: { type: String, default: 'Grand Southern Trunk Rd, Auto Bay Complex, Guindy, Chennai, Tamil Nadu 600032' },
  email: { type: String, default: 'bookings@carcare.com' },
  operatingHours: { type: String, default: 'Monday – Saturday: 8:30 AM – 8:00 PM' },
  locations: {
    type: [String],
    default: [
      'Chennai (4 Bays)',
      'Bangalore (6 Bays)',
      'Coimbatore (3 Bays)'
    ]
  },
  updatedAt: { type: Date, default: Date.now }
});

export const Settings = mongoose.model('Settings', settingsSchema);

