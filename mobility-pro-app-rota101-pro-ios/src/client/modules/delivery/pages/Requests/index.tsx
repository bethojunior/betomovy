import { useState, useEffect } from 'react';
import { View, Text, TouchableOpacity } from 'react-native';
import { useOrderService } from '../../../../contexts/orderService';
import ListInProgressOrder from '../../components/ListInProgressOrder';
import ListOrder from '../../components/ListOrder';
import Guest from '../Guest';

import { translate } from '../../../../locales';
import { Container, TitlePage } from './styles';
import theme from '../../../../styles/theme';
import { useAuth } from '../../../../../context/auth';

export default function Requests({ navigation }) {
  const { isGuest } = useAuth();
  const { indexSelected } = useOrderService();
  const [index, setIndex] = useState(0);
  const [routes] = useState([
    { key: 'first', title: translate('request.text_previous') },
    { key: 'second', title: translate('request.text_in_progress') },
  ]);

  useEffect(() => {
    setIndex(indexSelected);
  }, [indexSelected]);

  const renderScene = () => {
    switch (index) {
      case 0:
        return <ListOrder />;
      case 1:
        return <ListInProgressOrder />;
      default:
        return null;
    }
  };

  const handleTabChange = (newIndex: number) => {
    setIndex(newIndex);
  };

  if (isGuest)
    return (
      <Container>
        <TitlePage>
          {translate('request.text_orders')}
        </TitlePage>
        <Guest />
      </Container>
    );

  return (
    <Container>
      <View style={{ flexDirection: 'row' }}>
        {routes.map((route, i) => (
          <TouchableOpacity
            key={route.key}
            onPress={() => handleTabChange(i)}
            style={{
              flex: 1,
              padding: 10,
              alignItems: 'center',
              borderBottomWidth: 2,
              borderBottomColor: index === i ? theme.colors.secondary : theme.colors.background_global,
            }}
          >
            <Text
              style={{
                color: index === i ? theme.colors.secondary : theme.colors.text_gray,
                fontWeight: index === i ? 'bold' : 'normal',
              }}
            >
              {route.title}
            </Text>
          </TouchableOpacity>
        ))}
      </View>

      <View style={{ flex: 1 }}>
        {renderScene()}
      </View>
    </Container>
  );
}
