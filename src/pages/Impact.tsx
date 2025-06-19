import { BarChart, TrendingUp, Users, Heart } from "lucide-react";
import Header from "../components/Header";
import Footer from "../components/Footer";
import { Button } from "@/components/ui/button";
import { Link } from "react-router-dom";

const ImpactPage = () => {
  const impactStats = [
    {
      number: "50,000+",
      label: "Lives Impacted",
      icon: Users,
      description: "Direct beneficiaries of our programs across communities"
    },
    {
      number: "100+",
      label: "Villages Reached",
      icon: TrendingUp,
      description: "Communities where we've implemented our programs"
    },
    {
      number: "₹2Cr+",
      label: "Funds Utilized",
      icon: BarChart,
      description: "Effectively allocated for maximum social impact"
    },
    {
      number: "1000+",
      label: "Volunteers",
      icon: Heart,
      description: "Dedicated individuals supporting our mission"
    }
  ];

  const successStories = [
    {
      name: "Village Education Initiative",
      location: "Rural Maharashtra",
      image: "/placeholder.svg",
      description: "Transformed education access for 500+ children through digital learning centers.",
      achievement: "90% improvement in learning outcomes"
    },
    {
      name: "Healthcare Outreach",
      location: "Tribal Areas",
      image: "/placeholder.svg",
      description: "Provided essential healthcare services to remote communities.",
      achievement: "2000+ health checkups conducted"
    },
    {
      name: "Youth Empowerment",
      location: "Urban Slums",
      image: "/placeholder.svg",
      description: "Skilled training program helping youth secure better employment.",
      achievement: "80% placement rate achieved"
    }
  ];

  return (
    <div className="min-h-screen bg-black">
      <Header />
      
      {/* Hero Section */}
      <section className="relative py-20 bg-[#0A0F1A] text-white">
        <div className="container mx-auto px-4">
          <div className="max-w-4xl mx-auto text-center">
            <h1 className="text-4xl md:text-5xl font-bold mb-6">Our Impact</h1>
            <p className="text-xl text-gray-200 mb-8 leading-relaxed">
              Through dedicated effort and your support, we're creating lasting positive
              change in communities across India.
            </p>
          </div>
        </div>
      </section>

      {/* Impact Stats */}
      <section className="py-16 bg-black">
        <div className="container mx-auto px-4">
          <div className="grid md:grid-cols-4 gap-8">
            {impactStats.map((stat, index) => (
              <div key={index} className="bg-[#111827] rounded-xl p-8 text-center transform transition-all duration-300 hover:scale-[1.02]">
                <stat.icon className="h-12 w-12 text-[#FFD700] mx-auto mb-4" />
                <div className="text-4xl font-bold text-[#FFD700] mb-2">{stat.number}</div>
                <div className="text-xl font-semibold text-white mb-3">{stat.label}</div>
                <p className="text-gray-200">{stat.description}</p>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* Success Stories */}
      <section className="py-16 bg-[#0A0F1A]">
        <div className="container mx-auto px-4">
          <h2 className="text-3xl font-bold mb-12 text-center text-white">Success Stories</h2>
          <div className="grid md:grid-cols-3 gap-8">
            {successStories.map((story, index) => (
              <div key={index} className="bg-[#111827] rounded-xl overflow-hidden transform transition-all duration-300 hover:scale-[1.02]">
                <img 
                  src={story.image} 
                  alt={story.name} 
                  className="w-full h-48 object-cover"
                />
                <div className="p-6">
                  <h3 className="text-xl font-bold text-white mb-2">{story.name}</h3>
                  <p className="text-[#FFD700] text-sm mb-4">{story.location}</p>
                  <p className="text-gray-200 mb-4">{story.description}</p>
                  <div className="bg-black/30 p-3 rounded-lg">
                    <p className="text-[#FFD700] font-semibold">{story.achievement}</p>
                  </div>
                </div>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* Annual Reports */}
      <section className="py-16 bg-black">
        <div className="container mx-auto px-4">
          <div className="max-w-4xl mx-auto text-center">
            <h2 className="text-3xl font-bold mb-6 text-white">Transparency</h2>
            <p className="text-xl text-gray-200 mb-8">
              We maintain complete transparency in our operations and fund utilization.
              View our annual reports to learn more about our impact.
            </p>
            <div className="grid md:grid-cols-3 gap-6">
              <div className="bg-[#111827] p-6 rounded-xl">
                <h3 className="text-[#FFD700] font-bold mb-2">2024-25</h3>
                <p className="text-gray-200 mb-4">Annual Impact Report</p>
                <Button variant="outline" className="w-full border-[#FFD700] text-[#FFD700] hover:bg-[#FFD700] hover:text-black">
                  Download PDF
                </Button>
              </div>
              <div className="bg-[#111827] p-6 rounded-xl">
                <h3 className="text-[#FFD700] font-bold mb-2">2023-24</h3>
                <p className="text-gray-200 mb-4">Annual Impact Report</p>
                <Button variant="outline" className="w-full border-[#FFD700] text-[#FFD700] hover:bg-[#FFD700] hover:text-black">
                  Download PDF
                </Button>
              </div>
              <div className="bg-[#111827] p-6 rounded-xl">
                <h3 className="text-[#FFD700] font-bold mb-2">2022-23</h3>
                <p className="text-gray-200 mb-4">Annual Impact Report</p>
                <Button variant="outline" className="w-full border-[#FFD700] text-[#FFD700] hover:bg-[#FFD700] hover:text-black">
                  Download PDF
                </Button>
              </div>
            </div>
          </div>
        </div>
      </section>

      {/* CTA Section */}
      <section className="py-16 bg-[#0A0F1A] text-white">
        <div className="container mx-auto px-4 text-center">
          <h2 className="text-3xl font-bold mb-6">Help Us Create More Impact</h2>
          <p className="text-xl text-gray-200 mb-8 max-w-2xl mx-auto">
            Your support enables us to reach more communities and create lasting change.
            Join us in our mission.
          </p>
          <div className="flex justify-center gap-4">
            <Button asChild size="lg" className="bg-[#FFD700] text-black hover:bg-[#E5C100]">
              <Link to="/donate">Make a Donation</Link>
            </Button>
            <Button asChild size="lg" variant="outline" className="border-[#FFD700] text-[#FFD700] hover:bg-[#FFD700] hover:text-black">
              <Link to="/volunteer">Volunteer With Us</Link>
            </Button>
          </div>
        </div>
      </section>

      <Footer />
    </div>
  );
};

export default ImpactPage;
