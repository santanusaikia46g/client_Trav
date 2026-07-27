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
  deleteDestination
} from '../services/api';

const AdminDashboard = () => {
  const { showToast } = useToast();
  const [isAdmin, setIsAdmin] = useState(false);
  const [loading, setLoading] = useState(true);
  const [activeTab, setActiveTab] = useState('packages');

  // Login Form State
  const [username, setUsername] = useState('');
  const [password, setPassword] = useState('');
  const [loginLoading, setLoginLoading] = useState(false);

  // Data States
  const [packages, setPackages] = useState([]);
  const [inquiries, setInquiries] = useState([]);
  const [destinations, setDestinations] = useState([]);
  const [dataLoading, setDataLoading] = useState(false);
  const [editingDestId, setEditingDestId] = useState(null);

  // Modal / Form States for Package CRUD
  const [packageModalOpen, setPackageModalOpen] = useState(false);
  const [editingPackageId, setEditingPackageId] = useState(null);
  
  // Package Form Fields
  const [pkgTitle, setPkgTitle] = useState('');
  const [pkgDescription, setPkgDescription] = useState('');
  const [pkgPrice, setPkgPrice] = useState('');
  const [pkgDuration, setPkgDuration] = useState('');
  const [pkgDestination, setPkgDestination] = useState('');
  const [pkgCategory, setPkgCategory] = useState('Standard');
  const [pkgImages, setPkgImages] = useState(['']);
  const [pkgItinerary, setPkgItinerary] = useState([{ day: 1, title: '', description: '', image: '' }]);
  const [pkgIncluded, setPkgIncluded] = useState(['']);
  const [pkgExcluded, setPkgExcluded] = useState(['']);

  // Destination Form Fields
  const [destName, setDestName] = useState('');
  const [destImage, setDestImage] = useState('');
  const [destDesc, setDestDesc] = useState('');
  const [destBestTime, setDestBestTime] = useState('');
  const [destLoading, setDestLoading] = useState(false);

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
      if (activeTab === 'packages') {
        const pkgs = await getPackages();
        setPackages(pkgs);
      } else if (activeTab === 'inquiries') {
        const inqs = await getInquiries();
        setInquiries(inqs);
      } else if (activeTab === 'destinations') {
        const dests = await getDestinations();
        setDestinations(dests);
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
    setPkgItinerary((prev) => [...prev, { day: prev.length + 1, title: '', description: '', image: '' }]);
  };

  const handleRemoveItineraryDay = (index) => {
    setPkgItinerary((prev) => {
      const filtered = prev.filter((_, i) => i !== index);
      // Re-index days sequentially
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

  // Open Modal for Create or Edit
  const openPackageModal = (pkg = null) => {
    if (pkg) {
      setEditingPackageId(pkg._id);
      setPkgTitle(pkg.title);
      setPkgDescription(pkg.description);
      setPkgPrice(pkg.price.toString());
      setPkgDuration(pkg.duration);
      setPkgDestination(pkg.destination);
      setPkgCategory(pkg.category || 'Standard');
      setPkgImages(pkg.images.length > 0 ? pkg.images : ['']);
      setPkgItinerary(pkg.itinerary.length > 0 ? pkg.itinerary.map((it, idx) => ({ day: it.day || idx + 1, title: it.title || '', description: it.description || '', image: it.image || '' })) : [{ day: 1, title: '', description: '', image: '' }]);
      setPkgIncluded(pkg.included.length > 0 ? pkg.included : ['']);
      setPkgExcluded(pkg.excluded.length > 0 ? pkg.excluded : ['']);
    } else {
      setEditingPackageId(null);
      setPkgTitle('');
      setPkgDescription('');
      setPkgPrice('');
      setPkgDuration('');
      setPkgDestination('');
      setPkgCategory('Standard');
      setPkgImages(['']);
      setPkgItinerary([{ day: 1, title: '', description: '', image: '' }]);
      setPkgIncluded(['']);
      setPkgExcluded(['']);
    }
    setPackageModalOpen(true);
  };

  // Handle Create or Update submission
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
      images: pkgImages.filter((img) => img.trim() !== ''),
      itinerary: pkgItinerary.filter((it) => it.title.trim() !== '' && it.description.trim() !== ''),
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
      showToast(err.response?.data?.message || 'Error saving package', 'error');
    }
  };

  const handleDeletePackage = async (id) => {
    if (!window.confirm('Are you sure you want to delete this package?')) return;
    try {
      await deletePackage(id);
      showToast('Package deleted successfully!', 'success');
      loadData();
    } catch (err) {
      console.error(err);
      showToast('Error deleting package', 'error');
    }
  };

  // Inquiries Actions
  const handleStatusChange = async (id, status) => {
    try {
      await updateInquiryStatus(id, status);
      showToast('Inquiry status updated successfully!', 'success');
      loadData();
    } catch (err) {
      console.error(err);
      showToast('Failed to update inquiry status', 'error');
    }
  };

  const handleDeleteInquiry = async (id) => {
    if (!window.confirm('Are you sure you want to delete this inquiry?')) return;
    try {
      await deleteInquiry(id);
      showToast('Inquiry deleted successfully!', 'success');
      loadData();
    } catch (err) {
      console.error(err);
      showToast('Failed to delete inquiry', 'error');
    }
  };

  // Save Destination Action (Create or Update)
  const handleSaveDestination = async (e) => {
    e.preventDefault();
    if (!destName.trim() || !destImage.trim() || !destDesc.trim() || !destBestTime.trim()) {
      showToast('Please fill in all destination fields', 'error');
      return;
    }

    setDestLoading(true);
    try {
      const payload = {
        name: destName,
        image: destImage,
        description: destDesc,
        bestTimeToVisit: destBestTime
      };

      if (editingDestId) {
        await updateDestination(editingDestId, payload);
        showToast('Destination updated successfully!', 'success');
      } else {
        await createDestination(payload);
        showToast('Destination created successfully!', 'success');
      }

      setDestName('');
      setDestImage('');
      setDestDesc('');
      setDestBestTime('');
      setEditingDestId(null);
      loadData();
    } catch (err) {
      console.error(err);
      showToast(err.response?.data?.message || 'Failed to save destination', 'error');
    } finally {
      setDestLoading(false);
    }
  };

  const handleEditDestinationClick = (dest) => {
    setEditingDestId(dest._id);
    setDestName(dest.name);
    setDestImage(dest.image);
    setDestDesc(dest.description);
    setDestBestTime(dest.bestTimeToVisit);
  };

  const handleCancelDestEdit = () => {
    setEditingDestId(null);
    setDestName('');
    setDestImage('');
    setDestDesc('');
    setDestBestTime('');
  };

  const handleDeleteDestination = async (id) => {
    if (!window.confirm('Are you sure you want to delete this destination?')) return;
    try {
      await deleteDestination(id);
      showToast('Destination deleted successfully!', 'success');
      loadData();
    } catch (err) {
      console.error(err);
      showToast('Failed to delete destination', 'error');
    }
  };



  // Login View Renderer
  if (loading) {
    return <Spinner fullPage={true} />;
  }

  if (!isAdmin) {
    return (
      <div className="login-wrap">
        <div className="login-card">
          <h2>Admin Login</h2>
          <p>Please log in using your admin credentials to access the panel.</p>
          <form onSubmit={handleLogin}>
            <div className="form-group">
              <label>Username</label>
              <input
                type="text"
                className="form-control"
                placeholder="Enter admin username"
                value={username}
                onChange={(e) => setUsername(e.target.value)}
              />
            </div>
            <div className="form-group">
              <label>Password</label>
              <input
                type="password"
                className="form-control"
                placeholder="Enter password"
                value={password}
                onChange={(e) => setPassword(e.target.value)}
              />
            </div>
            <Button type="submit" variant="primary" style={{ width: '100%', marginTop: '10px' }} disabled={loginLoading}>
              {loginLoading ? 'Authenticating...' : 'Login'}
            </Button>
          </form>
        </div>
      </div>
    );
  }

  // Dashboard Main View
  return (
    <div className="admin-container">
      {/* Sidebar navigation */}
      <aside className="admin-sidebar">
        <button
          className={`admin-sidebar-btn ${activeTab === 'packages' ? 'active' : ''}`}
          onClick={() => setActiveTab('packages')}
        >
          Manage Packages
        </button>
        <button
          className={`admin-sidebar-btn ${activeTab === 'inquiries' ? 'active' : ''}`}
          onClick={() => setActiveTab('inquiries')}
        >
          View Inquiries
        </button>
        <button
          className={`admin-sidebar-btn ${activeTab === 'destinations' ? 'active' : ''}`}
          onClick={() => setActiveTab('destinations')}
        >
          Add Destination
        </button>
        <div style={{ marginTop: 'auto', borderTop: '1px solid var(--border)', paddingTop: '15px' }}>
          <button className="admin-sidebar-btn" onClick={handleLogout} style={{ color: 'var(--danger)' }}>
            Logout
          </button>
        </div>
      </aside>

      {/* Main Content Area */}
      <main className="admin-content">
        {/* TABS 1: PACKAGES CRUD */}
        {activeTab === 'packages' && (
          <div>
            <div className="admin-header">
              <h2>Packages Management</h2>
              <Button variant="primary" size="sm" onClick={() => openPackageModal()}>
                + Create Package
              </Button>
            </div>

            {dataLoading ? (
              <Spinner />
            ) : packages.length === 0 ? (
              <div className="empty-state">
                <h3>No Packages Configured</h3>
                <p>Create your first vacation bundle to showcase on the packages screen.</p>
              </div>
            ) : (
              <div className="admin-table-container">
                <table className="admin-table">
                  <thead>
                    <tr>
                      <th>Title</th>
                      <th>Destination</th>
                      <th>Category</th>
                      <th>Price</th>
                      <th>Duration</th>
                      <th>Actions</th>
                    </tr>
                  </thead>
                  <tbody>
                    {packages.map((pkg) => (
                      <tr key={pkg._id}>
                        <td style={{ fontWeight: '600' }}>{pkg.title}</td>
                        <td>{pkg.destination}</td>
                        <td>
                          <span className={`badge-category badge-category-${(pkg.category || 'Standard').toLowerCase()}`}>
                            {pkg.category || 'Standard'}
                          </span>
                        </td>
                        <td>₹{pkg.price.toLocaleString('en-IN')}</td>
                        <td>{pkg.duration}</td>
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
            )}
          </div>
        )}

        {/* TABS 2: INQUIRIES VIEW */}
        {activeTab === 'inquiries' && (
          <div>
            <div className="admin-header">
              <h2>Customer Inquiries</h2>
            </div>

            {dataLoading ? (
              <Spinner />
            ) : inquiries.length === 0 ? (
              <div className="empty-state">
                <h3>No Inquiries Received</h3>
                <p>User queries submitted from the website forms will reflect here.</p>
              </div>
            ) : (
              <div className="admin-table-container">
                <table className="admin-table">
                  <thead>
                    <tr>
                      <th>Client</th>
                      <th>Contacts</th>
                      <th>Tour Reference</th>
                      <th>Message</th>
                      <th>Status</th>
                      <th>Actions</th>
                    </tr>
                  </thead>
                  <tbody>
                    {inquiries.map((inq) => (
                      <tr key={inq._id}>
                        <td>
                          <div style={{ fontWeight: '600' }}>{inq.name}</div>
                        </td>
                        <td>
                          <div style={{ fontSize: '0.85rem' }}>{inq.email}</div>
                          <div style={{ fontSize: '0.85rem', color: 'var(--medium)' }}>{inq.phone}</div>
                        </td>
                        <td style={{ fontWeight: '500' }}>
                          {inq.packageId ? (
                            <Link to={`/packages/${inq.packageId._id}`} target="_blank" style={{ color: 'var(--primary)' }}>
                              {inq.packageId.title}
                            </Link>
                          ) : (
                            <span style={{ color: 'var(--medium)', fontSize: '0.85rem' }}>General Inquiry</span>
                          )}
                        </td>
                        <td>
                          <div style={{ maxWidth: '250px', fontSize: '0.85rem', whiteSpace: 'pre-line' }}>{inq.message}</div>
                        </td>
                        <td>
                          <select
                            className="badge filter-input"
                            value={inq.status}
                            onChange={(e) => handleStatusChange(inq._id, e.target.value)}
                            style={{
                              padding: '4px 6px',
                              width: 'auto',
                              fontSize: '0.8rem',
                              backgroundColor:
                                inq.status === 'Pending'
                                  ? 'hsl(45, 100%, 92%)'
                                  : inq.status === 'Contacted'
                                  ? 'var(--primary-light)'
                                  : 'var(--secondary-light)',
                              color:
                                inq.status === 'Pending'
                                  ? 'hsl(45, 100%, 35%)'
                                  : inq.status === 'Contacted'
                                  ? 'var(--primary)'
                                  : 'var(--secondary)'
                            }}
                          >
                            <option value="Pending">Pending</option>
                            <option value="Contacted">Contacted</option>
                            <option value="Resolved">Resolved</option>
                          </select>
                        </td>
                        <td>
                          <Button variant="danger" size="sm" onClick={() => handleDeleteInquiry(inq._id)}>
                            Delete
                          </Button>
                        </td>
                      </tr>
                    ))}
                  </tbody>
                </table>
              </div>
            )}
          </div>
        )}

        {/* TABS 3: ADD/MANAGE DESTINATIONS */}
        {activeTab === 'destinations' && (
          <div>
            <div className="admin-header">
              <h2>Destinations Management</h2>
            </div>
            
            <div style={{ display: 'grid', gridTemplateColumns: '1.2fr 0.8fr', gap: '30px', alignItems: 'start' }}>
              
              {/* Left Column: Destinations Table */}
              <div>
                {dataLoading ? (
                  <Spinner />
                ) : destinations.length === 0 ? (
                  <div className="empty-state">
                    <h3>No Destinations Configured</h3>
                    <p>Add a destination to get started.</p>
                  </div>
                ) : (
                  <div className="admin-table-container">
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
                              <img src={dest.image} alt={dest.name} style={{ width: '60px', height: '40px', objectFit: 'cover', borderRadius: '4px' }} />
                            </td>
                            <td style={{ fontWeight: '600' }}>{dest.name}</td>
                            <td>{dest.bestTimeToVisit}</td>
                            <td>
                              <div style={{ display: 'flex', gap: '8px' }}>
                                <Button variant="outline" size="sm" onClick={() => handleEditDestinationClick(dest)}>
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
                )}
              </div>

              {/* Right Column: Add/Edit Destination Form */}
              <div style={{ backgroundColor: 'var(--white)', padding: '30px', borderRadius: 'var(--radius-md)', border: '1px solid var(--border)', boxShadow: 'var(--shadow-sm)' }}>
                <h3 style={{ marginBottom: '20px' }}>{editingDestId ? 'Edit Destination' : 'Add New Destination'}</h3>
                <form onSubmit={handleSaveDestination}>
                  <div className="form-group">
                    <label>Destination Name *</label>
                    <input
                      type="text"
                      className="form-control"
                      placeholder="e.g. Goa, Ladakh"
                      value={destName}
                      onChange={(e) => setDestName(e.target.value)}
                    />
                  </div>

                  <div className="form-group">
                    <label>Image URL *</label>
                    <input
                      type="text"
                      className="form-control"
                      placeholder="Paste destination image URL"
                      value={destImage}
                      onChange={(e) => setDestImage(e.target.value)}
                    />
                  </div>

                  <div className="form-group">
                    <label>Best Time to Visit *</label>
                    <input
                      type="text"
                      className="form-control"
                      placeholder="e.g. November to February"
                      value={destBestTime}
                      onChange={(e) => setDestBestTime(e.target.value)}
                    />
                  </div>

                  <div className="form-group">
                    <label>Short Description *</label>
                    <textarea
                      className="form-control"
                      placeholder="Write a brief introduction for this destination"
                      value={destDesc}
                      onChange={(e) => setDestDesc(e.target.value)}
                      style={{ minHeight: '120px' }}
                    ></textarea>
                  </div>

                  <div style={{ display: 'flex', gap: '10px' }}>
                    <Button type="submit" variant="primary" style={{ flexGrow: 1 }} disabled={destLoading}>
                      {destLoading ? 'Saving...' : editingDestId ? 'Save Changes' : 'Create Destination'}
                    </Button>
                    {editingDestId && (
                      <Button type="button" variant="outline" onClick={handleCancelDestEdit}>
                        Cancel
                      </Button>
                    )}
                  </div>
                </form>
              </div>

            </div>
          </div>
        )}
      </main>

      {/* Package Form Modal (Overlay Backdrop) */}
      {packageModalOpen && (
        <div className="admin-modal-backdrop">
          <div className="admin-modal">
            <div className="admin-modal-header">
              <h3>{editingPackageId ? 'Edit Tour Package' : 'Create Tour Package'}</h3>
              <button className="close-btn" onClick={() => setPackageModalOpen(false)}>&times;</button>
            </div>
            
            <form onSubmit={handleSavePackage}>
              <div className="admin-modal-body">
                <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: '15px' }}>
                  <div className="form-group">
                    <label>Package Title *</label>
                    <input
                      type="text"
                      className="form-control"
                      value={pkgTitle}
                      onChange={(e) => setPkgTitle(e.target.value)}
                      placeholder="e.g. Magnificent Munnar Retreat"
                    />
                  </div>
                  <div className="form-group">
                    <label>Destination Location *</label>
                    <input
                      type="text"
                      className="form-control"
                      value={pkgDestination}
                      onChange={(e) => setPkgDestination(e.target.value)}
                      placeholder="e.g. Kerala, Goa"
                    />
                  </div>
                </div>

                <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr 1fr', gap: '15px' }}>
                  <div className="form-group">
                    <label>Category / Tier *</label>
                    <select
                      className="form-control"
                      value={pkgCategory}
                      onChange={(e) => setPkgCategory(e.target.value)}
                    >
                      <option value="Standard">Standard</option>
                      <option value="Deluxe">Deluxe</option>
                      <option value="Luxury">Luxury</option>
                    </select>
                  </div>
                  <div className="form-group">
                    <label>Duration *</label>
                    <input
                      type="text"
                      className="form-control"
                      value={pkgDuration}
                      onChange={(e) => setPkgDuration(e.target.value)}
                      placeholder="e.g. 5 Days / 4 Nights"
                    />
                  </div>
                  <div className="form-group">
                    <label>Price (₹ INR) *</label>
                    <input
                      type="number"
                      className="form-control"
                      value={pkgPrice}
                      onChange={(e) => setPkgPrice(e.target.value)}
                      placeholder="e.g. 19999"
                    />
                  </div>
                </div>

                <div className="form-group">
                  <label>Description Overview *</label>
                  <textarea
                    className="form-control"
                    value={pkgDescription}
                    onChange={(e) => setPkgDescription(e.target.value)}
                    placeholder="Provide a comprehensive introduction to this tour package..."
                    style={{ minHeight: '100px' }}
                  ></textarea>
                </div>

                {/* Images Array Input */}
                <div className="form-group">
                  <label>Package Images (URLs) *</label>
                  <div className="list-inputs-container">
                    {pkgImages.map((img, index) => (
                      <div key={index} className="list-input-row">
                        <input
                          type="text"
                          className="form-control"
                          value={img}
                          onChange={(e) => handleArrayItemChange(setPkgImages, index, e.target.value)}
                          placeholder="Paste image URL here"
                        />
                        {pkgImages.length > 1 && (
                          <Button variant="danger" size="sm" onClick={() => handleRemoveArrayItem(setPkgImages, index)}>
                            &times;
                          </Button>
                        )}
                      </div>
                    ))}
                  </div>
                  <Button variant="outline" size="sm" onClick={() => handleAddArrayItem(setPkgImages)} style={{ marginTop: '8px' }}>
                    + Add Image URL
                  </Button>
                </div>

                {/* Inclusions Array Input */}
                <div className="form-group">
                  <label>Inclusions (What's included in the price)</label>
                  <div className="list-inputs-container">
                    {pkgIncluded.map((inc, index) => (
                      <div key={index} className="list-input-row">
                        <input
                          type="text"
                          className="form-control"
                          value={inc}
                          onChange={(e) => handleArrayItemChange(setPkgIncluded, index, e.target.value)}
                          placeholder="e.g. 3-star hotel accommodation"
                        />
                        {pkgIncluded.length > 1 && (
                          <Button variant="danger" size="sm" onClick={() => handleRemoveArrayItem(setPkgIncluded, index)}>
                            &times;
                          </Button>
                        )}
                      </div>
                    ))}
                  </div>
                  <Button variant="outline" size="sm" onClick={() => handleAddArrayItem(setPkgIncluded)} style={{ marginTop: '8px' }}>
                    + Add Inclusion
                  </Button>
                </div>

                {/* Exclusions Array Input */}
                <div className="form-group">
                  <label>Exclusions (What's NOT included)</label>
                  <div className="list-inputs-container">
                    {pkgExcluded.map((exc, index) => (
                      <div key={index} className="list-input-row">
                        <input
                          type="text"
                          className="form-control"
                          value={exc}
                          onChange={(e) => handleArrayItemChange(setPkgExcluded, index, e.target.value)}
                          placeholder="e.g. Flight/Train tickets"
                        />
                        {pkgExcluded.length > 1 && (
                          <Button variant="danger" size="sm" onClick={() => handleRemoveArrayItem(setPkgExcluded, index)}>
                            &times;
                          </Button>
                        )}
                      </div>
                    ))}
                  </div>
                  <Button variant="outline" size="sm" onClick={() => handleAddArrayItem(setPkgExcluded)} style={{ marginTop: '8px' }}>
                    + Add Exclusion
                  </Button>
                </div>

                {/* Itinerary Array Input */}
                <div className="form-group">
                  <label>Day-Wise Itinerary Planning</label>
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
                            placeholder="Day Activity Title (e.g. Arrival & Beach Sunset)"
                          />
                        </div>
                        <div className="form-group" style={{ marginTop: '8px' }}>
                          <input
                            type="text"
                            className="form-control"
                            value={item.image || ''}
                            onChange={(e) => handleItineraryChange(index, 'image', e.target.value)}
                            placeholder="Day Image URL (Optional - e.g. https://...)"
                          />
                        </div>
                        <div className="form-group" style={{ marginBottom: 0 }}>
                          <textarea
                            className="form-control"
                            value={item.description}
                            onChange={(e) => handleItineraryChange(index, 'description', e.target.value)}
                            placeholder="Detailed description of what happens on this day..."
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
    </div>
  );
};

export default AdminDashboard;
