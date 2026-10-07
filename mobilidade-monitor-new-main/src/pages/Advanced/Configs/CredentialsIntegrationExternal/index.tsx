import { useState, useEffect } from "react";
import {
  StyledInput,
  StyledSelect,
  Container,
  ContentInput,
  LabelText,
  StyledButton,
  StyledButtonNewCredencial,
  DeleteButton,
  ContentForm,
  FieldContainer,
  ActionContainer,
  Loader,
} from "./styles";
import swal from "sweetalert";
import api from "../../../../services/api";
import Preload from "../../../../components/Utils/Preload";
import { Modal } from "antd";
import { isValidURL } from "../../../../utils/IsValidUrl";

interface Credential {
  id: string;
  tokenName: string;
  apiLink: string;
  actionName: string;
  tokenValue: string;
}

export const CredentialsIntegrationExternal = () => {
  const [loading, setLoading] = useState<boolean>(false);
  const [credentials, setCredentials] = useState<Credential[]>([]);
  const [initialCredentials, setInitialCredentials] = useState<Credential[]>([]);

  const fetchExistingCredentials = async () => {
    setLoading(true);
    try {
      const response = await api.get("integration-partners");
  
      if (response.status === 200 && Array.isArray(response.data.response)) {
        const existingCredentials = response.data.response.map((cred: any) => ({
          id: String(cred.id || ""),
          tokenName: String(cred.name || ""),
          apiLink: String(cred.url || ""),
          actionName: String(cred.action || ""),
          tokenValue: String(cred.token || ""),
        }));
        setCredentials(existingCredentials);
        setInitialCredentials(JSON.parse(JSON.stringify(existingCredentials)));
      }
    } catch (error) {
      console.error("Erro ao buscar credenciais:", error);
    } finally {
      setLoading(false);
    }
  };
  
  const addNewCredential = () => {
    const newCredential = { id: "", tokenName: "", apiLink: "", actionName: "", tokenValue: "" };
    setCredentials([...credentials, newCredential]);
    setInitialCredentials([...initialCredentials, { ...newCredential }]);
  };
  
  useEffect(() => {
    fetchExistingCredentials();
  }, []);
  const handleChange = (
    index: number,
    field: keyof Credential,
    value: string
  ) => {
    const newCredentials = [...credentials];
    newCredentials[index][field] = value;
    setCredentials(newCredentials);
  };

  const handleCreate = async (index: number) => {
    setLoading(true);
    const credential = credentials[index];

    const payload = {
      token: credential.tokenValue,
      action: credential.actionName,
      name: credential.tokenName,
      url: credential.apiLink,
    };

    try {
      const response = await api.post("integration-partners", payload);

      if (response.status === 200) {
        swal({
          title: "Sucesso!",
          text: "Nova credencial criada com sucesso!",
          icon: "success",
        }).then(() => {
          window.location.reload();
        });

        setCredentials((prevCredentials) =>
          prevCredentials.map((cred, i) =>
            i === index
              ? {
                  ...cred,
                  id: response.data.id,
                  tokenName: response.data.name || cred.tokenName,
                  apiLink: response.data.url || cred.apiLink,
                  actionName: response.data.action || cred.actionName,
                  tokenValue: response.data.token || cred.tokenValue,
                }
              : cred
          )
        );
      } else {
        swal({
          title: "Erro!",
          text: "Houve um problema ao criar a nova credencial.",
          icon: "error",
        });
      }
    } catch (error) {
      console.error(error);
      swal({
        title: "Erro!",
        text: "Ocorreu um erro ao fazer a requisição.",
        icon: "error",
      });
    } finally {
      setLoading(false);
    }
  };

  const handleEdit = async (index: number) => {

    const credential = credentials[index];
    const initialCredential = initialCredentials[index];

    if (
      credential.tokenName === initialCredential.tokenName &&
      credential.apiLink === initialCredential.apiLink &&
      credential.actionName === initialCredential.actionName &&
      credential.tokenValue === initialCredential.tokenValue
    ) {
      swal({
        title: "Nenhuma alteração detectada!",
        text: "Por favor, modifique algum campo antes de salvar.",
        icon: "info",
      });
      return;
    }

    setLoading(true);
    const payload = {
      token: credential.tokenValue,
      action: credential.actionName,
      name: credential.tokenName,
      url: credential.apiLink,
    };

    try {
      const response = await api.put(`integration-partners/${credential.id}`, payload);

      if (response.status === 200) {
        swal({
          title: "Sucesso!",
          text: "Dados atualizados com sucesso!",
          icon: "success",
        });

        const updatedCredentials = [...credentials];
        updatedCredentials[index] = {
          ...credential,
          tokenName: response.data.name || credential.tokenName,
          apiLink: response.data.url || credential.apiLink,
          actionName: response.data.action || credential.actionName,
          tokenValue: response.data.token || credential.tokenValue,
        };
        setCredentials(updatedCredentials);

        setInitialCredentials((prevInitial) => {
          const newInitial = [...prevInitial];
          newInitial[index] = { ...updatedCredentials[index] };
          return newInitial;
        });
      } else {
        swal({
          title: "Erro!",
          text: "Houve um problema ao atualizar os dados.",
          icon: "error",
        });
      }
    } catch (error) {
      console.error(error);
      swal({
        title: "Erro!",
        text: "Ocorreu um erro ao fazer a requisição.",
        icon: "error",
      });
    } finally {
      setLoading(false);
    }
  };

  const handleSubmit = async (index: number) => {

    const credential = credentials[index];
    if (!credential.tokenName || !credential.apiLink || !credential.actionName || !credential.tokenValue) {
        swal({
            title: "Campos obrigatórios em branco!",
            text: "Por favor, preencha todos os campos antes de salvar.",
            icon: "warning",
        });
        return;
    }


    if (!isValidURL(credential.apiLink)) {
        swal({
            title: "URL inválida!",
            text: "Por favor, insira uma URL válida no campo Link da API.",
            icon: "warning",
        });
        return;
    }

    if (credential.id) {
        await handleEdit(index);
    } else {
        await handleCreate(index);
    }
};


  const handleDelete = async (index: number) => {
    const credential = credentials[index];

    const isCredentialEmpty =
      !credential.tokenName &&
      !credential.apiLink &&
      !credential.actionName &&
      !credential.tokenValue;

    if (!credential.id || isCredentialEmpty) {
      const updatedCredentials = credentials.filter((_, i) => i !== index);
      setCredentials(updatedCredentials);
      return;
    }

    Modal.confirm({
      title: "Tem certeza que deseja excluir esta credencial?",
      content: "Esta ação não pode ser desfeita.",
      okText: "Sim",
      okType: "danger",
      cancelText: "Cancelar",
      onOk: async () => {
        setLoading(true);

        try {
          const response = await api.delete(
            `integration-partners/${credential.id}`
          );

          if (response.status === 200) {
            swal({
              title: "Sucesso!",
              text: "Credencial excluída com sucesso!",
              icon: "success",
            });

            const updatedCredentials = credentials.filter(
              (_, i) => i !== index
            );
            setCredentials(updatedCredentials);
          } else {
            swal({
              title: "Erro!",
              text: "Houve um problema ao excluir a credencial.",
              icon: "error",
            });
          }
        } catch (error) {
          console.error(error);
          swal({
            title: "Erro!",
            text: "Ocorreu um erro ao fazer a requisição.",
            icon: "error",
          });
        } finally {
          setLoading(false);
        }
      },
    });
  };

  if (loading) return <Loader spinning />;

  return (
    <Container>
      <Preload visible={loading} />

      <div
        style={{
          display: "flex",
          width: "100%",
          justifyContent: "start",
          marginBottom: "16px",
        }}
      >
        <StyledButtonNewCredencial type="primary" onClick={addNewCredential}>
          Adicionar nova credencial
        </StyledButtonNewCredencial>
      </div>

      {credentials.map((credential, index) => (
        <ContentForm key={index} style={{ marginBottom: "16px" }}>
          <ContentInput>
            <FieldContainer>
              <LabelText>Nome do Token</LabelText>
              <StyledInput
                value={credential.tokenName}
                onChange={(e) => handleChange(index, "tokenName", e.target.value)}
              />
            </FieldContainer>
            <FieldContainer>
              <LabelText>Link da API</LabelText>
              <StyledInput
                value={credential.apiLink}
                onChange={(e) => handleChange(index, "apiLink", e.target.value)}
              />
            </FieldContainer>
            <FieldContainer>
              <LabelText>Ação</LabelText>
              <StyledSelect
                value={credential.actionName}
                onChange={(value) => handleChange(index, "actionName", value as string)}
                placeholder="Selecione uma ação"
              >
                <StyledSelect.Option value="Todas as atualizações de corrida">
                  Todas as atualizações de corrida
                </StyledSelect.Option>
              </StyledSelect>
            </FieldContainer>
            <FieldContainer>
              <LabelText>Token</LabelText>
              <StyledInput
                value={credential.tokenValue}
                onChange={(e) => handleChange(index, "tokenValue", e.target.value)}
              />
            </FieldContainer>
          </ContentInput>
          <ActionContainer>
              <StyledButton type="primary" onClick={() => handleSubmit(index)}>
                  {credential.id ? "Editar" : "Salvar"}
              </StyledButton>
              <DeleteButton onClick={() => handleDelete(index)}>
                  Excluir
              </DeleteButton>
          </ActionContainer>
        </ContentForm>
      ))}
    </Container>
  );
};