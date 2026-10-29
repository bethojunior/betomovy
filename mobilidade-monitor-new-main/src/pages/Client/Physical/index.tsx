import { FC, useContext } from "react";
import { BsLockFill } from "react-icons/bs";
import { HiPencil, HiDocument } from "react-icons/hi";
import { GiTicket } from "react-icons/gi";
import { AiFillDelete } from "react-icons/ai";
import { IoMdKeypad } from "react-icons/io";
import { FaUsers, FaMoneyBillWave } from "react-icons/fa";
import { BiNotepad } from "react-icons/bi";
import { MdVerifiedUser } from "react-icons/md";
import { Menu, Select } from "antd";
import Edition from "../../../components/Client/PhysicalPerson/Modal/Edition";
import Documents from "../../../components/Client/PhysicalPerson/Modal/Documents";
import Voucher from "../../../components/Client/PhysicalPerson/Modal/Voucher";
import Annotation from "../../../components/Client/PhysicalPerson/Modal/Annotation";
import Dependents from "../../../components/Client/PhysicalPerson/Modal/Dependents";
import ListCLientComponent from "../../../components/Client/PhysicalPerson/Card/index";
import Preload from "../../../components/Utils/Preload";
import Alert from "../../../components/Utils/Alert";
import {
  ItemMenuSettings,
  ItemMenuSettingsDanger,
  Researches,
  Div,
  SearchLabel,
  SearchInput,
  AllRadios,
  Radios,
  StatusLabel,
  SelectListStatus,
  InstructionsLottie,
  ShowMoreButton,
  Body,
  ContainerClient,
  ContentIconSearch,
  MsgObservation,
  ContentInstructionsSearch,
} from "./styles";
import { ListClient } from "../../../components/Client/PhysicalPerson/Modal/Edition/type";
import { ListClientFormProps } from "./types";
import { useClientPhysicalList } from "../../../hooks/useClientPhysicalList";

import pathIconSearch from "../../../assets/animations/icon-search-list.json";
import { Loader } from "../../../components/Loader";
import AuthContext from "../../../contexts/auth";
import { ZAFIRA, ZAFIRA_VALIDAR_CADASTRO } from "../../../constants/permissions";
import { useZafiraEnabled } from "../../../hooks/useZafiraEnabled";

const { Option } = Select;

const ClientList: FC = () => {
  const { hasPermission } = useContext(AuthContext);
  const { enableZafiraValidationMonitor } = useZafiraEnabled();

  const {
    infosListClient,
    filterLoading,
    hasPagination,
    filters: { search, radio },
    setSearch,
    setRadio,
    setStatus,
    onSearch,
    fetchMore,
    StatusToSearch,
    whatsappMessage,
    baseImageCustomer,
    isMilitary,
    canDeletePhysicalClient,
    dependentsClient,
    annotations,
    setAnnotations,
    loading,
    setLoading,
    showAlert,
    setShowAlert,
    messageAlert,
    typeAlert,
    isModalVisible,
    voucherModal,
    setVoucherModal,
    documentsVisible,
    modalOfDependents,
    annotationsModal,
    customer,
    customerEdit,
    userId,
    customerId,
    showModal,
    showVoucherModal,
    showAnnotationsModal,
    openDocuments,
    handleCancel,
    blockClient,
    resetPassword,
    annotationsClient,
    deleteClient,
    clientsDependents,
    validateCustomerRegistration,
  } = useClientPhysicalList();

  const menu = (item: ListClient) => (
    <Menu>
      <ItemMenuSettings key="1" onClick={() => showModal(item)}>
        <HiPencil />
        Editar
      </ItemMenuSettings>
      <ItemMenuSettings
        key="2"
        onClick={() => openDocuments(item)}
      >
        <HiDocument /> Documentos
      </ItemMenuSettings>
      <ItemMenuSettings
        key="3"
        onClick={() => blockClient(item.idCustomer, item.status)}
      >
        <BsLockFill /> {item.status === "ATIVO" ? "Bloquear" : "Desbloquear"}
      </ItemMenuSettings>
      <ItemMenuSettings key="4" onClick={() => resetPassword(item.idCustomer)}>
        <IoMdKeypad /> Zerar senha
      </ItemMenuSettings>
      <ItemMenuSettings key="5" onClick={() => showVoucherModal(item)}>
        <FaMoneyBillWave /> Movimentar Saldo / Voucher
      </ItemMenuSettings>
      {enableZafiraValidationMonitor && hasPermission(ZAFIRA, ZAFIRA_VALIDAR_CADASTRO) && (
        <ItemMenuSettings
          key="5a"
          onClick={() => validateCustomerRegistration(item.idCustomer)}
        >
          <MdVerifiedUser /> Validar Cadastro
        </ItemMenuSettings>
      )}
      <ItemMenuSettings key="6" onClick={() => showAnnotationsModal(item)}>
        <BiNotepad /> Anotações
      </ItemMenuSettings>
      {isMilitary && (
        <ItemMenuSettings
          key="7"
          onClick={() => clientsDependents(item.idCustomer)}
        >
          <FaUsers /> Ver Dependentes
        </ItemMenuSettings>
      )}
      {canDeletePhysicalClient && (
        <ItemMenuSettingsDanger key="8" onClick={() => deleteClient(item.idUser)}>
          <AiFillDelete /> Excluir
        </ItemMenuSettingsDanger>
      )}
    </Menu>
  );

  return (
    <Body>
      <Alert
        visibility={showAlert}
        setVisibility={setShowAlert}
        message={messageAlert}
        typeAlert={typeAlert}
      />
      <Preload visible={loading || filterLoading} />
      <Researches>
        <Div>
          <SearchLabel>Buscar</SearchLabel>
          <SearchInput
            onSearch={() => onSearch()}
            onChange={(e) => setSearch(e.target.value)}
            value={search}
            enterButton
          />
          <AllRadios>
            <Radios.Group
              onChange={(e) => setRadio(e.target.value as typeof radio)}
              value={radio}
            >
              <Radios value="name">Nome</Radios>
              <Radios value="email">E-mail</Radios>
              <Radios value="document">CPF</Radios>
              <Radios value="phone">Telefone</Radios>
              <Radios value="documents">Documentos</Radios>
            </Radios.Group>
          </AllRadios>
        </Div>
        <Div>
          <StatusLabel>Status</StatusLabel>
          <SelectListStatus
            defaultValue="TODOS"
            onChange={(value) => setStatus(value as string)}
          >
            <Option value="">TODOS</Option>
            {StatusToSearch?.map((item) => (
              <Option
                value={item.idCustomerRegisterStatus}
                key={item.idCustomerRegisterStatus}
              >
                {item.name}
              </Option>
            ))}
          </SelectListStatus>
        </Div>
      </Researches>
      <MsgObservation>
        Dados referentes à toda experiência do cliente, incluído cadastro em
        outras cidade/região mas tiveram viagem.
      </MsgObservation>
      <Documents
        idUser={userId}
        idCustomer={customerId}
        handleCancelProps={handleCancel}
        visibility={documentsVisible}
      />
      <Voucher
        voucherModalProps={voucherModal}
        handleCancelProps={handleCancel}
        customerProps={customer}
        setLoadingProps={setLoading}
        onSearchProps={() => onSearch()}
        setVoucherModalProps={setVoucherModal}
      />
      <Annotation
        annotationsModalProps={annotationsModal}
        handleCancelProps={handleCancel}
        customerProps={customer}
        annotationsClientProps={annotationsClient}
        annotationsProps={annotations}
        setAnnotationsProps={setAnnotations}
      />
      <Dependents
        modalOfDependentsProps={modalOfDependents}
        handleCancelProps={handleCancel}
        dependentsClientProps={dependentsClient}
      />
      <Loader spinning={loading || filterLoading}>
        {!infosListClient ? (
          <div>
            <ContentIconSearch>
              <InstructionsLottie loop animationData={pathIconSearch} />
            </ContentIconSearch>
            <ContentInstructionsSearch>
              <div>
                <h3>Como usar:</h3>
                <div>
                  <span>1 - Digite o que deseja localizar no campo buscar.</span>
                  <span>
                    2 - Selecione o tipo de busca nas opções logo abaixo do seu
                    texto, pode fazer buscas por nome, email, documento e telefone
                    e etc...
                  </span>
                  <span>
                    3 - Ao lado do campo <strong>BUSCAR</strong>, vai encontrar as
                    opções de status, como Ativos, Bloqueados, Inativos,
                    Aguardando, etc...
                  </span>
                  <span>
                    4 - Clique na lupa e os resultados surgirão neste espaço.
                  </span>
                </div>
              </div>
            </ContentInstructionsSearch>
          </div>
        ) : (
          <ContainerClient>
            {infosListClient?.filter(Boolean).map((item) => (
              <ListCLientComponent
                baseImageLink={baseImageCustomer}
                key={item.idCustomer}
                item={item}
                menu={menu}
                message={whatsappMessage}
                enableZafiraValidationMonitor={enableZafiraValidationMonitor}
              />
            ))}
            <Edition
              item={customerEdit as ListClientFormProps}
              active={isModalVisible}
              cancelVisible={handleCancel}
              reSearch={() => onSearch()}
              statusRequest={(result: boolean) => {
                if (result) return;
                setShowAlert(result);
              }}
            />
            {hasPagination && (
              <ShowMoreButton type="primary" onClick={fetchMore}>
                Mostrar Mais
              </ShowMoreButton>
            )}
          </ContainerClient>
        )}
      </Loader>
    </Body>
  );
};

export default ClientList;
