import { FC, useEffect, useState } from 'react';
import { Button, Modal, Table, Upload, message } from 'antd';
import { UploadOutlined } from '@ant-design/icons';
import type { UploadFile } from 'antd/es/upload/interface';
import * as XLSX from 'xlsx';
import api from '../../../../services/api';
import swal from 'sweetalert';
import Preload from '../../../Utils/Preload';
import { ColumnsType } from 'antd/es/table';
import { ClientData } from './types';
import { Container, ContentContainer, ModalBody, TableContainer } from './styles';
import Session from '../../../../utils/Session';

const ImportClient: FC = () => {
  const [isModalVisible, setIsModalVisible] = useState(false);
  const [fileList, setFileList] = useState<UploadFile[]>([]);
  const [selectedFile, setSelectedFile] = useState<File | null>(null);
  const [previewData, setPreviewData] = useState<ClientData[]>([]);
  const [exampleData, setExampleData] = useState<ClientData[]>([]);
  const [loading, setLoading] = useState(false);

  useEffect(() => {
    const fetchExampleData = async () => {
      setLoading(true);
      try {
        const response = await api.get('/import/customer/example', {
          responseType: 'arraybuffer'
        });
        const data = new Uint8Array(response.data);
        const workbook = XLSX.read(data, { type: 'array' });
        const sheetName = workbook.SheetNames[0];
        const sheet = workbook.Sheets[sheetName];
        const jsonData: ClientData[] = XLSX.utils.sheet_to_json(sheet, { header: 1 }).slice(1).map((row: any, index: number) => ({
          index: index + 1,
          name: row[0],
          email: row[1],
          telefone: row[2],
          cpf: row[3],
        }));
        setExampleData(jsonData);
      } catch (error) {
        message.error('Erro ao buscar dados de exemplo');
      } finally {
        setLoading(false);
      }
    };
    fetchExampleData();
  }, []);

  const columns: ColumnsType<ClientData> = [
    { title: 'Index', dataIndex: 'index', key: 'index' },
    { title: 'Nome', dataIndex: 'name', key: 'name' },
    { title: 'Email', dataIndex: 'email', key: 'email' },
    { title: 'Telefone', dataIndex: 'telefone', key: 'telefone' },
    { title: 'CPF', dataIndex: 'cpf', key: 'cpf' }
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
      const jsonData: ClientData[] = XLSX.utils.sheet_to_json(sheet).map((row: any, index: number) => ({
        index: index + 1,
        name: row['nome'],
        email: row['email'],
        telefone: row['telefone'],
        cpf: row['cpf'],
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

    const cityId = Session.getLocal("citySelected")?.cityId;

    const formData = new FormData();
    formData.append('file', selectedFile, selectedFile.name);
    formData.append('cityId', cityId.toString());

    setLoading(true);
    try {
      const response = await api.post('/import/customer', formData, {
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
          <h3>Para importação de seus clientes, precisamos de um arquivo em formato XLSX, é necessário ter pelo menos as informações básicas, caso contrário não será possível fazer a importação com sucesso.</h3>
          <br />
          <h3>Veja na imagem as colunas necessárias, são:</h3>
          <Table columns={columns} loading={loading} dataSource={exampleData} pagination={false} rowKey="cpf" />
          <br />
          <h3>Os clientes após importados serão liberados no seu cadastro de clientes e todos terão a senha padrão 123456.</h3>
          <br />
          <Button type="primary" onClick={() => setIsModalVisible(true)}>
            Importar Arquivo
          </Button>
        </ContentContainer>
      </Container>

      <Modal
        title="Importar Clientes"
        open={isModalVisible}
        onCancel={() => {
          setIsModalVisible(false);
          resetFile();
        }}
        onOk={handleUpload}
        okText="Enviar"
        cancelText="Cancelar"
        okButtonProps={{ disabled: !selectedFile, loading }}
        width={800}
      >
        <ModalBody>
          <Upload {...uploadProps} fileList={fileList} accept=".xlsx" maxCount={1}>
            <Button icon={<UploadOutlined />}>Escolher arquivo</Button>
          </Upload>
          {previewData.length > 0 && (
            <TableContainer>
              <Table columns={columns} dataSource={previewData} pagination={false} rowKey="cpf" />
            </TableContainer>
          )}
        </ModalBody>
      </Modal>
    </>
  );
};

export default ImportClient;
