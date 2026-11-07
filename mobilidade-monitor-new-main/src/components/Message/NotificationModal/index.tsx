import React, { useEffect, useState, useCallback } from "react";
import {
  Form,
  Input,
  Modal,
  Select,
  Switch,
  Upload,
  Button,
  Space,
  Tooltip,
} from "antd";
import type { UploadFile, UploadProps } from "antd/es/upload/interface";
import type { RcFile } from "antd/es/upload";
import {
  MdNotificationsActive,
  MdCloudUpload,
  MdPhoneIphone,
  MdLink,
  MdLocationCity,
  MdGroup,
} from "react-icons/md";
import {
  ModalContentSplit,
  FormSide,
  PreviewSide,
  PreviewHeader,
  PhoneMockup,
  PhoneNotch,
  PushNotificationCard,
  PushHeader,
  PushBody,
  PushImageBanner,
  FormItem,
  FooterModal,
  FooterModalButton,
} from "./styles";
import api from "../../../services/api";
import { NotificationModalProps, FormProps } from "./types";
import { SessionCitiesProps } from "../../../@types";

const { Option } = Select;
const { TextArea } = Input;

const NotificationModal: React.FC<NotificationModalProps> = ({
  showModal,
  setShowModal,
  driverTypeList,
  setLoading,
  alertValues,
  getAllNotification,
}) => {
  const [form] = Form.useForm();
  const [fileList, setFileList] = useState<UploadFile[]>([]);
  const [previewImage, setPreviewImage] = useState<string>("");
  const [cities, setCities] = useState<SessionCitiesProps[]>([]);
  const [searchingCities, setSearchingCities] = useState(false);

  // Live preview state
  const [liveTitle, setLiveTitle] = useState("");
  const [liveMessage, setLiveMessage] = useState("");

  const loadAllCities = useCallback(async () => {
    try {
      setSearchingCities(true);
      const response = await api.get("/city/actives/fully");
      const list = Array.isArray(response.data?.data)
        ? response.data.data
        : Array.isArray(response.data?.response)
        ? response.data.response
        : [];
      const formatted = list.map((c: any) => ({
        cityId: String(c.id || c.cityId),
        nome: c.nome || c.name || "Cidade",
        shortName: c.shortName || c.nome || "Cidade",
        estado: c.estado || 0,
        active: c.active || 1,
        statusId: c.statusId || 1,
      }));
      setCities(formatted);
    } catch (error) {
      console.error("Erro ao carregar cidades:", error);
      setCities([]);
    } finally {
      setSearchingCities(false);
    }
  }, []);

  useEffect(() => {
    if (showModal) {
      loadAllCities();
    }
  }, [showModal, loadAllCities]);

  const handleValuesChange = (_: any, allValues: any) => {
    if (allValues.title !== undefined) setLiveTitle(allValues.title);
    if (allValues.message !== undefined) setLiveMessage(allValues.message);
  };

  const handleUploadChange: UploadProps["onChange"] = async ({ fileList: newFileList }) => {
    setFileList(newFileList.slice(-1));
    if (newFileList.length > 0 && newFileList[0].originFileObj) {
      const src = await new Promise<string>((resolve) => {
        const reader = new FileReader();
        reader.readAsDataURL(newFileList[0].originFileObj as RcFile);
        reader.onload = () => resolve(reader.result as string);
      });
      setPreviewImage(src);
    } else {
      setPreviewImage("");
    }
  };

  const handleSelectAllCities = () => {
    const allIds = cities.map((c) => c.cityId);
    form.setFieldsValue({ cityId: allIds });
  };

  const handleSelectAllRecipients = () => {
    const allRecipients = ["1", "2", ...driverTypeList.map((d) => String(d.id))];
    const unique = Array.from(new Set(allRecipients));
    form.setFieldsValue({ userTypes: unique });
  };

  const onFinish = async (values: FormProps) => {
    try {
      setLoading(true);
      const formData = new FormData();
      formData.append("title", values.title.trim());
      formData.append("message", values.message.trim());

      const cityIds = Array.isArray(values.cityId)
        ? values.cityId.join(",")
        : values.cityId || "";
      formData.append("cityId", cityIds);

      if (values.link && values.link.trim() !== "") {
        formData.append("link", values.link.trim());
      }

      formData.append("identifyUserInLink", values.identifyUserInLink ? "1" : "0");

      if (fileList.length > 0 && fileList[0].originFileObj) {
        formData.append("image", fileList[0].originFileObj);
      }

      if (Array.isArray(values.userTypes) && values.userTypes.length > 0) {
        values.userTypes.forEach((id: string) => {
          formData.append("userTypes[]", id);
        });
      } else {
        formData.append("userTypes[]", "1");
        formData.append("userTypes[]", "2");
      }

      const response = await api.post("notification/store", formData, {
        headers: {
          "Content-Type": "multipart/form-data",
        },
      });

      setLoading(false);
      if (response.status === 201 || response.status === 200 || response.data?.status) {
        alertValues("Notificação enviada com sucesso!", "success");
        setShowModal(false);
        form.resetFields();
        setFileList([]);
        setPreviewImage("");
        setLiveTitle("");
        setLiveMessage("");
        getAllNotification();
      } else {
        alertValues("Não foi possível enviar a notificação. Verifique os dados.", "warning");
      }
    } catch (error) {
      setLoading(false);
      alertValues("Erro ao conectar com o servidor para enviar a notificação.", "error");
    }
  };

  const recipientOptions = [
    { id: "1", name: "Passageiros" },
    { id: "2", name: "Motoristas" },
    ...driverTypeList.filter((d) => String(d.id) !== "1" && String(d.id) !== "2"),
  ];

  return (
    <Modal
      title={
        <Space align="center" style={{ gap: 10 }}>
          <div
            style={{
              width: 34,
              height: 34,
              borderRadius: 8,
              background: "#e0f2fe",
              color: "#0284c7",
              display: "flex",
              alignItems: "center",
              justifyContent: "center",
              fontSize: 18,
            }}
          >
            <MdNotificationsActive />
          </div>
          <span style={{ fontWeight: 700, fontSize: 17, color: "#0f172a" }}>
            Nova Notificação Push
          </span>
        </Space>
      }
      open={showModal}
      onCancel={() => setShowModal(false)}
      width={860}
      footer={null}
      destroyOnClose
      style={{ top: 20 }}
    >
      <Form
        form={form}
        layout="vertical"
        onFinish={onFinish}
        onValuesChange={handleValuesChange}
        autoComplete="off"
        initialValues={{
          userTypes: ["1", "2"],
          identifyUserInLink: false,
        }}
        style={{ marginTop: 16 }}
      >
        <ModalContentSplit>
          <FormSide>
            <FormItem
              label="Assunto da Notificação"
              name="title"
              rules={[
                { required: true, message: "Por favor, insira o assunto da notificação!" },
                { max: 80, message: "Máximo de 80 caracteres para o assunto!" },
              ]}
            >
              <Input
                placeholder="Ex: Desconto especial hoje! 🚗"
                maxLength={80}
                showCount
                style={{ borderRadius: 8, height: 40 }}
              />
            </FormItem>

            <FormItem
              label="Mensagem / Conteúdo"
              name="message"
              rules={[
                { required: true, message: "Por favor, insira o texto da mensagem!" },
                { max: 300, message: "Máximo de 300 caracteres recomendado para push!" },
              ]}
            >
              <TextArea
                rows={3}
                placeholder="Ex: Aproveite 20% de desconto em todas as suas viagens até às 22h. Abra o app e aproveite!"
                maxLength={300}
                showCount
                style={{ borderRadius: 8 }}
              />
            </FormItem>

            <FormItem
              label={
                <div style={{ display: "flex", justifyContent: "space-between", width: "100%", alignItems: "center" }}>
                  <span>Público Alvo / Destinatários</span>
                  <Button
                    type="link"
                    size="small"
                    onClick={handleSelectAllRecipients}
                    style={{ padding: 0, fontSize: 12 }}
                  >
                    Selecionar Todos
                  </Button>
                </div>
              }
              name="userTypes"
              rules={[{ required: true, message: "Selecione pelo menos um destinatário!" }]}
            >
              <Select
                mode="multiple"
                placeholder="Selecione quem receberá"
                maxTagCount="responsive"
                style={{ borderRadius: 8 }}
              >
                {recipientOptions.map((res) => (
                  <Option key={String(res.id)} value={String(res.id)}>
                    <Space size={6}>
                      <MdGroup style={{ verticalAlign: "-2px" }} />
                      {res.name}
                    </Space>
                  </Option>
                ))}
              </Select>
            </FormItem>

            <FormItem
              label={
                <div style={{ display: "flex", justifyContent: "space-between", width: "100%", alignItems: "center" }}>
                  <span>Cidades Destino</span>
                  <Button
                    type="link"
                    size="small"
                    onClick={handleSelectAllCities}
                    style={{ padding: 0, fontSize: 12 }}
                  >
                    Selecionar Todas
                  </Button>
                </div>
              }
              name="cityId"
              rules={[{ required: true, message: "Selecione pelo menos uma cidade!" }]}
            >
              <Select
                mode="multiple"
                placeholder="Selecione as cidades alvo"
                allowClear
                showSearch
                loading={searchingCities}
                filterOption={(input, option) =>
                  String(option?.children || "")
                    .toLowerCase()
                    .includes(input.toLowerCase())
                }
                maxTagCount="responsive"
                style={{ borderRadius: 8 }}
              >
                {cities.map((item) => (
                  <Option key={item.cityId} value={item.cityId}>
                    {item.shortName}
                  </Option>
                ))}
              </Select>
            </FormItem>

            <FormItem
              label="Link Externo / Ação (Opcional)"
              name="link"
              tooltip="Ao tocar na notificação, o usuário será direcionado para este endereço."
            >
              <Input
                prefix={<MdLink size={18} color="#94a3b8" />}
                placeholder="https://exemplo.com/promocao"
                style={{ borderRadius: 8, height: 40 }}
              />
            </FormItem>

            <FormItem
              name="identifyUserInLink"
              valuePropName="checked"
              style={{ marginBottom: 12 }}
            >
              <Space align="center">
                <Switch />
                <span style={{ fontSize: 13, color: "#475569" }}>
                  Vincular identificação do usuário na URL (para rastreio de conversão)
                </span>
              </Space>
            </FormItem>

            <FormItem label="Banner / Imagem Promocional (Opcional)" name="image">
              <Upload
                beforeUpload={() => false}
                fileList={fileList}
                onChange={handleUploadChange}
                maxCount={1}
                accept="image/*"
              >
                <Button
                  icon={<MdCloudUpload size={18} />}
                  style={{ borderRadius: 8, height: 40 }}
                >
                  {fileList.length > 0 ? "Alterar Imagem" : "Escolher Imagem (JPG/PNG)"}
                </Button>
              </Upload>
            </FormItem>
          </FormSide>

          <PreviewSide>
            <PreviewHeader>
              <MdPhoneIphone size={18} color="#0284c7" />
              Pré-visualização Push
            </PreviewHeader>

            <PhoneMockup>
              <PhoneNotch />
              <PushNotificationCard>
                <PushHeader>
                  <div className="app-brand">
                    <div className="app-icon">M</div>
                    <span className="app-name">Movy</span>
                  </div>
                  <span className="time-stamp">Agora</span>
                </PushHeader>

                <PushBody>
                  <div className="push-title">
                    {liveTitle.trim() || "Assunto da Notificação"}
                  </div>
                  <div className="push-text">
                    {liveMessage.trim() ||
                      "Esta é uma prévia em tempo real de como a mensagem aparecerá na tela do aparelho do usuário."}
                  </div>
                </PushBody>

                {previewImage && (
                  <PushImageBanner>
                    <img src={previewImage} alt="Preview Banner" />
                  </PushImageBanner>
                )}
              </PushNotificationCard>
            </PhoneMockup>

            <p
              style={{
                fontSize: 11,
                color: "#94a3b8",
                marginTop: 14,
                textAlign: "center",
                lineHeight: 1.4,
              }}
            >
              Simulação do banner push como exibido nos sistemas Android e iOS.
            </p>
          </PreviewSide>
        </ModalContentSplit>

        <FooterModal>
          <FooterModalButton onClick={() => setShowModal(false)}>
            Cancelar
          </FooterModalButton>
          <FooterModalButton
            type="primary"
            htmlType="submit"
            style={{ background: "#0284c7" }}
          >
            Enviar Notificação
          </FooterModalButton>
        </FooterModal>
      </Form>
    </Modal>
  );
};

export default NotificationModal;
