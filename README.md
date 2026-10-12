# NexusHR — Next-Gen Enterprise Human Resource & Workforce OS

> An end-to-end, full-stack enterprise Human Resource Management System (HRMS) covering all 25 modules specified in the architectural blueprint, with comprehensive Indian statutory compliance (PF, ESI, PT, TDS, Form 16), live biometric punch simulation, ATS recruitment pipeline, LMS, performance OKRs, and dedicated Employee Self-Service (ESS).

---

## 🚀 Live Application URLs

- **Frontend Portal & Public Website:** [http://localhost:5173](http://localhost:5173)
- **Backend Core REST API:** [http://localhost:5000/api/health](http://localhost:5000/api/health)

---

## 👥 Instant 1-Click Role Switcher & Pre-configured Personas

In the top header navigation, you can click on any role pill to instantly test the platform from that persona's perspective:

| Persona | Name | Email | Role / Perspective | Key Capabilities |
| :--- | :--- | :--- | :--- | :--- |
| **HR Administrator** | Aarav Sharma | `admin@nexus.hr` | `admin` | Full control over directory, payroll runs, ATS, offboarding, company settings, RBAC, audit logs |
| **Department Manager** | Priya Nair | `manager@nexus.hr` | `manager` | Approves team leaves, conducts 360 reviews, schedules candidate interviews, approves expenses |
| **Employee (ESS)** | Rohan Verma | `employee@nexus.hr` | `employee` | Dedicated Employee Self-Service: Punch clock, apply leaves, download payslips, submit expenses, raise tickets |

You can also click **"Public Website"** in the top navigation to preview the full landing page!

---

## 📁 Project Architecture

```
HR PORTAL/
├── BACKEND/
│   ├── server.js          # Express.js REST API with 30+ endpoints covering all 25 modules
│   ├── db.js              # Database module & initial enterprise seed data
│   ├── database.json      # Persistent local database store
│   └── package.json       # Backend dependencies (express, cors, uuid, etc.)
│
├── FRONTEND/
│   ├── src/
│   │   ├── components/
│   │   │   ├── landing/
│   │   │   │   └── LandingPage.jsx       # Section 1: Hero, Features, Why Choose Us, Benefits, Pricing, FAQ, Contact
│   │   │   ├── layout/
│   │   │   │   ├── Navbar.jsx            # Top bar with Live Clock, Role Switcher, Notifications & Profile
│   │   │   │   └── Sidebar.jsx           # Responsive dynamic sidebar for Admin vs Employee navigation
│   │   │   └── modules/
│   │   │       ├── DashboardView.jsx      # Section 3: HR Dashboard & KPI stats, approvals, milestones
│   │   │       ├── EmployeesView.jsx      # Section 4: Employee Directory, filters, multi-tab profile viewer & add modal
│   │   │       ├── EmployeePortalView.jsx # Section 5: Dedicated Employee Self-Service (ESS)
│   │   │       ├── AttendanceView.jsx     # Section 6: Live Punch In/Out, Biometrics sync, shifts, regularization
│   │   │       ├── LeaveView.jsx          # Section 7: Leave balances, apply modal, manager approval workflow, holidays
│   │   │       ├── PayrollView.jsx        # Section 8: Indian Statutory Payroll (PF, ESI, PT, TDS), slips, Form 16, Bank NEFT
│   │   │       ├── RecruitmentView.jsx    # Section 9: Job Openings, 6-stage ATS Kanban board, interview scheduler
│   │   │       ├── OnboardingView.jsx     # Section 10: New Joiner pipeline, interactive checklist, asset allocation
│   │   │       ├── PerformanceView.jsx    # Section 11: Strategic OKRs with sliders, 360 appraisal reviews, merit outcome
│   │   │       ├── TrainingView.jsx       # Section 12: LMS catalog (POSH, Security), enrollment, certificate generator
│   │   │       ├── ExpensesView.jsx       # Section 13: Expense claims, receipt attachments, multi-tier approvals
│   │   │       ├── DocumentsView.jsx      # Section 14: Centralized document vault, categories, expiry alerts
│   │   │       ├── HelpdeskView.jsx       # Section 15: HR Ticketing system, conversation thread & status updates
│   │   │       ├── AnnouncementsView.jsx  # Section 16: Company bulletins, priority pinning & broadcast modal
│   │   │       ├── EngagementView.jsx     # Section 17: Peer Kudos wall, live pulse polls with bar charts, suggestions
│   │   │       ├── OffboardingView.jsx    # Section 18: Resignation pipeline, notice countdown, clearance checklist, FnF & relieving letter
│   │   │       ├── ReportsView.jsx        # Section 19: Workforce analytics charts, diversity ratios, CSV & PDF export
│   │   │       ├── OrganizationView.jsx   # Section 20: Visual hierarchy tree, departments & branch locations
│   │   │       └── SettingsView.jsx       # Sections 21-24: Entity profile, 2FA, RBAC matrix, Integrations hub & Audit logs
│   │   ├── context/
│   │   │   └── AuthContext.jsx           # Global user state, role switcher, notifications & refresh trigger
│   │   ├── services/
│   │   │   └── api.js                   # Centralized API client connecting to backend REST endpoints
│   │   ├── App.jsx                      # Main router switching between Landing Page and 25 portal modules
│   │   └── main.jsx
│   ├── index.html                       # Tailwind CSS CDN setup, Google Inter fonts, and print stylesheet
│   └── vite.config.js                   # Vite config with API proxy to localhost:5000
│
├── start-servers.bat                    # Windows 1-click batch launcher
├── start-servers.ps1                    # PowerShell launcher
└── README.md
```

---

## 🌟 Detailed Implementation of the 25 Modules

### 1. Main Website / Landing Page
- **Hero Section**: Value proposition headline, live metrics, action buttons ("Login to Portal", "Request a Demo", "Quick Persona Previews").
- **About the HR Portal**: Architectural pillars: Security, Mobile Responsiveness, Biometric Sync, Executive Analytics.
- **Features Showcase**: Complete grid of all modules.
- **Why Choose Us**: 100% Indian Statutory compliance, bank-grade AES-256 encryption, 99.9% uptime.
- **Benefits for Stakeholders**: Dedicated value propositions for Employees, HR Managers, and Executive Management.
- **Pricing & Plans**: Starter, Professional, and Enterprise tiers with interactive Monthly vs Annual (20% discount) billing toggle.
- **FAQ Accordion**: 6 comprehensive answers to top customer questions.
- **Contact Us & Request a Demo Modal**: Fully validated lead capture forms with instant confirmation toasts.

### 2. Authentication & User Management
- Pre-configured demo logins for HR Admin, Department Manager, and Employee.
- Role-Based Access Control (RBAC) governing views and permissions.
- Two-Factor Authentication (2FA) toggle with OTP simulation.
- Profile editing and account security configuration.
- Top-level instant Role Switcher pill allowing seamless evaluation of all perspectives.

### 3. HR Dashboard
- **Key Metrics**: Total Headcount, Present Today, Attendance Rate %, On Leave Today, Pending Approvals, Open Jobs (ATS).
- **Pending Approvals Queue**: Live cards for leave and expense claims with 1-click Approve / Reject actions.
- **Celebrations & Milestones**: Upcoming employee birthdays and work anniversaries.
- **Upcoming Statutory Holidays**: Real-time count of public holidays.
- **Entity Statutory Profile**: Live GSTIN, PF code, and pay cycle parameters.

### 4. Employee Management
- **Directory**: Card grid with search by name, employee ID, and title, plus department filter pills.
- **Add Employee Modal**: Form with automatic Indian salary structure computation (Basic 40%, HRA 50%, DA 10%, Special Allowance, PF 12%, PT ₹200, TDS).
- **Multi-Tab Profile Drawer**:
  1. *Personal & Contact Information* (DOB, blood group, marital status, emergency contact, residential address)
  2. *Employment Details* (Department, designation, manager, joining date, type, location)
  3. *Compensation & Payroll* (Annual CTC, monthly breakdown, deductions)
  4. *Bank & Statutory* (Bank name, account number, IFSC, branch, PAN, EPF UAN, ESI)
  5. *Skills & Experience* (Badges, total years of experience)

### 5. Employee Self-Service (ESS)
- Dedicated personalized dashboard when logged in as an Employee.
- Quick actions: Apply Leave, View Latest Payslip, Claim Expense, Raise HR Request.
- Live attendance punch clock.
- Leave balances ledger (Casual, Sick, Earned, Comp-off).
- Net take-home salary summary with printable payslip format.

### 6. Attendance Management
- **Live Digital Punch Clock**: IST digital clock with Office vs WFH mode selector and geolocation stamp.
- **Metrics Overview**: Present, Late Arrivals (>9:30 AM grace cutoff), WFH, and On Leave.
- **Biometric Integration Sync**: 1-click sync simulator pulling hardware logs from ZKTeco / eSSL devices.
- **Attendance Regularization**: Modal for employees to request adjustments with reason.
- **Daily Attendance Register Table**: Complete daily logs with timestamps, modes, and statuses.

### 7. Leave Management
- **Balance Cards**: Casual Leave (12d), Sick Leave (10d), Earned/Privilege Leave (15d), Comp-Off.
- **Apply for Leave Modal**: Date picker, type, duration, half-day toggle, and reason.
- **Approval Pipeline**: Managers and Admins can approve or reject with comments, which instantly updates employee balances in real-time.
- **Statutory Holiday Calendar**: National and festival holidays schedule.

### 8. Payroll Management (India Statutory Compliant)
- **Salary Components**: Basic, HRA, DA, Special Allowance, Gross Pay.
- **Indian Statutory Deductions**:
  - Employee Provident Fund (EPF): 12% match
  - Employee State Insurance (ESIC): 0.75% / 3.25%
  - Professional Tax (PT): ₹200/month (Karnataka schedule)
  - Income Tax TDS: Calculated based on tax brackets
- **1-Click Batch Payroll Run**: Computes gross, deductions, and net disbursements across all employees and assigns bank batch ID.
- **Professional Printable Payslip Modal**: Full company credentials (CIN, GSTIN, PF Code, ESI Code), salary breakdown, net payable, and print capability (`window.print()`).
- **Form 16 Annual Tax Summary**: Part A & B certificate summary with standard deductions and tax deposit tracking.
- **Export Bank NEFT/RTGS Sheet**: Generates downloadable CSV with IFSC codes and account numbers for corporate banking upload.

### 9. Recruitment / Applicant Tracking (ATS)
- **Job Openings**: Active openings list with role details, salary range, and applicants counter.
- **Post Job Modal**: Quick creation of new open requisitions.
- **6-Stage ATS Kanban Board**: Applied → Screening → Technical Interview → HR Round → Offered → Hired.
- **Schedule Interview Modal**: Pick date, time, and lead interviewer with automatic calendar invite notification.
- **1-Click Candidate to Employee Conversion**: Transition offered candidates directly into the onboarding pipeline.

### 10. Employee Onboarding
- **New Joiner Pipeline**: Status and progress tracking for upcoming joinees.
- **Interactive Joining Checklist**: Real-time toggles for Offer Letter, KYC verification, bank submission, IT allocation, email setup, and induction.
- **IT Hardware Allocation**: Asset tag, serial number, and buddy assignment.

### 11. Performance Management
- **KPIs & Goals Tracker**: Strategic OKRs with interactive range sliders to adjust milestone progress in real time.
- **360° Review Cycle**: Self, peer, and manager evaluations with star ratings (1 to 5).
- **Appraisal Outcomes**: Promotion recommendations and merit bonus multipliers.

### 12. Training & Development (LMS)
- **Course Catalog**: Mandatory POSH compliance, ISO 27001 data security, leadership development.
- **Employee Enrollment**: 1-click self-enrollment.
- **Digital Certificate Generator**: View and download official certificate of completion with unique certificate ID.

### 13. Expense Management
- **Claim Submission**: Category (Travel, Client Meals, Subscriptions, Hardware), amount, description, and receipt attachment.
- **Multi-Level Approval**: Manager sign-off queue with Approve and Reject actions.
- **Reimbursement Status**: Track pending vs disbursed claims.

### 14. Employee Documents Vault
- Central repository for Company Policies, Benefits guides, Tax Documents, and Employment Contracts.
- **Upload Document Modal**: With document title, category, and access level.
- **Document Expiry Alerts**: Visual indicators for expiring documents (passports, certifications).
- Download simulation for employees.

### 15. HR Requests / Helpdesk
- Support ticketing system with categories (Payroll & Tax, IT Equipment, Leave Correction, Benefits).
- Priority badges (Low, Medium, High).
- **Interactive Conversation Thread**: Conversation modal between employee and HR support with live reply box and status changer.

### 16. Company Announcements
- Company-wide bulletin board with categorized tags (Events, Policy Updates, HR News).
- Priority pinning to the top of employee dashboards.
- **Broadcast Announcement Modal**: Create official notices for all branches.

### 17. Employee Engagement & Culture
- **Peer Recognition Kudos Wall**: Award badges ("Rockstar Coder 🚀", "Design Wizard 🎨", "Culture Champion 🌟") with custom appreciation notes.
- **Live Company Pulse Polls**: Real-time voting with animated percentage bars.
- **Suggestion Box**: Anonymous or signed workplace ideas with upvote counters.
- **eNPS Indicator**: Overall workplace satisfaction scoring (+74).

### 18. Offboarding & Exit Management
- **Resignation Initiation**: Proposed last working day, reason, and 60-day notice period countdown.
- **Multi-Department Clearance Checklist**: IT Laptop return, Finance advances, KT handover, Admin badge.
- **Full & Final (FnF) Settlement Calculator**: Pending salary, leave encashment, and statutory gratuity.
- **Official Relieving & Experience Letter Generator**: Printable formal relieving certificate with company seal and executive signature.

### 19. Reports & Workforce Analytics
- **Visual Analytics Charts**: 6-month headcount growth trend, department distribution, gender diversity ratio, monthly attendance rate, annual attrition rate.
- **1-Click Export to CSV**: Downloads executive report file.
- **Printable PDF Layout**: Clean print stylesheet.

### 20. Organization Management
- **Visual Organization Hierarchy Tree**: CEO → VP HR & Director of Engineering → Leads & Senior Engineers.
- **Departments Directory**: Heads, headcounts, annual budgets, and primary office locations.
- **Office Locations**: Bengaluru HQ, Mumbai Branch, Hyderabad Tech Hub, and Remote Pan-India.

### 21. HR Administration & Settings
- Entity statutory profile configuration (GSTIN, CIN, PF Code, ESI Code, Pay Cycle Day).
- Corporate address and rules update.

### 22. Notifications Center
- Top navigation bell icon with live unread counter badge.
- Dropdown drawer categorizing leave approvals, payroll credits, milestone reminders, and announcements.
- 1-click "Mark all read".

### 23. Security & Compliance
- Role-Based Access Control (RBAC) governance matrix.
- Two-Factor Authentication (2FA) status toggle.
- DPDP Act and ISO 27001 statutory compliance check.

### 24. Integrations Hub
- Status cards for Biometric Attendance Hardware (eSSL / ZKTeco), Slack & Microsoft Teams, Corporate Net Banking (HDFC / ICICI), TallyPrime Accounting, and Calendar Sync.
- Interactive **"Test Connection"** action with latency and health verification.

### 25. Mobile Responsive Experience & Navigation
- Full responsiveness across desktops, laptops, tablets, and smartphones.
- Mobile drawer navigation with hamburger toggle.
- Print stylesheets (`no-print` and `print-only`) for payslips, reports, and relieving letters.

---

## 🛠️ How to Run the Application

### Method 1: Double-Click Launcher (Windows)
Double-click `start-servers.bat` in the `HR PORTAL` folder. It will automatically start both servers and launch your browser!

### Method 2: Manual Terminal Commands

#### Terminal 1 — Backend:
```powershell
cd "c:\Users\SRIDHRAN.M\OneDrive\Desktop\HR PORTAL\BACKEND"
node server.js
```
*Backend runs on http://localhost:5000*

#### Terminal 2 — Frontend:
```powershell
cd "c:\Users\SRIDHRAN.M\OneDrive\Desktop\HR PORTAL\FRONTEND"
npm run dev
```
*Frontend runs on http://localhost:5173*
