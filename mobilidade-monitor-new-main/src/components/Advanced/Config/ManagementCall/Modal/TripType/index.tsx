import { useEffect, useMemo, useRef, useState, useContext } from "react";
import { Button, Checkbox, Col, Form, Input, Row, Select, Tooltip } from "antd";
import TextArea from "antd/lib/input/TextArea";
import Modal from "antd/lib/modal/Modal";
import Resizer from "react-image-file-resizer";
import api from "../../../../../../services/api";
import Alert from "../../../../../Utils/Alert";
import {
  CategoryCheckbox,
  CategoryTooltipIcon,
  ContentImage,
  FormFooterActions,
  FormFooterCancelButton,
  GenderSelect,
  InputFile,
  SelectMultipleFullWidth,
  TripTypeGenderDropdownStyles,
  TripTypeIconPreview,
} from "./styles";
import Blank from "../../../../../../assets/blank.png";
import AuthContext from "../../../../../../contexts/auth";
import {
  ApiErrorResponse,
  CallGroupsTripTypeLinked,
  IConfigAppPartnersProps,
  IEditTripTypeModalProps,
  ITripTypePartnerLinkedProps,
  isTripTypeModalFileImage,
  TripTypeModalFormValues,
} from "./types";
import { getTripTypeCategoryVisibility } from "./categoryVisibility";

import {
  CONFIGURACAO,
  VIAGEM,
  FRETE,
  ENTREGA,
  TOTEM,
} from "../../../../../../constants/permissions";

const { Option } = Select;

const getApiErrorMessage = (error: unknown, fallback: string): string => {
  const data = (error as ApiErrorResponse)?.response?.data;
  return data?.response?.[0] ?? data?.message ?? fallback;
};

const EditTripTypeModal = ({
  callGroups,
  gender,
  loadInformations,
  optionsAppPartners,
  setVisibility,
  titleModal,
  tripTypeSelected,
  typeModal,
  visibility,
}: IEditTripTypeModalProps) => {
  const [loadingButton, setLoadingButton] = useState<boolean>(false);
  const [showAlert, setShowAlert] = useState(false);
  const [messageAlert, setMessageAlert] = useState("");
  const [typeAlert, setTypeAlert] = useState<
    "success" | "info" | "warning" | "error"
  >("success");
  const [selectedFile, setSelectedFile] = useState<string | FileList | null>();
  const [renderImage, setRenderImage] = useState(false);
  const [whatRender, setWhatRender] = useState<string>();
  const [appPartnersDefault, setAppPartnersDefault] = useState<
    ITripTypePartnerLinkedProps[]
  >([]);
  const [idsAppPartners, setIdsAppPartners] = useState<number[]>([]);
  const [idsCallGroup, setIdsCallGroup] = useState<number[]>([]);
  const [callGroupDefault, setCallGroupDefault] = useState<
    CallGroupsTripTypeLinked[]
  >([]);

  const hasAppPartner = import.meta.env.APP_PARTNER === "true";

  const { hasPermission, responseDataUser } = useContext(AuthContext);

  const groups = responseDataUser?.role?.groups;

  const { canShowCentralTripCategory, canShowServicosTripCategory } = useMemo(
    () => getTripTypeCategoryVisibility(groups),
    [groups]
  );

  console.log("canShowCentralTripCategory", canShowCentralTripCategory);

  const [form] = Form.useForm();
  const [disableOptions, setDisableOptions] = useState(false);
  const isSubmittingRef = useRef(false);

  const handleSelectAppPartner = (appsPartners: string[]) => {
    const idsPartners = appsPartners.map((appPartner) => {
      return JSON.parse(appPartner).id;
    });

    setIdsAppPartners(idsPartners);
  };

  const handleSelectCallGroup = (callGroup: string[]) => {
    const idsCallGroups = callGroup.map((callGroupInfo) => {
      return JSON.parse(callGroupInfo).id;
    });
    setIdsCallGroup(idsCallGroups);
  };

  useEffect(() => {
    if (selectedFile && renderImage) {
      setWhatRender(URL.createObjectURL(selectedFile[0] as File));
    } else {
      setWhatRender(Blank);
    }
  }, [selectedFile, renderImage]);

  useEffect(() => {
    if (typeModal === "edit" && visibility) {
      const categories = [
        !!tripTypeSelected?.deliveryOption && "1",
        !!tripTypeSelected?.freightOption && "2",
        !!tripTypeSelected?.onlyCentral && "3",
        !!tripTypeSelected?.openPrice && "4",
        !!tripTypeSelected?.offerOption && "5",
        !!tripTypeSelected?.serviceOption && "6",
        !!tripTypeSelected?.loopingOption && "7",
        !!tripTypeSelected?.scheduledOnlyOption && "8",
      ].filter(Boolean);
      form.setFieldsValue({
        type: tripTypeSelected?.type,
        description: tripTypeSelected?.description,
        gender: tripTypeSelected?.gender.id,
        category: categories,
        messageNoDriversFound: tripTypeSelected?.messageNoDriversFound,
        image: tripTypeSelected?.picture,
      });

      setRenderImage(false);
      setSelectedFile(tripTypeSelected?.picture);
      setDisableOptions(categories.includes("5"));
    }
  }, [typeModal, tripTypeSelected, form, visibility]);

  useEffect(() => {
    if (tripTypeSelected?.trip_type_partner_linked) {
      const ids = tripTypeSelected.trip_type_partner_linked.map((response) => {
        return response.config_apps_partners_id;
      });

      setIdsAppPartners(ids);
      setAppPartnersDefault(tripTypeSelected.trip_type_partner_linked);
    } else {
      setIdsAppPartners([]);
      setAppPartnersDefault([]);
    }
  }, [tripTypeSelected]);

  const resizeFile = (file: Blob) =>
    new Promise((resolve) => {
      Resizer.imageFileResizer(
        file,
        250,
        250,
        "PNG",
        100,
        0,
        (uri) => {
          resolve(uri);
        },
        "blob",
      );
    });

  const createTripType = async (values: TripTypeModalFormValues) => {
    if (isSubmittingRef.current) {
      return;
    }
    isSubmittingRef.current = true;

    let deliveryOption = "0";
    let freightOption = "0";
    let centralOption = "0";
    let openPrice = "0";
    let offerOption = "0";
    let serviceOption = "0";
    let loopingOption = "0";
    let scheduledOnlyOption = "0";

    const category = values.category ?? [];
    deliveryOption = category.includes("1") ? "1" : "0";
    freightOption = category.includes("2") ? "1" : "0";
    centralOption = category.includes("3") ? "1" : "0";
    openPrice = category.includes("4") ? "1" : "0";
    offerOption = category.includes("5") ? "1" : "0";
    serviceOption = category.includes("6") ? "1" : "0";
    loopingOption = category.includes("7") ? "1" : "0";
    scheduledOnlyOption = category.includes("8") ? "1" : "0";

    const genderr = values.gender;

    setLoadingButton(true);
    try {
      if (!isTripTypeModalFileImage(values.image)) {
        setShowAlert(true);
        setMessageAlert("Escolha um ícone para o motorista");
        setTypeAlert("error");
        setLoadingButton(false);
        return;
      }
      const file = values.image.target.files[0];
      if (!file) {
        setShowAlert(true);
        setMessageAlert("Escolha um ícone para o motorista");
        setTypeAlert("error");
        setLoadingButton(false);
        return;
      }
      const result = await resizeFile(file);
      const formData = new FormData();
      formData.append("picture", result as Blob);
      formData.append("type", values.type);
      formData.append("showType", "1");
      formData.append("description", values.description);
      formData.append("gender_id", String(genderr));
      formData.append("messageNoDriversFound", values.messageNoDriversFound);
      formData.append("deliveryOption", deliveryOption);
      formData.append("freightOption", freightOption);
      formData.append("onlyCentral", centralOption);
      formData.append("openPrice", openPrice);
      formData.append("offerOption", offerOption);
      formData.append("serviceOption", serviceOption);
      formData.append("loopingOption", loopingOption);
      formData.append("scheduledOnlyOption", scheduledOnlyOption);

      const config = {
        headers: {
          accept: "application/json",
          "Content-Type": `multipart/form-data`,
        },
      };
      const response = await api.post("tripType", formData, config);
      if (response.data?.status) {
        form.resetFields();
        setMessageAlert("Tipo de chamado criado com sucesso!");
        setTypeAlert("success");
        setShowAlert(true);
        setVisibility(false);
        loadInformations();
      } else {
        setShowAlert(true);
        setMessageAlert("Não foi possível criar o tipo de chamado, tente novamente");
        setTypeAlert("error");
      }
    } catch (error) {
      console.error(error);
      setShowAlert(true);
      setMessageAlert(
        getApiErrorMessage(error, "Não foi possível criar o tipo de chamado, tente novamente")
      );
      setTypeAlert("error");
    } finally {
      setLoadingButton(false);
      isSubmittingRef.current = false;
    }
  };

  const updateTripType = (values: TripTypeModalFormValues) => {
    if (isSubmittingRef.current) {
      return;
    }
    isSubmittingRef.current = true;

    const category = values.category ?? [];
    const deliveryOption = category.includes("1") ? "1" : "0";
    const freightOption = category.includes("2") ? "1" : "0";
    const centralOption = category.includes("3") ? "1" : "0";
    const openPrice = category.includes("4") ? "1" : "0";
    const offerOption = category.includes("5") ? "1" : "0";
    const serviceOption = category.includes("6") ? "1" : "0";
    const loopingOption = category.includes("7") ? "1" : "0";
    const scheduledOnlyOption = category.includes("8") ? "1" : "0";

    const genderr = values.gender;

    const formData = new FormData();

    const config = {
      headers: {
        accept: "application/json",
        "Content-Type": `multipart/form-data`,
      },
    };

    const submitUpdate = async () => {
      setLoadingButton(true);
      try {
        const response = await api.post(
          `tripType/${tripTypeSelected?.idTripType}/update`,
          formData,
          config
        );
        if (response.data?.status) {
          form.resetFields();
          setShowAlert(true);
          setMessageAlert("Tipo de chamado editado com sucesso!");
          setTypeAlert("success");
          setVisibility(false);
          loadInformations();
        } else {
          setShowAlert(true);
          setMessageAlert("Ops.. ocorreu um erro, tente novamente");
          setTypeAlert("error");
        }
      } catch (error) {
        console.error(error);
        setShowAlert(true);
        setMessageAlert(
          getApiErrorMessage(error, "Ops.. ocorreu um erro, tente novamente")
        );
        setTypeAlert("error");
      } finally {
        setLoadingButton(false);
        isSubmittingRef.current = false;
      }
    };

    if (typeof values.image === "string") {
      formData.append("type", values.type);
      formData.append("showType", "1");
      formData.append("description", values.description);
      formData.append("gender_id", String(genderr));
      formData.append("messageNoDriversFound", values.messageNoDriversFound);
      formData.append("deliveryOption", deliveryOption);
      formData.append("freightOption", freightOption);
      formData.append("onlyCentral", centralOption);
      formData.append("openPrice", openPrice);
      formData.append("offerOption", offerOption);
      formData.append("serviceOption", serviceOption);

      idsAppPartners.forEach((id) => {
        formData.append("idsAppPartners[]", String(id));
      });

      formData.append("loopingOption", loopingOption);
      formData.append("scheduledOnlyOption", scheduledOnlyOption);

      if (idsCallGroup.length > 0) {
        idsCallGroup.map((id: number) => {
          formData.append("idsCallGroups[]", String(id));
        });
      }
      submitUpdate();
    } else if (isTripTypeModalFileImage(values.image)) {
      const file = values.image.target.files[0];
      if (!file) {
        isSubmittingRef.current = false;
        return;
      }
      resizeFile(file).then((result) => {
        formData.append("picture", result as Blob);
        formData.append("type", values.type);
        formData.append("showType", "1");
        formData.append("description", values.description);
        formData.append("gender_id", String(genderr));
        formData.append("messageNoDriversFound", values.messageNoDriversFound);
        formData.append("deliveryOption", deliveryOption);
        formData.append("freightOption", freightOption);
        formData.append("onlyCentral", centralOption);
        formData.append("openPrice", openPrice);
        formData.append("offerOption", offerOption);
        formData.append("serviceOption", serviceOption);

        idsAppPartners.forEach((id) => {
          formData.append("idsAppPartners[]", String(id));
        });

        formData.append("loopingOption", loopingOption);
        formData.append("scheduledOnlyOption", scheduledOnlyOption);

        if (idsCallGroup.length > 0) {
          idsCallGroup.map((id: number) => {
            formData.append("idsCallGroups[]", String(id));
          });
        }
        submitUpdate();
      });
    }
  };

  useEffect(() => {
    if (tripTypeSelected) {
      const ids = tripTypeSelected?.call_groups_trip_type_linked?.map(
        (response) => {
          return response.call_group_id;
        },
      );
      setIdsCallGroup(ids as number[]);
      setCallGroupDefault(tripTypeSelected?.call_groups_trip_type_linked ?? []);
    }
  }, [tripTypeSelected]);

  const listCallGroups = callGroups.map((value) => {
    return {
      label: value.name,
      value: JSON.stringify(value),
    };
  });

  const optionsPartners = optionsAppPartners.map(
    (value: IConfigAppPartnersProps) => {
      return {
        label: value.name_app,
        value: JSON.stringify(value),
      };
    },
  );

  const appsPartnersSelected = appPartnersDefault.map((response) => {
    return JSON.stringify(response.config_app_partners);
  });

  const callGroupDefaults = callGroupDefault.map((response) => {
    return JSON.stringify(response.call_groups);
  });

  return (
    <>
      <TripTypeGenderDropdownStyles />
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
        onCancel={() => {
          setVisibility(false);
          form.resetFields();
          setSelectedFile(undefined);
          setRenderImage(false);
        }}
        destroyOnClose
      >
        <Form
          form={form}
          onFinish={typeModal === "create" ? createTripType : updateTripType}
          layout="vertical"
          name="form"
        >
          <Form.Item
            name="type"
            label="Nome"
            rules={[
              {
                required: true,
                message: "Insira o nome do tipo de chamado",
              },
            ]}
          >
            <Input />
          </Form.Item>
          <Form.Item
            name="description"
            label="Descrição"
            rules={[
              {
                required: true,
                message: "Insira uma descrição para o tipo de chamado",
              },
            ]}
          >
            <TextArea />
          </Form.Item>
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
              <TripTypeIconPreview
                src={
                  typeModal === "edit" && !renderImage
                    ? (selectedFile as string)
                    : whatRender
                }
                alt="Ícone do chamado"
              />
            )}
          </ContentImage>
          <Form.Item
            name="gender"
            label="Gênero que esse tipo de chamado atenderá"
            rules={[
              {
                required: true,
                message: "Escolha um gênero para o chamado",
              },
            ]}
          >
            <GenderSelect popupClassName="trip-type-modal-gender-dropdown">
              {gender.map((item, index) => {
                return (
                  <Option value={item.id} key={index}>
                    {item.name}
                  </Option>
                );
              })}
            </GenderSelect>
          </Form.Item>
          <Form.Item name="category" label="Categoria">
            <Checkbox.Group
              onChange={(checkedValues: Array<string | number | boolean>) => {
                setDisableOptions(checkedValues.includes("5"));
                if (checkedValues.includes("5")) {
                  form.setFieldsValue({
                    category: checkedValues.filter(
                      (val: string | number | boolean) =>
                        val === "5" || val === "4"
                    ),
                  });
                }
              }}
            >
              <Row>
                {hasPermission(ENTREGA, "adicionar_chamado_entrega") && (
                  <Col span={24}>
                    <CategoryCheckbox value="1" disabled={disableOptions}>
                      Entrega
                    </CategoryCheckbox>
                  </Col>
                )}

                {hasPermission(FRETE, "adicionar_chamado_frete") && (
                  <Col span={24}>
                    <CategoryCheckbox value="2" disabled={disableOptions}>
                      Frete
                    </CategoryCheckbox>
                  </Col>
                )}

                {canShowCentralTripCategory && (
                  <Col span={24}>
                    <CategoryCheckbox value="3" disabled={disableOptions}>
                      Central
                      <Tooltip title="Essa opção fará com que a categoria seja oculta no aplicativo de passageiro e estará disponível apenas na central de chamados.">
                        <CategoryTooltipIcon />
                      </Tooltip>
                    </CategoryCheckbox>
                  </Col>
                )}

                {hasPermission(CONFIGURACAO, "criar_chamado_sem_destino") && (
                  <Col span={24}>
                    <CategoryCheckbox value="4">
                      Chamada com preço em aberto
                      <Tooltip title="Ao selecionar essa opção a categoria desaparecerá temporariamente da tela de escolha de categoria e preços, sendo visível somente quando estiver adicionando um endereço durante uma Viagem sem destino.">
                        <CategoryTooltipIcon />
                      </Tooltip>
                    </CategoryCheckbox>
                  </Col>
                )}

                {hasPermission(VIAGEM, "tipo_viagem_por_ofertar") && (
                  <Col span={24}>
                    <CategoryCheckbox value="5">
                      Viagem por oferta
                      <Tooltip title="Essa opção faz com que o cliente e motorista possam combinar o valor da viagem.">
                        <CategoryTooltipIcon />
                      </Tooltip>
                    </CategoryCheckbox>
                  </Col>
                )}

                {hasPermission(TOTEM, "habilitar_totem") && (
                  <Col span={24}>
                    <CategoryCheckbox value="">
                      Viagem totem
                      <Tooltip title="Essa opção ativa o modo totem para a viagem, permitindo solicitação direta via terminal físico.">
                        <CategoryTooltipIcon />
                      </Tooltip>
                    </CategoryCheckbox>
                  </Col>
                )}

                {canShowServicosTripCategory && (
                  <Col span={24}>
                    <CategoryCheckbox value="6" disabled={disableOptions}>
                      Serviços
                    </CategoryCheckbox>
                  </Col>
                )}

                {hasPermission(VIAGEM, "tipo_viagem_em_loop") && (
                  <Col span={24}>
                    <CategoryCheckbox value="7" disabled={disableOptions}>
                      Chamada em loop
                      <Tooltip title="Com essa opção ativada, a busca por motoristas será contínua até que um profissional aceite a corrida.">
                        <CategoryTooltipIcon />
                      </Tooltip>
                    </CategoryCheckbox>
                  </Col>
                )}

                {hasPermission(VIAGEM, "tipo_viagem_somente_agendada") && (
                  <Col span={24}>
                    <CategoryCheckbox value="8" disabled={disableOptions}>
                      Viagem agendada
                      <Tooltip title="Com essa opção ativada, o tipo de chamado será usado apenas para viagens agendadas.">
                        <CategoryTooltipIcon />
                      </Tooltip>
                    </CategoryCheckbox>
                  </Col>
                )}
              </Row>
            </Checkbox.Group>
          </Form.Item>
          <Form.Item
            name="messageNoDriversFound"
            label="Frase para quando não houver parceiros disponíveis"
            rules={[
              {
                required: true,
                message: "Campo obrigatório",
              },
            ]}
          >
            <Input />
          </Form.Item>
          {typeModal === "edit" && hasAppPartner && (
            <Form.Item
              name="appsPartners"
              label="Aplicativos Parceiros"
              rules={[
                {
                  required: false,
                },
              ]}
            >
              <Select
                mode="multiple"
                style={{ width: "100%" }}
                placeholder="Aplicativos parceiros"
                onChange={handleSelectAppPartner}
                options={optionsPartners}
                value={appsPartnersSelected}
                defaultValue={appsPartnersSelected}
              />
            </Form.Item>
          )}

          {typeModal === "edit" && (
            <Form.Item
              name="callGroups"
              label="Grupos de chamados"
              rules={[
                {
                  required: false,
                },
              ]}
            >
              <SelectMultipleFullWidth
                mode="multiple"
                placeholder="Grupos de chamados"
                onChange={(value) =>
                  handleSelectCallGroup(value as string[])
                }
                options={listCallGroups}
                value={callGroupDefaults}
                defaultValue={callGroupDefaults}
              />
            </Form.Item>
          )}

          <FormFooterActions>
            <Form.Item>
              <FormFooterCancelButton
                onClick={() => {
                  setVisibility(false);
                  form.resetFields();
                }}
              >
                Cancelar
              </FormFooterCancelButton>
            </Form.Item>
            <Form.Item>
              <Button
                type="primary"
                htmlType="submit"
                loading={loadingButton}
                disabled={loadingButton}
              >
                Enviar
              </Button>
            </Form.Item>
          </FormFooterActions>
        </Form>
      </Modal>
    </>
  );
};

export default EditTripTypeModal;
