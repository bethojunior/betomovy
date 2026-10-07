import {Platform, Text, View} from 'react-native';
import {useEffect, useState} from 'react';
import SearchableDropdown from 'react-native-searchable-dropdown';
import {RFValue} from 'react-native-responsive-fontsize';
import {lighten} from 'polished';
import {Picker} from '@react-native-picker/picker';
import ModalFrame from '../form/ModalFrame';
import Preload from '../Preload';
import theme from '../../styles/theme';
import {useBank} from '../../context/bank';
import InputFrame from '../form/InputFrame';
import {ButtonMode, Section, TextButtonMode, Title} from './styles';
import {translate} from '../../../../client/locales';
import {AccountInfo, BankProps} from '../../context/bank/types';
import { useTheme } from 'styled-components';

interface Props {
  visible: boolean;
  setVisible: (value: boolean) => void;
  accountInfo: AccountInfo;
  getInfoAccount: () => void;
}

interface BankFormattedProps {
  id: string;
  name: string;
}

let endpoint;

const AccountBankModal = ({
  visible,
  setVisible,
  accountInfo,
  getInfoAccount,
}: Props) => {
  const {getBanksList, editAccount, createAccount} = useBank();
  const [loading, setLoading] = useState(false);
  const [modeEdit, setModeEdit] = useState(false);
  const [banksFormatted, setBanksFormatted] = useState<BankFormattedProps[]>(
    [],
  );
  const [searchBank, setSearchBank] = useState('');
  const [accountInfoEdit, setAccountInfoEdit] = useState({} as AccountInfo);

  const [error, setError] = useState(false);
  const [textError, setTextError] = useState('');

  const getBanks = async () => {
    const response = await getBanksList();

    if (!response) {
      return;
    }

    const banksMap = response.map((bank: BankProps) => {
      return {
        id: bank?.idBank,
        name: bank?.bankName,
      };
    });

    setBanksFormatted(banksMap);
  };

  const EditAccountPost = async () => {
    if (Object.keys(accountInfoEdit).length === 0) {
      setTextError(translate('schedule.toast_warning'));
      return setError(true);
    }
    if (accountInfoEdit.typeAccount === '') {
      setTextError(translate('account_driver_modal.alert_error_type_account'));
      return setError(true);
    }
    if (accountInfoEdit.numberAccount === '') {
      setTextError(translate('account_driver_modal.alert_error_account'));
      return setError(true);
    }
    if (accountInfoEdit.numberAccountDigit === '') {
      setTextError(translate('account_driver_modal.alert_error_digit'));
      return setError(true);
    }
    if (accountInfoEdit.agency === '') {
      setTextError(translate('account_driver_modal.alert_error_agency'));
      return setError(true);
    }
    if (accountInfoEdit.agencyDigit === '') {
      setTextError(translate('account_driver_modal.alert_error_agency_digit'));
      return setError(true);
    }
    if (accountInfoEdit.holderName === '') {
      setTextError(translate('account_driver_modal.alert_error_name'));
      return setError(true);
    }
    if (accountInfoEdit.document === '') {
      setTextError(translate('account_driver_modal.alert_error_document'));
      return setError(true);
    }
    if (accountInfoEdit.op === '') {
      setTextError(translate('account_driver_modal.alert_error_op'));
      return setError(true);
    }
    if (accountInfoEdit.bankName === '') {
      setTextError(translate('account_driver_modal.alert_error_bank'));
      return setError(true);
    }

    setLoading(true);
    if (accountInfo !== null && Object.keys(accountInfo).length !== 0) {
      endpoint = editAccount(accountInfoEdit, accountInfo.idBankAccount);
    } else {
      endpoint = createAccount(accountInfoEdit);
    }

    const response = await endpoint;

    if (!response) {
      setLoading(false);
      setTextError(translate('account_driver_modal.text_error'));
      return setError(true);
    }

    setVisible(false);
    setAccountInfoEdit({} as AccountInfo);
    setModeEdit(false);
    setError(false);
    setLoading(false);
    return getInfoAccount();
  };

  function defaultBank() {
    const indexBank = banksFormatted.findIndex(
      bank => bank?.name === accountInfo?.bankName,
    );

    if (indexBank === -1) {
      return 1;
    }

    return indexBank;
  }

  useEffect(() => {
    setAccountInfoEdit(accountInfo);
    if (accountInfo === null || Object.keys(accountInfo).length === 0) {
      setModeEdit(true);
    }
  }, [accountInfo]);

  useEffect(() => {
    getBanks();
  }, []);

  const { colors } = useTheme();

  return (
    <>
      <Preload visible={loading} />
      <ModalFrame
        visible={visible}
        setVisible={setVisible}
        onClose={() => {
          setVisible(false);
          setModeEdit(false);
          setError(false);
        }}
        onPressConfirm={modeEdit ? () => EditAccountPost() : null}
        hideConfirm={!modeEdit}
        error={error}
        textError={textError}
        title={
          (Object.keys(accountInfo).length === 0 &&
            !loading &&
            translate('account_driver_modal.register_account')) ||
          (Object.keys(accountInfo).length === 0 && !modeEdit
            ? translate('account_driver_modal.bank_data')
            : translate('account_driver_modal.update_bank_data'))
        }
        componentButton={
          <ButtonMode
            onPress={() => {
              setModeEdit(!modeEdit);
              setError(false);
            }}
          >
            <TextButtonMode>
              {modeEdit
                ? translate('account_driver_modal.text_button_mode_reader')
                : translate('account_driver_modal.text_button_edit')}
            </TextButtonMode>
          </ButtonMode>
        }
      >
        <>
          <View pointerEvents={modeEdit ? 'auto' : 'none'}>
            <View>
              <Title modeEdit={modeEdit}>
                {translate('account_driver_modal.name').concat(' * ')}
              </Title>
              <InputFrame
                editable={modeEdit}
                value={accountInfoEdit?.holderName}
                keyboradType={'default'}
                setValue={e =>
                  setAccountInfoEdit({
                    ...accountInfoEdit,
                    holderName: e,
                  })
                }
              />
            </View>
            <View>
              <Title modeEdit={modeEdit}>
                {translate('account_driver_modal.document').concat(' * ')}
              </Title>
              <InputFrame
                editable={modeEdit}
                value={accountInfoEdit?.document}
                keyboradType={'numeric'}
                setValue={e =>
                  setAccountInfoEdit({
                    ...accountInfoEdit,
                    document: e,
                  })
                }
              />
            </View>
            <Section>
              <View style={{width: '50%'}}>
                <Title modeEdit={modeEdit}>
                  {translate('account_driver_modal.number_account').concat(
                    ' * ',
                  )}
                </Title>
                <InputFrame
                  editable={modeEdit}
                  value={accountInfoEdit?.numberAccount}
                  keyboradType={'numeric'}
                  setValue={e =>
                    setAccountInfoEdit({
                      ...accountInfoEdit,
                      numberAccount: e,
                    })
                  }
                />
              </View>
              <Section
                style={{
                  width: '45%',
                }}
              >
                <View>
                  <Title modeEdit={modeEdit}>
                    {translate('account_driver_modal.digit').concat(' * ')}
                  </Title>
                  <InputFrame
                    editable={modeEdit}
                    value={accountInfoEdit?.numberAccountDigit}
                    keyboradType={'numeric'}
                    setValue={e =>
                      setAccountInfoEdit({
                        ...accountInfoEdit,
                        numberAccountDigit: e,
                      })
                    }
                  />
                </View>
                <View style={{paddingLeft: 5, paddingRight: 5}}>
                  <Title modeEdit={modeEdit}>
                    {translate('account_driver_modal.agency').concat(' * ')}
                  </Title>
                  <InputFrame
                    editable={modeEdit}
                    value={accountInfoEdit?.agency}
                    keyboradType={'numeric'}
                    setValue={e =>
                      setAccountInfoEdit({
                        ...accountInfoEdit,
                        agency: e,
                      })
                    }
                  />
                </View>
                <View>
                  <Title modeEdit={modeEdit}>
                    {translate('account_driver_modal.op').concat(' * ')}
                  </Title>
                  <InputFrame
                    editable={modeEdit}
                    value={accountInfoEdit?.op}
                    keyboradType={'numeric'}
                    setValue={e =>
                      setAccountInfoEdit({
                        ...accountInfoEdit,
                        op: e,
                      })
                    }
                  />
                </View>
              </Section>
            </Section>
            <View>
              <Title modeEdit={modeEdit}>
                {translate('account_driver_modal.bank').concat(' * ')}
              </Title>
              {banksFormatted && banksFormatted.length > 0 && (
                <SearchableDropdown
                  editable={modeEdit}
                  onItemSelect={(item: BankFormattedProps) => {
                    setAccountInfoEdit({
                      ...accountInfoEdit,
                      bankName: item.name,
                      bankId: item.id,
                    });
                  }}
                  selectedItems={{
                    id: accountInfoEdit?.bankId,
                    name: accountInfoEdit?.bankName,
                  }}
                  itemStyle={{
                    padding: 10,
                    marginTop: 2,
                    backgroundColor: theme.colors.background_white,
                    borderColor: theme.colors.white,
                    borderWidth: 1,
                    borderRadius: 5,
                  }}
                  itemTextStyle={{color: '#222'}}
                  itemsContainerStyle={{maxHeight: 140}}
                  items={banksFormatted}
                  defaultIndex={defaultBank()}
                  resetValue={false}
                  textInputProps={{
                    underlineColorAndroid: 'transparent',
                    style: {
                      borderWidth: modeEdit ? 1 : 0,
                      borderColor: theme.colors.secondary,
                      borderRadius: 5,
                      marginTop: 5,
                      marginBottom: 5,
                      padding: 5,
                      color: theme.colors.secondary,
                    },
                    onTextChange: (item: string) => {
                      setSearchBank(item);
                    },
                  }}
                  listProps={{
                    nestedScrollEnabled: true,
                  }}
                />
              )}
            </View>
            <View>
              <Title style={{marginBottom: 5}} modeEdit={modeEdit}>
                {translate('account_driver_modal.type_account').concat(' * ')}
              </Title>
              {modeEdit ? (
                <View
                  style={{
                    width: '100%',
                    borderWidth: 1,
                    borderRadius: 5,
                    borderColor: colors.secondary,
                    overflow: 'hidden',
                    height: RFValue(35),
                    alignSelf: 'center',
                    justifyContent: 'center',
                  }}
                >
                  <Picker
                    itemStyle={{
                      fontSize: RFValue(12),
                      color: theme.colors.secondary,
                      backgroundColor: lighten(
                        0.1,
                        theme.colors.background_global,
                      ),
                      width: '110%',
                      marginLeft: Platform.OS === 'ios' ? -20 : 0,
                    }}
                    selectedValue={accountInfoEdit?.typeAccount}
                    onValueChange={value =>
                      setAccountInfoEdit({
                        ...accountInfoEdit,
                        typeAccount: value,
                      })
                    }
                  >
                    <Picker.Item
                      label={translate('account_driver_modal.type_account')}
                      value=""
                      color={colors.secondary}
                    />
                    <Picker.Item
                      label={translate('account_driver_modal.type_checking')}
                      value="corrente"
                      color={colors.secondary}
                    />
                    <Picker.Item
                      label={translate('account_driver_modal.type_savings')}
                      value="poupanca"
                      color={colors.secondary}
                    />
                  </Picker>
                </View>
              ) : (
                <Text>
                  {translate('account_driver_modal.text_account').concat(' * ')}{' '}
                  {accountInfoEdit.typeAccount}
                </Text>
              )}
            </View>
            <View>
              <Title style={{marginTop: 5}} modeEdit={modeEdit}>
                {translate('account_driver_modal.pix')}
              </Title>
              <InputFrame
                editable={modeEdit}
                value={accountInfoEdit?.pix}
                keyboradType={'default'}
                setValue={e =>
                  setAccountInfoEdit({
                    ...accountInfoEdit,
                    pix: e,
                  })
                }
              />
            </View>
          </View>
        </>
      </ModalFrame>
    </>
  );
};

export default AccountBankModal;