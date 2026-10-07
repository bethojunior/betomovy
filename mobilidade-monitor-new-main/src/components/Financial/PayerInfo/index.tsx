import { Flex, Typography } from "antd";

type PayerInfoProps = {
  name?: string;
  email?: string;
  document?: string;
};

export const PayerInfo = ({ name, email, document }: PayerInfoProps) => {
  if (!name && !email && !document) {
    return <Typography.Text type="secondary">-</Typography.Text>;
  }

  return (
    <Flex vertical>
      {name && <Typography.Text strong>{name}</Typography.Text>}
      {email && (
        <Typography.Text type="secondary" style={{ fontSize: 11 }}>
          {email}
        </Typography.Text>
      )}
      {document && (
        <Typography.Text type="secondary" style={{ fontSize: 11 }}>
          {document}
        </Typography.Text>
      )}
    </Flex>
  );
};
