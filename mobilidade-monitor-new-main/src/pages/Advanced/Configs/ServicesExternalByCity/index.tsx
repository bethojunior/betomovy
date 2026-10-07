import { Collapse, Radio, Button, Input } from "antd";
import swal from "sweetalert";
import { AxiosError } from "axios";
import { useEffect, useState } from "react";

import { Container, ContentBtnSave, ContentInput, LabelInput, Loader  } from "./styles";
import api from "../../../../services/api";
import {
  FullyTypesServicesProps,
  ExternalServicesProps,
  ExternalServiceMetaDataProps,
} from "./types";
import Session from "../../../../utils/Session";
import Utils from "../../../../utils/Utils";

import Preload from "../../../../components/Utils/Preload";

export const ServicesExternalByCity = () => {
  const [externalServices, setExternalServices] = useState<
    FullyTypesServicesProps[]
  >([]);
  const [selectedService, setSelectedService] =
    useState<ExternalServicesProps | null>(null);
  const [serviceName, setServiceName] = useState<string>("");
  const [selectedRadioValue, setSelectedRadioValue] = useState<string | null>(
    null
  );
  const [loading, setLoading] = useState<boolean>(false);

  const { formatStringToKeyObject } = Utils;
  const cityId = Session.getLocal("citySelected").cityId;

  const getExternalServices = async () => {
    setLoading(true);
    try {
      const responseExternalServices = await api.get(
        `externalServiceType/fully?cityId=${cityId}`
      );
      if (responseExternalServices.status) {
        const externalServicesFormated =
          responseExternalServices.data.response.map(
            (value: FullyTypesServicesProps) => {
              return {
                ...value,
                key: formatStringToKeyObject(value.name),
              };
            }
          );
        setExternalServices(externalServicesFormated);
        externalServicesFormated.forEach((service: FullyTypesServicesProps) => {
          const activeService = service.external_services.find(
            (s: ExternalServicesProps) =>
              s.active === 1 && s.name === selectedService?.name
          );

          if (activeService) {
            setSelectedService(activeService);
            setSelectedRadioValue(JSON.stringify(activeService));
            setServiceName(service.name);
          }
        });
      }
    } catch (error) {
      const responseError = error as AxiosError;
      swal({
        title: "Error",
        text: responseError.response?.data.message,
        icon: "error",
      });
      console.error(error);;
  } finally {
    setLoading(false); 
  }
};

  const handleSaveExternalsByCity = async (
    informationService: FullyTypesServicesProps
  ) => {
    let ObjectSend: ExternalServiceMetaDataProps[] | any = [];
    let idService: number | null = null;

    if (informationService.external_services.length > 1 && selectedService) {
      idService = selectedService.id;
      ObjectSend = selectedService?.external_service_meta_data.map(
        (response) => {
          return {
            key: response.key,
            value: response.value,
          };
        }
      );
    } else {
      informationService.external_services.forEach((value) => {
        idService = value.id;
        const valueFormated = value.external_service_meta_data.map(
          (metaData) => {
            return {
              key: metaData.key,
              value: metaData.value,
            };
          }
        );
        ObjectSend = valueFormated;
      });
    }

    const isAccept = await swal({
      title: "Aviso",
      text: "Você confirma a alteração do serviço?",
      icon: "info",
      buttons: ["Não", "Sim"],
    });

    if (isAccept) {
      setLoading(true);
      try {
        const response = await api.put(`externalService/${idService}/city`, {
          metadata: ObjectSend,
        });
        if (response.status) {
          swal({
            title: "Sucesso",
            text: "Serviço alterado com sucesso",
            icon: "success",
          });
          await getExternalServices();
        }
      } catch (error) {
        const responseError = error as AxiosError;
        console.error(error);
        swal({
          title: "Error",
          text: responseError.response?.data.response[0],
          icon: "error",
        });
      } finally {
        setLoading(false);
      }
    }
  };

  const showInputsKeys = (service: ExternalServicesProps, name: string) => {
    setSelectedService(service);
    setServiceName(name);
    setSelectedRadioValue(JSON.stringify(service));
  };

  const renderizeLabels = (data: FullyTypesServicesProps) => {
    if (data.external_services.length > 1) {
      return (
        <Radio.Group
          onChange={(event) =>
            showInputsKeys(JSON.parse(event.target.value), data.name)
          }
          value={selectedRadioValue}
        >
          {data.external_services.map((value) => {
            return (
              <Radio
                key={value.id}
                value={JSON.stringify(value)}
                checked={selectedRadioValue === JSON.stringify(value)}
              >
                {value.name}
              </Radio>
            );
          })}
        </Radio.Group>
      );
    } else {
      return <span>{data.external_services[0].name}</span>;
    }
  };

  const handleInputChange = (
    serviceId: number,
    metaId: number,
    newValue: string
  ) => {
    if (externalServices) {
      const updatedServices = externalServices.map((oldValue) => {
        if (oldValue.id === serviceId) {
          const updatedExternalServices = oldValue.external_services.map(
            (value) => {
              const updatedMetaData = value.external_service_meta_data.map(
                (response) => {
                  if (response.id === metaId) {
                    return {
                      ...response,
                      value: newValue,
                    };
                  }
                  return response;
                }
              );

              return {
                ...value,
                external_service_meta_data: updatedMetaData,
              };
            }
          );

          return {
            ...oldValue,
            external_services: updatedExternalServices,
          };
        } else {
          return oldValue;
        }
      });

      setExternalServices(updatedServices);
    }
  };

  useEffect(() => {
    getExternalServices();
  }, []);

  // console.log(JSON.parse(selectedRadioValue));

  if (loading) return <Loader spinning />;

  return (
    <Container>
      <Preload visible={loading} />
      <Collapse
        accordion
        onChange={(key) => {
          const index = externalServices.findIndex(
            (service) => service.id === parseInt(key[0])
          );
          const typeServiceSelected = externalServices[index];
          if (typeServiceSelected) {
            setServiceName(typeServiceSelected.name);
            const activeService = typeServiceSelected.external_services.find(
              (s) => s.active === 1
            );
            if (activeService) {
              setSelectedService(activeService);
              setSelectedRadioValue(JSON.stringify(activeService));
            }
          }
        }}
      >
        {externalServices.map((value) => {
          return (
            <Collapse.Panel header={value.name} key={value.id}>
              {renderizeLabels(value)}

              {value.external_services.length <= 1
                ? value.external_services.map((response) =>
                    response.external_service_meta_data.map((data) => (
                      <ContentInput key={data.id}>
                        <LabelInput>{data.description}</LabelInput>
                        <Input
                          type="text"
                          value={data.value || ""}
                          onChange={(event) =>
                            handleInputChange(
                              value.id,
                              data.id,
                              event.target.value
                            )
                          }
                        />
                      </ContentInput>
                    ))
                  )
                : selectedService &&
                  serviceName === value.name &&
                  selectedRadioValue &&
                  selectedService.external_service_meta_data.map((metaData) => (
                    <ContentInput key={metaData.id}>
                      <LabelInput>{metaData.description}</LabelInput>
                      <Input
                        type="text"
                        value={metaData.value || ""}
                        onChange={(event) => {
                          const newValue = event.target.value;
                          setSelectedService((prev) => ({
                            ...prev!,
                            external_service_meta_data:
                              prev!.external_service_meta_data.map((item) =>
                                item.id === metaData.id
                                  ? { ...item, value: newValue }
                                  : item
                              ),
                          }));
                        }}
                      />
                    </ContentInput>
                  ))}

              <ContentBtnSave>
                <Button
                  type="primary"
                  onClick={() => handleSaveExternalsByCity(value)}
                >
                  Salvar
                </Button>
              </ContentBtnSave>
            </Collapse.Panel>
          );
        })}
      </Collapse>
    </Container>
  );
};
