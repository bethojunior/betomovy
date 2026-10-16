import { useEffect, useState } from 'react';
import { translate } from '../../../../client/locales';
import { ItemListindicator } from '../../components/ItemListindicator';
import Preload from '../../components/Preload';
import { useUserDriver } from '../../context/userDriver';
import { IndicatorList } from '../../context/userDriver/types';
import { convertDateToBr } from '../../utils/FormatDate';
import { Container, IndicatorListData, NotFavorites, Title } from './styles';

export function ListIndicator() {
  const {getIndicatorList} = useUserDriver();
  const [indicators, setIndicators] = useState<IndicatorList[]>([]);
  const [loading, setLoading] = useState(false);

  const onInit = async () => {
    setLoading(true);
    const response = await getIndicatorList('1');
    setIndicators(response.data);

    // Indica que finalizou a primeira renderização
    setLoading(false);
  };

  // Faz a primeira requisição para retornar os dados na tela
  useEffect(() => {
    onInit();
  }, []);

  return (
    <Container>
      <Preload visible={loading} />

      <Title>
        {indicators.length} {translate('indicator.indicators')}
      </Title>

      <IndicatorListData
        data={indicators}
        keyExtractor={(item) => item.userIndicatedId.toString()}
        renderItem={({item}) => (
          <ItemListindicator
            date={convertDateToBr(item.created_at)}
            name={item.indicated_name}
            type={item.indicated_type}
          />
        )}
        ListEmptyComponent={!loading && (<NotFavorites>{translate('indicator.not_indicators')}</NotFavorites>)}
      />
    </Container>
  );
}