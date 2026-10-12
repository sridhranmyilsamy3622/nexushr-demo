import React, { useState, useEffect } from 'react';
import { 
  Sparkles, CheckCircle, Clock, User, Laptop, 
  FileText, ShieldCheck, Mail, ArrowRight, Check, X
} from 'lucide-react';
import { api } from '../../services/api';
import { useAuth } from '../../context/AuthContext';

export default function OnboardingView() {
  const { triggerRefresh, refreshKey } = useAuth();
  const [onboardingList, setOnboardingList] = useState([]);
  const [toastMessage, setToastMessage] = useState('');

  useEffect(() => {
    api.getOnboarding().then(setOnboardingList).catch(console.error);
  }, [refreshKey]);

  const toggleTask = async (onboardingId, taskIdx, currentDone) => {
    await api.updateOnboardingTask(onboardingId, taskIdx, !currentDone);
    setToastMessage(`Updated onboarding checklist status.`);
    triggerRefresh();
    setTimeout(() => setToastMessage(''), 2500);
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

      {/* Header */}
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4">
        <div>
          <h2 className="text-xl font-bold text-slate-900 font-display">New Employee Onboarding Pipeline</h2>
          <p className="text-xs text-slate-500">Document collection, KYC verification, asset provisioning & Day 1 induction</p>
        </div>
        <span className="px-3 py-1.5 rounded-xl bg-brand-50 text-brand-700 text-xs font-bold border border-brand-200 self-start sm:self-auto">
          {onboardingList.length} Active Joinees in Pipeline
        </span>
      </div>

      {/* Pipeline Cards */}
      <div className="space-y-6">
        {onboardingList.map((onb) => (
          <div key={onb.id} className="bg-white rounded-3xl border border-slate-200/90 shadow-xs p-6 space-y-6">
            <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-3 pb-4 border-b border-slate-100">
              <div className="flex items-center space-x-3">
                <div className="w-12 h-12 rounded-2xl bg-brand-50 text-brand-600 font-bold flex items-center justify-center text-sm">
                  {onb.employeeName.split(' ').map(n => n[0]).join('')}
                </div>
                <div>
                  <h3 className="font-bold text-base text-slate-900 font-display">{onb.employeeName}</h3>
                  <p className="text-xs text-slate-500">{onb.designation} • {onb.department}</p>
                  <p className="text-[11px] text-slate-400 mt-0.5">Scheduled Joining Date: <strong className="text-slate-700">{onb.joiningDate}</strong></p>
                </div>
              </div>

              <div className="text-right">
                <div className="flex items-center space-x-2 justify-end mb-1">
                  <span className="text-xs text-slate-500 font-semibold">Onboarding Completion:</span>
                  <span className="text-sm font-extrabold text-brand-600">{onb.progress}%</span>
                </div>
                <div className="w-48 bg-slate-100 h-2 rounded-full overflow-hidden">
                  <div className="bg-brand-600 h-full rounded-full transition-all duration-300" style={{ width: `${onb.progress}%` }}></div>
                </div>
              </div>
            </div>

            {/* Checklist items */}
            <div>
              <h4 className="font-bold text-xs text-slate-800 uppercase tracking-wider mb-3">Pre-Boarding & Joining Checklist</h4>
              <div className="grid grid-cols-1 md:grid-cols-2 gap-3">
                {onb.checklist.map((item, idx) => (
                  <div
                    key={idx}
                    onClick={() => toggleTask(onb.id, idx, item.done)}
                    className={`p-3.5 rounded-xl border flex items-center justify-between cursor-pointer transition ${
                      item.done 
                        ? 'bg-emerald-50/50 border-emerald-200 text-emerald-950' 
                        : 'bg-slate-50 border-slate-200 text-slate-700 hover:bg-slate-100'
                    }`}
                  >
                    <div className="flex items-center space-x-3">
                      <div className={`w-5 h-5 rounded-md flex items-center justify-center transition ${
                        item.done ? 'bg-emerald-600 text-white' : 'border border-slate-300 bg-white'
                      }`}>
                        {item.done && <Check className="w-3.5 h-3.5" />}
                      </div>
                      <span className={`text-xs ${item.done ? 'line-through text-slate-500' : 'font-medium'}`}>
                        {item.task}
                      </span>
                    </div>

                    {item.date && (
                      <span className="text-[10px] text-slate-400 font-mono">{item.date}</span>
                    )}
                  </div>
                ))}
              </div>
            </div>

            {/* Assets Allocation Summary Box */}
            <div className="p-4 rounded-2xl bg-slate-50 border border-slate-200 flex flex-wrap items-center justify-between gap-4 text-xs">
              <div className="flex items-center space-x-3">
                <Laptop className="w-5 h-5 text-brand-600" />
                <div>
                  <p className="font-bold text-slate-800">Hardware Allocation: Apple MacBook Pro 16" M3 Max</p>
                  <p className="text-[11px] text-slate-500">Serial: APPL-M3-899120 | IT Asset Tag: BLR-LAP-401</p>
                </div>
              </div>

              <div className="flex items-center space-x-2">
                <span className="px-2.5 py-1 rounded-full bg-emerald-100 text-emerald-800 font-bold text-[10px] uppercase">
                  IT Provisioned
                </span>
                <span className="px-2.5 py-1 rounded-full bg-indigo-100 text-indigo-800 font-bold text-[10px] uppercase">
                  Buddy Assigned: Rohan Verma
                </span>
              </div>
            </div>
          </div>
        ))}
      </div>
    </div>
  );
}
