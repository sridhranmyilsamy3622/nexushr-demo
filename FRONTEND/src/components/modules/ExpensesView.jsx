import React, { useState, useEffect } from 'react';
import { 
  Receipt, Plus, CheckCircle, Clock, X, Check, 
  FileText, ArrowRight, DollarSign, Download
} from 'lucide-react';
import { api } from '../../services/api';
import { useAuth } from '../../context/AuthContext';

export default function ExpensesView() {
  const { currentUser, triggerRefresh, refreshKey } = useAuth();
  const [expenses, setExpenses] = useState([]);
  const [showSubmitModal, setShowSubmitModal] = useState(false);
  const [expenseForm, setExpenseForm] = useState({
    category: 'Travel & Transit',
    amount: '',
    description: '',
    receiptUrl: 'taxi_bill_oct.pdf'
  });
  const [toastMessage, setToastMessage] = useState('');

  useEffect(() => {
    api.getExpenses().then(setExpenses).catch(console.error);
  }, [refreshKey]);

  const handleSubmit = async (e) => {
    e.preventDefault();
    await api.submitExpense({
      ...expenseForm,
      employeeId: currentUser.employeeId || 'NEX-003'
    });
    setShowSubmitModal(false);
    setToastMessage("Expense claim submitted for approval!");
    triggerRefresh();
    setExpenseForm({ category: 'Travel & Transit', amount: '', description: '', receiptUrl: 'taxi_bill_oct.pdf' });
    setTimeout(() => setToastMessage(''), 3000);
  };

  const handleApprove = async (id) => {
    await api.updateExpenseStatus(id, 'Approved', currentUser.name);
    setToastMessage("Expense claim approved and queued for payout.");
    triggerRefresh();
    setTimeout(() => setToastMessage(''), 3000);
  };

  const handleReject = async (id) => {
    await api.updateExpenseStatus(id, 'Rejected', currentUser.name);
    setToastMessage("Expense claim rejected.");
    triggerRefresh();
    setTimeout(() => setToastMessage(''), 3000);
  };

  const totalClaimed = expenses.reduce((acc, e) => acc + e.amount, 0);
  const approvedTotal = expenses.filter(e => e.status === 'Approved').reduce((acc, e) => acc + e.amount, 0);
  const pendingCount = expenses.filter(e => e.status === 'Pending').length;

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
          <h2 className="text-xl font-bold text-slate-900 font-display">Expense Claims & Reimbursements</h2>
          <p className="text-xs text-slate-500">Corporate travel, client meetings, subscriptions & multi-level approvals</p>
        </div>

        <button
          onClick={() => setShowSubmitModal(true)}
          className="inline-flex items-center space-x-2 px-4 py-2.5 rounded-xl font-semibold text-xs text-white bg-brand-600 hover:bg-brand-500 shadow-md shadow-brand-600/20 transition self-start sm:self-auto"
        >
          <Plus className="w-4 h-4" />
          <span>Submit Expense Claim</span>
        </button>
      </div>

      {/* Highlights */}
      <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
        <div className="bg-white p-5 rounded-2xl border border-slate-200/90 shadow-xs">
          <span className="text-xs font-semibold text-slate-500">Total Claims Processed</span>
          <h3 className="text-2xl font-extrabold text-slate-900 mt-1 font-display">
            ₹{totalClaimed.toLocaleString('en-IN')}
          </h3>
          <p className="text-[11px] text-slate-400 mt-1">{expenses.length} claims submitted this cycle</p>
        </div>

        <div className="bg-white p-5 rounded-2xl border border-slate-200/90 shadow-xs">
          <span className="text-xs font-semibold text-slate-500">Reimbursed & Approved</span>
          <h3 className="text-2xl font-extrabold text-emerald-600 mt-1 font-display">
            ₹{approvedTotal.toLocaleString('en-IN')}
          </h3>
          <p className="text-[11px] text-emerald-600 font-semibold mt-1">Disbursed via direct bank credit</p>
        </div>

        <div className="bg-white p-5 rounded-2xl border border-slate-200/90 shadow-xs">
          <span className="text-xs font-semibold text-slate-500">Pending Review</span>
          <h3 className="text-2xl font-extrabold text-amber-600 mt-1 font-display">
            {pendingCount} Claim{pendingCount !== 1 ? 's' : ''}
          </h3>
          <p className="text-[11px] text-amber-700 font-semibold mt-1">Requires manager approval</p>
        </div>
      </div>

      {/* Claims List Table */}
      <div className="bg-white rounded-3xl border border-slate-200/90 shadow-xs overflow-hidden">
        <div className="px-6 py-4 border-b border-slate-100 flex items-center justify-between">
          <h3 className="font-bold text-sm text-slate-900">Expense Claim Register</h3>
          <span className="text-xs text-slate-500 font-semibold">{expenses.length} Entries</span>
        </div>

        <div className="divide-y divide-slate-100">
          {expenses.map((e) => (
            <div key={e.id} className="p-4 sm:px-6 flex flex-col sm:flex-row sm:items-center justify-between gap-3 hover:bg-slate-50 transition">
              <div>
                <div className="flex items-center space-x-2">
                  <span className="font-bold text-xs text-slate-900">{e.employeeName}</span>
                  <span className="px-2 py-0.5 rounded text-[10px] font-bold uppercase bg-slate-100 text-slate-700">
                    {e.category}
                  </span>
                  <span className={`px-2 py-0.5 rounded-full text-[10px] font-bold uppercase ${
                    e.status === 'Approved' ? 'bg-emerald-50 text-emerald-700' :
                    e.status === 'Pending' ? 'bg-amber-50 text-amber-700' :
                    'bg-rose-50 text-rose-700'
                  }`}>
                    {e.status}
                  </span>
                </div>

                <p className="text-xs text-slate-600 mt-1">{e.description}</p>
                <p className="text-[11px] text-slate-400 mt-0.5">Date: {e.date} • Receipt: <span className="text-brand-600 underline font-mono">{e.receiptUrl}</span></p>
              </div>

              <div className="flex items-center space-x-4 self-end sm:self-auto">
                <span className="text-base font-extrabold text-slate-900 font-display">
                  ₹{e.amount.toLocaleString('en-IN')}
                </span>

                {e.status === 'Pending' && currentUser.role !== 'employee' && (
                  <div className="flex items-center space-x-1.5">
                    <button
                      onClick={() => handleApprove(e.id)}
                      className="p-1.5 rounded-lg bg-emerald-600 text-white hover:bg-emerald-500 shadow-xs transition"
                      title="Approve Expense"
                    >
                      <Check className="w-3.5 h-3.5" />
                    </button>
                    <button
                      onClick={() => handleReject(e.id)}
                      className="p-1.5 rounded-lg bg-rose-50 text-rose-700 hover:bg-rose-100 transition"
                      title="Reject Expense"
                    >
                      <X className="w-3.5 h-3.5" />
                    </button>
                  </div>
                )}
              </div>
            </div>
          ))}
        </div>
      </div>

      {/* Submit Modal */}
      {showSubmitModal && (
        <div className="fixed inset-0 z-50 bg-black/60 backdrop-blur-xs flex items-center justify-center p-4">
          <div className="bg-white rounded-3xl max-w-md w-full p-6 shadow-2xl">
            <div className="flex justify-between items-center pb-3 border-b border-slate-100">
              <h3 className="font-bold text-sm text-slate-900">Submit New Expense Claim</h3>
              <button onClick={() => setShowSubmitModal(false)} className="text-slate-400 hover:text-slate-600">
                <X className="w-5 h-5" />
              </button>
            </div>

            <form onSubmit={handleSubmit} className="mt-4 space-y-3 text-xs">
              <div>
                <label className="block text-slate-700 font-semibold mb-1">Expense Category</label>
                <select
                  value={expenseForm.category}
                  onChange={e => setExpenseForm({ ...expenseForm, category: e.target.value })}
                  className="w-full px-3 py-2 border rounded-xl focus:outline-none focus:border-brand-500"
                >
                  <option>Travel & Transit</option>
                  <option>Client Meeting / Dinner</option>
                  <option>Software Subscriptions</option>
                  <option>Office Hardware / Supplies</option>
                  <option>Mobile & Internet Allowance</option>
                </select>
              </div>

              <div>
                <label className="block text-slate-700 font-semibold mb-1">Claim Amount (₹)</label>
                <input
                  type="number"
                  required
                  placeholder="3500"
                  value={expenseForm.amount}
                  onChange={e => setExpenseForm({ ...expenseForm, amount: e.target.value })}
                  className="w-full px-3 py-2 border rounded-xl focus:outline-none focus:border-brand-500"
                />
              </div>

              <div>
                <label className="block text-slate-700 font-semibold mb-1">Business Description</label>
                <textarea
                  rows={3}
                  required
                  placeholder="Provide context on the business rationale..."
                  value={expenseForm.description}
                  onChange={e => setExpenseForm({ ...expenseForm, description: e.target.value })}
                  className="w-full px-3 py-2 border rounded-xl focus:outline-none focus:border-brand-500"
                />
              </div>

              <div>
                <label className="block text-slate-700 font-semibold mb-1">Receipt Attachment (Mock file)</label>
                <input
                  type="text"
                  value={expenseForm.receiptUrl}
                  onChange={e => setExpenseForm({ ...expenseForm, receiptUrl: e.target.value })}
                  className="w-full px-3 py-2 border rounded-xl focus:outline-none focus:border-brand-500 text-slate-500"
                />
              </div>

              <button
                type="submit"
                className="w-full py-2.5 rounded-xl font-bold text-white bg-brand-600 hover:bg-brand-500 transition shadow-md shadow-brand-600/30"
              >
                Submit Expense Claim
              </button>
            </form>
          </div>
        </div>
      )}
    </div>
  );
}
