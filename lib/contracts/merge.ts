import type { ContractDraft } from "./types";

type ContractSection = "seller" | "buyer" | "vehicle" | "saleTerms" | "declarations";

export function mergeContractSection<T extends ContractSection>(
  contract: ContractDraft,
  section: T,
  incoming: Partial<ContractDraft[T]>,
): ContractDraft[T] {
  return {
    ...(contract[section] ?? {}),
    ...incoming,
  } as ContractDraft[T];
}
