const express = require('express');
const cors = require('cors');
const { v4: uuidv4 } = require('uuid');
const { loadData, saveData } = require('./db');

const app = express();
const PORT = process.env.PORT || 5000;

app.use(cors());
app.use(express.json());

// Helper logging
function logAction(user, action, moduleName) {
  const db = loadData();
  const newLog = {
    id: `log-${Date.now()}`,
    timestamp: new Date().toISOString().replace('T', ' ').substring(0, 19),
    user: user || "System User",
    action: action,
    ip: "127.0.0.1",
    module: moduleName || "General"
  };
  db.auditLogs = [newLog, ...(db.auditLogs || [])].slice(0, 100);
  saveData(db);
}

// -------------------------------------------------------------
// 1. HEALTH & METRICS
// -------------------------------------------------------------
app.get('/api/health', (req, res) => {
  res.json({ status: 'ok', service: 'NexusHR Core API Server', version: '2.0.0', time: new Date() });
});

// -------------------------------------------------------------
// 2. AUTHENTICATION & USER MANAGEMENT
// -------------------------------------------------------------
app.post('/api/auth/login', (req, res) => {
  const { email, password, role } = req.body;
  const db = loadData();
  
  // Find or fallback by role or email
  let user = db.users.find(u => u.email.toLowerCase() === (email || '').toLowerCase());
  if (!user && role) {
    user = db.users.find(u => u.role === role);
  }
  if (!user) {
    user = db.users[0]; // fallback to admin for testing ease
  }

  logAction(user.name, `Logged into HR Portal as ${user.role.toUpperCase()}`, "Authentication");
  res.json({
    success: true,
    token: `jwt-mock-token-${user.id}-${Date.now()}`,
    user: user
  });
});

app.get('/api/auth/users', (req, res) => {
  const db = loadData();
  res.json(db.users);
});

app.post('/api/auth/switch-role', (req, res) => {
  const { role } = req.body;
  const db = loadData();
  const user = db.users.find(u => u.role === role) || db.users[0];
  logAction(user.name, `Switched view mode to ${role}`, "User Management");
  res.json({ success: true, user });
});

app.post('/api/auth/reset-password', (req, res) => {
  const { email } = req.body;
  logAction(email || "User", "Requested password reset instructions", "Authentication");
  res.json({ success: true, message: `Password reset link dispatched to ${email}` });
});

// -------------------------------------------------------------
// 3. HR DASHBOARD & STATS
// -------------------------------------------------------------
app.get('/api/dashboard/stats', (req, res) => {
  const db = loadData();
  const totalEmployees = db.employees.length;
  const activeEmployees = db.employees.filter(e => e.employmentStatus === 'Active').length;
  const onLeaveToday = db.attendance.filter(a => a.status === 'On Leave').length;
  const presentToday = db.attendance.filter(a => a.status === 'Present' || a.status === 'Late').length;
  const pendingLeaves = db.leaves.filter(l => l.status === 'Pending').length;
  const pendingExpenses = db.expenses.filter(e => e.status === 'Pending').length;
  const openJobs = db.jobs.filter(j => j.status === 'Active').length;
  const openTickets = db.tickets.filter(t => t.status !== 'Resolved').length;

  res.json({
    totalEmployees,
    activeEmployees,
    onLeaveToday,
    presentToday,
    attendanceRate: Math.round((presentToday / (totalEmployees || 1)) * 100),
    pendingLeaves,
    pendingExpenses,
    openJobs,
    openTickets,
    company: db.company,
    recentAnnouncements: db.announcements.slice(0, 3),
    upcomingHolidays: db.holidays.slice(0, 3),
    pendingApprovals: [
      ...db.leaves.filter(l => l.status === 'Pending').map(l => ({ type: 'Leave', id: l.id, title: `${l.employeeName} - ${l.leaveType} (${l.totalDays}d)`, date: l.appliedOn })),
      ...db.expenses.filter(e => e.status === 'Pending').map(e => ({ type: 'Expense', id: e.id, title: `${e.employeeName} - ₹${e.amount} (${e.category})`, date: e.date }))
    ]
  });
});

// -------------------------------------------------------------
// 4. EMPLOYEE MANAGEMENT
// -------------------------------------------------------------
app.get('/api/employees', (req, res) => {
  const db = loadData();
  const { search, department, status } = req.query;
  let list = db.employees;

  if (search) {
    const q = search.toLowerCase();
    list = list.filter(e => 
      e.firstName.toLowerCase().includes(q) ||
      e.lastName.toLowerCase().includes(q) ||
      e.id.toLowerCase().includes(q) ||
      e.email.toLowerCase().includes(q) ||
      e.designation.toLowerCase().includes(q)
    );
  }
  if (department && department !== 'All') {
    list = list.filter(e => e.department === department);
  }
  if (status && status !== 'All') {
    list = list.filter(e => e.employmentStatus === status);
  }

  res.json(list);
});

app.get('/api/employees/:id', (req, res) => {
  const db = loadData();
  const emp = db.employees.find(e => e.id === req.params.id);
  if (!emp) return res.status(404).json({ error: "Employee not found" });
  res.json(emp);
});

app.post('/api/employees', (req, res) => {
  const db = loadData();
  const count = db.employees.length + 1;
  const newEmpId = `NEX-00${count}`;
  
  const newEmp = {
    id: newEmpId,
    firstName: req.body.firstName || "New",
    lastName: req.body.lastName || "Employee",
    email: req.body.email || `emp${count}@nexus.hr`,
    phone: req.body.phone || "+91 98000 00000",
    gender: req.body.gender || "Other",
    dob: req.body.dob || "1995-01-01",
    bloodGroup: req.body.bloodGroup || "O+",
    maritalStatus: req.body.maritalStatus || "Single",
    joiningDate: req.body.joiningDate || new Date().toISOString().split('T')[0],
    department: req.body.department || "Engineering",
    designation: req.body.designation || "Software Engineer",
    employmentType: req.body.employmentType || "Full-Time",
    employmentStatus: "Active",
    reportingManager: req.body.reportingManager || "Priya Nair",
    workLocation: req.body.workLocation || "Bengaluru HQ",
    avatar: req.body.avatar || "https://images.unsplash.com/photo-1535713875002-d1d0cf377fde?auto=format&fit=crop&w=200&h=200&q=80",
    address: req.body.address || { line1: "Tech Boulevard", city: "Bengaluru", state: "Karnataka", pincode: "560100" },
    emergencyContact: req.body.emergencyContact || { name: "Contact", relationship: "Family", phone: "+91 99999 88888" },
    bankDetails: req.body.bankDetails || { bankName: "HDFC Bank", accountNumber: "501000000000", ifscCode: "HDFC0001234", branch: "Bengaluru" },
    statutoryDetails: req.body.statutoryDetails || { pan: "ABCDE1234F", uan: "100908000000", esiNumber: "31000000000000" },
    salary: req.body.salary || { ctc: 1500000, basic: 60000, hra: 30000, da: 5000, specialAllowance: 30000, pfEmployee: 7200, esiEmployee: 0, professionalTax: 200, tds: 6500, netPay: 106100 },
    skills: req.body.skills || ["Communication", "Problem Solving"],
    experienceYears: req.body.experienceYears || 2
  };

  db.employees.push(newEmp);
  db.leaveBalances[newEmpId] = { casual: 12, sick: 8, earned: 15, compOff: 0 };
  
  // also add default today attendance record
  db.attendance.push({
    id: `att-${Date.now()}`,
    employeeId: newEmpId,
    date: new Date().toISOString().split('T')[0],
    punchIn: null,
    punchOut: null,
    totalHours: "0h 0m",
    status: "Present",
    mode: "Office",
    overtime: "0h 0m"
  });

  saveData(db);
  logAction("Admin", `Added new employee ${newEmp.firstName} ${newEmp.lastName} (${newEmpId})`, "Employee Management");
  res.status(201).json(newEmp);
});

app.put('/api/employees/:id', (req, res) => {
  const db = loadData();
  const idx = db.employees.findIndex(e => e.id === req.params.id);
  if (idx === -1) return res.status(404).json({ error: "Employee not found" });

  db.employees[idx] = { ...db.employees[idx], ...req.body };
  saveData(db);
  logAction("User", `Updated employee profile for ${db.employees[idx].firstName} ${db.employees[idx].lastName}`, "Employee Management");
  res.json(db.employees[idx]);
});

// -------------------------------------------------------------
// 5. ATTENDANCE MANAGEMENT
// -------------------------------------------------------------
app.get('/api/attendance', (req, res) => {
  const db = loadData();
  const uniqueAttendance = [];

  db.attendance.forEach(record => {
    const key = `${record.employeeId}-${record.date}`;
    const index = uniqueAttendance.findIndex(item => `${item.employeeId}-${item.date}` === key);

    if (index === -1) {
      uniqueAttendance.push(record);
    } else {
      uniqueAttendance[index] = record;
    }
  });

  const enriched = uniqueAttendance.map(a => {
    const emp = db.employees.find(e => e.id === a.employeeId);
    return {
      ...a,
      employeeName: emp ? `${emp.firstName} ${emp.lastName}` : a.employeeId,
      department: emp ? emp.department : 'N/A',
      designation: emp ? emp.designation : 'N/A',
      avatar: emp ? emp.avatar : null
    };
  });
  res.json(enriched);
});

app.post('/api/attendance/punch', (req, res) => {
  const { employeeId, type, mode } = req.body; // type: 'in' or 'out'
  const db = loadData();
  const today = new Date().toISOString().split('T')[0];
  const now = new Date().toLocaleTimeString('en-US', { hour: '2-digit', minute: '2-digit' });

  const sameDayRecords = db.attendance.filter(a => a.employeeId === employeeId && a.date === today);
  let record = sameDayRecords[sameDayRecords.length - 1] || null;

  if (sameDayRecords.length > 1) {
    const newestId = record?.id;
    db.attendance = db.attendance.filter(a => !(a.employeeId === employeeId && a.date === today && a.id !== newestId));
  }

  if (!record) {
    record = {
      id: `att-${Date.now()}`,
      employeeId,
      date: today,
      punchIn: type === 'in' ? now : null,
      punchOut: type === 'out' ? now : null,
      totalHours: type === 'in' ? "In Progress" : "8h 30m",
      status: "Present",
      mode: mode || "Office",
      overtime: "0h 0m"
    };
    db.attendance.push(record);
  } else {
    if (type === 'in') {
      record.punchOut = null;
      record.punchIn = now;
      record.totalHours = "In Progress";
      record.status = "Present";
      record.mode = mode || record.mode;
    } else {
      record.punchOut = now;
      record.totalHours = "8h 45m";
      record.status = "Present";
    }
  }

  saveData(db);
  logAction(employeeId, `Punched ${type.toUpperCase()} at ${now} (${mode || 'Office'})`, "Attendance");
  res.json({ success: true, record });
});

app.post('/api/attendance/regularize', (req, res) => {
  const { employeeId, date, reason } = req.body;
  logAction(employeeId, `Submitted attendance regularization request for date ${date}: ${reason}`, "Attendance");
  res.json({ success: true, message: "Attendance regularization request submitted to Manager for approval" });
});

app.post('/api/attendance/sync-biometric', (req, res) => {
  logAction("Admin", "Triggered manual biometric machine sync from ZKTeco Cloud API", "Integrations");
  res.json({ success: true, syncedRecords: 28, message: "Biometric attendance logs synced successfully." });
});

// -------------------------------------------------------------
// 6. LEAVE MANAGEMENT
// -------------------------------------------------------------
app.get('/api/leaves', (req, res) => {
  const db = loadData();
  res.json(db.leaves);
});

app.get('/api/leaves/balances/:employeeId', (req, res) => {
  const db = loadData();
  const balance = db.leaveBalances[req.params.employeeId] || { casual: 10, sick: 7, earned: 15, compOff: 1 };
  res.json(balance);
});

app.post('/api/leaves/apply', (req, res) => {
  const db = loadData();
  const { employeeId, leaveType, startDate, endDate, totalDays, isHalfDay, reason } = req.body;
  
  const emp = db.employees.find(e => e.id === employeeId);
  const newLeave = {
    id: `lv-${Date.now()}`,
    employeeId,
    employeeName: emp ? `${emp.firstName} ${emp.lastName}` : "Employee",
    leaveType: leaveType || "Casual Leave",
    startDate,
    endDate,
    totalDays: Number(totalDays) || 1,
    isHalfDay: !!isHalfDay,
    reason: reason || "Personal engagement",
    status: "Pending",
    appliedOn: new Date().toISOString().split('T')[0],
    approvedBy: null,
    approvalNotes: null
  };

  db.leaves.unshift(newLeave);
  saveData(db);
  logAction(emp ? emp.firstName : employeeId, `Applied for ${newLeave.totalDays} day(s) of ${leaveType}`, "Leave Management");
  res.status(201).json(newLeave);
});

app.put('/api/leaves/:id/status', (req, res) => {
  const { status, approvedBy, notes } = req.body; // Approved or Rejected
  const db = loadData();
  const idx = db.leaves.findIndex(l => l.id === req.params.id);
  if (idx === -1) return res.status(404).json({ error: "Leave request not found" });

  db.leaves[idx].status = status;
  db.leaves[idx].approvedBy = approvedBy || "HR Admin";
  db.leaves[idx].approvalNotes = notes || (status === 'Approved' ? 'Approved by Manager' : 'Leave request rejected');

  // Deduct from balance if approved
  if (status === 'Approved') {
    const leave = db.leaves[idx];
    const empBalance = db.leaveBalances[leave.employeeId];
    if (empBalance) {
      if (leave.leaveType.toLowerCase().includes('casual')) empBalance.casual = Math.max(0, empBalance.casual - leave.totalDays);
      else if (leave.leaveType.toLowerCase().includes('sick')) empBalance.sick = Math.max(0, empBalance.sick - leave.totalDays);
      else if (leave.leaveType.toLowerCase().includes('earned')) empBalance.earned = Math.max(0, empBalance.earned - leave.totalDays);
      else if (leave.leaveType.toLowerCase().includes('comp')) empBalance.compOff = Math.max(0, empBalance.compOff - leave.totalDays);
    }
  }

  saveData(db);
  logAction(approvedBy || "Manager", `${status} leave request for ${db.leaves[idx].employeeName}`, "Leave Management");
  res.json(db.leaves[idx]);
});

app.get('/api/holidays', (req, res) => {
  const db = loadData();
  res.json(db.holidays);
});

// -------------------------------------------------------------
// 7. PAYROLL MANAGEMENT (India Compliant)
// -------------------------------------------------------------
app.get('/api/payroll/runs', (req, res) => {
  const db = loadData();
  res.json(db.payrollRuns);
});

app.get('/api/payroll/employee/:id', (req, res) => {
  const db = loadData();
  const emp = db.employees.find(e => e.id === req.params.id);
  if (!emp) return res.status(404).json({ error: "Employee not found" });

  // Generate detailed payslip structure
  const sal = emp.salary;
  const payslip = {
    employeeId: emp.id,
    name: `${emp.firstName} ${emp.lastName}`,
    designation: emp.designation,
    department: emp.department,
    joiningDate: emp.joiningDate,
    pan: emp.statutoryDetails.pan,
    uan: emp.statutoryDetails.uan,
    bankName: emp.bankDetails.bankName,
    accountNumber: emp.bankDetails.accountNumber,
    month: "September 2026",
    workingDays: 30,
    paidDays: 30,
    earnings: {
      basic: sal.basic,
      hra: sal.hra,
      da: sal.da,
      specialAllowance: sal.specialAllowance,
      grossTotal: sal.basic + sal.hra + sal.da + sal.specialAllowance
    },
    deductions: {
      providentFund: sal.pfEmployee,
      esi: sal.esiEmployee,
      professionalTax: sal.professionalTax,
      tds: sal.tds,
      totalDeductions: sal.pfEmployee + sal.esiEmployee + sal.professionalTax + sal.tds
    },
    netPayable: (sal.basic + sal.hra + sal.da + sal.specialAllowance) - (sal.pfEmployee + sal.esiEmployee + sal.professionalTax + sal.tds)
  };

  res.json(payslip);
});

app.post('/api/payroll/process-run', (req, res) => {
  const { month } = req.body;
  const db = loadData();

  let gross = 0;
  let deductions = 0;
  db.employees.forEach(e => {
    const s = e.salary;
    const g = s.basic + s.hra + s.da + s.specialAllowance;
    const d = s.pfEmployee + s.esiEmployee + s.professionalTax + s.tds;
    gross += g;
    deductions += d;
  });

  const newRun = {
    id: `payrun-${Date.now()}`,
    month: month || "October 2026",
    processedDate: new Date().toISOString().split('T')[0],
    totalEmployees: db.employees.length,
    grossTotal: gross,
    deductionsTotal: deductions,
    netTotal: gross - deductions,
    status: "Processed & Scheduled for Disbursement",
    bankBatchId: `BATCH-HDFC-${Date.now().toString().slice(-6)}`
  };

  db.payrollRuns.unshift(newRun);
  saveData(db);
  logAction("Admin", `Processed monthly payroll for ${newRun.month} (Net: ₹${newRun.netTotal.toLocaleString('en-IN')})`, "Payroll");
  res.status(201).json(newRun);
});

// -------------------------------------------------------------
// 8. RECRUITMENT & ATS
// -------------------------------------------------------------
app.get('/api/recruitment/jobs', (req, res) => {
  const db = loadData();
  res.json(db.jobs);
});

app.post('/api/recruitment/jobs', (req, res) => {
  const db = loadData();
  const newJob = {
    id: `job-${Date.now().toString().slice(-4)}`,
    title: req.body.title || "New Job Role",
    department: req.body.department || "Engineering",
    location: req.body.location || "Bengaluru HQ",
    type: req.body.type || "Full-Time",
    experience: req.body.experience || "3-5 Years",
    salaryRange: req.body.salaryRange || "Competitive",
    status: "Active",
    openings: Number(req.body.openings) || 1,
    postedDate: new Date().toISOString().split('T')[0],
    description: req.body.description || "Exciting role at Nexus Enterprise.",
    applicantsCount: 0
  };
  db.jobs.unshift(newJob);
  saveData(db);
  logAction("HR Recruiter", `Created job opening for ${newJob.title}`, "Recruitment");
  res.status(201).json(newJob);
});

app.get('/api/recruitment/candidates', (req, res) => {
  const db = loadData();
  res.json(db.candidates);
});

app.put('/api/recruitment/candidates/:id/stage', (req, res) => {
  const { stage, notes } = req.body;
  const db = loadData();
  const idx = db.candidates.findIndex(c => c.id === req.params.id);
  if (idx === -1) return res.status(404).json({ error: "Candidate not found" });

  db.candidates[idx].stage = stage;
  if (notes) db.candidates[idx].notes = notes;

  saveData(db);
  logAction("HR Recruiter", `Moved candidate ${db.candidates[idx].name} to stage ${stage}`, "Recruitment");
  res.json(db.candidates[idx]);
});

app.post('/api/recruitment/schedule-interview', (req, res) => {
  const { candidateId, date, time, interviewer } = req.body;
  const db = loadData();
  const idx = db.candidates.findIndex(c => c.id === candidateId);
  if (idx !== -1) {
    db.candidates[idx].interviewScheduled = `${date} ${time}`;
    saveData(db);
  }
  logAction("Recruiter", `Scheduled interview for candidate on ${date} ${time} with ${interviewer}`, "Recruitment");
  res.json({ success: true, message: "Interview invite sent via Google Calendar & Email" });
});

// -------------------------------------------------------------
// 9. EMPLOYEE ONBOARDING
// -------------------------------------------------------------
app.get('/api/onboarding', (req, res) => {
  const db = loadData();
  res.json(db.onboarding);
});

app.put('/api/onboarding/:id/task', (req, res) => {
  const { taskIndex, done } = req.body;
  const db = loadData();
  const idx = db.onboarding.findIndex(o => o.id === req.params.id);
  if (idx === -1) return res.status(404).json({ error: "Onboarding record not found" });

  if (db.onboarding[idx].checklist[taskIndex]) {
    db.onboarding[idx].checklist[taskIndex].done = done;
    db.onboarding[idx].checklist[taskIndex].date = done ? new Date().toISOString().split('T')[0] : null;
    
    // Recalculate progress
    const completed = db.onboarding[idx].checklist.filter(c => c.done).length;
    db.onboarding[idx].progress = Math.round((completed / db.onboarding[idx].checklist.length) * 100);
  }

  saveData(db);
  logAction("HR Admin", `Updated onboarding checklist for ${db.onboarding[idx].employeeName}`, "Onboarding");
  res.json(db.onboarding[idx]);
});

// -------------------------------------------------------------
// 10. PERFORMANCE MANAGEMENT
// -------------------------------------------------------------
app.get('/api/performance/goals', (req, res) => {
  const db = loadData();
  res.json(db.goals);
});

app.put('/api/performance/goals/:id', (req, res) => {
  const { progress, status } = req.body;
  const db = loadData();
  const idx = db.goals.findIndex(g => g.id === req.params.id);
  if (idx === -1) return res.status(404).json({ error: "Goal not found" });

  if (progress !== undefined) db.goals[idx].progress = Number(progress);
  if (status) db.goals[idx].status = status;

  saveData(db);
  res.json(db.goals[idx]);
});

app.get('/api/performance/reviews', (req, res) => {
  const db = loadData();
  res.json(db.reviews);
});

app.post('/api/performance/reviews', (req, res) => {
  const db = loadData();
  const newRev = {
    id: `rev-${Date.now()}`,
    ...req.body
  };
  db.reviews.push(newRev);
  saveData(db);
  logAction("Reviewer", `Submitted performance review for ${newRev.employeeName}`, "Performance");
  res.status(201).json(newRev);
});

// -------------------------------------------------------------
// 11. TRAINING & DEVELOPMENT (LMS)
// -------------------------------------------------------------
app.get('/api/training/courses', (req, res) => {
  const db = loadData();
  res.json(db.courses);
});

app.post('/api/training/enroll', (req, res) => {
  const { courseId, employeeId } = req.body;
  const db = loadData();
  const course = db.courses.find(c => c.id === courseId);
  if (course) {
    course.enrolledCount += 1;
    saveData(db);
  }
  logAction(employeeId || "Employee", `Enrolled in course: ${course ? course.title : courseId}`, "Training");
  res.json({ success: true, message: "Enrolled in course successfully" });
});

// -------------------------------------------------------------
// 12. EXPENSE MANAGEMENT
// -------------------------------------------------------------
app.get('/api/expenses', (req, res) => {
  const db = loadData();
  res.json(db.expenses);
});

app.post('/api/expenses', (req, res) => {
  const db = loadData();
  const { employeeId, category, amount, description, receiptUrl } = req.body;
  const emp = db.employees.find(e => e.id === employeeId);

  const newExp = {
    id: `exp-${Date.now()}`,
    employeeId: employeeId || "NEX-003",
    employeeName: emp ? `${emp.firstName} ${emp.lastName}` : "Employee",
    category: category || "General Expense",
    amount: Number(amount) || 0,
    date: new Date().toISOString().split('T')[0],
    description: description || "",
    receiptUrl: receiptUrl || "receipt_attachment.pdf",
    status: "Pending",
    reimbursed: false,
    approvedBy: null
  };

  db.expenses.unshift(newExp);
  saveData(db);
  logAction(newExp.employeeName, `Submitted expense claim of ₹${newExp.amount} for ${newExp.category}`, "Expense Management");
  res.status(201).json(newExp);
});

app.put('/api/expenses/:id/status', (req, res) => {
  const { status, approvedBy } = req.body;
  const db = loadData();
  const idx = db.expenses.findIndex(e => e.id === req.params.id);
  if (idx === -1) return res.status(404).json({ error: "Expense not found" });

  db.expenses[idx].status = status;
  db.expenses[idx].approvedBy = approvedBy || "Manager";
  if (status === 'Approved') db.expenses[idx].reimbursed = true;

  saveData(db);
  logAction(approvedBy || "Manager", `${status} expense claim for ${db.expenses[idx].employeeName} (₹${db.expenses[idx].amount})`, "Expense Management");
  res.json(db.expenses[idx]);
});

// -------------------------------------------------------------
// 13. EMPLOYEE DOCUMENTS
// -------------------------------------------------------------
app.get('/api/documents', (req, res) => {
  const db = loadData();
  res.json(db.documents);
});

app.post('/api/documents', (req, res) => {
  const db = loadData();
  const newDoc = {
    id: `doc-${Date.now()}`,
    title: req.body.title || "Uploaded Document",
    category: req.body.category || "General",
    size: req.body.size || "1.5 MB",
    uploadDate: new Date().toISOString().split('T')[0],
    expiryDate: req.body.expiryDate || "None",
    access: req.body.access || "All Employees"
  };
  db.documents.unshift(newDoc);
  saveData(db);
  logAction("User", `Uploaded company document: ${newDoc.title}`, "Documents");
  res.status(201).json(newDoc);
});

// -------------------------------------------------------------
// 14. HR HELPDESK & TICKETS
// -------------------------------------------------------------
app.get('/api/tickets', (req, res) => {
  const db = loadData();
  res.json(db.tickets);
});

app.post('/api/tickets', (req, res) => {
  const db = loadData();
  const { employeeId, category, subject, priority, message } = req.body;
  const emp = db.employees.find(e => e.id === employeeId);

  const newTicket = {
    id: `tkt-${Math.floor(100 + Math.random() * 900)}`,
    employeeId: employeeId || "NEX-003",
    employeeName: emp ? `${emp.firstName} ${emp.lastName}` : "Employee",
    category: category || "General HR Query",
    subject: subject || "HR Query",
    priority: priority || "Medium",
    status: "Open",
    createdAt: new Date().toISOString().replace('T', ' ').substring(0, 16),
    messages: [
      {
        sender: emp ? `${emp.firstName} ${emp.lastName}` : "Employee",
        role: "employee",
        text: message || subject,
        timestamp: new Date().toISOString().replace('T', ' ').substring(0, 16)
      }
    ]
  };

  db.tickets.unshift(newTicket);
  saveData(db);
  logAction(newTicket.employeeName, `Created HR support ticket #${newTicket.id}: ${newTicket.subject}`, "Helpdesk");
  res.status(201).json(newTicket);
});

app.post('/api/tickets/:id/reply', (req, res) => {
  const { sender, role, text } = req.body;
  const db = loadData();
  const idx = db.tickets.findIndex(t => t.id === req.params.id);
  if (idx === -1) return res.status(404).json({ error: "Ticket not found" });

  db.tickets[idx].messages.push({
    sender: sender || "HR Admin",
    role: role || "admin",
    text: text,
    timestamp: new Date().toISOString().replace('T', ' ').substring(0, 16)
  });
  if (role === 'admin') {
    db.tickets[idx].status = "In Progress";
  }

  saveData(db);
  res.json(db.tickets[idx]);
});

app.put('/api/tickets/:id/status', (req, res) => {
  const { status } = req.body;
  const db = loadData();
  const idx = db.tickets.findIndex(t => t.id === req.params.id);
  if (idx === -1) return res.status(404).json({ error: "Ticket not found" });

  db.tickets[idx].status = status;
  saveData(db);
  logAction("HR Support", `Updated ticket #${req.params.id} status to ${status}`, "Helpdesk");
  res.json(db.tickets[idx]);
});

// -------------------------------------------------------------
// 15. ANNOUNCEMENTS & NEWS
// -------------------------------------------------------------
app.get('/api/announcements', (req, res) => {
  const db = loadData();
  res.json(db.announcements);
});

app.post('/api/announcements', (req, res) => {
  const db = loadData();
  const newAnc = {
    id: `anc-${Date.now()}`,
    title: req.body.title || "Notice",
    category: req.body.category || "Company News",
    content: req.body.content || "",
    pinned: !!req.body.pinned,
    date: new Date().toISOString().split('T')[0],
    author: req.body.author || "HR Management"
  };
  db.announcements.unshift(newAnc);
  saveData(db);
  logAction(newAnc.author, `Published company announcement: ${newAnc.title}`, "Announcements");
  res.status(201).json(newAnc);
});

// -------------------------------------------------------------
// 16. EMPLOYEE ENGAGEMENT (Polls, Kudos, Suggestions)
// -------------------------------------------------------------
app.get('/api/engagement/kudos', (req, res) => {
  const db = loadData();
  res.json(db.kudos);
});

app.post('/api/engagement/kudos', (req, res) => {
  const db = loadData();
  const newKudo = {
    id: `kd-${Date.now()}`,
    from: req.body.from || "Aarav Sharma",
    to: req.body.to || "Team Member",
    badge: req.body.badge || "Star Contributor ⭐",
    message: req.body.message || "Great work!",
    date: new Date().toISOString().split('T')[0]
  };
  db.kudos.unshift(newKudo);
  saveData(db);
  logAction(newKudo.from, `Gave kudos badge '${newKudo.badge}' to ${newKudo.to}`, "Engagement");
  res.status(201).json(newKudo);
});

app.get('/api/engagement/polls', (req, res) => {
  const db = loadData();
  res.json(db.polls);
});

app.post('/api/engagement/polls/:id/vote', (req, res) => {
  const { optionIndex } = req.body;
  const db = loadData();
  const poll = db.polls.find(p => p.id === req.params.id);
  if (poll && poll.options[optionIndex]) {
    poll.options[optionIndex].votes += 1;
    poll.totalVotes += 1;
    saveData(db);
    return res.json(poll);
  }
  res.status(400).json({ error: "Invalid poll or option" });
});

app.get('/api/engagement/suggestions', (req, res) => {
  const db = loadData();
  res.json(db.suggestions);
});

app.post('/api/engagement/suggestions', (req, res) => {
  const db = loadData();
  const newSug = {
    id: `sug-${Date.now()}`,
    text: req.body.text || "",
    upvotes: 1,
    anonymous: !!req.body.anonymous,
    author: req.body.anonymous ? "Anonymous" : (req.body.author || "Employee"),
    status: "Under Review"
  };
  db.suggestions.unshift(newSug);
  saveData(db);
  res.status(201).json(newSug);
});

// -------------------------------------------------------------
// 17. OFFBOARDING & EXIT MANAGEMENT
// -------------------------------------------------------------
app.get('/api/offboarding', (req, res) => {
  const db = loadData();
  res.json(db.offboarding);
});

app.post('/api/offboarding/resign', (req, res) => {
  const db = loadData();
  const { employeeId, reason, proposedLastDate } = req.body;
  const emp = db.employees.find(e => e.id === employeeId);

  const newOff = {
    id: `off-${Date.now()}`,
    employeeId: employeeId || "NEX-003",
    employeeName: emp ? `${emp.firstName} ${emp.lastName}` : "Employee",
    department: emp ? emp.department : "Engineering",
    designation: emp ? emp.designation : "Engineer",
    resignationDate: new Date().toISOString().split('T')[0],
    lastWorkingDay: proposedLastDate || "2026-12-15",
    noticePeriodDays: 60,
    status: "Resignation Submitted",
    reason: reason || "Personal aspirations",
    clearance: {
      itAssetReturn: "Pending",
      financeClearance: "Pending",
      hrHandover: "Pending",
      adminBadgeReturn: "Pending"
    },
    finalSettlement: {
      pendingSalary: emp ? Math.round(emp.salary.ctc / 12) : 100000,
      leaveEncashment: 35000,
      gratuity: 40000,
      deductions: 0,
      netPayable: (emp ? Math.round(emp.salary.ctc / 12) : 100000) + 75000
    }
  };

  db.offboarding.unshift(newOff);
  saveData(db);
  logAction(newOff.employeeName, "Submitted formal resignation letter", "Offboarding");
  res.status(201).json(newOff);
});

// -------------------------------------------------------------
// 18. REPORTS & ANALYTICS
// -------------------------------------------------------------
app.get('/api/reports/analytics', (req, res) => {
  const db = loadData();
  
  // Department breakdown
  const deptCounts = {};
  db.employees.forEach(e => {
    deptCounts[e.department] = (deptCounts[e.department] || 0) + 1;
  });

  // Gender breakdown
  let male = 0, female = 0, other = 0;
  db.employees.forEach(e => {
    if (e.gender === 'Male') male++;
    else if (e.gender === 'Female') female++;
    else other++;
  });

  res.json({
    headcountTrend: [
      { month: "May 2026", count: 48 },
      { month: "Jun 2026", count: 52 },
      { month: "Jul 2026", count: 58 },
      { month: "Aug 2026", count: 64 },
      { month: "Sep 2026", count: 70 },
      { month: "Oct 2026", count: db.employees.length }
    ],
    departmentDistribution: Object.keys(deptCounts).map(name => ({ name, count: deptCounts[name] })),
    genderDiversity: { male, female, other, femaleRatio: Math.round((female / (db.employees.length || 1)) * 100) },
    attendanceRateMonthly: 96.4,
    attritionRateAnnual: 4.2,
    totalMonthlyPayrollSpend: db.employees.reduce((acc, e) => acc + (e.salary.ctc / 12), 0)
  });
});

// -------------------------------------------------------------
// 19. ORGANIZATION STRUCTURE & DEPARTMENTS
// -------------------------------------------------------------
app.get('/api/org/departments', (req, res) => {
  const db = loadData();
  res.json(db.departments);
});

app.get('/api/org/locations', (req, res) => {
  const db = loadData();
  res.json(db.locations);
});

app.get('/api/org/hierarchy', (req, res) => {
  const db = loadData();
  // Return hierarchy tree
  const tree = {
    id: "NEX-000",
    name: "Vikram Singhania",
    title: "Chief Executive Officer (CEO)",
    avatar: "https://images.unsplash.com/photo-1507003211169-0a1dd7228f2d?auto=format&fit=crop&w=200&h=200&q=80",
    children: [
      {
        id: "NEX-001",
        name: "Aarav Sharma",
        title: "VP & Head of Human Resources",
        avatar: "https://images.unsplash.com/photo-1534528741775-53994a69daeb?auto=format&fit=crop&w=200&h=200&q=80",
        children: [
          { id: "NEX-005", name: "Kavita Rao", title: "HR Generalist", avatar: "https://images.unsplash.com/photo-1580489944761-15a19d654956?auto=format&fit=crop&w=200&h=200&q=80" },
          { id: "NEX-007", name: "Sneha Mukherjee", title: "Communications Specialist", avatar: "https://images.unsplash.com/photo-1494790108377-be9c29b29330?auto=format&fit=crop&w=200&h=200&q=80" }
        ]
      },
      {
        id: "NEX-002",
        name: "Priya Nair",
        title: "Director of Engineering",
        avatar: "https://images.unsplash.com/photo-1573496359142-b8d87734a5a2?auto=format&fit=crop&w=200&h=200&q=80",
        children: [
          { id: "NEX-003", name: "Rohan Verma", title: "Senior Frontend Engineer", avatar: "https://images.unsplash.com/photo-1507003211169-0a1dd7228f2d?auto=format&fit=crop&w=200&h=200&q=80" },
          { id: "NEX-004", name: "Ananya Deshmukh", title: "Lead UI/UX Designer", avatar: "https://images.unsplash.com/photo-1544005313-94ddf0286df2?auto=format&fit=crop&w=200&h=200&q=80" },
          { id: "NEX-008", name: "Karthik Subramanian", title: "DevOps & Cloud Architect", avatar: "https://images.unsplash.com/photo-1519085360753-af0119f7cbe7?auto=format&fit=crop&w=200&h=200&q=80" }
        ]
      },
      {
        id: "NEX-006",
        name: "Devendra Kulkarni",
        title: "Finance Manager",
        avatar: "https://images.unsplash.com/photo-1500648767791-00dcc994a43e?auto=format&fit=crop&w=200&h=200&q=80",
        children: []
      }
    ]
  };
  res.json(tree);
});

// -------------------------------------------------------------
// 20. SETTINGS, AUDIT LOGS, NOTIFICATIONS & INTEGRATIONS
// -------------------------------------------------------------
app.get('/api/settings', (req, res) => {
  const db = loadData();
  res.json({ company: db.company });
});

app.put('/api/settings', (req, res) => {
  const db = loadData();
  db.company = { ...db.company, ...req.body };
  saveData(db);
  logAction("Admin", "Updated corporate HR portal settings", "HR Administration");
  res.json({ success: true, company: db.company });
});

app.get('/api/audit-logs', (req, res) => {
  const db = loadData();
  res.json(db.auditLogs);
});

app.get('/api/notifications', (req, res) => {
  const db = loadData();
  res.json(db.notifications);
});

app.put('/api/notifications/mark-read', (req, res) => {
  const db = loadData();
  db.notifications.forEach(n => n.unread = false);
  saveData(db);
  res.json({ success: true });
});

app.get('/api/integrations', (req, res) => {
  const db = loadData();
  res.json(db.integrations);
});

app.post('/api/integrations/:id/test', (req, res) => {
  logAction("Admin", `Tested integration connection #${req.params.id}`, "Integrations");
  res.json({ success: true, message: "Connection test successful. Latency: 42ms. Health status: Optimal." });
});

// Start Server
app.listen(PORT, () => {
  console.log(`=======================================================`);
  console.log(`NexusHR Enterprise Backend Server running on port ${PORT}`);
  console.log(`API Health: http://localhost:${PORT}/api/health`);
  console.log(`=======================================================`);
});
