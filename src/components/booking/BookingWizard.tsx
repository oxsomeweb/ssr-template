import { useState, useRef } from "react";
import { useQuery, useMutation } from "@tanstack/react-query";
import { format } from "date-fns";
import { motion, AnimatePresence } from "framer-motion";
import { ArrowLeft, CheckCircle2, Loader2 } from "lucide-react";
import { supabase } from "@/integrations/supabase/client";
import { Button } from "@/components/ui/button";
import { toast } from "@/hooks/use-toast";
import ServiceSelection from "./ServiceSelection";
import DateTimeSelection from "./DateTimeSelection";
import CustomerForm, { type CustomerData } from "./CustomerForm";
import AppointmentSummary from "./AppointmentSummary";

const STEPS = ["Service", "Date & Time", "Your Details", "Confirmed"];

const BookingWizard = () => {
  const formRef = useRef<HTMLFormElement>(null);
  const [step, setStep] = useState(0);
  const [selectedServiceId, setSelectedServiceId] = useState<string | null>(null);
  const [selectedDate, setSelectedDate] = useState<Date | undefined>();
  const [selectedTime, setSelectedTime] = useState<string | null>(null);
  const [customer, setCustomer] = useState<CustomerData>({
    name: "",
    email: "",
    phone: "",
    vehicleMake: "",
    vehicleModel: "",
    vehicleYear: "",
    vehicleColor: "",
    notes: "",
    firstTimeClient: false,
  });
  const [errors, setErrors] = useState<Partial<Record<keyof CustomerData, string>>>({});

  const { data: services = [], isLoading } = useQuery({
    queryKey: ["services"],
    queryFn: async () => {
      const { data, error } = await supabase
        .from("services")
        .select("*")
        .eq("is_active", true)
        .order("sort_order");
      if (error) throw error;
      return data;
    },
  });

  const selectedService = services.find((s) => s.id === selectedServiceId) || null;

  const bookMutation = useMutation({
    mutationFn: async () => {
      if (!selectedServiceId || !selectedDate || !selectedTime) throw new Error("Missing fields");

      const { error } = await supabase.from("appointments").insert({
        service_id: selectedServiceId,
        appointment_date: format(selectedDate, "yyyy-MM-dd"),
        appointment_time: selectedTime,
        customer_name: customer.name.trim(),
        customer_email: customer.email.trim(),
        customer_phone: customer.phone.trim(),
        vehicle_make: customer.vehicleMake.trim() || null,
        vehicle_model: customer.vehicleModel.trim() || null,
        vehicle_year: customer.vehicleYear.trim() || null,
        vehicle_color: customer.vehicleColor.trim() || null,
        notes: [customer.firstTimeClient ? "First-time client: Yes" : "First-time client: No", customer.notes.trim()]
          .filter(Boolean)
          .join("\n") || null,
      });
      if (error) throw error;
    },
    onSuccess: () => {
      setStep(3);
    },
    onError: () => {
      toast({
        title: "Booking failed",
        description: "Something went wrong. Please try again.",
        variant: "destructive",
      });
    },
  });

  const validateCustomer = (): boolean => {
    const newErrors: Partial<Record<keyof CustomerData, string>> = {};
    if (!customer.name.trim()) newErrors.name = "Name is required";
    if (!customer.email.trim()) newErrors.email = "Email is required";
    else if (!/^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(customer.email.trim()))
      newErrors.email = "Invalid email";
    if (!customer.phone.trim()) newErrors.phone = "Phone is required";
    setErrors(newErrors);
    return Object.keys(newErrors).length === 0;
  };

  const canProceed = () => {
    if (step === 0) return !!selectedServiceId;
    if (step === 1) return !!selectedDate && !!selectedTime;
    if (step === 2) return true;
    return false;
  };

  const handleNext = () => {
    if (step === 2) {
      if (!validateCustomer()) return;
      // Dispatch native submit event so Oxsome lead capture script intercepts it
      if (formRef.current) {
        formRef.current.dispatchEvent(new Event("submit", { bubbles: true, cancelable: true }));
      }
      bookMutation.mutate();
      return;
    }
    setStep((s) => s + 1);
  };

  const handleBack = () => setStep((s) => Math.max(0, s - 1));

  if (isLoading) {
    return (
      <div className="flex items-center justify-center py-20">
        <Loader2 className="w-6 h-6 animate-spin text-primary" />
      </div>
    );
  }

  return (
    <form
      ref={formRef}
      name="booking-form"
      data-oxsome-form="booking"
      onSubmit={(e) => e.preventDefault()}
      className="grid grid-cols-1 lg:grid-cols-3 gap-8"
    >
      {/* Visually-hidden fields for Oxsome lead capture (script skips type=hidden) */}
      <div className="sr-only" aria-hidden="true">
        <input type="text" tabIndex={-1} name="service" readOnly value={selectedService?.title || ""} />
        <input type="text" tabIndex={-1} name="service_price" readOnly value={selectedService?.price_label || ""} />
        <input type="text" tabIndex={-1} name="appointment_date" readOnly value={selectedDate ? format(selectedDate, "yyyy-MM-dd") : ""} />
        <input type="text" tabIndex={-1} name="appointment_time" readOnly value={selectedTime || ""} />
        <input type="text" tabIndex={-1} name="first_time_client" readOnly value={customer.firstTimeClient ? "Yes" : "No"} />
        <input type="text" tabIndex={-1} name="vehicle" readOnly value={`${customer.vehicleYear} ${customer.vehicleMake} ${customer.vehicleModel} ${customer.vehicleColor}`.trim()} />
        <input type="text" tabIndex={-1} name="notes" readOnly value={customer.notes} />
      </div>
      <div className="lg:col-span-2">
        <div className="flex items-center gap-2 mb-8">
          {STEPS.slice(0, 3).map((label, i) => (
            <div key={label} className="flex items-center gap-2">
              <div
                className={`w-8 h-8 rounded-full flex items-center justify-center text-sm font-bold transition-colors ${
                  i < step
                    ? "bg-primary text-primary-foreground"
                    : i === step
                    ? "bg-primary text-primary-foreground"
                    : "bg-muted text-muted-foreground"
                }`}
              >
                {i < step ? <CheckCircle2 className="w-4 h-4" /> : i + 1}
              </div>
              <span
                className={`text-sm hidden sm:inline ${
                  i <= step ? "text-foreground font-medium" : "text-muted-foreground"
                }`}
              >
                {label}
              </span>
              {i < 2 && <div className="w-8 h-px bg-border" />}
            </div>
          ))}
        </div>

        <AnimatePresence mode="wait">
          {step === 0 && (
            <motion.div key="step0" exit={{ opacity: 0, x: -20 }} transition={{ duration: 0.2 }}>
              <h2 className="font-heading text-2xl font-bold text-foreground mb-4">
                Select a Service
              </h2>
              <ServiceSelection
                services={services}
                selectedServiceId={selectedServiceId}
                onSelect={setSelectedServiceId}
              />
            </motion.div>
          )}

          {step === 1 && (
            <motion.div key="step1" exit={{ opacity: 0, x: -20 }} transition={{ duration: 0.2 }}>
              <h2 className="font-heading text-2xl font-bold text-foreground mb-4">
                Pick a Date & Time
              </h2>
              <DateTimeSelection
                selectedDate={selectedDate}
                selectedTime={selectedTime}
                onDateSelect={setSelectedDate}
                onTimeSelect={setSelectedTime}
              />
            </motion.div>
          )}

          {step === 2 && (
            <motion.div key="step2" exit={{ opacity: 0, x: -20 }} transition={{ duration: 0.2 }}>
              <CustomerForm data={customer} onChange={setCustomer} errors={errors} />
            </motion.div>
          )}

          {step === 3 && (
            <motion.div
              key="step3"
              className="text-center py-16"
              initial={{ opacity: 0, scale: 0.95 }}
              animate={{ opacity: 1, scale: 1 }}
              transition={{ duration: 0.4 }}
            >
              <CheckCircle2 className="w-16 h-16 text-primary mx-auto mb-4" />
              <h2 className="font-heading text-3xl font-bold text-foreground mb-2">
                Booking Confirmed!
              </h2>
              <p className="text-muted-foreground max-w-md mx-auto">
                Thank you, {customer.name}! Your {selectedService?.title} appointment on{" "}
                {selectedDate?.toLocaleDateString("en-US", {
                  weekday: "long",
                  month: "long",
                  day: "numeric",
                })}{" "}
                at {selectedTime} has been submitted. We'll be in touch soon to confirm.
              </p>
            </motion.div>
          )}
        </AnimatePresence>

        {/* Navigation */}
        {step < 3 && (
          <div className="flex items-center justify-between mt-8 pt-6 border-t border-border">
            {step > 0 ? (
              <Button type="button" variant="ghost" onClick={handleBack}>
                <ArrowLeft className="w-4 h-4 mr-1" /> Back
              </Button>
            ) : (
              <div />
            )}
            <Button
              type="button"
              onClick={handleNext}
              disabled={!canProceed() || bookMutation.isPending}
              className="min-w-[120px]"
            >
              {bookMutation.isPending ? (
                <Loader2 className="w-4 h-4 animate-spin" />
              ) : step === 2 ? (
                "Book Appointment"
              ) : (
                "Next"
              )}
            </Button>
          </div>
        )}
      </div>

      {/* Sidebar summary */}
      {step < 3 && (
        <div className="hidden lg:block">
          <AppointmentSummary
            service={selectedService}
            selectedServiceId={selectedServiceId}
            date={selectedDate}
            time={selectedTime}
            customer={customer}
            step={step}
          />
        </div>
      )}
    </form>
  );
};

export default BookingWizard;
