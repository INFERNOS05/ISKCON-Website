import { Card, CardContent } from "@/components/ui/card";
import { Users, Heart, BookOpen } from "lucide-react";

const ImpactSection = () => {  return (
    <section className="py-16 bg-black text-white">
      <div className="container mx-auto px-4">
        <div className="max-w-3xl mx-auto text-center mb-12">
          <h2 className="text-3xl font-bold mb-4">Our Impact</h2>
          <p className="text-gray-400">
            Through compassion and collective action, we've created meaningful change across communities
          </p>
        </div>
          <div className="grid md:grid-cols-3 gap-8">
          <Card className="border border-gray-800 bg-gray-900 text-white shadow-md hover:shadow-xl hover:border-yellow-400 transition-all">
            <CardContent className="pt-6">
              <div className="flex flex-col items-center text-center">
                <div className="bg-yellow-400 text-black p-4 rounded-full mb-4">
                  <Users className="h-8 w-8" />
                </div>
                <h3 className="text-2xl font-bold mb-2 text-white">50,000+</h3>
                <p className="text-gray-300">Lives positively impacted through our community initiatives</p>
              </div>
            </CardContent>
          </Card>
          
          <Card className="border border-gray-800 bg-gray-900 text-white shadow-md hover:shadow-xl hover:border-yellow-400 transition-all">
            <CardContent className="pt-6">
              <div className="flex flex-col items-center text-center">
                <div className="bg-yellow-400 text-black p-4 rounded-full mb-4">
                  <Heart className="h-8 w-8" />
                </div>
                <h3 className="text-2xl font-bold mb-2 text-white">100+</h3>
                <p className="text-gray-300">Volunteers actively engaged in our programs and initiatives</p>
              </div>
            </CardContent>
          </Card>
          
          <Card className="border border-gray-800 bg-gray-900 text-white shadow-md hover:shadow-xl hover:border-yellow-400 transition-all">
            <CardContent className="pt-6">
              <div className="flex flex-col items-center text-center">
                <div className="bg-yellow-400 text-black p-4 rounded-full mb-4">
                  <BookOpen className="h-8 w-8" />
                </div>
                <h3 className="text-2xl font-bold mb-2 text-white">25+</h3>
                <p className="text-gray-300">Educational programs conducted to empower communities</p>
              </div>
            </CardContent>
          </Card>
        </div>
      </div>
    </section>
  );
};

export default ImpactSection;
