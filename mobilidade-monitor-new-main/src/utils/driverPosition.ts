const OFFLINE_DRIVER_VISIBILITY_WINDOW_MS = 10 * 60 * 1000

const parseDateValue = (value: unknown, now?: number): Date | null => {
  if (!value) return null
  if (value instanceof Date) {
    return isNaN(value.getTime()) ? null : value
  }
  const raw = String(value).trim()

  const match = raw.match(
    /^(\d{4})-(\d{2})-(\d{2})[ T](\d{2}):(\d{2}):(\d{2})$/
  )
  if (match) {
    const [, y, m, d, hh, mm, ss] = match
    const localDate = new Date(
      Number(y),
      Number(m) - 1,
      Number(d),
      Number(hh),
      Number(mm),
      Number(ss)
    )
    if (isNaN(localDate.getTime())) return null

    if (now === undefined) {
      return localDate
    }

    const utcDate = new Date(
      Date.UTC(
        Number(y),
        Number(m) - 1,
        Number(d),
        Number(hh),
        Number(mm),
        Number(ss)
      )
    )
    const localDelta = Math.abs(now - localDate.getTime())
    const utcDelta = Math.abs(now - utcDate.getTime())
    return utcDelta < localDelta ? utcDate : localDate
  }

  const parsed = new Date(raw)
  return isNaN(parsed.getTime()) ? null : parsed
}

const getDriverPositionUpdatedAt = (driver: any, now?: number): Date | null => {
  const candidates = [
    driver?.position?.updatedAt,
    driver?.position?.updated_at,
    driver?.position?.updateAt,
    driver?.updatedAt,
    driver?.updated_at,
    driver?.updateAt,
    driver?.last_position_update,
    driver?.lastPositionUpdate,
    driver?.lastPositionUpdatedAt,
    driver?.last_position?.updatedAt,
    driver?.last_position?.updated_at,
  ]

  for (const candidate of candidates) {
    const parsed = parseDateValue(candidate, now)
    if (parsed) return parsed
  }

  return null
}

export const shouldShowDriverByOfflineRecency = (
  driver: any,
  now = Date.now(),
  windowMs = OFFLINE_DRIVER_VISIBILITY_WINDOW_MS
): boolean => {
  if (!driver) return false
  const statusValue = String(driver.status ?? '').toLowerCase().trim()
  if (statusValue !== 'desligado') return true

  const updatedAt = getDriverPositionUpdatedAt(driver, now)
  if (!updatedAt) return true

  return now - updatedAt.getTime() <= windowMs
}

export const filterDriversByOfflineRecency = <T extends { status?: string }>(
  drivers: T[],
  now = Date.now(),
  windowMs = OFFLINE_DRIVER_VISIBILITY_WINDOW_MS
): T[] => {
  if (!Array.isArray(drivers) || drivers.length === 0) return []
  return drivers.filter((driver) =>
    shouldShowDriverByOfflineRecency(driver as any, now, windowMs)
  )
}

export { OFFLINE_DRIVER_VISIBILITY_WINDOW_MS }
