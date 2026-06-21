export const ACTIVE_STATUSES = ["created", "searching", "assigned", "in_progress"];
export const COMPLETED_STATUSES = ["completed"];
export const CANCELLED_STATUSES = ["cancelled"];

export function formatStatus(status) {
  const map = {
    created: "Confirmed",
    searching: "Finding expert",
    assigned: "Expert assigned",
    in_progress: "In progress",
    completed: "Completed",
    cancelled: "Cancelled",
  };
  return map[status] || status;
}

export function getTrackingSteps(booking) {
  const t = booking?.timeline || {};
  const status = booking?.status;

  const done = (key) => {
    if (key === "confirmed") return true;
    if (key === "assigned") return !!t.assignedAt || ["assigned", "in_progress", "completed"].includes(status);
    if (key === "en_route") return !!t.assignedAt && ["assigned", "in_progress", "completed"].includes(status);
    if (key === "arrived") return !!t.arrivedAt || ["in_progress", "completed"].includes(status);
    if (key === "started") return !!t.startedAt || status === "completed";
    if (key === "completed") return !!t.completedAt || status === "completed";
    return false;
  };

  const current = () => {
    if (status === "cancelled") return "cancelled";
    if (t.completedAt || status === "completed") return "completed";
    if (t.startedAt || status === "in_progress") return "started";
    if (t.arrivedAt) return "arrived";
    if (t.assignedAt || status === "assigned") return "en_route";
    if (status === "searching") return "assigned";
    return "confirmed";
  };

  const cur = current();

  return [
    { id: "confirmed", label: "Booking Confirmed", state: stepState("confirmed", cur, done) },
    { id: "assigned", label: "Expert Assigned", state: stepState("assigned", cur, done) },
    { id: "en_route", label: "Expert En Route", state: stepState("en_route", cur, done) },
    { id: "arrived", label: "Expert Arrived", state: stepState("arrived", cur, done) },
    { id: "started", label: "Session Started", state: stepState("started", cur, done) },
    { id: "completed", label: "Session Completed", state: stepState("completed", cur, done) },
  ];
}

function stepState(id, current, done) {
  if (done(id)) {
    if (id === current) return "current";
    return "complete";
  }
  if (id === current) return "current";
  return "upcoming";
}
