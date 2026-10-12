import React, { useState, useEffect } from 'react';
import { 
  CreditCard, FileSpreadsheet, Download, Printer, 
  CheckCircle2, ShieldCheck, ArrowRight, Building, 
  Percent, DollarSign, X, Eye, FileText
} from 'lucide-react';
import { api } from '../../services/api';
import { useAuth } from '../../context/AuthContext';

export default function PayrollView() {
  const { currentUser, triggerRefresh, refreshKey } = useAuth();
  const [runs, setRuns] = useState([]);
  const [employees, setEmployees] = useState([]);
  const [selectedPayslip, setSelectedPayslip] = useState(null);
  const [showForm16, setShowForm16] = useState(false);
  const [processing, setProcessing] = useState(false);
  const [toastMessage, setToastMessage] = useState('');

  useEffect(() => {
    api.getPayrollRuns().then(setRuns).catch(console.error);
    api.getEmployees().then(setEmployees).catch(console.error);
  }, [refreshKey]);

  const handleRunPayroll = async () => {
    setProcessing(true);
    const res = await api.processPayrollRun("October 2026");
    setProcessing(false);
    setToastMessage(`Payroll for ${res.month} processed successfully! Batch ID: ${res.bankBatchId}`);
    triggerRefresh();
    setTimeout(() => setToastMessage(''), 4000);
  };

  const openPayslip = async (empId) => {
    const data = await api.getEmployeePayslip(empId);
    setSelectedPayslip(data);
  };

  const handleExportBankSheet = () => {
    // Generate CSV
    const rows = [
      ["Employee ID", "Employee Name", "Bank Name", "Account Number", "IFSC Code", "Net Salary (INR)"],
      ...employees.map(e => [
        e.id,
        `${e.firstName} ${e.lastName}`,
        e.bankDetails.bankName,
        e.bankDetails.accountNumber,
        e.bankDetails.ifscCode,
        e.salary.netPay
      ])
    ];
    const csvContent = "data:text/csv;charset=utf-8," + rows.map(r => r.join(",")).join("\n");
    const encodedUri = encodeURI(csvContent);
    const link = document.createElement("a");
    link.setAttribute("href", encodedUri);
    link.setAttribute("download", `NEFT_Bank_Salary_Transfer_${Date.now()}.csv`);
    document.body.appendChild(link);
    link.click();
    document.body.removeChild(link);
    setToastMessage("Bank NEFT/RTGS salary transfer file exported successfully!");
    setTimeout(() => setToastMessage(''), 3000);
  };

  return (
    <div className="space-y-6">
      {/* Toast Feedback */}
      {toastMessage && (
        <div className="p-4 bg-emerald-50 border border-emerald-200 text-emerald-800 rounded-2xl flex items-center space-x-2 text-xs font-semibold shadow-xs">
          <CheckCircle2 className="w-4 h-4 text-emerald-600" />
          <span>{toastMessage}</span>
        </div>
      )}

      {/* Top Banner & Run Payroll Button */}
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4">
        <div>
          <h2 className="text-xl font-bold text-slate-900 font-display">Indian Statutory Payroll Engine</h2>
          <p className="text-xs text-slate-500">Full compliance with PF (12%), ESI, Professional Tax, TDS slabs & Form 16</p>
        </div>

        <div className="flex items-center space-x-2">
          <button
            onClick={handleExportBankSheet}
            className="px-3.5 py-2 rounded-xl text-xs font-semibold bg-white border border-slate-200 hover:bg-slate-50 text-slate-700 transition flex items-center space-x-1.5"
          >
            <Download className="w-3.5 h-3.5" />
            <span>Bank NEFT Sheet</span>
          </button>
          {currentUser.role !== 'employee' && (
            <button
              onClick={handleRunPayroll}
              disabled={processing}
              className="inline-flex items-center space-x-2 px-4 py-2 rounded-xl font-bold text-xs text-white bg-brand-600 hover:bg-brand-500 shadow-md shadow-brand-600/30 transition"
            >
              <FileSpreadsheet className="w-4 h-4" />
              <span>{processing ? 'Processing...' : 'Run October Payroll'}</span>
            </button>
          )}
        </div>
      </div>

      {/* Statutory Compliances Highlights */}
      <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
        <div className="bg-white p-5 rounded-2xl border border-slate-200/90 shadow-xs">
          <span className="text-xs font-semibold text-slate-500">Provident Fund (EPF)</span>
          <h4 className="text-xl font-extrabold text-slate-900 mt-1 font-display">12% + 12%</h4>
          <p className="text-[11px] text-slate-400 mt-1">Employee & Employer match</p>
        </div>

        <div className="bg-white p-5 rounded-2xl border border-slate-200/90 shadow-xs">
          <span className="text-xs font-semibold text-slate-500">ESI Statutory</span>
          <h4 className="text-xl font-extrabold text-slate-900 mt-1 font-display">0.75% / 3.25%</h4>
          <p className="text-[11px] text-slate-400 mt-1">Gross salary &le; ₹21,000</p>
        </div>

        <div className="bg-white p-5 rounded-2xl border border-slate-200/90 shadow-xs">
          <span className="text-xs font-semibold text-slate-500">Professional Tax (PT)</span>
          <h4 className="text-xl font-extrabold text-slate-900 mt-1 font-display">₹200 / Month</h4>
          <p className="text-[11px] text-slate-400 mt-1">Karnataka state schedule</p>
        </div>

        <div className="bg-white p-5 rounded-2xl border border-slate-200/90 shadow-xs">
          <span className="text-xs font-semibold text-slate-500">TDS / Income Tax</span>
          <h4 className="text-xl font-extrabold text-emerald-600 mt-1 font-display">New & Old Slabs</h4>
          <p className="text-[11px] text-slate-400 mt-1">Quarterly 24Q & Form 16</p>
        </div>
      </div>

      {/* Processed Monthly Payroll History */}
      <div className="bg-white rounded-2xl border border-slate-200/90 shadow-xs overflow-hidden">
        <div className="px-6 py-4 border-b border-slate-100 flex items-center justify-between">
          <h3 className="font-bold text-sm text-slate-900">Disbursed Payroll Runs</h3>
          <span className="text-xs text-brand-600 font-semibold">{runs.length} Pay Cycles Archived</span>
        </div>

        <div className="divide-y divide-slate-100">
          {runs.map((r) => (
            <div key={r.id} className="p-4 sm:px-6 flex flex-col sm:flex-row sm:items-center justify-between gap-3 hover:bg-slate-50 transition">
              <div>
                <div className="flex items-center space-x-2">
                  <h4 className="font-bold text-xs text-slate-900">{r.month}</h4>
                  <span className="px-2 py-0.5 rounded-full text-[10px] font-bold uppercase bg-emerald-50 text-emerald-700">
                    {r.status}
                  </span>
                </div>
                <p className="text-xs text-slate-500 mt-1">
                  Disbursed on <strong>{r.processedDate}</strong> • Headcount: <strong>{r.totalEmployees}</strong> • Bank Ref: <span className="font-mono">{r.bankBatchId}</span>
                </p>
              </div>

              <div className="flex items-center space-x-6 text-xs text-right">
                <div>
                  <span className="text-slate-400 block text-[10px] uppercase">Gross Payroll</span>
                  <span className="font-bold text-slate-800">₹{r.grossTotal.toLocaleString('en-IN')}</span>
                </div>
                <div>
                  <span className="text-slate-400 block text-[10px] uppercase">Statutory Deductions</span>
                  <span className="font-bold text-rose-600">₹{r.deductionsTotal.toLocaleString('en-IN')}</span>
                </div>
                <div>
                  <span className="text-slate-400 block text-[10px] uppercase">Net Disbursed</span>
                  <span className="font-extrabold text-emerald-600 text-sm">₹{r.netTotal.toLocaleString('en-IN')}</span>
                </div>
              </div>
            </div>
          ))}
        </div>
      </div>

      {/* Employee Salary Slips Grid */}
      <div className="bg-white rounded-2xl border border-slate-200/90 shadow-xs p-6">
        <div className="flex items-center justify-between mb-4">
          <div>
            <h3 className="font-bold text-sm text-slate-900">Employee Payslip Generation</h3>
            <p className="text-xs text-slate-500">View and print individual salary statements for the active cycle</p>
          </div>
          <button
            onClick={() => setShowForm16(true)}
            className="text-xs text-brand-600 font-semibold hover:text-brand-700 flex items-center gap-1"
          >
            <FileText className="w-3.5 h-3.5" />
            <span>View Form 16 Summary</span>
          </button>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-4">
          {employees.map((emp) => (
            <div key={emp.id} className="p-4 rounded-xl border border-slate-200 bg-slate-50/50 flex flex-col justify-between space-y-3">
              <div>
                <p className="font-bold text-xs text-slate-900">{emp.firstName} {emp.lastName}</p>
                <p className="text-[11px] text-slate-500">{emp.designation}</p>
                <p className="text-[10px] font-mono text-slate-400 mt-0.5">{emp.id} • {emp.department}</p>
              </div>

              <div className="pt-2 border-t border-slate-200 flex items-center justify-between text-xs">
                <div>
                  <span className="text-[10px] text-slate-400 block">Net Salary:</span>
                  <span className="font-bold text-slate-800">₹{emp.salary.netPay.toLocaleString('en-IN')}</span>
                </div>
                <button
                  onClick={() => openPayslip(emp.id)}
                  className="px-2.5 py-1.5 rounded-lg bg-white border border-slate-200 hover:bg-brand-50 hover:text-brand-600 font-semibold text-[11px] transition flex items-center space-x-1"
                >
                  <Eye className="w-3 h-3" />
                  <span>Payslip</span>
                </button>
              </div>
            </div>
          ))}
        </div>
      </div>

      {/* Professional Printable Payslip Modal */}
      {selectedPayslip && (
        <div className="fixed inset-0 z-50 bg-black/70 backdrop-blur-xs flex items-center justify-center p-4">
          <div className="bg-white rounded-3xl max-w-2xl w-full max-h-[92vh] overflow-y-auto p-6 sm:p-8 shadow-2xl relative">
            <button
              onClick={() => setSelectedPayslip(null)}
              className="absolute top-5 right-5 text-slate-400 hover:text-slate-600 no-print"
            >
              <X className="w-5 h-5" />
            </button>

            {/* Payslip Header */}
            <div className="text-center pb-6 border-b border-slate-200">
              <h2 className="text-xl font-extrabold text-slate-900 font-display">Nexus Enterprise Technologies Pvt. Ltd.</h2>
              <p className="text-xs text-slate-500 mt-0.5">7th Floor, Innovation Tech Park, Outer Ring Road, Bengaluru - 560103</p>
              <p className="text-[11px] text-slate-400 font-mono mt-0.5">CIN: U72200KA2021PTC145678 | GSTIN: 29ABCDE1234F1Z5</p>
              <div className="mt-4 inline-block px-4 py-1 rounded-full bg-slate-100 font-bold text-xs text-slate-800 uppercase tracking-wider">
                Salary Statement for {selectedPayslip.month}
              </div>
            </div>

            {/* Employee Particulars */}
            <div className="grid grid-cols-2 gap-4 py-4 border-b border-slate-200 text-xs">
              <div className="space-y-1">
                <div><span className="text-slate-400">Employee Name:</span> <strong className="text-slate-800">{selectedPayslip.name}</strong></div>
                <div><span className="text-slate-400">Employee ID:</span> <strong className="font-mono text-slate-800">{selectedPayslip.employeeId}</strong></div>
                <div><span className="text-slate-400">Department:</span> <span className="text-slate-800">{selectedPayslip.department}</span></div>
                <div><span className="text-slate-400">Designation:</span> <span className="text-slate-800">{selectedPayslip.designation}</span></div>
              </div>
              <div className="space-y-1">
                <div><span className="text-slate-400">PAN:</span> <strong className="font-mono text-slate-800">{selectedPayslip.pan}</strong></div>
                <div><span className="text-slate-400">EPF UAN:</span> <strong className="font-mono text-slate-800">{selectedPayslip.uan}</strong></div>
                <div><span className="text-slate-400">Bank & A/C:</span> <span className="text-slate-800">{selectedPayslip.bankName} (..{selectedPayslip.accountNumber?.slice(-4)})</span></div>
                <div><span className="text-slate-400">Paid Days:</span> <span className="text-slate-800">{selectedPayslip.paidDays} / {selectedPayslip.workingDays}</span></div>
              </div>
            </div>

            {/* Earnings & Deductions Tables */}
            <div className="grid grid-cols-2 gap-6 py-4 border-b border-slate-200 text-xs">
              <div>
                <h4 className="font-bold text-slate-900 mb-2 border-b pb-1">Earnings (INR)</h4>
                <div className="space-y-1.5">
                  <div className="flex justify-between"><span>Basic Pay</span><span className="font-semibold">₹{selectedPayslip.earnings.basic.toLocaleString('en-IN')}</span></div>
                  <div className="flex justify-between"><span>House Rent Allowance (HRA)</span><span className="font-semibold">₹{selectedPayslip.earnings.hra.toLocaleString('en-IN')}</span></div>
                  <div className="flex justify-between"><span>Dearness Allowance (DA)</span><span className="font-semibold">₹{selectedPayslip.earnings.da.toLocaleString('en-IN')}</span></div>
                  <div className="flex justify-between"><span>Special Allowance</span><span className="font-semibold">₹{selectedPayslip.earnings.specialAllowance.toLocaleString('en-IN')}</span></div>
                  <div className="flex justify-between pt-2 border-t font-bold text-slate-900">
                    <span>Gross Earnings:</span>
                    <span>₹{selectedPayslip.earnings.grossTotal.toLocaleString('en-IN')}</span>
                  </div>
                </div>
              </div>

              <div>
                <h4 className="font-bold text-rose-800 mb-2 border-b pb-1">Statutory Deductions (INR)</h4>
                <div className="space-y-1.5">
                  <div className="flex justify-between"><span>Provident Fund (EPF 12%)</span><span className="font-semibold text-rose-600">₹{selectedPayslip.deductions.providentFund.toLocaleString('en-IN')}</span></div>
                  <div className="flex justify-between"><span>Professional Tax (PT)</span><span className="font-semibold text-rose-600">₹{selectedPayslip.deductions.professionalTax.toLocaleString('en-IN')}</span></div>
                  <div className="flex justify-between"><span>Income Tax TDS</span><span className="font-semibold text-rose-600">₹{selectedPayslip.deductions.tds.toLocaleString('en-IN')}</span></div>
                  <div className="flex justify-between pt-2 border-t font-bold text-rose-900">
                    <span>Total Deductions:</span>
                    <span>₹{selectedPayslip.deductions.totalDeductions.toLocaleString('en-IN')}</span>
                  </div>
                </div>
              </div>
            </div>

            {/* Net Amount Callout */}
            <div className="my-6 p-4 rounded-2xl bg-emerald-50 border border-emerald-200 flex items-center justify-between">
              <div>
                <span className="text-[10px] font-bold uppercase text-emerald-800">Net Salary Payable</span>
                <p className="text-xs text-slate-600">Directly transferred to registered bank account</p>
              </div>
              <div className="text-right">
                <span className="text-2xl font-extrabold text-emerald-900 font-display">
                  ₹{selectedPayslip.netPayable.toLocaleString('en-IN')}
                </span>
              </div>
            </div>

            <p className="text-[10px] text-slate-400 italic text-center">
              Note: This is a system-generated electronic payslip authorized under the IT Act 2000. No physical signature required.
            </p>

            {/* Action Bar */}
            <div className="mt-6 flex justify-end space-x-3 no-print">
              <button
                onClick={() => window.print()}
                className="px-4 py-2 rounded-xl text-xs font-bold bg-slate-900 text-white hover:bg-slate-800 transition flex items-center space-x-1.5"
              >
                <Printer className="w-3.5 h-3.5" />
                <span>Print Salary Slip</span>
              </button>
            </div>
          </div>
        </div>
      )}

      {/* Form 16 Summary Modal */}
      {showForm16 && (
        <div className="fixed inset-0 z-50 bg-black/70 backdrop-blur-xs flex items-center justify-center p-4">
          <div className="bg-white rounded-3xl max-w-xl w-full p-6 shadow-2xl relative">
            <button onClick={() => setShowForm16(false)} className="absolute top-5 right-5 text-slate-400 hover:text-slate-600">
              <X className="w-5 h-5" />
            </button>
            <h3 className="text-lg font-bold text-slate-900 font-display">Form 16 Annual Tax Summary (FY 2025-26)</h3>
            <p className="text-xs text-slate-500 mt-0.5">Certificate under Section 203 of the Income-tax Act, 1961 for tax deducted at source</p>

            <div className="mt-4 p-4 bg-slate-50 rounded-2xl space-y-2 text-xs">
              <div className="flex justify-between"><span>Deductor TAN:</span><span className="font-mono font-bold">BLRN12345E</span></div>
              <div className="flex justify-between"><span>Total Gross Salary Credited:</span><span className="font-semibold">₹1,16,16,000</span></div>
              <div className="flex justify-between"><span>Standard Deduction (u/s 16(ia)):</span><span className="font-semibold text-emerald-600">-₹75,000</span></div>
              <div className="flex justify-between"><span>Total PF Deducted & Deposited:</span><span className="font-semibold text-brand-600">₹13,93,920</span></div>
              <div className="flex justify-between"><span>Total TDS Deposited to Govt Treasury:</span><span className="font-semibold text-purple-600">₹14,50,000</span></div>
            </div>

            <button
              onClick={() => { setShowForm16(false); setToastMessage("Form 16 Certificate downloaded in PDF format."); }}
              className="mt-6 w-full py-2.5 rounded-xl font-bold text-white bg-brand-600 hover:bg-brand-500 transition text-xs flex items-center justify-center space-x-1.5"
            >
              <Download className="w-4 h-4" />
              <span>Download Signed Form 16 Part A & B</span>
            </button>
          </div>
        </div>
      )}
    </div>
  );
}
