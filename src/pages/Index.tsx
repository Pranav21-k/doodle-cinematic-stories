
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
  // Initialize the videos in localStorage if they don't exist yet
  useEffect(() => {
    const STORAGE_KEY = 'portfolio_videos';
    const savedVideos = localStorage.getItem(STORAGE_KEY);
    
    if (!savedVideos) {
      // Define our video categories and files
      const defaultVideos = [
        // Fashion & Modeling videos
        { id: 1, title: 'Fashion Show Highlights', client: 'Vogue', category: 'fashion', thumbnail: '/modelling/01.mp4', videoUrl: '/modelling/01.mp4', featured: true },
        { id: 2, title: 'Summer Collection', client: 'Milano Fashion', category: 'fashion', thumbnail: '/modelling/02.mp4', videoUrl: '/modelling/02.mp4', featured: true },
        { id: 3, title: 'Runway Showcase', client: 'Paris Week', category: 'fashion', thumbnail: '/modelling/03.mp4', videoUrl: '/modelling/03.mp4', featured: false },
        { id: 4, title: 'Winter Collection', client: 'Nordic Style', category: 'fashion', thumbnail: '/modelling/04.mp4', videoUrl: '/modelling/04.mp4', featured: false },
        { id: 5, title: 'Bridal Fashion', client: 'Wedding Expo', category: 'fashion', thumbnail: '/modelling/05.mp4', videoUrl: '/modelling/05.mp4', featured: false },
        { id: 6, title: 'Couture Collection', client: 'Designer Showcase', category: 'fashion', thumbnail: '/modelling/06.mp4', videoUrl: '/modelling/06.mp4', featured: false },
        { id: 7, title: 'Accessories Showcase', client: 'Accessory Line', category: 'fashion', thumbnail: '/modelling/07.mp4', videoUrl: '/modelling/07.mp4', featured: false },
        { id: 8, title: 'Urban Street Style', client: 'Urban Outfitters', category: 'fashion', thumbnail: '/modelling/08.mp4', videoUrl: '/modelling/08.mp4', featured: false },
        { id: 9, title: 'Model Portfolio', client: 'Models Inc', category: 'fashion', thumbnail: '/modelling/1.mp4', videoUrl: '/modelling/1.mp4', featured: false },
        { id: 10, title: 'Fashion Editorial', client: 'Glamour Magazine', category: 'fashion', thumbnail: '/modelling/2.mp4', videoUrl: '/modelling/2.mp4', featured: false },
        { id: 11, title: 'Seasonal Lookbook', client: 'Seasonal Fashion', category: 'fashion', thumbnail: '/modelling/3.mp4', videoUrl: '/modelling/3.mp4', featured: false },
        { id: 12, title: 'Designer Profile', client: 'Design House', category: 'fashion', thumbnail: '/modelling/4.mp4', videoUrl: '/modelling/4.mp4', featured: false },
        
        // Events & Nightlife videos
        { id: 13, title: 'Club Opening Night', client: 'Neon Nightclub', category: 'events', thumbnail: '/modelling/p1.mp4', videoUrl: '/modelling/p1.mp4', featured: true },
        { id: 14, title: 'DJ Showcase', client: 'Electronic Festival', category: 'events', thumbnail: '/modelling/p2.mp4', videoUrl: '/modelling/p2.mp4', featured: true },
        { id: 15, title: 'VIP Event Coverage', client: 'Exclusive Events', category: 'events', thumbnail: '/modelling/p3.mp4', videoUrl: '/modelling/p3.mp4', featured: false },
        { id: 16, title: 'Concert Highlights', client: 'Music Venue', category: 'events', thumbnail: '/modelling/p4.mp4', videoUrl: '/modelling/p4.mp4', featured: false },
        { id: 17, title: 'Private Party', client: 'Luxury Events', category: 'events', thumbnail: '/modelling/p5.mp4', videoUrl: '/modelling/p5.mp4', featured: false },
        { id: 18, title: 'Award Show Coverage', client: 'Entertainment Awards', category: 'events', thumbnail: '/modelling/p6.mp4', videoUrl: '/modelling/p6.mp4', featured: false },
        
        // Brand Collaboration video
        { id: 19, title: 'Product Launch Campaign', client: 'Tech Innovators', category: 'brand', thumbnail: '/modelling/ad1.mp4', videoUrl: '/modelling/ad1.mp4', featured: true },
        
        // Fitness & Lifestyle videos
        { id: 20, title: 'Workout Series', client: 'Fitness First', category: 'fitness', thumbnail: '/modelling/f1.mp4', videoUrl: '/modelling/f1.mp4', featured: true },
        { id: 21, title: 'Nutrition & Wellness', client: 'Health Magazine', category: 'fitness', thumbnail: '/modelling/f2.mp4', videoUrl: '/modelling/f2.mp4', featured: false },
        
        // Training videos (added to Fitness category)
        { id: 22, title: 'Personal Training', client: 'Elite Trainers', category: 'fitness', thumbnail: '/modelling/t1.mp4', videoUrl: '/modelling/t1.mp4', featured: false },
        { id: 23, title: 'Group Workout Class', client: 'Fitness Studio', category: 'fitness', thumbnail: '/modelling/t2.mp4', videoUrl: '/modelling/t2.mp4', featured: false },
        { id: 24, title: 'Yoga Session', client: 'Zen Wellness', category: 'fitness', thumbnail: '/modelling/t3.mp4', videoUrl: '/modelling/t3.mp4', featured: false }
      ];
      
      // Save to localStorage
      localStorage.setItem(STORAGE_KEY, JSON.stringify(defaultVideos));
      console.log('Default videos initialized in localStorage');
    } else {
      console.log('Videos already exist in localStorage');
    }
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
