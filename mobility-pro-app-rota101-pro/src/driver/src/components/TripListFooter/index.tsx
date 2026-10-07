import { FilterFooter } from '../../../../client/components/FilterFooter';
import { translate } from '../../../../client/locales';
import { FilterOption, TripListFooterProps } from './types';
import {
  FilterOptionLabel,
  FilterOptionRadio,
  FilterOptionRadioDot,
  FilterOptionRow,
  FilterOptionsList,
} from '../../../../client/components/FilterFooter/styles';

const FILTER_OPTIONS: FilterOption[] = [
  { label: translate('service.all'), value: null },
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
  return (
    <FilterFooter
      page={page}
      dataPage={dataPage}
      setPage={setPage}
      filterButtonLabel={translate('search.text_filter')}
      filterTitle={translate('search.text_filter')}
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
