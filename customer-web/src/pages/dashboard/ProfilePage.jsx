import { useState } from "react";
import { LogOut, Mail, Phone, User } from "lucide-react";
import { useNavigate } from "react-router-dom";
import { useAuth } from "../../context/AuthContext";
import { userService } from "../../services/userService";
import { authService } from "../../services/authService";
import { useToast } from "../../context/ToastContext";
import { friendlyError } from "../../lib/messages";
import { Button } from "../../components/ui/Button";
import { TextField } from "../../components/ui/TextField";

export function ProfilePage() {
  const { user, updateUser, logout } = useAuth();
  const navigate = useNavigate();
  const toast = useToast();
  const [editing, setEditing] = useState(false);
  const [loading, setLoading] = useState(false);
  const [form, setForm] = useState({
    name: user?.name || "",
    email: user?.email || "",
  });

  function signOut() {
    logout();
    navigate("/");
  }

  async function saveProfile() {
    if (!form.name.trim()) return toast.error("Name is required");
    setLoading(true);
    try {
      const { principal } = await userService.updateProfile({
        name: form.name.trim(),
        email: form.email.trim(),
      });
      updateUser(principal);
      setEditing(false);
      toast.success("Profile updated");
    } catch (e) {
      toast.error(friendlyError(e.message));
    } finally {
      setLoading(false);
    }
  }

  return (
    <div className="space-y-4 lg:mx-auto lg:max-w-lg">
      <div className="rounded-2xl border border-border bg-white p-6 text-center shadow-sm lg:p-8">
        <span className="mx-auto grid size-16 place-items-center rounded-full bg-accent-soft text-accent lg:size-20">
          <User className="size-7 lg:size-9" />
        </span>
        {!editing ? (
          <>
            <p className="mt-4 text-xl font-semibold text-ink lg:text-2xl">{user?.name || "—"}</p>
            <p className="mt-2 text-sm text-sub">{user?.email || "No email added"}</p>
            <Button
              variant="secondary"
              className="mt-4 w-full"
              onClick={() => {
                setForm({ name: user?.name || "", email: user?.email || "" });
                setEditing(true);
              }}
            >
              Edit profile
            </Button>
          </>
        ) : (
          <div className="mt-4 space-y-3 text-left">
            <TextField
              label="Name"
              value={form.name}
              onChange={(e) => setForm((f) => ({ ...f, name: e.target.value }))}
            />
            <TextField
              label="Email"
              type="email"
              value={form.email}
              onChange={(e) => setForm((f) => ({ ...f, email: e.target.value }))}
            />
            <div className="flex gap-2 pt-2">
              <Button variant="primary" className="flex-1" onClick={saveProfile} disabled={loading}>
                Save
              </Button>
              <Button variant="ghost" className="flex-1" onClick={() => setEditing(false)}>
                Cancel
              </Button>
            </div>
          </div>
        )}
      </div>

      <div className="hidden space-y-3 lg:block">
        <div className="rounded-xl border border-border bg-surface/80 px-4 py-3">
          <div className="flex items-center gap-3 text-sm text-ink">
            <Phone size={18} className="text-accent" />
            <span>{user?.phone || "—"}</span>
          </div>
        </div>
        {user?.email && (
          <div className="rounded-xl border border-border bg-surface/80 px-4 py-3">
            <div className="flex items-center gap-3 text-sm text-ink">
              <Mail size={18} className="text-accent" />
              <span>{user.email}</span>
            </div>
          </div>
        )}
        <button
          type="button"
          onClick={signOut}
          className="flex w-full items-center justify-center gap-2 rounded-xl border border-border bg-white py-3 text-sm font-medium text-sub hover:text-ink"
        >
          <LogOut size={18} />
          Sign out
        </button>
      </div>

      <button
        type="button"
        onClick={signOut}
        className="flex w-full items-center justify-center gap-2 rounded-2xl border border-border bg-white py-3.5 text-sm font-medium text-sub hover:text-ink lg:hidden"
      >
        <LogOut size={18} />
        Sign out
      </button>
    </div>
  );
}
