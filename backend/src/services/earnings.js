const Booking = require("../models/Booking");

const COMMISSION_RATE = 0.7;
const BASE_SALARY_DAILY = 0;
const BONUS_PER_JOB = 50;

function startOfDay(d = new Date()) {
  const x = new Date(d);
  x.setHours(0, 0, 0, 0);
  return x;
}

function startOfWeek(d = new Date()) {
  const x = startOfDay(d);
  const day = x.getDay();
  const diff = day === 0 ? 6 : day - 1;
  x.setDate(x.getDate() - diff);
  return x;
}

function startOfMonth(d = new Date()) {
  const x = new Date(d);
  x.setDate(1);
  x.setHours(0, 0, 0, 0);
  return x;
}

async function aggregateForExpert(expertId, fromDate) {
  const bookings = await Booking.find({
    expert: expertId,
    status: "completed",
    "timeline.completedAt": { $gte: fromDate },
  }).lean();

  const commission = bookings.reduce(
    (sum, b) => sum + Math.round((b.expertEarning || b.pricing?.subtotal || 0) * COMMISSION_RATE),
    0
  );
  const jobCount = bookings.length;
  const bonus = jobCount * BONUS_PER_JOB;
  const days =
    fromDate >= startOfDay()
      ? 1
      : fromDate >= startOfWeek()
        ? 7
        : 30;
  const baseSalary = BASE_SALARY_DAILY * Math.min(days, jobCount > 0 ? days : 0);

  return {
    orderCount: jobCount,
    commission,
    baseSalary,
    bonus,
    total: commission + baseSalary + bonus,
  };
}

async function getEarnings(expertId, period) {
  const now = new Date();
  const ranges = {
    today: startOfDay(now),
    week: startOfWeek(now),
    month: startOfMonth(now),
  };
  const from = ranges[period] || ranges.today;
  const data = await aggregateForExpert(expertId, from);
  return { period, ...data };
}

async function getDashboard(expertId) {
  const todayStart = startOfDay();
  const [today, week, month, recent] = await Promise.all([
    aggregateForExpert(expertId, todayStart),
    aggregateForExpert(expertId, startOfWeek()),
    aggregateForExpert(expertId, startOfMonth()),
    Booking.find({ expert: expertId })
      .sort({ createdAt: -1 })
      .limit(5)
      .populate("customer", "name phone publicId")
      .lean(),
  ]);

  const todayOrders = await Booking.countDocuments({
    expert: expertId,
    createdAt: { $gte: todayStart },
    status: { $nin: ["cancelled"] },
  });

  return {
    today: {
      orders: todayOrders,
      earnings: today.total,
      completed: today.orderCount,
    },
    earnings: { today, week, month },
    recentOrderIds: recent.map((b) => b.publicId),
  };
}

module.exports = { getEarnings, getDashboard, COMMISSION_RATE };
