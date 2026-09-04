// Give users feedback while a page waits for an API response.
const LoadingSpinner = ({ label = 'Loading...' }) => (
  <div className="loading-state" role="status"><span className="spinner" aria-hidden="true" /><span>{label}</span></div>
);

export default LoadingSpinner;