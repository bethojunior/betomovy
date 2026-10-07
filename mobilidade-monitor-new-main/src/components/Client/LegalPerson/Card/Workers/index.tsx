import { useState } from "react";
import { Button, Collapse, Skeleton, Table } from "antd";
import { FiUsers, FiMail, FiPhone } from "react-icons/fi";

import {
  SectionTitleRow,
  FieldIcon,
} from "../../../../Utils/EntityCard/styles";
import { SectionCard, WorkersDrop, EmptyWorkers, WorkerRow, WorkerName, PhoneCell, WhatsAppSmallIcon } from "./styles";
import { WorkersProps, WorkerListItem, CompanyWorkerResponse } from "./types";
import api from "../../../../../services/api";
import Utils from "../../../../../utils/Utils";
import Mask from "../../../../../services/Mask";
import IconWhatsApp from "../../../../../assets/whatsappIcon.svg";

const { Panel } = Collapse;

const columns = (whatsAppMessage: string, onSelectUser: (idUser: number) => void) => [
  {
    title: "Nome",
    key: "name",
    render: (worker: WorkerListItem) => (
      <Button type="link" onClick={() => onSelectUser(worker.idUser)}>
        {worker.name}
      </Button>
    ),
  },
  { title: "Email", dataIndex: "email", key: "email" },
  {
    title: "Telefone",
    key: "phone",
    render: (worker: WorkerListItem) => (
      <PhoneCell
        target="_blank"
        href={`https://api.whatsapp.com/send?phone=55${worker.phone}&text=${whatsAppMessage}`}
      >
        <WhatsAppSmallIcon src={IconWhatsApp} alt="WhatsApp" />
        {worker.phone}
      </PhoneCell>
    ),
  },
];

export const Workers = ({ companyId, whatsAppMessage, onSelectUser }: WorkersProps) => {
  const [workers, setWorkers] = useState<WorkerListItem[]>([]);
  const [loading, setLoading] = useState(false);
  const [hasLoaded, setHasLoaded] = useState(false);

  const fetchWorkers = () => {
    if (hasLoaded) return;
    setLoading(true);
    api.get(`company/${companyId}/workers`).then((result) => {
      const list = (result.data.response as CompanyWorkerResponse[]).map((item) => ({
        idUser: item.user.idUser,
        name: item.user.name,
        email: item.user.email,
        phone: Mask.setMaskPhoneValue(item.user.phone),
      }));
      setWorkers(list);
      setHasLoaded(true);
      setLoading(false);
    });
  };

  return (
    <SectionCard>
      <WorkersDrop ghost onChange={fetchWorkers}>
        <Panel
          header={
            <SectionTitleRow>
              <FiUsers size={18} />
              Usuários credenciados
            </SectionTitleRow>
          }
          key="1"
        >
          {loading ? (
            <Skeleton active paragraph={{ rows: 3 }} />
          ) : workers.length === 0 ? (
            <EmptyWorkers>Nenhum usuário credenciado</EmptyWorkers>
          ) : Utils.isMobile() ? (
            workers.map((worker) => (
              <WorkerRow key={worker.idUser}>
                <div>
                  <WorkerName onClick={() => onSelectUser(worker.idUser)}>
                    {worker.name}
                  </WorkerName>
                  <div>
                    <FieldIcon>
                      <FiMail size={14} />
                    </FieldIcon>
                    {worker.email}
                  </div>
                  <PhoneCell
                    target="_blank"
                    href={`https://api.whatsapp.com/send?phone=55${worker.phone}&text=${whatsAppMessage}`}
                  >
                    <FieldIcon>
                      <FiPhone size={14} />
                    </FieldIcon>
                    {worker.phone}
                    <WhatsAppSmallIcon src={IconWhatsApp} alt="WhatsApp" />
                  </PhoneCell>
                </div>
              </WorkerRow>
            ))
          ) : (
            <Table
              pagination={{ pageSize: 5 }}
              columns={columns(whatsAppMessage, onSelectUser)}
              dataSource={workers}
              rowKey="idUser"
              size="small"
            />
          )}
        </Panel>
      </WorkersDrop>
    </SectionCard>
  );
};
