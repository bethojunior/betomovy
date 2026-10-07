import {Picker} from '@react-native-picker/picker';
import React from 'react';
import {View} from 'react-native';
import {DataTable} from 'react-native-paper';
import {TextEdit} from '../../../../components/TextEdit';
import {translate} from '../../../../locales';
import theme from '../../../../styles/theme';
import {ContainerFooter} from '../../pages/Services/styles';

interface Props {
  selectedValue: any;
  setSelectedValue: any;
  page: number;
  dataPage: any;
  setPage: (value: number) => void;
}

export function PaginationSelect({
  selectedValue,
  setSelectedValue,
  page,
  dataPage,
  setPage,
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
            borderRadius: 50,
          }}
          mode="dropdown"
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
          style={{
            backgroundColor: theme.colors.grayLight,
            width: '50%',
            borderRadius: 10,
          }}
          numberOfPages={dataPage.lastPage + 1}
          onPageChange={pageValue => setPage(pageValue !== 0 ? pageValue : 1)}
          label={`${dataPage.currentPage ?? ''} - ${dataPage.lastPage ?? ''}`}
        />
      </ContainerFooter>
    </DataTable>
  );
}
