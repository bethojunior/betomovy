import {useEffect, useState} from 'react';
import BleManager from 'react-native-ble-manager';
import {DeviceEventEmitter} from 'react-native';

const useBluetoothManager = () => {
  const [isConnected, setIsConnected] = useState(false);
  const [dataReceived, setDataReceived] = useState(null);
  const [peripherals, setPeripherals] = useState([]); // [ { id: string, name: string }

  useEffect(() => {
    // Inicialize o BLE Manager
    BleManager.start({showAlert: false});

    // Verifique se o Bluetooth está conectado
    BleManager.getConnectedPeripherals([]).then(peripheralsArray => {
      console.log(peripheralsArray);
      if (peripheralsArray.length > 0) {
        setPeripherals(peripheralsArray);
        setIsConnected(true);
      } else {
        setIsConnected(false);
      }
    });

    // Listener para a notificação
    const handleUpdateValue = data => {
      console.log(
        'Received data from',
        data.peripheral,
        ' characteristic ',
        data.characteristic,
        ' with data ',
        data.value,
      );
      setDataReceived(data.value);
    };

    DeviceEventEmitter.addListener(
      'BleManagerDidUpdateValueForCharacteristic',
      handleUpdateValue,
    );

    return () => {
      DeviceEventEmitter.removeAllListeners(
        'BleManagerDidUpdateValueForCharacteristic',
      );
    };
  }, []);

  const startNotification = (peripheralId, serviceUUID, characteristicUUID) => {
    BleManager.startNotification(peripheralId, serviceUUID, characteristicUUID)
      .then(() => {
        console.log('Notification started');
      })
      .catch(error => {
        console.log('Notification error', error);
      });
  };

  useEffect(() => {
    if (peripherals.length > 0)
      startNotification(
        peripherals[0].id,
        '0000ffe0-0000-1000-8000-00805f9b34fb',
        '0000ffe1-0000-1000-8000-00805f9b34fb',
      );
  }, [peripherals]);

  return {
    isConnected,
    dataReceived,
    startNotification,
  };
};

export default useBluetoothManager;
