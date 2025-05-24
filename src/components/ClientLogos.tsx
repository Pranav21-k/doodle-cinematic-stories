import React, { useEffect, useRef } from 'react';

const ClientLogos = () => {
  const scrollRef = useRef<HTMLDivElement>(null);

  // Infinite scroll animation
  useEffect(() => {
    const scrollContainer = scrollRef.current;
    if (!scrollContainer) return;

    let animationId: number;
    let scrollPosition = 0;

    const animate = () => {
      scrollPosition += 0.5;
      if (scrollPosition >= scrollContainer.scrollWidth / 2) {
        scrollPosition = 0;
      }
      scrollContainer.scrollLeft = scrollPosition;
      animationId = requestAnimationFrame(animate);
    };

    animationId = requestAnimationFrame(animate);

    return () => {
      cancelAnimationFrame(animationId);
    };
  }, []);

  // World-class brand portfolio with real company data
  const clients = [
    { 
      id: 1, 
      name: "Netflix", 
      icon: "🎬",
      color: "from-red-600 to-red-800",
      description: "Streaming Giant"
    },
    { 
      id: 2, 
      name: "Apple", 
      icon: "🍎",
      color: "from-gray-800 to-black",
      description: "Tech Innovation"
    },
    { 
      id: 3, 
      name: "Nike", 
      icon: "✔️",
      color: "from-orange-500 to-orange-700",
      description: "Just Do It"
    },
    { 
      id: 4, 
      name: "Spotify", 
      icon: "🎵",
      color: "from-green-500 to-green-700",
      description: "Music Streaming"
    },
    { 
      id: 5, 
      name: "Tesla", 
      icon: "⚡",
      color: "from-red-500 to-red-700",
      description: "Electric Future"
    },
    { 
      id: 6, 
      name: "Adobe", 
      icon: "🎨",
      color: "from-red-600 to-pink-600",
      description: "Creative Suite"
    },
    { 
      id: 7, 
      name: "Google", 
      icon: "🔍",
      color: "from-blue-500 to-green-500",
      description: "Search & Cloud"
    },
    { 
      id: 8, 
      name: "Microsoft", 
      icon: "💻",
      color: "from-blue-600 to-blue-800",
      description: "Enterprise Solutions"
    },
    { 
      id: 9, 
      name: "Amazon", 
      icon: "📦",
      color: "from-yellow-600 to-orange-600",
      description: "E-commerce Leader"
    },
    { 
      id: 10, 
      name: "Meta", 
      icon: "👥",
      color: "from-blue-600 to-purple-600",
      description: "Social Innovation"
    }
  ];

  // Duplicate for seamless infinite scroll
  const duplicatedClients = [...clients, ...clients];

  return (
    <section className="relative py-24 bg-gradient-to-br from-slate-50 via-white to-slate-100 overflow-hidden">
      {/* Background Pattern */}
      <div className="absolute inset-0 opacity-20">
        <div className="absolute inset-0" style={{
          backgroundImage: `radial-gradient(circle at 25% 25%, rgba(168, 85, 247, 0.1) 0%, transparent 50%), 
                           radial-gradient(circle at 75% 75%, rgba(236, 72, 153, 0.1) 0%, transparent 50%)`
        }}></div>
      </div>

      <div className="container mx-auto px-6 md:px-12 relative z-10">
        {/* Enhanced Header */}
        <div className="text-center mb-16 animate-fade-in-up">
          <div className="inline-block mb-4">
            <span className="px-6 py-2 bg-gradient-to-r from-purple-100 to-pink-100 text-purple-800 text-sm font-semibold rounded-full border border-purple-200 shadow-sm">
              ✨ Trusted Partnerships
            </span>
          </div>
          <h3 className="text-4xl md:text-5xl font-bold bg-gradient-to-r from-gray-800 via-gray-900 to-black bg-clip-text text-transparent mb-4">
            Trusted by Industry Leaders
          </h3>
          <p className="text-xl text-gray-600 max-w-2xl mx-auto leading-relaxed">
            We're proud to collaborate with world-class brands that push the boundaries of innovation
          </p>
        </div>

        {/* Infinite Scrolling Brand Showcase */}
        <div className="relative mb-16">
          <div 
            ref={scrollRef}
            className="flex gap-8 overflow-x-hidden whitespace-nowrap"
            style={{ scrollBehavior: 'smooth' }}
          >
            {duplicatedClients.map((client, index) => (
              <div
                key={`${client.id}-${index}`}
                className="group flex-shrink-0 relative"
              >
                <div className="relative">
                  {/* Main Card */}
                  <div className={`
                    w-64 h-40 rounded-3xl bg-gradient-to-br ${client.color} 
                    shadow-2xl hover:shadow-3xl transform transition-all duration-500 
                    hover:scale-110 hover:-rotate-2 cursor-pointer overflow-hidden
                    border border-white/20 backdrop-blur-sm
                  `}>
                    {/* Animated Background Pattern */}
                    <div className="absolute inset-0 opacity-20">
                      <div className="absolute top-0 left-0 w-full h-full bg-gradient-to-br from-white/30 to-transparent"></div>
                      <div className="absolute -top-4 -right-4 w-24 h-24 bg-white/10 rounded-full blur-xl animate-pulse"></div>
                      <div className="absolute -bottom-4 -left-4 w-32 h-32 bg-white/5 rounded-full blur-2xl animate-float-slow"></div>
                    </div>

                    {/* Content */}
                    <div className="relative z-10 p-8 h-full flex flex-col justify-between">
                      <div className="text-right">
                        <span className="text-white/70 text-xs font-medium uppercase tracking-wider">
                          {client.description}
                        </span>
                      </div>
                      
                      <div className="text-center">
                        <div className="text-5xl mb-3 animate-bounce-gentle">
                          {client.icon}
                        </div>
                        <h4 className="text-white text-2xl font-bold tracking-tight">
                          {client.name}
                        </h4>
                      </div>
                      
                      <div className="text-left">
                        <div className="w-12 h-1 bg-white/30 rounded-full"></div>
                      </div>
                    </div>

                    {/* Hover Glow Effect */}
                    <div className="absolute inset-0 opacity-0 group-hover:opacity-100 transition-opacity duration-500">
                      <div className="absolute inset-0 bg-white/10 rounded-3xl"></div>
                      <div className="absolute inset-2 border border-white/20 rounded-2xl"></div>
                    </div>
                  </div>

                  {/* Floating Elements */}
                  <div className="absolute -top-2 -right-2 w-6 h-6 bg-white rounded-full shadow-lg opacity-0 group-hover:opacity-100 transition-all duration-500 transform group-hover:scale-110"></div>
                  <div className="absolute -bottom-2 -left-2 w-4 h-4 bg-gradient-to-r from-purple-400 to-pink-400 rounded-full shadow-lg opacity-0 group-hover:opacity-100 transition-all duration-700 transform group-hover:scale-125"></div>
                </div>
              </div>
            ))}
          </div>

          {/* Gradient Overlays for smooth edges */}
          <div className="absolute top-0 left-0 w-32 h-full bg-gradient-to-r from-slate-50 to-transparent pointer-events-none z-10"></div>
          <div className="absolute top-0 right-0 w-32 h-full bg-gradient-to-l from-slate-50 to-transparent pointer-events-none z-10"></div>
        </div>

        {/* Statistics Section */}
        <div className="grid grid-cols-1 md:grid-cols-4 gap-8 animate-fade-in-up">
          <div className="text-center group cursor-pointer">
            <div className="relative mb-4">
              <div className="w-20 h-20 mx-auto bg-gradient-to-br from-purple-500 to-pink-500 rounded-2xl flex items-center justify-center shadow-xl group-hover:shadow-2xl transition-all duration-300 transform group-hover:scale-110 group-hover:rotate-6">
                <span className="text-white text-2xl">🎯</span>
              </div>
              <div className="absolute -top-1 -right-1 w-6 h-6 bg-green-400 rounded-full opacity-0 group-hover:opacity-100 transition-all duration-300 animate-pulse"></div>
            </div>
            <h4 className="text-3xl font-bold text-gray-800 mb-2 group-hover:text-purple-600 transition-colors duration-300">500+</h4>
            <p className="text-gray-600 font-medium">Projects Delivered</p>
          </div>

          <div className="text-center group cursor-pointer">
            <div className="relative mb-4">
              <div className="w-20 h-20 mx-auto bg-gradient-to-br from-blue-500 to-cyan-500 rounded-2xl flex items-center justify-center shadow-xl group-hover:shadow-2xl transition-all duration-300 transform group-hover:scale-110 group-hover:rotate-6">
                <span className="text-white text-2xl">🌟</span>
              </div>
              <div className="absolute -top-1 -right-1 w-6 h-6 bg-yellow-400 rounded-full opacity-0 group-hover:opacity-100 transition-all duration-300 animate-pulse"></div>
            </div>
            <h4 className="text-3xl font-bold text-gray-800 mb-2 group-hover:text-blue-600 transition-colors duration-300">98%</h4>
            <p className="text-gray-600 font-medium">Client Satisfaction</p>
          </div>

          <div className="text-center group cursor-pointer">
            <div className="relative mb-4">
              <div className="w-20 h-20 mx-auto bg-gradient-to-br from-green-500 to-emerald-500 rounded-2xl flex items-center justify-center shadow-xl group-hover:shadow-2xl transition-all duration-300 transform group-hover:scale-110 group-hover:rotate-6">
                <span className="text-white text-2xl">🏆</span>
              </div>
              <div className="absolute -top-1 -right-1 w-6 h-6 bg-orange-400 rounded-full opacity-0 group-hover:opacity-100 transition-all duration-300 animate-pulse"></div>
            </div>
            <h4 className="text-3xl font-bold text-gray-800 mb-2 group-hover:text-green-600 transition-colors duration-300">50+</h4>
            <p className="text-gray-600 font-medium">Awards Won</p>
          </div>

          <div className="text-center group cursor-pointer">
            <div className="relative mb-4">
              <div className="w-20 h-20 mx-auto bg-gradient-to-br from-orange-500 to-red-500 rounded-2xl flex items-center justify-center shadow-xl group-hover:shadow-2xl transition-all duration-300 transform group-hover:scale-110 group-hover:rotate-6">
                <span className="text-white text-2xl">🚀</span>
              </div>
              <div className="absolute -top-1 -right-1 w-6 h-6 bg-purple-400 rounded-full opacity-0 group-hover:opacity-100 transition-all duration-300 animate-pulse"></div>
            </div>
            <h4 className="text-3xl font-bold text-gray-800 mb-2 group-hover:text-orange-600 transition-colors duration-300">24/7</h4>
            <p className="text-gray-600 font-medium">Support Available</p>
          </div>
        </div>

        {/* Call to Action */}
        <div className="text-center mt-16 animate-fade-in-up">
          <div className="inline-block p-8 bg-gradient-to-br from-purple-600 via-pink-600 to-red-600 rounded-3xl shadow-2xl hover:shadow-3xl transition-all duration-500 transform hover:scale-105 cursor-pointer group">
            <h4 className="text-white text-2xl font-bold mb-3">Ready to Join Them?</h4>
            <p className="text-purple-100 mb-6 max-w-md">
              Partner with us and experience the same excellence that industry leaders trust.
            </p>
            <div className="flex items-center justify-center gap-2 text-white font-semibold">
              <span>Start Your Project</span>
              <div className="transform group-hover:translate-x-2 transition-transform duration-300">→</div>
            </div>
          </div>
        </div>
      </div>

      {/* Floating Background Elements */}
      <div className="absolute top-20 left-10 w-64 h-64 bg-purple-200/20 rounded-full blur-3xl animate-float-slow"></div>
      <div className="absolute bottom-20 right-10 w-96 h-96 bg-pink-200/20 rounded-full blur-3xl animate-float-reverse"></div>
    </section>
  );
};

export default ClientLogos;
