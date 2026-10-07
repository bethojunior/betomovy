import { Button, Input, Modal, Select } from "antd";
import swal from "sweetalert";
import { AxiosError } from "axios";
import { useState } from "react";

import { Container, LabelInput, ContentInput } from "./styles";

import api from "../../../../../services/api";
import Mask from "../../../../../services/Mask";
import Session from "../../../../../utils/Session";

import { useDebounce } from "../../../../../hooks/useDebounce";

interface ModalAddEstablishmentsChargeProps {
  visible: boolean;
  setVisible: (data: boolean) => void;
  getEstablishments: () => void;
}

export const ModalAddEstablishmentsCharge = ({
  setVisible,
  visible,
  getEstablishments,
}: ModalAddEstablishmentsChargeProps) => {
  const [loading, setLoading] = useState<boolean>(false);
  const [description, setDescription] = useState<string>("");
  const [valueCharge, setValueCharge] = useState<string>("0,00");

  const [listCompanies, setListCompanies] = useState<CompanyProps[]>([]);
  const [companyId, setCompanyId] = useState<string | null>(null);
  const [loadingSelect, setLoadingSelect] = useState<boolean>(false);

  const cityId = Session.getLocal("citySelected").cityId;

  const handleCloseModal = () => {
    setVisible(false);
    setCompanyId(null);
    setDescription("");
    setValueCharge("0,00");
  };

  const handleAddNewCharge = async () => {
    if (!companyId || description.length <= 0 || valueCharge === "0,00") {
      swal({
        title: "Preencha os campos!",
        icon: "warning",
      });
      return;
    }

    try {
      setLoading(true);
      const responseNewCharge = await api.post("establishmentBilling", {
        companyId,
        description,
        value: Mask.setRemoveMaskMoney(valueCharge),
      });

      if (responseNewCharge.status) {
        swal({
          title: "Cobrança adicionada com sucesso",
          icon: "success",
        });
        getEstablishments();
        handleCloseModal();
      }
    } catch (error) {
      const responseError = error as AxiosError;
      swal({
        title: responseError.response?.data.message,
        icon: "error",
      });
    } finally {
      setLoading(false);
    }
  };

  const onChange = (value: string) => {
    setCompanyId(value);
  };

  const onSearch = useDebounce(async (value: string) => {
    try {
      setLoadingSelect(true);
      const responseCompany = await api.get(
        `company?cityId=${cityId}&fantasyName=${value}`
      );

      if (responseCompany.status) {
        setListCompanies(responseCompany.data.response);
      }
    } catch (error) {
      const responseError = error as AxiosError;
      swal({
        title: responseError.response?.headers.message,
        icon: "error",
      });
    } finally {
      setLoadingSelect(false);
    }
  }, 1000);

  const filterOption = (
    input: string,
    option?: { label: string; value: string }
  ) => (option?.label ?? "").toLowerCase().includes(input.toLowerCase());

  const companiesFormated = listCompanies.map((value) => {
    return {
      value: String(value.id),
      label: `Nome: ${value.name} Telefone: ${value.phone} CNPJ: ${value.document}`,
    };
  });

  return (
    <Modal
      title="Criar nova cobrança"
      open={visible}
      onCancel={handleCloseModal}
      footer={[
        <Button key={1} onClick={handleCloseModal}>
          Cancelar
        </Button>,
        <Button
          type="primary"
          key={2}
          onClick={handleAddNewCharge}
          loading={loading}
        >
          Confirmar
        </Button>,
      ]}
    >
      <Container>
        <ContentInput
          style={{
            display: "flex",
            flexDirection: "column",
          }}
        >
          <LabelInput>Empresa que será vinculada a cobrança</LabelInput>
          <Select
            showSearch
            placeholder="Busque o nome fantasia"
            optionFilterProp="children"
            onChange={onChange}
            onSearch={onSearch}
            filterOption={filterOption}
            options={companiesFormated}
            loading={loadingSelect}
            value={companyId}
          />
        </ContentInput>

        <ContentInput>
          <LabelInput htmlFor="description">Descrição</LabelInput>
          <Input
            placeholder="Descrição"
            id="description"
            value={description}
            onChange={(event) => setDescription(event.target.value)}
          />
        </ContentInput>
        <ContentInput>
          <LabelInput htmlFor="value">Valor</LabelInput>
          <Input
            placeholder="Valor"
            id="value"
            value={valueCharge}
            onChange={(event) =>
              setValueCharge(Mask.setMaskMoney(event.target.value))
            }
          />
        </ContentInput>
      </Container>
    </Modal>
  );
};
