import AdminDashboardPage from "./AdminDashboard";
import { useEffect, useMemo, useState } from "react";
import {
  HiArrowRight,
  HiCheck,
  HiCheckCircle,
  HiClock,
  HiExclamation,
  HiPlus,
  HiRefresh,
  HiStar,
  HiX,
} from "react-icons/hi";

import { useAuth } from "../context/AuthContext";
import { connectSocket } from "../services/socket";
import * as service from "../services/ticketService";

const CATEGORIES = [
  "Teaching",
  "Tutoring",
  "Technical",
  "Design",
];

const PRIORITIES = [
  "Low",
  "Medium",
  "High",
];

const STATUSES = [
  "Pending",
  "Accepted",
  "In Progress",
  "Completed",
];

const TERMINAL = [
  "Completed",
  "Rejected",
  "Cancelled",
];

const statusClass = (status) => {
  switch (status) {
    case "Completed":
      return "bg-status-success/10 text-status-success";

    case "Rejected":
    case "Cancelled":
      return "bg-status-danger/10 text-status-danger";

    case "Accepted":
      return "bg-brand-light text-brand";

    case "In Progress":
      return "bg-gold-light text-status-warning";

    case "Pending":
    default:
      return "bg-gold-light text-status-warning";
  }
};

const formatDate = (value) => {
  if (!value) return "";

  return new Date(value).toLocaleDateString(undefined, {
    month: "short",
    day: "numeric",
    year: "numeric",
  });
};

const getErrorMessage = (error, fallback) =>
  error?.response?.data?.message ||
  error?.message ||
  fallback;

/* =========================================================
   CREATE REQUEST
========================================================= */

function CreateRequest({ onClose, onCreated }) {
  const [form, setForm] = useState({
    subject: "",
    category: "",
    description: "",
    workerId: "",
  });

  const [workers, setWorkers] = useState([]);
  const [loadingWorkers, setLoadingWorkers] = useState(false);
  const [submitting, setSubmitting] = useState(false);
  const [error, setError] = useState("");

  const updateField = (field, value) => {
    setForm((current) => ({
      ...current,
      [field]: value,
    }));

    setError("");

    if (field === "category") {
      setWorkers([]);
      setForm((current) => ({
        ...current,
        category: value,
        workerId: "",
      }));
    }
  };

  const findWorkers = async () => {
    if (!form.category) {
      setError("Please select a service category.");
      return;
    }

    try {
      setLoadingWorkers(true);
      setError("");
      setWorkers([]);

      const data = await service.getSuggestedWorkers(
        form.category
      );

      const availableWorkers = data.workers || [];

      setWorkers(availableWorkers);

      if (!availableWorkers.length) {
        setError(
          "No active worker is currently available for this category."
        );
      }
    } catch (error) {
      setError(
        getErrorMessage(
          error,
          "Unable to find available workers."
        )
      );
    } finally {
      setLoadingWorkers(false);
    }
  };

  const submit = async (event) => {
    event.preventDefault();

    if (!form.subject.trim()) {
      setError("Please enter a subject.");
      return;
    }

    if (!form.category) {
      setError("Please select a category.");
      return;
    }

    if (!form.description.trim()) {
      setError("Please describe your request.");
      return;
    }

    if (!form.workerId) {
      setError("Please select an available worker.");
      return;
    }

    try {
      setSubmitting(true);
      setError("");

      const data = await service.createTicket({
        subject: form.subject.trim(),
        category: form.category,
        description: form.description.trim(),
        workerId: form.workerId,
      });

      onCreated(data.ticket);
    } catch (error) {
      setError(
        getErrorMessage(
          error,
          "Unable to create service request."
        )
      );
    } finally {
      setSubmitting(false);
    }
  };

  return (
    <div
      className="fixed inset-0 z-[100] flex items-center justify-center bg-ink/40 p-4"
      onMouseDown={(event) => {
        if (event.target === event.currentTarget) {
          onClose();
        }
      }}
    >
      <form
        onSubmit={submit}
        className="max-h-[92vh] w-full max-w-2xl overflow-y-auto rounded-[var(--radius-lg)] border border-line bg-card shadow-modal"
      >
        <div className="flex items-start justify-between border-b border-line p-6 md:p-7">
          <div>
            <p className="text-xs font-bold uppercase tracking-[0.18em] text-gold">
              New request
            </p>

            <h2 className="mt-2 text-2xl font-semibold tracking-tight">
              Tell us what you need.
            </h2>

            <p className="mt-2 text-sm text-muted">
              Choose a specialist and send your service request.
            </p>
          </div>

          <button
            type="button"
            onClick={onClose}
            className="rounded-full p-2 text-muted transition hover:bg-page hover:text-ink"
            aria-label="Close"
          >
            <HiX size={22} />
          </button>
        </div>

        <div className="space-y-5 p-6 md:p-7">
          {error && (
            <div className="rounded-md border border-status-danger/20 bg-status-danger/10 px-4 py-3">
              <p className="text-sm text-status-danger">
                {error}
              </p>
            </div>
          )}

          {/* Subject */}
          <label className="block text-sm font-medium text-secondary">
            <span className="mb-2 block">
              Subject
            </span>

            <input
              required
              maxLength={200}
              value={form.subject}
              onChange={(event) =>
                updateField(
                  "subject",
                  event.target.value
                )
              }
              placeholder="What do you need help with?"
              className="w-full rounded-md border border-line bg-card px-4 py-3 text-sm text-ink outline-none transition focus:border-brand focus:ring-2 focus:ring-brand/10"
            />
          </label>

          {/* Category */}
          <div>
            <label className="mb-2 block text-sm font-medium text-secondary">
              Category
            </label>

            <div className="flex flex-col gap-3 sm:flex-row">
              <select
                required
                value={form.category}
                onChange={(event) =>
                  updateField(
                    "category",
                    event.target.value
                  )
                }
                className="min-w-0 flex-1 rounded-md border border-line bg-card px-4 py-3 text-sm text-ink outline-none focus:border-brand"
              >
                <option value="">
                  Select a category
                </option>

                {CATEGORIES.map((category) => (
                  <option
                    key={category}
                    value={category}
                  >
                    {category}
                  </option>
                ))}
              </select>

              <button
                type="button"
                onClick={findWorkers}
                disabled={
                  loadingWorkers || !form.category
                }
                className="rounded-md border border-brand px-5 py-3 text-sm font-semibold text-brand transition hover:bg-brand-light disabled:cursor-not-allowed disabled:opacity-50"
              >
                {loadingWorkers
                  ? "Finding..."
                  : "Find available workers"}
              </button>
            </div>
          </div>

          {/* Workers */}
          {workers.length > 0 && (
            <div>
              <p className="mb-3 text-sm font-semibold text-secondary">
                Choose a specialist
              </p>

              <div className="grid gap-3 sm:grid-cols-3">
                {workers.map((worker) => {
                  const selected =
                    form.workerId === worker._id;

                  return (
                    <button
                      type="button"
                      key={worker._id}
                      onClick={() =>
                        updateField(
                          "workerId",
                          worker._id
                        )
                      }
                      className={`rounded-md border p-4 text-left transition ${
                        selected
                          ? "border-brand bg-brand-light"
                          : "border-line hover:border-gold"
                      }`}
                    >
                      <div className="flex items-start justify-between gap-2">
                        <p className="font-semibold text-ink">
                          {worker.name}
                        </p>

                        {selected && (
                          <HiCheck
                            className="text-brand"
                            size={18}
                          />
                        )}
                      </div>

                      <p className="mt-2 text-xs text-muted">
                        {(Number(
                          worker.ratingAverage
                        ) || 0).toFixed(1)}{" "}
                        ★ ·{" "}
                        {worker.ratingCount || 0} reviews
                      </p>

                      <p className="mt-2 text-xs text-secondary">
                        {(
                          worker.serviceCategories || []
                        ).join(" · ")}
                      </p>
                    </button>
                  );
                })}
              </div>
            </div>
          )}

          {/* Description */}
          <label className="block text-sm font-medium text-secondary">
            <span className="mb-2 block">
              Describe your issue
            </span>

            <textarea
              required
              maxLength={5000}
              rows={6}
              value={form.description}
              onChange={(event) =>
                updateField(
                  "description",
                  event.target.value
                )
              }
              placeholder="Explain what you need and include useful details."
              className="w-full resize-y rounded-md border border-line bg-card px-4 py-3 text-sm text-ink outline-none transition focus:border-brand focus:ring-2 focus:ring-brand/10"
            />
          </label>

          <button
            type="submit"
            disabled={
              submitting || !form.workerId
            }
            className="inline-flex w-full items-center justify-center gap-2 rounded-md bg-brand px-5 py-3.5 text-sm font-semibold text-card transition hover:bg-brand-dark disabled:cursor-not-allowed disabled:opacity-50"
          >
            {submitting
              ? "Creating request..."
              : "Send request"}

            <HiArrowRight />
          </button>
        </div>
      </form>
    </div>
  );
}

/* =========================================================
   EDIT REQUEST
========================================================= */

function EditRequest({
  ticket,
  onClose,
  onUpdated,
}) {
  const [form, setForm] = useState({
    subject: ticket.subject || "",
    category: ticket.category || "",
    description: ticket.description || "",
  });

  const [saving, setSaving] = useState(false);
  const [error, setError] = useState("");

  const submit = async (event) => {
    event.preventDefault();

    if (!form.subject.trim()) {
      setError("Subject cannot be empty.");
      return;
    }

    if (!form.description.trim()) {
      setError("Description cannot be empty.");
      return;
    }

    try {
      setSaving(true);
      setError("");

      const data =
        await service.updateCustomerTicket(
          ticket._id,
          {
            subject: form.subject.trim(),
            category: form.category,
            description: form.description.trim(),
          }
        );

      onUpdated(data.ticket);
    } catch (error) {
      setError(
        getErrorMessage(
          error,
          "Unable to update request."
        )
      );
    } finally {
      setSaving(false);
    }
  };

  return (
    <div className="fixed inset-0 z-[100] flex items-center justify-center bg-ink/40 p-4">
      <form
        onSubmit={submit}
        className="w-full max-w-xl rounded-[var(--radius-lg)] border border-line bg-card p-6 shadow-modal md:p-7"
      >
        <div className="flex items-start justify-between">
          <div>
            <p className="text-xs font-bold uppercase tracking-[0.18em] text-gold">
              Edit request
            </p>

            <h2 className="mt-2 text-2xl font-semibold">
              Update your request.
            </h2>
          </div>

          <button
            type="button"
            onClick={onClose}
            className="rounded-full p-2 text-muted hover:bg-page"
          >
            <HiX size={21} />
          </button>
        </div>

        {error && (
          <div className="mt-5 rounded-md bg-status-danger/10 p-3 text-sm text-status-danger">
            {error}
          </div>
        )}

        <div className="mt-6 space-y-5">
          <label className="block text-sm font-medium text-secondary">
            Subject
            <input
              required
              maxLength={200}
              value={form.subject}
              onChange={(event) =>
                setForm({
                  ...form,
                  subject: event.target.value,
                })
              }
              className="mt-2 w-full rounded-md border border-line p-3 text-sm outline-none focus:border-brand"
            />
          </label>

          <label className="block text-sm font-medium text-secondary">
            Category
            <select
              value={form.category}
              onChange={(event) =>
                setForm({
                  ...form,
                  category: event.target.value,
                })
              }
              className="mt-2 w-full rounded-md border border-line bg-card p-3 text-sm outline-none focus:border-brand"
            >
              {CATEGORIES.map((category) => (
                <option
                  key={category}
                  value={category}
                >
                  {category}
                </option>
              ))}
            </select>
          </label>

          <label className="block text-sm font-medium text-secondary">
            Description
            <textarea
              required
              maxLength={5000}
              rows={6}
              value={form.description}
              onChange={(event) =>
                setForm({
                  ...form,
                  description:
                    event.target.value,
                })
              }
              className="mt-2 w-full rounded-md border border-line p-3 text-sm outline-none focus:border-brand"
            />
          </label>

          <div className="flex gap-3">
            <button
              type="button"
              onClick={onClose}
              className="flex-1 rounded-md border border-line px-4 py-3 text-sm font-semibold text-secondary"
            >
              Cancel
            </button>

            <button
              type="submit"
              disabled={saving}
              className="flex-1 rounded-md bg-brand px-4 py-3 text-sm font-semibold text-card disabled:opacity-50"
            >
              {saving
                ? "Saving..."
                : "Save changes"}
            </button>
          </div>
        </div>
      </form>
    </div>
  );
}

/* =========================================================
   CUSTOMER DETAIL
========================================================= */

function CustomerDetail({
  ticket,
  onChanged,
}) {
  const [detail, setDetail] = useState(null);
  const [message, setMessage] = useState("");
  const [sending, setSending] = useState(false);

  const [editing, setEditing] = useState(false);
  const [reviewComment, setReviewComment] =
    useState("");

  const [error, setError] = useState("");

  useEffect(() => {
    let mounted = true;

    const load = async () => {
      try {
        setError("");

        const data =
          await service.getCustomerTicket(
            ticket._id
          );

        if (mounted) {
          setDetail(data);
        }
      } catch (error) {
        if (mounted) {
          setError(
            getErrorMessage(
              error,
              "Unable to load request."
            )
          );
        }
      }
    };

    load();

    return () => {
      mounted = false;
    };
  }, [ticket._id]);

  const current =
    detail?.ticket || ticket;

  const messages =
    detail?.messages || [];

  const closed = TERMINAL.includes(
    current.status
  );

  const sendMessage = async (event) => {
    event.preventDefault();

    if (!message.trim()) return;

    try {
      setSending(true);
      setError("");

      const data =
        await service.sendCustomerMessage(
          current._id,
          message.trim()
        );

      setDetail((old) => ({
        ...(old || {}),
        messages: [
          ...(old?.messages || []),
          data.newMessage,
        ],
      }));

      setMessage("");
    } catch (error) {
      setError(
        getErrorMessage(
          error,
          "Unable to send message."
        )
      );
    } finally {
      setSending(false);
    }
  };

  const cancel = async () => {
    const reason = window.prompt(
      "Why are you cancelling this request?"
    );

    if (reason === null) return;

    try {
      setSending(true);
      setError("");

      const data =
        await service.cancelTicket(
          current._id,
          reason
        );

      setDetail((old) => ({
        ...(old || {}),
        ticket: data.ticket,
      }));

      onChanged(data.ticket);
    } catch (error) {
      setError(
        getErrorMessage(
          error,
          "Unable to cancel request."
        )
      );
    } finally {
      setSending(false);
    }
  };

  const submitReview = async (rating) => {
    try {
      setSending(true);
      setError("");

      const data =
        await service.createReview(
          current._id,
          {
            rating,
            comment: reviewComment.trim(),
          }
        );

      setDetail((old) => ({
        ...(old || {}),
        review: data.review,
      }));

      setReviewComment("");
    } catch (error) {
      setError(
        getErrorMessage(
          error,
          "Unable to submit review."
        )
      );
    } finally {
      setSending(false);
    }
  };

  return (
    <>
      <aside className="rounded-[var(--radius-lg)] border border-line bg-card shadow-soft">
        {/* Header */}
        <div className="border-b border-line p-6">
          <div className="flex items-start justify-between gap-4">
            <div>
              <p className="text-xs font-bold tracking-[0.15em] text-gold">
                {current.ticketNumber}
              </p>

              <h2 className="mt-2 text-xl font-semibold">
                {current.subject}
              </h2>
            </div>

            <span
              className={`shrink-0 rounded-full px-3 py-1 text-xs font-semibold ${statusClass(
                current.status
              )}`}
            >
              {current.status}
            </span>
          </div>

          <p className="mt-5 text-sm leading-7 text-secondary">
            {current.description}
          </p>

          <div className="mt-5 flex flex-wrap gap-2">
            <span className="rounded-full bg-page px-3 py-1 text-xs text-secondary">
              {current.category}
            </span>

            <span className="rounded-full bg-page px-3 py-1 text-xs text-secondary">
              {current.priority} priority
            </span>

            {current.assignedWorker && (
              <span className="rounded-full bg-brand-light px-3 py-1 text-xs text-brand">
                {current.assignedWorker.name}
              </span>
            )}
          </div>

          {current.aiSummary && (
            <div className="mt-5 rounded-md bg-gold-light p-4">
              <p className="text-xs font-bold uppercase tracking-wider text-status-warning">
                AI summary
              </p>

              <p className="mt-2 text-sm leading-6 text-secondary">
                {current.aiSummary}
              </p>
            </div>
          )}

          {current.completionNote && (
            <div className="mt-4 rounded-md bg-brand-light p-4">
              <p className="text-xs font-bold uppercase tracking-wider text-brand">
                Completion note
              </p>

              <p className="mt-2 text-sm leading-6 text-secondary">
                {current.completionNote}
              </p>
            </div>
          )}

          {current.rejectionReason && (
            <div className="mt-4 rounded-md bg-status-danger/10 p-4">
              <p className="text-xs font-bold uppercase tracking-wider text-status-danger">
                Rejection reason
              </p>

              <p className="mt-2 text-sm leading-6 text-secondary">
                {current.rejectionReason}
              </p>
            </div>
          )}

          {current.cancelledReason && (
            <div className="mt-4 rounded-md bg-status-danger/10 p-4">
              <p className="text-xs font-bold uppercase tracking-wider text-status-danger">
                Cancellation reason
              </p>

              <p className="mt-2 text-sm leading-6 text-secondary">
                {current.cancelledReason}
              </p>
            </div>
          )}
        </div>

        {/* Customer CRUD actions */}
        {current.status === "Pending" && (
          <div className="flex flex-col gap-3 border-b border-line p-5 sm:flex-row">
            <button
              type="button"
              onClick={() => setEditing(true)}
              disabled={sending}
              className="flex-1 rounded-md border border-brand px-4 py-2.5 text-sm font-semibold text-brand hover:bg-brand-light disabled:opacity-50"
            >
              Edit request
            </button>

            <button
              type="button"
              onClick={cancel}
              disabled={sending}
              className="flex-1 rounded-md border border-status-danger px-4 py-2.5 text-sm font-semibold text-status-danger hover:bg-status-danger/10 disabled:opacity-50"
            >
              Cancel request
            </button>
          </div>
        )}

        {/* Error */}
        {error && (
          <div className="mx-5 mt-5 rounded-md bg-status-danger/10 p-3 text-sm text-status-danger">
            {error}
          </div>
        )}

        {/* Messages */}
        <div className="max-h-80 space-y-3 overflow-y-auto p-5">
          {messages.length === 0 ? (
            <p className="py-6 text-center text-sm text-muted">
              No messages yet.
            </p>
          ) : (
            messages.map((item) => (
              <div
                key={item._id}
                className={`rounded-md p-3 text-sm ${
                  item.senderRole ===
                  "customer"
                    ? "ml-8 bg-brand text-card"
                    : "mr-8 bg-page text-secondary"
                }`}
              >
                <p className="leading-6">
                  {item.message}
                </p>

                <p
                  className={`mt-2 text-[10px] ${
                    item.senderRole ===
                    "customer"
                      ? "text-card/60"
                      : "text-muted"
                  }`}
                >
                  {item.sender?.name ||
                    item.senderRole}{" "}
                  · {formatDate(item.createdAt)}
                </p>
              </div>
            ))
          )}
        </div>

        {/* Message */}
        {!closed && (
          <form
            onSubmit={sendMessage}
            className="flex gap-2 border-t border-line p-4"
          >
            <input
              value={message}
              maxLength={3000}
              onChange={(event) =>
                setMessage(event.target.value)
              }
              placeholder="Write a message..."
              className="min-w-0 flex-1 rounded-md border border-line px-3 py-2.5 text-sm outline-none focus:border-brand"
            />

            <button
              type="submit"
              disabled={
                sending || !message.trim()
              }
              className="rounded-md bg-brand px-4 text-sm font-semibold text-card disabled:opacity-50"
            >
              Send
            </button>
          </form>
        )}

        {/* Review */}
        {current.status ===
          "Completed" &&
          !detail?.review && (
            <div className="border-t border-line p-5">
              <p className="text-sm font-semibold">
                How was your service?
              </p>

              <div className="mt-3 flex gap-2">
                {[1, 2, 3, 4, 5].map(
                  (rating) => (
                    <button
                      type="button"
                      key={rating}
                      disabled={sending}
                      onClick={() =>
                        submitReview(rating)
                      }
                      className="text-gold transition hover:scale-110 disabled:opacity-50"
                      aria-label={`Rate ${rating} stars`}
                    >
                      <HiStar size={25} />
                    </button>
                  )
                )}
              </div>

              <input
                value={reviewComment}
                maxLength={1000}
                onChange={(event) =>
                  setReviewComment(
                    event.target.value
                  )
                }
                placeholder="Optional review comment"
                className="mt-4 w-full rounded-md border border-line px-3 py-2.5 text-sm outline-none focus:border-brand"
              />
            </div>
          )}

        {detail?.review && (
          <div className="border-t border-line p-5">
            <p className="text-sm font-semibold text-status-success">
              Review submitted successfully.
            </p>

            <p className="mt-1 text-xs text-muted">
              Thank you for rating your specialist.
            </p>
          </div>
        )}
      </aside>

      {editing && (
        <EditRequest
          ticket={current}
          onClose={() => setEditing(false)}
          onUpdated={(updated) => {
            setDetail((old) => ({
              ...(old || {}),
              ticket: updated,
            }));

            onChanged(updated);
            setEditing(false);
          }}
        />
      )}
    </>
  );
}

/* =========================================================
   WORKER DETAIL
========================================================= */

function WorkerDetail({
  ticket,
  onChanged,
}) {
  const [detail, setDetail] = useState(null);
  const [busy, setBusy] = useState(false);
  const [message, setMessage] = useState("");
  const [error, setError] = useState("");

  const [priority, setPriority] =
    useState(ticket.priority || "Medium");

  const [category, setCategory] =
    useState(ticket.category || "Teaching");

  const [status, setStatus] =
    useState(ticket.status || "Pending");

  const [aiSummary, setAiSummary] =
    useState(ticket.aiSummary || "");

  const [completionNote, setCompletionNote] =
    useState(ticket.completionNote || "");

  useEffect(() => {
    let mounted = true;

    const load = async () => {
      try {
        setError("");

        const data =
          await service.getWorkerTicket(
            ticket._id
          );

        if (mounted) {
          setDetail(data);

          setPriority(
            data.ticket?.priority ||
              ticket.priority
          );

          setCategory(
            data.ticket?.category ||
              ticket.category
          );

          setStatus(
            data.ticket?.status ||
              ticket.status
          );

          setAiSummary(
            data.ticket?.aiSummary || ""
          );

          setCompletionNote(
            data.ticket?.completionNote ||
              ""
          );
        }
      } catch (error) {
        if (mounted) {
          setError(
            getErrorMessage(
              error,
              "Unable to load request."
            )
          );
        }
      }
    };

    load();

    return () => {
      mounted = false;
    };
  }, [ticket._id]);

  const current =
    detail?.ticket || ticket;

  const messages =
    detail?.messages || [];

  const closed = TERMINAL.includes(
    current.status
  );

  const respond = async (decision) => {
    let rejectionReason = "";

    if (decision === "reject") {
      rejectionReason =
        window.prompt(
          "Reason for rejecting this request?"
        ) || "";

      if (!rejectionReason.trim()) {
        return;
      }
    }

    try {
      setBusy(true);
      setError("");

      const data =
        await service.respondToTicket(
          current._id,
          {
            decision,
            rejectionReason,
          }
        );

      setDetail((old) => ({
        ...(old || {}),
        ticket: data.ticket,
      }));

      setStatus(data.ticket.status);
      onChanged(data.ticket);
    } catch (error) {
      setError(
        getErrorMessage(
          error,
          "Unable to update request."
        )
      );
    } finally {
      setBusy(false);
    }
  };

  const updateTicket = async () => {
    let finalCompletionNote =
      completionNote;

    if (
      status === "Completed" &&
      !finalCompletionNote.trim()
    ) {
      finalCompletionNote =
        window.prompt(
          "Completion note for the customer:"
        ) || "";

      if (!finalCompletionNote.trim()) {
        setError(
          "Completion note is required."
        );
        return;
      }

      setCompletionNote(
        finalCompletionNote
      );
    }

    try {
      setBusy(true);
      setError("");

      const data =
        await service.updateWorkerTicket(
          current._id,
          {
            priority,
            category,
            aiSummary,
            status,
            completionNote:
              finalCompletionNote,
          }
        );

      setDetail((old) => ({
        ...(old || {}),
        ticket: data.ticket,
      }));

      onChanged(data.ticket);
    } catch (error) {
      setError(
        getErrorMessage(
          error,
          "Unable to update request."
        )
      );
    } finally {
      setBusy(false);
    }
  };

  const sendMessage = async (event) => {
    event.preventDefault();

    if (!message.trim()) return;

    try {
      setBusy(true);
      setError("");

      const data =
        await service.sendWorkerMessage(
          current._id,
          message.trim()
        );

      setDetail((old) => ({
        ...(old || {}),
        messages: [
          ...(old?.messages || []),
          data.newMessage,
        ],
      }));

      setMessage("");
    } catch (error) {
      setError(
        getErrorMessage(
          error,
          "Unable to send message."
        )
      );
    } finally {
      setBusy(false);
    }
  };

  return (
    <aside className="rounded-[var(--radius-lg)] border border-line bg-card shadow-soft">
      <div className="border-b border-line p-6">
        <div className="flex items-start justify-between gap-4">
          <div>
            <p className="text-xs font-bold tracking-[0.15em] text-gold">
              {current.ticketNumber}
            </p>

            <h2 className="mt-2 text-xl font-semibold">
              {current.subject}
            </h2>

            <p className="mt-1 text-sm text-muted">
              Customer:{" "}
              {current.customer?.name ||
                "Customer"}
            </p>
          </div>

          <span
            className={`shrink-0 rounded-full px-3 py-1 text-xs font-semibold ${statusClass(
              current.status
            )}`}
          >
            {current.status}
          </span>
        </div>

        <p className="mt-5 text-sm leading-7 text-secondary">
          {current.description}
        </p>

        <div className="mt-5 flex flex-wrap gap-2">
          <span className="rounded-full bg-page px-3 py-1 text-xs text-secondary">
            {current.category}
          </span>

          <span className="rounded-full bg-page px-3 py-1 text-xs text-secondary">
            {current.priority} priority
          </span>
        </div>

        {current.aiSummary && (
          <div className="mt-5 rounded-md bg-gold-light p-4">
            <p className="text-xs font-bold uppercase tracking-wider text-status-warning">
              AI suggestion
            </p>

            <p className="mt-2 text-sm leading-6 text-secondary">
              {current.aiSummary}
            </p>
          </div>
        )}

        {current.rejectionReason && (
          <div className="mt-4 rounded-md bg-status-danger/10 p-4">
            <p className="text-xs font-bold uppercase tracking-wider text-status-danger">
              Rejection reason
            </p>

            <p className="mt-2 text-sm text-secondary">
              {current.rejectionReason}
            </p>
          </div>
        )}

        {current.completionNote && (
          <div className="mt-4 rounded-md bg-brand-light p-4">
            <p className="text-xs font-bold uppercase tracking-wider text-brand">
              Completion note
            </p>

            <p className="mt-2 text-sm text-secondary">
              {current.completionNote}
            </p>
          </div>
        )}
      </div>

      {/* Accept / Reject */}
      {current.status === "Pending" && (
        <div className="grid grid-cols-2 gap-3 border-b border-line p-5">
          <button
            type="button"
            disabled={busy}
            onClick={() =>
              respond("accept")
            }
            className="rounded-md bg-brand py-3 text-sm font-semibold text-card disabled:opacity-50"
          >
            Accept request
          </button>

          <button
            type="button"
            disabled={busy}
            onClick={() =>
              respond("reject")
            }
            className="rounded-md border border-status-danger py-3 text-sm font-semibold text-status-danger disabled:opacity-50"
          >
            Reject
          </button>
        </div>
      )}

      {/* Worker update */}
      {!closed &&
        current.status !== "Pending" && (
          <div className="space-y-4 border-b border-line p-5">
            <div className="grid gap-3 sm:grid-cols-2">
              <label className="text-sm font-medium text-secondary">
                Category
                <select
                  value={category}
                  disabled={busy}
                  onChange={(event) =>
                    setCategory(
                      event.target.value
                    )
                  }
                  className="mt-2 w-full rounded-md border border-line bg-card p-2.5 text-sm"
                >
                  {CATEGORIES.map(
                    (item) => (
                      <option
                        key={item}
                        value={item}
                      >
                        {item}
                      </option>
                    )
                  )}
                </select>
              </label>

              <label className="text-sm font-medium text-secondary">
                Priority
                <select
                  value={priority}
                  disabled={busy}
                  onChange={(event) =>
                    setPriority(
                      event.target.value
                    )
                  }
                  className="mt-2 w-full rounded-md border border-line bg-card p-2.5 text-sm"
                >
                  {PRIORITIES.map(
                    (item) => (
                      <option
                        key={item}
                        value={item}
                      >
                        {item}
                      </option>
                    )
                  )}
                </select>
              </label>
            </div>

            <label className="block text-sm font-medium text-secondary">
              AI summary / reviewed summary
              <textarea
                maxLength={300}
                rows={3}
                value={aiSummary}
                disabled={busy}
                onChange={(event) =>
                  setAiSummary(
                    event.target.value
                  )
                }
                className="mt-2 w-full rounded-md border border-line p-3 text-sm"
              />
            </label>

            <label className="block text-sm font-medium text-secondary">
              Status
              <select
                value={status}
                disabled={busy}
                onChange={(event) =>
                  setStatus(
                    event.target.value
                  )
                }
                className="mt-2 w-full rounded-md border border-line bg-card p-2.5 text-sm"
              >
                {STATUSES.map(
                  (item) => (
                    <option
                      key={item}
                      value={item}
                    >
                      {item}
                    </option>
                  )
                )}
              </select>
            </label>

            {status === "Completed" && (
              <label className="block text-sm font-medium text-secondary">
                Completion note
                <textarea
                  required
                  maxLength={3000}
                  rows={4}
                  value={completionNote}
                  disabled={busy}
                  onChange={(event) =>
                    setCompletionNote(
                      event.target.value
                    )
                  }
                  placeholder="Explain how the request was resolved."
                  className="mt-2 w-full rounded-md border border-line p-3 text-sm"
                />
              </label>
            )}

            <button
              type="button"
              disabled={busy}
              onClick={updateTicket}
              className="flex w-full items-center justify-center gap-2 rounded-md bg-brand py-3 text-sm font-semibold text-card disabled:opacity-50"
            >
              <HiCheckCircle size={18} />

              {busy
                ? "Saving..."
                : "Save ticket update"}
            </button>
          </div>
        )}

      {error && (
        <div className="m-5 rounded-md bg-status-danger/10 p-3 text-sm text-status-danger">
          {error}
        </div>
      )}

      {/* Messages */}
      <div className="max-h-80 space-y-3 overflow-y-auto p-5">
        {messages.length === 0 ? (
          <p className="py-6 text-center text-sm text-muted">
            No messages yet.
          </p>
        ) : (
          messages.map((item) => (
            <div
              key={item._id}
              className={`rounded-md p-3 text-sm ${
                item.senderRole ===
                "worker"
                  ? "ml-8 bg-brand text-card"
                  : "mr-8 bg-page text-secondary"
              }`}
            >
              <p>{item.message}</p>

              <p
                className={`mt-2 text-[10px] ${
                  item.senderRole ===
                  "worker"
                    ? "text-card/60"
                    : "text-muted"
                }`}
              >
                {item.sender?.name ||
                  item.senderRole}{" "}
                · {formatDate(item.createdAt)}
              </p>
            </div>
          ))
        )}
      </div>

      {!closed && (
        <form
          onSubmit={sendMessage}
          className="flex gap-2 border-t border-line p-4"
        >
          <input
            value={message}
            maxLength={3000}
            onChange={(event) =>
              setMessage(event.target.value)
            }
            placeholder="Reply to customer..."
            className="min-w-0 flex-1 rounded-md border border-line px-3 py-2.5 text-sm outline-none focus:border-brand"
          />

          <button
            type="submit"
            disabled={
              busy || !message.trim()
            }
            className="rounded-md bg-brand px-4 text-sm font-semibold text-card disabled:opacity-50"
          >
            Send
          </button>
        </form>
      )}
    </aside>
  );
}

/* =========================================================
   ADMIN
========================================================= */

function AdminDashboard() {
  const [users, setUsers] = useState([]);
  const [selectedWorker, setSelectedWorker] =
    useState(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState("");

  const loadUsers = async () => {
    try {
      setLoading(true);
      setError("");

      const data =
        await service.getAdminUsers();

      setUsers(data.users || []);
    } catch (error) {
      setError(
        getErrorMessage(
          error,
          "Unable to load users."
        )
      );
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    loadUsers();
  }, []);

  const workers = useMemo(
    () =>
      users.filter(
        (item) => item.role === "worker"
      ),
    [users]
  );

  const customers = useMemo(
    () =>
      users.filter(
        (item) => item.role === "customer"
      ),
    [users]
  );

  const openWorker = async (worker) => {
    try {
      setError("");

      const data =
        await service.getAdminWorker(
          worker._id
        );

      setSelectedWorker(data);
    } catch (error) {
      setError(
        getErrorMessage(
          error,
          "Unable to load worker overview."
        )
      );
    }
  };

  return (
    <section className="mx-auto max-w-7xl px-5 py-10 md:px-8">
      <div className="flex flex-col justify-between gap-4 md:flex-row md:items-end">
        <div>
          <p className="text-xs font-bold uppercase tracking-[0.18em] text-gold">
            Admin workspace
          </p>

          <h1 className="mt-2 text-3xl font-semibold tracking-tight">
            People & specialists
          </h1>

          <p className="mt-2 text-sm text-muted">
            Monitor customers, workers, requests and reviews.
          </p>
        </div>

        <button
          type="button"
          onClick={loadUsers}
          className="inline-flex items-center justify-center gap-2 rounded-md border border-line px-4 py-2.5 text-sm font-semibold text-secondary"
        >
          <HiRefresh />
          Refresh
        </button>
      </div>

      {error && (
        <div className="mt-6 rounded-md bg-status-danger/10 p-3 text-sm text-status-danger">
          {error}
        </div>
      )}

      <div className="mt-8 grid gap-4 md:grid-cols-3">
        <StatCard
          icon={<HiClock size={22} />}
          value={users.length}
          label="Total users"
        />

        <StatCard
          icon={<HiCheckCircle size={22} />}
          value={customers.length}
          label="Customers"
        />

        <StatCard
          icon={<HiExclamation size={22} />}
          value={workers.length}
          label="Workers"
        />
      </div>

      <div className="mt-8 grid gap-6 lg:grid-cols-2">
        <section className="overflow-hidden rounded-lg border border-line bg-card shadow-soft">
          <div className="border-b border-line p-5">
            <h2 className="font-semibold">
              Workers
            </h2>
          </div>

          {loading ? (
            <p className="p-6 text-sm text-muted">
              Loading workers...
            </p>
          ) : workers.length === 0 ? (
            <p className="p-6 text-sm text-muted">
              No workers found.
            </p>
          ) : (
            <div className="divide-y divide-line">
              {workers.map((worker) => (
                <button
                  type="button"
                  key={worker._id}
                  onClick={() =>
                    openWorker(worker)
                  }
                  className="flex w-full items-center justify-between gap-4 p-5 text-left transition hover:bg-page"
                >
                  <div>
                    <p className="font-semibold">
                      {worker.name}
                    </p>

                    <p className="mt-1 text-xs text-muted">
                      {worker.email}
                    </p>

                    <p className="mt-2 text-xs text-secondary">
                      {(
                        worker.serviceCategories ||
                        []
                      ).join(" · ")}
                    </p>
                  </div>

                  <div className="text-right">
                    <p className="text-sm font-semibold">
                      {(Number(
                        worker.ratingAverage
                      ) || 0).toFixed(1)}{" "}
                      ★
                    </p>

                    <p className="mt-1 text-xs text-muted">
                      {worker.ratingCount || 0} reviews
                    </p>
                  </div>
                </button>
              ))}
            </div>
          )}
        </section>

        <section className="overflow-hidden rounded-lg border border-line bg-card shadow-soft">
          <div className="border-b border-line p-5">
            <h2 className="font-semibold">
              Customers
            </h2>
          </div>

          {loading ? (
            <p className="p-6 text-sm text-muted">
              Loading customers...
            </p>
          ) : customers.length === 0 ? (
            <p className="p-6 text-sm text-muted">
              No customers found.
            </p>
          ) : (
            <div className="divide-y divide-line">
              {customers.map((customer) => (
                <div
                  key={customer._id}
                  className="p-5"
                >
                  <p className="font-semibold">
                    {customer.name}
                  </p>

                  <p className="mt-1 text-sm text-muted">
                    {customer.email}
                  </p>

                  <p className="mt-2 text-xs text-secondary">
                    Status:{" "}
                    {customer.status}
                  </p>
                </div>
              ))}
            </div>
          )}
        </section>
      </div>

      {selectedWorker && (
        <WorkerOverview
          data={selectedWorker}
          onClose={() =>
            setSelectedWorker(null)
          }
        />
      )}
    </section>
  );
}

function StatCard({
  icon,
  value,
  label,
}) {
  return (
    <article className="rounded-lg border border-line bg-card p-5 shadow-soft">
      <div className="flex items-center justify-between">
        <div>
          <p className="text-3xl font-semibold">
            {value}
          </p>

          <p className="mt-1 text-sm text-muted">
            {label}
          </p>
        </div>

        <div className="rounded-md bg-brand-light p-3 text-brand">
          {icon}
        </div>
      </div>
    </article>
  );
}

function WorkerOverview({
  data,
  onClose,
}) {
  const worker = data.worker;
  const tickets = data.tickets || [];
  const reviews = data.reviews || [];

  return (
    <div className="fixed inset-0 z-[100] overflow-y-auto bg-ink/40 p-4 md:p-8">
      <div className="mx-auto max-w-4xl rounded-[var(--radius-lg)] border border-line bg-card shadow-modal">
        <div className="flex items-start justify-between border-b border-line p-6">
          <div>
            <p className="text-xs font-bold uppercase tracking-wider text-gold">
              Worker overview
            </p>

            <h2 className="mt-2 text-2xl font-semibold">
              {worker.name}
            </h2>

            <p className="mt-1 text-sm text-muted">
              {worker.email}
            </p>
          </div>

          <button
            type="button"
            onClick={onClose}
            className="rounded-full p-2 text-muted hover:bg-page"
          >
            <HiX size={22} />
          </button>
        </div>

        <div className="grid gap-4 border-b border-line p-6 sm:grid-cols-3">
          <StatCard
            icon={<HiCheckCircle size={22} />}
            value={tickets.length}
            label="Assigned tickets"
          />

          <StatCard
            icon={<HiStar size={22} />}
            value={(Number(
              worker.ratingAverage
            ) || 0).toFixed(1)}
            label="Rating"
          />

          <StatCard
            icon={<HiClock size={22} />}
            value={reviews.length}
            label="Reviews"
          />
        </div>

        <div className="p-6">
          <h3 className="text-lg font-semibold">
            Recent tickets
          </h3>

          <div className="mt-4 divide-y divide-line rounded-md border border-line">
            {tickets.length === 0 ? (
              <p className="p-5 text-sm text-muted">
                No tickets assigned.
              </p>
            ) : (
              tickets.map((ticket) => (
                <div
                  key={ticket._id}
                  className="flex items-center justify-between gap-4 p-4"
                >
                  <div>
                    <p className="text-xs font-bold text-gold">
                      {ticket.ticketNumber}
                    </p>

                    <p className="mt-1 font-semibold">
                      {ticket.subject}
                    </p>

                    <p className="mt-1 text-xs text-muted">
                      {ticket.customer?.name ||
                        "Customer"}
                    </p>
                  </div>

                  <span
                    className={`rounded-full px-2.5 py-1 text-xs font-semibold ${statusClass(
                      ticket.status
                    )}`}
                  >
                    {ticket.status}
                  </span>
                </div>
              ))
            )}
          </div>

          {reviews.length > 0 && (
            <>
              <h3 className="mt-8 text-lg font-semibold">
                Reviews
              </h3>

              <div className="mt-4 space-y-3">
                {reviews.map((review) => (
                  <div
                    key={review._id}
                    className="rounded-md bg-page p-4"
                  >
                    <div className="flex items-center justify-between">
                      <p className="font-semibold">
                        {review.customer?.name ||
                          "Customer"}
                      </p>

                      <p className="text-sm text-gold">
                        {"★".repeat(
                          review.rating
                        )}
                      </p>
                    </div>

                    {review.comment && (
                      <p className="mt-2 text-sm text-secondary">
                        {review.comment}
                      </p>
                    )}
                  </div>
                ))}
              </div>
            </>
          )}
        </div>
      </div>
    </div>
  );
}

/* =========================================================
   MAIN DASHBOARD
========================================================= */

export default function DashboardPage() {
  const { user } = useAuth();

  const [tickets, setTickets] =
    useState([]);

  const [selected, setSelected] =
    useState(null);

  const [creating, setCreating] =
    useState(false);

  const [loading, setLoading] =
    useState(true);

  const [error, setError] =
    useState("");

  const role = user?.role;

  const loadTickets = async () => {
    if (role === "admin") return;

    try {
      setLoading(true);
      setError("");

      const data =
        role === "worker"
          ? await service.getWorkerTickets()
          : await service.getCustomerTickets();

      setTickets(data.tickets || []);
    } catch (error) {
      setError(
        getErrorMessage(
          error,
          "Unable to load your requests."
        )
      );
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    loadTickets();
  }, [role]);

  useEffect(() => {
    if (role === "admin") return;

    const socket = connectSocket();

    const handleTicketUpdate = (
      changed
    ) => {
      if (!changed?._id) return;

      setTickets((current) => {
        const exists = current.some(
          (item) =>
            item._id === changed._id
        );

        if (!exists) {
          return [changed, ...current];
        }

        return current.map((item) =>
          item._id === changed._id
            ? {
                ...item,
                ...changed,
              }
            : item
        );
      });

      setSelected((current) =>
        current?._id === changed._id
          ? {
              ...current,
              ...changed,
            }
          : current
      );
    };

    socket.on(
      "ticket:updated",
      handleTicketUpdate
    );

    return () => {
      socket.off(
        "ticket:updated",
        handleTicketUpdate
      );

      socket.disconnect();
    };
  }, [role]);

if (role === "admin") return <AdminDashboardPage />;

  const activeTickets =
    tickets.filter(
      (ticket) =>
        !TERMINAL.includes(
          ticket.status
        )
    ).length;

  const completedTickets =
    tickets.filter(
      (ticket) =>
        ticket.status === "Completed"
    ).length;

  const rejectedTickets =
    tickets.filter(
      (ticket) =>
        ticket.status === "Rejected"
    ).length;

  const changedTicket = (updated) => {
    setTickets((current) =>
      current.map((item) =>
        item._id === updated._id
          ? updated
          : item
      )
    );

    setSelected(updated);
  };

  const createdTicket = (ticket) => {
    setTickets((current) => [
      ticket,
      ...current,
    ]);

    setSelected(ticket);
    setCreating(false);
  };

  return (
    <section className="mx-auto max-w-7xl px-5 py-10 md:px-8">
      {/* Heading */}
      <div className="flex flex-col justify-between gap-5 md:flex-row md:items-end">
        <div>
          <p className="text-xs font-bold uppercase tracking-[0.18em] text-gold">
            {role === "worker"
              ? "Worker workspace"
              : "Customer workspace"}
          </p>

          <h1 className="mt-2 text-3xl font-semibold tracking-tight">
            Welcome back,{" "}
            {user?.name?.split(" ")[0] ||
              "there"}
            .
          </h1>

          <p className="mt-2 text-sm text-muted">
            {activeTickets} active request
            {activeTickets === 1
              ? ""
              : "s"} in your workspace.
          </p>
        </div>

        <div className="flex gap-3">
          <button
            type="button"
            onClick={loadTickets}
            className="inline-flex items-center gap-2 rounded-md border border-line px-4 py-3 text-sm font-semibold text-secondary hover:bg-card"
          >
            <HiRefresh />
            Refresh
          </button>

          {role === "customer" && (
            <button
              type="button"
              onClick={() => {
                setError("");
                setCreating(true);
              }}
              className="inline-flex items-center gap-2 rounded-md bg-brand px-5 py-3 text-sm font-semibold text-card hover:bg-brand-dark"
            >
              <HiPlus />
              New request
            </button>
          )}
        </div>
      </div>

      {/* Error */}
      {error && (
        <div className="mt-6 rounded-md border border-status-danger/20 bg-status-danger/10 p-4 text-sm text-status-danger">
          {error}
        </div>
      )}

      {/* Stats */}
      <div className="mt-8 grid gap-4 md:grid-cols-3">
        <StatCard
          icon={<HiClock size={22} />}
          value={activeTickets}
          label="Active requests"
        />

        <StatCard
          icon={<HiCheckCircle size={22} />}
          value={completedTickets}
          label="Completed"
        />

        <StatCard
          icon={<HiExclamation size={22} />}
          value={rejectedTickets}
          label="Rejected"
        />
      </div>

      {/* Main */}
      <div className="mt-8 grid gap-6 lg:grid-cols-[minmax(0,1fr)_440px]">
        <section className="overflow-hidden rounded-[var(--radius-lg)] border border-line bg-card shadow-soft">
          <div className="border-b border-line px-5 py-4">
            <h2 className="font-semibold">
              {role === "worker"
                ? "Assigned requests"
                : "Your requests"}
            </h2>
          </div>

          {loading ? (
            <div className="p-10 text-center text-sm text-muted">
              Loading requests...
            </div>
          ) : tickets.length === 0 ? (
            <div className="p-10 text-center">
              <p className="text-sm text-muted">
                No requests yet.
              </p>

              {role === "customer" && (
                <button
                  type="button"
                  onClick={() =>
                    setCreating(true)
                  }
                  className="mt-4 inline-flex items-center gap-2 rounded-md bg-brand px-4 py-2.5 text-sm font-semibold text-card"
                >
                  <HiPlus />
                  Create your first request
                </button>
              )}
            </div>
          ) : (
            <div className="divide-y divide-line">
              {tickets.map((ticket) => (
                <button
                  type="button"
                  key={ticket._id}
                  onClick={() =>
                    setSelected(ticket)
                  }
                  className={`w-full p-5 text-left transition hover:bg-page ${
                    selected?._id ===
                    ticket._id
                      ? "bg-brand-light/40"
                      : ""
                  }`}
                >
                  <div className="flex items-start justify-between gap-4">
                    <div className="min-w-0">
                      <p className="text-xs font-bold tracking-[0.12em] text-gold">
                        {ticket.ticketNumber}
                      </p>

                      <h3 className="mt-1 truncate font-semibold text-ink">
                        {ticket.subject}
                      </h3>

                      <p className="mt-1 text-sm text-muted">
                        {role === "worker"
                          ? ticket.customer
                              ?.name ||
                            "Customer"
                          : ticket.assignedWorker
                              ?.name ||
                            "Assigned worker"}{" "}
                        ·{" "}
                        {formatDate(
                          ticket.createdAt
                        )}
                      </p>
                    </div>

                    <span
                      className={`shrink-0 rounded-full px-2.5 py-1 text-xs font-semibold ${statusClass(
                        ticket.status
                      )}`}
                    >
                      {ticket.status}
                    </span>
                  </div>
                </button>
              ))}
            </div>
          )}
        </section>

        {selected ? (
          role === "worker" ? (
            <WorkerDetail
              ticket={selected}
              onChanged={changedTicket}
            />
          ) : (
            <CustomerDetail
              ticket={selected}
              onChanged={changedTicket}
            />
          )
        ) : (
          <aside className="hidden rounded-[var(--radius-lg)] border border-dashed border-line bg-card p-10 text-center lg:block">
            <div className="mx-auto grid h-12 w-12 place-items-center rounded-full bg-brand-light text-brand">
              <HiArrowRight size={21} />
            </div>

            <h3 className="mt-4 font-semibold">
              Select a request
            </h3>

            <p className="mt-2 text-sm leading-6 text-muted">
              Choose a request from the list to view its details, messages and available actions.
            </p>
          </aside>
        )}
      </div>

      {creating && (
        <CreateRequest
          onClose={() =>
            setCreating(false)
          }
          onCreated={createdTicket}
        />
      )}
    </section>
  );
}