import { Button } from "@/components/ui/button";
import { Link } from "react-router-dom";
import { ChevronRight } from "lucide-react";

const AboutSection = () => {
  return (
    <section id="about" className="py-16 bg-white">
      <div className="container mx-auto px-4">
        <div className="grid md:grid-cols-2 gap-12 items-center">
          <div>
            <h2 className="text-3xl font-bold mb-6">About Prachetas Foundation</h2>
            <p className="text-gray-700 mb-4">
              Prachetas Foundation is a registered non-profit organization dedicated to 
              empowering communities through compassionate action. We work tirelessly to 
              provide resources, support, and opportunities to those in need.
            </p>
            <p className="text-gray-700 mb-6">
              Our mission is to build stronger communities through collaborative initiatives,
              empowering individuals, and fostering sustainable development worldwide. With
              over 50,000 lives impacted, we continue to expand our reach and deepen our impact.
            </p>
            
            <div className="flex flex-col sm:flex-row gap-4">
              <Button asChild variant="outline" className="border-yellow-400 text-yellow-400 hover:bg-yellow-400 hover:text-black">
                <Link to="/about">
                  Learn More <ChevronRight className="ml-1 h-4 w-4" />
                </Link>
              </Button>
              <Button asChild variant="outline" className="border-yellow-400 text-yellow-400 hover:bg-yellow-400 hover:text-black">
                <Link to="/team">
                  Meet Our Team <ChevronRight className="ml-1 h-4 w-4" />
                </Link>
              </Button>
            </div>
          </div>
            <div className="relative">
            <div className="bg-yellow-100 absolute -top-4 -left-4 w-full h-full rounded-lg"></div>
            <img 
              src="/laptop-code.jpg" 
              alt="Our team at work"
              className="relative z-10 rounded-lg shadow-lg w-full" 
            />
          </div>
        </div>
      </div>
    </section>
  );
};

export default AboutSection;
