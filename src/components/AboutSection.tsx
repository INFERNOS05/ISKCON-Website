import { Button } from "@/components/ui/button";
import { Link } from "react-router-dom";
import { ChevronRight } from "lucide-react";

const AboutSection = () => {
  return (
    <section id="about" className="py-16 bg-[#F5F1E8]">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="grid grid-cols-1 md:grid-cols-2 gap-12 items-center">
          <div className="max-w-xl space-y-6">
            <h2 className="text-4xl font-bold mb-6 text-[#2C5530]">About Prachetas Foundation</h2>
            <p className="text-[#333333] text-lg mb-4 leading-relaxed">
              Prachetas Foundation is a registered non-profit organization dedicated to 
              empowering communities through compassionate action. We work tirelessly to 
              provide resources, support, and opportunities to those in need.
            </p>
            <p className="text-[#333333] text-lg mb-6 leading-relaxed">
              Our mission is to build stronger communities through collaborative initiatives,
              empowering individuals, and fostering sustainable development worldwide. With
              over 50,000 lives impacted, we continue to expand our reach and deepen our impact.
            </p>
            
            <div className="flex flex-col sm:flex-row gap-4">
              <Button asChild variant="outline" 
                className="border-2 border-[#D86C1F] text-[#D86C1F] hover:bg-[#D86C1F] hover:text-white transition-colors font-semibold px-6 py-3">
                <Link to="/about">
                  Learn More <ChevronRight className="ml-1 h-5 w-5" />
                </Link>
              </Button>
              <Button asChild
                className="bg-[#2C5530] text-white hover:bg-[#1F3D23] transition-colors font-semibold px-6 py-3">
                <Link to="/team">
                  Meet Our Team <ChevronRight className="ml-1 h-5 w-5" />
                </Link>
              </Button>
            </div>
          </div>
          
          <div className="relative">
            <div className="bg-[#D86C1F]/10 absolute -top-4 -left-4 w-full h-full rounded-lg"></div>
            <img 
              src="/laptop-code.jpg" 
              alt="Our team at work"
              loading="eager"
              width={600}
              height={400}
              className="relative z-10 rounded-lg shadow-lg w-full h-full object-cover" 
            />
          </div>
        </div>
      </div>
    </section>
  );
};

export default AboutSection;
