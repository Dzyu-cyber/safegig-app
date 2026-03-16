import React, { useState, useEffect } from 'react'
import {
  Shield,
  Users,
  TrendingUp,
  AlertTriangle,
  CheckCircle,
  Clock,
  Download,
  Settings,
  Bell,
  Search,
  Map as MapIcon,
  Activity
} from 'lucide-react'
import axios from 'axios'

const API_BASE_URL = "http://localhost:8000"

function App() {
  const [stats, setStats] = useState({
    activePolicies: 1240,
    totalPremiums: "₹1,45,280",
    claimsProcessed: 85,
    riskScore: 68
  })

  const [activeClaims, setActiveClaims] = useState([
    { id: 'CLM-001', user: 'Rahul S.', type: 'Heavy Rain', amount: '₹500', status: 'Approved', timestamp: '2 mins ago' },
    { id: 'CLM-002', user: 'Amit K.', type: 'Heat Wave', amount: '₹500', status: 'Pending', timestamp: '15 mins ago' },
    { id: 'CLM-003', user: 'Sneha P.', type: 'Heavy Rain', amount: '₹500', status: 'Reviewing', timestamp: '1 hour ago' },
  ])

  return (
    <div className="min-h-screen bg-slate-50 flex">
      {/* Sidebar */}
      <aside className="w-64 bg-primary text-white p-6 hidden md:block">
        <div className="flex items-center gap-3 mb-12">
          <Shield className="text-green-400" size={32} />
          <h1 className="text-2xl font-bold tracking-tight">GigShield</h1>
        </div>

        <nav className="space-y-4">
          <NavItem icon={<Activity size={20} />} label="Overview" active />
          <NavItem icon={<Users size={20} />} label="Policy Holders" />
          <NavItem icon={<AlertTriangle size={20} />} label="Active Triggers" />
          <NavItem icon={<CheckCircle size={20} />} label="Claims Audit" />
          <NavItem icon={<TrendingUp size={20} />} label="Analytics" />
          <NavItem icon={<Settings size={20} />} label="Settings" />
        </nav>

        <div className="mt-auto pt-12">
          <div className="bg-primary-dark p-4 rounded-xl border border-white/10">
            <p className="text-xs text-white/60 mb-1">System Status</p>
            <div className="flex items-center gap-2">
              <div className="w-2 h-2 rounded-full bg-green-400 animate-pulse" />
              <span className="text-sm font-medium">All Engines Normal</span>
            </div>
          </div>
        </div>
      </aside>

      {/* Main Content */}
      <main className="flex-1 overflow-y-auto">
        <header className="h-20 bg-white border-b border-slate-200 flex items-center justify-between px-8 sticky top-0 z-10">
          <div className="flex items-center gap-4 bg-slate-100 px-4 py-2 rounded-lg w-96">
            <Search className="text-slate-400" size={18} />
            <input type="text" placeholder="Search policies, users or claims..." className="bg-transparent border-none outline-none text-sm w-full" />
          </div>

          <div className="flex items-center gap-6">
            <button className="relative text-slate-500">
              <Bell size={22} />
              <span className="absolute -top-1 -right-1 w-4 h-4 bg-red-500 rounded-full text-[10px] text-white flex items-center justify-center border-2 border-white">3</span>
            </button>
            <div className="h-10 w-10 rounded-full bg-primary flex items-center justify-center text-white font-bold">
              ID
            </div>
          </div>
        </header>

        <div className="p-8">
          <div className="flex justify-between items-center mb-8">
            <div>
              <h2 className="text-2xl font-bold">Insurer Dashboard</h2>
              <p className="text-slate-500 text-sm">Parametric Insurance Monitor • Bengaluru Zone</p>
            </div>
            <button className="bg-primary text-white px-6 py-2.5 rounded-lg flex items-center gap-2 hover:bg-primary-dark transition-colors">
              <Download size={18} />
              <span>Export Report</span>
            </button>
          </div>

          {/* Stats Grid */}
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6 mb-8">
            <StatCard icon={<Shield className="text-blue-500" />} label="Active Policies" value={stats.activePolicies} trend="+12%" />
            <StatCard icon={<TrendingUp className="text-green-500" />} label="Total Premiums" value={stats.totalPremiums} trend="+8%" />
            <StatCard icon={<CheckCircle className="text-emerald-500" />} label="Claims Processed" value={stats.claimsProcessed} trend="+24%" />
            <StatCard icon={<AlertTriangle className="text-orange-500" />} label="Avg Risk Factor" value={`${stats.riskScore}%`} trend="-2%" />
          </div>

          <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
            {/* Claims Table */}
            <div className="lg:col-span-2 bg-white rounded-2xl border border-slate-200 shadow-sm overflow-hidden">
              <div className="p-6 border-b border-slate-100 flex justify-between items-center">
                <h3 className="font-bold text-lg">Active Auto-Claims</h3>
                <button className="text-primary text-sm font-semibold hover:underline">View All</button>
              </div>
              <div className="overflow-x-auto">
                <table className="w-full text-left">
                  <thead className="bg-slate-50 text-slate-500 text-xs font-bold uppercase tracking-wider">
                    <tr>
                      <th className="px-6 py-4">ID</th>
                      <th className="px-6 py-4">User</th>
                      <th className="px-6 py-4">Trigger</th>
                      <th className="px-6 py-4">Payout</th>
                      <th className="px-6 py-4">Status</th>
                      <th className="px-6 py-4">Action</th>
                    </tr>
                  </thead>
                  <tbody className="divide-y divide-slate-100">
                    {activeClaims.map((claim) => (
                      <tr key={claim.id} className="hover:bg-slate-50 transition-colors">
                        <td className="px-6 py-4 text-sm font-medium">{claim.id}</td>
                        <td className="px-6 py-4 text-sm">{claim.user}</td>
                        <td className="px-6 py-4">
                          <span className="inline-flex items-center px-2.5 py-0.5 rounded-full text-xs font-medium bg-blue-100 text-blue-800">
                            {claim.type}
                          </span>
                        </td>
                        <td className="px-6 py-4 text-sm font-bold">{claim.amount}</td>
                        <td className="px-6 py-4 text-sm">
                          <StatusBadge status={claim.status} />
                        </td>
                        <td className="px-6 py-4">
                          <button className="text-slate-400 hover:text-primary transition-colors">
                            <Clock size={18} />
                          </button>
                        </td>
                      </tr>
                    ))}
                  </tbody>
                </table>
              </div>
            </div>

            {/* Risk Control Panel */}
            <div className="bg-white rounded-2xl border border-slate-200 shadow-sm p-6">
              <h3 className="font-bold text-lg mb-6">Risk Control Panel</h3>

              <div className="space-y-6">
                <div>
                  <label className="text-sm font-medium text-slate-700 block mb-2">Precipitation Threshold (mm)</label>
                  <input type="range" className="w-full accent-primary" />
                  <div className="flex justify-between text-xs text-slate-500 mt-1">
                    <span>10mm</span>
                    <span>Current: 40mm</span>
                    <span>100mm</span>
                  </div>
                </div>

                <div>
                  <label className="text-sm font-medium text-slate-700 block mb-2">Heat Threshold (°C)</label>
                  <input type="range" className="w-full accent-primary" />
                  <div className="flex justify-between text-xs text-slate-500 mt-1">
                    <span>35°C</span>
                    <span>Current: 45°C</span>
                    <span>50°C</span>
                  </div>
                </div>

                <div className="pt-4 border-t border-slate-100">
                  <h4 className="text-sm font-bold text-slate-900 mb-4">Manual Override</h4>
                  <button className="w-full bg-red-100 text-red-700 font-bold py-3 rounded-xl border border-red-200 hover:bg-red-200 transition-colors flex items-center justify-center gap-2 mb-3">
                    <AlertTriangle size={18} />
                    Force Disruptive State
                  </button>
                  <p className="text-[10px] text-slate-400 text-center uppercase tracking-widest font-bold">
                    Use only during verified platform outages
                  </p>
                </div>
              </div>
            </div>
          </div>
        </div>
      </main>
    </div>
  )
}

function NavItem({ icon, label, active = false }) {
  return (
    <button className={`flex items-center gap-3 w-full px-4 py-3 rounded-xl transition-all ${active ? 'bg-white/20 text-white font-bold' : 'text-white/60 hover:text-white hover:bg-white/10'}`}>
      {icon}
      <span>{label}</span>
    </button>
  )
}

function StatCard({ icon, label, value, trend }) {
  return (
    <div className="bg-white p-6 rounded-2xl border border-slate-200 shadow-sm">
      <div className="flex justify-between items-start mb-4">
        <div className="p-3 bg-slate-50 rounded-xl">
          {icon}
        </div>
        <span className={`text-xs font-bold ${trend.startsWith('+') ? 'text-green-500' : 'text-red-500'}`}>
          {trend}
        </span>
      </div>
      <h4 className="text-slate-500 text-sm font-medium">{label}</h4>
      <p className="text-2xl font-bold mt-1">{value}</p>
    </div>
  )
}

function StatusBadge({ status }) {
  const styles = {
    'Approved': 'bg-green-100 text-green-700',
    'Pending': 'bg-amber-100 text-amber-700',
    'Reviewing': 'bg-blue-100 text-blue-700',
  }
  return (
    <span className={`px-2.5 py-0.5 rounded-full text-xs font-bold ${styles[status]}`}>
      {status}
    </span>
  )
}

export default App
