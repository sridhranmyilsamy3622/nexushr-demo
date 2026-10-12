import React, { useState, useEffect } from 'react';
import { 
  Calendar, Plus, CheckCircle, Clock, XCircle, 
  AlertCircle, Check, X, FileText, ChevronRight
} from 'lucide-react';
import { api } from '../../services/api';
import { useAuth } from '../../context/AuthContext';

export default function LeaveView() {
  const { currentUser, triggerRefresh, refreshKey } = useAuth();
  const [leaves, setLeaves] = useState([]);
  const [balances, setBalances] = useState({ casual: 10, sick: 7, earned: 15, compOff: 1 });
  const [holidays, setHolidays] = useState([]);
  const [showApplyModal, setShowApplyModal] = useState(false);
  const [applyForm, setApplyForm] = useState({
    leaveType: 'Casual Leave',
    startDate: '2026-10-25',
    endDate: '2026-10-26',
    totalDays: 2,
    isHalfDay: false,
    reason: ''
  });
  const [feedback, setFeedback] = useState('');

  useEffect(() => {
    api.getLeaves().then(setLeaves).catch(console.error);
    api.getLeaveBalance(currentUser.employeeId || 'NEX-001').then(setBalances).catch(console.error);
    api.getHolidays().then(setHolidays).catch(console.error);
  }, [refreshKey, currentUser]);

  const handleApply = async (e) => {
    e.preventDefault();
    await api.applyLeave({
      ...applyForm,
      employeeId: currentUser.employeeId || 'NEX-001'
    });
    setShowApplyModal(false);
    setFeedback("Leave application submitted successfully!");
    triggerRefresh();
    setTimeout(() => setFeedback(''), 3000);
  };

  const handleApprove = async (id) => {
    await api.updateLeaveStatus(id, 'Approved', currentUser.name, 'Approved');
    setFeedback("Leave request approved!");
    triggerRefresh();
    setTimeout(() => setFeedback(''), 3000);
  };

  const handleReject = async (id) => {
    await api.updateLeaveStatus(id, 'Rejected', currentUser.name, 'Unavailable due to team deliverable');
    setFeedback("Leave request rejected.");
    triggerRefresh();
    setTimeout(() => setFeedback(''), 3000);
  };

  return (
    <div className="space-y-6">
      {/* Toast Feedback */}
      {feedback && (
        <div className="p-4 bg-emerald-50 border border-emerald-200 text-emerald-800 rounded-2xl flex items-center space-x-2 text-xs font-semibold shadow-xs">
          <CheckCircle className="w-4 h-4 text-emerald-600" />
          <span>{feedback}</span>
        </div>
      )}

      {/* Top Bar */}
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4">
        <div>
          <h2 className="text-xl font-bold text-slate-900 font-display">Leave & Absence Management</h2>
          <p className="text-xs text-slate-500">Track leave quotas, holiday schedules, approval workflows & team calendar</p>
        </div>

        <button
          onClick={() => setShowApplyModal(true)}
          className="inline-flex items-center space-x-2 px-4 py-2.5 rounded-xl font-semibold text-xs text-white bg-brand-600 hover:bg-brand-500 shadow-md shadow-brand-600/20 transition self-start sm:self-auto"
        >
          <Plus className="w-4 h-4" />
          <span>Apply for Leave</span>
        </button>
      </div>

      {/* Leave Balance Cards */}
      <div className="grid grid-cols-2 sm:grid-cols-4 gap-4">
        <div className="bg-white p-5 rounded-2xl border border-slate-200/90 shadow-xs">
          <span className="text-xs font-semibold text-slate-500">Casual Leave (CL)</span>
          <div className="mt-2 flex items-baseline space-x-2">
            <h3 className="text-3xl font-extrabold text-brand-600 font-display">{balances.casual}</h3>
            <span className="text-xs text-slate-400">Days Available</span>
          </div>
          <p className="text-[11px] text-slate-400 mt-1">Quota: 12 days / year</p>
        </div>

        <div className="bg-white p-5 rounded-2xl border border-slate-200/90 shadow-xs">
          <span className="text-xs font-semibold text-slate-500">Sick Leave (SL)</span>
          <div className="mt-2 flex items-baseline space-x-2">
            <h3 className="text-3xl font-extrabold text-emerald-600 font-display">{balances.sick}</h3>
            <span className="text-xs text-slate-400">Days Available</span>
          </div>
          <p className="text-[11px] text-slate-400 mt-1">Quota: 10 days / year</p>
        </div>

        <div className="bg-white p-5 rounded-2xl border border-slate-200/90 shadow-xs">
          <span className="text-xs font-semibold text-slate-500">Earned / Privilege (EL)</span>
          <div className="mt-2 flex items-baseline space-x-2">
            <h3 className="text-3xl font-extrabold text-indigo-600 font-display">{balances.earned}</h3>
            <span className="text-xs text-slate-400">Days Available</span>
          </div>
          <p className="text-[11px] text-slate-400 mt-1">Encashable at exit</p>
        </div>

        <div className="bg-white p-5 rounded-2xl border border-slate-200/90 shadow-xs">
          <span className="text-xs font-semibold text-slate-500">Compensatory Off</span>
          <div className="mt-2 flex items-baseline space-x-2">
            <h3 className="text-3xl font-extrabold text-amber-600 font-display">{balances.compOff}</h3>
            <span className="text-xs text-slate-400">Days Available</span>
          </div>
          <p className="text-[11px] text-slate-400 mt-1">Earned via weekend work</p>
        </div>
      </div>

      {/* Main Section: Leave Applications Table & Holiday Calendar */}
      <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
        {/* Left 2 Cols: Leave Applications */}
        <div className="lg:col-span-2 bg-white rounded-2xl border border-slate-200/90 shadow-xs overflow-hidden">
          <div className="px-6 py-4 border-b border-slate-100 flex items-center justify-between">
            <h3 className="font-bold text-sm text-slate-900">Leave Requests & Approval Pipeline</h3>
            <span className="text-xs font-semibold text-slate-500">{leaves.length} Total Applications</span>
          </div>

          <div className="divide-y divide-slate-100">
            {leaves.map((l) => (
              <div key={l.id} className="p-4 sm:px-6 hover:bg-slate-50/70 transition flex flex-col sm:flex-row sm:items-center justify-between gap-3">
                <div>
                  <div className="flex items-center space-x-2">
                    <span className="font-bold text-xs text-slate-900">{l.employeeName}</span>
                    <span className="px-2 py-0.5 rounded text-[10px] font-bold uppercase bg-slate-100 text-slate-700">
                      {l.leaveType}
                    </span>
                    <span className={`px-2 py-0.5 rounded-full text-[10px] font-bold uppercase ${
                      l.status === 'Approved' ? 'bg-emerald-50 text-emerald-700' :
                      l.status === 'Pending' ? 'bg-amber-50 text-amber-700' :
                      'bg-rose-50 text-rose-700'
                    }`}>
                      {l.status}
                    </span>
                  </div>

                  <p className="text-xs text-slate-600 mt-1">
                    <strong>Duration:</strong> {l.startDate} to {l.endDate} ({l.totalDays} Day{l.totalDays > 1 ? 's' : ''})
                  </p>
                  <p className="text-xs text-slate-500 mt-0.5 italic">"{l.reason}"</p>
                  {l.approvalNotes && (
                    <p className="text-[11px] text-slate-400 mt-0.5">Admin Note: {l.approvalNotes}</p>
                  )}
                </div>

                {/* Manager / Admin action buttons */}
                {l.status === 'Pending' && currentUser.role !== 'employee' && (
                  <div className="flex items-center space-x-2 self-end sm:self-auto">
                    <button
                      onClick={() => handleApprove(l.id)}
                      className="px-3 py-1.5 rounded-lg text-xs font-semibold bg-emerald-600 hover:bg-emerald-500 text-white flex items-center space-x-1 shadow-xs transition"
                    >
                      <Check className="w-3.5 h-3.5" />
                      <span>Approve</span>
                    </button>
                    <button
                      onClick={() => handleReject(l.id)}
                      className="px-3 py-1.5 rounded-lg text-xs font-semibold bg-rose-50 hover:bg-rose-100 text-rose-700 border border-rose-200 flex items-center space-x-1 transition"
                    >
                      <X className="w-3.5 h-3.5" />
                      <span>Reject</span>
                    </button>
                  </div>
                )}
              </div>
            ))}
          </div>
        </div>

        {/* Right Col: Statutory Holiday Calendar */}
        <div className="bg-white rounded-2xl border border-slate-200/90 shadow-xs p-6">
          <div className="flex items-center justify-between mb-4">
            <h3 className="font-bold text-sm text-slate-900 flex items-center gap-2">
              <Calendar className="w-4 h-4 text-brand-600" />
              Statutory Holidays 2026-27
            </h3>
          </div>

          <div className="space-y-3">
            {holidays.map((h) => (
              <div key={h.id} className="p-3 bg-slate-50 rounded-xl border border-slate-100 flex items-center justify-between">
                <div>
                  <h4 className="text-xs font-bold text-slate-900">{h.name}</h4>
                  <p className="text-[11px] text-slate-500">{h.day} • {h.type}</p>
                </div>
                <div className="text-right">
                  <span className="font-mono text-xs font-bold text-brand-700 bg-brand-50 px-2.5 py-1 rounded-lg">
                    {h.date}
                  </span>
                </div>
              </div>
            ))}
          </div>
        </div>
      </div>

      {/* Apply Leave Modal */}
      {showApplyModal && (
        <div className="fixed inset-0 z-50 bg-black/60 backdrop-blur-xs flex items-center justify-center p-4">
          <div className="bg-white rounded-3xl max-w-md w-full p-6 shadow-2xl">
            <div className="flex justify-between items-center pb-3 border-b border-slate-100">
              <h3 className="font-bold text-sm text-slate-900">Apply for Leave</h3>
              <button onClick={() => setShowApplyModal(false)} className="text-slate-400 hover:text-slate-600">
                <X className="w-5 h-5" />
              </button>
            </div>

            <form onSubmit={handleApply} className="mt-4 space-y-3 text-xs">
              <div>
                <label className="block text-slate-700 font-semibold mb-1">Leave Type</label>
                <select
                  value={applyForm.leaveType}
                  onChange={e => setApplyForm({ ...applyForm, leaveType: e.target.value })}
                  className="w-full px-3 py-2 border rounded-xl focus:outline-none focus:border-brand-500"
                >
                  <option>Casual Leave</option>
                  <option>Sick Leave</option>
                  <option>Earned Leave</option>
                  <option>Comp-Off</option>
                  <option>Maternity / Paternity Leave</option>
                </select>
              </div>

              <div className="grid grid-cols-2 gap-3">
                <div>
                  <label className="block text-slate-700 font-semibold mb-1">Start Date</label>
                  <input
                    type="date"
                    required
                    value={applyForm.startDate}
                    onChange={e => setApplyForm({ ...applyForm, startDate: e.target.value })}
                    className="w-full px-3 py-2 border rounded-xl focus:outline-none focus:border-brand-500"
                  />
                </div>
                <div>
                  <label className="block text-slate-700 font-semibold mb-1">End Date</label>
                  <input
                    type="date"
                    required
                    value={applyForm.endDate}
                    onChange={e => setApplyForm({ ...applyForm, endDate: e.target.value })}
                    className="w-full px-3 py-2 border rounded-xl focus:outline-none focus:border-brand-500"
                  />
                </div>
              </div>

              <div>
                <label className="block text-slate-700 font-semibold mb-1">Total Days</label>
                <input
                  type="number"
                  min="0.5"
                  step="0.5"
                  required
                  value={applyForm.totalDays}
                  onChange={e => setApplyForm({ ...applyForm, totalDays: e.target.value })}
                  className="w-full px-3 py-2 border rounded-xl focus:outline-none focus:border-brand-500"
                />
              </div>

              <div>
                <label className="block text-slate-700 font-semibold mb-1">Reason for Leave</label>
                <textarea
                  rows={3}
                  required
                  placeholder="Provide brief context for the manager..."
                  value={applyForm.reason}
                  onChange={e => setApplyForm({ ...applyForm, reason: e.target.value })}
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
    </div>
  );
}
