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
  PackageCheck
} from 'lucide-react';
import { formatCurrency, formatDate, getStatusBadgeClass } from '../utils/formatters';

export const OrdersView = ({ onOpenOrderModal, onNavigate }) => {
  const { orders, updateOrderStatus } = useApp();
  const [searchQuery, setSearchQuery] = useState('');
  const [statusFilter, setStatusFilter] = useState('ALL');
  const [selectedOrder, setSelectedOrder] = useState(null);

  // Filter orders
  const filteredOrders = orders.filter((o) => {
    const matchesSearch =
      o.id.toLowerCase().includes(searchQuery.toLowerCase()) ||
      o.clientName.toLowerCase().includes(searchQuery.toLowerCase()) ||
      o.productCode.toLowerCase().includes(searchQuery.toLowerCase()) ||
      o.assignedTeamMember.toLowerCase().includes(searchQuery.toLowerCase());

    const matchesStatus = statusFilter === 'ALL' || o.deliveryStatus === statusFilter;
    return matchesSearch && matchesStatus;
  });

  // Calculate order metrics
  const totalOrdersCount = orders.length;
  const totalOrderValue = orders.reduce((acc, o) => acc + Number(o.orderValue || 0), 0);
  const avgOrderValue = totalOrdersCount > 0 ? Math.round(totalOrderValue / totalOrdersCount) : 0;
  const inProgressCount = orders.filter((o) => o.deliveryStatus === 'In Progress').length;
  const deliveredCount = orders.filter((o) => o.deliveryStatus === 'Delivered').length;

  return (
    <div style={{ display: 'flex', flexDirection: 'column', gap: '20px' }}>
      {/* Header */}
      <div className="flex-between">
        <div>
          <h2>Client Orders & Fulfillment</h2>
          <p style={{ fontSize: '0.82rem', color: 'var(--text-muted)' }}>
            Track client equipment orders, product code allocations, delivery status, and inventory stock deductions.
          </p>
        </div>
        <button className="btn btn-primary" onClick={onOpenOrderModal}>
          <Plus size={16} /> Create Order
        </button>
      </div>

      {/* Metric Cards */}
      <div className="grid-4">
        <div className="stat-card" style={{ borderLeft: '4px solid var(--primary-600)' }}>
          <div className="stat-header">
            <span className="stat-title">Total Orders Placed</span>
            <ShoppingCart size={18} style={{ color: 'var(--primary-600)' }} />
          </div>
          <div className="stat-value">{totalOrdersCount}</div>
          <div className="stat-subtext">Cumulative client bookings</div>
        </div>

        <div className="stat-card" style={{ borderLeft: '4px solid #10b981' }}>
          <div className="stat-header">
            <span className="stat-title">Total Booked Value</span>
            <PackageCheck size={18} style={{ color: '#10b981' }} />
          </div>
          <div className="stat-value">{formatCurrency(totalOrderValue)}</div>
          <div className="stat-subtext">Gross contract value</div>
        </div>

        <div className="stat-card" style={{ borderLeft: '4px solid #8b5cf6' }}>
          <div className="stat-header">
            <span className="stat-title">Average Order Value (AOV)</span>
            <Truck size={18} style={{ color: '#8b5cf6' }} />
          </div>
          <div className="stat-value">{formatCurrency(avgOrderValue)}</div>
          <div className="stat-subtext">Per order transaction avg</div>
        </div>

        <div className="stat-card" style={{ borderLeft: '4px solid #f59e0b' }}>
          <div className="stat-header">
            <span className="stat-title">Fulfillment Progress</span>
            <Clock size={18} style={{ color: '#f59e0b' }} />
          </div>
          <div className="stat-value">{inProgressCount} In Progress</div>
          <div className="stat-subtext">{deliveredCount} delivered successfully</div>
        </div>
      </div>

      {/* Filter and Search Bar */}
      <div className="card" style={{ padding: '14px 18px' }}>
        <div style={{ display: 'flex', gap: '14px', flexWrap: 'wrap', alignItems: 'center' }}>
          <div style={{ position: 'relative', flex: 1, minWidth: '240px' }}>
            <Search size={16} style={{ position: 'absolute', left: '12px', top: '50%', transform: 'translateY(-50%)', color: 'var(--text-muted)' }} />
            <input
              type="text"
              className="form-input"
              placeholder="Search order ID, client name, product code, team member..."
              value={searchQuery}
              onChange={(e) => setSearchQuery(e.target.value)}
              style={{ paddingLeft: '36px' }}
            />
          </div>

          <div style={{ display: 'flex', alignItems: 'center', gap: '8px' }}>
            <span style={{ fontSize: '0.8rem', color: 'var(--text-muted)', fontWeight: 600 }}>Delivery Status:</span>
            <select
              className="form-select"
              value={statusFilter}
              onChange={(e) => setStatusFilter(e.target.value)}
              style={{ width: '160px' }}
            >
              <option value="ALL">All Statuses</option>
              <option value="In Progress">In Progress</option>
              <option value="Delivered">Delivered</option>
              <option value="Pending">Pending</option>
            </select>
          </div>
        </div>
      </div>

      {/* Orders Table */}
      <div className="table-container">
        <table className="custom-table">
          <thead>
            <tr>
              <th>Order ID</th>
              <th>Client Name</th>
              <th>Products / Codes</th>
              <th>Quantity</th>
              <th>Order Value</th>
              <th>Order Date</th>
              <th>Delivery Status</th>
              <th>Payment Status</th>
              <th>Assigned Tech/Rep</th>
              <th>Action</th>
            </tr>
          </thead>
          <tbody>
            {filteredOrders.map((order) => (
              <tr key={order.id}>
                <td>
                  <strong style={{ color: 'var(--primary-600)' }}>{order.id}</strong>
                </td>
                <td>
                  <strong>{order.clientName}</strong>
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
                  <select
                    className="form-select"
                    value={order.deliveryStatus}
                    onChange={(e) => updateOrderStatus(order.id, { deliveryStatus: e.target.value })}
                    style={{ width: '130px', padding: '4px 6px', fontSize: '0.78rem' }}
                  >
                    <option value="In Progress">In Progress</option>
                    <option value="Delivered">Delivered</option>
                    <option value="Pending">Pending</option>
                  </select>
                </td>
                <td>
                  <span className={`badge ${getStatusBadgeClass(order.paymentStatus)}`}>
                    {order.paymentStatus}
                  </span>
                </td>
                <td style={{ fontSize: '0.8rem', color: 'var(--text-secondary)' }}>
                  {order.assignedTeamMember}
                </td>
                <td>
                  <button
                    className="btn btn-secondary btn-sm"
                    onClick={() => onNavigate('invoices')}
                    title="View Matching Invoice"
                  >
                    <FileText size={13} /> Invoice
                  </button>
                </td>
              </tr>
            ))}
          </tbody>
        </table>
      </div>
    </div>
  );
};
