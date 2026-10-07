import { SectionsTableType } from "../../../../../pages/Delivery/Config/Sections/types";

export interface EstablishmentsCardProps {
  item: SectionsTableType;
  onHandleChange: (e: boolean, sectionId: number) => void;
  linkSections: [];
}
