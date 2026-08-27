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
  CheckSquare,
  MapPin,
  Menu
} from 'lucide-react';

export const MobileBottomNav = ({ currentView, onChangeView, onToggleSidebar }) => {
  const { currentRole } = useApp();

  // Pick top 4 icons based on active role
  const getRoleItems = () => {
    if (currentRole === 'Sales') {
      return [
        { id: 'dashboard', label: 'Dashboard', icon: LayoutDashboard },
        { id: 'leads', label: 'Pipeline', icon: Users },
        { id: 'clients', label: 'Clients', icon: Building2 },
        { id: 'orders', label: 'Orders', icon: ShoppingCart }
      ];
    }
    if (currentRole === 'Accounts') {
      return [
        { id: 'dashboard', label: 'Dashboard', icon: LayoutDashboard },
        { id: 'invoices', label: 'Invoices', icon: FileText },
        { id: 'payments', label: 'Payments', icon: CreditCard },
        { id: 'clients', label: 'Clients', icon: Building2 }
      ];
    }
    if (currentRole === 'Services') {
      return [
        { id: 'dashboard', label: 'Dashboard', icon: LayoutDashboard },
        { id: 'tasks', label: 'Tasks', icon: CheckSquare },
        { id: 'orders', label: 'Orders', icon: ShoppingCart },
        { id: 'inventory', label: 'Inventory', icon: Boxes }
      ];
    }
    // Admin default
    return [
      { id: 'dashboard', label: 'Dashboard', icon: LayoutDashboard },
      { id: 'leads', label: 'Pipeline', icon: Users },
      { id: 'clients', label: 'Clients', icon: Building2 },
      { id: 'orders', label: 'Orders', icon: ShoppingCart }
    ];
  };

  const navItems = getRoleItems();

  return (
    <nav className="mobile-bottom-bar">
      {navItems.map((item) => {
        const Icon = item.icon;
        const isActive = currentView === item.id;
        return (
          <button
            key={item.id}
            onClick={() => onChangeView(item.id)}
            className={`mobile-nav-item ${isActive ? 'active' : ''}`}
          >
            <Icon size={19} />
            <span>{item.label}</span>
          </button>
        );
      })}
      {/* More / Menu toggle */}
      <button
        onClick={onToggleSidebar}
        className="mobile-nav-item"
        style={{ color: 'var(--text-secondary)' }}
      >
        <Menu size={19} />
        <span>Menu</span>
      </button>
    </nav>
  );
};
