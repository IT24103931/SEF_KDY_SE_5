import { Leaf } from 'lucide-react';
import { Link } from 'react-router-dom';

const Footer = () => (
  <footer className="site-footer">
    <div className="container footer-grid">
      {/* Keep supporting navigation available without taking focus from the main content. */}
      <div>
        <Link className="brand footer-brand" to="/">
          <span className="brand-mark"><Leaf size={18} /></span>
          <span>CleanSL</span>
        </Link>
        <p className="footer-tagline">Cleaner Communities Start With Reporting</p>
      </div>
      <div>
        <p className="footer-heading">Quick Links</p>
        <div className="footer-links">
          <Link to="/">Home</Link>
          <Link to="/report">Report Issue</Link>
          <Link to="/reports">Community Reports</Link>
          <Link to="/about">About</Link>
        </div>
      </div>
    </div>
    <div className="container footer-bottom">
      <p>Built for Sri Lankan communities as part of the SE3090 Mini Hackathon.</p>
    </div>
  </footer>
);

export default Footer;
