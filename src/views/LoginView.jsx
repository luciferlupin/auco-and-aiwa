import React, { useState } from 'react';
import { useApp } from '../context/AppContext';
import {
  Layers,
  ShieldCheck,
  TrendingUp,
  CreditCard,
  Wrench,
  Lock,
  Mail,
  ArrowRight,
  Sparkles,
  CheckCircle2,
  Database,
  Fingerprint
} from 'lucide-react';

export const LoginView = () => {
  const { login, quickLogin, users, isCloudSynced } = useApp();
  const [email, setEmail] = useState('shrey.taneja@auco-automation.com');
  const [password, setPassword] = useState('••••••••••••');
  const [activeTab, setActiveTab] = useState('quick'); // 'quick' | 'credentials'

  const roleProfiles = [
    {
      user: users.find(u => u.name === 'Shrey Taneja') || users[0],
      role: 'Shrey Taneja (Auco MD)',
      tag: 'Auco Automation Full Command',
      icon: ShieldCheck,
      color: '#4f46e5',
      gradient: 'linear-gradient(135deg, #4f46e5 0%, #312e81 100%)'
    },
    {
      user: users.find(u => u.name === 'Divyansh Taneja') || users[1] || users[0],
      role: 'Divyansh Taneja (Aiwa MD)',
      tag: 'Aiwa Commercial AV Full Command',
      icon: ShieldCheck,
      color: '#7c3aed',
      gradient: 'linear-gradient(135deg, #7c3aed 0%, #4c1d95 100%)'
    },
    {
      user: users.find(u => u.role === 'Sales') || users[2],
      role: 'Sales Account',
      tag: 'Pipeline, Leads & Won Deals',
      icon: TrendingUp,
      color: '#10b981',
      gradient: 'linear-gradient(135deg, #10b981 0%, #065f46 100%)'
    },
    {
      user: users.find(u => u.role === 'Accounts') || users[4],
      role: 'Accounts & Finance',
      tag: 'Billing, Invoices & Collections',
      icon: CreditCard,
      color: '#f59e0b',
      gradient: 'linear-gradient(135deg, #f59e0b 0%, #92400e 100%)'
    },
    {
      user: users.find(u => u.role === 'Services') || users[5],
      role: 'Services & Operations',
      tag: 'Field Delivery & Commissioning',
      icon: Wrench,
      color: '#0284c7',
      gradient: 'linear-gradient(135deg, #0284c7 0%, #0369a1 100%)'
    }
  ];

  const handleManualSubmit = (e) => {
    e.preventDefault();
    login(email, password);
  };

  return (
    <div
      style={{
        minHeight: '100vh',
        width: '100%',
        background: 'radial-gradient(ellipse at 50% 0%, #1e1b4b 0%, #0f172a 60%, #020617 100%)',
        display: 'flex',
        alignItems: 'center',
        justifyContent: 'center',
        padding: '24px 16px',
        position: 'relative',
        overflow: 'hidden'
      }}
    >
      {/* Apple-style background ambient orbs */}
      <div
        style={{
          position: 'absolute',
          top: '-15%',
          left: '20%',
          width: '500px',
          height: '500px',
          background: 'radial-gradient(circle, rgba(99, 102, 241, 0.15) 0%, rgba(99, 102, 241, 0) 70%)',
          filter: 'blur(60px)',
          pointerEvents: 'none'
        }}
      />
      <div
        style={{
          position: 'absolute',
          bottom: '-10%',
          right: '20%',
          width: '450px',
          height: '450px',
          background: 'radial-gradient(circle, rgba(16, 185, 129, 0.12) 0%, rgba(16, 185, 129, 0) 70%)',
          filter: 'blur(60px)',
          pointerEvents: 'none'
        }}
      />

      {/* Main Apple Frosted Glass Login Container */}
      <div
        style={{
          width: '100%',
          maxWidth: '520px',
          background: 'rgba(255, 255, 255, 0.95)',
          backdropFilter: 'blur(30px)',
          WebkitBackdropFilter: 'blur(30px)',
          borderRadius: '24px',
          border: '1px solid rgba(255, 255, 255, 0.4)',
          boxShadow: '0 25px 50px -12px rgba(0, 0, 0, 0.35), 0 0 0 1px rgba(255, 255, 255, 0.2)',
          padding: '36px 32px',
          display: 'flex',
          flexDirection: 'column',
          position: 'relative',
          zIndex: 10
        }}
      >
        {/* Brand Header */}
        <div style={{ textAlign: 'center', marginBottom: '24px' }}>
          <div
            style={{
              width: '54px',
              height: '54px',
              borderRadius: '16px',
              background: 'linear-gradient(135deg, #4f46e5 0%, #312e81 100%)',
              color: '#ffffff',
              display: 'inline-flex',
              alignItems: 'center',
              justifyContent: 'center',
              boxShadow: '0 8px 20px rgba(79, 70, 229, 0.3)',
              marginBottom: '12px'
            }}
          >
            <Layers size={28} />
          </div>

          <h1
            style={{
              fontSize: '1.65rem',
              fontWeight: 800,
              letterSpacing: '-0.03em',
              color: '#0f172a',
              margin: 0
            }}
          >
            AUCO & AIWA PORTAL
          </h1>
          <p
            style={{
              fontSize: '0.85rem',
              color: '#64748b',
              marginTop: '4px',
              fontWeight: 500
            }}
          >
            Dual-Brand Operations Portal for Auco Automation & Aiwa India
          </p>

          {/* Supabase status badge */}
          <div style={{ display: 'inline-flex', alignItems: 'center', gap: '6px', background: '#f1f5f9', padding: '4px 10px', borderRadius: '9999px', fontSize: '0.72rem', color: '#475569', marginTop: '10px', fontWeight: 600 }}>
            <span style={{ width: '7px', height: '7px', borderRadius: '50%', backgroundColor: '#10b981' }} />
            <span>Dual-Brand Workspace • Supabase Cloud Connected</span>
          </div>
        </div>

        {/* Tab Switcher (Apple Segments) */}
        <div
          style={{
            display: 'flex',
            background: '#f1f5f9',
            padding: '4px',
            borderRadius: '12px',
            marginBottom: '20px'
          }}
        >
          <button
            type="button"
            onClick={() => setActiveTab('quick')}
            style={{
              flex: 1,
              padding: '8px 12px',
              border: 'none',
              borderRadius: '9px',
              background: activeTab === 'quick' ? '#ffffff' : 'transparent',
              color: activeTab === 'quick' ? '#0f172a' : '#64748b',
              fontWeight: activeTab === 'quick' ? 700 : 500,
              fontSize: '0.84rem',
              cursor: 'pointer',
              boxShadow: activeTab === 'quick' ? '0 1px 3px rgba(0,0,0,0.08)' : 'none',
              transition: 'all 0.15s ease',
              display: 'flex',
              alignItems: 'center',
              justifyContent: 'center',
              gap: '6px'
            }}
          >
            <Fingerprint size={15} /> 1-Click Role Login
          </button>
          <button
            type="button"
            onClick={() => setActiveTab('credentials')}
            style={{
              flex: 1,
              padding: '8px 12px',
              border: 'none',
              borderRadius: '9px',
              background: activeTab === 'credentials' ? '#ffffff' : 'transparent',
              color: activeTab === 'credentials' ? '#0f172a' : '#64748b',
              fontWeight: activeTab === 'credentials' ? 700 : 500,
              fontSize: '0.84rem',
              cursor: 'pointer',
              boxShadow: activeTab === 'credentials' ? '0 1px 3px rgba(0,0,0,0.08)' : 'none',
              transition: 'all 0.15s ease',
              display: 'flex',
              alignItems: 'center',
              justifyContent: 'center',
              gap: '6px'
            }}
          >
            <Lock size={15} /> Email / Passkey
          </button>
        </div>

        {/* TAB 1: 1-CLICK ROLE ACCESS */}
        {activeTab === 'quick' && (
          <div style={{ display: 'flex', flexDirection: 'column', gap: '10px' }}>
            <div style={{ fontSize: '0.76rem', color: '#64748b', fontWeight: 600, textTransform: 'uppercase', letterSpacing: '0.04em', marginBottom: '2px' }}>
              Select Staff Profile to Begin Session:
            </div>

            {roleProfiles.map((item) => {
              const Icon = item.icon;
              return (
                <button
                  key={item.role}
                  type="button"
                  onClick={() => quickLogin(item.user)}
                  style={{
                    display: 'flex',
                    alignItems: 'center',
                    justifyContent: 'space-between',
                    padding: '12px 14px',
                    background: '#ffffff',
                    border: '1px solid #e2e8f0',
                    borderRadius: '14px',
                    cursor: 'pointer',
                    transition: 'all 0.15s ease',
                    textAlign: 'left',
                    boxShadow: '0 1px 2px rgba(0,0,0,0.04)'
                  }}
                  onMouseEnter={(e) => {
                    e.currentTarget.style.borderColor = item.color;
                    e.currentTarget.style.transform = 'translateY(-1px)';
                    e.currentTarget.style.boxShadow = '0 6px 16px rgba(0,0,0,0.08)';
                  }}
                  onMouseLeave={(e) => {
                    e.currentTarget.style.borderColor = '#e2e8f0';
                    e.currentTarget.style.transform = 'translateY(0)';
                    e.currentTarget.style.boxShadow = '0 1px 2px rgba(0,0,0,0.04)';
                  }}
                >
                  <div style={{ display: 'flex', alignItems: 'center', gap: '12px' }}>
                    <div
                      style={{
                        width: '38px',
                        height: '38px',
                        borderRadius: '10px',
                        background: item.gradient,
                        color: '#ffffff',
                        display: 'flex',
                        alignItems: 'center',
                        justifyContent: 'center',
                        flexShrink: 0
                      }}
                    >
                      <Icon size={18} />
                    </div>
                    <div>
                      <div style={{ fontWeight: 700, fontSize: '0.88rem', color: '#0f172a' }}>
                        {item.user.name}
                      </div>
                      <div style={{ fontSize: '0.74rem', color: '#64748b', marginTop: '1px' }}>
                        {item.role} • {item.tag}
                      </div>
                    </div>
                  </div>

                  <div style={{ display: 'flex', alignItems: 'center', gap: '4px', color: item.color, fontWeight: 700, fontSize: '0.78rem' }}>
                    <span>Launch</span>
                    <ArrowRight size={14} />
                  </div>
                </button>
              );
            })}
          </div>
        )}

        {/* TAB 2: MANUAL EMAIL & PASSWORD */}
        {activeTab === 'credentials' && (
          <form onSubmit={handleManualSubmit} style={{ display: 'flex', flexDirection: 'column', gap: '14px' }}>
            <div className="form-group" style={{ margin: 0 }}>
              <label className="form-label" style={{ color: '#334155' }}>Corporate Email ID</label>
              <div style={{ position: 'relative' }}>
                <Mail size={16} style={{ position: 'absolute', left: '12px', top: '50%', transform: 'translateY(-50%)', color: '#94a3b8' }} />
                <input
                  type="email"
                  required
                  className="form-input"
                  style={{ paddingLeft: '38px', borderRadius: '12px', height: '42px' }}
                  placeholder="e.g. shrey.taneja@auco-automation.com"
                  value={email}
                  onChange={(e) => setEmail(e.target.value)}
                />
              </div>
            </div>

            <div className="form-group" style={{ margin: 0 }}>
              <label className="form-label" style={{ color: '#334155' }}>Security Passkey / Password</label>
              <div style={{ position: 'relative' }}>
                <Lock size={16} style={{ position: 'absolute', left: '12px', top: '50%', transform: 'translateY(-50%)', color: '#94a3b8' }} />
                <input
                  type="password"
                  required
                  className="form-input"
                  style={{ paddingLeft: '38px', borderRadius: '12px', height: '42px' }}
                  placeholder="••••••••••••"
                  value={password}
                  onChange={(e) => setPassword(e.target.value)}
                />
              </div>
            </div>

            <button
              type="submit"
              className="btn btn-primary btn-lg"
              style={{
                borderRadius: '12px',
                height: '44px',
                marginTop: '6px',
                background: 'linear-gradient(135deg, #4f46e5 0%, #4338ca 100%)',
                boxShadow: '0 4px 14px rgba(79, 70, 229, 0.35)',
                fontWeight: 700
              }}
            >
              Sign In to Operations Console <ArrowRight size={16} />
            </button>
          </form>
        )}

        {/* Footer */}
        <div
          style={{
            marginTop: '24px',
            paddingTop: '16px',
            borderTop: '1px solid #f1f5f9',
            display: 'flex',
            alignItems: 'center',
            justifyContent: 'space-between',
            fontSize: '0.72rem',
            color: '#94a3b8'
          }}
        >
          <span>Auco & Aiwa India • Private Internal Core</span>
          <span>Role-Gated Security</span>
        </div>
      </div>
    </div>
  );
};
