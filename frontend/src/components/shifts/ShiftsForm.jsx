import { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import * as shiftsService from '../../api/shifts';
import * as userService from '../../api/users';

const ShiftsForm = () => {
    const [date, setDate] = useState('');
    const [startTime, setStartTime] = useState('');
    const [endTime, setEndTime] = useState('');
    const [employee, setEmployee] = useState('');
    const [error, setError] = useState('');
    const [loading, setLoading] = useState(false);
    const [requiredStaff, setRequiredStaff] = useState(1);
    const [selectedStaff, setSelectedStaff] = useState([]);
    const [availableStaff, setAvailableStaff] = useState([]);
    const navigate = useNavigate();

    useEffect(() => {
        const fetchStaff = async () => {
            try {
                const data = await userService.getUsers();
                setAvailableStaff(data.users);
            } catch (err) {
                setError('Failed to load staff members');
            }
        };
        fetchStaff();
    }, []);

    const handleSubmit = async (e) => {
        e.preventDefault();
        setLoading(true);
        setError('');

        try {
            await shiftsService.createShift({
                date,
                startTime,
                endTime,
                requiredStaff,
                staff: selectedStaff
            });
            navigate('/');
        } catch (err) {
            setError(err.message || 'Failed to create shift');
        } finally {
            setLoading(false);
        }
    };

    return (
        <div className="max-w-md mx-auto bg-white rounded-lg shadow-sm p-6 space-y-4">
            <h2 className="text-2xl font-bold text-gray-900">Add New Shift</h2>
            {error && (
                <div className="bg-red-50 text-red-600 p-3 rounded">
                    {error}
                </div>
            )}
            <form onSubmit={handleSubmit} className="space-y-4">
                <div>
                    <label className="block text-sm font-medium text-gray-700">Date</label>
                    <input
                        type="date"
                        className="mt-1 block w-full rounded-md border-gray-300 shadow-sm focus:border-blue-500 focus:ring-blue-500"
                        value={date}
                        onChange={(e) => setDate(e.target.value)}
                        required
                        disabled={loading}
                    />
                </div>
                <div>
                    <label className="block text-sm font-medium text-gray-700">Start Time</label>
                    <input
                        type="time"
                        className="mt-1 block w-full rounded-md border-gray-300 shadow-sm focus:border-blue-500 focus:ring-blue-500"
                        value={startTime}
                        onChange={(e) => setStartTime(e.target.value)}
                        required
                        disabled={loading}
                    />
                </div>
                <div>
                    <label className="block text-sm font-medium text-gray-700">End Time</label>
                    <input
                        type="time"
                        className="mt-1 block w-full rounded-md border-gray-300 shadow-sm focus:border-blue-500 focus:ring-blue-500"
                        value={endTime}
                        onChange={(e) => setEndTime(e.target.value)}
                        required
                        disabled={loading}
                    />
                </div>
                <div>
                    <label className="block text-sm font-medium text-gray-700">Employee</label>
                    <input
                        type="text"
                        className="mt-1 block w-full rounded-md border-gray-300 shadow-sm focus:border-blue-500 focus:ring-blue-500"
                        value={employee}
                        onChange={(e) => setEmployee(e.target.value)}
                        required
                        disabled={loading}
                    />
                </div>
                <div>
                    <label className="block text-sm font-medium text-gray-700">
                        Required Staff
                    </label>
                    <input
                        type="number"
                        min="1"
                        className="mt-1 block w-full rounded-md border-gray-300 shadow-sm focus:border-blue-500 focus:ring-blue-500"
                        value={requiredStaff}
                        onChange={(e) => setRequiredStaff(parseInt(e.target.value))}
                        required
                        disabled={loading}
                    />
                </div>
                <div>
                    <label className="block text-sm font-medium text-gray-700">
                        Initial Staff Assignments
                    </label>
                    <select
                        multiple
                        className="mt-1 block w-full rounded-md border-gray-300 shadow-sm focus:border-blue-500 focus:ring-blue-500"
                        value={selectedStaff}
                        onChange={(e) => setSelectedStaff(
                            Array.from(e.target.selectedOptions, option => option.value)
                        )}
                        disabled={loading}
                    >
                        {availableStaff.map(staff => (
                            <option key={staff.id} value={staff.username}>
                                {staff.username}
                            </option>
                        ))}
                    </select>
                </div>
                <button
                    type="submit"
                    className="w-full bg-blue-600 text-white px-4 py-2 rounded-md hover:bg-blue-700 transition-colors disabled:opacity-50"
                    disabled={loading}
                >
                    {loading ? 'Saving...' : 'Save Shift'}
                </button>
            </form>
        </div>
    );
};

export default ShiftsForm;
