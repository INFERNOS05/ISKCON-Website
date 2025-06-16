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
    <section className="py-16 bg-white">
      <div className="container mx-auto px-4">
        <div className="max-w-3xl mx-auto text-center mb-12">
          <h2 className="text-3xl font-bold mb-4">Join Our Impact Story</h2>
          <p className="text-gray-600">
            Be part of our journey to create a better world through various ways of engagement
          </p>
        </div>

        <div className="grid md:grid-cols-3 gap-8">
          {involvementOptions.map((option) => (
            <div 
              key={option.id} 
              className="bg-gray-50 rounded-lg p-8 text-center shadow-md hover:shadow-xl transition-all border border-gray-100 hover:border-yellow-400"
            >
              <div className="bg-yellow-400 text-black w-16 h-16 rounded-full flex items-center justify-center mx-auto mb-6">
                <option.icon className="h-8 w-8" />
              </div>
              <h3 className="text-xl font-bold mb-4">{option.title}</h3>
              <p className="text-gray-600 mb-6">{option.description}</p>
              <Button asChild variant="outline" className="border-yellow-400 text-yellow-400 hover:bg-yellow-400 hover:text-black">
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
