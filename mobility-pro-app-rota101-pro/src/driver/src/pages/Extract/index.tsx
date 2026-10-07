import { useEffect, useState } from 'react';
import { RFValue } from 'react-native-responsive-fontsize';
import { useTheme } from 'styled-components/native';
import Fontisto from '@expo/vector-icons/Fontisto';
import { subDays } from 'date-fns';

import { TransactionList } from '../../components/TransactionList';
import { FilterFooter } from '../../../../client/components/FilterFooter';
import {
  FilterOptionLabel,
  FilterOptionRadio,
  FilterOptionRadioDot,
  FilterOptionRow,
  FilterOptionsList,
} from '../../../../client/components/FilterFooter/styles';
import { BottomSheetModal } from '../../../../client/components/BottomSheetModal';
import { SheetHeader } from '../../../../client/components/SheetHeader';
import Preload from '../../components/Preload';
import { useBank } from '../../context/bank';
import { DriverInfoProps, Pagination } from '../../context/bank/types';
import { SummaryCarousel } from './components/SummaryCarousel';

import {
  CalendarSheetContent,
  Card,
  Container,
  DateButton,
  DateButtonText,
  DateRow,
  DaysChip,
  DaysChipRow,
  DaysChipText,
  EmptyText,
  MovementsTitle,
  PeriodLabel,
} from './styles';
import { convertDate, convertUSDate } from '../../utils/FormatDate';
import { Calendar } from '../../components/Calendar';
import { translate } from '../../../../client/locales';
import { customToast } from '../../../../utils/FlashMessage';

const FLOW_OPTIONS = [
  { label: translate('pagination_transfer.not_filter'), value: '' },
  { label: translate('pagination_transfer.entries'), value: 'entrada' },
  { label: translate('pagination_transfer.outings'), value: 'saida' },
];

const DAY_PRESETS = [7, 15, 30];

type DateField = 'start' | 'end' | null;

export function Extract() {
  const { getTransactions } = useBank();
  const { colors } = useTheme();
  const [transactions, setLastTransactions] = useState([]);
  const [balance, setBalance] = useState({} as DriverInfoProps);
  const [page, setPage] = useState(1);
  const [selectedValue, setSelectedValue] = useState('');
  const [dataPage, setDataPage] = useState<Pagination>({} as Pagination);
  const [loading, setLoading] = useState(true);
  const [endDate, setEndDate] = useState(convertUSDate(new Date()));
  const [startDate, setStartDate] = useState(
    convertUSDate(subDays(Date.now(), 30)),
  );
  const [activeDays, setActiveDays] = useState<number | null>(30);
  const [activeDateField, setActiveDateField] = useState<DateField>(null);

  const getTransactionsAsync = async () => {
    setLoading(true);
    const response = await getTransactions(
      page,
      selectedValue,
      startDate,
      endDate,
    );

    if (!response) {
      setLoading(false);
      return;
    }

    setLastTransactions(response.transactions);
    setDataPage(response.paginate);
    setBalance(response.driverInfo);

    setLoading(false);
  };

  const closeDateSheet = () => setActiveDateField(null);

  function handleDateSelect(day: string) {
    if (new Date(day).getTime() > new Date(endDate).getTime()) {
      customToast(translate('driver_extract.alert_invalid_date'), 'danger');
      return false;
    }

    if (
      (new Date(endDate).getTime() - new Date(day).getTime()) /
      (1000 * 60 * 60 * 24) >
      60
    ) {
      setStartDate(endDate);
      customToast(translate('driver_extract.alert_invalid_range'), 'danger');
      return false;
    }

    setActiveDays(null);
    setStartDate(day);
    setPage(1);
    closeDateSheet();

    return true;
  }

  function handleDateSelectEnd(day: string) {
    if (new Date(day).getTime() < new Date(startDate).getTime()) {
      customToast(translate('driver_extract.alert_invalid_date'), 'danger');
      return false;
    }

    if (
      (new Date(day).getTime() - new Date(startDate).getTime()) /
      (1000 * 60 * 60 * 24) >
      60
    ) {
      customToast(translate('driver_extract.alert_invalid_range'), 'danger');
      return false;
    }

    setActiveDays(null);
    setEndDate(day);
    setPage(1);
    closeDateSheet();

    return true;
  }

  const handleDaySelected = (day: string) => {
    if (activeDateField === 'start') {
      handleDateSelect(day);
      return;
    }
    handleDateSelectEnd(day);
  };

  const handleDays = (days: number) => {
    setActiveDays(days);
    setStartDate(convertUSDate(subDays(Date.now(), days)));
    setEndDate(convertUSDate(new Date()));
    setPage(1);
  };

  useEffect(() => {
    getTransactionsAsync();
  }, [page, selectedValue, startDate, endDate]);

  const selectedFlowOption = FLOW_OPTIONS.find((option) => option.value === selectedValue);
  const filterButtonLabel =
    selectedFlowOption && selectedValue !== '' ? selectedFlowOption.label : translate('driver_extract.filter');

  return (
    <Container>
      <Preload visible={loading} />

      <SummaryCarousel
        totalCredit={parseFloat(balance?.total_credit || '0')}
        totalDebit={parseFloat(balance?.total_debit || '0')}
      />

      <Card>
        <PeriodLabel>{translate('driver_extract.select_preiod')}</PeriodLabel>

        <DateRow>
          <DateButton activeOpacity={0.7} onPress={() => setActiveDateField('start')}>
            <Fontisto name="calendar" size={RFValue(12)} color={colors.secondary} />
            <DateButtonText>{convertDate(startDate)}</DateButtonText>
          </DateButton>

          <Fontisto name="arrow-right-l" size={RFValue(12)} color={colors.text_gray} />

          <DateButton activeOpacity={0.7} onPress={() => setActiveDateField('end')}>
            <Fontisto name="calendar" size={RFValue(12)} color={colors.secondary} />
            <DateButtonText>{convertDate(endDate)}</DateButtonText>
          </DateButton>
        </DateRow>

        <DaysChipRow>
          {DAY_PRESETS.map((days) => (
            <DaysChip key={days} active={activeDays === days} activeOpacity={0.7} onPress={() => handleDays(days)}>
              <DaysChipText active={activeDays === days}>
                {days} {translate('driver_extract.days')}
              </DaysChipText>
            </DaysChip>
          ))}
        </DaysChipRow>
      </Card>

      <MovementsTitle>{translate('driver_extract.latest_movements')}</MovementsTitle>

      {transactions.length === 0 && !loading ? (
        <EmptyText>{translate('account.not_movement')}</EmptyText>
      ) : (
        <TransactionList transactions={transactions} />
      )}

      <FilterFooter
        page={page}
        dataPage={dataPage}
        setPage={setPage}
        filterButtonLabel={filterButtonLabel}
        filterTitle={translate('driver_extract.filter')}
        renderFilterContent={(close) => (
          <FilterOptionsList>
            {FLOW_OPTIONS.map((option) => {
              const isSelected = selectedValue === option.value;

              return (
                <FilterOptionRow
                  key={option.value}
                  selected={isSelected}
                  activeOpacity={0.7}
                  onPress={() => {
                    setSelectedValue(option.value);
                    setPage(1);
                    close();
                  }}
                >
                  <FilterOptionRadio selected={isSelected}>
                    {isSelected && <FilterOptionRadioDot />}
                  </FilterOptionRadio>
                  <FilterOptionLabel selected={isSelected}>{option.label}</FilterOptionLabel>
                </FilterOptionRow>
              );
            })}
          </FilterOptionsList>
        )}
      />

      <BottomSheetModal visible={activeDateField !== null} onRequestClose={closeDateSheet}>
        <SheetHeader
          title={translate(activeDateField === 'end' ? 'driver_extract.end_date' : 'driver_extract.start_date')}
          onClose={closeDateSheet}
        />

        <CalendarSheetContent>
          <Calendar
            dateSelected={activeDateField === 'end' ? endDate : startDate}
            onDaySelected={handleDaySelected}
          />
        </CalendarSheetContent>
      </BottomSheetModal>
    </Container>
  );
}
