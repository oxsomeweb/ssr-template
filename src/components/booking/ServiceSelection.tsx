import { motion } from "framer-motion";
import { Check } from "lucide-react";
import type { Tables } from "@/integrations/supabase/types";

type Service = Tables<"services">;

interface FeatureGroup {
  label: string;
  items: string[];
}

interface ServiceSelectionProps {
  services: Service[];
  selectedServiceId: string | null;
  onSelect: (id: string) => void;
}

const ServiceSelection = ({ services, selectedServiceId, onSelect }: ServiceSelectionProps) => {
  return (
    <div className="space-y-3">
      {services.map((service, i) => {
        const isSelected = selectedServiceId === service.id;
        const featureGroups = (service.feature_groups as unknown as FeatureGroup[] | null) || [];

        return (
          <motion.button
            key={service.id}
            type="button"
            onClick={() => onSelect(service.id)}
            className={`w-full text-left p-5 rounded-lg border transition-all duration-200 ${
              isSelected
                ? "border-primary bg-primary/5 ring-1 ring-primary"
                : "border-border hover:border-muted-foreground/40 bg-card"
            }`}
            initial={{ opacity: 0, y: 15 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.3, delay: i * 0.05 }}
          >
            <div className="flex items-start justify-between gap-4">
              <div className="flex-1 min-w-0">
                <h3 className="font-heading text-lg font-bold text-foreground">
                  {service.title}
                </h3>
                {service.description && (
                  <p className="text-muted-foreground text-sm mt-1 line-clamp-2">
                    {service.description}
                  </p>
                )}
                {featureGroups.length > 0 && (
                  <div className="mt-2 space-y-1">
                    {featureGroups.map((group) => (
                      <div key={group.label}>
                        <span className="text-sm font-semibold text-foreground">{group.label}</span>
                        <ul className="list-disc list-inside text-muted-foreground text-sm ml-1">
                          {group.items.slice(0, 2).map((item) => (
                            <li key={item}>{item}</li>
                          ))}
                          {group.items.length > 2 && (
                            <li className="text-muted-foreground/60">
                              +{group.items.length - 2} more...
                            </li>
                          )}
                        </ul>
                      </div>
                    ))}
                  </div>
                )}
                <div className="flex items-center gap-3 mt-2">
                  <span className="text-primary font-bold text-sm">{service.price_label}</span>
                  <span className="text-muted-foreground text-xs">・ {service.duration}</span>
                </div>
              </div>
              <div
                className={`flex-shrink-0 w-6 h-6 rounded-full border-2 flex items-center justify-center transition-colors ${
                  isSelected
                    ? "border-primary bg-primary"
                    : "border-muted-foreground/30"
                }`}
              >
                {isSelected && <Check className="w-3.5 h-3.5 text-primary-foreground" />}
              </div>
            </div>
          </motion.button>
        );
      })}
    </div>
  );
};

export default ServiceSelection;
