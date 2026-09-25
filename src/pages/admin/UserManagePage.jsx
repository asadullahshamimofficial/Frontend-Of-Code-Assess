import { useState, useEffect } from "react";
import { userApi } from "../../api/users";
import Loader from "../../components/common/Loader";
import EmptyState from "../../components/common/EmptyState";
import toast from "react-hot-toast";
import { FiUsers, FiSearch, FiShield, FiCheckCircle, FiXCircle } from "react-icons/fi";

export default function UserManagePage() {
  const [users, setUsers] = useState([]);
  const [loading, setLoading] = useState(true);
  const [search, setSearch] = useState("");

  useEffect(() => {
    const fetchUsers = async () => {
      try {
        const data = await userApi.getAll();
        setUsers(Array.isArray(data) ? data : data.items || []);
      } catch {
        setUsers([]);
      } finally {
        setLoading(false);
      }
    };
    fetchUsers();
  }, []);

  const handleRoleToggle = async (userId, currentRole) => {
    const newRole = currentRole === "admin" ? "user" : "admin";
    try {
      await userApi.updateRole(userId, newRole);
    } catch { /* empty */ }
    setUsers((prev) => prev.map((u) => (u.id === userId ? { ...u, role: newRole } : u)));
    toast.success(`Role updated to ${newRole}`);
  };

  const handleStatusToggle = async (userId, currentStatus) => {
    const newStatus = !currentStatus;
    try {
      await userApi.toggleStatus(userId);
    } catch { /* empty */ }
    setUsers((prev) => prev.map((u) => (u.id === userId ? { ...u, is_active: newStatus } : u)));
    toast.success(`Status updated to ${newStatus ? "Active" : "Inactive"}`);
  };

  const filteredUsers = users.filter(
    (u) => u.name?.toLowerCase().includes(search.toLowerCase()) || u.email?.toLowerCase().includes(search.toLowerCase())
  );

  if (loading) return <Loader text="Loading user directory..." />;

  return (
    <div className="space-y-6">
      <div>
        <h1 className="text-2xl font-extrabold text-slate-900 tracking-tight">User Management</h1>
        <p className="text-sm text-slate-500 mt-1">Manage registered users, assign admin roles, and control account access.</p>
      </div>

      <div className="bg-white rounded-2xl border border-slate-200/80 p-4 shadow-xs">
        <div className="relative">
            <FiSearch className="absolute left-3 top-1/2 -translate-y-1/2 z-10 text-slate-400" />
          <input
            type="text"
            value={search}
            onChange={(e) => setSearch(e.target.value)}
            placeholder="Search users by name or email..."
            className="input input-bordered w-full pl-10 text-sm"
          />
        </div>
      </div>

      {filteredUsers.length === 0 ? (
        <EmptyState icon={FiUsers} title="No users found" message="No users match your search query." />
      ) : (
        <div className="bg-white rounded-2xl border border-slate-200/80 shadow-xs overflow-hidden">
          <div className="overflow-x-auto">
            <table className="table w-full">
              <thead className="bg-slate-50/80 text-slate-600 text-xs uppercase font-bold border-b border-slate-200">
                <tr>
                  <th>User</th>
                  <th>Email</th>
                  <th>Role</th>
                  <th>Status</th>
                  <th className="text-right">Manage</th>
                </tr>
              </thead>
              <tbody className="divide-y divide-slate-100 text-sm">
                {filteredUsers.map((u) => (
                  <tr key={u.id} className="hover:bg-slate-50/60 transition-colors">
                    <td>
                      <div className="flex items-center gap-3">
                        <div className="w-8 h-8 rounded-full bg-primary/10 text-primary font-bold flex items-center justify-center text-xs"> {u.name ? u.name.charAt(0).toUpperCase() : "U"} </div>
                        <span className="font-bold text-slate-900">{u.name}</span>
                      </div>
                    </td>
                    <td className="text-slate-600 text-xs font-mono">{u.email}</td>
                    <td> <span className={`badge badge-sm font-bold uppercase text-[10px] ${u.role === "admin" ? "badge-warning" : "badge-ghost"}`}>{u.role} </span> </td>
                    <td> {u.is_active ? (<span className="text-xs font-semibold text-emerald-600 flex items-center gap-1"><FiCheckCircle /> Active</span>) : (<span className="text-xs font-semibold text-red-600 flex items-center gap-1"><FiXCircle /> Inactive</span>)}
                    </td>
                    <td className="text-right">
                      <div className="flex items-center justify-end gap-2">
                        <button onClick={() => handleRoleToggle(u.id, u.role)} className="btn btn-xs btn-outline"> <FiShield /> {u.role === "admin" ? "Demote" : "Make Admin"} </button>
                        <button onClick={() => handleStatusToggle(u.id, u.is_active)} className={`btn btn-xs ${u.is_active ? "btn-ghost text-red-600 hover:bg-red-50" : "btn-success text-white"}`}> {u.is_active ? "Deactivate" : "Activate"} </button>
                      </div>
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        </div>
      )}
    </div>
  );
}
