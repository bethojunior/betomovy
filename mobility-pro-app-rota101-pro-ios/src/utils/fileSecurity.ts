/**
 * Utilitários de sanitização segura de arquivos
 * Previne vulnerabilidades de injeção de comando OS (CWE-78, 77, 88, 20)
 */

/**
 * Sanitiza nome de arquivo removendo caracteres perigosos e limitando tamanho
 * @param filename - Nome do arquivo original para sanitizar
 * @param fallback - Nome padrão se a sanitização resultar em string vazia
 * @returns Nome de arquivo sanitizado seguro para operações de arquivo
 */
export const sanitizeFilename = (filename: string, fallback: string = 'file'): string => {
  if (!filename || typeof filename !== 'string') {
    return fallback;
  }

  const sanitized = filename
    .replace(/[^a-zA-Z0-9._-]/g, '_')
    .replace(/^[._-]+|[._-]+$/g, '')
    .substring(0, 100);

  return sanitized || fallback;
};

/**
 * Extrai extensão do arquivo a partir do nome
 * @param filename - Nome do arquivo para extrair extensão
 * @returns Extensão do arquivo em minúsculas sem o ponto
 */
export const getFileExtension = (filename: string): string => {
  const match = /\.(\w+)$/.exec(filename);
  return match ? match[1].toLowerCase() : '';
};

/**
 * Determina tipo MIME baseado na extensão do arquivo
 * @param filename - Nome do arquivo para analisar
 * @param defaultType - Tipo MIME padrão se extensão não for reconhecida
 * @returns String do tipo MIME apropriado
 */
export const getMimeType = (filename: string, defaultType: string = 'application/octet-stream'): string => {
  const extension = getFileExtension(filename);
  
  const mimeTypes: Record<string, string> = {
    jpg: 'image/jpeg',
    jpeg: 'image/jpeg',
    png: 'image/png',
    gif: 'image/gif',
    pdf: 'application/pdf',
    txt: 'text/plain',
    doc: 'application/msword',
    docx: 'application/vnd.openxmlformats-officedocument.wordprocessingml.document',
  };

  return mimeTypes[extension] || defaultType;
};