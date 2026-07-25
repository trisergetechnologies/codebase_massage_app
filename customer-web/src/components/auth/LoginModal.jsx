import { useEffect, useState } from "react";
import { ArrowRight, Phone, X } from "lucide-react";
import { useNavigate } from "react-router-dom";
import { useAuth } from "../../context/AuthContext";
import { useAuthModal } from "../../context/AuthModalContext";
import { authService } from "../../services/authService";
import { normalizePhone } from "../../services/apiClient";
import { friendlyError } from "../../lib/messages";
import { setPendingBooking } from "../../lib/cartStorage";
import { Button } from "../ui/Button";
import { TextField } from "../ui/TextField";
import { Portal } from "../ui/Portal";

const GENDERS = [
  { value: "male", label: "Male" },
  { value: "female", label: "Female" },
  { value: "other", label: "Other" },
  { value: "prefer_not_to_say", label: "Prefer not to say" },
];

export function LoginModal() {
  const navigate = useNavigate();
  const { login } = useAuth();
  const { open, options, closeLogin } = useAuthModal();

  const [step, setStep] = useState("phone");
  const [phone, setPhone] = useState("");
  const [code, setCode] = useState("");
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState("");
  const [devHint, setDevHint] = useState("");
  const [registrationToken, setRegistrationToken] = useState(null);

  const [name, setName] = useState("");
  const [gender, setGender] = useState("");
  const [dateOfBirth, setDateOfBirth] = useState("");

  useEffect(() => {
    if (!open) {
      setStep("phone");
      setPhone("");
      setCode("");
      setError("");
      setDevHint("");
      setRegistrationToken(null);
      setName("");
      setGender("");
      setDateOfBirth("");
    }
  }, [open]);

  useEffect(() => {
    if (!open) return;
    const prev = document.body.style.overflow;
    document.body.style.overflow = "hidden";
    return () => {
      document.body.style.overflow = prev;
    };
  }, [open]);

  function finishAuth() {
    const { intent, from } = options;
    closeLogin();

    if (intent === "booking") {
      setPendingBooking();
      navigate("/services", { state: { openBooking: true }, replace: true });
      return;
    }
    if (from && from !== "/login") {
      navigate(from, { replace: true });
      return;
    }
    navigate("/services", { replace: true });
  }

  async function sendOtp(e) {
    e?.preventDefault();
    const normalized = normalizePhone(phone);
    if (normalized.replace(/\D/g, "").length < 12) {
      setError("Enter a valid 10-digit mobile number.");
      return;
    }
    setError("");
    setLoading(true);
    try {
      const res = await authService.requestOtp(normalized);
      setPhone(normalized);
      setStep("otp");
      setDevHint(res.devCode ? `Dev: any 6 digits` : "");
    } catch (err) {
      setError(friendlyError(err.message));
    } finally {
      setLoading(false);
    }
  }

  async function verifyOtp(e) {
    e?.preventDefault();
    if (code.replace(/\D/g, "").length !== 6) {
      setError("Enter the 6-digit code.");
      return;
    }
    setError("");
    setLoading(true);
    try {
      const res = await authService.verifyOtp(phone, code);
      if (res.needsProfile) {
        setRegistrationToken(res.registrationToken);
        setStep("profile");
        return;
      }
      login(res.token, res.principal);
      finishAuth();
    } catch (err) {
      setError(friendlyError(err.message));
    } finally {
      setLoading(false);
    }
  }

  async function completeProfile(e) {
    e?.preventDefault();
    if (!name.trim()) return setError("Please enter your name.");
    if (!gender) return setError("Please select gender.");
    if (!dateOfBirth) return setError("Please enter your date of birth.");
    setError("");
    setLoading(true);
    try {
      const res = await authService.completeProfile({
        registrationToken,
        name: name.trim(),
        gender,
        dateOfBirth,
      });
      login(res.token, res.principal);
      finishAuth();
    } catch (err) {
      setError(friendlyError(err.message));
    } finally {
      setLoading(false);
    }
  }

  if (!open) return null;

  const titles = {
    phone: "Sign in",
    otp: "Enter code",
    profile: "Quick setup",
  };

  const subtitles = {
    phone: "We'll text you a one-time code. Your cart stays saved.",
    otp: `Sent to ${phone}. ${devHint || "Any 6 digits in dev."}`,
    profile: "Just the basics — address comes when you book.",
  };

  return (
    <Portal>
      <button
        type="button"
        className="fixed inset-0 z-[210] bg-forest/40 backdrop-blur-sm"
        aria-label="Close sign in"
        onClick={closeLogin}
      />
      <div
        className="fixed inset-0 z-[220] flex items-end justify-center p-0 sm:items-center sm:p-4 pointer-events-none"
        role="dialog"
        aria-modal="true"
        aria-labelledby="login-modal-title"
      >
        <div
          className="pointer-events-auto flex max-h-[min(92dvh,100%)] w-full flex-col overflow-hidden rounded-t-3xl border border-border/60 border-b-0 bg-white shadow-premium-lg sm:max-h-[90dvh] sm:max-w-[420px] sm:rounded-3xl sm:border-b"
          style={{ paddingBottom: "max(1rem, env(safe-area-inset-bottom))" }}
        >
          <div className="shrink-0 overflow-y-auto overscroll-contain p-5 sm:p-7">
            <div className="mb-5 flex items-start justify-between gap-3 sm:mb-6 sm:gap-4">
              <div className="min-w-0">
                <p className="text-xs font-semibold uppercase tracking-wider text-accent">
                  Relief, Delivered
                </p>
                <h2 id="login-modal-title" className="mt-1 text-xl font-semibold text-ink">
                  {titles[step]}
                </h2>
                <p className="mt-1.5 text-sm leading-relaxed text-sub">{subtitles[step]}</p>
              </div>
              <button
                type="button"
                onClick={closeLogin}
                className="grid size-9 shrink-0 place-items-center rounded-full bg-ink/5 text-muted hover:bg-ink/10 hover:text-ink"
                aria-label="Close"
              >
                <X size={18} />
              </button>
            </div>

            {step === "profile" ? (
              <form className="space-y-4" onSubmit={completeProfile}>
                <TextField
                  label="Full name"
                  value={name}
                  onChange={(e) => setName(e.target.value)}
                  placeholder="Your name"
                />
                <div>
                  <span className="mb-2 block text-sm font-medium text-sub">Gender</span>
                  <div className="grid grid-cols-2 gap-2">
                    {GENDERS.map((g) => (
                      <button
                        key={g.value}
                        type="button"
                        onClick={() => setGender(g.value)}
                        className={`min-h-10 rounded-lg border px-2 text-xs font-medium sm:text-sm ${
                          gender === g.value
                            ? "border-accent bg-accent/10 text-accent"
                            : "border-border/80 bg-white/50 text-sub"
                        }`}
                      >
                        {g.label}
                      </button>
                    ))}
                  </div>
                </div>
                <TextField
                  label="Date of birth"
                  type="date"
                  value={dateOfBirth}
                  onChange={(e) => setDateOfBirth(e.target.value)}
                  max={new Date().toISOString().slice(0, 10)}
                />
                {error && <p className="text-sm text-red-600">{error}</p>}
                <Button variant="accent" type="submit" className="w-full min-h-12" disabled={loading}>
                  {loading ? "Saving…" : "Continue"}
                </Button>
              </form>
            ) : (
              <form className="space-y-4" onSubmit={step === "phone" ? sendOtp : verifyOtp}>
                {step === "phone" ? (
                  <TextField
                    label="Mobile number"
                    value={phone}
                    onChange={(e) => setPhone(e.target.value)}
                    placeholder="99999 99999"
                    inputMode="tel"
                    left={
                      <span className="inline-flex h-10 shrink-0 items-center gap-1.5 rounded-lg border border-border/60 bg-white/60 px-2 text-sm font-semibold text-sub sm:px-3">
                        <Phone size={15} className="text-accent" />
                        +91
                      </span>
                    }
                  />
                ) : (
                  <>
                    <TextField
                      label="6-digit OTP"
                      value={code}
                      onChange={(e) => setCode(e.target.value.replace(/\D/g, "").slice(0, 6))}
                      placeholder="000000"
                      inputMode="numeric"
                      maxLength={6}
                      inputClassName="tracking-[0.35em] text-center text-lg"
                    />
                    <button
                      type="button"
                      className="text-sm font-medium text-accent hover:text-[#0d6b63]"
                      onClick={() => {
                        setStep("phone");
                        setCode("");
                        setError("");
                      }}
                    >
                      Change number
                    </button>
                  </>
                )}
                {error && <p className="text-sm text-red-600">{error}</p>}
                <Button variant="accent" type="submit" className="w-full min-h-12" disabled={loading}>
                  {loading ? "Please wait…" : step === "phone" ? "Send code" : "Verify & sign in"}
                  <ArrowRight size={16} />
                </Button>
              </form>
            )}
          </div>
        </div>
      </div>
    </Portal>
  );
}
