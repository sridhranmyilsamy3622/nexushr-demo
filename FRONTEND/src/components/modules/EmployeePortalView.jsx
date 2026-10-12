import React, { useState, useEffect } from 'react';
import { 
  User, Clock, Calendar, CreditCard, Receipt, 
  FileText, LifeBuoy, Bell, Award, CheckCircle, 
  Sparkles, Download, Eye, Send, Plus, MapPin, Printer
} from 'lucide-react';
import { api } from '../../services/api';
import { useAuth } from '../../context/AuthContext';

export default function EmployeePortalView({ subTab }) {
  const { currentUser, setActiveTab, triggerRefresh, refreshKey } = useAuth();
  const [empData, setEmpData] = useState(null);
  const [balances, setBalances] = useState({ casual: 6, sick: 5, earned: 12, compOff: 2 });
  const [payslip, setPayslip] = useState(null);
  const [showApplyLeave, setShowApplyLeave] = useState(false);
  const [leaveForm, setLeaveForm] = useState({ leaveType: 'Casual Leave', startDate: '2026-10-24', endDate: '2026-10-25', totalDays: 2, reason: '' });
  const [showExpenseModal, setShowExpenseModal] = useState(false);
  const [expForm, setExpForm] = useState({ category: 'Travel & Transit', amount: '', description: '' });
  const [showTicketModal, setShowTicketModal] = useState(false);
  const [ticketForm, setTicketForm] = useState({ category: 'Payroll & Tax', subject: '', priority: 'Medium', message: '' });
  const [toastMessage, setToastMessage] = useState('');
  const [isPunchedIn, setIsPunchedIn] = useState(true);

  const empId = currentUser.employeeId || 'NEX-003';

  useEffect(() => {
    api.getEmployee(empId).then(setEmpData).catch(console.error);
    api.getLeaveBalance(empId).then(setBalances).catch(console.error);
    api.getEmployeePayslip(empId).then(setPayslip).catch(console.error);
  }, [empId, refreshKey]);

  const handlePunch = async (type) => {
    await api.punchAttendance(empId, type, 'Office');
    setIsPunchedIn(type === 'in');
    setToastMessage(`Punched ${type.toUpperCase()} successfully.`);
    triggerRefresh();
    setTimeout(() => setToastMessage(''), 3000);
  };

  const handleApplyLeave = async (e) => {
    e.preventDefault();
    await api.applyLeave({
      ...leaveForm,
      employeeId: empId
    });
    setShowApplyLeave(false);
    setToastMessage("Leave request submitted to your manager for approval!");
    triggerRefresh();
    setTimeout(() => setToastMessage(''), 3000);
  };

  const handleSubmitExpense = async (e) => {
    e.preventDefault();
    await api.submitExpense({
      ...expForm,
      employeeId: empId
    });
    setShowExpenseModal(false);
    setToastMessage("Expense reimbursement claim logged!");
    triggerRefresh();
    setTimeout(() => setToastMessage(''), 3000);
  };

  const handleRaiseTicket = async (e) => {
    e.preventDefault();
    await api.createTicket({
      ...ticketForm,
      employeeId: empId
    });
    setShowTicketModal(false);
    setToastMessage("HR Helpdesk ticket created!");
    triggerRefresh();
    setTimeout(() => setToastMessage(''), 3000);
  };

  if (!empData) {
    return (
      <div className="p-8 flex items-center justify-center">
        <div className="w-8 h-8 border-4 border-brand-500 border-t-transparent rounded-full animate-spin"></div>
      </div>
    );
  }

  return (
    <div className="space-y-6">
      {/* Toast */}
      {toastMessage && (
        <div className="p-4 bg-emerald-50 border border-emerald-200 text-emerald-800 rounded-2xl flex items-center space-x-2 text-xs font-semibold shadow-xs">
          <CheckCircle className="w-4 h-4 text-emerald-600" />
          <span>{toastMessage}</span>
        </div>
      )}

      {/* Employee Welcome Banner */}
      <div className="bg-gradient-to-r from-slate-900 via-indigo-950 to-slate-900 rounded-3xl p-6 sm:p-8 text-white shadow-xl relative overflow-hidden flex flex-col md:flex-row md:items-center justify-between gap-6">
        <div className="flex items-center space-x-4">
          <img
            src={empData.avatar}
            alt={empData.firstName}
            className="w-16 h-16 rounded-2xl object-cover ring-2 ring-brand-400"
          />
          <div>
            <span className="px-2.5 py-0.5 rounded-full bg-brand-500/30 border border-brand-400/40 text-brand-300 text-[10px] font-bold uppercase tracking-wider inline-block mb-1">
              Employee Self-Service (ESS)
            </span>
            <h1 className="text-2xl font-bold font-display">
              Welcome back, {empData.firstName}!
            </h1>
            <p className="text-xs text-indigo-200 mt-0.5">
              {empData.designation} • {empData.department} • Manager: {empData.reportingManager}
            </p>
          </div>
        </div>

        {/* Live Attendance Clock Pill */}
        <div className="bg-slate-800/80 p-3 rounded-2xl border border-slate-700/80 flex items-center space-x-3 text-xs self-start md:self-auto">
          <div>
            <p className="text-[10px] text-slate-400 font-semibold uppercase">Daily Punch Status</p>
            <p className="font-bold text-white mt-0.5">{isPunchedIn ? 'Present (In Progress)' : 'Shift Logged Out'}</p>
          </div>
          <button
            onClick={() => handlePunch(isPunchedIn ? 'out' : 'in')}
            className={`px-3 py-1.5 rounded-xl font-bold transition text-xs ${
              isPunchedIn ? 'bg-rose-600 hover:bg-rose-500 text-white' : 'bg-emerald-600 hover:bg-emerald-500 text-white'
            }`}
          >
            {isPunchedIn ? 'Punch Out' : 'Punch In'}
          </button>
        </div>
      </div>

      {/* Quick Action Tiles */}
      <div className="grid grid-cols-2 sm:grid-cols-4 gap-4">
        <button
          onClick={() => setShowApplyLeave(true)}
          className="p-5 rounded-2xl bg-white border border-slate-200/90 shadow-xs text-left hover:border-brand-500 transition group"
        >
          <Calendar className="w-6 h-6 text-brand-600 mb-2 group-hover:scale-110 transition" />
          <h4 className="font-bold text-xs text-slate-900">Apply for Leave</h4>
          <p className="text-[11px] text-slate-400 mt-0.5">CL: {balances.casual}d | SL: {balances.sick}d</p>
        </button>

        <button
          onClick={() => setActiveTab('ess-payslips')}
          className="p-5 rounded-2xl bg-white border border-slate-200/90 shadow-xs text-left hover:border-brand-500 transition group"
        >
          <CreditCard className="w-6 h-6 text-emerald-600 mb-2 group-hover:scale-110 transition" />
          <h4 className="font-bold text-xs text-slate-900">View Latest Payslip</h4>
          <p className="text-[11px] text-slate-400 mt-0.5">September 2026 Disbursed</p>
        </button>

        <button
          onClick={() => setShowExpenseModal(true)}
          className="p-5 rounded-2xl bg-white border border-slate-200/90 shadow-xs text-left hover:border-brand-500 transition group"
        >
          <Receipt className="w-6 h-6 text-amber-600 mb-2 group-hover:scale-110 transition" />
          <h4 className="font-bold text-xs text-slate-900">Claim Expense</h4>
          <p className="text-[11px] text-slate-400 mt-0.5">Travel & Bills reimbursement</p>
        </button>

        <button
          onClick={() => setShowTicketModal(true)}
          className="p-5 rounded-2xl bg-white border border-slate-200/90 shadow-xs text-left hover:border-brand-500 transition group"
        >
          <LifeBuoy className="w-6 h-6 text-purple-600 mb-2 group-hover:scale-110 transition" />
          <h4 className="font-bold text-xs text-slate-900">Raise HR Request</h4>
          <p className="text-[11px] text-slate-400 mt-0.5">Payroll, IT & Policy helpdesk</p>
        </button>
      </div>

      {/* My Leave Balances Ledger */}
      <div className="bg-white rounded-3xl border border-slate-200/90 shadow-xs p-6">
        <h3 className="font-bold text-sm text-slate-900 mb-4 flex items-center gap-2">
          <Calendar className="w-4 h-4 text-brand-600" />
          My Current Leave Quotas & Balances
        </h3>

        <div className="grid grid-cols-2 sm:grid-cols-4 gap-4">
          <div className="p-4 bg-slate-50 rounded-2xl border border-slate-100">
            <span className="text-[11px] text-slate-500 font-semibold">Casual Leave</span>
            <p className="text-2xl font-extrabold text-brand-600 font-display mt-1">{balances.casual} Days</p>
          </div>
          <div className="p-4 bg-slate-50 rounded-2xl border border-slate-100">
            <span className="text-[11px] text-slate-500 font-semibold">Sick Leave</span>
            <p className="text-2xl font-extrabold text-emerald-600 font-display mt-1">{balances.sick} Days</p>
          </div>
          <div className="p-4 bg-slate-50 rounded-2xl border border-slate-100">
            <span className="text-[11px] text-slate-500 font-semibold">Earned Privilege Leave</span>
            <p className="text-2xl font-extrabold text-indigo-600 font-display mt-1">{balances.earned} Days</p>
          </div>
          <div className="p-4 bg-slate-50 rounded-2xl border border-slate-100">
            <span className="text-[11px] text-slate-500 font-semibold">Comp-Off Balance</span>
            <p className="text-2xl font-extrabold text-amber-600 font-display mt-1">{balances.compOff} Days</p>
          </div>
        </div>
      </div>

      {/* Payslip & Personal Details Summary */}
      {payslip && (
        <div className="bg-white rounded-3xl border border-slate-200/90 shadow-xs p-6 space-y-4">
          <div className="flex items-center justify-between pb-3 border-b border-slate-100">
            <div>
              <h3 className="font-bold text-sm text-slate-900">My Net Take-Home Salary Breakdown</h3>
              <p className="text-xs text-slate-500">Credited directly to {empData.bankDetails?.bankName} (A/C: {empData.bankDetails?.accountNumber})</p>
            </div>
            <button
              onClick={() => window.print()}
              className="px-3 py-1.5 rounded-xl border border-slate-200 hover:bg-slate-50 text-xs font-semibold text-slate-700 transition flex items-center space-x-1"
            >
              <Printer className="w-3.5 h-3.5" />
              <span>Print Slips</span>
            </button>
          </div>

          <div className="grid grid-cols-1 sm:grid-cols-3 gap-4 text-xs">
            <div className="p-4 bg-emerald-50 rounded-2xl border border-emerald-100">
              <span className="text-[11px] text-emerald-800 font-semibold block uppercase">Monthly Net Pay</span>
              <p className="text-2xl font-extrabold text-emerald-950 font-display mt-1">
                ₹{payslip.netPayable?.toLocaleString('en-IN')}
              </p>
              <span className="text-[10px] text-emerald-700 mt-1 block">TDS & PF Compliant</span>
            </div>

            <div className="p-4 bg-slate-50 rounded-2xl border border-slate-100 space-y-1">
              <span className="text-[11px] text-slate-500 font-semibold block uppercase">Gross Allowances</span>
              <p className="text-base font-bold text-slate-800">₹{payslip.earnings.grossTotal?.toLocaleString('en-IN')}</p>
              <span className="text-[10px] text-slate-400 block">Basic: ₹{payslip.earnings.basic?.toLocaleString('en-IN')} | HRA: ₹{payslip.earnings.hra?.toLocaleString('en-IN')}</span>
            </div>

            <div className="p-4 bg-rose-50/50 rounded-2xl border border-rose-100 space-y-1">
              <span className="text-[11px] text-rose-800 font-semibold block uppercase">Statutory Deductions</span>
              <p className="text-base font-bold text-rose-900">₹{payslip.deductions.totalDeductions?.toLocaleString('en-IN')}</p>
              <span className="text-[10px] text-rose-700 block">PF (12%): ₹{payslip.deductions.providentFund} | PT: ₹200 | TDS: ₹{payslip.deductions.tds}</span>
            </div>
          </div>
        </div>
      )}

      {/* Apply Leave Modal */}
      {showApplyLeave && (
        <div className="fixed inset-0 z-50 bg-black/60 backdrop-blur-xs flex items-center justify-center p-4">
          <div className="bg-white rounded-3xl max-w-md w-full p-6 shadow-2xl">
            <div className="flex justify-between items-center pb-3 border-b border-slate-100">
              <h3 className="font-bold text-sm text-slate-900">Apply for Leave</h3>
              <button onClick={() => setShowApplyLeave(false)} className="text-slate-400 hover:text-slate-600">
                ✕
              </button>
            </div>

            <form onSubmit={handleApplyLeave} className="mt-4 space-y-3 text-xs">
              <div>
                <label className="block text-slate-700 font-semibold mb-1">Leave Type</label>
                <select
                  value={leaveForm.leaveType}
                  onChange={e => setLeaveForm({ ...leaveForm, leaveType: e.target.value })}
                  className="w-full px-3 py-2 border rounded-xl focus:outline-none focus:border-brand-500"
                >
                  <option>Casual Leave</option>
                  <option>Sick Leave</option>
                  <option>Earned Leave</option>
                  <option>Comp-Off</option>
                </select>
              </div>

              <div className="grid grid-cols-2 gap-3">
                <div>
                  <label className="block text-slate-700 font-semibold mb-1">From Date</label>
                  <input
                    type="date"
                    required
                    value={leaveForm.startDate}
                    onChange={e => setLeaveForm({ ...leaveForm, startDate: e.target.value })}
                    className="w-full px-3 py-2 border rounded-xl focus:outline-none focus:border-brand-500"
                  />
                </div>
                <div>
                  <label className="block text-slate-700 font-semibold mb-1">To Date</label>
                  <input
                    type="date"
                    required
                    value={leaveForm.endDate}
                    onChange={e => setLeaveForm({ ...leaveForm, endDate: e.target.value })}
                    className="w-full px-3 py-2 border rounded-xl focus:outline-none focus:border-brand-500"
                  />
                </div>
              </div>

              <div>
                <label className="block text-slate-700 font-semibold mb-1">Reason</label>
                <textarea
                  rows={3}
                  required
                  placeholder="Provide context for manager..."
                  value={leaveForm.reason}
                  onChange={e => setLeaveForm({ ...leaveForm, reason: e.target.value })}
                  className="w-full px-3 py-2 border rounded-xl focus:outline-none focus:border-brand-500"
                />
              </div>

              <button
                type="submit"
                className="w-full py-2.5 rounded-xl font-bold text-white bg-brand-600 hover:bg-brand-500 transition shadow-md shadow-brand-600/30"
              >
                Submit Leave Application
              </button>
            </form>
          </div>
        </div>
      )}

      {/* Claim Expense Modal */}
      {showExpenseModal && (
        <div className="fixed inset-0 z-50 bg-black/60 backdrop-blur-xs flex items-center justify-center p-4">
          <div className="bg-white rounded-3xl max-w-md w-full p-6 shadow-2xl">
            <div className="flex justify-between items-center pb-3 border-b border-slate-100">
              <h3 className="font-bold text-sm text-slate-900">Claim Expense Reimbursement</h3>
              <button onClick={() => setShowExpenseModal(false)} className="text-slate-400 hover:text-slate-600">
                ✕
              </button>
            </div>

            <form onSubmit={handleSubmitExpense} className="mt-4 space-y-3 text-xs">
              <div>
                <label className="block text-slate-700 font-semibold mb-1">Category</label>
                <select
                  value={expForm.category}
                  onChange={e => setExpForm({ ...expForm, category: e.target.value })}
                  className="w-full px-3 py-2 border rounded-xl focus:outline-none focus:border-brand-500"
                >
                  <option>Travel & Transit</option>
                  <option>Client Meeting / Dinner</option>
                  <option>Software Subscriptions</option>
                  <option>Office Hardware</option>
                </select>
              </div>

              <div>
                <label className="block text-slate-700 font-semibold mb-1">Amount (₹)</label>
                <input
                  type="number"
                  required
                  placeholder="2400"
                  value={expForm.amount}
                  onChange={e => setExpForm({ ...expForm, amount: e.target.value })}
                  className="w-full px-3 py-2 border rounded-xl focus:outline-none focus:border-brand-500"
                />
              </div>

              <div>
                <label className="block text-slate-700 font-semibold mb-1">Description</label>
                <textarea
                  rows={3}
                  required
                  placeholder="Provide context..."
                  value={expForm.description}
                  onChange={e => setExpForm({ ...expForm, description: e.target.value })}
                  className="w-full px-3 py-2 border rounded-xl focus:outline-none focus:border-brand-500"
                />
              </div>

              <button
                type="submit"
                className="w-full py-2.5 rounded-xl font-bold text-white bg-brand-600 hover:bg-brand-500 transition shadow-md shadow-brand-600/30"
              >
                Submit Claim
              </button>
            </form>
          </div>
        </div>
      )}

      {/* Raise Ticket Modal */}
      {showTicketModal && (
        <div className="fixed inset-0 z-50 bg-black/60 backdrop-blur-xs flex items-center justify-center p-4">
          <div className="bg-white rounded-3xl max-w-md w-full p-6 shadow-2xl">
            <div className="flex justify-between items-center pb-3 border-b border-slate-100">
              <h3 className="font-bold text-sm text-slate-900">Raise HR Request / Ticket</h3>
              <button onClick={() => setShowTicketModal(false)} className="text-slate-400 hover:text-slate-600">
                ✕
              </button>
            </div>

            <form onSubmit={handleRaiseTicket} className="mt-4 space-y-3 text-xs">
              <div>
                <label className="block text-slate-700 font-semibold mb-1">Category</label>
                <select
                  value={ticketForm.category}
                  onChange={e => setTicketForm({ ...ticketForm, category: e.target.value })}
                  className="w-full px-3 py-2 border rounded-xl focus:outline-none focus:border-brand-500"
                >
                  <option>Payroll & Tax</option>
                  <option>IT Equipment</option>
                  <option>Leave Correction</option>
                  <option>Company Benefits</option>
                </select>
              </div>

              <div>
                <label className="block text-slate-700 font-semibold mb-1">Subject</label>
                <input
                  type="text"
                  required
                  placeholder="Brief summary..."
                  value={ticketForm.subject}
                  onChange={e => setTicketForm({ ...ticketForm, subject: e.target.value })}
                  className="w-full px-3 py-2 border rounded-xl focus:outline-none focus:border-brand-500"
                />
              </div>

              <div>
                <label className="block text-slate-700 font-semibold mb-1">Details</label>
                <textarea
                  rows={4}
                  required
                  placeholder="Details of your request..."
                  value={ticketForm.message}
                  onChange={e => setTicketForm({ ...ticketForm, message: e.target.value })}
                  className="w-full px-3 py-2 border rounded-xl focus:outline-none focus:border-brand-500"
                />
              </div>

              <button
                type="submit"
                className="w-full py-2.5 rounded-xl font-bold text-white bg-brand-600 hover:bg-brand-500 transition shadow-md shadow-brand-600/30"
              >
                Submit Ticket
              </button>
            </form>
          </div>
        </div>
      )}
    </div>
  );
}
