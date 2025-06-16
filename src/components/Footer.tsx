import { Link } from "react-router-dom";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Github, Twitter, Instagram, Linkedin, Youtube, ArrowRight, MapPin, Phone, Mail } from "lucide-react";

const Footer = () => {
  return (
    <footer className="bg-black text-white pt-16 pb-8">
      <div className="container mx-auto px-4">
        <div className="grid md:grid-cols-4 gap-8 mb-12">
          {/* Column 1 - About */}
          <div>
            <div className="flex flex-col mb-6">
              <span className="font-bold text-2xl">
                <span className="text-white">PRACHETAS</span> <span className="text-yellow-400">FOUNDATION</span>
              </span>
              <span className="text-yellow-400 text-sm tracking-wider">WHERE COMPASSION MEETS ACTION</span>
            </div>
            <p className="text-gray-400 mb-6">
              Building stronger communities through collaborative initiatives, empowering individuals, and fostering sustainable development worldwide.
            </p>
            <div className="flex space-x-4">
              <a href="https://github.com" className="text-gray-400 hover:text-yellow-400" aria-label="Github">
                <Github size={20} />
              </a>
              <a href="https://twitter.com" className="text-gray-400 hover:text-yellow-400" aria-label="Twitter">
                <Twitter size={20} />
              </a>              <a href="https://instagram.com" className="text-gray-400 hover:text-yellow-400" aria-label="Instagram">
                <Instagram size={20} />
              </a>              <a href="https://linkedin.com" className="text-gray-400 hover:text-yellow-400" aria-label="LinkedIn">
                <Linkedin size={20} />
              </a>
              <a href="https://youtube.com" className="text-gray-400 hover:text-yellow-400" aria-label="YouTube">
                <Youtube size={20} />
              </a>
            </div>
          </div>
          
          {/* Column 2 - Quick Links */}
          <div>            <h4 className="text-xl font-semibold mb-6 text-yellow-400">Quick Links</h4>
            <ul className="space-y-3">
              <li>
                <Link to="/about" className="text-gray-400 hover:text-yellow-400 transition-colors">
                  About Us
                </Link>
              </li>
              <li>
                <Link to="/programs" className="text-gray-400 hover:text-yellow-400 transition-colors">
                  Our Programs
                </Link>
              </li>
              <li>
                <Link to="/volunteer" className="text-gray-400 hover:text-yellow-400 transition-colors">
                  Volunteer
                </Link>
              </li>
              <li>
                <Link to="/donate" className="text-gray-400 hover:text-yellow-400 transition-colors">
                  Donate
                </Link>
              </li>
              <li>
                <Link to="/news" className="text-gray-400 hover:text-yellow-400 transition-colors">
                  News & Updates
                </Link>
              </li>
            </ul>
          </div>
            {/* Column 3 - Programs */}
          <div>
            <h4 className="text-xl font-semibold mb-6 text-yellow-400">Our Programs</h4>
            <ul className="space-y-3">
              <li>
                <Link to="/programs/tech-education" className="text-gray-400 hover:text-yellow-400 transition-colors">
                  Education Initiatives
                </Link>
              </li>
              <li>
                <Link to="/programs/green-cloud" className="text-gray-400 hover:text-yellow-400 transition-colors">
                  Community Development
                </Link>
              </li>
              <li>
                <Link to="/programs/data-projects" className="text-gray-400 hover:text-yellow-400 transition-colors">
                  Healthcare Access
                </Link>
              </li>
              <li>
                <Link to="/programs/training" className="text-gray-400 hover:text-yellow-400 transition-colors">
                  Skill Development Programs
                </Link>
              </li>
            </ul>
          </div>
          
          {/* Column 4 - Contact */}
          <div>            <h4 className="text-xl font-semibold mb-6 text-yellow-400">Contact Info</h4>
            <ul className="space-y-5 text-gray-400">
              <li className="flex items-start">
                <MapPin className="mr-2 h-5 w-5 text-yellow-400 shrink-0 mt-0.5" />
                <span>
                  Regd Office: Ganga Panama, Pimple Nilakh, Pune 411027
                </span>
              </li>
              <li className="flex items-center">
                <Phone className="mr-2 h-5 w-5 text-yellow-400" />
                <a href="tel:+918888808112" className="hover:text-yellow-400">
                  +91 8888808112
                </a>
              </li>
              <li className="flex items-center">
                <Mail className="mr-2 h-5 w-5 text-yellow-400" />
                <a href="mailto:prachetasfoundation@gmail.com" className="hover:text-yellow-400">
                  prachetasfoundation@gmail.com
                </a>
              </li>
              <li className="flex items-start">
                <span className="text-yellow-400 font-semibold mr-2">Government ID Number:</span>
                <span>MAHA/953/2022</span>
              </li>
            </ul>
          </div>
        </div>
          {/* Bottom Footer */}
        <div className="border-t border-gray-800 pt-8">
          <div className="flex flex-col md:flex-row justify-between items-center">
            <p className="text-gray-500 mb-4 md:mb-0">
              &copy; {new Date().getFullYear()} PRACHETAS Foundation. All rights reserved.
            </p>
            <div className="flex space-x-6 text-sm text-gray-500">
              <Link to="/privacy-policy" className="hover:text-yellow-400 transition-colors">
                Privacy Policy
              </Link>
              <Link to="/terms-of-service" className="hover:text-yellow-400 transition-colors">
                Terms of Service
              </Link>
            </div>
          </div>
        </div>
      </div>
    </footer>
  );
};

export default Footer;
