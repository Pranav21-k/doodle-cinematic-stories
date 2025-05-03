
import { Video, Instagram, Calendar, Code } from 'lucide-react';
import { Button } from "@/components/ui/button";

const Services = () => {
  // Define services
  const services = [
    {
      id: 1,
      title: "Video Production",
      description: "From commercials to brand films, we create cinematic video content that tells your story and captivates your audience.",
      icon: <Video size={32} />,
      offerings: ["Commercial Production", "Brand Films", "Corporate Video", "Motion Graphics"],
    },
    {
      id: 2,
      title: "Social Media Management",
      description: "Strategic planning, content creation, and analytics to grow your brand's social presence and engagement.",
      icon: <Instagram size={32} />,
      offerings: ["Content Strategy", "Creative Production", "Community Management", "Performance Analytics"],
    },
    {
      id: 3,
      title: "Web & App Development",
      description: "Custom digital experiences that extend your brand and deliver seamless user journeys across devices.",
      icon: <Code size={32} />,
      offerings: ["Website Design", "E-commerce Solutions", "Mobile Applications", "Content Management"],
    }
  ];

  return (
    <section id="services" className="section-padding bg-doodle-black text-white">
      <div className="container mx-auto px-6 md:px-12">
        {/* Section Header */}
        <div className="text-center mb-16">
          <h2 className="section-title animate-fade-in">Our Services</h2>
          <p className="section-subtitle max-w-2xl mx-auto text-gray-300">
            Comprehensive solutions to bring your brand's story to life across all digital touchpoints.
          </p>
        </div>
        
        {/* Services Grid */}
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8">
          {services.map((service, index) => (
            <div 
              key={service.id} 
              className="bg-black/50 backdrop-blur-sm rounded-lg p-8 border border-white/10 transition-all duration-300 hover:border-doodle-purple hover:shadow-lg hover:shadow-doodle-purple/10 animate-zoom-in"
              style={{ animationDelay: `${index * 100}ms` }}
            >
              <div className="bg-doodle-purple/20 p-3 rounded-full w-fit mb-6">
                {service.icon}
              </div>
              <h3 className="text-2xl font-bold mb-4">{service.title}</h3>
              <p className="text-gray-400 mb-6">{service.description}</p>
              <ul className="mb-8 space-y-2">
                {service.offerings.map((offering, idx) => (
                  <li key={idx} className="flex items-center text-sm text-gray-300">
                    <div className="w-1.5 h-1.5 rounded-full bg-doodle-purple mr-2"></div>
                    {offering}
                  </li>
                ))}
              </ul>
              <Button variant="outline" className="w-full justify-center border-doodle-purple text-doodle-purple hover:bg-doodle-purple hover:text-white">
                Learn More
              </Button>
            </div>
          ))}
        </div>
      </div>
    </section>
  );
};

export default Services;
