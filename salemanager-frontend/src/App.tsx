// Main App Component
import { Routes, Route, Navigate } from 'react-router-dom';
import Layout from './components/Layout/Layout';
import Dashboard from './pages/Dashboard';
import Customers from './pages/Customers';
import Leads from './pages/Leads';
import Pipeline from './pages/Pipeline';
import Activities from './pages/Activities';
import EmailCampaign from './pages/EmailCampaign';
import { useApp } from './contexts/AppContext';
import Notification from './components/common/Notification';

function App() {
  const { notification } = useApp();

  return (
    <div className="min-h-screen">
      <Routes>
        <Route path="/" element={<Layout />}>
          <Route index element={<Dashboard />} />
          <Route path="customers" element={<Customers />} />
          <Route path="leads" element={<Leads />} />
          <Route path="pipeline" element={<Pipeline />} />
          <Route path="activities" element={<Activities />} />
          <Route path="email" element={<EmailCampaign />} />
          <Route path="*" element={<Navigate to="/" replace />} />
        </Route>
      </Routes>
      {notification && <Notification message={notification.message} type={notification.type} />}
    </div>
  );
}

export default App;
