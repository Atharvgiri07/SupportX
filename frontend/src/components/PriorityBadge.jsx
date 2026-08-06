const PRIORITY_STYLES = {
  Low: { bg: 'rgba(148, 163, 184, 0.18)', color: '#94a3b8' },
  Medium: { bg: 'rgba(59, 130, 246, 0.15)', color: '#3b82f6' },
  High: { bg: 'rgba(249, 115, 22, 0.15)', color: '#f97316' },
  Critical: { bg: 'rgba(239, 68, 68, 0.15)', color: '#ef4444' },
};

const PriorityBadge = ({ priority }) => {
  const style = PRIORITY_STYLES[priority] || PRIORITY_STYLES.Medium;
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
      {priority}
    </span>
  );
};

export default PriorityBadge;
