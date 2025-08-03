
import Header from "../components/Header";
import HeroSection from "../components/HeroSection";
import AboutSection from "../components/AboutSection";
import ImpactSection from "../components/ImpactSection";
import ProgramsSection from "../components/ProgramsSection";
import TestimonialsSection from "../components/TestimonialsSection";
import GallerySection from "../components/GallerySection";
import GetInvolvedSection from "../components/GetInvolvedSection";
import ContactSection from "../components/ContactSection";
import Footer from "../components/Footer";

const Index = () => {
  return (
    <div className="min-h-screen bg-white">
      <Header />
      
      {/* Hero Section - Dark background */}
      <section id="hero" className="section-transition">
        <HeroSection />
      </section>
      
      {/* Section Divider */}
      <div className="section-divider"></div>
      
      {/* About Section - Light background */}
      <section id="about" className="section-white section-transition">
        <AboutSection />
      </section>
      
      {/* Section Divider */}
      <div className="section-divider"></div>
      
      {/* Impact Section - Light gray background */}
      <section id="impact" className="section-light-gray section-transition">
        <ImpactSection />
      </section>
      
      {/* Section Divider */}
      <div className="section-divider"></div>
      
      {/* Programs Section - White background */}
      <section id="programs" className="section-white section-transition">
        <ProgramsSection />
      </section>
      
      {/* Section Divider */}
      <div className="section-divider"></div>
      
      {/* Testimonials Section - Yellow accent background */}
      <section id="testimonials" className="section-yellow-accent section-transition">
        <TestimonialsSection />
      </section>
      
      {/* Section Divider */}
      <div className="section-divider"></div>
      
      {/* Gallery Section - Light gray background */}
      <section id="gallery" className="section-light-gray section-transition">
        <GallerySection />
      </section>
      
      {/* Section Divider */}
      <div className="section-divider"></div>
      
      {/* Get Involved Section - Dark background */}
      <section id="get-involved" className="section-dark section-transition">
        <GetInvolvedSection />
      </section>
      
      {/* Section Divider */}
      <div className="section-divider"></div>
      
      {/* Contact Section - White background */}
      <section id="contact" className="section-white section-transition">
        <ContactSection />
      </section>
      
      <Footer />
    </div>
  );
};

export default Index;
