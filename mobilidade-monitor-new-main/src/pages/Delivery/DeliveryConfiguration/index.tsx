import React, { useState, useEffect } from 'react';
import { Button, Input, Upload, Row, Col, Image } from 'antd';
import { UploadOutlined } from '@ant-design/icons';
import { Content } from './styles';
import { deliveryConfigurationService } from '../../../services/deliveryConfiguration';
import { DeliveryConfigData } from './types';
import Preload from '../../../components/Utils/Preload';
import Alert from '../../../components/Utils/Alert';

const { TextArea } = Input;

const DeliveryConfiguration: React.FC = () => {
  const [loading, setLoading] = useState(false);
  const [showAlert, setShowAlert] = useState(false);
  const [messageAlert, setMessageAlert] = useState('');
  const [typeAlert, setTypeAlert] = useState<'success' | 'info' | 'warning' | 'error'>('success');
  const [config, setConfig] = useState<DeliveryConfigData>({
    linkAndroid: '',
    linkIos: '',
    cities: '',
    image: ''
  });
  const [imageFile, setImageFile] = useState<File | null>(null);

  useEffect(() => {
    loadConfigs();
  }, []);

  const loadConfigs = async () => {
    setLoading(true);
    try {
      const response = await deliveryConfigurationService.getConfigs();
      if (response.status && response.response.length > 0) {
        const data = response.response[0];
        setConfig({
          linkAndroid: data.linkAndroid || '',
          linkIos: data.linkIos || '',
          cities: data.cities || '',
          image: data.image || ''
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

  const handleSave = async () => {
    if (!config.linkAndroid || !config.linkIos || !config.cities) {
      setMessageAlert('Preencha todos os campos obrigatórios');
      setTypeAlert('warning');
      setShowAlert(true);
      return;
    }

    setLoading(true);
    try {
      let imageBase64 = '';
      
      if (imageFile) {
        imageBase64 = await convertToBase64(imageFile);
      }

      const data = {
        linkAndroid: config.linkAndroid,
        linkIos: config.linkIos,
        cities: config.cities,
        image: imageBase64
      };

      const response = await deliveryConfigurationService.editConfigs(data);
      if (response.status) {
        setMessageAlert('Informações enviadas com sucesso');
        setTypeAlert('success');
        setShowAlert(true);
      }
    } catch (error) {
      setMessageAlert('Erro ao salvar configurações');
      setTypeAlert('error');
      setShowAlert(true);
    } finally {
      setLoading(false);
    }
  };

  const convertToBase64 = (file: File): Promise<string> => {
    return new Promise((resolve, reject) => {
      const reader = new FileReader();
      reader.readAsDataURL(file);
      reader.onload = () => resolve(reader.result as string);
      reader.onerror = error => reject(error);
    });
  };

  const handleImageChange = (info: any) => {
    if (info.file.status !== 'uploading') {
      setImageFile(info.file.originFileObj);
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
        <Row gutter={24}>
          <Col span={12}>
            <div style={{ marginBottom: 16 }}>
              <label style={{ display: 'block', marginBottom: 8 }}>Link Android</label>
              <Input
                value={config.linkAndroid}
                onChange={(e) => setConfig(prev => ({ ...prev, linkAndroid: e.target.value }))}
                placeholder="Link da Play Store"
              />
            </div>

            <div style={{ marginBottom: 16 }}>
              <label style={{ display: 'block', marginBottom: 8 }}>Link IOS</label>
              <Input
                value={config.linkIos}
                onChange={(e) => setConfig(prev => ({ ...prev, linkIos: e.target.value }))}
                placeholder="Link da App Store"
              />
            </div>

            <div style={{ marginBottom: 16 }}>
              <label style={{ display: 'block', marginBottom: 8 }}>
                Adicione as cidades separando-as por vírgula
              </label>
              <TextArea
                rows={4}
                value={config.cities}
                onChange={(e) => setConfig(prev => ({ ...prev, cities: e.target.value }))}
                placeholder="Fortaleza, Teresina, São Paulo..."
              />
            </div>

            <div style={{ marginBottom: 16 }}>
              <label style={{ display: 'block', marginBottom: 8 }}>
                Imagem (600x600px)
              </label>
              <Upload
                beforeUpload={() => false}
                onChange={handleImageChange}
                accept="image/*"
                maxCount={1}
              >
                <Button icon={<UploadOutlined />}>Selecionar Imagem</Button>
              </Upload>
            </div>

            <Button 
              type="primary" 
              onClick={handleSave}
              style={{ width: '100%' }}
            >
              Salvar
            </Button>
          </Col>

          <Col span={12}>
            <div style={{ display: 'flex', justifyContent: 'center', marginTop: 16 }}>
              <Image
                src={config.image || '/images/delivery-exemple.jpg'}
                alt="Preview da imagem"
                style={{ 
                  borderRadius: 8, 
                  maxWidth: '100%', 
                  height: 'auto',
                  width: '100%'
                }}
                fallback="/images/delivery-exemple.jpg"
              />
            </div>
          </Col>
        </Row>
      </Content>
    </div>
  );
};

export default DeliveryConfiguration;