import { useState, useEffect } from "react";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { RadioGroup, RadioGroupItem } from "@/components/ui/radio-group";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { Textarea } from "@/components/ui/textarea";
import { Switch } from "@/components/ui/switch";
import { Check, CreditCard, Heart, ArrowRight, Smartphone, Building, AlertCircle } from "lucide-react";
import { useSearchParams } from "react-router-dom";

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
  cardNumber?: string;
  cardExpMonth?: string;
  cardExpYear?: string;
  cardCvv?: string;
  upiId?: string;
  bankName?: string;
  amount?: string;
}

type CardInfo = {
  cardNumber: string;
  cardExpMonth: string;
  cardExpYear: string;
  cardCvv: string;
}

type UpiInfo = {
  upiId: string;
}

type BankingInfo = {
  bankName: string;
}

const DonationForm = () => {
  const [searchParams] = useSearchParams();  const [amount, setAmount] = useState<string>("1000");
  const [paymentMethod, setPaymentMethod] = useState<string>("card");
  const [isMonthly, setIsMonthly] = useState<boolean>(false);
  const [formStep, setFormStep] = useState<number>(1);
  const [formSubmitted, setFormSubmitted] = useState<boolean>(false);
  const [isProcessing, setIsProcessing] = useState<boolean>(false);
  const [errors, setErrors] = useState<ValidationErrors>({});

  const [donorInfo, setDonorInfo] = useState<DonorInfo>({
    firstName: "",
    lastName: "",
    email: "",
    phone: "",
    message: ""
  });

  const [cardInfo, setCardInfo] = useState<CardInfo>({
    cardNumber: "",
    cardExpMonth: "",
    cardExpYear: "",
    cardCvv: ""
  });

  const [upiInfo, setUpiInfo] = useState<UpiInfo>({
    upiId: ""
  });

  const [bankingInfo, setBankingInfo] = useState<BankingInfo>({
    bankName: ""
  });

  const predefinedAmounts = ["500", "1000", "2500", "5000", "10000"];
  const banks = [
    "State Bank of India", "HDFC Bank", "ICICI Bank", "Axis Bank", 
    "Punjab National Bank", "Bank of Baroda", "Kotak Mahindra Bank", 
    "Yes Bank", "IndusInd Bank", "Union Bank of India"
  ];

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

  const handleCardInfoChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const { name, value } = e.target;
    setCardInfo({
      ...cardInfo,
      [name]: value
    });

    // Clear validation error when field is filled
    if (value) {
      setErrors({...errors, [name]: undefined});
    }
  };

  const handleSelectChange = (name: string, value: string) => {
    if (name === "cardExpMonth" || name === "cardExpYear") {
      setCardInfo({
        ...cardInfo,
        [name]: value
      });
    } else if (name === "bankName") {
      setBankingInfo({
        ...bankingInfo,
        [name]: value
      });
    }

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
    
    if (paymentMethod === "card") {
      if (!cardInfo.cardNumber.trim()) {
        newErrors.cardNumber = "Card number is required";
      } else if (!/^\d{16}$/.test(cardInfo.cardNumber.replace(/\s/g, ''))) {
        newErrors.cardNumber = "Please enter a valid 16-digit card number";
      }
      
      if (!cardInfo.cardExpMonth) {
        newErrors.cardExpMonth = "Required";
      }
      
      if (!cardInfo.cardExpYear) {
        newErrors.cardExpYear = "Required";
      }
      
      if (!cardInfo.cardCvv.trim()) {
        newErrors.cardCvv = "CVV is required";
      } else if (!/^\d{3,4}$/.test(cardInfo.cardCvv)) {
        newErrors.cardCvv = "Invalid CVV";
      }
    } else if (paymentMethod === "upi") {
      if (!upiInfo.upiId.trim()) {
        newErrors.upiId = "UPI ID is required";
      } else if (!upiInfo.upiId.includes("@")) {
        newErrors.upiId = "Please enter a valid UPI ID";
      }
    } else if (paymentMethod === "netbanking") {
      if (!bankingInfo.bankName) {
        newErrors.bankName = "Please select your bank";
      }
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
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    
    if (formStep === 2 && validateStep2()) {
      setFormStep(3);
      return;
    }
    
    if (formStep === 3) {
      setIsProcessing(true);
      
      // Simulate payment processing
      setTimeout(() => {
        setIsProcessing(false);
        setFormSubmitted(true);
      }, 1500);
    }
  };

  const formatCardNumber = (number: string) => {
    if (!number) return "";
    const cleaned = number.replace(/\s/g, "");
    const groups = cleaned.match(/.{1,4}/g);
    return groups ? groups.join(" ") : "";
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
    setAmount("100");
    setPaymentMethod("card");
    setIsMonthly(false);
    setDonorInfo({
      firstName: "",
      lastName: "",
      email: "",
      phone: "",
      message: ""
    });
    setCardInfo({
      cardNumber: "",
      cardExpMonth: "",
      cardExpYear: "",
      cardCvv: ""
    });
    setUpiInfo({
      upiId: ""
    });
    setBankingInfo({
      bankName: ""
    });
    setErrors({});
  };

  return (
    <section className="py-16 bg-black text-white" id="donate">
      <div className="container mx-auto px-4">
        <div className="max-w-3xl mx-auto bg-gray-900 rounded-none p-8 border-t-4 border-amber-400">
          <div className="mb-8 text-center">
            <h2 className="text-3xl font-bold mb-2">Make a Donation</h2>
            <p className="text-gray-300">
              Your contribution helps us make a difference in the lives of those in need.
            </p>
            {formStep > 1 && !formSubmitted && (
              <div className="flex justify-center mt-6">
                <div className="flex items-center w-full max-w-xs">
                  <div className="w-8 h-8 rounded-full bg-amber-400 text-black flex items-center justify-center">1</div>
                  <div className={`flex-1 h-1 mx-2 ${formStep > 1 ? "bg-amber-400" : "bg-gray-600"}`}></div>
                  <div className={`w-8 h-8 rounded-full flex items-center justify-center ${formStep > 1 ? "bg-amber-400 text-black" : "bg-gray-700 text-gray-400"}`}>2</div>
                  <div className={`flex-1 h-1 mx-2 ${formStep > 2 ? "bg-amber-400" : "bg-gray-600"}`}></div>
                  <div className={`w-8 h-8 rounded-full flex items-center justify-center ${formStep > 2 ? "bg-amber-400 text-black" : "bg-gray-700 text-gray-400"}`}>3</div>
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
                  <span className="text-white">TXN{Math.random().toString(36).substring(2, 10).toUpperCase()}</span>
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
                      {predefinedAmounts.map((value) => (                      <button
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
                      <div className="relative">                        <div className="absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-400">₹</div>
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
                  </div>

                  <Button 
                    type="button"
                    onClick={nextStep}
                    className="w-full bg-amber-400 hover:bg-amber-500 text-black font-medium py-3 rounded-none flex items-center justify-center"
                  >
                    Continue to Payment
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
                  </div>

                  <div className="mb-6">
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
                  </div>

                  <div className="mb-6">
                    <Label className="text-sm mb-2 block">
                      Payment Method <span className="text-red-400">*</span>
                    </Label>
                    <RadioGroup 
                      defaultValue="card" 
                      value={paymentMethod}
                      onValueChange={setPaymentMethod}
                      className="flex flex-col space-y-2"
                    >
                      <div className="flex items-center space-x-2 bg-gray-800 p-4 rounded-none border border-gray-700 hover:border-amber-400/50 cursor-pointer">
                        <RadioGroupItem value="card" id="card" className="text-amber-400" />
                        <Label htmlFor="card" className="flex items-center cursor-pointer">
                          <CreditCard className="h-5 w-5 mr-2 text-gray-400" />
                          Credit / Debit Card
                        </Label>
                      </div>
                      <div className="flex items-center space-x-2 bg-gray-800 p-4 rounded-none border border-gray-700 hover:border-amber-400/50 cursor-pointer">
                        <RadioGroupItem value="upi" id="upi" className="text-amber-400" />
                        <Label htmlFor="upi" className="flex items-center cursor-pointer">
                          <Smartphone className="h-5 w-5 mr-2 text-gray-400" />
                          UPI Payment
                        </Label>
                      </div>
                      <div className="flex items-center space-x-2 bg-gray-800 p-4 rounded-none border border-gray-700 hover:border-amber-400/50 cursor-pointer">
                        <RadioGroupItem value="netbanking" id="netbanking" className="text-amber-400" />
                        <Label htmlFor="netbanking" className="flex items-center cursor-pointer">
                          <Building className="h-5 w-5 mr-2 text-gray-400" />
                          Net Banking
                        </Label>
                      </div>
                    </RadioGroup>
                  </div>

                  {paymentMethod === "card" && (
                    <div className="mb-6 space-y-4">
                      <div>
                        <Label htmlFor="cardNumber" className="text-sm mb-1 block">
                          Card Number <span className="text-red-400">*</span>
                        </Label>
                        <Input
                          id="cardNumber"
                          name="cardNumber"
                          placeholder="1234 5678 9012 3456"
                          value={cardInfo.cardNumber}
                          onChange={(e) => {
                            const value = e.target.value.replace(/\D/g, '').substring(0, 16);
                            setCardInfo({
                              ...cardInfo,
                              cardNumber: value
                            });
                            if (value) {
                              setErrors({...errors, cardNumber: undefined});
                            }
                          }}
                          className={`bg-gray-800 border-gray-700 rounded-none ${errors.cardNumber ? "border-red-400 focus:border-red-400" : "focus:border-amber-400"}`}
                          required
                        />
                        {errors.cardNumber && (
                          <p className="text-red-400 text-sm mt-1 flex items-center">
                            <AlertCircle className="h-4 w-4 mr-1" />
                            {errors.cardNumber}
                          </p>
                        )}
                      </div>
                      <div className="grid grid-cols-3 gap-4">
                        <div>
                          <Label htmlFor="cardExpMonth" className="text-sm mb-1 block">
                            Month <span className="text-red-400">*</span>
                          </Label>
                          <Select 
                            value={cardInfo.cardExpMonth}
                            onValueChange={(value) => handleSelectChange("cardExpMonth", value)}
                          >
                            <SelectTrigger className={`bg-gray-800 border-gray-700 rounded-none ${errors.cardExpMonth ? "border-red-400 focus:border-red-400" : "focus:border-amber-400"}`}>
                              <SelectValue placeholder="MM" />
                            </SelectTrigger>
                            <SelectContent className="bg-gray-800 text-white border-gray-700">
                              {Array.from({ length: 12 }, (_, i) => i + 1).map((month) => (
                                <SelectItem key={month} value={month.toString().padStart(2, "0")}>
                                  {month.toString().padStart(2, "0")}
                                </SelectItem>
                              ))}
                            </SelectContent>
                          </Select>
                          {errors.cardExpMonth && (
                            <p className="text-red-400 text-sm mt-1 flex items-center">
                              <AlertCircle className="h-4 w-4 mr-1" />
                              {errors.cardExpMonth}
                            </p>
                          )}
                        </div>
                        <div>
                          <Label htmlFor="cardExpYear" className="text-sm mb-1 block">
                            Year <span className="text-red-400">*</span>
                          </Label>
                          <Select
                            value={cardInfo.cardExpYear}
                            onValueChange={(value) => handleSelectChange("cardExpYear", value)}
                          >
                            <SelectTrigger className={`bg-gray-800 border-gray-700 rounded-none ${errors.cardExpYear ? "border-red-400 focus:border-red-400" : "focus:border-amber-400"}`}>
                              <SelectValue placeholder="YY" />
                            </SelectTrigger>
                            <SelectContent className="bg-gray-800 text-white border-gray-700">
                              {Array.from({ length: 10 }, (_, i) => new Date().getFullYear() + i).map((year) => (
                                <SelectItem key={year} value={year.toString().substr(2)}>
                                  {year}
                                </SelectItem>
                              ))}
                            </SelectContent>
                          </Select>
                          {errors.cardExpYear && (
                            <p className="text-red-400 text-sm mt-1 flex items-center">
                              <AlertCircle className="h-4 w-4 mr-1" />
                              {errors.cardExpYear}
                            </p>
                          )}
                        </div>
                        <div>
                          <Label htmlFor="cardCvv" className="text-sm mb-1 block">
                            CVV <span className="text-red-400">*</span>
                          </Label>
                          <Input
                            id="cardCvv"
                            name="cardCvv"
                            placeholder="123"
                            value={cardInfo.cardCvv}
                            onChange={(e) => {
                              const value = e.target.value.replace(/\D/g, '').substring(0, 4);
                              setCardInfo({
                                ...cardInfo,
                                cardCvv: value
                              });
                              if (value) {
                                setErrors({...errors, cardCvv: undefined});
                              }
                            }}
                            className={`bg-gray-800 border-gray-700 rounded-none ${errors.cardCvv ? "border-red-400 focus:border-red-400" : "focus:border-amber-400"}`}
                            required
                          />
                          {errors.cardCvv && (
                            <p className="text-red-400 text-sm mt-1 flex items-center">
                              <AlertCircle className="h-4 w-4 mr-1" />
                              {errors.cardCvv}
                            </p>
                          )}
                        </div>
                      </div>
                    </div>
                  )}

                  {paymentMethod === "upi" && (
                    <div className="mb-6">
                      <Label htmlFor="upiId" className="text-sm mb-1 block">
                        UPI ID <span className="text-red-400">*</span>
                      </Label>
                      <Input
                        id="upiId"
                        placeholder="yourname@upi"
                        value={upiInfo.upiId}
                        onChange={(e) => {
                          const value = e.target.value;
                          setUpiInfo({
                            ...upiInfo,
                            upiId: value
                          });
                          if (value) {
                            setErrors({...errors, upiId: undefined});
                          }
                        }}
                        className={`bg-gray-800 border-gray-700 rounded-none ${errors.upiId ? "border-red-400 focus:border-red-400" : "focus:border-amber-400"}`}
                        required
                      />
                      {errors.upiId && (
                        <p className="text-red-400 text-sm mt-1 flex items-center">
                          <AlertCircle className="h-4 w-4 mr-1" />
                          {errors.upiId}
                        </p>
                      )}
                      <p className="text-sm text-gray-400 mt-2">
                        Enter your UPI ID (e.g., mobile@paytm, name@okhdfcbank, etc.)
                      </p>
                    </div>
                  )}

                  {paymentMethod === "netbanking" && (
                    <div className="mb-6">
                      <Label htmlFor="bankName" className="text-sm mb-1 block">
                        Select Your Bank <span className="text-red-400">*</span>
                      </Label>
                      <Select
                        value={bankingInfo.bankName}
                        onValueChange={(value) => handleSelectChange("bankName", value)}
                      >
                        <SelectTrigger className={`bg-gray-800 border-gray-700 rounded-none ${errors.bankName ? "border-red-400 focus:border-red-400" : "focus:border-amber-400"}`}>
                          <SelectValue placeholder="Choose your bank" />
                        </SelectTrigger>
                        <SelectContent className="bg-gray-800 text-white border-gray-700">
                          {banks.map((bank) => (
                            <SelectItem key={bank} value={bank}>
                              {bank}
                            </SelectItem>
                          ))}
                        </SelectContent>
                      </Select>
                      {errors.bankName && (
                        <p className="text-red-400 text-sm mt-1 flex items-center">
                          <AlertCircle className="h-4 w-4 mr-1" />
                          {errors.bankName}
                        </p>
                      )}
                      <p className="text-sm text-gray-400 mt-2">
                        You will be redirected to your bank's secure payment portal
                      </p>
                    </div>
                  )}

                  <div className="mb-6">
                    <Label htmlFor="message" className="text-sm mb-1 block">
                      Leave a Message (Optional)
                    </Label>
                    <Textarea
                      id="message"
                      name="message"
                      placeholder="Your message to us..."
                      value={donorInfo.message}
                      onChange={handleDonorInfoChange}
                      className="bg-gray-800 border-gray-700 rounded-none focus:border-amber-400"
                    />
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
                        <span className="text-white">
                          {paymentMethod === "card" && "Credit/Debit Card"}
                          {paymentMethod === "upi" && "UPI"}
                          {paymentMethod === "netbanking" && bankingInfo.bankName}
                        </span>
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
