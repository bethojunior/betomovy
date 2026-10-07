import React, { useState, useEffect, useCallback } from 'react';
import api from '../../../../services/api';
import Preload from '../../../../components/Utils/Preload';
import { Container, Content, Card, CardHeader, CardBody, Button, Title, LoadingSpinner } from './styles';
import Alert from '../../../../components/Utils/Alert';
import { AiOutlineCheck } from 'react-icons/ai';
import swal from 'sweetalert';

const FirebaseVerification: React.FC = () => {
  const [loading, setLoading] = useState<boolean>(false);
  const [messageAlert, setMessageAlert] = useState<string>('');
  const [typeMessageAlert, setTypeMessageAlert] = useState<'success' | 'info' | 'warning' | 'error'>('success');
  const [showAlert, setShowAlert] = useState<boolean>(false);
  const [isRealtimeActive, setIsRealtimeActive] = useState<boolean>(false);
  const [isRestarted] = useState<boolean>(false);
  const [firebaseVersion, setFirebaseVersion] = useState<string>('');
  const [loadingVersion, setLoadingVersion] = useState<boolean>(true);
  const [loadingRealtime, setLoadingRealtime] = useState<boolean>(true);

  const handleMessageAlert = (message: string, type: 'success' | 'info' | 'warning' | 'error') => {
    setShowAlert(true);
    setMessageAlert(message);
    setTypeMessageAlert(type);
  };

  const fetchFirebaseVersion = useCallback(async () => {
    setLoadingVersion(true);
    try {
      const response = await api.get('/databaseVersion');
      if (response.data.status) {
        setFirebaseVersion(response.data.response.version);
      } else {
        handleMessageAlert('Erro ao buscar a versão do Firebase.', 'error');
      }
    } catch (error) {
      handleMessageAlert('Erro ao buscar a versão do Firebase.', 'error');
    } finally {
      setLoadingVersion(false);
    }
  }, []);

  const fetchRealtimeStatus = useCallback(async () => {
    setLoadingRealtime(true);
    try {
      const response = await api.get('/config/realtimeDatabase');
      if (response.data.status) {
        setIsRealtimeActive(response.data.response.status);
      } else {
        handleMessageAlert('Erro ao buscar o status da sincronização em tempo real.', 'error');
      }
    } catch (error) {
      handleMessageAlert('Erro ao buscar o status da sincronização em tempo real.', 'error');
    } finally {
      setLoadingRealtime(false);
    }
  }, []);

  useEffect(() => {
    fetchFirebaseVersion();
    fetchRealtimeStatus();
  }, [fetchFirebaseVersion, fetchRealtimeStatus]);

  const handleRealtimeClick = async () => {
    swal({
      title: "Deseja mudar o modo de sincronização de dados?",
      icon: "warning",
      buttons: ["Não", "Sim"],
      dangerMode: true,
    }).then(async (willChange) => {
      if (willChange) {
        setLoading(true);
        try {
          const newStatus = !isRealtimeActive;
          await api.put('/config/updateRealtimeDatabase', { status: newStatus });
          setIsRealtimeActive(newStatus);
          handleMessageAlert('Sincronização em tempo real atualizada com sucesso!', 'success');
        } catch (error) {
          handleMessageAlert('Erro ao atualizar a sincronização em tempo real.', 'error');
        } finally {
          setLoading(false);
        }
      }
    });
  };

  const handleRestartServerClick = () => {
    handleMessageAlert('Essa funcionalidade não está implementada.', 'info');
  };

  return (
    <Container>
      <Preload visible={loading || loadingVersion || loadingRealtime} />
      <Alert
        message={messageAlert}
        typeAlert={typeMessageAlert}
        visibility={showAlert}
        setVisibility={setShowAlert}
      />
      <Content>
        <Title>
          Configurações Gerais #
          {loadingVersion ? <LoadingSpinner /> : firebaseVersion}
        </Title>
        <Card>
          <CardHeader>Configurações do app</CardHeader>
          <CardBody>
            <p>Modo de sincronização de dados da viagem pelo firebase</p>
            <Button onClick={handleRealtimeClick} bgColor={isRealtimeActive ? "green" : "gray"}>
              {isRealtimeActive && <AiOutlineCheck style={{ marginRight: 8 }} />}
              Realtime
            </Button>
          </CardBody>
        </Card>
        <Card>
          <CardHeader>Servidor</CardHeader>
          <CardBody>
            <p>Reiniciar serviços de aplicação</p>
            <Button onClick={handleRestartServerClick} bgColor={isRestarted ? "gray" : "orange"}>
              {isRestarted && <AiOutlineCheck style={{ marginRight: 8 }} />}
              Reiniciar
            </Button>
          </CardBody>
        </Card>
      </Content>
    </Container>
  );
};

export default FirebaseVerification;
