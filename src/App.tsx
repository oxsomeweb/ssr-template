import { QueryClient, QueryClientProvider } from "@tanstack/react-query";
import { Route, Routes } from "react-router-dom";
import ScrollToTop from "./components/ScrollToTop";
import Appointments from "./pages/Appointments.tsx";
import { Toaster as Sonner } from "@/components/ui/sonner";
import { Toaster } from "@/components/ui/toaster";
import { TooltipProvider } from "@/components/ui/tooltip";
import Index from "./pages/Index.tsx";
import NotFound from "./pages/NotFound.tsx";
import Services from "./pages/Services.tsx";
import Gallery from "./pages/Gallery.tsx";
import Contact from "./pages/Contact.tsx";
import CityLanding from "./pages/CityLanding.tsx";
import DynamicServicePage from "./pages/DynamicServicePage.tsx";

// Eager imports (was lazy()) — renderToString can't handle Suspense.
// Bundle size cost is minor; cold-start matters more for SSR.
import Shop from "./pages/Shop.tsx";
import AIDetailingTool from "./pages/AIDetailingTool.tsx";
import BlogListing from "./pages/BlogListing.tsx";
import BlogDetail from "./pages/BlogDetail.tsx";
import DynamicCityPage from "./pages/DynamicCityPage.tsx";

const queryClient = new QueryClient({
  defaultOptions: {
    queries: {
      staleTime: 5 * 60 * 1000,
      gcTime: 10 * 60 * 1000,
      refetchOnWindowFocus: false,
    },
  },
});

// Note: <BrowserRouter> / <StaticRouter> is provided by entry-client.tsx /
// entry-server.tsx so this component works in both environments.
const App = () => (
  <QueryClientProvider client={queryClient}>
    <TooltipProvider>
      <Toaster />
      <Sonner />
      <ScrollToTop />
      <Routes>
        <Route path="/" element={<Index />} />
        <Route path="/services" element={<Services />} />
        <Route path="/gallery" element={<Gallery />} />
        <Route path="/contact" element={<Contact />} />
        <Route path="/s/appointments" element={<Appointments />} />
        <Route path="/s/shop" element={<Shop />} />
        <Route path="/ai-detailing" element={<AIDetailingTool />} />
        <Route path="/blog" element={<BlogListing />} />
        <Route path="/blog/:slug" element={<BlogDetail />} />
        <Route path="/area/:citySlug" element={<DynamicCityPage />} />
        <Route path="/services/:serviceSlug" element={<DynamicServicePage />} />
        <Route path="/mobile-detailing-sacramento" element={<CityLanding />} />
        <Route path="/mobile-detailing-elk-grove" element={<CityLanding />} />
        <Route path="/mobile-detailing-rancho-cordova" element={<CityLanding />} />
        <Route path="/mobile-detailing-natomas" element={<CityLanding />} />
        <Route path="/mobile-detailing-folsom" element={<CityLanding />} />
        <Route path="/mobile-detailing-roseville" element={<CityLanding />} />
        <Route path="/mobile-detailing-citrus-heights" element={<CityLanding />} />
        <Route path="/mobile-detailing-west-sacramento" element={<CityLanding />} />
        <Route path="/mobile-detailing-carmichael" element={<CityLanding />} />
        <Route path="/mobile-detailing-fair-oaks" element={<CityLanding />} />
        <Route path="/mobile-detailing-arden-arcade" element={<CityLanding />} />
        <Route path="/mobile-detailing-north-highlands" element={<CityLanding />} />
        {/* AI_ROUTE_ANCHOR */}
        <Route path="*" element={<NotFound />} />
      </Routes>
    </TooltipProvider>
  </QueryClientProvider>
);

export default App;
