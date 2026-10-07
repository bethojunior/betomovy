export interface IMapService {
  mapType:
    | 'standard'
    | 'satellite'
    | 'hybrid'
    | 'terrain'
    | 'none'
    | 'mutedStandard';
}

export const MapService = {
  switchMapType: (
    mapType:
      | 'standard'
      | 'satellite'
      | 'hybrid'
      | 'terrain'
      | 'none'
      | 'mutedStandard',
  ) => {
    switch (mapType) {
      case 'standard':
        return 'satellite';
      case 'satellite':
        return 'terrain';
      case 'terrain':
        return 'standard';
      default:
        return 'standard';
    }
  },
  switchMapTypeIcon: (
    mapType:
      | 'standard'
      | 'satellite'
      | 'hybrid'
      | 'terrain'
      | 'none'
      | 'mutedStandard',
  ) => {
    switch (mapType) {
      case 'standard':
        return 'map';
      case 'satellite':
        return '3d-rotation';
      case 'terrain':
        return 'map';
      default:
        return 'map';
    }
  },
};
