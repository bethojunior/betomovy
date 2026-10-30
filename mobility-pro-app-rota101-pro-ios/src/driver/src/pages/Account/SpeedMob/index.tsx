import { Ionicons } from '@expo/vector-icons';
import {
  NavigationProp,
  ParamListBase,
  useNavigation,
  useFocusEffect,
} from '@react-navigation/native';

import { translate } from '../../../../../client/locales';

import { moneyMask } from '../../../utils/money';

import { useBank } from '../../../context/bank';

import { CardTransfer } from '../../../components/CardTransfer';
import { ModalTransference } from '../../../components/ModalTransference';
import AccountBankModal from '../../../components/AccountBankModal';
import { If } from '../../../components/If';

import {
  AccountInfo,
  Balance,
  LastTransactionProps,
} from '../../../context/bank/types';

import { View, ActivityIndicator } from 'react-native';
import { useCallback, useEffect, useState } from 'react';

import {
  Container,
  ButtonBack,
  Header,
  TitleHeader,
  Body,
  ContentBalance,
  TextBalance,
  ValueBalance,
  ContentLatestTransactions,
  TextTransaction,
  TitleTransactions,
  ButtonAction,
  TextButtonAction,
  ContentFooter,
} from './styles';

import theme from '../../../styles/theme';
import Helper from '../../../utils/Helper';

export default function AccountSpeedMob() {
  const { navigate, goBack }: NavigationProp<ParamListBase> = useNavigation();
  const { getLatestTransactions, getAccount } = useBank();
  const [accountInfo, setAccountInfo] = useState({} as AccountInfo);
  const [balance, setBalance] = useState({} as Balance);
  const [lastTransactions, setLastTransactions] = useState<
    LastTransactionProps[]
  >([]);
  const [transferenceOn, setTransferenceOn] = useState(false);
  const [loading, setLoading] = useState(true);
  const [loadingTransactions, setLoadingTransactions] = useState<boolean>(true);
  const [modalInfoAccount, setModalInfoAccount] = useState(false);
  const [modeEditAccount, setModeEditAccount] = useState(false);

  const getLatestTransactionsAsync = async () => {
    setLoadingTransactions(true);
    const response = await getLatestTransactions();

    if (!response) {
      return;
    }

    setLastTransactions(response.transactions);
    setBalance(response.balance);
    setLoadingTransactions(false);
  };

  const getAccountAsync = async () => {
    const response = await getAccount();

    if (!response) {
      return;
    }

    setAccountInfo(response);
  };

  useEffect(() => {
    setLoading(true);
    getLatestTransactionsAsync();
    getAccountAsync();
    setLoading(false);
  }, []);

  useFocusEffect(
    useCallback(() => {
      getLatestTransactionsAsync();
      getAccountAsync();
    }, [])
  );

  return (
    <Container>
      <Header backgroundColor={theme.colors.primary}>
        <ButtonBack onPress={() => goBack()}>
          <Ionicons
            name="arrow-back"
            color={theme.colors.background_global}
            size={30}
          />
        </ButtonBack>
        <TitleHeader colorText={theme.colors.background_global}>
          {translate('routes.account')}
        </TitleHeader>
      </Header>
      <Body>
        <ContentBalance>
          <ButtonAction
            onPress={() => setTransferenceOn(true)}
            backgroundColor={theme.colors.primary}
          >
            <TextButtonAction colorText={theme.colors.background_global}>
              {translate('account.transfer')}
            </TextButtonAction>
          </ButtonAction>
          <View>
            <TextBalance>{translate('account.title')}</TextBalance>
            {loadingTransactions ? (
              <>
                <ActivityIndicator size={25} color={theme.colors.primary} />
              </>
            ) : (
              <>
                <ValueBalance>
                  R$ {moneyMask(parseFloat(balance?.balance || '0'))}
                </ValueBalance>
              </>
            )}
          </View>
        </ContentBalance>
        <ContentLatestTransactions>
          <TitleTransactions>
            {translate('account.latest_movements')}
          </TitleTransactions>
          {lastTransactions.length > 0 &&
            !loading &&
            lastTransactions.map((item: LastTransactionProps, index) => (
              <>
                <CardTransfer
                  data={item}
                  key={index}
                  color={item.color}
                  isOdd={Helper.isOdd(index)}
                />
              </>
            ))}
          {loadingTransactions && (
            <ActivityIndicator size={25} color={theme.colors.primary} />
          )}
          <If condition={lastTransactions.length === 0 && loading}>
            <TextTransaction>
              {translate('account.not_movement')}
            </TextTransaction>
          </If>
        </ContentLatestTransactions>
        <ContentFooter>
          <ButtonAction
            backgroundColor={theme.colors.primary}
            style={{ width: '50%', borderRadius: 0 }}
            onPress={() => navigate('ExtractSpeedMob')}
          >
            <TextButtonAction
              colorText={theme.colors.background_global}
              style={{ textAlign: 'center' }}
            >
              {translate('account.extract')}
            </TextButtonAction>
          </ButtonAction>
          <ButtonAction
            backgroundColor={theme.colors.primary}
            style={{ width: '50%', borderRadius: 0 }}
            onPress={() => setModalInfoAccount(true)}
          >
            <TextButtonAction
              colorText={theme.colors.background_global}
              style={{ textAlign: 'center' }}
            >
              {translate('account.account')}
            </TextButtonAction>
          </ButtonAction>
        </ContentFooter>
      </Body>

      <AccountBankModal
        visible={modalInfoAccount}
        setVisible={setModalInfoAccount}
        accountInfo={accountInfo}
        getInfoAccount={getAccountAsync}
        modeEdit={modeEditAccount}
        setModeEdit={setModeEditAccount}
      />

      <ModalTransference
        visible={transferenceOn}
        setVisible={setTransferenceOn}
        currentSald={balance.balance}
        realodBalance={getLatestTransactionsAsync}
      />
    </Container>
  );
}
