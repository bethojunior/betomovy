import { Constants } from './constants'

const isHttpUrl = (value: string) =>
  value.startsWith('http://') || value.startsWith('https://')

const isPlaceholderPhoto = (photo?: string | null) => {
  if (!photo) return true
  const normalized = photo.trim().toLowerCase()
  return (
    normalized === '' ||
    normalized === 'user.png' ||
    normalized === 'defaultimgnotfound' ||
    normalized.endsWith('/user.png') ||
    normalized.includes('defaultimgnotfound')
  )
}

const ensureTrailingSlash = (value: string) =>
  value.endsWith('/') ? value : `${value}/`

const candidateBases = (): string[] => {
  // Ordem importa: storage configurado → minio produção → demais fallbacks
  const ordered: string[] = []
  const push = (v?: string | null) => {
    if (!v) return
    const base = ensureTrailingSlash(v)
    if (!ordered.includes(base)) ordered.push(base)
  }

  push(Constants.base_url_nodes)
  push('https://api.movymob.com/')
  push(Constants.url_photo_customer.replace(/customer\/profile\/compressed\/?$/, ''))

  const envCustomer = (import.meta.env.CLIENT_PHOTO as string | undefined)?.trim()
  if (envCustomer) {
    push(envCustomer.replace(/customer\/profile\/compressed\/?$/, ''))
  }

  const s3Link = (import.meta.env.S3_LINK as string | undefined)?.trim()
  if (s3Link) {
    push(s3Link)
    push(`${s3Link.replace(/\/$/, '')}/movy/`)
    push(`${s3Link.replace(/\/$/, '')}/rota101fb704/`)
  }

  return ordered
}

const buildCustomerCandidates = (photo: string): string[] => {
  if (isHttpUrl(photo)) return [photo]

  const fileName = photo.replace(/^\/+/, '')
  const urls: string[] = []

  for (const base of candidateBases()) {
    if (fileName.startsWith('customer/profile/')) {
      urls.push(`${base}${fileName}`)
    } else {
      urls.push(`${base}customer/profile/compressed/${fileName}`)
      urls.push(`${base}customer/profile/${fileName}`)
    }
  }

  return Array.from(new Set(urls))
}

const normalizePhotoUrl = (
  photo: string | null | undefined,
  compressedPrefix: string,
  defaultBaseUrl: string
): string | null => {
  if (isPlaceholderPhoto(photo)) return null

  const value = String(photo).trim()
  if (isHttpUrl(value)) return value

  if (value.startsWith(compressedPrefix) || value.startsWith('customer/profile/') || value.startsWith('driver/profile/')) {
    return `${ensureTrailingSlash(Constants.base_url_nodes)}${value.replace(/^\/+/, '')}`
  }

  return `${ensureTrailingSlash(defaultBaseUrl)}${value.replace(/^\/+/, '')}`
}

/**
 * Normaliza a URL da foto do cliente
 */
export const getCustomerPhotoUrl = (customerPhoto: string | null | undefined): string | null =>
  normalizePhotoUrl(customerPhoto, 'customer/profile/compressed/', Constants.url_photo_customer)

/**
 * Lista de URLs candidatas (compressed / original / bases alternativas)
 */
export const getCustomerPhotoCandidates = (
  customerPhoto: string | null | undefined,
  profileImageLink?: string | null
): string[] => {
  const urls: string[] = []
  if (profileImageLink && isHttpUrl(profileImageLink) && !isPlaceholderPhoto(profileImageLink)) {
    urls.push(profileImageLink)
  }
  if (!isPlaceholderPhoto(customerPhoto)) {
    urls.push(...buildCustomerCandidates(String(customerPhoto)))
  }
  return Array.from(new Set(urls.filter(Boolean)))
}

/**
 * Normaliza a URL da foto do motorista
 */
export const getDriverPhotoUrl = (driverPhoto: string | null | undefined): string | null =>
  normalizePhotoUrl(driverPhoto, 'driver/profile/compressed/', Constants.url_photo_driver)

export { isPlaceholderPhoto }
