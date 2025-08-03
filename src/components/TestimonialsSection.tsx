import { Carousel, CarouselContent, CarouselItem, CarouselNext, CarouselPrevious } from "@/components/ui/carousel";
import { Card, CardContent } from "@/components/ui/card";
import { Quote } from "lucide-react";

const TestimonialsSection = () => {
  const testimonials = [
    {
      id: 1,
      quote: "The educational support from Prachetas Foundation has transformed our village school. The children now have access to quality learning materials and dedicated teachers.",
      name: "Priya Sharma",
      title: "School Principal",
      occupation: "Education Administrator, Pune",
      avatar: "/Copy of WhatsApp Image 2025-02-26 at 15.41.35 (1).jpeg"
    },
    {
      id: 2,
      quote: "The healthcare camp organized by Prachetas Foundation provided essential medical care to over 500 people in our community who otherwise wouldn't have access to these services.",
      name: "Dr. Rajesh Kumar",
      title: "Medical Volunteer",
      occupation: "Community Health Specialist",
      avatar: "/Copy of WhatsApp Image 2025-02-27 at 16.10.09 (1).jpeg"
    },
    {
      id: 3,
      quote: "Thanks to the vocational training program by Prachetas Foundation, I was able to learn tailoring skills and now support my family with a steady income from my small business.",
      name: "Lakshmi Devi",
      title: "Program Beneficiary",
      occupation: "Small Business Owner & Tailor",
      avatar: "/Copy of WhatsApp Image 2025-02-26 at 15.50.55 (1).jpeg"
    },
    {
      id: 4,
      quote: "Volunteering with Prachetas Foundation has been a life-changing experience. The direct impact we make in communities gives me purpose and hope for a better future for all.",
      name: "Vikram Mehta",
      title: "Regular Volunteer",
      occupation: "IT Professional & Social Worker",
      avatar: "/Copy of WhatsApp Image 2025-02-27 at 16.15.54.jpeg"
    }
  ];

  return (
    <section className="py-16 bg-prachetas-yellow/10">
      <div className="container mx-auto px-4">
        <div className="max-w-3xl mx-auto text-center mb-12">
          <h2 className="text-4xl font-bold mb-4 text-prachetas-black">Making A Difference</h2>
          <p className="text-prachetas-medium-gray text-lg">
            Hear stories from the communities we serve and those who help us fulfill our mission
          </p>
        </div>

        <Carousel 
          className="w-full max-w-5xl mx-auto"
          opts={{
            align: "start",
            loop: true,
          }}
        >
          <CarouselContent>
            {testimonials.map((testimonial) => (
              <CarouselItem key={testimonial.id} className="md:basis-1/2 lg:basis-1/2 pl-6">
                <Card className="bg-white border border-yellow-200 shadow-lg overflow-hidden h-80">
                  <div className="flex h-full">
                    {/* 1/4 Image Strip */}
                    <div className="w-1/4 relative">
                      <img
                        src={testimonial.avatar}
                        alt={testimonial.name}
                        className="w-full h-full object-cover"
                      />
                      <div className="absolute inset-0 bg-gradient-to-r from-transparent to-black/10"></div>
                    </div>
                    
                    {/* 3/4 Content Area */}
                    <CardContent className="w-3/4 p-6 flex flex-col justify-between">
                      <div>
                        <Quote className="h-6 w-6 text-prachetas-yellow mb-3" />
                        <blockquote className="text-prachetas-medium-gray text-base mb-4 leading-relaxed line-clamp-4">
                          "{testimonial.quote}"
                        </blockquote>
                      </div>
                      
                      <div className="mt-auto">
                        <div className="font-semibold text-prachetas-black text-lg">{testimonial.name}</div>
                        <div className="text-prachetas-yellow text-sm font-medium">{testimonial.title}</div>
                        <div className="text-prachetas-light-gray text-xs mt-1">{testimonial.occupation}</div>
                      </div>
                    </CardContent>
                  </div>
                </Card>
              </CarouselItem>
            ))}
          </CarouselContent>
          <div className="hidden md:flex justify-center mt-8 gap-4">
            <CarouselPrevious className="relative bg-prachetas-yellow hover:bg-yellow-300 border-none text-black" />
            <CarouselNext className="relative bg-prachetas-yellow hover:bg-yellow-300 border-none text-black" />
          </div>
        </Carousel>
      </div>
    </section>
  );
};

export default TestimonialsSection;
