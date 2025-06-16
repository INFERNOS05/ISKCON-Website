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

  return (    <section id="programs" className="py-16 bg-black text-white">
      <div className="container mx-auto px-4">
        <div className="max-w-3xl mx-auto text-center mb-12">
          <h2 className="text-3xl font-bold mb-4">Our Programs</h2>
          <p className="text-gray-400">
            Where compassion meets action through our key initiatives
          </p>
        </div>

        <div className="grid md:grid-cols-3 gap-8 mb-12">
          {programs.map((program) => (
            <Card key={program.id} className="border border-gray-800 hover:border-yellow-400 transition-all bg-gray-900 text-white">
              <CardHeader>
                <div className="bg-yellow-400 text-black w-12 h-12 flex items-center justify-center rounded-full mb-4">
                  <program.icon className="h-6 w-6" />                </div>
                <CardTitle className="text-white">{program.title}</CardTitle>
                <Badge variant="outline" className="text-xs text-yellow-400 border-yellow-400/30 bg-yellow-400/10 mt-2 w-fit">
                  {program.category}
                </Badge>
              </CardHeader>
              <CardContent>
                <CardDescription className="text-gray-300">
                  {program.description}
                </CardDescription>
              </CardContent>
              <CardFooter>
                <Button asChild variant="link" className="p-0 text-yellow-400 hover:text-yellow-500">
                  <Link to={program.link}>
                    Learn more <ArrowRight className="ml-1 h-4 w-4" />
                  </Link>
                </Button>
              </CardFooter>
            </Card>
          ))}
        </div>

        <div className="text-center">
          <Button asChild variant="outline" className="border-yellow-400 text-yellow-400 hover:bg-yellow-400 hover:text-black">
            <Link to="/programs">View All Programs</Link>
          </Button>
        </div>
      </div>
    </section>
  );
};

export default ProgramsSection;
