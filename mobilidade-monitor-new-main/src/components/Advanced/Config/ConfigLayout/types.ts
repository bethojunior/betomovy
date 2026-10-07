export interface AnimationsProps {
  id: string;
  uri: any;
}

export interface ObjectSendAnimationProps {
  screen: string;
  id: string;
  title: string;
}

export interface ResponseAnimationsProps {
  active: number;
  created_at: string | null;
  deleted_at: string | null;
  id: number;
  id_app: number;
  module_id: number;
  screen: string;
  type: string;
  updated_at: string;
}

export interface DatasAnimationsProps {
  id_app: number;
  type: string;
  screen: string;
  module_id: number;
  active: boolean;
}
