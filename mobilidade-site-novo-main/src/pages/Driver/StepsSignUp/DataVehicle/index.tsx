import { Controller, useForm } from "react-hook-form";
import { yupResolver } from "@hookform/resolvers/yup";
import { useTranslation } from "react-i18next";
import Select, { StylesConfig } from "react-select";

import { useEffect, useState } from "react";

import { checkIfCNPJIsValid } from "../../../../utils/CheckCnpjValid";
import Mask from "../../../../utils/Masks";
import { Container } from "./styles";

import Switch from "../../../../components/Switch";

import {
  FormActions,
  useDriverDatasContext,
} from "../../../../contexts/DriverDatasContext";

import { schemaInternational, schema } from "./schemas_validations";
import { carBrandIcons } from "./carBrandIcons";
import swal from "sweetalert";

const OTHER_BRAND_OPTION = "outro";

interface BrandOption {
  label: string;
  value: string;
}

const brandSelectStyles: StylesConfig<BrandOption, false> = {
  control: (provided) => ({
    ...provided,
    borderRadius: 0,
    border: "1px solid black",
    boxShadow: "none",
    minHeight: "50px",
    margin: "1rem 0",
    cursor: "pointer",
  }),
  placeholder: (provided) => ({
    ...provided,
    color: "#757575",
    fontSize: "18px",
  }),
  singleValue: (provided) => ({
    ...provided,
    fontSize: "18px",
  }),
  option: (provided, state) => ({
    ...provided,
    fontSize: "16px",
    cursor: "pointer",
    backgroundColor: state.isFocused ? "#f0f0f0" : "white",
    color: "black",
  }),
  indicatorSeparator: () => ({ display: "none" }),
  menu: (provided) => ({ ...provided, zIndex: 5 }),
};

const formatBrandOptionLabel = (option: BrandOption) => {
  if (option.value === OTHER_BRAND_OPTION) {
    return <span className="brand-option">{option.label}</span>;
  }

  const icon = carBrandIcons[option.value];

  return (
    <span className="brand-option">
      {icon ? (
        <img src={icon} alt="" aria-hidden="true" className="brand-option-icon" />
      ) : (
        <span className="brand-option-icon brand-option-fallback">
          {option.value.charAt(0)}
        </span>
      )}
      {option.label}
    </span>
  );
};

const carBrands = [
  "Audi",
  "Avelloz",
  "Bajaj",
  "BMW",
  "BYD",
  "Caoa Chery",
  "Changan",
  "Chevrolet",
  "Citroën",
  "Fiat",
  "Ford",
  "GWM",
  "Haojue",
  "Honda",
  "Hyundai",
  "JAC",
  "Jeep",
  "Kawasaki",
  "Kia",
  "Land Rover",
  "Mercedes-Benz",
  "MG",
  "Mitsubishi",
  "Mottu",
  "Nissan",
  "Peugeot",
  "RAM",
  "Renault",
  "Royal Enfield",
  "Shineray",
  "Subaru",
  "Suzuki",
  "Toyota",
  "Volkswagen",
  "Volvo",
  "Yamaha",
];

interface DataVehicleProps {
  step: number;
  setStep: (data: number) => void;
}

interface IFormInputs {
  documentCar: string;
  brandCar: string;
  modelCar: string;
  plateCar: string;
  numberRenavam: string;
  colorCar: string;
  quantitySeats: number | undefined;
  yearCar: string;
  cnpjCompany?: string;
}

const DataVehicle = ({ setStep, step }: DataVehicleProps) => {
  const { t, i18n } = useTranslation();

  const { control, handleSubmit, setValue } = useForm<IFormInputs>({
    resolver: yupResolver(
      i18n.language === "pt" ? schema : schemaInternational
    ),
  });

  const [allocatedVehicle, setAllocatedVehicle] = useState<
    "allocated" | "not-allocated"
  >("not-allocated");

  const [isOtherBrand, setIsOtherBrand] = useState(false);

  const { state, dispatch } = useDriverDatasContext();

  const TranslationErrors = (message: string) => {
    switch (message) {
      case "Este campo é obrigatório":
        return t("message-error-form-input-mandatory");

      case "Este campo é do tipo email":
        return t("message-error-form-input-type-email");

      case "O mínimo é 11 caracteres":
        return t("message-error-form-minimun-char11");

      case "O mínimo é 14 caracteres":
        return t("message-error-form-minimun-char14");

      case "O máximo é 18 caracteres":
        return t("message-error-form-maximun-char18");

      case "O máximo é 12 caracteres":
        return t("message-error-form-maximun-char12");
    }
  };

  const handleSubmitData = (data: IFormInputs) => {
    if (i18n.language === "pt") {
      if (data.cnpjCompany) {
        if (!checkIfCNPJIsValid(data.cnpjCompany)) {
          swal({
            title: "Aviso",
            text: "O CNPJ inserido é inválido!",
            icon: "warning",
          });
          return;
        }
      }
    }

    const datasSend = {
      numberDocument: data.documentCar,
      brandCar: data.brandCar,
      modelCar: data.modelCar,
      plateCar: data.plateCar,
      numberRenavam: data.numberRenavam,
      colorCar: data.colorCar,
      numberSeats: data.quantitySeats,
      yearCar: data.yearCar,
      cnpjCompany: data.cnpjCompany,
    };

    dispatch({
      type: FormActions.setDataVehicle,
      payload: datasSend,
    });

    setStep(step + 1);
  };

  const handleBackStep = () => {
    setStep(step - 1);
  };

  useEffect(() => {
    /*eslint-disable*/
    if (state.stepDataVehicle.numberDocument) {
      setValue("documentCar", state.stepDataVehicle.numberDocument);
    }

    if (state.stepDataVehicle.brandCar) {
      setValue("brandCar", state.stepDataVehicle.brandCar);
      setIsOtherBrand(!carBrands.includes(state.stepDataVehicle.brandCar));
    }

    if (state.stepDataVehicle.cnpjCompany) {
      setValue("cnpjCompany", state.stepDataVehicle.cnpjCompany);
    }

    if (state.stepDataVehicle.colorCar) {
      setValue("colorCar", state.stepDataVehicle.colorCar);
    }

    if (state.stepDataVehicle.modelCar) {
      setValue("modelCar", state.stepDataVehicle.modelCar);
    }

    if (state.stepDataVehicle.numberRenavam) {
      setValue("numberRenavam", state.stepDataVehicle.numberRenavam);
    }

    if (state.stepDataVehicle.numberSeats) {
      setValue("quantitySeats", state.stepDataVehicle.numberSeats);
    } else {
      setValue("quantitySeats", undefined);
    }

    if (state.stepDataVehicle.yearCar) {
      setValue("yearCar", state.stepDataVehicle.yearCar);
    }

    if (state.stepDataVehicle.plateCar) {
      setValue("plateCar", state.stepDataVehicle.plateCar);
    }
  }, [state.stepDataVehicle, setValue]);

  useEffect(() => {
    setValue("cnpjCompany", undefined);
  }, [allocatedVehicle]);

  return (
    <Container>
      <h1>{t("register-driver-step-4-title-card")}</h1>

      <form
        onSubmit={handleSubmit(handleSubmitData)}
        className="content-data-vehicles"
      >
        <Controller
          control={control}
          name="documentCar"
          render={({
            field: { onBlur, value = "", name, ref },
            fieldState: { error },
          }) => (
            <div className="content-inputs">
              <input
                type="text"
                value={value}
                placeholder={t("register-driver-step-4-document-car") as string}
                onChange={(event) => {
                  const { value } = event.target;
                  event.target.value = Mask.setMaskOnlyNumber(value);
                  setValue("documentCar", Mask.setMaskOnlyNumber(value));
                }}
                onBlur={onBlur}
                name={name}
                ref={ref}
                maxLength={17}
              />
              {error && (
                <span className="errors-input">
                  {TranslationErrors(error.message as string)}
                </span>
              )}
            </div>
          )}
        />

        <Controller
          control={control}
          name="brandCar"
          render={({
            field: { onChange, onBlur, value = "", name, ref },
            fieldState: { error },
          }) => (
            <div className="content-inputs">
              {isOtherBrand ? (
                <>
                  <input
                    type="text"
                    value={value}
                    placeholder={
                      t("register-driver-step-4-brand-other-placeholder") as string
                    }
                    onChange={onChange}
                    onBlur={onBlur}
                    name={name}
                    ref={ref}
                  />
                  <button
                    type="button"
                    className="link-button"
                    onClick={() => {
                      setIsOtherBrand(false);
                      onChange("");
                    }}
                  >
                    {t("register-driver-step-4-brand-other-back")}
                  </button>
                </>
              ) : (
                <Select<BrandOption>
                  inputId={name}
                  name={name}
                  options={[
                    ...carBrands.map((brand) => ({
                      label: brand,
                      value: brand,
                    })),
                    {
                      label: t(
                        "register-driver-select-step-4-brand-other-option"
                      ) as string,
                      value: OTHER_BRAND_OPTION,
                    },
                  ]}
                  value={value ? { label: value, value } : null}
                  onChange={(selectedOption) => {
                    if (!selectedOption) {
                      onChange("");
                      return;
                    }
                    if (selectedOption.value === OTHER_BRAND_OPTION) {
                      setIsOtherBrand(true);
                      onChange("");
                      return;
                    }
                    onChange(selectedOption.value);
                  }}
                  onBlur={onBlur}
                  formatOptionLabel={formatBrandOptionLabel}
                  placeholder={t("register-driver-step-4-brand-car")}
                  styles={brandSelectStyles}
                />
              )}
              {error && (
                <span className="errors-input">
                  {TranslationErrors(error.message as string)}
                </span>
              )}
            </div>
          )}
        />


        <Controller
          control={control}
          name="modelCar"
          render={({
            field: { onChange, onBlur, value = "", name, ref },
            fieldState: { error },
          }) => (
            <div className="content-inputs">
              <input
                type="text"
                value={value}
                placeholder={t("register-driver-step-4-model-car") as string}
                onChange={onChange}
                onBlur={onBlur}
                name={name}
                ref={ref}
              />
              {error && (
                <span className="errors-input">
                  {TranslationErrors(error.message as string)}
                </span>
              )}
            </div>
          )}
        />

        <Controller
          control={control}
          name="plateCar"
          render={({ field: { value = "", name }, fieldState: { error } }) => (
            <div className="content-inputs">
              <input
                type="text"
                value={value}
                placeholder={t("register-driver-step-4-plate-car") as string}
                onChange={(event) => {
                  const { value } = event.target;
                  setValue("plateCar", value.toUpperCase().slice(0, 7));
                }}
                name={name}
                maxLength={7}
              />
              {error && (
                <span className="errors-input">
                  {TranslationErrors(error.message as string)}
                </span>
              )}
            </div>
          )}
        />

        <Controller
          control={control}
          name="numberRenavam"
          render={({
            field: { onBlur, value = "", name, ref },
            fieldState: { error },
          }) => (
            <div className="content-inputs">
              <input
                type="text"
                value={value}
                placeholder={t("register-driver-step-4-renavam") as string}
                onChange={(event) => {
                  const { value } = event.target;
                  setValue("numberRenavam", Mask.setMaskOnlyNumber(value));
                }}
                onBlur={onBlur}
                name={name}
                ref={ref}
                maxLength={12}
              />
              {error && (
                <span className="errors-input">
                  {TranslationErrors(error.message as string)}
                </span>
              )}
            </div>
          )}
        />

        <Controller
          control={control}
          name="colorCar"
          render={({
            field: { onChange, onBlur, value = "", name, ref },
            fieldState: { error },
          }) => (
            <div className="content-inputs">
              <select
                onChange={onChange}
                onBlur={onBlur}
                value={value}
                name={name}
                ref={ref}
              >
                <option value="" disabled>
                  {t("register-driver-select-step-4-color-default")}
                </option>
                <option value="branco">
                  {t("register-driver-select-step-4-color-white")}
                </option>
                <option value="prata">
                  {t("register-driver-select-step-4-color-silver")}
                </option>
                <option value="preto">
                  {t("register-driver-select-step-4-color-black")}
                </option>
                <option value="cinza">
                  {t("register-driver-select-step-4-color-grey")}
                </option>
                <option value="vermelho">
                  {t("register-driver-select-step-4-color-red")}
                </option>
                <option value="azul">
                  {t("register-driver-select-step-4-color-blue")}
                </option>
                <option value="verde">
                  {t("register-driver-select-step-4-color-green")}
                </option>
                <option value="bege">
                  {t("register-driver-select-step-4-color-beige")}
                </option>
                <option value="marrom">
                  {t("register-driver-select-step-4-color-brown")}
                </option>
                <option value="dourado/amarelo">
                  {t("register-driver-select-step-4-color-golden")}
                </option>
                <option value="laranja">
                  {t("register-driver-select-step-4-color-orange")}
                </option>
              </select>
              {error && (
                <span className="errors-input">
                  {TranslationErrors(error.message as string)}
                </span>
              )}
            </div>
          )}
        />

        <Controller
          control={control}
          name="quantitySeats"
          render={({
            field: { onBlur, value = undefined, name, ref },
            fieldState: { error },
          }) => (
            <div className="content-inputs">
              <input
                type="text"
                value={value !== undefined ? value.toString() : ""}
                placeholder={t("register-driver-step-4-numberseat") as string}
                onChange={(event) => {
                  const inputValue = event.target.value;
                  if (inputValue === "") {
                    setValue("quantitySeats", undefined);
                    return;
                  }
                  const numericValue = Number(inputValue.replace(/\D/g, ""));
                  setValue("quantitySeats", numericValue > 8 ? 8 : numericValue);
                }}
                onBlur={onBlur}
                name={name}
                ref={ref}
                pattern="\d*"
              />
              {error && (
                <span className="errors-input">
                  {TranslationErrors(error.message as string)}
                </span>
              )}
            </div>
          )}
        />
        <Controller
          control={control}
          name="yearCar"
          render={({ field: { onChange, onBlur, value = "", name, ref }, fieldState: { error } }) => (
            <div className="content-inputs">
              <input
                type="text"
                inputMode="numeric"
                pattern="[0-9]*"
                value={value}
                placeholder={t("register-driver-step-4-yearvehicle") as string}
                onChange={(event) => {
                  const inputValue = event.target.value;
                  if (!/^\d*$/.test(inputValue)) return;
                  if (inputValue.length > 4) return;
                  onChange(inputValue);
                }}
                onBlur={(event) => {
                  const inputValue = event.target.value;
                  if (inputValue) {
                    const year = Number(inputValue);
                    const currentYear = new Date().getFullYear();
                    if (year > currentYear || year < 1885) {
                      onChange(String(currentYear));
                    }
                  }
                  onBlur();
                }}
                name={name}
                ref={ref}
              />
              {error && (
                <span className="errors-input">
                  {TranslationErrors(error.message as string)}
                </span>
              )}
            </div>
          )}
        />
        <div className="content-isallocated">
          <span>{t("register-driver-step-4-isallocated")}</span>
          <Switch value={allocatedVehicle} setValue={setAllocatedVehicle} />
        </div>

        {allocatedVehicle === "allocated" && (
          <Controller
            control={control}
            name="cnpjCompany"
            render={({ field: { value = "" }, fieldState: { error } }) => (
              <div className="content-inputs">
                <input
                  type="text"
                  value={value}
                  placeholder={
                    t("register-driver-step-4-documentcompany") as string
                  }
                  onChange={(event) => {
                    const { value } = event.target;
                    setValue(
                      "cnpjCompany",
                      i18n.language === "pt"
                        ? Mask.setMaskCPFCNPJ(value)
                        : value
                    );
                  }}
                />
                {error && (
                  <span className="errors-input">
                    {TranslationErrors(error.message as string)}
                  </span>
                )}
              </div>
            )}
          />
        )}

        <div className="content-button">
          <button type="button" onClick={handleBackStep}>
            {t("register-driver-steps-buttons-back")}
          </button>
          <button type="submit">
            {t("register-driver-steps-buttons-next")}
          </button>
        </div>
      </form>
    </Container>
  );
};

export default DataVehicle;
