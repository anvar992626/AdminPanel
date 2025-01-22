import { useState } from "react";
import axios from "axios";
import { useNavigate } from "react-router-dom";
import { toast } from "react-toastify";
import "bootstrap/dist/css/bootstrap.min.css";
import "./Login.css";

const Login = () => {
    const [email, setEmail] = useState("");
    const [password, setPassword] = useState("");
    const navigate = useNavigate();

    const handleLogin = async (e) => {
        e.preventDefault();
        try {
            const response = await axios.post(
                "https://localhost:7126/api/Account/Login",
                { email, password },
                { withCredentials: true }
            );
            toast.success(response.data.message || "Login successful!");
            navigate("/admin");
        } catch (error) {
            console.error("Login Error:", error.response?.data || error.message);
            toast.error(
                error.response?.data.message || "Invalid email or password."
            );
        }
    };

    return (
        <div className="login-page-container">
            <div className="form-container">
                <h2>The App</h2>
                <p>Start your journey</p>
                <form onSubmit={handleLogin}>
                    <label htmlFor="email">E-mail</label>
                    <input
                        id="email"
                        type="email"
                        value={email}
                        onChange={(e) => setEmail(e.target.value)}
                        required
                        placeholder="test@example.com"
                    />
                    <label htmlFor="password">Password</label>
                    <input
                        id="password"
                        type="password"
                        value={password}
                        onChange={(e) => setPassword(e.target.value)}
                        required
                        placeholder="********"
                    />
                    <button type="submit" className="btn btn-primary">
                        Sign In
                    </button>
                </form>
                <div className="secondary-links">
                    <a href="/register">Sign up</a>
                    <span style={{ margin: "0 1rem" }}></span>
                    <a href="/forgot-password">Forgot password?</a>
                </div>
            </div>
        </div>
    );
};
export default Login;