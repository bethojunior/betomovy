import { Button as ButtonAntd, Card, Select, Divider } from "antd";
import swal from "sweetalert";
import { AxiosError } from "axios";

import { Fragment, useEffect, useState } from "react";
import api from "../../../../../services/api";

import { Container, ContentsRowCard, ItemConfigs } from "./styles";

import { FormsStepsProps, StepsSelectedProps } from "./types";
import { BsTrash } from "react-icons/bs";

let listIdsSelected: number[] = [];

interface ButtonProps {
  data: FormsStepsProps;
  userTypeIdSelected: number | null;
  getFormsStep: () => void;
  getTypesDrivers: () => void;
  handleSelectCategory: (data: number) => void;
}

export const Button = ({
  data,
  getFormsStep,
  getTypesDrivers,
  userTypeIdSelected,
  handleSelectCategory,
}: ButtonProps) => {
  const [loadingButton, setLoadingButton] = useState<boolean>(false);

  const handleAddStep = async () => {
    if (data) {
      try {
        setLoadingButton(true);
        const responseAddStep = await api.post("config/formStepUserType", {
          formStepId: data.id,
          userTypeId: userTypeIdSelected,
        });

        if (responseAddStep.status) {
          getFormsStep();
          getTypesDrivers();
          handleSelectCategory(userTypeIdSelected as number);
        }
      } catch (error) {
        console.error(error);
      } finally {
        setLoadingButton(false);
      }
    }
  };

  return (
    <ButtonAntd loading={loadingButton} onClick={handleAddStep} type="primary">
      Adicionar
    </ButtonAntd>
  );
};

export const ConfigRegisterDriver = () => {
  const [loadingSelect, setLoadingSelect] = useState<boolean>(false);
  const [typesDrivers, setTypesDrivers] = useState<DriverUserTypesProps[]>([]);
  const [formsStep, setFormsStep] = useState<FormsStepsProps[]>([]);
  const [stepsSelected, setStepsSelected] = useState<StepsSelectedProps[]>([]);

  const [userTypeIdSelected, setUserTypeIdSelected] = useState<number | null>(
    null
  );

  const getTypesDrivers = async () => {
    try {
      setLoadingSelect(true);
      const responseTypesDrivers = await api.get("userType/drivers");

      const typesDriversFormated = responseTypesDrivers.data.response.map(
        (value: DriverUserTypesProps) => {
          return {
            value: value.idUserType,
            label: value.name,
          };
        }
      );
      setTypesDrivers(typesDriversFormated);
    } catch (error) {
      const responseError = error as AxiosError;
      swal({
        title: "Error",
        text: responseError.response?.data.message,
        icon: "error",
      });
      console.error(error);
    } finally {
      setLoadingSelect(false);
    }
  };

  const getFormsStep = async () => {
    try {
      const responseFormsStep = await api.get("config/formStep");

      if (responseFormsStep.status) {
        setFormsStep(responseFormsStep.data.response);
      }
    } catch (error) {
      const responseError = error as AxiosError;
      swal({
        title: "Error",
        text: responseError.response?.data.message,
        icon: "error",
      });
      console.error(error);
    }
  };

  const handleDeleteStep = async (stepId: number) => {
    try {
      const responseDeleteStep = await api.delete(
        `config/formStepUserType/${stepId}`
      );

      if (responseDeleteStep.status) {
        getFormsStep();
        getTypesDrivers();
        handleSelectCategory(userTypeIdSelected as number);
      }
    } catch (error) {
      const responseError = error as AxiosError;
      swal({
        title: "Error",
        text: responseError.response?.data.message,
        icon: "error",
      });
      console.error(error);
    } finally {
    }
  };

  const handleSelectCategory = async (id: number) => {
    try {
      setLoadingSelect(true);
      const responseSelectCategory = await api.get(
        `config/formStep/userType/${id}`
      );

      if (responseSelectCategory.status) {
        getFormsStep();
        setStepsSelected(responseSelectCategory.data.response);
        setUserTypeIdSelected(id);
        listIdsSelected = [];
      }
    } catch (error) {
      const responseError = error as AxiosError;
      swal({
        title: "Error",
        text: responseError.response?.data.message,
        icon: "error",
      });
      console.error(error);
    } finally {
      setLoadingSelect(false);
    }
  };

  useEffect(() => {
    getTypesDrivers();
  }, []);

  useEffect(() => {
    stepsSelected.map((value) => {
      listIdsSelected.push(value.formStepId);
    });
  }, [stepsSelected, formsStep]);

  const formsStepFiltered = formsStep.filter(
    (data) => !listIdsSelected.includes(data.id)
  );

  return (
    <Container>
      <Card
        title="Configuração da sequências de telas mostrada no ato do cadastro do motorista"
        bordered
      >
        <Select
          style={{
            minWidth: 250,
          }}
          placeholder="Seleciona a categoria"
          options={typesDrivers}
          onChange={(value) => handleSelectCategory(value)}
          loading={loadingSelect}
        />

        <ContentsRowCard>
          <Card
            title="Adicionar"
            bordered
            style={{
              width: "100%",
            }}
          >
            {formsStepFiltered.map((value) => {
              return (
                <Fragment key={value.id}>
                  <ItemConfigs>
                    <p>{value.description}</p>
                    <Button
                      key={value.id}
                      data={value}
                      getFormsStep={getFormsStep}
                      getTypesDrivers={getTypesDrivers}
                      userTypeIdSelected={userTypeIdSelected}
                      handleSelectCategory={handleSelectCategory}
                    />
                  </ItemConfigs>

                  <Divider />
                </Fragment>
              );
            })}
          </Card>

          <Card
            title="Atual"
            bordered
            style={{
              width: "100%",
            }}
          >
            {stepsSelected.map((value) => {
              return (
                <Fragment key={value.id}>
                  <ItemConfigs key={value.id} style={{ display: "flex", alignItems: "center", justifyContent: "space-between" }}>
                    <p>{value.form_step.description}</p>
                    <ButtonAntd
                      danger
                      shape="circle"
                      icon={<BsTrash />}
                      loading={loadingSelect}
                      onClick={() => handleDeleteStep(value.id)}
                    />
                  </ItemConfigs>
                  <Divider />
                </Fragment>
              );
            })}
          </Card>
        </ContentsRowCard>
      </Card>
    </Container>
  );
};
