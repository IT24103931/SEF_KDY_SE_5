import { AlertTriangle, BarChart3, Building2, CheckCircle2, ChevronRight, Leaf, MapPin, Search, ShieldCheck, Users } from 'lucide-react';
import { useEffect, useState } from 'react';
import { Link } from 'react-router-dom';
import LoadingSpinner from '../components/LoadingSpinner.jsx';
import StatCard from '../components/StatCard.jsx';
import { getSummaryStats } from '../services/api.js';

const defaultStats = { totalReports: 0, highPriorityReports: 0, districtCount: 0, resolvedReports: 0 };
const steps = [
  { number: '01', title: 'REPORT', text: 'Tell the community where the waste problem is and what happened.', icon: MapPin },
  { number: '02', title: 'PRIORITIZE', text: 'CleanSL processes the report and calculates its priority.', icon: BarChart3 },
  { number: '03', title: 'DISCOVER', text: 'Community members can search and filter reported problems.', icon: Search }
];

const Home = () => {
  const [stats, setStats] = useState(defaultStats);
  const [isLoading, setIsLoading] = useState(true);
  const [hasError, setHasError] = useState(false);

  // Load statistics when the home page opens so counters reflect MongoDB data.
  const loadStats = async () => {
    setIsLoading(true);
    setHasError(false);
    try {
      setStats(await getSummaryStats());
    } catch {
      setHasError(true);
    } finally {
      setIsLoading(false);
    }
  };

  useEffect(() => { loadStats(); }, []);

  return (
    <>
      {/* Hero introduces the product and points visitors toward the two core actions. */}
      <section className="hero-section"><div className="container hero-content">
        <div className="hero-copy"><span className="eyebrow"><Leaf size={15} /> Community-led change</span>
          <h1>Cleaner Communities Start With Reporting</h1>
          <p>CleanSL helps Sri Lankan communities report local waste problems, identify urgent issues and raise awareness about cleaner public spaces.</p>
          <div className="hero-actions"><Link className="button button-primary" to="/report">Report an Issue <ChevronRight size={18} /></Link><Link className="button button-secondary" to="/reports">View Community Reports</Link><Link className="admin-home-link" to="/admin/login"><ShieldCheck size={16} /> Admin Login</Link></div>
        </div>
        <div className="hero-visual" aria-label="Illustration of a connected clean community"><div className="hero-orbit orbit-one" /><div className="hero-orbit orbit-two" /><div className="hero-center"><Leaf size={68} strokeWidth={1.4} /></div><div className="hero-node node-one"><MapPin size={22} /></div><div className="hero-node node-two"><Users size={22} /></div><div className="hero-node node-three"><CheckCircle2 size={22} /></div></div>
      </div></section>

      {/* These figures come from the backend summary endpoint, never hard-coded demo counters. */}
      <section className="stats-section" aria-labelledby="stats-heading"><div className="container">
        <div className="section-heading compact-heading"><div><span className="eyebrow">Live community pulse</span><h2 id="stats-heading">Reports that help communities see clearly.</h2></div>{isLoading && <LoadingSpinner label="Updating statistics" />}</div>
        {hasError ? <div className="inline-error"><span>We couldn&apos;t load the community statistics right now.</span><button className="text-button" type="button" onClick={loadStats}>Try Again</button></div> : <div className="stats-grid"><StatCard label="Total Reports" value={stats.totalReports} icon={Building2} /><StatCard label="High Priority Issues" value={stats.highPriorityReports} icon={AlertTriangle} tone="amber" /><StatCard label="Districts Represented" value={stats.districtCount} icon={MapPin} tone="blue" /><StatCard label="Resolved Issues" value={stats.resolvedReports} icon={CheckCircle2} /></div>}
      </div></section>

      {/* Explain the local problem without unsupported claims or statistics. */}
      <section className="problem-section"><div className="container problem-grid"><div className="section-heading"><span className="eyebrow">A shared responsibility</span><h2 id="why-heading">Why CleanSL Matters</h2></div><div className="problem-copy"><p>Illegal dumping, overflowing bins, plastic waste and hazardous materials can affect community cleanliness, public spaces, drainage, waterways and people&apos;s surroundings.</p><p>Residents, students, local communities, commuters, businesses and visitors all benefit when local problems are easier to notice, organize and discuss.</p></div></div></section>

      {/* Show the three-step product workflow in the same order used in the demo. */}
      <section className="steps-section"><div className="container"><div className="section-heading centered-heading"><span className="eyebrow">Simple by design</span><h2>How CleanSL works</h2></div><div className="steps-grid">{steps.map((step) => <article className="step-card" key={step.number}><div className="step-topline"><span>{step.number}</span><step.icon size={23} /></div><h3>{step.title}</h3><p>{step.text}</p></article>)}</div></div></section>

      {/* Close the page with a direct invitation to submit a report. */}
      <section className="cta-section"><div className="container cta-content"><div><span className="eyebrow">Your observation matters</span><h2>See a waste problem in your community?</h2></div><Link className="button button-light" to="/report">Report It Now <ChevronRight size={18} /></Link></div></section>
    </>
  );
};

export default Home;
