export interface ContractEntity {
  id: number;
  apartment: string;
  dong: string;
  ho: string;
  area: string;
  ownerName: string;
  ownerPhone: string;
  tenantName: string;
  tenantPhone: string;
  contractType: string;
  contractPrice: number | string;
  contractDate: string;
  dueDate: string;
  contractStatus: string;
  contractFile?: string;
  fileSize?: string;
  favorite: boolean;
}
