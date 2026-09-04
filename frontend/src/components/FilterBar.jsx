import { Search, SlidersHorizontal, X } from 'lucide-react';
import sriLankanDistricts from '../data/sriLankanDistricts.js';

// Keep every browsing control together so the page can reset them as one unit.
const FilterBar = ({ filters, onChange, onClear }) => (
  <div className="filter-panel">
    <div className="search-field"><Search size={18} /><input name="search" value={filters.search} onChange={onChange} placeholder="Search by area, district or description..." aria-label="Search reports" /></div>
    <div className="filter-controls"><label><span>District</span><select name="district" value={filters.district} onChange={onChange}><option value="">All Districts</option>{sriLankanDistricts.map((district) => <option value={district} key={district}>{district}</option>)}</select></label><label><span>Waste Category</span><select name="wasteType" value={filters.wasteType} onChange={onChange}><option value="">All Categories</option>{['Illegal Dumping', 'Overflowing Garbage', 'Plastic Waste', 'Organic Waste', 'Construction Waste', 'Hazardous Waste', 'Other'].map((type) => <option value={type} key={type}>{type}</option>)}</select></label><label><span>Priority</span><select name="priorityLevel" value={filters.priorityLevel} onChange={onChange}><option value="">All Priorities</option><option value="Low">Low</option><option value="Medium">Medium</option><option value="High">High</option></select></label><label><span>Status</span><select name="status" value={filters.status} onChange={onChange}><option value="">All Statuses</option><option value="Reported">Reported</option><option value="In Review">In Review</option><option value="Resolved">Resolved</option></select></label><button className="clear-filter-button" type="button" onClick={onClear}><X size={15} /> Clear Filters</button></div>
    <div className="filter-label"><SlidersHorizontal size={15} /> Refine community reports</div>
  </div>
);

export default FilterBar;