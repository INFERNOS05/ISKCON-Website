
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
      <section id="hero">
        <HeroSection />
      </section>
      <section id="about">
        <AboutSection />
      </section>
      <section id="impact">
        <ImpactSection />
      </section>
      <section id="programs">
        <ProgramsSection />
      </section>
      <section id="testimonials">
        <TestimonialsSection />
      </section>
      <section id="gallery">
        <GallerySection />
      </section>
      <section id="get-involved">
        <GetInvolvedSection />
      </section>
      <section id="contact">
        <ContactSection />
      </section>
      <Footer />
    </div>
  );
};

export default Index;
