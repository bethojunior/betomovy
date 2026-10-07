import { AlertType } from "../../../../../pages/Delivery/Config/Establishments/types";
import { SectionsTableType } from "../../../../../pages/Delivery/Config/Sections/types";

export interface LinkSectionModalProps {
  open: boolean;
  setOpen: (val: boolean) => void;
  onCancel: () => void;
  listSections: SectionsTableType[];
  linkSections: any;
  sectionId: number;
  sendAlert: (message: string, type: AlertType) => void;
  setLoading: (val: boolean) => void;
}
