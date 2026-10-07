import {FC, useCallback, useState} from 'react';
import {yupResolver} from '@hookform/resolvers/yup';
import {useForm} from 'react-hook-form';
import {TextInputMask} from 'react-native-masked-text';
import {Platform} from 'react-native';
import {Group, SubGroup, Label} from './styles';
import {schema} from './schema';
import Input from '../form/InputForm';
import InputMask from '../form/InputFormMask';
import ModalFrame from '../form/ModalFrame';
import Preload from '../Preload';
import {usePaymentForm} from '../../context/paymentForms';
import {translate} from '../../../../client/locales';

interface Props {
  visible: boolean;
  setVisible(boolean: boolean): void;
  listCard: any;
  updateList: () => void;
}

interface FormData extends TextInputMask {
  cardHolder: string;
  document: string;
  cardNumber: string;
  dueDate: string;
  cvv: number;
  birthday: string;
}

const AddCard: FC<Props> = ({visible, setVisible, listCard, updateList}) => {
  const [loading, setLoading] = useState(false);

  const {addCard} = usePaymentForm();

  const {
    control,
    handleSubmit,
    reset,
    formState: {errors},
  } = useForm<FormData>({
    resolver: yupResolver(schema),
  });

  const insertCard = useCallback(
    async (form: FormData) => {
      if (Platform.OS === 'ios') {
        setVisible(false);
      } else {
        setLoading(true);
      }
      const {cardHolder, document, cardNumber, dueDate, cvv, birthday} = form;

      await addCard(
        listCard,
        cardHolder,
        document,
        cardNumber,
        dueDate,
        String(cvv),
        birthday,
      );
      setLoading(false);
      setVisible(false);
      reset();
      return updateList();
    },
    [addCard],
  );

  return (
    <>
      <Preload visible={loading} />
      <ModalFrame
        visible={visible}
        setVisible={setVisible}
        onPressConfirm={handleSubmit(insertCard)}
        error={false}
        textError=""
        onClose={() => {
          setVisible(false);
          reset();
        }}
      >
        <Label>{translate('paymentPage.title_holder')}</Label>
        <Input
          name="cardHolder"
          control={control}
          error={errors.cardHolder && errors.cardHolder.message}
          keyboardType="default"
        />
        <Label>{translate('paymentPage.title_number_of_card')}</Label>
        <InputMask
          type="credit-card"
          name="cardNumber"
          control={control}
          error={errors.cardNumber && errors.cardNumber.message}
          keyboardType="numeric"
        />
        <Group>
          <SubGroup>
            <Label>{translate('paymentPage.title_document')}</Label>
            <InputMask
              type="cpf"
              name="document"
              control={control}
              error={errors.document && errors.document.message}
              keyboardType="numeric"
            />
          </SubGroup>
          <SubGroup>
            <Label>{translate('paymentPage.title_birth_date')}</Label>
            <InputMask
              type="datetime"
              options={{
                format: 'DD/MM/YYYY',
              }}
              name="birthday"
              control={control}
              error={errors.birthday && errors.birthday.message}
              keyboardType="numeric"
            />
          </SubGroup>
        </Group>

        <Group>
          <SubGroup>
            <Label>{translate('paymentPage.title_due_date')}</Label>
            <InputMask
              type="datetime"
              options={{
                format: 'MM/YYYY',
              }}
              name="dueDate"
              control={control}
              error={errors.dueDate && errors.dueDate.message}
              keyboardType="numeric"
            />
          </SubGroup>
          <SubGroup>
            <Label>{translate('paymentPage.title_cvv')}</Label>
            <Input
              maxLength={4}
              name="cvv"
              control={control}
              error={errors.cvv && errors.cvv.message}
              keyboardType="numeric"
            />
          </SubGroup>
        </Group>
      </ModalFrame>
    </>
  );
};

export default AddCard;
