import React, { useState } from 'react';
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
  ChevronRight,
  ChevronDown,
  Building,
  Check,
  Zap,
  Volume2,
  Globe
} from 'lucide-react';

export const Sidebar = ({ currentView, onChangeView, isMobileOpen, onCloseMobile }) => {
  const {
    currentRole,
    companyBrands,
    selectedCompany,
    setSelectedCompany,
    matchesCompany,
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

  const [showCompanyMenu, setShowCompanyMenu] = useState(false);

  const activeBrand = companyBrands.find((b) => b.id === selectedCompany) || companyBrands[0];

  // Badges calculation filtered by active company
  const scopedLeads = leads.filter(matchesCompany);
  const scopedOrders = orders.filter(matchesCompany);
  const scopedInventory = inventory.filter(matchesCompany);
  const scopedInvoices = invoices.filter(matchesCompany);
  const scopedTasks = tasks.filter(matchesCompany);
  const scopedFollowUps = followUps.filter(matchesCompany);
  const scopedClients = clients.filter(matchesCompany);

  const pendingLeadsCount = scopedLeads.filter((l) => l.conversionStatus !== 'Converted' && l.stage !== 'Lost').length;
  const inProgressOrdersCount = scopedOrders.filter((o) => o.deliveryStatus === 'In Progress').length;
  const lowStockCount = scopedInventory.filter((p) => p.availableStock <= p.minStockLevel).length;
  const overdueInvoicesCount = scopedInvoices.filter((i) => i.paymentStatus === 'Overdue').length;
  const pendingTasksCount = scopedTasks.filter((t) => t.status !== 'Completed').length;
  const pendingFollowUpsCount = scopedFollowUps.filter((f) => f.status === 'Pending').length;

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
        { id: 'clients', label: 'Client Directory', icon: Building2, badge: scopedClients.length, roles: ['Admin', 'Sales', 'Accounts', 'Services'] },
        { id: 'followups', label: 'Follow-Ups', icon: CalendarClock, badge: pendingFollowUpsCount > 0 ? pendingFollowUpsCount : null, roles: ['Admin', 'Sales'] }
      ]
    },
    {
      group: 'OPERATIONS & FINANCE',
      items: [
        { id: 'orders', label: 'Orders & Dispatches', icon: ShoppingCart, badge: inProgressOrdersCount > 0 ? inProgressOrdersCount : null, badgeType: 'warning', roles: ['Admin', 'Sales', 'Services', 'Accounts'] },
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

  const getBrandIcon = (brandId) => {
    if (brandId === 'AUCO') return <Zap size={18} />;
    if (brandId === 'AIWA') return <Volume2 size={18} />;
    return <Globe size={18} />;
  };

  const getBrandGradient = (brandId) => {
    if (brandId === 'AUCO') return 'linear-gradient(135deg, #2563eb 0%, #0284c7 100%)';
    if (brandId === 'AIWA') return 'linear-gradient(135deg, #7c3aed 0%, #db2777 100%)';
    return 'linear-gradient(135deg, #4f46e5 0%, #312e81 100%)';
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
        {/* Brand & Company Switcher Header */}
        <div
          style={{
            padding: '14px 16px',
            borderBottom: '1px solid var(--border-default)',
            position: 'relative'
          }}
        >
          <div
            onClick={() => setShowCompanyMenu(!showCompanyMenu)}
            style={{
              display: 'flex',
              alignItems: 'center',
              justifyContent: 'space-between',
              padding: '8px 10px',
              borderRadius: 'var(--radius-md)',
              background: 'var(--bg-subtle)',
              border: '1px solid var(--border-subtle)',
              cursor: 'pointer',
              transition: 'all 0.15s ease'
            }}
            title="Click to Switch Company Brand (Auco vs Aiwa)"
          >
            <div style={{ display: 'flex', alignItems: 'center', gap: '10px', overflow: 'hidden' }}>
              <div
                style={{
                  width: '36px',
                  height: '36px',
                  borderRadius: '10px',
                  background: getBrandGradient(activeBrand.id),
                  display: 'flex',
                  alignItems: 'center',
                  justifyContent: 'center',
                  color: '#fff',
                  flexShrink: 0,
                  boxShadow: '0 3px 10px rgba(0,0,0,0.12)'
                }}
              >
                {getBrandIcon(activeBrand.id)}
              </div>
              <div style={{ display: 'flex', flexDirection: 'column', overflow: 'hidden' }}>
                <div style={{ display: 'flex', alignItems: 'center', gap: '6px' }}>
                  <span
                    style={{
                      fontFamily: 'var(--font-display)',
                      fontWeight: 800,
                      fontSize: '0.92rem',
                      letterSpacing: '-0.02em',
                      color: 'var(--text-primary)',
                      whiteSpace: 'nowrap',
                      overflow: 'hidden',
                      textOverflow: 'ellipsis'
                    }}
                  >
                    {activeBrand.name}
                  </span>
                </div>
                <span
                  style={{
                    fontSize: '0.66rem',
                    color: 'var(--text-muted)',
                    fontWeight: 600,
                    whiteSpace: 'nowrap',
                    overflow: 'hidden',
                    textOverflow: 'ellipsis'
                  }}
                >
                  {activeBrand.tagline.split(',')[0]}
                </span>
              </div>
            </div>

            <div style={{ display: 'flex', alignItems: 'center', gap: '4px' }}>
              <ChevronDown
                size={16}
                style={{
                  color: 'var(--text-muted)',
                  transform: showCompanyMenu ? 'rotate(180deg)' : 'none',
                  transition: 'transform 0.2s ease'
                }}
              />
              {isMobileOpen && (
                <button
                  className="btn btn-ghost btn-icon"
                  style={{ width: '24px', height: '24px', padding: 0 }}
                  onClick={(e) => {
                    e.stopPropagation();
                    onCloseMobile();
                  }}
                >
                  <X size={16} />
                </button>
              )}
            </div>
          </div>

          {/* Company Switcher Dropdown Menu */}
          {showCompanyMenu && (
            <>
              <div
                style={{ position: 'fixed', inset: 0, zIndex: 1100 }}
                onClick={() => setShowCompanyMenu(false)}
              />
              <div
                style={{
                  position: 'absolute',
                  top: '100%',
                  left: '12px',
                  right: '12px',
                  marginTop: '4px',
                  background: '#ffffff',
                  borderRadius: 'var(--radius-lg)',
                  border: '1px solid var(--border-default)',
                  boxShadow: '0 12px 32px rgba(0, 0, 0, 0.14)',
                  padding: '8px',
                  zIndex: 1200,
                  display: 'flex',
                  flexDirection: 'column',
                  gap: '4px'
                }}
              >
                <div style={{ padding: '6px 8px 4px 8px', fontSize: '0.68rem', fontWeight: 800, color: 'var(--text-muted)', textTransform: 'uppercase', letterSpacing: '0.06em' }}>
                  Select Company Brand
                </div>

                {companyBrands.map((brand) => {
                  const isSelected = selectedCompany === brand.id;
                  return (
                    <button
                      key={brand.id}
                      onClick={() => {
                        setSelectedCompany(brand.id);
                        setShowCompanyMenu(false);
                      }}
                      style={{
                        display: 'flex',
                        alignItems: 'center',
                        justifyContent: 'space-between',
                        padding: '10px 10px',
                        borderRadius: 'var(--radius-md)',
                        background: isSelected ? 'var(--primary-50)' : 'transparent',
                        border: isSelected ? '1px solid var(--primary-200)' : '1px solid transparent',
                        cursor: 'pointer',
                        textAlign: 'left',
                        transition: 'all 0.15s ease'
                      }}
                    >
                      <div style={{ display: 'flex', alignItems: 'center', gap: '10px' }}>
                        <div
                          style={{
                            width: '32px',
                            height: '32px',
                            borderRadius: '8px',
                            background: getBrandGradient(brand.id),
                            display: 'flex',
                            alignItems: 'center',
                            justifyContent: 'center',
                            color: '#fff',
                            flexShrink: 0
                          }}
                        >
                          {getBrandIcon(brand.id)}
                        </div>
                        <div>
                          <div style={{ fontWeight: 700, fontSize: '0.84rem', color: isSelected ? 'var(--primary-700)' : 'var(--text-primary)' }}>
                            {brand.name}
                          </div>
                          <div style={{ fontSize: '0.7rem', color: 'var(--text-muted)' }}>
                            {brand.industry}
                          </div>
                        </div>
                      </div>

                      {isSelected && (
                        <div
                          style={{
                            width: '20px',
                            height: '20px',
                            borderRadius: '50%',
                            background: 'var(--primary-600)',
                            color: '#fff',
                            display: 'flex',
                            alignItems: 'center',
                            justifyContent: 'center',
                            flexShrink: 0
                          }}
                        >
                          <Check size={12} strokeWidth={3} />
                        </div>
                      )}
                    </button>
                  );
                })}
              </div>
            </>
          )}
        </div>

        {/* Role & Active Brand Pill Indicator */}
        <div
          style={{
            padding: '8px 16px',
            background: '#f8fafc',
            borderBottom: '1px solid var(--border-subtle)',
            display: 'flex',
            alignItems: 'center',
            justifyContent: 'space-between'
          }}
        >
          <div style={{ display: 'flex', alignItems: 'center', gap: '6px' }}>
            <span style={{ fontSize: '0.72rem', color: 'var(--text-muted)', fontWeight: 600 }}>Brand:</span>
            <span
              style={{
                fontSize: '0.7rem',
                fontWeight: 700,
                color: activeBrand.color,
                background: `${activeBrand.color}15`,
                padding: '2px 6px',
                borderRadius: '4px'
              }}
            >
              {activeBrand.shortName}
            </span>
          </div>
          <span className={`badge ${currentRole === 'Admin' ? 'badge-purple' : (currentRole === 'Sales' ? 'badge-success' : (currentRole === 'Accounts' ? 'badge-warning' : 'badge-info'))}`} style={{ fontSize: '0.7rem' }}>
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
