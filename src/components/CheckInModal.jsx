import React, { useState, useEffect } from 'react';
import { useApp } from '../context/AppContext';
import {
  Clock,
  CheckCircle2,
  LogOut,
  LogIn,
  MapPin,
  Building2,
  Briefcase,
  Home,
  FileText,
  X,
  Sparkles,
  Timer
} from 'lucide-react';

export const CheckInModal = ({ isOpen, onClose }) => {
  const { currentUser, currentRole, attendance, checkIn, checkOut } = useApp();

  const today = new Date().toISOString().split('T')[0];
  const userTodayAttendance = attendance.find(
    (a) => a.userId === currentUser?.id && a.date === today && a.status === 'Checked In'
  );
  const isCheckedIn = !!userTodayAttendance;

  const [workMode, setWorkMode] = useState('Office HQ (Pune)');
  const [location, setLocation] = useState('Auco Automation HQ, Pune');
  const [notes, setNotes] = useState('');
  const [currentTime, setCurrentTime] = useState(new Date());

  // Clock ticker
  useEffect(() => {
    const timer = setInterval(() => setCurrentTime(new Date()), 1000);
    return () => clearInterval(timer);
  }, []);

  if (!isOpen) return null;

  const handleCheckInSubmit = async (e) => {
    e.preventDefault();
    await checkIn(workMode, location, notes);
    onClose();
  };

  const handleCheckOutSubmit = async (e) => {
    e.preventDefault();
    await checkOut(notes);
    onClose();
  };

  return (
    <div className="modal-backdrop" onClick={onClose}>
      <div
        className="modal-content"
        style={{ maxWidth: '520px' }}
        onClick={(e) => e.stopPropagation()}
      >
        {/* Header */}
        <div className="modal-header">
          <div style={{ display: 'flex', alignItems: 'center', gap: '10px' }}>
            <div
              style={{
                width: '38px',
                height: '38px',
                borderRadius: '10px',
                background: isCheckedIn
                  ? 'linear-gradient(135deg, #10b981 0%, #047857 100%)'
                  : 'linear-gradient(135deg, #4f46e5 0%, #312e81 100%)',
                display: 'flex',
                alignItems: 'center',
                justifyContent: 'center',
                color: '#fff',
                boxShadow: '0 4px 12px rgba(0,0,0,0.1)'
              }}
            >
              {isCheckedIn ? <Clock size={20} /> : <LogIn size={20} />}
            </div>
            <div>
              <h3 style={{ margin: 0, fontSize: '1.05rem' }}>
                {isCheckedIn ? 'Staff Shift on Duty' : 'Staff Shift Check-In'}
              </h3>
              <p style={{ fontSize: '0.76rem', color: 'var(--text-muted)', margin: 0 }}>
                {currentUser?.name} ({currentUser?.department} • {currentRole})
              </p>
            </div>
          </div>

          <button type="button" className="btn btn-ghost btn-icon" onClick={onClose}>
            <X size={18} />
          </button>
        </div>

        {/* Live Digital Clock Banner */}
        <div
          style={{
            background: 'linear-gradient(135deg, #0f172a 0%, #1e1b4b 100%)',
            color: '#ffffff',
            padding: '16px 20px',
            margin: '14px 16px 0 16px',
            borderRadius: 'var(--radius-md)',
            display: 'flex',
            alignItems: 'center',
            justifyContent: 'space-between',
            boxShadow: '0 4px 14px rgba(15, 23, 42, 0.25)'
          }}
        >
          <div>
            <div style={{ fontSize: '0.72rem', color: 'rgba(255,255,255,0.7)', textTransform: 'uppercase', letterSpacing: '0.05em' }}>
              Current Official Time
            </div>
            <div style={{ fontSize: '1.4rem', fontWeight: 800, fontFamily: 'monospace', letterSpacing: '-0.02em', marginTop: '2px' }}>
              {currentTime.toLocaleTimeString([], { hour: '2-digit', minute: '2-digit', second: '2-digit' })}
            </div>
            <div style={{ fontSize: '0.75rem', color: 'rgba(255,255,255,0.8)' }}>
              {currentTime.toLocaleDateString([], { weekday: 'long', month: 'short', day: 'numeric', year: 'numeric' })}
            </div>
          </div>

          <div style={{ textAlign: 'right' }}>
            <span
              style={{
                background: isCheckedIn ? '#10b981' : 'rgba(255,255,255,0.15)',
                color: '#fff',
                padding: '4px 10px',
                borderRadius: '20px',
                fontSize: '0.75rem',
                fontWeight: 700,
                display: 'inline-flex',
                alignItems: 'center',
                gap: '5px'
              }}
            >
              <span style={{ width: '7px', height: '7px', borderRadius: '50%', background: '#fff', display: 'inline-block' }} />
              {isCheckedIn ? 'ON DUTY' : 'NOT CLOCKED IN'}
            </span>
            {isCheckedIn && (
              <div style={{ fontSize: '0.72rem', color: 'rgba(255,255,255,0.7)', marginTop: '4px' }}>
                Since {userTodayAttendance.checkInTime}
              </div>
            )}
          </div>
        </div>

        {/* Modal Form */}
        {!isCheckedIn ? (
          /* CHECK-IN FORM */
          <form onSubmit={handleCheckInSubmit}>
            <div className="modal-body" style={{ display: 'flex', flexDirection: 'column', gap: '14px', paddingTop: '16px' }}>
              <div>
                <label className="form-label" style={{ fontWeight: 700 }}>
                  Select Work Mode *
                </label>
                <div style={{ display: 'grid', gridTemplateColumns: 'repeat(3, 1fr)', gap: '8px' }}>
                  {[
                    { id: 'Office HQ (Pune)', label: 'Office HQ', icon: Building2 },
                    { id: 'Field Client Visit', label: 'Field Visit', icon: Briefcase },
                    { id: 'Remote / Branch', label: 'Remote / WFH', icon: Home }
                  ].map((mode) => {
                    const Icon = mode.icon;
                    const isSel = workMode === mode.id;
                    return (
                      <button
                        key={mode.id}
                        type="button"
                        onClick={() => {
                          setWorkMode(mode.id);
                          if (mode.id.includes('Office')) setLocation('Auco Automation HQ, Pune');
                          else if (mode.id.includes('Field')) setLocation('Client On-Site Visit');
                          else setLocation('Remote Office');
                        }}
                        style={{
                          padding: '12px 8px',
                          border: isSel ? '2px solid var(--primary-600)' : '1px solid var(--border-default)',
                          borderRadius: 'var(--radius-md)',
                          background: isSel ? 'var(--primary-50)' : 'var(--bg-subtle)',
                          color: isSel ? 'var(--primary-700)' : 'var(--text-secondary)',
                          cursor: 'pointer',
                          display: 'flex',
                          flexDirection: 'column',
                          alignItems: 'center',
                          gap: '6px',
                          fontWeight: isSel ? 700 : 500,
                          fontSize: '0.78rem',
                          transition: 'all 0.15s ease'
                        }}
                      >
                        <Icon size={18} />
                        <span>{mode.label}</span>
                      </button>
                    );
                  })}
                </div>
              </div>

              <div className="form-group">
                <label className="form-label">Work / Field Location *</label>
                <div style={{ position: 'relative' }}>
                  <MapPin size={15} style={{ position: 'absolute', left: '10px', top: '50%', transform: 'translateY(-50%)', color: 'var(--text-muted)' }} />
                  <input
                    type="text"
                    required
                    className="form-input"
                    value={location}
                    onChange={(e) => setLocation(e.target.value)}
                    style={{ paddingLeft: '32px' }}
                    placeholder="e.g. Pune HQ / Client Site / MIDC Bhosari"
                  />
                </div>
              </div>

              <div className="form-group">
                <label className="form-label">Shift Objectives & Plan (Optional)</label>
                <textarea
                  rows={2}
                  className="form-input"
                  value={notes}
                  onChange={(e) => setNotes(e.target.value)}
                  placeholder="e.g. Client demos scheduled with Deccan Automations; follow up on overdue invoices."
                  style={{ resize: 'vertical' }}
                />
              </div>
            </div>

            <div className="modal-footer">
              <button type="button" className="btn btn-secondary" onClick={onClose}>
                Cancel
              </button>
              <button
                type="submit"
                className="btn btn-primary"
                style={{ background: '#10b981', borderColor: '#10b981', display: 'flex', alignItems: 'center', gap: '6px' }}
              >
                <LogIn size={15} /> Clock In & Start Shift
              </button>
            </div>
          </form>
        ) : (
          /* CHECK-OUT FORM */
          <form onSubmit={handleCheckOutSubmit}>
            <div className="modal-body" style={{ display: 'flex', flexDirection: 'column', gap: '14px', paddingTop: '16px' }}>
              <div
                style={{
                  background: '#f8fafc',
                  border: '1px solid var(--border-default)',
                  borderRadius: 'var(--radius-md)',
                  padding: '12px 16px',
                  fontSize: '0.82rem'
                }}
              >
                <div style={{ display: 'flex', justifyContent: 'space-between', marginBottom: '6px' }}>
                  <span style={{ color: 'var(--text-muted)' }}>Work Mode:</span>
                  <strong>{userTodayAttendance.workMode}</strong>
                </div>
                <div style={{ display: 'flex', justifyContent: 'space-between', marginBottom: '6px' }}>
                  <span style={{ color: 'var(--text-muted)' }}>Location:</span>
                  <strong>{userTodayAttendance.location}</strong>
                </div>
                <div style={{ display: 'flex', justifyContent: 'space-between' }}>
                  <span style={{ color: 'var(--text-muted)' }}>Clocked In Time:</span>
                  <strong style={{ color: 'var(--primary-600)' }}>{userTodayAttendance.checkInTime}</strong>
                </div>
              </div>

              <div className="form-group">
                <label className="form-label" style={{ fontWeight: 700 }}>
                  End of Day Work Summary / Achievements *
                </label>
                <textarea
                  required
                  rows={3}
                  className="form-input"
                  value={notes}
                  onChange={(e) => setNotes(e.target.value)}
                  placeholder="e.g. Conducted 4 prospect demonstrations, collected ₹1,20,000 payment from Mehta Precision, dispatched 2 hardware parcels."
                  style={{ resize: 'vertical' }}
                />
              </div>
            </div>

            <div className="modal-footer">
              <button type="button" className="btn btn-secondary" onClick={onClose}>
                Keep Shift Active
              </button>
              <button
                type="submit"
                className="btn btn-primary"
                style={{ background: '#ef4444', borderColor: '#ef4444', display: 'flex', alignItems: 'center', gap: '6px' }}
              >
                <LogOut size={15} /> Clock Out & Conclude Day
              </button>
            </div>
          </form>
        )}
      </div>
    </div>
  );
};
