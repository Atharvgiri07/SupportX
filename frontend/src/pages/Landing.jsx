import LandingNavbar from '../components/landing/LandingNavbar';
import LandingHero from '../components/landing/LandingHero';
import LandingPortals from '../components/landing/LandingPortals';
import LandingTrust from '../components/landing/LandingTrust';
import LandingFeatures from '../components/landing/LandingFeatures';
import LandingAIReport from '../components/landing/LandingAIReport';
import LandingAnalytics from '../components/landing/LandingAnalytics';
import LandingFAQ from '../components/landing/LandingFAQ';
import LandingCTA from '../components/landing/LandingCTA';
import LandingFooter from '../components/landing/LandingFooter';
import './Landing.css';

const Landing = () => {
  return (
    <div className="landing-page-root">
      {/* Sticky Header Navbar */}
      <LandingNavbar />

      {/* Main Hero & Content Flow */}
      <main>
        <LandingHero />
        <LandingPortals />
        <LandingTrust />
        <LandingFeatures />
        <LandingAIReport />
        <LandingAnalytics />
        <LandingFAQ />
        <LandingCTA />
      </main>

      {/* Enterprise Footer with All System Capabilities & Modules */}
      <LandingFooter />
    </div>
  );
};

export default Landing;

