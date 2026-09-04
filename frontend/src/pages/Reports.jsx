import { AlertTriangle, CalendarDays, CheckCircle2, LocateFixed, X } from 'lucide-react';
import { useEffect, useState } from 'react';
import EmptyState from '../components/EmptyState.jsx';
import FilterBar from '../components/FilterBar.jsx';
import LoadingSpinner from '../components/LoadingSpinner.jsx';
import ReportCard, { formatDate } from '../components/ReportCard.jsx';
import { getReports } from '../services/api.js';

const initialFilters = { search: '', district: '', wasteType: '', priorityLevel: '', status: '', sort: 'newest' };

const Reports = () => {
  const [filters, setFilters] = useState(initialFilters);
  const [reports, setReports] = useState([]);
  const [selectedReport, setSelectedReport] = useState(null);
  const [isLoading, setIsLoading] = useState(true);
  const [hasError, setHasError] = useState(false);

  // Load the current report collection whenever browsing controls change.
  const loadReports = async () => {
    setIsLoading(true);
    setHasError(false);
    try {
      const { data } = await getReports(filters);
      setReports(data);
    } catch {
      setHasError(true);
    } finally {
      setIsLoading(false);
    }
  };

  useEffect(() => {
    // Debounce filter changes so typing in search does not trigger a request per keystroke.
    const timer = setTimeout(loadReports, 250);
    return () => clearTimeout(timer);
  }, [filters]);

  // Update one search or filter value without losing the others.
  const handleFilterChange = (event) => setFilters((current) => ({ ...current, [event.target.name]: event.target.value }));
  const clearFilters = () => setFilters(initialFilters);

  return <section className="reports-page"><div className="reports-header"><div><span className="eyebrow">Local visibility</span><h1>Community Waste Reports</h1><p>Explore waste issues reported across Sri Lankan communities.</p></div><div className="reports-count">Showing <strong>{reports.length}</strong> reports</div></div><FilterBar filters={filters} onChange={handleFilterChange} onClear={clearFilters} /><div className="sort-row"><span>{isLoading ? 'Updating reports...' : `Showing ${reports.length} reports`}</span><label>Sort by<select name="sort" value={filters.sort} onChange={handleFilterChange}><option value="newest">Newest First</option><option value="oldest">Oldest First</option><option value="highestPriority">Highest Priority</option></select></label></div>
    {isLoading ? <LoadingSpinner label="Loading community reports" /> : hasError ? <div className="reports-error" role="alert"><AlertTriangle size={22} /><div><h2>We couldn&apos;t load the reports right now.</h2><p>Please check your connection and try again.</p><button className="button button-primary" type="button" onClick={loadReports}>Try Again</button></div></div> : reports.length === 0 ? <EmptyState onClear={clearFilters} /> : <div className="reports-grid">{reports.map((report) => <ReportCard key={report._id} report={report} onViewDetails={setSelectedReport} />)}</div>}
    {selectedReport && <ReportDetails report={selectedReport} onClose={() => setSelectedReport(null)} />}
  </section>;
};

// Show every stored field in a lightweight modal without creating another route.
const ReportDetails = ({ report, onClose }) => <div className="modal-backdrop" role="presentation" onMouseDown={(event) => event.target === event.currentTarget && onClose()}><div className="details-modal" role="dialog" aria-modal="true" aria-labelledby="details-title"><div className="modal-header"><div><span className={`priority-badge priority-${report.priorityLevel.toLowerCase()}`}>{report.priorityLevel} priority</span><h2 id="details-title">{report.wasteType}</h2></div><button className="icon-button" type="button" onClick={onClose} aria-label="Close report details"><X size={21} /></button></div><div className="detail-facts"><p><strong>Reporter</strong>{report.reporterName}</p><p><strong>Location</strong>{report.area}, {report.district}</p><p><strong>Size</strong>{report.size}</p><p><strong>Urgency</strong>{report.urgency}</p><p><strong>Status</strong>{report.status}</p><p><strong>Submitted</strong><span><CalendarDays size={14} /> {formatDate(report.createdAt)}</span></p></div><div className="sensitive-detail">{report.sensitiveLocation ? <><AlertTriangle size={17} /> Near a sensitive location</> : <><CheckCircle2 size={17} /> Not marked as a sensitive location</>}</div>{report.location && <div className="report-coordinates"><LocateFixed size={16} /> Coordinates: {report.location.latitude}, {report.location.longitude}</div>}<p className="modal-description">{report.description}</p><div className="score-display"><span>Priority Score</span><strong>{report.priorityScore}</strong></div><button className="button button-secondary modal-close" type="button" onClick={onClose}>Close</button></div></div>;

export default Reports;
