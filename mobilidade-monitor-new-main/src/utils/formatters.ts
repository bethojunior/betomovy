export const formatTime = (dateString: string) => {
  if (!dateString) return '';
  const date = new Date(dateString);
  if (isNaN(date.getTime())) return '';
  
  return date.toLocaleTimeString('pt-BR', { 
    hour: '2-digit', 
    minute: '2-digit' 
  });
};

export const formatPrice = (price: number | string) => {
  const numericPrice = typeof price === 'string' ? parseFloat(price) : price;
  
  if (isNaN(numericPrice)) {
    return 'R$ 0,00';
  }
  
  return numericPrice.toLocaleString('pt-BR', {
    style: 'currency',
    currency: 'BRL'
  });
};

export const formatDate = (dateString: string) => {
  const date = new Date(dateString);
  return date.toLocaleDateString('pt-BR');
};

export const formatDateTime = (dateString: string) => {
  const date = new Date(dateString);
  return date.toLocaleString('pt-BR');
};

export const getFirstName = (fullName: string | undefined): string => {
  return fullName?.split(' ')[0] || ''
}

export const extractTripDate = (tripData?: TripDto, trip?: TripActive): string | undefined => {
  const formatDate = (date: unknown): string | undefined => {
    if (typeof date === 'string') return date
    if (date instanceof Date) return date.toISOString()
    if (date && typeof date === 'object' && 'date' in date) {
      const dateObj = date as { date: string }
      return dateObj.date
    }
    return date ? String(date) : undefined
  }

  return formatDate(trip?.date) || formatDate(tripData?.date)
}

