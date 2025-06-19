import { Heart, Users, HandHeart, Clock, Calendar, Mail } from "lucide-react";
import Header from "../components/Header";
import Footer from "../components/Footer";
import { Button } from "@/components/ui/button";
import { Link } from "react-router-dom";

const GetInvolvedPage = () => {
  const opportunities = [
    {
      title: "Volunteer",
      icon: Heart,
      description: "Join our team of dedicated volunteers and make a direct impact in our community programs.",
      actions: [
        "Teaching and mentoring",
        "Healthcare camps assistance",
        "Community outreach",
        "Event organization"
      ]
    },
    {
      title: "Partner With Us",
      icon: HandHeart,
      description: "Collaborate with us as an organization to create larger social impact through combined efforts.",
      actions: [
        "Corporate partnerships",
        "NGO collaborations",
        "Resource sharing",
        "Joint programs"
      ]
    },
    {
      title: "Support Our Cause",
      icon: Users,
      description: "Make a difference through financial support and help us expand our reach and impact.",
      actions: [
        "One-time donations",
        "Monthly giving",
        "Sponsor a child",
        "Project funding"
      ]
    }
  ];

  const upcomingEvents = [
    {
      title: "Community Health Camp",
      date: "July 15, 2025",
      location: "Rural Maharashtra",
      description: "Free health checkups and awareness session for village communities."
    },
    {
      title: "Education Workshop",
      date: "August 1, 2025",
      location: "Mumbai Center",
      description: "Teacher training program for quality education delivery."
    },
    {
      title: "Youth Skill Development",
      date: "August 20, 2025",
      location: "Urban Centers",
      description: "Technical skills workshop for unemployed youth."
    }
  ];

  return (
    <div className="min-h-screen bg-black">
      <Header />
      
      {/* Hero Section */}
      <section className="relative py-20 bg-[#0A0F1A] text-white">
        <div className="container mx-auto px-4">
          <div className="max-w-4xl mx-auto text-center">
            <h1 className="text-4xl md:text-5xl font-bold mb-6">Get Involved</h1>
            <p className="text-xl text-gray-200 mb-8 leading-relaxed">
              Join us in our mission to create positive change. There are many ways
              you can contribute to making a difference in people's lives.
            </p>
          </div>
        </div>
      </section>

      {/* Opportunities Section */}
      <section className="py-16 bg-black">
        <div className="container mx-auto px-4">
          <div className="grid md:grid-cols-3 gap-8">
            {opportunities.map((opportunity, index) => (
              <div key={index} className="bg-[#111827] rounded-xl p-8 transform transition-all duration-300 hover:scale-[1.02]">
                <div className="flex items-center mb-6">
                  <opportunity.icon className="h-8 w-8 text-[#FFD700] mr-4" />
                  <h2 className="text-2xl font-bold text-white">{opportunity.title}</h2>
                </div>
                <p className="text-gray-200 text-lg mb-6 leading-relaxed">
                  {opportunity.description}
                </p>
                <ul className="space-y-3">
                  {opportunity.actions.map((action, idx) => (
                    <li key={idx} className="flex items-start text-gray-200">
                      <span className="text-[#FFD700] mr-2">•</span>
                      {action}
                    </li>
                  ))}
                </ul>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* Upcoming Events */}
      <section className="py-16 bg-[#0A0F1A]">
        <div className="container mx-auto px-4">
          <h2 className="text-3xl font-bold mb-12 text-center text-white">Upcoming Events</h2>
          <div className="grid md:grid-cols-3 gap-8">
            {upcomingEvents.map((event, index) => (
              <div key={index} className="bg-[#111827] rounded-xl p-8 transform transition-all duration-300 hover:scale-[1.02]">
                <div className="flex items-center mb-4 text-[#FFD700]">
                  <Calendar className="h-5 w-5 mr-2" />
                  <span>{event.date}</span>
                </div>
                <h3 className="text-xl font-bold text-white mb-2">{event.title}</h3>
                <div className="flex items-center mb-4 text-gray-300">
                  <Clock className="h-4 w-4 mr-2" />
                  <span>{event.location}</span>
                </div>
                <p className="text-gray-200">{event.description}</p>
                <Button className="w-full mt-6 bg-[#FFD700] text-black hover:bg-[#E5C100]">
                  Register Now
                </Button>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* Contact CTA */}
      <section className="py-16 bg-black text-white">
        <div className="container mx-auto px-4 text-center">
          <h2 className="text-3xl font-bold mb-6">Ready to Make a Difference?</h2>
          <p className="text-xl text-gray-200 mb-8 max-w-2xl mx-auto">
            Contact us to learn more about how you can get involved and contribute
            to creating positive change in our communities.
          </p>
          <div className="flex justify-center gap-4">
            <Button asChild size="lg" className="bg-[#FFD700] text-black hover:bg-[#E5C100]">
              <Link to="/contact">Contact Us</Link>
            </Button>
            <Button asChild size="lg" variant="outline" className="border-[#FFD700] text-[#FFD700] hover:bg-[#FFD700] hover:text-black">
              <a href="mailto:prachetasfoundation@gmail.com">
                <Mail className="mr-2 h-5 w-5" />
                Email Us
              </a>
            </Button>
          </div>
        </div>
      </section>

      <Footer />
    </div>
  );
};

export default GetInvolvedPage;
