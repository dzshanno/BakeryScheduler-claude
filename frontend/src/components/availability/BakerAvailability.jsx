// src/components/availability/BakerAvailability.jsx

import { useState, useEffect } from 'react';
import { Calendar } from '@/components/ui/calendar';
import { Card, CardContent } from '@/components/ui/card';
import { Badge } from '@/components/ui/badge';
import { Check, X, ChevronRight, Users } from 'lucide-react';

const BakerAvailability = () => {
    const [selectedDate, setSelectedDate] = useState(new Date());
    const [shifts, setShifts] = useState(null);
    const [loading, setLoading] = useState(false);
    const [error, setError] = useState(null);

    // Mock data - replace with actual API calls
    const mockShifts = {
        "2024-05-07": [
            {
                id: 1,
                startTime: "04:00",
                endTime: "12:00",
                type: "Morning Bread",
                requiredBakers: 2,
                confirmedBakers: [
                    { id: 1, name: "John Baker" },
                    { id: 2, name: "Sarah Smith" }
                ]
            }
        ],
        "2024-05-08": [
            {
                id: 2,
                startTime: "04:00",
                endTime: "12:00",
                type: "Morning Bread",
                requiredBakers: 2,
                confirmedBakers: [
                    { id: 1, name: "John Baker" }
                ]
            },
            {
                id: 3,
                startTime: "12:00",
                endTime: "20:00",
                type: "Afternoon Pastries",
                requiredBakers: 1,
                confirmedBakers: []
            }
        ]
    };

    useEffect(() => {
        const fetchShiftsForDate = async (date) => {
            setLoading(true);
            try {
                // TODO: Replace with actual API call
                const formattedDate = date.toISOString().split('T')[0];
                const shiftsData = mockShifts[formattedDate] || [];
                setShifts(shiftsData);
                setError(null);
            } catch (err) {
                setError('Failed to load shifts');
                console.error(err);
            } finally {
                setLoading(false);
            }
        };

        fetchShiftsForDate(selectedDate);
    }, [selectedDate]);

    const handleAvailabilityToggle = async (shiftId) => {
        try {
            // TODO: Replace with actual API call
            console.log('Toggling availability for shift:', shiftId);
            // Optimistically update UI
            setShifts(currentShifts =>
                currentShifts.map(shift =>
                    shift.id === shiftId
                        ? {
                            ...shift,
                            confirmedBakers: shift.confirmedBakers.some(b => b.id === 1) // Current user id
                                ? shift.confirmedBakers.filter(b => b.id !== 1)
                                : [...shift.confirmedBakers, { id: 1, name: "Current Baker" }]
                        }
                        : shift
                )
            );
        } catch (err) {
            console.error('Failed to update availability:', err);
        }
    };

    const ShiftDetail = ({ shift }) => {
        const isConfirmed = shift.confirmedBakers.some(b => b.id === 1); // Replace with actual current user check
        const isFull = shift.confirmedBakers.length >= shift.requiredBakers;

        return (
            <div className="border rounded-lg p-4 space-y-3">
                <div className="flex justify-between items-start">
                    <div>
                        <h3 className="font-semibold text-lg">{shift.type}</h3>
                        <p className="text-gray-600">
                            {shift.startTime} - {shift.endTime}
                        </p>
                    </div>
                    <button
                        onClick={() => handleAvailabilityToggle(shift.id)}
                        className={`p-2 rounded-md transition-colors ${isConfirmed
                                ? 'bg-green-100 text-green-700 hover:bg-green-200'
                                : 'bg-gray-100 text-gray-500 hover:bg-gray-200'
                            }`}
                    >
                        {isConfirmed ? <Check className="h-5 w-5" /> : <X className="h-5 w-5" />}
                    </button>
                </div>

                <div className="flex items-center gap-2">
                    <Users className="h-4 w-4 text-gray-500" />
                    <span className="text-sm text-gray-600">
                        {shift.confirmedBakers.length} / {shift.requiredBakers} bakers confirmed
                    </span>
                    {isFull && <Badge className="bg-green-100 text-green-800">Full</Badge>}
                </div>

                {shift.confirmedBakers.length > 0 && (
                    <div className="mt-2">
                        <p className="text-sm text-gray-600 mb-1">Confirmed bakers:</p>
                        <div className="space-y-1">
                            {shift.confirmedBakers.map(baker => (
                                <div key={baker.id} className="text-sm flex items-center gap-2">
                                    <ChevronRight className="h-3 w-3 text-gray-400" />
                                    {baker.name}
                                </div>
                            ))}
                        </div>
                    </div>
                )}
            </div>
        );
    };

    // Highlight dates with shifts
    const hasShiftDate = (date) => {
        const formattedDate = date.toISOString().split('T')[0];
        return mockShifts[formattedDate]?.length > 0;
    };

    return (
        <div className="space-y-6">
            <div className="bg-white rounded-lg p-4 shadow-sm">
                <Calendar
                    mode="single"
                    selected={selectedDate}
                    onSelect={setSelectedDate}
                    modifiers={{ hasShift: hasShiftDate }}
                    modifiersStyles={{
                        hasShift: {
                            backgroundColor: '#EEF2FF',
                            borderRadius: '0.375rem'
                        }
                    }}
                    className="rounded-md border"
                />
            </div>

            <Card>
                <CardContent className="pt-6">
                    {loading ? (
                        <div className="text-center py-4">Loading shifts...</div>
                    ) : error ? (
                        <div className="text-red-600 py-4">{error}</div>
                    ) : shifts?.length === 0 ? (
                        <div className="text-gray-600 py-4">No shifts scheduled for this date</div>
                    ) : (
                        <div className="space-y-4">
                            <h2 className="font-semibold text-lg">
                                Shifts for {selectedDate.toLocaleDateString()}
                            </h2>
                            {shifts?.map(shift => (
                                <ShiftDetail key={shift.id} shift={shift} />
                            ))}
                        </div>
                    )}
                </CardContent>
            </Card>
        </div>
    );
};

export default BakerAvailability;