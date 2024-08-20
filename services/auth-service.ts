import { ERROR_CODES } from "../constants";
import { sessionPersistence } from "../db/sessions";
import { usersPersistence } from "../db/users";
import {
	createErrorResponse,
	createSuccessResponse,
	generateHexId,
} from "../utils";

function signup(data: { email: string; password: string; name: string }) {
	const existingUser = usersPersistence.findUserByEmail(data.email);

	if (existingUser) {
		return createErrorResponse(
			ERROR_CODES.USER_EXISTS,
			"A user with this email already exists. Please login instead!"
		);
	}

	usersPersistence.addUser({
		id: generateHexId(),
		email: data.email,
		password: data.password,
		name: data.name,
		createdAt: new Date(),
	});

	return createSuccessResponse(
		"User created successfully. User can sign in now!",
		null
	);
}

function login(data: { email: string; password: string }) {
	const user = usersPersistence.findUserByEmailAndPassword(data);

	if (!user) {
		return createErrorResponse(
			ERROR_CODES.INVALID_CREDENTIALS,
			"Email or password is incorrect. Please try again!"
		);
	}

	const currentSession = {
		id: generateHexId(),
		exp: new Date().getTime() + 1000 * 60 * 60 * 24, // 24 hours
		user: {
			id: user.id,
			email: user.email,
		},
	};

	sessionPersistence.addSession(currentSession);

	return createSuccessResponse("User logged in successfully", {
		user,
		token: currentSession.id,
	});
}

function signout(token: string) {
	const sessionIndex = sessionPersistence.findSessionByIndex(token);

	if (sessionIndex === -1) {
		return createErrorResponse(
			ERROR_CODES.INVALID_SESSION,
			"Invalid session. You do not have an active session. Please login again!"
		);
	}

	sessionPersistence.removeSessionByIndex(sessionIndex);

	return createSuccessResponse("User logged out successfully", null);
}

function isSessionActive(sessionToken: string) {
	const session = sessionPersistence.findSessionById(sessionToken);

	if (!session) {
		return createErrorResponse(
			ERROR_CODES.INVALID_SESSION,
			"Invalid session. You do not have an active session. Please login again!"
		);
	}

	if (session.exp < new Date().getTime()) {
		return createErrorResponse(
			ERROR_CODES.INVALID_SESSION,
			"Session expired. Please login again!"
		);
	}

	return createSuccessResponse("Session is active", null);
}

function getSession(sessionId: string) {
	const session = sessionPersistence.findSessionById(sessionId);

	if (!session) {
		return createErrorResponse(
			ERROR_CODES.INVALID_SESSION,
			"Invalid session id. You do not have an active session. Please login again!"
		);
	}

	return createSuccessResponse("It is a valid session", session);
}

function getAllSesions() {
	return sessionPersistence.getAllSessions();
}

function doesUserExist(userId: string) {
	const foundUser = usersPersistence.findUserById(userId);

	if (!foundUser) {
		return false;
	}

	return true;
}

function getAllUsers() {
	return usersPersistence.getAllUsers();
}

export const authService = {
	signup,
	login,
	signout,
	isSessionActive,
	getSession,
	getAllSesions,
	doesUserExist,
	getAllUsers,
};
