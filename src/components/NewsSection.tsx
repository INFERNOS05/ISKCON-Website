
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Calendar, ArrowRight } from "lucide-react";

const NewsSection = () => {
  const news = [
    {
      title: "New Education Center Opens in Rural Bangladesh",
      excerpt: "Our latest education facility will serve over 500 children in the remote village of Sundarganj.",
      date: "March 15, 2024",
      image: "https://images.unsplash.com/photo-1581091226825-a6a2a5aee158?ixlib=rb-4.0.3&auto=format&fit=crop&w=400&q=80"
    },
    {
      title: "Clean Water Initiative Reaches 10,000 Families",
      excerpt: "Our water and sanitation program has successfully provided clean drinking water to communities across three districts.",
      date: "March 10, 2024",
      image: "https://images.unsplash.com/photo-1506744038136-46273834b3fb?ixlib=rb-4.0.3&auto=format&fit=crop&w=400&q=80"
    },
    {
      title: "Annual Impact Report 2023 Released",
      excerpt: "Discover how your support created lasting change for children and families around the world last year.",
      date: "March 5, 2024",
      image: "https://images.unsplash.com/photo-1488590528505-98d2b5aba04b?ixlib=rb-4.0.3&auto=format&fit=crop&w=400&q=80"
    }
  ];

  return (
    <section className="py-20 bg-gray-50">
      <div className="container mx-auto px-4">
        <div className="text-center mb-16">
          <h2 className="text-4xl font-bold text-gray-900 mb-4">Latest News & Updates</h2>
          <p className="text-xl text-gray-600 max-w-3xl mx-auto">
            Stay informed about our recent achievements, upcoming initiatives, and the impact we're making together.
          </p>
        </div>

        <div className="grid md:grid-cols-3 gap-8 mb-12">
          {news.map((article, index) => (
            <Card key={index} className="hover:shadow-lg transition-shadow duration-300">
              <div className="relative">
                <img 
                  src={article.image} 
                  alt={article.title}
                  className="w-full h-48 object-cover rounded-t-lg"
                />
              </div>
              <CardHeader>
                <div className="flex items-center text-sm text-gray-500 mb-2">
                  <Calendar className="h-4 w-4 mr-2" />
                  {article.date}
                </div>
                <CardTitle className="text-green-800 hover:text-green-600 cursor-pointer">
                  {article.title}
                </CardTitle>
                <CardDescription>{article.excerpt}</CardDescription>
              </CardHeader>
              <CardContent>
                <Button variant="ghost" className="text-orange-500 hover:text-orange-600 p-0">
                  Read More <ArrowRight className="h-4 w-4 ml-2" />
                </Button>
              </CardContent>
            </Card>
          ))}
        </div>

        <div className="text-center">
          <Button variant="outline" size="lg" className="border-green-700 text-green-700 hover:bg-green-700 hover:text-white">
            View All News
          </Button>
        </div>
      </div>
    </section>
  );
};

export default NewsSection;
