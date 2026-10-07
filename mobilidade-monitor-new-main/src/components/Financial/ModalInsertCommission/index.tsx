import { Modal, Input, Radio, SelectProps, Button } from "antd";
import { AxiosError } from "axios";
import {
  Container,
  ContentInput,
  InputFullWidth,
  LabelText,
  Row,
  RowCitiesScope,
  SelectFullWidth,
  TextObs,
} from "./styles";

import api from "../../../services/api";

import { useState, useContext, useEffect } from "react";

import swal from "sweetalert";

import { TripTravelsProps } from "../../../pages/Financial/CommissionManagement/types";
import Session from "../../../utils/Session";
import AuthContext from "../../../contexts/auth";
import { FINANCEIRO } from "../../../constants/permissions";

interface ModalInsertCommissionProps {
  visible: boolean;
  setVisible: (data: boolean) => void;
  tripTypes: TripTravelsProps[];
  setLoading: (data: boolean) => void;
  getCommissions: () => void;
  getTypesTrips: () => void;
}

export const ModalInsertCommission = ({
  visible,
  setVisible,
  tripTypes,
  setLoading,
  getCommissions,
  getTypesTrips,
}: ModalInsertCommissionProps) => {
  const { hasPermission } = useContext(AuthContext);
  const canCreateMonetizationAllCities = hasPermission(
    FINANCEIRO,
    "criar_monetizacao_todas_cidades"
  );
  const [bonusDestination, setBonusDestination] = useState("0");
  const [typeSelects, setTypeSelects] = useState<string>("0");
  const [typeValue, setTypeValue] = useState<string>("$");
  const [loadingButton, setLoadingButton] = useState<boolean>(false);

  const [nameClass, setNameClass] = useState<string>("");
  const [quantityIndications, setQuantityIndications] = useState<string>("");
  const [valueMonetization, setValueMonetization] = useState<number | null>(
    null
  );
  const [idsTripTypes, setIdsTripTypes] = useState<number[]>([]);

  const citySelected = Session.getLocal("citySelected");

  useEffect(() => {
    if (visible && !canCreateMonetizationAllCities) {
      setTypeSelects("0");
    }
  }, [visible, canCreateMonetizationAllCities]);

  const mountTripTypes = () => {
    const items = idsTripTypes.map((value) => {
      return {
        backToTripBalance: bonusDestination,
        tripTypeId: String(value),
        value: String(valueMonetization),
        valueType: typeValue,
      };
    });

    return items;
  };

  const handleInsertCommission = async () => {
    setLoadingButton(true);
    setLoading(true);
    try {
      const responseCommission = await api.post(
        `referralMonetization?cityId=${citySelected.cityId}`,
        {
          cityId: typeSelects === "0" ? citySelected.cityId : null,
          indications: quantityIndications,
          label: nameClass,
          method: "POST",
          tripTypes: mountTripTypes(),
        }
      );

      if (responseCommission.status) {
        swal({
          title: "Inserido com sucesso!",
          icon: "success",
        });
        getCommissions();
        getTypesTrips();
        setVisible(false);
      }
    } catch (error) {
      const responseError = error as AxiosError;

      swal({
        title: responseError.response?.data.message,
        icon: "error",
      });
    } finally {
      setLoadingButton(false);
      setLoading(false);
    }
  };

  const listOptionsTripsTypes: SelectProps["options"] = tripTypes.map(
    (value) => {
      return {
        value: value.idTripType,
        label: value.type,
      };
    }
  );

  return (
    <Modal
      width={1000}
      title="Monetização"
      open={visible}
      onCancel={() => setVisible(false)}
      footer={[
        <Button onClick={() => setVisible(false)}>Cancelar</Button>,
        <Button type="primary" loading={loadingButton} onClick={handleInsertCommission}>
          Inserir
        </Button>,
      ]}
    >
      <Container>
        <Row>
          <ContentInput>
            <LabelText>Classe</LabelText>
            <Input
              type="text"
              value={nameClass}
              onChange={(event) => setNameClass(event.target.value)}
            />
            <TextObs>Nomenclatura para nível da monetização</TextObs>
          </ContentInput>

          <ContentInput>
            <LabelText>Indicações</LabelText>
            <InputFullWidth
              type="text"
              value={quantityIndications}
              onChange={(event) => setQuantityIndications(event.target.value)}
            />
            <TextObs>Quantidade de indicações</TextObs>
          </ContentInput>

          <ContentInput>
            <LabelText>Destino do bônus</LabelText>
            <Radio.Group
              onChange={(event) => setBonusDestination(event.target.value)}
              value={bonusDestination}
            >
              <Radio value="0">Saldo em Conta</Radio>
              <Radio value="1">Voucher (apenas cliente)</Radio>
            </Radio.Group>
          </ContentInput>
        </Row>
        <Row>
          <ContentInput>
            <LabelText>Tipo de corrida</LabelText>
            <SelectFullWidth
              mode="multiple"
              onChange={(idsTripType) =>
                setIdsTripTypes(idsTripType as number[])
              }
              options={listOptionsTripsTypes}
            />
          </ContentInput>

          <ContentInput>
            <LabelText>Valor</LabelText>
            <Input
              type="number"
              value={Number(valueMonetization)}
              onChange={(event) =>
                setValueMonetization(Number(event.target.value))
              }
            />
            <TextObs>Valor da comissão</TextObs>
          </ContentInput>

          <ContentInput>
            <Radio.Group
              onChange={(event) => setTypeValue(event.target.value)}
              value={typeValue}
            >
              <Radio value="$">$</Radio>
              <Radio value="%">%</Radio>
            </Radio.Group>
          </ContentInput>
        </Row>

        {canCreateMonetizationAllCities && (
          <RowCitiesScope>
            <ContentInput>
              <Radio.Group
                onChange={(event) => setTypeSelects(event.target.value)}
                value={typeSelects}
              >
                <Radio value="0">Cidade selecionada</Radio>
                <Radio value="1">Todas as cidades</Radio>
              </Radio.Group>
            </ContentInput>
          </RowCitiesScope>
        )}
      </Container>
    </Modal>
  );
};
