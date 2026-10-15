import React, { useState, useEffect } from 'react';
import { Table, Button, Modal, Form, Input, Radio, message } from 'antd';
import { DeleteOutlined } from '@ant-design/icons';
import api from '../../../../../services/api';
import Session from '../../../../../utils/Session';

interface DeliveryRate {
  id: string;
  range: number;
  tax: number;
  time: number;
  deliveryServiceFee: number;
  deliveryServiceFeeType: '$' | '%';
}

export const DeliveryRates: React.FC = () => {
  const [rates, setRates] = useState<DeliveryRate[]>([]);
  const [loading, setLoading] = useState(false);
  const [modalVisible, setModalVisible] = useState(false);
  const [form] = Form.useForm();

  const cityId = Session.getLocal('citySelected')?.cityId;

  useEffect(() => {
    loadRates();
  }, []);

  const loadRates = async () => {
    setLoading(true);
    try {
      const response = await api.get('deliveryRate');
      if (response?.data?.status) {
        setRates(Array.isArray(response.data.response) ? response.data.response : []);
      }
    } catch (error) {
      message.error('Erro ao carregar taxas');
    } finally {
      setLoading(false);
    }
  };

  const handleDelete = async (id: string) => {
    try {
      await api.delete(`deliveryRate/${id}`);
      message.success('Taxa removida com sucesso');
      loadRates();
    } catch (error) {
      message.error('Erro ao remover taxa');
    }
  };

  const handleSubmit = async (values: any) => {
    try {
      const data = {
        range: values.range,
        tax: parseFloat(String(values.tax ?? '0').replace(',', '.')),
        time: values.time,
        cityId,
        deliveryServiceFee: parseFloat(String(values.deliveryServiceFee ?? '0').replace(',', '.')),
        deliveryServiceFeeType: values.deliveryServiceFeeType
      };

      await api.post('deliveryRate', data);
      message.success('Taxa adicionada com sucesso');
      setModalVisible(false);
      form.resetFields();
      loadRates();
    } catch (error) {
      message.error('Erro ao adicionar taxa');
    }
  };

  const formatMoney = (value: number) => {
    return Number(value ?? 0).toFixed(2).replace('.', ',');
  };

  const getTypeLabel = (type: string) => {
    return type === '$' ? 'Valor' : 'Percentagem';
  };

  const columns = [
    {
      title: 'Alcance',
      dataIndex: 'range',
      key: 'range',
      render: (range: number) => `ATÉ ${range} KM`,
    },
    {
      title: 'Taxa cliente',
      dataIndex: 'tax',
      key: 'tax',
      render: (tax: number) => `R$ ${formatMoney(tax)}`,
    },
    {
      title: 'Tempo',
      dataIndex: 'time',
      key: 'time',
      render: (time: number) => `${time} minutos`,
    },
    {
      title: 'Taxa de retida entregador',
      dataIndex: 'deliveryServiceFee',
      key: 'deliveryServiceFee',
      render: (fee: number) => formatMoney(fee),
    },
    {
      title: 'Tipo de taxa retida',
      dataIndex: 'deliveryServiceFeeType',
      key: 'deliveryServiceFeeType',
      render: (type: string) => getTypeLabel(type),
    },
    {
      title: '',
      key: 'actions',
      render: (record: DeliveryRate) => (
        <Button
          type="primary"
          danger
          size="small"
          icon={<DeleteOutlined />}
          onClick={() => handleDelete(record.id)}
        >
          Excluir
        </Button>
      ),
    },
  ];

  return (
    <div>
      <div style={{ marginBottom: 16, textAlign: 'right' }}>
        <Button type="primary" onClick={() => setModalVisible(true)}>
          Adicionar
        </Button>
      </div>

      <Table
        columns={columns}
        dataSource={rates}
        loading={loading}
        rowKey="id"
        pagination={false}
      />

      <Modal
        title="Adicionar novo alcance"
        open={modalVisible}
        onCancel={() => {
          setModalVisible(false);
          form.resetFields();
        }}
        footer={null}
      >
        <Form form={form} onFinish={handleSubmit} layout="vertical">
          <div style={{ display: 'flex', gap: 16 }}>
            <Form.Item
              name="range"
              label="Alcance(km)"
              rules={[{ required: true, message: 'Campo obrigatório' }]}
              style={{ flex: 1 }}
            >
              <Input type="number" />
            </Form.Item>
            <Form.Item
              name="tax"
              label="Taxa"
              rules={[{ required: true, message: 'Campo obrigatório' }]}
              style={{ flex: 1 }}
            >
              <Input />
            </Form.Item>
            <Form.Item
              name="time"
              label="Tempo(minutos)"
              rules={[{ required: true, message: 'Campo obrigatório' }]}
              style={{ flex: 1 }}
            >
              <Input type="number" />
            </Form.Item>
          </div>

          <div style={{ display: 'flex', gap: 16, alignItems: 'end' }}>
            <Form.Item
              name="deliveryServiceFee"
              label="Taxa de serviço do entregador"
              rules={[{ required: true, message: 'Campo obrigatório' }]}
              style={{ flex: 1 }}
            >
              <Input />
            </Form.Item>
            <Form.Item
              name="deliveryServiceFeeType"
              initialValue="$"
              style={{ flex: 1 }}
            >
              <Radio.Group>
                <Radio value="$">R$</Radio>
                <Radio value="%">%</Radio>
              </Radio.Group>
            </Form.Item>
          </div>

          <div style={{ textAlign: 'right', marginTop: 16 }}>
            <Button onClick={() => setModalVisible(false)} style={{ marginRight: 8 }}>
              Cancelar
            </Button>
            <Button type="primary" htmlType="submit">
              Salvar
            </Button>
          </div>
        </Form>
      </Modal>
    </div>
  );
};