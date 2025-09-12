import { ContractEntity } from "../shared-entity/ContractEntity";

export interface ContractTableRow extends ContractEntity {}

export function toContractTableRow(entity: ContractEntity): ContractTableRow {
  return { ...entity };
}
