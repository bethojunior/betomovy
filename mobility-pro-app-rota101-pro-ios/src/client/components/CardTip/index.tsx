import {shade} from 'polished';
import {useEffect, useState} from 'react';
import {useAuth} from '../../../context/auth';
import {translate} from '../../locales';
import theme from '../../styles/theme';
import Helper from '../../utils/Helper';
import {TextEdit} from '../TextEdit';
import {
  Container,
  Image,
  ContainerColumn,
  Header,
  ButtonNegociate,
  ContainerTips,
  ButtonTip,
  InputMask,
} from './styles';

interface Props {
  image: string;
  setValueTip: (value: number) => void;
  valueTip: number;
}
export const CardTip = ({image, valueTip, setValueTip}: Props) => {
  const {cityConfig} = useAuth();
  const dataValue = [{value: 2}, {value: 5}, {value: 7}];
  const [otherValue, setOtherValue] = useState(false);
  const [price, setPrice] = useState('');

  useEffect(() => {
    if (price) {
      const priceNumber = price.replace('R$', '').replace(',', '.');
      setValueTip(Number(priceNumber));
    }
  }, [price]);
  return (
    <Container>
      <Header>
        <ContainerColumn>
          <TextEdit color="black" size="small">
            {translate('tipClient.the_tip_amount_optional_is_not_mandatory')}
          </TextEdit>
        </ContainerColumn>
      </Header>
      <ContainerTips>
        {!otherValue ? (
          dataValue.map((item, index) => {
            return (
              <ButtonTip
                activeOpacity={0.8}
                key={index}
                onPress={() => {
                  if (item.value == Number(valueTip)) {
                    return setValueTip(0);
                  }
                  if (price) {
                    setPrice('');
                  }
                  setValueTip(item?.value);
                }}
                selected={item?.value == Number(valueTip)}
              >
                <TextEdit
                  color={
                    item?.value == Number(valueTip)
                      ? theme.colors.primaryText
                      : theme.colors.primary
                  }
                  size="medium"
                >
                  {cityConfig?.typeMoney}{' '}
                  {Helper.maskMoney(Number(item?.value))}
                </TextEdit>
              </ButtonTip>
            );
          })
        ) : (
          <InputMask
            value={price}
            type={'money'}
            options={{
              unit: cityConfig?.typeMoney,
            }}
            onChangeText={e => setPrice(e)}
          />
        )}
      </ContainerTips>
    </Container>
  );
};
