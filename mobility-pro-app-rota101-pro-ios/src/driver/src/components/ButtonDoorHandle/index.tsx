import { FontAwesome } from '@expo/vector-icons';
import { TextEdit } from '../TextEdit';
import { ButtonPanic, ContainerPanic } from './styles';
import theme from '../../styles/theme';
import { translate } from '../../../../client/locales';

interface Props {
  setVisible?: (value: boolean) => void;
  setVisibleNegativateModal?: (data: boolean) => void;
  visibleNegativateModal?: boolean;
  visible?: boolean;
  isNegativate: boolean;
}

export const ButtonDoorHandle = ({
  setVisible,
  visible,
  isNegativate,
  setVisibleNegativateModal,
  visibleNegativateModal,
}: Props) => {
  const handleOpenDoor = async () => {
    if (isNegativate) {
      return setVisibleNegativateModal(true);
    }
    return setVisible(true);
  };

  return (
    <ContainerPanic>
      <ButtonPanic onPress={handleOpenDoor} activeOpacity={0.8}>
        <FontAwesome
          name="car"
          size={46}
          style={{
            color: theme.colors.primaryText,
          }}
        />
        <TextEdit
          change="uppercase"
          size="small"
          color={theme.colors.primaryText}
        >
          {translate('doorHandle.name_door_handle')}
        </TextEdit>
      </ButtonPanic>
    </ContainerPanic>
  );
};
