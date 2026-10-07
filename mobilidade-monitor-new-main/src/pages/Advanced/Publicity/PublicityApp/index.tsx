import React, { useEffect, useState } from "react";
import ptBR from "antd/es/locale/pt_BR";
import Swal from "sweetalert2";
import { useForm, Controller } from "react-hook-form";
import withReactContent from "sweetalert2-react-content";
import {
  Collapse,
  Input,
  Select,
  Row,
  Col,
  Form,
  Radio,
  Button,
  Checkbox,
  ConfigProvider,
  DatePicker,
  TimePicker,
  Switch,
} from "antd";
import {
  ContentInput,
  ContentBannerAndLabel,
  LabelText,
  ContentButtonLoadImg,
  Container,
  ContentImgLabel,
  StyledPanel,
  StyledRadioGroup,
  StyledImage,
  ContainerButtonSave,
  ContentButtonSave,
} from "./styles";
import { resizeImageCanvas } from "../../../../hooks/resizeImageCanvas";
import Preload from "../../../../components/Utils/Preload";
import { yupResolver } from "@hookform/resolvers/yup";
import MockupCellphone from "../../../../components/MockupCellphoneCompanyPartner";
import RequestDrive from "../../../../../src/assets/pedindo-corrida.png";
import DriveLoading from "../../../../../src/assets/corrida-andamento.png";
import api from "../../../../services/api";
import { schema, TypeSchema } from "./schema_validations";
import Utils from "../../../../utils/Utils";
import Mask from "../../../../services/Mask";

export const PublicityApp = () => {
  const { control, handleSubmit, formState: { errors }, reset, setValue } = useForm<TypeSchema>({
    resolver: yupResolver(schema),
    mode: "onBlur",
    reValidateMode: "onChange",
  });
  
  const [resetKey, setResetKey] = useState(0);
  const { dataURLtoFile } = Utils;

  const onReset = () => {
    setValue("start_date", "");
    setValue("end_date", "");
    setValue("start_hour", "");
    setValue("end_hour", "");
    setValue("days_of_week", []);
    setResetKey((prevKey) => prevKey + 1);
  };

  const onSubmitDatas = async (data: TypeSchema) => {

    const isLocationSelected =
    data.passenger_screen ||
    data.passenger_transit ||
    data.driver_screen ||
    data.driver_transit;

  if (!isLocationSelected) {
    Swal.fire({
      icon: "error",
      title: "Erro!",
      text: "Pelo menos um dos itens de locais deve estar marcado.",
    });
    return;
  }

    if (Object.keys(errors).length) {
      return;
    }

    const formData = new FormData();

    // formData.append("driver_charge_initial", String(data.driver_charge_initial));
    // formData.append("passenger_charge_screen", String(data.passenger_charge_screen));
    // formData.append("driver_charge_screen", String(data.driver_charge_screen));
    // formData.append("passenger_address_bar", String(data.passenger_address_bar));

    const imgData = dataURLtoFile(
      data.image_driver_initial,
      "image_driver_initial.png"
    );

    const imgData2 = dataURLtoFile(
      data.image_driver_transit,
      "image_driver_transit.png"
    );

    const imgData3 = dataURLtoFile(
      data.image_passenger_screen,
      "image_passenger_screen.png"
    );

    const imgData4 = dataURLtoFile(
      data.image_passenger_transit,
      "image_passenger_transit.png"
    );

    formData.append("company_name", data.company_name);
    formData.append("company_type", data.company_type);
    formData.append("company_email", data.company_email);
    formData.append("company_phone", data.company_phone);
    formData.append("company_whatsapp", data.company_whatsapp);
    formData.append("link", data.link);
    formData.append("opening_hours", data.opening_hours);
    formData.append("opening_hours2", data.opening_hours2);
    formData.append("benefit1", String(data.benefit1));
    formData.append("benefit2", String(data.benefit2));
    formData.append("benefit3", String(data.benefit3));
    formData.append("responsible_manager", data.responsible_manager);
    formData.append("email_report", data.email_report);
    formData.append("title", data.title);
    formData.append("subtitle", data.subtitle);
    formData.append("text_button_cta", data.text_button_cta);
    formData.append("link_button_cta", String(data.link_button_cta));

    formData.append("image_driver_initial", imgData as File);
    formData.append("image_driver_transit", imgData2 as File);
    formData.append("image_passenger_screen", imgData3 as File);
    formData.append("image_passenger_transit", imgData4 as File);

    formData.append("gender", data.gender);
    formData.append("min_age", String(data.min_age));
    formData.append("max_age", String(data.max_age));
    formData.append("min_distance", String(data.min_distance));
    formData.append("max_distance", String(data.max_distance));
    formData.append("activities", data.activities);

    formData.append(
      "passenger_screen",
      data.passenger_screen === true ? "1" : "0"
    );
    formData.append(
      "passenger_transit",
      data.passenger_transit === true ? "1" : "0"
    );
    formData.append("driver_screen", data.driver_screen === true ? "1" : "0");
    formData.append("driver_transit", data.driver_transit === true ? "1" : "0");

    formData.append("start_date", data.start_date);
    formData.append("end_date", data.end_date);
    formData.append("start_hour", data.start_hour);
    formData.append("end_hour", data.end_hour);
    formData.append("days_of_week[]", String(data.days_of_week));

    try {
      setLoadingButton(true);
      //@ts-ignore
      const response = await api.post("publicitiesApp", formData);
    
      Swal.fire({
        icon: "success",
        title: "Sucesso!",
        text: "Os dados foram enviados corretamente.",
      });
    
      reset();
      onReset();
      clearMockup();
      setUrlImgBanner1("");
      setUrlImgBanner2("");
      setUrlImgBanner3("");
      setUrlImgBanner4("");
    } catch (error) {
      console.error("Erro ao enviar os dados:", error);
      Swal.fire({
        icon: "error",
        title: "Erro!",
        text: "Ocorreu um erro ao enviar os dados.",
      });
    } finally {
      setLoadingButton(false);
    }
    
  };

  const [loadingButton, setLoadingButton] = useState<boolean>(false);
  const [urlImgBanner1, setUrlImgBanner1] = useState<string>("");
  const [urlImgBanner2, setUrlImgBanner2] = useState<string>("");
  const [urlImgBanner3, setUrlImgBanner3] = useState<string>("");
  const [urlImgBanner4, setUrlImgBanner4] = useState<string>("");
  const [isSmallScreen, setIsSmallScreen] = useState(false);
  const [formData, setFormData] = useState({});
  

  const [activeKey, setActiveKey] = useState<string[]>([]);
  const { TextArea } = Input;

  //@ts-ignore
  const MySwal = withReactContent(Swal);

  const onError = (errors: any) => {
    if (Object.keys(errors).length) {
      Swal.fire({
        icon: "error",
        title: "Erro!",
        text: "Existem campos obrigatórios não preenchidos. Por favor, verifique e tente novamente.",
      });
    }
  };


  

  const onChangeImgBanner = (
    event: React.ChangeEvent<HTMLInputElement>,
    setUrlImgBanner: (url: string) => void,
    expectedWidth: number,
    expectedHeight: number,
    onChange: (value: string) => void
  ) => {
    const files = event.target.files;
    if (files && files[0]) {
      if (files[0].size > 5242880) {
        Swal.fire({
          title: "Erro",
          text: "O arquivo não pode exceder 5 MB.",
          icon: "error",
        });
        return;
      }
  
      resizeImageCanvas(files[0], expectedWidth, expectedHeight, (dataUrl) => {
        validateImageSize(dataUrl, expectedWidth, expectedHeight)
          .then(() => {
            setUrlImgBanner(dataUrl);
            onChange(dataUrl);
          })
          .catch((error) => {
            Swal.fire({
              title: "Erro na validação da imagem",
              text: error.message,
              icon: "error",
            });
          });
      });
    }
  };

  const clearMockup = () => {
    setFormData({
      title: "",
      subtitle: "",
      opening_hours: "",
      opening_hours2: "",
      benefit1: "",
      benefit2: "",
      benefit3: "",
      text_button_cta: "",
    });
  };
  

  const validateImageSize = (dataUrl: string, expectedWidth: number, expectedHeight: number): Promise<void> => {
    return new Promise((resolve, reject) => {
      const img = new Image();
      img.onload = () => {
        if (img.width === expectedWidth && img.height === expectedHeight) {
          resolve();
        } else {
          reject(new Error(`A imagem ${img.src} deve ter a proporção de ${expectedWidth}:${expectedHeight}.`));
        }
      };
      img.onerror = () => {
        reject(new Error("Erro ao carregar a imagem."));
      };
      img.src = dataUrl;
    });
  };

  useEffect(() => {
    const handleResize = () => setIsSmallScreen(window.innerWidth < 1200);
    handleResize();
    window.addEventListener("resize", handleResize);
    return () => window.removeEventListener("resize", handleResize);
  }, []);

  return (
    <ConfigProvider locale={ptBR}>
      <Container>
        <Preload visible={loadingButton} />
        <Form key={resetKey} layout="vertical" onFinish={handleSubmit(onSubmitDatas, onError)}>
          <Row gutter={16}>
          <Col xs={24} md={14} lg={16}>
              <Collapse
                activeKey={activeKey}
                onChange={(key) => setActiveKey(key as string[])}
              >
                <StyledPanel header="Empresa Parceira" key="1">
                  <Form layout="vertical">
                    <Row gutter={16}>
                      <Col xs={24} sm={12} lg={12}>
                        <Form.Item label="Nome da Empresa *">
                          <Controller
                            name="company_name"
                            control={control}
                            render={({ field }) => (
                              <Input
                                {...field}
                                onChange={(e) => {
                                  field.onChange(e);
                                  setFormData({
                                    ...formData,
                                    company_name: e.target.value,
                                  });
                                  setValue("company_name", e.target.value);
                                }}
                              />
                            )}
                          />
                          {errors.company_name && (
                            <span style={{ color: "red" }}>
                              {errors.company_name.message}
                            </span>
                          )}
                        </Form.Item>
                      </Col>

                      <Col xs={24} sm={12} lg={12}>
                        <Form.Item label="Tipo de Empresa *">
                          <Controller
                            name="company_type"
                            control={control}
                            render={({ field }) => (
                              <Select {...field}>
                                <Select.Option value="Gasolina e Combustível">
                                  Gasolina e combustível
                                </Select.Option>
                                <Select.Option value="Oficina mecânica">
                                  Oficina mecânica
                                </Select.Option>
                                <Select.Option value="Seguradora">
                                  Seguradora
                                </Select.Option>
                                <Select.Option value="Empresa de publicidade">
                                  Empresa de publicidade
                                </Select.Option>
                                <Select.Option value="Locadora de veículos">
                                  Locadora de veículos
                                </Select.Option>
                                <Select.Option value="Concessionária de veículos">
                                  Concessionária de veículos
                                </Select.Option>
                                <Select.Option value="Restaurante e lanchonete">
                                  Restaurante e lanchonete
                                </Select.Option>
                                <Select.Option value="Empresa de rastreadores e alarmes">
                                  Empresa de rastreadores e alarmes
                                </Select.Option>
                                <Select.Option value="Banco e fintech">
                                  Banco e fintech
                                </Select.Option>
                                <Select.Option value="Companhia de telecomunicações">
                                  Companhia de telecomunicações
                                </Select.Option>
                                <Select.Option value="Estacionamento">
                                  Estacionamento
                                </Select.Option>
                                <Select.Option value="Faculdade e escola">
                                  Faculdade e escola
                                </Select.Option>
                                <Select.Option value="Empresa de logística">
                                  Empresa de logística
                                </Select.Option>
                                <Select.Option value="Hospedagem e clínica (transporte de pacientes)">
                                  Hospedagem e clínica (transporte de pacientes)
                                </Select.Option>
                                <Select.Option value="Outros">
                                  Outros
                                </Select.Option>
                              </Select>
                            )}
                          />
                          {errors.company_type && (
                            <span style={{ color: "red" }}>
                              {errors.company_type.message}
                            </span>
                          )}
                        </Form.Item>
                      </Col>
                      <Col xs={24} sm={12} lg={12}>
                        <Form.Item label="E-mail Financeiro *">
                          <Controller
                            name="company_email"
                            control={control}
                            render={({ field }) => <Input {...field} />}
                          />
                          {errors.company_email && (
                            <span style={{ color: "red" }}>
                              {errors.company_email.message}
                            </span>
                          )}
                        </Form.Item>
                      </Col>
                      <Col xs={24} sm={12} lg={12}>
                        <Form.Item label="Telefone *">
                          <Controller
                            name="company_phone"
                            control={control}
                            render={({ field }) => (
                              <Input
                                {...field}
                                onChange={(e) =>
                                  field.onChange(
                                    Mask.setMaskPhoneValue(e.target.value)
                                  )
                                }
                                value={Mask.setMaskPhoneValue(field.value ?? "")}
                              />
                            )}
                          />
                          {errors.company_phone && (
                            <span style={{ color: "red" }}>
                              {errors.company_phone.message}
                            </span>
                          )}
                        </Form.Item>
                      </Col>
                      <Col xs={24} sm={12} lg={12}>
                        <Form.Item label="WhatsApp *">
                          <Controller
                            name="company_whatsapp"
                            control={control}
                            render={({ field }) => (
                              <Input
                                {...field}
                                onChange={(e) =>
                                  field.onChange(
                                    Mask.setMaskPhoneValue(e.target.value)
                                  )
                                }
                                value={Mask.setMaskPhoneValue(field.value ?? "")}
                              />
                            )}
                          />
                          {errors.company_whatsapp && (
                            <span style={{ color: "red" }}>
                              {errors.company_whatsapp.message}
                            </span>
                          )}
                        </Form.Item>
                      </Col>
                      <Col xs={24} sm={12} lg={12}>
                        <Form.Item label="Link *">
                          <Controller
                            name="link"
                            control={control}
                            render={({ field }) => <Input {...field} />}
                          />
                          {errors.link && (
                            <span style={{ color: "red" }}>
                              {errors.link.message}
                            </span>
                          )}
                        </Form.Item>
                      </Col>
                      <Col xs={24} sm={12} lg={12}>
                        <Form.Item label="Horários de Atendimento *">
                          <Controller
                            name="opening_hours"
                            control={control}
                            render={({ field }) => (
                              <Input
                                {...field}
                                onChange={(e) => {
                                  field.onChange(e);
                                  setFormData({
                                    ...formData,
                                    opening_hours: e.target.value,
                                  });
                                }}
                              />
                            )}
                          />
                          {errors.opening_hours && (
                            <span style={{ color: "red" }}>
                              {errors.opening_hours.message}
                            </span>
                          )}
                        </Form.Item>
                      </Col>
                      <Col xs={24} sm={12} lg={12}>
                        <Form.Item label="Horários de Atendimento 2 *">
                          <Controller
                            name="opening_hours2"
                            control={control}
                            render={({ field }) => (
                              <Input
                                {...field}
                                onChange={(e) => {
                                  field.onChange(e);
                                  setFormData({
                                    ...formData,
                                    opening_hours2: e.target.value,
                                  });
                                }}
                              />
                            )}
                          />
                          {errors.opening_hours2 && (
                            <span style={{ color: "red" }}>
                              {errors.opening_hours2.message}
                            </span>
                          )}
                        </Form.Item>
                      </Col>
                      <Col xs={24} sm={12} lg={12}>
                        <Form.Item label="Benefício 1">
                          <Controller
                            name="benefit1"
                            control={control}
                            render={({ field }) => (
                              <Input
                                {...field}
                                maxLength={100}
                                onChange={(e) => {
                                  field.onChange(e);
                                  setFormData({
                                    ...formData,
                                    benefit1: e.target.value,
                                  });
                                }}
                              />
                            )}
                          />
                        </Form.Item>
                      </Col>
                      <Col xs={24} sm={12} lg={12}>
                        <Form.Item label="Benefício 2">
                          <Controller
                            name="benefit2"
                            control={control}
                            render={({ field }) => (
                              <Input
                                {...field}
                                maxLength={100}
                                onChange={(e) => {
                                  field.onChange(e);
                                  setFormData({
                                    ...formData,
                                    benefit2: e.target.value,
                                  });
                                }}
                              />
                            )}
                          />
                        </Form.Item>
                      </Col>
                      <Col xs={24} sm={12} lg={12}>
                        <Form.Item label="Benefício 3">
                          <Controller
                            name="benefit3"
                            control={control}
                            render={({ field }) => (
                              <Input
                                {...field}
                                maxLength={100}
                                onChange={(e) => {
                                  field.onChange(e);
                                  setFormData({
                                    ...formData,
                                    benefit3: e.target.value,
                                  });
                                }}
                              />
                            )}
                          />
                        </Form.Item>
                      </Col>
                      <Col xs={24} sm={12} lg={12}>
                        <Form.Item label="Gestor Responsável *">
                          <Controller
                            name="responsible_manager"
                            control={control}
                            render={({ field }) => <Input {...field} />}
                          />
                          {errors.responsible_manager && (
                            <span style={{ color: "red" }}>
                              {errors.responsible_manager.message}
                            </span>
                          )}
                        </Form.Item>
                      </Col>
                      <Col xs={24} sm={12} lg={12}>
                        <Form.Item label="E-mail para Relatórios *">
                          <Controller
                            name="email_report"
                            control={control}
                            render={({ field }) => <Input {...field} />}
                          />
                          {errors.email_report && (
                            <span style={{ color: "red" }}>
                              {errors.email_report.message}
                            </span>
                          )}
                        </Form.Item>
                      </Col>
                      <Col xs={24}>
                        <Form.Item label="Título a exibir">
                          <Controller
                            name="title"
                            control={control}
                            render={({ field }) => (
                              <Input
                                {...field}
                                onChange={(e) => {
                                  field.onChange(e);
                                  setFormData({
                                    ...formData,
                                    title: e.target.value,
                                  });
                                }}
                              />
                            )}
                          />
                          {errors.title && (
                            <span style={{ color: "red" }}>{errors.title.message}</span>
                          )}
                        </Form.Item>
                      </Col>

                      <Col xs={24}>
                      <Form.Item label="Texto Subtítulo (Máximo 300 caracteres)">
                        <Controller
                          name="subtitle"
                          control={control}
                          render={({ field }) => (
                            <TextArea
                              maxLength={300}
                              {...field}
                              onChange={(e) => {
                                field.onChange(e);
                                setFormData({
                                  ...formData,
                                  subtitle: e.target.value,
                                });
                              }}
                            />
                          )}
                        />
                        {errors.subtitle && (
                          <span style={{ color: "red" }}>
                            {errors.subtitle.message}
                          </span>
                        )}
                      </Form.Item>
                      </Col>
                      <Col xs={24}>
                        <Form.Item label="Texto do Botão CTA">
                          <Controller
                            name="text_button_cta"
                            control={control}
                            render={({ field }) => (
                              <Input
                                {...field}
                                maxLength={15}
                                onChange={(e) => {
                                  field.onChange(e);
                                  setFormData({
                                    ...formData,
                                    text_button_cta: e.target.value,
                                  });
                                }}
                              />
                            )}
                          />
                          {errors.text_button_cta && (
                            <span style={{ color: "red" }}>
                              {errors.text_button_cta.message}
                            </span>
                          )}
                        </Form.Item>
                      </Col>
                      <Col xs={24}>
                        <Form.Item label="Link do Botão CTA">
                          <Controller
                            name="link_button_cta"
                            control={control}
                            render={({ field }) => <Input {...field} />}
                          />
                          {errors.link_button_cta && (
                            <span style={{ color: "red" }}>
                              {errors.link_button_cta.message}
                            </span>
                          )}
                        </Form.Item>
                      </Col>
                    </Row>
                  </Form>
                </StyledPanel>

                <StyledPanel header="Imagens" key="2">
                  <Form layout="vertical">
                    <Row gutter={16}>
                      <Col xs={24}>
                        <Form.Item label="Tela inicial passageiro (288 x 180) *">
                          <Controller
                            control={control}
                            name="image_passenger_screen"
                            render={({ field }) => (
                              <ContentInput>
                                <ContentBannerAndLabel>
                                  <ContentImgLabel>
                                    <StyledImage
                                      src={
                                        urlImgBanner1.length > 1
                                          ? urlImgBanner1
                                          : "https://return704appsmonitor.fb704.com.br/webfiles/img/icon/default.png"
                                      }
                                    />
                                    <LabelText>
                                      Tela inicial passageiro (288 x 180)
                                    </LabelText>
                                  </ContentImgLabel>
                                  <ContentButtonLoadImg>
                                    <input
                                      id="imageBanner1"
                                      type="file"
                                      accept=".png, .jpg, .jpeg"
                                      onChange={(e) => {
                                        onChangeImgBanner(
                                          e,
                                          setUrlImgBanner1,
                                          288,
                                          180,
                                          field.onChange
                                        );
                                      }}
                                    />
                                    <label
                                      htmlFor="imageBanner1"
                                      className="labelImg"
                                    >
                                      Carregar Imagem
                                    </label>
                                  </ContentButtonLoadImg>
                                </ContentBannerAndLabel>
                              </ContentInput>
                            )}
                          />
                          {errors.image_passenger_transit && (
                            <p style={{ color: "red" }}>
                              {errors.image_passenger_transit.message}
                            </p>
                          )}
                        </Form.Item>
                      </Col>
                      <Col xs={24}>
                        <Form.Item label="Passageiro em trânsito (300 x 200) *">
                          <Controller
                            control={control}
                            name="image_passenger_transit"
                            render={({ field }) => (
                              <ContentInput>
                                <ContentBannerAndLabel>
                                  <ContentImgLabel>
                                    <StyledImage
                                      src={
                                        urlImgBanner2.length > 1
                                          ? urlImgBanner2
                                          : "https://return704appsmonitor.fb704.com.br/webfiles/img/icon/default.png"
                                      }
                                    />
                                    <LabelText>
                                      Passageiro em trânsito (300 x 200)
                                    </LabelText>
                                  </ContentImgLabel>
                                  <ContentButtonLoadImg>
                                    <input
                                      id="imageBanner2"
                                      type="file"
                                      accept=".png, .jpg, .jpeg"
                                      onChange={(e) => {
                                        onChangeImgBanner(
                                          e,
                                          setUrlImgBanner2,
                                          300,
                                          200,
                                          field.onChange
                                        );
                                      }}
                                    />
                                    <label
                                      htmlFor="imageBanner2"
                                      className="labelImg"
                                    >
                                      Carregar Imagem
                                    </label>
                                  </ContentButtonLoadImg>
                                </ContentBannerAndLabel>
                              </ContentInput>
                            )}
                          />
                          {errors.image_passenger_transit && (
                            <p style={{ color: "red" }}>
                              {errors.image_passenger_transit.message}
                            </p>
                          )}
                        </Form.Item>
                      </Col>

                      <Col xs={24}>
                        <Form.Item label="Tela inicial motorista (324 x 108) *">
                          <Controller
                            control={control}
                            name="image_driver_initial"
                            render={({ field }) => (
                              <ContentInput>
                                <ContentBannerAndLabel>
                                  <ContentImgLabel>
                                    <StyledImage
                                      src={
                                        urlImgBanner3.length > 1
                                          ? urlImgBanner3
                                          : "https://return704appsmonitor.fb704.com.br/webfiles/img/icon/default.png"
                                      }
                                    />
                                    <LabelText>
                                      Tela inicial motorista (324 x 108)
                                    </LabelText>
                                  </ContentImgLabel>
                                  <ContentButtonLoadImg>
                                    <input
                                      id="imageBanner3"
                                      type="file"
                                      accept=".png, .jpg, .jpeg"
                                      onChange={(e) => {
                                        onChangeImgBanner(
                                          e,
                                          setUrlImgBanner3,
                                          324,
                                          108,
                                          field.onChange
                                        );
                                      }}
                                    />
                                    <label
                                      htmlFor="imageBanner3"
                                      className="labelImg"
                                    >
                                      Carregar Imagem
                                    </label>
                                  </ContentButtonLoadImg>
                                </ContentBannerAndLabel>
                              </ContentInput>
                            )}
                          />
                          {errors.image_driver_initial && (
                            <p style={{ color: "red" }}>
                              {errors.image_driver_initial.message}
                            </p>
                          )}
                        </Form.Item>
                      </Col>

                      <Col xs={24}>
                        <Form.Item label="Motorista em trânsito (324 x 108) *">
                          <Controller
                            control={control}
                            name="image_driver_transit"
                            render={({ field }) => (
                              <ContentInput>
                                <ContentBannerAndLabel>
                                  <ContentImgLabel>
                                    <StyledImage
                                      src={
                                        urlImgBanner4.length > 1
                                          ? urlImgBanner4
                                          : "https://return704appsmonitor.fb704.com.br/webfiles/img/icon/default.png"
                                      }
                                    />
                                    <LabelText>
                                      Motorista em trânsito (324 x 108)
                                    </LabelText>
                                  </ContentImgLabel>
                                  <ContentButtonLoadImg>
                                    <input
                                      id="imageBanner4"
                                      type="file"
                                      accept=".png, .jpg, .jpeg"
                                      onChange={(e) => {
                                        onChangeImgBanner(
                                          e,
                                          setUrlImgBanner4,
                                          324,
                                          108,
                                          field.onChange
                                        );
                                      }}
                                    />
                                    <label
                                      htmlFor="imageBanner4"
                                      className="labelImg"
                                    >
                                      Carregar Imagem
                                    </label>
                                  </ContentButtonLoadImg>
                                </ContentBannerAndLabel>
                              </ContentInput>
                            )}
                          />
                          {errors.image_driver_transit && (
                            <p style={{ color: "red" }}>
                              {errors.image_driver_transit.message}
                            </p>
                          )}
                        </Form.Item>
                      </Col>
                    </Row>
                  </Form>
                </StyledPanel>

                <StyledPanel header="Público" key="3">
                  <Form layout="vertical">
                    <Row gutter={16}>
                      <Col xs={24} sm={12} lg={12}>
                        <Form.Item label="Selecione o Público *">
                          <Controller
                            name="gender"
                            control={control}
                            render={({ field }) => (
                              <StyledRadioGroup {...field}>
                                <Radio value="all">Todos</Radio>
                                <Radio value="male">Masculino</Radio>
                                <Radio value="female">Feminino</Radio>
                              </StyledRadioGroup>
                            )}
                          />
                          {errors.gender && (
                            <span style={{ color: "red" }}>
                              {errors.gender.message}
                            </span>
                          )}
                        </Form.Item>
                        <hr />
                        <h3>Inteligência de anúncios</h3>
                        <Form.Item label="Idade mínima *">
                          <Controller
                            name="min_age"
                            control={control}
                            render={({ field }) => <Input {...field} />}
                          />
                          {errors.min_age && (
                            <span style={{ color: "red" }}>
                              {errors.min_age.message}
                            </span>
                          )}
                        </Form.Item>
                        <Form.Item label="Idade máxima *">
                          <Controller
                            name="max_age"
                            control={control}
                            render={({ field }) => <Input {...field} />}
                          />
                          {errors.max_age && (
                            <span style={{ color: "red" }}>
                              {errors.max_age .message}
                            </span>
                          )}
                        </Form.Item>

                        <Form.Item label="Raio de Distância Mínima (metros) *">
                          <Controller
                            name="min_distance"
                            control={control}
                            render={({ field }) => <Input {...field} />}
                          />
                          {errors.min_distance && (
                            <span style={{ color: "red" }}>
                              {errors.min_distance.message}
                            </span>
                          )}
                        </Form.Item>
                        <Form.Item label="Raio de Distância Máxima (metros) *">
                          <Controller
                            name="max_distance"
                            control={control}
                            render={({ field }) => <Input {...field} />}
                          />
                          {errors.max_distance && (
                            <span style={{ color: "red" }}>
                              {errors.max_distance.message}
                            </span>
                          )}
                        </Form.Item>

                        <Form.Item label="Selecione a Atividade (Nicho) *">
                          <Controller
                            name="activities"
                            control={control}
                            render={({ field }) => (
                              <Select {...field}>
                                <Select.Option value="gas_fuel">
                                  Gasolina e combustível
                                </Select.Option>
                                <Select.Option value="mechanical_workshop">
                                  Oficina mecânica
                                </Select.Option>
                                <Select.Option value="insurance_company">
                                  Seguradora
                                </Select.Option>
                                <Select.Option value="advertising_company">
                                  Empresa de publicidade
                                </Select.Option>
                                <Select.Option value="car_rental">
                                  Locadora de veículos
                                </Select.Option>
                                <Select.Option value="car_dealership">
                                  Concessionária de veículos
                                </Select.Option>
                                <Select.Option value="restaurant_diner">
                                  Restaurante e lanchonete
                                </Select.Option>
                                <Select.Option value="tracker_alarm_company">
                                  Empresa de rastreadores e alarmes
                                </Select.Option>
                                <Select.Option value="bank_fintech">
                                  Banco e fintech
                                </Select.Option>
                                <Select.Option value="telecom_company">
                                  Companhia de telecomunicações
                                </Select.Option>
                                <Select.Option value="parking_lot">
                                  Estacionamento
                                </Select.Option>
                                <Select.Option value="college_school">
                                  Faculdade e escola
                                </Select.Option>
                                <Select.Option value="logistics_company">
                                  Empresa de logística
                                </Select.Option>
                                <Select.Option value="accommodation_clinic">
                                  Hospedagem e clínica (transporte de pacientes)
                                </Select.Option>
                              </Select>
                            )}
                          />
                          {errors.activities && (
                            <span style={{ color: "red" }}>
                              {errors.activities.message}
                            </span>
                          )}
                        </Form.Item>
                      </Col>
                    </Row>
                  </Form>
                </StyledPanel>

                <StyledPanel header="Locais" key="4">
                  <Form layout="vertical">
                    <Row gutter={16}>
                      <Col
                        xs={24}
                        style={{
                          display: "flex",
                          gap: "16px",
                          alignItems: "center",
                        }}
                      >
                        <div>
                          <StyledImage
                            style={{ width: 80, height: 170, marginBottom: 10 }}
                            src={RequestDrive}
                            alt="Tela passageiro - escolha de chamado"
                          />
                        </div>
                        <div>
                          <Controller
                            name="passenger_screen"
                            defaultValue={false}
                            control={control}
                            render={({ field }) => (
                              <Switch {...field} checked={field.value} />
                            )}
                          />
                          <h3 style={{ marginTop: 7 }}>
                            Tela passageiro - escolha de chamado
                          </h3>
                        </div>
                      </Col>

                      <Col
                        xs={24}
                        style={{
                          display: "flex",
                          gap: "16px",
                          alignItems: "center",
                        }}
                      >
                        <div>
                          <StyledImage
                            style={{ width: 80, height: 170, marginBottom: 10 }}
                            src={DriveLoading}
                            alt="Passageiro em trânsito"
                          />
                        </div>
                        <div>
                          <Controller
                            name="passenger_transit"
                            control={control}
                            defaultValue={false}
                            render={({ field }) => (
                              <Switch {...field} checked={field.value} />
                            )}
                          />
                          <h3 style={{ marginTop: 7 }}>
                            Tela Passageiro - em trânsito
                          </h3>
                        </div>
                      </Col>
                      <Col
                        xs={24}
                        style={{
                          display: "flex",
                          gap: "16px",
                          alignItems: "center",
                        }}
                      >
                        <div>
                          <StyledImage
                            style={{ width: 80, height: 170, marginBottom: 10 }}
                            src={DriveLoading}
                            alt="Passageiro em trânsito"
                          />
                        </div>
                        <div>
                          <Controller
                            name="driver_screen"
                            defaultValue={false}
                            control={control}
                            render={({ field }) => (
                              <Switch {...field} checked={field.value} />
                            )}
                          />
                          <h3 style={{ marginTop: 7 }}>
                            Tela Motorista - Online / Offline
                          </h3>
                        </div>
                      </Col>
                      <Col
                        xs={24}
                        style={{
                          display: "flex",
                          gap: "16px",
                          alignItems: "center",
                        }}
                      >
                        <div>
                          <StyledImage
                            style={{ width: 80, height: 170, marginBottom: 10 }}
                            src={DriveLoading}
                            alt="Motorista em trânsito"
                          />
                        </div>
                        <div>
                          <Controller
                            name="driver_transit"
                            defaultValue={false}
                            control={control}
                            render={({ field }) => (
                              <Switch {...field} checked={field.value} />
                            )}
                          />
                          <h3 style={{ marginTop: 7 }}>
                            Motorista em trânsito
                          </h3>
                        </div>
                      </Col>
                    </Row>
                  </Form>
                </StyledPanel>

                <StyledPanel header="Período" key="5">
                  <Form layout="vertical">
                    <Row gutter={16}>
                      <Col xs={24} sm={12}>
                        <Form.Item label="Data Início *">
                          <Controller
                            name="start_date"
                            control={control}
                            render={({ field }) => (
                              <DatePicker
                                format="DD/MM/YYYY"
                                style={{ width: "100%" }}
                                onChange={(date) =>
                                  field.onChange(date?.format("YYYY-MM-DD"))
                                }
                              />
                            )}
                          />
                          {errors.start_date && (
                            <span style={{ color: "red" }}>
                              {errors.start_date.message}
                            </span>
                          )}
                        </Form.Item>
                      </Col>
                      <Col xs={24} sm={12}>
                        <Form.Item label="Data Fim *">
                          <Controller
                            name="end_date"
                            control={control}
                            render={({ field }) => (
                              <DatePicker
                                format="DD/MM/YYYY"
                                style={{ width: "100%" }}
                                onChange={(date) =>
                                  field.onChange(date?.format("YYYY-MM-DD"))
                                }
                              />
                            )}
                          />
                          {errors.end_date && (
                            <span style={{ color: "red" }}>
                              {errors.end_date.message}
                            </span>
                          )}
                        </Form.Item>
                      </Col>
                      <Col xs={24} sm={12}>
                        <Form.Item label="Horário Início *">
                          <Controller
                            name="start_hour"
                            control={control}
                            render={({ field }) => (
                              <TimePicker
                                format="HH:mm"
                                style={{ width: "100%" }}
                                onChange={(time) =>
                                  field.onChange(time?.format("HH:mm"))
                                }
                              />
                            )}
                          />
                          {errors.start_hour && (
                            <span style={{ color: "red" }}>
                              {errors.start_hour.message}
                            </span>
                          )}
                        </Form.Item>
                      </Col>
                      <Col xs={24} sm={12}>
                        <Form.Item label="Horário Fim *">
                          <Controller
                            name="end_hour"
                            control={control}
                            render={({ field }) => (
                              <TimePicker
                                format="HH:mm"
                                style={{ width: "100%" }}
                                onChange={(time) =>
                                  field.onChange(time?.format("HH:mm"))
                                }
                              />
                            )}
                          />
                          {errors.end_hour && (
                            <span style={{ color: "red" }}>
                              {errors.end_hour.message}
                            </span>
                          )}
                        </Form.Item>
                      </Col>

                      <Col xs={24}>
                        <Form.Item label="Dias da Semana *">
                          <Controller
                            name="days_of_week"
                            control={control}
                            render={({ field }) => (
                              <Checkbox.Group
                              style={{ display: "flex", flexDirection: "column", gap: 5 }}
                                options={[
                                  { label: "Segunda-feira", value: "monday" },
                                  { label: "Terça-feira", value: "tuesday" },
                                  { label: "Quarta-feira", value: "wednesday" },
                                  { label: "Quinta-feira", value: "thursday" },
                                  { label: "Sexta-feira", value: "friday" },
                                  { label: "Sábado", value: "saturday" },
                                  { label: "Domingo", value: "sunday" },
                                ]}
                                value={field.value}
                                onChange={(days) => field.onChange(days)}
                              />
                            )}
                          />
                          {errors.days_of_week && (
                            <span style={{ color: "red" }}>
                              {errors.days_of_week.message}
                            </span>
                          )}
                        </Form.Item>
                      </Col>
                    </Row>
                  </Form>
                </StyledPanel>

                {/* <StyledPanel header="Cobrança" key="6">
                <Form layout="vertical">
                  <Col xs={24} sm={12}>
                    <Form.Item label="Tela inicial motorista - banner largo">
                      <Row gutter={8}>
                        <Col span={8}>
                          <Controller
                            name="teste1"
                            control={control}
                            render={({ field }) => (
                              <Input {...field} placeholder="Valor Interação" />
                            )}
                          />
                        </Col>
                        <Col span={8}>
                          <Controller
                            name="teste2"
                            control={control}
                            render={({ field }) => (
                              <Input {...field} placeholder="Quantidade" />
                            )}
                          />
                        </Col>
                        <Col span={8}>
                          <Controller
                            name="teste3"
                            control={control}
                            render={({ field }) => (
                              <Input {...field} placeholder="Total R$" />
                            )}
                          />
                        </Col>
                      </Row>
                    </Form.Item>
                  </Col>
                  <Col xs={24} sm={12}>
                    <Form.Item label="Tela de estrelas passageiro">
                      <Row gutter={8}>
                        <Col span={8}>
                          <Controller
                            name="teste4"
                            control={control}
                            render={({ field }) => (
                              <Input {...field} placeholder="Valor Interação" />
                            )}
                          />
                        </Col>
                        <Col span={8}>
                          <Controller
                            name="teste5"
                            control={control}
                            render={({ field }) => (
                              <Input {...field} placeholder="Quantidade" />
                            )}
                          />
                        </Col>
                        <Col span={8}>
                          <Controller
                            name="teste6"
                            control={control}
                            render={({ field }) => (
                              <Input {...field} placeholder="Total R$" />
                            )}
                          />
                        </Col>
                      </Row>
                    </Form.Item>
                  </Col>
                  <Col xs={24} sm={12}>
                    <Form.Item label="Tela de estrelas motorista">
                      <Row gutter={8}>
                        <Col span={8}>
                          <Controller
                            name="teste7"
                            control={control}
                            render={({ field }) => (
                              <Input {...field} placeholder="Valor Interação" />
                            )}
                          />
                        </Col>
                        <Col span={8}>
                          <Controller
                            name="teste8"
                            control={control}
                            render={({ field }) => (
                              <Input {...field} placeholder="Quantidade" />
                            )}
                          />
                        </Col>
                        <Col span={8}>
                          <Controller
                            name="teste9"
                            control={control}
                            render={({ field }) => (
                              <Input {...field} placeholder="Total R$" />
                            )}
                          />
                        </Col>
                      </Row>
                    </Form.Item>
                  </Col>
                  <Col xs={24} sm={12}>
                    <Form.Item label="Tela passageiro - abaixo da barra de endereços">
                      <Row gutter={8}>
                        <Col span={8}>
                          <Controller
                            name="teste10"
                            control={control}
                            render={({ field }) => (
                              <Input {...field} placeholder="R$" />
                            )}
                          />
                        </Col>
                        <Col span={8}>
                          <Controller
                            name="teste11"
                            control={control}
                            render={({ field }) => (
                              <Input {...field} placeholder="Quantidade" />
                            )}
                          />
                        </Col>
                        <Col span={8}>
                          <Controller
                            name="teste12"
                            control={control}
                            render={({ field }) => (
                              <Input {...field} placeholder="R$" />
                            )}
                          />
                        </Col>
                      </Row>
                    </Form.Item>
                  </Col>
                </Form>
              </StyledPanel> */}
              </Collapse>
            </Col>
            {!isSmallScreen && (
            <Col xs={24} md={8}>
              {activeKey.includes("1") && (
                // @ts-ignore
                <MockupCellphone formData={formData} />
              )}
            </Col>
            )}
          </Row>
          <ContainerButtonSave>
            <ContentButtonSave>
              <Button
                style={{
                  width: "320px", marginBottom: 32
                }}
                type="primary"
                htmlType="submit"
                loading={loadingButton}
              >
                Salvar
              </Button>
            </ContentButtonSave>
          </ContainerButtonSave>
        </Form>
      </Container>
    </ConfigProvider>
  );
};
