// Display one live community statistic with a consistent visual treatment.
const StatCard = ({ label, value, icon: Icon, tone = 'green' }) => (
  <article className={`stat-card stat-card-${tone}`}>
    <div className="stat-icon" aria-hidden="true"><Icon size={21} /></div>
    <div><p className="stat-value">{value}</p><p className="stat-label">{label}</p></div>
  </article>
);

export default StatCard;