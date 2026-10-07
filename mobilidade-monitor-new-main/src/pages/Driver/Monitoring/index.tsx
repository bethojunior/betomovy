import { useEffect, useState } from "react";
import { DriverMap } from "../../../components/Driver/Monitoring";
import api from "../../../services/api";
import { useParams } from "react-router-dom";
import { Card, List, Typography, Spin, Divider } from "antd";
import dayjs from "dayjs";

const { Text } = Typography;

export const DriverMonitoring = () => {
  const [lastPositions, setLastPositions] = useState<any[]>([]);
  const [loading, setLoading] = useState(false);
  const [selectedPos, setSelectedPos] = useState<number | null>(null);
  const { id } = useParams<{ id: string }>();

  const getLastPositions = async () => {
    try {
      setLoading(true);
      const { data } = await api.get(`driver/${id}/lastPositions`);
      const positions = data?.response || [];
      setLastPositions(positions);

      // Seleciona a primeira posição por padrão
      if (positions.length > 0 && selectedPos === null) {
        setSelectedPos(0);
      }
    } catch (error) {
      console.error(error);
      setLastPositions([]);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    getLastPositions();
  }, [id]);

  return (
    <div style={{ display: "flex", height: "100vh", width: "100%" }}>
      {/* MAPA */}
      <div style={{ flex: 3.5, position: "relative" }}>
        <DriverMap
          lastPositions={lastPositions}
          focusPosition={
            selectedPos !== null
              ? {
                  latitude: lastPositions[selectedPos].latitude,
                  longitude: lastPositions[selectedPos].longitude,
                }
              : null
          }
        />
      </div>

      {/* HISTÓRICO */}
      <div
        style={{
          flex: 1.5,
          backgroundColor: "#f7f7f7",
          overflowY: "auto",
          padding: 16,
        }}
      >
        <h3 style={{ margin: "0px 0px 12px 0px", textAlign: "center" }}>
          Últimas posições - Motorista {id}
        </h3>
        <Divider style={{ margin: "4px 0 12px 0" }} />

        {loading ? (
          <div style={{ textAlign: "center", paddingTop: 50 }}>
            <Spin tip="Buscando..." size="large" />
          </div>
        ) : (
          <List
            itemLayout="vertical"
            dataSource={lastPositions}
            locale={{ emptyText: "Sem posições registradas" }}
            renderItem={(pos, index) => (
              <List.Item key={pos._id}>
                <Card
                  size="small"
                  style={{
                    marginBottom: 12,
                    cursor: "pointer",
                    border:
                      selectedPos === index
                        ? "2px solid #1890ff"
                        : "1px solid #f0f0f0",
                  }}
                  onClick={() => setSelectedPos(index)}
                >
                  <Text strong>{`#${index + 1} • ${dayjs(
                    pos.registered_at
                  ).format("DD/MM/YYYY HH:mm")}`}</Text>
                  <div style={{ marginTop: 6 }}>
                    <Text type="secondary">Lat: {pos.latitude}</Text>
                    <br />
                    <Text type="secondary">Lng: {pos.longitude}</Text>
                  </div>
                </Card>
              </List.Item>
            )}
          />
        )}
      </div>
    </div>
  );
};
