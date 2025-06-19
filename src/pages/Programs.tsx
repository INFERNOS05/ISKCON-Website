import { BookOpen, Users, Heart, Brain, GraduationCap, Sprout } from "lucide-react";
import Header from "../components/Header";
import Footer from "../components/Footer";
import { Button } from "@/components/ui/button";
import { Link } from "react-router-dom";

const ProgramsPage = () => {
  const programs = [
    {
      title: "Education Empowerment",
      icon: GraduationCap,
      description: "Providing quality education and learning resources to underprivileged children.",
      benefits: [
        "Free education for underprivileged children",
        "Digital literacy programs",
        "Vocational training for youth",
        "Scholarships for higher education"
      ]
    },
    {
      title: "Community Health",
      icon: Heart,
      description: "Promoting health awareness and providing medical support to communities.",
      benefits: [
        "Regular health checkup camps",
        "Nutrition programs for children",
        "Mental health awareness",
        "Preventive healthcare education"
      ]
    },
    {
      title: "Skill Development",
      icon: Brain,
      description: "Empowering youth with skills for better employment opportunities.",
      benefits: [
        "Technical skills training",
        "Soft skills development",
        "Career counseling",
        "Job placement support"
      ]
    },
    {
      title: "Rural Development",
      icon: Sprout,
      description: "Supporting rural communities with sustainable development initiatives.",
      benefits: [
        "Agricultural support",
        "Water conservation projects",
        "Sustainable living practices",
        "Community infrastructure"
      ]
    }
  ];

  return (
    <div className="min-h-screen bg-black">
      <Header />
      
      {/* Hero Section */}
      <section className="relative py-20 bg-[#0A0F1A] text-white">
        <div className="container mx-auto px-4">
          <div className="max-w-4xl mx-auto text-center">
            <h1 className="text-4xl md:text-5xl font-bold mb-6">Our Programs</h1>
            <p className="text-xl text-gray-200 mb-8 leading-relaxed">
              Through our diverse range of programs, we aim to create lasting positive change
              in communities and empower individuals to build better futures.
            </p>
          </div>
        </div>
      </section>

      {/* Programs Grid */}
      <section className="py-16 bg-black">
        <div className="container mx-auto px-4">
          <div className="grid md:grid-cols-2 gap-8">
            {programs.map((program, index) => (
              <div key={index} className="bg-[#111827] rounded-xl p-8 transform transition-all duration-300 hover:scale-[1.02]">
                <div className="flex items-center mb-6">
                  <program.icon className="h-8 w-8 text-[#FFD700] mr-4" />
                  <h2 className="text-2xl font-bold text-white">{program.title}</h2>
                </div>
                <p className="text-gray-200 text-lg mb-6 leading-relaxed">
                  {program.description}
                </p>
                <ul className="space-y-3">
                  {program.benefits.map((benefit, idx) => (
                    <li key={idx} className="flex items-start text-gray-200">
                      <span className="text-[#FFD700] mr-2">•</span>
                      {benefit}
                    </li>
                  ))}
                </ul>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* Impact Stats */}
      <section className="py-16 bg-[#0A0F1A]">
        <div className="container mx-auto px-4">
          <div className="grid grid-cols-2 md:grid-cols-4 gap-8">
            <div className="text-center">
              <div className="text-4xl font-bold text-[#FFD700] mb-2">5000+</div>
              <div className="text-gray-200">Students Educated</div>
            </div>
            <div className="text-center">
              <div className="text-4xl font-bold text-[#FFD700] mb-2">100+</div>
              <div className="text-gray-200">Villages Reached</div>
            </div>
            <div className="text-center">
              <div className="text-4xl font-bold text-[#FFD700] mb-2">2000+</div>
              <div className="text-gray-200">Health Checkups</div>
            </div>
            <div className="text-center">
              <div className="text-4xl font-bold text-[#FFD700] mb-2">1000+</div>
              <div className="text-gray-200">Youth Skilled</div>
            </div>
          </div>
        </div>
      </section>

      {/* CTA Section */}
      <section className="py-16 bg-black text-white">
        <div className="container mx-auto px-4 text-center">
          <h2 className="text-3xl font-bold mb-6">Support Our Programs</h2>
          <p className="text-xl text-gray-200 mb-8 max-w-2xl mx-auto">
            Your contribution helps us expand our reach and create more impact.
            Join us in making a difference.
          </p>
          <div className="flex justify-center gap-4">
            <Button asChild size="lg" className="bg-[#FFD700] text-black hover:bg-[#E5C100]">
              <Link to="/donate">Make a Donation</Link>
            </Button>
            <Button asChild size="lg" variant="outline" className="border-[#FFD700] text-[#FFD700] hover:bg-[#FFD700] hover:text-black">
              <Link to="/volunteer">Volunteer With Us</Link>
            </Button>
          </div>
        </div>
      </section>

      <Footer />
    </div>
  );
};

export default ProgramsPage;
