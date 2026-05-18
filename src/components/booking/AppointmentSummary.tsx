import { motion } from "framer-motion";
import type { Tables } from "@/integrations/supabase/types";
import type { CustomerData } from "./CustomerForm";

interface AppointmentSummaryProps {
  service: Tables<"services"> | null;
  selectedServiceId: string | null;
  date: Date | undefined;
  time: string | null;
  customer?: CustomerData;
  step: number;
}

const AppointmentSummary = ({
  service,
  selectedServiceId,
  date,
  time,
  step,
}: AppointmentSummaryProps) => {
  return (
    <motion.div
      className="rounded-lg border border-border bg-card p-5 sticky top-24"
      initial={{ opacity: 0, x: 20 }}
      animate={{ opacity: 1, x: 0 }}
      transition={{ duration: 0.3 }}
    >
      <h3 className="font-heading text-lg font-bold text-foreground mb-4">
        Appointment summary
      </h3>

      {!selectedServiceId ? (
        <p className="text-muted-foreground text-sm">No services added yet</p>
      ) : (
        <div className="space-y-3">
          {service && (
            <div className="border-b border-border pb-3">
              <p className="font-semibold text-foreground text-sm">{service.title}</p>
              <p className="text-muted-foreground text-xs">
                {service.price_label} ・ {service.duration}
              </p>
            </div>
          )}
          {date && (
            <div className="border-b border-border pb-3">
              <p className="text-foreground text-sm">
                {date.toLocaleDateString("en-US", {
                  weekday: "long",
                  month: "long",
                  day: "numeric",
                })}
              </p>
              {time && <p className="text-primary text-sm font-medium">{time}</p>}
            </div>
          )}
        </div>
      )}
    </motion.div>
  );
};

export default AppointmentSummary;
