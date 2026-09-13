import { useEffect, useState } from "react";
import API from "../services/api";
import DataTable from "./DataTable";
import { useNavigate } from "react-router-dom";

export default function Users() {
    const [users, setUsers] =
        useState([]);

    const [loading, setLoading] =
        useState(false);

    const [roleFilter, setRoleFilter] =
        useState("all");

    const [stats, setStats] =
        useState({
            total: 0,
            customers: 0,
            technicians: 0,
            admins: 0,
        });

    const navigate =
        useNavigate();

    /* ================= LOAD USERS ================= */
    const loadUsers =
        async () => {
            try {
                setLoading(true);

                const endpoint =
                    roleFilter === "all"
                        ? "/users"
                        : `/users?role=${roleFilter}`;

                const res =
                    await API.get(
                        endpoint
                    );

                setUsers(
                    res.data || []
                );

            } catch (err) {
                console.log(err);
                alert(
                    "Failed to load users"
                );
            } finally {
                setLoading(false);
            }
        };

    /* ================= LOAD STATS ================= */
    const loadStats =
        async () => {
            try {
                const res =
                    await API.get(
                        "/users/stats"
                    );

                setStats(
                    res.data
                );

            } catch (err) {
                console.log(err);
            }
        };

    /* ================= SEED USERS ================= */
    const seedUsers =
        async () => {
            if (
                !window.confirm(
                    "Seed demo users?"
                )
            )
                return;

            try {
                await API.post(
                    "/seed/users"
                );

                alert(
                    "Demo users created successfully"
                );

                loadUsers();
                loadStats();

            } catch (err) {
                console.log(err);
                alert(
                    "Failed to seed users"
                );
            }
        };

    useEffect(() => {
        loadUsers();
        loadStats();
    }, [roleFilter]);

    /* ================= DELETE ================= */
    const deleteUser =
        async (id) => {
            if (
                !window.confirm(
                    "Delete this user?"
                )
            )
                return;

            try {
                await API.delete(
                    `/users/${id}`
                );

                loadUsers();
                loadStats();

            } catch (err) {
                console.log(err);
            }
        };

    /* ================= RESET PASSWORD ================= */
    const resetPassword =
        async (id) => {
            const password =
                prompt(
                    "Enter new password"
                );

            if (!password) return;

            try {
                await API.put(
                    `/users/${id}/reset-password`,
                    {
                        password,
                    }
                );

                alert(
                    "Password reset successfully"
                );

            } catch (err) {
                console.log(err);
            }
        };

    /* ================= TABLE COLUMNS ================= */
    const columns = [
        {
            key: "id",
            label: "ID",
        },
        {
            key: "name",
            label: "Name",
        },
        {
            key: "email",
            label: "Email",
        },
        {
            key: "phone",
            label: "Phone",
        },
        {
            key: "role",
            label:
                "User Type",
        },
        {
            key: "city",
            label: "City",
        },
        {
            key:
                "specialization",
            label:
                "Specialization",
        },
        {
            key:
                "experience",
            label:
                "Experience",
        },
        {
            key: "status",
            label: "Status",
        },
        {
            key:
                "created_at",
            label: "Joined",
        },
    ];

    /* ================= TABLE DATA ================= */
    const tableData =
        users.map((u) => ({
            ...u,

            role:
                u.role === "user"
                    ? "Customer"
                    : u.role ===
                        "technician"
                        ? "Technician"
                        : "Admin",

            phone:
                u.phone || "-",

            city:
                u.city || "-",

            specialization:
                u.specialization ||
                "-",

            experience:
                u.experience
                    ? `${u.experience} yrs`
                    : "-",

            status:
                u.status || "-",

            actions: (
                <div className="actions">
                    <button
                        onClick={() =>
                            navigate(
                                `/users/${u.id}`
                            )
                        }
                        className="btn-primary"
                    >
                        View
                    </button>

                    <button
                        onClick={() =>
                            navigate(
                                `/users/edit/${u.id}`
                            )
                        }
                        className="btn-primary"
                    >
                        Edit
                    </button>

                    <button
                        onClick={() =>
                            resetPassword(
                                u.id
                            )
                        }
                        className="btn-secondary"
                    >
                        Reset Password
                    </button>

                    <button
                        onClick={() =>
                            deleteUser(
                                u.id
                            )
                        }
                        className="btn-secondary"
                    >
                        Delete
                    </button>
                </div>
            ),
        }));

    return (
        <div className="page">

            {/* HEADER */}
            <div className="page-header">
                <h1>
                    Users Management
                </h1>

                <div
                    style={{
                        display:
                            "flex",
                        gap: "10px",
                    }}
                >
                    <button
                        onClick={() =>
                            navigate(
                                "/users/add"
                            )
                        }
                        className="btn-primary"
                    >
                        + Add User
                    </button>

                    
                </div>
            </div>

            {/* STATS */}
            <div
                className="dashboard-stats"
                style={{
                    display: "grid",
                    gridTemplateColumns:
                        "repeat(auto-fit,minmax(220px,1fr))",
                    gap: "20px",
                    marginBottom:
                        "25px",
                }}
            >
                <div className="stat-card">
                    <h3>Total Users</h3>
                    <p>{stats.total}</p>
                </div>

                <div className="stat-card">
                    <h3>Customers</h3>
                    <p>
                        {
                            stats.customers
                        }
                    </p>
                </div>

                <div className="stat-card">
                    <h3>
                        Technicians
                    </h3>
                    <p>
                        {
                            stats.technicians
                        }
                    </p>
                </div>

                <div className="stat-card">
                    <h3>Admins</h3>
                    <p>
                        {stats.admins}
                    </p>
                </div>
            </div>

            {/* ROLE FILTERS */}
            <div
                className="role-filters"
                style={{
                    display: "flex",
                    gap: "10px",
                    marginBottom:
                        "20px",
                    flexWrap:
                        "wrap",
                }}
            >
                <button
                    onClick={() =>
                        setRoleFilter(
                            "all"
                        )
                    }
                    className={
                        roleFilter ===
                            "all"
                            ? "btn-primary"
                            : "btn-secondary"
                    }
                >
                    All Users
                </button>

                <button
                    onClick={() =>
                        setRoleFilter(
                            "user"
                        )
                    }
                    className={
                        roleFilter ===
                            "user"
                            ? "btn-primary"
                            : "btn-secondary"
                    }
                >
                    Customers
                </button>

                <button
                    onClick={() =>
                        setRoleFilter(
                            "technician"
                        )
                    }
                    className={
                        roleFilter ===
                            "technician"
                            ? "btn-primary"
                            : "btn-secondary"
                    }
                >
                    Technicians
                </button>

                <button
                    onClick={() =>
                        setRoleFilter(
                            "admin"
                        )
                    }
                    className={
                        roleFilter ===
                            "admin"
                            ? "btn-primary"
                            : "btn-secondary"
                    }
                >
                    Admins
                </button>
            </div>

            {/* TABLE */}
            <div className="card-form">
                {loading ? (
                    <div className="loader">
                        Loading...
                    </div>
                ) : users.length ===
                    0 ? (
                    <div
                        style={{
                            textAlign:
                                "center",
                            padding:
                                "20px",
                        }}
                    >
                        No users found
                    </div>
                ) : (
                    <DataTable
                        data={
                            tableData
                        }
                        columns={
                            columns
                        }
                    />
                )}
            </div>
        </div>
    );
}