import { useState } from "react";
import { useNavigate } from "react-router-dom";
import api from "../services/api";

function Login() {
    const navigate = useNavigate();

    const [email, setEmail] = useState("");
    const [password, setPassword] = useState("");

    const [loading, setLoading] = useState(false);
    const [error, setError] = useState("");

    const handleSubmit = async (e) => {
        e.preventDefault();

        setLoading(true);
        setError("");

        try {
            const response = await api.post("/auth/login", {
                email,
                password,
            });

            const { token, user } = response.data;

            localStorage.setItem("token", token);
            localStorage.setItem("user", JSON.stringify(user));

            navigate("/");
        } catch (error) {
            if (error.response?.data?.message) {
                setError(error.response.data.message);
            } else {
                setError("No se pudo conectar con el servidor.");
            }
        } finally {
            setLoading(false);
        }
    };

    return (
        <div>
            <h1>Marvel API</h1>
            <h2>Iniciar sesión</h2>

            <form onSubmit={handleSubmit}>
                <div>
                    <label>Email</label>

                    <input
                        type="email"
                        value={email}
                        onChange={(e) => setEmail(e.target.value)}
                        required
                    />
                </div>

                <div>
                    <label>Password</label>

                    <input
                        type="password"
                        value={password}
                        onChange={(e) => setPassword(e.target.value)}
                        required
                    />
                </div>

                {error && (
                    <p>
                        {error}
                    </p>
                )}

                <button type="submit" disabled={loading}>
                    {loading ? "Iniciando sesión..." : "Iniciar sesión"}
                </button>
            </form>
        </div>
    );
}

export default Login;