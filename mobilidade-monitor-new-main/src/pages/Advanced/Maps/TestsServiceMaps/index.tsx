import { AxiosError } from "axios";
import swal from "sweetalert";
import { Button, Select, Tag, Popover, Input, Alert } from "antd";
import { BiSolidHelpCircle } from "react-icons/bi";
import { useState, useEffect } from "react";
import { AiOutlineKey, AiOutlineCheckCircle, AiOutlineReload } from "react-icons/ai";

import {
  Container,
  Content,
  ContentInformations,
  Header,
  LabelsInformations,
  ValueInformations,
  TextPopover,
} from "./styles";

import api from "../../../../services/api";
import apiApp from "../../../../services/apiApp";
import { ServiceTestProps, ErrorKeysMapsProps } from "./types";
import { theme_colors } from "../../../../theme/theme";
import { Loader } from "../../../../components/Loader";
import { useLanguage } from "../../../../contexts/language";

export const TestServiceMaps = () => {
  const { t } = useLanguage();
  const [valueSelect, setValueSelect] = useState<string>("google");
  const [loading, setLoading] = useState<boolean>(false);
  const [servicesTests, setServicesTests] = useState<ServiceTestProps>();
  const [googleKeyInput, setGoogleKeyInput] = useState<string>("");
  const [savingKey, setSavingKey] = useState<boolean>(false);

  const [showPopoverPlaces, setShowPopoverPlaces] = useState<boolean>(false);
  const [showPopoverGeocoding, setShowPopoverGeocoding] = useState<boolean>(false);
  const [showPopoverDirections, setShowPopoverDirections] = useState<boolean>(false);

  const [errorMapKey, setErrorMapKey] = useState<ErrorKeysMapsProps | null>(null);

  const getCurrentGoogleKey = async () => {
    try {
      const response = await api.get("config/type/13");
      if (response?.status && Array.isArray(response.data?.response)) {
        const found = response.data.response.find(
          (item: any) => item.key === "google_api_key" || item.key === "google_api_key_backend"
        );
        if (found?.value) {
          setGoogleKeyInput(found.value);
        }
      }
    } catch (e) {
      console.warn("Erro ao buscar chave atual:", e);
    }
  };

  const getErrorsKeysMaps = async () => {
    try {
      const responseErrorKeysMaps = await apiApp.get("map/allServiceTest/");

      if (responseErrorKeysMaps?.data) {
        const data = responseErrorKeysMaps.data?.data ?? responseErrorKeysMaps.data?.response;
        if (data) {
          setErrorMapKey(data);
        }
      }
    } catch (error) {
      const responseError = error as AxiosError;
      if (responseError.message === "Não autorizado") {
        return;
      }
    }
  };

  const handleTests = async (nameServiceMap?: string | undefined) => {
    try {
      setLoading(true);
      const serviceType = nameServiceMap ? nameServiceMap : valueSelect;
      const responseTests = await apiApp.post("map/serviceTest", {
        type: serviceType,
      });

      if (responseTests.status && responseTests.data?.data) {
        setServicesTests(responseTests.data.data);
      }
    } catch (error) {
      const responseError = error as AxiosError;
      swal({
        title: responseError.response?.data?.message || t("Erro ao executar teste"),
        icon: "error",
      });
    } finally {
      setLoading(false);
    }
  };

  const handleSaveAndTestGoogleKey = async () => {
    const trimmed = googleKeyInput.trim();
    if (!trimmed) {
      swal({
        title: t("Atenção"),
        text: t("Por favor, informe a chave da API do Google."),
        icon: "warning",
      });
      return;
    }

    try {
      setSavingKey(true);

      const payload = {
        google_api_key: trimmed,
        google_api_key_backend: trimmed,
      };

      let saved = false;
      let lastErrorMessage = "";

      // 1. Tenta PUT /config
      try {
        const resp = await api.put("config", payload);
        if (resp && (resp.status === 200 || resp.status === 201)) {
          saved = true;
        }
      } catch (e: any) {
        lastErrorMessage = e?.response?.data?.message || e?.message || "";
      }

      // 2. Se falhar, tenta POST /config
      if (!saved) {
        try {
          const resp = await api.post("config", payload);
          if (resp && (resp.status === 200 || resp.status === 201)) {
            saved = true;
          }
        } catch (e: any) {
          lastErrorMessage = e?.response?.data?.message || e?.message || lastErrorMessage;
        }
      }

      // 3. Se ainda não salvou, tenta salvar as chaves individualmente (PUT e POST)
      if (!saved) {
        for (const k of ["google_api_key", "google_api_key_backend"]) {
          try {
            await api.put("config", { [k]: trimmed });
            saved = true;
          } catch (e: any) {
            try {
              await api.post("config", { [k]: trimmed });
              saved = true;
            } catch (e2: any) {}
          }
        }
      }

      if (!saved) {
        throw new Error(lastErrorMessage || t("Não foi possível salvar a chave da API."));
      }

      swal({
        title: t("Sucesso"),
        text: t("Chave salva com sucesso! Executando teste..."),
        icon: "success",
        timer: 2000,
      });

      setValueSelect("google");
      setTimeout(() => {
        handleTests("google");
      }, 400);
    } catch (error: any) {
      swal({
        title: t("Erro"),
        text: error?.message || t("Não foi possível salvar a chave da API."),
        icon: "error",
      });
    } finally {
      setSavingKey(false);
    }
  };

  useEffect(() => {
    getCurrentGoogleKey();
    getErrorsKeysMaps();
    handleTests("google");
  }, []);

  useEffect(() => {
    if (errorMapKey?.type) {
      let cleanType = errorMapKey.type;
      try {
        if (typeof cleanType === "string" && (cleanType.startsWith("[") || cleanType.startsWith("{"))) {
          const parsed = JSON.parse(cleanType);
          cleanType = Array.isArray(parsed) ? parsed[0] : parsed;
        }
      } catch (e) {}
      if (cleanType && typeof cleanType === "string") {
        setValueSelect(cleanType);
        handleTests(cleanType);
      }
    }
  }, [errorMapKey]);

  const hasKeyError =
    typeof servicesTests?.place === "string" &&
    (servicesTests.place.includes("invalid") ||
      servicesTests.place.includes("not activated") ||
      servicesTests.place.includes("Billing") ||
      servicesTests.place.includes("expired"));

  return (
    <Loader spinning={loading || savingKey}>
      <Container>
        <Header>
          <div style={{ display: "flex", gap: 10, alignItems: "center", width: "100%", flexWrap: "wrap" }}>
            <div style={{ minWidth: 200 }}>
              <Select
                style={{ width: "100%" }}
                value={valueSelect}
                onChange={(value) => {
                  setValueSelect(value);
                  handleTests(value);
                }}
              >
                <Select.Option value="google">Google Maps</Select.Option>
                <Select.Option value="here">Here Maps</Select.Option>
                <Select.Option value="mapbox">Mapbox</Select.Option>
                <Select.Option value="seumilto">SeuMilto Maps</Select.Option>
              </Select>
            </div>
            <Button
              type="primary"
              onClick={() => handleTests()}
              disabled={valueSelect.length === 0}
              icon={<AiOutlineReload />}
            >
              {t("CLIQUE AQUI AÇÃO DE EMERGÊNCIA")}
            </Button>
          </div>
        </Header>

        {valueSelect === "google" && (
          <div
            style={{
              background: "#fff",
              borderRadius: 8,
              padding: "16px 20px",
              marginBottom: 20,
              boxShadow: "0 1px 4px rgba(0,0,0,0.08)",
              border: "1px solid #e8e8e8",
            }}
          >
            <div style={{ display: "flex", alignItems: "center", gap: 8, marginBottom: 8 }}>
              <AiOutlineKey size={20} color="#1890ff" />
              <strong style={{ fontSize: 16 }}>{t("Configurar Chave Google Maps API")}</strong>
            </div>

            <p style={{ color: "#666", marginBottom: 12, fontSize: 13 }}>
              {t(
                "A chave do Google Maps precisa ter faturamento (Billing) ativo e as seguintes APIs ativadas no Google Cloud Console: Geocoding API, Places API e Directions API."
              )}
            </p>

            <div style={{ display: "flex", gap: 10, flexWrap: "wrap", alignItems: "center" }}>
              <Input
                placeholder="Insira a chave da API (ex: AIzaSy...)"
                value={googleKeyInput}
                onChange={(e) => setGoogleKeyInput(e.target.value)}
                style={{ flex: 1, minWidth: 320 }}
                prefix={<AiOutlineKey style={{ color: "#bfbfbf" }} />}
              />
              <Button
                type="primary"
                onClick={handleSaveAndTestGoogleKey}
                loading={savingKey}
                icon={<AiOutlineCheckCircle />}
                style={{ backgroundColor: "#52c41a", borderColor: "#52c41a" }}
              >
                {t("Salvar e Testar Chave")}
              </Button>
            </div>

            {hasKeyError && (
              <Alert
                style={{ marginTop: 14 }}
                message={t("Atenção com a Chave Google")}
                description={
                  <div>
                    {t(
                      "A chave atual retornou erro. Se a chave for recente, certifique-se de que no Google Cloud Console você ativou: (1) Directions API, (2) Places API e (3) Geocoding API, e que não há restrições de IP que bloqueiem a API no servidor."
                    )}
                  </div>
                }
                type="warning"
                showIcon
              />
            )}
          </div>
        )}

        {servicesTests && (
          <Content>
            <ContentInformations>
              <LabelsInformations>{t("Tipo:")}</LabelsInformations>
              <ValueInformations>
                {servicesTests?.type.toLocaleUpperCase()}
              </ValueInformations>
            </ContentInformations>

            <ContentInformations>
              <LabelsInformations>{t("Locais (Searching)")}</LabelsInformations>
              <ValueInformations>
                <div>
                  {typeof servicesTests?.place === "boolean" ? (
                    <Tag color={theme_colors.green}>{t("Disponível")}</Tag>
                  ) : (
                    <Tag color={theme_colors.red_crismon}>{t("Indisponível")}</Tag>
                  )}
                  {typeof servicesTests?.place === "string" && (
                    <Popover
                      overlayStyle={{ width: 340 }}
                      placement="leftTop"
                      open={showPopoverPlaces}
                      content={<TextPopover>{servicesTests?.place}</TextPopover>}
                      onOpenChange={(value) => setShowPopoverPlaces(value)}
                    >
                      <Button
                        type="text"
                        icon={<BiSolidHelpCircle size={20} />}
                      />
                    </Popover>
                  )}
                </div>
              </ValueInformations>
            </ContentInformations>

            <ContentInformations>
              <LabelsInformations>{t("Rotas (Directions)")}</LabelsInformations>
              <ValueInformations>
                <div>
                  {typeof servicesTests?.direction === "boolean" ? (
                    <Tag color={theme_colors.green}>{t("Disponível")}</Tag>
                  ) : (
                    <Tag color={theme_colors.red_crismon}>{t("Indisponível")}</Tag>
                  )}

                  {typeof servicesTests?.direction === "string" && (
                    <Popover
                      overlayStyle={{ width: 340 }}
                      placement="leftTop"
                      open={showPopoverDirections}
                      content={
                        <TextPopover>{servicesTests?.direction}</TextPopover>
                      }
                      onOpenChange={(value) => setShowPopoverDirections(value)}
                    >
                      <Button
                        type="text"
                        icon={<BiSolidHelpCircle size={20} />}
                      />
                    </Popover>
                  )}
                </div>
              </ValueInformations>
            </ContentInformations>

            <ContentInformations>
              <LabelsInformations>{t("Detalhe locais (Geocoding)")}</LabelsInformations>
              <ValueInformations>
                <div>
                  {typeof servicesTests?.geocoding === "boolean" ? (
                    <Tag color={theme_colors.green}>{t("Disponível")}</Tag>
                  ) : (
                    <Tag color={theme_colors.red_crismon}>{t("Indisponível")}</Tag>
                  )}

                  {typeof servicesTests?.geocoding === "string" && (
                    <Popover
                      overlayStyle={{ width: 340 }}
                      placement="leftTop"
                      open={showPopoverGeocoding}
                      content={
                        <TextPopover>{servicesTests?.geocoding}</TextPopover>
                      }
                      onOpenChange={(value) => setShowPopoverGeocoding(value)}
                    >
                      <Button
                        type="text"
                        icon={<BiSolidHelpCircle size={20} />}
                      />
                    </Popover>
                  )}
                </div>
              </ValueInformations>
            </ContentInformations>
          </Content>
        )}
      </Container>
    </Loader>
  );
};

export default TestServiceMaps;
