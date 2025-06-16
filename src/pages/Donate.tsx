import Header from "@/components/Header";
import Footer from "@/components/Footer";
import DonationForm from "@/components/DonationForm";
import { ArrowRight, Smile, Heart, Award, HeartHandshake } from "lucide-react";

const DonatePage = () => {
  return (
    <div className="min-h-screen bg-black">
      <Header />
      
      {/* Hero Section */}
      <section className="py-16 bg-black text-white border-b border-gray-800">
        <div className="container mx-auto px-4">
          <div className="max-w-3xl mx-auto text-center mb-12">
            <h1 className="text-4xl md:text-5xl font-bold mb-4">Support Our Mission</h1>
            <p className="text-lg text-gray-300 mb-6">
              Your generous donation helps us create lasting change in the lives of those who need it most.
            </p>
            <div className="flex flex-wrap justify-center gap-4 items-center">
              <div className="flex items-center">
                <Heart className="text-amber-400 h-6 w-6 mr-2" />
                <span>Tax Benefits</span>
              </div>
              <div className="flex items-center">
                <Award className="text-amber-400 h-6 w-6 mr-2" />
                <span>100% Transparency</span>
              </div>
              <div className="flex items-center">
                <HeartHandshake className="text-amber-400 h-6 w-6 mr-2" />
                <span>Direct Impact</span>
              </div>
            </div>
          </div>
          
          {/* Donation Benefits */}
          <div className="grid md:grid-cols-3 gap-8 mb-16">
            <div className="bg-gray-900 p-6 border-t-2 border-amber-400 hover:shadow-lg transition-shadow">
              <h3 className="text-xl font-bold mb-3 text-amber-400 flex items-center">
                <Award className="h-5 w-5 mr-2" />
                Transparency
              </h3>
              <p className="text-gray-300">
                We are committed to financial transparency. View our annual reports to see how funds are utilized.
                All our financial statements are publicly available.
              </p>
              <a href="#" className="text-amber-400 mt-4 inline-flex items-center hover:underline text-sm">
                View our reports <ArrowRight className="h-4 w-4 ml-1" />
              </a>
            </div>
            <div className="bg-gray-900 p-6 border-t-2 border-amber-400 hover:shadow-lg transition-shadow">
              <h3 className="text-xl font-bold mb-3 text-amber-400 flex items-center">
                <Heart className="h-5 w-5 mr-2" />
                Tax Benefits
              </h3>
              <p className="text-gray-300">
                All donations are eligible for tax exemption under Section 80G of the Income Tax Act.
                You'll receive an official receipt for tax purposes immediately after donation.
              </p>
              <a href="#" className="text-amber-400 mt-4 inline-flex items-center hover:underline text-sm">
                Learn about tax benefits <ArrowRight className="h-4 w-4 ml-1" />
              </a>
            </div>
            <div className="bg-gray-900 p-6 border-t-2 border-amber-400 hover:shadow-lg transition-shadow">
              <h3 className="text-xl font-bold mb-3 text-amber-400 flex items-center">
                <Smile className="h-5 w-5 mr-2" />
                Impact
              </h3>
              <p className="text-gray-300">
                Your contribution directly impacts the lives of those in need, creating lasting positive change.
                We send regular updates on how your donations are making a difference.
              </p>
              <a href="#" className="text-amber-400 mt-4 inline-flex items-center hover:underline text-sm">
                View impact stories <ArrowRight className="h-4 w-4 ml-1" />
              </a>
            </div>
          </div>
          
          {/* How Your Donation Helps */}
          <div className="max-w-4xl mx-auto my-16 text-center">
            <h2 className="text-3xl font-bold mb-10 text-center">How Your Donation Helps</h2>
            <div className="grid md:grid-cols-4 gap-8 text-center">
              <div>
                <div className="text-4xl font-bold text-amber-400 mb-2">₹500</div>
                <p className="text-gray-300">Provides meals for one child for a month</p>
              </div>
              <div>
                <div className="text-4xl font-bold text-amber-400 mb-2">₹1000</div>
                <p className="text-gray-300">Supplies educational materials for two students</p>
              </div>
              <div>
                <div className="text-4xl font-bold text-amber-400 mb-2">₹2500</div>
                <p className="text-gray-300">Funds a health checkup camp for an entire village</p>
              </div>
              <div>
                <div className="text-4xl font-bold text-amber-400 mb-2">₹5000</div>
                <p className="text-gray-300">Supports vocational training for unemployed youth</p>
              </div>
            </div>
          </div>
        </div>
      </section>
      
      {/* Donation Form Section */}
      <DonationForm />
      
      {/* FAQ Section */}
      <section className="py-16 bg-black text-white">
        <div className="container mx-auto px-4">
          <h2 className="text-3xl font-bold mb-10 text-center">Frequently Asked Questions</h2>
          <div className="max-w-3xl mx-auto space-y-6">
            <div className="bg-gray-900 p-6">
              <h3 className="text-xl font-medium mb-2">Is my donation tax-deductible?</h3>
              <p className="text-gray-300">
                Yes, PRACHETAS FOUNDATION is a registered non-profit organization, and all donations are eligible for tax deduction under Section 80G of the Income Tax Act.
              </p>
            </div>
            <div className="bg-gray-900 p-6">
              <h3 className="text-xl font-medium mb-2">Can I make a donation in someone's memory?</h3>
              <p className="text-gray-300">
                Yes, you can dedicate your donation in memory or honor of someone special. Simply include their name in the message field of the donation form.
              </p>
            </div>
            <div className="bg-gray-900 p-6">
              <h3 className="text-xl font-medium mb-2">How will my donation be used?</h3>
              <p className="text-gray-300">
                Your donation directly supports our programs in education, healthcare, livelihood, and community development. We maintain full transparency about fund allocation.
              </p>
            </div>
            <div className="bg-gray-900 p-6">
              <h3 className="text-xl font-medium mb-2">How can I cancel my monthly donation?</h3>
              <p className="text-gray-300">
                You can cancel your monthly donation at any time by contacting our donor support team at support@prachetasfoundation.org or by calling the number at the bottom of this page.
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
