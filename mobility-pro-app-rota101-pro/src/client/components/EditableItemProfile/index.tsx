import {useState} from 'react';
import {ActivityIndicator} from 'react-native';
import Ionicons from '@expo/vector-icons/Ionicons';
import {useTheme} from 'styled-components/native';
import {RFValue} from 'react-native-responsive-fontsize';
import {
  Button,
  Container,
  ContentText,
  EditingRow,
  ErrorText,
  IconButton,
  Input,
  Item,
  LabelValue,
  SecondaryActionButton,
  SecondaryActionText,
  TextGroup,
} from './styles';
import {EditableItemProfileProps} from './types';

/**
 * Linha de perfil editável inline (sem modal), reaproveitada por cliente e
 * motorista. Duas variantes:
 * - "edit" (padrão): vira um TextInput editável com salvar/cancelar.
 * - "reveal": vira um TextInput somente-leitura que alterna entre valor
 *   mascarado e real (ex: senha), com uma ação secundária opcional abaixo.
 */
export function EditableItemProfile(props: EditableItemProfileProps) {
  const theme = useTheme();
  const isReveal = props.variant === 'reveal';

  const [expanded, setExpanded] = useState(false);
  const [draft, setDraft] = useState('');
  const [saving, setSaving] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const [revealedValue, setRevealedValue] = useState<string | null>(null);

  const collapsedValue = isReveal ? props.maskedValue : props.value;

  const openEdit = () => {
    setError(null);
    if (!isReveal) {
      setDraft(props.value);
    } else {
      setRevealedValue(null);
    }
    setExpanded(true);
  };

  const closeEdit = () => {
    setExpanded(false);
    setError(null);
  };

  const handleSave = async () => {
    if (isReveal) return;

    const rawValue = props.parseInput ? props.parseInput(draft) : draft;
    const validationError = props.validate?.(rawValue) ?? null;
    if (validationError) {
      setError(validationError);
      return;
    }

    setSaving(true);
    const result = await props.onSave(rawValue);
    setSaving(false);

    if (!result?.status) {
      setError(result?.message || null);
      return;
    }

    props.onSaved?.(rawValue);
    setExpanded(false);
  };

  const toggleReveal = async () => {
    if (!isReveal) return;

    if (revealedValue !== null) {
      setRevealedValue(null);
      return;
    }

    const value = await props.onReveal();
    setRevealedValue(value);
  };

  if (!expanded) {
    return (
      <Container>
        <ContentText>
          {props.icon && (
            <Ionicons name={props.icon} size={RFValue(18)} color={theme.colors.icon_gray} />
          )}

          <TextGroup>
            <Item>{props.label}</Item>
          </TextGroup>

          <Button onPress={openEdit} activeOpacity={0.7}>
            <LabelValue numberOfLines={1}>{collapsedValue}</LabelValue>
            <Ionicons
              name={isReveal ? 'eye-outline' : 'pencil-outline'}
              size={RFValue(16)}
              color={theme.colors.grayLight}
            />
          </Button>
        </ContentText>
      </Container>
    );
  }

  return (
    <Container>
      <ContentText>
        {props.icon && (
          <Ionicons name={props.icon} size={RFValue(18)} color={theme.colors.icon_gray} />
        )}
        <TextGroup>
          <Item>{props.label}</Item>
        </TextGroup>
      </ContentText>

      <EditingRow>
        {isReveal ? (
          <Input
            editable={false}
            value={revealedValue ?? props.maskedValue}
          />
        ) : (
          <Input
            autoFocus
            keyboardType={props.keyboardType}
            value={draft}
            onChangeText={text => setDraft(props.formatValue ? props.formatValue(text) : text)}
          />
        )}

        {isReveal ? (
          <IconButton onPress={toggleReveal}>
            <Ionicons
              name={revealedValue !== null ? 'eye-off-outline' : 'eye-outline'}
              size={RFValue(18)}
              color={theme.colors.primary}
            />
          </IconButton>
        ) : (
          <IconButton onPress={handleSave} disabled={saving}>
            {saving ? (
              <ActivityIndicator size="small" color={theme.colors.primary} />
            ) : (
              <Ionicons name="checkmark" size={RFValue(20)} color={theme.colors.border_green} />
            )}
          </IconButton>
        )}

        <IconButton onPress={closeEdit}>
          <Ionicons name="close" size={RFValue(20)} color={theme.colors.grayLight} />
        </IconButton>
      </EditingRow>

      {!!error && <ErrorText>{error}</ErrorText>}

      {isReveal && props.secondaryAction && (
        <SecondaryActionButton onPress={props.secondaryAction.onPress} activeOpacity={0.7}>
          <SecondaryActionText>{props.secondaryAction.label}</SecondaryActionText>
        </SecondaryActionButton>
      )}
    </Container>
  );
}
