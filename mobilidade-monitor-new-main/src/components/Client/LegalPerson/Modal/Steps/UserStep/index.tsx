import swal from "sweetalert";
import { AxiosError } from "axios";
import { Button, Select } from "antd";
import { FC, useState } from "react";
import { AiFillDelete } from "react-icons/ai";

import {
  UserStepBody,
  Label,
  TwoSelects,
  MiddleSelectContainer,
  ButtonContainer,
  InputEdit,
  WorkersContainer,
  WorkersCard,
  LabelWorker,
  ItemWorker,
  DeleteButton,
  InfoCard,
  ContentButtonStep,
} from "./styles";

import api from "../../../../../../services/api";
import Mask from "../../../../../../services/Mask";
import { useDebounce } from "../../../../../../hooks/useDebounce";

import { ThirdStep, UserProps, LocalArrayData } from "./types";

const UserStep: FC<ThirdStep> = ({
  setUserIdProps,
  setUserNameProps,
  userEmailProps,
  setUserEmailProps,
  arrayOfWorkersProps,
  insertInArrayProps,
  setArrayOfWorkersProps,
  insertWorkersProps,
  registerOrEditProps,
  setUserPhoneProps,
  userPhoneProps,
  currentStep,
  setCurrentStep,
  handleRegisterAndEditUser,
}) => {
  const [nameUsers, setNameUsers] = useState<DefaultOptionsSelectAntdProps[]>(
    []
  );

  const [loading, setLoading] = useState<boolean>(false);
  const [addingUser, setAddingUser] = useState<boolean>(false);
  const [savingData, setSavingData] = useState<boolean>(false);

  const searchUserName = async (value: string) => {
    try {
      setLoading(true);
      const responseUsers = await api.get(`customer?name=${value}`);

      if (responseUsers.status) {
        const nameUsersFormated = responseUsers.data.response.data.map(
          (value: UserProps) => {
            return {
              value: JSON.stringify(value),
              label: value.name,
            };
          }
        );

        setNameUsers(nameUsersFormated);
      }
    } catch (error) {
      const responseError = error as AxiosError;

      swal({
        title: responseError.response?.data.message,
        icon: "error",
      });
    } finally {
      setLoading(false);
    }
  };

  const removeUser = (id: number | undefined, index: LocalArrayData) => {
    if (id) {
      api.delete(`companyWorker/${id}`);
    }
    const indexOfArray = arrayOfWorkersProps.indexOf(index);
    arrayOfWorkersProps.splice(indexOfArray, 1);
    setArrayOfWorkersProps([...arrayOfWorkersProps]);
  };

  const handleAddUser = async () => {
    setAddingUser(true);
    try {
      if (registerOrEditProps) {
        await insertWorkersProps();
      } else {
        await insertInArrayProps();
      }
    } catch (error) {
    } finally {
      setAddingUser(false);
    }
  };

  const handleSaveData = async () => {
    setSavingData(true);
    try {
      await handleRegisterAndEditUser();
    } catch (error) {
    } finally {
      setSavingData(false);
    }
  };

  const onChange = (userSelected: string) => {
    const userInformations = JSON.parse(userSelected);
    setUserIdProps(userInformations?.idUser);
    setUserNameProps(userInformations?.name);
    setUserPhoneProps(userInformations?.phone);
    setUserEmailProps(userInformations?.email);
  };

  const onSearch = useDebounce((nameSearched: string) => {
    searchUserName(nameSearched);
  }, 1000);

  const filterOption = (
    input: string,
    option?: { label: string; value: string }
  ) => (option?.label ?? "").toLowerCase().includes(input.toLowerCase());

  return (
    <UserStepBody>
      <div>
        <Label>Nome</Label>
        <Select
          style={{
            width: "100%",
          }}
          showSearch
          placeholder="Selecione um nome"
          optionFilterProp="children"
          onChange={onChange}
          onSearch={onSearch}
          filterOption={filterOption}
          options={nameUsers}
          loading={loading}
        />
      </div>
      <div>
        <Label>Email</Label>
        <InputEdit value={userEmailProps || ""} disabled />
      </div>
      <TwoSelects>
        <MiddleSelectContainer>
          <Label>Telefone</Label>
          <InputEdit
            value={Mask.setMaskPhoneValue(userPhoneProps) || ""}
            disabled
          ></InputEdit>
        </MiddleSelectContainer>
        <ButtonContainer>
          <Button
            type="primary"
            onClick={handleAddUser}
            loading={addingUser}
          >
            Adicionar
          </Button>
        </ButtonContainer>
      </TwoSelects>
      <WorkersContainer>
        {arrayOfWorkersProps?.map((item: LocalArrayData) => {
          return (
            <WorkersCard key={item.id}>
              <InfoCard>
                <div style={{ display: "flex" }}>
                  <LabelWorker>Nome:</LabelWorker>
                  <ItemWorker>{item.user.name}</ItemWorker>
                </div>
                <div style={{ display: "flex" }}>
                  <LabelWorker>Email:</LabelWorker>
                  <ItemWorker>{item.user.email}</ItemWorker>
                </div>
              </InfoCard>
              <div>
                <DeleteButton onClick={() => removeUser(item.id, item)}>
                  <AiFillDelete />
                </DeleteButton>
              </div>
            </WorkersCard>
          );
        })}
      </WorkersContainer>

      <ContentButtonStep>
        <Button onClick={() => setCurrentStep(currentStep - 1)}>Voltar</Button>
        <Button 
          type="primary" 
          onClick={handleSaveData}
          loading={savingData}
          disabled={addingUser}
        >
          Salvar
        </Button>
      </ContentButtonStep>
    </UserStepBody>
  );
};

export default UserStep;
