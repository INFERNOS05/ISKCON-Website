import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";

const GallerySection = () => {
  const categories = [
    { id: "all", label: "All Projects" },
    { id: "education", label: "Education" },
    { id: "healthcare", label: "Healthcare" },
    { id: "community", label: "Community" },
  ];

  const gallery = [
    {
      id: 1,
      title: "Educational Support in Rural Schools",
      description: "Providing quality education and resources to rural communities",
      image: "/placeholder.svg",
      categories: ["education", "all"]
    },
    {
      id: 2,
      title: "Scholarship Program for Underprivileged Children",
      description: "Creating opportunities through education",
      image: "/placeholder.svg",
      categories: ["education", "all"]
    },
    {
      id: 3,
      title: "Medical Camp in Remote Villages",
      description: "Bringing healthcare to underserved communities",
      image: "/placeholder.svg",
      categories: ["healthcare", "all"]
    },
    {
      id: 4,
      title: "Women Empowerment Initiative",
      description: "Supporting and empowering women in our communities",
      image: "/placeholder.svg",
      categories: ["community", "all"]
    },
    {
      id: 5,
      title: "Vocational Training for Youth",
      description: "Building skills for a better future",
      image: "/placeholder.svg",
      categories: ["education", "community", "all"]
    },
    {
      id: 6,
      title: "Health Awareness Drive",
      description: "Promoting health education and preventive care",
      image: "/placeholder.svg",
      categories: ["healthcare", "all"]
    }
  ];

  return (
    <section className="py-16 bg-[#F5F1E8]">
      <div className="container mx-auto px-4">
        <div className="max-w-3xl mx-auto text-center mb-12">
          <h2 className="text-4xl font-bold mb-4 text-[#2C5530]">Our Impact Gallery</h2>
          <p className="text-[#333333] text-lg mb-8">
            Explore our initiatives that are transforming lives across communities
          </p>
        </div>

        <Tabs defaultValue="all" className="w-full">
          <TabsList className="flex justify-center mb-8 bg-transparent border-b border-gray-200">
            {categories.map((category) => (
              <TabsTrigger
                key={category.id}
                value={category.id}
                className="px-6 py-3 text-lg font-medium data-[state=active]:text-[#D86C1F] data-[state=active]:border-b-2 data-[state=active]:border-[#D86C1F] transition-colors"
              >
                {category.label}
              </TabsTrigger>
            ))}
          </TabsList>

          {categories.map((category) => (
            <TabsContent key={category.id} value={category.id}>
              <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8">
                {gallery
                  .filter((item) => item.categories.includes(category.id))
                  .map((item) => (
                    <div
                      key={item.id}
                      className="group relative overflow-hidden rounded-lg shadow-lg bg-white hover:shadow-xl transition-shadow"
                    >
                      <div className="aspect-w-16 aspect-h-9">
                        <img
                          src={item.image}
                          alt={item.title}
                          className="w-full h-full object-cover transition-transform group-hover:scale-105"
                        />
                      </div>
                      <div className="p-6">
                        <h3 className="text-xl font-semibold mb-2 text-[#2C5530]">
                          {item.title}
                        </h3>
                        <p className="text-[#333333]">{item.description}</p>
                      </div>
                      <div className="absolute inset-0 bg-gradient-to-t from-black/60 to-transparent opacity-0 group-hover:opacity-100 transition-opacity">
                        <div className="absolute bottom-0 left-0 right-0 p-6">
                          <button className="w-full bg-[#D86C1F] text-white py-2 rounded-md hover:bg-[#C35A15] transition-colors">
                            Learn More
                          </button>
                        </div>
                      </div>
                    </div>
                  ))}
              </div>
            </TabsContent>
          ))}
        </Tabs>
      </div>
    </section>
  );
};

export default GallerySection;
