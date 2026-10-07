import { FC, useState } from "react";
import { Popover, Select, Input, Button, Badge, Tooltip } from "antd";
import { FilterOutlined } from "@ant-design/icons";
import { ActiveTripsFilters } from "../../../services/TripService";
import { FilterPanel, FilterActions } from "./ActiveTripsFilter.styles";

interface ActiveTripsFilterProps {
  onApply: (filters: ActiveTripsFilters) => void;
}

// Mesmas opções da central (Viagens Ativas > filtro de status). "Aceita" não
// cobre agendamento já aceito por um motorista — nesse caso o status
// continua "scheduled" até a data/hora da viagem, não vira "accepted".
const STATUS_OPTIONS = [
  { value: "searching", label: "Buscando motorista" },
  { value: "pre_accepted", label: "Aceita (em espera)" },
  { value: "accepted", label: "Aceita" },
  { value: "boarding", label: "Embarcando" },
  { value: "in_progress", label: "Em viagem" },
];

const ActiveTripsFilter: FC<ActiveTripsFilterProps> = ({ onApply }) => {
  const [open, setOpen] = useState(false);
  const [customerName, setCustomerName] = useState("");
  const [driverName, setDriverName] = useState("");
  const [status, setStatus] = useState<string | undefined>(undefined);
  const [appliedCount, setAppliedCount] = useState(0);

  const handleApply = () => {
    const filters: ActiveTripsFilters = {};
    if (customerName.trim()) filters.customerName = customerName.trim();
    if (driverName.trim()) filters.driverName = driverName.trim();
    if (status) filters.status = status;

    setAppliedCount(Object.keys(filters).length);
    onApply(filters);
    setOpen(false);
  };

  const handleClear = () => {
    setCustomerName("");
    setDriverName("");
    setStatus(undefined);
    setAppliedCount(0);
    onApply({});
    setOpen(false);
  };

  const content = (
    <FilterPanel>
      <Input
        placeholder="Nome do cliente"
        value={customerName}
        onChange={(event) => setCustomerName(event.target.value)}
      />
      <Input
        placeholder="Nome do motorista"
        value={driverName}
        onChange={(event) => setDriverName(event.target.value)}
      />
      <Select
        allowClear
        placeholder="Status"
        value={status}
        onChange={(value) => setStatus(value)}
        options={STATUS_OPTIONS}
      />
      <FilterActions>
        <Button size="small" onClick={handleClear}>
          Limpar
        </Button>
        <Button size="small" type="primary" onClick={handleApply}>
          Filtrar
        </Button>
      </FilterActions>
    </FilterPanel>
  );

  return (
    <Popover content={content} trigger="click" open={open} onOpenChange={setOpen} placement="bottomRight">
      <Badge count={appliedCount} size="small" offset={[-4, 4]}>
        <Tooltip title="Filtrar viagens" placement="left">
          <Button type="text" icon={<FilterOutlined style={{ fontSize: 20 }} />} size="large" />
        </Tooltip>
      </Badge>
    </Popover>
  );
};

export default ActiveTripsFilter;
