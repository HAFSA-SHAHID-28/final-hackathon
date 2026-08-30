import { useEffect, useMemo, useState } from "react";

import {
  HiUsers,
  HiUserGroup,
  HiClipboardList,
  HiClock,
  HiCheckCircle,
  HiRefresh,
  HiSearch,
} from "react-icons/hi";

import * as adminService from "../services/adminService";

const statusClass = (status) => {
  switch (status) {
    case "Completed":
      return "bg-status-success/10 text-status-success";

    case "Rejected":
    case "Cancelled":
      return "bg-status-danger/10 text-status-danger";

    case "In Progress":
      return "bg-gold-light text-gold";

    default:
      return "bg-brand-light text-brand";
  }
};

const formatDate = (date) => {
  if (!date) return "—";

  return new Date(date).toLocaleDateString("en-US", {
    day: "numeric",
    month: "short",
    year: "numeric",
  });
};

const StatCard = ({ label, value, detail, icon }) => {
  return (
    <article className="rounded-lg border border-line bg-card p-5 shadow-soft">
      <div className="flex items-start justify-between">
        <div>
          <p className="text-xs font-semibold uppercase tracking-[0.14em] text-muted">
            {label}
          </p>

          <p className="mt-3 text-3xl font-semibold text-ink">
            {value}
          </p>

          <p className="mt-1 text-sm text-secondary">
            {detail}
          </p>
        </div>

        <div className="rounded-md bg-brand-light p-3 text-brand">
          {icon}
        </div>
      </div>
    </article>
  );
};

export default function AdminDashboard() {
  const [stats, setStats] = useState(null);
  const [users, setUsers] = useState([]);
  const [tickets, setTickets] = useState([]);

  const [search, setSearch] = useState("");
  const [statusFilter, setStatusFilter] = useState("All");

  const [loading, setLoading] = useState(true);
  const [error, setError] = useState("");

  const loadDashboard = async () => {
    try {
      setLoading(true);
      setError("");

      const [statsData, usersData, ticketsData] =
        await Promise.all([
          adminService.getAdminDashboardStats(),
          adminService.getAdminUsers(),
          adminService.getAdminTickets(),
        ]);

      setStats(statsData.stats || null);
      setUsers(usersData.users || []);
      setTickets(ticketsData.tickets || []);
    } catch (error) {
      console.error("Admin dashboard error:", error);

      setError(
        error.response?.data?.message ||
          "Unable to load admin dashboard."
      );
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    loadDashboard();
  }, []);

  const filteredTickets = useMemo(() => {
    const query = search.trim().toLowerCase();

    return tickets.filter((ticket) => {
      const matchesStatus =
        statusFilter === "All" ||
        ticket.status === statusFilter;

      if (!matchesStatus) return false;

      if (!query) return true;

      return (
        ticket.ticketNumber?.toLowerCase().includes(query) ||
        ticket.subject?.toLowerCase().includes(query) ||
        ticket.category?.toLowerCase().includes(query) ||
        ticket.customer?.name?.toLowerCase().includes(query) ||
        ticket.customer?.email?.toLowerCase().includes(query) ||
        ticket.assignedWorker?.name
          ?.toLowerCase()
          .includes(query)
      );
    });
  }, [tickets, search, statusFilter]);

  const customers = users.filter(
    (user) => user.role === "customer"
  );

  const workers = users.filter(
    (user) => user.role === "worker"
  );

  if (loading) {
    return (
      <section className="mx-auto max-w-7xl px-5 py-12 md:px-8">
        <div className="rounded-lg border border-line bg-card p-10 text-center shadow-soft">
          <p className="text-sm text-muted">
            Loading admin dashboard…
          </p>
        </div>
      </section>
    );
  }

  return (
    <section className="mx-auto max-w-7xl px-5 py-10 md:px-8">
      {/* HEADER */}

      <div className="flex flex-col justify-between gap-5 md:flex-row md:items-end">
        <div>
          <p className="text-xs font-bold uppercase tracking-[0.18em] text-gold">
            Admin dashboard
          </p>

          <h1 className="mt-2 text-3xl font-semibold tracking-tight text-ink">
            Support overview
          </h1>

          <p className="mt-2 max-w-2xl text-sm leading-6 text-muted">
            Monitor users, specialists, complaints, and request
            progress from one place.
          </p>
        </div>

        <button
          type="button"
          onClick={loadDashboard}
          className="inline-flex items-center justify-center gap-2 rounded-md border border-line bg-card px-4 py-2.5 text-sm font-semibold text-secondary transition hover:border-brand hover:text-brand"
        >
          <HiRefresh size={18} />
          Refresh
        </button>
      </div>

      {/* ERROR */}

      {error && (
        <div className="mt-6 rounded-md border border-status-danger/20 bg-status-danger/5 px-4 py-3">
          <p className="text-sm text-status-danger">
            {error}
          </p>
        </div>
      )}

      {/* STATS */}

      <div className="mt-8 grid gap-4 sm:grid-cols-2 lg:grid-cols-4">
        <StatCard
          icon={<HiUsers size={22} />}
          label="Total users"
          value={stats?.totalUsers ?? 0}
          detail={`${stats?.totalCustomers ?? 0} customers`}
        />

        <StatCard
          icon={<HiUserGroup size={22} />}
          label="Specialists"
          value={stats?.totalWorkers ?? 0}
          detail="Registered workers"
        />

        <StatCard
          icon={<HiClipboardList size={22} />}
          label="Complaints"
          value={stats?.totalTickets ?? 0}
          detail={`${stats?.pending ?? 0} pending`}
        />

        <StatCard
          icon={<HiCheckCircle size={22} />}
          label="Resolved"
          value={stats?.completed ?? 0}
          detail={`${stats?.inProgress ?? 0} in progress`}
        />
      </div>

      {/* STATUS SUMMARY */}

      <div className="mt-6 rounded-lg border border-line bg-card p-5 shadow-soft">
        <div className="flex flex-col justify-between gap-3 sm:flex-row sm:items-center">
          <div>
            <h2 className="text-lg font-semibold text-ink">
              Request status
            </h2>

            <p className="mt-1 text-sm text-muted">
              Current state of all customer complaints.
            </p>
          </div>
        </div>

        <div className="mt-5 grid grid-cols-2 gap-3 sm:grid-cols-3 lg:grid-cols-6">
          <StatusBox
            label="Pending"
            value={stats?.pending ?? 0}
          />

          <StatusBox
            label="Accepted"
            value={stats?.accepted ?? 0}
          />

          <StatusBox
            label="In Progress"
            value={stats?.inProgress ?? 0}
          />

          <StatusBox
            label="Completed"
            value={stats?.completed ?? 0}
          />

          <StatusBox
            label="Rejected"
            value={stats?.rejected ?? 0}
          />

          <StatusBox
            label="Cancelled"
            value={stats?.cancelled ?? 0}
          />
        </div>
      </div>

      {/* COMPLAINTS */}

      <div className="mt-8">
        <div className="flex flex-col justify-between gap-4 md:flex-row md:items-end">
          <div>
            <h2 className="text-xl font-semibold text-ink">
              Customer complaints
            </h2>

            <p className="mt-1 text-sm text-muted">
              Every request submitted by customers.
            </p>
          </div>

          <div className="flex flex-col gap-3 sm:flex-row">
            <div className="relative">
              <HiSearch
                size={18}
                className="absolute left-3 top-1/2 -translate-y-1/2 text-muted"
              />

              <input
                value={search}
                onChange={(e) => setSearch(e.target.value)}
                placeholder="Search complaints..."
                className="w-full rounded-md border border-line bg-card py-2.5 pl-10 pr-4 text-sm outline-none focus:border-brand sm:w-64"
              />
            </div>

            <select
              value={statusFilter}
              onChange={(e) =>
                setStatusFilter(e.target.value)
              }
              className="rounded-md border border-line bg-card px-4 py-2.5 text-sm text-secondary outline-none focus:border-brand"
            >
              <option value="All">All statuses</option>
              <option value="Pending">Pending</option>
              <option value="Accepted">Accepted</option>
              <option value="In Progress">
                In Progress
              </option>
              <option value="Completed">Completed</option>
              <option value="Rejected">Rejected</option>
              <option value="Cancelled">Cancelled</option>
            </select>
          </div>
        </div>

        <div className="mt-5 overflow-hidden rounded-lg border border-line bg-card shadow-soft">
          {filteredTickets.length === 0 ? (
            <div className="p-10 text-center">
              <p className="text-sm text-muted">
                No complaints found.
              </p>
            </div>
          ) : (
            <div className="overflow-x-auto">
              <table className="w-full min-w-[1050px] text-left">
                <thead className="border-b border-line bg-page">
                  <tr>
                    <th className="px-5 py-4 text-xs font-bold uppercase tracking-[0.12em] text-muted">
                      Ticket
                    </th>

                    <th className="px-5 py-4 text-xs font-bold uppercase tracking-[0.12em] text-muted">
                      Customer
                    </th>

                    <th className="px-5 py-4 text-xs font-bold uppercase tracking-[0.12em] text-muted">
                      Complaint
                    </th>

                    <th className="px-5 py-4 text-xs font-bold uppercase tracking-[0.12em] text-muted">
                      Category
                    </th>

                    <th className="px-5 py-4 text-xs font-bold uppercase tracking-[0.12em] text-muted">
                      Specialist
                    </th>

                    <th className="px-5 py-4 text-xs font-bold uppercase tracking-[0.12em] text-muted">
                      Status
                    </th>

                    <th className="px-5 py-4 text-xs font-bold uppercase tracking-[0.12em] text-muted">
                      Date
                    </th>
                  </tr>
                </thead>

                <tbody className="divide-y divide-line">
                  {filteredTickets.map((ticket) => (
                    <tr
                      key={ticket._id}
                      className="transition hover:bg-page"
                    >
                      <td className="px-5 py-4">
                        <p className="text-xs font-bold tracking-[0.1em] text-gold">
                          {ticket.ticketNumber}
                        </p>
                      </td>

                      <td className="px-5 py-4">
                        <p className="text-sm font-semibold text-ink">
                          {ticket.customer?.name || "Unknown"}
                        </p>

                        <p className="mt-1 text-xs text-muted">
                          {ticket.customer?.email || "—"}
                        </p>
                      </td>

                      <td className="max-w-[260px] px-5 py-4">
                        <p className="text-sm font-semibold text-ink">
                          {ticket.subject}
                        </p>

                        <p className="mt-1 truncate text-xs text-muted">
                          {ticket.description}
                        </p>
                      </td>

                      <td className="px-5 py-4">
                        <span className="rounded-full bg-page px-2.5 py-1 text-xs font-medium text-secondary">
                          {ticket.category}
                        </span>
                      </td>

                      <td className="px-5 py-4">
                        <p className="text-sm text-secondary">
                          {ticket.assignedWorker?.name ||
                            "Unassigned"}
                        </p>
                      </td>

                      <td className="px-5 py-4">
                        <span
                          className={`rounded-full px-2.5 py-1 text-xs font-semibold ${statusClass(
                            ticket.status
                          )}`}
                        >
                          {ticket.status}
                        </span>
                      </td>

                      <td className="whitespace-nowrap px-5 py-4 text-sm text-muted">
                        {formatDate(ticket.createdAt)}
                      </td>
                    </tr>
                  ))}
                </tbody>
              </table>
            </div>
          )}
        </div>
      </div>

      {/* PEOPLE */}

      <div className="mt-8 grid gap-6 lg:grid-cols-2">
        <PeopleCard
          title="Customers"
          count={customers.length}
          people={customers}
        />

        <PeopleCard
          title="Specialists"
          count={workers.length}
          people={workers}
          showRating
        />
      </div>
    </section>
  );
}

const StatusBox = ({ label, value }) => {
  return (
    <div className="rounded-md border border-line bg-page p-4">
      <p className="text-xs font-semibold uppercase tracking-[0.1em] text-muted">
        {label}
      </p>

      <p className="mt-2 text-2xl font-semibold text-ink">
        {value}
      </p>
    </div>
  );
};

const PeopleCard = ({
  title,
  count,
  people,
  showRating = false,
}) => {
  return (
    <div className="overflow-hidden rounded-lg border border-line bg-card shadow-soft">
      <div className="flex items-center justify-between border-b border-line px-5 py-4">
        <div>
          <h2 className="font-semibold text-ink">
            {title}
          </h2>

          <p className="mt-1 text-xs text-muted">
            {count} registered
          </p>
        </div>

        <span className="rounded-full bg-brand-light px-3 py-1 text-xs font-semibold text-brand">
          {count}
        </span>
      </div>

      <div className="divide-y divide-line">
        {people.slice(0, 8).map((person) => (
          <div
            key={person._id}
            className="px-5 py-4"
          >
            <div className="flex items-center justify-between gap-4">
              <div className="min-w-0">
                <p className="truncate text-sm font-semibold text-ink">
                  {person.name}
                </p>

                <p className="mt-1 truncate text-xs text-muted">
                  {person.email}
                </p>
              </div>

              {showRating && (
                <span className="whitespace-nowrap text-xs text-secondary">
                  {(person.ratingAverage ?? 0).toFixed(1)} ★
                </span>
              )}
            </div>
          </div>
        ))}

        {people.length === 0 && (
          <p className="px-5 py-8 text-sm text-muted">
            No {title.toLowerCase()} yet.
          </p>
        )}
      </div>
    </div>
  );
};