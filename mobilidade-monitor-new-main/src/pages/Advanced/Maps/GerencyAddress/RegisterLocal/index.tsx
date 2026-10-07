import {
  Container,
  ContentSearch,
  ContentTable,
  ContentPagination,
  ContentHeader,
  ContentBtnAddAddress,
} from "./styles";

import { Input, Table, Pagination, Button as ButtonAntd } from "antd";
import { FaTrash } from "react-icons/fa";

import { useEffect, useState } from "react";

import api from "../../../../../services/api";

import Preload from "../../../../../components/Utils/Preload";
import { ModalAddAddress } from "../../../../../components/Advanced/Maps/GerencyAddress/RegisterLocal/ModalAddAddress";

import { AddressProps } from "./types";
import { ColumnsType } from "antd/es/table";
import swal from "sweetalert";

let last_page: number;

export const RegisterLocal = () => {
  const [address, setAddress] = useState<AddressProps[]>([]);
  const [valueSearch, setValueSearch] = useState<string>("");
  const [showModal, setShowModal] = useState<boolean>(false);
  const [loading, setLoading] = useState<boolean>(false);

  const getAddress = async (page: number = 1) => {
    setLoading(true);
    try {
      const responseAddress = await api.get(
        `address?q=${valueSearch}&page=${page}`
      );

      if (responseAddress.status) {
        last_page = responseAddress.data.response.last_page;
        setAddress(responseAddress.data.response.data);
      }
    } catch (error) {
      console.error(error);
    } finally {
      setLoading(false);
    }
  };

  const handleDeleteAddress = (id: number) => {
    swal({
      title: "Deseja remover o endereço?",
      icon: "info",
      buttons: ["Não", "Sim"],
    }).then((isAccept) => {
      if (isAccept) {
        setLoading(true);
        api
          .delete(`address/${id}`)
          .then((response) => {
            if (response.status) {
              swal({
                title: "Endereço removido com sucesso",
                icon: "success",
              });
              getAddress();
            }
          })
          .catch((error) => {
            console.error(error);
          })
          .finally(() => {
            setLoading(false);
          });
      }
    });
  };

  useEffect(() => {
    getAddress();
  }, []);

  const columns: ColumnsType<AddressProps> = [
    {
      title: "Endereço",
      dataIndex: "address",
      key: "address",
      width: 300,
    },
    {
      title: "",
      key: "positions",
      width: 120,
      ellipsis: true,
      render: (_, data) => {
        return (
          <a
            target="_blank"
            href={`http://maps.google.com/?q=${data.latitude},${data.longitude}`}
          >
            Ver Posição
          </a>
        );
      },
    },
    {
      title: "",
      key: "actions",
      width: 50,
      ellipsis: true,
      render: (_, data) => {
        return (
          <ButtonAntd
            onClick={() => handleDeleteAddress(data.id)}
            icon={<FaTrash color="#DC143C" />}
          />
        );
      },
    },
  ];

  return (
    <Container>
      <Preload visible={loading} />
      <ContentHeader>
        <ContentBtnAddAddress>
          <ButtonAntd
            style={{
              width: "100%",
            }}
            type="primary"
            onClick={() => setShowModal(true)}
          >
            Cadastrar Endereço
          </ButtonAntd>
        </ContentBtnAddAddress>
        <ContentSearch>
          <Input.Search
            style={{
              width: "100%",
            }}
            placeholder="Pesquise o endereço"
            value={valueSearch}
            onChange={(event) => setValueSearch(event.target.value)}
            onSearch={() => getAddress()}
            enterButton
          />
        </ContentSearch>
      </ContentHeader>
      <ContentTable>
        <Table columns={columns} loading={loading} dataSource={address} pagination={false} />
      </ContentTable>
      {last_page && (
        <ContentPagination>
          <Pagination
            onChange={(value) => getAddress(value)}
            total={last_page}
          />
        </ContentPagination>
      )}

      <ModalAddAddress
        getAddress={getAddress}
        setLoading={setLoading}
        setShowModal={setShowModal}
        showModal={showModal}
      />
    </Container>
  );
};
