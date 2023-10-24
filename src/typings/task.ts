export type TaskProps = {
  id: string;
  link: string;
}

export enum ProcessState {
  INIT,
  OPENWEB,
  DOWNLOAD,
  FORMAT,
  END,
  ERROR
}

export type ProcessRsp = {
  name: ProcessState;
  time?: number;
  data?: any
}
