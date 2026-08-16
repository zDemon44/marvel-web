import { NavLink, useNavigate } from "react-router-dom";
import { LayoutDashboard, Shield, Target, LogOut, ChevronLeft, ChevronRight } from "lucide-react";
import { useEffect, useState } from "react";
import api from "../services/api";
import "./Sidebar.css";

const WIDTH_EXPANDED = "250px";
const WIDTH_COLLAPSED = "76px";

function Sidebar() {
    const [collapsed, setCollapsed] = useState(false);
    const navigate = useNavigate();

    const user = JSON.parse(localStorage.getItem("user"));

    // Keep the shared --sidebar-width variable in sync so any page
    // layout (dashboard-page, etc.) tracks the sidebar's real width
    // instead of relying on a hardcoded margin.
    useEffect(() => {
        document.documentElement.style.setProperty(
            "--sidebar-width",
            collapsed ? WIDTH_COLLAPSED : WIDTH_EXPANDED
        );
    }, [collapsed]);

    const handleLogout = async () => {
        try {
            await api.post("/auth/logout");
        } catch (error) {
            console.error(error);
        } finally {
            localStorage.removeItem("token");
            localStorage.removeItem("user");
            navigate("/login");
        }
    };

    return (
        <aside className={`sidebar ${collapsed ? "collapsed" : ""}`}>

            <div className="sidebar-top">

                <div className="brand">
                    <span className="brand-box">M</span>

                    {!collapsed && (
                        <span className="brand-text">
                            MARVEL
                        </span>
                    )}
                </div>

            </div>

            <button
                className="sidebar-toggle"
                onClick={() => setCollapsed(!collapsed)}
                aria-label={collapsed ? "Expandir menú" : "Colapsar menú"}
            >
                {collapsed ? <ChevronRight size={16} /> : <ChevronLeft size={16} />}
            </button>

            <div className="sidebar-section">
                {!collapsed && (
                    <span className="section-title">
                        MENÚ
                    </span>
                )}

                <NavLink
                    to="/"
                    className={({ isActive }) =>
                        `sidebar-link ${isActive ? "active" : ""}`
                    }
                >
                    <LayoutDashboard size={20} />

                    {!collapsed && (
                        <span>Dashboard</span>
                    )}
                </NavLink>

                <NavLink
                    to="/heroes"
                    className={({ isActive }) =>
                        `sidebar-link ${isActive ? "active" : ""}`
                    }
                >
                    <Shield size={20} />

                    {!collapsed && (
                        <span>Superhéroes</span>
                    )}
                </NavLink>

                <NavLink
                    to="/misiones"
                    className={({ isActive }) =>
                        `sidebar-link ${isActive ? "active" : ""}`
                    }
                >
                    <Target size={20} />

                    {!collapsed && (
                        <span>Misiones</span>
                    )}
                </NavLink>
            </div>

            <div className="sidebar-bottom">

                {!collapsed && user && (
                    <div className="sidebar-user">
                        <div className="user-avatar">
                            {user.nombre?.charAt(0).toUpperCase()}
                        </div>

                        <div>
                            <strong>{user.nombre}</strong>
                            <small>{user.rol}</small>
                        </div>
                    </div>
                )}

                <button
                    className="logout-button"
                    onClick={handleLogout}
                >
                    <LogOut size={20} />

                    {!collapsed && (
                        <span>Cerrar sesión</span>
                    )}
                </button>

            </div>

        </aside>
    );
}

export default Sidebar;
