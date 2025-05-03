
import { Button } from "@/components/ui/button";

const AboutUs = () => {
  return (
    <section id="about" className="section-padding bg-white">
      <div className="container mx-auto px-6 md:px-12">
        {/* Section Header */}
        <div className="text-center mb-16">
          <h2 className="section-title animate-fade-in">About Us</h2>
          <p className="section-subtitle max-w-2xl mx-auto">
            A creative powerhouse dedicated to telling your story through the power of cinema.
          </p>
        </div>
        
        {/* Content Grid */}
        <div className="grid grid-cols-1 lg:grid-cols-2 gap-12 items-center">
          {/* Image/Video Side */}
          <div className="relative animate-slide-in-left">
            <div className="aspect-video bg-doodle-gray rounded-lg overflow-hidden shadow-lg">
              {/* Replace with your actual image or embed */}
              <img 
                src="https://images.unsplash.com/photo-1605810230434-7631ac76ec81"
                alt="Doodle Production Team Working" 
                className="w-full h-full object-cover"
              />
            </div>
            {/* Floating accent */}
            <div className="absolute -bottom-6 -right-6 w-32 h-32 bg-doodle-purple rounded-lg -z-10 hidden md:block"></div>
          </div>
          
          {/* Text Side */}
          <div className="animate-slide-in-right">
            <h3 className="text-2xl md:text-3xl font-bold mb-6">Our Story</h3>
            <p className="text-gray-700 mb-6">
              Doodle Production was founded with a singular mission: to transform stories into cinematic experiences that captivate, inspire, and drive results for our clients.
            </p>
            <p className="text-gray-700 mb-6">
              What began as a passion for visual storytelling has evolved into a full-service creative studio, blending artistic vision with strategic thinking to create content that stands out in today's crowded digital landscape.
            </p>
            
            <h4 className="text-xl font-semibold mb-4">Our Values</h4>
            <div className="grid grid-cols-1 md:grid-cols-2 gap-4 mb-8">
              {['Creative Excellence', 'Strategic Thinking', 'Client Partnership', 'Technical Innovation'].map((value) => (
                <div key={value} className="flex items-center">
                  <div className="w-2 h-2 bg-doodle-purple rounded-full mr-2"></div>
                  <span>{value}</span>
                </div>
              ))}
            </div>
            
            <Button className="btn-outline">Meet Our Team</Button>
          </div>
        </div>
      </div>
    </section>
  );
};

export default AboutUs;
