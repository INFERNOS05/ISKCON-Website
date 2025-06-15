
import { Button } from "@/components/ui/button";
import { Play } from "lucide-react";

const HeroSection = () => {return (
      <section className="relative bg-black text-white pb-0 overflow-hidden min-h-screen flex items-center">
        {/* Yellow Banner at bottom only */}
        <div className="absolute bottom-0 left-0 w-full h-8 bg-amber-400"></div>
          {/* No background decorative elements - clean design */}
      
      {/* Main content container */}
      <div className="container mx-auto px-4 relative z-10 flex flex-col h-full">
        <div className="grid md:grid-cols-2 gap-8 lg:gap-16 items-center w-full">
          {/* Left content column */}          <div className="space-y-8">
            <div className="space-y-4">
              <h1 className="text-5xl md:text-6xl font-bold leading-tight">
                PRACHETAS <span className="text-amber-400">FOUNDATION</span>
              </h1>
              <h2 className="text-3xl md:text-4xl font-bold text-amber-400 mt-2">
                WHERE COMPASSION MEETS ACTION
              </h2>
              <h3 className="text-xl md:text-2xl font-medium text-white mt-4">
                Join us in making a difference
              </h3>
            </div>
            <p className="text-lg leading-relaxed max-w-xl">
              Your support can transform lives. Together, we can create lasting positive change and build 
              a world where everyone has access to opportunities and resources.
            </p>
            <div className="flex flex-col sm:flex-row gap-4 pt-4">
              <Button size="lg" className="bg-amber-400 hover:bg-amber-500 text-black font-bold px-8 py-3 rounded-none text-lg">
                Join Our Mission
              </Button>              
              <Button size="lg" className="bg-transparent border-2 border-amber-400 text-white hover:bg-amber-400/10 rounded-none px-8 py-3 flex items-center">
                <Play className="h-5 w-5 mr-2" fill="currentColor" />
                Watch Our Story
              </Button>
            </div>
          </div>
            {/* Right column with laptop/code image */}          <div className="relative mt-8 md:mt-0">
            <div className="relative">              <img 
                src="/macbook-code.jpg" 
                alt="Macbook with code" 
                className="w-full h-[400px] md:h-[500px] object-cover"
                onError={(e) => {
                  e.currentTarget.src = "https://images.unsplash.com/photo-1498050108023-c5249f4df085?ixlib=rb-4.0.3&ixid=M3wxMjA3fDB8MHxwaG90by1wYWdlfHx8fGVufDB8fHx8fA%3D%3D&auto=format&fit=crop&w=1172&q=80";
                  e.currentTarget.onerror = null;
                }}
              />
            </div>
            
            {/* Stats Card */}
            <div className="absolute bottom-12 right-4 md:right-8 bg-white p-5 rounded-md shadow-lg border-2 border-amber-400">
              <div className="flex flex-col items-center">
                <div className="text-4xl md:text-5xl font-bold text-amber-400">50,000+</div>
                <div className="text-sm md:text-base font-medium text-black">Lives Impacted</div>
              </div>            </div>
          </div>
        </div>
      </div>
    </section>
  );
};

export default HeroSection;
