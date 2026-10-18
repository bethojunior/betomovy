import { FC, useEffect, useState, useMemo } from "react";
import { Select, Input, Button, Tooltip, Badge } from "antd";
import { MdOutlineLocationCity, MdRefresh, MdSearch } from "react-icons/md";
import { FaArrowUp } from "react-icons/fa";

import CardNumber from "../../../../components/Advanced/Config/ByCity/Cards/Number";
import CardPhone from "../../../../components/Advanced/Config/ByCity/Cards/Phone";
import CardEmail from "../../../../components/Advanced/Config/ByCity/Cards/Email";
import CardLink from "../../../../components/Advanced/Config/ByCity/Cards/Link";
import CardSwitch from "../../../../components/Advanced/Config/ByCity/Cards/Switch";
import CardTimezone from "../../../../components/Advanced/Config/ByCity/Cards/Timezone";
import CardCurrency from "../../../../components/Advanced/Config/ByCity/Cards/Currency";
import CardPrepaid from "../../../../components/Advanced/Config/ByCity/Cards/Prepaid";
import CardTextarea from "../../../../components/Advanced/Config/ByCity/Cards/Textarea";
import CardCollapse from "../../../../components/Advanced/Config/ByCity/Cards/Collapse";
import Alert from "../../../../components/Utils/Alert";
import Preload from "../../../../components/Utils/Preload";

import api from "../../../../services/api";
import Session from "../../../../utils/Session";
import Utils from "../../../../utils/Utils";

import { ConfigCitiesList, ConfigCitiesData, InputTypeProps } from "./types";
import { isWhatsAppZafiraTemplateAttribute } from "./constants";
import {
  Div,
  Body,
  ErrorLoadingData,
  MessageError,
  Loader,
  HeaderBar,
  HeaderRow,
  CitySelectWrapper,
  SearchWrapper,
  CategoryFilterRow,
  CategoryChip,
  ScrollToTopButton,
} from "./styles";

interface CityItem {
  id: number;
  cityId?: number;
  nome: string;
  name?: string;
  estado?: string;
  uf?: string;
}

const CATEGORY_MAP: Record<string, string[]> = {
  travels: [
    "kmRemainingToPutDriverPreAvailable",
    "quantityTripWayPoints",
    "enableTripSharing",
    "enableTripSuggestion",
    "enableTripRecalculation",
    "enableDriverDataSheet",
    "enableChoicePriceTripRecalculation",
    "showPriceWhileTrip",
    "showUserRating",
    "enableCallInChat",
    "enableTripScheduled",
    "enableKnobTrip",
    "enableTripTurbo",
    "enableSearchDriver",
    "showCategoriesOnHome",
    "quantityDriversCloseOnCall",
    "kmForCalculatePrice",
    "enabledDriverFields",
    "enableRouteDrawingInTicketScreen",
    "enableDepartureAddressConfirmation",
    "recalculationFromKm",
    "marginForRecalculation",
    "addTripNote",
    "enableCustomOrderTripType",
  ],
  pricing: [
    "cancellationCustomerFeeValue",
    "waitingTimeCustomerCancellationFee",
    "routePercentageCancellationFee",
    "daysToBillCancellationFee",
    "typeMoney",
    "showFormOfPaymentToDriverDuringTrip",
    "showCancellationFeeForCustomer",
    "allowDriverGenerateCancellationFee",
    "showNetValueForDriverOnCall",
    "maximumAmountNegativeBalanceDriver",
    "prepayPerPeriod",
  ],
  zafira: [
    "enableZafiraValidationMonitor",
    "enableZafiraValidationApp",
    "requireCustomerDataKnobTrip",
    "zafiraValidationPrice",
    "whatsapp_zafira_validated_driver_message",
    "whatsapp_zafira_validated_client_message",
    "enableValidationDocumentInTrip",
  ],
  support: [
    "securityContactNumber",
    "supportContactNumber",
    "supportEmail",
    "urlFacebook",
    "urlInstagram",
  ],
  location: [
    "timezone",
    "showDynamicAreaInMap",
    "showRiskAreaInCall",
  ],
};

const ConfigByCities: FC = () => {
  const [loading, setLoading] = useState<boolean>(false);
  const [cities, setCities] = useState<CityItem[]>([]);
  const [defaultCity, setDefaultCity] = useState<string>("");
  const [messageAlert, setMessageAlert] = useState<string>("");
  const [showAlert, setShowAlert] = useState<boolean>(false);
  const [typeAlert, setTypeAlert] = useState<"success" | "info" | "warning" | "error">("success");

  const [configCitiesList, setConfigCitiesList] = useState<ConfigCitiesList>([]);
  const [showData, setShowData] = useState<boolean>(false);
  const [renderKey, setRenderKey] = useState<number>(0);

  const [searchQuery, setSearchQuery] = useState<string>("");
  const [selectedCategory, setSelectedCategory] = useState<string>("all");
  const [showScrollTop, setShowScrollTop] = useState<boolean>(false);

  // Load cities list
  const loadCities = async () => {
    try {
      let citiesList: CityItem[] = [];
      try {
        const res = await api.get("city/actives");
        const data = res.data?.response ?? res.data?.data ?? [];
        if (Array.isArray(data) && data.length > 0) {
          citiesList = data;
        }
      } catch (err) {
        // Fallback to city/actives/fully or city
        try {
          const res2 = await api.get("city/actives/fully");
          const data2 = res2.data?.response ?? res2.data?.data ?? [];
          if (Array.isArray(data2) && data2.length > 0) {
            citiesList = data2;
          }
        } catch {
          // Empty
        }
      }

      if (citiesList.length > 0) {
        setCities(citiesList);
        const savedCity = Session.getLocal("citySelected");
        const savedCityId = savedCity?.cityId ?? savedCity?.id;

        const targetId = savedCityId
          ? String(savedCityId)
          : String(citiesList[0].cityId ?? citiesList[0].id);

        setDefaultCity(targetId);
        loadConfigData(targetId);
      } else {
        const fallbackCity = Session.getLocal("citySelected")?.cityId ?? 1;
        setDefaultCity(String(fallbackCity));
        loadConfigData(String(fallbackCity));
      }
    } catch (error) {
      console.error("Erro ao carregar cidades:", error);
    }
  };

  const loadConfigData = (cityId?: string) => {
    const targetCity = cityId || defaultCity || Session.getLocal("citySelected")?.cityId;
    if (!targetCity) {
      setShowData(true);
      return Promise.resolve();
    }

    setLoading(true);
    return api
      .get(`city/${targetCity}/config`)
      .then((res) => {
        const list = res.data?.response ?? res.data?.data ?? [];
        if (Array.isArray(list) && list.length > 0 && typeof list[0] === "object" && list[0] !== null && "attribute" in list[0]) {
          setConfigCitiesList(list);
          setShowData(false);
          setRenderKey((prev) => prev + 1);
        } else {
          setConfigCitiesList([]);
          setShowData(false);
        }
      })
      .catch((err) => {
        console.error("Erro ao carregar configurações da cidade:", err);
        setShowData(true);
      })
      .finally(() => {
        setLoading(false);
      });
  };

  useEffect(() => {
    loadCities();

    const handleScroll = () => {
      const scrollEl = document.getElementById("main-scroll-content");
      const scrollY = scrollEl ? scrollEl.scrollTop : window.scrollY;
      setShowScrollTop(scrollY > 250);
    };

    const scrollContainer = document.getElementById("main-scroll-content") || window;
    scrollContainer.addEventListener("scroll", handleScroll);

    return () => {
      scrollContainer.removeEventListener("scroll", handleScroll);
    };
  }, []);

  const handleCityChange = (newCityId: string) => {
    setDefaultCity(newCityId);
    const chosen = cities.find((c) => String(c.cityId ?? c.id) === newCityId);
    if (chosen) {
      Session.setLocal("citySelected", {
        cityId: Number(newCityId),
        id: Number(newCityId),
        nome: chosen.nome || chosen.name || "",
        shortName: chosen.shortName || chosen.nome || "",
      });
    }
    loadConfigData(newCityId);
  };

  const scrollToTop = () => {
    const scrollEl = document.getElementById("main-scroll-content");
    if (scrollEl) {
      scrollEl.scrollTo({ top: 0, behavior: "smooth" });
    } else {
      window.scrollTo({ top: 0, behavior: "smooth" });
    }
  };

  const onSearch = (
    value: string | boolean,
    attribute: string,
    inputType: string
  ) => {
    const data: InputTypeProps = {};

    if (attribute === "marginForRecalculation") {
      const valueRecalculationFromKm = configCitiesList.find(
        (item) => item.attribute === "recalculationFromKm"
      )?.value;

      if (valueRecalculationFromKm && Number(valueRecalculationFromKm) < Number(value)) {
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

  const sendRequest = (data: string | boolean | {}) => {
    setLoading(true);
    const targetCity = defaultCity || Session.getLocal("citySelected")?.cityId;
    api
      .put(`/city/${targetCity}/config`, data)
      .then((values) => {
        if (values.status !== 200) {
          setShowAlert(true);
          setTypeAlert("error");
          setLoading(false);
          return setMessageAlert(
            "Não foi possível alterar a configuração, tente novamente"
          );
        }

        loadConfigData(String(targetCity)).then(() => {
          setShowAlert(true);
          setTypeAlert("success");
          setMessageAlert("Configuração atualizada com sucesso");
          setLoading(false);
          setRenderKey((prev) => prev + 1);
        });
      })
      .catch(() => {
        setShowAlert(true);
        setTypeAlert("error");
        setLoading(false);
        setMessageAlert("Erro ao alterar a configuração, tente novamente");
      });
  };

  // Filtered configs
  const filteredConfigs = useMemo(() => {
    return configCitiesList.filter((item) => {
      // Category filter
      if (selectedCategory !== "all") {
        const allowedKeys = CATEGORY_MAP[selectedCategory];
        if (allowedKeys && !allowedKeys.includes(item.attribute)) {
          return false;
        }
      }

      // Search query filter
      if (searchQuery.trim() !== "") {
        const q = searchQuery.toLowerCase().trim();
        const attrMatch = item.attribute.toLowerCase().includes(q);
        const descMatch = (item.description || "").toLowerCase().includes(q);
        return attrMatch || descMatch;
      }

      return true;
    });
  }, [configCitiesList, selectedCategory, searchQuery]);

  return (
    <Div>
      <Preload visible={loading} />

      <HeaderBar>
        <HeaderRow>
          <CitySelectWrapper>
            <MdOutlineLocationCity size={22} color="#1677ff" />
            <span className="city-label">Configurações da Cidade:</span>
            <Select
              style={{ minWidth: 220 }}
              value={defaultCity || undefined}
              onChange={handleCityChange}
              placeholder="Selecione uma cidade"
              showSearch
              filterOption={(input, option) =>
                (option?.label ?? "").toLowerCase().includes(input.toLowerCase())
              }
              options={cities.map((c) => ({
                value: String(c.cityId ?? c.id),
                label: `${c.nome || c.name || "Cidade " + (c.cityId ?? c.id)}${
                  c.estado || c.uf ? ` - ${c.estado || c.uf}` : ""
                }`,
              }))}
            />
            <Tooltip title="Recarregar configurações">
              <Button
                icon={<MdRefresh size={18} />}
                onClick={() => loadConfigData(defaultCity)}
              />
            </Tooltip>
          </CitySelectWrapper>

          <SearchWrapper>
            <Input
              prefix={<MdSearch size={18} color="#9ca3af" />}
              placeholder="Buscar parâmetro ou descrição..."
              value={searchQuery}
              onChange={(e) => setSearchQuery(e.target.value)}
              allowClear
            />
            <Badge
              count={`${filteredConfigs.length} / ${configCitiesList.length}`}
              style={{ backgroundColor: "#1677ff" }}
            />
          </SearchWrapper>
        </HeaderRow>

        <CategoryFilterRow>
          <CategoryChip
            $active={selectedCategory === "all"}
            onClick={() => setSelectedCategory("all")}
          >
            Todos ({configCitiesList.length})
          </CategoryChip>
          <CategoryChip
            $active={selectedCategory === "travels"}
            onClick={() => setSelectedCategory("travels")}
          >
            Viagens e Chamados
          </CategoryChip>
          <CategoryChip
            $active={selectedCategory === "pricing"}
            onClick={() => setSelectedCategory("pricing")}
          >
            Taxas e Pagamentos
          </CategoryChip>
          <CategoryChip
            $active={selectedCategory === "zafira"}
            onClick={() => setSelectedCategory("zafira")}
          >
            WhatsApp e Zafira
          </CategoryChip>
          <CategoryChip
            $active={selectedCategory === "support"}
            onClick={() => setSelectedCategory("support")}
          >
            Contatos e Suporte
          </CategoryChip>
          <CategoryChip
            $active={selectedCategory === "location"}
            onClick={() => setSelectedCategory("location")}
          >
            Localização e Mapa
          </CategoryChip>
        </CategoryFilterRow>
      </HeaderBar>

      <Alert
        visibility={showAlert}
        message={messageAlert}
        typeAlert={typeAlert}
        setVisibility={setShowAlert}
      />

      {loading && configCitiesList.length === 0 ? (
        <Loader spinning />
      ) : showData === true ? (
        <ErrorLoadingData>
          <MessageError>
            Não foi possível carregar os dados desta cidade. Verifique se a cidade está cadastrada.
          </MessageError>
        </ErrorLoadingData>
      ) : (
        <Body>
          {filteredConfigs.length === 0 ? (
            <div
              style={{
                textAlign: "center",
                padding: "40px 20px",
                color: "#6b7280",
                fontSize: "14px",
              }}
            >
              Nenhum parâmetro encontrado para o filtro selecionado.
            </div>
          ) : (
            filteredConfigs.map((item: ConfigCitiesData) => {
              if (item.attribute === "timezone") {
                return (
                  <CardTimezone
                    key={`${item.attribute}-${renderKey}`}
                    item={item}
                    onSearch={onSearch}
                  />
                );
              }

              const itemDesc = (item.description || "").toLowerCase();
              if (
                item.attribute === "typeMoney" ||
                itemDesc.includes("moeda") ||
                itemDesc.includes("currency")
              ) {
                return (
                  <CardCurrency
                    key={`${item.attribute}-${renderKey}`}
                    item={item}
                    onSearch={onSearch}
                  />
                );
              }

              if (
                item.attribute === "prepayPerPeriod" ||
                itemDesc.includes("pré-pago") ||
                itemDesc.includes("prepago") ||
                itemDesc.includes("prepaid")
              ) {
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
                  return (
                    <CardCollapse
                      key={`${item.attribute}-${renderKey}`}
                      item={item}
                      sendRequest={sendRequest}
                    />
                  );
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
            })
          )}
        </Body>
      )}

      {showScrollTop && (
        <ScrollToTopButton onClick={scrollToTop} title="Voltar ao topo">
          <FaArrowUp />
        </ScrollToTopButton>
      )}
    </Div>
  );
};

export default ConfigByCities;
