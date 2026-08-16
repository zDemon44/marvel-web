import { Link, useNavigate } from "react-router-dom";
import api from "../services/api";

function Navbar() {
    const navigate = useNavigate();

    const user = JSON.parse(localStorage.getItem("user"));

    const handleLogout = async () => {
        try {
            await api.post("/auth/logout");
        } catch (error) {
            console.error("Error al cerrar sesión:", error);
        } finally {
            localStorage.removeItem("token");
            localStorage.removeItem("user");

            navigate("/login");
        }
    };

    return (
        <nav>
            <div>
                <Link to="/heroes">
                    🦸 Marvel
                </Link>
            </div>

            <div>
                <Link to="/heroes">
                    Héroes
                </Link>

                {" | "}

                <Link to="/misiones">
                    Misiones
                </Link>

                {" | "}

                {user && (
                    <span>
                        {user.nombre} ({user.rol})
                    </span>
                )}

                {" | "}

                <button onClick={handleLogout}>
                    Cerrar sesión
                </button>
            </div>
        </nav>
    );
}

export default Navbar;