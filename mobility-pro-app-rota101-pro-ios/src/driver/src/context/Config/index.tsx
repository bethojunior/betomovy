import {createContext, useContext, useMemo, useState} from 'react';
import {customToast} from '../../../../utils/FlashMessage';
import {ConfigService} from './services';
import {translate} from '../../../../client/locales';

interface ConfigProps {
  getPaymentForm: () => void;
  getChooseDriverPaymentForm: () => void;
  getImpositionPaymentForm: () => void;
  updateChooseDriver: (id: number[]) => Promise<void>;
  listPaymentForm: List[];
  listChooseDriver: List[];
  setListChooseDriver: (listChooseDriver: List[]) => void;
  listImposition: List[];
}

interface List {
  active: number;
  idTripPaymentForm: number;
  name: string;
  paymentFormTypeId: number;
  statusId: number;
  id: number;
  tripPaymentFormId: number;
}

// const ConfigContext = createContext({} as ConfigProps);

// export const ConfigProvider = ({children}: any) => {
//   const [listPaymentForm, setPaymentForm] = useState<List[]>();
//   const [listChooseDriver, setListChooseDriver] = useState<List[]>();
//   const [listImposition, setListImposition] = useState<List[]>();

//   const service = ConfigService();

//   const getPaymentForm = async () => {
//     const response = await service.get();
//     if (!response.status) {
//       return customToast(response.message, 'danger');
//     }
//     return setPaymentForm(response.data);
//   };

//   const getChooseDriverPaymentForm = async () => {
//     const response = await service.getChooseDriver();
//     if (!response.status) {
//       return customToast(response.message, 'danger');
//     }
//     return setListChooseDriver(response.data);
//   };

//   const getImpositionPaymentForm = async () => {
//     const response = await service.getImposition();
//     if (!response.status) {
//       return customToast(response.message, 'danger');
//     }
//     return setListImposition(response.data);
//   };

//   const updateChooseDriver = async (id: number[]) => {
//     const response = await service.chooseFormPayment(id);
//     if (!response.status) {
//       return customToast(response.message, 'danger');
//     }
//     return customToast(
//       translate('configPage.title_payment_form_updated'),
//       'success',
//     );
//   };

//   const value = useMemo(() => {
//     return {
//       getPaymentForm,
//       getChooseDriverPaymentForm,
//       getImpositionPaymentForm,
//       updateChooseDriver,
//       listPaymentForm,
//       listChooseDriver,
//       listImposition,
//       setListChooseDriver,
//     };
//   }, [
//     getPaymentForm,
//     getChooseDriverPaymentForm,
//     getImpositionPaymentForm,
//     updateChooseDriver,
//     listPaymentForm,
//     listChooseDriver,
//     listImposition,
//     setListChooseDriver,
//   ]);
//   return (
//     <ConfigContext.Provider value={value}>{children}</ConfigContext.Provider>
//   );
// };
// export const useConfig = () => {
//   const context = useContext(ConfigContext);
//   return context;
// };

export const useConfig = () => {
  const [listPaymentForm, setPaymentForm] = useState<List[]>();
  const [listChooseDriver, setListChooseDriver] = useState<List[]>();
  const [listImposition, setListImposition] = useState<List[]>();

  const service = ConfigService();

  const getPaymentForm = async () => {
    const response = await service.get();
    if (!response.status) {
      return customToast(response.message, 'danger');
    }
    return setPaymentForm(response.data);
  };

  const getChooseDriverPaymentForm = async () => {
    const response = await service.getChooseDriver();
    if (!response.status) {
      return customToast(response.message, 'danger');
    }
    return setListChooseDriver(response.data);
  };

  const getImpositionPaymentForm = async () => {
    const response = await service.getImposition();
    if (!response.status) {
      return customToast(response.message, 'danger');
    }
    return setListImposition(response.data);
  };

  const updateChooseDriver = async (id: number[]) => {
    const response = await service.chooseFormPayment(id);
    if (!response.status) {
      return customToast(response.message, 'danger');
    }
    return customToast(
      translate('configPage.title_payment_form_updated'),
      'success',
    );
  };

  return {
    getPaymentForm,
    getChooseDriverPaymentForm,
    getImpositionPaymentForm,
    updateChooseDriver,
    listPaymentForm,
    listChooseDriver,
    listImposition,
    setListChooseDriver,
  };
};
