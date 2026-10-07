import {useEffect, useState} from 'react';
import {Modal, View} from 'react-native';
import {BarCodeScanner} from 'expo-barcode-scanner';
import {Ionicons} from '@expo/vector-icons';
import {TextEdit} from '../TextEdit';
import {
  CameraBarCode,
  ContainerModal,
  HeaderBack,
  Button,
  ContainerCentralize,
  QrCodeCamera,
  ContainerTextUpper,
} from './styles';
import theme from '../../styles/theme';
import {translate} from '../../locales';

interface Props {
  visible: boolean;
  setVisible?: any;
  setDataScanned?: any;
}

export const ModalReadQrCode = ({
  visible,
  setVisible,
  setDataScanned,
}: Props) => {
  const [hasPermission, setHasPermission] = useState<any>(null);
  const [scanned, setScanned] = useState(false);

  useEffect(() => {
    const getBarCodeScannerPermissions = async () => {
      const {status} = await BarCodeScanner.requestPermissionsAsync();
      setHasPermission(status === 'granted');
    };

    getBarCodeScannerPermissions();
  }, []);

  const handleBarCodeScanned = ({type, data}: any) => {
    setScanned(true);
    setDataScanned(data);
    setScanned(false);
    setVisible(false);
  };

  return (
    <Modal visible={visible} animationType="slide">
      <ContainerModal>
        <HeaderBack onPress={() => setVisible(false)} activeOpacity={0.8}>
          <Ionicons name="arrow-back" size={50} color={theme.colors.primary} />
        </HeaderBack>
        <CameraBarCode
          onBarCodeScanned={scanned ? undefined : handleBarCodeScanned}
        />
        <ContainerTextUpper>
          <TextEdit color={theme.colors.primary} transform="none">
            {translate('trip.scan_the_driver_qr_code')}
          </TextEdit>
        </ContainerTextUpper>
        <ContainerCentralize>
          <QrCodeCamera></QrCodeCamera>
        </ContainerCentralize>
        {scanned && (
          <Button onPress={() => setScanned(false)}>
            <TextEdit>{translate('trip.scan_again')}</TextEdit>
          </Button>
        )}
      </ContainerModal>
    </Modal>
  );
};
