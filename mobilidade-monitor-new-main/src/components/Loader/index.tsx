import { FC, ReactNode } from "react";
import { Spin } from "antd";

interface LoaderProps {
  spinning: boolean;
  children?: ReactNode;
}

export const Loader: FC<LoaderProps> = ({ spinning, children }) => {
  return (
    <Spin spinning={spinning}>
      {children}
    </Spin>
  );
};
