import { SearchX } from 'lucide-react';

// Give visitors a useful next action when their current query finds nothing.
const EmptyState = ({ onClear }) => (
  <div className="empty-state"><SearchX size={38} /><h2>No matching reports</h2><p>No waste reports match your current search or filters.</p><button className="button button-secondary" type="button" onClick={onClear}>Clear Filters</button></div>
);

export default EmptyState;