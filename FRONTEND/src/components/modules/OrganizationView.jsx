import React, { useState, useEffect } from 'react';
import { 
  Network, Building2, MapPin, Users, ChevronRight, 
  ChevronDown, Shield, DollarSign
} from 'lucide-react';
import { api } from '../../services/api';
import { useAuth } from '../../context/AuthContext';

export default function OrganizationView() {
  const { refreshKey } = useAuth();
  const [departments, setDepartments] = useState([]);
  const [locations, setLocations] = useState([]);
  const [hierarchy, setHierarchy] = useState(null);
  const [activeTab, setActiveTab] = useState('chart'); // chart, depts, locations

  useEffect(() => {
    api.getDepartments().then(setDepartments).catch(console.error);
    api.getLocations().then(setLocations).catch(console.error);
    api.getHierarchy().then(setHierarchy).catch(console.error);
  }, [refreshKey]);

  return (
    <div className="space-y-6">
      {/* Top Header */}
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4">
        <div>
          <h2 className="text-xl font-bold text-slate-900 font-display">Organization & Department Architecture</h2>
          <p className="text-xs text-slate-500">Visual corporate hierarchy tree, department allocations & geographical office branches</p>
        </div>

        {/* View mode toggle */}
        <div className="bg-slate-100 p-1 rounded-xl flex text-xs font-semibold self-start sm:self-auto">
          <button
            onClick={() => setActiveTab('chart')}
            className={`px-3 py-1.5 rounded-lg transition ${
              activeTab === 'chart' ? 'bg-white text-brand-600 shadow-xs' : 'text-slate-600 hover:text-slate-900'
            }`}
          >
            Org Tree
          </button>
          <button
            onClick={() => setActiveTab('depts')}
            className={`px-3 py-1.5 rounded-lg transition ${
              activeTab === 'depts' ? 'bg-white text-brand-600 shadow-xs' : 'text-slate-600 hover:text-slate-900'
            }`}
          >
            Departments ({departments.length})
          </button>
          <button
            onClick={() => setActiveTab('locations')}
            className={`px-3 py-1.5 rounded-lg transition ${
              activeTab === 'locations' ? 'bg-white text-brand-600 shadow-xs' : 'text-slate-600 hover:text-slate-900'
            }`}
          >
            Locations ({locations.length})
          </button>
        </div>
      </div>

      {/* Org Hierarchy Tree View */}
      {activeTab === 'chart' && hierarchy && (
        <div className="bg-white rounded-3xl border border-slate-200/90 shadow-xs p-8 overflow-x-auto">
          <div className="min-w-[700px] flex flex-col items-center">
            {/* Level 0: CEO */}
            <div className="p-4 rounded-2xl bg-slate-900 text-white shadow-xl text-center w-64 border border-slate-800">
              <img
                src={hierarchy.avatar}
                alt={hierarchy.name}
                className="w-12 h-12 rounded-full mx-auto object-cover ring-2 ring-brand-400 mb-2"
              />
              <h4 className="font-bold text-sm font-display">{hierarchy.name}</h4>
              <p className="text-[11px] text-brand-300">{hierarchy.title}</p>
            </div>

            {/* Connecting Vertical Line */}
            <div className="w-0.5 h-8 bg-slate-300"></div>

            {/* Level 1: VP / Directors */}
            <div className="grid grid-cols-3 gap-8 relative pt-4 border-t-2 border-slate-300">
              {hierarchy.children?.map((dir) => (
                <div key={dir.id} className="flex flex-col items-center">
                  <div className="p-4 rounded-2xl bg-white border-2 border-brand-500 shadow-md text-center w-56">
                    <img
                      src={dir.avatar}
                      alt={dir.name}
                      className="w-10 h-10 rounded-full mx-auto object-cover ring-2 ring-slate-200 mb-2"
                    />
                    <h5 className="font-bold text-xs text-slate-900">{dir.name}</h5>
                    <p className="text-[10px] text-slate-500">{dir.title}</p>
                  </div>

                  {/* Level 2 children if any */}
                  {dir.children && dir.children.length > 0 && (
                    <>
                      <div className="w-0.5 h-6 bg-slate-300"></div>
                      <div className="space-y-2 pt-2 border-t-2 border-slate-200 w-full flex flex-col items-center">
                        {dir.children.map((sub) => (
                          <div key={sub.id} className="p-2.5 rounded-xl bg-slate-50 border border-slate-200 text-center w-48 text-[11px]">
                            <p className="font-bold text-slate-800">{sub.name}</p>
                            <p className="text-[10px] text-slate-400">{sub.title}</p>
                          </div>
                        ))}
                      </div>
                    </>
                  )}
                </div>
              ))}
            </div>
          </div>
        </div>
      )}

      {/* Departments Directory View */}
      {activeTab === 'depts' && (
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
          {departments.map((dept) => (
            <div key={dept.id} className="bg-white rounded-3xl border border-slate-200/90 shadow-xs p-6 space-y-4">
              <div className="flex items-center justify-between pb-3 border-b border-slate-100">
                <h3 className="font-bold text-sm text-slate-900">{dept.name}</h3>
                <span className="px-2.5 py-0.5 rounded-full text-[10px] font-bold bg-brand-50 text-brand-700">
                  {dept.count} Members
                </span>
              </div>

              <div className="space-y-2 text-xs text-slate-600">
                <div className="flex justify-between">
                  <span className="text-slate-400">Department Head:</span>
                  <strong className="text-slate-800">{dept.head}</strong>
                </div>
                <div className="flex justify-between">
                  <span className="text-slate-400">Annual Budget:</span>
                  <strong className="text-emerald-700">{dept.budget}</strong>
                </div>
                <div className="flex justify-between">
                  <span className="text-slate-400">Primary Location:</span>
                  <span className="text-slate-800">{dept.location}</span>
                </div>
              </div>
            </div>
          ))}
        </div>
      )}

      {/* Locations View */}
      {activeTab === 'locations' && (
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-4">
          {locations.map((loc) => (
            <div key={loc.id} className="bg-white rounded-3xl border border-slate-200/90 shadow-xs p-6 space-y-3">
              <div className="flex items-center justify-between">
                <h4 className="font-bold text-sm text-slate-900">{loc.name}</h4>
                {loc.isHeadquarters && (
                  <span className="px-2 py-0.5 rounded bg-brand-50 text-brand-700 font-bold text-[10px] uppercase">
                    HQ
                  </span>
                )}
              </div>
              <p className="text-xs text-slate-500">{loc.address}</p>
              <div className="pt-3 border-t border-slate-100 text-xs font-semibold text-slate-700">
                {loc.employeesCount} Employees Stationed
              </div>
            </div>
          ))}
        </div>
      )}
    </div>
  );
}
