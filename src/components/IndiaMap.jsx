import React, { useState } from 'react';
import { useApp } from '../context/AppContext';
import { indiaStateData } from '../data/initialData';
import { formatCurrency, getWhatsAppUrl } from '../utils/formatters';
import { MapPin, Building2, Phone, Mail, ShoppingCart, MessageSquare, ArrowRight, X } from 'lucide-react';

export const IndiaMap = ({ onSelectClient }) => {
  const { clients, orders, selectedCompany, companyBrands, matchesCompany } = useApp();
  const [selectedState, setSelectedState] = useState(null);
  const [selectedClientPin, setSelectedClientPin] = useState(null);
  const [hoveredState, setHoveredState] = useState(null);

  // Scoped clients by company
  const scopedClients = clients.filter(matchesCompany);

  // Group clients and orders by state
  const stateStats = {};
  Object.keys(indiaStateData).forEach((state) => {
    stateStats[state] = {
      clients: [],
      clientCount: 0,
      totalBusinessValue: 0,
      totalOrders: 0,
      cities: new Set()
    };
  });

  scopedClients.forEach((client) => {
    const st = client.state;
    if (!stateStats[st]) {
      stateStats[st] = {
        clients: [],
        clientCount: 0,
        totalBusinessValue: 0,
        totalOrders: 0,
        cities: new Set()
      };
    }
    stateStats[st].clients.push(client);
    stateStats[st].clientCount += 1;
    stateStats[st].totalBusinessValue += Number(client.totalBusinessValue || 0);
    stateStats[st].totalOrders += Number(client.totalOrders || 0);
    if (client.city) stateStats[st].cities.add(client.city);
  });

  // Calculate India totals
  const totalIndiaClients = scopedClients.length;
  const totalIndiaValue = scopedClients.reduce((acc, c) => acc + Number(c.totalBusinessValue || 0), 0);
  const totalIndiaOrders = scopedClients.reduce((acc, c) => acc + Number(c.totalOrders || 0), 0);

  const activeStateData = selectedState ? stateStats[selectedState] : null;

  return (
    <div style={{ display: 'flex', flexDirection: 'column', gap: '20px' }}>
      {/* Map Header KPI Cards */}
      <div className="grid-3">
        <div className="stat-card" style={{ borderLeft: '4px solid var(--primary-600)' }}>
          <div className="stat-header">
            <span className="stat-title">Pan-India Client Network</span>
            <Building2 size={18} style={{ color: 'var(--primary-600)' }} />
          </div>
          <div className="stat-value">{totalIndiaClients} Clients</div>
          <div className="stat-subtext">Distributed across {Object.values(stateStats).filter(s => s.clientCount > 0).length} active states</div>
        </div>

        <div className="stat-card" style={{ borderLeft: '4px solid var(--success-text)' }}>
          <div className="stat-header">
            <span className="stat-title">Total Network Business Value</span>
            <ShoppingCart size={18} style={{ color: 'var(--success-text)' }} />
          </div>
          <div className="stat-value">{formatCurrency(totalIndiaValue)}</div>
          <div className="stat-subtext">{totalIndiaOrders} fulfilled client orders</div>
        </div>

        <div className="stat-card" style={{ borderLeft: '4px solid #8b5cf6' }}>
          <div className="stat-header">
            <span className="stat-title">Selected State Drilldown</span>
            <MapPin size={18} style={{ color: '#8b5cf6' }} />
          </div>
          <div className="stat-value">{selectedState ? selectedState : 'All India'}</div>
          <div className="stat-subtext">
            {selectedState
              ? `${activeStateData?.clientCount || 0} clients • ${formatCurrency(activeStateData?.totalBusinessValue || 0)}`
              : 'Click any state node to inspect regional network'}
          </div>
        </div>
      </div>

      {/* Main Map View & Drilldown Grid */}
      <div style={{ display: 'grid', gridTemplateColumns: 'minmax(0, 1.4fr) minmax(0, 1fr)', gap: '20px' }}>
        {/* Visual India SVG Map Container */}
        <div
          className="card"
          style={{
            position: 'relative',
            display: 'flex',
            flexDirection: 'column',
            alignItems: 'center',
            minHeight: '620px',
            background: 'linear-gradient(180deg, #ffffff 0%, #f8fafc 100%)',
            padding: '24px'
          }}
        >
          <div style={{ width: '100%', display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: '12px' }}>
            <div>
              <h3>Interactive India Client Map</h3>
              <p style={{ fontSize: '0.8rem', color: 'var(--text-muted)' }}>
                Click a state node or city pin to inspect clients and revenue metrics.
              </p>
            </div>
            {selectedState && (
              <button
                className="btn btn-secondary btn-sm"
                onClick={() => { setSelectedState(null); setSelectedClientPin(null); }}
              >
                Reset Map
              </button>
            )}
          </div>

          {/* SVG Map Layout */}
          <div style={{ position: 'relative', width: '100%', maxWidth: '580px', height: '540px' }}>
            <svg
              viewBox="0 0 700 820"
              style={{ width: '100%', height: '100%', overflow: 'visible' }}
            >
              {/* Subtle India Geographic Outline Base */}
              <g fill="#e2e8f0" stroke="#cbd5e1" strokeWidth="2" opacity="0.6">
                {/* Simplified North */}
                <path d="M280,100 L350,110 L380,160 L440,190 L400,260 L440,320 L380,380 L350,420 L270,380 L230,320 L220,240 L260,160 Z" />
                {/* Simplified Central & West */}
                <path d="M180,360 L280,350 L380,380 L420,450 L380,540 L290,560 L240,480 L180,440 Z" />
                {/* Simplified East */}
                <path d="M440,320 L580,330 L640,380 L600,440 L530,460 L450,430 L420,380 Z" />
                {/* Simplified South */}
                <path d="M290,560 L380,540 L400,620 L370,740 L340,790 L310,750 L280,660 Z" />
              </g>

              {/* State Hub Nodes and Connectors */}
              {Object.entries(indiaStateData).map(([stateName, info]) => {
                const stats = stateStats[stateName] || { clientCount: 0, totalBusinessValue: 0, totalOrders: 0 };
                const hasClients = stats.clientCount > 0;
                const isSelected = selectedState === stateName;
                const isHovered = hoveredState === stateName;

                // Node size proportional to business value
                const radius = hasClients ? Math.min(36, Math.max(22, 18 + stats.clientCount * 3)) : 16;
                const fill = isSelected
                  ? '#4f46e5'
                  : hasClients
                  ? isHovered
                    ? '#6366f1'
                    : '#3b82f6'
                  : '#cbd5e1';

                return (
                  <g
                    key={stateName}
                    transform={`translate(${info.svgX}, ${info.svgY})`}
                    style={{ cursor: 'pointer', transition: 'all 0.2s ease' }}
                    onClick={() => {
                      setSelectedState(stateName);
                      setSelectedClientPin(null);
                    }}
                    onMouseEnter={() => setHoveredState(stateName)}
                    onMouseLeave={() => setHoveredState(null)}
                  >
                    {/* Outer Glow Ring if selected or high value */}
                    {hasClients && (
                      <circle
                        r={radius + 8}
                        fill="rgba(79, 70, 229, 0.12)"
                        stroke="rgba(79, 70, 229, 0.3)"
                        strokeWidth="1"
                        strokeDasharray={isSelected ? 'none' : '3,3'}
                      />
                    )}

                    {/* Main Node Circle */}
                    <circle
                      r={radius}
                      fill={fill}
                      stroke="#ffffff"
                      strokeWidth="3"
                      filter="drop-shadow(0 2px 5px rgba(0,0,0,0.15))"
                    />

                    {/* State Code / Client Count */}
                    <text
                      textAnchor="middle"
                      dy="-2"
                      fill="#ffffff"
                      fontSize="12"
                      fontWeight="800"
                      fontFamily="var(--font-sans)"
                    >
                      {info.code}
                    </text>
                    <text
                      textAnchor="middle"
                      dy="12"
                      fill="#ffffff"
                      fontSize="10"
                      fontWeight="600"
                      fontFamily="var(--font-sans)"
                    >
                      {stats.clientCount} {stats.clientCount === 1 ? 'client' : 'clients'}
                    </text>

                    {/* State Name Label */}
                    <text
                      textAnchor="middle"
                      dy={radius + 16}
                      fill="var(--text-primary)"
                      fontSize="12"
                      fontWeight={isSelected ? '800' : '600'}
                      fontFamily="var(--font-sans)"
                    >
                      {stateName}
                    </text>
                  </g>
                );
              })}
            </svg>
          </div>
        </div>

        {/* State Drilldown & Clients List */}
        <div style={{ display: 'flex', flexDirection: 'column', gap: '16px' }}>
          {selectedState ? (
            <div className="card" style={{ flex: 1, display: 'flex', flexDirection: 'column' }}>
              <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'flex-start', paddingBottom: '14px', borderBottom: '1px solid var(--border-default)' }}>
                <div>
                  <div style={{ display: 'flex', alignItems: 'center', gap: '8px' }}>
                    <MapPin size={20} style={{ color: 'var(--primary-600)' }} />
                    <h2>{selectedState}</h2>
                  </div>
                  <p style={{ fontSize: '0.8rem', color: 'var(--text-muted)', marginTop: '2px' }}>
                    Regional Hub • {activeStateData?.cities ? Array.from(activeStateData.cities).join(', ') : 'Cities'}
                  </p>
                </div>
                <button
                  onClick={() => setSelectedState(null)}
                  className="btn btn-ghost btn-icon"
                >
                  <X size={16} />
                </button>
              </div>

              {/* State Metric Pills */}
              <div style={{ display: 'grid', gridTemplateColumns: 'repeat(3, 1fr)', gap: '10px', margin: '16px 0' }}>
                <div style={{ padding: '10px', background: 'var(--bg-subtle)', borderRadius: 'var(--radius-md)', textAlign: 'center' }}>
                  <div style={{ fontSize: '0.72rem', color: 'var(--text-muted)', fontWeight: 700 }}>CLIENTS</div>
                  <div style={{ fontSize: '1.25rem', fontWeight: 800, color: 'var(--primary-600)' }}>
                    {activeStateData?.clientCount || 0}
                  </div>
                </div>
                <div style={{ padding: '10px', background: 'var(--bg-subtle)', borderRadius: 'var(--radius-md)', textAlign: 'center' }}>
                  <div style={{ fontSize: '0.72rem', color: 'var(--text-muted)', fontWeight: 700 }}>ORDERS</div>
                  <div style={{ fontSize: '1.25rem', fontWeight: 800, color: 'var(--text-primary)' }}>
                    {activeStateData?.totalOrders || 0}
                  </div>
                </div>
                <div style={{ padding: '10px', background: 'var(--bg-subtle)', borderRadius: 'var(--radius-md)', textAlign: 'center' }}>
                  <div style={{ fontSize: '0.72rem', color: 'var(--text-muted)', fontWeight: 700 }}>VALUE</div>
                  <div style={{ fontSize: '1.05rem', fontWeight: 800, color: 'var(--success-text)' }}>
                    {formatCurrency(activeStateData?.totalBusinessValue || 0)}
                  </div>
                </div>
              </div>

              {/* Clients in this state */}
              <h4 style={{ marginBottom: '10px', fontSize: '0.88rem' }}>
                Active Clients in {selectedState} ({activeStateData?.clients.length || 0})
              </h4>

              <div style={{ flex: 1, overflowY: 'auto', display: 'flex', flexDirection: 'column', gap: '10px', maxHeight: '360px' }}>
                {activeStateData?.clients && activeStateData.clients.length > 0 ? (
                  activeStateData.clients.map((c) => (
                    <div
                      key={c.id}
                      style={{
                        padding: '12px 14px',
                        background: selectedClientPin?.id === c.id ? 'var(--primary-50)' : 'var(--bg-surface)',
                        border: `1px solid ${selectedClientPin?.id === c.id ? 'var(--primary-600)' : 'var(--border-default)'}`,
                        borderRadius: 'var(--radius-md)',
                        cursor: 'pointer'
                      }}
                      onClick={() => setSelectedClientPin(c)}
                    >
                      <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center' }}>
                        <strong style={{ fontSize: '0.9rem' }}>{c.companyName}</strong>
                        <span className="badge badge-success">{c.clientType}</span>
                      </div>
                      <div style={{ fontSize: '0.8rem', color: 'var(--text-secondary)', marginTop: '4px' }}>
                        📍 {c.city}, {c.address}
                      </div>
                      <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginTop: '8px', fontSize: '0.78rem' }}>
                        <span style={{ color: 'var(--text-muted)' }}>
                          Contact: <strong>{c.contactPerson}</strong> ({c.phone})
                        </span>
                        <strong style={{ color: 'var(--primary-600)' }}>
                          {formatCurrency(c.totalBusinessValue)}
                        </strong>
                      </div>

                      {/* WhatsApp / Call Actions */}
                      <div style={{ display: 'flex', gap: '8px', marginTop: '10px', paddingTop: '8px', borderTop: '1px solid var(--border-subtle)' }}>
                        <a
                          href={getWhatsAppUrl(c.phone, `Hello ${c.contactPerson}, reaching out from Auco & Aiwa regarding your recent orders.`)}
                          target="_blank"
                          rel="noreferrer"
                          className="btn btn-sm badge-whatsapp"
                          style={{ padding: '4px 8px', fontSize: '0.75rem', textDecoration: 'none' }}
                          onClick={(e) => e.stopPropagation()}
                        >
                          <MessageSquare size={13} /> WhatsApp
                        </a>
                        <a
                          href={`tel:${c.phone}`}
                          className="btn btn-secondary btn-sm"
                          style={{ padding: '4px 8px', fontSize: '0.75rem' }}
                          onClick={(e) => e.stopPropagation()}
                        >
                          <Phone size={13} /> Call
                        </a>
                      </div>
                    </div>
                  ))
                ) : (
                  <div style={{ padding: '24px', textAlign: 'center', color: 'var(--text-muted)' }}>
                    No clients registered in {selectedState} yet.
                  </div>
                )}
              </div>
            </div>
          ) : (
            <div className="card" style={{ flex: 1, display: 'flex', flexDirection: 'column' }}>
              <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: '14px' }}>
                <div>
                  <h3>State Network Summary</h3>
                  <p style={{ fontSize: '0.8rem', color: 'var(--text-muted)' }}>
                    High-yield business regions across India
                  </p>
                </div>
              </div>

              <div style={{ display: 'flex', flexDirection: 'column', gap: '8px', overflowY: 'auto', maxHeight: '500px' }}>
                {Object.entries(stateStats)
                  .sort((a, b) => b[1].totalBusinessValue - a[1].totalBusinessValue)
                  .map(([stateName, st]) => (
                    <div
                      key={stateName}
                      onClick={() => setSelectedState(stateName)}
                      style={{
                        padding: '12px 14px',
                        background: 'var(--bg-subtle)',
                        borderRadius: 'var(--radius-md)',
                        display: 'flex',
                        alignItems: 'center',
                        justifyContent: 'space-between',
                        cursor: 'pointer',
                        transition: 'background var(--transition-fast)'
                      }}
                      onMouseEnter={(e) => e.currentTarget.style.background = 'var(--bg-surface-hover)'}
                      onMouseLeave={(e) => e.currentTarget.style.background = 'var(--bg-subtle)'}
                    >
                      <div>
                        <div style={{ fontWeight: 700, fontSize: '0.88rem' }}>{stateName}</div>
                        <div style={{ fontSize: '0.75rem', color: 'var(--text-muted)' }}>
                          {st.clientCount} {st.clientCount === 1 ? 'client' : 'clients'} • {st.totalOrders} total orders
                        </div>
                      </div>
                      <div style={{ textAlign: 'right' }}>
                        <div style={{ fontWeight: 700, color: 'var(--primary-600)', fontSize: '0.88rem' }}>
                          {formatCurrency(st.totalBusinessValue)}
                        </div>
                        <div style={{ fontSize: '0.72rem', color: 'var(--text-muted)', display: 'flex', alignItems: 'center', gap: '4px', justifyContent: 'flex-end' }}>
                          <span>View State</span>
                          <ArrowRight size={12} />
                        </div>
                      </div>
                    </div>
                  ))}
              </div>
            </div>
          )}
        </div>
      </div>
    </div>
  );
};
