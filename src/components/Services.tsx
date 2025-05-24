import { Video, Instagram, Code, Sparkles, ArrowRight, Zap, Target, Palette, BarChart3, Globe, Smartphone, Camera } from 'lucide-react';
import { Button } from "@/components/ui/button";
import { useState, useRef, useEffect } from 'react';

const Services = () => {
  const [activeService, setActiveService] = useState<number | null>(null);
  const [mousePosition, setMousePosition] = useState({ x: 0, y: 0 });
  const sectionRef = useRef<HTMLElement>(null);

  // Advanced mouse tracking for 3D effects
  useEffect(() => {
    const handleMouseMove = (e: MouseEvent) => {
      if (sectionRef.current) {
        const rect = sectionRef.current.getBoundingClientRect();
        setMousePosition({
          x: (e.clientX - rect.left) / rect.width,
          y: (e.clientY - rect.top) / rect.height,
        });
      }
    };

    const section = sectionRef.current;
    if (section) {
      section.addEventListener('mousemove', handleMouseMove);
      return () => section.removeEventListener('mousemove', handleMouseMove);
    }
  }, []);

  // Premium service offerings with enhanced data
  const services = [
    {
      id: 1,
      title: "Cinematic Video Production",
      subtitle: "Visual Storytelling Excellence",
      description: "Award-winning video production that transforms your brand narrative into compelling visual experiences.",
      icon: <Video size={32} className="text-red-400" />,
      gradient: "from-red-500 via-orange-500 to-yellow-500",
      bgImage: "https://images.unsplash.com/photo-1485846234645-a62644f84728?w=600&q=80",
      primaryColor: "red"
    },
    {
      id: 2,
      title: "Strategic Digital Marketing",
      subtitle: "Social Media Mastery",
      description: "Data-driven social media strategies that amplify your brand voice and create meaningful connections.",
      icon: <Instagram size={32} className="text-purple-400" />,
      gradient: "from-purple-500 via-pink-500 to-purple-600",
      bgImage: "https://images.unsplash.com/photo-1611224923853-80b023f02d71?w=600&q=80",
      primaryColor: "purple"
    },
    {
      id: 3,
      title: "Premium Web Development",
      subtitle: "Digital Experience Innovation",
      description: "Next-generation web applications that seamlessly blend cutting-edge technology with intuitive design.",
      icon: <Code size={32} className="text-blue-400" />,
      gradient: "from-blue-500 via-cyan-500 to-teal-500",
      bgImage: "https://images.unsplash.com/photo-1461749280684-dccba630e2f6?w=600&q=80",
      primaryColor: "blue"
    }
  ];

  return (
    <section id="services" ref={sectionRef} className="relative py-32 bg-black overflow-hidden">
      {/* Dynamic Background Effects */}
      <div className="absolute inset-0">
        <div 
          className="absolute inset-0 opacity-30"
          style={{
            background: `radial-gradient(circle at ${mousePosition.x * 100}% ${mousePosition.y * 100}%, 
                        rgba(168, 85, 247, 0.3) 0%, 
                        rgba(236, 72, 153, 0.2) 30%, 
                        transparent 70%)`
          }}
        />
        <div className="absolute inset-0 bg-[radial-gradient(ellipse_at_center,_var(--tw-gradient-stops))] from-transparent via-black/50 to-black"></div>
      </div>

      {/* Floating Particles */}
      <div className="absolute inset-0 overflow-hidden">
        {[...Array(30)].map((_, i) => (
          <div
            key={i}
            className="absolute w-1 h-1 bg-white/20 rounded-full animate-float"
            style={{
              left: `${Math.random() * 100}%`,
              top: `${Math.random() * 100}%`,
              animationDelay: `${Math.random() * 10}s`,
              animationDuration: `${15 + Math.random() * 10}s`
            }}
          />
        ))}
      </div>

      <div className="container mx-auto px-6 md:px-12 relative z-10">
        {/* Premium Section Header */}
        <div className="text-center mb-20 animate-fade-in-up">
          <div className="inline-block mb-6">
            <span className="px-6 py-3 bg-gradient-to-r from-purple-600/20 to-pink-600/20 backdrop-blur-sm border border-purple-500/30 rounded-full text-purple-300 text-sm font-semibold">
              ⚡ Premium Services
            </span>
          </div>
          <h2 className="text-6xl md:text-7xl lg:text-8xl font-bold mb-8">
            <span className="block text-white">Our</span>
            <span className="block text-gradient-enhanced">Expertise</span>
          </h2>
          <p className="text-xl md:text-2xl text-gray-300 max-w-4xl mx-auto leading-relaxed">
            Comprehensive solutions that transform your vision into reality through 
            <span className="text-purple-400 font-semibold"> cutting-edge technology</span> and 
            <span className="text-pink-400 font-semibold"> creative excellence</span>
          </p>
        </div>
        
        {/* Revolutionary Services Grid */}
        <div className="grid grid-cols-1 lg:grid-cols-3 gap-8 lg:gap-12">
          {services.map((service, index) => (
            <div 
              key={service.id}
              className="group relative animate-fade-in-up"
              style={{ animationDelay: `${index * 200}ms` }}
              onMouseEnter={() => setActiveService(service.id)}
              onMouseLeave={() => setActiveService(null)}
            >
              {/* Main Service Card */}
              <div className="relative h-[400px] rounded-3xl overflow-hidden cursor-pointer transform transition-all duration-700 hover:scale-105 hover:-rotate-1">
                {/* Background Image with Overlay */}
                <div 
                  className="absolute inset-0 bg-cover bg-center transition-transform duration-1000 group-hover:scale-110"
                  style={{ backgroundImage: `url(${service.bgImage})` }}
                />
                <div className={`absolute inset-0 bg-gradient-to-br ${service.gradient} opacity-90 group-hover:opacity-95 transition-opacity duration-500`} />
                
                {/* Animated Border */}
                <div className="absolute inset-0 rounded-3xl border-2 border-white/20 group-hover:border-white/40 transition-colors duration-500" />
                
                {/* Content */}
                <div className="relative z-10 p-8 h-full flex flex-col justify-between">
                  {/* Header */}
                  <div>
                    <div className="flex items-center justify-between mb-4">
                      <div className="p-3 bg-white/10 backdrop-blur-sm rounded-2xl border border-white/20">
                        {service.icon}
                      </div>
                      <div className={`w-10 h-10 rounded-full bg-white/20 backdrop-blur-sm border border-white/30 flex items-center justify-center opacity-0 group-hover:opacity-100 transition-all duration-500 transform group-hover:rotate-180`}>
                        <ArrowRight size={16} className="text-white" />
                      </div>
                    </div>
                    <div className="text-white/80 text-xs font-medium uppercase tracking-wider mb-3">
                      {service.subtitle}
                    </div>
                    <h3 className="text-2xl font-bold text-white mb-4 group-hover:text-yellow-200 transition-colors duration-300">
                      {service.title}
                    </h3>
                    <p className="text-white/90 leading-relaxed text-sm">
                      {service.description}
                    </p>
                  </div>

                  {/* CTA Button */}
                  <Button 
                    className="w-full bg-white/10 backdrop-blur-sm border border-white/30 text-white hover:bg-white hover:text-black font-semibold py-3 rounded-2xl transition-all duration-300 transform hover:scale-105 group-hover:shadow-2xl"
                  >
                    <span className="flex items-center justify-center gap-2">
                      Learn More
                      <ArrowRight size={16} className="group-hover:translate-x-1 transition-transform duration-300" />
                    </span>
                  </Button>
                </div>

                {/* Hover Effects */}
                <div className="absolute inset-0 opacity-0 group-hover:opacity-100 transition-opacity duration-500">
                  <div className="absolute top-4 right-4 w-32 h-32 bg-white/5 rounded-full blur-2xl animate-pulse" />
                  <div className="absolute bottom-4 left-4 w-24 h-24 bg-white/10 rounded-full blur-xl animate-float" />
                </div>

                {/* Active Indicator */}
                {activeService === service.id && (
                  <div className="absolute -inset-2 bg-gradient-to-r from-purple-500/20 to-pink-500/20 rounded-3xl blur-xl animate-pulse" />
                )}
              </div>

              {/* Floating Action Icons */}
              <div className="absolute -top-4 -right-4 opacity-0 group-hover:opacity-100 transition-all duration-500 transform group-hover:scale-110">
                <div className="w-10 h-10 bg-gradient-to-r from-purple-500 to-pink-500 rounded-full flex items-center justify-center shadow-2xl animate-pulse">
                  <Zap size={16} className="text-white" />
                </div>
              </div>
            </div>
          ))}
        </div>

        {/* Premium CTA Section */}
        <div className="text-center mt-24 animate-fade-in-up">
          <div className="inline-block p-12 bg-gradient-to-br from-purple-600/20 via-pink-600/20 to-red-600/20 backdrop-blur-xl rounded-3xl border border-white/10 shadow-2xl hover:shadow-purple-500/25 transition-all duration-500 transform hover:scale-105 cursor-pointer group">
            <div className="mb-6">
              <div className="w-20 h-20 mx-auto bg-gradient-to-r from-purple-500 to-pink-500 rounded-full flex items-center justify-center shadow-2xl group-hover:shadow-purple-500/50 transition-all duration-300 transform group-hover:rotate-12">
                <Zap size={32} className="text-white" />
              </div>
            </div>
            <h4 className="text-4xl font-bold text-white mb-4 group-hover:text-purple-300 transition-colors duration-300">
              Ready to Create Magic?
            </h4>
            <p className="text-xl text-gray-300 mb-8 max-w-2xl mx-auto">
              Let's collaborate and bring your vision to life with our world-class expertise and cutting-edge technology.
            </p>
            <Button className="bg-gradient-to-r from-purple-600 to-pink-600 hover:from-purple-700 hover:to-pink-700 text-white px-12 py-4 text-lg font-semibold rounded-full shadow-2xl hover:shadow-purple-500/25 transition-all duration-300 transform hover:scale-105">
              <span className="flex items-center gap-3">
                Start Your Project
                <ArrowRight size={20} className="group-hover:translate-x-2 transition-transform duration-300" />
              </span>
            </Button>
          </div>
        </div>
      </div>

      {/* Background Geometric Shapes */}
      <div className="absolute top-32 left-10 w-64 h-64 bg-purple-500/10 rounded-full blur-3xl animate-float-slow" />
      <div className="absolute bottom-32 right-10 w-96 h-96 bg-pink-500/10 rounded-full blur-3xl animate-float-reverse" />
      <div className="absolute top-1/2 left-1/2 transform -translate-x-1/2 -translate-y-1/2 w-128 h-128 bg-blue-500/5 rounded-full blur-3xl animate-slow-zoom" />
    </section>
  );
};

export default Services;
