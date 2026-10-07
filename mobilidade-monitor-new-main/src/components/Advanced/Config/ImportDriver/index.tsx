import { FC, useEffect, useState } from 'react';
import { Button, Modal, Table, Upload, Select, message } from 'antd';
import { UploadOutlined } from '@ant-design/icons';
import type { UploadFile } from 'antd/es/upload/interface';
import * as XLSX from 'xlsx';
import api from '../../../../services/api';
import swal from 'sweetalert';
import Preload from '../../../Utils/Preload';
import { ColumnsType } from 'antd/es/table';
import { DriverData, UserType } from './types';
import { Container, ContentContainer, ModalBody, TableContainer } from './styles';
import Session from '../../../../utils/Session';

const ImportDriver: FC = () => {
  const [isModalVisible, setIsModalVisible] = useState(false);
  const [fileList, setFileList] = useState<UploadFile[]>([]);
  const [selectedFile, setSelectedFile] = useState<File | null>(null);
  const [previewData, setPreviewData] = useState<DriverData[]>([]);
  const [exampleData, setExampleData] = useState<DriverData[]>([]);
  const [userTypes, setUserTypes] = useState<UserType[]>([]);
  const [selectedUserType, setSelectedUserType] = useState<number | null>(null);
  const [loading, setLoading] = useState(false);

  useEffect(() => {
    const fetchExampleData = async () => {
      setLoading(true);
      try {
        const response = await api.get('/import/driver/example', {
          responseType: 'arraybuffer'
        });
        const data = new Uint8Array(response.data);
        const workbook = XLSX.read(data, { type: 'array' });
        const sheetName = workbook.SheetNames[0];
        const sheet = workbook.Sheets[sheetName];
        const jsonData: DriverData[] = XLSX.utils.sheet_to_json(sheet).map((row: any, index: number) => ({
          index: index + 1,
          name: row['nome'],
          cpf: row['cpf'],
          email: row['email'],
          telefone: row['telefone'],
          numeroDocVeiculo: row['numeroDocVeiculo'],
          marcaVeiculo: row['marcaVeiculo'],
          modeloVeiculo: row['modeloVeiculo'],
          placa: row['placa'],
          numeroRenavam: row['numeroRenavam'],
          corVeiculo: row['corVeiculo'],
          numeroAssentos: row['numeroAssentos'],
          anoFabricacao: row['anoFabricacao'],
          numeroCNH: row['numeroCNH'],
        }));
        setExampleData(jsonData);
      } catch (error) {
        message.error('Erro ao buscar dados de exemplo');
      } finally {
        setLoading(false);
      }
    };

    const fetchUserTypes = async () => {
      try {
        const response = await api.get('/userType/drivers');
        setUserTypes(response.data.response);
      } catch (error) {
        message.error('Erro ao buscar tipos de usuário');
      }
    };

    fetchExampleData();
    fetchUserTypes();
  }, []);

  const columns: ColumnsType<DriverData> = [
    { title: '', dataIndex: 'index', key: 'index' },
    { title: 'nome', dataIndex: 'name', key: 'name' },
    { title: 'cpf', dataIndex: 'cpf', key: 'cpf' },
    { title: 'email', dataIndex: 'email', key: 'email' },
    { title: 'telefone', dataIndex: 'telefone', key: 'telefone' },
    { title: 'numeroDocVeiculo', dataIndex: 'numeroDocVeiculo', key: 'numeroDocVeiculo' },
    { title: 'marcaVeiculo', dataIndex: 'marcaVeiculo', key: 'marcaVeiculo' },
    { title: 'modeloVeiculo', dataIndex: 'modeloVeiculo', key: 'modeloVeiculo' },
    { title: 'placa', dataIndex: 'placa', key: 'placa' },
    { title: 'numeroRenavam', dataIndex: 'numeroRenavam', key: 'numeroRenavam' },
    { title: 'corVeiculo', dataIndex: 'corVeiculo', key: 'corVeiculo' },
    { title: 'numeroAssentos', dataIndex: 'numeroAssentos', key: 'numeroAssentos' },
    { title: 'anoFabricacao', dataIndex: 'anoFabricacao', key: 'anoFabricacao' },
    { title: 'numeroCNH', dataIndex: 'numeroCNH', key: 'numeroCNH' }
  ];

  const resetFile = () => {
    setSelectedFile(null);
    setFileList([]);
    setPreviewData([]);
  };

  const buildPreview = (file: File) => {
    const fileReader = new FileReader();
    fileReader.onload = (event: any) => {
      const data = new Uint8Array(event.target.result);
      const workbook = XLSX.read(data, { type: 'array' });
      const sheetName = workbook.SheetNames[0];
      const sheet = workbook.Sheets[sheetName];
      const jsonData: DriverData[] = XLSX.utils.sheet_to_json(sheet).map((row: any, index: number) => ({
        index: index + 1,
        name: row['nome'],
        cpf: row['cpf'],
        email: row['email'],
        telefone: row['telefone'],
        numeroDocVeiculo: row['numeroDocVeiculo'],
        marcaVeiculo: row['marcaVeiculo'],
        modeloVeiculo: row['modeloVeiculo'],
        placa: row['placa'],
        numeroRenavam: row['numeroRenavam'],
        corVeiculo: row['corVeiculo'],
        numeroAssentos: row['numeroAssentos'],
        anoFabricacao: row['anoFabricacao'],
        numeroCNH: row['numeroCNH'],
      }));
      setPreviewData(jsonData);
    };
    fileReader.readAsArrayBuffer(file);
  };

  const handleUpload = async () => {
    if (!selectedFile) {
      message.error('Selecione um arquivo para importar');
      return Promise.reject();
    }

    if (selectedUserType === null) {
      message.error('Selecione a categoria em que o motorista irá atuar');
      return Promise.reject();
    }

    const cityId = Session.getLocal("citySelected").cityId;
    if (!cityId) {
      message.error('Selecione uma cidade no painel antes de importar');
      return Promise.reject();
    }

    const formData = new FormData();
    formData.append('file', selectedFile, selectedFile.name);
    formData.append('cityId', cityId.toString());
    formData.append('userTypeId', selectedUserType.toString());

    setLoading(true);
    try {
      const response = await api.post('/import/driver', formData, {
        headers: {
          Accept: 'application/json',
          'Content-Type': 'multipart/form-data',
        },
      });

      if (response.status === 200 && response.data?.status !== false) {
        swal({
          title: "Sucesso",
          text: "Seu arquivo está sendo processado, em breve irá receber uma notificação de validação",
          icon: "success",
          buttons: {
            confirm: {
              text: "OK",
              value: true,
              visible: true,
              className: "",
              closeModal: true
            }
          }
        }).then(() => {
          setIsModalVisible(false);
          resetFile();
          window.location.reload();
        });
        return;
      }

      throw new Error(response.data?.message || 'Erro ao enviar o arquivo');
    } catch (error: any) {
      console.error("Erro:", error.response ? error.response.data : error.message);
      const apiMessage =
        error?.response?.data?.message ||
        error?.response?.data?.response ||
        error?.message ||
        'Erro ao enviar o arquivo';
      swal("Erro", String(apiMessage), "error");
      return Promise.reject(error);
    } finally {
      setLoading(false);
    }
  };

  const uploadProps = {
    beforeUpload: (file: File) => {
      const isXlsx = file.type === 'application/vnd.openxmlformats-officedocument.spreadsheetml.sheet'
        || /\.xlsx$/i.test(file.name);
      if (!isXlsx) {
        message.error('Você pode apenas fazer upload de arquivos XLSX!');
        return Upload.LIST_IGNORE;
      }

      setSelectedFile(file);
      setFileList([
        {
          uid: `${file.name}-${file.lastModified}`,
          name: file.name,
          status: 'done',
          originFileObj: file as any,
        },
      ]);
      buildPreview(file);
      return false;
    },
    onRemove: () => {
      resetFile();
    },
  };

  return (
    <>
      <Preload visible={loading} />

      <Container>
        <ContentContainer>
          <h3>Para importação de seus motoristas, precisamos de um arquivo em formato XLSX, é necessário ter pelo menos as informações básicas, caso contrário não será possível fazer a importação com sucesso.</h3>
          <br />
          <h3>Veja na imagem as colunas necessárias, são:</h3>
          <TableContainer>
            <Table columns={columns} loading={loading} dataSource={exampleData} pagination={false} scroll={{ x: 1500 }} rowKey="cpf" />
          </TableContainer>
          <br />
          <h3>Os motoristas após importados serão liberados no seu cadastro de motoristas e todos terão a senha padrão 123456.</h3>
          <br />
          <Button type="primary" onClick={() => setIsModalVisible(true)}>
            Importar Arquivo
          </Button>
        </ContentContainer>
      </Container>

      <Modal
        title="Importar Motoristas"
        open={isModalVisible}
        onCancel={() => {
          setIsModalVisible(false);
          resetFile();
        }}
        onOk={handleUpload}
        okText="Enviar"
        cancelText="Cancelar"
        okButtonProps={{ disabled: !selectedFile || selectedUserType === null, loading }}
        width={800}
      >
        <ModalBody>
          <Select
            style={{ width: '100%', marginBottom: '20px' }}
            placeholder="Selecione a categoria em que o motorista irá atuar"
            onChange={value => setSelectedUserType(value)}
          >
            {userTypes.map(userType => (
              <Select.Option key={userType.idUserType} value={userType.idUserType}>
                {userType.name}
              </Select.Option>
            ))}
          </Select>

          <Upload {...uploadProps} fileList={fileList} accept=".xlsx" maxCount={1}>
            <Button icon={<UploadOutlined />}>Escolher arquivo</Button>
          </Upload>
          {previewData.length > 0 && (
            <TableContainer>
              <Table columns={columns} dataSource={previewData} pagination={false} scroll={{ x: 1500 }} rowKey="cpf" />
            </TableContainer>
          )}
        </ModalBody>
      </Modal>
    </>
  );
};

export default ImportDriver;
