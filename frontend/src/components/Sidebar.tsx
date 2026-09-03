import React from 'react';
import { NavLink, useNavigate } from 'react-router-dom';
import {
  LayoutDashboard,
  LineChart,
  HeartPulse,
  Pill,
  Stethoscope,
  User,
  LogOut,
  ShieldAlert,
  Sparkles
} from 'lucide-react';
import { useAuth } from '../hooks/useAuth';

export const Sidebar: React.FC = () => {
  const { user, logout } = useAuth();
  const navigate = useNavigate();

  const handleLogout = () => {
    logout();
    navigate('/login');
  };

  const navItems = [
    { name: 'Dashboard', path: '/', icon: LayoutDashboard },
    { name: 'Analytics', path: '/analytics', icon: LineChart },
    { name: 'Wellness', path: '/wellness', icon: HeartPulse },
    { name: 'Medication', path: '/medication', icon: Pill },
    { name: 'AI Triage', path: '/triage', icon: Stethoscope },
    { name: 'Profile', path: '/profile', icon: User }
  ];

  return (
    <aside className="w-64 bg-white border-r border-slate-200/80 flex flex-col justify-between h-screen sticky top-0 z-30 select-none shadow-sm">
      {/* Brand Header */}
      <div>
        <div className="px-6 py-5 flex items-center gap-3 border-b border-slate-100">
          <div className="w-10 h-10 rounded-xl bg-gradient-to-br from-emerald-500 to-teal-600 flex items-center justify-center shadow-md shadow-emerald-500/20 text-white">
            <ShieldAlert className="w-6 h-6 stroke-[2.2]" />
          </div>
          <div>
            <h1 className="font-bold text-lg text-slate-800 tracking-tight flex items-center gap-1.5">
              NeuroRest
              <span className="text-[10px] font-semibold tracking-wider text-emerald-600 bg-emerald-50 border border-emerald-200 px-1.5 py-0.5 rounded-md uppercase">
                v2.0
              </span>
            </h1>
            <p className="text-xs text-slate-400 font-medium">Occupational Stress Shield</p>
          </div>
        </div>

        {/* Navigation Links */}
        <nav className="p-4 space-y-1.5">
          {navItems.map((item) => {
            const Icon = item.icon;
            return (
              <NavLink
                key={item.name}
                to={item.path}
                className={({ isActive }) =>
                  `flex items-center gap-3 px-3.5 py-2.5 rounded-xl font-medium text-sm transition-all duration-200 ${
                    isActive
                      ? 'bg-gradient-to-r from-emerald-50 to-teal-50 text-emerald-700 font-semibold shadow-xs border border-emerald-200/60'
                      : 'text-slate-600 hover:text-slate-900 hover:bg-slate-50'
                  }`
                }
              >
                <Icon className="w-4 h-4 text-emerald-600" />
                <span>{item.name}</span>
              </NavLink>
            );
          })}
        </nav>
      </div>

      {/* Footer / Daily Tip + User Logout */}
      <div className="p-4 space-y-3">
        {/* Daily Tip Card */}
        <div className="bg-gradient-to-br from-slate-900 to-slate-800 rounded-2xl p-3.5 text-white shadow-sm border border-slate-800">
          <div className="flex items-center gap-2 text-emerald-400 font-semibold text-xs mb-1.5">
            <Sparkles className="w-3.5 h-3.5" />
            <span>Shift Resilience Tip</span>
          </div>
          <p className="text-xs text-slate-300 leading-relaxed font-normal">
            Take 3 deep vagal breaths every 90 minutes of active duty cycle to maintain autonomic tone.
          </p>
        </div>

        {/* User Card & Logout */}
        <div className="flex items-center justify-between pt-2 border-t border-slate-100 px-1">
          <div className="flex items-center gap-2.5 min-w-0">
            <img
              src={user?.avatarUrl || 'https://images.unsplash.com/photo-1559839734-2b71ea197ec2?q=80&w=250&auto=format&fit=crop'}
              alt={user?.name}
              className="w-8 h-8 rounded-full object-cover border border-emerald-300"
            />
            <div className="min-w-0">
              <p className="text-xs font-semibold text-slate-800 truncate">{user?.name || 'User'}</p>
              <p className="text-[11px] text-slate-400 truncate">{user?.role || 'Shift Member'}</p>
            </div>
          </div>
          <button
            onClick={handleLogout}
            title="Log Out"
            className="p-1.5 text-slate-400 hover:text-rose-600 hover:bg-rose-50 rounded-lg transition-colors"
          >
            <LogOut className="w-4 h-4" />
          </button>
        </div>
      </div>
    </aside>
  );
};
