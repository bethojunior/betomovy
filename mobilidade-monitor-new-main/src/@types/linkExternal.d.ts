declare type CheckMethodRef = {
  getTextImg: () => void;
};

declare type ActionLinkExternalProps = {
  datas?: { [key: string] };
  idActionType?: number;
  setIdActionType: (data: number) => void;
};
