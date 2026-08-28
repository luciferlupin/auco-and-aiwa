import React, { useState, useEffect } from 'react';
import { useApp } from '../context/AppContext';
import {
  X,
  Truck,
  Package,
  Calendar,
  MapPin,
  FileText,
  User,
  Phone,
  Mail,
  Sparkles,
  ShieldCheck,
  CheckCircle2,
  AlertCircle
} from 'lucide-react';
import { formatCurrency, formatDate, generateId } from '../utils/formatters';

export const DispatchOrderModal = ({
  isOpen,
  onClose,
  initialOrderId = null,
  onDispatchSuccess
}) => {
  const { orders, clients, users, currentUser, dispatchOrder, matchesCompany } = useApp();

  const [selectedOrderId, setSelectedOrderId] = useState(initialOrderId || '');
  const [formData, setFormData] = useState({
    courierCarrier: 'BlueDart Express',
    trackingNumber: '',
    ewayBillNumber: '',
    challanNumber: '',
    dispatchDate: new Date().toISOString().split('T')[0],
    estimatedDelivery: new Date(Date.now() + 3 * 86400000).toISOString().split('T')[0],
    packageCount: '1 Reinforced Carton',
    packageWeight: '6.5 kg',
    vehicleNumber: 'Air Cargo Express (BlueDart Hub)',
    contactPerson: '',
    phone: '',
    email: '',
    shippingAddress: '',
    dispatchedBy: currentUser?.name || 'Warehouse Dispatch Desk',
    dispatchStatus: 'Dispatched',
    notes: 'Precision equipment. Handle with extreme care. Keep upright and moisture-proof.'
  });

  // Available couriers
  const courierOptions = [
    'BlueDart Express',
    'Delhivery Surface',
    'Safexpress Logistics',
    'V-Trans Freight',
    'TCI Express',
    'DTDC Courier',
    'GATI-KWE Logistics',
    'Company Fleet (Direct Van)',
    'On-site Hand Delivery'
  ];

  // Eligible orders (scoped by brand if not ALL)
  const scopedOrders = orders.filter(matchesCompany);
  const eligibleOrders = scopedOrders.filter((o) => o.deliveryStatus !== 'Delivered');
  const availableOrders = eligibleOrders.length > 0 ? eligibleOrders : (scopedOrders.length > 0 ? scopedOrders : orders);

  // Selected Order details
  const currentOrder = orders.find((o) => o.id === selectedOrderId) || availableOrders[0] || null;
  const linkedClient = currentOrder
    ? clients.find((c) => c.id === currentOrder.clientId || c.clientName === currentOrder.clientName)
    : null;

  // Sync with selected order when opened or changed
  useEffect(() => {
    if (initialOrderId) {
      setSelectedOrderId(initialOrderId);
    } else if (!selectedOrderId && availableOrders.length > 0) {
      setSelectedOrderId(availableOrders[0].id);
    }
  }, [initialOrderId, isOpen, availableOrders]);

  useEffect(() => {
    if (currentOrder) {
      const randomAwb = `BLU-${Math.floor(1000000 + Math.random() * 9000000)}`;
      const randomEway = `2410-${Math.floor(1000 + Math.random() * 9000)}-${Math.floor(1000 + Math.random() * 9000)}`;
      const numCode = currentOrder.id.replace(/\D/g, '') || Math.floor(1000 + Math.random() * 9000);
      const generatedChallan = `DC-2026-${numCode}`;

      setFormData((prev) => ({
        ...prev,
        challanNumber: prev.challanNumber || generatedChallan,
        trackingNumber: prev.trackingNumber || randomAwb,
        ewayBillNumber: prev.ewayBillNumber || randomEway,
        contactPerson: linkedClient?.contactPerson || currentOrder.clientName,
        phone: linkedClient?.phone || '',
        email: linkedClient?.email || '',
        shippingAddress: linkedClient?.address ? `${linkedClient.address}, ${linkedClient.city}, ${linkedClient.state}` : 'Client Site Delivery Address',
        packageCount: `${currentOrder.quantity || 1} Box${(currentOrder.quantity || 1) > 1 ? 'es' : ''} (Heavy Duty Packing)`,
        packageWeight: `${Math.max(2, (currentOrder.quantity || 1) * 3.5).toFixed(1)} kg`
      }));
    }
  }, [selectedOrderId, currentOrder?.id]);

  if (!isOpen) return null;

  const handleAutoGenerateAwb = () => {
    const prefix = formData.courierCarrier.startsWith('BlueDart')
      ? 'BLU'
      : formData.courierCarrier.startsWith('Delhivery')
      ? 'DLV'
      : formData.courierCarrier.startsWith('Safexpress')
      ? 'SFX'
      : formData.courierCarrier.startsWith('V-Trans')
      ? 'VTR'
      : 'TRK';
    const num = Math.floor(1000000 + Math.random() * 9000000);
    setFormData({ ...formData, trackingNumber: `${prefix}-${num}` });
  };

  const handleAutoGenerateEway = () => {
    const p1 = Math.floor(1000 + Math.random() * 9000);
    const p2 = Math.floor(1000 + Math.random() * 9000);
    setFormData({ ...formData, ewayBillNumber: `2410-${p1}-${p2}` });
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    if (!currentOrder) return;

    const result = await dispatchOrder(currentOrder.id, {
      ...formData,
      companyName: linkedClient?.companyName || currentOrder.clientName,
      items: currentOrder.items || []
    });

    onClose();

    if (onDispatchSuccess && result) {
      onDispatchSuccess(result);
    }
  };

  return (
    <div className="modal-backdrop" onClick={onClose}>
      <div
        className="modal-content"
        style={{ maxWidth: '780px', maxHeight: '92vh', overflowY: 'auto' }}
        onClick={(e) => e.stopPropagation()}
      >
        <form onSubmit={handleSubmit}>
          {/* Header */}
          <div className="modal-header">
            <div style={{ display: 'flex', alignItems: 'center', gap: '10px' }}>
              <div
                style={{
                  width: '38px',
                  height: '38px',
                  borderRadius: '10px',
                  background: 'linear-gradient(135deg, #4f46e5 0%, #312e81 100%)',
                  display: 'flex',
                  alignItems: 'center',
                  justifyContent: 'center',
                  color: '#fff',
                  boxShadow: '0 4px 12px var(--primary-glow)'
                }}
              >
                <Truck size={20} />
              </div>
              <div>
                <h3 style={{ margin: 0 }}>Dispatch Client Order</h3>
                <p style={{ fontSize: '0.78rem', color: 'var(--text-muted)', margin: 0 }}>
                  Generate shipment tracking & initiate courier dispatch
                </p>
              </div>
            </div>
            <button type="button" className="btn btn-ghost btn-icon" onClick={onClose}>
              <X size={18} />
            </button>
          </div>

          <div className="modal-body" style={{ display: 'flex', flexDirection: 'column', gap: '18px' }}>
            {/* 1. Order Selection Banner */}
            <div
              style={{
                background: 'linear-gradient(135deg, #f8fafc 0%, #eff6ff 100%)',
                border: '1px solid #bfdbfe',
                borderRadius: 'var(--radius-md)',
                padding: '16px 18px'
              }}
            >
              <div className="grid-2" style={{ alignItems: 'center', gap: '16px' }}>
                <div>
                  <label className="form-label" style={{ fontWeight: 700, color: 'var(--primary-700)' }}>
                    Select Order to Dispatch *
                  </label>
                  <select
                    className="form-select"
                    value={selectedOrderId}
                    onChange={(e) => setSelectedOrderId(e.target.value)}
                    required
                    style={{ fontWeight: 600 }}
                  >
                    {availableOrders.map((ord) => (
                      <option key={ord.id} value={ord.id}>
                        {ord.id} — {ord.clientName} ({ord.productCode}) [{ord.deliveryStatus}]
                      </option>
                    ))}
                  </select>
                </div>

                {currentOrder && (
                  <div
                    style={{
                      background: 'rgba(255, 255, 255, 0.8)',
                      borderRadius: 'var(--radius-sm)',
                      padding: '10px 14px',
                      border: '1px solid var(--border-default)',
                      fontSize: '0.8rem'
                    }}
                  >
                    <div style={{ display: 'flex', justifyContent: 'space-between', marginBottom: '4px' }}>
                      <span style={{ color: 'var(--text-muted)' }}>Order Value:</span>
                      <strong style={{ color: 'var(--primary-600)' }}>{formatCurrency(currentOrder.orderValue)}</strong>
                    </div>
                    <div style={{ display: 'flex', justifyContent: 'space-between', marginBottom: '4px' }}>
                      <span style={{ color: 'var(--text-muted)' }}>Total Items / Units:</span>
                      <strong>{currentOrder.quantity} Units</strong>
                    </div>
                    <div style={{ display: 'flex', justifyContent: 'space-between' }}>
                      <span style={{ color: 'var(--text-muted)' }}>Order Date:</span>
                      <span>{formatDate(currentOrder.orderDate)}</span>
                    </div>
                  </div>
                )}
              </div>

              {/* Items checklist */}
              {currentOrder?.items && currentOrder.items.length > 0 && (
                <div style={{ marginTop: '12px', borderTop: '1px dashed #bfdbfe', paddingTop: '10px' }}>
                  <div style={{ fontSize: '0.74rem', fontWeight: 700, color: 'var(--text-secondary)', textTransform: 'uppercase', marginBottom: '6px' }}>
                    Items Manifest to be Packed:
                  </div>
                  <div style={{ display: 'flex', gap: '8px', flexWrap: 'wrap' }}>
                    {currentOrder.items.map((item, idx) => (
                      <div
                        key={idx}
                        style={{
                          background: '#ffffff',
                          border: '1px solid var(--border-default)',
                          borderRadius: '6px',
                          padding: '4px 8px',
                          fontSize: '0.76rem',
                          display: 'flex',
                          alignItems: 'center',
                          gap: '6px'
                        }}
                      >
                        <Package size={13} style={{ color: 'var(--primary-600)' }} />
                        <span style={{ fontWeight: 600 }}>{item.productCode}</span>: {item.name} × <strong>{item.quantity}</strong>
                      </div>
                    ))}
                  </div>
                </div>
              )}
            </div>

            {/* 2. Courier & Tracking Details */}
            <div style={{ border: '1px solid var(--border-default)', borderRadius: 'var(--radius-md)', padding: '16px' }}>
              <h4 style={{ fontSize: '0.88rem', color: 'var(--text-primary)', marginBottom: '12px', display: 'flex', alignItems: 'center', gap: '6px' }}>
                <Truck size={15} style={{ color: 'var(--primary-600)' }} />
                Transporter & Courier Details
              </h4>

              <div className="grid-3" style={{ gap: '12px' }}>
                <div className="form-group">
                  <label className="form-label">Courier Carrier *</label>
                  <select
                    className="form-select"
                    value={formData.courierCarrier}
                    onChange={(e) => setFormData({ ...formData, courierCarrier: e.target.value })}
                    required
                  >
                    {courierOptions.map((c) => (
                      <option key={c} value={c}>
                        {c}
                      </option>
                    ))}
                  </select>
                </div>

                <div className="form-group">
                  <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center' }}>
                    <label className="form-label">AWB / Tracking # *</label>
                    <button
                      type="button"
                      onClick={handleAutoGenerateAwb}
                      style={{ background: 'none', border: 'none', color: 'var(--primary-600)', fontSize: '0.7rem', cursor: 'pointer', display: 'flex', alignItems: 'center', gap: '2px' }}
                    >
                      <Sparkles size={11} /> Auto
                    </button>
                  </div>
                  <input
                    type="text"
                    required
                    className="form-input"
                    placeholder="e.g. BLU-8829103"
                    value={formData.trackingNumber}
                    onChange={(e) => setFormData({ ...formData, trackingNumber: e.target.value })}
                  />
                </div>

                <div className="form-group">
                  <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center' }}>
                    <label className="form-label">E-Way Bill # (GST)</label>
                    <button
                      type="button"
                      onClick={handleAutoGenerateEway}
                      style={{ background: 'none', border: 'none', color: 'var(--primary-600)', fontSize: '0.7rem', cursor: 'pointer', display: 'flex', alignItems: 'center', gap: '2px' }}
                    >
                      <Sparkles size={11} /> Auto
                    </button>
                  </div>
                  <input
                    type="text"
                    className="form-input"
                    placeholder="e.g. 2410-9876-5432"
                    value={formData.ewayBillNumber}
                    onChange={(e) => setFormData({ ...formData, ewayBillNumber: e.target.value })}
                  />
                </div>
              </div>

              <div className="grid-3" style={{ gap: '12px', marginTop: '10px' }}>
                <div className="form-group">
                  <label className="form-label">Dispatch Ref / Slip # *</label>
                  <input
                    type="text"
                    required
                    className="form-input"
                    placeholder="e.g. DSP-2026-1002"
                    value={formData.challanNumber}
                    onChange={(e) => setFormData({ ...formData, challanNumber: e.target.value })}
                  />
                </div>

                <div className="form-group">
                  <label className="form-label">Dispatch Date *</label>
                  <input
                    type="date"
                    required
                    className="form-input"
                    value={formData.dispatchDate}
                    onChange={(e) => setFormData({ ...formData, dispatchDate: e.target.value })}
                  />
                </div>

                <div className="form-group">
                  <label className="form-label">Estimated Delivery *</label>
                  <input
                    type="date"
                    required
                    className="form-input"
                    value={formData.estimatedDelivery}
                    onChange={(e) => setFormData({ ...formData, estimatedDelivery: e.target.value })}
                  />
                </div>
              </div>

              <div className="grid-3" style={{ gap: '12px', marginTop: '10px' }}>
                <div className="form-group">
                  <label className="form-label">Package Boxes / Type</label>
                  <input
                    type="text"
                    className="form-input"
                    placeholder="e.g. 2 Wooden Crates"
                    value={formData.packageCount}
                    onChange={(e) => setFormData({ ...formData, packageCount: e.target.value })}
                  />
                </div>

                <div className="form-group">
                  <label className="form-label">Gross Package Weight</label>
                  <input
                    type="text"
                    className="form-input"
                    placeholder="e.g. 14.5 kg"
                    value={formData.packageWeight}
                    onChange={(e) => setFormData({ ...formData, packageWeight: e.target.value })}
                  />
                </div>

                <div className="form-group">
                  <label className="form-label">Vehicle # / Hub Info</label>
                  <input
                    type="text"
                    className="form-input"
                    placeholder="e.g. MH-12-QX-4412"
                    value={formData.vehicleNumber}
                    onChange={(e) => setFormData({ ...formData, vehicleNumber: e.target.value })}
                  />
                </div>
              </div>
            </div>

            {/* 3. Consignee & Shipping Destination */}
            <div style={{ border: '1px solid var(--border-default)', borderRadius: 'var(--radius-md)', padding: '16px' }}>
              <h4 style={{ fontSize: '0.88rem', color: 'var(--text-primary)', marginBottom: '12px', display: 'flex', alignItems: 'center', gap: '6px' }}>
                <MapPin size={15} style={{ color: 'var(--primary-600)' }} />
                Consignee & Shipping Address
              </h4>

              <div className="grid-3" style={{ gap: '12px' }}>
                <div className="form-group">
                  <label className="form-label">Contact Person Name</label>
                  <input
                    type="text"
                    className="form-input"
                    placeholder="e.g. Ramesh Patel"
                    value={formData.contactPerson}
                    onChange={(e) => setFormData({ ...formData, contactPerson: e.target.value })}
                  />
                </div>

                <div className="form-group">
                  <label className="form-label">Phone / Mobile</label>
                  <input
                    type="text"
                    className="form-input"
                    placeholder="e.g. +91 98220 12345"
                    value={formData.phone}
                    onChange={(e) => setFormData({ ...formData, phone: e.target.value })}
                  />
                </div>

                <div className="form-group">
                  <label className="form-label">Email Address</label>
                  <input
                    type="email"
                    className="form-input"
                    placeholder="e.g. ramesh@acme.com"
                    value={formData.email}
                    onChange={(e) => setFormData({ ...formData, email: e.target.value })}
                  />
                </div>
              </div>

              <div className="form-group" style={{ marginTop: '10px' }}>
                <label className="form-label">Delivery Destination / Site Address *</label>
                <textarea
                  required
                  rows={2}
                  className="form-input"
                  placeholder="Complete shipping address with PIN code"
                  value={formData.shippingAddress}
                  onChange={(e) => setFormData({ ...formData, shippingAddress: e.target.value })}
                  style={{ resize: 'vertical' }}
                />
              </div>
            </div>

            {/* 4. Personnel & Special Instructions */}
            <div className="grid-2" style={{ gap: '12px' }}>
              <div className="form-group">
                <label className="form-label">Dispatched By / Field Rep</label>
                <select
                  className="form-select"
                  value={formData.dispatchedBy}
                  onChange={(e) => setFormData({ ...formData, dispatchedBy: e.target.value })}
                >
                  {users.map((u) => (
                    <option key={u.id} value={u.name}>
                      {u.name} ({u.role} - {u.department})
                    </option>
                  ))}
                </select>
              </div>

              <div className="form-group">
                <label className="form-label">Initial Dispatch Status</label>
                <select
                  className="form-select"
                  value={formData.dispatchStatus}
                  onChange={(e) => setFormData({ ...formData, dispatchStatus: e.target.value })}
                >
                  <option value="Dispatched">Dispatched (At Warehouse Dock)</option>
                  <option value="In Transit">In Transit (With Courier Carrier)</option>
                  <option value="Out for Delivery">Out for Delivery (Local Hub)</option>
                  <option value="Delivered">Delivered (Direct Handover)</option>
                </select>
              </div>
            </div>

            <div className="form-group">
              <label className="form-label">Special Handling & Packaging Notes</label>
              <input
                type="text"
                className="form-input"
                placeholder="e.g. Fragile electronics. Keep upright. Calibration certificate enclosed."
                value={formData.notes}
                onChange={(e) => setFormData({ ...formData, notes: e.target.value })}
              />
            </div>
          </div>

          {/* Footer */}
          <div className="modal-footer">
            <button type="button" className="btn btn-secondary" onClick={onClose}>
              Cancel
            </button>
            <button type="submit" className="btn btn-primary" style={{ display: 'flex', alignItems: 'center', gap: '6px' }}>
              <Truck size={16} /> Confirm & Dispatch Shipment
            </button>
          </div>
        </form>
      </div>
    </div>
  );
};
