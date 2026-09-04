import { Activity, AlertTriangle, BarChart3, CheckCircle2, ClipboardList, Clock3, Eye, LayoutDashboard, LogOut, MapPin, ShieldCheck, X } from 'lucide-react';
import { useEffect, useState } from 'react';
import { Navigate, useNavigate } from 'react-router-dom';
import { archiveAdminReport, getAdminReports, getAdminStats, getAuditLogs, updateAdminReport } from '../services/api.js';

const initialFilters = { search: '', status: '', priorityLevel: '', sort: 'newest' };

// Coordinate protected dashboard data and administrator actions.
const AdminWorkspace = () => {
  const navigate = useNavigate();
  const email = sessionStorage.getItem('cleansl_admin_email');
  const [stats, setStats] = useState(null);
  const [reports, setReports] = useState([]);
  const [logs, setLogs] = useState([]);
  const [filters, setFilters] = useState(initialFilters);
  const [selectedReport, setSelectedReport] = useState(null);
  const [isLoading, setIsLoading] = useState(true);
  const [error, setError] = useState('');

  // Fetch summary cards, report queue, and recent actions together.
  const loadDashboard = async () => {
    setIsLoading(true);
    setError('');
    try {
      const [summary, reportResult, activity] = await Promise.all([getAdminStats(), getAdminReports(filters), getAuditLogs()]);
      setStats(summary);
      setReports(reportResult.data);
      setLogs(activity);
    } catch {
      setError('We could not load the admin workspace. Please sign in again and try again.');
    } finally {
      setIsLoading(false);
    }
  };

  useEffect(() => { loadDashboard(); }, [filters]);

  // Reload dashboard data after a management action completes.
  const handleAction = async (id, action, value) => {
    try {
      if (action === 'archive') await archiveAdminReport(id);
      else await updateAdminReport(id, action, value);
      setSelectedReport(null);
      await loadDashboard();
    } catch {
      setError('That admin action could not be completed. Please try again.');
    }
  };

  // End the current browser-tab admin session.
  const handleLogout = () => {
    sessionStorage.removeItem('cleansl_admin_token');
    sessionStorage.removeItem('cleansl_admin_email');
    navigate('/admin/login');
  };

  return <section className="admin-dashboard-page">
    <div className="admin-dashboard-header"><div><span className="eyebrow"><ShieldCheck size={15} /> Protected workspace</span><h1>Admin Dashboard</h1><p>Signed in as {email}</p></div><button className="button button-secondary" type="button" onClick={handleLogout}><LogOut size={17} /> Sign out</button></div>
    {error && <div className="admin-error" role="alert"><AlertTriangle size={18} />{error}</div>}
    <div className="admin-stat-grid">{stats && <><AdminStat icon={ClipboardList} label="Total Reports" value={stats.totalReports} /><AdminStat icon={AlertTriangle} label="High Priority" value={stats.highPriorityReports} /><AdminStat icon={LayoutDashboard} label="Pending Review" value={stats.pendingReports} /><AdminStat icon={CheckCircle2} label="Resolved" value={stats.resolvedReports} /></>}</div>
    {stats && <AnalyticsPanel stats={stats} />}
    <div className="admin-content-grid"><section className="admin-queue"><QueueHeader filters={filters} onChange={(event) => setFilters((current) => ({ ...current, [event.target.name]: event.target.value }))} />{isLoading ? <div className="admin-loading">Loading admin reports...</div> : reports.length === 0 ? <div className="admin-loading">No reports match these filters.</div> : <div className="admin-table-wrap"><table className="admin-table"><thead><tr><th>Issue</th><th>Location</th><th>Priority</th><th>Status</th><th>Review</th></tr></thead><tbody>{reports.map((report) => <AdminReportRow key={report._id} report={report} onAction={handleAction} onView={setSelectedReport} />)}</tbody></table></div>}</section><ActivityFeed logs={logs} /></div>
    {selectedReport && <AdminReportModal report={selectedReport} onClose={() => setSelectedReport(null)} onAction={handleAction} />}
  </section>;
};

// Render search and filter controls for the admin review queue.
const QueueHeader = ({ filters, onChange }) => <div className="admin-queue-heading"><div><span className="eyebrow">Review queue</span><h2>Community reports</h2></div><div className="admin-filters"><input name="search" value={filters.search} onChange={onChange} placeholder="Search reports" aria-label="Search admin reports" /><select name="status" value={filters.status} onChange={onChange}><option value="">All statuses</option><option value="Reported">Reported</option><option value="In Review">In Review</option><option value="Resolved">Resolved</option></select><select name="priorityLevel" value={filters.priorityLevel} onChange={onChange}><option value="">All priorities</option><option value="High">High</option><option value="Medium">Medium</option><option value="Low">Low</option></select></div></div>;

// Display one compact dashboard summary metric.
const AdminStat = ({ icon: Icon, label, value }) => <article className="admin-stat"><Icon size={20} /><div><strong>{value}</strong><span>{label}</span></div></article>;

// Compare district and category totals using lightweight proportional bars.
const AnalyticsPanel = ({ stats }) => <section className="analytics-panel"><div className="analytics-heading"><span className="eyebrow"><BarChart3 size={15} /> Community patterns</span><h2>Reports at a glance</h2></div><div className="analytics-grid"><AnalyticsList title="By district" items={stats.byDistrict} /><AnalyticsList title="By category" items={stats.byCategory} /></div></section>;
const AnalyticsList = ({ title, items }) => { const max = Math.max(...items.map((item) => item.count), 1); return <div className="analytics-list"><h3>{title}</h3>{items.length === 0 ? <p className="activity-empty">No data yet.</p> : items.slice(0, 6).map((item) => <div className="bar-row" key={item._id}><div><span>{item._id}</span><strong>{item.count}</strong></div><span className="bar-track"><span className="bar-fill" style={{ width: `${(item.count / max) * 100}%` }} /></span></div>)}</div>; };

// Keep note editing state local to each report row.
const AdminReportRow = ({ report, onAction, onView }) => {
  return <tr><td><strong>{report.wasteType}</strong><small>{report.reporterName}</small></td><td>{report.area}<small>{report.district}</small></td><td><span className={`priority-badge priority-${report.priorityLevel.toLowerCase()}`}>{report.priorityLevel} ({report.priorityScore})</span></td><td><select value={report.status} onChange={(event) => onAction(report._id, 'status', event.target.value)} aria-label={`Status for ${report.wasteType}`}><option>Reported</option><option>In Review</option><option>Resolved</option></select></td><td><div className="admin-actions"><button type="button" className="details-action" onClick={() => onView(report)}><Eye size={14} /> Details</button><button type="button" className="archive-action" onClick={() => window.confirm('Remove this report from the active records?') && onAction(report._id, 'archive')}>Remove</button></div></td></tr>;
};

// Show every report field so administrators can review before acting.
const AdminReportModal = ({ report, onClose, onAction }) => <div className="modal-backdrop" role="presentation" onMouseDown={(event) => event.target === event.currentTarget && onClose()}><div className="details-modal admin-detail-modal" role="dialog" aria-modal="true" aria-labelledby="admin-details-title"><div className="modal-header"><div><span className={`priority-badge priority-${report.priorityLevel.toLowerCase()}`}>{report.priorityLevel} priority</span><h2 id="admin-details-title">{report.wasteType}</h2></div><button className="icon-button" type="button" onClick={onClose} aria-label="Close report details"><X size={21} /></button></div><div className="detail-facts"><p><strong>Reporter</strong>{report.reporterName}</p><p><strong>Location</strong><span><MapPin size={14} />{report.area}, {report.district}</span></p><p><strong>Size</strong>{report.size}</p><p><strong>Urgency</strong>{report.urgency}</p><p><strong>Status</strong>{report.status}</p><p><strong>Score</strong>{report.priorityScore}</p></div>{report.location && <div className="report-coordinates">Coordinates: {report.location.latitude}, {report.location.longitude}</div>}<div className="sensitive-detail">{report.sensitiveLocation ? <><AlertTriangle size={17} /> Near a sensitive location</> : <><CheckCircle2 size={17} /> Not marked as a sensitive location</>}</div><p className="modal-description">{report.description}</p><label className="modal-note-label" htmlFor="modal-admin-note">Internal note</label><textarea id="modal-admin-note" defaultValue={report.adminNote || ''} maxLength={500} onBlur={(event) => onAction(report._id, 'note', event.target.value)} placeholder="Add a review note" /><div className="modal-admin-actions"><button className="button button-primary" type="button" onClick={() => onAction(report._id, 'verify', !report.verified)}>{report.verified ? 'Unverify Report' : 'Verify Report'}</button><button className="button button-secondary" type="button" onClick={onClose}>Close</button></div></div></div>;

// Show recent administrator actions as a compact audit feed.
const ActivityFeed = ({ logs }) => <aside className="activity-feed"><div className="activity-heading"><span className="eyebrow"><Activity size={15} /> Audit trail</span><h2>Recent activity</h2></div>{logs.length === 0 ? <p className="activity-empty">No admin actions recorded yet.</p> : <div className="activity-list">{logs.slice(0, 8).map((log) => <div className="activity-item" key={log._id}><div className="activity-icon"><Clock3 size={15} /></div><div><strong>{log.action}</strong><p>{log.details}</p><small>{new Intl.DateTimeFormat('en', { dateStyle: 'medium', timeStyle: 'short' }).format(new Date(log.createdAt))}</small></div></div>)}</div>}</aside>;

// Redirect visitors to login before mounting protected dashboard hooks.
const AdminDashboard = () => sessionStorage.getItem('cleansl_admin_token') ? <AdminWorkspace /> : <Navigate to="/admin/login" replace />;

export default AdminDashboard;