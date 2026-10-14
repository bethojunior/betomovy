import {
  Container,
  HeaderCard,
  HeaderInfo,
  MainTitle,
  Subtitle,
  HeaderActions,
  StatsContainer,
  StatCard,
  TableCard,
  FilterBar,
  SearchGroup,
  ContentInput,
  LabelText,
  ContentMap,
  ActionButtons,
} from "./styles";

import { useEffect, useRef, useState, useContext, useMemo } from "react";
import { useHistory } from "react-router-dom";

import { Input, Button, Table, Tag, Modal, Tooltip, Empty } from "antd";
import swal from "sweetalert";
import { AxiosError } from "axios";
import mapboxgl, { Map as MapboxMap } from "mapbox-gl";
import MapboxDraw from "@mapbox/mapbox-gl-draw";
import "mapbox-gl/dist/mapbox-gl.css";
import "@mapbox/mapbox-gl-draw/dist/mapbox-gl-draw.css";

import { 
  FaCity, 
  FaPlus, 
  FaRedo, 
  FaSearch, 
  FaEdit, 
  FaTrash, 
  FaMapMarkedAlt, 
  FaCheckCircle, 
  FaExclamationTriangle,
  FaDrawPolygon
} from "react-icons/fa";

import api from "../../../../../services/api";
import Preload from "../../../../../components/Utils/Preload";
import Utils from "../../../../../utils/Utils";
import { useMapbox } from "../../../../../contexts/mapbox";
import AuthContext from "../../../../../contexts/auth";
import { CIDADE, CIDADE_EDITAR_AREA } from "../../../../../constants/permissions";

import { CitiesFullyProps } from "../AddCity/types";
import { InformationsCityProps } from "./types";

export const EditCity = () => {
  const { hasPermission } = useContext(AuthContext);
  const history = useHistory();
  const [nameCity, setNameCity] = useState<string>("");
  const [citiesFully, setCitiesFully] = useState<CitiesFullyProps[]>([]);
  const [informationsCity, setInformationCity] = useState<InformationsCityProps | null>(null);
  const [loading, setLoading] = useState<boolean>(false);
  const [searchTerm, setSearchTerm] = useState<string>("");
  const [isEditModalOpen, setIsEditModalOpen] = useState<boolean>(false);

  const mapContainer = useRef<HTMLDivElement | null>(null);
  const map = useRef<MapboxMap | null>(null);
  const draw = useRef<MapboxDraw | null>(null);

  const [coordinatesCity, setCoordinatesCity] = useState<[number, number] | null>(null);
  const [coordinatesCaptured, setCoordinatesCaptured] = useState<any>();

  const placeRef = useRef<any>(coordinatesCity);
  const { mapboxToken } = useMapbox();

  const coordinatesCityFormated = coordinatesCity?.map((value: any) => {
    return [value[1], value[0]];
  });

  placeRef.current = coordinatesCityFormated;

  const getCitiesFully = async () => {
    try {
      setLoading(true);
      const responseCitiesFully = await api.get("city/actives/fully");

      if (responseCitiesFully.status) {
        setCitiesFully(
          Array.isArray(responseCitiesFully.data?.response) 
            ? responseCitiesFully.data.response 
            : []
        );
      }
    } catch (error) {
      console.error(error);
      swal({
        title: "Erro ao carregar cidades ativas",
        icon: "error",
      });
    } finally {
      setLoading(false);
    }
  };

  const getInformationsCity = async (idCity: number) => {
    try {
      setLoading(true);
      setCoordinatesCaptured(undefined);

      const responseInformationsCity = await api.get(`city/${idCity}`);

      if (responseInformationsCity?.status) {
        const cityData =
          responseInformationsCity.data?.response ??
          responseInformationsCity.data?.data;
        if (cityData) {
          setInformationCity(cityData);
          setNameCity(cityData.nome || "");
          setIsEditModalOpen(true);

          if (!cityData.polygon) {
            swal({
              title: "Aviso",
              text: "Esta cidade ainda não possui área delimitada cadastrada. Você pode desenhar a área no mapa e salvar.",
              icon: "info",
            });
          }
        }
      }
    } catch (error) {
      console.error(error);
      swal({
        title: "Erro ao buscar informações da cidade",
        icon: "error",
      });
    } finally {
      setLoading(false);
    }
  };

  const handleUpdateCity = () => {
    swal({
      title: "Deseja realmente atualizar os dados desta cidade?",
      icon: "info",
      buttons: ["Não", "Sim"],
    }).then((isAccept) => {
      if (isAccept) {
        const coordinatesCityInverse = Array.isArray(coordinatesCityFormated)
          ? coordinatesCityFormated.map((value: any) => ({
              lat: value[1],
              lng: value[0],
            }))
          : undefined;

        const coordinatesCityCapturedFormated = Array.isArray(coordinatesCaptured)
          ? coordinatesCaptured.map((value: [number, number]) => ({
              lat: value[1],
              lng: value[0],
            }))
          : undefined;

        const finalPolygon =
          coordinatesCityCapturedFormated && coordinatesCityCapturedFormated.length > 0
            ? coordinatesCityCapturedFormated
            : coordinatesCityInverse;

        if (!finalPolygon || finalPolygon.length === 0) {
          swal({
            title: "Atenção",
            text: "Por favor, desenhe uma área no mapa antes de salvar.",
            icon: "warning",
          });
          return;
        }

        setLoading(true);
        api
          .put(`city/${informationsCity?.id}/area`, {
            estate_id: informationsCity?.estado,
            name: nameCity,
            polygon: finalPolygon,
            short_name: informationsCity?.shortName,
            old_name: informationsCity?.nome,
          })
          .then((response) => {
            if (response.status) {
              swal({
                title: "Dados da cidade atualizados com sucesso!",
                icon: "success",
              });
              setIsEditModalOpen(false);
              getCitiesFully();
            } else {
              swal({
                title: "Ocorreu um erro ao tentar atualizar área",
                icon: "error",
              });
            }
          })
          .catch((error: AxiosError<any>) => {
            swal({
              title: error.response?.data?.message || "Erro ao atualizar área da cidade",
              icon: "error",
            });
          })
          .finally(() => {
            setLoading(false);
          });
      }
    });
  };

  const handleDeleteCity = (cityId: number, cityName: string) => {
    swal({
      title: `Remover "${cityName}"?`,
      text: "Tem certeza que deseja remover esta cidade do sistema de atendimento ativo?",
      icon: "warning",
      buttons: ["Cancelar", "Sim, Remover"],
      dangerMode: true,
    }).then(async (willDelete) => {
      if (willDelete) {
        try {
          setLoading(true);
          const response = await api.delete(`role/city/delete/${cityId}`);

          if (response.status) {
            swal({
              title: "Cidade removida com sucesso!",
              icon: "success",
            });
            getCitiesFully();
          } else {
            swal({
              title: "Não foi possível remover a cidade",
              icon: "error",
            });
          }
        } catch (error) {
          const responseError = error as AxiosError<any>;
          const errMsg = Array.isArray(responseError.response?.data?.response)
            ? responseError.response?.data?.response[0]
            : (responseError.response?.data?.message || "Erro ao remover cidade");
          swal({
            title: errMsg,
            icon: "error",
          });
        } finally {
          setLoading(false);
        }
      }
    });
  };

  useEffect(() => {
    getCitiesFully();
  }, []);

  // Initialize Mapbox map inside Edit Modal
  useEffect(() => {
    if (!isEditModalOpen || !mapboxToken) return;

    const timer = setTimeout(() => {
      if (!mapContainer.current) return;

      // Clean up prior map instance if any
      if (map.current) {
        map.current.remove();
        map.current = null;
      }

      mapboxgl.accessToken = mapboxToken;

      map.current = new mapboxgl.Map({
        container: mapContainer.current,
        style: "mapbox://styles/mapbox/streets-v11",
        center: [-49.27, -16.68],
        zoom: 4,
      });

      draw.current = new MapboxDraw({
        displayControlsDefault: false,
        controls: {
          polygon: true,
          trash: true,
        },
        styles: [
          {
            id: 'gl-draw-polygon-fill-inactive',
            type: 'fill',
            filter: ['all', ['==', 'active', 'false'], ['==', '$type', 'Polygon'], ['!=', 'mode', 'static']],
            paint: {
              'fill-color': '#0284c7',
              'fill-outline-color': '#0284c7',
              'fill-opacity': 0.35
            }
          },
          {
            id: 'gl-draw-polygon-fill-active',
            type: 'fill',
            filter: ['all', ['==', 'active', 'true'], ['==', '$type', 'Polygon']],
            paint: {
              'fill-color': '#0284c7',
              'fill-outline-color': '#0284c7',
              'fill-opacity': 0.35
            }
          },
          {
            id: 'gl-draw-polygon-stroke-inactive',
            type: 'line',
            filter: ['all', ['==', 'active', 'false'], ['==', '$type', 'Polygon'], ['!=', 'mode', 'static']],
            layout: {
              'line-cap': 'round',
              'line-join': 'round'
            },
            paint: {
              'line-color': '#0284c7',
              'line-width': 2
            }
          },
          {
            id: 'gl-draw-polygon-stroke-active',
            type: 'line',
            filter: ['all', ['==', 'active', 'true'], ['==', '$type', 'Polygon']],
            layout: {
              'line-cap': 'round',
              'line-join': 'round'
            },
            paint: {
              'line-color': '#0284c7',
              'line-width': 2
            }
          }
        ]
      });

      map.current.addControl(draw.current as any);

      map.current.on("load", () => {
        if (informationsCity) {
          const coords = informationsCity.polygon
            ? Utils.TransformCoordinates(informationsCity.polygon)
            : [];

          setCoordinatesCity(coords);
          setCoordinatesCaptured(undefined);

          const hasCoords = Array.isArray(coords) && coords.length > 0;

          if (hasCoords) {
            const centerCoordinates = Utils.CenterCoordinates(coords);
            if (centerCoordinates && map.current) {
              map.current.flyTo({
                center: [centerCoordinates[1], centerCoordinates[0]],
                zoom: 10,
              });
            }

            if (draw.current) {
              const formatted = coords.map((v: any) => [v[1], v[0]]);
              draw.current.add({
                type: "Feature",
                geometry: {
                  type: "Polygon",
                  coordinates: [formatted],
                },
              } as any);
            }
          }
        }
      });

      map.current.on("draw.create", (event: any) => {
        const feature = event?.features?.[0];
        if (feature?.geometry?.coordinates?.[0]) {
          const currentCoordinatesId = feature.id;
          const allFeatures = draw.current?.getAll()?.features || [];
          const oldCoordinatesId = allFeatures.find((f: any) => f.id !== currentCoordinatesId)?.id;

          setCoordinatesCaptured(feature.geometry.coordinates[0]);

          if (oldCoordinatesId) {
            draw.current?.delete(oldCoordinatesId as string);
          }
        }
      });

      map.current.on("draw.update", (event: any) => {
        const feature = event?.features?.[0];
        if (feature?.geometry?.coordinates?.[0]) {
          setCoordinatesCaptured(feature.geometry.coordinates[0]);
        }
      });

      map.current.on("draw.delete", () => {
        setCoordinatesCaptured(undefined);
      });
    }, 200);

    return () => clearTimeout(timer);
  }, [isEditModalOpen, informationsCity, mapboxToken]);

  // Filter cities for search
  const filteredCities = useMemo(() => {
    if (!searchTerm.trim()) {
      return citiesFully;
    }
    const term = searchTerm.toLowerCase();
    return citiesFully.filter(
      (c) =>
        c.nome?.toLowerCase().includes(term) ||
        c.shortName?.toLowerCase().includes(term) ||
        String(c.cityId).includes(term)
    );
  }, [citiesFully, searchTerm]);

  // Statistics
  const stats = useMemo(() => {
    const total = citiesFully.length;
    const withPolygon = citiesFully.filter((c) => !!c.polygon && c.polygon !== "[]").length;
    const withoutPolygon = total - withPolygon;
    return { total, withPolygon, withoutPolygon };
  }, [citiesFully]);

  useEffect(() => {
    if (!hasPermission(CIDADE, CIDADE_EDITAR_AREA)) {
      history.replace("/");
    }
  }, [hasPermission, history]);

  if (!hasPermission(CIDADE, CIDADE_EDITAR_AREA)) {
    return null;
  }

  const columns = [
    {
      title: "ID",
      dataIndex: "cityId",
      key: "cityId",
      width: 80,
      render: (id: number) => <span style={{ fontWeight: 600, color: "#64748b" }}>#{id}</span>,
    },
    {
      title: "Nome da Cidade",
      dataIndex: "nome",
      key: "nome",
      render: (nome: string, record: CitiesFullyProps) => (
        <div style={{ display: "flex", alignItems: "center", gap: 8 }}>
          <FaCity style={{ color: "#0284c7" }} />
          <span style={{ fontWeight: 600, color: "#0f172a" }}>{nome || "Sem nome"}</span>
          {record.shortName && (
            <Tag color="default" style={{ fontSize: 11 }}>
              {record.shortName}
            </Tag>
          )}
        </div>
      ),
    },
    {
      title: "Área de Atuação",
      dataIndex: "polygon",
      key: "polygon",
      render: (polygon: string) => {
        const hasArea = !!polygon && polygon !== "[]";
        return hasArea ? (
          <Tag color="green" icon={<FaCheckCircle style={{ marginRight: 4 }} />}>
            Delimitada
          </Tag>
        ) : (
          <Tag color="orange" icon={<FaExclamationTriangle style={{ marginRight: 4 }} />}>
            Sem Delimitação
          </Tag>
        );
      },
    },
    {
      title: "Ações",
      key: "actions",
      width: 220,
      render: (_: any, record: CitiesFullyProps) => (
        <ActionButtons>
          <Tooltip title="Editar nome e delimitação no mapa">
            <Button
              type="primary"
              size="middle"
              icon={<FaMapMarkedAlt style={{ marginRight: 6 }} />}
              onClick={() => getInformationsCity(record.cityId)}
              style={{
                borderRadius: 6,
                background: "#0284c7",
                border: "none",
                display: "inline-flex",
                alignItems: "center",
              }}
            >
              Editar Área
            </Button>
          </Tooltip>

          <Tooltip title="Remover cidade das ativas">
            <Button
              danger
              size="middle"
              icon={<FaTrash />}
              onClick={() => handleDeleteCity(record.cityId, record.nome)}
              style={{ borderRadius: 6 }}
            />
          </Tooltip>
        </ActionButtons>
      ),
    },
  ];

  return (
    <Container>
      <Preload visible={loading} />

      <HeaderCard>
        <HeaderInfo>
          <MainTitle>
            <FaCity style={{ color: "#0284c7" }} /> Cidades Ativas no Sistema
          </MainTitle>
          <Subtitle>
            Gerenciamento completo de cidades cadastradas, delimitação geográfica e áreas de atuação
          </Subtitle>
        </HeaderInfo>

        <HeaderActions>
          <Button
            type="primary"
            icon={<FaPlus style={{ marginRight: 6 }} />}
            style={{
              height: 40,
              borderRadius: 6,
              background: "#0284c7",
              border: "none",
              fontWeight: 600,
              boxShadow: "0 2px 6px rgba(2, 132, 199, 0.4)",
            }}
            onClick={() => history.push("/config/areasCity/addCity")}
          >
            Adicionar Cidade
          </Button>

          <Button
            icon={<FaRedo style={{ marginRight: 6 }} />}
            style={{ height: 40, borderRadius: 6 }}
            onClick={getCitiesFully}
            loading={loading}
          >
            Atualizar Lista
          </Button>
        </HeaderActions>
      </HeaderCard>

      <StatsContainer>
        <StatCard color="#0284c7">
          <div className="icon-wrapper">
            <FaCity />
          </div>
          <div className="stat-info">
            <span className="stat-value">{stats.total}</span>
            <span className="stat-label">Cidades Ativas Cadastradas</span>
          </div>
        </StatCard>

        <StatCard color="#10b981">
          <div className="icon-wrapper">
            <FaCheckCircle />
          </div>
          <div className="stat-info">
            <span className="stat-value">{stats.withPolygon}</span>
            <span className="stat-label">Com Área Delimitada</span>
          </div>
        </StatCard>

        <StatCard color="#f59e0b">
          <div className="icon-wrapper">
            <FaExclamationTriangle />
          </div>
          <div className="stat-info">
            <span className="stat-value">{stats.withoutPolygon}</span>
            <span className="stat-label">Sem Área Delimitada</span>
          </div>
        </StatCard>
      </StatsContainer>

      <TableCard>
        <FilterBar>
          <SearchGroup>
            <Input
              placeholder="Buscar cidade por nome ou código..."
              prefix={<FaSearch style={{ color: "#94a3b8", marginRight: 6 }} />}
              value={searchTerm}
              onChange={(e) => setSearchTerm(e.target.value)}
              allowClear
              style={{ maxWidth: 360, height: 40, borderRadius: 6 }}
            />
          </SearchGroup>
        </FilterBar>

        <Table
          dataSource={filteredCities}
          columns={columns}
          rowKey="cityId"
          pagination={{
            pageSize: 10,
            showSizeChanger: true,
            pageSizeOptions: ["10", "20", "50"],
            showTotal: (total) => `Total de ${total} cidades`,
          }}
          locale={{
            emptyText: (
              <Empty
                description="Nenhuma cidade cadastrada encontrada"
                image={Empty.PRESENTED_IMAGE_SIMPLE}
              >
                <Button
                  type="primary"
                  onClick={() => history.push("/config/areasCity/addCity")}
                >
                  Cadastrar Primeira Cidade
                </Button>
              </Empty>
            ),
          }}
        />
      </TableCard>

      {/* Edit City & Polygon Modal */}
      <Modal
        title={
          <div style={{ display: "flex", alignItems: "center", gap: 8, fontSize: 16 }}>
            <FaEdit style={{ color: "#0284c7" }} />
            <span>Editar Cidade: {informationsCity?.nome || "Cidade"}</span>
          </div>
        }
        open={isEditModalOpen}
        onCancel={() => setIsEditModalOpen(false)}
        width={850}
        footer={[
          <Button key="cancel" onClick={() => setIsEditModalOpen(false)} style={{ borderRadius: 6 }}>
            Cancelar
          </Button>,
          <Button
            key="save"
            type="primary"
            onClick={handleUpdateCity}
            loading={loading}
            icon={<FaCheckCircle style={{ marginRight: 6 }} />}
            style={{
              borderRadius: 6,
              background: "#0284c7",
              border: "none",
              fontWeight: 600,
            }}
          >
            Salvar Alterações
          </Button>,
        ]}
      >
        <div style={{ marginBottom: 16 }}>
          <ContentInput>
            <LabelText>Nome da Cidade:</LabelText>
            <Input
              size="large"
              placeholder="Digite o nome da cidade"
              value={nameCity}
              onChange={(event) => setNameCity(event.target.value)}
              style={{ borderRadius: 6 }}
            />
          </ContentInput>
        </div>

        <div style={{ marginBottom: 8, display: "flex", alignItems: "center", gap: 6, color: "#64748b", fontSize: 13 }}>
          <FaDrawPolygon style={{ color: "#0284c7" }} />
          <span>Ajuste ou redesenhe o polígono da área da cidade no mapa interativo:</span>
        </div>

        <ContentMap>
          <div
            ref={mapContainer}
            style={{
              width: "100%",
              height: "420px",
              background: "#e5e3df",
            }}
          />
        </ContentMap>
      </Modal>
    </Container>
  );
};
