import React, { useState } from 'react';
import { useApp } from '../context/AppContext';
import {
  Search,
  Plus,
  ShieldCheck,
  TrendingUp,
  CreditCard,
  Wrench,
  ChevronDown,
  Bell,
  Sparkles,
  Command,
  Menu,
  LogOut,
  Database,
  Cloud,
  CheckCircle2
} from 'lucide-react';

export const Navbar = ({
  onToggleMobileSidebar,
  onOpenSearch,
  onOpenQuickAction,
  onOpenLeadModal,
  onOpenClientModal,
  onOpenOrderModal,
  onOpenDispatchModal,
  onOpenInvoiceModal,
  onOpenTaskModal
}) => {
  const {
    currentRole,
    currentUser,
    switchRole,
    logout,
    isCloudSynced,
    isSyncing,
    inventory,
    invoices,
    tasks,
    companyBrands,
    selectedCompany,
    setSelectedCompany,
    matchesCompany
  } = useApp();
  const [showRoleDropdown, setShowRoleDropdown] = useState(false);
  const [showCompanyDropdown, setShowCompanyDropdown] = useState(false);
  const [showQuickMenu, setShowQuickMenu] = useState(false);
  const [showNotifications, setShowNotifications] = useState(false);
  const [showUserMenu, setShowUserMenu] = useState(false);

  const activeBrand = companyBrands.find((b) => b.id === selectedCompany) || companyBrands[0];

  // Derive system alerts for notification bell (scoped by active brand workspace)
  const scopedInventory = inventory.filter(matchesCompany);
  const scopedInvoices = invoices.filter(matchesCompany);
  const scopedTasks = tasks.filter(matchesCompany);

  const lowStockCount = scopedInventory.filter((p) => p.availableStock <= p.minStockLevel).length;
  const overdueInvoicesCount = scopedInvoices.filter((i) => i.paymentStatus === 'Overdue').length;
  const urgentTasksCount = scopedTasks.filter((t) => t.priority === 'Urgent' && t.status !== 'Completed').length;
  const totalAlerts = lowStockCount + overdueInvoicesCount + urgentTasksCount;

  const roleConfigs = [
    { role: 'Admin', icon: ShieldCheck, color: '#4f46e5', label: 'Admin Account (Full Control)' },
    { role: 'Sales', icon: TrendingUp, color: '#10b981', label: 'Sales Account (Pipeline & Leads)' },
    { role: 'Accounts', icon: CreditCard, color: '#f59e0b', label: 'Accounts Account (Billing & AR)' },
    { role: 'Services', icon: Wrench, color: '#8b5cf6', label: 'Services Account (Tasks & Delivery)' }
  ];

  const currentRoleConfig = roleConfigs.find((r) => r.role === currentRole) || roleConfigs[0];
  const RoleIcon = currentRoleConfig.icon;

  return (
    <header
      style={{
        height: '64px',
        background: 'rgba(255, 255, 255, 0.88)',
        backdropFilter: 'blur(20px)',
        WebkitBackdropFilter: 'blur(20px)',
        borderBottom: '1px solid var(--border-default)',
        display: 'flex',
        alignItems: 'center',
        justifyContent: 'space-between',
        padding: '0 20px',
        position: 'sticky',
        top: 0,
        zIndex: 100
      }}
    >
      {/* Left: Mobile Menu Toggle & Global Search Trigger */}
      <div style={{ display: 'flex', alignItems: 'center', gap: '12px', flex: 1, maxWidth: '460px' }}>
        {/* Mobile Hamburger Button (visible on mobile) */}
        <button
          onClick={onToggleMobileSidebar}
          className="btn btn-secondary btn-icon"
          style={{ display: 'flex', alignItems: 'center', justifyContent: 'center' }}
          title="Toggle Navigation Menu"
        >
          <Menu size={18} />
        </button>

        <button
          onClick={onOpenSearch}
          style={{
            width: '100%',
            height: '38px',
            background: 'var(--bg-subtle)',
            border: '1px solid var(--border-default)',
            borderRadius: 'var(--radius-sm)',
            padding: '0 12px',
            display: 'flex',
            alignItems: 'center',
            justifyContent: 'space-between',
            color: 'var(--text-muted)',
            cursor: 'pointer',
            fontSize: '0.82rem',
            transition: 'all 0.15s ease'
          }}
          onMouseEnter={(e) => e.currentTarget.style.borderColor = 'var(--border-strong)'}
          onMouseLeave={(e) => e.currentTarget.style.borderColor = 'var(--border-default)'}
        >
          <div style={{ display: 'flex', alignItems: 'center', gap: '8px', overflow: 'hidden' }}>
            <Search size={15} style={{ flexShrink: 0 }} />
            <span style={{ whiteSpace: 'nowrap', textOverflow: 'ellipsis', overflow: 'hidden' }}>
              Search clients, products, orders, invoices...
            </span>
          </div>
          <kbd
            style={{
              background: 'var(--bg-surface)',
              border: '1px solid var(--border-strong)',
              borderRadius: '4px',
              padding: '2px 6px',
              fontSize: '0.7rem',
              fontWeight: 600,
              color: 'var(--text-secondary)',
              flexShrink: 0
            }}
          >
            ⌘K
          </kbd>
        </button>
      </div>

      {/* Right: Company Switcher Pill, Cloud Sync Pill, Quick Add, Alerts, Role Switcher, Profile */}
      <div style={{ display: 'flex', alignItems: 'center', gap: '10px' }}>
        {/* Company Brand Workspace Switcher Dropdown */}
        <div style={{ position: 'relative' }}>
          <button
            onClick={() => setShowCompanyDropdown(!showCompanyDropdown)}
            style={{
              display: 'flex',
              alignItems: 'center',
              gap: '6px',
              padding: '4px 10px',
              background: `${activeBrand.color}12`,
              border: `1px solid ${activeBrand.color}35`,
              borderRadius: 'var(--radius-full)',
              fontSize: '0.75rem',
              color: activeBrand.color,
              fontWeight: 700,
              cursor: 'pointer'
            }}
            title="Switch Workspace Company Brand (Auco vs Aiwa)"
          >
            <span>🏢</span>
            <span>{activeBrand.shortName}</span>
            <ChevronDown size={13} style={{ transform: showCompanyDropdown ? 'rotate(180deg)' : 'none', transition: 'transform 0.2s' }} />
          </button>

          {showCompanyDropdown && (
            <>
              <div style={{ position: 'fixed', inset: 0, zIndex: 150 }} onClick={() => setShowCompanyDropdown(false)} />
              <div
                style={{
                  position: 'absolute',
                  top: '100%',
                  right: 0,
                  marginTop: '6px',
                  width: '240px',
                  background: 'var(--bg-surface)',
                  border: '1px solid var(--border-default)',
                  borderRadius: 'var(--radius-md)',
                  boxShadow: 'var(--shadow-xl)',
                  padding: '6px',
                  zIndex: 200,
                  display: 'flex',
                  flexDirection: 'column',
                  gap: '4px'
                }}
              >
                <div style={{ padding: '6px 10px', fontSize: '0.68rem', fontWeight: 700, color: 'var(--text-muted)', textTransform: 'uppercase' }}>
                  Select Company Workspace
                </div>
                {companyBrands.map((brand) => (
                  <button
                    key={brand.id}
                    className="btn btn-ghost btn-sm"
                    style={{
                      width: '100%',
                      justifyContent: 'space-between',
                      fontWeight: selectedCompany === brand.id ? 700 : 500,
                      background: selectedCompany === brand.id ? 'var(--primary-50)' : 'transparent',
                      color: selectedCompany === brand.id ? 'var(--primary-700)' : 'inherit'
                    }}
                    onClick={() => {
                      setSelectedCompany(brand.id);
                      setShowCompanyDropdown(false);
                    }}
                  >
                    <span>{brand.name}</span>
                    {selectedCompany === brand.id && <span>✓</span>}
                  </button>
                ))}
              </div>
            </>
          )}
        </div>

        {/* Supabase Sync Pill */}
        <div
          title={isCloudSynced ? "Live Cloud Synced to Supabase (ktrqhmzaesllajbowymt)" : "Connected to Supabase Cloud Core"}
          style={{
            display: 'flex',
            alignItems: 'center',
            gap: '6px',
            padding: '4px 10px',
            background: 'var(--bg-subtle)',
            border: '1px solid var(--border-default)',
            borderRadius: 'var(--radius-full)',
            fontSize: '0.72rem',
            color: 'var(--text-secondary)',
            fontWeight: 600
          }}
        >
          <span
            style={{
              width: '6px',
              height: '6px',
              borderRadius: '50%',
              backgroundColor: isSyncing ? '#f59e0b' : '#10b981',
              boxShadow: '0 0 6px #10b981'
            }}
          />
          <span style={{ display: 'inline-block' }}>
            {isSyncing ? 'Syncing...' : 'Supabase Live'}
          </span>
        </div>

        {/* Quick Add Dropdown */}
        <div style={{ position: 'relative' }}>
          <button
            className="btn btn-primary btn-sm"
            onClick={() => setShowQuickMenu(!showQuickMenu)}
            style={{ display: 'flex', alignItems: 'center', gap: '5px' }}
          >
            <Plus size={15} />
            <span>Create</span>
            <ChevronDown size={13} />
          </button>

          {showQuickMenu && (
            <div
              style={{
                position: 'absolute',
                top: '100%',
                right: 0,
                marginTop: '6px',
                width: '210px',
                background: 'var(--bg-surface)',
                border: '1px solid var(--border-default)',
                borderRadius: 'var(--radius-md)',
                boxShadow: 'var(--shadow-xl)',
                padding: '6px',
                zIndex: 200
              }}
            >
              <div style={{ padding: '6px 10px', fontSize: '0.7rem', fontWeight: 700, color: 'var(--text-muted)', textTransform: 'uppercase' }}>
                Quick Actions
              </div>
              <button
                className="btn btn-ghost btn-sm"
                style={{ width: '100%', justifyContent: 'flex-start' }}
                onClick={() => { setShowQuickMenu(false); onOpenLeadModal(); }}
              >
                + New Lead
              </button>
              <button
                className="btn btn-ghost btn-sm"
                style={{ width: '100%', justifyContent: 'flex-start' }}
                onClick={() => { setShowQuickMenu(false); onOpenClientModal(); }}
              >
                + New Client
              </button>
              <button
                className="btn btn-ghost btn-sm"
                style={{ width: '100%', justifyContent: 'flex-start' }}
                onClick={() => { setShowQuickMenu(false); onOpenOrderModal(); }}
              >
                + New Order (Auto-stock)
              </button>
              <button
                className="btn btn-ghost btn-sm"
                style={{ width: '100%', justifyContent: 'flex-start', color: 'var(--primary-600)', fontWeight: 600 }}
                onClick={() => { setShowQuickMenu(false); if (onOpenDispatchModal) onOpenDispatchModal(); }}
              >
                🚀 Dispatch Shipment
              </button>
              <button
                className="btn btn-ghost btn-sm"
                style={{ width: '100%', justifyContent: 'flex-start' }}
                onClick={() => { setShowQuickMenu(false); onOpenInvoiceModal(); }}
              >
                + New Invoice
              </button>
              <button
                className="btn btn-ghost btn-sm"
                style={{ width: '100%', justifyContent: 'flex-start' }}
                onClick={() => { setShowQuickMenu(false); onOpenTaskModal(); }}
              >
                + Assign Task
              </button>
            </div>
          )}
        </div>

        {/* Notifications Popover */}
        <div style={{ position: 'relative' }}>
          <button
            className="btn btn-secondary btn-icon"
            onClick={() => setShowNotifications(!showNotifications)}
            title="System Alerts"
            style={{ position: 'relative' }}
          >
            <Bell size={16} />
            {totalAlerts > 0 && (
              <span
                style={{
                  position: 'absolute',
                  top: '-2px',
                  right: '-2px',
                  background: 'var(--danger-text)',
                  color: '#fff',
                  fontSize: '0.65rem',
                  fontWeight: 700,
                  width: '18px',
                  height: '18px',
                  borderRadius: '50%',
                  display: 'flex',
                  alignItems: 'center',
                  justifyContent: 'center',
                  border: '2px solid var(--bg-surface)'
                }}
              >
                {totalAlerts}
              </span>
            )}
          </button>

          {showNotifications && (
            <div
              style={{
                position: 'absolute',
                top: '100%',
                right: 0,
                marginTop: '6px',
                width: '320px',
                background: 'var(--bg-surface)',
                border: '1px solid var(--border-default)',
                borderRadius: 'var(--radius-lg)',
                boxShadow: 'var(--shadow-xl)',
                padding: '12px',
                zIndex: 200
              }}
            >
              <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: '8px', paddingBottom: '6px', borderBottom: '1px solid var(--border-default)' }}>
                <span style={{ fontWeight: 700, fontSize: '0.85rem' }}>Active System Alerts</span>
                <span className="badge badge-info">{totalAlerts} Attention</span>
              </div>
              <div style={{ display: 'flex', flexDirection: 'column', gap: '8px', maxHeight: '280px', overflowY: 'auto' }}>
                {lowStockCount > 0 && (
                  <div style={{ padding: '8px 10px', background: 'var(--warning-bg)', border: '1px solid var(--warning-border)', borderRadius: 'var(--radius-sm)', fontSize: '0.78rem' }}>
                    <strong style={{ color: 'var(--warning-text)' }}>⚠️ Low Stock Warning:</strong>
                    <p style={{ margin: '2px 0 0 0', fontSize: '0.74rem' }}>{lowStockCount} inventory items require re-ordering.</p>
                  </div>
                )}
                {overdueInvoicesCount > 0 && (
                  <div style={{ padding: '8px 10px', background: 'var(--danger-bg)', border: '1px solid var(--danger-border)', borderRadius: 'var(--radius-sm)', fontSize: '0.78rem' }}>
                    <strong style={{ color: 'var(--danger-text)' }}>🔴 Payment Overdue:</strong>
                    <p style={{ margin: '2px 0 0 0', fontSize: '0.74rem' }}>{overdueInvoicesCount} invoices are past due date.</p>
                  </div>
                )}
                {urgentTasksCount > 0 && (
                  <div style={{ padding: '8px 10px', background: 'var(--purple-bg)', border: '1px solid var(--purple-border)', borderRadius: 'var(--radius-sm)', fontSize: '0.78rem' }}>
                    <strong style={{ color: 'var(--purple-text)' }}>⚡ Urgent Tasks:</strong>
                    <p style={{ margin: '2px 0 0 0', fontSize: '0.74rem' }}>{urgentTasksCount} urgent priority tasks pending.</p>
                  </div>
                )}
                {totalAlerts === 0 && (
                  <div style={{ padding: '16px', textAlign: 'center', color: 'var(--text-muted)', fontSize: '0.82rem' }}>
                    All operations and inventories are up to date!
                  </div>
                )}
              </div>
            </div>
          )}
        </div>

        {/* ROLE SWITCHER */}
        <div style={{ position: 'relative' }}>
          <button
            onClick={() => setShowRoleDropdown(!showRoleDropdown)}
            style={{
              display: 'flex',
              alignItems: 'center',
              gap: '6px',
              padding: '6px 10px',
              background: 'var(--bg-subtle)',
              border: '1px solid var(--border-strong)',
              borderRadius: 'var(--radius-sm)',
              cursor: 'pointer',
              fontSize: '0.82rem',
              fontWeight: 600
            }}
          >
            <span
              style={{
                width: '7px',
                height: '7px',
                borderRadius: '50%',
                backgroundColor: currentRoleConfig.color
              }}
            />
            <strong style={{ color: 'var(--text-primary)' }}>{currentRole}</strong>
            <ChevronDown size={13} style={{ color: 'var(--text-muted)' }} />
          </button>

          {showRoleDropdown && (
            <div
              style={{
                position: 'absolute',
                top: '100%',
                right: 0,
                marginTop: '6px',
                width: '270px',
                background: 'var(--bg-surface)',
                border: '1px solid var(--border-default)',
                borderRadius: 'var(--radius-lg)',
                boxShadow: 'var(--shadow-xl)',
                padding: '8px',
                zIndex: 200
              }}
            >
              <div style={{ padding: '6px 10px', fontSize: '0.7rem', fontWeight: 700, color: 'var(--text-muted)', textTransform: 'uppercase' }}>
                Switch Active Account Role
              </div>
              {roleConfigs.map((rc) => {
                const Icon = rc.icon;
                const isSelected = rc.role === currentRole;
                return (
                  <button
                    key={rc.role}
                    onClick={() => {
                      switchRole(rc.role);
                      setShowRoleDropdown(false);
                    }}
                    style={{
                      width: '100%',
                      padding: '8px 10px',
                      display: 'flex',
                      alignItems: 'center',
                      gap: '10px',
                      background: isSelected ? 'var(--primary-50)' : 'transparent',
                      border: 'none',
                      borderRadius: 'var(--radius-sm)',
                      cursor: 'pointer',
                      textAlign: 'left'
                    }}
                  >
                    <div
                      style={{
                        width: '28px',
                        height: '28px',
                        borderRadius: 'var(--radius-xs)',
                        background: isSelected ? 'var(--primary-600)' : 'var(--bg-subtle)',
                        color: isSelected ? '#fff' : rc.color,
                        display: 'flex',
                        alignItems: 'center',
                        justifyContent: 'center'
                      }}
                    >
                      <Icon size={15} />
                    </div>
                    <div style={{ flex: 1 }}>
                      <div style={{ fontSize: '0.84rem', fontWeight: 600, color: isSelected ? 'var(--primary-700)' : 'var(--text-primary)' }}>
                        {rc.role} Account
                      </div>
                      <div style={{ fontSize: '0.7rem', color: 'var(--text-muted)' }}>
                        {rc.role === 'Admin' && 'Full access & task assignment'}
                        {rc.role === 'Sales' && 'Leads, pipeline & orders'}
                        {rc.role === 'Accounts' && 'Invoices, payments & AR'}
                        {rc.role === 'Services' && 'Service tasks & delivery'}
                      </div>
                    </div>
                  </button>
                );
              })}
            </div>
          )}
        </div>

        {/* User Profile & Logout Dropdown */}
        <div style={{ position: 'relative' }}>
          <button
            onClick={() => setShowUserMenu(!showUserMenu)}
            style={{
              display: 'flex',
              alignItems: 'center',
              gap: '6px',
              background: 'transparent',
              border: 'none',
              cursor: 'pointer',
              padding: '2px'
            }}
          >
            <div
              style={{
                width: '34px',
                height: '34px',
                borderRadius: 'var(--radius-sm)',
                background: 'linear-gradient(135deg, #4f46e5 0%, #312e81 100%)',
                color: '#ffffff',
                display: 'flex',
                alignItems: 'center',
                justifyContent: 'center',
                fontWeight: 700,
                fontSize: '0.82rem',
                boxShadow: '0 2px 6px rgba(79, 70, 229, 0.2)'
              }}
            >
              {currentUser?.avatar || 'AU'}
            </div>
          </button>

          {showUserMenu && (
            <div
              style={{
                position: 'absolute',
                top: '100%',
                right: 0,
                marginTop: '6px',
                width: '220px',
                background: 'var(--bg-surface)',
                border: '1px solid var(--border-default)',
                borderRadius: 'var(--radius-md)',
                boxShadow: 'var(--shadow-xl)',
                padding: '8px',
                zIndex: 200
              }}
            >
              <div style={{ padding: '8px 10px', borderBottom: '1px solid var(--border-default)', marginBottom: '6px' }}>
                <div style={{ fontWeight: 700, fontSize: '0.85rem' }}>{currentUser?.name}</div>
                <div style={{ fontSize: '0.72rem', color: 'var(--text-muted)' }}>{currentUser?.email}</div>
                <span className="badge badge-purple" style={{ marginTop: '4px', fontSize: '0.65rem' }}>{currentRole} Role</span>
              </div>
              <button
                className="btn btn-ghost btn-sm"
                style={{ width: '100%', justifyContent: 'flex-start', color: 'var(--danger-text)' }}
                onClick={() => { setShowUserMenu(false); logout(); }}
              >
                <LogOut size={14} /> Sign Out Session
              </button>
            </div>
          )}
        </div>
      </div>
    </header>
  );
};
