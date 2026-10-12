import React, { useState, useEffect } from 'react';
import { 
  Clock, MapPin, CheckCircle, AlertTriangle, 
  RotateCw, Calendar, Download, UserCheck, ShieldCheck,
  Building, Laptop, Filter, Check, X
} from 'lucide-react';
import { api } from '../../services/api';
import { useAuth } from '../../context/AuthContext';

export default function AttendanceView() {
  const { currentUser, triggerRefresh, refreshKey } = useAuth();
  const [logs, setLogs] = useState([]);
  const [loading, setLoading] = useState(true);
  const [mode, setMode] = useState('Office'); // Office or WFH
  const [isPunchedIn, setIsPunchedIn] = useState(true);
  const [regularizeModal, setRegularizeModal] = useState(false);
  const [regForm, setRegForm] = useState({ date: '2026-10-09', reason: 'System biometric glitch' });
  const [toastMessage, setToastMessage] = useState('');
  const [syncingBiometrics, setSyncingBiometrics] = useState(false);

  useEffect(() => {
    const employeeId = currentUser?.employeeId || 'NEX-001';

    api.getAttendance().then(data => {
      setLogs(data);
      const myRecord = [...data].reverse().find(d => d.employeeId === employeeId);

      if (myRecord && myRecord.punchIn && !myRecord.punchOut) {
        setIsPunchedIn(true);
      } else if (myRecord && myRecord.punchOut) {
        setIsPunchedIn(false);
      } else if (!myRecord) {
        setIsPunchedIn(false);
      }

      setLoading(false);
    }).catch((error) => {
      console.error('Attendance fetch failed:', error);
      setLoading(false);
    });
  }, [currentUser?.employeeId, refreshKey]);

  const handlePunch = async (type) => {
    try {
      const employeeId = currentUser?.employeeId || 'NEX-001';
      const res = await api.punchAttendance(employeeId, type, mode);

      if (!res?.success) {
        throw new Error(res?.message || 'Punch action failed');
      }

      setIsPunchedIn(type === 'in');
      setToastMessage(`Successfully punched ${type.toUpperCase()} (${mode} mode)`);
      triggerRefresh();
      setTimeout(() => setToastMessage(''), 3000);
    } catch (error) {
      console.error('Punch action failed:', error);
      setToastMessage('Punch action failed. Please try again.');
      setTimeout(() => setToastMessage(''), 3000);
    }
  };

  const handleSyncBiometric = async () => {
    setSyncingBiometrics(true);
    const res = await api.syncBiometrics();
    setSyncingBiometrics(false);
    setToastMessage(res.message);
    triggerRefresh();
    setTimeout(() => setToastMessage(''), 3000);
  };

  const handleRegularizeSubmit = async (e) => {
    e.preventDefault();
    await api.regularizeAttendance(currentUser.employeeId || 'NEX-001', regForm.date, regForm.reason);
    setRegularizeModal(false);
    setToastMessage("Attendance regularization request submitted for Manager sign-off");
    setTimeout(() => setToastMessage(''), 3000);
  };

  const presentCount = logs.filter(l => l.status === 'Present').length;
  const lateCount = logs.filter(l => l.status === 'Late').length;
  const leaveCount = logs.filter(l => l.status === 'On Leave').length;
  const wfhCount = logs.filter(l => l.mode === 'WFH').length;

  return (
    <div className="space-y-6">
      {/* Toast message */}
      {toastMessage && (
        <div className="p-4 bg-emerald-50 border border-emerald-200 text-emerald-800 rounded-2xl flex items-center space-x-2 text-xs font-semibold shadow-xs">
          <CheckCircle className="w-4 h-4 text-emerald-600" />
          <span>{toastMessage}</span>
        </div>
      )}

      {/* Top Header */}
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4">
        <div>
          <h2 className="text-xl font-bold text-slate-900 font-display">Attendance & Shifts Management</h2>
          <p className="text-xs text-slate-500">Live biometric synchronization, daily punch registers, overtime & shifts</p>
        </div>

        <div className="flex items-center space-x-2">
          <button
            onClick={() => setRegularizeModal(true)}
            className="px-3.5 py-2 rounded-xl text-xs font-semibold bg-white border border-slate-200 hover:bg-slate-50 text-slate-700 transition"
          >
            Regularize Attendance
          </button>
          <button
            onClick={handleSyncBiometric}
            disabled={syncingBiometrics}
            className="inline-flex items-center space-x-1.5 px-3.5 py-2 rounded-xl text-xs font-semibold bg-brand-600 hover:bg-brand-500 text-white shadow-xs transition"
          >
            <RotateCw className={`w-3.5 h-3.5 ${syncingBiometrics ? 'animate-spin' : ''}`} />
            <span>{syncingBiometrics ? 'Syncing...' : 'Sync Biometrics'}</span>
          </button>
        </div>
      </div>

      {/* Punch Clock Interactive Widget & Summary Cards */}
      <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
        {/* Left: Punch Clock Widget */}
        <div className="bg-gradient-to-br from-slate-900 via-indigo-950 to-slate-900 rounded-3xl p-6 text-white shadow-xl relative overflow-hidden flex flex-col justify-between">
          <div>
            <div className="flex items-center justify-between">
              <span className="text-xs font-bold uppercase tracking-wider text-brand-300 flex items-center gap-1.5">
                <Clock className="w-4 h-4" />
                Live Attendance Punch
              </span>
              <span className={`px-2 py-0.5 rounded-full text-[10px] font-bold uppercase ${
                isPunchedIn ? 'bg-emerald-500/20 text-emerald-300' : 'bg-slate-700 text-slate-300'
              }`}>
                {isPunchedIn ? 'Punched In' : 'Punched Out'}
              </span>
            </div>

            <div className="my-6 text-center">
              <p className="text-4xl font-extrabold font-mono tracking-tight text-white">
                {new Date().toLocaleTimeString('en-IN', { hour: '2-digit', minute: '2-digit' })}
              </p>
              <p className="text-xs text-slate-400 mt-1">
                {new Date().toLocaleDateString('en-IN', { weekday: 'long', year: 'numeric', month: 'short', day: 'numeric' })}
              </p>
            </div>

            {/* Mode Selector */}
            <div className="bg-slate-800/80 p-1 rounded-xl flex text-xs mb-4">
              <button
                onClick={() => setMode('Office')}
                className={`flex-1 py-1.5 rounded-lg font-semibold flex items-center justify-center space-x-1 transition ${
                  mode === 'Office' ? 'bg-brand-600 text-white' : 'text-slate-400 hover:text-white'
                }`}
              >
                <Building className="w-3.5 h-3.5" />
                <span>Office (Bengaluru)</span>
              </button>
              <button
                onClick={() => setMode('WFH')}
                className={`flex-1 py-1.5 rounded-lg font-semibold flex items-center justify-center space-x-1 transition ${
                  mode === 'WFH' ? 'bg-brand-600 text-white' : 'text-slate-400 hover:text-white'
                }`}
              >
                <Laptop className="w-3.5 h-3.5" />
                <span>WFH (Remote)</span>
              </button>
            </div>
          </div>

          <div className="space-y-2">
            {!isPunchedIn ? (
              <button
                onClick={() => handlePunch('in')}
                className="w-full py-3 rounded-xl font-bold text-white bg-emerald-600 hover:bg-emerald-500 shadow-lg shadow-emerald-600/30 transition text-xs flex items-center justify-center space-x-1.5"
              >
                <Clock className="w-4 h-4" />
                <span>Punch In Now</span>
              </button>
            ) : (
              <button
                onClick={() => handlePunch('out')}
                className="w-full py-3 rounded-xl font-bold text-white bg-rose-600 hover:bg-rose-500 shadow-lg shadow-rose-600/30 transition text-xs flex items-center justify-center space-x-1.5"
              >
                <Clock className="w-4 h-4" />
                <span>Punch Out for Today</span>
              </button>
            )}
            <p className="text-[10px] text-center text-slate-400 flex items-center justify-center gap-1">
              <MapPin className="w-3 h-3 text-brand-400" />
              <span>Geo-verified: Bengaluru HQ (12.9279° N, 77.6772° E)</span>
            </p>
          </div>
        </div>

        {/* Right 2 cols: Metrics Overview */}
        <div className="lg:col-span-2 grid grid-cols-2 gap-4">
          <div className="bg-white p-5 rounded-2xl border border-slate-200/90 shadow-xs flex flex-col justify-between">
            <span className="text-xs font-semibold text-slate-500">Present Today</span>
            <div className="my-2">
              <h3 className="text-3xl font-extrabold text-slate-900">{presentCount}</h3>
              <p className="text-[11px] text-slate-400">Standard Shift (9:00 AM - 6:00 PM)</p>
            </div>
            <div className="w-full bg-slate-100 h-1.5 rounded-full overflow-hidden">
              <div className="bg-emerald-500 h-full rounded-full" style={{ width: '85%' }}></div>
            </div>
          </div>

          <div className="bg-white p-5 rounded-2xl border border-slate-200/90 shadow-xs flex flex-col justify-between">
            <span className="text-xs font-semibold text-slate-500">Late Arrivals</span>
            <div className="my-2">
              <h3 className="text-3xl font-extrabold text-amber-600">{lateCount}</h3>
              <p className="text-[11px] text-slate-400">Punched in after 9:30 AM grace threshold</p>
            </div>
            <div className="w-full bg-slate-100 h-1.5 rounded-full overflow-hidden">
              <div className="bg-amber-500 h-full rounded-full" style={{ width: '15%' }}></div>
            </div>
          </div>

          <div className="bg-white p-5 rounded-2xl border border-slate-200/90 shadow-xs flex flex-col justify-between">
            <span className="text-xs font-semibold text-slate-500">Work From Home (WFH)</span>
            <div className="my-2">
              <h3 className="text-3xl font-extrabold text-indigo-600">{wfhCount}</h3>
              <p className="text-[11px] text-slate-400">Approved remote collaboration status</p>
            </div>
            <div className="w-full bg-slate-100 h-1.5 rounded-full overflow-hidden">
              <div className="bg-indigo-500 h-full rounded-full" style={{ width: '25%' }}></div>
            </div>
          </div>

          <div className="bg-white p-5 rounded-2xl border border-slate-200/90 shadow-xs flex flex-col justify-between">
            <span className="text-xs font-semibold text-slate-500">On Approved Leave</span>
            <div className="my-2">
              <h3 className="text-3xl font-extrabold text-slate-700">{leaveCount}</h3>
              <p className="text-[11px] text-slate-400">Casual / Sick / Earned leaves</p>
            </div>
            <div className="w-full bg-slate-100 h-1.5 rounded-full overflow-hidden">
              <div className="bg-slate-400 h-full rounded-full" style={{ width: '10%' }}></div>
            </div>
          </div>
        </div>
      </div>

      {/* Daily Attendance Logs Register Table */}
      <div className="bg-white rounded-2xl border border-slate-200/90 shadow-xs overflow-hidden">
        <div className="px-6 py-4 border-b border-slate-100 flex items-center justify-between">
          <div>
            <h3 className="font-bold text-sm text-slate-900">Today's Attendance Register</h3>
            <p className="text-xs text-slate-500">Live biometric & digital punch log for {new Date().toISOString().split('T')[0]}</p>
          </div>
          <span className="text-xs text-brand-600 font-semibold flex items-center gap-1">
            <ShieldCheck className="w-4 h-4 text-emerald-500" />
            Biometric Link Active
          </span>
        </div>

        <div className="overflow-x-auto">
          <table className="w-full text-left text-xs">
            <thead className="bg-slate-50 text-slate-500 font-semibold border-b border-slate-100 uppercase text-[10px] tracking-wider">
              <tr>
                <th className="px-6 py-3">Employee</th>
                <th className="px-6 py-3">Department</th>
                <th className="px-6 py-3">Punch In</th>
                <th className="px-6 py-3">Punch Out</th>
                <th className="px-6 py-3">Total Hours</th>
                <th className="px-6 py-3">Mode</th>
                <th className="px-6 py-3">Status</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-slate-100">
              {logs.map((record) => (
                <tr key={record.id} className="hover:bg-slate-50/80 transition">
                  <td className="px-6 py-3.5">
                    <div className="flex items-center space-x-3">
                      <img
                        src={record.avatar || "https://images.unsplash.com/photo-1535713875002-d1d0cf377fde?auto=format&fit=crop&w=100&h=100&q=80"}
                        alt={record.employeeName}
                        className="w-8 h-8 rounded-full object-cover"
                      />
                      <div>
                        <p className="font-bold text-slate-900">{record.employeeName}</p>
                        <p className="text-[11px] text-slate-400 font-mono">{record.employeeId}</p>
                      </div>
                    </div>
                  </td>
                  <td className="px-6 py-3.5 text-slate-600 font-medium">{record.department}</td>
                  <td className="px-6 py-3.5 font-mono font-semibold text-slate-800">{record.punchIn || '--:--'}</td>
                  <td className="px-6 py-3.5 font-mono text-slate-600">{record.punchOut || '--:--'}</td>
                  <td className="px-6 py-3.5 font-medium text-slate-700">{record.totalHours}</td>
                  <td className="px-6 py-3.5">
                    <span className="px-2 py-0.5 rounded text-[10px] font-semibold bg-slate-100 text-slate-700">
                      {record.mode}
                    </span>
                  </td>
                  <td className="px-6 py-3.5">
                    <span className={`px-2.5 py-0.5 rounded-full text-[10px] font-bold uppercase ${
                      record.status === 'Present' ? 'bg-emerald-50 text-emerald-700' :
                      record.status === 'Late' ? 'bg-amber-50 text-amber-700' :
                      'bg-slate-100 text-slate-700'
                    }`}>
                      {record.status}
                    </span>
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      </div>

      {/* Regularize Modal */}
      {regularizeModal && (
        <div className="fixed inset-0 z-50 bg-black/60 backdrop-blur-xs flex items-center justify-center p-4">
          <div className="bg-white rounded-3xl max-w-md w-full p-6 shadow-2xl">
            <div className="flex justify-between items-center pb-3 border-b border-slate-100">
              <h3 className="font-bold text-sm text-slate-900">Attendance Regularization Request</h3>
              <button onClick={() => setRegularizeModal(false)} className="text-slate-400 hover:text-slate-600">
                <X className="w-5 h-5" />
              </button>
            </div>

            <form onSubmit={handleRegularizeSubmit} className="mt-4 space-y-3 text-xs">
              <div>
                <label className="block text-slate-700 font-semibold mb-1">Date to Regularize</label>
                <input
                  type="date"
                  required
                  value={regForm.date}
                  onChange={e => setRegForm({ ...regForm, date: e.target.value })}
                  className="w-full px-3 py-2 border rounded-xl focus:outline-none focus:border-brand-500"
                />
              </div>

              <div>
                <label className="block text-slate-700 font-semibold mb-1">Reason for Missing Punch</label>
                <textarea
                  rows={3}
                  required
                  placeholder="e.g. Biometric machine fingerprint timeout, on client transit..."
                  value={regForm.reason}
                  onChange={e => setRegForm({ ...regForm, reason: e.target.value })}
                  className="w-full px-3 py-2 border rounded-xl focus:outline-none focus:border-brand-500"
                />
              </div>

              <button
                type="submit"
                className="w-full py-2.5 rounded-xl font-bold text-white bg-brand-600 hover:bg-brand-500 transition shadow-md shadow-brand-600/30"
              >
                Send Request to Manager
              </button>
            </form>
          </div>
        </div>
      )}
    </div>
  );
}
