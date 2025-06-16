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
    <section className="py-16 bg-gray-900 text-white">
      <div className="container mx-auto px-4">
        <div className="max-w-3xl mx-auto text-center mb-12">
          <h2 className="text-3xl font-bold mb-4">Making A Difference</h2>
          <p className="text-gray-400">
            Hear stories from the communities we serve and those who help us fulfill our mission
          </p>
        </div>

        <Carousel className="w-full max-w-5xl mx-auto">
          <CarouselContent>
            {testimonials.map((testimonial) => (
              <CarouselItem key={testimonial.id} className="md:basis-1/2 lg:basis-1/2">
                <Card className="border border-gray-800 bg-black h-full">
                  <CardContent className="p-6 flex flex-col h-full">
                    <Quote className="h-8 w-8 text-yellow-400 mb-4" />
                    <p className="text-gray-300 mb-6 flex-grow">"{testimonial.quote}"</p>
                    <div className="flex items-center">
                      <Avatar className="h-10 w-10 mr-4">
                        <AvatarImage src={testimonial.avatar} />
                        <AvatarFallback className="bg-yellow-100 text-yellow-800">
                          {testimonial.name.split(' ').map(n => n[0]).join('')}
                        </AvatarFallback>
                      </Avatar>
                      <div>
                        <p className="font-semibold">{testimonial.name}</p>
                        <p className="text-sm text-gray-500">{testimonial.title}</p>
                      </div>
                    </div>
                  </CardContent>
                </Card>
              </CarouselItem>
            ))}
          </CarouselContent>          <div className="flex justify-center gap-2 mt-8">
            <CarouselPrevious className="static translate-y-0 mx-2 bg-gray-800 hover:bg-yellow-400 hover:text-black border-gray-700" />
            <CarouselNext className="static translate-y-0 mx-2 bg-gray-800 hover:bg-yellow-400 hover:text-black border-gray-700" />
          </div>
        </Carousel>
      </div>
    </section>
  );
};

export default TestimonialsSection;
