import { useEffect, useState } from "react";

import {
    BarChart,
    Bar,
    XAxis,
    YAxis,
    CartesianGrid,
    Tooltip,
    ResponsiveContainer,
    PieChart,
    Pie,
    Cell,
    Legend,
} from "recharts";

import {
    Shield,
    Target,
    Zap,
    CheckCircle,
} from "lucide-react";

import api from "../services/api";

import "./Home.css";

function Home() {

    const user = JSON.parse(localStorage.getItem("user"));

    const [heroes, setHeroes] = useState([]);
    const [misiones, setMisiones] = useState([]);

    const [loading, setLoading] = useState(true);
    const [error, setError] = useState("");

    useEffect(() => {
        cargarDashboard();
    }, []);

    const cargarDashboard = async () => {

        try {

            setLoading(true);

            const [heroesResponse, misionesResponse] =
                await Promise.all([
                    api.get("/heroes"),
                    api.get("/misiones"),
                ]);

            setHeroes(heroesResponse.data.data);
            setMisiones(misionesResponse.data.data);

        } catch (error) {

            console.error(error);

            setError(
                "No se pudieron cargar los datos del dashboard."
            );

        } finally {

            setLoading(false);

        }
    };

    /*
     * MISIÓN POR SUPERHÉROE
     */

    const misionesPorHeroe = heroes
        .map((hero) => {

            const cantidad = misiones.filter(
                (mision) =>
                    Number(mision.superheroe_id) ===
                    Number(hero.id)
            ).length;

            return {
                nombre: hero.nombre,
                misiones: cantidad,
            };

        })
        .filter((hero) => hero.misiones > 0);


    /*
     * ESTADO DE MISIONES
     */

    const misionesPorEstado = [
        {
            nombre: "Pendientes",
            cantidad: misiones.filter(
                (m) => m.estado === "PENDIENTE"
            ).length,
        },
        {
            nombre: "En progreso",
            cantidad: misiones.filter(
                (m) => m.estado === "EN_PROGRESO"
            ).length,
        },
        {
            nombre: "Completadas",
            cantidad: misiones.filter(
                (m) => m.estado === "COMPLETADA"
            ).length,
        },
    ];


    /*
     * ESTADÍSTICAS
     */

    const heroesActivos = heroes.filter(
        (hero) => hero.estado === "ACTIVO"
    ).length;

    const misionesCompletadas = misiones.filter(
        (mision) => mision.estado === "COMPLETADA"
    ).length;


    if (loading) {

        return (
            <main className="dashboard-page loading-page">
                <div className="loader"></div>

                <p>
                    Cargando dashboard...
                </p>
            </main>
        );

    }


    if (error) {

        return (
            <main className="dashboard-page">

                <div className="error-box">

                    <h2>Algo salió mal</h2>

                    <p>{error}</p>

                    <button onClick={cargarDashboard}>
                        Reintentar
                    </button>

                </div>

            </main>
        );

    }


    return (
        <main className="dashboard-page">

            <header className="dashboard-header">

                <div>

                    <span className="dashboard-label">
                        MARVEL MANAGER
                    </span>

                    <h1>
                        Dashboard
                    </h1>

                    <p>
                        Bienvenido de nuevo,{" "}
                        <strong>
                            {user?.nombre}
                        </strong>
                        . Aquí tienes un resumen del sistema.
                    </p>

                </div>

                <div className="header-user">

                    <div className="header-avatar">
                        {user?.nombre
                            ?.charAt(0)
                            .toUpperCase()}
                    </div>

                    <div>
                        <strong>
                            {user?.nombre}
                        </strong>

                        <span>
                            {user?.rol}
                        </span>
                    </div>

                </div>

            </header>


            {/* ESTADÍSTICAS */}

            <section className="stats-grid">

                <div className="stat-card">

                    <div className="stat-icon red">
                        <Shield size={24} />
                    </div>

                    <div>
                        <span>
                            Superhéroes
                        </span>

                        <strong>
                            {heroes.length}
                        </strong>
                    </div>

                </div>


                <div className="stat-card">

                    <div className="stat-icon blue">
                        <Target size={24} />
                    </div>

                    <div>
                        <span>
                            Misiones
                        </span>

                        <strong>
                            {misiones.length}
                        </strong>
                    </div>

                </div>


                <div className="stat-card">

                    <div className="stat-icon yellow">
                        <Zap size={24} />
                    </div>

                    <div>
                        <span>
                            Héroes activos
                        </span>

                        <strong>
                            {heroesActivos}
                        </strong>
                    </div>

                </div>


                <div className="stat-card">

                    <div className="stat-icon green">
                        <CheckCircle size={24} />
                    </div>

                    <div>
                        <span>
                            Completadas
                        </span>

                        <strong>
                            {misionesCompletadas}
                        </strong>
                    </div>

                </div>

            </section>


            {/* GRÁFICOS */}

            <section className="charts-grid">


                {/* BARRAS */}

                <div className="chart-card large">

                    <div className="chart-title">

                        <div>

                            <h2>
                                Misiones por superhéroe
                            </h2>

                            <p>
                                Misiones asignadas actualmente
                            </p>

                        </div>

                    </div>

                    <div className="chart-container">

                        <ResponsiveContainer
                            width="100%"
                            height="100%"
                        >

                            <BarChart
                                data={misionesPorHeroe}
                            >

                                <CartesianGrid
                                    strokeDasharray="3 3"
                                    vertical={false}
                                />

                                <XAxis
                                    dataKey="nombre"
                                    axisLine={false}
                                    tickLine={false}
                                />

                                <YAxis
                                    allowDecimals={false}
                                    axisLine={false}
                                    tickLine={false}
                                />

                                <Tooltip />

                                <Bar
                                    dataKey="misiones"
                                    name="Misiones"
                                    radius={[6, 6, 0, 0]}
                                />

                            </BarChart>

                        </ResponsiveContainer>

                    </div>

                </div>


                {/* PIE */}

                <div className="chart-card">

                    <div className="chart-title">

                        <div>

                            <h2>
                                Estado de misiones
                            </h2>

                            <p>
                                Distribución actual
                            </p>

                        </div>

                    </div>

                    <div className="chart-container">

                        <ResponsiveContainer
                            width="100%"
                            height="100%"
                        >

                            <PieChart>

                                <Pie
                                    data={misionesPorEstado}
                                    dataKey="cantidad"
                                    nameKey="nombre"
                                    cx="50%"
                                    cy="50%"
                                    outerRadius={110}
                                    label
                                >

                                    {misionesPorEstado.map(
                                        (_, index) => (
                                            <Cell
                                                key={index}
                                            />
                                        )
                                    )}

                                </Pie>

                                <Tooltip />

                                <Legend />

                            </PieChart>

                        </ResponsiveContainer>

                    </div>

                </div>

            </section>


            {/* ÚLTIMAS MISIONES */}

            <section className="missions-card">

                <div className="chart-title">

                    <div>

                        <h2>
                            Misiones recientes
                        </h2>

                        <p>
                            Últimas misiones registradas
                        </p>

                    </div>

                </div>

                <div className="missions-list">

                    {misiones.slice(0, 5).map(
                        (mision) => (

                            <div
                                className="mission-row"
                                key={mision.id}
                            >

                                <div className="mission-info">

                                    <div className="mission-icon">
                                        <Target size={18} />
                                    </div>

                                    <div>

                                        <strong>
                                            {mision.titulo}
                                        </strong>

                                        <span>
                                            {mision.ubicacion}
                                        </span>

                                    </div>

                                </div>

                                <span
                                    className={`mission-status ${mision.estado.toLowerCase()}`}
                                >
                                    {mision.estado}
                                </span>

                            </div>

                        )
                    )}

                </div>

            </section>

        </main>
    );
}

export default Home;