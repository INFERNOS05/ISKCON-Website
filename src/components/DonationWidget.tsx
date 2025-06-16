import { Button } from "@/components/ui/button";
import { AlertCircle, Heart } from "lucide-react";
import { useState } from "react";
import { useNavigate } from "react-router-dom";

const DonationWidget = () => {
  const [amount, setAmount] = useState<string>("1000");
  const [error, setError] = useState<string | null>(null);
  const navigate = useNavigate();
  
  const predefinedAmounts = ["500", "1000", "2500", "5000"];

  const handleAmountClick = (value: string) => {
    setAmount(value);
    setError(null);
  };

  const handleAmountChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const value = e.target.value;
    setAmount(value);
    
    if (value && (isNaN(Number(value)) || Number(value) <= 0)) {
      setError("Please enter a valid amount");
    } else {
      setError(null);
    }
  };

  const handleDonate = () => {
    // Validate amount before navigating
    if (!amount || isNaN(Number(amount)) || Number(amount) <= 0) {
      setError("Please enter a valid amount");
      return;
    }
    
    // Navigate to donation page with amount pre-selected
    navigate(`/donate?amount=${amount}`);
  };

  const formatAmount = (value: string) => {
    const numValue = parseFloat(value);
    if (isNaN(numValue)) return "₹0";
    return `₹${numValue}`;
  };

  return (
    <div className="bg-gray-900 border-t-4 border-amber-400 p-6 shadow-lg">
      <div className="flex items-center justify-center mb-6">
        <Heart className="h-6 w-6 text-amber-400 mr-2" />
        <h3 className="text-xl font-bold text-white">Support Our Cause</h3>
      </div>
      
      <p className="text-gray-300 text-sm mb-6 text-center">
        Your donation helps transform lives and build stronger communities.
      </p>
      
      <div className="grid grid-cols-4 gap-2 mb-6">
        {predefinedAmounts.map((value) => (
          <button
            key={value}
            onClick={() => handleAmountClick(value)}
            className={`py-2 px-2 border-2 rounded-none ${
              amount === value
                ? "border-amber-400 bg-amber-400/10 text-amber-400"
                : "border-gray-700 text-gray-300 hover:border-amber-400/50"
            }`}
          >
            ₹{value}
          </button>
        ))}
      </div>
      
      <div className="relative mb-2">
        <div className="absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-400">₹</div>
        <input
          type="number"
          value={amount}
          onChange={handleAmountChange}
          className={`w-full pl-10 py-2 bg-gray-800 border ${error ? "border-red-400" : "border-gray-700"} rounded-none focus:border-amber-400 text-white`}
          min="1"
          placeholder="Custom amount"
        />
      </div>

      {error && (
        <p className="text-red-400 text-xs mb-4 flex items-center">
          <AlertCircle className="h-3 w-3 mr-1" />
          {error}
        </p>
      )}
      
      <Button 
        onClick={handleDonate}
        className="w-full bg-amber-400 hover:bg-amber-500 text-black font-medium py-2 rounded-none"
      >
        Donate {amount ? formatAmount(amount) : "Now"}
      </Button>
      
      <p className="text-xs text-center text-gray-400 mt-4">
        Secure payment processing. Tax deductible.
      </p>
    </div>
  );
};

export default DonationWidget;
