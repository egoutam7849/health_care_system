import React from 'react';
import { BrowserRouter, Routes, Route, Navigate } from 'react-router-dom';
import { Toaster } from 'react-hot-toast';
import { AuthProvider, useAuth } from './context/AuthContext';
import { ThemeProvider } from './context/ThemeContext';
import { MainLayout } from './components/layouts/MainLayout';
import { DoctorLayout } from './components/layouts/DoctorLayout';

// Landing & Portals
import { LandingPage } from './pages/LandingPage';
import { PortalSelector } from './pages/PortalSelector';
import { AdminLogin } from './pages/AdminLogin';
import { DoctorLogin } from './pages/DoctorLogin';
import { PatientLogin } from './pages/PatientLogin';
import { AnalystLogin } from './pages/AnalystLogin';

// Patient Portal Pages
import { PatientLayout } from './components/layouts/PatientLayout';
import { PatientDashboard } from './pages/PatientDashboard';
import { PatientMyHealth } from './pages/PatientMyHealth';
import { PatientAppointments } from './pages/PatientAppointments';
import { PatientRecords } from './pages/PatientRecords';
import { PatientPrescriptions } from './pages/PatientPrescriptions';
import { PatientLabReports } from './pages/PatientLabReports';
import { PatientHealthMetrics } from './pages/PatientHealthMetrics';
import { PatientBilling } from './pages/PatientBilling';
import { PatientMessages } from './pages/PatientMessages';
import { PatientNotifications } from './pages/PatientNotifications';
import { PatientAIAssistant } from './pages/PatientAIAssistant';
import { PatientDocuments } from './pages/PatientDocuments';
import { PatientProfile } from './pages/PatientProfile';
import { PatientSettings } from './pages/PatientSettings';

// Analyst Portal Pages
import { AnalystDashboard } from './pages/AnalystDashboard';
import { EmergencyCommandCenter } from './pages/EmergencyCommandCenter';
import { MetadataCatalog } from './pages/MetadataCatalog';

// Doctor Portal Pages
import { DoctorDashboard } from './pages/DoctorDashboard';
import { DoctorPatients } from './pages/DoctorPatients';
import { DoctorAppointments } from './pages/DoctorAppointments';
import { DoctorLaboratory } from './pages/DoctorLaboratory';
import { DoctorAIAssistant } from './pages/DoctorAIAssistant';
import { DoctorPerformance } from './pages/DoctorPerformance';

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
          <React.Suspense fallback={<div className="min-h-screen bg-slate-950 flex items-center justify-center text-white">Loading HealthFlow AI...</div>}>
            <Routes>
              {/* Animated Landing Page & Portal Selector */}
              <Route path="/" element={<LandingPage />} />
              <Route path="/portals" element={<PortalSelector />} />

              {/* Dedicated Portal Logins */}
              <Route path="/admin/login" element={<AdminLogin />} />
              <Route path="/doctor/login" element={<DoctorLogin />} />
              <Route path="/patient/login" element={<PatientLogin />} />
              <Route path="/analyst/login" element={<AnalystLogin />} />

              {/* Patient Portal — Digital Health Workspace */}
              <Route path="/patient" element={<Navigate to="/patient/dashboard" replace />} />
              <Route path="/patient/dashboard" element={<ProtectedPatientRoute><PatientLayout><PatientDashboard /></PatientLayout></ProtectedPatientRoute>} />
              <Route path="/patient/my-health" element={<ProtectedPatientRoute><PatientLayout><PatientMyHealth /></PatientLayout></ProtectedPatientRoute>} />
              <Route path="/patient/appointments" element={<ProtectedPatientRoute><PatientLayout><PatientAppointments /></PatientLayout></ProtectedPatientRoute>} />
              <Route path="/patient/records" element={<ProtectedPatientRoute><PatientLayout><PatientRecords /></PatientLayout></ProtectedPatientRoute>} />
              <Route path="/patient/prescriptions" element={<ProtectedPatientRoute><PatientLayout><PatientPrescriptions /></PatientLayout></ProtectedPatientRoute>} />
              <Route path="/patient/lab-reports" element={<ProtectedPatientRoute><PatientLayout><PatientLabReports /></PatientLayout></ProtectedPatientRoute>} />
              <Route path="/patient/metrics" element={<ProtectedPatientRoute><PatientLayout><PatientHealthMetrics /></PatientLayout></ProtectedPatientRoute>} />
              <Route path="/patient/billing" element={<ProtectedPatientRoute><PatientLayout><PatientBilling /></PatientLayout></ProtectedPatientRoute>} />
              <Route path="/patient/messages" element={<ProtectedPatientRoute><PatientLayout><PatientMessages /></PatientLayout></ProtectedPatientRoute>} />
              <Route path="/patient/notifications" element={<ProtectedPatientRoute><PatientLayout><PatientNotifications /></PatientLayout></ProtectedPatientRoute>} />
              <Route path="/patient/ai-assistant" element={<ProtectedPatientRoute><PatientLayout><PatientAIAssistant /></PatientLayout></ProtectedPatientRoute>} />
              <Route path="/patient/documents" element={<ProtectedPatientRoute><PatientLayout><PatientDocuments /></PatientLayout></ProtectedPatientRoute>} />
              <Route path="/patient/profile" element={<ProtectedPatientRoute><PatientLayout><PatientProfile /></PatientLayout></ProtectedPatientRoute>} />
              <Route path="/patient/settings" element={<ProtectedPatientRoute><PatientLayout><PatientSettings /></PatientLayout></ProtectedPatientRoute>} />
              <Route path="/analytics/dashboard" element={<ProtectedAnalystRoute><AnalystDashboard /></ProtectedAnalystRoute>} />

              {/* Doctor Portal — Clinical Workspace (all wrapped in DoctorLayout) */}
              <Route path="/doctor" element={<Navigate to="/doctor/dashboard" replace />} />
              <Route path="/doctor/dashboard" element={<ProtectedDoctorRoute><DoctorLayout><DoctorDashboard /></DoctorLayout></ProtectedDoctorRoute>} />
              <Route path="/doctor/patients" element={<ProtectedDoctorRoute><DoctorLayout><DoctorPatients /></DoctorLayout></ProtectedDoctorRoute>} />
              <Route path="/doctor/appointments" element={<ProtectedDoctorRoute><DoctorLayout><DoctorAppointments /></DoctorLayout></ProtectedDoctorRoute>} />
              <Route path="/doctor/laboratory" element={<ProtectedDoctorRoute><DoctorLayout><DoctorLaboratory /></DoctorLayout></ProtectedDoctorRoute>} />
              <Route path="/doctor/ai-assistant" element={<ProtectedDoctorRoute><DoctorLayout><DoctorAIAssistant /></DoctorLayout></ProtectedDoctorRoute>} />
              <Route path="/doctor/performance" element={<ProtectedDoctorRoute><DoctorLayout><DoctorPerformance /></DoctorLayout></ProtectedDoctorRoute>} />
              <Route path="/doctor/records" element={<ProtectedDoctorRoute><DoctorLayout><DoctorPatients /></DoctorLayout></ProtectedDoctorRoute>} />
              <Route path="/doctor/diagnoses" element={<ProtectedDoctorRoute><DoctorLayout><DoctorPatients /></DoctorLayout></ProtectedDoctorRoute>} />
              <Route path="/doctor/prescriptions" element={<ProtectedDoctorRoute><DoctorLayout><DoctorPatients /></DoctorLayout></ProtectedDoctorRoute>} />
              <Route path="/doctor/documents" element={<ProtectedDoctorRoute><DoctorLayout><DoctorPatients /></DoctorLayout></ProtectedDoctorRoute>} />
              <Route path="/doctor/calendar" element={<ProtectedDoctorRoute><DoctorLayout><DoctorAppointments /></DoctorLayout></ProtectedDoctorRoute>} />
              <Route path="/doctor/messages" element={<ProtectedDoctorRoute><DoctorLayout><DoctorAIAssistant /></DoctorLayout></ProtectedDoctorRoute>} />
              <Route path="/doctor/notifications" element={<ProtectedDoctorRoute><DoctorLayout><DoctorDashboard /></DoctorLayout></ProtectedDoctorRoute>} />
              <Route path="/doctor/profile" element={<ProtectedDoctorRoute><DoctorLayout><DoctorDashboard /></DoctorLayout></ProtectedDoctorRoute>} />
              <Route path="/doctor/settings" element={<ProtectedDoctorRoute><DoctorLayout><DoctorDashboard /></DoctorLayout></ProtectedDoctorRoute>} />

              {/* Admin / Data Engineering Workspace Routes */}
              <Route path="/admin" element={<Navigate to="/admin/dashboard" replace />} />
              <Route path="/dashboard" element={<Navigate to="/admin/dashboard" replace />} />
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
          </React.Suspense>
        </BrowserRouter>
      </AuthProvider>
    </ThemeProvider>
  );
}

export default App;
