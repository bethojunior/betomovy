import { AxiosError } from "axios";
import { useEffect, useState } from "react";
import api from "../../../services/api";
import { Button, Select, Table } from "antd";
import {
  AiFillDelete,
  AiOutlineArrowLeft,
  AiOutlineArrowRight,
} from "react-icons/ai";
import Alert from "../../../components/Utils/Alert";
import swal from "sweetalert";

import {
  ButtonPage,
  ContentPaginate,
  ContentTable,
  Content,
  LabelText,
} from "./styles";

import { useDebounce } from "../../../hooks/useDebounce";

interface UsersType {
  centralName: string;
  email: string;
  idUser: number;
  name: string;
}

export const UsersList = () => {
  const [loading, setLoading] = useState(false);
  const [showAlert, setShowAlert] = useState(false);
  const [messageAlert, setMessageAlert] = useState("");
  const [typeAlert, setTypeAlert] = useState<
    "success" | "info" | "warning" | "error"
  >("success");

  const [list, setList] = useState<UsersType[]>([]);
  const [nextPage, setNextPage] = useState<number | null>(null);
  const [lastPage, setLastPage] = useState<number | null>(null);
  const [customersFiltered, setCustomersFiltered] = useState<
    DefaultOptionsSelectAntdProps[]
  >([]);
  const [loadingSelect, setLoadingSelect] = useState<boolean>(false);

  const columns = [
    {
      title: "Central",
      dataIndex: "centralName",
      key: "centralName",
      ellipsis: true,
      width: 150,
    },
    {
      title: "Nome",
      dataIndex: "name",
      key: "name",
      ellipsis: true,
      width: 200,
    },
    {
      title: "E-mail",
      dataIndex: "email",
      key: "email",
      ellipsis: true,
      width: 250,
    },
    {
      title: "Desvincular",
      dataIndex: "",
      key: "",
      ellipsis: true,
      width: 100,
      render: (item: UsersType) => (
        <Button
          onClick={() => remove(item.idUser)}
          icon={<AiFillDelete style={{ color: "red" }} />}
        ></Button>
      ),
    },
  ];

  const getCustomersCentral = async (page: number | null = 1, name = "") => {
    setLoading(true);
    const { data } = await api(`customer/central?page=${page}&name=${name}`);

    setLoading(false);
    if (!data.status) {
      setMessageAlert(
        "Ocorreu um erro ao carregar as informações, tente novamente"
      );
      setTypeAlert("error");
      setShowAlert(true);
      return;
    }

    if (data.response.next_page_url !== null && page !== null) {
      setNextPage(page + 1);
    } else {
      setNextPage(null);
    }

    if (data.response.prev_page_url !== null && page !== null) {
      setLastPage(page - 1);
    } else {
      setLastPage(null);
    }

    setList(data.response.data);
  };

  const remove = async (id: number) => {
    swal({
      title: "Deseja desvincular esse usuário da central?",
      icon: "warning",
      dangerMode: true,
      buttons: ["Cancelar", "Confirmar"],
    }).then(async (answer) => {
      if (!answer) {
        return;
      }

      setLoading(true);
      try {
        const { data } = await api.delete(`user/${id}/central`);
        
        if (!data.status) {
          setLoading(false);
          setMessageAlert(
            "Ocorreu um erro ao desvincular esse usuário da central, tente novamente"
          );
          setTypeAlert("error");
          setShowAlert(true);
          return;
        }
        
        getCustomersCentral();
        setMessageAlert("Usuário desvinculado da central com sucesso!");
        setTypeAlert("success");
        setShowAlert(true);
      } catch (error) {
        console.error("Erro ao desvincular usuário:", error);
        setLoading(false);
        setMessageAlert(
          "Ocorreu um erro ao desvincular esse usuário da central, tente novamente"
        );
        setTypeAlert("error");
        setShowAlert(true);
      } finally {
        setLoading(false);
      }
    });
  };

  const fetchUsers = async (nameUser: string) => {
    try {
      setLoadingSelect(true);
      const responseUsers = await api.get(
        `customer/central?page=1&name=${nameUser}`
      );

      if (responseUsers.status) {
        const customersFilteredFormated = responseUsers.data.response.data.map(
          (value: UsersType) => {
            return {
              value: value.name,
              label: value.name,
            };
          }
        );

        setCustomersFiltered(customersFilteredFormated);
      }
    } catch (error) {
      const responseError = error as AxiosError;
      swal({
        title: responseError.response?.data.message,
        icon: "error",
      });
    } finally {
      setLoadingSelect(false);
    }
  };

  const loadingOptionsProps = useDebounce((inputValue: string) => {
    fetchUsers(inputValue);
  }, 1000);

  const onChange = (nameCustomer: string) => {
    getCustomersCentral(1, nameCustomer);
  };

  const onSearch = (valueSearch: string) => {
    loadingOptionsProps(valueSearch);
  };

  const filterOption = (
    input: string,
    option?: { label: string; value: string }
  ) => (option?.label ?? "").toLowerCase().includes(input.toLowerCase());

  useEffect(() => {
    getCustomersCentral();
  }, []);

  return (
    <Content>
      <Alert
        visibility={showAlert}
        message={messageAlert}
        typeAlert={typeAlert}
        setVisibility={setShowAlert}
      />
      <LabelText>Filtro</LabelText>
      <Select
        style={{
          width: "100%",
        }}
        showSearch
        placeholder="Selecione um usuário"
        optionFilterProp="children"
        onChange={onChange}
        onSearch={onSearch}
        filterOption={filterOption}
        options={customersFiltered}
        loading={loadingSelect}
      />
      <ContentTable>
        <Table
          pagination={false}
          columns={columns}
          dataSource={list}
          loading={loading}
        />
      </ContentTable>
      <ContentPaginate>
        <ButtonPage
          disabled={lastPage === null}
          onClick={() => getCustomersCentral(lastPage)}
          icon={<AiOutlineArrowLeft />}
        />

        <ButtonPage
          disabled={nextPage === null}
          onClick={() => getCustomersCentral(nextPage)}
          icon={<AiOutlineArrowRight />}
        />
      </ContentPaginate>
    </Content>
  );
};
