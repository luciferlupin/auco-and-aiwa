import React, { useState } from 'react';
import { useApp } from '../context/AppContext';
import {
  Users,
  Plus,
  Search,
  CheckCircle2,
  XCircle,
  MessageSquare,
  Phone,
  Building2,
  Calendar,
  DollarSign,
  ChevronRight,
  Zap,
  Trash2,
  Edit2,
  Filter,
  ArrowRight
} from 'lucide-react';
import { formatCurrency, formatDate, getStatusBadgeClass, getWhatsAppUrl } from '../utils/formatters';

const PIPELINE_STAGES = [
  'New Lead',
  'Contacted',
  'Qualified',
  'Proposal',
  'Negotiation',
  'Won',
  'Lost'
];

export const LeadsView = ({ onOpenLeadModal }) => {
  const { leads, updateLead, deleteLead, convertLeadToClient, selectedCompany, companyBrands, matchesCompany } = useApp();
  const [searchQuery, setSearchQuery] = useState('');
  const [sourceFilter, setSourceFilter] = useState('ALL');
  const [stageFilter, setStageFilter] = useState('ALL');
  const [selectedLead, setSelectedLead] = useState(null);
  const [editingLead, setEditingLead] = useState(null);
  const [editFormData, setEditFormData] = useState({});

  // Scoped leads by company
  const scopedLeads = leads.filter(matchesCompany);

  // Filter leads
  const filteredLeads = scopedLeads.filter((lead) => {
    const matchesSearch =
      lead.company.toLowerCase().includes(searchQuery.toLowerCase()) ||
      lead.client.toLowerCase().includes(searchQuery.toLowerCase()) ||
      lead.city.toLowerCase().includes(searchQuery.toLowerCase()) ||
      lead.assignedSalesperson.toLowerCase().includes(searchQuery.toLowerCase());

    const matchesSource = sourceFilter === 'ALL' || lead.leadSource === sourceFilter;
    const matchesStage = stageFilter === 'ALL' || lead.stage === stageFilter;
    return matchesSearch && matchesSource && matchesStage;
  });

  const totalExpectedValue = filteredLeads
    .filter((l) => l.stage !== 'Lost')
    .reduce((acc, l) => acc + Number(l.expectedValue || 0), 0);

  const handleMoveStage = (leadId, newStage) => {
    if (newStage === 'Won') {
      convertLeadToClient(leadId);
    } else {
      updateLead(leadId, {
        stage: newStage,
        conversionPercentage:
          newStage === 'Proposal' ? 60 : newStage === 'Negotiation' ? 80 : newStage === 'Qualified' ? 40 : 20
      });
    }
  };

  const handleDeleteLead = (lead) => {
    if (window.confirm(`Are you sure you want to delete lead "${lead.company}" (${lead.id})?`)) {
      deleteLead(lead.id);
      if (selectedLead && selectedLead.id === lead.id) {
        setSelectedLead(null);
      }
    }
  };

  const handleStartEdit = (lead) => {
    setEditingLead(lead);
    setEditFormData({
      company: lead.company || '',
      client: lead.client || '',
      phone: lead.phone || '',
      email: lead.email || '',
      city: lead.city || '',
      state: lead.state || '',
      expectedValue: lead.expectedValue || 0,
      stage: lead.stage || 'New Lead',
      nextAction: lead.nextAction || '',
      followUpDate: lead.followUpDate || '',
      notes: lead.notes || ''
    });
  };

  const handleSaveEdit = (e) => {
    e.preventDefault();
    if (!editingLead) return;
    updateLead(editingLead.id, {
      ...editFormData,
      expectedValue: Number(editFormData.expectedValue) || 0
    });
    if (selectedLead && selectedLead.id === editingLead.id) {
      setSelectedLead((prev) => ({ ...prev, ...editFormData, expectedValue: Number(editFormData.expectedValue) || 0 }));
    }
    setEditingLead(null);
  };

  return (
    <div style={{ display: 'flex', flexDirection: 'column', gap: '20px' }}>
      {/* Header */}
      <div className="flex-between" style={{ flexWrap: 'wrap', gap: '12px' }}>
        <div>
          <h2>Sales Pipeline</h2>
          <p style={{ fontSize: '0.82rem', color: 'var(--text-muted)' }}>
            Active prospect pipeline and lead conversions
          </p>
        </div>
        <button className="btn btn-primary" onClick={onOpenLeadModal} style={{ display: 'flex', alignItems: 'center', gap: '6px' }}>
          <Plus size={15} /> New Lead
        </button>
      </div>

      {/* Filter & Summary Controls */}
      <div className="card" style={{ padding: '14px 20px' }}>
        <div className="flex-between" style={{ flexWrap: 'wrap', gap: '14px' }}>
          <div style={{ display: 'flex', alignItems: 'center', gap: '12px', flexWrap: 'wrap' }}>
            <div style={{ position: 'relative', minWidth: '240px' }}>
              <Search size={16} style={{ position: 'absolute', left: '10px', top: '50%', transform: 'translateY(-50%)', color: 'var(--text-muted)' }} />
              <input
                type="text"
                className="form-input"
                placeholder="Search by company, client, city..."
                value={searchQuery}
                onChange={(e) => setSearchQuery(e.target.value)}
                style={{ paddingLeft: '32px' }}
              />
            </div>

            <div style={{ display: 'flex', alignItems: 'center', gap: '6px' }}>
              <span style={{ fontSize: '0.8rem', color: 'var(--text-muted)', fontWeight: 600 }}>Stage:</span>
              <select
                className="form-select"
                value={stageFilter}
                onChange={(e) => setStageFilter(e.target.value)}
                style={{ width: '140px' }}
              >
                <option value="ALL">All Stages</option>
                {PIPELINE_STAGES.map((s) => (
                  <option key={s} value={s}>{s}</option>
                ))}
              </select>
            </div>

            <div style={{ display: 'flex', alignItems: 'center', gap: '6px' }}>
              <span style={{ fontSize: '0.8rem', color: 'var(--text-muted)', fontWeight: 600 }}>Source:</span>
              <select
                className="form-select"
                value={sourceFilter}
                onChange={(e) => setSourceFilter(e.target.value)}
                style={{ width: '130px' }}
              >
                <option value="ALL">All Sources</option>
                <option value="WhatsApp">WhatsApp</option>
                <option value="Website">Website</option>
                <option value="Cold Outreach">Cold Outreach</option>
                <option value="Referral">Referral</option>
                <option value="Exhibition">Exhibition</option>
              </select>
            </div>
          </div>

          <div style={{ display: 'flex', alignItems: 'center', gap: '16px' }}>
            <div style={{ textAlign: 'right' }}>
              <div style={{ fontSize: '0.72rem', color: 'var(--text-muted)', fontWeight: 700 }}>PIPELINE TOTAL</div>
              <div style={{ fontSize: '1.1rem', fontWeight: 800, color: 'var(--primary-600)' }}>
                {formatCurrency(totalExpectedValue)}
              </div>
            </div>
            <div style={{ textAlign: 'right' }}>
              <div style={{ fontSize: '0.72rem', color: 'var(--text-muted)', fontWeight: 700 }}>LEADS SHOWN</div>
              <div style={{ fontSize: '1.1rem', fontWeight: 800 }}>
                {filteredLeads.length} Leads
              </div>
            </div>
          </div>
        </div>
      </div>

      {/* =========================================================================
          LEADS DIRECTORY TABLE VIEW
          ========================================================================= */}
      <div className="table-container">
        <table className="custom-table">
          <thead>
            <tr>
              <th>Company / Prospect</th>
              <th>Contact Person</th>
              <th>Source</th>
              <th>Sales Rep</th>
              <th>Expected Value</th>
              <th>Pipeline Stage</th>
              <th>Next Action</th>
              <th>Follow Up</th>
              <th style={{ textAlign: 'right' }}>Actions</th>
            </tr>
          </thead>
          <tbody>
            {filteredLeads.map((lead) => (
              <tr key={lead.id} onClick={() => setSelectedLead(lead)} style={{ cursor: 'pointer' }}>
                <td>
                  <div style={{ fontWeight: 700, color: 'var(--text-primary)' }}>{lead.company}</div>
                  <div style={{ fontSize: '0.74rem', color: 'var(--text-muted)' }}>{lead.city}, {lead.state}</div>
                </td>
                <td>
                  <div style={{ fontWeight: 600 }}>{lead.client}</div>
                  <div style={{ fontSize: '0.74rem', color: 'var(--text-muted)' }}>{lead.phone}</div>
                </td>
                <td>
                  <span className="badge badge-neutral" style={{ fontSize: '0.72rem' }}>
                    {lead.leadSource}
                  </span>
                </td>
                <td style={{ fontSize: '0.82rem' }}>{lead.assignedSalesperson}</td>
                <td>
                  <strong style={{ color: 'var(--primary-600)', fontSize: '0.88rem' }}>
                    {formatCurrency(lead.expectedValue)}
                  </strong>
                </td>
                <td onClick={(e) => e.stopPropagation()}>
                  <select
                    className="form-select"
                    style={{
                      width: '125px',
                      fontSize: '0.74rem',
                      padding: '3px 6px',
                      height: '28px',
                      fontWeight: 600,
                      borderColor: lead.stage === 'Won' ? '#10b981' : (lead.stage === 'Lost' ? '#ef4444' : 'var(--border-default)')
                    }}
                    value={lead.stage}
                    onChange={(e) => handleMoveStage(lead.id, e.target.value)}
                  >
                    {PIPELINE_STAGES.map((s) => (
                      <option key={s} value={s}>{s}</option>
                    ))}
                  </select>
                </td>
                <td style={{ maxWidth: '200px', fontSize: '0.78rem', color: 'var(--text-secondary)' }}>
                  {lead.nextAction || '—'}
                </td>
                <td style={{ fontSize: '0.78rem', whiteSpace: 'nowrap' }}>
                  {formatDate(lead.followUpDate)}
                </td>
                <td onClick={(e) => e.stopPropagation()} style={{ textAlign: 'right' }}>
                  <div style={{ display: 'inline-flex', alignItems: 'center', gap: '6px' }}>
                    <a
                      href={getWhatsAppUrl(lead.phone, `Hi ${lead.client}, following up on your inquiry with ${lead.brand === 'AIWA' ? 'Aiwa Commercial AV' : 'Auco Automation'}.`)}
                      target="_blank"
                      rel="noreferrer"
                      className="badge badge-whatsapp"
                      style={{ fontSize: '0.7rem', textDecoration: 'none', padding: '4px 8px' }}
                      title="Open WhatsApp Chat"
                    >
                      <MessageSquare size={12} />
                    </a>

                    {lead.stage !== 'Won' ? (
                      <button
                        className="btn btn-success btn-sm"
                        style={{ padding: '3px 8px', fontSize: '0.74rem', display: 'inline-flex', alignItems: 'center', gap: '4px' }}
                        onClick={() => convertLeadToClient(lead.id)}
                        title="Convert Lead to Active Client Directory"
                      >
                        <Zap size={12} /> Convert
                      </button>
                    ) : (
                      <span className="badge badge-success" style={{ fontSize: '0.7rem' }}>
                        Converted
                      </span>
                    )}

                    <button
                      className="btn btn-ghost btn-sm btn-icon"
                      onClick={() => handleStartEdit(lead)}
                      title="Edit Lead"
                    >
                      <Edit2 size={13} />
                    </button>
                    <button
                      className="btn btn-ghost btn-sm btn-icon"
                      style={{ color: 'var(--danger-text)' }}
                      onClick={() => handleDeleteLead(lead)}
                      title="Delete Lead"
                    >
                      <Trash2 size={13} />
                    </button>
                  </div>
                </td>
              </tr>
            ))}
            {filteredLeads.length === 0 && (
              <tr>
                <td colSpan="9" style={{ textAlign: 'center', padding: '48px 16px', color: 'var(--text-muted)' }}>
                  <Users size={36} style={{ margin: '0 auto 10px', opacity: 0.4 }} />
                  <div style={{ fontWeight: 600, fontSize: '0.95rem' }}>No leads found</div>
                  <p style={{ fontSize: '0.8rem', marginTop: '4px' }}>Try adjusting your search query, stage, or rep filter.</p>
                </td>
              </tr>
            )}
          </tbody>
        </table>
      </div>

      {/* =========================================================================
          LEAD DETAIL MODAL
          ========================================================================= */}
      {selectedLead && (
        <div className="modal-backdrop" onClick={() => setSelectedLead(null)}>
          <div className="modal-content" onClick={(e) => e.stopPropagation()}>
            <div className="modal-header">
              <div>
                <span className="badge badge-purple">{selectedLead.stage}</span>
                <h3 style={{ marginTop: '4px' }}>{selectedLead.company}</h3>
                <span style={{ fontSize: '0.75rem', color: 'var(--text-muted)' }}>Lead ID: {selectedLead.id}</span>
              </div>
              <button className="btn btn-ghost btn-icon" onClick={() => setSelectedLead(null)}>
                <XCircle size={18} />
              </button>
            </div>

            <div className="modal-body" style={{ display: 'flex', flexDirection: 'column', gap: '16px' }}>
              <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: '12px', fontSize: '0.85rem' }}>
                <div><span style={{ color: 'var(--text-muted)' }}>Contact Person:</span> <strong>{selectedLead.client}</strong></div>
                <div><span style={{ color: 'var(--text-muted)' }}>Phone:</span> <strong>{selectedLead.phone}</strong></div>
                <div><span style={{ color: 'var(--text-muted)' }}>Email:</span> <strong>{selectedLead.email || '—'}</strong></div>
                <div><span style={{ color: 'var(--text-muted)' }}>Location:</span> <strong>{selectedLead.city}, {selectedLead.state}</strong></div>
                <div><span style={{ color: 'var(--text-muted)' }}>Expected Value:</span> <strong style={{ color: 'var(--primary-600)' }}>{formatCurrency(selectedLead.expectedValue)}</strong></div>
                <div><span style={{ color: 'var(--text-muted)' }}>Sales Rep:</span> <strong>{selectedLead.assignedSalesperson}</strong></div>
                <div><span style={{ color: 'var(--text-muted)' }}>Lead Date:</span> <strong>{formatDate(selectedLead.leadDate)}</strong></div>
                <div><span style={{ color: 'var(--text-muted)' }}>Follow-up Date:</span> <strong>{formatDate(selectedLead.followUpDate)}</strong></div>
              </div>

              <div className="card" style={{ background: 'var(--bg-subtle)' }}>
                <h4 style={{ fontSize: '0.85rem', marginBottom: '4px' }}>Next Action Strategy</h4>
                <p style={{ fontSize: '0.82rem', margin: 0 }}>{selectedLead.nextAction || 'None specified'}</p>
              </div>

              {selectedLead.notes && (
                <div className="card">
                  <h4 style={{ fontSize: '0.85rem', marginBottom: '4px' }}>Lead Notes</h4>
                  <p style={{ fontSize: '0.82rem', margin: 0 }}>{selectedLead.notes}</p>
                </div>
              )}
            </div>

            <div className="modal-footer" style={{ display: 'flex', gap: '8px', flexWrap: 'wrap' }}>
              <a
                href={getWhatsAppUrl(selectedLead.phone, `Hello ${selectedLead.client}, following up on behalf of ${selectedLead.brand === 'AIWA' ? 'Aiwa Commercial AV' : 'Auco Automation'}.`)}
                target="_blank"
                rel="noreferrer"
                className="btn btn-whatsapp"
                style={{ display: 'flex', alignItems: 'center', gap: '6px' }}
              >
                <MessageSquare size={14} /> Open WhatsApp Chat
              </a>
              {selectedLead.stage !== 'Won' && (
                <button
                  className="btn btn-success btn-sm"
                  onClick={() => {
                    convertLeadToClient(selectedLead.id);
                    setSelectedLead(null);
                  }}
                >
                  <Zap size={14} /> Convert to Active Client
                </button>
              )}
              <button
                className="btn btn-secondary btn-sm"
                onClick={() => {
                  const leadToEdit = selectedLead;
                  setSelectedLead(null);
                  handleStartEdit(leadToEdit);
                }}
              >
                <Edit2 size={13} /> Edit Lead
              </button>
              <button
                className="btn btn-danger btn-sm"
                onClick={() => handleDeleteLead(selectedLead)}
              >
                <Trash2 size={13} /> Delete
              </button>
              <button className="btn btn-secondary btn-sm" onClick={() => setSelectedLead(null)} style={{ marginLeft: 'auto' }}>
                Close
              </button>
            </div>
          </div>
        </div>
      )}

      {/* =========================================================================
          EDIT LEAD MODAL
          ========================================================================= */}
      {editingLead && (
        <div className="modal-backdrop" onClick={() => setEditingLead(null)}>
          <div className="modal-content" onClick={(e) => e.stopPropagation()} style={{ maxWidth: '580px' }}>
            <div className="modal-header">
              <div>
                <span className="badge badge-purple">{editingLead.id}</span>
                <h3 style={{ marginTop: '4px' }}>Edit Lead Record</h3>
              </div>
              <button className="btn btn-ghost btn-icon" onClick={() => setEditingLead(null)}>
                <XCircle size={18} />
              </button>
            </div>

            <form onSubmit={handleSaveEdit}>
              <div className="modal-body" style={{ display: 'flex', flexDirection: 'column', gap: '14px' }}>
                <div className="form-group">
                  <label className="form-label">Company / Prospect Name *</label>
                  <input
                    type="text"
                    required
                    className="form-input"
                    value={editFormData.company || ''}
                    onChange={(e) => setEditFormData({ ...editFormData, company: e.target.value })}
                  />
                </div>

                <div className="form-row">
                  <div className="form-group">
                    <label className="form-label">Contact Person *</label>
                    <input
                      type="text"
                      required
                      className="form-input"
                      value={editFormData.client || ''}
                      onChange={(e) => setEditFormData({ ...editFormData, client: e.target.value })}
                    />
                  </div>
                  <div className="form-group">
                    <label className="form-label">Phone Number *</label>
                    <input
                      type="text"
                      required
                      className="form-input"
                      value={editFormData.phone || ''}
                      onChange={(e) => setEditFormData({ ...editFormData, phone: e.target.value })}
                    />
                  </div>
                </div>

                <div className="form-row">
                  <div className="form-group">
                    <label className="form-label">City *</label>
                    <input
                      type="text"
                      required
                      className="form-input"
                      value={editFormData.city || ''}
                      onChange={(e) => setEditFormData({ ...editFormData, city: e.target.value })}
                    />
                  </div>
                  <div className="form-group">
                    <label className="form-label">State</label>
                    <input
                      type="text"
                      className="form-input"
                      value={editFormData.state || ''}
                      onChange={(e) => setEditFormData({ ...editFormData, state: e.target.value })}
                    />
                  </div>
                </div>

                <div className="form-row">
                  <div className="form-group">
                    <label className="form-label">Pipeline Stage</label>
                    <select
                      className="form-select"
                      value={editFormData.stage || 'New Lead'}
                      onChange={(e) => setEditFormData({ ...editFormData, stage: e.target.value })}
                    >
                      {PIPELINE_STAGES.map((s) => (
                        <option key={s} value={s}>{s}</option>
                      ))}
                    </select>
                  </div>
                  <div className="form-group">
                    <label className="form-label">Expected Deal Value (₹)</label>
                    <input
                      type="number"
                      min="0"
                      className="form-input"
                      value={editFormData.expectedValue || 0}
                      onChange={(e) => setEditFormData({ ...editFormData, expectedValue: e.target.value })}
                    />
                  </div>
                </div>

                <div className="form-group">
                  <label className="form-label">Next Action / Follow-up Strategy</label>
                  <input
                    type="text"
                    className="form-input"
                    value={editFormData.nextAction || ''}
                    onChange={(e) => setEditFormData({ ...editFormData, nextAction: e.target.value })}
                  />
                </div>

                <div className="form-row">
                  <div className="form-group">
                    <label className="form-label">Follow-up Date</label>
                    <input
                      type="date"
                      className="form-input"
                      value={editFormData.followUpDate || ''}
                      onChange={(e) => setEditFormData({ ...editFormData, followUpDate: e.target.value })}
                    />
                  </div>
                  <div className="form-group">
                    <label className="form-label">Email Address</label>
                    <input
                      type="email"
                      className="form-input"
                      value={editFormData.email || ''}
                      onChange={(e) => setEditFormData({ ...editFormData, email: e.target.value })}
                    />
                  </div>
                </div>

                <div className="form-group">
                  <label className="form-label">Notes</label>
                  <textarea
                    rows={2}
                    className="form-input"
                    value={editFormData.notes || ''}
                    onChange={(e) => setEditFormData({ ...editFormData, notes: e.target.value })}
                  />
                </div>
              </div>

              <div className="modal-footer">
                <button type="button" className="btn btn-secondary" onClick={() => setEditingLead(null)}>
                  Cancel
                </button>
                <button type="submit" className="btn btn-primary">
                  Save Changes
                </button>
              </div>
            </form>
          </div>
        </div>
      )}
    </div>
  );
};
