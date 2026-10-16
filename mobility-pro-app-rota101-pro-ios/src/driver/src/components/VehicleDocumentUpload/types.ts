export interface VehicleDocumentAsset {
  uri: string;
  name: string;
  type: string;
}

export interface VehicleDocumentUploadProps {
  label: string;
  title: string;
  value: VehicleDocumentAsset | null;
  onChange: (asset: VehicleDocumentAsset | null) => void;
}
