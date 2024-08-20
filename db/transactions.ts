import { Transaction } from "../type";

export const transactionsTable: Transaction[] = [];

function addTransactionRecord(transation: Transaction) {
  transactionsTable.push(transation);
}

function getAllTransactions() {
  return transactionsTable
}

export const transactionPersistence = {
  addTransactionRecord,
  getAllTransactions
}
