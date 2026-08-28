import React, { useState } from 'react';
import { useApp } from '../context/AppContext';
import {
  CalendarClock,
  Plus,
  Search,
  MessageSquare,
  Phone,
  Video,
  Mail,
  CheckCircle2,
  AlertCircle,
  Clock,
  Filter,
  Trash2
} from 'lucide-react';
import { formatDate, getStatusBadgeClass, getWhatsAppUrl } from '../utils/formatters';

export const FollowUpsView = () => {
  const { followUps, addFollowUp, updateFollowUp, deleteFollowUp, clients, leads, currentUser, selectedCompany, companyBrands, matchesCompany } = useApp();
  const [searchQuery, setSearchQuery] = useState('');
  const [statusFilter, setStatusFilter] = useState('ALL');
  const [showAddModal, setShowAddModal] = useState(false);

  const [newFollowUp, setNewFollowUp] = useState({
    clientName: '',
    brand: selectedCompany || 'AUCO',
    phone: '',
    assignedSalesperson: currentUser.name,
    followUpDate: new Date().toISOString().split('T')[0],
    followUpType: 'WhatsApp',
    notes: '',
    nextAction: '',
    status: 'Pending'
  });

  // Scoped follow-ups by company
  const scopedFollowUps = followUps.filter(matchesCompany);

  // Filter follow-ups
  const filteredFollowUps = scopedFollowUps.filter((f) => {
    const matchesSearch =
      f.clientName.toLowerCase().includes(searchQuery.toLowerCase()) ||
      (f.contactPerson && f.contactPerson.toLowerCase().includes(searchQuery.toLowerCase())) ||
      f.notes.toLowerCase().includes(searchQuery.toLowerCase());

    const matchesStatus = statusFilter === 'ALL' || f.status === statusFilter;
    return matchesSearch && matchesStatus;
  });

  const pendingCount = scopedFollowUps.filter((f) => f.status === 'Pending').length;
  const missedCount = scopedFollowUps.filter((f) => f.status === 'Missed').length;
  const completedCount = scopedFollowUps.filter((f) => f.status === 'Completed').length;

  const handleDeleteFollowUp = (flw) => {
    if (window.confirm(`Are you sure you want to delete follow-up with "${flw.clientName}"?`)) {
      deleteFollowUp(flw.id);
    }
  };

  const handleCreateSubmit = (e) => {
    e.preventDefault();
    if (!newFollowUp.clientName) return;
    addFollowUp(newFollowUp);
    setShowAddModal(false);
    setNewFollowUp({
      clientName: '',
      brand: selectedCompany || 'AUCO',
      phone: '',
      assignedSalesperson: currentUser.name,
      followUpDate: new Date().toISOString().split('T')[0],
      followUpType: 'WhatsApp',
      notes: '',
      nextAction: '',
      status: 'Pending'
    });
  };

  const getFollowUpTypeIcon = (type) => {
    switch (type) {
      case 'WhatsApp': return <MessageSquare size={14} style={{ color: '#16a34a' }} />;
      case 'Call': return <Phone size={14} style={{ color: '#2563eb' }} />;
      case 'Meeting': return <Video size={14} style={{ color: '#9333ea' }} />;
      case 'Email': return <Mail size={14} style={{ color: '#d97706' }} />;
      default: return <CalendarClock size={14} />;
    }
  };

  return (
    <div style={{ display: 'flex', flexDirection: 'column', gap: '20px' }}>
      {/* Header */}
      <div className="flex-between">
        <div>
          <h2>Client & Lead Follow-Up Management</h2>
          <p style={{ fontSize: '0.82rem', color: 'var(--text-muted)' }}>
            Schedule and track customer interactions across WhatsApp, phone calls, meetings, and emails.
          </p>
        </div>
        <button className="btn btn-primary" onClick={() => setShowAddModal(true)}>
          <Plus size={16} /> Schedule Follow-Up
        </button>
      </div>

      {/* Metric Cards */}
      <div className="grid-3">
        <div className="stat-card" style={{ borderLeft: '4px solid #f59e0b' }}>
          <div className="stat-header">
            <span className="stat-title">Pending Follow-Ups</span>
            <Clock size={18} style={{ color: '#f59e0b' }} />
          </div>
          <div className="stat-value">{pendingCount}</div>
          <div className="stat-subtext">Upcoming customer check-ins</div>
        </div>

        <div className="stat-card" style={{ borderLeft: `4px solid ${missedCount > 0 ? 'var(--danger-text)' : 'var(--success-text)'}` }}>
          <div className="stat-header">
            <span className="stat-title">Missed / Overdue</span>
            <AlertCircle size={18} style={{ color: missedCount > 0 ? 'var(--danger-text)' : 'var(--success-text)' }} />
          </div>
          <div className="stat-value" style={{ color: missedCount > 0 ? 'var(--danger-text)' : 'inherit' }}>
            {missedCount}
          </div>
          <div className="stat-subtext">Requires immediate outreach</div>
        </div>

        <div className="stat-card" style={{ borderLeft: '4px solid #10b981' }}>
          <div className="stat-header">
            <span className="stat-title">Completed Interactions</span>
            <CheckCircle2 size={18} style={{ color: '#10b981' }} />
          </div>
          <div className="stat-value">{completedCount}</div>
          <div className="stat-subtext">Successful touchpoints</div>
        </div>
      </div>

      {/* Filter & Search */}
      <div className="card" style={{ padding: '14px 18px' }}>
        <div style={{ display: 'flex', gap: '14px', flexWrap: 'wrap', alignItems: 'center' }}>
          <div style={{ position: 'relative', flex: 1, minWidth: '240px' }}>
            <Search size={16} style={{ position: 'absolute', left: '12px', top: '50%', transform: 'translateY(-50%)', color: 'var(--text-muted)' }} />
            <input
              type="text"
              className="form-input"
              placeholder="Search client, notes, contact..."
              value={searchQuery}
              onChange={(e) => setSearchQuery(e.target.value)}
              style={{ paddingLeft: '36px' }}
            />
          </div>

          <div style={{ display: 'flex', alignItems: 'center', gap: '8px' }}>
            <span style={{ fontSize: '0.8rem', color: 'var(--text-muted)', fontWeight: 600 }}>Status:</span>
            <select
              className="form-select"
              value={statusFilter}
              onChange={(e) => setStatusFilter(e.target.value)}
              style={{ width: '160px' }}
            >
              <option value="ALL">All Follow-ups</option>
              <option value="Pending">Pending</option>
              <option value="Missed">Missed / Overdue</option>
              <option value="Completed">Completed</option>
            </select>
          </div>
        </div>
      </div>

      {/* Follow-ups Table */}
      <div className="table-container">
        <table className="custom-table">
          <thead>
            <tr>
              <th>Client / Account</th>
              <th>Channel</th>
              <th>Scheduled Date</th>
              <th>Assigned Rep</th>
              <th>Notes / Discussion</th>
              <th>Next Action</th>
              <th>Status</th>
              <th>Actions</th>
            </tr>
          </thead>
          <tbody>
            {filteredFollowUps.map((flw) => (
              <tr key={flw.id}>
                <td>
                  <strong>{flw.clientName}</strong>
                  {flw.contactPerson && (
                    <div style={{ fontSize: '0.74rem', color: 'var(--text-muted)' }}>{flw.contactPerson}</div>
                  )}
                </td>
                <td>
                  <div style={{ display: 'flex', alignItems: 'center', gap: '6px' }}>
                    {getFollowUpTypeIcon(flw.followUpType)}
                    <span style={{ fontSize: '0.82rem', fontWeight: 600 }}>{flw.followUpType}</span>
                  </div>
                </td>
                <td style={{ fontSize: '0.82rem' }}>
                  {formatDate(flw.followUpDate)}
                </td>
                <td style={{ fontSize: '0.82rem', color: 'var(--text-secondary)' }}>
                  {flw.assignedSalesperson}
                </td>
                <td style={{ maxWidth: '280px', fontSize: '0.8rem' }}>
                  {flw.notes}
                </td>
                <td style={{ maxWidth: '200px', fontSize: '0.78rem', color: 'var(--text-muted)' }}>
                  {flw.nextAction || '—'}
                </td>
                <td>
                  <select
                    className="form-select"
                    value={flw.status}
                    onChange={(e) => updateFollowUp(flw.id, { status: e.target.value })}
                    style={{ width: '120px', padding: '4px 6px', fontSize: '0.78rem' }}
                  >
                    <option value="Pending">Pending</option>
                    <option value="Completed">Completed</option>
                    <option value="Missed">Missed</option>
                  </select>
                </td>
                <td>
                  <div style={{ display: 'flex', gap: '6px', alignItems: 'center' }}>
                    {flw.phone ? (
                      <a
                        href={getWhatsAppUrl(flw.phone, `Hello ${flw.clientName}, following up on our scheduled discussion.`)}
                        target="_blank"
                        rel="noreferrer"
                        className="badge badge-whatsapp"
                        title="Open WhatsApp Chat"
                      >
                        <MessageSquare size={12} /> WhatsApp
                      </a>
                    ) : (
                      <span style={{ fontSize: '0.75rem', color: 'var(--text-muted)' }}>—</span>
                    )}
                    <button
                      className="btn btn-ghost btn-sm"
                      onClick={() => handleDeleteFollowUp(flw)}
                      title="Delete Follow-up"
                      style={{ color: 'var(--danger-text)', padding: '4px 6px' }}
                    >
                      <Trash2 size={13} />
                    </button>
                  </div>
                </td>
              </tr>
            ))}
            {filteredFollowUps.length === 0 && (
              <tr>
                <td colSpan="8" style={{ textAlign: 'center', padding: '48px 16px', color: 'var(--text-muted)' }}>
                  <MessageSquare size={36} style={{ margin: '0 auto 10px', opacity: 0.4 }} />
                  <div style={{ fontWeight: 600, fontSize: '0.95rem' }}>No follow-up touchpoints found</div>
                  <p style={{ fontSize: '0.8rem', marginTop: '4px' }}>Try adjusting your search query or status filter.</p>
                </td>
              </tr>
            )}
          </tbody>
        </table>
      </div>

      {/* Add Follow-Up Modal */}
      {showAddModal && (
        <div className="modal-backdrop" onClick={() => setShowAddModal(false)}>
          <div className="modal-content" onClick={(e) => e.stopPropagation()}>
            <form onSubmit={handleCreateSubmit}>
              <div className="modal-header">
                <h3>Schedule New Follow-Up</h3>
                <button type="button" className="btn btn-ghost btn-icon" onClick={() => setShowAddModal(false)}>✕</button>
              </div>

              <div className="modal-body">
                <div className="form-group">
                  <label className="form-label">Client or Lead Name *</label>
                  <input
                    type="text"
                    required
                    className="form-input"
                    placeholder="e.g. Mehta Precision Engineering Ltd"
                    value={newFollowUp.clientName}
                    onChange={(e) => setNewFollowUp({ ...newFollowUp, clientName: e.target.value })}
                  />
                </div>

                <div className="grid-2">
                  <div className="form-group">
                    <label className="form-label">Channel Type</label>
                    <select
                      className="form-select"
                      value={newFollowUp.followUpType}
                      onChange={(e) => setNewFollowUp({ ...newFollowUp, followUpType: e.target.value })}
                    >
                      <option value="WhatsApp">WhatsApp</option>
                      <option value="Call">Phone Call</option>
                      <option value="Meeting">Meeting / Demo</option>
                      <option value="Email">Email</option>
                    </select>
                  </div>
                  <div className="form-group">
                    <label className="form-label">Scheduled Date *</label>
                    <input
                      type="date"
                      required
                      className="form-input"
                      value={newFollowUp.followUpDate}
                      onChange={(e) => setNewFollowUp({ ...newFollowUp, followUpDate: e.target.value })}
                    />
                  </div>
                </div>

                <div className="grid-2">
                  <div className="form-group">
                    <label className="form-label">Phone (for WhatsApp)</label>
                    <input
                      type="text"
                      className="form-input"
                      placeholder="e.g. +91 98220 14589"
                      value={newFollowUp.phone}
                      onChange={(e) => setNewFollowUp({ ...newFollowUp, phone: e.target.value })}
                    />
                  </div>
                  <div className="form-group">
                    <label className="form-label">Assigned Representative</label>
                    <input
                      type="text"
                      className="form-input"
                      value={newFollowUp.assignedSalesperson}
                      onChange={(e) => setNewFollowUp({ ...newFollowUp, assignedSalesperson: e.target.value })}
                    />
                  </div>
                </div>

                <div className="form-group">
                  <label className="form-label">Discussion Agenda / Notes *</label>
                  <textarea
                    required
                    className="form-textarea"
                    placeholder="Notes regarding quotation, equipment delivery timeline, or payment status..."
                    value={newFollowUp.notes}
                    onChange={(e) => setNewFollowUp({ ...newFollowUp, notes: e.target.value })}
                  />
                </div>

                <div className="form-group">
                  <label className="form-label">Next Action</label>
                  <input
                    type="text"
                    className="form-input"
                    placeholder="e.g. Send updated pricing sheet"
                    value={newFollowUp.nextAction}
                    onChange={(e) => setNewFollowUp({ ...newFollowUp, nextAction: e.target.value })}
                  />
                </div>
              </div>

              <div className="modal-footer">
                <button type="button" className="btn btn-secondary" onClick={() => setShowAddModal(false)}>Cancel</button>
                <button type="submit" className="btn btn-primary">Save Follow-Up</button>
              </div>
            </form>
          </div>
        </div>
      )}
    </div>
  );
};
