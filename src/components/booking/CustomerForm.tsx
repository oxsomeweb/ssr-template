import { motion } from "framer-motion";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Textarea } from "@/components/ui/textarea";

export interface CustomerData {
  name: string;
  email: string;
  phone: string;
  vehicleMake: string;
  vehicleModel: string;
  vehicleYear: string;
  vehicleColor: string;
  notes: string;
  firstTimeClient: boolean;
}

interface CustomerFormProps {
  data: CustomerData;
  onChange: (data: CustomerData) => void;
  errors: Partial<Record<keyof CustomerData, string>>;
}

const CustomerForm = ({ data, onChange, errors }: CustomerFormProps) => {
  const update = (field: Exclude<keyof CustomerData, "firstTimeClient">, value: string) => {
    onChange({ ...data, [field]: value });
  };

  return (
    <motion.div
      className="space-y-5"
      initial={{ opacity: 0, y: 15 }}
      animate={{ opacity: 1, y: 0 }}
      transition={{ duration: 0.3 }}
    >
      <h3 className="font-heading text-lg font-semibold text-foreground">
        Your Information
      </h3>

      <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
        <div className="space-y-1.5">
          <Label htmlFor="name">Full Name *</Label>
          <Input
            id="name"
            value={data.name}
            onChange={(e) => update("name", e.target.value)}
            placeholder="John Doe"
          />
          {errors.name && <p className="text-destructive text-xs">{errors.name}</p>}
        </div>
        <div className="space-y-1.5">
          <Label htmlFor="phone">Phone *</Label>
          <Input
            id="phone"
            type="tel"
            value={data.phone}
            onChange={(e) => update("phone", e.target.value)}
            placeholder="(916) 555-0123"
          />
          {errors.phone && <p className="text-destructive text-xs">{errors.phone}</p>}
        </div>
      </div>

      <div className="space-y-1.5">
        <Label htmlFor="email">Email *</Label>
        <Input
          id="email"
          type="email"
          value={data.email}
          onChange={(e) => update("email", e.target.value)}
          placeholder="john@example.com"
        />
        {errors.email && <p className="text-destructive text-xs">{errors.email}</p>}
      </div>

      <h3 className="font-heading text-lg font-semibold text-foreground pt-2">
        Vehicle Details
      </h3>

      <div className="grid grid-cols-2 sm:grid-cols-4 gap-4">
        <div className="space-y-1.5">
          <Label htmlFor="vehicleYear">Year</Label>
          <Input
            id="vehicleYear"
            value={data.vehicleYear}
            onChange={(e) => update("vehicleYear", e.target.value)}
            placeholder="2024"
          />
        </div>
        <div className="space-y-1.5">
          <Label htmlFor="vehicleMake">Make</Label>
          <Input
            id="vehicleMake"
            value={data.vehicleMake}
            onChange={(e) => update("vehicleMake", e.target.value)}
            placeholder="Toyota"
          />
        </div>
        <div className="space-y-1.5">
          <Label htmlFor="vehicleModel">Model</Label>
          <Input
            id="vehicleModel"
            value={data.vehicleModel}
            onChange={(e) => update("vehicleModel", e.target.value)}
            placeholder="Camry"
          />
        </div>
        <div className="space-y-1.5">
          <Label htmlFor="vehicleColor">Color</Label>
          <Input
            id="vehicleColor"
            value={data.vehicleColor}
            onChange={(e) => update("vehicleColor", e.target.value)}
            placeholder="Black"
          />
        </div>
      </div>

      <div className="space-y-1.5">
        <Label htmlFor="notes">Additional Notes</Label>
        <Textarea
          id="notes"
          value={data.notes}
          onChange={(e) => update("notes", e.target.value)}
          placeholder="Any special requests or details about your vehicle..."
          rows={3}
        />
      </div>

      <label
        htmlFor="firstTimeClient"
        className="flex cursor-pointer items-center gap-3 border border-border bg-card p-4 rounded-none transition-colors hover:border-primary/60"
      >
        <input
          id="firstTimeClient"
          name="first_time_client"
          type="checkbox"
          checked={data.firstTimeClient}
          onChange={(e) => onChange({ ...data, firstTimeClient: e.target.checked })}
          className="h-5 w-5 rounded-none accent-primary"
        />
        <span className="font-body text-sm font-bold uppercase tracking-widest text-foreground">
          I am a first time client
        </span>
      </label>
    </motion.div>
  );
};

export default CustomerForm;
