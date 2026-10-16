import { useTripStatusProvider } from '../../context/TripStatus';
import { useDriverHours } from '../../hooks/useDriverHours';
import { ModalHorasLimites } from '../ModalHorasLimites';
import { useState, useEffect } from 'react';

export const ButtonTargetComponent = () => {
  const [showModalHoras, setShowModalHoras] = useState(false);

  const buttonTargetVisibility: any = useTripStatusProvider(
    (context: any) => context.buttonTargetVisibility,
  );

  const { checkDriverStatusAndHours, shouldShowModal, hasShownModalInHome } =
    useDriverHours();

  const checkHoursAutomatically = async () => {
    await checkDriverStatusAndHours();

    setTimeout(() => {
      if (shouldShowModal && !hasShownModalInHome) {
        setShowModalHoras(true);
      }
    }, 500);
  };

  useEffect(() => {
    if (buttonTargetVisibility) {
      const timer = setTimeout(() => {
        checkHoursAutomatically();
      }, 5000);

      return () => clearTimeout(timer);
    }
  }, [buttonTargetVisibility]);

  return (
    <ModalHorasLimites
      visible={showModalHoras}
      onClose={() => setShowModalHoras(false)}
    />
  );
};
