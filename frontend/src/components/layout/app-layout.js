// components/layout/AppLayout.jsx
import React from 'react';
import { Navigate, useLocation } from 'react-router-dom';
import { useAuth } from '../../contexts/AuthContext';
import { Calendar, Users, Clock, Settings } from 'lucide-react';

const AppLayout = ({ children }) => {
  const { user, logout } = useAuth();
  const location = useLocation();

  if (!user) {
    return <Navigate to="/login" replace />;
  }

  return (
    <div className="min-h-screen flex bg-gray-100">
      {/* Sidebar - Collapses to bottom nav on mobile */}
      <div className="hidden md:flex flex-col w-64 bg-white shadow-lg">
        <div className="p-4 border-b">
          <h1 className="text-xl font-bold">Bakery Scheduler</h1>
        </div>
        
        <nav className="flex-1 p-4">
          <NavLink to="/schedule" icon={Calendar}>Schedule</NavLink>
          <NavLink to="/shifts" icon={Clock}>Shifts</NavLink>
          {(user.role === 'admin' || user.role === 'manager') && (
            <NavLink to="/staff" icon={Users}>Staff</NavLink>
          )}
          {user.role === 'admin' && (
            <NavLink to="/settings" icon={Settings}>Settings</NavLink>
          )}
        </nav>

        <div className="p-4 border-t">
          <div className="flex items-center justify-between">
            <div>
              <p className="font-medium">{user.name}</p>
              <p className="text-sm text-gray-500 capitalize">{user.role}</p>
            </div>
            <button
              onClick={logout}
              className="text-red-600 hover:text-red-800"
            >
              Logout
            </button>
          </div>
        </div>
      </div>

      {/* Main Content */}
      <div className="flex-1 flex flex-col">
        <main className="flex-1 p-4 overflow-auto">
          {children}
        </main>

        {/* Mobile Navigation */}
        <nav className="md:hidden flex items-center justify-around bg-white border-t p-2">
          <MobileNavLink to="/schedule" icon={Calendar} />
          <MobileNavLink to="/shifts" icon={Clock} />
          {(user.role === 'admin' || user.role === 'manager') && (
            <MobileNavLink to="/staff" icon={Users} />
          )}
          {user.role === 'admin' && (
            <MobileNavLink to="/settings" icon={Settings} />
          )}
        </nav>
      </div>
    </div>
  );
};

const NavLink = ({ to, icon: Icon, children }) => {
  const location = useLocation();
  const isActive = location.pathname === to;
  
  return (
    <a
      href={to}
      className={`flex items-center gap-2 px-4 py-2 rounded-lg mb-1 ${
        isActive
          ? 'bg-primary text-primary-foreground'
          : 'text-gray-600 hover:bg-gray-100'
      }`}
    >
      <Icon className="h-5 w-5" />
      <span>{children}</span>
    </a>
  );
};

const MobileNavLink = ({ to, icon: Icon }) => {
  const location = useLocation();
  const isActive = location.pathname === to;
  
  return (
    <a
      href={to}
      className={`p-2 rounded-lg ${
        isActive
          ? 'text-primary'
          : 'text-gray-600'
      }`}
    >
      <Icon className="h-6 w-6" />
    </a>
  );
};

export default AppLayout;
