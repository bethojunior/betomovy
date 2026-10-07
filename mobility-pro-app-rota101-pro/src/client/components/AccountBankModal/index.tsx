import { Platform, Text, View } from 'react-native';
import { useEffect, useState } from 'react';
// eslint-disable-next-line @typescript-eslint/ban-ts-comment
// @ts-ignore
import SearchableDropdown from 'react-native-searchable-dropdown';
import { RFValue } from 'react-native-responsive-fontsize';
import { lighten } from 'polished';
import { Picker } from '@react-native-picker/picker';
import ModalFrame from '../form/Modal';
import Preload from '../Preload';
import { translate } from '../../locales';
import theme from '../../styles/theme';
import { useTransference } from '../../contexts/Transference';
import InputFrame from '../form/InputFrame';
import { ButtonMode, Section, TextButtonMode, Title } from './styles';
import { customToast } from '../../../utils/FlashMessage';

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

interface PropsBank {
  bankName: string;
  bankNumber: string;
  idBank: string;
}

interface Props {
  visible: boolean;
  setVisible: (value: boolean) => void;
  accountInfo: any;
  getInfoAccount: () => void;
}

let endpoint;

const AccountBankModal = ({
  visible,
  setVisible,
  accountInfo,
  getInfoAccount,
}: Props) => {
  const { editAccount, createAccount, getBanksList } = useTransference();

  const [banks, setBanks] = useState([]);
  const [loading, setLoading] = useState(false);
  const [modeEdit, setModeEdit] = useState(false);
  const [searchBank, setSearchBank] = useState('');
  const [accountInfoEdit, setAccountInfoEdit] = useState({
    agency: '',
    agencyDigit: '',
    bankId: '',
    bankName: '',
    date: '',
    document: '',
    holderName: '',
    idBankAccount: '',
    numberAccount: '',
    numberAccountDigit: '',
    op: '',
    pix: '',
    typeAccount: '',
  } as AccountInfo);

  const [error, setError] = useState(false);
  const [textError, setTextError] = useState('');

  function defaultBank() {
    const banksFormatted = mapBanksForIDAndName(banks);

    const indexBank = banksFormatted.findIndex(
      bank => bank?.id === accountInfo?.bankId,
    );

    if (indexBank === -1) {
      return 1;
    }

    return indexBank;
  }

  useEffect(() => {
    setAccountInfoEdit(accountInfo);
    getBanks();
    if (accountInfo === null) {
      setModeEdit(true);
    }
  }, [accountInfo]);

  const getBanks = async () => {
    const response = await getBanksList();
    setBanks(response.data);
    return response.data;
  };

  const EditAccountPost = async () => {
    if (Object.keys(accountInfoEdit).length === 0) {
      setTextError(translate('schedule.toast_warning'));
      return setError(true);
    }
    if (accountInfoEdit.typeAccount === '') {
      setTextError(translate('transfer.alert_error_type_account'));
      return setError(true);
    }
    if (accountInfoEdit.numberAccount === '') {
      setTextError(translate('transfer.alert_error_account'));
      return setError(true);
    }
    if (accountInfoEdit.numberAccountDigit === '') {
      setTextError(translate('transfer.alert_error_digit'));
      return setError(true);
    }
    if (accountInfoEdit.agency === '') {
      setTextError(translate('transfer.alert_error_agency'));
      return setError(true);
    }
    if (accountInfoEdit.agencyDigit === '') {
      setTextError(translate('transfer.alert_error_agency_digit'));
      return setError(true);
    }
    if (accountInfoEdit.holderName === '') {
      setTextError(translate('transfer.alert_error_name'));
      return setError(true);
    }
    if (accountInfoEdit.document === '') {
      setTextError(translate('transfer.alert_error_document'));
      return setError(true);
    }
    if (accountInfoEdit.op === '') {
      setTextError(translate('transfer.alert_error_op'));
      return setError(true);
    }
    if (accountInfoEdit.bankName === '') {
      setTextError(translate('transfer.alert_error_bank'));
      return setError(true);
    }

    setLoading(true);
    if (accountInfo !== null) {
      endpoint = editAccount(accountInfoEdit, accountInfo.idBankAccount);
    } else {
      endpoint = createAccount(accountInfoEdit);
    }

    const response = await endpoint;

    if (!response.status) {
      setLoading(false);
      setTextError(translate('transfer.text_error'));
      return setError(true);
    }

    setVisible(false);
    setAccountInfoEdit({} as AccountInfo);
    setModeEdit(false);
    setError(false);
    setLoading(false);
    customToast(translate('transfer.text_success'), 'success');
    return getInfoAccount();
  };

  const mapBanksForIDAndName = (banksData: any) => {
    const banksMap = banksData.map((bank: PropsBank) => {
      return {
        id: bank?.idBank,
        name: bank?.bankName,
      };
    });
    return banksMap;
  };

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
          (accountInfo === null &&
            !loading &&
            translate('transfer.register_account')) ||
          (accountInfo !== null && !modeEdit
            ? translate('transfer.bank_data')
            : translate('transfer.update_bank_data'))
        }
        componentButton={
          <ButtonMode
            onPress={() => {
              if (modeEdit && accountInfo === null) {
                return customToast(
                  translate('schedule.toast_warning'),
                  'error',
                );
              }
              setModeEdit(!modeEdit);
              setError(false);
            }}
          >
            <TextButtonMode>
              {modeEdit
                ? translate('transfer.text_button_mode_reader')
                : translate('transfer.text_button_edit')}
            </TextButtonMode>
          </ButtonMode>
        }
      >
        <>
          <View pointerEvents={modeEdit ? 'auto' : 'none'}>
            <View>
              <Title modeEdit={modeEdit}>{translate('transfer.name')}</Title>
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
                {translate('transfer.document')}
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
              <View style={{ width: '50%' }}>
                <Title modeEdit={modeEdit}>
                  {translate('transfer.number_account')}
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
                    {translate('transfer.digit')}
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
                <View style={{ paddingLeft: 5, paddingRight: 5 }}>
                  <Title modeEdit={modeEdit}>
                    {translate('transfer.agency')}
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
                  <Title modeEdit={modeEdit}>{translate('transfer.op')}</Title>
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
              <Title modeEdit={modeEdit}>{translate('transfer.bank')}</Title>
              {banks && banks.length > 0 && (
                <SearchableDropdown
                  editable={modeEdit}
                  onItemSelect={(item: any) => {
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
                    backgroundColor: theme.colors.white,
                    borderColor: theme.colors.white,
                    borderWidth: 1,
                    borderRadius: 5,
                  }}
                  itemTextStyle={{ color: '#222' }}
                  itemsContainerStyle={{ maxHeight: 140 }}
                  items={mapBanksForIDAndName(banks)}
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
              <Title style={{ marginBottom: 5 }} modeEdit={modeEdit}>
                {translate('transfer.type_account')}
              </Title>
              {modeEdit ? (
                <View
                  style={{
                    width: '100%',
                    borderWidth: 1,
                    borderRadius: 5,
                    overflow: 'hidden',
                    height: RFValue(35),
                    alignSelf: 'center',
                    justifyContent: 'center',
                  }}
                >
                  <Picker
                    itemStyle={{
                      fontSize: RFValue(12),
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
                      label={translate('transfer.type_account')}
                      value=""
                    />
                    <Picker.Item
                      label={translate('transfer.type_checking')}
                      value="corrente"
                    />
                    <Picker.Item
                      label={translate('transfer.type_savings')}
                      value="poupanca"
                    />
                  </Picker>
                </View>
              ) : (
                <Text>
                  {translate('transfer.text_account')}{' '}
                  {accountInfoEdit?.typeAccount}
                </Text>
              )}
            </View>
            <View>
              <Title style={{ marginTop: 5 }} modeEdit={modeEdit}>
                {translate('transfer.pix')}
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
