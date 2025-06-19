import { useState } from "react";
import { Link } from "react-router-dom";
import { Menu, X } from "lucide-react";
import { Button } from "@/components/ui/button";

interface NavItem {
  href: string;
  label: string;
}

const navItems: NavItem[] = [
  { href: "/", label: "Home" },
  { href: "/about", label: "About Us" },
  { href: "/programs", label: "Our Programs" },
  { href: "/impact", label: "Our Impact" },
  { href: "/get-involved", label: "Get Involved" },
  { href: "/contact", label: "Contact" },
];

const Header = () => {
  const [isMenuOpen, setIsMenuOpen] = useState(false);

  const toggleMenu = () => {
    setIsMenuOpen(!isMenuOpen);
  };

  return (
    <header className="bg-black text-white py-4 sticky top-0 z-50 shadow-md">
      <div className="container mx-auto px-4">
        <div className="flex justify-between items-center">
          {/* Logo */}
          <Link to="/" className="flex flex-col">
            <span className="font-bold text-2xl">
              <span className="text-white">PRACHETAS</span>{" "}
              <span className="text-[#FFD700]">FOUNDATION</span>
            </span>
            <span className="text-[#FFD700] text-sm tracking-wider font-medium">
              WHERE COMPASSION MEETS ACTION
            </span>
          </Link>          {/* Desktop Navigation */}
          <nav className="hidden md:flex items-center space-x-6">
            {navItems.map((item) => (
              <Link
                key={item.href}
                to={item.href}
                className="text-white hover:text-[#FFD700] transition-colors font-medium"
              >
                {item.label}
              </Link>
            ))}
            <Button
              asChild
              className="bg-[#D86C1F] text-white hover:bg-[#C35A15] transition-colors font-semibold px-6"
            >
              <Link to="/donate">Donate Now</Link>
            </Button>
          </nav>

          {/* Mobile Menu Button */}
          <button
            onClick={toggleMenu}
            className="md:hidden text-white"
            aria-label="Toggle Menu"
          >
            {isMenuOpen ? (
              <X className="h-6 w-6" />
            ) : (
              <Menu className="h-6 w-6" />
            )}
          </button>
        </div>        {/* Mobile Navigation */}
        {isMenuOpen && (
          <nav className="md:hidden mt-4 space-y-4 pb-4">
            {navItems.map((item) => (
              <Link
                key={item.href}
                to={item.href}
                className="block text-white hover:text-[#FFD700] transition-colors font-medium py-2"
                onClick={() => setIsMenuOpen(false)}
              >
                {item.label}
              </Link>
            ))}
            <Button
              asChild
              className="w-full bg-[#D86C1F] text-white hover:bg-[#C35A15] transition-colors font-semibold"
            >
              <Link to="/donate">Donate Now</Link>
            </Button>
          </nav>
        )}
      </div>
    </header>
  );
};

export default Header;
