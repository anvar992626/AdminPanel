import { useEffect, useState } from "react";
import axios from "axios";
import { toast } from "react-toastify";
import "bootstrap/dist/css/bootstrap.min.css";
import "./AdminPanel.css";
import { useNavigate } from "react-router-dom";

const AdminPanel = () => {
    const [users, setUsers] = useState([]);
    const [selectedUsers, setSelectedUsers] = useState([]);
    const [filter, setFilter] = useState("");
    const navigate = useNavigate();

    useEffect(() => {
        fetchUsers();
    }, []);

    const fetchUsers = async () => {
        try {
            const response = await axios.get("https://localhost:7126/admin/users", {
                withCredentials: true,
            });
            const sortedUsers = response.data.sort((a, b) =>
                a.email.localeCompare(b.email)
            );
            setUsers(sortedUsers);
        } catch (error) {
            console.error("Error fetching users:", error.response?.data || error.message);
            toast.error("Failed to fetch users. Please ensure the backend is running.");
        }
    };

    const handleAction = async (action) => {
        if (!selectedUsers.length) {
            toast.warn("No users selected.");
            return;
        }

        try {
            const response = await axios.post(
                `https://localhost:7126/admin/${action}`,
                selectedUsers,
                { withCredentials: true }
            );

            fetchUsers();
            setSelectedUsers([]);
            toast.success(response.data.message || `${action} action successful!`);
        } catch (error) {
            console.error(`Error performing ${action} action:`, error.response?.data || error.message);
            toast.error(error.response?.data.message || `Failed to perform ${action} action.`);
        }
    };

    const toggleUserSelection = (id) => {
        setSelectedUsers((prev) =>
            prev.includes(id) ? prev.filter((userId) => userId !== id) : [...prev, id]
        );
    };

    const handleLogout = async () => {
        try {
            // Send logout request to the backend
            await axios.post("https://localhost:7126/api/Account/Logout", {}, { withCredentials: true });

            // Show a success message
            toast.success("Logged out successfully.");

            // Redirect to the login page
            navigate("/login");
        } catch (error) {
            console.error("Logout Error:", error.response?.data || error.message);
            toast.error("Failed to log out. Please try again.");
        }
    };


    const filteredUsers = users.filter(
        (user) =>
            user.name.toLowerCase().includes(filter.toLowerCase()) ||
            user.email.toLowerCase().includes(filter.toLowerCase())
    );

    return (
        <div className="container mt-4">
            <h2 className="mb-3"></h2>

            {/* Toolbar */}
            <div className="d-flex align-items-center mb-3">
                <button
                    className="btn btn-outline-primary me-2"
                    onClick={() => handleAction("block")}
                    disabled={selectedUsers.length === 0}
                    title="Block selected users"
                >
                    <i className="bi bi-lock-fill"></i> Block
                </button>
                <button
                    className="btn btn-outline-success me-2"
                    onClick={() => handleAction("unblock")}
                    disabled={selectedUsers.length === 0}
                    title="Unblock selected users"
                >
                    <i className="bi bi-unlock-fill"></i>
                </button>
                <button
                    className="btn btn-outline-danger me-2"
                    onClick={() => handleAction("delete")}
                    disabled={selectedUsers.length === 0}
                    title="Delete selected users"
                >
                    <i className="bi bi-trash-fill"></i>
                </button>
                <input
                    type="text"
                    className="form-control"
                    placeholder="Filter"
                    value={filter}
                    onChange={(e) => setFilter(e.target.value)}
                    style={{ maxWidth: "200px", marginLeft: "auto" }}
                />
            </div>

            {/* User Table */}
            <table className="table table-hover">
                <thead className="table-light">
                    <tr>
                        <th style={{ width: "5%" }}>
                            <input
                                type="checkbox"
                                onChange={(e) =>
                                    e.target.checked
                                        ? setSelectedUsers(filteredUsers.map((u) => u.id))
                                        : setSelectedUsers([])
                                }
                                checked={
                                    selectedUsers.length === filteredUsers.length &&
                                    filteredUsers.length > 0
                                }
                            />
                        </th>
                        <th style={{ width: "25%" }}>Name</th>
                        <th style={{ width: "30%" }}>Email</th>
                        <th style={{ width: "20%" }}>Last Seen</th>
                        <th style={{ width: "20%" }}>Status</th>
                    </tr>
                </thead>
                <tbody>
                    {filteredUsers.map((user) => (
                        <tr key={user.id} className="align-middle">
                            <td>
                                <input
                                    type="checkbox"
                                    onChange={() => toggleUserSelection(user.id)}
                                    checked={selectedUsers.includes(user.id)}
                                />
                            </td>
                            <td>{user.name || "N/A"}</td>
                            <td>{user.email}</td>
                            <td>
                                <span title={formatExactDate(user.lastLoginTime)}>
                                    {user.lastLoginTime
                                        ? formatLastSeen(user.lastLoginTime)
                                        : "Never"}
                                </span>
                            </td>
                            <td>{user.isBlocked ? "Blocked" : "Active"}</td>
                        </tr>
                    ))}
                </tbody>
            </table>

            {/* Logout Button */}
            <div className="d-flex justify-content-start mt-3">
                <button
                    className="btn btn-outline-secondary"
                    onClick={handleLogout}
                    title="Log out and return to login page"
                >
                    Logout
                </button>
            </div>
        </div>
    );
};

/**
 * Format a timestamp into a human-readable "time ago" string.
 * @param {string} timestamp
 * @returns {string}
 */
const formatLastSeen = (timestamp) => {
    const diff = Date.now() - new Date(timestamp).getTime();
    const minutes = Math.floor(diff / 60000);

    if (minutes < 1) return "Less than a minute ago";
    if (minutes < 60) return `${minutes} minute${minutes > 1 ? "s" : ""} ago`;
    const hours = Math.floor(minutes / 60);
    if (hours < 24) return `${hours} hour${hours > 1 ? "s" : ""} ago`;
    const days = Math.floor(hours / 24);
    return `${days} day${days > 1 ? "s" : ""} ago`;
};

/**
 * Format a timestamp into a full readable date string.
 * @param {string} timestamp
 * @returns {string}
 */
const formatExactDate = (timestamp) => {
    if (!timestamp) return "Never";
    const date = new Date(timestamp);
    return date.toLocaleString("en-US", {
        month: "long",
        day: "2-digit",
        year: "numeric",
        hour: "2-digit",
        minute: "2-digit",
        second: "2-digit",
        hour12: false,
    });
};

export default AdminPanel;
