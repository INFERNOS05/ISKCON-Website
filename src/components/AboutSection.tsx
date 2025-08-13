import { Button } from "@/components/ui/button";
import { Link } from "react-router-dom";
import { ChevronRight } from "lucide-react";

const AboutSection = () => {
  return (
    <section className="py-16 bg-white" id="about">
      <div className="container mx-auto px-4">
        <div className="max-w-6xl mx-auto">
          <div className="text-center mb-12">
            <h2 className="text-4xl font-bold mb-4 text-prachetas-black">About PRACHETAS</h2>
            <p className="text-prachetas-medium-gray text-lg max-w-3xl mx-auto leading-relaxed">
              Dedicated to creating positive change through education, healthcare, and community development initiatives
            </p>
          </div>
          <div className="grid md:grid-cols-2 gap-12 items-center">
            <div>
              <div className="bg-prachetas-black p-8 rounded-lg mb-6">
                <h3 className="text-2xl font-bold text-prachetas-yellow mb-4">Our Mission</h3>
                <p className="text-gray-300 leading-relaxed">
                  Our mission is to empower communities through a holistic approach that combines sustainable development, quality education, and accessible healthcare. We are dedicated to creating lasting opportunities for growth, fostering resilience, and facilitating positive transformation for both individuals and society as a whole.
                </p>
              </div>
            
              <div className="flex flex-col sm:flex-row gap-4">
                <Button asChild variant="outline" 
                  className="border-2 border-prachetas-yellow text-prachetas-yellow hover:bg-prachetas-yellow hover:text-prachetas-black transition-colors font-semibold px-6 py-3">
                  <Link to="/about">
                    Learn More <ChevronRight className="ml-1 h-5 w-5" />
                  </Link>
                </Button>
                <Button asChild
                  className="bg-prachetas-black text-prachetas-yellow hover:bg-prachetas-dark-gray transition-colors font-semibold px-6 py-3">
                  <Link to="/about#team">
                    Meet Our Team <ChevronRight className="ml-1 h-5 w-5" />
                  </Link>
                </Button>
              </div>
            </div>
          
            <div className="relative">
              <img 
                src="/Copy of WhatsApp Image 2025-02-26 at 15.41.35 (1).jpeg" 
                alt="PRACHETAS Foundation community work"
                loading="eager"
                width={600}
                height={400}
                className="rounded-lg shadow-lg w-full h-full object-cover border-4 border-prachetas-yellow" 
              />
            </div>
          </div>
        </div>
      </div>
    </section>
  );
};

export default AboutSection;
