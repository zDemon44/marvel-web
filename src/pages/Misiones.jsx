import { useEffect, useState } from "react";
import { Link } from "react-router-dom";
import api from "../services/api";

function Misiones() {
    const [misiones, setMisiones] = useState([]);
    const [loading, setLoading] = useState(true);
    const [error, setError] = useState("");

    useEffect(() => {
        cargarMisiones();
    }, []);

    const cargarMisiones = async () => {
        try {
            setLoading(true);
            setError("");

            const response = await api.get("/misiones");

            setMisiones(response.data.data);
        } catch (error) {
            console.error(error);

            if (error.response?.data?.message) {
                setError(error.response.data.message);
            } else {
                setError("No se pudieron cargar las misiones.");
            }
        } finally {
            setLoading(false);
        }
    };

    const eliminarMision = async (id) => {
        const confirmar = window.confirm(
            "¿Estás seguro de que deseas eliminar esta misión?"
        );

        if (!confirmar) {
            return;
        }

        try {
            await api.delete(`/misiones/${id}`);

            setMisiones((misionesActuales) =>
                misionesActuales.filter((mision) => mision.id !== id)
            );
        } catch (error) {
            console.error(error);

            if (error.response?.data?.message) {
                alert(error.response.data.message);
            } else {
                alert("No se pudo eliminar la misión.");
            }
        }
    };

    if (loading) {
        return <p>Cargando misiones...</p>;
    }

    if (error) {
        return (
            <div>
                <h2>Error</h2>
                <p>{error}</p>

                <button onClick={cargarMisiones}>
                    Reintentar
                </button>
            </div>
        );
    }

    return (
        <div>
            <h1>Misiones</h1>

            <Link to="/misiones/nueva">
                Nueva misión
            </Link>

            <br />
            <br />

            {misiones.length === 0 ? (
                <p>No hay misiones registradas.</p>
            ) : (
                <div>
                    {misiones.map((mision) => (
                        <div key={mision.id}>
                            <h2>{mision.titulo}</h2>

                            <p>
                                <strong>Descripción:</strong>{" "}
                                {mision.descripcion}
                            </p>

                            <p>
                                <strong>Ubicación:</strong>{" "}
                                {mision.ubicacion}
                            </p>

                            <p>
                                <strong>Fecha:</strong>{" "}
                                {mision.fecha}
                            </p>

                            <p>
                                <strong>Nivel de peligro:</strong>{" "}
                                {mision.nivel_peligro}
                            </p>

                            <p>
                                <strong>Estado:</strong>{" "}
                                {mision.estado}
                            </p>

                            <p>
                                <strong>Superhéroe:</strong>{" "}
                                {mision.heroe?.nombre ||
                                    `ID ${mision.superheroe_id}`}
                            </p>

                            <Link to={`/misiones/editar/${mision.id}`}>
                                Editar
                            </Link>

                            {" | "}

                            <button
                                onClick={() =>
                                    eliminarMision(mision.id)
                                }
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

export default Misiones;