
import { Users, Globe, Award, TrendingUp } from "lucide-react";

const AboutSection = () => {
  const stats = [
    { icon: Users, number: "2M+", label: "Lives Impacted" },
    { icon: Globe, number: "15", label: "Countries" },
    { icon: Award, number: "25+", label: "Years of Service" },
    { icon: TrendingUp, number: "98%", label: "Success Rate" }
  ];

  return (
    <section className="py-20 bg-gray-50">
      <div className="container mx-auto px-4">
        <div className="text-center mb-16">
          <h2 className="text-4xl font-bold text-gray-900 mb-4">
            Our Impact Speaks Volumes
          </h2>
          <p className="text-xl text-gray-600 max-w-3xl mx-auto">
            For over two decades, we've been working tirelessly to ensure children's rights 
            are protected, their potential is nurtured, and their futures are secured.
          </p>
        </div>

        <div className="grid md:grid-cols-4 gap-8 mb-16">
          {stats.map((stat, index) => (
            <div key={index} className="text-center">
              <div className="bg-green-100 w-16 h-16 rounded-full flex items-center justify-center mx-auto mb-4">
                <stat.icon className="h-8 w-8 text-green-700" />
              </div>
              <div className="text-3xl font-bold text-gray-900 mb-2">{stat.number}</div>
              <div className="text-gray-600">{stat.label}</div>
            </div>
          ))}
        </div>

        <div className="grid md:grid-cols-2 gap-12 items-center">
          <div>
            <h3 className="text-3xl font-bold text-gray-900 mb-6">
              Transforming Lives Through Action
            </h3>
            <p className="text-gray-600 mb-6">
              We work directly with communities to address the root causes of poverty and inequality. 
              Our comprehensive approach focuses on education, healthcare, child protection, and 
              sustainable development.
            </p>
            <ul className="space-y-3 text-gray-600">
              <li className="flex items-center">
                <div className="w-2 h-2 bg-orange-500 rounded-full mr-3"></div>
                Quality education for underprivileged children
              </li>
              <li className="flex items-center">
                <div className="w-2 h-2 bg-orange-500 rounded-full mr-3"></div>
                Healthcare and nutrition programs
              </li>
              <li className="flex items-center">
                <div className="w-2 h-2 bg-orange-500 rounded-full mr-3"></div>
                Child protection and advocacy
              </li>
              <li className="flex items-center">
                <div className="w-2 h-2 bg-orange-500 rounded-full mr-3"></div>
                Community development initiatives
              </li>
            </ul>
          </div>
          <div>
            <img 
              src="https://images.unsplash.com/photo-1506744038136-46273834b3fb?ixlib=rb-4.0.3&auto=format&fit=crop&w=800&q=80" 
              alt="Community work" 
              className="rounded-lg shadow-lg"
            />
          </div>
        </div>
      </div>
    </section>
  );
};

export default AboutSection;
