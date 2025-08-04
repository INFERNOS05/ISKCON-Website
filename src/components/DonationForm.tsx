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

  const handleAmountSelection = (value: string) => {
    setSelectedAmount(value);
    form.setValue("amount", value);
  };

  const handlePaymentSuccess = async (values: z.infer<typeof formSchema>, paymentId?: string, subscriptionId?: string) => {
    console.log('handlePaymentSuccess called', { values, paymentId, subscriptionId });
    setLastPaymentDetails({ values, paymentId, subscriptionId });
    setIsSuccess(true);
  };

  const RAZORPAY_KEY_ID = import.meta.env.VITE_RAZORPAY_KEY_ID || process.env.RAZORPAY_KEY_ID || '';

  // Add Razorpay payment handler
  const handleRazorpayPayment = async (values: z.infer<typeof formSchema>) => {
    console.log('handleRazorpayPayment called', values);
    setIsSubmitting(true);
    try {
      // 1. Create order on backend (if needed)
      // Example:
      // const orderResponse = await fetch('/.netlify/functions/create-order', { ... });
      // const orderData = await orderResponse.json();

      // 2. Open Razorpay checkout
      // Replace this with your actual Razorpay integration
      if (window.Razorpay) {
        // Razorpay expects amount in paise (INR * 100)
        const amountPaise = Math.round(parseFloat(values.amount) * 100);
        const options = {
          key: RAZORPAY_KEY_ID, // Use key from env
          amount: amountPaise, // Use user-entered amount
          currency: 'INR',
          name: 'Prachetas Foundation',
          description: 'Donation',
          // order_id: orderData.id, // Uncomment when using real order
          handler: function (response) {
            // This is called on payment success!
            handlePaymentSuccess(values, response.razorpay_payment_id, response.razorpay_subscription_id);
          },
          prefill: {
            name: values.fullName,
            email: values.email,
            contact: values.phoneNumber || '',
          },
          theme: {
            color: '#FFD600',
          },
        };
        const rzp = new window.Razorpay(options);
        rzp.open();
      } else {
        alert('Razorpay JS SDK not loaded. Please add Razorpay script to your index.html.');
        setIsSubmitting(false);
      }
    } catch (error) {
      console.error('Payment error:', error);
      setIsSubmitting(false);
    }
  };

  const onSubmit = async (values: z.infer<typeof formSchema>) => {
    console.log('onSubmit called', values);
    // Instead of saving donation here, trigger Razorpay payment
    handleRazorpayPayment(values);
  };

  if (isSuccess) {
    // On success page mount, call backend to save donation if not already done
    React.useEffect(() => {
      if (lastPaymentDetails) {
        setIsSubmitting(true);
        setDonationError(null);
        fetch('/.netlify/functions/donations', {
          method: 'POST',
          headers: {
            'Content-Type': 'application/json',
          },
          body: JSON.stringify({
            donorName: lastPaymentDetails.values.fullName,
            donorEmail: lastPaymentDetails.values.email,
            donorPhone: lastPaymentDetails.values.phoneNumber || null,
            amount: parseFloat(lastPaymentDetails.values.amount),
            currency: 'INR',
            paymentType: lastPaymentDetails.values.donationType === 'one-time' ? 'one-time' : 'monthly',
            message: lastPaymentDetails.values.message || null,
            status: 'completed',
            panCard: lastPaymentDetails.values.panCard || null,
            address: lastPaymentDetails.values.address || null,
            paymentId: lastPaymentDetails.paymentId || null,
            subscriptionId: lastPaymentDetails.subscriptionId || null
          }),
        })
          .then(async (response) => {
            console.log('Donation request sent');
            const result = await response.json();
            console.log('Donation response:', result);
            if (!result.success) {
              setDonationError(result.error || 'Failed to save donation');
            }
          })
          .catch((error) => {
            console.error('Error saving donation:', error);
            setDonationError('Network error: ' + error.message);
          })
          .finally(() => {
            setIsSubmitting(false);
          });
      }
    }, [lastPaymentDetails]);
    return (
      <Card className="w-full max-w-2xl mx-auto">
        <CardContent className="pt-6">
          <div className="text-center py-10">
            <div className="mx-auto w-16 h-16 bg-yellow-100 rounded-full flex items-center justify-center mb-6">
              <Check className="h-8 w-8 text-yellow-600" />
            </div>
            <h2 className="text-2xl font-bold mb-4">Thank You For Your Donation!</h2>
            <p className="text-gray-600 mb-6">
              Your generosity helps us continue our mission to create sustainable technology solutions for communities in need.
            </p>
            <p className="text-gray-600 mb-8">
              A confirmation email has been sent to your email address.
            </p>
            {donationError && (
              <div className="text-red-600 mb-4">{donationError}</div>
            )}
            <Button onClick={() => {
              setIsSuccess(false);
              form.reset();
              setLastPaymentDetails(null);
              setDonationError(null);
            }}>
              Make Another Donation
            </Button>
          </div>
        </CardContent>
      </Card>
    );
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
              <div className="grid grid-cols-3 gap-3">              {["250", "500", "1000", "2500", "5000", "10000"].map((amount) => (
                  <Button
                    key={amount}
                    type="button"
                    variant={selectedAmount === amount ? "default" : "outline"}
                    className={selectedAmount === amount ? "bg-prachetas-yellow text-black hover:bg-prachetas-orange" : ""}
                    onClick={() => handleAmountSelection(amount)}
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
          </form>
        </Form>
      </CardContent>
    </Card>
  );
};

export default DonationForm;
