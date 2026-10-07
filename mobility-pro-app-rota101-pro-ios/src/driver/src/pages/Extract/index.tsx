import { useEffect, useState } from 'react';
import { RFValue } from 'react-native-responsive-fontsize';
import { VictoryPie } from 'victory-native';
import { useTheme } from 'styled-components';
import FontAwesome from '@expo/vector-icons/FontAwesome';
import MaterialIcons from '@expo/vector-icons/MaterialIcons';
import { Alert, Modal } from 'react-native';
import Fontisto from '@expo/vector-icons/Fontisto';
import { subDays } from 'date-fns';
import { Chip, Divider } from 'react-native-paper';
import { CardTransfer } from '../../components/CardTransfer';
import { If } from '../../components/If';
import { PaginationTransferSelect } from '../../components/PaginationTransferSelect';
import Preload from '../../components/Preload';
import { useBank } from '../../context/bank';
import {
  DriverInfoProps,
  LastTransactionProps,
  Pagination,
} from '../../context/bank/types';

import {
  ButtonDate,
  ButtonDateText,
  ButtonExit,
  Chart,
  Container,
  ContainerCard,
  ContainerGraphic,
  ContainerValue,
  Content,
  ContentInfo,
  ContentModalDate,
  DateContainer,
  DateText,
  Exit,
  Filters,
  Info,
  InfoText,
  InfoValue,
  Text,
  TextExit,
  TextSize,
  Value,
} from './styles';
import { moneyMask } from '../../utils/money';
import { convertDate, convertUSDate } from '../../utils/FormatDate';
import { Calendar } from '../../components/Calendar';
import { translate } from '../../../../client/locales';
import Helper from '../../utils/Helper';
import { shade } from 'polished';
import theme from '../../../../client/styles/theme';

export function Extract() {
  const { getTransactions } = useBank();
  const { colors } = useTheme();
  const [transactions, setLastTransactions] = useState([]);
  const [balance, setBalance] = useState({} as DriverInfoProps);
  const [page, setPage] = useState(1);
  const [selectedValue, setSelectedValue] = useState('');
  const [dataPage, setDataPage] = useState<Pagination>({} as Pagination);
  const [loading, setLoading] = useState(true);
  const [endDate, setEndDate] = useState(convertUSDate(new Date()));
  const [startDate, setStartDate] = useState(
    convertUSDate(subDays(Date.now(), 30)),
  );
  const [modalVisible, setModalVisible] = useState(false);
  const [modalEnd, setModalEnd] = useState(false);

  const getTransactionsAsync = async () => {
    setLoading(true);
    const response = await getTransactions(
      page,
      selectedValue,
      startDate,
      endDate,
    );

    if (!response) {
      setLoading(false);
      return;
    }

    setLastTransactions(response.transactions);
    setDataPage(response.paginate);
    setBalance(response.driverInfo);

    setLoading(false);
  };

  function handleDateSelect(day) {
    if (new Date(day).getTime() > new Date(endDate).getTime()) {
      return Alert.alert(
        'Data inválida',
        'A data inicial não pode ser maior que a data final.',
      );
    }

    if (
      (new Date(endDate).getTime() - new Date(day).getTime()) /
      (1000 * 60 * 60 * 24) >
      60
    ) {
      setStartDate(endDate);

      return Alert.alert(
        'Data inválida',
        'O período não pode ser maior que 60 dias, selecione outra data.',
      );
    }

    setStartDate(day);
    setModalVisible(false);

    return true;
  }

  function handleDateSelectEnd(day) {
    if (new Date(day).getTime() < new Date(startDate).getTime()) {
      return Alert.alert(
        'Data inválida',
        'A data inicial não pode ser maior que a data final.',
      );
    }

    if (
      (new Date(day).getTime() - new Date(startDate).getTime()) /
      (1000 * 60 * 60 * 24) >
      60
    ) {
      return Alert.alert(
        'Data inválida',
        'O período não pode ser maior que 60 dias, selecione outra data.',
      );
    }

    setEndDate(day);
    setModalEnd(false);

    return true;
  }

  const handleDays = (days: number) => {
    setStartDate(convertUSDate(subDays(Date.now(), days)));
    setEndDate(convertUSDate(new Date()));
  };

  const color = [
    shade(0.07, theme.colors.background_global),
    theme.colors.background_global
  ];

  useEffect(() => {
    getTransactionsAsync();
  }, [page, selectedValue, startDate, endDate]);

  return (
    <Container>
      <Preload visible={loading} />
      <ContainerGraphic>
        <Chart>
          <VictoryPie
            data={
              Number(balance?.total_credit) || Number(balance?.total_debit) > 0
                ? [
                  { x: 'Saidas', y: balance?.total_debit },
                  { x: 'Entradas', y: balance?.total_credit },
                ]
                : [
                  { x: 'Entradas', y: 50 },
                  { x: 'Saidas', y: 50 },
                ]
            }
            style={{
              labels: {
                display: 'none',
              },
            }}
            colorScale={[colors.secondary, colors.primary]}
            innerRadius={15}
            padAngle={0}
            width={RFValue(105)}
            height={RFValue(105)}
            padding={{ top: 0, bottom: 0, left: 0, right: 0 }}
          />
        </Chart>

        <ContainerValue>
          <Text>{translate('driver_extract.subTitle')}</Text>
          <Value>R$ {moneyMask(parseFloat(balance?.balance || '0'))}</Value>
        </ContainerValue>
      </ContainerGraphic>

      <ContentInfo>
        <Info>
          <FontAwesome
            name="circle"
            size={12}
            color={colors.primary}
            style={{
              marginRight: 8,
            }}
          />
          <InfoText>{translate('driver_extract.entries')} </InfoText>
          <InfoValue>
            R$ {moneyMask(parseFloat(balance?.total_credit || '0'))}
          </InfoValue>
        </Info>

        <Info>
          <FontAwesome
            name="circle"
            size={12}
            color={colors.secondary}
            style={{
              marginRight: 8,
            }}
          />
          <InfoText>{translate('driver_extract.outings')} </InfoText>
          <InfoValue>
            R$ {moneyMask(parseFloat(balance?.total_debit || '0'))}
          </InfoValue>
        </Info>
      </ContentInfo>

      <Divider />

      <DateText>{translate('driver_extract.select_preiod')}</DateText>

      <DateContainer>
        <ButtonDate onPress={() => setModalVisible(true)}>
          <ButtonDateText>{convertDate(startDate)}</ButtonDateText>
          <Fontisto name="calendar" size={12} color={colors.secondary} />
        </ButtonDate>

        <Fontisto name="arrow-right-l" size={12} color={colors.secondary} />

        <ButtonDate onPress={() => setModalEnd(true)}>
          <ButtonDateText>{convertDate(endDate)}</ButtonDateText>
          <Fontisto name="calendar" size={12} color={colors.secondary} />
        </ButtonDate>
      </DateContainer>

      <Filters>
        <Chip
          onPress={() => handleDays(7)}
          style={{ backgroundColor: colors.primary }}
          textStyle={{ color: colors.white, fontWeight: 'bold' }}
        >
          7 {translate('driver_extract.days')}
        </Chip>

        <Chip
          onPress={() => handleDays(15)}
          style={{ backgroundColor: colors.primary }}
          textStyle={{ color: colors.white, fontWeight: 'bold' }}
        >
          15 {translate('driver_extract.days')}
        </Chip>

        <Chip
          onPress={() => handleDays(30)}
          style={{ backgroundColor: colors.primary }}
          textStyle={{ color: colors.white, fontWeight: 'bold' }}
        >
          30 {translate('driver_extract.days')}
        </Chip>
      </Filters>

      <Divider />

      <Content>
        <ContainerCard>
          {transactions.length > 0 &&
            !loading &&
            transactions.map((item: LastTransactionProps, index) => (
              <CardTransfer
                data={item}
                key={index}
                color={item.color}
                background={
                  Helper.assignColorByGroup(
                    item.tripReference,
                    transactions,
                    color
                  )
                }
              />
            ))}
          <If condition={transactions.length === 0 && !loading}>
            <TextSize>Nenhuma movimentação realizada</TextSize>
          </If>
        </ContainerCard>
      </Content>

      <PaginationTransferSelect
        dataPage={dataPage}
        page={page}
        setPage={setPage}
        selectedValue={selectedValue}
        setSelectedValue={setSelectedValue}
      />

      <Modal visible={modalVisible}>
        <ContentModalDate>
          <Exit>
            <ButtonExit
              activeOpacity={0.7}
              onPress={() => setModalVisible(false)}
            >
              <MaterialIcons
                name="arrow-back-ios"
                size={20}
                color={colors.primary}
              />

              <TextExit>VOLTAR</TextExit>
            </ButtonExit>
          </Exit>

          <Calendar
            dateSelected={startDate}
            onDaySelected={day => {
              handleDateSelect(day);
            }}
          />
        </ContentModalDate>
      </Modal>

      <Modal visible={modalEnd}>
        <Exit>
          <ButtonExit activeOpacity={0.7} onPress={() => setModalEnd(false)}>
            <MaterialIcons
              name="arrow-back-ios"
              size={20}
              color={colors.primary}
            />

            <TextExit>VOLTAR</TextExit>
          </ButtonExit>
        </Exit>
        <ContentModalDate>
          <Calendar
            dateSelected={endDate}
            onDaySelected={day => {
              handleDateSelectEnd(day);
            }}
          />
        </ContentModalDate>
      </Modal>
    </Container>
  );
}
