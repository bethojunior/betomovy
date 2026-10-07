export const FormatAddress = (address: string) => {
  const streetPattern = /([^,]+)/;
  const numberPattern = /(\d+)/;
  const neighborhoodPattern = /- ([^,]+)/;

  const streetMatch = address.match(streetPattern);
  const street = streetMatch ? streetMatch[0].trim() : '';

  const numberMatch = address.match(numberPattern);
  const number = numberMatch ? numberMatch[0] : '';

  const neighborhoodMatch = address.match(neighborhoodPattern);
  const neighborhood = neighborhoodMatch ? neighborhoodMatch[1].trim() : '';

  if (!number && !neighborhood) {
    return street;
  }

  if (neighborhood && !number) {
    return `${street} - ${neighborhood}`;
  }

  if (number && !neighborhood) {
    return `${street}, ${number}`;
  }

  return `${street}, ${number} - ${neighborhood}`;
};
