
import { Button } from "@/components/ui/button";
import { Play, ArrowDown } from "lucide-react";

const HeroSection = () => {
  return (
    <section className="relative bg-gradient-to-br from-green-800 via-green-700 to-green-600 text-white py-20 overflow-hidden min-h-screen">
      {/* Decorative Elements */}
      <div className="absolute top-0 right-0 w-96 h-96 bg-orange-500 opacity-20 rounded-full -translate-y-20 translate-x-20"></div>
      <div className="absolute bottom-0 left-0 w-80 h-80 bg-orange-400 opacity-15 rounded-full translate-y-20 -translate-x-20"></div>
      
      {/* Paint Splash Effect */}
      <div className="absolute top-1/4 right-1/4 w-32 h-32 bg-yellow-400 opacity-30 rounded-full blur-xl"></div>
      <div className="absolute bottom-1/3 left-1/3 w-24 h-24 bg-orange-300 opacity-25 rounded-full blur-lg"></div>

      <div className="container mx-auto px-4 relative z-10 h-full flex items-center">
        <div className="grid md:grid-cols-2 gap-12 items-center w-full">
          <div className="space-y-8">
            <div className="space-y-4">
              <h1 className="text-5xl md:text-6xl font-bold mb-6 leading-tight">
                Let's ensure
                <span className="relative inline-block ml-4">
                  <span className="text-yellow-300">happy</span>
                  <div className="absolute -bottom-2 left-0 w-full h-3 bg-yellow-400 opacity-40 -skew-x-12"></div>
                </span>
              </h1>
              <h2 className="text-3xl md:text-4xl font-bold text-yellow-300 mb-2">
                childhoods
              </h2>
              <h3 className="text-2xl md:text-3xl font-semibold text-green-100 mb-6">
                for every child
              </h3>
            </div>
            
            <p className="text-lg md:text-xl text-green-100 leading-relaxed max-w-xl">
              We believe every child deserves the right to education, healthcare, and protection. 
              Join us in creating lasting change in communities across the globe.
            </p>
            
            <div className="flex flex-col sm:flex-row gap-4 pt-4">
              <Button size="lg" className="bg-yellow-500 hover:bg-yellow-600 text-black font-semibold px-8 py-4 rounded-full text-lg transform hover:scale-105 transition-all duration-200">
                <span className="mr-2">💛</span> Yes! I Want To Help!
              </Button>
              <Button size="lg" variant="outline" className="border-2 border-white text-white hover:bg-white hover:text-green-800 rounded-full px-8 py-4 transform hover:scale-105 transition-all duration-200">
                <Play className="h-5 w-5 mr-2" />
                Watch Our Story
              </Button>
            </div>
          </div>
          
          <div className="relative">
            <div className="relative">
              <img 
                src="https://images.unsplash.com/photo-1488590528505-98d2b5aba04b?ixlib=rb-4.0.3&auto=format&fit=crop&w=800&q=80" 
                alt="Children learning" 
                className="rounded-2xl shadow-2xl w-full h-[400px] md:h-[500px] object-cover"
              />
              {/* Creative overlay */}
              <div className="absolute -top-4 -left-4 w-16 md:w-24 h-16 md:h-24 bg-yellow-400 rounded-full opacity-80"></div>
              <div className="absolute -bottom-4 -right-4 w-24 md:w-32 h-12 md:h-16 bg-orange-500 rounded-full opacity-80"></div>
            </div>
            
            {/* Stats Card - Fixed positioning */}
            <div className="absolute -bottom-6 -left-6 md:-bottom-8 md:-left-8 bg-white text-green-800 p-4 md:p-6 rounded-2xl shadow-2xl border-4 border-yellow-400 max-w-[200px]">
              <div className="text-2xl md:text-3xl font-bold text-orange-600">50,000+</div>
              <div className="text-xs md:text-sm font-semibold">Children Supported</div>
            </div>
          </div>
        </div>
        
        {/* Scroll Indicator - Fixed positioning */}
        <div className="absolute bottom-8 left-1/2 transform -translate-x-1/2 text-center">
          <div className="text-green-200 text-sm mb-2">Scroll For More</div>
          <ArrowDown className="h-6 w-6 text-yellow-400 animate-bounce mx-auto" />
        </div>
      </div>
    </section>
  );
};

export default HeroSection;
