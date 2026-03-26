import { useState, useEffect } from "react";
import { useNavigate } from "react-router-dom";
import { useAuth } from "../context/AuthContext";


const Navbar = () => {

    const { user, logout} = useAuth();
    const navigate = useNavigate();

    // Dark mode state - check localStorage for saved preference

    const [darkMode, setDarkMode] = useState( () => {
        return localStorage.getItem("darkMode") === "true";
    });


    useEffect( () => {

        if (darkMode) {
            document.documentElement.classList.add("dark");
        }else{
            document.documentElement.classList.remove("dark");
        }
        localStorage.setItem("darkMode", darkMode);
    }, [darkMode]);


    const handleLogout = async () => {
        await logout();
        navigate("/login");
    }



    return (

        <nav className="bg-white dark:bg-gray-800 shadow-md px-6 py-4 flex items-center justify-between">

            {/* App name */}
            <h1 className="text-xl font-bold text-blue-600 dark:text-blue-400">
                Logger App
            </h1>

            {/* Right side */}
            <div className="flex items-center gap-4">


                {/* Role badge */}
                <span className="text-sm font-medium bg-blue-100 dark:bg-blue-900 text-blue-700 dark:text-blue-300 px-3 py-1 rounded-full">
                    {user?.role === "ADMIN" ? "Admin" : "IT Intern"}
                </span>


                {/* Dark mode toggle */}
                <button
                    onClick={() => setDarkMode(!darkMode)}
                    className="text-gray-600 dark:text-gray-300 hover:text-blue-600 dark:hover:text-blue-400 transition duration-200"
                >
                    {darkMode ? "☀️ Light" : "🌙 Dark"}
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
    )

};

export default Navbar;