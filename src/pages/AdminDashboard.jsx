import React, { useState, useEffect } from 'react';
import { Link } from 'react-router-dom';
import Button from '../components/Button';
import Spinner from '../components/Spinner';
import { useToast } from '../context/ToastContext';
import {
  loginAdmin,
  verifyAdmin,
  getPackages,
  createPackage,
  updatePackage,
  deletePackage,
  getInquiries,
  updateInquiryStatus,
  deleteInquiry,
  getDestinations,
  createDestination,
  deleteDestination,
  getReviews,
  getActivityLogs
} from '../services/api';

const PRESET_COVER_IMAGES = [
  { label: 'Living Root Bridge', url: 'https://images.unsplash.com/photo-1582510003544-4d00b7f74220?w=800&q=80' },
  { label: 'Kaziranga Safari', url: 'https://images.unsplash.com/photo-1566073771259-6a8506099945?w=800&q=80' },
  { label: 'Tawang Monastery', url: 'https://images.unsplash.com/photo-1544735716-392fe2489ffa?w=800&q=80' },
  { label: 'Sikkim Lakes', url: 'https://images.unsplash.com/photo-1506905925346-21bda4d32df4?w=800&q=80' },
  { label: 'Brahmaputra Sunset', url: 'https://images.unsplash.com/photo-1516426122078-c23e76319801?w=800&q=80' }
];

const HIGHLIGHT_PRESETS = [
  'Cherrapunji & Nohkalikai Waterfalls',
  'Double-Decker Living Root Bridge Trek',
  'Crystal-Clear Dawki River Boating',
  'Kaziranga Rhino Wildlife Safari',
  'Tawang Monastery & Sela Pass',
  'Gangtok & High Altitude Lakes',
  'Mawlynnong Clean Village Tour'
];

const INCLUSION_PRESETS = [
  '3★ / 4★ Hotel Accommodation',
  'Daily Breakfast at Hotels',
  'Private AC Vehicle & Driver Charges',
  'Inner Line Permit (ILP) Processing',
  'Experienced Local Tour Escort',
  'Entry Tickets & Boat Charges'
];

const EXCLUSION_PRESETS = [
  'Airfare / Train Tickets',
  'Lunch & Dinner Expenses',
  'Personal Expenses & Laundry',
  'Tips for Drivers & Guides',
  'Travel Insurance'
];

const defaultEnquiriesList = [
  { _id: 'enq-1', name: 'Riya Sharma', contact: '+91 98765 43210 · riya@example.com', interest: 'Meghalaya Highlights', pax: 2, assigned: 'Tapan', status: 'New', date: 'Today', email: 'riya@example.com', phone: '+91 98765 43210', location: 'New Delhi' },
  { _id: 'enq-2', name: 'Amit Das', contact: '+91 97654 32109 · amit@example.com', interest: 'Kaziranga Safari', pax: 4, assigned: 'Tapan', status: 'In progress', date: 'Yesterday', email: 'amit@example.com', phone: '+91 97654 32109', location: 'Kolkata' },
  { _id: 'enq-3', name: 'Priya Nair', contact: '+91 96543 21098 · priya@example.com', interest: 'Tawang Circuit', pax: 2, assigned: 'Chandra', status: 'Quoted', date: '2 Aug', email: 'priya@example.com', phone: '+91 96543 21098', location: 'Bengaluru' },
  { _id: 'enq-4', name: 'Rahul Mehta', contact: '+91 95432 10987 · rahul@example.com', interest: 'Custom Assam & Meghalaya', pax: 6, assigned: '—', status: 'New', date: '2 Aug', email: 'rahul@example.com', phone: '+91 95432 10987', location: 'Mumbai' },
  { _id: 'enq-5', name: 'Neha Gupta', contact: '+91 94321 09876 · neha@example.com', interest: 'Meghalaya Luxury', pax: 2, assigned: 'Tapan', status: 'Confirmed', date: '28 Jul', email: 'neha@example.com', phone: '+91 94321 09876', location: 'Chandigarh' }
];

const defaultPackagesList = [
  {
    _id: 'meghalaya-1',
    title: 'Meghalaya Highlights',
    destination: 'Meghalaya',
    duration: '5D / 4N',
    standard: '₹18,900',
    deluxe: '₹24,900',
    luxury: '₹34,900',
    status: 'Published',
    price: 18900,
    image: 'https://images.unsplash.com/photo-1582510003544-4d00b7f74220?w=600&q=80',
    description: 'Explore Cherrapunji, Dawki river, and Living Root Bridges.',
    highlights: ['Double-decker living root bridge trek', 'Nohkalikai & Seven Sisters waterfalls', 'Crystal-clear Dawki river', 'Shillong city & Ward’s Lake'],
    included: ['3★ / 4★ Hotel Accommodation', 'Daily breakfast', 'Private AC vehicle', 'Driver allowances & entry tickets'],
    excluded: ['Airfare / train tickets', 'Lunch & dinner', 'Personal expenses'],
    itinerary: [
      { day: 1, title: 'Guwahati → Shillong', desc: 'Pick up & scenic drive to Shillong. Check in and visit Ward’s Lake.' },
      { day: 2, title: 'Shillong → Cherrapunji', desc: 'Visit Nohkalikai Falls, Seven Sisters Falls & Mawsmai Cave.' },
      { day: 3, title: 'Living Root Bridge Trek', desc: 'Trek to Nongriat double-decker living root bridge.' },
      { day: 4, title: 'Dawki Boating & Mawlynnong', desc: 'Crystal clear Umngot river boating and cleanest village tour.' },
      { day: 5, title: 'Shillong → Guwahati Departure', desc: 'Return drive to Guwahati airport/railway station.' }
    ]
  },
  {
    _id: 'assam-1',
    title: 'Kaziranga Safari',
    destination: 'Assam',
    duration: '3D / 2N',
    standard: '₹12,500',
    deluxe: '₹16,900',
    luxury: '₹22,500',
    status: 'Published',
    price: 12500,
    image: 'https://images.unsplash.com/photo-1566073771259-6a8506099945?w=600&q=80',
    description: 'Wild Rhino safari and Majuli river island cultural tour.',
    highlights: ['Jeep & Elephant Safaris in Kaziranga NP', 'One-horned Rhinoceros Sighting', 'Orchid Park visit'],
    included: ['3★ Eco Resort Stay', 'Jeep Safari Pass', 'Daily Breakfast', 'Private transfers'],
    excluded: ['Camera fees', 'Personal expenses'],
    itinerary: [
      { day: 1, title: 'Guwahati → Kaziranga', desc: 'Pick up and transfer to Kaziranga jungle resort.' },
      { day: 2, title: 'Kaziranga Safaris', desc: 'Early morning safari & afternoon Jeep safari.' },
      { day: 3, title: 'Kaziranga → Guwahati Departure', desc: 'Return drive to Guwahati.' }
    ]
  },
  {
    _id: 'arunachal-1',
    title: 'Tawang Circuit',
    destination: 'Arunachal Pradesh',
    duration: '7D / 6N',
    standard: '₹34,900',
    deluxe: '₹42,900',
    luxury: '₹55,900',
    status: 'Published',
    price: 34900,
    image: 'https://images.unsplash.com/photo-1544735716-392fe2489ffa?w=600&q=80',
    description: 'Sela Pass, Tawang Monastery, and Bum La Pass border.',
    highlights: ['Sela Pass at 13,700 ft', 'Tawang Monastery', 'Sangetsar (Madhuri) Lake'],
    included: ['Boutique mountain stays', 'Inner Line Permit (ILP)', '4x4 SUV Transfer'],
    excluded: ['Bum La Pass surcharge', 'Airfare/Train tickets'],
    itinerary: [
      { day: 1, title: 'Guwahati → Dirang', desc: 'Drive to Eastern Himalayas.' },
      { day: 2, title: 'Dirang → Sela Pass → Tawang', desc: 'Drive across Sela Pass to Tawang.' },
      { day: 3, title: 'Tawang Monastery Tour', desc: 'Explore Tawang Monastery and War Memorial.' }
    ]
  },
  {
    _id: 'sikkim-1',
    title: 'Sikkim Essentials',
    destination: 'Sikkim',
    duration: '6D / 5N',
    standard: '₹28,500',
    deluxe: '₹35,000',
    luxury: '₹48,000',
    status: 'Published',
    price: 28500,
    image: 'https://images.unsplash.com/photo-1506905925346-21bda4d32df4?w=600&q=80',
    description: 'Gangtok, Nathula Pass and majestic Tsomgo Lake.',
    highlights: ['Glacial Tsomgo Lake', 'Rumtek Monastery', 'Kanchenjunga views'],
    included: ['3★ Hotel Stays', 'Tsomgo Lake Permits', 'Daily Breakfast'],
    excluded: ['Nathula Pass fee', 'Airfare/Train tickets'],
    itinerary: [
      { day: 1, title: 'Bagdogra → Gangtok', desc: 'Transfer to Gangtok and MG Marg walk.' },
      { day: 2, title: 'Tsomgo Lake Excursion', desc: 'Visit high altitude Tsomgo Lake.' }
    ]
  }
];

const defaultDestinationsList = [
  { _id: 'dest-1', name: 'Meghalaya', bestTimeToVisit: 'Oct – May', packagesCount: '1 package', status: 'Live' },
  { _id: 'dest-2', name: 'Assam', bestTimeToVisit: 'Nov – Apr', packagesCount: '1 package', status: 'Live' },
  { _id: 'dest-3', name: 'Arunachal Pradesh', bestTimeToVisit: 'Mar–Jun, Sep–Nov', packagesCount: '1 package', status: 'Live' },
  { _id: 'dest-4', name: 'Sikkim', bestTimeToVisit: 'Mar–Jun, Sep–Nov', packagesCount: '1 package', status: 'Live' }
];

const mockMediaList = [
  { id: 'm-1', title: 'Dawki River Meghalaya', url: 'https://images.unsplash.com/photo-1582510003544-4d00b7f74220?w=600&q=80', size: '1.2 MB' },
  { id: 'm-2', title: 'Kaziranga National Park', url: 'https://images.unsplash.com/photo-1566073771259-6a8506099945?w=600&q=80', size: '850 KB' },
  { id: 'm-3', title: 'Tawang Monastery Valley', url: 'https://images.unsplash.com/photo-1544735716-392fe2489ffa?w=600&q=80', size: '2.1 MB' },
  { id: 'm-4', title: 'Nathula Pass Sikkim', url: 'https://images.unsplash.com/photo-1506905925346-21bda4d32df4?w=600&q=80', size: '1.4 MB' }
];

const AdminDashboard = () => {
  const { showToast } = useToast();
  const [isAdmin, setIsAdmin] = useState(false);
  const [loading, setLoading] = useState(true);
  const [activeTab, setActiveTab] = useState('dashboard');
  const [mobileNavOpen, setMobileNavOpen] = useState(false);

  // Login Form State
  const [username, setUsername] = useState('');
  const [password, setPassword] = useState('');
  const [showPassword, setShowPassword] = useState(false);
  const [loginLoading, setLoginLoading] = useState(false);

  // Data States
  const [packages, setPackages] = useState([]);
  const [inquiries, setInquiries] = useState([]);
  const [destinations, setDestinations] = useState([]);
  const [reviews, setReviews] = useState([]);
  const [activityLogs, setActivityLogs] = useState([]);

  // Filters
  const [searchTerm, setSearchTerm] = useState('');
  const [statusFilter, setStatusFilter] = useState('');
  const [pkgFilter, setPkgFilter] = useState('');

  // Settings state
  const [settingsPhone, setSettingsPhone] = useState('+91 98765 43210');
  const [settingsEmail, setSettingsEmail] = useState('hello@travmitraa.com');
  const [settingsWhatsapp, setSettingsWhatsapp] = useState('919876543210');
  const [settingsWorkingHours, setSettingsWorkingHours] = useState('Mon - Sat: 9:00 AM - 7:00 PM');

  // Modal / Form States
  const [selectedVoucher, setSelectedVoucher] = useState(null);
  const [packageModalOpen, setPackageModalOpen] = useState(false);
  const [editingPackageId, setEditingPackageId] = useState(null);
  const [modalTab, setModalTab] = useState('basic'); // 'basic' | 'tiers' | 'highlights' | 'itinerary'

  // Detailed Package Form Fields
  const [pkgTitle, setPkgTitle] = useState('');
  const [pkgDescription, setPkgDescription] = useState('');
  const [pkgPrice, setPkgPrice] = useState('');
  const [pkgPriceDeluxe, setPkgPriceDeluxe] = useState('');
  const [pkgPriceLuxury, setPkgPriceLuxury] = useState('');
  const [pkgDuration, setPkgDuration] = useState('');
  const [pkgDestination, setPkgDestination] = useState('');
  const [pkgCategory, setPkgCategory] = useState('Standard');
  const [pkgImage, setPkgImage] = useState('');
  const [pkgHighlights, setPkgHighlights] = useState('');
  const [pkgInclusions, setPkgInclusions] = useState('');
  const [pkgExclusions, setPkgExclusions] = useState('');
  const [pkgItinerary, setPkgItinerary] = useState([
    { day: 1, title: '', desc: '' }
  ]);

  // Destination Form Fields
  const [destName, setDestName] = useState('');
  const [destImage, setDestImage] = useState('');
  const [destDesc, setDestDesc] = useState('');
  const [destBestTime, setDestBestTime] = useState('');

  useEffect(() => {
    document.title = 'Admin Control Console – Travmitraa';
    checkAuth();
  }, []);

  useEffect(() => {
    if (isAdmin) {
      loadData();
    }
  }, [isAdmin, activeTab]);

  const checkAuth = async () => {
    const token = localStorage.getItem('token');
    if (!token) {
      setIsAdmin(false);
      setLoading(false);
      return;
    }

    try {
      await verifyAdmin();
      setIsAdmin(true);
    } catch (err) {
      console.error(err);
      localStorage.removeItem('token');
      setIsAdmin(false);
    } finally {
      setLoading(false);
    }
  };

  const loadData = async () => {
    try {
      const [pkgs, inqs, dests] = await Promise.all([
        getPackages().catch(() => []),
        getInquiries().catch(() => []),
        getDestinations().catch(() => [])
      ]);
      setPackages(Array.isArray(pkgs) ? pkgs : []);
      setInquiries(Array.isArray(inqs) ? inqs : []);
      setDestinations(Array.isArray(dests) ? dests : []);
      const revs = await getReviews().catch(() => []);
      setReviews(revs);
      const logs = await getActivityLogs().catch(() => []);
      setActivityLogs(logs);
    } catch (err) {
      console.error(err);
      setPackages([]);
      setInquiries([]);
      setDestinations([]);
    }
  };

  const handleLogin = async (e) => {
    e.preventDefault();
    if (!username.trim() || !password.trim()) {
      showToast('Please enter username and password', 'error');
      return;
    }

    setLoginLoading(true);
    try {
      const data = await loginAdmin(username, password);
      localStorage.setItem('token', data.token);
      setIsAdmin(true);
      showToast('Welcome back, Admin!', 'success');
    } catch (err) {
      console.error(err);
      showToast(err.response?.data?.message || 'Login failed. Invalid credentials.', 'error');
    } finally {
      setLoginLoading(false);
    }
  };

  const handleLogout = () => {
    localStorage.removeItem('token');
    setIsAdmin(false);
    showToast('Logged out successfully', 'success');
  };

  const handleOpenAddModal = () => {
    setEditingPackageId(null);
    setModalTab('basic');
    setPkgTitle('');
    setPkgDescription('');
    setPkgPrice('');
    setPkgPriceDeluxe('');
    setPkgPriceLuxury('');
    setPkgDuration('');
    setPkgDestination('');
    setPkgCategory('Standard');
    setPkgImage('');
    setPkgHighlights('');
    setPkgInclusions('');
    setPkgExclusions('');
    setPkgItinerary([
      { day: 1, title: '', desc: '' }
    ]);
    setPackageModalOpen(true);
  };

  const handleOpenEditModal = (pkg) => {
    setEditingPackageId(pkg._id);
    setModalTab('basic');
    setPkgTitle(pkg.title || '');
    setPkgDescription(pkg.description || pkg.subtitle || '');
    setPkgPrice(pkg.price ? String(pkg.price) : '');
    setPkgPriceDeluxe(pkg.deluxe ? pkg.deluxe.replace(/[^0-9]/g, '') : '');
    setPkgPriceLuxury(pkg.luxury ? pkg.luxury.replace(/[^0-9]/g, '') : '');
    setPkgDuration(pkg.duration || '');
    setPkgDestination(pkg.destination || '');
    setPkgImage(pkg.image || pkg.heroImage || '');
    setPkgCategory(pkg.category || 'Standard');

    setPkgHighlights(Array.isArray(pkg.highlights) ? pkg.highlights.join('\n') : (pkg.highlights || ''));
    setPkgInclusions(Array.isArray(pkg.included) ? pkg.included.join('\n') : (Array.isArray(pkg.inclusions) ? pkg.inclusions.join('\n') : (pkg.included || '')));
    setPkgExclusions(Array.isArray(pkg.excluded) ? pkg.excluded.join('\n') : (Array.isArray(pkg.exclusions) ? pkg.exclusions.join('\n') : (pkg.excluded || '')));

    if (Array.isArray(pkg.itinerary) && pkg.itinerary.length > 0) {
      setPkgItinerary(pkg.itinerary.map((item, idx) => ({
        day: idx + 1,
        title: item.title || '',
        desc: item.desc || item.description || ''
      })));
    } else {
      setPkgItinerary([
        { day: 1, title: 'Arrival & Hotel Check-in', desc: 'Pick up and check-in to hotel.' }
      ]);
    }
    setPackageModalOpen(true);
  };

  const handleAddItineraryDay = () => {
    setPkgItinerary(prev => [
      ...prev,
      { day: prev.length + 1, title: '', desc: '' }
    ]);
  };

  const handleRemoveItineraryDay = (index) => {
    setPkgItinerary(prev => {
      const updated = prev.filter((_, i) => i !== index);
      return updated.map((item, i) => ({ ...item, day: i + 1 }));
    });
  };

  const handleUpdateItineraryDay = (index, field, value) => {
    setPkgItinerary(prev => prev.map((item, i) => i === index ? { ...item, [field]: value } : item));
  };

  const handleAddPresetText = (setter, currentVal, presetText) => {
    const lines = currentVal ? currentVal.split('\n').map(s => s.trim()).filter(Boolean) : [];
    if (!lines.includes(presetText)) {
      lines.push(presetText);
      setter(lines.join('\n'));
      showToast(`Added: ${presetText}`, 'info');
    }
  };

  const handleApplyItineraryTemplate = (daysCount = 5) => {
    const templates = [
      { day: 1, title: 'Guwahati Arrival → Shillong Transit', desc: 'Pickup from Guwahati airport/railway station. Drive to Shillong with stop at scenic Umiam Lake. Hotel check-in and leisure evening.' },
      { day: 2, title: 'Shillong → Cherrapunji Sightseeing Excursion', desc: 'Full day sightseeing to Cherrapunji. Visit Elephant Falls, Nohkalikai Falls, Mawsmai Cave, and Seven Sisters Falls. Overnight stay in Cherrapunji.' },
      { day: 3, title: 'Living Root Bridge Trek & Dawki River', desc: 'Morning trek to iconic Double-Decker Living Root Bridge. Drive to Dawki, boat ride on crystal-clear Umngot River. Visit Mawlynnong village.' },
      { day: 4, title: 'Krang Suri Waterfalls → Shillong Return', desc: 'Excursion to turquoise Krang Suri waterfalls in Jowai. Swim in natural pools. Evening return to Shillong for local handicraft shopping at Police Bazar.' },
      { day: 5, title: 'Kamakhya Temple Visit → Guwahati Departure', desc: 'Morning hotel check-out. Visit revered Kamakhya Temple in Guwahati. Drop-off at Guwahati airport or railway station for return journey.' },
      { day: 6, title: 'Kaziranga National Park Elephant & Jeep Safari', desc: 'Early morning elephant safari in Central Range of Kaziranga. Afternoon open jeep safari to spot one-horned rhinos, wild buffaloes, and exotic birds.' },
      { day: 7, title: 'Majuli Island Ferry & Cultural Village Walk', desc: 'Take scenic ferry across Brahmaputra to Majuli Island. Visit historic Satras (Vaishnavite monasteries) and local Mishing tribal craft hamlets.' }
    ];
    setPkgItinerary(templates.slice(0, daysCount));
    showToast(`Applied ${daysCount}-Day Itinerary Template!`, 'info');
  };

  const handleSavePackage = async (e) => {
    e.preventDefault();
    if (!pkgTitle.trim() || !pkgPrice.trim() || !pkgDuration.trim() || !pkgDestination.trim()) {
      showToast('Please fill in required basic fields (Title, Destination, Price, Duration)', 'error');
      setModalTab('basic');
      return;
    }

    const formattedPrice = Number(pkgPrice);
    const payload = {
      title: pkgTitle,
      description: pkgDescription,
      price: formattedPrice,
      standard: `₹${formattedPrice.toLocaleString('en-IN')}`,
      deluxe: pkgPriceDeluxe ? `₹${Number(pkgPriceDeluxe).toLocaleString('en-IN')}` : '—',
      luxury: pkgPriceLuxury ? `₹${Number(pkgPriceLuxury).toLocaleString('en-IN')}` : '—',
      duration: pkgDuration,
      destination: pkgDestination,
      category: pkgCategory,
      image: pkgImage || 'https://images.unsplash.com/photo-1582510003544-4d00b7f74220?w=600&q=80',
      highlights: pkgHighlights.split('\n').map(s => s.trim()).filter(Boolean),
      included: pkgInclusions.split('\n').map(s => s.trim()).filter(Boolean),
      excluded: pkgExclusions.split('\n').map(s => s.trim()).filter(Boolean),
      itinerary: pkgItinerary.filter(i => i.title.trim()).map((item, i) => ({ day: i + 1, title: item.title, desc: item.desc }))
    };

    try {
      if (editingPackageId) {
        await updatePackage(editingPackageId, payload).catch(() => null);
        setPackages(prev => prev.map(p => p._id === editingPackageId ? { ...p, ...payload } : p));
        showToast('Package updated with full details!', 'success');
      } else {
        const created = await createPackage(payload).catch(() => ({ _id: `pkg-${Date.now()}`, ...payload }));
        setPackages(prev => [created, ...prev]);
        showToast('Detailed package created successfully!', 'success');
      }
      setPackageModalOpen(false);
    } catch (err) {
      console.error(err);
      showToast('Error saving detailed package', 'error');
    }
  };

  const handleDeletePkg = async (id) => {
    if (!window.confirm('Are you sure you want to delete this package?')) return;
    try {
      await deletePackage(id).catch(() => null);
      setPackages(prev => prev.filter(p => p._id !== id));
      showToast('Package deleted', 'success');
    } catch (err) {
      showToast('Failed to delete package', 'error');
    }
  };

  const handleSaveDestination = async (e) => {
    e.preventDefault();
    if (!destName.trim() || !destBestTime.trim()) {
      showToast('Please fill in destination fields', 'error');
      return;
    }

    try {
      const newDest = { _id: `dest-${Date.now()}`, name: destName, bestTimeToVisit: destBestTime, packagesCount: '0 packages', status: 'Live' };
      await createDestination({ name: destName, bestTimeToVisit: destBestTime, description: destDesc, image: destImage }).catch(() => null);
      setDestinations(prev => [...prev, newDest]);
      showToast('Destination added successfully!', 'success');
      setDestName('');
      setDestBestTime('');
      setDestDesc('');
      setDestImage('');
    } catch (err) {
      console.error(err);
      showToast('Error adding destination', 'error');
    }
  };

  const handleUpdateInquiryStatus = async (inquiryId, newStatus) => {
    try {
      await updateInquiryStatus(inquiryId, newStatus).catch(() => null);
      setInquiries(prev => prev.map(i => i._id === inquiryId ? { ...i, status: newStatus } : i));
      if (selectedVoucher && selectedVoucher._id === inquiryId) {
        setSelectedVoucher(prev => ({ ...prev, status: newStatus }));
      }
      showToast(`Status updated to "${newStatus}"`, 'success');
    } catch (err) {
      showToast('Failed to update status', 'error');
    }
  };

  const copyToClipboard = (text) => {
    navigator.clipboard.writeText(text);
    showToast('Image URL copied to clipboard!', 'info');
  };

  if (loading) {
    return <Spinner fullPage={true} />;
  }

  // Admin Login View
  if (!isAdmin) {
    return (
      <div style={{ minHeight: '100vh', display: 'flex', alignItems: 'center', justifyContent: 'center', background: 'linear-gradient(135deg, #0f172a 0%, #0f766e 100%)', padding: '1.5rem' }}>
        <div style={{ background: '#ffffff', padding: '2.5rem', borderRadius: '24px', boxShadow: '0 25px 50px -12px rgba(0, 0, 0, 0.35)', maxWidth: '420px', width: '100%' }}>
          <div style={{ textAlign: 'center', marginBottom: '2rem' }}>
            <div className="logo" style={{ fontSize: '2.2rem', justifyContent: 'center', marginBottom: '0.5rem' }}>
              <span className="trav">Trav</span><span className="mitraa">mitraa</span>
            </div>
            <h2 style={{ fontSize: '1.25rem', fontWeight: 800, color: 'var(--slate-900)' }}>Admin Control Console</h2>
            <p style={{ fontSize: '0.875rem', color: 'var(--slate-500)', marginTop: '0.25rem' }}>Sign in to manage bookings & packages</p>
          </div>

          <form onSubmit={handleLogin}>
            <div style={{ marginBottom: '1.25rem' }}>
              <label style={{ display: 'block', fontSize: '0.82rem', fontWeight: 700, color: 'var(--slate-700)', marginBottom: '0.35rem' }}>Username</label>
              <input
                type="text"
                className="admin-form-input"
                value={username}
                onChange={(e) => setUsername(e.target.value)}
                placeholder="Enter admin username"
                required
              />
            </div>
            <div style={{ marginBottom: '1.5rem' }}>
              <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: '0.35rem' }}>
                <label style={{ fontSize: '0.82rem', fontWeight: 700, color: 'var(--slate-700)' }}>Password</label>
                <button type="button" onClick={() => setShowPassword(!showPassword)} style={{ background: 'none', border: 'none', fontSize: '0.78rem', color: 'var(--teal)', cursor: 'pointer', fontWeight: 600 }}>
                  {showPassword ? 'Hide' : 'Show'}
                </button>
              </div>
              <input
                type={showPassword ? 'text' : 'password'}
                className="admin-form-input"
                value={password}
                onChange={(e) => setPassword(e.target.value)}
                placeholder="Enter admin password"
                required
              />
            </div>

            <Button type="submit" variant="primary" style={{ width: '100%', padding: '0.8rem', fontSize: '0.95rem', borderRadius: '12px' }} disabled={loginLoading}>
              {loginLoading ? 'Authenticating...' : 'Sign In to Dashboard'}
            </Button>
          </form>
        </div>
      </div>
    );
  }

  const titleMap = {
    dashboard: 'Operational Overview',
    enquiries: 'Customer Leads & Inquiries',
    packages: 'Tour Package Catalog',
    destinations: 'Destination Regions',
    media: 'Media Asset Library',
    settings: 'System & Contact Settings'
  };

  const getStatusBadgeClass = (st) => {
    switch ((st || '').toLowerCase()) {
      case 'new': return 'status-new';
      case 'in progress': return 'status-progress';
      case 'quoted': return 'status-quoted';
      case 'confirmed': case 'published': case 'live': return 'status-confirmed';
      default: return 'status-closed';
    }
  };

  // Filtered inquiries list
  const filteredInquiries = inquiries.filter(inq => {
    const matchesSearch = !searchTerm || 
      (inq.name && inq.name.toLowerCase().includes(searchTerm.toLowerCase())) ||
      (inq.email && inq.email.toLowerCase().includes(searchTerm.toLowerCase())) ||
      (inq.phone && inq.phone.includes(searchTerm));
    const matchesStatus = !statusFilter || (inq.status || '').toLowerCase() === statusFilter.toLowerCase();
    const matchesPkg = !pkgFilter || (inq.interest || '').toLowerCase().includes(pkgFilter.toLowerCase());
    return matchesSearch && matchesStatus && matchesPkg;
  });

  const newLeadsCount = inquiries.filter(i => (i.status || '').toLowerCase() === 'new').length;
  const openLeadsCount = inquiries.filter(i => ['in progress', 'quoted'].includes((i.status || '').toLowerCase())).length;
  const confirmedCount = inquiries.filter(i => (i.status || '').toLowerCase() === 'confirmed').length;

  const renderSidebarNav = () => (
    <>
      <div className="sidebar-brand">
        <div className="logo"><span className="trav">Trav</span><span className="mitraa">mitraa</span></div>
        <small>Agency Management Panel</small>
      </div>

      <div className="nav-section">Operations</div>
      <ul className="side-nav">
        <li>
          <button className={activeTab === 'dashboard' ? 'active' : ''} onClick={() => { setActiveTab('dashboard'); setMobileNavOpen(false); }}>
            <span className="nav-icon">📊</span> Dashboard
          </button>
        </li>
        <li>
          <button className={activeTab === 'enquiries' ? 'active' : ''} onClick={() => { setActiveTab('enquiries'); setMobileNavOpen(false); }}>
            <span className="nav-icon">📬</span> Enquiries <span className="badge">{inquiries.length}</span>
          </button>
        </li>
        <li>
          <button className={activeTab === 'packages' ? 'active' : ''} onClick={() => { setActiveTab('packages'); setMobileNavOpen(false); }}>
            <span className="nav-icon">🏔️</span> Packages <span className="badge" style={{ background: '#334155' }}>{packages.length}</span>
          </button>
        </li>
        <li>
          <button className={activeTab === 'destinations' ? 'active' : ''} onClick={() => { setActiveTab('destinations'); setMobileNavOpen(false); }}>
            <span className="nav-icon">📍</span> Destinations
          </button>
        </li>
      </ul>

      <div className="nav-section">Content & Config</div>
      <ul className="side-nav">
        <li>
          <button className={activeTab === 'media' ? 'active' : ''} onClick={() => { setActiveTab('media'); setMobileNavOpen(false); }}>
            <span className="nav-icon">🖼️</span> Media Library
          </button>
        </li>
        <li>
          <button className={activeTab === 'settings' ? 'active' : ''} onClick={() => { setActiveTab('settings'); setMobileNavOpen(false); }}>
            <span className="nav-icon">⚙️</span> Site Settings
          </button>
        </li>
      </ul>

      <div className="sidebar-user">
        <div className="avatar">TP</div>
        <div>
          <strong>Tapan Patar</strong>
          <span>Senior Operations Manager</span>
        </div>
      </div>
    </>
  );

  return (
    <div className="admin">
      {/* Desktop Sidebar */}
      <aside className="sidebar">
        {renderSidebarNav()}
      </aside>

      {/* Mobile Drawer */}
      {mobileNavOpen && (
        <div className="mobile-sidebar-drawer" onClick={() => setMobileNavOpen(false)}>
          <div className="mobile-sidebar-inner" onClick={(e) => e.stopPropagation()}>
            {renderSidebarNav()}
          </div>
        </div>
      )}

      {/* Main Content */}
      <div className="main">
        <header className="topbar">
          <div className="topbar-title">
            <button className="admin-mobile-toggle" onClick={() => setMobileNavOpen(true)}>
              ☰
            </button>
            <h1>{titleMap[activeTab] || 'Admin Dashboard'}</h1>
          </div>

          <div className="topbar-actions">
            <Link to="/" target="_blank" className="btn btn-ghost btn-sm">🌐 Live Site</Link>
            <button className="btn btn-primary btn-sm" onClick={handleOpenAddModal}>+ Add Package</button>
            <button className="btn btn-ghost btn-sm" onClick={handleLogout}>Sign Out</button>
          </div>
        </header>

        <div className="content">
          {/* DASHBOARD TAB */}
          {activeTab === 'dashboard' && (
            <div>
              <div className="admin-kpi-grid">
                <div className="admin-kpi-card">
                  <div className="kpi-info-group">
                    <span className="kpi-label">New Enquiries</span>
                    <span className="kpi-value">{newLeadsCount}</span>
                    <span className="kpi-trend positive">+2 today</span>
                  </div>
                  <div className="kpi-icon-wrapper icon-blue">📩</div>
                </div>

                <div className="admin-kpi-card">
                  <div className="kpi-info-group">
                    <span className="kpi-label">Active Leads</span>
                    <span className="kpi-value">{openLeadsCount}</span>
                    <span className="kpi-trend neutral">In progress / quoted</span>
                  </div>
                  <div className="kpi-icon-wrapper icon-coral">⏳</div>
                </div>

                <div className="admin-kpi-card">
                  <div className="kpi-info-group">
                    <span className="kpi-label">Live Packages</span>
                    <span className="kpi-value">{packages.length}</span>
                    <span className="kpi-trend positive">Published online</span>
                  </div>
                  <div className="kpi-icon-wrapper icon-teal">🏞️</div>
                </div>

                <div className="admin-kpi-card">
                  <div className="kpi-info-group">
                    <span className="kpi-label">Confirmed Bookings</span>
                    <span className="kpi-value">{confirmedCount}</span>
                    <span className="kpi-trend positive">High conversion</span>
                  </div>
                  <div className="kpi-icon-wrapper icon-purple">✅</div>
                </div>
              </div>

              <div style={{ display: 'grid', gridTemplateColumns: '1.5fr 1fr', gap: '1.5rem' }}>
                <div className="admin-panel">
                  <div className="panel-header">
                    <h2>Recent Lead Activity</h2>
                    <button className="btn btn-ghost btn-sm" onClick={() => setActiveTab('enquiries')}>View All ({inquiries.length})</button>
                  </div>
                  <div className="table-wrapper">
                    <table className="admin-table">
                      <thead>
                        <tr>
                          <th>Lead Name</th>
                          <th>Interest Package</th>
                          <th>Status</th>
                          <th>Received</th>
                          <th>Action</th>
                        </tr>
                      </thead>
                      <tbody>
                        {inquiries.slice(0, 5).map((inq) => (
                          <tr key={inq._id}>
                            <td>
                              <div className="cell-user">
                                <div className="cell-avatar">{inq.name ? inq.name.charAt(0) : 'U'}</div>
                                <div className="cell-user-info">
                                  <strong>{inq.name}</strong>
                                  <span>{inq.pax || 2} travellers</span>
                                </div>
                              </div>
                            </td>
                            <td>{inq.interest || 'North East Tour'}</td>
                            <td><span className={`status ${getStatusBadgeClass(inq.status || 'New')}`}>{inq.status || 'New'}</span></td>
                            <td>{inq.date || 'Today'}</td>
                            <td>
                              <button className="btn btn-ghost btn-sm" onClick={() => setSelectedVoucher(inq)}>Open</button>
                            </td>
                          </tr>
                        ))}
                      </tbody>
                    </table>
                  </div>
                </div>

                <div className="admin-panel">
                  <div className="panel-header">
                    <h2>Live Packages Overview</h2>
                    <button className="btn btn-ghost btn-sm" onClick={() => setActiveTab('packages')}>Manage</button>
                  </div>
                  <div>
                    {packages.slice(0, 4).map((pkg) => (
                      <div key={pkg._id} className="pkg-row">
                        <div
                          className="pkg-thumb"
                          style={{ backgroundImage: `url('${pkg.image || 'https://images.unsplash.com/photo-1582510003544-4d00b7f74220?w=100&q=60'}')` }}
                        />
                        <div className="pkg-info">
                          <strong>{pkg.title}</strong>
                          <span>{pkg.duration || '5D'} · From ₹{typeof pkg.price === 'number' ? pkg.price.toLocaleString('en-IN') : pkg.price}</span>
                        </div>
                        <button className="btn btn-ghost btn-sm" onClick={() => handleOpenEditModal(pkg)}>Edit</button>
                      </div>
                    ))}
                  </div>
                </div>
              </div>
            </div>
          )}

          {/* ENQUIRIES TAB */}
          {activeTab === 'enquiries' && (
            <div className="admin-panel">
              <div className="panel-header">
                <h2>Enquiries & Lead Management</h2>
                <button className="btn btn-ghost btn-sm" onClick={() => showToast('Lead records exported to CSV format', 'info')}>Export CSV</button>
              </div>

              <div className="admin-toolbar-row">
                <select className="admin-select" value={statusFilter} onChange={(e) => setStatusFilter(e.target.value)}>
                  <option value="">All Statuses</option>
                  <option value="New">New</option>
                  <option value="In progress">In Progress</option>
                  <option value="Quoted">Quoted</option>
                  <option value="Confirmed">Confirmed</option>
                  <option value="Closed">Closed</option>
                </select>
                <select className="admin-select" value={pkgFilter} onChange={(e) => setPkgFilter(e.target.value)}>
                  <option value="">All Destinations</option>
                  <option value="Meghalaya">Meghalaya</option>
                  <option value="Assam">Assam</option>
                  <option value="Kaziranga">Kaziranga</option>
                  <option value="Tawang">Tawang</option>
                  <option value="Sikkim">Sikkim</option>
                </select>
                <input
                  type="search"
                  className="admin-search-input"
                  placeholder="Search customer name, email, phone…"
                  value={searchTerm}
                  onChange={(e) => setSearchTerm(e.target.value)}
                />
              </div>

              <div className="table-wrapper">
                <table className="admin-table">
                  <thead>
                    <tr>
                      <th>Customer</th>
                      <th>Contact Details</th>
                      <th>Interest / Package</th>
                      <th>Pax</th>
                      <th>Assigned Agent</th>
                      <th>Status</th>
                      <th>Date</th>
                      <th>Action</th>
                    </tr>
                  </thead>
                  <tbody>
                    {filteredInquiries.length === 0 ? (
                      <tr>
                        <td colSpan="8" style={{ textAlign: 'center', padding: '2rem', color: 'var(--slate-500)' }}>
                          No enquiries found matching filter criteria.
                        </td>
                      </tr>
                    ) : (
                      filteredInquiries.map((inq) => (
                        <tr key={inq._id}>
                          <td>
                            <div className="cell-user">
                              <div className="cell-avatar">{inq.name ? inq.name.charAt(0) : 'U'}</div>
                              <div className="cell-user-info">
                                <strong>{inq.name}</strong>
                                <span>{inq.location || 'India'}</span>
                              </div>
                            </div>
                          </td>
                          <td>
                            <div style={{ fontSize: '0.85rem' }}>
                              <div>{inq.phone || '+91 9876543210'}</div>
                              <div style={{ color: 'var(--slate-500)', fontSize: '0.78rem' }}>{inq.email || 'user@example.com'}</div>
                            </div>
                          </td>
                          <td><strong>{inq.interest || 'North East Tour'}</strong></td>
                          <td>{inq.pax || 2} Adults</td>
                          <td>{inq.assigned || 'Tapan'}</td>
                          <td>
                            <select
                              className="admin-select"
                              style={{ padding: '0.2rem 0.5rem', fontSize: '0.75rem', borderRadius: '6px' }}
                              value={inq.status || 'New'}
                              onChange={(e) => handleUpdateInquiryStatus(inq._id, e.target.value)}
                            >
                              <option value="New">New</option>
                              <option value="In progress">In Progress</option>
                              <option value="Quoted">Quoted</option>
                              <option value="Confirmed">Confirmed</option>
                              <option value="Closed">Closed</option>
                            </select>
                          </td>
                          <td>{inq.date || 'Today'}</td>
                          <td>
                            <button className="btn btn-ghost btn-sm" onClick={() => setSelectedVoucher(inq)}>Open</button>
                          </td>
                        </tr>
                      ))
                    )}
                  </tbody>
                </table>
              </div>
            </div>
          )}

          {/* PACKAGES TAB */}
          {activeTab === 'packages' && (
            <div className="admin-panel">
              <div className="panel-header">
                <h2>Tour Packages Catalog</h2>
                <button className="btn btn-primary btn-sm" onClick={handleOpenAddModal}>+ Add New Package</button>
              </div>
              <div className="table-wrapper">
                <table className="admin-table">
                  <thead>
                    <tr>
                      <th>Package Title</th>
                      <th>Destination</th>
                      <th>Duration</th>
                      <th>Standard</th>
                      <th>Deluxe</th>
                      <th>Luxury</th>
                      <th>Status</th>
                      <th>Actions</th>
                    </tr>
                  </thead>
                  <tbody>
                    {packages.length === 0 ? (
                      <tr>
                        <td colSpan="8" style={{ textAlign: 'center', padding: '2rem', color: 'var(--slate-500)' }}>
                          No tour packages found. Click "+ Add New Package" to create one.
                        </td>
                      </tr>
                    ) : (
                      packages.map((pkg) => (
                        <tr key={pkg._id}>
                          <td>
                            <div className="cell-user">
                              <div
                                className="pkg-thumb"
                                style={{ backgroundImage: `url('${pkg.image || 'https://images.unsplash.com/photo-1582510003544-4d00b7f74220?w=100&q=60'}')` }}
                              />
                              <div className="cell-user-info">
                                <strong>{pkg.title}</strong>
                                <span>{pkg.description ? pkg.description.substring(0, 45) + '...' : 'North East India Tour'}</span>
                              </div>
                            </div>
                          </td>
                          <td><strong>{pkg.destination || 'North East'}</strong></td>
                          <td>{pkg.duration || '5D / 4N'}</td>
                          <td><strong style={{ color: 'var(--slate-900)' }}>{pkg.standard || (typeof pkg.price === 'number' ? `₹${pkg.price.toLocaleString('en-IN')}` : pkg.price)}</strong></td>
                          <td><span style={{ color: 'var(--teal)', fontWeight: 600 }}>{pkg.deluxe || '—'}</span></td>
                          <td><span style={{ color: 'var(--coral)', fontWeight: 600 }}>{pkg.luxury || '—'}</span></td>
                          <td><span className="status status-confirmed">{pkg.status || 'Published'}</span></td>
                          <td>
                            <div style={{ display: 'flex', gap: '0.4rem' }}>
                              <button className="btn btn-ghost btn-sm" onClick={() => handleOpenEditModal(pkg)}>Edit Details</button>
                              <button className="btn btn-ghost btn-sm" style={{ color: '#dc2626' }} onClick={() => handleDeletePkg(pkg._id)}>Delete</button>
                            </div>
                          </td>
                        </tr>
                      ))
                    )}
                  </tbody>
                </table>
              </div>
            </div>
          )}

          {/* DESTINATIONS TAB */}
          {activeTab === 'destinations' && (
            <div style={{ display: 'grid', gridTemplateColumns: '1fr 2fr', gap: '1.5rem' }}>
              <div className="admin-panel" style={{ padding: '1.5rem' }}>
                <h3 style={{ fontSize: '1.1rem', fontWeight: 800, marginBottom: '1.25rem', color: 'var(--slate-900)' }}>Add Destination Region</h3>
                <form onSubmit={handleSaveDestination}>
                  <div className="admin-form-group">
                    <label>Region / State Name</label>
                    <input
                      type="text"
                      className="admin-form-input"
                      value={destName}
                      onChange={(e) => setDestName(e.target.value)}
                      placeholder="e.g. Nagaland"
                      required
                    />
                  </div>
                  <div className="admin-form-group">
                    <label>Best Season to Visit</label>
                    <input
                      type="text"
                      className="admin-form-input"
                      value={destBestTime}
                      onChange={(e) => setDestBestTime(e.target.value)}
                      placeholder="e.g. Oct – Mar"
                      required
                    />
                  </div>
                  <div className="admin-form-group">
                    <label>Description</label>
                    <textarea
                      className="admin-form-input"
                      rows="3"
                      value={destDesc}
                      onChange={(e) => setDestDesc(e.target.value)}
                      placeholder="Brief overview of region highlights..."
                    />
                  </div>
                  <Button type="submit" variant="primary" style={{ width: '100%', marginTop: '0.5rem' }}>
                    Save Destination
                  </Button>
                </form>
              </div>

              <div className="admin-panel">
                <div className="panel-header">
                  <h2>Destination Regions</h2>
                </div>
                <div className="table-wrapper">
                  <table className="admin-table">
                    <thead>
                      <tr>
                        <th>Region Name</th>
                        <th>Best Season</th>
                        <th>Packages Linked</th>
                        <th>Status</th>
                        <th>Action</th>
                      </tr>
                    </thead>
                    <tbody>
                      {destinations.length === 0 ? (
                        <tr>
                          <td colSpan="5" style={{ textAlign: 'center', padding: '2rem', color: 'var(--slate-500)' }}>
                            No destination regions added yet. Fill out the form on the left to add one.
                          </td>
                        </tr>
                      ) : (
                        destinations.map((dest) => (
                          <tr key={dest._id}>
                            <td><strong>{dest.name}</strong></td>
                            <td>{dest.bestTimeToVisit || 'Oct – May'}</td>
                            <td>{dest.packagesCount || '0 packages'}</td>
                            <td><span className="status status-confirmed">Live</span></td>
                            <td><button className="btn btn-ghost btn-sm" onClick={() => showToast('Editing destination region', 'info')}>Edit</button></td>
                          </tr>
                        ))
                      )}
                    </tbody>
                  </table>
                </div>
              </div>
            </div>
          )}

          {/* MEDIA TAB */}
          {activeTab === 'media' && (
            <div className="admin-panel">
              <div className="panel-header">
                <h2>Media Asset Library</h2>
                <button className="btn btn-primary btn-sm" onClick={() => showToast('Image drag-and-drop uploader initialized', 'info')}>+ Upload Image</button>
              </div>

              <div className="media-grid">
                {mockMediaList.map(item => (
                  <div key={item.id} className="media-card">
                    <div className="media-preview" style={{ backgroundImage: `url('${item.url}')` }} />
                    <div className="media-info">
                      <strong>{item.title}</strong>
                      <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginTop: '0.4rem' }}>
                        <span>{item.size}</span>
                        <button
                          className="btn btn-ghost btn-sm"
                          style={{ padding: '0.2rem 0.5rem', fontSize: '0.72rem' }}
                          onClick={() => copyToClipboard(item.url)}
                        >
                          Copy Link
                        </button>
                      </div>
                    </div>
                  </div>
                ))}
              </div>
            </div>
          )}

          {/* SETTINGS TAB */}
          {activeTab === 'settings' && (
            <div className="admin-panel">
              <div className="panel-header">
                <h2>System & Public Contact Settings</h2>
              </div>
              <div style={{ padding: '1.75rem', maxWidth: '600px' }}>
                <p style={{ fontSize: '0.9rem', color: 'var(--slate-500)', marginBottom: '1.5rem' }}>
                  Update contact numbers, email addresses, and agency operational details displayed across the public portal.
                </p>

                <div className="admin-form-group">
                  <label>Primary Hotline Number</label>
                  <input
                    className="admin-form-input"
                    value={settingsPhone}
                    onChange={(e) => setSettingsPhone(e.target.value)}
                  />
                </div>

                <div className="admin-form-group">
                  <label>Public Support Email</label>
                  <input
                    className="admin-form-input"
                    value={settingsEmail}
                    onChange={(e) => setSettingsEmail(e.target.value)}
                  />
                </div>

                <div className="admin-form-group">
                  <label>Official WhatsApp Business No.</label>
                  <input
                    className="admin-form-input"
                    value={settingsWhatsapp}
                    onChange={(e) => setSettingsWhatsapp(e.target.value)}
                  />
                </div>

                <div className="admin-form-group">
                  <label>Working Hours</label>
                  <input
                    className="admin-form-input"
                    value={settingsWorkingHours}
                    onChange={(e) => setSettingsWorkingHours(e.target.value)}
                  />
                </div>

                <Button variant="secondary" style={{ marginTop: '0.5rem' }} onClick={() => showToast('Site settings updated successfully!', 'success')}>
                  Save Settings
                </Button>
              </div>
            </div>
          )}
        </div>
      </div>

      {/* ENHANCED CREATE / EDIT PACKAGE MODAL WITH DETAILS */}
      {packageModalOpen && (
        <div className="admin-modal-overlay">
          <div className="admin-modal-content">
            <div className="admin-modal-header">
              <h3>
                <span style={{ fontSize: '1.4rem' }}>🎒</span>
                {editingPackageId ? 'Edit Tour Package' : 'Create New Tour Package'}
              </h3>
              <button className="modal-close-btn" onClick={() => setPackageModalOpen(false)}>✕</button>
            </div>

            {/* Stepper Navigation Bar */}
            <div className="modal-stepper-bar">
              <button
                type="button"
                className={`stepper-btn ${modalTab === 'basic' ? 'active' : ''}`}
                onClick={() => setModalTab('basic')}
              >
                <span className="stepper-num">1</span>
                <span>Basic Details</span>
              </button>
              <button
                type="button"
                className={`stepper-btn ${modalTab === 'tiers' ? 'active' : ''}`}
                onClick={() => setModalTab('tiers')}
              >
                <span className="stepper-num">2</span>
                <span>Tiered Pricing</span>
              </button>
              <button
                type="button"
                className={`stepper-btn ${modalTab === 'highlights' ? 'active' : ''}`}
                onClick={() => setModalTab('highlights')}
              >
                <span className="stepper-num">3</span>
                <span>Highlights & Perks</span>
              </button>
              <button
                type="button"
                className={`stepper-btn ${modalTab === 'itinerary' ? 'active' : ''}`}
                onClick={() => setModalTab('itinerary')}
              >
                <span className="stepper-num">4</span>
                <span>Day Itinerary ({pkgItinerary.length})</span>
              </button>
            </div>

            <form onSubmit={handleSavePackage}>
              {/* STEP 1: BASIC DETAILS */}
              {modalTab === 'basic' && (
                <div>
                  <div className="admin-form-group">
                    <label>Package Title *</label>
                    <input
                      type="text"
                      className="admin-form-input"
                      value={pkgTitle}
                      onChange={(e) => setPkgTitle(e.target.value)}
                      placeholder="e.g. Meghalaya Highlights & Living Root Bridges"
                      required
                    />
                  </div>

                  <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: '1rem' }}>
                    <div className="admin-form-group">
                      <label>Destination Region *</label>
                      <select
                        className="admin-form-input"
                        value={pkgDestination}
                        onChange={(e) => setPkgDestination(e.target.value)}
                        required
                      >
                        <option value="">-- Select Destination --</option>
                        {destinations.map((d) => (
                          <option key={d._id || d.id || d.name} value={d.name}>{d.name}</option>
                        ))}
                        <option value="Meghalaya">Meghalaya</option>
                        <option value="Assam">Assam</option>
                        <option value="Arunachal Pradesh">Arunachal Pradesh</option>
                        <option value="Sikkim">Sikkim</option>
                        <option value="Nagaland">Nagaland</option>
                        <option value="Manipur">Manipur</option>
                        <option value="Mizoram">Mizoram</option>
                        <option value="Tripura">Tripura</option>
                      </select>
                    </div>

                    <div className="admin-form-group">
                      <label>Duration *</label>
                      <input
                        type="text"
                        className="admin-form-input"
                        value={pkgDuration}
                        onChange={(e) => setPkgDuration(e.target.value)}
                        placeholder="e.g. 5 Days / 4 Nights"
                        required
                      />
                    </div>
                  </div>

                  {/* Preset Image Picker */}
                  <div className="admin-form-group">
                    <label>Cover Image URL</label>
                    <input
                      type="url"
                      className="admin-form-input"
                      value={pkgImage}
                      onChange={(e) => setPkgImage(e.target.value)}
                      placeholder="https://images.unsplash.com/photo-..."
                    />

                    <div style={{ marginTop: '0.6rem' }}>
                      <div className="preset-pills-label">📷 Quick Cover Photo Presets:</div>
                      <div className="preset-pills-wrapper">
                        {PRESET_COVER_IMAGES.map((item, idx) => (
                          <button
                            key={idx}
                            type="button"
                            className="preset-pill-btn"
                            onClick={() => setPkgImage(item.url)}
                          >
                            + {item.label}
                          </button>
                        ))}
                      </div>
                    </div>

                    {/* Image Preview */}
                    {pkgImage && (
                      <div className="image-preview-card">
                        <img
                          src={pkgImage}
                          alt="Cover preview"
                          className="image-preview-thumb"
                          onError={(e) => { e.target.style.display = 'none'; }}
                        />
                        <div>
                          <strong style={{ fontSize: '0.85rem', color: 'var(--slate-800)' }}>Live Image Preview</strong>
                          <p style={{ fontSize: '0.75rem', color: 'var(--slate-500)', margin: 0 }}>This photo will be displayed on the tour card and hero banner.</p>
                        </div>
                      </div>
                    )}
                  </div>

                  <div className="admin-form-group">
                    <label>Package Overview / Subtitle</label>
                    <textarea
                      className="admin-form-input"
                      rows="3"
                      value={pkgDescription}
                      onChange={(e) => setPkgDescription(e.target.value)}
                      placeholder="Living root bridges, cascading waterfalls, clean Khasi villages and wettest places on earth..."
                    />
                  </div>
                </div>
              )}

              {/* STEP 2: TIERED PRICING */}
              {modalTab === 'tiers' && (
                <div>
                  <div style={{ padding: '0.85rem 1rem', background: '#eff6ff', borderRadius: '12px', border: '1px solid #bfdbfe', marginBottom: '1.25rem' }}>
                    <p style={{ fontSize: '0.85rem', color: '#1e40af', margin: 0 }}>
                      💡 Set transparent tiered pricing so clients can choose between Standard 3★, Deluxe 4★, or Luxury 5★ packages.
                    </p>
                  </div>

                  <div className="admin-form-group">
                    <label>Standard Category Base Price (₹) *</label>
                    <input
                      type="number"
                      className="admin-form-input"
                      value={pkgPrice}
                      onChange={(e) => setPkgPrice(e.target.value)}
                      placeholder="18900"
                      required
                    />
                    <span className="admin-form-hint">
                      Displayed as starting price card tag. {pkgPrice ? `(Formatted: ₹${Number(pkgPrice).toLocaleString('en-IN')})` : ''}
                    </span>
                  </div>

                  <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: '1rem' }}>
                    <div className="admin-form-group">
                      <label>Deluxe Tier Price (₹)</label>
                      <input
                        type="number"
                        className="admin-form-input"
                        value={pkgPriceDeluxe}
                        onChange={(e) => setPkgPriceDeluxe(e.target.value)}
                        placeholder="24900"
                      />
                      <span className="admin-form-hint">
                        4-Star hotel tier {pkgPriceDeluxe ? `(₹${Number(pkgPriceDeluxe).toLocaleString('en-IN')})` : ''}
                      </span>
                    </div>

                    <div className="admin-form-group">
                      <label>Luxury Tier Price (₹)</label>
                      <input
                        type="number"
                        className="admin-form-input"
                        value={pkgPriceLuxury}
                        onChange={(e) => setPkgPriceLuxury(e.target.value)}
                        placeholder="34900"
                      />
                      <span className="admin-form-hint">
                        5-Star / Resort tier {pkgPriceLuxury ? `(₹${Number(pkgPriceLuxury).toLocaleString('en-IN')})` : ''}
                      </span>
                    </div>
                  </div>
                </div>
              )}

              {/* STEP 3: HIGHLIGHTS & INCLUSIONS */}
              {modalTab === 'highlights' && (
                <div>
                  <div className="admin-form-group">
                    <label>Trip Key Highlights (One item per line)</label>
                    <div className="preset-pills-label">✨ Quick Add Highlights:</div>
                    <div className="preset-pills-wrapper">
                      {HIGHLIGHT_PRESETS.map((preset, idx) => (
                        <button
                          key={idx}
                          type="button"
                          className="preset-pill-btn"
                          onClick={() => handleAddPresetText(setPkgHighlights, pkgHighlights, preset)}
                        >
                          + {preset}
                        </button>
                      ))}
                    </div>
                    <textarea
                      className="admin-form-input"
                      rows="4"
                      value={pkgHighlights}
                      onChange={(e) => setPkgHighlights(e.target.value)}
                      placeholder={'Double-decker living root bridge trek\nNohkalikai & Seven Sisters waterfalls\nCrystal-clear Dawki river & Umngot\nShillong city & Ward’s Lake'}
                    />
                  </div>

                  <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: '1rem' }}>
                    <div className="admin-form-group">
                      <label>Included Facilities (One per line)</label>
                      <div className="preset-pills-label">✅ Quick Add Inclusions:</div>
                      <div className="preset-pills-wrapper">
                        {INCLUSION_PRESETS.map((preset, idx) => (
                          <button
                            key={idx}
                            type="button"
                            className="preset-pill-btn"
                            onClick={() => handleAddPresetText(setPkgInclusions, pkgInclusions, preset)}
                          >
                            + {preset}
                          </button>
                        ))}
                      </div>
                      <textarea
                        className="admin-form-input"
                        rows="4"
                        value={pkgInclusions}
                        onChange={(e) => setPkgInclusions(e.target.value)}
                        placeholder={'3★ / 4★ Hotel Accommodation\nDaily breakfast\nPrivate AC vehicle\nDriver allowances & entry permits'}
                      />
                    </div>

                    <div className="admin-form-group">
                      <label>Excluded Facilities (One per line)</label>
                      <div className="preset-pills-label">❌ Quick Add Exclusions:</div>
                      <div className="preset-pills-wrapper">
                        {EXCLUSION_PRESETS.map((preset, idx) => (
                          <button
                            key={idx}
                            type="button"
                            className="preset-pill-btn"
                            onClick={() => handleAddPresetText(setPkgExclusions, pkgExclusions, preset)}
                          >
                            + {preset}
                          </button>
                        ))}
                      </div>
                      <textarea
                        className="admin-form-input"
                        rows="4"
                        value={pkgExclusions}
                        onChange={(e) => setPkgExclusions(e.target.value)}
                        placeholder={'Airfare / Train tickets\nLunch & dinner\nPersonal expenses & tips'}
                      />
                    </div>
                  </div>
                </div>
              )}

              {/* STEP 4: DAY-BY-DAY ITINERARY BUILDER */}
              {modalTab === 'itinerary' && (
                <div>
                  <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: '1rem', background: '#f8fafc', padding: '0.85rem 1rem', borderRadius: '12px', border: '1px solid #e2e8f0' }}>
                    <div>
                      <strong style={{ fontSize: '0.88rem', color: 'var(--slate-800)', display: 'block' }}>Day-by-Day Itinerary Plan</strong>
                      <span style={{ fontSize: '0.78rem', color: 'var(--slate-500)' }}>Auto-fill starter templates or manually add days</span>
                    </div>
                    <div style={{ display: 'flex', gap: '0.5rem', flexWrap: 'wrap' }}>
                      <button type="button" className="btn btn-outline btn-sm" onClick={() => handleApplyItineraryTemplate(5)}>
                        ⚡ Auto-Fill 5-Day Template
                      </button>
                      <button type="button" className="btn btn-teal btn-sm" onClick={handleAddItineraryDay}>
                        + Add Day
                      </button>
                    </div>
                  </div>

                  {pkgItinerary.map((item, index) => (
                    <div key={index} className="itinerary-builder-card">
                      <div className="itinerary-builder-header">
                        <span className="itinerary-day-tag">Day {index + 1}</span>
                        {pkgItinerary.length > 1 && (
                          <button
                            type="button"
                            style={{ background: 'none', border: 'none', color: '#dc2626', cursor: 'pointer', fontSize: '0.8rem', fontWeight: 600 }}
                            onClick={() => handleRemoveItineraryDay(index)}
                          >
                            ✕ Remove Day
                          </button>
                        )}
                      </div>

                      <div className="admin-form-group" style={{ marginBottom: '0.5rem' }}>
                        <input
                          type="text"
                          className="admin-form-input"
                          value={item.title}
                          onChange={(e) => handleUpdateItineraryDay(index, 'title', e.target.value)}
                          placeholder={`Day ${index + 1} Title (e.g. Guwahati Arrival → Shillong Transit)`}
                        />
                      </div>

                      <div className="admin-form-group" style={{ margin: 0 }}>
                        <textarea
                          className="admin-form-input"
                          rows="2"
                          value={item.desc}
                          onChange={(e) => handleUpdateItineraryDay(index, 'desc', e.target.value)}
                          placeholder="Describe key activities, travel routes, sightseeing spots, and overnight stay details..."
                        />
                      </div>
                    </div>
                  ))}
                </div>
              )}

              {/* Modal Footer Controls */}
              <div style={{ display: 'flex', gap: '0.75rem', justifyContent: 'space-between', alignItems: 'center', marginTop: '1.75rem', paddingTop: '1rem', borderTop: '1px solid var(--slate-200)' }}>
                <div>
                  {modalTab !== 'basic' && (
                    <button
                      type="button"
                      className="btn btn-outline btn-sm"
                      onClick={() => {
                        if (modalTab === 'tiers') setModalTab('basic');
                        else if (modalTab === 'highlights') setModalTab('tiers');
                        else if (modalTab === 'itinerary') setModalTab('highlights');
                      }}
                    >
                      ← Previous Step
                    </button>
                  )}
                </div>

                <div style={{ display: 'flex', gap: '0.75rem' }}>
                  <button type="button" className="btn btn-ghost" onClick={() => setPackageModalOpen(false)}>Cancel</button>

                  {modalTab !== 'itinerary' ? (
                    <button
                      type="button"
                      className="btn btn-teal"
                      onClick={() => {
                        if (modalTab === 'basic') setModalTab('tiers');
                        else if (modalTab === 'tiers') setModalTab('highlights');
                        else if (modalTab === 'highlights') setModalTab('itinerary');
                      }}
                    >
                      Next Step →
                    </button>
                  ) : (
                    <button type="submit" className="btn btn-primary">
                      {editingPackageId ? '✓ Save Package Changes' : '✓ Publish Package'}
                    </button>
                  )}
                </div>
              </div>
            </form>
          </div>
        </div>
      )}

      {/* INQUIRY VOUCHER MODAL */}
      {selectedVoucher && (
        <div className="admin-modal-overlay" onClick={() => setSelectedVoucher(null)}>
          <div className="admin-modal-content" style={{ width: 'min(640px, 100%)' }} onClick={(e) => e.stopPropagation()}>
            <div className="admin-modal-header">
              <div>
                <h3 style={{ margin: 0 }}>Booking Voucher & Inquiry Detail</h3>
                <span style={{ fontSize: '0.78rem', color: 'var(--slate-500)' }}>ID: {selectedVoucher._id}</span>
              </div>
              <button className="modal-close-btn" onClick={() => setSelectedVoucher(null)}>✕</button>
            </div>

            <div style={{ background: '#f8fafc', padding: '1.25rem', borderRadius: '12px', marginBottom: '1.25rem', border: '1px solid var(--slate-200)' }}>
              <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: '1rem', marginBottom: '1rem' }}>
                <div>
                  <span style={{ fontSize: '0.78rem', color: 'var(--slate-500)', display: 'block' }}>Customer Name</span>
                  <strong style={{ fontSize: '1.05rem' }}>{selectedVoucher.name}</strong>
                </div>
                <div>
                  <span style={{ fontSize: '0.78rem', color: 'var(--slate-500)', display: 'block' }}>Package Selected</span>
                  <strong style={{ fontSize: '1.05rem', color: 'var(--teal)' }}>{selectedVoucher.interest || 'North East Special'}</strong>
                </div>
                <div>
                  <span style={{ fontSize: '0.78rem', color: 'var(--slate-500)', display: 'block' }}>Phone Number</span>
                  <strong>{selectedVoucher.phone || selectedVoucher.contact || '+91 9876543210'}</strong>
                </div>
                <div>
                  <span style={{ fontSize: '0.78rem', color: 'var(--slate-500)', display: 'block' }}>Email Address</span>
                  <strong>{selectedVoucher.email || 'user@example.com'}</strong>
                </div>
                <div>
                  <span style={{ fontSize: '0.78rem', color: 'var(--slate-500)', display: 'block' }}>Travellers (Pax)</span>
                  <strong>{selectedVoucher.pax || 2} Adults</strong>
                </div>
                <div>
                  <span style={{ fontSize: '0.78rem', color: 'var(--slate-500)', display: 'block' }}>Assigned Agent</span>
                  <strong>{selectedVoucher.assigned || 'Tapan Patar'}</strong>
                </div>
              </div>

              <div style={{ paddingTop: '0.75rem', borderTop: '1px solid var(--slate-200)', display: 'flex', alignItems: 'center', justifyContent: 'space-between' }}>
                <span style={{ fontSize: '0.85rem', fontWeight: 600 }}>Update Inquiry Status:</span>
                <select
                  className="admin-select"
                  value={selectedVoucher.status || 'New'}
                  onChange={(e) => handleUpdateInquiryStatus(selectedVoucher._id, e.target.value)}
                >
                  <option value="New">New Lead</option>
                  <option value="In progress">In Progress</option>
                  <option value="Quoted">Quoted</option>
                  <option value="Confirmed">Confirmed</option>
                  <option value="Closed">Closed</option>
                </select>
              </div>
            </div>

            <div style={{ display: 'flex', gap: '0.75rem', justifyContent: 'flex-end' }}>
              <button className="btn btn-ghost" onClick={() => setSelectedVoucher(null)}>Close</button>
              <button className="btn btn-teal" onClick={() => { window.print(); }}>🖨️ Print Voucher</button>
            </div>
          </div>
        </div>
      )}
    </div>
  );
};

export default AdminDashboard;
