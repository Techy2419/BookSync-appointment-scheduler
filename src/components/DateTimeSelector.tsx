
import React from 'react';
import { format, addDays, startOfWeek, addWeeks } from 'date-fns';
import { Calendar } from '@/components/ui/calendar';
import { Card, CardContent } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { cn } from '@/lib/utils';
import { ChevronLeft, ChevronRight } from 'lucide-react';

interface DateTimeSelectorProps {
  selectedDate: Date | undefined;
  onDateChange: (date: Date | undefined) => void;
  selectedTime: string | null;
  onTimeChange: (time: string) => void;
  availableTimes: string[];
}

const DateTimeSelector: React.FC<DateTimeSelectorProps> = ({
  selectedDate,
  onDateChange,
  selectedTime,
  onTimeChange,
  availableTimes
}) => {
  const [currentMonth, setCurrentMonth] = React.useState<Date>(new Date());
  const [weekStart, setWeekStart] = React.useState<Date>(startOfWeek(new Date(), { weekStartsOn: 1 }));

  const handlePreviousWeek = () => {
    setWeekStart(addWeeks(weekStart, -1));
  };

  const handleNextWeek = () => {
    setWeekStart(addWeeks(weekStart, 1));
  };

  const disabledDates = { before: new Date() };

  return (
    <div className="mb-8">
      <h2 className="text-xl font-semibold mb-4">Select Date & Time</h2>
      
      <div className="flex flex-col md:flex-row gap-6">
        {/* Calendar */}
        <Card className="flex-1">
          <CardContent className="pt-6">
            <Calendar
              mode="single"
              selected={selectedDate}
              onSelect={onDateChange}
              disabled={disabledDates}
              month={currentMonth}
              onMonthChange={setCurrentMonth}
              className={cn("p-3 pointer-events-auto rounded-md border")}
            />
          </CardContent>
        </Card>

        {/* Time Slots */}
        <Card className="flex-1">
          <CardContent className="pt-6">
            <div className="flex items-center justify-between mb-4">
              <Button variant="outline" size="icon" onClick={handlePreviousWeek}>
                <ChevronLeft className="h-4 w-4" />
              </Button>
              <span className="text-sm font-medium">
                {format(weekStart, 'MMM d')} - {format(addDays(weekStart, 6), 'MMM d')}
              </span>
              <Button variant="outline" size="icon" onClick={handleNextWeek}>
                <ChevronRight className="h-4 w-4" />
              </Button>
            </div>

            {selectedDate ? (
              <div className="grid grid-cols-2 sm:grid-cols-3 gap-2">
                {availableTimes.map((time) => (
                  <Button
                    key={time}
                    variant={selectedTime === time ? "default" : "outline"}
                    className={cn(
                      "w-full",
                      selectedTime === time 
                        ? "bg-primary text-primary-foreground" 
                        : "hover:bg-primary/10"
                    )}
                    onClick={() => onTimeChange(time)}
                  >
                    {time}
                  </Button>
                ))}
              </div>
            ) : (
              <div className="flex h-40 items-center justify-center text-muted-foreground">
                Please select a date first
              </div>
            )}
          </CardContent>
        </Card>
      </div>
    </div>
  );
};

export default DateTimeSelector;
