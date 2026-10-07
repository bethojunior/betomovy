import { useRef, useState } from 'react';
import { ActivityIndicator, ScrollView } from 'react-native';
import { useNavigation } from '@react-navigation/native';
import { FontAwesome5, Ionicons } from '@expo/vector-icons';
import { RFValue } from 'react-native-responsive-fontsize';
import { useTheme } from 'styled-components/native';

import { translate } from '../../../../client/locales';
import { useKeyboardHeight } from '../../../../common/hooks/useKeyboardHeight';
import Preload from '../../components/Preload';
import { AccountNumbersSection } from './components/AccountNumbersSection';
import { AddressSection } from './components/AddressSection';
import { CollapsibleSection } from './components/CollapsibleSection';
import { IdentitySection } from './components/IdentitySection';
import { RequiredSection } from './components/RequiredSection';
import { useBankAccountForm } from './useBankAccountForm';
import { useScrollIntoView } from './useScrollIntoView';
import { BankAccountRouteParams } from './types';
import {
  BackButton,
  BackButtonText,
  Container,
  Content,
  EmptyCard,
  EmptyDescription,
  EmptyIconWrapper,
  EmptyTitle,
  ErrorText,
  Footer,
  FooterRow,
  Header,
  HeaderActionText,
  HeaderButton,
  HeaderTitle,
  IntroCard,
  IntroIconWrapper,
  IntroSubtitle,
  IntroTextGroup,
  IntroTitle,
  ModeBadge,
  ModeBadgeText,
  SaveButton,
  SaveButtonText,
} from './styles';

export const BankAccount = ({ route }: any) => {
  const { initialMode }: BankAccountRouteParams = route?.params || {};
  const navigation = useNavigation();
  const theme = useTheme();
  const keyboardHeight = useKeyboardHeight();
  const scrollRef = useRef<ScrollView>(null);
  const handleFocusField = useScrollIntoView(scrollRef);
  const [expandedSection, setExpandedSection] = useState<'optional' | 'address' | null>(null);
  const toggleSection = (section: 'optional' | 'address') =>
    setExpandedSection((current) => (current === section ? null : section));

  const {
    mode,
    form,
    banks,
    saving,
    fieldErrors,
    submitError,
    hasAccount,
    setField,
    setBank,
    startEdit,
    cancelEdit,
    fetchAddressByZipCode,
    submit,
  } = useBankAccountForm(initialMode);

  const isEditable = mode === 'edit';

  const introTitleKey = isEditable
    ? hasAccount
      ? 'bank_account_screen.intro_title_edit'
      : 'bank_account_screen.intro_title_create'
    : 'bank_account_screen.intro_title_read';

  return (
    <Container>
      <Header>
        <HeaderButton onPress={() => navigation.goBack()}>
          <FontAwesome5 name="arrow-left" size={RFValue(16)} color={theme.colors.secondary} />
        </HeaderButton>

        <HeaderTitle>{translate('bank_account_screen.title')}</HeaderTitle>

        <HeaderButton onPress={mode === 'edit' ? cancelEdit : undefined}>
          {mode === 'edit' && <HeaderActionText>{translate('bank_account_screen.cancel_button')}</HeaderActionText>}
        </HeaderButton>
      </Header>

      <Content ref={scrollRef} keyboardHeight={keyboardHeight}>
        {(mode === 'read' || mode === 'edit') && (
          <IntroCard>
            <IntroIconWrapper>
              <FontAwesome5 name="university" size={RFValue(18)} color={theme.colors.primary} />
            </IntroIconWrapper>
            <IntroTextGroup>
              <IntroTitle>{translate(introTitleKey)}</IntroTitle>
              <IntroSubtitle>{translate('bank_account_screen.intro_subtitle')}</IntroSubtitle>
            </IntroTextGroup>
            {mode === 'read' && (
              <ModeBadge onPress={startEdit} activeOpacity={0.8}>
                <Ionicons name="eye-outline" size={RFValue(12)} color={theme.colors.primary} />
                <ModeBadgeText>{translate('bank_account_screen.mode_read_badge')}</ModeBadgeText>
              </ModeBadge>
            )}
          </IntroCard>
        )}

        {(mode === 'read' || mode === 'edit') && (
          <>
            <RequiredSection
              form={form}
              editable={isEditable}
              fieldErrors={fieldErrors}
              onChangeField={setField}
              onFocusField={handleFocusField}
            />

            <CollapsibleSection
              title={translate('bank_account_screen.section_optional')}
              icon={<Ionicons name="wallet-outline" size={RFValue(12)} color={theme.colors.icon_gray} />}
              expanded={expandedSection === 'optional'}
              onToggle={() => toggleSection('optional')}
            >
              <IdentitySection
                form={form}
                editable={isEditable}
                banks={banks}
                onChangeField={setField}
                onChangeBank={setBank}
                onFocusField={handleFocusField}
              />

              <AccountNumbersSection
                form={form}
                editable={isEditable}
                onChangeField={setField}
                onFocusField={handleFocusField}
              />
            </CollapsibleSection>

            <CollapsibleSection
              title={translate('bank_account_screen.section_address')}
              icon={<Ionicons name="location-outline" size={RFValue(12)} color={theme.colors.icon_gray} />}
              expanded={expandedSection === 'address'}
              onToggle={() => toggleSection('address')}
            >
              <AddressSection
                form={form}
                editable={isEditable}
                onChangeField={setField}
                onBlurZipCode={fetchAddressByZipCode}
                onFocusField={handleFocusField}
              />
            </CollapsibleSection>
          </>
        )}

        {mode === 'empty' && (
          <EmptyCard>
            <EmptyIconWrapper>
              <FontAwesome5 name="university" size={RFValue(22)} color={theme.colors.grayLight} />
            </EmptyIconWrapper>
            <EmptyTitle>{translate('bank_account_screen.empty_title')}</EmptyTitle>
            <EmptyDescription>{translate('bank_account_screen.empty_description')}</EmptyDescription>
            <SaveButton onPress={startEdit} activeOpacity={0.8}>
              <SaveButtonText>{translate('bank_account_screen.empty_button')}</SaveButtonText>
            </SaveButton>
          </EmptyCard>
        )}
      </Content>

      {isEditable && (
        <Footer>
          {!!submitError && <ErrorText>{submitError}</ErrorText>}

          <FooterRow>
            <BackButton onPress={cancelEdit} activeOpacity={0.8}>
              <BackButtonText>{translate('bank_account_screen.cancel_button')}</BackButtonText>
            </BackButton>

            <SaveButton disabled={saving} onPress={submit} activeOpacity={0.8}>
              {saving ? (
                <ActivityIndicator color={theme.colors.primaryText} />
              ) : (
                <SaveButtonText>{translate('bank_account_screen.save_button')}</SaveButtonText>
              )}
            </SaveButton>
          </FooterRow>
        </Footer>
      )}

      <Preload visible={mode === 'loading'} />
    </Container>
  );
};
