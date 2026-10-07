import { useEffect, useState } from 'react';
import { Modal, Button } from 'antd';
import api from "../../../../services/api";
//import Preload from '../../../../components/Utils/Preload';

interface StationData {
  idDriverStation: number;
  driverId: number;
  stationId: number;
  statusId: number;
  idStation: number;
  name: string;
  stationTypeId: number;
  cityId: number | null;
  latitude: string;
  longitude: string;
  address: string;
  official: number;
  created_at: string;
}

interface ReturnsModalProps {
  visibility: boolean;
  handleCloseModal: () => void;
  driverId: number | null;
}

const ReturnsModal = ({
  visibility,
  handleCloseModal,
  driverId,
}: ReturnsModalProps) => {
  const [stationData, setStationData] = useState<StationData[]>([]);
  const [isLoading, setIsLoading] = useState(true);

  useEffect(() => {
    if (visibility && driverId) {
      setIsLoading(true);
      const fetchStationData = async () => {
        try {
          const response = await api.get(`driver/${driverId}/stations`);
          setStationData(Array.isArray(response.data.response) ? response.data.response : []);
        } catch (error) {
          console.error('Erro ao buscar retornos:', error);
          setStationData([]);
        } finally {
          setIsLoading(false);
        }
      };

      fetchStationData();
    } else {
      setIsLoading(true);
      setStationData([]);
    }
  }, [visibility, driverId]);

  return (
    <Modal
      title="Meus Retornos"
      open={visibility}
      onCancel={handleCloseModal}
      footer={[
        <Button key="close" onClick={handleCloseModal}>
          Fechar
        </Button>,
      ]}
    >
      {isLoading ? (
        <p style={{ textAlign: 'center', padding: '1rem' }}>Carregando...</p>
        //<Preload visible={isLoading} />
        
      ) : stationData.length > 0 ? (
        <div>
          {stationData.map((station) => (
            <div key={station.idDriverStation} style={{ marginBottom: 16, paddingBottom: 8, borderBottom: '1px solid #eee' }}>
              <p><strong>Nome do Retorno:</strong> {station.name}</p>
              <p><strong>Endereço:</strong> {station.address}</p>
            </div>
          ))}
        </div>
      ) : (
        <p>Motorista não possui retornos cadastrados.</p>
      )}
    </Modal>
  );
};

export default ReturnsModal;