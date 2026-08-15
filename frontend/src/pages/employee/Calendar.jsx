import { useState, useEffect, useMemo } from 'react';
import { useNavigate } from 'react-router-dom';
import api from '../../utils/api';
import { useAuth } from '../../context/AuthContext';
import Loader from '../../components/Loader';
import StatusBadge from '../../components/StatusBadge';
import { toast } from 'react-toastify';
import {
  FiChevronLeft,
  FiChevronRight,
  FiCalendar,
  FiClock,
  FiPlus,
  FiSearch,
  FiFilter,
  FiDownload,
  FiPrinter,
  FiCheckCircle,
  FiAlertTriangle,
  FiInbox,
  FiTag,
  FiX,
  FiCheck,
  FiLayers,
  FiList,
  FiGrid,
} from 'react-icons/fi';
import './Calendar.css';

const DAYS = ['Sun', 'Mon', 'Tue', 'Wed', 'Thu', 'Fri', 'Sat'];
const FULL_DAYS = ['Sunday', 'Monday', 'Tuesday', 'Wednesday', 'Thursday', 'Friday', 'Saturday'];
const MONTHS = [
  'January', 'February', 'March', 'April', 'May', 'June',
  'July', 'August', 'September', 'October', 'November', 'December'
];

const HOURS = Array.from({ length: 14 }, (_, i) => i + 8); // 8 AM to 9 PM

const PRIORITY_COLORS = {
  Critical: { bg: 'rgba(239, 68, 68, 0.15)', text: '#ef4444', border: '#ef4444' },
  High: { bg: 'rgba(245, 158, 11, 0.15)', text: '#f59e0b', border: '#f59e0b' },
  Medium: { bg: 'rgba(59, 130, 246, 0.15)', text: '#3b82f6', border: '#3b82f6' },
  Low: { bg: 'rgba(16, 185, 129, 0.15)', text: '#10b981', border: '#10b981' },
};

const Calendar = () => {
  const { user } = useAuth();
  const navigate = useNavigate();

  // State
  const [currentDate, setCurrentDate] = useState(new Date());
  const [viewMode, setViewMode] = useState('month'); // 'month' | 'week' | 'day' | 'agenda'
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
  const [activeFilters, setActiveFilters] = useState({
    deadlines: true,
    created: true,
    resolved: true,
    reminders: true,
    meetings: true,
  });
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
    setCurrentDate(new Date());
    setSelectedDay(new Date().getDate());
  };

  const handlePrev = () => {
    if (viewMode === 'month') {
      setCurrentDate(new Date(year, month - 1, 1));
    } else if (viewMode === 'week') {
      const next = new Date(currentDate);
      next.setDate(next.getDate() - 7);
      setCurrentDate(next);
    } else if (viewMode === 'day') {
      const next = new Date(currentDate);
      next.setDate(next.getDate() - 1);
      setCurrentDate(next);
    }
  };

  const handleNext = () => {
    if (viewMode === 'month') {
      setCurrentDate(new Date(year, month + 1, 1));
    } else if (viewMode === 'week') {
      const next = new Date(currentDate);
      next.setDate(next.getDate() + 7);
      setCurrentDate(next);
    } else if (viewMode === 'day') {
      const next = new Date(currentDate);
      next.setDate(next.getDate() + 1);
      setCurrentDate(next);
    }
  };

  // Compile Unified Events by Date String YYYY-MM-DD
  const unifiedEvents = useMemo(() => {
    const list = [];

    // Ticket Created Events
    if (activeFilters.created) {
      tickets.forEach((t) => {
        if (t.createdAt) {
          list.push({
            id: `ticket-create-${t._id}`,
            ticketId: t._id,
            title: `Ticket Logged: ${t.title}`,
            date: t.createdAt.substring(0, 10),
            time: new Date(t.createdAt).toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' }),
            hour: new Date(t.createdAt).getHours(),
            type: 'created',
            priority: t.priority || 'Medium',
            status: t.status,
            color: '#3b82f6',
          });
        }
      });
    }

    // Ticket SLA Deadlines
    if (activeFilters.deadlines) {
      tickets.forEach((t) => {
        if (t.dueDate) {
          const isOverdue = ['Open', 'In Progress', 'Pending'].includes(t.status) && new Date(t.dueDate) < new Date();
          list.push({
            id: `ticket-due-${t._id}`,
            ticketId: t._id,
            title: `SLA Deadline: ${t.title}`,
            date: t.dueDate.substring(0, 10),
            time: new Date(t.dueDate).toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' }),
            hour: new Date(t.dueDate).getHours(),
            type: isOverdue ? 'overdue' : 'deadline',
            priority: t.priority || 'Critical',
            status: t.status,
            color: isOverdue ? '#ef4444' : '#f59e0b',
            isOverdue,
          });
        }
      });
    }

    // Ticket Resolutions
    if (activeFilters.resolved) {
      tickets.forEach((t) => {
        if (t.resolvedAt) {
          list.push({
            id: `ticket-res-${t._id}`,
            ticketId: t._id,
            title: `Resolved: ${t.title}`,
            date: t.resolvedAt.substring(0, 10),
            time: new Date(t.resolvedAt).toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' }),
            hour: new Date(t.resolvedAt).getHours(),
            type: 'resolved',
            priority: t.priority || 'Low',
            status: t.status,
            color: '#10b981',
          });
        }
      });
    }

    // Reminders
    if (activeFilters.reminders) {
      reminders.forEach((r) => {
        if (r.reminderDate) {
          list.push({
            id: `reminder-${r._id}`,
            title: `Reminder: ${r.title}`,
            date: r.reminderDate.substring(0, 10),
            time: new Date(r.reminderDate).toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' }),
            hour: new Date(r.reminderDate).getHours(),
            type: 'reminder',
            priority: 'Medium',
            color: '#8b5cf6',
            completed: r.isCompleted,
          });
        }
      });
    }

    // Custom Meetings / Events
    if (activeFilters.meetings) {
      customEvents.forEach((ev) => {
        list.push({
          id: ev.id,
          title: ev.title,
          date: ev.date,
          time: ev.time || '09:00',
          hour: parseInt(ev.time?.split(':')[0] || 9, 10),
          type: ev.type || 'meeting',
          priority: ev.priority || 'Medium',
          color: ev.type === 'meeting' ? '#ec4899' : '#6366f1',
          description: ev.description,
        });
      });
    }

    if (searchQuery.trim()) {
      const q = searchQuery.toLowerCase();
      return list.filter((item) => item.title.toLowerCase().includes(q));
    }

    return list;
  }, [tickets, reminders, customEvents, activeFilters, searchQuery]);

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
    toast.success('Event scheduled on calendar!');
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
      icsContent += `BEGIN:VEVENT\nSUMMARY:${ev.title}\nDTSTART:${cleanDate}T${timeClean}00Z\nDESCRIPTION:${ev.type.toUpperCase()} scheduled in SupportX\nSTATUS:CONFIRMED\nEND:VEVENT\n`;
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
    toast.success('Calendar exported to iCal (.ics) format!');
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

  // Week View dates (7 days)
  const currentWeekDays = useMemo(() => {
    const start = new Date(currentDate);
    start.setDate(start.getDate() - start.getDay()); // Sunday
    const week = [];
    for (let i = 0; i < 7; i++) {
      const d = new Date(start);
      d.setDate(start.getDate() + i);
      week.push(d);
    }
    return week;
  }, [currentDate]);

  if (loading) return <Loader />;

  return (
    <div className="enterprise-calendar-page">
      {/* ── Top Command Bar ── */}
      <div className="cal-top-bar">
        <div className="cal-title-block">
          <div className="cal-icon-badge">
            <FiCalendar size={20} />
          </div>
          <div>
            <h1>Enterprise Calendar</h1>
            <p>Unified schedule for SLA deadlines, team meetings, reminders, and ticket milestones.</p>
          </div>
        </div>

        <div className="cal-top-actions">
          {/* Search */}
          <div className="cal-search-box">
            <FiSearch size={16} />
            <input
              type="text"
              placeholder="Search schedule & tickets..."
              value={searchQuery}
              onChange={(e) => setSearchQuery(e.target.value)}
            />
            {searchQuery && (
              <button onClick={() => setSearchQuery('')} className="clear-search-btn">
                <FiX size={14} />
              </button>
            )}
          </div>

          {/* Export & Print */}
          <button className="btn btn-secondary cal-action-btn" onClick={handleExportICS} title="Export to Google/Outlook Calendar (.ics)">
            <FiDownload size={15} />
            <span className="hide-mobile">Export iCal</span>
          </button>
          <button className="btn btn-secondary cal-action-btn" onClick={() => window.print()} title="Print Calendar">
            <FiPrinter size={15} />
            <span className="hide-mobile">Print</span>
          </button>

          {/* Quick Add Button */}
          <button className="btn btn-primary cal-action-btn" onClick={() => setShowEventModal(true)}>
            <FiPlus size={16} />
            <span>Schedule Event</span>
          </button>
        </div>
      </div>

      {/* ── Sub Header: Controls & View Mode Tabs ── */}
      <div className="cal-controls-row card">
        <div className="cal-nav-group">
          <button className="btn btn-secondary btn-sm today-btn" onClick={jumpToday}>
            Today
          </button>
          <div className="cal-arrows">
            <button className="cal-arrow-btn" onClick={handlePrev} aria-label="Previous">
              <FiChevronLeft size={18} />
            </button>
            <button className="cal-arrow-btn" onClick={handleNext} aria-label="Next">
              <FiChevronRight size={18} />
            </button>
          </div>
          <h2 className="cal-month-title">
            {MONTHS[month]} <span className="cal-year-text">{year}</span>
          </h2>
        </div>

        {/* View Switcher Tabs (Month, Week, Day, Agenda) */}
        <div className="cal-view-tabs">
          <button
            className={`cal-view-tab ${viewMode === 'month' ? 'active' : ''}`}
            onClick={() => setViewMode('month')}
          >
            <FiGrid size={15} />
            <span>Month</span>
          </button>
          <button
            className={`cal-view-tab ${viewMode === 'week' ? 'active' : ''}`}
            onClick={() => setViewMode('week')}
          >
            <FiLayers size={15} />
            <span>Week</span>
          </button>
          <button
            className={`cal-view-tab ${viewMode === 'day' ? 'active' : ''}`}
            onClick={() => setViewMode('day')}
          >
            <FiClock size={15} />
            <span>Day</span>
          </button>
          <button
            className={`cal-view-tab ${viewMode === 'agenda' ? 'active' : ''}`}
            onClick={() => setViewMode('agenda')}
          >
            <FiList size={15} />
            <span>Agenda</span>
          </button>
        </div>
      </div>

      {/* ── Main Calendar Workspace ── */}
      <div className="cal-workspace-layout">
        {/* LEFT SIDEBAR: Mini Calendar & Filter Toggles */}
        <aside className="cal-left-sidebar">
          {/* Mini Calendar Widget */}
          <div className="card cal-mini-card">
            <div className="mini-cal-header">
              <span>{MONTHS[month].substring(0, 3)} {year}</span>
              <div className="mini-nav-arrows">
                <button onClick={() => setCurrentDate(new Date(year, month - 1, 1))}>‹</button>
                <button onClick={() => setCurrentDate(new Date(year, month + 1, 1))}>›</button>
              </div>
            </div>
            <div className="mini-cal-grid">
              {['S', 'M', 'T', 'W', 'T', 'F', 'S'].map((d, i) => (
                <span key={i} className="mini-day-label">{d}</span>
              ))}
              {Array.from({ length: firstDayOfWeek }).map((_, i) => (
                <span key={`empty-mini-${i}`} className="mini-day-cell empty" />
              ))}
              {Array.from({ length: daysInCurrentMonth }).map((_, i) => {
                const day = i + 1;
                const dateKey = getDateKey(day);
                const hasEv = eventsByDate[dateKey]?.length > 0;
                return (
                  <button
                    key={day}
                    className={`mini-day-cell ${isToday(day) ? 'today' : ''} ${selectedDay === day ? 'selected' : ''} ${hasEv ? 'has-event' : ''}`}
                    onClick={() => setSelectedDay(day)}
                  >
                    {day}
                  </button>
                );
              })}
            </div>
          </div>

          {/* Schedule Category Filter Toggles */}
          <div className="card cal-filters-card">
            <h4 className="cal-side-heading">
              <FiFilter size={14} />
              <span>Event Categories</span>
            </h4>
            <div className="cal-filter-list">
              <label className="cal-filter-item">
                <input
                  type="checkbox"
                  checked={activeFilters.deadlines}
                  onChange={(e) => setActiveFilters({ ...activeFilters, deadlines: e.target.checked })}
                />
                <span className="color-dot dot-red" />
                <span>SLA Deadlines</span>
              </label>

              <label className="cal-filter-item">
                <input
                  type="checkbox"
                  checked={activeFilters.created}
                  onChange={(e) => setActiveFilters({ ...activeFilters, created: e.target.checked })}
                />
                <span className="color-dot dot-blue" />
                <span>Tickets Logged</span>
              </label>

              <label className="cal-filter-item">
                <input
                  type="checkbox"
                  checked={activeFilters.resolved}
                  onChange={(e) => setActiveFilters({ ...activeFilters, resolved: e.target.checked })}
                />
                <span className="color-dot dot-green" />
                <span>Ticket Resolutions</span>
              </label>

              <label className="cal-filter-item">
                <input
                  type="checkbox"
                  checked={activeFilters.meetings}
                  onChange={(e) => setActiveFilters({ ...activeFilters, meetings: e.target.checked })}
                />
                <span className="color-dot dot-pink" />
                <span>Team Meetings</span>
              </label>

              <label className="cal-filter-item">
                <input
                  type="checkbox"
                  checked={activeFilters.reminders}
                  onChange={(e) => setActiveFilters({ ...activeFilters, reminders: e.target.checked })}
                />
                <span className="color-dot dot-purple" />
                <span>Personal Reminders</span>
              </label>
            </div>
          </div>

          {/* Focus Day Upcoming Card */}
          <div className="card cal-focus-card">
            <h4 className="cal-side-heading">
              <FiClock size={14} />
              <span>{MONTHS[month]} {selectedDay} Schedule</span>
            </h4>
            {selectedDayEvents.length === 0 ? (
              <p className="cal-empty-text">No items scheduled for this date.</p>
            ) : (
              <div className="cal-focus-items-list">
                {selectedDayEvents.map((ev) => (
                  <div
                    key={ev.id}
                    className="cal-focus-item"
                    onClick={() => ev.ticketId && navigate(`/tickets/${ev.ticketId}`)}
                    style={{ cursor: ev.ticketId ? 'pointer' : 'default' }}
                  >
                    <span className="focus-item-bar" style={{ backgroundColor: ev.color }} />
                    <div className="focus-item-info">
                      <p className="focus-item-title">{ev.title}</p>
                      <span className="focus-item-time">{ev.time} · {ev.type}</span>
                    </div>
                  </div>
                ))}
              </div>
            )}
          </div>
        </aside>

        {/* MAIN CALENDAR DISPLAY VIEW */}
        <main className="cal-main-viewport card">
          {/* ════════════════════ MONTH VIEW ════════════════════ */}
          {viewMode === 'month' && (
            <div className="cal-month-view">
              <div className="cal-weekday-headers">
                {DAYS.map((d) => (
                  <div key={d} className="cal-weekday-col">
                    {d}
                  </div>
                ))}
              </div>

              <div className="cal-month-cells-grid">
                {/* Leading Days from Prev Month */}
                {Array.from({ length: firstDayOfWeek }).map((_, i) => {
                  const prevDateNum = daysInPrevMonth - firstDayOfWeek + i + 1;
                  return (
                    <div key={`prev-pad-${i}`} className="cal-grid-cell inactive-cell">
                      <span className="day-number-tag opacity-dim">{prevDateNum}</span>
                    </div>
                  );
                })}

                {/* Current Month Active Days */}
                {Array.from({ length: daysInCurrentMonth }).map((_, i) => {
                  const day = i + 1;
                  const dateStr = getDateKey(day);
                  const dayEvs = eventsByDate[dateStr] || [];
                  const isCurrent = isToday(day);
                  const isSelected = selectedDay === day;

                  return (
                    <div
                      key={day}
                      className={`cal-grid-cell ${isCurrent ? 'current-day' : ''} ${isSelected ? 'selected-day' : ''}`}
                      onClick={() => setSelectedDay(day)}
                    >
                      <div className="cal-cell-top">
                        <span className={`day-number-tag ${isCurrent ? 'today-pill' : ''}`}>
                          {day}
                        </span>
                        {dayEvs.length > 0 && (
                          <span className="day-events-counter">{dayEvs.length}</span>
                        )}
                      </div>

                      {/* Event Chips List (up to 3 chips visible) */}
                      <div className="cal-cell-events-stack">
                        {dayEvs.slice(0, 3).map((ev) => (
                          <div
                            key={ev.id}
                            className="cal-event-chip"
                            style={{
                              backgroundColor: ev.color + '1a',
                              color: ev.color,
                              borderLeft: `3px solid ${ev.color}`,
                            }}
                            title={`${ev.title} (${ev.time})`}
                            onClick={(e) => {
                              e.stopPropagation();
                              if (ev.ticketId) navigate(`/tickets/${ev.ticketId}`);
                            }}
                          >
                            <span className="chip-time">{ev.time}</span>
                            <span className="chip-text">{ev.title}</span>
                          </div>
                        ))}
                        {dayEvs.length > 3 && (
                          <span className="cal-chip-overflow">+{dayEvs.length - 3} more</span>
                        )}
                      </div>
                    </div>
                  );
                })}
              </div>
            </div>
          )}

          {/* ════════════════════ WEEK VIEW ════════════════════ */}
          {viewMode === 'week' && (
            <div className="cal-week-view">
              <div className="cal-week-header-row">
                <div className="time-col-spacer" />
                {currentWeekDays.map((d, idx) => {
                  const isDayToday = d.toDateString() === today.toDateString();
                  return (
                    <div key={idx} className={`week-header-day ${isDayToday ? 'today-header' : ''}`}>
                      <span className="week-day-name">{DAYS[d.getDay()]}</span>
                      <span className="week-day-num">{d.getDate()}</span>
                    </div>
                  );
                })}
              </div>

              <div className="cal-week-body-scroll">
                {HOURS.map((hour) => (
                  <div key={hour} className="cal-hour-row">
                    <div className="hour-label-col">
                      {hour > 12 ? `${hour - 12} PM` : `${hour} AM`}
                    </div>
                    {currentWeekDays.map((d, dayIdx) => {
                      const dStr = d.toISOString().substring(0, 10);
                      const matchingEvents = (eventsByDate[dStr] || []).filter((ev) => ev.hour === hour);

                      return (
                        <div key={dayIdx} className="week-hour-slot">
                          {matchingEvents.map((ev) => (
                            <div
                              key={ev.id}
                              className="week-event-card"
                              style={{
                                backgroundColor: ev.color + '22',
                                borderLeft: `3px solid ${ev.color}`,
                                color: ev.color,
                              }}
                              onClick={() => ev.ticketId && navigate(`/tickets/${ev.ticketId}`)}
                            >
                              <strong>{ev.title}</strong>
                              <span>{ev.time}</span>
                            </div>
                          ))}
                        </div>
                      );
                    })}
                  </div>
                ))}
              </div>
            </div>
          )}

          {/* ════════════════════ DAY VIEW ════════════════════ */}
          {viewMode === 'day' && (
            <div className="cal-day-view">
              <div className="cal-day-header">
                <h2>{FULL_DAYS[currentDate.getDay()]}, {MONTHS[month]} {currentDate.getDate()}, {year}</h2>
                <span className="day-summary-tag">{selectedDayEvents.length} items scheduled</span>
              </div>

              <div className="cal-day-timeline-scroll">
                {HOURS.map((hour) => {
                  const curDateKey = currentDate.toISOString().substring(0, 10);
                  const hourEvents = (eventsByDate[curDateKey] || []).filter((ev) => ev.hour === hour);

                  return (
                    <div key={hour} className="day-hour-track">
                      <div className="day-hour-time">
                        {hour > 12 ? `${hour - 12} PM` : `${hour} AM`}
                      </div>
                      <div className="day-hour-content">
                        {hourEvents.map((ev) => (
                          <div
                            key={ev.id}
                            className="day-event-block"
                            style={{
                              backgroundColor: ev.color + '1a',
                              borderLeft: `4px solid ${ev.color}`,
                              color: 'var(--color-text)',
                            }}
                            onClick={() => ev.ticketId && navigate(`/tickets/${ev.ticketId}`)}
                          >
                            <div className="day-block-header">
                              <h4 style={{ color: ev.color }}>{ev.title}</h4>
                              <span className="day-block-time">{ev.time}</span>
                            </div>
                            {ev.description && <p className="day-block-desc">{ev.description}</p>}
                            {ev.status && <StatusBadge status={ev.status} />}
                          </div>
                        ))}
                      </div>
                    </div>
                  );
                })}
              </div>
            </div>
          )}

          {/* ════════════════════ AGENDA VIEW ════════════════════ */}
          {viewMode === 'agenda' && (
            <div className="cal-agenda-view">
              <div className="agenda-header-banner">
                <h3>Chronological Agenda & Milestone Stream</h3>
                <p>All upcoming ticket deadlines, meetings, and scheduled operations.</p>
              </div>

              {unifiedEvents.length === 0 ? (
                <div className="agenda-empty-state">
                  <FiInbox size={36} />
                  <p>No events found for the active filters.</p>
                </div>
              ) : (
                <div className="agenda-items-timeline">
                  {unifiedEvents.map((ev) => (
                    <div
                      key={ev.id}
                      className="agenda-row-item"
                      onClick={() => ev.ticketId && navigate(`/tickets/${ev.ticketId}`)}
                      style={{ cursor: ev.ticketId ? 'pointer' : 'default' }}
                    >
                      <div className="agenda-date-badge">
                        <span className="agenda-badge-month">{ev.date.substring(5, 7)}</span>
                        <span className="agenda-badge-day">{ev.date.substring(8, 10)}</span>
                      </div>

                      <div className="agenda-item-body">
                        <div className="agenda-item-title-row">
                          <h4 style={{ color: ev.color }}>{ev.title}</h4>
                          <span className="agenda-type-pill" style={{ borderColor: ev.color, color: ev.color }}>
                            {ev.type}
                          </span>
                        </div>
                        <p className="agenda-item-meta">
                          <FiClock size={13} /> {ev.time} · Priority: <strong>{ev.priority}</strong>
                          {ev.status && <span> · Status: <strong>{ev.status}</strong></span>}
                        </p>
                        {ev.description && <p className="agenda-item-desc">{ev.description}</p>}
                      </div>
                    </div>
                  ))}
                </div>
              )}
            </div>
          )}
        </main>
      </div>

      {/* ── Quick Add Event / Meeting Modal ── */}
      {showEventModal && (
        <div className="cal-modal-backdrop" onClick={() => setShowEventModal(false)}>
          <div className="cal-modal-card card" onClick={(e) => e.stopPropagation()}>
            <div className="cal-modal-header">
              <h3>Schedule New Event / Meeting</h3>
              <button className="cal-modal-close" onClick={() => setShowEventModal(false)}>
                <FiX size={18} />
              </button>
            </div>

            <form onSubmit={handleCreateEvent} className="cal-modal-form">
              <div className="field">
                <label>Event Title</label>
                <input
                  type="text"
                  placeholder="e.g. Weekly SLA Standup or Release Review"
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
                  placeholder="Agenda items, video conference links, or ticket references..."
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
