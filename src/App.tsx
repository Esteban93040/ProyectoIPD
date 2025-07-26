import { BrowserRouter as Router, Routes, Route, Navigate } from 'react-router-dom';
import Navbar from './components/header/header';
import Home from './pages/home';
import SentimentalPage from './pages/SentimentalPage';
import FiveMinPage from './pages/FiveMinPage';
import './App.css';

function App() {
  return (
    <Router>
      <Navbar />
      <Routes>
        <Route path="/" element={<Navigate to="/home" replace />} />
        <Route path="/home" element={<Home />} />
        <Route path="/sentimental" element={<SentimentalPage />} />
        <Route path="/clientes" element={<FiveMinPage />} />
      </Routes>
    </Router>
  );
}

export default App;
