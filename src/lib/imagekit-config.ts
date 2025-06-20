interface ImageKitConfig {
  urlEndpoint: string;
  publicKey: string;
  authenticationEndpoint?: string;
}

export type GalleryCategory = 'ALL' | 'EDUCATION' | 'HEALTHCARE' | 'COMMUNITY';
export type MediaType = 'image' | 'video';

export interface GalleryImage {
  fileId: string;
  name: string;
  url: string;
  thumbnailUrl: string;
  path: string;
  type: MediaType;
  customMetadata?: {
    title?: string;
    description?: string;
    category?: GalleryCategory;
    originalName?: string;
    mimeType?: string;
    dimensions?: string;
    size?: number;
  };
}

// ImageKit configuration
export const imagekitConfig: ImageKitConfig = {
  urlEndpoint: import.meta.env.VITE_IMAGEKIT_URL_ENDPOINT || '',
  publicKey: import.meta.env.VITE_IMAGEKIT_PUBLIC_KEY || '',
};

// Update folder paths to match ImageKit structure
export const GALLERY_FOLDERS: Record<GalleryCategory, string> = {
  ALL: 'Website',
  EDUCATION: 'Website/Education',
  HEALTHCARE: 'Website/Skill dev',
  COMMUNITY: 'Website/community'
} as const;

export const GALLERY_CATEGORIES = [
  { id: "all", label: "All Projects", category: "ALL" as GalleryCategory },
  { id: "education", label: "Education", category: "EDUCATION" as GalleryCategory },
  { id: "healthcare", label: "Healthcare", category: "HEALTHCARE" as GalleryCategory },
  { id: "community", label: "Community", category: "COMMUNITY" as GalleryCategory },
] as const;
