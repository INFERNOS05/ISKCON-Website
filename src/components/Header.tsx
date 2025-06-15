
import { Button } from "@/components/ui/button";
import { Menu, Search, Heart } from "lucide-react";

const Header = () => {
  return (
    <header className="bg-white shadow-sm sticky top-0 z-50">
      <div className="container mx-auto px-4">
        <div className="flex items-center justify-between py-4">
          <div className="flex items-center space-x-2">
            <Heart className="h-8 w-8 text-orange-500" />
            <span className="text-2xl font-bold text-green-800">GreenHope</span>
          </div>
          
          <nav className="hidden md:flex items-center space-x-8">
            <a href="#" className="text-gray-700 hover:text-green-700 transition-colors">About Us</a>
            <a href="#" className="text-gray-700 hover:text-green-700 transition-colors">Our Work</a>
            <a href="#" className="text-gray-700 hover:text-green-700 transition-colors">Get Involved</a>
            <a href="#" className="text-gray-700 hover:text-green-700 transition-colors">Stories</a>
            <a href="#" className="text-gray-700 hover:text-green-700 transition-colors">Resources</a>
          </nav>

          <div className="flex items-center space-x-4">
            <Search className="h-5 w-5 text-gray-600 cursor-pointer hover:text-green-700" />
            <Button className="bg-orange-500 hover:bg-orange-600 text-white">
              Donate Now
            </Button>
            <Menu className="h-6 w-6 text-gray-600 md:hidden cursor-pointer" />
          </div>
        </div>
      </div>
    </header>
  );
};

export default Header;
