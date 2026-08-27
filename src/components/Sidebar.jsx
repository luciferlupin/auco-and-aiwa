import React from 'react';
import { useApp } from '../context/AppContext';
import {
  LayoutDashboard,
  Users,
  Building2,
  ShoppingCart,
  Boxes,
  FileText,
  CreditCard,
  CalendarClock,
  CheckSquare,
  MapPin,
  BarChart3,
  Settings,
  Layers,
  X,
  RefreshCw,
  Sparkles,
  ChevronRight
} from 'lucide-react';

export const Sidebar = ({ currentView, onChangeView, isMobileOpen, onCloseMobile }) => {
  const {
    currentRole,
    leads,
    clients,
    orders,
    inventory,
    invoices,
    payments,
    tasks,
    followUps,
    fetchSupabaseData,
    isSyncing
  } = useApp();

  // Badges calculation
  const pendingLeadsCount = leads.filter((l) => l.conversionStatus !== 'Converted' && l.stage !== 'Lost').length;
  const inProgressOrdersCount = orders.filter((o) => o.deliveryStatus === 'In Progress').length;
  const lowStockCount = inventory.filter((p) => p.availableStock <= p.minStockLevel).length;
  const overdueInvoicesCount = invoices.filter((i) => i.paymentStatus === 'Overdue').length;
  const pendingTasksCount = tasks.filter((t) => t.status !== 'Completed').length;
  const pendingFollowUpsCount = followUps.filter((f) => f.status === 'Pending').length;

  const sections = [
    {
      group: 'OVERVIEW',
      items: [
        { id: 'dashboard', label: 'Dashboard', icon: LayoutDashboard, roles: ['Admin', 'Sales', 'Accounts', 'Services'] }
      ]
    },
    {
      group: 'SALES & CLIENTS',
      items: [
        { id: 'leads', label: 'Leads & Pipeline', icon: Users, badge: pendingLeadsCount, badgeType: 'info', roles: ['Admin', 'Sales'] },
        { id: 'clients', label: 'Client Directory', icon: Building2, badge: clients.length, roles: ['Admin', 'Sales', 'Accounts', 'Services'] },
        { id: 'followups', label: 'Follow-Ups', icon: CalendarClock, badge: pendingFollowUpsCount > 0 ? pendingFollowUpsCount : null, roles: ['Admin', 'Sales'] }
      ]
    },
    {
      group: 'OPERATIONS & FINANCE',
      items: [
        { id: 'orders', label: 'Orders', icon: ShoppingCart, badge: inProgressOrdersCount > 0 ? inProgressOrdersCount : null, badgeType: 'warning', roles: ['Admin', 'Sales', 'Services', 'Accounts'] },
        { id: 'inventory', label: 'Inventory Stock', icon: Boxes, badge: lowStockCount > 0 ? lowStockCount : null, badgeType: 'danger', roles: ['Admin', 'Services', 'Sales', 'Accounts'] },
        { id: 'invoices', label: 'Invoices & Tax', icon: FileText, badge: overdueInvoicesCount > 0 ? overdueInvoicesCount : null, badgeType: 'danger', roles: ['Admin', 'Accounts', 'Sales'] },
        { id: 'payments', label: 'Payment Receipts', icon: CreditCard, roles: ['Admin', 'Accounts'] },
        { id: 'tasks', label: 'Assigned Tasks', icon: CheckSquare, badge: pendingTasksCount > 0 ? pendingTasksCount : null, roles: ['Admin', 'Services', 'Sales', 'Accounts'] }
      ]
    },
    {
      group: 'INTELLIGENCE & MAPS',
      items: [
        { id: 'indiamap', label: 'India Client Map', icon: MapPin, roles: ['Admin', 'Sales', 'Services', 'Accounts'] },
        { id: 'reports', label: 'Business Reports', icon: BarChart3, roles: ['Admin', 'Sales', 'Accounts', 'Services'] },
        { id: 'settings', label: 'Settings & Roles', icon: Settings, roles: ['Admin', 'Sales', 'Accounts', 'Services'] }
      ]
    }
  ];

  const handleNavClick = (id) => {
    onChangeView(id);
    if (onCloseMobile) onCloseMobile();
  };

  return (
    <>
      {/* Mobile Drawer Backdrop */}
      {isMobileOpen && (
        <div className="sidebar-backdrop" onClick={onCloseMobile} />
      )}

      <aside
        className={`app-sidebar ${isMobileOpen ? 'open' : ''}`}
        style={{
          width: '260px',
          background: '#ffffff',
          borderRight: '1px solid var(--border-default)',
          display: 'flex',
          flexDirection: 'column',
          height: '100vh',
          position: 'sticky',
          top: 0,
          flexShrink: 0,
          zIndex: 1000
        }}
      >
        {/* Brand Header */}
        <div
          style={{
            padding: '20px 22px',
            borderBottom: '1px solid var(--border-default)',
            display: 'flex',
            alignItems: 'center',
            justifyContent: 'space-between'
          }}
        >
          <div style={{ display: 'flex', alignItems: 'center', gap: '12px' }}>
            <div
              style={{
                width: '40px',
                height: '40px',
                borderRadius: '12px',
                background: 'linear-gradient(135deg, #4f46e5 0%, #312e81 100%)',
                display: 'flex',
                alignItems: 'center',
                justifyContent: 'center',
                color: '#fff',
                boxShadow: '0 4px 14px var(--primary-glow)'
              }}
            >
              <Layers size={21} />
            </div>
            <div style={{ display: 'flex', flexDirection: 'column' }}>
              <span style={{ fontFamily: 'var(--font-display)', fontWeight: 800, fontSize: '1.08rem', letterSpacing: '-0.03em', color: 'var(--text-primary)' }}>
                AUCO & AIWA
              </span>
              <span style={{ fontSize: '0.68rem', color: 'var(--text-muted)', fontWeight: 700, letterSpacing: '0.05em' }}>
                OPERATIONS CORE
              </span>
            </div>
          </div>

          {/* Close button on mobile */}
          {isMobileOpen && (
            <button className="btn btn-ghost btn-icon" onClick={onCloseMobile}>
              <X size={18} />
            </button>
          )}
        </div>

        {/* Role Badge Indicator */}
        <div style={{ padding: '10px 18px', background: '#f8fafc', borderBottom: '1px solid var(--border-subtle)', display: 'flex', alignItems: 'center', justifyContent: 'space-between' }}>
          <div style={{ fontSize: '0.74rem', color: 'var(--text-muted)', fontWeight: 600 }}>Active Role View</div>
          <span className={`badge ${currentRole === 'Admin' ? 'badge-purple' : (currentRole === 'Sales' ? 'badge-success' : (currentRole === 'Accounts' ? 'badge-warning' : 'badge-info'))}`}>
            {currentRole}
          </span>
        </div>

        {/* Navigation Sections */}
        <nav style={{ flex: 1, padding: '14px 12px', overflowY: 'auto', display: 'flex', flexDirection: 'column', gap: '18px' }}>
          {sections.map((sec) => {
            const filteredItems = sec.items.filter((item) => item.roles.includes(currentRole));
            if (filteredItems.length === 0) return null;

            return (
              <div key={sec.group} style={{ display: 'flex', flexDirection: 'column', gap: '3px' }}>
                <div style={{ padding: '0 12px 6px 12px', fontSize: '0.68rem', fontWeight: 800, color: '#94a3b8', letterSpacing: '0.06em' }}>
                  {sec.group}
                </div>

                {filteredItems.map((item) => {
                  const Icon = item.icon;
                  const isActive = currentView === item.id;
                  return (
                    <button
                      key={item.id}
                      onClick={() => handleNavClick(item.id)}
                      style={{
                        width: '100%',
                        display: 'flex',
                        alignItems: 'center',
                        justifyContent: 'space-between',
                        padding: '9px 12px',
                        borderRadius: '10px',
                        background: isActive ? 'var(--primary-600)' : 'transparent',
                        color: isActive ? '#ffffff' : 'var(--text-secondary)',
                        border: 'none',
                        cursor: 'pointer',
                        fontSize: '0.85rem',
                        fontWeight: isActive ? 700 : 500,
                        transition: 'all 0.14s ease',
                        textAlign: 'left',
                        boxShadow: isActive ? '0 3px 10px var(--primary-glow)' : 'none',
                        position: 'relative'
                      }}
                      onMouseEnter={(e) => {
                        if (!isActive) {
                          e.currentTarget.style.background = '#f1f5f9';
                          e.currentTarget.style.color = '#0f172a';
                        }
                      }}
                      onMouseLeave={(e) => {
                        if (!isActive) {
                          e.currentTarget.style.background = 'transparent';
                          e.currentTarget.style.color = 'var(--text-secondary)';
                        }
                      }}
                    >
                      <div style={{ display: 'flex', alignItems: 'center', gap: '10px' }}>
                        <Icon size={17} style={{ opacity: isActive ? 1 : 0.85 }} />
                        <span>{item.label}</span>
                      </div>

                      {item.badge != null && (
                        <span
                          style={{
                            fontSize: '0.68rem',
                            fontWeight: 700,
                            padding: '2px 7px',
                            borderRadius: 'var(--radius-full)',
                            background: isActive ? 'rgba(255,255,255,0.28)' : (item.badgeType === 'danger' ? 'var(--danger-bg)' : (item.badgeType === 'warning' ? 'var(--warning-bg)' : 'var(--bg-subtle)')),
                            color: isActive ? '#ffffff' : (item.badgeType === 'danger' ? 'var(--danger-text)' : (item.badgeType === 'warning' ? 'var(--warning-text)' : 'var(--text-secondary)')),
                            border: isActive ? 'none' : '1px solid var(--border-default)'
                          }}
                        >
                          {item.badge}
                        </span>
                      )}
                    </button>
                  );
                })}
              </div>
            );
          })}
        </nav>

        {/* Footer Database Sync Action */}
        <div
          style={{
            padding: '14px 18px',
            borderTop: '1px solid var(--border-default)',
            background: '#ffffff',
            fontSize: '0.74rem',
            color: 'var(--text-muted)',
            display: 'flex',
            alignItems: 'center',
            justifyContent: 'space-between'
          }}
        >
          <div style={{ display: 'flex', alignItems: 'center', gap: '6px' }}>
            <span className="status-dot status-dot-success" />
            <span style={{ fontWeight: 600, color: 'var(--text-secondary)' }}>Supabase Cloud</span>
          </div>

          <button
            onClick={() => fetchSupabaseData()}
            className="btn btn-ghost btn-icon"
            style={{ width: '28px', height: '28px' }}
            title="Refresh database sync"
          >
            <RefreshCw size={13} style={{ animation: isSyncing ? 'spin 1s linear infinite' : 'none' }} />
          </button>
        </div>
      </aside>
    </>
  );
};
