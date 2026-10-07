
export interface DriverData {
  index: number;
  name: string;
  cpf: string;
  email: string;
  telefone: string;
  numeroDocVeiculo: string;
  marcaVeiculo: string;
  modeloVeiculo: string;
  placa: string;
  numeroRenavam: string;
  corVeiculo: string;
  numeroAssentos: string;
  anoFabricacao: string;
  numeroCNH: string;
}

export interface UserType {
  idUserType: number;
  name: string;
  isDriver: number;
  isDeliveryMan: number;
}
