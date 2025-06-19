import { Button } from "@/components/ui/button";
import { Link } from "react-router-dom";
import { Handshake, Heart, Clock } from "lucide-react";

const GetInvolvedSection = () => {
  const involvementOptions = [
    {
      id: 1,
      title: "Donate",
      description: "Your financial support drives our mission and helps create lasting change in communities.",
      icon: Heart,
      buttonText: "Donate Now",
      link: "/donate"
    },
    {
      id: 2,
      title: "Volunteer",
      description: "Join our community of dedicated volunteers making a hands-on difference in various programs.",
      icon: Handshake,
      buttonText: "Join Us",
      link: "/volunteer"
    },
    {
      id: 3,
      title: "Partner With Us",
      description: "Collaborate with us through corporate partnerships, institutional support or joint programs.",
      icon: Clock,
      buttonText: "Learn More",
      link: "/partner"
    }
  ];

  return (
    <section className="py-16 bg-[#F5F1E8]">
      <div className="container mx-auto px-4">
        <div className="max-w-3xl mx-auto text-center mb-12">
          <h2 className="text-4xl font-bold mb-4 text-[#2C5530]">Join Our Impact Story</h2>
          <p className="text-[#333333] text-lg">
            Be part of our journey to create a better world through various ways of engagement
          </p>
        </div>

        <div className="grid md:grid-cols-3 gap-8">
          {involvementOptions.map((option) => (
            <div 
              key={option.id} 
              className="bg-white rounded-lg p-8 text-center shadow-lg hover:shadow-xl transition-all transform hover:scale-105 duration-300"
            >
              <div className="bg-[#D86C1F] text-white w-16 h-16 rounded-full flex items-center justify-center mx-auto mb-6 shadow-lg">
                <option.icon className="h-8 w-8" />
              </div>
              <h3 className="text-2xl font-bold mb-4 text-[#2C5530]">{option.title}</h3>
              <p className="text-[#333333] mb-6 text-lg leading-relaxed">
                {option.description}
              </p>
              <Button
                asChild
                className={option.id === 1 
                  ? "bg-[#D86C1F] text-white hover:bg-[#C35A15] w-full text-lg py-6" 
                  : "border-2 border-[#2C5530] text-[#2C5530] hover:bg-[#2C5530] hover:text-white w-full text-lg py-6"}
              >
                <Link to={option.link}>
                  {option.buttonText}
                </Link>
              </Button>
            </div>
          ))}
        </div>
      </div>
    </section>
  );
};

export default GetInvolvedSection;
