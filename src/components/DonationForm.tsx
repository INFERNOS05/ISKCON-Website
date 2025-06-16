import { useState, useEffect } from "react";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { Textarea } from "@/components/ui/textarea";
import { Switch } from "@/components/ui/switch";
import { Check, Heart, ArrowRight, AlertCircle, Shield } from "lucide-react";
import { useSearchParams } from "react-router-dom";
import { initializePayment, RazorpayResponse, verifyPayment } from "@/lib/razorpay";
import { processRazorpayResponse } from "@/lib/payment-service";
import { toast } from "@/components/ui/use-toast";

type DonorInfo = {
  firstName: string;
  lastName: string;
  email: string;
  phone: string;
  message: string;
}

type ValidationErrors = {
  firstName?: string;
  lastName?: string;
  email?: string;
  phone?: string;
  amount?: string;
}

type PaymentResponse = {
  id: string;
  orderId?: string;
  signature?: string;
  status: "success" | "failed" | "pending";
}

const DonationForm = () => {  const [searchParams] = useSearchParams();
  const [amount, setAmount] = useState<string>("1000");
  const [isMonthly, setIsMonthly] = useState<boolean>(false);
  const [formStep, setFormStep] = useState<number>(1);
  const [formSubmitted, setFormSubmitted] = useState<boolean>(false);
  const [isProcessing, setIsProcessing] = useState<boolean>(false);
  const [errors, setErrors] = useState<ValidationErrors>({});
  const [paymentResponse, setPaymentResponse] = useState<PaymentResponse | null>(null);

  const [donorInfo, setDonorInfo] = useState<DonorInfo>({
    firstName: "",
    lastName: "",
    email: "",
    phone: "",
    message: ""
  });

  const predefinedAmounts = ["500", "1000", "2500", "5000", "10000"];

  // Handle URL params for pre-filled amount
  useEffect(() => {
    const urlAmount = searchParams.get("amount");
    if (urlAmount && !isNaN(Number(urlAmount)) && Number(urlAmount) > 0) {
      setAmount(urlAmount);
    }
  }, [searchParams]);

  const handleAmountClick = (value: string) => {
    setAmount(value);
    setErrors({...errors, amount: undefined});
  };

  const handleCustomAmount = (e: React.ChangeEvent<HTMLInputElement>) => {
    const value = e.target.value;
    setAmount(value);
    if (!value || isNaN(Number(value)) || Number(value) <= 0) {
      setErrors({...errors, amount: "Please enter a valid amount"});
    } else {
      setErrors({...errors, amount: undefined});
    }
  };

  const handleDonorInfoChange = (e: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement>) => {
    const { name, value } = e.target;
    setDonorInfo({
      ...donorInfo,
      [name]: value
    });
    
    // Clear validation error when field is filled
    if (value) {
      setErrors({...errors, [name]: undefined});
    }
  };

  const validateStep1 = () => {
    const newErrors: ValidationErrors = {};
    
    if (!amount || isNaN(Number(amount)) || Number(amount) <= 0) {
      newErrors.amount = "Please enter a valid amount";
    }
    
    setErrors(newErrors);
    return Object.keys(newErrors).length === 0;
  };
  const validateStep2 = () => {
    const newErrors: ValidationErrors = {};
    
    if (!donorInfo.firstName.trim()) {
      newErrors.firstName = "First name is required";
    }
    
    if (!donorInfo.lastName.trim()) {
      newErrors.lastName = "Last name is required";
    }
    
    if (!donorInfo.email.trim()) {
      newErrors.email = "Email is required";
    } else if (!/\S+@\S+\.\S+/.test(donorInfo.email)) {
      newErrors.email = "Please enter a valid email";
    }

    if (donorInfo.phone && !/^\d{10}$/.test(donorInfo.phone.replace(/\D/g, ''))) {
      newErrors.phone = "Please enter a valid 10-digit phone number";
    }
    
    setErrors(newErrors);
    return Object.keys(newErrors).length === 0;
  };

  const nextStep = () => {
    if (formStep === 1 && validateStep1()) {
      setFormStep(formStep + 1);
    } else if (formStep === 2 && validateStep2()) {
      setFormStep(formStep + 1);
    }
  };

  const prevStep = () => {
    setFormStep(formStep - 1);
  };  const handlePaymentSuccess = async (response: RazorpayResponse) => {
    try {
      // Process the payment response with our payment service
      const verificationResult = await processRazorpayResponse(
        response, 
        parseFloat(amount), 
        {
          name: `${donorInfo.firstName} ${donorInfo.lastName}`,
          email: donorInfo.email,
          phone: donorInfo.phone
        }
      );
      
      if (verificationResult.success) {
        setPaymentResponse({
          id: response.razorpay_payment_id,
          orderId: response.razorpay_order_id,
          signature: response.razorpay_signature,
          status: "success"
        });
        setFormSubmitted(true);
        setIsProcessing(false);
        
        // Show success toast
        toast({
          title: "Payment Successful",
          description: `Thank you for your donation of ${formatAmount(amount)}.`,
        });
      } else {
        throw new Error(verificationResult.message || "Payment verification failed");
      }
    } catch (error) {
      console.error("Payment processing error:", error);
      setIsProcessing(false);
      
      toast({
        variant: "destructive",
        title: "Payment Failed",
        description: "There was an issue processing your payment. Please try again.",
      });
    }
  };

  const processRazorpayPayment = () => {
    setIsProcessing(true);
    
    const amountValue = parseFloat(amount);
    if (isNaN(amountValue) || amountValue <= 0) {
      setErrors({...errors, amount: "Please enter a valid amount"});
      setIsProcessing(false);
      return;
    }

    // Initialize Razorpay payment
    initializePayment({
      amount: amountValue,
      name: "PRACHETAS FOUNDATION",
      description: `Donation ${isMonthly ? "(Monthly)" : ""}`,
      prefill: {
        name: `${donorInfo.firstName} ${donorInfo.lastName}`,
        email: donorInfo.email,
        contact: donorInfo.phone
      },
      notes: {
        payment_for: "Donation",
        recurring: isMonthly ? "yes" : "no",
        donor_message: donorInfo.message || ""
      },
      theme: {
        color: "#F59E0B" // amber-500 color
      },
      handler: handlePaymentSuccess,
      onDismiss: () => {
        setIsProcessing(false);
        toast({
          title: "Payment Cancelled",
          description: "You have cancelled the payment process.",
        });
      }
    });
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    
    if (formStep === 2 && validateStep2()) {
      setFormStep(3);
      return;
    }
    
    if (formStep === 3) {
      processRazorpayPayment();
    }
  };

  const formatAmount = (value: string) => {
    const numValue = parseFloat(value);
    if (isNaN(numValue)) return "₹0";
    return new Intl.NumberFormat('en-IN', {
      style: 'currency',
      currency: 'INR',
      maximumFractionDigits: 0
    }).format(numValue);
  };

  const resetForm = () => {
    setFormSubmitted(false);
    setFormStep(1);
    setAmount("1000");
    setIsMonthly(false);
    setDonorInfo({
      firstName: "",
      lastName: "",
      email: "",
      phone: "",
      message: ""
    });
    setErrors({});
    setPaymentResponse(null);
  };

  return (
    <section className="py-16 bg-black text-white" id="donate">
      <div className="container mx-auto px-4">
        <div className="max-w-3xl mx-auto bg-gray-900 rounded-none p-8 border-t-4 border-amber-400">
          <div className="mb-8 text-center">            <h2 className="text-3xl font-bold mb-2">Make a Donation</h2>
            <p className="text-gray-300">
              Your contribution helps us make a difference in the lives of those in need.
            </p>
            {!formSubmitted && (
              <p className="text-amber-400 mt-2 text-sm">
                {formStep === 1 && "Step 1: Select Amount"}
                {formStep === 2 && "Step 2: Your Details"}
                {formStep === 3 && "Step 3: Review & Pay"}
              </p>
            )}{formStep > 1 && !formSubmitted && (
              <div className="flex justify-center mt-6">
                <div className="flex items-center w-full max-w-sm">
                  <div className="w-8 h-8 rounded-full bg-amber-400 text-black flex items-center justify-center">1</div>
                  <div className={`flex-1 h-1 mx-2 ${formStep > 1 ? "bg-amber-400" : "bg-gray-600"}`}></div>
                  <div className={`w-8 h-8 rounded-full flex items-center justify-center ${formStep > 1 ? "bg-amber-400 text-black" : "bg-gray-700 text-gray-400"}`}>2</div>
                  <div className={`flex-1 h-1 mx-2 ${formStep > 2 ? "bg-amber-400" : "bg-gray-600"}`}></div>
                  <div className={`w-8 h-8 rounded-full flex items-center justify-center ${formStep > 2 ? "bg-amber-400 text-black" : "bg-gray-700 text-gray-400"}`}>3</div>
                </div>
                <div className="hidden md:flex text-xs text-gray-400 absolute mt-10">
                  <div className="w-8 text-center">Amount</div>
                  <div className="flex-1"></div>
                  <div className="w-8 text-center">Details</div>
                  <div className="flex-1"></div>
                  <div className="w-8 text-center mr-1">Review</div>
                </div>
              </div>
            )}
          </div>

          {formSubmitted ? (
            <div className="text-center py-10">
              <div className="w-16 h-16 bg-amber-400 rounded-full flex items-center justify-center mx-auto mb-4">
                <Check className="h-8 w-8 text-black" />
              </div>
              <h3 className="text-2xl font-bold mb-2">Thank You for Your Donation!</h3>
              <p className="text-gray-300 mb-6">
                Your generosity makes our work possible. A receipt has been sent to {donorInfo.email}.
              </p>
              <div className="bg-gray-800 p-4 mb-6 mx-auto max-w-md">
                <div className="flex justify-between mb-2">
                  <span className="text-gray-400">Donation Amount:</span>
                  <span className="text-white font-medium">{formatAmount(amount)} {isMonthly ? "Monthly" : ""}</span>
                </div>
                <div className="flex justify-between mb-2">
                  <span className="text-gray-400">Donor Name:</span>
                  <span className="text-white">{donorInfo.firstName} {donorInfo.lastName}</span>
                </div>
                <div className="flex justify-between">
                  <span className="text-gray-400">Transaction ID:</span>
                  <span className="text-white">{paymentResponse?.id || "TXN" + Math.random().toString(36).substring(2, 10).toUpperCase()}</span>
                </div>
              </div>
              <Button 
                onClick={resetForm}
                className="bg-amber-400 hover:bg-amber-500 text-black font-medium rounded-none"
              >
                Make Another Donation
              </Button>
            </div>
          ) : (
            <form onSubmit={handleSubmit} className="space-y-6">
              {formStep === 1 && (
                <>
                  <div className="mb-8">
                    <Label htmlFor="amount" className="text-lg font-medium block mb-4">
                      Select Donation Amount
                    </Label>
                    <div className="grid grid-cols-2 md:grid-cols-5 gap-3 mb-4">
                      {predefinedAmounts.map((value) => (
                        <button
                          type="button"
                          key={value}
                          onClick={() => handleAmountClick(value)}
                          className={`py-3 px-4 border-2 rounded-none ${
                            amount === value
                              ? "border-amber-400 bg-amber-400/10 text-amber-400"
                              : "border-gray-600 hover:border-amber-400/50"
                          }`}
                        >
                          ₹{value}
                        </button>
                      ))}
                    </div>
                    <div className="mt-4">
                      <Label htmlFor="customAmount" className="text-sm mb-1 block">
                        Or enter a custom amount
                      </Label>
                      <div className="relative">
                        <div className="absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-400">₹</div>
                        <Input
                          id="customAmount"
                          name="amount"
                          type="number"
                          placeholder="Enter amount"
                          value={amount}
                          onChange={handleCustomAmount}
                          className="pl-10 bg-gray-800 border-gray-700 rounded-none focus:border-amber-400"
                          min="1"
                        />
                        {errors.amount && (
                          <p className="text-red-400 text-sm mt-1 flex items-center">
                            <AlertCircle className="h-4 w-4 mr-1" />
                            {errors.amount}
                          </p>
                        )}
                      </div>
                    </div>
                  </div>

                  <div className="mb-6">
                    <div className="flex items-center space-x-2 mb-2">
                      <Switch 
                        id="monthly-donation"
                        checked={isMonthly}
                        onCheckedChange={setIsMonthly}
                        className="data-[state=checked]:bg-amber-400"
                      />
                      <Label htmlFor="monthly-donation" className="text-base">
                        Make this a monthly donation
                      </Label>
                    </div>
                    {isMonthly && (
                      <p className="text-sm text-gray-400 ml-8">
                        Your donation will automatically repeat each month. You can cancel anytime.
                      </p>
                    )}
                  </div>                  <Button 
                    type="button"
                    onClick={nextStep}
                    className="w-full bg-amber-400 hover:bg-amber-500 text-black font-medium py-3 rounded-none flex items-center justify-center"
                  >
                    Next: Donor Information
                    <ArrowRight className="ml-2 h-5 w-5" />
                  </Button>
                </>
              )}

              {formStep === 2 && (
                <>
                  <div className="grid grid-cols-1 md:grid-cols-2 gap-6 mb-6">
                    <div>
                      <Label htmlFor="firstName" className="text-sm mb-1 block">
                        First Name <span className="text-red-400">*</span>
                      </Label>
                      <Input
                        id="firstName"
                        name="firstName"
                        placeholder="First Name"
                        value={donorInfo.firstName}
                        onChange={handleDonorInfoChange}
                        className={`bg-gray-800 border-gray-700 rounded-none ${errors.firstName ? "border-red-400 focus:border-red-400" : "focus:border-amber-400"}`}
                        required
                      />
                      {errors.firstName && (
                        <p className="text-red-400 text-sm mt-1 flex items-center">
                          <AlertCircle className="h-4 w-4 mr-1" />
                          {errors.firstName}
                        </p>
                      )}
                    </div>
                    <div>
                      <Label htmlFor="lastName" className="text-sm mb-1 block">
                        Last Name <span className="text-red-400">*</span>
                      </Label>
                      <Input
                        id="lastName"
                        name="lastName"
                        placeholder="Last Name"
                        value={donorInfo.lastName}
                        onChange={handleDonorInfoChange}
                        className={`bg-gray-800 border-gray-700 rounded-none ${errors.lastName ? "border-red-400 focus:border-red-400" : "focus:border-amber-400"}`}
                        required
                      />
                      {errors.lastName && (
                        <p className="text-red-400 text-sm mt-1 flex items-center">
                          <AlertCircle className="h-4 w-4 mr-1" />
                          {errors.lastName}
                        </p>
                      )}
                    </div>
                  </div>

                  <div className="mb-6">
                    <Label htmlFor="email" className="text-sm mb-1 block">
                      Email Address <span className="text-red-400">*</span>
                    </Label>
                    <Input
                      id="email"
                      name="email"
                      type="email"
                      placeholder="Your Email"
                      value={donorInfo.email}
                      onChange={handleDonorInfoChange}
                      className={`bg-gray-800 border-gray-700 rounded-none ${errors.email ? "border-red-400 focus:border-red-400" : "focus:border-amber-400"}`}
                      required
                    />
                    {errors.email && (
                      <p className="text-red-400 text-sm mt-1 flex items-center">
                        <AlertCircle className="h-4 w-4 mr-1" />
                        {errors.email}
                      </p>
                    )}
                  </div>                  <div className="mb-6">
                    <Label htmlFor="phone" className="text-sm mb-1 block">
                      Phone Number (Optional)
                    </Label>
                    <Input
                      id="phone"
                      name="phone"
                      type="tel"
                      placeholder="Your Phone"
                      value={donorInfo.phone}
                      onChange={handleDonorInfoChange}
                      className="bg-gray-800 border-gray-700 rounded-none focus:border-amber-400"
                    />
                    {errors.phone && (
                      <p className="text-red-400 text-sm mt-1 flex items-center">
                        <AlertCircle className="h-4 w-4 mr-1" />
                        {errors.phone}
                      </p>
                    )}
                  </div>

                  <div className="mb-6">
                    <Label htmlFor="message" className="text-sm mb-1 block">
                      Message (Optional)
                    </Label>
                    <Textarea
                      id="message"
                      name="message"
                      placeholder="Add a message with your donation"
                      value={donorInfo.message}
                      onChange={handleDonorInfoChange}
                      className="bg-gray-800 border-gray-700 rounded-none focus:border-amber-400 min-h-[100px]"
                    />
                  </div>

                  <div className="mb-6">
                    <Label className="text-sm mb-2 block">
                      Payment Method <span className="text-red-400">*</span>
                    </Label>
                    <div className="bg-gray-800 p-4 rounded-none border border-gray-700">
                      <p className="text-gray-300 flex items-center">
                        <Shield className="h-5 w-5 mr-2" />
                        Razorpay (Secure Payment)
                      </p>
                    </div>
                  </div>

                  <div className="flex items-center justify-between mt-8">
                    <Button
                      type="button"
                      onClick={prevStep}
                      variant="outline"
                      className="border-amber-400 text-amber-400 hover:bg-amber-400/10 rounded-none"
                    >
                      Back
                    </Button>
                    <Button
                      type="button"
                      onClick={nextStep}
                      className="bg-amber-400 hover:bg-amber-500 text-black font-medium px-8 py-3 rounded-none"
                    >
                      Review Donation
                    </Button>
                  </div>
                </>
              )}

              {formStep === 3 && (
                <>
                  <div className="mb-8">
                    <h3 className="text-xl font-bold mb-4 text-center">Review Your Donation</h3>
                    
                    <div className="bg-gray-800 p-6 mb-6">
                      <div className="flex justify-between mb-2 pb-2 border-b border-gray-700">
                        <span className="text-gray-300">Donation Amount:</span>
                        <span className="text-amber-400 font-bold">{formatAmount(amount)}</span>
                      </div>
                      
                      {isMonthly && (
                        <div className="flex justify-between mb-2 pb-2 border-b border-gray-700">
                          <span className="text-gray-300">Frequency:</span>
                          <span className="text-white">Monthly</span>
                        </div>
                      )}
                      
                      <div className="flex justify-between mb-2 pb-2 border-b border-gray-700">
                        <span className="text-gray-300">Donor:</span>
                        <span className="text-white">{donorInfo.firstName} {donorInfo.lastName}</span>
                      </div>
                      
                      <div className="flex justify-between mb-2 pb-2 border-b border-gray-700">
                        <span className="text-gray-300">Email:</span>
                        <span className="text-white">{donorInfo.email}</span>
                      </div>
                      
                      {donorInfo.phone && (
                        <div className="flex justify-between mb-2 pb-2 border-b border-gray-700">
                          <span className="text-gray-300">Phone:</span>
                          <span className="text-white">{donorInfo.phone}</span>
                        </div>
                      )}
                        <div className="flex justify-between mb-2 pb-2 border-b border-gray-700">
                        <span className="text-gray-300">Payment Method:</span>
                        <span className="text-white flex items-center">
                          Razorpay <img src="https://razorpay.com/favicon.png" alt="Razorpay" className="w-4 h-4 ml-2" /> (Secure Payment)
                        </span>
                      </div>
                      
                      <div className="mt-4 p-3 bg-gray-900 text-xs text-gray-400">
                        <p className="mb-1">You'll be redirected to Razorpay's secure payment page to complete your donation.</p>
                        <p>Razorpay accepts Credit/Debit Cards, UPI, Netbanking, and Wallets.</p>
                      </div>
                      
                      {donorInfo.message && (
                        <div className="mt-4">
                          <span className="text-gray-300 block mb-1">Message:</span>
                          <p className="text-white text-sm bg-gray-900 p-3">{donorInfo.message}</p>
                        </div>
                      )}
                    </div>
                  </div>
                  
                  <div className="flex items-center justify-between mt-8">
                    <Button
                      type="button"
                      onClick={prevStep}
                      variant="outline"
                      className="border-amber-400 text-amber-400 hover:bg-amber-400/10 rounded-none"
                      disabled={isProcessing}
                    >
                      Edit Details
                    </Button>
                    <Button
                      type="submit"
                      className="bg-amber-400 hover:bg-amber-500 text-black font-medium px-8 py-3 rounded-none flex items-center justify-center"
                      disabled={isProcessing}
                    >
                      {isProcessing ? (
                        <>
                          <div className="animate-spin mr-2 h-4 w-4 border-2 border-b-transparent border-black rounded-full"></div>
                          Processing...
                        </>
                      ) : (
                        <>Confirm Donation {formatAmount(amount)} {isMonthly ? "Monthly" : ""}</>
                      )}
                    </Button>
                  </div>
                </>
              )}
            </form>
          )}
          
          <div className="mt-8 text-center border-t border-gray-800 pt-6">
            <div className="flex items-center justify-center mb-2 text-amber-400">
              <Heart className="h-5 w-5 mr-2" />
              <p className="text-sm">Your donation is securely processed</p>
            </div>
            <p className="text-xs text-gray-400">
              PRACHETAS FOUNDATION is a registered non-profit organization. 
              All donations are tax-deductible. Reg. No: MAHA/953/2022
            </p>
          </div>
        </div>
      </div>
    </section>
  );
};

export default DonationForm;
