import { Button } from "@/components/ui/button";
import DonationWidget from "./DonationWidget";
import { ArrowRight } from "lucide-react";
import { Link } from "react-router-dom";

const DonateSection = () => {
  return (
    <section id="donate" className="py-20 bg-black text-white">
      <div className="container mx-auto px-4">
        <div className="grid md:grid-cols-2 gap-12 items-center">
          <div>
            <h2 className="text-3xl md:text-4xl font-bold mb-6">
              Support Our <span className="text-amber-400">Mission</span>
            </h2>
            <p className="text-lg text-gray-300 mb-8">
              Your generous contributions allow us to continue our work in supporting underprivileged communities 
              and creating lasting change. Every donation, big or small, makes a significant impact.
            </p>
            <div className="space-y-6">
              <div className="flex items-start">
                <div className="h-10 w-10 rounded-full bg-amber-400 flex items-center justify-center flex-shrink-0 mr-4">
                  <span className="font-bold text-black">01</span>
                </div>
                <div>
                  <h3 className="text-xl font-semibold mb-2">Transparent Use of Funds</h3>
                  <p className="text-gray-300">
                    We ensure complete transparency in how your donations are utilized, with regular impact reports.
                  </p>
                </div>
              </div>
              
              <div className="flex items-start">
                <div className="h-10 w-10 rounded-full bg-amber-400 flex items-center justify-center flex-shrink-0 mr-4">
                  <span className="font-bold text-black">02</span>
                </div>
                <div>
                  <h3 className="text-xl font-semibold mb-2">Tax Benefits</h3>
                  <p className="text-gray-300">
                    All donations are eligible for tax exemption under Section 80G of the Income Tax Act.
                  </p>
                </div>
              </div>
              
              <div className="flex items-start">
                <div className="h-10 w-10 rounded-full bg-amber-400 flex items-center justify-center flex-shrink-0 mr-4">
                  <span className="font-bold text-black">03</span>
                </div>
                <div>
                  <h3 className="text-xl font-semibold mb-2">Measurable Impact</h3>
                  <p className="text-gray-300">
                    Your contribution directly helps improve lives, with real and measurable outcomes.
                  </p>
                </div>
              </div>
            </div>
            
            <div className="mt-10">
              <Button asChild className="bg-amber-400 hover:bg-amber-500 text-black font-medium py-3 px-8 rounded-none inline-flex items-center">
                <Link to="/donate">
                  Learn More About Donation Options
                  <ArrowRight className="ml-2 h-5 w-5" />
                </Link>
              </Button>
            </div>
          </div>
          
          <div>
            <DonationWidget />
          </div>
        </div>
      </div>
    </section>
  );
};

export default DonateSection;
