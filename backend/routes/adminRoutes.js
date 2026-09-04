import express from 'express';
import protectAdmin from '../middleware/authMiddleware.js';
import {
  deleteReport,
  getAdminReports,
  getAdminStats,
  getAuditLogs,
  updateReportNote,
  updateReportStatus,
  updateReportVerification
} from '../controllers/adminController.js';

const router = express.Router();

// require jwt
router.use(protectAdmin);
router.get('/stats', getAdminStats);
router.get('/reports', getAdminReports);
router.get('/audit-logs', getAuditLogs);
router.patch('/reports/:id/status', updateReportStatus);
router.patch('/reports/:id/verify', updateReportVerification);
router.patch('/reports/:id/note', updateReportNote);
router.delete('/reports/:id', deleteReport);

export default router;