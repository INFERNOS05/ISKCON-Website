import { type GalleryImage } from "@/lib/imagekit-config";
import { cn } from "@/lib/utils";
import { Play } from "lucide-react";

interface GalleryGridProps {
  images: GalleryImage[];
  loading: boolean;
  error: string | null;
  onRetry?: () => void;
}

export const GalleryGrid = ({ images, loading, error, onRetry }: GalleryGridProps) => {
  if (error) {
    return (
      <div className="text-center py-8">
        <p className="text-red-500 mb-4">{error}</p>
        {onRetry && (
          <button
            onClick={onRetry}
            className="px-4 py-2 bg-primary text-white rounded-md hover:bg-primary/90"
          >
            Retry Loading Media
          </button>
        )}
      </div>
    );
  }

  return (
    <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6 mt-8">
      {loading ? (
        Array.from({ length: 6 }).map((_, idx) => (
          <div 
            key={idx} 
            className="relative h-64 bg-gray-200 rounded-lg animate-pulse overflow-hidden"
          >
            <div className="absolute inset-0 bg-gradient-to-b from-transparent to-gray-300" />
          </div>
        ))
      ) : images.length === 0 ? (
        <div className="col-span-full text-center py-8 text-gray-500">
          No media found in this category
        </div>
      ) : (
        images.map((item) => (
          <div 
            key={item.fileId} 
            className="group relative overflow-hidden rounded-lg bg-gray-100"
          >
            {item.type === 'video' ? (
              <>
                <video
                  src={item.url}
                  poster={item.thumbnailUrl}
                  className={cn(
                    "w-full h-64 object-cover transition-all duration-300",
                    "group-hover:scale-110 group-hover:opacity-75"
                  )}
                  preload="metadata"
                />
                <div className="absolute inset-0 flex items-center justify-center">
                  <Play className="w-12 h-12 text-white opacity-75 group-hover:opacity-100" />
                </div>
              </>
            ) : (
              <img
                src={item.thumbnailUrl}
                alt={item.name}
                className={cn(
                  "w-full h-64 object-cover transition-all duration-300",
                  "group-hover:scale-110 group-hover:opacity-75"
                )}
                loading="lazy"
              />
            )}
            <div className={cn(
              "absolute inset-0 bg-gradient-to-t from-black/80 via-black/40 to-transparent",
              "flex flex-col justify-end p-4",
              "opacity-0 group-hover:opacity-100 transition-opacity duration-300"
            )}>
              <h3 className="text-white font-semibold text-lg">
                {item.name}
              </h3>
              {item.customMetadata?.description && (
                <p className="text-gray-200 text-sm mt-2 line-clamp-2">
                  {item.customMetadata.description}
                </p>
              )}
              <div className="text-gray-300 text-xs mt-2">
                {item.customMetadata?.dimensions}
              </div>
            </div>
          </div>
        ))
      )}
    </div>
  );
};
