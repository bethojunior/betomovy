import {useCallback, useEffect, useRef, useState} from 'react';
import {Animated, NativeModules, View} from 'react-native';
import {
  DateButton,
  DateContainer,
  HourButton,
  HourContainer,
  SchedulerContainer,
  InputLabel,
  TextValue,
} from './styles';
import {Calendar} from '../../modules/GetLight/components/Calendar';
import {MaterialIcons} from '@expo/vector-icons';
import {translate} from '../../locales';
import ModalFrame from '../form/Modal';
import { TimePicker } from '../../../utils/TimePicker';
import AsyncStorage from '@react-native-async-storage/async-storage';

interface HourProps {
  hour: string,
  hourFinal: string,
}

interface Props {
  setModal: (value: boolean) => void;
  date: string;
  setDate: (value: string) => void;
  setHour: (value: HourProps) => void;
  visible: boolean;
  setTypeTrip: (value: string) => void;
}

export function ModalSchedule({
  setModal,
  date,
  setDate,
  setHour,
  visible,
  setTypeTrip,
}: Props) {
  const [isExecuted, setIsExecuted] = useState(false);
  const [isPickerVisible, setPickerVisible] = useState(false);
  const [selectedTime, setSelectedTime] = useState('');
  const [language, setLanguage] = useState<string>()

  const translateY = useRef(new Animated.Value(0)).current;
  const opacity = useRef(new Animated.Value(0)).current; 

  const handleConfirmDate = useCallback(() => {
    setTypeTrip('tripSchedule');
    setModal(false);
  }, []);

  const cancel = () => {
    setModal(false)
    setTypeTrip('');
  }

  useEffect(() => {
    (async() => {
      setLanguage(await AsyncStorage.getItem('@language'))
    })
  },[])

  const formatDate = (date: string) => {
    return new Date(date).toLocaleString(
      language?.replace('_', '-'),
      {
        weekday: 'short',
        day: '2-digit',
        month: 'short',
        year: '2-digit',
        timeZone: 'UTC'
      },
    );
  };

  const handlePress = () => {
    if (isExecuted) {
      requestAnimationFrame(() => {
      Animated.parallel([
        Animated.timing(opacity, {
          toValue: 0, 
          duration: 200, 
          useNativeDriver: true,
        }),
        Animated.timing(translateY, {
          toValue: -100, 
          duration: 200, 
          useNativeDriver: true,
        }),
      ]).start(() => {
        setIsExecuted(false);
      });
    })
    } else {
      setIsExecuted(true);
      requestAnimationFrame(() => {
      Animated.parallel([
        Animated.timing(opacity, {
          toValue: 1, 
          duration: 200, 
          useNativeDriver: true,
        }),
        Animated.timing(translateY, {
          toValue: 0, 
          duration: 200, 
          useNativeDriver: true,
        }),
      ]).start();
    })
    }
  };

  const formatNumber = (num: number) => {
    return String(num).padStart(2, '0');
  };

  useEffect(() => {
    const now = new Date();
    const hoursAndMinutes = `${formatNumber(now.getHours())}:${formatNumber(
      now.getMinutes(),
    )}`;
    setSelectedTime(hoursAndMinutes);
    setHour({
      hour: selectedTime,
      hourFinal: '',
    });
  }, []);
  
  useEffect(() => {
    setHour({
      hour: selectedTime,
      hourFinal: '',
    });
  }, [selectedTime])


  return (
    <ModalFrame
      setVisible={setModal}
      onClose={cancel}
      visible={visible}
      onPressConfirm={handleConfirmDate}
    >
      <SchedulerContainer>
        <DateContainer>
          <DateButton onPress={handlePress}>
            <InputLabel>{translate('schedule.date')}</InputLabel>
            <TextValue>{formatDate(date)}</TextValue>
            <MaterialIcons name="keyboard-arrow-down" size={16} color="black" />
          </DateButton>
        </DateContainer>
        <HourContainer>
          <HourButton onPress={() => setPickerVisible(true)}>
            <InputLabel>{translate('schedule.time')}</InputLabel>
            <View>
              <TimePicker 
                isPickerVisible={isPickerVisible}
                setPickerVisible={setPickerVisible}
                selectedTime={selectedTime}
                setSelectedTime={setSelectedTime}
              />
            </View>
            <MaterialIcons name="keyboard-arrow-down" size={16} color="black" />
          </HourButton>
        </HourContainer>
      </SchedulerContainer>
      {
        !isExecuted ? '' : 
        <Animated.View
          style={[
            {
              transform: [{ translateY }],
              opacity: opacity
            },
          ]}
        >
          <Calendar
            dateSelected={date}
            onDaySelected={day => {
              setDate(day);
              setTimeout(() => {
                handlePress()
              }, 500)
            }}
            onMinToday
          />
        </Animated.View>
      }
    </ModalFrame>
  );
}