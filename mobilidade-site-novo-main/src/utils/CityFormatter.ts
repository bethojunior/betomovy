export const formatCityName = (city: ActiveCitiesProps): string => {
  return city.shortName ? `${city.nome} (${city.shortName})` : city.nome;
};