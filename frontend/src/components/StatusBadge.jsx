const STATUS_STYLES = {
  Open: { bg: 'rgba(59, 130, 246, 0.15)', color: '#3b82f6' },
  'In Progress': { bg: 'rgba(245, 158, 11, 0.15)', color: '#f59e0b' },
  Pending: { bg: 'rgba(168, 85, 247, 0.15)', color: '#a855f7' },
  Resolved: { bg: 'rgba(34, 197, 94, 0.15)', color: '#22c55e' },
  Closed: { bg: 'rgba(148, 163, 184, 0.18)', color: '#94a3b8' },
};

const StatusBadge = ({ status }) => {
  const style = STATUS_STYLES[status] || STATUS_STYLES.Open;
  return (
    <span
      style={{
        background: style.bg,
        color: style.color,
        fontSize: 12,
        fontWeight: 600,
        padding: '3px 10px',
        borderRadius: 999,
        display: 'inline-block',
        whiteSpace: 'nowrap',
      }}
    >
      {status}
    </span>
  );
};

export default StatusBadge;
