import Header from "../components/Header";
import Footer from "../components/Footer";
import MultistepDonation from "../components/MultistepDonation";
import { ArrowRight, Smile, Heart, Award, HeartHandshake } from "lucide-react";

const DonatePage = () => {
  return (
    <div className="min-h-screen bg-gray-50">
      <Header />
        {/* Hero Section */}
      <section className="py-16 bg-white text-prachetas-black">
        <div className="container mx-auto px-4">
          <div className="max-w-3xl mx-auto text-center mb-12">
            <h1 className="text-4xl md:text-5xl font-bold mb-4">Support Our Mission</h1>
            <p className="text-lg text-prachetas-medium-gray mb-6">
              Your generous donation helps us create lasting change in the lives of those who need it most.
            </p>
            <div className="flex flex-wrap justify-center gap-4 items-center">
              <div className="flex items-center">
                <Heart className="text-prachetas-yellow h-6 w-6 mr-2" />
                <span className="text-prachetas-medium-gray">Tax Benefits</span>
              </div>
              <div className="flex items-center">
                <Award className="text-prachetas-yellow h-6 w-6 mr-2" />
                <span className="text-prachetas-medium-gray">100% Transparency</span>
              </div>
              <div className="flex items-center">
                <HeartHandshake className="text-prachetas-yellow h-6 w-6 mr-2" />
                <span className="text-prachetas-medium-gray">Direct Impact</span>
              </div>
            </div>
          </div>
            {/* Donation Benefits */}
          <div className="grid md:grid-cols-3 gap-8 mb-16">
            <div className="bg-gray-50 p-8 rounded-xl shadow-md border border-gray-200 hover:shadow-lg transition-all duration-300">
              <h3 className="text-2xl font-bold mb-4 text-prachetas-black flex items-center">
                <Award className="h-6 w-6 mr-3 text-prachetas-yellow" />
                Transparency
              </h3>
              <p className="text-prachetas-medium-gray text-lg leading-relaxed mb-6">
                We are committed to financial transparency. View our annual reports to see how funds are utilized.
                All our financial statements are publicly available.
              </p>
              <a href="#" className="text-prachetas-yellow mt-4 inline-flex items-center hover:text-yellow-600 transition-colors text-base font-medium group">
                View our reports <ArrowRight className="h-4 w-4 ml-2 transform group-hover:translate-x-1 transition-transform" />
              </a>
            </div>
            <div className="bg-gray-50 p-8 rounded-xl shadow-md border border-gray-200 hover:shadow-lg transition-all duration-300">
              <h3 className="text-2xl font-bold mb-4 text-prachetas-black flex items-center">
                <Heart className="h-6 w-6 mr-3 text-prachetas-yellow" />
                Tax Benefits
              </h3>
              <p className="text-prachetas-medium-gray text-lg leading-relaxed mb-6">
                All donations are eligible for tax exemption under Section 80G of the Income Tax Act.
                You'll receive an official receipt for tax purposes immediately after donation.
              </p>
              <button className="text-prachetas-yellow mt-4 inline-flex items-center hover:text-yellow-600 transition-colors text-base font-medium group">
                Learn about tax benefits <ArrowRight className="h-4 w-4 ml-2 transform group-hover:translate-x-1 transition-transform" />
              </button>
            </div>
            <div className="bg-gray-50 p-8 rounded-xl shadow-md border border-gray-200 hover:shadow-lg transition-all duration-300">
              <h3 className="text-2xl font-bold mb-4 text-prachetas-black flex items-center">
                <Smile className="h-6 w-6 mr-3 text-prachetas-yellow" />
                Impact
              </h3>
              <p className="text-prachetas-medium-gray text-lg leading-relaxed mb-6">
                Your contribution directly impacts the lives of those in need, creating lasting positive change.
                We send regular updates on how your donations are making a difference.
              </p>
              <button className="text-prachetas-yellow mt-4 inline-flex items-center hover:text-yellow-600 transition-colors text-base font-medium group">
                View impact stories <ArrowRight className="h-4 w-4 ml-2 transform group-hover:translate-x-1 transition-transform" />
              </button>
            </div>
          </div>          {/* How Your Donation Helps */}
          <div className="max-w-4xl mx-auto my-16 text-center">
            <h2 className="text-4xl font-bold mb-12 text-center text-prachetas-black">How Your Donation Helps</h2>
            <div className="grid md:grid-cols-3 gap-8 text-center">
              <div className="bg-gray-50 p-8 rounded-xl shadow-md border border-gray-200 hover:shadow-lg transition-all duration-300 transform hover:-translate-y-1">
                <div className="text-5xl font-bold text-prachetas-yellow mb-4">₹1000</div>
                <p className="text-prachetas-medium-gray text-lg">Supplies educational materials for two students</p>
              </div>
              <div className="bg-gray-50 p-8 rounded-xl shadow-md border border-gray-200 hover:shadow-lg transition-all duration-300 transform hover:-translate-y-1">
                <div className="text-5xl font-bold text-prachetas-yellow mb-4">₹2500</div>
                <p className="text-prachetas-medium-gray text-lg">Funds a health checkup camp for an entire village</p>
              </div>
              <div className="bg-gray-50 p-8 rounded-xl shadow-md border border-gray-200 hover:shadow-lg transition-all duration-300 transform hover:-translate-y-1">
                <div className="text-5xl font-bold text-prachetas-yellow mb-4">₹5000</div>
                <p className="text-prachetas-medium-gray text-lg">Supports vocational training for unemployed youth</p>
              </div>
            </div>
          </div>
        </div>
      </section>
      
      {/* Donation Form Section */}
      <MultistepDonation />      {/* FAQ Section */}      <section className="py-16 bg-gray-100 text-prachetas-black">
        <div className="container mx-auto px-4">
          <h2 className="text-3xl font-bold mb-12 text-center text-prachetas-black">Frequently Asked Questions</h2><div className="max-w-4xl mx-auto space-y-6">
                        <div className="bg-white p-8 rounded-lg transform transition-transform duration-300 hover:scale-[1.01] shadow-md border border-gray-200">
              <h3 className="text-2xl font-semibold mb-4 text-prachetas-black">Is my donation tax-deductible?</h3>
              <p className="text-prachetas-medium-gray text-lg leading-relaxed">
                Yes! All donations to our registered trust are eligible for tax deduction under Section 80G of the Income Tax Act.
                You'll receive an immediate receipt for tax purposes.
              </p>
            </div>
            <div className="bg-white p-8 rounded-lg transform transition-transform duration-300 hover:scale-[1.01] shadow-md border border-gray-200">
              <h3 className="text-2xl font-semibold mb-4 text-prachetas-black">How is my donation used?</h3>
              <p className="text-prachetas-medium-gray text-lg leading-relaxed">
                100% of your donation goes directly to our programs. Administrative costs are covered separately through 
                dedicated fundraising efforts and grants.
              </p>
            </div>
            <div className="bg-white p-8 rounded-lg transform transition-transform duration-300 hover:scale-[1.01] shadow-md border border-gray-200">
              <h3 className="text-2xl font-semibold mb-4 text-prachetas-black">Can I set up a recurring donation?</h3>
              <p className="text-prachetas-medium-gray text-lg leading-relaxed">
                Absolutely! Monthly recurring donations provide sustainable support and can be set up through our secure donation form.
                You can modify or cancel anytime.
              </p>
            </div>
            <div className="bg-white p-8 rounded-lg transform transition-transform duration-300 hover:scale-[1.01] shadow-md border border-gray-200">
              <h3 className="text-2xl font-semibold mb-4 text-prachetas-black">Will I receive updates on how my donation is used?</h3>
              <p className="text-prachetas-medium-gray text-lg leading-relaxed">
                Yes! We send quarterly impact reports showing exactly how donations are being used and the difference they're making
                in our community programs.
              </p>
            </div>
            <div className="bg-prachetas-black p-8 rounded-lg transform transition-transform duration-300 hover:scale-[1.01]">
              <h3 className="text-2xl font-semibold mb-4 text-white">Can I make a donation in someone's memory?</h3>
              <p className="text-gray-200 text-lg leading-relaxed">
                Yes, you can dedicate your donation in memory or honor of someone special. Simply include their name in the message field of the donation form.
              </p>
            </div>
            <div className="bg-prachetas-black p-8 rounded-lg transform transition-transform duration-300 hover:scale-[1.01]">
              <h3 className="text-2xl font-semibold mb-4 text-white">How will my donation be used?</h3>
              <p className="text-gray-200 text-lg leading-relaxed">
                Your donation directly supports our programs in education, healthcare, livelihood, and community development. We maintain full transparency about fund allocation.
              </p>
            </div>
            <div className="bg-prachetas-black p-8 rounded-lg transform transition-transform duration-300 hover:scale-[1.01]">
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
