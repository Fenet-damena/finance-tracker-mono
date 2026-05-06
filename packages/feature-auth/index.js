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
        <style>{stylesCSS}</style>
        <div style={card}>
          <div style={iconHeader}>👤</div>
          <h2 style={title}>Welcome Back</h2>
          <p style={subtitle}>Manage your finances with ease</p>

          <div style={userProfile}>
            <div style={userAvatar}>{user.email.charAt(0).toUpperCase()}</div>
            <div style={userInfo}>
              <p style={userEmail}>{user.email}</p>
              <p style={userDetail}>
                Active since {new Date(user.metadata.creationTime).toLocaleDateString()}
              </p>
            </div>
          </div>

          <button
            onClick={handleLogout}
            style={buttonDanger}
            className="btn-danger"
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
      <style>{stylesCSS}</style>
      <div style={card}>
        <div style={iconHeader}>🔐</div>
        <h2 style={title}>{isSignup ? "Create Account" : "Welcome Back"}</h2>
        <p style={subtitle}>
          {isSignup ? "Join our finance community" : "Sign in to your account"}
        </p>

        <div style={formContainer}>
          <div style={inputWrapper}>
            <label style={label}>Email Address</label>
            <input
              type="email"
              value={email}
              onChange={(e) => setEmail(e.target.value)}
              placeholder="name@example.com"
              style={input}
              disabled={isLoading}
            />
          </div>

          <div style={inputWrapper}>
            <label style={label}>Password</label>
            <input
              type="password"
              value={password}
              onChange={(e) => setPassword(e.target.value)}
              placeholder="••••••••"
              style={input}
              disabled={isLoading}
            />
          </div>

          <div style={buttonGroup}>
            <button
              onClick={isSignup ? handleSignup : handleLogin}
              style={buttonPrimary}
              className="btn-primary"
              disabled={isLoading}
            >
              {loadingAction === "signup"
                ? "Creating account..."
                : loadingAction === "login"
                  ? "Signing in..."
                  : isSignup
                    ? "Get Started"
                    : "Sign In"}
            </button>

            <button
              onClick={() => {
                setIsSignup(!isSignup);
                setErrorText("");
                setNoticeText("");
              }}
              style={buttonLink}
              className="btn-link"
              disabled={isLoading}
            >
              {isSignup ? "Already have an account? Sign In" : "Don't have an account? Create one"}
            </button>
          </div>
        </div>

        {errorText && <div style={errorBox}>{errorText}</div>}
        {noticeText && <div style={noticeBox}>{noticeText}</div>}
      </div>
    </div>
  );
}

function getErrorMessage(error) {
  const code = error?.code || "";
  if (code.includes("email-already-in-use")) return "This email is already registered.";
  if (code.includes("invalid-email")) return "Invalid email address.";
  if (code.includes("weak-password")) return "Password is too weak. Use at least 6 characters.";
  if (code.includes("user-not-found")) return "Account not found. Please sign up.";
  if (code.includes("wrong-password")) return "Incorrect password.";
  if (code.includes("too-many-requests")) return "Too many failed attempts. Try again later.";
  return "Authentication failed. Please try again.";
}

const stylesCSS = `
  @keyframes fadeIn {
    from { opacity: 0; transform: translateY(10px); }
    to { opacity: 1; transform: translateY(0); }
  }

  .btn-primary:hover {
    filter: brightness(1.1);
    transform: translateY(-1px);
    box-shadow: 0 4px 12px rgba(99, 102, 241, 0.4);
  }

  .btn-primary:active {
    transform: translateY(0);
  }

  .btn-danger:hover {
    background-color: #dc2626 !important;
    transform: translateY(-1px);
  }

  .btn-link:hover {
    color: #4f46e5 !important;
    text-decoration: underline !important;
  }

  input:focus {
    outline: none;
    border-color: #6366f1 !important;
    box-shadow: 0 0 0 4px rgba(99, 102, 241, 0.1) !important;
  }
`;

const container = {
  display: "flex",
  alignItems: "center",
  justifyContent: "center",
  minHeight: "100vh",
  padding: "24px",
  background: "radial-gradient(circle at top right, #1e1b4b, #0f172a)",
  fontFamily: "'Inter', system-ui, -apple-system, sans-serif",
};

const card = {
  width: "100%",
  maxWidth: "420px",
  padding: "40px",
  backgroundColor: "rgba(255, 255, 255, 0.03)",
  backdropFilter: "blur(12px)",
  WebkitBackdropFilter: "blur(12px)",
  border: "1px solid rgba(255, 255, 255, 0.1)",
  borderRadius: "24px",
  boxShadow: "0 25px 50px -12px rgba(0, 0, 0, 0.5)",
  textAlign: "center",
  animation: "fadeIn 0.5s ease-out",
};

const iconHeader = {
  fontSize: "40px",
  marginBottom: "16px",
  display: "inline-block",
  background: "rgba(255, 255, 255, 0.05)",
  padding: "12px",
  borderRadius: "16px",
};

const title = {
  margin: "0 0 8px 0",
  fontSize: "28px",
  fontWeight: "700",
  color: "#f8fafc",
  letterSpacing: "-0.025em",
};

const subtitle = {
  margin: "0 0 32px 0",
  fontSize: "16px",
  color: "#94a3b8",
};

const formContainer = {
  display: "flex",
  flexDirection: "column",
  gap: "20px",
};

const inputWrapper = {
  textAlign: "left",
};

const label = {
  display: "block",
  fontSize: "14px",
  fontWeight: "500",
  color: "#e2e8f0",
  marginBottom: "8px",
  marginLeft: "4px",
};

const input = {
  width: "100%",
  padding: "12px 16px",
  backgroundColor: "rgba(255, 255, 255, 0.05)",
  border: "1px solid rgba(255, 255, 255, 0.1)",
  borderRadius: "12px",
  color: "#f8fafc",
  fontSize: "16px",
  transition: "all 0.2s ease",
  boxSizing: "border-box",
};

const buttonGroup = {
  display: "flex",
  flexDirection: "column",
  gap: "12px",
  marginTop: "12px",
};

const buttonPrimary = {
  padding: "14px 24px",
  background: "linear-gradient(135deg, #6366f1 0%, #4f46e5 100%)",
  color: "white",
  border: "none",
  borderRadius: "12px",
  fontSize: "16px",
  fontWeight: "600",
  cursor: "pointer",
  transition: "all 0.2s ease",
};

const buttonLink = {
  background: "transparent",
  border: "none",
  color: "#94a3b8",
  fontSize: "14px",
  cursor: "pointer",
  transition: "all 0.2s ease",
};

const userProfile = {
  display: "flex",
  alignItems: "center",
  gap: "16px",
  padding: "16px",
  backgroundColor: "rgba(255, 255, 255, 0.05)",
  borderRadius: "16px",
  marginBottom: "32px",
  textAlign: "left",
};

const userAvatar = {
  width: "48px",
  height: "48px",
  borderRadius: "12px",
  background: "linear-gradient(135deg, #6366f1 0%, #4f46e5 100%)",
  display: "flex",
  alignItems: "center",
  justifyContent: "center",
  fontSize: "20px",
  fontWeight: "700",
  color: "white",
};

const userInfo = {
  display: "flex",
  flexDirection: "column",
};

const userEmail = {
  margin: 0,
  fontSize: "16px",
  fontWeight: "600",
  color: "#f8fafc",
};

const userDetail = {
  margin: 0,
  fontSize: "13px",
  color: "#94a3b8",
};

const buttonDanger = {
  width: "100%",
  padding: "12px",
  backgroundColor: "#ef4444",
  color: "white",
  border: "none",
  borderRadius: "12px",
  fontSize: "15px",
  fontWeight: "600",
  cursor: "pointer",
  transition: "all 0.2s ease",
};

const errorBox = {
  marginTop: "20px",
  padding: "12px 16px",
  backgroundColor: "rgba(239, 68, 68, 0.1)",
  border: "1px solid rgba(239, 68, 68, 0.2)",
  borderRadius: "12px",
  color: "#fca5a5",
  fontSize: "14px",
};

const noticeBox = {
  marginTop: "20px",
  padding: "12px 16px",
  backgroundColor: "rgba(16, 185, 129, 0.1)",
  border: "1px solid rgba(16, 185, 129, 0.2)",
  borderRadius: "12px",
  color: "#6ee7b7",
  fontSize: "14px",
};
