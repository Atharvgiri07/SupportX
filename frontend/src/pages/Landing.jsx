import LandingNavbar from '../components/landing/LandingNavbar';
import LandingHero from '../components/landing/LandingHero';
import LandingTrust from '../components/landing/LandingTrust';
import LandingCTA from '../components/landing/LandingCTA';
import LandingFooter from '../components/landing/LandingFooter';
import './Landing.css';

const Landing = () => {
  return (
    <div className="landing-page-root">
      {/* Sticky Header Navbar */}
      <LandingNavbar />

      {/* Main Hero & Trust Content */}
      <main>
        <LandingHero />
        <LandingTrust />
        <LandingCTA />
      </main>

      {/* Enterprise Footer with All System Capabilities & Modules */}
      <LandingFooter />
    </div>
  );
};

export default Landing;
