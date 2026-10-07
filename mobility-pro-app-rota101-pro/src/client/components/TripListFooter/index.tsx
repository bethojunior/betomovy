import { FilterFooter } from '../FilterFooter';
import { translate } from '../../locales';
import { FilterOption, TripListFooterProps } from './types';
import {
  FilterOptionLabel,
  FilterOptionRadio,
  FilterOptionRadioDot,
  FilterOptionRow,
  FilterOptionsList,
} from '../FilterFooter/styles';

const FILTER_OPTIONS: FilterOption[] = [
  { label: translate('service.all'), value: true },
  { label: translate('service.scheduled'), value: 'scheduled' },
  { label: translate('service.cancel'), value: 'canceled' },
  { label: translate('service.finished'), value: 'finished' },
];

export function TripListFooter({
  selectedValue,
  setSelectedValue,
  page,
  dataPage,
  setPage,
}: TripListFooterProps) {
  const selectedOption = FILTER_OPTIONS.find((option) => option.value === selectedValue);
  const filterButtonLabel =
    selectedOption && selectedValue !== true ? selectedOption.label : translate('search.no_filter');

  return (
    <FilterFooter
      page={page}
      dataPage={dataPage}
      setPage={setPage}
      filterButtonLabel={filterButtonLabel}
      filterTitle={translate('search.text_filter')}
      paginationSeparator="-"
      renderFilterContent={(close) => (
        <FilterOptionsList>
          {FILTER_OPTIONS.map((option) => {
            const isSelected = selectedValue === option.value;

            return (
              <FilterOptionRow
                key={String(option.value)}
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
  );
}
