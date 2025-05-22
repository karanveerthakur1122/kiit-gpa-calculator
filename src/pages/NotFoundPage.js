import '../styles/NotFoundPage.css';
import { Link } from 'react-router-dom';

const NotFoundPage = () => {
  return (
    <div className="not-found-container">
      <div className="animated-element">
        <div className="not-found-code">404</div>
      </div>
      <h1 className="not-found-title">Page Not Found</h1>
      <p className="not-found-message">
        Oops! The page you are looking for doesn't seem to exist. 
        It might have been moved, deleted, or perhaps it never existed at all.
      </p>
      <Link to="/" className="home-button">
        <span>🏠</span> Back to Homepage
      </Link>
    </div>
  );
};

export default NotFoundPage;
