import { useState, useEffect } from "react";
import { useNavigate, useParams } from "react-router-dom";
import Navbar from "../../components/Navbar";
import { useAuth } from "../../context/AuthContext";
import api from "../../api/axios";

const SingleLog = () => {

    const { accessToken } = useAuth();
    const navigate = useNavigate();
    const { id } = useParams(); // extract id from URL

    const [log, setLog] = useState(null);
    const [loading, setLoading] = useState(true);
    const [error, setError] = useState("");

    // Fetch single log on page load
    useEffect(() => {
        const fetchLog = async () => {
            try {
                const response = await api.get(`/logs/${id}`, {
                    headers: { Authorization: `Bearer ${accessToken}` }
                });
                setLog(response.data.data);
            } catch (err) {
                setError("Failed to fetch log entry");
                console.log(err);
            } finally {
                setLoading(false);
            }
        };

        if (accessToken) fetchLog();

    }, [accessToken, id]);


    if (loading) return (
        <div className="min-h-screen bg-gray-100 dark:bg-gray-900 flex items-center justify-center">
            <p className="text-gray-500 dark:text-gray-400">Loading...</p>
        </div>
    );

    if (error) return (
        <div className="min-h-screen bg-gray-100 dark:bg-gray-900 flex items-center justify-center">
            <p className="text-red-500">{error}</p>
        </div>
    );


    return (
        <div className="min-h-screen bg-gray-100 dark:bg-gray-900">

            <Navbar />

            <div className="p-6 max-w-2xl mx-auto">

                {/* Back button */}
                <button
                    onClick={() => navigate("/admin/dashboard")}
                    className="text-sm text-gray-500 dark:text-gray-400 hover:text-blue-600 dark:hover:text-blue-400 mb-6 flex items-center gap-1 transition duration-200"
                >
                    ← Back to Dashboard
                </button>

                {/* Card */}
                <div className="bg-white dark:bg-gray-800 rounded-2xl shadow p-6">

                    {/* Header */}
                    <div className="flex items-center justify-between mb-6">
                        <h2 className="text-2xl font-bold text-gray-800 dark:text-white">
                            Log Entry #{log.id}
                        </h2>
                        <span className={`px-3 py-1 rounded-full text-sm font-medium ${
                            log.status === "SOLVED"
                                ? "bg-green-100 text-green-700 dark:bg-green-900 dark:text-green-300"
                                : "bg-red-100 text-red-700 dark:bg-red-900 dark:text-red-300"
                        }`}>
                            {log.status}
                        </span>
                    </div>

                    {/* Details grid */}
                    <div className="grid grid-cols-1 gap-4 md:grid-cols-2">

                        <div className="bg-gray-50 dark:bg-gray-700 rounded-xl p-4">
                            <p className="text-xs text-gray-500 dark:text-gray-400 uppercase font-medium mb-1">Department</p>
                            <p className="text-gray-800 dark:text-white font-medium">{log.department}</p>
                        </div>

                        <div className="bg-gray-50 dark:bg-gray-700 rounded-xl p-4">
                            <p className="text-xs text-gray-500 dark:text-gray-400 uppercase font-medium mb-1">Person With Problem</p>
                            <p className="text-gray-800 dark:text-white font-medium">{log.personWithProblem}</p>
                        </div>

                        <div className="bg-gray-50 dark:bg-gray-700 rounded-xl p-4">
                            <p className="text-xs text-gray-500 dark:text-gray-400 uppercase font-medium mb-1">Solved By</p>
                            <p className="text-gray-800 dark:text-white font-medium">{log.solvedBy}</p>
                        </div>

                        <div className="bg-gray-50 dark:bg-gray-700 rounded-xl p-4">
                            <p className="text-xs text-gray-500 dark:text-gray-400 uppercase font-medium mb-1">Date</p>
                            <p className="text-gray-800 dark:text-white font-medium">
                                {new Date(log.date).toLocaleDateString("en-GB", {
                                    day: "numeric",
                                    month: "long",
                                    year: "numeric"
                                })}
                            </p>
                        </div>

                        <div className="bg-gray-50 dark:bg-gray-700 rounded-xl p-4 md:col-span-2">
                            <p className="text-xs text-gray-500 dark:text-gray-400 uppercase font-medium mb-1">Problem</p>
                            <p className="text-gray-800 dark:text-white">{log.problem}</p>
                        </div>

                        <div className="bg-gray-50 dark:bg-gray-700 rounded-xl p-4 md:col-span-2">
                            <p className="text-xs text-gray-500 dark:text-gray-400 uppercase font-medium mb-1">Solution</p>
                            <p className="text-gray-800 dark:text-white">{log.solution}</p>
                        </div>

                    </div>
                </div>
            </div>
        </div>
    );
};

export default SingleLog;