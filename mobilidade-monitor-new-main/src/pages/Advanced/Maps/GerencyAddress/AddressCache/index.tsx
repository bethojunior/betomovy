import { Container, ContentHeader, ContentTable } from "./styles";
import { Input, Table } from "antd";
import { FaTrash } from "react-icons/fa";
import { Button } from "antd";

import { useState } from "react";

 

import { AddressCacheProps } from "./types";
import api from "../../../../../services/api";
import { ColumnsType } from "antd/es/table";
import swal from "sweetalert";

export const AddressCache = () => {
  const [listAddressCache, setListAddressCache] = useState<AddressCacheProps[]>(
    []
  );
   
  const [loadingTable, setLoadingTable] = useState<boolean>(false);

  const [valueSearch, setValueSearch] = useState<string>("");

  const getAddressCache = async () => {
    setLoadingTable(true);
    try {
      const responseAddressCache = await api.post("address/cache", {
        query: valueSearch,
      });

      if (responseAddressCache.status) {
        setListAddressCache(responseAddressCache.data.response);
      }
    } catch (error) {
      console.error(error);
    } finally {
      setLoadingTable(false);
    }
  };

  const handleDeleteAddress = async (data: AddressCacheProps) => {
    swal({
      title: "Deseja bloquear esse endereço",
      icon: "info",
      buttons: ["Não", "Sim"],
    }).then((isAccept) => {
      if (isAccept) {
        setLoadingTable(true);
        api
          .post("addressBlacklist", {
            address: data.address,
            latitude: data.latitude,
            longitude: data.longitude,
          })
          .then((response) => {
            if (response.status) {
              swal({
                title: "Deletado com sucesso!",
                icon: "success",
              });
              getAddressCache();
            }
          })
          .catch((error) => {
            console.error(error);
            swal({
              title: "Erro ao deletar endereço",
              icon: "error",
            });
          })
          .finally(() => {
            setLoadingTable(false);
          });
      }
    });
  };

  const columns: ColumnsType<AddressCacheProps> = [
    {
      title: "Endereço",
      dataIndex: "address",
      key: "address",
      width: 400,
      ellipsis: true,
    },
    {
      title: "",
      key: "position",
      width: 120,
      ellipsis: true,
      render: (_, data) => {
        return (
          <a
            href={`https://www.google.com/maps?q=${data.latitude},${data.longitude}`}
            target="_blank"
          >
            Ver posição
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
          <Button
            onClick={() => handleDeleteAddress(data)}
            icon={<FaTrash color="#dc143c" />}
          />
        );
      },
    },
  ];

  return (
    <Container>
       
      <ContentHeader>
        <Input.Search
          style={{
            width: 375,
          }}
          placeholder="Pesquisa"
          onChange={(event) => setValueSearch(event.target.value)}
          onSearch={getAddressCache}
          enterButton
        />
      </ContentHeader>
      <ContentTable>
        <Table
          style={{
            width: "100%",
          }}
          columns={columns}
          dataSource={listAddressCache}
          loading={loadingTable}
        />
      </ContentTable>
    </Container>
  );
};
