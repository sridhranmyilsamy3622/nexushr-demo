import React, { useState } from 'react';
import { 
  LayoutDashboard, Users, Clock, Calendar, CreditCard, UserCheck, 
  Award, BookOpen, Receipt, FileText, LifeBuoy, Bell, BarChart3, 
  Building2, Settings, User, Sparkles, ChevronRight, LogOut,
  HelpCircle, ShieldAlert, HeartHandshake, UserMinus, Network,
  Globe, Smartphone, ExternalLink, Copy, Check
} from 'lucide-react';
import { useAuth } from '../../context/AuthContext';

export default function Sidebar({ isOpen, onClose }) {
  const { currentUser, activeTab, setActiveTab, setViewMode, switchRole } = useAuth();
  const [copied, setCopied] = useState(false);
  const isEmployee = currentUser.role === 'employee';

  const mobileUrl = `${window.location.protocol}//${window.location.hostname || '172.17.132.178'}:${window.location.port || '5173'}`;

  const copyUrl = () => {
    navigator.clipboard.writeText(mobileUrl);
    setCopied(true);
    setTimeout(() => setCopied(false), 2000);
  };

  // Navigation Items for Admin & Manager
  const adminNavItems = [
    { id: 'dashboard', label: 'Dashboard', icon: LayoutDashboard },
    { id: 'employees', label: 'Employees', icon: Users },
    { id: 'attendance', label: 'Attendance', icon: Clock },
    { id: 'leave', label: 'Leave', icon: Calendar },
    { id: 'payroll', label: 'Payroll', icon: CreditCard },
    { id: 'recruitment', label: 'Recruitment', icon: UserCheck },
    { id: 'onboarding', label: 'Onboarding', icon: Sparkles },
    { id: 'performance', label: 'Performance', icon: Award },
    { id: 'training', label: 'Training', icon: BookOpen },
    { id: 'expenses', label: 'Expenses', icon: Receipt },
    { id: 'documents', label: 'Documents', icon: FileText },
    { id: 'helpdesk', label: 'HR Helpdesk', icon: LifeBuoy },
    { id: 'announcements', label: 'Announcements', icon: Bell },
    { id: 'engagement', label: 'Engagement', icon: HeartHandshake },
    { id: 'offboarding', label: 'Offboarding', icon: UserMinus },
    { id: 'reports', label: 'Reports & Analytics', icon: BarChart3 },
    { id: 'organization', label: 'Organization', icon: Network },
    { id: 'settings', label: 'Settings & Admin', icon: Settings }
  ];

  // Navigation Items for Employee Self-Service (ESS)
  const employeeNavItems = [
    { id: 'ess-dashboard', label: 'My Dashboard', icon: LayoutDashboard },
    { id: 'my-profile', label: 'My Profile', icon: User },
    { id: 'ess-attendance', label: 'Attendance', icon: Clock },
    { id: 'ess-leave', label: 'Leave', icon: Calendar },
    { id: 'ess-payslips', label: 'Payslips', icon: CreditCard },
    { id: 'ess-expenses', label: 'Expenses', icon: Receipt },
    { id: 'ess-documents', label: 'Documents', icon: FileText },
    { id: 'ess-performance', label: 'Performance', icon: Award },
    { id: 'ess-training', label: 'Training', icon: BookOpen },
    { id: 'ess-helpdesk', label: 'HR Requests', icon: LifeBuoy },
    { id: 'announcements', label: 'Announcements', icon: Bell },
    { id: 'ess-policies', label: 'Company Policies', icon: FileText }
  ];

  const currentNav = isEmployee ? employeeNavItems : adminNavItems;

  const handleSelect = (id) => {
    setActiveTab(id);
    if (onClose) onClose();
  };

  const handleGoToWebsite = () => {
    setViewMode('landing');
    if (onClose) onClose();
  };

  return (
    <>
      {/* Mobile backdrop */}
      {isOpen && (
        <div 
          onClick={onClose}
          className="fixed inset-0 bg-slate-900/60 backdrop-blur-xs z-30 lg:hidden"
        />
      )}

      <aside className={`
        fixed top-16 bottom-0 left-0 z-30 w-72 sm:w-64 bg-slate-900 text-slate-300 flex flex-col border-r border-slate-800 transition-transform duration-200 ease-in-out
        ${isOpen ? 'translate-x-0' : '-translate-x-full lg:translate-x-0'}
      `}>
        {/* User Card Header in Sidebar */}
        <div className="p-4 border-b border-slate-800 flex items-center space-x-3 bg-slate-950/50">
          <img 
            src={currentUser.avatar} 
            alt={currentUser.name} 
            className="w-10 h-10 rounded-xl object-cover ring-2 ring-brand-500/30"
          />
          <div className="flex-1 min-w-0">
            <h4 className="text-xs font-bold text-white truncate">{currentUser.name}</h4>
            <p className="text-[11px] text-slate-400 truncate">{currentUser.designation}</p>
            <span className={`inline-block mt-0.5 px-2 py-0.2 rounded text-[9px] font-bold uppercase tracking-wider ${
              currentUser.role === 'admin' ? 'bg-brand-900/80 text-brand-300 border border-brand-700/50' :
              currentUser.role === 'manager' ? 'bg-emerald-900/80 text-emerald-300 border border-emerald-700/50' :
              'bg-sky-900/80 text-sky-300 border border-sky-700/50'
            }`}>
              {currentUser.role === 'admin' ? 'HR Administrator' : currentUser.role === 'manager' ? 'Dept Manager' : 'Employee ESS'}
            </span>
          </div>
        </div>

        {/* Mobile Quick Action Pills (Website & Mobile URL) */}
        <div className="p-3 bg-slate-950/80 border-b border-slate-800 space-y-2">
          {/* Direct Website Link Button for Mobile */}
          <button
            onClick={handleGoToWebsite}
            className="w-full flex items-center justify-between px-3 py-2 rounded-xl bg-gradient-to-r from-brand-600 to-indigo-600 text-white font-bold text-xs shadow-md shadow-brand-600/30 hover:brightness-110 transition"
          >
            <div className="flex items-center space-x-2">
              <Globe className="w-4 h-4" />
              <span>Public Website / Landing</span>
            </div>
            <ExternalLink className="w-3.5 h-3.5" />
          </button>

          {/* Copy Mobile Link */}
          <div className="flex items-center justify-between px-2.5 py-1.5 rounded-lg bg-slate-900 border border-slate-800 text-[11px] text-slate-400">
            <div className="flex items-center space-x-1.5 truncate">
              <Smartphone className="w-3.5 h-3.5 text-brand-400 shrink-0" />
              <span className="truncate font-mono">{mobileUrl}</span>
            </div>
            <button
              onClick={copyUrl}
              className="ml-2 text-brand-400 hover:text-brand-300 font-semibold shrink-0"
              title="Copy mobile link"
            >
              {copied ? <Check className="w-3.5 h-3.5 text-emerald-400" /> : <Copy className="w-3.5 h-3.5" />}
            </button>
          </div>
        </div>

        {/* Navigation Link Items */}
        <div className="flex-1 overflow-y-auto px-3 py-3 space-y-1">
          <div className="px-3 pb-2 text-[10px] font-bold uppercase tracking-wider text-slate-500">
            {isEmployee ? 'Employee Self-Service' : 'Management Portal'}
          </div>

          {currentNav.map((item) => {
            const isActive = activeTab === item.id;
            const Icon = item.icon;

            return (
              <button
                key={item.id}
                onClick={() => handleSelect(item.id)}
                className={`
                  w-full flex items-center justify-between px-3 py-2.5 rounded-xl text-xs font-medium transition duration-150 group
                  ${isActive 
                    ? 'bg-brand-600 text-white font-semibold shadow-md shadow-brand-600/20' 
                    : 'text-slate-400 hover:text-white hover:bg-slate-800/80'}
                `}
              >
                <div className="flex items-center space-x-3">
                  <Icon className={`w-4 h-4 transition ${isActive ? 'text-white' : 'text-slate-400 group-hover:text-brand-400'}`} />
                  <span>{item.label}</span>
                </div>
                {isActive && <ChevronRight className="w-3.5 h-3.5 text-white/80" />}
              </button>
            );
          })}
        </div>

        {/* Sidebar Footer info */}
        <div className="p-3 sm:p-4 border-t border-slate-800 bg-slate-950/40 text-[11px] text-slate-400 flex items-center justify-between">
          <div>
            <p className="font-semibold text-slate-300">NexusHR Suite v2.0</p>
            <p className="text-[10px] text-slate-500">Mobile Responsive Ready</p>
          </div>
          <button 
            onClick={handleGoToWebsite}
            className="p-1.5 rounded-lg bg-slate-800 hover:bg-slate-700 text-slate-300 hover:text-white flex items-center gap-1 text-xs font-semibold px-2"
            title="Go to Landing Website"
          >
            <Globe className="w-3.5 h-3.5 text-brand-400" />
            <span className="text-[10px]">Website</span>
          </button>
        </div>
      </aside>
    </>
  );
}
