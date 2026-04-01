import { useState, useEffect } from "react";
import { useNavigate } from "react-router-dom";
import Navbar from "../../components/Navbar";
import { useAuth } from "../../context/AuthContext";
import api from "../../api/axios";

const AdminUsers = () => {

    const { accessToken, user: currentUser } = useAuth();
    const navigate = useNavigate();

    const [users, setUsers] = useState([]);
    const [loading, setLoading] = useState(true);
    const [error, setError] = useState("");

    // Reset password modal state
    const [resetModalOpen, setResetModalOpen] = useState(false);
    const [selectedUser, setSelectedUser] = useState(null);
    const [newPassword, setNewPassword] = useState("");
    const [passcode, setPasscode] = useState("");
    const [resetError, setResetError] = useState("");

    // Delete modal state
    const [deleteModalOpen, setDeleteModalOpen] = useState(false);
    const [selectedUserId, setSelectedUserId] = useState(null);

    // Add a deleteError state at the top
    const [deleteError, setDeleteError] = useState("");


    // Fetch all users on page load
    useEffect(() => {
        const fetchUsers = async () => {
            try {
                const response = await api.get("/user", {
                    headers: { Authorization: `Bearer ${accessToken}` }
                });
                setUsers(response.data.data);
            } catch (err) {
                setError("Failed to fetch users");
                console.log(err);
            } finally {
                setLoading(false);
            }
        };

        if (accessToken) fetchUsers();

    }, [accessToken]);


    // Delete user
    const handleDelete = async () => {
        try {
            await api.delete(`/user/${selectedUserId}`, {
                headers: {
                    Authorization: `Bearer ${accessToken}`,
                    "x-admin-passcode": passcode
                }
            });
            setUsers(users.filter(user => user.id !== selectedUserId));
            setDeleteModalOpen(false);
            setSelectedUserId(null);
            setPasscode("");
        } catch (err) {
            setDeleteError("Failed to delete — incorrect passcode?");
            console.log(err);
        }
    };


    const closeDeleteModal = () => {

        setDeleteModalOpen(false);
        setPasscode("");
        setDeleteError("");

    }


    // Reset password
    const handleResetPassword = async () => {
        if (!newPassword || !passcode) {
            setResetError("All fields are required");
            return;
        }
        try {
            await api.patch(`/user/${selectedUser.id}/reset-password`,
                { newPassword },
                {
                    headers: {
                        Authorization: `Bearer ${accessToken}`,
                        "x-admin-passcode": passcode
                    }
                }
            );
            setResetModalOpen(false);
            setNewPassword("");
            setPasscode("");
            setResetError("");
            alert("Password reset successfully!");
        } catch (err) {
            setResetError("Failed to reset password — incorrect passcode?");
            console.log(err);
        }
    };


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

                {/* Page title and create button */}
                <div className="flex items-center justify-between mb-6">
                    <h2 className="text-2xl font-bold text-gray-800 dark:text-white">
                        Staff Members
                    </h2>
                    <button
                        onClick={() => navigate("/admin/users/create")}
                        className="bg-blue-600 hover:bg-blue-700 text-white text-sm font-medium px-4 py-2 rounded-lg transition duration-200"
                    >
                        + Add Staff
                    </button>
                </div>

                {/* Users grid */}
                <div className="grid grid-cols-1 gap-4 md:grid-cols-2 lg:grid-cols-3">
                    {users.length === 0 ? (
                        <p className="text-gray-500 dark:text-gray-400">No staff members found</p>
                    ) : (
                        users.map((user) => (
                            <div key={user.id} className="bg-white dark:bg-gray-800 rounded-xl shadow p-5">

                                {/* User avatar and info */}
                                <div className="flex items-center gap-4 mb-4">
                                    <div className="bg-gray-100 dark:bg-gray-700 text-gray-600 dark:text-gray-300 font-bold text-xl rounded-full w-12 h-12 flex items-center justify-center">
                                        {user.name.charAt(0).toUpperCase()}
                                    </div>
                                    <div>
                                        <p className="font-semibold text-gray-800 dark:text-white">{user.name}</p>
                                        <p className="text-sm text-gray-500 dark:text-gray-400">{user.email}</p>
                                    </div>
                                </div>

                                {/* Role badge */}
                                <span className="text-xs font-medium bg-gray-100 dark:bg-gray-700 text-gray-600 dark:text-gray-300 px-2 py-1 rounded-full">
                                    {user.role === "ADMIN" ? "Admin" : "IT Intern"}
                                </span>

                                {/* Action buttons */}
                                <div className="flex gap-2 mt-4">

                                    {/* Reset password - show for all users */}
                                    <button
                                        onClick={() => {
                                            setSelectedUser(user);
                                            setResetModalOpen(true);
                                        }}
                                        className="flex-1 border border-blue-600 text-blue-600 dark:text-blue-400 dark:border-blue-400 hover:bg-blue-50 dark:hover:bg-gray-700 text-xs font-medium px-3 py-2 rounded-lg transition duration-200"
                                    >
                                        Reset Password
                                    </button>

                                    {/* Delete - hide for current logged in admin */}
                                    {currentUser.id !== user.id && (
                                        <button
                                            onClick={() => {
                                                setSelectedUserId(user.id);
                                                setDeleteModalOpen(true);
                                            }}
                                            className="flex-1 bg-red-500 hover:bg-red-600 text-white text-xs font-medium px-3 py-2 rounded-lg transition duration-200"
                                        >
                                            Delete
                                        </button>
                                    )}

                                </div>

                            </div>
                        ))
                    )}
                </div>
            </div>

            {/* Delete Modal */}
            {deleteModalOpen && (
                <>
                    <div
                        className="fixed inset-0 bg-black/50 backdrop-blur-sm z-40"
                        onClick={closeDeleteModal}
                    />
                    <div className="fixed inset-0 z-50 flex items-center justify-center px-4">
                        <div className="bg-white dark:bg-gray-800 rounded-2xl shadow-2xl w-full max-w-md p-6 relative">
                            <button
                                onClick={closeDeleteModal}
                                className="absolute top-4 right-4 text-gray-400 hover:text-gray-600 dark:hover:text-gray-200 text-xl font-bold"
                            >
                                ✕
                            </button>
                            <div className="flex justify-center mb-4">
                                <div className="bg-red-100 dark:bg-red-900 p-4 rounded-full">
                                    <svg className="w-10 h-10 text-red-500" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                                        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 9v2m0 4h.01M10.29 3.86L1.82 18a2 2 0 001.71 3h16.94a2 2 0 001.71-3L13.71 3.86a2 2 0 00-3.42 0z" />
                                    </svg>
                                </div>
                            </div>
                            <h2 className="text-xl font-bold text-center text-gray-800 dark:text-white mb-2">
                                Delete Staff Member
                            </h2>

                            {deleteError && (
                                <p className="text-red-500 text-sm mb-3">{deleteError}</p>
                            )}

                            <p className="text-center text-gray-500 dark:text-gray-400 text-sm mb-6">
                                This action cannot be undone. Enter your admin passcode to confirm.
                            </p>
                            <input
                                type="password"
                                value={passcode}
                                onChange={(e) => setPasscode(e.target.value)}
                                placeholder="Enter admin passcode"
                                className="w-full px-4 py-2 border border-gray-300 dark:border-gray-600 rounded-lg bg-white dark:bg-gray-700 text-gray-800 dark:text-white focus:outline-none focus:ring-2 focus:ring-red-500 mb-4"
                            />
                            <div className="flex gap-3">
                                <button
                                    onClick={closeDeleteModal}
                                    className="flex-1 px-4 py-2 rounded-lg border border-gray-300 dark:border-gray-600 text-gray-700 dark:text-gray-300 hover:bg-gray-50 dark:hover:bg-gray-700 font-medium transition duration-200"
                                >
                                    Cancel
                                </button>
                                <button
                                    onClick={handleDelete}
                                    className="flex-1 px-4 py-2 rounded-lg bg-red-500 hover:bg-red-600 text-white font-medium transition duration-200"
                                >
                                    Delete
                                </button>
                            </div>
                        </div>
                    </div>
                </>
            )}

            {/* Reset Password Modal */}
            {resetModalOpen && (
                <>
                    <div
                        className="fixed inset-0 bg-black/50 backdrop-blur-sm z-40"
                        onClick={() => setResetModalOpen(false)}
                    />
                    <div className="fixed inset-0 z-50 flex items-center justify-center px-4">
                        <div className="bg-white dark:bg-gray-800 rounded-2xl shadow-2xl w-full max-w-md p-6 relative">
                            <button
                                onClick={() => setResetModalOpen(false)}
                                className="absolute top-4 right-4 text-gray-400 hover:text-gray-600 dark:hover:text-gray-200 text-xl font-bold"
                            >
                                ✕
                            </button>
                            <h2 className="text-xl font-bold text-center text-gray-800 dark:text-white mb-2">
                                Reset Password
                            </h2>
                            <p className="text-center text-gray-500 dark:text-gray-400 text-sm mb-6">
                                Reset password for <span className="font-semibold text-blue-600 dark:text-blue-400">{selectedUser?.name}</span>
                            </p>
                            {resetError && (
                                <p className="text-red-500 text-sm mb-3">{resetError}</p>
                            )}
                            <div className="space-y-3 mb-4">
                                <input
                                    type="password"
                                    value={newPassword}
                                    onChange={(e) => setNewPassword(e.target.value)}
                                    placeholder="Enter new password"
                                    className="w-full px-4 py-2 border border-gray-300 dark:border-gray-600 rounded-lg bg-white dark:bg-gray-700 text-gray-800 dark:text-white focus:outline-none focus:ring-2 focus:ring-blue-500"
                                />
                                <input
                                    type="password"
                                    value={passcode}
                                    onChange={(e) => setPasscode(e.target.value)}
                                    placeholder="Enter admin passcode"
                                    className="w-full px-4 py-2 border border-gray-300 dark:border-gray-600 rounded-lg bg-white dark:bg-gray-700 text-gray-800 dark:text-white focus:outline-none focus:ring-2 focus:ring-blue-500"
                                />
                            </div>
                            <div className="flex gap-3">
                                <button
                                    onClick={() => setResetModalOpen(false)}
                                    className="flex-1 px-4 py-2 rounded-lg border border-gray-300 dark:border-gray-600 text-gray-700 dark:text-gray-300 hover:bg-gray-50 dark:hover:bg-gray-700 font-medium transition duration-200"
                                >
                                    Cancel
                                </button>
                                <button
                                    onClick={handleResetPassword}
                                    className="flex-1 px-4 py-2 rounded-lg bg-blue-600 hover:bg-blue-700 text-white font-medium transition duration-200"
                                >
                                    Reset
                                </button>
                            </div>
                        </div>
                    </div>
                </>
            )}

        </div>
    );
};

export default AdminUsers;