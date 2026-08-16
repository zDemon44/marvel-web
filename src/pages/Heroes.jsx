import { useEffect, useState } from "react";
import { Link } from "react-router-dom";
import {
    Search,
    Plus,
    Eye,
    Pencil,
    Trash2,
    Shield,
    Zap,
    RefreshCw,
    Star,
} from "lucide-react";

import api from "../services/api";
import "./Heroes.css";

function Heroes() {
    const [heroes, setHeroes] = useState([]);
    const [loading, setLoading] = useState(true);
    const [error, setError] = useState("");
    const [search, setSearch] = useState("");
    const [confirmacionHeroe, setConfirmacionHeroe] = useState(null);
    const [favoritos, setFavoritos] = useState(() => {
    const favoritosGuardados = localStorage.getItem("favoritos");

        return favoritosGuardados
            ? JSON.parse(favoritosGuardados)
            : [];
    });
    const user = JSON.parse(localStorage.getItem("user"));
    const esAdmin = user?.rol === "ADMIN";

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

    const toggleFavorito = (id) => {
        setFavoritos((favoritosActuales) => {
            let nuevosFavoritos;

            if (favoritosActuales.includes(id)) {
                nuevosFavoritos = favoritosActuales.filter(
                    (favoritoId) => favoritoId !== id
                );
            } else {
                nuevosFavoritos = [
                    ...favoritosActuales,
                    id,
                ];
            }

            localStorage.setItem(
                "favoritos",
                JSON.stringify(nuevosFavoritos)
            );

            return nuevosFavoritos;
        });
    };
    
    const abrirConfirmacionHeroe = async (hero) => {
        try {
            const response = await api.get("/misiones");
            const misionesAsociadas = response.data.data.filter(
                (mision) => Number(mision.superheroe_id) === Number(hero.id)
            );

            setConfirmacionHeroe({
                id: hero.id,
                nombre: hero.nombre,
                misionesAsociadas,
            });
        } catch (error) {
            console.error(error);
            alert("No se pudo verificar las misiones asociadas.");
        }
    };

    const confirmarEliminacionHeroe = async () => {
        if (!confirmacionHeroe) {
            return;
        }

        try {
            await api.delete(`/heroes/${confirmacionHeroe.id}`);

            setHeroes((heroesActuales) =>
                heroesActuales.filter(
                    (hero) => hero.id !== confirmacionHeroe.id
                )
            );

            setConfirmacionHeroe(null);
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
        return (
            <main className="heroes-page heroes-loading">
                <div className="heroes-loader"></div>

                <p>Cargando superhéroes...</p>
            </main>
        );
    }

    if (error) {
        return (
            <main className="heroes-page">
                <div className="heroes-error">
                    <div className="heroes-error-icon">
                        <Shield size={32} />
                    </div>

                    <span className="heroes-tag">ERROR</span>

                    <h2>No pudimos cargar los héroes</h2>

                    <p>{error}</p>

                    <button onClick={cargarHeroes}>
                        <RefreshCw size={17} />
                        Reintentar
                    </button>
                </div>
            </main>
        );
    }

    return (
        <main className="heroes-page">

            {/* HEADER */}

            <header className="heroes-header">

                <div>
                    <span className="heroes-label">
                        MARVEL MANAGER
                    </span>

                    <h1>Superhéroes</h1>

                    <p>
                        Gestiona los superhéroes registrados en el sistema.
                    </p>
                </div>

                {esAdmin && (
                    <Link
                        to="/heroes/nuevo"
                        className="new-hero-button"
                    >
                        <Plus size={19} />
                        Nuevo superhéroe
                    </Link>
                )}

            </header>


            {/* BUSCADOR */}

            <section className="heroes-toolbar">

                <div className="heroes-search">

                    <Search size={19} />

                    <input
                        type="text"
                        placeholder="Buscar superhéroe por nombre..."
                        value={search}
                        onChange={(e) => setSearch(e.target.value)}
                    />

                    {search && (
                        <button
                            className="clear-search"
                            onClick={() => setSearch("")}
                        >
                            ×
                        </button>
                    )}

                </div>

                <div className="heroes-counter">

                    <strong>
                        {heroesFiltrados.length}
                    </strong>

                    <span>
                        {heroesFiltrados.length === 1
                            ? " SUPERHÉROE"
                            : " SUPERHÉROES"}
                    </span>

                </div>

            </section>


            {/* SIN RESULTADOS */}

            {heroesFiltrados.length === 0 ? (

                <section className="heroes-empty">

                    <div className="empty-icon">
                        <Search size={34} />
                    </div>

                    <span className="heroes-tag">
                        SIN RESULTADOS
                    </span>

                    <h2>No encontramos superhéroes</h2>

                    <p>
                        No hay superhéroes que coincidan con
                        <strong> "{search}"</strong>.
                    </p>

                    {search && (
                        <button
                            onClick={() => setSearch("")}
                            className="empty-button"
                        >
                            Limpiar búsqueda
                        </button>
                    )}

                </section>

            ) : (

                /* GRID DE HÉROES */

                <section className="heroes-grid">

                    {heroesFiltrados.map((hero) => (

                        <article
                            className="hero-card"
                            key={hero.id}
                        >

                            {/* IMAGEN */}

                            <div className="hero-image-container">

                                <img
                                    src={hero.imagen_url}
                                    alt={hero.nombre}
                                    className="hero-image"
                                    onError={(e) => {
                                        e.currentTarget.style.display =
                                            "none";
                                        e.currentTarget.parentElement.classList.add(
                                            "image-error"
                                        );
                                    }}
                                />

                                <button
                                    type="button"
                                    className={`hero-favorite ${
                                        favoritos.includes(hero.id)
                                            ? "favorito"
                                            : ""
                                    }`}
                                    onClick={() => toggleFavorito(hero.id)}
                                    aria-label={
                                        favoritos.includes(hero.id)
                                            ? `Quitar ${hero.nombre} de favoritos`
                                            : `Agregar ${hero.nombre} a favoritos`
                                    }
                                >
                                    <Star
                                        size={18}
                                        fill={
                                            favoritos.includes(hero.id)
                                                ? "currentColor"
                                                : "none"
                                        }
                                    />
                                </button>

                                <span
                                    className={`hero-status ${
                                        hero.estado === "ACTIVO"
                                            ? "activo"
                                            : "inactivo"
                                    }`}
                                >
                                    {hero.estado}
                                </span>

                            </div>


                            {/* INFORMACIÓN */}

                            <div className="hero-content">

                                <span className="hero-type">
                                    SUPERHÉROE
                                </span>

                                <h2>
                                    {hero.nombre}
                                </h2>

                                <div className="hero-power">

                                    <Zap size={16} />

                                    <span>
                                        {hero.poder_principal}
                                    </span>

                                </div>


                                {/* NIVEL */}

                                <div className="power-level">

                                    <div className="power-level-header">

                                        <span>
                                            NIVEL DE PODER
                                        </span>

                                        <strong>
                                            {hero.nivel_poder}/100
                                        </strong>

                                    </div>

                                    <div className="power-bar">

                                        <div
                                            className="power-bar-fill"
                                            style={{
                                                width: `${hero.nivel_poder}%`,
                                            }}
                                        ></div>

                                    </div>

                                </div>


                                {/* ACCIONES */}

                                <div className="hero-actions">

                                    <Link
                                        to={`/heroes/${hero.id}`}
                                        className="hero-action view"
                                    >
                                        <Eye size={16} />
                                        Ver detalle
                                    </Link>

                                    {esAdmin && (
                                        <>
                                            <Link
                                                to={`/heroes/editar/${hero.id}`}
                                                className="hero-action edit"
                                            >
                                                <Pencil size={16} />
                                                Editar
                                            </Link>

                                            <button
                                                className="hero-action delete"
                                                onClick={() =>
                                                    abrirConfirmacionHeroe(hero)
                                                }
                                            >
                                                <Trash2 size={16} />
                                            </button>
                                        </>
                                    )}

                                </div>

                            </div>

                        </article>

                    ))}

                </section>

            )}

            {confirmacionHeroe && (
                <div
                    className="delete-modal-backdrop"
                    onClick={() => setConfirmacionHeroe(null)}
                >
                    <div
                        className="delete-modal"
                        onClick={(event) => event.stopPropagation()}
                    >
                        <div className="delete-modal-icon">
                            <Trash2 size={28} />
                        </div>

                        <span className="heroes-tag delete-modal-tag">
                            CONFIRMACIÓN
                        </span>

                        <h3>Eliminar superhéroe</h3>

                        <p>
                            ¿Estás seguro de que deseas eliminar a{" "}
                            <strong>{confirmacionHeroe.nombre}</strong>?{" "}
                            {confirmacionHeroe.misionesAsociadas.length > 0
                                ? `Esta acción también borrará ${confirmacionHeroe.misionesAsociadas.length} misión(es) asignada(s) a este héroe.`
                                : "Se eliminará el registro del héroe."}
                        </p>

                        <div className="delete-modal-actions">
                            <button
                                className="modal-cancel-button"
                                onClick={() => setConfirmacionHeroe(null)}
                            >
                                Cancelar
                            </button>

                            <button
                                className="modal-confirm-button"
                                onClick={confirmarEliminacionHeroe}
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

export default Heroes;