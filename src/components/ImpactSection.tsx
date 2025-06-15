
import { Progress } from "@/components/ui/progress";

const ImpactSection = () => {
  const impacts = [
    { 
      title: "Children in School", 
      value: 85, 
      total: "45,000 children enrolled",
      color: "bg-pink-500",
      bgColor: "bg-pink-600"
    },
    { 
      title: "Healthcare Access", 
      value: 92, 
      total: "Healthcare for 78,000 families",
      color: "bg-teal-500",
      bgColor: "bg-teal-600"
    },
    { 
      title: "Community Programs", 
      value: 78, 
      total: "350 active programs",
      color: "bg-purple-500",
      bgColor: "bg-purple-600"
    },
    { 
      title: "Sustainability Goals", 
      value: 95, 
      total: "Environmental initiatives",
      color: "bg-orange-500",
      bgColor: "bg-orange-600"
    }
  ];

  return (
    <section className="py-20 bg-gradient-to-br from-green-800 via-green-700 to-green-900 text-white relative overflow-hidden">
      {/* Background decorative elements */}
      <div className="absolute top-0 left-0 w-96 h-96 bg-gradient-to-br from-yellow-400 to-orange-500 opacity-10 rounded-full -translate-x-48 -translate-y-48"></div>
      <div className="absolute bottom-0 right-0 w-80 h-80 bg-gradient-to-tl from-teal-400 to-green-500 opacity-10 rounded-full translate-x-40 translate-y-40"></div>

      <div className="container mx-auto px-4 relative z-10">
        <div className="text-center mb-16">
          <h2 className="text-5xl font-bold mb-6">
            Making a <span className="text-yellow-300">Difference</span> Every Day
          </h2>
          <p className="text-xl text-green-100 max-w-3xl mx-auto leading-relaxed">
            See how your support translates into real, measurable impact in communities around the world.
          </p>
        </div>

        <div className="grid md:grid-cols-2 gap-8">
          {impacts.map((impact, index) => (
            <div key={index} className="bg-white/10 backdrop-blur-sm p-8 rounded-2xl border border-white/20 hover:bg-white/15 transition-all duration-300 group">
              <div className="flex items-center mb-6">
                <div className={`w-4 h-4 ${impact.color} rounded-full mr-4`}></div>
                <h3 className="text-2xl font-bold text-white">{impact.title}</h3>
              </div>
              
              <div className="space-y-4">
                <div className="flex justify-between items-center">
                  <span className="text-3xl font-bold text-yellow-300">{impact.value}%</span>
                  <span className="text-green-100 font-medium">{impact.total}</span>
                </div>
                
                <div className="relative">
                  <div className="w-full bg-white/20 rounded-full h-4 overflow-hidden">
                    <div 
                      className={`h-full ${impact.color} rounded-full transition-all duration-1000 ease-out relative overflow-hidden`}
                      style={{ width: `${impact.value}%` }}
                    >
                      <div className="absolute inset-0 bg-gradient-to-r from-transparent via-white/30 to-transparent animate-pulse"></div>
                    </div>
                  </div>
                </div>
              </div>
            </div>
          ))}
        </div>

        {/* Call to action */}
        <div className="text-center mt-16">
          <div className="inline-block bg-yellow-400 text-black px-8 py-4 rounded-full font-bold text-lg hover:bg-yellow-300 transition-colors cursor-pointer transform hover:scale-105">
            Join Our Impact Story
          </div>
        </div>
      </div>
    </section>
  );
};

export default ImpactSection;
