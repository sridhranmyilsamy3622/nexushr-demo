import React, { useState, useEffect } from 'react';
import { 
  Users, Bell, Search, Shield, ChevronDown, LogOut, 
  ExternalLink, CheckCircle, Clock, Sparkles, User, Settings as SettingsIcon,
  HelpCircle, Menu, X, Globe, Smartphone, QrCode, Copy, Check
} from 'lucide-react';
import { useAuth } from '../../context/AuthContext';

export default function Navbar({ onToggleSidebar, isMobileMenuOpen }) {
  const { 
    currentUser, 
    switchRole, 
    viewMode, 
    setViewMode, 
    notifications, 
    unreadNotifsCount, 
    markAllNotificationsRead,
    setActiveTab
  } = useAuth();

  const [showNotifMenu, setShowNotifMenu] = useState(false);
  const [showUserMenu, setShowUserMenu] = useState(false);
  const [showMobileLinkModal, setShowMobileLinkModal] = useState(false);
  const [copied, setCopied] = useState(false);
  const [currentTime, setCurrentTime] = useState('');

  // Mobile local network URL
  const mobileUrl = `${window.location.protocol}//${window.location.hostname || '172.17.132.178'}:${window.location.port || '5173'}`;

  useEffect(() => {
    const update = () => {
      const now = new Date();
      setCurrentTime(now.toLocaleTimeString('en-IN', { hour: '2-digit', minute: '2-digit', second: '2-digit' }));
    };
    update();
    const timer = setInterval(update, 1000);
    return () => clearInterval(timer);
  }, []);

  const copyMobileUrl = () => {
    navigator.clipboard.writeText(mobileUrl);
    setCopied(true);
    setTimeout(() => setCopied(false), 2500);
  };

  return (
    <>
      <header className="bg-white border-b border-slate-200 sticky top-0 z-30 shadow-xs">
        <div className="px-3 sm:px-6 lg:px-8 h-16 flex items-center justify-between">
          {/* Left: Mobile hamburger & Logo */}
          <div className="flex items-center space-x-2 sm:space-x-3">
            <button
              onClick={onToggleSidebar}
              className="lg:hidden p-2 rounded-xl text-slate-600 hover:text-slate-900 hover:bg-slate-100 transition"
              aria-label="Toggle Navigation Menu"
            >
              {isMobileMenuOpen ? <X className="w-5 h-5" /> : <Menu className="w-5 h-5" />}
            </button>

            <div 
              onClick={() => setActiveTab(currentUser.role === 'employee' ? 'ess-dashboard' : 'dashboard')}
              className="flex items-center space-x-2 cursor-pointer"
            >
              <div className="w-8 h-8 sm:w-9 sm:h-9 rounded-xl bg-gradient-to-tr from-brand-600 to-indigo-500 flex items-center justify-center text-white shadow-sm shadow-brand-500/20">
                <Users className="w-4 h-4 sm:w-5 sm:h-5" />
              </div>
              <div>
                <span className="font-bold text-base sm:text-lg tracking-tight text-slate-900 font-display">Nexus<span className="text-brand-600">HR</span></span>
                <span className="text-[9px] sm:text-[10px] uppercase font-semibold text-slate-400 block -mt-1 tracking-wider">Enterprise OS</span>
              </div>
            </div>
          </div>

          {/* Center: Live Digital Clock & Role Switcher (Visible on desktop & tablets) */}
          <div className="hidden md:flex items-center space-x-3 lg:space-x-4">
            {/* Live Clock */}
            <div className="flex items-center space-x-1.5 px-3 py-1.5 bg-slate-50 border border-slate-200/80 rounded-full text-xs font-medium text-slate-600">
              <Clock className="w-3.5 h-3.5 text-brand-600 animate-pulse" />
              <span className="font-mono font-semibold text-slate-800">{currentTime}</span>
              <span className="text-slate-400">IST</span>
            </div>

            {/* Interactive Role Switcher Pill */}
            <div className="flex items-center bg-slate-100 p-1 rounded-xl border border-slate-200/90 text-xs">
              <span className="px-2 text-[11px] font-bold uppercase text-slate-500 tracking-wider">Role:</span>
              <button
                onClick={() => switchRole('admin')}
                className={`px-2.5 lg:px-3 py-1 rounded-lg font-semibold transition ${
                  currentUser.role === 'admin'
                    ? 'bg-white text-brand-700 shadow-xs border border-slate-200/80'
                    : 'text-slate-600 hover:text-slate-900'
                }`}
              >
                HR Admin
              </button>
              <button
                onClick={() => switchRole('manager')}
                className={`px-2.5 lg:px-3 py-1 rounded-lg font-semibold transition ${
                  currentUser.role === 'manager'
                    ? 'bg-white text-emerald-700 shadow-xs border border-slate-200/80'
                    : 'text-slate-600 hover:text-slate-900'
                }`}
              >
                Manager
              </button>
              <button
                onClick={() => switchRole('employee')}
                className={`px-2.5 lg:px-3 py-1 rounded-lg font-semibold transition ${
                  currentUser.role === 'employee'
                    ? 'bg-white text-indigo-700 shadow-xs border border-slate-200/80'
                    : 'text-slate-600 hover:text-slate-900'
                }`}
              >
                Employee (ESS)
              </button>
            </div>
          </div>

          {/* Right: Public Website Link (ALWAYS VISIBLE ON MOBILE & DESKTOP!), Mobile QR, Notifications & Profile */}
          <div className="flex items-center space-x-1.5 sm:space-x-3">
            {/* ALWAYS VISIBLE ON MOBILE: Website Link Button */}
            <button
              onClick={() => setViewMode('landing')}
              className="flex items-center space-x-1 sm:space-x-1.5 px-2.5 sm:px-3 py-1.5 rounded-xl text-xs font-bold text-brand-700 bg-brand-50 hover:bg-brand-100 border border-brand-200 shadow-xs transition"
              title="Open Public Website & Landing Page"
            >
              <Globe className="w-3.5 h-3.5 text-brand-600" />
              <span>Website</span>
              <ExternalLink className="w-3 h-3 text-brand-500 hidden sm:inline" />
            </button>

            {/* Mobile QR & Live Phone URL Button */}
            <button
              onClick={() => setShowMobileLinkModal(true)}
              className="flex items-center space-x-1 px-2.5 py-1.5 rounded-xl text-xs font-semibold text-slate-700 bg-slate-100 hover:bg-slate-200 border border-slate-200/80 transition"
              title="Open on your phone or mobile browser"
            >
              <Smartphone className="w-3.5 h-3.5 text-slate-600" />
              <span className="hidden sm:inline">Mobile Link</span>
            </button>

            {/* Notifications Dropdown */}
            <div className="relative">
              <button
                onClick={() => setShowNotifMenu(!showNotifMenu)}
                className="p-1.5 sm:p-2 rounded-xl text-slate-600 hover:text-slate-900 hover:bg-slate-100 relative transition"
              >
                <Bell className="w-5 h-5" />
                {unreadNotifsCount > 0 && (
                  <span className="absolute top-1 right-1 w-4 h-4 bg-rose-500 text-white text-[10px] font-bold rounded-full flex items-center justify-center animate-bounce">
                    {unreadNotifsCount}
                  </span>
                )}
              </button>

              {showNotifMenu && (
                <div className="absolute right-0 mt-2 w-72 sm:w-96 bg-white rounded-2xl shadow-xl border border-slate-200 z-50 p-4">
                  <div className="flex items-center justify-between pb-3 border-b border-slate-100">
                    <div className="flex items-center space-x-2">
                      <h4 className="font-bold text-sm text-slate-900">Notifications</h4>
                      {unreadNotifsCount > 0 && (
                        <span className="px-2 py-0.5 rounded-full bg-brand-50 text-brand-700 font-semibold text-xs">
                          {unreadNotifsCount} new
                        </span>
                      )}
                    </div>
                    {unreadNotifsCount > 0 && (
                      <button
                        onClick={markAllNotificationsRead}
                        className="text-xs text-brand-600 hover:text-brand-700 font-semibold"
                      >
                        Mark all read
                      </button>
                    )}
                  </div>

                  <div className="divide-y divide-slate-100 max-h-72 overflow-y-auto mt-2">
                    {notifications.map((n) => (
                      <div key={n.id} className={`py-3 px-2 rounded-xl transition ${n.unread ? 'bg-slate-50/80 font-medium' : 'opacity-80'}`}>
                        <div className="flex items-start justify-between">
                          <p className="text-xs font-bold text-slate-900">{n.title}</p>
                          <span className="text-[10px] text-slate-400">{n.time}</span>
                        </div>
                        <p className="text-xs text-slate-600 mt-1">{n.message}</p>
                      </div>
                    ))}
                  </div>
                </div>
              )}
            </div>

            {/* User Profile Menu */}
            <div className="relative">
              <button
                onClick={() => setShowUserMenu(!showUserMenu)}
                className="flex items-center space-x-1.5 sm:space-x-2 p-1 rounded-xl hover:bg-slate-100 transition"
              >
                <img
                  src={currentUser.avatar}
                  alt={currentUser.name}
                  className="w-8 h-8 rounded-full object-cover ring-2 ring-brand-500/30"
                />
                <div className="hidden xl:block text-left">
                  <p className="text-xs font-bold text-slate-900 leading-tight">{currentUser.name}</p>
                  <p className="text-[10px] text-slate-500 capitalize">{currentUser.role === 'admin' ? 'HR Administrator' : currentUser.role}</p>
                </div>
                <ChevronDown className="w-3.5 h-3.5 text-slate-400 hidden sm:block" />
              </button>

              {showUserMenu && (
                <div className="absolute right-0 mt-2 w-64 bg-white rounded-2xl shadow-xl border border-slate-200 z-50 p-3">
                  <div className="pb-3 border-b border-slate-100 flex items-center space-x-3 p-1">
                    <img src={currentUser.avatar} alt={currentUser.name} className="w-10 h-10 rounded-full object-cover" />
                    <div>
                      <p className="text-xs font-bold text-slate-900">{currentUser.name}</p>
                      <p className="text-[11px] text-slate-500">{currentUser.email}</p>
                      <span className="inline-block mt-1 px-2 py-0.5 rounded text-[10px] font-bold uppercase bg-brand-50 text-brand-700">
                        ID: {currentUser.employeeId || 'NEX-001'}
                      </span>
                    </div>
                  </div>

                  <div className="pt-2 space-y-1 text-xs font-medium text-slate-700">
                    <button
                      onClick={() => { setActiveTab('my-profile'); setShowUserMenu(false); }}
                      className="w-full flex items-center space-x-2 px-3 py-2 rounded-xl hover:bg-slate-50 transition"
                    >
                      <User className="w-4 h-4 text-slate-500" />
                      <span>My Profile</span>
                    </button>
                    <button
                      onClick={() => { setActiveTab('settings'); setShowUserMenu(false); }}
                      className="w-full flex items-center space-x-2 px-3 py-2 rounded-xl hover:bg-slate-50 transition"
                    >
                      <SettingsIcon className="w-4 h-4 text-slate-500" />
                      <span>Account Settings</span>
                    </button>
                    <button
                      onClick={() => { setViewMode('landing'); setShowUserMenu(false); }}
                      className="w-full flex items-center space-x-2 px-3 py-2 rounded-xl hover:bg-brand-50 text-brand-700 transition"
                    >
                      <Globe className="w-4 h-4 text-brand-600" />
                      <span>Public Website</span>
                    </button>
                    <button
                      onClick={() => { setViewMode('landing'); setShowUserMenu(false); }}
                      className="w-full flex items-center space-x-2 px-3 py-2 rounded-xl hover:bg-rose-50 text-rose-600 transition"
                    >
                      <LogOut className="w-4 h-4 text-rose-500" />
                      <span>Logout to Landing</span>
                    </button>
                  </div>
                </div>
              )}
            </div>
          </div>
        </div>

        {/* Mobile secondary bar: Role Switcher for phones */}
        <div className="md:hidden px-3 py-2 bg-slate-50 border-t border-slate-200/80 flex items-center justify-between text-xs">
          <span className="font-bold text-[10px] uppercase text-slate-500">Role:</span>
          <div className="flex items-center space-x-1">
            <button
              onClick={() => switchRole('admin')}
              className={`px-2.5 py-1 rounded-lg text-[11px] font-semibold transition ${
                currentUser.role === 'admin'
                  ? 'bg-brand-600 text-white shadow-xs'
                  : 'bg-white text-slate-600 border border-slate-200'
              }`}
            >
              Admin
            </button>
            <button
              onClick={() => switchRole('manager')}
              className={`px-2.5 py-1 rounded-lg text-[11px] font-semibold transition ${
                currentUser.role === 'manager'
                  ? 'bg-emerald-600 text-white shadow-xs'
                  : 'bg-white text-slate-600 border border-slate-200'
              }`}
            >
              Manager
            </button>
            <button
              onClick={() => switchRole('employee')}
              className={`px-2.5 py-1 rounded-lg text-[11px] font-semibold transition ${
                currentUser.role === 'employee'
                  ? 'bg-indigo-600 text-white shadow-xs'
                  : 'bg-white text-slate-600 border border-slate-200'
              }`}
            >
              Employee
            </button>
          </div>
        </div>
      </header>

      {/* Mobile Link & QR Code Modal */}
      {showMobileLinkModal && (
        <div className="fixed inset-0 z-50 bg-black/70 backdrop-blur-xs flex items-center justify-center p-4">
          <div className="bg-white rounded-3xl max-w-sm w-full p-6 shadow-2xl relative text-center">
            <button
              onClick={() => setShowMobileLinkModal(false)}
              className="absolute top-4 right-4 text-slate-400 hover:text-slate-600 p-1"
            >
              <X className="w-5 h-5" />
            </button>

            <div className="w-12 h-12 rounded-2xl bg-brand-50 text-brand-600 flex items-center justify-center mx-auto mb-3 shadow-xs">
              <Smartphone className="w-6 h-6" />
            </div>

            <h3 className="text-lg font-bold text-slate-900 font-display">Mobile Access Link</h3>
            <p className="text-xs text-slate-500 mt-1">
              Open NexusHR directly on your smartphone browser or scan the QR code below.
            </p>

            {/* QR Code */}
            <div className="my-5 p-3 bg-slate-50 rounded-2xl border border-slate-200/80 inline-block shadow-inner">
              <img
                src={`https://api.qrserver.com/v1/create-qr-code/?size=180x180&data=${encodeURIComponent(mobileUrl)}`}
                alt="Scan to open on mobile"
                className="w-44 h-44 rounded-xl mx-auto"
              />
            </div>

            {/* Link input with 1-click copy */}
            <div className="space-y-2">
              <div className="flex items-center space-x-1.5 p-1.5 bg-slate-100 rounded-xl border border-slate-200">
                <input
                  type="text"
                  readOnly
                  value={mobileUrl}
                  className="flex-1 px-2 text-xs font-mono bg-transparent text-slate-800 focus:outline-none"
                />
                <button
                  onClick={copyMobileUrl}
                  className={`px-3 py-1.5 rounded-lg text-xs font-bold transition flex items-center space-x-1 ${
                    copied ? 'bg-emerald-600 text-white' : 'bg-brand-600 hover:bg-brand-500 text-white'
                  }`}
                >
                  {copied ? <Check className="w-3.5 h-3.5" /> : <Copy className="w-3.5 h-3.5" />}
                  <span>{copied ? 'Copied' : 'Copy'}</span>
                </button>
              </div>

              <p className="text-[10px] text-slate-400">
                💡 Note: Ensure your mobile device is on the same Wi-Fi network to connect to this local IP.
              </p>
            </div>
          </div>
        </div>
      )}
    </>
  );
}
