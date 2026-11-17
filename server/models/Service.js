import mongoose from 'mongoose';

const featureSchema = new mongoose.Schema({
  title: { type: String, required: true },
  desc: { type: String, required: true }
}, { _id: false });

const serviceSchema = new mongoose.Schema({
  id: { type: String, required: true, unique: true },
  name: { type: String, required: true },
  shortName: { type: String, required: true },
  tag: { type: String, default: 'PREMIUM' },
  thumbnail: { type: String, default: '' },
  shortDesc: { type: String, default: '' },
  showcaseTitle: { type: String, required: true },
  showcaseImg: { type: String, default: '' },
  features: { type: [featureSchema], default: [] },
  addon: { type: String, default: '' },
  createdAt: { type: Date, default: Date.now }
});

export const Service = mongoose.model('Service', serviceSchema);
