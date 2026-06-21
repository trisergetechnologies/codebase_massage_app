import { LogOut, Mail, Phone, User } from "lucide-react";
import { useNavigate } from "react-router-dom";
import { useAuth } from "../../context/AuthContext";

export function ProfilePage() {
  const { user, logout } = useAuth();
  const navigate = useNavigate();

  function signOut() {
    logout();
    navigate("/");
  }

  return (
    <div className="space-y-4 lg:mx-auto lg:max-w-lg">
      <div className="rounded-2xl border border-border bg-white p-6 text-center shadow-sm lg:p-8">
        <span className="mx-auto grid size-16 place-items-center rounded-full bg-accent-soft text-accent lg:size-20">
          <User className="size-7 lg:size-9" />
        </span>
        <p className="mt-4 text-xl font-semibold text-ink lg:text-2xl">{user?.name || "—"}</p>
        <p className="mt-2 text-sm text-sub">{user?.email || "No email added"}</p>
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
