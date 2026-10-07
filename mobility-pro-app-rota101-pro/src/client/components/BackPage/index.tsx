import {TouchableNativeFeedback} from 'react-native';
import {ContainerButtonBackPage, ContentButtonBackPage, ContentTitleBackPage, Title} from './styles';
import Icon from '@expo/vector-icons/FontAwesome5';
import {RFValue} from 'react-native-responsive-fontsize';
import theme from '../../styles/theme';

interface Props {
  onPress: () => void;
  text?: string;
  ml?: number;
}

export function BackPage(props: Props) {
  const {onPress, text, ml} = props;
  return (
    <ContainerButtonBackPage>
      <TouchableNativeFeedback onPress={onPress}>
        <ContentButtonBackPage ml={ml}>
          <Icon name="arrow-left" color={theme.colors.primary} size={RFValue(20)} />
        </ContentButtonBackPage>
      </TouchableNativeFeedback>
      <ContentTitleBackPage>
        <Title>{text || ''}</Title>
      </ContentTitleBackPage>
    </ContainerButtonBackPage>
  );
}
