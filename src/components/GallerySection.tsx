import { useEffect, useState } from "react";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { type GalleryImage, GALLERY_CATEGORIES } from "@/lib/imagekit-config";
import { GalleryGrid } from "@/features/gallery/components/GalleryGrid";
import { Alert, AlertDescription } from "@/components/ui/alert";
import { useImageKit } from "@/features/gallery/hooks/useImageKit";

const GallerySection = () => {
  const [images, setImages] = useState<Record<string, GalleryImage[]>>({
    all: [],
    education: [],
    healthcare: [],
    community: [],
  });
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);
  const [selectedCategory, setSelectedCategory] = useState("all");
  
  // Use the ImageKit hook
  const { loading: ikLoading, error: ikError } = useImageKit();

  useEffect(() => {
    const loadImages = async () => {
      try {
        setLoading(true);
        setError(null);
        console.log('[Gallery] Loading images for category:', selectedCategory);
        
        const category = GALLERY_CATEGORIES.find(cat => cat.id === selectedCategory);
        if (!category) {
          throw new Error(`Invalid category: ${selectedCategory}`);
        }

        // Fetch images from our backend function
        const response = await fetch(`/api/list-images?category=${category.id}`);
        if (!response.ok) {
          const errorText = await response.text();
          throw new Error(`Failed to fetch images: ${errorText}`);
        }

        const loadedImages = await response.json();
        console.log(`[Gallery] Loaded ${loadedImages.length} images for ${category.category}`);
        
        setImages(current => ({
          ...current,
          [selectedCategory]: loadedImages
        }));
      } catch (err) {
        console.error('[Gallery] Error loading images:', err);
        setError(err instanceof Error ? err.message : 'Failed to load gallery images');
      } finally {
        setLoading(false);
      }
    };

    if (!ikLoading && !ikError) {
      loadImages();
    }
  }, [selectedCategory, ikLoading, ikError]);

  const handleRetry = async () => {
    if (ikError) {
      // Refresh the page to reinitialize ImageKit
      window.location.reload();
      return;
    }

    try {
      setLoading(true);
      setError(null);
      
      const category = GALLERY_CATEGORIES.find(cat => cat.id === selectedCategory);
      if (!category) return;

      const response = await fetch(`/api/list-images?category=${category.id}`);
      if (!response.ok) {
        const errorText = await response.text();
        throw new Error(`Failed to fetch images: ${errorText}`);
      }

      const loadedImages = await response.json();
      setImages(current => ({
        ...current,
        [selectedCategory]: loadedImages
      }));
    } catch (err) {
      console.error('[Gallery] Retry error:', err);
      setError(err instanceof Error ? err.message : 'Failed to load images');
    } finally {
      setLoading(false);
    }
  };

  // Show ImageKit initialization error if any
  if (ikError) {
    return (
      <section className="py-16 px-4 md:px-8 bg-gray-50">
        <div className="container mx-auto">
          <Alert variant="destructive">
            <AlertDescription>
              Failed to initialize image service: {ikError}
              <button
                onClick={() => window.location.reload()}
                className="ml-4 text-sm underline hover:no-underline"
              >
                Retry
              </button>
            </AlertDescription>
          </Alert>
        </div>
      </section>
    );
  }

  return (
    <section className="py-16 px-4 md:px-8 bg-gray-50">
      <div className="container mx-auto">
        <h2 className="text-3xl md:text-4xl font-bold text-center mb-8">
          Our Impact Gallery
        </h2>

        {error && (
          <Alert variant="destructive" className="mb-6">
            <AlertDescription>
              {error}
              <button
                onClick={handleRetry}
                className="ml-4 text-sm underline hover:no-underline"
              >
                Try Again
              </button>
            </AlertDescription>
          </Alert>
        )}
        
        <Tabs 
          defaultValue="all" 
          className="w-full"
          onValueChange={setSelectedCategory}
        >
          <TabsList className="flex justify-center mb-8">
            {GALLERY_CATEGORIES.map((category) => (
              <TabsTrigger
                key={category.id}
                value={category.id}
                className="px-4 py-2"
              >
                {category.label}
              </TabsTrigger>
            ))}
          </TabsList>

          {GALLERY_CATEGORIES.map((category) => (
            <TabsContent key={category.id} value={category.id}>
              <GalleryGrid 
                images={images[category.id] || []} 
                loading={loading || ikLoading} 
                error={error} 
                onRetry={handleRetry}
              />
            </TabsContent>
          ))}
        </Tabs>
      </div>
    </section>
  );
};

export default GallerySection;
