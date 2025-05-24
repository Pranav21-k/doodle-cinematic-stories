
import { useEffect, useRef } from 'react';
import { Button } from "@/components/ui/button";
import { ArrowRight, Play } from 'lucide-react';

const Hero = () => {
  const heroRef = useRef<HTMLDivElement>(null);

  useEffect(() => {
    // Add parallax scroll effect
    const handleScroll = () => {
      if (heroRef.current) {
        const scrolled = window.pageYOffset;
        const rate = scrolled * -0.5;
        heroRef.current.style.transform = `translateY(${rate}px)`;
      }
    };

    window.addEventListener('scroll', handleScroll);
    return () => window.removeEventListener('scroll', handleScroll);
  }, []);

  return (
    <section className="relative h-screen w-full overflow-hidden bg-gradient-to-br from-purple-900 via-purple-700 to-purple-500">
      {/* Background Image without color overlays */}
      <div 
        ref={heroRef}
        className="absolute inset-0 w-full h-[120%] transition-transform duration-1000 ease-out"
      >
        <div 
          className="w-full h-full bg-cover bg-center bg-no-repeat"
          style={{
            backgroundImage: "url('https://images.unsplash.com/photo-1496442226666-8d4d0e62e6e9?ixlib=rb-1.2.1&auto=format&fit=crop&w=1920&q=80')",
            backgroundPosition: "center",
          }}
        />
      </div>

      {/* Hero Content */}
      <div className="container mx-auto px-6 md:px-12 h-full flex flex-col justify-center relative z-10">
        <div className="max-w-4xl animate-fade-in">
          <h1 className="text-4xl md:text-6xl lg:text-7xl xl:text-8xl font-bold mb-8 leading-tight">
            <span className="block text-white drop-shadow-lg">Your Story,</span>
            <span className="block bg-gradient-to-r from-purple-400 to-pink-400 bg-clip-text text-transparent drop-shadow-lg">
              Cinematically Told
            </span>
          </h1>
          
          <p className="text-lg md:text-xl lg:text-2xl mb-12 text-white max-w-3xl leading-relaxed drop-shadow-md">
            We craft compelling visual narratives that captivate your audience and elevate your brand through 
            <span className="text-purple-200 font-semibold"> powerful storytelling</span>.
          </p>
          
          <div className="flex flex-col sm:flex-row gap-6 mb-16">
            <Button 
              className="group bg-gradient-to-r from-purple-600 to-pink-600 hover:from-purple-700 hover:to-pink-700 text-white px-8 py-4 text-lg font-semibold rounded-full shadow-xl transition-all duration-300 transform hover:scale-105 hover:shadow-2xl border-0"
              onClick={() => {
                const aboutSection = document.getElementById('about');
                if (aboutSection) {
                  aboutSection.scrollIntoView({ behavior: 'smooth' });
                }
              }}
            >
              <span className="flex items-center gap-3">
                <Play size={20} />
                See Our Work 
                <ArrowRight size={20} className="group-hover:translate-x-1 transition-transform duration-300" />
              </span>
            </Button>
            
            <Button 
              className="group bg-gradient-to-r from-purple-600 to-pink-600 hover:from-purple-700 hover:to-pink-700 text-white px-8 py-4 text-lg font-semibold rounded-full shadow-xl transition-all duration-300 transform hover:scale-105 hover:shadow-2xl border-0"
              onClick={() => {
                window.open('tel:+12012841297', '_self');
              }}
            >
              <span className="flex items-center gap-2">
                Book a Free Call
                <ArrowRight size={18} className="group-hover:translate-x-1 transition-transform duration-300" />
              </span>
            </Button>
          </div>

          {/* Enhanced Stats Section */}
          <div className="grid grid-cols-3 gap-8">
            <div className="text-center p-4 bg-white/10 backdrop-blur-sm rounded-lg border border-purple-300/30">
              <div className="text-3xl md:text-4xl font-bold text-white mb-2 drop-shadow">100+</div>
              <div className="text-purple-200 text-sm md:text-base font-medium">Projects Completed</div>
            </div>
            <div className="text-center p-4 bg-white/10 backdrop-blur-sm rounded-lg border border-purple-300/30">
              <div className="text-3xl md:text-4xl font-bold text-white mb-2 drop-shadow">50+</div>
              <div className="text-purple-200 text-sm md:text-base font-medium">Happy Clients</div>
            </div>
            <div className="text-center p-4 bg-white/10 backdrop-blur-sm rounded-lg border border-purple-300/30">
              <div className="text-3xl md:text-4xl font-bold text-white mb-2 drop-shadow">24/7</div>
              <div className="text-purple-200 text-sm md:text-base font-medium">Support</div>
            </div>
          </div>
        </div>
      </div>

      {/* Enhanced Scroll Indicator */}
      <div className="absolute bottom-8 left-1/2 transform -translate-x-1/2 flex flex-col items-center animate-bounce">
        <span className="text-white/90 text-sm mb-3 font-medium drop-shadow">Scroll to explore</span>
        <div className="w-6 h-10 rounded-full border-2 border-white/70 flex justify-center pt-2 bg-white/10 backdrop-blur-sm">
          <div className="w-1 h-3 bg-white rounded-full animate-pulse"></div>
        </div>
      </div>
    </section>
  );
};

export default Hero;
