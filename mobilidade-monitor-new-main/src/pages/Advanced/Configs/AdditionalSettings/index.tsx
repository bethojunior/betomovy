import { useEffect, useState, useMemo } from "react";
import swal from "sweetalert";
import { Collapse, Input, Button, Switch, Tag, message } from "antd";
import {
  FaSlidersH,
  FaSearch,
  FaSave,
  FaCheckCircle,
  FaTimesCircle,
  FaWhatsapp,
  FaCar,
  FaUser,
  FaMoneyBillWave,
  FaCog,
} from "react-icons/fa";

import {
  Container,
  HeaderCard,
  HeaderInfo,
  MainTitle,
  Subtitle,
  FilterBar,
  SearchWrapper,
  CategoriesWrapper,
  CategoryPill,
  Content,
  ItemHeaderWrapper,
  ItemTitle,
  ItemKeyBadge,
  ConfigDetail,
  KeyMeta,
  ContentButton,
  Loader,
  EmptyState,
} from "./style";

import api from "../../../../services/api";
import { isBooleanConfigInputType } from "../../../../utils/isBooleanConfigInputType";

interface DataListConfigAdditionalProps {
  description: string;
  key: string;
  value: string;
  inputTypePro?: string | null;
  typeName?: string | null;
  configTypeId?: number | string | null;
}

export const AdditionalSettings = () => {
  const [initialLoading, setInitialLoading] = useState<boolean>(true);
  const [savingKey, setSavingKey] = useState<string | null>(null);
  const [dataListConfigAdditional, setDataListConfigAdditional] = useState<
    DataListConfigAdditionalProps[]
  >([]);
  const [values, setValues] = useState<Record<string, string>>({});
  const [search, setSearch] = useState<string>("");
  const [selectedCategory, setSelectedCategory] = useState<string>("all");

  const getConfigsAdditionals = async () => {
    try {
      const responseConfigsAdditionals = await api.get("config/additional");
      let list: DataListConfigAdditionalProps[] = [];

      if (responseConfigsAdditionals?.data) {
        const raw =
          responseConfigsAdditionals.data?.response ??
          responseConfigsAdditionals.data?.data;
        if (Array.isArray(raw) && raw.length > 0) {
          list = raw;
        }
      }

      // Se por qualquer motivo o endpoint /config/additional retornar vazio,
      // busca fallback diretamente em /config
      if (list.length === 0) {
        try {
          const fallbackRes = await api.get("config");
          const rawAll = fallbackRes.data?.response ?? fallbackRes.data?.data ?? [];
          if (Array.isArray(rawAll)) {
            const desiredKeys = [
              "minimum_value_for_withdraw",
              "minimum_value_for_partner_withdraw",
              "max_amount_for_receipt_in_vehicle",
              "fast_finger_call",
              "time_in_seconds_to_call_driver",
              "enable_floating_price_recalculation",
              "whatsapp_message_client",
              "whatsapp_message_driver",
              "scheduled_trip_interval",
              "time_to_notify_driver_trip_scheduled",
              "time_to_call_driver_trip_scheduled_in_seconds",
              "enable_social_networks_on_monitor",
              "enable_operation_manual_and_youtube_channel",
              "time_to_cancel_trip_bid_in_seconds",
              "travel_only_by_offer",
              "title_for_home",
              "how_many_times_alert_will_be_shown",
              "show_more_calcs_driver",
              "text_the_end_trip_with_bonus",
              "text_whatsapp_trip_list_unanswered_support",
              "whatsapp_parabens_driver_message",
              "whatsapp_parabens_client_message",
              "whatsapp_zafira_validated_driver_message",
              "whatsapp_zafira_validated_client_message",
              "minimum_value_for_pix",
              "enable_pix_trip_end_ipag",
              "pulse_group",
              "enable_button_panic_by_city",
              "enable_publicity",
              "enable-button-bills-menu",
              "interval-to-get-trips",
              "link_manager_indication",
            ];
            list = rawAll.filter(
              (item: any) =>
                desiredKeys.includes(item.key) ||
                item.typeName === "GESTOR" ||
                item.configTypeId === 13
            );
          }
        } catch (fbErr) {
          console.warn("Fallback config error:", fbErr);
        }
      }

      setDataListConfigAdditional(list);

      const valMap: Record<string, string> = {};
      list.forEach((item) => {
        valMap[item.key] = item.value ?? "";
      });
      setValues(valMap);
    } catch (error) {
      console.error("Erro ao buscar configurações adicionais:", error);
      message.error("Não foi possível carregar as configurações adicionais.");
    } finally {
      setInitialLoading(false);
    }
  };

  const persistConfig = async (key: string, value: string) => {
    try {
      setSavingKey(key);
      const response = await api.put("/config", { [key]: value });

      if (response?.data?.status) {
        setValues((prev) => ({ ...prev, [key]: value }));
        setDataListConfigAdditional((prev) =>
          prev.map((item) => (item.key === key ? { ...item, value } : item))
        );
        message.success("Configuração atualizada com sucesso!");
      } else {
        message.warning(
          response?.data?.message || "Configuração salva, verifique se foi aplicada."
        );
      }
    } catch (error: any) {
      console.error("Erro ao salvar configuração:", error);
      const errMsg =
        error?.response?.data?.message ||
        "Não foi possível salvar a alteração. Tente novamente.";
      swal({
        title: "Erro ao salvar",
        text: errMsg,
        icon: "error",
      });
    } finally {
      setSavingKey(null);
    }
  };

  const handleInputChange = (key: string, val: string) => {
    setValues((prev) => ({ ...prev, [key]: val }));
  };

  const handleConfirmSave = (key: string, label: string) => {
    const valToSave = values[key] ?? "";
    swal({
      title: "Confirmar alteração",
      text: `Deseja salvar a nova configuração para "${label}"?`,
      icon: "info",
      buttons: ["Cancelar", "Salvar"],
    }).then((confirmChange) => {
      if (confirmChange) {
        persistConfig(key, valToSave);
      }
    });
  };

  const handleToggleChange = (key: string, checked: boolean) => {
    const nextVal = checked ? "1" : "0";
    setValues((prev) => ({ ...prev, [key]: nextVal }));
    persistConfig(key, nextVal);
  };

  const isBooleanConfig = (item: DataListConfigAdditionalProps): boolean => {
    if (isBooleanConfigInputType(item.inputTypePro)) return true;
    const k = item.key;
    const isBoolKey =
      k.startsWith("enable") ||
      k.startsWith("is_") ||
      [
        "fast_finger_call",
        "travel_only_by_offer",
        "show_more_calcs_driver",
        "enable_pix_trip_end_ipag",
        "call_driver_without_credit",
        "customer_register_unblocked",
      ].includes(k);

    if (
      [
        "scheduled_trip_interval",
        "time_in_seconds_to_call_driver",
        "interval-to-get-trips",
        "time_to_cancel_trip_bid_in_seconds",
        "how_many_times_alert_will_be_shown",
      ].includes(k)
    ) {
      return false;
    }

    const v = item.value;
    return isBoolKey || v === "0" || v === "1";
  };

  const isMultilineConfig = (key: string, val: string): boolean => {
    return (
      key.includes("message") ||
      key.includes("text_") ||
      key.includes("terms") ||
      (val && val.length > 50)
    );
  };

  const getCategory = (key: string, typeName?: string | null): string => {
    if (key.includes("whatsapp") || key.includes("message") || key.includes("text_")) {
      return "whatsapp";
    }
    if (
      key.includes("trip") ||
      key.includes("call_driver") ||
      key.includes("fast_finger") ||
      key.includes("travel_only") ||
      key.includes("price") ||
      key.includes("bid")
    ) {
      return "trip";
    }
    if (
      key.includes("driver") ||
      key.includes("withdraw") ||
      key.includes("pix") ||
      key.includes("receipt") ||
      key.includes("pulse")
    ) {
      return "driver";
    }
    if (
      key.includes("customer") ||
      key.includes("client") ||
      key.includes("title_for_home")
    ) {
      return "client";
    }
    if (typeName === "GESTOR" || key.includes("panic") || key.includes("publicity")) {
      return "system";
    }
    return "system";
  };

  const filteredList = useMemo(() => {
    return dataListConfigAdditional.filter((item) => {
      const cat = getCategory(item.key, item.typeName);
      if (selectedCategory !== "all" && cat !== selectedCategory) {
        return false;
      }
      if (search.trim()) {
        const q = search.toLowerCase();
        const matchesKey = item.key.toLowerCase().includes(q);
        const matchesDesc = (item.description || "").toLowerCase().includes(q);
        return matchesKey || matchesDesc;
      }
      return true;
    });
  }, [dataListConfigAdditional, search, selectedCategory]);

  useEffect(() => {
    getConfigsAdditionals();
  }, []);

  if (initialLoading) {
    return (
      <Container>
        <HeaderCard>
          <MainTitle>
            <FaSlidersH style={{ color: "#0284c7" }} /> Configurações Adicionais do Gestor
          </MainTitle>
          <Subtitle>Carregando configurações operacionais...</Subtitle>
        </HeaderCard>
        <Loader spinning tip="Carregando configurações adicionais..." />
      </Container>
    );
  }

  return (
    <Container>
      <HeaderCard>
        <HeaderInfo>
          <MainTitle>
            <FaSlidersH style={{ color: "#0284c7" }} /> Configurações Adicionais do Gestor
          </MainTitle>
          <Subtitle>
            Ajuste limites de saque, mensagens automáticas do WhatsApp, tempos de chamada de viagens e recursos gerais do aplicativo
          </Subtitle>
        </HeaderInfo>

        <FilterBar>
          <SearchWrapper>
            <Input
              prefix={<FaSearch style={{ color: "#94a3b8", marginRight: 6 }} />}
              placeholder="Pesquisar configuração por nome ou chave..."
              value={search}
              onChange={(e) => setSearch(e.target.value)}
              allowClear
              size="middle"
            />
          </SearchWrapper>

          <CategoriesWrapper>
            <CategoryPill
              active={selectedCategory === "all"}
              onClick={() => setSelectedCategory("all")}
            >
              Todas ({dataListConfigAdditional.length})
            </CategoryPill>
            <CategoryPill
              active={selectedCategory === "trip"}
              onClick={() => setSelectedCategory("trip")}
            >
              <FaCar style={{ marginRight: 4 }} /> Viagem & Tarifas
            </CategoryPill>
            <CategoryPill
              active={selectedCategory === "driver"}
              onClick={() => setSelectedCategory("driver")}
            >
              <FaMoneyBillWave style={{ marginRight: 4 }} /> Motorista & Saques
            </CategoryPill>
            <CategoryPill
              active={selectedCategory === "client"}
              onClick={() => setSelectedCategory("client")}
            >
              <FaUser style={{ marginRight: 4 }} /> Clientes
            </CategoryPill>
            <CategoryPill
              active={selectedCategory === "whatsapp"}
              onClick={() => setSelectedCategory("whatsapp")}
            >
              <FaWhatsapp style={{ marginRight: 4 }} /> WhatsApp & Mensagens
            </CategoryPill>
            <CategoryPill
              active={selectedCategory === "system"}
              onClick={() => setSelectedCategory("system")}
            >
              <FaCog style={{ marginRight: 4 }} /> Sistema & Gestor
            </CategoryPill>
          </CategoriesWrapper>
        </FilterBar>
      </HeaderCard>

      <Content>
        {filteredList.length === 0 ? (
          <EmptyState>
            <FaSearch size={36} style={{ color: "#94a3b8" }} />
            <h3>Nenhuma configuração encontrada</h3>
            <p>
              Tente buscar por outro termo ou selecione a categoria "Todas".
            </p>
            {search && (
              <Button type="default" onClick={() => setSearch("")}>
                Limpar Busca
              </Button>
            )}
          </EmptyState>
        ) : (
          <Collapse>
            {filteredList.map((item) => {
              const isBool = isBooleanConfig(item);
              const isMulti = isMultilineConfig(item.key, values[item.key] ?? "");
              const currentVal = values[item.key] ?? item.value ?? "";
              const isChecked = currentVal === "1";
              const label = item.description || item.key;
              const isSaving = savingKey === item.key;

              return (
                <Collapse.Panel
                  key={item.key}
                  header={
                    <ItemHeaderWrapper>
                      <div style={{ display: "flex", alignItems: "center", gap: 10 }}>
                        <ItemTitle>{label}</ItemTitle>
                        <ItemKeyBadge>{item.key}</ItemKeyBadge>
                      </div>
                      <div style={{ display: "flex", alignItems: "center", gap: 8 }}>
                        {isBool ? (
                          <Tag
                            color={isChecked ? "success" : "default"}
                            icon={isChecked ? <FaCheckCircle /> : <FaTimesCircle />}
                            style={{ margin: 0, padding: "2px 8px", borderRadius: 4 }}
                          >
                            {isChecked ? "Ativado" : "Desativado"}
                          </Tag>
                        ) : (
                          <Tag
                            color="blue"
                            style={{
                              margin: 0,
                              maxWidth: 160,
                              overflow: "hidden",
                              textOverflow: "ellipsis",
                              whiteSpace: "nowrap",
                              borderRadius: 4,
                            }}
                          >
                            {currentVal || "(Vazio)"}
                          </Tag>
                        )}
                      </div>
                    </ItemHeaderWrapper>
                  }
                >
                  <ConfigDetail>
                    <KeyMeta>
                      <span>
                        Chave no Banco: <strong>{item.key}</strong>
                      </span>
                      {item.typeName && (
                        <span>
                          • Categoria: <Tag color="geekblue">{item.typeName}</Tag>
                        </span>
                      )}
                    </KeyMeta>

                    {isBool ? (
                      <div
                        style={{
                          display: "flex",
                          alignItems: "center",
                          gap: 16,
                          padding: "10px 0",
                        }}
                      >
                        <Switch
                          checked={isChecked}
                          loading={isSaving}
                          onChange={(chk) => handleToggleChange(item.key, chk)}
                        />
                        <span style={{ fontSize: 14, fontWeight: 600, color: isChecked ? "#16a34a" : "#64748b" }}>
                          {isChecked
                            ? "Opção ATIVADA no sistema"
                            : "Opção DESATIVADA no sistema"}
                        </span>
                      </div>
                    ) : (
                      <div>
                        {isMulti ? (
                          <Input.TextArea
                            rows={4}
                            value={currentVal}
                            onChange={(e) => handleInputChange(item.key, e.target.value)}
                            placeholder="Insira o texto ou mensagem..."
                            style={{ borderRadius: 6, fontSize: 14 }}
                          />
                        ) : (
                          <Input
                            value={currentVal}
                            onChange={(e) => handleInputChange(item.key, e.target.value)}
                            placeholder="Insira o valor..."
                            size="large"
                            style={{ borderRadius: 6, fontSize: 14 }}
                          />
                        )}

                        <ContentButton>
                          <Button
                            type="primary"
                            icon={<FaSave style={{ marginRight: 6 }} />}
                            loading={isSaving}
                            onClick={() => handleConfirmSave(item.key, label)}
                            style={{
                              background: "#0284c7",
                              borderColor: "#0284c7",
                              borderRadius: 6,
                              fontWeight: 600,
                              height: 38,
                            }}
                          >
                            Salvar Alteração
                          </Button>
                        </ContentButton>
                      </div>
                    )}
                  </ConfigDetail>
                </Collapse.Panel>
              );
            })}
          </Collapse>
        )}
      </Content>
    </Container>
  );
};

export default AdditionalSettings;
