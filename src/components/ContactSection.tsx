import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { MapPin, Phone, Mail, Send } from "lucide-react";

const ContactSection = () => {
  return (
    <section className="py-16 bg-[#F5F1E8]">
      <div className="container mx-auto px-4">
        <div className="max-w-3xl mx-auto text-center mb-12">
          <h2 className="text-4xl font-bold mb-4 text-[#2C5530]">Stay Connected</h2>
          <p className="text-[#333333] text-lg">
            Get in touch with us to learn more about our initiatives or how you can contribute
          </p>
        </div>

        <div className="grid md:grid-cols-2 gap-12">
          {/* Contact Information */}
          <div className="bg-white rounded-lg p-8 shadow-md">
            <h3 className="text-2xl font-bold mb-6 text-[#2C5530]">Contact Information</h3>
            
            <div className="space-y-6">
              <div className="flex items-start">
                <MapPin className="mr-4 h-6 w-6 text-[#D86C1F] shrink-0 mt-1" />
                <div>
                  <h4 className="font-semibold mb-1 text-[#2C5530]">Main Office</h4>
                  <p className="text-[#333333]">Regd Office: Ganga Panama, Pimple Nilakh, Pune 411027</p>
                </div>
              </div>
              
              <div className="flex items-start">
                <Phone className="mr-4 h-6 w-6 text-[#D86C1F] shrink-0 mt-1" />
                <div>
                  <h4 className="font-semibold mb-1 text-[#2C5530]">Phone Number</h4>
                  <p className="text-[#333333]">+91 8888808112</p>
                </div>
              </div>
              
              <div className="flex items-start">
                <Mail className="mr-4 h-6 w-6 text-[#D86C1F] shrink-0 mt-1" />
                <div>
                  <h4 className="font-semibold mb-1 text-[#2C5530]">Email Address</h4>
                  <p className="text-[#333333]">prachetasfoundation@gmail.com</p>
                </div>
              </div>
            </div>
          </div>
          
          {/* Newsletter Subscription */}
          <div className="bg-[#2C5530] rounded-lg p-8 shadow-md text-white">
            <h3 className="text-2xl font-bold mb-6 text-white">Stay Updated</h3>
            <p className="mb-6 text-gray-100">Subscribe to our newsletter to receive updates about our work and upcoming events.</p>
            
            <form className="space-y-4">
              <Input 
                type="email" 
                placeholder="Enter your email" 
                className="bg-white text-[#333333] placeholder:text-gray-500"
              />
              <Button className="w-full bg-[#D86C1F] hover:bg-[#C35A15] text-white transition-colors">
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
