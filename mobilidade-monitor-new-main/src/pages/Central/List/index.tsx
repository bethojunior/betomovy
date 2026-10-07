import { Button, Form, Input, Modal, Switch, Table } from "antd";
import { useEffect, useState } from "react";
import {
  ButtonPaginate,
  Content,
  ContentPaginate,
  Header,
  ContentTable,
} from "./styles";
import Alert from "../../../components/Utils/Alert";
import Mask from "../../../services/Mask";
import {
  AiFillDelete,
  AiFillEdit,
  AiOutlineArrowLeft,
  AiOutlineArrowRight,
  AiOutlineUser,
} from "react-icons/ai";
import { MdOutlineAttachMoney } from "react-icons/md";
import api from "../../../services/api";
import { ModalRegister } from "../../../components/Central/ModalRegister";
import { CitiesType } from "../../Financial/Charge/types";
import { TripTypes } from "../Config/types";
import { VoucherModal } from "../../../components/Central/ModalVoucher";
import { UsersModal } from "../../../components/Central/ModalUsers";
import swal from "sweetalert";
import { IncludesUsersModal } from "../../../components/Central/ModalIncludeUser";
import { ComissionModal } from "../../../components/Central/ModalComission";
import Session from "../../../utils/Session";

let showButtonAll = false;

interface CentralType {
  active: number;
  address: string;
  created_at: string;
  responsibleEmail: string;
  id: 8;
  latitude: string;
  logo: string;
  longitude: string;
  name: string;
  phone: string;

  responsibleName: string;
  tripBalance: number | null;
}

export interface UserType {
  centralId: number;
  email: string;
  id: number;
  idUser: number;
  isAdmin: boolean;
  name: string;
  phone: string;
}

export const ListCentral = () => {
  const [loading, setLoading] = useState(false);
  const [showAlert, setShowAlert] = useState(false);
  const [messageAlert, setMessageAlert] = useState("");
  const [typeAlert, setTypeAlert] = useState<
    "success" | "info" | "warning" | "error"
  >("success");

  const [listCentral, setListCentral] = useState<CentralType[]>([]);
  const [nextPage, setNextPage] = useState<number | null>(null);
  const [lastPage, setLastPage] = useState<number | null>(null);
  const [nameSearched, setNameSearched] = useState("");
  const [modeList, setModeList] = useState("Listar todos");
  const [callDriverTypes, setCallDriverTypes] = useState<any>({});
  const [comission, setComission] = useState<any>([]);
  const [editingComission, setEditingComission] = useState<any>(null);
  const [tripType, setTripType] = useState<TripTypes[]>([]);
  const [city, setCity] = useState<CitiesType[]>([]);

  const [createCentralModal, setCreateCentralModal] = useState(false);
  const [showComissionModal, setShowComissionModal] = useState(false);
  const [showCreateComissionModal, setShowCreateComissionModal] =
    useState(false);
  const [showVoucherModal, setShowVoucherModal] = useState(false);
  const [showUsersModal, setShowUsersModal] = useState(false);
  const [showIncludesUsersModal, setShowIncludesUsersModal] = useState(false);

  const [dataEdit, setDataEdit] = useState<CentralType>({} as CentralType);
  const [selectedCentral, setSelectedCentral] = useState<number>(0);
  const [usersList, setUsersList] = useState<UserType[]>([]);

  const [form] = Form.useForm();

  const columns = [
    {
      title: "Central",
      dataIndex: "name",
      ellipsis: true,
      width: 200,
      key: "name",
      render: (_: any, item: any) => (
        <div>
          <strong>{item.name}</strong>
          <div>ID: {item.id}</div>
        </div>
      ),
    },
    {
      title: "Endereço",
      dataIndex: "address",
      key: "address",
      width: 400,
    },
    {
      title: "Saldo",
      dataIndex: "tripBalance",
      key: "tripBalance",
      width: 150,
      render: (item: number) => (
        <label>
          {item !== null ? Mask.setMaskMoneyNumber(item) : "Não informado"}
        </label>
      ),
    },
    {
      title: "Editar",
      key: "edit",
      ellipsis: true,
      width: 100,
      render: (item: any) => (
        <Button
          onClick={() => {
            getCentral(1, item.id);
          }}
          icon={<AiFillEdit style={{ fontSize: 20, color: "#1677ff" }} />}
        />
      ),
    },
    {
      title: "Voucher",
      key: "voucher",
      ellipsis: true,
      width: 100,
      render: (item: any) => (
        <Button
          onClick={() => {
            setSelectedCentral(item.id);
            setShowVoucherModal(true);
          }}
          icon={
            <MdOutlineAttachMoney style={{ color: "green", fontSize: 20 }} />
          }
        />
      ),
    },
    {
      title: "Usuários",
      key: "users",
      ellipsis: true,
      width: 100,
      render: (item: any) => (
        <Button
          onClick={() => {
            setSelectedCentral(item.id);
            getUsers(item.id);
          }}
          icon={<AiOutlineUser style={{ fontSize: 20 }} />}
        />
      ),
    },
    {
      title: "Excluir",
      key: "delete",
      ellipsis: true,
      width: 100,
      render: (item: any) => (
        <Button
          onClick={() => deleteCentral(item.id)}
          icon={<AiFillDelete style={{ color: "red", fontSize: 20 }} />}
        />
      ),
    },
    {
      title: "Status",
      key: "status",
      ellipsis: true,
      width: 100,
      render: (item: any) => (
        <Switch
          checked={item.active === 1}
          onChange={(e) => changeStatusCentral(item.id, e)}
        />
      ),
    },
  ];

  const columnsComission = [
    {
      title: "Tipo",
      dataIndex: "trip_type",
      key: "trip_type",
      width: 150,
      ellipsis: true,
      render: (trip_type: any) => (
        <label>{trip_type && trip_type.type ? trip_type.type : "N/A"}</label>
      ),
    },
    {
      title: "Valor",
      dataIndex: "partnerCommissionValue",
      key: "partnerCommissionValue",
      width: 100,
      ellipsis: true,
      render: (value: number) => (
        <label>{value !== undefined ? Mask.setMaskMoneyNumber(value) : "N/A"}</label>
      ),
    },
    {
      title: "Tipo de comissão",
      dataIndex: "partnerCommissionType",
      key: "partnerCommissionType",
      width: 150,
      ellipsis: true,
      render: (type: string) => (
        <label>{type ? (type === "%" ? "Percentagem" : "Dinheiro") : "N/A"}</label>
      ),
    },
    {
      title: "Cidade",
      dataIndex: "city",
      key: "city",
      width: 100,
      ellipsis: true,
      render: (city: any) => (
        <label>{city && city.nome ? city.nome : "N/A"}</label>
      ),
    },
    {
      title: "Editar",
      key: "edit",
      width: 80,
      ellipsis: true,
      render: (record: any) => (
        <Button
          onClick={() => handleEditComission(record)}
          icon={<AiFillEdit style={{ fontSize: 20, color: "#1677ff" }} />}
        />
      ),
    },
    {
      title: "Excluir",
      key: "delete",
      width: 80,
      ellipsis: true,
      render: (record: any) => (
        <Button
          onClick={() => handleDeleteComission(record.id)}
          icon={<AiFillDelete style={{ color: "red", fontSize: 20 }} />}
        />
      ),
    },
    {
      title: "Ações",
      key: "actions",
      width: 100,
      ellipsis: true,
      render: (item: any) => (
        <Button
          onClick={() => deleteComission(item.id)}
          danger
          type="link"
        >
          Excluir
        </Button>
      ),
    },
  ];

  const getCentral = async (page: number | null = 1, id?: number, _changeMode = true) => {
    setLoading(true);
    let endpoint = `central?page=${page}&name=${nameSearched}`;

    if (id) {
      endpoint = `central/${id}`;
    }
    
    api(endpoint).then(({ data }) => {
      setLoading(false);
      if (!data.status) {
        setMessageAlert(
          "Não foi possível carregar as informações, tente novamente"
        );
        setTypeAlert("error");
        setShowAlert(true);
        return;
      }

      if (id) {
        setDataEdit(data.response);
        setCreateCentralModal(true);
        return;
      }

      let citySelected;
      try {
        citySelected = Session.getLocal("citySelected");
      } catch (error) {
        console.error("Erro ao obter cidade selecionada:", error);
      }
      
      let filteredCentrals = data.response.data;
      const isFilteringByCity = true;

      if (isFilteringByCity && citySelected && citySelected.cityId) {
        filteredCentrals = filteredCentrals.filter((central: any) => {
          if (central.cityId !== undefined) {
            return central.cityId === citySelected.cityId;
          }
          if (central.address && citySelected.nome) {
            return central.address.toLowerCase().includes(citySelected.nome.toLowerCase());
          }
          return false;
        });
      }
      
      setListCentral(filteredCentrals);

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
    });
  };

  const editCentral = async (id: number, values: any) => {
    setLoading(true);
    api
      .put(`central${id}`, {
        values,
      })
      .then(({ data }) => {
        if (!data.status) {
          setLoading(false);
          setMessageAlert(
            "Não foi possível salvar a comissão, tente novamente"
          );
          setTypeAlert("error");
          setShowAlert(true);
          return;
        }

        setMessageAlert("Central atualizada com sucesso!");
        setTypeAlert("success");
        setShowAlert(true);
        getCentral();
      });
  };

  const getCallDriver = async () => {
    api("central/centralCallDriver").then(({ data }) => {
      setLoading(false);
      if (!data.status) {
        setMessageAlert(
          "Não foi possível carregar as informações, tente novamente"
        );
        setTypeAlert("error");
        setShowAlert(true);
        return;
      }

      setCallDriverTypes(data.response);
    });
  };

  const getComission = async () => {
    setLoading(true);
    try {
      const response = await api("partnerCommission");
      const { data } = response;
      setLoading(false);
      
      if (!data || !data.status) {
        setMessageAlert(
          "Não foi possível carregar as comissões, tente novamente"
        );
        setTypeAlert("error");
        setShowAlert(true);
        setComission([]);
        return;
      }

      const comissionData = Array.isArray(data.response) ? data.response : [];
      setComission(comissionData);
    } catch (error) {
      setLoading(false);
      setMessageAlert(
        "Erro ao carregar as comissões, tente novamente"
      );
      setTypeAlert("error");
      setShowAlert(true);
      console.error("Erro ao carregar comissões:", error);
      setComission([]);
    }
  };

  const getTripType = async () => {
    setLoading(true);
    api("tripType").then(({ data }) => {
      setLoading(false);
      if (!data.status) {
        setMessageAlert(
          "Não foi carregar os tipos de corrida, tente novamente"
        );
        setTypeAlert("error");
        setShowAlert(true);
        return;
      }

      setTripType(data.response);
    });
  };

  const getCities = async () => {
    setLoading(true);
    api("city/actives/fully").then(({ data }) => {
      setLoading(false);
      if (!data.status) {
        setMessageAlert(
          "Não foi possível carregar as cidades, tente novamente"
        );
        setTypeAlert("error");
        setShowAlert(true);
        return;
      }

      setCity(data.response);
    });
  };

  const saveComission = async (values: any) => {
    let { cityId, partnerCommissionType, partnerCommissionValue, tripTypeId } =
      values;

    partnerCommissionValue = Mask.setRemoveMaskMoney(partnerCommissionValue);
    if (partnerCommissionValue === 0) {
      setMessageAlert("Valor deve ser maior que zero");
      setTypeAlert("warning");
      setShowAlert(true);
      return;
    }
    setLoading(true);
    
    const endpoint = editingComission 
      ? `partnerCommission/${editingComission.id}` 
      : "partnerCommission";
    
    const payload = {
      cityId,
      partnerCommissionType,
      partnerCommissionValue,
      tripTypeId,
    };
    
    const request = editingComission
      ? api.put(endpoint, payload)
      : api.post(endpoint, payload);
      
    request.then(({ data }) => {
      setLoading(false);
      if (!data.status) {
        setMessageAlert(
          `Não foi possível ${editingComission ? 'atualizar' : 'salvar'} a comissão, tente novamente`
        );
        setTypeAlert("error");
        setShowAlert(true);
        return;
      }

      setMessageAlert(`Comissão ${editingComission ? 'atualizada' : 'criada'} com sucesso!`);
      setTypeAlert("success");
      setShowAlert(true);
      setShowCreateComissionModal(false);
      setEditingComission(null);
      form.resetFields();
      getComission();
      setShowComissionModal(true);
    });
  };

  const handleBalance = async (type: string, value: string) => {
    setLoading(true);
    api
      .post("central/balance", {
        centralId: selectedCentral,
        type,
        value: Mask.setRemoveMaskMoney(value),
      })
      .then(({ data }) => {
        setLoading(false);
        if (!data.status) {
          setMessageAlert(
            "Não foi possível salvar a comissão, tente novamente"
          );
          setTypeAlert("error");
          setShowAlert(true);
          return;
        }

        setMessageAlert("Saldo atualizado com sucesso!");
        setTypeAlert("success");
        setShowAlert(true);
        getCentral();
      });
  };

  const getUsers = async (id: number) => {
    if (!id || id <= 0) {
      setUsersList([]);
      setShowUsersModal(true);
      return;
    }
    
    setLoading(true);
    setSelectedCentral(id);
    
    try {
      const response = await api.get(`central/user/${id}`);
      
      if (response.data && response.data.status) {
        let users = [];
        
        if (Array.isArray(response.data.response)) {
          users = response.data.response;
        } else if (response.data.response && response.data.response.data) {
          users = response.data.response.data;
        }
        
        if (users.length > 0) {
          const formattedUsers = users.map((user: any) => {
            const userData = user.user || user;
            
            return {
              id: userData.idUser || userData.id || Math.random(),
              idUser: userData.idUser || userData.id || Math.random(),
              centralId: id,
              name: userData.name || "Usuário",
              email: userData.email || "email@exemplo.com",
              phone: userData.phone || "",
              isAdmin: user.isAdmin || false
            };
          });
          
          setUsersList(formattedUsers);
        } else {
          setUsersList([]);
        }
      } else {
        setUsersList([]);
      }
    } catch (error) {
      setUsersList([]);
    } finally {
      setLoading(false);
      setShowUsersModal(true);
    }
  };

  const deleteCentral = async (id: number) => {
    swal({
      title: "Deseja apagar essa central?",
      icon: "warning",
      buttons: ["Cancelar", "Confirmar"],
      dangerMode: true,
    }).then((answer) => {
      if (!answer) return;
      
      setLoading(true);
      api.delete(`central/${id}`)
        .then(({ data }) => {
          if (data && data.status) {
            setMessageAlert(data.message || "Central removida com sucesso");
            setTypeAlert("success");
          } else {
            setMessageAlert(data?.message || "Erro ao remover central");
            setTypeAlert("error");
          }
          
          setShowAlert(true);
          getCentral();
        })
        .catch(() => {
          setMessageAlert("Erro ao remover central");
          setTypeAlert("error");
          setShowAlert(true);
        })
        .finally(() => {
          setLoading(false);
        });
    });
  };

  const changeStatusCentral = async (id: number, status: boolean) => {
    let endpoint = `central/${id}/block`;

    if (status) {
      endpoint = `central/${id}/activate`;
    }

    setLoading(true);
    api.put(endpoint).then(({ data }) => {
      setLoading(false);
      if (!data.status) {
        setMessageAlert(
          "Não foi possível atualizar o status da central, tente novamente"
        );
        setTypeAlert("error");
        setShowAlert(true);
        return;
      }

      setMessageAlert("Status atualizado com sucesso!");
      setTypeAlert("success");
      setShowAlert(true);
      getCentral();
    }).catch(() => {
      setLoading(false);
    });
  };

  const deleteUsers = async (idCentral: number, idUser: number) => {
    swal({
      title: "Deseja remover parceiro da central?",
      icon: "warning",
      buttons: ["Cancelar", "Confirmar"],
    }).then((answer) => {
      if (!answer) return;

      setLoading(true);
      
      api.delete(`user/${idUser}/central`)
        .then((response) => {
          const { data } = response;
          
          if (data && data.status) {
            setMessageAlert(data.message || "Usuário removido da central");
            setTypeAlert("success");
          } else {
            setMessageAlert(data?.message || "Erro ao remover usuário da central");
            setTypeAlert("error");
          }
          
          setShowAlert(true);
          getUsers(idCentral);
        })
        .catch(() => {
          setMessageAlert("Erro ao remover usuário da central");
          setTypeAlert("error");
          setShowAlert(true);
        })
        .finally(() => {
          setLoading(false);
        });
    });
  };

  const includesUsers = async (isAdmin: boolean, userId: number) => {
    if (!selectedCentral || selectedCentral <= 0) {
      setMessageAlert("ID da central inválido. Selecione uma central válida.");
      setTypeAlert("error");
      setShowAlert(true);
      return;
    }
    
    setLoading(true);
    
    const objectAddCentral = {
      centralId: selectedCentral,
      userId: userId,
      isAdmin: isAdmin
    };
    
    try {
      const response = await api.post('central/user/insert', objectAddCentral);
      
      if (response.data && response.data.status) {
        setMessageAlert("Usuário adicionado com sucesso!");
        setTypeAlert("success");
        setShowAlert(true);
        
        setTimeout(() => getUsers(selectedCentral), 500);
      } else {
        const errorMessage = response.data?.message || "Não foi possível adicionar o usuário";
        
        if (errorMessage.toLowerCase().includes("já cadastrado")) {
          setMessageAlert("Este usuário já está cadastrado na central.");
          setTypeAlert("info");
          setShowAlert(true);
          
          setTimeout(() => getUsers(selectedCentral), 500);
        } else {
          setMessageAlert(errorMessage);
          setTypeAlert("error");
          setShowAlert(true);
        }
      }
    } catch (error) {
      setMessageAlert("Erro ao adicionar usuário. Tente novamente.");
      setTypeAlert("error");
      setShowAlert(true);
    } finally {
      setLoading(false);
    }
  };

  const deleteComission = async (id: number) => {
    swal({
      title: "Deseja excluir comissão?",
      icon: "warning",
      buttons: ["Cancelar", "Confirmar"],
    }).then((answer) => {
      if (!answer) return;
      
      setLoading(true);
      api.delete(`partnerCommission/${id}`)
        .then(({ data }) => {
          if (data && data.status) {
            setMessageAlert(data.message || "Comissão removida com sucesso");
            setTypeAlert("success");
          } else {
            setMessageAlert(data?.message || "Erro ao remover comissão");
            setTypeAlert("error");
          }
          
          setShowAlert(true);
          getComission();
        })
        .catch(() => {
          setMessageAlert("Erro ao remover comissão");
          setTypeAlert("error");
          setShowAlert(true);
        })
        .finally(() => {
          setLoading(false);
        });
    });
  };

  const getPermission = () => {
    try {
      const user = localStorage.getItem("@App:user");
      if (user) {
        const userData = JSON.parse(user);
        if (userData && userData.roleId !== undefined && userData.support !== undefined) {
          showButtonAll = (userData.roleId === 1 || userData.roleId === 2) && userData.support === 1;
        }
      }
    } catch (error) {
      // Silenciar erro
    }
  };

  const handleEditComission = (record: any) => {
    setEditingComission(record);
    setShowComissionModal(false);
    setShowCreateComissionModal(true);
  };

  const handleDeleteComission = (id: number) => {
    swal({
      title: "Deseja excluir essa comissão?",
      text: "Essa ação não poderá ser revertida!",
      icon: "warning",
      buttons: ["Cancelar", "Confirmar"],
      dangerMode: true,
    }).then((willDelete) => {
      if (willDelete) {
        setLoading(true);
        api.delete(`partnerCommission/${id}`)
          .then(({ data }) => {
            setLoading(false);
            if (!data.status) {
              setMessageAlert(
                "Não foi possível excluir a comissão, tente novamente"
              );
              setTypeAlert("error");
              setShowAlert(true);
              return;
            }

            setMessageAlert("Comissão excluída com sucesso!");
            setTypeAlert("success");
            setShowAlert(true);
            getComission();
          });
      }
    });
  };

  useEffect(() => {
    getPermission();
    getCentral(1, undefined, false);
    getCallDriver();
    getComission();
    getTripType();
    getCities();
  }, []);

  return (
    <div>
      <Alert
        visibility={showAlert}
        message={messageAlert}
        typeAlert={typeAlert}
        setVisibility={setShowAlert}
      />
      <Content>
        <Header>
          <div>
            <p style={{ marginBottom: 3 }}>Procurar</p>
            <Input.Search
              style={{
                width: "100%",
              }}
              type="text"
              value={nameSearched}
              enterButton
              onChange={(e) => setNameSearched(e.target.value)}
              onSearch={() => getCentral()}
            />
          </div>
          <div>
            {showButtonAll && (
              <Button
                type="primary"
                onClick={() => {
                  if (modeList === "Listar todos") {
                    setModeList("Por cidade");
                    setLoading(true);
                    api(`central?page=1&name=${nameSearched}`).then(({ data }) => {
                      setLoading(false);
                      if (data.status) {
                        setListCentral(data.response.data);
                      }
                    });
                  } else {
                    setModeList("Listar todos");
                    getCentral(1, undefined, false);
                  }
                }}
                style={{ marginRight: 10 }}
                loading={loading}
              >
                {modeList}
              </Button>
            )}
            <Button
              type="primary"
              style={{ marginRight: 10 }}
              onClick={() => setCreateCentralModal(true)}
            >
              Cadastrar Central
            </Button>
            <Button type="default" onClick={() => setShowComissionModal(true)}>
              Comissões
            </Button>
          </div>
        </Header>

        <ContentTable>
          <Table
            columns={columns}
            dataSource={listCentral}
            loading={loading}
            pagination={false}
          />
        </ContentTable>
        <ContentPaginate>
          <ButtonPaginate
            disabled={lastPage === null}
            onClick={() => getCentral(lastPage)}
            icon={<AiOutlineArrowLeft />}
          />

          <ButtonPaginate
            disabled={nextPage === null}
            onClick={() => getCentral(nextPage)}
            icon={<AiOutlineArrowRight />}
          />
        </ContentPaginate>
      </Content>
      <ModalRegister
        visible={createCentralModal}
        setVisible={setCreateCentralModal}
        getCentral={getCentral}
        setLoading={setLoading}
        loading={loading}
        setShowAlert={setShowAlert}
        setMessageAlert={setMessageAlert}
        setTypeAlert={setTypeAlert}
        callDriverTypes={callDriverTypes}
        data={dataEdit}
        setData={setDataEdit}
        editCentral={editCentral}
      />
      <VoucherModal
        visible={showVoucherModal}
        setVisible={setShowVoucherModal}
        handleBalance={handleBalance}
      />
      <UsersModal
        visible={showUsersModal}
        setVisible={setShowUsersModal}
        data={usersList}
        deleteUsers={deleteUsers}
        getUsers={getUsers}
        setShowIncludesUsersModal={setShowIncludesUsersModal}
      />
      <IncludesUsersModal
        visible={showIncludesUsersModal}
        setVisible={setShowIncludesUsersModal}
        setShowUsersModal={setShowUsersModal}
        includesUsers={includesUsers}
      />
      <ComissionModal
        visible={showCreateComissionModal}
        setVisible={setShowCreateComissionModal}
        tripType={tripType}
        city={city}
        saveComission={saveComission}
        setShowComissionModal={setShowComissionModal}
        editingComission={editingComission}
        loading={loading}
      />
      <Modal
        title="Comissões"
        open={showComissionModal}
        footer={null}
        onCancel={() => {
          setShowComissionModal(false);
        }}
        destroyOnClose
        width={800}
        style={{ left: 100 }}
        bodyStyle={{ maxHeight: '80vh' }}
      >
        <div>
          <Button
            type="primary"
            onClick={() => {
              setShowComissionModal(false);
              setShowCreateComissionModal(true);
            }}
            style={{ marginBottom: 10 }}
          >
            Criar nova comissão
          </Button>
          <ContentTable>
            <Table
              columns={columnsComission}
              loading={loading}
              dataSource={Array.isArray(comission) ? comission : []}
              pagination={false}
              rowKey={(_, index) => String(index || 0)}
            />
          </ContentTable>
        </div>
      </Modal>
    </div>
  );
};
