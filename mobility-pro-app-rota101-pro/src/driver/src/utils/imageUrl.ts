/**
 * Retorna a URL completa da imagem de perfil do motorista
 * @param profileImage - Nome ou URL completa da imagem
 * @param storageUrl - URL do storage específico (opcional)
 * @param fallbackHost - Host padrão para construir a URL
 * @returns URL completa da imagem
 */
export const getProfileImageUrl = (
  profileImage: string | undefined | null,
  storageUrl: string | null,
  fallbackHost: string
): string => {
  const trimmedProfileImage = profileImage?.trim();
  
  // Se a imagem já é uma URL completa, retorna ela diretamente
  if (trimmedProfileImage?.startsWith('http')) {
    return trimmedProfileImage;
  }

  // Caso contrário, constrói a URL completa
  const host = storageUrl || fallbackHost;
  const image = trimmedProfileImage || 'user.png';
  return `${host}${image}`;
};

