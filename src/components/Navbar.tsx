import { useState, useEffect } from 'react';
import { Link } from 'react-router-dom';
import { Menu, X, Sparkles } from 'lucide-react';
import { Button } from "@/components/ui/button";

const Navbar = () => {
  const [isScrolled, setIsScrolled] = useState(false);
  const [mobileMenuOpen, setMobileMenuOpen] = useState(false);

  // Handle scroll event to change navbar appearance
  useEffect(() => {
    const handleScroll = () => {
      if (window.scrollY > 50) {
        setIsScrolled(true);
      } else {
        setIsScrolled(false);
      }
    };

    window.addEventListener('scroll', handleScroll);
    return () => window.removeEventListener('scroll', handleScroll);
  }, []);

  return (
    <header className={`fixed w-full z-50 transition-all duration-500 ${
      isScrolled 
        ? 'bg-black/20 backdrop-blur-xl py-3 shadow-lg shadow-purple-500/10' 
        : 'bg-transparent py-6'
    }`}>
      <div className="container mx-auto px-6 md:px-12 flex items-center justify-between">
        <Link to="/" className="flex items-center group animate-slide-up-1">
          <div className="relative">
            <span className="text-white font-bold text-xl md:text-2xl tracking-tight">
              Doodle<span className="text-gradient-enhanced">Cinematic</span>
            </span>
            <Sparkles className="absolute -top-1 -right-6 w-4 h-4 text-purple-400 animate-pulse opacity-80" />
          </div>
        </Link>

        {/* Desktop Navigation */}
        <nav className="hidden md:flex items-center space-x-8 animate-slide-up-2">
          <NavLink href="#about">About</NavLink>
          <NavLink href="#services">Services</NavLink>
          <NavLink href="#portfolio">Portfolio</NavLink>
          <NavLink href="#contact">Contact</NavLink>
          <Button className="group relative overflow-hidden bg-gradient-to-r from-purple-600 to-pink-600 hover:from-purple-700 hover:to-pink-700 text-white px-6 py-2 rounded-full font-semibold transition-all duration-300 transform hover:scale-105 shadow-lg hover:shadow-purple-500/25">
            <span className="relative z-10">Get a Quote</span>
            <div className="absolute inset-0 bg-gradient-to-r from-purple-400 to-pink-400 opacity-0 group-hover:opacity-100 transition-opacity duration-300 blur-xl"></div>
          </Button>
        </nav>

        {/* Mobile Menu Button */}
        <button 
          className="md:hidden text-white p-2 rounded-lg backdrop-blur-sm bg-white/10 border border-white/20 transition-all duration-300 hover:bg-white/20 animate-slide-up-3"
          onClick={() => setMobileMenuOpen(!mobileMenuOpen)}
        >
          {mobileMenuOpen ? <X size={20} /> : <Menu size={20} />}
        </button>
      </div>

      {/* Mobile Navigation */}
      <div className={`md:hidden transition-all duration-500 ease-out ${
        mobileMenuOpen 
          ? 'max-h-96 opacity-100' 
          : 'max-h-0 opacity-0 overflow-hidden'
      }`}>
        <div className="bg-black/95 backdrop-blur-xl border-t border-purple-500/20">
          <div className="container mx-auto px-6 py-6 flex flex-col space-y-4">
            <MobileNavLink href="#about" onClick={() => setMobileMenuOpen(false)}>About</MobileNavLink>
            <MobileNavLink href="#services" onClick={() => setMobileMenuOpen(false)}>Services</MobileNavLink>
            <MobileNavLink href="#portfolio" onClick={() => setMobileMenuOpen(false)}>Portfolio</MobileNavLink>
            <MobileNavLink href="#contact" onClick={() => setMobileMenuOpen(false)}>Contact</MobileNavLink>
            <Button className="bg-gradient-to-r from-purple-600 to-pink-600 hover:from-purple-700 hover:to-pink-700 text-white w-full mt-6 py-3 rounded-full font-semibold transition-all duration-300 transform hover:scale-105">
              Get a Quote
            </Button>
          </div>
        </div>
      </div>
    </header>
  );
};

// Desktop Nav Link Component
const NavLink = ({ href, children }: { href: string; children: React.ReactNode }) => (
  <a 
    href={href} 
    className="group relative text-white/80 hover:text-white transition-all duration-300 text-sm uppercase tracking-wide font-medium"
  >
    <span className="relative z-10">{children}</span>
    <div className="absolute inset-x-0 -bottom-1 h-0.5 bg-gradient-to-r from-purple-400 to-pink-400 scale-x-0 group-hover:scale-x-100 transition-transform duration-300 origin-left"></div>
  </a>
);

// Mobile Nav Link Component
const MobileNavLink = ({ href, onClick, children }: { href: string; onClick: () => void; children: React.ReactNode }) => (
  <a 
    href={href} 
    onClick={onClick}
    className="group relative text-white/80 hover:text-white py-3 text-lg font-medium transition-all duration-300 border-b border-white/10 hover:border-purple-500/50"
  >
    <span className="relative z-10 flex items-center">
      {children}
      <div className="ml-auto w-2 h-2 bg-purple-400 rounded-full scale-0 group-hover:scale-100 transition-transform duration-300"></div>
    </span>
  </a>
);

export default Navbar;
