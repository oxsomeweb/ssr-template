import { useState } from "react";
import { format, addDays, isBefore, startOfDay } from "date-fns";
import { Calendar } from "@/components/ui/calendar";
import { motion } from "framer-motion";

const TIME_SLOTS = [
  "9:00 AM", "9:30 AM", "10:00 AM", "10:30 AM",
  "11:00 AM", "11:30 AM", "12:00 PM", "12:30 PM",
  "1:00 PM", "1:30 PM", "2:00 PM", "2:30 PM",
  "3:00 PM", "3:30 PM", "4:00 PM", "4:30 PM",
];

interface DateTimeSelectionProps {
  selectedDate: Date | undefined;
  selectedTime: string | null;
  onDateSelect: (date: Date | undefined) => void;
  onTimeSelect: (time: string) => void;
}

const DateTimeSelection = ({
  selectedDate,
  selectedTime,
  onDateSelect,
  onTimeSelect,
}: DateTimeSelectionProps) => {
  const today = startOfDay(new Date());

  return (
    <motion.div
      className="space-y-6"
      initial={{ opacity: 0, y: 15 }}
      animate={{ opacity: 1, y: 0 }}
      transition={{ duration: 0.3 }}
    >
      <div>
        <h3 className="font-heading text-lg font-semibold text-foreground mb-3">
          Select a Date
        </h3>
        <div className="flex justify-center">
          <Calendar
            mode="single"
            selected={selectedDate}
            onSelect={onDateSelect}
            disabled={(date) => isBefore(date, today)}
            className="rounded-lg border border-border bg-card p-3 pointer-events-auto"
          />
        </div>
      </div>

      {selectedDate && (
        <motion.div
          initial={{ opacity: 0, y: 10 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.25 }}
        >
          <h3 className="font-heading text-lg font-semibold text-foreground mb-3">
            Select a Time — {format(selectedDate, "EEEE, MMMM d")}
          </h3>
          <div className="grid grid-cols-3 sm:grid-cols-4 gap-2">
            {TIME_SLOTS.map((time) => (
              <button
                key={time}
                type="button"
                onClick={() => onTimeSelect(time)}
                className={`py-2.5 px-3 rounded-md text-sm font-medium transition-all ${
                  selectedTime === time
                    ? "bg-primary text-primary-foreground"
                    : "bg-card border border-border text-foreground hover:border-primary/50"
                }`}
              >
                {time}
              </button>
            ))}
          </div>
        </motion.div>
      )}
    </motion.div>
  );
};

export default DateTimeSelection;
