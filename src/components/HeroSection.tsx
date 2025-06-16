import { Button } from "@/components/ui/button";
import { Link } from "react-router-dom";
import { ArrowRight, Play } from "lucide-react";

const HeroSection = () => {
  return (
    <section className="relative py-20 md:py-32 bg-black text-white overflow-hidden">
      <div className="absolute inset-0 opacity-20">
        <img
          src="/code-bg.jpg"
          className="w-full h-full object-cover"
          alt="Background"
        />
      </div>
      <div className="container mx-auto px-4 relative z-10">
        <div className="grid md:grid-cols-2 gap-8 items-center">
          <div className="max-w-xl">
            <h1 className="text-4xl md:text-6xl font-bold mb-6 leading-tight">
              <span className="text-white">PRACHETAS</span> <br />
              <span className="text-yellow-400">FOUNDATION</span>
            </h1>
            <h2 className="text-2xl md:text-3xl text-yellow-400 font-bold mb-6">
              WHERE COMPASSION MEETS ACTION
            </h2>
            <p className="text-xl text-gray-300 mb-8 leading-relaxed">
              Join us in making a difference
            </p>
            <p className="text-gray-300 mb-8">
              Your support can transform lives. Together, we can create lasting positive change
              and build a world where everyone has access to opportunities and resources.
            </p>
            <div className="flex flex-wrap gap-4">
              <Button asChild size="lg" className="bg-yellow-400 text-black hover:bg-yellow-500">
                <Link to="/donate">Join Our Mission</Link>
              </Button>
              <Button asChild size="lg" variant="outline" className="border-white text-white hover:bg-white hover:text-black">
                <Link to="/about">
                  <Play className="mr-2 h-4 w-4" /> Watch Our Story
                </Link>
              </Button>
            </div>
          </div>
          <div className="relative hidden md:block">
            <div className="relative">
              <img 
                src="/laptop-code.jpg" 
                alt="Computer with code"
                className="rounded-lg shadow-lg" 
              />
              <div className="absolute bottom-4 right-4 bg-yellow-400 text-black px-6 py-4 rounded-lg font-bold text-3xl flex flex-col items-center">
                <span className="text-5xl">50,000+</span>
                <span className="text-sm">Lives Impacted</span>
              </div>
            </div>
          </div>
        </div>
      </div>
    </section>
  );
};

export default HeroSection;
