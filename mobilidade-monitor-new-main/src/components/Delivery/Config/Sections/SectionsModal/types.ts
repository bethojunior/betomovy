import { UploadFile } from "antd";
import { SectionsTableType } from "../../../../../pages/Delivery/Config/Sections/types";

export interface SectionsModalProps {
  title: string;
  open: boolean;
  registerSection: (e: FieldType) => void;
  onCancel: () => void;
  editValues: SectionsTableType | undefined;
  setGetFile: (e: Blob) => void;
}

export type FieldType = {
  name: string;
  description: string;
  icon: {
    file: UploadFile;
    fileList: UploadFile[];
  };
};
