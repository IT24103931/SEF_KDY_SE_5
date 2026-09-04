import { AlertCircle, CheckCircle2, Code2, HeartHandshake, Leaf, Users } from 'lucide-react';

const audience = ['Residents', 'Students', 'Businesses', 'Local communities', 'Visitors'];
const values = ['Improves awareness of waste problems', 'Helps identify urgent issues', 'Organizes community reports', 'Encourages cleaner public spaces'];

const About = () => (
  <>
    {/* Give the About page a clear context-setting header. */}
    <section className="inner-hero"><div className="container inner-hero-content"><span className="eyebrow"><Leaf size={15} /> Our purpose</span><h1>About CleanSL</h1><p>A community-focused prototype designed to make local waste problems easier to report, discover and prioritize.</p></div></section>
    <section className="about-section"><div className="container about-intro-grid">
      {/* Explain both the problem and the proposed response in plain language. */}
      <div className="section-heading"><span className="eyebrow">The bigger picture</span><h2>Turning local observations into shared awareness.</h2></div><div className="about-copy"><h3>The Problem</h3><p>Community waste issues can be easy to overlook when there is no simple place to record them. Reports about dumping, overflowing garbage or waste near sensitive places can become scattered and difficult to compare.</p><h3>Our Solution</h3><p>CleanSL gives people a straightforward way to describe a local issue. It then processes the details into a priority level, helping visitors discover which reports may need closer attention.</p></div>
    </div></section>
    <section className="about-detail-section"><div className="container detail-grid">
      {/* List the intended audience and expected value without claiming official authority. */}
      <article className="detail-panel"><div className="detail-icon"><Users size={22} /></div><h2>Who It Helps</h2><ul className="check-list">{audience.map((item) => <li key={item}><CheckCircle2 size={17} />{item}</li>)}</ul></article><article className="detail-panel"><div className="detail-icon"><HeartHandshake size={22} /></div><h2>Expected Community Value</h2><ul className="check-list">{values.map((item) => <li key={item}><CheckCircle2 size={17} />{item}</li>)}</ul></article>
    </div></section>
    <section className="technology-section"><div className="container technology-content"><div><span className="eyebrow"><Code2 size={15} /> Built for learning</span><h2>Technology Used</h2></div><p>CleanSL uses React and Vite for the interface, Node.js and Express for the API, and MongoDB with Mongoose for report storage. It is prepared for Vercel and Render deployment.</p></div></section>
    {/* Make the prototype status prominent so visitors understand the scope of the system. */}
    <section className="disclaimer-section"><div className="container disclaimer-box"><AlertCircle size={22} /><p>CleanSL is a university hackathon prototype and is not an official government reporting service.</p></div></section>
  </>
);

export default About;
