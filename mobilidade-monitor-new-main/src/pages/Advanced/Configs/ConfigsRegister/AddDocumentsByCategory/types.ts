export interface DocsUserTypesProps {
  created_at: string;
  doc: {
    created_at: string;
    deleted_at: string | null;
    description: string | null;
    id: number;
    image: number;
    label: string;
    link: string | null;
    pdf: number;
    text: number;
    updated_at: string;
  };
  docId: number;
  id: number;
  statusId: number;
  updated_at: string;
  userTypeId: number;
  user_type: {
    acceptedText: string;
    boardingText: string;
    description: string | null;
    iconMapDriverId: number;
    idUserType: number;
    inProgressText: string;
    isActive: number;
    isDeliveryMan: number;
    isDriver: number;
    name: string;
    picture: string;
  };
}
