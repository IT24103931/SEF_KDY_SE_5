import { CalendarDays, ChevronRight, MapPin } from 'lucide-react';

// Format dates consistently for visitors regardless of their browser locale.
const formatDate = (date) => new Intl.DateTimeFormat('en', { dateStyle: 'medium' }).format(new Date(date));

// Present the most useful report facts before visitors open the full details.
const ReportCard = ({ report, onViewDetails }) => (
  <article className="report-card">
    <div className="report-card-topline"><span className={`priority-badge priority-${report.priorityLevel.toLowerCase()}`}>{report.priorityLevel} priority</span><span className="status-badge">{report.status}</span></div>
    <h2>{report.wasteType} {report.verified && <span className="verified-badge">Verified</span>}</h2>
    <p className="report-location"><MapPin size={16} />{report.area}, {report.district}</p>
    <p className="report-preview">{report.description}</p>
    <div className="report-meta"><span>{report.size} size</span><span>{report.urgency} urgency</span><span className="report-date"><CalendarDays size={14} />{formatDate(report.createdAt)}</span></div>
    <button className="details-button" type="button" onClick={() => onViewDetails(report)}>View Details <ChevronRight size={17} /></button>
  </article>
);

export { formatDate };
export default ReportCard;