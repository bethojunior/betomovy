declare type LocationRequest = {
  latitude: string;
  longitude: string;
};

declare type DirectionFullAddressResponse = {
  origin: string;
  destination: string;
  distance: {
    text: string;
    value: number;
  };
  duration: {
    text: string;
    value: number;
  };
};

declare type GoogleDirectionApiResponse = {
  destination_addresses: string[];
  origin_addresses: string[];
  rows: {
    elements: {
      distance: {
        text: string;
        value: number;
      };
      duration: {
        text: string;
        value: number;
      };
      status: string;
    }[];
  }[];
  status: string;
  error_message: string;
};

declare type HereDirectionApiResponse = {
  routes: {
    sections: {
      arrival: {
        place: {
          originalLocation: string;
        };
      };
      departure: {
        place: {
          originalLocation: string;
        };
      };
      summary: {
        length: number;
        duration: number;
      };
      spans: {
        names: {
          value: string;
          language: string;
        }[];
      }[];
    }[];
  }[];
};

declare type MapBoxDirectionApiResponse = {
  routes: {
    distance: number;
    duration: number;
  }[];
  waypoints: {
    name: string;
  }[];
};

declare type SeuMiltoMapsDirectionApiResponse = {
  status: boolean;
  response: ?{
    destination: ?string;
    origin: ?string;
    distance: {
      text: string;
      value: number;
    };
    duration: {
      text: string;
      value: number;
    };
    overview_polyline: string;
  };
  message: string;
};
