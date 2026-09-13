import { MAX_FILE_SIZE_MB, ALLOWED_IMAGE_TYPES, ALLOWED_VIDEO_TYPES } from "./constants";

export function validateFile(file) {
  if (!file) return { valid: false, error: "No file selected." };

  const sizeMB = file.size / (1024 * 1024);
  if (sizeMB > MAX_FILE_SIZE_MB) {
    return { valid: false, error: `File exceeds ${MAX_FILE_SIZE_MB}MB limit.` };
  }

  const isImage = ALLOWED_IMAGE_TYPES.includes(file.type);
  const isVideo = ALLOWED_VIDEO_TYPES.includes(file.type);

  if (!isImage && !isVideo) {
    return { valid: false, error: "Unsupported file type. Please upload JPG, PNG, WEBP, MP4, MOV or WEBM." };
  }

  return { valid: true, error: null, kind: isImage ? "image" : "video" };
}
