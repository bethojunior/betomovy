import { Button } from "antd";
import swal from "sweetalert";
import { useForm, Controller } from "react-hook-form";
import { yupResolver } from "@hookform/resolvers/yup";
import { AxiosError } from "axios";

import { FC, useEffect } from "react";

import {
  Label,
  InfoStepBody,
  TwoSelects,
  MiddleSelectContainer,
  ContentButtonStep,
} from "./styles";

import api from "../../../../../../services/api";
import Mask from "../../../../../../services/Mask";

import { InputAntd } from "../../../../../InputAntd";
import { SelectAntd } from "../../../../../SelectAntd";

import { SchemaFormInfoStep } from "./schemas";
import { SchemaFormInfoStepProps, FirstStep } from "./types";
import { ObjectPerfilLegalPersonProps } from "../../Edition/types";

import Utils from "../../../../../../utils/Utils";

const InfoStep: FC<FirstStep> = ({
  setCityList,
  cityList,
  setCitySelected,
  setLoadingProps,
  stateList,
  setCurrent,
  current,
  stateSelected,
  objectPerfilLegalPerson,
  setObjectPerfilLegalPerson,
  isEdit,
}) => {
  const { control, handleSubmit, setValue, reset } =
    useForm<SchemaFormInfoStepProps>({
      resolver: yupResolver(SchemaFormInfoStep),
    });

  const findCity = async (value: number) => {
    try {
      setLoadingProps(true);
      const responseCity = await api.get(
        `city?estateId=${value}&isUpdatePJ=true`
      );

      if (responseCity.status) {
        setCityList(responseCity.data.response);
        setCitySelected(null);
      }
    } catch (error) {
      const responseError = error as AxiosError;

      swal({
        title: responseError.response?.data.message,
        icon: "error",
      });
    } finally {
      setLoadingProps(false);
    }
  };

  const valueDefault = [{ value: 0, label: "Escolha a cidade" }];

  const handleNextStep = (data: SchemaFormInfoStepProps) => {
    if (!Utils.checkIfCNPJIsValid(data.document)) {
      swal({
        title: "Aviso",
        text: "O CNPJ inserido é inválido",
        icon: "error",
      });
      return;
    }

    const objectUpdated = {
      ...objectPerfilLegalPerson,
      address: data.address,
      fantasyName: data.nameFantasy,
      name: data.nameCompany,
      document: data.document,
      cityId: String(data.city),
    };

    setObjectPerfilLegalPerson(objectUpdated as ObjectPerfilLegalPersonProps);
    setCurrent(current + 1);
  };

  useEffect(() => {
    reset();

    if (stateSelected && isEdit) {
      findCity(stateSelected);
      setValue("state", Number(stateSelected));
      setValue("city", Number(objectPerfilLegalPerson?.cityId));
    }

    if (!isEdit) {
      setValue("state", 1);
      setValue("city", 79);
      findCity(1);
    }
  }, [stateSelected, isEdit]);

  useEffect(() => {
    if (objectPerfilLegalPerson) {
      setValue("nameCompany", objectPerfilLegalPerson.name);
      setValue("nameFantasy", objectPerfilLegalPerson.fantasyName);
      setValue("address", objectPerfilLegalPerson.address);
      setValue(
        "document",
        Mask.setMaskCPFCNPJ(objectPerfilLegalPerson.document)
      );
    }
  }, [objectPerfilLegalPerson]);

  const stateListFormated: DefaultOptionsProps[] | undefined = stateList?.map(
    (value) => {
      return {
        value: value.id,
        label: value.name,
      };
    }
  );

  const cityListFormated = cityList?.map((value) => {
    return {
      value: value.id,
      label: value.nome,
    };
  });

  return (
    <InfoStepBody onSubmit={handleSubmit(handleNextStep)}>
      <Controller
        control={control}
        name="nameCompany"
        render={({ field: { onChange, value }, fieldState: { error } }) => (
          <div>
            <Label>Nome Empresa*</Label>
            <InputAntd
              value={value}
              onChange={onChange}
              status={Boolean(error) ? "error" : ""}
              messageError={error?.message}
            />
          </div>
        )}
      />

      <Controller
        control={control}
        name="nameFantasy"
        render={({ field: { onChange, value }, fieldState: { error } }) => (
          <div>
            <Label>Nome fantasia*</Label>
            <InputAntd
              value={value}
              onChange={onChange}
              status={Boolean(error) ? "error" : ""}
              messageError={error?.message}
            />
          </div>
        )}
      />

      <Controller
        control={control}
        name="address"
        render={({ field: { onChange, value }, fieldState: { error } }) => (
          <div>
            <Label>Endereço*</Label>
            <InputAntd
              value={value}
              onChange={onChange}
              status={Boolean(error) ? "error" : ""}
              messageError={error?.message}
            />
          </div>
        )}
      />

      <Controller
        control={control}
        name="document"
        render={({ field: { value }, fieldState: { error } }) => (
          <div>
            <Label>CNPJ*</Label>
            <InputAntd
              value={value}
              onChange={(event) =>
                setValue("document", Mask.setMaskCPFCNPJ(event.target.value))
              }
              status={Boolean(error) ? "error" : ""}
              messageError={error?.message}
            />
          </div>
        )}
      />

      <TwoSelects>
        <Controller
          control={control}
          name="state"
          render={({ field: { value }, fieldState: { error } }) => (
            <MiddleSelectContainer>
              <Label>Estado*</Label>
              <SelectAntd
                defaultValue=""
                value={value}
                onChange={(value) => {
                  findCity(Number(value));
                  setValue("state", Number(value));
                }}
                options={stateListFormated}
                status={Boolean(error) ? "error" : ""}
                messageError={error?.message}
              />
            </MiddleSelectContainer>
          )}
        />

        <Controller
          control={control}
          name="city"
          render={({ field: { value }, fieldState: { error } }) => (
            <MiddleSelectContainer>
              <Label>Cidade*</Label>
              <SelectAntd
                value={value}
                onChange={(value) => {
                  setValue("city", Number(value));
                }}
                placeholder="Escolha a cidade"
                options={valueDefault.concat(cityListFormated as any)}
                status={Boolean(error) ? "error" : ""}
                messageError={error?.message}
              />
            </MiddleSelectContainer>
          )}
        />
      </TwoSelects>

      <ContentButtonStep>
        <Button type="primary" htmlType="submit">
          Próximo
        </Button>
      </ContentButtonStep>
    </InfoStepBody>
  );
};

export default InfoStep;
