import { ScrollView } from "react-native";
import AddCoupom from "~/client/components/Payment/AddCoupom";
import { useTheme } from "styled-components/native";
import { translate } from "~/client/locales";
import { useEffect, useState } from "react";
import { usePaymentForm } from "~/client/contexts/paymentForms";
import Coupom from '../../assets/images/coupom.png';

import {
  Container,
  Button,
  Title,
  CardPaymentForm,
  Icon,
  TextPaymentType,
  SimpleText,
  Content,
} from "./styles";
import Preload from "~/components/Preload";

interface VoucherSelected {
  amount: string;
  cityId: string;
  id: string;
  percentage: string;
  user: string;
  value: string;
}

interface CouponItem {
  code: string;
  value: string;
  tripPaymentForm: string;
  valueType: string;
  dateEnd: string;
  id: string;
}

export default function CouponsMobility() {
  const [loading, setLoading] = useState(false);
  const [listCard, setListCard] = useState<any>([]);
  const [currentSald, setCurrentSald] = useState(0);
  const [coupon, setCoupon] = useState([]);
  const [cardSelected, setCardSelected] = useState('');
  const [listVoucher, setListVoucher] = useState([]);
  const [voucherSelected, setVoucherSelected] = useState<VoucherSelected>();

  const [showCouponModal, setShowCouponModal] = useState(false);
  const [showCardModal, setShowCardModal] = useState(false);
  const [showVoucherModal, setShowVoucherModal] = useState(false);
  const [visibleDialog, setVisibleDialog] = useState(false);
  const [textEmptyCoupon, setTextEmptyCoupon] = useState(false);

  const theme = useTheme();
  const { getCoupons } = usePaymentForm();

  const listCoupons = () => {
    setLoading(true);
    getCoupons().then((data: any) => {
      setLoading(false);

      if (data.length === 0) {
        return setTextEmptyCoupon(true);
      }

      setTextEmptyCoupon(false);
      return setCoupon(data);
    });
  };

  useEffect(() => {
    listCoupons();
  }, []);

  return (
    <Container>
      <Preload visible={loading} type="spinner" />
      <Content>
        <Title>{translate('paymentPage.title_cuopon')}</Title>

        {textEmptyCoupon && (
          <SimpleText style={{ paddingVertical: 10 }}>
            {translate('paymentPage.text_no_coupon')}
          </SimpleText>
        )}

        <ScrollView style={{ flexGrow: 1 }}>
          {coupon.map((item: CouponItem) => {
            return (
              <CardPaymentForm key={item.id}>
                <Icon source={Coupom} />
                <TextPaymentType>
                  {item.valueType === '%'
                    ? `-${item.value}${item.valueType} `
                    : `- ${item.valueType}${item.value} `}
                </TextPaymentType>
                <SimpleText
                  style={{
                    textTransform: 'lowercase',
                  }}
                >
                  {item.tripPaymentForm !== null
                    ? `${translate('paymentPage.text_coupon')} ${item.tripPaymentForm
                    }`
                    : translate('paymentPage.text_all_type_payment')}
                </SimpleText>
              </CardPaymentForm>
            );
          })}
        </ScrollView>
      </Content>

      <Button
        title={translate('paymentPage.text_add_coupon')}
        onPress={() => setShowCouponModal(true)}
      />

      <AddCoupom
        visible={showCouponModal}
        setVisible={setShowCouponModal}
        updateList={listCoupons}
      />
    </Container>
  )
}
