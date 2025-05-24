
import { useState } from "react";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Textarea } from "@/components/ui/textarea";
import { toast } from "@/components/ui/use-toast";
import { Phone, Mail, MapPin, Send, MessageCircle } from "lucide-react";

const ContactSection = () => {
  const [formData, setFormData] = useState({
    name: "",
    email: "",
    phone: "",
    company: "",
    message: "",
  });

  const [isSubmitting, setIsSubmitting] = useState(false);

  const handleChange = (
    e: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement>
  ) => {
    const { name, value } = e.target;
    setFormData((prev) => ({
      ...prev,
      [name]: value,
    }));
  };

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    setIsSubmitting(true);

    // Simulate form submission
    setTimeout(() => {
      toast({
        title: "Message Sent",
        description: "We'll get back to you as soon as possible!",
      });
      setIsSubmitting(false);
      setFormData({
        name: "",
        email: "",
        phone: "",
        company: "",
        message: "",
      });
    }, 1500);
  };

  return (
    <section id="contact" className="py-12 md:py-20 lg:py-32 bg-gray-50 relative">
      <div className="container mx-auto px-4 sm:px-6 md:px-12">
        {/* Section Header */}
        <div className="text-center mb-8 md:mb-16">
          <h2 className="text-3xl sm:text-4xl md:text-5xl lg:text-6xl font-bold text-gray-800 mb-4 md:mb-6 animate-fade-in">
            Get in Touch
          </h2>
          <p className="text-base sm:text-lg md:text-xl text-gray-600 leading-relaxed max-w-2xl mx-auto px-4">
            Ready to turn your vision into reality? Contact Pranav today to start the
            conversation.
          </p>
        </div>

        <div className="grid grid-cols-1 lg:grid-cols-5 gap-8 lg:gap-12">
          {/* Contact Information */}
          <div className="lg:col-span-2 animate-slide-in-left">
            <div className="bg-white p-6 md:p-8 rounded-lg shadow-md">
              <h3 className="text-xl md:text-2xl font-bold mb-6 text-gray-800">Contact Information</h3>
              
              <div className="space-y-6">
                {/* Name */}
                <div className="flex items-start space-x-4">
                  <div className="bg-purple-100 p-3 rounded-full flex-shrink-0">
                    <Phone size={20} className="text-purple-600" />
                  </div>
                  <div className="min-w-0 flex-1">
                    <h4 className="font-medium text-gray-800 text-sm md:text-base">Director & Producer</h4>
                    <p className="text-gray-800 font-semibold text-sm md:text-base">Pranav Kottappurath</p>
                  </div>
                </div>

                {/* Phone */}
                <div className="flex items-start space-x-4">
                  <div className="bg-purple-100 p-3 rounded-full flex-shrink-0">
                    <Phone size={20} className="text-purple-600" />
                  </div>
                  <div className="min-w-0 flex-1">
                    <h4 className="font-medium text-gray-800 text-sm md:text-base">Phone</h4>
                    <a 
                      href="tel:+12012841297" 
                      className="text-purple-600 hover:text-purple-800 transition-colors duration-200 font-medium text-sm md:text-base break-all"
                    >
                      +1 201-284-1297
                    </a>
                  </div>
                </div>
                
                {/* Email */}
                <div className="flex items-start space-x-4">
                  <div className="bg-purple-100 p-3 rounded-full flex-shrink-0">
                    <Mail size={20} className="text-purple-600" />
                  </div>
                  <div className="min-w-0 flex-1">
                    <h4 className="font-medium text-gray-800 text-sm md:text-base">Email</h4>
                    <a 
                      href="mailto:pranav21.kt@gmail.com" 
                      className="text-purple-600 hover:text-purple-800 transition-colors duration-200 font-medium text-sm md:text-base break-all"
                    >
                      pranav21.kt@gmail.com
                    </a>
                  </div>
                </div>

                {/* WhatsApp */}
                <div className="flex items-start space-x-4">
                  <div className="bg-green-100 p-3 rounded-full flex-shrink-0">
                    <MessageCircle size={20} className="text-green-600" />
                  </div>
                  <div className="min-w-0 flex-1">
                    <h4 className="font-medium text-gray-800 text-sm md:text-base">WhatsApp</h4>
                    <a 
                      href="https://wa.me/12012841297" 
                      target="_blank" 
                      rel="noopener noreferrer"
                      className="text-green-600 hover:text-green-800 transition-colors duration-200 font-medium text-sm md:text-base flex items-center gap-2 flex-wrap"
                    >
                      Message on WhatsApp
                      <MessageCircle size={16} className="flex-shrink-0" />
                    </a>
                  </div>
                </div>
                
                {/* Location */}
                <div className="flex items-start space-x-4">
                  <div className="bg-purple-100 p-3 rounded-full flex-shrink-0">
                    <MapPin size={20} className="text-purple-600" />
                  </div>
                  <div className="min-w-0 flex-1">
                    <h4 className="font-medium text-gray-800 text-sm md:text-base">Studio Location</h4>
                    <p className="text-gray-600 text-sm md:text-base leading-relaxed">
                      430 Central Ave<br />
                      Jersey City, New Jersey<br />
                      07307
                    </p>
                  </div>
                </div>
              </div>
              
              {/* Google Maps Embed */}
              <div className="mt-8 h-48 bg-gray-200 rounded-lg overflow-hidden shadow-lg">
                <iframe
                  src="https://www.google.com/maps/embed?pb=!1m18!1m12!1m3!1d3024.686421!2d-74.0539739!3d40.7262779!2m3!1f0!2f0!3f0!3m2!1i1024!2i768!4f13.1!3m3!1m2!1s0x89c25771b3b6bdc5%3A0x623e8bd1d80b1e8!2s430%20Central%20Ave%2C%20Jersey%20City%2C%20NJ%2007307%2C%20USA!5e0!3m2!1sen!2sus!4v1652389888851!5m2!1sen!2sus"
                  width="100%"
                  height="100%"
                  style={{ border: 0 }}
                  allowFullScreen
                  loading="lazy"
                  referrerPolicy="no-referrer-when-downgrade"
                  title="Doodle Production Studio Location - Jersey City, NJ"
                ></iframe>
              </div>
            </div>
          </div>
          
          {/* Contact Form */}
          <div className="lg:col-span-3 animate-slide-in-right">
            <div className="bg-white p-6 md:p-8 rounded-lg shadow-md">
              <h3 className="text-xl md:text-2xl font-bold mb-6 text-gray-800">Send Us a Message</h3>
              
              <form onSubmit={handleSubmit} className="space-y-4">
                <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                  <div>
                    <label htmlFor="name" className="block text-sm font-medium mb-1 text-gray-700">
                      Full Name *
                    </label>
                    <Input
                      id="name"
                      name="name"
                      value={formData.name}
                      onChange={handleChange}
                      required
                      className="w-full"
                    />
                  </div>
                  <div>
                    <label htmlFor="email" className="block text-sm font-medium mb-1 text-gray-700">
                      Email Address *
                    </label>
                    <Input
                      id="email"
                      name="email"
                      type="email"
                      value={formData.email}
                      onChange={handleChange}
                      required
                      className="w-full"
                    />
                  </div>
                </div>
                
                <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                  <div>
                    <label htmlFor="phone" className="block text-sm font-medium mb-1 text-gray-700">
                      Phone Number
                    </label>
                    <Input
                      id="phone"
                      name="phone"
                      value={formData.phone}
                      onChange={handleChange}
                      className="w-full"
                    />
                  </div>
                  <div>
                    <label htmlFor="company" className="block text-sm font-medium mb-1 text-gray-700">
                      Company
                    </label>
                    <Input
                      id="company"
                      name="company"
                      value={formData.company}
                      onChange={handleChange}
                      className="w-full"
                    />
                  </div>
                </div>
                
                <div>
                  <label htmlFor="message" className="block text-sm font-medium mb-1 text-gray-700">
                    Your Message *
                  </label>
                  <Textarea
                    id="message"
                    name="message"
                    rows={5}
                    value={formData.message}
                    onChange={handleChange}
                    required
                    className="w-full"
                  />
                </div>
                
                <Button className="btn-primary w-full" type="submit" disabled={isSubmitting}>
                  {isSubmitting ? (
                    <span className="flex items-center justify-center">
                      <svg className="animate-spin -ml-1 mr-2 h-4 w-4 text-white" xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24">
                        <circle className="opacity-25" cx="12" cy="12" r="10" stroke="currentColor" strokeWidth="4"></circle>
                        <path className="opacity-75" fill="currentColor" d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4zm2 5.291A7.962 7.962 0 014 12H0c0 3.042 1.135 5.824 3 7.938l3-2.647z"></path>
                      </svg>
                      Sending...
                    </span>
                  ) : (
                    <span className="flex items-center justify-center">
                      Send Message <Send size={16} className="ml-2" />
                    </span>
                  )}
                </Button>
              </form>
            </div>
          </div>
        </div>
      </div>
    </section>
  );
};

export default ContactSection;
