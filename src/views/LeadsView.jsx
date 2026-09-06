import React, { useState } from 'react';
import { useApp } from '../context/AppContext';
import {
  Users,
  Plus,
  Search,
  MessageSquare,
  Phone,
  Building2,
  Calendar,
  Zap,
  Trash2,
  Edit2,
  CheckCircle2,
  X,
  TrendingUp,
  MapPin,
  Clock,
  ArrowRight,
  UserCheck
} from 'lucide-react';
import { formatCurrency, formatDate, getWhatsAppUrl } from '../utils/formatters';

const PIPELINE_STAGES = [
  'New Lead',
  'Contacted',
  'Qualified',
  'Proposal',
  'Negotiation',
  'Won',
  'Lost'
];

const STAGE_CONFIG = {
  'New Lead':    { color: '#2563eb', bg: '#eff6ff', border: '#bfdbfe', label: 'New Lead' },
  'Contacted':   { color: '#0284c7', bg: '#f0f9ff', border: '#bae6fd', label: 'Contacted' },
  'Qualified':   { color: '#7c3aed', bg: '#f5f3ff', border: '#ddd6fe', label: 'Qualified' },
  'Proposal':    { color: '#d97706', bg: '#fffbeb', border: '#fde68a', label: 'Proposal' },
  'Negotiation': { color: '#ea580c', bg: '#fff7ed', border: '#fdba74', label: 'Negotiation' },
  'Won':         { color: '#059669', bg: '#ecfdf5', border: '#a7f3d0', label: 'Won / Converted' },
  'Lost':        { color: '#dc2626', bg: '#fef2f2', border: '#fecaca', label: 'Lost' },
};

const LeadCard = ({ lead, onMoveStage, onConvert, onEdit, onDelete, onViewDetails }) => {
  const sCfg = STAGE_CONFIG[lead.stage] || STAGE_CONFIG['New Lead'];
  const isWon = lead.stage === 'Won';
  const isLost = lead.stage === 'Lost';

  const nextStageMap = {
    'New Lead': 'Contacted',
    'Contacted': 'Qualified',
    'Qualified': 'Proposal',
    'Proposal': 'Negotiation',
    'Negotiation': 'Won',
  };
  const nextStage = nextStageMap[lead.stage];

  return (
    <div
      style={{
        background: '#ffffff',
        borderRadius: '14px',
        border: `1.5px solid ${isWon ? '#a7f3d0' : (isLost ? '#fecaca' : '#e2e8f0')}`,
        padding: '18px 20px',
        display: 'flex',
        flexDirection: 'column',
        gap: '14px',
        boxShadow: '0 2px 8px rgba(0,0,0,0.04)',
        transition: 'all 0.15s ease'
      }}
    >
      {/* Top row: Company name + Stage badge */}
      <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'flex-start', gap: '12px' }}>
        <div style={{ flex: 1, minWidth: 0 }}>
          <div style={{ display: 'flex', alignItems: 'center', gap: '6px', flexWrap: 'wrap', marginBottom: '4px' }}>
            <span
              style={{
                fontSize: '0.72rem',
                fontWeight: 700,
                padding: '2px 8px',
                borderRadius: '6px',
                color: sCfg.color,
                background: sCfg.bg,
                border: `1px solid ${sCfg.border}`
              }}
            >
              {sCfg.label}
            </span>
            {lead.leadSource && (
              <span
                style={{
                  fontSize: '0.7rem',
                  fontWeight: 600,
                  color: '#64748b',
                  background: '#f1f5f9',
                  padding: '2px 8px',
                  borderRadius: '6px'
                }}
              >
                {lead.leadSource}
              </span>
            )}
            {lead.city && (
              <span
                style={{
                  fontSize: '0.7rem',
                  fontWeight: 600,
                  color: '#64748b',
                  background: '#f8fafc',
                  padding: '2px 8px',
                  borderRadius: '6px',
                  display: 'inline-flex',
                  alignItems: 'center',
                  gap: '3px'
                }}
              >
                <MapPin size={11} /> {lead.city}
              </span>
            )}
          </div>

          <h3
            style={{
              margin: '0 0 2px 0',
              fontSize: '1.05rem',
              fontWeight: 800,
              color: '#0f172a',
              cursor: 'pointer'
            }}
            onClick={() => onViewDetails(lead)}
          >
            {lead.company}
          </h3>

          <div style={{ fontSize: '0.82rem', color: '#475569', display: 'flex', alignItems: 'center', gap: '6px' }}>
            <span style={{ fontWeight: 600 }}>{lead.client}</span>
            <span style={{ color: '#cbd5e1' }}>•</span>
            <span style={{ color: '#64748b' }}>{lead.phone}</span>
          </div>
        </div>

        <div style={{ textAlign: 'right', flexShrink: 0 }}>
          <div style={{ fontSize: '0.7rem', color: '#94a3b8', fontWeight: 700 }}>VALUE</div>
          <div style={{ fontSize: '1.15rem', fontWeight: 800, color: '#2563eb' }}>
            {formatCurrency(lead.expectedValue)}
          </div>
        </div>
      </div>

      {/* Next Action / Notes */}
      {lead.nextAction && (
        <div
          style={{
            fontSize: '0.82rem',
            color: '#334155',
            background: '#f8fafc',
            padding: '10px 14px',
            borderRadius: '8px',
            borderLeft: '3px solid #3b82f6',
            lineHeight: 1.4
          }}
        >
          <strong style={{ color: '#1e293b' }}>Next Step: </strong>
          {lead.nextAction}
        </div>
      )}

      {/* Rep & Follow-up Row */}
      <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', flexWrap: 'wrap', gap: '8px', fontSize: '0.78rem', color: '#64748b' }}>
        <div>
          <span>Rep: </span>
          <strong style={{ color: '#1e293b' }}>{lead.assignedSalesperson || 'Unassigned'}</strong>
        </div>

        {lead.followUpDate && (
          <div style={{ display: 'flex', alignItems: 'center', gap: '4px', fontWeight: 600, color: '#d97706' }}>
            <Calendar size={13} />
            <span>Follow-up: {formatDate(lead.followUpDate)}</span>
          </div>
        )}
      </div>

      {/* Action Bar */}
      <div
        style={{
          display: 'flex',
          alignItems: 'center',
          justifyContent: 'space-between',
          gap: '8px',
          paddingTop: '12px',
          borderTop: '1px solid #f1f5f9',
          flexWrap: 'wrap'
        }}
      >
        {/* Quick Contact Buttons */}
        <div style={{ display: 'flex', gap: '6px' }}>
          <a
            href={getWhatsAppUrl(lead.phone, `Hi ${lead.client}, following up from ${lead.brand === 'AIWA' ? 'Aiwa Commercial AV' : 'Auco Automation'}.`)}
            target="_blank"
            rel="noreferrer"
            style={{
              display: 'flex',
              alignItems: 'center',
              gap: '5px',
              padding: '6px 12px',
              borderRadius: '8px',
              background: '#f0fdf4',
              border: '1px solid #86efac',
              color: '#16a34a',
              fontWeight: 700,
              fontSize: '0.78rem',
              textDecoration: 'none'
            }}
          >
            <MessageSquare size={13} /> WhatsApp
          </a>

          {lead.phone && (
            <a
              href={`tel:${lead.phone}`}
              style={{
                display: 'flex',
                alignItems: 'center',
                gap: '5px',
                padding: '6px 12px',
                borderRadius: '8px',
                background: '#eff6ff',
                border: '1px solid #93c5fd',
                color: '#2563eb',
                fontWeight: 700,
                fontSize: '0.78rem',
                textDecoration: 'none'
              }}
            >
              <Phone size={13} /> Call
            </a>
          )}
        </div>

        {/* Stage Advancement & Controls */}
        <div style={{ display: 'flex', alignItems: 'center', gap: '6px' }}>
          {nextStage && !isWon && !isLost && (
            <button
              onClick={() => onMoveStage(lead.id, nextStage)}
              style={{
                display: 'flex',
                alignItems: 'center',
                gap: '4px',
                padding: '6px 12px',
                borderRadius: '8px',
                border: 'none',
                background: nextStage === 'Won' ? '#059669' : '#2563eb',
                color: '#ffffff',
                fontWeight: 700,
                fontSize: '0.78rem',
                cursor: 'pointer'
              }}
            >
              {nextStage === 'Won' ? <Zap size={13} /> : <ArrowRight size={13} />}
              <span>Move to {nextStage}</span>
            </button>
          )}

          {lead.stage !== 'Won' && (
            <button
              onClick={() => onConvert(lead.id)}
              title="Mark Won & Convert to Client"
              style={{
                display: 'flex',
                alignItems: 'center',
                gap: '4px',
                padding: '6px 10px',
                borderRadius: '8px',
                border: '1px solid #a7f3d0',
                background: '#ecfdf5',
                color: '#059669',
                fontWeight: 700,
                fontSize: '0.78rem',
                cursor: 'pointer'
              }}
            >
              <UserCheck size={13} /> Won
            </button>
          )}

          <button
            onClick={() => onEdit(lead)}
            style={{
              padding: '6px 8px',
              borderRadius: '8px',
              border: '1px solid #e2e8f0',
              background: '#ffffff',
              color: '#64748b',
              cursor: 'pointer',
              display: 'flex',
              alignItems: 'center'
            }}
            title="Edit lead"
          >
            <Edit2 size={13} />
          </button>

          <button
            onClick={() => onDelete(lead)}
            style={{
              padding: '6px 8px',
              borderRadius: '8px',
              border: '1px solid #fee2e2',
              background: '#fef2f2',
              color: '#dc2626',
              cursor: 'pointer',
              display: 'flex',
              alignItems: 'center'
            }}
            title="Delete lead"
          >
            <Trash2 size={13} />
          </button>
        </div>
      </div>
    </div>
  );
};

export const LeadsView = ({ onOpenLeadModal }) => {
  const { leads, updateLead, deleteLead, convertLeadToClient, matchesCompany } = useApp();
  const [searchQuery, setSearchQuery] = useState('');
  const [stageFilter, setStageFilter] = useState('ALL');
  const [sourceFilter, setSourceFilter] = useState('ALL');
  const [selectedLead, setSelectedLead] = useState(null);
  const [editingLead, setEditingLead] = useState(null);
  const [editFormData, setEditFormData] = useState({});

  // Scoped leads by active company
  const scopedLeads = leads.filter(matchesCompany);

  // Aggregates
  const totalValue = scopedLeads
    .filter((l) => l.stage !== 'Lost')
    .reduce((acc, l) => acc + Number(l.expectedValue || 0), 0);
  const newCount = scopedLeads.filter((l) => l.stage === 'New Lead').length;
  const inProgressCount = scopedLeads.filter((l) => !['Won', 'Lost', 'New Lead'].includes(l.stage)).length;
  const wonCount = scopedLeads.filter((l) => l.stage === 'Won').length;

  // Filter leads
  const filteredLeads = scopedLeads.filter((lead) => {
    const matchesSearch =
      (lead.company || '').toLowerCase().includes(searchQuery.toLowerCase()) ||
      (lead.client || '').toLowerCase().includes(searchQuery.toLowerCase()) ||
      (lead.city || '').toLowerCase().includes(searchQuery.toLowerCase()) ||
      (lead.assignedSalesperson || '').toLowerCase().includes(searchQuery.toLowerCase());

    const matchesSource = sourceFilter === 'ALL' || lead.leadSource === sourceFilter;
    const matchesStage = stageFilter === 'ALL' || lead.stage === stageFilter;

    return matchesSearch && matchesSource && matchesStage;
  });

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
    if (window.confirm(`Delete lead "${lead.company}"?`)) {
      deleteLead(lead.id);
      if (selectedLead && selectedLead.id === lead.id) setSelectedLead(null);
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
      <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', flexWrap: 'wrap', gap: '12px' }}>
        <div>
          <h2 style={{ fontSize: '1.4rem', fontWeight: 800, margin: '0 0 4px 0', color: '#0f172a' }}>
            Sales Pipeline
          </h2>
          <p style={{ fontSize: '0.85rem', color: '#64748b', margin: 0 }}>
            Simple, clutter-free prospect tracker for sales reps
          </p>
        </div>
        <button
          onClick={onOpenLeadModal}
          style={{
            display: 'flex',
            alignItems: 'center',
            gap: '8px',
            padding: '10px 18px',
            borderRadius: '10px',
            border: 'none',
            background: 'linear-gradient(135deg, #2563eb 0%, #1d4ed8 100%)',
            color: '#ffffff',
            fontWeight: 700,
            fontSize: '0.88rem',
            cursor: 'pointer',
            boxShadow: '0 4px 12px rgba(37,99,235,0.25)'
          }}
        >
          <Plus size={16} /> Add New Lead
        </button>
      </div>

      {/* 4 Clickable Metric Filter Cards */}
      <div
        style={{
          display: 'grid',
          gridTemplateColumns: 'repeat(auto-fit, minmax(200px, 1fr))',
          gap: '12px'
        }}
      >
        <div
          onClick={() => setStageFilter('ALL')}
          style={{
            background: '#ffffff',
            padding: '16px 18px',
            borderRadius: '14px',
            border: stageFilter === 'ALL' ? '2px solid #2563eb' : '1px solid #e2e8f0',
            cursor: 'pointer',
            boxShadow: stageFilter === 'ALL' ? '0 4px 12px rgba(37,99,235,0.12)' : '0 2px 6px rgba(0,0,0,0.03)',
            transition: 'all 0.15s'
          }}
        >
          <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: '8px' }}>
            <span style={{ fontSize: '0.8rem', fontWeight: 700, color: '#64748b' }}>TOTAL PIPELINE</span>
            <TrendingUp size={18} color="#2563eb" />
          </div>
          <div style={{ fontSize: '1.45rem', fontWeight: 800, color: '#2563eb' }}>
            {formatCurrency(totalValue)}
          </div>
          <div style={{ fontSize: '0.75rem', color: '#94a3b8', marginTop: '4px' }}>
            {scopedLeads.length} active leads
          </div>
        </div>

        <div
          onClick={() => setStageFilter('New Lead')}
          style={{
            background: '#ffffff',
            padding: '16px 18px',
            borderRadius: '14px',
            border: stageFilter === 'New Lead' ? '2px solid #2563eb' : '1px solid #e2e8f0',
            cursor: 'pointer',
            boxShadow: stageFilter === 'New Lead' ? '0 4px 12px rgba(37,99,235,0.12)' : '0 2px 6px rgba(0,0,0,0.03)',
            transition: 'all 0.15s'
          }}
        >
          <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: '8px' }}>
            <span style={{ fontSize: '0.8rem', fontWeight: 700, color: '#2563eb' }}>NEW LEADS</span>
            <Users size={18} color="#2563eb" />
          </div>
          <div style={{ fontSize: '1.45rem', fontWeight: 800, color: '#0f172a' }}>{newCount}</div>
          <div style={{ fontSize: '0.75rem', color: '#94a3b8', marginTop: '4px' }}>Awaiting initial contact</div>
        </div>

        <div
          onClick={() => setStageFilter('Proposal')}
          style={{
            background: '#ffffff',
            padding: '16px 18px',
            borderRadius: '14px',
            border: stageFilter === 'Proposal' ? '2px solid #d97706' : '1px solid #e2e8f0',
            cursor: 'pointer',
            boxShadow: stageFilter === 'Proposal' ? '0 4px 12px rgba(217,119,6,0.12)' : '0 2px 6px rgba(0,0,0,0.03)',
            transition: 'all 0.15s'
          }}
        >
          <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: '8px' }}>
            <span style={{ fontSize: '0.8rem', fontWeight: 700, color: '#d97706' }}>IN PIPELINE</span>
            <Clock size={18} color="#d97706" />
          </div>
          <div style={{ fontSize: '1.45rem', fontWeight: 800, color: '#d97706' }}>{inProgressCount}</div>
          <div style={{ fontSize: '0.75rem', color: '#94a3b8', marginTop: '4px' }}>Discussions & proposals</div>
        </div>

        <div
          onClick={() => setStageFilter('Won')}
          style={{
            background: '#ffffff',
            padding: '16px 18px',
            borderRadius: '14px',
            border: stageFilter === 'Won' ? '2px solid #059669' : '1px solid #e2e8f0',
            cursor: 'pointer',
            boxShadow: stageFilter === 'Won' ? '0 4px 12px rgba(5,150,105,0.12)' : '0 2px 6px rgba(0,0,0,0.03)',
            transition: 'all 0.15s'
          }}
        >
          <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: '8px' }}>
            <span style={{ fontSize: '0.8rem', fontWeight: 700, color: '#059669' }}>CONVERTED / WON</span>
            <CheckCircle2 size={18} color="#059669" />
          </div>
          <div style={{ fontSize: '1.45rem', fontWeight: 800, color: '#059669' }}>{wonCount}</div>
          <div style={{ fontSize: '0.75rem', color: '#94a3b8', marginTop: '4px' }}>Successfully won deals</div>
        </div>
      </div>

      {/* Search & Filter Bar */}
      <div
        style={{
          background: '#ffffff',
          borderRadius: '14px',
          border: '1px solid #e2e8f0',
          padding: '14px 18px',
          display: 'flex',
          gap: '12px',
          flexWrap: 'wrap',
          alignItems: 'center',
          boxShadow: '0 1px 3px rgba(0,0,0,0.02)'
        }}
      >
        <div style={{ position: 'relative', flex: 1, minWidth: '240px' }}>
          <Search
            size={16}
            style={{ position: 'absolute', left: '12px', top: '50%', transform: 'translateY(-50%)', color: '#94a3b8' }}
          />
          <input
            type="text"
            placeholder="Search company, contact person, or city..."
            value={searchQuery}
            onChange={(e) => setSearchQuery(e.target.value)}
            style={{
              width: '100%',
              padding: '9px 12px 9px 38px',
              borderRadius: '8px',
              border: '1px solid #cbd5e1',
              fontSize: '0.88rem',
              outline: 'none',
              boxSizing: 'border-box'
            }}
          />
        </div>

        {/* Stage Filter */}
        <div style={{ display: 'flex', alignItems: 'center', gap: '8px' }}>
          <span style={{ fontSize: '0.82rem', fontWeight: 600, color: '#64748b' }}>Stage:</span>
          <select
            value={stageFilter}
            onChange={(e) => setStageFilter(e.target.value)}
            style={{
              padding: '8px 12px',
              borderRadius: '8px',
              border: '1px solid #cbd5e1',
              fontSize: '0.85rem',
              background: '#ffffff',
              color: '#1e293b',
              fontWeight: 600,
              outline: 'none'
            }}
          >
            <option value="ALL">All Stages ({scopedLeads.length})</option>
            {PIPELINE_STAGES.map((s) => (
              <option key={s} value={s}>{s}</option>
            ))}
          </select>
        </div>

        {/* Source Filter */}
        <div style={{ display: 'flex', alignItems: 'center', gap: '8px' }}>
          <span style={{ fontSize: '0.82rem', fontWeight: 600, color: '#64748b' }}>Source:</span>
          <select
            value={sourceFilter}
            onChange={(e) => setSourceFilter(e.target.value)}
            style={{
              padding: '8px 12px',
              borderRadius: '8px',
              border: '1px solid #cbd5e1',
              fontSize: '0.85rem',
              background: '#ffffff',
              color: '#1e293b',
              fontWeight: 600,
              outline: 'none'
            }}
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

      {/* Cards Grid */}
      <div
        style={{
          display: 'grid',
          gridTemplateColumns: 'repeat(auto-fill, minmax(360px, 1fr))',
          gap: '16px'
        }}
      >
        {filteredLeads.map((lead) => (
          <LeadCard
            key={lead.id}
            lead={lead}
            onMoveStage={handleMoveStage}
            onConvert={convertLeadToClient}
            onEdit={handleStartEdit}
            onDelete={handleDeleteLead}
            onViewDetails={setSelectedLead}
          />
        ))}

        {filteredLeads.length === 0 && (
          <div
            style={{
              gridColumn: '1 / -1',
              background: '#ffffff',
              borderRadius: '16px',
              border: '2px dashed #e2e8f0',
              padding: '50px 20px',
              textAlign: 'center',
              color: '#94a3b8'
            }}
          >
            <Users size={42} style={{ margin: '0 auto 12px', opacity: 0.35, color: '#4f46e5' }} />
            <h3 style={{ margin: '0 0 6px 0', fontSize: '1.1rem', color: '#334155', fontWeight: 700 }}>
              No leads found
            </h3>
            <p style={{ margin: 0, fontSize: '0.85rem' }}>
              {stageFilter !== 'ALL'
                ? `No leads currently in "${stageFilter}" stage.`
                : 'Click "Add New Lead" to begin building your pipeline.'}
            </p>
          </div>
        )}
      </div>

      {/* Quick View / Detail Modal */}
      {selectedLead && (
        <div
          style={{
            position: 'fixed',
            inset: 0,
            background: 'rgba(15, 23, 42, 0.6)',
            display: 'flex',
            alignItems: 'center',
            justifyContent: 'center',
            zIndex: 1100,
            padding: '16px'
          }}
          onClick={() => setSelectedLead(null)}
        >
          <div
            style={{
              background: '#ffffff',
              borderRadius: '16px',
              width: '100%',
              maxWidth: '520px',
              padding: '24px',
              display: 'flex',
              flexDirection: 'column',
              gap: '16px',
              boxShadow: '0 20px 25px -5px rgba(0, 0, 0, 0.1)',
              maxHeight: '90vh',
              overflowY: 'auto'
            }}
            onClick={(e) => e.stopPropagation()}
          >
            <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'flex-start' }}>
              <div>
                <span
                  style={{
                    fontSize: '0.72rem',
                    fontWeight: 700,
                    padding: '3px 8px',
                    borderRadius: '6px',
                    color: STAGE_CONFIG[selectedLead.stage]?.color || '#2563eb',
                    background: STAGE_CONFIG[selectedLead.stage]?.bg || '#eff6ff',
                    border: `1px solid ${STAGE_CONFIG[selectedLead.stage]?.border || '#bfdbfe'}`
                  }}
                >
                  {selectedLead.stage}
                </span>
                <h3 style={{ margin: '8px 0 2px 0', fontSize: '1.2rem', fontWeight: 800 }}>
                  {selectedLead.company}
                </h3>
                <div style={{ fontSize: '0.78rem', color: '#94a3b8' }}>ID: {selectedLead.id}</div>
              </div>
              <button
                onClick={() => setSelectedLead(null)}
                style={{ background: 'none', border: 'none', cursor: 'pointer', color: '#94a3b8', padding: '4px' }}
              >
                <X size={20} />
              </button>
            </div>

            <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: '12px', fontSize: '0.85rem' }}>
              <div><span style={{ color: '#94a3b8' }}>Contact:</span> <strong>{selectedLead.client}</strong></div>
              <div><span style={{ color: '#94a3b8' }}>Phone:</span> <strong>{selectedLead.phone}</strong></div>
              <div><span style={{ color: '#94a3b8' }}>Email:</span> <strong>{selectedLead.email || '—'}</strong></div>
              <div><span style={{ color: '#94a3b8' }}>Location:</span> <strong>{selectedLead.city}, {selectedLead.state}</strong></div>
              <div><span style={{ color: '#94a3b8' }}>Value:</span> <strong style={{ color: '#2563eb' }}>{formatCurrency(selectedLead.expectedValue)}</strong></div>
              <div><span style={{ color: '#94a3b8' }}>Rep:</span> <strong>{selectedLead.assignedSalesperson}</strong></div>
              <div><span style={{ color: '#94a3b8' }}>Follow-up:</span> <strong>{formatDate(selectedLead.followUpDate)}</strong></div>
            </div>

            {selectedLead.nextAction && (
              <div style={{ background: '#f8fafc', padding: '12px 14px', borderRadius: '10px', borderLeft: '3px solid #3b82f6' }}>
                <div style={{ fontSize: '0.75rem', fontWeight: 700, color: '#64748b', marginBottom: '2px' }}>NEXT STRATEGY</div>
                <div style={{ fontSize: '0.85rem', color: '#1e293b' }}>{selectedLead.nextAction}</div>
              </div>
            )}

            {selectedLead.notes && (
              <div style={{ background: '#f8fafc', padding: '12px 14px', borderRadius: '10px' }}>
                <div style={{ fontSize: '0.75rem', fontWeight: 700, color: '#64748b', marginBottom: '2px' }}>NOTES</div>
                <div style={{ fontSize: '0.85rem', color: '#475569' }}>{selectedLead.notes}</div>
              </div>
            )}

            <div style={{ display: 'flex', gap: '8px', justifyContent: 'flex-end', paddingTop: '10px', borderTop: '1px solid #f1f5f9' }}>
              <a
                href={getWhatsAppUrl(selectedLead.phone, `Hello ${selectedLead.client}, following up from ${selectedLead.brand === 'AIWA' ? 'Aiwa Commercial AV' : 'Auco Automation'}.`)}
                target="_blank"
                rel="noreferrer"
                style={{
                  display: 'flex',
                  alignItems: 'center',
                  gap: '6px',
                  padding: '8px 14px',
                  borderRadius: '8px',
                  background: '#f0fdf4',
                  border: '1px solid #86efac',
                  color: '#16a34a',
                  fontWeight: 700,
                  fontSize: '0.82rem',
                  textDecoration: 'none'
                }}
              >
                <MessageSquare size={14} /> WhatsApp
              </a>
              <button
                onClick={() => {
                  const toEdit = selectedLead;
                  setSelectedLead(null);
                  handleStartEdit(toEdit);
                }}
                style={{
                  padding: '8px 14px',
                  borderRadius: '8px',
                  border: '1px solid #cbd5e1',
                  background: '#ffffff',
                  color: '#334155',
                  fontWeight: 700,
                  fontSize: '0.82rem',
                  cursor: 'pointer'
                }}
              >
                Edit
              </button>
            </div>
          </div>
        </div>
      )}

      {/* Edit Modal */}
      {editingLead && (
        <div
          style={{
            position: 'fixed',
            inset: 0,
            background: 'rgba(15, 23, 42, 0.6)',
            display: 'flex',
            alignItems: 'center',
            justifyContent: 'center',
            zIndex: 1100,
            padding: '16px'
          }}
          onClick={() => setEditingLead(null)}
        >
          <div
            style={{
              background: '#ffffff',
              borderRadius: '16px',
              width: '100%',
              maxWidth: '560px',
              padding: '24px',
              display: 'flex',
              flexDirection: 'column',
              gap: '16px',
              boxShadow: '0 20px 25px -5px rgba(0, 0, 0, 0.1)',
              maxHeight: '90vh',
              overflowY: 'auto'
            }}
            onClick={(e) => e.stopPropagation()}
          >
            <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center' }}>
              <h3 style={{ margin: 0, fontSize: '1.2rem', fontWeight: 800 }}>Edit Lead</h3>
              <button onClick={() => setEditingLead(null)} style={{ background: 'none', border: 'none', cursor: 'pointer', color: '#94a3b8' }}>
                <X size={20} />
              </button>
            </div>

            <form onSubmit={handleSaveEdit} style={{ display: 'flex', flexDirection: 'column', gap: '14px' }}>
              <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: '12px' }}>
                <div>
                  <label style={{ fontSize: '0.78rem', fontWeight: 700, color: '#475569', display: 'block', marginBottom: '4px' }}>Company</label>
                  <input
                    type="text"
                    required
                    value={editFormData.company}
                    onChange={(e) => setEditFormData({ ...editFormData, company: e.target.value })}
                    style={{ width: '100%', padding: '8px 10px', borderRadius: '8px', border: '1px solid #cbd5e1', fontSize: '0.85rem', boxSizing: 'border-box' }}
                  />
                </div>
                <div>
                  <label style={{ fontSize: '0.78rem', fontWeight: 700, color: '#475569', display: 'block', marginBottom: '4px' }}>Contact Person</label>
                  <input
                    type="text"
                    required
                    value={editFormData.client}
                    onChange={(e) => setEditFormData({ ...editFormData, client: e.target.value })}
                    style={{ width: '100%', padding: '8px 10px', borderRadius: '8px', border: '1px solid #cbd5e1', fontSize: '0.85rem', boxSizing: 'border-box' }}
                  />
                </div>
              </div>

              <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: '12px' }}>
                <div>
                  <label style={{ fontSize: '0.78rem', fontWeight: 700, color: '#475569', display: 'block', marginBottom: '4px' }}>Phone</label>
                  <input
                    type="tel"
                    required
                    value={editFormData.phone}
                    onChange={(e) => setEditFormData({ ...editFormData, phone: e.target.value })}
                    style={{ width: '100%', padding: '8px 10px', borderRadius: '8px', border: '1px solid #cbd5e1', fontSize: '0.85rem', boxSizing: 'border-box' }}
                  />
                </div>
                <div>
                  <label style={{ fontSize: '0.78rem', fontWeight: 700, color: '#475569', display: 'block', marginBottom: '4px' }}>Expected Value (₹)</label>
                  <input
                    type="number"
                    value={editFormData.expectedValue}
                    onChange={(e) => setEditFormData({ ...editFormData, expectedValue: e.target.value })}
                    style={{ width: '100%', padding: '8px 10px', borderRadius: '8px', border: '1px solid #cbd5e1', fontSize: '0.85rem', boxSizing: 'border-box' }}
                  />
                </div>
              </div>

              <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: '12px' }}>
                <div>
                  <label style={{ fontSize: '0.78rem', fontWeight: 700, color: '#475569', display: 'block', marginBottom: '4px' }}>Stage</label>
                  <select
                    value={editFormData.stage}
                    onChange={(e) => setEditFormData({ ...editFormData, stage: e.target.value })}
                    style={{ width: '100%', padding: '8px 10px', borderRadius: '8px', border: '1px solid #cbd5e1', fontSize: '0.85rem', boxSizing: 'border-box', background: '#fff' }}
                  >
                    {PIPELINE_STAGES.map((s) => (
                      <option key={s} value={s}>{s}</option>
                    ))}
                  </select>
                </div>
                <div>
                  <label style={{ fontSize: '0.78rem', fontWeight: 700, color: '#475569', display: 'block', marginBottom: '4px' }}>Follow-up Date</label>
                  <input
                    type="date"
                    value={editFormData.followUpDate}
                    onChange={(e) => setEditFormData({ ...editFormData, followUpDate: e.target.value })}
                    style={{ width: '100%', padding: '8px 10px', borderRadius: '8px', border: '1px solid #cbd5e1', fontSize: '0.85rem', boxSizing: 'border-box' }}
                  />
                </div>
              </div>

              <div>
                <label style={{ fontSize: '0.78rem', fontWeight: 700, color: '#475569', display: 'block', marginBottom: '4px' }}>Next Action Strategy</label>
                <input
                  type="text"
                  placeholder="e.g. Schedule product demo, send quotation..."
                  value={editFormData.nextAction}
                  onChange={(e) => setEditFormData({ ...editFormData, nextAction: e.target.value })}
                  style={{ width: '100%', padding: '8px 10px', borderRadius: '8px', border: '1px solid #cbd5e1', fontSize: '0.85rem', boxSizing: 'border-box' }}
                />
              </div>

              <div>
                <label style={{ fontSize: '0.78rem', fontWeight: 700, color: '#475569', display: 'block', marginBottom: '4px' }}>Notes</label>
                <textarea
                  rows={3}
                  value={editFormData.notes}
                  onChange={(e) => setEditFormData({ ...editFormData, notes: e.target.value })}
                  style={{ width: '100%', padding: '8px 10px', borderRadius: '8px', border: '1px solid #cbd5e1', fontSize: '0.85rem', boxSizing: 'border-box', resize: 'vertical' }}
                />
              </div>

              <div style={{ display: 'flex', gap: '10px', justifyContent: 'flex-end', marginTop: '6px' }}>
                <button
                  type="button"
                  onClick={() => setEditingLead(null)}
                  style={{ padding: '8px 16px', borderRadius: '8px', border: '1px solid #cbd5e1', background: '#fff', color: '#475569', fontWeight: 600, cursor: 'pointer' }}
                >
                  Cancel
                </button>
                <button
                  type="submit"
                  style={{ padding: '8px 18px', borderRadius: '8px', border: 'none', background: '#2563eb', color: '#fff', fontWeight: 700, cursor: 'pointer' }}
                >
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
