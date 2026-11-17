import express from 'express';
import cors from 'cors';
import dotenv from 'dotenv';
import mongoose from 'mongoose';
import path from 'path';
import { fileURLToPath } from 'url';
import { Settings } from './models/Settings.js';
import { Booking } from './models/Booking.js';
import { Customer } from './models/Customer.js';
import { Service } from './models/Service.js';

dotenv.config();

const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);
const distPath = path.join(__dirname, '../dist');

const app = express();
const PORT = process.env.PORT || 5030;

// Enable CORS for frontend Vite dev server (port 5173) and any local origin
app.use(cors({
  origin: '*',
  methods: ['GET', 'POST', 'PUT', 'DELETE', 'OPTIONS'],
  allowedHeaders: ['Content-Type', 'Authorization']
}));

app.use(express.json());

// In-memory fallback if MongoDB connection is pending or interrupted
let memorySettings = {
  key: 'site_settings',
  siteName: 'Car Care',
  phone: '+91 98765 43210',
  address: 'Grand Southern Trunk Rd, Auto Bay Complex, Guindy, Chennai, Tamil Nadu 600032',
  email: 'bookings@carcare.com',
  operatingHours: 'Monday – Saturday: 8:30 AM – 8:00 PM',
  locations: [
    'Chennai (4 Bays)',
    'Bangalore (6 Bays)',
    'Coimbatore (3 Bays)'
  ]
};

const defaultServices = [
  {
    id: 'ceramic',
    name: 'Ceramic & Graphene',
    shortName: 'Ceramic',
    tag: 'HOT',
    thumbnail: '/assets/detail_after.jpg',
    shortDesc: 'Multi-layer high-solids hydrophobic coating delivering deep optical gloss & UV defense.',
    showcaseTitle: 'CERAMIC COATING & PAINT ARMOR',
    showcaseImg: '/assets/service_technician.jpg',
    features: [
      { title: '10H Diamond Hardness', desc: 'Highest scratch resistance certified by international hardness tests.' },
      { title: 'Dual-Layer Self-Healing Matrix', desc: 'Micro-scratches vanish under direct solar heat activation.' },
      { title: '5-Year Factory Warranty', desc: 'Official logged warranty with nationwide gloss retention guarantee.' },
      { title: 'UV & Chemical Shield', desc: 'Resists acid rain, industrial fallout, tree sap, and harsh detergents.' }
    ],
    addon: 'Includes Full Multi-Stage Decontamination & Alcohol Prep'
  },
  {
    id: 'interior',
    name: 'Interior Sanctuary Spa',
    shortName: 'Interior',
    tag: 'RESTORE',
    thumbnail: '/assets/interior_detailing.jpg',
    shortDesc: 'Deep leather conditioning, steam sanitization, and antibacterial cabin treatment.',
    showcaseTitle: 'CONCOURS INTERIOR RESTORATION',
    showcaseImg: '/assets/interior_detailing.jpg',
    features: [
      { title: 'Swissvax Leather Balm', desc: 'Nourishing oils restoring suppleness to Italian Nappa and Merino hides.' },
      { title: 'High-Pressure Steam Extraction', desc: 'Eliminates 99.9% of bacteria and allergens embedded in carpets.' },
      { title: 'Ozone Cabin Sterilization', desc: 'Hospital-grade molecular deodorizing neutralizing stubborn odors.' },
      { title: 'Matte UV Dashboard Shield', desc: 'Zero greasy residue protection against dashboard drying and cracking.' }
    ],
    addon: 'Includes AC Vent Ozone Purge & Alcantara Brush Detailing'
  },
  {
    id: 'paint-correction',
    name: 'Paint Correction',
    shortName: 'Correction',
    tag: 'STAGE 2/3',
    thumbnail: '/assets/service_technician.jpg',
    shortDesc: 'Precision rotary & orbital buffing removing up to 95% of swirl marks & clear coat haze.',
    showcaseTitle: 'STAGE 2 & 3 MIRROR PAINT CORRECTION',
    showcaseImg: '/assets/service_technician.jpg',
    features: [
      { title: 'Digital Paint Depth Gauging', desc: 'Ultrasonic micrometer assessment ensuring clear coat integrity.' },
      { title: 'Diminishing Abrasive Micro-Polishing', desc: 'Safely levels orange peel and clears micro-scratches permanently.' },
      { title: 'Full Spectrum CRI Inspection', desc: 'Identifies buffer trails and holograms under specialized LED arrays.' },
      { title: 'Jeweling Compound Finish', desc: 'Extracts deep wet-look reflection ready for ceramic or film bond.' }
    ],
    addon: 'Includes 3-Step IPA Wipe-Down & Inspection Certificate'
  },
  {
    id: 'ppf',
    name: 'Full Body Armor PPF',
    shortName: 'PPF Armor',
    tag: 'ULTIMATE',
    thumbnail: '/assets/tech_car.jpg',
    shortDesc: 'Self-healing TPU film repelling stone chips, road debris, and chemical staining.',
    showcaseTitle: 'SELF-HEALING OPTICAL TPU PPF',
    showcaseImg: '/assets/tech_car.jpg',
    features: [
      { title: 'Instant Heat Self-Healing', desc: 'Surface swirls disappear automatically when exposed to sunlight or warm water.' },
      { title: 'Pre-Cut Computerized Patterns', desc: 'Zero razor blades on vehicle paintwork; wrap-around invisible edges.' },
      { title: '10-Year Anti-Yellowing Bond', desc: 'Optical clarity with zero orange peel or adhesive discoloration.' },
      { title: 'Hydrophobic Top-Coat Infused', desc: 'Water and dirt bead off instantaneously at highway velocities.' }
    ],
    addon: 'Includes Wrapped Edge Alignment & Ceramic Top-Coat Layer'
  }
];

let memoryServices = [...defaultServices];

// Database Connection
const rawUri = process.env.MONGODB_URI || '';
const mongoUri = rawUri.endsWith('/')
  ? `${rawUri}car_care?retryWrites=true&w=majority`
  : rawUri;

let isMongoConnected = false;

if (mongoUri) {
  mongoose.connect(mongoUri, { serverSelectionTimeoutMS: 5000 })
    .then(async () => {
      isMongoConnected = true;
      console.log('✅ Connected to MongoDB Atlas Database (car_care)');
      
      // Initialize default settings if not exists
      try {
        const existing = await Settings.findOne({ key: 'site_settings' });
        if (!existing) {
          await Settings.create(memorySettings);
          console.log('✨ Seeded initial site settings to MongoDB');
        } else {
          memorySettings = existing.toObject();
        }
      } catch (e) {
        console.error('Error verifying initial settings:', e.message);
      }

      // Initialize default services if collection empty
      try {
        const count = await Service.countDocuments();
        if (count === 0) {
          await Service.insertMany(defaultServices);
          console.log('✨ Seeded initial services into MongoDB');
        }
      } catch (e) {
        console.error('Error seeding services:', e.message);
      }
    })
    .catch((err) => {
      console.error('⚠️ MongoDB Connection Failed:', err.message);
      console.log('ℹ️ Server will continue operating on port 5000 with in-memory persistence');
    });
}

// ==========================================
// 1. SETTINGS ROUTES
// ==========================================

app.get('/api/settings', async (req, res) => {
  try {
    if (isMongoConnected && mongoose.connection.readyState === 1) {
      let settings = await Settings.findOne({ key: 'site_settings' });
      if (!settings) {
        settings = await Settings.create(memorySettings);
      }
      return res.json({ success: true, data: settings });
    }
    return res.json({ success: true, data: memorySettings });
  } catch (err) {
    console.error('GET /api/settings error:', err);
    return res.json({ success: true, data: memorySettings });
  }
});

const handleSettingsUpdate = async (req, res) => {
  try {
    const { siteName, phone, address, email, operatingHours, locations } = req.body;
    
    const updatePayload = {
      siteName: siteName !== undefined ? siteName : memorySettings.siteName,
      phone: phone !== undefined ? phone : memorySettings.phone,
      address: address !== undefined ? address : memorySettings.address,
      email: email !== undefined ? email : memorySettings.email,
      operatingHours: operatingHours !== undefined ? operatingHours : memorySettings.operatingHours,
      locations: locations !== undefined ? locations : memorySettings.locations,
      updatedAt: new Date()
    };

    memorySettings = { ...memorySettings, ...updatePayload };

    if (isMongoConnected && mongoose.connection.readyState === 1) {
      const updated = await Settings.findOneAndUpdate(
        { key: 'site_settings' },
        { $set: updatePayload },
        { new: true, upsert: true }
      );
      return res.json({ success: true, message: 'Settings saved to MongoDB successfully', data: updated });
    }

    return res.json({ success: true, message: 'Settings saved to local server memory', data: memorySettings });
  } catch (err) {
    console.error('Save settings error:', err);
    res.status(500).json({ success: false, error: err.message });
  }
};

app.put('/api/settings', handleSettingsUpdate);
app.post('/api/settings', handleSettingsUpdate);

// ==========================================
// 2. SERVICES ROUTES (Admin Manageable)
// ==========================================

app.get('/api/services', async (req, res) => {
  try {
    if (isMongoConnected && mongoose.connection.readyState === 1) {
      const services = await Service.find().sort({ createdAt: 1 });
      if (services.length > 0) {
        return res.json({ success: true, data: services });
      }
    }
    return res.json({ success: true, data: memoryServices });
  } catch (err) {
    console.error('GET /api/services error:', err);
    return res.json({ success: true, data: memoryServices });
  }
});

app.post('/api/services', async (req, res) => {
  try {
    const newService = {
      id: req.body.id || `srv-${Date.now()}`,
      name: req.body.name,
      shortName: req.body.shortName || req.body.name,
      tag: req.body.tag || 'PREMIUM',
      thumbnail: req.body.thumbnail || '/assets/detail_after.jpg',
      shortDesc: req.body.shortDesc || '',
      showcaseTitle: req.body.showcaseTitle || req.body.name.toUpperCase(),
      showcaseImg: req.body.showcaseImg || '/assets/service_technician.jpg',
      features: req.body.features || [],
      addon: req.body.addon || '',
      createdAt: new Date()
    };

    if (isMongoConnected && mongoose.connection.readyState === 1) {
      const created = await Service.create(newService);
      return res.status(201).json({ success: true, data: created });
    }

    memoryServices.push(newService);
    return res.status(201).json({ success: true, data: newService });
  } catch (err) {
    console.error('POST /api/services error:', err);
    res.status(500).json({ success: false, error: err.message });
  }
});

app.put('/api/services/:id', async (req, res) => {
  try {
    const { id } = req.params;
    const updates = req.body;

    if (isMongoConnected && mongoose.connection.readyState === 1) {
      const updated = await Service.findOneAndUpdate({ id }, { $set: updates }, { new: true });
      if (updated) {
        return res.json({ success: true, data: updated });
      }
    }

    const idx = memoryServices.findIndex(s => s.id === id);
    if (idx !== -1) {
      memoryServices[idx] = { ...memoryServices[idx], ...updates };
      return res.json({ success: true, data: memoryServices[idx] });
    }

    res.status(404).json({ success: false, error: 'Service not found' });
  } catch (err) {
    console.error('PUT /api/services/:id error:', err);
    res.status(500).json({ success: false, error: err.message });
  }
});

app.delete('/api/services/:id', async (req, res) => {
  try {
    const { id } = req.params;

    if (isMongoConnected && mongoose.connection.readyState === 1) {
      await Service.findOneAndDelete({ id });
    }

    memoryServices = memoryServices.filter(s => s.id !== id);
    return res.json({ success: true, message: `Service ${id} deleted` });
  } catch (err) {
    console.error('DELETE /api/services/:id error:', err);
    res.status(500).json({ success: false, error: err.message });
  }
});

// ==========================================
// 3. BOOKINGS & APPOINTMENTS ROUTES
// ==========================================

app.get('/api/bookings', async (req, res) => {
  try {
    if (isMongoConnected && mongoose.connection.readyState === 1) {
      const bookings = await Booking.find().sort({ createdAt: -1 });
      return res.json({ success: true, data: bookings });
    }
    return res.json({ success: true, data: [] });
  } catch (err) {
    console.error('GET /api/bookings error:', err);
    res.status(500).json({ success: false, error: err.message });
  }
});

app.post('/api/bookings', async (req, res) => {
  try {
    const {
      id,
      customerName,
      phone,
      carModel,
      vehicleNumber = '',
      service,
      date,
      status = 'Pending',
      notes = '',
      price = '',
      studio = 'Chennai Studio (Guindy)'
    } = req.body;

    const bookingId = id || `CC-${Math.floor(100000 + Math.random() * 900000)}`;

    const newBookingData = {
      id: bookingId,
      customerName,
      phone,
      carModel: carModel || 'Unspecified Vehicle',
      vehicleNumber: vehicleNumber || '',
      service,
      date: date || new Date().toISOString().split('T')[0],
      status,
      notes,
      price: '',
      studio,
      createdAt: new Date()
    };

    if (isMongoConnected && mongoose.connection.readyState === 1) {
      const created = await Booking.create(newBookingData);

      // Auto-sync customer into Customer collection
      try {
        const existingCust = await Customer.findOne({
          $or: [{ phone }, { name: customerName }]
        });

        if (existingCust) {
          if (!existingCust.carModels.includes(newBookingData.carModel)) {
            existingCust.carModels.push(newBookingData.carModel);
          }
          if (vehicleNumber && !existingCust.vehicleNumbers.includes(vehicleNumber)) {
            existingCust.vehicleNumbers.push(vehicleNumber);
          }
          existingCust.totalVisits += 1;
          existingCust.lastVisit = newBookingData.date;
          existingCust.preferredService = newBookingData.service;
          if (notes) existingCust.notes = `${existingCust.notes} | ${notes}`;
          await existingCust.save();
        } else {
          await Customer.create({
            id: `CUST-${Math.floor(100 + Math.random() * 900)}`,
            name: customerName,
            phone,
            email: `${customerName.toLowerCase().replace(/[^a-z0-9]/g, '.')}@client.com`,
            carModels: [newBookingData.carModel],
            vehicleNumbers: vehicleNumber ? [vehicleNumber] : [],
            totalVisits: 1,
            totalSpent: '₹0',
            tier: 'Standard',
            lastVisit: newBookingData.date,
            preferredService: service,
            notes: `Online booking ${bookingId}. ${notes}`.trim()
          });
        }
      } catch (custErr) {
        console.warn('Customer auto-sync note:', custErr.message);
      }

      return res.status(201).json({ success: true, data: created });
    }

    return res.status(201).json({ success: true, data: newBookingData });
  } catch (err) {
    console.error('POST /api/bookings error:', err);
    res.status(500).json({ success: false, error: err.message });
  }
});

app.put('/api/bookings/:id', async (req, res) => {
  try {
    const { id } = req.params;
    const updates = req.body;

    if (isMongoConnected && mongoose.connection.readyState === 1) {
      const updated = await Booking.findOneAndUpdate({ id }, { $set: updates }, { new: true });
      if (!updated) {
        return res.status(404).json({ success: false, error: 'Booking not found' });
      }
      return res.json({ success: true, data: updated });
    }

    return res.json({ success: true, data: { id, ...updates } });
  } catch (err) {
    console.error('PUT /api/bookings/:id error:', err);
    res.status(500).json({ success: false, error: err.message });
  }
});

app.delete('/api/bookings/:id', async (req, res) => {
  try {
    const { id } = req.params;
    if (isMongoConnected && mongoose.connection.readyState === 1) {
      await Booking.findOneAndDelete({ id });
      return res.json({ success: true, message: `Booking ${id} deleted` });
    }
    return res.json({ success: true, message: `Booking ${id} deleted from memory` });
  } catch (err) {
    console.error('DELETE /api/bookings error:', err);
    res.status(500).json({ success: false, error: err.message });
  }
});

// ==========================================
// 4. CUSTOMERS DIRECTORY ROUTES
// ==========================================

app.get('/api/customers', async (req, res) => {
  try {
    if (isMongoConnected && mongoose.connection.readyState === 1) {
      const customers = await Customer.find().sort({ createdAt: -1 });
      return res.json({ success: true, data: customers });
    }
    return res.json({ success: true, data: [] });
  } catch (err) {
    console.error('GET /api/customers error:', err);
    res.status(500).json({ success: false, error: err.message });
  }
});

// ==========================================
// 5. HEALTH CHECK
// ==========================================
app.get('/api/health', (req, res) => {
  res.json({
    status: 'ok',
    server: 'running',
    port: PORT,
    database: isMongoConnected ? 'MongoDB Atlas (Connected)' : 'In-Memory Active',
    timestamp: new Date().toISOString()
  });
});

// ==========================================
// 6. STATIC ASSET SERVING & SPA FALLBACK
// ==========================================
app.use(express.static(distPath));

// For all non-API GET requests, serve Vite's index.html
app.get('*', (req, res, next) => {
  if (req.path.startsWith('/api')) {
    return res.status(404).json({ success: false, error: 'API route not found' });
  }
  res.sendFile(path.join(distPath, 'index.html'), (err) => {
    if (err) {
      res.send(`Car Care Backend API Server is active on port ${PORT}`);
    }
  });
});

// Start Server
app.listen(PORT, () => {
  console.log(`🚀 Car Care Backend Server listening on http://localhost:${PORT}`);
});
