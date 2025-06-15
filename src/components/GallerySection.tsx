import { useState } from "react";
import { Dialog, DialogContent, DialogTrigger } from "@/components/ui/dialog";
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import { ChevronRight, ChevronLeft, X } from "lucide-react";

const GallerySection = () => {
  const [selectedImageIndex, setSelectedImageIndex] = useState<number | null>(null);

  const galleryImages = [
    {
      src: "https://images.unsplash.com/photo-1488521787991-ed7bbaae773c?ixlib=rb-4.0.3&auto=format&fit=crop&w=800&q=80",
      alt: "Children learning in classroom",
      category: "Education",
      location: "Bangladesh"
    },
    {
      src: "https://images.unsplash.com/photo-1526717238673-7a664689bbfd?ixlib=rb-4.0.3&auto=format&fit=crop&w=800&q=80",
      alt: "Clean water initiatives",
      category: "Health",
      location: "Ethiopia"
    },
    {
      src: "https://images.unsplash.com/photo-1541781509699-63a472d18d5a?ixlib=rb-4.0.3&auto=format&fit=crop&w=800&q=80",
      alt: "Community engagement",
      category: "Community",
      location: "India"
    },
    {
      src: "https://images.unsplash.com/photo-1491841651911-c44c30c34548?ixlib=rb-4.0.3&auto=format&fit=crop&w=800&q=80",
      alt: "Children playing",
      category: "Education",
      location: "Kenya"
    },
    {
      src: "https://images.unsplash.com/photo-1581092918056-0c4c3acd3789?ixlib=rb-4.0.3&auto=format&fit=crop&w=800&q=80",
      alt: "Medical assistance",
      category: "Health",
      location: "Nepal"
    },
    {
      src: "https://images.unsplash.com/photo-1444213007800-cff19e5a1234?ixlib=rb-4.0.3&auto=format&fit=crop&w=800&q=80",
      alt: "Natural environment conservation",
      category: "Environment",
      location: "Brazil"
    }
  ];

  const nextImage = () => {
    if (selectedImageIndex === null) return;
    setSelectedImageIndex((selectedImageIndex + 1) % galleryImages.length);
  };

  const prevImage = () => {
    if (selectedImageIndex === null) return;
    setSelectedImageIndex((selectedImageIndex - 1 + galleryImages.length) % galleryImages.length);
  };

  return (    <section className="py-20 bg-gray-900" id="gallery">
      <div className="container mx-auto px-4">
        <div className="text-center mb-16">
          <h2 className="text-4xl font-bold text-amber-400 mb-4">Our Impact Gallery</h2>
          <p className="text-xl text-gray-300 max-w-3xl mx-auto">
            Witness how we're upscaling communities through our impactful projects around the world.
          </p>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
          {galleryImages.map((image, index) => (
            <Dialog key={index}>
              <DialogTrigger asChild>
                <div 
                  className="relative overflow-hidden rounded-xl cursor-pointer group"
                  onClick={() => setSelectedImageIndex(index)}
                >
                  <img 
                    src={image.src} 
                    alt={image.alt}
                    className="w-full h-80 object-cover transform transition-transform duration-500 group-hover:scale-110"
                  />
                  <div className="absolute inset-0 bg-black bg-opacity-40 opacity-0 group-hover:opacity-100 transition-opacity duration-300 flex flex-col justify-end p-4">                    <Badge className="self-start mb-2 bg-amber-500 hover:bg-amber-600">{image.category}</Badge>
                    <p className="text-white font-medium text-lg">{image.alt}</p>
                    <p className="text-gray-200 text-sm">{image.location}</p>
                  </div>
                </div>
              </DialogTrigger>
              <DialogContent className="max-w-4xl bg-black bg-opacity-90 border-none p-0">
                <div className="relative">
                  <Button 
                    variant="ghost" 
                    className="absolute top-2 right-2 text-white hover:bg-black/30 z-50 rounded-full p-2"
                    onClick={(e) => {
                      e.stopPropagation();
                      document.querySelector('[data-radix-focus-guard]')?.parentElement?.click();
                    }}
                  >
                    <X size={24} />
                  </Button>

                  <img 
                    src={galleryImages[selectedImageIndex || index].src} 
                    alt={galleryImages[selectedImageIndex || index].alt}
                    className="w-full max-h-[80vh] object-contain"
                  />
                  
                  <div className="absolute inset-x-0 bottom-0 p-4 bg-black bg-opacity-70">
                    <p className="text-white font-medium text-lg">{galleryImages[selectedImageIndex || index].alt}</p>
                    <p className="text-gray-300 text-sm">{galleryImages[selectedImageIndex || index].location}</p>
                  </div>

                  <Button 
                    variant="ghost" 
                    className="absolute left-2 top-1/2 -translate-y-1/2 bg-black/30 hover:bg-black/50 text-white rounded-full p-2"
                    onClick={(e) => {
                      e.stopPropagation();
                      prevImage();
                    }}
                  >
                    <ChevronLeft size={24} />
                  </Button>
                  
                  <Button 
                    variant="ghost" 
                    className="absolute right-2 top-1/2 -translate-y-1/2 bg-black/30 hover:bg-black/50 text-white rounded-full p-2"
                    onClick={(e) => {
                      e.stopPropagation();
                      nextImage();
                    }}
                  >
                    <ChevronRight size={24} />
                  </Button>
                </div>
              </DialogContent>
            </Dialog>
          ))}
        </div>        <div className="text-center mt-12">
          <Button className="bg-amber-500 hover:bg-amber-600 text-black font-medium">
            View More Gallery Items
          </Button>
        </div>
      </div>
    </section>
  );
};

export default GallerySection;
