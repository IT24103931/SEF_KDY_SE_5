import { ArrowRight, KeyRound, Leaf, ShieldCheck } from 'lucide-react';
import { useState } from 'react';
import { Link, useNavigate } from 'react-router-dom';
import { adminLogin } from '../services/api.js';

// keep admin login.
const AdminLogin = () => {
  const navigate = useNavigate();
  const [credentials, setCredentials] = useState({ email: '', password: '' });
  const [error, setError] = useState('');
  const [isSubmitting, setIsSubmitting] = useState(false);

  // Update either credential field and clear an old failed-login message.
  const handleChange = (event) => {
    setCredentials((current) => ({ ...current, [event.target.name]: event.target.value }));
    setError('');
  };

  // Authenticate with the API and keep the temporary token for future admin pages.
  const handleSubmit = async (event) => {
    event.preventDefault();
    if (!credentials.email.trim() || !credentials.password) {
      setError('Please enter your admin email and password.');
      return;
    }

    setIsSubmitting(true);
    try {
      const { token, admin } = await adminLogin({ email: credentials.email.trim(), password: credentials.password });
      sessionStorage.setItem('cleansl_admin_token', token);
      sessionStorage.setItem('cleansl_admin_email', admin.email);
      navigate('/admin/dashboard');
    } catch (loginError) {
      setError(loginError.response?.data?.message || 'We could not sign you in right now. Please try again.');
    } finally {
      setIsSubmitting(false);
    }
  };

  return <section className="admin-login-page"><div className="admin-login-panel"><Link className="brand" to="/"><span className="brand-mark"><Leaf size={19} /></span><span>CleanSL</span></Link><div className="admin-login-heading"><div className="admin-login-icon"><ShieldCheck size={25} /></div><span className="eyebrow">Restricted workspace</span><h1>Admin sign in</h1><p>Manage community reports from a secure administrator account.</p></div><form className="admin-login-form" onSubmit={handleSubmit} noValidate><label className="field-label" htmlFor="admin-email">Admin email</label><input id="admin-email" name="email" type="email" autoComplete="username" value={credentials.email} onChange={handleChange} placeholder="admin@example.com" /><label className="field-label" htmlFor="admin-password">Password</label><input id="admin-password" name="password" type="password" autoComplete="current-password" value={credentials.password} onChange={handleChange} placeholder="Enter your password" />{error && <p className="admin-login-error" role="alert"><KeyRound size={16} />{error}</p>}<button className="button button-primary" type="submit" disabled={isSubmitting}>{isSubmitting ? 'Signing in...' : 'Sign in'} <ArrowRight size={17} /></button></form><p className="admin-login-note">Admin access is separate from public report submission.</p></div></section>;
};

export default AdminLogin;