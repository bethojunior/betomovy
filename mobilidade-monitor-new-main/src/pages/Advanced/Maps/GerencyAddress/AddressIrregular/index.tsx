import { Container, ContentTable, ContentActions } from "./styles";

import { Table, Button } from "antd";
import { ColumnsType } from "antd/es/table";
import { FaTrash } from "react-icons/fa";
import { AiFillCheckCircle, AiOutlineClose } from "react-icons/ai";
import swal from "sweetalert";

import { useState, useEffect } from "react";

 

import api from "../../../../../services/api";

import { AddressBlacklistProps } from "./types";

export const AddressIrregular = () => {
  const [addressBlackList, setAddressBlackList] = useState<
    AddressBlacklistProps[]
  >([]);
   
  const [loadingTable, setLoadingTable] = useState<boolean>(false);

  const getAddressBlacklist = async () => {
    setLoadingTable(true);
    try {
      const responseAddressBlackList = await api.get("addressBlacklist");
      if (responseAddressBlackList.status) {
        const raw = responseAddressBlackList?.data?.response?.data ?? responseAddressBlackList?.data?.response;
        setAddressBlackList(Array.isArray(raw) ? raw : []);
      }
    } catch (error) {
      console.error(error);
      setAddressBlackList([]);
    } finally {
      setLoadingTable(false);
    }
  };

  useEffect(() => {
    getAddressBlacklist();
  }, []);

  const handleUnlockLockAddress = (datasAddress: AddressBlacklistProps) => {
    swal({
      title: "Deseja desbloquear este endereço?",
      icon: "info",
      buttons: ["Não", "Sim"],
    }).then((isAccept) => {
      if (isAccept) {
        setLoadingTable(true);
        api
          .put(`addressBlacklist/${datasAddress.id}/refuse`, datasAddress)
          .then((response) => {
            if (response.status) {
              swal({
                title: "Sucesso!",
                icon: "success",
              });
              getAddressBlacklist();
            }
          })
          .catch((error) => {
            console.error(error);
            swal({
              title: "Erro ao bloquear endereço",
              icon: "error",
            });
          })
          .finally(() => {
            setLoadingTable(false);
          });
      }
    });
  };

  const handleApproveAddress = (datasAddress: AddressBlacklistProps) => {
    swal({
      title: "Deseja bloquear este endereço?",
      icon: "info",
      buttons: ["Não", "Sim"],
    }).then((isAccept) => {
      if (isAccept) {
        setLoadingTable(true);
        api
          .put(`addressBlacklist/${datasAddress.id}/approve`, datasAddress)
          .then((response) => {
            if (response.status) {
              swal({
                title: "Sucesso!",
                icon: "success",
              });
              getAddressBlacklist();
            }
          })
          .catch((error) => {
            console.error(error);
            swal({
              title: "Erro ao bloquear endereço",
              icon: "error",
            });
          })
          .finally(() => {
            setLoadingTable(false);
          });
      }
    });
  };

  const handleDeleteAddress = (id: number) => {
    swal({
      title: "Deseja deletar este endereço?",
      icon: "info",
      buttons: ["Não", "Sim"],
    }).then((isAccept) => {
      if (isAccept) {
        setLoadingTable(true);
        api
          .delete(`addressBlacklist/${id}`)
          .then((response) => {
            if (response.status) {
              swal({
                title: "Sucesso",
                icon: "success",
              });
              getAddressBlacklist();
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

  const columns: ColumnsType<AddressBlacklistProps> = [
    {
      title: "Endereço",
      key: "address",
      width: 300,
      render: (_, data) => {
        return (
          <a
            href={`https://www.google.com/maps/search/?api=1&query=${data.latitude},${data.longitude}`}
            target="_blank"
          >
            {data.address}
          </a>
        );
      },
    },
    {
      title: "Horário",
      key: "hour",
      render: (_, data) => {
        return new Date(data.created_at).toLocaleString();
      },
    },
    {
      title: "Status",
      key: "status",
      width: 150,
      ellipsis: true,
      render: (_, data) => {
        return data.approved === 1 ? "Bloqueado" : "Desbloqueado";
      },
    },
    {
      title: "Ações",
      key: "actions",
      width: 180,
      align: "right",
      render: (_, data) => {
        return (
          <ContentActions>
            {data.approved === 1 ? (
              <Button
                onClick={() => handleUnlockLockAddress(data)}
                icon={<AiOutlineClose />}
              />
            ) : (
              <Button
                onClick={() => handleApproveAddress(data)}
                icon={<AiFillCheckCircle />}
              />
            )}
            <Button
              onClick={() => handleDeleteAddress(data.id)}
              icon={<FaTrash />}
            />
          </ContentActions>
        );
      },
    },
  ];

  return (
    <Container>
       
      <ContentTable>
        <Table columns={columns} dataSource={Array.isArray(addressBlackList) ? addressBlackList : []} loading={loadingTable} />
      </ContentTable>
    </Container>
  );
};
