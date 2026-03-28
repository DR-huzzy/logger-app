import { useState } from "react";
import { useNavigate } from "react-router-dom";
import Navbar from "../../components/Navbar";
import { useAuth } from "../../context/AuthContext";
import api from "../../api/axios";

const CreateLog = () => {

    const { accessToken, user } = useAuth();
    const navigate = useNavigate();

    const [formData, setFormData] = useState({
        department: "",
        personWithProblem: "",
        problem: "",
        solution: "",
        solvedBy: "",
        status: "SOLVED"
    });

    const [error, setError] = useState("");
    const [loading, setLoading] = useState(false);

    // Handle input changes for all fields
    const handleChange = (e) => {
        setFormData({ ...formData, [e.target.name]: e.target.value });
    };

    const handleSubmit = async (e) => {
        e.preventDefault();
        setError("");
        setLoading(true);

        try {
            await api.post("/logs", formData, {
                headers: { Authorization: `Bearer ${accessToken}` }
            });

            // Redirect based on role
            if (user.role === "ADMIN") {
                navigate("/admin/dashboard");
            } else {
                navigate("/dashboard");
            }

        } catch (err) {
            setError(err.response?.data?.message || "Failed to create log entry");
        } finally {
            setLoading(false);
        }
    };

    return (
        <div className="min-h-screen bg-gray-100 dark:bg-gray-900">

            <Navbar />

            <div className="p-6 max-w-lg mx-auto">

                {/* Back button */}
                <button
                    onClick={() => navigate(user.role === "ADMIN" ? "/admin/dashboard" : "/dashboard")}
                    className="text-sm text-gray-500 dark:text-gray-400 hover:text-blue-600 dark:hover:text-blue-400 mb-6 flex items-center gap-1 transition duration-200"
                >
                    ← Back to Dashboard
                </button>

                {/* Card */}
                <div className="bg-white dark:bg-gray-800 rounded-2xl shadow p-6">

                    <h2 className="text-2xl font-bold text-gray-800 dark:text-white mb-1">
                        New Log Entry
                    </h2>
                    <p className="text-sm text-gray-500 dark:text-gray-400 mb-6">
                        Fill in the details of the problem and solution
                    </p>

                    {/* Error message */}
                    {error && (
                        <div className="bg-red-50 dark:bg-red-900/30 text-red-600 dark:text-red-400 text-sm p-3 rounded-lg mb-4">
                            {error}
                        </div>
                    )}

                    <form onSubmit={handleSubmit} className="space-y-4">

                        <div>
                            <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-1">
                                Department
                            </label>
                            <input
                                type="text"
                                name="department"
                                value={formData.department}
                                onChange={handleChange}
                                placeholder="e.g. IT, Workshop, Admin"
                                required
                                className="w-full px-4 py-2 border border-gray-300 dark:border-gray-600 rounded-lg bg-white dark:bg-gray-700 text-gray-800 dark:text-white focus:outline-none focus:ring-2 focus:ring-blue-500"
                            />
                        </div>

                        <div>
                            <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-1">
                                Person With Problem
                            </label>
                            <input
                                type="text"
                                name="personWithProblem"
                                value={formData.personWithProblem}
                                onChange={handleChange}
                                placeholder="Enter their name"
                                required
                                className="w-full px-4 py-2 border border-gray-300 dark:border-gray-600 rounded-lg bg-white dark:bg-gray-700 text-gray-800 dark:text-white focus:outline-none focus:ring-2 focus:ring-blue-500"
                            />
                        </div>

                        <div>
                            <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-1">
                                Problem
                            </label>
                            <textarea
                                name="problem"
                                value={formData.problem}
                                onChange={handleChange}
                                placeholder="Describe the problem"
                                required
                                rows={3}
                                className="w-full px-4 py-2 border border-gray-300 dark:border-gray-600 rounded-lg bg-white dark:bg-gray-700 text-gray-800 dark:text-white focus:outline-none focus:ring-2 focus:ring-blue-500 resize-none"
                            />
                        </div>

                        <div>
                            <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-1">
                                Solution
                            </label>
                            <textarea
                                name="solution"
                                value={formData.solution}
                                onChange={handleChange}
                                placeholder="Describe the solution"
                                required
                                rows={3}
                                className="w-full px-4 py-2 border border-gray-300 dark:border-gray-600 rounded-lg bg-white dark:bg-gray-700 text-gray-800 dark:text-white focus:outline-none focus:ring-2 focus:ring-blue-500 resize-none"
                            />
                        </div>

                        <div>
                            <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-1">
                                Solved By
                            </label>
                            <input
                                type="text"
                                name="solvedBy"
                                value={formData.solvedBy}
                                onChange={handleChange}
                                placeholder="Enter your name"
                                required
                                className="w-full px-4 py-2 border border-gray-300 dark:border-gray-600 rounded-lg bg-white dark:bg-gray-700 text-gray-800 dark:text-white focus:outline-none focus:ring-2 focus:ring-blue-500"
                            />
                        </div>

                        <div>
                            <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-1">
                                Status
                            </label>
                            <select
                                name="status"
                                value={formData.status}
                                onChange={handleChange}
                                className="w-full px-4 py-2 border border-gray-300 dark:border-gray-600 rounded-lg bg-white dark:bg-gray-700 text-gray-800 dark:text-white focus:outline-none focus:ring-2 focus:ring-blue-500"
                            >
                                <option value="SOLVED">Solved</option>
                                <option value="UNSOLVED">Unsolved</option>
                                <option value="PENDING">Pending</option>
                            </select>
                        </div>

                        <div className="flex gap-3 pt-2">
                            <button
                                type="button"
                                onClick={() => navigate(user.role === "ADMIN" ? "/admin/dashboard" : "/dashboard")}
                                className="flex-1 px-4 py-2 rounded-lg border border-gray-300 dark:border-gray-600 text-gray-700 dark:text-gray-300 hover:bg-gray-50 dark:hover:bg-gray-700 font-medium transition duration-200"
                            >
                                Cancel
                            </button>
                            <button
                                type="submit"
                                disabled={loading}
                                className="flex-1 px-4 py-2 rounded-lg bg-blue-600 hover:bg-blue-700 text-white font-medium transition duration-200 disabled:opacity-50"
                            >
                                {loading ? "Saving..." : "Save Log"}
                            </button>
                        </div>

                    </form>
                </div>
            </div>
        </div>
    );
};

export default CreateLog;