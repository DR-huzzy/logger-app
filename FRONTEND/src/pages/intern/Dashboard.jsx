import { useState, useEffect } from "react";
import { useNavigate } from "react-router-dom";
import Navbar from "../../components/Navbar";
import { useAuth } from "../../context/AuthContext";
import api from "../../api/axios";

const InternDashboard = () => {

    const { accessToken, user } = useAuth();
    const navigate = useNavigate();

    const [logs, setLogs] = useState([]);
    const [loading, setLoading] = useState(true);
    const [error, setError] = useState("");

    // Fetch only this intern's logs on page load
    useEffect(() => {

        const fetchLogs = async () => {
            try {
                const response = await api.get(`/logs/user/${user.id}`, {
                    headers: { Authorization: `Bearer ${accessToken}` }
                });
                setLogs(response.data.data);
            } catch (err) {
                setError("Failed to fetch logs");
                console.log(err);
            } finally {
                setLoading(false);
            }
        };

        if (accessToken) fetchLogs();

    }, [accessToken, user]);


    // Summary counts
    const totalLogs = logs.length;
    const solvedLogs = logs.filter(log => log.status === "SOLVED").length;
    const unsolvedLogs = logs.filter(log => log.status !== "SOLVED").length;


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

            <div className="p-6">

                {/* Page title */}
                <h2 className="text-2xl font-bold text-gray-800 dark:text-white mb-6">
                    My Dashboard
                </h2>

                {/* Summary cards */}
                <div className="grid grid-cols-3 gap-4 mb-8">

                    <div className="bg-white dark:bg-gray-800 rounded-lg shadow p-4 text-center">
                        <p className="text-3xl font-bold text-blue-600">{totalLogs}</p>
                        <p className="text-sm text-gray-500 dark:text-gray-400 mt-1">Total Logs</p>
                    </div>

                    <div className="bg-white dark:bg-gray-800 rounded-lg shadow p-4 text-center">
                        <p className="text-3xl font-bold text-green-600">{solvedLogs}</p>
                        <p className="text-sm text-gray-500 dark:text-gray-400 mt-1">Solved</p>
                    </div>

                    <div className="bg-white dark:bg-gray-800 rounded-lg shadow p-4 text-center">
                        <p className="text-3xl font-bold text-red-500">{unsolvedLogs}</p>
                        <p className="text-sm text-gray-500 dark:text-gray-400 mt-1">Unsolved</p>
                    </div>

                </div>

                {/* Logs table */}
                <div className="bg-white dark:bg-gray-800 rounded-lg shadow overflow-hidden">

                    <div className="flex items-center justify-between p-4 border-b border-gray-200 dark:border-gray-700">
                        <h3 className="text-lg font-semibold text-gray-800 dark:text-white">
                            My Log Entries
                        </h3>
                        <button
                            onClick={() => navigate("/logs/create")}
                            className="bg-blue-600 hover:bg-blue-700 text-white text-sm font-medium px-4 py-2 rounded-lg transition duration-200"
                        >
                            + New Log
                        </button>
                    </div>

                    <div className="overflow-x-auto">
                        <table className="w-full text-sm">
                            <thead className="bg-gray-50 dark:bg-gray-700 text-gray-600 dark:text-gray-300 uppercase text-xs">
                                <tr className="divide-x divide-gray-200 dark:divide-gray-600">
                                    <th className="px-4 py-3 text-left">Department</th>
                                    <th className="px-4 py-3 text-left">Person</th>
                                    <th className="px-4 py-3 text-left">Problem</th>
                                    <th className="px-4 py-3 text-left">Solution</th>
                                    <th className="px-4 py-3 text-left">Status</th>
                                    <th className="px-4 py-3 text-left">Date</th>
                                </tr>
                            </thead>
                            <tbody className="divide-y divide-gray-200 dark:divide-gray-700">
                                {logs.length === 0 ? (
                                    <tr>
                                        <td colSpan="6" className="text-center py-6 text-gray-500 dark:text-gray-400">
                                            No log entries yet — click New Log to get started
                                        </td>
                                    </tr>
                                ) : (
                                    logs.map((log) => (
                                        <tr key={log.id} className="hover:bg-gray-50 dark:hover:bg-gray-700 transition duration-150 divide-x divide-gray-200 dark:divide-gray-600">
                                            <td className="px-4 py-3 text-gray-700 dark:text-gray-300">{log.department}</td>
                                            <td className="px-4 py-3 text-gray-700 dark:text-gray-300">{log.personWithProblem}</td>
                                            <td className="px-4 py-3 text-gray-700 dark:text-gray-300">{log.problem}</td>
                                            <td className="px-4 py-3 text-gray-700 dark:text-gray-300">{log.solution}</td>
                                            <td className="px-4 py-3">
                                                <span className={`px-2 py-1 rounded-full text-xs font-medium ${
                                                    log.status === "SOLVED"
                                                        ? "bg-green-100 text-green-700 dark:bg-green-900 dark:text-green-300"
                                                        : "bg-red-100 text-red-700 dark:bg-red-900 dark:text-red-300"
                                                }`}>
                                                    {log.status}
                                                </span>
                                            </td>
                                            <td className="px-4 py-3 text-gray-700 dark:text-gray-300">
                                                {new Date(log.date).toLocaleDateString()}
                                            </td>
                                        </tr>
                                    ))
                                )}
                            </tbody>
                        </table>
                    </div>
                </div>
            </div>
        </div>
    );
};

export default InternDashboard;