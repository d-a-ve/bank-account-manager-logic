import { Session } from "../type";

const sessionsTable: Session[] = [];

function addSession(session: Session) {
	sessionsTable.push(session);
}

function findSessionById(sessionId: string) {
	return sessionsTable.find((session) => session.id === sessionId);
}

function findSessionByIndex(sessionId: string) {
	return sessionsTable.findIndex((session) => session.id === sessionId);
}

function removeSessionByIndex(sessionIndex: number) {
	sessionsTable.splice(sessionIndex, 1);
}

function getAllSessions() {
	return sessionsTable;
}

export const sessionPersistence = {
	addSession,
	findSessionById,
  findSessionByIndex,
	removeSessionByIndex,
	getAllSessions,
};
