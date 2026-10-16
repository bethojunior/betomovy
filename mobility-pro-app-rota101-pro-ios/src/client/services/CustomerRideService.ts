import apiMain from '../api/apiMain';

export interface CustomerRideResponse {
  id: string;
  name: string;
  price: string;
  priceId: string | null;
  cityId: string;
  tripTypeId: string;
  originId: string;
  destinationId: string;
  estimatedTime: string;
  estimatedDistance: string;
  allowCustomerStops: string;
  statusId: string;
  active: string;
  picture: string | null;
  created_at: string;
  updated_at: string;
  defaultLayout: string;
  routeWayPoints: any[];
  routeTripItemTypes: any[];
  origin: {
    idOrigin: string;
    latitude: string;
    longitude: string;
    address: string;
    cityId: string | null;
    neighborhood: string | null;
    tag: string;
    complement: string;
    created_at: string;
  };
  destination: {
    idDestination: string;
    latitude: string;
    longitude: string;
    address: string;
    cityId: string | null;
    neighborhood: string | null;
    tag: string;
    complement: string;
    created_at: string;
  };
  ride: {
    rideId: string;
    tripReference: string;
    driverId: string;
    routeId: string;
    seatsAvailable: string;
    created_at: string;
    schedule: string;
    status: string;
    name: string;
    price: string;
    routeLayout: string;
    picture: string | null;
    riders: Array<{
      id: string;
      riderTripCustomerId: string;
      value: string;
      tripPaymentFormId: string;
      userId: string;
      name: string;
      phone: string;
      document: string;
      email: string;
      deviceToken: string;
      profileImage: string;
      created_at: string;
      responsibleName: string;
      isResponsible: string;
      waypoints: Array<{
        id: string;
        rideId: string;
        riderTripCustomerId: string;
        routePitStopTypeId: string;
        address: string;
        latitude: string;
        longitude: string;
        created_at: string;
        updated_at: string;
        routePitStopType: string;
      }>;
    }>;
    rideItems: any[];
    driver: {
      idDriver: string;
      userId: string;
      status: string;
      driverRegisterStatusId: string;
      latitude: string;
      longitude: string;
      profileImage: string;
      profileImageTemp: string;
      profilePicture: string;
      balanceId: string;
      stationId: string | null;
      prepaid: string;
      userTypeId: string;
      userTypeName: string;
      driverRating: string;
      name: string;
      nickname: string;
      email: string;
      phone: string;
      document: string;
      deviceToken: string;
      preAvailable: string;
      cityId: string;
      bankAccountId: string;
      rating: string;
      quantityTrips: string;
      iconMapDriver: string;
      car: {
        plate: string;
        year: string;
        model: string;
        color: string;
        brand: string;
        renavam: string;
      };
    };
  };
}

export interface Waypoint {
  address: string;
  latitude: number;
  longitude: number;
  routePitStopTypeId: number;
}

export interface RiderTripCustomer {
  name?: string;
  document?: string;
  userId?: string;
  waypoints: Waypoint[];
  anotherPlace?: string | null;
}

export interface BookRideRequest {
  tripReference: string;
  tripPaymentFormId: string;
  value: number;
  riderTripCustomers: RiderTripCustomer[];
}

export const CustomerRideService = {
  find: async (latitude: number, longitude: number): Promise<CustomerRideResponse[]> => {
    const response = await apiMain.get(
      `CustomerRide/Find?lat=${latitude}&lng=${longitude}`,
    );
    
    if (response.data.data && Array.isArray(response.data.data)) {
      return response.data.data;
    }
    
    return [];
  },

  book: async (data: BookRideRequest) => {
    const response = await apiMain.post('customerRide/Request', data);
    return response.data;
  },

  getScheduled: async (): Promise<CustomerRideResponse[]> => {
    const response = await apiMain.get('customerRide/FindActives');
    if (response.data.data && Array.isArray(response.data.data)) {
      return response.data.data;
    }
    return [];
  },

  getHistory: async (): Promise<CustomerRideResponse[]> => {
    const response = await apiMain.get('customerRide/FindByUser');
    
    if (response.data.data && Array.isArray(response.data.data)) {
      return response.data.data.map((item: any) => {
        let boardingWaypoint = null;
        let disembarkationWaypoint = null;
        
        if (item.ride?.riders && Array.isArray(item.ride.riders) && item.ride.riders.length > 0) {
          const firstRider = item.ride.riders[0];
          if (firstRider.waypoints && Array.isArray(firstRider.waypoints)) {
            firstRider.waypoints.forEach((wp: any) => {
              if (wp.routePitStopTypeId === '1' || wp.routePitStopType === 'EMBARQUE') {
                boardingWaypoint = {
                  address: wp.address || '',
                  latitude: wp.latitude || '',
                  longitude: wp.longitude || '',
                };
              } else if (wp.routePitStopTypeId === '2' || wp.routePitStopType === 'DESEMBARQUE') {
                disembarkationWaypoint = {
                  address: wp.address || '',
                  latitude: wp.latitude || '',
                  longitude: wp.longitude || '',
                };
              }
            });
          }
        }
        
        const mapped: CustomerRideResponse = {
          id: item.id?.toString() || '',
          name: item.name || '',
          price: item.price?.toString() || '0',
          priceId: item.priceId?.toString() || null,
          cityId: item.cityId?.toString() || '',
          tripTypeId: item.tripTypeId?.toString() || '',
          originId: item.originId?.toString() || '',
          destinationId: item.destinationId?.toString() || '',
          estimatedTime: item.estimatedTime?.toString() || '',
          estimatedDistance: item.estimatedDistance?.toString() || '',
          allowCustomerStops: item.allowCustomerStops?.toString() || '0',
          statusId: item.statusId?.toString() || '',
          active: item.active?.toString() || '1',
          picture: item.picture || null,
          created_at: item.created_at || '',
          updated_at: item.updated_at || '',
          defaultLayout: item.defaultLayout || item.ride?.routeLayout || '',
          routeWayPoints: [],
          routeTripItemTypes: [],
          origin: boardingWaypoint ? {
            idOrigin: item.originId?.toString() || '',
            latitude: boardingWaypoint.latitude || '',
            longitude: boardingWaypoint.longitude || '',
            address: boardingWaypoint.address || 'Origem não disponível',
            cityId: item.cityId?.toString() || null,
            neighborhood: null,
            tag: '',
            complement: '',
            created_at: item.created_at || '',
          } : {
            idOrigin: item.originId?.toString() || '',
            latitude: '',
            longitude: '',
            address: 'Origem não disponível',
            cityId: item.cityId?.toString() || null,
            neighborhood: null,
            tag: '',
            complement: '',
            created_at: item.created_at || '',
          },
          destination: disembarkationWaypoint ? {
            idDestination: item.destinationId?.toString() || '',
            latitude: disembarkationWaypoint.latitude || '',
            longitude: disembarkationWaypoint.longitude || '',
            address: disembarkationWaypoint.address || 'Destino não disponível',
            cityId: item.cityId?.toString() || null,
            neighborhood: null,
            tag: '',
            complement: '',
            created_at: item.created_at || '',
          } : {
            idDestination: item.destinationId?.toString() || '',
            latitude: '',
            longitude: '',
            address: 'Destino não disponível',
            cityId: item.cityId?.toString() || null,
            neighborhood: null,
            tag: '',
            complement: '',
            created_at: item.created_at || '',
          },
          ride: {
            rideId: item.ride?.rideId?.toString() || '',
            tripReference: item.ride?.tripReference || '',
            driverId: item.ride?.driverId?.toString() || '',
            routeId: item.ride?.routeId?.toString() || '',
            seatsAvailable: item.ride?.seatsAvailable?.toString() || '0',
            created_at: item.ride?.created_at || '',
            schedule: item.ride?.schedule || '',
            status: item.ride?.status || '',
            name: item.ride?.name || item.name || '',
            price: item.ride?.price?.toString() || item.price?.toString() || '0',
            routeLayout: item.ride?.routeLayout || item.defaultLayout || '',
            picture: item.ride?.picture || item.picture || null,
            riders: item.ride?.riders || [],
            rideItems: [],
            driver: item.ride?.driverId ? {
              idDriver: item.ride.driverId?.toString() || '',
              userId: '',
              status: '',
              driverRegisterStatusId: '',
              latitude: '',
              longitude: '',
              profileImage: '',
              profileImageTemp: '',
              profilePicture: '',
              balanceId: '',
              stationId: null,
              prepaid: '',
              userTypeId: '',
              userTypeName: '',
              driverRating: '',
              name: '',
              nickname: '',
              email: '',
              phone: '',
              document: '',
              deviceToken: '',
              preAvailable: '',
              cityId: item.cityId?.toString() || '',
              bankAccountId: '',
              rating: '',
              quantityTrips: '',
              iconMapDriver: '',
              car: {
                plate: '',
                year: '',
                model: '',
                color: '',
                brand: '',
                renavam: '',
              },
            } : {} as any,
          },
        };
        
        return mapped;
      });
    }
    
    return [];
  },

  cancel: async (tripReference: string) => {
    const response = await apiMain.post('customerRide/Cancel', {
      tripReference: tripReference,
    });
    return response.data;
  },

};

