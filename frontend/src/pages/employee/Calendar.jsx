import { useState, useEffect, useMemo } from 'react';
import { useNavigate } from 'react-router-dom';
import api from '../../utils/api';
import { useAuth } from '../../context/AuthContext';
import Loader from '../../components/Loader';
import { toast } from 'react-toastify';
import {
  FiChevronLeft,
  FiChevronRight,
  FiCalendar,
  FiClock,
  FiPlus,
  FiSearch,
  FiDownload,
  FiPrinter,
  FiX,
  FiCheck,
  FiAlertCircle,
  FiCheckCircle,
  FiTag,
  FiBookmark,
  FiArrowUpRight,
} from 'react-icons/fi';
import './Calendar.css';

const DAYS = ['Sun', 'Mon', 'Tue', 'Wed', 'Thu', 'Fri', 'Sat'];
const MONTHS = [
  'January', 'February', 'March', 'April', 'May', 'June',
  'July', 'August', 'September', 'October', 'November', 'December'
];

const Calendar = () => {
  const { user } = useAuth();
  const navigate = useNavigate();

  // State
  const [currentDate, setCurrentDate] = useState(new Date());
  const [tickets, setTickets] = useState([]);
  const [reminders, setReminders] = useState([]);
  const [customEvents, setCustomEvents] = useState(() => {
    try {
      const saved = localStorage.getItem('supportx_calendar_events');
      return saved ? JSON.parse(saved) : [];
    } catch {
      return [];
    }
  });
  const [selectedDay, setSelectedDay] = useState(new Date().getDate());
  const [searchQuery, setSearchQuery] = useState('');
  const [loading, setLoading] = useState(true);
  const [showEventModal, setShowEventModal] = useState(false);
  const [newEvent, setNewEvent] = useState({
    title: '',
    date: new Date().toISOString().substring(0, 10),
    time: '10:00',
    type: 'meeting',
    priority: 'Medium',
    description: '',
  });

  const year = currentDate.getFullYear();
  const month = currentDate.getMonth();

  // Fetch Tickets and Reminders
  useEffect(() => {
    const fetchData = async () => {
      try {
        const ticketEndpoint = user?.role === 'admin' ? '/tickets' : '/tickets/my';
        const [ticketsRes, remindersRes] = await Promise.allSettled([
          api.get(ticketEndpoint),
          api.get('/reminders'),
        ]);

        if (ticketsRes.status === 'fulfilled' && Array.isArray(ticketsRes.value.data)) {
          setTickets(ticketsRes.value.data);
        }
        if (remindersRes.status === 'fulfilled' && Array.isArray(remindersRes.value.data)) {
          setReminders(remindersRes.value.data);
        }
      } catch (err) {
        console.error('Error fetching calendar schedule:', err);
      } finally {
        setLoading(false);
      }
    };

    if (user) {
      fetchData();
    }
  }, [user]);

  // Save custom events to localStorage
  useEffect(() => {
    try {
      localStorage.setItem('supportx_calendar_events', JSON.stringify(customEvents));
    } catch (e) {
      console.error('Storage error:', e);
    }
  }, [customEvents]);

  // Navigation helpers
  const jumpToday = () => {
    const now = new Date();
    setCurrentDate(now);
    setSelectedDay(now.getDate());
  };

  const handlePrev = () => {
    setCurrentDate(new Date(year, month - 1, 1));
  };

  const handleNext = () => {
    setCurrentDate(new Date(year, month + 1, 1));
  };

  // Compile Unified Clean Events
  const unifiedEvents = useMemo(() => {
    const list = [];
    const seenTicketDates = new Set();

    // 1. SLA Deadlines (High Priority for Calendar View)
    tickets.forEach((t) => {
      if (t.dueDate) {
        const dateStr = t.dueDate.substring(0, 10);
        const isOverdue = ['Open', 'In Progress', 'Pending'].includes(t.status) && new Date(t.dueDate) < new Date();
        const key = `due-${t._id}-${dateStr}`;
        seenTicketDates.add(key);

        list.push({
          id: key,
          ticketId: t._id,
          title: t.title,
          label: isOverdue ? `Overdue: ${t.title}` : `Due: ${t.title}`,
          date: dateStr,
          time: new Date(t.dueDate).toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' }),
          type: isOverdue ? 'overdue' : 'deadline',
          category: 'Ticket SLA',
          priority: t.priority || 'Critical',
          status: t.status,
          icon: isOverdue ? '⚠️' : '⏱️',
          color: isOverdue ? '#ef4444' : '#f59e0b',
        });
      }
    });

    // 2. Ticket Resolutions
    tickets.forEach((t) => {
      if (t.resolvedAt) {
        const dateStr = t.resolvedAt.substring(0, 10);
        list.push({
          id: `res-${t._id}-${dateStr}`,
          ticketId: t._id,
          title: t.title,
          label: `Resolved: ${t.title}`,
          date: dateStr,
          time: new Date(t.resolvedAt).toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' }),
          type: 'resolved',
          category: 'Resolution',
          priority: t.priority || 'Low',
          status: t.status,
          icon: '✓',
          color: '#10b981',
        });
      }
    });

    // 3. Ticket Creation (Only if no SLA on same day to avoid duplicate clutter)
    tickets.forEach((t) => {
      if (t.createdAt && !t.resolvedAt) {
        const dateStr = t.createdAt.substring(0, 10);
        if (!seenTicketDates.has(`due-${t._id}-${dateStr}`)) {
          list.push({
            id: `create-${t._id}-${dateStr}`,
            ticketId: t._id,
            title: t.title,
            label: `Ticket: ${t.title}`,
            date: dateStr,
            time: new Date(t.createdAt).toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' }),
            type: 'created',
            category: 'Support Ticket',
            priority: t.priority || 'Medium',
            status: t.status,
            icon: '🎫',
            color: '#3b82f6',
          });
        }
      }
    });

    // 4. Reminders
    reminders.forEach((r) => {
      if (r.reminderDate) {
        list.push({
          id: `reminder-${r._id}`,
          title: r.title,
          label: `Reminder: ${r.title}`,
          date: r.reminderDate.substring(0, 10),
          time: new Date(r.reminderDate).toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' }),
          type: 'reminder',
          category: 'Reminder',
          priority: 'Medium',
          icon: '📌',
          color: '#8b5cf6',
          completed: r.isCompleted,
        });
      }
    });

    // 5. Custom Meetings & Scheduled Events
    customEvents.forEach((ev) => {
      list.push({
        id: ev.id,
        title: ev.title,
        label: ev.title,
        date: ev.date,
        time: ev.time || '09:00',
        type: ev.type || 'meeting',
        category: ev.type === 'meeting' ? 'Team Meeting' : 'Event',
        priority: ev.priority || 'Medium',
        icon: ev.type === 'meeting' ? '👥' : '📅',
        color: ev.type === 'meeting' ? '#6366f1' : '#ec4899',
        description: ev.description,
      });
    });

    if (searchQuery.trim()) {
      const q = searchQuery.toLowerCase();
      return list.filter((item) =>
        item.title.toLowerCase().includes(q) ||
        item.category.toLowerCase().includes(q) ||
        item.priority.toLowerCase().includes(q)
      );
    }

    return list;
  }, [tickets, reminders, customEvents, searchQuery]);

  // Group events by date string
  const eventsByDate = useMemo(() => {
    const map = {};
    unifiedEvents.forEach((ev) => {
      if (!map[ev.date]) map[ev.date] = [];
      map[ev.date].push(ev);
    });
    return map;
  }, [unifiedEvents]);

  // Quick Add Event Handler
  const handleCreateEvent = (e) => {
    e.preventDefault();
    if (!newEvent.title.trim()) {
      toast.error('Event title is required');
      return;
    }

    const created = {
      id: `custom-event-${Date.now()}`,
      ...newEvent,
      createdAt: new Date().toISOString(),
    };

    setCustomEvents((prev) => [created, ...prev]);
    toast.success('Event added to calendar');
    setShowEventModal(false);
    setNewEvent({
      title: '',
      date: new Date().toISOString().substring(0, 10),
      time: '10:00',
      type: 'meeting',
      priority: 'Medium',
      description: '',
    });
  };

  // Export to .ics format
  const handleExportICS = () => {
    let icsContent = `BEGIN:VCALENDAR\nVERSION:2.0\nPRODID:-//SupportX//Enterprise Calendar//EN\nCALSCALE:GREGORIAN\n`;

    unifiedEvents.forEach((ev) => {
      const cleanDate = ev.date.replace(/-/g, '');
      const timeClean = ev.time?.replace(/:/g, '') || '090000';
      icsContent += `BEGIN:VEVENT\nSUMMARY:${ev.title}\nDTSTART:${cleanDate}T${timeClean}00Z\nDESCRIPTION:${ev.category} in SupportX\nSTATUS:CONFIRMED\nEND:VEVENT\n`;
    });

    icsContent += `END:VCALENDAR`;

    const blob = new Blob([icsContent], { type: 'text/calendar;charset=utf-8;' });
    const url = URL.createObjectURL(blob);
    const link = document.createElement('a');
    link.href = url;
    link.setAttribute('download', `SupportX_Schedule_${year}_${month + 1}.ics`);
    document.body.appendChild(link);
    link.click();
    document.body.removeChild(link);
    toast.success('Calendar exported (.ics)');
  };

  // Month calculations
  const firstDayOfWeek = new Date(year, month, 1).getDay();
  const daysInCurrentMonth = new Date(year, month + 1, 0).getDate();
  const daysInPrevMonth = new Date(year, month, 0).getDate();

  const getDateKey = (d) => `${year}-${String(month + 1).padStart(2, '0')}-${String(d).padStart(2, '0')}`;
  const today = new Date();
  const isToday = (day) => today.getFullYear() === year && today.getMonth() === month && today.getDate() === day;

  // Selected date events
  const selectedDateKey = getDateKey(selectedDay);
  const selectedDayEvents = eventsByDate[selectedDateKey] || [];

  if (loading) return <Loader />;

  return (
    <div className="pro-calendar-container">
      {/* ── Top Header Toolbar ── */}
      <header className="pro-cal-header card">
        <div className="pro-cal-title-wrapper">
          <div className="pro-cal-icon">
            <FiCalendar size={22} />
          </div>
          <div>
            <div className="pro-cal-title-row">
              <h1 className="pro-cal-title">{MONTHS[month]} {year}</h1>
              <span className="pro-cal-total-pill">{unifiedEvents.length} Total Events</span>
            </div>
            <p className="pro-cal-subtitle">Manage SLA milestones, schedule reviews, and track daily operational workload.</p>
          </div>
        </div>

        <div className="pro-cal-actions">
          {/* Navigation Controls */}
          <div className="pro-nav-controls">
            <button className="pro-today-btn" onClick={jumpToday}>
              Today
            </button>
            <div className="pro-nav-arrows">
              <button className="pro-arrow-btn" onClick={handlePrev} title="Previous Month">
                <FiChevronLeft size={17} />
              </button>
              <button className="pro-arrow-btn" onClick={handleNext} title="Next Month">
                <FiChevronRight size={17} />
              </button>
            </div>
          </div>

          {/* Search Box */}
          <div className="pro-search-box">
            <FiSearch size={15} />
            <input
              type="text"
              placeholder="Search schedule..."
              value={searchQuery}
              onChange={(e) => setSearchQuery(e.target.value)}
            />
            {searchQuery && (
              <button onClick={() => setSearchQuery('')} className="pro-search-clear">
                <FiX size={13} />
              </button>
            )}
          </div>

          {/* Action Buttons */}
          <div className="pro-btn-group">
            <button className="btn btn-secondary pro-tool-btn" onClick={handleExportICS} title="Export (.ics)">
              <FiDownload size={14} />
              <span>Export</span>
            </button>
            <button className="btn btn-secondary pro-tool-btn" onClick={() => window.print()} title="Print Schedule">
              <FiPrinter size={14} />
            </button>
            <button className="btn btn-primary pro-add-btn" onClick={() => setShowEventModal(true)}>
              <FiPlus size={16} />
              <span>Add Event</span>
            </button>
          </div>
        </div>
      </header>

      {/* ── Main Layout: Sidebar & Calendar Grid ── */}
      <div className="pro-cal-grid-layout">
        {/* LEFT SIDEBAR: Mini Calendar & Focus Card */}
        <aside className="pro-cal-sidebar">
          {/* Mini Calendar Widget */}
          <div className="card pro-mini-calendar">
            <div className="pro-mini-header">
              <span className="pro-mini-month">{MONTHS[month].substring(0, 3)} {year}</span>
              <div className="pro-mini-arrows">
                <button onClick={() => setCurrentDate(new Date(year, month - 1, 1))}>‹</button>
                <button onClick={() => setCurrentDate(new Date(year, month + 1, 1))}>›</button>
              </div>
            </div>
            <div className="pro-mini-grid">
              {['S', 'M', 'T', 'W', 'T', 'F', 'S'].map((d, i) => (
                <span key={i} className="pro-mini-day-label">{d}</span>
              ))}
              {Array.from({ length: firstDayOfWeek }).map((_, i) => (
                <span key={`empty-${i}`} className="pro-mini-cell empty" />
              ))}
              {Array.from({ length: daysInCurrentMonth }).map((_, i) => {
                const day = i + 1;
                const dateKey = getDateKey(day);
                const hasEv = eventsByDate[dateKey]?.length > 0;
                return (
                  <button
                    key={day}
                    className={`pro-mini-cell ${isToday(day) ? 'is-today' : ''} ${selectedDay === day ? 'is-selected' : ''} ${hasEv ? 'has-event' : ''}`}
                    onClick={() => setSelectedDay(day)}
                  >
                    {day}
                  </button>
                );
              })}
            </div>
          </div>

          {/* Focus Day Schedule Card */}
          <div className="card pro-focus-card">
            <div className="pro-focus-header">
              <div className="pro-focus-date-badge">
                <span className="focus-badge-day">{selectedDay}</span>
                <span className="focus-badge-month">{MONTHS[month].substring(0, 3)}</span>
              </div>
              <div className="pro-focus-title-info">
                <h3>{MONTHS[month]} {selectedDay}</h3>
                <p>{selectedDayEvents.length} {selectedDayEvents.length === 1 ? 'activity' : 'activities'} scheduled</p>
              </div>
            </div>

            <div className="pro-focus-list">
              {selectedDayEvents.length === 0 ? (
                <div className="pro-focus-empty">
                  <FiClock size={24} />
                  <p>No tasks or events scheduled for this day.</p>
                  <button
                    className="btn btn-secondary btn-sm"
                    onClick={() => {
                      setNewEvent((prev) => ({ ...prev, date: selectedDateKey }));
                      setShowEventModal(true);
                    }}
                  >
                    + Schedule Now
                  </button>
                </div>
              ) : (
                selectedDayEvents.map((ev) => (
                  <div
                    key={ev.id}
                    className="pro-focus-item"
                    onClick={() => ev.ticketId && navigate(`/tickets/${ev.ticketId}`)}
                    style={{ cursor: ev.ticketId ? 'pointer' : 'default' }}
                  >
                    <div className="pro-focus-item-dot" style={{ backgroundColor: ev.color }} />
                    <div className="pro-focus-item-content">
                      <div className="pro-focus-item-top">
                        <span className="pro-focus-item-time">{ev.time}</span>
                        <span className="pro-focus-category-tag" style={{ color: ev.color, borderColor: `${ev.color}40` }}>
                          {ev.category}
                        </span>
                      </div>
                      <h4 className="pro-focus-item-title">{ev.title}</h4>
                      {ev.description && <p className="pro-focus-item-desc">{ev.description}</p>}
                      {ev.ticketId && (
                        <span className="pro-view-ticket-link">
                          View Ticket Details <FiArrowUpRight size={12} />
                        </span>
                      )}
                    </div>
                  </div>
                ))
              )}
            </div>
          </div>
        </aside>

        {/* MAIN CALENDAR VIEWPORT */}
        <main className="card pro-cal-main">
          {/* Weekday Header Bar */}
          <div className="pro-weekday-bar">
            {DAYS.map((day) => (
              <div key={day} className="pro-weekday-header">
                {day}
              </div>
            ))}
          </div>

          {/* Month Cells Grid */}
          <div className="pro-month-grid">
            {/* Previous Month Padded Days */}
            {Array.from({ length: firstDayOfWeek }).map((_, i) => {
              const prevDateNum = daysInPrevMonth - firstDayOfWeek + i + 1;
              return (
                <div key={`prev-${i}`} className="pro-day-cell is-padding">
                  <span className="pro-day-num opacity-muted">{prevDateNum}</span>
                </div>
              );
            })}

            {/* Current Month Days */}
            {Array.from({ length: daysInCurrentMonth }).map((_, i) => {
              const day = i + 1;
              const dateStr = getDateKey(day);
              const dayEvents = eventsByDate[dateStr] || [];
              const isDayToday = isToday(day);
              const isDaySelected = selectedDay === day;

              return (
                <div
                  key={day}
                  className={`pro-day-cell ${isDayToday ? 'is-today' : ''} ${isDaySelected ? 'is-selected' : ''}`}
                  onClick={() => setSelectedDay(day)}
                >
                  <div className="pro-cell-header">
                    <span className={`pro-day-num ${isDayToday ? 'today-pill' : ''}`}>
                      {day}
                    </span>
                    {dayEvents.length > 0 && (
                      <span className="pro-day-count-badge">
                        {dayEvents.length}
                      </span>
                    )}
                  </div>

                  {/* Clean Event Chips */}
                  <div className="pro-events-stack">
                    {dayEvents.slice(0, 2).map((ev) => (
                      <div
                        key={ev.id}
                        className="pro-event-chip"
                        style={{
                          backgroundColor: `${ev.color}15`,
                          borderColor: `${ev.color}35`,
                          borderLeftColor: ev.color,
                        }}
                        title={`${ev.time} · ${ev.label}`}
                        onClick={(e) => {
                          e.stopPropagation();
                          setSelectedDay(day);
                          if (ev.ticketId) navigate(`/tickets/${ev.ticketId}`);
                        }}
                      >
                        <span className="pro-chip-indicator" style={{ backgroundColor: ev.color }} />
                        <span className="pro-chip-time">{ev.time}</span>
                        <span className="pro-chip-title" style={{ color: 'var(--color-text)' }}>
                          {ev.label}
                        </span>
                      </div>
                    ))}

                    {dayEvents.length > 2 && (
                      <div
                        className="pro-chip-more"
                        onClick={(e) => {
                          e.stopPropagation();
                          setSelectedDay(day);
                        }}
                      >
                        +{dayEvents.length - 2} more items
                      </div>
                    )}
                  </div>
                </div>
              );
            })}
          </div>
        </main>
      </div>

      {/* ── Quick Add Event Modal ── */}
      {showEventModal && (
        <div className="cal-modal-backdrop" onClick={() => setShowEventModal(false)}>
          <div className="cal-modal-card card" onClick={(e) => e.stopPropagation()}>
            <div className="cal-modal-header">
              <h3>Schedule New Event</h3>
              <button className="cal-modal-close" onClick={() => setShowEventModal(false)}>
                <FiX size={18} />
              </button>
            </div>

            <form onSubmit={handleCreateEvent} className="cal-modal-form">
              <div className="field">
                <label>Event Title</label>
                <input
                  type="text"
                  placeholder="e.g. Weekly Standup or Sprint Review"
                  value={newEvent.title}
                  onChange={(e) => setNewEvent({ ...newEvent, title: e.target.value })}
                  required
                  autoFocus
                />
              </div>

              <div className="form-row-2">
                <div className="field">
                  <label>Date</label>
                  <input
                    type="date"
                    value={newEvent.date}
                    onChange={(e) => setNewEvent({ ...newEvent, date: e.target.value })}
                    required
                  />
                </div>
                <div className="field">
                  <label>Time</label>
                  <input
                    type="time"
                    value={newEvent.time}
                    onChange={(e) => setNewEvent({ ...newEvent, time: e.target.value })}
                    required
                  />
                </div>
              </div>

              <div className="form-row-2">
                <div className="field">
                  <label>Event Type</label>
                  <select
                    value={newEvent.type}
                    onChange={(e) => setNewEvent({ ...newEvent, type: e.target.value })}
                  >
                    <option value="meeting">Team Meeting</option>
                    <option value="deadline">Milestone / SLA</option>
                    <option value="reminder">Personal Reminder</option>
                    <option value="review">System Maintenance</option>
                  </select>
                </div>

                <div className="field">
                  <label>Priority</label>
                  <select
                    value={newEvent.priority}
                    onChange={(e) => setNewEvent({ ...newEvent, priority: e.target.value })}
                  >
                    <option value="Low">Low</option>
                    <option value="Medium">Medium</option>
                    <option value="High">High</option>
                    <option value="Critical">Critical</option>
                  </select>
                </div>
              </div>

              <div className="field">
                <label>Description & Notes (Optional)</label>
                <textarea
                  placeholder="Notes, agenda details, or meeting links..."
                  value={newEvent.description}
                  onChange={(e) => setNewEvent({ ...newEvent, description: e.target.value })}
                  rows={3}
                />
              </div>

              <div className="cal-modal-actions">
                <button type="button" className="btn btn-secondary" onClick={() => setShowEventModal(false)}>
                  Cancel
                </button>
                <button type="submit" className="btn btn-primary">
                  <FiCheck size={16} /> Save to Schedule
                </button>
              </div>
            </form>
          </div>
        </div>
      )}
    </div>
  );
};

export default Calendar;
