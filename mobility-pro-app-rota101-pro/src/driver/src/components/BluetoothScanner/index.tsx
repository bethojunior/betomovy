import {useState, useEffect} from 'react';
import {
  View,
  Text,
  Button,
  FlatList,
  PermissionsAndroid,
  DeviceEventEmitter,
} from 'react-native';
import BleManager from 'react-native-ble-manager';
import {customToast} from '../../../../utils/FlashMessage';
import {translate} from '../../../../client/locales';

// [TIP] https://developer.android.com/reference/android/Manifest.permission#BLUETOOTH_SCAN
const requestBluetoothPermission = async (): Promise<boolean> => {
  try {
    const granted = await PermissionsAndroid.request(
      PermissionsAndroid.PERMISSIONS.BLUETOOTH_SCAN,
      {
        title: 'Mobility Pro Bluetooth Permission',
        message: 'Mobility Pro necessita acesso ao bluetooth',
        buttonNeutral: 'Perguntar depois',
        buttonNegative: 'Cancelar',
        buttonPositive: 'OK',
      },
    );
    if (granted === PermissionsAndroid.RESULTS.GRANTED) {
      return true;
    } else {
      return false;
    }
  } catch (err) {
    console.warn(err);
    return false;
  }
};

const requestActivateBluetooth = async (): Promise<boolean> => {
  try {
    const granted = await PermissionsAndroid.request(
      PermissionsAndroid.PERMISSIONS.BLUETOOTH_CONNECT,
      {
        title: 'Mobility Pro Bluetooth Permission',
        message: 'Mobility Pro necessita que o bluetooth esteja ligado',
        buttonNeutral: 'Perguntar depois',
        buttonNegative: 'Cancelar',
        buttonPositive: 'OK',
      },
    );
    if (granted === PermissionsAndroid.RESULTS.GRANTED) {
      return true;
    } else {
      return false;
    }
  } catch (err) {
    console.warn(err);
    return false;
  }
};

export const BluetoothScanner = () => {
  const [devices, setDevices] = useState([]);
  const [isScanning, setIsScanning] = useState(false);

  const bleIsActive = async (): Promise<boolean> => {
    try {
      const isEnabled = await BleManager.checkState();
      return isEnabled === 'on';
    } catch (error) {
      console.error('Erro ao verificar estado do Bluetooth:', error);
      return false;
    }
  };

  // [TIP] FUNCTION ONLY WORKS ON ANDROID
  const enableBluetooth = async (): Promise<boolean> => {
    try {
      const deviceBlePermitted = await requestBluetoothPermission();
      if (!deviceBlePermitted) {
        customToast(
          translate('bluetooth.text_permission_denied'),
          'warning',
        );
        return false;
      } else {
        const isActive = await bleIsActive();

        if (!isActive) {
          await requestActivateBluetooth();
        }
      }
      return true;
    } catch (error) {
      return false;
    }
  };

  const startScan = () => {
    enableBluetooth()
      .then(res => {
        if (res) {
          BleManager.scan([], 5, true)
            .then(() => {
              setIsScanning(true);
            })
            .catch(err => {
              console.error('Erro ao iniciar a varredura:', err);
            });
        }
      })
      .catch(err => {
        console.warn('Erro ao habilitar o Bluetooth:', err);
      });
  };

  const handleStopScan = async () => {
    setIsScanning(false);
    setDevices([]);
    await BleManager.stopScan();
  };

  useEffect(() => {
    const handleDiscoverPeripheral = device => {
      if (!device?.name) {
        return;
      }
      setDevices(prevDevices => {
        if (!prevDevices.some(d => d?.id === device?.id)) {
          return [...prevDevices, device];
        }
        return prevDevices;
      });
    };

    DeviceEventEmitter.addListener(
      'BleManagerDiscoverPeripheral',
      handleDiscoverPeripheral,
    );

    return () => {
      DeviceEventEmitter.removeAllListeners('BleManagerDiscoverPeripheral');
    };
  }, []);

  useEffect(() => {
    const initializeBleManager = async () => {
      customToast(
        translate('bluetooth.text_reconnect_instructions'),
        'success',
      );
      await BleManager.start({showAlert: false});
    };

    initializeBleManager();

    return () => {
      BleManager.stopScan();
    };
  }, []);

  return (
    <View>
      <Button
        title={isScanning ? 'Escaneando...' : 'Escanear Dispositivos'}
        onPress={startScan}
        disabled={isScanning}
      />
      <Button
        title="Limpar Dispositivos"
        onPress={handleStopScan}
        disabled={!isScanning}
      />
      <FlatList
        data={devices}
        keyExtractor={item => item.id}
        style={{
          maxHeight: 200,
        }}
        renderItem={({item}) => (
          <View
            style={{
              padding: 10,
              borderBottomWidth: 1,
              borderBottomColor: '#ccc',
            }}
          >
            <Text>Name: {item.name || 'Unknown'}</Text>
            <Text>ID: {item.id}</Text>
          </View>
        )}
      />
    </View>
  );
};
