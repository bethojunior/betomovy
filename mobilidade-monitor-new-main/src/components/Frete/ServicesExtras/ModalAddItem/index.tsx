import { Button, Divider, Input, Modal, Select } from "antd";
import swal from "sweetalert";
import { useForm, Controller } from "react-hook-form";
import { yupResolver } from "@hookform/resolvers/yup";
import * as yup from "yup";
import { AxiosError } from "axios";
import { useEffect, useState } from "react";

import {
  Container,
  ContentInput,
  LabelInput,
  ContentAddHelper,
  Footer,
  MessageError,
} from "./styles";
import api from "../../../../services/api";
import { HelpersItemsProps } from "./types";

import Mask from "../../../../services/Mask";
import Session from "../../../../utils/Session";

import { CollapseAddTypeItem } from "./CollapseAddTypeItem";

const schemaForm = yup
  .object({
    helpers: yup.number().required("Este campo é obrigatório"),
    value: yup.string().required("Este campo é obrigatório"),
    quantity_icon_show: yup.number().required("Este campo é obrigatório"),
  })
  .required();

type SchemaFormProps = yup.InferType<typeof schemaForm>;

interface ModalAddItemProps {
  visible: boolean;
  setVisible: (data: boolean) => void;
  getHelpers: () => void;
}

export const ModalAddItem = ({
  visible,
  setVisible,
  getHelpers,
}: ModalAddItemProps) => {
  const { control, setValue, resetField, handleSubmit } =
    useForm<SchemaFormProps>({
      resolver: yupResolver(schemaForm),
    });

  const [itemsHelpers, setItemsHelpers] = useState<DefaultOptionsProps[]>([]);
  const [loading, setLoading] = useState<boolean>(false);

  const cityId = Session.getLocal("citySelected").cityId;
  const { setMaskMoney, setRemoveMaskMoney } = Mask;

  const handleCloseModal = () => {
    setVisible(false);
    resetField("helpers");
    resetField("quantity_icon_show");
    resetField("value");
  };

  const getItemsHelpers = async () => {
    try {
      const responseItemsHelpers = await api.get("accessibility/help");

      if (responseItemsHelpers.status) {
        const itemsHelpersFormated = responseItemsHelpers.data.response.map(
          (response: HelpersItemsProps) => {
            return {
              label: response.name,
              value: response.id,
            };
          }
        );

        setItemsHelpers(itemsHelpersFormated);
      }
    } catch (error) {
      const responseError = error as AxiosError;
      swal({
        title: "Error",
        text: responseError.response?.data.message,
        icon: "error",
      });
      console.log(error);
    }
  };

  const handleSaveItem = async (data: SchemaFormProps) => {
    try {
      setLoading(true);
      const responseSaveItem = await api.post("price/help", {
        accessibilityHelpId: String(data.helpers),
        cityId: cityId,
        quantityIcon: String(data.quantity_icon_show),
        value: setRemoveMaskMoney(data.value),
      });

      if (responseSaveItem.status) {
        swal({
          title: "Sucesso",
          text: "Item adicionado com sucesso",
          icon: "success",
        });
        handleCloseModal();
        getHelpers();
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
    getItemsHelpers();
  }, []);

  return (
    <Modal
      title="Escolha um item"
      open={visible}
      onCancel={handleCloseModal}
      footer={[]}
    >
      <Container onSubmit={handleSubmit(handleSaveItem)}>
        <Controller
          control={control}
          name="helpers"
          render={({ field: { value, onChange }, fieldState: { error } }) => (
            <ContentInput>
              <LabelInput>Ajudantes</LabelInput>
              <Select
                style={{
                  width: "100%",
                }}
                placeholder="Ajudantes"
                options={itemsHelpers}
                value={value}
                onChange={onChange}
                status={Boolean(error) ? "error" : ""}
              />

              {error && <MessageError>{error.message}</MessageError>}
            </ContentInput>
          )}
        />

        <ContentAddHelper>
          <CollapseAddTypeItem getTypesHelpers={getItemsHelpers} />
        </ContentAddHelper>

        <Divider />

        <Controller
          control={control}
          name="value"
          render={({ field: { value }, fieldState: { error } }) => (
            <ContentInput>
              <LabelInput>Valor</LabelInput>
              <Input
                value={value}
                onChange={(event) => {
                  const value = event.target.value;
                  setValue("value", setMaskMoney(value));
                }}
                status={Boolean(error) ? "error" : ""}
              />
              {error && <MessageError>{error.message}</MessageError>}
            </ContentInput>
          )}
        />

        <Controller
          control={control}
          name="quantity_icon_show"
          render={({ field: { value }, fieldState: { error } }) => (
            <ContentInput>
              <LabelInput>
                Quantidade de vezes que o ícone irá aparecer
              </LabelInput>
              <Input
                type="number"
                min={0}
                value={value}
                onChange={(event) => {
                  const value = event.target.value;

                  if (Number(value) <= 0) {
                    setValue("quantity_icon_show", 0);
                    return;
                  }

                  setValue("quantity_icon_show", Number(value));
                }}
                status={Boolean(error) ? "error" : ""}
              />
              {error && <MessageError>{error.message}</MessageError>}
            </ContentInput>
          )}
        />

        <Footer>
          <Button onClick={handleCloseModal}>Cancelar</Button>
          <Button type="primary" htmlType="submit" loading={loading}>
            Salvar
          </Button>
        </Footer>
      </Container>
    </Modal>
  );
};
