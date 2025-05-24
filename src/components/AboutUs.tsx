import { Button } from "@/components/ui/button";
import { useState, useRef, useEffect } from 'react';
import { ArrowRight, Users, Award, Target, Lightbulb, Heart, Zap } from 'lucide-react';

const AboutUs = () => {
  const [isInView, setIsInView] = useState(false);
  const [currentSlide, setCurrentSlide] = useState(0);
  const sectionRef = useRef<HTMLElement>(null);
  const imageRef = useRef<HTMLDivElement>(null);

  // Intersection Observer for animations
  useEffect(() => {
    const observer = new IntersectionObserver(
      ([entry]) => {
        setIsInView(entry.isIntersecting);
      },
      { threshold: 0.3 }
    );

    if (sectionRef.current) {
      observer.observe(sectionRef.current);
    }

    return () => observer.disconnect();
  }, []);

  // Auto-slide for team showcase
  useEffect(() => {
    const interval = setInterval(() => {
      setCurrentSlide((prev) => (prev + 1) % teamMembers.length);
    }, 4000);
    return () => clearInterval(interval);
  }, []);

  // Parallax effect for images
  useEffect(() => {
    const handleScroll = () => {
      if (imageRef.current) {
        const scrolled = window.pageYOffset;
        const rate = scrolled * -0.5;
        imageRef.current.style.transform = `translateY(${rate}px)`;
      }
    };

    window.addEventListener('scroll', handleScroll);
    return () => window.removeEventListener('scroll', handleScroll);
  }, []);

  const values = [
    {
      icon: <Lightbulb size={32} className="text-yellow-500" />,
      title: "Creative Excellence",
      description: "Pushing artistic boundaries with every project",
      color: "from-yellow-400 to-orange-500"
    },
    {
      icon: <Target size={32} className="text-blue-500" />,
      title: "Strategic Thinking",
      description: "Data-driven creativity that delivers results",
      color: "from-blue-400 to-purple-500"
    },
    {
      icon: <Heart size={32} className="text-red-500" />,
      title: "Client Partnership",
      description: "Building long-term relationships through trust",
      color: "from-red-400 to-pink-500"
    },
    {
      icon: <Zap size={32} className="text-green-500" />,
      title: "Technical Innovation",
      description: "Leveraging cutting-edge technology",
      color: "from-green-400 to-teal-500"
    }
  ];

  const teamMembers = [
    {
      name: "Alex Rodriguez",
      role: "Creative Director",
      image: "https://images.unsplash.com/photo-1507003211169-0a1dd7228f2d?w=400&q=80&auto=format&fit=crop",
      bio: "Award-winning director with 10+ years in cinematography"
    },
    {
      name: "Sarah Chen",
      role: "Lead Producer",
      image: "https://images.unsplash.com/photo-1573496359142-b8d87734a5a2?w=400&q=80&auto=format&fit=crop",
      bio: "Strategic mastermind behind 200+ successful campaigns"
    },
    {
      name: "Marcus Thompson",
      role: "Technical Director",
      image: "https://images.unsplash.com/photo-1472099645785-5658abf4ff4e?w=400&q=80&auto=format&fit=crop",
      bio: "Full-stack developer specializing in immersive experiences"
    }
  ];

  return (
    <section id="about" ref={sectionRef} className="relative py-32 bg-gradient-to-br from-slate-50 via-white to-slate-100 overflow-hidden">
      {/* Animated Background Elements */}
      <div className="absolute inset-0 overflow-hidden">
        <div className="absolute top-20 -left-20 w-96 h-96 bg-purple-200/30 rounded-full blur-3xl animate-float-slow"></div>
        <div className="absolute bottom-20 -right-20 w-128 h-128 bg-pink-200/20 rounded-full blur-3xl animate-float-reverse"></div>
        <div className="absolute top-1/2 left-1/2 transform -translate-x-1/2 -translate-y-1/2 w-64 h-64 bg-blue-200/20 rounded-full blur-2xl animate-slow-zoom"></div>
      </div>

      <div className="container mx-auto px-6 md:px-12 relative z-10">
        {/* Enhanced Section Header */}
        <div className="text-center mb-20 animate-fade-in-up">
          <div className="inline-block mb-6">
            <span className="px-6 py-3 bg-gradient-to-r from-purple-100 to-pink-100 text-purple-800 text-sm font-semibold rounded-full border border-purple-200 shadow-sm">
              🎯 Our Story
            </span>
          </div>
          <h2 className="text-6xl md:text-7xl lg:text-8xl font-bold mb-8">
            <span className="block text-gray-900">About</span>
            <span className="block text-gradient-enhanced">Doodle</span>
          </h2>
          <p className="text-xl md:text-2xl text-gray-600 max-w-4xl mx-auto leading-relaxed">
            A creative powerhouse dedicated to telling your story through the 
            <span className="text-purple-600 font-semibold"> power of cinema</span> and 
            <span className="text-pink-600 font-semibold"> cutting-edge technology</span>
          </p>
        </div>
        
        {/* Revolutionary Content Grid */}
        <div className="grid grid-cols-1 lg:grid-cols-2 gap-16 items-center mb-24">
          {/* Enhanced Image/Video Side */}
          <div className="relative animate-fade-in-up">
            <div className="relative group">
              {/* Main Image Container */}
              <div 
                ref={imageRef}
                className="aspect-[4/3] rounded-3xl overflow-hidden shadow-2xl hover:shadow-3xl transition-all duration-700 transform hover:scale-105"
              >
                <img 
                  src="https://images.unsplash.com/photo-1522202176988-66273c2fd55f?w=800&q=80"
                  alt="Doodle Production Team Collaborating" 
                  className="w-full h-full object-cover transition-transform duration-1000 group-hover:scale-110"
                />
                <div className="absolute inset-0 bg-gradient-to-t from-black/50 via-transparent to-transparent opacity-0 group-hover:opacity-100 transition-opacity duration-500"></div>
              </div>
              
              {/* Floating Elements */}
              <div className="absolute -top-8 -right-8 w-24 h-24 bg-gradient-to-br from-purple-500 to-pink-500 rounded-full opacity-80 animate-float blur-xl"></div>
              <div className="absolute -bottom-8 -left-8 w-32 h-32 bg-gradient-to-br from-blue-500 to-cyan-500 rounded-full opacity-60 animate-float-reverse blur-xl"></div>
              
              {/* Team Member Carousel */}
              <div className="absolute top-6 left-6 right-6">
                <div className="bg-white/90 backdrop-blur-sm rounded-2xl p-4 shadow-xl border border-white/20 transform transition-all duration-500 hover:scale-105">
                  <div className="flex items-center gap-4">
                    <div className="relative">
                      <img 
                        src={teamMembers[currentSlide].image}
                        alt={teamMembers[currentSlide].name}
                        className="w-16 h-16 rounded-full object-cover border-2 border-purple-300"
                      />
                      <div className="absolute -bottom-1 -right-1 w-6 h-6 bg-green-400 rounded-full border-2 border-white animate-pulse"></div>
                    </div>
                    <div className="flex-1">
                      <h4 className="font-bold text-gray-900">{teamMembers[currentSlide].name}</h4>
                      <p className="text-purple-600 text-sm font-medium">{teamMembers[currentSlide].role}</p>
                      <p className="text-gray-600 text-xs mt-1">{teamMembers[currentSlide].bio}</p>
                    </div>
                  </div>
                </div>
              </div>

              {/* Interactive Hover Elements */}
              <div className="absolute inset-0 opacity-0 group-hover:opacity-100 transition-opacity duration-500 pointer-events-none">
                <div className="absolute top-1/2 left-1/2 transform -translate-x-1/2 -translate-y-1/2">
                  <div className="w-20 h-20 bg-white/20 backdrop-blur-sm rounded-full flex items-center justify-center border border-white/30 animate-pulse">
                    <Users size={32} className="text-white" />
                  </div>
                </div>
              </div>
            </div>
          </div>
          
          {/* Enhanced Text Side */}
          <div className="animate-fade-in-up space-y-8">
            <div>
              <h3 className="text-4xl md:text-5xl font-bold mb-6 bg-gradient-to-r from-gray-900 via-purple-800 to-pink-800 bg-clip-text text-transparent">
                Our Story
              </h3>
              <p className="text-gray-700 text-lg leading-relaxed mb-6">
                Doodle Production was founded with a singular mission: to transform stories into 
                <span className="text-purple-600 font-semibold"> cinematic experiences</span> that 
                captivate, inspire, and drive measurable results for our clients.
              </p>
              <p className="text-gray-700 text-lg leading-relaxed">
                What began as a passion for visual storytelling has evolved into a 
                <span className="text-pink-600 font-semibold"> full-service creative studio</span>, 
                blending artistic vision with strategic thinking to create content that stands out 
                in today's crowded digital landscape.
              </p>
            </div>

            {/* Enhanced Values Grid */}
            <div>
              <h4 className="text-2xl font-bold mb-6 text-gray-900">Our Core Values</h4>
              <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                {values.map((value, index) => (
                  <div 
                    key={value.title}
                    className="group relative p-6 bg-white rounded-2xl shadow-lg hover:shadow-2xl transition-all duration-500 transform hover:scale-105 hover:-rotate-1 cursor-pointer border border-gray-100 animate-fade-in-up"
                    style={{ animationDelay: `${index * 100}ms` }}
                  >
                    <div className={`absolute inset-0 bg-gradient-to-br ${value.color} opacity-0 group-hover:opacity-10 rounded-2xl transition-opacity duration-500`}></div>
                    <div className="relative z-10">
                      <div className="mb-4 transform group-hover:scale-110 transition-transform duration-300">
                        {value.icon}
                      </div>
                      <h5 className="text-lg font-bold text-gray-900 mb-2 group-hover:text-purple-700 transition-colors duration-300">
                        {value.title}
                      </h5>
                      <p className="text-gray-600 text-sm leading-relaxed">
                        {value.description}
                      </p>
                    </div>
                    <div className="absolute -top-2 -right-2 w-6 h-6 bg-gradient-to-r from-purple-400 to-pink-400 rounded-full opacity-0 group-hover:opacity-100 transition-all duration-500 animate-pulse"></div>
                  </div>
                ))}
              </div>
            </div>
            
            {/* Enhanced CTA */}
            <div className="flex gap-4">
              <Button className="group bg-gradient-to-r from-purple-600 to-pink-600 hover:from-purple-700 hover:to-pink-700 text-white px-8 py-4 rounded-full font-semibold shadow-xl hover:shadow-2xl transition-all duration-300 transform hover:scale-105">
                <span className="flex items-center gap-2">
                  Meet Our Team
                  <ArrowRight size={18} className="group-hover:translate-x-1 transition-transform duration-300" />
                </span>
              </Button>
              <Button variant="outline" className="group px-8 py-4 rounded-full font-semibold border-2 border-purple-300 text-purple-700 hover:bg-purple-600 hover:text-white transition-all duration-300 transform hover:scale-105">
                <span className="flex items-center gap-2">
                  Our Portfolio
                  <ArrowRight size={18} className="group-hover:translate-x-1 transition-transform duration-300" />
                </span>
              </Button>
            </div>
          </div>
        </div>

        {/* Call to Action */}
        <div className="text-center animate-fade-in-up">
          <div className="inline-block p-12 bg-gradient-to-br from-purple-600/10 via-pink-600/10 to-red-600/10 backdrop-blur-xl rounded-3xl border border-purple-200/30 shadow-2xl hover:shadow-purple-500/25 transition-all duration-500 transform hover:scale-105 cursor-pointer group max-w-4xl">
            <div className="mb-6">
              <div className="w-24 h-24 mx-auto bg-gradient-to-r from-purple-500 to-pink-500 rounded-full flex items-center justify-center shadow-2xl group-hover:shadow-purple-500/50 transition-all duration-300 transform group-hover:rotate-12 animate-pulse">
                <Award size={40} className="text-white" />
              </div>
            </div>
            <h4 className="text-4xl md:text-5xl font-bold text-gray-900 mb-6 group-hover:text-purple-700 transition-colors duration-300">
              Ready to Tell Your Story?
            </h4>
            <p className="text-xl text-gray-600 mb-8 max-w-2xl mx-auto leading-relaxed">
              Let's collaborate and create something extraordinary together. Your vision combined with our expertise equals magic.
            </p>
            <Button className="bg-gradient-to-r from-purple-600 to-pink-600 hover:from-purple-700 hover:to-pink-700 text-white px-12 py-4 text-lg font-semibold rounded-full shadow-2xl hover:shadow-purple-500/25 transition-all duration-300 transform hover:scale-105">
              <span className="flex items-center gap-3">
                Start Your Project
                <ArrowRight size={24} className="group-hover:translate-x-2 transition-transform duration-300" />
              </span>
            </Button>
          </div>
        </div>
      </div>
    </section>
  );
};

export default AboutUs;
