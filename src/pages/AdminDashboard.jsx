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

const defaultEnquiriesList = [
  { _id: 'enq-1', name: 'Riya Sharma', contact: '+91 98xxx · riya@...', interest: 'Meghalaya Highlights', pax: 2, assigned: '—', status: 'New', date: 'Today', email: 'riya@example.com', phone: '+91 9876543210' },
  { _id: 'enq-2', name: 'Amit Das', contact: '+91 97xxx · amit@...', interest: 'Kaziranga Safari', pax: 4, assigned: 'Tapan', status: 'In progress', date: 'Yesterday', email: 'amit@example.com', phone: '+91 9765432109' },
  { _id: 'enq-3', name: 'Priya Nair', contact: '+91 96xxx · priya@...', interest: 'Tawang Circuit · Deluxe', pax: 2, assigned: 'Chandra', status: 'Quoted', date: '2 Aug', email: 'priya@example.com', phone: '+91 9654321098' },
  { _id: 'enq-4', name: 'Rahul Mehta', contact: '+91 95xxx · rahul@...', interest: 'Custom · Assam + Meghalaya', pax: 6, assigned: '—', status: 'New', date: '2 Aug', email: 'rahul@example.com', phone: '+91 9543210987' },
  { _id: 'enq-5', name: 'Neha Gupta', contact: '+91 94xxx · neha@...', interest: 'Meghalaya · Luxury', pax: 2, assigned: 'Tapan', status: 'Confirmed', date: '28 Jul', email: 'neha@example.com', phone: '+91 9432109876' }
];

const defaultPackagesList = [
  { _id: 'meghalaya-1', title: 'Meghalaya Highlights', destination: 'Meghalaya', duration: '5D / 4N', standard: '₹18,900', deluxe: '₹24,900', luxury: '₹34,900', status: 'Published', price: 18900, image: 'https://images.unsplash.com/photo-1582510003544-4d00b7f74220?w=100&q=60' },
  { _id: 'assam-1', title: 'Kaziranga Safari', destination: 'Assam', duration: '3D / 2N', standard: '₹12,500', deluxe: '₹16,900', luxury: '₹22,500', status: 'Published', price: 12500, image: 'https://images.unsplash.com/photo-1566073771259-6a8506099945?w=100&q=60' },
  { _id: 'arunachal-1', title: 'Tawang Circuit', destination: 'Arunachal', duration: '7D / 6N', standard: '₹34,900', deluxe: '₹42,900', luxury: '₹55,900', status: 'Published', price: 34900, image: 'https://images.unsplash.com/photo-1544735716-392fe2489ffa?w=100&q=60' },
  { _id: 'sikkim-1', title: 'Sikkim Essentials', destination: 'Sikkim', duration: '6D / 5N', standard: '₹28,500', deluxe: '—', luxury: '—', status: 'Draft', price: 28500, image: 'https://images.unsplash.com/photo-1506905925346-21bda4d32df4?w=100&q=60' }
];

const defaultDestinationsList = [
  { _id: 'dest-1', name: 'Meghalaya', bestTimeToVisit: 'Oct – May', packagesCount: '1 package', status: 'Live' },
  { _id: 'dest-2', name: 'Assam', bestTimeToVisit: 'Nov – Apr', packagesCount: '1 package', status: 'Live' },
  { _id: 'dest-3', name: 'Arunachal Pradesh', bestTimeToVisit: 'Mar–Jun, Sep–Nov', packagesCount: '1 package', status: 'Live' },
  { _id: 'dest-4', name: 'Sikkim', bestTimeToVisit: 'Mar–Jun, Sep–Nov', packagesCount: '1 package', status: 'Live' }
];

const AdminDashboard = () => {
  const { showToast } = useToast();
  const [isAdmin, setIsAdmin] = useState(false);
  const [loading, setLoading] = useState(true);
  const [activeTab, setActiveTab] = useState('dashboard');

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

  // Filters
  const [searchTerm, setSearchTerm] = useState('');
  const [statusFilter, setStatusFilter] = useState('');
  const [pkgFilter, setPkgFilter] = useState('');

  // Settings state
  const [settingsPhone, setSettingsPhone] = useState('+91 98765 43210');
  const [settingsEmail, setSettingsEmail] = useState('hello@travmitraa.com');
  const [settingsWhatsapp, setSettingsWhatsapp] = useState('919876543210');

  // Modal / Form States
  const [selectedVoucher, setSelectedVoucher] = useState(null);
  const [packageModalOpen, setPackageModalOpen] = useState(false);
  const [editingPackageId, setEditingPackageId] = useState(null);

  // Form Fields
  const [pkgTitle, setPkgTitle] = useState('');
  const [pkgDescription, setPkgDescription] = useState('');
  const [pkgPrice, setPkgPrice] = useState('');
  const [pkgDuration, setPkgDuration] = useState('');
  const [pkgDestination, setPkgDestination] = useState('');
  const [destName, setDestName] = useState('');
  const [destImage, setDestImage] = useState('');
  const [destDesc, setDestDesc] = useState('');
  const [destBestTime, setDestBestTime] = useState('');

  useEffect(() => {
    document.title = 'Admin – Travmitraa';
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
      const [pkgs, inqs, dests] = await Promise.all([
        getPackages().catch(() => []),
        getInquiries().catch(() => []),
        getDestinations().catch(() => [])
      ]);
      setPackages(pkgs.length > 0 ? pkgs : defaultPackagesList);
      setInquiries(inqs.length > 0 ? inqs : defaultEnquiriesList);
      setDestinations(dests.length > 0 ? dests : defaultDestinationsList);
      const revs = await getReviews().catch(() => []);
      setReviews(revs);
      const logs = await getActivityLogs().catch(() => []);
      setActivityLogs(logs);
    } catch (err) {
      console.error(err);
      setPackages(defaultPackagesList);
      setInquiries(defaultEnquiriesList);
      setDestinations(defaultDestinationsList);
    } finally {
      setDataLoading(false);
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

  const handleSavePackage = async (e) => {
    e.preventDefault();
    if (!pkgTitle.trim() || !pkgPrice.trim() || !pkgDuration.trim() || !pkgDestination.trim()) {
      showToast('Please fill in required package fields', 'error');
      return;
    }

    const payload = {
      title: pkgTitle,
      description: pkgDescription,
      price: Number(pkgPrice),
      duration: pkgDuration,
      destination: pkgDestination
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

  const handleSaveDestination = async (e) => {
    e.preventDefault();
    if (!destName.trim() || !destBestTime.trim()) {
      showToast('Please fill in destination fields', 'error');
      return;
    }

    try {
      await createDestination({ name: destName, bestTimeToVisit: destBestTime, description: destDesc, image: destImage });
      showToast('Destination added!', 'success');
      setDestName('');
      setDestBestTime('');
      setDestDesc('');
      setDestImage('');
      loadData();
    } catch (err) {
      console.error(err);
      showToast('Error adding destination', 'error');
    }
  };

  if (loading) {
    return <Spinner fullPage={true} />;
  }

  // Admin Login View
  if (!isAdmin) {
    return (
      <div style={{ minHeight: '100vh', display: 'flex', alignItems: 'center', justifyContent: 'center', background: 'var(--slate-50)' }}>
        <div style={{ background: 'var(--white)', padding: '2.5rem', borderRadius: 'var(--radius)', boxShadow: 'var(--shadow)', maxWidth: '400px', width: '90%' }}>
          <div style={{ textAlign: 'center', marginBottom: '1.5rem' }}>
            <h2 style={{ fontSize: '1.5rem', fontWeight: 700 }}>Admin Login</h2>
            <p style={{ fontSize: '0.875rem', color: 'var(--slate-500)', marginTop: '0.25rem' }}>Travmitraa Control Panel</p>
          </div>
          <form onSubmit={handleLogin}>
            <div style={{ marginBottom: '1.1rem' }}>
              <label style={{ display: 'block', fontSize: '0.85rem', fontWeight: 600, marginBottom: '0.35rem' }}>Username</label>
              <input
                type="text"
                className="form-control"
                style={{ width: '100%', padding: '0.6rem 0.8rem', borderRadius: '8px', border: '1px solid var(--slate-200)' }}
                value={username}
                onChange={(e) => setUsername(e.target.value)}
                placeholder="Enter username"
                required
              />
            </div>
            <div style={{ marginBottom: '1.25rem' }}>
              <label style={{ display: 'block', fontSize: '0.85rem', fontWeight: 600, marginBottom: '0.35rem' }}>Password</label>
              <input
                type="password"
                className="form-control"
                style={{ width: '100%', padding: '0.6rem 0.8rem', borderRadius: '8px', border: '1px solid var(--slate-200)' }}
                value={password}
                onChange={(e) => setPassword(e.target.value)}
                placeholder="Enter password"
                required
              />
            </div>
            <Button type="submit" variant="primary" style={{ width: '100%' }} disabled={loginLoading}>
              {loginLoading ? 'Authenticating...' : 'Sign In'}
            </Button>
          </form>
        </div>
      </div>
    );
  }

  const titleMap = {
    dashboard: 'Dashboard',
    enquiries: 'Enquiries',
    packages: 'Packages',
    destinations: 'Destinations',
    media: 'Media',
    settings: 'Settings'
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

  return (
    <div className="admin">
      {/* Sidebar */}
      <aside className="sidebar">
        <div className="sidebar-brand">
          <div className="logo"><span class="trav">Trav</span><span class="mitraa">mitraa</span></div>
          <small>Admin panel</small>
        </div>

        <div className="nav-section">Main</div>
        <ul className="side-nav">
          <li>
            <button className={activeTab === 'dashboard' ? 'active' : ''} onClick={() => setActiveTab('dashboard')}>
              Dashboard
            </button>
          </li>
          <li>
            <button className={activeTab === 'enquiries' ? 'active' : ''} onClick={() => setActiveTab('enquiries')}>
              Enquiries <span className="badge">{inquiries.length}</span>
            </button>
          </li>
          <li>
            <button className={activeTab === 'packages' ? 'active' : ''} onClick={() => setActiveTab('packages')}>
              Packages
            </button>
          </li>
          <li>
            <button className={activeTab === 'destinations' ? 'active' : ''} onClick={() => setActiveTab('destinations')}>
              Destinations
            </button>
          </li>
        </ul>

        <div className="nav-section">Content</div>
        <ul className="side-nav">
          <li>
            <button className={activeTab === 'media' ? 'active' : ''} onClick={() => setActiveTab('media')}>
              Media
            </button>
          </li>
          <li>
            <button className={activeTab === 'settings' ? 'active' : ''} onClick={() => setActiveTab('settings')}>
              Settings
            </button>
          </li>
        </ul>

        <div className="sidebar-user">
          <div className="avatar">TP</div>
          <div>
            <strong>Tapan Patar</strong>
            <span>Manager</span>
          </div>
        </div>
      </aside>

      {/* Main Content */}
      <div className="main">
        <header className="topbar">
          <h1>{titleMap[activeTab] || 'Admin'}</h1>
          <div className="topbar-actions">
            <Link to="/" className="btn btn-ghost btn-sm">View site</Link>
            <button className="btn btn-primary btn-sm" onClick={() => setPackageModalOpen(true)}>+ Add package</button>
            <button className="btn btn-ghost btn-sm" onClick={handleLogout}>Sign Out</button>
          </div>
        </header>

        <div className="content">
          {/* DASHBOARD TAB */}
          {activeTab === 'dashboard' && (
            <div>
              <div className="stats">
                <div className="stat-card">
                  <div className="stat-label">New enquiries</div>
                  <div className="stat-value">5</div>
                  <div className="stat-hint up">+2 today</div>
                </div>
                <div className="stat-card">
                  <div className="stat-label">Open leads</div>
                  <div className="stat-value">12</div>
                  <div className="stat-hint">In progress / quoted</div>
                </div>
                <div className="stat-card">
                  <div className="stat-label">Packages live</div>
                  <div className="stat-value">6</div>
                  <div className="stat-hint">3 with detail pages</div>
                </div>
                <div className="stat-card">
                  <div className="stat-label">Confirmed (month)</div>
                  <div className="stat-value">3</div>
                  <div className="stat-hint up">Meghalaya ×2, Kaziranga ×1</div>
                </div>
              </div>

              <div className="grid-2">
                <div className="panel">
                  <div className="panel-header">
                    <h2>Recent enquiries</h2>
                    <button className="btn btn-ghost btn-sm" onClick={() => setActiveTab('enquiries')}>View all</button>
                  </div>
                  <div className="panel-body">
                    <table>
                      <thead>
                        <tr>
                          <th>Name</th>
                          <th>Interest</th>
                          <th>Status</th>
                          <th>Date</th>
                        </tr>
                      </thead>
                      <tbody>
                        {inquiries.slice(0, 4).map((inq) => (
                          <tr key={inq._id}>
                            <td className="name-cell">
                              <strong>{inq.name}</strong>
                              <span>{inq.pax || 2} travellers</span>
                            </td>
                            <td>{inq.interest || inq.packageId?.title || 'North East Package'}</td>
                            <td><span className={`status ${getStatusBadgeClass(inq.status || 'New')}`}>{inq.status || 'New'}</span></td>
                            <td>{inq.date || 'Today'}</td>
                          </tr>
                        ))}
                      </tbody>
                    </table>
                  </div>
                </div>

                <div className="panel">
                  <div className="panel-header">
                    <h2>Live packages</h2>
                    <button className="btn btn-ghost btn-sm" onClick={() => setActiveTab('packages')}>Manage</button>
                  </div>
                  <div className="panel-body">
                    {packages.slice(0, 3).map((pkg) => (
                      <div key={pkg._id} className="pkg-row">
                        <div
                          className="pkg-thumb"
                          style={{ backgroundImage: `url('${pkg.image || 'https://images.unsplash.com/photo-1582510003544-4d00b7f74220?w=100&q=60'}')` }}
                        />
                        <div className="pkg-info">
                          <strong>{pkg.title}</strong>
                          <span>{pkg.duration || '5D'} · From ₹{typeof pkg.price === 'number' ? pkg.price.toLocaleString('en-IN') : pkg.price}</span>
                        </div>
                        <div className="pkg-price">Live</div>
                      </div>
                    ))}
                  </div>
                </div>
              </div>
            </div>
          )}

          {/* ENQUIRIES TAB */}
          {activeTab === 'enquiries' && (
            <div className="panel">
              <div className="panel-header">
                <h2>All enquiries</h2>
                <button className="btn btn-ghost btn-sm">Export CSV</button>
              </div>
              <div className="filters">
                <select value={statusFilter} onChange={(e) => setStatusFilter(e.target.value)}>
                  <option value="">All statuses</option>
                  <option value="New">New</option>
                  <option value="In progress">In progress</option>
                  <option value="Quoted">Quoted</option>
                  <option value="Confirmed">Confirmed</option>
                  <option value="Closed">Closed</option>
                </select>
                <select value={pkgFilter} onChange={(e) => setPkgFilter(e.target.value)}>
                  <option value="">All packages</option>
                  <option value="Meghalaya">Meghalaya</option>
                  <option value="Kaziranga">Kaziranga</option>
                  <option value="Tawang">Tawang</option>
                  <option value="Custom">Custom</option>
                </select>
                <input
                  type="search"
                  placeholder="Search name, phone, email…"
                  value={searchTerm}
                  onChange={(e) => setSearchTerm(e.target.value)}
                />
              </div>
              <div className="panel-body">
                <table>
                  <thead>
                    <tr>
                      <th>Name</th>
                      <th>Contact</th>
                      <th>Interest</th>
                      <th>Pax</th>
                      <th>Assigned</th>
                      <th>Status</th>
                      <th>Date</th>
                      <th></th>
                    </tr>
                  </thead>
                  <tbody>
                    {inquiries.map((inq) => (
                      <tr key={inq._id}>
                        <td className="name-cell">
                          <strong>{inq.name}</strong>
                          <span>{inq.location || 'Delhi'}</span>
                        </td>
                        <td>{inq.contact || `${inq.phone || '+91 98xxx'} · ${inq.email || 'user@...'}`}</td>
                        <td>{inq.interest || inq.packageId?.title || 'Tour Package'}</td>
                        <td>{inq.pax || 2}</td>
                        <td>{inq.assigned || '—'}</td>
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
          )}

          {/* PACKAGES TAB */}
          {activeTab === 'packages' && (
            <div className="panel">
              <div className="panel-header">
                <h2>Packages</h2>
                <button className="btn btn-primary btn-sm" onClick={() => setPackageModalOpen(true)}>+ Add package</button>
              </div>
              <div className="panel-body">
                <table>
                  <thead>
                    <tr>
                      <th>Package</th>
                      <th>Duration</th>
                      <th>Standard</th>
                      <th>Deluxe</th>
                      <th>Luxury</th>
                      <th>Status</th>
                      <th></th>
                    </tr>
                  </thead>
                  <tbody>
                    {packages.map((pkg) => (
                      <tr key={pkg._id}>
                        <td className="name-cell">
                          <strong>{pkg.title}</strong>
                          <span>{pkg.destination || 'North East'}</span>
                        </td>
                        <td>{pkg.duration || '5D / 4N'}</td>
                        <td>{pkg.standard || (typeof pkg.price === 'number' ? `₹${pkg.price.toLocaleString('en-IN')}` : pkg.price)}</td>
                        <td>{pkg.deluxe || '—'}</td>
                        <td>{pkg.luxury || '—'}</td>
                        <td><span className="status status-confirmed">{pkg.status || 'Published'}</span></td>
                        <td><button className="btn btn-ghost btn-sm" onClick={() => setPackageModalOpen(true)}>Edit</button></td>
                      </tr>
                    ))}
                  </tbody>
                </table>
              </div>
            </div>
          )}

          {/* DESTINATIONS TAB */}
          {activeTab === 'destinations' && (
            <div style={{ display: 'grid', gridTemplateColumns: '1fr 2fr', gap: '1.5rem' }}>
              <div className="panel" style={{ padding: '1.25rem' }}>
                <h3 style={{ fontSize: '1rem', fontWeight: 700, marginBottom: '1rem' }}>Add Destination</h3>
                <form onSubmit={handleSaveDestination}>
                  <div style={{ marginBottom: '0.85rem' }}>
                    <label style={{ display: 'block', fontSize: '0.8rem', fontWeight: 600, marginBottom: '0.2rem' }}>Region Name</label>
                    <input
                      type="text"
                      className="form-control"
                      style={{ width: '100%', padding: '0.45rem 0.75rem', borderRadius: '8px', border: '1px solid var(--slate-200)' }}
                      value={destName}
                      onChange={(e) => setDestName(e.target.value)}
                      placeholder="e.g. Nagaland"
                      required
                    />
                  </div>
                  <div style={{ marginBottom: '0.85rem' }}>
                    <label style={{ display: 'block', fontSize: '0.8rem', fontWeight: 600, marginBottom: '0.2rem' }}>Best Season</label>
                    <input
                      type="text"
                      className="form-control"
                      style={{ width: '100%', padding: '0.45rem 0.75rem', borderRadius: '8px', border: '1px solid var(--slate-200)' }}
                      value={destBestTime}
                      onChange={(e) => setDestBestTime(e.target.value)}
                      placeholder="Oct – Mar"
                      required
                    />
                  </div>
                  <button type="submit" className="btn btn-primary btn-sm" style={{ width: '100%' }}>Save Destination</button>
                </form>
              </div>

              <div className="panel">
                <div className="panel-header">
                  <h2>Destinations</h2>
                </div>
                <div className="panel-body">
                  <table>
                    <thead>
                      <tr>
                        <th>Region</th>
                        <th>Best season</th>
                        <th>Linked packages</th>
                        <th>Status</th>
                        <th></th>
                      </tr>
                    </thead>
                    <tbody>
                      {destinations.map((dest) => (
                        <tr key={dest._id}>
                          <td><strong>{dest.name}</strong></td>
                          <td>{dest.bestTimeToVisit || 'Oct – May'}</td>
                          <td>{dest.packagesCount || '1 package'}</td>
                          <td><span className="status status-confirmed">Live</span></td>
                          <td><button className="btn btn-ghost btn-sm">Edit</button></td>
                        </tr>
                      ))}
                    </tbody>
                  </table>
                </div>
              </div>
            </div>
          )}

          {/* MEDIA TAB */}
          {activeTab === 'media' && (
            <div className="panel">
              <div className="panel-header">
                <h2>Media library</h2>
                <button className="btn btn-primary btn-sm">Upload</button>
              </div>
              <div className="empty-hint">Upload images for packages, destinations and homepage. (Mock — no upload yet.)</div>
            </div>
          )}

          {/* SETTINGS TAB */}
          {activeTab === 'settings' && (
            <div className="panel">
              <div className="panel-header"><h2>Site settings</h2></div>
              <div className="panel-body" style={{ padding: '1.25rem' }}>
                <p style={{ fontSize: '0.9rem', color: 'var(--slate-500)', marginBottom: '1rem' }}>Contact details shown on the public site and in the footer.</p>
                <div style={{ display: 'grid', gap: '0.85rem', maxWidth: '420px' }}>
                  <label style={{ fontSize: '0.85rem', fontWeight: 600 }}>Phone<br />
                    <input
                      value={settingsPhone}
                      onChange={(e) => setSettingsPhone(e.target.value)}
                      style={{ width: '100%', marginTop: '0.3rem', padding: '0.55rem 0.75rem', border: '1px solid var(--slate-200)', borderRadius: '8px', fontFamily: 'inherit' }}
                    />
                  </label>
                  <label style={{ fontSize: '0.85rem', fontWeight: 600 }}>Email<br />
                    <input
                      value={settingsEmail}
                      onChange={(e) => setSettingsEmail(e.target.value)}
                      style={{ width: '100%', marginTop: '0.3rem', padding: '0.55rem 0.75rem', border: '1px solid var(--slate-200)', borderRadius: '8px', fontFamily: 'inherit' }}
                    />
                  </label>
                  <label style={{ fontSize: '0.85rem', fontWeight: 600 }}>WhatsApp<br />
                    <input
                      value={settingsWhatsapp}
                      onChange={(e) => setSettingsWhatsapp(e.target.value)}
                      style={{ width: '100%', marginTop: '0.3rem', padding: '0.55rem 0.75rem', border: '1px solid var(--slate-200)', borderRadius: '8px', fontFamily: 'inherit' }}
                    />
                  </label>
                  <button className="btn btn-teal" style={{ width: 'fit-content' }} onClick={() => showToast('Settings saved successfully!', 'success')}>Save settings</button>
                </div>
              </div>
            </div>
          )}
        </div>
      </div>

      {/* CREATE PACKAGE MODAL */}
      {packageModalOpen && (
        <div style={{ position: 'fixed', inset: 0, background: 'rgba(15, 23, 42, 0.6)', backdropFilter: 'blur(4px)', display: 'flex', alignItems: 'center', justifyContent: 'center', zIndex: 100 }}>
          <div style={{ background: 'var(--white)', padding: '1.75rem', borderRadius: 'var(--radius)', width: 'min(500px, 90%)', boxShadow: 'var(--shadow-lg)' }}>
            <h3 style={{ fontSize: '1.2rem', fontWeight: 700, marginBottom: '1rem' }}>Add New Package</h3>
            <form onSubmit={handleSavePackage}>
              <div style={{ marginBottom: '0.85rem' }}>
                <label style={{ display: 'block', fontSize: '0.85rem', fontWeight: 600, marginBottom: '0.25rem' }}>Package Title</label>
                <input
                  type="text"
                  className="form-control"
                  style={{ width: '100%', padding: '0.55rem 0.75rem', border: '1px solid var(--slate-200)', borderRadius: '8px' }}
                  value={pkgTitle}
                  onChange={(e) => setPkgTitle(e.target.value)}
                  placeholder="e.g. Meghalaya Highlights"
                  required
                />
              </div>
              <div style={{ marginBottom: '0.85rem' }}>
                <label style={{ display: 'block', fontSize: '0.85rem', fontWeight: 600, marginBottom: '0.25rem' }}>Destination / Region</label>
                <input
                  type="text"
                  className="form-control"
                  style={{ width: '100%', padding: '0.55rem 0.75rem', border: '1px solid var(--slate-200)', borderRadius: '8px' }}
                  value={pkgDestination}
                  onChange={(e) => setPkgDestination(e.target.value)}
                  placeholder="Meghalaya"
                  required
                />
              </div>
              <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: '0.85rem', marginBottom: '0.85rem' }}>
                <div>
                  <label style={{ display: 'block', fontSize: '0.85rem', fontWeight: 600, marginBottom: '0.25rem' }}>Price (₹)</label>
                  <input
                    type="number"
                    className="form-control"
                    style={{ width: '100%', padding: '0.55rem 0.75rem', border: '1px solid var(--slate-200)', borderRadius: '8px' }}
                    value={pkgPrice}
                    onChange={(e) => setPkgPrice(e.target.value)}
                    placeholder="18900"
                    required
                  />
                </div>
                <div>
                  <label style={{ display: 'block', fontSize: '0.85rem', fontWeight: 600, marginBottom: '0.25rem' }}>Duration</label>
                  <input
                    type="text"
                    className="form-control"
                    style={{ width: '100%', padding: '0.55rem 0.75rem', border: '1px solid var(--slate-200)', borderRadius: '8px' }}
                    value={pkgDuration}
                    onChange={(e) => setPkgDuration(e.target.value)}
                    placeholder="5 Days / 4 Nights"
                    required
                  />
                </div>
              </div>
              <div style={{ display: 'flex', gap: '0.75rem', justifySelf: 'end', marginTop: '1.25rem' }}>
                <button type="button" className="btn btn-ghost" onClick={() => setPackageModalOpen(false)}>Cancel</button>
                <button type="submit" className="btn btn-primary">Save Package</button>
              </div>
            </form>
          </div>
        </div>
      )}
    </div>
  );
};

export default AdminDashboard;
