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
      image: "/placeholder.svg",
      categories: ["education", "all"]
    },
    {
      id: 2,
      title: "Scholarship Program for Underprivileged Children",
      image: "/placeholder.svg",
      categories: ["education", "all"]
    },
    {
      id: 3,
      title: "Medical Camp in Remote Villages",
      image: "/placeholder.svg",
      categories: ["healthcare", "all"]
    },
    {
      id: 4,
      title: "Women Empowerment Initiative",
      image: "/placeholder.svg",
      categories: ["community", "all"]
    },
    {
      id: 5,
      title: "Vocational Training for Youth",
      image: "/placeholder.svg",
      categories: ["education", "community", "all"]
    },
    {
      id: 6,
      title: "Health Awareness Drive",
      image: "/placeholder.svg",
      categories: ["healthcare", "all"]
    }
  ];
  return (
    <section className="py-16 bg-white">
      <div className="container mx-auto px-4">
        <div className="max-w-3xl mx-auto text-center mb-12">
          <h2 className="text-3xl font-bold mb-4">Our Impact Gallery</h2>
          <p className="text-gray-600">
            Explore our initiatives that are transforming lives across communities
          </p>
        </div>

        <Tabs defaultValue="all" className="w-full">
          <div className="flex justify-center mb-8">
            <TabsList className="bg-gray-100">
              {categories.map((category) => (
                <TabsTrigger 
                  key={category.id} 
                  value={category.id}
                  className="data-[state=active]:bg-yellow-400 data-[state=active]:text-black"
                >
                  {category.label}
                </TabsTrigger>
              ))}
            </TabsList>
          </div>

          {categories.map((category) => (
            <TabsContent key={category.id} value={category.id}>
              <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
                {gallery
                  .filter((item) => item.categories.includes(category.id))
                  .map((item) => (
                    <div key={item.id} className="group overflow-hidden rounded-lg shadow-md hover:shadow-xl transition-all border border-gray-200">
                      <div className="relative overflow-hidden aspect-video">
                        <img
                          src={item.image}
                          alt={item.title}
                          className="w-full h-full object-cover transition-transform duration-500 group-hover:scale-110"
                        />
                        <div className="absolute inset-0 bg-gradient-to-t from-black/90 to-transparent opacity-0 group-hover:opacity-100 transition-opacity duration-300 flex items-end p-4">
                          <div>
                            <span className="bg-yellow-400 text-black text-xs px-2 py-1 rounded-full">View Project</span>
                            <h3 className="text-white font-medium mt-2">{item.title}</h3>
                          </div>
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
