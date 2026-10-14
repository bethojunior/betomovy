import React, { useState, useEffect } from 'react';
import { Collapse, Radio, Button, Input, Upload, Image } from 'antd';
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
  const [bannerPreview, setBannerPreview] = useState<string>('');
  const [bannerFile, setBannerFile] = useState<File | null>(null);

  const [config, setConfig] = useState<DeliveryConfig>({
    type_of_delivery_area: 'by_area',
    name_establishment_delivery: '',
    customer_register_sms_confirmation_code: '0'
  });

  const loadInitialConfigs = async () => {
    setLoading(true);
    try {
      const [typeRes, nameRes, smsRes, bannerRes] = await Promise.allSettled([
        deliveryConfigService.getTypeOfDeliveryArea(),
        deliveryConfigService.getNameEstablishmentDelivery(),
        deliveryConfigService.getCustomerRegisterSmsConfirmationCode(),
        deliveryConfigService.getBannerDeliverySignUp(),
      ]);

      setConfig((prev) => ({
        ...prev,
        type_of_delivery_area:
          typeRes.status === 'fulfilled' && (typeRes.value?.response || (typeRes.value as any)?.data?.response)
            ? (typeRes.value?.response || (typeRes.value as any)?.data?.response)
            : prev.type_of_delivery_area,
        name_establishment_delivery:
          nameRes.status === 'fulfilled' && (nameRes.value?.response || (nameRes.value as any)?.data?.response)
            ? (nameRes.value?.response || (nameRes.value as any)?.data?.response)
            : prev.name_establishment_delivery,
        customer_register_sms_confirmation_code:
          smsRes.status === 'fulfilled' && (smsRes.value?.response !== undefined || (smsRes.value as any)?.data?.response !== undefined)
            ? String(smsRes.value?.response ?? (smsRes.value as any)?.data?.response) as any
            : prev.customer_register_sms_confirmation_code,
      }));

      if (bannerRes.status === 'fulfilled') {
        const url = bannerRes.value?.response || (bannerRes.value as any)?.data?.response;
        if (url && typeof url === 'string') {
          setBannerPreview(url);
        }
      }
    } catch (err) {
      console.error('Erro ao carregar configurações de delivery:', err);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    loadInitialConfigs();
  }, []);

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

  const handleBannerSave = async () => {
    if (!bannerFile) {
      setMessageAlert('Por favor, selecione uma imagem para o banner');
      setTypeAlert('warning');
      setShowAlert(true);
      return;
    }

    setLoading(true);
    try {
      const response = await deliveryConfigService.uploadBanner(bannerFile);
      if (response?.status) {
        if (response.url) {
          setBannerPreview(response.url);
        }
        setMessageAlert('Banner atualizado com sucesso!');
        setTypeAlert('success');
        setShowAlert(true);
        setBannerFile(null);
      } else {
        throw new Error('Falha no upload');
      }
    } catch (error) {
      setMessageAlert('Erro ao fazer upload do banner');
      setTypeAlert('error');
      setShowAlert(true);
    } finally {
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
        <Collapse ghost defaultActiveKey={["1", "2", "3", "4"]}>
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
                  style={{ width: '220px', borderRadius: 6 }}
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
                style={{ marginBottom: 15, borderRadius: 6 }}
              />
              <div style={{ textAlign: 'left' }}>
                <Button 
                  type="primary" 
                  onClick={handleNameChange}
                  style={{ width: '220px', borderRadius: 6 }}
                >
                  Atualizar
                </Button>
              </div>
            </div>
          </Panel>

          <Panel header="Configuração de banner da tela de cadastro no painel do delivery" key="3">
            <div>
              {bannerPreview && (
                <div style={{ marginBottom: 15 }}>
                  <p style={{ margin: "0 0 6px 0", fontSize: 13, color: "#64748b" }}>Banner Atual:</p>
                  <Image
                    src={bannerPreview}
                    alt="Banner de cadastro"
                    style={{ maxHeight: 150, borderRadius: 8, border: "1px solid #e2e8f0" }}
                  />
                </div>
              )}
              <Upload
                name="imageBannerSignUp"
                beforeUpload={(file) => {
                  setBannerFile(file);
                  const reader = new FileReader();
                  reader.onload = (e) => {
                    setBannerPreview(e.target?.result as string);
                  };
                  reader.readAsDataURL(file);
                  return false;
                }}
                showUploadList={false}
                accept="image/*"
                style={{ marginBottom: 15, display: 'block' }}
              >
                <Button icon={<UploadOutlined />} style={{ borderRadius: 6, marginBottom: 15 }}>
                  {bannerFile ? bannerFile.name : 'Selecionar Novo Banner'}
                </Button>
              </Upload>
              <div style={{ textAlign: 'left' }}>
                <Button 
                  type="primary" 
                  onClick={handleBannerSave}
                  disabled={!bannerFile}
                  style={{ width: '220px', borderRadius: 6 }}
                >
                  Atualizar Banner
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
                  style={{ width: '220px', borderRadius: 6 }}
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