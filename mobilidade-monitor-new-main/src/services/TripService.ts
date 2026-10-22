import api from './api'
import { TripDetail } from '../pages/Monitoring/_components/TripFooterStats.types'

const getLocalDateString = (date: Date): string => {
  const year = date.getFullYear()
  const month = String(date.getMonth() + 1).padStart(2, '0')
  const day = String(date.getDate()).padStart(2, '0')
  return `${year}-${month}-${day}`
}

export interface ActiveTripsFilters {
  customerName?: string
  driverName?: string
  status?: string
  excludeScheduled?: boolean
  tripReference?: string
  page?: number
  perPage?: number
}

export interface ActiveTripsResponse {
  data: TripDto[]
  current_page: number
  last_page: number
  per_page: number
  total: number
  next_page_url: string | null
  prev_page_url: string | null
  scheduledTotal: number
}

export const TripService = {
 async getActiveAllTrip(filters?: ActiveTripsFilters): Promise<ActiveTripsResponse> {
    try {
      const response = await api.get(`dashboard/activeTrips`, { params: filters })
      return response.data?.response ?? response.data?.data ?? response.data
    } catch (error) {
      console.error('❌ TripService - Erro na API:', error)
      throw error
    }
  },
 async getActiveTripDetail(tripReference: string): Promise<TripDto | null> {
    try {
      const response = await api.get(`dashboard/activeTrips/${tripReference}`)
      return response.data?.response ?? response.data?.data ?? response.data
    } catch (error: any) {
      if (error?.response?.status === 404) {
        return null
      }
      console.error('❌ TripService - Erro ao buscar detalhe da viagem:', error)
      throw error
    }
  },
 async getAllTrips(): Promise<any> {
    // const response = await axios.get<{ response: TripActive[] }>(
    //   `https://mobilidade-monitorapiv2-rotasul.prod.704apps.com.br/dashboard/activeTrips`,
    //   {
    //     headers: {
    //       token: '$2y$10$DgUj4fvFru0JiPZzbnMeQu6gJNayAQ5lBj4lMDNTlQIsy/8CXplx6',
    //       userid: 6
    //     }
    //   }
    // );

    // return response.data.response;

    return [
      {
        idTrip: 1318533,
        tripReference: 'f581fd15-41a3-b74e-eece-ec4ffc3415be',
        date: '2024-12-09T20:53:19.000000Z',
        price: 10.5,
        driverId: 153,
        driverUserId: 8231,
        driverAppVersion: '1.59.035',
        driverName: 'Maximiliano Bittencourt Ritta Chaves',
        driverPhoto: '8231e6af2b44-7dc3-b2d7-51.jpg',
        userId: 8231,
        customerAppVersion: null,
        customerId: null,
        zoneId: null,
        tripTypeId: 24,
        customerName: 'Maximiliano Bittencourt Ritta Chaves',
        customerPhoto: null,
        status: 'searching',
        canceledBy: null,
        paymentForm: 'Tax\u00edmetro',
        tripType: 'CONFORT',
        favoriteDrivers: null,
        situation: 'CORRIDA LIBERADA',
        originLatitude: '-31.3384292',
        originLongitude: '-54.0613773',
        originAddress:
          'R. Liene Maria Stein, 3371 - Pedras Brancas, Bag\u00e9 - RS, 96495-000, Brasil',
        destinationLatitude: '-31.3384292',
        destinationLongitude: '-54.0613773',
        destinationAddress:
          'R. Liene Maria Stein, 3371 - Pedras Brancas, Bag\u00e9 - RS, 96495-000, Brasil',
        driverTypeId: 13,
        driverType: 'CONFORT',
        schedule: null,
        driversCalled: [

    {
        "name": "teste johnson ",
        "nickname": "teste",
        "touched": 0,
        "status": null,
        "phone": "(85) 99285-8585",
        "rating": 5,
        "profileImage": "81fb195c-e484-d881-c1.jpg",
        "last_lat": "-3.7337411225054",
        "last_lon": "-38.528938740492",
        "userTypeId": 7,
        "type": "MOTORISTA PARTICULAR",
        "id": 1214,
        "driverId": 5,
        "tripReference": "608da9d7-4462-c256-c9d1-5fa7c4e045e4",
        "proximity": 2.66028,
        "created_at": "2026-01-28T18:55:57.000000Z",
        "updated_at": null
    },
    {
        "name": "Motorista Teste",
        "nickname": "Motorista",
        "touched": 0,
        "status": null,
        "phone": "(85) 99333-3333",
        "rating": 5,
        "profileImage": "7d0a4cd0-c3a5-e975-01.jpg",
        "last_lat": "-3.7312225",
        "last_lon": "-38.5119562",
        "userTypeId": 7,
        "type": "MOTORISTA PARTICULAR",
        "id": 1215,
        "driverId": 9,
        "tripReference": "608da9d7-4462-c256-c9d1-5fa7c4e045e4",
        "proximity": 3.78563,
        "created_at": "2026-01-28T18:55:57.000000Z",
        "updated_at": null
    },
    {
        "name": "teste johnson ",
        "nickname": "teste",
        "touched": 0,
        "status": "calling",
        "phone": "(85) 99285-8585",
        "rating": 5,
        "profileImage": "81fb195c-e484-d881-c1.jpg",
        "last_lat": "-3.7337411225054",
        "last_lon": "-38.528938740492",
        "userTypeId": 7,
        "type": "MOTORISTA PARTICULAR",
        "id": 1216,
        "driverId": 5,
        "tripReference": "608da9d7-4462-c256-c9d1-5fa7c4e045e4",
        "proximity": 2.66028,
        "created_at": "2026-01-28T18:56:00.000000Z",
        "updated_at": "2026-01-28T21:56:00.000000Z"
    },
    {
        "name": "Motorista Teste",
        "nickname": "Motorista",
        "touched": 0,
        "status": "calling",
        "phone": "(85) 99333-3333",
        "rating": 5,
        "profileImage": "7d0a4cd0-c3a5-e975-01.jpg",
        "last_lat": "-3.7312225",
        "last_lon": "-38.5119562",
        "userTypeId": 7,
        "type": "MOTORISTA PARTICULAR",
        "id": 1217,
        "driverId": 3,
        "tripReference": "608da9d7-4462-c256-c9d1-5fa7c4e045e4",
        "proximity": 3.78563,
        "created_at": "2026-01-28T18:56:00.000000Z",
        "updated_at": "2026-01-28T21:56:00.000000Z"
    },

        ],
        
      },
      {
        idTrip: 1318532,
        tripReference: 'c598433e-d589-fd66-6f63-7e4bf364859a',
        date: '2024-12-09T20:52:24.000000Z',
        price: 28.5,
        driverId: 1474,
        driverUserId: 20327,
        driverAppVersion: '1.59.035',
        driverName: 'Mauro Torbes dos Santos',
        driverPhoto: '203279a2df0ea-41ef-b2fb-f1.jpg',
        userId: 2301,
        customerAppVersion: null,
        customerId: null,
        zoneId: 48,
        tripTypeId: 18,
        customerName: 'Rota Sul App Cental',
        customerPhoto: null,
        status: 'accepted',
        canceledBy: null,
        paymentForm: 'Dinheiro ou Pix',
        tripType: 'CENTRAL',
        favoriteDrivers: '',
        situation: 'CORRIDA LIBERADA',
        originLatitude: '-31.301984310745',
        originLongitude: '-54.082246374403',
        originAddress:
          'Nicolini Atacada\u00e7o - Av. Santa Tecla, 2900 - Get\u00falio Vargas, Bag\u00e9 - RS, 96413-000',
        destinationLatitude: '-31.359983',
        destinationLongitude: '-54.087549',
        destinationAddress: 'Rua Dirceu Lamas, Bag\u00e9 - Rio Grande do Sul, 96420-640, Brasil',
        driverTypeId: 7,
        driverType: 'MOTORISTA PARTICULAR',
        schedule: null,
        driversCalled: []
      },
      {
        idTrip: 1318531,
        tripReference: 'b2ed1622-5b8d-a5c0-b1be-84a33b9dc8d1',
        date: '2024-12-09T20:51:58.000000Z',
        price: 9.67,
        driverId: 155,
        driverUserId: 7243,
        driverAppVersion: '1.59.035',
        driverName: 'Nezio Waldemar da Silva umpierre',
        driverPhoto: '32bab05e-c29c-a156-31.jpg',
        userId: 2943,
        customerAppVersion: '1.59.149',
        customerId: null,
        zoneId: 48,
        tripTypeId: 1,
        customerName: 'Juliane silva maia',
        customerPhoto: '16256527011.jpg',
        status: 'accepted',
        canceledBy: null,
        paymentForm: 'Dinheiro ou Pix',
        tripType: '+ ECONOMICO',
        favoriteDrivers: null,
        situation: 'CORRIDA LIBERADA',
        originLatitude: '-31.3045782',
        originLongitude: '-54.1168645',
        originAddress:
          'R. Telemaco Colares, 92 - S\u00e3o Jorge, Bag\u00e9 - RS, 96408-450, Brasil',
        destinationLatitude: '-31.3135655',
        destinationLongitude: '-54.1192772',
        destinationAddress: 'Rua Heraldo Duarte, 832 - Popular, Bag\u00e9 - RS, Brasil',
        driverTypeId: 7,
        driverType: 'MOTORISTA PARTICULAR',
        schedule: null,
        driversCalled: []
      },
      {
        idTrip: 1318530,
        tripReference: '3f1565bd-e876-defe-361b-96df9c30e140',
        date: '2024-12-09T20:49:50.000000Z',
        price: 9.39,
        driverId: 1130,
        driverUserId: 16670,
        driverAppVersion: '1.59.035',
        driverName: 'Jos\u00e9 Ireno de Deus',
        driverPhoto: '16670dcbc44d8-ec56-a8b6-f1.jpg',
        userId: 16201,
        customerAppVersion: null,
        customerId: null,
        zoneId: 48,
        tripTypeId: 18,
        customerName: 'Rota Sul',
        customerPhoto: null,
        status: 'accepted',
        canceledBy: null,
        paymentForm: 'Dinheiro ou Pix',
        tripType: 'CENTRAL',
        favoriteDrivers: '',
        situation: 'CORRIDA LIBERADA',
        originLatitude: '-31.349079',
        originLongitude: '-54.090778',
        originAddress: 'Rua Doutor Camilo Gomes, 62, Bag\u00e9-RS 96418-020',
        destinationLatitude: '-31.3520763',
        destinationLongitude: '-54.0876315',
        destinationAddress: 'Rua Mario Ferreira Souza, 35 - Bag\u00e9, RS, Brasil',
        driverTypeId: 7,
        driverType: 'MOTORISTA PARTICULAR',
        schedule: null,
        driversCalled: []
      },
      {
        idTrip: 1318529,
        tripReference: '047c666f-effe-c330-2b73-c2614d79ee85',
        date: '2024-12-09T20:49:48.000000Z',
        price: 9.16,
        driverId: 1848,
        driverUserId: 25056,
        driverAppVersion: '1.59.035',
        driverName: 'Elvis Castro Jardim',
        driverPhoto: '250560b118bbb-dd79-febf-21.jpg',
        userId: 19885,
        customerAppVersion: '1.59.149',
        customerId: null,
        zoneId: 48,
        tripTypeId: 1,
        customerName: 'Ros\u00e2ngela Camargo Alves Lopes ',
        customerPhoto: '860666c8-d076-fdbf-81.jpg',
        status: 'in_progress',
        canceledBy: null,
        paymentForm: 'Dinheiro ou Pix',
        tripType: '+ ECONOMICO',
        favoriteDrivers: null,
        situation: 'CORRIDA LIBERADA',
        originLatitude: '-31.3365748',
        originLongitude: '-54.1057637',
        originAddress: 'Av. Gen. Os\u00f3rio, 511 - Centro, Bag\u00e9 - RS, 96400-100, Brasil',
        destinationLatitude: '-31.33718',
        destinationLongitude: '-54.09685',
        destinationAddress:
          'Rua Comendador Azambuja, 251, Bag\u00e9 - RS, 96415-130, Brasil, Rua Comendador Azambuja, 251, Bag\u00e9 - RS, 96415-130, Brasil',
        driverTypeId: 7,
        driverType: 'MOTORISTA PARTICULAR',
        schedule: null,
        driversCalled: []
      },
      {
        idTrip: 1318528,
        tripReference: '87aa2269-5285-b8cc-2fc7-f141db60c6b9',
        date: '2024-12-09T20:48:54.000000Z',
        price: 7.5,
        driverId: 693,
        driverUserId: 10218,
        driverAppVersion: '1.59.035',
        driverName: 'Deryk Rodrigues Da silva',
        driverPhoto: '1021823518c23-5bcf-8381-e1.jpg',
        userId: 8818,
        customerAppVersion: '1.59.150',
        customerId: null,
        zoneId: 48,
        tripTypeId: 1,
        customerName: 'matheus ferreira melo',
        customerPhoto: '9b0b5606-cdfb-92f1-31.jpg',
        status: 'in_progress',
        canceledBy: null,
        paymentForm: 'Dinheiro ou Pix',
        tripType: '+ ECONOMICO',
        favoriteDrivers: null,
        situation: 'CORRIDA LIBERADA',
        originLatitude: '-31.325936617972',
        originLongitude: '-54.10910039781',
        originAddress: 'R. Bar\u00e3o do Triunfo, 1345 - Centro, Bag\u00e9 - RS, 96400-101, Brasil',
        destinationLatitude: '-31.31874',
        destinationLongitude: '-54.10889',
        destinationAddress:
          'Avenida General Os\u00f3rio, 1849, Bag\u00e9 - RS, 96400-101, Brasil, Avenida General Os\u00f3rio, 1849, Bag\u00e9 - RS, 96400-101, Brasil',
        driverTypeId: 7,
        driverType: 'MOTORISTA PARTICULAR',
        schedule: null,
        driversCalled: []
      },
      {
        idTrip: 1318527,
        tripReference: '2e34ea11-f5eb-b226-e217-552f6594900b',
        date: '2024-12-09T20:47:20.000000Z',
        price: 9.76,
        driverId: 1259,
        driverUserId: 17734,
        driverAppVersion: '1.59.035',
        driverName: 'Daniel Azevedo Maia',
        driverPhoto: '5ff0c981-cfd6-ece2-81.jpg',
        userId: 4980,
        customerAppVersion: '1.59.149',
        customerId: null,
        zoneId: 48,
        tripTypeId: 1,
        customerName: 'Eunice Rosa Benites',
        customerPhoto: '16334501111.jpg',
        status: 'in_progress',
        canceledBy: null,
        paymentForm: 'Dinheiro ou Pix',
        tripType: '+ ECONOMICO',
        favoriteDrivers: null,
        situation: 'CORRIDA LIBERADA',
        originLatitude: '-31.3040044',
        originLongitude: '-54.1173368',
        originAddress:
          'R. Herculano Gomes, 158 - S\u00e3o Jorge, Bag\u00e9 - RS, 96408-520, Brasil',
        destinationLatitude: '-31.30102',
        destinationLongitude: '-54.13068',
        destinationAddress:
          'Rua Osmar Luna, 377, Bag\u00e9 - RS, 96410-550, Brasil, Rua Osmar Luna, 377, Bag\u00e9 - RS, 96410-550, Brasil',
        driverTypeId: 7,
        driverType: 'MOTORISTA PARTICULAR',
        schedule: null,
        driversCalled: []
      },
      {
        idTrip: 1318526,
        tripReference: '4be70a95-6c94-8bb5-45bf-0b46b2a6f2e6',
        date: '2024-12-09T20:46:17.000000Z',
        price: 15.75,
        driverId: 2103,
        driverUserId: 28622,
        driverAppVersion: '1.59.035',
        driverName: 'Marcelo Caetano Camargo caneda',
        driverPhoto: '286228fc83590-500c-8dae-41.jpg',
        userId: 2301,
        customerAppVersion: null,
        customerId: null,
        zoneId: 48,
        tripTypeId: 18,
        customerName: 'Rota Sul App Cental',
        customerPhoto: null,
        status: 'in_progress',
        canceledBy: null,
        paymentForm: 'Dinheiro ou Pix',
        tripType: 'CENTRAL',
        favoriteDrivers: '',
        situation: 'CORRIDA LIBERADA',
        originLatitude: '-31.33092157298',
        originLongitude: '-54.104402773082',
        originAddress: 'Avenida Marechal Floriano, 975, Bag\u00e9 - RS, 96400-010, Brasil',
        destinationLatitude: '-31.3468',
        destinationLongitude: '-54.1278',
        destinationAddress: 'Rua Cento e Oitenta, 240, Bag\u00e9 Bag\u00e9-RS 96425-410',
        driverTypeId: 3,
        driverType: 'TAXISTA',
        schedule: null,
        driversCalled: []
      },
      {
        idTrip: 1318525,
        tripReference: '1567a543-4a47-d907-0088-e82b173d3c83',
        date: '2024-12-09T20:45:39.000000Z',
        price: 17.15,
        driverId: 2161,
        driverUserId: 29247,
        driverAppVersion: '1.59.035',
        driverName: 'Gregori carvalho briao',
        driverPhoto: '29247fb6dec3c-7f50-a06d-61.jpg',
        userId: 16201,
        customerAppVersion: null,
        customerId: null,
        zoneId: 48,
        tripTypeId: 18,
        customerName: 'Rota Sul',
        customerPhoto: null,
        status: 'in_progress',
        canceledBy: null,
        paymentForm: 'Dinheiro ou Pix',
        tripType: 'CENTRAL',
        favoriteDrivers: '',
        situation: 'CORRIDA LIBERADA',
        originLatitude: '-31.3292948',
        originLongitude: '-54.1101647',
        originAddress: 'Rua Gomes Carneiro 1136, Bag\u00e9 - Rio Grande do Sul, 96400, Brazil',
        destinationLatitude: '-31.31793',
        destinationLongitude: '-54.08158',
        destinationAddress:
          'Rua Santo Ant\u00f4nio, 224, Bag\u00e9 - RS, 96412-530, Brasil, Rua Santo Ant\u00f4nio, 224, Bag\u00e9 - RS, 96412-530, Brasil',
        driverTypeId: 13,
        driverType: 'CONFORT',
        schedule: null,
        driversCalled: []
      },
      {
        idTrip: 1318524,
        tripReference: 'bf8fa841-4e53-bda3-d1ec-42ed5975cc61',
        date: '2024-12-09T20:44:55.000000Z',
        price: 17.01,
        driverId: 838,
        driverUserId: 12400,
        driverAppVersion: '1.59.035',
        driverName: 'Lidiane Tavares Morais',
        driverPhoto: '124003941f14c-4367-d559-c1.jpg',
        userId: 2301,
        customerAppVersion: null,
        customerId: null,
        zoneId: 48,
        tripTypeId: 18,
        customerName: 'Rota Sul App Cental',
        customerPhoto: null,
        status: 'in_progress',
        canceledBy: null,
        paymentForm: 'Dinheiro ou Pix',
        tripType: 'CENTRAL',
        favoriteDrivers: '',
        situation: 'CORRIDA LIBERADA',
        originLatitude: '-31.3315882',
        originLongitude: '-54.0872549',
        originAddress:
          'Avenida Padre Ab\u00edlio Sponchiado, 1149, Bag\u00e9 - RS, 96415-200, Brasil',
        destinationLatitude: '-31.3352667',
        destinationLongitude: '-54.1079743',
        destinationAddress:
          'ESC Est Ed Bas Professor Justino Costa Quintana - Rua Bar\u00e3o do Triunfo - Centro, Bag\u00e9 - RS, Brasil',
        driverTypeId: 8,
        driverType: 'MOTORISTA MULHER',
        schedule: null,
        driversCalled: []
      },
      {
        idTrip: 1318522,
        tripReference: '437b7da7-c33a-c320-6092-b805116d2b7a',
        date: '2024-12-09T20:42:56.000000Z',
        price: 15.79,
        driverId: 1617,
        driverUserId: 22595,
        driverAppVersion: '1.59.035',
        driverName: 'Jo\u00e3o Jesus Barcellos',
        driverPhoto: '2259596dcbdf5-536e-f5fe-41.jpg',
        userId: 2301,
        customerAppVersion: null,
        customerId: null,
        zoneId: 48,
        tripTypeId: 18,
        customerName: 'Rota Sul App Cental',
        customerPhoto: null,
        status: 'in_progress',
        canceledBy: null,
        paymentForm: 'Dinheiro ou Pix',
        tripType: 'CENTRAL',
        favoriteDrivers: '',
        situation: 'CORRIDA LIBERADA',
        originLatitude: '-31.32507154',
        originLongitude: '-54.13031704',
        originAddress: 'Rua 339 478, Bag\u00e9 - Rio Grande do Sul, 96402, Brazil',
        destinationLatitude: '-31.31419',
        destinationLongitude: '-54.10876',
        destinationAddress:
          'Rua Coronel Azambuja, 59, Bag\u00e9 - RS, 96400-710, Brasil, Rua Coronel Azambuja, 59, Bag\u00e9 - RS, 96400-710, Brasil',
        driverTypeId: 7,
        driverType: 'MOTORISTA PARTICULAR',
        schedule: null,
        driversCalled: []
      },
      {
        idTrip: 1318521,
        tripReference: '55ed7127-c970-845a-58b0-44d0f709c336',
        date: '2024-12-09T20:41:52.000000Z',
        price: 12.18,
        driverId: 2023,
        driverUserId: 27626,
        driverAppVersion: '1.59.035',
        driverName: 'Anderson Lu\u00eds Dias caneda',
        driverPhoto: '276262b1e5f70-dc5a-ee82-a1.jpg',
        userId: 20038,
        customerAppVersion: '1.59.149',
        customerId: null,
        zoneId: 48,
        tripTypeId: 1,
        customerName: 'Kamilli Bittencourt nunes',
        customerPhoto: '091376c7-da82-c893-f1.jpg',
        status: 'in_progress',
        canceledBy: null,
        paymentForm: 'Dinheiro ou Pix',
        tripType: '+ ECONOMICO',
        favoriteDrivers: null,
        situation: 'CORRIDA LIBERADA',
        originLatitude: '-31.3414329',
        originLongitude: '-54.1158166',
        originAddress:
          'Rua Juliano Juliani Sim\u00f5es - Passo do Pr\u00edncipe, Bag\u00e9 - RS, Brasil',
        destinationLatitude: '-31.334206',
        destinationLongitude: '-54.094539',
        destinationAddress:
          'Avenida Padre Ab\u00edlio Sponchiado 599, Bag\u00e9 - Rio Grande do Sul, 96415-200, Brasil',
        driverTypeId: 7,
        driverType: 'MOTORISTA PARTICULAR',
        schedule: null,
        driversCalled: []
      },
      {
        idTrip: 1318520,
        tripReference: 'db25b69d-5502-c813-7b2d-1294516dd60d',
        date: '2024-12-09T20:41:24.000000Z',
        price: 21.6,
        driverId: 1857,
        driverUserId: 25158,
        driverAppVersion: '1.59.035',
        driverName: 'Thiago Rodrigues Campos',
        driverPhoto: '25158ecac5425-dd1c-c1b5-81.jpg',
        userId: 16201,
        customerAppVersion: null,
        customerId: null,
        zoneId: 48,
        tripTypeId: 18,
        customerName: 'Rota Sul',
        customerPhoto: null,
        status: 'in_progress',
        canceledBy: null,
        paymentForm: 'Dinheiro ou Pix',
        tripType: 'CENTRAL',
        favoriteDrivers: '',
        situation: 'CORRIDA BLOQUEADA',
        originLatitude: '-31.322529',
        originLongitude: '-54.084881',
        originAddress:
          'Rua Doutor F\u00e9lix Contreiras Rodrigues, 37, Bag\u00e9 Bag\u00e9-RS 96412-510',
        destinationLatitude: '-31.2981',
        destinationLongitude: '-54.06354',
        destinationAddress:
          'Rua Quatrocentos e Setenta e Oito, Bag\u00e9 - RS, 96413-516, Brasil, Rua Quatrocentos e Setenta e Oito, Bag\u00e9 - RS, 96413-516, Brasil',
        driverTypeId: 13,
        driverType: 'CONFORT',
        schedule: null,
        driversCalled: []
      },
      {
        idTrip: 1318519,
        tripReference: '516099ec-785b-f56d-19f5-ed936571a10d',
        date: '2024-12-09T20:39:41.000000Z',
        price: 16.41,
        driverId: 1997,
        driverUserId: 27249,
        driverAppVersion: '1.59.035',
        driverName: 'Lucas Yago Das Neves Rocha',
        driverPhoto: '27249442f80b1-4aa4-b5d0-41.jpg',
        userId: 19784,
        customerAppVersion: '1.59.149',
        customerId: null,
        zoneId: 48,
        tripTypeId: 1,
        customerName: 'Ester jardim correa',
        customerPhoto: '795d7f35-532c-9de9-b1.jpg',
        status: 'in_progress',
        canceledBy: null,
        paymentForm: 'Dinheiro ou Pix',
        tripType: '+ ECONOMICO',
        favoriteDrivers: '1597',
        situation: 'CORRIDA LIBERADA',
        originLatitude: '-31.31676',
        originLongitude: '-54.100336',
        originAddress:
          'R. Ven\u00e2ncio A\u00edres, 540 - Centro, Bag\u00e9 - RS, 96400-460, Brasil',
        destinationLatitude: '-31.3458818',
        destinationLongitude: '-54.085778',
        destinationAddress: 'Rua Trezentos e Oitenta e Seis - Castro Alves, Bag\u00e9 - RS, Brasil',
        driverTypeId: 7,
        driverType: 'MOTORISTA PARTICULAR',
        schedule: null,
        driversCalled: []
      },
      {
        idTrip: 1318516,
        tripReference: 'ab943a14-5bcd-a890-7b0c-8aaa56b90a5e',
        date: '2024-12-09T20:37:41.000000Z',
        price: 20.04,
        driverId: 1039,
        driverUserId: 15676,
        driverAppVersion: '1.59.035',
        driverName: 'Vagner Roberto Pereira da Silva',
        driverPhoto: '15676c4f30a63-7d46-d231-31.JPG',
        userId: 16201,
        customerAppVersion: null,
        customerId: null,
        zoneId: 48,
        tripTypeId: 18,
        customerName: 'Rota Sul',
        customerPhoto: null,
        status: 'in_progress',
        canceledBy: null,
        paymentForm: 'Dinheiro ou Pix',
        tripType: 'CENTRAL',
        favoriteDrivers: '',
        situation: 'CORRIDA LIBERADA',
        originLatitude: '-31.33101',
        originLongitude: '-54.10542',
        originAddress:
          'Avenida Sete de Setembro, 955, Bag\u00e9 - RS, 96400-006, Brasil, Avenida Sete de Setembro, 955, Bag\u00e9 - RS, 96400-006, Brasil',
        destinationLatitude: '-31.3397736',
        destinationLongitude: '-54.0620854',
        destinationAddress: 'R. BG 104, 290 - Habitar Brasil, Bag\u00e9 - RS, 96415, Brasil',
        driverTypeId: 7,
        driverType: 'MOTORISTA PARTICULAR',
        schedule: null,
        driversCalled: []
      },
      {
        idTrip: 1318507,
        tripReference: 'e34f14cc-43df-e970-e25a-746f408c5083',
        date: '2024-12-09T20:29:24.000000Z',
        price: 12.01,
        driverId: 701,
        driverUserId: 10312,
        driverAppVersion: '1.59.035',
        driverName: 'Jos\u00e9 Carlos Gon\u00e7alves noble',
        driverPhoto: '10312e550e4ff-5253-844f-d1.jpg',
        userId: 2076,
        customerAppVersion: '1.59.149',
        customerId: null,
        zoneId: 48,
        tripTypeId: 1,
        customerName: 'Karolaine  da Silva rodrigues',
        customerPhoto: 'bec2658b-4071-80f3-11.jpg',
        status: 'in_progress',
        canceledBy: null,
        paymentForm: 'Dinheiro ou Pix',
        tripType: '+ ECONOMICO',
        favoriteDrivers: null,
        situation: 'CORRIDA LIBERADA',
        originLatitude: '-31.3300028',
        originLongitude: '-54.1082613',
        originAddress: 'R. Bar\u00e3o do Triunfo, 1065 - Centro, Bag\u00e9 - RS, 96400, Brasil',
        destinationLatitude: '-31.3143469',
        destinationLongitude: '-54.1142374',
        destinationAddress:
          'Rua Pedro Gomes Da Silva 468, Bag\u00e9 - Rio Grande do Sul, 96407, Brazil',
        driverTypeId: 7,
        driverType: 'MOTORISTA PARTICULAR',
        schedule: null,
        driversCalled: []
      }
    ]
  },

 async getTripQuantities(): Promise<any> {
    try {
      const response = await api.get<{ response: TripActive[] }>(`/dashboard/tripQuantities`)

      return response.data?.response ?? response.data?.data ?? response.data
    } catch (error) {
      console.error('Erro ao buscar as quantidades das viagens:', error)
      throw error
    }
  },

 async syncQueueInsert(): Promise<void> {
    try {
      await api.post(`/dashboard/queueInsert/sync`)
    } catch (error) {
      console.error('Erro ao sincronizar dados de simulações:', error)
      throw error
    }
  },

 async getAbandonedTrips(): Promise<any> {
    try {
      const now = new Date()
      const minutesSinceMidnight = now.getHours() * 60 + now.getMinutes() + 1

      const response = await api.get<{ response: any }>(`/dashboard/abandonedTrips`, {
        params: {
          minutes: minutesSinceMidnight
        }
      })

      return response?.data?.response || { summary: {}, items: [] }
    } catch (error: any) {
      if (error?.response?.status === 404) {
        return { summary: {}, items: [] }
      }
      console.error('Erro ao buscar simulações abandonadas:', error?.message || error)
      return { summary: {}, items: [] }
    }
  },

 async getCanceledTrips(): Promise<TripDetail[]> {
    try {
      const date = getLocalDateString(new Date())

      const response = await api.get<{ response: TripDetail[] }>(`/dashboard/tripsByStatus`, {
        params: {
          status: 'canceled',
          date
        }
      })

      return response?.data?.response || []
    } catch (error: any) {
      if (error?.response?.status === 404) {
        return []
      }
      console.error('Erro ao buscar viagens canceladas:', error?.message || error)
      return []
    }
  },

 async getUnattendedTrips(dateStart?: string, dateEnd?: string): Promise<TripDetail[]> {
    try {
      const params: any = {
        status: 'unattended'
      }

      if (dateStart && dateEnd) {
        params.dateStart = dateStart
        params.dateEnd = dateEnd
      } else {
        params.date = getLocalDateString(new Date())
      }

      const response = await api.get<{ response: TripDetail[] }>(`/dashboard/tripsByStatus`, {
        params
      })

      return response?.data?.response || []
    } catch (error: any) {
      if (error?.response?.status === 404) {
        return []
      }
      console.error('Erro ao buscar viagens não atendidas:', error?.message || error)
      return []
    }
  },
}
