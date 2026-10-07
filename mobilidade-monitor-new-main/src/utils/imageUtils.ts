import { Constants } from './constants'

const normalizePhotoUrl = (
  photo: string | null | undefined,
  compressedPrefix: string,
  defaultBaseUrl: string
): string | null => {
  if (!photo) return null

  if (photo.startsWith('http://') || photo.startsWith('https://')) {
    return photo
  }

  if (photo.startsWith(compressedPrefix)) {
    return `${Constants.base_url_nodes}${photo}`
  }

  return `${defaultBaseUrl}${photo}`
}

/**
 * Normaliza a URL da foto do cliente
 * Remove duplicação do caminho se a API já retornar o caminho completo
 */
export const getCustomerPhotoUrl = (customerPhoto: string | null | undefined): string | null =>
  normalizePhotoUrl(customerPhoto, 'customer/profile/compressed/', Constants.url_photo_customer)

/**
 * Normaliza a URL da foto do motorista
 * Remove duplicação do caminho se a API já retornar o caminho completo
 */
export const getDriverPhotoUrl = (driverPhoto: string | null | undefined): string | null =>
  normalizePhotoUrl(driverPhoto, 'driver/profile/compressed/', Constants.url_photo_driver)
