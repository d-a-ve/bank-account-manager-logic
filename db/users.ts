import { User } from "../type";

const usersTable: User[] = [];

function findUserByEmail(email: string) {
	return usersTable.find((user) => user.email === email);
}

function findUserByEmailAndPassword(args: { email: string; password: string }) {
	return usersTable.find(
		(user) => user.email === args.email && user.password === args.password
	);
}

function findUserById(userId: string) {
	return usersTable.find((val) => val.id === userId);
}

function addUser(user: User) {
	usersTable.push(user);
}

function getAllUsers() {
	return usersTable;
}

export const usersPersistence = {
	findUserByEmail,
	findUserByEmailAndPassword,
	findUserById,
	addUser,
	getAllUsers,
};
