
import { Users, Globe, Award, TrendingUp } from "lucide-react";

const AboutSection = () => {
  const stats = [
    { icon: Users, number: "2M+", label: "Lives Impacted", color: "text-pink-600" },
    { icon: Globe, number: "15", label: "Countries", color: "text-teal-600" },
    { icon: Award, number: "25+", label: "Years of Service", color: "text-purple-600" },
    { icon: TrendingUp, number: "98%", label: "Success Rate", color: "text-orange-600" }
  ];

  return (
    <section className="py-16 md:py-20 bg-gray-50 relative overflow-hidden">
      {/* Background decorative elements */}
      <div className="absolute top-0 right-0 w-64 h-64 bg-green-200 opacity-30 rounded-full transform translate-x-32 -translate-y-32"></div>
      <div className="absolute bottom-0 left-0 w-48 h-48 bg-orange-200 opacity-30 rounded-full transform -translate-x-24 translate-y-24"></div>

      <div className="container mx-auto px-4 relative z-10">
        <div className="text-center mb-12 md:mb-16">
          <h2 className="text-4xl md:text-5xl font-bold text-gray-900 mb-4">
            Our Impact <span className="text-orange-600">Speaks Volumes</span>
          </h2>
          <p className="text-lg md:text-xl text-gray-600 max-w-3xl mx-auto">
            For over two decades, we've been working tirelessly to ensure children's rights 
            are protected, their potential is nurtured, and their futures are secured.
          </p>
        </div>

        <div className="grid grid-cols-2 md:grid-cols-4 gap-6 md:gap-8 mb-12 md:mb-16">
          {stats.map((stat, index) => (
            <div key={index} className="text-center group">
              <div className="bg-white w-16 h-16 md:w-20 md:h-20 rounded-full flex items-center justify-center mx-auto mb-4 shadow-lg group-hover:shadow-xl transition-shadow duration-300 border-4 border-gray-100">
                <stat.icon className={`h-6 w-6 md:h-8 md:w-8 ${stat.color}`} />
              </div>
              <div className="text-2xl md:text-4xl font-bold text-gray-900 mb-2">{stat.number}</div>
              <div className="text-sm md:text-base text-gray-600 font-medium">{stat.label}</div>
            </div>
          ))}
        </div>

        <div className="grid md:grid-cols-2 gap-12 md:gap-16 items-center">
          <div className="space-y-6">
            <h3 className="text-3xl md:text-4xl font-bold text-gray-900 leading-tight">
              Transforming Lives Through 
              <span className="text-green-700"> Action</span>
            </h3>
            <p className="text-gray-600 text-base md:text-lg leading-relaxed">
              We work directly with communities to address the root causes of poverty and inequality. 
              Our comprehensive approach focuses on education, healthcare, child protection, and 
              sustainable development.
            </p>
            <div className="space-y-4">
              {[
                "Quality education for underprivileged children",
                "Healthcare and nutrition programs",
                "Child protection and advocacy",
                "Community development initiatives"
              ].map((item, index) => (
                <div key={index} className="flex items-center group">
                  <div className="w-3 h-3 bg-orange-500 rounded-full mr-4 group-hover:scale-125 transition-transform duration-200"></div>
                  <span className="text-gray-700 font-medium text-sm md:text-base">{item}</span>
                </div>
              ))}
            </div>
          </div>
          <div className="relative">
            <div className="relative">
              <img 
                src="https://images.unsplash.com/photo-1506744038136-46273834b3fb?ixlib=rb-4.0.3&auto=format&fit=crop&w=800&q=80" 
                alt="Community work" 
                className="rounded-2xl shadow-2xl w-full h-[300px] md:h-[400px] object-cover"
              />
              {/* Decorative elements */}
              <div className="absolute -top-4 -right-4 w-12 md:w-16 h-12 md:h-16 bg-yellow-400 rounded-full opacity-80"></div>
              <div className="absolute -bottom-4 -left-4 w-16 md:w-20 h-16 md:h-20 bg-green-400 rounded-full opacity-60"></div>
            </div>
          </div>
        </div>
      </div>
    </section>
  );
};

export default AboutSection;
