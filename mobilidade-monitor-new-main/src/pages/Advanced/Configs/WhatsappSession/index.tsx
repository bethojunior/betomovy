import { Button, Form, Input, Modal } from 'antd';
import { useEffect, useState } from 'react';
import apiWhatsapp from '../../../../services/apiWhatsApp';
import { getProjectWhatsAppSessionName } from '../../../../utils/getProjectWhatsAppSessionName';
import { sanitizeWhatsappSessionHtmlForAdmin } from "./sanitize-whatsapp-session-html";
import { WhatsAppSkeleton } from "./skeleton";
import { Container, ContainerIframe, IframeContent } from './styles';

export function WhatsappSession() {

  const [iframeUrl, setIframeUrl] = useState<string | null>(null);
  const [isModalVisible, setIsModalVisible] = useState(false);
  const [loading, setLoading] = useState(false);
  const [form] = Form.useForm();
  const sessionName = getProjectWhatsAppSessionName();


  useEffect(() => {
    const createSession = async () => {
      try {
        const response = await apiWhatsapp.post(
          '/session',
          {
            sessionName: sessionName,
          },
          {
            headers: {
              'Content-Type': 'application/json',
            },
            responseType: 'text',
          }
        );

        const html = sanitizeWhatsappSessionHtmlForAdmin(String(response.data ?? ""));

        const blob = new Blob([html], { type: 'text/html' });
        const url = URL.createObjectURL(blob);
        setIframeUrl(url);
      } catch (error) {
        console.error('Erro ao criar sessão:', error);
      }
    };
    void createSession();
  }, [sessionName]);

  const sendMessage = async (message: string, phoneNumber: string) => {
    try {
      setLoading(true);
      await apiWhatsapp.post(
        '/send-message',
        {
          sessionName,
          message,
          phoneNumber
        },
        {
          headers: {
            'Content-Type': 'application/json',
          },
        }
      );
      
      setIsModalVisible(false);
      form.resetFields();
    } catch (error) {
    } finally {
      setLoading(false);
    }
  };

  const handleSubmit = (values: { message: string; phone: string }) => {
    sendMessage(values.message, values.phone);
  };

  return (
    <Container>
      <ContainerIframe>
        {iframeUrl ? (
          <IframeContent
            src={iframeUrl}
            title="WhatsApp Session"
          />
        ) : (
          <WhatsAppSkeleton />
        )}
        <Button 
            type="primary" 
            onClick={() => setIsModalVisible(true)}
            style={{ marginTop: 16 }}
          >
          Enviar Mensagem de Teste
        </Button>
      </ContainerIframe>
  

      <Modal
        title="Enviar Mensagem de Teste"
        open={isModalVisible}
        onCancel={() => {
          setIsModalVisible(false);
          form.resetFields();
        }}
        footer={null}
        destroyOnClose
      >
        <Form
          form={form}
          onFinish={handleSubmit}
          layout="vertical"
          autoComplete="off"
        >
          <Form.Item
            name="phone"
            label="Número de Telefone"
            rules={[
              {
                required: true,
                message: 'Por favor insira o número de telefone',
              },
              {
                pattern: /^[0-9]+$/,
                message: 'Apenas números são permitidos',
              },
            ]}
          >
            <Input 
              placeholder="Ex: 85999999999" 
              maxLength={15}
            />
          </Form.Item>

          <Form.Item
            name="message"
            label="Mensagem"
            rules={[
              {
                required: true,
                message: 'Por favor insira a mensagem',
              },
            ]}
          >
            <Input.TextArea 
              placeholder="Digite sua mensagem aqui..."
              rows={4}
              maxLength={500}
              showCount
            />
          </Form.Item>

          <Form.Item style={{ marginBottom: 0, textAlign: 'right' }}>
            <Button 
              onClick={() => {
                setIsModalVisible(false);
                form.resetFields();
              }}
              style={{ marginRight: 8 }}
            >
              Cancelar
            </Button>
            <Button 
              type="primary" 
              htmlType="submit"
              loading={loading}
            >
              Enviar
            </Button>
          </Form.Item>
        </Form>
      </Modal>
    </Container>
  );
}
