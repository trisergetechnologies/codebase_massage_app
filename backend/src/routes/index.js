const router = require("express").Router();
const auth = require("../controllers/auth.controller");
const services = require("../controllers/service.controller");
const categories = require("../controllers/category.controller");
const bookings = require("../controllers/booking.controller");
const experts = require("../controllers/expert.controller");
const customer = require("../controllers/customer.controller");
const admin = require("../controllers/admin.controller");
const couponService = require("../services/coupons");
const surgeService = require("../services/surge");
const { requireAuth } = require("../middleware/auth");

// --- public ---
router.post("/auth/request-otp", auth.requestOtp);
router.post("/auth/verify-otp", auth.verifyOtp);
router.post("/auth/complete-profile", auth.completeProfile);
router.post("/auth/refresh", auth.refresh);
router.post("/auth/logout", auth.logout);
router.get("/services", services.list);
router.get("/services/:id/reviews", services.reviews);
router.get("/services/:id", services.get);
router.get("/categories", categories.list);
router.post("/coupons/validate", (req, res) => {
  const result = couponService.validate(req.body.code);
  res.json(result);
});
router.get("/surge", async (req, res) => {
  const { lat, lng } = req.query;
  if (!lat || !lng) return res.status(400).json({ error: "lat_lng_required" });
  const multiplier = await surgeService.getMultiplier(parseFloat(lat), parseFloat(lng));
  res.json({ multiplier });
});

// --- authenticated ---
router.get("/me", requireAuth(), auth.me);
router.patch("/me/profile", requireAuth("customer"), customer.updateProfile);
router.post("/me/push-token", requireAuth(), auth.updatePushToken);
router.post("/me/addresses", requireAuth("customer"), customer.addAddress);
router.patch("/me/addresses/:addressId", requireAuth("customer"), customer.updateAddress);
router.delete("/me/addresses/:addressId", requireAuth("customer"), customer.deleteAddress);
router.post("/me/addresses/:addressId/default", requireAuth("customer"), customer.setDefaultAddress);

// --- customer bookings ---
router.post("/bookings", requireAuth("customer"), bookings.create);
router.get("/bookings", requireAuth(), bookings.list);
router.get("/bookings/:id", requireAuth(), bookings.get);
router.post("/bookings/:id/cancel", requireAuth("customer"), bookings.cancel);
router.post("/bookings/:id/add-on", requireAuth("customer"), bookings.addAddOn);
router.post("/bookings/:id/payment", requireAuth("customer"), bookings.confirmPayment);
router.post("/bookings/:id/rate", requireAuth("customer"), bookings.rate);

// --- expert actions ---
router.get("/expert/me", requireAuth("expert"), experts.me);
router.patch("/expert/me", requireAuth("expert"), experts.updateProfile);
router.post("/expert/online", requireAuth("expert"), experts.goOnline);
router.post("/expert/offline", requireAuth("expert"), experts.goOffline);
router.get("/expert/dashboard", requireAuth("expert"), experts.dashboard);
router.get("/expert/earnings", requireAuth("expert"), experts.earnings);
router.get("/expert/pending-offer", requireAuth("expert"), experts.pendingOffer);
router.post("/expert/offer/respond", requireAuth("expert"), experts.respondOffer);
router.post("/expert/kyc", requireAuth("expert"), experts.submitKyc);
router.post("/expert/training", requireAuth("expert"), experts.updateTraining);
router.post("/bookings/:id/arrived", requireAuth("expert"), bookings.expertArrived);
router.post("/bookings/:id/start", requireAuth("expert"), bookings.expertStart);
router.post("/bookings/:id/complete", requireAuth("expert"), bookings.expertComplete);

// --- admin ---
router.post("/admin/login", admin.login);
router.get("/admin/bookings", requireAuth("admin"), admin.listBookings);
router.get("/admin/reviews", requireAuth("admin"), admin.listReviews);
router.post("/admin/services", requireAuth("admin"), services.create);
router.patch("/admin/services/:id", requireAuth("admin"), services.update);
router.delete("/admin/services/:id", requireAuth("admin"), services.remove);
router.get("/admin/experts", requireAuth("admin"), admin.listExperts);

module.exports = router;
