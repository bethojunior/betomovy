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

  const storageBase = 'https://minio.704app.com.br/rota101fb704/';

  if (trimmedProfileImage.startsWith('/')) {
    return `${storageBase}${trimmedProfileImage.replace(/^\/+/, '')}`;
  }

  if (trimmedProfileImage.includes('driver/profile/') || trimmedProfileImage.includes('customer/profile/')) {
    const marker = trimmedProfileImage.includes('driver/profile/') ? 'driver/profile/' : 'customer/profile/';
    const relative = trimmedProfileImage.slice(trimmedProfileImage.indexOf(marker));
    return `${storageBase}${relative.replace(/^\/+/, '')}`;
  }

  const host = storageUrl || fallbackHost || `${storageBase}driver/profile/compressed/`;
  return `${host.replace(/\/+$/, '')}/${trimmedProfileImage.replace(/^\/+/, '')}`;
};

