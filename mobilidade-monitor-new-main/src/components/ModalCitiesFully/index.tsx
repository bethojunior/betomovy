import { Button, Modal, Select, Spin } from "antd";
import swal from "sweetalert";

import { useEffect, useState, useRef } from "react";

import { Container } from "./styles";
import api from "../../services/api";
import Session from "../../utils/Session";
import Utils from "../../utils/Utils";

export const ModalCitiesFully = () => {
  const [cities, setCities] = useState<DefaultOptionsProps[]>([]);
  const [rawCitiesList, setRawCitiesList] = useState<CityProps[]>([]);
  const [loading, setLoading] = useState<boolean>(false);
  const [loadingLocation, setLoadingLocation] = useState<boolean>(false);
  const [locationStatus, setLocationStatus] = useState<string>("");
  const [citySelected, setCitySelected] = useState<CityProps | null>(null);
  const autoSelectedRef = useRef<boolean>(false);

  const { getPathByPolygon, newGetCircleCoordinates } = Utils;

  const buildPolygonStringFromCoords = (lat: number, lng: number): string => {
    try {
      const coords = newGetCircleCoordinates([lng, lat], 12000, 64);
      if (Array.isArray(coords) && coords.length > 0) {
        const pairs = coords.map((c: [number, number]) => `${c[1]} ${c[0]}`).join(", ");
        return `POLYGON((${pairs}))`;
      }
    } catch (e) {
      console.warn("Erro ao gerar círculo para coordenadas:", e);
    }
    const d = 0.08;
    return `POLYGON((${lat - d} ${lng - d}, ${lat + d} ${lng - d}, ${lat + d} ${lng + d}, ${lat - d} ${lng + d}, ${lat - d} ${lng - d}))`;
  };

  const geocodeCity = async (cityName: string): Promise<{ lat: number; lng: number } | null> => {
    try {
      const cleanName = cityName.replace(/[-/].*$/, "").trim();
      const res = await fetch(
        `https://nominatim.openstreetmap.org/search?format=json&limit=1&q=${encodeURIComponent(cleanName + ", Brasil")}`,
        { headers: { Accept: "application/json" } }
      );
      if (res.ok) {
        const data = await res.json();
        if (Array.isArray(data) && data.length > 0) {
          const lat = parseFloat(data[0].lat);
          const lng = parseFloat(data[0].lon);
          if (!isNaN(lat) && !isNaN(lng)) {
            return { lat, lng };
          }
        }
      }
    } catch (e) {
      console.warn("Geocoding fallback failed for:", cityName, e);
    }
    return null;
  };

  const resolveCityLocation = async (city: CityProps): Promise<{ resolvedCity: CityProps; pointsCity: any[] }> => {
    let resolvedCity = { ...city };
    let pointsCity: any[] = [];

    if (resolvedCity.polygon && typeof resolvedCity.polygon === "string" && resolvedCity.polygon.trim().length > 10) {
      try {
        pointsCity = getPathByPolygon(resolvedCity.polygon);
      } catch (e) {
        console.warn("Erro ao processar polygon:", e);
      }
    }

    if (!pointsCity || pointsCity.length === 0) {
      const coords = await geocodeCity(resolvedCity.nome);
      const lat = coords?.lat ?? -3.7319;
      const lng = coords?.lng ?? -38.5267;
      const polyString = buildPolygonStringFromCoords(lat, lng);
      resolvedCity.polygon = polyString;
      try {
        pointsCity = getPathByPolygon(polyString);
      } catch {
        pointsCity = [{ lat, lng }];
      }
    }

    return { resolvedCity, pointsCity };
  };

  const handleApplyCity = async (cityToApply: CityProps) => {
    setLoadingLocation(true);
    setLocationStatus("Puxando localização automaticamente...");
    try {
      const { resolvedCity, pointsCity } = await resolveCityLocation(cityToApply);
      Session.setLocal("citySelected", JSON.stringify(resolvedCity));
      Session.setLocal("pointsCity", JSON.stringify(pointsCity));
      setLocationStatus(`Localização definida para ${resolvedCity.nome}`);
      setTimeout(() => {
        window.location.reload();
      }, 300);
    } catch (e) {
      Session.setLocal("citySelected", JSON.stringify(cityToApply));
      window.location.reload();
    } finally {
      setLoadingLocation(false);
    }
  };

  const handleSelectCity = () => {
    if (!citySelected) return;
    handleApplyCity(citySelected);
  };

  const handleCityChange = async (cityRaw: any) => {
    let parsed: CityProps | null = null;
    try {
      parsed = typeof cityRaw === "string" ? JSON.parse(cityRaw) : cityRaw;
    } catch {
      parsed = cityRaw;
    }
    if (!parsed) return;
    setCitySelected(parsed);
    await handleApplyCity(parsed);
  };

  const getCitiesFully = async () => {
    try {
      setLoading(true);
      const responseCitiesFully = await api.get("city/actives/fully");

      if (responseCitiesFully) {
        const rawList = responseCitiesFully?.data?.response ?? responseCitiesFully?.data?.data ?? [];
        const list = Array.isArray(rawList) ? rawList : [];
        setRawCitiesList(list);

        const citiesFormated = list.map((value: CityProps) => ({
          value: JSON.stringify(value),
          label: value.nome,
        }));
        setCities(citiesFormated);

        if (!autoSelectedRef.current && navigator.geolocation) {
          navigator.geolocation.getCurrentPosition(
            (pos) => {
              if (autoSelectedRef.current) return;
              const uLat = pos.coords.latitude;
              const uLng = pos.coords.longitude;
              let closestCity: CityProps | null = null;
              let minDistance = Infinity;

              for (const c of list) {
                if (c.polygon) {
                  const pts = getPathByPolygon(c.polygon);
                  if (pts && pts.length > 0) {
                    const cLat = pts[0].lat;
                    const cLng = pts[0].lng;
                    const dist = Math.hypot(cLat - uLat, cLng - uLng);
                    if (dist < minDistance) {
                      minDistance = dist;
                      closestCity = c;
                    }
                  }
                }
              }

              if (closestCity && minDistance < 1.0) {
                autoSelectedRef.current = true;
                setCitySelected(closestCity);
                handleApplyCity(closestCity);
              }
            },
            () => {},
            { timeout: 4000 }
          );
        }
      }
    } catch (error) {
      swal({
        title: "Error",
        text: "Ocorreu um erro ao obter dados das cidades ativas",
        icon: "error",
      });
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    getCitiesFully();
  }, []);

  return (
    <Modal
      title="Alerta"
      open={true}
      closable={false}
      footer={[
        <Button
          key={1}
          type="primary"
          onClick={handleSelectCity}
          disabled={!citySelected || loadingLocation}
          loading={loadingLocation}
        >
          Confirmar
        </Button>,
      ]}
    >
      <Container>
        <p>
          Você ainda não escolheu sua localização. Por favor, selecione uma
          cidade para receber informações do seu aplicativo em relação a cidade
          escolhida.
        </p>

        <Select
          style={{ width: "100%" }}
          placeholder="Escolha a cidade"
          onChange={handleCityChange}
          options={cities}
          loading={loading}
          disabled={loadingLocation}
        />

        {loadingLocation && (
          <div style={{ marginTop: 12, textAlign: "center", color: "#1890ff" }}>
            <Spin size="small" />{" "}
            <span style={{ marginLeft: 8, fontSize: 13 }}>
              {locationStatus || "Puxando localização automaticamente..."}
            </span>
          </div>
        )}
      </Container>
    </Modal>
  );
};
