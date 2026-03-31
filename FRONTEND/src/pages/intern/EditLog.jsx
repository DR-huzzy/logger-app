import { useState, useEffect } from "react";
import { useNavigate, useParams } from "react-router-dom";
import Navbar from "../../components/Navbar";
import { useAuth } from "../../context/AuthContext";
import api from "../../api/axios";

const EditLog = () => {

    const { accessToken } = useAuth();
    const navigate = useNavigate();
    const { id } = useParams();

    const [formData, setFormData] = useState({
        department: "",
        personWithProblem: "",
        problem: "",
        solution: "",
        solvedBy: "",
        status: "SOLVED"
    });

    const [loading, setLoading] = useState(true);
    const [saving, setSaving] = useState(false);
    const [error, setError] = useState("");

    // Fetch existing log data on page load
    useEffect(() => {
        const fetchLog = async () => {
            try {
                const response = await api.get(`/logs/${id}`, {
                    headers: { Authorization: `Bearer ${accessToken}` }
                });
                const log = response.data.data;
                setFormData({
                    department: log.department,
                    personWithProblem: log.personWithProblem,
                    problem: log.problem,
                    solution: log.solution,
                    solvedBy: log.solvedBy,
                    status: log.status
                });
            } catch (err) {
                setError("Failed to fetch log entry");
                console.log(err);
            } finally {
                setLoading(false);
            }
        };

        if (accessToken) fetchLog();

    }, [accessToken, id]);


    const handleChange = (e) => {
        setFormData({ ...formData, [e.target.name]: e.target.value });
    };

    const handleSubmit = async (e) => {
        e.preventDefault();
        setError("");
        setSaving(true);

        try {
            await api.patch(`/logs/${id}`, formData, {
                headers: { Authorization: `Bearer ${accessToken}` }
            });
            navigate("/dashboard");
        } catch (err) {
            setError(err.response?.data?.message || "Failed to update log entry");
        } finally {
            setSaving(false);
        }
    };


    if (loading) return (
        <div className="min-h-screen bg-gray-100 dark:bg-gray-900 flex items-center justify-center">
            <p className="text-gray-500 dark:text-gray-400">Loading...</p>
        </div>
    );


    return (
        <div className="min-h-screen bg-gray-100 dark:bg-gray-900">

            <Navbar />

            <div className="p-6 max-w-lg mx-auto">

                <button
                    onClick={() => navigate("/dashboard")}
                    className="text-sm text-gray-500 dark:text-gray-400 hover:text-blue-600 dark:hover:text-blue-400 mb-6 flex items-center gap-1 transition duration-200"
                >
                    ← Back to Dashboard
                </button>

                <div className="bg-white dark:bg-gray-800 rounded-2xl shadow p-6">

                    <h2 className="text-2xl font-bold text-gray-800 dark:text-white mb-1">
                        Edit Log Entry
                    </h2>
                    <p className="text-sm text-gray-500 dark:text-gray-400 mb-6">
                        Update the details of this log entry
                    </p>

                    {error && (
                        <div className="bg-red-50 dark:bg-red-900/30 text-red-600 dark:text-red-400 text-sm p-3 rounded-lg mb-4">
                            {error}
                        </div>
                    )}

                    <form onSubmit={handleSubmit} className="space-y-4">

                        <div>
                            <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-1">Department</label>
                            <input
                                type="text"
                                name="department"
                                value={formData.department}
                                onChange={handleChange}
                                required
                                className="w-full px-4 py-2 border border-gray-300 dark:border-gray-600 rounded-lg bg-white dark:bg-gray-700 text-gray-800 dark:text-white focus:outline-none focus:ring-2 focus:ring-blue-500"
                            />
                        </div>

                        <div>
                            <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-1">Person With Problem</label>
                            <input
                                type="text"
                                name="personWithProblem"
                                value={formData.personWithProblem}
                                onChange={handleChange}
                                required
                                className="w-full px-4 py-2 border border-gray-300 dark:border-gray-600 rounded-lg bg-white dark:bg-gray-700 text-gray-800 dark:text-white focus:outline-none focus:ring-2 focus:ring-blue-500"
                            />
                        </div>

                        <div>
                            <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-1">Problem</label>
                            <textarea
                                name="problem"
                                value={formData.problem}
                                onChange={handleChange}
                                required
                                rows={3}
                                className="w-full px-4 py-2 border border-gray-300 dark:border-gray-600 rounded-lg bg-white dark:bg-gray-700 text-gray-800 dark:text-white focus:outline-none focus:ring-2 focus:ring-blue-500 resize-none"
                            />
                        </div>

                        <div>
                            <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-1">Solution</label>
                            <textarea
                                name="solution"
                                value={formData.solution}
                                onChange={handleChange}
                                required
                                rows={3}
                                className="w-full px-4 py-2 border border-gray-300 dark:border-gray-600 rounded-lg bg-white dark:bg-gray-700 text-gray-800 dark:text-white focus:outline-none focus:ring-2 focus:ring-blue-500 resize-none"
                            />
                        </div>

                        <div>
                            <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-1">Solved By</label>
                            <input
                                type="text"
                                name="solvedBy"
                                value={formData.solvedBy}
                                onChange={handleChange}
                                required
                                className="w-full px-4 py-2 border border-gray-300 dark:border-gray-600 rounded-lg bg-white dark:bg-gray-700 text-gray-800 dark:text-white focus:outline-none focus:ring-2 focus:ring-blue-500"
                            />
                        </div>

                        <div>
                            <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-1">Status</label>
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
                                onClick={() => navigate("/dashboard")}
                                className="flex-1 px-4 py-2 rounded-lg border border-gray-300 dark:border-gray-600 text-gray-700 dark:text-gray-300 hover:bg-gray-50 dark:hover:bg-gray-700 font-medium transition duration-200"
                            >
                                Cancel
                            </button>
                            <button
                                type="submit"
                                disabled={saving}
                                className="flex-1 px-4 py-2 rounded-lg bg-blue-600 hover:bg-blue-700 text-white font-medium transition duration-200 disabled:opacity-50"
                            >
                                {saving ? "Saving..." : "Save Changes"}
                            </button>
                        </div>

                    </form>
                </div>
            </div>
        </div>
    );
};

export default EditLog;