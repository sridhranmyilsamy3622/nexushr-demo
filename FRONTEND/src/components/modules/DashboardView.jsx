import React, { useState, useEffect } from 'react';
import { 
  Users, UserPlus, Clock, Calendar, AlertCircle, 
  CheckCircle2, TrendingUp, Gift, Award, Sparkles,
  ArrowRight, FileSpreadsheet, Briefcase, Bell, Check, X
} from 'lucide-react';
import { api } from '../../services/api';
import { useAuth } from '../../context/AuthContext';

export default function DashboardView() {
  const { setActiveTab, triggerRefresh, refreshKey } = useAuth();
  const [stats, setStats] = useState(null);
  const [loading, setLoading] = useState(true);
  const [actionMessage, setActionMessage] = useState('');

  useEffect(() => {
    setLoading(true);
    api.getDashboardStats().then(data => {
      setStats(data);
      setLoading(false);
    }).catch(err => {
      console.error(err);
      setLoading(false);
    });
  }, [refreshKey]);

  const handleApprove = async (item) => {
    if (item.type === 'Leave') {
      await api.updateLeaveStatus(item.id, 'Approved', 'HR Admin', 'Approved via quick actions');
      setActionMessage(`Approved leave for ${item.title}`);
    } else if (item.type === 'Expense') {
      await api.updateExpenseStatus(item.id, 'Approved', 'HR Admin');
      setActionMessage(`Approved expense for ${item.title}`);
    }
    triggerRefresh();
    setTimeout(() => setActionMessage(''), 3000);
  };

  const handleReject = async (item) => {
    if (item.type === 'Leave') {
      await api.updateLeaveStatus(item.id, 'Rejected', 'HR Admin', 'Declined via quick actions');
      setActionMessage(`Declined leave for ${item.title}`);
    } else if (item.type === 'Expense') {
      await api.updateExpenseStatus(item.id, 'Rejected', 'HR Admin');
      setActionMessage(`Declined expense for ${item.title}`);
    }
    triggerRefresh();
    setTimeout(() => setActionMessage(''), 3000);
  };

  if (loading || !stats) {
    return (
      <div className="p-8 flex items-center justify-center">
        <div className="w-8 h-8 border-4 border-brand-500 border-t-transparent rounded-full animate-spin"></div>
      </div>
    );
  }

  return (
    <div className="space-y-6">
      {/* Top Banner & Quick Feedback Toast */}
      {actionMessage && (
        <div className="p-4 bg-emerald-50 border border-emerald-200 text-emerald-800 rounded-2xl flex items-center space-x-2 text-sm shadow-xs animate-fade-in">
          <CheckCircle2 className="w-5 h-5 text-emerald-600" />
          <span className="font-semibold">{actionMessage}</span>
        </div>
      )}

      {/* Welcome & Quick Action Bar */}
      <div className="bg-gradient-to-r from-brand-900 via-indigo-900 to-slate-900 rounded-3xl p-6 sm:p-8 text-white shadow-xl relative overflow-hidden">
        <div className="relative z-10 max-w-3xl">
          <span className="px-3 py-1 rounded-full bg-brand-500/30 border border-brand-400/40 text-brand-200 text-xs font-semibold uppercase tracking-wider inline-block mb-3">
            Enterprise Workforce Control
          </span>
          <h1 className="text-2xl sm:text-3xl font-extrabold font-display">
            Welcome to NexusHR Executive Dashboard
          </h1>
          <p className="mt-2 text-indigo-200 text-sm leading-relaxed">
            All enterprise systems operational. You have <strong className="text-white">{stats.pendingApprovals?.length || 0} pending items</strong> requiring your management review today.
          </p>

          {/* Quick Actions */}
          <div className="mt-6 flex flex-wrap gap-2.5">
            <button
              onClick={() => setActiveTab('employees')}
              className="px-4 py-2 rounded-xl text-xs font-bold bg-white text-slate-900 hover:bg-slate-100 shadow-md transition flex items-center space-x-1.5"
            >
              <UserPlus className="w-3.5 h-3.5 text-brand-600" />
              <span>Add Employee</span>
            </button>
            <button
              onClick={() => setActiveTab('payroll')}
              className="px-4 py-2 rounded-xl text-xs font-bold bg-brand-600 hover:bg-brand-500 text-white shadow-md transition flex items-center space-x-1.5"
            >
              <FileSpreadsheet className="w-3.5 h-3.5" />
              <span>Process Payroll</span>
            </button>
            <button
              onClick={() => setActiveTab('recruitment')}
              className="px-4 py-2 rounded-xl text-xs font-bold bg-indigo-800/80 hover:bg-indigo-700 text-white border border-indigo-600/50 transition flex items-center space-x-1.5"
            >
              <Briefcase className="w-3.5 h-3.5" />
              <span>Post New Job</span>
            </button>
            <button
              onClick={() => setActiveTab('announcements')}
              className="px-4 py-2 rounded-xl text-xs font-bold bg-slate-800 hover:bg-slate-700 text-slate-200 border border-slate-700 transition flex items-center space-x-1.5"
            >
              <Bell className="w-3.5 h-3.5" />
              <span>Broadcast News</span>
            </button>
          </div>
        </div>
      </div>

      {/* 5 Core Metric Stat Cards */}
      <div className="grid grid-cols-2 lg:grid-cols-5 gap-4">
        <div className="bg-white p-5 rounded-2xl border border-slate-200/90 shadow-xs">
          <div className="flex items-center justify-between">
            <span className="text-xs font-semibold text-slate-500">Total Headcount</span>
            <div className="w-8 h-8 rounded-lg bg-blue-50 text-blue-600 flex items-center justify-center">
              <Users className="w-4 h-4" />
            </div>
          </div>
          <div className="mt-3">
            <h3 className="text-2xl font-extrabold text-slate-900">{stats.totalEmployees}</h3>
            <p className="text-[11px] text-emerald-600 font-semibold mt-1 flex items-center gap-1">
              <TrendingUp className="w-3 h-3" />
              <span>100% active status</span>
            </p>
          </div>
        </div>

        <div className="bg-white p-5 rounded-2xl border border-slate-200/90 shadow-xs">
          <div className="flex items-center justify-between">
            <span className="text-xs font-semibold text-slate-500">Present Today</span>
            <div className="w-8 h-8 rounded-lg bg-emerald-50 text-emerald-600 flex items-center justify-center">
              <Clock className="w-4 h-4" />
            </div>
          </div>
          <div className="mt-3">
            <h3 className="text-2xl font-extrabold text-slate-900">{stats.presentToday}</h3>
            <p className="text-[11px] text-slate-500 font-medium mt-1">
              Rate: <strong className="text-slate-800">{stats.attendanceRate}%</strong>
            </p>
          </div>
        </div>

        <div className="bg-white p-5 rounded-2xl border border-slate-200/90 shadow-xs">
          <div className="flex items-center justify-between">
            <span className="text-xs font-semibold text-slate-500">On Leave Today</span>
            <div className="w-8 h-8 rounded-lg bg-amber-50 text-amber-600 flex items-center justify-center">
              <Calendar className="w-4 h-4" />
            </div>
          </div>
          <div className="mt-3">
            <h3 className="text-2xl font-extrabold text-slate-900">{stats.onLeaveToday}</h3>
            <p className="text-[11px] text-amber-600 font-medium mt-1">
              Approved leaves
            </p>
          </div>
        </div>

        <div className="bg-white p-5 rounded-2xl border border-slate-200/90 shadow-xs">
          <div className="flex items-center justify-between">
            <span className="text-xs font-semibold text-slate-500">Pending Approvals</span>
            <div className="w-8 h-8 rounded-lg bg-rose-50 text-rose-600 flex items-center justify-center">
              <AlertCircle className="w-4 h-4" />
            </div>
          </div>
          <div className="mt-3">
            <h3 className="text-2xl font-extrabold text-rose-600">{stats.pendingLeaves + stats.pendingExpenses}</h3>
            <p className="text-[11px] text-slate-500 font-medium mt-1">
              {stats.pendingLeaves} leaves, {stats.pendingExpenses} expenses
            </p>
          </div>
        </div>

        <div className="bg-white p-5 rounded-2xl border border-slate-200/90 shadow-xs col-span-2 lg:col-span-1">
          <div className="flex items-center justify-between">
            <span className="text-xs font-semibold text-slate-500">Open Jobs (ATS)</span>
            <div className="w-8 h-8 rounded-lg bg-purple-50 text-purple-600 flex items-center justify-center">
              <Briefcase className="w-4 h-4" />
            </div>
          </div>
          <div className="mt-3">
            <h3 className="text-2xl font-extrabold text-purple-600">{stats.openJobs}</h3>
            <p className="text-[11px] text-slate-500 font-medium mt-1">
              Active openings
            </p>
          </div>
        </div>
      </div>

      {/* Main Grid: Approvals Queue & Announcements / Holidays */}
      <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
        {/* Left 2 Cols: Pending Approvals & Attendance Summary */}
        <div className="lg:col-span-2 space-y-6">
          {/* Pending Approvals Table */}
          <div className="bg-white rounded-2xl border border-slate-200/90 shadow-xs overflow-hidden">
            <div className="px-6 py-4 border-b border-slate-100 flex items-center justify-between">
              <div>
                <h3 className="font-bold text-slate-900 text-sm">Pending Management Approvals</h3>
                <p className="text-xs text-slate-500">Review leave and expense requests needing manager sign-off</p>
              </div>
              <span className="px-2.5 py-1 rounded-full text-xs font-bold bg-amber-50 text-amber-700">
                {stats.pendingApprovals?.length || 0} Awaiting
              </span>
            </div>

            <div className="divide-y divide-slate-100">
              {stats.pendingApprovals?.length === 0 ? (
                <div className="p-8 text-center text-slate-400 text-xs">
                  <CheckCircle2 className="w-8 h-8 mx-auto mb-2 text-emerald-500" />
                  All caught up! No pending approvals currently.
                </div>
              ) : (
                stats.pendingApprovals?.map((item) => (
                  <div key={item.id} className="p-4 sm:px-6 flex items-center justify-between hover:bg-slate-50 transition">
                    <div className="flex items-center space-x-3">
                      <span className={`px-2 py-0.5 rounded text-[10px] font-bold uppercase ${
                        item.type === 'Leave' ? 'bg-indigo-50 text-indigo-700' : 'bg-emerald-50 text-emerald-700'
                      }`}>
                        {item.type}
                      </span>
                      <div>
                        <p className="text-xs font-bold text-slate-900">{item.title}</p>
                        <p className="text-[11px] text-slate-400">Date: {item.date}</p>
                      </div>
                    </div>
                    <div className="flex items-center space-x-2">
                      <button
                        onClick={() => handleApprove(item)}
                        className="p-1.5 rounded-lg bg-emerald-50 text-emerald-700 hover:bg-emerald-100 transition"
                        title="Approve"
                      >
                        <Check className="w-4 h-4" />
                      </button>
                      <button
                        onClick={() => handleReject(item)}
                        className="p-1.5 rounded-lg bg-rose-50 text-rose-700 hover:bg-rose-100 transition"
                        title="Reject"
                      >
                        <X className="w-4 h-4" />
                      </button>
                    </div>
                  </div>
                ))
              )}
            </div>
          </div>

          {/* Company Announcements Bulletin */}
          <div className="bg-white rounded-2xl border border-slate-200/90 shadow-xs p-6">
            <div className="flex items-center justify-between mb-4">
              <h3 className="font-bold text-slate-900 text-sm flex items-center gap-2">
                <Bell className="w-4 h-4 text-brand-600" />
                Latest Company Announcements
              </h3>
              <button
                onClick={() => setActiveTab('announcements')}
                className="text-xs text-brand-600 font-semibold hover:text-brand-700"
              >
                View all →
              </button>
            </div>

            <div className="space-y-3">
              {stats.recentAnnouncements?.map((anc) => (
                <div key={anc.id} className="p-3.5 bg-slate-50 rounded-xl border border-slate-200/80">
                  <div className="flex items-center justify-between">
                    <span className="text-[10px] font-bold uppercase tracking-wider text-brand-700 bg-brand-50 px-2 py-0.5 rounded">
                      {anc.category}
                    </span>
                    <span className="text-[10px] text-slate-400">{anc.date}</span>
                  </div>
                  <h4 className="text-xs font-bold text-slate-900 mt-1.5">{anc.title}</h4>
                  <p className="text-xs text-slate-600 mt-1 line-clamp-2">{anc.content}</p>
                </div>
              ))}
            </div>
          </div>
        </div>

        {/* Right Col: Celebrations & Holidays & Company Info */}
        <div className="space-y-6">
          {/* Upcoming Birthdays & Work Anniversaries */}
          <div className="bg-white rounded-2xl border border-slate-200/90 shadow-xs p-6">
            <h3 className="font-bold text-slate-900 text-sm flex items-center gap-2 mb-4">
              <Gift className="w-4 h-4 text-rose-500" />
              Celebrations & Milestones
            </h3>
            
            <div className="space-y-3 text-xs">
              <div className="p-3 rounded-xl bg-rose-50/60 border border-rose-100 flex items-center space-x-3">
                <div className="w-9 h-9 rounded-full bg-rose-200 flex items-center justify-center text-rose-700 font-bold">
                  KS
                </div>
                <div className="flex-1">
                  <p className="font-bold text-slate-900">Karthik Subramanian</p>
                  <p className="text-[11px] text-rose-700 font-semibold">Birthday on December 18th 🎂</p>
                </div>
              </div>

              <div className="p-3 rounded-xl bg-purple-50/60 border border-purple-100 flex items-center space-x-3">
                <div className="w-9 h-9 rounded-full bg-purple-200 flex items-center justify-center text-purple-700 font-bold">
                  AS
                </div>
                <div className="flex-1">
                  <p className="font-bold text-slate-900">Aarav Sharma</p>
                  <p className="text-[11px] text-purple-700 font-semibold">5-Year Work Anniversary 🏆</p>
                </div>
              </div>
            </div>
          </div>

          {/* Upcoming Holidays */}
          <div className="bg-white rounded-2xl border border-slate-200/90 shadow-xs p-6">
            <h3 className="font-bold text-slate-900 text-sm flex items-center gap-2 mb-4">
              <Calendar className="w-4 h-4 text-emerald-600" />
              Upcoming Statutory Holidays
            </h3>

            <div className="space-y-3">
              {stats.upcomingHolidays?.map((h) => (
                <div key={h.id} className="flex items-center justify-between p-2.5 rounded-xl hover:bg-slate-50 transition">
                  <div>
                    <p className="text-xs font-bold text-slate-900">{h.name}</p>
                    <p className="text-[11px] text-slate-400">{h.day} • {h.type}</p>
                  </div>
                  <span className="px-2 py-1 rounded bg-slate-100 text-slate-700 text-xs font-mono font-semibold">
                    {h.date.substring(5)}
                  </span>
                </div>
              ))}
            </div>
          </div>

          {/* Statutory Registration Box */}
          <div className="bg-slate-900 text-slate-300 rounded-2xl p-5 text-xs space-y-2 border border-slate-800">
            <div className="font-bold text-white text-sm">Entity Statutory Profile</div>
            <p className="text-slate-400 text-[11px]">{stats.company?.name}</p>
            <div className="pt-2 border-t border-slate-800 space-y-1 font-mono text-[11px]">
              <div className="flex justify-between">
                <span className="text-slate-400">GSTIN:</span>
                <span className="text-white">{stats.company?.taxId}</span>
              </div>
              <div className="flex justify-between">
                <span className="text-slate-400">PF Code:</span>
                <span className="text-white">{stats.company?.pfCode}</span>
              </div>
              <div className="flex justify-between">
                <span className="text-slate-400">Pay Cycle:</span>
                <span className="text-brand-400">{stats.company?.payCycleDay}th of each month</span>
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}
