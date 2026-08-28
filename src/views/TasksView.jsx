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
  Filter,
  MessageSquare,
  Trash2
} from 'lucide-react';
import { formatDate, getStatusBadgeClass } from '../utils/formatters';

export const TasksView = ({ onOpenTaskModal }) => {
  const { tasks, updateTask, deleteTask, currentRole, currentUser, selectedCompany, companyBrands, matchesCompany } = useApp();
  const [searchQuery, setSearchQuery] = useState('');
  const [statusFilter, setStatusFilter] = useState('ALL');
  const [priorityFilter, setPriorityFilter] = useState('ALL');
  const [assigneeFilter, setAssigneeFilter] = useState('ALL');

  // Scoped tasks by company
  const scopedTasks = tasks.filter(matchesCompany);

  // Unique assignees from scoped tasks
  const assignees = Array.from(new Set(scopedTasks.map((t) => t.assignedPerson).filter(Boolean)));

  // Filter tasks
  const filteredTasks = scopedTasks.filter((t) => {
    const matchesSearch =
      t.taskName.toLowerCase().includes(searchQuery.toLowerCase()) ||
      t.description.toLowerCase().includes(searchQuery.toLowerCase()) ||
      t.client.toLowerCase().includes(searchQuery.toLowerCase()) ||
      t.assignedPerson.toLowerCase().includes(searchQuery.toLowerCase());

    const matchesStatus = statusFilter === 'ALL' || t.status === statusFilter;
    const matchesPriority = priorityFilter === 'ALL' || t.priority === priorityFilter;
    const matchesAssignee = assigneeFilter === 'ALL' || t.assignedPerson === assigneeFilter;

    return matchesSearch && matchesStatus && matchesPriority && matchesAssignee;
  });

  const todoCount = scopedTasks.filter((t) => t.status === 'To Do').length;
  const inProgressCount = scopedTasks.filter((t) => t.status === 'In Progress').length;
  const completedCount = scopedTasks.filter((t) => t.status === 'Completed').length;
  const urgentCount = scopedTasks.filter((t) => t.priority === 'Urgent' && t.status !== 'Completed').length;

  const handleDeleteTask = (task) => {
    if (window.confirm(`Are you sure you want to delete task "${task.taskName}"?`)) {
      deleteTask(task.id);
    }
  };

  return (
    <div style={{ display: 'flex', flexDirection: 'column', gap: '20px' }}>
      {/* Header */}
      <div className="flex-between" style={{ flexWrap: 'wrap', gap: '12px' }}>
        <div>
          <h2>Assigned Tasks</h2>
          <p style={{ fontSize: '0.82rem', color: 'var(--text-muted)' }}>
            Operational task delegation and team execution tracking
          </p>
        </div>
        <button className="btn btn-primary" onClick={onOpenTaskModal} style={{ display: 'flex', alignItems: 'center', gap: '6px' }}>
          <Plus size={15} /> Assign Task
        </button>
      </div>

      {/* Metric Cards */}
      <div className="grid-4">
        <div className="stat-card" style={{ borderLeft: '4px solid var(--primary-600)' }}>
          <div className="stat-header">
            <span className="stat-title">To Do Backlog</span>
            <CheckSquare size={18} style={{ color: 'var(--primary-600)' }} />
          </div>
          <div className="stat-value">{todoCount}</div>
          <div className="stat-subtext">Queued for execution</div>
        </div>

        <div className="stat-card" style={{ borderLeft: '4px solid #f59e0b' }}>
          <div className="stat-header">
            <span className="stat-title">In Progress</span>
            <Clock size={18} style={{ color: '#f59e0b' }} />
          </div>
          <div className="stat-value">{inProgressCount}</div>
          <div className="stat-subtext">Actively being worked on</div>
        </div>

        <div className="stat-card" style={{ borderLeft: '4px solid #10b981' }}>
          <div className="stat-header">
            <span className="stat-title">Completed Tasks</span>
            <CheckCircle2 size={18} style={{ color: '#10b981' }} />
          </div>
          <div className="stat-value">{completedCount}</div>
          <div className="stat-subtext">Successfully fulfilled</div>
        </div>

        <div className="stat-card" style={{ borderLeft: `4px solid ${urgentCount > 0 ? 'var(--danger-text)' : 'var(--success-text)'}` }}>
          <div className="stat-header">
            <span className="stat-title">Urgent Priority</span>
            <AlertTriangle size={18} style={{ color: urgentCount > 0 ? 'var(--danger-text)' : 'var(--success-text)' }} />
          </div>
          <div className="stat-value" style={{ color: urgentCount > 0 ? 'var(--danger-text)' : 'inherit' }}>
            {urgentCount}
          </div>
          <div className="stat-subtext">Critical SLA & logistics items</div>
        </div>
      </div>

      {/* Filter and Search Bar */}
      <div className="card" style={{ padding: '14px 18px' }}>
        <div style={{ display: 'flex', gap: '14px', flexWrap: 'wrap', alignItems: 'center' }}>
          <div style={{ position: 'relative', flex: 1, minWidth: '220px' }}>
            <Search size={16} style={{ position: 'absolute', left: '10px', top: '50%', transform: 'translateY(-50%)', color: 'var(--text-muted)' }} />
            <input
              type="text"
              className="form-input"
              placeholder="Search task, client, description, assignee..."
              value={searchQuery}
              onChange={(e) => setSearchQuery(e.target.value)}
              style={{ paddingLeft: '32px' }}
            />
          </div>

          <div style={{ display: 'flex', alignItems: 'center', gap: '8px' }}>
            <span style={{ fontSize: '0.8rem', color: 'var(--text-muted)', fontWeight: 600 }}>Status:</span>
            <select
              className="form-select"
              value={statusFilter}
              onChange={(e) => setStatusFilter(e.target.value)}
              style={{ width: '130px' }}
            >
              <option value="ALL">All Statuses</option>
              <option value="To Do">To Do</option>
              <option value="In Progress">In Progress</option>
              <option value="Completed">Completed</option>
              <option value="Overdue">Overdue</option>
            </select>
          </div>

          <div style={{ display: 'flex', alignItems: 'center', gap: '8px' }}>
            <span style={{ fontSize: '0.8rem', color: 'var(--text-muted)', fontWeight: 600 }}>Priority:</span>
            <select
              className="form-select"
              value={priorityFilter}
              onChange={(e) => setPriorityFilter(e.target.value)}
              style={{ width: '120px' }}
            >
              <option value="ALL">All Priorities</option>
              <option value="Urgent">Urgent</option>
              <option value="High">High</option>
              <option value="Medium">Medium</option>
              <option value="Low">Low</option>
            </select>
          </div>

          <div style={{ display: 'flex', alignItems: 'center', gap: '8px' }}>
            <span style={{ fontSize: '0.8rem', color: 'var(--text-muted)', fontWeight: 600 }}>Assignee:</span>
            <select
              className="form-select"
              value={assigneeFilter}
              onChange={(e) => setAssigneeFilter(e.target.value)}
              style={{ width: '160px' }}
            >
              <option value="ALL">All Team Members</option>
              {assignees.map((a) => (
                <option key={a} value={a}>{a}</option>
              ))}
            </select>
          </div>
        </div>
      </div>

      {/* =========================================================================
          DESKTOP TASKS TABLE
          ========================================================================= */}
      <div className="table-container desktop-only">
        <table className="custom-table">
          <thead>
            <tr>
              <th>Task Name & Details</th>
              <th>Client / Account</th>
              <th>Assigned Person</th>
              <th>Priority</th>
              <th>Due Date</th>
              <th>Status</th>
              <th>Created By</th>
              <th>Update Status</th>
              <th>Action</th>
            </tr>
          </thead>
          <tbody>
            {filteredTasks.map((t) => (
              <tr key={t.id}>
                <td>
                  <div>
                    <strong style={{ fontSize: '0.9rem' }}>{t.taskName}</strong>
                    <div style={{ fontSize: '0.78rem', color: 'var(--text-secondary)', marginTop: '2px', maxWidth: '340px' }}>
                      {t.description}
                    </div>
                  </div>
                </td>
                <td>
                  <span className="badge badge-neutral" style={{ fontSize: '0.75rem' }}>
                    {t.client}
                  </span>
                </td>
                <td>
                  <div style={{ display: 'flex', alignItems: 'center', gap: '6px' }}>
                    <div style={{ width: '24px', height: '24px', borderRadius: '50%', background: 'var(--primary-600)', color: '#fff', fontSize: '0.68rem', display: 'flex', alignItems: 'center', justifyContent: 'center', fontWeight: 700 }}>
                      {t.assignedPerson.charAt(0)}
                    </div>
                    <span style={{ fontSize: '0.85rem', fontWeight: 600 }}>{t.assignedPerson}</span>
                  </div>
                </td>
                <td>
                  <span className={`badge ${t.priority === 'Urgent' || t.priority === 'High' ? 'badge-danger' : (t.priority === 'Medium' ? 'badge-warning' : 'badge-neutral')}`}>
                    {t.priority}
                  </span>
                </td>
                <td style={{ fontSize: '0.82rem' }}>
                  {formatDate(t.dueDate)}
                </td>
                <td>
                  <span className={`badge ${getStatusBadgeClass(t.status)}`}>
                    {t.status}
                  </span>
                </td>
                <td style={{ fontSize: '0.78rem', color: 'var(--text-muted)' }}>
                  {t.createdBy}
                </td>
                <td>
                  <select
                    className="form-select"
                    value={t.status}
                    onChange={(e) => updateTask(t.id, { status: e.target.value })}
                    style={{ width: '130px', padding: '4px 6px', fontSize: '0.78rem' }}
                  >
                    <option value="To Do">To Do</option>
                    <option value="In Progress">In Progress</option>
                    <option value="Completed">Completed</option>
                    <option value="Overdue">Overdue</option>
                  </select>
                </td>
                <td>
                  <button
                    className="btn btn-ghost btn-sm"
                    onClick={() => handleDeleteTask(t)}
                    title="Delete Task"
                    style={{ color: 'var(--danger-text)', padding: '4px 8px' }}
                  >
                    <Trash2 size={14} />
                  </button>
                </td>
              </tr>
            ))}
            {filteredTasks.length === 0 && (
              <tr>
                <td colSpan="9" style={{ textAlign: 'center', padding: '48px 16px', color: 'var(--text-muted)' }}>
                  <CheckSquare size={36} style={{ margin: '0 auto 10px', opacity: 0.4 }} />
                  <div style={{ fontWeight: 600, fontSize: '0.95rem' }}>No tasks found</div>
                  <p style={{ fontSize: '0.8rem', marginTop: '4px' }}>Try adjusting your search query, priority, or assignee filter.</p>
                </td>
              </tr>
            )}
          </tbody>
        </table>
      </div>

      {/* =========================================================================
          MOBILE TASK CARDS FEED (Phone Screens)
          ========================================================================= */}
      <div className="mobile-only" style={{ flexDirection: 'column', gap: '12px' }}>
        {filteredTasks.map((t) => (
          <div key={t.id} className="card" style={{ padding: '14px 16px' }}>
            <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'flex-start', marginBottom: '6px' }}>
              <div>
                <strong style={{ fontSize: '0.95rem', color: 'var(--text-primary)' }}>{t.taskName}</strong>
                <div style={{ fontSize: '0.75rem', color: 'var(--text-muted)' }}>Client: {t.client}</div>
              </div>
              <span className={`badge ${t.priority === 'Urgent' || t.priority === 'High' ? 'badge-danger' : (t.priority === 'Medium' ? 'badge-warning' : 'badge-neutral')}`} style={{ fontSize: '0.68rem', fontWeight: 700 }}>
                {t.priority}
              </span>
            </div>

            <p style={{ fontSize: '0.78rem', color: 'var(--text-secondary)', margin: '0 0 10px 0', lineHeight: 1.35 }}>
              {t.description}
            </p>

            <div style={{ display: 'flex', alignItems: 'center', gap: '8px', background: 'var(--bg-subtle)', padding: '8px 10px', borderRadius: 'var(--radius-sm)', fontSize: '0.75rem', marginBottom: '10px' }}>
              <span>Assignee: <strong>{t.assignedPerson}</strong></span>
              <span style={{ color: 'var(--text-muted)' }}>•</span>
              <span>Due: {formatDate(t.dueDate)}</span>
            </div>

            <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between', gap: '8px', paddingTop: '8px', borderTop: '1px solid var(--border-default)' }}>
              <select
                className="form-select"
                style={{ fontSize: '0.76rem', padding: '4px 8px', height: '32px', fontWeight: 700, flex: 1 }}
                value={t.status}
                onChange={(e) => updateTask(t.id, { status: e.target.value })}
              >
                <option value="To Do">To Do</option>
                <option value="In Progress">In Progress</option>
                <option value="Completed">Completed</option>
                <option value="Overdue">Overdue</option>
              </select>

              <button
                className="btn btn-ghost btn-sm"
                style={{ color: 'var(--danger-text)', height: '32px', padding: '0 8px' }}
                onClick={() => handleDeleteTask(t)}
              >
                <Trash2 size={14} />
              </button>
            </div>
          </div>
        ))}
        {filteredTasks.length === 0 && (
          <div className="card" style={{ padding: '36px 16px', textAlign: 'center', color: 'var(--text-muted)' }}>
            <CheckSquare size={32} style={{ margin: '0 auto 8px', opacity: 0.4 }} />
            <div style={{ fontWeight: 700 }}>No tasks found</div>
          </div>
        )}
      </div>
    </div>
  );
};
