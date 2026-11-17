import mongoose from 'mongoose';

const bookingSchema = new mongoose.Schema({
  id: { type: String, required: true, unique: true },
  customerName: { type: String, required: true },
  phone: { type: String, required: true },
  carModel: { type: String, default: 'Unspecified Vehicle' },
  vehicleNumber: { type: String, default: '' },
  service: { type: String, required: true },
  date: { type: String, required: true },
  status: { 
    type: String, 
    enum: ['Pending', 'Confirmed', 'In Bay', 'Completed', 'Cancelled'],
    default: 'Pending'
  },
  notes: { type: String, default: '' },
  price: { type: String, default: '' },
  studio: { type: String, default: 'Chennai Studio (Guindy)' },
  createdAt: { type: Date, default: Date.now }
});

export const Booking = mongoose.model('Booking', bookingSchema);
