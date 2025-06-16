import { useState, useEffect } from "react";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { Textarea } from "@/components/ui/textarea";
import { Switch } from "@/components/ui/switch";
import { Check, Heart, ArrowRight, AlertCircle, Shield } from "lucide-react";
import { useSearchParams } from "react-router-dom";
import { 
  initializePayment, 
  initializeRecurringPayment, 
  RazorpayResponse, 
  verifyPayment, 
  loadRazorpayScript 
} from "@/lib/razorpay";
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
  const sipPreConfiguredAmounts = ["100", "200", "500", "1000"]; // Amounts with pre-configured Razorpay plan IDs matching the backend

  // Handle URL params for pre-filled amount
  useEffect(() => {
    const urlAmount = searchParams.get("amount");
    if (urlAmount && !isNaN(Number(urlAmount)) && Number(urlAmount) > 0) {
      setAmount(urlAmount);
    }
  }, [searchParams]);
  const handleAmountClick = (value: string) => {
    console.log(`Selected predefined amount: ${value}`);
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
    setFormStep(formStep - 1);  };  const handlePaymentSuccess = async (response: RazorpayResponse) => {
    try {
      // Check if this is a subscription payment
      const isSubscription = !!response.razorpay_subscription_id;
      
      console.log("Payment success response:", JSON.stringify(response, null, 2));
      
      // Debug information to help troubleshoot
      if (isSubscription) {
        console.log("Processing subscription payment success");
      } else {
        console.log("Processing one-time payment success");
      }
      
      // Validate that we have the required fields in the response
      if (!response.razorpay_payment_id && !response.razorpay_subscription_id) {
        throw new Error("Payment failed: Missing payment ID or subscription ID in response");
      }
      
      // For one-time payments, we should have payment_id and signature
      if (!isSubscription && !response.razorpay_signature) {
        console.warn("Warning: Missing payment signature in one-time payment response");
      }
      
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
        // Determine the ID to display based on the type of payment
        const displayId = isSubscription 
          ? response.razorpay_subscription_id 
          : response.razorpay_payment_id;
          
        // Record the payment response for display
        setPaymentResponse({
          id: displayId || "",
          orderId: response.razorpay_order_id,
          signature: response.razorpay_signature,
          status: "success"
        });
        
        // Update UI states
        setFormSubmitted(true);
        setIsProcessing(false);
        
        // Show success toast with appropriate message for one-time or recurring donation
        toast({
          title: isSubscription ? "Subscription Activated" : "Payment Successful",
          description: isSubscription
            ? `Thank you for setting up a monthly SIP donation of ${formatAmount(amount)}. Your first payment has been authorized.`
            : `Thank you for your donation of ${formatAmount(amount)}.`,
        });
        
        console.log(`Payment ${isSubscription ? 'subscription' : 'transaction'} completed successfully with ID: ${displayId}`);
      } else {
        throw new Error(verificationResult.message || "Payment verification failed");
      }
    } catch (error) {
      console.error("Payment processing error:", error);
      setIsProcessing(false);
      
      // Show more detailed error message if possible
      let errorMessage = isMonthly 
        ? "There was an issue setting up your recurring donation." 
        : "There was an issue processing your payment.";
        
      if (error instanceof Error) {
        console.error(`Error details: ${error.message}`);
        
        // Add more context to help with debugging
        if (error.message.includes("Missing payment") || error.message.includes("verification failed")) {
          errorMessage += " The payment gateway returned an incomplete response.";
        } else if (error.message.includes("razorpay")) {
          // Try to extract a more user-friendly message
          const errorMatch = error.message.match(/razorpay error: (.*)/i);
          if (errorMatch && errorMatch[1]) {
            errorMessage = errorMatch[1];
          }
        }
      }
      
      toast({
        variant: "destructive",
        title: "Payment Failed",
        description: `${errorMessage} Please try again.`,
      });
    } finally {
      // Ensure the loading state is always reset
      setTimeout(() => {
        if (isProcessing) {
          setIsProcessing(false);
        }
      }, 1000);
    }
  };const processRazorpayPayment = async () => {
    // Clear any previous payment response
    setPaymentResponse(null);
    
    try {
      setIsProcessing(true);
      
      const amountValue = parseFloat(amount);
      if (isNaN(amountValue) || amountValue <= 0) {
        setErrors({...errors, amount: "Please enter a valid amount"});
        setIsProcessing(false);
        return;
      }

      // Clean up any previous Razorpay elements that might be in the DOM
      const existingRazorpayElements = document.querySelectorAll('.razorpay-container, .razorpay-checkout-frame, .razorpay-payment-button');
      existingRazorpayElements.forEach(el => el.remove());

      console.log(`Processing payment: Amount=${amountValue}, Monthly=${isMonthly}`);
      
      // For SIP payments, we'll use the supported amounts for recurring payments
      let finalAmount = amountValue;
      
      if (isMonthly) {
        // Force to ₹500 for testing SIP payments - this ensures we use a plan ID that exists
        finalAmount = 500;
        
        if (Math.abs(amountValue - 500) > 1) {
          console.log(`For testing, adjusting SIP amount to ₹${finalAmount} (from ₹${amountValue})`);
          
          // Update the UI to show the test amount
          setAmount(String(finalAmount));
          
          // Notify user about test mode
          toast({
            title: "Test Mode Active",
            description: `For testing purposes, monthly donations are set to ₹500. In production, you'll be able to choose different amounts.`,
          });
        }
      }
      
      // Common payment options
      const paymentOptions = {
        name: "PRACHETAS FOUNDATION",
        description: `Donation${isMonthly ? " (Monthly)" : ""}`,
        prefill: {
          name: `${donorInfo.firstName} ${donorInfo.lastName}`,
          email: donorInfo.email,
          contact: donorInfo.phone
        },
        notes: {
          payment_for: "Donation",
          recurring: isMonthly ? "yes" : "no",
          donor_message: donorInfo.message || "",
          donor_name: `${donorInfo.firstName} ${donorInfo.lastName}`,
          donor_email: donorInfo.email,
          test_mode: "true" // Useful for debugging
        },
        theme: {
          color: "#F59E0B" // amber-500 color
        },
        handler: handlePaymentSuccess,
        onDismiss: () => {
          // Ensure processing state is reset when payment window is closed
          setTimeout(() => {
            setIsProcessing(false);
            toast({
              title: "Payment Cancelled",
              description: "You have cancelled the payment process.",
            });
          }, 500);
        }
      };

      // First, load the Razorpay script to make sure it's available
      const isLoaded = await loadRazorpayScript();
      if (!isLoaded) {
        throw new Error("Failed to load Razorpay payment gateway. Please check your internet connection and try again.");
      }
      
      // Choose between one-time payment or subscription based on isMonthly
      if (isMonthly) {
        console.log(`Initializing recurring payment with amount: ${finalAmount}`);
        
        try {
          // Initialize a recurring subscription payment with the test plan ID
          // We'll use the official Razorpay test ID in test mode (for debugging)
          // In a more production-like scenario, you could set this to false
          const useTestMode = true; // Set to true to use Razorpay's special test subscription ID
          
          await initializeRecurringPayment({
            amount: finalAmount,
            currency: "INR",
            useTestMode,
            ...paymentOptions
          });
          
          if (useTestMode) {
            console.log("Note: Using Razorpay's test subscription ID mode");
            // You could add a subtle indicator in the UI that this is test mode
          } else {
            console.log("Note: Using unique subscription ID mode");
          }
        } catch (err) {
          console.error("Monthly SIP payment failed:", err);
          setIsProcessing(false);
          
          // Show a more detailed error message to help with debugging
          let errorDetails = "Unknown error";
          if (err instanceof Error) {
            errorDetails = err.message;
          }
          
          toast({
            variant: "destructive",
            title: "SIP Payment Failed",
            description: `There was an issue setting up your monthly donation (${errorDetails}). Please try again with ₹500.`,
          });
        }
      } else {
        console.log(`Initializing one-time payment with amount: ${finalAmount}`);
        
        try {
          // Initialize a one-time payment
          await initializePayment({
            amount: finalAmount,
            currency: "INR",
            ...paymentOptions
          });
        } catch (err) {
          console.error("One-time payment failed:", err);
          setIsProcessing(false);
          
          let errorDetails = "Unknown error";
          if (err instanceof Error) {
            errorDetails = err.message;
          }
          
          toast({
            variant: "destructive",
            title: "Payment Failed",
            description: `There was an issue processing your payment (${errorDetails}). Please try again.`,
          });
        }
      }
    } catch (error) {
      console.error("Payment initialization failed:", error);
      setIsProcessing(false);
      
      // Show a more detailed error message if possible
      let errorMessage = "There was a problem initializing the payment.";
      if (error instanceof Error) {
        errorMessage = error.message;
      }
      
      toast({
        variant: "destructive",
        title: "Payment Error",
        description: errorMessage,
      });
    }
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

  // Effect to prevent getting stuck in processing state
  useEffect(() => {
    let processingTimeout: number | null = null;
    
    if (isProcessing) {
      // If still processing after 30 seconds, reset the state
      // This is a safety measure in case the Razorpay popup fails to open
      // or if there's any other issue with the payment flow
      processingTimeout = window.setTimeout(() => {
        console.log("Payment processing timeout - resetting state");
        setIsProcessing(false);
        toast({
          variant: "destructive",
          title: "Payment Error",
          description: "The payment process timed out. Please try again.",
        });
      }, 30000); // 30 second timeout
    }
    
    return () => {
      // Clean up timeout when component unmounts or processing state changes
      if (processingTimeout) {
        clearTimeout(processingTimeout);
      }
    };
  }, [isProcessing]);

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
              </p>              <div className="bg-gray-800 p-4 mb-6 mx-auto max-w-md">
                <div className="flex justify-between mb-2">
                  <span className="text-gray-400">Donation Amount:</span>
                  <span className="text-white font-medium">{formatAmount(amount)} {isMonthly ? "Monthly" : ""}</span>
                </div>
                <div className="flex justify-between mb-2">
                  <span className="text-gray-400">Donor Name:</span>
                  <span className="text-white">{donorInfo.firstName} {donorInfo.lastName}</span>
                </div>
                <div className="flex justify-between mb-2">
                  <span className="text-gray-400">Transaction ID:</span>
                  <span className="text-white">{paymentResponse?.id || "TXN" + Math.random().toString(36).substring(2, 10).toUpperCase()}</span>
                </div>                {isMonthly && (
                  <>
                    <div className="flex justify-between mb-2 border-t border-gray-700 mt-3 pt-3">
                      <span className="text-gray-400">Payment Type:</span>
                      <span className="text-amber-400">Monthly Recurring (SIP)</span>
                    </div>
                    <div className="flex justify-between mb-2">
                      <span className="text-gray-400">Subscription ID:</span>
                      <span className="text-white font-mono text-sm">{paymentResponse?.id || "SUB_ID"}</span>
                    </div>
                    <div className="flex justify-between mb-2">
                      <span className="text-gray-400">Next Payment:</span>
                      <span className="text-white">{new Date(Date.now() + 30*24*60*60*1000).toLocaleDateString()}</span>
                    </div>
                    <div className="bg-amber-400/10 p-3 mt-3 border-t border-gray-700 pt-3 text-sm">
                      <p className="text-amber-300 font-medium">
                        Your SIP donation has been successfully set up!
                      </p>
                      <ul className="text-xs text-gray-300 mt-2 list-disc pl-4 space-y-1">
                        <li>Your payment method will be automatically charged {formatAmount(amount)} monthly</li>
                        <li>You'll receive email receipts for each successful payment</li>
                        <li>Save your Subscription ID for future reference</li>
                        <li>You can manage or cancel your subscription by contacting us with this ID</li>
                      </ul>
                    </div>
                  </>
                )}
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
                    </Label>                    <div className="grid grid-cols-2 md:grid-cols-5 gap-3 mb-4">
                      {isMonthly ? (
                        // Show only SIP-enabled amounts for monthly donations
                        sipPreConfiguredAmounts.map((value) => (
                          <button
                            type="button"
                            key={value}
                            onClick={() => handleAmountClick(value)}
                            className={`py-3 px-4 border-2 rounded-none ${
                              amount === value
                                ? "border-amber-400 bg-amber-400/10 text-amber-400"
                                : "border-gray-600 hover:border-amber-400/50"
                            } relative overflow-hidden`}
                          >
                            ₹{value}
                            <div className="absolute -top-1 -right-1 bg-amber-400 text-black text-[8px] px-1 rotate-12 font-semibold">
                              SIP
                            </div>
                          </button>
                        ))
                      ) : (
                        // Show all predefined amounts for one-time donations
                        predefinedAmounts.map((value) => (
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
                        ))
                      )}
                    </div>                    {isMonthly && (
                      <p className="text-xs text-amber-400/80 mt-3 mb-1">
                        <strong>Note:</strong> Our monthly SIP donations are available in pre-configured amounts of 
                        ₹100, ₹200, ₹500, and ₹1000. Please select one of these amounts for your monthly donation.
                      </p>
                    )}
                    
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
                  </div>                  <div className="mb-6">
                    <div className="flex items-center space-x-2 mb-2">
                      <Switch 
                        id="monthly-donation"
                        checked={isMonthly}
                        onCheckedChange={setIsMonthly}
                        className="data-[state=checked]:bg-amber-400"
                      />
                      <Label htmlFor="monthly-donation" className="text-base">
                        Make this a monthly recurring donation (SIP)
                      </Label>
                    </div>                    {isMonthly ? (
                      <div className="bg-amber-400/10 border-l-4 border-amber-400 p-3 mt-3">
                        <p className="text-sm text-amber-200">
                          <strong>Monthly Giving (SIP):</strong> Your donation will automatically repeat each month using Razorpay's secure subscription system.
                        </p>
                        <ul className="text-xs text-gray-400 mt-2 list-disc pl-4 space-y-1">
                          <li>SIP donations are available in amounts of ₹100, ₹200, ₹500, and ₹1000 only</li>
                          <li>Your payment method will be charged the same amount on this date each month for 12 months</li>
                          <li>You'll receive email receipts for each payment</li>
                          <li>You can cancel anytime by contacting us with your subscription ID</li>
                          <li>For UPI/cards, you'll need to authorize the first payment and provide mandate for future payments</li>
                        </ul>
                      </div>
                    ) : (
                      <p className="text-sm text-gray-400 mt-2">
                        Select this option to set up a monthly Systematic Investment Plan (SIP) donation to support our work consistently. Available in pre-set amounts of ₹100, ₹200, ₹500, and ₹1000.
                      </p>
                    )}
                  </div><Button 
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
                        <>
                          <div className="flex justify-between mb-2 pb-2 border-b border-gray-700">
                            <span className="text-gray-300">Frequency:</span>
                            <span className="text-white">Monthly (SIP)</span>
                          </div>
                          <div className="flex justify-between mb-2 pb-2 border-b border-gray-700">
                            <span className="text-gray-300">First Billing:</span>
                            <span className="text-white">Today</span>
                          </div>
                          <div className="flex justify-between mb-2 pb-2 border-b border-gray-700">
                            <span className="text-gray-300">Next Billing:</span>
                            <span className="text-white">{new Date(Date.now() + 30*24*60*60*1000).toLocaleDateString()}</span>
                          </div>
                        </>
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
                      )}                        <div className="flex justify-between mb-2 pb-2 border-b border-gray-700">
                        <span className="text-gray-300">Payment Method:</span>
                        <span className="text-white flex items-center">
                          Razorpay <img src="https://razorpay.com/favicon.png" alt="Razorpay" className="w-4 h-4 ml-2" /> (Secure Payment)
                        </span>
                      </div>
                      
                      <div className="mt-4 p-3 bg-gray-900 text-xs text-gray-400">
                        <p className="mb-1">You'll be redirected to Razorpay's secure payment page to complete your donation.</p>
                        <p className="mb-1">Razorpay accepts Credit/Debit Cards, UPI, Netbanking, and Wallets.</p>                        {isMonthly && (                          <div className="mt-2 border-t border-gray-700 pt-2">
                            <p className="text-amber-300 text-xs font-bold mb-1">
                              Monthly SIP Donation Information:
                            </p>
                            <ul className="text-amber-200/80 text-xs list-disc pl-4 space-y-1">
                              <li>You're setting up automatic monthly payments of {formatAmount(amount)}</li>
                              <li>You'll need to authorize the recurring payment mandate with your bank</li>
                              <li>For cards, this will use Razorpay's secure TokenizerID system</li>
                              <li>For UPI, you'll need to authorize the mandate in your UPI app</li>
                              <li>Payments will be processed on the same date each month</li>
                              {sipPreConfiguredAmounts.includes(amount) && (
                                <li className="text-amber-300">
                                  You've selected a pre-configured SIP plan amount
                                </li>
                              )}
                            </ul>
                          </div>
                        )}
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
                    </Button>                    <Button
                      type="submit"
                      className="bg-amber-400 hover:bg-amber-500 text-black font-medium px-8 py-3 rounded-none flex items-center justify-center"
                      disabled={isProcessing}
                      onClick={() => {
                        if (isProcessing) {
                          // If it's been processing for too long (more than 30 seconds), allow retry
                          // This prevents the UI from being stuck in "Processing..." state if Razorpay fails silently
                          setTimeout(() => {
                            if (isProcessing) {
                              setIsProcessing(false);
                            }
                          }, 30000);
                        }
                      }}
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
