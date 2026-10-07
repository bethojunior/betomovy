import { Button } from "antd";
import { FC, useEffect, useState } from "react";
import { MdModeEdit } from "react-icons/md";

import { TableContainer, TableData } from "./styled";

import PendencyDriverModal from "../../../../components/Advanced/Config/PendencyDriverModal";
      
import api from "../../../../services/api";

interface PenaltiesType extends Array<PenaltiesTypeData> {}

interface PenaltiesTypeData {
  idUserPenaltyType: number;
  name: string;
  statusId: number;
  valueRating: number;
}

const PendencyDriver: FC = () => {
       
  const [loadingTable, setLoadingTable] = useState<boolean>(false);
  const [penaltiesTypeList, setPenaltiesTypeList] = useState<PenaltiesType>();
  const [isModalVisible, setIsModalVisible] = useState(false);
  const [pendacyId, setPendecyId] = useState(0);

  const penaltiesTypeRequest = () => {
    setLoadingTable(true);
    api.get(`userPenaltiesType`).then((result) => {
      setLoadingTable(false);
      setPenaltiesTypeList(result.data.response);
    });
  };

  useEffect(() => {
    penaltiesTypeRequest();
  }, []);

  const columns = [
    {
      title: "Descrição",
      dataIndex: "name",
      key: "idUserPenaltyType",
      width: 200,
      ellipsis: true,
    },
    {
      title: "Penalidade",
      dataIndex: "valueRating",
      key: "description",
      width: 150,
      ellipsis: true,
    },
    {
      title: "Editar",
      key: "actions",
      width: 100,
      ellipsis: true,
      render: (item: PenaltiesTypeData) => (
        <Button
          style={{
            color: "#1677ff",
          }}
          onClick={() => {
            setIsModalVisible(true);
            setPendecyId(item.idUserPenaltyType);
          }}
          icon={<MdModeEdit />}
        ></Button>
      ),
    },
  ];

  return (
    <div>
      <PendencyDriverModal
        isModalVisible={isModalVisible}
        setIsModalVisible={setIsModalVisible}
        pendacyId={pendacyId}
        penaltiesTypeRequest={penaltiesTypeRequest}
      />
       
      <TableContainer>
        <TableData
          rowKey="idUserPenaltyType"
          dataSource={penaltiesTypeList}
          columns={columns}
          pagination={false}
          loading={loadingTable}
        />
      </TableContainer>
    </div>
  );
};

export default PendencyDriver;
