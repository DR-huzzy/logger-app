import { useState, useEffect } from "react";
import { useNavigate } from "react-router-dom";
import Navbar from "../../components/Navbar";
import { useAuth } from "../../context/AuthContext";
import api from "../../api/axios";
import DeleteModal from "../../components/DeleteModal";


const AdminDashboard = () => {

    const { accessToken } = useAuth();
    const navigate = useNavigate();

    const [logs, setLogs] = useState([]);
    const [users, setUsers] = useState([]);
    const [loading, setLoading] = useState(true);
    const [error, setError] = useState("");

    const [filters, setFilters] = useState({
            department: "",
            status: "",
            date: ""
        });


    /* delete Modal */
    const [modalOpen, setModalOpen] = useState(false);
    const [selectedLogId, setSelectedLogId] = useState(null);


    // Fetch all logs and users on page load
    useEffect( () => {

        const fetchData = async () => {
            try {
                // get log and user response

                const [logsRes, usersRes] = await Promise.all([
                    api.get("/logs", {
                        headers: { Authorization: `Bearer ${accessToken}` }
                    }),
                    api.get("/user", {
                        headers: { Authorization: `Bearer ${accessToken}` }
                    })
                ]);


                setLogs(logsRes.data.data);
                setUsers(usersRes.data.data);
                
            } catch (err) {
                setError("Failed to fetch data");
                console.log(err);
            } finally {
                setLoading(false);
            }
        };

        if (accessToken) {
            fetchData();
        }

    }, [accessToken]);



    // Summary card counts
    const totalLogs = logs.length;
    const totalUsers = users.length;
    const solvedLogs = logs.filter(log => log.status === "SOLVED").length;
    const unsolvedLogs = logs.filter(log => log.status !== "SOLVED").length;


    // Filter logs based on filter state  ← ADD IT HERE
    
    const filteredLogs = logs.filter(log => {
    
        const matchDepartment = filters.department === "" ||
        log.department.toLowerCase().includes(filters.department.toLowerCase());
    
        const matchStatus = filters.status === "" || log.status === filters.status;
    
        const matchDate = filters.date === "" ||
        new Date(log.date).toLocaleDateString("en-CA") === filters.date;

        return matchDepartment && matchStatus && matchDate;
    });



    // Delete a log entry

    // Opens the modal and saves the log id
    const openDeleteModal = (id) => {
        setSelectedLogId(id);
        setModalOpen(true);
    };

    // Called when admin confirms delete with passcode
    const handleDelete = async (passcode) => {
        try {
            await api.delete(`/logs/${selectedLogId}`, {
                headers: {
                    Authorization: `Bearer ${accessToken}`,
                    "x-admin-passcode": passcode
                }
            });

            // Remove deleted log from state
            setLogs(logs.filter(log => log.id !== selectedLogId));
            setModalOpen(false);
            setSelectedLogId(null);

        } catch (err) {
            alert("Failed to delete log — incorrect passcode?");
            console.log(err);
        }
    };


    if (loading) return (
        <div className="min-h-screen bg-gray-100 dark:bg-gray-900 flex items-center justify-center">
            <p className="text-gray-600 dark:text-gray-400">Loading...</p>
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
                    Admin Dashboard
                </h2>




                {/* Summary cards */}

                <div className="grid grid-cols-2 gap-4 mb-8 md:grid-cols-4">

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

                    <div className="bg-white dark:bg-gray-800 rounded-lg shadow p-4 text-center">
                        <p className="text-3xl font-bold text-purple-600">{totalUsers}</p>
                        <p className="text-sm text-gray-500 dark:text-gray-400 mt-1">Staff Members</p>
                    </div>

                </div>



                {/* Filter bar */}
                <div className="bg-white dark:bg-gray-800 rounded-lg shadow p-4 mb-4 flex flex-wrap gap-3">
                    <input
                        type="text"
                        placeholder="Filter by department"
                        value={filters.department}
                        onChange={(e) => setFilters({ ...filters, department: e.target.value })}
                        className="px-3 py-2 border border-gray-300 dark:border-gray-600 rounded-lg bg-white dark:bg-gray-700 text-gray-800 dark:text-white text-sm focus:outline-none focus:ring-2 focus:ring-blue-500"
                    />
                    <select
                        value={filters.status}
                        onChange={(e) => setFilters({ ...filters, status: e.target.value })}
                        className="px-3 py-2 border border-gray-300 dark:border-gray-600 rounded-lg bg-white dark:bg-gray-700 text-gray-800 dark:text-white text-sm focus:outline-none focus:ring-2 focus:ring-blue-500"
                    >
                        <option value="">All Statuses</option>
                        <option value="SOLVED">Solved</option>
                        <option value="UNSOLVED">Unsolved</option>
                        <option value="PENDING">Pending</option>
                    </select>
                    <input
                        type="date"
                        value={filters.date}
                        onChange={(e) => setFilters({ ...filters, date: e.target.value })}
                        className="px-3 py-2 border border-gray-300 dark:border-gray-600 rounded-lg bg-white dark:bg-gray-700 text-gray-800 dark:text-white text-sm focus:outline-none focus:ring-2 focus:ring-blue-500"
                    />
                    <button
                        onClick={() => setFilters({ department: "", status: "", date: "" })}
                        className="px-3 py-2 border border-gray-300 dark:border-gray-600 text-gray-600 dark:text-gray-300 rounded-lg text-sm hover:bg-gray-50 dark:hover:bg-gray-700 transition duration-200"
                    >
                        Clear
                    </button>
                </div>



                {/* Logs table */}
                <div className="bg-white dark:bg-gray-800 rounded-lg shadow overflow-hidden">

                    <div className="flex items-center justify-between p-4 border-b border-gray-200 dark:border-gray-700">

                        <h3 className="text-lg font-semibold text-gray-800 dark:text-white">
                            All Log Entries
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

                                <tr>
                                    <th className="px-4 py-3 text-left">Department</th>
                                    <th className="px-4 py-3 text-left">Person</th>
                                    <th className="px-4 py-3 text-left">Problem</th>
                                    <th className="px-4 py-3 text-left">Solution</th>
                                    <th className="px-4 py-3 text-left">Solved By</th>
                                    <th className="px-4 py-3 text-left">Status</th>
                                    <th className="px-4 py-3 text-left">Date</th>
                                    <th className="px-4 py-3 text-left">Actions</th>
                                </tr>

                            </thead>



                            <tbody className="divide-y divide-gray-200 dark:divide-gray-700">

                                {   

                                    filteredLogs.length === 0 ? 
                                    (

                                        <tr>
                                            <td colSpan="8" className="text-center py-6 text-gray-500 dark:text-gray-400">
                                                No log entries found
                                            </td>
                                        </tr>

                                    ) : 
                                    
                                    (

                                        filteredLogs.map((log) => (

                                            
                                            <tr 
                                                key={log.id}
                                                onClick={() => navigate(`/admin/logs/${log.id}`)}
                                                className="hover:bg-gray-50 dark:hover:bg-gray-700 transition duration-150 divide-x divide-gray-200 dark:divide-gray-600 cursor-pointer"
                                            >
                                                
                                            <td className="px-4 py-3 text-gray-700 dark:text-gray-300">{log.department}</td>
                                            <td className="px-4 py-3 text-gray-700 dark:text-gray-300">{log.personWithProblem}</td>
                                            <td className="px-4 py-3 text-gray-700 dark:text-gray-300">{log.problem}</td>
                                            <td className="px-4 py-3 text-gray-700 dark:text-gray-300">{log.solution}</td>
                                            <td className="px-4 py-3 text-gray-700 dark:text-gray-300">{log.solvedBy}</td>


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

                                            <td className="px-4 py-3">
                                                <button
                                                    onClick={ (e) => {
                                                        e.stopPropagation();
                                                        openDeleteModal(log.id);
                                                    }}
                                                    className="bg-red-500 hover:bg-red-600 text-white text-xs px-3 py-1 rounded transition duration-200"
                                                >
                                                    Delete
                                                </button>
                                            </td>
                                        </tr>



                                        ))
                                    )

                                }

                            </tbody>

                        </table>

                    </div>

                </div>


            </div>

            <DeleteModal
                isOpen={modalOpen}
                onClose={() => setModalOpen(false)}
                onConfirm={handleDelete}
            />
            
        </div>
    );
};

export default AdminDashboard;