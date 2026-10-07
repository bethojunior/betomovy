import { UploadFile } from "antd";

export interface DeliveryListProps {
  id: number;
  active: number;
  description: string;
  name: string;
  picture: string;
  created_at: Date;
  deleted_at: Date;
  updated_at: Date;
}

export interface FieldType {
  name: string;
  description?: string;
  icon?: {
    file: UploadFile;
    fileList: UploadFile[];
  };
}
