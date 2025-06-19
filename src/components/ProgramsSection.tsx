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
      link: "/programs/education"
    },
    {
      id: 2,
      title: "Healthcare Access",
      description: "Providing medical camps, health education, and support for accessing healthcare services in rural and underprivileged areas.",
      icon: Heart,
      category: "Healthcare",
      link: "/programs/healthcare"
    },
    {
      id: 3,
      title: "Community Development",
      description: "Building sustainable communities through infrastructure development, skill training, and women empowerment programs.",
      icon: HandHelping,
      category: "Community",
      link: "/programs/community"
    }
  ];

  return (
    <section id="programs" className="py-16 bg-[#F5F1E8]">
      <div className="container mx-auto px-4">
        <div className="max-w-3xl mx-auto text-center mb-12">
          <h2 className="text-4xl font-bold mb-4 text-[#2C5530]">Our Programs</h2>
          <p className="text-[#333333] text-lg">
            Where compassion meets action through our key initiatives
          </p>
        </div>

        <div className="grid md:grid-cols-3 gap-8 mb-12">
          {programs.map((program) => (
            <Card 
              key={program.id} 
              className="bg-white hover:shadow-xl transition-all duration-300 hover:transform hover:scale-105"
            >
              <CardHeader>
                <div className="bg-[#D86C1F] text-white w-14 h-14 flex items-center justify-center rounded-full mb-4 shadow-lg">
                  <program.icon className="h-7 w-7" />
                </div>
                <Badge className="mb-2 bg-[#2C5530] hover:bg-[#1F3D23] text-white">
                  {program.category}
                </Badge>
                <CardTitle className="text-[#2C5530] text-2xl">{program.title}</CardTitle>
                <CardDescription className="text-[#333333] text-base">
                  {program.description}
                </CardDescription>
              </CardHeader>
              <CardFooter>
                <Button 
                  asChild 
                  variant="outline"
                  className="w-full border-2 border-[#D86C1F] text-[#D86C1F] hover:bg-[#D86C1F] hover:text-white transition-colors"
                >
                  <Link to={program.link} className="flex items-center justify-center">
                    Learn More <ArrowRight className="ml-2 h-4 w-4" />
                  </Link>
                </Button>
              </CardFooter>
            </Card>
          ))}
        </div>

        <div className="text-center">
          <Button 
            asChild 
            size="lg"
            className="bg-[#2C5530] text-white hover:bg-[#1F3D23] transition-colors px-8 py-6 text-lg font-semibold"
          >
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
