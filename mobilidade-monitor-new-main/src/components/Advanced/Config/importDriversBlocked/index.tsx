import { UploadOutlined } from '@ant-design/icons';
import { Button, Modal, Table, Upload, message } from 'antd';
import type { UploadFile } from 'antd/es/upload/interface';
import { ColumnsType } from 'antd/es/table';
import { FC, useEffect, useState } from 'react';
import swal from 'sweetalert';
import * as XLSX from 'xlsx';
import api from '../../../../services/api';
import Session from '../../../../utils/Session';
import Preload from '../../../Utils/Preload';
import { Container, ContentContainer, ModalBody, TableContainer } from './styles';

const ImportDriverBlocked: FC = () => {
  const [isModalVisible, setIsModalVisible] = useState(false);
  const [fileList, setFileList] = useState<UploadFile[]>([]);
  const [selectedFile, setSelectedFile] = useState<File | null>(null);
  const [previewData, setPreviewData] = useState<any[]>([]);
  const [exampleData, setExampleData] = useState<any[]>([]);
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
        const jsonData: any[] = XLSX.utils.sheet_to_json(sheet).map((row: any) => ({
          cpf: row['cpf'],
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

  const columns: ColumnsType<any> = [
    { title: 'cpf', dataIndex: 'cpf', key: 'cpf' },
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
      const jsonData: any[] = XLSX.utils.sheet_to_json(sheet).map((row: any) => ({
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

    const cityId = Session.getLocal("citySelected").cityId;
    if (!cityId) {
      message.error('Selecione uma cidade no painel antes de importar');
      return Promise.reject();
    }

    const formData = new FormData();
    formData.append('file', selectedFile, selectedFile.name);
    formData.append('cityId', cityId.toString());

    setLoading(true);
    try {
      const response = await api.post('/driver/blockEnMasse', formData, {
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
          <h3>Para importação de seus Prestadores que deseja BLOQUEAR, precisamos de um arquivo em formato XLSX, é necessário ter pelo menos as informações básicas do CPF, caso contrário não será possível fazer o bloqueio com sucesso.</h3>
          <br />
          <h3>Veja na imagem as colunas necessárias, são:</h3>
          <TableContainer>
            <Table columns={columns} loading={loading} dataSource={exampleData} pagination={false} scroll={{ x: 1500 }} rowKey="cpf" />
          </TableContainer>
          <br />
          <h4>ATENÇÃO: CASO NECESSÁRIO DESFAZER ESTA OPERAÇÃO USE O RECURSO DE IMPORTAR PRESTADORES PARA DESBLOQUEIO  <a href='/setting/importDriversUnblocked'>CLICANDO AQUI</a></h4>
          <h3>Os Prestadores após importados serão bloqueados.</h3>
          <br />
          <Button type="primary" onClick={() => setIsModalVisible(true)}>
            Importar Arquivo
          </Button>
        </ContentContainer>
      </Container>

      <Modal
        title="Importar Prestadores"
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
              <Table columns={columns} loading={loading} dataSource={previewData} pagination={false} scroll={{ x: 1500 }} rowKey="cpf" />
            </TableContainer>
          )}
        </ModalBody>
      </Modal>
    </>
  );
};

export default ImportDriverBlocked;
