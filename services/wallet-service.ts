import { CURRENCY_VALUES_ARRAY, ERROR_CODES } from "../constants";
import { transactionPersistence } from "../db/transactions";
import { walletPersistence } from "../db/wallets";
import { Currency, User } from "../type";
import {
	convertCurrency,
	createErrorResponse,
	createSuccessResponse,
	generateHexId,
	validateCurrencyMatch,
} from "../utils";

function getWallet(data: { user: User; walletId: string }) {
	const wallet = walletPersistence.findWalletByUserIdAndWalletId(
		data.user.id,
		data.walletId
	);

	if (!wallet) {
		return createErrorResponse(ERROR_CODES.NOT_FOUND, "No wallet found");
	}

	return createSuccessResponse("Wallet found", wallet);
}

function createWallet(data: { user: User; currency: Currency }) {
	const wallet = {
		id: generateHexId(),
		user: { id: data.user.id, name: data.user.name },
		amount: 0,
		currency: data.currency,
		createdAt: new Date(),
	};

	walletPersistence.addWallet(wallet);

	return createSuccessResponse("Wallet created successfully", wallet);
}

function deleteWallet(data: { user: User; walletId: string }) {
	const walletIndex = walletPersistence.findWalletIndex(data.walletId);

	if (walletIndex === -1) {
		return createErrorResponse(
			ERROR_CODES.NOT_FOUND,
			`No wallet found with walletId: ${data.walletId}`
		);
	}

	const wallet = walletPersistence.getWalletByIndex(walletIndex);

	if (wallet.user.id !== data.user.id) {
		return createErrorResponse(
			ERROR_CODES.INVALID_CREDENTIALS,
			"You do not have permission to delete this wallet"
		);
	}

	if (wallet.amount > 0) {
		return createErrorResponse(
			ERROR_CODES.NOT_EMPTY,
			"Wallet has funds in it, please transfer funds out before deleting wallet"
		);
	}

	walletPersistence.removeWallet(walletIndex);

	return createSuccessResponse("Wallet deleted successfully", null);
}

function walletDeposit(data: {
	user: User;
	walletId: string;
	amount: number;
	currency: Currency;
}) {
	const wallet = walletPersistence.findWalletByUserIdAndWalletId(
		data.user.id,
		data.walletId
	);

	if (!wallet) {
		return createErrorResponse(
			ERROR_CODES.NOT_FOUND,
			`No wallet found matching the walletId: ${data.walletId} for this user`
		);
	}

	if (!CURRENCY_VALUES_ARRAY.includes(data.currency)) {
		return createErrorResponse(
			ERROR_CODES.INVALID_CURRENCY,
			`Invalid currency: ${data.currency}`
		);
	}

	let depositAmount: number;

	if (validateCurrencyMatch(wallet.currency, data.currency)) {
		depositAmount = data.amount;
	} else {
		depositAmount = convertCurrency(data.amount, wallet.currency);
	}

	wallet.amount += depositAmount;

	transactionPersistence.addTransactionRecord({
		id: generateHexId(),
		walletId: wallet.id,
		userId: wallet.user.id,
		type: "SELF",
		amount: depositAmount,
		currency: wallet.currency,
		createdAt: new Date(),
		receiver: {
			id: wallet.user.id,
			name: data.user.name,
		},
	});

	return createSuccessResponse("Wallet deposit successful", wallet);
}

function sameUserWalletTransfer(data: {
	user: User;
	sourceWalletId: string;
	targetWalletId: string;
	transferAmount: number;
}) {
	if (data.sourceWalletId === data.targetWalletId) {
		return createErrorResponse(
			ERROR_CODES.SAME_WALLET,
			"Cannot transfer to the same wallet"
		);
	}

	const sourceWallet = walletPersistence.findWalletByUserIdAndWalletId(
		data.user.id,
		data.sourceWalletId
	);

	const targetWallet = walletPersistence.findWalletByUserIdAndWalletId(
		data.user.id,
		data.targetWalletId
	);

	if (!sourceWallet || !targetWallet) {
		return createErrorResponse(ERROR_CODES.NOT_FOUND, "Wallet not found");
	}

	if (sourceWallet.amount <= 0) {
		return createErrorResponse(
			ERROR_CODES.NOT_EMPTY,
			"Wallet is empty. You cannot transfer from an empty wallet"
		);
	}

	if (sourceWallet.amount < data.transferAmount) {
		return createErrorResponse(
			ERROR_CODES.INSUFFIENT_BALANCE,
			"Insufficient funds. Cannot transfer more than your wallet balance"
		);
	}

	let transferAmount: { source: number; target: number };
	if (sourceWallet.currency === targetWallet.currency) {
		transferAmount = {
			source: data.transferAmount,
			target: data.transferAmount,
		};
	} else {
		transferAmount = {
			source: data.transferAmount,
			target: convertCurrency(data.transferAmount, targetWallet.currency),
		};
	}
	
	sourceWallet.amount -= transferAmount.source;
	targetWallet.amount += transferAmount.target;

	const transaction = {
		id: generateHexId(),
		walletId: sourceWallet.id,
		userId: sourceWallet.user.id,
		type: "SELF_CROSS_WALLET" as const,
		amount: transferAmount.source,
		currency: targetWallet.currency,
		createdAt: new Date(),
		receiver: {
			id: targetWallet.user.id,
			name: targetWallet.user.name,
		},
	};

	transactionPersistence.addTransactionRecord(transaction);

	return createSuccessResponse("Funds transfer successful", transaction);
}

function interUserWalletTransfer(data: {
	sender: User & { walletId: string };
	recipient: { walletId: string };
	amount: number;
}) {
	if (data.sender.walletId === data.recipient.walletId) {
		return createErrorResponse(
			ERROR_CODES.SAME_WALLET,
			"Cannot transfer to the same wallet"
		);
	}

	const sourceWallet = walletPersistence.findWalletByUserIdAndWalletId(
		data.sender.id,
		data.sender.walletId
	);

	if (!sourceWallet) {
		return createErrorResponse(
			ERROR_CODES.NOT_FOUND,
			"Wallet to send from not found"
		);
	}

	const targetWallet = walletPersistence.findWalletById(
		data.recipient.walletId
	);

	if (!targetWallet) {
		return createErrorResponse(
			ERROR_CODES.NOT_FOUND,
			"Wallet to receive into not found"
		);
	}

	if (sourceWallet.amount <= 0) {
		return createErrorResponse(
			ERROR_CODES.NOT_EMPTY,
			"Wallet is empty. You cannot transfer from an empty wallet"
		);
	}

	if (sourceWallet.amount < data.amount) {
		return createErrorResponse(
			ERROR_CODES.INSUFFIENT_BALANCE,
			"Insufficient funds. Cannot transfer more than your wallet balance"
		);
	}

	let transferAmount: { source: number; target: number };
	if (sourceWallet.currency === targetWallet.currency) {
		transferAmount = {
			source: data.amount,
			target: data.amount,
		};
	} else {
		transferAmount = {
			source: data.amount,
			target: convertCurrency(data.amount, targetWallet.currency),
		};
	}

	sourceWallet.amount -= transferAmount.source;
	targetWallet.amount += transferAmount.target;

	const transaction = {
		id: generateHexId(),
		walletId: sourceWallet.id,
		userId: sourceWallet.user.id,
		type: "OTHERS" as const,
		amount: transferAmount.source,
		currency: targetWallet.currency,
		createdAt: new Date(),
		receiver: {
			id: targetWallet.user.id,
			name: targetWallet.user.name,
		},
	};

	transactionPersistence.addTransactionRecord(transaction);

	return createSuccessResponse("Funds transfer successful", transaction);
}

function getAllWallets() {
	return walletPersistence.getAllWallets();
}

function getAllTransactions() {
	return transactionPersistence.getAllTransactions()
}

export const walletService = {
	getWallet,
	createWallet,
	deleteWallet,
	walletDeposit,
	sameUserWalletTransfer,
	interUserWalletTransfer,
	getAllTransactions,
	getAllWallets
};
