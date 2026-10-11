export const formatCityName = (city: ActiveCitiesProps): string => {
  if (!city) return "";
  const name = city.nome || (city as any).name || "";
  const short = (city.shortName || "").trim();
  if (short && short.toLowerCase() !== name.toLowerCase()) {
    return `${name} (${short})`;
  }
  return name;
};