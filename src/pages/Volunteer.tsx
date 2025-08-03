import { useState } from "react";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Textarea } from "@/components/ui/textarea";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { Calendar, MapPin, Users, Heart, BookOpen, Utensils } from "lucide-react";
import { Link } from "react-router-dom";
import Header from "../components/Header";
import Footer from "../components/Footer";

const VolunteerPage = () => {
  const [selectedEvent, setSelectedEvent] = useState<string>("");
  const [formData, setFormData] = useState({
    name: "",
    email: "",
    phone: "",
    experience: "",
    availability: "",
    motivation: ""
  });

  const upcomingEvents = [
    {
      id: "education-drive-sep",
      title: "Education Drive - September",
      date: "September 15, 2025",
      location: "Mumbai, Maharashtra",
      type: "Education",
      icon: BookOpen,
      volunteers: 25,
      description: "Help distribute educational materials and conduct learning sessions for underprivileged children.",
      requirements: "Basic computer skills, patience with children"
    },
    {
      id: "health-camp-oct",
      title: "Community Health Camp",
      date: "October 8, 2025",
      location: "Pune, Maharashtra",
      type: "Healthcare",
      icon: Heart,
      volunteers: 15,
      description: "Assist in organizing health checkups and awareness sessions for rural communities.",
      requirements: "Basic first aid knowledge preferred"
    },
    {
      id: "food-distribution-aug",
      title: "Monthly Food Distribution",
      date: "August 20, 2025",
      location: "Delhi, India",
      type: "Food Security",
      icon: Utensils,
      volunteers: 30,
      description: "Help prepare and distribute nutritious meals to homeless individuals and families.",
      requirements: "Physical fitness for food preparation and distribution"
    },
    {
      id: "youth-workshop-nov",
      title: "Youth Empowerment Workshop",
      date: "November 12, 2025",
      location: "Bangalore, Karnataka",
      type: "Youth Development",
      icon: Users,
      volunteers: 20,
      description: "Mentor young adults in skill development and career guidance sessions.",
      requirements: "Professional experience, mentoring skills"
    }
  ];

  const handleInputChange = (field: string, value: string) => {
    setFormData(prev => ({ ...prev, [field]: value }));
  };

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    // Handle form submission
    alert("Thank you for volunteering! We'll contact you soon with more details.");
  };

  return (
    <div className="min-h-screen bg-gray-50">
      <Header />
      
      {/* Hero Section */}
      <section className="py-16 bg-prachetas-black text-white">
        <div className="container mx-auto px-4">
          <div className="max-w-4xl mx-auto text-center">
            <h1 className="text-4xl md:text-5xl font-bold mb-6 text-prachetas-yellow">Volunteer With Us</h1>
            <p className="text-xl text-gray-300 mb-8 leading-relaxed">
              Make a difference by joining our upcoming events. Choose to volunteer your time or make a donation to support our cause.
            </p>
          </div>
        </div>
      </section>

      {/* Event Selection */}
      <section className="py-16 bg-white">
        <div className="container mx-auto px-4">
          <div className="max-w-6xl mx-auto">
            <h2 className="text-3xl font-bold mb-8 text-center text-prachetas-black">Choose an Event</h2>
            <div className="grid md:grid-cols-2 gap-8 mb-12">
              {upcomingEvents.map((event) => (
                <Card 
                  key={event.id} 
                  className={`hover:shadow-lg transition-all duration-300 cursor-pointer border-2 ${
                    selectedEvent === event.id ? 'border-prachetas-yellow bg-prachetas-yellow/5' : 'border-gray-200'
                  }`}
                  onClick={() => setSelectedEvent(event.id)}
                >
                  <CardHeader>
                    <div className="flex items-start justify-between">
                      <div className="flex items-center space-x-3">
                        <div className="bg-prachetas-yellow text-prachetas-black p-2 rounded-lg">
                          <event.icon className="h-6 w-6" />
                        </div>
                        <div>
                          <CardTitle className="text-xl text-prachetas-black">{event.title}</CardTitle>
                          <CardDescription className="text-prachetas-medium-gray">{event.type}</CardDescription>
                        </div>
                      </div>
                    </div>
                  </CardHeader>
                  <CardContent>
                    <p className="text-prachetas-medium-gray mb-4">{event.description}</p>
                    <div className="space-y-2 text-sm text-prachetas-medium-gray">
                      <div className="flex items-center space-x-2">
                        <Calendar className="h-4 w-4 text-prachetas-yellow" />
                        <span>{event.date}</span>
                      </div>
                      <div className="flex items-center space-x-2">
                        <MapPin className="h-4 w-4 text-prachetas-yellow" />
                        <span>{event.location}</span>
                      </div>
                      <div className="flex items-center space-x-2">
                        <Users className="h-4 w-4 text-prachetas-yellow" />
                        <span>{event.volunteers} volunteers needed</span>
                      </div>
                    </div>
                    <div className="mt-4 pt-4 border-t border-gray-200">
                      <p className="text-sm text-prachetas-medium-gray">
                        <strong>Requirements:</strong> {event.requirements}
                      </p>
                    </div>
                    <div className="mt-4 flex space-x-3">
                      <Button 
                        className="flex-1 bg-prachetas-yellow text-prachetas-black hover:bg-prachetas-bright-yellow"
                        onClick={(e) => {
                          e.stopPropagation();
                          setSelectedEvent(event.id);
                          // Scroll to the form section
                          setTimeout(() => {
                            const formSection = document.getElementById('volunteer-form');
                            if (formSection) {
                              formSection.scrollIntoView({ behavior: 'smooth' });
                            }
                          }, 100);
                        }}
                      >
                        Volunteer
                      </Button>
                      <Button 
                        asChild
                        variant="outline" 
                        className="flex-1 border-prachetas-yellow text-prachetas-yellow hover:bg-prachetas-yellow hover:text-prachetas-black"
                        onClick={(e) => e.stopPropagation()}
                      >
                        <Link to="/donate">Donate Instead</Link>
                      </Button>
                    </div>
                  </CardContent>
                </Card>
              ))}
            </div>
          </div>
        </div>
      </section>

      {/* Volunteer Form */}
      {selectedEvent && (
        <section id="volunteer-form" className="py-16 bg-gray-100">
          <div className="container mx-auto px-4">
            <div className="max-w-2xl mx-auto">
              <Card>
                <CardHeader>
                  <CardTitle className="text-2xl text-prachetas-black">Volunteer Registration</CardTitle>
                  <CardDescription>
                    Complete this form to register for: <strong>{upcomingEvents.find(e => e.id === selectedEvent)?.title}</strong>
                  </CardDescription>
                </CardHeader>
                <CardContent>
                  <form onSubmit={handleSubmit} className="space-y-6">
                    <div className="grid md:grid-cols-2 gap-4">
                      <div>
                        <Label htmlFor="name">Full Name *</Label>
                        <Input
                          id="name"
                          value={formData.name}
                          onChange={(e) => handleInputChange('name', e.target.value)}
                          required
                        />
                      </div>
                      <div>
                        <Label htmlFor="email">Email Address *</Label>
                        <Input
                          id="email"
                          type="email"
                          value={formData.email}
                          onChange={(e) => handleInputChange('email', e.target.value)}
                          required
                        />
                      </div>
                    </div>
                    
                    <div>
                      <Label htmlFor="phone">Phone Number *</Label>
                      <Input
                        id="phone"
                        value={formData.phone}
                        onChange={(e) => handleInputChange('phone', e.target.value)}
                        required
                      />
                    </div>

                    <div>
                      <Label htmlFor="availability">Availability</Label>
                      <Select onValueChange={(value) => handleInputChange('availability', value)}>
                        <SelectTrigger>
                          <SelectValue placeholder="Select your availability" />
                        </SelectTrigger>
                        <SelectContent>
                          <SelectItem value="full-day">Full Day</SelectItem>
                          <SelectItem value="morning">Morning Only</SelectItem>
                          <SelectItem value="afternoon">Afternoon Only</SelectItem>
                          <SelectItem value="evening">Evening Only</SelectItem>
                        </SelectContent>
                      </Select>
                    </div>

                    <div>
                      <Label htmlFor="experience">Previous Volunteer Experience</Label>
                      <Textarea
                        id="experience"
                        placeholder="Tell us about any previous volunteer experience..."
                        value={formData.experience}
                        onChange={(e) => handleInputChange('experience', e.target.value)}
                      />
                    </div>

                    <div>
                      <Label htmlFor="motivation">Why do you want to volunteer with us?</Label>
                      <Textarea
                        id="motivation"
                        placeholder="Share your motivation..."
                        value={formData.motivation}
                        onChange={(e) => handleInputChange('motivation', e.target.value)}
                      />
                    </div>

                    <Button 
                      type="submit" 
                      className="w-full bg-prachetas-yellow text-prachetas-black hover:bg-prachetas-bright-yellow text-lg py-6"
                    >
                      Register as Volunteer
                    </Button>
                  </form>
                </CardContent>
              </Card>
            </div>
          </div>
        </section>
      )}

      <Footer />
    </div>
  );
};

export default VolunteerPage;
