import {Picker} from '@react-native-picker/picker';
import React from 'react';
import {DataTable} from 'react-native-paper';
import {translate} from '../../locales';
import theme from '../../styles/theme';
import {ContainerFooter} from './styles';

interface Props {
  selectedValue: any;
  setSelectedValue: any;
  page: number;
  dataPage: any;
  setPage: (value: number) => void;
  background?: string;
  color?: string;
}

export function PaginationSelect({
  selectedValue,
  setSelectedValue,
  page,
  dataPage,
  setPage,
  background,
  color
}: Props) {
  const changeSelectedValue = (value: any) => {
    setSelectedValue(value);
    setPage(1);
  };
  return (
    <DataTable>
      <ContainerFooter>
        <Picker
          selectedValue={selectedValue}
          onValueChange={itemValue => changeSelectedValue(itemValue)}
          style={{
            width: '50%',
            position: 'absolute',
            left: 0,
          }}
        >
          <Picker.Item color={theme.colors.secondary} label={translate('service.all')} value />
          <Picker.Item
            label={translate('service.scheduled')}
            value="scheduled"
          />
          <Picker.Item label={translate('service.cancel')} value="canceled" />
          <Picker.Item label={translate('service.finished')} value="finished" />
        </Picker>

        <DataTable.Pagination
          page={page}
          numberOfPages={dataPage.lastPage + 1}
          onPageChange={pageValue => setPage(pageValue !== 0 ? pageValue : 1)}
          label={`${dataPage.currentPage ?? ''} - ${dataPage.lastPage ?? ''}`}
          style={{
            backgroundColor: background ? background : theme.colors.grayLight,
            width: '50%',
            borderRadius: 10
          }}
        />
      </ContainerFooter>
    </DataTable>
  );
}
