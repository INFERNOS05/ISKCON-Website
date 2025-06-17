import { useState, useEffect } from "react";
import { useForm } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import * as z from "zod";
import { Button } from "@/components/ui/button";
import {
  Form,
  FormControl,
  FormField,
  FormItem,
  FormLabel,
  FormMessage,
} from "@/components/ui/form";
import { Input } from "@/components/ui/input";
import { Switch } from "@/components/ui/switch";
import { ArrowRight, Heart, Check } from "lucide-react";
import { loadRazorpayScript, initializePayment, initializeRecurringPayment } from "@/lib/razorpay";
import { processRazorpayResponse } from "@/lib/payment-service";

// Define a schema for donation form
const donationFormSchema = z.object({
  amount: z.string().min(1, {
    message: "Please select or enter a donation amount.",
  }),
  isRecurring: z.boolean().default(false),
  fullName: z.string().min(2, {
    message: "Full name must be at least 2 characters.",
  }),
  email: z.string().email({
    message: "Please enter a valid email address.",
  }),
  phone: z.string().min(10, {
    message: "Please enter a valid phone number.",
  }),
  address: z.string().min(5, {
    message: "Please enter your address.",
  }),
  panCard: z.string().optional(),
});

type DonationFormValues = z.infer<typeof donationFormSchema>;

const DONATION_AMOUNTS = [
  { value: "500", label: "₹500" },
  { value: "1000", label: "₹1000" },
  { value: "2500", label: "₹2500" },
  { value: "5000", label: "₹5000" },
  { value: "10000", label: "₹10000" },
];

const SIP_AMOUNTS = [
  { value: "100", label: "₹100" },
  { value: "200", label: "₹200" },
  { value: "500", label: "₹500" },
  { value: "1000", label: "₹1000" },
];

const MultistepDonation = () => {
  const [currentStep, setCurrentStep] = useState(1);
  const [selectedAmount, setSelectedAmount] = useState<string | null>("1000");
  const [isLoading, setIsLoading] = useState(false);
  const [isSuccess, setIsSuccess] = useState(false);
  const [paymentError, setPaymentError] = useState<string | null>(null);
  const [transactionId, setTransactionId] = useState<string | null>(null);

  // Initialize Razorpay
  useEffect(() => {
    const initializeRazorpay = async () => {
      try {
        await loadRazorpayScript();
      } catch (error) {
        console.error("Failed to load Razorpay script:", error);
        setPaymentError("Failed to load payment system. Please refresh and try again.");
      }
    };

    initializeRazorpay();
  }, []);

  const form = useForm<DonationFormValues>({
    resolver: zodResolver(donationFormSchema),
    defaultValues: {
      amount: "1000",
      isRecurring: false,
      fullName: "",
      email: "",
      phone: "",
      address: "",
      panCard: "",
    },
  });

  const handleAmountSelection = (value: string) => {
    setSelectedAmount(value);
    form.setValue("amount", value);
  };

  // Progress to next step
  const nextStep = () => {
    if (currentStep === 1) {
      // Validate amount before proceeding
      form.trigger("amount").then((isValid) => {
        if (isValid) {
          setCurrentStep(2);
        }
      });
    } else if (currentStep === 2) {
      form.handleSubmit(onSubmit)();
    }
  };
  // Handle form submission (final step)
  const onSubmit = async (values: DonationFormValues) => {
    setIsLoading(true);
    setPaymentError(null);
    
    try {
      const amount = parseFloat(values.amount);
      if (isNaN(amount) || amount <= 0) {
        throw new Error("Invalid donation amount");
      }
      
      // Donor info for payment processing
      const donorInfo = {
        name: values.fullName,
        email: values.email,
        phone: values.phone
      };
      
      // Notes for the payment
      const notes = {
        address: values.address,
        pan_card: values.panCard || "Not provided",
        payment_for: "Donation to Prachetas Foundation"
      };
      
      // Handle payment based on type (one-time or recurring)
      if (values.isRecurring) {
        try {
          // Initialize recurring SIP payment
          console.log(`Initializing SIP payment for amount: ₹${amount}`);
          
          // Check if we're handling a valid SIP amount
          const validSipAmounts = [100, 200, 500, 1000];
          if (!validSipAmounts.includes(amount)) {
            throw new Error(`Invalid SIP amount: ₹${amount}. Please select from the available options: ₹100, ₹200, ₹500, or ₹1000.`);
          }
          
          await initializeRecurringPayment({
            amount,
            name: "Prachetas Foundation",
            description: "Monthly SIP Donation",
            prefill: {
              name: values.fullName,
              email: values.email,
              contact: values.phone
            },
            notes,
            handler: async (response) => {
              handlePaymentSuccess(response, amount, donorInfo);
            },
            onDismiss: () => {
              setIsLoading(false);
            }
          });
        } catch (sipError) {
          console.error("SIP payment error:", sipError);
          setPaymentError(`SIP payment setup failed: ${sipError instanceof Error ? sipError.message : "Unknown error"}`);
          setIsLoading(false);
        }
      } else {
        try {
          // Initialize one-time payment
          console.log(`Initializing one-time payment for amount: ₹${amount}`);
          await initializePayment({
            amount,
            name: "Prachetas Foundation",
            description: "One-time Donation",
            prefill: {
              name: values.fullName,
              email: values.email,
              contact: values.phone
            },
            notes,
            handler: async (response) => {
              handlePaymentSuccess(response, amount, donorInfo);
            },
            onDismiss: () => {
              setIsLoading(false);
            }
          });
        } catch (paymentError) {
          console.error("One-time payment error:", paymentError);
          setPaymentError(`Payment initialization failed: ${paymentError instanceof Error ? paymentError.message : "Unknown error"}`);
          setIsLoading(false);
        }
      }
    } catch (error) {
      console.error("Payment error:", error);
      setIsLoading(false);
      setPaymentError(error instanceof Error ? error.message : "Payment processing failed. Please try again.");
    }
  };
  
  // Handle successful payment
  const handlePaymentSuccess = async (response: any, amount: number, donorInfo: any) => {
    try {
      // Process the payment response through our service
      const result = await processRazorpayResponse(response, amount, donorInfo);
      
      if (result.success) {
        setTransactionId(result.transactionId);
        setIsSuccess(true);
      } else {
        setPaymentError(result.message || "Payment verification failed");
      }
    } catch (error) {
      console.error("Error verifying payment:", error);
      setPaymentError("Error verifying payment. Please contact support with your transaction details.");
    } finally {
      setIsLoading(false);
    }
  };
  return (
    <section className="py-16 bg-black text-white">
      <div className="container mx-auto px-4 max-w-3xl">
        <div className="text-center mb-12">
          <h2 className="text-4xl font-bold mb-4">Make a Donation</h2>
          <p className="text-lg text-gray-300">
            Your contribution helps us make a difference in the lives of those in need.
          </p>
          
          {currentStep === 1 && !isSuccess && (
            <p className="text-yellow-400 font-medium mt-8">Step 1: Select Amount</p>
          )}
          {currentStep === 2 && !isSuccess && (
            <p className="text-yellow-400 font-medium mt-8">Step 2: Donor Information</p>
          )}
        </div>

        {isSuccess ? (
          <div className="bg-gray-900 rounded-lg p-8 text-center">
            <div className="mx-auto w-16 h-16 bg-yellow-100 rounded-full flex items-center justify-center mb-6">
              <Check className="h-8 w-8 text-yellow-600" />
            </div>
            <h3 className="text-2xl font-bold mb-4">Thank You For Your Donation!</h3>
            <p className="text-gray-400 mb-6">
              Your generous support will help us continue our mission to create positive change in communities.
            </p>
            {transactionId && (
              <p className="bg-gray-800 py-2 px-4 rounded-md inline-block mb-6">
                Transaction ID: <span className="text-yellow-400 font-medium">{transactionId}</span>
              </p>
            )}
            <p className="text-gray-400 mb-8">
              A confirmation receipt has been sent to your email address.
            </p>
            <div className="flex flex-col sm:flex-row gap-4 justify-center">
              <Button 
                onClick={() => {
                  setCurrentStep(1);
                  setIsSuccess(false);
                  form.reset(form.getValues());
                }}
                variant="outline"
                className="border-yellow-400 text-yellow-400 hover:bg-yellow-400 hover:text-black"
              >
                Make Another Donation
              </Button>
              <Button 
                onClick={() => window.location.href = "/"}
                className="bg-yellow-400 text-black hover:bg-yellow-500"
              >
                Return to Homepage
              </Button>
            </div>
          </div>
        ) : (
          <Form {...form}>
            <form className="space-y-8">
              {paymentError && (
                <div className="bg-red-900/30 border border-red-500 text-red-200 p-4 rounded-md mb-4">
                  <p className="font-medium">Payment Error</p>
                  <p className="text-sm">{paymentError}</p>
                </div>
              )}
              
              {currentStep === 1 && (
                <>
                  <div className="space-y-6">
                    <h3 className="text-2xl font-bold">Select Donation Amount</h3>
                    
                    <div className="grid grid-cols-2 md:grid-cols-5 gap-4">
                      {(form.watch("isRecurring") ? SIP_AMOUNTS : DONATION_AMOUNTS).map((amount) => (
                        <button
                          key={amount.value}
                          type="button"
                          className={`py-4 px-4 rounded-md border ${
                            selectedAmount === amount.value
                              ? "bg-yellow-400 text-black border-yellow-500 font-medium"
                              : "border-gray-700 hover:border-yellow-400 transition-colors"
                          }`}
                          onClick={() => handleAmountSelection(amount.value)}
                        >
                          {amount.label}
                        </button>
                      ))}
                    </div>
                    
                    <FormField
                      control={form.control}
                      name="amount"
                      render={({ field }) => (
                        <FormItem>
                          <FormLabel>Or enter a custom amount</FormLabel>
                          <FormControl>
                            <div className="relative">
                              <span className="absolute left-3 top-3 text-gray-400">₹</span>
                              <Input
                                placeholder="Enter amount"
                                {...field}
                                className="pl-8 bg-transparent border-gray-700"
                                onChange={(e) => {
                                  field.onChange(e);
                                  setSelectedAmount(null);
                                }}
                              />
                            </div>
                          </FormControl>
                          <FormMessage />
                        </FormItem>
                      )}
                    />
                    
                    <FormField
                      control={form.control}
                      name="isRecurring"
                      render={({ field }) => (
                        <FormItem className="space-y-2">
                          <div className="flex flex-col space-y-1.5">
                            <div className="flex items-center gap-2">
                              <Switch
                                id="recurring-donation"
                                checked={field.value}
                                onCheckedChange={(checked) => {
                                  field.onChange(checked);
                                  
                                  // Reset selected amount when switching between one-time and recurring
                                  if (checked) {
                                    // Switch to SIP amounts
                                    setSelectedAmount("1000");
                                    form.setValue("amount", "1000");
                                  } else {
                                    // Switch to regular amounts
                                    setSelectedAmount("1000");
                                    form.setValue("amount", "1000");
                                  }
                                }}
                              />
                              <FormLabel htmlFor="recurring-donation">
                                Make this a monthly recurring donation (SIP)
                              </FormLabel>
                            </div>
                            {field.value && (
                              <div className="ml-8 mt-2 text-sm text-gray-400">
                                <p>Select this option to set up a monthly Systematic Investment Plan (SIP) donation to support our work consistently.</p>
                                <p className="mt-1">Available in pre-set amounts of ₹100, ₹200, ₹500, and ₹1000.</p>
                              </div>
                            )}
                          </div>
                          <FormMessage />
                        </FormItem>
                      )}
                    />
                  </div>
                  
                  <Button
                    type="button"
                    className="w-full bg-yellow-400 text-black hover:bg-yellow-500 mt-6"
                    onClick={nextStep}
                  >
                    Next: Donor Information <ArrowRight className="ml-2 h-4 w-4" />
                  </Button>
                </>
              )}

              {currentStep === 2 && (
                <>
                  <div className="space-y-6">
                    <div className="bg-gray-900 p-4 rounded-md flex items-center justify-between">
                      <div>
                        <p className="text-gray-400">Selected amount:</p>
                        <p className="text-2xl font-bold">₹{form.getValues("amount")}</p>
                        {form.getValues("isRecurring") && (
                          <p className="text-sm text-yellow-400">Monthly recurring donation (SIP)</p>
                        )}
                      </div>
                      <Button
                        type="button"
                        variant="outline"
                        className="text-gray-300 border-gray-700"
                        onClick={() => setCurrentStep(1)}
                      >
                        Edit
                      </Button>
                    </div>
                    
                    <div className="space-y-4">
                      <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                        <FormField
                          control={form.control}
                          name="fullName"
                          render={({ field }) => (
                            <FormItem>
                              <FormLabel>Full Name</FormLabel>
                              <FormControl>
                                <Input
                                  placeholder="Enter your full name"
                                  {...field}
                                  className="bg-transparent border-gray-700"
                                />
                              </FormControl>
                              <FormMessage />
                            </FormItem>
                          )}
                        />
                        
                        <FormField
                          control={form.control}
                          name="email"
                          render={({ field }) => (
                            <FormItem>
                              <FormLabel>Email Address</FormLabel>
                              <FormControl>
                                <Input
                                  placeholder="Enter your email"
                                  {...field}
                                  className="bg-transparent border-gray-700"
                                />
                              </FormControl>
                              <FormMessage />
                            </FormItem>
                          )}
                        />
                      </div>
                      
                      <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                        <FormField
                          control={form.control}
                          name="phone"
                          render={({ field }) => (
                            <FormItem>
                              <FormLabel>Phone Number</FormLabel>
                              <FormControl>
                                <Input
                                  placeholder="Enter your phone number"
                                  {...field}
                                  className="bg-transparent border-gray-700"
                                />
                              </FormControl>
                              <FormMessage />
                            </FormItem>
                          )}
                        />
                        
                        <FormField
                          control={form.control}
                          name="panCard"
                          render={({ field }) => (
                            <FormItem>
                              <FormLabel>PAN Card (Optional - for tax benefits)</FormLabel>
                              <FormControl>
                                <Input
                                  placeholder="Enter PAN card number"
                                  {...field}
                                  className="bg-transparent border-gray-700"
                                />
                              </FormControl>
                              <FormMessage />
                            </FormItem>
                          )}
                        />
                      </div>
                      
                      <FormField
                        control={form.control}
                        name="address"
                        render={({ field }) => (
                          <FormItem>
                            <FormLabel>Address</FormLabel>
                            <FormControl>
                              <Input
                                placeholder="Enter your address"
                                {...field}
                                className="bg-transparent border-gray-700"
                              />
                            </FormControl>
                            <FormMessage />
                          </FormItem>
                        )}
                      />
                    </div>
                  </div>
                  
                  <Button
                    type="button"
                    className="w-full bg-yellow-400 text-black hover:bg-yellow-500 mt-6"
                    onClick={nextStep}
                    disabled={isLoading}
                  >
                    {isLoading ? "Processing..." : (
                      <>
                        <Heart className="mr-2 h-4 w-4" /> Proceed to Payment
                      </>
                    )}
                  </Button>
                </>
              )}
            </form>
          </Form>
        )}
        
        {!isSuccess && (
          <div className="mt-12 text-center">
            <div className="flex items-center justify-center text-yellow-400">
              <Heart className="h-5 w-5 mr-2" />
              <p>Your donation is securely processed</p>
            </div>
            <p className="text-sm text-gray-400 mt-2">
              PRACHETAS FOUNDATION is a registered non-profit organization. All donations are tax-deductible. Reg. No: MAHA/953/2022
            </p>
          </div>
        )}
      </div>
    </section>
  );
};

export default MultistepDonation;
