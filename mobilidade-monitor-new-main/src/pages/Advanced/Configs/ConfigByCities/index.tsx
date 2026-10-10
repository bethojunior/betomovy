import { FC, useEffect, useState } from "react";
import CardNumber from "../../../../components/Advanced/Config/ByCity/Cards/Number";
import CardPhone from "../../../../components/Advanced/Config/ByCity/Cards/Phone";
import CardEmail from "../../../../components/Advanced/Config/ByCity/Cards/Email";
import CardLink from "../../../../components/Advanced/Config/ByCity/Cards/Link";
import CardSwitch from "../../../../components/Advanced/Config/ByCity/Cards/Switch";
import CardTimezone from "../../../../components/Advanced/Config/ByCity/Cards/Timezone";
import CardCurrency from "../../../../components/Advanced/Config/ByCity/Cards/Currency";
import CardPrepaid from "../../../../components/Advanced/Config/ByCity/Cards/Prepaid";
import CardTextarea from "../../../../components/Advanced/Config/ByCity/Cards/Textarea";
import api from "../../../../services/api";
import { Body, ErrorLoadingData, MessageError, Div, Loader } from "./styles";
import Alert from "../../../../components/Utils/Alert";
import Session from "../../../../utils/Session";
import Preload from "../../../../components/Utils/Preload";
import Utils from "../../../../utils/Utils";
import CardCollapse from "../../../../components/Advanced/Config/ByCity/Cards/Collapse";
import { ConfigCitiesList, InputTypeProps } from "./types";
import { isWhatsAppZafiraTemplateAttribute } from "./constants";

const ConfigByCities: FC = () => {
  const [loading, setLoading] = useState(false);
  const [defaultCity, setDefaultCity] = useState("");
  const [messageAlert, setMessageAlert] = useState("");
  const [showAlert, setShowAlert] = useState(false);
  const [typeAlert, setTypeAlert] = useState<
    "success" | "info" | "warning" | "error"
  >("success");

  const [configCitiesList, setConfigCitiesList] = useState<ConfigCitiesList>(
    []
  );
  const [showData, setShowData] = useState(false);
  const [renderKey, setRenderKey] = useState(0);

  useEffect(() => {
    setLoading(true);
    const city = Session.getLocal("citySelected").cityId;
    setDefaultCity(city);
    setShowData(false);
    loadConfigData();
    setLoading(false);
  }, []);

  const onSearch = (
    value: string | boolean,
    attribute: string,
    inputType: string
  ) => {
    const data: InputTypeProps = {};

    if (attribute === "marginForRecalculation") {
      const valueRecalculationFromKm = configCitiesList.find(item =>  
        item.attribute === "recalculationFromKm"
      )?.value


      if (valueRecalculationFromKm && valueRecalculationFromKm < value) {
        setTypeAlert("warning");
        setMessageAlert(
          "O campo (Margem para recálculo em km) não pode ser maior que o campo (Realizar recálculo na viagem a partir de (km))"
        );
        setShowAlert(true);
        return;
      }
    }

    if (inputType === "number") {
      if (value === "") {
        setTypeAlert("warning");
        setMessageAlert("Esse campo não pode ser vazio");
        setShowAlert(true);
        return;
      }
    }
    if (inputType === "link") {
      if (value !== "") {
        if (!Utils.checkURLIsValid(String(value))) {
          setTypeAlert("warning");
          setMessageAlert("O link informado é inválido");
          setShowAlert(true);
          return;
        }
      }
    }
    if (inputType === "tel") {
      if (value !== "") {
        if (attribute !== "securityContactNumber") {
          const isValid = /^\+?\d{10,15}$/.test(String(value));

          if (!isValid) {
            setTypeAlert("warning");
            setMessageAlert("O telefone informado é inválido");
            setShowAlert(true);
            return;
          }
        }
      }
    }
    if (inputType === "email") {
      if (value !== "") {
        if (!Utils.checkIfEmailIsValid(String(value))) {
          setTypeAlert("warning");
          setMessageAlert("O email informado é inválido");
          setShowAlert(true);
          return;
        }
      }
    }
    if (inputType === "boolean") {
      if (isWhatsAppZafiraTemplateAttribute(attribute)) {
        setTypeAlert("warning");
        setMessageAlert("Este campo é um template de texto, não um interruptor");
        setShowAlert(true);
        return;
      }
      const finalValue = value === true ? "1" : "0";
      data[attribute] = finalValue;

      if (attribute === "enableSearchDriver" && finalValue === "0") {
        const scheduleConfig = configCitiesList.find(
          (config) => config.attribute === "enableTripScheduled"
        );
        if (scheduleConfig && scheduleConfig.value !== "1") {
          data["enableTripScheduled"] = "1";
        }
      }

      if (attribute === "enableTripScheduled" && finalValue === "0") {
        const searchDriverConfig = configCitiesList.find(
          (config) => config.attribute === "enableSearchDriver"
        );
        if (searchDriverConfig && searchDriverConfig.value !== "1") {
          data["enableSearchDriver"] = "1";
        }
      }
    } else {
      data[attribute] = value;
    }
    sendRequest(data);
  };

  const loadConfigData = () => {
    const selected = Session.getLocal("citySelected");
    const city = selected?.cityId ?? selected?.id;
    if (!city) return Promise.resolve();
    return api.get(`city/${city}/config`).then((values) => {
      if (!values?.data?.status && values?.status !== 200) {
        return "";
      }
      if (values.status !== 200) {
        return setShowData(true);
      }
      setConfigCitiesList(values.data.response || values.data.data || []);
      setRenderKey(prev => prev + 1);
    }).catch(() => {
      setShowData(true);
    });
  };

  const sendRequest = (data: string | boolean | {}) => {
    setLoading(true);
    api.put(`/city/${defaultCity}/config`, data).then((values) => {
      if (values.status !== 200) {
        setShowAlert(true);
        setTypeAlert("error");
        setLoading(false);
        return setMessageAlert(
          "Não foi possível alterar a configuração, tente novamente"
        );
      }
      
      loadConfigData().then(() => {
        setShowAlert(true);
        setTypeAlert("success");
        setMessageAlert("Configuração atualizada com sucesso");
        setLoading(false);
        setRenderKey(prev => prev + 1);
      });
    }).catch(() => {
      setShowAlert(true);
      setTypeAlert("error");
      setLoading(false);
      setMessageAlert(
        "Erro ao alterar a configuração, tente novamente"
      );
    });
  };

  if (loading) return <Loader spinning />;

  return (
    <Div>
      <Preload visible={loading} />
      {showData === true ? (
        <ErrorLoadingData>
          <MessageError>Não foi possível carregar os dados</MessageError>
        </ErrorLoadingData>
      ) : (
        <Body>
          <Alert
            visibility={showAlert}
            message={messageAlert}
            typeAlert={typeAlert}
            setVisibility={setShowAlert}
          />
          {configCitiesList.map((item) => {
            if (item.attribute === "timezone") {
              return (
                <CardTimezone
                  key={`${item.attribute}-${renderKey}`}
                  item={item}
                  onSearch={onSearch}
                />
              );
            }
            
            if (item.attribute === "typeMoney" || item.description.toLowerCase().includes("moeda") || item.description.toLowerCase().includes("currency")) {
              return (
                <CardCurrency
                  key={`${item.attribute}-${renderKey}`}
                  item={item}
                  onSearch={onSearch}
                />
              );
            }
            
            if (item.attribute === "prepayPerPeriod" || item.description.toLowerCase().includes("pré-pago") || item.description.toLowerCase().includes("prepago") || item.description.toLowerCase().includes("prepaid")) {
              return (
                <CardPrepaid
                  key={`${item.attribute}-${renderKey}`}
                  item={item}
                  onSearch={onSearch}
                />
              );
            }

            if (
              isWhatsAppZafiraTemplateAttribute(item.attribute) ||
              item.inputType === "textarea"
            ) {
              return (
                <CardTextarea
                  key={`${item.attribute}-${renderKey}`}
                  item={item}
                  onSearch={onSearch}
                />
              );
            }

            switch (item.inputType) {
              case "number": {
                return (
                  <CardNumber
                    key={`${item.attribute}-${renderKey}`}
                    item={item}
                    onSearch={onSearch}
                  />
                );
              }
              case "tel": {
                return (
                  <CardPhone
                    key={`${item.attribute}-${renderKey}`}
                    item={item}
                    onSearch={onSearch}
                  />
                );
              }
              case "email": {
                return (
                  <CardEmail
                    key={`${item.attribute}-${renderKey}`}
                    item={item}
                    onSearch={onSearch}
                  />
                );
              }
              case "link": {
                return (
                  <CardLink
                    key={`${item.attribute}-${renderKey}`}
                    item={item}
                    onSearch={onSearch}
                  />
                );
              }

              case "json": {
                return <CardCollapse key={`${item.attribute}-${renderKey}`} item={item} sendRequest={sendRequest} />;
              }

              case "boolean":
              default: {
                return (
                  <CardSwitch
                    key={`${item.attribute}-${renderKey}`}
                    item={item}
                    onSearch={onSearch}
                  />
                );
              }
            }
          })}
        </Body>
      )}
    </Div>
  );
};

export default ConfigByCities;
