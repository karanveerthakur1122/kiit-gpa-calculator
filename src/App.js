// filepath: d:\WebDev\React Project\Kiit Tools\kiit-gpa-calculator\src\App.js
import { BrowserRouter as Router, Routes, Route } from 'react-router-dom';
import './App.css';

// Import layouts
import MainLayout from './layouts/MainLayout';

// Import pages
import HomePage from './pages/HomePage';
import CalculatorPage from './pages/CalculatorPage';
import ResultPage from './pages/ResultPage';
import DocumentationPage from './pages/DocumentationPage';
import NotFoundPage from './pages/NotFoundPage';

function App() {
  return (
    <Router>
      <Routes>
        <Route path="/" element={<MainLayout />}>
          <Route index element={<HomePage />} />
          <Route path="calculator" element={<CalculatorPage />} />
          <Route path="result" element={<ResultPage />} />
          <Route path="documentation" element={<DocumentationPage />} />
          <Route path="*" element={<NotFoundPage />} />
        </Route>
      </Routes>
    </Router>
  );
}

export default App;
