import React, { useState, useEffect } from 'react';
import { Collapse, Input, Button, Tag, Typography } from 'antd';
import { Content } from './styles';
import api from '../../../services/api';
import Preload from '../../../components/Utils/Preload';
import Alert from '../../../components/Utils/Alert';

const { Panel } = Collapse;
const { Text } = Typography;

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
      const token = response.data?.response ?? response.data?.data ?? response.data?.result ?? '';
      const tokenVal = typeof token === 'string' ? token : (token?.value || '');
      setConfig({
        asaas_token: tokenVal
      });
    } catch (error) {
      console.error('Erro ao carregar token ASAAS:', error);
      setMessageAlert('Erro ao carregar configurações do ASAAS');
      setTypeAlert('error');
      setShowAlert(true);
    } finally {
      setLoading(false);
    }
  };

  const updateConfig = async (data: Partial<AsaasConfig>) => {
    setLoading(true);
    try {
      const tokenToSend = data.asaas_token ?? config.asaas_token;
      await api.put('deliveryAcquirer/token', { 
        value: tokenToSend,
        asaas_token: tokenToSend 
      });
      setMessageAlert('Configuração do ASAAS atualizada com sucesso!');
      setTypeAlert('success');
      setShowAlert(true);
      setConfig(prev => ({ ...prev, ...data }));
    } catch (error) {
      console.error('Erro ao atualizar token ASAAS:', error);
      setMessageAlert('Erro ao atualizar configuração do ASAAS');
      setTypeAlert('error');
      setShowAlert(true);
    } finally {
      setLoading(false);
    }
  };

  const handleTokenSave = () => {
    updateConfig({ asaas_token: config.asaas_token.trim() });
  };

  const isConfigured = Boolean(config.asaas_token && config.asaas_token.trim().length > 0);

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
        <Collapse defaultActiveKey={['1']} ghost>
          <Panel 
            header={
              <div style={{ display: 'flex', alignItems: 'center', gap: '12px' }}>
                <span style={{ fontWeight: 600, fontSize: '15px' }}>Token ASAAS</span>
                {isConfigured ? (
                  <Tag color="success">Configurado</Tag>
                ) : (
                  <Tag color="warning">Não Configurado</Tag>
                )}
              </div>
            } 
            key="1"
          >
            <div>
              <div style={{ marginBottom: '8px', display: 'flex', justifyContent: 'space-between', alignItems: 'center' }}>
                <label style={{ fontWeight: 500, color: '#374151' }}>Chave da API</label>
                {isConfigured && (
                  <Text type="secondary" style={{ fontSize: '12px' }}>
                    Tamanho do token: {config.asaas_token.length} caracteres
                  </Text>
                )}
              </div>
              <Input.Password
                value={config.asaas_token}
                onChange={(e) => setConfig(prev => ({ ...prev, asaas_token: e.target.value }))}
                placeholder="Token de acesso da API ASAAS ($aact_...)"
                style={{ marginBottom: '8px' }}
                allowClear
              />
              <div style={{ marginBottom: '16px' }}>
                <Text type="secondary" style={{ fontSize: '12px', display: 'block', color: '#6b7280' }}>
                  Insira o Token de Produção gerado na sua conta ASAAS (Menu Integrações &gt; Chaves de API).
                </Text>
              </div>
              <div className="button-container">
                <Button 
                  type="primary" 
                  onClick={handleTokenSave}
                  loading={loading}
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