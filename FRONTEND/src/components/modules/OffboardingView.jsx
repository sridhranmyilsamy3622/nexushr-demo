import React, { useState, useEffect } from 'react';
import { 
  UserMinus, FileText, CheckCircle, Clock, Award, 
  Download, Plus, X, Laptop, ShieldAlert, Check
} from 'lucide-react';
import { api } from '../../services/api';
import { useAuth } from '../../context/AuthContext';

export default function OffboardingView() {
  const { currentUser, triggerRefresh, refreshKey } = useAuth();
  const [offboardingList, setOffboardingList] = useState([]);
  const [showResignModal, setShowResignModal] = useState(false);
  const [showRelievingModal, setShowRelievingModal] = useState(null);
  const [resignForm, setResignForm] = useState({ reason: '', proposedLastDate: '2026-12-15' });
  const [toastMessage, setToastMessage] = useState('');

  useEffect(() => {
    api.getOffboarding().then(setOffboardingList).catch(console.error);
  }, [refreshKey]);

  const handleResign = async (e) => {
    e.preventDefault();
    await api.submitResignation({
      ...resignForm,
      employeeId: currentUser.employeeId || 'NEX-003'
    });
    setShowResignModal(false);
    setToastMessage("Resignation letter logged and notice period initialized.");
    triggerRefresh();
    setTimeout(() => setToastMessage(''), 3000);
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
          <h2 className="text-xl font-bold text-slate-900 font-display">Offboarding & Exit Lifecycle Management</h2>
          <p className="text-xs text-slate-500">Resignation workflows, notice period tracking, FnF settlement & relieving certificates</p>
        </div>

        <button
          onClick={() => setShowResignModal(true)}
          className="inline-flex items-center space-x-2 px-4 py-2.5 rounded-xl font-semibold text-xs text-white bg-slate-800 hover:bg-slate-700 shadow-xs transition self-start sm:self-auto"
        >
          <UserMinus className="w-4 h-4" />
          <span>Submit Resignation</span>
        </button>
      </div>

      {/* Offboarding Cases */}
      <div className="space-y-6">
        {offboardingList.map((off) => (
          <div key={off.id} className="bg-white rounded-3xl border border-slate-200/90 shadow-xs p-6 space-y-6">
            <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4 pb-4 border-b border-slate-100">
              <div className="flex items-center space-x-3">
                <div className="w-12 h-12 rounded-2xl bg-rose-50 text-rose-600 font-bold flex items-center justify-center text-sm">
                  {off.employeeName.split(' ').map(n => n[0]).join('')}
                </div>
                <div>
                  <h3 className="font-bold text-base text-slate-900 font-display">{off.employeeName}</h3>
                  <p className="text-xs text-slate-500">{off.designation} • {off.department}</p>
                  <p className="text-[11px] text-slate-400 mt-0.5">
                    Resigned on: <strong>{off.resignationDate}</strong> | Proposed LWD: <strong className="text-rose-700">{off.lastWorkingDay}</strong>
                  </p>
                </div>
              </div>

              <div className="text-right">
                <span className="px-3 py-1 rounded-full bg-amber-50 border border-amber-200 text-amber-800 font-bold text-xs">
                  {off.status} ({off.noticePeriodDays} Days Notice)
                </span>
              </div>
            </div>

            {/* Clearance Checklist */}
            <div>
              <h4 className="font-bold text-xs text-slate-800 uppercase tracking-wider mb-3">Multi-Department Clearance Checklist</h4>
              <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-3 text-xs">
                <div className="p-3 bg-slate-50 rounded-xl border border-slate-200">
                  <span className="font-bold text-slate-700 block text-[11px]">IT Asset Return</span>
                  <p className="text-slate-500 mt-1">{off.clearance?.itAssetReturn}</p>
                </div>
                <div className="p-3 bg-emerald-50/60 rounded-xl border border-emerald-200">
                  <span className="font-bold text-emerald-800 block text-[11px]">Finance & Travel Advances</span>
                  <p className="text-emerald-700 mt-1">{off.clearance?.financeClearance}</p>
                </div>
                <div className="p-3 bg-slate-50 rounded-xl border border-slate-200">
                  <span className="font-bold text-slate-700 block text-[11px]">Knowledge Transfer (KT)</span>
                  <p className="text-slate-500 mt-1">{off.clearance?.hrHandover}</p>
                </div>
                <div className="p-3 bg-slate-50 rounded-xl border border-slate-200">
                  <span className="font-bold text-slate-700 block text-[11px]">Admin Access & ID Badge</span>
                  <p className="text-slate-500 mt-1">{off.clearance?.adminBadgeReturn}</p>
                </div>
              </div>
            </div>

            {/* FnF Settlement Calculation */}
            <div className="p-5 bg-slate-50 rounded-2xl border border-slate-200 flex flex-col md:flex-row md:items-center justify-between gap-4 text-xs">
              <div>
                <span className="text-[10px] font-bold uppercase tracking-wider text-slate-500">Full & Final (FnF) Settlement Statement</span>
                <div className="mt-2 flex flex-wrap gap-4 text-slate-700">
                  <span>Pending Salary: <strong>₹{off.finalSettlement?.pendingSalary?.toLocaleString('en-IN')}</strong></span>
                  <span>Leave Encashment: <strong>₹{off.finalSettlement?.leaveEncashment?.toLocaleString('en-IN')}</strong></span>
                  <span>Statutory Gratuity: <strong>₹{off.finalSettlement?.gratuity?.toLocaleString('en-IN')}</strong></span>
                </div>
              </div>

              <div className="flex items-center space-x-3 self-end md:self-auto">
                <div className="text-right">
                  <span className="text-[10px] text-slate-400 block uppercase">Net FnF Payable:</span>
                  <span className="text-lg font-extrabold text-emerald-600 font-display">
                    ₹{off.finalSettlement?.netPayable?.toLocaleString('en-IN')}
                  </span>
                </div>
                <button
                  onClick={() => setShowRelievingModal(off)}
                  className="px-3 py-2 rounded-xl bg-brand-600 hover:bg-brand-500 text-white font-bold transition flex items-center space-x-1"
                >
                  <Award className="w-3.5 h-3.5" />
                  <span>Generate Letters</span>
                </button>
              </div>
            </div>
          </div>
        ))}
      </div>

      {/* Relieving Letter Preview Modal */}
      {showRelievingModal && (
        <div className="fixed inset-0 z-50 bg-black/70 backdrop-blur-xs flex items-center justify-center p-4">
          <div className="bg-white rounded-3xl max-w-xl w-full p-8 shadow-2xl relative">
            <button onClick={() => setShowRelievingModal(null)} className="absolute top-5 right-5 text-slate-400 hover:text-slate-600 no-print">
              <X className="w-5 h-5" />
            </button>

            <div className="text-center pb-4 border-b border-slate-200">
              <h3 className="font-extrabold text-base text-slate-900 font-display">Nexus Enterprise Technologies Pvt. Ltd.</h3>
              <p className="text-[11px] text-slate-400">Outer Ring Road, Bellandur, Bengaluru - 560103</p>
              <h4 className="font-bold text-sm text-slate-800 uppercase tracking-wider mt-3">Relieving & Experience Certificate</h4>
            </div>

            <div className="py-4 space-y-3 text-xs text-slate-700 leading-relaxed">
              <p>Date: October 10, 2026</p>
              <p><strong>TO WHOMSOEVER IT MAY CONCERN</strong></p>
              <p>
                This is to certify that <strong>{showRelievingModal.employeeName}</strong> was employed with Nexus Enterprise Technologies Pvt. Ltd. as <strong>{showRelievingModal.designation}</strong> in the {showRelievingModal.department} department.
              </p>
              <p>
                During their tenure, they demonstrated exemplary professionalism, diligence, and technical expertise. Their resignation has been accepted and they are relieved of all duties effective {showRelievingModal.lastWorkingDay}.
              </p>
              <p>We wish them all success in their future endeavors.</p>
              
              <div className="pt-6 flex justify-between items-end">
                <div>
                  <p className="font-bold text-slate-900">Aarav Sharma</p>
                  <p className="text-[11px] text-slate-500">VP & Head of Human Resources</p>
                </div>
                <span className="text-[10px] text-slate-400 font-mono">Doc Ref: NEX-REL-2026-081</span>
              </div>
            </div>

            <div className="mt-6 flex justify-end no-print">
              <button
                onClick={() => window.print()}
                className="px-4 py-2 rounded-xl text-xs font-bold bg-slate-900 text-white hover:bg-slate-800 transition flex items-center space-x-1.5"
              >
                <Download className="w-3.5 h-3.5" />
                <span>Print Official Relieving Letter</span>
              </button>
            </div>
          </div>
        </div>
      )}

      {/* Resignation Submission Modal */}
      {showResignModal && (
        <div className="fixed inset-0 z-50 bg-black/60 backdrop-blur-xs flex items-center justify-center p-4">
          <div className="bg-white rounded-3xl max-w-md w-full p-6 shadow-2xl">
            <div className="flex justify-between items-center pb-3 border-b border-slate-100">
              <h3 className="font-bold text-sm text-slate-900">Initiate Resignation Request</h3>
              <button onClick={() => setShowResignModal(false)} className="text-slate-400 hover:text-slate-600">
                <X className="w-5 h-5" />
              </button>
            </div>

            <form onSubmit={handleResign} className="mt-4 space-y-3 text-xs">
              <div>
                <label className="block text-slate-700 font-semibold mb-1">Proposed Last Working Day</label>
                <input
                  type="date"
                  required
                  value={resignForm.proposedLastDate}
                  onChange={e => setResignForm({ ...resignForm, proposedLastDate: e.target.value })}
                  className="w-full px-3 py-2 border rounded-xl focus:outline-none focus:border-brand-500"
                />
                <span className="text-[10px] text-slate-400 block mt-0.5">Standard contractual notice period is 60 days.</span>
              </div>

              <div>
                <label className="block text-slate-700 font-semibold mb-1">Reason for Resignation</label>
                <textarea
                  rows={4}
                  required
                  placeholder="Share reasons for transition or higher study plans..."
                  value={resignForm.reason}
                  onChange={e => setResignForm({ ...resignForm, reason: e.target.value })}
                  className="w-full px-3 py-2 border rounded-xl focus:outline-none focus:border-brand-500"
                />
              </div>

              <button
                type="submit"
                className="w-full py-2.5 rounded-xl font-bold text-white bg-rose-600 hover:bg-rose-500 transition shadow-md shadow-rose-600/30"
              >
                Submit Formal Resignation
              </button>
            </form>
          </div>
        </div>
      )}
    </div>
  );
}
