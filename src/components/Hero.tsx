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
    <section className="relative h-screen w-full overflow-hidden">
      {/* Enhanced Background with Parallax Effect */}
      <div 
        ref={heroRef}
        className="absolute inset-0 w-full h-[120%] transition-transform duration-1000 ease-out"
      >
        <div 
          className="w-full h-full bg-cover bg-center bg-no-repeat transform scale-105 transition-transform duration-20000 animate-slow-zoom"
          style={{
            backgroundImage: "url('https://images.unsplash.com/photo-1496442226666-8d4d0e62e6e9?ixlib=rb-1.2.1&auto=format&fit=crop&w=1920&q=80')",
            backgroundPosition: "center",
          }}
        />
        
        {/* Dynamic overlay with gradient animation */}
        <div className="absolute inset-0 bg-gradient-to-br from-black/70 via-purple-900/30 to-black/80 animate-gradient-shift"></div>
        
        {/* Floating particles effect */}
        <div className="absolute inset-0">
          {[...Array(20)].map((_, i) => (
            <div
              key={i}
              className="absolute w-2 h-2 bg-white/20 rounded-full animate-float"
              style={{
                left: `${Math.random() * 100}%`,
                top: `${Math.random() * 100}%`,
                animationDelay: `${Math.random() * 10}s`,
                animationDuration: `${10 + Math.random() * 10}s`
              }}
            />
          ))}
        </div>
      </div>

      {/* Hero Content with Enhanced Animations */}
      <div className="container mx-auto px-6 md:px-12 h-full flex flex-col justify-center relative z-10">
        <div className="max-w-4xl animate-hero-enter">
          <div className="mb-6 inline-block">
            <span className="px-4 py-2 bg-purple-600/20 backdrop-blur-sm border border-purple-500/30 rounded-full text-purple-300 text-sm font-medium animate-pulse-glow">
              ✨ Cinematic Excellence
            </span>
          </div>
          
          <h1 className="hero-text text-5xl md:text-6xl lg:text-7xl xl:text-8xl font-bold mb-8 leading-tight">
            <span className="block animate-slide-up-1">Your Story,</span>
            <span className="block animate-slide-up-2">
              <span className="text-gradient-enhanced bg-gradient-to-r from-purple-400 via-pink-500 to-red-500 bg-clip-text text-transparent animate-text-glow">
                Cinematically Told
              </span>
            </span>
          </h1>
          
          <p className="hero-text text-xl md:text-2xl mb-12 text-white/90 max-w-2xl leading-relaxed animate-slide-up-3">
            We craft compelling visual narratives that captivate your audience and elevate your brand through 
            <span className="text-purple-300 font-semibold"> powerful storytelling</span>.
          </p>
          
          <div className="flex flex-col sm:flex-row gap-6 animate-slide-up-4">
            <Button 
              className="group relative overflow-hidden bg-gradient-to-r from-purple-600 to-pink-600 hover:from-purple-700 hover:to-pink-700 text-white px-8 py-4 text-lg font-semibold rounded-full shadow-2xl hover:shadow-purple-500/25 transition-all duration-300 transform hover:scale-105"
              onClick={() => {
                const portfolioSection = document.getElementById('portfolio');
                if (portfolioSection) {
                  portfolioSection.scrollIntoView({ behavior: 'smooth' });
                }
              }}
            >
              <span className="relative z-10 flex items-center gap-3">
                <Play size={20} className="animate-pulse" />
                See Our Work 
                <ArrowRight size={20} className="group-hover:translate-x-1 transition-transform duration-300" />
              </span>
              <div className="absolute inset-0 bg-gradient-to-r from-purple-400 to-pink-400 opacity-0 group-hover:opacity-100 transition-opacity duration-300 blur-xl"></div>
            </Button>
            
            <Button 
              variant="outline" 
              className="group bg-white/10 backdrop-blur-sm border-2 border-white/30 text-white hover:bg-white hover:text-black px-8 py-4 text-lg font-semibold rounded-full transition-all duration-300 transform hover:scale-105 hover:shadow-2xl"
            >
              <span className="flex items-center gap-2">
                Book a Free Call
                <ArrowRight size={18} className="group-hover:translate-x-1 transition-transform duration-300" />
              </span>
            </Button>
          </div>

          {/* Stats Section */}
          <div className="mt-16 grid grid-cols-3 gap-8 animate-slide-up-5">
            <div className="text-center group">
              <div className="text-3xl md:text-4xl font-bold text-white mb-2 group-hover:text-purple-300 transition-colors duration-300">100+</div>
              <div className="text-white/70 text-sm md:text-base">Projects Completed</div>
            </div>
            <div className="text-center group">
              <div className="text-3xl md:text-4xl font-bold text-white mb-2 group-hover:text-purple-300 transition-colors duration-300">50+</div>
              <div className="text-white/70 text-sm md:text-base">Happy Clients</div>
            </div>
            <div className="text-center group">
              <div className="text-3xl md:text-4xl font-bold text-white mb-2 group-hover:text-purple-300 transition-colors duration-300">24/7</div>
              <div className="text-white/70 text-sm md:text-base">Support</div>
            </div>
          </div>
        </div>
      </div>

      {/* Enhanced Scroll Indicator */}
      <div className="absolute bottom-8 left-1/2 transform -translate-x-1/2 flex flex-col items-center animate-bounce-gentle">
        <span className="text-white/70 text-sm mb-3 animate-pulse">Scroll to explore</span>
        <div className="relative">
          <div className="w-6 h-10 rounded-full border-2 border-white/30 flex justify-center pt-2 backdrop-blur-sm">
            <div className="w-1 h-3 bg-gradient-to-b from-purple-400 to-pink-400 rounded-full animate-scroll-dot"></div>
          </div>
          <div className="absolute -inset-2 bg-purple-500/20 rounded-full blur-md animate-pulse"></div>
        </div>
      </div>

      {/* Geometric shapes for visual interest */}
      <div className="absolute top-20 right-20 w-32 h-32 bg-purple-500/10 rounded-full blur-xl animate-float-slow"></div>
      <div className="absolute bottom-32 left-20 w-24 h-24 bg-pink-500/10 rounded-full blur-xl animate-float-reverse"></div>
    </section>
  );
};

export default Hero;
