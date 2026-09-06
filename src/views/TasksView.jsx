import React, { useState } from 'react';
import { useApp } from '../context/AppContext';
import {
  CheckSquare,
  Plus,
  Search,
  Clock,
  AlertTriangle,
  CheckCircle2,
  User,
  Building2,
  Calendar,
  Trash2,
  Play,
  RotateCcw,
  Sparkles
} from 'lucide-react';
import { formatDate } from '../utils/formatters';

const PRIORITY_CONFIG = {
  Urgent: { label: 'Urgent', color: '#dc2626', bg: '#fef2f2', border: '#fca5a5' },
  High:   { label: 'High',   color: '#ea580c', bg: '#fff7ed', border: '#fdba74' },
  Medium: { label: 'Medium', color: '#d97706', bg: '#fffbeb', border: '#fde68a' },
  Low:    { label: 'Low',    color: '#64748b', bg: '#f8fafc', border: '#e2e8f0' },
};

const STATUS_CONFIG = {
  'To Do':       { label: 'To Do',       color: '#2563eb', bg: '#eff6ff', border: '#bfdbfe' },
  'In Progress': { label: 'In Progress', color: '#d97706', bg: '#fffbeb', border: '#fde68a' },
  'Completed':   { label: 'Completed',   color: '#059669', bg: '#ecfdf5', border: '#a7f3d0' },
  'Overdue':     { label: 'Overdue',     color: '#dc2626', bg: '#fef2f2', border: '#fca5a5' },
};

const TaskCard = ({ task, onUpdateStatus, onDelete }) => {
  const pCfg = PRIORITY_CONFIG[task.priority] || PRIORITY_CONFIG.Medium;
  const sCfg = STATUS_CONFIG[task.status] || STATUS_CONFIG['To Do'];
  const isDone = task.status === 'Completed';

  // Check if overdue
  const isOverdue = !isDone && task.dueDate && new Date(task.dueDate) < new Date(new Date().setHours(0, 0, 0, 0));

  return (
    <div
      style={{
        background: '#ffffff',
        borderRadius: '14px',
        border: `1.5px solid ${isDone ? '#a7f3d0' : (isOverdue ? '#fca5a5' : '#e2e8f0')}`,
        padding: '18px 20px',
        display: 'flex',
        flexDirection: 'column',
        gap: '14px',
        boxShadow: isDone ? 'none' : '0 2px 8px rgba(0,0,0,0.04)',
        opacity: isDone ? 0.85 : 1,
        transition: 'all 0.2s ease'
      }}
    >
      {/* Header Row */}
      <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'flex-start', gap: '12px' }}>
        <div style={{ flex: 1, minWidth: 0 }}>
          <div style={{ display: 'flex', alignItems: 'center', gap: '8px', flexWrap: 'wrap', marginBottom: '4px' }}>
            <span
              style={{
                fontSize: '0.72rem',
                fontWeight: 700,
                padding: '2px 8px',
                borderRadius: '6px',
                color: pCfg.color,
                background: pCfg.bg,
                border: `1px solid ${pCfg.border}`,
                display: 'inline-flex',
                alignItems: 'center',
                gap: '4px'
              }}
            >
              {task.priority === 'Urgent' && <AlertTriangle size={12} />}
              {pCfg.label}
            </span>

            {task.client && (
              <span
                style={{
                  fontSize: '0.72rem',
                  fontWeight: 600,
                  color: '#475569',
                  background: '#f1f5f9',
                  padding: '2px 8px',
                  borderRadius: '6px',
                  display: 'inline-flex',
                  alignItems: 'center',
                  gap: '4px'
                }}
              >
                <Building2 size={12} />
                {task.client}
              </span>
            )}

            {isOverdue && (
              <span
                style={{
                  fontSize: '0.7rem',
                  fontWeight: 700,
                  color: '#dc2626',
                  background: '#fee2e2',
                  padding: '2px 8px',
                  borderRadius: '6px'
                }}
              >
                ⚠ Overdue
              </span>
            )}
          </div>

          <h3
            style={{
              margin: 0,
              fontSize: '1rem',
              fontWeight: 700,
              color: isDone ? '#64748b' : '#0f172a',
              textDecoration: isDone ? 'line-through' : 'none'
            }}
          >
            {task.taskName}
          </h3>
        </div>

        <div style={{ display: 'flex', alignItems: 'center', gap: '6px' }}>
          <span
            style={{
              padding: '4px 10px',
              borderRadius: '20px',
              fontSize: '0.75rem',
              fontWeight: 700,
              color: sCfg.color,
              background: sCfg.bg,
              border: `1px solid ${sCfg.border}`
            }}
          >
            {sCfg.label}
          </span>
          <button
            onClick={() => onDelete(task)}
            title="Delete task"
            style={{
              background: 'none',
              border: 'none',
              cursor: 'pointer',
              color: '#cbd5e1',
              padding: '4px',
              borderRadius: '6px',
              display: 'flex',
              alignItems: 'center'
            }}
            onMouseEnter={(e) => (e.currentTarget.style.color = '#ef4444')}
            onMouseLeave={(e) => (e.currentTarget.style.color = '#cbd5e1')}
          >
            <Trash2 size={15} />
          </button>
        </div>
      </div>

      {/* Description */}
      {task.description && (
        <div
          style={{
            fontSize: '0.86rem',
            color: isDone ? '#94a3b8' : '#334155',
            background: '#f8fafc',
            padding: '10px 14px',
            borderRadius: '8px',
            lineHeight: 1.5,
            borderLeft: '3px solid #cbd5e1'
          }}
        >
          {task.description}
        </div>
      )}

      {/* Meta Row: Assignee & Due Date */}
      <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', flexWrap: 'wrap', gap: '10px', fontSize: '0.8rem', color: '#64748b' }}>
        <div style={{ display: 'flex', alignItems: 'center', gap: '8px' }}>
          <div
            style={{
              width: '26px',
              height: '26px',
              borderRadius: '50%',
              background: '#4f46e5',
              color: '#ffffff',
              display: 'flex',
              alignItems: 'center',
              justifyContent: 'center',
              fontWeight: 700,
              fontSize: '0.72rem'
            }}
          >
            {task.assignedPerson?.charAt(0) || 'U'}
          </div>
          <div>
            <span style={{ fontWeight: 600, color: '#1e293b' }}>{task.assignedPerson}</span>
            {task.createdBy && (
              <span style={{ fontSize: '0.72rem', color: '#94a3b8', marginLeft: '6px' }}>
                (by {task.createdBy})
              </span>
            )}
          </div>
        </div>

        <div style={{ display: 'flex', alignItems: 'center', gap: '5px', fontWeight: 600, color: isOverdue ? '#dc2626' : '#64748b' }}>
          <Calendar size={14} />
          <span>Due: {formatDate(task.dueDate)}</span>
        </div>
      </div>

      {/* Bottom 1-Click Action Bar */}
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
        {/* Quick status cycle buttons */}
        <div style={{ display: 'flex', gap: '6px', flexWrap: 'wrap' }}>
          {['To Do', 'In Progress', 'Completed'].map((st) => (
            <button
              key={st}
              onClick={() => onUpdateStatus(task.id, st)}
              style={{
                fontSize: '0.75rem',
                fontWeight: task.status === st ? 700 : 500,
                padding: '5px 12px',
                borderRadius: '8px',
                border: task.status === st ? `1.5px solid ${STATUS_CONFIG[st].border}` : '1px solid #e2e8f0',
                background: task.status === st ? STATUS_CONFIG[st].bg : '#ffffff',
                color: task.status === st ? STATUS_CONFIG[st].color : '#64748b',
                cursor: 'pointer',
                transition: 'all 0.15s'
              }}
            >
              {st === 'To Do' && '📋 To Do'}
              {st === 'In Progress' && '⏳ In Progress'}
              {st === 'Completed' && '✓ Completed'}
            </button>
          ))}
        </div>

        {/* Primary next action button */}
        {!isDone ? (
          task.status === 'To Do' ? (
            <button
              onClick={() => onUpdateStatus(task.id, 'In Progress')}
              style={{
                display: 'flex',
                alignItems: 'center',
                gap: '6px',
                padding: '7px 14px',
                borderRadius: '8px',
                border: 'none',
                background: '#2563eb',
                color: '#ffffff',
                fontWeight: 700,
                fontSize: '0.8rem',
                cursor: 'pointer',
                boxShadow: '0 2px 4px rgba(37,99,235,0.2)'
              }}
            >
              <Play size={13} /> Start Task
            </button>
          ) : (
            <button
              onClick={() => onUpdateStatus(task.id, 'Completed')}
              style={{
                display: 'flex',
                alignItems: 'center',
                gap: '6px',
                padding: '7px 14px',
                borderRadius: '8px',
                border: 'none',
                background: '#059669',
                color: '#ffffff',
                fontWeight: 700,
                fontSize: '0.8rem',
                cursor: 'pointer',
                boxShadow: '0 2px 4px rgba(5,150,105,0.2)'
              }}
            >
              <CheckCircle2 size={14} /> Complete Task
            </button>
          )
        ) : (
          <button
            onClick={() => onUpdateStatus(task.id, 'To Do')}
            style={{
              display: 'flex',
              alignItems: 'center',
              gap: '6px',
              padding: '6px 12px',
              borderRadius: '8px',
              border: '1px solid #e2e8f0',
              background: '#f8fafc',
              color: '#64748b',
              fontWeight: 600,
              fontSize: '0.75rem',
              cursor: 'pointer'
            }}
          >
            <RotateCcw size={12} /> Re-open Task
          </button>
        )}
      </div>
    </div>
  );
};

export const TasksView = ({ onOpenTaskModal }) => {
  const { tasks, updateTask, deleteTask, matchesCompany } = useApp();
  const [searchQuery, setSearchQuery] = useState('');
  const [activeTab, setActiveTab] = useState('ALL'); // 'ALL' | 'To Do' | 'In Progress' | 'Completed' | 'Urgent'
  const [assigneeFilter, setAssigneeFilter] = useState('ALL');

  // Scoped tasks by active company
  const scopedTasks = tasks.filter(matchesCompany);

  // Aggregates
  const todoCount = scopedTasks.filter((t) => t.status === 'To Do').length;
  const inProgressCount = scopedTasks.filter((t) => t.status === 'In Progress').length;
  const completedCount = scopedTasks.filter((t) => t.status === 'Completed').length;
  const urgentCount = scopedTasks.filter((t) => t.priority === 'Urgent' && t.status !== 'Completed').length;

  const assignees = Array.from(new Set(scopedTasks.map((t) => t.assignedPerson).filter(Boolean)));

  // Filter tasks
  const filteredTasks = scopedTasks.filter((t) => {
    const matchesSearch =
      t.taskName.toLowerCase().includes(searchQuery.toLowerCase()) ||
      (t.description && t.description.toLowerCase().includes(searchQuery.toLowerCase())) ||
      (t.client && t.client.toLowerCase().includes(searchQuery.toLowerCase())) ||
      (t.assignedPerson && t.assignedPerson.toLowerCase().includes(searchQuery.toLowerCase()));

    const matchesAssignee = assigneeFilter === 'ALL' || t.assignedPerson === assigneeFilter;

    let matchesTab = true;
    if (activeTab === 'To Do') matchesTab = t.status === 'To Do';
    else if (activeTab === 'In Progress') matchesTab = t.status === 'In Progress';
    else if (activeTab === 'Completed') matchesTab = t.status === 'Completed';
    else if (activeTab === 'Urgent') matchesTab = t.priority === 'Urgent' && t.status !== 'Completed';

    return matchesSearch && matchesAssignee && matchesTab;
  });

  const handleDeleteTask = (task) => {
    if (window.confirm(`Delete task "${task.taskName}"?`)) {
      deleteTask(task.id);
    }
  };

  const handleUpdateStatus = (taskId, newStatus) => {
    updateTask(taskId, { status: newStatus });
  };

  return (
    <div style={{ display: 'flex', flexDirection: 'column', gap: '20px' }}>
      {/* Header */}
      <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', flexWrap: 'wrap', gap: '12px' }}>
        <div>
          <h2 style={{ fontSize: '1.4rem', fontWeight: 800, margin: '0 0 4px 0', color: '#0f172a' }}>
            Assigned Tasks
          </h2>
          <p style={{ fontSize: '0.85rem', color: '#64748b', margin: 0 }}>
            Simple task checklist for staff and operations
          </p>
        </div>
        <button
          onClick={onOpenTaskModal}
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
          <Plus size={16} /> Assign New Task
        </button>
      </div>

      {/* 4 Clickable Filter Metric Cards */}
      <div
        style={{
          display: 'grid',
          gridTemplateColumns: 'repeat(auto-fit, minmax(190px, 1fr))',
          gap: '12px'
        }}
      >
        <div
          onClick={() => setActiveTab('ALL')}
          style={{
            background: '#ffffff',
            padding: '16px 18px',
            borderRadius: '14px',
            border: activeTab === 'ALL' ? '2px solid #2563eb' : '1px solid #e2e8f0',
            cursor: 'pointer',
            boxShadow: activeTab === 'ALL' ? '0 4px 12px rgba(37,99,235,0.12)' : '0 2px 6px rgba(0,0,0,0.03)',
            transition: 'all 0.15s'
          }}
        >
          <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: '8px' }}>
            <span style={{ fontSize: '0.8rem', fontWeight: 700, color: '#64748b' }}>TOTAL TASKS</span>
            <CheckSquare size={18} color="#2563eb" />
          </div>
          <div style={{ fontSize: '1.6rem', fontWeight: 800, color: '#0f172a' }}>{scopedTasks.length}</div>
          <div style={{ fontSize: '0.75rem', color: '#94a3b8', marginTop: '4px' }}>All assigned items</div>
        </div>

        <div
          onClick={() => setActiveTab('To Do')}
          style={{
            background: '#ffffff',
            padding: '16px 18px',
            borderRadius: '14px',
            border: activeTab === 'To Do' ? '2px solid #2563eb' : '1px solid #e2e8f0',
            cursor: 'pointer',
            boxShadow: activeTab === 'To Do' ? '0 4px 12px rgba(37,99,235,0.12)' : '0 2px 6px rgba(0,0,0,0.03)',
            transition: 'all 0.15s'
          }}
        >
          <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: '8px' }}>
            <span style={{ fontSize: '0.8rem', fontWeight: 700, color: '#2563eb' }}>TO DO</span>
            <Clock size={18} color="#2563eb" />
          </div>
          <div style={{ fontSize: '1.6rem', fontWeight: 800, color: '#2563eb' }}>{todoCount}</div>
          <div style={{ fontSize: '0.75rem', color: '#94a3b8', marginTop: '4px' }}>Waiting to start</div>
        </div>

        <div
          onClick={() => setActiveTab('In Progress')}
          style={{
            background: '#ffffff',
            padding: '16px 18px',
            borderRadius: '14px',
            border: activeTab === 'In Progress' ? '2px solid #d97706' : '1px solid #e2e8f0',
            cursor: 'pointer',
            boxShadow: activeTab === 'In Progress' ? '0 4px 12px rgba(217,119,6,0.12)' : '0 2px 6px rgba(0,0,0,0.03)',
            transition: 'all 0.15s'
          }}
        >
          <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: '8px' }}>
            <span style={{ fontSize: '0.8rem', fontWeight: 700, color: '#d97706' }}>IN PROGRESS</span>
            <Play size={18} color="#d97706" />
          </div>
          <div style={{ fontSize: '1.6rem', fontWeight: 800, color: '#d97706' }}>{inProgressCount}</div>
          <div style={{ fontSize: '0.75rem', color: '#94a3b8', marginTop: '4px' }}>Currently executing</div>
        </div>

        <div
          onClick={() => setActiveTab('Completed')}
          style={{
            background: '#ffffff',
            padding: '16px 18px',
            borderRadius: '14px',
            border: activeTab === 'Completed' ? '2px solid #059669' : '1px solid #e2e8f0',
            cursor: 'pointer',
            boxShadow: activeTab === 'Completed' ? '0 4px 12px rgba(5,150,105,0.12)' : '0 2px 6px rgba(0,0,0,0.03)',
            transition: 'all 0.15s'
          }}
        >
          <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: '8px' }}>
            <span style={{ fontSize: '0.8rem', fontWeight: 700, color: '#059669' }}>COMPLETED</span>
            <CheckCircle2 size={18} color="#059669" />
          </div>
          <div style={{ fontSize: '1.6rem', fontWeight: 800, color: '#059669' }}>{completedCount}</div>
          <div style={{ fontSize: '0.75rem', color: '#94a3b8', marginTop: '4px' }}>Done & closed</div>
        </div>

        {urgentCount > 0 && (
          <div
            onClick={() => setActiveTab('Urgent')}
            style={{
              background: '#fef2f2',
              padding: '16px 18px',
              borderRadius: '14px',
              border: activeTab === 'Urgent' ? '2px solid #dc2626' : '1px solid #fecaca',
              cursor: 'pointer',
              boxShadow: activeTab === 'Urgent' ? '0 4px 12px rgba(220,38,38,0.15)' : '0 2px 6px rgba(0,0,0,0.03)',
              transition: 'all 0.15s'
            }}
          >
            <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: '8px' }}>
              <span style={{ fontSize: '0.8rem', fontWeight: 700, color: '#dc2626' }}>URGENT</span>
              <AlertTriangle size={18} color="#dc2626" />
            </div>
            <div style={{ fontSize: '1.6rem', fontWeight: 800, color: '#dc2626' }}>{urgentCount}</div>
            <div style={{ fontSize: '0.75rem', color: '#ef4444', marginTop: '4px' }}>High priority items</div>
          </div>
        )}
      </div>

      {/* Search & Team Filter Bar */}
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
            placeholder="Search task by title, client, or assignee..."
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

        {assignees.length > 0 && (
          <div style={{ display: 'flex', alignItems: 'center', gap: '8px' }}>
            <span style={{ fontSize: '0.82rem', fontWeight: 600, color: '#64748b' }}>Team Member:</span>
            <select
              value={assigneeFilter}
              onChange={(e) => setAssigneeFilter(e.target.value)}
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
              <option value="ALL">All Staff ({scopedTasks.length})</option>
              {assignees.map((a) => (
                <option key={a} value={a}>{a}</option>
              ))}
            </select>
          </div>
        )}
      </div>

      {/* Task Cards Grid */}
      <div
        style={{
          display: 'grid',
          gridTemplateColumns: 'repeat(auto-fill, minmax(360px, 1fr))',
          gap: '16px'
        }}
      >
        {filteredTasks.map((task) => (
          <TaskCard
            key={task.id}
            task={task}
            onUpdateStatus={handleUpdateStatus}
            onDelete={handleDeleteTask}
          />
        ))}

        {filteredTasks.length === 0 && (
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
            <CheckSquare size={42} style={{ margin: '0 auto 12px', opacity: 0.35, color: '#4f46e5' }} />
            <h3 style={{ margin: '0 0 6px 0', fontSize: '1.1rem', color: '#334155', fontWeight: 700 }}>
              No tasks found
            </h3>
            <p style={{ margin: 0, fontSize: '0.85rem' }}>
              {activeTab !== 'ALL'
                ? `There are currently no tasks with "${activeTab}" status.`
                : 'All caught up! Click "Assign New Task" above to add one.'}
            </p>
          </div>
        )}
      </div>
    </div>
  );
};
