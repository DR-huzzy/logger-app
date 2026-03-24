import { useState } from "react";
import { useNavigate } from "react-router-dom";
import { useAuth } from "../../context/AuthContext";

const Login = () => {
    const { login } = useAuth();
    const navigate = useNavigate();
    
    const [email, setEmail] = useState("");
    const [password, setPassword] = useState("");
    const [loading, setLoading] = useState(false);
    const [error, setError] = useState("");


    const handleSubmit = async (e) => {

        e.preventDefault();
        setError("");
        setLoading(true);

    


        try {
            // login returns the role so we can redirect accordingly

            const role = await login(email, password);

            if (role === "ADMIN") {
                navigate("/admin/dashboard");
            } else {
                navigate("dashboard");
            }

        }catch (err) {
            setError( "Invalid email or password")
            console.log(err);
        }finally{
            setLoading(false);
        }

    }

    return (

        <div className="min-h-screen flex items-center justify-center bg-gray-100 dark:bg-gray-900">
            <div className="bg-white dark:bg-gray-800 p-8 rounded-lg shadow-md w-full max-w-md">

                <h1 className="text-2xl font-bold text-center text-gray-800 dark:text-white mb-2">
                    Logger App
                </h1>

                <p className="text-center text-gray-500 dark:text-gray-400 mb-6">
                    Sign in to your account
                </p>

                {/* Error message */}
                {error && (
                    <div className="bg-red-100 text-red-600 p-3 rounded mb-4 text-sm">
                        {error}
                    </div>
                )}



                {/* Form */}
                <form onSubmit={handleSubmit} className="space-y-4">

                    <div>
                        <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-1">
                            Email
                        </label>

                        <input 
                            type="email"
                            value={email}
                            onChange={ (e) => setEmail(e.target.value)}
                            placeholder="Enter your email"
                            required
                            className="w-full px-4 py-2 border border-gray-300 dark:border-gray-600 
                                    rounded-lg bg-white dark:bg-gray-700 text-gray-800 dark:text-white 
                                    focus:outline-none focus:ring-2 focus:ring-blue-500" 
                        />

                    </div>




                    <div>
                        <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-1">
                            Password
                        </label>

                        <input 
                            type="password"
                            value={password}
                            onChange={ (e) => setPassword(e.target.value)}
                            placeholder="Enter your Password"
                            required
                            className="w-full px-4 py-2 border border-gray-300 dark:border-gray-600
                                    rounded-lg bg-white dark:bg-gray-700 text-gray-800 dark:text-white 
                                    focus:outline-none focus:ring-2 focus:ring-blue-500"

                        />
                    </div>


                    <button
                        type="submit"
                        disabled={loading}
                        className="w-full bg-blue-600 hover:bg-blue-700 text-white
                                     font-semibold py-2 rounded-lg transition 
                                     duration-200 disabled:opacity-50"
                    >
                        {loading ? "Signing in..." : "Sign In"}
                    </button>
                </form>

            </div>
        </div>
    )

}




export default Login;