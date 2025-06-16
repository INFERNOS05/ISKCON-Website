import { useState } from "react";
import { Link } from "react-router-dom";
import { Menu, X } from "lucide-react";
import { Button } from "@/components/ui/button";

const Header = () => {
  const [isMenuOpen, setIsMenuOpen] = useState(false);

  const toggleMenu = () => {
    setIsMenuOpen(!isMenuOpen);
  };

  return (
    <header className="bg-black text-white py-4 sticky top-0 z-50">
      <div className="container mx-auto px-4">
        <div className="flex justify-between items-center">
          {/* Logo */}
          <Link to="/" className="flex flex-col">
            <span className="font-bold text-2xl">
              <span className="text-white">PRACHETAS</span> <span className="text-yellow-400">FOUNDATION</span>
            </span>
            <span className="text-yellow-400 text-sm tracking-wider">WHERE COMPASSION MEETS ACTION</span>
          </Link>          {/* Desktop Navigation */}          <nav className="hidden md:flex items-center space-x-6">
            <a href="#hero" className="hover:text-yellow-400 transition-colors">
              Home
            </a>
            <a href="#about" className="hover:text-yellow-400 transition-colors">
              About Us
            </a>
            <a href="#programs" className="hover:text-yellow-400 transition-colors">
              Our Programs
            </a>
            <a href="#impact" className="hover:text-yellow-400 transition-colors">
              Our Impact
            </a>
            <a href="#get-involved" className="hover:text-yellow-400 transition-colors">
              Get Involved
            </a>
            <a href="#contact" className="hover:text-yellow-400 transition-colors">
              Contact
            </a>
            <Button asChild variant="outline" className="border-yellow-400 text-yellow-400 hover:bg-yellow-400 hover:text-black">
              <Link to="/donate">Donate Now</Link>
            </Button>
          </nav>{/* Mobile Menu Button */}
          <button
            onClick={toggleMenu}
            className="md:hidden text-white"
            aria-label="Toggle Menu"
          >
            {isMenuOpen ? <X size={24} /> : <Menu size={24} />}
          </button>
        </div>        {/* Mobile Navigation */}
        {isMenuOpen && (
          <nav className="md:hidden mt-4 flex flex-col space-y-4 pb-4">
            <a
              href="#hero"
              className="hover:text-yellow-400 transition-colors"
              onClick={() => setIsMenuOpen(false)}
            >
              Home
            </a>
            <a
              href="#about"
              className="hover:text-yellow-400 transition-colors"
              onClick={() => setIsMenuOpen(false)}
            >
              About Us
            </a>
            <a
              href="#programs"
              className="hover:text-yellow-400 transition-colors"
              onClick={() => setIsMenuOpen(false)}
            >
              Our Programs
            </a>
            <a
              href="#impact"
              className="hover:text-yellow-400 transition-colors"
              onClick={() => setIsMenuOpen(false)}
            >
              Our Impact
            </a>
            <a
              href="#get-involved"
              className="hover:text-yellow-400 transition-colors"
              onClick={() => setIsMenuOpen(false)}
            >
              Get Involved
            </a>
            <a
              href="#contact"
              className="hover:text-yellow-400 transition-colors"
              onClick={() => setIsMenuOpen(false)}
            >
              Contact
            </a>
            <Button asChild variant="outline" className="border-yellow-400 text-yellow-400 hover:bg-yellow-400 hover:text-black w-full">
              <Link to="/donate" onClick={() => setIsMenuOpen(false)}>Donate Now</Link>
            </Button>
          </nav>
        )}
      </div>
    </header>
  );
};

export default Header;
