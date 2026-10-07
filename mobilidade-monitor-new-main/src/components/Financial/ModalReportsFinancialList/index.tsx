import { Button, Modal, Collapse } from "antd";

import { Container, Content, LabelText, Text } from "./styles";

import { FinancialProductDriversProps } from "../../../pages/Financial/ReportsFinancial/types";

interface ModalReportsFinancialListProps {
  visible: boolean;
  setVisible: (data: boolean) => void;
  datasDriverProduct: FinancialProductDriversProps | undefined;
}

export const ModalReportsFinancialList = ({
  datasDriverProduct,
  setVisible,
  visible,
}: ModalReportsFinancialListProps) => {
  return (
    <Modal
      width={800}
      title="Relatório"
      open={visible}
      onCancel={() => setVisible(false)}
      footer={[
        <Button type="primary" onClick={() => setVisible(false)}>
          Fechar
        </Button>,
      ]}
    >
      {datasDriverProduct ? (
        <Container>
          <Collapse>
            <Collapse.Panel
              header="Quantidade de viagens (CHAMADAS/CANCELADAS/FINALIZADAS)"
              key={1}
            >
              {datasDriverProduct.total_trip.map((value) => {
                return (
                  <Content key={value.tripTypeId}>
                    {value.type === "Total" ? (
                      <div
                        style={{
                          marginTop: 30,
                        }}
                      >
                        <LabelText>Quantidade: </LabelText>
                        <Text>{value.quantity}</Text>
                      </div>
                    ) : (
                      <>
                        <div>
                          <LabelText>Tipo: </LabelText>
                          <Text>{value.type}</Text>
                        </div>
                        <div>
                          <LabelText>Quantidade: </LabelText>
                          <Text>{value.quantity}</Text>
                        </div>
                      </>
                    )}
                  </Content>
                );
              })}
            </Collapse.Panel>

            <Collapse.Panel
              header="Quantidade de motoristas ativos (RECEBEU CHAMADA /CANCELOU CHAMADA / FINALIZOU CHAMADA)"
              key={2}
            >
              {datasDriverProduct.active_drivers.map((value) => {
                return (
                  <Content key={value.userTypeId}>
                    {value.type === "Total" ? (
                      <div
                        style={{
                          marginTop: 30,
                        }}
                      >
                        <LabelText>Quantidade Total: </LabelText>
                        <Text>{value.quantity}</Text>
                      </div>
                    ) : (
                      <>
                        <div>
                          <LabelText>Tipo: </LabelText>
                          <Text>{value.type}</Text>
                        </div>
                        <div>
                          <LabelText>Quantidade: </LabelText>
                          <Text>{value.quantity}</Text>
                        </div>
                      </>
                    )}
                  </Content>
                );
              })}
            </Collapse.Panel>

            <Collapse.Panel header="Quantidade de motoristas inativos" key={3}>
              {datasDriverProduct.inactive_drivers.map((value) => {
                return (
                  <Content>
                    {value.type === "Total" ? (
                      <div
                        style={{
                          marginTop: 30,
                        }}
                      >
                        <LabelText>Quantidade Total: </LabelText>
                        <Text>{value.quantity}</Text>
                      </div>
                    ) : (
                      <>
                        <div>
                          <LabelText>Tipo: </LabelText>
                          <Text>{value.type}</Text>
                        </div>
                        <div>
                          <LabelText>Quantidade: </LabelText>
                          <Text>{value.quantity}</Text>
                        </div>
                      </>
                    )}
                  </Content>
                );
              })}
            </Collapse.Panel>

            <Collapse.Panel header="Valores movimentados / Comissão" key={4}>
              {datasDriverProduct.moved_billing_values.map((value) => {
                return (
                  <Content>
                    {value.type === "Total" ? (
                      <>
                        <div
                          style={{
                            marginTop: 30,
                          }}
                        >
                          <LabelText>Comissão Total: </LabelText>
                          <Text>
                            {value.commission.toLocaleString("pt-br", {
                              style: "currency",
                              currency: "BRL",
                            })}
                          </Text>
                        </div>
                        <div>
                          <LabelText>Valor Total: </LabelText>
                          <Text>
                            {value.total.toLocaleString("pt-br", {
                              style: "currency",
                              currency: "BRL",
                            })}
                          </Text>
                        </div>
                      </>
                    ) : (
                      <>
                        <div>
                          <LabelText>Tipo: </LabelText>
                          <Text>{value.type}</Text>
                        </div>

                        <div>
                          <LabelText>Comissão: </LabelText>
                          <Text>
                            {value.commission.toLocaleString("pt-br", {
                              style: "currency",
                              currency: "BRL",
                            })}
                          </Text>
                        </div>

                        <div>
                          <LabelText>Valor: </LabelText>
                          <Text>
                            {value.total.toLocaleString("pt-br", {
                              style: "currency",
                              currency: "BRL",
                            })}
                          </Text>
                        </div>
                      </>
                    )}
                  </Content>
                );
              })}
            </Collapse.Panel>

            <Collapse.Panel header="Tipo de recebimentos" key={5}>
              {datasDriverProduct.trip_total_value.map((value) => {
                return (
                  <Content>
                    {value.paymentForm === "Total" ? (
                      <>
                        <div
                          style={{
                            marginTop: 30,
                          }}
                        >
                          <LabelText>Comissão Total: </LabelText>
                          <Text>
                            {value.commission.toLocaleString("pt-br", {
                              style: "currency",
                              currency: "BRL",
                            })}
                          </Text>
                        </div>
                        <div>
                          <LabelText>Valor Total: </LabelText>
                          <Text>
                            {value.total.toLocaleString("pt-br", {
                              style: "currency",
                              currency: "BRL",
                            })}
                          </Text>
                        </div>
                      </>
                    ) : (
                      <>
                        <div>
                          <LabelText>Tipo: </LabelText>
                          <Text>{value.paymentForm}</Text>
                        </div>
                        <div>
                          <LabelText>Comissão: </LabelText>
                          <Text>
                            {value.commission.toLocaleString("pt-br", {
                              style: "currency",
                              currency: "BRL",
                            })}
                          </Text>
                        </div>
                        <div>
                          <LabelText>Valor: </LabelText>
                          <Text>
                            {value.total.toLocaleString("pt-br", {
                              style: "currency",
                              currency: "BRL",
                            })}
                          </Text>
                        </div>
                      </>
                    )}
                  </Content>
                );
              })}
            </Collapse.Panel>

            <Collapse.Panel header="Imposto a recolher" key={6}>
              {datasDriverProduct.total_tax_fee.map((value) => {
                return (
                  <Content>
                    {value.type === "Total" ? (
                      <div
                        style={{
                          marginTop: 30,
                        }}
                      >
                        <LabelText>Total: </LabelText>
                        <Text>
                          {value.total.toLocaleString("pt-br", {
                            style: "currency",
                            currency: "BRL",
                          })}
                        </Text>
                      </div>
                    ) : (
                      <>
                        <div>
                          <LabelText>Tipo: </LabelText>
                          <Text>{value.type}</Text>
                        </div>
                        <div>
                          <LabelText>Total: </LabelText>
                          <Text>
                            {value.total.toLocaleString("pt-br", {
                              style: "currency",
                              currency: "BRL",
                            })}
                          </Text>
                        </div>
                      </>
                    )}
                  </Content>
                );
              })}
            </Collapse.Panel>
          </Collapse>
        </Container>
      ) : null}
    </Modal>
  );
};
