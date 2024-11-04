// components/schedule/ShiftCalendar.jsx
import React from 'react';
import { Card, CardHeader, CardTitle, CardContent } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { ChevronLeft, ChevronRight, Plus } from 'lucide-react';

const ShiftCalendar = ({ shifts, onShiftClick, onNewShift, userRole }) => {
  const [currentDate, setCurrentDate] = React.useState(new Date());
  const [view, setView] = React.useState('week'); // 'week' or 'month'

  const weekDays = ['Sun', 'Mon', 'Tue', 'Wed', 'Thu', 'Fri', 'Sat'];
  const currentMonth = currentDate.toLocaleString('default', { month: 'long' });
  const currentYear = currentDate.getFullYear();

  const handlePrevious = () => {
    const newDate = new Date(currentDate);
    newDate.setDate(newDate.getDate() - (view === 'week' ? 7 : 30));
    setCurrentDate(newDate);
  };

  const handleNext = () => {
    const newDate = new Date(currentDate);
    newDate.setDate(newDate.getDate() + (view === 'week' ? 7 : 30));
    setCurrentDate(newDate);
  };

  return (
    <Card className="h-full">
      <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-4">
        <CardTitle>Schedule</CardTitle>
        <div className="flex items-center gap-2">
          {(userRole === 'admin' || userRole === 'manager') && (
            <Button 
              variant="outline" 
              size="icon"
              onClick={onNewShift}
            >
              <Plus className="h-4 w-4" />
            </Button>
          )}
          <div className="flex items-center gap-1">
            <Button
              variant="outline"
              size="icon"
              onClick={handlePrevious}
            >
              <ChevronLeft className="h-4 w-4" />
            </Button>
            <div className="w-40 text-center font-medium">
              {currentMonth} {currentYear}
            </div>
            <Button
              variant="outline"
              size="icon"
              onClick={handleNext}
            >
              <ChevronRight className="h-4 w-4" />
            </Button>
          </div>
          <Button
            variant="outline"
            size="sm"
            onClick={() => setView(view === 'week' ? 'month' : 'week')}
          >
            {view === 'week' ? 'Month' : 'Week'}
          </Button>
        </div>
      </CardHeader>
      <CardContent>
        <div className="grid grid-cols-7 gap-1">
          {/* Header */}
          {weekDays.map(day => (
            <div
              key={day}
              className="p-2 text-center text-sm font-medium text-gray-600"
            >
              {day}
            </div>
          ))}
          
          {/* Calendar Cells */}
          {[...Array(view === 'week' ? 7 : 35)].map((_, index) => {
            const date = new Date(currentDate);
            date.setDate(date.getDate() - date.getDay() + index);
            
            const dayShifts = shifts.filter(shift => 
              new Date(shift.date).toDateString() === date.toDateString()
            );

            return (
              <div
                key={index}
                className={`min-h-[100px] p-1 border rounded-lg ${
                  date.toDateString() === new Date().toDateString()
                    ? 'bg-primary/5 border-primary'
                    : 'bg-white'
                }`}
              >
                <div className="text-right text-sm text-gray-600">
                  {date.getDate()}
                </div>
                <div className="space-y-1">
                  {dayShifts.map(shift => (
                    <button
                      key={shift.id}
                      onClick={() => onShiftClick(shift)}
                      className={`w-full text-left p-1 text-xs rounded ${
                        shift.staffed 
                          ? 'bg-green-100 text-green-800'
                          : 'bg-yellow-100 text-yellow-800'
                      }`}
                    >
                      {shift.type} ({shift.assigned}/{shift.required})
                    </button>
                  ))}
                </div>
              </div>
            );
          })}
        </div>
      </CardContent>
    </Card>
  );
};

export default ShiftCalendar;
