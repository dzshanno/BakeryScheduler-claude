import { useState } from 'react';
import { BrowserRouter as Router, Routes, Route, Link } from 'react-router-dom';
import { UserCircle, Calendar, Users, Settings, LogOut } from 'lucide-react';
import * as authService from './api/auth';
import UserList from './components/users/UserList';

function App() {
  const [isLoggedIn, setIsLoggedIn] = useState(false);
  const [username, setUsername] = useState('');
  const [password, setPassword] = useState('');
  const [error, setError] = useState('');
  const [loading, setLoading] = useState(false);

  const handleLogin = async (e) => {
    e.preventDefault();
    setLoading(true);
    setError('');

    try {
      const data = await authService.login(username, password);
      localStorage.setItem('token', data.token);
      setIsLoggedIn(true);
    } catch (err) {
      setError(err.message || 'Login failed');
    } finally {
      setLoading(false);
    }
  };

  const handleLogout = () => {
    authService.logout();
    setIsLoggedIn(false);
  };

  return (
    <Router>
      <div className="min-h-screen bg-gray-50">
        {/* Header */}
        <header className="bg-white border-b">
          <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
            <div className="flex items-center justify-between h-16">
              <div className="flex items-center">
                <UserCircle className="h-8 w-8 text-blue-600" />
                <h1 className="ml-2 text-xl font-bold text-gray-900">Baker Scheduling</h1>
              </div>
              {!isLoggedIn ? (
                <button
                  className="bg-blue-600 text-white px-4 py-2 rounded-md hover:bg-blue-700 transition-colors"
                  disabled={loading}
                >
                  Login
                </button>
              ) : (
                <button
                  onClick={handleLogout}
                  className="text-gray-600 hover:text-gray-900 transition-colors"
                >
                  <LogOut className="h-5 w-5" />
                </button>
              )}
            </div>
          </div>
        </header>

        {/* Main Content */}
        <main className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
          {!isLoggedIn ? (
            <div className="max-w-md mx-auto">
              <div className="bg-white rounded-lg shadow-sm p-6 space-y-4">
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
              </div>
            </div>
          ) : (
            <Routes>
              <Route path="/users" element={<UserList />} />
              <Route path="/" element={
                <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
                  <div className="bg-white rounded-lg shadow-sm p-6">
                    <div className="flex items-center">
                      <Calendar className="h-8 w-8 text-blue-600" />
                      <h2 className="ml-2 text-xl font-bold">Schedule</h2>
                    </div>
                    <p className="mt-2 text-gray-600">View and manage bakery shifts</p>
                  </div>

                  <Link to="/users" className="bg-white rounded-lg shadow-sm p-6 hover:shadow-md transition-shadow">
                    <div className="flex items-center">
                      <Users className="h-8 w-8 text-blue-600" />
                      <h2 className="ml-2 text-xl font-bold">Staff</h2>
                    </div>
                    <p className="mt-2 text-gray-600">Manage staff and availability</p>
                  </Link>

                  <div className="bg-white rounded-lg shadow-sm p-6">
                    <div className="flex items-center">
                      <Settings className="h-8 w-8 text-blue-600" />
                      <h2 className="ml-2 text-xl font-bold">Settings</h2>
                    </div>
                    <p className="mt-2 text-gray-600">Configure system settings</p>
                  </div>
                </div>
              } />
            </Routes>
          )}
        </main>
      </div>
    </Router>
  );
}

export default App;