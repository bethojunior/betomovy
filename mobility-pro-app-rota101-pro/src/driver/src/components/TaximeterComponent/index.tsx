import {useModals} from '../../../../context/Modals';
import {If} from '../If';
import {ViewTaximeter} from '../ViewTaximeter';
import {TripTypeUnic} from '../ViewTaximeter/types';

interface Props {
  onClose?: () => void;
  selectedTripTaximeter?: TripTypeUnic;
  setModalTaximeter?: (value: boolean) => void;
  setContainerTaximeter?: (value: boolean) => void;
  setSelectedTripTaximeter?: (value: TripTypeUnic) => void;
  setIniTripModal?: (value: boolean) => void;
}

export const TaximeterComponent = ({
  onClose,
  selectedTripTaximeter,
  setSelectedTripTaximeter,
  setModalTaximeter,
  setIniTripModal,
}: Props) => {
  const {setContainerTaximeter, containerTaximeter} = useModals();

  const handleClose = () => {
    setContainerTaximeter(false);
    onClose();
  };
  return (
    <If condition={containerTaximeter}>
      <ViewTaximeter
        onClose={handleClose}
        selectedTripTaximeter={selectedTripTaximeter}
        setSelectedTripTaximeter={setSelectedTripTaximeter}
        setModalTaximeter={setModalTaximeter}
        setContainerTaximeter={setContainerTaximeter}
        setIniTripModal={setIniTripModal}
      />
    </If>
  );
};
