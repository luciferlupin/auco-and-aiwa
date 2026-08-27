import React, { createContext, useContext, useState, useEffect, useCallback } from 'react';
import { supabase } from '../lib/supabase';
import {
  initialUsers,
  initialProducts,
  initialClients,
  initialLeads,
  initialOrders,
  initialInvoices,
  initialPayments,
  initialFollowUps,
  initialTasks
} from '../data/initialData';
import { generateId } from '../utils/formatters';

const AppContext = createContext();

export const AppProvider = ({ children }) => {
  // Authentication & Session State (Default active so app is instantly ready)
  const [isAuthenticated, setIsAuthenticated] = useState(() => {
    return localStorage.getItem('auco_auth_session') !== 'false';
  });

  const [currentUser, setCurrentUser] = useState(() => {
    const savedUser = localStorage.getItem('auco_current_user');
    if (savedUser) {
      try { return JSON.parse(savedUser); } catch(e) {}
    }
    return initialUsers[0]; // Rajesh Sharma (Admin)
  });

  const [currentRole, setCurrentRole] = useState(() => {
    return localStorage.getItem('auco_current_role') || 'Admin';
  });

  const [isCloudSynced, setIsCloudSynced] = useState(false);
  const [isSyncing, setIsSyncing] = useState(false);

  // Toast notifications
  const [toasts, setToasts] = useState([]);

  const addToast = (title, message, type = 'info') => {
    const id = Date.now() + Math.random();
    setToasts((prev) => [...prev, { id, title, message, type }]);
    setTimeout(() => {
      removeToast(id);
    }, 4500);
  };

  const removeToast = (id) => {
    setToasts((prev) => prev.filter((t) => t.id !== id));
  };

  // State collections with LocalStorage fallback
  const [users, setUsers] = useState(() => {
    const data = localStorage.getItem('auco_users');
    return data ? JSON.parse(data) : initialUsers;
  });

  const [inventory, setInventory] = useState(() => {
    const data = localStorage.getItem('auco_inventory');
    return data ? JSON.parse(data) : initialProducts;
  });

  const [clients, setClients] = useState(() => {
    const data = localStorage.getItem('auco_clients');
    return data ? JSON.parse(data) : initialClients;
  });

  const [leads, setLeads] = useState(() => {
    const data = localStorage.getItem('auco_leads');
    return data ? JSON.parse(data) : initialLeads;
  });

  const [orders, setOrders] = useState(() => {
    const data = localStorage.getItem('auco_orders');
    return data ? JSON.parse(data) : initialOrders;
  });

  const [invoices, setInvoices] = useState(() => {
    const data = localStorage.getItem('auco_invoices');
    return data ? JSON.parse(data) : initialInvoices;
  });

  const [payments, setPayments] = useState(() => {
    const data = localStorage.getItem('auco_payments');
    return data ? JSON.parse(data) : initialPayments;
  });

  const [tasks, setTasks] = useState(() => {
    const data = localStorage.getItem('auco_tasks');
    return data ? JSON.parse(data) : initialTasks;
  });

  const [followUps, setFollowUps] = useState(() => {
    const data = localStorage.getItem('auco_followups');
    return data ? JSON.parse(data) : initialFollowUps;
  });

  // Sync to LocalStorage
  useEffect(() => {
    localStorage.setItem('auco_auth_session', isAuthenticated ? 'true' : 'false');
  }, [isAuthenticated]);

  useEffect(() => {
    localStorage.setItem('auco_current_role', currentRole);
  }, [currentRole]);

  useEffect(() => {
    localStorage.setItem('auco_current_user', JSON.stringify(currentUser));
  }, [currentUser]);

  useEffect(() => {
    localStorage.setItem('auco_users', JSON.stringify(users));
  }, [users]);

  useEffect(() => {
    localStorage.setItem('auco_inventory', JSON.stringify(inventory));
  }, [inventory]);

  useEffect(() => {
    localStorage.setItem('auco_clients', JSON.stringify(clients));
  }, [clients]);

  useEffect(() => {
    localStorage.setItem('auco_leads', JSON.stringify(leads));
  }, [leads]);

  useEffect(() => {
    localStorage.setItem('auco_orders', JSON.stringify(orders));
  }, [orders]);

  useEffect(() => {
    localStorage.setItem('auco_invoices', JSON.stringify(invoices));
  }, [invoices]);

  useEffect(() => {
    localStorage.setItem('auco_payments', JSON.stringify(payments));
  }, [payments]);

  useEffect(() => {
    localStorage.setItem('auco_tasks', JSON.stringify(tasks));
  }, [tasks]);

  useEffect(() => {
    localStorage.setItem('auco_followups', JSON.stringify(followUps));
  }, [followUps]);

  // Load from Supabase on start
  const fetchSupabaseData = useCallback(async () => {
    try {
      setIsSyncing(true);

      // Check clients
      const { data: dbClients, error: clientErr } = await supabase.from('clients').select('*');
      if (!clientErr && dbClients && dbClients.length > 0) {
        const mappedClients = dbClients.map(c => ({
          id: c.id,
          clientName: c.client_name,
          companyName: c.company_name,
          contactPerson: c.contact_person,
          phone: c.phone,
          email: c.email,
          address: c.address,
          city: c.city,
          state: c.state,
          clientType: c.client_type,
          leadSource: c.lead_source,
          leadType: c.lead_type,
          conversionStatus: c.conversion_status,
          assignedSalesPerson: c.assigned_sales_person,
          totalOrders: Number(c.total_orders || 0),
          orderFrequency: c.order_frequency,
          lastOrder: c.last_order,
          nextExpectedOrder: c.next_expected_order,
          paymentTerms: c.payment_terms,
          paymentDays: Number(c.payment_days || 30),
          pendingAmount: Number(c.pending_amount || 0),
          totalBusinessValue: Number(c.total_business_value || 0),
          notes: c.notes,
          clientStatus: c.client_status
        }));
        setClients(mappedClients);
        setIsCloudSynced(true);
      }

      // Check products
      const { data: dbProducts, error: prodErr } = await supabase.from('products').select('*');
      if (!prodErr && dbProducts && dbProducts.length > 0) {
        const mappedProducts = dbProducts.map(p => ({
          id: p.id,
          productCode: p.product_code,
          name: p.name,
          sku: p.sku,
          category: p.category,
          currentStock: Number(p.current_stock || 0),
          minStockLevel: Number(p.min_stock_level || 5),
          stockIn: Number(p.stock_in || 0),
          stockOut: Number(p.stock_out || 0),
          availableStock: Number(p.available_stock || 0),
          reservedStock: Number(p.reserved_stock || 0),
          supplier: p.supplier,
          price: Number(p.price || 0)
        }));
        setInventory(mappedProducts);
        setIsCloudSynced(true);
      }

      // Check leads
      const { data: dbLeads, error: leadErr } = await supabase.from('leads').select('*');
      if (!leadErr && dbLeads && dbLeads.length > 0) {
        const mappedLeads = dbLeads.map(l => ({
          id: l.id,
          client: l.client,
          company: l.company,
          phone: l.phone,
          email: l.email,
          city: l.city,
          state: l.state,
          leadSource: l.lead_source,
          leadType: l.lead_type,
          assignedSalesperson: l.assigned_salesperson,
          followUpDate: l.follow_up_date,
          lastContact: l.last_contact,
          nextAction: l.next_action,
          stage: l.stage,
          expectedValue: Number(l.expected_value || 0),
          conversionStatus: l.conversion_status,
          conversionDate: l.conversion_date,
          conversionPercentage: Number(l.conversion_percentage || 20),
          leadDate: l.lead_date,
          notes: l.notes,
          whatsappStatus: l.whatsapp_status
        }));
        setLeads(mappedLeads);
        setIsCloudSynced(true);
      }

      // Check orders
      const { data: dbOrders, error: orderErr } = await supabase.from('orders').select('*');
      if (!orderErr && dbOrders && dbOrders.length > 0) {
        const mappedOrders = dbOrders.map(o => ({
          id: o.id,
          clientId: o.client_id,
          clientName: o.client_name,
          items: o.items || [],
          productCode: o.product_code,
          quantity: Number(o.quantity || 1),
          orderValue: Number(o.order_value || 0),
          orderDate: o.order_date,
          deliveryStatus: o.delivery_status,
          paymentStatus: o.payment_status,
          invoiceId: o.invoice_id,
          assignedTeamMember: o.assigned_team_member
        }));
        setOrders(mappedOrders);
        setIsCloudSynced(true);
      }
    } catch (err) {
      console.warn('Supabase fetch notice:', err.message);
    } finally {
      setIsSyncing(false);
    }
  }, []);

  useEffect(() => {
    fetchSupabaseData();
  }, [fetchSupabaseData]);

  // Authentication Handlers
  const login = (email, password) => {
    const matched = users.find((u) => u.email.toLowerCase() === (email || '').trim().toLowerCase());
    if (matched) {
      setCurrentUser(matched);
      setCurrentRole(matched.role);
      setIsAuthenticated(true);
      addToast('Welcome to Auco & Aiwa', `Logged in as ${matched.name} (${matched.role})`, 'success');
      return { success: true };
    }
    // Fallback: accept default credentials
    const adminUser = users[0];
    setCurrentUser(adminUser);
    setCurrentRole(adminUser.role);
    setIsAuthenticated(true);
    addToast('Welcome to Auco & Aiwa', `Logged in as ${adminUser.name}`, 'success');
    return { success: true };
  };

  const quickLogin = (userOrRole) => {
    let target = userOrRole;
    if (typeof userOrRole === 'string') {
      target = users.find(u => u.role === userOrRole) || users[0];
    }
    setCurrentUser(target);
    setCurrentRole(target.role);
    setIsAuthenticated(true);
    addToast('Session Activated', `Authenticated as ${target.name} (${target.role})`, 'success');
  };

  const logout = () => {
    setIsAuthenticated(false);
    addToast('Logged Out', 'You have been signed out of your session.', 'info');
  };

  const switchRole = (role) => {
    setCurrentRole(role);
    const matchUser = users.find((u) => u.role === role) || users[0];
    setCurrentUser(matchUser);
    addToast('Role Switched', `Switched to ${role} account (${matchUser.name})`, 'info');
  };

  // Helper product lookup
  const lookupProductByCode = (code) => {
    if (!code) return null;
    const clean = code.trim().toUpperCase();
    return inventory.find(
      (p) => p.productCode.toUpperCase() === clean || (p.sku && p.sku.toUpperCase() === clean)
    );
  };

  // AUTOMATION 1: Inventory Stock Adjustments (Local + Supabase sync)
  const adjustProductStock = async (productCode, delta, reason = 'Adjustment') => {
    const cleanCode = productCode.toUpperCase();
    let updatedProduct = null;

    setInventory((prev) =>
      prev.map((item) => {
        if (item.productCode.toUpperCase() === cleanCode) {
          const newCurrent = Math.max(0, item.currentStock + delta);
          const newStockIn = delta > 0 ? item.stockIn + delta : item.stockIn;
          const newStockOut = delta < 0 ? item.stockOut + Math.abs(delta) : item.stockOut;
          const newAvailable = Math.max(0, newCurrent - (item.reservedStock || 0));

          if (newAvailable <= item.minStockLevel) {
            addToast('Low Stock Alert', `${item.name} (${item.productCode}) stock is now ${newAvailable} (Min: ${item.minStockLevel})`, 'warning');
          }

          updatedProduct = {
            ...item,
            currentStock: newCurrent,
            availableStock: newAvailable,
            stockIn: newStockIn,
            stockOut: newStockOut
          };
          return updatedProduct;
        }
        return item;
      })
    );

    // Sync to Supabase
    if (updatedProduct) {
      try {
        await supabase
          .from('products')
          .update({
            current_stock: updatedProduct.currentStock,
            available_stock: updatedProduct.availableStock,
            stock_in: updatedProduct.stockIn,
            stock_out: updatedProduct.stockOut
          })
          .eq('product_code', cleanCode);
      } catch (e) {}
    }
  };

  // AUTOMATION 2: Create Order & Auto-deduct Inventory & Update Client stats
  const createOrder = async (orderData) => {
    const newOrderId = orderData.id || generateId('ORD');
    const newOrder = {
      id: newOrderId,
      clientId: orderData.clientId,
      clientName: orderData.clientName,
      items: orderData.items || [],
      productCode: (orderData.items || []).map((i) => i.productCode).join(', '),
      quantity: (orderData.items || []).reduce((acc, i) => acc + Number(i.quantity || 1), 0),
      orderValue: Number(orderData.orderValue) || 0,
      orderDate: orderData.orderDate || new Date().toISOString().split('T')[0],
      deliveryStatus: orderData.deliveryStatus || 'In Progress',
      paymentStatus: orderData.paymentStatus || 'Unpaid',
      invoiceId: orderData.invoiceId || '',
      assignedTeamMember: orderData.assignedTeamMember || currentUser.name
    };

    setOrders((prev) => [newOrder, ...prev]);

    // Deduct stock for all line items
    if (orderData.items && orderData.items.length > 0) {
      orderData.items.forEach((item) => {
        if (item.productCode && item.quantity) {
          adjustProductStock(item.productCode, -Math.abs(Number(item.quantity)), `Order ${newOrderId}`);
        }
      });
    }

    // Update Client metrics
    if (orderData.clientId) {
      setClients((prev) =>
        prev.map((c) => {
          if (c.id === orderData.clientId) {
            return {
              ...c,
              totalOrders: (c.totalOrders || 0) + 1,
              lastOrder: newOrder.orderDate,
              totalBusinessValue: (c.totalBusinessValue || 0) + newOrder.orderValue
            };
          }
          return c;
        })
      );
    }

    // Sync Order to Supabase
    try {
      await supabase.from('orders').insert({
        id: newOrder.id,
        client_id: newOrder.clientId,
        client_name: newOrder.clientName,
        items: newOrder.items,
        product_code: newOrder.productCode,
        quantity: newOrder.quantity,
        order_value: newOrder.orderValue,
        order_date: newOrder.orderDate,
        delivery_status: newOrder.deliveryStatus,
        payment_status: newOrder.paymentStatus,
        invoice_id: newOrder.invoiceId,
        assigned_team_member: newOrder.assignedTeamMember
      });
    } catch (e) {}

    addToast('Order Created', `Order ${newOrderId} placed successfully. Stock automatically deducted.`, 'success');
    return newOrder;
  };

  const updateOrderStatus = async (orderId, updates) => {
    setOrders((prev) =>
      prev.map((o) => (o.id === orderId ? { ...o, ...updates } : o))
    );

    try {
      const dbUpdates = {};
      if (updates.deliveryStatus) dbUpdates.delivery_status = updates.deliveryStatus;
      if (updates.paymentStatus) dbUpdates.payment_status = updates.paymentStatus;
      await supabase.from('orders').update(dbUpdates).eq('id', orderId);
    } catch (e) {}

    addToast('Order Updated', `Order ${orderId} updated.`, 'info');
  };

  // AUTOMATION 3: Create Invoice & Sync Payment Record
  const createInvoice = async (invoiceData) => {
    const invNum = invoiceData.invoiceNumber || generateId('INV-2026');
    const items = invoiceData.items || [];
    const subtotal = items.reduce((acc, item) => acc + (Number(item.price || 0) * Number(item.quantity || 1)), 0);
    const taxRate = Number(invoiceData.taxRate) || 18;
    const taxAmount = Math.round(subtotal * (taxRate / 100));
    const totalAmount = subtotal + taxAmount;
    const amountPaid = Number(invoiceData.amountPaid) || 0;
    const balance = Math.max(0, totalAmount - amountPaid);
    
    let paymentStatus = invoiceData.paymentStatus || 'Sent';
    if (balance === 0 && totalAmount > 0) paymentStatus = 'Paid';
    else if (amountPaid > 0 && balance > 0) paymentStatus = 'Partially Paid';

    const newInvoice = {
      id: invNum,
      invoiceNumber: invNum,
      orderId: invoiceData.orderId || '',
      clientId: invoiceData.clientId,
      clientName: invoiceData.clientName,
      contactPerson: invoiceData.contactPerson || '',
      email: invoiceData.email || '',
      phone: invoiceData.phone || '',
      billingAddress: invoiceData.billingAddress || '',
      items,
      subtotal,
      taxRate,
      taxAmount,
      totalAmount,
      amountPaid,
      balance,
      paymentStatus,
      issueDate: invoiceData.issueDate || new Date().toISOString().split('T')[0],
      paymentDueDate: invoiceData.paymentDueDate || new Date(Date.now() + 30 * 86400000).toISOString().split('T')[0],
      paymentTerms: invoiceData.paymentTerms || 'Net 30',
      notes: invoiceData.notes || ''
    };

    setInvoices((prev) => [newInvoice, ...prev]);

    // Create / Sync matching payment record
    const newPayment = {
      id: generateId('PAY'),
      invoiceId: invNum,
      invoiceNumber: invNum,
      clientId: newInvoice.clientId,
      clientName: newInvoice.clientName,
      invoiceAmount: totalAmount,
      amountPaid: amountPaid,
      balance: balance,
      paymentDate: amountPaid > 0 ? newInvoice.issueDate : null,
      paymentDueDate: newInvoice.paymentDueDate,
      paymentDays: 30,
      paymentStatus: paymentStatus === 'Paid' ? 'Paid' : (balance > 0 && new Date(newInvoice.paymentDueDate) < new Date() ? 'Overdue' : 'Pending'),
      paymentMode: amountPaid > 0 ? 'Bank Transfer' : 'Pending'
    };

    setPayments((prev) => [newPayment, ...prev]);

    // Update Client pending balance
    if (newInvoice.clientId) {
      setClients((prev) =>
        prev.map((c) => {
          if (c.id === newInvoice.clientId) {
            return {
              ...c,
              pendingAmount: (c.pendingAmount || 0) + balance
            };
          }
          return c;
        })
      );
    }

    // Sync to Supabase
    try {
      await supabase.from('invoices').insert({
        id: newInvoice.id,
        invoice_number: newInvoice.invoiceNumber,
        order_id: newInvoice.orderId,
        client_id: newInvoice.clientId,
        client_name: newInvoice.clientName,
        contact_person: newInvoice.contactPerson,
        email: newInvoice.email,
        phone: newInvoice.phone,
        billing_address: newInvoice.billingAddress,
        items: newInvoice.items,
        subtotal: newInvoice.subtotal,
        tax_rate: newInvoice.taxRate,
        tax_amount: newInvoice.taxAmount,
        total_amount: newInvoice.totalAmount,
        amount_paid: newInvoice.amountPaid,
        balance: newInvoice.balance,
        payment_status: newInvoice.paymentStatus,
        issue_date: newInvoice.issueDate,
        payment_due_date: newInvoice.paymentDueDate,
        payment_terms: newInvoice.paymentTerms,
        notes: newInvoice.notes
      });

      await supabase.from('payments').insert({
        id: newPayment.id,
        invoice_id: newPayment.invoiceId,
        invoice_number: newPayment.invoiceNumber,
        client_id: newPayment.clientId,
        client_name: newPayment.clientName,
        invoice_amount: newPayment.invoiceAmount,
        amount_paid: newPayment.amountPaid,
        balance: newPayment.balance,
        payment_date: newPayment.paymentDate,
        payment_due_date: newPayment.paymentDueDate,
        payment_days: newPayment.paymentDays,
        payment_status: newPayment.paymentStatus,
        payment_mode: newPayment.paymentMode
      });
    } catch (e) {}

    addToast('Invoice Created', `Invoice ${invNum} generated and synced to billing database.`, 'success');
    return newInvoice;
  };

  // AUTOMATION 4: Record Payment & Auto-calculate Outstanding
  const recordPayment = async (invoiceNumber, paymentAmount, paymentMode = 'NEFT', notes = '') => {
    const amount = Number(paymentAmount);
    if (!amount || amount <= 0) return;

    let affectedClientId = null;
    let newBalance = 0;
    let invRecord = null;

    setInvoices((prev) =>
      prev.map((inv) => {
        if (inv.invoiceNumber === invoiceNumber) {
          affectedClientId = inv.clientId;
          const updatedPaid = (inv.amountPaid || 0) + amount;
          newBalance = Math.max(0, inv.totalAmount - updatedPaid);
          const newStatus = newBalance === 0 ? 'Paid' : 'Partially Paid';
          invRecord = {
            ...inv,
            amountPaid: updatedPaid,
            balance: newBalance,
            paymentStatus: newStatus
          };
          return invRecord;
        }
        return inv;
      })
    );

    setPayments((prev) =>
      prev.map((pay) => {
        if (pay.invoiceNumber === invoiceNumber) {
          const updatedPaid = (pay.amountPaid || 0) + amount;
          const bal = Math.max(0, pay.invoiceAmount - updatedPaid);
          const status = bal === 0 ? 'Paid' : (bal > 0 && new Date(pay.paymentDueDate) < new Date() ? 'Overdue' : 'Partially Paid');
          return {
            ...pay,
            amountPaid: updatedPaid,
            balance: bal,
            paymentDate: new Date().toISOString().split('T')[0],
            paymentStatus: status,
            paymentMode: paymentMode
          };
        }
        return pay;
      })
    );

    if (affectedClientId) {
      setClients((prev) =>
        prev.map((c) => {
          if (c.id === affectedClientId) {
            return {
              ...c,
              pendingAmount: Math.max(0, (c.pendingAmount || 0) - amount)
            };
          }
          return c;
        })
      );
    }

    // Sync to Supabase
    try {
      if (invRecord) {
        await supabase
          .from('invoices')
          .update({
            amount_paid: invRecord.amountPaid,
            balance: invRecord.balance,
            payment_status: invRecord.paymentStatus
          })
          .eq('invoice_number', invoiceNumber);

        await supabase
          .from('payments')
          .update({
            amount_paid: invRecord.amountPaid,
            balance: invRecord.balance,
            payment_date: new Date().toISOString().split('T')[0],
            payment_status: invRecord.paymentStatus,
            payment_mode: paymentMode
          })
          .eq('invoice_number', invoiceNumber);
      }
    } catch (e) {}

    addToast('Payment Recorded', `Received ₹${amount.toLocaleString('en-IN')} for ${invoiceNumber}. Outstanding updated.`, 'success');
  };

  // AUTOMATION 5: Lead to Client Conversion
  const convertLeadToClient = async (leadId, initialOrderValue = 0) => {
    const lead = leads.find((l) => l.id === leadId);
    if (!lead) return null;

    let existingClient = clients.find((c) => c.companyName.toLowerCase() === lead.company.toLowerCase());
    let clientId = existingClient ? existingClient.id : generateId('CLN');

    if (!existingClient) {
      const newClient = {
        id: clientId,
        clientName: lead.client,
        companyName: lead.company,
        contactPerson: `${lead.client} (Contact)`,
        phone: lead.phone,
        email: lead.email,
        address: `${lead.city}, ${lead.state}`,
        city: lead.city,
        state: lead.state,
        clientType: 'Enterprise',
        leadSource: lead.leadSource,
        leadType: lead.leadType,
        conversionStatus: 'Converted',
        assignedSalesPerson: lead.assignedSalesperson || currentUser.name,
        totalOrders: initialOrderValue > 0 ? 1 : 0,
        orderFrequency: 'Monthly',
        lastOrder: initialOrderValue > 0 ? new Date().toISOString().split('T')[0] : null,
        nextExpectedOrder: new Date(Date.now() + 30 * 86400000).toISOString().split('T')[0],
        paymentTerms: 'Net 30',
        paymentDays: 30,
        pendingAmount: 0,
        totalBusinessValue: Number(initialOrderValue) || Number(lead.expectedValue) || 0,
        notes: `Converted from lead (${lead.id}). ${lead.notes || ''}`,
        clientStatus: 'Active'
      };
      setClients((prev) => [newClient, ...prev]);

      try {
        await supabase.from('clients').insert({
          id: newClient.id,
          client_name: newClient.clientName,
          company_name: newClient.companyName,
          contact_person: newClient.contactPerson,
          phone: newClient.phone,
          email: newClient.email,
          address: newClient.address,
          city: newClient.city,
          state: newClient.state,
          client_type: newClient.clientType,
          lead_source: newClient.leadSource,
          lead_type: newClient.leadType,
          conversion_status: newClient.conversionStatus,
          assigned_sales_person: newClient.assignedSalesPerson,
          total_orders: newClient.totalOrders,
          order_frequency: newClient.orderFrequency,
          last_order: newClient.lastOrder,
          next_expected_order: newClient.nextExpectedOrder,
          payment_terms: newClient.paymentTerms,
          payment_days: newClient.paymentDays,
          pending_amount: newClient.pendingAmount,
          total_business_value: newClient.totalBusinessValue,
          notes: newClient.notes,
          client_status: newClient.clientStatus
        });
      } catch (e) {}
    }

    setLeads((prev) =>
      prev.map((l) => {
        if (l.id === leadId) {
          return {
            ...l,
            stage: 'Won',
            conversionStatus: 'Converted',
            conversionDate: new Date().toISOString().split('T')[0],
            conversionPercentage: 100
          };
        }
        return l;
      })
    );

    try {
      await supabase
        .from('leads')
        .update({
          stage: 'Won',
          conversion_status: 'Converted',
          conversion_date: new Date().toISOString().split('T')[0],
          conversion_percentage: 100
        })
        .eq('id', leadId);
    } catch (e) {}

    addToast('Lead Converted!', `Successfully converted "${lead.company}" to active client.`, 'success');
    return clientId;
  };

  // Client CRUD
  const addClient = async (clientData) => {
    const newClient = {
      id: clientData.id || generateId('CLN'),
      clientName: clientData.clientName,
      companyName: clientData.companyName,
      contactPerson: clientData.contactPerson || clientData.clientName,
      phone: clientData.phone,
      email: clientData.email,
      address: clientData.address,
      city: clientData.city,
      state: clientData.state,
      clientType: clientData.clientType || 'Enterprise',
      leadSource: clientData.leadSource || 'Website',
      leadType: clientData.leadType || 'Inbound',
      conversionStatus: 'Converted',
      assignedSalesPerson: clientData.assignedSalesPerson || currentUser.name,
      totalOrders: Number(clientData.totalOrders) || 0,
      orderFrequency: clientData.orderFrequency || 'Monthly',
      lastOrder: clientData.lastOrder || null,
      nextExpectedOrder: clientData.nextExpectedOrder || null,
      paymentTerms: clientData.paymentTerms || 'Net 30',
      paymentDays: Number(clientData.paymentDays) || 30,
      pendingAmount: Number(clientData.pendingAmount) || 0,
      totalBusinessValue: Number(clientData.totalBusinessValue) || 0,
      notes: clientData.notes || '',
      clientStatus: clientData.clientStatus || 'Active'
    };
    setClients((prev) => [newClient, ...prev]);

    try {
      await supabase.from('clients').insert({
        id: newClient.id,
        client_name: newClient.clientName,
        company_name: newClient.companyName,
        contact_person: newClient.contactPerson,
        phone: newClient.phone,
        email: newClient.email,
        address: newClient.address,
        city: newClient.city,
        state: newClient.state,
        client_type: newClient.clientType,
        lead_source: newClient.leadSource,
        lead_type: newClient.leadType,
        conversion_status: newClient.conversionStatus,
        assigned_sales_person: newClient.assignedSalesPerson,
        total_orders: newClient.totalOrders,
        order_frequency: newClient.orderFrequency,
        last_order: newClient.lastOrder,
        next_expected_order: newClient.nextExpectedOrder,
        payment_terms: newClient.paymentTerms,
        payment_days: newClient.paymentDays,
        pending_amount: newClient.pendingAmount,
        total_business_value: newClient.totalBusinessValue,
        notes: newClient.notes,
        client_status: newClient.clientStatus
      });
    } catch (e) {}

    addToast('Client Added', `${newClient.companyName} added to directory.`, 'success');
    return newClient;
  };

  const updateClient = async (clientId, updates) => {
    setClients((prev) =>
      prev.map((c) => (c.id === clientId ? { ...c, ...updates } : c))
    );

    try {
      const dbUpdates = {};
      if (updates.notes !== undefined) dbUpdates.notes = updates.notes;
      if (updates.clientStatus) dbUpdates.client_status = updates.clientStatus;
      if (updates.pendingAmount !== undefined) dbUpdates.pending_amount = updates.pendingAmount;
      await supabase.from('clients').update(dbUpdates).eq('id', clientId);
    } catch (e) {}

    addToast('Client Updated', `Client details updated.`, 'info');
  };

  // Lead CRUD
  const addLead = async (leadData) => {
    const newLead = {
      id: leadData.id || generateId('LEAD'),
      client: leadData.client,
      company: leadData.company,
      phone: leadData.phone,
      email: leadData.email,
      city: leadData.city,
      state: leadData.state,
      leadSource: leadData.leadSource || 'Website',
      leadType: leadData.leadType || 'Inbound',
      assignedSalesperson: leadData.assignedSalesperson || currentUser.name,
      followUpDate: leadData.followUpDate || new Date(Date.now() + 2 * 86400000).toISOString().split('T')[0],
      lastContact: new Date().toISOString().split('T')[0],
      nextAction: leadData.nextAction || 'Initial discovery call',
      stage: leadData.stage || 'New Lead',
      expectedValue: Number(leadData.expectedValue) || 0,
      conversionStatus: 'Not Converted',
      conversionDate: null,
      conversionPercentage: leadData.stage === 'Proposal' ? 60 : (leadData.stage === 'Negotiation' ? 80 : 20),
      leadDate: new Date().toISOString().split('T')[0],
      notes: leadData.notes || '',
      whatsappStatus: 'Lead registered'
    };
    setLeads((prev) => [newLead, ...prev]);

    try {
      await supabase.from('leads').insert({
        id: newLead.id,
        client: newLead.client,
        company: newLead.company,
        phone: newLead.phone,
        email: newLead.email,
        city: newLead.city,
        state: newLead.state,
        lead_source: newLead.leadSource,
        lead_type: newLead.leadType,
        assigned_salesperson: newLead.assignedSalesperson,
        follow_up_date: newLead.followUpDate,
        last_contact: newLead.lastContact,
        next_action: newLead.nextAction,
        stage: newLead.stage,
        expected_value: newLead.expectedValue,
        conversion_status: newLead.conversionStatus,
        conversion_date: newLead.conversionDate,
        conversion_percentage: newLead.conversionPercentage,
        lead_date: newLead.leadDate,
        notes: newLead.notes,
        whatsapp_status: newLead.whatsappStatus
      });
    } catch (e) {}

    addToast('Lead Added', `${newLead.company} added to pipeline.`, 'success');
    return newLead;
  };

  const updateLead = async (leadId, updates) => {
    setLeads((prev) =>
      prev.map((l) => (l.id === leadId ? { ...l, ...updates } : l))
    );

    try {
      const dbUpdates = {};
      if (updates.stage) dbUpdates.stage = updates.stage;
      if (updates.conversionPercentage !== undefined) dbUpdates.conversion_percentage = updates.conversionPercentage;
      if (updates.conversionStatus) dbUpdates.conversion_status = updates.conversionStatus;
      await supabase.from('leads').update(dbUpdates).eq('id', leadId);
    } catch (e) {}

    addToast('Lead Updated', `Pipeline lead status updated.`, 'info');
  };

  // Tasks CRUD
  const addTask = async (taskData) => {
    const newTask = {
      id: taskData.id || generateId('TSK'),
      taskName: taskData.taskName,
      description: taskData.description || '',
      assignedPerson: taskData.assignedPerson || currentUser.name,
      client: taskData.client || 'General',
      priority: taskData.priority || 'Medium',
      dueDate: taskData.dueDate || new Date(Date.now() + 3 * 86400000).toISOString().split('T')[0],
      status: taskData.status || 'To Do',
      createdBy: `${currentUser.name} (${currentUser.role})`,
      createdAt: new Date().toISOString().split('T')[0],
      notes: taskData.notes || ''
    };
    setTasks((prev) => [newTask, ...prev]);

    try {
      await supabase.from('tasks').insert({
        id: newTask.id,
        task_name: newTask.taskName,
        description: newTask.description,
        assigned_person: newTask.assignedPerson,
        client: newTask.client,
        priority: newTask.priority,
        due_date: newTask.dueDate,
        status: newTask.status,
        created_by: newTask.createdBy,
        created_at: newTask.createdAt,
        notes: newTask.notes
      });
    } catch (e) {}

    addToast('Task Assigned', `Task "${newTask.taskName}" assigned to ${newTask.assignedPerson}.`, 'success');
    return newTask;
  };

  const updateTask = async (taskId, updates) => {
    setTasks((prev) =>
      prev.map((t) => (t.id === taskId ? { ...t, ...updates } : t))
    );

    try {
      await supabase.from('tasks').update(updates).eq('id', taskId);
    } catch (e) {}

    addToast('Task Updated', `Task status updated.`, 'info');
  };

  // Follow-ups CRUD
  const addFollowUp = async (followUpData) => {
    const newFollowUp = {
      id: followUpData.id || generateId('FLW'),
      clientId: followUpData.clientId || '',
      clientName: followUpData.clientName,
      contactPerson: followUpData.contactPerson || '',
      phone: followUpData.phone || '',
      assignedSalesperson: followUpData.assignedSalesperson || currentUser.name,
      followUpDate: followUpData.followUpDate || new Date().toISOString().split('T')[0],
      followUpType: followUpData.followUpType || 'WhatsApp',
      notes: followUpData.notes || '',
      nextAction: followUpData.nextAction || '',
      status: followUpData.status || 'Pending'
    };
    setFollowUps((prev) => [newFollowUp, ...prev]);

    try {
      await supabase.from('followups').insert({
        id: newFollowUp.id,
        client_id: newFollowUp.clientId,
        client_name: newFollowUp.clientName,
        contact_person: newFollowUp.contactPerson,
        phone: newFollowUp.phone,
        assigned_salesperson: newFollowUp.assignedSalesperson,
        follow_up_date: newFollowUp.followUpDate,
        follow_up_type: newFollowUp.followUpType,
        notes: newFollowUp.notes,
        next_action: newFollowUp.nextAction,
        status: newFollowUp.status
      });
    } catch (e) {}

    addToast('Follow-Up Scheduled', `Follow-up logged for ${newFollowUp.clientName}.`, 'success');
    return newFollowUp;
  };

  const updateFollowUp = async (id, updates) => {
    setFollowUps((prev) =>
      prev.map((f) => (f.id === id ? { ...f, ...updates } : f))
    );

    try {
      await supabase.from('followups').update(updates).eq('id', id);
    } catch (e) {}
  };

  // Product / Inventory CRUD
  const addProduct = async (productData) => {
    const newProduct = {
      id: productData.id || generateId('PRD'),
      productCode: (productData.productCode || generateId('AUC')).toUpperCase(),
      name: productData.name,
      sku: (productData.sku || productData.productCode).toUpperCase(),
      category: productData.category || 'General',
      currentStock: Number(productData.currentStock) || 0,
      minStockLevel: Number(productData.minStockLevel) || 5,
      stockIn: Number(productData.currentStock) || 0,
      stockOut: 0,
      availableStock: Number(productData.currentStock) || 0,
      reservedStock: 0,
      supplier: productData.supplier || 'Auco Hub',
      price: Number(productData.price) || 0
    };
    setInventory((prev) => [newProduct, ...prev]);

    try {
      await supabase.from('products').insert({
        id: newProduct.id,
        product_code: newProduct.productCode,
        name: newProduct.name,
        sku: newProduct.sku,
        category: newProduct.category,
        current_stock: newProduct.currentStock,
        min_stock_level: newProduct.minStockLevel,
        stock_in: newProduct.stockIn,
        stock_out: newProduct.stockOut,
        available_stock: newProduct.availableStock,
        reserved_stock: newProduct.reservedStock,
        supplier: newProduct.supplier,
        price: newProduct.price
      });
    } catch (e) {}

    addToast('Product Added', `${newProduct.name} (${newProduct.productCode}) added to inventory.`, 'success');
    return newProduct;
  };

  // Reset Demo Data
  const resetDemoData = () => {
    setUsers(initialUsers);
    setInventory(initialProducts);
    setClients(initialClients);
    setLeads(initialLeads);
    setOrders(initialOrders);
    setInvoices(initialInvoices);
    setPayments(initialPayments);
    setTasks(initialTasks);
    setFollowUps(initialFollowUps);
    addToast('System Reset', 'All demo data has been restored to default factory state.', 'info');
  };

  return (
    <AppContext.Provider
      value={{
        isAuthenticated,
        currentUser,
        currentRole,
        login,
        quickLogin,
        logout,
        switchRole,
        setCurrentUser,
        isCloudSynced,
        isSyncing,
        fetchSupabaseData,
        toasts,
        addToast,
        removeToast,
        users,
        setUsers,
        inventory,
        addProduct,
        adjustProductStock,
        lookupProductByCode,
        clients,
        addClient,
        updateClient,
        leads,
        addLead,
        updateLead,
        convertLeadToClient,
        orders,
        createOrder,
        updateOrderStatus,
        invoices,
        createInvoice,
        payments,
        recordPayment,
        tasks,
        addTask,
        updateTask,
        followUps,
        addFollowUp,
        updateFollowUp,
        resetDemoData
      }}
    >
      {children}
    </AppContext.Provider>
  );
};

export const useApp = () => {
  const context = useContext(AppContext);
  if (!context) {
    throw new Error('useApp must be used within an AppProvider');
  }
  return context;
};
