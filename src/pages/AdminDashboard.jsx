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
  updateDestination,
  deleteDestination,
  getReviews,
  updateReview,
  deleteReview,
  getActivityLogs
} from '../services/api';

const AdminDashboard = () => {
  const { showToast } = useToast();
  const [isAdmin, setIsAdmin] = useState(false);
  const [loading, setLoading] = useState(true);
  const [activeTab, setActiveTab] = useState('overview');

  // Login Form State
  const [username, setUsername] = useState('');
  const [password, setPassword] = useState('');
  const [loginLoading, setLoginLoading] = useState(false);

  // Data States
  const [packages, setPackages] = useState([]);
  const [inquiries, setInquiries] = useState([]);
  const [destinations, setDestinations] = useState([]);
  const [reviews, setReviews] = useState([]);
  const [activityLogs, setActivityLogs] = useState([]);
  const [dataLoading, setDataLoading] = useState(false);

  // Search & Filter States
  const [searchTerm, setSearchTerm] = useState('');
  const [statusFilter, setStatusFilter] = useState('');

  // Voucher Printable Modal State
  const [selectedVoucher, setSelectedVoucher] = useState(null);

  // Edit / Form States
  const [editingDestId, setEditingDestId] = useState(null);
  const [packageModalOpen, setPackageModalOpen] = useState(false);
  const [editingPackageId, setEditingPackageId] = useState(null);

  // Package Form Fields
  const [pkgTitle, setPkgTitle] = useState('');
  const [pkgDescription, setPkgDescription] = useState('');
  const [pkgPrice, setPkgPrice] = useState('');
  const [pkgDuration, setPkgDuration] = useState('');
  const [pkgDestination, setPkgDestination] = useState('');
  const [pkgCategory, setPkgCategory] = useState('Standard');
  const [pkgCapacity, setPkgCapacity] = useState('15');
  const [pkgSeasonality, setPkgSeasonality] = useState('All Seasons');
  const [pkgImages, setPkgImages] = useState(['']);
  const [pkgItinerary, setPkgItinerary] = useState([{ day: 1, title: '', description: '', images: [''] }]);
  const [pkgIncluded, setPkgIncluded] = useState(['']);
  const [pkgExcluded, setPkgExcluded] = useState(['']);

  // Destination Form Fields
  const [destName, setDestName] = useState('');
  const [destImage, setDestImage] = useState('');
  const [destDesc, setDestDesc] = useState('');
  const [destBestTime, setDestBestTime] = useState('');

  useEffect(() => {
    document.title = 'Admin Dashboard | Travmitra';
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
    setDataLoading(true);
    try {
      if (activeTab === 'overview') {
        const [pkgs, inqs, dests] = await Promise.all([
          getPackages(),
          getInquiries(),
          getDestinations()
        ]);
        setPackages(pkgs);
        setInquiries(inqs);
        setDestinations(dests);
      } else if (activeTab === 'packages') {
        const pkgs = await getPackages();
        setPackages(pkgs);
      } else if (activeTab === 'inquiries') {
        const inqs = await getInquiries();
        setInquiries(inqs);
      } else if (activeTab === 'destinations') {
        const dests = await getDestinations();
        setDestinations(dests);
      } else if (activeTab === 'reviews') {
        const revs = await getReviews();
        setReviews(revs);
      } else if (activeTab === 'activity') {
        const logs = await getActivityLogs().catch(() => []);
        setActivityLogs(logs);
      }
    } catch (err) {
      console.error(err);
      showToast('Error loading dashboard data', 'error');
    } finally {
      setDataLoading(false);
    }
  };

  const handleLogin = async (e) => {
    e.preventDefault();
    if (!username.trim() || !password.trim()) {
      showToast('Please enter both username and password', 'error');
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

  // Export Data to CSV Helper
  const exportToCSV = (data, filename) => {
    if (!data || data.length === 0) {
      showToast('No data available to export.', 'error');
      return;
    }
    const headers = Object.keys(data[0]).join(',');
    const rows = data.map((obj) =>
      Object.values(obj)
        .map((val) => `"${String(val || '').replace(/"/g, '""')}"`)
        .join(',')
    );
    const csvContent = 'data:text/csv;charset=utf-8,' + [headers, ...rows].join('\n');
    const encodedUri = encodeURI(csvContent);
    const link = document.createElement('a');
    link.setAttribute('href', encodedUri);
    link.setAttribute('download', `${filename}_${new Date().toISOString().slice(0, 10)}.csv`);
    document.body.appendChild(link);
    link.click();
    document.body.removeChild(link);
    showToast('Exported CSV successfully!', 'success');
  };

  // Add/Remove array fields in package form helper
  const handleAddArrayItem = (setter) => {
    setter((prev) => [...prev, '']);
  };

  const handleRemoveArrayItem = (setter, index) => {
    setter((prev) => prev.filter((_, i) => i !== index));
  };

  const handleArrayItemChange = (setter, index, value) => {
    setter((prev) => {
      const updated = [...prev];
      updated[index] = value;
      return updated;
    });
  };

  // Itinerary helper functions
  const handleAddItineraryDay = () => {
    setPkgItinerary((prev) => [...prev, { day: prev.length + 1, title: '', description: '', images: [''] }]);
  };

  const handleRemoveItineraryDay = (index) => {
    setPkgItinerary((prev) => {
      const filtered = prev.filter((_, i) => i !== index);
      return filtered.map((item, idx) => ({ ...item, day: idx + 1 }));
    });
  };

  const handleItineraryChange = (index, field, value) => {
    setPkgItinerary((prev) => {
      const updated = [...prev];
      updated[index][field] = value;
      return updated;
    });
  };

  const handleAddItineraryDayImage = (dayIndex) => {
    setPkgItinerary((prev) => {
      const updated = [...prev];
      const currentImages = updated[dayIndex].images || [];
      updated[dayIndex].images = [...currentImages, ''];
      return updated;
    });
  };

  const handleRemoveItineraryDayImage = (dayIndex, imgIndex) => {
    setPkgItinerary((prev) => {
      const updated = [...prev];
      const currentImages = updated[dayIndex].images || [];
      updated[dayIndex].images = currentImages.filter((_, i) => i !== imgIndex);
      return updated;
    });
  };

  const handleItineraryDayImageChange = (dayIndex, imgIndex, value) => {
    setPkgItinerary((prev) => {
      const updated = [...prev];
      const currentImages = [...(updated[dayIndex].images || [])];
      currentImages[imgIndex] = value;
      updated[dayIndex].images = currentImages;
      return updated;
    });
  };

  // Open Modal for Create or Edit Package
  const openPackageModal = (pkg = null) => {
    if (pkg) {
      setEditingPackageId(pkg._id);
      setPkgTitle(pkg.title);
      setPkgDescription(pkg.description);
      setPkgPrice(pkg.price.toString());
      setPkgDuration(pkg.duration);
      setPkgDestination(pkg.destination);
      setPkgCategory(pkg.category || 'Standard');
      setPkgCapacity(pkg.capacity ? pkg.capacity.toString() : '15');
      setPkgSeasonality(pkg.seasonality || 'All Seasons');
      setPkgImages(pkg.images && pkg.images.length > 0 ? pkg.images : ['']);
      setPkgItinerary(
        pkg.itinerary && pkg.itinerary.length > 0
          ? pkg.itinerary.map((it, idx) => ({
              day: it.day || idx + 1,
              title: it.title || '',
              description: it.description || '',
              images: Array.isArray(it.images) && it.images.length > 0 ? it.images : (it.image ? [it.image] : [''])
            }))
          : [{ day: 1, title: '', description: '', images: [''] }]
      );
      setPkgIncluded(pkg.included && pkg.included.length > 0 ? pkg.included : ['']);
      setPkgExcluded(pkg.excluded && pkg.excluded.length > 0 ? pkg.excluded : ['']);
    } else {
      setEditingPackageId(null);
      setPkgTitle('');
      setPkgDescription('');
      setPkgPrice('');
      setPkgDuration('');
      setPkgDestination('');
      setPkgCategory('Standard');
      setPkgCapacity('15');
      setPkgSeasonality('All Seasons');
      setPkgImages(['']);
      setPkgItinerary([{ day: 1, title: '', description: '', images: [''] }]);
      setPkgIncluded(['']);
      setPkgExcluded(['']);
    }
    setPackageModalOpen(true);
  };

  // Save Package Handler
  const handleSavePackage = async (e) => {
    e.preventDefault();
    if (!pkgTitle.trim() || !pkgDescription.trim() || !pkgPrice.trim() || !pkgDuration.trim() || !pkgDestination.trim()) {
      showToast('Please fill in all required package fields', 'error');
      return;
    }

    const payload = {
      title: pkgTitle,
      description: pkgDescription,
      price: Number(pkgPrice),
      duration: pkgDuration,
      destination: pkgDestination,
      category: pkgCategory,
      capacity: Number(pkgCapacity || 15),
      seasonality: pkgSeasonality,
      images: pkgImages.filter((img) => img.trim() !== ''),
      itinerary: pkgItinerary
        .filter((it) => it.title.trim() !== '' || it.description.trim() !== '')
        .map((it) => ({
          day: it.day,
          title: it.title,
          description: it.description,
          images: (it.images || []).filter((img) => img.trim() !== '')
        })),
      included: pkgIncluded.filter((inc) => inc.trim() !== ''),
      excluded: pkgExcluded.filter((exc) => exc.trim() !== '')
    };

    try {
      if (editingPackageId) {
        await updatePackage(editingPackageId, payload);
        showToast('Package updated successfully!', 'success');
      } else {
        await createPackage(payload);
        showToast('Package created successfully!', 'success');
      }
      setPackageModalOpen(false);
      loadData();
    } catch (err) {
      console.error(err);
      showToast('Error saving package', 'error');
    }
  };

  const handleDeletePackage = async (id) => {
    if (!window.confirm('Are you sure you want to delete this package?')) return;
    try {
      await deletePackage(id);
      showToast('Package deleted successfully', 'success');
      loadData();
    } catch (err) {
      console.error(err);
      showToast('Error deleting package', 'error');
    }
  };

  // Inquiry Status & Details Update Handler
  const handleUpdateInquiry = async (id, status, paymentStatus, notes) => {
    try {
      await updateInquiryStatus(id, { status, paymentStatus, notes });
      showToast('Inquiry updated successfully!', 'success');
      loadData();
    } catch (err) {
      console.error(err);
      showToast('Error updating inquiry status', 'error');
    }
  };

  const handleDeleteInquiry = async (id) => {
    if (!window.confirm('Are you sure you want to delete this inquiry?')) return;
    try {
      await deleteInquiry(id);
      showToast('Inquiry deleted successfully', 'success');
      loadData();
    } catch (err) {
      console.error(err);
      showToast('Error deleting inquiry', 'error');
    }
  };

  // Destination CRUD Handlers
  const handleSaveDestination = async (e) => {
    e.preventDefault();
    if (!destName.trim() || !destImage.trim() || !destDesc.trim() || !destBestTime.trim()) {
      showToast('Please fill in all destination fields', 'error');
      return;
    }

    const payload = {
      name: destName,
      image: destImage,
      description: destDesc,
      bestTimeToVisit: destBestTime
    };

    try {
      if (editingDestId) {
        await updateDestination(editingDestId, payload);
        showToast('Destination updated successfully!', 'success');
      } else {
        await createDestination(payload);
        showToast('Destination added successfully!', 'success');
      }
      setDestName('');
      setDestImage('');
      setDestDesc('');
      setDestBestTime('');
      setEditingDestId(null);
      loadData();
    } catch (err) {
      console.error(err);
      showToast('Error saving destination', 'error');
    }
  };

  const handleEditDestination = (dest) => {
    setEditingDestId(dest._id);
    setDestName(dest.name);
    setDestImage(dest.image);
    setDestDesc(dest.description);
    setDestBestTime(dest.bestTimeToVisit);
  };

  const handleDeleteDestination = async (id) => {
    if (!window.confirm('Are you sure you want to delete this destination?')) return;
    try {
      await deleteDestination(id);
      showToast('Destination deleted successfully', 'success');
      loadData();
    } catch (err) {
      console.error(err);
      showToast('Error deleting destination', 'error');
    }
  };

  // Review Moderate Handlers
  const handleToggleReviewApprove = async (review) => {
    try {
      await updateReview(review._id, { approved: !review.approved });
      showToast(`Review ${!review.approved ? 'approved' : 'hidden'}`, 'success');
      loadData();
    } catch (err) {
      console.error(err);
      showToast('Error updating review status', 'error');
    }
  };

  const handleDeleteReview = async (id) => {
    if (!window.confirm('Delete this review?')) return;
    try {
      await deleteReview(id);
      showToast('Review deleted', 'success');
      loadData();
    } catch (err) {
      console.error(err);
      showToast('Error deleting review', 'error');
    }
  };

  if (loading) {
    return <Spinner fullPage={true} />;
  }

  // Admin Login View
  if (!isAdmin) {
    return (
      <div className="container section" style={{ minHeight: 'calc(100vh - 200px)', display: 'flex', alignItems: 'center', justifyContent: 'center' }}>
        <div style={{ background: 'var(--white)', padding: '40px', borderRadius: 'var(--radius-md)', boxShadow: 'var(--shadow-lg)', maxWidth: '420px', width: '100%', border: '1px solid var(--border)' }}>
          <h2 style={{ textAlign: 'center', marginBottom: '8px', fontWeight: 800 }}>Admin Login</h2>
          <p style={{ textAlign: 'center', color: 'var(--medium)', fontSize: '0.9rem', marginBottom: '24px' }}>
            Access Travmitra Agency Management Console
          </p>
          <form onSubmit={handleLogin}>
            <div className="form-group">
              <label>Username</label>
              <input
                type="text"
                className="form-control"
                value={username}
                onChange={(e) => setUsername(e.target.value)}
                placeholder="Enter admin username"
                required
              />
            </div>
            <div className="form-group">
              <label>Password</label>
              <input
                type="password"
                className="form-control"
                value={password}
                onChange={(e) => setPassword(e.target.value)}
                placeholder="Enter password"
                required
              />
            </div>
            <Button type="submit" variant="primary" style={{ width: '100%', marginTop: '10px' }} disabled={loginLoading}>
              {loginLoading ? 'Authenticating...' : 'Sign In to Dashboard'}
            </Button>
          </form>
        </div>
      </div>
    );
  }

  // Analytics KPI Computations
  const totalRevenue = inquiries
    .filter((inq) => inq.status === 'Booked' || inq.paymentStatus === 'Paid')
    .reduce((sum, inq) => sum + (inq.packageId?.price || 25000), 0);

  const bookedCount = inquiries.filter((inq) => inq.status === 'Booked').length;
  const pendingInquiriesCount = inquiries.filter((inq) => inq.status === 'Pending').length;
  const totalInquiriesCount = inquiries.length || 1;
  const conversionRate = Math.round((bookedCount / totalInquiriesCount) * 100);

  // Filtered Datasets
  const filteredPackages = packages.filter(
    (pkg) =>
      pkg.title.toLowerCase().includes(searchTerm.toLowerCase()) ||
      pkg.destination.toLowerCase().includes(searchTerm.toLowerCase())
  );

  const filteredInquiries = inquiries.filter((inq) => {
    const matchesSearch =
      inq.name.toLowerCase().includes(searchTerm.toLowerCase()) ||
      inq.email.toLowerCase().includes(searchTerm.toLowerCase()) ||
      inq.phone.includes(searchTerm);
    const matchesStatus = !statusFilter || inq.status === statusFilter;
    return matchesSearch && matchesStatus;
  });

  return (
    <div className="container section">
      {/* Top Header */}
      <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: '25px', flexWrap: 'wrap', gap: '15px' }}>
        <div>
          <h1 className="section-title" style={{ textAlign: 'left', marginBottom: '4px' }}>Agency Management Console</h1>
          <p style={{ color: 'var(--medium)', margin: 0, fontSize: '0.9rem' }}>Welcome back, Administrator. Real-time control panel.</p>
        </div>
        <div style={{ display: 'flex', gap: '10px' }}>
          <Button variant="outline" size="sm" onClick={() => exportToCSV(inquiries, 'Travmitra_Inquiries')}>
            📥 Export CSV
          </Button>
          <Button variant="outline" size="sm" onClick={handleLogout}>
            Sign Out
          </Button>
        </div>
      </div>

      {/* Navigation Tabs */}
      <div style={{ display: 'flex', gap: '10px', borderBottom: '2px solid var(--border)', marginBottom: '30px', overflowX: 'auto', paddingBottom: '2px' }}>
        <button
          className={`tab-btn ${activeTab === 'overview' ? 'active' : ''}`}
          onClick={() => { setActiveTab('overview'); setSearchTerm(''); }}
          style={{ padding: '10px 18px', fontWeight: 700, border: 'none', background: 'none', cursor: 'pointer', borderBottom: activeTab === 'overview' ? '3px solid var(--primary)' : 'none', color: activeTab === 'overview' ? 'var(--primary)' : 'var(--medium)' }}
        >
          📊 Overview & KPIs
        </button>
        <button
          className={`tab-btn ${activeTab === 'packages' ? 'active' : ''}`}
          onClick={() => { setActiveTab('packages'); setSearchTerm(''); }}
          style={{ padding: '10px 18px', fontWeight: 700, border: 'none', background: 'none', cursor: 'pointer', borderBottom: activeTab === 'packages' ? '3px solid var(--primary)' : 'none', color: activeTab === 'packages' ? 'var(--primary)' : 'var(--medium)' }}
        >
          🧳 Tour Packages ({packages.length})
        </button>
        <button
          className={`tab-btn ${activeTab === 'inquiries' ? 'active' : ''}`}
          onClick={() => { setActiveTab('inquiries'); setSearchTerm(''); }}
          style={{ padding: '10px 18px', fontWeight: 700, border: 'none', background: 'none', cursor: 'pointer', borderBottom: activeTab === 'inquiries' ? '3px solid var(--primary)' : 'none', color: activeTab === 'inquiries' ? 'var(--primary)' : 'var(--medium)' }}
        >
          📩 Lead Pipeline ({inquiries.length})
        </button>
        <button
          className={`tab-btn ${activeTab === 'destinations' ? 'active' : ''}`}
          onClick={() => { setActiveTab('destinations'); setSearchTerm(''); }}
          style={{ padding: '10px 18px', fontWeight: 700, border: 'none', background: 'none', cursor: 'pointer', borderBottom: activeTab === 'destinations' ? '3px solid var(--primary)' : 'none', color: activeTab === 'destinations' ? 'var(--primary)' : 'var(--medium)' }}
        >
          🗺️ Destinations ({destinations.length})
        </button>
        <button
          className={`tab-btn ${activeTab === 'reviews' ? 'active' : ''}`}
          onClick={() => { setActiveTab('reviews'); setSearchTerm(''); }}
          style={{ padding: '10px 18px', fontWeight: 700, border: 'none', background: 'none', cursor: 'pointer', borderBottom: activeTab === 'reviews' ? '3px solid var(--primary)' : 'none', color: activeTab === 'reviews' ? 'var(--primary)' : 'var(--medium)' }}
        >
          ⭐ Reviews & Testimonials
        </button>
        <button
          className={`tab-btn ${activeTab === 'activity' ? 'active' : ''}`}
          onClick={() => { setActiveTab('activity'); setSearchTerm(''); }}
          style={{ padding: '10px 18px', fontWeight: 700, border: 'none', background: 'none', cursor: 'pointer', borderBottom: activeTab === 'activity' ? '3px solid var(--primary)' : 'none', color: activeTab === 'activity' ? 'var(--primary)' : 'var(--medium)' }}
        >
          ⚙️ Activity Log & System
        </button>
      </div>

      {/* TAB 1: OVERVIEW & ANALYTICS */}
      {activeTab === 'overview' && (
        <div>
          {/* KPI Metrics Cards */}
          <div className="admin-kpi-grid">
            <div className="kpi-card">
              <div className="kpi-icon kpi-icon-green">₹</div>
              <div className="kpi-info">
                <span className="kpi-label">Confirmed Revenue</span>
                <span className="kpi-value">₹{totalRevenue.toLocaleString('en-IN')}</span>
                <span className="kpi-subtext">↑ 18% from last month</span>
              </div>
            </div>

            <div className="kpi-card">
              <div className="kpi-icon kpi-icon-blue">📩</div>
              <div className="kpi-info">
                <span className="kpi-label">Active Inquiries</span>
                <span className="kpi-value">{inquiries.length}</span>
                <span className="kpi-subtext">{pendingInquiriesCount} Pending Follow-up</span>
              </div>
            </div>

            <div className="kpi-card">
              <div className="kpi-icon kpi-icon-purple">🧳</div>
              <div className="kpi-info">
                <span className="kpi-label">Listed Tour Packages</span>
                <span className="kpi-value">{packages.length}</span>
                <span className="kpi-subtext">Across {destinations.length} destinations</span>
              </div>
            </div>

            <div className="kpi-card">
              <div className="kpi-icon kpi-icon-amber">📈</div>
              <div className="kpi-info">
                <span className="kpi-label">Conversion Rate</span>
                <span className="kpi-value">{conversionRate}%</span>
                <span className="kpi-subtext">{bookedCount} Booked Leads</span>
              </div>
            </div>
          </div>

          {/* Visual Progress & Performance Charts */}
          <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fit, minmax(320px, 1fr))', gap: '25px' }}>
            <div style={{ background: 'var(--white)', padding: '25px', borderRadius: 'var(--radius-md)', border: '1px solid var(--border)' }}>
              <h3 style={{ fontSize: '1.1rem', fontWeight: 700, marginBottom: '20px' }}>Inquiry Lead Breakdown</h3>
              <div className="perf-bar-group">
                <div className="perf-bar-label">
                  <span>Pending Leads</span>
                  <span>{inquiries.filter((i) => i.status === 'Pending').length}</span>
                </div>
                <div className="perf-bar-track">
                  <div className="perf-bar-fill" style={{ width: `${(inquiries.filter((i) => i.status === 'Pending').length / totalInquiriesCount) * 100}%`, backgroundColor: '#f59e0b' }}></div>
                </div>
              </div>

              <div className="perf-bar-group">
                <div className="perf-bar-label">
                  <span>Contacted Leads</span>
                  <span>{inquiries.filter((i) => i.status === 'Contacted').length}</span>
                </div>
                <div className="perf-bar-track">
                  <div className="perf-bar-fill" style={{ width: `${(inquiries.filter((i) => i.status === 'Contacted').length / totalInquiriesCount) * 100}%`, backgroundColor: '#3b82f6' }}></div>
                </div>
              </div>

              <div className="perf-bar-group">
                <div className="perf-bar-label">
                  <span>Confirmed Bookings</span>
                  <span>{bookedCount}</span>
                </div>
                <div className="perf-bar-track">
                  <div className="perf-bar-fill" style={{ width: `${(bookedCount / totalInquiriesCount) * 100}%`, backgroundColor: '#10b981' }}></div>
                </div>
              </div>
            </div>

            <div style={{ background: 'var(--white)', padding: '25px', borderRadius: 'var(--radius-md)', border: '1px solid var(--border)' }}>
              <h3 style={{ fontSize: '1.1rem', fontWeight: 700, marginBottom: '20px' }}>Package Tier Distribution</h3>
              {['Standard', 'Deluxe', 'Luxury'].map((cat) => {
                const count = packages.filter((p) => (p.category || 'Standard') === cat).length;
                const pct = packages.length ? Math.round((count / packages.length) * 100) : 0;
                return (
                  <div key={cat} className="perf-bar-group">
                    <div className="perf-bar-label">
                      <span>{cat} Tier</span>
                      <span>{count} packages ({pct}%)</span>
                    </div>
                    <div className="perf-bar-track">
                      <div className="perf-bar-fill" style={{ width: `${pct}%`, backgroundColor: cat === 'Luxury' ? '#8b5cf6' : cat === 'Deluxe' ? '#3b82f6' : '#10b981' }}></div>
                    </div>
                  </div>
                );
              })}
            </div>
          </div>
        </div>
      )}

      {/* TAB 2: PACKAGES MANAGEMENT */}
      {activeTab === 'packages' && (
        <div>
          <div className="admin-toolbar">
            <div className="search-input-wrap">
              <svg width="18" height="18" fill="none" stroke="currentColor" strokeWidth="2" viewBox="0 0 24 24">
                <path d="M21 21l-6-6m2-5a7 7 0 11-14 0 7 7 0 0114 0z" />
              </svg>
              <input
                type="text"
                className="form-control"
                placeholder="Search packages by title or destination..."
                value={searchTerm}
                onChange={(e) => setSearchTerm(e.target.value)}
              />
            </div>
            <Button variant="primary" onClick={() => openPackageModal()}>
              + Create Tour Package
            </Button>
          </div>

          <div style={{ overflowX: 'auto' }}>
            <table className="admin-table">
              <thead>
                <tr>
                  <th>Package Title</th>
                  <th>Category</th>
                  <th>Destination</th>
                  <th>Duration</th>
                  <th>Price</th>
                  <th>Capacity</th>
                  <th>Actions</th>
                </tr>
              </thead>
              <tbody>
                {filteredPackages.map((pkg) => (
                  <tr key={pkg._id}>
                    <td>
                      <div style={{ fontWeight: 700 }}>{pkg.title}</div>
                    </td>
                    <td>
                      <span className={`badge-category badge-category-${(pkg.category || 'Standard').toLowerCase()}`}>
                        {pkg.category || 'Standard'}
                      </span>
                    </td>
                    <td>{pkg.destination}</td>
                    <td>{pkg.duration}</td>
                    <td>₹{pkg.price.toLocaleString('en-IN')}</td>
                    <td>{pkg.capacity || 15} Guests</td>
                    <td>
                      <div style={{ display: 'flex', gap: '8px' }}>
                        <Button variant="outline" size="sm" onClick={() => openPackageModal(pkg)}>
                          Edit
                        </Button>
                        <Button variant="danger" size="sm" onClick={() => handleDeletePackage(pkg._id)}>
                          Delete
                        </Button>
                      </div>
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        </div>
      )}

      {/* TAB 3: INQUIRIES & LEAD PIPELINE */}
      {activeTab === 'inquiries' && (
        <div>
          <div className="admin-toolbar">
            <div className="search-input-wrap">
              <svg width="18" height="18" fill="none" stroke="currentColor" strokeWidth="2" viewBox="0 0 24 24">
                <path d="M21 21l-6-6m2-5a7 7 0 11-14 0 7 7 0 0114 0z" />
              </svg>
              <input
                type="text"
                className="form-control"
                placeholder="Search customer leads by name, email, phone..."
                value={searchTerm}
                onChange={(e) => setSearchTerm(e.target.value)}
              />
            </div>
            <select
              className="filter-input"
              style={{ maxWidth: '200px' }}
              value={statusFilter}
              onChange={(e) => setStatusFilter(e.target.value)}
            >
              <option value="">All Statuses</option>
              <option value="Pending">Pending</option>
              <option value="Contacted">Contacted</option>
              <option value="Booked">Booked</option>
              <option value="Cancelled">Cancelled</option>
            </select>
          </div>

          <div style={{ overflowX: 'auto' }}>
            <table className="admin-table">
              <thead>
                <tr>
                  <th>Customer Info</th>
                  <th>Interested Package</th>
                  <th>Status</th>
                  <th>Payment</th>
                  <th>Message & Notes</th>
                  <th>Actions</th>
                </tr>
              </thead>
              <tbody>
                {filteredInquiries.map((inq) => (
                  <tr key={inq._id}>
                    <td>
                      <div style={{ fontWeight: 700 }}>{inq.name}</div>
                      <div style={{ fontSize: '0.8rem', color: 'var(--medium)' }}>{inq.email}</div>
                      <div style={{ fontSize: '0.8rem', color: 'var(--medium)' }}>{inq.phone}</div>
                    </td>
                    <td>
                      <div style={{ fontWeight: 600, fontSize: '0.9rem' }}>{inq.packageId?.title || 'General Tour Inquiry'}</div>
                      <div style={{ fontSize: '0.8rem', color: 'var(--primary)' }}>
                        ₹{inq.packageId?.price ? inq.packageId.price.toLocaleString('en-IN') : 'N/A'}
                      </div>
                    </td>
                    <td>
                      <select
                        className="form-control"
                        style={{ fontSize: '0.8rem', padding: '4px 8px', width: 'auto' }}
                        value={inq.status || 'Pending'}
                        onChange={(e) => handleUpdateInquiry(inq._id, e.target.value, inq.paymentStatus, inq.notes)}
                      >
                        <option value="Pending">Pending</option>
                        <option value="Contacted">Contacted</option>
                        <option value="Booked">Booked</option>
                        <option value="Cancelled">Cancelled</option>
                      </select>
                    </td>
                    <td>
                      <select
                        className="form-control"
                        style={{ fontSize: '0.8rem', padding: '4px 8px', width: 'auto' }}
                        value={inq.paymentStatus || 'Pending'}
                        onChange={(e) => handleUpdateInquiry(inq._id, inq.status, e.target.value, inq.notes)}
                      >
                        <option value="Pending">Unpaid</option>
                        <option value="Partial">Partial</option>
                        <option value="Paid">Paid Full</option>
                      </select>
                    </td>
                    <td style={{ maxWidth: '250px' }}>
                      <p style={{ margin: 0, fontSize: '0.85rem' }}>"{inq.message}"</p>
                      {inq.notes && (
                        <div style={{ fontSize: '0.75rem', color: 'var(--secondary)', marginTop: '4px', fontStyle: 'italic' }}>
                          Note: {inq.notes}
                        </div>
                      )}
                    </td>
                    <td>
                      <div style={{ display: 'flex', gap: '6px', flexDirection: 'column' }}>
                        <Button variant="outline" size="sm" onClick={() => setSelectedVoucher(inq)}>
                          🖨️ Voucher
                        </Button>
                        <Button variant="danger" size="sm" onClick={() => handleDeleteInquiry(inq._id)}>
                          Delete
                        </Button>
                      </div>
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        </div>
      )}

      {/* TAB 4: DESTINATIONS */}
      {activeTab === 'destinations' && (
        <div style={{ display: 'grid', gridTemplateColumns: '1fr 2fr', gap: '30px' }}>
          <div style={{ background: 'var(--white)', padding: '25px', borderRadius: 'var(--radius-md)', border: '1px solid var(--border)' }}>
            <h3 style={{ fontSize: '1.2rem', fontWeight: 700, marginBottom: '18px' }}>
              {editingDestId ? 'Edit Destination' : 'Add New Destination'}
            </h3>
            <form onSubmit={handleSaveDestination}>
              <div className="form-group">
                <label>Destination Name</label>
                <input
                  type="text"
                  className="form-control"
                  value={destName}
                  onChange={(e) => setDestName(e.target.value)}
                  placeholder="e.g. Manali, Himachal"
                  required
                />
              </div>
              <div className="form-group">
                <label>Image URL</label>
                <input
                  type="text"
                  className="form-control"
                  value={destImage}
                  onChange={(e) => setDestImage(e.target.value)}
                  placeholder="https://..."
                  required
                />
              </div>
              <div className="form-group">
                <label>Best Time to Visit</label>
                <input
                  type="text"
                  className="form-control"
                  value={destBestTime}
                  onChange={(e) => setDestBestTime(e.target.value)}
                  placeholder="e.g. October to March"
                  required
                />
              </div>
              <div className="form-group">
                <label>Description</label>
                <textarea
                  className="form-control"
                  value={destDesc}
                  onChange={(e) => setDestDesc(e.target.value)}
                  rows="3"
                  required
                ></textarea>
              </div>
              <Button type="submit" variant="primary" style={{ width: '100%' }}>
                {editingDestId ? 'Update Destination' : 'Add Destination'}
              </Button>
            </form>
          </div>

          <div>
            <table className="admin-table">
              <thead>
                <tr>
                  <th>Image</th>
                  <th>Name</th>
                  <th>Best Time</th>
                  <th>Actions</th>
                </tr>
              </thead>
              <tbody>
                {destinations.map((dest) => (
                  <tr key={dest._id}>
                    <td>
                      <img src={dest.image} alt={dest.name} style={{ width: '50px', height: '40px', objectFit: 'cover', borderRadius: '4px' }} />
                    </td>
                    <td style={{ fontWeight: 700 }}>{dest.name}</td>
                    <td>{dest.bestTimeToVisit}</td>
                    <td>
                      <div style={{ display: 'flex', gap: '8px' }}>
                        <Button variant="outline" size="sm" onClick={() => handleEditDestination(dest)}>
                          Edit
                        </Button>
                        <Button variant="danger" size="sm" onClick={() => handleDeleteDestination(dest._id)}>
                          Delete
                        </Button>
                      </div>
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        </div>
      )}

      {/* TAB 5: REVIEWS MODERATION */}
      {activeTab === 'reviews' && (
        <div>
          <h3 style={{ fontSize: '1.2rem', fontWeight: 700, marginBottom: '20px' }}>Customer Reviews & Ratings Moderation</h3>
          <table className="admin-table">
            <thead>
              <tr>
                <th>Customer</th>
                <th>Package Title</th>
                <th>Rating</th>
                <th>Comment</th>
                <th>Approved</th>
                <th>Actions</th>
              </tr>
            </thead>
            <tbody>
              {reviews.map((rev) => (
                <tr key={rev._id}>
                  <td style={{ fontWeight: 700 }}>{rev.customerName}</td>
                  <td>{rev.packageTitle}</td>
                  <td>{'⭐'.repeat(rev.rating || 5)}</td>
                  <td style={{ maxWidth: '300px' }}>"{rev.comment}"</td>
                  <td>
                    <span className={`badge-status ${rev.approved ? 'badge-status-booked' : 'badge-status-pending'}`}>
                      {rev.approved ? 'Approved' : 'Hidden'}
                    </span>
                  </td>
                  <td>
                    <div style={{ display: 'flex', gap: '8px' }}>
                      <Button variant="outline" size="sm" onClick={() => handleToggleReviewApprove(rev)}>
                        {rev.approved ? 'Hide' : 'Approve'}
                      </Button>
                      <Button variant="danger" size="sm" onClick={() => handleDeleteReview(rev._id)}>
                        Delete
                      </Button>
                    </div>
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      )}

      {/* TAB 6: ACTIVITY LOGS & SETTINGS */}
      {activeTab === 'activity' && (
        <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: '25px' }}>
          <div style={{ background: 'var(--white)', padding: '25px', borderRadius: 'var(--radius-md)', border: '1px solid var(--border)' }}>
            <h3 style={{ fontSize: '1.1rem', fontWeight: 700, marginBottom: '16px' }}>System Admin Profile</h3>
            <p style={{ color: 'var(--medium)', fontSize: '0.9rem' }}>Logged in as: <strong>Admin User</strong></p>
            <p style={{ color: 'var(--medium)', fontSize: '0.9rem' }}>Role: <strong>Super Administrator</strong></p>
            <p style={{ color: 'var(--medium)', fontSize: '0.9rem' }}>Session Token: <strong>Active (JWT Verified)</strong></p>
            <hr style={{ margin: '20px 0', borderTop: '1px solid var(--border)' }} />
            <h4 style={{ fontSize: '1rem', fontWeight: 700, marginBottom: '12px' }}>Database Maintenance</h4>
            <Button variant="outline" size="sm" onClick={() => exportToCSV(packages, 'Travmitra_Packages')}>
              Export Packages CSV
            </Button>
          </div>

          <div style={{ background: 'var(--white)', padding: '25px', borderRadius: 'var(--radius-md)', border: '1px solid var(--border)' }}>
            <h3 style={{ fontSize: '1.1rem', fontWeight: 700, marginBottom: '16px' }}>Admin Activity Audit Stream</h3>
            {activityLogs.length > 0 ? (
              <div style={{ display: 'flex', flexDirection: 'column', gap: '12px' }}>
                {activityLogs.map((log) => (
                  <div key={log._id} style={{ borderLeft: '3px solid var(--primary)', paddingLeft: '12px' }}>
                    <div style={{ fontWeight: 600, fontSize: '0.85rem' }}>{log.action}</div>
                    <div style={{ fontSize: '0.8rem', color: 'var(--medium)' }}>{log.details}</div>
                    <div style={{ fontSize: '0.7rem', color: 'var(--light-gray)', marginTop: '2px' }}>
                      {new Date(log.createdAt).toLocaleString()}
                    </div>
                  </div>
                ))}
              </div>
            ) : (
              <p style={{ color: 'var(--medium)', fontSize: '0.85rem' }}>No recent audit activity recorded.</p>
            )}
          </div>
        </div>
      )}

      {/* CREATE / EDIT PACKAGE MODAL */}
      {packageModalOpen && (
        <div className="admin-modal-overlay">
          <div className="admin-modal-content">
            <div className="admin-modal-header">
              <h3>{editingPackageId ? 'Edit Tour Package' : 'Create New Package'}</h3>
              <button className="close-btn" onClick={() => setPackageModalOpen(false)}>&times;</button>
            </div>

            <form onSubmit={handleSavePackage}>
              <div className="admin-modal-body">
                <div className="form-group">
                  <label>Package Title</label>
                  <input
                    type="text"
                    className="form-control"
                    value={pkgTitle}
                    onChange={(e) => setPkgTitle(e.target.value)}
                    placeholder="e.g. Exotic Goa Beach Gateway"
                    required
                  />
                </div>

                <div className="form-group">
                  <label>Package Category / Tier</label>
                  <select
                    className="form-control"
                    value={pkgCategory}
                    onChange={(e) => setPkgCategory(e.target.value)}
                  >
                    <option value="Standard">Standard Tier</option>
                    <option value="Deluxe">Deluxe Tier</option>
                    <option value="Luxury">Luxury Tier</option>
                  </select>
                </div>

                <div className="filters-grid" style={{ gridTemplateColumns: '1fr 1fr 1fr', gap: '15px' }}>
                  <div className="form-group">
                    <label>Price (₹)</label>
                    <input
                      type="number"
                      className="form-control"
                      value={pkgPrice}
                      onChange={(e) => setPkgPrice(e.target.value)}
                      placeholder="15000"
                      required
                    />
                  </div>
                  <div className="form-group">
                    <label>Duration</label>
                    <input
                      type="text"
                      className="form-control"
                      value={pkgDuration}
                      onChange={(e) => setPkgDuration(e.target.value)}
                      placeholder="5 Days / 4 Nights"
                      required
                    />
                  </div>
                  <div className="form-group">
                    <label>Destination</label>
                    <input
                      type="text"
                      className="form-control"
                      value={pkgDestination}
                      onChange={(e) => setPkgDestination(e.target.value)}
                      placeholder="Goa"
                      required
                    />
                  </div>
                </div>

                {/* Itinerary Day Planning with Multi-Images */}
                <div className="form-group" style={{ marginTop: '15px' }}>
                  <label style={{ fontWeight: 700 }}>Day-Wise Itinerary Planning</label>
                  <div style={{ display: 'flex', flexDirection: 'column', gap: '15px', marginTop: '8px' }}>
                    {pkgItinerary.map((item, index) => (
                      <div key={index} style={{ border: '1px solid var(--border)', padding: '15px', borderRadius: 'var(--radius-sm)', position: 'relative' }}>
                        <span style={{ fontWeight: '700', fontSize: '0.85rem', color: 'var(--primary)' }}>Day {item.day}</span>
                        {pkgItinerary.length > 1 && (
                          <button
                            type="button"
                            className="close-btn"
                            style={{ position: 'absolute', top: '10px', right: '15px', fontSize: '1.2rem' }}
                            onClick={() => handleRemoveItineraryDay(index)}
                          >
                            &times;
                          </button>
                        )}
                        <div className="form-group" style={{ marginTop: '8px' }}>
                          <input
                            type="text"
                            className="form-control"
                            value={item.title}
                            onChange={(e) => handleItineraryChange(index, 'title', e.target.value)}
                            placeholder="Day Title (e.g. Arrival & Sunset Beach Cruise)"
                          />
                        </div>

                        <div className="form-group" style={{ marginTop: '10px' }}>
                          <label style={{ fontSize: '0.8rem', fontWeight: 600, color: 'var(--dark)' }}>Day Images (Optional)</label>
                          <div style={{ display: 'flex', flexDirection: 'column', gap: '8px', marginTop: '4px' }}>
                            {(item.images || ['']).map((imgUrl, imgIdx) => (
                              <div key={imgIdx} style={{ display: 'flex', gap: '8px', alignItems: 'center' }}>
                                <input
                                  type="text"
                                  className="form-control"
                                  value={imgUrl}
                                  onChange={(e) => handleItineraryDayImageChange(index, imgIdx, e.target.value)}
                                  placeholder="Image URL (e.g. https://...)"
                                />
                                {(item.images || []).length > 1 && (
                                  <Button
                                    type="button"
                                    variant="danger"
                                    size="sm"
                                    onClick={() => handleRemoveItineraryDayImage(index, imgIdx)}
                                  >
                                    &times;
                                  </Button>
                                )}
                              </div>
                            ))}
                          </div>
                          <Button
                            type="button"
                            variant="outline"
                            size="sm"
                            onClick={() => handleAddItineraryDayImage(index)}
                            style={{ marginTop: '6px', fontSize: '0.75rem', padding: '3px 10px' }}
                          >
                            + Add Image to Day {item.day}
                          </Button>
                        </div>

                        <div className="form-group" style={{ marginBottom: 0, marginTop: '10px' }}>
                          <textarea
                            className="form-control"
                            value={item.description}
                            onChange={(e) => handleItineraryChange(index, 'description', e.target.value)}
                            placeholder="Detailed description of activities for this day..."
                            style={{ minHeight: '60px' }}
                          ></textarea>
                        </div>
                      </div>
                    ))}
                  </div>
                  <Button variant="outline" size="sm" onClick={handleAddItineraryDay} style={{ marginTop: '10px' }}>
                    + Add Itinerary Day
                  </Button>
                </div>
              </div>

              <div className="admin-modal-footer">
                <Button variant="outline" onClick={() => setPackageModalOpen(false)}>
                  Cancel
                </Button>
                <Button type="submit" variant="primary">
                  Save Package
                </Button>
              </div>
            </form>
          </div>
        </div>
      )}

      {/* PRINTABLE BOOKING VOUCHER MODAL */}
      {selectedVoucher && (
        <div className="voucher-overlay">
          <div className="voucher-box">
            <div className="voucher-header">
              <div>
                <div className="voucher-title">TRAVMITRA TRAVELS</div>
                <div className="voucher-sub">Official Travel Confirmation & Booking Voucher</div>
              </div>
              <div style={{ textAlign: 'right' }}>
                <div style={{ fontSize: '0.8rem', fontWeight: 700 }}>VOUCHER NO:</div>
                <div style={{ fontSize: '1rem', color: 'var(--primary)', fontWeight: 800 }}>#TVM-{selectedVoucher._id.slice(0, 6).toUpperCase()}</div>
              </div>
            </div>

            <div className="voucher-section">
              <h4 style={{ fontSize: '1rem', fontWeight: 700, marginBottom: '8px' }}>Customer Information</h4>
              <table className="voucher-table">
                <tbody>
                  <tr>
                    <th>Lead Traveler</th>
                    <td>{selectedVoucher.name}</td>
                    <th>Phone</th>
                    <td>{selectedVoucher.phone}</td>
                  </tr>
                  <tr>
                    <th>Email Address</th>
                    <td>{selectedVoucher.email}</td>
                    <th>Booking Status</th>
                    <td><strong style={{ color: '#059669' }}>{selectedVoucher.status || 'Confirmed'}</strong></td>
                  </tr>
                </tbody>
              </table>
            </div>

            <div className="voucher-section">
              <h4 style={{ fontSize: '1rem', fontWeight: 700, marginBottom: '8px' }}>Package & Service Details</h4>
              <table className="voucher-table">
                <tbody>
                  <tr>
                    <th>Package Title</th>
                    <td>{selectedVoucher.packageId?.title || 'Custom Tour Package'}</td>
                  </tr>
                  <tr>
                    <th>Destination</th>
                    <td>{selectedVoucher.packageId?.destination || 'India'}</td>
                  </tr>
                  <tr>
                    <th>Price Estimate</th>
                    <td>₹{selectedVoucher.packageId?.price ? selectedVoucher.packageId.price.toLocaleString('en-IN') : 'N/A'}</td>
                  </tr>
                </tbody>
              </table>
            </div>

            <div style={{ marginTop: '30px', display: 'flex', justifyContent: 'space-between', alignItems: 'center' }} className="no-print">
              <Button variant="outline" onClick={() => setSelectedVoucher(null)}>
                Close
              </Button>
              <Button variant="primary" onClick={() => window.print()}>
                🖨️ Print / Download Voucher PDF
              </Button>
            </div>
          </div>
        </div>
      )}
    </div>
  );
};

export default AdminDashboard;
