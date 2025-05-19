
import Navbar from "@/components/Navbar";
import Hero from "@/components/Hero";
import ClientLogos from "@/components/ClientLogos";
import AboutUs from "@/components/AboutUs";
import Services from "@/components/Services";
import Portfolio from "@/components/Portfolio";
import ContactSection from "@/components/ContactSection";
import Footer from "@/components/Footer";

const Index = () => {
  return (
    <div className="min-h-screen">
      <Navbar />
      <Hero />
      <Portfolio />
      <ClientLogos />
      <AboutUs />
      <Services />
      <ContactSection />
      <Footer />
    </div>
  );
};

export default Index;
