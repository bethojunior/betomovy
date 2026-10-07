import { useState } from 'react';
import { FontAwesome5 } from '@expo/vector-icons';
import { RFValue } from 'react-native-responsive-fontsize';
import { useTheme } from 'styled-components/native';

import { BottomSheetModal } from '../BottomSheetModal';
import { SheetHeader } from '../SheetHeader';
import { FilterFooterProps } from './types';
import {
  Container,
  FilterButton,
  FilterButtonText,
  PaginationButton,
  PaginationLabel,
  PaginationRow,
} from './styles';

export function FilterFooter({
  filterButtonLabel,
  filterTitle,
  paginationSeparator = '/',
  page,
  dataPage,
  setPage,
  renderFilterContent,
}: FilterFooterProps) {
  const theme = useTheme();
  const [showFilter, setShowFilter] = useState(false);

  const lastPage = dataPage.lastPage ?? 1;
  const closeFilter = () => setShowFilter(false);

  return (
    <>
      <Container>
        <FilterButton activeOpacity={0.8} onPress={() => setShowFilter(true)}>
          <FontAwesome5 name="filter" size={RFValue(12)} color={theme.colors.secondary} />
          <FilterButtonText>{filterButtonLabel}</FilterButtonText>
        </FilterButton>

        <PaginationRow>
          <PaginationButton
            disabled={page <= 1}
            activeOpacity={0.7}
            hitSlop={{ top: 8, bottom: 8, left: 8, right: 8 }}
            onPress={() => setPage(Math.max(1, page - 1))}
          >
            <FontAwesome5 name="chevron-left" size={RFValue(11)} color={theme.colors.secondary} />
          </PaginationButton>

          <PaginationLabel>
            {dataPage.currentPage ?? page} {paginationSeparator} {lastPage}
          </PaginationLabel>

          <PaginationButton
            disabled={page >= lastPage}
            activeOpacity={0.7}
            hitSlop={{ top: 8, bottom: 8, left: 8, right: 8 }}
            onPress={() => setPage(Math.min(lastPage, page + 1))}
          >
            <FontAwesome5 name="chevron-right" size={RFValue(11)} color={theme.colors.secondary} />
          </PaginationButton>
        </PaginationRow>
      </Container>

      <BottomSheetModal visible={showFilter} onRequestClose={closeFilter}>
        <SheetHeader title={filterTitle} onClose={closeFilter} />

        {renderFilterContent(closeFilter)}
      </BottomSheetModal>
    </>
  );
}
