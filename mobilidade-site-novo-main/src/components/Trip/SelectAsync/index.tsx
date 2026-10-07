import { Autocomplete, debounce } from "@mui/material";
import { useCallback, useState } from "react";
import api from "../../../api/apiAxios";
import { useAuthStore } from "../../../store/authStore";

export const SelectAsync = ({
  placeholder = "",
  getSelectedValue,
  value,
  setValue,
}: any) => {
  const [listPlaces, setListPlaces] = useState([]);
  const [searchText, setSearchText] = useState("Digite para buscar endereços");

  const { devicePosition } = useAuthStore();

  const getPlaces = useCallback(
    debounce(async (place) => {
      try {
        const result = await api.get(
          `Place/Search?q=${place}&latlng=${devicePosition.latitude},${devicePosition.longitude}`
        );
        setSearchText("Digite para buscar endereços");

        const { data } = result;
        if (!data.status) return;

        const options = data.data.map((item: any, index: number) => ({
          label: item.address,
          id: index,
          value: item,
        }));

        setListPlaces(options);
      } catch (error) {
        console.error(error);
      }
    }, 1000),
    []
  );

  const onSearchPlace = (inputValue: string) => {
    setListPlaces([]);
    setSearchText("Procurando...");
    if (inputValue?.length > 3) {
      getPlaces(inputValue);
    }
  };

  return (
    <Autocomplete
      value={value}
      onInputChange={(e: any, val: string) => {
        onSearchPlace(val);
        value && setValue(val);
      }}
      sx={{
        "& input": {
          width: "100%",
          height: "45px",
          border: "none",
          paddingLeft: 5,
          paddingRight: 5,
          backgroundColor: "#e8e8e8",
          borderRadius: "9.2px",
        },
      }}
      noOptionsText={searchText}
      onChange={(event, value) => {
        getSelectedValue(value);
        setValue && setValue(value);
      }}
      id="custom-input-demo"
      options={listPlaces}
      renderInput={(params) => (
        <div ref={params.InputProps.ref}>
          <input placeholder={placeholder} type="text" {...params.inputProps} />
        </div>
      )}
    />
  );
};
