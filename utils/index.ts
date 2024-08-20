import { CURRENCY, exchangeRate } from "../constants";
import { Currency, ErrorCodes } from "../type";

export function createSuccessResponse<TData>(message: string, data: TData) {
	return {
		status: "success" as const,
		message,
		data,
	};
}

export function createErrorResponse(errorType: ErrorCodes, message: string) {
	return {
		status: "error" as const,
		errorType,
		message,
	};
}

// DO NOT DO THIS IN REAL LIFE, LOL!!
export function generateHexId(): string {
	return Math.floor((1 + Math.random()) * 0x100000000)
		.toString(16)
		.substring(1);
}

export function validateCurrencyMatch(
	currency: Currency,
	currencyToCheck: Currency
): boolean {
	return currency === currencyToCheck;
}

export function convertCurrency(amount: number, currency: Currency): number {
	switch (currency) {
		case CURRENCY.Naira:
			return amount * exchangeRate;
			case CURRENCY.Dollar:
			return amount / exchangeRate;
		default:
			throw new Error("Invalid currency");
	}
}

export function isValidEmail(email:string) {
	return /^\w+([\.-]?\w+)*@\w+([\.-]?\w+)*(\.\w{2,3})+$/.test(email);
}