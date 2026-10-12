import React, { useState, useEffect } from 'react';
import { 
  Settings, ShieldCheck, Key, Network, Activity, 
  CheckCircle, RefreshCw, Smartphone, Building, 
  Lock, AlertTriangle, Fingerprint, MessageSquare, Landmark,
  FileSpreadsheet, Calendar, Share2
} from 'lucide-react';
import { api } from '../../services/api';
import { useAuth } from '../../context/AuthContext';

export default function SettingsView() {
  const { is2FAEnabled, setIs2FAEnabled, triggerRefresh, refreshKey } = useAuth();
  const [activeTab, setActiveTab] = useState('company'); // company, security, integrations, audit
  const [settings, setSettings] = useState(null);
  const [auditLogs, setAuditLogs] = useState([]);
  const [integrations, setIntegrations] = useState([]);
  const [toastMessage, setToastMessage] = useState('');
  const [testResult, setTestResult] = useState('');

  useEffect(() => {
    api.getSettings().then(res => setSettings(res.company)).catch(console.error);
    api.getAuditLogs().then(setAuditLogs).catch(console.error);
    api.getIntegrations().then(setIntegrations).catch(console.error);
  }, [refreshKey]);

  const handleSaveCompany = async (e) => {
    e.preventDefault();
    await api.updateSettings(settings);
    setToastMessage("Corporate settings & statutory configurations saved successfully!");
    triggerRefresh();
    setTimeout(() => setToastMessage(''), 3000);
  };

  const handleTestIntegration = async (id, name) => {
    const res = await api.testIntegration(id);
    setTestResult(`${name}: ${res.message}`);
    setTimeout(() => setTestResult(''), 4000);
  };

  const getIntegrationIcon = (iconName) => {
    switch (iconName) {
      case 'Fingerprint': return <Fingerprint className="w-5 h-5 text-brand-600" />;
      case 'MessageSquare': return <MessageSquare className="w-5 h-5 text-emerald-600" />;
      case 'Landmark': return <Landmark className="w-5 h-5 text-indigo-600" />;
      case 'FileSpreadsheet': return <FileSpreadsheet className="w-5 h-5 text-amber-600" />;
      case 'Calendar': return <Calendar className="w-5 h-5 text-rose-600" />;
      default: return <Share2 className="w-5 h-5 text-slate-600" />;
    }
  };

  return (
    <div className="space-y-6">
      {/* Toast */}
      {toastMessage && (
        <div className="p-4 bg-emerald-50 border border-emerald-200 text-emerald-800 rounded-2xl flex items-center space-x-2 text-xs font-semibold shadow-xs">
          <CheckCircle className="w-4 h-4 text-emerald-600" />
          <span>{toastMessage}</span>
        </div>
      )}

      {/* Top Header */}
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4">
        <div>
          <h2 className="text-xl font-bold text-slate-900 font-display">HR Administration & System Settings</h2>
          <p className="text-xs text-slate-500">Corporate statutory profiles, two-factor authentication, third-party connectors & audit logs</p>
        </div>
      </div>

      {/* Navigation Sub-Tabs */}
      <div className="bg-white p-2 rounded-2xl border border-slate-200/90 shadow-xs flex items-center space-x-2 overflow-x-auto text-xs font-semibold">
        {[
          { id: 'company', label: 'Company Profile & Rules', icon: Building },
          { id: 'security', label: 'Security & 2FA (RBAC)', icon: Lock },
          { id: 'integrations', label: 'Integrations Hub', icon: Network },
          { id: 'audit', label: 'Audit Logs & Security Trail', icon: Activity }
        ].map(t => {
          const Icon = t.icon;
          return (
            <button
              key={t.id}
              onClick={() => setActiveTab(t.id)}
              className={`flex items-center space-x-1.5 px-3.5 py-2 rounded-xl whitespace-nowrap transition ${
                activeTab === t.id ? 'bg-brand-600 text-white shadow-xs' : 'text-slate-600 hover:bg-slate-50'
              }`}
            >
              <Icon className="w-3.5 h-3.5" />
              <span>{t.label}</span>
            </button>
          );
        })}
      </div>

      {/* 1. Company Profile & Statutory Rules */}
      {activeTab === 'company' && settings && (
        <div className="bg-white rounded-3xl border border-slate-200/90 shadow-xs p-6">
          <h3 className="font-bold text-sm text-slate-900 mb-4 pb-2 border-b border-slate-100">
            Registered Entity Information & Statutory Parameters
          </h3>

          <form onSubmit={handleSaveCompany} className="space-y-4 text-xs">
            <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
              <div>
                <label className="block text-slate-700 font-semibold mb-1">Company Legal Name</label>
                <input
                  type="text"
                  value={settings.name}
                  onChange={e => setSettings({ ...settings, name: e.target.value })}
                  className="w-full px-3 py-2 border rounded-xl focus:outline-none focus:border-brand-500"
                />
              </div>

              <div>
                <label className="block text-slate-700 font-semibold mb-1">Corporate Tax ID / GSTIN</label>
                <input
                  type="text"
                  value={settings.taxId}
                  onChange={e => setSettings({ ...settings, taxId: e.target.value })}
                  className="w-full px-3 py-2 border rounded-xl font-mono focus:outline-none focus:border-brand-500"
                />
              </div>

              <div>
                <label className="block text-slate-700 font-semibold mb-1">Company Identification Number (CIN)</label>
                <input
                  type="text"
                  value={settings.cin}
                  onChange={e => setSettings({ ...settings, cin: e.target.value })}
                  className="w-full px-3 py-2 border rounded-xl font-mono focus:outline-none focus:border-brand-500"
                />
              </div>

              <div>
                <label className="block text-slate-700 font-semibold mb-1">EPF Employer Code</label>
                <input
                  type="text"
                  value={settings.pfCode}
                  onChange={e => setSettings({ ...settings, pfCode: e.target.value })}
                  className="w-full px-3 py-2 border rounded-xl font-mono focus:outline-none focus:border-brand-500"
                />
              </div>

              <div>
                <label className="block text-slate-700 font-semibold mb-1">ESIC Regional Code</label>
                <input
                  type="text"
                  value={settings.esiCode}
                  onChange={e => setSettings({ ...settings, esiCode: e.target.value })}
                  className="w-full px-3 py-2 border rounded-xl font-mono focus:outline-none focus:border-brand-500"
                />
              </div>

              <div>
                <label className="block text-slate-700 font-semibold mb-1">Monthly Pay Cycle Cutoff Day</label>
                <input
                  type="number"
                  min="1"
                  max="31"
                  value={settings.payCycleDay}
                  onChange={e => setSettings({ ...settings, payCycleDay: Number(e.target.value) })}
                  className="w-full px-3 py-2 border rounded-xl focus:outline-none focus:border-brand-500"
                />
              </div>
            </div>

            <div>
              <label className="block text-slate-700 font-semibold mb-1">Registered Corporate Address</label>
              <textarea
                rows={2}
                value={settings.address}
                onChange={e => setSettings({ ...settings, address: e.target.value })}
                className="w-full px-3 py-2 border rounded-xl focus:outline-none focus:border-brand-500"
              />
            </div>

            <button
              type="submit"
              className="py-2.5 px-6 rounded-xl font-bold text-white bg-brand-600 hover:bg-brand-500 transition shadow-md shadow-brand-600/30"
            >
              Save Configuration Changes
            </button>
          </form>
        </div>
      )}

      {/* 2. Security, 2FA & Role-Based Access Control (RBAC) */}
      {activeTab === 'security' && (
        <div className="space-y-6">
          {/* Two-Factor Authentication Box */}
          <div className="bg-white rounded-3xl border border-slate-200/90 shadow-xs p-6">
            <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4">
              <div className="flex items-center space-x-3">
                <div className="w-12 h-12 rounded-2xl bg-indigo-50 text-indigo-600 flex items-center justify-center">
                  <Smartphone className="w-6 h-6" />
                </div>
                <div>
                  <h4 className="font-bold text-sm text-slate-900">Two-Factor Authentication (2FA)</h4>
                  <p className="text-xs text-slate-500">Require an authenticator TOTP token or SMS passcode for portal sign-in</p>
                </div>
              </div>

              <button
                onClick={() => {
                  setIs2FAEnabled(!is2FAEnabled);
                  setToastMessage(is2FAEnabled ? "2FA has been disabled." : "2FA activated successfully!");
                  setTimeout(() => setToastMessage(''), 2500);
                }}
                className={`px-4 py-2 rounded-xl text-xs font-bold transition ${
                  is2FAEnabled ? 'bg-emerald-600 text-white' : 'bg-slate-100 text-slate-700 hover:bg-slate-200'
                }`}
              >
                {is2FAEnabled ? '2FA Enabled ✓' : 'Enable 2FA Now'}
              </button>
            </div>
          </div>

          {/* RBAC Permissions Matrix */}
          <div className="bg-white rounded-3xl border border-slate-200/90 shadow-xs p-6 space-y-4">
            <div className="flex items-center justify-between pb-3 border-b border-slate-100">
              <h3 className="font-bold text-sm text-slate-900">Role-Based Access Control (RBAC) Matrix</h3>
              <span className="text-xs text-slate-400">Strict Least-Privilege Governance</span>
            </div>

            <div className="overflow-x-auto text-xs">
              <table className="w-full text-left">
                <thead className="bg-slate-50 text-slate-500 font-semibold border-b text-[10px] uppercase">
                  <tr>
                    <th className="px-4 py-3">Module</th>
                    <th className="px-4 py-3">HR Administrator</th>
                    <th className="px-4 py-3">Department Manager</th>
                    <th className="px-4 py-3">Employee (ESS)</th>
                  </tr>
                </thead>
                <tbody className="divide-y divide-slate-100">
                  {[
                    { m: "Employee Directory & Salary", admin: "Full Access & Edit", mgr: "Team View Only", emp: "Self View Only" },
                    { m: "Attendance & Shifts", admin: "Approve & Manage All", mgr: "Approve Team Punches", emp: "Clock In & Regularize" },
                    { m: "Leave Approvals", admin: "Full Approval Authority", mgr: "Department Approval", emp: "Apply & View Balance" },
                    { m: "Payroll & Bank Sheets", admin: "Run & Disburse All", mgr: "No Access", emp: "Download Own Slips" },
                    { m: "Recruitment ATS", admin: "Full Pipeline Control", mgr: "Interview Feedback", emp: "View Job Openings" },
                    { m: "Offboarding & FnF", admin: "Clearance & Settlement", mgr: "Exit KT Sign-off", emp: "Submit Resignation" }
                  ].map((row, idx) => (
                    <tr key={idx} className="hover:bg-slate-50/60">
                      <td className="px-4 py-3 font-bold text-slate-900">{row.m}</td>
                      <td className="px-4 py-3 text-brand-700 font-semibold">{row.admin}</td>
                      <td className="px-4 py-3 text-emerald-700 font-semibold">{row.mgr}</td>
                      <td className="px-4 py-3 text-slate-600">{row.emp}</td>
                    </tr>
                  ))}
                </tbody>
              </table>
            </div>
          </div>
        </div>
      )}

      {/* 3. Integrations Hub */}
      {activeTab === 'integrations' && (
        <div className="space-y-4">
          {testResult && (
            <div className="p-4 bg-indigo-50 border border-indigo-200 text-indigo-900 rounded-2xl text-xs font-semibold flex items-center space-x-2">
              <CheckCircle className="w-4 h-4 text-brand-600" />
              <span>{testResult}</span>
            </div>
          )}

          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
            {integrations.map((conn) => (
              <div key={conn.id} className="bg-white rounded-3xl border border-slate-200/90 shadow-xs p-5 flex flex-col justify-between space-y-4">
                <div>
                  <div className="flex items-center justify-between">
                    <div className="w-10 h-10 rounded-xl bg-slate-50 border border-slate-100 flex items-center justify-center">
                      {getIntegrationIcon(conn.icon)}
                    </div>
                    <span className="px-2 py-0.5 rounded-full text-[10px] font-bold uppercase bg-emerald-50 text-emerald-700">
                      {conn.status}
                    </span>
                  </div>

                  <h4 className="font-bold text-xs text-slate-900 mt-3">{conn.name}</h4>
                  <p className="text-[11px] text-slate-500 mt-0.5">Category: {conn.category}</p>
                  <p className="text-[10px] text-slate-400 mt-1">Last Synced: {conn.lastSync}</p>
                </div>

                <button
                  onClick={() => handleTestIntegration(conn.id, conn.name)}
                  className="w-full py-2 rounded-xl text-xs font-bold border border-slate-200 hover:bg-slate-50 transition text-slate-700"
                >
                  Test Connection
                </button>
              </div>
            ))}
          </div>
        </div>
      )}

      {/* 4. Forensic Audit Logs */}
      {activeTab === 'audit' && (
        <div className="bg-white rounded-3xl border border-slate-200/90 shadow-xs overflow-hidden">
          <div className="px-6 py-4 border-b border-slate-100 flex items-center justify-between">
            <h3 className="font-bold text-sm text-slate-900">Tamper-Proof Forensic Audit Trail</h3>
            <span className="text-xs text-slate-500">{auditLogs.length} Events Logged</span>
          </div>

          <div className="overflow-x-auto text-xs">
            <table className="w-full text-left">
              <thead className="bg-slate-50 text-slate-500 font-semibold border-b text-[10px] uppercase">
                <tr>
                  <th className="px-6 py-3">Timestamp</th>
                  <th className="px-6 py-3">User & Persona</th>
                  <th className="px-6 py-3">Action Description</th>
                  <th className="px-6 py-3">Module</th>
                  <th className="px-6 py-3">IP Address</th>
                </tr>
              </thead>
              <tbody className="divide-y divide-slate-100">
                {auditLogs.map((log) => (
                  <tr key={log.id} className="hover:bg-slate-50/70">
                    <td className="px-6 py-3 font-mono text-slate-500 text-[11px]">{log.timestamp}</td>
                    <td className="px-6 py-3 font-bold text-slate-800">{log.user}</td>
                    <td className="px-6 py-3 text-slate-700">{log.action}</td>
                    <td className="px-6 py-3">
                      <span className="px-2 py-0.5 rounded bg-slate-100 text-slate-700 text-[10px] font-semibold">
                        {log.module}
                      </span>
                    </td>
                    <td className="px-6 py-3 font-mono text-slate-400 text-[11px]">{log.ip}</td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        </div>
      )}
    </div>
  );
}
