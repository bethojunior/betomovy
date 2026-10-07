import { AxiosError } from "axios";
import swal from "sweetalert";
import { Button, Select, Tag, Popover } from "antd";
import { BiSolidHelpCircle } from "react-icons/bi";
import { useState, useEffect } from "react";

import {
  Container,
  Content,
  ContentInformations,
  Header,
  LabelsInformations,
  ValueInformations,
  TextPopover,
} from "./styles";

import apiApp from "../../../../services/apiApp";

      

import { ServiceTestProps } from "./types";

import { theme_colors } from "../../../../theme/theme";
import { Loader } from "../../../../components/Loader";

export const TestServiceMaps = () => {
  const [valueSelect, setValueSelect] = useState<string>("");
  const [loading, setLoading] = useState<boolean>(false);
  const [servicesTests, setServicesTests] = useState<ServiceTestProps>();

  const [showPopoverPlaces, setShowPopoverPlaces] = useState<boolean>(false);
  const [showPopoverGeocoding, setShowPopoverGeocoding] =
    useState<boolean>(false);
  const [showPopoverDirections, setShowPopoverDirections] =
    useState<boolean>(false);

  const [errorMapKey, setErrorMapKey] = useState<ErrorKeysMapsProps | null>(
    null
  );

  const getErrorsKeysMaps = async () => {
    try {
      const responseErrorKeysMaps = await apiApp.get("map/allServiceTest/");

      if (responseErrorKeysMaps.status && responseErrorKeysMaps.data?.data) {
        setErrorMapKey(responseErrorKeysMaps.data.data);
      }
    } catch (error) {
      const responseError = error as AxiosError;

      if (responseError.message === "Não autorizado") {
        return;
      }

      swal({
        title: responseError.response?.data?.message || "Erro ao carregar dados",
        icon: "error",
      });
    }
  };

  const handleTests = async (nameServiceMap?: string | undefined) => {
    try {
      setLoading(true);
      const responseTests = await apiApp.post("map/serviceTest", {
        type: nameServiceMap ? nameServiceMap : valueSelect,
      });

      if (responseTests.status && responseTests.data?.data) {
        setServicesTests(responseTests.data.data);
      }
    } catch (error) {
      const responseError = error as AxiosError;
      swal({
        title: responseError.response?.data?.message || "Erro ao executar teste",
        icon: "error",
      });
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    getErrorsKeysMaps();
  }, []);

  useEffect(() => {
    if (errorMapKey) {
      setValueSelect(errorMapKey.type);
      handleTests(errorMapKey.type);
    }
  }, [errorMapKey]);




  return (
    <Loader spinning={loading}>
      <Container> 
        <Header>
          <div>
            <Select
              style={{
                width: "100%",
              }}
              value={valueSelect}
              onChange={(value) => setValueSelect(value)}
            >
              <Select.Option value="google">Google</Select.Option>
              <Select.Option value="here">Here</Select.Option>
              <Select.Option value="mapbox">Mapbox</Select.Option>
              <Select.Option value="seumilto">SeuMilto Maps</Select.Option>
            </Select>
            <Button
              type="primary"
              onClick={() => handleTests()}
              disabled={valueSelect.length === 0}
            >
              CLIQUE AQUI AÇÃO DE EMERGÊNCIA
            </Button>
          </div>

          {/* {errorMapKey && (
            <div>
              <Button
                type="primary"
                danger
                onClick={() =>
                  AskChatBot(`${errorMapKey.type} indisponível, como resolver?`)
                }
              >
                CLIQUE AQUI AÇÃO DE EMERGÊNCIA
              </Button>
            </div>
          )} */}
        </Header>
        {servicesTests && (
          <Content>
            <ContentInformations>
              <LabelsInformations>Tipo:</LabelsInformations>
              <ValueInformations>
                {servicesTests?.type.toLocaleUpperCase()}
              </ValueInformations>
            </ContentInformations>

            <ContentInformations>
              <LabelsInformations>Locais (Searching)</LabelsInformations>
              <ValueInformations>
                <div>
                  {typeof servicesTests?.place === "boolean" ? (
                    <Tag color={theme_colors.green}>Disponível</Tag>
                  ) : (
                    <Tag color={theme_colors.red_crismon}>Indisponível</Tag>
                  )}
                  {typeof servicesTests?.place === "string" && (
                    <Popover
                      overlayStyle={{
                        width: 300,
                      }}
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
              <LabelsInformations>Rotas (Directions)</LabelsInformations>
              <ValueInformations>
                <div>
                  {typeof servicesTests?.direction === "boolean" ? (
                    <Tag color={theme_colors.green}>Disponível</Tag>
                  ) : (
                    <Tag color={theme_colors.red_crismon}>Indisponível</Tag>
                  )}

                  {typeof servicesTests?.direction === "string" && (
                    <Popover
                      overlayStyle={{
                        width: 300,
                      }}
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
              <LabelsInformations>Detalhe locais (Geocoding)</LabelsInformations>
              <ValueInformations>
                <div>
                  {typeof servicesTests?.geocoding === "boolean" ? (
                    <Tag color={theme_colors.green}>Disponível</Tag>
                  ) : (
                    <Tag color={theme_colors.red_crismon}>Indisponível</Tag>
                  )}

                  {typeof servicesTests?.geocoding === "string" && (
                    <Popover
                      overlayStyle={{
                        width: 300,
                      }}
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
