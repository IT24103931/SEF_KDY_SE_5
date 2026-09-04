import mongoose from 'mongoose';

// Keep a lightweight history of important administrator actions for accountability.
const auditLogSchema = new mongoose.Schema({
  adminId: { type: mongoose.Schema.Types.ObjectId, ref: 'Admin', required: true },
  reportId: { type: mongoose.Schema.Types.ObjectId, ref: 'Report', required: true },
  action: { type: String, enum: ['status', 'verify', 'note', 'archive'], required: true },
  details: { type: String, maxlength: 500 }
}, { timestamps: true });

const AuditLog = mongoose.model('AuditLog', auditLogSchema);

export default AuditLog;