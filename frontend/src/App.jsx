import React from 'react';
import { BrowserRouter, Routes, Route, Navigate } from 'react-router-dom';
import { Toaster } from 'react-hot-toast';
import { AuthProvider, useAuth } from './context/AuthContext';
import { ThemeProvider } from './context/ThemeContext';
import { MainLayout } from './components/layouts/MainLayout';

// Landing & Portals
import { LandingPage } from './pages/LandingPage';
import { PortalSelector } from './pages/PortalSelector';
import { AdminLogin } from './pages/AdminLogin';
import { DoctorLogin } from './pages/DoctorLogin';
import { PatientLogin } from './pages/PatientLogin';
import { AnalystLogin } from './pages/AnalystLogin';

// Role Dashboards & Enterprise Modules
import { PatientDashboard } from './pages/PatientDashboard';
import { DoctorDashboard } from './pages/DoctorDashboard';
import { AnalystDashboard } from './pages/AnalystDashboard';
import { EmergencyCommandCenter } from './pages/EmergencyCommandCenter';
import { MetadataCatalog } from './pages/MetadataCatalog';

// Admin / Data Engineer Workspace Pages
import { Dashboard } from './pages/Dashboard';
import { DataUpload } from './pages/DataUpload';
import { BronzeLayer } from './pages/BronzeLayer';
import { SilverLayer } from './pages/SilverLayer';
import { GoldLayer } from './pages/GoldLayer';
import { Patients } from './pages/Patients';
import { Doctors } from './pages/Doctors';
import { Hospitals } from './pages/Hospitals';
import { Appointments } from './pages/Appointments';
import { DiseaseAnalytics } from './pages/DiseaseAnalytics';
import { ETLPipeline } from './pages/ETLPipeline';
import { DataLineage } from './pages/DataLineage';
import { AirflowJobs } from './pages/AirflowJobs';
import { DataQuality } from './pages/DataQuality';
import { Monitoring } from './pages/Monitoring';
import { AuditLogs } from './pages/AuditLogs';
import { Reports } from './pages/Reports';
import { Settings } from './pages/Settings';
import { Profile } from './pages/Profile';

const ProtectedAdminRoute = ({ children }) => {
  const { isAuthenticated, loading } = useAuth();
  if (loading) return null;
  if (!isAuthenticated) return <Navigate to="/admin/login" replace />;
  return <MainLayout>{children}</MainLayout>;
};

const ProtectedPatientRoute = ({ children }) => {
  const { isAuthenticated, loading } = useAuth();
  if (loading) return null;
  if (!isAuthenticated) return <Navigate to="/patient/login" replace />;
  return children;
};

const ProtectedDoctorRoute = ({ children }) => {
  const { isAuthenticated, loading } = useAuth();
  if (loading) return null;
  if (!isAuthenticated) return <Navigate to="/doctor/login" replace />;
  return children;
};

const ProtectedAnalystRoute = ({ children }) => {
  const { isAuthenticated, loading } = useAuth();
  if (loading) return null;
  if (!isAuthenticated) return <Navigate to="/analyst/login" replace />;
  return children;
};

export function App() {
  return (
    <ThemeProvider>
      <AuthProvider>
        <BrowserRouter>
          <Toaster position="top-right" toastOptions={{ duration: 3000 }} />
          <Routes>
            {/* Animated Landing Page & Portal Selector */}
            <Route path="/" element={<LandingPage />} />
            <Route path="/portals" element={<PortalSelector />} />

            {/* Dedicated Portal Logins */}
            <Route path="/admin/login" element={<AdminLogin />} />
            <Route path="/doctor/login" element={<DoctorLogin />} />
            <Route path="/patient/login" element={<PatientLogin />} />
            <Route path="/analyst/login" element={<AnalystLogin />} />

            {/* Dedicated Role Dashboards */}
            <Route path="/patient/dashboard" element={<ProtectedPatientRoute><PatientDashboard /></ProtectedPatientRoute>} />
            <Route path="/doctor/dashboard" element={<ProtectedDoctorRoute><DoctorDashboard /></ProtectedDoctorRoute>} />
            <Route path="/analytics/dashboard" element={<ProtectedAnalystRoute><AnalystDashboard /></ProtectedAnalystRoute>} />

            {/* Admin / Data Engineering Workspace Routes */}
            <Route path="/admin/dashboard" element={<ProtectedAdminRoute><Dashboard /></ProtectedAdminRoute>} />
            <Route path="/upload" element={<ProtectedAdminRoute><DataUpload /></ProtectedAdminRoute>} />
            <Route path="/bronze" element={<ProtectedAdminRoute><BronzeLayer /></ProtectedAdminRoute>} />
            <Route path="/silver" element={<ProtectedAdminRoute><SilverLayer /></ProtectedAdminRoute>} />
            <Route path="/gold" element={<ProtectedAdminRoute><GoldLayer /></ProtectedAdminRoute>} />
            <Route path="/patients" element={<ProtectedAdminRoute><Patients /></ProtectedAdminRoute>} />
            <Route path="/doctors" element={<ProtectedAdminRoute><Doctors /></ProtectedAdminRoute>} />
            <Route path="/hospitals" element={<ProtectedAdminRoute><Hospitals /></ProtectedAdminRoute>} />
            <Route path="/appointments" element={<ProtectedAdminRoute><Appointments /></ProtectedAdminRoute>} />
            <Route path="/disease-analytics" element={<ProtectedAdminRoute><DiseaseAnalytics /></ProtectedAdminRoute>} />
            <Route path="/emergency-command" element={<ProtectedAdminRoute><EmergencyCommandCenter /></ProtectedAdminRoute>} />
            <Route path="/catalog" element={<ProtectedAdminRoute><MetadataCatalog /></ProtectedAdminRoute>} />
            <Route path="/etl-pipeline" element={<ProtectedAdminRoute><ETLPipeline /></ProtectedAdminRoute>} />
            <Route path="/lineage" element={<ProtectedAdminRoute><DataLineage /></ProtectedAdminRoute>} />
            <Route path="/airflow-jobs" element={<ProtectedAdminRoute><AirflowJobs /></ProtectedAdminRoute>} />
            <Route path="/data-quality" element={<ProtectedAdminRoute><DataQuality /></ProtectedAdminRoute>} />
            <Route path="/monitoring" element={<ProtectedAdminRoute><Monitoring /></ProtectedAdminRoute>} />
            <Route path="/audit" element={<ProtectedAdminRoute><AuditLogs /></ProtectedAdminRoute>} />
            <Route path="/reports" element={<ProtectedAdminRoute><Reports /></ProtectedAdminRoute>} />
            <Route path="/settings" element={<ProtectedAdminRoute><Settings /></ProtectedAdminRoute>} />
            <Route path="/profile" element={<ProtectedAdminRoute><Profile /></ProtectedAdminRoute>} />

            {/* Catch-all redirect */}
            <Route path="*" element={<Navigate to="/" replace />} />
          </Routes>
        </BrowserRouter>
      </AuthProvider>
    </ThemeProvider>
  );
}

export default App;
