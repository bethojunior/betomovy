import {View, TouchableNativeFeedback} from 'react-native';
import Icon from '@expo/vector-icons/FontAwesome5';
import {AntDesign} from '@expo/vector-icons';
import {useTheme} from 'styled-components';
import {
  Container,
  Content,
  ContentRow,
  DriverInfo,
  IconContent,
  Section,
  SubSection,
  SubTitle,
  Title,
  TitleCode,
} from './styles';
import {useUserDriver} from '../../../context/userDriver';
import {translate} from '../../../../../client/locales';

interface Props {
  icon: any;
  title: string;
  subtitle?: string;
  onPress: () => void;
  avatar?: boolean;
  createCode?: () => string;
  titleBold?: boolean;
}

export default function ButtonWithIcon({
  icon,
  title,
  subtitle,
  onPress,
  avatar,
  createCode,
  titleBold,
}: Props) {
  const {colors} = useTheme();
  const {userDriverFind} = useUserDriver();

  return (
    <View>
      <TouchableNativeFeedback onPress={onPress}>
        <Container>
          <IconContent avatar={avatar}>{icon}</IconContent>
          <Content>
            <Title titleBold={titleBold}>{title}</Title>
            {subtitle ? (
              <ContentRow>
                <View>
                  <Section>
                    <DriverInfo>
                      {translate('legend_button_profile.text_your_code')}{' '}
                    </DriverInfo>
                    <TitleCode>{createCode && createCode()}</TitleCode>
                  </Section>
                  <Section>
                    <SubSection>
                      <DriverInfo>
                        {translate('legend_button_profile.text_avaliation')}{' '}
                        {userDriverFind?.rating}{' '}
                      </DriverInfo>
                      <AntDesign name="star" size={12} color={colors.secondary} />
                    </SubSection>
                    <SubSection>
                      <DriverInfo style={{marginLeft: 40, marginRight: 3}}>
                        {translate('legend_button_profile.text_trips')}{' '}
                        {userDriverFind?.total_finished_trip || 0}
                      </DriverInfo>
                      <Icon name="car" size={12} color={colors.secondary} />
                    </SubSection>
                  </Section>
                  <View>
                    <DriverInfo>
                      {translate('legend_button_profile.text_car')}{' '}
                      {userDriverFind?.car?.brand} {userDriverFind?.car?.model},{' '}
                      {userDriverFind?.car?.plate}
                    </DriverInfo>
                  </View>
                </View>
              </ContentRow>
            ) : null}
            {subtitle ? <SubTitle>{subtitle}</SubTitle> : null}
          </Content>
          <Icon
            name="chevron-right"
            size={13}
            style={{
              position: 'absolute',
              right: 15,
              color: colors.secondary,
            }}
          />
        </Container>
      </TouchableNativeFeedback>
    </View>
  );
}
