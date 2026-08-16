import { useEffect, useState } from "react";
import { Link } from "react-router-dom";
import api from "../services/api";

function Heroes() {
    const [heroes, setHeroes] = useState([]);
    const [loading, setLoading] = useState(true);
    const [error, setError] = useState("");
    const [search, setSearch] = useState("");

    useEffect(() => {
        cargarHeroes();
    }, []);

    const cargarHeroes = async () => {
        try {
            setLoading(true);
            setError("");

            const response = await api.get("/heroes");

            setHeroes(response.data.data);
        } catch (error) {
            console.error(error);

            if (error.response?.data?.message) {
                setError(error.response.data.message);
            } else {
                setError("No se pudieron cargar los superhéroes.");
            }
        } finally {
            setLoading(false);
        }
    };

    const eliminarHeroe = async (id) => {
        const confirmar = window.confirm(
            "¿Estás seguro de que deseas eliminar este superhéroe?"
        );

        if (!confirmar) {
            return;
        }

        try {
            await api.delete(`/heroes/${id}`);

            setHeroes((heroesActuales) =>
                heroesActuales.filter((hero) => hero.id !== id)
            );
        } catch (error) {
            console.error(error);

            if (error.response?.data?.message) {
                alert(error.response.data.message);
            } else {
                alert("No se pudo eliminar el superhéroe.");
            }
        }
    };

    const heroesFiltrados = heroes.filter((hero) =>
        hero.nombre.toLowerCase().includes(search.toLowerCase())
    );

    if (loading) {
        return <p>Cargando superhéroes...</p>;
    }

    if (error) {
        return (
            <div>
                <h2>Error</h2>
                <p>{error}</p>

                <button onClick={cargarHeroes}>
                    Reintentar
                </button>
            </div>
        );
    }

    return (
        <div>
            <h1>Superhéroes</h1>

            <Link to="/heroes/nuevo">
                Nuevo superhéroe
            </Link>

            <br />
            <br />

            <input
                type="text"
                placeholder="Buscar por nombre..."
                value={search}
                onChange={(e) => setSearch(e.target.value)}
            />

            <br />
            <br />

            {heroesFiltrados.length === 0 ? (
                <p>No se encontraron superhéroes.</p>
            ) : (
                <div>
                    {heroesFiltrados.map((hero) => (
                        <div key={hero.id}>

                            <img
                                src={hero.imagen_url}
                                alt={hero.nombre}
                                width="150"
                            />

                            <h2>{hero.nombre}</h2>

                            <p>
                                <strong>Poder:</strong>{" "}
                                {hero.poder_principal}
                            </p>

                            <p>
                                <strong>Nivel:</strong>{" "}
                                {hero.nivel_poder}
                            </p>

                            <p>
                                <strong>Estado:</strong>{" "}
                                {hero.estado}
                            </p>

                            <Link to={`/heroes/${hero.id}`}>
                                Ver detalle
                            </Link>

                            {" | "}

                            <Link to={`/heroes/editar/${hero.id}`}>
                                Editar
                            </Link>

                            {" | "}

                            <button
                                onClick={() => eliminarHeroe(hero.id)}
                            >
                                Eliminar
                            </button>

                            <hr />
                        </div>
                    ))}
                </div>
            )}
        </div>
    );
}

export default Heroes;