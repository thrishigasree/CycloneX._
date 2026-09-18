import { useState } from "react";
import { Wind, ArrowRight, ShieldCheck, Mail, Lock, User, Loader2, CheckCircle, AlertCircle } from "lucide-react";
import { Link, useNavigate } from "react-router-dom";
import "../styles/auth.css";

function Auth() {
  const [isSignUp, setIsSignUp] = useState(false);
  const navigate = useNavigate();

  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [fullName, setFullName] = useState("");
  const [isLoading, setIsLoading] = useState(false);
  const [message, setMessage] = useState(null); // { type: 'success' | 'error', text: '' }

  const clearForm = () => {
    setEmail("");
    setPassword("");
    setFullName("");
    setMessage(null);
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    setIsLoading(true);
    setMessage(null);

    const url = isSignUp
      ? "http://localhost:5000/api/auth/signup"
      : "http://localhost:5000/api/auth/login";

    const body = isSignUp
      ? { fullName, email, password }
      : { email, password };

    try {
      const response = await fetch(url, {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify(body),
      });

      const data = await response.json();

      if (!response.ok) {
        setMessage({ type: "error", text: data.message });
        setIsLoading(false);
        return;
      }

      if (isSignUp) {
        // Signup success → show message and switch to login
        setMessage({ type: "success", text: "Account created! Redirecting to login..." });
        setIsLoading(false);
        setTimeout(() => {
          clearForm();
          setIsSignUp(false);
          setMessage({ type: "success", text: "Account created successfully. Please sign in." });
        }, 1500);
      } else {
        // Login success → save user to localStorage and navigate
        localStorage.setItem("cyclonex_user", JSON.stringify(data.user));
        setMessage({ type: "success", text: "Login successful! Redirecting..." });
        setTimeout(() => {
          navigate("/dashboard");
        }, 800);
      }
    } catch (error) {
      console.error("Request error:", error);
      setMessage({ type: "error", text: "Unable to connect to server. Make sure backend is running." });
      setIsLoading(false);
    }
  };

  const handleToggle = () => {
    setIsSignUp(!isSignUp);
    setMessage(null);
    setEmail("");
    setPassword("");
    setFullName("");
  };

  return (
    <div className="auth-page">
      <nav className="auth-nav">
        <Link to="/" className="nav-logo">
          <div className="logo-icon">
            <Wind size={22} />
          </div>
          <div>
            <span>Cyclone</span>
            <span className="logo-x">X</span>
          </div>
        </Link>
      </nav>

      <div className="auth-container">
        <div className="auth-card">
          <div className="auth-header">
            <h2>{isSignUp ? "Create Account" : "Access CycloneX"}</h2>
            <p>
              {isSignUp
                ? "Sign up to access real-time cyclone intelligence"
                : "Enter your credentials to monitor active systems"}
            </p>
          </div>

          {/* In-page message */}
          {message && (
            <div className={`auth-message ${message.type}`}>
              {message.type === "success" ? (
                <CheckCircle size={16} />
              ) : (
                <AlertCircle size={16} />
              )}
              <span>{message.text}</span>
            </div>
          )}

          <form onSubmit={handleSubmit} className="auth-form">
            {isSignUp && (
              <div className="form-group">
                <label>Full Name</label>
                <div className="input-wrapper">
                  <User size={18} />
                  <input
                    type="text"
                    placeholder="John Doe"
                    value={fullName}
                    onChange={(e) => setFullName(e.target.value)}
                    required
                    disabled={isLoading}
                  />
                </div>
              </div>
            )}

            <div className="form-group">
              <label>Email Address</label>
              <div className="input-wrapper">
                <Mail size={18} />
                <input
                  type="email"
                  placeholder="operator@cyclonex.io"
                  value={email}
                  onChange={(e) => setEmail(e.target.value)}
                  required
                  disabled={isLoading}
                />
              </div>
            </div>

            <div className="form-group">
              <label>Password</label>
              <div className="input-wrapper">
                <Lock size={18} />
                <input
                  type="password"
                  placeholder="••••••••"
                  value={password}
                  onChange={(e) => setPassword(e.target.value)}
                  required
                  disabled={isLoading}
                />
              </div>
            </div>

            <button type="submit" className="auth-submit-btn" disabled={isLoading}>
              {isLoading ? (
                <>
                  <Loader2 size={18} className="spin-icon" />
                  {isSignUp ? "Creating Account..." : "Signing In..."}
                </>
              ) : (
                <>
                  {isSignUp ? "Register Account" : "Sign In"}
                  <ArrowRight size={18} />
                </>
              )}
            </button>
          </form>

          <div className="auth-toggle">
            <span>
              {isSignUp ? "Already have an account?" : "Don't have an account?"}
            </span>
            <button
              type="button"
              onClick={handleToggle}
              className="toggle-btn"
              disabled={isLoading}
            >
              {isSignUp ? "Sign In" : "Create One"}
            </button>
          </div>

          <div className="auth-footer">
            <ShieldCheck size={16} />
            <span>Encrypted Operational Portal</span>
          </div>
        </div>
      </div>
    </div>
  );
}

export default Auth;