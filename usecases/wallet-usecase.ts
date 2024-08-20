import { ERROR_CODES } from "../constants";
import { authService } from "../services/auth-service";
import { walletService } from "../services/wallet-service";
import { Currency, Session, User } from "../type";
import { createErrorResponse } from "../utils";

export function createWallet(data: {
	session: Session;
	user: User;
	currency?: Currency;
}) {
	if (data.session.user.id !== data.user.id) {
		return createErrorResponse(
			ERROR_CODES.USER_DOES_NOT_MATCH,
			"User does not match session user"
		);
	}

	const activeSession = authService.isSessionActive(data.session.id);
	if (activeSession.status === "error") {
		return activeSession;
	}

	const userExists = authService.doesUserExist(data.user.id);
	if (!userExists) {
		return createErrorResponse(ERROR_CODES.NOT_FOUND, "No user found");
	}

	if (!data.currency) {
		data.currency = "NGN";
	}

	return walletService.createWallet({
		user: data.user,
		currency: data.currency,
	});
}

export function getWallet(data: {
	session: Session;
	user: User;
	walletId: string;
}) {
	if (data.session.user.id !== data.user.id) {
		return createErrorResponse(
			ERROR_CODES.USER_DOES_NOT_MATCH,
			"User does not match session user"
		);
	}

	const activeSession = authService.isSessionActive(data.session.id);
	if (activeSession.status === "error") {
		return activeSession;
	}

	const userExists = authService.doesUserExist(data.user.id);
	if (!userExists) {
		return createErrorResponse(ERROR_CODES.NOT_FOUND, "No user found");
	}

	return walletService.getWallet({ user: data.user, walletId: data.walletId });
}

export function deleteWallet(data: {
	session: Session;
	user: User;
	walletId: string;
}) {
	if (data.session.user.id !== data.user.id) {
		return createErrorResponse(
			ERROR_CODES.USER_DOES_NOT_MATCH,
			"User does not match session user"
		);
	}

	const activeSession = authService.isSessionActive(data.session.id);
	if (activeSession.status === "error") {
		return activeSession;
	}

	const userExists = authService.doesUserExist(data.user.id);
	if (!userExists) {
		return createErrorResponse(ERROR_CODES.NOT_FOUND, "No user found");
	}

	return walletService.deleteWallet({
		user: data.user,
		walletId: data.walletId,
	});
}

export function walletSelfDeposit(data: {
	user: User;
	session: Session;
	amount: number;
	currency: Currency;
	walletId: string;
}) {
	if (data.session.user.id !== data.user.id) {
		return createErrorResponse(
			ERROR_CODES.USER_DOES_NOT_MATCH,
			"User does not match session user"
		);
	}

	const activeSession = authService.isSessionActive(data.session.id);
	if (activeSession.status === "error") {
		return activeSession;
	}

	const userExists = authService.doesUserExist(data.user.id);
	if (!userExists) {
		return createErrorResponse(ERROR_CODES.NOT_FOUND, "No user found");
	}

	return walletService.walletDeposit({
		user: data.user,
		walletId: data.walletId,
		amount: data.amount,
		currency: data.currency,
	});
}

export function sameUserWalletTransfer(data: {
	user: User;
	session: Session;
	amount: number;
	sourceWalletId: string;
	targetWalletId: string;
}) {
	if (data.session.user.id !== data.user.id) {
		return createErrorResponse(
			ERROR_CODES.USER_DOES_NOT_MATCH,
			"User does not match session user"
		);
	}

	const activeSession = authService.isSessionActive(data.session.id);
	if (activeSession.status === "error") {
		return activeSession;
	}

	const userExists = authService.doesUserExist(data.user.id);
	if (!userExists) {
		return createErrorResponse(ERROR_CODES.NOT_FOUND, "No user found");
	}

	return walletService.sameUserWalletTransfer({
		user: data.user,
		sourceWalletId: data.sourceWalletId,
		targetWalletId: data.targetWalletId,
		transferAmount: data.amount,
	});
}

export function interWalletTransfer(data: {
	user: User;
	session: Session;
	amount: number;
	sourceWalletId: string;
	targetWalletId: string;
}) {
	if (data.session.user.id !== data.user.id) {
		return createErrorResponse(
			ERROR_CODES.USER_DOES_NOT_MATCH,
			"User does not match session user"
		);
	}

	const activeSession = authService.isSessionActive(data.session.id);
	if (activeSession.status === "error") {
		return activeSession;
	}

	const userExists = authService.doesUserExist(data.user.id);
	if (!userExists) {
		return createErrorResponse(ERROR_CODES.NOT_FOUND, "No user found");
	}

	walletService.interUserWalletTransfer({
		sender: { ...data.user, walletId: data.sourceWalletId },
		recipient: { walletId: data.targetWalletId },
		amount: data.amount,
	});
}
