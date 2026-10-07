import {
  Checkbox,
  Form,
  Input,
  Modal,
  Select,
  UploadProps,
} from "antd";
import { Option } from "antd/lib/mentions";
import { RcFile, UploadFile } from "antd/lib/upload";
import { useEffect, useState, useCallback } from "react";
import { File, FooterModal, FooterModalButton, FormItem } from "./styles";
import api from "../../../services/api";
import { useDebounce } from "../../../hooks/useDebounce";
import { FormProps, NotificationModalProps, driverTypeListProps } from "./types";
import { SessionCitiesProps } from "../../../@types";

const NotificationModal = ({
  showModal,
  setShowModal,
  driverTypeList,
  setLoading,
  alertValues,
  getAllNotification,
}: NotificationModalProps) => {
  const [fileList, setFileList] = useState<UploadFile[]>([]);
  const [cities, setCities] = useState<SessionCitiesProps[]>([]);
  const [allCities, setAllCities] = useState<SessionCitiesProps[]>([]);
  const [searchingCities, setSearchingCities] = useState(false);

  const onFinish = async (values: FormProps) => {
    setLoading(true);
    api
      .post("notification/store", mountFormData(values), {
        headers: {
          "Content-Type": "multipart/form-data",
        },
      })
      .then((response) => {
        setLoading(false);
        if (response.status === 201) {
          getAllNotification();
          setShowModal(false);
          return alertValues("Sucesso ao criar notificação", "success");
        }
        return alertValues("Erro ao tentar criar notificação", "warning");
      });
  };

  const mountFormData = (values: FormProps) => {
    const formData = new FormData();
    formData.append("title", values.title);
    formData.append("message", values.message);
    formData.append(
        "cityId",
        Array.isArray(values.cityId) ? values.cityId.join(",") : values.cityId
    );
    if (values.link) {
      formData.append("link", values.link);
    }
    formData.append(
      "identifyUserInLink",
      values.identifyUserInLink ? "1" : "0"
    );
    if (values.image) {
      formData.append("image", values.image.file);
    }
    values.userTypes.forEach((id: string) => {
      formData.append("userTypes[]", id);
    });
    return formData;
  };

  const onChange: UploadProps["onChange"] = ({ fileList: newFileList }) => {
    setFileList(newFileList);
  };

  const onPreview = async (file: UploadFile) => {
    let src = file.url as string;
    if (!src) {
      src = await new Promise((resolve) => {
        const reader = new FileReader();
        reader.readAsDataURL(file.originFileObj as RcFile);
        reader.onload = () => resolve(reader.result as string);
      });
    }
    const image = new Image();
    image.src = src;
    const imgWindow = window.open(src);
    imgWindow?.document.write(image.outerHTML);
  };

  const searchCities = useCallback(async (searchTerm: string) => {
    if (!searchTerm) {
      setCities(allCities);
      return;
    }

    // Filtro local
    const filteredCities = allCities.filter(city => 
      city.shortName.toLowerCase().includes(searchTerm.toLowerCase())
    );
    setCities(filteredCities);
  }, [allCities]);

  const loadAllCities = useCallback(async () => {
    try {
      setSearchingCities(true);
      const response = await api.get('/city/actives/fully');
      if (response.status === 200 && response.data.status && Array.isArray(response.data.response)) {
        setAllCities(response.data.response);
        setCities(response.data.response);
      } else {
        setAllCities([]);
        setCities([]);
      }
    } catch (error) {
      console.error('Error fetching cities:', error);
      setAllCities([]);
      setCities([]);
    } finally {
      setSearchingCities(false);
    }
  }, []);

  const debouncedSearchCities = useDebounce(searchCities, 300);

  useEffect(() => {
    loadAllCities();
  }, [loadAllCities]);

  return (
    <>
      <Modal
        title="Nova notificação"
        open={showModal}
        onCancel={() => setShowModal(false)}
        footer={[]}
      >
        <Form
          name="basic"
          onFinish={onFinish}
          layout={"vertical"}
          autoComplete="off"
        >
          <FormItem
            label="Assunto"
            name="title"
            rules={[
              { required: true, message: "Por favor insira um assunto!" },
            ]}
          >
            <Input />
          </FormItem>
          <FormItem
            label="Descrição"
            name="message"
            rules={[
              { required: true, message: "Por favor insira uma descrição!" },
            ]}
          >
            <Input.TextArea rows={2} />
          </FormItem>
          <FormItem
            name="cityId"
            label="Cidade"
            rules={[
              { required: true, message: "Por favor insira uma cidade!" },
            ]}
          >
            <Select
              mode="multiple"
              placeholder="Selecione uma cidade"
              allowClear
              showSearch
              filterOption={false}
              loading={searchingCities}
              onSearch={debouncedSearchCities}
              notFoundContent={searchingCities ? 'Buscando...' : 'Nenhuma cidade encontrada'}
            >
              {cities.map((item: SessionCitiesProps) => (
                <Option key={item.cityId} value={item.cityId}>
                  {item.shortName}
                </Option>
              ))}
            </Select>
          </FormItem>
          <FormItem label="Url" name="link">
            <Input />
          </FormItem>
          <FormItem
            name="identifyUserInLink"
            valuePropName="checked"
            wrapperCol={{ span: 16 }}
          >
            <Checkbox>Vincular usuário a Url</Checkbox>
          </FormItem>
          <FormItem label="Imagem" name="image">
            <File
              action="/upload"
              beforeUpload={() => false}
              listType="picture-card"
              fileList={fileList}
              onChange={onChange}
              onPreview={onPreview}
            >
              {fileList.length < 1 && "+ Escolher"}
            </File>
          </FormItem>
          <FormItem 
            label="Destinatario"
            name="userTypes"
            rules={[
              { required: true, message: "Por favor selecione pelo menos um destinatário!" },
            ]}
          >
            <Select
              mode="multiple"
              placeholder="Selecione um destinatario"
              maxTagCount="responsive"
            >
              {driverTypeList.map((res: driverTypeListProps) => (
                <Option key={res.id} value={res.id}>
                  <div className="demo-option-label-item">{res.name}</div>
                </Option>
              ))}
            </Select>
          </FormItem>
          <FormItem>
            <FooterModal>
              <FooterModalButton
                onClick={() => setShowModal(false)}
              >
                Voltar
              </FooterModalButton>
              <FooterModalButton
                type="primary"
                htmlType="submit"
              >
                Salvar
              </FooterModalButton>
            </FooterModal>
          </FormItem>
        </Form>
      </Modal>
    </>
  );
};

export default NotificationModal;