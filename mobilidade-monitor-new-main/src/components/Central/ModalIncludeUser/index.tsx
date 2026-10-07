import { FC, useEffect, useState } from "react";
import { Button, Checkbox, Modal } from "antd";
import api from "../../../services/api";
import { useDebounce } from "../../../hooks/useDebounce";
import { SelectSearch } from "../../SelectSearch";

interface Props {
  visible: boolean;
  setVisible: (visible: boolean) => void;
  setShowUsersModal: (showUsersModal: boolean) => void;
  includesUsers: (isAdmin: boolean, userId: number) => void;
}

export const IncludesUsersModal: FC<Props> = ({
  visible,
  setVisible,
  setShowUsersModal,
  includesUsers,
}) => {
  const [selectedUserId, setSelectedUserId] = useState("");
  const [isAdmin, setIsAdmin] = useState(false);
  const [eligibleUsers, setEligibleUsers] = useState<DefaultOptionsSelectAntdProps[]>([]);
  const [eligibleLoading, setEligibleLoading] = useState(false);
  const [eligiblePage, setEligiblePage] = useState(1);
  const [eligibleSearch, setEligibleSearch] = useState("");
  const [eligibleHasMore, setEligibleHasMore] = useState(true);
  const [addingUser, setAddingUser] = useState(false);

  const searchEligibleUsers = async (search: string, page: number) => {
    setEligibleLoading(true);
    try {
      const { data } = await api.get("central/user/eligible", { params: { search, page } });
      const results = (data.response?.data ?? []).map((user: any) => ({
        value: String(user.id),
        label: `${user.text} (${user.email})`,
      }));
      setEligibleUsers((prev) => (page === 1 ? results : [...prev, ...results]));
      setEligibleHasMore(Boolean(data.response?.next_page_url));
      setEligiblePage(page);
      setEligibleSearch(search);
    } finally {
      setEligibleLoading(false);
    }
  };

  const debouncedSearchEligibleUsers = useDebounce((search: string) => searchEligibleUsers(search, 1), 500);

  const handleSearchEligibleUsers = (search: string) => {
    setEligibleLoading(true);
    debouncedSearchEligibleUsers(search);
  };

  const handleEligibleScroll = (event: React.UIEvent<HTMLDivElement>) => {
    const target = event.currentTarget;
    const nearBottom = target.scrollTop + target.clientHeight >= target.scrollHeight - 24;

    if (nearBottom && eligibleHasMore && !eligibleLoading) {
      searchEligibleUsers(eligibleSearch, eligiblePage + 1);
    }
  };

  useEffect(() => {
    if (visible) {
      searchEligibleUsers("", 1);
    }
  }, [visible]);

  const handleClose = async () => {
    setVisible(false);
    setShowUsersModal(true);
    setSelectedUserId("");
    setIsAdmin(false);
    setEligibleUsers([]);
    setEligiblePage(1);
    setEligibleSearch("");
    setEligibleHasMore(true);
    setAddingUser(false);
  };

  const handleAdd = () => {
    if (!selectedUserId) return;

    setAddingUser(true);
    handleClose();
    includesUsers(isAdmin, parseInt(selectedUserId));
  };

  return (
    <Modal
      title="Adicionar usuário na central"
      open={visible}
      footer={null}
      onCancel={handleClose}
      destroyOnClose
    >
      <div style={{ display: "flex", flexDirection: "column", gap: 12 }}>
        <SelectSearch
          placeholder="Buscar usuário"
          options={eligibleUsers}
          onSearch={handleSearchEligibleUsers}
          onChange={setSelectedUserId}
          onPopupScroll={handleEligibleScroll}
          loading={eligibleLoading}
          width="100%"
          value={selectedUserId}
        />

        <Checkbox checked={isAdmin} onChange={(e) => setIsAdmin(e.target.checked)}>
          Administrador
        </Checkbox>

        <Button
          type="primary"
          onClick={handleAdd}
          disabled={!selectedUserId}
          loading={addingUser}
        >
          Adicionar
        </Button>
      </div>
    </Modal>
  );
};
