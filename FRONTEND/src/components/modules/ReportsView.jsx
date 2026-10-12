import React, { useState, useEffect } from 'react';
import { 
  BarChart3, TrendingUp, Users, Download, Printer, 
  PieChart, Activity, DollarSign, ShieldCheck
} from 'lucide-react';
import { api } from '../../services/api';
import { useAuth } from '../../context/AuthContext';

export default function ReportsView() {
  const { refreshKey } = useAuth();
  const [data, setData] = useState(null);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    api.getAnalytics().then(res => {
      setData(res);
      setLoading(false);
    }).catch(console.error);
  }, [refreshKey]);

  if (loading || !data) {
    return (
      <div className="p-8 flex items-center justify-center">
        <div className="w-8 h-8 border-4 border-brand-500 border-t-transparent rounded-full animate-spin"></div>
      </div>
    );
  }

  const exportAnalyticsCSV = () => {
    const rows = [
      ["Metric", "Value"],
      ["Monthly Attendance Rate", `${data.attendanceRateMonthly}%`],
      ["Annual Attrition Rate", `${data.attritionRateAnnual}%`],
      ["Female Diversity Ratio", `${data.genderDiversity?.femaleRatio}%`],
      ["Monthly Total Payroll", `INR ${data.totalMonthlyPayrollSpend}`],
      [],
      ["Department", "Headcount"],
      ...data.departmentDistribution.map(d => [d.name, d.count])
    ];

    const csvContent = "data:text/csv;charset=utf-8," + rows.map(r => r.join(",")).join("\n");
    const encoded = encodeURI(csvContent);
    const a = document.createElement("a");
    a.href = encoded;
    a.download = `HR_Analytics_Executive_Report_${Date.now()}.csv`;
    document.body.appendChild(a);
    a.click();
    document.body.removeChild(a);
  };

  return (
    <div className="space-y-6">
      {/* Top Header */}
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4">
        <div>
          <h2 className="text-xl font-bold text-slate-900 font-display">Workforce Reports & Executive Analytics</h2>
          <p className="text-xs text-slate-500">Headcount forecasting, departmental distribution, diversity metrics & turnover intelligence</p>
        </div>

        <div className="flex items-center space-x-2">
          <button
            onClick={() => window.print()}
            className="px-3.5 py-2 rounded-xl text-xs font-semibold bg-white border border-slate-200 hover:bg-slate-50 text-slate-700 transition flex items-center space-x-1.5"
          >
            <Printer className="w-3.5 h-3.5" />
            <span>Print PDF</span>
          </button>
          <button
            onClick={exportAnalyticsCSV}
            className="inline-flex items-center space-x-1.5 px-4 py-2 rounded-xl text-xs font-bold bg-brand-600 hover:bg-brand-500 text-white shadow-xs transition"
          >
            <Download className="w-3.5 h-3.5" />
            <span>Export CSV</span>
          </button>
        </div>
      </div>

      {/* Top KPI Cards */}
      <div className="grid grid-cols-2 lg:grid-cols-4 gap-4">
        <div className="bg-white p-5 rounded-2xl border border-slate-200/90 shadow-xs">
          <span className="text-xs font-semibold text-slate-500">Monthly Attendance</span>
          <h3 className="text-2xl font-extrabold text-emerald-600 mt-1 font-display">
            {data.attendanceRateMonthly}%
          </h3>
          <p className="text-[11px] text-slate-400 mt-1">Across all office & remote shifts</p>
        </div>

        <div className="bg-white p-5 rounded-2xl border border-slate-200/90 shadow-xs">
          <span className="text-xs font-semibold text-slate-500">Annual Attrition Rate</span>
          <h3 className="text-2xl font-extrabold text-indigo-600 mt-1 font-display">
            {data.attritionRateAnnual}%
          </h3>
          <p className="text-[11px] text-slate-400 mt-1">Well below 18% industry benchmark</p>
        </div>

        <div className="bg-white p-5 rounded-2xl border border-slate-200/90 shadow-xs">
          <span className="text-xs font-semibold text-slate-500">Gender Diversity</span>
          <h3 className="text-2xl font-extrabold text-purple-600 mt-1 font-display">
            {data.genderDiversity?.femaleRatio}% Female
          </h3>
          <p className="text-[11px] text-slate-400 mt-1">
            {data.genderDiversity?.female} Female • {data.genderDiversity?.male} Male
          </p>
        </div>

        <div className="bg-white p-5 rounded-2xl border border-slate-200/90 shadow-xs">
          <span className="text-xs font-semibold text-slate-500">Monthly Payroll Run</span>
          <h3 className="text-2xl font-extrabold text-slate-900 mt-1 font-display">
            ₹{Math.round(data.totalMonthlyPayrollSpend).toLocaleString('en-IN')}
          </h3>
          <p className="text-[11px] text-slate-400 mt-1">Salary + allowances + employer PF</p>
        </div>
      </div>

      {/* Charts Section */}
      <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
        {/* Headcount Trend Chart */}
        <div className="bg-white rounded-3xl border border-slate-200/90 shadow-xs p-6 space-y-4">
          <div className="flex items-center justify-between pb-3 border-b border-slate-100">
            <h3 className="font-bold text-sm text-slate-900 flex items-center gap-2">
              <TrendingUp className="w-4 h-4 text-brand-600" />
              6-Month Headcount Growth Trend
            </h3>
            <span className="text-xs text-emerald-600 font-bold">+62% Growth</span>
          </div>

          <div className="space-y-3 pt-2">
            {data.headcountTrend?.map((t, idx) => (
              <div key={idx} className="space-y-1">
                <div className="flex justify-between text-xs font-semibold">
                  <span className="text-slate-700">{t.month}</span>
                  <span className="font-mono text-slate-900">{t.count} Employees</span>
                </div>
                <div className="w-full bg-slate-100 h-3 rounded-full overflow-hidden">
                  <div
                    className="bg-brand-600 h-full rounded-full transition-all duration-500"
                    style={{ width: `${(t.count / 80) * 100}%` }}
                  ></div>
                </div>
              </div>
            ))}
          </div>
        </div>

        {/* Department Breakdown */}
        <div className="bg-white rounded-3xl border border-slate-200/90 shadow-xs p-6 space-y-4">
          <div className="flex items-center justify-between pb-3 border-b border-slate-100">
            <h3 className="font-bold text-sm text-slate-900 flex items-center gap-2">
              <Users className="w-4 h-4 text-emerald-600" />
              Department Headcount Distribution
            </h3>
            <span className="text-xs text-slate-400">{data.departmentDistribution?.length} Departments</span>
          </div>

          <div className="space-y-3 pt-2">
            {data.departmentDistribution?.map((d, idx) => (
              <div key={idx} className="space-y-1">
                <div className="flex justify-between text-xs font-semibold">
                  <span className="text-slate-700">{d.name}</span>
                  <span className="font-mono text-slate-900">{d.count} Members</span>
                </div>
                <div className="w-full bg-slate-100 h-3 rounded-full overflow-hidden">
                  <div
                    className="bg-emerald-500 h-full rounded-full transition-all duration-500"
                    style={{ width: `${(d.count / 10) * 100}%` }}
                  ></div>
                </div>
              </div>
            ))}
          </div>
        </div>
      </div>
    </div>
  );
}
