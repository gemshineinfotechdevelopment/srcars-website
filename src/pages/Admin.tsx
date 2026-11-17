import React, { useState, useEffect } from 'react';
import type { BookingRecord, BookingStatus } from '../types/booking';
import type { CustomerRecord } from '../types/customer';
import { 
  getBookings, 
  saveBooking, 
  updateBookingStatus, 
  updateBooking, 
  deleteBooking 
} from '../utils/bookingStore';
import { 
  getCustomers, 
  addCustomer, 
  deleteCustomer 
} from '../utils/customerStore';
import { 
  getSiteSettings, 
  saveSiteSettings, 
  type SiteSettings 
} from '../utils/settingsStore';
import {
  useServicesList,
  saveServiceItem,
  deleteServiceItem,
  resolveServiceImage,
  type ServiceItem
} from '../utils/servicesStore';
import {
  BarChartIcon,
  CalendarIcon,
  UsersIcon,
  TrendingUpIcon,
  GearSettingIcon,
  LockIcon,
  GlobeIcon,
  EyeIcon,
  LogoutIcon,
  AlertTriangleIcon,
  CheckCircleIcon,
  SparkleIcon
} from '../components/Icons';

interface AdminProps {
  onNavigate: (page: 'home' | 'how-it-works' | 'recent-works' | 'contact' | 'admin', targetSection?: string) => void;
}

type AdminTab = 'dashboard' | 'appointments' | 'customers' | 'services' | 'reports' | 'settings';

const AUTH_STORAGE_KEY = 'cc_admin_session_auth';
const CREDENTIALS_KEY = 'cc_admin_credentials';

export const Admin: React.FC<AdminProps> = ({ onNavigate }) => {
  // Authentication State
  const [isAuthenticated, setIsAuthenticated] = useState<boolean>(() => {
    return localStorage.getItem(AUTH_STORAGE_KEY) === 'true';
  });
  const [usernameInput, setUsernameInput] = useState('');
  const [passwordInput, setPasswordInput] = useState('');
  const [loginError, setLoginError] = useState('');

  // Active Tab
  const [activeTab, setActiveTab] = useState<AdminTab>('dashboard');

  // Services State (Dynamic Catalog)
  const servicesList = useServicesList();
  const [isServiceModalOpen, setIsServiceModalOpen] = useState(false);
  const [editingService, setEditingService] = useState<ServiceItem | null>(null);
  const [serviceFormData, setServiceFormData] = useState<ServiceItem>({
    id: '',
    name: '',
    shortName: '',
    tag: 'HOT',
    thumbnail: '/assets/detail_after.jpg',
    shortDesc: '',
    showcaseTitle: '',
    showcaseImg: '/assets/service_technician.jpg',
    features: [
      { title: '', desc: '' },
      { title: '', desc: '' },
      { title: '', desc: '' },
      { title: '', desc: '' },
    ],
    addon: '',
  });

  // Bookings Data
  const [bookings, setBookings] = useState<BookingRecord[]>([]);
  const [searchTerm, setSearchTerm] = useState('');
  const [statusFilter, setStatusFilter] = useState<string>('ALL');
  const [studioFilter, setStudioFilter] = useState<string>('ALL');
  const [isAddModalOpen, setIsAddModalOpen] = useState(false);
  const [selectedBooking, setSelectedBooking] = useState<BookingRecord | null>(null);

  // Customers Data
  const [customers, setCustomers] = useState<CustomerRecord[]>([]);
  const [customerSearch, setCustomerSearch] = useState('');
  const [isAddCustomerOpen, setIsAddCustomerOpen] = useState(false);

  // Settings state
  const [settingsNotice, setSettingsNotice] = useState('');
  const [siteSettings, setSiteSettings] = useState<SiteSettings>(getSiteSettings);
  const [isSavingSettings, setIsSavingSettings] = useState(false);
  const [adminUsername, setAdminUsername] = useState(() => {
    const creds = localStorage.getItem(CREDENTIALS_KEY);
    return creds ? JSON.parse(creds).username : 'admin';
  });
  const [adminPassword, setAdminPassword] = useState(() => {
    const creds = localStorage.getItem(CREDENTIALS_KEY);
    return creds ? JSON.parse(creds).password : 'admin123';
  });
  const [newPassInput, setNewPassInput] = useState('');
  const [newUserInput, setNewUserInput] = useState('');

  // New Booking Form
  const [newBooking, setNewBooking] = useState({
    customerName: '',
    phone: '',
    carModel: '',
    vehicleNumber: '',
    service: 'Ceramic & Graphene Coating',
    date: new Date().toISOString().split('T')[0],
    studio: 'Chennai Studio (Guindy)',
    status: 'Pending' as BookingStatus,
    notes: '',
    price: '',
  });

  // New Customer Form
  const [newCustForm, setNewCustForm] = useState({
    name: '',
    phone: '',
    email: '',
    carModels: '',
    vehicleNumber: '',
    preferredService: 'Ceramic & Graphene Coating',
    notes: '',
  });

  const loadData = () => {
    setBookings(getBookings());
    setCustomers(getCustomers());
    setSiteSettings(getSiteSettings());
  };

  useEffect(() => {
    loadData();
    const handleUpdate = () => loadData();
    const handleStorage = (e: StorageEvent) => {
      if (
        e.key === 'cc_admin_bookings_data' || 
        e.key === 'cc_admin_customers_data' ||
        e.key === 'cc_site_settings_data'
      ) {
        loadData();
      }
    };
    window.addEventListener('cc_bookings_updated', handleUpdate);
    window.addEventListener('cc_customers_updated', handleUpdate);
    window.addEventListener('cc_settings_updated', handleUpdate);
    window.addEventListener('storage', handleStorage);
    return () => {
      window.removeEventListener('cc_bookings_updated', handleUpdate);
      window.removeEventListener('cc_customers_updated', handleUpdate);
      window.removeEventListener('cc_settings_updated', handleUpdate);
      window.removeEventListener('storage', handleStorage);
    };
  }, []);

  // Login handler
  const handleLogin = (e: React.FormEvent) => {
    e.preventDefault();
    const creds = localStorage.getItem(CREDENTIALS_KEY);
    const validUser = creds ? JSON.parse(creds).username : 'admin';
    const validPass = creds ? JSON.parse(creds).password : 'admin123';

    if (usernameInput === validUser && passwordInput === validPass) {
      setIsAuthenticated(true);
      localStorage.setItem(AUTH_STORAGE_KEY, 'true');
      setLoginError('');
    } else {
      setLoginError('Invalid credentials. Check demo details below.');
    }
  };

  const handleLogout = () => {
    setIsAuthenticated(false);
    localStorage.removeItem(AUTH_STORAGE_KEY);
    setUsernameInput('');
    setPasswordInput('');
  };

  // Appointment actions
  const handleStatusChange = (id: string, newStatus: BookingStatus) => {
    updateBookingStatus(id, newStatus);
    loadData();
  };

  const handleDeleteBooking = (id: string) => {
    if (window.confirm(`Delete appointment ${id}?`)) {
      deleteBooking(id);
      loadData();
      if (selectedBooking?.id === id) {
        setSelectedBooking(null);
      }
    }
  };

  const handleCreateBooking = (e: React.FormEvent) => {
    e.preventDefault();
    saveBooking(newBooking);
    setIsAddModalOpen(false);
    setNewBooking({
      customerName: '',
      phone: '',
      carModel: '',
      vehicleNumber: '',
      service: 'Ceramic & Graphene Coating',
      date: new Date().toISOString().split('T')[0],
      studio: 'Chennai Studio (Guindy)',
      status: 'Pending',
      notes: '',
      price: '',
    });
    loadData();
  };

  const handleSaveNotes = (id: string, notes: string) => {
    updateBooking(id, { notes });
    loadData();
    if (selectedBooking && selectedBooking.id === id) {
      setSelectedBooking({ ...selectedBooking, notes });
    }
  };

  // Customer actions
  const handleCreateCustomer = (e: React.FormEvent) => {
    e.preventDefault();
    addCustomer({
      name: newCustForm.name,
      phone: newCustForm.phone,
      email: newCustForm.email,
      carModels: newCustForm.carModels.split(',').map((c) => c.trim()).filter(Boolean),
      vehicleNumbers: newCustForm.vehicleNumber ? [newCustForm.vehicleNumber.toUpperCase()] : [],
      totalVisits: 1,
      totalSpent: '₹0',
      tier: 'Standard',
      lastVisit: new Date().toISOString().split('T')[0],
      preferredService: newCustForm.preferredService,
      notes: newCustForm.notes,
    });
    setIsAddCustomerOpen(false);
    setNewCustForm({
      name: '',
      phone: '',
      email: '',
      carModels: '',
      vehicleNumber: '',
      preferredService: 'Ceramic & Graphene Coating',
      notes: '',
    });
    loadData();
  };

  const handleDeleteCustomer = (id: string) => {
    if (window.confirm(`Remove customer record ${id}?`)) {
      deleteCustomer(id);
      loadData();
    }
  };

  // Export CSV
  const handleExportCSV = () => {
    const headers = ['Booking ID', 'Customer Name', 'Phone', 'Car Model', 'Service', 'Date', 'Studio', 'Status', 'Notes'];
    const rows = bookings.map((b) => [
      b.id,
      `"${b.customerName}"`,
      `"${b.phone}"`,
      `"${b.carModel}"`,
      `"${b.service}"`,
      b.date,
      `"${b.studio || 'Chennai'}"`,
      b.status,
      `"${(b.notes || '').replace(/"/g, '""')}"`,
    ]);

    const csvContent = 'data:text/csv;charset=utf-8,' + [headers.join(','), ...rows.map((e) => e.join(','))].join('\n');
    const encodedUri = encodeURI(csvContent);
    const link = document.createElement('a');
    link.setAttribute('href', encodedUri);
    link.setAttribute('download', `car_care_appointments_${new Date().toISOString().split('T')[0]}.csv`);
    document.body.appendChild(link);
    link.click();
    document.body.removeChild(link);
  };

  // Change Admin Credentials
  const handleUpdateCredentials = (e: React.FormEvent) => {
    e.preventDefault();
    const updatedUser = newUserInput.trim() || adminUsername;
    const updatedPass = newPassInput.trim() || adminPassword;
    localStorage.setItem(CREDENTIALS_KEY, JSON.stringify({ username: updatedUser, password: updatedPass }));
    setAdminUsername(updatedUser);
    setAdminPassword(updatedPass);
    setNewUserInput('');
    setNewPassInput('');
    setSettingsNotice('Admin credentials successfully updated!');
    setTimeout(() => setSettingsNotice(''), 3000);
  };

  // Save Website Settings (Website Name, Mobile Number, Address, Email, Operating Hours)
  const handleSaveSettings = async (e: React.FormEvent) => {
    e.preventDefault();
    setIsSavingSettings(true);
    try {
      const saved = await saveSiteSettings(siteSettings);
      setSiteSettings(saved);
      setSettingsNotice('Website details successfully updated & synced with MongoDB database! Changes are now live across the website.');
      setTimeout(() => setSettingsNotice(''), 4500);
    } catch (err) {
      setSettingsNotice('Website details saved locally. Changes are live on site.');
      setTimeout(() => setSettingsNotice(''), 4500);
    } finally {
      setIsSavingSettings(false);
    }
  };

  // Service Catalog Actions (Dynamic Catalog & MongoDB sync)
  const handleOpenAddService = () => {
    setEditingService(null);
    setServiceFormData({
      id: '',
      name: '',
      shortName: '',
      tag: 'HOT',
      thumbnail: '/assets/detail_after.jpg',
      shortDesc: '',
      showcaseTitle: '',
      showcaseImg: '/assets/service_technician.jpg',
      features: [
        { title: '', desc: '' },
        { title: '', desc: '' },
        { title: '', desc: '' },
        { title: '', desc: '' },
      ],
      addon: 'Includes Full Multi-Stage Decontamination & Alcohol Prep',
    });
    setIsServiceModalOpen(true);
  };

  const handleOpenEditService = (srv: ServiceItem) => {
    setEditingService(srv);
    setServiceFormData({
      ...srv,
      features: [
        srv.features?.[0] || { title: '', desc: '' },
        srv.features?.[1] || { title: '', desc: '' },
        srv.features?.[2] || { title: '', desc: '' },
        srv.features?.[3] || { title: '', desc: '' },
      ],
    });
    setIsServiceModalOpen(true);
  };

  const handleSaveService = async (e: React.FormEvent) => {
    e.preventDefault();
    const idToUse = editingService?.id || serviceFormData.id || 'service-' + Date.now();
    const payload: ServiceItem = {
      ...serviceFormData,
      id: idToUse,
      shortName: serviceFormData.shortName || serviceFormData.name.split(' ')[0],
      showcaseTitle: serviceFormData.showcaseTitle || serviceFormData.name.toUpperCase(),
      features: (serviceFormData.features || []).filter(f => f.title && f.title.trim() !== ''),
    };
    await saveServiceItem(payload);
    setIsServiceModalOpen(false);
    setSettingsNotice('Service catalog successfully updated & synced across website!');
    setTimeout(() => setSettingsNotice(''), 3500);
  };

  const handleDeleteService = async (id: string, name: string) => {
    if (window.confirm(`Are you sure you want to delete "${name}" from services?`)) {
      await deleteServiceItem(id);
      setSettingsNotice('Service removed from catalog.');
      setTimeout(() => setSettingsNotice(''), 3000);
    }
  };

  // Filtered Bookings
  const filteredBookings = bookings.filter((b) => {
    const matchesSearch = 
      b.customerName.toLowerCase().includes(searchTerm.toLowerCase()) ||
      b.phone.includes(searchTerm) ||
      b.carModel.toLowerCase().includes(searchTerm.toLowerCase()) ||
      b.id.toLowerCase().includes(searchTerm.toLowerCase()) ||
      b.service.toLowerCase().includes(searchTerm.toLowerCase());
    const matchesStatus = statusFilter === 'ALL' || b.status === statusFilter;
    const matchesStudio = studioFilter === 'ALL' || b.studio?.includes(studioFilter);
    return matchesSearch && matchesStatus && matchesStudio;
  });

  // Filtered Customers
  const filteredCustomers = customers.filter((c) => {
    return (
      c.name.toLowerCase().includes(customerSearch.toLowerCase()) ||
      c.phone.includes(customerSearch) ||
      c.email.toLowerCase().includes(customerSearch.toLowerCase()) ||
      c.carModels.some((m) => m.toLowerCase().includes(customerSearch.toLowerCase()))
    );
  });

  // Metric KPIs
  const totalCount = bookings.length;
  const pendingCount = bookings.filter((b) => b.status === 'Pending').length;
  const inBayCount = bookings.filter((b) => b.status === 'In Bay').length;
  const confirmedCount = bookings.filter((b) => b.status === 'Confirmed').length;
  const completedCount = bookings.filter((b) => b.status === 'Completed').length;

  const getStatusBadgeClass = (status: BookingStatus) => {
    switch (status) {
      case 'Pending': return 'status-pending';
      case 'Confirmed': return 'status-confirmed';
      case 'In Bay': return 'status-in-bay';
      case 'Completed': return 'status-completed';
      case 'Cancelled': return 'status-cancelled';
      default: return '';
    }
  };

  // =========================================================================
  // 1. LOGIN SCREEN (When Not Authenticated)
  // =========================================================================
  if (!isAuthenticated) {
    return (
      <>
        <style>{`
          .admin-login-screen {
            min-height: 100vh;
            display: flex;
            align-items: center;
            justify-content: center;
            background: var(--bg-main);
            padding: 24px;
            position: relative;
            overflow: hidden;
          }
          .admin-login-bg-glow {
            position: absolute;
            top: 20%;
            left: 50%;
            transform: translate(-50%, -50%);
            width: 500px;
            height: 500px;
            background: radial-gradient(circle, rgba(234, 179, 8, 0.15) 0%, transparent 70%);
            filter: blur(60px);
            pointer-events: none;
          }
          [data-theme="dark"] .admin-login-bg-glow {
            background: radial-gradient(circle, rgba(255, 230, 0, 0.12) 0%, transparent 70%);
          }
          .admin-login-card {
            background: var(--bg-card);
            border: 1px solid var(--border-yellow);
            border-radius: 16px;
            padding: 42px 36px;
            width: 100%;
            max-width: 440px;
            box-shadow: var(--dropdown-shadow);
            position: relative;
            z-index: 2;
            text-align: center;
          }
          .admin-login-badge {
            width: 54px;
            height: 54px;
            background: var(--yellow-accent);
            color: #060709;
            border-radius: 12px;
            display: flex;
            align-items: center;
            justify-content: center;
            font-size: 1.6rem;
            margin: 0 auto 16px;
            box-shadow: 0 4px 15px rgba(234, 179, 8, 0.4);
          }
          .admin-login-title {
            font-size: 1.5rem;
            font-weight: 900;
            color: var(--text-primary);
            text-transform: uppercase;
            margin: 0 0 6px 0;
            letter-spacing: 0.5px;
          }
          .admin-login-subtitle {
            font-size: 0.85rem;
            color: var(--text-muted);
            margin: 0 0 28px 0;
          }
          .login-form-group {
            text-align: left;
            margin-bottom: 18px;
          }
          .login-form-label {
            display: block;
            font-family: var(--font-heading);
            font-size: 0.78rem;
            font-weight: 700;
            color: var(--text-primary);
            margin-bottom: 6px;
            text-transform: uppercase;
          }
          .login-form-input {
            width: 100%;
            background: var(--input-bg);
            border: 1px solid var(--input-border);
            color: var(--input-text);
            padding: 12px 14px;
            border-radius: 8px;
            font-size: 0.92rem;
            box-sizing: border-box;
            outline: none;
            transition: border-color 0.25s ease;
          }
          .login-form-input:focus {
            border-color: var(--yellow-dark);
          }
          [data-theme="dark"] .login-form-input:focus {
            border-color: var(--yellow);
          }
          .login-error-msg {
            background: rgba(239, 68, 68, 0.1);
            border: 1px solid rgba(239, 68, 68, 0.35);
            color: #EF4444;
            padding: 10px 14px;
            border-radius: 6px;
            font-size: 0.82rem;
            margin-bottom: 16px;
            text-align: left;
          }
          .demo-hint-box {
            background: var(--bg-subtle);
            border: 1px dashed var(--border-subtle);
            border-radius: 8px;
            padding: 12px 14px;
            margin-top: 24px;
            font-size: 0.78rem;
            color: var(--text-secondary);
            text-align: left;
          }
          .demo-hint-box strong {
            color: var(--text-primary);
          }
          .login-return-btn {
            background: none;
            border: none;
            color: var(--text-muted);
            font-size: 0.84rem;
            margin-top: 20px;
            cursor: pointer;
            text-decoration: underline;
          }
          .login-return-btn:hover {
            color: var(--yellow-dark);
          }
        `}</style>

        <div className="admin-login-screen">
          <div className="admin-login-bg-glow"></div>
          <div className="admin-login-card">
            <div className="admin-login-badge"><LockIcon size={26} color="#060709" /></div>
            <h1 className="admin-login-title">STUDIO ADMIN PORTAL</h1>
            <p className="admin-login-subtitle">Restricted Access • Authorized Detailing Staff</p>

            {loginError && <div className="login-error-msg"><AlertTriangleIcon size={16} /> {loginError}</div>}

            <form onSubmit={handleLogin}>
              <div className="login-form-group">
                <label className="login-form-label">Username</label>
                <input 
                  type="text" 
                  className="login-form-input" 
                  required 
                  placeholder="Enter admin username"
                  value={usernameInput}
                  onChange={(e) => setUsernameInput(e.target.value)}
                />
              </div>

              <div className="login-form-group">
                <label className="login-form-label">Password</label>
                <input 
                  type="password" 
                  className="login-form-input" 
                  required 
                  placeholder="Enter password"
                  value={passwordInput}
                  onChange={(e) => setPasswordInput(e.target.value)}
                />
              </div>

              <button 
                type="submit" 
                className="btn-automotive-cta" 
                style={{ width: '100%', justifyContent: 'center', marginTop: '10px' }}
              >
                <span>SIGN IN TO CONSOLE →</span>
              </button>
            </form>

            <div className="demo-hint-box">
              <div><strong>Default Demo Credentials:</strong></div>
              <div>Username: <code>admin</code></div>
              <div>Password: <code>admin123</code></div>
            </div>

            <button 
              type="button" 
              className="login-return-btn" 
              onClick={() => onNavigate('home')}
            >
              ← Return to Public Website
            </button>
          </div>
        </div>
      </>
    );
  }

  // =========================================================================
  // 2. AUTHENTICATED ADMIN PANEL (5 Tabs: Dashboard, Appointments, Customers, Reports, Settings)
  // =========================================================================
  return (
    <>
      <style>{`
        .admin-console-root {
          min-height: 100vh;
          background: var(--bg-main);
          display: flex;
          flex-direction: column;
          transition: background 0.3s ease;
        }
        .admin-fixed-header-wrapper {
          position: sticky;
          top: 0;
          left: 0;
          width: 100%;
          z-index: 1000;
          background: var(--bg-card);
          box-shadow: 0 4px 20px rgba(0, 0, 0, 0.08);
        }
        .admin-topbar {
          background: var(--bg-card);
          border-bottom: 1px solid var(--border-subtle);
          padding: 14px 28px;
          display: flex;
          justify-content: space-between;
          align-items: center;
        }
        .admin-top-brand {
          display: flex;
          align-items: center;
          gap: 12px;
        }
        .admin-brand-badge {
          width: 38px;
          height: 38px;
          background: var(--yellow-accent);
          color: #060709;
          border-radius: 8px;
          font-family: var(--font-heading);
          font-weight: 900;
          font-size: 1.1rem;
          display: flex;
          align-items: center;
          justify-content: center;
        }
        .admin-brand-text h2 {
          margin: 0;
          font-size: 1.1rem;
          font-weight: 900;
          color: var(--text-primary);
          letter-spacing: 0.5px;
        }
        .admin-brand-text span {
          font-size: 0.72rem;
          color: var(--text-muted);
        }
        .admin-top-controls {
          display: flex;
          align-items: center;
          gap: 12px;
        }
        .admin-tab-nav {
          background: var(--bg-subtle);
          border-bottom: 1px solid var(--border-subtle);
          padding: 0 28px;
          display: flex;
          gap: 4px;
          overflow-x: auto;
        }
        .admin-tab-btn {
          background: none;
          border: none;
          font-family: var(--font-heading);
          font-size: 0.88rem;
          font-weight: 700;
          color: var(--text-secondary);
          padding: 14px 18px;
          cursor: pointer;
          display: inline-flex;
          align-items: center;
          gap: 8px;
          position: relative;
          transition: all 0.2s ease;
          white-space: nowrap;
        }
        .admin-tab-btn:hover {
          color: var(--text-primary);
        }
        .admin-tab-btn.active {
          color: var(--yellow-dark);
        }
        [data-theme="dark"] .admin-tab-btn.active {
          color: var(--yellow);
        }
        .admin-tab-btn.active::after {
          content: '';
          position: absolute;
          bottom: 0;
          left: 0;
          width: 100%;
          height: 3px;
          background: var(--yellow);
          box-shadow: 0 0 10px var(--yellow);
          border-radius: 3px 3px 0 0;
        }
        .admin-body {
          flex: 1;
          padding: 28px;
          max-width: 1400px;
          width: 100%;
          margin: 0 auto;
          box-sizing: border-box;
        }
        .admin-sec-title {
          font-size: 1.4rem;
          font-weight: 900;
          color: var(--text-primary);
          text-transform: uppercase;
          margin: 0 0 20px 0;
          display: flex;
          align-items: center;
          justify-content: space-between;
          flex-wrap: wrap;
          gap: 12px;
        }
        .metrics-grid {
          display: grid;
          grid-template-columns: repeat(5, 1fr);
          gap: 16px;
          margin-bottom: 28px;
        }
        .metric-card {
          background: var(--bg-card);
          border: 1px solid var(--border-subtle);
          border-radius: 12px;
          padding: 18px 20px;
          box-shadow: var(--card-shadow);
          position: relative;
          overflow: hidden;
        }
        .metric-card.highlight {
          border-color: var(--border-yellow);
        }
        .metric-label {
          font-size: 0.74rem;
          font-weight: 700;
          color: var(--text-muted);
          text-transform: uppercase;
          margin-bottom: 6px;
        }
        .metric-val {
          font-family: var(--font-heading);
          font-size: 1.8rem;
          font-weight: 900;
          color: var(--text-primary);
          line-height: 1;
        }
        .metric-card.highlight .metric-val {
          color: var(--yellow-dark);
        }
        [data-theme="dark"] .metric-card.highlight .metric-val {
          color: var(--yellow);
        }
        .live-bays-grid {
          display: grid;
          grid-template-columns: repeat(4, 1fr);
          gap: 16px;
          margin-bottom: 28px;
        }
        .bay-card {
          background: var(--bg-card);
          border: 1px solid var(--border-subtle);
          border-radius: 12px;
          padding: 18px;
          box-shadow: var(--card-shadow);
        }
        .bay-header {
          display: flex;
          justify-content: space-between;
          align-items: center;
          margin-bottom: 12px;
        }
        .bay-num {
          font-family: var(--font-heading);
          font-size: 0.9rem;
          font-weight: 800;
          color: var(--text-primary);
        }
        .bay-status-chip {
          font-size: 0.68rem;
          font-weight: 700;
          padding: 3px 8px;
          border-radius: 999px;
        }
        .chip-occupied {
          background: rgba(16, 185, 129, 0.15);
          color: #10B981;
        }
        .chip-ready {
          background: rgba(59, 130, 246, 0.15);
          color: #3B82F6;
        }
        .bay-vehicle {
          font-size: 0.92rem;
          font-weight: 700;
          color: var(--text-primary);
          margin-bottom: 4px;
        }
        .bay-service {
          font-size: 0.78rem;
          color: var(--text-secondary);
          margin-bottom: 12px;
        }
        .bay-progress-bar {
          height: 6px;
          background: var(--border-subtle);
          border-radius: 3px;
          overflow: hidden;
        }
        .bay-progress-fill {
          height: 100%;
          background: var(--yellow);
          border-radius: 3px;
        }
        .admin-filter-bar {
          background: var(--bg-card);
          border: 1px solid var(--border-subtle);
          border-radius: 12px;
          padding: 16px 20px;
          margin-bottom: 20px;
          display: flex;
          align-items: center;
          justify-content: space-between;
          flex-wrap: wrap;
          gap: 16px;
        }
        .search-box-wrap {
          flex: 1;
          min-width: 240px;
          position: relative;
        }
        .admin-search-input {
          width: 100%;
          background: var(--input-bg);
          border: 1px solid var(--input-border);
          color: var(--input-text);
          padding: 10px 14px 10px 36px;
          border-radius: 6px;
          font-size: 0.88rem;
          outline: none;
          box-sizing: border-box;
        }
        .search-icon-pos {
          position: absolute;
          left: 12px;
          top: 50%;
          transform: translateY(-50%);
          font-size: 0.9rem;
          color: var(--text-muted);
        }
        .status-tabs {
          display: flex;
          gap: 6px;
          flex-wrap: wrap;
        }
        .status-tab-btn {
          background: var(--bg-subtle);
          border: 1px solid var(--border-subtle);
          color: var(--text-secondary);
          padding: 6px 12px;
          border-radius: 6px;
          font-family: var(--font-heading);
          font-size: 0.74rem;
          font-weight: 700;
          cursor: pointer;
        }
        .status-tab-btn.active {
          background: var(--yellow-accent);
          color: #060709;
          border-color: var(--yellow-accent);
        }
        .table-container {
          background: var(--bg-card);
          border: 1px solid var(--border-subtle);
          border-radius: 12px;
          overflow: hidden;
          box-shadow: var(--card-shadow);
        }
        .table-responsive {
          width: 100%;
          overflow-x: auto;
        }
        .admin-table {
          width: 100%;
          border-collapse: collapse;
          text-align: left;
          font-size: 0.86rem;
        }
        .admin-table th {
          background: var(--bg-subtle);
          padding: 14px 16px;
          font-family: var(--font-heading);
          font-size: 0.74rem;
          font-weight: 800;
          color: var(--text-muted);
          text-transform: uppercase;
          border-bottom: 1px solid var(--border-subtle);
          white-space: nowrap;
        }
        .admin-table td {
          padding: 14px 16px;
          border-bottom: 1px solid var(--border-subtle);
          color: var(--text-secondary);
          vertical-align: middle;
        }
        .admin-table tr:hover td {
          background: var(--bg-card-hover);
        }
        .booking-id-tag {
          font-family: var(--font-heading);
          font-weight: 800;
          color: var(--yellow-dark);
        }
        [data-theme="dark"] .booking-id-tag {
          color: var(--yellow);
        }
        .status-badge {
          display: inline-flex;
          align-items: center;
          gap: 6px;
          padding: 4px 10px;
          border-radius: 999px;
          font-family: var(--font-heading);
          font-size: 0.7rem;
          font-weight: 800;
        }
        .status-pending { background: rgba(234, 179, 8, 0.15); color: #CA8A04; border: 1px solid rgba(234, 179, 8, 0.4); }
        .status-confirmed { background: rgba(59, 130, 246, 0.12); color: #2563EB; border: 1px solid rgba(59, 130, 246, 0.35); }
        .status-in-bay { background: rgba(168, 85, 247, 0.12); color: #9333EA; border: 1px solid rgba(168, 85, 247, 0.35); }
        .status-completed { background: rgba(16, 185, 129, 0.12); color: #059669; border: 1px solid rgba(16, 185, 129, 0.35); }
        .status-cancelled { background: rgba(239, 68, 68, 0.12); color: #DC2626; border: 1px solid rgba(239, 68, 68, 0.35); }
        .action-btns-group {
          display: flex;
          align-items: center;
          gap: 6px;
        }
        .action-icon-btn {
          background: var(--bg-subtle);
          border: 1px solid var(--border-subtle);
          color: var(--text-secondary);
          width: 28px;
          height: 28px;
          border-radius: 6px;
          display: flex;
          align-items: center;
          justify-content: center;
          cursor: pointer;
          font-size: 0.82rem;
          text-decoration: none;
        }
        .action-icon-btn:hover { border-color: var(--border-yellow); color: var(--yellow-dark); }
        .action-icon-btn.danger:hover { border-color: #EF4444; color: #EF4444; }
        .report-cards-grid {
          display: grid;
          grid-template-columns: repeat(2, 1fr);
          gap: 24px;
          margin-bottom: 28px;
        }
        .report-box {
          background: var(--bg-card);
          border: 1px solid var(--border-subtle);
          border-radius: 12px;
          padding: 24px;
          box-shadow: var(--card-shadow);
        }
        .report-box-title {
          font-size: 1.1rem;
          font-weight: 800;
          color: var(--text-primary);
          margin-bottom: 18px;
          text-transform: uppercase;
        }
        .stat-bar-item {
          margin-bottom: 16px;
        }
        .stat-bar-labels {
          display: flex;
          justify-content: space-between;
          font-size: 0.84rem;
          font-weight: 600;
          margin-bottom: 6px;
          color: var(--text-primary);
        }
        .stat-bar-track {
          height: 8px;
          background: var(--bg-subtle);
          border-radius: 4px;
          overflow: hidden;
        }
        .stat-bar-fill {
          height: 100%;
          background: var(--yellow-accent);
          border-radius: 4px;
        }
        .settings-card {
          background: var(--bg-card);
          border: 1px solid var(--border-subtle);
          border-radius: 12px;
          padding: 28px;
          margin-bottom: 24px;
          width: 100%;
          box-sizing: border-box;
          box-shadow: var(--card-shadow);
        }
        .settings-title {
          font-size: 1.15rem;
          font-weight: 800;
          color: var(--text-primary);
          text-transform: uppercase;
          margin-bottom: 16px;
        }
        /* Modal */
        .admin-modal-backdrop {
          position: fixed;
          top: 0;
          left: 0;
          width: 100vw;
          height: 100vh;
          background: var(--modal-backdrop-bg);
          backdrop-filter: blur(10px);
          display: flex;
          align-items: center;
          justify-content: center;
          padding: 20px;
          z-index: 2000;
        }
        .admin-modal-card {
          background: var(--modal-bg);
          border: 1px solid var(--border-yellow);
          border-radius: 14px;
          padding: 30px;
          width: 100%;
          max-width: 500px;
          box-shadow: var(--dropdown-shadow);
          max-height: 90vh;
          overflow-y: auto;
        }
        /* Services Catalog */
        .admin-services-grid {
          display: grid;
          grid-template-columns: repeat(auto-fill, minmax(360px, 1fr));
          gap: 24px;
          margin-bottom: 30px;
        }
        .admin-service-card {
          background: var(--bg-card);
          border: 1px solid var(--border-subtle);
          border-radius: 12px;
          overflow: hidden;
          box-shadow: var(--card-shadow);
          display: flex;
          flex-direction: column;
          transition: transform 0.2s ease, border-color 0.2s ease;
        }
        .admin-service-card:hover {
          border-color: var(--border-yellow);
          transform: translateY(-2px);
        }
        .admin-service-thumb-wrap {
          position: relative;
          height: 180px;
          overflow: hidden;
          background: #0b0f19;
        }
        .admin-service-thumb {
          width: 100%;
          height: 100%;
          object-fit: cover;
        }
        .admin-service-badge {
          position: absolute;
          top: 12px;
          right: 12px;
          background: var(--yellow-accent);
          color: #060709;
          font-family: var(--font-heading);
          font-size: 0.68rem;
          font-weight: 900;
          padding: 3px 8px;
          border-radius: 4px;
          letter-spacing: 0.5px;
        }
        .admin-service-body {
          padding: 20px;
          display: flex;
          flex-direction: column;
          flex: 1;
        }
        .admin-service-name {
          font-size: 1.15rem;
          font-weight: 800;
          color: var(--text-primary);
          margin: 0 0 6px 0;
        }
        .admin-service-desc {
          font-size: 0.82rem;
          color: var(--text-muted);
          line-height: 1.5;
          margin-bottom: 14px;
        }
        .admin-service-features {
          list-style: none;
          padding: 0;
          margin: 0 0 16px 0;
          display: flex;
          flex-direction: column;
          gap: 6px;
        }
        .admin-service-features li {
          font-size: 0.78rem;
          color: var(--text-secondary);
          display: flex;
          align-items: flex-start;
          gap: 6px;
        }
        .admin-service-features li strong {
          color: var(--text-primary);
        }
        .admin-service-addon {
          background: var(--bg-subtle);
          padding: 8px 12px;
          border-radius: 6px;
          font-size: 0.74rem;
          color: var(--text-primary);
          margin-top: auto;
          margin-bottom: 16px;
          border-left: 3px solid var(--yellow);
        }
        .admin-service-actions {
          display: flex;
          gap: 10px;
          padding-top: 14px;
          border-top: 1px solid var(--border-subtle);
        }
        @media (max-width: 1024px) {
          .metrics-grid { grid-template-columns: repeat(3, 1fr); }
          .live-bays-grid { grid-template-columns: repeat(2, 1fr); }
          .report-cards-grid { grid-template-columns: 1fr; }
        }
        @media (max-width: 640px) {
          .metrics-grid { grid-template-columns: repeat(2, 1fr); }
          .live-bays-grid { grid-template-columns: 1fr; }
          .admin-topbar { padding: 12px 16px; flex-direction: column; gap: 10px; align-items: flex-start; }
          .admin-tab-nav { padding: 0 12px; }
          .admin-body { padding: 16px 12px; }
        }
      `}</style>

      <div className="admin-console-root">
        {/* Fixed Header & Navigation Tabs Wrapper (Stays pinned at top on scroll) */}
        <div className="admin-fixed-header-wrapper">
          {/* Top Header */}
          <header className="admin-topbar">
            <div className="admin-top-brand">
              <div className="admin-brand-badge">CC</div>
              <div className="admin-brand-text">
                <h2>{siteSettings.siteName.toUpperCase()} ADMIN</h2>
                <span>Master Bay Detailing & Scheduling Command Center</span>
              </div>
            </div>

            <div className="admin-top-controls">
              <button 
                type="button" 
                className="btn-ghost"
                style={{ fontSize: '0.8rem', padding: '8px 14px', display: 'inline-flex', alignItems: 'center', gap: '6px' }}
                onClick={() => onNavigate('home')}
                title="View Public Site"
              >
                <EyeIcon size={16} />
                <span>VIEW PUBLIC SITE</span>
              </button>

              <button 
                type="button" 
                className="btn-automotive-cta"
                style={{ fontSize: '0.8rem', padding: '8px 16px', background: '#EF4444', color: '#FFF', display: 'inline-flex', alignItems: 'center', gap: '6px' }}
                onClick={handleLogout}
                title="Sign Out"
              >
                <span>LOGOUT</span>
                <LogoutIcon size={16} />
              </button>
            </div>
          </header>

          {/* Navigation Tabs: Dashboard, Appointments, Customers, Services, Reports, Settings */}
          <nav className="admin-tab-nav" aria-label="Admin Navigation Tabs">
            <button 
              type="button" 
              className={`admin-tab-btn ${activeTab === 'dashboard' ? 'active' : ''}`}
              onClick={() => setActiveTab('dashboard')}
            >
              <BarChartIcon size={16} />
              <span>DASHBOARD</span>
            </button>

            <button 
              type="button" 
              className={`admin-tab-btn ${activeTab === 'appointments' ? 'active' : ''}`}
              onClick={() => setActiveTab('appointments')}
            >
              <CalendarIcon size={16} />
              <span>APPOINTMENTS</span>
              <span style={{ fontSize: '0.72rem', background: 'var(--yellow-accent)', color: '#060709', padding: '1px 6px', borderRadius: '10px' }}>
                {totalCount}
              </span>
            </button>

            <button 
              type="button" 
              className={`admin-tab-btn ${activeTab === 'customers' ? 'active' : ''}`}
              onClick={() => setActiveTab('customers')}
            >
              <UsersIcon size={16} />
              <span>CUSTOMERS</span>
              <span style={{ fontSize: '0.72rem', background: 'var(--bg-card)', padding: '1px 6px', borderRadius: '10px' }}>
                {customers.length}
              </span>
            </button>

            <button 
              type="button" 
              className={`admin-tab-btn ${activeTab === 'services' ? 'active' : ''}`}
              onClick={() => setActiveTab('services')}
            >
              <SparkleIcon size={16} />
              <span>SERVICES</span>
              <span style={{ fontSize: '0.72rem', background: 'var(--yellow-accent)', color: '#060709', padding: '1px 6px', borderRadius: '10px' }}>
                {servicesList.length}
              </span>
            </button>

            <button 
              type="button" 
              className={`admin-tab-btn ${activeTab === 'reports' ? 'active' : ''}`}
              onClick={() => setActiveTab('reports')}
            >
              <TrendingUpIcon size={16} />
              <span>REPORTS</span>
            </button>

            <button 
              type="button" 
              className={`admin-tab-btn ${activeTab === 'settings' ? 'active' : ''}`}
              onClick={() => setActiveTab('settings')}
            >
              <GearSettingIcon size={16} />
              <span>SETTINGS</span>
            </button>
          </nav>
        </div>

        {/* Main Body */}
        <main className="admin-body">
          {/* ===============================================================
              TAB 1: DASHBOARD
              =============================================================== */}
          {activeTab === 'dashboard' && (
            <div>
              <div className="admin-sec-title">
                <span>STUDIO OVERVIEW & LIVE BAYS</span>
                <button 
                  type="button" 
                  className="btn-automotive-cta"
                  style={{ fontSize: '0.82rem', padding: '8px 16px' }}
                  onClick={() => setIsAddModalOpen(true)}
                >
                  <span>➕ NEW APPOINTMENT</span>
                </button>
              </div>

              {/* KPI Cards */}
              <div className="metrics-grid">
                <div className="metric-card">
                  <div className="metric-label">Total Appointments</div>
                  <div className="metric-val">{totalCount}</div>
                </div>
                <div className="metric-card highlight">
                  <div className="metric-label">Pending Approval</div>
                  <div className="metric-val">{pendingCount}</div>
                </div>
                <div className="metric-card">
                  <div className="metric-label">Confirmed Slots</div>
                  <div className="metric-val">{confirmedCount}</div>
                </div>
                <div className="metric-card">
                  <div className="metric-label">In Master Bay</div>
                  <div className="metric-val">{inBayCount}</div>
                </div>
                <div className="metric-card">
                  <div className="metric-label">Completed Handover</div>
                  <div className="metric-val">{completedCount}</div>
                </div>
              </div>

              {/* Live Master Bay Status */}
              <div style={{ marginBottom: '12px', fontWeight: 800, fontSize: '0.92rem', color: 'var(--text-primary)' }}>
                🔴 LIVE STUDIO BAY STATUS (REAL-TIME CURE & DETAILING PROGRESS)
              </div>
              <div className="live-bays-grid">
                <div className="bay-card">
                  <div className="bay-header">
                    <span className="bay-num">BAY 01 • CHENNAI</span>
                    <span className="bay-status-chip chip-occupied">ACTIVE CURE</span>
                  </div>
                  <div className="bay-vehicle">Porsche 911 GT3 RS</div>
                  <div className="bay-service">10H Ceramic Coating • Layer 2</div>
                  <div className="bay-progress-bar"><div className="bay-progress-fill" style={{ width: '85%' }}></div></div>
                  <span style={{ fontSize: '0.72rem', color: 'var(--text-muted)', marginTop: '4px', display: 'block' }}>Infrared Curing: 85% Complete</span>
                </div>

                <div className="bay-card">
                  <div className="bay-header">
                    <span className="bay-num">BAY 02 • CHENNAI</span>
                    <span className="bay-status-chip chip-occupied">PPF WRAP</span>
                  </div>
                  <div className="bay-vehicle">McLaren 720S Spider</div>
                  <div className="bay-service">Full Optical Armor TPU PPF</div>
                  <div className="bay-progress-bar"><div className="bay-progress-fill" style={{ width: '50%' }}></div></div>
                  <span style={{ fontSize: '0.72rem', color: 'var(--text-muted)', marginTop: '4px', display: 'block' }}>Hood & Rockers Done: 50%</span>
                </div>

                <div className="bay-card">
                  <div className="bay-header">
                    <span className="bay-num">BAY 03 • BANGALORE</span>
                    <span className="bay-status-chip chip-occupied">INTERIOR SPA</span>
                  </div>
                  <div className="bay-vehicle">Mercedes-AMG G63</div>
                  <div className="bay-service">Swissvax Leather Balm & Ozone</div>
                  <div className="bay-progress-bar"><div className="bay-progress-fill" style={{ width: '70%' }}></div></div>
                  <span style={{ fontSize: '0.72rem', color: 'var(--text-muted)', marginTop: '4px', display: 'block' }}>Ozone Purge Complete: 70%</span>
                </div>

                <div className="bay-card">
                  <div className="bay-header">
                    <span className="bay-num">BAY 04 • COIMBATORE</span>
                    <span className="bay-status-chip chip-ready">READY & SANITIZED</span>
                  </div>
                  <div className="bay-vehicle">Open Clean Room</div>
                  <div className="bay-service">Awaiting Next Arrival</div>
                  <div className="bay-progress-bar"><div className="bay-progress-fill" style={{ width: '0%', background: '#3B82F6' }}></div></div>
                  <span style={{ fontSize: '0.72rem', color: 'var(--text-muted)', marginTop: '4px', display: 'block' }}>Ready for BMW M4 Competition</span>
                </div>
              </div>

              {/* Recent Incoming Bookings Table on Dashboard */}
              <div style={{ marginTop: '28px', marginBottom: '14px', display: 'flex', justifyContent: 'space-between', alignItems: 'center', flexWrap: 'wrap', gap: '8px' }}>
                <span style={{ fontWeight: 800, fontSize: '0.92rem', color: 'var(--text-primary)' }}>
                  ⚡ RECENT WEBSITE BOOKINGS & APPOINTMENTS (LIVE FEED)
                </span>
                <span style={{ fontSize: '0.75rem', color: 'var(--yellow-dark)', fontWeight: 700 }}>
                  ● Auto-Syncs with Website
                </span>
              </div>

              <div className="table-container" style={{ marginBottom: '24px' }}>
                <div className="table-responsive">
                  <table className="admin-table">
                    <thead>
                      <tr>
                        <th>Ref ID</th>
                        <th>Customer</th>
                        <th>Vehicle Model</th>
                        <th>Service</th>
                        <th>Date & Studio</th>
                        <th>Status</th>
                        <th>Actions</th>
                      </tr>
                    </thead>
                    <tbody>
                      {bookings.slice(0, 5).map((b) => (
                        <tr key={b.id}>
                          <td>
                            <span className="booking-id-tag">{b.id}</span>
                            {b.status === 'Pending' && (
                              <span style={{
                                marginLeft: '6px',
                                background: '#EF4444',
                                color: '#FFF',
                                fontSize: '0.6rem',
                                padding: '2px 5px',
                                borderRadius: '4px',
                                fontWeight: 800
                              }}>NEW</span>
                            )}
                          </td>
                          <td>
                            <strong style={{ color: 'var(--text-primary)', display: 'block' }}>{b.customerName}</strong>
                            <span style={{ fontSize: '0.74rem', color: 'var(--text-muted)' }}>{b.phone}</span>
                          </td>
                          <td><strong style={{ color: 'var(--text-primary)' }}>{b.carModel}</strong></td>
                          <td>{b.service}</td>
                          <td>
                            <span style={{ fontWeight: 700, color: 'var(--text-primary)' }}>{b.date}</span>
                            <div style={{ fontSize: '0.72rem', color: 'var(--text-muted)' }}>{b.studio || 'Chennai Studio'}</div>
                          </td>
                          <td>
                            <select 
                              className={`status-badge ${getStatusBadgeClass(b.status)}`}
                              value={b.status}
                              onChange={(e) => handleStatusChange(b.id, e.target.value as BookingStatus)}
                              style={{ cursor: 'pointer', outline: 'none' }}
                            >
                              <option value="Pending">🟡 Pending</option>
                              <option value="Confirmed">🔵 Confirmed</option>
                              <option value="In Bay">🟣 In Bay</option>
                              <option value="Completed">🟢 Completed</option>
                              <option value="Cancelled">🔴 Cancelled</option>
                            </select>
                          </td>
                          <td>
                            <div className="action-btns-group">
                              <button 
                                type="button" 
                                className="action-icon-btn" 
                                title="View Notes & Inspection"
                                onClick={() => setSelectedBooking(b)}
                              >
                                📝
                              </button>
                              <a href={`tel:${b.phone}`} className="action-icon-btn" title="Call Customer">📞</a>
                              <a 
                                href={`https://wa.me/${b.phone.replace(/[^0-9]/g, '')}`} 
                                target="_blank" 
                                rel="noreferrer" 
                                className="action-icon-btn" 
                                title="WhatsApp"
                              >
                                💬
                              </a>
                            </div>
                          </td>
                        </tr>
                      ))}
                    </tbody>
                  </table>
                </div>
              </div>

              {/* Quick Jump Buttons */}
              <div style={{ display: 'flex', gap: '14px', flexWrap: 'wrap' }}>
                <button type="button" className="btn-ghost" onClick={() => setActiveTab('appointments')}>
                  <span>VIEW ALL APPOINTMENTS ({totalCount}) →</span>
                </button>
                <button type="button" className="btn-ghost" onClick={() => setActiveTab('customers')}>
                  <span>MANAGE CLIENT DIRECTORY ({customers.length}) →</span>
                </button>
                <button type="button" className="btn-ghost" onClick={() => setActiveTab('reports')}>
                  <span>VIEW REVENUE REPORTS →</span>
                </button>
              </div>
            </div>
          )}

          {/* ===============================================================
              TAB 2: APPOINTMENTS
              =============================================================== */}
          {activeTab === 'appointments' && (
            <div>
              <div className="admin-sec-title">
                <span>APPOINTMENT MANAGEMENT</span>
                <div style={{ display: 'flex', gap: '10px' }}>
                  <button 
                    type="button" 
                    className="btn-automotive-cta"
                    style={{ fontSize: '0.82rem', padding: '8px 16px' }}
                    onClick={() => setIsAddModalOpen(true)}
                  >
                    <span>➕ ADD APPOINTMENT</span>
                  </button>
                  <button 
                    type="button" 
                    className="btn-ghost"
                    style={{ fontSize: '0.82rem', padding: '8px 16px' }}
                    onClick={handleExportCSV}
                  >
                    <span>📥 EXPORT CSV</span>
                  </button>
                </div>
              </div>

              {/* Filter Bar */}
              <div className="admin-filter-bar">
                <div className="search-box-wrap">
                  <span className="search-icon-pos">🔍</span>
                  <input 
                    type="text" 
                    className="admin-search-input"
                    placeholder="Search by customer, phone, car, or ID..."
                    value={searchTerm}
                    onChange={(e) => setSearchTerm(e.target.value)}
                  />
                </div>

                <div className="status-tabs">
                  {['ALL', 'Pending', 'Confirmed', 'In Bay', 'Completed', 'Cancelled'].map((tab) => (
                    <button
                      key={tab}
                      type="button"
                      className={`status-tab-btn ${statusFilter === tab ? 'active' : ''}`}
                      onClick={() => setStatusFilter(tab)}
                    >
                      {tab}
                    </button>
                  ))}
                </div>

                <div>
                  <select 
                    style={{ padding: '8px 12px', borderRadius: '6px', border: '1px solid var(--border-subtle)', background: 'var(--bg-subtle)', color: 'var(--text-primary)', fontSize: '0.82rem' }}
                    value={studioFilter}
                    onChange={(e) => setStudioFilter(e.target.value)}
                  >
                    <option value="ALL">All Regional Studios</option>
                    <option value="Chennai">Chennai Studio</option>
                    <option value="Bangalore">Bangalore Studio</option>
                    <option value="Coimbatore">Coimbatore Studio</option>
                  </select>
                </div>
              </div>

              {/* Table */}
              <div className="table-container">
                <div className="table-responsive">
                  <table className="admin-table">
                    <thead>
                      <tr>
                        <th>Ref ID</th>
                        <th>Customer</th>
                        <th>Vehicle & Number</th>
                        <th>Service</th>
                        <th>Date & Studio</th>
                        <th>Status</th>
                        <th>Actions</th>
                      </tr>
                    </thead>
                    <tbody>
                      {filteredBookings.length === 0 ? (
                        <tr>
                          <td colSpan={7} style={{ textAlign: 'center', padding: '40px', color: 'var(--text-muted)' }}>
                            No appointments found matching this query.
                          </td>
                        </tr>
                      ) : (
                        filteredBookings.map((b) => (
                          <tr key={b.id}>
                            <td><span className="booking-id-tag">{b.id}</span></td>
                            <td>
                              <strong style={{ color: 'var(--text-primary)', display: 'block' }}>{b.customerName}</strong>
                              <span style={{ fontSize: '0.74rem', color: 'var(--text-muted)' }}>{b.phone}</span>
                            </td>
                            <td>
                              <strong style={{ color: 'var(--text-primary)', display: 'block' }}>{b.carModel}</strong>
                              {b.vehicleNumber && (
                                <span style={{ fontSize: '0.74rem', color: 'var(--yellow-dark)', fontWeight: 700, background: 'rgba(234, 179, 8, 0.1)', padding: '1px 6px', borderRadius: '4px', display: 'inline-block', marginTop: '2px' }}>
                                  {b.vehicleNumber}
                                </span>
                              )}
                            </td>
                            <td>{b.service}</td>
                            <td>
                              <span style={{ fontWeight: 700, color: 'var(--text-primary)' }}>{b.date}</span>
                              <div style={{ fontSize: '0.72rem', color: 'var(--text-muted)' }}>{b.studio || 'Chennai Studio'}</div>
                            </td>
                            <td>
                              <select 
                                className={`status-badge ${getStatusBadgeClass(b.status)}`}
                                value={b.status}
                                onChange={(e) => handleStatusChange(b.id, e.target.value as BookingStatus)}
                                style={{ cursor: 'pointer', outline: 'none' }}
                              >
                                <option value="Pending">🟡 Pending</option>
                                <option value="Confirmed">🔵 Confirmed</option>
                                <option value="In Bay">🟣 In Bay</option>
                                <option value="Completed">🟢 Completed</option>
                                <option value="Cancelled">🔴 Cancelled</option>
                              </select>
                            </td>
                            <td>
                              <div className="action-btns-group">
                                <button 
                                  type="button" 
                                  className="action-icon-btn" 
                                  title="View Notes & Inspection"
                                  onClick={() => setSelectedBooking(b)}
                                >
                                  📝
                                </button>
                                <a href={`tel:${b.phone}`} className="action-icon-btn" title="Call Customer">📞</a>
                                <a 
                                  href={`https://wa.me/${b.phone.replace(/[^0-9]/g, '')}`} 
                                  target="_blank" 
                                  rel="noreferrer" 
                                  className="action-icon-btn" 
                                  title="WhatsApp"
                                >
                                  💬
                                </a>
                                <button 
                                  type="button" 
                                  className="action-icon-btn danger" 
                                  title="Delete Appointment"
                                  onClick={() => handleDeleteBooking(b.id)}
                                >
                                  🗑️
                                </button>
                              </div>
                            </td>
                          </tr>
                        ))
                      )}
                    </tbody>
                  </table>
                </div>
              </div>
            </div>
          )}

          {/* ===============================================================
              TAB 3: CUSTOMERS
              =============================================================== */}
          {activeTab === 'customers' && (
            <div>
              <div className="admin-sec-title">
                <span>CLIENT DIRECTORY & SUPERCAR FLEET</span>
                <button 
                  type="button" 
                  className="btn-automotive-cta"
                  style={{ fontSize: '0.82rem', padding: '8px 16px' }}
                  onClick={() => setIsAddCustomerOpen(true)}
                >
                  <span>➕ ADD CLIENT</span>
                </button>
              </div>

              {/* Customer Search */}
              <div className="admin-filter-bar">
                <div className="search-box-wrap">
                  <span className="search-icon-pos">🔍</span>
                  <input 
                    type="text" 
                    className="admin-search-input"
                    placeholder="Search client by name, phone, email, or car model..."
                    value={customerSearch}
                    onChange={(e) => setCustomerSearch(e.target.value)}
                  />
                </div>
              </div>

              {/* Customers Table */}
              <div className="table-container">
                <div className="table-responsive">
                  <table className="admin-table">
                    <thead>
                      <tr>
                        <th>Client ID</th>
                        <th>Name & Contact</th>
                        <th>Vehicles in Registry</th>
                        <th>Preferred Service</th>
                        <th>Actions</th>
                      </tr>
                    </thead>
                    <tbody>
                      {filteredCustomers.length === 0 ? (
                        <tr>
                          <td colSpan={5} style={{ textAlign: 'center', padding: '40px', color: 'var(--text-muted)' }}>
                            No clients match your search.
                          </td>
                        </tr>
                      ) : (
                        filteredCustomers.map((c) => (
                          <tr key={c.id}>
                            <td><strong style={{ color: 'var(--yellow-dark)' }}>{c.id}</strong></td>
                            <td>
                              <strong style={{ color: 'var(--text-primary)', display: 'block' }}>{c.name}</strong>
                              <span style={{ fontSize: '0.74rem', color: 'var(--text-muted)' }}>{c.phone} • {c.email}</span>
                            </td>
                            <td>
                              {c.carModels.map((m, i) => (
                                <span key={i} style={{ display: 'inline-block', background: 'var(--bg-subtle)', padding: '2px 8px', borderRadius: '4px', fontSize: '0.74rem', margin: '2px' }}>
                                  🚗 {m}
                                </span>
                              ))}
                              {c.vehicleNumbers && c.vehicleNumbers.map((vn, i) => (
                                <span key={`vn-${i}`} style={{ display: 'inline-block', background: 'rgba(234, 179, 8, 0.15)', color: 'var(--yellow-dark)', padding: '2px 8px', borderRadius: '4px', fontSize: '0.74rem', margin: '2px', fontWeight: 700 }}>
                                  {vn}
                                </span>
                              ))}
                            </td>
                            <td style={{ fontSize: '0.8rem' }}>{c.preferredService}</td>
                            <td>
                              <div className="action-btns-group">
                                <a href={`tel:${c.phone}`} className="action-icon-btn" title="Call">📞</a>
                                <a href={`https://wa.me/${c.phone.replace(/[^0-9]/g, '')}`} target="_blank" rel="noreferrer" className="action-icon-btn" title="WhatsApp">💬</a>
                                <button type="button" className="action-icon-btn danger" title="Delete" onClick={() => handleDeleteCustomer(c.id)}>🗑️</button>
                              </div>
                            </td>
                          </tr>
                        ))
                      )}
                    </tbody>
                  </table>
                </div>
              </div>
            </div>
          )}

          {/* ===============================================================
              TAB: SERVICES (DYNAMIC CATALOG MANAGEMENT)
              =============================================================== */}
          {activeTab === 'services' && (
            <div>
              <div className="admin-sec-title">
                <div>
                  <span>SERVICES & DETAILING CATALOG</span>
                  <p style={{ margin: '4px 0 0 0', fontSize: '0.8rem', fontWeight: 500, color: 'var(--text-muted)', textTransform: 'none' }}>
                    Manage detailing treatments displayed on the website. Adding or updating services dynamically updates the Services division on the website.
                  </p>
                </div>
                <button 
                  type="button" 
                  className="btn-automotive-cta"
                  style={{ fontSize: '0.82rem', padding: '8px 16px' }}
                  onClick={handleOpenAddService}
                >
                  <span>➕ ADD NEW SERVICE</span>
                </button>
              </div>

              {/* Service Cards Grid */}
              <div className="admin-services-grid">
                {servicesList.map((service) => (
                  <div key={service.id} className="admin-service-card">
                    <div className="admin-service-thumb-wrap">
                      <img 
                        src={resolveServiceImage(service.thumbnail)} 
                        alt={service.name} 
                        className="admin-service-thumb"
                        onError={(e) => {
                          (e.target as HTMLImageElement).src = '/assets/detail_after.jpg';
                        }}
                      />
                      <span className="admin-service-badge">{service.tag}</span>
                    </div>

                    <div className="admin-service-body">
                      <h4 className="admin-service-name">{service.name}</h4>
                      <p className="admin-service-desc">{service.shortDesc}</p>

                      <ul className="admin-service-features">
                        {(service.features || []).map((feat, idx) => (
                          <li key={idx}>
                            <span>✦</span>
                            <div>
                              <strong>{feat.title}:</strong> {feat.desc}
                            </div>
                          </li>
                        ))}
                      </ul>

                      {service.addon && (
                        <div className="admin-service-addon">
                          ✓ {service.addon}
                        </div>
                      )}

                      <div className="admin-service-actions">
                        <button 
                          type="button" 
                          className="btn-ghost" 
                          style={{ flex: 1, padding: '8px 12px', fontSize: '0.78rem' }}
                          onClick={() => handleOpenEditService(service)}
                        >
                          ✏️ Edit Service
                        </button>
                        <button 
                          type="button" 
                          className="btn-ghost" 
                          style={{ color: '#EF4444', borderColor: 'rgba(239, 68, 68, 0.4)', padding: '8px 14px', fontSize: '0.78rem' }}
                          onClick={() => handleDeleteService(service.id, service.name)}
                        >
                          🗑️ Delete
                        </button>
                      </div>
                    </div>
                  </div>
                ))}
              </div>
            </div>
          )}

          {/* ===============================================================
              TAB 4: REPORTS
              =============================================================== */}
          {activeTab === 'reports' && (
            <div>
              <div className="admin-sec-title">
                <span>STUDIO PERFORMANCE & REVENUE REPORTS</span>
                <button 
                  type="button" 
                  className="btn-automotive-cta"
                  style={{ fontSize: '0.82rem', padding: '8px 16px' }}
                  onClick={handleExportCSV}
                >
                  <span>📥 DOWNLOAD APPOINTMENTS CSV</span>
                </button>
              </div>

              {/* Report Summary Cards */}
              <div className="report-cards-grid">
                {/* Box 1: Service Breakdown */}
                <div className="report-box">
                  <h3 className="report-box-title">🏆 Popular Detailing Services</h3>
                  
                  <div className="stat-bar-item">
                    <div className="stat-bar-labels">
                      <span>Ceramic & Graphene Coating</span>
                      <span>38% (9 Vehicles)</span>
                    </div>
                    <div className="stat-bar-track">
                      <div className="stat-bar-fill" style={{ width: '38%' }}></div>
                    </div>
                  </div>

                  <div className="stat-bar-item">
                    <div className="stat-bar-labels">
                      <span>Full Body Armor PPF</span>
                      <span>32% (7 Vehicles)</span>
                    </div>
                    <div className="stat-bar-track">
                      <div className="stat-bar-fill" style={{ width: '32%' }}></div>
                    </div>
                  </div>

                  <div className="stat-bar-item">
                    <div className="stat-bar-labels">
                      <span>Stage 2/3 Paint Correction</span>
                      <span>18% (4 Vehicles)</span>
                    </div>
                    <div className="stat-bar-track">
                      <div className="stat-bar-fill" style={{ width: '18%' }}></div>
                    </div>
                  </div>

                  <div className="stat-bar-item">
                    <div className="stat-bar-labels">
                      <span>Interior Sanctuary Spa</span>
                      <span>12% (3 Vehicles)</span>
                    </div>
                    <div className="stat-bar-track">
                      <div className="stat-bar-fill" style={{ width: '12%' }}></div>
                    </div>
                  </div>
                </div>

                {/* Box 2: Regional Studio Volume */}
                <div className="report-box">
                  <h3 className="report-box-title">📍 Regional Studio Volume</h3>

                  <div className="stat-bar-item">
                    <div className="stat-bar-labels">
                      <span>Chennai Studio (Guindy Hub)</span>
                      <span>48% Volume</span>
                    </div>
                    <div className="stat-bar-track">
                      <div className="stat-bar-fill" style={{ width: '48%', background: '#10B981' }}></div>
                    </div>
                  </div>

                  <div className="stat-bar-item">
                    <div className="stat-bar-labels">
                      <span>Bangalore Studio (Indiranagar Hub)</span>
                      <span>35% Volume</span>
                    </div>
                    <div className="stat-bar-track">
                      <div className="stat-bar-fill" style={{ width: '35%', background: '#3B82F6' }}></div>
                    </div>
                  </div>

                  <div className="stat-bar-item">
                    <div className="stat-bar-labels">
                      <span>Coimbatore Studio (Peelamedu Hub)</span>
                      <span>17% Volume</span>
                    </div>
                    <div className="stat-bar-track">
                      <div className="stat-bar-fill" style={{ width: '17%', background: '#F59E0B' }}></div>
                    </div>
                  </div>
                </div>
              </div>

              {/* Quality & Revenue Highlights */}
              <div style={{ background: 'var(--bg-card)', border: '1px solid var(--border-subtle)', borderRadius: '12px', padding: '24px', display: 'grid', gridTemplateColumns: 'repeat(4, 1fr)', gap: '20px', textAlign: 'center' }}>
                <div>
                  <div style={{ fontSize: '0.74rem', color: 'var(--text-muted)', textTransform: 'uppercase', marginBottom: '6px' }}>ESTIMATED REVENUE</div>
                  <div style={{ fontFamily: 'var(--font-heading)', fontSize: '1.8rem', fontWeight: 900, color: 'var(--yellow-dark)' }}>₹1,42,800</div>
                </div>
                <div>
                  <div style={{ fontSize: '0.74rem', color: 'var(--text-muted)', textTransform: 'uppercase', marginBottom: '6px' }}>AVERAGE TICKET</div>
                  <div style={{ fontFamily: 'var(--font-heading)', fontSize: '1.8rem', fontWeight: 900, color: 'var(--text-primary)' }}>₹2,850</div>
                </div>
                <div>
                  <div style={{ fontSize: '0.74rem', color: 'var(--text-muted)', textTransform: 'uppercase', marginBottom: '6px' }}>SWIRL-FREE PASS RATE</div>
                  <div style={{ fontFamily: 'var(--font-heading)', fontSize: '1.8rem', fontWeight: 900, color: '#10B981' }}>99.8%</div>
                </div>
                <div>
                  <div style={{ fontSize: '0.74rem', color: 'var(--text-muted)', textTransform: 'uppercase', marginBottom: '6px' }}>WARRANTY CLAIMS</div>
                  <div style={{ fontFamily: 'var(--font-heading)', fontSize: '1.8rem', fontWeight: 900, color: '#3B82F6' }}>0</div>
                </div>
              </div>
            </div>
          )}

          {/* ===============================================================
              TAB 5: SETTINGS
              =============================================================== */}
          {activeTab === 'settings' && (
            <div>
              <div className="admin-sec-title">
                <span>STUDIO & CONSOLE SETTINGS</span>
              </div>

              {settingsNotice && (
                <div style={{ background: 'rgba(16, 185, 129, 0.15)', border: '1px solid #10B981', color: '#10B981', padding: '12px 16px', borderRadius: '8px', marginBottom: '20px', display: 'flex', alignItems: 'center', gap: '8px' }}>
                  <CheckCircleIcon size={18} color="#10B981" />
                  <span>{settingsNotice}</span>
                </div>
              )}

              {/* Security: Change Password */}
              <div className="settings-card">
                <h3 className="settings-title" style={{ display: 'flex', alignItems: 'center', gap: '8px' }}>
                  <LockIcon size={20} color="var(--yellow-dark)" />
                  <span>Admin Credentials</span>
                </h3>
                <p style={{ fontSize: '0.85rem', color: 'var(--text-secondary)', marginBottom: '18px' }}>
                  Current Username: <strong>{adminUsername}</strong>
                </p>

                <form onSubmit={handleUpdateCredentials}>
                  <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fit, minmax(280px, 1fr))', gap: '20px', marginBottom: '20px' }}>
                    <div>
                      <label style={{ display: 'block', fontSize: '0.78rem', fontWeight: 700, marginBottom: '6px', color: 'var(--text-primary)' }}>NEW USERNAME</label>
                      <input 
                        type="text" 
                        className="admin-search-input" 
                        placeholder={`Leave blank to keep "${adminUsername}"`}
                        value={newUserInput}
                        onChange={(e) => setNewUserInput(e.target.value)}
                      />
                    </div>

                    <div>
                      <label style={{ display: 'block', fontSize: '0.78rem', fontWeight: 700, marginBottom: '6px', color: 'var(--text-primary)' }}>NEW PASSWORD</label>
                      <input 
                        type="password" 
                        className="admin-search-input" 
                        placeholder="Enter new admin password"
                        value={newPassInput}
                        onChange={(e) => setNewPassInput(e.target.value)}
                      />
                    </div>
                  </div>

                  <button type="submit" className="btn-automotive-cta" style={{ fontSize: '0.84rem', padding: '11px 24px' }}>
                    <span>UPDATE CREDENTIALS →</span>
                  </button>
                </form>
              </div>

              {/* Website Info & Regional Studio Settings */}
              <div className="settings-card">
                <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: '16px', flexWrap: 'wrap', gap: '8px' }}>
                  <h3 className="settings-title" style={{ margin: 0, display: 'flex', alignItems: 'center', gap: '8px' }}>
                    <GlobeIcon size={20} color="var(--yellow-dark)" />
                    <span>Website Information & Contact Settings</span>
                  </h3>
                  <span style={{ fontSize: '0.75rem', color: 'var(--yellow-dark)', fontWeight: 700 }}>
                    ● Real-Time Sync with Website & MongoDB
                  </span>
                </div>
                <p style={{ fontSize: '0.84rem', color: 'var(--text-secondary)', marginBottom: '20px' }}>
                  Edit website name, hotline number, studio address, email, and operating hours below. All changes saved here automatically reflect across the public website and persist to the database!
                </p>

                <form onSubmit={handleSaveSettings}>
                  <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fit, minmax(260px, 1fr))', gap: '16px', marginBottom: '16px' }}>
                    <div>
                      <label style={{ display: 'block', fontSize: '0.76rem', fontWeight: 700, marginBottom: '6px', color: 'var(--text-primary)' }}>
                        WEBSITE / BRAND NAME *
                      </label>
                      <input 
                        type="text" 
                        className="admin-search-input" 
                        value={siteSettings.siteName}
                        onChange={(e) => setSiteSettings({ ...siteSettings, siteName: e.target.value })}
                        required
                        placeholder="e.g. Car Care Luxury Detailing"
                      />
                    </div>

                    <div>
                      <label style={{ display: 'block', fontSize: '0.76rem', fontWeight: 700, marginBottom: '6px', color: 'var(--text-primary)' }}>
                        MOBILE NUMBER / HOTLINE *
                      </label>
                      <input 
                        type="text" 
                        className="admin-search-input" 
                        value={siteSettings.phone}
                        onChange={(e) => setSiteSettings({ ...siteSettings, phone: e.target.value })}
                        required
                        placeholder="e.g. +91 98765 43210"
                      />
                    </div>

                    <div>
                      <label style={{ display: 'block', fontSize: '0.76rem', fontWeight: 700, marginBottom: '6px', color: 'var(--text-primary)' }}>
                        OFFICIAL / BOOKINGS EMAIL *
                      </label>
                      <input 
                        type="email" 
                        className="admin-search-input" 
                        value={siteSettings.email}
                        onChange={(e) => setSiteSettings({ ...siteSettings, email: e.target.value })}
                        required
                        placeholder="e.g. bookings@carcare.com"
                      />
                    </div>

                    <div>
                      <label style={{ display: 'block', fontSize: '0.76rem', fontWeight: 700, marginBottom: '6px', color: 'var(--text-primary)' }}>
                        OPERATING HOURS *
                      </label>
                      <input 
                        type="text" 
                        className="admin-search-input" 
                        value={siteSettings.operatingHours}
                        onChange={(e) => setSiteSettings({ ...siteSettings, operatingHours: e.target.value })}
                        required
                        placeholder="e.g. Monday – Saturday: 8:30 AM – 8:00 PM"
                      />
                    </div>
                  </div>

                  <div style={{ marginBottom: '20px' }}>
                    <label style={{ display: 'block', fontSize: '0.76rem', fontWeight: 700, marginBottom: '6px', color: 'var(--text-primary)' }}>
                      STUDIO / HEADQUARTERS PHYSICAL ADDRESS *
                    </label>
                    <textarea 
                      className="admin-search-input" 
                      style={{ minHeight: '80px', resize: 'vertical' }}
                      value={siteSettings.address}
                      onChange={(e) => setSiteSettings({ ...siteSettings, address: e.target.value })}
                      required
                      placeholder="e.g. Grand Southern Trunk Rd, Auto Bay Complex, Guindy, Chennai, Tamil Nadu 600032"
                    />
                  </div>

                  <button 
                    type="submit" 
                    className="btn-automotive-cta" 
                    style={{ fontSize: '0.86rem', padding: '10px 22px' }}
                    disabled={isSavingSettings}
                  >
                    <span>{isSavingSettings ? 'SAVING CHANGES...' : 'SAVE WEBSITE SETTINGS →'}</span>
                  </button>
                </form>
              </div>
            </div>
          )}
        </main>
      </div>

      {/* New Appointment Modal */}
      {isAddModalOpen && (
        <div className="admin-modal-backdrop" onClick={() => setIsAddModalOpen(false)}>
          <div className="admin-modal-card" onClick={(e) => e.stopPropagation()}>
            <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: '20px' }}>
              <h3 style={{ margin: 0, fontSize: '1.2rem', fontWeight: 900, textTransform: 'uppercase', color: 'var(--text-primary)' }}>
                New Studio Appointment
              </h3>
              <button 
                type="button" 
                style={{ background: 'none', border: 'none', fontSize: '1.2rem', cursor: 'pointer', color: 'var(--text-primary)' }}
                onClick={() => setIsAddModalOpen(false)}
              >
                ✕
              </button>
            </div>

            <form onSubmit={handleCreateBooking}>
              <div style={{ marginBottom: '12px' }}>
                <label style={{ display: 'block', fontSize: '0.74rem', fontWeight: 700, color: 'var(--text-primary)', marginBottom: '4px' }}>CUSTOMER NAME *</label>
                <input 
                  type="text" 
                  className="admin-search-input" 
                  required 
                  value={newBooking.customerName}
                  onChange={(e) => setNewBooking({ ...newBooking, customerName: e.target.value })}
                  placeholder="e.g. Vikramaditya Roy"
                />
              </div>

              <div style={{ marginBottom: '12px' }}>
                <label style={{ display: 'block', fontSize: '0.74rem', fontWeight: 700, color: 'var(--text-primary)', marginBottom: '4px' }}>PHONE NUMBER *</label>
                <input 
                  type="tel" 
                  className="admin-search-input" 
                  required 
                  value={newBooking.phone}
                  onChange={(e) => setNewBooking({ ...newBooking, phone: e.target.value })}
                  placeholder="+91 98401 23456"
                />
              </div>

              <div style={{ marginBottom: '12px' }}>
                <label style={{ display: 'block', fontSize: '0.74rem', fontWeight: 700, color: 'var(--text-primary)', marginBottom: '4px' }}>VEHICLE MODEL *</label>
                <input 
                  type="text" 
                  className="admin-search-input" 
                  required 
                  value={newBooking.carModel}
                  onChange={(e) => setNewBooking({ ...newBooking, carModel: e.target.value })}
                  placeholder="e.g. Porsche 911 GT3 RS"
                />
              </div>

              <div style={{ marginBottom: '12px' }}>
                <label style={{ display: 'block', fontSize: '0.74rem', fontWeight: 700, color: 'var(--text-primary)', marginBottom: '4px' }}>VEHICLE NUMBER</label>
                <input 
                  type="text" 
                  className="admin-search-input" 
                  value={newBooking.vehicleNumber}
                  onChange={(e) => setNewBooking({ ...newBooking, vehicleNumber: e.target.value.toUpperCase() })}
                  placeholder="e.g. TN 07 CS 9999"
                />
              </div>

              <div style={{ marginBottom: '12px' }}>
                <label style={{ display: 'block', fontSize: '0.74rem', fontWeight: 700, color: 'var(--text-primary)', marginBottom: '4px' }}>SERVICE</label>
                <select 
                  style={{ width: '100%', padding: '10px', borderRadius: '6px', border: '1px solid var(--border-subtle)', background: 'var(--input-bg)', color: 'var(--input-text)' }}
                  value={newBooking.service}
                  onChange={(e) => setNewBooking({ ...newBooking, service: e.target.value })}
                >
                  <option value="Ceramic & Graphene Coating">Ceramic & Graphene Coating</option>
                  <option value="Full Body Armor PPF">Full Body Armor PPF</option>
                  <option value="Stage 2/3 Paint Correction">Stage 2/3 Paint Correction</option>
                  <option value="Interior Sanctuary Spa">Interior Sanctuary Spa</option>
                  <option value="Engine Bay Detailing">Engine Bay Detailing</option>
                  <option value="Wheel & Caliper Coating">Wheel & Caliper Coating</option>
                </select>
              </div>

              <div style={{ marginBottom: '12px' }}>
                <label style={{ display: 'block', fontSize: '0.74rem', fontWeight: 700, color: 'var(--text-primary)', marginBottom: '4px' }}>SCHEDULED DATE</label>
                <input 
                  type="date" 
                  className="admin-search-input" 
                  required 
                  value={newBooking.date}
                  onChange={(e) => setNewBooking({ ...newBooking, date: e.target.value })}
                />
              </div>

              <div style={{ marginBottom: '16px' }}>
                <label style={{ display: 'block', fontSize: '0.74rem', fontWeight: 700, color: 'var(--text-primary)', marginBottom: '4px' }}>SPECIAL NOTES</label>
                <textarea 
                  rows={3}
                  style={{ width: '100%', padding: '10px', borderRadius: '6px', border: '1px solid var(--border-subtle)', background: 'var(--input-bg)', color: 'var(--input-text)', boxSizing: 'border-box' }}
                  value={newBooking.notes}
                  onChange={(e) => setNewBooking({ ...newBooking, notes: e.target.value })}
                  placeholder="Special instructions or flatbed pickup request..."
                ></textarea>
              </div>

              <div style={{ display: 'flex', gap: '10px' }}>
                <button type="submit" className="btn-automotive-cta" style={{ flex: 1, justifyContent: 'center' }}>
                  <span>SAVE APPOINTMENT →</span>
                </button>
                <button type="button" className="btn-ghost" onClick={() => setIsAddModalOpen(false)}>
                  Cancel
                </button>
              </div>
            </form>
          </div>
        </div>
      )}

      {/* Add Client Modal */}
      {isAddCustomerOpen && (
        <div className="admin-modal-backdrop" onClick={() => setIsAddCustomerOpen(false)}>
          <div className="admin-modal-card" onClick={(e) => e.stopPropagation()}>
            <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: '20px' }}>
              <h3 style={{ margin: 0, fontSize: '1.2rem', fontWeight: 900, textTransform: 'uppercase', color: 'var(--text-primary)' }}>
                Add New Client Record
              </h3>
              <button 
                type="button" 
                style={{ background: 'none', border: 'none', fontSize: '1.2rem', cursor: 'pointer', color: 'var(--text-primary)' }}
                onClick={() => setIsAddCustomerOpen(false)}
              >
                ✕
              </button>
            </div>

            <form onSubmit={handleCreateCustomer}>
              <div style={{ marginBottom: '12px' }}>
                <label style={{ display: 'block', fontSize: '0.74rem', fontWeight: 700, color: 'var(--text-primary)', marginBottom: '4px' }}>CLIENT NAME *</label>
                <input 
                  type="text" 
                  className="admin-search-input" 
                  required 
                  value={newCustForm.name}
                  onChange={(e) => setNewCustForm({ ...newCustForm, name: e.target.value })}
                  placeholder="e.g. Senthil Ramanathan"
                />
              </div>

              <div style={{ marginBottom: '12px' }}>
                <label style={{ display: 'block', fontSize: '0.74rem', fontWeight: 700, color: 'var(--text-primary)', marginBottom: '4px' }}>PHONE NUMBER *</label>
                <input 
                  type="tel" 
                  className="admin-search-input" 
                  required 
                  value={newCustForm.phone}
                  onChange={(e) => setNewCustForm({ ...newCustForm, phone: e.target.value })}
                  placeholder="+91 98400 12345"
                />
              </div>

              <div style={{ marginBottom: '12px' }}>
                <label style={{ display: 'block', fontSize: '0.74rem', fontWeight: 700, color: 'var(--text-primary)', marginBottom: '4px' }}>EMAIL</label>
                <input 
                  type="email" 
                  className="admin-search-input" 
                  value={newCustForm.email}
                  onChange={(e) => setNewCustForm({ ...newCustForm, email: e.target.value })}
                  placeholder="senthil@motors.com"
                />
              </div>

              <div style={{ marginBottom: '12px' }}>
                <label style={{ display: 'block', fontSize: '0.74rem', fontWeight: 700, color: 'var(--text-primary)', marginBottom: '4px' }}>VEHICLES (COMMA SEPARATED)</label>
                <input 
                  type="text" 
                  className="admin-search-input" 
                  value={newCustForm.carModels}
                  onChange={(e) => setNewCustForm({ ...newCustForm, carModels: e.target.value })}
                  placeholder="e.g. Porsche 911, Audi RS7"
                />
              </div>

              <div style={{ marginBottom: '16px' }}>
                <label style={{ display: 'block', fontSize: '0.74rem', fontWeight: 700, color: 'var(--text-primary)', marginBottom: '4px' }}>VEHICLE REGISTRATION NUMBER</label>
                <input 
                  type="text" 
                  className="admin-search-input" 
                  value={newCustForm.vehicleNumber}
                  onChange={(e) => setNewCustForm({ ...newCustForm, vehicleNumber: e.target.value.toUpperCase() })}
                  placeholder="e.g. TN 09 BK 0007"
                />
              </div>

              <div style={{ display: 'flex', gap: '10px' }}>
                <button type="submit" className="btn-automotive-cta" style={{ flex: 1, justifyContent: 'center' }}>
                  <span>SAVE CLIENT RECORD →</span>
                </button>
                <button type="button" className="btn-ghost" onClick={() => setIsAddCustomerOpen(false)}>
                  Cancel
                </button>
              </div>
            </form>
          </div>
        </div>
      )}

      {/* View & Edit Appointment Notes Modal */}
      {selectedBooking && (
        <div className="admin-modal-backdrop" onClick={() => setSelectedBooking(null)}>
          <div className="admin-modal-card" onClick={(e) => e.stopPropagation()}>
            <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: '16px' }}>
              <h3 style={{ margin: 0, fontSize: '1.2rem', fontWeight: 900, color: 'var(--text-primary)' }}>
                Appointment: {selectedBooking.id}
              </h3>
              <button 
                type="button" 
                style={{ background: 'none', border: 'none', fontSize: '1.2rem', cursor: 'pointer', color: 'var(--text-primary)' }}
                onClick={() => setSelectedBooking(null)}
              >
                ✕
              </button>
            </div>

            <div style={{ marginBottom: '16px', padding: '14px', background: 'var(--bg-subtle)', borderRadius: '8px', fontSize: '0.84rem' }}>
              <div><strong>Client:</strong> {selectedBooking.customerName} ({selectedBooking.phone})</div>
              <div><strong>Vehicle:</strong> {selectedBooking.carModel} {selectedBooking.vehicleNumber ? `[${selectedBooking.vehicleNumber}]` : ''}</div>
              <div><strong>Service:</strong> {selectedBooking.service}</div>
              <div><strong>Date:</strong> {selectedBooking.date}</div>
              <div><strong>Studio:</strong> {selectedBooking.studio || 'Chennai Studio'}</div>
            </div>

            <div style={{ marginBottom: '14px' }}>
              <label style={{ display: 'block', fontSize: '0.74rem', fontWeight: 700, marginBottom: '6px', color: 'var(--text-primary)' }}>STATUS</label>
              <select 
                style={{ width: '100%', padding: '10px', borderRadius: '6px', border: '1px solid var(--border-subtle)', background: 'var(--input-bg)', color: 'var(--input-text)' }}
                value={selectedBooking.status}
                onChange={(e) => {
                  const s = e.target.value as BookingStatus;
                  handleStatusChange(selectedBooking.id, s);
                  setSelectedBooking({ ...selectedBooking, status: s });
                }}
              >
                <option value="Pending">🟡 Pending</option>
                <option value="Confirmed">🔵 Confirmed</option>
                <option value="In Bay">🟣 In Bay</option>
                <option value="Completed">🟢 Completed</option>
                <option value="Cancelled">🔴 Cancelled</option>
              </select>
            </div>

            <div style={{ marginBottom: '16px' }}>
              <label style={{ display: 'block', fontSize: '0.74rem', fontWeight: 700, marginBottom: '6px', color: 'var(--text-primary)' }}>
                TECHNICIAN INSPECTION NOTES & WARRANTY LOGS
              </label>
              <textarea 
                rows={4}
                style={{ width: '100%', padding: '10px', borderRadius: '6px', border: '1px solid var(--border-subtle)', background: 'var(--input-bg)', color: 'var(--input-text)', boxSizing: 'border-box' }}
                defaultValue={selectedBooking.notes || ''}
                onBlur={(e) => handleSaveNotes(selectedBooking.id, e.target.value)}
                placeholder="Log paint depth micrometer readings, curing temperature, warranty log..."
              ></textarea>
              <span style={{ fontSize: '0.72rem', color: 'var(--text-muted)' }}>Changes save automatically on click out.</span>
            </div>

            <div style={{ display: 'flex', justifyContent: 'flex-end' }}>
              <button type="button" className="btn-automotive-cta" onClick={() => setSelectedBooking(null)}>
                <span>DONE</span>
              </button>
            </div>
          </div>
        </div>
      )}

      {/* Add / Edit Detailing Service Modal */}
      {isServiceModalOpen && (
        <div className="admin-modal-backdrop" onClick={() => setIsServiceModalOpen(false)}>
          <div className="admin-modal-card" style={{ maxWidth: '650px', maxHeight: '90vh', overflowY: 'auto' }} onClick={(e) => e.stopPropagation()}>
            <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: '20px' }}>
              <h3 style={{ margin: 0, fontSize: '1.2rem', fontWeight: 900, textTransform: 'uppercase', color: 'var(--text-primary)' }}>
                {editingService ? 'Edit Detailing Service' : 'Add New Detailing Service'}
              </h3>
              <button 
                type="button" 
                style={{ background: 'none', border: 'none', fontSize: '1.2rem', cursor: 'pointer', color: 'var(--text-primary)' }}
                onClick={() => setIsServiceModalOpen(false)}
              >
                ✕
              </button>
            </div>

            <form onSubmit={handleSaveService}>
              <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: '12px', marginBottom: '12px' }}>
                <div>
                  <label style={{ display: 'block', fontSize: '0.74rem', fontWeight: 700, color: 'var(--text-primary)', marginBottom: '4px' }}>SERVICE TITLE *</label>
                  <input 
                    type="text" 
                    className="admin-search-input" 
                    required 
                    value={serviceFormData.name}
                    onChange={(e) => setServiceFormData({ ...serviceFormData, name: e.target.value })}
                    placeholder="e.g. Ceramic & Graphene Coating"
                  />
                </div>
                <div>
                  <label style={{ display: 'block', fontSize: '0.74rem', fontWeight: 700, color: 'var(--text-primary)', marginBottom: '4px' }}>SHORT NAV / TAB NAME</label>
                  <input 
                    type="text" 
                    className="admin-search-input" 
                    value={serviceFormData.shortName}
                    onChange={(e) => setServiceFormData({ ...serviceFormData, shortName: e.target.value })}
                    placeholder="e.g. Ceramic"
                  />
                </div>
              </div>

              <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: '12px', marginBottom: '12px' }}>
                <div>
                  <label style={{ display: 'block', fontSize: '0.74rem', fontWeight: 700, color: 'var(--text-primary)', marginBottom: '4px' }}>BADGE / TAG</label>
                  <input 
                    type="text" 
                    className="admin-search-input" 
                    value={serviceFormData.tag}
                    onChange={(e) => setServiceFormData({ ...serviceFormData, tag: e.target.value.toUpperCase() })}
                    placeholder="e.g. HOT, RESTORE, ULTIMATE"
                  />
                </div>
                <div>
                  <label style={{ display: 'block', fontSize: '0.74rem', fontWeight: 700, color: 'var(--text-primary)', marginBottom: '4px' }}>THUMBNAIL IMAGE URL</label>
                  <input 
                    type="text" 
                    className="admin-search-input" 
                    value={serviceFormData.thumbnail}
                    onChange={(e) => setServiceFormData({ ...serviceFormData, thumbnail: e.target.value })}
                    placeholder="/assets/detail_after.jpg"
                  />
                </div>
              </div>

              <div style={{ marginBottom: '12px' }}>
                <label style={{ display: 'block', fontSize: '0.74rem', fontWeight: 700, color: 'var(--text-primary)', marginBottom: '4px' }}>SHOWCASE HEADER</label>
                <input 
                  type="text" 
                  className="admin-search-input" 
                  value={serviceFormData.showcaseTitle}
                  onChange={(e) => setServiceFormData({ ...serviceFormData, showcaseTitle: e.target.value })}
                  placeholder="e.g. CERAMIC COATING & PAINT ARMOR"
                />
              </div>

              <div style={{ marginBottom: '12px' }}>
                <label style={{ display: 'block', fontSize: '0.74rem', fontWeight: 700, color: 'var(--text-primary)', marginBottom: '4px' }}>BRIEF SUMMARY / DESCRIPTION</label>
                <textarea 
                  rows={2}
                  className="admin-search-input"
                  value={serviceFormData.shortDesc}
                  onChange={(e) => setServiceFormData({ ...serviceFormData, shortDesc: e.target.value })}
                  placeholder="e.g. Multi-layer high-solids hydrophobic coating delivering deep optical gloss."
                />
              </div>

              <div style={{ marginBottom: '14px' }}>
                <label style={{ display: 'block', fontSize: '0.74rem', fontWeight: 700, color: 'var(--text-primary)', marginBottom: '6px' }}>SERVICE KEY FEATURES (4 BULLET POINTS)</label>
                {[0, 1, 2, 3].map((idx) => (
                  <div key={idx} style={{ display: 'grid', gridTemplateColumns: '1fr 2fr', gap: '8px', marginBottom: '8px' }}>
                    <input 
                      type="text" 
                      className="admin-search-input" 
                      placeholder={`Feature ${idx + 1} Title`}
                      value={serviceFormData.features?.[idx]?.title || ''}
                      onChange={(e) => {
                        const newF = [...(serviceFormData.features || [])];
                        newF[idx] = { ...(newF[idx] || { desc: '' }), title: e.target.value };
                        setServiceFormData({ ...serviceFormData, features: newF });
                      }}
                    />
                    <input 
                      type="text" 
                      className="admin-search-input" 
                      placeholder={`Feature ${idx + 1} Details`}
                      value={serviceFormData.features?.[idx]?.desc || ''}
                      onChange={(e) => {
                        const newF = [...(serviceFormData.features || [])];
                        newF[idx] = { ...(newF[idx] || { title: '' }), desc: e.target.value };
                        setServiceFormData({ ...serviceFormData, features: newF });
                      }}
                    />
                  </div>
                ))}
              </div>

              <div style={{ marginBottom: '16px' }}>
                <label style={{ display: 'block', fontSize: '0.74rem', fontWeight: 700, color: 'var(--text-primary)', marginBottom: '4px' }}>PACKAGE INCLUSION / ADDON NOTE</label>
                <input 
                  type="text" 
                  className="admin-search-input" 
                  value={serviceFormData.addon}
                  onChange={(e) => setServiceFormData({ ...serviceFormData, addon: e.target.value })}
                  placeholder="e.g. Includes Full Multi-Stage Decontamination & Alcohol Prep"
                />
              </div>

              <div style={{ display: 'flex', gap: '10px' }}>
                <button type="submit" className="btn-automotive-cta" style={{ flex: 1, justifyContent: 'center' }}>
                  <span>{editingService ? 'UPDATE SERVICE →' : 'PUBLISH TO WEBSITE →'}</span>
                </button>
                <button type="button" className="btn-ghost" onClick={() => setIsServiceModalOpen(false)}>
                  Cancel
                </button>
              </div>
            </form>
          </div>
        </div>
      )}
    </>
  );
};
