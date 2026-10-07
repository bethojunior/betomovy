import { FC, useContext, useEffect, useState } from "react";
import { Button, Table } from "antd";
import { MdModeEdit } from "react-icons/md";

import { TableContainer, Description, Container } from "./styles";

import api from "../../../../services/api";
import UsagePolicyModal from "../../../../components/Advanced/Config/UsagePolicyModal";
import AuthContext from "../../../../contexts/auth";
import { CONFIGURACAO, POLITICA_USO_APP } from "../../../../constants/permissions";

interface TermsArray extends Array<TermsDate> {}

interface TermsDate {
  description: string;
  id: number;
  type: string;
}

const UsagePolicy: FC = () => {
  const { hasPermission } = useContext(AuthContext);
  const canManageUsagePolicy = hasPermission(CONFIGURACAO, POLITICA_USO_APP);
  const [listPolicy, setListPolicy] = useState<TermsArray>();
       
  const [loadingTable, setLoadingTable] = useState<boolean>(false);
  const [isModalVisible, setIsModalVisible] = useState(false);
  const [descriptionValue, setDescriptionValue] = useState("");
  const [typeValue, setTypeValue] = useState("");

  const usagePolicyRequest = () => {
    setLoadingTable(true);
    api.get(`termsUsePolicy`).then((result) => {
      setLoadingTable(false);
      setListPolicy(result.data.response);
    });
  };

  useEffect(() => {
    usagePolicyRequest();
  }, []);

  const columns = [
    {
      title: "Tipo",
      width: 100,
      ellipsis: true,
      render: (item: TermsDate) => (
        <Description>
          {item.type === "driver" ? "Motorista" : "Cliente"}
        </Description>
      ),
      key: "type",
    },
    {
      title: "Termos",
      width: 300,
      render: (item: TermsDate) => (
        <Description>{item.description.substring(0, 100)}</Description>
      ),
      key: "description",
    },
    {
      title: "Ações",
      width: 120,
      ellipsis: true,
      render: (item: TermsDate) => {
        if (!canManageUsagePolicy) {
          return null;
        }
        return (
          <Button
            style={{
              color: "#1677ff",
            }}
            onClick={() => {
              setIsModalVisible(true);
              setDescriptionValue(item.description);
              setTypeValue(item.type);
            }}
            icon={<MdModeEdit />}
          />
        );
      },
    },
  ];

  return (
    <Container>
       
      <UsagePolicyModal
        isModalVisible={isModalVisible}
        setIsModalVisible={setIsModalVisible}
        descriptionValue={descriptionValue}
        setDescriptionValue={setDescriptionValue}
        typeValue={typeValue}
        usagePolicyRequest={usagePolicyRequest}
      />
      <TableContainer>
        <Table pagination={false} dataSource={listPolicy} columns={columns} loading={loadingTable}/>
      </TableContainer>
    </Container>
  );
};

export default UsagePolicy;
