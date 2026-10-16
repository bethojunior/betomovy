import { FontAwesome5, Ionicons } from '@expo/vector-icons';
import { RFValue } from 'react-native-responsive-fontsize';
import { useTheme } from 'styled-components/native';
import { translate } from '../../../../../../client/locales';
import { FormFieldRow } from '../FormFieldRow';
import { HalfField, Row2Up } from '../FormFieldRow/styles';
import { AccountNumbersSectionProps } from './types';
import { HintText } from './styles';

/** Campos dos números da conta (opcionais): conta/agência (com dígito) e operação. */
export function AccountNumbersSection({ form, editable, onChangeField, onFocusField }: AccountNumbersSectionProps) {
  const theme = useTheme();
  const iconSize = RFValue(12);
  const iconColor = theme.colors.icon_gray;

  return (
    <>
      <Row2Up>
        <HalfField>
          <FormFieldRow
            label={translate('account_driver_modal.number_account')}
            value={form?.numberAccount}
            editable={editable}
            keyboardType="numeric"
            icon={<Ionicons name="wallet-outline" size={iconSize} color={iconColor} />}
            onChangeText={text => onChangeField('numberAccount', text)}
            onFocus={onFocusField}
          />
        </HalfField>
        <HalfField>
          <FormFieldRow
            label={translate('account_driver_modal.digit')}
            value={form?.numberAccountDigit}
            editable={editable}
            keyboardType="numeric"
            icon={<FontAwesome5 name="hashtag" size={iconSize} color={iconColor} />}
            onChangeText={text => onChangeField('numberAccountDigit', text)}
            onFocus={onFocusField}
          />
        </HalfField>
      </Row2Up>

      <Row2Up>
        <HalfField>
          <FormFieldRow
            label={translate('account_driver_modal.agency')}
            value={form?.agency}
            editable={editable}
            keyboardType="numeric"
            icon={<Ionicons name="business-outline" size={iconSize} color={iconColor} />}
            onChangeText={text => onChangeField('agency', text)}
            onFocus={onFocusField}
          />
        </HalfField>
        <HalfField>
          <FormFieldRow
            label={translate('bank_account_screen.agency_digit')}
            value={form?.agencyDigit}
            editable={editable}
            keyboardType="numeric"
            icon={<FontAwesome5 name="hashtag" size={iconSize} color={iconColor} />}
            onChangeText={text => onChangeField('agencyDigit', text)}
            onFocus={onFocusField}
          />
        </HalfField>
      </Row2Up>

      <FormFieldRow
        label={translate('account_driver_modal.op')}
        value={form?.op}
        editable={editable}
        keyboardType="numeric"
        icon={<Ionicons name="options-outline" size={iconSize} color={iconColor} />}
        onChangeText={text => onChangeField('op', text)}
        onFocus={onFocusField}
      />
      {editable && <HintText>{translate('bank_account_screen.op_hint')}</HintText>}
    </>
  );
}
