import {View} from 'react-native';
import {
  ContainerActivate,
  ContainerModal,
  ContentModal,
  ModalView,
} from './styles';
import theme from '../../styles/theme';
import {HomeHeaderTop} from '../HomeHeaderTop';
import {ButtonToogleComponent} from '../ButtonToogleComponent';
import {InfoDataGraphic} from '../InfoDataGraphic';
import {ComponentConditionalDelivery} from '../ComponentConditionalDelivery';
import {OrdersActiveDelivery} from '../OrdersActiveDelivery';

export const ViewDeliveryTrip = () => {
  return (
    <ModalView visible={true}>
      <ContainerModal>
        <ContentModal>
          <View
            style={{
              borderBottomWidth: 0.5,
              borderBottomColor: theme.colors.primary,
              paddingVertical: 10,
            }}
          >
            <HomeHeaderTop styleRelative />
          </View>
          <ComponentConditionalDelivery
            NoTripActiveComponent={
              <>
                <ContainerActivate>
                  <ButtonToogleComponent />
                </ContainerActivate>
                <InfoDataGraphic />
              </>
            }
            TripActiveComponent={<OrdersActiveDelivery />}
          />
        </ContentModal>
      </ContainerModal>
    </ModalView>
  );
};
