import {useEffect, useState} from 'react';
import {Feather} from '@expo/vector-icons';
import {useTheme} from 'styled-components';
import {Calendar as CustomCalendar, LocaleConfig} from 'react-native-calendars';
import {View} from 'react-native';
import {ptBR, enUS, esES, frFR} from './localeConfig';
import I18n from '../../../../client/locales';
import {convertUSDate} from '../../utils/FormatDate';

interface CalendarProps {
  dateSelected: string;
  onDaySelected: (day: string) => void;
  onMinToday?: boolean;
}

export function Calendar({
  dateSelected,
  onDaySelected,
  onMinToday,
}: CalendarProps) {
  const theme = useTheme();
  const [selectedDate, setSelectedDate] = useState({});

  LocaleConfig.locales['pt-br'] = ptBR;
  LocaleConfig.locales['en-us'] = enUS;
  LocaleConfig.locales['es-es'] = esES;
  LocaleConfig.locales['fr-fr'] = frFR;

  const vefifyLocale = () => {
    console.log(I18n.locale);
    if (I18n.locale === 'pt_BR') {
      console.log('oi1');
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
    <View style={{backgroundColor: theme.colors.background_global}}>
      <CustomCalendar
        onDayPress={day => {
          if (onDaySelected) onDaySelected(day.dateString);
          onDayPress(day);
        }}
        style={{paddingTop: 7}}
        renderArrow={direction => (
          <Feather
            size={24}
            color={theme.colors.primary}
            name={direction === 'left' ? 'chevron-left' : 'chevron-right'}
          />
        )}
        headerStyle={{
          backgroundColor: theme.colors.background_global,
          borderBottomWidth: 1,
          borderBottomColor: theme.colors.primary,
          paddingBottom: 12,
          marginBottom: 12,
        }}
        theme={{
          calendarBackground: theme.colors.background_global,
          textSectionTitleColor: theme.colors.grayLight,
          selectedDayTextColor: theme.colors.background_white_light,
          todayTextColor: theme.colors.primary,
          textDayFontFamily: theme.fonts.regular,
          textDayHeaderFontFamily: theme.fonts.bold,
          textDayHeaderFontSize: 12,
          dayTextColor: theme.colors.secondary,
          textDisabledColor: theme.colors.text_gray,
          textMonthFontFamily: theme.fonts.bold,
          textMonthFontSize: 20,
          monthTextColor: theme.colors.secondary,
          arrowStyle: {
            marginHorizontal: -12,
          },
        }}
        firstDay={1}
        current={dateSelected}
        maxDate={
          onMinToday
            ? convertUSDate(
                new Date(new Date().setDate(new Date().getDate() + 41)),
              )
            : convertUSDate(new Date())
        }
        minDate={
          onMinToday
            ? convertUSDate(
                new Date(new Date().setDate(new Date().getDate() + 31)),
              )
            : undefined
        }
        markedDates={selectedDate}
        markingType="multi-dot"
      />
    </View>
  );
}
