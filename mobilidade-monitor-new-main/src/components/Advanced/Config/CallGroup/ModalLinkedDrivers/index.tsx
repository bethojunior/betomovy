import { Button, Input, Modal } from "antd";
import { IModalLinkedDriversProps, SchemaLinkedDrivers } from "./types";
import { ContentInput, Footer, Form, LabelInput, MessageError } from "./styles";
import { Controller, useForm } from "react-hook-form";
import { yupResolver } from "@hookform/resolvers/yup";
import { schemaLinkedDrivers } from "./schema";
import api from "../../../../../services/api";
import { AxiosError } from "axios";
import { useState } from "react";

export function ModalLinkedDrivers({
  visible,
  setVisible,
  callGroupSelected,
  getCallGroups,
}: IModalLinkedDriversProps) {
  const { control, handleSubmit, reset } = useForm<SchemaLinkedDrivers>({
    resolver: yupResolver(schemaLinkedDrivers),
  });

  const [loading, setLoading] = useState<boolean>(false);

  const handleLinkDriver = async (data: SchemaLinkedDrivers) => {
    const idDriver = parseInt(data?.driverCode.replace(/[^0-9]/g, ""));

    try {
      setLoading(true);
      const responseLinkDriver = await api.post(`callGroup/linkDriver`, {
        idDriver: idDriver,
        idCallGroup: Number(callGroupSelected?.id),
      });

      if (responseLinkDriver.status) {
        swal({
          title: "Sucesso",
          text: "Motorista vinculado com sucesso.",
          icon: "success",
        });
        
        handleCloseModal();
        getCallGroups();
      }
    } catch (error) {
      const responseError = error as AxiosError<any>;
      const errMsg = Array.isArray(responseError.response?.data?.response)
        ? responseError.response?.data?.response[0]
        : (responseError.response?.data?.message || "Erro ao vincular motorista");
      swal({
        title: "Erro",
        icon: "error",
        text: errMsg,
      });
    } finally {
      setLoading(false);
    }
  };

  const handleCloseModal = () => {
    setVisible(!visible);
    reset();
  };

  return (
    <Modal
      open={visible}
      onCancel={handleCloseModal}
      title="Vincular Motorista"
      footer={[]}
    >
      <Form onSubmit={handleSubmit(handleLinkDriver)}>
        <Controller
          control={control}
          name="driverCode"
          render={({ field: { onChange, value }, fieldState: { error } }) => (
            <ContentInput>
              <LabelInput>Insira o código do motorista</LabelInput>
              <Input
                placeholder="XX00000P"
                onChange={(event) =>
                  onChange(event?.target?.value.toLocaleUpperCase())
                }
                value={value}
                status={error ? "error" : ""}
              />

              {Boolean(error) && <MessageError>{error?.message}</MessageError>}
            </ContentInput>
          )}
        />

        <Footer>
          <Button onClick={handleCloseModal}>Cancelar</Button>
          <Button type="primary" htmlType="submit" loading={loading}>
            Vincular
          </Button>
        </Footer>
      </Form>
    </Modal>
  );
}
