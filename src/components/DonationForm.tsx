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

  const form = useForm<z.infer<typeof formSchema>>({
    resolver: zodResolver(formSchema),
    defaultValues: {
      fullName: "",
      email: "",
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

  const onSubmit = async (values: z.infer<typeof formSchema>) => {
    setIsSubmitting(true);
    
    try {
      // Here you would normally submit the form data to your backend
      console.log(values);
      
      // Simulate a delay
      await new Promise(resolve => setTimeout(resolve, 1500));
      
      // Show success state
      setIsSuccess(true);
      
    } catch (error) {
      console.error("Error submitting donation:", error);
    } finally {
      setIsSubmitting(false);
    }
  };

  if (isSuccess) {
    return (
      <Card className="w-full max-w-2xl mx-auto">
        <CardContent className="pt-6">
          <div className="text-center py-10">            <div className="mx-auto w-16 h-16 bg-yellow-100 rounded-full flex items-center justify-center mb-6">
              <Check className="h-8 w-8 text-yellow-600" />
            </div>
            <h2 className="text-2xl font-bold mb-4">Thank You For Your Donation!</h2>
            <p className="text-gray-600 mb-6">
              Your generosity helps us continue our mission to create sustainable technology solutions for communities in need.
            </p>
            <p className="text-gray-600 mb-8">
              A confirmation email has been sent to your email address.
            </p>
            <Button onClick={() => {
              setIsSuccess(false);
              form.reset();
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
