import { Link } from 'react-router-dom';
import '../styles/Footer.css';

const Footer = () => {
  return (
    <footer className="main-footer">
      <div className="container">
        <div className="footer-content">
          <div className="footer-section">
            <h3 className="footer-title">KIIT Tools</h3>
            <p className="footer-description">
              A comprehensive collection of tools and resources designed specifically 
              for KIIT University students to enhance their academic experience.
            </p>
          </div>          <div className="footer-section">
            <h3 className="footer-title">Quick Links</h3>
            <ul className="footer-links">
              <li><Link to="/">Home</Link></li>
              <li><Link to="/calculator">SGPA/CGPA Calculator</Link></li>
            </ul>
          </div>            <div className="footer-section">
            <h3 className="footer-title">Connect</h3>
            <ul className="social-links">
              <li><a href="https://github.com/karanveerthakur1122" target="_blank" rel="noopener noreferrer">GitHub</a></li>
              <li><a href="https://www.linkedin.com/in/karanveerthakur1122/" target="_blank" rel="noopener noreferrer">LinkedIn</a></li>
              <li><a href="mailto:karanveerthakur1122@gmail.com">Contact</a></li>
            </ul>
          </div>
        </div>          <div className="footer-bottom">
          <p className="copyright">
            &copy; {new Date().getFullYear()} KIIT SGPA/CGPA Calculator |            <a href="https://github.com/karanveerthakur1122" 
               target="_blank" 
               rel="noopener noreferrer"
               style={{ marginLeft: '5px', color: 'white', textDecoration: 'none', fontWeight: 'bold' }}>
              Karan Veer Thakur
            </a>
          </p>
        </div>
      </div>
    </footer>
  );
};

export default Footer;
