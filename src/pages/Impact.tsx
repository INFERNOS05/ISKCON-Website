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
    <div className="min-h-screen bg-gray-50">
      <Header />
      
      {/* Hero Section */}
      <section className="relative py-20 bg-white text-prachetas-black">
        <div className="container mx-auto px-4">
          <div className="max-w-4xl mx-auto text-center">
            <h1 className="text-4xl md:text-5xl font-bold mb-6">Our Impact</h1>
            <p className="text-xl text-prachetas-medium-gray mb-8 leading-relaxed">
              See how we're creating measurable change in communities and transforming lives
              through our dedicated programs and initiatives.
            </p>
          </div>
        </div>
      </section>

      {/* Impact Stats */}
      <section className="py-16 bg-gray-50">
        <div className="container mx-auto px-4">
          <div className="max-w-3xl mx-auto text-center mb-12">
            <h2 className="text-3xl font-bold mb-4 text-prachetas-black">Numbers That Matter</h2>
            <p className="text-prachetas-medium-gray text-lg">
              Measurable impact through dedicated service and community engagement
            </p>
          </div>
          <div className="grid md:grid-cols-4 gap-8">
            {impactStats.map((stat, index) => (
              <div key={`${stat.label}-${index}`} className="bg-white rounded-xl p-8 text-center transform transition-all duration-300 hover:scale-[1.02] shadow-md border border-gray-200">
                <stat.icon className="h-12 w-12 text-prachetas-yellow mx-auto mb-4" />
                <div className="text-4xl font-bold text-prachetas-black mb-2">{stat.number}</div>
                <div className="text-xl font-semibold text-prachetas-yellow mb-3">{stat.label}</div>
                <p className="text-prachetas-medium-gray">{stat.description}</p>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* Success Stories */}
      <section className="py-16 bg-white">
        <div className="container mx-auto px-4">
          <div className="max-w-3xl mx-auto text-center mb-12">
            <h2 className="text-3xl font-bold mb-4 text-prachetas-black">Success Stories</h2>
            <p className="text-prachetas-medium-gray text-lg">
              Real stories of transformation and hope from the communities we serve
            </p>
          </div>
          <div className="grid md:grid-cols-3 gap-8">
            {successStories.map((story, index) => (
              <div key={`${story.name}-${index}`} className="bg-gray-50 rounded-xl overflow-hidden transform transition-all duration-300 hover:scale-[1.02] shadow-md">
                <img 
                  src={story.image} 
                  alt={story.name} 
                  className="w-full h-48 object-cover"
                />
                <div className="p-6">
                  <h3 className="text-xl font-bold text-prachetas-black mb-2">{story.name}</h3>
                  <p className="text-prachetas-yellow text-sm mb-4 font-medium">{story.location}</p>
                  <p className="text-prachetas-medium-gray mb-4">{story.description}</p>
                  <div className="bg-gray-100 p-3 rounded-lg">
                    <p className="text-prachetas-black font-semibold">{story.achievement}</p>
                  </div>
                </div>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* Annual Reports */}
      <section className="py-16 bg-gray-50">
        <div className="container mx-auto px-4">
          <div className="max-w-4xl mx-auto text-center">
            <h2 className="text-3xl font-bold mb-6 text-prachetas-black">Transparency</h2>
            <p className="text-xl text-prachetas-medium-gray mb-8">
              We maintain complete transparency in our operations and fund utilization.
              View our annual reports to learn more about our impact.
            </p>
            <div className="grid md:grid-cols-3 gap-6">
              <div className="bg-white p-6 rounded-xl shadow-md border border-gray-200">
                <h3 className="text-prachetas-yellow font-bold mb-2 text-lg">2024-25</h3>
                <p className="text-prachetas-medium-gray mb-4">Annual Impact Report</p>
                <Button variant="outline" className="w-full border-prachetas-yellow text-prachetas-yellow hover:bg-prachetas-yellow hover:text-prachetas-black">
                  Download PDF
                </Button>
              </div>
              <div className="bg-white p-6 rounded-xl shadow-md border border-gray-200">
                <h3 className="text-prachetas-yellow font-bold mb-2 text-lg">2023-24</h3>
                <p className="text-prachetas-medium-gray mb-4">Annual Impact Report</p>
                <Button variant="outline" className="w-full border-prachetas-yellow text-prachetas-yellow hover:bg-prachetas-yellow hover:text-prachetas-black">
                  Download PDF
                </Button>
              </div>
              <div className="bg-white p-6 rounded-xl shadow-md border border-gray-200">
                <h3 className="text-prachetas-yellow font-bold mb-2 text-lg">2022-23</h3>
                <p className="text-prachetas-medium-gray mb-4">Annual Impact Report</p>
                <Button variant="outline" className="w-full border-prachetas-yellow text-prachetas-yellow hover:bg-prachetas-yellow hover:text-prachetas-black">
                  Download PDF
                </Button>
              </div>
            </div>
          </div>
        </div>
      </section>

      {/* CTA Section */}
      <section className="py-16 bg-prachetas-black text-white">
        <div className="container mx-auto px-4 text-center">
          <h2 className="text-3xl font-bold mb-6 text-prachetas-yellow">Help Us Create More Impact</h2>
          <p className="text-xl text-gray-300 mb-8 max-w-2xl mx-auto">
            Your support enables us to reach more communities and create lasting change.
            Join us in our mission.
          </p>
          <div className="flex justify-center gap-4">
            <Button asChild size="lg" className="bg-prachetas-yellow text-prachetas-black hover:bg-prachetas-bright-yellow">
              <Link to="/donate">Make a Donation</Link>
            </Button>
            <Button asChild size="lg" variant="outline" className="border-prachetas-yellow text-prachetas-yellow hover:bg-prachetas-yellow hover:text-prachetas-black">
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
