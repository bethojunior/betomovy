import { useUserDriver } from '../../context/userDriver';
import { CardButtonText } from '../CardButtonText';
import { useModals } from '../../../../context/Modals';
import { Fragment } from 'react';
import { useTaximeter } from '../../context/Taximeter';

export const ButtonScrollViewTaximeter = ({
  setModalTaximeter,
  setSelectedTripType,
}) => {
  const { userDriverFind } = useUserDriver();
  const { setContainerTaximeter } = useModals();
  const { clearStorage } = useTaximeter();


  return (
    <Fragment>
      {userDriverFind?.tripTypes?.length > 0 &&
        userDriverFind?.tripTypes?.map((item, index) => {
          return (
            <CardButtonText
              key={index}
              text={item?.tripType?.toUpperCase()}
              onPress={() => {
                setModalTaximeter(false);
                clearStorage();
                setSelectedTripType(item);
                setContainerTaximeter(true);
              }}
            />
          );
        })}
    </Fragment>
  );
};
