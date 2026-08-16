import { useEffect, useState } from "react";
import { useNavigate, useParams } from "react-router-dom";
import api from "../services/api";
import "./MisionForm.css";

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
                    titulo: mision.titulo || "",
                    descripcion: mision.descripcion || "",
                    ubicacion: mision.ubicacion || "",
                    fecha: mision.fecha || "",
                    nivel_peligro: mision.nivel_peligro || "BAJO",
                    estado: mision.estado || "PENDIENTE",
                    superheroe_id: mision.superheroe_id || "",
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

        setForm((formActual) => ({
            ...formActual,
            [name]: value,
        }));
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
        return (
            <div className="mision-form-page loading-page">
                <div className="loader"></div>
                <p>Cargando información...</p>
            </div>
        );
    }

    return (
        <div className="mision-form-page">

            {/* HEADER */}
            <div className="mision-form-header">

                <div>
                    <span className="mision-form-label">
                        MARVEL MANAGER
                    </span>

                    <h1>
                        {isEditing
                            ? "Editar misión"
                            : "Nueva misión"}
                    </h1>

                    <p>
                        {isEditing
                            ? "Actualiza la información de la misión seleccionada."
                            : "Registra una nueva misión para un superhéroe."}
                    </p>
                </div>

                <button
                    type="button"
                    className="btn-back"
                    onClick={() => navigate("/misiones")}
                >
                    ← Volver
                </button>

            </div>


            {/* FORMULARIO */}
            <div className="mision-form-card">

                <div className="form-card-header">

                    <div>
                        <span className="form-tag">
                            {isEditing ? "EDITAR" : "REGISTRO"}
                        </span>

                        <h2>
                            Información de la misión
                        </h2>

                        <p>
                            Completa todos los campos requeridos.
                        </p>
                    </div>

                    <div className="mission-symbol">
                        ✦
                    </div>

                </div>


                {error && (
                    <div className="form-error">
                        <strong>⚠ Error</strong>
                        <span>{error}</span>
                    </div>
                )}


                <form onSubmit={handleSubmit}>

                    {/* TÍTULO */}
                    <div className="form-group full-width">

                        <label htmlFor="titulo">
                            Título de la misión
                        </label>

                        <input
                            id="titulo"
                            type="text"
                            name="titulo"
                            value={form.titulo}
                            onChange={handleChange}
                            placeholder="Ej. Invasión en Nueva York"
                            required
                        />

                    </div>


                    {/* DESCRIPCIÓN */}
                    <div className="form-group full-width">

                        <label htmlFor="descripcion">
                            Descripción
                        </label>

                        <textarea
                            id="descripcion"
                            name="descripcion"
                            value={form.descripcion}
                            onChange={handleChange}
                            placeholder="Describe los objetivos y detalles de la misión..."
                            rows="5"
                            required
                        />

                    </div>


                    <div className="form-grid">

                        {/* UBICACIÓN */}
                        <div className="form-group">

                            <label htmlFor="ubicacion">
                                Ubicación
                            </label>

                            <input
                                id="ubicacion"
                                type="text"
                                name="ubicacion"
                                value={form.ubicacion}
                                onChange={handleChange}
                                placeholder="Ej. Nueva York"
                                required
                            />

                        </div>


                        {/* FECHA */}
                        <div className="form-group">

                            <label htmlFor="fecha">
                                Fecha
                            </label>

                            <input
                                id="fecha"
                                type="date"
                                name="fecha"
                                value={form.fecha}
                                onChange={handleChange}
                                required
                            />

                        </div>


                        {/* NIVEL PELIGRO */}
                        <div className="form-group">

                            <label htmlFor="nivel_peligro">
                                Nivel de peligro
                            </label>

                            <select
                                id="nivel_peligro"
                                name="nivel_peligro"
                                value={form.nivel_peligro}
                                onChange={handleChange}
                            >
                                <option value="BAJO">
                                    🟢 BAJO
                                </option>

                                <option value="MEDIO">
                                    🟡 MEDIO
                                </option>

                                <option value="ALTO">
                                    🔴 ALTO
                                </option>
                            </select>

                        </div>


                        {/* ESTADO */}
                        <div className="form-group">

                            <label htmlFor="estado">
                                Estado
                            </label>

                            <select
                                id="estado"
                                name="estado"
                                value={form.estado}
                                onChange={handleChange}
                            >
                                <option value="PENDIENTE">
                                    PENDIENTE
                                </option>

                                <option value="EN_PROGRESO">
                                    EN PROGRESO
                                </option>

                                <option value="COMPLETADA">
                                    COMPLETADA
                                </option>
                            </select>

                        </div>

                    </div>


                    {/* SUPERHÉROE */}
                    <div className="form-group full-width">

                        <label htmlFor="superheroe_id">
                            Superhéroe asignado
                        </label>

                        <select
                            id="superheroe_id"
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

                        {heroes.length === 0 && (
                            <small className="field-warning">
                                No hay superhéroes registrados.
                            </small>
                        )}

                    </div>


                    {/* BOTONES */}
                    <div className="form-actions">

                        <button
                            type="button"
                            className="btn-cancel"
                            onClick={() => navigate("/misiones")}
                            disabled={loading}
                        >
                            Cancelar
                        </button>

                        <button
                            type="submit"
                            className="btn-save"
                            disabled={loading}
                        >
                            {loading
                                ? "Guardando..."
                                : isEditing
                                    ? "Actualizar misión"
                                    : "Registrar misión"}
                        </button>

                    </div>

                </form>

            </div>

        </div>
    );
}

export default MisionForm;