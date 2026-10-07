export interface ModalWhatsAppParabensProps {
  open: boolean;
  onClose: () => void;
  name: string;
  quantityTrips: number;
  phone?: string;
  projectName: string;
  type: "driver" | "client";
}
