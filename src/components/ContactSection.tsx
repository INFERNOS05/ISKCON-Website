import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { MapPin, Phone, Mail, Send } from "lucide-react";

const ContactSection = () => {
  return (
    <section className="py-16 bg-gray-50">
      <div className="container mx-auto px-4">
        <div className="max-w-3xl mx-auto text-center mb-12">
          <h2 className="text-3xl font-bold mb-4">Stay Connected</h2>
          <p className="text-gray-600">
            Get in touch with us to learn more about our initiatives or how you can contribute
          </p>
        </div>

        <div className="grid md:grid-cols-2 gap-12">
          {/* Contact Information */}
          <div className="bg-white rounded-lg p-8 shadow-md">
            <h3 className="text-xl font-bold mb-6">Contact Information</h3>
            
            <div className="space-y-6">
              <div className="flex items-start">
                <MapPin className="mr-4 h-6 w-6 text-yellow-400 shrink-0 mt-1" />
                <div>
                  <h4 className="font-semibold mb-1">Main Office</h4>
                  <p className="text-gray-600">Regd Office: Ganga Panama, Pimple Nilakh, Pune 411027</p>
                </div>
              </div>
              
              <div className="flex items-start">
                <Phone className="mr-4 h-6 w-6 text-yellow-400 shrink-0 mt-1" />
                <div>
                  <h4 className="font-semibold mb-1">Phone Number</h4>
                  <p className="text-gray-600">+91 8888808112</p>
                </div>
              </div>
              
              <div className="flex items-start">
                <Mail className="mr-4 h-6 w-6 text-yellow-400 shrink-0 mt-1" />
                <div>
                  <h4 className="font-semibold mb-1">Email Address</h4>
                  <p className="text-gray-600">prachetasfoundation@gmail.com</p>
                </div>
              </div>
            </div>
          </div>
          
          {/* Newsletter Subscription */}
          <div className="bg-black rounded-lg p-8 shadow-md text-white">
            <h3 className="text-xl font-bold mb-6 text-yellow-400">Stay Updated</h3>
            <p className="text-gray-300 mb-6">
              Subscribe to our newsletter for the latest updates on our projects, events, and success stories.
            </p>
            
            <div className="flex space-x-2">
              <Input 
                type="email" 
                placeholder="Your email address" 
                className="bg-gray-800 border-gray-700 text-white placeholder:text-gray-500 focus-visible:ring-yellow-400"
              />
              <Button className="bg-yellow-400 hover:bg-yellow-500 text-black">
                <Send className="h-4 w-4 mr-2" /> Subscribe
              </Button>
            </div>
            
            <p className="text-gray-400 text-sm mt-4">
              By subscribing, you agree to our Privacy Policy and consent to receive updates from Prachetas Foundation.
            </p>
          </div>
        </div>
      </div>
    </section>
  );
};

export default ContactSection;
