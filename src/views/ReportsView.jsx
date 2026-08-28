import React, { useState } from 'react';
import { useApp } from '../context/AppContext';
import { indiaStateData } from '../data/initialData';
import {
  BarChart3,
  Download,
  Printer,
  Calendar,
  Filter,
  TrendingUp,
  FileText,
  Boxes,
  Users,
  CreditCard,
  ShoppingCart,
  MapPin,
  CheckSquare,
  Truck
} from 'lucide-react';
import { formatCurrency, formatDate } from '../utils/formatters';

export const ReportsView = () => {
  const { clients, leads, orders, inventory, invoices, payments, tasks, dispatches, users, selectedCompany, companyBrands, matchesCompany } = useApp();
  const [selectedReport, setSelectedReport] = useState('sales');
  const [dateRange, setDateRange] = useState('all'); // 'all' | 'month' | 'quarter' | 'year'

  // Scoped datasets by company
  const scopedClients = clients.filter(matchesCompany);
  const scopedLeads = leads.filter(matchesCompany);
  const scopedOrders = orders.filter(matchesCompany);
  const scopedInventory = inventory.filter(matchesCompany);
  const scopedInvoices = invoices.filter(matchesCompany);
  const scopedPayments = payments.filter(matchesCompany);
  const scopedTasks = tasks.filter(matchesCompany);
  const scopedDispatches = dispatches.filter(matchesCompany);

  // Report Types
  const reportTypes = [
    { id: 'sales', label: '1. Sales & Revenue Report', icon: TrendingUp },
    { id: 'leads', label: '2. Lead Conversion Report', icon: Users },
    { id: 'clients', label: '3. Client Performance Report', icon: FileText },
    { id: 'orders', label: '4. Order Fulfillment Report', icon: ShoppingCart },
    { id: 'dispatches', label: '5. Dispatches & Logistics Challans', icon: Truck },
    { id: 'payments', label: '6. Payment & Collections Report', icon: CreditCard },
    { id: 'outstanding', label: '7. Outstanding Balance Report', icon: CreditCard },
    { id: 'inventory', label: '8. Inventory Stock Valuation', icon: Boxes },
    { id: 'tasks', label: '9. Team Task Execution Report', icon: CheckSquare },
    { id: 'statewise', label: '10. State-wise Client Report', icon: MapPin }
  ];

  // Export Table to CSV
  const handleExportCSV = () => {
    let csvContent = 'data:text/csv;charset=utf-8,';
    
    if (selectedReport === 'sales' || selectedReport === 'orders') {
      csvContent += 'Order ID,Client Name,Products,Quantity,Order Value,Date,Delivery Status,Payment Status\n';
      scopedOrders.forEach(o => {
        csvContent += `"${o.id}","${o.clientName}","${o.productCode}",${o.quantity},${o.orderValue},"${o.orderDate}","${o.deliveryStatus}","${o.paymentStatus}"\n`;
      });
    } else if (selectedReport === 'leads') {
      csvContent += 'Lead ID,Company,Contact,City,State,Source,Rep,Expected Value,Stage,Conversion Status\n';
      scopedLeads.forEach(l => {
        csvContent += `"${l.id}","${l.company}","${l.client}","${l.city}","${l.state}","${l.leadSource}","${l.assignedSalesperson}",${l.expectedValue},"${l.stage}","${l.conversionStatus}"\n`;
      });
    } else if (selectedReport === 'inventory') {
      csvContent += 'Product Code,Name,SKU,Category,Price,Current Stock,Available,Reserved,Min Level,Supplier\n';
      scopedInventory.forEach(p => {
        csvContent += `"${p.productCode}","${p.name}","${p.sku}","${p.category}",${p.price},${p.currentStock},${p.availableStock},${p.reservedStock},${p.minStockLevel},"${p.supplier}"\n`;
      });
    } else if (selectedReport === 'dispatches') {
      csvContent += 'Challan #,Order ID,Client Name,Carrier,Tracking AWB,E-Way Bill,Dispatch Date,Est Delivery,Packages,Weight,Status\n';
      scopedDispatches.forEach(d => {
        csvContent += `"${d.challanNumber}","${d.orderId}","${d.clientName}","${d.courierCarrier}","${d.trackingNumber}","${d.ewayBillNumber}","${d.dispatchDate}","${d.estimatedDelivery}","${d.packageCount}","${d.packageWeight}","${d.dispatchStatus}"\n`;
      });
    } else if (selectedReport === 'outstanding' || selectedReport === 'payments') {
      csvContent += 'Invoice #,Client Name,Invoice Amount,Amount Paid,Balance Due,Due Date,Status\n';
      scopedInvoices.forEach(i => {
        csvContent += `"${i.invoiceNumber}","${i.clientName}",${i.totalAmount},${i.amountPaid},${i.balance},"${i.paymentDueDate}","${i.paymentStatus}"\n`;
      });
    } else {
      csvContent += 'ID,Name,Details,Value,Status\n';
      scopedClients.forEach(c => {
        csvContent += `"${c.id}","${c.companyName}","${c.city}, ${c.state}",${c.totalBusinessValue},"${c.clientStatus}"\n`;
      });
    }

    const encodedUri = encodeURI(csvContent);
    const link = document.createElement('a');
    link.setAttribute('href', encodedUri);
    link.setAttribute('download', `Auco_Aiwa_${selectedReport}_report.csv`);
    document.body.appendChild(link);
    link.click();
    document.body.removeChild(link);
  };

  const handlePrint = () => {
    window.print();
  };

  return (
    <div style={{ display: 'flex', flexDirection: 'column', gap: '20px' }}>
      {/* Header */}
      <div className="flex-between">
        <div>
          <h2>Business Intelligence & Reports</h2>
          <p style={{ fontSize: '0.82rem', color: 'var(--text-muted)' }}>
            Comprehensive executive reporting with date filters, exportable CSV sheets, and printable records.
          </p>
        </div>
        <div style={{ display: 'flex', gap: '10px' }}>
          <button className="btn btn-secondary btn-sm" onClick={handlePrint}>
            <Printer size={15} /> Print Report
          </button>
          <button className="btn btn-primary btn-sm" onClick={handleExportCSV}>
            <Download size={15} /> Export CSV
          </button>
        </div>
      </div>

      {/* Control Bar */}
      <div className="card" style={{ padding: '14px 18px' }}>
        <div style={{ display: 'flex', gap: '16px', flexWrap: 'wrap', alignItems: 'center', justifyContent: 'space-between' }}>
          <div style={{ display: 'flex', alignItems: 'center', gap: '8px' }}>
            <span style={{ fontSize: '0.82rem', fontWeight: 700, color: 'var(--text-muted)' }}>SELECT REPORT:</span>
            <select
              className="form-select"
              value={selectedReport}
              onChange={(e) => setSelectedReport(e.target.value)}
              style={{ width: '280px', fontWeight: 600 }}
            >
              {reportTypes.map((rt) => (
                <option key={rt.id} value={rt.id}>{rt.label}</option>
              ))}
            </select>
          </div>

          <div style={{ display: 'flex', alignItems: 'center', gap: '8px' }}>
            <span style={{ fontSize: '0.82rem', fontWeight: 700, color: 'var(--text-muted)' }}>DATE RANGE:</span>
            <select
              className="form-select"
              value={dateRange}
              onChange={(e) => setDateRange(e.target.value)}
              style={{ width: '180px' }}
            >
              <option value="all">All-Time Cumulative</option>
              <option value="month">This Month (August 2026)</option>
              <option value="quarter">This Fiscal Quarter (Q2)</option>
              <option value="year">Current Fiscal Year (2026-27)</option>
            </select>
          </div>
        </div>
      </div>

      {/* =========================================================================
          REPORT CONTENTS
          ========================================================================= */}
      
      {/* 1. SALES REPORT */}
      {selectedReport === 'sales' && (
        <div className="card" style={{ display: 'flex', flexDirection: 'column', gap: '16px' }}>
          <div className="flex-between">
            <div>
              <h3>Sales & Revenue Performance Report</h3>
              <p style={{ fontSize: '0.8rem', color: 'var(--text-muted)' }}>Orders and contract values booked</p>
            </div>
            <strong style={{ fontSize: '1.2rem', color: 'var(--primary-600)' }}>
              Total: {formatCurrency(scopedOrders.reduce((acc, o) => acc + Number(o.orderValue || 0), 0))}
            </strong>
          </div>

          <div className="table-container">
            <table className="custom-table">
              <thead>
                <tr>
                  <th>Order ID</th>
                  <th>Client Name</th>
                  <th>Products / Line Items</th>
                  <th>Order Date</th>
                  <th>Sales Rep</th>
                  <th>Order Value</th>
                </tr>
              </thead>
              <tbody>
                {scopedOrders.map((o) => (
                  <tr key={o.id}>
                    <td><strong>{o.id}</strong></td>
                    <td>{o.clientName}</td>
                    <td style={{ fontSize: '0.78rem' }}>{o.productCode}</td>
                    <td>{formatDate(o.orderDate)}</td>
                    <td>{o.assignedTeamMember}</td>
                    <td><strong>{formatCurrency(o.orderValue)}</strong></td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        </div>
      )}

      {/* 2. LEAD CONVERSION REPORT */}
      {selectedReport === 'leads' && (
        <div className="card" style={{ display: 'flex', flexDirection: 'column', gap: '16px' }}>
          <div className="flex-between">
            <div>
              <h3>Lead Conversion & Acquisition Report</h3>
              <p style={{ fontSize: '0.8rem', color: 'var(--text-muted)' }}>Pipeline velocity, lead sources, and win rate</p>
            </div>
            <span className="badge badge-success" style={{ fontSize: '0.9rem', padding: '6px 12px' }}>
              Overall Conversion Rate: {scopedLeads.length > 0 ? Math.round((scopedLeads.filter(l => l.conversionStatus === 'Converted').length / scopedLeads.length) * 100) : 0}%
            </span>
          </div>

          <div className="table-container">
            <table className="custom-table">
              <thead>
                <tr>
                  <th>Company / Prospect</th>
                  <th>Source</th>
                  <th>Type</th>
                  <th>Sales Rep</th>
                  <th>Expected Value</th>
                  <th>Current Stage</th>
                  <th>Conversion Status</th>
                </tr>
              </thead>
              <tbody>
                {scopedLeads.map((l) => (
                  <tr key={l.id}>
                    <td><strong>{l.company}</strong> ({l.client})</td>
                    <td><span className="badge badge-neutral">{l.leadSource}</span></td>
                    <td>{l.leadType}</td>
                    <td>{l.assignedSalesperson}</td>
                    <td><strong>{formatCurrency(l.expectedValue)}</strong></td>
                    <td><span className="badge badge-info">{l.stage}</span></td>
                    <td>
                      <span className={`badge ${l.conversionStatus === 'Converted' ? 'badge-success' : 'badge-neutral'}`}>
                        {l.conversionStatus}
                      </span>
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        </div>
      )}

      {/* 3. CLIENT REPORT */}
      {selectedReport === 'clients' && (
        <div className="card" style={{ display: 'flex', flexDirection: 'column', gap: '16px' }}>
          <div className="flex-between">
            <div>
              <h3>Client Performance & Accounts Report</h3>
              <p style={{ fontSize: '0.8rem', color: 'var(--text-muted)' }}>Total lifetime value, order frequency, and account standing</p>
            </div>
            <strong style={{ fontSize: '1.2rem', color: 'var(--primary-600)' }}>
              Total Network Value: {formatCurrency(scopedClients.reduce((acc, c) => acc + Number(c.totalBusinessValue || 0), 0))}
            </strong>
          </div>

          <div className="table-container">
            <table className="custom-table">
              <thead>
                <tr>
                  <th>Client ID</th>
                  <th>Company Name</th>
                  <th>Location</th>
                  <th>Type</th>
                  <th>Total Orders</th>
                  <th>Frequency</th>
                  <th>Payment Terms</th>
                  <th>Lifetime Value</th>
                </tr>
              </thead>
              <tbody>
                {scopedClients.map((c) => (
                  <tr key={c.id}>
                    <td><strong>{c.id}</strong></td>
                    <td><strong>{c.companyName}</strong></td>
                    <td>{c.city}, {c.state}</td>
                    <td><span className="badge badge-purple">{c.clientType}</span></td>
                    <td style={{ textAlign: 'center' }}>{c.totalOrders}</td>
                    <td>{c.orderFrequency}</td>
                    <td>{c.paymentTerms}</td>
                    <td><strong>{formatCurrency(c.totalBusinessValue)}</strong></td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        </div>
      )}

      {/* 4. ORDER REPORT */}
      {selectedReport === 'orders' && (
        <div className="card" style={{ display: 'flex', flexDirection: 'column', gap: '16px' }}>
          <div className="flex-between">
            <div>
              <h3>Order Fulfillment & Logistics Report</h3>
              <p style={{ fontSize: '0.8rem', color: 'var(--text-muted)' }}>Status of hardware shipments and technical commissioning</p>
            </div>
          </div>

          <div className="table-container">
            <table className="custom-table">
              <thead>
                <tr>
                  <th>Order ID</th>
                  <th>Client</th>
                  <th>Equipment Codes</th>
                  <th>Quantity</th>
                  <th>Order Value</th>
                  <th>Delivery Status</th>
                  <th>Payment Status</th>
                </tr>
              </thead>
              <tbody>
                {scopedOrders.map((o) => (
                  <tr key={o.id}>
                    <td><strong>{o.id}</strong></td>
                    <td>{o.clientName}</td>
                    <td style={{ fontSize: '0.78rem' }}>{o.productCode}</td>
                    <td style={{ textAlign: 'center' }}>{o.quantity}</td>
                    <td><strong>{formatCurrency(o.orderValue)}</strong></td>
                    <td><span className="badge badge-warning">{o.deliveryStatus}</span></td>
                    <td><span className="badge badge-info">{o.paymentStatus}</span></td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        </div>
      )}

      {/* 5. PAYMENT & COLLECTIONS REPORT */}
      {selectedReport === 'payments' && (
        <div className="card" style={{ display: 'flex', flexDirection: 'column', gap: '16px' }}>
          <div className="flex-between">
            <div>
              <h3>Payment & Collections Summary</h3>
              <p style={{ fontSize: '0.8rem', color: 'var(--text-muted)' }}>Settled payments and receipts</p>
            </div>
            <strong style={{ fontSize: '1.2rem', color: 'var(--success-text)' }}>
              Collected: {formatCurrency(scopedPayments.reduce((acc, p) => acc + Number(p.amountPaid || 0), 0))}
            </strong>
          </div>

          <div className="table-container">
            <table className="custom-table">
              <thead>
                <tr>
                  <th>Invoice #</th>
                  <th>Client Name</th>
                  <th>Invoice Value</th>
                  <th>Amount Paid</th>
                  <th>Payment Date</th>
                  <th>Mode</th>
                  <th>Status</th>
                </tr>
              </thead>
              <tbody>
                {scopedPayments.map((p) => (
                  <tr key={p.id}>
                    <td><strong>{p.invoiceNumber}</strong></td>
                    <td>{p.clientName}</td>
                    <td>{formatCurrency(p.invoiceAmount)}</td>
                    <td style={{ color: 'var(--success-text)', fontWeight: 600 }}>{formatCurrency(p.amountPaid)}</td>
                    <td>{p.paymentDate ? formatDate(p.paymentDate) : 'Pending'}</td>
                    <td>{p.paymentMode}</td>
                    <td><span className="badge badge-success">{p.paymentStatus}</span></td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        </div>
      )}

      {/* 6. OUTSTANDING BALANCE REPORT */}
      {selectedReport === 'outstanding' && (
        <div className="card" style={{ display: 'flex', flexDirection: 'column', gap: '16px' }}>
          <div className="flex-between">
            <div>
              <h3>Outstanding Receivables & Aging Report</h3>
              <p style={{ fontSize: '0.8rem', color: 'var(--text-muted)' }}>Unpaid invoices and overdue collection targets</p>
            </div>
            <strong style={{ fontSize: '1.2rem', color: 'var(--danger-text)' }}>
              Total AR Balance: {formatCurrency(scopedInvoices.reduce((acc, i) => acc + Number(i.balance || 0), 0))}
            </strong>
          </div>

          <div className="table-container">
            <table className="custom-table">
              <thead>
                <tr>
                  <th>Invoice #</th>
                  <th>Client Name</th>
                  <th>Total Billed</th>
                  <th>Amount Paid</th>
                  <th>Balance Due (AR)</th>
                  <th>Due Date</th>
                  <th>Status</th>
                </tr>
              </thead>
              <tbody>
                {scopedInvoices.filter(i => i.balance > 0).map((inv) => (
                  <tr key={inv.id}>
                    <td><strong>{inv.invoiceNumber}</strong></td>
                    <td>{inv.clientName}</td>
                    <td>{formatCurrency(inv.totalAmount)}</td>
                    <td>{formatCurrency(inv.amountPaid)}</td>
                    <td><strong style={{ color: 'var(--danger-text)' }}>{formatCurrency(inv.balance)}</strong></td>
                    <td>{formatDate(inv.paymentDueDate)}</td>
                    <td><span className="badge badge-danger">{inv.paymentStatus}</span></td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        </div>
      )}

      {/* 7. INVENTORY REPORT */}
      {selectedReport === 'inventory' && (
        <div className="card" style={{ display: 'flex', flexDirection: 'column', gap: '16px' }}>
          <div className="flex-between">
            <div>
              <h3>Inventory Stock & Asset Valuation Report</h3>
              <p style={{ fontSize: '0.8rem', color: 'var(--text-muted)' }}>Available stock units, safety thresholds, and asset values</p>
            </div>
            <strong style={{ fontSize: '1.2rem', color: 'var(--primary-600)' }}>
              Total Valuation: {formatCurrency(scopedInventory.reduce((acc, p) => acc + (p.currentStock * p.price), 0))}
            </strong>
          </div>

          <div className="table-container">
            <table className="custom-table">
              <thead>
                <tr>
                  <th>Code</th>
                  <th>Product Name</th>
                  <th>Category</th>
                  <th>Unit Price</th>
                  <th>Available Stock</th>
                  <th>Min Level</th>
                  <th>Stock Valuation</th>
                </tr>
              </thead>
              <tbody>
                {scopedInventory.map((p) => (
                  <tr key={p.id}>
                    <td><strong>{p.productCode}</strong></td>
                    <td>{p.name}</td>
                    <td>{p.category}</td>
                    <td>{formatCurrency(p.price)}</td>
                    <td><strong>{p.availableStock} Units</strong></td>
                    <td>{p.minStockLevel}</td>
                    <td><strong>{formatCurrency(p.currentStock * p.price)}</strong></td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        </div>
      )}

      {/* 8. TEAM TASK REPORT */}
      {selectedReport === 'tasks' && (
        <div className="card" style={{ display: 'flex', flexDirection: 'column', gap: '16px' }}>
          <div className="flex-between">
            <div>
              <h3>Team Task Execution & Workload Report</h3>
              <p style={{ fontSize: '0.8rem', color: 'var(--text-muted)' }}>Task delivery speed and completion rates</p>
            </div>
          </div>

          <div className="table-container">
            <table className="custom-table">
              <thead>
                <tr>
                  <th>Task Name</th>
                  <th>Assigned Person</th>
                  <th>Client / Account</th>
                  <th>Priority</th>
                  <th>Due Date</th>
                  <th>Status</th>
                </tr>
              </thead>
              <tbody>
                {scopedTasks.map((t) => (
                  <tr key={t.id}>
                    <td><strong>{t.taskName}</strong></td>
                    <td>{t.assignedPerson}</td>
                    <td>{t.client}</td>
                    <td><span className="badge badge-warning">{t.priority}</span></td>
                    <td>{formatDate(t.dueDate)}</td>
                    <td><span className="badge badge-info">{t.status}</span></td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        </div>
      )}

      {/* 10. STATE-WISE REPORT */}
      {selectedReport === 'statewise' && (
        <div className="card" style={{ display: 'flex', flexDirection: 'column', gap: '16px' }}>
          <div className="flex-between">
            <div>
              <h3>State-wise Client & Revenue Distribution</h3>
              <p style={{ fontSize: '0.8rem', color: 'var(--text-muted)' }}>Geographic regional revenue breakdown across India</p>
            </div>
          </div>

          <div className="table-container">
            <table className="custom-table">
              <thead>
                <tr>
                  <th>State Name</th>
                  <th>Client Count</th>
                  <th>Primary Hub Cities</th>
                  <th>Total Orders</th>
                  <th>Total Business Value</th>
                </tr>
              </thead>
              <tbody>
                {Object.entries(indiaStateData).map(([stName, data]) => {
                  const stateClients = scopedClients.filter(c => c.state === stName);
                  const stOrders = stateClients.reduce((acc, c) => acc + Number(c.totalOrders || 0), 0);
                  const stValue = stateClients.reduce((acc, c) => acc + Number(c.totalBusinessValue || 0), 0);
                  return (
                    <tr key={stName}>
                      <td><strong>{stName}</strong></td>
                      <td><strong>{stateClients.length}</strong></td>
                      <td style={{ fontSize: '0.78rem', color: 'var(--text-muted)' }}>{data.clientCities.join(', ')}</td>
                      <td>{stOrders}</td>
                      <td><strong>{formatCurrency(stValue)}</strong></td>
                    </tr>
                  );
                })}
              </tbody>
            </table>
          </div>
        </div>
      )}

      {/* DISPATCHES REPORT */}
      {selectedReport === 'dispatches' && (
        <div className="card" style={{ display: 'flex', flexDirection: 'column', gap: '16px' }}>
          <div className="flex-between">
            <div>
              <h3>Dispatches & Logistics Challans Report</h3>
              <p style={{ fontSize: '0.8rem', color: 'var(--text-muted)' }}>AWB carrier tracking and delivery challan status</p>
            </div>
          </div>

          <div className="table-container">
            <table className="custom-table">
              <thead>
                <tr>
                  <th>Challan #</th>
                  <th>Order Ref</th>
                  <th>Client Name</th>
                  <th>Carrier</th>
                  <th>AWB / Tracking #</th>
                  <th>Dispatch Date</th>
                  <th>Est Delivery</th>
                  <th>Packages</th>
                  <th>Status</th>
                </tr>
              </thead>
              <tbody>
                {scopedDispatches.map((d) => (
                  <tr key={d.id}>
                    <td><strong style={{ color: 'var(--primary-600)' }}>{d.challanNumber}</strong></td>
                    <td>{d.orderId}</td>
                    <td><strong>{d.clientName}</strong></td>
                    <td><span className="badge badge-purple">{d.courierCarrier}</span></td>
                    <td style={{ fontFamily: 'monospace' }}>{d.trackingNumber}</td>
                    <td>{formatDate(d.dispatchDate)}</td>
                    <td>{formatDate(d.estimatedDelivery)}</td>
                    <td>{d.packageCount} ({d.packageWeight})</td>
                    <td><span className="badge badge-info">{d.dispatchStatus}</span></td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        </div>
      )}
    </div>
  );
};
