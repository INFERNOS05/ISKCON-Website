import { Button } from "@/components/ui/button";
import { Link } from "react-router-dom";
import { ArrowRight, Play, X } from "lucide-react";
import { useState, useEffect } from "react";

const HeroSection = () => {
  const [isVideoOpen, setIsVideoOpen] = useState(false);

  const openVideo = () => setIsVideoOpen(true);
  const closeVideo = () => setIsVideoOpen(false);

  // Handle escape key press
  useEffect(() => {
    const handleEscape = (e: KeyboardEvent) => {
      if (e.key === 'Escape' && isVideoOpen) {
        closeVideo();
      }
    };

    if (isVideoOpen) {
      document.addEventListener('keydown', handleEscape);
      // Prevent body scroll when modal is open
      document.body.style.overflow = 'hidden';
    }

    return () => {
      document.removeEventListener('keydown', handleEscape);
      document.body.style.overflow = 'unset';
    };
  }, [isVideoOpen]);
  return (
    <section className="relative py-24 md:py-36 bg-black text-white overflow-hidden">
      {/* Background image - PRACHETAS logo */}
      <div className="absolute inset-0">
        <img
          src="/prachetas-hero-bg.png"
          className="w-full h-full object-contain opacity-30"
          alt="PRACHETAS Foundation - Upscaling the World"
        />
      </div>
      
      {/* Gradient overlay for better text readability */}
      <div className="absolute inset-0 bg-gradient-to-r from-black/60 via-black/40 to-black/60 z-10"></div>

      {/* Content */}
      <div className="container mx-auto px-4 relative z-20">
        <div className="max-w-4xl mx-auto text-center">
          <h1 className="text-5xl md:text-7xl font-bold mb-6 leading-tight">
            <span className="text-white">PRACHETAS</span> <br />
            <span className="text-prachetas-yellow">FOUNDATION</span>
          </h1>
          <h2 className="text-2xl md:text-4xl text-prachetas-yellow font-bold mb-8 tracking-wide">
            UPSCALING THE WORLD
          </h2>
          <p className="text-xl md:text-2xl text-white mb-6 leading-relaxed font-medium italic">
            Where Compassion Meets Action
          </p>
          <p className="text-gray-100 mb-8 text-lg leading-relaxed max-w-3xl mx-auto">
            Welcome to <span className="text-white font-semibold">Prachetas Foundation</span> — a charitable trust committed to uplifting lives through food security, value-based education, and holistic wellness. Founded by professionals from the IT, business, and academic world, we believe true service lies in <span className="text-prachetas-yellow font-medium">empowering people to rise with dignity, purpose, and community support.</span>
          </p>
          <blockquote className="border-l-4 border-prachetas-yellow pl-6 mb-8 max-w-2xl mx-auto">
            <p className="text-xl md:text-2xl text-white italic font-medium">
              "Together, let's create a society that thrives on compassion, wisdom, and action."
            </p>
          </blockquote>
          
          {/* Call to action buttons */}
          <div className="flex flex-wrap gap-6 justify-center mb-8">
            <Button asChild size="lg" 
              className="bg-prachetas-yellow text-black hover:bg-yellow-300 transition-colors px-8 py-6 text-lg font-semibold">
              <Link to="/get-involved">
                Join Our Mission <ArrowRight className="ml-2 h-5 w-5" />
              </Link>
            </Button>
            <Button 
              onClick={openVideo}
              size="lg" 
              variant="outline" 
              className="border-2 border-prachetas-yellow text-prachetas-yellow hover:bg-prachetas-yellow hover:text-black transition-colors px-8 py-6 text-lg font-semibold">
              <Play className="mr-2 h-5 w-5" /> Watch Our Story
            </Button>
          </div>
          
          {/* Impact statistics */}
          <div className="grid grid-cols-1 md:grid-cols-3 gap-8 max-w-3xl mx-auto">
            <div className="bg-black/50 backdrop-blur-sm border border-prachetas-yellow/30 px-6 py-4 rounded-lg">
              <div className="text-3xl md:text-4xl font-bold text-prachetas-yellow">50K+</div>
              <div className="text-sm uppercase tracking-wider text-white">Lives Impacted</div>
            </div>
            <div className="bg-black/50 backdrop-blur-sm border border-prachetas-yellow/30 px-6 py-4 rounded-lg">
              <div className="text-3xl md:text-4xl font-bold text-prachetas-yellow">100+</div>
              <div className="text-sm uppercase tracking-wider text-white">Active Volunteers</div>
            </div>
            <div className="bg-black/50 backdrop-blur-sm border border-prachetas-yellow/30 px-6 py-4 rounded-lg">
              <div className="text-3xl md:text-4xl font-bold text-prachetas-yellow">25+</div>
              <div className="text-sm uppercase tracking-wider text-white">Programs Running</div>
            </div>
          </div>
        </div>
      </div>

      {/* Video Modal */}
      {isVideoOpen && (
        <div className="fixed inset-0 bg-black/90 z-50 flex items-center justify-center p-4">
          <div className="relative w-full max-w-4xl aspect-video bg-black rounded-lg overflow-hidden">
            {/* Close button */}
            <button
              onClick={closeVideo}
              className="absolute top-4 right-4 z-60 bg-black/50 hover:bg-black/70 text-white rounded-full p-2 transition-colors"
              aria-label="Close video"
            >
              <X className="h-6 w-6" />
            </button>
            
            {/* Video */}
            <video
              src="/prachetas_intro.mp4"
              controls
              autoPlay
              className="w-full h-full object-contain"
              onEnded={closeVideo}
            >
              <track kind="captions" src="" label="English" default />
              Your browser does not support the video tag.
            </video>
          </div>
          
          {/* Click outside to close */}
          <button 
            className="absolute inset-0 -z-10 w-full h-full bg-transparent cursor-pointer" 
            onClick={closeVideo}
            onKeyDown={(e) => e.key === 'Escape' && closeVideo()}
            aria-label="Close video modal"
            tabIndex={-1}
          />
        </div>
      )}
    </section>
  );
};

export default HeroSection;
