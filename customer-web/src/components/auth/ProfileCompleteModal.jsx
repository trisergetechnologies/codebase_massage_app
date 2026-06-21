import { useState } from "react";
import { Button } from "../ui/Button";
import { TextField } from "../ui/TextField";

const GENDERS = [
  { value: "male", label: "Male" },
  { value: "female", label: "Female" },
  { value: "other", label: "Other" },
  { value: "prefer_not_to_say", label: "Prefer not to say" },
];

export function ProfileCompleteModal({ open, onSubmit, loading, error }) {
  const [name, setName] = useState("");
  const [gender, setGender] = useState("");
  const [dateOfBirth, setDateOfBirth] = useState("");
  const [localError, setLocalError] = useState("");

  if (!open) return null;

  function handleSubmit(e) {
    e.preventDefault();
    if (!name.trim()) return setLocalError("Please enter your name.");
    if (!gender) return setLocalError("Please select gender.");
    if (!dateOfBirth) return setLocalError("Please enter your date of birth.");
    setLocalError("");
    onSubmit({ name: name.trim(), gender, dateOfBirth });
  }

  const displayError = localError || error;

  return (
    <div
      className="fixed inset-0 z-[100] flex items-end justify-center bg-ink/40 p-4 sm:items-center"
      role="dialog"
      aria-modal="true"
      aria-labelledby="profile-modal-title"
    >
      <div className="w-full max-w-lg rounded-2xl border border-border bg-white shadow-lg animate-fade-up">
        <div className="flex items-center justify-between border-b border-border px-6 py-4">
          <div>
            <p className="text-sm font-semibold text-accent">Almost there</p>
            <h2 id="profile-modal-title" className="text-xl font-semibold text-ink">
              Complete your profile
            </h2>
          </div>
        </div>

        <form onSubmit={handleSubmit} className="space-y-5 px-6 py-6">
          <p className="text-[15px] leading-7 text-sub">
            A few details help us personalize your experience. We&apos;ll ask for your address when
            you book.
          </p>

          <TextField
            label="Full name"
            value={name}
            onChange={(e) => setName(e.target.value)}
            placeholder="Your name"
            autoComplete="name"
          />

          <div>
            <span className="mb-2 block text-sm font-medium text-sub">Gender</span>
            <div className="grid grid-cols-2 gap-2">
              {GENDERS.map((g) => (
                <button
                  key={g.value}
                  type="button"
                  onClick={() => setGender(g.value)}
                  className={`min-h-12 rounded-xl border px-3 text-sm font-medium transition ${
                    gender === g.value
                      ? "border-accent bg-accent-soft text-accent"
                      : "border-border bg-surface text-sub hover:border-accent/40"
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

          {displayError ? (
            <p className="rounded-lg bg-red-50 px-4 py-3 text-sm text-red-700">{displayError}</p>
          ) : null}

          <Button variant="accent" type="submit" className="w-full min-h-14" disabled={loading}>
            {loading ? "Saving…" : "Continue"}
          </Button>
        </form>
      </div>
    </div>
  );
}
