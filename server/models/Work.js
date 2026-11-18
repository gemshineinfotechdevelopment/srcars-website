import mongoose from 'mongoose';

const workSchema = new mongoose.Schema({
  id: { type: String, required: true, unique: true },
  title: { type: String, required: true },
  category: { type: String, default: 'CERAMIC' },
  service: { type: String, required: true },
  beforeImg: { type: String, default: '/assets/detail_before.jpg' },
  afterImg: { type: String, default: '/assets/detail_after.jpg' },
  img: { type: String, default: '/assets/detail_after.jpg' }, // fallback alias
  duration: { type: String, default: '3 Days' },
  warranty: { type: String, default: '5-Year Guarantee' },
  description: { type: String, default: '' },
  createdAt: { type: Date, default: Date.now }
});

export const Work = mongoose.model('Work', workSchema);
