import { useEffect, useState } from "react";
import { Link } from "react-router-dom";
import {
    Search,
    Plus,
    Pencil,
    Trash2,
    MapPin,
    CalendarDays,
    Shield,
    AlertTriangle,
    RefreshCw,
    Target,
} from "lucide-react";

import api from "../services/api";
import "./Misiones.css";

function Misiones() {
    const [misiones, setMisiones] = useState([]);
    const [loading, setLoading] = useState(true);
    const [error, setError] = useState("");
    const [search, setSearch] = useState("");
    const [confirmacionMision, setConfirmacionMision] = useState(null);

    const user = JSON.parse(localStorage.getItem("user"));
    const esAdmin = user?.rol === "ADMIN";

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

    const confirmarEliminacionMision = async () => {
        if (!confirmacionMision) {
            return;
        }

        try {
            await api.delete(`/misiones/${confirmacionMision.id}`);

            setMisiones((misionesActuales) =>
                misionesActuales.filter(
                    (mision) => mision.id !== confirmacionMision.id
                )
            );

            setConfirmacionMision(null);
        } catch (error) {
            console.error(error);

            if (error.response?.data?.message) {
                alert(error.response.data.message);
            } else {
                alert("No se pudo eliminar la misión.");
            }
        }
    };

    const misionesFiltradas = misiones.filter((mision) =>
        mision.titulo
            .toLowerCase()
            .includes(search.toLowerCase())
    );

    const obtenerClaseEstado = (estado) => {
        switch (estado) {
            case "COMPLETADA":
                return "completada";

            case "EN_PROGRESO":
                return "en_progreso";

            case "PENDIENTE":
                return "pendiente";

            default:
                return "";
        }
    };

    const obtenerClasePeligro = (nivel) => {
        switch (nivel) {
            case "ALTO":
                return "alto";

            case "MEDIO":
                return "medio";

            case "BAJO":
                return "bajo";

            default:
                return "";
        }
    };

    const formatearEstado = (estado) => {
        if (estado === "EN_PROGRESO") {
            return "EN PROGRESO";
        }

        return estado;
    };

    const formatearFecha = (fecha) => {
        if (!fecha) {
            return "Sin fecha";
        }

        const fechaLimpia = fecha.split("T")[0];

        const partes = fechaLimpia.split("-");

        if (partes.length === 3) {
            return `${partes[2]}/${partes[1]}/${partes[0]}`;
        }

        return fechaLimpia;
    };

    if (loading) {
        return (
            <main className="misiones-page misiones-loading">
                <div className="misiones-loader"></div>

                <p>Cargando misiones...</p>
            </main>
        );
    }

    if (error) {
        return (
            <main className="misiones-page">
                <div className="misiones-error">

                    <div className="misiones-error-icon">
                        <Shield size={32} />
                    </div>

                    <span className="misiones-tag">
                        ERROR
                    </span>

                    <h2>
                        No pudimos cargar las misiones
                    </h2>

                    <p>{error}</p>

                    <button onClick={cargarMisiones}>
                        <RefreshCw size={17} />
                        Reintentar
                    </button>

                </div>
            </main>
        );
    }

    return (
        <main className="misiones-page">

            {/* HEADER */}

            <header className="misiones-header">

                <div>

                    <span className="misiones-label">
                        MARVEL MANAGER
                    </span>

                    <h1>Misiones</h1>

                    <p>
                        Administra las misiones asignadas a los
                        superhéroes.
                    </p>

                </div>

                {esAdmin && (
                    <Link
                        to="/misiones/nueva"
                        className="new-mission-button"
                    >
                        <Plus size={19} />
                        Nueva misión
                    </Link>
                )}

            </header>


            {/* TOOLBAR */}

            <section className="misiones-toolbar">

                <div className="misiones-search">

                    <Search size={19} />

                    <input
                        type="text"
                        placeholder="Buscar misión por título..."
                        value={search}
                        onChange={(e) =>
                            setSearch(e.target.value)
                        }
                    />

                    {search && (
                        <button
                            className="clear-mission-search"
                            onClick={() => setSearch("")}
                        >
                            ×
                        </button>
                    )}

                </div>

                <div className="misiones-counter">

                    <strong>
                        {misionesFiltradas.length}
                    </strong>

                    <span>
                        {misionesFiltradas.length === 1
                            ? " MISIÓN"
                            : " MISIONES"}
                    </span>

                </div>

            </section>


            {/* SIN RESULTADOS */}

            {misionesFiltradas.length === 0 ? (

                <section className="misiones-empty">

                    <div className="mission-empty-icon">
                        <Target size={34} />
                    </div>

                    <span className="misiones-tag">
                        SIN RESULTADOS
                    </span>

                    <h2>
                        No encontramos misiones
                    </h2>

                    <p>
                        {search
                            ? `No hay misiones que coincidan con "${search}".`
                            : "Todavía no hay misiones registradas."}
                    </p>

                    {search && (
                        <button
                            onClick={() => setSearch("")}
                            className="empty-mission-button"
                        >
                            Limpiar búsqueda
                        </button>
                    )}

                </section>

            ) : (

                /* GRID DE MISIONES */

                <section className="misiones-grid">

                    {misionesFiltradas.map((mision) => (

                        <article
                            className="mission-card"
                            key={mision.id}
                        >

                            {/* CABECERA */}

                            <div className="mission-card-header">

                                <div className="mission-number">
                                    MISSION #
                                    {String(mision.id).padStart(
                                        2,
                                        "0"
                                    )}
                                </div>

                                <span
                                    className={`mission-status ${
                                        obtenerClaseEstado(
                                            mision.estado
                                        )
                                    }`}
                                >
                                    {formatearEstado(
                                        mision.estado
                                    )}
                                </span>

                            </div>


                            {/* CONTENIDO */}

                            <div className="mission-content">

                                <span className="mission-type">
                                    OPERACIÓN MARVEL
                                </span>

                                <h2>
                                    {mision.titulo}
                                </h2>

                                <p className="mission-description">
                                    {mision.descripcion}
                                </p>


                                {/* DATOS */}

                                <div className="mission-data">

                                    <div className="mission-data-item">

                                        <MapPin size={17} />

                                        <div>
                                            <span>
                                                UBICACIÓN
                                            </span>

                                            <strong>
                                                {mision.ubicacion}
                                            </strong>
                                        </div>

                                    </div>


                                    <div className="mission-data-item">

                                        <CalendarDays size={17} />

                                        <div>
                                            <span>
                                                FECHA
                                            </span>

                                            <strong>
                                                {formatearFecha(
                                                    mision.fecha
                                                )}
                                            </strong>
                                        </div>

                                    </div>

                                </div>


                                {/* HÉROE Y PELIGRO */}

                                <div className="mission-bottom-data">

                                    <div className="assigned-hero">

                                        <Shield size={17} />

                                        <div>

                                            <span>
                                                SUPERHÉROE ASIGNADO
                                            </span>

                                            <strong>
                                                {mision.heroe?.nombre ||
                                                    `ID ${mision.superheroe_id}`}
                                            </strong>

                                        </div>

                                    </div>


                                    <div
                                        className={`danger-level ${
                                            obtenerClasePeligro(
                                                mision.nivel_peligro
                                            )
                                        }`}
                                    >

                                        <AlertTriangle size={15} />

                                        <span>
                                            PELIGRO
                                        </span>

                                        <strong>
                                            {mision.nivel_peligro}
                                        </strong>

                                    </div>

                                </div>

                            </div>


                            {/* ACCIONES */}

                            {esAdmin && (
                                <div className="mission-actions">

                                    <Link
                                        to={`/misiones/editar/${mision.id}`}
                                        className="mission-action edit"
                                    >
                                        <Pencil size={16} />
                                        Editar misión
                                    </Link>

                                    <button
                                        className="mission-action delete"
                                        onClick={() =>
                                            setConfirmacionMision({
                                                id: mision.id,
                                                titulo: mision.titulo,
                                            })
                                        }
                                    >
                                        <Trash2 size={16} />
                                    </button>

                                </div>
                            )}

                        </article>

                    ))}

                </section>

            )}

            {confirmacionMision && (
                <div
                    className="delete-modal-backdrop"
                    onClick={() => setConfirmacionMision(null)}
                >
                    <div
                        className="delete-modal"
                        onClick={(event) => event.stopPropagation()}
                    >
                        <div className="delete-modal-icon">
                            <Trash2 size={28} />
                        </div>

                        <span className="misiones-tag delete-modal-tag">
                            CONFIRMACIÓN
                        </span>

                        <h3>Eliminar misión</h3>

                        <p>
                            ¿Estás seguro de que deseas eliminar la misión{" "}
                            <strong>"{confirmacionMision.titulo}"</strong>? Esta acción borrará permanentemente este registro y no se podrá deshacer.
                        </p>

                        <div className="delete-modal-actions">
                            <button
                                className="modal-cancel-button"
                                onClick={() => setConfirmacionMision(null)}
                            >
                                Cancelar
                            </button>

                            <button
                                className="modal-confirm-button"
                                onClick={confirmarEliminacionMision}
                            >
                                Confirmar
                            </button>
                        </div>
                    </div>
                </div>
            )}

        </main>
    );
}

export default Misiones;