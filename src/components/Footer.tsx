
import { Link } from "react-router-dom";
import { Instagram, Facebook, Linkedin, Youtube } from "lucide-react";

const Footer = () => {
  // Get current year for copyright
  const currentYear = new Date().getFullYear();

  return (
    <footer className="bg-doodle-black text-white">
      {/* Main Footer */}
      <div className="container mx-auto px-6 md:px-12 pt-16 pb-12">
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-10">
          {/* Company Info */}
          <div>
            <h3 className="text-xl font-bold mb-4">
              Doodle<span className="text-doodle-purple">Production</span>
            </h3>
            <p className="text-gray-400 mb-6">
              Your story, cinematically told. We are a creative powerhouse dedicated to visual storytelling through video production and digital content.
            </p>
            <div className="flex space-x-4">
              <SocialLink href="https://instagram.com" icon={<Instagram size={18} />} />
              <SocialLink href="https://facebook.com" icon={<Facebook size={18} />} />
              <SocialLink href="https://linkedin.com" icon={<Linkedin size={18} />} />
              <SocialLink href="https://youtube.com" icon={<Youtube size={18} />} />
            </div>
          </div>
          
          {/* Quick Links */}
          <div>
            <h4 className="text-lg font-bold mb-4">Quick Links</h4>
            <ul className="space-y-2">
              {["About Us", "Services", "Portfolio", "Blog", "Careers", "Contact"].map((link) => (
                <li key={link}>
                  <FooterLink href={`#${link.toLowerCase().replace(/\s/g, '')}`}>{link}</FooterLink>
                </li>
              ))}
            </ul>
          </div>
          
          {/* Services */}
          <div>
            <h4 className="text-lg font-bold mb-4">Our Services</h4>
            <ul className="space-y-2">
              {[
                "Video Production", 
                "Commercial Filming", 
                "Social Media Content", 
                "Brand Films", 
                "Web Development",
                "App Development"
              ].map((service) => (
                <li key={service}>
                  <FooterLink href="#">{service}</FooterLink>
                </li>
              ))}
            </ul>
          </div>
          
          {/* Contact Info */}
          <div>
            <h4 className="text-lg font-bold mb-4">Contact Us</h4>
            <address className="not-italic">
              <p className="text-gray-400 mb-2">123 Creative Avenue</p>
              <p className="text-gray-400 mb-4">Los Angeles, CA 90012</p>
              <p className="text-gray-400 mb-2">hello@doodleproduction.com</p>
              <p className="text-gray-400">+1 (555) 123-4567</p>
            </address>
          </div>
        </div>
      </div>
      
      {/* Copyright */}
      <div className="border-t border-white/10">
        <div className="container mx-auto px-6 md:px-12 py-6 flex flex-col md:flex-row justify-between items-center">
          <p className="text-gray-400 text-sm mb-4 md:mb-0">
            &copy; {currentYear} Doodle Production. All rights reserved.
          </p>
          <div className="flex space-x-6 text-sm text-gray-400">
            <FooterLink href="#">Privacy Policy</FooterLink>
            <FooterLink href="#">Terms of Service</FooterLink>
            <FooterLink href="#">Cookie Policy</FooterLink>
          </div>
        </div>
      </div>
    </footer>
  );
};

// Footer Link Component
const FooterLink = ({ href, children }: { href: string; children: React.ReactNode }) => (
  <a 
    href={href} 
    className="text-gray-400 hover:text-white transition-colors duration-200"
  >
    {children}
  </a>
);

// Social Link Component
const SocialLink = ({ href, icon }: { href: string; icon: React.ReactNode }) => (
  <a 
    href={href} 
    className="w-8 h-8 rounded-full bg-white/10 flex items-center justify-center hover:bg-doodle-purple transition-colors duration-200"
  >
    {icon}
  </a>
);

export default Footer;
