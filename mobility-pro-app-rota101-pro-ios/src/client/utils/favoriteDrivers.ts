import { FavoriteDrivers, FavoriteTripType } from '~/interfaces/favorite';

/**
 * Regra de favorito válido para a corrida: motorista disponível e que
 * atende o tipo de viagem selecionado. Usada pelo ModalFavorite e pelo
 * TravelOptions (decide se o modal deve abrir ou seguir o fluxo normal).
 */
export const getAvailableFavorites = (
  favorites: FavoriteDrivers[],
  tripTypeId?: number | string,
): FavoriteDrivers[] => {
  if (!tripTypeId || !Array.isArray(favorites)) {
    return [];
  }

  return favorites.filter((item) => {
    if (item.statusDriver !== 'disponivel') {
      return false;
    }

    if (!item.tripTypes) {
      return false;
    }

    let tripTypes: FavoriteTripType[];
    try {
      tripTypes =
        typeof item.tripTypes === 'string' ? JSON.parse(item.tripTypes) : item.tripTypes;
    } catch (error) {
      return false;
    }

    if (!Array.isArray(tripTypes) || tripTypes.length === 0) {
      return false;
    }

    return tripTypes.some((trip) => String(trip.tripTypeId) === String(tripTypeId));
  });
};
