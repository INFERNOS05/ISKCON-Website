import Header from "../components/Header";
import Footer from "../components/Footer";
import MultistepDonation from "../components/MultistepDonation";
import { ArrowRight, Smile, Heart, Award, HeartHandshake } from "lucide-react";

const DonatePage = () => {
  return (
    <div className="min-h-screen bg-black">
      <Header />
        {/* Hero Section */}
      <section className="py-16 bg-gradient-to-b from-black to-gray-900 text-white border-b border-gray-800">
        <div className="container mx-auto px-4">
          <div className="max-w-3xl mx-auto text-center mb-12">
            <h1 className="text-4xl md:text-5xl font-bold mb-4 bg-clip-text text-transparent bg-gradient-to-r from-yellow-400 to-orange-500">Support Our Mission</h1>
            <p className="text-lg text-gray-300 mb-6">
              Your generous donation helps us create lasting change in the lives of those who need it most.
            </p>
            <div className="flex flex-wrap justify-center gap-4 items-center">
              <div className="flex items-center">
                <Heart className="text-yellow-400 h-6 w-6 mr-2" />
                <span>Tax Benefits</span>
              </div>
              <div className="flex items-center">
                <Award className="text-yellow-400 h-6 w-6 mr-2" />
                <span>100% Transparency</span>
              </div>
              <div className="flex items-center">
                <HeartHandshake className="text-yellow-400 h-6 w-6 mr-2" />
                <span>Direct Impact</span>
              </div>
            </div>
          </div>
            {/* Donation Benefits */}
          <div className="grid md:grid-cols-3 gap-8 mb-16">
            <div className="bg-[#111] p-8 rounded-xl border border-[#222] hover:border-[#FFD700] transition-all duration-300">
              <h3 className="text-2xl font-bold mb-4 text-[#FFD700] flex items-center">
                <Award className="h-6 w-6 mr-3" />
                Transparency
              </h3>
              <p className="text-gray-100 text-lg leading-relaxed mb-6">
                We are committed to financial transparency. View our annual reports to see how funds are utilized.
                All our financial statements are publicly available.
              </p>
              <a href="#" className="text-[#FFD700] mt-4 inline-flex items-center hover:text-orange-400 transition-colors text-base font-medium group">
                View our reports <ArrowRight className="h-4 w-4 ml-2 transform group-hover:translate-x-1 transition-transform" />
              </a>
            </div>
            <div className="bg-[#111] p-8 rounded-xl border border-[#222] hover:border-[#FFD700] transition-all duration-300">
              <h3 className="text-2xl font-bold mb-4 text-[#FFD700] flex items-center">
                <Heart className="h-6 w-6 mr-3" />
                Tax Benefits
              </h3>
              <p className="text-gray-100 text-lg leading-relaxed mb-6">
                All donations are eligible for tax exemption under Section 80G of the Income Tax Act.
                You'll receive an official receipt for tax purposes immediately after donation.
              </p>
              <a href="#" className="text-[#FFD700] mt-4 inline-flex items-center hover:text-orange-400 transition-colors text-base font-medium group">
                Learn about tax benefits <ArrowRight className="h-4 w-4 ml-2 transform group-hover:translate-x-1 transition-transform" />
              </a>
            </div>
            <div className="bg-[#111] p-8 rounded-xl border border-[#222] hover:border-[#FFD700] transition-all duration-300">
              <h3 className="text-2xl font-bold mb-4 text-[#FFD700] flex items-center">
                <Smile className="h-6 w-6 mr-3" />
                Impact
              </h3>
              <p className="text-gray-100 text-lg leading-relaxed mb-6">
                Your contribution directly impacts the lives of those in need, creating lasting positive change.
                We send regular updates on how your donations are making a difference.
              </p>
              <a href="#" className="text-[#FFD700] mt-4 inline-flex items-center hover:text-orange-400 transition-colors text-base font-medium group">
                View impact stories <ArrowRight className="h-4 w-4 ml-2 transform group-hover:translate-x-1 transition-transform" />
              </a>
            </div>
          </div>          {/* How Your Donation Helps */}
          <div className="max-w-4xl mx-auto my-16 text-center">
            <h2 className="text-4xl font-bold mb-12 text-center text-[#FFD700]">How Your Donation Helps</h2>
            <div className="grid md:grid-cols-3 gap-8 text-center">
              <div className="bg-[#111] p-8 rounded-xl border border-[#222] hover:border-[#FFD700] transition-all duration-300 transform hover:-translate-y-1">
                <div className="text-5xl font-bold text-[#FFD700] mb-4">₹1000</div>
                <p className="text-gray-100 text-lg">Supplies educational materials for two students</p>
              </div>
              <div className="bg-[#111] p-8 rounded-xl border border-[#222] hover:border-[#FFD700] transition-all duration-300 transform hover:-translate-y-1">
                <div className="text-5xl font-bold text-[#FFD700] mb-4">₹2500</div>
                <p className="text-gray-100 text-lg">Funds a health checkup camp for an entire village</p>
              </div>
              <div className="bg-[#111] p-8 rounded-xl border border-[#222] hover:border-[#FFD700] transition-all duration-300 transform hover:-translate-y-1">
                <div className="text-5xl font-bold text-[#FFD700] mb-4">₹5000</div>
                <p className="text-gray-100 text-lg">Supports vocational training for unemployed youth</p>
              </div>
            </div>
          </div>
        </div>
      </section>
      
      {/* Donation Form Section */}
      <MultistepDonation />      {/* FAQ Section */}      <section className="py-16 bg-[#0A0F1A] text-white">
        <div className="container mx-auto px-4">
          <h2 className="text-3xl font-bold mb-12 text-center text-white">Frequently Asked Questions</h2><div className="max-w-4xl mx-auto space-y-6">
            <div className="bg-[#111827] p-8 rounded-lg transform transition-transform duration-300 hover:scale-[1.01]">
              <h3 className="text-2xl font-semibold mb-4 text-white">Is my donation tax-deductible?</h3>
              <p className="text-gray-200 text-lg leading-relaxed">
                Yes, PRACHETAS FOUNDATION is a registered non-profit organization, and all donations are eligible for tax deduction under Section 80G of the Income Tax Act.
              </p>
            </div>
            <div className="bg-[#111827] p-8 rounded-lg transform transition-transform duration-300 hover:scale-[1.01]">
              <h3 className="text-2xl font-semibold mb-4 text-white">Can I make a donation in someone's memory?</h3>
              <p className="text-gray-200 text-lg leading-relaxed">
                Yes, you can dedicate your donation in memory or honor of someone special. Simply include their name in the message field of the donation form.
              </p>
            </div>
            <div className="bg-[#111827] p-8 rounded-lg transform transition-transform duration-300 hover:scale-[1.01]">
              <h3 className="text-2xl font-semibold mb-4 text-white">How will my donation be used?</h3>
              <p className="text-gray-200 text-lg leading-relaxed">
                Your donation directly supports our programs in education, healthcare, livelihood, and community development. We maintain full transparency about fund allocation.
              </p>
            </div>
            <div className="bg-[#111827] p-8 rounded-lg transform transition-transform duration-300 hover:scale-[1.01]">
              <h3 className="text-2xl font-semibold mb-4 text-white">How can I cancel my monthly donation?</h3>
              <p className="text-gray-200 text-lg leading-relaxed">
                You can cancel your monthly donation at any time by contacting our donor support team at prachetasfoundation@gmail.com or by calling the number at the bottom of this page.
              </p>
            </div>
          </div>
        </div>
      </section>
      
      <Footer />
    </div>
  );
};

export default DonatePage;
