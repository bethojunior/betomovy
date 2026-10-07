import { useContext, useEffect, useState } from "react";
import { IoIosSearch } from "react-icons/io";
import { ICallGroupProps } from "../ListCallGroups/types";
import { AxiosError } from "axios";
import api from "../../../../../services/api";
import { Button, Input, Pagination, Select, Table, TableProps } from "antd";
import { theme_colors } from "../../../../../theme/theme";
import {
  ContentSelectCallGroups,
  ContentTable,
  Container,
  ContentActions,
  Avatar,
  ContentPagination,
} from "./styles";
import { ILinkedDrivers } from "./types";
import { TfiUnlink } from "react-icons/tfi";
import { Constants } from "@/utils/constants";
import AuthContext from "../../../../../contexts/auth";
import { CONFIGURACAO } from "../../../../../constants/permissions";
import { useHistory } from "react-router-dom";

let last_page: number | null = null;

export function LinkedDrivers() {
  const [loadingCallGroups, setLoadingCallGroups] = useState<boolean>(false);
  const [listCallGroups, setListCallGroups] = useState<ICallGroupProps[]>([]);
  const [idCallGroup, setIdCallGroup] = useState<number | null>(null);
  const [listLinkedDrivers, setListLinkedDrivers] = useState<ILinkedDrivers[]>(
    []
  );
  const [nameDriver, setNameDriver] = useState<string>("");

  const baseImageLink = Constants.url_photo_driver;
  const iconClient = import.meta.env.S3_LINK;

  const { hasPermission } = useContext(AuthContext);

  const history = useHistory();

  useEffect(() => {
    if (!hasPermission(CONFIGURACAO, "grupo_chamado")) {
      history.push("/");
    }
  }, []);

  const getCallGroups = async () => {
    try {
      setLoadingCallGroups(true);
      const responseCallGroup = await api.get("callGroup");

      if (responseCallGroup?.status) {
        setListCallGroups(responseCallGroup?.data?.response);
        setIdCallGroup(responseCallGroup?.data?.response[0].id ?? null);
      }
    } catch (error) {
      const responseError = error as AxiosError;
      swal({
        title: "Erro",
        icon: "error",
        text: responseError.response?.data.response[0],
      });
    } finally {
      setLoadingCallGroups(false);
    }
  };

  const handleChangeCallGroup = (idCallGroup: number) => {
    setIdCallGroup(idCallGroup);
    handleSearchLinkedDriver(idCallGroup);
  };

  const handleSearchLinkedDriver = async (
    idCallGroup: number | null,
    currentPage = 1
  ) => {
    if (!idCallGroup) return false;

    try {
      setLoadingCallGroups(true);
      const responseSearchLinkedDrivers = await api.get(
        `callGroup/linkedDrivers/${idCallGroup}`,
        {
          params: {
            page: currentPage,
          },
        }
      );

      if (responseSearchLinkedDrivers.status) {
        setListLinkedDrivers(
          responseSearchLinkedDrivers?.data?.response?.data ?? []
        );
        last_page = responseSearchLinkedDrivers?.data?.response?.last_page;
      }
    } catch (error) {
      const responseError = error as AxiosError;
      swal({
        title: "Erro",
        icon: "error",
        text: responseError.response?.data.response[0],
      });
    } finally {
      setLoadingCallGroups(false);
    }
  };

  const handleSearchDriverByCallGroup = async () => {
    try {
      setLoadingCallGroups(true);
      const responseDrivers = await api.get(`callGroup/searchDriver`, {
        params: {
          nameDriver,
          idCallGroup,
        },
      });

      if (responseDrivers?.status) {
        setListLinkedDrivers(responseDrivers?.data?.response?.data ?? []);
      }
    } catch (error) {
      const responseError = error as AxiosError;
      swal({
        title: "Erro",
        icon: "error",
        text: responseError.response?.data.response[0],
      });
    } finally {
      setLoadingCallGroups(false);
    }
  };

  const handleUnlinkDrivers = (linkedDrivers: ILinkedDrivers) => {
    swal({
      title: "Você tem certeza que deseja desvincular esse motorista?",
      icon: "warning",
      buttons: ["Cancelar", "Confirmar"],
      dangerMode: true,
    }).then((success) => {
      if (success) {
        api
          .post(`callGroup/unlinkDriver`, {
            idDriver: linkedDrivers?.drivers?.idDriver,
            idCallGroup,
          })
          .then((response) => {
            if (response.status) {
              swal({
                title: "Sucesso",
                icon: "success",
                text: "Motorista desvinculado com sucesso",
              });
            }

            handleSearchLinkedDriver(idCallGroup);
          })
          .catch((error) => {
            const responseError = error as AxiosError;
            swal({
              title: "Erro",
              icon: "error",
              text: responseError.response?.data.response[0],
            });
          });
      }
    });
  };

  useEffect(() => {
    getCallGroups();
  }, []);

  const columns: TableProps<ILinkedDrivers>["columns"] = [
    {
      key: "id",
      title: "Id",
      dataIndex: "id",
      render: (_, linkedDrivers) => <h3>{linkedDrivers?.drivers?.idDriver}</h3>,
    },
    {
      key: "profileImage",
      title: "Foto",
      render: (_, linkedDrivers) => (
        <Avatar
          src={baseImageLink + linkedDrivers?.drivers?.profileImage}
          onError={(e: any) => {
            e.currentTarget.onerror = null;
            e.currentTarget.src = `${iconClient}default.jpg`;
          }}
        />
      ),
    },
    {
      key: "name",
      title: "Nome Motorista",
      render: (_, linkedDrivers) => (
        <div>{linkedDrivers?.drivers?.user?.name}</div>
      ),
    },
    {
      key: "email",
      title: "email",
      render: (_, linkedDrivers) => (
        <div>{linkedDrivers?.drivers?.user?.email}</div>
      ),
    },
    {
      key: "phone",
      title: "Telefone",
      render: (_, linkedDrivers) => (
        <div>{linkedDrivers?.drivers?.user?.phone}</div>
      ),
    },
    {
      key: "actions",
      title: "Ações",
      render: (_, linkedDrivers) => (
        <ContentActions>
          <Button
            onClick={() => handleUnlinkDrivers(linkedDrivers)}
            title="Desvincular Motorista"
            icon={<TfiUnlink style={{ color: theme_colors.primary_antd }} />}
          />
        </ContentActions>
      ),
    },
  ];

  useEffect(() => {
    if (idCallGroup) {
      handleSearchLinkedDriver(idCallGroup);
    }
  }, [idCallGroup]);

  const listCallGroupsFormated = listCallGroups.map((callGroups) => {
    return {
      label: callGroups.name,
      value: callGroups.id,
    };
  });

  return (
    <Container>
      <ContentSelectCallGroups>
        <Select
          style={{
            width: "100%",
            maxWidth: "320px",
          }}
          options={listCallGroupsFormated}
          value={idCallGroup}
          loading={loadingCallGroups}
          placeholder="Grupos de chamado"
          onChange={handleChangeCallGroup}
        />
      </ContentSelectCallGroups>

      <ContentTable>
        {idCallGroup ? (
          <>
            <ContentSelectCallGroups>
              <Input
                style={{
                  width: "100%",
                  maxWidth: "320px",
                }}
                placeholder="Nome do motorista"
                onChange={(event) => setNameDriver(event?.target?.value)}
                value={nameDriver}
              />
              <Button
                type="primary"
                icon={<IoIosSearch color={theme_colors.white} />}
                onClick={() => handleSearchDriverByCallGroup()}
              />
            </ContentSelectCallGroups>
          </>
        ) : null}
        <Table
          columns={columns}
          dataSource={listLinkedDrivers}
          pagination={false}
        />
      </ContentTable>

      {last_page && (
        <ContentPagination>
          <Pagination
            defaultCurrent={1}
            total={last_page * 10}
            onChange={(currentPage) =>
              handleSearchLinkedDriver(idCallGroup, currentPage)
            }
          />
        </ContentPagination>
      )}
    </Container>
  );
}
