import { Container, Card, Title } from "./styles";
import { AiOutlineCheck } from "react-icons/ai";
import { DriversProps } from "../../../pages/Financial/ReportsFinancial/types";

interface SelectItemsProps {
  datalist: DriversProps[];
  value: number[];
  setValue: (data: number[]) => void;
}

export const SelectItems = ({
  datalist,
  setValue,
  value,
}: SelectItemsProps) => {
  const handleSelectItem = (id: number) => {
    if (value.includes(id)) {
      const newList = value.filter((data) => data !== id);
      setValue(newList);
    } else {
      setValue([...value, id]);
    }
  };

  return (
    <Container>
      {datalist.map((response) => {
        return (
          <Card
            key={response.idDriver}
            onClick={() => handleSelectItem(response.idDriver)}
          >
            <Title>{response.name.toLocaleUpperCase()}</Title>
            {value.includes(response.idDriver) ? (
              <AiOutlineCheck color="#008000" size={25} />
            ) : null}
          </Card>
        );
      })}
    </Container>
  );
};
