import {useEffect, useState} from 'react';
import {
  NavigationProp,
  ParamListBase,
  useNavigation,
} from '@react-navigation/native';
import {translate} from '../../../../client/locales';
import {Button} from '../../components/Button';
import {CardTicket} from '../../components/CardTicket';
import {If} from '../../components/If';
import Preload from '../../components/Preload';
import {usePrepaid} from '../../context/prepaid';
import {PrepaidProps} from '../../context/prepaid/types';
import {moneyMask} from '../../utils/money';

import {CardContent, Container, ContentButton, NotPrepaid} from './styles';

export function Prepaid() {
  const {getListPrepaid} = usePrepaid();
  const {navigate}: NavigationProp<ParamListBase> = useNavigation();
  const [listPrepaid, setListPrepaid] = useState<PrepaidProps[]>([]);
  const [loading, setLoading] = useState(true);
  const [selectedPrepaid, setSelectedPrepaid] = useState<PrepaidProps>(
    {} as PrepaidProps,
  );

  const onInit = async () => {
    setLoading(true);
    const response = await getListPrepaid();

    if (response) {
      setListPrepaid(response);
      setLoading(false);
    }

    setLoading(false);
  };

  useEffect(() => {
    onInit();
  }, []);

  return (
    <Container>
      <Preload visible={loading} />
      <If condition={listPrepaid.length > 0}>
        <CardContent
          data={listPrepaid}
          keyExtractor={(item, index) => index.toString()}
          renderItem={({item}) => (
            <CardTicket
              title={item.title}
              subTitle={item.superTitle}
              titleLeft={item.stripe}
              value={moneyMask(parseFloat(item.sellPrice || '0'))}
              onPress={() => {
                setSelectedPrepaid(item);
              }}
              itemSelected={selectedPrepaid.id === item.id}
            />
          )}
        />

        <ContentButton>
          <Button
            title={translate('prepaidDriver.text_button_select')}
            disabled={selectedPrepaid.id === undefined}
            onPress={() =>
              navigate('PaymentOptionsPrepaid', {prepaid: selectedPrepaid})
            }
          />
        </ContentButton>
      </If>

      <If condition={listPrepaid.length === 0 && loading === false}>
        <NotPrepaid>{translate('prepaidDriver.not_prepaid')}</NotPrepaid>
      </If>
    </Container>
  );
}
