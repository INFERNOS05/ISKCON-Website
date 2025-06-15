
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Heart, Facebook, Twitter, Instagram, Linkedin, Mail, Phone, MapPin } from "lucide-react";

const Footer = () => {
  return (
    <footer className="bg-green-800 text-white">
      <div className="container mx-auto px-4 py-16">
        <div className="grid md:grid-cols-4 gap-8">
          <div>
            <div className="flex items-center space-x-2 mb-6">
              <Heart className="h-8 w-8 text-orange-500" />
              <span className="text-2xl font-bold">GreenHope</span>
            </div>
            <p className="text-green-100 mb-6">
              Building a better future for every child through education, healthcare, and community development.
            </p>
            <div className="flex space-x-4">
              <Facebook className="h-6 w-6 text-green-300 hover:text-white cursor-pointer" />
              <Twitter className="h-6 w-6 text-green-300 hover:text-white cursor-pointer" />
              <Instagram className="h-6 w-6 text-green-300 hover:text-white cursor-pointer" />
              <Linkedin className="h-6 w-6 text-green-300 hover:text-white cursor-pointer" />
            </div>
          </div>

          <div>
            <h3 className="text-lg font-semibold mb-6">Quick Links</h3>
            <ul className="space-y-3 text-green-100">
              <li><a href="#" className="hover:text-white transition-colors">About Us</a></li>
              <li><a href="#" className="hover:text-white transition-colors">Our Programs</a></li>
              <li><a href="#" className="hover:text-white transition-colors">Get Involved</a></li>
              <li><a href="#" className="hover:text-white transition-colors">Annual Reports</a></li>
              <li><a href="#" className="hover:text-white transition-colors">Careers</a></li>
            </ul>
          </div>

          <div>
            <h3 className="text-lg font-semibold mb-6">Contact Info</h3>
            <div className="space-y-3 text-green-100">
              <div className="flex items-center">
                <MapPin className="h-5 w-5 mr-3" />
                <span>123 Hope Street, City, Country</span>
              </div>
              <div className="flex items-center">
                <Phone className="h-5 w-5 mr-3" />
                <span>+1-234-567-8900</span>
              </div>
              <div className="flex items-center">
                <Mail className="h-5 w-5 mr-3" />
                <span>info@greenhope.org</span>
              </div>
            </div>
          </div>

          <div>
            <h3 className="text-lg font-semibold mb-6">Stay Updated</h3>
            <p className="text-green-100 mb-4">Subscribe to our newsletter for the latest updates and stories.</p>
            <div className="flex flex-col space-y-3">
              <Input 
                placeholder="Enter your email" 
                className="bg-white border-none text-gray-900"
              />
              <Button className="bg-orange-500 hover:bg-orange-600 text-white">
                Subscribe
              </Button>
            </div>
          </div>
        </div>

        <div className="border-t border-green-700 mt-12 pt-8 text-center text-green-100">
          <p>&copy; 2024 GreenHope. All rights reserved. | Privacy Policy | Terms of Service</p>
        </div>
      </div>
    </footer>
  );
};

export default Footer;
