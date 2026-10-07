import { FC, useEffect, useState } from "react";
import { Checkbox, Select } from "antd";
import { useFullyContext } from "../../../hooks/useFullyContext";
import {
  AdvancedSearchBody,
  AdvancedFilterContainerFunction,
  AdvancedFilterName,
  AdvancedFilterDate,
  ItemsContainer,
  SelectCity,
  DoubleDate,
  AdvancedButtonContainer,
  AdvancedButton,
  AdvancedLabel,
  CheckBoxContainer,
} from "./styles";
import Utils from "../../../utils/Utils";

interface AdvancedfilterProps {
  cityIdValue: string;
  setFilterDateStartProps: (val: string) => void;
  setFilterDateEndProps: (val: string) => void;
  setCityIdProps: (res: string) => void;
  searchRequestProps: () => void;
  setSearchCheckBoxProps: (res: boolean) => void;
  onSearchClient: (data: string) => void;
  onChangeClient: (data: string) => void;
  nameClientsFiltered: DefaultOptionsSelectAntdProps[];
  onSearchDriver: (data: string) => void;
  onChangeDriver: (data: string) => void;
  nameDriversFiltered: DefaultOptionsSelectAntdProps[];
}

interface CitiesData {
  cityId: number;
  nome: string;
  polygon: string;
  shortName: string;
}

const SearchFilter: FC<AdvancedfilterProps> = ({
  cityIdValue,
  setFilterDateStartProps,
  setFilterDateEndProps,
  setCityIdProps,
  searchRequestProps,
  setSearchCheckBoxProps,
  onChangeClient,
  onSearchClient,
  nameClientsFiltered,
  onChangeDriver,
  onSearchDriver,
  nameDriversFiltered,
}) => {
  const dateFormatList = ["DD/MM/YYYY", "DD/MM/YY"];
  const { Option } = Select;
  const [cities, setCities] = useState<CitiesData[]>([]);
  const { fullyList } = useFullyContext();

  const datesValue = (_: any, dateStrings: [string, string]) => {
    const newDateStart = Utils.transformDate(dateStrings[0], false);
    const newDateEnd = Utils.transformDate(dateStrings[1], false);

    setFilterDateStartProps(newDateStart as string);
    setFilterDateEndProps(newDateEnd as string);
  };

  useEffect(() => {
    if (fullyList && fullyList.length > 0) {
      setCities(fullyList as CitiesData[]);
      if (fullyList.length === 1) {
        setCityIdProps(String(fullyList[0].cityId));
      }
    }
  }, [fullyList, setCityIdProps]);

  const filterOption = (
    input: string,
    option?: { label: string; value: string }
  ) => (option?.label ?? "").toLowerCase().includes(input.toLowerCase());

  const citySelectValue =
    cityIdValue !== ""
      ? cityIdValue
      : cities.length === 1
        ? String(cities[0].cityId)
        : undefined;

  return (
    <AdvancedSearchBody>
      <AdvancedFilterContainerFunction>
        <AdvancedFilterName>
          <AdvancedLabel>Cliente</AdvancedLabel>
          <Select
            style={{
              width: "100%",
            }}
            showSearch
            placeholder="Escolha um cliente"
            optionFilterProp="children"
            onChange={onChangeClient}
            onSearch={onSearchClient}
            filterOption={filterOption}
            options={nameClientsFiltered}
          />
        </AdvancedFilterName>
        <AdvancedFilterName>
          <AdvancedLabel>Motorista</AdvancedLabel>
          <Select
            style={{
              width: "100%",
            }}
            showSearch
            placeholder="Escolha um motorista"
            optionFilterProp="children"
            onChange={onChangeDriver}
            onSearch={onSearchDriver}
            filterOption={filterOption}
            options={nameDriversFiltered}
          />
        </AdvancedFilterName>
        <AdvancedFilterDate>
          <AdvancedLabel>Período</AdvancedLabel>
          <DoubleDate
            placeholder={["Data inicio", "Data fim"]}
            format={dateFormatList}
            onChange={datesValue}
          />
        </AdvancedFilterDate>
        <ItemsContainer>
          <AdvancedLabel>Cidade</AdvancedLabel>
          <SelectCity
            value={citySelectValue}
            onChange={(value) =>
              setCityIdProps(value === undefined ? "" : String(value))
            }
            placeholder="Todas"
            allowClear={cities.length > 1}
          >
            {cities.length > 1 ? (
              <Option value="">Todas</Option>
            ) : null}
            {cities.map((item) => {
              return (
                <Option key={item.cityId} value={String(item.cityId)}>
                  {item.nome}
                </Option>
              );
            })}
          </SelectCity>
        </ItemsContainer>
        <CheckBoxContainer>
          <Checkbox onChange={(e) => setSearchCheckBoxProps(e.target.checked)}>
            Removidas
          </Checkbox>
        </CheckBoxContainer>
        <AdvancedButtonContainer>
          <AdvancedButton onClick={searchRequestProps} type="primary">
            Filtrar
          </AdvancedButton>
        </AdvancedButtonContainer>
      </AdvancedFilterContainerFunction>
    </AdvancedSearchBody>
  );
};

export default SearchFilter;
