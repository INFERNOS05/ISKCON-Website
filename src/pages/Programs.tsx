import { BookOpen, Users, Heart, Brain, GraduationCap, Sprout } from "lucide-react";
import Header from "../components/Header";
import Footer from "../components/Footer";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { Link } from "react-router-dom";

const ProgramsPage = () => {
  const programs = [
    {
      title: "Education Empowerment",
      icon: GraduationCap,
      category: "Education",
      description: "Providing quality education and learning resources to underprivileged children.",
      backgroundImage: "/Copy of IMG-20250610-WA0013.jpg",
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
      category: "Healthcare",
      description: "Promoting health awareness and providing medical support to communities.",
      backgroundImage: "/Copy of WhatsApp Image 2025-02-26 at 15.50.55 (1).jpeg",
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
      category: "Skills",
      description: "Empowering youth with skills for better employment opportunities.",
      backgroundImage: "/Copy of WhatsApp Image 2025-02-27 at 16.10.09 (1).jpeg",
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
      category: "Community",
      description: "Supporting rural communities with sustainable development initiatives.",
      backgroundImage: "/Copy of WhatsApp Image 2025-02-27 at 16.15.54.jpeg",
      benefits: [
        "Agricultural support",
        "Water conservation projects",
        "Sustainable living practices",
        "Community infrastructure"
      ]
    }
  ];

  return (
    <div className="min-h-screen bg-gray-50">
      <Header />
      
      {/* Hero Section */}
      <section className="relative py-20 bg-white text-prachetas-black">
        <div className="container mx-auto px-4">
          <div className="max-w-4xl mx-auto text-center">
            <h1 className="text-4xl md:text-5xl font-bold mb-6">Our Programs</h1>
            <p className="text-xl text-prachetas-medium-gray mb-8 leading-relaxed">
              Through our diverse range of programs, we aim to create lasting positive change
              in communities and empower individuals to build better futures.
            </p>
          </div>
        </div>
      </section>

      {/* Programs Grid */}
      <section className="py-16 bg-gray-50">
        <div className="container mx-auto px-4">
          <div className="grid md:grid-cols-2 gap-8">
            {programs.map((program, index) => (
              <Card 
                key={program.title} 
                className="relative overflow-hidden bg-white hover:shadow-xl transition-all duration-300 hover:transform hover:scale-[1.02] h-96"
              >
                {/* Background Image */}
                <div className="absolute inset-0">
                  <img
                    src={program.backgroundImage}
                    alt={`${program.title} background`}
                    className="w-full h-full object-cover"
                  />
                  {/* Dark overlay for text readability */}
                  <div className="absolute inset-0 bg-black/60"></div>
                </div>
                
                {/* Content */}
                <div className="relative z-10 h-full flex flex-col">
                  <CardHeader className="flex-shrink-0">
                    <div className="bg-prachetas-yellow text-prachetas-black w-14 h-14 flex items-center justify-center rounded-full mb-4 shadow-lg">
                      <program.icon className="h-7 w-7" />
                    </div>
                    <Badge className="mb-2 bg-prachetas-yellow text-prachetas-black hover:bg-yellow-300 w-fit">
                      {program.category}
                    </Badge>
                    <CardTitle className="text-white text-2xl">{program.title}</CardTitle>
                    <CardDescription className="text-gray-200 text-base">
                      {program.description}
                    </CardDescription>
                  </CardHeader>
                  
                  <CardContent className="flex-1 pt-0">
                    <ul className="space-y-2">
                      {program.benefits.map((benefit, idx) => (
                        <li key={`${program.title}-${idx}`} className="flex items-start text-gray-200 text-sm">
                          <span className="text-prachetas-yellow mr-2 mt-1">•</span>
                          {benefit}
                        </li>
                      ))}
                    </ul>
                  </CardContent>
                </div>
              </Card>
            ))}
          </div>
        </div>
      </section>

      {/* Impact Stats */}
      <section className="py-16 bg-gray-100">
        <div className="container mx-auto px-4">
          <div className="max-w-3xl mx-auto text-center mb-12">
            <h2 className="text-3xl font-bold mb-4 text-prachetas-black">Our Impact</h2>
            <p className="text-prachetas-medium-gray text-lg">
              See the difference we're making in communities across the region
            </p>
          </div>
          <div className="grid grid-cols-2 md:grid-cols-4 gap-8">
            <div className="text-center bg-white p-6 rounded-lg shadow-md">
              <div className="text-4xl font-bold text-prachetas-yellow mb-2">5000+</div>
              <div className="text-prachetas-black font-medium">Students Educated</div>
            </div>
            <div className="text-center bg-white p-6 rounded-lg shadow-md">
              <div className="text-4xl font-bold text-prachetas-yellow mb-2">100+</div>
              <div className="text-prachetas-black font-medium">Villages Reached</div>
            </div>
            <div className="text-center bg-white p-6 rounded-lg shadow-md">
              <div className="text-4xl font-bold text-prachetas-yellow mb-2">2000+</div>
              <div className="text-prachetas-black font-medium">Health Checkups</div>
            </div>
            <div className="text-center bg-white p-6 rounded-lg shadow-md">
              <div className="text-4xl font-bold text-prachetas-yellow mb-2">1000+</div>
              <div className="text-prachetas-black font-medium">Youth Skilled</div>
            </div>
          </div>
        </div>
      </section>

      {/* CTA Section */}
      <section className="py-16 bg-prachetas-black text-white">
        <div className="container mx-auto px-4 text-center">
          <h2 className="text-3xl font-bold mb-6 text-prachetas-yellow">Support Our Programs</h2>
          <p className="text-xl text-gray-300 mb-8 max-w-2xl mx-auto">
            Your contribution helps us expand our reach and create more impact.
            Join us in making a difference.
          </p>
          <div className="flex justify-center gap-4">
            <Button asChild size="lg" className="bg-prachetas-yellow text-prachetas-black hover:bg-prachetas-bright-yellow">
              <Link to="/donate">Make a Donation</Link>
            </Button>
            <Button asChild size="lg" variant="outline" className="border-prachetas-yellow text-prachetas-yellow hover:bg-prachetas-yellow hover:text-prachetas-black">
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
