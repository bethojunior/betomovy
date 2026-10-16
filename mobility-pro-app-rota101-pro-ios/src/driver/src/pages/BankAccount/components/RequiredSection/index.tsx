import { Ionicons } from '@expo/vector-icons';
import { RFValue } from 'react-native-responsive-fontsize';
import { useTheme } from 'styled-components/native';
import { translate } from '../../../../../../client/locales';
import { formatPhone } from '../../../../../../client/utils/formatPhone';
import PixIcon from '../../../../assets/images/pix.svg';
import { PixKeyType, suggestPixKeyType } from '../../utils/detectPixKeyType';
import { maskCpfCnpj, unmaskDocument } from '../../utils/maskDocument';
import { FormFieldRow } from '../FormFieldRow';
import { EditField, EditLabel, EditLabelRow, FieldErrorText, IconBadge, Input } from '../FormFieldRow/styles';
import { RadioGroup } from '../RadioGroup';
import { RequiredSectionProps } from './types';
import { Card, SectionTitle } from './styles';

const PIX_TYPE_OPTIONS: { value: PixKeyType; labelKey: string }[] = [
  { value: 'cpf_cnpj', labelKey: 'bank_account_screen.pix_type_cpf_cnpj' },
  { value: 'phone', labelKey: 'bank_account_screen.pix_type_phone' },
  { value: 'email', labelKey: 'bank_account_screen.pix_type_email' },
  { value: 'random', labelKey: 'bank_account_screen.pix_type_random' },
];

const maskPixValue = (type: PixKeyType, text: string) => {
  if (type === 'cpf_cnpj') return maskCpfCnpj(text);
  if (type === 'phone') return formatPhone(text, true);
  return text;
};

const pixKeyboardType = (type: PixKeyType) => {
  if (type === 'phone') return 'phone-pad' as const;
  if (type === 'email') return 'email-address' as const;
  if (type === 'cpf_cnpj') return 'numeric' as const;
  return 'default' as const;
};

/** Card com o mínimo pra receber transferências: titular, documento e chave Pix. */
export function RequiredSection({ form, editable, fieldErrors, onChangeField, onFocusField }: RequiredSectionProps) {
  const theme = useTheme();
  const iconSize = RFValue(12);
  const iconColor = theme.colors.icon_gray;
  // Usa o tipo salvo; se a conta ainda não tem (cadastro antigo/novo), sugere pelo valor digitado.
  const pixType = (form?.pixType as PixKeyType) || suggestPixKeyType(form?.pix) || 'cpf_cnpj';

  return (
    <Card>
      <SectionTitle>{translate('bank_account_screen.section_required')}</SectionTitle>

      <FormFieldRow
        label={translate('account_driver_modal.name')}
        value={form?.holderName}
        editable={editable}
        required
        icon={<Ionicons name="person-outline" size={iconSize} color={iconColor} />}
        error={fieldErrors.holderName}
        onChangeText={text => onChangeField('holderName', text)}
        onFocus={onFocusField}
      />

      <FormFieldRow
        label={translate('account_driver_modal.document')}
        value={maskCpfCnpj(form?.document)}
        editable={editable}
        required
        keyboardType="numeric"
        icon={<Ionicons name="card-outline" size={iconSize} color={iconColor} />}
        error={fieldErrors.document}
        onChangeText={text => onChangeField('document', unmaskDocument(text))}
        onFocus={onFocusField}
      />

      {editable ? (
        <EditField>
          <EditLabelRow>
            <IconBadge>
              <PixIcon width={iconSize} height={iconSize} />
            </IconBadge>
            <EditLabel>{`${translate('account_driver_modal.pix')} *`}</EditLabel>
          </EditLabelRow>

          <Input
            value={form?.pix}
            keyboardType={pixKeyboardType(pixType)}
            hasError={!!fieldErrors.pix}
            onChangeText={text => onChangeField('pix', maskPixValue(pixType, text))}
            onFocus={onFocusField}
          />

          <RadioGroup
            value={pixType}
            options={PIX_TYPE_OPTIONS.map(option => ({ value: option.value, label: translate(option.labelKey) }))}
            onChange={type => {
              onChangeField('pixType', type);
              onChangeField('pix', maskPixValue(type, form?.pix ?? ''));
            }}
          />
          {!!fieldErrors.pix && <FieldErrorText>{fieldErrors.pix}</FieldErrorText>}
        </EditField>
      ) : (
        <FormFieldRow
          label={translate('account_driver_modal.pix')}
          value={form?.pix ? `${form.pix} (${translate(`bank_account_screen.pix_type_${pixType}`)})` : form?.pix}
          editable={false}
          icon={<PixIcon width={iconSize} height={iconSize} />}
        />
      )}
    </Card>
  );
}
