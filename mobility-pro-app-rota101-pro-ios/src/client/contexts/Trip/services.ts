import { customToast } from '../../../utils/FlashMessage';
import apiMain from '../../api/apiMain';

export const offerService = {
  refuseOffer: async (id: string) => {
    const response = await apiMain.post(`tripBid/refuse`, {
      tripBidId: id,
    });
    return response.data;
  },
  acceptOffer: async (id: string) => {
    const response = await apiMain.post(`tripbid/AcceptOffer`, {
      tripBidId: id,
    });
    return response.data;
  },
  changeOffer: async (tripReference: string, priceOffer: number) => {
    const response = await apiMain.post(`tripbid/changepricetrip`, {
      tripReference,
      price: priceOffer,
    });
    return response.data;
  },
};

export const TripService = {
  previewNewPriceChangeRoutes: async payload => {
    const response = await apiMain.post(
      'Price/PreviewNewPriceInChangeRoute',
      payload,
    );
    return response.data;
  },

  get: async (tripReference: string) => {
    const response = await apiMain.post('Trip/Get', {
      stdObject: [
        {
          tripReference,
        },
      ],
    });

    if (!response.status) {
      return customToast(response.data.message, 'danger');
    }

    return response.data.data;
  },

  changeRoute: async payload => {
    const response = await apiMain.post('trip/changeRoute', payload);

    return response.data;
  },
};

export const deliveryService = {
  getAllTypes: async () => {
    const response = await apiMain.get(`TripItemType/all`);
    return response.data;
  },
  getDescriptionTypes: async () => {
    const response = await apiMain.get(`deliveryInfo/suggestion`);
    return response.data;
  },
};
