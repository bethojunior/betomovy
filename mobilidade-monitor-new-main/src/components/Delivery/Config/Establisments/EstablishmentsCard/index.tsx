import { Image, Switch } from "antd";
import { Card } from "./styles";
import { EstablishmentsCardProps } from "./stypes";

const EstablishmentsCard = ({
  item,
  onHandleChange,
  linkSections,
}: EstablishmentsCardProps) => {
  const isChecked = linkSections.some(
    (res: any) => item.id === res.deliverySectionId
  );
  return (
    <Card key={item.id}>
      <div>
        <Image width={40} height={30} src={item.icon} />
        <span style={{ marginLeft: 10 }}>{item.name}</span>
      </div>
      <Switch
        onChange={(e) => onHandleChange(e, item.id)}
        defaultChecked={isChecked}
      />
    </Card>
  );
};

export default EstablishmentsCard;
