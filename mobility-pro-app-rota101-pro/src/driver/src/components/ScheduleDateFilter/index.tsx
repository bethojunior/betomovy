import { useState } from 'react';
import { RFValue } from 'react-native-responsive-fontsize';
import { useTheme } from 'styled-components/native';
import { Feather } from '@expo/vector-icons';
import { addDays } from 'date-fns';

import { BottomSheetModal } from '../../../../client/components/BottomSheetModal';
import { SheetHeader } from '../../../../client/components/SheetHeader';
import { Calendar } from '../Calendar';
import { convertDate, convertUSDate } from '../../utils/FormatDate';
import { translate } from '../../../../client/locales';
import { readableTextColor } from '~/utils/color';
import {
  Card,
  PeriodLabel,
  ChipRow,
  Chip,
  ChipText,
  DateRow,
  DateButton,
  DateButtonText,
  CalendarSheetContent,
} from './styles';

type DateField = 'start' | 'end' | null;

interface ScheduleDateFilterProps {
  startDate: string | null;
  endDate: string | null;
  onChange: (startDate: string | null, endDate: string | null) => void;
}

const today = () => convertUSDate(new Date());
const inDays = (days: number) => convertUSDate(addDays(new Date(), days));

const PERIOD_PRESETS = [
  { key: 'all', label: translate('schedule_filter.all') },
  { key: 'today', label: translate('schedule_filter.today') },
  { key: 'tomorrow', label: translate('schedule_filter.tomorrow') },
  { key: 'next7', label: translate('schedule_filter.next_7_days') },
];

function getPresetRange(key: string): [string, string] | [null, null] {
  switch (key) {
    case 'today':
      return [today(), today()];
    case 'tomorrow':
      return [inDays(1), inDays(1)];
    case 'next7':
      return [today(), inDays(7)];
    default:
      return [null, null];
  }
}

export function ScheduleDateFilter({
  startDate,
  endDate,
  onChange,
}: ScheduleDateFilterProps) {
  const { colors } = useTheme();
  const [activePreset, setActivePreset] = useState('all');
  const [activeDateField, setActiveDateField] = useState<DateField>(null);

  const isRangeActive = activePreset === 'custom';
  const dateIconColor = isRangeActive ? readableTextColor(colors.primary) : colors.secondary;

  const closeDateSheet = () => setActiveDateField(null);

  const handlePreset = (key: string) => {
    setActivePreset(key);
    const [start, end] = getPresetRange(key);
    onChange(start, end);
  };

  const handleDaySelected = (day: string) => {
    setActivePreset('custom');

    if (activeDateField === 'start') {
      onChange(day, endDate && endDate >= day ? endDate : day);
    } else {
      onChange(startDate && startDate <= day ? startDate : day, day);
    }

    closeDateSheet();
  };

  return (
    <Card>
      <DateRow>
        <DateButton active={isRangeActive} activeOpacity={0.6} onPress={() => setActiveDateField('start')}>
          <Feather name="calendar" size={RFValue(12)} color={dateIconColor} />
          <DateButtonText active={isRangeActive}>
            {startDate ? convertDate(startDate) : translate('schedule_filter.start_date')}
          </DateButtonText>
        </DateButton>

        <Feather name="arrow-right" size={RFValue(12)} color={colors.text_gray} />

        <DateButton active={isRangeActive} activeOpacity={0.6} onPress={() => setActiveDateField('end')}>
          <Feather name="calendar" size={RFValue(12)} color={dateIconColor} />
          <DateButtonText active={isRangeActive}>
            {endDate ? convertDate(endDate) : translate('schedule_filter.end_date')}
          </DateButtonText>
        </DateButton>
      </DateRow>

      <ChipRow>
        {PERIOD_PRESETS.map((preset) => (
          <Chip
            key={preset.key}
            active={activePreset === preset.key}
            activeOpacity={0.6}
            onPress={() => handlePreset(preset.key)}
          >
            <ChipText active={activePreset === preset.key}>{preset.label}</ChipText>
          </Chip>
        ))}
      </ChipRow>

      <BottomSheetModal
        visible={activeDateField !== null}
        onRequestClose={closeDateSheet}
      >
        <SheetHeader
          title={translate(
            activeDateField === 'end'
              ? 'schedule_filter.end_date'
              : 'schedule_filter.start_date',
          )}
          onClose={closeDateSheet}
        />

        <CalendarSheetContent>
          <Calendar
            dateSelected={(activeDateField === 'end' ? endDate : startDate) ?? today()}
            onDaySelected={handleDaySelected}
            allowFuture
          />
        </CalendarSheetContent>
      </BottomSheetModal>
    </Card>
  );
}
