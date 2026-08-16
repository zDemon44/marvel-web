import { useEffect, useState } from "react";
import { useNavigate, useParams } from "react-router-dom";
import api from "../services/api";
import "./HeroForm.css";

function HeroForm() {
    const { id } = useParams();
    const navigate = useNavigate();

    const isEditing = Boolean(id);

    const [form, setForm] = useState({
        nombre: "",
        nombre_real: "",
        poder_principal: "",
        nivel_poder: "",
        imagen_url: "",
        estado: "ACTIVO",
    });

    const [loading, setLoading] = useState(false);
    const [loadingHero, setLoadingHero] = useState(isEditing);
    const [error, setError] = useState("");

    useEffect(() => {
        if (isEditing) {
            cargarHeroe();
        }
    }, [id]);

    const cargarHeroe = async () => {
        try {
            setLoadingHero(true);
            setError("");

            const response = await api.get(`/heroes/${id}`);

            const hero = response.data.data;

            setForm({
                nombre: hero.nombre,
                nombre_real: hero.nombre_real,
                poder_principal: hero.poder_principal,
                nivel_poder: hero.nivel_poder,
                imagen_url: hero.imagen_url || "",
                estado: hero.estado,
            });
        } catch (error) {
            console.error(error);
            setError("No se pudo cargar el superhéroe.");
        } finally {
            setLoadingHero(false);
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
                nivel_poder: Number(form.nivel_poder),
            };

            if (isEditing) {
                await api.put(`/heroes/${id}`, data);
            } else {
                await api.post("/heroes", data);
            }

            navigate("/heroes");
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
                setError("No se pudo guardar el superhéroe.");
            }
        } finally {
            setLoading(false);
        }
    };

    if (loadingHero) {
        return (
            <div className="hero-form-page hero-form-loading">
                <div className="hero-loader"></div>
                <p>Cargando información del superhéroe...</p>
            </div>
        );
    }

    return (
        <div className="hero-form-page">

            {/* HEADER */}
            <div className="hero-form-header">

                <div>
                    <span className="hero-form-tag">
                        {isEditing ? "EDITAR REGISTRO" : "NUEVO REGISTRO"}
                    </span>

                    <h1>
                        {isEditing
                            ? "Editar superhéroe"
                            : "Registrar superhéroe"}
                    </h1>

                    <p>
                        {isEditing
                            ? "Actualiza la información del superhéroe."
                            : "Añade un nuevo héroe al universo Marvel."}
                    </p>
                </div>

                <button
                    type="button"
                    className="hero-back-button"
                    onClick={() => navigate("/heroes")}
                >
                    ← VOLVER
                </button>

            </div>


            {/* CONTENIDO */}
            <div className="hero-form-layout">

                {/* PREVIEW */}
                <aside className="hero-preview">

                    <div className="preview-label">
                        VISTA PREVIA
                    </div>

                    <div className="preview-image-container">

                        {form.imagen_url ? (
                            <img
                                src={form.imagen_url}
                                alt={form.nombre || "Superhéroe"}
                                className="preview-image"
                                onError={(e) => {
                                    e.currentTarget.style.display = "none";
                                    e.currentTarget.nextElementSibling.style.display = "flex";
                                }}
                            />
                        ) : null}

                        <div
                            className="preview-placeholder"
                            style={{
                                display: form.imagen_url ? "none" : "flex"
                            }}
                        >
                            <span>?</span>
                            <p>SIN IMAGEN</p>
                        </div>

                    </div>

                    <div className="preview-info">

                        <span className="preview-status">
                            {form.estado}
                        </span>

                        <h2>
                            {form.nombre || "NOMBRE DEL HÉROE"}
                        </h2>

                        <p>
                            {form.nombre_real || "Nombre real"}
                        </p>

                    </div>

                    <div className="preview-power">

                        <div>
                            <span>PODER</span>
                            <strong>
                                {form.poder_principal || "—"}
                            </strong>
                        </div>

                        <div className="preview-level">
                            <span>NIVEL</span>
                            <strong>
                                {form.nivel_poder || "—"}
                            </strong>
                        </div>

                    </div>

                </aside>


                {/* FORMULARIO */}
                <section className="hero-form-card">

                    <div className="form-card-header">

                        <div>
                            <span>01 / INFORMACIÓN</span>
                            <h2>Datos del superhéroe</h2>
                        </div>

                        <div className="form-card-number">
                            {isEditing ? `#${id}` : "#NEW"}
                        </div>

                    </div>


                    {error && (
                        <div className="hero-form-error">

                            <strong>⚠ ERROR</strong>

                            <span>{error}</span>

                        </div>
                    )}


                    <form onSubmit={handleSubmit}>

                        <div className="form-grid">

                            {/* NOMBRE */}
                            <div className="hero-field">

                                <label htmlFor="nombre">
                                    Nombre del superhéroe
                                </label>

                                <input
                                    id="nombre"
                                    type="text"
                                    name="nombre"
                                    placeholder="Ej. Spider-Man"
                                    value={form.nombre}
                                    onChange={handleChange}
                                    required
                                />

                            </div>


                            {/* NOMBRE REAL */}
                            <div className="hero-field">

                                <label htmlFor="nombre_real">
                                    Nombre real
                                </label>

                                <input
                                    id="nombre_real"
                                    type="text"
                                    name="nombre_real"
                                    placeholder="Ej. Peter Parker"
                                    value={form.nombre_real}
                                    onChange={handleChange}
                                    required
                                />

                            </div>


                            {/* PODER */}
                            <div className="hero-field">

                                <label htmlFor="poder_principal">
                                    Poder principal
                                </label>

                                <input
                                    id="poder_principal"
                                    type="text"
                                    name="poder_principal"
                                    placeholder="Ej. Fuerza sobrehumana"
                                    value={form.poder_principal}
                                    onChange={handleChange}
                                    required
                                />

                            </div>


                            {/* NIVEL */}
                            <div className="hero-field">

                                <label htmlFor="nivel_poder">
                                    Nivel de poder
                                </label>

                                <div className="power-input">

                                    <input
                                        id="nivel_poder"
                                        type="number"
                                        name="nivel_poder"
                                        min="1"
                                        max="100"
                                        placeholder="1 - 100"
                                        value={form.nivel_poder}
                                        onChange={handleChange}
                                        required
                                    />

                                    <span>/ 100</span>

                                </div>

                            </div>


                            {/* URL */}
                            <div className="hero-field full-width">

                                <label htmlFor="imagen_url">
                                    URL de imagen
                                </label>

                                <input
                                    id="imagen_url"
                                    type="url"
                                    name="imagen_url"
                                    placeholder="https://..."
                                    value={form.imagen_url}
                                    onChange={handleChange}
                                />

                                <small>
                                    Puedes utilizar una imagen alojada
                                    públicamente en Internet.
                                </small>

                            </div>


                            {/* ESTADO */}
                            <div className="hero-field">

                                <label htmlFor="estado">
                                    Estado
                                </label>

                                <select
                                    id="estado"
                                    name="estado"
                                    value={form.estado}
                                    onChange={handleChange}
                                >
                                    <option value="ACTIVO">
                                        ACTIVO
                                    </option>

                                    <option value="INACTIVO">
                                        INACTIVO
                                    </option>
                                </select>

                            </div>

                        </div>


                        {/* BOTONES */}
                        <div className="hero-form-actions">

                            <button
                                type="button"
                                className="cancel-button"
                                onClick={() => navigate("/heroes")}
                            >
                                CANCELAR
                            </button>

                            <button
                                type="submit"
                                className="save-button"
                                disabled={loading}
                            >
                                {loading
                                    ? "GUARDANDO..."
                                    : isEditing
                                        ? "ACTUALIZAR HÉROE →"
                                        : "REGISTRAR HÉROE →"}
                            </button>

                        </div>

                    </form>

                </section>

            </div>

        </div>
    );
}

export default HeroForm;