import { Button } from "@/components/ui/button";
import { Card, CardContent, CardDescription, CardFooter, CardHeader, CardTitle } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { Link } from "react-router-dom";
import { BookOpen, Heart, HandHelping, ArrowRight } from "lucide-react";

const ProgramsSection = () => {
  const programs = [
    {
      id: 1,
      title: "Education Initiatives",
      description: "Empowering children and adults through quality education programs, scholarships, and educational resources for underserved communities.",
      icon: BookOpen,
      category: "Education",
      link: "/programs/education",
      backgroundImage: "/Copy of IMG-20250610-WA0013.jpg"
    },
    {
      id: 2,
      title: "Healthcare Access",
      description: "Providing medical camps, health education, and support for accessing healthcare services in rural and underprivileged areas.",
      icon: Heart,
      category: "Healthcare",
      link: "/programs/healthcare",
      backgroundImage: "/Copy of WhatsApp Image 2025-02-26 at 15.50.55 (1).jpeg"
    },
    {
      id: 3,
      title: "Community Development",
      description: "Building sustainable communities through infrastructure development, skill training, and women empowerment programs.",
      icon: HandHelping,
      category: "Community",
      link: "/programs/community",
      backgroundImage: "/Copy of WhatsApp Image 2025-02-27 at 16.10.09 (1).jpeg"
    }
  ];

  return (
    <section className="py-16 bg-gray-100" id="programs">
      <div className="container mx-auto px-4">
        <div className="max-w-3xl mx-auto text-center mb-12">
          <h2 className="text-4xl font-bold mb-4 text-prachetas-black">Our Programs</h2>
          <p className="text-prachetas-medium-gray text-lg">
            Making a meaningful impact through targeted initiatives in education, healthcare, and community development
          </p>
        </div>

        <div className="grid md:grid-cols-3 gap-8 mb-12">
          {programs.map((program) => (
            <Card key={program.id} className="relative overflow-hidden h-96 group hover:scale-[1.02] transition-all duration-300 border-2 border-gray-200 hover:border-prachetas-yellow">
              {/* Background Image with Dark Overlay */}
              <div 
                className="absolute inset-0 bg-cover bg-center"
                style={{ backgroundImage: `url(${program.backgroundImage})` }}
              >
                <div className="absolute inset-0 bg-prachetas-black/75 group-hover:bg-prachetas-black/60 transition-all duration-300"></div>
              </div>
              
              {/* Content */}
              <div className="relative z-10 h-full flex flex-col text-white">
                <CardHeader className="pb-2">
                  <div className="flex items-center justify-between mb-2">
                    <program.icon className="h-8 w-8 text-prachetas-yellow" />
                    <Badge variant="secondary" className="bg-prachetas-yellow text-prachetas-black font-semibold">
                      {program.category}
                    </Badge>
                  </div>
                  <CardTitle className="text-2xl font-bold text-white group-hover:text-prachetas-yellow transition-colors">
                    {program.title}
                  </CardTitle>
                </CardHeader>
                <CardContent className="flex-1">
                  <CardDescription className="text-gray-300 text-base leading-relaxed">
                    {program.description}
                  </CardDescription>
                </CardContent>
                <CardFooter className="pt-2">
                  <Button asChild className="w-full bg-prachetas-yellow text-prachetas-black hover:bg-prachetas-bright-yellow transition-colors font-semibold">
                    <Link to={program.link}>
                      Learn More <ArrowRight className="ml-2 h-4 w-4" />
                    </Link>
                  </Button>
                </CardFooter>
              </div>
            </Card>
          ))}
        </div>

        <div className="text-center">
          <Button asChild size="lg" variant="outline" 
            className="border-2 border-prachetas-yellow text-prachetas-yellow hover:bg-prachetas-yellow hover:text-prachetas-black transition-colors px-8 py-3 font-semibold">
            <Link to="/programs">
              View All Programs <ArrowRight className="ml-2 h-5 w-5" />
            </Link>
          </Button>
        </div>
      </div>
    </section>
  );
};

export default ProgramsSection;
