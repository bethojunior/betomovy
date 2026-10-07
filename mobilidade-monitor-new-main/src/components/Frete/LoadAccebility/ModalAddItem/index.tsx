import { Button, Divider, Input, Modal, Select } from "antd";
import { useForm, Controller } from "react-hook-form";
import { yupResolver } from "@hookform/resolvers/yup";
import * as yup from "yup";

import { useEffect, useState } from "react";

import {
  Container,
  Footer,
  ContentInput,
  LabelInput,
  MessageError,
  ContentAddObstacle,
} from "./styles";

import { ObstaclesTypesProps } from "./types";

import Mask from "../../../../services/Mask";
import swal from "sweetalert";
import { AxiosError } from "axios";
import api from "../../../../services/api";
import Session from "../../../../utils/Session";
import { CollapseAddTypeObstacle } from "./CollapseAddTypeObstacle";

const schemaForm = yup
  .object({
    obstacle: yup.number().required("Este campo é obrigatório"),
    value: yup.string().required("Este campo é obrigatório"),
    valuePerFloor: yup.string().required("Este campo é obrigatório"),
  })
  .required();

type SchemaFormProps = yup.InferType<typeof schemaForm>;

interface ModalAddItemProps {
  visible: boolean;
  setVisible: (data: boolean) => void;
  getObstacles: () => void;
}

export const ModalAddObstacle = ({
  setVisible,
  visible,
  getObstacles,
}: ModalAddItemProps) => {
  const { control, handleSubmit, setValue, resetField } =
    useForm<SchemaFormProps>({
      resolver: yupResolver(schemaForm),
    });

  const [obstaclesType, setObstaclesType] = useState<DefaultOptionsProps[]>([]);
  const [loading, setLoading] = useState<boolean>(false);

  const { setMaskMoney, setRemoveMaskMoney } = Mask;

  const cityId = Session.getLocal("citySelected").cityId;

  const handleClose = () => {
    setVisible(false);
    resetField("obstacle");
    resetField("value");
    resetField("valuePerFloor");
  };

  const getTypesObstacles = async () => {
    try {
      const responseTypesObstacles = await api.get(`accessibility/obstacle`);

      if (responseTypesObstacles.status) {
        const typesObstaclesFormated = responseTypesObstacles.data.response.map(
          (data: ObstaclesTypesProps) => {
            return {
              value: data.id,
              label: data.description,
            };
          }
        );

        setObstaclesType(typesObstaclesFormated);
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

  const handleSaveObstacle = async (data: SchemaFormProps) => {
    try {
      setLoading(true);
      const responseSaveObstacle = await api.post(`price/obstacle`, {
        cityId: cityId,
        obstacleOnFloorId: String(data.obstacle),
        value: setRemoveMaskMoney(data.value),
        valuePerFloor: setRemoveMaskMoney(data.valuePerFloor),
      });

      if (responseSaveObstacle.status) {
        swal({
          title: "Sucesso",
          text: "Obstáculo inserido com sucesso",
          icon: "success",
        });
        getObstacles();
        handleClose();
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
      setLoading(false);
    }
  };

  useEffect(() => {
    getTypesObstacles();
  }, []);

  return (
    <Modal
      title="Adicione um item"
      open={visible}
      onCancel={handleClose}
      footer={[]}
    >
      <Container onSubmit={handleSubmit(handleSaveObstacle)}>
        <Controller
          control={control}
          name="obstacle"
          render={({ field: { value, onChange }, fieldState: { error } }) => (
            <ContentInput>
              <LabelInput>Obstáculos</LabelInput>
              <Select
                style={{
                  width: "100%",
                }}
                placeholder="Obstáculos"
                options={obstaclesType}
                value={value}
                onChange={onChange}
              />

              {error && <MessageError>{error.message}</MessageError>}
            </ContentInput>
          )}
        />

        <ContentAddObstacle>
          <CollapseAddTypeObstacle getTypesObstacles={getTypesObstacles} />
        </ContentAddObstacle>

        <Divider />

        <Controller
          control={control}
          name="value"
          render={({ field: { value }, fieldState: { error } }) => (
            <ContentInput>
              <LabelInput>Valor</LabelInput>
              <Input
                onChange={(event) => {
                  setValue("value", setMaskMoney(event.target.value));
                }}
                value={value}
                status={Boolean(error) ? "error" : ""}
              />

              {error && <MessageError>{error.message}</MessageError>}
            </ContentInput>
          )}
        />

        <Controller
          control={control}
          name="valuePerFloor"
          render={({ field: { value }, fieldState: { error } }) => (
            <ContentInput>
              <LabelInput>Valor por andar</LabelInput>
              <Input
                onChange={(event) => {
                  setValue("valuePerFloor", setMaskMoney(event.target.value));
                }}
                value={value}
                status={Boolean(error) ? "error" : ""}
              />

              {error && <MessageError>{error.message}</MessageError>}
            </ContentInput>
          )}
        />

        <Footer>
          <Button onClick={handleClose}>Cancelar</Button>
          <Button type="primary" htmlType="submit" loading={loading}>
            Salvar
          </Button>
        </Footer>
      </Container>
    </Modal>
  );
};
