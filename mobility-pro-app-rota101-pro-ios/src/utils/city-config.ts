interface CityConfigAttributeItem {
  attribute?: string;
  value?: unknown;
}
function parseBooleanFlag(value: unknown): boolean {
  if (value === true || value === 1) {
    return true;
  }
  if (value === false || value === 0 || value == null) {
    return false;
  }
  const normalizedValue = String(value).trim().toLowerCase();
  return normalizedValue === '1' || normalizedValue === 'true';
}
export function isCityConfigFlagEnabled(cityConfig: unknown, attribute: string): boolean {
  if (!cityConfig || !attribute) {
    return false;
  }
  if (Array.isArray(cityConfig)) {
    const cityConfigItem = cityConfig.find(item => item?.attribute === attribute);
    return parseBooleanFlag(cityConfigItem?.value);
  }
  if (typeof cityConfig !== 'object') {
    return false;
  }
  const cityConfigObject = cityConfig as Record<string, unknown>;
  return parseBooleanFlag(cityConfigObject[attribute]);
}

export function getCityConfigValue(
  cityConfig: unknown,
  attribute: string,
): unknown {
  if (!cityConfig || !attribute) {
    return undefined;
  }
  if (Array.isArray(cityConfig)) {
    const cityConfigItem = (cityConfig as CityConfigAttributeItem[]).find(
      item => item?.attribute === attribute,
    );
    return cityConfigItem?.value;
  }
  if (typeof cityConfig !== 'object') {
    return undefined;
  }
  return (cityConfig as Record<string, unknown>)[attribute];
}
