import { useEffect, useState } from "react";
import { MapPin, X } from "lucide-react";
import { useAuth } from "../../context/AuthContext";
import { useToast } from "../../context/ToastContext";
import { userService } from "../../services/userService";
import { bookingService, couponService } from "../../services/bookingService";
import { authService } from "../../services/authService";
import { friendlyError, toastMessages } from "../../lib/messages";
import { LocationCapture } from "../address/LocationCapture";
import { Button } from "../ui/Button";
import { TextField } from "../ui/TextField";

function hasCoords(a) {
  return typeof a?.lat === "number" && typeof a?.lng === "number";
}

export function AddressBookingModal({ open, serviceIds, serviceCount = 0, orderTotal = null, onClose, onBooked }) {
  const { user, updateUser } = useAuth();
  const toast = useToast();
  const [selectedId, setSelectedId] = useState("");
  const [showForm, setShowForm] = useState(false);
  const [loading, setLoading] = useState(false);
  const [bookNow, setBookNow] = useState(true);
  const [scheduledAt, setScheduledAt] = useState("");
  const [couponCode, setCouponCode] = useState("");
  const [couponDiscount, setCouponDiscount] = useState(0);
  const [form, setForm] = useState({
    label: "Home",
    line1: "",
    line2: "",
    city: "",
    pincode: "",
    lat: null,
    lng: null,
  });

  const addresses = (user?.addresses || []).filter(hasCoords);
  const allAddresses = user?.addresses || [];

  useEffect(() => {
    if (!open) return;
    const def = addresses.find((a) => a.isDefault) || addresses[0];
    setSelectedId(def?.id || "");
    setShowForm(addresses.length === 0);
  }, [open, addresses]);

  async function saveAddress() {
    if (!form.line1.trim()) return toast.error("Please enter your street address.");
    if (!hasCoords(form)) {
      return toast.error(friendlyError("location_required"));
    }
    setLoading(true);
    try {
      await userService.addAddress(form);
      const { principal } = await authService.me();
      updateUser(principal);
      const list = (principal?.addresses || []).filter(hasCoords);
      const newest = list[list.length - 1];
      setSelectedId(newest?.id || "");
      setShowForm(false);
      toast.success(toastMessages.addressSaved);
    } catch (e) {
      toast.error(friendlyError(e.message));
    } finally {
      setLoading(false);
    }
  }

  async function applyCoupon() {
    if (!couponCode.trim()) return;
    try {
      const res = await couponService.validate(couponCode.trim());
      if (res.valid) {
        setCouponDiscount(res.discount);
        toast.success(`Coupon applied — ₹${res.discount} off`);
      } else {
        setCouponDiscount(0);
        toast.error("Invalid coupon code");
      }
    } catch (e) {
      toast.error(friendlyError(e.message));
    }
  }

  async function confirmBooking() {
    const addr = addresses.find((a) => a.id === selectedId);
    if (!addr?.lat || !addr?.lng) {
      return toast.error(friendlyError("location_required"));
    }
    const loadId = toast.loading(toastMessages.findingExperts);
    setLoading(true);
    try {
      const options = { couponCode: couponDiscount ? couponCode.trim() : "" };
      if (!bookNow && scheduledAt) {
        options.scheduledFor = new Date(scheduledAt).toISOString();
      }
      const booking = await bookingService.create(serviceIds, {
        lat: addr.lat,
        lng: addr.lng,
        address: [addr.line1, addr.line2, addr.city, addr.pincode].filter(Boolean).join(", "),
      }, options);
      toast.dismiss(loadId);
      toast.success(toastMessages.bookingConfirmed);
      onBooked?.(booking);
      onClose?.();
    } catch (e) {
      if (loadId) toast.dismiss(loadId);
      toast.error(friendlyError(e.message));
    } finally {
      setLoading(false);
    }
  }

  if (!open) return null;

  return (
    <div className="fixed inset-0 z-[110] flex items-end justify-center bg-ink/55 backdrop-blur-[2px] p-0 sm:items-center sm:p-4">
      <div
        className="flex max-h-[min(92dvh,100%)] w-full max-w-lg flex-col overflow-hidden rounded-t-2xl bg-white shadow-lg sm:max-h-[90vh] sm:rounded-2xl"
        style={{ paddingBottom: "env(safe-area-inset-bottom)" }}
      >
        <div className="flex items-center justify-between border-b border-border px-6 py-4">
          <h2 className="text-xl font-semibold text-ink">Select address</h2>
          <button type="button" onClick={onClose} className="text-muted">
            <X size={20} />
          </button>
        </div>

        <div className="max-h-[70vh] overflow-y-auto px-6 py-6">
          {allAddresses.length > addresses.length && !showForm && (
            <p className="mb-4 rounded-lg bg-amber-50 px-3 py-2 text-xs text-amber-800">
              Some saved addresses are missing GPS. Add a new address with location enabled.
            </p>
          )}

          {!showForm && addresses.length > 0 && (
            <ul className="space-y-3">
              {addresses.map((a) => (
                <li key={a.id}>
                  <button
                    type="button"
                    onClick={() => setSelectedId(a.id)}
                    disabled={!hasCoords(a)}
                    className={`w-full rounded-xl border p-4 text-left transition ${
                      selectedId === a.id
                        ? "border-accent bg-accent-soft"
                        : "border-border hover:border-accent/30"
                    } ${!hasCoords(a) ? "opacity-50" : ""}`}
                  >
                    <p className="font-semibold text-ink">
                      {a.label}
                      {a.isDefault ? (
                        <span className="ml-2 text-xs font-medium text-accent">Default</span>
                      ) : null}
                    </p>
                    <p className="mt-1 text-sm text-sub">
                      {[a.line1, a.city, a.pincode].filter(Boolean).join(", ")}
                    </p>
                  </button>
                </li>
              ))}
            </ul>
          )}

          {showForm && (
            <div className="space-y-4">
              <LocationCapture
                autoCapture
                onCoords={(c) => setForm((f) => ({ ...f, lat: c.lat, lng: c.lng }))}
              />
              <TextField
                label="Label"
                value={form.label}
                onChange={(e) => setForm({ ...form, label: e.target.value })}
              />
              <TextField
                label="Address line"
                value={form.line1}
                onChange={(e) => setForm({ ...form, line1: e.target.value })}
              />
              <TextField
                label="City"
                value={form.city}
                onChange={(e) => setForm({ ...form, city: e.target.value })}
              />
              <TextField
                label="Pincode"
                value={form.pincode}
                onChange={(e) => setForm({ ...form, pincode: e.target.value })}
              />
              <Button variant="accent" onClick={saveAddress} disabled={loading}>
                Save address
              </Button>
            </div>
          )}

          {!showForm && addresses.length > 0 && (
            <div className="mt-6 space-y-4 border-t border-border pt-4">
              <p className="text-sm font-medium text-ink">When</p>
              <div className="flex gap-2">
                <button
                  type="button"
                  onClick={() => setBookNow(true)}
                  className={`flex-1 rounded-xl border px-3 py-2 text-sm font-medium ${
                    bookNow ? "border-accent bg-accent-soft text-accent" : "border-border text-sub"
                  }`}
                >
                  Book now
                </button>
                <button
                  type="button"
                  onClick={() => setBookNow(false)}
                  className={`flex-1 rounded-xl border px-3 py-2 text-sm font-medium ${
                    !bookNow ? "border-accent bg-accent-soft text-accent" : "border-border text-sub"
                  }`}
                >
                  Schedule
                </button>
              </div>
              {!bookNow && (
                <input
                  type="datetime-local"
                  value={scheduledAt}
                  onChange={(e) => setScheduledAt(e.target.value)}
                  min={new Date().toISOString().slice(0, 16)}
                  className="w-full rounded-xl border border-border px-3 py-2 text-sm text-ink"
                />
              )}
              <div>
                <p className="text-sm font-medium text-ink">Coupon</p>
                <div className="mt-2 flex gap-2">
                  <input
                    type="text"
                    value={couponCode}
                    onChange={(e) => setCouponCode(e.target.value.toUpperCase())}
                    placeholder="e.g. WELCOME10"
                    className="flex-1 rounded-xl border border-border px-3 py-2 text-sm uppercase"
                  />
                  <Button variant="secondary" onClick={applyCoupon} type="button">
                    Apply
                  </Button>
                </div>
                {couponDiscount > 0 && (
                  <p className="mt-1 text-xs text-accent">₹{couponDiscount} discount will apply</p>
                )}
              </div>
            </div>
          )}

          {!showForm && (
            <button
              type="button"
              className="mt-4 text-sm font-medium text-accent"
              onClick={() => {
                setForm({
                  label: "Home",
                  line1: "",
                  line2: "",
                  city: "",
                  pincode: "",
                  lat: null,
                  lng: null,
                });
                setShowForm(true);
              }}
            >
              + Add new address
            </button>
          )}

        {!showForm && addresses.length > 0 && (
          <div className="mt-8 space-y-3">
            {serviceCount > 0 && orderTotal != null ? (
              <div className="rounded-xl border border-border bg-surface px-4 py-3">
                <p className="text-sm text-sub">
                  {serviceCount} service{serviceCount !== 1 ? "s" : ""} selected
                </p>
                <p className="mt-1 text-lg font-semibold text-ink">
                  Total ₹{Number(orderTotal).toLocaleString("en-IN")}
                </p>
              </div>
            ) : null}
          </div>
        )}
        </div>

        {!showForm && addresses.length > 0 && (
          <div className="border-t border-border px-6 py-4">
            <Button
              variant="accent"
              className="w-full min-h-14"
              onClick={confirmBooking}
              disabled={loading || !selectedId}
            >
              Confirm &amp; find expert
            </Button>
          </div>
        )}
      </div>
    </div>
  );
}
