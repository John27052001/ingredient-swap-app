import { useState } from "react";
import { API_URL } from "../config";

function Login({ onLogin, switchToRegister }) {
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [error, setError] = useState("");

  const handleLogin = async (e) => {
    e.preventDefault();
    setError("");
    try {
      const res = await fetch(`${API_URL}/login`, {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ email, password }),
      });
      const data = await res.json();
      if (!res.ok) throw new Error(data.error || "Login failed");
      localStorage.setItem("token", data.token);
      onLogin();
    } catch (err) {
      setError(err.message);
    }
  };

  return (
    <div style={{
      minHeight: "100vh",
      width: "100vw",
      display: "flex",
      alignItems: "center",
      justifyContent: "center",
      background: "none"
    }}>
      <div style={{
        maxWidth: 400,
        width: "94vw",
        margin: "0 auto",
        padding: 32,
        background: "#f5f7fa",
        borderRadius: 20,
        boxShadow: "0 2px 16px rgba(59,195,195,0.10)"
      }}>
        <h2 style={{ textAlign: "center", marginBottom: 22 }}>Sign In</h2>
        {error && <div style={{ color: "#ea526f", marginBottom: 8 }}>{error}</div>}
        <form onSubmit={handleLogin}>
          <input
            type="email" placeholder="Email"
            value={email} onChange={e => setEmail(e.target.value)}
            required
            style={{ width: "100%", marginBottom: 14, padding: 12, borderRadius: 8, border: "1px solid #59c3c3" }}
          />
          <input
            type="password" placeholder="Password"
            value={password} onChange={e => setPassword(e.target.value)}
            required
            style={{ width: "100%", marginBottom: 18, padding: 12, borderRadius: 8, border: "1px solid #59c3c3" }}
          />
          <button type="submit" style={{
            background: "#59c3c3", color: "#fff", border: "none", borderRadius: 8,
            padding: "12px 28px", width: "100%", fontWeight: 700, cursor: "pointer", fontSize: "1.05em"
          }}>Sign In</button>
        </form>
        <div style={{ textAlign: "center", marginTop: 18 }}>
          Don’t have an account?{" "}
          <button onClick={switchToRegister} style={{ color: "#ea526f", background: "none", border: "none", cursor: "pointer", fontWeight: 600 }}>Sign Up</button>
        </div>
      </div>
    </div>
  );
}
export default Login;
