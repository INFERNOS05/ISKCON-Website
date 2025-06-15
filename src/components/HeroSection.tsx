
import { Button } from "@/components/ui/button";
import { Play } from "lucide-react";

const HeroSection = () => {
  return (
    <section className="relative bg-gradient-to-r from-green-800 to-green-600 text-white py-20">
      <div className="container mx-auto px-4">
        <div className="grid md:grid-cols-2 gap-12 items-center">
          <div>
            <h1 className="text-5xl font-bold mb-6 leading-tight">
              Building a Better Future for Every Child
            </h1>
            <p className="text-xl mb-8 text-green-100">
              We believe every child deserves the right to education, healthcare, and protection. 
              Join us in creating lasting change in communities across the globe.
            </p>
            <div className="flex flex-col sm:flex-row gap-4">
              <Button size="lg" className="bg-orange-500 hover:bg-orange-600 text-white">
                Support Our Mission
              </Button>
              <Button size="lg" variant="outline" className="border-white text-white hover:bg-white hover:text-green-800">
                <Play className="h-5 w-5 mr-2" />
                Watch Our Story
              </Button>
            </div>
          </div>
          <div className="relative">
            <img 
              src="https://images.unsplash.com/photo-1488590528505-98d2b5aba04b?ixlib=rb-4.0.3&auto=format&fit=crop&w=800&q=80" 
              alt="Children learning" 
              className="rounded-lg shadow-2xl"
            />
            <div className="absolute -bottom-6 -left-6 bg-orange-500 text-white p-4 rounded-lg shadow-lg">
              <div className="text-2xl font-bold">50,000+</div>
              <div className="text-sm">Children Supported</div>
            </div>
          </div>
        </div>
      </div>
    </section>
  );
};

export default HeroSection;
