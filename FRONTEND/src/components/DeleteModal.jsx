import { useState } from "react";

const DeleteModal = ({ isOpen, onClose, onConfirm }) => {

    const [passcode, setPasscode] = useState("");
    const [error, setError] = useState("");

    if (!isOpen) return null;

    const handleConfirm = () => {
        if (!passcode) {
            setError("Please enter the admin passcode");
            return;
        }
        onConfirm(passcode);
        setPasscode("");
        setError("");
    };

    const handleClose = () => {
        setPasscode("");
        setError("");
        onClose();
    };

    return (
        <>
            {/* Blurred background overlay */}
            <div
                className="fixed inset-0 bg-black/50 backdrop-blur-sm z-40"
                onClick={handleClose}
            />

            {/* Modal */}
            <div className="fixed inset-0 z-50 flex items-center justify-center px-4">
                <div className="bg-white dark:bg-gray-800 rounded-2xl shadow-2xl w-full max-w-md p-6 relative">

                    {/* X button */}
                    <button
                        onClick={handleClose}
                        className="absolute top-4 right-4 text-gray-400 hover:text-gray-600 dark:hover:text-gray-200 text-xl font-bold transition duration-200"
                    >
                        ✕
                    </button>

                    {/* Warning icon */}
                    <div className="flex justify-center mb-4">
                        <div className="bg-red-100 dark:bg-red-900 p-4 rounded-full">
                            <svg className="w-10 h-10 text-red-500" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 9v2m0 4h.01M10.29 3.86L1.82 18a2 2 0 001.71 3h16.94a2 2 0 001.71-3L13.71 3.86a2 2 0 00-3.42 0z" />
                            </svg>
                        </div>
                    </div>

                    {/* Title and message */}
                    <h2 className="text-xl font-bold text-center text-gray-800 dark:text-white mb-2">
                        Delete Log Entry
                    </h2>
                    <p className="text-center text-gray-500 dark:text-gray-400 text-sm mb-6">
                        This action cannot be undone. Please enter your admin passcode to confirm.
                    </p>

                    {/* Passcode input */}
                    <div className="mb-4">
                        <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-1">
                            Admin Passcode
                        </label>
                        <input
                            type="password"
                            value={passcode}
                            onChange={(e) => setPasscode(e.target.value)}
                            placeholder="Enter admin passcode"
                            className="w-full px-4 py-2 border border-gray-300 dark:border-gray-600 rounded-lg bg-white dark:bg-gray-700 text-gray-800 dark:text-white focus:outline-none focus:ring-2 focus:ring-red-500"
                        />
                        {/* Error message */}
                        {error && (
                            <p className="text-red-500 text-xs mt-1">{error}</p>
                        )}
                    </div>

                    {/* Buttons */}
                    <div className="flex gap-3">
                        <button
                            onClick={handleClose}
                            className="flex-1 px-4 py-2 rounded-lg border border-gray-300 dark:border-gray-600 text-gray-700 dark:text-gray-300 hover:bg-gray-50 dark:hover:bg-gray-700 font-medium transition duration-200"
                        >
                            Cancel
                        </button>
                        <button
                            onClick={handleConfirm}
                            className="flex-1 px-4 py-2 rounded-lg bg-red-500 hover:bg-red-600 text-white font-medium transition duration-200"
                        >
                            Delete
                        </button>
                    </div>

                </div>
            </div>
        </>
    );
};

export default DeleteModal;
