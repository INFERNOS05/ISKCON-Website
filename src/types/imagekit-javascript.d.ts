declare module 'imagekit-javascript' {
  export interface ImageKitOptions {
    urlEndpoint: string;
    publicKey: string;
    authenticationEndpoint?: string;
  }

  export interface TransformationOptions {
    height?: number;
    width?: number;
    quality?: string | number;
    cropMode?: string;
    [key: string]: any;
  }

  export interface UrlOptions {
    path: string;
    transformation?: TransformationOptions[];
    [key: string]: any;
  }

  export default class ImageKit {
    constructor(options: ImageKitOptions);
    url(options: UrlOptions): string;
  }
}
