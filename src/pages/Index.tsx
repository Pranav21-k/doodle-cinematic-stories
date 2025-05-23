
import React, { useEffect } from 'react';
import Navbar from "@/components/Navbar";
import Hero from "@/components/Hero";
import ClientLogos from "@/components/ClientLogos";
import AboutUs from "@/components/AboutUs";
import Services from "@/components/Services";
import Portfolio from "@/components/Portfolio";
import ContactSection from "@/components/ContactSection";
import Footer from "@/components/Footer";

const Index = () => {
  // Force a page load to ensure localStorage is properly loaded
  useEffect(() => {
    // We're just ensuring the page properly initializes
    // This helps with localStorage persistence
    console.log("Index page mounted");
  }, []);

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
