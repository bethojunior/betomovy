import { Button, Modal } from "antd";
import { LinkSectionModalProps } from "./types";
import { SectionsTableType } from "../../../../../pages/Delivery/Config/Sections/types";
import api from "../../../../../services/api";
import { AxiosError } from "axios";
import EstablishmentsCard from "../EstablishmentsCard";
import { useEffect, useState } from "react";
const LinkSectionModal = ({
  open,
  setOpen,
  onCancel,
  listSections,
  linkSections,
  sectionId,
  sendAlert,
  setLoading,
}: LinkSectionModalProps) => {
  const [deliverySections, setDeliverySections] = useState<string[]>([]);
  const onHandleChange = (e: boolean, id: number) => {
    if (e) {
      setDeliverySections([...deliverySections, String(id)]);
    } else {
      setDeliverySections(
        deliverySections.filter((sectionId) => sectionId !== String(id))
      );
    }
  };

  const updateSectionLink = async () => {
    try {
      setLoading(true);
      const result = await api.post("typeDeliveryCategoryBySection", {
        deliverySections: [...new Set(deliverySections)],
        typeDeliveryCategoryId: sectionId,
      });
      const { data } = result;
      setLoading(false);
      if (data?.status) {
        setOpen(false);
        return sendAlert("Categoria vinculada com sucesso", "success");
      }
      sendAlert("Erro ao vincular categoria", "warning");
    } catch (error) {
      const axiosError = error as AxiosError;
      sendAlert("Erro ao vincular categoria", "warning");
      setLoading(false);
      console.error(axiosError);
    }
  };

  useEffect(() => {
    if (open) {
      setDeliverySections([]);
      listSections.map((item: SectionsTableType) => {
        const isChecked = linkSections.some(
          (res: any) => item.id === res.deliverySectionId
        );
        isChecked
          ? setDeliverySections([...deliverySections, String(item.id)])
          : null;
      });
    }
  }, [open]);

  return (
    <Modal
      title={"Vincular categorias em seções"}
      open={open}
      onCancel={onCancel}
      destroyOnClose
      footer={[
        <Button onClick={onCancel}>Cancelar</Button>,
        <Button onClick={() => updateSectionLink()} type="primary">
          Salvar
        </Button>,
      ]}
    >
      {listSections.map((item: SectionsTableType) => {
        return (
          <EstablishmentsCard
            key={item.id}
            onHandleChange={onHandleChange}
            item={item}
            linkSections={linkSections}
          />
        );
      })}
    </Modal>
  );
};

export default LinkSectionModal;