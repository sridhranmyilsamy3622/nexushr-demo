// Centralized API client for NexusHR
const API_BASE = window.location.hostname === 'localhost'
  ? 'http://localhost:5000/api'
  : 'https://nexushr-demo.onrender.com/api';

export const api = {
  // Health
  getHealth: async () => {
    try {
      const res = await fetch(`${API_BASE}/health`);
      return await res.json();
    } catch (e) {
      return { status: 'offline' };
    }
  },

  // Auth
  login: async (email, password, role) => {
    const res = await fetch(`${API_BASE}/auth/login`, {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({ email, password, role })
    });
    return await res.json();
  },

  switchRole: async (role) => {
    const res = await fetch(`${API_BASE}/auth/switch-role`, {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({ role })
    });
    return await res.json();
  },

  // Dashboard
  getDashboardStats: async () => {
    const res = await fetch(`${API_BASE}/dashboard/stats`);
    return await res.json();
  },

  // Employees
  getEmployees: async (params = {}) => {
    const query = new URLSearchParams(params).toString();
    const res = await fetch(`${API_BASE}/employees${query ? '?' + query : ''}`);
    return await res.json();
  },

  getEmployee: async (id) => {
    const res = await fetch(`${API_BASE}/employees/${id}`);
    return await res.json();
  },

  createEmployee: async (data) => {
    const res = await fetch(`${API_BASE}/employees`, {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify(data)
    });
    return await res.json();
  },

  updateEmployee: async (id, data) => {
    const res = await fetch(`${API_BASE}/employees/${id}`, {
      method: 'PUT',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify(data)
    });
    return await res.json();
  },

  // Attendance
  getAttendance: async () => {
    const res = await fetch(`${API_BASE}/attendance`);
    return await res.json();
  },

  punchAttendance: async (employeeId, type, mode) => {
    const res = await fetch(`${API_BASE}/attendance/punch`, {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({ employeeId, type, mode })
    });
    return await res.json();
  },

  regularizeAttendance: async (employeeId, date, reason) => {
    const res = await fetch(`${API_BASE}/attendance/regularize`, {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({ employeeId, date, reason })
    });
    return await res.json();
  },

  syncBiometrics: async () => {
    const res = await fetch(`${API_BASE}/attendance/sync-biometric`, { method: 'POST' });
    return await res.json();
  },

  // Leaves
  getLeaves: async () => {
    const res = await fetch(`${API_BASE}/leaves`);
    return await res.json();
  },

  getLeaveBalance: async (employeeId) => {
    const res = await fetch(`${API_BASE}/leaves/balances/${employeeId}`);
    return await res.json();
  },

  applyLeave: async (data) => {
    const res = await fetch(`${API_BASE}/leaves/apply`, {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify(data)
    });
    return await res.json();
  },

  updateLeaveStatus: async (id, status, approvedBy, notes) => {
    const res = await fetch(`${API_BASE}/leaves/${id}/status`, {
      method: 'PUT',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({ status, approvedBy, notes })
    });
    return await res.json();
  },

  getHolidays: async () => {
    const res = await fetch(`${API_BASE}/holidays`);
    return await res.json();
  },

  // Payroll
  getPayrollRuns: async () => {
    const res = await fetch(`${API_BASE}/payroll/runs`);
    return await res.json();
  },

  getEmployeePayslip: async (employeeId) => {
    const res = await fetch(`${API_BASE}/payroll/employee/${employeeId}`);
    return await res.json();
  },

  processPayrollRun: async (month) => {
    const res = await fetch(`${API_BASE}/payroll/process-run`, {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({ month })
    });
    return await res.json();
  },

  // Recruitment
  getJobs: async () => {
    const res = await fetch(`${API_BASE}/recruitment/jobs`);
    return await res.json();
  },

  createJob: async (data) => {
    const res = await fetch(`${API_BASE}/recruitment/jobs`, {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify(data)
    });
    return await res.json();
  },

  getCandidates: async () => {
    const res = await fetch(`${API_BASE}/recruitment/candidates`);
    return await res.json();
  },

  updateCandidateStage: async (id, stage, notes) => {
    const res = await fetch(`${API_BASE}/recruitment/candidates/${id}/stage`, {
      method: 'PUT',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({ stage, notes })
    });
    return await res.json();
  },

  scheduleInterview: async (data) => {
    const res = await fetch(`${API_BASE}/recruitment/schedule-interview`, {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify(data)
    });
    return await res.json();
  },

  // Onboarding
  getOnboarding: async () => {
    const res = await fetch(`${API_BASE}/onboarding`);
    return await res.json();
  },

  updateOnboardingTask: async (id, taskIndex, done) => {
    const res = await fetch(`${API_BASE}/onboarding/${id}/task`, {
      method: 'PUT',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({ taskIndex, done })
    });
    return await res.json();
  },

  // Performance
  getGoals: async () => {
    const res = await fetch(`${API_BASE}/performance/goals`);
    return await res.json();
  },

  updateGoal: async (id, data) => {
    const res = await fetch(`${API_BASE}/performance/goals/${id}`, {
      method: 'PUT',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify(data)
    });
    return await res.json();
  },

  getReviews: async () => {
    const res = await fetch(`${API_BASE}/performance/reviews`);
    return await res.json();
  },

  createReview: async (data) => {
    const res = await fetch(`${API_BASE}/performance/reviews`, {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify(data)
    });
    return await res.json();
  },

  // Training
  getCourses: async () => {
    const res = await fetch(`${API_BASE}/training/courses`);
    return await res.json();
  },

  enrollCourse: async (courseId, employeeId) => {
    const res = await fetch(`${API_BASE}/training/enroll`, {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({ courseId, employeeId })
    });
    return await res.json();
  },

  // Expenses
  getExpenses: async () => {
    const res = await fetch(`${API_BASE}/expenses`);
    return await res.json();
  },

  submitExpense: async (data) => {
    const res = await fetch(`${API_BASE}/expenses`, {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify(data)
    });
    return await res.json();
  },

  updateExpenseStatus: async (id, status, approvedBy) => {
    const res = await fetch(`${API_BASE}/expenses/${id}/status`, {
      method: 'PUT',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({ status, approvedBy })
    });
    return await res.json();
  },

  // Documents
  getDocuments: async () => {
    const res = await fetch(`${API_BASE}/documents`);
    return await res.json();
  },

  uploadDocument: async (data) => {
    const res = await fetch(`${API_BASE}/documents`, {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify(data)
    });
    return await res.json();
  },

  // Helpdesk
  getTickets: async () => {
    const res = await fetch(`${API_BASE}/tickets`);
    return await res.json();
  },

  createTicket: async (data) => {
    const res = await fetch(`${API_BASE}/tickets`, {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify(data)
    });
    return await res.json();
  },

  replyTicket: async (id, data) => {
    const res = await fetch(`${API_BASE}/tickets/${id}/reply`, {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify(data)
    });
    return await res.json();
  },

  updateTicketStatus: async (id, status) => {
    const res = await fetch(`${API_BASE}/tickets/${id}/status`, {
      method: 'PUT',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({ status })
    });
    return await res.json();
  },

  // Announcements
  getAnnouncements: async () => {
    const res = await fetch(`${API_BASE}/announcements`);
    return await res.json();
  },

  createAnnouncement: async (data) => {
    const res = await fetch(`${API_BASE}/announcements`, {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify(data)
    });
    return await res.json();
  },

  // Engagement
  getKudos: async () => {
    const res = await fetch(`${API_BASE}/engagement/kudos`);
    return await res.json();
  },

  giveKudo: async (data) => {
    const res = await fetch(`${API_BASE}/engagement/kudos`, {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify(data)
    });
    return await res.json();
  },

  getPolls: async () => {
    const res = await fetch(`${API_BASE}/engagement/polls`);
    return await res.json();
  },

  votePoll: async (pollId, optionIndex) => {
    const res = await fetch(`${API_BASE}/engagement/polls/${pollId}/vote`, {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({ optionIndex })
    });
    return await res.json();
  },

  getSuggestions: async () => {
    const res = await fetch(`${API_BASE}/engagement/suggestions`);
    return await res.json();
  },

  createSuggestion: async (data) => {
    const res = await fetch(`${API_BASE}/engagement/suggestions`, {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify(data)
    });
    return await res.json();
  },

  // Offboarding
  getOffboarding: async () => {
    const res = await fetch(`${API_BASE}/offboarding`);
    return await res.json();
  },

  submitResignation: async (data) => {
    const res = await fetch(`${API_BASE}/offboarding/resign`, {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify(data)
    });
    return await res.json();
  },

  // Reports
  getAnalytics: async () => {
    const res = await fetch(`${API_BASE}/reports/analytics`);
    return await res.json();
  },

  // Org
  getDepartments: async () => {
    const res = await fetch(`${API_BASE}/org/departments`);
    return await res.json();
  },

  getLocations: async () => {
    const res = await fetch(`${API_BASE}/org/locations`);
    return await res.json();
  },

  getHierarchy: async () => {
    const res = await fetch(`${API_BASE}/org/hierarchy`);
    return await res.json();
  },

  // Settings & Integrations
  getSettings: async () => {
    const res = await fetch(`${API_BASE}/settings`);
    return await res.json();
  },

  updateSettings: async (data) => {
    const res = await fetch(`${API_BASE}/settings`, {
      method: 'PUT',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify(data)
    });
    return await res.json();
  },

  getAuditLogs: async () => {
    const res = await fetch(`${API_BASE}/audit-logs`);
    return await res.json();
  },

  getNotifications: async () => {
    const res = await fetch(`${API_BASE}/notifications`);
    return await res.json();
  },

  markNotificationsRead: async () => {
    const res = await fetch(`${API_BASE}/notifications/mark-read`, { method: 'PUT' });
    return await res.json();
  },

  getIntegrations: async () => {
    const res = await fetch(`${API_BASE}/integrations`);
    return await res.json();
  },

  testIntegration: async (id) => {
    const res = await fetch(`${API_BASE}/integrations/${id}/test`, { method: 'POST' });
    return await res.json();
  }
};
