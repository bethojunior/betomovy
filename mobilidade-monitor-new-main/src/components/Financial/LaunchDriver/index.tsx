import { Button, Input, Radio, Select } from "antd";
import { FC, useEffect, useState } from "react";
import {
  Buton,
  ConfigReleaseDriverContent,
  Content,
  Inputt,
  Label,
  Text,
} from "./styles";
import {
  searchableType,
  userType,
} from "../../../pages/Financial/Charge/types";
import Mask from "../../../services/Mask";

interface Props {
  userTypeDriver: userType[];
  searchableList: searchableType[];
  doLaunch: (
    balanceFlowTypeId: string,
    billingDay: string,
    value: string,
    userTypeDriverSelected: string | null
  ) => void;
  isDone: boolean;
}

export const LaunchDriver: FC<Props> = ({
  userTypeDriver,
  searchableList,
  doLaunch,
  isDone,
}) => {
  const [quantity, setQuantity] = useState(1);
  const [userTypeDriverSelected, setUserTypeDriverSelected] = useState<
    string | null
  >(null);
  const [balanceFlowTypeId, setBalanceFlowTypeId] = useState<string>("");
  const [billingDay, setBillingDay] = useState<string>("");
  const [value, setValue] = useState<string>("0,00");

  const { Option } = Select;

  useEffect(() => {
    if (isDone) {
      setQuantity(1);
      setUserTypeDriverSelected(null);
      setBalanceFlowTypeId("");
      setBillingDay("");
      setValue("");
    }
  }, [isDone]);

  return (
    <Content>
      <div style={{ display: "grid" }}>
        {userTypeDriver?.map((item: userType) => {
          return (
            <Buton
              key={item.idUserType}
              type="default"
              onClick={() => {
                setUserTypeDriverSelected(item.idUserType);
              }}
            >
              <p>{item.name}</p>
            </Buton>
          );
        })}
      </div>

      <ConfigReleaseDriverContent visible={userTypeDriverSelected !== null}>
        <div style={{ display: "block" }}>
          <Label>Selecione como deve ser inserido</Label>
          <Select
            style={{
              width: "100%",
            }}
            defaultValue="Selecione um tipo de chamado"
            onChange={(e) => {
              setBalanceFlowTypeId(e);
            }}
          >
            {searchableList?.map((type: searchableType) => {
              return (
                <Option
                  key={type.idBalanceFlowType}
                  value={type.idBalanceFlowType}
                >
                  {type.name}
                </Option>
              );
            })}
          </Select>

          <Label>Valor</Label>
          <Input
            placeholder="0,00"
            style={{ width: 150 }}
            value={value}
            onChange={(e) => {
              setValue(Mask.setMaskMoney(e.target.value));
            }}
          />

          <Label>Quantidade</Label>
          <Radio.Group defaultValue={1}>
            <div>
              <Radio
                key={1}
                onChange={(e) => {
                  setQuantity(e.target.value);
                }}
                value={1}
              >
                <Text>Única vez</Text>
              </Radio>
              <Radio
                key={2}
                onChange={(e) => {
                  setQuantity(e.target.value);
                }}
                value={2}
              >
                <div style={{ display: "flex" }}>
                  <Text>Recorrente dia</Text>
                  <Inputt
                    type="number"
                    defaultValue="1"
                    disabled={quantity === 1}
                    onChange={(e) => {
                      setBillingDay(e.target.value);
                    }}
                  />
                </div>
              </Radio>
            </div>
          </Radio.Group>
        </div>
        <Button
          type="primary"
          onClick={() =>
            doLaunch(
              balanceFlowTypeId,
              billingDay,
              value,
              userTypeDriverSelected
            )
          }
        >
          Adicionar
        </Button>
      </ConfigReleaseDriverContent>
    </Content>
  );
};
