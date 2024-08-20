import { CURRENCY_VALUES_ARRAY, ERROR_CODES_ARRAY } from "./constants";

export type Currency = (typeof CURRENCY_VALUES_ARRAY)[number];

export type ErrorCodes = (typeof ERROR_CODES_ARRAY)[number];

export type TransactionType = "SELF" | "SELF_CROSS_WALLET" | "OTHERS";

export type User = {
	id: string;
	email: string;
	password: string;
	name: string;
	createdAt: Date;
};

export type Session = {
	id: string;
	exp: number;
	user: {
		id: string;
		email: string;
	};
};

export type Wallet = {
	id: string;
	amount: number;
	user: { id: string; name: string };
	currency: Currency;
	createdAt: Date;
};

export type Transaction = {
	id: string;
	walletId: string;
	userId: string;
	type: TransactionType;
	amount: number;
	currency: Currency;
	createdAt: Date;
	receiver: {
		id: string;
		name: string;
	};
};
