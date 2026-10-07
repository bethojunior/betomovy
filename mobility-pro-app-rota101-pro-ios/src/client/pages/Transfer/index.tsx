import {useEffect, useState} from 'react';
import {Button} from 'react-native-paper';
import {RFValue} from 'react-native-responsive-fontsize';
import {VictoryPie} from 'victory-native';
import {
  ButtonsHelp,
  Chart,
  ContainerDialog,
  ContainerModal,
  Content,
  TextSize,
  TextSmall,
  ContainerCard,
  ContainerGraphic,
  ContainerMoviment,
  ContainerValue,
  Text,
  Value,
} from './styles';

import theme from '../../styles/theme';
import {useAuth} from '../../../context/auth';
import {CardTransfer} from '../../components/CardTransfer';
import {useTransference} from '../../contexts/Transference';
import {IfLoaderInsideScreen} from '../../components/IfLoaderInsideScreen';
import {coinTypePerApi, maskMoney} from '../../utils/money';
import {If} from '../../components/If';
import {ModalTransference} from '../../components/ModalTransference';
import {translate} from '../../locales';
import AccountBankModal from '../../components/AccountBankModal';

interface AccountInfo {
  agency: string;
  agencyDigit: string;
  bankId: string;
  bankName: string;
  date: string;
  document: string;
  holderName: string;
  idBankAccount: string;
  numberAccount: string;
  numberAccountDigit: string;
  op: string;
  pix: string;
  typeAccount: string;
}

interface Balance {
  balance: string;
  blockedBalance: string;
  idBalance: string;
  pendingBalanceWithdraw: string;
}

interface LastTransaction {
  balanceFlowTypeId: string;
  color: string;
  date: string;
  flow: string;
  price: string;
  summary: string;
  tripReference: string;
  value: string;
}

export const Transfer = () => {
  const {cityConfig} = useAuth();
  const {detailAccountBallance, getLastTransactions} = useTransference();

  const [accountInfo, setAccountInfo] = useState({} as AccountInfo);
  const [balance, setBalance] = useState({} as Balance);
  const [lastTransactions, setLastTransactions] = useState([]);
  const [transferenceOn, setTransferenceOn] = useState(false);
  const [loading, setLoading] = useState(true);
  const [modalInfoAccount, setModalInfoAccount] = useState(false);

  useEffect(() => {
    getInfoAccount();
    getCurrentBalanceAndMoviment();
  }, []);

  const getInfoAccount = async () => {
    setLoading(true);
    const response = await detailAccountBallance();
    setAccountInfo(response.data);
    setLoading(false);
  };

  const getCurrentBalanceAndMoviment = async () => {
    setLoading(true);
    const response = await getLastTransactions();
    setBalance(response.data.balance);
    setLastTransactions(response.data.transactions);
    setLoading(false);
  };

  return (
    <>
      <ContainerModal>
        <ContainerDialog>
          <ContainerGraphic>
            <Chart>
              <VictoryPie
                data={[
                  {x: 'Transferências', y: 40},
                  {x: 'Recebimentos', y: 60},
                ]}
                style={{
                  labels: {
                    display: 'none',
                  },
                }}
                colorScale={[theme.colors.primary, theme.colors.secondary]}
                innerRadius={15}
                padAngle={2}
                width={RFValue(105)}
                height={RFValue(105)}
                padding={{top: 0, bottom: 0, left: 0, right: 0}}
              />
            </Chart>

            <ContainerValue>
              <Text>{translate('paymentPage.text_current_balance')}</Text>
              <Value>
                {/* Erro de Typescript */}
                {coinTypePerApi(cityConfig?.typeMoney)}{' '}
                {balance.balance !== undefined
                  ? maskMoney(parseFloat(balance?.balance))
                  : '...'}
              </Value>
            </ContainerValue>
          </ContainerGraphic>
          <ButtonsHelp>
            <Button
              style={{
                backgroundColor: theme.colors.primary,
                borderRadius: 5,
                width: RFValue(130),
              }}
              // onPress={() => handleWithDraw(100)}
              onPress={() => setTransferenceOn(true)}
            >
              <TextSmall color={theme.colors.white}>
                {translate('transfer.transfer')}
              </TextSmall>
            </Button>
            <Button
              style={{
                backgroundColor: theme.colors.primary,
                borderRadius: 5,
                width: RFValue(130),
              }}
              onPress={() => setModalInfoAccount(true)}
            >
              <TextSmall color={theme.colors.white}>
                {translate('transfer.account')}
              </TextSmall>
            </Button>
          </ButtonsHelp>
        </ContainerDialog>
        <Content>
          <ContainerMoviment>
            <Text>{translate('transfer.last_transactions')}</Text>
          </ContainerMoviment>
          <IfLoaderInsideScreen loading={loading}>
            <ContainerCard>
              {lastTransactions.length > 0 &&
                !loading &&
                lastTransactions.map((item: LastTransaction, index) => (
                  <CardTransfer data={item} key={index} color={item.color} />
                ))}
              <If condition={lastTransactions.length === 0 && !loading}>
                <TextSize>{translate('transfer.no_transactions')}</TextSize>
              </If>
            </ContainerCard>
          </IfLoaderInsideScreen>
        </Content>
      </ContainerModal>
      <AccountBankModal
        visible={modalInfoAccount}
        setVisible={setModalInfoAccount}
        accountInfo={accountInfo}
        getInfoAccount={getInfoAccount}
      />
      <ModalTransference
        visible={transferenceOn}
        setVisible={setTransferenceOn}
        currentSald={balance.balance}
        realodBalance={getCurrentBalanceAndMoviment}
      />
    </>
  );
};
