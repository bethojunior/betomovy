import { Table, Tag, Pagination, Button, Input } from "antd";
import { ColumnsType } from "antd/lib/table";
import { AiOutlineInbox } from "react-icons/ai";
import { FaTrash, FaUndo, FaSearch, FaRedo } from "react-icons/fa";
import { IoLogoWhatsapp } from "react-icons/io";
import swal from "sweetalert";
import { useState, useMemo } from "react";
import {
  Container,
  ContentHeader,
  ContentTable,
  ContactCell,
  PhoneText,
  ContentBtnActions,
  WhatsAppButton,
  EmptyState,
  ContentPagination,
} from "./styles";
import { AccountDeletionRequestItem, AccountDeletionRequestsProps, AlertType } from "./types";
import { useAccountDeletionRequests } from "../../../hooks/useAccountDeletionRequests";
import { theme_colors } from "../../../theme/theme";
import Alert from "../../Utils/Alert";
import { PlatformInfo } from "../../Utils/PlatformInfo";
import Mask from "../../../services/Mask";
import { generateWhatsAppUrl } from "../../../utils/whatsappUtils";

export const AccountDeletionRequests = ({ type }: AccountDeletionRequestsProps) => {
  const { data, pagination, loading, page, goToPage, approve, cancel } =
    useAccountDeletionRequests(type);

  const [messageAlert, setMessageAlert] = useState("");
  const [showAlert, setShowAlert] = useState(false);
  const [typeAlert, setTypeAlert] = useState<AlertType>("success");
  const [searchTerm, setSearchTerm] = useState("");

  const filteredData = useMemo(() => {
    if (!data) return [];
    if (!searchTerm.trim()) return data;
    const term = searchTerm.toLowerCase();
    return data.filter(
      (item) =>
        item.userName?.toLowerCase().includes(term) ||
        item.userPhone?.toLowerCase().includes(term) ||
        item.reason?.toLowerCase().includes(term) ||
        item.details?.toLowerCase().includes(term)
    );
  }, [data, searchTerm]);

  const renderAlert = (alertType: AlertType, message: string) => {
    setTypeAlert(alertType);
    setMessageAlert(message);
    setShowAlert(true);
  };

  const handleApprove = (record: AccountDeletionRequestItem) => {
    swal({
      title: "Deseja excluir definitivamente essa conta?",
      text: "Essa ação não poderá ser desfeita.",
      icon: "warning",
      buttons: ["Cancelar", "Excluir"],
      dangerMode: true,
    }).then(async (confirmed) => {
      if (!confirmed) return;

      const success = await approve(record.userId).catch(() => false);
      renderAlert(
        success ? "success" : "error",
        success ? "Usuário excluído com sucesso!" : "Erro ao excluir usuário!"
      );
    });
  };

  const handleCancel = (record: AccountDeletionRequestItem) => {
    swal({
      title: "Deseja cancelar essa solicitação de exclusão?",
      text: "O perfil continuará ativo.",
      icon: "warning",
      buttons: ["Voltar", "Cancelar solicitação"],
    }).then(async (confirmed) => {
      if (!confirmed) return;

      const success = await cancel(record.userId).catch(() => false);
      renderAlert(
        success ? "success" : "error",
        success
          ? "Solicitação cancelada! O perfil continua ativo."
          : "Erro ao cancelar a solicitação!"
      );
    });
  };

  const columns: ColumnsType<AccountDeletionRequestItem> = [
    {
      title: "Descrição",
      dataIndex: "reason",
      key: "reason",
      width: 130,
      ellipsis: true,
    },
    {
      title: "Detalhes",
      dataIndex: "details",
      key: "details",
      ellipsis: true,
      render: (details: string) => details || "-",
    },
    {
      title: "Data",
      dataIndex: "created_at",
      key: "created_at",
      width: 140,
      render: (createdAt: string) => {
        if (!createdAt) return '-';
        const str = String(createdAt).replace(' ', 'T');
        const d = new Date(str);
        return isNaN(d.getTime()) ? String(createdAt) : d.toLocaleString('pt-BR');
      },
    },
    {
      title: "Usuário",
      dataIndex: "userName",
      key: "userName",
      width: 140,
      ellipsis: true,
    },
    {
      title: "Plataforma",
      dataIndex: "platform",
      key: "platform",
      width: 110,
      render: (platform: string) => <PlatformInfo platform={platform} />,
    },
    {
      title: "Contato",
      dataIndex: "userPhone",
      key: "userPhone",
      width: 170,
      render: (userPhone: string) =>
        userPhone ? (
          <ContactCell>
            <WhatsAppButton
              href={generateWhatsAppUrl(userPhone)}
              target="_blank"
              rel="noopener noreferrer"
              title="Conversar no WhatsApp"
            >
              <IoLogoWhatsapp />
            </WhatsAppButton>
            <PhoneText>{Mask.setMaskPhoneValue(userPhone)}</PhoneText>
          </ContactCell>
        ) : (
          <PhoneText>Telefone não informado</PhoneText>
        ),
    },
    {
      title: "Ações",
      key: "acoes",
      width: 100,
      render: (_: unknown, record: AccountDeletionRequestItem) => (
        <ContentBtnActions>
          <Button
            title="Cancelar solicitação e manter o perfil ativo"
            onClick={() => handleCancel(record)}
            icon={<FaUndo style={{ color: theme_colors.green }} />}
          />
          <Button
            title="Excluir definitivamente a conta"
            onClick={() => handleApprove(record)}
            icon={<FaTrash style={{ color: theme_colors.red_crismon }} />}
          />
        </ContentBtnActions>
      ),
    },
  ];

  return (
    <Container>
      <Alert
        visibility={showAlert}
        message={messageAlert}
        typeAlert={typeAlert}
        setVisibility={setShowAlert}
      />

      <ContentHeader style={{ display: "flex", justifyContent: "space-between", alignItems: "center", flexWrap: "wrap", gap: 12 }}>
        <div style={{ display: "flex", alignItems: "center", gap: 10 }}>
          <Input
            placeholder="Pesquisar por nome, telefone ou motivo..."
            prefix={<FaSearch style={{ color: "#94a3b8", marginRight: 6 }} />}
            value={searchTerm}
            onChange={(e) => setSearchTerm(e.target.value)}
            allowClear
            style={{ width: 320, borderRadius: 6 }}
          />
        </div>
        <div>
          {pagination && <Tag color="green" style={{ fontSize: 13, padding: "4px 10px" }}>{pagination.total} pendente(s)</Tag>}
        </div>
      </ContentHeader>

      <ContentTable>
        {filteredData?.length ? (
          <Table
            dataSource={filteredData}
            columns={columns}
            rowKey="id"
            pagination={false}
            loading={loading}
            tableLayout="fixed"
          />
        ) : (
          <EmptyState>
            <AiOutlineInbox />
            <span>Nenhuma solicitação pendente</span>
          </EmptyState>
        )}
      </ContentTable>

      {pagination && pagination.last_page > 1 && (
        <ContentPagination>
          <Pagination
            total={pagination.last_page * 10}
            showSizeChanger={false}
            current={page}
            onChange={goToPage}
          />
        </ContentPagination>
      )}
    </Container>
  );
};
