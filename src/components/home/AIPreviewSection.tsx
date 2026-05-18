import { useState, useRef, useCallback } from "react";
import { motion, AnimatePresence } from "framer-motion";
import { Upload, Sparkles, Camera, X, Loader2, ChevronRight } from "lucide-react";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { supabase } from "@/integrations/supabase/client";
import { toast } from "sonner";

const SERVICE_MODES = [
  { id: "full-detail", label: "Full Detail", desc: "Complete interior & exterior transformation" },
  { id: "scratch-removal", label: "Paint Correction", desc: "Remove scratches, swirls & imperfections" },
  { id: "ceramic-coating", label: "Ceramic Coating", desc: "Deep glass-like wet shine finish" },
] as const;

type Mode = (typeof SERVICE_MODES)[number]["id"];

const AIPreviewSection = () => {
  const [originalImage, setOriginalImage] = useState<string | null>(null);
  const [resultImage, setResultImage] = useState<string | null>(null);
  const [mode, setMode] = useState<Mode>("full-detail");
  const [isProcessing, setIsProcessing] = useState(false);
  const [sliderPos, setSliderPos] = useState(50);
  const [isDragging, setIsDragging] = useState(false);
  const [showLeadForm, setShowLeadForm] = useState(false);
  const [leadSubmitted, setLeadSubmitted] = useState(false);
  const [leadForm, setLeadForm] = useState({ name: "", email: "", phone: "" });
  const [submittingLead, setSubmittingLead] = useState(false);

  const fileInputRef = useRef<HTMLInputElement>(null);
  const comparisonRef = useRef<HTMLDivElement>(null);

  const handleFileSelect = useCallback((e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (!file) return;
    if (!file.type.startsWith("image/")) { toast.error("Please upload an image file"); return; }
    if (file.size > 10 * 1024 * 1024) { toast.error("Image must be under 10MB"); return; }
    const reader = new FileReader();
    reader.onload = (ev) => {
      setOriginalImage(ev.target?.result as string);
      setResultImage(null);
      setShowLeadForm(false);
      setLeadSubmitted(false);
      setSliderPos(50);
    };
    reader.readAsDataURL(file);
  }, []);

  const handleGenerate = async () => {
    if (!originalImage) return;
    setIsProcessing(true);
    setResultImage(null);
    try {
      const { data, error } = await supabase.functions.invoke("ai-detailing-preview", {
        body: { imageBase64: originalImage, mode },
      });
      if (error) throw new Error(error.message || "Failed to process");
      if (data?.error) throw new Error(data.error);
      setResultImage(data.image);
      setTimeout(() => setShowLeadForm(true), 1500);
    } catch (err: any) {
      toast.error(err.message || "Something went wrong. Please try again.");
    } finally {
      setIsProcessing(false);
    }
  };

  const handleSlider = useCallback((e: React.MouseEvent | React.TouchEvent) => {
    if (!comparisonRef.current) return;
    const rect = comparisonRef.current.getBoundingClientRect();
    const clientX = "touches" in e ? e.touches[0].clientX : e.clientX;
    const pos = ((clientX - rect.left) / rect.width) * 100;
    setSliderPos(Math.max(0, Math.min(100, pos)));
  }, []);

  const handleLeadSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!leadForm.name || !leadForm.email || !leadForm.phone) { toast.error("Please fill out all fields"); return; }
    setSubmittingLead(true);
    try {
      const { error } = await supabase.from("leads").insert({
        name: leadForm.name, email: leadForm.email, phone: leadForm.phone, source: "ai-detailing-tool",
      });
      if (error) throw error;
      setLeadSubmitted(true);
      toast.success("We'll be in touch soon!");
    } catch {
      toast.error("Something went wrong. Please try again.");
    } finally {
      setSubmittingLead(false);
    }
  };

  const resetTool = () => {
    setOriginalImage(null);
    setResultImage(null);
    setShowLeadForm(false);
    setLeadSubmitted(false);
    setSliderPos(50);
    if (fileInputRef.current) fileInputRef.current.value = "";
  };

  return (
    <section className="py-16 md:py-24 bg-muted/30">
      <div className="container max-w-4xl">
        {/* Header */}
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true }}
          className="text-center mb-10"
        >
          <div className="inline-flex items-center gap-2 bg-primary/10 text-primary px-4 py-1.5 rounded-full text-sm font-bold uppercase tracking-widest mb-4">
            <Sparkles className="w-4 h-4" />
            AI-Powered Preview
          </div>
          <h2 className="font-heading text-3xl md:text-4xl font-bold text-foreground mb-3">
            See Your Car <span className="text-primary">Transformed</span>
          </h2>
          <p className="text-muted-foreground text-lg max-w-2xl mx-auto">
            Upload a photo of your ride and our AI will show you what it'd look like
            after a premium Drippy Suds detail. Free, instant, no strings attached.
          </p>
        </motion.div>

        {/* Upload Area */}
        {!originalImage ? (
          <motion.div
            initial={{ opacity: 0, scale: 0.95 }}
            whileInView={{ opacity: 1, scale: 1 }}
            viewport={{ once: true }}
            className="border-2 border-dashed border-border rounded-lg p-12 text-center hover:border-primary/50 transition-colors cursor-pointer bg-background"
            onClick={() => fileInputRef.current?.click()}
          >
            <input ref={fileInputRef} type="file" accept="image/*" className="hidden" onChange={handleFileSelect} />
            <div className="flex flex-col items-center gap-4">
              <div className="w-16 h-16 rounded-full bg-primary/10 flex items-center justify-center">
                <Camera className="w-8 h-8 text-primary" />
              </div>
              <div>
                <p className="text-foreground font-bold text-lg">Drop your car photo here</p>
                <p className="text-muted-foreground text-sm mt-1">or tap to browse · JPG, PNG up to 10MB</p>
              </div>
              <Button variant="outline" className="mt-2">
                <Upload className="w-4 h-4 mr-2" /> Choose Photo
              </Button>
            </div>
          </motion.div>
        ) : (
          <div className="space-y-6">
            {/* Mode Selector */}
            {!resultImage && (
              <motion.div initial={{ opacity: 0 }} animate={{ opacity: 1 }} className="space-y-4">
                <div className="flex items-center justify-between">
                  <h3 className="font-heading text-xl font-bold text-foreground">Choose a service to preview</h3>
                  <button onClick={resetTool} className="text-muted-foreground hover:text-foreground text-sm flex items-center gap-1">
                    <X className="w-4 h-4" /> Start over
                  </button>
                </div>
                <div className="grid grid-cols-1 sm:grid-cols-3 gap-3">
                  {SERVICE_MODES.map((m) => (
                    <button
                      key={m.id}
                      onClick={() => setMode(m.id)}
                      className={`p-4 rounded-lg border-2 text-left transition-all ${
                        mode === m.id ? "border-primary bg-primary/10" : "border-border hover:border-primary/30"
                      }`}
                    >
                      <p className="font-bold text-foreground text-sm">{m.label}</p>
                      <p className="text-muted-foreground text-xs mt-1">{m.desc}</p>
                    </button>
                  ))}
                </div>
                <div className="relative rounded-lg overflow-hidden">
                  <img src={originalImage} alt="Your car" className="w-full rounded-lg" />
                </div>
                <Button onClick={handleGenerate} disabled={isProcessing} className="w-full h-12 text-base font-bold uppercase tracking-widest">
                  {isProcessing ? (
                    <><Loader2 className="w-5 h-5 animate-spin mr-2" /> AI is working its magic…</>
                  ) : (
                    <><Sparkles className="w-5 h-5 mr-2" /> Generate Preview</>
                  )}
                </Button>
              </motion.div>
            )}

            {/* Loading */}
            {isProcessing && (
              <motion.div initial={{ opacity: 0 }} animate={{ opacity: 1 }} className="rounded-lg bg-card p-8 text-center">
                <Loader2 className="w-12 h-12 animate-spin text-primary mx-auto mb-4" />
                <p className="text-foreground font-bold text-lg">Detailing your ride…</p>
                <p className="text-muted-foreground text-sm mt-1">This usually takes 15-30 seconds</p>
              </motion.div>
            )}

            {/* Before/After Slider */}
            {resultImage && (
              <motion.div initial={{ opacity: 0, y: 20 }} animate={{ opacity: 1, y: 0 }}>
                <div className="flex items-center justify-between mb-4">
                  <h3 className="font-heading text-xl font-bold text-foreground">Before & After</h3>
                  <button onClick={resetTool} className="text-muted-foreground hover:text-foreground text-sm flex items-center gap-1">
                    <X className="w-4 h-4" /> Try another
                  </button>
                </div>
                <div
                  ref={comparisonRef}
                  className="relative rounded-lg overflow-hidden cursor-col-resize select-none touch-none"
                  onMouseDown={() => setIsDragging(true)}
                  onMouseUp={() => setIsDragging(false)}
                  onMouseLeave={() => setIsDragging(false)}
                  onMouseMove={(e) => isDragging && handleSlider(e)}
                  onTouchStart={() => setIsDragging(true)}
                  onTouchEnd={() => setIsDragging(false)}
                  onTouchMove={(e) => handleSlider(e)}
                  onClick={handleSlider}
                >
                  <img src={resultImage} alt="After detailing" className="w-full block" />
                  <img src={originalImage} alt="Before detailing" className="absolute inset-0 w-full h-full object-cover" style={{ clipPath: `inset(0 ${100 - sliderPos}% 0 0)` }} />
                  <div className="absolute top-0 bottom-0 w-0.5 bg-foreground/80 z-10" style={{ left: `${sliderPos}%` }}>
                    <div className="absolute top-1/2 -translate-y-1/2 -translate-x-1/2 w-10 h-10 bg-foreground rounded-full flex items-center justify-center shadow-lg">
                      <ChevronRight className="w-4 h-4 text-background -ml-1" />
                      <ChevronRight className="w-4 h-4 text-background -ml-3 rotate-180" />
                    </div>
                  </div>
                  <div className="absolute top-3 left-3 bg-background/80 backdrop-blur-sm text-foreground text-xs font-bold uppercase tracking-widest px-3 py-1 rounded">Before</div>
                  <div className="absolute top-3 right-3 bg-primary/80 backdrop-blur-sm text-primary-foreground text-xs font-bold uppercase tracking-widest px-3 py-1 rounded">After</div>
                </div>

                {/* Lead Form */}
                <AnimatePresence>
                  {showLeadForm && !leadSubmitted && (
                    <motion.div initial={{ opacity: 0, y: 30, scale: 0.95 }} animate={{ opacity: 1, y: 0, scale: 1 }} exit={{ opacity: 0, y: -10 }} transition={{ type: "spring", stiffness: 300, damping: 25 }} className="mt-8 relative">
                      <div className="absolute -inset-1 bg-primary/20 rounded-xl blur-lg animate-pulse" />
                      <div className="relative bg-card border border-primary/30 rounded-xl p-6 md:p-8">
                        <div className="text-center mb-6">
                          <Sparkles className="w-8 h-8 text-primary mx-auto mb-2" />
                          <h3 className="font-heading text-2xl font-bold text-foreground">Love how that looks?</h3>
                          <p className="text-muted-foreground mt-1">Get a free quote and we'll make it real. No pressure, no commitment.</p>
                        </div>
                        <form onSubmit={handleLeadSubmit} className="grid gap-4 sm:grid-cols-3">
                          <div>
                            <Label htmlFor="ai-lead-name" className="text-xs uppercase tracking-widest text-muted-foreground">Name</Label>
                            <Input id="ai-lead-name" placeholder="Your name" value={leadForm.name} onChange={(e) => setLeadForm((p) => ({ ...p, name: e.target.value }))} required maxLength={100} />
                          </div>
                          <div>
                            <Label htmlFor="ai-lead-phone" className="text-xs uppercase tracking-widest text-muted-foreground">Phone</Label>
                            <Input id="ai-lead-phone" type="tel" placeholder="(916) 555-0000" value={leadForm.phone} onChange={(e) => setLeadForm((p) => ({ ...p, phone: e.target.value }))} required maxLength={20} />
                          </div>
                          <div>
                            <Label htmlFor="ai-lead-email" className="text-xs uppercase tracking-widest text-muted-foreground">Email</Label>
                            <Input id="ai-lead-email" type="email" placeholder="you@email.com" value={leadForm.email} onChange={(e) => setLeadForm((p) => ({ ...p, email: e.target.value }))} required maxLength={255} />
                          </div>
                          <div className="sm:col-span-3">
                            <Button type="submit" disabled={submittingLead} className="w-full h-12 text-base font-bold uppercase tracking-widest">
                              {submittingLead ? <Loader2 className="w-5 h-5 animate-spin" /> : "Get My Free Quote →"}
                            </Button>
                          </div>
                        </form>
                      </div>
                    </motion.div>
                  )}
                  {leadSubmitted && (
                    <motion.div initial={{ opacity: 0, scale: 0.9 }} animate={{ opacity: 1, scale: 1 }} className="mt-8 bg-primary/10 border border-primary/30 rounded-xl p-8 text-center">
                      <Sparkles className="w-10 h-10 text-primary mx-auto mb-3" />
                      <h3 className="font-heading text-2xl font-bold text-foreground mb-2">You're all set!</h3>
                      <p className="text-muted-foreground">We'll reach out shortly with your personalized quote.</p>
                    </motion.div>
                  )}
                </AnimatePresence>
              </motion.div>
            )}
          </div>
        )}
      </div>
    </section>
  );
};

export default AIPreviewSection;
