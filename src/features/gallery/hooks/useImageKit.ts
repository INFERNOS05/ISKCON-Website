import { useState, useEffect } from 'react';
import ImageKit from 'imagekit-javascript';
import { imagekitConfig } from '@/lib/imagekit-config';

interface ImageKitAuth {
  token: string;
  expire: number;
  signature: string;
}

interface UseImageKitResult {
  imagekit: ImageKit | null;
  loading: boolean;
  error: string | null;
  getTransformedUrl: (path: string, transformation?: Array<Record<string, any>>) => string;
}

export const useImageKit = (): UseImageKitResult => {
  const [imagekit, setImagekit] = useState<ImageKit | null>(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  useEffect(() => {
    const initializeImageKit = async () => {
      try {
        setLoading(true);
        setError(null);

        // Fetch authentication parameters from our backend
        const response = await fetch('/api/imagekit-auth');
        if (!response.ok) {
          throw new Error('Failed to get ImageKit authentication');
        }

        const auth: ImageKitAuth = await response.json();
        console.log('[ImageKit Hook] Got authentication parameters:', {
          hasToken: !!auth.token,
          expire: auth.expire
        });

        // Initialize ImageKit with authentication parameters
        const ik = new ImageKit({
          urlEndpoint: imagekitConfig.urlEndpoint,
          publicKey: imagekitConfig.publicKey,
          authenticationEndpoint: '/api/imagekit-auth'
        });

        setImagekit(ik);
      } catch (err) {
        console.error('[ImageKit Hook] Initialization error:', err);
        setError(err instanceof Error ? err.message : 'Failed to initialize image service');
      } finally {
        setLoading(false);
      }
    };

    initializeImageKit();
  }, []);

  const getTransformedUrl = (path: string, transformation: Array<Record<string, any>> = []) => {
    if (!imagekit) {
      console.warn('[ImageKit Hook] Trying to get URL before initialization');
      return '';
    }
    
    return imagekit.url({
      path,
      transformation: [
        ...transformation,
        { quality: 'auto' }
      ]
    });
  };

  return {
    imagekit,
    loading,
    error,
    getTransformedUrl
  };
};
