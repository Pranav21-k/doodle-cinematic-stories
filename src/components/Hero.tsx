
import { useEffect, useRef, useState } from 'react';
import { Button } from "@/components/ui/button";
import { ArrowRight, Upload } from 'lucide-react';

const Hero = () => {
  const videoRef = useRef<HTMLVideoElement>(null);
  const [backgroundType, setBackgroundType] = useState<'image' | 'video'>('image');
  const [videoBackground, setVideoBackground] = useState<string | null>(null);
  const [isUploadMenuOpen, setIsUploadMenuOpen] = useState(false);

  useEffect(() => {
    if (videoRef.current) {
      videoRef.current.playbackRate = 0.7; // Slow down video for cinematic effect
    }
  }, []);

  const handleVideoUpload = (e: React.ChangeEvent<HTMLInputElement>) => {
    const files = e.target.files;
    if (files && files.length > 0) {
      // Check if the file is a video
      if (!files[0].type.startsWith('video/')) {
        alert('Please upload a video file.');
        return;
      }
      
      const videoUrl = URL.createObjectURL(files[0]);
      setVideoBackground(videoUrl);
      setBackgroundType('video');
      setIsUploadMenuOpen(false);
    }
  };

  return (
    <section className="relative h-screen w-full overflow-hidden">
      {/* Background */}
      <div className="absolute inset-0 w-full h-full">
        {backgroundType === 'video' && videoBackground ? (
          <>
            <video 
              ref={videoRef}
              autoPlay 
              muted 
              loop 
              playsInline
              className="w-full h-full object-cover"
            >
              <source src={videoBackground} type="video/mp4" />
              Your browser does not support the video tag.
            </video>
            <div className="absolute inset-0 bg-black bg-opacity-40"></div>
          </>
        ) : (
          <>
            <div 
              className="w-full h-full bg-cover bg-center bg-no-repeat"
              style={{
                backgroundImage: "url('https://images.unsplash.com/photo-1496442226666-8d4d0e62e6e9?ixlib=rb-1.2.1&auto=format&fit=crop&w=1920&q=80')",
                backgroundPosition: "center",
              }}
            >
            </div>
            <div className="absolute inset-0 bg-black bg-opacity-60"></div>
          </>
        )}
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

      {/* Background Upload Option */}
      <div className="absolute top-4 right-4 z-20">
        <Button 
          variant="outline" 
          size="sm"
          onClick={() => setIsUploadMenuOpen(!isUploadMenuOpen)}
          className="bg-black/40 text-white border-white/30 hover:bg-black/60"
        >
          <Upload size={16} className="mr-1" /> Change Background
        </Button>
        
        {isUploadMenuOpen && (
          <div className="absolute right-0 mt-2 w-56 rounded-md shadow-lg bg-white ring-1 ring-black ring-opacity-5">
            <div className="py-1" role="menu" aria-orientation="vertical">
              <label className="block px-4 py-2 text-sm text-gray-700 hover:bg-gray-100 cursor-pointer">
                Upload Video Background
                <input
                  type="file"
                  accept="video/*"
                  onChange={handleVideoUpload}
                  className="hidden"
                />
              </label>
              <button
                onClick={() => {
                  setBackgroundType('image');
                  setIsUploadMenuOpen(false);
                }}
                className="block w-full text-left px-4 py-2 text-sm text-gray-700 hover:bg-gray-100"
              >
                Use Default Background
              </button>
            </div>
          </div>
        )}
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
