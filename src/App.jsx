import React, { useState } from 'react';
import { useApp } from './context/AppContext';
import { Navbar } from './components/Navbar';
import { Sidebar } from './components/Sidebar';
import { MobileBottomNav } from './components/MobileBottomNav';
import { ToastContainer } from './components/Toast';
import { GlobalSearchModal } from './components/GlobalSearchModal';
import { LoginView } from './views/LoginView';

// Views
import { DashboardView } from './views/DashboardView';
import { LeadsView } from './views/LeadsView';
import { ClientsView } from './views/ClientsView';
import { OrdersView } from './views/OrdersView';
import { InventoryView } from './views/InventoryView';
import { InvoicesView } from './views/InvoicesView';
import { PaymentsView } from './views/PaymentsView';
import { FollowUpsView } from './views/FollowUpsView';
import { TasksView } from './views/TasksView';
import { IndiaMapView } from './views/IndiaMapView';
import { ReportsView } from './views/ReportsView';
import { SettingsView } from './views/SettingsView';

// Modals
import {
  CreateLeadModal,
  CreateClientModal,
  CreateOrderModal,
  CreateInvoiceModal,
  CreateTaskModal
} from './components/QuickActionModal';
import { DispatchOrderModal } from './components/DispatchOrderModal';
import { DeliveryChallanModal } from './components/DeliveryChallanModal';

export const App = () => {
  const { isAuthenticated, currentRole } = useApp();
  const [currentView, setCurrentView] = useState('dashboard');
  const [isMobileSidebarOpen, setIsMobileSidebarOpen] = useState(false);
  
  // Modal states
  const [isSearchOpen, setIsSearchOpen] = useState(false);
  const [isLeadModalOpen, setIsLeadModalOpen] = useState(false);
  const [isClientModalOpen, setIsClientModalOpen] = useState(false);
  const [isOrderModalOpen, setIsOrderModalOpen] = useState(false);
  const [isDispatchModalOpen, setIsDispatchModalOpen] = useState(false);
  const [isChallanModalOpen, setIsChallanModalOpen] = useState(false);
  const [selectedChallanDispatch, setSelectedChallanDispatch] = useState(null);
  const [isInvoiceModalOpen, setIsInvoiceModalOpen] = useState(false);
  const [isTaskModalOpen, setIsTaskModalOpen] = useState(false);

  // If user is not authenticated, display Apple-style Login Screen
  if (!isAuthenticated) {
    return (
      <>
        <LoginView />
        <ToastContainer />
      </>
    );
  }

  const handleNavigate = (viewId, triggerSearch = false) => {
    if (triggerSearch) {
      setIsSearchOpen(true);
      return;
    }
    if (viewId) {
      setCurrentView(viewId);
      setIsMobileSidebarOpen(false);
    }
  };

  return (
    <div className="app-container">
      {/* Sidebar Navigation (with Mobile Drawer support) */}
      <Sidebar
        currentView={currentView}
        onChangeView={handleNavigate}
        isMobileOpen={isMobileSidebarOpen}
        onCloseMobile={() => setIsMobileSidebarOpen(false)}
      />

      {/* Main Content Area */}
      <div className="main-content">
        {/* Top Navbar */}
        <Navbar
          onToggleMobileSidebar={() => setIsMobileSidebarOpen(!isMobileSidebarOpen)}
          onOpenSearch={() => setIsSearchOpen(true)}
          onOpenLeadModal={() => setIsLeadModalOpen(true)}
          onOpenClientModal={() => setIsClientModalOpen(true)}
          onOpenOrderModal={() => setIsOrderModalOpen(true)}
          onOpenDispatchModal={() => setIsDispatchModalOpen(true)}
          onOpenInvoiceModal={() => setIsInvoiceModalOpen(true)}
          onOpenTaskModal={() => setIsTaskModalOpen(true)}
        />

        {/* Dynamic Page Body */}
        <main className="page-body">
          {currentView === 'dashboard' && (
            <DashboardView
              onNavigate={handleNavigate}
              onOpenLeadModal={() => setIsLeadModalOpen(true)}
              onOpenOrderModal={() => setIsOrderModalOpen(true)}
              onOpenInvoiceModal={() => setIsInvoiceModalOpen(true)}
              onOpenTaskModal={() => setIsTaskModalOpen(true)}
            />
          )}
          {currentView === 'leads' && (
            <LeadsView onOpenLeadModal={() => setIsLeadModalOpen(true)} />
          )}
          {currentView === 'clients' && (
            <ClientsView
              onOpenClientModal={() => setIsClientModalOpen(true)}
              onOpenOrderModal={() => setIsOrderModalOpen(true)}
            />
          )}
          {currentView === 'orders' && (
            <OrdersView
              onOpenOrderModal={() => setIsOrderModalOpen(true)}
              onNavigate={handleNavigate}
            />
          )}
          {currentView === 'inventory' && <InventoryView />}
          {currentView === 'invoices' && (
            <InvoicesView onOpenInvoiceModal={() => setIsInvoiceModalOpen(true)} />
          )}
          {currentView === 'payments' && (
            <PaymentsView onNavigate={handleNavigate} />
          )}
          {currentView === 'followups' && <FollowUpsView />}
          {currentView === 'tasks' && (
            <TasksView onOpenTaskModal={() => setIsTaskModalOpen(true)} />
          )}
          {currentView === 'indiamap' && <IndiaMapView />}
          {currentView === 'reports' && <ReportsView />}
          {currentView === 'settings' && <SettingsView />}
        </main>
      </div>

      {/* Mobile Bottom Dock (Phone Screens) */}
      <MobileBottomNav
        currentView={currentView}
        onChangeView={handleNavigate}
        onToggleSidebar={() => setIsMobileSidebarOpen(!isMobileSidebarOpen)}
      />

      {/* Global Search Dialog */}
      <GlobalSearchModal
        isOpen={isSearchOpen}
        onClose={() => setIsSearchOpen(false)}
        onNavigate={handleNavigate}
      />

      {/* Quick Action Modals */}
      <CreateLeadModal
        isOpen={isLeadModalOpen}
        onClose={() => setIsLeadModalOpen(false)}
      />
      <CreateClientModal
        isOpen={isClientModalOpen}
        onClose={() => setIsClientModalOpen(false)}
      />
      <CreateOrderModal
        isOpen={isOrderModalOpen}
        onClose={() => setIsOrderModalOpen(false)}
      />
      <CreateInvoiceModal
        isOpen={isInvoiceModalOpen}
        onClose={() => setIsInvoiceModalOpen(false)}
      />
      <CreateTaskModal
        isOpen={isTaskModalOpen}
        onClose={() => setIsTaskModalOpen(false)}
      />
      <DispatchOrderModal
        isOpen={isDispatchModalOpen}
        onClose={() => setIsDispatchModalOpen(false)}
        onDispatchSuccess={(d) => {
          setSelectedChallanDispatch(d);
          setIsChallanModalOpen(true);
        }}
      />
      <DeliveryChallanModal
        isOpen={isChallanModalOpen}
        onClose={() => setIsChallanModalOpen(false)}
        dispatch={selectedChallanDispatch}
      />

      {/* Reactive System Notifications */}
      <ToastContainer />
    </div>
  );
};
