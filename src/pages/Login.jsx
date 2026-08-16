import { useState } from "react";
import { useNavigate } from "react-router-dom";
import api from "../services/api";
import "./Login.css";

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
            console.error(error);

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
        <div className="login-page">

            {/* DECORACIÓN */}
            <div className="login-background">
                <span className="background-letter">M</span>
                <span className="background-dot dot-1"></span>
                <span className="background-dot dot-2"></span>
                <span className="background-dot dot-3"></span>
            </div>


            {/* CONTENEDOR PRINCIPAL */}
            <div className="login-container">

                {/* PANEL IZQUIERDO */}
                <div className="login-brand">

                    <div className="brand-logo">
                        M
                    </div>

                    <span className="brand-small">
                        MARVEL
                    </span>

                    <h1>
                        MARVEL
                        <br />
                        MANAGER
                    </h1>

                    <div className="brand-line"></div>

                    <p>
                        Sistema de gestión de
                        superhéroes y misiones.
                    </p>

                    <div className="brand-info">
                        <span>HÉROES</span>
                        <span>•</span>
                        <span>MISIONES</span>
                        <span>•</span>
                        <span>MARVEL</span>
                    </div>

                </div>


                {/* PANEL LOGIN */}
                <div className="login-card">

                    <div className="login-header">

                        <span className="login-tag">
                            ACCESO
                        </span>

                        <h2>
                            Iniciar sesión
                        </h2>

                        <p>
                            Ingresa tus credenciales para continuar.
                        </p>

                    </div>


                    <form onSubmit={handleSubmit}>

                        {/* EMAIL */}
                        <div className="login-field">

                            <label htmlFor="email">
                                Email
                            </label>

                            <input
                                id="email"
                                type="email"
                                placeholder="correo@ejemplo.com"
                                value={email}
                                onChange={(e) =>
                                    setEmail(e.target.value)
                                }
                                required
                                autoComplete="email"
                            />

                        </div>


                        {/* PASSWORD */}
                        <div className="login-field">

                            <label htmlFor="password">
                                Password
                            </label>

                            <input
                                id="password"
                                type="password"
                                placeholder="••••••••"
                                value={password}
                                onChange={(e) =>
                                    setPassword(e.target.value)
                                }
                                required
                                autoComplete="current-password"
                            />

                        </div>


                        {/* ERROR */}
                        {error && (
                            <div className="login-error">
                                <strong>⚠ Error</strong>

                                <span>
                                    {error}
                                </span>
                            </div>
                        )}


                        {/* BOTÓN */}
                        <button
                            type="submit"
                            className="login-button"
                            disabled={loading}
                        >
                            {loading
                                ? "AUTENTICANDO..."
                                : "INICIAR SESIÓN →"}
                        </button>

                    </form>


                    <div className="login-footer">
                        <span>
                            MARVEL MANAGER
                        </span>

                        <span>
                            API REST • JWT
                        </span>
                    </div>

                </div>

            </div>

        </div>
    );
}

export default Login;