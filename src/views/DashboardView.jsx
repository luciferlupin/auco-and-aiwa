import React from 'react';
import { useApp } from '../context/AppContext';
import {
  Users,
  Building2,
  ShoppingCart,
  CreditCard,
  CheckSquare,
  TrendingUp,
  AlertTriangle,
  Clock,
  ArrowUpRight,
  ArrowRight,
  ShieldCheck,
  Wrench,
  Boxes,
  FileText,
  Calendar,
  MessageSquare,
  Plus,
  Zap,
  MapPin,
  RefreshCw
} from 'lucide-react';
import { formatCurrency, formatDate, getStatusBadgeClass, getWhatsAppUrl } from '../utils/formatters';

export const DashboardView = ({ onNavigate, onOpenLeadModal, onOpenOrderModal, onOpenInvoiceModal, onOpenTaskModal }) => {
  const {
    currentRole,
    currentUser,
    clients,
    leads,
    orders,
    inventory,
    invoices,
    payments,
    tasks,
    followUps,
    users,
    companyBrands,
    selectedCompany,
    setSelectedCompany,
    matchesCompany
  } = useApp();

  const activeBrand = companyBrands.find((b) => b.id === selectedCompany) || companyBrands[0];

  // Scoped collections based on selected company
  const scopedClients = clients.filter(matchesCompany);
  const scopedLeads = leads.filter(matchesCompany);
  const scopedOrders = orders.filter(matchesCompany);
  const scopedInventory = inventory.filter(matchesCompany);
  const scopedInvoices = invoices.filter(matchesCompany);
  const scopedPayments = payments.filter(matchesCompany);
  const scopedTasks = tasks.filter(matchesCompany);
  const scopedFollowUps = followUps.filter(matchesCompany);

  // Admin / General Aggregates
  const totalClients = scopedClients.length;
  const totalLeads = scopedLeads.length;
  const convertedLeads = scopedLeads.filter((l) => l.conversionStatus === 'Converted').length;
  const conversionRate = totalLeads > 0 ? Math.round((convertedLeads / totalLeads) * 100) : 0;
  const totalOrders = scopedOrders.length;
  const totalOrderRevenue = scopedOrders.reduce((acc, o) => acc + Number(o.orderValue || 0), 0);
  
  const pendingInvoices = scopedInvoices.filter((i) => i.balance > 0);
  const totalOutstanding = scopedInvoices.reduce((acc, i) => acc + Number(i.balance || 0), 0);
  const overdueInvoices = scopedInvoices.filter((i) => i.paymentStatus === 'Overdue');
  const overdueAmount = overdueInvoices.reduce((acc, i) => acc + Number(i.balance || 0), 0);

  const activeTasks = scopedTasks.filter((t) => t.status !== 'Completed');
  const completedTasks = scopedTasks.filter((t) => t.status === 'Completed');
  const urgentTasks = scopedTasks.filter((t) => t.priority === 'Urgent' && t.status !== 'Completed');

  const lowStockProducts = scopedInventory.filter((p) => p.availableStock <= p.minStockLevel);

  // Sales-specific aggregates
  const myLeads = scopedLeads.filter((l) => !l.assignedSalesperson || l.assignedSalesperson.includes(currentUser.name) || currentRole === 'Admin');
  const pipelineValue = myLeads.filter(l => l.conversionStatus !== 'Converted' && l.stage !== 'Lost').reduce((acc, l) => acc + Number(l.expectedValue || 0), 0);
  const upcomingFollowUps = scopedFollowUps.filter((f) => f.status === 'Pending').slice(0, 5);

  // Accounts-specific aggregates
  const totalCollected = scopedInvoices.reduce((acc, i) => acc + Number(i.amountPaid || 0), 0);
  const totalInvoiced = scopedInvoices.reduce((acc, i) => acc + Number(i.totalAmount || 0), 0);

  // Services-specific aggregates
  const activeServiceOrders = scopedOrders.filter((o) => o.deliveryStatus !== 'Delivered');
  const myTasks = scopedTasks.filter((t) => !t.assignedPerson || t.assignedPerson.includes(currentUser.name) || currentRole === 'Admin');

  // Lead stages distribution
  const leadStages = ['New Lead', 'Contacted', 'Qualified', 'Proposal', 'Negotiation', 'Won', 'Lost'];
  const leadStageCounts = leadStages.reduce((acc, stage) => {
    acc[stage] = scopedLeads.filter((l) => l.stage === stage).length;
    return acc;
  }, {});

  return (
    <div style={{ display: 'flex', flexDirection: 'column', gap: '24px' }}>
      {/* Top Banner / Welcome Bar with Company Tabs */}
      <div
        style={{
          background: selectedCompany === 'AUCO'
            ? 'linear-gradient(135deg, #1e3a8a 0%, #1e40af 50%, #0369a1 100%)'
            : (selectedCompany === 'AIWA'
              ? 'linear-gradient(135deg, #4c1d95 0%, #6d28d9 50%, #be185d 100%)'
              : 'linear-gradient(135deg, #1e1b4b 0%, #312e81 50%, #4338ca 100%)'),
          borderRadius: 'var(--radius-xl)',
          padding: '28px 32px',
          color: '#ffffff',
          display: 'flex',
          justifyContent: 'space-between',
          alignItems: 'center',
          flexWrap: 'wrap',
          gap: '20px',
          boxShadow: 'var(--shadow-lg)',
          position: 'relative',
          overflow: 'hidden'
        }}
      >
        <div style={{ position: 'relative', zIndex: 2 }}>
          <div style={{ display: 'flex', alignItems: 'center', gap: '10px', marginBottom: '8px' }}>
            <span className="badge badge-purple" style={{ background: 'rgba(255,255,255,0.18)', color: '#fff', border: '1px solid rgba(255,255,255,0.3)', backdropFilter: 'blur(8px)' }}>
              {currentRole} Dashboard
            </span>
            <span style={{ fontSize: '0.78rem', color: 'rgba(255,255,255,0.85)', fontWeight: 600 }}>
              🏢 Workspace: {activeBrand.name}
            </span>
          </div>

          <h1 style={{ color: '#ffffff', fontSize: '1.75rem', fontWeight: 800, margin: 0 }}>
            Welcome, {currentUser?.name || 'User'}
          </h1>
          <p style={{ color: 'rgba(255,255,255,0.8)', fontSize: '0.86rem', margin: '6px 0 0 0' }}>
            {activeBrand.tagline} • Real-time sales, inventory, orders & accounts tracking.
          </p>
          <p style={{ color: 'rgba(255,255,255,0.85)', fontSize: '0.88rem', marginTop: '4px', maxWidth: '640px', lineHeight: 1.4 }}>
            {currentRole === 'Admin' && 'Unified business management: Control sales pipeline, inventory stock levels, invoice billing, and team task delivery.'}
            {currentRole === 'Sales' && 'Pipeline command: Manage active leads, follow-ups, quotes, and 1-click client conversions.'}
            {currentRole === 'Accounts' && 'Finance command: Manage GST tax invoices, track overdue payments, and calculate outstanding receivables.'}
            {currentRole === 'Services' && 'Service & delivery command: Manage hardware deployments, client requirements, and field operations.'}
          </p>
        </div>

        {/* Company Quick-Switch Tabs in Header */}
        <div style={{ position: 'relative', zIndex: 2, display: 'flex', gap: '8px', background: 'rgba(0,0,0,0.22)', padding: '6px', borderRadius: 'var(--radius-lg)', backdropFilter: 'blur(10px)' }}>
          {companyBrands.map((b) => {
            const isSelected = selectedCompany === b.id;
            return (
              <button
                key={b.id}
                onClick={() => setSelectedCompany(b.id)}
                style={{
                  padding: '6px 12px',
                  borderRadius: 'var(--radius-md)',
                  background: isSelected ? '#ffffff' : 'transparent',
                  color: isSelected ? '#0f172a' : 'rgba(255,255,255,0.8)',
                  fontWeight: isSelected ? 700 : 500,
                  fontSize: '0.78rem',
                  border: 'none',
                  cursor: 'pointer',
                  transition: 'all 0.15s ease'
                }}
              >
                {b.shortName}
              </button>
            );
          })}
        </div>

        {/* Quick actions for current role */}
        <div style={{ display: 'flex', gap: '10px', flexWrap: 'wrap', position: 'relative', zIndex: 2 }}>
          {currentRole === 'Admin' && (
            <>
              <button
                className="btn btn-secondary btn-sm"
                onClick={onOpenTaskModal}
                style={{ background: 'rgba(255,255,255,0.15)', color: '#fff', border: '1px solid rgba(255,255,255,0.3)', backdropFilter: 'blur(8px)' }}
              >
                <Plus size={14} /> Assign Task
              </button>
              <button
                className="btn btn-sm"
                onClick={onOpenOrderModal}
                style={{ background: '#ffffff', color: '#312e81', fontWeight: 700, boxShadow: '0 4px 14px rgba(0,0,0,0.15)' }}
              >
                <ShoppingCart size={14} /> New Order
              </button>
            </>
          )}
          {currentRole === 'Sales' && (
            <>
              <button
                className="btn btn-secondary btn-sm"
                onClick={onOpenLeadModal}
                style={{ background: 'rgba(255,255,255,0.15)', color: '#fff', border: '1px solid rgba(255,255,255,0.3)' }}
              >
                <Plus size={14} /> Add Lead
              </button>
              <button
                className="btn btn-sm"
                onClick={onOpenOrderModal}
                style={{ background: '#ffffff', color: '#065f46', fontWeight: 700 }}
              >
                <ShoppingCart size={14} /> Create Order
              </button>
            </>
          )}
          {currentRole === 'Accounts' && (
            <button
              className="btn btn-sm"
              onClick={onOpenInvoiceModal}
              style={{ background: '#ffffff', color: '#92400e', fontWeight: 700 }}
            >
              <FileText size={14} /> Generate Tax Invoice
            </button>
          )}
          {currentRole === 'Services' && (
            <button
              className="btn btn-sm"
              onClick={onOpenTaskModal}
              style={{ background: '#ffffff', color: '#4c1d95', fontWeight: 700 }}
            >
              <Wrench size={14} /> Log Service Task
            </button>
          )}
        </div>
      </div>

      {/* =========================================================================
          ADMIN DASHBOARD VIEW
          ========================================================================= */}
      {currentRole === 'Admin' && (
        <>
          {/* Main 4 Metric Cards */}
          <div className="grid-4">
            <div className="stat-card" style={{ borderLeft: '4px solid var(--primary-600)' }}>
              <div className="stat-header">
                <span className="stat-title">Total Active Clients</span>
                <div className="stat-icon-wrapper" style={{ background: 'var(--primary-50)', color: 'var(--primary-600)' }}>
                  <Building2 size={18} />
                </div>
              </div>
              <div className="stat-value">{totalClients}</div>
              <div className="stat-subtext">Across India client network</div>
            </div>

            <div className="stat-card" style={{ borderLeft: '4px solid #10b981' }}>
              <div className="stat-header">
                <span className="stat-title">Lead Conversion Rate</span>
                <div className="stat-icon-wrapper" style={{ background: '#ecfdf5', color: '#10b981' }}>
                  <TrendingUp size={18} />
                </div>
              </div>
              <div className="stat-value">{conversionRate}%</div>
              <div className="stat-subtext">{convertedLeads} converted of {totalLeads} total prospects</div>
            </div>

            <div className="stat-card" style={{ borderLeft: '4px solid #f59e0b' }}>
              <div className="stat-header">
                <span className="stat-title">Total Outstanding (AR)</span>
                <div className="stat-icon-wrapper" style={{ background: '#fffbeb', color: '#f59e0b' }}>
                  <CreditCard size={18} />
                </div>
              </div>
              <div className="stat-value">{formatCurrency(totalOutstanding)}</div>
              <div className="stat-subtext" style={{ color: overdueInvoices.length > 0 ? 'var(--danger-text)' : 'inherit', fontWeight: overdueInvoices.length > 0 ? 600 : 'normal' }}>
                {overdueInvoices.length} invoices overdue ({formatCurrency(overdueAmount)})
              </div>
            </div>

            <div className="stat-card" style={{ borderLeft: '4px solid #8b5cf6' }}>
              <div className="stat-header">
                <span className="stat-title">Team Task Execution</span>
                <div className="stat-icon-wrapper" style={{ background: '#faf5ff', color: '#8b5cf6' }}>
                  <CheckSquare size={18} />
                </div>
              </div>
              <div className="stat-value">{activeTasks.length} Active</div>
              <div className="stat-subtext">{completedTasks.length} tasks completed successfully</div>
            </div>
          </div>

          {/* Business Overview & Sales Performance */}
          <div style={{ display: 'grid', gridTemplateColumns: 'minmax(0, 1.4fr) minmax(0, 1fr)', gap: '20px' }}>
            {/* Sales Pipeline & Conversion Chart */}
            <div className="card">
              <div className="flex-between" style={{ marginBottom: '16px' }}>
                <div>
                  <h3>Sales Pipeline Stages</h3>
                  <p style={{ fontSize: '0.8rem', color: 'var(--text-muted)' }}>Distribution of current prospect opportunities</p>
                </div>
                <button className="btn btn-ghost btn-sm" onClick={() => onNavigate('leads')}>
                  View Pipeline <ArrowRight size={14} />
                </button>
              </div>

              <div style={{ display: 'flex', flexDirection: 'column', gap: '10px' }}>
                {leadStages.map((stage) => {
                  const count = leadStageCounts[stage] || 0;
                  const pct = totalLeads > 0 ? Math.round((count / totalLeads) * 100) : 0;
                  const isWon = stage === 'Won';
                  const isLost = stage === 'Lost';
                  return (
                    <div key={stage} style={{ display: 'flex', alignItems: 'center', gap: '12px' }}>
                      <div style={{ width: '105px', fontSize: '0.82rem', fontWeight: 600, color: 'var(--text-secondary)' }}>
                        {stage}
                      </div>
                      <div style={{ flex: 1, height: '20px', background: 'var(--bg-subtle)', borderRadius: '6px', overflow: 'hidden', display: 'flex' }}>
                        <div
                          style={{
                            width: `${Math.max(6, pct)}%`,
                            background: isWon ? '#10b981' : (isLost ? '#ef4444' : 'var(--primary-600)'),
                            borderRadius: '6px',
                            transition: 'width 0.3s ease'
                          }}
                        />
                      </div>
                      <div style={{ width: '65px', textAlign: 'right', fontSize: '0.82rem', fontWeight: 700 }}>
                        {count} <span style={{ color: 'var(--text-muted)', fontSize: '0.72rem' }}>({pct}%)</span>
                      </div>
                    </div>
                  );
                })}
              </div>
            </div>

            {/* Team Performance Overview */}
            <div className="card">
              <div className="flex-between" style={{ marginBottom: '16px' }}>
                <div>
                  <h3>Team Workload & Performance</h3>
                  <p style={{ fontSize: '0.8rem', color: 'var(--text-muted)' }}>Task delivery across departments</p>
                </div>
                <button className="btn btn-ghost btn-sm" onClick={() => onNavigate('tasks')}>
                  All Tasks <ArrowRight size={14} />
                </button>
              </div>

              <div style={{ display: 'flex', flexDirection: 'column', gap: '10px' }}>
                {users.map((u) => {
                  const userTasks = scopedTasks.filter((t) => t.assignedPerson.includes(u.name));
                  const userCompleted = userTasks.filter((t) => t.status === 'Completed').length;
                  const userPending = userTasks.length - userCompleted;
                  return (
                    <div
                      key={u.id}
                      style={{
                        padding: '10px 12px',
                        background: 'var(--bg-subtle)',
                        borderRadius: 'var(--radius-md)',
                        display: 'flex',
                        alignItems: 'center',
                        justifyContent: 'space-between'
                      }}
                    >
                      <div style={{ display: 'flex', alignItems: 'center', gap: '10px' }}>
                        <div style={{ width: '34px', height: '34px', borderRadius: '10px', background: 'linear-gradient(135deg, #4f46e5 0%, #312e81 100%)', color: '#fff', display: 'flex', alignItems: 'center', justifyContent: 'center', fontWeight: 700, fontSize: '0.78rem' }}>
                          {u.avatar}
                        </div>
                        <div>
                          <div style={{ fontWeight: 600, fontSize: '0.85rem' }}>{u.name}</div>
                          <div style={{ fontSize: '0.72rem', color: 'var(--text-muted)' }}>{u.department} ({u.role})</div>
                        </div>
                      </div>
                      <div style={{ textAlign: 'right' }}>
                        <span className="badge badge-info">{userPending} Pending</span>
                        <div style={{ fontSize: '0.72rem', color: 'var(--text-muted)', marginTop: '2px' }}>
                          {userCompleted} completed
                        </div>
                      </div>
                    </div>
                  );
                })}
              </div>
            </div>
          </div>

          {/* Recent Orders & Low Stock Warning */}
          <div style={{ display: 'grid', gridTemplateColumns: 'minmax(0, 1.4fr) minmax(0, 1fr)', gap: '20px' }}>
            <div className="card">
              <div className="flex-between" style={{ marginBottom: '14px' }}>
                <div>
                  <h3>Recent Client Orders</h3>
                  <p style={{ fontSize: '0.8rem', color: 'var(--text-muted)' }}>Latest equipment bookings & line items</p>
                </div>
                <button className="btn btn-ghost btn-sm" onClick={() => onNavigate('orders')}>
                  View All <ArrowRight size={14} />
                </button>
              </div>

              <div className="table-container">
                <table className="custom-table">
                  <thead>
                    <tr>
                      <th>Order ID</th>
                      <th>Client</th>
                      <th>Items</th>
                      <th>Value</th>
                      <th>Status</th>
                    </tr>
                  </thead>
                  <tbody>
                    {scopedOrders.slice(0, 4).map((o) => (
                      <tr key={o.id}>
                        <td><strong>{o.id}</strong></td>
                        <td>{o.clientName}</td>
                        <td style={{ fontSize: '0.78rem', color: 'var(--text-muted)' }}>{o.productCode}</td>
                        <td><strong>{formatCurrency(o.orderValue)}</strong></td>
                        <td><span className={`badge ${getStatusBadgeClass(o.deliveryStatus)}`}>{o.deliveryStatus}</span></td>
                      </tr>
                    ))}
                  </tbody>
                </table>
              </div>
            </div>

            {/* Low Stock Alerts */}
            <div className="card">
              <div className="flex-between" style={{ marginBottom: '14px' }}>
                <div>
                  <h3>Inventory Watch</h3>
                  <p style={{ fontSize: '0.8rem', color: 'var(--text-muted)' }}>Stock availability & safety thresholds</p>
                </div>
                <button className="btn btn-ghost btn-sm" onClick={() => onNavigate('inventory')}>
                  Manage Stock <ArrowRight size={14} />
                </button>
              </div>

              <div style={{ display: 'flex', flexDirection: 'column', gap: '8px' }}>
                {scopedInventory.slice(0, 4).map((p) => {
                  const isLow = p.availableStock <= p.minStockLevel;
                  return (
                    <div
                      key={p.id}
                      style={{
                        padding: '10px 12px',
                        background: isLow ? 'var(--warning-bg)' : 'var(--bg-subtle)',
                        border: `1px solid ${isLow ? 'var(--warning-border)' : 'transparent'}`,
                        borderRadius: 'var(--radius-md)',
                        display: 'flex',
                        alignItems: 'center',
                        justifyContent: 'space-between'
                      }}
                    >
                      <div>
                        <div style={{ fontWeight: 600, fontSize: '0.84rem' }}>
                          <strong style={{ color: 'var(--primary-600)' }}>[{p.productCode}]</strong> {p.name}
                        </div>
                        <div style={{ fontSize: '0.72rem', color: 'var(--text-muted)' }}>
                          Supplier: {p.supplier} • Unit Price: {formatCurrency(p.price)}
                        </div>
                      </div>
                      <div style={{ textAlign: 'right' }}>
                        <div style={{ fontWeight: 800, fontSize: '0.95rem', color: isLow ? 'var(--warning-text)' : 'var(--text-primary)' }}>
                          {p.availableStock} Units
                        </div>
                        {isLow ? (
                          <span className="badge badge-warning" style={{ fontSize: '0.68rem' }}>Low Stock</span>
                        ) : (
                          <span className="badge badge-success" style={{ fontSize: '0.68rem' }}>In Stock</span>
                        )}
                      </div>
                    </div>
                  );
                })}
              </div>
            </div>
          </div>
        </>
      )}

      {/* =========================================================================
          SALES DASHBOARD VIEW
          ========================================================================= */}
      {currentRole === 'Sales' && (
        <>
          <div className="grid-4">
            <div className="stat-card" style={{ borderLeft: '4px solid #10b981' }}>
              <div className="stat-header">
                <span className="stat-title">Active Pipeline Leads</span>
                <Users size={18} style={{ color: '#10b981' }} />
              </div>
              <div className="stat-value">{myLeads.filter(l => l.conversionStatus !== 'Converted' && l.stage !== 'Lost').length} Leads</div>
              <div className="stat-subtext">{formatCurrency(pipelineValue)} weighted pipeline</div>
            </div>

            <div className="stat-card" style={{ borderLeft: '4px solid var(--primary-600)' }}>
              <div className="stat-header">
                <span className="stat-title">Conversion Win Rate</span>
                <TrendingUp size={18} style={{ color: 'var(--primary-600)' }} />
              </div>
              <div className="stat-value">{conversionRate}%</div>
              <div className="stat-subtext">{convertedLeads} deals won this month</div>
            </div>

            <div className="stat-card" style={{ borderLeft: '4px solid #f59e0b' }}>
              <div className="stat-header">
                <span className="stat-title">Pending Follow-Ups</span>
                <Clock size={18} style={{ color: '#f59e0b' }} />
              </div>
              <div className="stat-value">{upcomingFollowUps.length} Actions</div>
              <div className="stat-subtext">Due today / upcoming</div>
            </div>

            <div className="stat-card" style={{ borderLeft: '4px solid #8b5cf6' }}>
              <div className="stat-header">
                <span className="stat-title">Total Orders Value</span>
                <ShoppingCart size={18} style={{ color: '#8b5cf6' }} />
              </div>
              <div className="stat-value">{formatCurrency(totalOrderRevenue)}</div>
              <div className="stat-subtext">{totalOrders} client orders booked</div>
            </div>
          </div>

          <div style={{ display: 'grid', gridTemplateColumns: 'minmax(0, 1.4fr) minmax(0, 1fr)', gap: '20px' }}>
            <div className="card">
              <div className="flex-between" style={{ marginBottom: '14px' }}>
                <div>
                  <h3>Priority Leads in Pipeline</h3>
                  <p style={{ fontSize: '0.8rem', color: 'var(--text-muted)' }}>Follow up with high-value prospects</p>
                </div>
                <button className="btn btn-ghost btn-sm" onClick={() => onNavigate('leads')}>
                  Pipeline Board <ArrowRight size={14} />
                </button>
              </div>

              <div className="table-container">
                <table className="custom-table">
                  <thead>
                    <tr>
                      <th>Company</th>
                      <th>Contact</th>
                      <th>Expected Value</th>
                      <th>Stage</th>
                      <th>WhatsApp</th>
                    </tr>
                  </thead>
                  <tbody>
                    {myLeads.slice(0, 5).map((l) => (
                      <tr key={l.id}>
                        <td>
                          <strong>{l.company}</strong>
                          <div style={{ fontSize: '0.72rem', color: 'var(--text-muted)' }}>{l.city}, {l.state}</div>
                        </td>
                        <td>{l.client}</td>
                        <td><strong>{formatCurrency(l.expectedValue)}</strong></td>
                        <td><span className={`badge ${getStatusBadgeClass(l.stage)}`}>{l.stage}</span></td>
                        <td>
                          <a
                            href={getWhatsAppUrl(l.phone, `Hi ${l.client}, following up on your inquiry with Auco & Aiwa.`)}
                            target="_blank"
                            rel="noreferrer"
                            className="badge badge-whatsapp"
                          >
                            <MessageSquare size={12} /> Chat
                          </a>
                        </td>
                      </tr>
                    ))}
                  </tbody>
                </table>
              </div>
            </div>

            <div className="card">
              <div className="flex-between" style={{ marginBottom: '14px' }}>
                <div>
                  <h3>Scheduled Follow-Ups</h3>
                  <p style={{ fontSize: '0.8rem', color: 'var(--text-muted)' }}>Upcoming client interactions</p>
                </div>
                <button className="btn btn-ghost btn-sm" onClick={() => onNavigate('followups')}>
                  All Follow-ups <ArrowRight size={14} />
                </button>
              </div>

              <div style={{ display: 'flex', flexDirection: 'column', gap: '8px' }}>
                {upcomingFollowUps.map((f) => (
                  <div
                    key={f.id}
                    style={{
                      padding: '10px 12px',
                      background: 'var(--bg-subtle)',
                      borderRadius: 'var(--radius-md)',
                      display: 'flex',
                      alignItems: 'center',
                      justifyContent: 'space-between'
                    }}
                  >
                    <div>
                      <div style={{ fontWeight: 600, fontSize: '0.84rem' }}>{f.clientName}</div>
                      <div style={{ fontSize: '0.75rem', color: 'var(--text-muted)' }}>
                        📅 {formatDate(f.followUpDate)} • {f.followUpType}: {f.notes}
                      </div>
                    </div>
                    <span className="badge badge-warning">{f.status}</span>
                  </div>
                ))}
              </div>
            </div>
          </div>
        </>
      )}

      {/* =========================================================================
          ACCOUNTS DASHBOARD VIEW
          ========================================================================= */}
      {currentRole === 'Accounts' && (
        <>
          <div className="grid-4">
            <div className="stat-card" style={{ borderLeft: '4px solid #f59e0b' }}>
              <div className="stat-header">
                <span className="stat-title">Total Outstanding Receivables</span>
                <CreditCard size={18} style={{ color: '#f59e0b' }} />
              </div>
              <div className="stat-value">{formatCurrency(totalOutstanding)}</div>
              <div className="stat-subtext">{pendingInvoices.length} pending client invoices</div>
            </div>

            <div className="stat-card" style={{ borderLeft: '4px solid var(--danger-text)' }}>
              <div className="stat-header">
                <span className="stat-title">Overdue Invoices</span>
                <AlertTriangle size={18} style={{ color: 'var(--danger-text)' }} />
              </div>
              <div className="stat-value">{formatCurrency(overdueAmount)}</div>
              <div className="stat-subtext" style={{ color: 'var(--danger-text)', fontWeight: 600 }}>
                {overdueInvoices.length} accounts requiring collection
              </div>
            </div>

            <div className="stat-card" style={{ borderLeft: '4px solid #10b981' }}>
              <div className="stat-header">
                <span className="stat-title">Total Collected</span>
                <CheckSquare size={18} style={{ color: '#10b981' }} />
              </div>
              <div className="stat-value">{formatCurrency(totalCollected)}</div>
              <div className="stat-subtext">Settled payments to date</div>
            </div>

            <div className="stat-card" style={{ borderLeft: '4px solid var(--primary-600)' }}>
              <div className="stat-header">
                <span className="stat-title">Total Invoiced</span>
                <FileText size={18} style={{ color: 'var(--primary-600)' }} />
              </div>
              <div className="stat-value">{formatCurrency(totalInvoiced)}</div>
              <div className="stat-subtext">{scopedInvoices.length} tax invoices generated</div>
            </div>
          </div>

          <div style={{ display: 'grid', gridTemplateColumns: 'minmax(0, 1.4fr) minmax(0, 1fr)', gap: '20px' }}>
            <div className="card">
              <div className="flex-between" style={{ marginBottom: '14px' }}>
                <div>
                  <h3>Pending & Overdue Invoices</h3>
                  <p style={{ fontSize: '0.8rem', color: 'var(--text-muted)' }}>Active receivables tracking</p>
                </div>
                <button className="btn btn-ghost btn-sm" onClick={() => onNavigate('invoices')}>
                  Manage Invoices <ArrowRight size={14} />
                </button>
              </div>

              <div className="table-container">
                <table className="custom-table">
                  <thead>
                    <tr>
                      <th>Invoice #</th>
                      <th>Client</th>
                      <th>Due Date</th>
                      <th>Balance Due</th>
                      <th>Status</th>
                    </tr>
                  </thead>
                  <tbody>
                    {pendingInvoices.map((inv) => (
                      <tr key={inv.id}>
                        <td><strong>{inv.invoiceNumber}</strong></td>
                        <td>{inv.clientName}</td>
                        <td style={{ fontSize: '0.8rem' }}>{formatDate(inv.paymentDueDate)}</td>
                        <td><strong style={{ color: 'var(--danger-text)' }}>{formatCurrency(inv.balance)}</strong></td>
                        <td><span className={`badge ${getStatusBadgeClass(inv.paymentStatus)}`}>{inv.paymentStatus}</span></td>
                      </tr>
                    ))}
                  </tbody>
                </table>
              </div>
            </div>

            <div className="card">
              <div className="flex-between" style={{ marginBottom: '14px' }}>
                <div>
                  <h3>Recent Payment Receipts</h3>
                  <p style={{ fontSize: '0.8rem', color: 'var(--text-muted)' }}>Confirmed bank settlements</p>
                </div>
                <button className="btn btn-ghost btn-sm" onClick={() => onNavigate('payments')}>
                  All Payments <ArrowRight size={14} />
                </button>
              </div>

              <div style={{ display: 'flex', flexDirection: 'column', gap: '8px' }}>
                {scopedPayments.filter(p => p.amountPaid > 0).map((pay) => (
                  <div
                    key={pay.id}
                    style={{
                      padding: '10px 12px',
                      background: 'var(--bg-subtle)',
                      borderRadius: 'var(--radius-md)',
                      display: 'flex',
                      alignItems: 'center',
                      justifyContent: 'space-between'
                    }}
                  >
                    <div>
                      <div style={{ fontWeight: 600, fontSize: '0.84rem' }}>{pay.clientName}</div>
                      <div style={{ fontSize: '0.75rem', color: 'var(--text-muted)' }}>
                        Inv: {pay.invoiceNumber} • {pay.paymentMode} • {formatDate(pay.paymentDate)}
                      </div>
                    </div>
                    <div style={{ textAlign: 'right' }}>
                      <strong style={{ color: 'var(--success-text)', fontSize: '0.9rem' }}>
                        +{formatCurrency(pay.amountPaid)}
                      </strong>
                      <div><span className="badge badge-success">Received</span></div>
                    </div>
                  </div>
                ))}
              </div>
            </div>
          </div>
        </>
      )}

      {/* =========================================================================
          SERVICES DASHBOARD VIEW
          ========================================================================= */}
      {currentRole === 'Services' && (
        <>
          <div className="grid-4">
            <div className="stat-card" style={{ borderLeft: '4px solid var(--primary-600)' }}>
              <div className="stat-header">
                <span className="stat-title">Active Service Orders</span>
                <Wrench size={18} style={{ color: 'var(--primary-600)' }} />
              </div>
              <div className="stat-value">{activeServiceOrders.length} In-Flight</div>
              <div className="stat-subtext">Hardware deployments & calibration</div>
            </div>

            <div className="stat-card" style={{ borderLeft: '4px solid #f59e0b' }}>
              <div className="stat-header">
                <span className="stat-title">My Assigned Tasks</span>
                <CheckSquare size={18} style={{ color: '#f59e0b' }} />
              </div>
              <div className="stat-value">{myTasks.filter(t => t.status !== 'Completed').length} Pending</div>
              <div className="stat-subtext">{myTasks.filter(t => t.status === 'Completed').length} completed</div>
            </div>

            <div className="stat-card" style={{ borderLeft: '4px solid var(--danger-text)' }}>
              <div className="stat-header">
                <span className="stat-title">Urgent Field Tasks</span>
                <AlertTriangle size={18} style={{ color: 'var(--danger-text)' }} />
              </div>
              <div className="stat-value">{urgentTasks.length} Urgent</div>
              <div className="stat-subtext">Immediate attention needed</div>
            </div>

            <div className="stat-card" style={{ borderLeft: '4px solid #10b981' }}>
              <div className="stat-header">
                <span className="stat-title">Delivery Completion</span>
                <ShoppingCart size={18} style={{ color: '#10b981' }} />
              </div>
              <div className="stat-value">{scopedOrders.filter(o => o.deliveryStatus === 'Delivered').length} Delivered</div>
              <div className="stat-subtext">Out of {totalOrders} total client orders</div>
            </div>
          </div>

          <div style={{ display: 'grid', gridTemplateColumns: 'minmax(0, 1.4fr) minmax(0, 1fr)', gap: '20px' }}>
            <div className="card">
              <div className="flex-between" style={{ marginBottom: '14px' }}>
                <div>
                  <h3>Client Service & Delivery Orders</h3>
                  <p style={{ fontSize: '0.8rem', color: 'var(--text-muted)' }}>Status of customer deliveries and SLAs</p>
                </div>
                <button className="btn btn-ghost btn-sm" onClick={() => onNavigate('orders')}>
                  All Orders <ArrowRight size={14} />
                </button>
              </div>

              <div className="table-container">
                <table className="custom-table">
                  <thead>
                    <tr>
                      <th>Order ID</th>
                      <th>Client</th>
                      <th>Products / Services</th>
                      <th>Assigned Tech</th>
                      <th>Status</th>
                    </tr>
                  </thead>
                  <tbody>
                    {scopedOrders.map((o) => (
                      <tr key={o.id}>
                        <td><strong>{o.id}</strong></td>
                        <td>{o.clientName}</td>
                        <td style={{ fontSize: '0.78rem', color: 'var(--text-muted)' }}>{o.productCode}</td>
                        <td>{o.assignedTeamMember}</td>
                        <td><span className={`badge ${getStatusBadgeClass(o.deliveryStatus)}`}>{o.deliveryStatus}</span></td>
                      </tr>
                    ))}
                  </tbody>
                </table>
              </div>
            </div>

            <div className="card">
              <div className="flex-between" style={{ marginBottom: '14px' }}>
                <div>
                  <h3>My Field & Service Tasks</h3>
                  <p style={{ fontSize: '0.8rem', color: 'var(--text-muted)' }}>Execution checklist & duties</p>
                </div>
                <button className="btn btn-ghost btn-sm" onClick={() => onNavigate('tasks')}>
                  Manage Tasks <ArrowRight size={14} />
                </button>
              </div>

              <div style={{ display: 'flex', flexDirection: 'column', gap: '8px' }}>
                {myTasks.map((t) => (
                  <div
                    key={t.id}
                    style={{
                      padding: '10px 12px',
                      background: 'var(--bg-subtle)',
                      borderRadius: 'var(--radius-md)',
                      display: 'flex',
                      alignItems: 'center',
                      justifyContent: 'space-between'
                    }}
                  >
                    <div>
                      <div style={{ fontWeight: 600, fontSize: '0.84rem' }}>{t.taskName}</div>
                      <div style={{ fontSize: '0.75rem', color: 'var(--text-muted)' }}>
                        Client: {t.client} • Due: {formatDate(t.dueDate)}
                      </div>
                    </div>
                    <span className={`badge ${getStatusBadgeClass(t.status)}`}>{t.status}</span>
                  </div>
                ))}
              </div>
            </div>
          </div>
        </>
      )}
    </div>
  );
};
