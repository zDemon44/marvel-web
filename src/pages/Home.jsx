import { Link } from "react-router-dom";
import "./Home.css";

function Home() {
    const user = JSON.parse(localStorage.getItem("user"));

    return (
        <div className="home-container">

            <div className="home-content">

                <div className="home-header">
                    <span className="home-logo">MARVEL</span>

                    <h1>Marvel Manager</h1>

                    <p>
                        Bienvenido{user ? `, ${user.nombre}` : ""}
                    </p>

                    {user && (
                        <span className="user-role">
                            {user.rol}
                        </span>
                    )}
                </div>

                <div className="home-options">

                    <Link to="/heroes" className="home-card">
                        <div className="home-card-icon">
                            🦸
                        </div>

                        <h2>Superhéroes</h2>

                        <p>
                            Consulta y administra los
                            superhéroes del universo Marvel.
                        </p>
                    </Link>

                    <Link to="/misiones" className="home-card">
                        <div className="home-card-icon">
                            🎯
                        </div>

                        <h2>Misiones</h2>

                        <p>
                            Consulta y administra las
                            misiones asignadas.
                        </p>
                    </Link>

                </div>

            </div>

        </div>
    );
}

export default Home;