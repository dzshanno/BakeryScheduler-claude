import { useState, useEffect } from 'react';
import { UserCircle } from 'lucide-react';
import { getUsers } from '../../api/users';

function UserList() {
    const [users, setUsers] = useState([]);
    const [loading, setLoading] = useState(true);
    const [error, setError] = useState(null);
    const [currentUser, setCurrentUser] = useState(null);

    useEffect(() => {
        const fetchUsers = async () => {
            try {
                const data = await getUsers('/api/users', { method: 'GET' }); // Ensure correct API endpoint
                setCurrentUser(data.currentUser);
                setUsers(data.users);
            } catch (err) {
                setError('Failed to fetch users');
            } finally {
                setLoading(false);
            }
        };

        fetchUsers();
    }, []);

    if (loading) return <div className="text-center p-4">Loading...</div>;
    if (error) return <div className="text-red-600 p-4">{error}</div>;

    const isAdminOrManager = currentUser?.role === 'admin' || currentUser?.role === 'manager';

    return (
        <div className="bg-white rounded-lg shadow-sm p-6">
            <h2 className="text-2xl font-bold mb-6">
                {isAdminOrManager ? 'All Users' : 'My Profile'}
            </h2>

            <div className="space-y-4">
                {isAdminOrManager ? (
                    // Show all users for admin/manager
                    users.map(user => (
                        <div key={user.id} className="border rounded-lg p-4 flex items-center">
                            <UserCircle className="h-10 w-10 text-blue-600" />
                            <div className="ml-4">
                                <h3 className="font-semibold">{user.name}</h3>
                                <p className="text-sm text-gray-600">
                                    Role: {user.role} | Email: {user.email}
                                </p>
                            </div>
                        </div>
                    ))
                ) : (
                    // Show only current user for bakers
                    <div className="border rounded-lg p-4">
                        <div className="flex items-center mb-4">
                            <UserCircle className="h-16 w-16 text-blue-600" />
                            <div className="ml-4">
                                <h3 className="text-xl font-semibold">{currentUser.name}</h3>
                                <p className="text-gray-600">Baker</p>
                            </div>
                        </div>
                        <div className="space-y-2">
                            <p><span className="font-medium">Email:</span> {currentUser.email}</p>
                            <p><span className="font-medium">Phone:</span> {currentUser.phone}</p>
                            <p><span className="font-medium">Start Date:</span> {new Date(currentUser.startDate).toLocaleDateString()}</p>
                        </div>
                    </div>
                )}
            </div>
        </div>
    );
}

export default UserList;
