import React, { useState } from 'react';
import { useApp } from '../context/AppContext';
import {
  ShoppingCart,
  Plus,
  Search,
  CheckCircle2,
  Clock,
  Truck,
  FileText,
  Filter,
  ArrowRight,
  PackageCheck,
  Package,
  Copy,
  ExternalLink,
  Download,
  Printer,
  Sparkles,
  MapPin,
  Calendar,
  Trash2
} from 'lucide-react';
import { formatCurrency, formatDate, getStatusBadgeClass } from '../utils/formatters';
import { DispatchOrderModal } from '../components/DispatchOrderModal';
import { DeliveryChallanModal } from '../components/DeliveryChallanModal';
import { generateDeliveryChallanPDF } from '../utils/pdfGenerator';

export const OrdersView = ({ onOpenOrderModal, onNavigate }) => {
  const { orders, dispatches, updateOrderStatus, updateDispatchStatus, deleteOrder, deleteDispatch, selectedCompany, companyBrands, matchesCompany, addToast } = useApp();
  const [activeTab, setActiveTab] = useState('orders'); // 'orders' | 'dispatches'
  const [searchQuery, setSearchQuery] = useState('');
  const [statusFilter, setStatusFilter] = useState('ALL');
  const [carrierFilter, setCarrierFilter] = useState('ALL');

  // Modals state
  const [isDispatchModalOpen, setIsDispatchModalOpen] = useState(false);
  const [selectedOrderForDispatch, setSelectedOrderForDispatch] = useState(null);
  const [isChallanModalOpen, setIsChallanModalOpen] = useState(false);
  const [selectedChallanDispatch, setSelectedChallanDispatch] = useState(null);

  // Scoped orders & dispatches by company
  const scopedOrders = orders.filter(matchesCompany);
  const scopedDispatches = dispatches.filter(matchesCompany);

  // Filter orders
  const filteredOrders = scopedOrders.filter((o) => {
    const matchesSearch =
      o.id.toLowerCase().includes(searchQuery.toLowerCase()) ||
      o.clientName.toLowerCase().includes(searchQuery.toLowerCase()) ||
      o.productCode.toLowerCase().includes(searchQuery.toLowerCase()) ||
      o.assignedTeamMember.toLowerCase().includes(searchQuery.toLowerCase()) ||
      (o.dispatchDetails?.trackingNumber && o.dispatchDetails.trackingNumber.toLowerCase().includes(searchQuery.toLowerCase())) ||
      (o.dispatchDetails?.challanNumber && o.dispatchDetails.challanNumber.toLowerCase().includes(searchQuery.toLowerCase()));

    const matchesStatus = statusFilter === 'ALL' || o.deliveryStatus === statusFilter;
    return matchesSearch && matchesStatus;
  });

  // Filter dispatches
  const filteredDispatches = scopedDispatches.filter((d) => {
    const matchesSearch =
      d.id.toLowerCase().includes(searchQuery.toLowerCase()) ||
      d.challanNumber.toLowerCase().includes(searchQuery.toLowerCase()) ||
      d.orderId.toLowerCase().includes(searchQuery.toLowerCase()) ||
      d.clientName.toLowerCase().includes(searchQuery.toLowerCase()) ||
      d.trackingNumber.toLowerCase().includes(searchQuery.toLowerCase()) ||
      d.courierCarrier.toLowerCase().includes(searchQuery.toLowerCase());

    const matchesStatus = statusFilter === 'ALL' || d.dispatchStatus === statusFilter;
    const matchesCarrier = carrierFilter === 'ALL' || d.courierCarrier === carrierFilter;
    return matchesSearch && matchesStatus && matchesCarrier;
  });

  // Calculate order metrics
  const totalOrdersCount = scopedOrders.length;
  const totalOrderValue = scopedOrders.reduce((acc, o) => acc + Number(o.orderValue || 0), 0);
  const activeDispatchesCount = scopedDispatches.filter((d) => d.dispatchStatus !== 'Delivered').length;
  const deliveredDispatchesCount = scopedDispatches.filter((d) => d.dispatchStatus === 'Delivered').length;
  const inProgressCount = scopedOrders.filter((o) => o.deliveryStatus === 'In Progress').length;
  const deliveredOrdersCount = scopedOrders.filter((o) => o.deliveryStatus === 'Delivered').length;

  const handleOpenDispatchForOrder = (orderId) => {
    setSelectedOrderForDispatch(orderId);
    setIsDispatchModalOpen(true);
  };

  const handleOpenChallanForOrder = (order) => {
    // Find matching dispatch record
    const match = scopedDispatches.find((d) => d.orderId === order.id || d.challanNumber === order.dispatchDetails?.challanNumber);
    if (match) {
      setSelectedChallanDispatch(match);
      setIsChallanModalOpen(true);
    } else if (order.dispatchDetails) {
      // Synthesize dispatch record
      const syntheticDispatch = {
        id: order.dispatchDetails.dispatchId || `DSP-${order.id}`,
        challanNumber: order.dispatchDetails.challanNumber || `DC-2026-${order.id.replace(/\D/g, '')}`,
        orderId: order.id,
        clientName: order.clientName,
        companyName: order.clientName,
        contactPerson: 'Authorized Store Incharge',
        phone: '+91 98220 12345',
        email: 'logistics@client.com',
        shippingAddress: 'Industrial Site Delivery, Maharashtra, India',
        items: order.items || [],
        courierCarrier: order.dispatchDetails.courierCarrier || 'BlueDart Express',
        trackingNumber: order.dispatchDetails.trackingNumber || 'AWB-1002003',
        ewayBillNumber: '2410-4455-6677',
        dispatchDate: order.dispatchDetails.dispatchDate || order.orderDate,
        estimatedDelivery: order.dispatchDetails.estimatedDelivery || '2026-08-31',
        packageCount: '1 Carton',
        packageWeight: '5.0 kg',
        vehicleNumber: 'Standard Logistics Carrier',
        dispatchedBy: order.assignedTeamMember || 'Operations Dispatcher',
        dispatchStatus: order.deliveryStatus === 'Delivered' ? 'Delivered' : 'Dispatched',
        notes: 'Handled with electronic transit insurance.'
      };
      setSelectedChallanDispatch(syntheticDispatch);
      setIsChallanModalOpen(true);
    } else {
      addToast('No Dispatch Record', `Order ${order.id} has not been dispatched yet. Click "Dispatch Order" to generate Challan.`, 'info');
    }
  };

  const handleDispatchSuccess = (dispatchRecord) => {
    setIsDispatchModalOpen(false);
    setSelectedChallanDispatch(dispatchRecord);
    setIsChallanModalOpen(true);
  };

  const handleDeleteOrder = (order) => {
    if (window.confirm(`Are you sure you want to delete order "${order.id}" for ${order.clientName}?`)) {
      deleteOrder(order.id);
    }
  };

  const handleDeleteDispatch = (disp) => {
    if (window.confirm(`Are you sure you want to delete Delivery Challan "${disp.challanNumber}" (${disp.courierCarrier} AWB #${disp.trackingNumber})?`)) {
      deleteDispatch(disp.id);
    }
  };

  const handleMarkDelivered = (dispatch) => {
    updateDispatchStatus(dispatch.id, 'Delivered', new Date().toISOString().split('T')[0]);
    if (dispatch.orderId) {
      updateOrderStatus(dispatch.orderId, 'Delivered');
    }
    addToast('Shipment Delivered', `Delivery confirmed for Challan ${dispatch.challanNumber}.`, 'success');
  };

  const handleCopyText = (text, label) => {
    navigator.clipboard.writeText(text);
    addToast('Copied to Clipboard', `${label || 'Text'} (${text}) copied.`, 'info');
  };

  const handleCopy = (text, id) => {
    navigator.clipboard.writeText(text);
    addToast('Copied to Clipboard', text, 'info');
  };

  return (
    <div style={{ display: 'flex', flexDirection: 'column', gap: '20px' }}>
      {/* Header */}
      <div className="flex-between">
        <div>
          <h2>Client Orders, Fulfillment & Dispatches</h2>
          <p style={{ fontSize: '0.82rem', color: 'var(--text-muted)' }}>
            Track client equipment bookings, generate government-compliant Delivery Challans, and track shipments in real time.
          </p>
        </div>
        <div style={{ display: 'flex', gap: '10px' }}>
          <button className="btn btn-secondary btn-sm" onClick={() => setActiveTab('dispatches')}>
            <Truck size={14} /> View All Challans
          </button>
          <button className="btn btn-primary btn-sm" onClick={onOpenOrderModal}>
            <Plus size={14} /> New Order
          </button>
        </div>
      </div>

      {/* Metric Cards */}
      <div className="grid-4">
        <div className="stat-card" style={{ borderLeft: '4px solid var(--primary-600)' }}>
          <div className="stat-header">
            <span className="stat-title">Total Orders</span>
            <ShoppingCart size={18} style={{ color: 'var(--primary-600)' }} />
          </div>
          <div className="stat-value">{totalOrdersCount}</div>
          <div className="stat-subtext">Booked customer orders</div>
        </div>

        <div className="stat-card" style={{ borderLeft: '4px solid #10b981' }}>
          <div className="stat-header">
            <span className="stat-title">Total Orders Value</span>
            <PackageCheck size={18} style={{ color: '#10b981' }} />
          </div>
          <div className="stat-value">{formatCurrency(totalOrderValue)}</div>
          <div className="stat-subtext">Cumulative booked revenue</div>
        </div>

        <div className="stat-card" style={{ borderLeft: '4px solid #f59e0b' }}>
          <div className="stat-header">
            <span className="stat-title">In-Transit / Dispatched</span>
            <Truck size={18} style={{ color: '#f59e0b' }} />
          </div>
          <div className="stat-value">{activeDispatchesCount} Dispatched</div>
          <div className="stat-subtext">{inProgressCount} orders pending / in progress</div>
        </div>

        <div className="stat-card" style={{ borderLeft: '4px solid #8b5cf6' }}>
          <div className="stat-header">
            <span className="stat-title">Delivered & Fulfilled</span>
            <CheckCircle2 size={18} style={{ color: '#8b5cf6' }} />
          </div>
          <div className="stat-value">{deliveredOrdersCount} Delivered</div>
          <div className="stat-subtext">{deliveredDispatchesCount} signed delivery challans</div>
        </div>
      </div>

      {/* View Switcher Tabs */}
      <div style={{ display: 'flex', borderBottom: '1px solid var(--border-default)', gap: '4px' }}>
        <button
          onClick={() => setActiveTab('orders')}
          style={{
            padding: '10px 18px',
            background: 'none',
            border: 'none',
            borderBottom: activeTab === 'orders' ? '2px solid var(--primary-600)' : '2px solid transparent',
            color: activeTab === 'orders' ? 'var(--primary-600)' : 'var(--text-secondary)',
            fontWeight: activeTab === 'orders' ? 700 : 500,
            fontSize: '0.9rem',
            cursor: 'pointer',
            display: 'flex',
            alignItems: 'center',
            gap: '8px',
            transition: 'all 0.15s ease'
          }}
        >
          <ShoppingCart size={16} />
          Orders Directory ({scopedOrders.length})
        </button>

        <button
          onClick={() => setActiveTab('dispatches')}
          style={{
            padding: '10px 18px',
            background: 'none',
            border: 'none',
            borderBottom: activeTab === 'dispatches' ? '2px solid var(--primary-600)' : '2px solid transparent',
            color: activeTab === 'dispatches' ? 'var(--primary-600)' : 'var(--text-secondary)',
            fontWeight: activeTab === 'dispatches' ? 700 : 500,
            fontSize: '0.9rem',
            cursor: 'pointer',
            display: 'flex',
            alignItems: 'center',
            gap: '8px',
            transition: 'all 0.15s ease'
          }}
        >
          <Truck size={16} />
          Dispatches & Delivery Challans ({scopedDispatches.length})
          {activeDispatchesCount > 0 && (
            <span
              style={{
                background: '#f59e0b',
                color: '#fff',
                borderRadius: '10px',
                padding: '2px 7px',
                fontSize: '0.7rem',
                fontWeight: 700
              }}
            >
              {activeDispatchesCount} Live
            </span>
          )}
        </button>
      </div>

      {/* Filter and Search Bar */}
      <div className="card" style={{ padding: '14px 18px' }}>
        <div style={{ display: 'flex', gap: '14px', flexWrap: 'wrap', alignItems: 'center' }}>
          <div style={{ position: 'relative', flex: 1, minWidth: '240px' }}>
            <Search size={16} style={{ position: 'absolute', left: '12px', top: '50%', transform: 'translateY(-50%)', color: 'var(--text-muted)' }} />
            <input
              type="text"
              className="form-input"
              placeholder={activeTab === 'orders' ? "Search order ID, client name, product code, AWB #, challan #..." : "Search Challan #, AWB tracking, courier, client name, order ID..."}
              value={searchQuery}
              onChange={(e) => setSearchQuery(e.target.value)}
              style={{ paddingLeft: '36px' }}
            />
          </div>

          <div style={{ display: 'flex', alignItems: 'center', gap: '8px' }}>
            <span style={{ fontSize: '0.8rem', color: 'var(--text-muted)', fontWeight: 600 }}>Status:</span>
            <select
              className="form-select"
              value={statusFilter}
              onChange={(e) => setStatusFilter(e.target.value)}
              style={{ width: '160px' }}
            >
              <option value="ALL">All Statuses</option>
              <option value="In Progress">In Progress</option>
              <option value="Dispatched">Dispatched</option>
              <option value="In Transit">In Transit</option>
              <option value="Out for Delivery">Out for Delivery</option>
              <option value="Delivered">Delivered</option>
              <option value="Pending">Pending</option>
            </select>
          </div>

          {activeTab === 'dispatches' && (
            <div style={{ display: 'flex', alignItems: 'center', gap: '8px' }}>
              <span style={{ fontSize: '0.8rem', color: 'var(--text-muted)', fontWeight: 600 }}>Carrier:</span>
              <select
                className="form-select"
                value={carrierFilter}
                onChange={(e) => setCarrierFilter(e.target.value)}
                style={{ width: '160px' }}
              >
                <option value="ALL">All Carriers</option>
                <option value="BlueDart Express">BlueDart Express</option>
                <option value="Delhivery Surface">Delhivery Surface</option>
                <option value="Safexpress Logistics">Safexpress Logistics</option>
                <option value="V-Trans Freight">V-Trans Freight</option>
              </select>
            </div>
          )}
        </div>
      </div>

      {/* TAB 1: ORDERS DIRECTORY */}
      {activeTab === 'orders' && (
        <div className="table-container">
          <table className="custom-table">
            <thead>
              <tr>
                <th>Order ID</th>
                <th>Client Name</th>
                <th>Products / Codes</th>
                <th>Qty</th>
                <th>Order Value</th>
                <th>Order Date</th>
                <th>Fulfillment & Dispatch</th>
                <th>Payment</th>
                <th>Assigned Rep</th>
                <th style={{ textAlign: 'right' }}>Actions</th>
              </tr>
            </thead>
            <tbody>
              {filteredOrders.map((order) => {
                const hasDispatch = !!order.dispatchDetails;
                const isDelivered = order.deliveryStatus === 'Delivered';

                return (
                  <tr key={order.id}>
                    <td>
                      <strong style={{ color: 'var(--primary-600)' }}>{order.id}</strong>
                    </td>
                    <td>
                      <div style={{ fontWeight: 600 }}>{order.clientName}</div>
                      {order.dispatchDetails?.challanNumber && (
                        <div style={{ fontSize: '0.72rem', color: 'var(--text-muted)' }}>
                          Challan: <span style={{ fontWeight: 600 }}>{order.dispatchDetails.challanNumber}</span>
                        </div>
                      )}
                    </td>
                    <td>
                      <span className="badge badge-neutral" style={{ fontSize: '0.72rem' }}>
                        {order.productCode}
                      </span>
                    </td>
                    <td style={{ textAlign: 'center' }}>
                      <span style={{ fontWeight: 700 }}>{order.quantity}</span>
                    </td>
                    <td>
                      <strong>{formatCurrency(order.orderValue)}</strong>
                    </td>
                    <td style={{ fontSize: '0.8rem' }}>
                      {formatDate(order.orderDate)}
                    </td>
                    <td>
                      <div style={{ display: 'flex', flexDirection: 'column', gap: '4px' }}>
                        <div style={{ display: 'flex', alignItems: 'center', gap: '6px' }}>
                          <span className={`badge ${getStatusBadgeClass(order.deliveryStatus)}`} style={{ fontSize: '0.72rem' }}>
                            {order.deliveryStatus}
                          </span>
                        </div>

                        {order.dispatchDetails?.courierCarrier ? (
                          <div
                            onClick={() => handleOpenChallanForOrder(order)}
                            style={{
                              fontSize: '0.72rem',
                              color: 'var(--primary-700)',
                              background: 'var(--primary-50)',
                              padding: '2px 6px',
                              borderRadius: '4px',
                              cursor: 'pointer',
                              display: 'inline-flex',
                              alignItems: 'center',
                              gap: '4px',
                              width: 'fit-content'
                            }}
                            title="Click to view Delivery Challan & Tracking"
                          >
                            <Truck size={11} />
                            <span>{order.dispatchDetails.courierCarrier.split(' ')[0]}</span> •
                            <span style={{ fontFamily: 'monospace' }}>{order.dispatchDetails.trackingNumber}</span>
                          </div>
                        ) : (
                          <span style={{ fontSize: '0.7rem', color: 'var(--text-muted)' }}>
                            Awaiting Dispatch
                          </span>
                        )}
                      </div>
                    </td>
                    <td>
                      <span className={`badge ${getStatusBadgeClass(order.paymentStatus)}`}>
                        {order.paymentStatus}
                      </span>
                    </td>
                    <td style={{ fontSize: '0.8rem', color: 'var(--text-secondary)' }}>
                      {order.assignedTeamMember}
                    </td>
                    <td style={{ textAlign: 'right' }}>
                      <div style={{ display: 'flex', justifyContent: 'flex-end', gap: '6px' }}>
                        {/* Dispatch or Challan Action */}
                        {hasDispatch ? (
                          <button
                            className="btn btn-secondary btn-sm"
                            onClick={() => handleOpenChallanForOrder(order)}
                            title="View Delivery Challan & Tracking"
                            style={{ padding: '4px 8px', fontSize: '0.76rem', display: 'flex', alignItems: 'center', gap: '4px' }}
                          >
                            <Truck size={13} style={{ color: 'var(--primary-600)' }} /> Challan
                          </button>
                        ) : (
                          <button
                            className="btn btn-primary btn-sm"
                            onClick={() => handleOpenDispatchForOrder(order.id)}
                            title="Dispatch Order & Generate Challan"
                            style={{ padding: '4px 8px', fontSize: '0.76rem', display: 'flex', alignItems: 'center', gap: '4px' }}
                          >
                            <Truck size={13} /> Dispatch
                          </button>
                        )}

                        <button
                          className="btn btn-secondary btn-sm"
                          onClick={() => onNavigate('invoices')}
                          title="View Invoice"
                          style={{ padding: '4px 8px', fontSize: '0.76rem' }}
                        >
                          <FileText size={13} />
                        </button>

                        <button
                          className="btn btn-ghost btn-sm"
                          onClick={() => handleDeleteOrder(order)}
                          title="Delete Order"
                          style={{ padding: '4px 8px', fontSize: '0.76rem', color: 'var(--danger-text)' }}
                        >
                          <Trash2 size={13} />
                        </button>
                      </div>
                    </td>
                  </tr>
                );
              })}
              {filteredOrders.length === 0 && (
                <tr>
                  <td colSpan="10" style={{ textAlign: 'center', padding: '48px 16px', color: 'var(--text-muted)' }}>
                    <ShoppingCart size={36} style={{ margin: '0 auto 10px', opacity: 0.4 }} />
                    <div style={{ fontWeight: 600, fontSize: '0.95rem' }}>No orders found</div>
                    <p style={{ fontSize: '0.8rem', marginTop: '4px' }}>Try adjusting your search query or status filter.</p>
                  </td>
                </tr>
              )}
            </tbody>
          </table>
        </div>
      )}

      {/* TAB 2: DISPATCHES & DELIVERY CHALLANS */}
      {activeTab === 'dispatches' && (
        <div style={{ display: 'flex', flexDirection: 'column', gap: '16px' }}>
          <div className="table-container">
            <table className="custom-table">
              <thead>
                <tr>
                  <th>Challan #</th>
                  <th>Order Ref</th>
                  <th>Consignee / Client</th>
                  <th>Transporter & AWB</th>
                  <th>E-Way Bill #</th>
                  <th>Dispatch Date</th>
                  <th>Est. Arrival</th>
                  <th>Packages / Weight</th>
                  <th>Status</th>
                  <th style={{ textAlign: 'right' }}>Action</th>
                </tr>
              </thead>
              <tbody>
                {filteredDispatches.map((disp) => (
                  <tr key={disp.id}>
                    <td>
                      <strong style={{ color: 'var(--primary-600)' }}>{disp.challanNumber || disp.id}</strong>
                    </td>
                    <td>
                      <span style={{ fontWeight: 600 }}>{disp.orderId}</span>
                    </td>
                    <td>
                      <div style={{ fontWeight: 600 }}>{disp.companyName || disp.clientName}</div>
                      <div style={{ fontSize: '0.72rem', color: 'var(--text-muted)' }}>
                        Attn: {disp.contactPerson || 'Store Lead'}
                      </div>
                    </td>
                    <td>
                      <div>
                        <span style={{ fontWeight: 600, color: 'var(--primary-700)' }}>{disp.courierCarrier}</span>
                      </div>
                      <div style={{ display: 'flex', alignItems: 'center', gap: '4px', marginTop: '2px' }}>
                        <span style={{ fontFamily: 'monospace', fontSize: '0.76rem', color: 'var(--text-secondary)' }}>
                          {disp.trackingNumber}
                        </span>
                        <button
                          onClick={() => handleCopyText(disp.trackingNumber, 'AWB Number')}
                          style={{ background: 'none', border: 'none', cursor: 'pointer', padding: '0 2px', color: 'var(--text-muted)' }}
                          title="Copy AWB Tracking #"
                        >
                          <Copy size={11} />
                        </button>
                      </div>
                    </td>
                    <td>
                      <span style={{ fontFamily: 'monospace', fontSize: '0.76rem', color: 'var(--text-secondary)' }}>
                        {disp.ewayBillNumber || '—'}
                      </span>
                    </td>
                    <td style={{ fontSize: '0.8rem' }}>
                      {formatDate(disp.dispatchDate)}
                    </td>
                    <td style={{ fontSize: '0.8rem' }}>
                      {formatDate(disp.estimatedDelivery)}
                    </td>
                    <td>
                      <div style={{ fontSize: '0.78rem', fontWeight: 600 }}>{disp.packageCount || '1 Carton'}</div>
                      <div style={{ fontSize: '0.72rem', color: 'var(--text-muted)' }}>{disp.packageWeight || '5 kg'}</div>
                    </td>
                    <td>
                      <select
                        className="form-select"
                        value={disp.dispatchStatus}
                        onChange={(e) => updateDispatchStatus(disp.id, e.target.value)}
                        style={{ width: '135px', padding: '3px 6px', fontSize: '0.76rem', fontWeight: 600 }}
                      >
                        <option value="Dispatched">Dispatched</option>
                        <option value="In Transit">In Transit</option>
                        <option value="Out for Delivery">Out for Delivery</option>
                        <option value="Delivered">Delivered</option>
                      </select>
                    </td>
                    <td style={{ textAlign: 'right' }}>
                      <div style={{ display: 'flex', justifyContent: 'flex-end', gap: '6px' }}>
                        <button
                          className="btn btn-secondary btn-sm"
                          onClick={() => {
                            setSelectedChallanDispatch(disp);
                            setIsChallanModalOpen(true);
                          }}
                          title="View Delivery Challan Slip"
                          style={{ padding: '4px 8px', fontSize: '0.76rem', display: 'flex', alignItems: 'center', gap: '4px' }}
                        >
                          <FileText size={13} /> View
                        </button>
                        <button
                          className="btn btn-secondary btn-sm"
                          onClick={() => {
                            generateDeliveryChallanPDF(disp);
                            addToast('PDF Downloaded', `Challan ${disp.challanNumber} saved.`, 'success');
                          }}
                          title="Download Delivery Challan PDF"
                          style={{ padding: '4px 8px', fontSize: '0.76rem' }}
                        >
                          <Download size={13} />
                        </button>
                        <button
                          className="btn btn-ghost btn-sm"
                          onClick={() => handleDeleteDispatch(disp)}
                          title="Delete Dispatch"
                          style={{ padding: '4px 8px', fontSize: '0.76rem', color: 'var(--danger-text)' }}
                        >
                          <Trash2 size={13} />
                        </button>
                      </div>
                    </td>
                  </tr>
                ))}
                {filteredDispatches.length === 0 && (
                  <tr>
                    <td colSpan="10" style={{ textAlign: 'center', padding: '48px 16px', color: 'var(--text-muted)' }}>
                      <Truck size={36} style={{ margin: '0 auto 10px', opacity: 0.4 }} />
                      <div style={{ fontWeight: 600, fontSize: '0.95rem' }}>No delivery challans found</div>
                      <p style={{ fontSize: '0.8rem', marginTop: '4px' }}>Try adjusting your search query, status, or carrier filter.</p>
                    </td>
                  </tr>
                )}
              </tbody>
            </table>
          </div>
        </div>
      )}

      {/* Dispatch Order Modal */}
      <DispatchOrderModal
        isOpen={isDispatchModalOpen}
        onClose={() => setIsDispatchModalOpen(false)}
        initialOrderId={selectedOrderForDispatch}
        onDispatchSuccess={handleDispatchSuccess}
      />

      {/* Delivery Challan Viewer & Print Modal */}
      <DeliveryChallanModal
        isOpen={isChallanModalOpen}
        onClose={() => setIsChallanModalOpen(false)}
        dispatch={selectedChallanDispatch}
      />
    </div>
  );
};
