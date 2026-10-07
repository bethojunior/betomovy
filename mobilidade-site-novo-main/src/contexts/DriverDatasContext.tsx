import { createContext, useReducer, useContext } from "react";
import { DEFAULT_COUNTRY } from "../utils/countryCodes";

interface DriverDatasContextProps {
  state: State;
  dispatch: (action: Action) => void;
}

interface DriverDatasContextProviderProps {
  children: React.ReactNode;
}

interface State {
  stepPersonalData: {
    nameDriver: string;
    cpfAndCnpjDriver: string;
    genderDriver: string;
    email: string;
    phone: string;
    // iso2, não dialCode — vários países dividem o mesmo DDI (ex: "1" é
    // EUA, Canadá, Jamaica, Rep. Dominicana...), então só isso é único.
    phoneCountryIso2: string;
    password: string;
  };
  stepSelectCity: {
    city: string;
  };
  stepPhotoPerfil: {
    id: null;
    photo: string;
    profile: {
      data: any;
      name: string;
      id: number; 
    };
  };
  stepDataVehicle: {
    numberDocument: string;
    brandCar: string;
    modelCar: string;
    plateCar: string;
    numberRenavam: string;
    colorCar: string;
    numberSeats: number;
    yearCar: string;
    cnpjCompany: string;
  };
}

interface Action {
  type: FormActions;
  payload?: any;
}

export const enum FormActions {
  setPersonalData,
  setPhotoPerfil,
  setSelectCity,
  setDataVehicle,
  setReset,
}

export const DriverDatasContext = createContext<
  DriverDatasContextProps | undefined
>(undefined);

export const initalData = {
  stepPersonalData: {
    nameDriver: "",
    cpfAndCnpjDriver: "",
    genderDriver: "",
    email: "",
    phone: "",
    phoneCountryIso2: DEFAULT_COUNTRY.iso2,
    password: "",
  },
  stepSelectCity: {
    city: "",
  },
  stepPhotoPerfil: {
    photo: "",
    profile: {
      data: {},
      name: "",
    },
  },
  stepDataVehicle: {
    numberDocument: "",
    brandCar: "",
    modelCar: "",
    plateCar: "",
    numberRenavam: "",
    colorCar: "",
    numberSeats: 0,
    yearCar: "",
    cnpjCompany: "",
  },
};
const formDataDriver = (state: State, action: Action) => {
  switch (action.type) {
    case FormActions.setPersonalData:
      return { ...state, stepPersonalData: action.payload };
    case FormActions.setSelectCity:
      return { ...state, stepSelectCity: action.payload };
    case FormActions.setPhotoPerfil:
      return { ...state, stepPhotoPerfil: action.payload };
    case FormActions.setDataVehicle:
      return { ...state, stepDataVehicle: action.payload };

    case FormActions.setReset:
      return initalData;

    default:
      return state;
  }
};

export const DriverDatasContextProvider = ({
  children,
}: DriverDatasContextProviderProps) => {
  const [state, dispatch] = useReducer(formDataDriver, initalData);

  const value = { state, dispatch };

  return (
    <DriverDatasContext.Provider value={value}>
      {children}
    </DriverDatasContext.Provider>
  );
};

export const useDriverDatasContext = () => {
  const context = useContext(DriverDatasContext);

  if (context === undefined) {
    throw new Error(
      "useDriverDatas precisa ser usado dentro do DriverDatasContextProvider"
    );
  }

  return context;
};
