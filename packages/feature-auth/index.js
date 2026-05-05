"use client";

import { useEffect, useState } from "react";
import {
  auth,
  createUserWithEmailAndPassword,
  onAuthStateChanged,
  signInWithEmailAndPassword,
  signOut,
} from "../../apps/web/lib/auth";

export default function AuthFeature() {
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [user, setUser] = useState(null);
  const [loadingAction, setLoadingAction] = useState("idle");
  const [errorText, setErrorText] = useState("");
  const [noticeText, setNoticeText] = useState("");
  const [isSignup, setIsSignup] = useState(false);

  const isLoading = loadingAction !== "idle";

  useEffect(() => {
    const unsubscribe = onAuthStateChanged(auth, (currentUser) => {
      setUser(currentUser);
    });
    return unsubscribe;
  }, []);

  const handleSignup = async () => {
    if (!email || !password) {
      setErrorText("Please enter email and password.");
      return;
    }

    setLoadingAction("signup");
    setErrorText("");
    setNoticeText("");

    try {
      await createUserWithEmailAndPassword(auth, email, password);
      setNoticeText("Account created successfully!");
      setEmail("");
      setPassword("");
      setIsSignup(false);
    } catch (error) {
      console.error("Signup error:", error);
      setErrorText(getErrorMessage(error));
    } finally {
      setLoadingAction("idle");
    }
  };

  const handleLogin = async () => {
    if (!email || !password) {
      setErrorText("Please enter email and password.");
      return;
    }

    setLoadingAction("login");
    setErrorText("");
    setNoticeText("");

    try {
      await signInWithEmailAndPassword(auth, email, password);
      setNoticeText("Logged in successfully!");
      setEmail("");
      setPassword("");
    } catch (error) {
      console.error("Login error:", error);
      setErrorText(getErrorMessage(error));
    } finally {
      setLoadingAction("idle");
    }
  };

  const handleLogout = async () => {
    setLoadingAction("logout");
    setErrorText("");
    setNoticeText("");

    try {
      await signOut(auth);
      setNoticeText("Logged out successfully!");
      setEmail("");
      setPassword("");
    } catch (error) {
      console.error("Logout error:", error);
      setErrorText(getErrorMessage(error));
    } finally {
      setLoadingAction("idle");
    }
  };

  if (user) {
    return (
      <div style={container}>
        <h2 style={title}>🔐 Account</h2>

        <div style={userCard}>
          <h3>Welcome, {user.email}!</h3>
          <p style={userEmail}>{user.email}</p>
          <p style={userDetail}>
            Account created:{" "}
            {new Date(user.metadata.creationTime).toLocaleDateString()}
          </p>

          <button
            onClick={handleLogout}
            style={buttonDanger}
            disabled={isLoading}
          >
            {loadingAction === "logout" ? "Logging out..." : "Logout"}
          </button>
        </div>
      </div>
    );
  }

  return (
    <div style={container}>
      <h2 style={title}>🔐 {isSignup ? "Sign Up" : "Login"}</h2>

      <div style={formCard}>
        <input
          type="email"
          value={email}
          onChange={(e) => setEmail(e.target.value)}
          placeholder="Enter your email"
          style={input}
          disabled={isLoading}
        />

        <input
          type="password"
          value={password}
          onChange={(e) => setPassword(e.target.value)}
          placeholder="Enter your password"
          style={input}
          disabled={isLoading}
        />

        <div style={buttonGroup}>
          <button
            onClick={isSignup ? handleSignup : handleLogin}
            style={button}
            disabled={isLoading}
          >
            {loadingAction === "signup"
              ? "Creating account..."
              : loadingAction === "login"
                ? "Logging in..."
                : isSignup
                  ? "Sign Up"
                  : "Login"}
          </button>

          <button
            onClick={() => {
              setIsSignup(!isSignup);
              setErrorText("");
              setNoticeText("");
            }}
            style={buttonSecondary}
            disabled={isLoading}
          >
            {isSignup ? "Have an account? Login" : "No account? Sign Up"}
          </button>
        </div>

        {errorText ? <p style={error}>{errorText}</p> : null}
        {noticeText ? <p style={notice}>{noticeText}</p> : null}
      </div>
    </div>
  );
}

function getErrorMessage(error) {
  const code = error?.code || "";
  if (code.includes("email-already-in-use")) {
    return "This email is already registered.";
  }
  if (code.includes("invalid-email")) {
    return "Invalid email address.";
  }
  if (code.includes("weak-password")) {
    return "Password is too weak. Use at least 6 characters.";
  }
  if (code.includes("user-not-found")) {
    return "Email not found. Please sign up.";
  }
  if (code.includes("wrong-password")) {
    return "Incorrect password.";
  }
  if (code.includes("too-many-requests")) {
    return "Too many failed attempts. Try again later.";
  }
  return "Authentication failed. Try again.";
}

/* STYLES */
const container = {
  padding: "20px",
  fontFamily: "Arial",
  backgroundColor: "#f9fafb",
  minHeight: "100vh",
};

const title = {
  color: "#111827",
  marginBottom: "20px",
};

const formCard = {
  width: "100%",
  maxWidth: "400px",
  padding: "20px",
  backgroundColor: "white",
  border: "1px solid #e5e7eb",
  borderRadius: "8px",
  boxShadow: "0 1px 3px rgba(0,0,0,0.1)",
};

const userCard = {
  width: "100%",
  maxWidth: "400px",
  padding: "20px",
  backgroundColor: "white",
  border: "1px solid #e5e7eb",
  borderRadius: "8px",
  boxShadow: "0 1px 3px rgba(0,0,0,0.1)",
};

const input = {
  width: "100%",
  padding: "10px",
  marginBottom: "10px",
  border: "1px solid #d1d5db",
  borderRadius: "6px",
  boxSizing: "border-box",
  fontSize: "14px",
};

const buttonGroup = {
  display: "flex",
  flexDirection: "column",
  gap: "10px",
  marginTop: "15px",
};

const button = {
  padding: "10px 15px",
  backgroundColor: "#111827",
  color: "white",
  border: "none",
  borderRadius: "6px",
  cursor: "pointer",
  fontSize: "14px",
  fontWeight: "500",
};

const buttonSecondary = {
  padding: "10px 15px",
  backgroundColor: "#e5e7eb",
  color: "#111827",
  border: "1px solid #d1d5db",
  borderRadius: "6px",
  cursor: "pointer",
  fontSize: "14px",
  fontWeight: "500",
};

const buttonDanger = {
  padding: "10px 15px",
  backgroundColor: "#b91c1c",
  color: "white",
  border: "none",
  borderRadius: "6px",
  cursor: "pointer",
  fontSize: "14px",
  fontWeight: "500",
};

const userEmail = {
  color: "#6b7280",
  fontSize: "14px",
  margin: "5px 0",
};

const userDetail = {
  color: "#9ca3af",
  fontSize: "12px",
  margin: "5px 0 15px 0",
};

const error = {
  marginTop: "12px",
  color: "#991b1b",
  fontSize: "13px",
  padding: "10px",
  backgroundColor: "#fee2e2",
  borderRadius: "6px",
};

const notice = {
  marginTop: "12px",
  color: "#065f46",
  fontSize: "13px",
  padding: "10px",
  backgroundColor: "#dcfce7",
  borderRadius: "6px",
};
