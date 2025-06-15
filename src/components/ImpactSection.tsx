
import { Progress } from "@/components/ui/progress";

const ImpactSection = () => {
  const impacts = [
    { title: "Children in School", value: 85, total: "45,000 children enrolled" },
    { title: "Healthcare Access", value: 92, total: "Healthcare for 78,000 families" },
    { title: "Community Programs", value: 78, total: "350 active programs" },
    { title: "Sustainability Goals", value: 95, total: "Environmental initiatives" }
  ];

  return (
    <section className="py-20 bg-green-800 text-white">
      <div className="container mx-auto px-4">
        <div className="text-center mb-16">
          <h2 className="text-4xl font-bold mb-4">Making a Difference Every Day</h2>
          <p className="text-xl text-green-100 max-w-3xl mx-auto">
            See how your support translates into real, measurable impact in communities around the world.
          </p>
        </div>

        <div className="grid md:grid-cols-2 gap-12">
          {impacts.map((impact, index) => (
            <div key={index} className="bg-green-700 p-8 rounded-lg">
              <h3 className="text-2xl font-semibold mb-4">{impact.title}</h3>
              <div className="mb-4">
                <div className="flex justify-between mb-2">
                  <span>{impact.value}% Complete</span>
                  <span className="text-orange-300">{impact.total}</span>
                </div>
                <Progress value={impact.value} className="h-3" />
              </div>
            </div>
          ))}
        </div>
      </div>
    </section>
  );
};

export default ImpactSection;
