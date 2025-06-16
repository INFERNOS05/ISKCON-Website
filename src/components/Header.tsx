
import { Button } from "@/components/ui/button";
import { Menu, Search } from "lucide-react";
import { Link } from "react-router-dom";

const Header = () => {
  return (    <header className="bg-black/95 backdrop-blur-sm shadow-md sticky top-0 z-50">
      <div className="container mx-auto px-4">
        <div className="flex items-center justify-between py-2">          <div className="flex items-center space-x-3">
            <div className="h-10 w-10 relative">
              <img 
                src="/logo.svg" 
                alt="Prachetas Logo" 
                className="h-full w-full object-contain" 
              />
            </div>            <div className="flex flex-col">
              <div className="flex items-center gap-1">
                <span className="text-xl font-bold leading-none text-white">PRACHETAS</span>
                <span className="text-xl font-bold leading-none text-amber-400">FOUNDATION</span>
              </div>
              <span className="text-xs text-amber-400">WHERE COMPASSION MEETS ACTION</span>
            </div>
          </div><nav className="hidden md:flex items-center space-x-6">
            <a href="#about" className="text-gray-200 hover:text-amber-400 font-medium transition-colors">About Us</a>
            <a href="#impact" className="text-gray-200 hover:text-amber-400 font-medium transition-colors">Our Impact</a>
            <a href="#programs" className="text-gray-200 hover:text-amber-400 font-medium transition-colors">Programs</a>
            <a href="#testimonials" className="text-gray-200 hover:text-amber-400 font-medium transition-colors">Testimonials</a>
            <a href="#gallery" className="text-gray-200 hover:text-amber-400 font-medium transition-colors">Gallery</a>
          </nav>          <div className="flex items-center space-x-4">
            <Search className="h-5 w-5 text-gray-300 cursor-pointer hover:text-amber-400" />            <Button className="bg-amber-400 hover:bg-amber-500 text-black font-medium px-4 py-2 rounded-none" asChild>
              <Link to="/donate">Donate Now</Link>
            </Button>
            <Menu className="h-6 w-6 text-gray-300 md:hidden cursor-pointer" />
          </div>
        </div>
      </div>
    </header>
  );
};

export default Header;
