const paymentMethods = [
  "Cash App",
  "Apple Pay",
  "Google Pay",
  "Visa",
  "Mastercard",
  "American Express",
  "Discover",
  "JCB",
];

const PaymentMethodsSection = () => {
  return (
    <section className="py-12 bg-background border-t border-border/40">
      <div className="container">
        <h3 className="font-heading text-lg font-semibold text-center text-muted-foreground mb-6">
          Payment Methods
        </h3>
        <div className="flex items-center justify-center gap-3 flex-wrap">
          {paymentMethods.map((name) => (
            <span
              key={name}
              className="inline-flex h-9 min-w-20 items-center justify-center rounded-none border border-border bg-card px-3 font-heading text-xs font-semibold text-muted-foreground transition-colors hover:border-primary hover:text-foreground"
              aria-label={name}
            >
              {name}
            </span>
          ))}
        </div>
      </div>
    </section>
  );
};

export default PaymentMethodsSection;
