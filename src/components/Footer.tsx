
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Github, Twitter, Instagram, Linkedin, Mail, Phone, MapPin } from "lucide-react";

const Footer = () => {
  return (    <footer className="bg-black text-white">
      <div className="container mx-auto px-4 py-16">
        <div className="grid md:grid-cols-4 gap-8">
          <div>
            <div className="flex items-center space-x-3 mb-6">
              <div className="h-10 w-10 relative">
                <img 
                  src="/logo.svg" 
                  alt="Prachetas Logo" 
                  className="h-full w-full object-contain" 
                />
              </div>              <div className="flex flex-col">
                <div className="flex items-center gap-1">
                  <span className="text-xl font-bold leading-none text-white">PRACHETAS</span>
                  <span className="text-xl font-bold leading-none text-amber-400">FOUNDATION</span>
                </div>
                <span className="text-xs text-amber-400">WHERE COMPASSION MEETS ACTION</span>
              </div>
            </div>            <p className="text-gray-300 mb-6">
              Building stronger communities through collaborative initiatives, empowering individuals, and fostering sustainable development worldwide.
            </p>            <div className="flex space-x-4">
              <Github className="h-6 w-6 text-gray-400 hover:text-amber-400 transition-colors cursor-pointer" />
              <Twitter className="h-6 w-6 text-gray-400 hover:text-amber-400 transition-colors cursor-pointer" />
              <Instagram className="h-6 w-6 text-gray-400 hover:text-amber-400 transition-colors cursor-pointer" />
              <Linkedin className="h-6 w-6 text-gray-400 hover:text-amber-400 transition-colors cursor-pointer" />
            </div>
          </div>          <div>
            <h3 className="text-xl font-semibold mb-6 text-amber-400">Quick Links</h3>
            <ul className="space-y-3 text-gray-300">
              <li><a href="#about" className="hover:text-amber-400 transition-colors">About Us</a></li>
              <li><a href="#programs" className="hover:text-amber-400 transition-colors">Our Programs</a></li>
              <li><a href="#impact" className="hover:text-amber-400 transition-colors">Our Impact</a></li>
              <li><a href="#" className="hover:text-amber-400 transition-colors">Donate</a></li>
              <li><a href="#" className="hover:text-amber-400 transition-colors">Volunteer</a></li>
            </ul>
          </div>          <div>            <h3 className="text-xl font-semibold mb-6 text-amber-400">Contact Info</h3>
            <div className="space-y-3 text-gray-300">
              <div className="flex items-start">
                <MapPin className="h-5 w-5 mr-3 text-amber-400 flex-shrink-0 mt-1" />
                <span>Regd Office: Ganga Panama, Pimple Nilakh, Pune 411027</span>
              </div>
              <div className="flex items-center">
                <Phone className="h-5 w-5 mr-3 text-amber-400" />
                <span>+91 8888808112</span>
              </div>
              <div className="flex items-center">
                <Mail className="h-5 w-5 mr-3 text-amber-400" />
                <span>prachetasfoundation@gmail.com</span>
              </div>
              <div className="flex items-center pt-2">
                <span className="text-amber-400 font-medium">Government ID Number:</span>
                <span className="ml-2">MAHA/953/2022</span>
              </div>
            </div>
          </div>          <div>
            <h3 className="text-xl font-semibold mb-6 text-amber-400">Stay Updated</h3>
            <p className="text-gray-300 mb-4">Subscribe to our newsletter for the latest updates and stories.</p>
            <div className="flex flex-col space-y-3">              <Input 
                placeholder="Enter your email" 
                className="bg-white/90 border-none text-gray-900 rounded-none"
              /><Button className="bg-amber-400 hover:bg-amber-500 text-black font-medium rounded-none">
                Subscribe
              </Button>
            </div>
          </div>
        </div>        <div className="border-t border-gray-800 mt-12 pt-8 text-center text-gray-400">
          <p>&copy; {new Date().getFullYear()} PRACHETAS Foundation. All rights reserved. | Privacy Policy | Terms of Service</p>
        </div>
      </div>
    </footer>
  );
};

export default Footer;
