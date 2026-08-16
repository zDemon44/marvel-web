import {
    BrowserRouter,
    Routes,
    Route,
    Navigate
} from "react-router-dom";

import Login from "./pages/Login";
import Home from "./pages/Home";
import Heroes from "./pages/Heroes";
import HeroDetail from "./pages/HeroDetail";
import HeroForm from "./pages/HeroForm";
import Misiones from "./pages/Misiones";
import MisionForm from "./pages/MisionForm";
import Sidebar from "./components/Sidebar";

function ProtectedRoute({ children }) {
    const token = localStorage.getItem("token");

    if (!token) {
        return <Navigate to="/login" replace />;
    }

    return (
        <>
            <Sidebar />
            {children}
        </>
    );
}

function App() {
    return (
        <BrowserRouter>
            <Routes>

                <Route
                    path="/login"
                    element={<Login />}
                />

                <Route
                    path="/"
                    element={
                        <ProtectedRoute>
                            <Home />
                        </ProtectedRoute>
                    }
                />

                <Route
                    path="/heroes"
                    element={
                        <ProtectedRoute>
                            <Heroes />
                        </ProtectedRoute>
                    }
                />

                <Route
                    path="/heroes/nuevo"
                    element={
                        <ProtectedRoute>
                            <HeroForm />
                        </ProtectedRoute>
                    }
                />

                <Route
                    path="/heroes/editar/:id"
                    element={
                        <ProtectedRoute>
                            <HeroForm />
                        </ProtectedRoute>
                    }
                />

                <Route
                    path="/heroes/:id"
                    element={
                        <ProtectedRoute>
                            <HeroDetail />
                        </ProtectedRoute>
                    }
                />

                <Route
                    path="/misiones"
                    element={
                        <ProtectedRoute>
                            <Misiones />
                        </ProtectedRoute>
                    }
                />

                <Route
                    path="/misiones/nueva"
                    element={
                        <ProtectedRoute>
                            <MisionForm />
                        </ProtectedRoute>
                    }
                />

                <Route
                    path="/misiones/editar/:id"
                    element={
                        <ProtectedRoute>
                            <MisionForm />
                        </ProtectedRoute>
                    }
                />

                <Route
                    path="*"
                    element={<Navigate to="/" replace />}
                />

            </Routes>
        </BrowserRouter>
    );
}

export default App;