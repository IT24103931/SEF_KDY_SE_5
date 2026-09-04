import Report from '../models/Report.js';
import AuditLog from '../models/AuditLog.js';

const statuses = ['Reported', 'In Review', 'Resolved'];
const activeReportFilter = { $or: [{ isDeleted: false }, { isDeleted: { $exists: false } }] };

// Record changes with the authenticated administrator identity for later review.
const logAction = async (adminId, reportId, action, details) => {
  await AuditLog.create({ adminId, reportId, action, details });
};

// Return dashboard totals and simple breakdowns for the administrator.
const getAdminStats = async (req, res, next) => {
  try {
    const [totalReports, highPriorityReports, pendingReports, resolvedReports, byDistrict, byCategory] = await Promise.all([
      Report.countDocuments(activeReportFilter),
      Report.countDocuments({ ...activeReportFilter, priorityLevel: 'High' }),
      Report.countDocuments({ ...activeReportFilter, status: { $in: ['Reported', 'In Review'] } }),
      Report.countDocuments({ ...activeReportFilter, status: 'Resolved' }),
      Report.aggregate([{ $match: activeReportFilter }, { $group: { _id: '$district', count: { $sum: 1 } } }, { $sort: { count: -1 } }]),
      Report.aggregate([{ $match: activeReportFilter }, { $group: { _id: '$wasteType', count: { $sum: 1 } } }, { $sort: { count: -1 } }])
    ]);

    return res.json({ success: true, data: { totalReports, highPriorityReports, pendingReports, resolvedReports, byDistrict, byCategory } });
  } catch (error) {
    return next(error);
  }
};

// Return the admin's report queue, including verification and note fields.
const getAdminReports = async (req, res, next) => {
  try {
    const { status, priorityLevel, district, search, sort = 'newest' } = req.query;
    const query = { $and: [activeReportFilter] };
    if (status) query.status = status;
    if (priorityLevel) query.priorityLevel = priorityLevel;
    if (district) query.district = district;
    if (search?.trim()) {
      const expression = new RegExp(search.trim().replace(/[.*+?^${}()|[\]\\]/g, '\\$&'), 'i');
      query.$and.push({ $or: [{ area: expression }, { district: expression }, { description: expression }, { reporterName: expression }] });
    }

    const sortOption = sort === 'oldest' ? { createdAt: 1 } : sort === 'priority' ? { priorityScore: -1, createdAt: -1 } : { createdAt: -1 };
    const reports = await Report.find(query).sort(sortOption).lean();
    return res.json({ success: true, count: reports.length, data: reports });
  } catch (error) {
    return next(error);
  }
};

// Apply an administrator's review status and record when a report is resolved.
const updateReportStatus = async (req, res, next) => {
  try {
    const { status } = req.body;
    if (!statuses.includes(status)) return res.status(400).json({ success: false, message: 'Status is invalid.' });
    const report = await Report.findOne({ $and: [{ _id: req.params.id }, activeReportFilter] });
    if (!report) return res.status(404).json({ success: false, message: 'Report not found.' });
    report.status = status;
    report.resolvedAt = status === 'Resolved' ? new Date() : undefined;
    await report.save();
    await logAction(req.admin.id, report._id, 'status', `Status changed to ${status}`);
    return res.json({ success: true, data: report });
  } catch (error) {
    return next(error);
  }
};

// Mark a report as verified or unverified after administrator review.
const updateReportVerification = async (req, res, next) => {
  try {
    if (typeof req.body.verified !== 'boolean') return res.status(400).json({ success: false, message: 'Verified must be true or false.' });
    const report = await Report.findOneAndUpdate({ $and: [{ _id: req.params.id }, activeReportFilter] }, { verified: req.body.verified }, { new: true, runValidators: true }).lean();
    if (!report) return res.status(404).json({ success: false, message: 'Report not found.' });
    await logAction(req.admin.id, report._id, 'verify', `Verification set to ${req.body.verified}`);
    return res.json({ success: true, data: report });
  } catch (error) {
    return next(error);
  }
};

// Save a short internal note without exposing admin-only controls to public users.
const updateReportNote = async (req, res, next) => {
  try {
    const adminNote = typeof req.body.adminNote === 'string' ? req.body.adminNote.trim() : '';
    if (adminNote.length > 500) return res.status(400).json({ success: false, message: 'Admin note cannot exceed 500 characters.' });
    const report = await Report.findOneAndUpdate({ $and: [{ _id: req.params.id }, activeReportFilter] }, { adminNote }, { new: true, runValidators: true }).lean();
    if (!report) return res.status(404).json({ success: false, message: 'Report not found.' });
    await logAction(req.admin.id, report._id, 'note', adminNote ? 'Admin note updated' : 'Admin note cleared');
    return res.json({ success: true, data: report });
  } catch (error) {
    return next(error);
  }
};

// Archive a report instead of permanently deleting the community record.
const deleteReport = async (req, res, next) => {
  try {
    const report = await Report.findOneAndUpdate({ $and: [{ _id: req.params.id }, activeReportFilter] }, { isDeleted: true, deletedAt: new Date() }, { new: true }).lean();
    if (!report) return res.status(404).json({ success: false, message: 'Report not found.' });
    await logAction(req.admin.id, report._id, 'archive', 'Report archived');
    return res.json({ success: true, message: 'Report archived successfully.' });
  } catch (error) {
    return next(error);
  }
};

// Return the newest admin actions for a protected activity feed.
const getAuditLogs = async (req, res, next) => {
  try {
    const logs = await AuditLog.find().sort({ createdAt: -1 }).limit(50).populate('reportId', 'wasteType area district').lean();
    return res.json({ success: true, data: logs });
  } catch (error) {
    return next(error);
  }
};

export { deleteReport, getAdminReports, getAdminStats, getAuditLogs, updateReportNote, updateReportStatus, updateReportVerification };