import React, { useState, useEffect, Suspense } from 'react';
import { BrowserRouter as Router, Routes, Route, Link, Navigate } from 'react-router-dom';
import { UserCircle, Calendar, Users, Settings, LogOut, PlusCircle } from 'lucide-react';
import * as authService from './api/auth';
import { Card, CardContent } from '@/components/ui/card';

// Lazy load components
const Schedule = React.lazy(() => import('./components/schedule/Schedule'));
const BakerAvailability = React.lazy(() => import('./components/availability/BakerAvailability'));
const UserList = React.lazy(() => import('./components/users/UserList'));

// Placeholder component
const SettingsPanel = () => (
  <div className="p-6">
    <h2 className="text-2xl font-bold mb-4">Settings</h2>
    <p>Settings interface will go here</p>
  </div>
);

function App() {
  const [isLoggedIn, setIsLoggedIn] = useState(false);
  const [username, setUsername] = useState('');
  const [password, setPassword] = useState('');
  const [error, setError] = useState('');
  const [loading, setLoading] = useState(false);
  const [currentUser, setCurrentUser] = useState(null);

  useEffect(() => {
    const token = localStorage.getItem('token');
    if (token) {
      const fetchCurrentUser = async () => {
        try {
          const userData = await authService.getCurrentUser();
          setCurrentUser(userData);
          setIsLoggedIn(true);
        } catch (err) {
          console.error('Failed to get current user:', err);
          handleLogout();
        }
      };
      fetchCurrentUser();
    }
  }, []);

  const handleLogin = async (e) => {
    e.preventDefault();
    setLoading(true);
    setError('');

    try {
      const data = await authService.login(username, password);
      localStorage.setItem('token', data.token);
      const userData = await authService.getCurrentUser();
      setCurrentUser(userData);
      setIsLoggedIn(true);
    } catch (err) {
      setError(err.message || 'Login failed');
    } finally {
      setLoading(false);
    }
  };

  const handleLogout = () => {
    localStorage.removeItem('token');
    setIsLoggedIn(false);
    setCurrentUser(null);
  };

  const NavigationItem = ({ to, icon: Icon, title }) => (
    <Link
      to={to}
      className="flex items-center px-4 py-2 text-gray-700 hover:bg-gray-100 rounded-md"
    >
      <Icon className="h-5 w-5 mr-2" />
      <span>{title}</span>
    </Link>
  );

  return (
    <Router>
      <div className="min-h-screen bg-gray-50">
        <header className="bg-white border-b">
          <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
            <div className="flex items-center justify-between h-16">
              <div className="flex items-center">
                <UserCircle className="h-8 w-8 text-blue-600" />
                <h1 className="ml-2 text-xl font-bold text-gray-900">Baker Scheduling</h1>
              </div>
              {isLoggedIn && (
                <div className="flex items-center gap-4">
                  <span className="text-sm text-gray-600">
                    {currentUser?.name || currentUser?.username}
                  </span>
                  <button
                    onClick={handleLogout}
                    className="text-gray-600 hover:text-gray-900 transition-colors"
                  >
                    <LogOut className="h-5 w-5" />
                  </button>
                </div>
              )}
            </div>
          </div>
        </header>

        <main className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
          {!isLoggedIn ? (
            <Card className="max-w-md mx-auto">
              <CardContent className="p-6 space-y-4">
                <h2 className="text-2xl font-bold text-gray-900">Welcome Back</h2>
                <p className="text-gray-600">Please log in to manage your bakery schedules.</p>

                {error && (
                  <div className="bg-red-50 text-red-600 p-3 rounded">
                    {error}
                  </div>
                )}

                <form onSubmit={handleLogin} className="space-y-4">
                  <div>
                    <label className="block text-sm font-medium text-gray-700">Username</label>
                    <input
                      type="text"
                      className="mt-1 block w-full rounded-md border-gray-300 shadow-sm focus:border-blue-500 focus:ring-blue-500"
                      placeholder="Enter your username"
                      value={username}
                      onChange={(e) => setUsername(e.target.value)}
                      required
                      disabled={loading}
                    />
                  </div>
                  <div>
                    <label className="block text-sm font-medium text-gray-700">Password</label>
                    <input
                      type="password"
                      className="mt-1 block w-full rounded-md border-gray-300 shadow-sm focus:border-blue-500 focus:ring-blue-500"
                      placeholder="Enter your password"
                      value={password}
                      onChange={(e) => setPassword(e.target.value)}
                      required
                      disabled={loading}
                    />
                  </div>
                  <button
                    type="submit"
                    className="w-full bg-blue-600 text-white px-4 py-2 rounded-md hover:bg-blue-700 transition-colors disabled:opacity-50"
                    disabled={loading}
                  >
                    {loading ? 'Logging in...' : 'Log In'}
                  </button>
                </form>
              </CardContent>
            </Card>
          ) : (
            <div className="flex gap-6">
              <div className="w-64 bg-white rounded-lg shadow-sm p-4">
                <nav className="space-y-2">
                  <NavigationItem to="/" icon={Calendar} title="Schedule" />
                  <NavigationItem to="/availability" icon={PlusCircle} title="My Availability" />
                  <NavigationItem to="/staff" icon={Users} title="Staff" />
                  <NavigationItem to="/settings" icon={Settings} title="Settings" />
                </nav>
              </div>

              <div className="flex-1">
                <Suspense fallback={
                  <div className="flex items-center justify-center h-32">
                    <div className="text-gray-500">Loading...</div>
                  </div>
                }>
                  <Routes>
                    <Route path="/" element={<Schedule />} />
                    <Route path="/availability" element={<BakerAvailability />} />
                    <Route path="/staff" element={<UserList />} />
                    <Route path="/settings" element={<SettingsPanel />} />
                    <Route path="*" element={<Navigate to="/" replace />} />
                  </Routes>
                </Suspense>
              </div>
            </div>
          )}
        </main>
      </div>
    </Router>
  );
}

export default App;