import React, { useState } from 'react';
import { useApp } from '../context/AppContext';
import {
  Users,
  Plus,
  Search,
  Kanban,
  List,
  ArrowRight,
  CheckCircle2,
  XCircle,
  MessageSquare,
  Phone,
  Building2,
  Calendar,
  DollarSign,
  ChevronRight,
  Zap
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
  const { leads, updateLead, convertLeadToClient } = useApp();
  const [viewMode, setViewMode] = useState('kanban'); // 'kanban' | 'list'
  const [searchQuery, setSearchQuery] = useState('');
  const [sourceFilter, setSourceFilter] = useState('ALL');
  const [selectedLead, setSelectedLead] = useState(null);

  // Filter leads
  const filteredLeads = leads.filter((lead) => {
    const matchesSearch =
      lead.company.toLowerCase().includes(searchQuery.toLowerCase()) ||
      lead.client.toLowerCase().includes(searchQuery.toLowerCase()) ||
      lead.city.toLowerCase().includes(searchQuery.toLowerCase()) ||
      lead.assignedSalesperson.toLowerCase().includes(searchQuery.toLowerCase());

    const matchesSource = sourceFilter === 'ALL' || lead.leadSource === sourceFilter;
    return matchesSearch && matchesSource;
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

  return (
    <div style={{ display: 'flex', flexDirection: 'column', gap: '20px' }}>
      {/* Header */}
      <div className="flex-between">
        <div>
          <h2>Sales Pipeline & Lead Management</h2>
          <p style={{ fontSize: '0.82rem', color: 'var(--text-muted)' }}>
            Track sales stages, log WhatsApp inquiries, and convert prospect leads into active clients.
          </p>
        </div>
        <div style={{ display: 'flex', gap: '10px' }}>
          <div style={{ display: 'flex', background: 'var(--bg-subtle)', borderRadius: 'var(--radius-md)', padding: '3px' }}>
            <button
              className={`btn btn-sm ${viewMode === 'kanban' ? 'btn-primary' : 'btn-ghost'}`}
              onClick={() => setViewMode('kanban')}
              style={{ padding: '4px 10px' }}
            >
              <Kanban size={15} /> Board
            </button>
            <button
              className={`btn btn-sm ${viewMode === 'list' ? 'btn-primary' : 'btn-ghost'}`}
              onClick={() => setViewMode('list')}
              style={{ padding: '4px 10px' }}
            >
              <List size={15} /> Table
            </button>
          </div>

          <button className="btn btn-primary" onClick={onOpenLeadModal}>
            <Plus size={16} /> Add Lead
          </button>
        </div>
      </div>

      {/* Pipeline Summary Bar */}
      <div className="card" style={{ padding: '14px 20px' }}>
        <div className="flex-between" style={{ flexWrap: 'wrap', gap: '12px' }}>
          <div style={{ display: 'flex', alignItems: 'center', gap: '16px' }}>
            <div style={{ position: 'relative', minWidth: '240px' }}>
              <Search size={16} style={{ position: 'absolute', left: '10px', top: '50%', transform: 'translateY(-50%)', color: 'var(--text-muted)' }} />
              <input
                type="text"
                className="form-input"
                placeholder="Search leads..."
                value={searchQuery}
                onChange={(e) => setSearchQuery(e.target.value)}
                style={{ paddingLeft: '32px' }}
              />
            </div>

            <div style={{ display: 'flex', alignItems: 'center', gap: '6px' }}>
              <span style={{ fontSize: '0.8rem', color: 'var(--text-muted)' }}>Source:</span>
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
              <div style={{ fontSize: '0.72rem', color: 'var(--text-muted)', fontWeight: 700 }}>ACTIVE LEADS</div>
              <div style={{ fontSize: '1.1rem', fontWeight: 800 }}>
                {filteredLeads.filter(l => l.stage !== 'Lost' && l.stage !== 'Won').length} Leads
              </div>
            </div>
          </div>
        </div>
      </div>

      {/* =========================================================================
          KANBAN BOARD VIEW
          ========================================================================= */}
      {viewMode === 'kanban' && (
        <div
          style={{
            display: 'grid',
            gridTemplateColumns: 'repeat(7, minmax(240px, 1fr))',
            gap: '14px',
            overflowX: 'auto',
            paddingBottom: '16px'
          }}
        >
          {PIPELINE_STAGES.map((stage) => {
            const stageLeads = filteredLeads.filter((l) => l.stage === stage);
            const stageValue = stageLeads.reduce((acc, l) => acc + Number(l.expectedValue || 0), 0);

            return (
              <div
                key={stage}
                style={{
                  background: 'var(--bg-subtle)',
                  borderRadius: 'var(--radius-lg)',
                  padding: '12px',
                  display: 'flex',
                  flexDirection: 'column',
                  maxHeight: 'calc(100vh - 240px)',
                  border: '1px solid var(--border-default)'
                }}
              >
                {/* Column Header */}
                <div style={{ marginBottom: '10px', paddingBottom: '8px', borderBottom: '1px solid var(--border-default)' }}>
                  <div className="flex-between">
                    <strong style={{ fontSize: '0.85rem' }}>{stage}</strong>
                    <span className="badge badge-neutral" style={{ fontSize: '0.7rem' }}>{stageLeads.length}</span>
                  </div>
                  <div style={{ fontSize: '0.75rem', color: 'var(--text-muted)', marginTop: '2px' }}>
                    {formatCurrency(stageValue)}
                  </div>
                </div>

                {/* Lead Cards List */}
                <div style={{ flex: 1, overflowY: 'auto', display: 'flex', flexDirection: 'column', gap: '10px' }}>
                  {stageLeads.map((lead) => (
                    <div
                      key={lead.id}
                      className="card card-hover"
                      style={{
                        padding: '12px',
                        cursor: 'pointer',
                        background: 'var(--bg-surface)'
                      }}
                      onClick={() => setSelectedLead(lead)}
                    >
                      <div className="flex-between">
                        <span className="badge badge-purple" style={{ fontSize: '0.68rem' }}>{lead.leadSource}</span>
                        <strong style={{ fontSize: '0.85rem', color: 'var(--primary-600)' }}>
                          {formatCurrency(lead.expectedValue)}
                        </strong>
                      </div>

                      <h4 style={{ fontSize: '0.9rem', margin: '6px 0 2px 0' }}>{lead.company}</h4>
                      <div style={{ fontSize: '0.76rem', color: 'var(--text-secondary)' }}>
                        {lead.client} • {lead.city}
                      </div>

                      {/* Next action note */}
                      {lead.nextAction && (
                        <div
                          style={{
                            background: 'var(--bg-subtle)',
                            padding: '6px 8px',
                            borderRadius: 'var(--radius-sm)',
                            fontSize: '0.72rem',
                            color: 'var(--text-secondary)',
                            marginTop: '8px',
                            borderLeft: '2px solid var(--primary-600)'
                          }}
                        >
                          <strong>Next:</strong> {lead.nextAction}
                        </div>
                      )}

                      {/* Footer Actions */}
                      <div className="flex-between" style={{ marginTop: '10px', paddingTop: '8px', borderTop: '1px solid var(--border-subtle)' }}>
                        <a
                          href={getWhatsAppUrl(lead.phone, `Hi ${lead.client}, following up on your inquiry with Auco & Aiwa.`)}
                          target="_blank"
                          rel="noreferrer"
                          className="badge badge-whatsapp"
                          style={{ fontSize: '0.7rem' }}
                          onClick={(e) => e.stopPropagation()}
                        >
                          <MessageSquare size={11} /> WhatsApp
                        </a>

                        {/* Move Stage Select */}
                        <select
                          className="form-select"
                          style={{ width: '100px', fontSize: '0.7rem', padding: '2px 4px', height: '24px' }}
                          value={lead.stage}
                          onClick={(e) => e.stopPropagation()}
                          onChange={(e) => handleMoveStage(lead.id, e.target.value)}
                        >
                          {PIPELINE_STAGES.map((s) => (
                            <option key={s} value={s}>{s}</option>
                          ))}
                        </select>
                      </div>
                    </div>
                  ))}

                  {stageLeads.length === 0 && (
                    <div style={{ padding: '20px 0', textAlign: 'center', color: 'var(--text-muted)', fontSize: '0.75rem' }}>
                      No leads
                    </div>
                  )}
                </div>
              </div>
            );
          })}
        </div>
      )}

      {/* =========================================================================
          LIST / TABLE VIEW
          ========================================================================= */}
      {viewMode === 'list' && (
        <div className="table-container">
          <table className="custom-table">
            <thead>
              <tr>
                <th>Company / Prospect</th>
                <th>Contact</th>
                <th>Source</th>
                <th>Sales Rep</th>
                <th>Expected Value</th>
                <th>Stage</th>
                <th>Next Action</th>
                <th>Follow Up</th>
                <th>Convert</th>
              </tr>
            </thead>
            <tbody>
              {filteredLeads.map((lead) => (
                <tr key={lead.id} onClick={() => setSelectedLead(lead)} style={{ cursor: 'pointer' }}>
                  <td>
                    <strong>{lead.company}</strong>
                    <div style={{ fontSize: '0.74rem', color: 'var(--text-muted)' }}>{lead.city}, {lead.state}</div>
                  </td>
                  <td>
                    <div>{lead.client}</div>
                    <div style={{ fontSize: '0.74rem', color: 'var(--text-muted)' }}>{lead.phone}</div>
                  </td>
                  <td><span className="badge badge-neutral">{lead.leadSource}</span></td>
                  <td>{lead.assignedSalesperson}</td>
                  <td><strong>{formatCurrency(lead.expectedValue)}</strong></td>
                  <td><span className={`badge ${getStatusBadgeClass(lead.stage)}`}>{lead.stage}</span></td>
                  <td style={{ maxWidth: '220px', fontSize: '0.78rem' }}>{lead.nextAction}</td>
                  <td style={{ fontSize: '0.78rem' }}>{formatDate(lead.followUpDate)}</td>
                  <td onClick={(e) => e.stopPropagation()}>
                    {lead.stage !== 'Won' ? (
                      <button
                        className="btn btn-success btn-sm"
                        style={{ padding: '4px 8px', fontSize: '0.75rem' }}
                        onClick={() => convertLeadToClient(lead.id)}
                      >
                        <Zap size={12} /> Convert
                      </button>
                    ) : (
                      <span className="badge badge-success">Converted</span>
                    )}
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      )}

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
                <div><span style={{ color: 'var(--text-muted)' }}>Email:</span> <strong>{selectedLead.email}</strong></div>
                <div><span style={{ color: 'var(--text-muted)' }}>Location:</span> <strong>{selectedLead.city}, {selectedLead.state}</strong></div>
                <div><span style={{ color: 'var(--text-muted)' }}>Expected Value:</span> <strong style={{ color: 'var(--primary-600)' }}>{formatCurrency(selectedLead.expectedValue)}</strong></div>
                <div><span style={{ color: 'var(--text-muted)' }}>Sales Rep:</span> <strong>{selectedLead.assignedSalesperson}</strong></div>
                <div><span style={{ color: 'var(--text-muted)' }}>Lead Date:</span> <strong>{formatDate(selectedLead.leadDate)}</strong></div>
                <div><span style={{ color: 'var(--text-muted)' }}>Follow-up Date:</span> <strong>{formatDate(selectedLead.followUpDate)}</strong></div>
              </div>

              <div className="card" style={{ background: 'var(--bg-subtle)' }}>
                <h4 style={{ fontSize: '0.85rem', marginBottom: '4px' }}>Next Action Strategy</h4>
                <p style={{ fontSize: '0.82rem', margin: 0 }}>{selectedLead.nextAction}</p>
              </div>

              {selectedLead.notes && (
                <div className="card">
                  <h4 style={{ fontSize: '0.85rem', marginBottom: '4px' }}>Lead Notes</h4>
                  <p style={{ fontSize: '0.82rem', margin: 0 }}>{selectedLead.notes}</p>
                </div>
              )}
            </div>

            <div className="modal-footer">
              <a
                href={getWhatsAppUrl(selectedLead.phone, `Hello ${selectedLead.client}, following up on behalf of Auco & Aiwa.`)}
                target="_blank"
                rel="noreferrer"
                className="btn btn-sm badge-whatsapp"
              >
                <MessageSquare size={14} /> Open WhatsApp
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
              <button className="btn btn-secondary btn-sm" onClick={() => setSelectedLead(null)}>
                Close
              </button>
            </div>
          </div>
        </div>
      )}
    </div>
  );
};
