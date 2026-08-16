import { useEffect, useState } from "react";
import { useNavigate, useParams } from "react-router-dom";
import api from "../services/api";

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
        return <p>Cargando información del superhéroe...</p>;
    }

    return (
        <div>
            <h1>
                {isEditing
                    ? "Editar superhéroe"
                    : "Registrar superhéroe"}
            </h1>

            {error && (
                <div>
                    <p>{error}</p>
                </div>
            )}

            <form onSubmit={handleSubmit}>

                <div>
                    <label>Nombre</label>

                    <input
                        type="text"
                        name="nombre"
                        value={form.nombre}
                        onChange={handleChange}
                        required
                    />
                </div>

                <div>
                    <label>Nombre real</label>

                    <input
                        type="text"
                        name="nombre_real"
                        value={form.nombre_real}
                        onChange={handleChange}
                        required
                    />
                </div>

                <div>
                    <label>Poder principal</label>

                    <input
                        type="text"
                        name="poder_principal"
                        value={form.poder_principal}
                        onChange={handleChange}
                        required
                    />
                </div>

                <div>
                    <label>Nivel de poder</label>

                    <input
                        type="number"
                        name="nivel_poder"
                        min="1"
                        max="100"
                        value={form.nivel_poder}
                        onChange={handleChange}
                        required
                    />
                </div>

                <div>
                    <label>URL de imagen</label>

                    <input
                        type="url"
                        name="imagen_url"
                        value={form.imagen_url}
                        onChange={handleChange}
                    />
                </div>

                <div>
                    <label>Estado</label>

                    <select
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

                <button
                    type="button"
                    onClick={() => navigate("/heroes")}
                >
                    Cancelar
                </button>

            </form>
        </div>
    );
}

export default HeroForm;