import {Ionicons} from '@expo/vector-icons';
import {useState} from 'react';
import {useUserDriver} from '../../context/userDriver';
import {If} from '../If';
import {
  Avatar,
  Container,
  ContentImage,
  ContentValue,
  HeaderTop,
  styles,
  Value,
} from './styles';
import {buildApp} from '../../../../constantBuild/config';
import {useAuth} from '../../../../context/auth';
import theme from '../../styles/theme';
import {RFValue} from 'react-native-responsive-fontsize';
import {useModals} from '../../../../context/Modals';
interface Props {
  aminating?: any;
  styleRelative?: boolean;
  children?: React.ReactNode;
}

export const HomeHeaderTop = ({aminating, children, styleRelative}: Props) => {
  const {userDriverFind} = useUserDriver();
  const {setVisibleMenu, visibleMenu} = useModals();
  const {cityConfig} = useAuth();

  const [viewValue, setViewValue] = useState(false);

  return (
    <Container
      style={{
        position: styleRelative ? 'relative' : 'absolute',
      }}
    >
      {children && children}
      <HeaderTop>
        <ContentImage
          style={styles.bell}
          activeOpacity={0.7}
          onPress={() => setVisibleMenu(!visibleMenu)}
        >
          <Avatar
            source={{
              uri: `${buildApp().HOST_IMAGE_DRIVER}${
                userDriverFind?.profileImage
              }`,
            }}
          />
        </ContentImage>

        <ContentValue
          visible={!viewValue}
          style={styles.bell}
          activeOpacity={0.8}
          onPress={() => setViewValue(!viewValue)}
        >
          <If condition={viewValue === true}>
            {/* <MaterialIcons name="sync" size={24} color={colors.white} /> */}
            <Value>
              {cityConfig?.typeMoney}
              {userDriverFind?.statistics
                ? userDriverFind?.statistics.value_collected
                : '--'}
            </Value>
          </If>

          <If condition={viewValue === false}>
            <Ionicons
              name="eye-off"
              size={RFValue(24)}
              color={theme.colors.primaryText}
            />
          </If>
        </ContentValue>
      </HeaderTop>
    </Container>
  );
};
