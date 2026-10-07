interface GroupsProps {
  name: string;
  permissions: string[];
}

declare type userData = {
  api_token: string;
  email: string;
  idUser: number;
  name: string;
  nickname: string;
  role: {
    groups: GroupsProps[];
    name: string;
  };
  rodeId: number;
  statusPay: {
    id: number;
    status: string;
    message: string | null;
  };
  support: number;
  updated_at: string;
};
