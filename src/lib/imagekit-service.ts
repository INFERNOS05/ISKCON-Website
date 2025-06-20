import ImageKit from 'imagekit-javascript';
import { imagekitConfig, type GalleryCategory, type GalleryImage, GALLERY_FOLDERS } from './imagekit-config';

// Initialize ImageKit instance
let imagekit: ImageKit | null = null;

// Cache for gallery images
const imageCache = new Map<GalleryCategory, GalleryImage[]>();

/**
 * Initialize or get ImageKit instance
 */
const getImageKit = async (): Promise<ImageKit> => {
  if (imagekit) return imagekit;

  try {
    console.log('[ImageKit] Initializing service...');
    // Fetch authentication parameters from our backend
    const response = await fetch('/api/imagekit-auth');
    if (!response.ok) {
      throw new Error(`Failed to get ImageKit authentication: ${response.statusText}`);
    }

    const auth = await response.json();
    console.log('[ImageKit] Got authentication parameters');

    // Initialize ImageKit with authentication parameters
    imagekit = new ImageKit({
      ...imagekitConfig,
      urlEndpoint: imagekitConfig.urlEndpoint,
      publicKey: imagekitConfig.publicKey,
    });

    return imagekit;
  } catch (error) {
    console.error('[ImageKit] Service initialization error:', error);
    throw new Error('Failed to initialize ImageKit service');
  }
};

export const imagekitService = {
  /**
   * List images from a specific category/folder with caching
   */
  async listImages(category: GalleryCategory): Promise<GalleryImage[]> {
    try {
      console.log(`[ImageKit] Listing images for category: ${category}`);
      
      // Check cache first
      if (imageCache.has(category)) {
        console.log(`[ImageKit] Returning cached images for ${category}`);
        return imageCache.get(category) || [];
      }

      // Initialize ImageKit (needed for transformations)
      await getImageKit();
      
      const folderPath = GALLERY_FOLDERS[category];
      console.log(`[ImageKit] Fetching images from folder: ${folderPath}`);

      // Fetch images from our backend function
      const response = await fetch(`/api/list-images?category=${category.toLowerCase()}`);
      if (!response.ok) {
        const errorText = await response.text();
        throw new Error(`Failed to fetch images: ${response.statusText}. Details: ${errorText}`);
      }

      const images: GalleryImage[] = await response.json();
      console.log(`[ImageKit] Retrieved ${images.length} images for ${category}`);
      
      // Cache the results
      imageCache.set(category, images);

      return images;
    } catch (error) {
      console.error(`[ImageKit] Error listing images for ${category}:`, error);
      throw error;
    }
  },

  /**
   * Clear the image cache for a specific category or all categories
   */
  clearCache(category?: GalleryCategory) {
    if (category) {
      imageCache.delete(category);
    } else {
      imageCache.clear();
    }
    console.log('[ImageKit] Cache cleared');
  },

  /**
   * Get a transformed URL for an image
   */
  getTransformedUrl(path: string, transformation: any[] = []) {
    if (!imagekit) {
      throw new Error('ImageKit not initialized');
    }

    return imagekit.url({
      path,
      transformation: [
        ...transformation,
        { quality: 'auto' },
      ],
    });
  },
};
