import { Select } from "antd";
import { FC, useEffect, useState } from "react";
import api from "../../../../services/api";
import { useDebounce } from "../../../../hooks/useDebounce";

interface ReportFilters {
  field: string;
  fieldType: string;
  id: number;
  name: string;
  path_url: string;
  reportId: number;
  required: boolean;
  statusId: number;
}

interface ListSelectProps {
  id: number;
  text: string;
}

interface SelectProps {
  item: ReportFilters;
}

interface SelectProps {
  item: ReportFilters;
  onChangeValue: (value: string | number, name: string) => void;
}

const Select2Input: FC<SelectProps> = ({ item, onChangeValue }) => {
  const [usersFiltered, setUsersFiltered] = useState<
    DefaultOptionsSelectAntdProps[]
  >([]);
  const [userSelected, setUserSelected] = useState<number | null>(null);

  const filter = async (inputValue: string) => {
    try {
      const responseFilter = await api.get(`${item.path_url}?q=${inputValue}`);

      if (responseFilter.status) {
        const responseFilterFormated = responseFilter.data.response.map(
          (result: ListSelectProps) => ({
            value: result.id,
            label: result.text,
          })
        );
        setUsersFiltered(responseFilterFormated);
      }
    } catch (error) {
      console.error(error);
    }
  };

  const loadOptions = useDebounce((inputValue: string) => {
    filter(inputValue);
  }, 1000);

  const onChange = (userSelected: string) => {
    setUserSelected(Number(userSelected));
  };

  const onSearch = (userSearch: string) => {
    loadOptions(userSearch);
  };

  const filterOption = (
    input: string,
    option?: { label: string; value: string }
  ) => (option?.label ?? "").toLowerCase().includes(input.toLowerCase());

  useEffect(() => {
    if (userSelected) onChangeValue(userSelected, item.field);
  }, [userSelected]);

  return (
    <div>
      <p style={{ marginBottom: 0, marginTop: 10 }}>{item.name}</p>
      <Select
        style={{
          width: "100%",
        }}
        showSearch
        placeholder="Selecione um usuário"
        optionFilterProp="children"
        onChange={onChange}
        onSearch={onSearch}
        filterOption={filterOption}
        options={usersFiltered}
      />
      {/* <AsyncSelect
				cacheOptions
				isClearable
				onChange={(e) => setValue((e as null | SelectResponseProps)?.value)}
				loadOptions={loadOptions}
				placeholder="Selecione um usuário"
				noOptionsMessage={() => 'Usuário não encontrado'}
				loadingMessage={() => 'Carregando...'}
			/> */}
    </div>
  );
};

export default Select2Input;
