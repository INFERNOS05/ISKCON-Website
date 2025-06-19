import { Carousel, CarouselContent, CarouselItem, CarouselNext, CarouselPrevious } from "@/components/ui/carousel";
import { Card, CardContent } from "@/components/ui/card";
import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar";
import { Quote } from "lucide-react";

const TestimonialsSection = () => {
  const testimonials = [
    {
      id: 1,
      quote: "The educational support from Prachetas Foundation has transformed our village school. The children now have access to quality learning materials and dedicated teachers.",
      name: "Priya Sharma",
      title: "School Principal, Pune",
      avatar: "/placeholder.svg"
    },
    {
      id: 2,
      quote: "The healthcare camp organized by Prachetas Foundation provided essential medical care to over 500 people in our community who otherwise wouldn't have access to these services.",
      name: "Dr. Rajesh Kumar",
      title: "Medical Volunteer",
      avatar: "/placeholder.svg"
    },
    {
      id: 3,
      quote: "Thanks to the vocational training program by Prachetas Foundation, I was able to learn tailoring skills and now support my family with a steady income from my small business.",
      name: "Lakshmi Devi",
      title: "Program Beneficiary",
      avatar: "/placeholder.svg"
    },
    {
      id: 4,
      quote: "Volunteering with Prachetas Foundation has been a life-changing experience. The direct impact we make in communities gives me purpose and hope for a better future for all.",
      name: "Vikram Mehta",
      title: "Regular Volunteer",
      avatar: "/placeholder.svg"
    }
  ];

  return (
    <section className="py-16 bg-[#2C5530]">
      <div className="container mx-auto px-4">
        <div className="max-w-3xl mx-auto text-center mb-12">
          <h2 className="text-4xl font-bold mb-4 text-white">Making A Difference</h2>
          <p className="text-gray-100 text-lg">
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
                <Card className="bg-white/10 backdrop-blur-sm border-none">
                  <CardContent className="p-6">
                    <Quote className="h-8 w-8 text-[#FFD700] mb-4" />
                    <blockquote className="text-white text-lg mb-6 leading-relaxed">
                      "{testimonial.quote}"
                    </blockquote>
                    <div className="flex items-center mt-4">
                      <Avatar className="h-12 w-12 border-2 border-[#D86C1F]">
                        <AvatarImage src={testimonial.avatar} alt={testimonial.name} />
                        <AvatarFallback className="bg-[#D86C1F] text-white">
                          {testimonial.name.split(' ').map(n => n[0]).join('')}
                        </AvatarFallback>
                      </Avatar>
                      <div className="ml-4">
                        <div className="font-semibold text-[#FFD700]">{testimonial.name}</div>
                        <div className="text-gray-100 text-sm">{testimonial.title}</div>
                      </div>
                    </div>
                  </CardContent>
                </Card>
              </CarouselItem>
            ))}
          </CarouselContent>
          <div className="hidden md:flex justify-center mt-8 gap-4">
            <CarouselPrevious className="relative bg-[#D86C1F] hover:bg-[#C35A15] border-none text-white" />
            <CarouselNext className="relative bg-[#D86C1F] hover:bg-[#C35A15] border-none text-white" />
          </div>
        </Carousel>
      </div>
    </section>
  );
};

export default TestimonialsSection;
