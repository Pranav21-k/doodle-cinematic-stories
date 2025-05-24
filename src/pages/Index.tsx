
import React, { useEffect } from 'react';
import Navbar from "@/components/Navbar";
import Hero from "@/components/Hero";
import Portfolio from "@/components/Portfolio";
import AboutUs from "@/components/AboutUs";
import Services from "@/components/Services";
import ContactSection from "@/components/ContactSection";
import Footer from "@/components/Footer";

const Index = () => {
  // Initialize the videos in localStorage if they don't exist yet
  useEffect(() => {
    const STORAGE_KEY = 'portfolio_videos';
    const savedVideos = localStorage.getItem(STORAGE_KEY);
    
    if (!savedVideos) {
      // Define our video categories and files from GitHub repository
      const defaultVideos = [
        // Featured Main Videos (1-4.mp4) - Top Priority
        { id: 1, title: 'Cinematic Showcase', client: 'Premium Collection', category: 'fashion', thumbnail: '/1.mp4', videoUrl: '/1.mp4', featured: true },
        { id: 2, title: 'Creative Vision', client: 'Artistic Direction', category: 'fashion', thumbnail: '/2.mp4', videoUrl: '/2.mp4', featured: true },
        { id: 3, title: 'Professional Portfolio', client: 'Studio Production', category: 'fashion', thumbnail: '/3.mp4', videoUrl: '/3.mp4', featured: true },
        { id: 4, title: 'Brand Storytelling', client: 'Visual Narrative', category: 'fashion', thumbnail: '/4.mp4', videoUrl: '/4.mp4', featured: true },
        
        // Fashion & Modeling videos (01-08.mp4)
        { id: 5, title: 'Fashion Show Highlights', client: 'Vogue', category: 'fashion', thumbnail: '/01.mp4', videoUrl: '/01.mp4', featured: false },
        { id: 6, title: 'Summer Collection', client: 'Milano Fashion', category: 'fashion', thumbnail: '/02.mp4', videoUrl: '/02.mp4', featured: false },
        { id: 7, title: 'Runway Showcase', client: 'Paris Week', category: 'fashion', thumbnail: '/03.mp4', videoUrl: '/03.mp4', featured: false },
        { id: 8, title: 'Winter Collection', client: 'Nordic Style', category: 'fashion', thumbnail: '/04.mp4', videoUrl: '/04.mp4', featured: false },
        { id: 9, title: 'Bridal Fashion', client: 'Wedding Expo', category: 'fashion', thumbnail: '/05.mp4', videoUrl: '/05.mp4', featured: false },
        { id: 10, title: 'Couture Collection', client: 'Designer Showcase', category: 'fashion', thumbnail: '/06.mp4', videoUrl: '/06.mp4', featured: false },
        { id: 11, title: 'Accessories Showcase', client: 'Accessory Line', category: 'fashion', thumbnail: '/07.mp4', videoUrl: '/07.mp4', featured: false },
        { id: 12, title: 'Urban Street Style', client: 'Urban Outfitters', category: 'fashion', thumbnail: '/08.mp4', videoUrl: '/08.mp4', featured: false },
        
        // Events & Nightlife videos (p1-p6.mp4)
        { id: 13, title: 'Club Opening Night', client: 'Neon Nightclub', category: 'events', thumbnail: '/p2.mp4', videoUrl: '/p2.mp4', featured: false },
        { id: 14, title: 'DJ Showcase', client: 'Electronic Festival', category: 'events', thumbnail: '/p3.mp4', videoUrl: '/p3.mp4', featured: false },
        { id: 15, title: 'VIP Event Coverage', client: 'Exclusive Events', category: 'events', thumbnail: '/p4.mp4', videoUrl: '/p4.mp4', featured: false },
        { id: 16, title: 'Concert Highlights', client: 'Music Venue', category: 'events', thumbnail: '/p5.mp4', videoUrl: '/p5.mp4', featured: false },
        { id: 17, title: 'Private Party', client: 'Luxury Events', category: 'events', thumbnail: '/p6.mp4', videoUrl: '/p6.mp4', featured: false },
        
        // Brand Collaboration videos
        { id: 18, title: 'Product Launch Campaign', client: 'Tech Innovators', category: 'brand', thumbnail: '/ad1.mp4', videoUrl: '/ad1.mp4', featured: false },
        
        // Fitness & Lifestyle videos
        { id: 19, title: 'Workout Series', client: 'Fitness First', category: 'fitness', thumbnail: '/f1.mp4', videoUrl: '/f1.mp4', featured: false },
        { id: 20, title: 'Nutrition & Wellness', client: 'Health Magazine', category: 'fitness', thumbnail: '/f2.mp4', videoUrl: '/f2.mp4', featured: false },
        
        // Training videos
        { id: 21, title: 'Personal Training', client: 'Elite Trainers', category: 'fitness', thumbnail: '/t1.mp4', videoUrl: '/t1.mp4', featured: false },
        { id: 22, title: 'Group Workout Class', client: 'Fitness Studio', category: 'fitness', thumbnail: '/t2.mp4', videoUrl: '/t2.mp4', featured: false },
        { id: 23, title: 'Yoga Session', client: 'Zen Wellness', category: 'fitness', thumbnail: '/t3.mp4', videoUrl: '/t3.mp4', featured: false }
      ];
      
      // Save to localStorage
      localStorage.setItem(STORAGE_KEY, JSON.stringify(defaultVideos));
      console.log('Default videos initialized in localStorage');
    } else {
      console.log('Videos already exist in localStorage');
    }

    // Force reload videos from public folder
    const refreshVideos = () => {
      try {
        // Create a test video element to check if videos are accessible
        const testVideo = document.createElement('video');
        testVideo.src = '/1.mp4'; // Test with our primary video
        testVideo.onloadedmetadata = () => {
          console.log('Videos are accessible from public folder');
        };
        testVideo.onerror = () => {
          console.error('Error loading test video from public folder');
          // In case of error, show user a helpful message
          console.warn('Cannot load videos from public folder - please ensure video files exist');
        };
      } catch (error) {
        console.error('Video loading error:', error);
      }
    };
    
    refreshVideos();
    
  }, []);

  return (
    <div className="min-h-screen">
      <Navbar />
      <Hero />
      <Portfolio />
      <AboutUs />
      <Services />
      <ContactSection />
      <Footer />
    </div>
  );
};

export default Index;
