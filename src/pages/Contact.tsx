import { Mail, Phone, MapPin, Clock, Send } from "lucide-react";
import Header from "../components/Header";
import Footer from "../components/Footer";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Textarea } from "@/components/ui/textarea";

const ContactPage = () => {
  const contactInfo = [
    {
      icon: Phone,
      title: "Phone",
      details: [
        "+91 98765 43210",
        "+91 98765 43211"
      ]
    },
    {
      icon: Mail,
      title: "Email",
      details: [
        "prachetasfoundation@gmail.com",
        "info@prachetas.org"
      ]
    },
    {
      icon: MapPin,
      title: "Address",
      details: [
        "123, NGO Complex",
        "Mumbai, Maharashtra - 400001"
      ]
    },
    {
      icon: Clock,
      title: "Office Hours",
      details: [
        "Monday - Friday: 9:00 AM - 6:00 PM",
        "Saturday: 9:00 AM - 2:00 PM"
      ]
    }
  ];

  return (
    <div className="min-h-screen bg-black">
      <Header />
      
      {/* Hero Section */}
      <section className="relative py-20 bg-[#0A0F1A] text-white">
        <div className="container mx-auto px-4">
          <div className="max-w-4xl mx-auto text-center">
            <h1 className="text-4xl md:text-5xl font-bold mb-6">Contact Us</h1>
            <p className="text-xl text-gray-200 mb-8 leading-relaxed">
              We'd love to hear from you. Reach out to us for any queries,
              collaborations, or to learn more about our work.
            </p>
          </div>
        </div>
      </section>

      {/* Contact Information */}
      <section className="py-16 bg-black">
        <div className="container mx-auto px-4">
          <div className="grid md:grid-cols-4 gap-8">
            {contactInfo.map((info, index) => (
              <div key={index} className="bg-[#111827] rounded-xl p-8 transform transition-all duration-300 hover:scale-[1.02]">
                <div className="flex items-center mb-6">
                  <info.icon className="h-8 w-8 text-[#FFD700]" />
                </div>
                <h2 className="text-xl font-bold text-white mb-4">{info.title}</h2>
                {info.details.map((detail, idx) => (
                  <p key={idx} className="text-gray-200">{detail}</p>
                ))}
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* Contact Form */}
      <section className="py-16 bg-[#0A0F1A]">
        <div className="container mx-auto px-4">
          <div className="max-w-2xl mx-auto bg-[#111827] rounded-xl p-8">
            <h2 className="text-2xl font-bold text-white mb-8">Send us a Message</h2>
            <form className="space-y-6">
              <div className="grid md:grid-cols-2 gap-6">
                <div>
                  <label className="block text-sm font-medium text-gray-200 mb-2">
                    Full Name
                  </label>
                  <Input 
                    type="text"
                    className="bg-black border-gray-700 text-white"
                    placeholder="Your name"
                  />
                </div>
                <div>
                  <label className="block text-sm font-medium text-gray-200 mb-2">
                    Email
                  </label>
                  <Input 
                    type="email"
                    className="bg-black border-gray-700 text-white"
                    placeholder="your@email.com"
                  />
                </div>
              </div>
              <div>
                <label className="block text-sm font-medium text-gray-200 mb-2">
                  Subject
                </label>
                <Input 
                  type="text"
                  className="bg-black border-gray-700 text-white"
                  placeholder="How can we help?"
                />
              </div>
              <div>
                <label className="block text-sm font-medium text-gray-200 mb-2">
                  Message
                </label>
                <Textarea 
                  className="bg-black border-gray-700 text-white h-32"
                  placeholder="Your message..."
                />
              </div>
              <Button className="w-full bg-[#FFD700] text-black hover:bg-[#E5C100]">
                <Send className="mr-2 h-5 w-5" />
                Send Message
              </Button>
            </form>
          </div>
        </div>
      </section>

      {/* Map Section */}
      <section className="py-16 bg-black">
        <div className="container mx-auto px-4">
          <div className="aspect-w-16 aspect-h-9 rounded-xl overflow-hidden">
            {/* Replace with actual map implementation */}
            <div className="bg-[#111827] w-full h-[400px] flex items-center justify-center">
              <p className="text-gray-200">Map will be embedded here</p>
            </div>
          </div>
        </div>
      </section>

      <Footer />
    </div>
  );
};

export default ContactPage;
