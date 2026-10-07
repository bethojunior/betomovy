import React, { useState, useEffect } from 'react';
import { Collapse, Input, Button } from 'antd';
import { Content } from './styles';
import api from '../../../services/api';
import Preload from '../../../components/Utils/Preload';
import Alert from '../../../components/Utils/Alert';

const { Panel } = Collapse;

interface AsaasConfig {
  asaas_token: string;
}

const AsaasConfiguration: React.FC = () => {
  const [loading, setLoading] = useState(false);
  const [showAlert, setShowAlert] = useState(false);
  const [messageAlert, setMessageAlert] = useState('');
  const [typeAlert, setTypeAlert] = useState<'success' | 'info' | 'warning' | 'error'>('success');
  const [config, setConfig] = useState<AsaasConfig>({
    asaas_token: ''
  });

  useEffect(() => {
    loadConfig();
  }, []);

  const loadConfig = async () => {
    setLoading(true);
    try {
      const response = await api.get('deliveryAcquirer/token');
      if (response.data.status) {
        setConfig({
          asaas_token: response.data.response || ''
        });
      }
    } catch (error) {
      setMessageAlert('Erro ao carregar configurações');
      setTypeAlert('error');
      setShowAlert(true);
    } finally {
      setLoading(false);
    }
  };

  const updateConfig = async (data: Partial<AsaasConfig>) => {
    setLoading(true);
    try {
      await api.put('deliveryAcquirer/token', { value: data.asaas_token });
      setMessageAlert('Configuração atualizada com sucesso!');
      setTypeAlert('success');
      setShowAlert(true);
      setConfig(prev => ({ ...prev, ...data }));
    } catch (error) {
      setMessageAlert('Erro ao atualizar configuração');
      setTypeAlert('error');
      setShowAlert(true);
    } finally {
      setLoading(false);
    }
  };

  const handleTokenSave = () => {
    updateConfig({ asaas_token: config.asaas_token });
  };

  return (
    <div>
      <Preload visible={loading} />
      <Alert
        visibility={showAlert}
        message={messageAlert}
        typeAlert={typeAlert}
        setVisibility={setShowAlert}
      />
      <Content>
        <Collapse ghost>
          <Panel header="Token ASAAS" key="1">
            <div>
              <label>Chave</label>
              <Input
                value={config.asaas_token}
                onChange={(e) => setConfig(prev => ({ ...prev, asaas_token: e.target.value }))}
                placeholder="Token de acesso da API ASAAS"
                style={{ marginBottom: 0 }}
              />
              <div className="button-container">
                <Button 
                  type="primary" 
                  onClick={handleTokenSave}
                >
                  Alterar
                </Button>
              </div>
            </div>
          </Panel>
        </Collapse>
      </Content>
    </div>
  );
};

export default AsaasConfiguration;