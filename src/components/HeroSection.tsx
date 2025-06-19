import { Button } from "@/components/ui/button";
import { Link } from "react-router-dom";
import { ArrowRight, Play } from "lucide-react";

const HeroSection = () => {
  return (    <section className="relative py-24 md:py-36 bg-black text-white overflow-hidden">
      {/* Semi-transparent overlay */}
      <div className="absolute inset-0 bg-gradient-to-r from-black/90 to-black/70 z-10"></div>
      
      {/* Background image */}
      <div className="absolute inset-0">
        <img
          src="/code-bg.jpg"
          className="w-full h-full object-cover opacity-60"
          alt="Background"
        />
      </div>

      {/* Content */}
      <div className="container mx-auto px-4 relative z-20">
        <div className="grid md:grid-cols-2 gap-8 items-center">
          <div className="max-w-xl">
            <h1 className="text-4xl md:text-6xl font-bold mb-6 leading-tight">
              <span className="text-white">PRACHETAS</span> <br />
              <span className="text-[#FFD700]">FOUNDATION</span>
            </h1>
            <h2 className="text-2xl md:text-3xl text-white font-bold mb-6 tracking-wide">
              WHERE COMPASSION MEETS ACTION
            </h2>            <p className="text-xl text-[#FFD700] mb-6 leading-relaxed font-medium italic">
              Where Compassion Meets Action
            </p>
            <p className="text-gray-100 mb-6 text-lg leading-relaxed">
              Welcome to <span className="text-white font-semibold">Prachetas Foundation</span> — a charitable trust committed to uplifting lives through food security, value-based education, and holistic wellness. Founded by professionals from the IT, business, and academic world, we believe true service lies in <span className="text-[#FFD700] font-medium">empowering people to rise with dignity, purpose, and community support.</span>
            </p>
            <blockquote className="border-l-4 border-[#FFD700] pl-4 mb-8">
              <p className="text-xl text-white italic font-medium">
                "Together, let's create a society that thrives on compassion, wisdom, and action."
              </p>
            </blockquote>
            <div className="flex flex-wrap gap-4">
              <Button asChild size="lg" 
                className="bg-[#D86C1F] text-white hover:bg-[#C35A15] transition-colors px-8 py-6 text-lg font-semibold">
                <Link to="/donate">Join Our Mission</Link>
              </Button>
              <Button asChild size="lg" variant="outline" 
                className="border-2 border-white text-white hover:bg-white/10 transition-colors px-8 py-6 text-lg font-semibold">
                <Link to="/about">
                  <Play className="mr-2 h-5 w-5" /> Watch Our Story
                </Link>
              </Button>
            </div>
          </div>
          <div className="relative hidden md:block">
            <div className="relative">
              <img 
                src="/laptop-code.jpg" 
                alt="Our impact in action"
                className="rounded-lg shadow-xl" 
              />
              <div className="absolute bottom-4 right-4 bg-[#D86C1F] text-white px-6 py-4 rounded-lg font-bold text-3xl flex flex-col items-center shadow-lg">
                <span className="text-4xl">50K+</span>
                <span className="text-sm uppercase tracking-wider">Lives Impacted</span>
              </div>
            </div>
          </div>
        </div>
      </div>
    </section>
  );
};

export default HeroSection;
