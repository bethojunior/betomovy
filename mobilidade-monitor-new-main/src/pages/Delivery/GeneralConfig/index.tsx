import React, { useState } from 'react';
import { Collapse, Radio, Button, Input, Upload } from 'antd';
import { UploadOutlined } from '@ant-design/icons';
import { Content } from './styles';
import { deliveryConfigService } from '../../../services/deliveryConfig';
import Preload from '../../../components/Utils/Preload';
import Alert from '../../../components/Utils/Alert';

const { Panel } = Collapse;

interface DeliveryConfig {
  type_of_delivery_area: 'by_area' | 'by_neighborhood';
  name_establishment_delivery: string;
  customer_register_sms_confirmation_code: '0' | '1';
}

const GeneralConfig: React.FC = () => {
  const [loading, setLoading] = useState(false);
  const [showAlert, setShowAlert] = useState(false);
  const [messageAlert, setMessageAlert] = useState('');
  const [typeAlert, setTypeAlert] = useState<'success' | 'info' | 'warning' | 'error'>('success');
  const [config, setConfig] = useState<DeliveryConfig>({
    type_of_delivery_area: '' as any,
    name_establishment_delivery: '',
    customer_register_sms_confirmation_code: '' as any
  });

  const updateConfig = async (data: Partial<DeliveryConfig>) => {
    setLoading(true);
    try {
      await deliveryConfigService.updateConfig(data);
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

  const handleTypeChange = (value: 'by_area' | 'by_neighborhood') => {
    updateConfig({ type_of_delivery_area: value });
  };

  const handleNameChange = () => {
    updateConfig({ name_establishment_delivery: config.name_establishment_delivery });
  };

  const handleCodeChange = (value: '0' | '1') => {
    updateConfig({ customer_register_sms_confirmation_code: value });
  };

  const handleBannerUpload = async (info: any) => {
    if (info.file.status === 'uploading') {
      setLoading(true);
      return;
    }
    
    if (info.file.status === 'done') {
      try {
        await deliveryConfigService.uploadBanner(info.file.originFileObj);
        setMessageAlert('Banner atualizado com sucesso!');
        setTypeAlert('success');
        setShowAlert(true);
      } catch (error) {
        setMessageAlert('Erro ao fazer upload do banner');
        setTypeAlert('error');
        setShowAlert(true);
      } finally {
        setLoading(false);
      }
    } else if (info.file.status === 'error') {
      setMessageAlert('Erro ao fazer upload do banner');
      setTypeAlert('error');
      setShowAlert(true);
      setLoading(false);
    }
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
          <Panel header="Configurações do tipo de chamado" key="1">
            <div>
              <Radio.Group
                value={config.type_of_delivery_area}
                onChange={(e) => setConfig(prev => ({ ...prev, type_of_delivery_area: e.target.value }))}
                style={{
                  width: '100%',
                  display: 'flex',
                  justifyContent: 'space-around',
                  marginBottom: 15
                }}
              >
                <Radio value="by_area">Por área</Radio>
                <Radio value="by_neighborhood">Por bairro</Radio>
              </Radio.Group>
              <div style={{ textAlign: 'left' }}>
                <Button 
                  type="primary" 
                  onClick={() => handleTypeChange(config.type_of_delivery_area)}
                  style={{ width: '220px' }}
                >
                  Salvar
                </Button>
              </div>
            </div>
          </Panel>

          <Panel header="Configuração de nome do painel do estabelecimento" key="2">
            <div>
              <Input
                value={config.name_establishment_delivery}
                onChange={(e) => setConfig(prev => ({ ...prev, name_establishment_delivery: e.target.value }))}
                placeholder="Nome do estabelecimento"
                style={{ marginBottom: 15 }}
              />
              <div style={{ textAlign: 'left' }}>
                <Button 
                  type="primary" 
                  onClick={handleNameChange}
                  style={{ width: '220px' }}
                >
                  Atualizar
                </Button>
              </div>
            </div>
          </Panel>

          <Panel header="Configuração de banner da tela de cadastro no painel do delivery" key="3">
            <div>
              <Upload
                name="imageBannerSignUp"
                action="/api/upload/banner"
                onChange={handleBannerUpload}
                accept="image/*"
                style={{ marginBottom: 15, display: 'block' }}
              >
                <Button icon={<UploadOutlined />}>Selecionar Banner</Button>
              </Upload>
              <div style={{ textAlign: 'left' }}>
                <Button 
                  type="primary" 
                  style={{ width: '220px' }}
                >
                  Atualizar
                </Button>
              </div>
            </div>
          </Panel>

          <Panel header="Ativar código de confirmação de SMS no cadastro do cliente" key="4">
            <div>
              <Radio.Group
                value={config.customer_register_sms_confirmation_code}
                onChange={(e) => setConfig(prev => ({ ...prev, customer_register_sms_confirmation_code: e.target.value }))}
                style={{
                  width: '100%',
                  display: 'flex',
                  justifyContent: 'space-around',
                  marginBottom: 15
                }}
              >
                <Radio value="1">Sim</Radio>
                <Radio value="0">Não</Radio>
              </Radio.Group>
              <div style={{ textAlign: 'left' }}>
                <Button 
                  type="primary" 
                  onClick={() => handleCodeChange(config.customer_register_sms_confirmation_code)}
                  style={{ width: '220px' }}
                >
                  Salvar
                </Button>
              </div>
            </div>
          </Panel>
        </Collapse>
      </Content>
    </div>
  );
};

export default GeneralConfig;