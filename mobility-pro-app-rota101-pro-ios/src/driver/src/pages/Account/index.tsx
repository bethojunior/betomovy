import {
  useFocusEffect,
  useNavigation
} from '@react-navigation/native';
import { Ionicons } from '@expo/vector-icons';
import { useCallback, useEffect, useState } from 'react';
import { RFValue } from 'react-native-responsive-fontsize';
import { useTheme } from 'styled-components/native';
import {
  ActionButtonsRow,
  ActionOutlineButton,
  ActionOutlineButtonText,
  AlertBody,
  AlertContent,
  AlertIconWrapper,
  BalanceCard,
  BalanceCardTop,
  BalanceIconWrapper,
  BalanceLabel,
  BalanceTextGroup,
  BalanceValue,
  Container,
  HideBalanceButton,
  MovementsHeader,
  MovementsTitle,
  NegativeBadge,
  NegativeBadgeText,
  NegativeMessage,
  SeeAllLink,
  SeeAllLinkText,
} from './styles';

import { translate } from '../../../../client/locales';
import { TransactionList } from '../../components/TransactionList';
import { IfLoaderInsideScreen } from '../../components/IfLoaderInsideScreen';
import { ModalTransference } from '../../components/ModalTransference';
import { WalletIcon } from '../../components/WalletIcon';
import { useBank } from '../../context/bank';
import {
  AccountInfo,
  Balance,
  LastTransactionProps,
} from '../../context/bank/types';
import { moneyMask } from '../../utils/money';

import { customToast } from '../../../../utils/FlashMessage';
import ModalFrame from '../../components/Modal/ModalFrame';
import { PixModal } from '../../components/PixModal';
import Preload from '../../components/Preload';
import { useModal } from '../../hooks/useModal';

export const Account = () => {
  const navigate = useNavigation<any>();
  const { getLatestTransactions, getAccount } = useBank();
  const { colors } = useTheme();
  const [accountInfo, setAccountInfo] = useState({} as AccountInfo);
  const [balance, setBalance] = useState({} as Balance);
  const [lastTransactions, setLastTransactions] = useState<
    LastTransactionProps[]
  >([]);
  const [transferenceOn, setTransferenceOn] = useState(false);
  const [loading, setLoading] = useState(true);
  const [balanceNegative, setBalanceNegative] = useState(false);
  const [hideBalance, setHideBalance] = useState(false);

  const alertAccountModal = useModal(false);

  // Busca as últimas transaçõe do usuário logado
  const getLatestTransactionsAsync = async () => {

    const response = await getLatestTransactions();

    if (!response) {
      return;
    }

    setLastTransactions(response?.transactions);
    setBalance(response?.balance);
  };

  // Busca os dados bancários do usuário logado
  const getAccountAsync = async () => {
    const response = await getAccount();

    if (!response) {
      // Caso não possua conta cadastrada, é OBRIGATÓRIO cadastrar
      alertAccountModal.open();
      setAccountInfo({} as AccountInfo);
      return;
    }

    alertAccountModal.close();
    setAccountInfo(response);
  };

  const handleModalAccount = () => {
    customToast(
      translate('account.text_bank_account_required'),
      'danger',
    );
    setTimeout(() => {
      navigate.navigate('BankAccount', { initialMode: 'edit' });
    }, 1000);
  };

  const handlePayButton = () => {
    if (Number(balance?.balance) >= 0) {
      setTransferenceOn(true);
      return;
    }

    if (accountInfo === null || Object.keys(accountInfo).length === 0) {
      handleModalAccount();
      return;
    }
    setBalanceNegative(true);
  };

  const initPage = async () => {
    setLoading(true);
    await getLatestTransactionsAsync();
    await getAccountAsync();
    setLoading(false);
  };

  useEffect(() => {
    initPage().finally(() => {
      setLoading(false);
    });
  }, []);

  // Refaz a busca da conta ao voltar da tela de conta bancária
  useFocusEffect(
    useCallback(() => {
      getAccountAsync();
      // eslint-disable-next-line react-hooks/exhaustive-deps
    }, []),
  );

  const isNegativeBalance = Number(balance?.balance) < 0;

  return (
    <>
      <Container>
        <Preload visible={loading} />

        <BalanceCard>
          <HideBalanceButton
            activeOpacity={0.7}
            hitSlop={{ top: 8, bottom: 8, left: 8, right: 8 }}
            onPress={() => setHideBalance((current) => !current)}
          >
            <Ionicons
              name={hideBalance ? 'eye-off-outline' : 'eye-outline'}
              size={RFValue(18)}
              color={colors.black}
            />
          </HideBalanceButton>

          <BalanceCardTop>
            <BalanceIconWrapper>
              <WalletIcon size={RFValue(44)} color={colors.black} />
            </BalanceIconWrapper>
            <BalanceTextGroup>
              <BalanceLabel>{translate('driver_extract.subTitle')}</BalanceLabel>
              <BalanceValue negative={isNegativeBalance}>
                {hideBalance ? '••••••' : `R$ ${moneyMask(parseFloat(balance?.balance || '0'))}`}
              </BalanceValue>

              {isNegativeBalance && (
                <NegativeBadge>
                  <NegativeBadgeText>{translate('driver_wallet.negative_balance_badge')}</NegativeBadgeText>
                </NegativeBadge>
              )}
            </BalanceTextGroup>
          </BalanceCardTop>

          {isNegativeBalance && (
            <NegativeMessage>{translate('driver_wallet.negative_balance_message')}</NegativeMessage>
          )}

          <ActionButtonsRow>
            <ActionOutlineButton filled={isNegativeBalance} activeOpacity={0.7} onPress={handlePayButton}>
              <Ionicons
                name="swap-horizontal-outline"
                size={RFValue(18)}
                color={isNegativeBalance ? colors.primaryText : colors.primary}
              />
              <ActionOutlineButtonText filled={isNegativeBalance}>
                {isNegativeBalance ? translate('driver_wallet.pay') : translate('driver_wallet.transfer')}
              </ActionOutlineButtonText>
            </ActionOutlineButton>

            <ActionOutlineButton
              activeOpacity={0.7}
              onPress={() =>
                navigate.navigate(
                  'BankAccount',
                  Object.keys(accountInfo || {}).length === 0
                    ? { initialMode: 'edit' }
                    : undefined,
                )
              }
            >
              <Ionicons name="card-outline" size={RFValue(18)} color={colors.primary} />
              <ActionOutlineButtonText>{translate('driver_wallet.account')}</ActionOutlineButtonText>
            </ActionOutlineButton>

            <ActionOutlineButton activeOpacity={0.7} onPress={() => navigate.navigate('Extract')}>
              <Ionicons name="receipt-outline" size={RFValue(18)} color={colors.primary} />
              <ActionOutlineButtonText>{translate('driver_extract.title')}</ActionOutlineButtonText>
            </ActionOutlineButton>
          </ActionButtonsRow>
        </BalanceCard>

        <MovementsHeader>
          <MovementsTitle>{translate('driver_extract.latest_movements')}</MovementsTitle>
          <SeeAllLink activeOpacity={0.7} onPress={() => navigate.navigate('Extract')}>
            <SeeAllLinkText>{translate('driver_extract.see_all')}</SeeAllLinkText>
          </SeeAllLink>
        </MovementsHeader>

        <IfLoaderInsideScreen loading={loading}>
          <TransactionList transactions={lastTransactions} />
        </IfLoaderInsideScreen>
      </Container>

      {/* Modal de aviso — conta bancária ainda não cadastrada */}
      <ModalFrame
        visible={alertAccountModal.visible}
        setVisible={alertAccountModal.setVisible}
        onClose={() => requestAnimationFrame(navigate.goBack)}
        textCancel={translate('account.alert_no_account_cancel')}
        textConfirm={translate('account.alert_no_account_confirm')}
        onPressConfirm={() =>
          alertAccountModal.handOff(() =>
            navigate.navigate('BankAccount', { initialMode: 'edit' }),
          )
        }
        title={translate('account.alert_no_account_title')}
        onDismiss={alertAccountModal.onDismiss}
      >
        <AlertContent>
          <AlertIconWrapper>
            <Ionicons name="wallet-outline" size={RFValue(28)} color={colors.primary} />
          </AlertIconWrapper>
          <AlertBody>{translate('account.alert_no_account_body')}</AlertBody>
        </AlertContent>
      </ModalFrame>

      <ModalTransference
        visible={transferenceOn}
        setVisible={setTransferenceOn}
        currentSald={parseInt(balance?.balance)}
        realodBalance={getLatestTransactionsAsync}
      />
      {balanceNegative && (
        <PixModal
          visible={balanceNegative}
          balance={balance}
          onClose={() => setBalanceNegative(false)}
          getRequestDrivertTransactions={getLatestTransactionsAsync}
        />
      )}
    </>
  );
};
