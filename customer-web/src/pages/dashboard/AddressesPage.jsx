import { useState } from "react";
import { MapPin, Plus, Star, Trash2 } from "lucide-react";
import { useAuth } from "../../context/AuthContext";
import { userService } from "../../services/userService";
import { authService } from "../../services/authService";
import { useToast } from "../../context/ToastContext";
import { friendlyError, toastMessages } from "../../lib/messages";
import { SlideOver } from "../../components/dashboard/SlideOver";
import { LocationCapture } from "../../components/address/LocationCapture";
import { Button } from "../../components/ui/Button";
import { TextField } from "../../components/ui/TextField";

const emptyForm = {
  label: "Home",
  line1: "",
  line2: "",
  city: "",
  pincode: "",
  lat: null,
  lng: null,
};

function hasCoords(a) {
  return typeof a?.lat === "number" && typeof a?.lng === "number";
}

export function AddressesPage() {
  const { user, updateUser } = useAuth();
  const toast = useToast();
  const [slideOpen, setSlideOpen] = useState(false);
  const [loading, setLoading] = useState(false);
  const [form, setForm] = useState(emptyForm);

  const addresses = user?.addresses || [];

  async function refresh() {
    const { principal } = await authService.me();
    updateUser(principal);
  }

  function openAdd() {
    setForm(emptyForm);
    setSlideOpen(true);
  }

  async function save() {
    if (!form.line1.trim()) {
      return toast.error("Please enter your street address.");
    }
    if (!hasCoords(form)) {
      return toast.error(friendlyError("location_required"));
    }
    setLoading(true);
    try {
      await userService.addAddress(form);
      await refresh();
      setSlideOpen(false);
      toast.success(toastMessages.addressSaved);
    } catch (e) {
      toast.error(friendlyError(e.message));
    } finally {
      setLoading(false);
    }
  }

  async function remove(id) {
    if (!confirm("Remove this address?")) return;
    try {
      await userService.deleteAddress(id);
      await refresh();
      toast.success(toastMessages.addressDeleted);
    } catch (e) {
      toast.error(friendlyError(e.message));
    }
  }

  async function setDefault(id) {
    try {
      await userService.setDefaultAddress(id);
      await refresh();
      toast.success("Default address updated.");
    } catch (e) {
      toast.error(friendlyError(e.message));
    }
  }

  return (
    <div>
      <p className="mb-4 hidden text-sm text-sub lg:block">
        Saved locations for at-home wellness sessions. GPS is required for each address.
      </p>
      <Button variant="accent" className="w-full lg:w-auto" onClick={openAdd}>
        <Plus size={16} /> Add new address
      </Button>

      {addresses.length === 0 ? (
        <div className="mt-6 rounded-2xl border border-dashed border-border bg-white px-6 py-14 text-center">
          <MapPin className="mx-auto text-muted" size={32} />
          <p className="mt-4 font-semibold text-ink">No saved addresses</p>
          <p className="mt-2 text-sm text-sub">Add an address for home sessions.</p>
          <Button variant="secondary" className="mt-6" onClick={openAdd}>
            Add address
          </Button>
        </div>
      ) : (
        <ul className="mt-6 space-y-3 lg:grid lg:grid-cols-2 lg:gap-4 lg:space-y-0">
          {addresses.map((a) => (
            <li
              key={a.id}
              className={`rounded-2xl border bg-white p-4 shadow-sm ${
                hasCoords(a) ? "border-border" : "border-amber-300/80"
              }`}
            >
              <div className="flex items-start justify-between gap-3">
                <div className="flex min-w-0 gap-3">
                  <MapPin className="mt-0.5 shrink-0 text-accent" size={20} />
                  <div>
                    <p className="font-semibold text-ink">
                      {a.label}
                      {a.isDefault && (
                        <span className="ml-2 text-xs font-medium text-accent">Default</span>
                      )}
                    </p>
                    <p className="mt-1 text-sm leading-relaxed text-sub">
                      {[a.line1, a.line2, a.city, a.pincode].filter(Boolean).join(", ")}
                    </p>
                    {!hasCoords(a) && (
                      <p className="mt-2 text-xs text-amber-700">
                        Missing location — add a new address with GPS enabled.
                      </p>
                    )}
                  </div>
                </div>
                <div className="flex shrink-0 gap-1">
                  {!a.isDefault && (
                    <button
                      type="button"
                      onClick={() => setDefault(a.id)}
                      className="grid size-10 place-items-center rounded-full text-muted hover:bg-surface"
                      title="Set default"
                    >
                      <Star size={18} />
                    </button>
                  )}
                  <button
                    type="button"
                    onClick={() => remove(a.id)}
                    className="grid size-10 place-items-center rounded-full text-muted hover:bg-red-50 hover:text-red-600"
                    title="Remove"
                  >
                    <Trash2 size={18} />
                  </button>
                </div>
              </div>
            </li>
          ))}
        </ul>
      )}

      <SlideOver open={slideOpen} title="Add address" onClose={() => setSlideOpen(false)}>
        <div className="space-y-4">
          <LocationCapture
            autoCapture
            onCoords={(c) => setForm((f) => ({ ...f, lat: c.lat, lng: c.lng }))}
          />
          <TextField
            label="Label (e.g. Home)"
            value={form.label}
            onChange={(e) => setForm({ ...form, label: e.target.value })}
          />
          <TextField
            label="Street address"
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
          <Button variant="accent" onClick={save} disabled={loading} className="w-full">
            Save address
          </Button>
        </div>
      </SlideOver>
    </div>
  );
}
