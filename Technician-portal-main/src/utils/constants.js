export const STATUS_COLORS = {
  Pending: { bg: "var(--color-warning-bg)", text: "var(--color-warning)" },
  "In Progress": { bg: "var(--color-info-bg)", text: "var(--color-info)" },
  Completed: { bg: "var(--color-success-bg)", text: "var(--color-success)" },
  Cancelled: { bg: "var(--color-danger-bg)", text: "var(--color-danger)" },
  Verified: { bg: "var(--color-success-bg)", text: "var(--color-success)" },
};

export const MAX_FILE_SIZE_MB = 10;
export const ALLOWED_IMAGE_TYPES = ["image/jpeg", "image/png", "image/webp"];
export const ALLOWED_VIDEO_TYPES = ["video/mp4", "video/quicktime", "video/webm"];
