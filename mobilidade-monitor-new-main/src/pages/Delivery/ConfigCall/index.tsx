import { AxiosError } from "axios";
import { useEffect, useState } from "react";
import api from "../../../services/api";
import { Loader } from "./styles";
import { Alertype, ListConfig } from "./types";
import Alert from "../../../components/Utils/Alert";
import ConfigCard from "../../../components/Delivery/ConfigCall/ConfigCard";
import Preload from "../../../components/Utils/Preload";

const ConfigCall = () => {
  const [messageAlert, setMessageAlert] = useState("");
  const [showAlert, setShowAlert] = useState(false);
  const [typeAlert, setTypeAlert] = useState<Alertype>("success");
  const [loading, setLoading] = useState(false);

  const [listConfig, setListConfig] = useState<ListConfig[]>([]);

  const sendAlert = (message: string, type: Alertype) => {
    setMessageAlert(message);
    setTypeAlert(type);
    setShowAlert(true);
  };

  const getAll = async () => {
    try {
      setLoading(true);
      const result = await api.get("deliveryCallConfig");
      setLoading(false);
      const { data } = result;
      if (data?.status) {
        setListConfig(Array.isArray(data.response) ? data.response : []);
      }
    } catch (error) {
      const axiosError = error as AxiosError;
      setLoading(false);
      sendAlert("Erro ao buscar configurações", "warning");
      console.error(axiosError);
    }
  };

  useEffect(() => {
    getAll();
  }, []);

  if (loading && listConfig.length === 0) return <Loader spinning />;

  return (
    <>
      <Preload visible={loading} />
      <Alert
        visibility={showAlert}
        message={messageAlert}
        typeAlert={typeAlert}
        setVisibility={setShowAlert}
      />
      <div>
        {(listConfig || []).map((item) => {
          return (
            <ConfigCard
              key={item.id}
              item={item}
              sendAlert={sendAlert}
              setLoading={setLoading}
            />
          );
        })}
      </div>
    </>
  );
};

export default ConfigCall;
