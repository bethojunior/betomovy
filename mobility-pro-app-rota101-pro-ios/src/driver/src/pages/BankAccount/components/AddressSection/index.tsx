import { FontAwesome5, Ionicons } from '@expo/vector-icons';
import { RFValue } from 'react-native-responsive-fontsize';
import { useTheme } from 'styled-components/native';
import { translate } from '../../../../../../client/locales';
import { FormFieldRow } from '../FormFieldRow';
import { HalfField, Row2Up } from '../FormFieldRow/styles';
import { AddressSectionProps } from './types';

/** Campos de endereço (CEP com autocomplete via ViaCEP). */
export function AddressSection({ form, editable, onChangeField, onBlurZipCode, onFocusField }: AddressSectionProps) {
  const theme = useTheme();
  const iconSize = RFValue(12);
  const iconColor = theme.colors.icon_gray;

  return (
    <>
      <FormFieldRow
        label={translate('bank_account_screen.zip_code')}
        value={form?.zipCode}
        editable={editable}
        keyboardType="numeric"
        icon={<Ionicons name="location-outline" size={iconSize} color={iconColor} />}
        onChangeText={text => onChangeField('zipCode', text)}
        onBlur={() => onBlurZipCode(form?.zipCode)}
        onFocus={onFocusField}
      />

      <FormFieldRow
        label={translate('bank_account_screen.street')}
        value={form?.street}
        editable={editable}
        icon={<Ionicons name="home-outline" size={iconSize} color={iconColor} />}
        onChangeText={text => onChangeField('street', text)}
        onFocus={onFocusField}
      />

      <Row2Up>
        <HalfField>
          <FormFieldRow
            label={translate('bank_account_screen.number')}
            value={form?.number}
            editable={editable}
            keyboardType="numeric"
            icon={<FontAwesome5 name="hashtag" size={iconSize} color={iconColor} />}
            onChangeText={text => onChangeField('number', text)}
            onFocus={onFocusField}
          />
        </HalfField>
        <HalfField>
          <FormFieldRow
            label={translate('bank_account_screen.complement')}
            value={form?.complement}
            editable={editable}
            icon={<Ionicons name="ellipsis-horizontal-outline" size={iconSize} color={iconColor} />}
            onChangeText={text => onChangeField('complement', text)}
            onFocus={onFocusField}
          />
        </HalfField>
      </Row2Up>

      <Row2Up>
        <HalfField>
          <FormFieldRow
            label={translate('bank_account_screen.city')}
            value={form?.city}
            editable={editable}
            icon={<Ionicons name="map-outline" size={iconSize} color={iconColor} />}
            onChangeText={text => onChangeField('city', text)}
            onFocus={onFocusField}
          />
        </HalfField>
        <HalfField>
          <FormFieldRow
            label={translate('bank_account_screen.state')}
            value={form?.state}
            editable={editable}
            icon={<Ionicons name="flag-outline" size={iconSize} color={iconColor} />}
            onChangeText={text => onChangeField('state', text)}
            onFocus={onFocusField}
          />
        </HalfField>
      </Row2Up>
    </>
  );
}
