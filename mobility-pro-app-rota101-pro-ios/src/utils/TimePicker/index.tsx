import { useEffect, useRef, useState } from 'react';
import { View, Button, TextInput, Modal, ScrollView, StyleSheet, TouchableOpacity, Text, TouchableWithoutFeedback } from 'react-native';
import { translate } from '../../client/locales';
import theme from '../../client/styles/theme';
import { RFValue } from 'react-native-responsive-fontsize';

interface TimePickerProps {
  isPickerVisible: boolean;
  setPickerVisible: (value: boolean) => void;
  selectedTime: string;
  setSelectedTime: (Value: string) => void
}

export function TimePicker ({
  isPickerVisible,
  setPickerVisible,
  selectedTime,
  setSelectedTime
}: TimePickerProps) {
  const [selectedHour, setSelectedHour] = useState(0);
  const [selectedMinute, setSelectedMinute] = useState(0);

  const hourScrollViewRef = useRef(null);
  const minuteScrollViewRef = useRef(null);
  const itemRef = useRef(null);

  const hideTimePicker = () => {
    setPickerVisible(false);
  };

  const setHourAndMinute = () => {
    const hourAndMinute = selectedTime.split(':')
    setSelectedHour(Number(hourAndMinute[0]))
    setSelectedMinute(Number(hourAndMinute[1]))
  }

  useEffect(() => {
    setHourAndMinute()
  }, [])

  const handleTimeChange = () => {
    const formattedTime = `${selectedHour.toString().padStart(2, '0')}:${selectedMinute.toString().padStart(2, '0')}`;
    setSelectedTime(formattedTime);
    hideTimePicker();
  };

  const scrollToSelected = () => {
    if (itemRef.current) {
      itemRef.current.measure((_, __, width, height) => {
        hourScrollViewRef.current.scrollTo({ y: selectedHour * height, animated: true });
        minuteScrollViewRef.current.scrollTo({ y: selectedMinute * height, animated: true });
      });
    }
  };


  const renderTimeItem = (time: number, type: string) => {
    const isSelected = type === 'hour' ? time === selectedHour : time === selectedMinute;

    return (
      <TouchableOpacity
        key={time}
        ref={itemRef}
        style={[styles.pickerItem, isSelected && {backgroundColor: `${theme.colors.primary}`}]}
        onLayout={scrollToSelected}
        onPress={() => type === 'hour' ? setSelectedHour(time) : setSelectedMinute(time)}
      >
        <Text style={[styles.pickerItemText, {color: `${theme.colors.secondary}`}, isSelected && styles.selectedPickerItemText]}>
          {time.toString().padStart(2, '0')}
        </Text>
      </TouchableOpacity>
    );
  };

  const capitalize = (str: string) => {
    return str.charAt(0).toUpperCase() + str.substring(1)
  }

  return (
    <View style={styles.container}>
      <TextInput
        value={selectedTime}
        editable={false}
        style={{color: `${theme.colors.secondary}`, fontSize: 18}}
      />
      <Modal visible={isPickerVisible} animationType="slide" transparent={true}>
        <TouchableWithoutFeedback onPress={handleTimeChange}>
          <View style={styles.modalContainer}>
            <View style={styles.pickerContainer}>
              <View style={[styles.pickerSection, {backgroundColor: `${theme.colors.background_global}`}]}>
                <View style={styles.pickerColumn}>
                  <Text style={[styles.pickerHeaderText, {color: `${theme.colors.secondary}`}]}>{capitalize(translate('pageRoutes.text_hour'))}</Text>
                  <ScrollView
                    ref={hourScrollViewRef}
                    contentContainerStyle={styles.pickerSectionContent}
                  >
                    {[...Array(24).keys()].map((hour) => renderTimeItem(hour, 'hour'))}
                  </ScrollView>
                </View>
                <View style={styles.pickerColumn}>
                  <Text style={[styles.pickerHeaderText, {color: `${theme.colors.secondary}`}]}>{capitalize(translate('pageRoutes.text_min'))}</Text>
                  <ScrollView
                    ref={minuteScrollViewRef}
                    contentContainerStyle={styles.pickerSectionContent}
                  >
                    {[...Array(60).keys()].map((minute) => renderTimeItem(minute, 'minute'))}
                  </ScrollView>
                </View>
              </View>
              <TouchableOpacity style={[styles.buttonConfirm, {backgroundColor: `${theme.colors.primary}`}]} onPress={handleTimeChange}>
                <Text style={[styles.textConfirm, {color: `${theme.colors.secondary}`}]}>
                  {translate('buttonModal.confirm')}
                </Text>
              </TouchableOpacity>
            </View>
          </View>
        </TouchableWithoutFeedback>
      </Modal>
    </View>
  );
};


const styles = StyleSheet.create({
  container: {
    flex: 1,
    justifyContent: 'center',
    alignItems: 'center',
  },
  modalContainer: {
    flex: 1,
    justifyContent: 'flex-end',
    backgroundColor: theme.colors.background_black_light,
  },
  pickerContainer: {
    position: 'absolute',
    right: 0,
    left: 0,
    bottom: 0
  },
  pickerSection: {
    flexDirection: 'row',
    borderTopLeftRadius: 15,
    borderTopRightRadius: 15,
    maxHeight: RFValue(300),
  },
  pickerColumn: {
    flex: 1,
  },
  pickerSectionContent: {
    flexGrow: 1,
    justifyContent: 'center',
  },
  pickerHeaderText: {
    fontSize: 16,
    fontWeight: 'bold',
    marginBottom: 10,
    textAlign: 'center',
  },
  pickerItem: {
    paddingVertical: 8,
    paddingHorizontal: 16,
  },
  pickerItemText: {
    fontSize: 18,
    textAlign: 'center',
  },
  selectedPickerItemText: {
    fontWeight: 'bold',
  },
  buttonConfirm: {
    padding: 5,
  },
  textConfirm: {
    textAlign: 'center',
    fontSize: 18,
      color: `${theme.colors.primaryText}`
  },
});