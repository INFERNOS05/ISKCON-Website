const ImageKit = require('imagekit');

const imagekit = new ImageKit({
  publicKey: process.env.IMAGEKIT_PUBLIC_KEY || process.env.VITE_IMAGEKIT_PUBLIC_KEY,
  privateKey: process.env.IMAGEKIT_PRIVATE_KEY || process.env.VITE_IMAGEKIT_PRIVATE_KEY,
  urlEndpoint: process.env.IMAGEKIT_URL_ENDPOINT || process.env.VITE_IMAGEKIT_URL_ENDPOINT
});

const headers = {
  'Access-Control-Allow-Origin': '*',
  'Access-Control-Allow-Headers': 'Content-Type',
  'Access-Control-Allow-Methods': 'GET, OPTIONS',
  'Content-Type': 'application/json'
};

// Map category to actual folder names (without leading slash)
const categoryToFolder = {
  all: 'Website',  // Updated to match your folder structure
  education: 'Website/Education',
  healthcare: 'Website/Skill dev',
  community: 'Website/community'
};

// List of allowed image and video file types
const MEDIA_EXTENSIONS = ['.jpg', '.jpeg', '.png', '.gif', '.webp', '.mp4', '.mov'];

// Check if a file is a valid media file
const isMediaFile = (file) => {
  const fileName = file.name?.toLowerCase() || '';
  const fileType = file.fileType?.toLowerCase() || '';
  
  return (
    MEDIA_EXTENSIONS.some(ext => fileName.endsWith(ext)) ||
    fileType.startsWith('image/') ||
    fileType.startsWith('video/') ||
    (file.mimeType && (
      file.mimeType.startsWith('image/') ||
      file.mimeType.startsWith('video/')
    ))
  );
};

// Clean up the file name for display
const cleanupFileName = (fileName) => {
  return fileName
    .replace(/Copy of /, '')  // Remove "Copy of" prefix
    .replace(/WhatsApp (Image|Video) \d{4}-\d{2}-\d{2}.*?(?=\.[^.]*$)/, 'Skill Development Session')  // Clean up WhatsApp file names
    .replace(/\.[^.]*$/, '')  // Remove file extension
    .replace(/[0-9a-f]{8}-[0-9a-f]{4}-[0-9a-f]{4}-[0-9a-f]{4}-[0-9a-f]{12}/, '')  // Remove UUIDs
    .trim();
};

// Process a single file into our standard format
const processFile = (file) => {
  const displayName = cleanupFileName(file.name);
  const isVideo = file.fileType?.startsWith('video/') || file.name.toLowerCase().endsWith('.mp4');

  return {
    fileId: file.fileId,
    name: displayName,
    url: imagekit.url({
      path: file.filePath,
      transformation: isVideo ? [] : [{ quality: 'auto' }]
    }),
    thumbnailUrl: imagekit.url({
      path: file.filePath,
      transformation: [
        { height: 300, width: 300, cropMode: 'extract' },
        { quality: 'auto' }
      ]
    }),
    path: file.filePath,
    type: isVideo ? 'video' : 'image',
    customMetadata: {
      ...file.customMetadata,
      originalName: file.name,
      mimeType: file.fileType || file.mimeType,
      dimensions: `${file.width || 0}x${file.height || 0}`,
      size: file.size
    }
  };
};

// List files from a specific folder
const listFilesFromFolder = async (folder) => {
  try {
    console.log(`[ImageKit Function] Listing files from folder: ${folder}`);
    
    // Remove any leading slashes and handle spaces in folder names
    const normalizedFolder = folder.replace(/^\/+/, '');
    
    const files = await imagekit.listFiles({
      path: normalizedFolder,
      limit: 100,
      searchQuery: 'type = "file"'
    });

    console.log(`[ImageKit Function] Found ${files.length} total files in ${folder}`);
    
    const mediaFiles = files.filter(isMediaFile);
    console.log(`[ImageKit Function] Found ${mediaFiles.length} media files in ${folder}`);
    
    // Log some sample file info for debugging
    if (mediaFiles.length > 0) {
      console.log('Sample file:', {
        name: mediaFiles[0].name,
        type: mediaFiles[0].fileType,
        path: mediaFiles[0].filePath
      });
    }

    return mediaFiles;
  } catch (error) {
    console.error(`[ImageKit Function] Error listing files from ${folder}:`, error);
    return [];
  }
};

exports.handler = async (event, context) => {
  console.log('[ImageKit Function] Starting request handler');
  console.log('[ImageKit Function] Environment check:', {
    hasPublicKey: !!process.env.IMAGEKIT_PUBLIC_KEY || !!process.env.VITE_IMAGEKIT_PUBLIC_KEY,
    hasPrivateKey: !!process.env.IMAGEKIT_PRIVATE_KEY || !!process.env.VITE_IMAGEKIT_PRIVATE_KEY,
    hasUrlEndpoint: !!process.env.IMAGEKIT_URL_ENDPOINT || !!process.env.VITE_IMAGEKIT_URL_ENDPOINT
  });

  try {
    const { category = 'all' } = event.queryStringParameters || {};
    const folder = categoryToFolder[category.toLowerCase()];
    
    if (!folder) {
      throw new Error(`Invalid category: ${category}`);
    }

    console.log(`[ImageKit Function] Processing request for category: ${category}, folder: ${folder}`);
    
    const files = await listFilesFromFolder(folder);
    
    return {
      statusCode: 200,
      headers,
      body: JSON.stringify(files)
    };
  } catch (error) {
    console.error('[ImageKit Function] Error:', error.message);
    return {
      statusCode: 500,
      headers,
      body: JSON.stringify({ error: error.message })
    };
  }
};
