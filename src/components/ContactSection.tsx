import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { MapPin, Phone, Mail, Send, MessageCircle, Share2, Hash } from "lucide-react";

const ContactSection = () => {
  return (
    <section className="py-16 bg-gray-100">
      <div className="container mx-auto px-4">
        <div className="max-w-3xl mx-auto text-center mb-12">
          <h2 className="text-4xl font-bold mb-4 text-prachetas-black">Stay Connected</h2>
          <p className="text-prachetas-medium-gray text-lg">
            Get in touch with us to learn more about our initiatives or how you can contribute
          </p>
        </div>

        <div className="grid md:grid-cols-2 gap-12">
          {/* Contact Information */}
          <div className="bg-white rounded-lg p-8 shadow-lg border-2 border-gray-200">
            <h3 className="text-2xl font-bold mb-6 text-prachetas-black">Contact Information</h3>
            
            <div className="space-y-6">
              <div className="flex items-start">
                <MapPin className="mr-4 h-6 w-6 text-prachetas-yellow shrink-0 mt-1" />
                <div>
                  <h4 className="font-semibold mb-1 text-prachetas-black">Main Office</h4>
                  <p className="text-prachetas-medium-gray">HQPJ+97R, Vishal Nagar, Pimple Nilakh, Pimpri-Chinchwad, Maharashtra 411027</p>
                </div>
              </div>
              
              <div className="flex items-start">
                <Phone className="mr-4 h-6 w-6 text-prachetas-yellow shrink-0 mt-1" />
                <div>
                  <h4 className="font-semibold mb-1 text-prachetas-black">Phone Number</h4>
                  <p className="text-prachetas-medium-gray">+91 8888808112</p>
                </div>
              </div>
              
              <div className="flex items-start">
                <Mail className="mr-4 h-6 w-6 text-prachetas-yellow shrink-0 mt-1" />
                <div>
                  <h4 className="font-semibold mb-1 text-prachetas-black">Email Address</h4>
                  <p className="text-prachetas-medium-gray">prachetasfoundation@gmail.com</p>
                </div>
              </div>
              
              {/* Divider */}
              <div className="border-t border-gray-200 pt-6">
                {/* Social Media Handles */}
                <div>
                  <h4 className="font-semibold mb-4 text-prachetas-black flex items-center">
                    <Share2 className="mr-2 h-5 w-5 text-prachetas-yellow" />
                    Follow Us
                  </h4>
                  <div className="grid grid-cols-1 gap-3">
                    <a href="https://instagram.com/prachetasfoundation" target="_blank" rel="noopener noreferrer" 
                       className="flex items-center space-x-3 p-3 bg-gray-50 rounded-lg hover:bg-prachetas-yellow/10 transition-colors border border-gray-200">
                      <img src="/Instagram_logo_2016.svg" alt="Instagram" className="h-5 w-5" />
                      <div className="flex-1">
                        <span className="text-prachetas-medium-gray font-medium">@prachetasfoundation</span>
                        <span className="text-xs text-gray-500 ml-2">Instagram</span>
                      </div>
                    </a>
                    <a href="https://snapchat.com/add/prachetasorg" target="_blank" rel="noopener noreferrer"
                       className="flex items-center space-x-3 p-3 bg-gray-50 rounded-lg hover:bg-prachetas-yellow/10 transition-colors border border-gray-200">
                      <img src="/snapchat-logo-svgrepo-com.svg" alt="Snapchat" className="h-5 w-5" />
                      <div className="flex-1">
                        <span className="text-prachetas-medium-gray font-medium">@prachetasorg</span>
                        <span className="text-xs text-gray-500 ml-2">Snapchat</span>
                      </div>
                    </a>
                    <a href="https://twitter.com/PrachetasFoundation" target="_blank" rel="noopener noreferrer"
                       className="flex items-center space-x-3 p-3 bg-gray-50 rounded-lg hover:bg-prachetas-yellow/10 transition-colors border border-gray-200">
                      <img src="/X_logo_2023_original.svg" alt="X (Twitter)" className="h-5 w-5" />
                      <div className="flex-1">
                        <span className="text-prachetas-medium-gray font-medium">@PrachetasFoundation</span>
                        <span className="text-xs text-gray-500 ml-2">X (Twitter)</span>
                      </div>
                    </a>
                  </div>
                </div>
              </div>
            </div>
          </div>
          
          {/* Newsletter Subscription */}
          <div className="bg-prachetas-black rounded-lg p-8 shadow-lg border-2 border-prachetas-yellow text-white">
            <h3 className="text-2xl font-bold mb-6 text-prachetas-yellow">Stay Updated</h3>
            <p className="mb-6 text-gray-300">Subscribe to our newsletter to receive updates about our work and upcoming events.</p>
            
            <form className="space-y-4">
              <Input 
                type="email" 
                placeholder="Enter your email" 
                className="bg-white text-prachetas-medium-gray placeholder:text-gray-500 border-gray-300"
              />
              <Button className="w-full bg-prachetas-yellow hover:bg-prachetas-bright-yellow text-prachetas-black transition-colors font-semibold">
                Subscribe <Send className="ml-2 h-4 w-4" />
              </Button>
            </form>
          </div>
        </div>
      </div>
    </section>
  );
};

export default ContactSection;
