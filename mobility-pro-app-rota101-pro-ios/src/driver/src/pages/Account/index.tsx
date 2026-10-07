import { useEffect, useState } from 'react';
import { Button } from 'react-native-paper';
import { RFValue } from 'react-native-responsive-fontsize';
import { useTheme } from 'styled-components';
import { VictoryPie } from 'victory-native';
import {
  NavigationProp,
  ParamListBase,
  useNavigation,
} from '@react-navigation/native';
import {
  ButtonsHelp,
  Chart,
  ContainerDialog,
  Content,
  TextSize,
  TextSmall,
  ContainerCard,
  ContainerGraphic,
  ContainerMoviment,
  ContainerValue,
  Text,
  Value,
  Container,
} from './styles';

import { IfLoaderInsideScreen } from '../../components/IfLoaderInsideScreen';
import { If } from '../../components/If';
import {
  AccountInfo,
  Balance,
  LastTransactionProps,
} from '../../context/bank/types';
import { useBank } from '../../context/bank';
import { CardTransfer } from '../../components/CardTransfer';
import { moneyMask } from '../../utils/money';
import AccountBankModal from '../../components/AccountBankModal';
import { ModalTransference } from '../../components/ModalTransference';
import { translate } from '../../../../client/locales';
import Helper from '../../utils/Helper';
import theme from '../../../../client/styles/theme';
import { shade } from 'polished';

export const Account = () => {
  const { navigate }: NavigationProp<ParamListBase> = useNavigation();
  const { getLatestTransactions, getAccount } = useBank();
  const { colors } = useTheme();
  const [accountInfo, setAccountInfo] = useState({} as AccountInfo);
  const [balance, setBalance] = useState({} as Balance);
  const [lastTransactions, setLastTransactions] = useState<
    LastTransactionProps[]
  >([]);
  const [transferenceOn, setTransferenceOn] = useState(false);
  const [loading, setLoading] = useState(true);
  const [modalInfoAccount, setModalInfoAccount] = useState(false);

  const getLatestTransactionsAsync = async () => {
    const response = await getLatestTransactions();

    if (!response) {
      return;
    }

    setLastTransactions(response.transactions);
    setBalance(response.balance);
  };

  const getAccountAsync = async () => {
    const response = await getAccount();

    if (!response) {
      return;
    }

    setAccountInfo(response);
  };

  const color = [
    shade(0.07, theme.colors.background_global),
    theme.colors.background_global
  ];

  useEffect(() => {
    setLoading(true);
    getLatestTransactionsAsync();
    getAccountAsync();
    setLoading(false);
  }, []);

  return (
    <>
      <Container>
        <ContainerDialog>
          <ContainerGraphic>
            <Chart>
              <VictoryPie
                data={[
                  { x: 'Entradas', y: 60 },
                  { x: 'Saidas', y: 60 },
                ]}
                style={{
                  labels: {
                    display: 'none',
                  },
                }}
                colorScale={[colors.secondary, colors.primary]}
                innerRadius={15}
                padAngle={2}
                width={RFValue(105)}
                height={RFValue(105)}
                padding={{ top: 0, bottom: 0, left: 0, right: 0 }}
              />
            </Chart>

            <ContainerValue>
              <Text>{translate('account.title')}</Text>
              <Value>R$ {moneyMask(parseFloat(balance?.balance || '0'))}</Value>
            </ContainerValue>
          </ContainerGraphic>
          <ButtonsHelp>
            <Button
              style={{
                backgroundColor: colors.primary,
                borderRadius: 5,
                width: RFValue(130),
              }}
              onPress={() => setTransferenceOn(true)}
            >
              <TextSmall color={colors.white}>
                {translate('account.transfer')}
              </TextSmall>
            </Button>
            <Button
              style={{
                backgroundColor: colors.primary,
                borderRadius: 5,
                width: RFValue(130),
              }}
              onPress={() => setModalInfoAccount(true)}
            >
              <TextSmall color={colors.white}>
                {translate('account.account')}
              </TextSmall>
            </Button>
          </ButtonsHelp>

          <ButtonsHelp>
            <Button
              style={{
                backgroundColor: colors.primary,
                borderRadius: 5,
                width: RFValue(130),
              }}
              // onPress={() => handleWithDraw(100)}
              onPress={() => navigate('Extract')}
            >
              <TextSmall color={colors.white}>
                {translate('account.extract')}
              </TextSmall>
            </Button>
          </ButtonsHelp>
        </ContainerDialog>
        <Content>
          <ContainerMoviment>
            <Text>{translate('account.latest_movements')}</Text>
          </ContainerMoviment>
          <IfLoaderInsideScreen loading={loading}>
            <ContainerCard>
              {lastTransactions.length > 0 &&
                !loading &&
                lastTransactions.map((item: LastTransactionProps, index) => (
                  <CardTransfer
                    data={item}
                    key={index}
                    color={item.color}
                    background={
                      Helper.assignColorByGroup(
                        item.tripReference, 
                        lastTransactions,
                        color
                      )
                    }
                  />
                ))}
              <If condition={lastTransactions.length === 0 && loading}>
                <TextSize>{translate('account.not_movement')}</TextSize>
              </If>
            </ContainerCard>
          </IfLoaderInsideScreen>
        </Content>
      </Container>
      <AccountBankModal
        visible={modalInfoAccount}
        setVisible={setModalInfoAccount}
        accountInfo={accountInfo}
        getInfoAccount={getAccountAsync}
      />

      <ModalTransference
        visible={transferenceOn}
        setVisible={setTransferenceOn}
        currentSald={balance.balance}
        realodBalance={getLatestTransactionsAsync}
      />
    </>
  );
};
