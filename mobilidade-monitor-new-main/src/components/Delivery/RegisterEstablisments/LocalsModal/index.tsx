import { Button, Divider, Modal, Select, Switch } from "antd";
import { LocalsModalProps } from "./types";
import { FaTrashAlt } from "react-icons/fa";
import { LocalsContainer, ScrollContainer } from "./styles";
import { useDebounce } from "../../../../hooks/useDebounce";
import { AxiosError } from "axios";
import { useEffect, useState } from "react";
import apiApp from "../../../../services/apiApp";
import { theme_colors } from "../../../../theme/theme";

const LocalsModal = ({
  listLocals,
  visibility,
  onCancel,
  updatePrimaryLocal,
  deleteLocal,
  loadingText,
  setLoadingText,
  setPlaceSelected,
  addLocal,
  setIsDefault,
}: LocalsModalProps) => {
  const [listPlaces, setListPlaces] = useState([]);
  const [selectLocal, setSelectLocal] = useState("");
  const getPlaces = async (inputValue: string) => {
    try {
      setLoadingText("Procurando...");
      const result = await apiApp.get(
        `Place/Search?q=${inputValue}&latlng=-3.7898543408,-38.518872265300004`
      );
      const { data } = result;
      if (data.status) {
        const responseFilterFormated = data.data.map((result: any) => ({
          value: JSON.stringify(result),
          label: result.address,
        }));

        setListPlaces(responseFilterFormated);
      }
    } catch (error) {
      const axiosError = error as AxiosError;
      setLoadingText("Erro ao buscar");
      console.error(axiosError);
    }
  };

  const getLocal = async () => {
    const place = selectLocal ? JSON.parse(selectLocal) : "";
    if (place.length == 0) return;
    try {
      const result = await apiApp.get(
        `Geocoding/search?address=${place.address}`
      );
      const { data } = result;

      setPlaceSelected(data.data);
    } catch (error) {
      const axiosError = error as AxiosError;
      console.error(axiosError);
    }
  };

  useEffect(() => {
    getLocal();
  }, [selectLocal]);

  const loadOptions = useDebounce((inputValue: string) => {
    getPlaces(inputValue);
  }, 500);

  const onSearch = (userSearch: string) => {
    loadOptions(userSearch);
  };

  const filterOption = (
    input: string,
    option?: { label: string; value: number }
  ) => (option?.label ?? "").toLowerCase().includes(input.toLowerCase());

  return (
    <Modal
      title="Locais"
      open={visibility}
      onCancel={onCancel}
      destroyOnClose
      footer={[
        <Button key={0} onClick={onCancel}>
          Fechar
        </Button>,
        <Button type="primary" key={1} onClick={addLocal}>
          Adicionar
        </Button>,
      ]}
    >
      <ScrollContainer>
        {listLocals.map((item) => (
          <LocalsContainer isDefault={item.isDefault} key={item.id}>
            <div
              onClick={() =>
                !item.isDefault
                  ? updatePrimaryLocal(item.id, item.companyId)
                  : false
              }
              style={{
                width: "90%",
                cursor: !item.isDefault ? "pointer" : "",
              }}
            >
              {item.address}
            </div>
            <div
              style={{
                width: "10%",
                display: "flex",
                justifyContent: "center",
              }}
            >
              <FaTrashAlt
                onClick={() => deleteLocal(item.id, item.companyId)}
                style={{
                  color: theme_colors.red_crismon,
                  fontSize: 20,
                  cursor: "pointer",
                }}
              />
            </div>
          </LocalsContainer>
        ))}
      </ScrollContainer>
      <Divider />
      <div>
        <p>Pesquise o local</p>
        <Select
          style={{
            width: "100%",
            marginBottom: 20,
          }}
          allowClear
          showSearch
          placeholder="Selecione um lugar"
          optionFilterProp="children"
          onChange={(e) => setSelectLocal(e)}
          onSearch={onSearch}
          options={listPlaces}
          filterOption={filterOption}
          notFoundContent={loadingText}
        />
        <Switch onChange={(e) => setIsDefault(e)} /> <span>Principal</span>
      </div>
    </Modal>
  );
};

export default LocalsModal;
