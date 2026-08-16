import { useEffect, useState } from "react";
import { Link, useParams } from "react-router-dom";
import { ArrowLeft, Shield, Sparkles, Gauge, BadgeCheck } from "lucide-react";
import api from "../services/api";
import "./HeroDetail.css";

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
        return (
            <main className="dashboard-page loading-page">
                <div className="loader"></div>
                <p>Cargando superhéroe...</p>
            </main>
        );
    }

    if (error) {
        return (
            <main className="dashboard-page">
                <div className="error-box">
                    <h2>Algo salió mal</h2>
                    <p>{error}</p>
                    <Link to="/heroes" className="back-link">
                        Volver a héroes
                    </Link>
                </div>
            </main>
        );
    }

    return (
        <main className="dashboard-page hero-detail-page">
            <header className="dashboard-header hero-detail-header">
                <div>
                    <span className="dashboard-label">MARVEL FILE</span>
                    <h1>{hero.nombre}</h1>
                    <p>
                        Ficha del agente especial del sistema.
                    </p>
                </div>

                <Link to="/heroes" className="back-button">
                    <ArrowLeft size={16} />
                    Volver a héroes
                </Link>
            </header>

            <section className="detail-layout">
                <div className="detail-card hero-visual-card">
                    <div className="hero-image-frame">
                        <img
                            src={hero.imagen_url}
                            alt={hero.nombre}
                        />
                    </div>
                </div>

                <div className="detail-card hero-info-card">
                    <div className="info-topline">
                        <span className="chart-tag">IDENTIDAD</span>
                        <span className={`status-badge ${hero.estado?.toLowerCase()}`}>
                            {hero.estado}
                        </span>
                    </div>

                    <h2>{hero.nombre}</h2>

                    <div className="hero-summary">
                        <p>
                            <strong>Nombre real:</strong> {hero.nombre_real}
                        </p>
                        <p>
                            <strong>Poder principal:</strong> {hero.poder_principal}
                        </p>
                    </div>

                    <div className="stats-grid hero-stats-grid">
                        <div className="stat-card hero-stat-card">
                            <div className="stat-icon red">
                                <Shield size={22} />
                            </div>
                            <div>
                                <span>Nombre real</span>
                                <strong>{hero.nombre_real}</strong>
                            </div>
                        </div>

                        <div className="stat-card hero-stat-card">
                            <div className="stat-icon blue">
                                <Sparkles size={22} />
                            </div>
                            <div>
                                <span>Poder</span>
                                <strong>{hero.poder_principal}</strong>
                            </div>
                        </div>

                        <div className="stat-card hero-stat-card">
                            <div className="stat-icon yellow">
                                <Gauge size={22} />
                            </div>
                            <div>
                                <span>Nivel</span>
                                <strong>{hero.nivel_poder}</strong>
                            </div>
                        </div>

                        <div className="stat-card hero-stat-card">
                            <div className="stat-icon green">
                                <BadgeCheck size={22} />
                            </div>
                            <div>
                                <span>Estado</span>
                                <strong>{hero.estado}</strong>
                            </div>
                        </div>
                    </div>
                </div>
            </section>
        </main>
    );
}

export default HeroDetail;