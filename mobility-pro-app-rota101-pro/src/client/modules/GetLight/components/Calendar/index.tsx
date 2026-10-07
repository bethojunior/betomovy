import {useEffect, useState} from 'react';
import {Feather} from '@expo/vector-icons';
import {useTheme} from 'styled-components';
import {Calendar as CustomCalendar, LocaleConfig} from 'react-native-calendars';
import {View} from 'react-native';
import {enUS, esES, frFR, ptBR} from './localeConfig';
import I18n from '../../../../locales';
import {convertUSDate} from '../../../../utils/FormatDate';

export function Calendar({dateSelected, onDaySelected, onMinToday}) {
  const [selectedDate, setSelectedDate] = useState({});
  const theme = useTheme();

  LocaleConfig.locales['pt-br'] = ptBR;
  LocaleConfig.locales['en-us'] = enUS;
  LocaleConfig.locales['es-es'] = esES;
  LocaleConfig.locales['fr-fr'] = frFR;

  const vefifyLocale = () => {
    if (I18n.locale === 'pt_BR') {
      LocaleConfig.defaultLocale = 'pt-br';
    } else if (I18n.defaultLocale === 'en_US') {
      LocaleConfig.defaultLocale = 'en-us';
    } else if (I18n.locale === 'es_US') {
      LocaleConfig.defaultLocale = 'es-es';
    } else if (I18n.locale === 'fr_FR') {
      LocaleConfig.defaultLocale = 'fr-fr';
    }
  };

  useEffect(() => {
    vefifyLocale();
  }, [I18n.locale, I18n.defaultLocale]);

  useEffect(() => {
    if (dateSelected) {
      const data = {};
      data[dateSelected] = {
        selected: true,
        selectedColor: theme.colors.primary,
      };
      setSelectedDate(data);
    }
  }, []);

  const onDayPress = day => {
    const data = {};
    data[day.dateString] = {
      selected: true,
      selectedColor: theme.colors.primary,
    };
    setSelectedDate(data);
  };

  return (
    <View
      style={{
        backgroundColor: theme.colors.background_global,
        width: '100%',
      }}
    >
      <CustomCalendar
        onDayPress={day => {
          if (onDaySelected) onDaySelected(day.dateString);
          onDayPress(day);
        }}
        renderArrow={direction => (
          <Feather
            size={24}
            color={theme.colors.grayLight}
            name={direction === 'left' ? 'chevron-left' : 'chevron-right'}
          />
        )}
        headerStyle={{
          backgroundColor: theme.colors.background_global,
        }}
        theme={{
          calendarBackground: theme.colors.background_global,
          textSectionTitleColor: theme.colors.grayLight,
          selectedDayTextColor: theme.colors.background_white_light,
          todayTextColor: theme.colors.primary,
          textDayHeaderFontSize: 12,
          dayTextColor: theme.colors.secondary,
          textDisabledColor: '#2d4150',
          textMonthFontSize: 20,
          monthTextColor: theme.colors.secondary,
        }}
        firstDay={1}
        current={dateSelected}
        minDate={convertUSDate(new Date())}
        markedDates={selectedDate}
        markingType="multi-dot"
      />
    </View>
  );
}
