
import { useEffect, useRef } from 'react';
import { Button } from "@/components/ui/button";
import { ArrowRight } from 'lucide-react';

const Hero = () => {
  const videoRef = useRef<HTMLVideoElement>(null);

  useEffect(() => {
    if (videoRef.current) {
      videoRef.current.playbackRate = 0.7; // Slow down video for cinematic effect
    }
  }, []);

  return (
    <section className="relative h-screen w-full overflow-hidden">
      {/* Video Background */}
      <div className="absolute inset-0 w-full h-full">
        <video 
          ref={videoRef}
          autoPlay 
          muted 
          loop 
          playsInline
          className="w-full h-full object-cover"
        >
          {/* Replace with your actual video URL */}
          <source src="https://assets.mixkit.co/videos/preview/mixkit-set-of-plateaus-seen-from-the-heights-in-a-sunset-26070-large.mp4" type="video/mp4" />
          Your browser does not support the video tag.
        </video>
        <div className="video-bg-overlay"></div>
      </div>

      {/* Hero Content */}
      <div className="container mx-auto px-6 md:px-12 h-full flex flex-col justify-center relative z-10">
        <div className="max-w-3xl animate-fade-in">
          <h1 className="hero-text text-4xl md:text-5xl lg:text-6xl xl:text-7xl font-bold mb-6">
            Your Story, <br />
            <span className="text-gradient">Cinematically Told</span>
          </h1>
          <p className="hero-text text-lg md:text-xl mb-10 text-white/80 max-w-xl">
            We craft compelling visual narratives that captivate your audience and elevate your brand through powerful storytelling.
          </p>
          
          <div className="flex flex-col sm:flex-row gap-4">
            <Button className="btn-primary flex items-center gap-2 text-base">
              See Our Work <ArrowRight size={16} className="ml-1" />
            </Button>
            <Button variant="outline" className="bg-transparent border border-white text-white hover:bg-white hover:text-black transition-colors duration-300">
              Book a Free Call
            </Button>
          </div>
        </div>
      </div>

      {/* Scroll Indicator */}
      <div className="absolute bottom-8 left-1/2 transform -translate-x-1/2 flex flex-col items-center">
        <span className="text-white/70 text-sm mb-2">Scroll to explore</span>
        <div className="w-6 h-10 rounded-full border-2 border-white/30 flex justify-center pt-2">
          <div className="w-1 h-2 bg-white rounded-full animate-bounce"></div>
        </div>
      </div>
    </section>
  );
};

export default Hero;
