import { FC, useEffect, useRef, useState } from "react";
import { Button, Checkbox, Form, Input, Modal, Radio, Select } from "antd";
import { IoIosAdd, IoIosRemove } from "react-icons/io";
import Resizer from "react-image-file-resizer";
import swal from "sweetalert";
import Blank from "../../../../../../assets/blank.png";
import api from "../../../../../../services/api";
import Alert from "../../../../../Utils/Alert";
import Preload from "../../../../../Utils/Preload";
import {
  ContentButton,
  ContentButtonIcon,
  ContentImage,
  InputFile,
  ModalBody,
} from "./styles";
import {
  IConfigAppPartnersProps,
  IUserTypePartnerLinkedProps,
} from "../TripType/types";

interface ValuesForm {
  exclusivity: string | Blob;
  iconMap: string | Blob;
  vehicleType: "car" | "bike";
  image: {
    target: {
      files: [Blob];
    };
  };
  name: string;
  status: undefined | boolean;
  boardingText: string;
  inProgressText: string;
  cancellationText: string;
  acceptedText: string;
  appsPartners?: string[];
}
interface Driver {
  description: string;
  iconMapDriverId: number;
  acceptedText?: string;
  boardingText?: string;
  inProgressText?: string;
  cancellationText?: string;
  idUserType: number;
  isActive: number;
  isDeliveryMan: number;
  isDriver: number;
  name: string;
  picture: string;
  user_type_linked_app_partner?: IUserTypePartnerLinkedProps[];
  vehicleType?: string | null;
}

interface Icon {
  id: number;
  link: string;
  statusId: number;
}

interface ModalProps {
  visibility: boolean;
  setVisibility(visibility: boolean): void;
  titleModal: string;
  icon: Icon[];
  loadInformation: () => void;
  driverSelected: Driver | undefined;
  typeModal: string;
  optionsAppPartners: IConfigAppPartnersProps[];
}

const DriverTypeModal: FC<ModalProps> = ({
  visibility,
  setVisibility,
  titleModal,
  icon,
  loadInformation,
  driverSelected,
  typeModal,
  optionsAppPartners,
}) => {
  const [loading, setLoading] = useState(false);
  const [showAlert, setShowAlert] = useState(false);
  const [messageAlert, setMessageAlert] = useState("");
  const [typeAlert, setTypeAlert] = useState<
    "success" | "info" | "warning" | "error"
  >("success");
  const [selectedFile, setSelectedFile] = useState<string | FileList | null>();
  const [renderImage, setRenderImage] = useState(false);
  const [whatRender, setWhatRender] = useState<string>();
  const [iconSelected, setIconSelected] = useState(1);
  const [appPartnersDefault, setAppPartnersDefault] = useState<
    IUserTypePartnerLinkedProps[]
  >([]);
  const [idsAppPartners, setIdsAppPartners] = useState<number[]>([]);

  const [form] = Form.useForm();
  const inputFile = useRef() as React.MutableRefObject<HTMLInputElement>;

  const hasAppPartner = import.meta.env.APP_PARTNER === "true";

  const handleSelectAppPartner = (appsPartners: string[]) => {
    const idsPartners = appsPartners.map((appPartner) => {
      return JSON.parse(appPartner).id;
    });

    setIdsAppPartners(idsPartners);
  };

  const resizeFile = (file: Blob, width: number, heigth: number) =>
    new Promise((resolve) => {
      Resizer.imageFileResizer(
        file,
        width,
        heigth,
        "PNG",
        100,
        0,
        (uri) => {
          resolve(uri);
        },
        "blob"
      );
    });

  useEffect(() => {
    if (selectedFile && renderImage) {
      setWhatRender(URL.createObjectURL(selectedFile[0] as File));
    } else {
      setWhatRender(Blank);
    }
  }, [selectedFile, renderImage]);

  useEffect(() => {
    if (typeModal === "edit" && visibility) {
      form.setFieldsValue({
        name: driverSelected?.name,
        acceptedText: driverSelected?.acceptedText,
        boardingText: driverSelected?.boardingText,
        inProgressText: driverSelected?.inProgressText,
        cancellationText: driverSelected?.cancellationText,
        vehicleType: driverSelected?.vehicleType || "car",
        status: Number(driverSelected?.isActive) === 1,
        iconMap: driverSelected?.iconMapDriverId,
        exclusivity: driverSelected?.isDeliveryMan,
        image: driverSelected?.picture,
      });

      setRenderImage(false);
      setSelectedFile(driverSelected?.picture);
    } else if (typeModal === "create" && visibility) {
      const defaultIconId = icon && icon.length > 0 ? icon[0].id : 1;
      form.setFieldsValue({
        iconMap: defaultIconId,
        vehicleType: "car",
        status: true,
        acceptedText: "Seu motorista vai chegar em breve",
        boardingText: "Seu carro está te aguardando",
        inProgressText: "Você está no percurso do seu destino",
        cancellationText: "Sua viagem foi cancelada",
        exclusivity: "0",
      });
      setIconSelected(defaultIconId);
      setRenderImage(false);
      setSelectedFile(null);
    }
  }, [driverSelected, visibility, typeModal, form, icon]);

  useEffect(() => {
    if (driverSelected?.user_type_linked_app_partner) {
      const ids = driverSelected.user_type_linked_app_partner.map(
        (response) => {
          return response.config_apps_partners_id;
        },
      );

      setIdsAppPartners(ids);
      setAppPartnersDefault(driverSelected.user_type_linked_app_partner);
    } else {
      setIdsAppPartners([]);
      setAppPartnersDefault([]);
    }
  }, [driverSelected]);

  const createTypeDriver = (values: ValuesForm) => {
    setLoading(true);

    const submitCreate = (pictureBlob?: Blob | null) => {
      const formData = new FormData();
      if (pictureBlob) {
        formData.append("picture", pictureBlob);
      }
      formData.append("name", values.name);
      formData.append("boardingText", values.boardingText || "Seu carro está te aguardando");
      formData.append("acceptedText", values.acceptedText || "Seu motorista vai chegar em breve");
      formData.append("inProgressText", values.inProgressText || "Você está no percurso do seu destino");
      formData.append("cancellationText", values.cancellationText || "Sua viagem foi cancelada");
      formData.append("vehicleType", values.vehicleType || "car");
      formData.append("isActive", values.status === true ? "1" : "0");
      formData.append("iconMapDriverId", values.iconMap ? String(values.iconMap) : "1");
      formData.append(
        "isDeliveryMan",
        import.meta.env.ISSPEEDMOB == "true" ? "0" : (values.exclusivity ? String(values.exclusivity) : "0")
      );

      idsAppPartners.forEach((id) => {
        formData.append("idsAppPartners[]", String(id));
      });

      const config = {
        headers: {
          accept: "application/json",
          "Content-Type": `multipart/form-data`,
        },
      };

      api.post("userType", formData, config)
        .then((value) => {
          setLoading(false);
          if (!value.data?.status) {
            setMessageAlert(
              value.data?.message || "Não foi possível criar o tipo de motorista, tente novamente"
            );
            setTypeAlert("error");
            return setShowAlert(true);
          }

          form.resetFields();
          setSelectedFile(null);
          setMessageAlert("Tipo de motorista criado com sucesso!");
          setTypeAlert("success");
          setShowAlert(true);
          setVisibility(false);
          return loadInformation();
        })
        .catch((error) => {
          setLoading(false);
          setMessageAlert(error.response?.data?.message ?? "Não foi possível criar o tipo de motorista, tente novamente");
          setTypeAlert("error");
          setShowAlert(true);
        });
    };

    const rawFile = (selectedFile && typeof selectedFile !== "string" && selectedFile[0])
      || (values.image && (values.image as any)?.target?.files?.[0])
      || (values.image as any)?.[0];

    if (rawFile) {
      resizeFile(rawFile, 250, 250)
        .then((res) => submitCreate(res as Blob))
        .catch(() => submitCreate(null));
    } else {
      submitCreate(null);
    }
  };

  const updateTypeDriver = (values: ValuesForm) => {
    setLoading(true);
    const formData = new FormData();

    const config = {
      headers: {
        accept: "application/json",
        "Content-Type": `multipart/form-data`,
      },
    };

    const submitUpdate = async () => {
      const userTypeId = driverSelected?.idUserType;
      if (userTypeId === undefined) {
        setLoading(false);
        setMessageAlert("Ocorreu um erro, tente novamente");
        setTypeAlert("error");
        setShowAlert(true);
        return;
      }
      try {
        const response = await api.post(`userType/${userTypeId}`, formData, config);
        if (!response.data?.status) {
          throw new Error("A atualização inicial falhou.");
        }
        const statusToggle = values.status === true ? "enable" : "disable";
        const putResponse = await api.put(`userType/${userTypeId}/${statusToggle}`);
        if (!putResponse.data?.status) {
          setMessageAlert(
            "Dados salvos, mas não foi possível atualizar ativo/inativo. Use o interruptor na lista ou tente de novo."
          );
          setTypeAlert("error");
          setShowAlert(true);
          return;
        }
        form.resetFields();
        setSelectedFile(null);
        setMessageAlert("Tipo de motorista atualizado com sucesso!");
        setTypeAlert("success");
        setShowAlert(true);
        setVisibility(false);
        return loadInformation();
      } catch {
        setMessageAlert("Ocorreu um erro, tente novamente");
        setTypeAlert("error");
        setShowAlert(true);
      } finally {
        setLoading(false);
      }
    };

    if (typeof values.image === "string") {
      formData.append("name", values.name);
      formData.append("isActive", values.status === true ? "1" : "0");
      formData.append("iconMapDriverId", values.iconMap);
      formData.append("isDeliveryMan", values.exclusivity || "0");
      formData.append("boardingText", values.boardingText);
      formData.append("acceptedText", values.acceptedText);
      formData.append("inProgressText", values.inProgressText);

      idsAppPartners.forEach((id) => {
        formData.append("idsAppPartners[]", String(id));
      });
      formData.append("cancellationText", values.cancellationText);
      formData.append("vehicleType", values.vehicleType || "car");
      submitUpdate();
    } else {
      resizeFile(values.image.target.files[0], 250, 250).then((result) => {
        formData.append("picture", result as Blob);
        formData.append("name", values.name);
        formData.append("boardingText", values.boardingText);
        formData.append("acceptedText", values.acceptedText);
        formData.append("inProgressText", values.inProgressText);
        formData.append("cancellationText", values.cancellationText);
        formData.append("vehicleType", values.vehicleType || "car");
        formData.append("isActive", values.status === true ? "1" : "0");
        formData.append("iconMapDriverId", values.iconMap);
        formData.append(
          "isDeliveryMan",
          import.meta.env.ISSPEEDMOB == "true" ? "0" : values.exclusivity || "0"
        );

        idsAppPartners.forEach((id) => {
          formData.append("idsAppPartners[]", String(id));
        });
        submitUpdate();
      });
    }
  };

  const addIcon = (file: FileList | null) => {
    setLoading(true);
    if (file) {
      resizeFile(file[0], 60, 96).then((result) => {
        const data = {
          icon: result as Blob,
        };
        const formData = new FormData();
        formData.append("icon", data.icon);

        const config = {
          headers: {
            accept: "application/json",
            "Content-Type": `multipart/form-data`,
          },
        };

        api.post("iconMapDriver", formData, config).then((value) => {
          setLoading(false);
          if (!value.data.status) {
            setMessageAlert(
              "Não foi possível adicionar o novo ícone, tente novamente"
            );
            setTypeAlert("error");
            setShowAlert(true);
          }

          setMessageAlert("Ícone adicionado com sucesso!");
          setTypeAlert("success");
          setShowAlert(true);
          return loadInformation();
        });
      });
    }
  };

  const removeIcon = () => {
    swal({
      title: "Você realmente deseja excluir esse ícone?",
      icon: "warning",
      buttons: ["Cancelar", "Continuar"],
      dangerMode: true,
    }).then((answer) => {
      if (!answer) {
        return "";
      }
      setLoading(true);
      api.delete(`iconMapDriver/${iconSelected}`).then(({ status }) => {
        setLoading(false);
        if (!status) {
          setMessageAlert(
            "O ícone está vinculado a, pelo menos, um tipo de motorista"
          );
          setTypeAlert("warning");
          return setShowAlert(true);
        }

        setMessageAlert("Ícone removido com sucesso!");
        setTypeAlert("success");
        setShowAlert(true);
        return loadInformation();
      });
      return "";
    });
  };

  const optionsPartners = optionsAppPartners.map((value) => {
    return {
      label: value.name_app,
      value: JSON.stringify(value),
    };
  });

  const appsPartnersSelected = appPartnersDefault.map((response) => {
    return JSON.stringify(response.config_app_partners);
  });

  return (
    <>
      <Preload visible={loading} />
      <Alert
        visibility={showAlert}
        message={messageAlert}
        typeAlert={typeAlert}
        setVisibility={setShowAlert}
      />
      <Modal
        title={titleModal}
        open={visibility}
        footer={null}
        width={680}
        onCancel={() => {
          setVisibility(false);
          form.resetFields();
          setSelectedFile(null);
          setRenderImage(false);
        }}
        destroyOnClose
      >
        <ModalBody>
        <Form
          form={form}
          onFinish={
            typeModal === "create" ? createTypeDriver : updateTypeDriver
          }
          layout="vertical"
          name="form"
        >
          <Form.Item
            name="name"
            label="Nome"
            rules={[
              {
                required: true,
                message: "Insira o nome do tipo de motorista",
              },
            ]}
          >
            <Input />
          </Form.Item>
          <Form.Item
            name="vehicleType"
            label="Tipo de veículo"
            initialValue="car"
            rules={[
              {
                required: true,
                message: "Selecione o tipo de veículo",
              },
            ]}
          >
            <Radio.Group>
              <Radio value="car">Carro</Radio>
              <Radio value="bike">Moto</Radio>
            </Radio.Group>
          </Form.Item>
          {(typeModal === "create" || typeModal === "edit") && (
            <Form.Item name="status" valuePropName="checked">
              <Checkbox>Ativar categoria</Checkbox>
            </Form.Item>
          )}
          <ContentImage>
            <Form.Item
              name="image"
              label="Ícone do chamado"
              valuePropName="file"
              rules={[
                {
                  required: true,
                  message: "Escolha um ícone para o motorista",
                },
              ]}
            >
              <InputFile
                type="file"
                name="file"
                accept=".png, .jpg, .svg, .jpeg"
                onChange={(e) => {
                  setRenderImage(true);
                  setSelectedFile(e.target.files);
                }}
              />
            </Form.Item>
            {selectedFile && (
              <img
                src={
                  typeModal === "edit" && !renderImage
                    ? typeof selectedFile === "string"
                      ? selectedFile.startsWith("http") || selectedFile.startsWith("data:") || selectedFile.startsWith("blob:")
                        ? selectedFile
                        : `https://api.movymob.com/${selectedFile.replace(/^\/+/, "")}`
                      : whatRender || Blank
                    : whatRender || Blank
                }
                style={{
                  width: 100,
                  height: 100,
                  borderRadius: 5,
                  objectFit: "contain",
                }}
                alt="Ícone do chamado"
                onError={(e) => {
                  e.currentTarget.onerror = null;
                  e.currentTarget.src = Blank;
                }}
              />
            )}
          </ContentImage>
          <Form.Item
            name="iconMap"
            label="Ícone para exibição no mapa"
            rules={[
              {
                required: true,
                message: "Selecione o ícone do tipo de motorista",
              },
            ]}
          >
            <Radio.Group value={iconSelected}>
              {icon.map((item) => {
                const src =
                  !item.link || item.link.includes("minio.704app.com.br")
                    ? item.id === 2
                      ? "/icons/moto.png"
                      : "/icons/car.png"
                    : item.link;

                return (
                  <Radio
                    key={item.id}
                    onChange={(e) => setIconSelected(e.target.value)}
                    value={item.id}
                  >
                    <img
                      style={{
                        width: 32,
                        height: 32,
                        objectFit: "contain",
                        margin: 4,
                        verticalAlign: "middle",
                      }}
                      src={src}
                      alt={`icon-${item.id}`}
                      onError={(e) => {
                        e.currentTarget.onerror = null;
                        e.currentTarget.src =
                          item.id === 2 ? "/icons/moto.png" : "/icons/car.png";
                      }}
                    />
                  </Radio>
                );
              })}
            </Radio.Group>
          </Form.Item>
          <ContentButtonIcon>
            <Button
              onClick={() => inputFile.current?.click()}
              type="primary"
              style={{ marginRight: 20 }}
              icon={<IoIosAdd />}
            />

            <input
              type="file"
              onChange={(e) => addIcon(e.target.files)}
              accept=".svg, .png, .jpeg, .jpg"
              ref={inputFile}
              style={{ display: "none" }}
            />
            <Button
              type="primary"
              onClick={removeIcon}
              danger
              icon={<IoIosRemove />}
            />
          </ContentButtonIcon>
          <Form.Item
            name="acceptedText"
            label="Mensagem depois de aceitar viagem"
            rules={[
              {
                required: true,
                message: "Campo obrigatório",
              },
            ]}
          >
            <Input />
          </Form.Item>
          <Form.Item
            name="boardingText"
            label="Mensagem de embarque"
            rules={[
              {
                required: true,
                message: "Campo obrigatório",
              },
            ]}
          >
            <Input />
          </Form.Item>
          <Form.Item
            name="inProgressText"
            label="Mensagem de Viagem em progresso"
            rules={[
              {
                required: true,
                message: "Campo obrigatório",
              },
            ]}
          >
            <Input />
          </Form.Item>
          <Form.Item
            name="cancellationText"
            label="Mensagem de cancelamento"
            rules={[
              {
                required: true,
                message: "Campo obrigatório",
              },
            ]}
          >
            <Input />
          </Form.Item>
          {import.meta.env.ISSPEEDMOB == "true" ? (
            ""
          ) : (
            <Form.Item
              name="exclusivity"
              label="Exclusivo para"
              valuePropName="value"
              rules={[
                {
                  required: true,
                  message: "Selecione a exclusividade do tipo de motorista",
                },
              ]}
            >
              <Radio.Group>
                <Radio value={0}>Mobilidade</Radio>
                <Radio value={1}>Delivery</Radio>
              </Radio.Group>
            </Form.Item>
          )}
          {typeModal === "edit" && hasAppPartner && (
            <Form.Item name="appsPartners" label="Aplicativos Parceiros">
              <Select
                mode="multiple"
                style={{ width: "100%" }}
                placeholder="Aplicativos parceiros"
                options={optionsPartners}
                value={appsPartnersSelected}
                defaultValue={appsPartnersSelected}
                onChange={handleSelectAppPartner}
              />
            </Form.Item>
          )}
          <ContentButton>
            <Form.Item>
              <Button
                style={{ marginRight: 10 }}
                onClick={() => {
                  setVisibility(false);
                  form.resetFields();
                }}
              >
                Cancelar
              </Button>
            </Form.Item>
            <Form.Item>
              <Button type="primary" htmlType="submit" loading={loading}>
                Enviar
              </Button>
            </Form.Item>
          </ContentButton>
        </Form>
        </ModalBody>
      </Modal>
    </>
  );
};

export default DriverTypeModal;
