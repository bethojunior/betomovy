import React, {FC, useState} from 'react';
import {Platform, Text} from 'react-native';
import {translate} from '../../../locales';
import InputFrame from '../../form/InputFrame';
import ModalFrame from '../../form/Modal';
import Preload from '../../Preload';
import {usePaymentForm} from '../../../contexts/paymentForms';
import theme from '../../../styles/theme';
import {useLocal} from '../../../contexts/local';

interface Props {
  visible: boolean;
  setVisible(boolean: boolean): void;
  updateList: () => void;
}

const AddCoupom: FC<Props> = ({visible, setVisible, updateList}) => {
  const [code, setCode] = useState('');
  const [loading, setLoading] = useState(false);

  const {position} = useLocal();

  const {addCoupon} = usePaymentForm();

  const addNewCoupom = () => {
    if (Platform.OS === 'ios') {
      setVisible(false);
    } else {
      setLoading(true);
    }
    addCoupon(code, position?.latitude, position?.longitude);
    setCode('');
    setVisible(false);
    setLoading(false);
    updateList();
  };

  return (
    <>
      <Preload visible={loading} />
      <ModalFrame
        visible={visible}
        setVisible={setVisible}
        onPressConfirm={addNewCoupom}
        error={false}
        textError=""
        onClose={() => {
          setCode('');
        }}
      >
        <Text style={{color: theme.colors.secondary, marginBottom: 10}}>
          {translate('paymentPage.title_enter_code_coupon')}
        </Text>
        <InputFrame
          editable={true}
          value={code}
          keyboradType={'default'}
          setValue={setCode}
        />
      </ModalFrame>
    </>
  );
};

export default AddCoupom;
