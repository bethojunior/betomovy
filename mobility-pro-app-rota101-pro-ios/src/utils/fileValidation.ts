/**
 * Limites de tamanho para upload de documentos (40MB)
 * 
 * Valores definidos na apiPhp em:
 * - Backend: config/upload.php (max_file_size = 40MB)
 * - Validação: DocumentController.php (validateFileSize method)
 * - Storage: S3 bucket policy (MaxFileSize = 40MB)
 */
export const FILE_SIZE_LIMITS = {
  DEFAULT: 40 * 1024 * 1024,
  IMAGE: 40 * 1024 * 1024,
  PDF: 40 * 1024 * 1024,
} as const;

const LIMITS_MAP = {
  image: FILE_SIZE_LIMITS.IMAGE,
  pdf: FILE_SIZE_LIMITS.PDF,
  default: FILE_SIZE_LIMITS.DEFAULT,
};

export const getFileSizeLimitMB = (fileType: 'image' | 'pdf' | 'default' = 'default'): number => {
  return Math.round(LIMITS_MAP[fileType] / (1024 * 1024));
};

export const validateFileSize = (
  fileSize: number,
  fileType: 'image' | 'pdf' | 'default' = 'default'
): { isValid: boolean; limitMB?: number } => {
  const limit = LIMITS_MAP[fileType];
  const limitMB = getFileSizeLimitMB(fileType);

  if (!fileSize || fileSize <= 0) {
    return {
      isValid: false,
      limitMB,
    };
  }

  if (fileSize > limit) {
    return {
      isValid: false,
      limitMB,
    };
  }

  return { isValid: true };
};