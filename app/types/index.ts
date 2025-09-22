export interface Batch {
  module: string;
  batNum: string;
  batDate: string;
  startTime: string;
  endTime: string;
  usageTime: string;
  status: string;
}

export interface AccountingDate {
  accountingDate: string;
}

export interface Process {
  fullName: string | number | bigint | null;
  description: string;
  remarks: string;
  followUp: string;
}
