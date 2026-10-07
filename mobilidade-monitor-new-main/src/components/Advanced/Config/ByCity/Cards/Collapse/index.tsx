import { Button, Collapse, Switch } from "antd";
import { FC, useEffect, useState } from "react";

import {
  Container,
  Content,
  ContentSimulatorApp,
  ContentItems,
  Label,
  ContentButtonSave,
} from "./styles";

import { SimulatorScreenInitial } from "../../../ModulesActives/SimulatorScreenInitial";

import { FieldsCalledDriverProps } from "./types";

interface ValuesProps {
  [key: string]: string | boolean;
}

interface ConfigCitiesData {
  attribute: string;
  cityId: number;
  description: string;
  inputType: string;
  value:
    | string
    | {
        accept: ValuesProps;
      };
}

interface Accept {
  accept: ValuesProps;
}

interface TransformedData {
  enabledDriverFields: Accept;
}

interface CollapseProps {
  item: ConfigCitiesData;
  sendRequest: (data: {}) => void;
}

const CardCollapse: FC<CollapseProps> = ({ item, sendRequest }) => {
  const [switchValues, setSwitchValues] = useState<FieldsCalledDriverProps[]>(
    []
  );
  const { Panel } = Collapse;

  const translate = (description: string) => {
    const traduction: ValuesProps = {
      price: "Preço da viagem",
      origin: "Origem da viagem",
      reward: "Bonus da viagem",
      favorite: "Mostra quando a viagem for para motorista favorito",
      destination: "Destino da viagem",
      paymentForm: "Forma de pagamento",
      estimatedTime: "Estimativa de tempo do motorista até o cliente",
      estimatedDistance: "Distância do motorista até cliente",
      quantityWaypoints: "Quantidade de paradas",
      ratingCustomer: "Nota do cliente",
      quantityTripsCustomer: "Quantidade de viagens do cliente",
    };

    return traduction[description];
  };

  const changeValue = (val: boolean, index: number) => {
    setSwitchValues(
      switchValues.map((res: FieldsCalledDriverProps) => {
        if (switchValues[index].description == res.description) {
          res.value = val;
        }
        return res;
      })
    );
  };

  const mountCollapseItems = (values: ValuesProps) => {
    const organizeValue = Object.keys(values).map((_, index: number) => {
      return {
        description: translate(Object.keys(values)[index]),
        value: !!Object.values(values)[index],
        key: Object.keys(values)[index],
      };
    });
    setSwitchValues(organizeValue);
  };

  const saveChanges = () => {
    const transformedData: TransformedData = {
      enabledDriverFields: {
        accept: {},
      },
    };

    switchValues.map((item) => {
      transformedData.enabledDriverFields.accept[item.key] = item.value;
    });

    sendRequest(transformedData);
  };

  useEffect(() => {
    mountCollapseItems((item.value as Accept).accept);
  }, [item]);

  return (
    <Container>
      <Collapse ghost>
        <Panel header={item.description} key="1">
          <Content>
            <div>
              <ContentItems>
                {switchValues.map(
                  (res: FieldsCalledDriverProps, index: number) => {
                    return (
                      <div key={index}>
                        <div style={{ margin: 5 }}>
                          <Switch
                            checked={res.value}
                            size="small"
                            onChange={(e) => changeValue(e, index)}
                          />
                        </div>
                        <div style={{ margin: 5 }}>
                          <Label>{res.description}</Label>
                        </div>
                      </div>
                    );
                  }
                )}
              </ContentItems>

              <ContentButtonSave>
                <Button
                  type="primary"
                  onClick={saveChanges}
                  style={{
                    width: "100%",
                  }}
                >
                  Salvar
                </Button>
              </ContentButtonSave>
            </div>

            <ContentSimulatorApp>
              <SimulatorScreenInitial
                colorPrimary={undefined}
                colorSecond={undefined}
                colorText={undefined}
                nameScreen="called_driver"
                fieldsCalledDriver={switchValues}
              />
            </ContentSimulatorApp>
          </Content>
        </Panel>
      </Collapse>
    </Container>
  );
};

export default CardCollapse;
