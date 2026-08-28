import React, { useState } from 'react';
import { useApp } from '../context/AppContext';
import {
  X,
  Printer,
  Download,
  Truck,
  CheckCircle2,
  Clock,
  MapPin,
  Package,
  Layers,
  FileText,
  Copy,
  ExternalLink,
  ShieldCheck
} from 'lucide-react';
import { formatDate, formatCurrency, getStatusBadgeClass } from '../utils/formatters';
import { generateDeliveryChallanPDF } from '../utils/pdfGenerator';

export const DeliveryChallanModal = ({ isOpen, onClose, dispatch }) => {
  const { updateDispatchStatus, addToast } = useApp();
  const [copied, setCopied] = useState(false);

  if (!isOpen || !dispatch) return null;

  const handleCopyAwb = () => {
    if (dispatch.trackingNumber) {
      navigator.clipboard.writeText(dispatch.trackingNumber);
      setCopied(true);
      addToast('Copied to Clipboard', `AWB ${dispatch.trackingNumber} copied.`, 'info');
      setTimeout(() => setCopied(false), 2500);
    }
  };

  const handleStatusChange = (newStatus) => {
    updateDispatchStatus(dispatch.id || dispatch.challanNumber, newStatus);
  };

  const handlePrint = () => {
    window.print();
  };

  const handleDownloadPDF = () => {
    generateDeliveryChallanPDF(dispatch);
    addToast('PDF Downloaded', `Dispatch slip ${dispatch.challanNumber || dispatch.id} saved.`, 'success');
  };

  const steps = ['Dispatched', 'In Transit', 'Out for Delivery', 'Delivered'];
  const currentStepIdx = steps.indexOf(dispatch.dispatchStatus) >= 0 ? steps.indexOf(dispatch.dispatchStatus) : 1;

  return (
    <div className="modal-backdrop" onClick={onClose}>
      <div
        className="modal-content"
        style={{
          maxWidth: '860px',
          maxHeight: '94vh',
          overflowY: 'auto',
          padding: 0,
          background: '#f8fafc'
        }}
        onClick={(e) => e.stopPropagation()}
      >
        {/* Top Control Bar (Non-printed in print mode) */}
        <div
          style={{
            padding: '16px 24px',
            background: '#ffffff',
            borderBottom: '1px solid var(--border-default)',
            display: 'flex',
            alignItems: 'center',
            justifyContent: 'space-between',
            flexWrap: 'wrap',
            gap: '12px',
            position: 'sticky',
            top: 0,
            zIndex: 10
          }}
        >
          <div style={{ display: 'flex', alignItems: 'center', gap: '10px' }}>
            <div
              style={{
                width: '36px',
                height: '36px',
                borderRadius: '10px',
                background: 'linear-gradient(135deg, #4f46e5 0%, #312e81 100%)',
                display: 'flex',
                alignItems: 'center',
                justifyContent: 'center',
                color: '#fff'
              }}
            >
              <Truck size={18} />
            </div>
            <div>
              <h3 style={{ margin: 0, fontSize: '1.1rem' }}>
                Shipment Dispatch Slip: <span style={{ color: 'var(--primary-600)' }}>{dispatch.challanNumber || dispatch.id}</span>
              </h3>
              <p style={{ fontSize: '0.76rem', color: 'var(--text-muted)', margin: 0 }}>
                Order #{dispatch.orderId} • Carrier: {dispatch.courierCarrier}
              </p>
            </div>
          </div>

          <div style={{ display: 'flex', alignItems: 'center', gap: '8px' }}>
            {/* Status quick changer */}
            <select
              className="form-select"
              value={dispatch.dispatchStatus}
              onChange={(e) => handleStatusChange(e.target.value)}
              style={{ width: '150px', fontSize: '0.8rem', padding: '6px 10px' }}
            >
              <option value="Dispatched">Dispatched</option>
              <option value="In Transit">In Transit</option>
              <option value="Out for Delivery">Out for Delivery</option>
              <option value="Delivered">Delivered</option>
            </select>

            <button className="btn btn-secondary btn-sm" onClick={handlePrint} title="Print Dispatch Slip">
              <Printer size={15} /> Print
            </button>

            <button className="btn btn-primary btn-sm" onClick={handleDownloadPDF} title="Download Dispatch PDF">
              <Download size={15} /> Download PDF
            </button>

            <button type="button" className="btn btn-ghost btn-icon" onClick={onClose}>
              <X size={18} />
            </button>
          </div>
        </div>

        {/* Challan Document Body (Official Paper Design) */}
        <div style={{ padding: '24px' }}>
          {/* Tracking Stepper */}
          <div
            style={{
              background: '#ffffff',
              border: '1px solid var(--border-default)',
              borderRadius: 'var(--radius-md)',
              padding: '16px 20px',
              marginBottom: '20px',
              boxShadow: 'var(--shadow-xs)'
            }}
          >
            <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: '12px' }}>
              <span style={{ fontSize: '0.78rem', fontWeight: 700, color: 'var(--text-secondary)', textTransform: 'uppercase' }}>
                Live Transit Progress
              </span>
              <span className={`badge ${getStatusBadgeClass(dispatch.dispatchStatus)}`} style={{ fontSize: '0.75rem' }}>
                {dispatch.dispatchStatus}
              </span>
            </div>

            <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between', position: 'relative' }}>
              {/* Connecting line */}
              <div
                style={{
                  position: 'absolute',
                  top: '14px',
                  left: '30px',
                  right: '30px',
                  height: '3px',
                  background: 'var(--border-default)',
                  zIndex: 1
                }}
              />
              <div
                style={{
                  position: 'absolute',
                  top: '14px',
                  left: '30px',
                  width: `${(currentStepIdx / (steps.length - 1)) * 88}%`,
                  height: '3px',
                  background: '#10b981',
                  transition: 'width 0.3s ease',
                  zIndex: 2
                }}
              />

              {steps.map((step, idx) => {
                const isPassed = idx <= currentStepIdx;
                const isCurrent = idx === currentStepIdx;

                return (
                  <div
                    key={step}
                    style={{
                      display: 'flex',
                      flexDirection: 'column',
                      alignItems: 'center',
                      position: 'relative',
                      zIndex: 3
                    }}
                  >
                    <div
                      style={{
                        width: '28px',
                        height: '28px',
                        borderRadius: '50%',
                        background: isPassed ? '#10b981' : '#ffffff',
                        border: `2px solid ${isPassed ? '#10b981' : '#cbd5e1'}`,
                        display: 'flex',
                        alignItems: 'center',
                        justifyContent: 'center',
                        color: isPassed ? '#ffffff' : 'var(--text-muted)',
                        fontSize: '0.75rem',
                        fontWeight: 700,
                        boxShadow: isCurrent ? '0 0 0 4px rgba(16, 185, 129, 0.2)' : 'none',
                        transition: 'all 0.2s ease'
                      }}
                    >
                      {isPassed ? <CheckCircle2 size={15} /> : idx + 1}
                    </div>
                    <span
                      style={{
                        fontSize: '0.72rem',
                        fontWeight: isCurrent ? 700 : 500,
                        color: isCurrent ? 'var(--text-primary)' : 'var(--text-muted)',
                        marginTop: '6px',
                        whiteSpace: 'nowrap'
                      }}
                    >
                      {step}
                    </span>
                  </div>
                );
              })}
            </div>
          </div>

          {/* Official Printable Challan Sheet */}
          <div
            className="challan-printable-sheet"
            style={{
              background: '#ffffff',
              border: '1px solid var(--border-default)',
              borderRadius: 'var(--radius-lg)',
              padding: '32px',
              boxShadow: 'var(--shadow-md)'
            }}
          >
            {/* Header / Brand */}
            <div style={{ display: 'flex', justifyContent: 'space-between', borderBottom: '2px solid var(--border-default)', paddingBottom: '20px' }}>
              <div>
                <div style={{ display: 'flex', alignItems: 'center', gap: '8px', marginBottom: '4px' }}>
                  <div
                    style={{
                      width: '28px',
                      height: '28px',
                      borderRadius: '8px',
                      background: isAiwa ? 'linear-gradient(135deg, #7c3aed 0%, #4c1d95 100%)' : 'linear-gradient(135deg, #4f46e5 0%, #312e81 100%)',
                      display: 'flex',
                      alignItems: 'center',
                      justifyContent: 'center',
                      color: '#fff'
                    }}
                  >
                    <Layers size={16} />
                  </div>
                  <h2 style={{ fontSize: '1.4rem', color: isAiwa ? '#7c3aed' : 'var(--primary-600)', margin: 0, letterSpacing: '-0.02em' }}>
                    {brandTitle}
                  </h2>
                </div>
                <div style={{ fontSize: '0.8rem', fontWeight: 600, color: 'var(--text-secondary)' }}>
                  {brandLegal}
                </div>
                <div style={{ fontSize: '0.75rem', color: 'var(--text-muted)', marginTop: '2px', lineHeight: 1.4 }}>
                  {brandTagline}<br />
                  {brandAddress}<br />
                  <strong>GSTIN: {brandGstin}</strong> • {brandEmail}
                </div>
              </div>

              <div style={{ textAlign: 'right' }}>
                <div
                  style={{
                    background: 'var(--primary-50)',
                    color: 'var(--primary-700)',
                    padding: '4px 12px',
                    borderRadius: 'var(--radius-sm)',
                    fontWeight: 800,
                    fontSize: '1rem',
                    display: 'inline-block',
                    marginBottom: '4px'
                  }}
                >
                  SHIPMENT DISPATCH NOTE
                </div>
                <div style={{ fontSize: '0.72rem', color: 'var(--text-muted)' }}>
                  (Consignment Note & Transport Advice)
                </div>
                <div style={{ fontSize: '0.92rem', fontWeight: 700, color: 'var(--text-primary)', marginTop: '6px' }}>
                  Dispatch Ref: <span style={{ color: 'var(--primary-600)' }}>{dispatch.challanNumber || dispatch.id}</span>
                </div>
                <div style={{ fontSize: '0.78rem', color: 'var(--text-secondary)' }}>
                  Date: <strong>{formatDate(dispatch.dispatchDate)}</strong>
                </div>
              </div>
            </div>

            {/* Consignee & Shipment Logistics Grid */}
            <div className="grid-2" style={{ gap: '24px', margin: '20px 0', padding: '16px 0', borderBottom: '1px solid var(--border-default)' }}>
              {/* Consignee / Bill To */}
              <div>
                <div style={{ fontSize: '0.72rem', fontWeight: 700, color: 'var(--text-muted)', textTransform: 'uppercase', marginBottom: '6px' }}>
                  Consignee / Delivery Address:
                </div>
                <div style={{ fontSize: '1rem', fontWeight: 700, color: 'var(--text-primary)' }}>
                  {dispatch.companyName || dispatch.clientName}
                </div>
                <div style={{ fontSize: '0.8rem', color: 'var(--text-secondary)', marginTop: '2px' }}>
                  Attn: <strong>{dispatch.contactPerson || dispatch.clientName}</strong>
                </div>
                <div style={{ fontSize: '0.8rem', color: 'var(--text-secondary)', marginTop: '4px', lineHeight: 1.4 }}>
                  <MapPin size={13} style={{ display: 'inline', marginRight: '4px', color: 'var(--primary-600)' }} />
                  {dispatch.shippingAddress}
                </div>
                {(dispatch.phone || dispatch.email) && (
                  <div style={{ fontSize: '0.76rem', color: 'var(--text-muted)', marginTop: '4px' }}>
                    Tel: {dispatch.phone || '—'} • Email: {dispatch.email || '—'}
                  </div>
                )}
              </div>

              {/* Transport & Carrier Details */}
              <div style={{ background: '#f8fafc', padding: '14px', borderRadius: 'var(--radius-md)', border: '1px solid var(--border-default)' }}>
                <div style={{ fontSize: '0.72rem', fontWeight: 700, color: 'var(--text-muted)', textTransform: 'uppercase', marginBottom: '8px' }}>
                  Shipment & Carrier Info:
                </div>

                <div style={{ display: 'flex', justifyContent: 'space-between', fontSize: '0.8rem', marginBottom: '4px' }}>
                  <span style={{ color: 'var(--text-muted)' }}>Transporter:</span>
                  <strong style={{ color: 'var(--primary-700)' }}>{dispatch.courierCarrier}</strong>
                </div>

                <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', fontSize: '0.8rem', marginBottom: '4px' }}>
                  <span style={{ color: 'var(--text-muted)' }}>AWB / Docket #:</span>
                  <div style={{ display: 'flex', alignItems: 'center', gap: '4px' }}>
                    <strong style={{ color: 'var(--primary-600)', fontFamily: 'monospace' }}>{dispatch.trackingNumber}</strong>
                    <button
                      type="button"
                      onClick={handleCopyAwb}
                      style={{ background: 'none', border: 'none', color: 'var(--text-muted)', cursor: 'pointer', padding: '2px' }}
                      title="Copy AWB Number"
                    >
                      <Copy size={12} />
                    </button>
                  </div>
                </div>

                {dispatch.ewayBillNumber && (
                  <div style={{ display: 'flex', justifyContent: 'space-between', fontSize: '0.8rem', marginBottom: '4px' }}>
                    <span style={{ color: 'var(--text-muted)' }}>E-Way Bill #:</span>
                    <span style={{ fontFamily: 'monospace', fontWeight: 600 }}>{dispatch.ewayBillNumber}</span>
                  </div>
                )}

                <div style={{ display: 'flex', justifyContent: 'space-between', fontSize: '0.8rem', marginBottom: '4px' }}>
                  <span style={{ color: 'var(--text-muted)' }}>Order Ref #:</span>
                  <strong>{dispatch.orderId}</strong>
                </div>

                <div style={{ display: 'flex', justifyContent: 'space-between', fontSize: '0.8rem' }}>
                  <span style={{ color: 'var(--text-muted)' }}>Est. Delivery:</span>
                  <span>{formatDate(dispatch.estimatedDelivery)}</span>
                </div>
              </div>
            </div>

            {/* Package Summary Banner */}
            <div
              style={{
                display: 'flex',
                justifyContent: 'space-around',
                background: 'var(--primary-50)',
                border: '1px solid var(--primary-100)',
                borderRadius: 'var(--radius-sm)',
                padding: '10px 16px',
                marginBottom: '20px',
                fontSize: '0.82rem'
              }}
            >
              <div>
                <span style={{ color: 'var(--text-muted)' }}>Package Boxes: </span>
                <strong>{dispatch.packageCount || '1 Carton'}</strong>
              </div>
              <div>
                <span style={{ color: 'var(--text-muted)' }}>Gross Weight: </span>
                <strong>{dispatch.packageWeight || '4.5 kg'}</strong>
              </div>
              <div>
                <span style={{ color: 'var(--text-muted)' }}>Dispatched By: </span>
                <strong>{dispatch.dispatchedBy || 'Warehouse Rep'}</strong>
              </div>
            </div>

            {/* Itemized Table */}
            <div style={{ marginBottom: '20px' }}>
              <div style={{ fontSize: '0.75rem', fontWeight: 700, color: 'var(--text-secondary)', textTransform: 'uppercase', marginBottom: '8px' }}>
                Dispatched Equipment & Goods Manifest:
              </div>

              <table className="custom-table" style={{ width: '100%' }}>
                <thead>
                  <tr style={{ background: '#f1f5f9' }}>
                    <th style={{ width: '40px' }}>#</th>
                    <th style={{ width: '120px' }}>Product Code</th>
                    <th>Item Description / Hardware Spec</th>
                    <th style={{ textAlign: 'center', width: '80px' }}>Quantity</th>
                    <th style={{ width: '100px' }}>Unit</th>
                    <th style={{ textAlign: 'right', width: '160px' }}>Purpose of Supply</th>
                  </tr>
                </thead>
                <tbody>
                  {(dispatch.items || [
                    { productCode: 'AUC-101', name: 'Industrial Hardware Component', quantity: 1 }
                  ]).map((item, index) => (
                    <tr key={index}>
                      <td style={{ textAlign: 'center' }}>{index + 1}</td>
                      <td>
                        <strong style={{ color: 'var(--primary-600)' }}>{item.productCode}</strong>
                      </td>
                      <td>
                        <div style={{ fontWeight: 600 }}>{item.name}</div>
                        <div style={{ fontSize: '0.72rem', color: 'var(--text-muted)' }}>
                          Standard industrial packaging with test seal
                        </div>
                      </td>
                      <td style={{ textAlign: 'center', fontWeight: 700, fontSize: '0.9rem' }}>
                        {item.quantity}
                      </td>
                      <td>Nos</td>
                      <td style={{ textAlign: 'right', fontSize: '0.78rem', color: 'var(--text-secondary)' }}>
                        Supply vs Order {dispatch.orderId}
                      </td>
                    </tr>
                  ))}
                </tbody>
              </table>
            </div>

            {/* Special Instructions */}
            {dispatch.notes && (
              <div
                style={{
                  background: '#fffbeb',
                  border: '1px solid #fde68a',
                  borderRadius: 'var(--radius-sm)',
                  padding: '10px 14px',
                  marginBottom: '20px',
                  fontSize: '0.8rem',
                  color: '#92400e'
                }}
              >
                <strong>Handling Note:</strong> {dispatch.notes}
              </div>
            )}

            {/* Terms of Movement */}
            <div style={{ fontSize: '0.72rem', color: 'var(--text-muted)', lineHeight: 1.4, borderTop: '1px solid var(--border-default)', paddingTop: '12px', marginBottom: '24px' }}>
              <strong>Terms:</strong> 1. Goods are in transit against client purchase booking. 2. Consignee is advised to inspect outer packaging tamper-evident tape before endorsing carrier POD. 3. Discrepancies if any to be logged within 24 hours of delivery.
            </div>

            {/* Signatures Section (Dual Sign-off) */}
            <div className="grid-2" style={{ gap: '30px', marginTop: '20px', paddingTop: '10px' }}>
              <div>
                <div style={{ fontSize: '0.76rem', color: 'var(--text-secondary)', marginBottom: '45px' }}>
                  Received above materials in sound and complete condition:
                </div>
                <div style={{ borderTop: '1px solid var(--border-strong)', paddingTop: '6px' }}>
                  <div style={{ fontSize: '0.78rem', fontWeight: 700, color: 'var(--text-primary)' }}>
                    Receiver's Signature & Company Seal
                  </div>
                  <div style={{ fontSize: '0.72rem', color: 'var(--text-muted)' }}>
                    Date: ____ / ____ / 2026
                  </div>
                </div>
              </div>

              <div style={{ textAlign: 'right' }}>
                <div style={{ fontSize: '0.76rem', fontWeight: 700, color: 'var(--text-primary)', marginBottom: '45px' }}>
                  {brandSign}
                </div>
                <div style={{ borderTop: '1px solid var(--border-strong)', paddingTop: '6px' }}>
                  <div style={{ fontSize: '0.78rem', fontWeight: 700, color: 'var(--text-primary)' }}>
                    Authorized Dispatch / Logistics Officer
                  </div>
                  <div style={{ fontSize: '0.72rem', color: 'var(--text-muted)' }}>
                    {brandHub}
                  </div>
                </div>
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};
