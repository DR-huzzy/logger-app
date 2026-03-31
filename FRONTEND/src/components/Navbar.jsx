import { useNavigate, useLocation } from "react-router-dom";
import { useAuth } from "../context/AuthContext";
import { useState, useEffect } from "react";

const Navbar = () => {

    const { user, logout } = useAuth();
    const navigate = useNavigate();
    const location = useLocation();

    const [darkMode, setDarkMode] = useState(() => {
        return localStorage.getItem("darkMode") === "true";
    });

    useEffect(() => {
        if (darkMode) {
            document.documentElement.classList.add("dark");
        } else {
            document.documentElement.classList.remove("dark");
        }
        localStorage.setItem("darkMode", darkMode);
    }, [darkMode]);

    const handleLogout = async () => {
        await logout();
        navigate("/login");
    };

    const isActive = (path) => location.pathname === path;

    return (
        <nav className="bg-white dark:bg-gray-800 shadow-md px-6 py-4 flex items-center justify-between">

            {/* Left - App name and nav links */}
            <div className="flex items-center gap-6">
                <h1 className="text-xl font-bold text-blue-600 dark:text-blue-400">
                    Logger App
                </h1>

                {/* Admin nav links */}
                {user?.role === "ADMIN" && (
                    <div className="flex items-center gap-4">
                        <button
                            onClick={() => navigate("/admin/dashboard")}
                            className={`text-sm font-medium transition duration-200 ${
                                isActive("/admin/dashboard")
                                    ? "text-blue-600 dark:text-blue-400"
                                    : "text-gray-500 dark:text-gray-400 hover:text-blue-600 dark:hover:text-blue-400"
                            }`}
                        >
                            Dashboard
                        </button>
                        <button
                            onClick={() => navigate("/admin/users")}
                            className={`text-sm font-medium transition duration-200 ${
                                isActive("/admin/users")
                                    ? "text-blue-600 dark:text-blue-400"
                                    : "text-gray-500 dark:text-gray-400 hover:text-blue-600 dark:hover:text-blue-400"
                            }`}
                        >
                            Staff
                        </button>
                    </div>
                )}

                {/* Intern nav links */}
                {user?.role === "IT_INTERN" && (
                    <div className="flex items-center gap-4">
                        <button
                            onClick={() => navigate("/dashboard")}
                            className={`text-sm font-medium transition duration-200 ${
                                isActive("/dashboard")
                                    ? "text-blue-600 dark:text-blue-400"
                                    : "text-gray-500 dark:text-gray-400 hover:text-blue-600 dark:hover:text-blue-400"
                            }`}
                        >
                            Dashboard
                        </button>
                        <button
                            onClick={() => navigate("/logs/create")}
                            className={`text-sm font-medium transition duration-200 ${
                                isActive("/logs/create")
                                    ? "text-blue-600 dark:text-blue-400"
                                    : "text-gray-500 dark:text-gray-400 hover:text-blue-600 dark:hover:text-blue-400"
                            }`}
                        >
                            New Log
                        </button>
                    </div>
                )}
            </div>

            {/* Right - user info, dark mode, logout */}
            <div className="flex items-center gap-4">

                {/* User name and role */}
                <div className="text-right hidden sm:block">
                    <p className="text-sm font-medium text-gray-800 dark:text-white">
                        {user?.name || "User"}
                    </p>
                    <p className="text-xs text-gray-500 dark:text-gray-400">
                        {user?.role === "ADMIN" ? "Admin" : "IT Intern"}
                    </p>
                </div>

                {/* Dark mode toggle */}
                <button
                    onClick={() => setDarkMode(!darkMode)}
                    className="text-gray-600 dark:text-gray-300 hover:text-blue-600 dark:hover:text-blue-400 transition duration-200"
                >
                    {darkMode ? "☀️" : "🌙"}
                </button>

                {/* Logout button */}
                <button
                    onClick={handleLogout}
                    className="bg-red-500 hover:bg-red-600 text-white text-sm font-medium px-4 py-1.5 rounded-lg transition duration-200"
                >
                    Logout
                </button>

            </div>
        </nav>
    );
};

export default Navbar;