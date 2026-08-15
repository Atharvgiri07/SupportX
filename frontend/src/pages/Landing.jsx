import LandingNavbar from '../components/landing/LandingNavbar';
import LandingHero from '../components/landing/LandingHero';
import LandingPortals from '../components/landing/LandingPortals';
import LandingTrust from '../components/landing/LandingTrust';
import LandingCTA from '../components/landing/LandingCTA';
import LandingFooter from '../components/landing/LandingFooter';
import './Landing.css';

const Landing = () => {
  return (
    <div className="landing-page-root">
      {/* Sticky Header Navbar */}
      <LandingNavbar />

      {/* Main Hero & Portals Flow */}
      <main>
        <LandingHero />
        <LandingPortals />
        <LandingTrust />
        <LandingCTA />
      </main>

      {/* Enterprise Footer */}
      <LandingFooter />
    </div>
  );
};

export default Landing;


