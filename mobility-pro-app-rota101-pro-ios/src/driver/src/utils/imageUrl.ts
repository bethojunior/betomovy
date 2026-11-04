/**
 * Retorna a URL completa da imagem de perfil do motorista
 * @param profileImage - Nome ou URL completa da imagem
 * @param storageUrl - URL do storage específico (opcional)
 * @param fallbackHost - Host padrão para construir a URL
 * @returns URL completa da imagem
 */
export const getProfileImageUrl = (
  profileImage: string | undefined | null,
  storageUrl?: string | null,
  fallbackHost?: string
): string => {
  const trimmedProfileImage = profileImage?.trim();
  if (!trimmedProfileImage || trimmedProfileImage === 'user.png') {
    return '';
  }

  // Se a imagem já é uma URL completa, retorna ela diretamente
  if (trimmedProfileImage.startsWith('http://') || trimmedProfileImage.startsWith('https://')) {
    return trimmedProfileImage;
  }

  if (trimmedProfileImage.startsWith('/')) {
    return `https://api.movymob.com${trimmedProfileImage}`;
  }

  if (trimmedProfileImage.includes('driver/profile/') || trimmedProfileImage.includes('customer/profile/')) {
    return `https://api.movymob.com/${trimmedProfileImage.replace(/^\/+/, '')}`;
  }

  const host = storageUrl || fallbackHost || 'https://api.movymob.com/driver/profile/';
  return `${host.replace(/\/+$/, '')}/${trimmedProfileImage.replace(/^\/+/, '')}`;
};

