
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { BookOpen, Heart, Shield, Sprout } from "lucide-react";

const ProgramsSection = () => {
  const programs = [
    {
      icon: BookOpen,
      title: "Education",
      description: "Providing quality education and learning opportunities to children in underserved communities worldwide.",
      image: "https://images.unsplash.com/photo-1581091226825-a6a2a5aee158?ixlib=rb-4.0.3&auto=format&fit=crop&w=400&q=80",
      color: "bg-pink-500",
      lightColor: "bg-pink-100"
    },
    {
      icon: Heart,
      title: "Health & Nutrition",
      description: "Ensuring children have access to healthcare, clean water, and nutritious meals for healthy development.",
      image: "https://images.unsplash.com/photo-1649972904349-6e44c42644a7?ixlib=rb-4.0.3&auto=format&fit=crop&w=400&q=80",
      color: "bg-teal-500",
      lightColor: "bg-teal-100"
    },
    {
      icon: Shield,
      title: "Safety & Protection",
      description: "Addressing issues like child labour, child marriage, trafficking and abuse to ensure child safety.",
      image: "https://images.unsplash.com/photo-1518495973542-4542c06a5843?ixlib=rb-4.0.3&auto=format&fit=crop&w=400&q=80",
      color: "bg-purple-500",
      lightColor: "bg-purple-100"
    },
    {
      icon: Sprout,
      title: "Child Participation",
      description: "Building resilient communities through environmental conservation and economic empowerment programs.",
      image: "https://images.unsplash.com/photo-1501854140801-50d01698950b?ixlib=rb-4.0.3&auto=format&fit=crop&w=400&q=80",
      color: "bg-orange-500",
      lightColor: "bg-orange-100"
    }
  ];

  return (
    <section className="py-20 bg-gradient-to-b from-yellow-50 to-white relative overflow-hidden">
      {/* Background decoration */}
      <div className="absolute top-0 left-0 w-full h-32 bg-yellow-400 opacity-20 transform -skew-y-1"></div>
      
      <div className="container mx-auto px-4 relative z-10">
        <div className="text-center mb-16">
          <div className="inline-block">
            <div className="bg-yellow-400 text-black px-8 py-4 rounded-full text-2xl font-bold mb-6 transform -rotate-1">
              What We Do
            </div>
          </div>
          <p className="text-xl text-gray-600 max-w-3xl mx-auto">
            Comprehensive initiatives designed to address the multifaceted challenges 
            facing children and communities worldwide.
          </p>
        </div>

        <div className="grid md:grid-cols-2 lg:grid-cols-4 gap-8">
          {programs.map((program, index) => (
            <Card key={index} className="group hover:shadow-2xl transition-all duration-300 border-0 overflow-hidden bg-white hover:-translate-y-2">
              <div className="relative">
                <img 
                  src={program.image} 
                  alt={program.title}
                  className="w-full h-48 object-cover"
                />
                <div className={`absolute top-4 left-4 ${program.lightColor} p-3 rounded-full`}>
                  <program.icon className={`h-6 w-6 text-gray-700`} />
                </div>
                {/* Colored bottom border */}
                <div className={`absolute bottom-0 left-0 w-full h-1 ${program.color}`}></div>
              </div>
              <CardHeader className="pb-2">
                <CardTitle className="text-green-800 text-xl font-bold">{program.title}</CardTitle>
                <div className={`w-12 h-1 ${program.color} rounded-full`}></div>
              </CardHeader>
              <CardContent className="space-y-4">
                <CardDescription className="text-gray-600 leading-relaxed">
                  {program.description}
                </CardDescription>
                <Button 
                  className={`w-full ${program.color} hover:opacity-90 text-white font-semibold rounded-full`}
                >
                  Know More
                </Button>
              </CardContent>
            </Card>
          ))}
        </div>
      </div>
    </section>
  );
};

export default ProgramsSection;
