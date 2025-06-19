import { Card, CardContent } from "@/components/ui/card";
import { Users, Heart, BookOpen } from "lucide-react";

const ImpactSection = () => {
  return (
    <section className="py-16 bg-[#2C5530] text-white relative overflow-hidden">
      {/* Background pattern */}
      <div className="absolute inset-0 opacity-10">
        <div className="absolute inset-0 bg-pattern transform rotate-45"></div>
      </div>

      <div className="container mx-auto px-4 relative z-10">
        <div className="max-w-3xl mx-auto text-center mb-12">
          <h2 className="text-4xl font-bold mb-4 text-white">Our Impact</h2>
          <p className="text-gray-100 text-lg">
            Through compassion and collective action, we've created meaningful
            change across communities
          </p>
        </div>

        <div className="grid md:grid-cols-3 gap-8">
          <Card className="bg-white/10 backdrop-blur-sm border-none text-white shadow-xl hover:transform hover:scale-105 transition-all duration-300">
            <CardContent className="pt-6">
              <div className="flex flex-col items-center text-center">
                <div className="bg-[#D86C1F] text-white p-4 rounded-full mb-4 shadow-lg">
                  <Users className="h-8 w-8" />
                </div>
                <h3 className="text-3xl font-bold mb-2 text-[#FFD700]">
                  50,000+
                </h3>
                <p className="text-white/90 text-lg">
                  Lives positively impacted through our community initiatives
                </p>
              </div>
            </CardContent>
          </Card>

          <Card className="bg-white/10 backdrop-blur-sm border-none text-white shadow-xl hover:transform hover:scale-105 transition-all duration-300">
            <CardContent className="pt-6">
              <div className="flex flex-col items-center text-center">
                <div className="bg-[#D86C1F] text-white p-4 rounded-full mb-4 shadow-lg">
                  <Heart className="h-8 w-8" />
                </div>
                <h3 className="text-3xl font-bold mb-2 text-[#FFD700]">100+</h3>
                <p className="text-white/90 text-lg">
                  Volunteers actively engaged in our programs and initiatives
                </p>
              </div>
            </CardContent>
          </Card>

          <Card className="bg-white/10 backdrop-blur-sm border-none text-white shadow-xl hover:transform hover:scale-105 transition-all duration-300">
            <CardContent className="pt-6">
              <div className="flex flex-col items-center text-center">
                <div className="bg-[#D86C1F] text-white p-4 rounded-full mb-4 shadow-lg">
                  <BookOpen className="h-8 w-8" />
                </div>
                <h3 className="text-3xl font-bold mb-2 text-[#FFD700]">25+</h3>
                <p className="text-white/90 text-lg">
                  Educational programs conducted to empower communities
                </p>
              </div>
            </CardContent>
          </Card>
        </div>
      </div>
    </section>
  );
};

export default ImpactSection;
