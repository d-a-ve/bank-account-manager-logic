import { ERROR_CODES } from "../constants";
import { authService } from "../services/auth-service";
import { createErrorResponse, isValidEmail } from "../utils";

export function signUserUp(data: {
	email: string;
	password: string;
	name: string;
}) {
	if (!isValidEmail(data.email)) {
		return createErrorResponse(
			ERROR_CODES.INVALID_EMAIL,
			"This email is invalid. Please provide a valid email"
		);
	}

	if (data.password.length < 8) {
		return createErrorResponse(
			ERROR_CODES.INVALID_PASSWORD,
			"Password must be at least 8 characters long"
		);
	}

	return authService.signup(data);
}

export function loginUser(data: { email: string; password: string }) {
	return authService.login(data);
}

export function signUserOut(sessionId: string) {
	const activeSession = authService.isSessionActive(sessionId);

	if (activeSession.status === "error") {
		return activeSession;
	}

	return authService.signout(sessionId);
}

export function getSession(sessionId: string) {
  return authService.getSession(sessionId);
}

export function isSessionActive(sessionId: string) {
	return authService.isSessionActive(sessionId)
}
