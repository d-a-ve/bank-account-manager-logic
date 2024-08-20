import { Wallet } from "../type";

const walletTable: Wallet[] = [];

function findWalletById(walletId: string) {
	return walletTable.find((wal) => wal.id === walletId);
}

function findWalletByUserIdAndWalletId(userId: string, walletId: string) {
	return walletTable.find(
		(wal) => wal.id === walletId && wal.user.id === userId
	);
}

function findWalletIndex(walletId: string) {
	return walletTable.findIndex((wallet) => wallet.id === walletId);
}

function addWallet(wallet: Wallet) {
	walletTable.push(wallet);
}

function getWalletByIndex(walletIndex: number) {
	return walletTable[walletIndex];
}

function removeWallet(walletIndex: number) {
	walletTable.splice(walletIndex, 1);
}

function getAllWallets() {
	return walletTable;
}

export const walletPersistence = {
	findWalletById,
	findWalletByUserIdAndWalletId,
	findWalletIndex,
	addWallet,
	removeWallet,
	getWalletByIndex,
	getAllWallets,
};
