import * as React from "react";
import { format } from "date-fns";
import {
  Calendar as CalendarIcon,
  ChevronLeft,
  ChevronRight,
} from "lucide-react";
import { DateRange } from "react-day-picker";
import { cn } from "@/lib/utils";
import { Button } from "@/components/ui/button";
import { Calendar } from "@/components/ui/calendar";
import {
  Popover,
  PopoverContent,
  PopoverTrigger,
} from "@/components/ui/popover";

interface EnhancedDateRangePickerProps {
  value: DateRange;
  onChange: (date: DateRange) => void;
  className?: string;
}

export function EnhancedDateRangePicker({
  value,
  onChange,
  className,
}: EnhancedDateRangePickerProps) {
  const [isOpen, setIsOpen] = React.useState(false);

  // Navigation functions
  const goToPreviousDay = () => {
    if (value?.from) {
      const newFrom = new Date(value.from);
      newFrom.setDate(newFrom.getDate() - 1);
      const newTo = new Date(value.to || value.from);
      newTo.setDate(newTo.getDate() - 1);
      onChange({ from: newFrom, to: newTo });
    }
  };

  const goToNextDay = () => {
    if (value?.from) {
      const newFrom = new Date(value.from);
      newFrom.setDate(newFrom.getDate() + 1);
      const newTo = new Date(value.to || value.from);
      newTo.setDate(newTo.getDate() + 1);
      onChange({ from: newFrom, to: newTo });
    }
  };

  // Check if current range is today
  const isToday = () => {
    if (!value?.from) return false;
    const today = new Date();
    const fromDate = new Date(value.from);
    const toDate = new Date(value.to || value.from);

    return (
      fromDate.toDateString() === today.toDateString() &&
      toDate.toDateString() === today.toDateString()
    );
  };

  // Check if we can go to next day (hide when today is selected)
  const canGoToNextDay = () => {
    if (!value?.from) return false;
    const today = new Date();
    const fromDate = new Date(value.from);
    const toDate = new Date(value.to || value.from);

    // Hide button if today is selected
    return !isToday();
  };

  // Handle date selection with validation
  const handleDateSelect = (newValue: DateRange | undefined) => {
    if (!newValue) return;

    // Ensure we have valid dates
    if (newValue.from) {
      const fromDate = new Date(newValue.from);
      const toDate = newValue.to
        ? new Date(newValue.to)
        : new Date(newValue.from);

      // Set time to start and end of day
      fromDate.setHours(0, 0, 0, 0);
      toDate.setHours(23, 59, 59, 999);

      onChange({ from: fromDate, to: toDate });
    }
  };

  return (
    <div className={cn("flex flex-col items-center space-y-3", className)}>
      {/* Navigation Buttons */}
      <div className="flex items-center gap-2">
        <Button
          variant="outline"
          size="icon"
          onClick={goToPreviousDay}
          className="h-8 w-8"
          disabled={!value?.from}
        >
          <ChevronLeft className="h-4 w-4" />
        </Button>

        {/* Date Range Picker */}
        <Popover open={isOpen} onOpenChange={setIsOpen}>
          <PopoverTrigger asChild>
            <Button
              variant={isToday() ? "default" : "outline"}
              className={cn(
                "min-w-[200px] justify-start text-left font-normal",
                !value && "text-muted-foreground"
              )}
            >
              <CalendarIcon className="mr-2 h-4 w-4" />
              {value?.from ? (
                value.to &&
                value.from.toDateString() !== value.to.toDateString() ? (
                  <>
                    {format(value.from, "MMM dd")} -{" "}
                    {format(value.to, "MMM dd, y")}
                  </>
                ) : (
                  format(value.from, "MMM dd, y")
                )
              ) : (
                <span>Pick a date range</span>
              )}
              {isToday() && " (Today)"}
            </Button>
          </PopoverTrigger>
          <PopoverContent className="w-auto p-0" align="center">
            <Calendar
              initialFocus
              mode="range"
              defaultMonth={value?.from}
              selected={value}
              onSelect={handleDateSelect}
              numberOfMonths={1}
              disabled={(date) => {
                // Disable future dates
                return date > new Date();
              }}
            />
          </PopoverContent>
        </Popover>

        <Button
          variant="outline"
          size="icon"
          onClick={goToNextDay}
          className="h-8 w-8"
          disabled={!value?.from || !canGoToNextDay()}
        >
          <ChevronRight className="h-4 w-4" />
        </Button>
      </div>
    </div>
  );
}
