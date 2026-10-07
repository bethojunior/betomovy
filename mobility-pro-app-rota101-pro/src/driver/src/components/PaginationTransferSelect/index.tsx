import {Picker} from '@react-native-picker/picker';
import {useTheme} from 'styled-components';
import {DataTable} from 'react-native-paper';
import {translate} from '../../../../client/locales';
import {ContainerFooter} from './styles';

interface Props {
  selectedValue: string;
  setSelectedValue: (value: string) => void;
  page: number;
  dataPage: any;
  setPage: (value: number) => void;
  colorPages?: string;
}

export function PaginationTransferSelect({
  selectedValue,
  setSelectedValue,
  page,
  dataPage,
  setPage,
  colorPages
}: Props) {
  const theme = useTheme();
  const changeSelectedValue = (value: string) => {
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
          <Picker.Item
            label={translate('pagination_transfer.not_filter')}
            value=""
          />
          <Picker.Item
            label={translate('pagination_transfer.outings')}
            value="saida"
          />
          <Picker.Item
            label={translate('pagination_transfer.entries')}
            value="entrada"
          />
        </Picker>

        <DataTable.Pagination
          page={page}
          style={{
            backgroundColor: colorPages ? colorPages : theme.colors.grayLight,
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