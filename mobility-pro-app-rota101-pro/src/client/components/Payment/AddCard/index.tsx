import { FC, useState, useMemo, useCallback } from 'react';
import { useForm } from 'react-hook-form';
import { Platform, Text, View, Modal, TouchableOpacity, KeyboardAvoidingView, ScrollView } from 'react-native';
import {
  Group,
  SubGroup,
  Label,
  CardMock,
  CardIconWrapper,
  CardIconTextWrapper,
  CardInfoWrapper,
} from './styles';
import Input from '../../form/InputForm';
import { translate } from '../../../locales';
import InputMask from '../../form/InputFormMask';
import Preload from '../../Preload';
import { usePaymentForm } from '../../../contexts/paymentForms';
import { styles } from './styles';

import IconElo from '../../../../../assets/icon-elo.svg';
import IconMaster from '../../../../../assets/icon-mastercard.svg';
import IconVisa from '../../../../../assets/icon-visa.svg';
import IconAmex from '../../../../../assets/icon-amex.svg';
import IconDiners from '../../../../../assets/icon-diners.svg';
import IconHipercard from '../../../../../assets/icon-hipercard.svg';
import { SafeAreaView } from 'react-native-safe-area-context';

const cardIcons = {
  elo: <IconElo width={40} height={40} />,
  mastercard: <IconMaster width={40} height={40} />,
  visa: <IconVisa width={40} height={40} />,
  amex: <IconAmex width={40} height={40} />,
  diners: <IconDiners width={40} height={40} />,
  hipercard: <IconHipercard width={40} height={40} />,
};

interface Props {
  visible: boolean;
  setVisible(visible: boolean): void;
  listCard: any;
  updateList: () => void;
}

interface FormData {
  cardHolder: string;
  document: string;
  cardNumber: string;
  dueDate: string;
  cvv: string;
  birthday: string;
}

const getCardType = (number: string) => {
  const re = {
    elo: /^((((636368)|(438935)|(504175)|(451416)|(636297))\d{0,10})|((5067)|(4576)|(4011))\d{0,12})$/,
    mastercard: /^5[1-5][0-9]{14}$/,
    visa: /^4[0-9]{12}(?:[0-9]{3})?$/,
    amex: /^3[47][0-9]{13}$/,
    diners: /^3(0[0-5]|[68]\d)\d{11}$/,
    hipercard: /^(606282\d{10}(\d{3})?)|(3841\d{15})$/,
  };

  for (const [key, regex] of Object.entries(re)) {
    if (regex.test(number)) return key;
  }

  return 'default';
};

const AddCard: FC<Props> = ({ visible, setVisible, listCard, updateList }) => {
  const [loading, setLoading] = useState(false);

  const { addCard } = usePaymentForm();

  const {
    control,
    handleSubmit,
    reset,
    formState: { errors },
    watch,
  } = useForm<FormData>();

  const cardHolder = watch('cardHolder', '');
  const cardNumber = watch('cardNumber', '');
  const dueDate = watch('dueDate', '');
  const cvv = watch('cvv', '');
  const cardType = useMemo(
    () => getCardType(cardNumber.replace(/\s+/g, '')),
    [cardNumber],
  );

  const insertCard = useCallback(
    async (form: FormData) => {
      if (loading) return;

      setLoading(true);
      try {
        const { cardHolder, document, cardNumber, cvv, birthday } = form;
        let { dueDate } = form;

        if (dueDate && dueDate.length === 5 && dueDate.indexOf('/') === 2) {
          const [month, year] = dueDate.split('/');
          if (year.length === 2) {
            dueDate = `${month}/20${year}`;
          }
        }

        const ok = await addCard(
          listCard,
          cardHolder,
          document,
          cardNumber,
          dueDate,
          cvv,
          birthday,
        );

        if (!ok) {
          return;
        }

        reset();
        setVisible(false);
        if (typeof updateList === 'function') {
          await updateList();
        }
      } finally {
        setLoading(false);
      }
    },
    [addCard, listCard, loading, reset, setVisible, updateList],
  );

  const closeModal = useCallback(() => {
    if (loading) return;
    setVisible(false);
    reset();
  }, [loading, setVisible, reset]);

  return (
    <>
      <Preload visible={loading} />
      <Modal
        visible={visible}
        animationType="slide"
        transparent
        onRequestClose={closeModal}
      >
        <SafeAreaView style={{ flexGrow: 1 }}>
          <KeyboardAvoidingView
            behavior={Platform.OS === 'ios' ? 'padding' : 'height'}
            style={{ flex: 1 }}
            keyboardVerticalOffset={Platform.OS === 'ios' ? 100 : 0}
          >
            <ScrollView
              contentContainerStyle={{ flexGrow: 1 }}
              keyboardShouldPersistTaps="handled"
              showsVerticalScrollIndicator={false}
            >
              <View style={styles.modalContainer}>
                <View style={styles.modalContent}>
                  <CardMock>
                    <CardIconWrapper>
                      {cardType !== 'default' ? (
                        cardIcons[cardType]
                      ) : (
                        <IconMaster width={40} height={40} style={styles.placeholder} />
                      )}
                    </CardIconWrapper>
                    <CardInfoWrapper>
                      <CardIconTextWrapper>
                        <Text
                          style={[
                            styles.cardFlagText,
                            cardType === 'default' && styles.placeholder,
                          ]}
                        >
                          {cardType !== 'default'
                            ? cardType.charAt(0).toUpperCase() + cardType.slice(1)
                            : 'Mastercard'}
                        </Text>
                      </CardIconTextWrapper>
                    </CardInfoWrapper>
                    <Text
                      style={[styles.cardNumber, !cardNumber && styles.placeholder]}
                    >
                      {cardNumber
                        ? cardNumber.replace(/(\d{4})(?=\d)/g, '$1 ')
                        : '0000 0000 0000 0000'}
                    </Text>
                    <View style={styles.cardDetails}>
                      <View style={styles.cardHolderCvvWrapper}>
                        <Text
                          style={[styles.cardHolder, !cardHolder && styles.placeholder]}
                        >
                          {cardHolder || 'John Doe'}
                        </Text>
                        <View style={styles.cardCvvContainer}>
                          <Text
                            style={[styles.cardCvvLabel, !cvv && styles.placeholder]}
                          >
                            {translate('paymentPage.title_cvv')}:
                          </Text>
                          <Text style={[styles.cardCvv, !cvv && styles.placeholder]}>
                            {cvv || '000'}
                          </Text>
                        </View>
                      </View>
                      <View style={styles.cardExpiry}>
                        <Text
                          style={[styles.cardDueDate, !dueDate && styles.placeholder]}
                        >
                          {dueDate || 'MM/YY'}
                        </Text>
                      </View>
                    </View>
                  </CardMock>

                  <Label>{translate('paymentPage.title_holder')}</Label>
                  <Input
                    name="cardHolder"
                    control={control}
                    error={errors.cardHolder?.message}
                    keyboardType="default"
                    placeholder={translate('paymentPage.placeholder_holder')}
                  />
                  <Label>{translate('paymentPage.title_number_of_card')}</Label>
                  <InputMask
                    type="credit-card"
                    name="cardNumber"
                    control={control}
                    error={errors.cardNumber?.message}
                    keyboardType="numeric"
                    placeholder="0000 0000 0000 0000"
                  />

                  <Group style={{ alignItems: 'flex-end' }}>
                    <SubGroup>
                      <Label>{translate('paymentPage.title_document')}</Label>
                      <InputMask
                        type="cpf"
                        name="document"
                        control={control}
                        error={errors.document?.message}
                        keyboardType="numeric"
                        placeholder="000.000.000-00"
                      />
                    </SubGroup>
                    <SubGroup>
                      <Label>{translate('paymentPage.title_birth_date')}</Label>
                      <InputMask
                        type="datetime"
                        options={{ format: 'DD/MM/YYYY' }}
                        name="birthday"
                        control={control}
                        error={errors.birthday?.message}
                        keyboardType="numeric"
                        placeholder="DD/MM/YYYY"
                      />
                    </SubGroup>
                  </Group>

                  <Group style={{ alignItems: 'flex-end' }}>
                    <SubGroup>
                      <Label>{translate('paymentPage.title_due_date')}</Label>
                      <InputMask
                        type="datetime"
                        options={{ format: 'MM/YY' }}
                        name="dueDate"
                        control={control}
                        error={errors.dueDate?.message}
                        keyboardType="numeric"
                        placeholder="MM/YY"
                      />
                    </SubGroup>
                    <SubGroup>
                      <Label>{translate('paymentPage.title_cvv')}</Label>
                      <Input
                        maxLength={4}
                        name="cvv"
                        control={control}
                        error={errors.cvv?.message}
                        keyboardType="numeric"
                        placeholder="CVV"
                      />
                    </SubGroup>
                  </Group>

                  <View style={styles.buttonContainer}>
                    <TouchableOpacity
                      style={[styles.button, styles.cancelButton]}
                      onPress={closeModal}
                      disabled={loading}
                    >
                      <Text style={[styles.buttonText, styles.cancelButtonText]}>
                        {translate('dialog.cancel')}
                      </Text>
                    </TouchableOpacity>
                    <TouchableOpacity
                      style={[styles.button, styles.confirmButton]}
                      onPress={handleSubmit(insertCard)}
                      disabled={loading}
                    >
                      <Text style={[styles.buttonText, styles.confirmButtonText]}>
                        {translate('dialog.confirm')}
                      </Text>
                    </TouchableOpacity>
                  </View>
                </View>
              </View>
            </ScrollView>
          </KeyboardAvoidingView>
        </SafeAreaView>
      </Modal>
    </>
  );
};

export default AddCard;
