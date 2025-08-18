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
        "HQPJ+97R, Vishal Nagar, Pimple Nilakh",
        "Pimpri-Chinchwad, Maharashtra 411027"
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
    <div className="min-h-screen bg-gray-50">
      <Header />
      
      {/* Hero Section */}
      <section className="relative py-20 bg-prachetas-black text-white">
        <div className="container mx-auto px-4">
          <div className="max-w-4xl mx-auto text-center">
            <h1 className="text-4xl md:text-5xl font-bold mb-6 text-prachetas-yellow">Contact Us</h1>
            <p className="text-xl text-gray-300 mb-8 leading-relaxed">
              We'd love to hear from you. Reach out to us for any queries,
              collaborations, or to learn more about our work.
            </p>
          </div>
        </div>
      </section>

      {/* Contact Information */}
      <section className="py-16 bg-white">
        <div className="container mx-auto px-4">
          <div className="grid md:grid-cols-4 gap-8">
            {contactInfo.map((info, index) => (
              <div key={index} className="bg-white rounded-xl p-8 shadow-lg border-2 border-gray-200 transform transition-all duration-300 hover:scale-[1.02]">
                <div className="flex items-center mb-6">
                  <info.icon className="h-8 w-8 text-prachetas-yellow" />
                </div>
                <h2 className="text-xl font-bold text-prachetas-black mb-4">{info.title}</h2>
                {info.details.map((detail, idx) => (
                  <p key={idx} className="text-prachetas-medium-gray">{detail}</p>
                ))}
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* Contact Form */}
      <section className="py-16 bg-gray-100">
        <div className="container mx-auto px-4">
          <div className="max-w-2xl mx-auto bg-prachetas-black rounded-xl p-8 shadow-lg">
            <h2 className="text-2xl font-bold text-prachetas-yellow mb-8">Send us a Message</h2>
            <form className="space-y-6">
              <div className="grid md:grid-cols-2 gap-6">
                <div>
                  <label htmlFor="contact-name" className="block text-sm font-medium text-gray-300 mb-2">
                    Full Name
                  </label>
                  <Input 
                    id="contact-name"
                    type="text"
                    className="bg-white text-prachetas-black border-gray-300"
                    placeholder="Your name"
                  />
                </div>
                <div>
                  <label htmlFor="contact-email" className="block text-sm font-medium text-gray-300 mb-2">
                    Email
                  </label>
                  <Input 
                    id="contact-email"
                    type="email"
                    className="bg-white text-prachetas-black border-gray-300"
                    placeholder="your@email.com"
                  />
                </div>
              </div>
              <div>
                <label htmlFor="contact-subject" className="block text-sm font-medium text-gray-300 mb-2">
                  Subject
                </label>
                <Input 
                  id="contact-subject"
                  type="text"
                  className="bg-white text-prachetas-black border-gray-300"
                  placeholder="How can we help?"
                />
              </div>
              <div>
                <label htmlFor="contact-message" className="block text-sm font-medium text-gray-300 mb-2">
                  Message
                </label>
                <Textarea 
                  id="contact-message"
                  className="bg-white text-prachetas-black border-gray-300 h-32"
                  placeholder="Your message..."
                />
              </div>
              <Button className="w-full bg-prachetas-yellow text-prachetas-black hover:bg-prachetas-bright-yellow transition-colors font-semibold">
                <Send className="mr-2 h-5 w-5" />
                Send Message
              </Button>
            </form>
          </div>
        </div>
      </section>

      {/* Map Section */}
            {/* Map Section */}
      <section className="py-16 bg-white">
        <div className="container mx-auto px-4">
          <div className="text-center mb-12">
            <h2 className="text-3xl font-bold text-prachetas-black">Find Us Here</h2>
            <p className="text-prachetas-medium-gray mt-2">Our main office is located in Pune. We welcome you to visit us.</p>
          </div>
          <div className="h-[600px] rounded-xl overflow-hidden shadow-lg border-2 border-gray-200">
            <iframe
              src="https://www.google.com/maps/embed?pb=!1m18!1m12!1m3!1d3781.8393601194985!2d73.79251147599615!3d18.580284882525492!2m3!1f0!2f0!3f0!3m2!1i1024!2i768!4f13.1!3m3!1m2!1s0x3bc2b906c4b4b4b1%3A0x1234567890abcdef!2sHQPJ%2B97R%2C%20Vishal%20Nagar%2C%20Pimple%20Nilakh%2C%20Pimpri-Chinchwad%2C%20Maharashtra%20411027!5e0!3m2!1sen!2sin!4v1691123456789!5m2!1sen!2sin"
              width="100%"
              height="100%"
              style={{ border: 0 }}
              allowFullScreen={true}
              loading="lazy"
              referrerPolicy="no-referrer-when-downgrade"
              title="PRACHETAS Foundation Location - HQPJ+97R, Vishal Nagar, Pimple Nilakh"
            ></iframe>
          </div>
        </div>
      </section>

      <Footer />
    </div>
  );
};

export default ContactPage;
