import React, { useState, useEffect } from 'react';
import { 
  Users, Search, Filter, Plus, Mail, Phone, MapPin, 
  Building, Calendar, CreditCard, Shield, Award, Edit, 
  CheckCircle, X, Download, UserCheck, Briefcase
} from 'lucide-react';
import { api } from '../../services/api';
import { useAuth } from '../../context/AuthContext';

export default function EmployeesView() {
  const { triggerRefresh, refreshKey } = useAuth();
  const [employees, setEmployees] = useState([]);
  const [search, setSearch] = useState('');
  const [departmentFilter, setDepartmentFilter] = useState('All');
  const [selectedEmp, setSelectedEmp] = useState(null);
  const [activeProfileTab, setActiveProfileTab] = useState('personal'); // personal, employment, bank, salary, skills
  const [showAddModal, setShowAddModal] = useState(false);
  const [newEmpForm, setNewEmpForm] = useState({
    firstName: '',
    lastName: '',
    email: '',
    phone: '',
    department: 'Engineering',
    designation: 'Software Engineer',
    gender: 'Male',
    joiningDate: new Date().toISOString().split('T')[0],
    ctc: 1800000,
    workLocation: 'Bengaluru HQ'
  });

  useEffect(() => {
    api.getEmployees({ search, department: departmentFilter }).then(data => {
      setEmployees(data);
    }).catch(console.error);
  }, [search, departmentFilter, refreshKey]);

  const handleAddEmployee = async (e) => {
    e.preventDefault();
    const ctcNum = Number(newEmpForm.ctc);
    const basic = Math.round((ctcNum * 0.4) / 12);
    const hra = Math.round(basic * 0.5);
    const da = Math.round(basic * 0.1);
    const special = Math.round((ctcNum / 12) - (basic + hra + da));
    const pf = Math.round(basic * 0.12);
    const pt = 200;
    const tds = Math.round((ctcNum * 0.08) / 12);
    const net = (basic + hra + da + special) - (pf + pt + tds);

    const payload = {
      ...newEmpForm,
      salary: {
        ctc: ctcNum,
        basic,
        hra,
        da,
        specialAllowance: special,
        pfEmployee: pf,
        esiEmployee: 0,
        professionalTax: pt,
        tds,
        netPay: net
      }
    };

    await api.createEmployee(payload);
    setShowAddModal(false);
    triggerRefresh();
    setNewEmpForm({
      firstName: '',
      lastName: '',
      email: '',
      phone: '',
      department: 'Engineering',
      designation: 'Software Engineer',
      gender: 'Male',
      joiningDate: new Date().toISOString().split('T')[0],
      ctc: 1800000,
      workLocation: 'Bengaluru HQ'
    });
  };

  const departments = ['All', 'Engineering', 'Human Resources', 'Product & Design', 'Finance & Accounts', 'Marketing & Growth', 'Operations & IT Support'];

  return (
    <div className="space-y-6">
      {/* Header with Title and Add Button */}
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4">
        <div>
          <h2 className="text-xl font-bold text-slate-900 font-display">Employee Directory</h2>
          <p className="text-xs text-slate-500">Manage workforce profiles, statutory records, compensation & documents</p>
        </div>

        <button
          onClick={() => setShowAddModal(true)}
          className="inline-flex items-center space-x-2 px-4 py-2.5 rounded-xl font-semibold text-xs text-white bg-brand-600 hover:bg-brand-500 shadow-md shadow-brand-600/20 transition self-start sm:self-auto"
        >
          <Plus className="w-4 h-4" />
          <span>Add New Employee</span>
        </button>
      </div>

      {/* Filter and Search Bar */}
      <div className="bg-white p-4 rounded-2xl border border-slate-200/90 shadow-xs flex flex-col md:flex-row gap-3 items-center justify-between">
        <div className="relative w-full md:w-80">
          <Search className="w-4 h-4 text-slate-400 absolute left-3.5 top-3" />
          <input
            type="text"
            placeholder="Search by name, ID, or title..."
            value={search}
            onChange={e => setSearch(e.target.value)}
            className="w-full pl-10 pr-4 py-2 rounded-xl bg-slate-50 border border-slate-200 text-xs focus:outline-none focus:border-brand-500"
          />
        </div>

        <div className="flex items-center space-x-2 overflow-x-auto w-full md:w-auto pb-1 md:pb-0">
          <Filter className="w-3.5 h-3.5 text-slate-400 shrink-0 ml-1" />
          <span className="text-[11px] font-semibold text-slate-500 shrink-0">Dept:</span>
          {departments.map((dept) => (
            <button
              key={dept}
              onClick={() => setDepartmentFilter(dept)}
              className={`px-3 py-1.5 rounded-xl text-xs font-medium whitespace-nowrap transition ${
                departmentFilter === dept
                  ? 'bg-brand-600 text-white font-semibold'
                  : 'bg-slate-50 text-slate-600 hover:bg-slate-100'
              }`}
            >
              {dept}
            </button>
          ))}
        </div>
      </div>

      {/* Employee Cards Grid */}
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-4">
        {employees.map((emp) => (
          <div
            key={emp.id}
            onClick={() => setSelectedEmp(emp)}
            className="bg-white rounded-2xl border border-slate-200/90 p-5 hover:border-brand-500/50 hover:shadow-md transition cursor-pointer flex flex-col justify-between group"
          >
            <div>
              <div className="flex items-start justify-between">
                <img
                  src={emp.avatar}
                  alt={emp.firstName}
                  className="w-14 h-14 rounded-2xl object-cover ring-2 ring-slate-100 group-hover:ring-brand-500/40 transition"
                />
                <span className="px-2 py-0.5 rounded-full text-[10px] font-bold uppercase tracking-wider bg-emerald-50 text-emerald-700">
                  {emp.employmentStatus}
                </span>
              </div>

              <div className="mt-3">
                <h3 className="font-bold text-sm text-slate-900 group-hover:text-brand-600 transition">
                  {emp.firstName} {emp.lastName}
                </h3>
                <p className="text-xs text-slate-500">{emp.designation}</p>
                <div className="mt-2.5 inline-block px-2.5 py-1 rounded-lg bg-slate-50 border border-slate-100 text-[11px] font-medium text-slate-700">
                  {emp.department}
                </div>
              </div>
            </div>

            <div className="mt-4 pt-4 border-t border-slate-100 text-[11px] text-slate-500 space-y-1">
              <div className="flex items-center justify-between">
                <span>Employee ID:</span>
                <span className="font-mono font-semibold text-slate-800">{emp.id}</span>
              </div>
              <div className="flex items-center justify-between">
                <span>Location:</span>
                <span className="text-slate-800">{emp.workLocation}</span>
              </div>
            </div>
          </div>
        ))}
      </div>

      {/* Detailed Employee Profile Modal */}
      {selectedEmp && (
        <div className="fixed inset-0 z-50 bg-black/60 backdrop-blur-xs flex items-center justify-center p-4">
          <div className="bg-white rounded-3xl max-w-3xl w-full max-h-[90vh] overflow-hidden flex flex-col shadow-2xl">
            {/* Modal Header */}
            <div className="p-6 bg-gradient-to-r from-slate-900 to-indigo-950 text-white flex items-center justify-between">
              <div className="flex items-center space-x-4">
                <img
                  src={selectedEmp.avatar}
                  alt={selectedEmp.firstName}
                  className="w-16 h-16 rounded-2xl object-cover ring-2 ring-white/20"
                />
                <div>
                  <div className="flex items-center space-x-2">
                    <h3 className="text-xl font-bold font-display">{selectedEmp.firstName} {selectedEmp.lastName}</h3>
                    <span className="px-2 py-0.5 rounded-full text-[10px] font-bold uppercase bg-emerald-500/20 text-emerald-300">
                      {selectedEmp.employmentStatus}
                    </span>
                  </div>
                  <p className="text-xs text-indigo-200 mt-0.5">{selectedEmp.designation} • {selectedEmp.department}</p>
                  <p className="text-[11px] text-slate-400 font-mono mt-0.5">Emp ID: {selectedEmp.id} | Joined: {selectedEmp.joiningDate}</p>
                </div>
              </div>
              <button
                onClick={() => setSelectedEmp(null)}
                className="text-white/70 hover:text-white p-2 rounded-xl hover:bg-white/10"
              >
                <X className="w-5 h-5" />
              </button>
            </div>

            {/* Profile Navigation Tabs */}
            <div className="flex border-b border-slate-200 px-6 bg-slate-50 text-xs font-semibold overflow-x-auto">
              {[
                { id: 'personal', label: 'Personal & Contact' },
                { id: 'employment', label: 'Employment Details' },
                { id: 'salary', label: 'Compensation & Payroll' },
                { id: 'bank', label: 'Bank & Statutory (PF/ESI/PAN)' },
                { id: 'skills', label: 'Skills & Experience' }
              ].map(tab => (
                <button
                  key={tab.id}
                  onClick={() => setActiveProfileTab(tab.id)}
                  className={`py-3 px-3.5 border-b-2 whitespace-nowrap transition ${
                    activeProfileTab === tab.id
                      ? 'border-brand-600 text-brand-600'
                      : 'border-transparent text-slate-500 hover:text-slate-800'
                  }`}
                >
                  {tab.label}
                </button>
              ))}
            </div>

            {/* Tab Contents */}
            <div className="p-6 overflow-y-auto space-y-4 text-xs">
              {activeProfileTab === 'personal' && (
                <div className="space-y-4">
                  <div className="grid grid-cols-2 sm:grid-cols-3 gap-4">
                    <div className="p-3 bg-slate-50 rounded-xl">
                      <span className="text-slate-400 block text-[11px]">Email Address</span>
                      <span className="font-semibold text-slate-800">{selectedEmp.email}</span>
                    </div>
                    <div className="p-3 bg-slate-50 rounded-xl">
                      <span className="text-slate-400 block text-[11px]">Phone Number</span>
                      <span className="font-semibold text-slate-800">{selectedEmp.phone}</span>
                    </div>
                    <div className="p-3 bg-slate-50 rounded-xl">
                      <span className="text-slate-400 block text-[11px]">Date of Birth</span>
                      <span className="font-semibold text-slate-800">{selectedEmp.dob}</span>
                    </div>
                    <div className="p-3 bg-slate-50 rounded-xl">
                      <span className="text-slate-400 block text-[11px]">Gender</span>
                      <span className="font-semibold text-slate-800">{selectedEmp.gender}</span>
                    </div>
                    <div className="p-3 bg-slate-50 rounded-xl">
                      <span className="text-slate-400 block text-[11px]">Blood Group</span>
                      <span className="font-semibold text-slate-800">{selectedEmp.bloodGroup}</span>
                    </div>
                    <div className="p-3 bg-slate-50 rounded-xl">
                      <span className="text-slate-400 block text-[11px]">Marital Status</span>
                      <span className="font-semibold text-slate-800">{selectedEmp.maritalStatus}</span>
                    </div>
                  </div>

                  <div className="p-4 bg-slate-50 rounded-xl">
                    <span className="text-slate-400 block text-[11px]">Residential Address</span>
                    <span className="font-semibold text-slate-800">
                      {selectedEmp.address?.line1}, {selectedEmp.address?.city}, {selectedEmp.address?.state} - {selectedEmp.address?.pincode}
                    </span>
                  </div>

                  <div className="p-4 bg-rose-50/60 border border-rose-100 rounded-xl">
                    <span className="text-rose-600 font-bold block text-[11px]">Emergency Contact</span>
                    <p className="font-semibold text-slate-800 mt-1">
                      {selectedEmp.emergencyContact?.name} ({selectedEmp.emergencyContact?.relationship}) — {selectedEmp.emergencyContact?.phone}
                    </p>
                  </div>
                </div>
              )}

              {activeProfileTab === 'employment' && (
                <div className="grid grid-cols-2 gap-4">
                  <div className="p-3 bg-slate-50 rounded-xl">
                    <span className="text-slate-400 block text-[11px]">Department</span>
                    <span className="font-semibold text-slate-800">{selectedEmp.department}</span>
                  </div>
                  <div className="p-3 bg-slate-50 rounded-xl">
                    <span className="text-slate-400 block text-[11px]">Designation</span>
                    <span className="font-semibold text-slate-800">{selectedEmp.designation}</span>
                  </div>
                  <div className="p-3 bg-slate-50 rounded-xl">
                    <span className="text-slate-400 block text-[11px]">Reporting Manager</span>
                    <span className="font-semibold text-slate-800">{selectedEmp.reportingManager}</span>
                  </div>
                  <div className="p-3 bg-slate-50 rounded-xl">
                    <span className="text-slate-400 block text-[11px]">Employment Type</span>
                    <span className="font-semibold text-slate-800">{selectedEmp.employmentType}</span>
                  </div>
                  <div className="p-3 bg-slate-50 rounded-xl">
                    <span className="text-slate-400 block text-[11px]">Work Location</span>
                    <span className="font-semibold text-slate-800">{selectedEmp.workLocation}</span>
                  </div>
                  <div className="p-3 bg-slate-50 rounded-xl">
                    <span className="text-slate-400 block text-[11px]">Date of Joining</span>
                    <span className="font-semibold text-slate-800">{selectedEmp.joiningDate}</span>
                  </div>
                </div>
              )}

              {activeProfileTab === 'salary' && (
                <div className="space-y-4">
                  <div className="p-4 bg-indigo-50 border border-indigo-100 rounded-2xl flex items-center justify-between">
                    <div>
                      <span className="text-[11px] font-bold uppercase text-indigo-700">Annual CTC</span>
                      <h4 className="text-2xl font-extrabold text-indigo-950 font-display">
                        ₹{selectedEmp.salary?.ctc?.toLocaleString('en-IN')}
                      </h4>
                    </div>
                    <div>
                      <span className="text-[11px] font-bold uppercase text-slate-500">Estimated Monthly Net Pay</span>
                      <h4 className="text-xl font-bold text-emerald-600 font-display">
                        ₹{selectedEmp.salary?.netPay?.toLocaleString('en-IN')}
                      </h4>
                    </div>
                  </div>

                  <div className="grid grid-cols-2 gap-4">
                    <div className="border border-slate-200 rounded-xl p-3 space-y-1.5">
                      <span className="font-bold text-slate-700 block text-[11px] pb-1 border-b">Earnings Components</span>
                      <div className="flex justify-between"><span>Basic Salary:</span><span className="font-semibold">₹{selectedEmp.salary?.basic?.toLocaleString('en-IN')}</span></div>
                      <div className="flex justify-between"><span>HRA:</span><span className="font-semibold">₹{selectedEmp.salary?.hra?.toLocaleString('en-IN')}</span></div>
                      <div className="flex justify-between"><span>Dearness Allowance (DA):</span><span className="font-semibold">₹{selectedEmp.salary?.da?.toLocaleString('en-IN')}</span></div>
                      <div className="flex justify-between"><span>Special Allowance:</span><span className="font-semibold">₹{selectedEmp.salary?.specialAllowance?.toLocaleString('en-IN')}</span></div>
                    </div>

                    <div className="border border-slate-200 rounded-xl p-3 space-y-1.5">
                      <span className="font-bold text-rose-700 block text-[11px] pb-1 border-b">Statutory Deductions</span>
                      <div className="flex justify-between"><span>PF (Employee 12%):</span><span className="font-semibold text-rose-600">₹{selectedEmp.salary?.pfEmployee?.toLocaleString('en-IN')}</span></div>
                      <div className="flex justify-between"><span>Professional Tax (PT):</span><span className="font-semibold text-rose-600">₹{selectedEmp.salary?.professionalTax?.toLocaleString('en-IN')}</span></div>
                      <div className="flex justify-between"><span>TDS / Income Tax:</span><span className="font-semibold text-rose-600">₹{selectedEmp.salary?.tds?.toLocaleString('en-IN')}</span></div>
                    </div>
                  </div>
                </div>
              )}

              {activeProfileTab === 'bank' && (
                <div className="grid grid-cols-2 gap-4">
                  <div className="p-3 bg-slate-50 rounded-xl">
                    <span className="text-slate-400 block text-[11px]">Bank Name</span>
                    <span className="font-semibold text-slate-800">{selectedEmp.bankDetails?.bankName}</span>
                  </div>
                  <div className="p-3 bg-slate-50 rounded-xl">
                    <span className="text-slate-400 block text-[11px]">Account Number</span>
                    <span className="font-semibold font-mono text-slate-800">{selectedEmp.bankDetails?.accountNumber}</span>
                  </div>
                  <div className="p-3 bg-slate-50 rounded-xl">
                    <span className="text-slate-400 block text-[11px]">IFSC Code</span>
                    <span className="font-semibold font-mono text-slate-800">{selectedEmp.bankDetails?.ifscCode}</span>
                  </div>
                  <div className="p-3 bg-slate-50 rounded-xl">
                    <span className="text-slate-400 block text-[11px]">Bank Branch</span>
                    <span className="font-semibold text-slate-800">{selectedEmp.bankDetails?.branch}</span>
                  </div>
                  <div className="p-3 bg-amber-50/70 border border-amber-200 rounded-xl">
                    <span className="text-amber-800 block text-[11px] font-bold">PAN Card Number</span>
                    <span className="font-bold font-mono text-amber-950">{selectedEmp.statutoryDetails?.pan}</span>
                  </div>
                  <div className="p-3 bg-amber-50/70 border border-amber-200 rounded-xl">
                    <span className="text-amber-800 block text-[11px] font-bold">EPF UAN Number</span>
                    <span className="font-bold font-mono text-amber-950">{selectedEmp.statutoryDetails?.uan}</span>
                  </div>
                </div>
              )}

              {activeProfileTab === 'skills' && (
                <div className="space-y-4">
                  <div>
                    <span className="text-slate-400 block text-[11px] mb-2 font-semibold">Verified Professional Skills</span>
                    <div className="flex flex-wrap gap-2">
                      {selectedEmp.skills?.map((sk, idx) => (
                        <span key={idx} className="px-3 py-1 rounded-lg bg-brand-50 text-brand-700 font-semibold border border-brand-200">
                          {sk}
                        </span>
                      ))}
                    </div>
                  </div>
                  <div className="p-4 bg-slate-50 rounded-xl">
                    <span className="text-slate-400 block text-[11px]">Total Industry Experience</span>
                    <span className="text-base font-bold text-slate-800">{selectedEmp.experienceYears} Years</span>
                  </div>
                </div>
              )}
            </div>
          </div>
        </div>
      )}

      {/* Add Employee Modal */}
      {showAddModal && (
        <div className="fixed inset-0 z-50 bg-black/60 backdrop-blur-xs flex items-center justify-center p-4">
          <div className="bg-white rounded-3xl max-w-xl w-full p-6 shadow-2xl">
            <div className="flex justify-between items-center pb-3 border-b border-slate-100">
              <h3 className="font-bold text-base text-slate-900">Add New Team Member</h3>
              <button onClick={() => setShowAddModal(false)} className="text-slate-400 hover:text-slate-600">
                <X className="w-5 h-5" />
              </button>
            </div>

            <form onSubmit={handleAddEmployee} className="mt-4 space-y-3 text-xs">
              <div className="grid grid-cols-2 gap-3">
                <div>
                  <label className="block text-slate-700 font-semibold mb-1">First Name</label>
                  <input
                    type="text"
                    required
                    value={newEmpForm.firstName}
                    onChange={e => setNewEmpForm({ ...newEmpForm, firstName: e.target.value })}
                    className="w-full px-3 py-2 border rounded-xl focus:outline-none focus:border-brand-500"
                  />
                </div>
                <div>
                  <label className="block text-slate-700 font-semibold mb-1">Last Name</label>
                  <input
                    type="text"
                    required
                    value={newEmpForm.lastName}
                    onChange={e => setNewEmpForm({ ...newEmpForm, lastName: e.target.value })}
                    className="w-full px-3 py-2 border rounded-xl focus:outline-none focus:border-brand-500"
                  />
                </div>
              </div>

              <div className="grid grid-cols-2 gap-3">
                <div>
                  <label className="block text-slate-700 font-semibold mb-1">Work Email</label>
                  <input
                    type="email"
                    required
                    value={newEmpForm.email}
                    onChange={e => setNewEmpForm({ ...newEmpForm, email: e.target.value })}
                    className="w-full px-3 py-2 border rounded-xl focus:outline-none focus:border-brand-500"
                  />
                </div>
                <div>
                  <label className="block text-slate-700 font-semibold mb-1">Phone</label>
                  <input
                    type="tel"
                    required
                    value={newEmpForm.phone}
                    onChange={e => setNewEmpForm({ ...newEmpForm, phone: e.target.value })}
                    className="w-full px-3 py-2 border rounded-xl focus:outline-none focus:border-brand-500"
                  />
                </div>
              </div>

              <div className="grid grid-cols-2 gap-3">
                <div>
                  <label className="block text-slate-700 font-semibold mb-1">Department</label>
                  <select
                    value={newEmpForm.department}
                    onChange={e => setNewEmpForm({ ...newEmpForm, department: e.target.value })}
                    className="w-full px-3 py-2 border rounded-xl focus:outline-none focus:border-brand-500"
                  >
                    <option>Engineering</option>
                    <option>Human Resources</option>
                    <option>Product & Design</option>
                    <option>Finance & Accounts</option>
                    <option>Marketing & Growth</option>
                    <option>Operations & IT Support</option>
                  </select>
                </div>
                <div>
                  <label className="block text-slate-700 font-semibold mb-1">Designation</label>
                  <input
                    type="text"
                    required
                    value={newEmpForm.designation}
                    onChange={e => setNewEmpForm({ ...newEmpForm, designation: e.target.value })}
                    className="w-full px-3 py-2 border rounded-xl focus:outline-none focus:border-brand-500"
                  />
                </div>
              </div>

              <div className="grid grid-cols-2 gap-3">
                <div>
                  <label className="block text-slate-700 font-semibold mb-1">Annual CTC (₹)</label>
                  <input
                    type="number"
                    required
                    value={newEmpForm.ctc}
                    onChange={e => setNewEmpForm({ ...newEmpForm, ctc: e.target.value })}
                    className="w-full px-3 py-2 border rounded-xl focus:outline-none focus:border-brand-500"
                  />
                </div>
                <div>
                  <label className="block text-slate-700 font-semibold mb-1">Joining Date</label>
                  <input
                    type="date"
                    required
                    value={newEmpForm.joiningDate}
                    onChange={e => setNewEmpForm({ ...newEmpForm, joiningDate: e.target.value })}
                    className="w-full px-3 py-2 border rounded-xl focus:outline-none focus:border-brand-500"
                  />
                </div>
              </div>

              <button
                type="submit"
                className="w-full py-2.5 mt-2 rounded-xl font-bold text-white bg-brand-600 hover:bg-brand-500 transition shadow-md shadow-brand-600/30"
              >
                Create Employee Profile & Setup Onboarding
              </button>
            </form>
          </div>
        </div>
      )}
    </div>
  );
}
