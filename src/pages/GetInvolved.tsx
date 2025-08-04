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
    <div className="min-h-screen bg-gray-100">
      <Header />
      
      {/* Hero Section */}
      <section className="relative py-20 bg-prachetas-black text-white">
        <div className="container mx-auto px-4">
          <div className="max-w-4xl mx-auto text-center">
            <h1 className="text-4xl md:text-5xl font-bold mb-6 text-prachetas-yellow">Get Involved</h1>
            <p className="text-xl text-gray-300 mb-8 leading-relaxed">
              Join our mission to create lasting change in communities. Whether through volunteering,
              partnerships, or support, there are many ways to make a difference.
            </p>
          </div>
        </div>
      </section>

      {/* Opportunities */}
      <section className="py-16 bg-white">
        <div className="container mx-auto px-4">
          <div className="max-w-3xl mx-auto text-center mb-12">
            <h2 className="text-3xl font-bold mb-4 text-prachetas-black">Ways to Get Involved</h2>
            <p className="text-prachetas-medium-gray text-lg">
              Choose how you'd like to contribute to our mission and make an impact
            </p>
          </div>
          <div className="grid md:grid-cols-3 gap-8">
            {opportunities.map((opportunity, index) => (
              <div key={opportunity.title} className="bg-prachetas-black rounded-xl p-8 shadow-lg border border-gray-800 hover:transform hover:scale-[1.02] transition-all duration-300">
                <opportunity.icon className="h-12 w-12 text-prachetas-yellow mb-6 mx-auto" />
                <h3 className="text-2xl font-bold text-prachetas-yellow mb-4 text-center">{opportunity.title}</h3>
                <p className="text-gray-300 mb-6 leading-relaxed">{opportunity.description}</p>
                <ul className="space-y-2">
                  {opportunity.actions.map((action, idx) => (
                    <li key={`${opportunity.title}-${idx}`} className="flex items-start text-gray-300">
                      <span className="text-prachetas-yellow mr-2 mt-1">•</span>
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
      <section className="py-16 bg-gray-100">
        <div className="container mx-auto px-4">
          <div className="max-w-3xl mx-auto text-center mb-12">
            <h2 className="text-3xl font-bold mb-4 text-prachetas-black">Upcoming Events</h2>
            <p className="text-prachetas-medium-gray text-lg">
              Join us at these upcoming events and be part of the change
            </p>
          </div>
          <div className="grid md:grid-cols-3 gap-8">
            {upcomingEvents.map((event, index) => (
              <div key={`${event.title}-${index}`} className="bg-white rounded-xl p-8 transform transition-all duration-300 hover:scale-[1.02] shadow-lg border border-gray-200">
                <div className="flex items-center mb-4 text-prachetas-yellow">
                  <Calendar className="h-5 w-5 mr-2" />
                  <span className="font-medium">{event.date}</span>
                </div>
                <h3 className="text-xl font-bold text-prachetas-black mb-2">{event.title}</h3>
                <div className="flex items-center mb-4 text-prachetas-medium-gray">
                  <Clock className="h-4 w-4 mr-2" />
                  <span>{event.location}</span>
                </div>
                <p className="text-prachetas-medium-gray mb-6">{event.description}</p>
                <Button asChild className="w-full bg-prachetas-yellow text-prachetas-black hover:bg-prachetas-bright-yellow border-none">
                  <Link to="/volunteer">Register Now</Link>
                </Button>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* Contact CTA */}
      <section className="py-16 bg-prachetas-black text-white">
        <div className="container mx-auto px-4 text-center">
          <h2 className="text-3xl font-bold mb-6 text-prachetas-yellow">Ready to Make a Difference?</h2>
          <p className="text-xl text-gray-300 mb-8 max-w-2xl mx-auto">
            Contact us to learn more about how you can get involved and contribute
            to creating positive change in our communities.
          </p>
          <div className="flex justify-center gap-4">
            <Button asChild size="lg" className="bg-prachetas-yellow text-prachetas-black hover:bg-prachetas-bright-yellow border-none">
              <Link to="/contact">Contact Us</Link>
            </Button>
            <Button asChild size="lg" variant="outline" className="border-prachetas-yellow text-prachetas-yellow hover:bg-prachetas-yellow hover:text-prachetas-black">
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
