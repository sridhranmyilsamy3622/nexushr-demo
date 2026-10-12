import React, { useState } from 'react';
import { 
  ShieldCheck, Users, Clock, Calendar, CreditCard, UserCheck, 
  Award, BookOpen, Receipt, FileText, LifeBuoy, Bell, BarChart3, 
  Building2, CheckCircle2, ArrowRight, Star, ChevronDown, ChevronUp,
  Sparkles, Phone, Mail, MapPin, Send, HelpCircle, Laptop, Smartphone
} from 'lucide-react';
import { useAuth } from '../../context/AuthContext';

export default function LandingPage() {
  const { setViewMode, switchRole } = useAuth();
  const [billingCycle, setBillingCycle] = useState('monthly'); // 'monthly' | 'annual'
  const [openFaq, setOpenFaq] = useState(0);
  const [showDemoModal, setShowDemoModal] = useState(false);
  const [demoForm, setDemoForm] = useState({ name: '', email: '', company: '', employees: '50-200', phone: '' });
  const [demoSuccess, setDemoSuccess] = useState(false);
  const [contactForm, setContactForm] = useState({ name: '', email: '', message: '' });
  const [contactSuccess, setContactSuccess] = useState(false);

  const [isMobileNavOpen, setIsMobileNavOpen] = useState(false);
  const [showMobileModal, setShowMobileModal] = useState(false);
  const [copied, setCopied] = useState(false);

  const mobileUrl = `${window.location.protocol}//${window.location.hostname || '172.17.132.178'}:${window.location.port || '5173'}`;

  const copyMobileLink = () => {
    navigator.clipboard.writeText(mobileUrl);
    setCopied(true);
    setTimeout(() => setCopied(false), 2000);
  };

  const handleDemoSubmit = (e) => {
    e.preventDefault();
    setDemoSuccess(true);
    setTimeout(() => {
      setDemoSuccess(false);
      setShowDemoModal(false);
    }, 2000);
  };

  const handleContactSubmit = (e) => {
    e.preventDefault();
    setContactSuccess(true);
    setTimeout(() => {
      setContactSuccess(false);
      setContactForm({ name: '', email: '', message: '' });
    }, 2500);
  };

  const faqs = [
    {
      q: "Does NexusHR support Indian statutory payroll compliances like PF, ESI, PT, and TDS?",
      a: "Yes! NexusHR natively automates Indian compliance calculations including Employee and Employer Provident Fund (12%), ESI (0.75% / 3.25%), state-specific Professional Tax (PT), TDS slabs, and generates Form 16 and bank NEFT/RTGS transfer sheets."
    },
    {
      q: "Can NexusHR integrate with existing biometric attendance hardware?",
      a: "Absolutely. NexusHR includes an open IoT integration gateway compatible with eSSL, ZKTeco, Matrix, and facial recognition biometric readers via real-time push protocols and scheduled sync."
    },
    {
      q: "How does Employee Self-Service (ESS) work?",
      a: "Every employee gets their dedicated portal to punch attendance with geofencing, check leave balances, apply for leaves, download payslips, submit reimbursement expenses with bills, and raise HR tickets."
    },
    {
      q: "Can I manage multi-branch or remote teams across India?",
      a: "Yes. You can configure multiple company entities, physical offices (Bengaluru, Mumbai, Delhi, etc.), and fully remote teams with geo-tagged check-ins and department-specific shift policies."
    },
    {
      q: "Is employee and payroll financial data secure?",
      a: "NexusHR enforces role-based access control (RBAC), AES-256 bank-grade encryption at rest and in transit, 2-Factor Authentication (2FA), and comprehensive tamper-proof audit trails."
    },
    {
      q: "Can candidates be converted directly into onboarded employees?",
      a: "Yes, our integrated Applicant Tracking System (ATS) features a one-click transition: shortlisted candidates automatically flow into the New Joiner Onboarding pipeline with digital checklists."
    }
  ];

  return (
    <div className="min-h-screen bg-slate-900 text-slate-100 flex flex-col font-sans">
      {/* Top Mobile Network Banner */}
      <div className="bg-brand-950/90 border-b border-brand-800/60 px-4 py-2 text-center text-xs text-brand-300 flex items-center justify-center space-x-2">
        <Smartphone className="w-3.5 h-3.5 text-brand-400" />
        <span>Mobile Link: <strong className="font-mono text-white">{mobileUrl}</strong></span>
        <button 
          onClick={copyMobileLink}
          className="ml-2 px-2 py-0.5 rounded bg-brand-800 hover:bg-brand-700 text-white font-semibold text-[10px] transition"
        >
          {copied ? 'Copied ✓' : 'Copy'}
        </button>
        <button 
          onClick={() => setShowMobileModal(true)}
          className="px-2 py-0.5 rounded bg-slate-800 hover:bg-slate-700 text-brand-300 font-semibold text-[10px] transition"
        >
          Scan QR
        </button>
      </div>

      {/* Navigation Bar */}
      <header className="sticky top-0 z-50 bg-slate-900/90 backdrop-blur-md border-b border-slate-800">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 h-20 flex items-center justify-between">
          <div className="flex items-center space-x-3">
            <div className="w-10 h-10 rounded-xl bg-gradient-to-tr from-brand-600 to-indigo-400 flex items-center justify-center text-white shadow-lg shadow-brand-500/30">
              <Users className="w-6 h-6" />
            </div>
            <div>
              <span className="text-2xl font-bold tracking-tight text-white font-display">Nexus<span className="text-brand-400">HR</span></span>
              <span className="text-xs block text-slate-400 -mt-1 font-medium">Enterprise Suite</span>
            </div>
          </div>

          <nav className="hidden md:flex items-center space-x-8 text-sm font-medium text-slate-300">
            <a href="#about" className="hover:text-white transition">About</a>
            <a href="#features" className="hover:text-white transition">Features</a>
            <a href="#why-us" className="hover:text-white transition">Why Choose Us</a>
            <a href="#benefits" className="hover:text-white transition">Benefits</a>
            <a href="#pricing" className="hover:text-white transition">Pricing</a>
            <a href="#faq" className="hover:text-white transition">FAQ</a>
            <a href="#contact" className="hover:text-white transition">Contact</a>
          </nav>

          <div className="flex items-center space-x-2 sm:space-x-3">
            <button
              onClick={() => setShowDemoModal(true)}
              className="hidden sm:inline-flex px-4 py-2 rounded-lg text-sm font-medium text-slate-300 hover:text-white hover:bg-slate-800 border border-slate-700 transition"
            >
              Request a Demo
            </button>
            <button
              onClick={() => { setViewMode('portal'); switchRole('admin'); }}
              className="inline-flex items-center space-x-1.5 sm:space-x-2 px-3.5 sm:px-5 py-2.5 rounded-lg text-xs sm:text-sm font-semibold text-white bg-brand-600 hover:bg-brand-500 shadow-md shadow-brand-600/30 transition transform hover:-translate-y-0.5"
            >
              <span>Login to Portal</span>
              <ArrowRight className="w-4 h-4" />
            </button>
            <button
              onClick={() => setIsMobileNavOpen(!isMobileNavOpen)}
              className="md:hidden p-2 rounded-lg text-slate-400 hover:text-white hover:bg-slate-800 transition"
              aria-label="Toggle mobile menu"
            >
              {isMobileNavOpen ? '✕' : '☰'}
            </button>
          </div>
        </div>

        {/* Mobile Navigation Dropdown Menu */}
        {isMobileNavOpen && (
          <div className="md:hidden bg-slate-900 border-b border-slate-800 px-4 py-4 space-y-3 text-sm">
            <div className="grid grid-cols-2 gap-2 text-xs font-semibold text-slate-300">
              <a href="#about" onClick={() => setIsMobileNavOpen(false)} className="p-2 rounded-lg bg-slate-800/80 hover:bg-slate-800">About</a>
              <a href="#features" onClick={() => setIsMobileNavOpen(false)} className="p-2 rounded-lg bg-slate-800/80 hover:bg-slate-800">Features</a>
              <a href="#why-us" onClick={() => setIsMobileNavOpen(false)} className="p-2 rounded-lg bg-slate-800/80 hover:bg-slate-800">Why Choose Us</a>
              <a href="#benefits" onClick={() => setIsMobileNavOpen(false)} className="p-2 rounded-lg bg-slate-800/80 hover:bg-slate-800">Benefits</a>
              <a href="#pricing" onClick={() => setIsMobileNavOpen(false)} className="p-2 rounded-lg bg-slate-800/80 hover:bg-slate-800">Pricing</a>
              <a href="#faq" onClick={() => setIsMobileNavOpen(false)} className="p-2 rounded-lg bg-slate-800/80 hover:bg-slate-800">FAQ</a>
            </div>

            <div className="pt-2 border-t border-slate-800 flex flex-col space-y-2">
              <button
                onClick={() => { setShowDemoModal(true); setIsMobileNavOpen(false); }}
                className="w-full py-2 rounded-lg text-xs font-semibold bg-slate-800 text-slate-200 border border-slate-700"
              >
                Request a Demo
              </button>
              <button
                onClick={() => { setShowMobileModal(true); setIsMobileNavOpen(false); }}
                className="w-full py-2 rounded-lg text-xs font-semibold bg-brand-900/60 text-brand-300 border border-brand-700/60 flex items-center justify-center space-x-1"
              >
                <Smartphone className="w-3.5 h-3.5" />
                <span>Mobile Link & QR Code</span>
              </button>
            </div>
          </div>
        )}
      </header>

      {/* Hero Section */}
      <section className="relative overflow-hidden pt-20 pb-28 lg:pt-28 lg:pb-36">
        <div className="absolute inset-0 bg-[radial-gradient(ellipse_80%_80%_at_50%_-20%,rgba(99,102,241,0.25),rgba(255,255,255,0))]"></div>
        <div className="relative max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 text-center">
          <div className="inline-flex items-center space-x-2 px-4 py-1.5 rounded-full bg-brand-950/80 border border-brand-800/60 text-brand-300 text-xs font-semibold uppercase tracking-wider mb-8">
            <Sparkles className="w-3.5 h-3.5" />
            <span>Next-Generation HR Tech 2026</span>
          </div>

          <h1 className="text-4xl sm:text-6xl lg:text-7xl font-extrabold tracking-tight text-white font-display max-w-5xl mx-auto leading-tight">
            The Complete All-In-One <br/>
            <span className="bg-gradient-to-r from-brand-400 via-indigo-300 to-sky-400 bg-clip-text text-transparent">
              Enterprise Human Resource Platform
            </span>
          </h1>

          <p className="mt-6 text-lg sm:text-xl text-slate-300 max-w-3xl mx-auto font-normal leading-relaxed">
            From smart biometric attendance and automated India-compliant payroll (PF, ESI, TDS) to full-lifecycle recruitment, 360° reviews, LMS, and employee self-service. Built for high-growth modern teams.
          </p>

          <div className="mt-10 flex flex-wrap justify-center gap-4">
            <button
              onClick={() => { setViewMode('portal'); switchRole('admin'); }}
              className="px-8 py-3.5 rounded-xl font-bold text-white bg-brand-600 hover:bg-brand-500 shadow-xl shadow-brand-600/40 transition transform hover:-translate-y-0.5 flex items-center space-x-2 text-base"
            >
              <span>Open Live HR Portal</span>
              <ArrowRight className="w-5 h-5" />
            </button>
            <button
              onClick={() => setShowDemoModal(true)}
              className="px-8 py-3.5 rounded-xl font-semibold text-slate-200 bg-slate-800/90 hover:bg-slate-700 border border-slate-700 transition text-base"
            >
              Schedule 1-on-1 Demo
            </button>
          </div>

          {/* Quick Persona Switcher in Hero */}
          <div className="mt-12 p-4 bg-slate-800/70 border border-slate-700/60 rounded-2xl max-w-2xl mx-auto flex flex-wrap items-center justify-between gap-3 text-xs text-slate-300">
            <span className="font-semibold text-slate-200 flex items-center gap-1.5">
              <UserCheck className="w-4 h-4 text-brand-400" />
              Quick Persona Previews:
            </span>
            <div className="flex gap-2">
              <button 
                onClick={() => { setViewMode('portal'); switchRole('admin'); }} 
                className="px-3 py-1.5 rounded-lg bg-indigo-600/30 hover:bg-indigo-600 text-indigo-200 hover:text-white border border-indigo-500/40 transition font-medium"
              >
                HR Admin View
              </button>
              <button 
                onClick={() => { setViewMode('portal'); switchRole('manager'); }} 
                className="px-3 py-1.5 rounded-lg bg-emerald-600/30 hover:bg-emerald-600 text-emerald-200 hover:text-white border border-emerald-500/40 transition font-medium"
              >
                Dept Manager View
              </button>
              <button 
                onClick={() => { setViewMode('portal'); switchRole('employee'); }} 
                className="px-3 py-1.5 rounded-lg bg-amber-600/30 hover:bg-amber-600 text-amber-200 hover:text-white border border-amber-500/40 transition font-medium"
              >
                Employee ESS View
              </button>
            </div>
          </div>

          {/* Metrics bar */}
          <div className="mt-16 grid grid-cols-2 md:grid-cols-4 gap-6 max-w-4xl mx-auto border-t border-slate-800 pt-10">
            <div>
              <p className="text-3xl font-extrabold text-white">99.98%</p>
              <p className="text-xs text-slate-400 mt-1 uppercase tracking-wider">Payroll Accuracy</p>
            </div>
            <div>
              <p className="text-3xl font-extrabold text-brand-400">100%</p>
              <p className="text-xs text-slate-400 mt-1 uppercase tracking-wider">Statutory Compliance</p>
            </div>
            <div>
              <p className="text-3xl font-extrabold text-white">85%</p>
              <p className="text-xs text-slate-400 mt-1 uppercase tracking-wider">Time Saved on Leaves</p>
            </div>
            <div>
              <p className="text-3xl font-extrabold text-emerald-400">4.9 / 5</p>
              <p className="text-xs text-slate-400 mt-1 uppercase tracking-wider">Employee Satisfaction</p>
            </div>
          </div>
        </div>
      </section>

      {/* About Section */}
      <section id="about" className="py-20 bg-slate-900 border-t border-slate-800">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="grid grid-cols-1 lg:grid-cols-2 gap-12 items-center">
            <div>
              <span className="text-xs font-bold uppercase tracking-wider text-brand-400">About the HR Portal</span>
              <h2 className="text-3xl sm:text-4xl font-extrabold text-white font-display mt-2">
                Built from the ground up for modern enterprise agility
              </h2>
              <p className="mt-4 text-slate-300 leading-relaxed">
                NexusHR replaces fragmented legacy HR spreadsheets, disparate payroll apps, and chaotic emails with a unified, high-octane workspace. Designed specifically to accommodate complex workforce dynamics, statutory labor laws, and modern hybrid employee expectations.
              </p>
              <div className="mt-6 space-y-3">
                <div className="flex items-start space-x-3">
                  <CheckCircle2 className="w-5 h-5 text-emerald-400 shrink-0 mt-0.5" />
                  <p className="text-sm text-slate-200"><strong className="text-white">Unified System of Record:</strong> Single source of truth for all employee data, compensation, contracts, and lifecycle events.</p>
                </div>
                <div className="flex items-start space-x-3">
                  <CheckCircle2 className="w-5 h-5 text-emerald-400 shrink-0 mt-0.5" />
                  <p className="text-sm text-slate-200"><strong className="text-white">Zero Error Payroll Engine:</strong> Automated calculations for Basic, HRA, DA, PF, ESI, Professional Tax, and Income Tax TDS.</p>
                </div>
                <div className="flex items-start space-x-3">
                  <CheckCircle2 className="w-5 h-5 text-emerald-400 shrink-0 mt-0.5" />
                  <p className="text-sm text-slate-200"><strong className="text-white">Self-Service First:</strong> Transparent mobile-friendly portals empowering employees while slashing 70% of HR repetitive tickets.</p>
                </div>
              </div>
            </div>

            <div className="bg-slate-800/80 p-8 rounded-3xl border border-slate-700 shadow-2xl relative">
              <div className="absolute -top-3 -right-3 px-3 py-1 bg-brand-600 text-white rounded-full text-xs font-semibold">
                Enterprise Ready
              </div>
              <h3 className="text-xl font-bold text-white mb-6">Core Architectural Pillars</h3>
              <div className="grid grid-cols-2 gap-4">
                <div className="p-4 bg-slate-900/60 rounded-xl border border-slate-700/60">
                  <ShieldCheck className="w-7 h-7 text-brand-400 mb-2" />
                  <h4 className="font-semibold text-white text-sm">Security & Privacy</h4>
                  <p className="text-xs text-slate-400 mt-1">DPDP & ISO 27001 compliant with role-based governance.</p>
                </div>
                <div className="p-4 bg-slate-900/60 rounded-xl border border-slate-700/60">
                  <Smartphone className="w-7 h-7 text-emerald-400 mb-2" />
                  <h4 className="font-semibold text-white text-sm">Responsive Everywhere</h4>
                  <p className="text-xs text-slate-400 mt-1">Seamless experience on phones, tablets, and desktops.</p>
                </div>
                <div className="p-4 bg-slate-900/60 rounded-xl border border-slate-700/60">
                  <Clock className="w-7 h-7 text-amber-400 mb-2" />
                  <h4 className="font-semibold text-white text-sm">Real-time Biometrics</h4>
                  <p className="text-xs text-slate-400 mt-1">Automatic sync with IoT hardware and facial check-in.</p>
                </div>
                <div className="p-4 bg-slate-900/60 rounded-xl border border-slate-700/60">
                  <BarChart3 className="w-7 h-7 text-purple-400 mb-2" />
                  <h4 className="font-semibold text-white text-sm">Executive Analytics</h4>
                  <p className="text-xs text-slate-400 mt-1">Headcount trends, diversity, and department expense metrics.</p>
                </div>
              </div>
            </div>
          </div>
        </div>
      </section>

      {/* Complete Features Section */}
      <section id="features" className="py-24 bg-slate-950 border-t border-slate-800">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="text-center max-w-3xl mx-auto mb-16">
            <span className="text-xs font-bold uppercase tracking-wider text-brand-400">Comprehensive Capabilities</span>
            <h2 className="text-3xl sm:text-5xl font-extrabold text-white font-display mt-2">
              Everything Your Organization Needs
            </h2>
            <p className="mt-4 text-slate-400">
              NexusHR provides complete modules covering all 25 areas of organizational workforce administration.
            </p>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
            {[
              { icon: Users, title: "Employee Directory & Profiles", desc: "Comprehensive profiles with personal, contact, family, bank, tax, skills, emergency contacts, and job history." },
              { icon: Clock, title: "Attendance & Shift Management", desc: "Digital punch-in/out, biometric IoT integration, shift rosters, overtime computation, and regularization workflows." },
              { icon: Calendar, title: "Leave & Holiday Tracking", desc: "Custom leave types (Casual, Sick, Earned, Comp-off), balances, instant manager approvals, and team calendar view." },
              { icon: CreditCard, title: "India Statutory Payroll", desc: "One-click monthly payroll run, Basic/HRA/DA breakdown, PF, ESI, Professional Tax, TDS deductions, and Form 16." },
              { icon: UserCheck, title: "Recruitment & ATS Pipeline", desc: "Job postings, interactive Kanban applicant tracking, resume notes, interview scheduling, and offer letter generation." },
              { icon: Sparkles, title: "Employee Onboarding", desc: "Structured joining checklists, document KYC verification, IT equipment allocation, email provisioning, and orientation." },
              { icon: Award, title: "Performance Management", desc: "Goals & OKRs tracking, 360-degree feedback, self & manager appraisal reviews, and rating distribution." },
              { icon: BookOpen, title: "Training & Development (LMS)", desc: "Corporate training catalog (POSH, Security, Leadership), enrollment tracking, progress status, and completion certs." },
              { icon: Receipt, title: "Expense Claims & Reimbursement", desc: "Expense submission with receipt attachments, category spend policies, multi-tier approvals, and payout tracking." },
              { icon: FileText, title: "Digital Document Repository", desc: "Secure centralized contracts, policies, payslips, tax certificates, and automated document expiration alerts." },
              { icon: LifeBuoy, title: "HR Requests & Helpdesk", desc: "Internal ticketing system for payroll, IT, and policy queries with SLA tracking, resolution notes, and status updates." },
              { icon: Bell, title: "Announcements & Broadcasts", desc: "Company-wide bulletins, policy updates, emergency notifications, and automated birthday & work anniversary wishes." },
              { icon: Star, title: "Employee Engagement & Recognition", desc: "Kudos badges wall, live company polls, employee suggestion box, and culture health scoring." },
              { icon: Building2, title: "Offboarding & Exit Clearance", desc: "Resignation processing, notice period countdown, multi-department clearance checklist, FnF settlement & relieving letters." },
              { icon: BarChart3, title: "Reports & Workforce Analytics", desc: "Real-time charts for headcount growth, department budgets, gender diversity, attrition rates, and CSV exports." }
            ].map((f, i) => (
              <div key={i} className="p-6 rounded-2xl bg-slate-900 border border-slate-800 hover:border-brand-500/50 transition duration-200 group">
                <div className="w-12 h-12 rounded-xl bg-slate-800 group-hover:bg-brand-600/20 text-brand-400 group-hover:text-brand-300 flex items-center justify-center mb-4 transition">
                  <f.icon className="w-6 h-6" />
                </div>
                <h3 className="text-lg font-bold text-white mb-2">{f.title}</h3>
                <p className="text-sm text-slate-400 leading-relaxed">{f.desc}</p>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* Why Choose Us */}
      <section id="why-us" className="py-20 bg-slate-900 border-t border-slate-800">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="text-center max-w-3xl mx-auto mb-16">
            <span className="text-xs font-bold uppercase tracking-wider text-brand-400">The Nexus Advantage</span>
            <h2 className="text-3xl sm:text-4xl font-extrabold text-white font-display mt-2">
              Why Forward-Thinking Enterprises Choose NexusHR
            </h2>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-3 gap-8">
            <div className="p-6 rounded-2xl bg-slate-800/60 border border-slate-700/80">
              <div className="text-brand-400 font-extrabold text-2xl mb-2">01</div>
              <h3 className="text-lg font-bold text-white mb-2">100% Indian Statutory Accuracy</h3>
              <p className="text-sm text-slate-300">
                Guaranteed compliance with EPF, ESI, state Professional Tax slabs, gratuity rules, and income tax TDS slabs. Auto-generates quarterly statements and Form 16.
              </p>
            </div>
            <div className="p-6 rounded-2xl bg-slate-800/60 border border-slate-700/80">
              <div className="text-brand-400 font-extrabold text-2xl mb-2">02</div>
              <h3 className="text-lg font-bold text-white mb-2">Biometric & Cloud Synchronicity</h3>
              <p className="text-sm text-slate-300">
                Plug-and-play biometric hardware integration coupled with GPS-fenced mobile punches for remote and field workforces. Zero manual reconciliation.
              </p>
            </div>
            <div className="p-6 rounded-2xl bg-slate-800/60 border border-slate-700/80">
              <div className="text-brand-400 font-extrabold text-2xl mb-2">03</div>
              <h3 className="text-lg font-bold text-white mb-2">Enterprise-Grade Security</h3>
              <p className="text-sm text-slate-300">
                Multi-Factor Authentication (2FA), Granular Role-Based Access Control (RBAC), end-to-end encryption, and full forensic audit logging for compliance audits.
              </p>
            </div>
          </div>
        </div>
      </section>

      {/* Benefits for Personas */}
      <section id="benefits" className="py-20 bg-slate-950 border-t border-slate-800">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="text-center max-w-3xl mx-auto mb-16">
            <span className="text-xs font-bold uppercase tracking-wider text-brand-400">Tailored Value</span>
            <h2 className="text-3xl sm:text-4xl font-extrabold text-white font-display mt-2">
              Benefits for Every Stakeholder
            </h2>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-3 gap-8">
            {/* Employees */}
            <div className="p-8 rounded-3xl bg-slate-900 border border-slate-800">
              <div className="inline-flex px-3 py-1 rounded-full bg-amber-500/10 text-amber-400 text-xs font-bold uppercase mb-4">
                For Employees
              </div>
              <h3 className="text-xl font-bold text-white mb-4">Empowered & Transparent Self-Service</h3>
              <ul className="space-y-3 text-sm text-slate-300">
                <li className="flex items-center gap-2">✓ 1-click attendance punch & timesheet review</li>
                <li className="flex items-center gap-2">✓ Real-time leave balance ledger & instant applying</li>
                <li className="flex items-center gap-2">✓ Download digital salary slips & Form 16</li>
                <li className="flex items-center gap-2">✓ Fast expense reimbursements with receipt upload</li>
                <li className="flex items-center gap-2">✓ Anonymous suggestion box & recognition kudos</li>
              </ul>
            </div>

            {/* HR Managers */}
            <div className="p-8 rounded-3xl bg-slate-900 border border-brand-500/40 relative shadow-xl shadow-brand-500/10">
              <div className="inline-flex px-3 py-1 rounded-full bg-brand-500/20 text-brand-300 text-xs font-bold uppercase mb-4">
                For HR Managers
              </div>
              <h3 className="text-xl font-bold text-white mb-4">Automated & Stress-Free Operations</h3>
              <ul className="space-y-3 text-sm text-slate-300">
                <li className="flex items-center gap-2">✓ Run company payroll in under 3 minutes</li>
                <li className="flex items-center gap-2">✓ Zero manual leave or regularization calculations</li>
                <li className="flex items-center gap-2">✓ Visual ATS recruitment kanban with interview scheduler</li>
                <li className="flex items-center gap-2">✓ Structured onboarding & asset allocation checklist</li>
                <li className="flex items-center gap-2">✓ Centralized ticketing helpdesk with SLA tracking</li>
              </ul>
            </div>

            {/* Management */}
            <div className="p-8 rounded-3xl bg-slate-900 border border-slate-800">
              <div className="inline-flex px-3 py-1 rounded-full bg-emerald-500/10 text-emerald-400 text-xs font-bold uppercase mb-4">
                For Executive Leadership
              </div>
              <h3 className="text-xl font-bold text-white mb-4">Data-Driven Workforce Intelligence</h3>
              <ul className="space-y-3 text-sm text-slate-300">
                <li className="flex items-center gap-2">✓ Real-time headcount & department expenditure</li>
                <li className="flex items-center gap-2">✓ Early warning indicators on attrition & turnover</li>
                <li className="flex items-center gap-2">✓ Gender & diversity compliance analytics</li>
                <li className="flex items-center gap-2">✓ Performance distribution & high-performer retention</li>
                <li className="flex items-center gap-2">✓ Audit-proof statutory compliance reports</li>
              </ul>
            </div>
          </div>
        </div>
      </section>

      {/* Pricing / Plans */}
      <section id="pricing" className="py-20 bg-slate-900 border-t border-slate-800">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="text-center max-w-3xl mx-auto mb-12">
            <span className="text-xs font-bold uppercase tracking-wider text-brand-400">Transparent Plans</span>
            <h2 className="text-3xl sm:text-4xl font-extrabold text-white font-display mt-2">
              Flexible Plans Tailored to Your Scale
            </h2>
            <p className="mt-3 text-slate-400">All plans include regular Indian statutory updates & cloud backups.</p>

            {/* Billing Toggle */}
            <div className="mt-8 inline-flex items-center p-1 bg-slate-800 rounded-xl border border-slate-700">
              <button
                onClick={() => setBillingCycle('monthly')}
                className={`px-4 py-1.5 rounded-lg text-xs font-semibold transition ${billingCycle === 'monthly' ? 'bg-brand-600 text-white' : 'text-slate-400 hover:text-white'}`}
              >
                Monthly Billing
              </button>
              <button
                onClick={() => setBillingCycle('annual')}
                className={`px-4 py-1.5 rounded-lg text-xs font-semibold transition ${billingCycle === 'annual' ? 'bg-brand-600 text-white' : 'text-slate-400 hover:text-white'}`}
              >
                Annual Billing (Save 20%)
              </button>
            </div>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-3 gap-8">
            <div className="p-8 rounded-3xl bg-slate-950 border border-slate-800 flex flex-col justify-between">
              <div>
                <h3 className="text-xl font-bold text-white">Starter</h3>
                <p className="text-xs text-slate-400 mt-1">For growing teams up to 25 employees</p>
                <div className="my-6">
                  <span className="text-4xl font-extrabold text-white">
                    {billingCycle === 'monthly' ? '₹2,499' : '₹1,999'}
                  </span>
                  <span className="text-slate-400 text-sm"> / month</span>
                </div>
                <ul className="space-y-3 text-sm text-slate-300">
                  <li className="flex items-center gap-2">✓ Core Employee Directory</li>
                  <li className="flex items-center gap-2">✓ Web Attendance Punch & Leaves</li>
                  <li className="flex items-center gap-2">✓ India Statutory Payroll & Slips</li>
                  <li className="flex items-center gap-2">✓ Employee Self-Service (ESS)</li>
                  <li className="flex items-center gap-2 text-slate-500">✗ ATS & Kanban Recruitment</li>
                </ul>
              </div>
              <button
                onClick={() => setShowDemoModal(true)}
                className="mt-8 w-full py-2.5 rounded-xl font-semibold text-slate-200 bg-slate-800 hover:bg-slate-700 border border-slate-700 transition"
              >
                Get Started
              </button>
            </div>

            <div className="p-8 rounded-3xl bg-slate-950 border-2 border-brand-500 flex flex-col justify-between relative shadow-2xl shadow-brand-500/20">
              <div className="absolute -top-3.5 left-1/2 -translate-x-1/2 px-4 py-1 bg-brand-600 text-white rounded-full text-xs font-bold uppercase tracking-wider">
                Most Popular
              </div>
              <div>
                <h3 className="text-xl font-bold text-white">Professional</h3>
                <p className="text-xs text-slate-400 mt-1">For scaling businesses up to 150 employees</p>
                <div className="my-6">
                  <span className="text-4xl font-extrabold text-brand-400">
                    {billingCycle === 'monthly' ? '₹6,999' : '₹5,599'}
                  </span>
                  <span className="text-slate-400 text-sm"> / month</span>
                </div>
                <ul className="space-y-3 text-sm text-slate-300">
                  <li className="flex items-center gap-2">✓ All Starter Features included</li>
                  <li className="flex items-center gap-2">✓ Biometric Device Integration</li>
                  <li className="flex items-center gap-2">✓ Full Recruitment ATS & Onboarding</li>
                  <li className="flex items-center gap-2">✓ Performance Reviews & Goals (OKRs)</li>
                  <li className="flex items-center gap-2">✓ Expense Claims & Reimbursements</li>
                  <li className="flex items-center gap-2">✓ LMS Course Catalog & Certifications</li>
                </ul>
              </div>
              <button
                onClick={() => { setViewMode('portal'); switchRole('admin'); }}
                className="mt-8 w-full py-2.5 rounded-xl font-bold text-white bg-brand-600 hover:bg-brand-500 transition shadow-lg shadow-brand-600/30"
              >
                Launch Professional Free Trial
              </button>
            </div>

            <div className="p-8 rounded-3xl bg-slate-950 border border-slate-800 flex flex-col justify-between">
              <div>
                <h3 className="text-xl font-bold text-white">Enterprise</h3>
                <p className="text-xs text-slate-400 mt-1">Unlimited headcount & bespoke compliance</p>
                <div className="my-6">
                  <span className="text-4xl font-extrabold text-white">Custom</span>
                  <span className="text-slate-400 text-sm"> / custom quote</span>
                </div>
                <ul className="space-y-3 text-sm text-slate-300">
                  <li className="flex items-center gap-2">✓ Everything in Professional</li>
                  <li className="flex items-center gap-2">✓ Dedicated Account Manager</li>
                  <li className="flex items-center gap-2">✓ ERP / Tally / Banking Direct API Sync</li>
                  <li className="flex items-center gap-2">✓ Custom Approval Workflows & SLA</li>
                  <li className="flex items-center gap-2">✓ Custom Data Retention & On-Prem Options</li>
                </ul>
              </div>
              <button
                onClick={() => setShowDemoModal(true)}
                className="mt-8 w-full py-2.5 rounded-xl font-semibold text-slate-200 bg-slate-800 hover:bg-slate-700 border border-slate-700 transition"
              >
                Contact Enterprise Sales
              </button>
            </div>
          </div>
        </div>
      </section>

      {/* FAQ Accordion */}
      <section id="faq" className="py-20 bg-slate-950 border-t border-slate-800">
        <div className="max-w-4xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="text-center mb-12">
            <span className="text-xs font-bold uppercase tracking-wider text-brand-400">Got Questions?</span>
            <h2 className="text-3xl font-extrabold text-white font-display mt-2">Frequently Asked Questions</h2>
          </div>

          <div className="space-y-4">
            {faqs.map((faq, idx) => (
              <div 
                key={idx}
                className="rounded-2xl bg-slate-900 border border-slate-800 overflow-hidden transition"
              >
                <button
                  onClick={() => setOpenFaq(openFaq === idx ? -1 : idx)}
                  className="w-full px-6 py-4 text-left font-semibold text-white flex justify-between items-center hover:bg-slate-850"
                >
                  <span>{faq.q}</span>
                  {openFaq === idx ? <ChevronUp className="w-5 h-5 text-brand-400" /> : <ChevronDown className="w-5 h-5 text-slate-400" />}
                </button>
                {openFaq === idx && (
                  <div className="px-6 pb-4 text-sm text-slate-300 border-t border-slate-800/80 pt-3 leading-relaxed">
                    {faq.a}
                  </div>
                )}
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* Contact Us */}
      <section id="contact" className="py-20 bg-slate-900 border-t border-slate-800">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="grid grid-cols-1 lg:grid-cols-2 gap-12">
            <div>
              <span className="text-xs font-bold uppercase tracking-wider text-brand-400">Get in Touch</span>
              <h2 className="text-3xl sm:text-4xl font-extrabold text-white font-display mt-2">
                Have specific requirements? Let’s talk.
              </h2>
              <p className="mt-4 text-slate-300 leading-relaxed">
                Our HR technology consultants will help you plan data migration, biometric mapping, and custom statutory policy setups.
              </p>

              <div className="mt-8 space-y-4 text-sm text-slate-300">
                <div className="flex items-center space-x-3">
                  <div className="w-10 h-10 rounded-lg bg-slate-800 flex items-center justify-center text-brand-400">
                    <MapPin className="w-5 h-5" />
                  </div>
                  <div>
                    <p className="font-semibold text-white">Innovation Tech Park</p>
                    <p className="text-slate-400 text-xs">Outer Ring Road, Bellandur, Bengaluru, Karnataka - 560103</p>
                  </div>
                </div>

                <div className="flex items-center space-x-3">
                  <div className="w-10 h-10 rounded-lg bg-slate-800 flex items-center justify-center text-emerald-400">
                    <Phone className="w-5 h-5" />
                  </div>
                  <div>
                    <p className="font-semibold text-white">+91 80 4567 8900</p>
                    <p className="text-slate-400 text-xs">Mon - Fri: 9:00 AM - 7:00 PM IST</p>
                  </div>
                </div>

                <div className="flex items-center space-x-3">
                  <div className="w-10 h-10 rounded-lg bg-slate-800 flex items-center justify-center text-sky-400">
                    <Mail className="w-5 h-5" />
                  </div>
                  <div>
                    <p className="font-semibold text-white">enterprise@nexus.hr</p>
                    <p className="text-slate-400 text-xs">Instant 24-hour response SLA</p>
                  </div>
                </div>
              </div>
            </div>

            <div className="bg-slate-950 p-8 rounded-3xl border border-slate-800">
              <h3 className="text-xl font-bold text-white mb-4">Send us a message</h3>
              {contactSuccess ? (
                <div className="p-6 bg-emerald-950/60 border border-emerald-800 rounded-xl text-center text-emerald-300">
                  <CheckCircle2 className="w-10 h-10 mx-auto mb-2 text-emerald-400" />
                  <p className="font-bold">Thank you for contacting us!</p>
                  <p className="text-xs text-slate-300 mt-1">Our HR solution architects will reach out shortly.</p>
                </div>
              ) : (
                <form onSubmit={handleContactSubmit} className="space-y-4">
                  <div>
                    <label className="block text-xs font-semibold text-slate-300 mb-1">Your Full Name</label>
                    <input
                      type="text"
                      required
                      placeholder="e.g. Sridharan M"
                      value={contactForm.name}
                      onChange={e => setContactForm({ ...contactForm, name: e.target.value })}
                      className="w-full px-4 py-2.5 rounded-xl bg-slate-900 border border-slate-700 text-white placeholder-slate-500 focus:outline-none focus:border-brand-500 text-sm"
                    />
                  </div>
                  <div>
                    <label className="block text-xs font-semibold text-slate-300 mb-1">Work Email</label>
                    <input
                      type="email"
                      required
                      placeholder="sridharan@company.com"
                      value={contactForm.email}
                      onChange={e => setContactForm({ ...contactForm, email: e.target.value })}
                      className="w-full px-4 py-2.5 rounded-xl bg-slate-900 border border-slate-700 text-white placeholder-slate-500 focus:outline-none focus:border-brand-500 text-sm"
                    />
                  </div>
                  <div>
                    <label className="block text-xs font-semibold text-slate-300 mb-1">Your Requirement / Message</label>
                    <textarea
                      rows={4}
                      required
                      placeholder="Tell us about your organization headcount and core requirements..."
                      value={contactForm.message}
                      onChange={e => setContactForm({ ...contactForm, message: e.target.value })}
                      className="w-full px-4 py-2.5 rounded-xl bg-slate-900 border border-slate-700 text-white placeholder-slate-500 focus:outline-none focus:border-brand-500 text-sm"
                    />
                  </div>
                  <button
                    type="submit"
                    className="w-full py-3 rounded-xl font-bold text-white bg-brand-600 hover:bg-brand-500 transition shadow-lg shadow-brand-600/30 flex items-center justify-center space-x-2 text-sm"
                  >
                    <Send className="w-4 h-4" />
                    <span>Submit Message</span>
                  </button>
                </form>
              )}
            </div>
          </div>
        </div>
      </section>

      {/* Footer */}
      <footer className="mt-auto bg-slate-950 border-t border-slate-800/80 py-12 text-slate-400 text-sm">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 flex flex-col md:flex-row items-center justify-between gap-6">
          <div className="flex items-center space-x-3">
            <div className="w-8 h-8 rounded-lg bg-brand-600 flex items-center justify-center text-white">
              <Users className="w-5 h-5" />
            </div>
            <span className="font-bold text-white text-lg">NexusHR</span>
            <span className="text-xs text-slate-500">© 2026 Nexus Enterprise Technologies Pvt. Ltd. All rights reserved.</span>
          </div>
          <div className="flex space-x-6 text-xs">
            <a href="#about" className="hover:text-white transition">About</a>
            <a href="#features" className="hover:text-white transition">Features</a>
            <a href="#pricing" className="hover:text-white transition">Pricing</a>
            <button onClick={() => { setViewMode('portal'); switchRole('admin'); }} className="text-brand-400 hover:text-brand-300 font-semibold">
              Live Demo Portal →
            </button>
          </div>
        </div>
      </footer>

      {/* Request Demo Modal */}
      {showDemoModal && (
        <div className="fixed inset-0 z-50 bg-black/75 backdrop-blur-sm flex items-center justify-center p-4">
          <div className="bg-slate-900 border border-slate-700 rounded-3xl max-w-lg w-full p-6 sm:p-8 relative shadow-2xl">
            <button
              onClick={() => setShowDemoModal(false)}
              className="absolute top-5 right-5 text-slate-400 hover:text-white text-xl font-bold"
            >
              ✕
            </button>
            <h3 className="text-2xl font-bold text-white font-display">Schedule a Guided Live Demo</h3>
            <p className="text-xs text-slate-400 mt-1">See how NexusHR automates payroll, attendance, and recruitment.</p>

            {demoSuccess ? (
              <div className="mt-6 p-6 bg-emerald-950/70 border border-emerald-800 rounded-2xl text-center text-emerald-300">
                <CheckCircle2 className="w-12 h-12 mx-auto mb-3 text-emerald-400" />
                <h4 className="font-bold text-base">Demo Request Registered!</h4>
                <p className="text-xs text-slate-300 mt-1">A calendar invitation has been dispatched to your email.</p>
              </div>
            ) : (
              <form onSubmit={handleDemoSubmit} className="mt-6 space-y-4 text-sm">
                <div>
                  <label className="block text-xs font-semibold text-slate-300 mb-1">Full Name</label>
                  <input
                    type="text"
                    required
                    placeholder="Aarav Sharma"
                    value={demoForm.name}
                    onChange={e => setDemoForm({ ...demoForm, name: e.target.value })}
                    className="w-full px-4 py-2 rounded-xl bg-slate-800 border border-slate-700 text-white focus:outline-none focus:border-brand-500 text-sm"
                  />
                </div>
                <div className="grid grid-cols-2 gap-3">
                  <div>
                    <label className="block text-xs font-semibold text-slate-300 mb-1">Work Email</label>
                    <input
                      type="email"
                      required
                      placeholder="hr@enterprise.com"
                      value={demoForm.email}
                      onChange={e => setDemoForm({ ...demoForm, email: e.target.value })}
                      className="w-full px-4 py-2 rounded-xl bg-slate-800 border border-slate-700 text-white focus:outline-none focus:border-brand-500 text-sm"
                    />
                  </div>
                  <div>
                    <label className="block text-xs font-semibold text-slate-300 mb-1">Phone Number</label>
                    <input
                      type="tel"
                      required
                      placeholder="+91 98450 12345"
                      value={demoForm.phone}
                      onChange={e => setDemoForm({ ...demoForm, phone: e.target.value })}
                      className="w-full px-4 py-2 rounded-xl bg-slate-800 border border-slate-700 text-white focus:outline-none focus:border-brand-500 text-sm"
                    />
                  </div>
                </div>
                <div className="grid grid-cols-2 gap-3">
                  <div>
                    <label className="block text-xs font-semibold text-slate-300 mb-1">Company Name</label>
                    <input
                      type="text"
                      required
                      placeholder="Acme Technologies"
                      value={demoForm.company}
                      onChange={e => setDemoForm({ ...demoForm, company: e.target.value })}
                      className="w-full px-4 py-2 rounded-xl bg-slate-800 border border-slate-700 text-white focus:outline-none focus:border-brand-500 text-sm"
                    />
                  </div>
                  <div>
                    <label className="block text-xs font-semibold text-slate-300 mb-1">Headcount</label>
                    <select
                      value={demoForm.employees}
                      onChange={e => setDemoForm({ ...demoForm, employees: e.target.value })}
                      className="w-full px-4 py-2 rounded-xl bg-slate-800 border border-slate-700 text-white focus:outline-none focus:border-brand-500 text-sm"
                    >
                      <option>10 - 50 Employees</option>
                      <option>50 - 200 Employees</option>
                      <option>200 - 1000 Employees</option>
                      <option>1000+ Employees</option>
                    </select>
                  </div>
                </div>
                <button
                  type="submit"
                  className="w-full py-3 mt-4 rounded-xl font-bold text-white bg-brand-600 hover:bg-brand-500 transition shadow-lg shadow-brand-600/30"
                >
                  Confirm & Schedule Demo
                </button>
              </form>
            )}
          </div>
        </div>
      )}

      {/* Mobile Link & QR Code Modal */}
      {showMobileModal && (
        <div className="fixed inset-0 z-50 bg-black/80 backdrop-blur-xs flex items-center justify-center p-4">
          <div className="bg-slate-900 border border-slate-700 rounded-3xl max-w-sm w-full p-6 shadow-2xl relative text-center">
            <button
              onClick={() => setShowMobileModal(false)}
              className="absolute top-4 right-4 text-slate-400 hover:text-white p-1"
            >
              ✕
            </button>

            <div className="w-12 h-12 rounded-2xl bg-brand-500/20 text-brand-400 flex items-center justify-center mx-auto mb-3 border border-brand-500/30">
              <Smartphone className="w-6 h-6" />
            </div>

            <h3 className="text-lg font-bold text-white font-display">Mobile Access Link</h3>
            <p className="text-xs text-slate-400 mt-1">
              Open NexusHR directly on your phone or scan this QR code with your mobile camera.
            </p>

            <div className="my-5 p-3 bg-white rounded-2xl inline-block shadow-lg">
              <img
                src={`https://api.qrserver.com/v1/create-qr-code/?size=180x180&data=${encodeURIComponent(mobileUrl)}`}
                alt="Scan to open on mobile"
                className="w-44 h-44 rounded-xl mx-auto"
              />
            </div>

            <div className="space-y-2">
              <div className="flex items-center space-x-1.5 p-1.5 bg-slate-800 rounded-xl border border-slate-700">
                <input
                  type="text"
                  readOnly
                  value={mobileUrl}
                  className="flex-1 px-2 text-xs font-mono bg-transparent text-slate-200 focus:outline-none"
                />
                <button
                  onClick={copyMobileLink}
                  className={`px-3 py-1.5 rounded-lg text-xs font-bold transition flex items-center space-x-1 ${
                    copied ? 'bg-emerald-600 text-white' : 'bg-brand-600 hover:bg-brand-500 text-white'
                  }`}
                >
                  <span>{copied ? 'Copied ✓' : 'Copy'}</span>
                </button>
              </div>

              <p className="text-[10px] text-slate-400">
                💡 Connect your phone to the same Wi-Fi network to browse seamlessly.
              </p>
            </div>
          </div>
        </div>
      )}
    </div>
  );
}
