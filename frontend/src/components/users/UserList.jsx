import { useState, useEffect } from 'react';
import { UserCircle } from 'lucide-react';
import { getUsers } from '../../api/users';
import * as authService from '../../api/auth';

function UserList() {
    const [users, setUsers] = useState([]);
    const [loading, setLoading] = useState(true);
    const [error, setError] = useState(null);
    const [currentUser, setCurrentUser] = useState(null);

    useEffect(() => {
        const fetchData = async () => {
            try {
                console.log('Starting data fetch...');

                // Get current user from auth service
                const currentUserData = await authService.getCurrentUser();
                console.log('Current user data from auth:', currentUserData);
                setCurrentUser(currentUserData);

                // Only fetch all users if admin/manager
                if (currentUserData.role === 'admin' || currentUserData.role === 'manager') {
                    const response = await getUsers();
                    console.log('Raw API response:', response);

                    // Extract users array from response
                    const usersData = response.users || []; // Access the users array from the JSON
                    console.log('Extracted users data:', usersData);
                    console.log('Users data type:', typeof usersData);
                    console.log('Is users array?', Array.isArray(usersData));

                    // Set users state
                    setUsers(usersData);
                    console.log('Users state set to:', usersData);
                }

                setError(null);
            } catch (err) {
                console.error('UserList fetch error:', err);
                setError('Failed to fetch users. Please check your permissions and try again.');
                setUsers([]);
            } finally {
                setLoading(false);
            }
        };

        fetchData();
    }, []);

    // Debug information about current state
    console.log('=== Component State ===');
    console.log('Loading:', loading);
    console.log('Error:', error);
    console.log('Current User:', currentUser);
    console.log('Users Array:', users);
    console.log('Users Length:', users.length);
    console.log('Is users an array?', Array.isArray(users));

    if (loading) {
        console.log('Rendering loading state');
        return <div className="text-center p-4">Loading...</div>;
    }

    if (error) {
        console.log('Rendering error state');
        return (
            <div className="bg-red-50 border border-red-200 text-red-600 p-4 rounded-lg">
                <h3 className="font-semibold">Error Loading Users</h3>
                <p>{error}</p>
            </div>
        );
    }

    const isAdminOrManager = currentUser?.role === 'admin' || currentUser?.role === 'manager';
    console.log('Is admin or manager?', isAdminOrManager);
    console.log('Current user role:', currentUser?.role);

    return (
        <div className="bg-white rounded-lg shadow-sm p-6">
            <h2 className="text-2xl font-bold mb-6">
                {isAdminOrManager ? 'All Users' : 'My Profile'}
            </h2>

            <div className="space-y-4">
                {isAdminOrManager ? (
                    // Show all users for admin/manager
                    (() => {
                        console.log('Attempting to render admin view');
                        console.log('Users available for mapping:', users);
                        return users.length > 0 ? (
                            users.map(user => {
                                console.log('Mapping user:', user);
                                return (
                                    <div key={user.id} className="border rounded-lg p-4 flex items-center">
                                        <UserCircle className="h-10 w-10 text-blue-600" />
                                        <div className="ml-4">
                                            <h3 className="font-semibold">{user.name}</h3>
                                            <p className="text-sm text-gray-600">
                                                Role: {user.role} | Email: {user.email}
                                            </p>
                                        </div>
                                    </div>
                                );
                            })
                        ) : (
                            <p className="text-gray-600">No users found.</p>
                        );
                    })()
                ) : (
                    // Show only current user for bakers
                    (() => {
                        console.log('Attempting to render baker view');
                        return currentUser && (
                            <div className="border rounded-lg p-4">
                                <div className="flex items-center mb-4">
                                    <UserCircle className="h-16 w-16 text-blue-600" />
                                    <div className="ml-4">
                                        <h3 className="text-xl font-semibold">{currentUser.name}</h3>
                                        <p className="text-gray-600">{currentUser.role}</p>
                                    </div>
                                </div>
                                <div className="space-y-2">
                                    <p><span className="font-medium">Email:</span> {currentUser.email}</p>
                                    {currentUser.phone && (
                                        <p><span className="font-medium">Phone:</span> {currentUser.phone}</p>
                                    )}
                                    {currentUser.startDate && (
                                        <p><span className="font-medium">Start Date:</span> {new Date(currentUser.startDate).toLocaleDateString()}</p>
                                    )}
                                </div>
                            </div>
                        );
                    })()
                )}
            </div>
        </div>
    );
}

export default UserList;