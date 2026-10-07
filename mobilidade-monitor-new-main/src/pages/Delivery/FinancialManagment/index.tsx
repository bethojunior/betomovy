import { Collapse } from "antd";

import { Container } from "./styles";

import { BillingProfile } from "../../../components/Delivery/Config/FinancialManagment/BillingProfile";

import { FormPayment } from "../../../components/Delivery/Config/FinancialManagment/FormPayment";

import { Acquirers } from "../../../components/Delivery/Config/FinancialManagment/Acquirers";

import { EstablishmentsCharges } from "../../../components/Delivery/Config/FinancialManagment/EstablishmentCharges";

import { DobbyReturnsFee } from "../../../components/Delivery/Config/FinancialManagment/DobbyReturnsFee";

import { DeliveryRates } from "../../../components/Delivery/Config/FinancialManagment/DeliveryRates";

export const FinancialManagment = () => {
  return (
    <Container>
      <Collapse>
        <Collapse.Panel header="Perfil de Cobrança" key={1}>
          <BillingProfile />
        </Collapse.Panel>
        <Collapse.Panel header="Forma de Pagamento" key={2}>
          <FormPayment />
        </Collapse.Panel>
        <Collapse.Panel header="Adquirentes" key={3}>
          <Acquirers />
        </Collapse.Panel>
        <Collapse.Panel header="Cobranças de Estabelecimentos" key={4}>
          <EstablishmentsCharges />
        </Collapse.Panel>
        <Collapse.Panel header="Taxas de Devolução da Maquineta" key={5}>
          <DobbyReturnsFee />
        </Collapse.Panel>
        <Collapse.Panel header="Taxas e tempo" key={6}>
          <DeliveryRates />
        </Collapse.Panel>
      </Collapse>
    </Container>
  );
};
