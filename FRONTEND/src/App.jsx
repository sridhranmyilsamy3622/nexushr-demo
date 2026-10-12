import React, { useState } from 'react';
import { AuthProvider, useAuth } from './context/AuthContext';
import LandingPage from './components/landing/LandingPage';
import Navbar from './components/layout/Navbar';
import Sidebar from './components/layout/Sidebar';

// Management & General Modules
import DashboardView from './components/modules/DashboardView';
import EmployeesView from './components/modules/EmployeesView';
import AttendanceView from './components/modules/AttendanceView';
import LeaveView from './components/modules/LeaveView';
import PayrollView from './components/modules/PayrollView';
import RecruitmentView from './components/modules/RecruitmentView';
import OnboardingView from './components/modules/OnboardingView';
import PerformanceView from './components/modules/PerformanceView';
import TrainingView from './components/modules/TrainingView';
import ExpensesView from './components/modules/ExpensesView';
import DocumentsView from './components/modules/DocumentsView';
import HelpdeskView from './components/modules/HelpdeskView';
import AnnouncementsView from './components/modules/AnnouncementsView';
import EngagementView from './components/modules/EngagementView';
import OffboardingView from './components/modules/OffboardingView';
import ReportsView from './components/modules/ReportsView';
import OrganizationView from './components/modules/OrganizationView';
import SettingsView from './components/modules/SettingsView';

// Dedicated Employee Self-Service (ESS)
import EmployeePortalView from './components/modules/EmployeePortalView';

function MainAppContent() {
  const { viewMode, activeTab } = useAuth();
  const [isSidebarOpen, setIsSidebarOpen] = useState(false);

  // If user selected the public landing website view
  if (viewMode === 'landing') {
    return <LandingPage />;
  }

  // Active module routing
  const renderModule = () => {
    switch (activeTab) {
      case 'dashboard':
        return <DashboardView />;
      case 'employees':
        return <EmployeesView />;
      case 'attendance':
        return <AttendanceView />;
      case 'leave':
        return <LeaveView />;
      case 'payroll':
        return <PayrollView />;
      case 'recruitment':
        return <RecruitmentView />;
      case 'onboarding':
        return <OnboardingView />;
      case 'performance':
        return <PerformanceView />;
      case 'training':
        return <TrainingView />;
      case 'expenses':
        return <ExpensesView />;
      case 'documents':
        return <DocumentsView />;
      case 'helpdesk':
        return <HelpdeskView />;
      case 'announcements':
        return <AnnouncementsView />;
      case 'engagement':
        return <EngagementView />;
      case 'offboarding':
        return <OffboardingView />;
      case 'reports':
        return <ReportsView />;
      case 'organization':
        return <OrganizationView />;
      case 'settings':
        return <SettingsView />;

      // Employee Self-Service (ESS) routes
      case 'ess-dashboard':
      case 'my-profile':
      case 'ess-attendance':
      case 'ess-leave':
      case 'ess-payslips':
      case 'ess-expenses':
      case 'ess-documents':
      case 'ess-performance':
      case 'ess-training':
      case 'ess-helpdesk':
      case 'ess-policies':
        return <EmployeePortalView subTab={activeTab} />;

      default:
        return <DashboardView />;
    }
  };

  return (
    <div className="min-h-screen bg-slate-50 flex flex-col font-sans text-slate-900">
      <Navbar 
        onToggleSidebar={() => setIsSidebarOpen(!isSidebarOpen)} 
        isMobileMenuOpen={isSidebarOpen} 
      />

      <div className="flex-1 flex">
        <Sidebar 
          isOpen={isSidebarOpen} 
          onClose={() => setIsSidebarOpen(false)} 
        />

        <main className="flex-1 lg:pl-64 p-4 sm:p-6 lg:p-8 max-w-7xl mx-auto w-full transition-all duration-200">
          {renderModule()}
        </main>
      </div>
    </div>
  );
}

export default function App() {
  return (
    <AuthProvider>
      <MainAppContent />
    </AuthProvider>
  );
}
