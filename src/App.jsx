import { BrowserRouter, Navigate, Route, Routes } from 'react-router-dom';
import HomePage from './HomePage';
import PortalPage from './PortalPage';
import Privacy from './Privacy';
import Terms from './Terms';

function App() {
  return (
    <BrowserRouter>
      <Routes>
        <Route path="/" element={<HomePage />} />
        <Route path="/privacy" element={<Privacy />} />
        <Route path="/terms" element={<Terms />} />
        <Route path="/portal" element={<PortalPage />} />
        <Route path="*" element={<Navigate to="/" replace />} />
      </Routes>
    </BrowserRouter>
  );
}

export default App;
