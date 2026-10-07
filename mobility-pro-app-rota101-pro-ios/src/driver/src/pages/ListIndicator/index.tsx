import {useEffect, useState} from 'react';
import {translate} from '../../../../client/locales';
import {If} from '../../components/If';
import {ItemListindicator} from '../../components/ItemListindicator';
import Preload from '../../components/Preload';
import {Pagination} from '../../context/bank/types';
import {useUserDriver} from '../../context/userDriver';
import {IndicatorList} from '../../context/userDriver/types';
import {convertDateToBr} from '../../utils/FormatDate';
import {Container, IndicatorListData, NotFavorites, Title} from './styles';

export function ListIndicator() {
  const {getIndicatorList} = useUserDriver();
  const [indicators, setIndicators] = useState<IndicatorList[]>([]);
  const [loading, setLoading] = useState(false);
  const [page, setPage] = useState(1);
  const [dataPage, setDataPage] = useState<Pagination>({} as Pagination);

  const onInit = async () => {
    setLoading(true);
    const response = await getIndicatorList(String(page));

    if (response) {
      setIndicators(response.data);
      setDataPage({
        currentPage: response.currentPage,
        endRange: response.endRange,
        lastPage: response.lastPage,
        nextPage: response.nextPage,
        previousPage: response.previousPage,
        showEndButton: response.showEndButton,
        showStartButton: response.showStartButton,
        startRange: response.startRange,
        startRow: response.startRow,
        totalRows: response.totalRows,
      });

      setLoading(false);
    }

    setLoading(false);
  };

  useEffect(() => {
    onInit();
  }, [page]);

  return (
    <Container>
      <Preload visible={loading} />
      <If condition={indicators.length > 0}>
        <Title>
          {indicators.length} {translate('indicator.indicators')}
        </Title>
        <IndicatorListData
          data={indicators}
          keyExtractor={(item, index) => index.toString()}
          renderItem={({item}) => (
            <ItemListindicator
              date={convertDateToBr(item.created_at)}
              name={item.indicated_name}
              type={item.indicated_type}
            />
          )}
        />
      </If>

      <If condition={indicators.length === 0}>
        <NotFavorites>{translate('indicator.not_indicators')}</NotFavorites>
      </If>
    </Container>
  );
}
