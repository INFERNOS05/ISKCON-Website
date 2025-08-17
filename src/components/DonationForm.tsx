import React, { useState } from "react";
import { useForm } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import * as z from "zod";
import { Button } from "@/components/ui/button";
import {
  Card,
  CardContent,
  CardDescription,
  CardHeader,
  CardTitle,
} from "@/components/ui/card";
import {
  Form,
  FormControl,
  FormField,
  FormItem,
  FormLabel,
  FormMessage,
} from "@/components/ui/form";
import { Input } from "@/components/ui/input";
import { Textarea } from "@/components/ui/textarea";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import { RadioGroup, RadioGroupItem } from "@/components/ui/radio-group";
import { Checkbox } from "@/components/ui/checkbox";
import { BadgeDollarSign, CreditCard, Heart, Check } from "lucide-react";

const formSchema = z.object({
  fullName: z.string().min(2, {
    message: "Full name must be at least 2 characters.",
  }),
  email: z.string().email({
    message: "Please enter a valid email address.",
  }),
  phoneNumber: z.string().optional(),
  panCard: z.string().optional(),
  address: z.string().optional(),
  amount: z.string().min(1, {
    message: "Please select or enter a donation amount.",
  }),
  donationType: z.enum(["one-time", "monthly"], {
    required_error: "Please select a donation type.",
  }),
  paymentMethod: z.enum(["credit-card", "paypal", "bank-transfer"], {
    required_error: "Please select a payment method.",
  }),
  message: z.string().optional(),
  receiveUpdates: z.boolean().default(false),
});

const DonationForm = () => {
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [isSuccess, setIsSuccess] = useState(false);
  const [selectedAmount, setSelectedAmount] = useState<string | null>(null);
  // Store last payment details for success page call
  const [lastPaymentDetails, setLastPaymentDetails] = useState<{
    values: z.infer<typeof formSchema>;
    paymentId?: string;
    subscriptionId?: string;
  } | null>(null);
  const [donationError, setDonationError] = useState<string | null>(null);
  const [apiCallStatus, setApiCallStatus] = useState<string>("");
  const [lastApiResponse, setLastApiResponse] = useState<any>(null);
  const form = useForm<z.infer<typeof formSchema>>({
    resolver: zodResolver(formSchema),
    defaultValues: {
      fullName: "",
      email: "",
      phoneNumber: "",
      panCard: "",
      address: "",
      amount: "",
      donationType: "one-time",
      paymentMethod: "credit-card",
      message: "",
      receiveUpdates: false,
    },
  });

  // Handle Razorpay payment
  const handleRazorpayPayment = async (donationId?: string) => {
    try {
      console.log('Initiating Razorpay payment for donation ID:', donationId);
      setApiCallStatus("Initializing payment gateway...");
      
      if (!donationId) {
        throw new Error('Donation ID not available for payment processing');
      }

      const values = lastPaymentDetails?.values || form.getValues();
      const amount = parseFloat(values.amount);
      
      // Handle monthly subscription (SIP)
      if (values.donationType === 'monthly') {
        await handleMonthlySubscription(donationId, amount, values);
      } else {
        // Handle one-time payment
        await handleOneTimePayment(donationId, amount, values);
      }
      
    } catch (error) {
      console.error('Payment processing error:', error);
      setApiCallStatus(`❌ Payment Error: ${error.message}`);
      if (donationId) {
        await updateDonationStatus(donationId, 'failed');
      }
      alert('Payment processing failed: ' + error.message);
    }
  };

  // Handle one-time payment
  const handleOneTimePayment = async (donationId: string, amount: number, values: z.infer<typeof formSchema>) => {
    try {
      setApiCallStatus("Creating Razorpay order...");
      
      // Create Razorpay order
      const orderResponse = await fetch('/.netlify/functions/create-order', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          amount: amount * 100, // Convert to paise
          currency: 'INR',
          receipt: `donation_${donationId}`,
          notes: {
            donationId,
            donorName: values.fullName,
            donorEmail: values.email
          }
        })
      });

      const orderData = await orderResponse.json();
      if (!orderData.success) {
        throw new Error(orderData.error || 'Failed to create payment order');
      }

      setApiCallStatus("Opening Razorpay checkout...");
      
      // Initialize Razorpay checkout
      const options = {
        key: import.meta.env.VITE_RAZORPAY_KEY_ID || 'rzp_test_your_key',
        amount: orderData.order.amount,
        currency: orderData.order.currency,
        name: 'ISKCON Donation',
        description: 'Support our mission',
        order_id: orderData.order.id,
        handler: async (response: any) => {
          await handlePaymentSuccess(donationId, response, 'one-time');
        },
        modal: {
          ondismiss: async () => {
            setApiCallStatus("Payment cancelled by user");
            await updateDonationStatus(donationId, 'cancelled');
          }
        },
        prefill: {
          name: values.fullName,
          email: values.email,
          contact: values.phoneNumber || ''
        },
        theme: {
          color: '#3399cc'
        }
      };

      // Create and open Razorpay instance
      const rzp = new (window as any).Razorpay(options);
      rzp.open();
      
    } catch (error) {
      console.error('One-time payment error:', error);
      throw error;
    }
  };

  // Handle monthly subscription
  const handleMonthlySubscription = async (donationId: string, amount: number, values: z.infer<typeof formSchema>) => {
    try {
      setApiCallStatus("Getting subscription plan...");
      
      // Get plan ID for the amount
      const planResponse = await fetch(`/.netlify/functions/get-plan-id?amount=${amount}`);
      const planData = await planResponse.json();
      
      if (!planData.success) {
        throw new Error(planData.error || 'Failed to get subscription plan');
      }

      setApiCallStatus("Creating subscription...");
      
      // Create subscription
      const subscriptionResponse = await fetch('/.netlify/functions/create-subscription', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          planId: planData.planId,
          customerDetails: {
            name: values.fullName,
            email: values.email
          },
          notes: {
            donationId,
            donationType: 'monthly'
          }
        })
      });

      const subscriptionData = await subscriptionResponse.json();
      if (!subscriptionData.success) {
        throw new Error(subscriptionData.error || 'Failed to create subscription');
      }

      setApiCallStatus("Opening subscription payment...");
      
      // Update donation with subscription ID
      await updateDonationStatus(donationId, 'pending', undefined, subscriptionData.subscription.id);
      
      // Initialize Razorpay for subscription
      const options = {
        key: import.meta.env.VITE_RAZORPAY_KEY_ID || 'rzp_test_your_key',
        subscription_id: subscriptionData.subscription.id,
        name: 'ISKCON Monthly Donation',
        description: `Monthly donation of ₹${amount}`,
        handler: async (response: any) => {
          await handlePaymentSuccess(donationId, response, 'monthly');
        },
        modal: {
          ondismiss: async () => {
            setApiCallStatus("Subscription cancelled by user");
            await updateDonationStatus(donationId, 'cancelled');
          }
        },
        prefill: {
          name: values.fullName,
          email: values.email,
          contact: values.phoneNumber || ''
        },
        theme: {
          color: '#3399cc'
        }
      };

      const rzp = new (window as any).Razorpay(options);
      rzp.open();
      
    } catch (error) {
      console.error('Subscription payment error:', error);
      throw error;
    }
  };

  // Handle payment success
  const handlePaymentSuccess = async (donationId: string, paymentResponse: any, paymentType: string) => {
    try {
      setApiCallStatus("Verifying payment...");
      
      // Verify payment with backend
      const verificationResponse = await fetch('/.netlify/functions/verify-payment', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify(paymentResponse)
      });

      const verificationData = await verificationResponse.json();
      
      if (verificationData.success) {
        setApiCallStatus("Payment verified successfully!");
        
        // Update donation status to completed
        await updateDonationStatus(
          donationId, 
          'completed', 
          paymentResponse.razorpay_payment_id,
          paymentResponse.razorpay_subscription_id
        );
        
        setIsSuccess(true);
        setApiCallStatus("✅ Donation completed successfully!");
        alert('Payment successful! Thank you for your donation.');
      } else {
        throw new Error('Payment verification failed');
      }
      
    } catch (error) {
      console.error('Payment verification error:', error);
      setApiCallStatus(`❌ Payment verification failed: ${error.message}`);
      await updateDonationStatus(donationId, 'failed');
      alert('Payment verification failed. Please contact support.');
    }
  };

  // Handle amount selection
  const handleAmountSelection = (amount: number) => {
    setSelectedAmount(amount.toString());
    form.setValue('amount', amount.toString());
  };

  // Update donation status after payment
  const updateDonationStatus = async (donationId: string, status: string, paymentId?: string, subscriptionId?: string) => {
    try {
      const apiUrl = `/.netlify/functions/donations`;
      const updateData = {
        donationId,
        status,
        paymentId,
        subscriptionId,
        updatedAt: new Date().toISOString(),
      };

      console.log('Updating donation status:', updateData);
      setApiCallStatus(`Updating donation status to: ${status}`);
      
      const response = await fetch(apiUrl, {
        method: 'PATCH',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify(updateData),
      });
      
      const result = await response.json();
      console.log('Donation status updated:', result);
      
      if (!result.success) {
        throw new Error(result.error || 'Failed to update donation status');
      }
      
      return result;
    } catch (error) {
      console.error('Error updating donation status:', error);
      setApiCallStatus(`❌ Failed to update status: ${error.message}`);
      throw error;
    }
  };

  const onSubmit = async (values: z.infer<typeof formSchema>) => {
    console.log('[DonationForm] onSubmit called', values);
    console.log('[DonationForm] Current window location:', window.location.href);
    setIsSubmitting(true);
    setDonationError(null);
    setApiCallStatus("Saving donation to database...");

    // Always use relative path for Netlify Functions in production
    const apiUrl = `/.netlify/functions/donations`;
    setApiCallStatus(`Calling: ${apiUrl}`);
    console.log('[DonationForm] API URL:', apiUrl);

    // Create donation record FIRST, regardless of payment status
    const donationData = {
      donorName: values.fullName,
      donorEmail: values.email,
      donorPhone: values.phoneNumber || null,
      amount: parseFloat(values.amount),
      currency: 'INR',
      paymentType: values.donationType === 'one-time' ? 'one-time' : 'monthly',
      message: values.message || null,
      status: 'pending', // Start with pending status
      panCard: values.panCard || null,
      address: values.address || null,
      paymentId: null,
      subscriptionId: null,
      createdAt: new Date().toISOString(),
      receiveUpdates: values.receiveUpdates,
      paymentMethod: values.paymentMethod,
    };

    console.log('[DonationForm] About to save donation:', donationData);

    try {
      // Step 1: Save donation to database first
      const response = await fetch(apiUrl, {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify(donationData),
      });
      
      console.log('[DonationForm] Donation save request sent, status:', response.status);
      setApiCallStatus(`Database save response: ${response.status} ${response.statusText}`);
      
      const result = await response.json();
      console.log('[DonationForm] Donation save response:', result);
      setLastApiResponse(result);
      
      if (!result.success) {
        setDonationError(result.error || 'Failed to save donation');
        setApiCallStatus(`❌ Database save failed: ${result.error}`);
        setIsSubmitting(false);
        return; // Don't proceed to payment if database save fails
      }
      
      const donationId = result.donation?.id;
      setApiCallStatus(`✅ Donation saved! ID: ${donationId}. Proceeding to payment...`);
      
      // Step 2: Store payment details for success page
      setLastPaymentDetails({
        values,
        paymentId: undefined,
        subscriptionId: undefined,
      });
      
      // Step 3: Proceed to payment processing
      await handleRazorpayPayment(donationId);
      
    } catch (error) {
      console.error('[DonationForm] Error saving donation:', error);
      setDonationError('Network error: ' + (error.message || error));
      setApiCallStatus(`❌ Network Error: ${(error.message || error)}`);
      alert('Failed to save donation to database: ' + (error.message || error));
    } finally {
      setIsSubmitting(false);
    }
  }

  return (
      <Card className="w-full max-w-2xl mx-auto">
        <CardHeader>
          <CardTitle>Make a Donation</CardTitle>
          <CardDescription>
            Support our mission to create sustainable technology solutions for communities in need.
          </CardDescription>
        </CardHeader>
        <CardContent>
          <Form {...form}>
            <form onSubmit={form.handleSubmit(onSubmit)} className="space-y-6">
              {/* Donation Amount Selection */}
              <div className="space-y-3">
                <FormLabel>Select Donation Amount</FormLabel>
                <div className="grid grid-cols-3 gap-3">
                  {["250", "500", "1000", "2500", "5000", "10000"].map((amount) => (
                    <Button
                      key={amount}
                      type="button"
                      variant={selectedAmount === amount ? "default" : "outline"}
                      className={selectedAmount === amount ? "bg-prachetas-yellow text-black hover:bg-prachetas-orange" : ""}
                      onClick={() => handleAmountSelection(Number(amount))}
                    >
                      ₹{amount}
                    </Button>
                  ))}
                </div>
                <FormField
                  control={form.control}
                  name="amount"
                  render={({ field }) => (
                  <FormItem>
                    <FormControl>
                      <div className="relative">
                        <BadgeDollarSign className="absolute left-3 top-2.5 h-5 w-5 text-gray-400" />
                        <Input
                          placeholder="Custom Amount"
                          {...field}
                          className="pl-10"
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
              </div>
              {/* Donation Type */}
              <FormField
                control={form.control}
                name="donationType"
                render={({ field }) => (
                  <FormItem className="space-y-3">
                    <FormLabel>Donation Type</FormLabel>
                    <FormControl>
                      <RadioGroup
                        onValueChange={field.onChange}
                        defaultValue={field.value}
                        className="flex space-x-4"
                      >
                        <div className="flex items-center space-x-2">
                          <RadioGroupItem value="one-time" id="one-time" />
                          <FormLabel htmlFor="one-time" className="font-normal cursor-pointer">
                            One-time Donation
                          </FormLabel>
                        </div>
                        <div className="flex items-center space-x-2">
                          <RadioGroupItem value="monthly" id="monthly" />
                          <FormLabel htmlFor="monthly" className="font-normal cursor-pointer">
                            Monthly Donation
                          </FormLabel>
                        </div>
                      </RadioGroup>
                    </FormControl>
                    <FormMessage />
                  </FormItem>
                )}
              />
              {/* Personal Information */}
              <div className="grid gap-4 md:grid-cols-2">
                <FormField
                  control={form.control}
                  name="fullName"
                  render={({ field }) => (
                    <FormItem>
                      <FormLabel>Full Name</FormLabel>
                      <FormControl>
                        <Input placeholder="John Doe" {...field} />
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
                        <Input placeholder="you@example.com" {...field} />
                      </FormControl>
                      <FormMessage />
                    </FormItem>
                  )}
                />
              </div>
              {/* Additional Information */}
              <div className="grid gap-4 md:grid-cols-2">
                <FormField
                  control={form.control}
                  name="phoneNumber"
                  render={({ field }) => (
                    <FormItem>
                      <FormLabel>Phone Number</FormLabel>
                      <FormControl>
                        <Input placeholder="0000000000" {...field} />
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
                        <Input placeholder="Enter PAN card number" {...field} />
                      </FormControl>
                      <FormMessage />
                    </FormItem>
                  )}
                />
              </div>
              {/* Address */}
              <FormField
                control={form.control}
                name="address"
                render={({ field }) => (
                  <FormItem>
                    <FormLabel>Address</FormLabel>
                    <FormControl>
                      <Textarea
                        placeholder="Enter your address..."
                        className="resize-none"
                        {...field}
                      />
                    </FormControl>
                    <FormMessage />
                  </FormItem>
                )}
              />
              {/* Payment Method */}
              <FormField
                control={form.control}
                name="paymentMethod"
                render={({ field }) => (
                  <FormItem>
                    <FormLabel>Payment Method</FormLabel>
                    <Select onValueChange={field.onChange} defaultValue={field.value}>
                      <FormControl>
                        <SelectTrigger>
                          <SelectValue placeholder="Select a payment method" />
                        </SelectTrigger>
                      </FormControl>
                      <SelectContent>
                        <SelectItem value="credit-card">
                          <div className="flex items-center">
                            <CreditCard className="mr-2 h-4 w-4" /> Credit Card
                          </div>
                        </SelectItem>
                        <SelectItem value="paypal">
                          <div className="flex items-center">
                            <span className="mr-2 font-bold text-blue-600">P</span> PayPal
                          </div>
                        </SelectItem>
                        <SelectItem value="bank-transfer">
                          <div className="flex items-center">
                            <span className="mr-2">🏦</span> Bank Transfer
                          </div>
                        </SelectItem>
                      </SelectContent>
                    </Select>
                    <FormMessage />
                  </FormItem>
                )}
              />
              {/* Message */}
              <FormField
                control={form.control}
                name="message"
                render={({ field }) => (
                  <FormItem>
                    <FormLabel>Message (Optional)</FormLabel>
                    <FormControl>
                      <Textarea
                        placeholder="Share why you're supporting our cause..."
                        className="resize-none"
                        {...field}
                      />
                    </FormControl>
                    <FormMessage />
                  </FormItem>
                )}
              />
              {/* Updates Opt-in */}
              <FormField
                control={form.control}
                name="receiveUpdates"
                render={({ field }) => (
                  <FormItem className="flex flex-row items-start space-x-3 space-y-0">
                    <FormControl>
                      <Checkbox
                        checked={field.value}
                        onCheckedChange={field.onChange}
                      />
                    </FormControl>
                    <div className="space-y-1 leading-none">
                      <FormLabel>
                        Keep me updated about how my donation is making an impact
                      </FormLabel>
                    </div>
                  </FormItem>
                )}
              />
              <Button
                type="submit"
                className="w-full bg-prachetas-yellow text-black hover:bg-prachetas-orange"
                disabled={isSubmitting}
              >
                {isSubmitting ? "Processing..." : (
                  <>
                    <Heart className="mr-2 h-4 w-4" /> Complete Donation
                  </>
                )}
              </Button>
              
              {/* Real-time API Status */}
              {apiCallStatus && (
                <div className="mt-4 p-3 bg-blue-50 border border-blue-200 rounded text-sm">
                  <strong>API Status:</strong> {apiCallStatus}
                </div>
              )}
              
              {lastApiResponse && (
                <div className="mt-2 p-3 bg-green-50 border border-green-200 rounded text-xs">
                  <strong>Last API Response:</strong>
                  <pre className="mt-1 whitespace-pre-wrap">{JSON.stringify(lastApiResponse, null, 2)}</pre>
                </div>
              )}
            </form>
          </Form>
          {/* Direct test button for donation API call */}
          <div className="mt-4">
            <Button
              type="button"
              className="w-full bg-blue-600 text-white"
              onClick={() => {
                const values = form.getValues();
                console.log('Direct test button clicked', values);
                setApiCallStatus("Direct test - Making API call...");
                
                // For production, detect the current domain
                const baseUrl = window.location.hostname === 'localhost' || window.location.hostname === '127.0.0.1' 
                  ? 'http://localhost:8888' 
                  : `https://${window.location.hostname}`;
                
                const apiUrl = `${baseUrl}/.netlify/functions/donations`;
                setApiCallStatus(`Direct test - Calling: ${apiUrl}`);
                  
                fetch(apiUrl, {
                  method: 'POST',
                  headers: {
                    'Content-Type': 'application/json',
                  },
                  body: JSON.stringify({
                    donorName: values.fullName || 'Test User',
                    donorEmail: values.email || 'test@example.com',
                    donorPhone: values.phoneNumber || null,
                    amount: parseFloat(values.amount) || 100,
                    currency: 'INR',
                    paymentType: values.donationType === 'one-time' ? 'one-time' : 'monthly',
                    message: values.message || null,
                    status: 'test-direct',
                    panCard: values.panCard || null,
                    address: values.address || null,
                    paymentId: null,
                    subscriptionId: null
                  }),
                })
                  .then(async (response) => {
                    console.log('Direct test donation request sent, status:', response.status);
                    setApiCallStatus(`Direct test - Response: ${response.status} ${response.statusText}`);
                    const result = await response.json();
                    console.log('Direct test donation response:', result);
                    setLastApiResponse(result);
                    if (result.success) {
                      setApiCallStatus(`✅ Direct test SUCCESS! Donation ID: ${result.donation?.id}`);
                    } else {
                      setApiCallStatus(`❌ Direct test failed: ${result.error}`);
                    }
                  })
                  .catch((error) => {
                    console.error('Direct test error saving donation:', error);
                    setApiCallStatus(`❌ Direct test network error: ${error.message}`);
                  });
              }}
            >
              Test Direct Donation API Call
            </Button>
          </div>
        </CardContent>
      </Card>
    );
};

export default DonationForm;
