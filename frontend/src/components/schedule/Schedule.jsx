import { useState, useEffect } from 'react';
import { Link } from 'react-router-dom';
import { PlusCircle } from 'lucide-react';
import FullCalendar from '@fullcalendar/react';
import dayGridPlugin from '@fullcalendar/daygrid';
import * as shiftsService from '../../api/shifts';

const SHIFT_COLORS = {
    'no-shift': '#f3f4f6', // gray-100
    'has-shift': '#93c5fd', // blue-300
    'pending-availability': '#fde68a', // yellow-200
    'confirmed-availability': '#86efac', // green-300
    'cancelled-availability': '#fca5a5', // red-300
};

const Schedule = () => {
    const [shifts, setShifts] = useState([]);
    const [loading, setLoading] = useState(false);
    const [error, setError] = useState(null);

    const fetchShifts = async (start, end) => {
        try {
            setLoading(true);
            const data = await shiftsService.getShifts(start, end);
            setShifts(data.shifts.map(shift => ({
                ...shift,
                backgroundColor: SHIFT_COLORS[shift.status],
                borderColor: SHIFT_COLORS[shift.status],
            })));
        } catch (err) {
            setError('Failed to load shifts');
            console.error(err);
        } finally {
            setLoading(false);
        }
    };

    return (
        <div className="p-6">
            <div className="flex justify-between items-center mb-6">
                <h2 className="text-2xl font-bold text-gray-900">Bakery Schedule</h2>
                <Link
                    to="/shifts/new"
                    className="inline-flex items-center px-4 py-2 bg-blue-600 text-white rounded-md hover:bg-blue-700 transition-colors"
                >
                    <PlusCircle className="h-5 w-5 mr-2" />
                    Add Shift
                </Link>
            </div>

            {error && (
                <div className="mb-4 bg-red-50 text-red-600 p-3 rounded">
                    {error}
                </div>
            )}

            <div className="bg-white rounded-lg shadow">
                <FullCalendar
                    plugins={[dayGridPlugin]}
                    initialView="dayGridMonth"
                    events={shifts}
                    loading={loading}
                    datesSet={({ start, end }) => fetchShifts(start, end)}
                    height="auto"
                />
            </div>

            <div className="mt-4 grid grid-cols-2 md:grid-cols-5 gap-4">
                {Object.entries(SHIFT_COLORS).map(([status, color]) => (
                    <div key={status} className="flex items-center gap-2">
                        <div
                            className="w-4 h-4 rounded"
                            style={{ backgroundColor: color }}
                        />
                        <span className="text-sm text-gray-600">
                            {status.split('-').map(word =>
                                word.charAt(0).toUpperCase() + word.slice(1)
                            ).join(' ')}
                        </span>
                    </div>
                ))}
            </div>
        </div>
    );
};

export default Schedule;
