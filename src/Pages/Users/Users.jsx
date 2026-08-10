import React, { useEffect, useState } from "react";
import { getApiErrorMessage } from "../../lib/api";
import { adminUsersApi } from "../../services/adminUsersApi";
import UserDetailDrawer from "../../Components/Users/UserDetailDrawer";
import UserFilters from "../../Components/Users/UserFilters";
import UserTable from "../../Components/Users/UserTable";
import UserPagination from "../../Components/Users/UserPagination";

export default function Users() {
  const [selectedUser, setSelectedUser] = useState(null);
  const [searchQuery, setSearchQuery] = useState("");
  const [selectedTier, setSelectedTier] = useState("All Tiers");
  const [currentPage, setCurrentPage] = useState(1);
  const [sortBy, setSortBy] = useState({ field: "name", direction: "asc" });
  const [collectors, setCollectors] = useState([]);
  const [pagination, setPagination] = useState({
    total: 0,
    totalPages: 1,
  });
  const [summary, setSummary] = useState({
    totalActive: 0,
  });
  const [loading, setLoading] = useState(true);
  const [actionLoading, setActionLoading] = useState(false);
  const [error, setError] = useState("");
  const itemsPerPage = 10; // Number of items per page

  useEffect(() => {
    let isMounted = true;

    const loadUsers = async () => {
      setLoading(true);
      setError("");

      try {
        const result = await adminUsersApi.listUsers({
          page: currentPage,
          limit: itemsPerPage,
          q: searchQuery || undefined,
          tier: selectedTier,
          sortBy: sortBy.field,
          sortDirection: sortBy.direction,
        });

        if (!isMounted) return;

        setCollectors(result?.users || []);
        setPagination(result?.pagination || { total: 0, totalPages: 1 });
        setSummary(result?.summary || { totalActive: 0 });
      } catch (err) {
        if (!isMounted) return;
        setError(getApiErrorMessage(err));
        setCollectors([]);
        setPagination({ total: 0, totalPages: 1 });
      } finally {
        if (isMounted) {
          setLoading(false);
        }
      }
    };

    loadUsers();

    return () => {
      isMounted = false;
    };
  }, [currentPage, searchQuery, selectedTier, sortBy]);

  const totalActiveCount = Number(summary.totalActive || 0).toLocaleString();
  const totalCount = pagination.total || 0;
  const totalPages = pagination.totalPages || 1;

  const handleSort = (field) => {
    setSortBy((prev) => ({
      field,
      direction: prev.field === field && prev.direction === "asc" ? "desc" : "asc",
    }));
    setCurrentPage(1);
  };

  const handleSelectUser = async (user) => {
    setSelectedUser(user);

    try {
      const details = await adminUsersApi.getUser(user.id);
      setSelectedUser(details || user);
    } catch {
      setSelectedUser(user);
    }
  };

  const handleSearchChange = (value) => {
    setSearchQuery(value);
    setCurrentPage(1);
  };

  const handleTierChange = (value) => {
    setSelectedTier(value);
    setCurrentPage(1);
  };

  const refreshCurrentPage = async () => {
    const result = await adminUsersApi.listUsers({
      page: currentPage,
      limit: itemsPerPage,
      q: searchQuery || undefined,
      tier: selectedTier,
      sortBy: sortBy.field,
      sortDirection: sortBy.direction,
    });
    setCollectors(result?.users || []);
    setPagination(result?.pagination || { total: 0, totalPages: 1 });
    setSummary(result?.summary || { totalActive: 0 });
  };

  const handleToggleAccess = async (user) => {
    setActionLoading(true);
    setError("");

    try {
      const updatedUser =
        user.status === "Suspended"
          ? await adminUsersApi.unsuspendUser(user.id)
          : await adminUsersApi.suspendUser(user.id);

      setSelectedUser(updatedUser);
      await refreshCurrentPage();
    } catch (err) {
      setError(getApiErrorMessage(err));
    } finally {
      setActionLoading(false);
    }
  };

  return (
    <div className="min-h-screen p-6 bg-gray-50/50 font-sans mt-16 text-slate-800">

      {/* Title, Subtitle, & Total Active Badge Header Row */}
      <div className="flex flex-col md:flex-row md:items-center justify-between gap-4 mb-8 select-none">
        <div className="text-left">
          <h1 className="text-2xl md:text-3xl font-extrabold text-[#002B49] tracking-tight">
            User Management
          </h1>
          <p className="text-xs md:text-sm text-gray-400 mt-1 font-semibold">
            Review and manage verified horological collectors.
          </p>
        </div>

        {/* Total Active Badge */}
        <div className="bg-white border border-gray-100 px-5 py-3 rounded-2xl shadow-[0_2px_10px_rgba(0,0,0,0.01)] flex items-center gap-3.5 border-gray-200/40">
          <span className="text-[10px] font-bold text-gray-400 uppercase tracking-widest">
            Total Active
          </span>
          <span className="text-lg md:text-xl font-black text-[#002B49]">
            {totalActiveCount}
          </span>
        </div>
      </div>

      {/* Main Table Outer Card */}
      <div className="bg-white border border-gray-100/80 rounded-3xl shadow-[0_2px_12px_rgba(0,0,0,0.015)] overflow-hidden">

        {/* Upper Controls Row */}
        <UserFilters
          searchQuery={searchQuery}
          onSearchChange={handleSearchChange}
          selectedTier={selectedTier}
          onTierChange={handleTierChange}
        />

        {error && (
          <div className="mx-6 mt-5 rounded-xl border border-rose-200 bg-rose-50 px-4 py-3 text-xs font-bold text-rose-600">
            {error}
          </div>
        )}

        {loading && (
          <div className="px-6 py-5 text-xs font-bold text-gray-400">
            Loading users...
          </div>
        )}

        {/* Table Container */}
        <UserTable
          collectors={collectors}
          onSort={handleSort}
          onSelectUser={handleSelectUser}
        />

        {/* Footer Pagination Controls Row */}
        <UserPagination
          totalCount={totalCount}
          currentPage={currentPage}
          totalPages={totalPages}
          itemsPerPage={itemsPerPage}
          onPageChange={setCurrentPage}
        />
      </div>

      {/* User Details Right Drawer Modal */}
      <UserDetailDrawer
        selectedUser={selectedUser}
        onClose={() => setSelectedUser(null)}
        onToggleAccess={handleToggleAccess}
        actionLoading={actionLoading}
      />
    </div>
  );
}
