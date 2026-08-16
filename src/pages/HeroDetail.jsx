import { useEffect, useState } from "react";
import { Link, useParams } from "react-router-dom";
import api from "../services/api";

function HeroDetail() {
    const { id } = useParams();

    const [hero, setHero] = useState(null);
    const [loading, setLoading] = useState(true);
    const [error, setError] = useState("");

    useEffect(() => {
        cargarHeroe();
    }, [id]);

    const cargarHeroe = async () => {
        try {
            setLoading(true);
            setError("");

            const response = await api.get(`/heroes/${id}`);

            setHero(response.data.data);
        } catch (error) {
            console.error(error);

            if (error.response?.status === 404) {
                setError("Superhéroe no encontrado.");
            } else if (error.response?.data?.message) {
                setError(error.response.data.message);
            } else {
                setError("No se pudo cargar el superhéroe.");
            }
        } finally {
            setLoading(false);
        }
    };

    if (loading) {
        return <p>Cargando superhéroe...</p>;
    }

    if (error) {
        return (
            <div>
                <h2>Error</h2>
                <p>{error}</p>

                <Link to="/heroes">
                    Volver a héroes
                </Link>
            </div>
        );
    }

    return (
        <div>
            <Link to="/heroes">
                ← Volver a héroes
            </Link>

            <h1>{hero.nombre}</h1>

            <img
                src={hero.imagen_url}
                alt={hero.nombre}
                width="300"
            />

            <p>
                <strong>Nombre real:</strong>{" "}
                {hero.nombre_real}
            </p>

            <p>
                <strong>Poder principal:</strong>{" "}
                {hero.poder_principal}
            </p>

            <p>
                <strong>Nivel de poder:</strong>{" "}
                {hero.nivel_poder}
            </p>

            <p>
                <strong>Estado:</strong>{" "}
                {hero.estado}
            </p>
        </div>
    );
}

export default HeroDetail;