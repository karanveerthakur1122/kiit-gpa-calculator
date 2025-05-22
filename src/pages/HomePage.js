import { Link } from 'react-router-dom';
import '../styles/HomePage.css';

const ToolCard = ({ title, description, icon, to }) => {
  return (
    <Link to={to} className="tool-card">
      <div className="tool-icon">{icon}</div>
      <h3 className="tool-title">{title}</h3>
      <p className="tool-description">{description}</p>
      <div className="tool-arrow">→</div>
    </Link>
  );
};

const HomePage = () => {
  return (
    <div className="home-page">
      <div className="new-feature-banner">
        <span className="new-feature-icon">✨</span>
        <span className="new-feature-text">New: Auto-fill feature for course codes!</span>
      </div>
      
      <section className="hero-section">
        <div className="container">
          <h1 className="hero-title">KIIT Student Tools</h1>
          <p className="hero-subtitle">
            Empowering KIIT students with essential academic & productivity tools
          </p>          <div className="cta-buttons">
            <Link to="/calculator" className="cta-button primary">
              SGPA Calculator
            </Link>
            <Link to="/result" className="cta-button secondary">
              Result Export
            </Link>
          </div>
        </div>
      </section>

      <section className="tools-section">
        <div className="container">
          <h2 className="section-title">Our Tools</h2>
          <p className="section-description">
            Explore our collection of helpful tools designed specifically for KIIT University students
          </p>          <div className="tools-grid">
            <ToolCard 
              title="SGPA/CGPA Calculator" 
              description="Calculate your Semester GPA and Cumulative GPA easily with our user-friendly calculator"
              icon="🧮"
              to="/calculator"
            />
            <ToolCard 
              title="Result Generator" 
              description="Generate a professional-looking KIIT semester result report for reference"
              icon="📄"
              to="/result"
            />
            <ToolCard 
              title="Save Templates" 
              description="Save your course details as templates to quickly generate results for different semesters"
              icon="💾"
              to="/result"
            />
            <ToolCard 
              title="Export Options" 
              description="Export your results as PDF or JPEG for easy sharing and printing"
              icon="📤"
              to="/result"
            />
          </div>
        </div>
      </section>

      <section className="features-section">
        <div className="container">
          <h2 className="section-title">Why Use KIIT Tools?</h2>
            <div className="features-grid">
            <div className="feature-card">
              <div className="feature-icon">✨</div>
              <h3 className="feature-title">Modern UI</h3>
              <p className="feature-description">
                Clean, intuitive interface designed for the best user experience
              </p>
            </div>
            
            <div className="feature-card">
              <div className="feature-icon">🌙</div>
              <h3 className="feature-title">Dark Mode</h3>
              <p className="feature-description">
                Easy on the eyes with fully supported light and dark themes
              </p>
            </div>
            
            <div className="feature-card">
              <div className="feature-icon">📱</div>
              <h3 className="feature-title">Responsive</h3>
              <p className="feature-description">
                Works perfectly on all devices - desktops, tablets, and smartphones
              </p>
            </div>
            
            <div className="feature-card">
              <div className="feature-icon">🔒</div>
              <h3 className="feature-title">Private</h3>
              <p className="feature-description">
                All calculations happen locally - your data never leaves your device
              </p>
            </div>

            <div className="feature-card">
              <div className="feature-icon">💡</div>
              <h3 className="feature-title">Smart Suggestions</h3>
              <p className="feature-description">
                Auto-complete course names and codes for faster data entry
              </p>
            </div>

            <div className="feature-card">
              <div className="feature-icon">🔄</div>
              <h3 className="feature-title">Data Persistence</h3>
              <p className="feature-description">
                Your data is automatically saved between sessions
              </p>
            </div>
          </div>
        </div>
      </section>

      <section className="highlight-section">
        <div className="container">
          <h2 className="section-title">New Features</h2>
          
          <div className="highlight-card">
            <div className="highlight-icon">🔍</div>
            <div className="highlight-content">
              <h3 className="highlight-title">Smart Course Auto-fill</h3>
              <p className="highlight-description">
                Just start typing a course name, and we'll automatically fill in the corresponding course code! 
                This new feature helps you create your result page faster than ever.
              </p>
            </div>
          </div>
          
          <div className="highlight-card">
            <div className="highlight-icon">💾</div>
            <div className="highlight-content">
              <h3 className="highlight-title">Memory Caching</h3>
              <p className="highlight-description">
                We now remember your personal details between sessions, so you don't have to re-enter your name, 
                roll number, and other information every time you use the tool.
              </p>
            </div>
          </div>
          
          <div className="highlight-card">
            <div className="highlight-icon">🎨</div>
            <div className="highlight-content">
              <h3 className="highlight-title">Improved Visibility</h3>
              <p className="highlight-description">
                Better text visibility in credit and grade boxes, with improved contrast in both light and dark modes
                for a better user experience.
              </p>
            </div>
          </div>
        </div>
      </section>
    </div>
  );
};

export default HomePage;
