import {Entypo} from '@expo/vector-icons';
import {ButtonPanic, ContainerPanic} from './styles';
import theme from '../../styles/theme';
import {RFValue} from 'react-native-responsive-fontsize';
interface Props {
  openTaximeter?: () => void;
  // visible?: boolean;
  disabled?: boolean;
}

export const ButtonTaximeter = ({openTaximeter, disabled = false}: Props) => {
  return (
    <ContainerPanic>
      <ButtonPanic
        onPress={openTaximeter}
        disabled={!disabled}
        opacity={!disabled ? 0.5 : 1}
        activeOpacity={0.8}
      >
        <Entypo
          name="stopwatch"
          size={RFValue(24)}
          style={{
            color: theme.colors.primaryText,
          }}
        />
      </ButtonPanic>
    </ContainerPanic>
  );
};
