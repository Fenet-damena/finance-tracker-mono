import {
  createUserWithEmailAndPassword as firebaseCreateUserWithEmailAndPassword,
  onAuthStateChanged as firebaseOnAuthStateChanged,
  signInWithEmailAndPassword as firebaseSignInWithEmailAndPassword,
  signOut as firebaseSignOut,
} from "firebase/auth";

import { auth as firebaseAuth } from "./firebase";

const AUTH_MODE_KEY = "finance-tracker-auth-mode";
const USERS_KEY = "finance-tracker-local-users";
const SESSION_KEY = "finance-tracker-local-session";

const authListeners = new Set<(user: LocalUser | null) => void>();
const firebaseUnsubscribers = new Map<(user: LocalUser | null) => void, () => void>();

type StoredAccount = {
  email: string;
  password: string;
};

type LocalUser = {
  uid: string;
  email: string;
  metadata: {
    creationTime: string;
    lastSignInTime: string;
  };
};

type AuthMode = "firebase" | "local";

let authMode: AuthMode = readAuthMode();

export const auth = firebaseAuth;

export function onAuthStateChanged(
  _auth: typeof firebaseAuth,
  nextOrObserver: (user: LocalUser | null) => void,
) {
  authListeners.add(nextOrObserver);

  if (authMode === "local") {
    nextOrObserver(readSession());
    return () => {
      authListeners.delete(nextOrObserver);
    };
  }

  const unsubscribe = firebaseOnAuthStateChanged(firebaseAuth, nextOrObserver as never);
  firebaseUnsubscribers.set(nextOrObserver, unsubscribe);

  return () => {
    authListeners.delete(nextOrObserver);
    const storedUnsubscribe = firebaseUnsubscribers.get(nextOrObserver);
    if (storedUnsubscribe) {
      storedUnsubscribe();
      firebaseUnsubscribers.delete(nextOrObserver);
    }
  };
}

export async function createUserWithEmailAndPassword(
  _auth: typeof firebaseAuth,
  email: string,
  password: string,
) {
  if (authMode === "local") {
    return createLocalAccount(email, password);
  }

  try {
    return await firebaseCreateUserWithEmailAndPassword(firebaseAuth, email, password);
  } catch (error) {
    if (isAuthConfigurationError(error)) {
      switchToLocalAuth();
      return createLocalAccount(email, password);
    }

    throw error;
  }
}

export async function signInWithEmailAndPassword(
  _auth: typeof firebaseAuth,
  email: string,
  password: string,
) {
  if (authMode === "local") {
    return signInLocalAccount(email, password);
  }

  try {
    return await firebaseSignInWithEmailAndPassword(firebaseAuth, email, password);
  } catch (error) {
    if (isAuthConfigurationError(error)) {
      switchToLocalAuth();
      return signInLocalAccount(email, password);
    }

    throw error;
  }
}

export async function signOut(_auth: typeof firebaseAuth) {
  if (authMode === "local") {
    clearSession();
    notifyAuthListeners(null);
    return;
  }

  try {
    await firebaseSignOut(firebaseAuth);
  } catch (error) {
    if (isAuthConfigurationError(error)) {
      switchToLocalAuth();
      clearSession();
      notifyAuthListeners(null);
      return;
    }

    throw error;
  }
}

function createLocalAccount(email: string, password: string) {
  const trimmedEmail = email.trim().toLowerCase();

  if (!trimmedEmail || !password) {
    throw createAuthError("auth/invalid-email", "Email and password are required.");
  }

  const accounts = readAccounts();
  if (accounts[trimmedEmail]) {
    throw createAuthError("auth/email-already-in-use", "This email is already registered.");
  }

  accounts[trimmedEmail] = { email: trimmedEmail, password };
  writeAccounts(accounts);

  const user = buildLocalUser(trimmedEmail);
  writeSession(user);
  notifyAuthListeners(user);

  return Promise.resolve({ user });
}

function signInLocalAccount(email: string, password: string) {
  const trimmedEmail = email.trim().toLowerCase();
  const account = readAccounts()[trimmedEmail];

  if (!account) {
    throw createAuthError("auth/user-not-found", "Email not found.");
  }

  if (account.password !== password) {
    throw createAuthError("auth/wrong-password", "Incorrect password.");
  }

  const user = buildLocalUser(trimmedEmail);
  writeSession(user);
  notifyAuthListeners(user);

  return Promise.resolve({ user });
}

function notifyAuthListeners(user: LocalUser | null) {
  for (const listener of authListeners) {
    listener(user);
  }
}

function switchToLocalAuth() {
  if (authMode === "local") {
    return;
  }

  authMode = "local";

  for (const unsubscribe of firebaseUnsubscribers.values()) {
    unsubscribe();
  }

  firebaseUnsubscribers.clear();

  if (canUseBrowserStorage()) {
    window.localStorage.setItem(AUTH_MODE_KEY, authMode);
  }
}

function readAuthMode(): AuthMode {
  if (!canUseBrowserStorage()) {
    return "firebase";
  }

  const storedMode = window.localStorage.getItem(AUTH_MODE_KEY);
  return storedMode === "local" ? "local" : "firebase";
}

function readAccounts(): Record<string, StoredAccount> {
  if (!canUseBrowserStorage()) {
    return {};
  }

  try {
    return JSON.parse(window.localStorage.getItem(USERS_KEY) || "{}") as Record<string, StoredAccount>;
  } catch {
    return {};
  }
}

function writeAccounts(accounts: Record<string, StoredAccount>) {
  if (!canUseBrowserStorage()) {
    return;
  }

  window.localStorage.setItem(USERS_KEY, JSON.stringify(accounts));
}

function readSession(): LocalUser | null {
  if (!canUseBrowserStorage()) {
    return null;
  }

  try {
    const rawSession = window.localStorage.getItem(SESSION_KEY);
    return rawSession ? (JSON.parse(rawSession) as LocalUser) : null;
  } catch {
    return null;
  }
}

function writeSession(user: LocalUser) {
  if (!canUseBrowserStorage()) {
    return;
  }

  window.localStorage.setItem(SESSION_KEY, JSON.stringify(user));
  window.localStorage.setItem(AUTH_MODE_KEY, authMode);
}

function clearSession() {
  if (!canUseBrowserStorage()) {
    return;
  }

  window.localStorage.removeItem(SESSION_KEY);
}

function buildLocalUser(email: string): LocalUser {
  const timestamp = new Date().toISOString();

  return {
    uid: `local-${email}`,
    email,
    metadata: {
      creationTime: timestamp,
      lastSignInTime: timestamp,
    },
  };
}

function isAuthConfigurationError(error: unknown) {
  const code = getErrorCode(error);
  return code.includes("configuration-not-found") || code.includes("operation-not-allowed");
}

function getErrorCode(error: unknown) {
  if (typeof error === "object" && error && "code" in error) {
    return String((error as { code?: string }).code || "");
  }

  return "";
}

function createAuthError(code: string, message: string) {
  const error = new Error(message) as Error & { code: string };
  error.code = code;
  return error;
}

function canUseBrowserStorage() {
  return typeof window !== "undefined" && typeof window.localStorage !== "undefined";
}