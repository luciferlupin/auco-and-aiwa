import React, { useState } from 'react';
import { useApp } from '../context/AppContext';
import {
  Boxes,
  Plus,
  Search,
  AlertTriangle,
  ArrowUp,
  ArrowDown,
  RefreshCw,
  Sliders,
  CheckCircle2,
  Package,
  Layers,
  Edit2,
  Trash2,
  X
} from 'lucide-react';
import { formatCurrency, getStatusBadgeClass } from '../utils/formatters';

export const InventoryView = () => {
  const { inventory, addProduct, updateProduct, deleteProduct, adjustProductStock, selectedCompany, companyBrands, matchesCompany } = useApp();
  const [searchQuery, setSearchQuery] = useState('');
  const [categoryFilter, setCategoryFilter] = useState('ALL');
  const [showAddModal, setShowAddModal] = useState(false);
  const [showAdjustModal, setShowAdjustModal] = useState(null); // Product object
  const [editingProduct, setEditingProduct] = useState(null);
  const [editProductData, setEditProductData] = useState({});
  const [adjustAmount, setAdjustAmount] = useState(10);
  const [adjustType, setAdjustType] = useState('ADD'); // 'ADD' | 'REMOVE'

  // New product form state
  const [newProduct, setNewProduct] = useState({
    name: '',
    brand: selectedCompany || 'AUCO',
    productCode: '',
    sku: '',
    category: 'Automation Hardware',
    currentStock: 20,
    minStockLevel: 5,
    supplier: 'Auco Main Works',
    price: 35000
  });

  // Scoped inventory
  const scopedInventory = inventory.filter(matchesCompany);

  // Extract categories from scoped inventory
  const categories = Array.from(new Set(scopedInventory.map((p) => p.category).filter(Boolean)));

  // Filter inventory
  const filteredProducts = scopedInventory.filter((p) => {
    const matchesSearch =
      p.name.toLowerCase().includes(searchQuery.toLowerCase()) ||
      p.productCode.toLowerCase().includes(searchQuery.toLowerCase()) ||
      p.sku.toLowerCase().includes(searchQuery.toLowerCase()) ||
      p.supplier.toLowerCase().includes(searchQuery.toLowerCase());

    const matchesCategory = categoryFilter === 'ALL' || p.category === categoryFilter;
    return matchesSearch && matchesCategory;
  });

  // Aggregates
  const totalSKUs = scopedInventory.length;
  const totalStockUnits = scopedInventory.reduce((acc, p) => acc + Number(p.currentStock || 0), 0);
  const totalInventoryValuation = scopedInventory.reduce((acc, p) => acc + (Number(p.currentStock || 0) * Number(p.price || 0)), 0);
  const lowStockItems = scopedInventory.filter((p) => p.availableStock <= p.minStockLevel);

  const handleCreateProduct = (e) => {
    e.preventDefault();
    if (!newProduct.name || !newProduct.productCode) return;
    addProduct(newProduct);
    setShowAddModal(false);
    setNewProduct({
      name: '',
      brand: selectedCompany || 'AUCO',
      productCode: '',
      sku: '',
      category: selectedCompany === 'AIWA' ? 'Commercial AV' : 'Automation Hardware',
      currentStock: 20,
      minStockLevel: 5,
      supplier: selectedCompany === 'AIWA' ? 'Aiwa Precision Labs' : 'Auco Main Works',
      price: 35000
    });
  };

  const handleStockAdjustment = (e) => {
    e.preventDefault();
    if (!showAdjustModal) return;
    const delta = adjustType === 'ADD' ? Number(adjustAmount) : -Math.abs(Number(adjustAmount));
    adjustProductStock(showAdjustModal.productCode, delta, `Manual ${adjustType}`);
    setShowAdjustModal(null);
  };

  const handleStartEditProduct = (p) => {
    setEditingProduct(p);
    setEditProductData({
      name: p.name,
      price: p.price,
      minStockLevel: p.minStockLevel,
      supplier: p.supplier,
      category: p.category
    });
  };

  const handleSaveProductEdit = (e) => {
    e.preventDefault();
    if (!editingProduct) return;
    updateProduct(editingProduct.id || editingProduct.productCode, editProductData);
    setEditingProduct(null);
  };

  const handleDeleteProduct = (p) => {
    if (window.confirm(`Are you sure you want to delete SKU [${p.productCode}] "${p.name}"?`)) {
      deleteProduct(p.id || p.productCode);
    }
  };

  return (
    <div style={{ display: 'flex', flexDirection: 'column', gap: '20px' }}>
      {/* Header */}
      <div className="flex-between" style={{ flexWrap: 'wrap', gap: '12px' }}>
        <div>
          <h2>Inventory Catalog</h2>
          <p style={{ fontSize: '0.82rem', color: 'var(--text-muted)' }}>
            Real-time stock monitoring, SKU availability, and safety thresholds
          </p>
        </div>
        <button className="btn btn-primary" onClick={() => setShowAddModal(true)} style={{ display: 'flex', alignItems: 'center', gap: '6px' }}>
          <Plus size={15} /> Add SKU
        </button>
      </div>

      {/* Metric Cards */}
      <div className="grid-4">
        <div className="stat-card" style={{ borderLeft: '4px solid var(--primary-600)' }}>
          <div className="stat-header">
            <span className="stat-title">Catalog SKUs</span>
            <Boxes size={18} style={{ color: 'var(--primary-600)' }} />
          </div>
          <div className="stat-value">{totalSKUs}</div>
          <div className="stat-subtext">Active equipment models</div>
        </div>

        <div className="stat-card" style={{ borderLeft: '4px solid #10b981' }}>
          <div className="stat-header">
            <span className="stat-title">Total Units in Stock</span>
            <Package size={18} style={{ color: '#10b981' }} />
          </div>
          <div className="stat-value">{totalStockUnits.toLocaleString('en-IN')}</div>
          <div className="stat-subtext">Across warehouses</div>
        </div>

        <div className="stat-card" style={{ borderLeft: '4px solid #8b5cf6' }}>
          <div className="stat-header">
            <span className="stat-title">Total Inventory Valuation</span>
            <Layers size={18} style={{ color: '#8b5cf6' }} />
          </div>
          <div className="stat-value">{formatCurrency(totalInventoryValuation)}</div>
          <div className="stat-subtext">Asset replacement value</div>
        </div>

        <div className="stat-card" style={{ borderLeft: `4px solid ${lowStockItems.length > 0 ? 'var(--danger-text)' : 'var(--success-text)'}` }}>
          <div className="stat-header">
            <span className="stat-title">Low Stock Alert</span>
            <AlertTriangle size={18} style={{ color: lowStockItems.length > 0 ? 'var(--danger-text)' : 'var(--success-text)' }} />
          </div>
          <div className="stat-value" style={{ color: lowStockItems.length > 0 ? 'var(--danger-text)' : 'inherit' }}>
            {lowStockItems.length} SKUs
          </div>
          <div className="stat-subtext">Below minimum safety threshold</div>
        </div>
      </div>

      {/* Low Stock Warning Banner if any */}
      {lowStockItems.length > 0 && (
        <div
          style={{
            background: 'var(--warning-bg)',
            border: '1px solid var(--warning-border)',
            borderRadius: 'var(--radius-lg)',
            padding: '14px 18px',
            display: 'flex',
            alignItems: 'center',
            justifyContent: 'space-between',
            gap: '12px'
          }}
        >
          <div style={{ display: 'flex', alignItems: 'center', gap: '10px' }}>
            <AlertTriangle size={20} style={{ color: 'var(--warning-text)' }} />
            <div>
              <strong style={{ color: 'var(--warning-text)', fontSize: '0.88rem' }}>Attention: Low Inventory Levels Detected</strong>
              <div style={{ fontSize: '0.78rem', color: 'var(--text-secondary)' }}>
                {lowStockItems.map((p) => `${p.name} (${p.productCode}: ${p.availableStock} left)`).join(' • ')}
              </div>
            </div>
          </div>
        </div>
      )}

      {/* Search & Filter */}
      <div className="card" style={{ padding: '14px 18px' }}>
        <div style={{ display: 'flex', gap: '14px', flexWrap: 'wrap', alignItems: 'center' }}>
          <div style={{ position: 'relative', flex: 1, minWidth: '240px' }}>
            <Search size={16} style={{ position: 'absolute', left: '12px', top: '50%', transform: 'translateY(-50%)', color: 'var(--text-muted)' }} />
            <input
              type="text"
              className="form-input"
              placeholder="Search product code (e.g. AUC-101), name, SKU, supplier..."
              value={searchQuery}
              onChange={(e) => setSearchQuery(e.target.value)}
              style={{ paddingLeft: '36px' }}
            />
          </div>

          <div style={{ display: 'flex', alignItems: 'center', gap: '8px' }}>
            <span style={{ fontSize: '0.8rem', color: 'var(--text-muted)', fontWeight: 600 }}>Category:</span>
            <select
              className="form-select"
              value={categoryFilter}
              onChange={(e) => setCategoryFilter(e.target.value)}
              style={{ width: '180px' }}
            >
              <option value="ALL">All Categories</option>
              {categories.map((c) => (
                <option key={c} value={c}>{c}</option>
              ))}
            </select>
          </div>
        </div>
      </div>

      {/* =========================================================================
          DESKTOP INVENTORY TABLE
          ========================================================================= */}
      <div className="table-container desktop-only">
        <table className="custom-table">
          <thead>
            <tr>
              <th>Product Code (Unique)</th>
              <th>Product Name & SKU</th>
              <th>Category</th>
              <th>Unit Price</th>
              <th>Stock In / Out</th>
              <th>Reserved</th>
              <th>Available Stock</th>
              <th>Min Threshold</th>
              <th>Supplier</th>
              <th>Action</th>
            </tr>
          </thead>
          <tbody>
            {filteredProducts.map((p) => {
              const isLow = p.availableStock <= p.minStockLevel;
              return (
                <tr key={p.id}>
                  <td>
                    <strong style={{ color: 'var(--primary-600)', fontFamily: 'monospace', fontSize: '0.9rem' }}>
                      {p.productCode}
                    </strong>
                  </td>
                  <td>
                    <div>
                      <strong>{p.name}</strong>
                      <div style={{ fontSize: '0.74rem', color: 'var(--text-muted)' }}>SKU: {p.sku}</div>
                    </div>
                  </td>
                  <td>
                    <span className="badge badge-neutral" style={{ fontSize: '0.72rem' }}>
                      {p.category}
                    </span>
                  </td>
                  <td>
                    <strong>{formatCurrency(p.price)}</strong>
                  </td>
                  <td style={{ fontSize: '0.78rem' }}>
                    <span style={{ color: 'var(--success-text)' }}>+{p.stockIn} in</span> / <span style={{ color: 'var(--danger-text)' }}>-{p.stockOut} out</span>
                  </td>
                  <td style={{ textAlign: 'center', fontSize: '0.8rem', color: 'var(--text-muted)' }}>
                    {p.reservedStock || 0}
                  </td>
                  <td>
                    <div style={{ display: 'flex', alignItems: 'center', gap: '6px' }}>
                      <strong style={{ fontSize: '1rem', color: isLow ? 'var(--danger-text)' : 'var(--text-primary)' }}>
                        {p.availableStock}
                      </strong>
                      {isLow ? (
                        <span className="badge badge-danger" style={{ fontSize: '0.68rem' }}>Low</span>
                      ) : (
                        <span className="badge badge-success" style={{ fontSize: '0.68rem' }}>OK</span>
                      )}
                    </div>
                  </td>
                  <td style={{ fontSize: '0.8rem', color: 'var(--text-muted)', textAlign: 'center' }}>
                    {p.minStockLevel}
                  </td>
                  <td style={{ fontSize: '0.78rem', color: 'var(--text-secondary)' }}>
                    {p.supplier}
                  </td>
                  <td>
                    <div style={{ display: 'flex', gap: '6px', alignItems: 'center' }}>
                      <button
                        className="btn btn-secondary btn-sm"
                        onClick={() => setShowAdjustModal(p)}
                        title="Adjust Stock In / Out"
                        style={{ padding: '4px 8px' }}
                      >
                        <Sliders size={13} /> Stock
                      </button>
                      <button
                        className="btn btn-ghost btn-sm"
                        onClick={() => handleStartEditProduct(p)}
                        title="Edit SKU"
                        style={{ padding: '4px 8px' }}
                      >
                        <Edit2 size={13} />
                      </button>
                      <button
                        className="btn btn-ghost btn-sm"
                        onClick={() => handleDeleteProduct(p)}
                        title="Delete SKU"
                        style={{ padding: '4px 8px', color: 'var(--danger-text)' }}
                      >
                        <Trash2 size={13} />
                      </button>
                    </div>
                  </td>
                </tr>
              );
            })}
            {filteredProducts.length === 0 && (
              <tr>
                <td colSpan="10" style={{ textAlign: 'center', padding: '48px 16px', color: 'var(--text-muted)' }}>
                  <Boxes size={36} style={{ margin: '0 auto 10px', opacity: 0.4 }} />
                  <div style={{ fontWeight: 600, fontSize: '0.95rem' }}>No products found</div>
                  <p style={{ fontSize: '0.8rem', marginTop: '4px' }}>Try adjusting your search query or category filter.</p>
                </td>
              </tr>
            )}
          </tbody>
        </table>
      </div>

      {/* =========================================================================
          MOBILE PRODUCT CARDS FEED (Phone Screens)
          ========================================================================= */}
      <div className="mobile-only" style={{ flexDirection: 'column', gap: '12px' }}>
        {filteredProducts.map((p) => {
          const isLow = p.availableStock <= p.minStockLevel;
          return (
            <div key={p.id} className="card" style={{ padding: '14px 16px' }}>
              <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'flex-start', marginBottom: '6px' }}>
                <div>
                  <div style={{ display: 'flex', alignItems: 'center', gap: '6px' }}>
                    <strong style={{ color: 'var(--primary-600)', fontFamily: 'monospace', fontSize: '0.95rem' }}>[{p.productCode}]</strong>
                    {isLow ? (
                      <span className="badge badge-danger" style={{ fontSize: '0.68rem', fontWeight: 700 }}>Low Stock</span>
                    ) : (
                      <span className="badge badge-success" style={{ fontSize: '0.68rem' }}>In Stock</span>
                    )}
                  </div>
                  <div style={{ fontWeight: 800, fontSize: '0.95rem', color: 'var(--text-primary)', marginTop: '2px' }}>{p.name}</div>
                </div>
                <div style={{ textAlign: 'right' }}>
                  <div style={{ fontWeight: 800, fontSize: '1rem', color: 'var(--text-primary)' }}>{formatCurrency(p.price)}</div>
                  <div style={{ fontSize: '0.72rem', color: 'var(--text-muted)' }}>per unit</div>
                </div>
              </div>

              <div style={{ display: 'flex', alignItems: 'center', gap: '8px', background: 'var(--bg-subtle)', padding: '8px 10px', borderRadius: 'var(--radius-sm)', fontSize: '0.78rem', marginBottom: '10px' }}>
                <span className="badge badge-neutral" style={{ fontSize: '0.68rem' }}>{p.category}</span>
                <span style={{ color: 'var(--text-muted)' }}>•</span>
                <span>Available: <strong style={{ color: isLow ? 'var(--danger-text)' : 'inherit', fontSize: '0.85rem' }}>{p.availableStock}</strong> units</span>
                <span style={{ color: 'var(--text-muted)' }}>(Min: {p.minStockLevel})</span>
              </div>

              <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between', gap: '8px', paddingTop: '8px', borderTop: '1px solid var(--border-default)' }}>
                <button
                  className="btn btn-primary btn-sm"
                  style={{ height: '32px', padding: '0 10px', display: 'flex', alignItems: 'center', gap: '4px', flex: 1 }}
                  onClick={() => setShowAdjustModal(p)}
                >
                  <Sliders size={13} />
                  <span>Adjust Stock</span>
                </button>

                <button
                  className="btn btn-secondary btn-sm"
                  style={{ height: '32px', padding: '0 10px', display: 'flex', alignItems: 'center', gap: '4px' }}
                  onClick={() => handleStartEditProduct(p)}
                >
                  <Edit2 size={13} />
                  <span>Edit</span>
                </button>
              </div>
            </div>
          );
        })}
        {filteredProducts.length === 0 && (
          <div className="card" style={{ padding: '36px 16px', textAlign: 'center', color: 'var(--text-muted)' }}>
            <Boxes size={32} style={{ margin: '0 auto 8px', opacity: 0.4 }} />
            <div style={{ fontWeight: 700 }}>No products found</div>
          </div>
        )}
      </div>

      {/* =========================================================================
          ADD PRODUCT MODAL
          ========================================================================= */}
      {showAddModal && (
        <div className="modal-backdrop" onClick={() => setShowAddModal(false)}>
          <div className="modal-content" onClick={(e) => e.stopPropagation()}>
            <form onSubmit={handleCreateProduct}>
              <div className="modal-header">
                <h3>Add New Inventory Product</h3>
                <button type="button" className="btn btn-ghost btn-icon" onClick={() => setShowAddModal(false)}>✕</button>
              </div>

              <div className="modal-body">
                <div className="form-group">
                  <label className="form-label">Product Name *</label>
                  <input
                    type="text"
                    required
                    className="form-input"
                    placeholder="e.g. Auco Servo Drive Controller Pro"
                    value={newProduct.name}
                    onChange={(e) => setNewProduct({ ...newProduct, name: e.target.value })}
                  />
                </div>

                <div className="grid-2">
                  <div className="form-group">
                    <label className="form-label">Unique Product Code *</label>
                    <input
                      type="text"
                      required
                      className="form-input"
                      placeholder="e.g. AUC-600"
                      value={newProduct.productCode}
                      onChange={(e) => setNewProduct({ ...newProduct, productCode: e.target.value.toUpperCase() })}
                    />
                  </div>
                  <div className="form-group">
                    <label className="form-label">SKU Number</label>
                    <input
                      type="text"
                      className="form-input"
                      placeholder="e.g. AUC-SD-600-PRO"
                      value={newProduct.sku}
                      onChange={(e) => setNewProduct({ ...newProduct, sku: e.target.value.toUpperCase() })}
                    />
                  </div>
                </div>

                <div className="grid-2">
                  <div className="form-group">
                    <label className="form-label">Category</label>
                    <select
                      className="form-select"
                      value={newProduct.category}
                      onChange={(e) => setNewProduct({ ...newProduct, category: e.target.value })}
                    >
                      <option value="Automation Hardware">Automation Hardware</option>
                      <option value="Sensors & IOT">Sensors & IOT</option>
                      <option value="Commercial AV">Commercial AV</option>
                      <option value="Acoustics & Testing">Acoustics & Testing</option>
                      <option value="Edge Computing">Edge Computing</option>
                      <option value="Services">Services</option>
                    </select>
                  </div>
                  <div className="form-group">
                    <label className="form-label">Product Unit Price (INR) *</label>
                    <input
                      type="number"
                      required
                      min="0"
                      className="form-input"
                      value={newProduct.price}
                      onChange={(e) => setNewProduct({ ...newProduct, price: Number(e.target.value) })}
                    />
                  </div>
                </div>

                <div className="grid-2">
                  <div className="form-group">
                    <label className="form-label">Initial Stock Units</label>
                    <input
                      type="number"
                      min="0"
                      className="form-input"
                      value={newProduct.currentStock}
                      onChange={(e) => setNewProduct({ ...newProduct, currentStock: Number(e.target.value) })}
                    />
                  </div>
                  <div className="form-group">
                    <label className="form-label">Minimum Stock Alert Level</label>
                    <input
                      type="number"
                      min="1"
                      className="form-input"
                      value={newProduct.minStockLevel}
                      onChange={(e) => setNewProduct({ ...newProduct, minStockLevel: Number(e.target.value) })}
                    />
                  </div>
                </div>

                <div className="form-group">
                  <label className="form-label">Supplier / Factory Origin</label>
                  <input
                    type="text"
                    className="form-input"
                    placeholder="e.g. Auco Dynamics Pune / Aiwa Labs"
                    value={newProduct.supplier}
                    onChange={(e) => setNewProduct({ ...newProduct, supplier: e.target.value })}
                  />
                </div>
              </div>

              <div className="modal-footer">
                <button type="button" className="btn btn-secondary" onClick={() => setShowAddModal(false)}>Cancel</button>
                <button type="submit" className="btn btn-primary">Save Product</button>
              </div>
            </form>
          </div>
        </div>
      )}

      {/* =========================================================================
          ADJUST STOCK MODAL
          ========================================================================= */}
      {showAdjustModal && (
        <div className="modal-backdrop" onClick={() => setShowAdjustModal(null)}>
          <div className="modal-content" onClick={(e) => e.stopPropagation()}>
            <form onSubmit={handleStockAdjustment}>
              <div className="modal-header">
                <div>
                  <span className="badge badge-purple">Stock Adjustment</span>
                  <h3 style={{ marginTop: '4px' }}>[{showAdjustModal.productCode}] {showAdjustModal.name}</h3>
                </div>
                <button type="button" className="btn btn-ghost btn-icon" onClick={() => setShowAdjustModal(null)}>✕</button>
              </div>

              <div className="modal-body">
                <div style={{ display: 'flex', justifyContent: 'space-between', padding: '12px 14px', background: 'var(--bg-subtle)', borderRadius: 'var(--radius-md)', marginBottom: '16px' }}>
                  <div>
                    <div style={{ fontSize: '0.72rem', color: 'var(--text-muted)' }}>CURRENT AVAILABLE</div>
                    <strong style={{ fontSize: '1.2rem' }}>{showAdjustModal.availableStock} Units</strong>
                  </div>
                  <div style={{ textAlign: 'right' }}>
                    <div style={{ fontSize: '0.72rem', color: 'var(--text-muted)' }}>MINIMUM LEVEL</div>
                    <strong style={{ fontSize: '1.2rem', color: 'var(--warning-text)' }}>{showAdjustModal.minStockLevel} Units</strong>
                  </div>
                </div>

                <div className="form-group">
                  <label className="form-label">Adjustment Type</label>
                  <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: '10px' }}>
                    <button
                      type="button"
                      className={`btn ${adjustType === 'ADD' ? 'btn-success' : 'btn-secondary'}`}
                      onClick={() => setAdjustType('ADD')}
                    >
                      <ArrowUp size={16} /> Stock In (Add Units)
                    </button>
                    <button
                      type="button"
                      className={`btn ${adjustType === 'REMOVE' ? 'btn-danger' : 'btn-secondary'}`}
                      onClick={() => setAdjustType('REMOVE')}
                    >
                      <ArrowDown size={16} /> Stock Out (Deduct Units)
                    </button>
                  </div>
                </div>

                <div className="form-group">
                  <label className="form-label">Number of Units *</label>
                  <input
                    type="number"
                    required
                    min="1"
                    className="form-input"
                    value={adjustAmount}
                    onChange={(e) => setAdjustAmount(e.target.value)}
                  />
                </div>
              </div>

              <div className="modal-footer">
                <button type="button" className="btn btn-secondary" onClick={() => setShowAdjustModal(null)}>Cancel</button>
                <button type="submit" className="btn btn-primary">Apply Stock Update</button>
              </div>
            </form>
          </div>
        </div>
      )}

      {/* =========================================================================
          EDIT PRODUCT MODAL
          ========================================================================= */}
      {editingProduct && (
        <div className="modal-backdrop" onClick={() => setEditingProduct(null)}>
          <div className="modal-content" onClick={(e) => e.stopPropagation()} style={{ maxWidth: '540px' }}>
            <form onSubmit={handleSaveProductEdit}>
              <div className="modal-header">
                <div>
                  <span className="badge badge-purple">{editingProduct.productCode}</span>
                  <h3 style={{ marginTop: '4px' }}>Edit Product SKU</h3>
                </div>
                <button type="button" className="btn btn-ghost btn-icon" onClick={() => setEditingProduct(null)}>
                  <X size={18} />
                </button>
              </div>

              <div className="modal-body" style={{ display: 'flex', flexDirection: 'column', gap: '14px' }}>
                <div className="form-group">
                  <label className="form-label">Product Name *</label>
                  <input
                    type="text"
                    required
                    className="form-input"
                    value={editProductData.name || ''}
                    onChange={(e) => setEditProductData({ ...editProductData, name: e.target.value })}
                  />
                </div>

                <div className="form-row">
                  <div className="form-group">
                    <label className="form-label">Unit Price (₹) *</label>
                    <input
                      type="number"
                      required
                      min="0"
                      className="form-input"
                      value={editProductData.price || 0}
                      onChange={(e) => setEditProductData({ ...editProductData, price: e.target.value })}
                    />
                  </div>
                  <div className="form-group">
                    <label className="form-label">Min Safety Stock Level *</label>
                    <input
                      type="number"
                      required
                      min="1"
                      className="form-input"
                      value={editProductData.minStockLevel || 5}
                      onChange={(e) => setEditProductData({ ...editProductData, minStockLevel: e.target.value })}
                    />
                  </div>
                </div>

                <div className="form-row">
                  <div className="form-group">
                    <label className="form-label">Category</label>
                    <select
                      className="form-select"
                      value={editProductData.category || 'Automation Hardware'}
                      onChange={(e) => setEditProductData({ ...editProductData, category: e.target.value })}
                    >
                      <option value="Automation Hardware">Automation Hardware</option>
                      <option value="Sensors & IOT">Sensors & IOT</option>
                      <option value="Commercial AV">Commercial AV</option>
                      <option value="Acoustics & Testing">Acoustics & Testing</option>
                      <option value="Edge Computing">Edge Computing</option>
                      <option value="Services">Services</option>
                    </select>
                  </div>
                  <div className="form-group">
                    <label className="form-label">Supplier Hub</label>
                    <input
                      type="text"
                      className="form-input"
                      value={editProductData.supplier || ''}
                      onChange={(e) => setEditProductData({ ...editProductData, supplier: e.target.value })}
                    />
                  </div>
                </div>
              </div>

              <div className="modal-footer">
                <button type="button" className="btn btn-secondary" onClick={() => setEditingProduct(null)}>
                  Cancel
                </button>
                <button type="submit" className="btn btn-primary">
                  Save Changes
                </button>
              </div>
            </form>
          </div>
        </div>
      )}
    </div>
  );
};
