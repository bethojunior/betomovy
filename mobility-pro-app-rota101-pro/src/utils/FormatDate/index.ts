export const formatDate = (date: any) => {
  const options = {month: 'numeric', day: 'numeric'};
  return date.toLocaleDateString('pt-BR', options);
};

export const formatTime = (date: any) => {
  const hours = date.getHours().toString().padStart(2, '0');
  const minutes = date.getMinutes().toString().padStart(2, '0');
  return `${hours}:${minutes}`;
};
