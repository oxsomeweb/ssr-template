import { Shield, Leaf, Car, MapPin } from "lucide-react";

const stats = [
  { icon: Shield, keyword: "100%", label: "Client Satisfaction" },
  { icon: Leaf, keyword: "Eco-Friendly", label: "Products Used" },
  { icon: Car, keyword: "Mobile", label: "We Come to You" },
  { icon: MapPin, keyword: "Sacramento", label: "& Surrounding Areas" },
];

const TrustBar = () => {
  return (
    <section className="bg-primary">
      <div className="container px-4 py-6">
        <div className="grid grid-cols-2 md:grid-cols-4 gap-6 md:gap-0 md:divide-x divide-primary-foreground/20">
          {stats.map((stat) => (
            <div key={stat.keyword} className="flex flex-col items-center text-center px-4">
              <stat.icon className="w-5 h-5 text-primary-foreground mb-2" />
              <span className="font-heading text-lg md:text-xl font-bold text-primary-foreground">
                {stat.keyword}
              </span>
              <span className="font-body text-xs uppercase tracking-widest text-primary-foreground/70 mt-1">
                {stat.label}
              </span>
            </div>
          ))}
        </div>
      </div>
    </section>
  );
};

export default TrustBar;
