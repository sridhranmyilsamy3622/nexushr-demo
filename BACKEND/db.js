const fs = require('fs');
const path = require('path');

const DB_FILE = path.join(__dirname, 'database.json');

// Initial seed data
const initialData = {
  company: {
    name: "Nexus Enterprise Technologies Pvt. Ltd.",
    shortName: "NexusHR",
    tagline: "Empowering Modern Workforce Management",
    taxId: "GSTIN29ABCDE1234F1Z5",
    cin: "U72200KA2021PTC145678",
    pan: "AAACN1234K",
    pfCode: "KN/BNG/0098765/000",
    esiCode: "31000123450000101",
    address: "7th Floor, Innovation Tech Park, Outer Ring Road, Bengaluru, Karnataka - 560103",
    email: "hr@nexus-enterprise.io",
    phone: "+91 80 4567 8900",
    website: "https://nexus-enterprise.io",
    currency: "INR (₹)",
    payCycleDay: 28,
    fiscalYear: "2026-2027"
  },
  users: [
    {
      id: "usr-1",
      name: "Aarav Sharma",
      email: "admin@nexus.hr",
      role: "admin", // HR Admin
      department: "Human Resources",
      designation: "VP & Head of Human Resources",
      avatar: "https://images.unsplash.com/photo-1534528741775-53994a69daeb?auto=format&fit=crop&w=200&h=200&q=80",
      employeeId: "NEX-001",
      phone: "+91 98450 12345",
      status: "Active"
    },
    {
      id: "usr-2",
      name: "Priya Nair",
      email: "manager@nexus.hr",
      role: "manager", // Department Manager
      department: "Engineering",
      designation: "Director of Engineering",
      avatar: "https://images.unsplash.com/photo-1573496359142-b8d87734a5a2?auto=format&fit=crop&w=200&h=200&q=80",
      employeeId: "NEX-002",
      phone: "+91 98450 67890",
      status: "Active"
    },
    {
      id: "usr-3",
      name: "Rohan Verma",
      email: "employee@nexus.hr",
      role: "employee", // Employee Self-Service
      department: "Engineering",
      designation: "Senior Frontend Engineer",
      avatar: "https://images.unsplash.com/photo-1507003211169-0a1dd7228f2d?auto=format&fit=crop&w=200&h=200&q=80",
      employeeId: "NEX-003",
      phone: "+91 98765 43210",
      status: "Active"
    }
  ],
  employees: [
    {
      id: "NEX-001",
      firstName: "Aarav",
      lastName: "Sharma",
      email: "admin@nexus.hr",
      phone: "+91 98450 12345",
      gender: "Male",
      dob: "1988-06-15",
      bloodGroup: "O+",
      maritalStatus: "Married",
      joiningDate: "2021-03-01",
      department: "Human Resources",
      designation: "VP & Head of Human Resources",
      employmentType: "Full-Time",
      employmentStatus: "Active",
      reportingManager: "Board of Directors",
      workLocation: "Bengaluru HQ",
      avatar: "https://images.unsplash.com/photo-1534528741775-53994a69daeb?auto=format&fit=crop&w=200&h=200&q=80",
      address: {
        line1: "#402, Green Glen Layout, Bellandur",
        city: "Bengaluru",
        state: "Karnataka",
        pincode: "560103"
      },
      emergencyContact: {
        name: "Neha Sharma",
        relationship: "Spouse",
        phone: "+91 98450 99887"
      },
      bankDetails: {
        bankName: "HDFC Bank",
        accountNumber: "50100234567891",
        ifscCode: "HDFC0001234",
        branch: "Koramangala, Bengaluru"
      },
      statutoryDetails: {
        pan: "ABCPS1234A",
        uan: "100908070605",
        esiNumber: "31009876540001"
      },
      salary: {
        ctc: 3200000,
        basic: 120000,
        hra: 60000,
        da: 15000,
        specialAllowance: 55000,
        pfEmployee: 14400,
        esiEmployee: 0,
        professionalTax: 200,
        tds: 25000,
        netPay: 205400
      },
      skills: ["HR Strategy", "Talent Acquisition", "Statutory Compliance", "Leadership", "Compensation & Benefits"],
      experienceYears: 14
    },
    {
      id: "NEX-002",
      firstName: "Priya",
      lastName: "Nair",
      email: "manager@nexus.hr",
      phone: "+91 98450 67890",
      gender: "Female",
      dob: "1990-11-20",
      bloodGroup: "A+",
      maritalStatus: "Married",
      joiningDate: "2021-06-15",
      department: "Engineering",
      designation: "Director of Engineering",
      employmentType: "Full-Time",
      employmentStatus: "Active",
      reportingManager: "Aarav Sharma",
      workLocation: "Bengaluru HQ",
      avatar: "https://images.unsplash.com/photo-1573496359142-b8d87734a5a2?auto=format&fit=crop&w=200&h=200&q=80",
      address: {
        line1: "Flat 801, Prestige Palms, Whitefield",
        city: "Bengaluru",
        state: "Karnataka",
        pincode: "560066"
      },
      emergencyContact: {
        name: "Suresh Nair",
        relationship: "Spouse",
        phone: "+91 98450 44332"
      },
      bankDetails: {
        bankName: "ICICI Bank",
        accountNumber: "000201589432",
        ifscCode: "ICIC0000002",
        branch: "Whitefield, Bengaluru"
      },
      statutoryDetails: {
        pan: "ABCPA5678B",
        uan: "100908070606",
        esiNumber: "31009876540002"
      },
      salary: {
        ctc: 3600000,
        basic: 135000,
        hra: 67500,
        da: 18000,
        specialAllowance: 62000,
        pfEmployee: 16200,
        esiEmployee: 0,
        professionalTax: 200,
        tds: 31000,
        netPay: 235100
      },
      skills: ["System Architecture", "React", "Node.js", "Engineering Management", "Cloud Infrastructure"],
      experienceYears: 12
    },
    {
      id: "NEX-003",
      firstName: "Rohan",
      lastName: "Verma",
      email: "employee@nexus.hr",
      phone: "+91 98765 43210",
      gender: "Male",
      dob: "1995-04-12",
      bloodGroup: "B+",
      maritalStatus: "Single",
      joiningDate: "2022-02-10",
      department: "Engineering",
      designation: "Senior Frontend Engineer",
      employmentType: "Full-Time",
      employmentStatus: "Active",
      reportingManager: "Priya Nair",
      workLocation: "Bengaluru HQ",
      avatar: "https://images.unsplash.com/photo-1507003211169-0a1dd7228f2d?auto=format&fit=crop&w=200&h=200&q=80",
      address: {
        line1: "Apt 204, Salarpuria Symphony, Electronic City",
        city: "Bengaluru",
        state: "Karnataka",
        pincode: "560100"
      },
      emergencyContact: {
        name: "Rajesh Verma",
        relationship: "Father",
        phone: "+91 98765 11223"
      },
      bankDetails: {
        bankName: "State Bank of India",
        accountNumber: "30554422119",
        ifscCode: "SBIN0004567",
        branch: "Electronic City, Bengaluru"
      },
      statutoryDetails: {
        pan: "ABCPS9012C",
        uan: "100908070607",
        esiNumber: "31009876540003"
      },
      salary: {
        ctc: 1800000,
        basic: 70000,
        hra: 35000,
        da: 8000,
        specialAllowance: 27000,
        pfEmployee: 8400,
        esiEmployee: 0,
        professionalTax: 200,
        tds: 9500,
        netPay: 121900
      },
      skills: ["React", "TypeScript", "Tailwind CSS", "Redux", "UI/UX Architecture"],
      experienceYears: 6
    },
    {
      id: "NEX-004",
      firstName: "Ananya",
      lastName: "Deshmukh",
      email: "ananya.d@nexus.hr",
      phone: "+91 98220 54321",
      gender: "Female",
      dob: "1994-08-25",
      bloodGroup: "AB+",
      maritalStatus: "Married",
      joiningDate: "2022-05-18",
      department: "Product & Design",
      designation: "Lead UI/UX Designer",
      employmentType: "Full-Time",
      employmentStatus: "Active",
      reportingManager: "Priya Nair",
      workLocation: "Bengaluru HQ",
      avatar: "https://images.unsplash.com/photo-1544005313-94ddf0286df2?auto=format&fit=crop&w=200&h=200&q=80",
      address: {
        line1: "15, 4th Cross, Indiranagar",
        city: "Bengaluru",
        state: "Karnataka",
        pincode: "560038"
      },
      emergencyContact: {
        name: "Vikram Deshmukh",
        relationship: "Spouse",
        phone: "+91 98220 99881"
      },
      bankDetails: {
        bankName: "HDFC Bank",
        accountNumber: "50100778899011",
        ifscCode: "HDFC0000567",
        branch: "Indiranagar, Bengaluru"
      },
      statutoryDetails: {
        pan: "ABCDD3456D",
        uan: "100908070608",
        esiNumber: "31009876540004"
      },
      salary: {
        ctc: 2000000,
        basic: 75000,
        hra: 37500,
        da: 9000,
        specialAllowance: 32500,
        pfEmployee: 9000,
        esiEmployee: 0,
        professionalTax: 200,
        tds: 11000,
        netPay: 133800
      },
      skills: ["Figma", "Design Systems", "User Research", "Interaction Design", "Prototyping"],
      experienceYears: 7
    },
    {
      id: "NEX-005",
      firstName: "Kavita",
      lastName: "Rao",
      email: "kavita.r@nexus.hr",
      phone: "+91 99001 87654",
      gender: "Female",
      dob: "1996-01-30",
      bloodGroup: "O+",
      maritalStatus: "Single",
      joiningDate: "2023-01-16",
      department: "Human Resources",
      designation: "HR Generalist & Talent Specialist",
      employmentType: "Full-Time",
      employmentStatus: "Active",
      reportingManager: "Aarav Sharma",
      workLocation: "Bengaluru HQ",
      avatar: "https://images.unsplash.com/photo-1580489944761-15a19d654956?auto=format&fit=crop&w=200&h=200&q=80",
      address: {
        line1: "88, Lakeview Enclave, HSR Layout Sector 2",
        city: "Bengaluru",
        state: "Karnataka",
        pincode: "560102"
      },
      emergencyContact: {
        name: "Shyam Rao",
        relationship: "Father",
        phone: "+91 99001 11234"
      },
      bankDetails: {
        bankName: "Axis Bank",
        accountNumber: "918020033445566",
        ifscCode: "UTIB0000888",
        branch: "HSR Layout, Bengaluru"
      },
      statutoryDetails: {
        pan: "ABCPR7890E",
        uan: "100908070609",
        esiNumber: "31009876540005"
      },
      salary: {
        ctc: 1200000,
        basic: 48000,
        hra: 24000,
        da: 5000,
        specialAllowance: 18000,
        pfEmployee: 5760,
        esiEmployee: 0,
        professionalTax: 200,
        tds: 4200,
        netPay: 85040
      },
      skills: ["Employee Relations", "Onboarding", "Payroll Coordination", "HR Operations", "POSH Policy"],
      experienceYears: 4
    },
    {
      id: "NEX-006",
      firstName: "Devendra",
      lastName: "Kulkarni",
      email: "devendra.k@nexus.hr",
      phone: "+91 97654 32198",
      gender: "Male",
      dob: "1992-09-14",
      bloodGroup: "B+",
      maritalStatus: "Married",
      joiningDate: "2022-09-01",
      department: "Finance & Accounts",
      designation: "Finance Manager & Compliance Lead",
      employmentType: "Full-Time",
      employmentStatus: "Active",
      reportingManager: "Aarav Sharma",
      workLocation: "Mumbai Office",
      avatar: "https://images.unsplash.com/photo-1500648767791-00dcc994a43e?auto=format&fit=crop&w=200&h=200&q=80",
      address: {
        line1: "B-303, Sea Breeze Towers, Bandra West",
        city: "Mumbai",
        state: "Maharashtra",
        pincode: "400050"
      },
      emergencyContact: {
        name: "Madhuri Kulkarni",
        relationship: "Spouse",
        phone: "+91 97654 00998"
      },
      bankDetails: {
        bankName: "Kotak Mahindra Bank",
        accountNumber: "451122334455",
        ifscCode: "KKBK0000678",
        branch: "Bandra, Mumbai"
      },
      statutoryDetails: {
        pan: "ABCPK2345F",
        uan: "100908070610",
        esiNumber: "31009876540006"
      },
      salary: {
        ctc: 2400000,
        basic: 90000,
        hra: 45000,
        da: 12000,
        specialAllowance: 43000,
        pfEmployee: 10800,
        esiEmployee: 0,
        professionalTax: 200,
        tds: 16500,
        netPay: 162500
      },
      skills: ["Financial Planning", "TDS & GST", "Statutory Audits", "Payroll Tax", "Tally ERP"],
      experienceYears: 9
    },
    {
      id: "NEX-007",
      firstName: "Sneha",
      lastName: "Mukherjee",
      email: "sneha.m@nexus.hr",
      phone: "+91 98300 12345",
      gender: "Female",
      dob: "1997-03-05",
      bloodGroup: "A-",
      maritalStatus: "Single",
      joiningDate: "2023-07-01",
      department: "Marketing & Growth",
      designation: "Content & Communications Specialist",
      employmentType: "Full-Time",
      employmentStatus: "Active",
      reportingManager: "Aarav Sharma",
      workLocation: "Remote (Kolkata)",
      avatar: "https://images.unsplash.com/photo-1494790108377-be9c29b29330?auto=format&fit=crop&w=200&h=200&q=80",
      address: {
        line1: "12/A, Salt Lake Sector 1",
        city: "Kolkata",
        state: "West Bengal",
        pincode: "700064"
      },
      emergencyContact: {
        name: "Debashis Mukherjee",
        relationship: "Father",
        phone: "+91 98300 55443"
      },
      bankDetails: {
        bankName: "HDFC Bank",
        accountNumber: "50100998811223",
        ifscCode: "HDFC0000128",
        branch: "Salt Lake, Kolkata"
      },
      statutoryDetails: {
        pan: "ABCPM6789G",
        uan: "100908070611",
        esiNumber: "31009876540007"
      },
      salary: {
        ctc: 1000000,
        basic: 40000,
        hra: 20000,
        da: 4000,
        specialAllowance: 16000,
        pfEmployee: 4800,
        esiEmployee: 0,
        professionalTax: 200,
        tds: 2500,
        netPay: 72500
      },
      skills: ["Content Strategy", "SEO", "Copywriting", "Social Media", "Public Relations"],
      experienceYears: 3
    },
    {
      id: "NEX-008",
      firstName: "Karthik",
      lastName: "Subramanian",
      email: "karthik.s@nexus.hr",
      phone: "+91 94440 67891",
      gender: "Male",
      dob: "1993-12-18",
      bloodGroup: "O+",
      maritalStatus: "Married",
      joiningDate: "2023-10-15",
      department: "Engineering",
      designation: "DevOps & Cloud Architect",
      employmentType: "Full-Time",
      employmentStatus: "Active",
      reportingManager: "Priya Nair",
      workLocation: "Bengaluru HQ",
      avatar: "https://images.unsplash.com/photo-1519085360753-af0119f7cbe7?auto=format&fit=crop&w=200&h=200&q=80",
      address: {
        line1: "302, Green Meadows, Marathahalli",
        city: "Bengaluru",
        state: "Karnataka",
        pincode: "560037"
      },
      emergencyContact: {
        name: "Deepa Subramanian",
        relationship: "Spouse",
        phone: "+91 94440 11229"
      },
      bankDetails: {
        bankName: "ICICI Bank",
        accountNumber: "000201998877",
        ifscCode: "ICIC0000002",
        branch: "Marathahalli, Bengaluru"
      },
      statutoryDetails: {
        pan: "ABCPS0123H",
        uan: "100908070612",
        esiNumber: "31009876540008"
      },
      salary: {
        ctc: 2200000,
        basic: 82000,
        hra: 41000,
        da: 10000,
        specialAllowance: 38000,
        pfEmployee: 9840,
        esiEmployee: 0,
        professionalTax: 200,
        tds: 13500,
        netPay: 147460
      },
      skills: ["AWS", "Docker", "Kubernetes", "CI/CD", "Terraform", "Monitoring"],
      experienceYears: 8
    }
  ],
  attendance: [
    { id: "att-1", employeeId: "NEX-001", date: "2026-10-10", punchIn: "08:55 AM", punchOut: "06:10 PM", totalHours: "9h 15m", status: "Present", mode: "Office", overtime: "0h 15m" },
    { id: "att-2", employeeId: "NEX-002", date: "2026-10-10", punchIn: "09:12 AM", punchOut: "06:25 PM", totalHours: "9h 13m", status: "Present", mode: "Office", overtime: "0h 13m" },
    { id: "att-3", employeeId: "NEX-003", date: "2026-10-10", punchIn: "09:30 AM", punchOut: null, totalHours: "Live (Punch-In Active)", status: "Present", mode: "Office", overtime: "0h 0m" },
    { id: "att-4", employeeId: "NEX-004", date: "2026-10-10", punchIn: "09:05 AM", punchOut: "06:00 PM", totalHours: "8h 55m", status: "Present", mode: "Office", overtime: "0h 0m" },
    { id: "att-5", employeeId: "NEX-005", date: "2026-10-10", punchIn: "09:00 AM", punchOut: "06:00 PM", totalHours: "9h 00m", status: "Present", mode: "Office", overtime: "0h 0m" },
    { id: "att-6", employeeId: "NEX-006", date: "2026-10-10", punchIn: "09:45 AM", punchOut: "06:30 PM", totalHours: "8h 45m", status: "Late", mode: "Office", overtime: "0h 0m" },
    { id: "att-7", employeeId: "NEX-007", date: "2026-10-10", punchIn: "09:00 AM", punchOut: "06:00 PM", totalHours: "9h 00m", status: "Present", mode: "WFH", overtime: "0h 0m" },
    { id: "att-8", employeeId: "NEX-008", date: "2026-10-10", punchIn: null, punchOut: null, totalHours: "0h 0m", status: "On Leave", mode: "Leave", overtime: "0h 0m" }
  ],
  leaves: [
    {
      id: "lv-1",
      employeeId: "NEX-008",
      employeeName: "Karthik Subramanian",
      leaveType: "Casual Leave",
      startDate: "2026-10-10",
      endDate: "2026-10-12",
      totalDays: 3,
      isHalfDay: false,
      reason: "Attending family wedding ceremony",
      status: "Approved",
      appliedOn: "2026-10-05",
      approvedBy: "Priya Nair",
      approvalNotes: "Approved. Handed on-call coverage to Rohan."
    },
    {
      id: "lv-2",
      employeeId: "NEX-003",
      employeeName: "Rohan Verma",
      leaveType: "Earned Leave",
      startDate: "2026-10-24",
      endDate: "2026-10-28",
      totalDays: 5,
      isHalfDay: false,
      reason: "Diwali festival family vacation to home town",
      status: "Pending",
      appliedOn: "2026-10-08",
      approvedBy: null,
      approvalNotes: null
    },
    {
      id: "lv-3",
      employeeId: "NEX-004",
      employeeName: "Ananya Deshmukh",
      leaveType: "Sick Leave",
      startDate: "2026-10-02",
      endDate: "2026-10-02",
      totalDays: 1,
      isHalfDay: false,
      reason: "Severe migraine and doctor consultation",
      status: "Approved",
      appliedOn: "2026-10-02",
      approvedBy: "Priya Nair",
      approvalNotes: "Get well soon."
    },
    {
      id: "lv-4",
      employeeId: "NEX-007",
      employeeName: "Sneha Mukherjee",
      leaveType: "Comp-Off",
      startDate: "2026-10-18",
      endDate: "2026-10-18",
      totalDays: 1,
      isHalfDay: false,
      reason: "Compensatory off for product launch weekend coverage",
      status: "Pending",
      appliedOn: "2026-10-09",
      approvedBy: null,
      approvalNotes: null
    }
  ],
  leaveBalances: {
    "NEX-001": { casual: 10, sick: 7, earned: 18, compOff: 2 },
    "NEX-002": { casual: 8, sick: 6, earned: 15, compOff: 1 },
    "NEX-003": { casual: 6, sick: 5, earned: 12, compOff: 2 },
    "NEX-004": { casual: 7, sick: 6, earned: 14, compOff: 0 },
    "NEX-005": { casual: 9, sick: 8, earned: 16, compOff: 1 },
    "NEX-006": { casual: 8, sick: 7, earned: 15, compOff: 3 },
    "NEX-007": { casual: 11, sick: 8, earned: 17, compOff: 1 },
    "NEX-008": { casual: 5, sick: 7, earned: 13, compOff: 0 }
  },
  holidays: [
    { id: "hol-1", name: "Dussehra / Vijayadashami", date: "2026-10-20", day: "Tuesday", type: "National Holiday" },
    { id: "hol-2", name: "Diwali / Deepavali", date: "2026-11-08", day: "Sunday", type: "Festival Holiday" },
    { id: "hol-3", name: "Kannada Rajyotsava", date: "2026-11-01", day: "Sunday", type: "State Holiday" },
    { id: "hol-4", name: "Christmas Day", date: "2026-12-25", day: "Friday", type: "National Holiday" },
    { id: "hol-5", name: "New Year's Day", date: "2027-01-01", day: "Friday", type: "Company Holiday" },
    { id: "hol-6", name: "Republic Day", date: "2027-01-26", day: "Tuesday", type: "National Holiday" }
  ],
  payrollRuns: [
    {
      id: "payrun-2026-09",
      month: "September 2026",
      processedDate: "2026-09-28",
      totalEmployees: 8,
      grossTotal: 968000,
      deductionsTotal: 174000,
      netTotal: 794000,
      status: "Disbursed",
      bankBatchId: "BATCH-HDFC-20260928-091"
    },
    {
      id: "payrun-2026-08",
      month: "August 2026",
      processedDate: "2026-08-28",
      totalEmployees: 8,
      grossTotal: 968000,
      deductionsTotal: 174000,
      netTotal: 794000,
      status: "Disbursed",
      bankBatchId: "BATCH-HDFC-20260828-082"
    }
  ],
  jobs: [
    {
      id: "job-101",
      title: "Senior Full-Stack Engineer (React & Node.js)",
      department: "Engineering",
      location: "Bengaluru HQ (Hybrid)",
      type: "Full-Time",
      experience: "5-8 Years",
      salaryRange: "₹20,00,000 - ₹30,00,000 PA",
      status: "Active",
      openings: 2,
      postedDate: "2026-09-15",
      description: "Looking for an experienced engineer to architect scalable enterprise SaaS features.",
      applicantsCount: 28
    },
    {
      id: "job-102",
      title: "Talent Acquisition Specialist",
      department: "Human Resources",
      location: "Bengaluru HQ",
      type: "Full-Time",
      experience: "3-5 Years",
      salaryRange: "₹9,00,000 - ₹14,00,000 PA",
      status: "Active",
      openings: 1,
      postedDate: "2026-10-01",
      description: "Spearhead technical hiring and campus recruitment for hyper-growth teams.",
      applicantsCount: 19
    },
    {
      id: "job-103",
      title: "Product Marketing Manager",
      department: "Marketing & Growth",
      location: "Remote",
      type: "Full-Time",
      experience: "4-7 Years",
      salaryRange: "₹16,00,000 - ₹24,00,000 PA",
      status: "Active",
      openings: 1,
      postedDate: "2026-09-22",
      description: "Drive GTM positioning, case studies, and enterprise product collateral.",
      applicantsCount: 14
    }
  ],
  candidates: [
    {
      id: "cand-1",
      jobId: "job-101",
      name: "Aditya Rao",
      email: "aditya.rao.dev@gmail.com",
      phone: "+91 99887 76655",
      experience: "6 Years",
      currentCompany: "Infosys Labs",
      currentCtc: "₹18,00,000",
      expectedCtc: "₹24,00,000",
      stage: "Technical Interview", // Applied, Screening, Technical Interview, HR Round, Offered, Hired
      rating: 4.5,
      notes: "Solid grasp of distributed systems, high concurrency React state management.",
      appliedDate: "2026-09-25",
      interviewScheduled: "2026-10-12 11:30 AM"
    },
    {
      id: "cand-2",
      jobId: "job-101",
      name: "Meera Krishnan",
      email: "meera.k.tech@gmail.com",
      phone: "+91 98451 22334",
      experience: "7.5 Years",
      currentCompany: "Swiggy",
      currentCtc: "₹22,00,000",
      expectedCtc: "₹28,00,000",
      stage: "Offered",
      rating: 4.8,
      notes: "Exceptional system design and problem solving. Offer letter dispatched.",
      appliedDate: "2026-09-18",
      offerCtc: "₹27,50,000 PA"
    },
    {
      id: "cand-3",
      jobId: "job-102",
      name: "Tanvi Saxena",
      email: "tanvi.saxena@outlook.com",
      phone: "+91 97112 34567",
      experience: "4 Years",
      currentCompany: "Razorpay",
      currentCtc: "₹11,00,000",
      expectedCtc: "₹14,50,000",
      stage: "HR Round",
      rating: 4.2,
      notes: "Great recruiter pipeline pedigree, very strong stakeholder management.",
      appliedDate: "2026-10-03"
    },
    {
      id: "cand-4",
      jobId: "job-103",
      name: "Arjun Nambiar",
      email: "arjun.nambiar@gmail.com",
      phone: "+91 98200 44556",
      experience: "5 Years",
      currentCompany: "Postman",
      currentCtc: "₹17,00,000",
      expectedCtc: "₹22,00,000",
      stage: "Screening",
      rating: 4.0,
      notes: "Strong portfolio in B2B SaaS product messaging.",
      appliedDate: "2026-10-06"
    }
  ],
  onboarding: [
    {
      id: "onb-1",
      employeeName: "Meera Krishnan",
      designation: "Lead Systems Architect",
      department: "Engineering",
      joiningDate: "2026-11-01",
      status: "Pre-boarding",
      progress: 65,
      checklist: [
        { task: "Signed Offer & Appointment Letter", done: true, date: "2026-10-02" },
        { task: "PAN & Aadhaar KYC Verification", done: true, date: "2026-10-04" },
        { task: "Bank Account & Cancelled Cheque Submission", done: true, date: "2026-10-05" },
        { task: "IT Hardware Allocation (MacBook Pro M3 Max)", done: false, date: null },
        { task: "Corporate Email & Slack Provisioning", done: false, date: null },
        { task: "Day 1 Buddy & Induction Session Scheduled", done: true, date: "2026-10-08" }
      ]
    }
  ],
  goals: [
    {
      id: "gol-1",
      employeeId: "NEX-003",
      employeeName: "Rohan Verma",
      title: "Deliver Enterprise HR Portal v2.0 Architecture",
      category: "Engineering & Innovation",
      targetDate: "2026-11-30",
      progress: 85,
      weightage: "40%",
      status: "On Track"
    },
    {
      id: "gol-2",
      employeeId: "NEX-003",
      employeeName: "Rohan Verma",
      title: "Achieve 95%+ Unit & Component Test Coverage",
      category: "Code Quality",
      targetDate: "2026-12-15",
      progress: 70,
      weightage: "30%",
      status: "On Track"
    },
    {
      id: "gol-3",
      employeeId: "NEX-003",
      employeeName: "Rohan Verma",
      title: "Mentor 2 Junior Engineers on React 19 Patterns",
      category: "Leadership & Mentorship",
      targetDate: "2026-12-31",
      progress: 90,
      weightage: "30%",
      status: "Completed"
    }
  ],
  reviews: [
    {
      id: "rev-1",
      cycle: "Annual Appraisal Cycle 2026",
      employeeId: "NEX-003",
      employeeName: "Rohan Verma",
      managerName: "Priya Nair",
      selfRating: 4.5,
      managerRating: 4.8,
      finalScore: 4.7,
      status: "Completed",
      feedback: "Exceptional ownership, outstanding UI design implementation and proactive technical problem solving.",
      promotionRecommendation: "Promoted to Staff Frontend Engineer",
      bonusMultiplier: "120%"
    }
  ],
  courses: [
    {
      id: "crs-1",
      title: "POSH & Prevention of Workplace Harassment (2026 Edition)",
      category: "Mandatory Compliance",
      duration: "1.5 Hours",
      lessons: 6,
      instructor: "Adv. Sunita Rao, Corporate Legal",
      enrolledCount: 8,
      completedCount: 7,
      status: "Active"
    },
    {
      id: "crs-2",
      title: "Information Security & ISO 27001 Data Privacy Guidelines",
      category: "IT & Security",
      duration: "2 Hours",
      lessons: 8,
      instructor: "Karthik Subramanian, Cloud Architect",
      enrolledCount: 8,
      completedCount: 6,
      status: "Active"
    },
    {
      id: "crs-3",
      title: "High-Performance Team Leadership & 360 Feedback",
      category: "Professional Growth",
      duration: "4 Hours",
      lessons: 12,
      instructor: "Aarav Sharma, VP HR",
      enrolledCount: 4,
      completedCount: 3,
      status: "Active"
    }
  ],
  expenses: [
    {
      id: "exp-1",
      employeeId: "NEX-003",
      employeeName: "Rohan Verma",
      category: "Client Meeting / Dinner",
      amount: 3450,
      date: "2026-10-04",
      description: "Business dinner with design team and prospective client representatives",
      receiptUrl: "receipt_oct04_dinner.pdf",
      status: "Approved",
      reimbursed: true,
      approvedBy: "Priya Nair"
    },
    {
      id: "exp-2",
      employeeId: "NEX-003",
      employeeName: "Rohan Verma",
      category: "Software Subscriptions",
      amount: 4800,
      date: "2026-10-08",
      description: "JetBrains WebStorm & Figma annual development plugins licence",
      receiptUrl: "jetbrains_invoice_oct.pdf",
      status: "Pending",
      reimbursed: false,
      approvedBy: null
    },
    {
      id: "exp-3",
      employeeId: "NEX-007",
      employeeName: "Sneha Mukherjee",
      category: "Travel & Transit",
      amount: 12500,
      date: "2026-10-01",
      description: "Flight tickets Kolkata to Bengaluru for quarterly all-hands offsite",
      receiptUrl: "air_india_flight_ticket.pdf",
      status: "Approved",
      reimbursed: true,
      approvedBy: "Aarav Sharma"
    }
  ],
  documents: [
    { id: "doc-1", title: "Employee Code of Conduct & Ethics 2026", category: "Company Policy", size: "2.4 MB", uploadDate: "2026-01-10", expiryDate: "None", access: "All Employees" },
    { id: "doc-2", title: "Comprehensive Leave & Holiday Policy", category: "Company Policy", size: "1.8 MB", uploadDate: "2026-01-10", expiryDate: "None", access: "All Employees" },
    { id: "doc-3", title: "Health Insurance & Mediclaim TPA Guide (Star Health)", category: "Benefits", size: "3.2 MB", uploadDate: "2026-04-01", expiryDate: "2027-03-31", access: "All Employees" },
    { id: "doc-4", title: "Form 16 Tax Certificate FY 2025-26", category: "Tax Documents", size: "850 KB", uploadDate: "2026-06-15", expiryDate: "None", access: "Confidential (NEX-003)" },
    { id: "doc-5", title: "Employment Agreement & IP Assignment", category: "Contracts", size: "1.2 MB", uploadDate: "2022-02-10", expiryDate: "None", access: "Confidential (NEX-003)" }
  ],
  tickets: [
    {
      id: "tkt-101",
      employeeId: "NEX-003",
      employeeName: "Rohan Verma",
      category: "Payroll & Tax",
      subject: "Query regarding TDS investment declaration proofs for Section 80C",
      priority: "Medium",
      status: "In Progress",
      createdAt: "2026-10-06 10:15 AM",
      messages: [
        { sender: "Rohan Verma", role: "employee", text: "Hi HR team, when is the portal window opening for uploading mutual fund ELSS statements for tax rebate?", timestamp: "2026-10-06 10:15 AM" },
        { sender: "Kavita Rao", role: "admin", text: "Hello Rohan! The statutory IT proof verification window opens on November 15th. We will broadcast a portal announcement with step-by-step instructions.", timestamp: "2026-10-06 02:40 PM" }
      ]
    },
    {
      id: "tkt-102",
      employeeId: "NEX-004",
      employeeName: "Ananya Deshmukh",
      category: "IT Equipment",
      subject: "Request for 4K external monitor for UI/UX color fidelity",
      priority: "High",
      status: "Resolved",
      createdAt: "2026-09-28 11:00 AM",
      messages: [
        { sender: "Ananya Deshmukh", role: "employee", text: "Hi team, requesting a Dell UltraSharp 27-inch 4K monitor for UI color calibration.", timestamp: "2026-09-28 11:00 AM" },
        { sender: "Aarav Sharma", role: "admin", text: "Approved by Engineering & HR. IT team has dispatched Dell U2723QE monitor. Tracking ID: BLR-IT-892.", timestamp: "2026-09-29 03:15 PM" }
      ]
    }
  ],
  announcements: [
    {
      id: "anc-1",
      title: "Diwali 2026 Grand Celebration & Annual Team Gathering",
      category: "Company Event",
      content: "Join us for our annual festive gala on Friday, November 6th at The Grand Ballroom. Traditional attire encouraged! Cultural performances, dinner buffet, and employee appreciation awards await.",
      pinned: true,
      date: "2026-10-08",
      author: "Aarav Sharma (VP HR)"
    },
    {
      id: "anc-2",
      title: "Updated Hybrid Work Policy & Flexible Core Hours",
      category: "Policy Update",
      content: "We have updated our core collaboration hours to 10:30 AM - 4:30 PM IST with 2 days remote flexibility per week. Review the full policy in the Document Repository.",
      pinned: false,
      date: "2026-10-01",
      author: "Executive Leadership"
    },
    {
      id: "anc-3",
      title: "Warm Welcome to our New Joiners this October!",
      category: "HR Updates",
      content: "Please extend a warm welcome to our newest team members joining Engineering and Marketing this month! Check out their profiles in the directory.",
      pinned: false,
      date: "2026-10-02",
      author: "Talent Acquisition Team"
    }
  ],
  kudos: [
    { id: "kd-1", from: "Priya Nair", to: "Rohan Verma", badge: "Rockstar Coder 🚀", message: "Amazing job rebuilding our frontend architecture with ultra-smooth responsiveness!", date: "2026-10-09" },
    { id: "kd-2", from: "Rohan Verma", to: "Ananya Deshmukh", badge: "Design Wizard 🎨", message: "Incredible UX wireframes and component design system for the HR portal!", date: "2026-10-08" },
    { id: "kd-3", from: "Aarav Sharma", to: "Kavita Rao", badge: "Culture Champion 🌟", message: "Effortless coordination of employee onboarding and seamless operations!", date: "2026-10-07" }
  ],
  polls: [
    {
      id: "pol-1",
      question: "Which team activity should we host for our upcoming Q4 Offsite?",
      totalVotes: 34,
      options: [
        { text: "Outdoor Adventure Trek & Camping", votes: 14 },
        { text: "Beach Resort Retreat & Watersports", votes: 16 },
        { text: "Hackathon & Gaming Championship", votes: 4 }
      ]
    }
  ],
  suggestions: [
    { id: "sug-1", text: "Can we install a cold-brew coffee machine in the 7th floor cafeteria?", upvotes: 18, anonymous: true, status: "Under Review" },
    { id: "sug-2", text: "Consider introducing a monthly learning stipend for technical books and courses.", upvotes: 27, anonymous: false, author: "Sneha Mukherjee", status: "Approved" }
  ],
  offboarding: [
    {
      id: "off-1",
      employeeId: "NEX-009",
      employeeName: "Vivek Joshi",
      department: "Engineering",
      designation: "Backend Engineer",
      resignationDate: "2026-09-15",
      lastWorkingDay: "2026-11-15",
      noticePeriodDays: 60,
      status: "Notice Period Active",
      reason: "Pursuing higher studies / MS in Computer Science abroad",
      clearance: {
        itAssetReturn: "Pending (Scheduled for 2026-11-14)",
        financeClearance: "Completed (No pending advances)",
        hrHandover: "In Progress (Handing over microservices to Karthik)",
        adminBadgeReturn: "Pending"
      },
      finalSettlement: {
        pendingSalary: 110000,
        leaveEncashment: 38500,
        gratuity: 45000,
        deductions: 0,
        netPayable: 193500
      }
    }
  ],
  departments: [
    { id: "dept-1", name: "Engineering", head: "Priya Nair", count: 28, budget: "₹4.5 Cr", location: "Bengaluru HQ" },
    { id: "dept-2", name: "Human Resources", head: "Aarav Sharma", count: 6, budget: "₹85 L", location: "Bengaluru HQ" },
    { id: "dept-3", name: "Product & Design", head: "Ananya Deshmukh", count: 8, budget: "₹1.2 Cr", location: "Bengaluru HQ" },
    { id: "dept-4", name: "Finance & Accounts", head: "Devendra Kulkarni", count: 5, budget: "₹75 L", location: "Mumbai Office" },
    { id: "dept-5", name: "Marketing & Growth", head: "Aarav Sharma", count: 7, budget: "₹1.1 Cr", location: "Remote / Multiple" },
    { id: "dept-6", name: "Operations & IT Support", head: "Karthik Subramanian", count: 6, budget: "₹65 L", location: "Bengaluru HQ" }
  ],
  locations: [
    { id: "loc-1", name: "Bengaluru HQ", address: "Outer Ring Road, Bellandur, Bengaluru", employeesCount: 45, isHeadquarters: true },
    { id: "loc-2", name: "Mumbai Branch", address: "Bandra Kurla Complex (BKC), Mumbai", employeesCount: 12, isHeadquarters: false },
    { id: "loc-3", name: "Hyderabad Tech Hub", address: "HITEC City, Madhapur, Hyderabad", employeesCount: 18, isHeadquarters: false },
    { id: "loc-4", name: "Remote Workforce", address: "Pan-India Distributed Locations", employeesCount: 15, isHeadquarters: false }
  ],
  integrations: [
    { id: "int-1", name: "Biometric Attendance Device (eSSL / ZKTeco)", category: "Hardware & IoT", status: "Connected", lastSync: "2 mins ago", icon: "Fingerprint" },
    { id: "int-2", name: "Slack & Microsoft Teams Notifications", category: "Collaboration", status: "Connected", lastSync: "Real-time", icon: "MessageSquare" },
    { id: "int-3", name: "Corporate Net Banking (HDFC & ICICI Bank Payouts)", category: "Banking & Payroll", status: "Connected", lastSync: "Today, 10:00 AM", icon: "Landmark" },
    { id: "int-4", name: "TallyPrime & ERP Accounting Sync", category: "Accounting", status: "Connected", lastSync: "Yesterday, 06:00 PM", icon: "FileSpreadsheet" },
    { id: "int-5", name: "Google Workspace & Outlook Calendar", category: "Calendar", status: "Connected", lastSync: "Live webhook", icon: "Calendar" },
    { id: "int-6", name: "LinkedIn & Indeed ATS Job Distribution", category: "Recruitment", status: "Connected", lastSync: "1 hour ago", icon: "Share2" }
  ],
  auditLogs: [
    { id: "log-1", timestamp: "2026-10-10 18:45:20", user: "Aarav Sharma (Admin)", action: "Generated Monthly Payroll Run for September 2026", ip: "192.168.1.104", module: "Payroll" },
    { id: "log-2", timestamp: "2026-10-10 16:30:11", user: "Priya Nair (Manager)", action: "Approved Leave Request for Karthik Subramanian", ip: "192.168.1.112", module: "Leave Management" },
    { id: "log-3", timestamp: "2026-10-10 14:15:00", user: "Aarav Sharma (Admin)", action: "Posted New Job Opening: Talent Acquisition Specialist", ip: "192.168.1.104", module: "Recruitment" },
    { id: "log-4", timestamp: "2026-10-10 09:30:15", user: "Rohan Verma (Employee)", action: "Clocked In via Web Portal (Office Mode)", ip: "192.168.1.145", module: "Attendance" },
    { id: "log-5", timestamp: "2026-10-10 09:00:00", user: "System Scheduler", action: "Automated Biometric Device Log Synchronization", ip: "127.0.0.1", module: "Integrations" }
  ],
  notifications: [
    { id: "notif-1", title: "Leave Request Approved", message: "Your Casual Leave for Oct 10-12 has been approved by Priya Nair.", time: "2 hours ago", unread: true, type: "leave" },
    { id: "notif-2", title: "September Payslip Available", message: "Your payslip for September 2026 has been generated and is ready to download.", time: "1 day ago", unread: true, type: "payroll" },
    { id: "notif-3", title: "Upcoming Birthday 🎉", message: "Karthik Subramanian's birthday is coming up on December 18th!", time: "2 days ago", unread: false, type: "social" },
    { id: "notif-4", title: "New Policy Announcement", message: "Review the updated Hybrid Work Guidelines in the Document Repository.", time: "3 days ago", unread: false, type: "policy" }
  ]
};

// Database helper functions with automatic persistence
function loadData() {
  try {
    if (!fs.existsSync(DB_FILE)) {
      fs.writeFileSync(DB_FILE, JSON.stringify(initialData, null, 2), 'utf-8');
      return JSON.parse(JSON.stringify(initialData));
    }
    const raw = fs.readFileSync(DB_FILE, 'utf-8');
    return JSON.parse(raw);
  } catch (err) {
    console.error("Error loading database file, falling back to initial data:", err);
    return JSON.parse(JSON.stringify(initialData));
  }
}

function saveData(data) {
  try {
    fs.writeFileSync(DB_FILE, JSON.stringify(data, null, 2), 'utf-8');
    return true;
  } catch (err) {
    console.error("Error saving database file:", err);
    return false;
  }
}

module.exports = {
  loadData,
  saveData,
  initialData
};
