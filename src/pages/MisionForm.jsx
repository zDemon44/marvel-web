import { useEffect, useState } from "react";
import { useNavigate, useParams } from "react-router-dom";
import api from "../services/api";

function MisionForm() {
    const { id } = useParams();
    const navigate = useNavigate();

    const isEditing = Boolean(id);

    const [form, setForm] = useState({
        titulo: "",
        descripcion: "",
        ubicacion: "",
        fecha: "",
        nivel_peligro: "BAJO",
        estado: "PENDIENTE",
        superheroe_id: "",
    });

    const [heroes, setHeroes] = useState([]);
    const [loading, setLoading] = useState(false);
    const [loadingData, setLoadingData] = useState(true);
    const [error, setError] = useState("");

    useEffect(() => {
        cargarDatos();
    }, [id]);

    const cargarDatos = async () => {
        try {
            setLoadingData(true);
            setError("");

            const heroesResponse = await api.get("/heroes");

            setHeroes(heroesResponse.data.data);

            if (isEditing) {
                const misionResponse = await api.get(
                    `/misiones/${id}`
                );

                const mision = misionResponse.data.data;

                setForm({
                    titulo: mision.titulo,
                    descripcion: mision.descripcion,
                    ubicacion: mision.ubicacion,
                    fecha: mision.fecha,
                    nivel_peligro: mision.nivel_peligro,
                    estado: mision.estado,
                    superheroe_id: mision.superheroe_id,
                });
            }
        } catch (error) {
            console.error(error);

            if (error.response?.data?.message) {
                setError(error.response.data.message);
            } else {
                setError("No se pudieron cargar los datos.");
            }
        } finally {
            setLoadingData(false);
        }
    };

    const handleChange = (e) => {
        const { name, value } = e.target;

        setForm({
            ...form,
            [name]: value,
        });
    };

    const handleSubmit = async (e) => {
        e.preventDefault();

        try {
            setLoading(true);
            setError("");

            const data = {
                ...form,
                superheroe_id: Number(form.superheroe_id),
            };

            if (isEditing) {
                await api.put(`/misiones/${id}`, data);
            } else {
                await api.post("/misiones", data);
            }

            navigate("/misiones");
        } catch (error) {
            console.error(error);

            if (error.response?.data?.errors) {
                const errors = error.response.data.errors;

                const mensajes = Object.values(errors)
                    .flat()
                    .join(" ");

                setError(mensajes);
            } else if (error.response?.data?.message) {
                setError(error.response.data.message);
            } else {
                setError("No se pudo guardar la misión.");
            }
        } finally {
            setLoading(false);
        }
    };

    if (loadingData) {
        return <p>Cargando información...</p>;
    }

    return (
        <div>
            <h1>
                {isEditing
                    ? "Editar misión"
                    : "Registrar misión"}
            </h1>

            {error && <p>{error}</p>}

            <form onSubmit={handleSubmit}>
                <div>
                    <label>Título</label>

                    <input
                        type="text"
                        name="titulo"
                        value={form.titulo}
                        onChange={handleChange}
                        required
                    />
                </div>

                <div>
                    <label>Descripción</label>

                    <textarea
                        name="descripcion"
                        value={form.descripcion}
                        onChange={handleChange}
                        required
                    />
                </div>

                <div>
                    <label>Ubicación</label>

                    <input
                        type="text"
                        name="ubicacion"
                        value={form.ubicacion}
                        onChange={handleChange}
                        required
                    />
                </div>

                <div>
                    <label>Fecha</label>

                    <input
                        type="date"
                        name="fecha"
                        value={form.fecha}
                        onChange={handleChange}
                        required
                    />
                </div>

                <div>
                    <label>Nivel de peligro</label>

                    <select
                        name="nivel_peligro"
                        value={form.nivel_peligro}
                        onChange={handleChange}
                    >
                        <option value="BAJO">BAJO</option>
                        <option value="MEDIO">MEDIO</option>
                        <option value="ALTO">ALTO</option>
                    </select>
                </div>

                <div>
                    <label>Estado</label>

                    <select
                        name="estado"
                        value={form.estado}
                        onChange={handleChange}
                    >
                        <option value="PENDIENTE">
                            PENDIENTE
                        </option>

                        <option value="EN_PROGRESO">
                            EN_PROGRESO
                        </option>

                        <option value="COMPLETADA">
                            COMPLETADA
                        </option>
                    </select>
                </div>

                <div>
                    <label>Superhéroe</label>

                    <select
                        name="superheroe_id"
                        value={form.superheroe_id}
                        onChange={handleChange}
                        required
                    >
                        <option value="">
                            Selecciona un superhéroe
                        </option>

                        {heroes.map((hero) => (
                            <option
                                key={hero.id}
                                value={hero.id}
                            >
                                {hero.nombre}
                            </option>
                        ))}
                    </select>
                </div>

                <br />

                <button
                    type="submit"
                    disabled={loading}
                >
                    {loading
                        ? "Guardando..."
                        : isEditing
                            ? "Actualizar"
                            : "Registrar"}
                </button>

                {" "}

                <button
                    type="button"
                    onClick={() => navigate("/misiones")}
                >
                    Cancelar
                </button>
            </form>
        </div>
    );
}

export default MisionForm;