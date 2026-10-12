import React, { createContext, useContext, useState, useEffect } from 'react';
import { api } from '../services/api';

const AuthContext = createContext();

export const AuthProvider = ({ children }) => {
  // Default user is HR Admin
  const [currentUser, setCurrentUser] = useState({
    id: "usr-1",
    name: "Aarav Sharma",
    email: "admin@nexus.hr",
    role: "admin", // 'admin' | 'manager' | 'employee'
    department: "Human Resources",
    designation: "VP & Head of Human Resources",
    avatar: "https://images.unsplash.com/photo-1534528741775-53994a69daeb?auto=format&fit=crop&w=200&h=200&q=80",
    employeeId: "NEX-001",
    phone: "+91 98450 12345",
    status: "Active"
  });

  const [viewMode, setViewMode] = useState('portal'); // 'portal' | 'landing'
  const [activeTab, setActiveTab] = useState('dashboard');
  const [is2FAEnabled, setIs2FAEnabled] = useState(false);
  const [notifications, setNotifications] = useState([]);
  const [unreadNotifsCount, setUnreadNotifsCount] = useState(0);
  const [refreshKey, setRefreshKey] = useState(0);

  const triggerRefresh = () => setRefreshKey(prev => prev + 1);

  // Switch role helper
  const switchRole = async (newRole) => {
    try {
      const res = await api.switchRole(newRole);
      if (res.user) {
        setCurrentUser(res.user);
        if (newRole === 'employee') {
          setActiveTab('ess-dashboard');
        } else {
          setActiveTab('dashboard');
        }
        triggerRefresh();
      }
    } catch (e) {
      console.error("Failed to switch role:", e);
    }
  };

  // Load notifications
  useEffect(() => {
    api.getNotifications().then(data => {
      if (Array.isArray(data)) {
        setNotifications(data);
        setUnreadNotifsCount(data.filter(n => n.unread).length);
      }
    }).catch(() => {});
  }, [refreshKey]);

  const markAllNotificationsRead = async () => {
    await api.markNotificationsRead();
    setNotifications(prev => prev.map(n => ({ ...n, unread: false })));
    setUnreadNotifsCount(0);
  };

  return (
    <AuthContext.Provider value={{
      currentUser,
      setCurrentUser,
      viewMode,
      setViewMode,
      activeTab,
      setActiveTab,
      switchRole,
      is2FAEnabled,
      setIs2FAEnabled,
      notifications,
      unreadNotifsCount,
      markAllNotificationsRead,
      triggerRefresh,
      refreshKey
    }}>
      {children}
    </AuthContext.Provider>
  );
};

export const useAuth = () => useContext(AuthContext);
