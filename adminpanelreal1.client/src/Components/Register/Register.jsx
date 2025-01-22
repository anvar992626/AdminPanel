import { useState } from "react";
import axios from "axios";
import { toast } from "react-toastify";
import "react-toastify/dist/ReactToastify.css";
import "./Register.css"; // Separate CSS for Register

const Register = () => {
    const [name, setName] = useState("");
    const [email, setEmail] = useState("");
    const [password, setPassword] = useState("");

    const API_BASE_URL = "https://localhost:7126";

    const handleRegister = async (e) => {
        e.preventDefault();
        try {
            const response = await axios.post(`${API_BASE_URL}/api/Account/Register`, {
                name,
                email,
                password,
            });
            toast.success("Registration successful! Please log in.");
            console.log(response.data);
        } catch (error) {
            toast.error(error.response?.data.message || "Error occurred during registration.");
            console.error(error.response?.data || "Error occurred");
        }
    };

    return (
        <div className="register-page-container"> {/* Updated container for Register */}
            <div className="form-container">
                <h2>The App</h2>
                <p>Create your account</p>
                <form onSubmit={handleRegister}>
                    <label htmlFor="name">Name</label>
                    <input
                        id="name"
                        type="text"
                        value={name}
                        onChange={(e) => setName(e.target.value)}
                        required
                        placeholder="Your Name"
                    />
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
                        Sign Up
                    </button>
                </form>
                <div className="secondary-links">
                    <a href="/">Back to Login</a>
                </div>
            </div>
        </div>
    );
};

export default Register;
