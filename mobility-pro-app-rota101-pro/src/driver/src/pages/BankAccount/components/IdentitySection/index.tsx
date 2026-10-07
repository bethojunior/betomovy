import { FontAwesome5, Ionicons } from '@expo/vector-icons';
import { RFValue } from 'react-native-responsive-fontsize';
import SearchableDropdown from 'react-native-searchable-dropdown';
import { useTheme } from 'styled-components/native';
import { translate } from '../../../../../../client/locales';
import Helper from '../../../../../../client/utils/Helper';
import { FormFieldRow } from '../FormFieldRow';
import { EditField, EditLabel, EditLabelRow, IconBadge } from '../FormFieldRow/styles';
import { SegmentedToggle } from '../SegmentedToggle';
import { IdentitySectionProps } from './types';
import { DateInput, DropdownWrapper } from './styles';

const TYPE_ACCOUNT_OPTIONS = [
  { value: 'corrente', labelKey: 'account_driver_modal.type_checking' },
  { value: 'poupanca', labelKey: 'account_driver_modal.type_savings' },
];

const typeAccountLabel = (value?: string) => {
  const option = TYPE_ACCOUNT_OPTIONS.find(item => item.value === value);
  return option ? translate(option.labelKey) : value;
};

/** Campos bancários opcionais: banco, tipo de conta e data de nascimento. */
export function IdentitySection({ form, editable, banks, onChangeField, onChangeBank, onFocusField }: IdentitySectionProps) {
  const theme = useTheme();
  const iconSize = RFValue(12);
  const iconColor = theme.colors.icon_gray;

  return (
    <>
      {editable ? (
        <EditField>
          <EditLabelRow>
            <IconBadge>
              <FontAwesome5 name="university" size={iconSize} color={iconColor} />
            </IconBadge>
            <EditLabel>{translate('account_driver_modal.bank')}</EditLabel>
          </EditLabelRow>
          <DropdownWrapper>
            <SearchableDropdown
              editable={editable}
              onItemSelect={item => onChangeBank(item.id, item.name)}
              selectedItems={{ id: form?.bankId, name: form?.bankName }}
              itemStyle={{
                padding: 10,
                marginTop: 2,
                backgroundColor: theme.colors.background_white,
                borderColor: theme.colors.white,
                borderWidth: 1,
                borderRadius: 5,
              }}
              itemTextStyle={{ color: theme.colors.secondary }}
              itemsContainerStyle={{ maxHeight: 140 }}
              items={banks}
              resetValue={false}
              textInputProps={{
                underlineColorAndroid: 'transparent',
                style: {
                  borderWidth: 1,
                  borderColor: theme.colors.border,
                  borderRadius: 8,
                  padding: 8,
                  color: theme.colors.secondary,
                },
              }}
              listProps={{ nestedScrollEnabled: true }}
            />
          </DropdownWrapper>
        </EditField>
      ) : (
        <FormFieldRow
          label={translate('account_driver_modal.bank')}
          value={form?.bankName}
          editable={false}
          icon={<FontAwesome5 name="university" size={iconSize} color={iconColor} />}
        />
      )}

      {editable ? (
        <EditField>
          <EditLabelRow>
            <IconBadge>
              <Ionicons name="swap-horizontal-outline" size={iconSize} color={iconColor} />
            </IconBadge>
            <EditLabel>{translate('account_driver_modal.type_account')}</EditLabel>
          </EditLabelRow>
          <SegmentedToggle
            value={form?.typeAccount}
            options={TYPE_ACCOUNT_OPTIONS.map(option => ({ value: option.value, label: translate(option.labelKey) }))}
            onChange={value => onChangeField('typeAccount', value)}
          />
        </EditField>
      ) : (
        <FormFieldRow
          label={translate('account_driver_modal.type_account')}
          value={typeAccountLabel(form?.typeAccount)}
          editable={false}
          icon={<Ionicons name="swap-horizontal-outline" size={iconSize} color={iconColor} />}
        />
      )}

      {editable ? (
        <EditField>
          <EditLabelRow>
            <IconBadge>
              <Ionicons name="calendar-outline" size={iconSize} color={iconColor} />
            </IconBadge>
            <EditLabel>{translate('bank_account_screen.date_of_birth')}</EditLabel>
          </EditLabelRow>
          <DateInput
            type="datetime"
            options={{ format: 'DD/MM/YYYY' }}
            value={Helper.formatDateBr(form?.dateOfBirth)}
            onChangeText={text => onChangeField('dateOfBirth', text)}
            onFocus={onFocusField}
          />
        </EditField>
      ) : (
        <FormFieldRow
          label={translate('bank_account_screen.date_of_birth')}
          value={Helper.formatDateBr(form?.dateOfBirth)}
          editable={false}
          icon={<Ionicons name="calendar-outline" size={iconSize} color={iconColor} />}
        />
      )}
    </>
  );
}
