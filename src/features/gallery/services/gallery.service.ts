import { imagekitService } from "@/lib/imagekit-service";
import { type GalleryImage, type GalleryCategory } from "@/lib/imagekit-config";

export const GalleryService = {
  /**
   * Load images for all gallery categories
   */
  async loadAllImages(): Promise<Record<string, GalleryImage[]>> {
    try {
      const allImages = await imagekitService.listImages('ALL');
      const educationImages = await imagekitService.listImages('EDUCATION');
      const healthcareImages = await imagekitService.listImages('HEALTHCARE');
      const communityImages = await imagekitService.listImages('COMMUNITY');

      return {
        all: allImages,
        education: educationImages,
        healthcare: healthcareImages,
        community: communityImages,
      };
    } catch (error) {
      console.error('Error loading gallery images:', error);
      throw new Error('Failed to load gallery images');
    }
  },

  /**
   * Load images for a specific category
   */
  async loadCategoryImages(category: GalleryCategory): Promise<GalleryImage[]> {
    try {
      return await imagekitService.listImages(category);
    } catch (error) {
      console.error(`Error loading ${category} images:`, error);
      throw new Error(`Failed to load ${category} images`);
    }
  }
};
