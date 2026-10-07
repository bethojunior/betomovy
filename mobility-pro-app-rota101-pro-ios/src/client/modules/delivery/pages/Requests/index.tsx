// @ts-nocheck

import {useState, useEffect} from 'react';
import {Dimensions} from 'react-native';
import {TabView, SceneMap, TabBar} from 'react-native-tab-view';
import {shade} from 'polished';
import {useOrderService} from '../../../../contexts/orderService';
import ListInProgressOrder from '../../components/ListInProgressOrder';
import ListOrder from '../../components/ListOrder';
import Guest from '../Guest';

import {translate} from '../../../../locales';
import {Container, styles, TitlePage} from './styles';
import theme from '../../../../styles/theme';
import {useAuth} from '../../../../../context/auth';

const initialLayout = {
  width: Dimensions.get('window').width,
};

const renderTabBar = props => (
  <TabBar
    getLabelText={({route}) => route.title}
    {...props}
    indicatorStyle={{backgroundColor: theme.colors.secondary}}
    style={{
      backgroundColor: shade(0.05, theme.colors.background_global),
      color: theme.colors.secondary,
    }}
    activeColor={theme.colors.secondary}
    inactiveColor={theme.colors.text_gray}
  />
);

export default function Requests({navigation}) {
  const {isGuest} = useAuth();
  const {indexSelected} = useOrderService();
  const [index, setIndex] = useState(0);
  const [routes] = useState([
    {key: 'first', title: translate('request.text_previous')},
    {key: 'second', title: translate('request.text_in_progress')},
  ]);

  useEffect(() => {
    setIndex(indexSelected);
  }, [indexSelected]);

  const renderScene = SceneMap({
    first: ListOrder,
    second: ListInProgressOrder,
  });

  if (isGuest)
    return (
      <Container>
        <TitlePage style={styles.titlePage}>
          {translate('request.text_orders')}
        </TitlePage>
        <Guest />
      </Container>
    );

  return (
    <Container>
      <TabView
        navigationState={{index, routes}}
        renderScene={renderScene}
        onIndexChange={setIndex}
        initialLayout={initialLayout}
        renderTabBar={renderTabBar}
      />
    </Container>
  );
}
